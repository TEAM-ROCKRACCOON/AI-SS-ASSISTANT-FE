// lib/exampleService.ts

import http from "@/shared/api/http";

// 루틴 더미 데이터 호출 예시
export const fetchDummyRoutines = async () => {
    const res = await http.get("/routines/dummy"); // BE 명세서에 따라 경로 수정 예정
    return res.data;
};

// 루틴 추가 예시
export const postRoutine = async (routine: {
    title: string;
    time: string;
}) => {
    const res = await http.post("/routines", routine);
    return res.data;
};
