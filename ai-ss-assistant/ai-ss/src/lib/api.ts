// src/lib/api.ts

import axios from "axios";

// 기본 axios 인스턴스 설정
const api = axios.create({
    baseURL: "https://your-api-url.com/api", // 여기에 실제 백엔드 API 주소를 입력하세요.
    timeout: 10000, // 10초 타임아웃
    withCredentials: true, // 쿠키 인증 등이 필요할 경우 true로 설정
});

// 요청 인터셉터 (예: 토큰 자동 추가)
api.interceptors.request.use(
    (config) => {
        // 로컬 스토리지 또는 상태 관리에서 토큰 가져오기
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터 (예: 오류 처리, 자동 로그아웃 등)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // 예: 인증 오류 처리
        if (error.response?.status === 401) {
            console.warn("인증 실패: 로그인 다시 필요");
            // window.location.href = "/login"; // 필요시 로그인 페이지로 리디렉션
        }
        return Promise.reject(error);
    }
);

export default api;
