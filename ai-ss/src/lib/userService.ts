import { http } from "@/shared/api/http";
import { setTokens } from "@/lib/authService";

type LoginResponse = {
    status: number;
    message: string;
    data: {
        accessToken: string;
        refreshToken?: string;
        nickname?: string;
        role?: string;
    };
};

export async function loginWithAuthorizationCode(code: string, socialType: "GOOGLE") {
    const res = await http.post(
        "/api/v1/users/login",
        { socialType },                         // body
        { params: { authorizationCode: code } } // query param
    );
    const { accessToken, refreshToken } = res.data.data ?? {};
    if (accessToken) setTokens(accessToken, refreshToken);
    return res.data;
}
