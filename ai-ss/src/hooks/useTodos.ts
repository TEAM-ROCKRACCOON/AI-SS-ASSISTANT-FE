// src/hooks/useTodos.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getTodayTodos,
    addTodo as addTodoApi,
    patchTodoTime as patchTodoTimeApi,
    patchTodoDone as patchTodoDoneApi,
    deleteTodo as deleteTodoApi,
    getWeeklyTodos,
    type WeeklyTodosByDate,
    type Todo,
    type SimpleRes,
} from "@/lib/todoService";
import { getWeeklyCounts, type Counts } from "@/lib/feedbackService";

// 오늘 목록 키 (테스트/페이지와 동일 키 유지)
const TODAY_KEY = ["todos", "today"] as const;

/** 오늘 할 일 목록 */
export const useTodayTodos = () =>
    useQuery<Todo[]>({
        queryKey: TODAY_KEY,
        queryFn: getTodayTodos,
    });

/** 할 일 추가 (date/HH:mm 전달) */
export const useAddTodo = () => {
    const qc = useQueryClient();
    return useMutation<SimpleRes, unknown, { title: string; time: string; date: string }>({
        mutationFn: addTodoApi,
        onSuccess: () => qc.invalidateQueries({ queryKey: TODAY_KEY }),
    });
};

/** 시간 수정 (낙관적 업데이트: 캐시엔 HH:mm 그대로 반영) */
export const usePatchTodoTime = () => {
    const qc = useQueryClient();
    return useMutation<SimpleRes, unknown, { id: string; time: string }, { prev?: Todo[] }>({
        mutationFn: ({ id, time }) => patchTodoTimeApi(id, time),
        onMutate: async (vars) => {
            await qc.cancelQueries({ queryKey: TODAY_KEY });
            const prev = qc.getQueryData<Todo[]>(TODAY_KEY);
            qc.setQueryData<Todo[]>(TODAY_KEY, (old) =>
                (old ?? []).map((t) => (t.id === vars.id ? { ...t, time: vars.time } : t)),
            );
            return { prev };
        },
        onError: (_e, _v, ctx) => {
            if (ctx?.prev) qc.setQueryData(TODAY_KEY, ctx.prev);
        },
        onSettled: () => qc.invalidateQueries({ queryKey: TODAY_KEY }),
    });
};

/** 완료 토글 (낙관적 업데이트) */
export const usePatchTodoDone = () => {
    const qc = useQueryClient();
    // 서비스 반환형이 SimpleRes이든 Todo이든 신경 안 쓰게 <unknown>으로 둠
    return useMutation<unknown, unknown, { id: string; completed: boolean }, { prev?: Todo[] }>({
        mutationFn: ({ id, completed }) => patchTodoDoneApi(id, completed),
        onMutate: async (vars) => {
            await qc.cancelQueries({ queryKey: TODAY_KEY });
            const prev = qc.getQueryData<Todo[]>(TODAY_KEY);
            qc.setQueryData<Todo[]>(TODAY_KEY, (old) =>
                (old ?? []).map((t) => (t.id === vars.id ? { ...t, completed: vars.completed } : t)),
            );
            return { prev };
        },
        onError: (_e, _v, ctx) => {
            if (ctx?.prev) qc.setQueryData(TODAY_KEY, ctx.prev);
        },
        onSettled: () => qc.invalidateQueries({ queryKey: TODAY_KEY }),
    });
};

/** 삭제 */
export const useDeleteTodo = () => {
    const qc = useQueryClient();
    return useMutation<SimpleRes, unknown, string>({
        mutationFn: deleteTodoApi,
        onSuccess: () => qc.invalidateQueries({ queryKey: TODAY_KEY }),
    });
};

/** 주간 루틴 목록 */
export const useWeeklyTodos = (startDate: string) =>
    useQuery<WeeklyTodosByDate[]>({
        queryKey: ["todos", "weekly", startDate],
        queryFn: () => getWeeklyTodos(startDate),
        enabled: !!startDate,
    });

/** 주간 요일별 완료횟수 */
export const useWeeklyDoneCounts = (weekStartDate: string) =>
    useQuery<Counts>({
        queryKey: ["todos", "weekly-counts", weekStartDate],
        queryFn: () => getWeeklyCounts(weekStartDate),
        enabled: !!weekStartDate,
    });
