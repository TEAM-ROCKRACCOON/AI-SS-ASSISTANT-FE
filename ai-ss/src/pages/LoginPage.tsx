// src/pages/LoginPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildGoogleAuthUrl, setTokens } from "@/lib/authService";
import { loginWithAuthorizationCode } from "@/lib/userService";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
    const nav = useNavigate();
    const [authCode, setAuthCode] = useState("");
    const [loading, setLoading] = useState(false);

    // 가이드 그대로: 백엔드 콜백(/login/oauth2/code/google) 사용 → 구글 동의 후 백엔드로 리다이렉트됨
    // 주소창에 표시된 ?code=... 값을 사용자가 복사해와 아래 입력칸에 붙여넣는 플로우
    const onGoogleLogin = () => {
        window.location.href = buildGoogleAuthUrl();
    };

    const onSubmitCode = async () => {
        const code = authCode.trim();
        if (!code) return;
        try {
            setLoading(true);
            // 백엔드 가이드: query params 로 authorizationCode, body 에 socialType: "GOOGLE"
            // 프로젝트 구현에 따라 함수 시그니처가 (code) 또는 (code, "GOOGLE") 일 수 있어 아래 한 줄로 호출
            // 필요 시 userService 쪽 시그니처 확인 후 맞춰주세요.
            const res = await loginWithAuthorizationCode(code, "GOOGLE");

            // 응답에서 토큰을 userService가 이미 저장하면 생략 가능.
            // 만약 userService가 저장하지 않는다면 아래처럼 직접 저장:
            // const { accessToken, refreshToken } = res?.data ?? {};
            // if (accessToken) setTokens(accessToken, refreshToken);

            nav("/init");
        } catch (e) {
            console.error(e);
            alert("로그인에 실패했습니다. 인가코드 또는 서버 상태를 확인하세요.");
        } finally {
            setLoading(false);
        }
    };

    // 개발용: 목서버/로컬 테스트 시 임시 토큰 주입
    const onDevLogin = () => {
        setTokens(
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3NTk2NDAwNzgsImV4cCI6MTc5MTE3NjA3OCwidXNlcklkIjoxLCJyb2xlIjoiUk9MRV9VU0VSIn0.nU4SM_HQ_ZYWw6wBq6t6_x_WbDS46fJcT9ZdWSmhthkJpMMvVxtaZQYNg6pJdLo9YY5YiJzkqkoEd_vO_V0MQg"
        );
        nav("/home");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
            <div className="w-full max-w-md space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-semibold">로그인</h1>
                    <p className="text-sm text-gray-500">
                        가이드 방식으로 진행 시, 구글 로그인 후 백엔드 경로로 리다이렉트됩니다.
                        그 화면에서 주소창의 <b>code=...</b> 값을 복사해 아래에 붙여넣어 주세요.
                    </p>
                </div>

                <Button
                    onClick={onGoogleLogin}
                    isLoading={loading}          // ✅ 추가
                    disabled={loading}
                    className="w-full justify-center"
                >
                    Google로 계속하기
                </Button>

                <div className="space-y-2">
                    <label className="text-sm font-medium">인가코드 붙여넣기</label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="예: 4/0AVGzR1AAfV-7-..."
                            value={authCode}
                            onChange={(e) => setAuthCode(e.target.value)}
                        />
                        <Button
                            onClick={onSubmitCode}
                            isLoading={loading}          // ✅ 추가
                            disabled={loading || !authCode.trim()}
                        >
                            코드 제출
                        </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                        예시: https://aissbis.shop/login/oauth2/code/google<b>?code=여기값</b>
                    </p>
                </div>

                <Button
                    variant="secondary"
                    onClick={onDevLogin}
                    isLoading={loading}          // ✅ 추가
                    disabled={loading}           // (선택) isLoading가 있으면 disabled는 안 줘도 됨
                    className="w-full justify-center"
                >
                    개발용 토큰으로 계속
                </Button>
            </div>
        </div>
    );
}
