// src/lib/todoService.ts
import http from "@/shared/api/http";
import { toAmPm } from "@/lib/time";

/** 오늘 화면에서 쓰는 기본 Todo (time = "HH:mm") */
export type Todo = {
    id: string;
    title: string;
    time: string;      // 화면/캐시에서는 "HH:mm"
    completed: boolean;
};

export type SimpleRes = { status: number; message: string };

/** 주간 조회용 타입 */
export type WeeklyTodoItem = {
    id: string;
    title: string;
    isDone: boolean;
};

export type WeeklyTodosByDate = {
    date: string;                 // YYYY-MM-DD
    todos: WeeklyTodoItem[];
};

/* ------------------------------ utils ------------------------------ */
function unwrapArray<T>(data: unknown, key: string): T[] {
    return Array.isArray(data) ? (data as T[]) : ((data as any)?.[key] as T[]);
}

/* ------------------------------- APIs ------------------------------ */

/** 오늘 할 일 목록 */
export async function getTodayTodos(): Promise<Todo[]> {
    const res = await http.get<{ todos: Todo[] } | Todo[]>("/api/v1/todo/today");
    return unwrapArray<Todo>(res.data, "todos");
}

/** 할 일 추가 (서버는 "HH:mm AM/PM" + date 요구) */
export async function addTodo(payload: { title: string; time: string; date: string }): Promise<SimpleRes> {
    const body = { title: payload.title, time: toAmPm(payload.time), date: payload.date };
    const res = await http.post<SimpleRes>("/api/v1/todo", body, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}

/** 시간 수정 (화면은 HH:mm, 서버는 "HH:mm AM/PM") */
export async function patchTodoTime(todoId: string, timeHHmm: string): Promise<SimpleRes> {
    const payload = { time: toAmPm(timeHHmm) };
    const res = await http.patch<SimpleRes>(`/api/v1/todo/time/${todoId}`, payload, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}

/** 완료 여부 수정 (서버 스펙: { isDone: boolean }) */
export async function patchTodoDone(todoId: string, isDone: boolean): Promise<SimpleRes> {
    const res = await http.patch<SimpleRes>(
        `/api/v1/todo/isdone/${todoId}`,
        { isDone },
        { headers: { "Content-Type": "application/json" } },
    );
    return res.data;
}

/** 삭제 */
export async function deleteTodo(todoId: string): Promise<SimpleRes> {
    const res = await http.delete<SimpleRes>(`/api/v1/todo/${todoId}`);
    return res.data;
}

/** 주간 루틴 목록 조회 */
export async function getWeeklyTodos(startDate: string): Promise<WeeklyTodosByDate[]> {
    const res = await http.get<{
        status: number;
        message: string;
        data: { weeklyTodos: WeeklyTodosByDate[] };
    }>("/api/v1/todo/weekly", { params: { startDate } });
    return res.data?.data?.weeklyTodos ?? [];
}
