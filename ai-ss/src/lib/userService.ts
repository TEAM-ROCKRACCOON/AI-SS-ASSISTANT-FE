// src/lib/userService.ts
import http from "@/shared/api/http";

export type Profile = {
    nickname: string;
    email: string;
    termsUrl: string;
};

export async function getProfile(): Promise<Profile> {
    const res = await http.get<{ status: number; message: string; data: Profile }>(
        "/api/v1/users/profile"
    );
    return res.data.data;
}

export async function updateProfile(payload: { nickname: string; email: string }) {
    const res = await http.put<{ status: number; message: string }>(
        "/api/v1/users/profile",
        payload,
        { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
}

export async function logout() {
    const res = await http.post<{ status: number; message: string }>(
        "/api/v1/users/logout"
    );
    return res.data;
}

export async function withdraw() {
    const res = await http.delete<{ status: number; message: string }>(
        "/api/v1/users/withdraw"
    );
    return res.data;
}
