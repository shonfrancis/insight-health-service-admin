"use client";

import { useState, useEffect, useMemo } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import {
    Download,
    Calendar as CalendarIcon,
    Filter,
    ShieldAlert,
    TrendingUp,
    FileText,
    PoundSterling,
    BarChart3,
    Ban,
    AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Curated UI Colors
const COLORS = ['#3C43EC', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

// Mock Financial Data
const financialData = {
    daily: [
        { name: "09:00 AM", revenue: 450 },
        { name: "11:00 AM", revenue: 950 },
        { name: "01:00 PM", revenue: 800 },
        { name: "03:00 PM", revenue: 1200 },
        { name: "05:00 PM", revenue: 850 }
    ],
    weekly: [
        { name: "Mon", revenue: 3200 },
        { name: "Tue", revenue: 4500 },
        { name: "Wed", revenue: 3800 },
        { name: "Thu", revenue: 5100 },
        { name: "Fri", revenue: 4800 },
        { name: "Sat", revenue: 2400 }
    ],
    monthly: [
        { name: "Week 1", revenue: 15400 },
        { name: "Week 2", revenue: 18200 },
        { name: "Week 3", revenue: 16900 },
        { name: "Week 4", revenue: 19500 }
    ],
    annual: [
        { name: "Jan", revenue: 68000 },
        { name: "Feb", revenue: 74000 },
        { name: "Mar", revenue: 81000 },
        { name: "Apr", revenue: 79000 },
        { name: "May", revenue: 85000 },
        { name: "Jun", revenue: 92000 },
        { name: "Jul", revenue: 88000 },
        { name: "Aug", revenue: 95000 },
        { name: "Sep", revenue: 91000 },
        { name: "Oct", revenue: 99000 },
        { name: "Nov", revenue: 105000 },
        { name: "Dec", revenue: 112000 }
    ]
};

// Mock Operational Data
const appointmentsByService = [
    { name: "Early Pregnancy", value: 340 },
    { name: "4D/5D Baby Scan", value: 280 },
    { name: "Well Woman Scan", value: 190 },
    { name: "NIPT Blood Test", value: 210 },
    { name: "General Bloods", value: 150 }
];

const appointmentTrends = [
    { name: "Jan", bookings: 850 },
    { name: "Feb", bookings: 920 },
    { name: "Mar", bookings: 1040 },
    { name: "Apr", bookings: 980 },
    { name: "May", bookings: 1120 },
    { name: "Jun", bookings: 1250 }
];

const cancellationRates = [
    { name: "Jan", rate: 5.2 },
    { name: "Feb", rate: 4.8 },
    { name: "Mar", rate: 4.2 },
    { name: "Apr", rate: 3.9 },
    { name: "May", rate: 4.5 },
    { name: "Jun", rate: 3.6 }
];

export default function AnalyticsDashboard() {
    const [userRole, setUserRole] = useState<"super_admin" | "administrator" | "reception" | "clinician">("reception");
    const [activeTab, setActiveTab] = useState<"financial" | "operational">("financial");
    const [financialRange, setFinancialRange] = useState<"daily" | "weekly" | "monthly" | "annual">("monthly");
    const [isExporting, setIsExporting] = useState(false);
    const [selectedDate, setSelectedDate] = useState("2026-07-13");

    const parsedDate = useMemo(() => {
        const d = new Date(selectedDate);
        if (isNaN(d.getTime())) return { dayName: "Mon", weekLabel: "Week 2", monthName: "Jul", yearString: "2026" };

        const yearString = d.getFullYear().toString();

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthName = months[d.getMonth()];

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const dayName = days[d.getDay()];

        const dateNum = d.getDate();
        const weekNum = Math.min(4, Math.ceil(dateNum / 7));
        const weekLabel = `Week ${weekNum}`;

        return { dayName, weekLabel, monthName, yearString };
    }, [selectedDate]);

    const yearMultiplier = useMemo(() => {
        if (parsedDate.yearString === "2026") return 1.0;
        if (parsedDate.yearString === "2025") return 0.85;
        if (parsedDate.yearString === "2024") return 0.72;
        return 0; // No data for other years
    }, [parsedDate.yearString]);

    const hasData = yearMultiplier > 0;

    const currentFinancialData = useMemo(() => {
        return financialData[financialRange].map(item => ({
            ...item,
            revenue: Math.round(item.revenue * yearMultiplier)
        }));
    }, [financialRange, yearMultiplier]);

    const currentAppointmentsByService = useMemo(() => {
        return appointmentsByService.map(item => ({
            ...item,
            value: Math.round(item.value * yearMultiplier)
        }));
    }, [yearMultiplier]);

    const topService = useMemo(() => {
        if (!currentAppointmentsByService || currentAppointmentsByService.length === 0) {
            return { name: "None", value: 0 };
        }
        return currentAppointmentsByService.reduce((max, item) => item.value > max.value ? item : max, currentAppointmentsByService[0]);
    }, [currentAppointmentsByService]);

    const currentAppointmentTrends = useMemo(() => {
        return appointmentTrends.map(item => ({
            ...item,
            bookings: Math.round(item.bookings * yearMultiplier)
        }));
    }, [yearMultiplier]);

    const currentCancellationRates = useMemo(() => {
        const shift = parsedDate.yearString === "2025" ? 0.3 : parsedDate.yearString === "2024" ? 0.7 : 0;
        return cancellationRates.map(item => ({
            ...item,
            rate: parseFloat((item.rate + shift).toFixed(1))
        }));
    }, [parsedDate.yearString]);

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole") as "super_admin" | "administrator" | "reception" | "clinician" | null;
        if (storedRole) {
            setUserRole(storedRole);
        }
    }, []);

    // RBAC Security
    if (userRole === "clinician") {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-white dark:bg-zinc-900">
                <ShieldAlert className="mb-4 h-12 w-12 text-zinc-500" />
                <h1 className="text-2xl font-bold text-foreground">Access Restricted</h1>
                <p className="mt-2 text-foreground/60">
                    Clinical staff do not have permissions to view reports and financial records.
                </p>
            </div>
        );
    }

    const handleExportPDF = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            alert("Report successfully compiled and downloaded as PDF.");
        }, 1500);
    };

    return (
        <div className="flex w-full flex-col gap-8 p-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground">Reports & Analytics</h1>
                    <p className="mt-1 text-sm text-foreground/60">Monitor clinic financial performance and operational metrics.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative flex items-center">
                        <CalendarIcon className="absolute left-3.5 h-4 w-4 text-foreground/60 pointer-events-none" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="h-10 rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 pl-10 pr-4 text-sm font-semibold text-foreground focus:border-brand focus:outline-none dark:border-white/[.22] cursor-pointer"
                        />
                    </div>
                    <Button variant="filled" icon={Download} onClick={handleExportPDF} loading={isExporting}>
                        Export PDF
                    </Button>
                </div>
            </div>

            {/* Filter Context Info Bar */}
            <div className="rounded-lg bg-black/[.03] dark:bg-white/[.03] px-4 py-2.5 text-xs font-semibold text-foreground/85 flex flex-wrap items-center gap-3 border border-black/[.08] dark:border-white/[.08]">
                <span className="flex items-center gap-1.5"><CalendarIcon className="h-3.5 w-3.5 text-foreground/60" /> Date Selected: <span className="font-bold text-[#3C43EC] dark:text-[#5c62ff]">{selectedDate}</span></span>
                <span className="text-foreground/30">•</span>
                <span>Day of the Week: <span className="font-bold text-foreground">{parsedDate.dayName}</span></span>
                <span className="text-foreground/30">•</span>
                <span>Week of the Month: <span className="font-bold text-foreground">{parsedDate.weekLabel}</span></span>
                <span className="text-foreground/30">•</span>
                <span>Month: <span className="font-bold text-foreground">{parsedDate.monthName}</span></span>
                <span className="text-foreground/30">•</span>
                <span>Year: <span className="font-bold text-foreground">{parsedDate.yearString}</span></span>
            </div>

            {/* Main Content Area: Conditional rendering based on data availability */}
            {!hasData ? (
                <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-black/[.10] dark:border-white/[.10] rounded-xl bg-black/[.01] dark:bg-white/[.01] my-8 animate-in fade-in duration-300">
                    <div className="h-14 w-14 rounded-full bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center mb-4">
                        <AlertTriangle className="h-7 w-7 text-orange-600 dark:text-orange-500" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">No Analytics Data Available</h3>
                    <p className="mt-2 text-sm text-foreground/70 max-w-md leading-relaxed">
                        There are no clinic transactions, cancellation records, or booking metrics matching the year <span className="font-semibold text-foreground">{parsedDate.yearString}</span>.
                    </p>
                    <p className="mt-1 text-xs text-foreground/50">
                        Please click the calendar button above to select a different date (within 2024 – 2026).
                    </p>
                </div>
            ) : (
                <>
                    {/* Top Level Quick Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-6 dark:border-white/[.22]">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase text-foreground/70">Total Revenue (YTD)</span>
                                <PoundSterling className="h-5 w-5 text-foreground/50" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-foreground">£{Math.round(479000 * yearMultiplier).toLocaleString()}</span>
                                <span className="text-sm font-semibold text-green-600">+14.2%</span>
                            </div>
                        </div>
                        <div className="rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-6 dark:border-white/[.22]">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase text-foreground/70">Average Cancellation Rate</span>
                                <Ban className="h-5 w-5 text-foreground/50" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-foreground">{(parsedDate.yearString === "2025" ? 4.6 : parsedDate.yearString === "2024" ? 5.0 : 4.3)}%</span>
                                <span className="text-sm font-semibold text-green-600">-0.6%</span>
                            </div>
                        </div>
                        <div className="rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-6 dark:border-white/[.22]">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase text-foreground/70">Appointments Booked (YTD)</span>
                                <CalendarIcon className="h-5 w-5 text-foreground/50" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-foreground">{Math.round(6220 * yearMultiplier).toLocaleString()}</span>
                                <span className="text-sm font-semibold text-green-600">+8.5%</span>
                            </div>
                        </div>
                    </div>

                    {/* Tab Switches */}
                    <div className="flex border-b border-black/[.15] dark:border-white/[.22]">
                        <button
                            onClick={() => setActiveTab("financial")}
                            className={`mr-6 flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "financial" ? "border-brand text-brand dark:text-white" : "border-transparent text-foreground/75 hover:text-foreground"}`}
                        >
                            <PoundSterling className="h-4 w-4" /> Financial Reports
                        </button>
                        <button
                            onClick={() => setActiveTab("operational")}
                            className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "operational" ? "border-brand text-brand dark:text-white" : "border-transparent text-foreground/75 hover:text-foreground"}`}
                        >
                            <BarChart3 className="h-4 w-4" /> Operational Reports
                        </button>
                    </div>

                    {/* TAB: FINANCIAL REPORTS */}
                    {activeTab === "financial" && (
                        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                            <div className="rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-6 dark:border-white/[.22]">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <h3 className="font-semibold text-foreground">Revenue Charts</h3>
                                        <p className="text-xs text-foreground/75">Choose range to toggle daily, weekly, monthly or annual statements.</p>
                                    </div>

                                    <div className="flex gap-2 rounded-lg bg-black/[.04] dark:bg-white/[.04] p-1 self-start sm:self-auto">
                                        {(["daily", "weekly", "monthly", "annual"] as const).map(range => (
                                            <button
                                                key={range}
                                                onClick={() => setFinancialRange(range)}
                                                className={`rounded-md px-3.5 py-1 text-xs font-semibold uppercase tracking-wider transition-all ${financialRange === range ? "bg-[#3C43EC] text-white" : "text-foreground/75 hover:text-foreground"}`}
                                            >
                                                {range}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-80 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={currentFinancialData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3C43EC" stopOpacity={0.25} />
                                                    <stop offset="95%" stopColor="#3C43EC" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E7EB" className="dark:stroke-zinc-800" />
                                            <XAxis dataKey="name" tick={{ fill: 'currentColor' }} className="text-foreground/80 text-[12px] font-medium" tickLine={false} axisLine={false} tickMargin={8} />
                                            <YAxis tick={{ fill: 'currentColor' }} className="text-foreground/80 text-[12px] font-medium" tickFormatter={(v) => `£${v}`} tickLine={false} axisLine={false} tickMargin={8} />
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} formatter={(value) => [`£${value}`, "Revenue"]} />
                                            <Area type="monotone" dataKey="revenue" stroke="#3C43EC" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: OPERATIONAL REPORTS */}
                    {activeTab === "operational" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">

                            {/* Appointments by Service */}
                            <div className="rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-6 dark:border-white/[.22]">
                                <h3 className="mb-6 font-semibold text-foreground flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-foreground/75" /> Appointments by Service
                                </h3>
                                <div className="flex flex-col items-center gap-6">
                                    <div className="w-full h-80 relative flex items-center justify-center">
                                        {/* Center content overlay */}
                                        <div className="absolute z-0 flex flex-col items-center justify-center text-center pointer-events-none">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/50">Top Service</span>
                                            <span className="text-xs font-bold text-foreground max-w-[140px] truncate mt-0.5">{topService.name}</span>
                                            <span className="text-2xl font-extrabold text-[#3C43EC] dark:text-[#5c62ff] mt-0.5">{topService.value.toLocaleString()}</span>
                                            <span className="text-[10px] font-medium text-foreground/60">bookings</span>
                                        </div>

                                        <ResponsiveContainer width="100%" height="100%" className="relative z-10">
                                            <PieChart>
                                                <Pie
                                                    data={currentAppointmentsByService}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={90}
                                                    outerRadius={130}
                                                    paddingAngle={3}
                                                    cornerRadius={6}
                                                >
                                                    {currentAppointmentsByService.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                                    ))}
                                                </Pie>
                                                <Tooltip wrapperClassName="z-50" contentStyle={{ borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', zIndex: 100 }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    {/* Color representation legend */}
                                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 w-full border-t border-black/[.08] pt-4 dark:border-white/[.08]">
                                        {currentAppointmentsByService.map((entry, index) => (
                                            <div key={entry.name} className="flex items-center gap-2 text-xs font-semibold text-foreground/80">
                                                <span className="h-3 w-3 rounded shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                                <span>{entry.name}: <span className="font-bold text-foreground">{entry.value}</span></span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Appointment Trends */}
                            <div className="rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 pt-6 px-6 pb-4 dark:border-white/[.22] flex flex-col justify-between">
                                <h3 className="mb-6 font-semibold text-foreground flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-foreground/75" /> Appointment Trends
                                </h3>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={currentAppointmentTrends} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E7EB" className="dark:stroke-zinc-800" />
                                            <XAxis dataKey="name" tick={{ fill: 'currentColor' }} className="text-foreground/80 text-[12px] font-medium" tickLine={false} axisLine={false} tickMargin={8} />
                                            <YAxis tick={{ fill: 'currentColor' }} className="text-foreground/80 text-[12px] font-medium" tickLine={false} axisLine={false} tickMargin={8} />
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                                            <Bar dataKey="bookings" fill="#3C43EC" radius={[6, 6, 0, 0]} maxBarSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Cancellation Rate */}
                            <div className="lg:col-span-2 rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-6 dark:border-white/[.22]">
                                <h3 className="mb-6 font-semibold text-foreground flex items-center gap-2">
                                    <Ban className="h-4 w-4 text-foreground/75" /> Cancellation Rate (%)
                                </h3>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={currentCancellationRates} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E7EB" className="dark:stroke-zinc-800" />
                                            <XAxis dataKey="name" tick={{ fill: 'currentColor' }} className="text-foreground/80 text-[12px] font-medium" tickLine={false} axisLine={false} tickMargin={8} />
                                            <YAxis tick={{ fill: 'currentColor' }} className="text-foreground/80 text-[12px] font-medium" tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} tickMargin={8} />
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} formatter={(value) => [`${value}%`, "Cancellation Rate"]} />
                                            <Line type="monotone" dataKey="rate" stroke="#EF4444" strokeWidth={3} activeDot={{ r: 6 }} dot={{ r: 3, strokeWidth: 2 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                        </div>
                    )}
                </>
            )}

        </div>
    );
}
