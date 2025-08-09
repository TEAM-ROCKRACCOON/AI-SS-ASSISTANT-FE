// src/entities/user/model/habitMapper.ts
import type {
    CleaningFrequency, CleaningDistribution,
    PreferredTimeRange, PreferredDay, ItemQuantity,
    HabitReq
} from "@/entities/user/api";

export const mapCleaningFrequency = (label: string): CleaningFrequency => {
    const m: Record<string, CleaningFrequency> = {
        "매일 (주 7회)": "DAILY",
        "자주 (주 3~5회)": "FREQUENT",
        "가끔 (주 1~2회)": "OCCASIONAL",
        "이따금 (2주에 1회)": "BIWEEKLY",
        "드물게 (한 달에 1회)": "MONTHLY",
    };
    const v = m[label];
    if (!v) throw new Error("cleaningFrequency 매핑 실패");
    return v;
};

export const mapCleaningDistribution = (label: string): CleaningDistribution => {
    const m: Record<string, CleaningDistribution> = {
        "한 번에 몰아서 대청소": "ONE_TIME_DEEP",
        "나눠서 조금씩 꾸준히": "SPLIT_AND_MAINTAIN",
    };
    const v = m[label];
    if (!v) throw new Error("cleaningDistribution 매핑 실패");
    return v;
};

export const mapPreferredTimeRange = (label: string): PreferredTimeRange => {
    const m: Record<string, PreferredTimeRange> = {
        "새벽 (00:00~06:00)": "DAWN",
        "아침 (06:00~12:00)": "MORNING",
        "오후 (12:00~18:00)": "AFTERNOON",
        "저녁 (18:00~24:00)": "EVENING",
    };
    const v = m[label];
    if (!v) throw new Error("preferredTimeRange 매핑 실패");
    return v;
};

export const mapPreferredDays = (days: string[]): PreferredDay[] => {
    const m: Record<string, PreferredDay> = {
        "월": "MON", "화": "TUE", "수": "WED",
        "목": "THU", "금": "FRI", "토": "SAT", "일": "SUN",
    };
    const res = days.map((d) => m[d]).filter(Boolean) as PreferredDay[];
    if (res.length !== days.length) throw new Error("preferredDays 매핑 실패");
    return res;
};

export const mapItemQuantity = (label: string): ItemQuantity => {
    const m: Record<string, ItemQuantity> = {
        "물건이 많아서 정리가 어려워요": "TOO_MUCH",
        "물건이 적어서 정리가 쉬워요": "LITTLE",
    };
    const v = m[label];
    if (!v) throw new Error("itemQuantity 매핑 실패");
    return v;
};

/** InitialSurveyPage 상태 → 서버 페이로드 */
export const toHabitReq = (ui: {
    frequency: string;
    style: string;
    selectedTimeSlots: string[];
    selectedWeekdays: string[];
    items: string;
}): HabitReq => ({
    cleaningFrequency: mapCleaningFrequency(ui.frequency),
    cleaningDistribution: mapCleaningDistribution(ui.style),
    preferredTimeRange: mapPreferredTimeRange(ui.selectedTimeSlots[0]),
    preferredDays: mapPreferredDays(ui.selectedWeekdays),
    itemQuantity: mapItemQuantity(ui.items),
});
