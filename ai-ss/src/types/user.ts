// types/user.ts

export type User = {
    id: number;
    username: string;
    email: string;
    // 선택 속성: 로그인 상태, 토큰 등 추가 가능
    isLoggedIn?: boolean;
    token?: string;
    // 사용자 설정 예시
    preferences?: {
        notificationsEnabled: boolean;
        theme: "light" | "dark";
    };
};
