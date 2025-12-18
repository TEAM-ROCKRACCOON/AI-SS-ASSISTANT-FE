// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";
import { demoWeeklyTodosByStartDate } from "./demoWeeklyTodos";

/**
 * 도메인 타입
 */
type Todo = { id: string; title: string; time: string; completed: boolean };

/**
 * 메모리 상태 (개발/테스트 전용)
 */
let profile = {
    nickname: "김이화",
    email: "ewhakim@ewhain.net",
    termsUrl: "https://myapp.com/terms",
};

let todos: Todo[] = [
    //{ id: "26", title: "거실 - 청소기로 바닥 먼지 제거", time: "11:00 AM", completed: true },
    //{ id: "27", title: "주방 - 수건 교체", time: "21:00 PM", completed: true },
];

/**
 * 시연용: 인증 완전 무시
 */
const authGuard = (_req: Request) => null;

/**
 * 유틸
 */
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

const created = <T>(message: string, data: T) => HttpResponse.json({ status: 201, message, data }, { status: 201 });

const bad = (statusCode: number, message: string) =>
    HttpResponse.json({ status: statusCode, message, data: null }, { status: statusCode });

const toMinutes = (t: string) => {
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
        const isPM = H >= 12;
        const h12 = H % 12 === 0 ? 12 : H % 12;
        return `${String(h12).padStart(2, "0")}:${String(M).padStart(2, "0")} ${isPM ? "PM" : "AM"}`;
    }

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

/**
 * 시드 기반 랜덤 생성(날짜별로 고정되게)
 */
const seeded = (seedStr: string) => {
    let h = 2166136261;
    for (let i = 0; i < seedStr.length; i++) {
        h ^= seedStr.charCodeAt(i);
        h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    let x = h >>> 0;
    return () => {
        x ^= x << 13;
        x ^= x >>> 17;
        x ^= x << 5;
        return ((x >>> 0) % 100000) / 100000;
    };
};

const pickDailyTodos = (
    dateStr: string,
    base: Todo[],
    opts?: {
        min?: number;
        max?: number;
        doneRate?: number;
    }
) => {
    const rnd = seeded(dateStr);
    const arr = base.slice();

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    const min = opts?.min ?? 4;
    const max = opts?.max ?? 8;
    const k = Math.max(min, Math.min(max, Math.floor(rnd() * (max - min + 1)) + min));
    const doneRate = opts?.doneRate ?? 0.4;

    const sampled = arr.slice(0, k).map((t) => ({ ...t, completed: rnd() < doneRate }));

    sampled.sort((a, b) => {
        const aDone = a.completed ? 1 : 0;
        const bDone = b.completed ? 1 : 0;
        if (aDone !== bDone) return aDone - bDone;
        return toMinutes(a.time) - toMinutes(b.time);
    });

    // weekly 응답 호환: isDone 포함
    return sampled.map((t) => ({
        id: t.id,
        title: t.title,
        time: t.time,
        completed: t.completed,
        isDone: t.completed,
    }));
};

/**
 * startDate 정규화
 */
const normalizeStartDate = (raw: string | null): string => {
    if (!raw) return fmt(new Date());
    const s = raw.trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

    const m = s.match(/^(\d{4})[./-](\d{1,2})[./-](\d{1,2})$/);
    if (m) {
        const y = m[1];
        const mm = String(m[2]).padStart(2, "0");
        const dd = String(m[3]).padStart(2, "0");
        return `${y}-${mm}-${dd}`;
    }

    const d = new Date(s);
    if (!Number.isNaN(d.getTime())) return fmt(d);

    return fmt(new Date());
};

/**
 * 주간 핸들러 공통 로직
 * - /api/v1/todo/weekly
 * - /api/v1/todo/week  (프론트가 이걸 치고 있어서 CORS 났던 것)
 */
const handleWeekly = (request: Request) => {
    const err = authGuard(request);
    if (err) return err;

    const url = new URL(request.url);

    const startDate = normalizeStartDate(url.searchParams.get("startDate"));
    const dayOnly = url.searchParams.get("day");

    const limit = parseIntSafe(url.searchParams.get("limit"));
    const completed = parseBool(url.searchParams.get("completed"));
    const q = url.searchParams.get("q");
    const sort = (url.searchParams.get("sort") || "custom") as "custom" | "time-asc" | "time-desc" | "undone-first";

    // 1) 데모 주차면 고정 데이터 사용
    const demo = demoWeeklyTodosByStartDate[startDate];
    if (demo) {
        let weeklyTodos = demo.weeklyTodos.map((day: any) => ({
            ...day,
            todos: day.todos.map((t: any) => ({
                ...t,
                // 프론트 호환
                isDone: typeof t.isDone === "boolean" ? t.isDone : t.completed,
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

            if (typeof completed === "boolean") list = list.filter((t) => t.completed === completed);

            if (q) {
                const qq = q.toLowerCase();
                list = list.filter((t) => t.title.toLowerCase().includes(qq));
            }

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

            if (typeof limit === "number" && limit > 0) list = list.slice(0, limit);

            // isDone 보장
            list = list.map((t) => ({ ...t, isDone: typeof t.isDone === "boolean" ? t.isDone : t.completed }));

            return { ...day, todos: list };
        });

        if (dayOnly) {
            const found = weeklyTodos.find((w: any) => w.date === dayOnly);
            if (!found) return bad(404, "요청한 날짜가 주간 범위에 없습니다.(데모)");
            return ok("특정 일자 할일 조회 성공(데모)", { weeklyTodos: [found] });
        }

        return ok("일주일 할일 조회 성공(데모)", { weeklyTodos });
    }

    // 2) 데모 범위 밖: 날짜 기반 랜덤 생성
    const base = new Date(startDate);
    if (Number.isNaN(base.getTime())) {
        // startDate를 normalize 했기 때문에 거의 안 타지만 안전장치
        const fallback = new Date();
        base.setTime(fallback.getTime());
    }

    const makeDay = (d: Date) => {
        const dateStr = fmt(d);
        let list = pickDailyTodos(dateStr, todos, {
            min: 1,
            max: 4,
            doneRate: [0, 6].includes(d.getDay()) ? 0.5 : 0.35,
        });

        if (typeof completed === "boolean") list = list.filter((t) => t.isDone === completed);

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

        if (typeof limit === "number" && limit > 0) list = list.slice(0, limit);

        return { date: dateStr, todos: list.map((t) => ({ ...t, isDone: t.isDone })) };
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
};

/**
 * 핸들러 모음
 */
export const handlers = [
    /**
     * 로그인 (OAuth code 받아도 무조건 성공 처리)
     */
    http.post("*/api/v1/users/login", ({ request }) => {
        const url = new URL(request.url);
        const authorizationCode = url.searchParams.get("authorizationCode");

        return HttpResponse.json(
            {
                status: 200,
                message: "로그인 성공(데모)",
                data: {
                    accessToken: "demo-access-token",
                    refreshToken: "demo-refresh-token",
                    user: { nickname: profile.nickname, email: profile.email },
                    authorizationCodeReceived: Boolean(authorizationCode),
                },
            },
            { status: 200 }
        );
    }),

    /**
     * 오늘 할 일 조회
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

        if (idSet) list = list.filter((t) => idSet.has(t.id));
        list = list.filter((t) => contains(t.title, q));
        if (completed !== undefined) list = list.filter((t) => t.completed === completed);
        if (period) list = list.filter((t) => inPeriod(t.time, period));

        list.sort((a, b) => {
            const A = toMinutes(a.time);
            const B = toMinutes(b.time);
            return sort === "time-asc" ? A - B : B - A;
        });

        if (Number.isFinite(sample as number) && (sample as number) > 0) {
            const arr = list.slice();
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            list = arr.slice(0, sample as number);
        }

        const { data, meta } = paginate(list, page, size);
        return ok("오늘의 할 일 조회 성공", { todos: data, meta });
    }),

    /**
     * 할 일 추가
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
     * 완료 여부 변경
     */
    http.patch("*/api/v1/todo/isdone/:id", async ({ params, request }) => {
        const err = authGuard(request);
        if (err) return err;

        type Body = { completed?: boolean; isDone?: boolean };
        const body = await readJson<Body>(request);

        const next =
            typeof body.completed === "boolean" ? body.completed : typeof body.isDone === "boolean" ? body.isDone : undefined;

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
     * 주간 목록: 둘 다 잡기
     * - /todo/weekly (기존)
     * - /todo/week   (프론트가 치는 경로)
     */
    http.get("*/api/v1/todo/weekly", ({ request }) => handleWeekly(request)),
    http.get("*/api/v1/todo/week", ({ request }) => handleWeekly(request)),

    /**
     * 요일별 완료 횟수
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
     * 날씨
     */
    http.get("*/api/v1/weather/today", ({ request }) => {
        const err = authGuard(request);
        if (err) return err;

        const data = {
            location: "서울",
            temperature: 3.9,          // ℃
            condition: "맑음",
            windDirection: "북",
            windSpeed: 1.2,            // m/s
            humidity: 57,              // %
            pressure: 1025.9,          // hPa
            visibility: "20km 이상",
            dustLevel: "보통",
        };

        return ok("오늘 날씨 조회 성공", data);
    }),
];
