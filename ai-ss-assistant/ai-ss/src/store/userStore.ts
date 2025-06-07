// src/store/userStore.ts
import { create } from "zustand";

type UserState = {
    name: string;
    setName: (name: string) => void;
};

export const useUserStore = create<UserState>((set) => ({
    name: "김청소",
    setName: (name) => set({ name }),
}));
