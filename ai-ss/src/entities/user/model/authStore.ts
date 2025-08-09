// src/entities/user/model/authStore.ts
import { create } from "zustand";

type AuthState = {
    accessToken: string | null;
    refreshToken: string | null;
    nickname: string | null;
    role: string | null;
    setTokens: (p: { accessToken: string; refreshToken: string; nickname: string; role: string }) => void;
    logout: () => void;
    hydrate: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    refreshToken: null,
    nickname: null,
    role: null,
    setTokens: ({ accessToken, refreshToken, nickname, role }) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("nickname", nickname);
        localStorage.setItem("role", role);
        set({ accessToken, refreshToken, nickname, role });
    },
    logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("nickname");
        localStorage.removeItem("role");
        set({ accessToken: null, refreshToken: null, nickname: null, role: null });
    },
    hydrate: () => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        const nickname = localStorage.getItem("nickname");
        const role = localStorage.getItem("role");
        set({
            accessToken: accessToken || null,
            refreshToken: refreshToken || null,
            nickname: nickname || null,
            role: role || null,
        });
    },
}));
