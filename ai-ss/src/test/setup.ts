// src/test/setup.ts
import { beforeAll, afterEach, afterAll, vi } from "vitest";
import { server } from "./mswServer";
import { handlers } from "@/mocks/handlers";

// localStorage polyfill
class LocalStorageMock {
    private store: Record<string, string> = {};
    getItem(k: string) { return this.store[k] ?? null; }
    setItem(k: string, v: string) { this.store[k] = String(v); }
    removeItem(k: string) { delete this.store[k]; }
    clear() { this.store = {}; }
}
vi.stubGlobal("localStorage", new LocalStorageMock());
//localStorage.setItem("accessToken", "test-token");
localStorage.setItem("aiss_access_token", "test-token"); // ✅ http 인터셉터가 이 키를 읽음
// 또는 테스트용으로 http.ts 인터셉터를 주입 시 stub하거나, withClient 훅에서 setTokens 호출


// Vite env
vi.stubEnv("VITE_API_BASE_URL", "http://localhost");

// MSW 시작
beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
