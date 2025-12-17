// src/shared/api/http.ts
import axios from "axios";
import { getAccessToken, clearTokens } from "@/lib/authService";

const USE_MOCK = String(import.meta.env.VITE_USE_MOCK) === "true";

// ✅ MSW 쓰면 같은 오리진(/api/...)으로 호출해서 워커가 잡게 함
// ✅ MSW 안 쓰면 env base url 또는 실서버
const BASE_URL = USE_MOCK
    ? ""
    : (import.meta.env.VITE_API_BASE_URL ?? "https://aissbis.shop");

export const http = axios.create({
    baseURL: BASE_URL,
});

// 요청 인터셉터: Authorization 헤더 자동 추가
http.interceptors.request.use((config) => {
    const url = config.url ?? "";
    const isLoginRequest = url.includes("/users/login");

    // ✅ 로그인 제거했으니, MSW 모드에서는 "항상" 더미 토큰 붙여서 authGuard 통과
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

        // ✅ 지금은 로그인 페이지 자체를 뺐으니까, 리다이렉트/토큰클리어 하지 말고 그냥 에러만 던지기
        if ((status === 401 || status === "401") && !USE_MOCK) {
            clearTokens();
            // 필요하면 나중에만 켜기
            // window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);

export default http;