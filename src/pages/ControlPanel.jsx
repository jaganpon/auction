import React, { useState } from "react";
import {
  Upload,
  Trophy,
  Users,
  Settings,
  UserPlus,
  Trash2,
  Edit2,
  Save,
  X,
} from "lucide-react";
import CreateTournament from "../components/CreateTournament.jsx";
import AddPlayerModal from "../components/AddPlayerModal.jsx";
import PlayerUploadModal from "../components/PlayerUploadModal.jsx";
import TournamentList from "../components/TournamentList.jsx";
import PlayerList from "../components/PlayerList.jsx";
import TeamManagement from "../components/TeamManagement.jsx";
import * as api from "../services/api.js";

const ControlPanel = ({ tournaments, refreshTournaments }) => {
  const [activeTab, setActiveTab] = useState("tournaments");
  const [showTournamentModal, setShowTournamentModal] = useState(false);
  const [showPlayerUploadModal, setShowPlayerUploadModal] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const selectedTournament = tournaments.find(
    (t) => t.id === Number(selectedTournamentId)
  );

  // Reset team selection when tournament changes
  const effectiveSelectedTeamId = selectedTournamentId ? selectedTeamId : "";
  const selectedTeam = selectedTournament?.teams.find(
    (t) => t.id === Number(effectiveSelectedTeamId)
  );

  const showMessage = (message, type = "success") => {
    const prefix = type === "success" ? "✓" : "✗";
    setUploadStatus(`${prefix} ${message}`);
    setTimeout(() => setUploadStatus(""), 5000);
  };

  // Tournament Operations
  const handleCreateTournament = async (tournamentData) => {
    try {
      await api.createTournament({
        name: tournamentData.name,
        teams: tournamentData.teams.map((t) => ({
          name: t.name,
          budget: t.value,
        })),
      });
      await refreshTournaments();
      showMessage(`Tournament "${tournamentData.name}" created successfully`);
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

  const handleUpdateTournament = async (tournamentId, name) => {
    try {
      await api.updateTournament(tournamentId, { name });
      await refreshTournaments();
      showMessage("Tournament updated successfully");
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

  const handleDeleteTournament = async (tournamentId, tournamentName) => {
    if (
      !window.confirm(
        `Delete "${tournamentName}"? This will delete all teams and players.`
      )
    )
      return;

    try {
      await api.deleteTournament(tournamentId);
      await refreshTournaments();
      showMessage("Tournament deleted successfully");
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

  // Team Operations
  const handleUpdateTeam = async (tournamentId, teamId, name) => {
    try {
      await api.updateTeam(tournamentId, teamId, { name });
      await refreshTournaments();
      showMessage("Team updated successfully");
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

  const handleDeleteTeam = async (tournamentId, teamId, teamName) => {
    if (
      !window.confirm(
        `Delete team "${teamName}"? All players will be unassigned.`
      )
    )
      return;

    try {
      await api.deleteTeam(tournamentId, teamId);
      await refreshTournaments();
      showMessage("Team deleted successfully");
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

  // Player Operations
  const handlePlayerUpload = async (file, mode) => {
    if (!selectedTournamentId) {
      showMessage("Please select a tournament first", "error");
      return;
    }

    try {
      const result = await api.uploadPlayers(selectedTournamentId, file, mode);
      await refreshTournaments();
      showMessage(
        `${result.added} players uploaded. ${
          result.skipped > 0 ? `Skipped ${result.skipped} duplicates.` : ""
        }`
      );
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

  const handleUpdatePlayer = async (tournamentId, empId, playerData) => {
    try {
      await api.updatePlayer(tournamentId, empId, playerData);
      await refreshTournaments();
      showMessage("Player updated successfully");
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

  const handleDeletePlayer = async (tournamentId, empId, playerName) => {
    if (!window.confirm(`Delete player "${playerName}"?`)) return;

    try {
      await api.deletePlayer(tournamentId, empId);
      await refreshTournaments();
      showMessage("Player deleted successfully");
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

  const handleAddPlayerToTeam = async (player) => {
    if (!selectedTournament || !selectedTeam) {
      alert("Please select a tournament and team first");
      return;
    }

    if (selectedTeam.currentValue < player.bidAmount) {
      alert(
        `Insufficient budget! ${
          selectedTeam.name
        } has only ₹${selectedTeam.currentValue.toLocaleString()}`
      );
      return;
    }

    try {
      await api.addPlayerToTeam(
        selectedTournament.id,
        selectedTeam.id,
        {
          emp_id: player.empId,
          name: player.playerName,
          type: player.type,
        },
        player.bidAmount
      );
      await refreshTournaments();
      showMessage(`${player.playerName} added to ${selectedTeam.name}`);
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

  const handleRemovePlayer = async (
    tournamentId,
    teamId,
    empId,
    playerName
  ) => {
    if (!window.confirm(`Remove ${playerName} from the team?`)) return;

    try {
      await api.removePlayerFromTeam(tournamentId, teamId, empId);
      await refreshTournaments();
      showMessage(`${playerName} removed from team`);
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Control Panel</h2>
        <p className="text-gray-600">Manage tournaments, players, and teams</p>
      </div>

      {uploadStatus && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            uploadStatus.startsWith("✓")
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {uploadStatus}
        </div>
      )}

      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab("tournaments")}
            className={`px-6 py-3 font-semibold flex items-center space-x-2 border-b-2 transition ${
              activeTab === "tournaments"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600"
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span>Tournaments ({tournaments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("players")}
            className={`px-6 py-3 font-semibold flex items-center space-x-2 border-b-2 transition ${
              activeTab === "players"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600"
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Players</span>
          </button>
          <button
            onClick={() => setActiveTab("management")}
            className={`px-6 py-3 font-semibold flex items-center space-x-2 border-b-2 transition ${
              activeTab === "management"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Team Management</span>
          </button>
        </div>
      </div>

      <div>
        {activeTab === "tournaments" && (
          <TournamentList
            tournaments={tournaments}
            onCreateTournament={() => setShowTournamentModal(true)}
            onUpdateTournament={handleUpdateTournament}
            onDeleteTournament={handleDeleteTournament}
            onUpdateTeam={handleUpdateTeam}
            onDeleteTeam={handleDeleteTeam}
          />
        )}

        {activeTab === "players" && (
          <PlayerList
            tournaments={tournaments}
            selectedTournamentId={selectedTournamentId}
            setSelectedTournamentId={setSelectedTournamentId}
            onUploadClick={() => setShowPlayerUploadModal(true)}
            onUpdatePlayer={handleUpdatePlayer}
            onDeletePlayer={handleDeletePlayer}
          />
        )}

        {activeTab === "management" && (
          <TeamManagement
            tournaments={tournaments}
            selectedTournamentId={selectedTournamentId}
            setSelectedTournamentId={setSelectedTournamentId}
            selectedTeamId={effectiveSelectedTeamId}
            setSelectedTeamId={setSelectedTeamId}
            selectedTeam={selectedTeam}
            selectedTournament={selectedTournament}
            onAddPlayer={() => setShowAddPlayerModal(true)}
            onRemovePlayer={handleRemovePlayer}
          />
        )}
      </div>

      <CreateTournament
        isOpen={showTournamentModal}
        onClose={() => setShowTournamentModal(false)}
        onSave={handleCreateTournament}
      />

      <PlayerUploadModal
        isOpen={showPlayerUploadModal}
        onClose={() => setShowPlayerUploadModal(false)}
        onUpload={handlePlayerUpload}
        existingPlayerCount={selectedTournament?.players?.length || 0}
      />

      <AddPlayerModal
        isOpen={showAddPlayerModal}
        onClose={() => setShowAddPlayerModal(false)}
        onSave={handleAddPlayerToTeam}
        teamBudget={selectedTeam?.currentValue}
      />
    </div>
  );
};

export default ControlPanel;
