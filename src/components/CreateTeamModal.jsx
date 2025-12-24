import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { API_URL } from "../config/api";

const CreateTeamModal = ({ tournamentId, onClose, onSuccess }) => {
  const { token } = useAuth();
  const [teamName, setTeamName] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!teamName.trim()) {
      setError("Team name is required");
      return;
    }

    const budgetNum = parseFloat(budget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      setError("Please enter a valid budget");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${API_URL}/tournaments/${tournamentId}/teams`,
        {
          name: teamName.trim(),
          budget: budgetNum,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-team-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2
            id="create-team-title"
            className="text-xl font-bold text-gray-900"
          >
            Create New Team
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
              role="alert"
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="team-name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Team Name{" "}
              <span className="text-red-500" aria-label="required">
                *
              </span>
            </label>
            <input
              id="team-name"
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Mumbai Indians"
              required
              disabled={loading}
              aria-required="true"
            />
          </div>

          <div>
            <label
              htmlFor="team-budget"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Budget (₹){" "}
              <span className="text-red-500" aria-label="required">
                *
              </span>
            </label>
            <input
              id="team-budget"
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 10000000"
              min="0"
              step="100000"
              required
              disabled={loading}
              aria-required="true"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? "Creating..." : "Create Team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamModal;
