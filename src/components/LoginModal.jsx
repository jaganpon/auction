import React, { useState } from "react";
import { X, Lock, Shield } from "lucide-react";

const LoginModal = ({ isOpen, onClose, onLogin, required = false }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = onLogin(username, password);

      if (result.success) {
        setError("");
        setUsername("");
        setPassword("");
        onClose();
      } else {
        setError(result.message || "Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!required) {
      setError("");
      setUsername("");
      setPassword("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Welcome</h2>
              <p className="text-sm text-gray-500">Please login to continue</p>
            </div>
          </div>
          {!required && (
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
              required
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-semibold">{error}</p>
            </div>
          )}

          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-bold text-gray-700 mb-3">
              Default Credentials:
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 bg-white rounded">
                <div>
                  <span className="font-semibold">Admin:</span>
                  <span className="ml-2 text-gray-600">admin / admin123</span>
                </div>
                <span className="px-2 py-0.5 bg-red-500 text-white rounded text-xs">
                  ADMIN
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded">
                <div>
                  <span className="font-semibold">Auctioneer:</span>
                  <span className="ml-2 text-gray-600">
                    auctioneer / auction123
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-green-500 text-white rounded text-xs">
                  AUCTIONEER
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded">
                <div>
                  <span className="font-semibold">Guest:</span>
                  <span className="ml-2 text-gray-600">guest / guest123</span>
                </div>
                <span className="px-2 py-0.5 bg-gray-500 text-white rounded text-xs">
                  GUEST
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
            <p className="font-semibold mb-2">Role Permissions:</p>
            <ul className="space-y-1 ml-4">
              <li>
                • <strong>Admin:</strong> Control Panel + Auction Panel
              </li>
              <li>
                • <strong>Auctioneer:</strong> Auction Panel only
              </li>
              <li>
                • <strong>Guest:</strong> Landing Page (view only)
              </li>
            </ul>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center space-x-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                <span>Login</span>
              </>
            )}
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Or</p>
            <button
              type="button"
              onClick={() => {
                setUsername("guest");
                setPassword("guest123");
                const result = onLogin("guest", "guest123");
                if (result.success) {
                  onClose();
                }
              }}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition font-semibold border-2 border-gray-300"
              disabled={isLoading}
            >
              Continue as Guest (View Only)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
