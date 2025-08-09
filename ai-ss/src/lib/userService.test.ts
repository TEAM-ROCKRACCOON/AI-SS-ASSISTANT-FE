// src/lib/userService.test.ts
import { describe, it, expect } from "vitest";
import { getProfile, updateProfile, logout, withdraw } from "./userService";

describe("userService", () => {
    it("프로필 조회", async () => {
        const p = await getProfile();
        expect(p.nickname).toBeTruthy();
        expect(p.email).toContain("@");
        expect(p.termsUrl).toMatch(/^https?:\/\//);
    });

    it("프로필 수정 200", async () => {
        const res = await updateProfile({ nickname: "청소요정", email: "cleaner@example.com" });
        expect(res.status).toBe(200);
    });

    it("로그아웃 200", async () => {
        const res = await logout();
        expect(res.status).toBe(200);
    });

    it("회원 탈퇴 200", async () => {
        const res = await withdraw();
        expect(res.status).toBe(200);
    });
});
