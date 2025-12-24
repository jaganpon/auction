import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: "🏠",
      id: "home",
      roles: ["admin", "auctioneer", "guest"],
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="bg-white shadow-md border-b border-gray-200"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <button
              onClick={() => navigate("/")}
              className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2"
              aria-label="Go to homepage"
            >
              🏏 Cricket Auction
            </button>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(
              (item) =>
                item.roles.includes(user?.role) && (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isActive(item.path)
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    aria-label={item.name}
                    aria-current={isActive(item.path) ? "page" : undefined}
                  >
                    <span className="mr-2" aria-hidden="true">
                      {item.icon}
                    </span>
                    {item.name}
                  </button>
                )
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700">
              <span className="font-semibold">{user?.username}</span>
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {user?.role}
              </span>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-2 py-3 space-y-1">
          {navItems.map(
            (item) =>
              item.roles.includes(user?.role) && (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  aria-current={isActive(item.path) ? "page" : undefined}
                >
                  <span className="mr-2" aria-hidden="true">
                    {item.icon}
                  </span>
                  {item.name}
                </button>
              )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
