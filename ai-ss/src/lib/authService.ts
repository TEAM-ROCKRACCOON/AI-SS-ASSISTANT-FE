// lib/authService.ts
const ACCESS = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3NjMwMjQ2NTMsImV4cCI6MTc5NDU2MDY1MywidXNlcklkIjoyLCJyb2xlIjoiUk9MRV9VU0VSIn0.2hvTDVOGiQkIWqKtpdgm9LGxXeO4Jw3kdenHHGkPWz-sw8k28EQKHinp5gNCPflKbqduDX0NAmWEx5MCxAYK-w";
const REFRESH = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3NjMwMjQ2NTIsImV4cCI6MTc2NDIzNDI1MiwidXNlcklkIjoyLCJyb2xlIjoiUk9MRV9VU0VSIn0.UeaRgliTV6asPAnofI8GeQNXekfDAY662TfeV6nJcLeI5vD0t17lIEei5c46PssUNwOvRo092--471YdnBXdyA";

export function setTokens(accessToken: string, refreshToken?: string) {
    localStorage.setItem(ACCESS, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH, refreshToken);
}
export function getAccessToken() { return localStorage.getItem(ACCESS); }
export function clearTokens() { localStorage.removeItem(ACCESS); localStorage.removeItem(REFRESH); }

export function buildGoogleAuthUrl() {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID!;
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI!;
    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,                // ✅ 백엔드 콜백
        response_type: "code",
        scope: "email profile",                   // 가이드 그대로
        access_type: "offline",
        // (원하면) 안정성 위해 아래도 추가 가능
        // prompt: "consent",
        // include_granted_scopes: "true",
    });
    // 가이드의 v1 엔드포인트와 호환: (둘 다 동작) v2로 바꿔도 무방
    return `https://accounts.google.com/o/oauth2/auth?${params.toString()}`;
}

export function extractAuthCodeFromUrl() {
    // ❌ 이제 프런트 경로(/login)로 안 돌아오므로 사용 안 함
    return null;
}