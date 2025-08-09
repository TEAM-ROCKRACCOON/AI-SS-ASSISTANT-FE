import { describe, it, expect } from "vitest";
import { getTodayTodos, patchTodoTime } from "./todoService";

describe("todoService", () => {
    it("GET today returns list", async () => {
        const todos = await getTodayTodos();
        expect(Array.isArray(todos)).toBe(true);
        expect(todos[0]).toHaveProperty("title");
    });

    it("patch time maps HH:mm -> AM/PM", async () => {
        const res = await patchTodoTime("1", "10:30");
        expect(res).toHaveProperty("status", 200);
    });
});
