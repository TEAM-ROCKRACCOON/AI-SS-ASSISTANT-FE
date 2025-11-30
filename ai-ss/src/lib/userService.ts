// src/lib/userService.ts
import { login as loginApi, ApiEnvelope, LoginData } from "@/entities/user/api";
import { setTokens } from "@/lib/authService";

export type LoginResponseData = LoginData;

/**
 * 인가 코드로 로그인 후 토큰을 localStorage에 저장
 */
export async function loginWithAuthorizationCode(
    code: string,
    socialType: "GOOGLE"
): Promise<LoginResponseData> {
    // ✅ 주소창에서 복사한 코드는 이미 인코딩되어 있으므로 한 번 디코딩
    const decodedCode = decodeURIComponent(code.trim());

    const envelope: ApiEnvelope<LoginData> = await loginApi({
        authorizationCode: decodedCode,
        socialType,
    });

    if (!envelope.data) {
        throw new Error("로그인 응답에 data가 없습니다.");
    }

    const { accessToken, refreshToken, nickname, role } = envelope.data;

    if (!accessToken) {
        throw new Error("로그인 응답에 accessToken이 없습니다.");
    }

    setTokens(accessToken, refreshToken);

    return { accessToken, refreshToken, nickname, role };
}