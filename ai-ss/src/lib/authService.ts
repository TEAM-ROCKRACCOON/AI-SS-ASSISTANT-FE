// src/lib/authService.ts

// ⚠️ 이 키들은 "localStorage의 key 이름"이야. (예전처럼 토큰 값이 아님!)
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

/** 토큰 저장 */
export function setTokens(accessToken: string, refreshToken?: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
}

/** 액세스 토큰 조회 */
export function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/** 토큰 삭제 */
export function clearTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/** 구글 OAuth 인가 URL 생성 */
export function buildGoogleAuthUrl() {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID!;
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI!;

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri, // 백엔드 콜백
        response_type: "code",
        scope: "email profile",
        access_type: "offline",
        // 필요하면 아래 옵션도 추가 가능
        // prompt: "consent",
        // include_granted_scopes: "true",
    });

    // v1/v2 둘 다 동작. 가이드는 v1 기준이라 그대로 둠.
    return `https://accounts.google.com/o/oauth2/auth?${params.toString()}`;
}