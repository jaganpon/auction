import React from "react";
import { Trophy, Users, DollarSign, TrendingUp } from "lucide-react";
import TeamCard from "../components/TeamCard.jsx";

const LandingPage = ({ tournaments, setSelectedTeam, setShowTeamDetail }) => {
  // Empty state
  if (tournaments.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Trophy className="w-32 h-32 text-gray-300 mx-auto mb-6" />
        <h2 className="text-4xl font-bold text-gray-600 mb-4">
          Welcome to Cricket Auction System
        </h2>
        <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">
          No tournaments available yet. Admin users can create tournaments and
          manage teams through the Control Panel.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-lg mx-auto">
          <h3 className="font-bold text-blue-800 mb-3">Getting Started:</h3>
          <ol className="text-left text-blue-700 space-y-2 text-sm">
            <li>1. Admin creates tournament with teams</li>
            <li>2. Admin uploads players for the tournament</li>
            <li>3. Auctioneer conducts player auction</li>
            <li>4. Everyone can view teams and statistics here</li>
          </ol>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Cricket Auction Dashboard
          </h1>
          <p className="text-gray-600 text-xl">
            {tournaments.length} Active Tournament
            {tournaments.length !== 1 ? "s" : ""} • {totalTeams} Teams •{" "}
            {totalPlayers} Players
          </p>
        </div>

        {/* Overall Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-8 h-8 text-blue-500" />
              <span className="text-3xl font-bold text-blue-600">
                {tournaments.length}
              </span>
            </div>
            <p className="text-gray-600 font-semibold">Tournaments</p>
            <p className="text-xs text-gray-400 mt-1">Active competitions</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-green-500" />
              <span className="text-3xl font-bold text-green-600">
                {totalPlayers}
              </span>
            </div>
            <p className="text-gray-600 font-semibold">Players Assigned</p>
            <p className="text-xs text-gray-400 mt-1">Across all teams</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-purple-500" />
              <span className="text-3xl font-bold text-purple-600">
                ₹{(totalBudget / 10000000).toFixed(0)}Cr
              </span>
            </div>
            <p className="text-gray-600 font-semibold">Total Budget</p>
            <p className="text-xs text-gray-400 mt-1">Combined team budgets</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-red-500" />
              <span className="text-3xl font-bold text-red-600">
                ₹{(totalSpent / 10000000).toFixed(0)}Cr
              </span>
            </div>
            <p className="text-gray-600 font-semibold">Total Spent</p>
            <p className="text-xs text-gray-400 mt-1">On player acquisitions</p>
          </div>
        </div>

        {/* Tournaments Section */}
        <div className="space-y-12">
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
              (tournamentSpent / tournamentBudget) * 100;

            return (
              <div
                key={tournament.id}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                {/* Tournament Header */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                        <Trophy className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-800">
                          {tournament.name}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                          Created on{" "}
                          {new Date(tournament.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tournament Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <p className="text-blue-600 text-sm font-semibold mb-1">
                        Teams
                      </p>
                      <p className="text-2xl font-bold text-blue-700">
                        {tournament.teams.length}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <p className="text-green-600 text-sm font-semibold mb-1">
                        Players
                      </p>
                      <p className="text-2xl font-bold text-green-700">
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
                      <p className="text-red-600 text-sm font-semibold mb-1">
                        Spent
                      </p>
                      <p className="text-2xl font-bold text-red-700">
                        ₹{(tournamentSpent / 10000000).toFixed(1)}Cr
                      </p>
                    </div>
                  </div>

                  {/* Budget Usage Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span className="font-semibold">Budget Utilization</span>
                      <span className="font-bold">
                        {budgetUsedPercent.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
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
                </div>

                {/* Team Cards Grid */}
                {tournament.teams.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      No teams in this tournament yet
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-bold text-gray-700 mb-6 flex items-center">
                      <Users className="w-6 h-6 mr-2" />
                      Teams ({tournament.teams.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {tournament.teams.map((team) => (
                        <TeamCard
                          key={team.id}
                          team={team}
                          onClick={() => {
                            setSelectedTeam({
                              ...team,
                              tournamentName: tournament.name,
                              tournamentId: tournament.id,
                            });
                            setShowTeamDetail(true);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Tournament Summary Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-gray-500 mb-1">Available Players</p>
                      <p className="text-xl font-bold text-blue-600">
                        {tournament.players?.filter((p) => !p.isAssigned)
                          .length || 0}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500 mb-1">Assigned Players</p>
                      <p className="text-xl font-bold text-green-600">
                        {tournament.players?.filter((p) => p.isAssigned)
                          .length || 0}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500 mb-1">Avg Team Budget</p>
                      <p className="text-xl font-bold text-purple-600">
                        ₹
                        {tournament.teams.length > 0
                          ? (
                              tournamentBudget /
                              tournament.teams.length /
                              10000000
                            ).toFixed(1)
                          : 0}
                        Cr
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500 mb-1">Avg Player Cost</p>
                      <p className="text-xl font-bold text-red-600">
                        ₹
                        {tournamentPlayers > 0
                          ? (
                              tournamentSpent /
                              tournamentPlayers /
                              100000
                            ).toFixed(1)
                          : 0}
                        L
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Click on any team card to view detailed player roster and statistics
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
