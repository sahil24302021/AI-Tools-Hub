// frontend/src/lib/api.js
import axios from "axios";
import { supabase } from "./supabaseClient";

// Backend URL (auto-fixes trailing slash)
const raw = import.meta.env.VITE_BACKEND_URL;
const baseURL = `${raw.replace(/\/$/, "")}/api`;

const api = axios.create({
  baseURL,
  timeout: 15000,
});

// -----------------------------------------------------
// Inject JWT token before request
// -----------------------------------------------------
api.interceptors.request.use(async (config) => {
  try {
    if (supabase?.auth) {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (_) {
    // best-effort only
  }
  return config;
});

// -----------------------------------------------------
// Auto-refresh token when 401
// -----------------------------------------------------
api.interceptors.response.use(
  (res) => res,

  async (error) => {
    const original = error.config;

  if (supabase?.auth && error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const { data, error: refreshError } = await supabase.auth.refreshSession();

      if (!refreshError && data?.session?.access_token) {
        original.headers.Authorization = `Bearer ${data.session.access_token}`;
        return api(original);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
