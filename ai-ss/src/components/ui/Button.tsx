// components/ui/Button.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "./button.variants";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, isLoading = false, disabled, children, type, ...props }, ref) => {
        const isDisabled = disabled || isLoading;

        return (
            <button
                // 기본 submit 방지: 폼 안에서도 의도치 않은 제출을 막기 위해 기본값을 button으로
                type={type ?? "button"}
                className={cn(
                    buttonVariants({ variant, size }),
                    className,
                    isLoading && "pointer-events-none opacity-70"
                )}
                ref={ref}
                disabled={isDisabled}
                aria-disabled={isDisabled}
                aria-busy={isLoading}
                {...props}
            >
                {isLoading && (
                    <span
                        className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent align-[-0.125em]"
                        aria-hidden="true"
                    />
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";
export { Button };       // ✅ 이름(named) 내보내기
