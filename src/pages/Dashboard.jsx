import React, { useState } from "react";
import {
  Trophy,
  Users,
  DollarSign,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import TeamCard from "../components/TeamCard.jsx";
import TeamDetailModal from "../components/TeamDetailModal.jsx";

const Dashboard = ({ tournaments }) => {
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showTeamDetail, setShowTeamDetail] = useState(false);

  // Calculate overall statistics
  const totalTeams = tournaments.reduce((sum, t) => sum + t.teams.length, 0);
  const totalPlayers = tournaments.reduce(
    (sum, t) =>
      sum + t.teams.reduce((tSum, team) => tSum + team.players.length, 0),
    0
  );
  const totalBudget = tournaments.reduce(
    (sum, t) =>
      sum + t.teams.reduce((tSum, team) => tSum + team.initialValue, 0),
    0
  );
  const totalSpent = tournaments.reduce(
    (sum, t) =>
      sum +
      t.teams.reduce(
        (tSum, team) => tSum + (team.initialValue - team.currentValue),
        0
      ),
    0
  );

  // View: Team List (when tournament is selected)
  if (selectedTournament) {
    const tournamentPlayers = selectedTournament.teams.reduce(
      (sum, team) => sum + team.players.length,
      0
    );
    const tournamentBudget = selectedTournament.teams.reduce(
      (sum, team) => sum + team.initialValue,
      0
    );
    const tournamentSpent = selectedTournament.teams.reduce(
      (sum, team) => sum + (team.initialValue - team.currentValue),
      0
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => setSelectedTournament(null)}
            className="mb-6 flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold text-lg"
          >
            <ArrowRight className="w-5 h-5 transform rotate-180" />
            <span>Back to Tournaments</span>
          </button>

          {/* Tournament Header */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">
                  {selectedTournament.name}
                </h1>
                <p className="text-gray-500 mt-1">
                  Created{" "}
                  {new Date(selectedTournament.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Tournament Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-blue-600 text-sm font-semibold mb-1">
                  Teams
                </p>
                <p className="text-3xl font-bold text-blue-700">
                  {selectedTournament.teams.length}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <p className="text-green-600 text-sm font-semibold mb-1">
                  Players
                </p>
                <p className="text-3xl font-bold text-green-700">
                  {tournamentPlayers}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <p className="text-purple-600 text-sm font-semibold mb-1">
                  Total Budget
                </p>
                <p className="text-2xl font-bold text-purple-700">
                  ₹{(tournamentBudget / 10000000).toFixed(1)}Cr
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                <p className="text-red-600 text-sm font-semibold mb-1">Spent</p>
                <p className="text-2xl font-bold text-red-700">
                  ₹{(tournamentSpent / 10000000).toFixed(1)}Cr
                </p>
              </div>
            </div>
          </div>

          {/* Teams Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Users className="w-7 h-7 mr-3" />
              Teams ({selectedTournament.teams.length})
            </h2>

            {selectedTournament.teams.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No teams in this tournament</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {selectedTournament.teams.map((team) => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    onClick={() => {
                      setSelectedTeam({
                        ...team,
                        tournamentName: selectedTournament.name,
                        tournamentId: selectedTournament.id,
                      });
                      setShowTeamDetail(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Team Detail Modal */}
          <TeamDetailModal
            team={selectedTeam}
            isOpen={showTeamDetail}
            onClose={() => setShowTeamDetail(false)}
          />
        </div>
      </div>
    );
  }

  // View: Tournament Selection (Default)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Cricket Auction Dashboard
          </h1>
          <p className="text-gray-600 text-xl">
            Select a tournament to view teams and statistics
          </p>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-8 h-8 text-blue-500" />
              <span className="text-3xl font-bold text-blue-600">
                {tournaments.length}
              </span>
            </div>
            <p className="text-gray-600 font-semibold">Tournaments</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-green-500" />
              <span className="text-3xl font-bold text-green-600">
                {totalTeams}
              </span>
            </div>
            <p className="text-gray-600 font-semibold">Total Teams</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-purple-500" />
              <span className="text-3xl font-bold text-purple-600">
                ₹{(totalBudget / 10000000).toFixed(0)}Cr
              </span>
            </div>
            <p className="text-gray-600 font-semibold">Total Budget</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-red-500" />
              <span className="text-3xl font-bold text-red-600">
                {totalPlayers}
              </span>
            </div>
            <p className="text-gray-600 font-semibold">Players Signed</p>
          </div>
        </div>

        {/* Tournament Cards */}
        {tournaments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-16 text-center">
            <Trophy className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-600 mb-3">
              No Tournaments Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Admin users can create tournaments through the Control Panel
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              Select a Tournament
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tournaments.map((tournament) => {
                const tournamentPlayers = tournament.teams.reduce(
                  (sum, team) => sum + team.players.length,
                  0
                );
                const tournamentBudget = tournament.teams.reduce(
                  (sum, team) => sum + team.initialValue,
                  0
                );
                const tournamentSpent = tournament.teams.reduce(
                  (sum, team) => sum + (team.initialValue - team.currentValue),
                  0
                );
                const budgetUsedPercent =
                  tournamentBudget > 0
                    ? (tournamentSpent / tournamentBudget) * 100
                    : 0;

                return (
                  <div
                    key={tournament.id}
                    onClick={() => setSelectedTournament(tournament)}
                    className="bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-blue-500"
                  >
                    {/* Tournament Icon */}
                    <div className="flex justify-center mb-6">
                      <div className="p-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full shadow-lg">
                        <Trophy className="w-12 h-12 text-white" />
                      </div>
                    </div>

                    {/* Tournament Name */}
                    <h3 className="text-2xl font-bold text-center mb-4 text-gray-800">
                      {tournament.name}
                    </h3>

                    {/* Stats Grid */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-semibold text-blue-700">
                          Teams
                        </span>
                        <span className="text-xl font-bold text-blue-800">
                          {tournament.teams.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-semibold text-green-700">
                          Players
                        </span>
                        <span className="text-xl font-bold text-green-800">
                          {tournamentPlayers}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="text-sm font-semibold text-purple-700">
                          Budget
                        </span>
                        <span className="text-lg font-bold text-purple-800">
                          ₹{(tournamentBudget / 10000000).toFixed(1)}Cr
                        </span>
                      </div>
                    </div>

                    {/* Budget Bar */}
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-2">
                        <span>Budget Used</span>
                        <span className="font-bold">
                          {budgetUsedPercent.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            budgetUsedPercent > 80
                              ? "bg-gradient-to-r from-red-500 to-red-600"
                              : budgetUsedPercent > 50
                              ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                              : "bg-gradient-to-r from-green-500 to-green-600"
                          }`}
                          style={{
                            width: `${Math.min(budgetUsedPercent, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Click Hint */}
                    <div className="mt-6 text-center">
                      <span className="inline-flex items-center space-x-2 text-blue-600 font-semibold">
                        <span>View Teams</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
