// components/ui/Card.tsx

import React, { ReactNode } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
}

export function Card({ children, className = '', ...props }: CardProps) {
    return (
        <div
            className={`bg-white rounded-lg shadow-md ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
