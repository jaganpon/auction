import React, { createContext, useState } from "react";

const AuthContext = createContext();

// Mock users database - replace with API call
const USERS = [
  {
    username: "admin",
    password: "admin123",
    role: "admin",
    name: "Administrator",
  },
  {
    username: "auctioneer",
    password: "auction123",
    role: "auctioneer",
    name: "Auctioneer",
  },
  {
    username: "guest",
    password: "guest123",
    role: "guest",
    name: "Guest User",
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = (username, password) => {
    // Mock authentication - replace with actual API call
    const foundUser = USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      const mockToken = "mock-jwt-token-" + Date.now();
      setToken(mockToken);
      setUser({
        username: foundUser.username,
        role: foundUser.role,
        name: foundUser.name,
      });
      return { success: true, user: foundUser };
    }

    return { success: false, message: "Invalid credentials" };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user && !!token;
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (typeof roles === "string") return user.role === roles;
    return roles.includes(user.role);
  };

  const canAccessControlPanel = () => {
    return hasRole("admin");
  };

  const canAccessAuctionPanel = () => {
    return hasRole(["admin", "auctioneer"]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated,
        hasRole,
        canAccessControlPanel,
        canAccessAuctionPanel,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
