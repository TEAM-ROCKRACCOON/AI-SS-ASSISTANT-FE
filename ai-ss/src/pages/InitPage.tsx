// src/pages/InitPage.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "@/lib/authService";
import { useProfile } from "@/hooks/useProfile";

export default function InitPage() {
    const navigate = useNavigate();
    const { data: profile, isLoading, isError } = useProfile();

    // ✅ 토큰 가드: 비로그인 접근 차단
    useEffect(() => {
        if (!getAccessToken()) {
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    // ✅ 프로필 로딩 완료 후 분기
    useEffect(() => {
        if (isLoading) return;

        if (isError) {
            // 토큰은 있는데 프로필을 못 불러온 경우 → 그냥 다시 로그인 유도
            alert("프로필 정보를 불러올 수 없습니다. 다시 로그인 해주세요.");
            navigate("/login", { replace: true });
            return;
        }

        if (!profile) return;

        // 🔥 온보딩 여부 판정 로직
        // 예시: nickname이 없으면 아직 온보딩 안 된 상태로 간주
        if (!profile.nickname) {
            navigate("/onboarding/nickname", { replace: true });
        } else {
            // 온보딩 완료 유저 → 홈으로
            navigate("/home", { replace: true });
        }
    }, [profile, isLoading, isError, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <h1 className="text-xl font-semibold mb-2">초기 설정 중...</h1>
            <p className="text-sm text-gray-500">
                프로필 정보를 불러오고 있어요. 잠시만 기다려 주세요.
            </p>
        </div>
    );
}