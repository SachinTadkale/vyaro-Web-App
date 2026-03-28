import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: "http://localhost:5000", // change if needed
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
export default api;

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token automatically on unauthorized
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
