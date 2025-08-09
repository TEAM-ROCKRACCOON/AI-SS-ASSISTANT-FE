import React, { useMemo, useState } from "react";
import {
    useTodayTodos,
    usePatchTodoDone,
    usePatchTodoTime,
    useDeleteTodo,
    useAddTodo,
} from "@/hooks/useTodos";

function todayISO(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

export default function TodayPage() {
    const { data: tasks = [], isLoading, isError } = useTodayTodos();
    const patchDone = usePatchTodoDone();
    const patchTime = usePatchTodoTime();
    const remove = useDeleteTodo();
    const add = useAddTodo();

    const [newTitle, setNewTitle] = useState("");
    const [newTime, setNewTime] = useState("09:00");

    const sortedTasks = useMemo(
        () => [...tasks].sort((a, b) => a.time.localeCompare(b.time)),
        [tasks]
    );

    if (isLoading) return <div className="p-6">불러오는 중...</div>;
    if (isError) return <div className="p-6 text-red-600">데이터 로드 실패</div>;

    const handleToggle = (id: string, next: boolean) =>
        patchDone.mutate({ id, completed: next });

    const handleTimeChange = (id: string, time: string) =>
        patchTime.mutate({ id, time });

    const handleDelete = (id: string) => remove.mutate(id);

    const handleAdd = () => {
        if (!newTitle.trim()) return;
        add.mutate(
            { title: newTitle.trim(), time: newTime, date: todayISO() },
            {
                onSuccess: () => {
                    setNewTitle("");
                    setNewTime("09:00");
                },
            }
        );
    };

    return (
        <div className="min-h-screen p-6 bg-white max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">오늘 추천 청소 루틴</h1>

            <ul className="space-y-4 mb-8">
                {sortedTasks.map(({ id, title, time, completed }) => (
                    <li key={id} className="flex flex-col bg-gray-50 rounded-md p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <label className="flex items-center cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={completed}
                                    onChange={(e) => handleToggle(id, e.target.checked)}
                                    className="mr-3 w-5 h-5 text-blue-600"
                                />
                                <span className={`text-lg ${completed ? "line-through text-gray-400" : ""}`}>
                  {title}
                </span>
                            </label>
                            <button
                                onClick={() => handleDelete(id)}
                                className="text-sm text-red-500 hover:underline"
                            >
                                삭제
                            </button>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <label>시간:</label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => handleTimeChange(id, e.target.value)}
                                className="border px-2 py-1 rounded-md text-sm"
                            />
                        </div>
                    </li>
                ))}
            </ul>

            <div className="border-t pt-6 space-y-3">
                <h2 className="text-lg font-semibold">할 일 추가</h2>
                <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="청소 항목 제목"
                    className="w-full border px-3 py-2 rounded-md"
                />
                <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full border px-3 py-2 rounded-md"
                />
                <button
                    onClick={handleAdd}
                    className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50"
                    disabled={add.isPending}
                >
                    할 일 추가
                </button>
            </div>
        </div>
    );
}
