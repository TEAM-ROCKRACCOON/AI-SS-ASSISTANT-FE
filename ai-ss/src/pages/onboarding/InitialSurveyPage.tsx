// src/pages/onboarding/InitialSurveyPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { saveHabit } from "@/entities/user/api";
import { toHabitReq } from "@/entities/user/model/habitMapper";

const cleaningFrequencies = [
    "매일 (주 7회)",
    "자주 (주 3~5회)",
    "가끔 (주 1~2회)",
    "이따금 (2주에 1회)",
    "드물게 (한 달에 1회)",
];

const cleaningStyles = ["한 번에 몰아서 대청소", "나눠서 조금씩 꾸준히"];

const timeSlots = [
    "새벽 (00:00~06:00)",
    "아침 (06:00~12:00)",
    "오후 (12:00~18:00)",
    "저녁 (18:00~24:00)",
];

const weekdays = ["월", "화", "수", "목", "금", "토", "일"];

const itemAmount = [
    "물건이 많아서 정리가 어려워요",
    "물건이 적어서 정리가 쉬워요",
];

export default function InitialSurveyPage() {
    const [frequency, setFrequency] = useState("");
    const [style, setStyle] = useState("");
    const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]); // 서버는 단일값 → 아래에서 1개만 유지
    const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);
    const [items, setItems] = useState("");

    const navigate = useNavigate();

    const toggleSelect = (
        value: string,
        list: string[],
        setList: (list: string[]) => void
    ) => {
        if (list.includes(value)) {
            setList(list.filter((v) => v !== value));
        } else {
            setList([...list, value]);
        }
    };

    // 서버 저장
    const m = useMutation({
        mutationFn: saveHabit,
        onSuccess: () => {
            alert("청소습관이 등록되었습니다.");
            navigate("/home");
        },
        onError: (err: unknown) => {
            const msg = err instanceof Error ? err.message : "등록에 실패했습니다.";
            alert(msg);
        },
    });

    const handleSubmit = () => {
        if (
            !frequency ||
            !style ||
            selectedTimeSlots.length === 0 ||
            selectedWeekdays.length === 0 ||
            !items
        ) {
            alert("모든 항목을 선택해주세요.");
            return;
        }

        try {
            const payload = toHabitReq({
                frequency,
                style,
                selectedTimeSlots,
                selectedWeekdays,
                items,
            });
            m.mutate(payload);
        } catch (e) {
            const msg = e instanceof Error ? e.message : "입력값 매핑 오류";
            alert(msg);
        }
    };

    return (
        <div className="space-y-6 max-w-md mx-auto p-4">
            <div className="space-y-4 p-4 border rounded-md shadow">
                <h2 className="text-lg font-bold">청소 습관</h2>
                {cleaningFrequencies.map((freq) => (
                    <button
                        key={freq}
                        type="button"
                        onClick={() => setFrequency(freq)}
                        className={`w-full text-left px-4 py-2 rounded mb-1 border ${
                            frequency === freq
                                ? "bg-gray-400 text-white border-gray-400"
                                : "bg-white text-gray-700 border-gray-300"
                        }`}
                        disabled={m.isPending}
                    >
                        {freq}
                    </button>
                ))}

                <h2 className="text-lg font-bold mt-6">청소 스타일</h2>
                {cleaningStyles.map((s) => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => setStyle(s)}
                        className={`w-full text-left px-4 py-2 rounded mb-1 border ${
                            style === s
                                ? "bg-gray-400 text-white border-gray-400"
                                : "bg-white text-gray-700 border-gray-300"
                        }`}
                        disabled={m.isPending}
                    >
                        {s}
                    </button>
                ))}

                <h2 className="text-lg font-bold mt-6">선호 청소 시간대</h2>
                <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((time) => {
                        const active = selectedTimeSlots[0] === time; // 단일 선택
                        return (
                            <button
                                key={time}
                                type="button"
                                onClick={() => setSelectedTimeSlots([time])} // 1개만 유지
                                className={`text-sm rounded px-3 py-1 border ${
                                    active
                                        ? "bg-gray-400 text-white border-gray-400"
                                        : "bg-white text-gray-700 border-gray-300"
                                }`}
                                disabled={m.isPending}
                            >
                                {time}
                            </button>
                        );
                    })}
                </div>

                <h2 className="text-lg font-bold mt-6">선호 청소 요일</h2>
                <div className="grid grid-cols-7 gap-1">
                    {weekdays.map((day) => (
                        <button
                            key={day}
                            type="button"
                            onClick={() =>
                                toggleSelect(day, selectedWeekdays, setSelectedWeekdays)
                            }
                            className={`text-sm rounded px-2 py-1 border ${
                                selectedWeekdays.includes(day)
                                    ? "bg-gray-400 text-white border-gray-400"
                                    : "bg-white text-gray-700 border-gray-300"
                            }`}
                            disabled={m.isPending}
                        >
                            {day}
                        </button>
                    ))}
                </div>

                <h2 className="text-lg font-bold mt-6">물건 양</h2>
                {itemAmount.map((opt) => (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => setItems(opt)}
                        className={`w-full text-left px-4 py-2 rounded mb-1 border ${
                            items === opt
                                ? "bg-gray-400 text-white border-gray-400"
                                : "bg-white text-gray-700 border-gray-300"
                        }`}
                        disabled={m.isPending}
                    >
                        {opt}
                    </button>
                ))}

                <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full mt-6 bg-blue-500 text-white py-3 rounded hover:bg-blue-700 transition disabled:opacity-50"
                    disabled={m.isPending}
                >
                    {m.isPending ? "제출 중..." : "제출"}
                </button>
            </div>
        </div>
    );
}
