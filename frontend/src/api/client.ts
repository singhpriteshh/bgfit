import axios from "axios";

// Create generic axios instance
let rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
if (rawBaseUrl && !rawBaseUrl.startsWith("http://") && !rawBaseUrl.startsWith("https://") && !rawBaseUrl.startsWith("/")) {
  rawBaseUrl = `https://${rawBaseUrl}`;
}
if (rawBaseUrl && !rawBaseUrl.endsWith("/api") && !rawBaseUrl.endsWith("/api/")) {
  rawBaseUrl = `${rawBaseUrl.replace(/\/+$/, "")}/api`;
}

const api = axios.create({
  baseURL: rawBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to include JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
