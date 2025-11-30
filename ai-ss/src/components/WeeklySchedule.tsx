// src/components/WeeklySchedule.tsx
import React from "react";

export type Block = {
    summary: string;
    day: number; // 0~6 (월~일)
    start: number; // 24h 기준 시각(예: 9.5)
    end: number;
    type: "schedule" | "sleep" | "cleaning";
    done?: boolean;
};

type Props = { blocks: Block[] };

export const WeeklySchedule: React.FC<Props> = ({ blocks }) => {
    const days = ["월", "화", "수", "목", "금", "토", "일"];
    const hours = Array.from({ length: 19 }, (_, i) => 4 + i); // 6AM~12PM(22시)
    const rowHeight = 44;
    const totalHeight = hours.length * rowHeight;

    return (
        <div className="relative w-full overflow-x-auto border-l border-gray-200">
            {/* 시간축 */}
            <div className="absolute left-0 top-0 w-10 text-right pr-1 text-[11px] text-gray-500">
                {hours.map((h) => (
                    <div
                        key={h}
                        className="border-b border-gray-100"
                        style={{ height: `${rowHeight}px` }}
                    >
                        {h}:00
                    </div>
                ))}
            </div>

            {/* 요일별 칼럼 */}
            <div className="ml-10 grid grid-cols-7 gap-1 relative">
                {days.map((day, i) => (
                    <div
                        key={day}
                        className="relative border-l border-gray-100"
                        style={{ height: `${totalHeight}px` }}
                    >
                        {blocks
                            .filter((b) => b.day === i)
                            .map((block, idx) => {
                                const top = (block.start - 4) * rowHeight; // 4AM 기준
                                const height = Math.max(
                                    (block.end - block.start) * rowHeight,
                                    18
                                );
                                const color =
                                    block.type === "sleep"
                                        ? "bg-blue-200"
                                        : block.type === "cleaning"
                                            ? "bg-blue-100"
                                            : "bg-yellow-100";
                                const doneClass = block.done ? "opacity-60 line-through" : "";

                                return (
                                    <div
                                        key={idx}
                                        className={`absolute left-1 right-1 rounded-md px-1 py-0.5 text-[11px] leading-snug ${color} ${doneClass} shadow-[0_1px_2px_rgba(0,0,0,0.04)]`}
                                        style={{ top, height }}
                                        title={`${block.summary} (${block.start}~${block.end})`}
                                    >
                                        <div className="font-medium leading-tight">
                                            {block.summary}
                                        </div>

                                    </div>
                                );
                            })}
                    </div>
                ))}
            </div>
        </div>
    );
};
