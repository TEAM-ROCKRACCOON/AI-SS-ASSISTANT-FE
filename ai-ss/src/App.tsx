import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import TodayPage from "@/pages/TodayPage";
import WeekPage from "@/pages/WeekPage";
import FeedbackPage from "@/pages/FeedbackPage";
import SettingsPage from "@/pages/SettingsPage";

import NicknamePage from "@/pages/onboarding/NicknamePage";
import AddressPage from "@/pages/onboarding/AddressPage";
import InitialSurveyPage from "@/pages/onboarding/InitialSurveyPage";
import GoogleCalendarConnectPage from "@/pages/onboarding/GoogleCalendarConnectPage";

import HomePage from "@/pages/HomePage";
import InitPage from "@/pages/InitPage";
import LoginPage from "@/pages/LoginPage";

import AddRoutinePage from "@/pages/AddRoutinePage";
import DashboardPage from "@/pages/DashboardPage";
import DevApiSandbox from "@/pages/DevApiSandbox";
import SetupPage from "@/pages/SetupPage";

// 하단 탭 내비 (아주 심플)
function BottomNav() {
    const { pathname } = useLocation();
    const Item = ({ to, label }: { to: string; label: string }) => (
        <Link
            to={to}
            className={`flex-1 text-center py-3 ${pathname === to ? "font-bold text-blue-600" : "text-gray-600"}`}
        >
            {label}
        </Link>
    );
    return (
        <nav className="fixed bottom-0 left-0 right-0 border-t bg-white flex">
            <Item to="/" label="/" />
            <Item to="/today" label="Today" />
            <Item to="/week" label="Week" />
            <Item to="/feedback" label="Feedback" />
            <Item to="/settings" label="Settings" />

            <Item to="/onboarding/nickname" label="Nickname" />
            <Item to="/onboarding/address" label="Address" />
            <Item to="/onboarding/InitialSurvey" label="InitialSurvey" />
            <Item to="/onboarding/GoogleCalendarConnect" label="GoogleCalendarConnect" />

            <Item to="/home" label="home" />
            <Item to="/init" label="init" />
            <Item to="/login" label="login" />

            <Item to="/AddRoutine" label="AddRoutine" />
            <Item to="/Dashboard" label="Dashboard" />
            <Item to="/DevApiSandbox" label="DevApiSandbox" />
            <Item to="/Setup" label="Setup" />
        </nav>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <div className="pb-16 min-h-screen bg-gray-50">
                <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/today" element={<TodayPage />} />
                    <Route path="/week" element={<WeekPage />} />
                    <Route path="/feedback" element={<FeedbackPage />} />
                    <Route path="/settings" element={<SettingsPage />} />

                    <Route path="/onboarding/nickname" element={<NicknamePage />} />
                    <Route path="/onboarding/address" element={<AddressPage />} />
                    <Route path="/onboarding/InitialSurvey" element={<InitialSurveyPage />} />
                    <Route path="/onboarding/GoogleCalendarConnect" element={<GoogleCalendarConnectPage />} />

                    <Route path="/home" element={<HomePage />} />
                    <Route path="/init" element={<InitPage />} />
                    <Route path="/login" element={<LoginPage />} />

                    <Route path="/AddRoutine" element={<AddRoutinePage />} />
                    <Route path="/Dashboard" element={<DashboardPage />} />
                    <Route path="/DevApiSandbox" element={<DevApiSandbox />} />
                    <Route path="/Setup" element={<SetupPage />} />


                </Routes>
                <BottomNav />
            </div>
        </BrowserRouter>
    );
}
