import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navigation from "./components/ui/Navigation";
import DashboardPage from "./pages/DashboardPage";
import AddRoutinePage from "./pages/AddRoutinePage";
import InitPage from "./pages/InitPage";
import SchedulePreviewPage from "./pages/SchedulePreviewPage";
import ScheduleSuggestionPage from "./pages/ScheduleSuggestionPage";
import SetupPage from "./pages/SetupPage";

export default function App() {
    return (
        <Router>
            <Navigation />  {/* 여기서 내비게이션 메뉴 렌더링 */}
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/add-routine" element={<AddRoutinePage />} />
                <Route path="/init" element={<InitPage />} />
                <Route path="/schedule-preview" element={<SchedulePreviewPage />} />
                <Route path="/schedule-suggestion" element={<ScheduleSuggestionPage />} />
                <Route path="/setup" element={<SetupPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}
