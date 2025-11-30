// src/pages/FeedbackPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useWeeklyCounts, useSubmitFeedback } from "@/hooks/useFeedback";
//import { useAuthStore } from "@/entities/user/model/authStore";
import { getAccessToken } from "@/lib/authService"; // ✅
import { useNavigate } from "react-router-dom";

function startOfISOWeek(date = new Date()): Date {
    const d = new Date(date);
    const day = (d.getDay() + 6) % 7;
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - day);
    return d;
}
function fmtISO(d: Date) {
    return [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, "0"),
        String(d.getDate()).padStart(2, "0"),
    ].join("-");
}

const DAYS: Array<"MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN"> = [
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT",
    "SUN",
];
const DAY_LABEL: Record<(typeof DAYS)[number], string> = {
    MON: "월",
    TUE: "화",
    WED: "수",
    THU: "목",
    FRI: "금",
    SAT: "토",
    SUN: "일",
};

export default function FeedbackPage() {
    const [weekStartDate, setWeekStartDate] = useState(() => fmtISO(startOfISOWeek()));
    //const accessToken = useAuthStore((s) => s.accessToken);
    const navigate = useNavigate();

    useEffect(() => {
        if (!getAccessToken()) {
            navigate("/login", { replace: true }); // 또는 window.location.href="/login"
        }
    }, [navigate]);

    const { data: counts, isLoading, isError } = useWeeklyCounts(weekStartDate);
    const submit = useSubmitFeedback();

    const max = useMemo(() => {
        const vals = counts ? Object.values(counts) : [0];
        return Math.max(...vals, 1);
    }, [counts]);

    const [cleaningAmountScore, setAmount] = useState(3);
    const [recommendedTimeScore, setTimeScore] = useState(3);
    const [comment, setComment] = useState("");

    const handleSubmit = () => {
        if (submit.isPending) return;
        submit.mutate(
            {
                weekStartDate,
                cleaningAmountScore,
                recommendedTimeScore,
                comment,
            },
            {
                onSuccess: () => {
                    alert("제출 완료!");
                    setComment("");
                },
            }
        );
    };

    return (
        <div className="min-h-screen p-6 max-w-md mx-auto bg-white">
            <h1 className="text-2xl font-bold mb-4 text-center">주간 활동 & 피드백</h1>

            <div className="mb-6 flex items-center gap-3">
                <label className="text-sm text-gray-600">주 시작일(월):</label>
                <input
                    type="date"
                    value={weekStartDate}
                    onChange={(e) => setWeekStartDate(e.target.value)}
                    className="border rounded px-3 py-2"
                />
            </div>

            <section className="mb-8">
                <h2 className="font-semibold mb-2">요일별 완료 횟수</h2>
                {isLoading && <div>불러오는 중…</div>}
                {isError && <div className="text-red-600">조회 실패</div>}
                {counts && (
                    <ul className="space-y-2">
                        {DAYS.map((d) => {
                            const v = counts[d] ?? 0;
                            const w = Math.round((v / max) * 100);
                            return (
                                <li key={d} className="flex items-center gap-2">
                                    <span className="w-8 text-right text-sm text-gray-600">{DAY_LABEL[d]}</span>
                                    <div className="flex-1 h-3 bg-gray-200 rounded">
                                        <div className="h-3 rounded bg-blue-500" style={{ width: `${w}%` }} />
                                    </div>
                                    <span className="w-6 text-right text-sm">{v}</span>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>

            <section className="space-y-3 border-t pt-4">
                <h2 className="font-semibold">간단 피드백</h2>
                <label className="block text-sm">
                    청소 양 만족도 (1~5)
                    <input
                        type="number"
                        min={1}
                        max={5}
                        value={cleaningAmountScore}
                        onChange={(e) =>
                            setAmount(Math.max(1, Math.min(5, Number(e.target.value) || 1)))
                        }
                        className="mt-1 border rounded px-3 py-2 w-full"
                    />
                </label>
                <label className="block text-sm">
                    추천 시간대 만족도 (1~5)
                    <input
                        type="number"
                        min={1}
                        max={5}
                        value={recommendedTimeScore}
                        onChange={(e) =>
                            setTimeScore(Math.max(1, Math.min(5, Number(e.target.value) || 1)))
                        }
                        className="mt-1 border rounded px-3 py-2 w-full"
                    />
                </label>
                <label className="block text-sm">
                    코멘트(선택)
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="mt-1 border rounded px-3 py-2 w-full"
                        rows={3}
                        placeholder="개선사항이나 의견을 적어주세요"
                    />
                </label>
                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    disabled={submit.isPending}
                >
                    {submit.isPending ? "제출 중..." : "제출"}
                </button>
                {submit.isSuccess && <p className="text-green-600 text-sm mt-2">제출 완료!</p>}
                {submit.isError && <p className="text-red-600 text-sm mt-2">제출 실패</p>}
            </section>
        </div>
    );
}
