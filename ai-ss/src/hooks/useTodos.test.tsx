// @vitest-environment jsdom
// src/hooks/useTodos.test.tsx
import { describe, it, expect } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { withClient } from "@/test/utils";
import { useTodayTodos, usePatchTodoTime, usePatchTodoDone } from "./useTodos";
import { http, HttpResponse } from "msw";
import { server } from "@/test/mswServer";

describe("useTodos hooks", () => {
    it("낙관적 업데이트: 시간 수정", async () => {
        const { wrapper, qc } = withClient();

        // 초기 목록 로드
        const { result: q } = renderHook(() => useTodayTodos(), { wrapper });
        await waitFor(() => expect(q.current.data?.length).toBeGreaterThan(0));
        const id = q.current.data![0].id;

        // 서버 응답 지연 → 낙관적 업데이트가 먼저 보이는지 확인
        server.use(
            http.patch("/api/v1/todo/time/:id", async () => {
                await new Promise((r) => setTimeout(r, 150));
                return HttpResponse.json({ status: 200, message: "ok" });
            }),
        );

        // mutate 실행
        const { result: m } = renderHook(() => usePatchTodoTime(), { wrapper });
        act(() => {
            m.current.mutate({ id, time: "11:00" });
        });

        // 캐시가 "11:00"으로 바뀔 때까지 대기
        await waitFor(() => {
            const cached = qc.getQueryData<any>(["todos", "today"])!;
            expect(cached.find((t: any) => t.id === id).time).toBe("11:00");
        });
    });

    it("낙관적 업데이트: 완료 토글", async () => {
        const { wrapper, qc } = withClient();

        // 초기 목록 로드
        const { result: q } = renderHook(() => useTodayTodos(), { wrapper });
        await waitFor(() => expect(q.current.data?.length).toBeGreaterThan(0));
        const id = q.current.data![0].id;

        // 서버 응답 지연
        server.use(
            http.patch("/api/v1/todo/isdone/:id", async () => {
                await new Promise((r) => setTimeout(r, 150));
                return HttpResponse.json({ status: 200, message: "ok" });
            }),
        );

        // mutate 실행
        const { result: m } = renderHook(() => usePatchTodoDone(), { wrapper });
        act(() => {
            m.current.mutate({ id, completed: true });
        });

        // 캐시가 true로 바뀔 때까지 대기
        await waitFor(() => {
            const cached = qc.getQueryData<any>(["todos", "today"])!;
            expect(cached.find((t: any) => t.id === id).completed).toBe(true);
        });
    });
});
