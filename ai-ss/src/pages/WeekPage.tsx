import React, { useMemo, useState } from "react";
import { useWeeklyTodos } from "@/hooks/useTodos";

function startOfISOWeek(date = new Date()): Date {
    const d = new Date(date);
    // 월 = 1 … 일 = 7 형태로 맞춤
    const day = (d.getDay() + 6) % 7; // 0(일)→6, 1(월)→0 …
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - day);
    return d;
}
function fmtISO(d: Date) {
    return [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, "0"),
        String(d.getDate()).padStart(2, "0"),
    ].join("-");
}

export default function WeekPage() {
    const [startDate, setStartDate] = useState(() => fmtISO(startOfISOWeek()));
    const { data, isLoading, isError } = useWeeklyTodos(startDate);

    const weekly = useMemo(() => data ?? [], [data]);

    return (
        <div className="min-h-screen p-6 max-w-2xl mx-auto bg-white">
            <h1 className="text-2xl font-bold mb-4 text-center">일주일 루틴</h1>

            <div className="mb-6 flex items-center gap-3">
                <label className="text-sm text-gray-600">시작일(월):</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border rounded px-3 py-2"
                />
            </div>

            {isLoading && <div>불러오는 중…</div>}
            {isError && <div className="text-red-600">조회 실패</div>}

            <div className="space-y-6">
                {weekly.map(({ date, todos }) => (
                    <section key={date} className="border rounded p-4 bg-gray-50">
                        <h2 className="font-semibold mb-2">{date}</h2>
                        {todos.length === 0 ? (
                            <p className="text-gray-400 text-sm">등록된 할 일이 없습니다.</p>
                        ) : (
                            <ul className="list-disc pl-5 space-y-1">
                                {todos.map((t) => (
                                    <li key={t.id}>
                                        <span>{t.title}</span>{" "}
                                        <span className={`text-xs ml-2 ${t.isDone ? "text-green-600" : "text-gray-400"}`}>
                      {t.isDone ? "완료" : "미완료"}
                    </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                ))}
            </div>
        </div>
    );
}
