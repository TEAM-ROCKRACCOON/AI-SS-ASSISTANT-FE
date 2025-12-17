// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";
import { demoWeeklyTodosByStartDate } from "./demoWeeklyTodos"; // ← 이 줄 추가

/**
 * 도메인 타입
 */
type Todo = { id: string; title: string; time: string; completed: boolean };

/**
 * 메모리 상태 (개발/테스트 전용)
 */
let profile = {
    nickname: "고은서",
    email: "cannes7@ewhain.net",
    termsUrl: "https://yourapp.com/terms",
};

let todos: Todo[] = [
    // 아침 루틴
    { id: "26", title: "거실 - 청소기로 바닥 먼지 제거", time: "11:00 AM", completed: true },
    { id: "27", title: "주방 - 수건 교체", time: "21:00 PM", completed: true },
    // { id: "1", title: "거실 청소하기", time: "10:00 AM", completed: true },
    //{ id: "2", title: "욕실 정리하기", time: "11:00 AM", completed: true },
    //{ id: "3", title: "주방 싱크대 닦기", time: "12:00 AM", completed: false },
    //{ id: "4", title: "침실 환기 및 침구 정리", time: "08:30 AM", completed: true },
    // { id: "5", title: "화분에 물주기", time: "07:00 AM", completed: false },

    // 점심/오후 루틴
    //{ id: "6", title: "책상 정리하기", time: "12:30 PM", completed: false },
    // { id: "7", title: "세탁기 돌리기", time: "01:15 PM", completed: true },
    //{ id: "8", title: "냉장고 정리", time: "02:00 PM", completed: false },
    // { id: "9", title: "쓰레기 분리수거", time: "03:30 PM", completed: true },
    //{ id: "10", title: "창문 닦기", time: "04:15 PM", completed: false },

    // 저녁 루틴
    //{ id: "11", title: "욕실 바닥 청소", time: "06:30 PM", completed: false },
    //{ id: "12", title: "주방 설거지 마무리", time: "07:00 PM", completed: true },
    //{ id: "13", title: "현관 청소", time: "08:00 PM", completed: false },
    //{ id: "14", title: "세탁물 개기", time: "08:45 PM", completed: true },
    //{ id: "15", title: "내일 할 일 미리 정하기", time: "09:30 PM", completed: false },

    // 주말 루틴 (특수 작업)
    //{ id: "16", title: "베란다 대청소", time: "8:00 AM", completed: false },
    //{ id: "17", title: "침구 커버 교체", time: "11:00 AM", completed: true },
    //{ id: "18", title: "에어컨 필터 세척", time: "02:30 PM", completed: false },
    //{ id: "19", title: "욕실 곰팡이 제거", time: "04:00 PM", completed: true },
    //{ id: "20", title: "신발 정리", time: "05:15 PM", completed: false },

    // // 테스트용 엣지 케이스
    // { id: "21", title: "기타 청소 루틴", time: "12:00 PM", completed: false },
    // { id: "22", title: "아무 작업 없음", time: "00:00 AM", completed: false },
    // { id: "23", title: "비정상 시간 테스트", time: "99:99 AM", completed: false },
    // { id: "24", title: "완료된 오래된 할 일", time: "06:00 AM", completed: true },
    // { id: "25", title: "랜덤 테스트 데이터", time: "03:33 PM", completed: Math.random() < 0.5 },
];

/**
 * 유틸
 */
// const authGuard = (req: Request) => {
//     const auth = req.headers.get("authorization") ?? req.headers.get("Authorization");
//     if (!auth || !/^Bearer\s+.+/.test(auth)) {
//         return HttpResponse.json({ status: 401, message: "유효한 토큰이 필요합니다.", data: null }, { status: 401 });
//     }
//     return null;
// };

// 🔥 시연용: 인증 완전 무시
const authGuard = (_req: Request) => {
    return null;
};


async function readJson<T extends Record<string, unknown>>(req: Request): Promise<Partial<T>> {
    try {
        const data: unknown = await req.json();
        if (data && typeof data === "object") return data as Partial<T>;
    } catch {}
    return {};
}

const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const ok = <T>(message: string, data: T, init?: ResponseInit) =>
    HttpResponse.json({ status: 200, message, data }, { status: 200, ...init });

const created = <T>(message: string, data: T) =>
    HttpResponse.json({ status: 201, message, data }, { status: 201 });

const bad = (statusCode: number, message: string) =>
    HttpResponse.json({ status: statusCode, message, data: null }, { status: statusCode });

const toMinutes = (t: string) => {
    // 지원: "HH:MM AM/PM", "HH:MM"
    const m = t.match(/^(\d{2}):(\d{2})(?:\s*(AM|PM))?$/i);
    if (!m) return Number.POSITIVE_INFINITY;
    let [, hh, mm, ap] = m;
    let H = parseInt(hh, 10);
    const M = parseInt(mm, 10);
    if (ap) {
        const AP = ap.toUpperCase();
        if (AP === "PM" && H !== 12) H += 12;
        if (AP === "AM" && H === 12) H = 0;
    }
    if (!ap && H === 24) H = 0;
    return H * 60 + M;
};

const normalizeTime = (t: string): string | null => {
    const m = t.match(/^(\d{2}):(\d{2})(?:\s*(AM|PM))?$/i);
    if (!m) return null;
    let [, hh, mm, ap] = m;
    let H = parseInt(hh, 10);
    const M = parseInt(mm, 10);
    if (H > 23 || M > 59) return null;

    if (!ap) {
        // 24h → AM/PM 변환
        const isPM = H >= 12;
        const h12 = H % 12 === 0 ? 12 : H % 12;
        return `${String(h12).padStart(2, "0")}:${String(M).padStart(2, "0")} ${isPM ? "PM" : "AM"}`;
    }
    // 이미 AM/PM이면 12h 유지, 자리수 보정
    const AP = ap.toUpperCase();
    let H12 = H;
    if (H12 === 0) H12 = 12;
    if (H12 > 12) H12 = H12 - 12;
    return `${String(H12).padStart(2, "0")}:${String(M).padStart(2, "0")} ${AP}`;
};

type Period = "morning" | "afternoon" | "evening" | "night";
const inPeriod = (t: string, period?: Period | null) => {
    if (!period) return true;
    const m = toMinutes(t);
    if (!Number.isFinite(m)) return false;
    // morning(5~12), afternoon(12~17), evening(17~21), night(21~05)
    if (period === "morning") return m >= 5 * 60 && m < 12 * 60;
    if (period === "afternoon") return m >= 12 * 60 && m < 17 * 60;
    if (period === "evening") return m >= 17 * 60 && m < 21 * 60;
    return m >= 21 * 60 || m < 5 * 60;
};

const contains = (s: string, q?: string | null) => (!q ? true : s.toLowerCase().includes(q.toLowerCase()));
const parseBool = (v: string | null): boolean | undefined =>
    v === null ? undefined : v === "true" ? true : v === "false" ? false : undefined;
const parseIntSafe = (v: string | null, def?: number) => {
    if (v === null || v === "") return def;
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : def;
};
const paginate = <T,>(arr: T[], page: number, size: number) => {
    const total = arr.length;
    const totalPages = Math.max(1, Math.ceil(total / size));
    const current = Math.min(Math.max(page, 1), totalPages);
    const start = (current - 1) * size;
    const data = arr.slice(start, start + size);
    return { data, meta: { total, page: current, size, totalPages } };
};

// --- [추가] 파일 상단 유틸 근처에 붙이기 ---
const seeded = (seedStr: string) => {
    // 간단한 문자열 해시 -> 0~1 의 의사난수
    let h = 2166136261;
    for (let i = 0; i < seedStr.length; i++) {
        h ^= seedStr.charCodeAt(i);
        h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    // xorshift 변형
    let x = h >>> 0;
    return () => {
        x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
        // 0~1
        return ((x >>> 0) % 100000) / 100000;
    };
};

const pickDailyTodos = (dateStr: string, base: Todo[], opts?: {
    min?: number; max?: number; doneRate?: number;
}) => {
    const rnd = seeded(dateStr);
    const arr = base.slice();

    // Fisher–Yates (시드 기반)
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    const min = opts?.min ?? 4;
    const max = opts?.max ?? 8;
    const k = Math.max(min, Math.min(max, Math.floor(rnd() * (max - min + 1)) + min));
    const doneRate = opts?.doneRate ?? 0.4; // 기본 40% 정도 완료로 표시

    // 일부는 완료, 일부는 미완료로 날짜마다 다르게
    const sampled = arr.slice(0, k).map((t, idx) => {
        // 날짜마다 다른 패턴: 인덱스/난수 섞어서 완료 여부 부여
        const done = rnd() < doneRate ? true : false;
        return { ...t, completed: done };
    });

    // 정렬: 미완료 우선 -> 시간 오름차순
    sampled.sort((a, b) => {
        const aDone = a.completed ? 1 : 0;
        const bDone = b.completed ? 1 : 0;
        if (aDone !== bDone) return aDone - bDone; // 0(미완료) 먼저
        const A = toMinutes(a.time);
        const B = toMinutes(b.time);
        return A - B;
    });

    // weekly 응답 스펙 호환: isDone 동시 제공
    return sampled.map(t => ({
        id: t.id,
        title: t.title,
        time: t.time,
        isDone: t.completed,
    }));
};


/**
 * 핸들러 모음
 */
export const handlers = [
    // 로그인 (OAuth code 받아도 무조건 성공 처리)
    http.post("*/api/v1/users/login", ({ request }) => {
        // 쿼리 파라미터 읽기(있으면)
        const url = new URL(request.url);
        const authorizationCode = url.searchParams.get("authorizationCode");

        return HttpResponse.json(
            {
                status: 200,
                message: "로그인 성공(데모)",
                data: {
                    accessToken: "demo-access-token",
                    refreshToken: "demo-refresh-token",
                    user: {
                        nickname: profile.nickname,
                        email: profile.email,
                    },
                    authorizationCodeReceived: Boolean(authorizationCode),
                },
            },
            { status: 200 }
        );
    }),

    /**
     * 오늘 할 일 조회 (서버-사이드 필터/정렬/페이징)
     * Query:
     *  - q: string (제목 검색, 부분일치)
     *  - completed: "true" | "false"
     *  - period: "morning" | "afternoon" | "evening" | "night"
     *  - sort: "time-asc" | "time-desc" (기본 time-asc)
     *  - ids: "1,2,3" (특정 항목만)
     *  - sample: number (랜덤 샘플 개수)
     *  - page: number (기본 1)
     *  - size: number (기본 10)
     */
    http.get("*/api/v1/todo/today", ({ request }) => {
        const err = authGuard(request);
        if (err) return err;

        const url = new URL(request.url);
        const q = url.searchParams.get("q");
        const completed = parseBool(url.searchParams.get("completed"));
        const period = (url.searchParams.get("period") as Period | null) ?? null;
        const sort = (url.searchParams.get("sort") || "time-asc") as "time-asc" | "time-desc";
        const idsParam = url.searchParams.get("ids");
        const sample = parseIntSafe(url.searchParams.get("sample"));
        const page = parseIntSafe(url.searchParams.get("page"), 1)!;
        const size = Math.min(parseIntSafe(url.searchParams.get("size"), 10)!, 100);

        const idSet = idsParam ? new Set(idsParam.split(",").map((s) => s.trim())) : null;

        let list = todos.slice();

        // 특정 id만
        if (idSet) list = list.filter((t) => idSet.has(t.id));

        // 검색
        list = list.filter((t) => contains(t.title, q));

        // 완료 여부
        if (completed !== undefined) list = list.filter((t) => t.completed === completed);

        // 시간대
        if (period) list = list.filter((t) => inPeriod(t.time, period));

        // 정렬
        list.sort((a, b) => {
            const A = toMinutes(a.time);
            const B = toMinutes(b.time);
            return sort === "time-asc" ? A - B : B - A;
        });

        // 랜덤 샘플링
        if (Number.isFinite(sample as number) && (sample as number) > 0) {
            const arr = list.slice();
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            list = arr.slice(0, sample as number);
        }

        // 페이징
        const { data, meta } = paginate(list, page, size);

        return ok("오늘의 할 일 조회 성공", { todos: data, meta });
    }),

    /**
     * 할 일 추가
     * Body: { title?: string; time?: string; date?: string }
     * time: "HH:MM AM/PM" 또는 "HH:MM" (자동 보정)
     */
    http.post("*/api/v1/todo", async ({ request }) => {
        const err = authGuard(request);
        if (err) return err;

        type Body = { title?: string; time?: string; date?: string };
        const body = await readJson<Body>(request);

        const title = typeof body.title === "string" && body.title.trim() ? body.title.trim() : "새 할일";
        const normalized = normalizeTime(typeof body.time === "string" ? body.time.trim() : "09:00 AM");
        if (!normalized) return bad(400, "time 형식이 올바르지 않습니다. 예) '09:00 AM', '21:30'");

        const id = String(Date.now());
        todos.push({ id, title, time: normalized, completed: false });
        return created("할일 추가 완료", { id });
    }),

    /**
     * 시간 수정
     * Body: { time?: string } (지원 형식 동일)
     * 저장은 AM/PM 12시간 문자열로 통일
     */
    http.patch("*/api/v1/todo/time/:id", async ({ params, request }) => {
        const err = authGuard(request);
        if (err) return err;

        type Body = { time?: string };
        const body = await readJson<Body>(request);

        const id = String(params.id ?? "");
        const t = typeof body.time === "string" ? body.time.trim() : "";
        const normalized = normalizeTime(t || "09:00 AM");
        if (!normalized) return bad(400, "time 형식이 올바르지 않습니다.");

        let found = false;
        todos = todos.map((todo) => {
            if (todo.id === id) {
                found = true;
                return { ...todo, time: normalized };
            }
            return todo;
        });
        if (!found) return bad(404, "대상 할일을 찾을 수 없습니다.");
        return ok("할일 시각 수정 완료", { id, time: normalized });
    }),

    /**
     * 완료 여부 변경 (completed / isDone 둘 다 허용)
     * Body: { completed?: boolean; isDone?: boolean }
     */
    http.patch("*/api/v1/todo/isdone/:id", async ({ params, request }) => {
        const err = authGuard(request);
        if (err) return err;

        type Body = { completed?: boolean; isDone?: boolean };
        const body = await readJson<Body>(request);

        const next =
            typeof body.completed === "boolean"
                ? body.completed
                : typeof body.isDone === "boolean"
                    ? body.isDone
                    : undefined;

        if (typeof next !== "boolean") return bad(400, "completed 또는 isDone(boolean)이 필요합니다.");

        const id = String(params.id ?? "");
        let found = false;
        todos = todos.map((t) => (t.id === id ? ((found = true), { ...t, completed: next }) : t));
        if (!found) return bad(404, "대상 할일을 찾을 수 없습니다.");
        return ok("할일 완료 상태 업데이트 성공", { id, completed: next });
    }),

    /**
     * 삭제
     */
    http.delete("*/api/v1/todo/:id", ({ params, request }) => {
        const err = authGuard(request);
        if (err) return err;
        const id = String(params.id ?? "");
        const before = todos.length;
        todos = todos.filter((t) => t.id !== id);
        if (todos.length === before) return bad(404, "대상 할일을 찾을 수 없습니다.");
        return ok("할일 삭제 완료", { id });
    }),

    /**
     * 주간 목록 (데모용 고정 데이터)
     *
     * Query:
     *  - startDate=YYYY-MM-DD (주 시작 날짜, 월요일 기준)
     *
     * 2025-11-03, 2025-11-10, 2025-11-17, 2025-11-24 네 주만
     * 포스터 데모 영상을 위해 고정된 스케줄을 내려준다.
     */
    // http.get("*/api/v1/todo/weekly", ({ request }) => {
    //     const err = authGuard(request);
    //     if (err) return err;
    //
    //     const url = new URL(request.url);
    //     const startDate = url.searchParams.get("startDate") ?? fmt(new Date());
    //     const dayOnly = url.searchParams.get("day");
    //
    //     // 선택적 필터
    //     const limit = parseIntSafe(url.searchParams.get("limit"));
    //     const completed = parseBool(url.searchParams.get("completed"));
    //     const q = url.searchParams.get("q");
    //     const sort = (url.searchParams.get("sort") || "custom") as
    //         "custom" | "time-asc" | "time-desc" | "undone-first";
    //
    //     // 1) 데모 주차(11/3, 11/10, 11/17, 11/24)는 고정 데이터 사용
    //     const demo = demoWeeklyTodosByStartDate[startDate];
    //     if (demo) {
    //         let weeklyTodos = demo.weeklyTodos.map((day: any) => ({
    //             ...day,
    //             todos: day.todos.map((t: any) => ({ ...t })),
    //         }));
    //
    //         weeklyTodos = weeklyTodos.map((day: any) => {
    //             let list = day.todos as { id: string; title: string; time: string; completed: boolean }[];
    //
    //             if (typeof completed === "boolean") {
    //                 list = list.filter((t) => t.completed === completed);
    //             }
    //             if (q) {
    //                 const qq = q.toLowerCase();
    //                 list = list.filter((t) => t.title.toLowerCase().includes(qq));
    //             }
    //
    //             if (sort === "time-asc" || sort === "time-desc") {
    //                 list = [...list].sort((a, b) => {
    //                     const A = toMinutes(a.time);
    //                     const B = toMinutes(b.time);
    //                     return sort === "time-asc" ? A - B : B - A;
    //                 });
    //             } else if (sort === "undone-first") {
    //                 list = [...list].sort((a, b) => {
    //                     const ad = a.completed ? 1 : 0;
    //                     const bd = b.completed ? 1 : 0;
    //                     if (ad !== bd) return ad - bd;
    //                     return toMinutes(a.time) - toMinutes(b.time);
    //                 });
    //             }
    //
    //             if (typeof limit === "number" && limit > 0) {
    //                 list = list.slice(0, limit);
    //             }
    //
    //             return { ...day, todos: list };
    //         });
    //
    //         if (dayOnly) {
    //             const found = weeklyTodos.find((w: any) => w.date === dayOnly);
    //             if (!found) return bad(404, "요청한 날짜가 주간 범위에 없습니다.(데모)");
    //             return ok("특정 일자 할일 조회 성공(데모)", { weeklyTodos: [found] });
    //         }
    //
    //         return ok("일주일 할일 조회 성공(데모)", { weeklyTodos });
    //     }
    //
    //     // 2) 데모 범위 밖은 기존 랜덤 생성 로직 그대로 사용
    //     const base = new Date(startDate);
    //     if (Number.isNaN(base.getTime())) {
    //         return bad(400, "잘못된 데이터 형식입니다. startDate=YYYY-MM-DD");
    //     }
    //
    //     const makeDay = (d: Date) => {
    //         const dateStr = fmt(d);
    //         let list = pickDailyTodos(dateStr, todos, {
    //             min: 1,
    //             max: 4,
    //             doneRate: [0, 6].includes(d.getDay()) ? 0.5 : 0.35,
    //         });
    //
    //         if (typeof completed === "boolean") {
    //             list = list.filter((t) => t.isDone === completed);
    //         }
    //         if (q) {
    //             const qq = q.toLowerCase();
    //             list = list.filter((t) => t.title.toLowerCase().includes(qq));
    //         }
    //
    //         if (sort === "time-asc" || sort === "time-desc") {
    //             list.sort((a, b) => {
    //                 const A = toMinutes(a.time);
    //                 const B = toMinutes(b.time);
    //                 return sort === "time-asc" ? A - B : B - A;
    //             });
    //         } else if (sort === "undone-first") {
    //             list.sort((a, b) => {
    //                 const ad = a.isDone ? 1 : 0;
    //                 const bd = b.isDone ? 1 : 0;
    //                 if (ad !== bd) return ad - bd;
    //                 return toMinutes(a.time) - toMinutes(b.time);
    //             });
    //         }
    //
    //         if (typeof limit === "number" && limit > 0) {
    //             list = list.slice(0, limit);
    //         }
    //
    //         return { date: dateStr, todos: list };
    //     };
    //
    //     const weeklyTodos = Array.from({ length: 7 }, (_, i) => {
    //         const d = new Date(base);
    //         d.setDate(base.getDate() + i);
    //         return makeDay(d);
    //     });
    //
    //     if (dayOnly) {
    //         const found = weeklyTodos.find((w) => w.date === dayOnly);
    //         if (!found) return bad(404, "요청한 날짜가 주간 범위에 없습니다.");
    //         return ok("특정 일자 할일 조회 성공", { weeklyTodos: [found] });
    //     }
    //
    //     return ok("일주일 할일 조회 성공", { weeklyTodos });
    // }),
    //
    http.get("*/api/v1/todo/weekly", ({ request }) => {
        const err = authGuard(request);
        if (err) return err;

        const url = new URL(request.url);

        // -------------------------------------------
        // ✅ startDate 파싱/정규화: 어떤 형식이 와도 YYYY-MM-DD로 맞추기
        // -------------------------------------------
        const normalizeStartDate = (raw: string | null): string => {
            // 1) null이면 오늘로
            if (!raw) return fmt(new Date());

            const s = raw.trim();

            // 2) 이미 YYYY-MM-DD면 그대로
            if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

            // 3) YYYY.MM.DD / YYYY/MM/DD 같은 것들 처리
            const m = s.match(/^(\d{4})[./-](\d{1,2})[./-](\d{1,2})$/);
            if (m) {
                const y = m[1];
                const mm = String(m[2]).padStart(2, "0");
                const dd = String(m[3]).padStart(2, "0");
                return `${y}-${mm}-${dd}`;
            }

            // 4) 마지막으로 Date()에 맡겨보기 (예: "Dec 15 2025", "2025-12-15T00:00:00")
            const d = new Date(s);
            if (!Number.isNaN(d.getTime())) return fmt(d);

            // 5) 그래도 실패하면 오늘로 폴백 (400 방지)
            return fmt(new Date());
        };

        const startDate = normalizeStartDate(url.searchParams.get("startDate"));
        const dayOnly = url.searchParams.get("day");

        // 선택적 필터
        const limit = parseIntSafe(url.searchParams.get("limit"));
        const completed = parseBool(url.searchParams.get("completed"));
        const q = url.searchParams.get("q");
        const sort = (url.searchParams.get("sort") || "custom") as
            | "custom"
            | "time-asc"
            | "time-desc"
            | "undone-first";

        // -------------------------------------------
        // ✅ 1) 데모 주차면 고정 데이터
        // -------------------------------------------
        const demo = demoWeeklyTodosByStartDate[startDate];
        if (demo) {
            let weeklyTodos = demo.weeklyTodos.map((day: any) => ({
                ...day,
                todos: day.todos.map((t: any) => ({
                    ...t,
                    // ✅ 프론트가 isDone을 기대해도 깨지지 않도록 보장
                    isDone: t.completed,
                })),
            }));

            weeklyTodos = weeklyTodos.map((day: any) => {
                let list = day.todos as Array<{
                    id: string;
                    title: string;
                    time: string;
                    completed: boolean;
                    isDone?: boolean;
                }>;

                // completed 필터
                if (typeof completed === "boolean") {
                    list = list.filter((t) => t.completed === completed);
                }

                // 검색 필터
                if (q) {
                    const qq = q.toLowerCase();
                    list = list.filter((t) => t.title.toLowerCase().includes(qq));
                }

                // 정렬
                if (sort === "time-asc" || sort === "time-desc") {
                    list = [...list].sort((a, b) => {
                        const A = toMinutes(a.time);
                        const B = toMinutes(b.time);
                        return sort === "time-asc" ? A - B : B - A;
                    });
                } else if (sort === "undone-first") {
                    list = [...list].sort((a, b) => {
                        const ad = a.completed ? 1 : 0;
                        const bd = b.completed ? 1 : 0;
                        if (ad !== bd) return ad - bd;
                        return toMinutes(a.time) - toMinutes(b.time);
                    });
                }

                // limit
                if (typeof limit === "number" && limit > 0) {
                    list = list.slice(0, limit);
                }

                return { ...day, todos: list };
            });

            if (dayOnly) {
                const found = weeklyTodos.find((w: any) => w.date === dayOnly);
                if (!found) return bad(404, "요청한 날짜가 주간 범위에 없습니다.(데모)");
                return ok("특정 일자 할일 조회 성공(데모)", { weeklyTodos: [found] });
            }

            return ok("일주일 할일 조회 성공(데모)", { weeklyTodos });
        }

        // -------------------------------------------
        // ✅ 2) 데모 범위 밖: 랜덤 생성 (절대 400 내지 않게)
        // -------------------------------------------
        const base = new Date(startDate); // startDate는 이미 YYYY-MM-DD로 정규화됨
        // 이 시점에 NaN이면 거의 없지만, 안전장치
        if (Number.isNaN(base.getTime())) {
            const fallback = new Date();
            const fixed = fmt(fallback);
            // fallback으로 처리해서 400 방지
            // (원하면 여기서 bad(400)로 바꿔도 되는데, 시연용이면 안 깨지는 게 우선)
            // eslint-disable-next-line no-console
            console.warn("[MSW] weekly startDate invalid, fallback to today:", startDate, "->", fixed);
            base.setTime(fallback.getTime());
        }

        const makeDay = (d: Date) => {
            const dateStr = fmt(d);
            let list = pickDailyTodos(dateStr, todos, {
                min: 1,
                max: 4,
                doneRate: [0, 6].includes(d.getDay()) ? 0.5 : 0.35,
            });

            if (typeof completed === "boolean") {
                list = list.filter((t) => t.isDone === completed);
            }
            if (q) {
                const qq = q.toLowerCase();
                list = list.filter((t) => t.title.toLowerCase().includes(qq));
            }

            if (sort === "time-asc" || sort === "time-desc") {
                list.sort((a, b) => {
                    const A = toMinutes(a.time);
                    const B = toMinutes(b.time);
                    return sort === "time-asc" ? A - B : B - A;
                });
            } else if (sort === "undone-first") {
                list.sort((a, b) => {
                    const ad = a.isDone ? 1 : 0;
                    const bd = b.isDone ? 1 : 0;
                    if (ad !== bd) return ad - bd;
                    return toMinutes(a.time) - toMinutes(b.time);
                });
            }

            if (typeof limit === "number" && limit > 0) {
                list = list.slice(0, limit);
            }

            return { date: dateStr, todos: list };
        };

        const weeklyTodos = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(base);
            d.setDate(base.getDate() + i);
            return makeDay(d);
        });

        if (dayOnly) {
            const found = weeklyTodos.find((w) => w.date === dayOnly);
            if (!found) return bad(404, "요청한 날짜가 주간 범위에 없습니다.");
            return ok("특정 일자 할일 조회 성공", { weeklyTodos: [found] });
        }

        return ok("일주일 할일 조회 성공", { weeklyTodos });
    }),

    /**
     * 요일별 완료 횟수
     * Query or Body: weekStartDate=YYYY-MM-DD
     */
    http.get("*/api/v1/feedback/counts", async ({ request }) => {
        const err = authGuard(request);
        if (err) return err;

        const url = new URL(request.url);
        const qs = url.searchParams.get("weekStartDate");
        let weekStartDate = qs ?? undefined;
        if (!weekStartDate) {
            const body = await readJson<{ weekStartDate?: string }>(request);
            weekStartDate = body.weekStartDate;
        }
        if (!weekStartDate) return bad(400, "필수 데이터가 누락되었습니다.");

        // 더미: 실제론 DB 집계. 여기선 현재 todos의 completed를 임의 집계했다고 가정.
        const counts = { MON: 2, TUE: 1, WED: 0, THU: 1, FRI: 1, SAT: 0, SUN: 2 };
        return ok("요일별 청소 완료 횟수 조회 성공", { counts, weekStartDate });
    }),

    /**
     * 피드백 제출
     */
    http.post("*/api/v1/feedback", async ({ request }) => {
        const err = authGuard(request);
        if (err) return err;

        type Body = {
            weekStartDate?: string;
            cleaningAmountScore?: number;
            recommendedTimeScore?: number;
            comment?: string;
        };
        const body = await readJson<Body>(request);
        if (!body.weekStartDate || body.cleaningAmountScore == null || body.recommendedTimeScore == null) {
            return bad(400, "필수 데이터가 누락되었습니다.");
        }
        return created("주간 피드백 제출 완료", { weekStartDate: body.weekStartDate });
    }),

    /**
     * 프로필
     */
    http.get("*/api/v1/users/profile", ({ request }) => {
        const err = authGuard(request);
        if (err) return err;
        return ok("프로필 조회 성공", profile);
    }),

    http.put("*/api/v1/users/profile", async ({ request }) => {
        const err = authGuard(request);
        if (err) return err;
        const body = await readJson<{ nickname?: string; email?: string }>(request);

        if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
            return bad(400, "email 형식이 올바르지 않습니다.");
        }

        profile = {
            ...profile,
            ...(typeof body.nickname === "string" ? { nickname: body.nickname } : {}),
            ...(typeof body.email === "string" ? { email: body.email } : {}),
        };
        return ok("프로필 수정 완료", null);
    }),

    /**
     * 세션
     */
    http.post("*/api/v1/users/logout", ({ request }) => {
        const err = authGuard(request);
        if (err) return err;
        return ok("로그아웃 완료", null);
    }),

    http.delete("*/api/v1/users/withdraw", ({ request }) => {
        const err = authGuard(request);
        if (err) return err;
        return ok("회원 탈퇴 완료", null);
    }),

    /**
     * 날씨 (대시보드)
     */
    http.get("*/api/v1/weather/today", ({ request }) => {
        const err = authGuard(request);
        if (err) return err;

        const data = {
            temperature: 23,
            condition: "맑음",
            humidity: 55,
            dustLevel: "보통",
        };

        return ok("오늘 날씨 조회 성공", data);
    }),
];
