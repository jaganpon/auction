import React, { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ControlPanel from "./pages/ControlPanel.jsx";
import AuctionPanel from "./components/AuctionPanel.jsx";
import LoginModal from "./components/LoginModal.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { useAuth } from "./hooks/useAuth.js";
import * as api from "./services/api.js";

function AppContent() {
  const { user, login, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState("dashboard");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load tournaments from backend
  useEffect(() => {
    if (isAuthenticated()) {
      loadTournaments();
    } else {
      setShowLoginModal(true);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadTournaments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.getTournaments();

      // Transform backend data to match frontend structure
      const transformedTournaments = data.map((t) => ({
        id: t.id,
        name: t.name,
        createdAt: t.createdAt,
        teams: t.teams.map((team) => ({
          id: team.id,
          name: team.name,
          initialValue: team.totalBudget,
          currentValue: team.remainingBudget,
          totalBudget: team.totalBudget,
          remainingBudget: team.remainingBudget,
          players: team.players.map((p) => ({
            empId: p.emp_id,
            playerName: p.name,
            type: p.type,
            bidAmount: p.bid_amount,
            isAssigned: p.is_assigned,
            team: team.name,
            teamId: team.id,
          })),
        })),
        players: t.players.map((p) => ({
          empId: p.emp_id,
          playerName: p.name,
          type: p.type,
          bidAmount: p.bid_amount || 0,
          isAssigned: p.is_assigned,
          team: p.team_id
            ? t.teams.find((tm) => tm.id === p.team_id)?.name
            : "-",
          teamId: p.team_id,
        })),
      }));

      setTournaments(transformedTournaments);
    } catch (err) {
      console.error("Failed to load tournaments:", err);
      setError(err.message || "Failed to load tournaments");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (username, password) => {
    try {
      await api.login(username, password);

      login(username, password); // Update auth context

      setShowLoginModal(false);
      await loadTournaments();

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.message || "Login failed",
      };
    }
  };

  const handleControlPanelClick = () => {
    if (user?.role === "admin") {
      setCurrentView("control");
    }
  };

  const handleAuctionPanelClick = () => {
    if (user?.role === "admin" || user?.role === "auctioneer") {
      setCurrentView("auction");
    }
  };

  const handleDashboardClick = () => {
    setCurrentView("dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return (
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {}}
        onLogin={handleLogin}
        required={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onControlPanelClick={handleControlPanelClick}
        onAuctionPanelClick={handleAuctionPanelClick}
        onLandingClick={handleDashboardClick}
      />

      {error && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 font-semibold">{error}</p>
            <button
              onClick={loadTournaments}
              className="mt-2 text-sm text-red-700 underline"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {currentView === "dashboard" && <Dashboard tournaments={tournaments} />}

      {currentView === "control" && user?.role === "admin" && (
        <ControlPanel
          tournaments={tournaments}
          setTournaments={setTournaments}
          refreshTournaments={loadTournaments}
        />
      )}

      {currentView === "auction" &&
        (user?.role === "admin" || user?.role === "auctioneer") && (
          <AuctionPanel
            tournaments={tournaments}
            setTournaments={setTournaments}
            refreshTournaments={loadTournaments}
          />
        )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
