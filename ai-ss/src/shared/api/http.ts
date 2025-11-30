// src/shared/api/http.ts
import axios from "axios";
import { getAccessToken, clearTokens } from "@/lib/authService";

export const http = axios.create({
    // 🔥 baseURL 비워두고, 절대경로("/api/…")로만 호출하게
    baseURL: "",
});

// 요청 인터셉터: Authorization 헤더 자동 추가
http.interceptors.request.use((config) => {
    const token = getAccessToken();

    // 로그인 요청에는 토큰 붙이지 않기
    const url = config.url ?? "";
    const isLoginRequest = url.includes("/users/login");

    if (token && !isLoginRequest) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// 응답 인터셉터: 401 처리 (개발 모드에서는 리다이렉트 막기)
http.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err?.response?.status;
        const isDev = import.meta.env.MODE === "development";

        if ((status === 401 || status === "401") && !isDev) {
            clearTokens();
            window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);

export default http;
