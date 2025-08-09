// components/ui/Checkbox.tsx

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, ...props }, ref) => {
        return (
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    className={cn(
                        "peer sr-only",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                <div
                    className={cn(
                        "w-5 h-5 rounded border border-gray-300 bg-white peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center transition-all duration-200",
                        "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"
                    )}
                >
                    <CheckIcon
                        className={cn(
                            "w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                        )}
                    />
                </div>
            </label>
        )
    }
)

Checkbox.displayName = "Checkbox"

export { Checkbox }
