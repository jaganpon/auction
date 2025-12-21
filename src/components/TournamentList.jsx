import React, { useState } from "react";
import { Trophy, Edit2, Save, X, Trash2 } from "lucide-react";

const TournamentList = ({
  tournaments,
  onCreateTournament,
  onUpdateTournament,
  onDeleteTournament,
  onUpdateTeam,
  onDeleteTeam,
}) => {
  const [editingTournamentId, setEditingTournamentId] = useState(null);
  const [editTournamentName, setEditTournamentName] = useState("");
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editTeamName, setEditTeamName] = useState("");

  const handleStartEditTournament = (tournament) => {
    setEditingTournamentId(tournament.id);
    setEditTournamentName(tournament.name);
  };

  const handleSaveEditTournament = (tournamentId) => {
    onUpdateTournament(tournamentId, editTournamentName);
    setEditingTournamentId(null);
  };

  const handleStartEditTeam = (team) => {
    setEditingTeamId(team.id);
    setEditTeamName(team.name);
  };

  const handleSaveEditTeam = (tournamentId, teamId) => {
    onUpdateTeam(tournamentId, teamId, editTeamName);
    setEditingTeamId(null);
  };

  if (tournaments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <Trophy className="w-20 h-20 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg mb-4">No tournaments yet</p>
        <button
          onClick={onCreateTournament}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Create First Tournament
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">All Tournaments</h3>
        <button
          onClick={onCreateTournament}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold shadow-md"
        >
          + Create Tournament
        </button>
      </div>

      <div className="space-y-6">
        {tournaments.map((tournament) => (
          <div
            key={tournament.id}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                {editingTournamentId === tournament.id ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editTournamentName}
                      onChange={(e) => setEditTournamentName(e.target.value)}
                      className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 focus:outline-none px-2"
                    />
                    <button
                      onClick={() => handleSaveEditTournament(tournament.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded"
                      title="Save"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setEditingTournamentId(null)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Cancel"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <h4 className="text-2xl font-bold text-gray-800">
                      {tournament.name}
                    </h4>
                    <button
                      onClick={() => handleStartEditTournament(tournament)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit tournament name"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        onDeleteTournament(tournament.id, tournament.name)
                      }
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Delete tournament"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Created: {new Date(tournament.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Teams:{" "}
                  <span className="font-bold">{tournament.teams.length}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Players:{" "}
                  <span className="font-bold">
                    {tournament.players?.length || 0}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Assigned:{" "}
                  <span className="font-bold text-green-600">
                    {tournament.players?.filter((p) => p.isAssigned).length ||
                      0}
                  </span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tournament.teams.map((team) => (
                <div
                  key={team.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  {editingTeamId === team.id ? (
                    <div className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={editTeamName}
                        onChange={(e) => setEditTeamName(e.target.value)}
                        className="font-bold text-lg border-b-2 border-blue-500 focus:outline-none flex-1"
                      />
                      <button
                        onClick={() =>
                          handleSaveEditTeam(tournament.id, team.id)
                        }
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingTeamId(null)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-bold text-lg">{team.name}</h5>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleStartEditTeam(team)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit team name"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() =>
                            onDeleteTeam(tournament.id, team.id, team.name)
                          }
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete team"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Players:</span>
                      <span className="font-semibold">
                        {team.players.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-semibold text-green-600">
                        ₹{team.currentValue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentList;
