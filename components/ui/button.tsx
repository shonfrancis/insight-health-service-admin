import React from "react";
import { LucideIcon } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "filled" | "outline" | "ghost";
    size?: "xs" | "sm" | "md" | "lg";
    icon?: LucideIcon | React.ComponentType<{ className?: string }>;
    iconPosition?: "left" | "right";
    iconStyle?: "stroke" | "filled";
    loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            className = "",
            variant = "filled",
            size = "md",
            icon: Icon,
            iconPosition = "left",
            iconStyle = "stroke",
            loading = false,
            disabled,
            type = "button",
            ...props
        },
        ref
    ) => {
        // Base styles
        const baseStyles = "inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] cursor-pointer disabled:pointer-events-none disabled:opacity-50";

        // Size variations
        const sizeStyles = {
            xs: "px-3 py-1.5 text-xs",
            sm: "px-4 py-2 text-sm",
            md: "px-5 py-2.5 text-sm",
            lg: "px-6 py-3 text-base"
        };

        // Variant styles
        const variantStyles = {
            filled: "bg-[#3C43EC] text-white hover:bg-[#2b30c6] focus-visible:ring-[#3C43EC]/50",
            outline: "border border-black/[.15] dark:border-white/[.22] bg-white dark:bg-zinc-900 text-foreground hover:bg-black/[.04] dark:hover:bg-white/[.04] focus-visible:ring-black/[.08]",
            ghost: "text-foreground hover:bg-black/[.04] dark:hover:bg-white/[.04] focus-visible:ring-black/[.08]"
        };

        // Icon sizing
        const iconSizeClass = {
            xs: "h-3.5 w-3.5",
            sm: "h-4 w-4",
            md: "h-4 w-4",
            lg: "h-5 w-5"
        }[size];

        const renderIcon = () => {
            if (loading) {
                return (
                    <svg className={`animate-spin ${iconSizeClass} text-current`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                );
            }

            if (!Icon) return null;

            // Apply fill vs stroke style based on request
            const iconClass = `${iconSizeClass} ${iconStyle === "filled" ? "fill-current" : ""}`;
            return <Icon className={iconClass} />;
        };

        return (
            <button
                ref={ref}
                type={type}
                disabled={disabled || loading}
                className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
                {...props}
            >
                {iconPosition === "left" && renderIcon()}
                {children}
                {iconPosition === "right" && renderIcon()}
            </button>
        );
    }
);

Button.displayName = "Button";

