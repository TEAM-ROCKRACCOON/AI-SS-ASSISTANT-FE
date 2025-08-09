// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";

type Todo = { id: string; title: string; time: string; completed: boolean };

// ── 메모리 상태 (개발/테스트 전용) ─────────────────────────────
let profile = {
    nickname: "바위너구리",
    email: "example@example.com",
    termsUrl: "https://yourapp.com/terms",
};

let todos: Todo[] = [
    { id: "1", title: "거실 청소", time: "09:00", completed: false },
    { id: "2", title: "욕실 청소", time: "10:30", completed: true },
];

// ── 유틸 ─────────────────────────────────────────────────────
const authGuard = (req: Request) => {
    const auth = req.headers.get("authorization") ?? req.headers.get("Authorization");
    if (!auth || !/^Bearer\s+.+/.test(auth)) {
        return HttpResponse.json({ status: 401, message: "유효한 토큰이 필요합니다." }, { status: 401 });
    }
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

// ── 핸들러 모음 ───────────────────────────────────────────────
export const handlers = [
    // 오늘 할 일
    http.get("*/api/v1/todo/today", ({ request }) => {
        const err = authGuard(request);
        if (err) return err;
        return HttpResponse.json(todos);
    }),

    // 할 일 추가
    http.post("*/api/v1/todo", async ({ request }) => {
        const err = authGuard(request);
        if (err) return err;

        type Body = { title?: string; time?: string; date?: string };
        const body = await readJson<Body>(request);

        const id = String(Date.now());
        const title = typeof body.title === "string" && body.title.trim() ? body.title : "새 할일";
        const time = typeof body.time === "string" ? body.time : "09:00";

        todos.push({ id, title, time, completed: false });
        return HttpResponse.json({ status: 201, message: "할일 추가 완료" }, { status: 201 });
    }),

    // 시간 수정 ("HH:mm AM/PM" -> 캐시는 HH:mm로 저장)
    http.patch("*/api/v1/todo/time/:id", async ({ params, request }) => {
        const err = authGuard(request);
        if (err) return err;

        type Body = { time?: string };
        const body = await readJson<Body>(request);

        const id = String(params.id ?? "");
        const timeAmPm = typeof body.time === "string" ? body.time : "09:00 AM";
        const hhmm = timeAmPm.slice(0, 5);

        todos = todos.map((t) => (t.id === id ? { ...t, time: hhmm } : t));
        return HttpResponse.json({ status: 200, message: "할일 시각 수정 완료" });
    }),

    // 완료 여부 변경 (completed / isDone 둘 다 허용)
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
                    : false;

        const id = String(params.id ?? "");
        todos = todos.map((t) => (t.id === id ? { ...t, completed: next } : t));
        return HttpResponse.json({ status: 200, message: "할일 완료 상태 업데이트 성공" });
    }),

    // 삭제
    http.delete("*/api/v1/todo/:id", ({ params, request }) => {
        const err = authGuard(request);
        if (err) return err;
        const id = String(params.id ?? "");
        todos = todos.filter((t) => t.id !== id);
        return HttpResponse.json({ status: 200, message: "할일 삭제 완료" });
    }),

    // 주간 목록 (?startDate=YYYY-MM-DD)
    http.get("*/api/v1/todo/weekly", ({ request }) => {
        const err = authGuard(request);
        if (err) return err;

        const url = new URL(request.url);
        const startDate = url.searchParams.get("startDate") ?? fmt(new Date());
        const base = new Date(startDate);
        if (Number.isNaN(base.getTime())) {
            return HttpResponse.json({ status: 400, message: "잘못된 데이터 형식입니다." }, { status: 400 });
        }

        const weeklyTodos = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(base);
            d.setDate(base.getDate() + i);
            return {
                date: fmt(d),
                todos: i % 2 === 0 ? [{ id: String(i + 1), title: "청소 루틴", isDone: i % 3 === 0 }] : [],
            };
        });

        return HttpResponse.json({ status: 200, message: "일주일 할일 조회 성공", data: { weeklyTodos } });
    }),

    // 요일별 완료 횟수 (?weekStartDate=YYYY-MM-DD)
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
        if (!weekStartDate) {
            return HttpResponse.json({ status: 400, message: "필수 데이터가 누락되었습니다." }, { status: 400 });
        }

        const counts = { MON: 2, TUE: 1, WED: 0, THU: 1, FRI: 1, SAT: 0, SUN: 2 };
        return HttpResponse.json({ status: 200, message: "요일별 청소 완료 횟수 조회 성공", data: { counts } });
    }),

    // 피드백 제출
    http.post("*/api/v1/feedback", async ({ request }) => {
        const err = authGuard(request);
        if (err) return err;

        type Body = { weekStartDate?: string; cleaningAmountScore?: number; recommendedTimeScore?: number; comment?: string };
        const body = await readJson<Body>(request);
        if (!body.weekStartDate || !body.cleaningAmountScore || !body.recommendedTimeScore) {
            return HttpResponse.json({ status: 400, message: "필수 데이터가 누락되었습니다." }, { status: 400 });
        }
        return HttpResponse.json({ status: 201, message: "주간 피드백 제출 완료" }, { status: 201 });
    }),

    // 프로필 (메모리 상태 사용)
    http.get("*/api/v1/users/profile", ({ request }) => {
        const err = authGuard(request);
        if (err) return err;
        return HttpResponse.json({ status: 200, message: "프로필 조회 성공", data: profile });
    }),

    http.put("*/api/v1/users/profile", async ({ request }) => {
        const err = authGuard(request);
        if (err) return err;
        const body = await readJson<{ nickname?: string; email?: string }>(request);
        profile = {
            ...profile,
            ...(typeof body.nickname === "string" ? { nickname: body.nickname } : {}),
            ...(typeof body.email === "string" ? { email: body.email } : {}),
        };
        return HttpResponse.json({ status: 200, message: "프로필 수정 완료" });
    }),

    // 로그아웃/탈퇴
    http.post("*/api/v1/users/logout", ({ request }) => {
        const err = authGuard(request);
        if (err) return err;
        return HttpResponse.json({ status: 200, message: "로그아웃 완료" });
    }),

    http.delete("*/api/v1/users/withdraw", ({ request }) => {
        const err = authGuard(request);
        if (err) return err;
        return HttpResponse.json({ status: 200, message: "회원 탈퇴 완료" });
    }),
];
