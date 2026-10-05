"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Calendar,
    PoundSterling,
    Users,
    AlertCircle,
    Plus,
    Search,
    CreditCard,
    Clock,
    UserX,
    CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { apiClient } from "@/lib/api-client";

type RoleType = "super_admin" | "administrator" | "reception" | "clinician";

export default function OverviewDashboard() {
    const [userRole, setUserRole] = useState<RoleType>("super_admin");
    const [apiStats, setApiStats] = useState<any>(null);
    const [recentApts, setRecentApts] = useState<any[]>([]);

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole") as RoleType | null;
        if (storedRole) {
            setUserRole(storedRole);
        }

        apiClient('/overview/stats')
            .then((res) => {
                if (res.stats) setApiStats(res.stats);
                if (res.recentAppointments) setRecentApts(res.recentAppointments);
            })
            .catch((err) => {
                console.warn("Using local fallback data for overview stats:", err.message);
            });
    }, []);

    // Mock Data for UI visualization
    const todayAppointments = [
        { id: "APT-001", patient: "Eleanor Vance", service: "4D/5D Baby Scan", time: "09:00 AM", status: "Confirmed", staff: "Dr. Sarah Jenkins" },
        { id: "APT-002", patient: "Marcus Thorne", service: "General Blood Tests", time: "09:45 AM", status: "Checked-In", staff: "Nurse Alex Rivera" },
        { id: "APT-003", patient: "Sophia Sterling", service: "Well Woman Scan", time: "10:30 AM", status: "Pending", staff: "Dr. Sarah Jenkins" },
    ];

    const alerts = [
        { id: 1, type: "Cancellation", message: "James Holden cancelled Growth Scan", time: "10 mins ago", icon: UserX, color: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30" },
        { id: 2, type: "No-Show", message: "Amos Burton missed 08:30 AM appointment", time: "1 hr ago", icon: AlertCircle, color: "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30" },
        { id: 3, type: "Confirmation", message: "Eleanor Vance confirmed 4D/5D Baby Scan", time: "2 hrs ago", icon: CheckCircle, color: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30" },
    ];

    return (
        <div className="flex w-full flex-col gap-8 p-8">

            {/* Page Header & Quick Actions */}
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground">Overview</h1>
                    <p className="mt-1 text-sm text-foreground/60">
                        Welcome back. Here is what is happening at the clinic today.
                    </p>
                </div>

                {/* Quick Actions[cite: 1, 2] */}
                <div className="flex w-full gap-3 md:w-auto">
                    <Link href="/dashboard/appointments/new" className="flex-1 md:flex-none">
                        <Button variant="filled" icon={Plus} className="w-full h-full">
                            New Appointment
                        </Button>
                    </Link>
                    <Link href="/dashboard/patients?focus=search" className="flex-1 md:flex-none">
                        <Button variant="outline" icon={Search} className="w-full h-full">
                            Search Patient
                        </Button>
                    </Link>
                    {/* <Button variant="outline" icon={CreditCard} className="flex-1 md:flex-none">
                        Pay
                    </Button> */}
                </div>
            </div>

            {/* Top Level Metrics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {/* Total Appointments Metric */}
                <div className="flex flex-col justify-between rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-6 dark:border-white/[.22] dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground/70">Today's Appointments</span>
                        <Calendar className="h-4 w-4 text-foreground/70" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-foreground">24</span>
                        <span className="text-xs font-medium text-green-600">+4 from yesterday</span>
                    </div>
                </div>

                {/* Pending Confirmations Metric[cite: 1, 2] */}
                <div className="flex flex-col justify-between rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-6 dark:border-white/[.22] dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground/70">Pending Confirmations</span>
                        <Clock className="h-4 w-4 text-foreground/70" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-foreground">7</span>
                        <span className="text-xs font-medium text-foreground/50">Require action</span>
                    </div>
                </div>

                {/* New Patients Metric */}
                <div className="flex flex-col justify-between rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-6 dark:border-white/[.22] dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground/70">New Patients</span>
                        <Users className="h-4 w-4 text-foreground/70" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-foreground">12</span>
                        <span className="text-xs font-medium text-foreground/50">This week</span>
                    </div>
                </div>

                {/* Revenue Summary - Conditionally Rendered via RBAC[cite: 2] */}
                {(userRole === "super_admin" || userRole === "administrator") && (
                    <div className="flex flex-col justify-between rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-6 dark:border-white/[.22] dark:bg-zinc-900">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground/70">Daily Revenue</span>
                            <PoundSterling className="h-4 w-4 text-foreground/70" />
                        </div>
                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-3xl font-bold tracking-tight text-foreground">£4,250</span>
                            <span className="text-xs font-medium text-green-600">+12%</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                {/* Left Column: Today's Schedule[cite: 1, 2] */}
                <div className="flex flex-col gap-4 lg:col-span-2">
                    <h2 className="text-lg font-semibold tracking-tight text-foreground">Today's Schedule</h2>
                    <div className="rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22] dark:bg-zinc-900">
                        <div className="min-w-full divide-y divide-black/[.08] dark:divide-white/[.145]">
                            {todayAppointments.map((apt) => (
                                <div key={apt.id} className="flex items-center justify-between p-4 transition-colors hover:bg-black/[.02] dark:hover:bg-white/[.02]">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-foreground">{apt.patient}</span>
                                            <span className="text-xs text-foreground/60">{apt.service} • <span className="font-medium text-foreground/75">{apt.staff}</span></span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <span className="flex items-center gap-1.5 text-sm font-medium text-foreground/80">
                                            <Clock className="h-3.5 w-3.5 text-foreground/50" />
                                            {apt.time}
                                        </span>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${apt.status === "Confirmed" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                                            apt.status === "Checked-In" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                                                "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                                            }`}>
                                            {apt.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-black/[.15] p-4 text-center dark:border-white/[.22]">
                            <Link href="/dashboard/calendar">
                                <Button variant="ghost" className="text-brand">View Full Calendar</Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Column: Alerts & Notifications[cite: 1, 2] */}
                <div className="flex flex-col gap-4 lg:col-span-1">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold tracking-tight text-foreground">Notifications</h2>
                        <Link href="/dashboard/notifications" className="text-sm font-medium text-brand hover:underline">
                            View All
                        </Link>
                    </div>
                    <div className="rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22] dark:bg-zinc-900">
                        <div className="divide-y divide-black/[.08] dark:divide-white/[.145]">
                            {alerts.map((alert) => {
                                const Icon = alert.icon;
                                return (
                                    <div key={alert.id} className="flex gap-4 p-4 transition-colors hover:bg-black/[.02] dark:hover:bg-white/[.02]">
                                        <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${alert.color}`}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="flex flex-col gap-1 flex-1">
                                            <div className="flex justify-between items-start">
                                                <span className="text-sm font-bold text-foreground">{alert.type}</span>
                                                <span className="text-xs font-medium text-foreground/50">{alert.time}</span>
                                            </div>
                                            <span className="text-sm font-medium text-foreground/90">{alert.message}</span>
                                        </div>
                                    </div>
                                );
                            })}
                            {alerts.length === 0 && (
                                <div className="p-8 text-center text-sm text-foreground/50">
                                    No active alerts.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
