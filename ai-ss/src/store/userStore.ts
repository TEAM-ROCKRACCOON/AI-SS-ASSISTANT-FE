// src/store/userStore.ts
import { create } from "zustand";

type UserState = {
    accessToken: string | null;
    refreshToken: string | null;
    nickname: string | null;
    role: string | null;
    setUser: (payload: {
        accessToken: string;
        refreshToken?: string | null;
        nickname?: string | null;
        role?: string | null;
    }) => void;
    logout: () => void;
    hydrate: () => void;
};

export const useUserStore = create<UserState>((set) => ({
    accessToken: null,
    refreshToken: null,
    nickname: null,
    role: null,

    setUser: ({ accessToken, refreshToken = null, nickname = null, role = null }) => {
        // ✅ 키 통일
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

// 선택: http.ts에서 쓸 수 있는 getter
export const getAccessToken = () =>
    useUserStore.getState().accessToken || localStorage.getItem("accessToken");
