// src/index.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// ※ 가이드(백엔드 콜백 + 코드 붙여넣기)만 쓸 거면 이 Provider는 없어도 됩니다.
//    추후 useGoogleLogin 같은 SDK를 쓸 계획이면 유지하세요.
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

async function bootstrap() {
    // MSW: 개발이거나 VITE_USE_MSW=true일 때만 구동
    try {
        const useMSW =
            import.meta.env.DEV || String(import.meta.env.VITE_USE_MSW) === "true";
        if (useMSW) {
            const { startMock } = await import("./mocks/startMock");
            await startMock();
        }
    } catch (e) {
        // MSW 초기화 실패해도 앱 실행은 계속
        console.warn("[MSW] start failed:", e);
    }

    // root 보장
    let container = document.getElementById("root");
    if (!container) {
        container = document.createElement("div");
        container.id = "root";
        document.body.appendChild(container);
    }

    const root = createRoot(container);

    // React Query 기본 설정(필요 시 조정)
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: 1,
                staleTime: 30_000,
                refetchOnWindowFocus: false,
            },
        },
    });

    // App은 워커/프리로드 이후 렌더
    const { default: App } = await import("./App");

    // 구글 SDK를 실제로 쓰지 않는다면 GoogleOAuthProvider 제거 가능
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "dummy";

    root.render(
        <React.StrictMode>
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <QueryClientProvider client={queryClient}>
                    <App />
                </QueryClientProvider>
            </GoogleOAuthProvider>
        </React.StrictMode>
    );
}

bootstrap().catch((e) => {
    console.error("bootstrap failed:", e);
});
