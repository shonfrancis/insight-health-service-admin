"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Calendar, ChevronDown, X } from "lucide-react";

/**
 * Turns an ISO `YYYY-MM-DD` date into a local Date without the UTC shift that
 * `new Date("2026-10-07")` would introduce.
 */
function fromISODate(value: string): Date | undefined {
    if (!value) return undefined;
    const d = new Date(`${value}T00:00:00`);
    return isNaN(d.getTime()) ? undefined : d;
}

/** Formats a local Date as `YYYY-MM-DD`, mirroring how the rest of the app stores dates. */
function toISODate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function formatDisplay(value: string): string {
    const d = fromISODate(value);
    return d
        ? d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        : "";
}

function startOfDay(d: Date): Date {
    const copy = new Date(d);
    copy.setHours(0, 0, 0, 0);
    return copy;
}

interface DatePickerFieldProps {
    /** ISO `YYYY-MM-DD`, or "" when nothing is picked yet. */
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    /** Earliest pickable date. */
    minDate?: Date;
    /** Latest pickable date. */
    maxDate?: Date;
    placeholder?: string;
    className?: string;
}

/**
 * A "fancy" date field: a styled trigger that opens a popover calendar
 * (react-day-picker) instead of the browser-native date input, so DOB-style
 * fields get a consistent, themeable picker.
 */
export default function DatePickerField({
    value,
    onChange,
    disabled = false,
    minDate,
    maxDate,
    placeholder = "Select a date",
    className = "",
}: DatePickerFieldProps) {
    const [open, setOpen] = useState(false);
    const wrapRef = useRef<HTMLDivElement>(null);

    // Close on outside click / Escape while open.
    useEffect(() => {
        if (!open) return;

        const onPointerDown = (e: PointerEvent) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };

        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    const display = formatDisplay(value);
    const selected = fromISODate(value);

    return (
        <div ref={wrapRef} className={`relative ${className}`}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((o) => !o)}
                className={`flex h-11 w-full items-center justify-between gap-2 rounded-xl border bg-white px-3 text-left text-sm transition-all focus:outline-none dark:bg-zinc-900 disabled:opacity-60 disabled:cursor-not-allowed ${
                    open
                        ? "border-blue-500 ring-4 ring-blue-500/10 shadow-lg shadow-blue-600/5"
                        : "border-black/[.15] hover:border-blue-400/70 hover:shadow-sm dark:border-white/[.22]"
                }`}
            >
                <span className="flex min-w-0 items-center gap-2.5">
                    <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                            display
                                ? "bg-blue-600 text-white shadow-sm shadow-blue-600/40"
                                : "bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-400"
                        }`}
                    >
                        <Calendar className="h-4 w-4" />
                    </span>
                    <span
                        className={`truncate text-sm ${
                            display ? "font-medium text-foreground" : "text-foreground/45"
                        }`}
                    >
                        {display || placeholder}
                    </span>
                </span>

                {value ? (
                    <span
                        role="button"
                        aria-label="Clear date"
                        tabIndex={-1}
                        className="shrink-0 rounded-md p-1 text-foreground/40 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40"
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange("");
                        }}
                    >
                        <X className="h-3.5 w-3.5" />
                    </span>
                ) : (
                    <ChevronDown
                        className={`h-4 w-4 shrink-0 text-foreground/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    />
                )}
            </button>

            {open && !disabled && (
                <div
                    className="dp-pop absolute left-0 top-full z-50 mt-2 origin-top scale-[0.97] rounded-2xl border border-black/[.08] bg-white p-3 opacity-0 shadow-2xl shadow-black/20 dark:bg-zinc-900 dark:border-white/[.12]"
                    style={{ animation: "dp-pop-in 160ms cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
                >
                    <style>{`
                        @keyframes dp-pop-in {
                            from { opacity: 0; transform: translateY(-6px) scale(0.97); }
                            to   { opacity: 1; transform: translateY(0) scale(1); }
                        }

                        /* ---- DayPicker theming ---- */
                        .dp-pop .rdp-root {
                            --rdp-accent-color: #2563eb;
                            --rdp-accent-background-color: #eff6ff;
                            --rdp-selected-border: 2px solid transparent;
                            --rdp-day-width: 40px;
                            --rdp-day-height: 40px;
                            --rdp-day_button-width: 36px;
                            --rdp-day_button-height: 36px;
                            --rdp-nav_button-width: 34px;
                            --rdp-nav_button-height: 34px;
                            --rdp-nav-height: 2.5rem;
                            --rdp-outside-opacity: 0.4;
                            --rdp-disabled-opacity: 0.35;
                            --rdp-today-color: #2563eb;
                            --rdp-dropdown-gap: 0.35rem;
                        }
                        .dark .dp-pop .rdp-root {
                            --rdp-accent-color: #3b82f6;
                            --rdp-accent-background-color: #17233d;
                            color: #e5e5e5;
                        }

                        /* Caption + dropdown pills */
                        .dp-pop .rdp-month_caption {
                            font-size: 0.95rem;
                            font-weight: 800;
                            color: #1f2937;
                            letter-spacing: 0.01em;
                        }
                        .dark .dp-pop .rdp-month_caption { color: #f3f4f6; }
                        .dp-pop .rdp-dropdowns { gap: 0.45rem; margin-left: 0.6rem; }
                        .dp-pop .rdp-dropdown_root {
                            display: inline-flex;
                            align-items: center;
                            gap: 0.2rem;
                            padding: 0.3rem 0.55rem 0.3rem 0.65rem;
                            border: 1px solid rgba(0, 0, 0, 0.09);
                            border-radius: 9999px;
                            background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
                            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7), 0 1px 2px rgba(0, 0, 0, 0.05);
                            transition: border-color 0.15s, background-color 0.15s, box-shadow 0.15s;
                            cursor: pointer;
                        }
                        .dp-pop .rdp-dropdown_root:hover {
                            border-color: rgba(37, 99, 235, 0.45);
                            background: #eff6ff;
                            box-shadow: 0 2px 6px rgba(37, 99, 235, 0.18);
                        }
                        .dp-pop .rdp-dropdown_root .rdp-chevron {
                            width: 13px;
                            height: 13px;
                            fill: #2563eb;
                            transition: transform 0.15s;
                        }
                        .dp-pop .rdp-dropdown_root:hover .rdp-chevron { transform: translateY(1px); }
                        .dp-pop .rdp-caption_label { font-weight: 800; padding-inline-end: 0.1rem; }
                        .dark .dp-pop .rdp-dropdown_root {
                            border-color: rgba(255, 255, 255, 0.16);
                            background: linear-gradient(180deg, #27272a 0%, #18181b 100%);
                            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
                        }
                        .dark .dp-pop .rdp-dropdown_root:hover {
                            border-color: rgba(59, 130, 246, 0.55);
                            background: #1e293b;
                        }
                        .dark .dp-pop .rdp-dropdown_root .rdp-chevron { fill: #60a5fa; }

                        /* Nav arrows */
                        .dp-pop .rdp-button_previous,
                        .dp-pop .rdp-button_next {
                            border-radius: 9999px;
                            transition: background-color 0.15s, transform 0.15s;
                        }
                        .dp-pop .rdp-button_previous:hover:not(:disabled),
                        .dp-pop .rdp-button_next:hover:not(:disabled) {
                            background: rgba(37, 99, 235, 0.12);
                        }
                        .dp-pop .rdp-button_previous:active:not(:disabled) { transform: translateX(-2px); }
                        .dp-pop .rdp-button_next:active:not(:disabled) { transform: translateX(2px); }
                        .dp-pop .rdp-chevron { width: 16px; height: 16px; }

                        /* Weekday header */
                        .dp-pop .rdp-weekday {
                            font-size: 10px;
                            font-weight: 700;
                            letter-spacing: 0.08em;
                            text-transform: uppercase;
                            color: #9ca3af;
                            padding-top: 0.5rem;
                            padding-bottom: 0.25rem;
                        }

                        /* Day buttons */
                        .dp-pop .rdp-day_button {
                            font-size: 0.875rem;
                            font-weight: 500;
                            border-radius: 9999px;
                            transition: background-color 0.12s, color 0.12s, box-shadow 0.15s, transform 0.12s;
                        }
                        .dp-pop .rdp-day_button:hover:not(:disabled) {
                            background: rgba(37, 99, 235, 0.12);
                        }
                        .dp-pop .rdp-day_button:active:not(:disabled) { transform: scale(0.92); }
                        .dp-pop .rdp-day_button:focus-visible {
                            outline: 2px solid #2563eb;
                            outline-offset: 1px;
                        }

                        /* Today: brand ring so it stands out without stealing focus */
                        .dp-pop .rdp-day_today:not(.rdp-selected) .rdp-day_button {
                            color: #2563eb;
                            font-weight: 700;
                            box-shadow: inset 0 0 0 1.5px rgba(37, 99, 235, 0.7);
                        }

                        /* Selected day: gradient fill + glow */
                        .dp-pop .rdp-selected .rdp-day_button {
                            background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
                            color: #ffffff;
                            font-weight: 700;
                            box-shadow: 0 4px 14px rgba(59, 91, 245, 0.45);
                        }
                        .dp-pop .rdp-selected .rdp-day_button:hover {
                            background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
                            color: #ffffff;
                        }
                        .dark .dp-pop .rdp-selected .rdp-day_button {
                            background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
                            box-shadow: 0 4px 16px rgba(59, 130, 246, 0.45);
                        }
                    `}</style>

                    <DayPicker
                        mode="single"
                        selected={selected}
                        onSelect={(day) => {
                            if (day) {
                                onChange(toISODate(day));
                                setOpen(false);
                            }
                        }}
                        disabled={(date) => {
                            if (minDate && date < startOfDay(minDate)) return true;
                            if (maxDate && date > startOfDay(maxDate)) return true;
                            return false;
                        }}
                        captionLayout="dropdown"
                        navLayout="around"
                        showOutsideDays
                        fixedWeeks
                        className="!m-0"
                    />

                    {/* Quick actions */}
                    <div className="mt-1.5 flex items-center justify-between border-t border-black/[.06] pt-2 dark:border-white/[.08]">
                        <button
                            type="button"
                            onClick={() => {
                                onChange(toISODate(new Date()));
                                setOpen(false);
                            }}
                            className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/60"
                        >
                            Today
                        </button>
                        {value && (
                            <button
                                type="button"
                                onClick={() => onChange("")}
                                className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-foreground/50 transition-colors hover:bg-black/[.05] hover:text-red-500 dark:hover:bg-white/[.08]"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}