// src/mocks/startMock.ts
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export async function startMock() {
    if (import.meta.env.DEV) {
        const worker = setupWorker(...handlers);
        await worker.start({
            onUnhandledRequest: "bypass",
            // Vite의 base 경로를 고려해 안전하게 지정
            serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
        });
    }
}
