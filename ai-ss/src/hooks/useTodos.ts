// src/hooks/useTodos.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/shared/api/http";

/* ============================================================
   공통 타입
============================================================ */
export type UITodo = {
    id: number | string;
    title: string;
    isDone: boolean;
    time?: string;
    startHour?: number;
    endHour?: number;
};

export type WeekDayTodos = {
    date: string;          // YYYY-MM-DD
    todos: UITodo[];
};

/* ============================================================
   유틸
============================================================ */
function fmtISO(d: Date) {
    return [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, "0"),
        String(d.getDate()).padStart(2, "0"),
    ].join("-");
}

function buildWeekDates(startISO: string): string[] {
    const [y, m, d] = startISO.split("-").map(Number);
    const base = new Date(y, m - 1, d);
    const arr: string[] = [];
    for (let i = 0; i < 7; i++) {
        const dt = new Date(base);
        dt.setDate(base.getDate() + i);
        arr.push(fmtISO(dt));
    }
    return arr;
}

/* ============================================================
   모의 데이터 생성 (MSW / 서버다운 대비)
============================================================ */
function makeMockWeek(startISO: string): WeekDayTodos[] {
    const days = buildWeekDates(startISO);

    const titles = [
        "빨래하기",
        "바닥청소",
        "책상정리",
        "정리정돈",
        "쓰레기 분리",
        "세탁기 돌리기",
        "침구정리",
    ];

    return days.map((date, idx) => {
        const count = 2 + (idx % 3);
        const todos = Array.from({ length: count }, (_, i) => {
            const start = 6 + ((idx + i) % 10);
            const end = start + 1 + ((idx + i) % 2);
            const title = titles[(idx + i) % titles.length];

            return {
                id: Number(`${idx}${i}${date.replace(/-/g, "")}`),
                title,
                isDone: ((idx + i) % 4 === 0),
                startHour: start,
                endHour: end,
            };
        });

        return { date, todos };
    });
}

/* ============================================================
   주간 조회
============================================================ */
export function useWeeklyTodos(startISO: string) {
    return useQuery<WeekDayTodos[]>({
        queryKey: ["weekly-todos", startISO],
        queryFn: async () => {
            // 1) startDate 기반 서버 호출
            try {
                const res = await http.get("/api/v1/todo/weekly", {
                    params: { startDate: startISO },
                });
                const payload = res?.data?.data?.weeklyTodos ?? res?.data?.data;
                if (Array.isArray(payload)) return payload as WeekDayTodos[];
            } catch {}

            // 2) 모의 데이터
            return makeMockWeek(startISO);
        },
        staleTime: 30_000,
    });
}

/* ============================================================
   오늘 조회
============================================================ */
export function useTodayTodos() {
    const today = fmtISO(new Date());
    return useQuery<UITodo[]>({
        queryKey: ["today-todos", today],
        queryFn: async () => {
            try {
                const res = await http.get("/api/v1/todo/today");
                const payload = res?.data?.data?.todos ?? res?.data?.data;
                if (Array.isArray(payload)) {
                    return payload.map((t: any) => ({
                        id: t.id,
                        title: t.title,
                        isDone: t.isDone,
                        time: t.time,
                    }));
                }
            } catch {}

            // fallback
            return makeMockWeek(today)[0].todos;
        },
        staleTime: 15_000,
    });
}

/* ============================================================
   CREATE
============================================================ */
export function useAddTodo() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { title: string; time?: string }) => {
            const res = await http.post("/api/v1/todo", payload);
            return res.data?.data ?? res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["today-todos"] });
            qc.invalidateQueries({ queryKey: ["weekly-todos"] });
        },
    });
}

/* ============================================================
   UPDATE TITLE / TIME (PATCH 일부 필드)
============================================================ */
export function useUpdateTodo() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({
                               id,
                               patch,
                           }: {
            id: number | string;
            patch: Partial<{ title: string; time: string }>;
        }) => {
            const res = await http.patch(`/api/v1/todo/time/${id}`, patch);
            return res.data?.data ?? res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["today-todos"] });
            qc.invalidateQueries({ queryKey: ["weekly-todos"] });
        },
    });
}

/* ============================================================
   DELETE
============================================================ */
export function useDeleteTodo() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: number | string) => {
            const res = await http.delete(`/api/v1/todo/${id}`);
            return res.data?.data ?? res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["today-todos"] });
            qc.invalidateQueries({ queryKey: ["weekly-todos"] });
        },
    });
}

/* ============================================================
   DONE TOGGLE (TodayPage가 요구하는 훅)
============================================================ */
export function usePatchTodoDone() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({
                               id,
                               isDone,
                           }: {
            id: number | string;
            isDone: boolean;
        }) => {
            const res = await http.patch(`/api/v1/todo/isdone/${id}`, {
                isDone,
            });
            return res.data?.data ?? res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["today-todos"] });
            qc.invalidateQueries({ queryKey: ["weekly-todos"] });
        },
    });
}
