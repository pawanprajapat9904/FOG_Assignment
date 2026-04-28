import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "/api";
const api = axios.create({ baseURL: BASE });

export const gamesAPI = {
  getAll: () => api.get("/games"),
  getById: (id) => api.get(`/games/${id}`),
  create: (data) => api.post("/games", data),
};

export const scoresAPI = {
  getLeaderboard: () => api.get("/scores"),
  saveScore: (data) => api.post("/scores", data),
};

export default api;
