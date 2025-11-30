// src/pages/DashboardPage.tsx
import React, { useEffect, useMemo } from "react";
import { useDashboardData, Routine } from "@/hooks/useDashboardData";
import WeatherCard from "@/components/WeatherCard";
import { Button } from "@/components/ui/Button";
import { getAccessToken } from "@/lib/authService";
import { useNavigate } from "react-router-dom";

/**
 * 대시보드 홈 화면
 * - 상단: 오늘의 날씨 카드
 * - 하단: 오늘의 체크리스트 프리뷰 (최대 3개)
 */
const DashboardPage: React.FC = () => {
    const navigate = useNavigate();

    // 로그인 가드
    useEffect(() => {
        if (!getAccessToken()) {
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    const { data, isLoading, error } = useDashboardData();

    const weather = data?.weather ?? null;

    // ✅ 어떤 형식이 오더라도 무조건 Routine[]로 변환
    const routines: Routine[] = useMemo(() => {
        const raw = data?.routines as any;

        if (!raw) return [];
        if (Array.isArray(raw)) return raw;

        // { data: [...] }
        if (Array.isArray(raw.data)) return raw.data;
        // { todos: [...] }
        if (Array.isArray(raw.todos)) return raw.todos;
        // ApiResponse<{ routines: [...] }>
        if (Array.isArray(raw.routines)) return raw.routines;

        return [];
    }, [data]);

    // 미완료 우선 + 시간순 정렬 후 상위 3개만 사용
    const previewRoutines = useMemo(() => {
        const list = routines.slice(); // 여기서 이제 항상 배열

        list.sort((a, b) => {
            const ad = a.completed ? 1 : 0;
            const bd = b.completed ? 1 : 0;
            if (ad !== bd) return ad - bd; // 미완료 먼저

            const parseMinutes = (t?: string) => {
                if (!t) return Number.POSITIVE_INFINITY;
                const m = t.match(/^(\d{1,2}):(\d{2})/);
                if (!m) return Number.POSITIVE_INFINITY;
                const h = parseInt(m[1], 10);
                const min = parseInt(m[2], 10);
                if (Number.isNaN(h) || Number.isNaN(min)) {
                    return Number.POSITIVE_INFINITY;
                }
                return h * 60 + min;
            };

            return parseMinutes(a.time) - parseMinutes(b.time);
        });

        return list.slice(0, 3);
    }, [routines]);

    const checklistError =
        error && !weather ? "대시보드 데이터를 불러오지 못했습니다." : null;

    return (
        <main className="flex h-full flex-col bg-gray-50 pb-24">
            {/* 상단 타이틀 */}
            <div className="px-4 pt-4 pb-2">
                <h1 className="text-xl font-semibold text-gray-900">오늘의 집 관리</h1>
                <p className="mt-1 text-xs text-gray-500">
                    날씨와 체크리스트를 한 번에 확인해 보세요.
                </p>
            </div>

            <div className="flex-1 space-y-4 px-4 pb-4">
                {/* 날씨 카드 */}
                <WeatherCard
                    weather={weather}
                    isLoading={isLoading}
                    error={error ? "날씨 정보를 불러오지 못했습니다." : null}
                    onClickDetail={() => navigate("/schedule")}
                />

                {/* 체크리스트 프리뷰 섹션 */}
                <section className="mt-2">
                    <div className="mb-2 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">
                                오늘의 체크리스트
                            </h2>
                            <p className="text-[11px] text-gray-500">
                                자주 하는 청소 루틴만 간단히 보여드려요.
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-gray-500 hover:text-gray-700"
                            onClick={() => navigate("/checklist")}
                        >
                            전체 보기 &gt;
                        </Button>
                    </div>

                    {checklistError && (
                        <p className="text-xs text-red-500">{checklistError}</p>
                    )}

                    {/* 로딩 스켈레톤 */}
                    {isLoading && !data && (
                        <div className="space-y-2">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="h-4 w-4 rounded-full border border-gray-200 bg-gray-100" />
                                        <div className="space-y-1">
                                            <div className="h-3 w-24 rounded bg-gray-200" />
                                            <div className="h-3 w-16 rounded bg-gray-100" />
                                        </div>
                                    </div>
                                    <div className="h-3 w-10 rounded bg-gray-100" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 할 일 없음 */}
                    {!isLoading && previewRoutines.length === 0 && (
                        <div className="rounded-xl border border-dashed border-gray-200 bg-white px-3 py-3 text-xs text-gray-500">
                            오늘 등록된 체크리스트가 없어요.
                            <br />
                            아래 체크리스트 탭에서 새로운 할 일을 추가해 보세요.
                        </div>
                    )}

                    {/* 프리뷰 리스트 */}
                    {!isLoading && previewRoutines.length > 0 && (
                        <div className="space-y-2">
                            {previewRoutines.map((routine) => (
                                <div
                                    key={routine.id}
                                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2"
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                                                routine.completed
                                                    ? "border-blue-500 bg-blue-500"
                                                    : "border-gray-300 bg-white"
                                            }`}
                                        >
                                            {routine.completed && (
                                                <span className="text-[10px] text-white">✓</span>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium text-gray-900">
                                                {routine.title}
                                            </span>
                                            {routine.time && (
                                                <span className="text-[11px] text-gray-500">
                                                    {routine.time}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {routine.completed ? (
                                        <span className="text-[11px] font-medium text-blue-500">
                                            완료
                                        </span>
                                    ) : (
                                        <span className="text-[11px] text-gray-400">
                                            아직 남았어요
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

export default DashboardPage;
