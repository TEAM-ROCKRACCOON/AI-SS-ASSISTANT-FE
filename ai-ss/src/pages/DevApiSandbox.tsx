import { useState } from "react";
import http from "@/shared/api/http";
import { toAmPm } from "@/lib/time";

type Res = unknown;

export default function DevApiSandbox() {
    const [out, setOut] = useState<Res | null>(null);
    const [err, setErr] = useState<string | null>(null);

    const run = async (name: string, fn: () => Promise<any>) => {
        setErr(null);
        try {
            const data = await fn();
            setOut({ name, data, at: new Date().toISOString() });
            console.log(`✅ ${name}`, data);
        } catch (e) {
            setErr(e instanceof Error ? e.message : String(e));
        }
    };

    // --- Todo APIs ---
    const getToday = () => run("GET /todo/today", async () => {
        const res = await http.get("/api/v1/todo/today");
        return res.data;
    });

    const addTodo = () => run("POST /todo", async () => {
        const body = { title: "베란다 청소", time: toAmPm("09:00"), date: "2025-08-09" };
        const res = await http.post("/api/v1/todo", body);
        return res.data;
    });

    const patchTime = () => run("PATCH /todo/time/:id", async () => {
        const id = prompt("todoId?") || "1";
        const body = { time: toAmPm("10:30") };
        const res = await http.patch(`/api/v1/todo/time/${id}`, body);
        return res.data;
    });

    const patchDone = () => run("PATCH /todo/isdone/:id", async () => {
        const id = prompt("todoId?") || "1";
        const body = { isDone: true };
        const res = await http.patch(`/api/v1/todo/isdone/${id}`, body);
        return res.data;
    });

    const delTodo = () => run("DELETE /todo/:id", async () => {
        const id = prompt("todoId?") || "1";
        const res = await http.delete(`/api/v1/todo/${id}`);
        return res.data;
    });

    const getWeekly = () => run("GET /todo/weekly", async () => {
        const startDate = "2025-08-09";
        const res = await http.get(`/api/v1/todo/weekly`, { params: { startDate } });
        return res.data;
    });

    // --- Feedback APIs ---
    const getCounts = () => run("GET /feedback/counts", async () => {
        const weekStartDate = "2025-08-04";
        const res = await http.get(`/api/v1/feedback/counts`, { params: { weekStartDate } });
        return res.data;
    });

    const postFeedback = () => run("POST /feedback", async () => {
        const body = {
            weekStartDate: "2025-08-04",
            cleaningAmountScore: 4,
            recommendedTimeScore: 5,
            comment: "추천 시간대가 조금 이르네요",
        };
        const res = await http.post(`/api/v1/feedback`, body);
        return res.data;
    });

    // --- User/Profile APIs ---
    const getProfile = () => run("GET /users/profile", async () => {
        const res = await http.get(`/api/v1/users/profile`);
        return res.data;
    });

    const putProfile = () => run("PUT /users/profile", async () => {
        const body = { nickname: "청소요정", email: "cleaner@example.com" };
        const res = await http.put(`/api/v1/users/profile`, body);
        return res.data;
    });

    const logout = () => run("POST /users/logout", async () => {
        const res = await http.post(`/api/v1/users/logout`, {});
        return res.data;
    });

    const withdraw = () => run("DELETE /users/withdraw", async () => {
        const res = await http.delete(`/api/v1/users/withdraw`);
        return res.data;
    });

    // --- Onboarding ---
    const postNickname = () => run("POST /users/nickname/register", async () => {
        const res = await http.post(`/api/v1/users/nickname/register`, { nickname: "야호" });
        return res.data;
    });

    const postAddress = () => run("POST /users/address", async () => {
        const body = {
            roadAddressName: "서울시 마포구 어딘가",
            placeDetailAddress: "101동 1234호",
            latitude: 37.55,
            longitude: 126.91,
        };
        const res = await http.post(`/api/v1/users/address`, body);
        return res.data;
    });

    const postHabit = () => run("POST /users/habit", async () => {
        const body = {
            cleaningFrequency: "DAILY",
            cleaningDistribution: "SPLIT_AND_MAINTAIN",
            preferredTimeRange: "MORNING",
            preferredDays: ["TUE", "THU", "SAT"],
            itemQuantity: "TOO_MUCH",
        };
        const res = await http.post(`/api/v1/users/habit`, body);
        return res.data;
    });

    const triggerCalendar = () => run("POST /users/calendar", async () => {
        const res = await http.post(`/api/v1/users/calendar`, {});
        return res.data;
    });

    return (
        <div style={{ padding: 16 }}>
            <h1>Dev API Sandbox</h1>
            <p>로컬 토큰 필요하면: <code>localStorage.setItem("accessToken","dev-access-token")</code></p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: 8 }}>
                <button onClick={getToday}>GET today</button>
                <button onClick={addTodo}>POST todo</button>
                <button onClick={patchTime}>PATCH time</button>
                <button onClick={patchDone}>PATCH isDone</button>
                <button onClick={delTodo}>DELETE todo</button>
                <button onClick={getWeekly}>GET weekly</button>

                <button onClick={getCounts}>GET feedback counts</button>
                <button onClick={postFeedback}>POST feedback</button>

                <button onClick={getProfile}>GET profile</button>
                <button onClick={putProfile}>PUT profile</button>
                <button onClick={logout}>POST logout</button>
                <button onClick={withdraw}>DELETE withdraw</button>

                <button onClick={postNickname}>POST nickname</button>
                <button onClick={postAddress}>POST address</button>
                <button onClick={postHabit}>POST habit</button>
                <button onClick={triggerCalendar}>POST calendar trigger</button>
            </div>

            <pre style={{ background: "#111", color: "#0f0", padding: 12, marginTop: 16, whiteSpace: "pre-wrap" }}>
            {out ? JSON.stringify(out, null, 2) : "결과 없음"}
            </pre>
                {err && (
                    <pre style={{ background: "#200", color: "#f88", padding: 12, marginTop: 8 }}>
                        {err}
                    </pre>
                )}
        </div>
    );
}
