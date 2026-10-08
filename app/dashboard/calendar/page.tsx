"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Plus,
    Filter,
    Clock,
    Search,
    FileText,
    Loader2
} from "lucide-react";
import { apiClient } from "@/lib/api-client";

// SRS Status Types
type AppointmentStatus = "Pending" | "Scheduled" | "Confirmed" | "Checked-In" | "Completed" | "Cancelled" | "No Show";

interface Appointment {
    id: string;
    rawId?: number;
    patient: string;
    service: string;
    staffId: string | number;
    clinician?: string;
    date: string;
    startTime: string; // e.g., "09:00 AM" or "09:00:00"
    durationMinutes: number;
    status: AppointmentStatus;
}

interface StaffMember {
    id: string;
    rawId?: number;
    name: string;
    role: string;
}

type RoleType = "super_admin" | "administrator" | "reception" | "clinician";

// Helper to filter out non-clinical roles (admins, receptionists) from the appointment matrix
const isClinicalRole = (role: string) => {
    const r = (role || "").toLowerCase().trim();
    return !["reception", "receptionist", "administrator", "admin", "super_admin"].includes(r);
};

export default function CalendarMatrix() {
    const [userRole, setUserRole] = useState<RoleType>("administrator");
    // Default to CURRENT DAY (Today)
    const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState("All");
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    
    // Live API states
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const dateInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole") as RoleType | null;
        if (storedRole) {
            setUserRole(storedRole);
        }
    }, []);

    // Load Staff Members & Appointments from API
    const loadCalendarData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Staff Directory and filter for clinicians/medical staff only
            const staffRes = await apiClient("/staff");
            let fetchedStaff: StaffMember[] = [];
            if (staffRes && staffRes.data && Array.isArray(staffRes.data)) {
                fetchedStaff = staffRes.data
                    .filter((s: any) => isClinicalRole(s.role))
                    .map((s: any) => ({
                        id: s.id || `STF-${s.rawId}`,
                        rawId: s.rawId || s.id,
                        name: s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Clinician',
                        role: s.role ? (s.role.charAt(0).toUpperCase() + s.role.slice(1)) : 'Clinician Specialist',
                    }));
            }

            // Fallback clinical staff if DB returns no clinical staff
            if (fetchedStaff.length === 0) {
                fetchedStaff = [
                    { id: "S1", rawId: 1, name: "Dr. Sarah Jenkins", role: "Sonographer" },
                    { id: "S2", rawId: 2, name: "Dr. Marcus Thorne", role: "Clinician" },
                    { id: "S3", rawId: 3, name: "Tech. Anna Lewis", role: "Phlebotomist" },
                ];
            }
            setStaff(fetchedStaff);

            // 2. Fetch Appointments
            const aptRes = await apiClient("/appointments?per_page=1000");
            let fetchedApts: Appointment[] = [];
            if (aptRes && aptRes.data && Array.isArray(aptRes.data)) {
                fetchedApts = aptRes.data.map((apt: any) => ({
                    id: apt.id || `APT-${apt.rawId}`,
                    rawId: apt.rawId || apt.id,
                    patient: apt.patientName || apt.patient_name || 'Patient',
                    service: apt.service || apt.service_name || 'Health Service',
                    staffId: apt.staffId !== undefined && apt.staffId !== null ? apt.staffId : (apt.staff_id || 'Unassigned'),
                    clinician: apt.clinician || '',
                    date: apt.date ? (typeof apt.date === 'string' ? apt.date.split('T')[0] : apt.date) : '',
                    startTime: apt.time || apt.start_time || '09:00 AM',
                    durationMinutes: apt.duration || 45,
                    status: (apt.status as AppointmentStatus) || 'Scheduled',
                }));
            }
            setAppointments(fetchedApts);
        } catch (err: any) {
            console.error("Failed to load calendar data:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCalendarData();
    }, []);

    const handlePrevDay = () => {
        const prev = new Date(currentDate);
        prev.setDate(prev.getDate() - 1);
        setCurrentDate(prev);
    };

    const handleNextDay = () => {
        const next = new Date(currentDate);
        next.setDate(next.getDate() + 1);
        setCurrentDate(next);
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    // System Config: Clinic Hours (08:00 AM to 07:00 PM)
    const hours = Array.from({ length: 12 }, (_, i) => i + 8);
    const rowHeight = 120; // 120px per hour for absolute positioning calculation

    // Distinct colors for each appointment status (including Scheduled vs Confirmed)
    const getStatusColors = (status: AppointmentStatus) => {
        switch (status) {
            case "Scheduled": 
                return "bg-sky-100 border-sky-400 text-sky-950 dark:bg-sky-950/50 dark:border-sky-700/60 dark:text-sky-200";
            case "Confirmed": 
                return "bg-indigo-100 border-indigo-400 text-indigo-950 dark:bg-indigo-950/50 dark:border-indigo-700/60 dark:text-indigo-200";
            case "Pending": 
                return "bg-amber-100 border-amber-400 text-amber-950 dark:bg-amber-950/50 dark:border-amber-700/60 dark:text-amber-200";
            case "Checked-In": 
                return "bg-purple-100 border-purple-400 text-purple-950 dark:bg-purple-950/50 dark:border-purple-700/60 dark:text-purple-200";
            case "Completed": 
                return "bg-emerald-100 border-emerald-400 text-emerald-950 dark:bg-emerald-950/50 dark:border-emerald-700/60 dark:text-emerald-200";
            case "Cancelled": 
                return "bg-rose-100 border-rose-300 text-rose-950 dark:bg-rose-950/50 dark:border-rose-800/60 dark:text-rose-200 line-through opacity-75";
            case "No Show": 
                return "bg-zinc-100 border-zinc-300 text-zinc-900 dark:bg-zinc-800/60 dark:border-zinc-700/60 dark:text-zinc-400 opacity-75";
            default: 
                return "bg-gray-100 border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200";
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    // Robust 12-hour/24-hour time parser
    const parseTimeTo24Hour = (timeStr: string) => {
        if (!timeStr) return { hrs: 9, mins: 0 };
        const str = timeStr.trim().toUpperCase();
        const isPM = str.includes("PM");
        const isAM = str.includes("AM");
        const cleanStr = str.replace(/[^\d:]/g, "");
        const parts = cleanStr.split(":");
        let hrs = parseInt(parts[0] || "9", 10);
        let mins = parseInt(parts[1] || "0", 10);

        if (isNaN(hrs)) hrs = 9;
        if (isNaN(mins)) mins = 0;

        if (isPM && hrs < 12) hrs += 12;
        if (isAM && hrs === 12) hrs = 0;
        return { hrs, mins };
    };

    const calculatePosition = (startTime: string, durationMinutes: number = 45) => {
        const { hrs, mins } = parseTimeTo24Hour(startTime);
        const startOffset = ((hrs - 8) * rowHeight) + ((mins / 60) * rowHeight);
        const height = Math.max((durationMinutes / 60) * rowHeight, 52);
        return { top: `${startOffset}px`, height: `${height}px` };
    };

    // Current Date formatted as YYYY-MM-DD
    const formattedCurrentDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

    // Filter appointments for current day
    const dayAppointments = appointments.filter(apt => apt.date === formattedCurrentDate);

    // Dynamic staff list (including Unassigned lane if unassigned appointments exist for this day)
    const hasUnassigned = dayAppointments.some(apt => 
        !apt.staffId || apt.staffId === 'Unassigned' || apt.clinician === 'Unassigned'
    );

    const baseStaff = selectedRole === "All" 
        ? staff 
        : staff.filter(m => m.role.toLowerCase() === selectedRole.toLowerCase());

    const displayStaff: StaffMember[] = hasUnassigned
        ? [...baseStaff, { id: "Unassigned", rawId: -1, name: "Unassigned", role: "Clinical Queue" }]
        : baseStaff;

    const filteredStaff = displayStaff.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dayAppointments.some(apt => apt.patient.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="flex h-full w-full flex-col p-8">

            {/* Module Toolbar */}
            <div className="mb-6 flex flex-col gap-4 border-b border-black/[.15] pb-6 dark:border-white/[.22]">
                {/* Header Row */}
                <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Calendar Matrix</h1>
                        <p className="text-xs text-foreground/60 mt-1">Live daily appointment schedule across clinical staff</p>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <Button variant="outline" icon={Plus} onClick={() => router.push('/dashboard/appointments/new')}>
                            New Appointment
                        </Button>
                        <Button variant="filled" icon={FileText} onClick={() => router.push('/dashboard/appointments')}>
                            See Appointments List
                        </Button>
                    </div>
                </div>
                
                {/* Filters and Search Row */}
                <div className="flex w-full flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
                    {/* Date Navigator */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 p-1 dark:border-white/[.22]">
                            <Button variant="ghost" size="xs" icon={ChevronLeft} onClick={handlePrevDay} className="px-2" />
                            <div
                                className="relative flex items-center gap-2 px-3 text-sm font-medium text-foreground cursor-pointer hover:bg-black/[.04] dark:hover:bg-white/[.04] rounded-md py-1 transition-colors"
                                onClick={() => {
                                    if (dateInputRef.current && 'showPicker' in HTMLInputElement.prototype) {
                                        dateInputRef.current.showPicker();
                                    } else if (dateInputRef.current) {
                                        dateInputRef.current.focus();
                                    }
                                }}
                            >
                                <CalendarIcon className="h-4 w-4 text-brand" />
                                {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                <input
                                    ref={dateInputRef}
                                    type="date"
                                    className="sr-only"
                                    value={formattedCurrentDate}
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            const [year, month, day] = e.target.value.split('-');
                                            setCurrentDate(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
                                        }
                                    }}
                                />
                            </div>
                            <Button variant="ghost" size="xs" icon={ChevronRight} onClick={handleNextDay} className="px-2" />
                        </div>

                        <Button variant="outline" size="xs" onClick={handleToday} className="h-9 px-3">
                            Today
                        </Button>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                            <input
                                type="text"
                                placeholder="Search patient or clinician..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 pl-9 pr-4 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]"
                            />
                        </div>
                        {/* Filter Dropdown */}
                        <div className="relative">
                            <Button variant="outline" icon={Filter} onClick={() => setShowFilterDropdown(!showFilterDropdown)}>
                                Role: {selectedRole}
                            </Button>
                            {showFilterDropdown && (
                                <div className="absolute right-0 mt-2 z-50 w-48 rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 p-1 shadow-lg dark:border-white/[.22]">
                                    {["All", "Sonographer", "Clinician", "Phlebotomist", "Doctor", "Nurse"].map(role => (
                                        <button
                                            key={role}
                                            onClick={() => {
                                                setSelectedRole(role);
                                                setShowFilterDropdown(false);
                                            }}
                                            className="w-full rounded-md px-3 py-2 text-left text-sm text-foreground hover:bg-black/[.04] dark:hover:bg-white/[.04]"
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading Indicator */}
            {loading ? (
                <div className="flex flex-1 flex-col items-center justify-center p-12 text-foreground/60">
                    <Loader2 className="h-8 w-8 animate-spin text-brand mb-3" />
                    <p className="text-sm font-medium">Loading clinical schedule data...</p>
                </div>
            ) : (
                /* Main Calendar Grid */
                <div ref={scrollContainerRef} className="flex-1 overflow-auto thin-scrollbar rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22] min-h-[500px]">
                    <div className="flex flex-col" style={{ width: `${Math.max(800, 80 + (filteredStaff.length * 220))}px` }}>

                        {/* Header Row: Clinical Staff Members */}
                        <div className="sticky top-0 z-40 flex border-b border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22]">
                            <div className="sticky left-0 z-50 w-20 border-r border-black/[.15] bg-white dark:bg-zinc-900 p-4 dark:border-white/[.22] font-semibold text-xs text-foreground/50 text-center flex items-center justify-center">
                                Time
                            </div>
                            {filteredStaff.map((member) => (
                                <div key={member.id} className="flex flex-1 min-w-[220px] flex-col items-center justify-center border-r border-black/[.15] py-4 dark:border-white/[.22]">
                                    <span className="text-sm font-semibold text-foreground">{member.name}</span>
                                    <span className="text-xs text-foreground/50">{member.role}</span>
                                </div>
                            ))}
                        </div>

                        {/* Grid Body */}
                        <div className="relative flex">
                            {/* Y-Axis: Time Slots */}
                            <div className="sticky left-0 z-30 w-20 border-r border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22]">
                                {hours.map((hour) => (
                                    <div
                                        key={hour}
                                        className="flex flex-col items-end pr-3 pt-2 text-xs font-medium text-foreground/50 border-b border-black/[.04] dark:border-white/[.04]"
                                        style={{ height: `${rowHeight}px` }}
                                    >
                                        {hour === 12 ? '12:00 PM' : hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                                    </div>
                                ))}
                            </div>

                            {/* X-Axis: Staff Lanes */}
                            <div className="relative flex flex-1">
                                {/* Background Grid Lines */}
                                <div className="absolute inset-0 flex flex-col pointer-events-none">
                                    {hours.map((hour) => (
                                        <div key={`line-${hour}`} className="w-full border-b border-black/[.04] dark:border-white/[.04]" style={{ height: `${rowHeight}px` }} />
                                    ))}
                                </div>

                                {/* Staff Appointment Lanes */}
                                {filteredStaff.map((member) => {
                                    // Match appointments assigned to this staff member
                                    const memberAppointments = dayAppointments.filter(apt => {
                                        if (member.id === 'Unassigned') {
                                            return !apt.staffId || apt.staffId === 'Unassigned' || apt.clinician === 'Unassigned';
                                        }
                                        return (
                                            apt.staffId === member.rawId ||
                                            apt.staffId === member.id ||
                                            String(apt.staffId) === String(member.rawId) ||
                                            String(apt.staffId) === String(member.id) ||
                                            (apt.clinician && member.name && apt.clinician.toLowerCase().includes(member.name.toLowerCase()))
                                        );
                                    });

                                    return (
                                        <div key={`lane-${member.id}`} className="relative flex-1 min-w-[220px] border-r border-black/[.15] dark:border-white/[.22]">

                                            {memberAppointments.length === 0 && (
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                    <span className="text-[11px] text-foreground/30 font-medium">No appointments</span>
                                                </div>
                                            )}

                                            {memberAppointments.map(apt => {
                                                const { top, height } = calculatePosition(apt.startTime, apt.durationMinutes);

                                                return (
                                                    <div
                                                        key={apt.id}
                                                        onClick={() => router.push(`/dashboard/appointments?id=${apt.id}`)}
                                                        className={`group absolute left-1.5 right-1.5 z-10 flex flex-col overflow-hidden rounded-lg border p-2.5 transition-all hover:z-20 hover:scale-[1.02] cursor-pointer shadow-sm min-h-[52px] ${getStatusColors(apt.status)}`}
                                                        style={{ top, height }}
                                                    >
                                                        <div className="flex items-center gap-1.5 justify-start">
                                                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/10 dark:bg-white/10 font-bold text-[9px]">
                                                                {getInitials(apt.patient)}
                                                            </div>
                                                            <span className="truncate text-xs font-bold leading-tight">{apt.patient}</span>
                                                        </div>
                                                        <span className="mt-1 truncate text-[11px] font-medium opacity-90">{apt.service}</span>

                                                        <div className="mt-auto flex items-center justify-between gap-1 opacity-80 pt-1 text-[10px]">
                                                            <span className="flex items-center gap-1 font-semibold">
                                                                <Clock className="h-3 w-3" />
                                                                {apt.startTime}
                                                            </span>
                                                            <span className="font-semibold text-[9px] uppercase px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5">
                                                                {apt.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* Legend & Scroll Controls */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-foreground/70">
                <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-2"><div className="h-3 w-3 rounded-sm bg-sky-400"></div> Scheduled</span>
                    <span className="flex items-center gap-2"><div className="h-3 w-3 rounded-sm bg-indigo-500"></div> Confirmed</span>
                    <span className="flex items-center gap-2"><div className="h-3 w-3 rounded-sm bg-amber-400"></div> Pending</span>
                    <span className="flex items-center gap-2"><div className="h-3 w-3 rounded-sm bg-purple-500"></div> Checked-In</span>
                    <span className="flex items-center gap-2"><div className="h-3 w-3 rounded-sm bg-emerald-500"></div> Completed</span>
                    <span className="flex items-center gap-2"><div className="h-3 w-3 rounded-sm bg-rose-600 opacity-70"></div> Cancelled</span>
                    <span className="flex items-center gap-2"><div className="h-3 w-3 rounded-sm bg-zinc-400 dark:bg-zinc-700 opacity-70"></div> No Show</span>
                </div>

                {/* Horizontal Scroll Controls on the bottom right */}
                <div className="flex items-center gap-2">
                    <button type="button" onClick={scrollLeft} className="flex h-8 w-8 items-center justify-center rounded-md bg-[#3C43EC] text-white hover:bg-[#3C43EC]/90 transition-colors">
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={scrollRight} className="flex h-8 w-8 items-center justify-center rounded-md bg-[#3C43EC] text-white hover:bg-[#3C43EC]/90 transition-colors">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

        </div>
    );
}
