import React from "react";
import { Trophy, LogOut, Home } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";

const Header = ({
  onControlPanelClick,
  onAuctionPanelClick,
  onLandingClick,
}) => {
  const { user, logout, canAccessControlPanel, canAccessAuctionPanel } =
    useAuth();

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-500";
      case "auctioneer":
        return "bg-green-500";
      case "guest":
        return "bg-gray-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Cricket Auction System</h1>
            {user && (
              <p className="text-xs text-white/80">
                Logged in as: {user.name || user.username}
              </p>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        {user && (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
              <span className="text-sm font-semibold">{user.username}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(
                  user.role
                )} text-white`}
              >
                {user.role.toUpperCase()}
              </span>
            </div>

            <button
              onClick={onLandingClick}
              className="bg-white/20 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition duration-200 shadow-md flex items-center space-x-2"
              title="Go to Dashboard"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>

            {/* Only show Control Panel for Admin */}
            {canAccessControlPanel() && (
              <button
                onClick={onControlPanelClick}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition duration-200 shadow-md"
              >
                Control Panel
              </button>
            )}

            {/* Only show Auction Panel for Admin and Auctioneer */}
            {canAccessAuctionPanel() && (
              <button
                onClick={onAuctionPanelClick}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-600 transition duration-200 shadow-md"
              >
                Auction Panel
              </button>
            )}

            <button
              onClick={logout}
              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-200 shadow-md"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
