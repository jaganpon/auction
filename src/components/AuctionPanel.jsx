import React, { useState, useEffect } from "react";
import { Users, Trophy, ArrowRight, RefreshCw, DollarSign } from "lucide-react";
import * as api from "../services/api.js";

const AuctionPanel = ({ tournaments, refreshTournaments }) => {
  const [selectedTournamentId, setSelectedTournamentId] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [auctionStarted, setAuctionStarted] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  const selectedTournament = tournaments.find(
    (t) => t.id === Number(selectedTournamentId)
  );

  const tournamentPlayers = selectedTournament?.players || [];
  const unassignedPlayers = tournamentPlayers.filter((p) => !p.isAssigned);

  // Get random player from unassigned pool
  const getRandomPlayer = () => {
    if (unassignedPlayers.length > 0) {
      const randomIndex = Math.floor(Math.random() * unassignedPlayers.length);
      setCurrentPlayer(unassignedPlayers[randomIndex]);
      setSelectedTeamId("");
      setBidAmount("");
      setError("");
      setSuccess("");
    } else {
      setCurrentPlayer(null);
    }
  };

  // Start auction
  const handleStartAuction = () => {
    if (!selectedTournamentId) {
      alert("Please select a tournament first");
      return;
    }
    if (unassignedPlayers.length === 0) {
      alert("No unassigned players in this tournament");
      return;
    }
    setAuctionStarted(true);
    getRandomPlayer();
  };

  // Assign player to team
  const handleAssign = async () => {
    setError("");
    setSuccess("");

    if (!currentPlayer || !selectedTeamId || !bidAmount) {
      setError("Please select team and enter bid amount");
      return;
    }

    const team = selectedTournament.teams.find(
      (t) => t.id === Number(selectedTeamId)
    );
    const bid = parseFloat(bidAmount);

    if (isNaN(bid) || bid <= 0) {
      setError("Please enter a valid bid amount");
      return;
    }

    if (team.currentValue < bid) {
      setError(
        `Insufficient budget! ${
          team.name
        } has only ₹${team.currentValue.toLocaleString()} remaining`
      );
      return;
    }

    try {
      setIsAssigning(true);

      await api.assignPlayerInAuction({
        tournament_id: selectedTournament.id,
        team_id: team.id,
        emp_id: currentPlayer.empId,
        bid_amount: bid,
      });

      await refreshTournaments();

      setSuccess(`${currentPlayer.playerName} assigned to ${team.name}!`);

      // Get next player after short delay
      setTimeout(() => {
        getRandomPlayer();
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to assign player");
    } finally {
      setIsAssigning(false);
    }
  };

  // Reset auction when tournament changes
  useEffect(() => {
    setAuctionStarted(false);
    setCurrentPlayer(null);
    setSelectedTeamId("");
    setBidAmount("");
    setError("");
    setSuccess("");
  }, [selectedTournamentId]);

  // Show tournament selection if not started
  if (!auctionStarted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Trophy className="w-20 h-20 text-blue-600 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-3 text-gray-800">
              Auction Panel
            </h2>
            <p className="text-gray-600">
              Select a tournament to start the auction
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Select Tournament
              </label>
              <select
                value={selectedTournamentId}
                onChange={(e) => setSelectedTournamentId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              >
                <option value="">Choose a tournament...</option>
                {tournaments.map((tournament) => {
                  const unassigned =
                    tournament.players?.filter((p) => !p.isAssigned).length ||
                    0;
                  return (
                    <option key={tournament.id} value={tournament.id}>
                      {tournament.name} ({unassigned} players available)
                    </option>
                  );
                })}
              </select>
              {tournaments.length === 0 && (
                <p className="text-sm text-red-500 mt-2">
                  No tournaments available. Please create a tournament first.
                </p>
              )}
            </div>

            {selectedTournament && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-bold text-lg mb-3">
                  {selectedTournament.name}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total Teams:</span>
                    <span className="font-bold ml-2">
                      {selectedTournament.teams.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Players:</span>
                    <span className="font-bold ml-2">
                      {tournamentPlayers.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">
                      Available for Auction:
                    </span>
                    <span className="font-bold ml-2 text-green-600">
                      {unassignedPlayers.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Already Assigned:</span>
                    <span className="font-bold ml-2 text-blue-600">
                      {tournamentPlayers.length - unassignedPlayers.length}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleStartAuction}
              disabled={!selectedTournamentId || unassignedPlayers.length === 0}
              className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition duration-200 font-bold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <ArrowRight className="w-6 h-6" />
              <span>Start Auction</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Auction in progress
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {selectedTournament.name} - Auction
          </h2>
          <div className="flex justify-center items-center space-x-4 text-lg">
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
              Remaining: {unassignedPlayers.length}
            </div>
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
              Assigned: {tournamentPlayers.length - unassignedPlayers.length}
            </div>
            <button
              onClick={() => setAuctionStarted(false)}
              className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-semibold hover:bg-red-200"
            >
              End Auction
            </button>
          </div>
        </div>

        {/* Current Player Display */}
        {currentPlayer ? (
          <div className="bg-white rounded-xl shadow-2xl p-8 mb-8">
            {/* Player Avatar */}
            <div className="text-center mb-8">
              <div className="w-40 h-40 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-20 h-20 text-white" />
              </div>
              <h3 className="text-4xl font-bold mb-2 text-gray-800">
                {currentPlayer.playerName}
              </h3>
              <p className="text-gray-600 text-xl mb-2">
                Emp ID:{" "}
                <span className="font-mono font-semibold">
                  {currentPlayer.empId}
                </span>
              </p>
              <span className="inline-block bg-blue-100 text-blue-800 px-6 py-2 rounded-full text-lg font-semibold">
                {currentPlayer.type}
              </span>
            </div>

            {/* Auction Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Team Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Team
                </label>
                <select
                  value={selectedTeamId}
                  onChange={(e) => {
                    setSelectedTeamId(e.target.value);
                    setError("");
                  }}
                  disabled={isAssigning}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg disabled:bg-gray-100"
                >
                  <option value="">Choose team...</option>
                  {selectedTournament.teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name} (₹{team.currentValue.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Bid Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bid Amount (₹)
                </label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => {
                    setBidAmount(e.target.value);
                    setError("");
                  }}
                  disabled={isAssigning}
                  placeholder="Enter bid amount"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg disabled:bg-gray-100"
                  min="0"
                />
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 font-semibold text-center">
                  ✓ {success}
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 font-semibold">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAssign}
                disabled={isAssigning}
                className="flex-1 bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition duration-200 font-bold text-lg flex items-center justify-center space-x-2 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isAssigning ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Assigning...</span>
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-6 h-6" />
                    <span>Assign Player</span>
                  </>
                )}
              </button>
              <button
                onClick={getRandomPlayer}
                disabled={isAssigning}
                className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition duration-200 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                title="Skip to next player"
              >
                <RefreshCw className="w-6 h-6" />
              </button>
            </div>
          </div>
        ) : (
          /* Auction Complete Message */
          <div className="bg-white rounded-xl shadow-2xl p-12 text-center">
            <Trophy className="w-32 h-32 text-green-500 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-gray-800 mb-3">
              Auction Complete!
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              All players have been successfully assigned to teams
            </p>
            <button
              onClick={() => setAuctionStarted(false)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Back to Tournament Selection
            </button>
          </div>
        )}

        {/* Team Summary Cards */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">
            Team Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedTournament.teams.map((team) => (
              <div
                key={team.id}
                className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500"
              >
                <h4 className="font-bold text-lg mb-3 text-gray-800">
                  {team.name}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>Players:</span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {team.players.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span>Budget Left:</span>
                    </div>
                    <span className="font-semibold text-green-600">
                      ₹{team.currentValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Spent:</span>
                    <span className="font-semibold text-red-600">
                      ₹
                      {(team.initialValue - team.currentValue).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionPanel;
