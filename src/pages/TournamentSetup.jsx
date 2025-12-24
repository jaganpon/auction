import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import axios from "axios";
import { API_URL } from "../config/api";

const TournamentSetup = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [tournamentName, setTournamentName] = useState("");
  const [teams, setTeams] = useState([
    { name: "", budget: "" },
    { name: "", budget: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addTeam = () => {
    setTeams([...teams, { name: "", budget: "" }]);
  };

  const removeTeam = (index) => {
    if (teams.length > 2) {
      setTeams(teams.filter((_, i) => i !== index));
    }
  };

  const updateTeam = (index, field, value) => {
    const updatedTeams = [...teams];
    updatedTeams[index][field] = value;
    setTeams(updatedTeams);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!tournamentName.trim()) {
      setError("Tournament name is required");
      return;
    }

    const validTeams = teams.filter((t) => t.name.trim() && t.budget);
    if (validTeams.length < 2) {
      setError("At least 2 teams with names and budgets are required");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/tournaments`,
        {
          name: tournamentName,
          teams: validTeams.map((t) => ({
            name: t.name.trim(),
            budget: parseFloat(t.budget),
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Success - navigate to tournament view
      navigate(`/tournament/${response.data.id}`);
    } catch (err) {
      console.error("Error creating tournament:", err);
      setError(err.response?.data?.detail || "Failed to create tournament");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Create Tournament
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Tournament Name */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Tournament Name
              </label>
              <input
                type="text"
                value={tournamentName}
                onChange={(e) => setTournamentName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="e.g., IPL 2024"
                required
                disabled={loading}
              />
            </div>

            {/* Teams Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-lg font-semibold text-gray-700">
                  Teams
                </label>
                <button
                  type="button"
                  onClick={addTeam}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  disabled={loading}
                >
                  + Add Team
                </button>
              </div>

              <div className="space-y-4">
                {teams.map((team, index) => (
                  <div
                    key={index}
                    className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Team Name
                      </label>
                      <input
                        type="text"
                        value={team.name}
                        onChange={(e) =>
                          updateTeam(index, "name", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Team ${index + 1}`}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget (₹)
                      </label>
                      <input
                        type="number"
                        value={team.budget}
                        onChange={(e) =>
                          updateTeam(index, "budget", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 10000000"
                        min="0"
                        required
                        disabled={loading}
                      />
                    </div>

                    {teams.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeTeam(index)}
                        className="mt-8 px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        disabled={loading}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-500 mt-3">
                Minimum 2 teams required. Add as many teams as needed for your
                tournament.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Tournament"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default TournamentSetup;
