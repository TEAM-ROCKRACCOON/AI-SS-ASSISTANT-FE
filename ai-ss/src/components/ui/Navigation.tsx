// components/ui/Navigation.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Home,
    CalendarDays,
    CheckSquare,
    Image as ImageIcon,
    Settings,
} from "lucide-react";

export default function Navigation() {
    const { pathname } = useLocation();

    // 로그인·온보딩·초기설정 단계에서는 숨김
    const hidePrefixes = ["/login", "/init", "/onboarding", "/setup"];
    const isHidden = hidePrefixes.some((p) => pathname.startsWith(p));
    if (isHidden) return null;

    const tabs = [
        { to: "/home", label: "HOME", icon: Home },
        { to: "/schedule", label: "SCHEDULE", icon: CalendarDays },
        { to: "/checklist", label: "CHECKLIST", icon: CheckSquare },
        { to: "/image", label: "IMAGE", icon: ImageIcon },
        { to: "/setting", label: "SETTING", icon: Settings },
    ];

    const isActive = (to: string) =>
        pathname === to || pathname.startsWith(`${to}/`);

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 flex border-t bg-white z-50">
            {tabs.map(({ to, label, icon: Icon }) => (
                <Link
                    key={to}
                    to={to}
                    className={`flex-1 flex flex-col items-center justify-center text-xs transition-colors ${
                        isActive(to)
                            ? "text-blue-700 font-semibold"
                            : "text-gray-500 hover:text-blue-600"
                    }`}
                >
                    <Icon
                        size={20}
                        strokeWidth={isActive(to) ? 2.5 : 1.5}
                        className="mb-1"
                    />
                    <span>{label}</span>
                </Link>
            ))}
        </nav>
    );
}
