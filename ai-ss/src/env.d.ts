/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_GOOGLE_CLIENT_ID: string;
    readonly VITE_KAKAO_REST_API_KEY?: string;
    readonly VITE_GOOGLE_REDIRECT_URI: string; // <= /login/oauth2/code/google
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
