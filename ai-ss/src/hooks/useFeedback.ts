// src/hooks/useFeedback.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    getWeeklyCounts,
    submitFeedback,
    type Counts,
    type FeedbackReq,
    type SimpleRes,
} from "@/lib/feedbackService";

export const useWeeklyCounts = (weekStartDate: string) =>
    useQuery<Counts>({
        queryKey: ["feedback", "counts", weekStartDate],
        queryFn: () => getWeeklyCounts(weekStartDate),
        enabled: !!weekStartDate,
    });

export const useSubmitFeedback = () =>
    useMutation<SimpleRes, unknown, FeedbackReq>({
        mutationFn: submitFeedback,
    });
