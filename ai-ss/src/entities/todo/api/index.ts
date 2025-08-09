// src/entities/todo/api/index.ts
import { http } from "@/shared/api/http";
import type { Todo } from "@/entities/todo/model/types";
import type { Id, ClockHM, IsoDate } from "@/shared/api/types";


export type { Todo } from "@/entities/todo/model/types";

// GET 오늘 할 일
export async function getTodayTodos() {
    const { data } = await http.get<{ todos: Todo[] }>("/api/v1/todo/today");
    return data.todos;
}

// GET 주간(응답 스펙 확정 필요)
export async function getWeekTodos() {
    const { data } = await http.get<{ days: Record<IsoDate, Todo[]> }>("/api/v1/todo/week");
    return data.days;
}

// POST 추가
export async function addTodo(payload: { title: string; date: IsoDate; time: ClockHM }) {
    const { data } = await http.post<{ todo: Todo }>("/api/v1/todo", payload);
    return data.todo;
}

// PATCH 시간 수정
export async function patchTodoTime(todoId: Id, time: ClockHM) {
    const { data } = await http.patch<{ todo: Todo }>(`/api/v1/todo/time/${todoId}`, { time });
    return data.todo;
}

// PATCH 완료여부 수정
export async function patchTodoDone(todoId: Id, completed: boolean) {
    const { data } = await http.patch<{ todo: Todo }>(`/api/v1/todo/isdone/${todoId}`, { completed });
    return data.todo;
}

// DELETE 삭제
export async function deleteTodo(todoId: Id) {
    await http.delete(`/api/v1/todo/${todoId}`);
}
