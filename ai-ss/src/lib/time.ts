/** baseDate 기준 주간 헤더 라벨 포맷 */
export function formatDateLabel(base: Date) {
    const m = base.toLocaleString("en-US", { month: "long" });
    const d = base.getDate();
    return `${m} ${d}`;
}

/** 주간 요일 라벨 (월~일) */
export function getWeekDays(base: Date) {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days;
}

/** HH:mm → HH:MM AM/PM 으로 변환 */
export function toAmPm(time24: string): string {
    // 허용: "09:30", "9:30", "21:15"
    const match = time24.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return time24;

    let [_, hh, mm] = match;
    let H = parseInt(hh, 10);

    const isPM = H >= 12;
    const h12 = H % 12 === 0 ? 12 : H % 12;

    return `${String(h12).padStart(2, "0")}:${mm} ${isPM ? "PM" : "AM"}`;
}
