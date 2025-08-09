// src/lib/time.ts
/** "09:05" -> "9:05 AM", "00:10" -> "12:10 AM", "13:30" -> "1:30 PM" */
export function toAmPm(hhmm: string): string {
    const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm);
    if (!m) throw new Error("Invalid HH:mm");
    let h = Number(m[1]);
    const mm = m[2];
    const isAm = h < 12;
    if (h === 0) h = 12;        // 00 -> 12 AM
    else if (h > 12) h -= 12;   // 13~23 -> 1~11 PM
    return `${h}:${mm} ${isAm ? "AM" : "PM"}`;
}
