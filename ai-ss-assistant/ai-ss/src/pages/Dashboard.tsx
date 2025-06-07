// pages/Dashboard.tsx
import React from "react";
import { CleaningRoutineCard } from "../components/CleaningRoutineCard";
import { WeeklySchedule } from "../components/WeeklySchedule";
import { TodayRoutineList } from "../components/TodayRoutineList";

export default function Dashboard() {
    return (
        <div className="p-6 space-y-6">
            <TodayRoutineList
                tasks={[
                    { name: "바닥 청소", description: "먼지 제거", done: false },
                    { name: "환기하기", description: "창문 열기", done: true },
                ]}
            />

            <WeeklySchedule
                blocks={[
                    { summary: "수업", day: 1, start: 10, end: 12, type: "schedule" },
                    { summary: "수면", day: 1, start: 0, end: 7, type: "sleep" },
                    { summary: "화장실 청소", day: 1, start: 20, end: 21, type: "cleaning" },
                ]}
            />

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
        </div>
    );
}
