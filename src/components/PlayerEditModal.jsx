import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { API_URL } from "../config/api";

const PlayerEditModal = ({ player, tournamentId, onClose, onSuccess }) => {
  const { token } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    player.image_filename
      ? `${API_URL.replace("/api", "")}/images/${player.image_filename}`
      : null
  );

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      await axios.post(`${API_URL}/players/${player.emp_id}/image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Update preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      alert("Image uploaded successfully!");
      onSuccess();
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.response?.data?.detail || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-player-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2
            id="edit-player-title"
            className="text-xl font-bold text-gray-900"
          >
            Edit Player Image
          </h2>
        </div>

        <div className="p-6">
          {/* Player Info */}
          <div className="mb-6">
            <h3 className="font-bold text-lg">{player.name}</h3>
            <p className="text-sm text-gray-600">
              {player.type} • ID: {player.emp_id}
            </p>
          </div>

          {/* Current Image Preview */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Image
            </label>
            <div className="w-48 h-48 mx-auto rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-300">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt={player.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2UyZThmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <span className="text-4xl">👤</span>
                </div>
              )}
            </div>
          </div>

          {/* Upload New Image */}
          <div className="mb-6">
            <label
              htmlFor="player-image"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Upload New Image
            </label>
            <input
              id="player-image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: JPG, PNG, WebP. Max size: 5MB
            </p>
          </div>

          {uploading && (
            <div className="mb-4 text-center text-sm text-gray-600">
              Uploading image...
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={uploading}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerEditModal;
