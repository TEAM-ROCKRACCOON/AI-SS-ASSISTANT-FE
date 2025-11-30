// types/routine.ts

export type Routine = {
    id: number;
    task: string;
    day: string;        // 예: "월요일"
    time: string;       // 예: "오전 9시"
    completed?: boolean; // 선택 속성: 완료 여부
    title: string;
    isDone: boolean;
};
