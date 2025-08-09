// pages/AddRoutinePage.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddRoutinePage() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [time, setTime] = useState("09:00");
    const [days, setDays] = useState<string[]>([]);

    const dayOptions = ["월", "화", "수", "목", "금", "토", "일"];

    const toggleDay = (day: string) => {
        setDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newRoutine = {
            title,
            description,
            time,
            days,
        };

        console.log("🧹 새 루틴 추가:", newRoutine);

        // 이후 API 연결 예정
        navigate("/dashboard");
    };

    return (
        <main className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">📝 루틴 추가</h1>
            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="block mb-1 font-medium">청소 제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full border rounded-xl px-3 py-2"
                        placeholder="예: 방바닥 청소"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">설명</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded-xl px-3 py-2"
                        placeholder="예: 먼지가 많으니 환기 후 물걸레질"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">실행 시간</label>
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        className="border rounded-xl px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">반복 요일</label>
                    <div className="flex gap-2 flex-wrap">
                        {dayOptions.map((day) => (
                            <button
                                type="button"
                                key={day}
                                onClick={() => toggleDay(day)}
                                className={`px-3 py-1 rounded-xl border ${
                                    days.includes(day)
                                        ? "bg-blue-500 text-white border-blue-600"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-semibold"
                >
                    루틴 저장하기
                </button>
            </form>
        </main>
    );
}
