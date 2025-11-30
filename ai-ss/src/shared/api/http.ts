// src/shared/api/http.ts
import axios from "axios";
import { getAccessToken, clearTokens } from "@/lib/authService";

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

http.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

http.interceptors.response.use(
    (res) => res,
    (err) => {
        // ✅ 개발 중엔 401이어도 자동 토큰 삭제/리다이렉트 하지 않음
        const status = err?.response?.status;
        const isDev = import.meta.env.MODE === "development";

        // 숫자/문자 모두 처리
        if ((status === 401 || status === "401") && !isDev) {
            clearTokens();
            window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);

export default http;
