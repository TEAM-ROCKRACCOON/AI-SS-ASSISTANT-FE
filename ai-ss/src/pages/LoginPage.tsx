// src/pages/LoginPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { loginWithGoogleCode } from "@/lib/authService";
import { useAuthStore } from "@/entities/user/model/authStore"; // 현재 트리에 맞춰 경로 수정

export default function LoginPage() {
    const navigate = useNavigate();
    const setTokens = useAuthStore((s) => s.setTokens);

    const login = useGoogleLogin({
        flow: "auth-code",
        onSuccess: async (codeResponse) => {
            try {
                const code = codeResponse.code;
                const res = await loginWithGoogleCode(code); // BE 호출
                // 응답 래퍼 {status,message,data:{...}}
                const { accessToken, refreshToken, nickname, role } = res.data;
                setTokens({ accessToken, refreshToken, nickname, role });
                localStorage.setItem("accessToken", "dev-access-token"); // MSW의 TOKEN과 동일
                navigate("/home");
            } catch (e) {
                alert("로그인에 실패했습니다.");
                console.error(e);
            }
        },
        onError: () => alert("구글 로그인 팝업을 다시 시도해주세요."),
    });

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-blue-50 to-white">
            {/* ...생략(로고/문구) */}
            <button
                onClick={() => login()}
                className="flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-full px-6 py-3 shadow hover:shadow-md transition mb-4"
            >
                구글 계정으로 로그인
            </button>
        </div>
    );
}
