// src/pages/WeekPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import { formatDateLabel, getWeekDays } from "@/lib/time";
import { WeeklySchedule, Block } from "@/components/WeeklySchedule";
import { getAccessToken } from "@/lib/authService";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import http from "@/shared/api/http";

type WeeklyApiItem = {
    date: string; // "YYYY-MM-DD"
    todos: Array<{ id: string | number; title: string; time?: string; isDone?: boolean }>;
};

type WeeklyApiResponse = {
    status: number;
    message: string;
    data: { weeklyTodos: WeeklyApiItem[] } | WeeklyApiItem[];
};

/** 시작일을 ISO 주(月~日) 기준으로 구함 (월요일 시작) */
function startOfISOWeek(date = new Date()): Date {
    const d = new Date(date);
    const day = (d.getDay() + 6) % 7; // 월=0
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - day);
    return d;
}

/** 12/24시간 문자열 -> 소수 시각(예: "09:30"|"09:30 AM"|"21:15" -> 9.5|21.25) */
function toHourFloat(t?: string): number | null {
    if (!t || typeof t !== "string") return null;
    const m = t.match(/^(\d{2}):(\d{2})(?:\s*(AM|PM))?$/i);
    if (!m) return null;
    let [, hh, mm, ap] = m;
    let H = parseInt(hh, 10);
    const M = parseInt(mm, 10);
    if (Number.isNaN(H) || Number.isNaN(M) || H > 23 || M > 59) return null;
    if (ap) {
        const AP = ap.toUpperCase();
        if (AP === "PM" && H !== 12) H += 12;
        if (AP === "AM" && H === 12) H = 0;
    }
    return H + M / 60;
}

/** 기준 날짜가 속한 주의 월요일(00:00) ISO 문자열 */
function getWeekStartISO(d: Date): string {
    const day = d.getDay(); // 0=일,1=월…
    const diffToMon = (day + 6) % 7;
    const monday = new Date(d);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(d.getDate() - diffToMon);
    const y = monday.getFullYear();
    const m = String(monday.getMonth() + 1).padStart(2, "0");
    const dd = String(monday.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
}

/** ISO 날짜 -> 월(0)~일(6) 인덱스 */
function getMonIndex(iso: string): number {
    const d = new Date(iso + "T00:00:00");
    let idx = (d.getDay() + 6) % 7; // 월=0
    if (idx < 0 || idx > 6 || Number.isNaN(idx)) idx = 0;
    return idx;
}

/** 간이 duration 매핑(분) – 제목 기반 임의값 */
function inferDurationMinutes(title: string): number {
    const t = title.toLowerCase();
    if (t.includes("분리수거") || t.includes("설거지")) return 30;
    if (t.includes("세탁") || t.includes("정리") || t.includes("환기")) return 45;
    if (t.includes("대청소") || t.includes("베란다")) return 120;
    if (t.includes("욕실") || t.includes("화장실")) return 60;
    return 60; // 기본 1h
}

function isFixedSchedule(title: string): boolean {
    const keywords = ["회의", "수업", "세미나", "운동"];
    return keywords.some((k) => title.includes(k));
}

// 강의/수업 duration 자동 계산
function getFixedScheduleDuration(title: string): number {
    if (title.includes("캡스톤")) return 180;
    if (title.includes("컴퓨터 그래픽스")) return 90;
    if (title.includes("패턴인식")) return 90;
    if (title.includes("세미나")) return 120;
    if (title.includes("강의") || title.includes("수업")) return 90;
    return 90;
}

/** 미완료 우선 + 시간 오름차순 정렬 */
function sortUndoneFirst<T extends { isDone?: boolean; time?: string }>(
    arr: T[]
): T[] {
    return arr.slice().sort((a, b) => {
        const ad = a.isDone ? 1 : 0;
        const bd = b.isDone ? 1 : 0;
        if (ad !== bd) return ad - bd; // 0(미완료) 먼저
        const A = toHourFloat(a.time);
        const B = toHourFloat(b.time);
        if (A == null && B == null) return 0;
        if (A == null) return 1;
        if (B == null) return -1;
        return A - B;
    });
}

function buildBlocks(weekly: WeeklyApiItem[]): Block[] {
    const blocks: Block[] = [];

    for (const dayItem of weekly) {
        const dayIdx = getMonIndex(dayItem.date);
        const todosSorted = sortUndoneFirst(dayItem.todos || []);

        for (const t of todosSorted) {
            const start = toHourFloat(t.time) ?? 9;

            let durMin: number;
            let type: Block["type"];

            if (isFixedSchedule(t.title)) {
                durMin = getFixedScheduleDuration(t.title);
                type = "schedule";
            } else {
                durMin = inferDurationMinutes(t.title);
                type = "cleaning";
            }

            const end = start + durMin / 60;

            blocks.push({
                summary: t.title,
                day: dayIdx,
                start,
                end,
                type,
                done: !!t.isDone,
            });
        }
    }

    return blocks;
}

/** 다양한 weekly 응답 포맷을 안전하게 추출 */
function extractWeekly(data: any): WeeklyApiItem[] {
    if (!data) return [];
    if (Array.isArray(data?.data?.weeklyTodos))
        return data.data.weeklyTodos as WeeklyApiItem[];
    if (Array.isArray(data?.weeklyTodos)) return data.weeklyTodos as WeeklyApiItem[];
    if (Array.isArray(data)) return data as WeeklyApiItem[];
    return [];
}

const WeekPage: React.FC = () => {
    const navigate = useNavigate();

    // 로그인 가드
    useEffect(() => {
        if (!getAccessToken()) {
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    const [baseDate, setBaseDate] = useState<Date>(startOfISOWeek());
    const [weeklyItems, setWeeklyItems] = useState<WeeklyApiItem[]>([]);
    const [weeklyLoading, setWeeklyLoading] = useState(false);
    const [weeklyError, setWeeklyError] = useState<string | null>(null);

    // 주간 데이터 fetch (주 시작일 기준)
    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            try {
                setWeeklyLoading(true);
                setWeeklyError(null);

                const startDate = getWeekStartISO(baseDate);

                // ✅ 스펙: GET /api/v1/todo/week?startDate=YYYY-MM-DD
                const res = await http.get<WeeklyApiResponse | WeeklyApiItem[]>(
                    "/api/v1/todo/week",
                    {
                        params: { startDate },
                        signal: controller.signal as AbortSignal,
                    }
                );

                const items = extractWeekly(res.data);
                setWeeklyItems(items);
            } catch (e: any) {
                // axios 취소
                if (e?.code === "ERR_CANCELED") return;
                if (e?.name === "CanceledError") return;

                setWeeklyError(
                    e?.message ?? "주간 데이터를 불러오는 중 오류가 발생했습니다."
                );
            } finally {
                setWeeklyLoading(false);
            }
        })();

        return () => controller.abort();
    }, [baseDate]);

    const blocks: Block[] = useMemo(() => buildBlocks(weeklyItems), [weeklyItems]);

    const label = formatDateLabel(baseDate);
    const days = getWeekDays(baseDate);

    const start = new Date(baseDate);
    const end = new Date(baseDate);
    end.setDate(end.getDate() + 6);

    const rangeLabel = `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;

    const handlePrevWeek = () => {
        const d = new Date(baseDate);
        d.setDate(d.getDate() - 7);
        setBaseDate(startOfISOWeek(d));
    };

    const handleNextWeek = () => {
        const d = new Date(baseDate);
        d.setDate(d.getDate() + 7);
        setBaseDate(startOfISOWeek(d));
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* 상단 헤더 */}
            <header className="flex items-center justify-between px-4 py-3 border-b sticky top-0 bg-white z-10">
                <button onClick={handlePrevWeek} className="text-xl">
                    ◂
                </button>

                <div className="flex flex-col items-center">
                    <h1 className="text-lg font-semibold">{rangeLabel}</h1>

                    {weeklyLoading && (
                        <span className="text-xs text-gray-500">불러오는 중…</span>
                    )}
                    {weeklyError && (
                        <span className="text-xs text-red-500">{weeklyError}</span>
                    )}
                </div>

                <button onClick={handleNextWeek} className="text-xl">
                    ▸
                </button>
            </header>

            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 text-center text-sm font-medium py-2 border-b bg-gray-50">
                {days.map((d) => (
                    <div key={d}>{d}</div>
                ))}
            </div>

            {/* 본문 타임라인 */}
            <div className="overflow-x-auto p-2">
                <WeeklySchedule blocks={blocks} />
            </div>
        </div>
    );
};

export default WeekPage;