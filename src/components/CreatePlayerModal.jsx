import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { API_URL } from "../config/api";

const CreatePlayerModal = ({ tournamentId, onClose, onSuccess }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    emp_id: "",
    name: "",
    type: "Batsman",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const playerTypes = ["Batsman", "Bowler", "All-Rounder", "Wicket-Keeper"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.emp_id.trim() || !formData.name.trim()) {
      setError("Employee ID and Name are required");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${API_URL}/tournaments/${tournamentId}/players`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Player created successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error creating player:", err);
      setError(err.response?.data?.detail || "Failed to create player");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-player-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2
            id="create-player-title"
            className="text-xl font-bold text-gray-900"
          >
            Create New Player
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
              htmlFor="emp_id"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Employee ID{" "}
              <span className="text-red-500" aria-label="required">
                *
              </span>
            </label>
            <input
              id="emp_id"
              name="emp_id"
              type="text"
              value={formData.emp_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., EMP001"
              required
              disabled={loading}
              aria-required="true"
            />
            <p className="text-xs text-gray-500 mt-1">
              Unique identifier for the player
            </p>
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Player Name{" "}
              <span className="text-red-500" aria-label="required">
                *
              </span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Virat Kohli"
              required
              disabled={loading}
              aria-required="true"
            />
          </div>

          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Player Type{" "}
              <span className="text-red-500" aria-label="required">
                *
              </span>
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
              aria-required="true"
            >
              {playerTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
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
              {loading ? "Creating..." : "Create Player"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlayerModal;
