// src/services/api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://auction-huaeb7a7g7dvcuhz.canadacentral-01.azurewebsites.net";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("username");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// ==================== AUTHENTICATION ====================

export const login = async (username, password) => {
  try {
    const response = await apiClient.post("/api/auth/login", {
      username,
      password,
    });

    // Store token and user info
    localStorage.setItem("authToken", response.data.token);
    localStorage.setItem("userRole", response.data.role);
    localStorage.setItem("username", response.data.username);

    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Login failed";
  }
};

export const logout = async () => {
  try {
    await apiClient.post("/api/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
  }
};

export const verifyToken = async () => {
  const response = await apiClient.get("/api/auth/verify");
  return response.data;
};

// ==================== TOURNAMENTS ====================

export const getTournaments = async () => {
  try {
    const response = await apiClient.get("/api/tournaments");
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Failed to fetch tournaments";
  }
};

export const getTournament = async (tournamentId) => {
  try {
    const response = await apiClient.get(`/api/tournaments/${tournamentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Failed to fetch tournament";
  }
};

export const createTournament = async (tournamentData) => {
  try {
    const response = await apiClient.post("/api/tournaments", tournamentData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Failed to create tournament";
  }
};

// ==================== PLAYERS ====================

export const getPlayers = async (tournamentId) => {
  try {
    const response = await apiClient.get(
      `/api/tournaments/${tournamentId}/players`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Failed to fetch players";
  }
};

export const uploadPlayers = async (tournamentId, file, mode = "replace") => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", mode);

    const response = await apiClient.post(
      `/api/tournaments/${tournamentId}/players/upload?mode=${mode}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Failed to upload players";
  }
};

export const addPlayerToTeam = async (
  tournamentId,
  teamId,
  playerData,
  bidAmount
) => {
  try {
    const response = await apiClient.post(
      `/api/tournaments/${tournamentId}/teams/${teamId}/players?bid_amount=${bidAmount}`,
      playerData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Failed to add player";
  }
};

export const removePlayerFromTeam = async (tournamentId, teamId, empId) => {
  try {
    const response = await apiClient.delete(
      `/api/tournaments/${tournamentId}/teams/${teamId}/players/${empId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Failed to remove player";
  }
};

// ==================== AUCTION ====================

export const assignPlayerInAuction = async (assignmentData) => {
  try {
    const response = await apiClient.post(
      "/api/auction/assign",
      assignmentData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Failed to assign player";
  }
};

export const getAuctionStatus = async (tournamentId) => {
  try {
    const response = await apiClient.get(
      `/api/tournaments/${tournamentId}/auction/status`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Failed to fetch auction status";
  }
};

// ==================== HEALTH CHECK ====================

export const healthCheck = async () => {
  const response = await apiClient.get("/api/health");
  return response.data;
};

export default apiClient;
