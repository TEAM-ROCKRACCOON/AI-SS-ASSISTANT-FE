// components/CleaningRoutineCard.tsx

import React from "react";

type CleaningTask = {
    name: string;
    duration: number;
    interval: number;
    description: string;
    time?: number; // optional, for scheduled time (e.g., 14.0)
    day?: number;  // optional, 0~6
};

export const CleaningRoutineCard: React.FC<{ task: CleaningTask }> = ({ task }) => {
    const formatDay = (day?: number) => {
        const days = ["월", "화", "수", "목", "금", "토", "일"];
        return day !== undefined ? days[day] : "언제든지";
    };

    const formatTime = (time?: number) => {
        if (time === undefined) return "";
        const hour = Math.floor(time);
        const min = (time % 1) * 60;
        return `${hour}시 ${min ? `${min}분` : ""}`;
    };

    return (
        <div className="rounded-2xl shadow-md p-4 bg-white w-full max-w-md">
            <h3 className="text-xl font-semibold mb-2">{task.name}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
            <div className="mt-3 text-sm text-gray-700 space-y-1">
                <p>🕒 소요 시간: {task.duration}시간</p>
                <p>🔁 주기: {task.interval}일</p>
                {task.time !== undefined && (
                    <p>📅 추천: {formatDay(task.day)} {formatTime(task.time)}</p>
                )}
            </div>
        </div>
    );
};
