import React from "react";
import { UserPlus, Trash2, Settings } from "lucide-react";

const TeamManagement = ({
  tournaments,
  selectedTournamentId,
  setSelectedTournamentId,
  selectedTeamId,
  setSelectedTeamId,
  selectedTeam,
  selectedTournament,
  onAddPlayer,
  onRemovePlayer,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">Team Management</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Tournament
          </label>
          <select
            value={selectedTournamentId}
            onChange={(e) => setSelectedTournamentId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select tournament...</option>
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.teams.length} teams)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Team
          </label>
          <select
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            disabled={!selectedTournamentId}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">Select team...</option>
            {selectedTournament?.teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name} (₹{team.currentValue.toLocaleString()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedTeam ? (
        <div>
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h3 className="font-bold text-xl mb-3">{selectedTeam.name}</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Players:</span>
                <span className="font-bold ml-2">
                  {selectedTeam.players.length}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Budget:</span>
                <span className="font-bold ml-2 text-green-600">
                  ₹{selectedTeam.currentValue.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Spent:</span>
                <span className="font-bold ml-2 text-red-600">
                  ₹
                  {(
                    selectedTeam.initialValue - selectedTeam.currentValue
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <button
              onClick={onAddPlayer}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold flex items-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Add Player</span>
            </button>
          </div>

          {selectedTeam.players.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No players yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Player
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Emp ID
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Type
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">
                      Bid
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTeam.players.map((player, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{player.playerName}</td>
                      <td className="px-4 py-3 font-mono text-sm">
                        {player.empId}
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                          {player.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        ₹{player.bidAmount?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() =>
                            onRemovePlayer(
                              selectedTournament.id,
                              selectedTeam.id,
                              player.empId,
                              player.playerName
                            )
                          }
                          className="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50"
                          title="Remove player"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Settings className="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <p>Select tournament and team to manage</p>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
