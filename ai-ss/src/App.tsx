// src/App.tsx
import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Navigation from "@/components/ui/Navigation";

import HomePage from "@/pages/HomePage";
import TodayPage from "@/pages/TodayPage";
import WeekPage from "@/pages/WeekPage";
import ImagePage from "@/pages/ImagePage";
import SettingsPage from "@/pages/SettingsPage";


export default function App() {
    return (
        <BrowserRouter>
            {/* iOS safe-area + 탭바 높이만큼 하단 패딩을 확보 */}
            <div className="min-h-screen bg-gray-50 pb-[calc(env(safe-area-inset-bottom)+64px)]">
                <Routes>
                    {/* 공개 라우트 */}


                    {/* 기본 진입은 /home 으로 */}
                    <Route path="/" element={<Navigate to="/home" replace />} />

                    {/* 탭 5개 */}
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/schedule" element={<WeekPage />} />
                    <Route path="/checklist" element={<TodayPage />} />
                    <Route path="/image" element={<ImagePage />} />
                    <Route path="/setting" element={<SettingsPage />} />

                    {/* 기존 경로 호환 리다이렉트 */}
                    <Route path="/today" element={<Navigate to="/checklist" replace />} />
                    <Route path="/week" element={<Navigate to="/schedule" replace />} />

                    {/* 404 → 홈 */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                <Navigation />
            </div>
        </BrowserRouter>
    );
}
