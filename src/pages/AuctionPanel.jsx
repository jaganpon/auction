import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import Navbar from "../components/Navbar";
import { API_URL } from "../config/api";

const AuctionPanel = () => {
  const { tournamentId } = useParams();
  const { token } = useAuth();

  // State
  const [tournament, setTournament] = useState(null);
  const [allPlayers, setAllPlayers] = useState([]);
  const [originalPlayers, setOriginalPlayers] = useState([]); // Keep original order
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [auctionComplete, setAuctionComplete] = useState(false);
  const [stats, setStats] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [expandedTeam, setExpandedTeam] = useState(null);

  // Fixed player types - always show these buttons
  const FIXED_PLAYER_TYPES = [
    "all",
    "Batsman",
    "Bowler",
    "All-Rounder",
    "Wicket-Keeper",
  ];

  useEffect(() => {
    fetchData();
  }, [tournamentId]);

  // Debug: Log player types
  useEffect(() => {
    if (allPlayers.length > 0) {
      const types = [...new Set(allPlayers.map((p) => p.type))];
      console.log("Available player types:", types);
      console.log("Total unassigned players:", allPlayers.length);
    }
  }, [allPlayers]);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [tournamentRes, playersRes, statusRes] = await Promise.all([
        axios.get(`${API_URL}/tournaments/${tournamentId}`, { headers }),
        axios.get(`${API_URL}/tournaments/${tournamentId}/players`, {
          headers,
        }),
        axios.get(`${API_URL}/tournaments/${tournamentId}/auction/status`, {
          headers,
        }),
      ]);

      setTournament(tournamentRes.data);
      setStats(statusRes.data);

      const unassignedPlayers = playersRes.data.filter(
        (p) => !p.is_assigned || p.is_assigned === 0
      );

      if (unassignedPlayers.length === 0) {
        setAuctionComplete(true);
      } else {
        setAllPlayers(unassignedPlayers);
        setOriginalPlayers([...unassignedPlayers]); // Keep original copy
        if (currentPlayerIndex >= unassignedPlayers.length) {
          setCurrentPlayerIndex(0);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const refreshTeamsOnly = async () => {
    setRefreshing(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const tournamentRes = await axios.get(
        `${API_URL}/tournaments/${tournamentId}`,
        { headers }
      );
      setTournament(tournamentRes.data);
    } catch (error) {
      console.error("Error refreshing teams:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Filtered players based on selected type
  const filteredPlayers = useMemo(() => {
    if (filterType === "all") return allPlayers;
    return allPlayers.filter(
      (p) => p.type.toLowerCase() === filterType.toLowerCase()
    );
  }, [allPlayers, filterType]);

  const currentPlayer = filteredPlayers[currentPlayerIndex];

  const handleShuffle = () => {
    const shuffled = [...allPlayers];

    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setAllPlayers(shuffled);
    setCurrentPlayerIndex(0);
  };

  const handleReset = () => {
    setAllPlayers([...originalPlayers]);
    setFilterType("all");
    setCurrentPlayerIndex(0);
  };

  const handleAssignPlayer = async () => {
    if (!selectedTeam || !bidAmount || !currentPlayer) {
      alert("Please select a team and enter bid amount");
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid bid amount");
      return;
    }

    setAssigning(true);

    try {
      await axios.post(
        `${API_URL}/auction/assign`,
        {
          tournament_id: parseInt(tournamentId),
          team_id: parseInt(selectedTeam),
          emp_id: currentPlayer.emp_id,
          bid_amount: amount,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Move to next player
      setBidAmount("");
      setSelectedTeam("");
      setExpandedTeam(null);

      // Refresh teams immediately to show updated budgets
      await refreshTeamsOnly();

      // Remove assigned player from list
      const updatedPlayers = allPlayers.filter(
        (p) => p.emp_id !== currentPlayer.emp_id
      );
      setAllPlayers(updatedPlayers);
      setOriginalPlayers(updatedPlayers);

      if (
        currentPlayerIndex >= updatedPlayers.length &&
        currentPlayerIndex > 0
      ) {
        setCurrentPlayerIndex(currentPlayerIndex - 1);
      }

      // Check if auction is complete
      if (updatedPlayers.length === 0) {
        await fetchData();
      }
    } catch (error) {
      console.error("Error assigning player:", error);
      alert(error.response?.data?.detail || "Failed to assign player");
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading auction...</p>
        </div>
      </div>
    );
  }

  if (auctionComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-green-600 mb-4">
              Auction Complete!
            </h1>
            <p className="text-gray-600 mb-6">
              All {stats?.total_players} players have been assigned to teams.
            </p>
            <button
              onClick={() =>
                (window.location.href = `/tournament/${tournamentId}`)
              }
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              View Tournament Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPlayer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              No Players Available
            </h1>
            <p className="text-gray-600 mb-4">
              No unassigned players found with the current filter:{" "}
              <strong>{filterType}</strong>
            </p>
            <button
              onClick={() => setFilterType("all")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Show All Players
            </button>
          </div>
        </div>
      </div>
    );
  }

  const playerImageUrl = currentPlayer.image_filename
    ? `${API_URL.replace("/api", "")}/images/${currentPlayer.image_filename}`
    : "/placeholder-player.png";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Tournament Info & Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {tournament?.name} - Live Auction
            </h1>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats?.total_players || 0}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Assigned</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats?.assigned_players || 0}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Remaining</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats?.remaining_players || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Filter and Control Buttons */}
          <div className="flex gap-4 items-center border-t pt-4 flex-wrap">
            <label className="text-sm font-medium text-gray-700">Filter:</label>
            <div className="flex gap-2 flex-wrap">
              {FIXED_PLAYER_TYPES.map((type) => {
                const count =
                  type === "all"
                    ? allPlayers.length
                    : allPlayers.filter(
                        (p) => p.type.toLowerCase() === type.toLowerCase()
                      ).length;

                return (
                  <button
                    key={type}
                    onClick={() => {
                      setFilterType(type);
                      setCurrentPlayerIndex(0);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      filterType === type
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {type} ({count})
                  </button>
                );
              })}
            </div>
            <div className="ml-auto flex gap-2">
              <button
                onClick={handleShuffle}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                title="Shuffle all players"
              >
                🔀 Shuffle All
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                title="Reset to original order"
              >
                ↺ Reset
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing player {currentPlayerIndex + 1} of {filteredPlayers.length}
            {filterType !== "all" && ` (${filterType} only)`}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Player Card */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-xl p-8 text-white">
              {/* Player Image */}
              <div className="flex justify-center mb-6">
                <div className="w-48 h-48 rounded-full overflow-hidden bg-white shadow-lg">
                  <img
                    src={playerImageUrl}
                    alt={currentPlayer.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2UyZThmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";
                    }}
                  />
                </div>
              </div>

              <div className="text-center mb-8">
                <p className="text-sm uppercase tracking-wide mb-2 opacity-90">
                  Current Player
                </p>
                <h2 className="text-4xl font-bold mb-2">
                  {currentPlayer.name}
                </h2>
                <div className="flex justify-center gap-4 text-sm">
                  <span className="bg-white bg-opacity-20 px-4 py-1 rounded-full">
                    {currentPlayer.type}
                  </span>
                  <span className="bg-white bg-opacity-20 px-4 py-1 rounded-full">
                    ID: {currentPlayer.emp_id}
                  </span>
                </div>
              </div>

              {/* Bid Section */}
              <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Select Team
                  </label>
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    disabled={assigning}
                  >
                    <option value="">Choose a team...</option>
                    {tournament?.teams?.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name} - Remaining: ₹
                        {team.remainingBudget?.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Bid Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter bid amount"
                    className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    disabled={assigning}
                    min="0"
                  />
                </div>

                <button
                  onClick={handleAssignPlayer}
                  disabled={assigning || !selectedTeam || !bidAmount}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  {assigning ? "Assigning..." : "Assign Player & Next"}
                </button>
              </div>
            </div>
          </div>

          {/* Teams Summary */}
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Teams</h3>
              <button
                onClick={refreshTeamsOnly}
                disabled={refreshing}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                title="Refresh team information"
              >
                {refreshing ? "⟳" : "🔄"} Refresh
              </button>
            </div>

            {tournament?.teams?.map((team) => (
              <div
                key={team.id}
                className={`bg-white rounded-lg shadow-sm border-2 transition-all ${
                  selectedTeam === team.id.toString()
                    ? "border-blue-600 shadow-md"
                    : "border-transparent"
                }`}
              >
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() =>
                    setExpandedTeam(expandedTeam === team.id ? null : team.id)
                  }
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg">{team.name}</h4>
                    <button className="text-gray-500">
                      {expandedTeam === team.id ? "▼" : "▶"}
                    </button>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-semibold">
                        ₹{team.totalBudget?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Remaining:</span>
                      <span className="font-semibold text-green-600">
                        ₹{team.remainingBudget?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Players:</span>
                      <span className="font-semibold">
                        {team.players?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Team Members */}
                {expandedTeam === team.id &&
                  team.players &&
                  team.players.length > 0 && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      <h5 className="font-semibold text-sm text-gray-700 mb-2">
                        Team Members:
                      </h5>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {team.players.map((player, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center text-sm p-2 bg-white rounded"
                          >
                            <div>
                              <p className="font-medium">{player.name}</p>
                              <p className="text-xs text-gray-500">
                                {player.type}
                              </p>
                            </div>
                            <span className="text-green-600 font-semibold">
                              ₹{player.bid_amount?.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuctionPanel;
