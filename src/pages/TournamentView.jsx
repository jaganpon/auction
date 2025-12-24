import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import * as XLSX from "xlsx";
import Navbar from "../components/Navbar";
import CreateTeamModal from "../components/CreateTeamModal";
import CreatePlayerModal from "../components/CreatePlayerModal";
import ConfirmDialog from "../components/ConfirmDialog";
import PlayerEditModal from "../components/PlayerEditModal";
import TeamDetailModal from "../components/TeamDetailModal";
import { API_URL } from "../config/api";

const TournamentView = () => {
  const { tournamentId } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [tournament, setTournament] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState("replace");

  // Search, Sort, Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showCreatePlayer, setShowCreatePlayer] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: null,
  });
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    fetchData();
  }, [tournamentId]);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [tournamentRes, playersRes] = await Promise.all([
        axios.get(`${API_URL}/tournaments/${tournamentId}`, { headers }),
        axios.get(`${API_URL}/tournaments/${tournamentId}/players`, {
          headers,
        }),
      ]);

      setTournament(tournamentRes.data);
      setPlayers(playersRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtered and sorted players
  const filteredPlayers = useMemo(() => {
    let result = players.filter(
      (player) =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.emp_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "team_id") {
        const aTeam = tournament?.teams?.find((t) => t.id === a.team_id);
        const bTeam = tournament?.teams?.find((t) => t.id === b.team_id);
        aVal = aTeam?.name || "";
        bVal = bTeam?.name || "";
      }

      if (typeof aVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [players, searchQuery, sortField, sortOrder, tournament]);

  // Pagination
  const totalPages = Math.ceil(filteredPlayers.length / pageSize);
  const paginatedPlayers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPlayers.slice(start, start + pageSize);
  }, [filteredPlayers, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const exportToExcel = () => {
    const data = filteredPlayers.map((p) => {
      const team = tournament?.teams?.find((t) => t.id === p.team_id);
      return {
        "Emp ID": p.emp_id,
        Name: p.name,
        Type: p.type,
        Status: p.is_assigned ? "Assigned" : "Unsold",
        Team: team?.name || "-",
        "Bid Amount": p.bid_amount || 0,
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Players");
    XLSX.writeFile(wb, `${tournament.name}_players.xlsx`);
  };

  const exportToCSV = () => {
    const data = filteredPlayers.map((p) => {
      const team = tournament?.teams?.find((t) => t.id === p.team_id);
      return {
        "Emp ID": p.emp_id,
        Name: p.name,
        Type: p.type,
        Status: p.is_assigned ? "Assigned" : "Unsold",
        Team: team?.name || "-",
        "Bid Amount": p.bid_amount || 0,
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tournament.name}_players.csv`;
    a.click();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);

    try {
      const response = await axios.post(
        `${API_URL}/tournaments/${tournamentId}/players/upload?mode=${uploadMode}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(
        `Success! ${response.data.details.players_added} players uploaded.`
      );
      fetchData();
    } catch (error) {
      alert(error.response?.data?.detail || "Failed to upload players");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteTournament = () => {
    setConfirmDialog({
      show: true,
      title: "Delete Tournament",
      message: `Are you sure you want to delete "${tournament.name}"? This will delete all teams and players permanently.`,
      onConfirm: async () => {
        try {
          await axios.delete(`${API_URL}/tournaments/${tournamentId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          navigate("/");
        } catch (error) {
          alert(error.response?.data?.detail || "Failed to delete tournament");
        }
      },
    });
  };

  const handleDeleteTeam = (teamId, teamName) => {
    setConfirmDialog({
      show: true,
      title: "Delete Team",
      message: `Are you sure you want to delete team "${teamName}"? Players will be unassigned.`,
      onConfirm: async () => {
        try {
          await axios.delete(
            `${API_URL}/tournaments/${tournamentId}/teams/${teamId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          fetchData();
        } catch (error) {
          alert(error.response?.data?.detail || "Failed to delete team");
        }
      },
    });
  };

  const handleDeletePlayer = (empId, playerName) => {
    setConfirmDialog({
      show: true,
      title: "Delete Player",
      message: `Are you sure you want to delete player "${playerName}"?`,
      onConfirm: async () => {
        try {
          await axios.delete(
            `${API_URL}/tournaments/${tournamentId}/players/${empId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          fetchData();
        } catch (error) {
          alert(error.response?.data?.detail || "Failed to delete player");
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tournament...</p>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Tournament Not Found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const totalPlayers = players.length;
  const assignedPlayers = players.filter((p) => p.is_assigned).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Tournament Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {tournament.name}
              </h1>
              <p className="text-sm text-gray-600">
                Created: {new Date(tournament.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-3">
              {(user?.role === "admin" || user?.role === "auctioneer") && (
                <button
                  onClick={() => navigate(`/auction/${tournamentId}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Auction
                </button>
              )}
              {user?.role === "admin" && (
                <button
                  onClick={handleDeleteTournament}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Tournament
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-1">Teams</p>
            <p className="text-3xl font-bold text-blue-600">
              {tournament.teams?.length || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-1">Total Players</p>
            <p className="text-3xl font-bold text-purple-600">{totalPlayers}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-1">Assigned</p>
            <p className="text-3xl font-bold text-green-600">
              {assignedPlayers}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-1">Remaining</p>
            <p className="text-3xl font-bold text-orange-600">
              {totalPlayers - assignedPlayers}
            </p>
          </div>
        </div>

        {/* Upload Section */}
        {user?.role === "admin" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Upload Players
            </h2>

            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="replace"
                  checked={uploadMode === "replace"}
                  onChange={(e) => setUploadMode(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">Replace existing players</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="append"
                  checked={uploadMode === "append"}
                  onChange={(e) => setUploadMode(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">Add to existing players</span>
              </label>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                disabled={uploading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Upload player file"
              />
              {uploading && <span className="text-gray-600">Uploading...</span>}
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Supported: CSV, XLSX, XLS. Required columns: emp_id, name, type.
              Optional: image_filename
            </p>
          </div>
        )}

        {/* Player List */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                All Players ({filteredPlayers.length})
              </h2>
              <div className="flex gap-2">
                {user?.role === "admin" && (
                  <button
                    onClick={() => setShowCreatePlayer(true)}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                    aria-label="Create new player"
                  >
                    + Create Player
                  </button>
                )}
                <button
                  onClick={exportToExcel}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                  aria-label="Export to Excel"
                >
                  📊 Export Excel
                </button>
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  aria-label="Export to CSV"
                >
                  📄 Export CSV
                </button>
              </div>
            </div>

            {/* Search and Page Size */}
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Search players"
              />
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Items per page"
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "emp_id",
                    "name",
                    "type",
                    "is_assigned",
                    "team_id",
                    "bid_amount",
                  ].map((field) => (
                    <th
                      key={field}
                      onClick={() => handleSort(field)}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      role="columnheader"
                      aria-sort={
                        sortField === field
                          ? sortOrder === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                      tabIndex={0}
                      onKeyPress={(e) => e.key === "Enter" && handleSort(field)}
                    >
                      <div className="flex items-center gap-2">
                        {field === "emp_id" && "Emp ID"}
                        {field === "name" && "Name"}
                        {field === "type" && "Type"}
                        {field === "is_assigned" && "Status"}
                        {field === "team_id" && "Team"}
                        {field === "bid_amount" && "Bid Amount"}
                        {sortField === field &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </div>
                    </th>
                  ))}
                  {user?.role === "admin" && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedPlayers.map((player) => {
                  const team = tournament.teams?.find(
                    (t) => t.id === player.team_id
                  );
                  return (
                    <tr key={player.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {player.emp_id}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {player.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {player.type}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            player.is_assigned
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {player.is_assigned ? "Assigned" : "Unsold"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {team?.name || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {player.bid_amount
                          ? `₹${player.bid_amount.toLocaleString()}`
                          : "-"}
                      </td>
                      {user?.role === "admin" && (
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingPlayer(player)}
                              className="text-blue-600 hover:text-blue-800"
                              aria-label={`Edit ${player.name} image`}
                            >
                              📷 Image
                            </button>
                            <button
                              onClick={() =>
                                handleDeletePlayer(player.emp_id, player.name)
                              }
                              className="text-red-600 hover:text-red-800"
                              aria-label={`Delete ${player.name}`}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredPlayers.length)} of{" "}
              {filteredPlayers.length} results
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                aria-label="Previous page"
              >
                Previous
              </button>
              <span className="px-4 py-1 border border-gray-300 rounded-lg bg-gray-50">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Teams Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Teams ({tournament.teams?.length || 0})
            </h2>
            {user?.role === "admin" && (
              <button
                onClick={() => setShowCreateTeam(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                + Create Team
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {tournament.teams?.map((team) => (
              <div
                key={team.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedTeam(team)}
              >
                <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold">{team.name}</h3>
                    <p className="text-sm opacity-90 mt-1">
                      Budget: ₹{team.totalBudget?.toLocaleString()}
                    </p>
                  </div>
                  {user?.role === "admin" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTeam(team.id, team.name);
                      }}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-sm"
                      aria-label={`Delete team ${team.name}`}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-gray-600">Remaining:</span>
                    <span className="font-semibold text-green-600">
                      ₹{team.remainingBudget?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Players:</span>
                    <span className="font-semibold">
                      {team.players?.length || 0}
                    </span>
                  </div>

                  {/* Show Captain/Vice-Captain */}
                  {(team.captain_id || team.vice_captain_id) && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                      <div className="text-xs font-semibold text-gray-700 mb-2">
                        Leadership:
                      </div>
                      {team.captain_id && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-yellow-600 font-bold">
                            ⭐ Captain:
                          </span>
                          <span className="font-medium text-gray-800">
                            {team.players?.find(
                              (p) => p.emp_id === team.captain_id
                            )?.name || "Not assigned"}
                          </span>
                        </div>
                      )}
                      {team.vice_captain_id && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-blue-600 font-bold">
                            ✪ Vice-Captain:
                          </span>
                          <span className="font-medium text-gray-800">
                            {team.players?.find(
                              (p) => p.emp_id === team.vice_captain_id
                            )?.name || "Not assigned"}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-4 text-sm text-blue-600 font-medium">
                    Click to view details →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modals */}
      {showCreateTeam && (
        <CreateTeamModal
          tournamentId={tournamentId}
          onClose={() => setShowCreateTeam(false)}
          onSuccess={fetchData}
        />
      )}

      {showCreatePlayer && (
        <CreatePlayerModal
          tournamentId={tournamentId}
          onClose={() => setShowCreatePlayer(false)}
          onSuccess={fetchData}
        />
      )}

      {confirmDialog.show && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={() => {
            confirmDialog.onConfirm();
            setConfirmDialog({ ...confirmDialog, show: false });
          }}
          onCancel={() => setConfirmDialog({ ...confirmDialog, show: false })}
        />
      )}

      {editingPlayer && (
        <PlayerEditModal
          player={editingPlayer}
          tournamentId={tournamentId}
          onClose={() => setEditingPlayer(null)}
          onSuccess={fetchData}
        />
      )}

      {selectedTeam && (
        <TeamDetailModal
          team={selectedTeam}
          tournamentId={tournamentId}
          onClose={() => setSelectedTeam(null)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
};

export default TournamentView;
