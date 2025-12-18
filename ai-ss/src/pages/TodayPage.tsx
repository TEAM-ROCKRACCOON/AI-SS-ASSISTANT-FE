// src/pages/TodayPage.tsx
import React, { useEffect, useState } from "react";
import {
    useTodayTodos,
    usePatchTodoDone,
    useUpdateTodo,
    useDeleteTodo,
    useAddTodo,
} from "@/hooks/useTodos";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import WeatherCard from "@/components/WeatherCard";
import { useDashboardData } from "@/hooks/useDashboardData";
import { getAccessToken } from "@/lib/authService";
import { useNavigate } from "react-router-dom";

export default function TodayPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const useMock = String(import.meta.env.VITE_USE_MOCK) === "true";
        if (useMock) return;

        // if (!getAccessToken()) {
        //     navigate("/login", { replace: true });
        // }
    }, [navigate]);

    // 오늘 투두 리스트
    const {
        data: todos = [],
        isLoading,
        refetch: refetchTodayTodos,
    } = useTodayTodos();

    // 날씨/대시보드 데이터 (weather만 사용)
    const {
        data: dashboardData,
        isLoading: isWeatherLoading,
        error: weatherError,
    } = useDashboardData();
    const weather = dashboardData?.weather ?? null;

    // MUTATIONS
    const patchDone = usePatchTodoDone();
    const patchTime = useUpdateTodo();
    const deleteTodo = useDeleteTodo();
    const addTodo = useAddTodo();

    const [newTitle, setNewTitle] = useState("");
    const [newTime, setNewTime] = useState("");

    // src/pages/TodayPage.tsx

    const handleAddTodo = () => {
        const title = newTitle.trim();
        if (!title) return;

        addTodo.mutate(
            { title, time: newTime || undefined },
            {
                onSuccess: () => {
                    setNewTitle("");
                    setNewTime("");
                    // ✅ 추가 성공 후 오늘 투두 다시 가져오기
                    refetchTodayTodos();
                },
            } as any
        );
    };


    const handleToggleDone = (id: number | string, isDone: boolean) => {
        patchDone.mutate({ id, isDone: !isDone });
    };

    const handleTimeChange = (id: string, time: string) => {
        patchTime.mutate({ id, patch: { time } });
    };

    const handleDelete = (id: string) => {
        deleteTodo.mutate(id);
    };

    return (
        <main className="flex h-full flex-col bg-gray-50 pb-24">
            {/* 상단 제목 */}
            <div className="px-4 pt-4 pb-2">
                <h1 className="text-xl font-semibold text-gray-900">오늘의 할 일</h1>
                <p className="mt-1 text-xs text-gray-500">
                    날씨와 체크리스트를 한 화면에서 관리해 보세요.
                </p>
            </div>

            <div className="flex-1 space-y-4 px-4 pb-4">
                {/* 날씨 카드 */}
                <WeatherCard
                    weather={weather}
                    isLoading={isWeatherLoading}
                    error={weatherError ? "날씨 정보를 불러오지 못했습니다." : null}
                    onClickDetail={() => navigate("/schedule")}
                />

                {/* 체크리스트 입력 + 리스트 */}
                <section className="mt-2 rounded-2xl bg-white p-4 shadow-sm border border-gray-200">
                    {/* 새 할 일 추가 영역 (조금 더 넓게) */}
                    <div className="mb-4 space-y-2">
                        <h2 className="text-sm font-semibold text-gray-900">새 할 일 추가</h2>
                        <Input
                            placeholder="할 일 제목 (예: 거실 청소)"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="h-10 text-sm"
                        />
                        <div className="flex items-center gap-2">
                            <Input
                                type="time"
                                value={newTime}
                                onChange={(e) => setNewTime(e.target.value)}
                                className="h-10 w-32 text-sm"
                            />
                            <Button
                                variant="primary"
                                className="h-10 flex-1 text-sm"
                                onClick={handleAddTodo}
                                isLoading={addTodo.isPending}
                            >
                                추가
                            </Button>
                        </div>
                    </div>

                    {/* 리스트 헤더 */}
                    <div className="mb-2 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-900">
                            오늘의 체크리스트
                        </h2>
                        <span className="text-[11px] text-gray-400">총 {todos.length}개</span>
                    </div>

                    {/* 리스트 */}
                    {isLoading ? (
                        <div className="space-y-2">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 animate-pulse"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="h-4 w-4 rounded-full border border-gray-200 bg-white" />
                                        <div className="space-y-1">
                                            <div className="h-3 w-24 rounded bg-gray-200" />
                                            <div className="h-3 w-16 rounded bg-gray-100" />
                                        </div>
                                    </div>
                                    <div className="h-3 w-10 rounded bg-gray-100" />
                                </div>
                            ))}
                        </div>
                    ) : todos.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-3 py-3 text-xs text-gray-500">
                            오늘 등록된 할 일이 없어요.
                            <br />
                            위 입력창에서 새로운 할 일을 추가해 보세요.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {todos.map((t: any) => (
                                <div
                                    key={t.id}
                                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2"
                                >
                                    {/* 왼쪽: 체크박스 + 텍스트 */}
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={t.isDone}
                                            onChange={() => handleToggleDone(t.id, t.isDone)}
                                            className="h-4 w-4 rounded border-gray-300"
                                        />

                                        <div
                                            className={`text-sm ${
                                                t.isDone
                                                    ? "line-through text-gray-400"
                                                    : "text-gray-900"
                                            }`}
                                        >
                                            <div className="font-medium">{t.title}</div>
                                            {t.time && (
                                                <div className="text-[11px] text-gray-500">
                                                    {t.time}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* 오른쪽: 시간 수정 + 삭제 */}
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="time"
                                            className="w-24 h-8 text-xs"
                                            defaultValue={t.time || ""}
                                            onBlur={(e) =>
                                                handleTimeChange(t.id, e.target.value)
                                            }
                                        />
                                        <Button
                                            variant="ghost"
                                            className="text-red-500 text-xs"
                                            onClick={() => handleDelete(t.id)}
                                            isLoading={deleteTodo.isPending}
                                        >
                                            삭제
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
