import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type Preferences = {
    cleaningFrequency: string;
    homeType: string;
};

export default function InitPage() {
    const [preferences, setPreferences] = useState<Preferences>({
        cleaningFrequency: "",
        homeType: "",
    });

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPreferences((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // 이후 preferences를 저장하거나 API 전송
        console.log(preferences);
        navigate("/setup"); // 예시로 다음 페이지로 이동
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
            <h1 className="text-2xl font-bold mb-6">청소 루틴 설정 시작하기</h1>
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-lg rounded-xl p-6 space-y-4 w-full max-w-md"
            >
                <div>
                    <label className="block font-medium mb-2" htmlFor="cleaningFrequency">
                        청소 빈도
                    </label>
                    <select
                        id="cleaningFrequency"
                        name="cleaningFrequency"
                        value={preferences.cleaningFrequency}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-2"
                        required
                    >
                        <option value="">선택하세요</option>
                        <option value="daily">매일</option>
                        <option value="weekly">주 1~2회</option>
                        <option value="monthly">월 1~2회</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium mb-2" htmlFor="homeType">
                        주거 형태
                    </label>
                    <select
                        id="homeType"
                        name="homeType"
                        value={preferences.homeType}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-2"
                        required
                    >
                        <option value="">선택하세요</option>
                        <option value="apartment">아파트</option>
                        <option value="house">주택</option>
                        <option value="dorm">기숙사/원룸</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600"
                >
                    다음 단계로
                </button>
            </form>
        </div>
    );
}
