// src/pages/onboarding/GoogleCalendarConnectPage.tsx
import React, { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { connectCalendar } from "@/entities/user/api";
import { useAuthStore } from "@/entities/user/model/authStore";
import { getAccessToken } from "@/lib/authService"; // 추가

type ApiResponse<T = unknown> = { status: number; message: string; data?: T };


export default function GoogleCalendarConnectPage() {
    const navigate = useNavigate();
    const accessToken = useAuthStore((s) => s.accessToken);

    // 로그인 가드
    // useEffect(() => {
    //     if (!accessToken && !localStorage.getItem("accessToken")) {
    //         navigate("/login");
    //     }
    // }, [accessToken, navigate]);

    useEffect(() => {
        if (!getAccessToken()) {
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    const m = useMutation<ApiResponse, unknown, void>({
        mutationFn: connectCalendar,
        onSuccess: (res) => {
            // 200/201 모두 성공 처리
            alert(res?.message ?? "캘린더 연동에 성공했습니다.");
            navigate("/today");
        },
        onError: (err: unknown) => {
            const msg =
                typeof err === "object" && err !== null && "response" in err
                    ? // @ts-expect-error: 런타임 방어
                    err?.response?.data?.message ?? "캘린더 연동에 실패했습니다."
                    : err instanceof Error
                        ? err.message
                        : "캘린더 연동에 실패했습니다.";
            alert(msg);
        },
    });

    return (
        <main className="p-6 max-w-md mx-auto text-center space-y-4">
            <h1 className="text-2xl font-bold">Google 캘린더 연동</h1>
            <p className="text-gray-600">
                버튼을 누르면 최근 2주 ~ 앞으로 2주 일정이 서버로 전송돼요.
            </p>

            <button
                onClick={() => m.mutate()}
                disabled={m.isPending}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl font-semibold"
            >
                {m.isPending ? "연동 중..." : "연동 시작"}
            </button>
        </main>
    );
}
