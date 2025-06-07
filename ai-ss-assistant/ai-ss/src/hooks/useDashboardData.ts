// useDashboardData.ts

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Routine {
    id: string;
    title: string;
    completed: boolean;
}

export interface Weather {
    temperature: number;
    condition: string;
}

export interface DashboardData {
    weather: Weather;
    routines: Routine[];
}

const mockData: DashboardData = {
    weather: {
        temperature: 25,
        condition: "Sunny",
    },
    routines: [
        { id: "1", title: "청소하기", completed: false },
        { id: "2", title: "빨래하기", completed: true },
    ],
};

export const useDashboardData = () => {
    return useQuery<DashboardData>({
        queryKey: ["dashboardData"],
        queryFn: async () => {
            // 주석처리: 실제 API 호출
            // const res = await axios.get("/api/dashboard");
            // return res.data;

            // 임시: 목업 데이터 반환 (0.5초 지연 추가)
            await new Promise((r) => setTimeout(r, 500));
            return mockData;
        },
    });
};
