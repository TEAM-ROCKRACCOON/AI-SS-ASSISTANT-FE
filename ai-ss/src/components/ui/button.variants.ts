// src/components/ui/button.variants.ts
import { cva, type VariantProps } from "class-variance-authority";

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

/**
 * 공통 버튼 스타일
 * - 기본은 둥근 pill 형태
 * - focus ring, disabled 상태, transition 통일
 * - 색감은 전체 UI에서 쓰는 파란색/회색/빨간색 계열로 맞춤
 */
export const buttonVariants = cva(
    [
        "inline-flex items-center justify-center whitespace-nowrap",
        "rounded-full text-sm font-medium",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        "active:scale-[0.98]",
    ].join(" "),
    {
        variants: {
            variant: {
                // 메인 파란색 버튼 (FAB, 주요 액션)
                primary:
                    "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 " +
                    "shadow-[0_2px_6px_rgba(37,99,235,0.3)]",

                // 흰 배경 + 얇은 회색 테두리 (카드 안 작은 액션)
                secondary:
                    "bg-white text-gray-800 border border-gray-200 " +
                    "hover:bg-gray-50 active:bg-gray-100",

                // 테두리만 파란색 (옵션 버튼)
                outline:
                    "bg-white text-blue-500 border border-blue-500 " +
                    "hover:bg-blue-50 active:bg-blue-100",

                // 배경 투명, 텍스트만 색 (헤더 우측, 링크 느낌)
                ghost:
                    "bg-transparent text-gray-500 hover:bg-gray-100 active:bg-gray-200",

                // 삭제 등 위험 액션
                destructive:
                    "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 " +
                    "shadow-[0_2px_6px_rgba(239,68,68,0.25)]",
            },

            size: {
                sm: "h-8 px-3 text-xs",
                md: "h-9 px-4 text-sm",
                lg: "h-11 px-5 text-sm",
                icon: "h-9 w-9 p-0",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);
