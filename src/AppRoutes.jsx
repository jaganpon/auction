import { Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./context/auth/AuthProvider";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TournamentSetup from "./pages/TournamentSetup";
import TournamentView from "./pages/TournamentView";
import AuctionPanel from "./pages/AuctionPanel";

function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected (all users) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/tournament/:tournamentId"
            element={<TournamentView />}
          />
        </Route>

        {/* Admin only */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/tournament/new" element={<TournamentSetup />} />
        </Route>

        {/* Admin + Auctioneer */}
        <Route
          element={<ProtectedRoute allowedRoles={["admin", "auctioneer"]} />}
        >
          <Route path="/auction/:tournamentId" element={<AuctionPanel />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default AppRoutes;
