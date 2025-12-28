import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import * as XLSX from "xlsx";
import { API_URL } from "../config/api";

const TeamDetailModal = ({ team, tournamentId, onClose, onSuccess }) => {
  const { user, token } = useAuth();
  const [captainId, setCaptainId] = useState(team.captain_id || "");
  const [viceCaptainId, setViceCaptainId] = useState(
    team.vice_captain_id || ""
  );
  const [saving, setSaving] = useState(false);

  const teamPlayers = team.players || [];

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post(
        `${API_URL}/tournaments/${tournamentId}/teams/${team.id}/captain`,
        {
          captain_id: captainId || null,
          vice_captain_id: viceCaptainId || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Captain and vice-captain updated successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating captain:", error);
      alert(error.response?.data?.detail || "Failed to update captain");
    } finally {
      setSaving(false);
    }
  };

  const exportToExcel = () => {
    const data = teamPlayers.map((p) => ({
      "Emp ID": p.emp_id,
      Name: p.name,
      Type: p.type,
      "Bid Amount": p.bid_amount || 0,
      Role:
        p.emp_id === captainId
          ? "Captain"
          : p.emp_id === viceCaptainId
          ? "Vice-Captain"
          : "Player",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, team.name);
    XLSX.writeFile(wb, `${team.name}_players.xlsx`);
  };

  const exportToCSV = () => {
    const data = teamPlayers.map((p) => ({
      "Emp ID": p.emp_id,
      Name: p.name,
      Type: p.type,
      "Bid Amount": p.bid_amount || 0,
      Role:
        p.emp_id === captainId
          ? "Captain"
          : p.emp_id === viceCaptainId
          ? "Vice-Captain"
          : "Player",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${team.name}_players.csv`;
    a.click();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="team-detail-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 id="team-detail-title" className="text-2xl font-bold">
                {team.name}
              </h2>
              <p className="text-sm opacity-90 mt-1">
                Budget: ₹{team.totalBudget?.toLocaleString()} | Remaining: ₹
                {team.remainingBudget?.toLocaleString()} | Players:{" "}
                {teamPlayers.length}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Captain Selection (Admin Only) */}
          {user?.role === "admin" && (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-4">Assign Leadership</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Captain
                  </label>
                  <select
                    value={captainId}
                    onChange={(e) => setCaptainId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={saving}
                  >
                    <option value="">No Captain</option>
                    {teamPlayers.map((player) => (
                      <option key={player.emp_id} value={player.emp_id}>
                        {player.name} ({player.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vice-Captain
                  </label>
                  <select
                    value={viceCaptainId}
                    onChange={(e) => setViceCaptainId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={saving}
                  >
                    <option value="">No Vice-Captain</option>
                    {teamPlayers.map((player) => (
                      <option key={player.emp_id} value={player.emp_id}>
                        {player.name} ({player.type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {saving ? "Saving..." : "Save Leadership"}
              </button>
            </div>
          )}

          {/* Export Buttons */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
            >
              📊 Export Excel
            </button>
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              📄 Export CSV
            </button>
          </div>

          {/* Players List */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="font-bold text-lg">
                Team Members ({teamPlayers.length})
              </h3>
            </div>

            {teamPlayers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No players in this team yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Emp ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Bid Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {teamPlayers.map((player) => {
                      const isCaptain = player.emp_id === captainId;
                      const isViceCaptain = player.emp_id === viceCaptainId;

                      return (
                        <tr
                          key={player.id}
                          className={`${
                            isCaptain
                              ? "bg-yellow-50 border-l-4 border-yellow-500"
                              : isViceCaptain
                              ? "bg-blue-50 border-l-4 border-blue-500"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{player.name}</span>
                              {isCaptain && (
                                <span className="text-yellow-600 font-bold">
                                  ⭐ C
                                </span>
                              )}
                              {isViceCaptain && (
                                <span className="text-blue-600 font-bold">
                                  ✪ VC
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {player.emp_id}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {player.type}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-green-600">
                            ₹{player.bid_amount?.toLocaleString() || 0}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {isCaptain && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                                Captain
                              </span>
                            )}
                            {isViceCaptain && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                Vice-Captain
                              </span>
                            )}
                            {!isCaptain && !isViceCaptain && (
                              <span className="text-gray-500 text-xs">
                                Player
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamDetailModal;
