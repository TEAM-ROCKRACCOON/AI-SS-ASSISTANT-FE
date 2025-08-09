// src/entities/user/api/index.ts
import http from "@/shared/api/http";
import type { Id } from "@/shared/api/types";

/** -------- Endpoints -------- */
const USERS = "/api/v1/users";
const ENDPOINTS = {
    login: `${USERS}/login`,
    nickname: `${USERS}/nickname/register`,
    address: `${USERS}/address`,
    habit: `${USERS}/habit`,
    calendar: `${USERS}/calendar`,
    profile: `${USERS}/profile`,
    logout: `${USERS}/logout`,
    withdraw: `${USERS}/withdraw`,
} as const;

/** -------- Common Types -------- */
export type ApiEnvelope<T = unknown> = {
    status: number;
    message: string;
    data?: T;
};

export type SimpleRes = { status: number; message: string };

export type ProfileData = {
    nickname: string;
    email: string;
    termsUrl: string;
};

type Envelope<T> = { status: number; message: string; data: T };

const PROFILE_ENDPOINT = "/api/v1/users/profile";
const LOGOUT_ENDPOINT = "/api/v1/users/logout";
const WITHDRAW_ENDPOINT = "/api/v1/users/withdraw";

/** -------- Domain Types -------- */
export type LoginData = {
    accessToken: string;
    refreshToken: string;
    nickname?: string;
    role?: string;
};

export type NicknameReq = { nickname: string };

export type AddressReq = {
    roadAddressName: string;
    placeDetailAddress: string;
    latitude: number;
    longitude: number; // 서버 스펙 표현 유지
};

export type Profile = { id: Id; nickname: string; email: string };

export type CleaningFrequency =
    | "DAILY" | "FREQUENT" | "OCCASIONAL" | "BIWEEKLY" | "MONTHLY";
export type CleaningDistribution =
    | "ONE_TIME_DEEP" | "SPLIT_AND_MAINTAIN";
export type PreferredTimeRange =
    | "DAWN" | "MORNING" | "AFTERNOON" | "EVENING";
export type PreferredDay =
    | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
export type ItemQuantity = "TOO_MUCH" | "LITTLE";

/** -------- APIs -------- */

// Google 로그인: 서버가 래퍼 {status,message,data}를 준다고 가정
export async function loginWithGoogle(authorizationCode: string): Promise<ApiEnvelope<LoginData>> {
    const { data } = await http.post<ApiEnvelope<LoginData>>(
        ENDPOINTS.login,
        { socialType: "GOOGLE" },
        { params: { authorizationCode } }
    );
    return data;
    // Path Param 버전이라면:
    // const { data } = await http.post<ApiEnvelope<LoginData>>(
    //   `${ENDPOINTS.login}/${authorizationCode}`,
    //   { socialType: "GOOGLE" }
    // );
    // return data;
}

// 닉네임 등록: 스펙상 {status,message}만
export async function registerNickname(nickname: string): Promise<SimpleRes> {
    const { data } = await http.post<SimpleRes>(
        ENDPOINTS.nickname,
        { nickname } as NicknameReq,
        { headers: { "Content-Type": "application/json" } }
    );
    return data;
}

// 주소 등록: 스펙상 {status,message}만
export async function registerAddress(payload: AddressReq): Promise<SimpleRes> {
    const { data } = await http.post<SimpleRes>(
        ENDPOINTS.address,
        payload,
        { headers: { "Content-Type": "application/json" } }
    );
    return data;
}

// 청소 습관 등록: 스펙상 {status,message}만
export type HabitReq = {
    cleaningFrequency: "DAILY" | "FREQUENT" | "OCCASIONAL" | "BIWEEKLY" | "MONTHLY";
    cleaningDistribution: "ONE_TIME_DEEP" | "SPLIT_AND_MAINTAIN";
    preferredTimeRange: "DAWN" | "MORNING" | "AFTERNOON" | "EVENING";
    preferredDays: ("MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN")[];
    itemQuantity: "TOO_MUCH" | "LITTLE";
};
export async function saveHabit(payload: HabitReq): Promise<SimpleRes> {
    const { data } = await http.post<SimpleRes>(
        ENDPOINTS.habit,
        payload,
        { headers: { "Content-Type": "application/json" } }
    );
    return data;
}

// 캘린더 연동 트리거: 스펙상 {status,message}만
export async function connectCalendar(): Promise<SimpleRes> {
    const { data } = await http.post<SimpleRes>(ENDPOINTS.calendar, {});
    return data;
}

// 프로필 조회: {status, message, data:{nickname,email,termsUrl}}
export async function getProfile(): Promise<ProfileData> {
    const res = await http.get<Envelope<ProfileData>>(PROFILE_ENDPOINT);
    return res.data.data;
}

// 프로필 수정: {status, message}
export async function updateProfile(payload: {
    nickname: string;
    email: string;
}): Promise<SimpleRes> {
    const res = await http.put<SimpleRes>(PROFILE_ENDPOINT, payload, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}

// 로그아웃: POST, 바디 없음
export async function logout(): Promise<SimpleRes> {
    const res = await http.post<SimpleRes>(LOGOUT_ENDPOINT, {}, {
        headers: { "Content-Type": "application/json" },
    });
    return res.data;
}

// 회원탈퇴: DELETE, 바디 없음
export async function withdraw(): Promise<SimpleRes> {
    const res = await http.delete<SimpleRes>(WITHDRAW_ENDPOINT);
    return res.data;
}


