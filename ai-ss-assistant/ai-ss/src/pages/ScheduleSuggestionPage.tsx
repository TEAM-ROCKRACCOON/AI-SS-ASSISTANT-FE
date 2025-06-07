import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/Card";

type Routine = {
    id: number;
    title: string;
    date: string;       // YYYY-MM-DD
    time: string;       // HH:mm
    weather?: string;   // ex. "미세먼지 높음"
    description?: string;
};

export default function ScheduleSuggestionPage() {
    const [suggestedRoutines, setSuggestedRoutines] = useState<Routine[]>([]);

    useEffect(() => {
        // 🧠 추후 ILP 엔진 결과를 fetch
        // 임시 데이터 사용
        const dummy = [
            {
                id: 1,
                title: "바닥 청소",
                date: "2025-05-20",
                time: "10:00",
                weather: "미세먼지 보통",
                description: "청소기 돌리고 물걸레질",
            },
            {
                id: 2,
                title: "창문 닦기",
                date: "2025-05-21",
                time: "14:00",
                weather: "미세먼지 낮음",
                description: "햇빛 좋을 때 유리창 닦기",
            },
            {
                id: 3,
                title: "욕실 청소",
                date: "2025-05-23",
                time: "09:00",
                weather: "습도 높음",
                description: "곰팡이 방지용 락스 사용",
            },
        ];
        setSuggestedRoutines(dummy);
    }, []);

    return (
        <main className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">🧠 AI 청소 일정 추천</h1>

            <div className="space-y-4">
                {suggestedRoutines.map((routine) => (
                    <Card key={routine.id} className="border-l-4 border-blue-500 shadow">
                        <CardContent className="py-4 space-y-1">
                            <div className="text-lg font-semibold">{routine.title}</div>
                            <div className="text-sm text-gray-600">
                                {routine.date} {routine.time}
                            </div>
                            {routine.weather && (
                                <div className="text-sm text-blue-600">🌦️ {routine.weather}</div>
                            )}
                            {routine.description && (
                                <div className="text-sm mt-1 text-gray-800">{routine.description}</div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </main>
    );
}
