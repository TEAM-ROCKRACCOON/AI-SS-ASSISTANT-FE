// src/pages/onboarding/NicknamePage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerNickname } from "@/entities/user/api";
import { getAccessToken } from "@/lib/authService";

type SimpleRes = { status: number; message: string };

export default function NicknamePage() {
    const [nickname, setNickname] = useState("");
    const navigate = useNavigate();

    // ✅ 토큰 가드
    useEffect(() => {
        if (!getAccessToken()) {
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    const m = useMutation<SimpleRes, unknown, string>({
        mutationFn: registerNickname,
        onSuccess: (res) => {
            const msg = res?.message ?? "닉네임이 등록되었습니다.";
            alert(msg);
            // ✅ 온보딩 다음 단계로 이동 (라우트 경로와 일치)
            navigate("/onboarding/address");
        },
        onError: (err: unknown) => {
            const msg =
                typeof err === "object" &&
                err !== null &&
                "response" in err &&
                // @ts-expect-error 런타임 방어
                err?.response?.data?.message
                    ? // @ts-expect-error
                    err.response.data.message
                    : err instanceof Error
                        ? err.message
                        : "닉네임 등록에 실패했습니다.";
            alert(msg);
        },
    });

    const handleNext = () => {
        const v = nickname.trim();
        if (!v) {
            alert("닉네임을 입력해주세요.");
            return;
        }
        m.mutate(v);
    };

    return (
        <div className="min-h-screen flex flex-col justify-between px-6 py-10 bg-white">
            <div>
                <h2 className="text-2xl font-semibold mb-2">닉네임을 알려주세요</h2>
                <p className="text-gray-500 mb-8">서비스에서 사용할 이름이에요</p>

                <input
                    type="text"
                    placeholder="예: 바위너구리"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    disabled={m.isPending}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                />
            </div>

            <button
                onClick={handleNext}
                disabled={m.isPending}
                className="bg-blue-500 text-white text-lg font-medium py-4 rounded-xl hover:bg-blue-600 transition disabled:opacity-50"
            >
                {m.isPending ? "등록 중..." : "다음으로"}
            </button>
        </div>
    );
}