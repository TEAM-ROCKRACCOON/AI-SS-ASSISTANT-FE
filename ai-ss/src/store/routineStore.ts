// store/routineStore.ts
// 추천 루틴 및 수행 상태 관리

import { create } from "zustand";

type Routine = {
    id: number;
    title: string;
    completed: boolean;
    date: string; // YYYY-MM-DD
};

type RoutineStore = {
    routines: Record<string, Routine[]>; // 날짜별 루틴
    setRoutinesForDate: (date: string, routines: Routine[]) => void;
    toggleRoutineDone: (date: string, id: number) => void;
};

export const useRoutineStore = create<RoutineStore>((set) => ({
    routines: {},
    setRoutinesForDate: (date, routines) =>
        set((state) => ({
            routines: { ...state.routines, [date]: routines },
        })),
    toggleRoutineDone: (date, id) =>
        set((state) => ({
            routines: {
                ...state.routines,
                [date]: state.routines[date].map((r) =>
                    r.id === id ? { ...r, completed: !r.completed } : r
                ),
            },
        })),
}));
