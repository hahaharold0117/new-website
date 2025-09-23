import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!baseURL) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");

export const apiClient = axios.create({
  baseURL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// Interceptors (safe on both server & client)
apiClient.interceptors.request.use((config) => {
  // Client-only token example
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
