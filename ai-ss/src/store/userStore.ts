// src/store/userStore.ts

import { create } from "zustand";

type UserState = {
    accessToken: string | null;
    refreshToken: string | null;
    nickname: string | null;
    role: string | null;
    setUser: (payload: {
        accessToken: string;
        refreshToken: string;
        nickname: string;
        role: string;
    }) => void;
    logout: () => void;
};

export const useUserStore = create<UserState>((set) => ({
    accessToken: null,
    refreshToken: null,
    nickname: null,
    role: null,
    setUser: ({ accessToken, refreshToken, nickname, role }) => {
        localStorage.setItem("token", accessToken);
        set({ accessToken, refreshToken, nickname, role });
    },
    logout: () => {
        localStorage.removeItem("token");
        set({ accessToken: null, refreshToken: null, nickname: null, role: null });
    },
}));
