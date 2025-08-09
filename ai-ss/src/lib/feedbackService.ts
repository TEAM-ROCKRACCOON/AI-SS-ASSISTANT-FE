// src/lib/feedbackService.ts
import http from "@/shared/api/http";

export type WeekdayKey = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
export type Counts = Record<WeekdayKey, number>;

export async function getWeeklyCounts(weekStartDate: string): Promise<Counts> {
    const res = await http.get<{
        status: number;
        message: string;
        data?: { counts?: Counts };
    }>("/api/v1/feedback/counts", { params: { weekStartDate } });

    // 방어적 기본값
    return (
        res.data?.data?.counts ?? {
            MON: 0,
            TUE: 0,
            WED: 0,
            THU: 0,
            FRI: 0,
            SAT: 0,
            SUN: 0,
        }
    );
}

export type FeedbackReq = {
    weekStartDate: string;        // YYYY-MM-DD (월요일 기준)
    cleaningAmountScore: number;  // 1~5
    recommendedTimeScore: number; // 1~5
    comment?: string;
};

export type SimpleRes = { status: number; message: string };

export async function submitFeedback(payload: FeedbackReq): Promise<SimpleRes> {
    const res = await http.post<SimpleRes>("/api/v1/feedback", payload, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}
