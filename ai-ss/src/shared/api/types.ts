// src/shared/api/types.ts

// 날짜/시간/ID 공통 타입
export type IsoDate = string;        // "2025-08-08"
export type ClockHM = string;        // "09:30"
export type Id = string;

// 공통 에러 응답
export type ApiError = {
    code: string;
    message: string;
    details?: unknown;
};

// 공통 성공 응답 래퍼
// 백엔드 응답이
// { status: number; message: string; data: T } 형태라고 가정
export type ApiResponse<T = unknown> = {
    status: number;
    message: string;
    data: T;
    error?: ApiError | null;
};
