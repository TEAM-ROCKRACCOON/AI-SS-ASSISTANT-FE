// src/mocks/startMock.ts
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

/**
 * mock 서버 구동 함수
 * DEV 환경이거나 .env.local에서 VITE_USE_MSW=true면 실행
 */
export async function startMock() {
    const shouldStart =
        import.meta.env.DEV || import.meta.env.VITE_USE_MSW === "true";

    if (shouldStart) {
        const worker = setupWorker(...handlers);
        await worker.start({
            onUnhandledRequest: "bypass",
            // Vite의 base 경로를 고려해 안전하게 지정
            serviceWorker: {
                url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
            },
        });
        console.log("✅ MSW mock server started");
    }
}
