// src/hooks/useFeedback.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import http from "@/shared/api/http";
import type { Counts, FeedbackReq, SimpleRes } from "@/lib/feedbackService";

type ApiResponse<T> = { status: number; message: string; data?: T };
const EMPTY_COUNTS: Counts = { MON: 0, TUE: 0, WED: 0, THU: 0, FRI: 0, SAT: 0, SUN: 0 };

export const useWeeklyCounts = (weekStartDate: string) =>
    useQuery<Counts>({
        queryKey: ["feedback", "counts", weekStartDate],
        queryFn: async () => {
            const res = await http.get<ApiResponse<{ counts?: Counts }>>(
                "/api/v1/feedback/counts",
                { params: { weekStartDate } }
            );
            return res.data?.data?.counts ?? EMPTY_COUNTS;
        },
        enabled: !!weekStartDate,
        staleTime: 60_000,
    });

export const useSubmitFeedback = () =>
    useMutation<SimpleRes, unknown, FeedbackReq>({
        mutationFn: async (payload) =>
            (await http.post<SimpleRes>("/api/v1/feedback", payload)).data,
    });
