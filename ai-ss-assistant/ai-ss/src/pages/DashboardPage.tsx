import React, { useState, useEffect } from "react";
import { useDashboardData, Routine } from "../hooks/useDashboardData";
import { TodoCard } from "../components/TodoCard";

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
        <main className="p-4 space-y-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-semibold">오늘의 청소 루틴</h1>

            <section className="space-y-4">
                {routines.map((routine) => (
                    <TodoCard
                        key={routine.id}
                        routine={routine}
                        onToggle={toggleRoutineDone}
                    />
                ))}
            </section>
        </main>
    );
}
