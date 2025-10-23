import axios from "axios";
import { API_URL } from "../lib/env";

const axiosApi = axios.create({ baseURL: API_URL });

// Always attach latest token + proper prefix
axiosApi.interceptors.request.use(cfg => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    cfg.headers.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  }
  // If sending an array, ensure JSON header
  if (Array.isArray(cfg.data)) {
    cfg.headers["Content-Type"] = "application/json";
  }
  return cfg;
});

axiosApi.interceptors.response.use(r => r, e => Promise.reject(e));

export function setAuthToken(token) {
  axiosApi.defaults.headers.common.Authorization =
    token?.startsWith("Bearer ") ? token : `Bearer ${token}`;
}

export function get(url, config = {}) {
  return axiosApi.get(url, config).then(r => r.data);
}

export function getBlob(url, config = {}) {
  return axiosApi.get(url, { ...config, responseType: "blob" });
}

export function post(url, data, config = {}) {
  return axiosApi.post(url, data, config).then(r => r.data); // ✅ no spread
}

export function put(url, data, config = {}) {
  return axiosApi.put(url, data, config).then(r => r.data);  // ✅ no spread
}

export function del(url, config = {}) {
  return axiosApi.delete(url, config).then(r => r.data);
}