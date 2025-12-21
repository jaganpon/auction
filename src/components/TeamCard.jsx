import React from 'react';
import { Trophy, Users, DollarSign } from 'lucide-react';

const TeamCard = ({ team, onClick }) => {
  const spentAmount = team.initialValue - team.currentValue;
  const spentPercentage = (spentAmount / team.initialValue) * 100;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
    >
      {/* Team Logo */}
      <div className="flex items-center justify-center mb-4">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
          <Trophy className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Team Name */}
      <h3 className="text-xl font-bold text-center mb-4 text-gray-800">
        {team.name}
      </h3>

      {/* Team Stats */}
      <div className="space-y-3">
        {/* Players Count */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span>Players:</span>
          </div>
          <span className="font-semibold text-gray-800">
            {team.players.length}
          </span>
        </div>

        {/* Current Budget */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span>Budget:</span>
          </div>
          <span className="font-semibold text-green-600">
            ₹{team.currentValue.toLocaleString()}
          </span>
        </div>

        {/* Spent Amount */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Spent:</span>
          <span className="font-semibold text-red-600">
            ₹{spentAmount.toLocaleString()}
          </span>
        </div>

        {/* Budget Bar */}
        <div className="pt-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Budget Used</span>
            <span>{spentPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                spentPercentage > 80 ? 'bg-red-500' : 
                spentPercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Click Hint */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400">Click to view players</p>
      </div>
    </div>
  );
};

export default TeamCard;