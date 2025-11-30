// src/hooks/useDashboardData.ts
import { useQuery } from "@tanstack/react-query";
import http from "@/shared/api/http";

export interface Routine {
    id: string;
    title: string;
    completed: boolean;
    time?: string;
}

export interface Weather {
    temperature: number;
    condition: string;
    humidity?: number;
    dustLevel?: string;
}

export interface DashboardData {
    weather: Weather;
    routines: Routine[];
    doneCounts?: Record<string, number>;
}

type ApiResponse<T> = {
    status: number;
    message: string;
    data: T;
};

const USE_MSW = import.meta.env.VITE_USE_MSW === "true" || import.meta.env.DEV;

// 월요일(또는 주 시작일) YYYY-MM-DD 계산
function getWeekStartDate(d = new Date()) {
    const day = d.getDay(); // 0:일 ~ 6:토
    const diff = (day === 0 ? -6 : 1) - day; // 월요일 기준
    const base = new Date(d);
    base.setDate(d.getDate() + diff);
    const y = base.getFullYear();
    const m = String(base.getMonth() + 1).padStart(2, "0");
    const dd = String(base.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
}

export const useDashboardData = () => {
    return useQuery<DashboardData>({
        queryKey: ["dashboardData"],
        queryFn: async () => {
            // ① 오늘 루틴 목록 (배열/래퍼 둘 다 대응)
            const routinesRes = await http.get("/api/v1/todo/today");
            const rData = routinesRes.data as ApiResponse<Routine[]> | Routine[];
            const routines = Array.isArray(rData) ? rData : (rData?.data ?? []);

            // ② 날씨 데이터 (MSW 없으면 기본값)
            let weather: Weather;
            try {
                const weatherRes = await http.get<ApiResponse<Weather>>("/api/v1/weather/today");
                weather = weatherRes.data?.data ?? { temperature: 0, condition: "unknown" };
            } catch (e) {
                if (USE_MSW) {
                    weather = { temperature: 23, condition: "맑음", humidity: 55, dustLevel: "보통" };
                } else {
                    throw e;
                }
            }

            // ③ 완료 횟수 (MSW는 weekStartDate 필요)
            let doneCounts: Record<string, number> = {};
            try {
                const weekStartDate = getWeekStartDate();
                const feedbackRes = await http.get<ApiResponse<{ counts: Record<string, number> }>>(
                    "/api/v1/feedback/counts",
                    { params: { weekStartDate } }
                );
                // MSW는 { data: { counts } }, 실서버는 도중에 바뀔 수 있으니 안전 접근
                const payload = feedbackRes.data?.data as any;
                doneCounts = (payload?.counts as Record<string, number>) ?? (feedbackRes as any)?.data ?? {};
            } catch {
                // 피드백 API 미구현 시 무시
            }

            return { weather, routines, doneCounts };
        },
        staleTime: 60_000,
    });
};
