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

    const onGoogleLogin = () => {
        window.location.href = buildGoogleAuthUrl();
    };

    const onSubmitCode = async () => {
        const code = authCode.trim();
        if (!code) return;
        try {
            setLoading(true);

            // userService가 토큰 저장까지 담당
            await loginWithAuthorizationCode(code, "GOOGLE");

            nav("/init");
        } catch (e) {
            console.error(e);
            alert("로그인에 실패했습니다. 인가코드 또는 서버 상태를 확인하세요.");
        } finally {
            setLoading(false);
        }
    };

    // 개발용: 목/로컬 테스트용 토큰
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
                    isLoading={loading}
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
                            isLoading={loading}
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
                    isLoading={loading}
                    disabled={loading}
                    className="w-full justify-center"
                >
                    개발용 토큰으로 계속
                </Button>
            </div>
        </div>
    );
}