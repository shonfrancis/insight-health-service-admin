"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose?: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
}

const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
};

export function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    maxWidth = "2xl",
}: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/40 dark:bg-black/40 p-4"
            style={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
        >
            <div
                className={`flex w-full ${maxWidthClasses[maxWidth]} flex-col rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 p-6 shadow-2xl`}
            >
                {(title || description) && (
                    <div className="mb-6 flex flex-col space-y-2 text-center sm:text-left pr-8 relative">
                        {title && (
                            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                {description}
                            </p>
                        )}
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="absolute right-0 top-0 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                )}

                {children}
            </div>
        </div>,
        document.body
    );
}
