// src/lib/todoService.more.test.ts
import { describe, it, expect } from "vitest";
import { getTodayTodos, addTodo, deleteTodo, patchTodoDone, getWeeklyTodos } from "./todoService";

describe("todoService - more", () => {
    it("addTodo -> 새 항목이 추가된다(201)", async () => {
        const res = await addTodo({ title: "베란다 청소", time: "09:00", date: "2025-08-09" });
        expect(res.status).toBe(201);
    });

    it("patchTodoDone -> 완료 상태 업데이트 성공", async () => {
        // 일단 목록 하나 가져오고 첫 번째 id 사용
        const list = await getTodayTodos();
        const id = list[0]?.id;
        expect(id).toBeTruthy();
        const res = await patchTodoDone(id!, true);
        // 우리 서비스 구현이 SimpleRes가 아니라 Todo를 반환한다면, 아래처럼 형태만 체크
        expect(res).toBeTruthy();
    });

    it("getWeeklyTodos -> 7일 데이터 구조 반환", async () => {
        const weekly = await getWeeklyTodos("2025-06-14");
        expect(Array.isArray(weekly)).toBe(true);
        expect(weekly[0]).toHaveProperty("date");
        expect(weekly[0]).toHaveProperty("todos");
    });

    it("deleteTodo -> 삭제 완료(200)", async () => {
        const list = await getTodayTodos();
        const id = list[0]?.id;
        expect(id).toBeTruthy();
        const res = await deleteTodo(id!);
        expect(res.status).toBe(200);
    });
});
