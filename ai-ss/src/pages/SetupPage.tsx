// src/pages/SetupPage.tsx
// 사용자 설정 및 정보

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import { useAuthStore } from "@/entities/user/model/authStore";
import { getAccessToken } from "@/lib/authService"; // ✅

export default function SetupPage() {
    const navigate = useNavigate();
    //const accessToken = useAuthStore((s) => s.accessToken);

    // 로그인 가드
    // useEffect(() => {
    //     if (!accessToken && !localStorage.getItem("accessToken")) {
    //         navigate("/login");
    //     }
    // }, [accessToken, navigate]);

    useEffect(() => {
        if (!getAccessToken()) {
            navigate("/login", { replace: true }); // 또는 window.location.href="/login"
        }
    }, [navigate]);

    const [form, setForm] = useState({
        homeType: "",
        area: "",
        timePreference: "",
        cleanFrequency: "",
        lifestyle: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: 스웨거의 온보딩 저장 엔드포인트가 확정되면 여기서 POST 호출
        // 현재는 다음 단계로 이동만 수행
        navigate("/dashboard");
    };

    return (
        <main className="p-6 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-6">청소 루틴 초기 설정</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">거주 형태</label>
                    <select name="homeType" value={form.homeType} onChange={handleChange} className="w-full p-2 border rounded-xl">
                        <option value="">선택</option>
                        <option value="원룸">원룸</option>
                        <option value="아파트">아파트</option>
                        <option value="기타">기타</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-medium">거주 공간 크기 (평수)</label>
                    <input
                        type="number"
                        name="area"
                        value={form.area}
                        onChange={handleChange}
                        placeholder="예: 8"
                        className="w-full p-2 border rounded-xl"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">청소 선호 시간대</label>
                    <select name="timePreference" value={form.timePreference} onChange={handleChange} className="w-full p-2 border rounded-xl">
                        <option value="">선택</option>
                        <option value="아침">아침</option>
                        <option value="오후">오후</option>
                        <option value="밤">밤</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-medium">청소 빈도</label>
                    <select name="cleanFrequency" value={form.cleanFrequency} onChange={handleChange} className="w-full p-2 border rounded-xl">
                        <option value="">선택</option>
                        <option value="매일">매일</option>
                        <option value="격일">격일</option>
                        <option value="주 2회">주 2회</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-medium">라이프스타일</label>
                    <select name="lifestyle" value={form.lifestyle} onChange={handleChange} className="w-full p-2 border rounded-xl">
                        <option value="">선택</option>
                        <option value="아침형">아침형</option>
                        <option value="저녁형">저녁형</option>
                        <option value="유동적">유동적</option>
                    </select>
                </div>

                <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-xl font-semibold hover:bg-green-600">
                    설정 완료
                </button>
            </form>
        </main>
    );
}
