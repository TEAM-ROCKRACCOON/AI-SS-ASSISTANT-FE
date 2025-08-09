// src/pages/onboarding/GoogleCalendarConnectPage.tsx
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { connectCalendar } from "@/entities/user/api";

export default function GoogleCalendarConnectPage() {
    const navigate = useNavigate();

    const m = useMutation({
        mutationFn: connectCalendar,
        onSuccess: (res) => {
            // 201/200 모두 성공으로 처리
            alert(res?.message ?? "캘린더 연동에 성공했습니다.");
            navigate("/today"); // 다음 단계 원하는 경로로
        },
        onError: (err: unknown) => {
            const msg = err instanceof Error ? err.message : "캘린더 연동에 실패했습니다.";
            alert(msg);
        },
    });

    return (
        <main className="p-6 max-w-md mx-auto text-center space-y-4">
            <h1 className="text-2xl font-bold">Google 캘린더 연동</h1>
            <p className="text-gray-600">
                버튼을 누르면 최근 2주~앞으로 2주 일정이 서버로 전송돼요.
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
