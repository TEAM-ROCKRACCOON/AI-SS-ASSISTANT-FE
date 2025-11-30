// src/mocks/startMock.ts
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

/**
 * mock 서버 구동 함수
 * .env.local에서 VITE_USE_MSW=true면 실행
 */
export async function startMock() {
    const shouldStart =
        String(import.meta.env.VITE_USE_MOCK) === "true";

    if (shouldStart) {
        const worker = setupWorker(...handlers);
        await worker.start({
            onUnhandledRequest: "bypass",
            serviceWorker: {
                url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
            },
        });
        console.log("✅ MSW mock server started");
    }
}
