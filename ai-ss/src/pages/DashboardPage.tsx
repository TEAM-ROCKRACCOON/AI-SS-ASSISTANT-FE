// pages/DashboardPage.tsx

import React, { useState, useEffect } from "react";
import { useDashboardData, Routine } from "../hooks/useDashboardData";
import { TodoCard } from "../components/TodoCard";
import { WeeklySchedule } from "../components/WeeklySchedule";
import { CleaningRoutineCard } from "../components/CleaningRoutineCard";

export default function DashboardPage() {
    const { data, isLoading, error } = useDashboardData();
    const [routines, setRoutines] = useState<Routine[]>([]);

    useEffect(() => {
        if (data?.routines) {
            setRoutines(data.routines);
        }
    }, [data]);

    const toggleRoutineDone = (id: string) => {
        setRoutines((prev) =>
            prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
        );
    };

    if (isLoading) return <div className="p-4">로딩 중...</div>;
    if (error) return <div className="p-4 text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>;
    if (!data) return <div className="p-4">데이터가 없습니다.</div>;

    return (
        <main className="p-6 space-y-10 max-w-3xl mx-auto">
            {/* 오늘의 루틴 */}
            <section>
                <h1 className="text-2xl font-semibold mb-4">🧹 오늘의 청소 루틴</h1>
                <div className="space-y-4">
                    {routines.map((routine) => (
                        <TodoCard
                            key={routine.id}
                            routine={routine}
                            onToggle={toggleRoutineDone}
                        />
                    ))}
                </div>
            </section>

            {/* 주간 일정 예시 */}
            <section>
                <h2 className="text-xl font-semibold mb-2">📅 주간 스케줄</h2>
                <WeeklySchedule
                    blocks={[
                        { summary: "수업", day: 1, start: 10, end: 12, type: "schedule" },
                        { summary: "수면", day: 1, start: 0, end: 7, type: "sleep" },
                        { summary: "화장실 청소", day: 1, start: 20, end: 21, type: "cleaning" },
                    ]}
                />
            </section>

            {/* 추천 루틴 카드 */}
            <section>
                <h2 className="text-xl font-semibold mb-2">✨ 추천 루틴</h2>
                <CleaningRoutineCard
                    task={{
                        name: "화장실 청소",
                        duration: 1,
                        interval: 7,
                        description: "세면대, 변기, 타일 닦기",
                        time: 20.0,
                        day: 1,
                    }}
                />
            </section>
        </main>
    );
}
