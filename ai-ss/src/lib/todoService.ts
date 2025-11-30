// src/lib/todoService.ts
import { http } from "@/shared/api/http";
import { ApiResponse } from "@/shared/api/types";

export type TodoPayload = {
    title: string;
    time?: string | null;
};

export type UpdateTodoPayload = {
    id: string;
    time?: string;
};

export type PatchDonePayload = {
    id: string;
    isDone: boolean;
};

/**
 * 오늘 할 일 가져오기
 * GET /api/v1/todo/today
 */
export function getTodayTodos(): Promise<ApiResponse<any>> {
    return http.get("/api/v1/todo/today");
}

/**
 * 새로운 todo 생성
 * POST /api/v1/todo
 */
export function addTodo(payload: TodoPayload): Promise<ApiResponse<any>> {
    return http.post("/api/v1/todo", payload);
}

/**
 * 완료 여부 업데이트
 * PATCH /api/v1/todo/isdone/{todoId}
 */
export function patchTodoDone(
    { id, isDone }: PatchDonePayload
): Promise<ApiResponse<any>> {
    return http.patch(`/api/v1/todo/isdone/${id}`, { isDone });
}

/**
 * 시간 업데이트
 * PATCH /api/v1/todo/time/{todoId}
 */
export function updateTodo(
    { id, time }: UpdateTodoPayload
): Promise<ApiResponse<any>> {
    return http.patch(`/api/v1/todo/time/${id}`, { time });
}

/**
 * 항목 삭제
 * DELETE /api/v1/todo/{todoId}
 */
export function deleteTodo(id: string): Promise<ApiResponse<any>> {
    return http.delete(`/api/v1/todo/${id}`);
}

/**
 * 주간 todo 조회 (필요하면 사용)
 * GET /api/v1/todo/week?startDate=YYYY-MM-DD
 */
export function getWeeklyTodos(
    startDate: string
): Promise<ApiResponse<any>> {
    return http.get(`/api/v1/todo/week?startDate=${startDate}`);
}

/**
 * 객체 형태로도 쓸 수 있게 유지
 */
export const todoService = {
    getTodayTodos,
    addTodo,
    patchTodoDone,
    updateTodo,
    deleteTodo,
    getWeeklyTodos,
};
