// pages/AddRoutinePage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { addTodo } from "@/lib/todoService"; // 이미 구현됨(AM/PM 변환 포함)

// '월'~'일' → 1~7 (월=1, 일=7)
const KR_DAY_TO_IDX: Record<string, number> = { "월":1,"화":2,"수":3,"목":4,"금":5,"토":6,"일":7 };

function formatDate(d: Date) {
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function nextDateForDow(targetDow1to7: number) {
    const now = new Date();
    const todayDow = ((now.getDay() + 6) % 7) + 1; // 월=1 ... 일=7
    const diff = (targetDow1to7 - todayDow + 7) % 7;
    const res = new Date(now);
    res.setDate(now.getDate() + diff);
    return res;
}

export default function AddRoutinePage() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState(""); // 서버 스펙에 없으면 미전송
    const [time, setTime] = useState("09:00");         // "HH:mm"
    const [days, setDays] = useState<string[]>([]);
    const dayOptions = ["월", "화", "수", "목", "금", "토", "일"];

    const toggleDay = (day: string) => {
        setDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
    };

    const m = useMutation({
        mutationFn: async (payloads: Array<{ title: string; time: string; date: string }>) => {
            // 여러 건 직렬 호출(간단)
            for (const p of payloads) {
                await addTodo(p);
            }
            return { status: 200, message: "OK" };
        },
        onSuccess: () => {
            alert("루틴(할 일)이 등록되었습니다.");
            navigate("/today");
        },
        onError: (e: unknown) => {
            const msg = e instanceof Error ? e.message : "등록 중 오류가 발생했습니다.";
            alert(msg);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const t = title.trim();
        if (!t) {
            alert("제목을 입력하세요.");
            return;
        }

        let payloads: Array<{ title: string; time: string; date: string }> = [];

        if (days.length === 0) {
            // 요일 미선택 → 오늘 1건
            payloads = [{ title: t, time, date: formatDate(new Date()) }];
        } else {
            // 선택한 각 요일의 '다음 발생일'로 1건씩 생성
            payloads = days.map((kr) => {
                const dow = KR_DAY_TO_IDX[kr];
                const date = formatDate(nextDateForDow(dow));
                return { title: t, time, date };
            });
        }

        // description은 현재 서버 스펙에 없다고 가정 → 보류
        m.mutate(payloads);
    };

    return (
        <main className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">루틴 추가</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">청소 제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full border rounded-xl px-3 py-2"
                        placeholder="예: 방바닥 청소"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">설명(선택)</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded-xl px-3 py-2"
                        placeholder="예: 먼지가 많으니 환기 후 물걸레질"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">실행 시간</label>
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        className="border rounded-xl px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">반복 요일(선택)</label>
                    <div className="flex gap-2 flex-wrap">
                        {dayOptions.map((day) => (
                            <button
                                type="button"
                                key={day}
                                onClick={() => toggleDay(day)}
                                className={`px-3 py-1 rounded-xl border ${
                                    days.includes(day) ? "bg-blue-500 text-white border-blue-600" : "bg-gray-100 text-gray-700"
                                }`}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={m.isPending}
                    className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-semibold disabled:opacity-50"
                >
                    {m.isPending ? "저장 중..." : "루틴 저장하기"}
                </button>
            </form>
        </main>
    );
}
