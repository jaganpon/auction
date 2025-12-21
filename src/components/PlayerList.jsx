import React, { useState } from "react";
import { Upload, Edit2, Save, X, Trash2 } from "lucide-react";

const PlayerList = ({
  tournaments,
  selectedTournamentId,
  setSelectedTournamentId,
  onUploadClick,
  onUpdatePlayer,
  onDeletePlayer,
}) => {
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [editPlayerName, setEditPlayerName] = useState("");
  const [editPlayerType, setEditPlayerType] = useState("");

  const selectedTournament = tournaments.find(
    (t) => t.id === Number(selectedTournamentId)
  );

  const playerTypes = ["Batsman", "Bowler", "All-rounder", "Wicket-keeper"];

  const handleStartEdit = (player) => {
    setEditingPlayerId(player.empId);
    setEditPlayerName(player.playerName);
    setEditPlayerType(player.type);
  };

  const handleSave = () => {
    onUpdatePlayer(selectedTournament.id, editingPlayerId, {
      name: editPlayerName,
      type: editPlayerType,
    });
    setEditingPlayerId(null);
  };

  const handleCancel = () => {
    setEditingPlayerId(null);
    setEditPlayerName("");
    setEditPlayerType("");
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">Upload Players</h3>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Tournament
          </label>
          <select
            value={selectedTournamentId}
            onChange={(e) => setSelectedTournamentId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select tournament to upload players...</option>
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.players?.length || 0} players)
              </option>
            ))}
          </select>
        </div>

        {selectedTournamentId && (
          <button
            onClick={onUploadClick}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center space-x-2"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Excel File</span>
          </button>
        )}
      </div>

      {selectedTournament &&
        selectedTournament.players &&
        selectedTournament.players.length > 0 && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b bg-gray-50">
              <h3 className="text-xl font-bold">
                {selectedTournament.name} - Players (
                {selectedTournament.players.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Emp ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Player Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Team
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTournament.players.map((player, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-600">{idx + 1}</td>
                      <td className="px-6 py-4 font-mono text-sm">
                        {player.empId}
                      </td>
                      <td className="px-6 py-4">
                        {editingPlayerId === player.empId ? (
                          <input
                            type="text"
                            value={editPlayerName}
                            onChange={(e) => setEditPlayerName(e.target.value)}
                            className="border-b-2 border-blue-500 focus:outline-none w-full"
                          />
                        ) : (
                          <span className="font-medium">
                            {player.playerName}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingPlayerId === player.empId ? (
                          <select
                            value={editPlayerType}
                            onChange={(e) => setEditPlayerType(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {playerTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                            {player.type}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {player.team === "-" || !player.team ? (
                          <span className="text-gray-400 italic">
                            Not Assigned
                          </span>
                        ) : (
                          <span className="font-semibold text-green-600">
                            {player.team}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {editingPlayerId === player.empId ? (
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={handleSave}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                              title="Save changes"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleStartEdit(player)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit player"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                onDeletePlayer(
                                  selectedTournament.id,
                                  player.empId,
                                  player.playerName
                                )
                              }
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Delete player"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
};

export default PlayerList;
