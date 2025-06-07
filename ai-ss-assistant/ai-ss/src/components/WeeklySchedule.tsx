// components/WeeklySchedule.tsx
import React from "react";

type Block = {
    summary: string;
    day: number; // 0~6
    start: number;
    end: number;
    type: "schedule" | "sleep" | "cleaning";
};

export const WeeklySchedule: React.FC<{ blocks: Block[] }> = ({ blocks }) => {
    const days = ["월", "화", "수", "목", "금", "토", "일"];

    return (
        <div className="grid grid-cols-7 gap-2 w-full">
            {days.map((day, i) => (
                <div key={i} className="relative border h-[600px]">
                    <div className="text-center font-semibold bg-gray-100">{day}</div>
                    {blocks
                        .filter((b) => b.day === i)
                        .map((block, idx) => {
                            const top = (block.start / 24) * 550 + 30;
                            const height = ((block.end - block.start) / 24) * 550;
                            const bg =
                                block.type === "sleep"
                                    ? "bg-blue-200"
                                    : block.type === "cleaning"
                                        ? "bg-green-200"
                                        : "bg-yellow-200";
                            return (
                                <div
                                    key={idx}
                                    className={`absolute left-1 right-1 rounded-md text-xs px-1 py-0.5 text-black ${bg}`}
                                    style={{ top: `${top}px`, height: `${height}px` }}
                                >
                                    {block.summary}
                                </div>
                            );
                        })}
                </div>
            ))}
        </div>
    );
};
