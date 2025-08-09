// components/ui/Navigation.tsx

import React from "react";
import { Link } from "react-router-dom";

export default function Navigation() {
    return (
        <nav className="p-4 bg-gray-100 flex gap-4">
            <Link to="/" className="text-blue-600 hover:underline">
                대시보드
            </Link>
            <Link to="/add-routine" className="text-blue-600 hover:underline">
                루틴 추가
            </Link>
            <Link to="/init" className="text-blue-600 hover:underline">
                초기 설정
            </Link>
            <Link to="/schedule-preview" className="text-blue-600 hover:underline">
                일정 미리보기
            </Link>
            <Link to="/schedule-suggestion" className="text-blue-600 hover:underline">
                일정 제안
            </Link>
            <Link to="/setup" className="text-blue-600 hover:underline">
                설정
            </Link>
        </nav>
    );
}
