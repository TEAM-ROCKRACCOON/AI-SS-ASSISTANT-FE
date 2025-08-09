// src/lib/feedbackService.test.ts
import { describe, it, expect } from "vitest";
import { getWeeklyCounts, submitFeedback } from "./feedbackService";

describe("feedbackService", () => {
    it("counts 조회", async () => {
        const counts = await getWeeklyCounts("2025-08-04");
        expect(counts.MON).toBeTypeOf("number");
    });

    it("피드백 제출 201", async () => {
        const res = await submitFeedback({
            weekStartDate: "2025-08-04",
            cleaningAmountScore: 4,
            recommendedTimeScore: 5,
            comment: "테스트",
        });
        expect(res.status).toBe(201);
    });
});
