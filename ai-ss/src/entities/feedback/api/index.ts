// src/entities/feedback/api/index.ts
import http from "@/shared/api/http";

export type WeeklyFeedbackReq = {
    weekStartDate: string;        // YYYY-MM-DD (월요일)
    cleaningAmountScore: number;  // 1~5
    recommendedTimeScore: number; // 1~5
    comment?: string;
};

export type SimpleRes = { status: number; message: string };

export async function submitWeeklyFeedback(payload: WeeklyFeedbackReq): Promise<SimpleRes> {
    const res = await http.post<SimpleRes>("/api/v1/feedback/weekly", payload, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}
