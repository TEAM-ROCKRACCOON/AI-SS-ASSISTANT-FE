// src/entities/user/model/authStore.ts
import { create } from "zustand";

type AuthState = {
    accessToken: string | null;
    refreshToken: string | null;
    nickname: string | null;
    role: string | null;
    setTokens: (p: {
        accessToken: string;
        refreshToken?: string | null;
        nickname?: string | null;
        role?: string | null;
    }) => void;
    setFromAuthResponse: (p: {
        accessToken: string;
        refreshToken?: string | null;
        nickname?: string | null;
        role?: string | null;
    }) => void;
    logout: () => void;
    hydrate: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    refreshToken: null,
    nickname: null,
    role: null,

    setTokens: ({ accessToken, refreshToken = null, nickname = null, role = null }) => {
        localStorage.setItem("accessToken", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        if (nickname) localStorage.setItem("nickname", nickname);
        if (role) localStorage.setItem("role", role);

        set({ accessToken, refreshToken, nickname, role });
    },

    // 로그인 API 응답(data)을 그대로 넣기 좋게 별도 헬퍼
    setFromAuthResponse: ({ accessToken, refreshToken = null, nickname = null, role = null }) => {
        localStorage.setItem("accessToken", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        if (nickname) localStorage.setItem("nickname", nickname);
        if (role) localStorage.setItem("role", role);

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

// http.ts에서 사용할 공용 getter
export const getAccessToken = () =>
    useAuthStore.getState().accessToken || localStorage.getItem("accessToken");
