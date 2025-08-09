// src/lib/authService.ts
import http from "@/shared/api/http";

export type LoginSuccess = {
    status: number;
    message: string;
    data: {
        accessToken: string;
        refreshToken: string;
        nickname: string;
        role: string;
    };
};

// Path Param 방식: POST /api/v1/users/login/{authorizationCode}
export async function loginWithGoogleCode(authorizationCode: string) {
    const { data } = await http.post<LoginSuccess>(
        `/api/v1/users/login/${authorizationCode}`,
        { socialType: "GOOGLE" },
        { headers: { "Content-Type": "application/json" } }
    );
    return data;
}
