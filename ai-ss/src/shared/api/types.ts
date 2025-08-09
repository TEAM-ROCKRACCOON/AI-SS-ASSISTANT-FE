// src/shared/api/types.ts
export type IsoDate = string;        // "2025-08-08"
export type ClockHM = string;        // "09:30"
export type Id = string;

export type ApiError = { code: string; message: string; details?: unknown };
