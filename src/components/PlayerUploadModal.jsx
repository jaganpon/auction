import React, { useState } from "react";
import { X, Upload, AlertCircle, CheckCircle } from "lucide-react";

const PlayerUploadModal = ({
  isOpen,
  onClose,
  onUpload,
  existingPlayerCount = 0,
}) => {
  const [uploadMode, setUploadMode] = useState(""); // 'append' or 'replace'
  const [showModeSelection, setShowModeSelection] = useState(
    existingPlayerCount > 0
  );

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (showModeSelection && !uploadMode) {
        // User needs to select mode first
        alert("Please select upload mode (Append or Replace)");
        e.target.value = "";
        return;
      }

      onUpload(file, uploadMode || "replace");
      handleClose();
    }
  };

  const handleClose = () => {
    setUploadMode("");
    setShowModeSelection(existingPlayerCount > 0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div className="flex items-center space-x-2">
            <Upload className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Upload Players</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Existing Players Warning */}
        {existingPlayerCount > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-800 mb-1">
                  Existing Players Found
                </p>
                <p className="text-sm text-yellow-700">
                  This tournament already has{" "}
                  <strong>
                    {existingPlayerCount} player
                    {existingPlayerCount !== 1 ? "s" : ""}
                  </strong>
                  . Choose how to handle the new upload:
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Mode Selection */}
        {showModeSelection && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Upload Mode *
            </label>
            <div className="space-y-3">
              {/* Append Mode */}
              <button
                onClick={() => setUploadMode("append")}
                className={`w-full p-4 border-2 rounded-lg text-left transition ${
                  uploadMode === "append"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      uploadMode === "append"
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    {uploadMode === "append" && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 mb-1">
                      Append to Existing List
                    </p>
                    <p className="text-sm text-gray-600">
                      Add new players to the current list. Existing{" "}
                      {existingPlayerCount} players will remain. Duplicate
                      emp_id will be skipped.
                    </p>
                    <p className="text-xs text-green-600 mt-2 font-semibold">
                      ✓ Safe option - No data loss
                    </p>
                  </div>
                </div>
              </button>

              {/* Replace Mode */}
              <button
                onClick={() => setUploadMode("replace")}
                className={`w-full p-4 border-2 rounded-lg text-left transition ${
                  uploadMode === "replace"
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-red-300"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      uploadMode === "replace"
                        ? "border-red-500 bg-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    {uploadMode === "replace" && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 mb-1">
                      Replace Entire List
                    </p>
                    <p className="text-sm text-gray-600">
                      Delete all {existingPlayerCount} existing players and
                      upload fresh list. This action cannot be undone.
                    </p>
                    <p className="text-xs text-red-600 mt-2 font-semibold">
                      ⚠ Warning - All existing players will be deleted
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Excel File
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-gray-300 rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-2">
            Excel file should contain: <strong>emp_id</strong>,{" "}
            <strong>player_name</strong>, <strong>player_type</strong>
          </p>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-semibold text-blue-800 mb-2">
            Required Excel Columns:
          </p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>
              • <strong>emp_id</strong> - Unique employee ID
            </li>
            <li>
              • <strong>player_name</strong> - Full name of player
            </li>
            <li>
              • <strong>player_type</strong> - Batsman, Bowler, All-rounder, or
              Wicket-keeper
            </li>
            <li>
              • <strong>image_url</strong> (optional) - Player photo URL
            </li>
          </ul>
        </div>

        {/* Action Note */}
        {showModeSelection && !uploadMode && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              Please select an upload mode before choosing a file
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerUploadModal;
