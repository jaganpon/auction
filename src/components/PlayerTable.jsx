import React from 'react';
import { Users } from 'lucide-react';

const PlayerTable = ({ players, showCreateTournament, onCreateTournament }) => {
  if (players.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No players uploaded yet</p>
        <p className="text-gray-400 text-sm mt-2">
          Upload an Excel file to get started
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Table Header */}
      <div className="p-6 border-b flex justify-between items-center bg-gray-50">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Players List</h3>
          <p className="text-gray-600 mt-1">
            Total Players: <span className="font-semibold">{players.length}</span>
          </p>
        </div>
        {showCreateTournament && (
          <button
            onClick={onCreateTournament}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200 font-semibold shadow-md flex items-center space-x-2"
          >
            <span>+ Create Tournament</span>
          </button>
        )}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                S.No
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Emp ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Player Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Team
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                Bid Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, idx) => (
              <tr 
                key={idx} 
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 text-gray-600">
                  {idx + 1}
                </td>
                <td className="px-6 py-4 font-mono text-sm text-gray-800">
                  {player.empId}
                </td>
                <td className="px-6 py-4 font-medium text-gray-800">
                  {player.playerName}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {player.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {player.team === '-' ? (
                    <span className="text-gray-400 italic">Not Assigned</span>
                  ) : (
                    <span className="font-semibold text-green-600">
                      {player.team}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right font-semibold text-gray-800">
                  {player.bidAmount > 0 ? (
                    `₹${player.bidAmount.toLocaleString()}`
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>
            Showing {players.length} player{players.length !== 1 ? 's' : ''}
          </span>
          <span>
            Assigned: {players.filter(p => p.isAssigned).length} | 
            Unassigned: {players.filter(p => !p.isAssigned).length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlayerTable;