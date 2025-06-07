// src/lib/routineService.ts

import axios from "axios";

// API 기본 인스턴스 (필요시 baseURL 지정)
const api = axios.create({
    baseURL: "https://your-api-url.com/api", // 실제 API 주소로 대체
    withCredentials: true, // 필요 시 인증 정보 포함
});

// 초기 설정 정보 전송
export const submitInitialRoutine = async (data: {
    homeType: string;
    area: string;
    timePreference: string;
    cleanFrequency: string;
    lifestyle: string;
}) => {
    try {
        const response = await api.post("/routine/init", data);
        return response.data;
    } catch (error) {
        console.error("루틴 초기화 요청 실패:", error);
        throw error;
    }
};

// 추천 루틴 가져오기
export const fetchRecommendedRoutine = async () => {
    try {
        const response = await api.get("/routine/recommendation");
        return response.data;
    } catch (error) {
        console.error("추천 루틴 요청 실패:", error);
        throw error;
    }
};

// 사용자의 기존 루틴 불러오기
export const fetchUserRoutine = async (userId: string) => {
    try {
        const response = await api.get(`/routine/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error("사용자 루틴 요청 실패:", error);
        throw error;
    }
};
