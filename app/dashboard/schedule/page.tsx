"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
    Clock,
    User,
    CheckCircle2,
    Stethoscope,
    ShieldAlert,
    Calendar as CalendarIcon,
    ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/components/ui/toast";

// SRS Status Types
type AppointmentStatus = "Pending" | "Confirmed" | "Checked-In" | "Completed" | "Cancelled" | "No Show";

interface ClinicalAppointment {
    id: string;
    rawId?: number;
    patientId: string;
    patientName: string;
    service: string;
    time: string;
    date?: string;
    duration: number;
    status: AppointmentStatus;
    notes: boolean;
}

const STATUS_OPTIONS: AppointmentStatus[] = ["Pending", "Confirmed", "Checked-In", "Completed", "No Show"];

const STATUS_STYLES: Record<AppointmentStatus, { pill: string; dot: string; option: string }> = {
    "Confirmed":  { pill: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",    dot: "bg-blue-500",   option: "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" },
    "Pending":    { pill: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300", dot: "bg-orange-500", option: "text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20" },
    "Checked-In": { pill: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300", dot: "bg-purple-500", option: "text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20" },
    "Completed":  { pill: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",  dot: "bg-green-500",  option: "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20" },
    "Cancelled":  { pill: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",         dot: "bg-zinc-400",   option: "text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/40" },
    "No Show":    { pill: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",         dot: "bg-zinc-400",   option: "text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/40" },
};

// Custom Status Dropdown Component
function StatusDropdown({
    status,
    onChange,
}: {
    status: AppointmentStatus;
    onChange: (s: AppointmentStatus) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const styles = STATUS_STYLES[status] || STATUS_STYLES["Pending"];

    return (
        <div ref={ref} className="relative">
            {/* Trigger pill */}
            <button
                onClick={() => setOpen((o) => !o)}
                className={`flex h-9 items-center gap-1.5 rounded-full pl-3 pr-2.5 text-xs font-semibold transition-opacity hover:opacity-80 ${styles.pill}`}
            >
                <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
                {status}
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown panel */}
            {open && (
                <div className="absolute left-0 top-full z-50 mt-1.5 min-w-[160px] rounded-xl border border-black/[.1] bg-white dark:bg-zinc-950 dark:border-white/[.12] shadow-lg py-1.5">
                    {STATUS_OPTIONS.map((opt) => {
                        const s = STATUS_STYLES[opt];
                        const isActive = opt === status;
                        return (
                            <button
                                key={opt}
                                onClick={() => { onChange(opt); setOpen(false); }}
                                className="flex w-full items-center justify-between gap-3 px-3 py-1.5 hover:bg-black/[.03] dark:hover:bg-white/[.04] transition-colors"
                            >
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.pill}`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                                    {opt}
                                </span>
                                {isActive && (
                                    <svg className="h-3 w-3 text-foreground/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function ClinicianSchedule() {
    const toast = useToast();
    const [userRole, setUserRole] = useState<string>("clinician");

    const todayStr = useMemo(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }, []);
    const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

    const [appointments, setAppointments] = useState<ClinicalAppointment[]>([]);
    const [loading, setLoading] = useState(true);

    // 7-Day Window Generator (-2 days ago, today, +4 days)
    const dateTabs = useMemo(() => {
        const tabs = [];
        const base = new Date();

        for (let offset = -2; offset <= 4; offset++) {
            const d = new Date();
            d.setDate(base.getDate() + offset);
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
            const monthName = d.toLocaleDateString("en-US", { month: "short" });
            const dayNum = d.getDate();
            const isToday = dateStr === todayStr;

            tabs.push({
                dateStr,
                dayName,
                monthName,
                dayNum,
                isToday,
                label: isToday ? "Today" : `${dayName}, ${monthName} ${dayNum}`,
            });
        }
        return tabs;
    }, [todayStr]);

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole");
        if (storedRole) setUserRole(storedRole);
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await apiClient("/appointments");
            if (res && res.data) {
                const mapped: ClinicalAppointment[] = res.data.map((item: any) => ({
                    id: item.appointment_code || item.id,
                    rawId: item.id,
                    patientId: item.patient_code || item.patientId || 'N/A',
                    patientName: item.patient_name || item.patientName || 'Unknown Patient',
                    service: item.service_name || item.service || 'Ultrasound Consultation',
                    time: item.time || item.start_time || '09:00 AM',
                    date: item.date || (item.start_time ? item.start_time.split(" ")[0] : todayStr),
                    duration: item.duration || 45,
                    status: (item.status as AppointmentStatus) || "Confirmed",
                    notes: Boolean(item.has_notes),
                }));
                setAppointments(mapped);
            }
        } catch (err: any) {
            console.error("Failed to load clinician schedule:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const updateStatus = async (id: string, newStatus: AppointmentStatus) => {
        const target = appointments.find(a => a.id === id);
        const targetId = target?.rawId || id;

        setAppointments(appointments.map(apt =>
            apt.id === id ? { ...apt, status: newStatus } : apt
        ));

        try {
            await apiClient(`/appointments/${targetId}`, {
                method: 'PUT',
                body: JSON.stringify({ status: newStatus })
            });
            toast.success("Status Updated", `Appointment ${id} marked as ${newStatus}.`);
        } catch (err: any) {
            console.error("Failed to update status:", err.message);
            toast.error("Update Error", err.message || "Failed to update appointment status.");
            fetchAppointments();
        }
    };

    const dateFilteredAppointments = useMemo(() => {
        return appointments.filter(apt => !apt.date || apt.date === selectedDateStr);
    }, [appointments, selectedDateStr]);

    if (userRole !== "clinician" && userRole !== "super_admin") {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
                <ShieldAlert className="mb-4 h-12 w-12 text-zinc-400" />
                <h1 className="text-2xl font-bold text-foreground">Clinical Access Required</h1>
                <p className="mt-2 text-foreground/60">
                    This module is restricted to medical and clinical personnel.
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-8">

            {/* Header & Metrics */}
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground">My Schedule</h1>
                    <div className="mt-2 flex items-center gap-2 text-sm font-medium text-foreground/60">
                        <CalendarIcon className="h-4 w-4 text-[#3C43EC]" />
                        Selected Date: <span className="font-bold text-[#3C43EC]">{selectedDateStr}</span>
                    </div>
                </div>

                {/* Clinical Summary Cards */}
                <div className="flex gap-4">
                    <div className="flex flex-col rounded-lg border border-black/[.15] bg-white dark:bg-zinc-900 px-4 py-3 dark:border-white/[.22]">
                        <span className="text-xs font-medium uppercase text-foreground/50">Patients for Selected Date</span>
                        <span className="text-xl font-bold text-foreground">{dateFilteredAppointments.length}</span>
                    </div>
                    <div className="flex flex-col rounded-lg border border-black/[.15] bg-white dark:bg-zinc-900 px-4 py-3 dark:border-white/[.22]">
                        <span className="text-xs font-medium uppercase text-foreground/50">Completed</span>
                        <span className="text-xl font-bold text-green-600">
                            {dateFilteredAppointments.filter((a: ClinicalAppointment) => a.status === "Completed").length}
                        </span>
                    </div>
                </div>
            </div>

            {/* 7-Day Date Tab Navigation Bar + Custom Date Picker */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/[.12] dark:border-white/[.15] pb-4">
                <div className="flex items-center gap-2 overflow-x-auto thin-scrollbar pb-1">
                    {dateTabs.map((tab: any) => {
                        const isSelected = selectedDateStr === tab.dateStr;
                        return (
                            <button
                                key={tab.dateStr}
                                onClick={() => setSelectedDateStr(tab.dateStr)}
                                className={`flex flex-col items-center justify-center rounded-xl px-4 py-2 text-xs transition-all border whitespace-nowrap min-w-[95px] ${
                                    isSelected
                                        ? "border-[#3C43EC] bg-[#3C43EC] text-white font-bold shadow-md scale-102"
                                        : tab.isToday
                                        ? "border-blue-300 bg-blue-50 text-[#3C43EC] dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300 font-semibold"
                                        : "border-black/[.12] dark:border-white/[.15] bg-white dark:bg-zinc-900 text-foreground/70 hover:bg-black/[.03] dark:hover:bg-white/[.04]"
                                }`}
                            >
                                <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
                                    {tab.isToday ? "Today" : tab.dayName}
                                </span>
                                <span className="text-sm font-bold">
                                    {tab.monthName} {tab.dayNum}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Custom Date Picker */}
                <div className="flex items-center gap-2 self-end md:self-auto shrink-0 bg-white dark:bg-zinc-900 p-1.5 rounded-xl border border-black/[.12] dark:border-white/[.15]">
                    <span className="text-xs font-semibold text-foreground/70 pl-2">Custom Date:</span>
                    <input
                        type="date"
                        value={selectedDateStr}
                        onChange={(e) => setSelectedDateStr(e.target.value)}
                        className="h-8 rounded-lg border border-black/[.15] dark:border-white/[.2] bg-white dark:bg-zinc-900 px-2.5 text-xs font-bold text-[#3C43EC] focus:border-[#3C43EC] focus:outline-none transition-colors"
                    />
                </div>
            </div>

            {/* Clinical Timeline Feed */}
            <div className="flex flex-col gap-4">
                {dateFilteredAppointments.map((apt: ClinicalAppointment) => (
                    <div
                        key={apt.id}
                        className={`group relative flex flex-col gap-4 rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-6 transition-all dark:border-white/[.22] lg:flex-row lg:items-center lg:justify-between ${
                            apt.status === "Checked-In" ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-400 dark:border-blue-600/70 ring-2 ring-blue-500/60" : ""
                        }`}
                    >
                        {/* Timeline Indicator Line */}
                        <div className="absolute bottom-0 left-8 top-0 hidden w-px bg-black/[.04] dark:bg-white/[.04] lg:block -z-10" />

                        {/* Left: Time & Patient Info */}
                        <div className="flex items-start gap-6 lg:items-center">
                            <div className="flex flex-col items-start lg:items-end lg:w-24">
                                <span className="text-lg font-bold text-foreground">{apt.time.split(" ")[0]}</span>
                                <span className="text-xs font-medium text-foreground/50">{apt.time.split(" ")[1]}</span>
                                <span className="mt-1 flex items-center gap-1 text-xs font-medium text-foreground/40">
                                    <Clock className="h-3 w-3" /> {apt.duration}m
                                </span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <h3 className="text-xl font-semibold tracking-tight text-foreground">{apt.patientName}</h3>
                                <span className="text-sm font-medium text-foreground/70">{apt.service}</span>
                                <span className="text-xs text-foreground/40">ID: {apt.patientId} • Ref: {apt.id}</span>
                            </div>
                        </div>

                        {/* Right: Clinical Actions (ALL 3 BUTTONS IN SAME LINE) */}
                        <div className="mt-4 flex flex-wrap lg:flex-nowrap items-center gap-3 shrink-0 border-t border-black/[.15] pt-4 dark:border-white/[.22] lg:mt-0 lg:border-0 lg:pt-0">

                            {/* Button 1: Custom Status Pill Dropdown */}
                            <div className="shrink-0">
                                <StatusDropdown
                                    status={apt.status}
                                    onChange={(s) => updateStatus(apt.id, s)}
                                />
                            </div>

                            {/* Button 2: Direct Link to Patient Profile */}
                            <Link
                                href={`/dashboard/patients/clinical?id=${apt.patientId}`}
                                className="flex h-10 items-center justify-center gap-2 rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-4 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.22] dark:hover:bg-[#1a1a1a] shrink-0 whitespace-nowrap"
                            >
                                <User className="h-4 w-4" />
                                Patient Profile
                            </Link>

                            {/* Button 3: Direct Link to Add Clinical Notes */}
                            <Link
                                href={`/dashboard/clinical-notes?aptId=${apt.id}`}
                                className={`flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-all shrink-0 whitespace-nowrap ${
                                    apt.notes
                                        ? "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950/30 dark:text-green-400"
                                        : "bg-[#3C43EC] text-white hover:bg-[#3C43EC]/90 shadow-sm"
                                }`}
                            >
                                {apt.notes ? <CheckCircle2 className="h-4 w-4" /> : <Stethoscope className="h-4 w-4" />}
                                {apt.notes ? "Notes Saved" : "Start Session"}
                            </Link>

                        </div>
                    </div>
                ))}

                {dateFilteredAppointments.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-black/[.15] py-16 dark:border-white/[.22]">
                        <CheckCircle2 className="mb-4 h-8 w-8 text-foreground/30" />
                        <p className="text-sm font-medium text-foreground/60">No appointments scheduled for {selectedDateStr}.</p>
                    </div>
                )}
            </div>

        </div>
    );
}
