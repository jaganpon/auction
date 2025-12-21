import React from 'react';
import { X, Trophy, Users, DollarSign } from 'lucide-react';

const TeamDetailModal = ({ team, isOpen, onClose }) => {
  if (!isOpen || !team) return null;

  const spentAmount = team.initialValue - team.currentValue;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">{team.name}</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Team Summary */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center space-x-2 text-blue-600 mb-2">
              <Users className="w-5 h-5" />
              <span className="font-semibold">Total Players</span>
            </div>
            <p className="text-3xl font-bold text-blue-700">
              {team.players.length}
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-2 text-green-600 mb-2">
              <DollarSign className="w-5 h-5" />
              <span className="font-semibold">Budget Left</span>
            </div>
            <p className="text-3xl font-bold text-green-700">
              ₹{team.currentValue.toLocaleString()}
            </p>
          </div>

          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center space-x-2 text-red-600 mb-2">
              <DollarSign className="w-5 h-5" />
              <span className="font-semibold">Total Spent</span>
            </div>
            <p className="text-3xl font-bold text-red-700">
              ₹{spentAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Players List */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-gray-800">Squad Players</h3>
          
          {team.players.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-lg">No players assigned yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Player Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Emp ID
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                      Bid Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {team.players.map((player, idx) => (
                    <tr 
                      key={idx} 
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 text-gray-600">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {player.playerName}
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-gray-600">
                        {player.empId}
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                          {player.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-800">
                        ₹{player.bidAmount?.toLocaleString() || '0'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamDetailModal;