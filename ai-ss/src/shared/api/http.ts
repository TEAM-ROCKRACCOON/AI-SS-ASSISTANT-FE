// src/shared/api/http.ts
import axios from "axios";
import { getAccessToken, clearTokens } from "@/lib/authService";

const USE_MOCK = String(import.meta.env.VITE_USE_MOCK) === "true";

// const BASE_URL = USE_MOCK
//     ? ""
//     : (import.meta.env.VITE_API_BASE_URL ?? "https://aissbis.shop");
//
// export const http = axios.create({
//     baseURL: BASE_URL,
// });

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
});

// 요청 인터셉터: Authorization 헤더 자동 추가
http.interceptors.request.use((config) => {
    const url = config.url ?? "";
    const isLoginRequest = url.includes("/users/login");


    const realToken = getAccessToken();
    const token = USE_MOCK ? "mock-token" : realToken;

    if (token && !isLoginRequest) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// 응답 인터셉터: 401 처리
http.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err?.response?.status;


        if ((status === 401 || status === "401") && !USE_MOCK) {
            clearTokens();

            // window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);

export default http;