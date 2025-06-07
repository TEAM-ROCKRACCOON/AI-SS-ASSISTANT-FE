// components/ui/Card.tsx
import React, { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
    return (
        <div
            className={`bg-white shadow-md rounded-lg p-6 border border-gray-200 ${className}`}
        >
            {children}
        </div>
    );
};

export const CardContent: React.FC<CardProps> = ({ children, className = "" }) => {
    return <div className={`p-4 ${className}`}>{children}</div>;
};
