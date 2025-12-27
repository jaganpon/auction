// API Configuration
// This file centralizes all API endpoint configurations

// Get API URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://auction-huaeb7a7g7dvcuhz.canadacentral-01.azurewebsites.net";

// Export API endpoints
export const API_URL = `${API_BASE_URL}/api`;
export const IMAGE_URL = `${API_BASE_URL}/images`;

// API endpoint helpers
export const endpoints = {
  // Auth
  auth: {
    login: () => `${API_URL}/auth/login`,
    verify: () => `${API_URL}/auth/verify`,
    logout: () => `${API_URL}/auth/logout`,
  },

  // Tournaments
  tournaments: {
    list: () => `${API_URL}/tournaments`,
    create: () => `${API_URL}/tournaments`,
    get: (id) => `${API_URL}/tournaments/${id}`,
    update: (id) => `${API_URL}/tournaments/${id}`,
    delete: (id) => `${API_URL}/tournaments/${id}`,
    auctionStatus: (id) => `${API_URL}/tournaments/${id}/auction/status`,
  },

  // Teams
  teams: {
    create: (tournamentId) => `${API_URL}/tournaments/${tournamentId}/teams`,
    update: (tournamentId, teamId) =>
      `${API_URL}/tournaments/${tournamentId}/teams/${teamId}`,
    delete: (tournamentId, teamId) =>
      `${API_URL}/tournaments/${tournamentId}/teams/${teamId}`,
    setCaptain: (tournamentId, teamId) =>
      `${API_URL}/tournaments/${tournamentId}/teams/${teamId}/captain`,
  },

  // Players
  players: {
    list: (tournamentId) => `${API_URL}/tournaments/${tournamentId}/players`,
    create: (tournamentId) => `${API_URL}/tournaments/${tournamentId}/players`,
    upload: (tournamentId) =>
      `${API_URL}/tournaments/${tournamentId}/players/upload`,
    update: (tournamentId, empId) =>
      `${API_URL}/tournaments/${tournamentId}/players/${empId}`,
    delete: (tournamentId, empId) =>
      `${API_URL}/tournaments/${tournamentId}/players/${empId}`,
    uploadImage: (empId) => `${API_URL}/players/${empId}/image`,
    getImage: (filename) => `${IMAGE_URL}/${filename}`,
  },

  // Auction
  auction: {
    assign: () => `${API_URL}/auction/assign`,
  },
};

// Helper function to get player image URL
export const getPlayerImageUrl = (imageFilename) => {
  if (!imageFilename) return null;
  return `${IMAGE_URL}/${imageFilename}`;
};

// Export default API URL for backward compatibility
export default API_URL;
