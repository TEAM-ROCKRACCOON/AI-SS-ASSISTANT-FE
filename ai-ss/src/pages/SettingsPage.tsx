// src/pages/SettingsPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    useProfile,
    useUpdateProfile,
    useLogout,
    useWithdraw,
} from "@/hooks/useProfile";
import { getAccessToken, clearTokens } from "@/lib/authService";

export default function SettingsPage() {
    const navigate = useNavigate();
    const { data, isLoading, isError } = useProfile();
    const update = useUpdateProfile();
    const doLogout = useLogout();
    const doWithdraw = useWithdraw();

    // 로그인 가드: 목서버/실서버 공통
    useEffect(() => {
        const useMock = String(import.meta.env.VITE_USE_MOCK) === "true";
        if (useMock) return;

        // if (!getAccessToken()) {
        //     navigate("/login", { replace: true });
        // }
    }, [navigate]);


    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (data) {
            setNickname(data.nickname);
            setEmail(data.email);
        }
    }, [data]);

    if (isLoading) return <div className="p-6">불러오는 중...</div>;
    if (isError || !data) return <div className="p-6 text-red-600">프로필 로드 실패</div>;

    const onSave = () => {
        const n = nickname.trim();
        const e = email.trim();
        if (!n || !e) return;
        update.mutate(
            { nickname: n, email: e },
            { onSuccess: () => alert("프로필이 저장되었습니다.") }
        );
    };

    const onLogout = () => {
        doLogout.mutate(undefined, {
            onSuccess: () => {
                clearTokens(); // ✅ 토큰만 정리하면 MSW/실서버 모두 OK
                navigate("/login");
            },
        });
    };

    const onWithdraw = () => {
        if (!window.confirm("정말로 회원 탈퇴를 하시겠습니까? 탈퇴 후 복구가 불가능합니다.")) return;
        doWithdraw.mutate(undefined, {
            onSuccess: () => {
                clearTokens(); // ✅ 동일 처리
                navigate("/login");
            },
        });
    };

    return (
        <div className="max-w-xl mx-auto p-6 min-h-screen bg-white">
            <h1 className="text-2xl font-bold mb-8 text-center">설정</h1>

            {/* 프로필 */}
            <section className="mb-8 space-y-4">
                <h2 className="text-lg font-semibold">프로필</h2>

                <div className="space-y-2">
                    <label className="block text-sm text-gray-600">닉네임</label>
                    <input
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm text-gray-600">이메일</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <button
                    onClick={onSave}
                    disabled={update.isPending}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {update.isPending ? "저장 중..." : "프로필 저장"}
                </button>
            </section>

            {/*/!* 약관 링크 *!/*/}
            {/*<section className="mb-8">*/}
            {/*    <h2 className="text-lg font-semibold mb-2">약관</h2>*/}
            {/*    <a*/}
            {/*        href={data?.termsUrl || "#"}*/}
            {/*        target="_blank"*/}
            {/*        rel="noreferrer"*/}
            {/*        className="w-full inline-block px-4 py-3 bg-gray-100 rounded hover:bg-gray-200"*/}
            {/*    >*/}
            {/*        이용 약관 보기*/}
            {/*    </a>*/}
            {/*</section>*/}

            {/* 계정 관리 */}
            <section className="space-y-3">
                <button
                    onClick={onLogout}
                    disabled={doLogout.isPending}
                    className="w-full px-4 py-3 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                    {doLogout.isPending ? "로그아웃 중..." : "로그아웃"}
                </button>

                <button
                    onClick={onWithdraw}
                    disabled={doWithdraw.isPending}
                    className="w-full px-4 py-3 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                    {doWithdraw.isPending ? "탈퇴 처리 중..." : "회원 탈퇴"}
                </button>
            </section>
        </div>
    );
}
