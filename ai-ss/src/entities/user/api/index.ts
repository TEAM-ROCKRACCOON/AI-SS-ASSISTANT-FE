// src/entities/user/api/index.ts
import http from "@/shared/api/http";

// -------- Endpoints --------
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

// -------- Common Types --------
export type ApiEnvelope<T = unknown> = {
    status: number;
    message: string;
    data?: T;
};
export type SimpleRes = { status: number; message: string };

export type ProfileData = {
    nickname: string;
    email: string;
    termsUrl?: string; // ✅ 옵셔널 처리 (MSW/실서버 겸용 안전)
};

// -------- Domain Types --------
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
    longitude: number;
};

export type CleaningFrequency =
    | "DAILY"
    | "FREQUENT"
    | "OCCASIONAL"
    | "BIWEEKLY"
    | "MONTHLY";
export type CleaningDistribution = "ONE_TIME_DEEP" | "SPLIT_AND_MAINTAIN";
export type PreferredTimeRange = "DAWN" | "MORNING" | "AFTERNOON" | "EVENING";
export type PreferredDay = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
export type ItemQuantity = "TOO_MUCH" | "LITTLE";

// -------- APIs --------

// 닉네임 등록
export async function registerNickname(nickname: string): Promise<SimpleRes> {
    const { data } = await http.post<SimpleRes>(ENDPOINTS.nickname, { nickname });
    return data;
}

// 주소 등록
export async function registerAddress(payload: AddressReq): Promise<SimpleRes> {
    const { data } = await http.post<SimpleRes>(ENDPOINTS.address, payload);
    return data;
}

// 청소 습관 등록
export type HabitReq = {
    cleaningFrequency: CleaningFrequency;
    cleaningDistribution: CleaningDistribution;
    preferredTimeRange: PreferredTimeRange;
    preferredDays: PreferredDay[];
    itemQuantity: ItemQuantity;
};
export async function saveHabit(payload: HabitReq): Promise<SimpleRes> {
    const { data } = await http.post<SimpleRes>(ENDPOINTS.habit, payload);
    return data;
}

// 캘린더 연동 트리거
export async function connectCalendar(): Promise<SimpleRes> {
    const { data } = await http.post<SimpleRes>(ENDPOINTS.calendar, {});
    return data;
}

// 프로필 조회
export async function getProfile(): Promise<ProfileData> {
    const res = await http.get<ApiEnvelope<ProfileData>>(ENDPOINTS.profile);
    return res.data.data!;
}

// 프로필 수정
export async function updateProfile(payload: {
    nickname: string;
    email: string;
}): Promise<SimpleRes> {
    const res = await http.put<SimpleRes>(ENDPOINTS.profile, payload);
    return res.data;
}

// 로그아웃
export async function logout(): Promise<SimpleRes> {
    const res = await http.post<SimpleRes>(ENDPOINTS.logout, {});
    return res.data;
}

// 회원탈퇴
export async function withdraw(): Promise<SimpleRes> {
    const res = await http.delete<SimpleRes>(ENDPOINTS.withdraw);
    return res.data;
}
