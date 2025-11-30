// src/App.tsx
import React from "react";
import {
    Outlet,
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Link,
    useLocation,
} from "react-router-dom";

import Navigation from "@/components/ui/Navigation";

import HomePage from "@/pages/HomePage";
import TodayPage from "@/pages/TodayPage";
import WeekPage from "@/pages/WeekPage";
import ImagePage from "@/pages/ImagePage";
import SettingsPage from "@/pages/SettingsPage";

import InitPage from "@/pages/InitPage";
import LoginPage from "@/pages/LoginPage";

import NicknamePage from "@/pages/onboarding/NicknamePage";
import AddressPage from "@/pages/onboarding/AddressPage";
import InitialSurveyPage from "@/pages/onboarding/InitialSurveyPage";
import GoogleCalendarConnectPage from "@/pages/onboarding/GoogleCalendarConnectPage";

import AddRoutinePage from "@/pages/AddRoutinePage";
import DashboardPage from "@/pages/DashboardPage";
import SetupPage from "@/pages/SetupPage";

import { getAccessToken } from "@/lib/authService";

/** 인증 보호 라우트 */
function RequireAuth() {
    const token = getAccessToken();
    if (!token) return <Navigate to="/login" replace />;
    return <Outlet />;
}


export default function App() {
    return (
        <BrowserRouter>
            {/* iOS safe-area + 탭바 높이만큼 하단 패딩을 확보 */}
            <div className="min-h-screen bg-gray-50 pb-[calc(env(safe-area-inset-bottom)+64px)]">
                <Routes>
                    {/* 공개 라우트 */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* 인증 필요 라우트 */}
                    <Route element={<RequireAuth />}>
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

                        {/* 온보딩/초기 설정 */}
                        <Route path="/init" element={<InitPage />} />
                        <Route path="/onboarding/nickname" element={<NicknamePage />} />
                        <Route path="/onboarding/address" element={<AddressPage />} />
                        <Route
                            path="/onboarding/InitialSurvey"
                            element={<InitialSurveyPage />}
                        />
                        <Route
                            path="/onboarding/GoogleCalendarConnect"
                            element={<GoogleCalendarConnectPage />}
                        />

                        {/* 기타 페이지 */}
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/addroutine" element={<AddRoutinePage />} />
                        <Route path="/setup" element={<SetupPage />} />
                    </Route>

                    {/* 404 → 홈 */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                <Navigation />
            </div>
        </BrowserRouter>
    );
}
