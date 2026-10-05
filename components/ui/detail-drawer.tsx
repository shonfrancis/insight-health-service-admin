import React from "react";
import { X } from "lucide-react";
import { Button } from "./button";

export interface DetailDrawerProps {
    onClose: () => void;
    title: string;
    subtitle?: string | React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export function DetailDrawer({
    onClose,
    title,
    subtitle,
    children,
    className = ""
}: DetailDrawerProps) {
    return (
        <div className={`flex w-full flex-col bg-white dark:bg-zinc-900 md:w-1/2 lg:w-5/12 xl:w-1/3 overflow-y-auto thin-scrollbar animate-in slide-in-from-right-8 fade-in duration-300 border-l border-black/[.15] dark:border-white/[.22] ${className}`}>
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/[.15] bg-white/80 p-6 backdrop-blur-md dark:border-white/[.22] dark:bg-zinc-900/80">
                <div className="flex flex-col gap-1 pr-4">
                    <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
                    {subtitle && <div className="text-xs text-foreground/50">{subtitle}</div>}
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    icon={X}
                    className="rounded-full text-foreground/50 hover:text-foreground shrink-0"
                />
            </div>
            <div className="flex flex-col flex-1 p-6">
                {children}
            </div>
        </div>
    );
}

