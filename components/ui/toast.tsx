"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
}

interface ToastContextType {
    showToast: (params: { type: ToastType; title: string; message?: string }) => void;
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;
    warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback(({ type, title, message }: { type: ToastType; title: string; message?: string }) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: ToastItem = { id, type, title, message };

        setToasts((prev) => [...prev, newToast]);

        setTimeout(() => {
            removeToast(id);
        }, 4000);
    }, [removeToast]);

    const success = useCallback((title: string, message?: string) => {
        showToast({ type: "success", title, message });
    }, [showToast]);

    const error = useCallback((title: string, message?: string) => {
        showToast({ type: "error", title, message });
    }, [showToast]);

    const info = useCallback((title: string, message?: string) => {
        showToast({ type: "info", title, message });
    }, [showToast]);

    const warning = useCallback((title: string, message?: string) => {
        showToast({ type: "warning", title, message });
    }, [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
            {children}

            {/* Toast Floating Notification Container */}
            <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
                {toasts.map((toast) => {
                    const iconMap = {
                        success: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />,
                        error: <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />,
                        warning: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />,
                        info: <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />,
                    };

                    const borderMap = {
                        success: "border-emerald-500/30 bg-emerald-50/90 dark:bg-emerald-950/80 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-100",
                        error: "border-rose-500/30 bg-rose-50/90 dark:bg-rose-950/80 dark:border-rose-500/40 text-rose-900 dark:text-rose-100",
                        warning: "border-amber-500/30 bg-amber-50/90 dark:bg-amber-950/80 dark:border-amber-500/40 text-amber-900 dark:text-amber-100",
                        info: "border-blue-500/30 bg-blue-50/90 dark:bg-blue-950/80 dark:border-blue-500/40 text-blue-900 dark:text-blue-100",
                    };

                    return (
                        <div
                            key={toast.id}
                            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-top-5 ${borderMap[toast.type]}`}
                        >
                            {iconMap[toast.type]}
                            <div className="flex-1 min-w-0 pr-2">
                                <h4 className="text-sm font-bold leading-tight">{toast.title}</h4>
                                {toast.message && (
                                    <p className="mt-1 text-xs opacity-85 leading-relaxed">{toast.message}</p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => removeToast(toast.id)}
                                className="text-foreground/40 hover:text-foreground transition-colors p-1"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
