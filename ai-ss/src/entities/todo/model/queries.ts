// src/entities/todo/model/queries.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../api";

export const useTodayTodos = () =>
    useQuery({ queryKey: ["todo","today"], queryFn: api.getTodayTodos });

export const useWeekTodos = () =>
    useQuery({ queryKey: ["todo","week"], queryFn: api.getWeekTodos });

export const useAddTodo = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: api.addTodo,
        onSuccess: () => { qc.invalidateQueries({ queryKey: ["todo","today"] }); qc.invalidateQueries({ queryKey: ["todo","week"] }); },
    });
};

export const usePatchTodoTime = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, time }: { id: string; time: string }) => api.patchTodoTime(id, time),
        onMutate: async ({ id, time }) => {
            await qc.cancelQueries({ queryKey: ["todo","today"] });
            const prev = qc.getQueryData<any>(["todo","today"]);
            qc.setQueryData<any>(["todo","today"], (old: any) =>
                Array.isArray(old) ? old.map((t:any)=> t.id===id?{...t,time}:t) : old
            );
            return { prev };
        },
        onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(["todo","today"], ctx.prev),
        onSettled: () => qc.invalidateQueries({ queryKey: ["todo","today"] }),
    });
};

export const usePatchTodoDone = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, completed }: { id: string; completed: boolean }) => api.patchTodoDone(id, completed),
        onMutate: async ({ id, completed }) => {
            await qc.cancelQueries({ queryKey: ["todo","today"] });
            const prev = qc.getQueryData<any>(["todo","today"]);
            qc.setQueryData<any>(["todo","today"], (old: any) =>
                Array.isArray(old) ? old.map((t:any)=> t.id===id?{...t,completed}:t) : old
            );
            return { prev };
        },
        onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(["todo","today"], ctx.prev),
        onSettled: () => qc.invalidateQueries({ queryKey: ["todo","today"] }),
    });
};

export const useDeleteTodo = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: api.deleteTodo,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["todo","today"] }),
    });
};
