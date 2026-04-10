import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export const AUTH_STORAGE_KEY = "expense-tracker-auth";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const withToken = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const readStoredSession = () => {
  try {
    const rawSession = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!rawSession) {
      return null;
    }

    return JSON.parse(rawSession);
  } catch (error) {
    console.error("Unable to read saved session:", error);
    return null;
  }
};

export const saveStoredSession = (session) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const clearStoredSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};
