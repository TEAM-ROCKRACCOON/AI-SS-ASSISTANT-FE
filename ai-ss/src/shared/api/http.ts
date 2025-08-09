// src/shared/api/http.ts
import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || window.location.origin; // Vite는 import.meta.env만!

const http = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    timeout: 10000,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
});

http.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

http.interceptors.response.use(
    (res) => res,
    (err) => {
        // 공통 에러 처리 있으면 여기서
        return Promise.reject(err);
    }
);

export default http;
