// src/entities/todo/model/types.ts
import { Id, ClockHM, IsoDate } from "@/shared/api/types";

export interface Todo {
    id: Id;
    title: string;
    description?: string;
    date: IsoDate;       // 오늘 목록이면 오늘 날짜
    time: ClockHM;       // "HH:mm"
    completed: boolean;
}
