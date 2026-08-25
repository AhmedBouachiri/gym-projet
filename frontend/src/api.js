import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/auth/";

const api = axios.create({
    baseURL,
    timeout: 10000,
});

api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("access");

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

/**
 * Pulls a human-readable message out of an axios/DRF error shape.
 * Falls back to a generic message if the server didn't send one.
 */
export function getErrorMessage(error, fallback) {
    if (!error?.response) {
        return "Can't reach the server. Check your connection and try again.";
    }

    const data = error.response.data;

    if (typeof data === "string") return data;
    if (data?.detail) return data.detail;

    if (data && typeof data === "object") {
        const firstKey = Object.keys(data)[0];
        const firstValue = data[firstKey];
        if (Array.isArray(firstValue)) return firstValue[0];
        if (typeof firstValue === "string") return firstValue;
    }

    return fallback;
}

export default api;
