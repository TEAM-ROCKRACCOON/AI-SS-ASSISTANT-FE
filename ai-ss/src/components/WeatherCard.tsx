// src/components/WeatherCard.tsx
import React from "react";
import type { Weather } from "@/hooks/useDashboardData";

type WeatherCardProps = {
    /** 대시보드 훅에서 내려오는 날씨 데이터 */
    weather?: Weather | null;
    /** 로딩 상태일 때 true */
    isLoading?: boolean;
    /** 에러 메시지 (있으면 카드 안에 표시) */
    error?: string | null;
    /** 오른쪽 상단 ">" 눌렀을 때 동작 (선택) */
    onClickDetail?: () => void;
};

const WeatherCard: React.FC<WeatherCardProps> = ({
                                                     weather,
                                                     isLoading,
                                                     error,
                                                     onClickDetail,
                                                 }) => {
    if (isLoading) {
        return (
            <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm animate-pulse">
                <div className="flex justify-between items-start mb-4">
                    <div className="h-6 w-24 bg-gray-200 rounded" />
                    <div className="h-6 w-12 bg-gray-200 rounded" />
                </div>
                <div className="flex items-end gap-4 mb-3">
                    <div className="h-12 w-20 bg-gray-200 rounded" />
                    <div className="h-5 w-24 bg-gray-200 rounded" />
                </div>
                <div className="h-4 w-40 bg-gray-200 rounded mb-1" />
                <div className="h-4 w-32 bg-gray-200 rounded mb-3" />
                <div className="h-10 w-full bg-gray-100 rounded-lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                날씨 정보를 불러오는 중 오류가 발생했습니다.
                <span className="block text-xs text-red-500 mt-1">{error}</span>
            </div>
        );
    }

    if (!weather) {
        return (
            <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
                표시할 날씨 정보가 없습니다.
            </div>
        );
    }

    const { temperature, condition, humidity, dustLevel } = weather;
    const temp = temperature != null ? Math.round(temperature) : null;

    return (
        <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            {/* 상단 제목 라인 */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">오늘의 날씨</span>
                    <span className="text-xs text-gray-400">
            집 주변 기준으로 안내해드려요
          </span>
                </div>
            </div>

            {/* 가운데 메인 정보 */}
            <div className="flex items-end justify-between gap-4 mb-3">
                <div className="flex items-baseline gap-2">
                    {temp !== null && (
                        <>
              <span className="text-4xl font-semibold text-gray-900">
                {temp}
              </span>
                            <span className="text-lg text-gray-500">°C</span>
                        </>
                    )}
                </div>
                <div className="flex flex-col items-end text-right">
          <span className="text-sm font-medium text-gray-800">
            {condition}
          </span>
                    {humidity != null && (
                        <span className="text-xs text-gray-500 mt-1">
              습도 {humidity}%
            </span>
                    )}
                    {dustLevel && (
                        <span className="text-xs text-gray-500 mt-0.5">
              미세먼지 {dustLevel}
            </span>
                    )}
                </div>
            </div>

            {/* 하단 안내 문구 영역 */}
            <div className="mt-2 rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-600 leading-relaxed">
                {condition === "Rainy" || condition === "비"
                    ? "비가 와서 실내 청소하기 좋은 날이에요. 젖은 우산과 신발은 현관에 정리해두면 좋아요."
                    : condition === "Cloudy" || condition === "구름 많음"
                        ? "햇빛은 강하지 않아서 정리 정돈하기 좋은 날이에요. 창문을 조금 열어 환기도 해보세요."
                        : "공기 상태가 괜찮은 날이에요. 창문을 열어 환기하면서 가벼운 청소를 해보면 어떨까요?"}
            </div>
        </div>
    );
};

export default WeatherCard;
