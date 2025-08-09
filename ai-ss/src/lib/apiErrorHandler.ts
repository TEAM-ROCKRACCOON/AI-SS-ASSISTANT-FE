// src/lib/apiErrorHandler.ts (참고)
import type { AxiosError } from "axios";
export function handleApiError(error: AxiosError) {
    const data = error.response?.data as any;
    const message = data?.message || "요청 처리 중 오류가 발생했습니다.";
    console.error("[API ERROR]", error);
    return Promise.reject(new Error(message));
}
