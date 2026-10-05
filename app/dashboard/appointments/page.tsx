"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DetailDrawer } from "@/components/ui/detail-drawer";
import {
    Search,
    Plus,
    Filter,
    MoreVertical,
    Calendar as CalendarIcon,
    Clock,
    User,
    Stethoscope,
    FileText,
    AlertCircle,
    X,
    Check,
    Ban,
    CreditCard
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

// SRS Status Types
type AppointmentStatus = "Pending" | "Confirmed" | "Checked-In" | "Completed" | "Cancelled" | "No Show";

type RoleType = "super_admin" | "administrator" | "reception" | "clinician";

interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    service: string;
    clinician: string;
    staffId?: string | number;
    date: string;
    time: string;
    status: AppointmentStatus;
    notes?: string;
    internalNotes?: string;
    patientNotes?: string;
    cancellationReason?: string;
    cancellationDate?: string;
    cancelledBy?: string;
}

const servicesData = [
    { id: "s1", category: "Pregnancy Scans", name: "Early Pregnancy Scan", price: 80, duration: "30 mins", description: "Confirm viability and date the pregnancy (6-14 weeks).", prep: "Full bladder required.", clinicians: ["Dr. Sarah Jenkins", "Dr. Marcus Thorne", "Dr. Emily Chen"] },
    { id: "s2", category: "Pregnancy Scans", name: "Dating Scan", price: 90, duration: "30 mins", description: "Accurate dating of pregnancy.", prep: "Full bladder required.", clinicians: ["Dr. Sarah Jenkins", "Dr. Emily Chen"] },
    { id: "s3", category: "Pregnancy Scans", name: "Reassurance Scan", price: 70, duration: "20 mins", description: "Check heartbeat and wellbeing.", prep: "None.", clinicians: ["Dr. Marcus Thorne", "Sonographer Anna"] },
    { id: "s4", category: "Pregnancy Scans", name: "Gender Scan", price: 65, duration: "20 mins", description: "Determine gender from 16 weeks.", prep: "No special prep.", clinicians: ["Dr. Sarah Jenkins", "Sonographer Anna"] },
    { id: "s5", category: "Pregnancy Scans", name: "Growth Scan", price: 100, duration: "30 mins", description: "Check fetal growth and fluid levels.", prep: "None.", clinicians: ["Dr. Marcus Thorne", "Dr. James Wilson"] },
    { id: "s6", category: "Pregnancy Scans", name: "4D/5D Baby Scan", price: 130, duration: "45 mins", description: "Detailed 4D/5D imaging of your baby.", prep: "Drink cold sweet drink 30 mins before.", clinicians: ["Dr. Sarah Jenkins", "Dr. Marcus Thorne", "Sonographer Anna"] },
    { id: "s7", category: "Pregnancy Scans", name: "Well Woman Scan", price: 120, duration: "30 mins", description: "Check uterus and ovaries.", prep: "Full bladder.", clinicians: ["Dr. Sarah Jenkins", "Dr. Emily Chen"] },
    { id: "s8", category: "Pregnancy Scans", name: "Fertility Scan", price: 110, duration: "30 mins", description: "Follicle tracking and baseline check.", prep: "None.", clinicians: ["Dr. Marcus Thorne", "Dr. James Wilson"] },
    { id: "s9", category: "Blood Tests", name: "NIPT Blood Test", price: 350, duration: "15 mins", description: "Non-invasive prenatal testing for chromosomal anomalies.", prep: "None.", clinicians: ["Nurse Sarah", "Phlebotomist John"] },
    { id: "s10", category: "Blood Tests", name: "General Blood Tests", price: 80, duration: "15 mins", description: "Full blood count, biochemistry.", prep: "Fasting may be required.", clinicians: ["Nurse Sarah", "Phlebotomist John", "Phlebotomist Lisa"] },
    { id: "s11", category: "Blood Tests", name: "Genotype Blood Test", price: 120, duration: "15 mins", description: "Determine blood genotype.", prep: "None.", clinicians: ["Nurse Sarah", "Phlebotomist John"] },
    { id: "s12", category: "Blood Tests", name: "Thalassaemia Screening", price: 150, duration: "15 mins", description: "Screening for Thalassaemia trait.", prep: "None.", clinicians: ["Nurse Sarah", "Phlebotomist Lisa"] },
];

import { apiClient } from "@/lib/api-client";

export default function AppointmentsManager() {
    const toast = useToast();
    const [userRole, setUserRole] = useState<RoleType>("reception");
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Filter & Search states
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("All");
    const [filterCategory, setFilterCategory] = useState<string>("All");
    const [filterService, setFilterService] = useState<string>("All");
    const [filterClinician, setFilterClinician] = useState<string>("All");

    const getTodayDateString = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const [filterDate, setFilterDate] = useState("");

    const fetchAppointments = (currentPage = 1, search = searchQuery, status = filterStatus) => {
        setLoading(true);
        let query = `/appointments?page=${currentPage}&per_page=15`;
        if (search) query += `&search=${encodeURIComponent(search)}`;
        if (status && status !== 'All') query += `&status=${encodeURIComponent(status)}`;
        if (filterDate) query += `&date=${encodeURIComponent(filterDate)}`;

        apiClient(query)
            .then((res) => {
                if (res.data) {
                    setAppointments(res.data);
                    if (res.meta) {
                        setPage(res.meta.current_page || currentPage);
                        setTotalPages(res.meta.last_page || 1);
                        setTotalItems(res.meta.total || res.data.length);
                    }
                } else {
                    setAppointments(generateAppointments());
                }
            })
            .catch((err) => {
                console.warn("Using fallback generated appointments:", err.message);
                setAppointments(generateAppointments());
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole") as RoleType | null;
        if (storedRole) {
            setUserRole(storedRole);
        }

        fetchAppointments(1);
    }, []);

    // Debounced Search & Filter Trigger
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAppointments(1, searchQuery, filterStatus);
        }, 350);
        return () => clearTimeout(timer);
    }, [searchQuery, filterStatus, filterDate]);

    // Security layer: Block clinical staff from this operational view


    const generateAppointments = (): Appointment[] => {
        const list: Appointment[] = [];
        const patients = [
            { id: "PAT-001", name: "Eleanor Vance" },
            { id: "PAT-002", name: "James Holden" },
            { id: "PAT-003", name: "Sophia Sterling" },
            { id: "PAT-004", name: "Amos Burton" },
            { id: "PAT-005", name: "Naomi Nagata" },
            { id: "PAT-006", name: "Alex Kamal" },
            { id: "PAT-007", name: "Julie Mao" },
            { id: "PAT-008", name: "Clarissa Mao" },
            { id: "PAT-009", name: "Bobby Draper" },
            { id: "PAT-010", name: "Chrisjen Avasarala" },
            { id: "PAT-011", name: "Sadavir Errinwright" },
            { id: "PAT-012", name: "Fred Johnson" },
        ];
        const services = [
            "4D/5D Baby Scan", "Well Woman Scan", "NIPT Blood Test", "Early Pregnancy Scan", 
            "Growth Scan", "General Blood Tests", "Gender Scan", "Dating Scan", "Reassurance Scan"
        ];
        const clinicians = [
            "Dr. Sarah Jenkins", "Dr. Marcus Thorne", "Tech. Anna Lewis", "Dr. Robert Chen", "Dr. Emily Taylor"
        ];
        const statuses: AppointmentStatus[] = [
            "Confirmed", "Pending", "Checked-In", "Completed", "Cancelled", "No Show"
        ];
        
        let idCounter = 201;
        // Generate from July 8 (08) to July 20 (20)
        for (let day = 8; day <= 20; day++) {
            const dateStr = `2026-07-${String(day).padStart(2, '0')}`;
            // 10 appointments per day
            for (let i = 0; i < 10; i++) {
                const hour = 9 + Math.floor(i / 2);
                const minute = (i % 2) * 30;
                const timeStr = `${String(hour === 12 ? 12 : hour % 12).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
                
                const patient = patients[(day * 3 + i) % patients.length];
                const service = services[(day * 2 + i * 5) % services.length];
                const clinician = clinicians[(day + i * 2) % clinicians.length];
                const status = statuses[(day * i + 3) % statuses.length];
                
                list.push({
                    id: `APT-${idCounter++}`,
                    patientId: patient.id,
                    patientName: patient.name,
                    service,
                    clinician,
                    date: dateStr,
                    time: timeStr,
                    status,
                    internalNotes: "",
                    patientNotes: ""
                });
            }
        }
        return list;
    };

    // Selected appointment state
    const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);

    const [editCategory, setEditCategory] = useState("Pregnancy Scans");
    const [editService, setEditService] = useState("");

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const uniqueClinicians = Array.from(new Set(appointments.map(a => a.clinician || 'Unassigned')));

    const filteredAppointments = appointments.filter(apt => {
        const pName = apt.patientName || '';
        const aptId = apt.id || '';
        const matchesSearch = searchQuery === "" || 
            pName.toLowerCase().includes(searchQuery.toLowerCase()) || 
            aptId.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = filterStatus === "All" || apt.status === filterStatus;
        
        let matchesService = true;
        if (filterCategory !== "All") {
            const aptCategory = servicesData.find(s => s.name === apt.service)?.category;
            matchesService = aptCategory === filterCategory;
            if (matchesService && filterService !== "All") {
                matchesService = apt.service === filterService;
            }
        }
        
        const matchesClinician = filterClinician === "All" || (apt.clinician || 'Unassigned') === filterClinician;
        const matchesDate = !filterDate || apt.date === filterDate;
        
        return matchesSearch && matchesStatus && matchesService && matchesClinician && matchesDate;
    });

    // Edit Drawer state
    const [staffList, setStaffList] = useState<any[]>([]);
    const [servicesList, setServicesList] = useState<any[]>([]);
    const [editServiceIds, setEditServiceIds] = useState<number[]>([]);
    const [editClinicianId, setEditClinicianId] = useState<string>("");
    const [editDate, setEditDate] = useState<string>("");
    const [editTime, setEditTime] = useState<string>("");
    const [editBookedSlots, setEditBookedSlots] = useState<string[]>([]);
    const [editNotes, setEditNotes] = useState<string>("");
    const [saving, setSaving] = useState<boolean>(false);

    const standardTimeSlots = [
        "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
        "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", 
        "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM"
    ];

    const normalizeTimeSlot = (t: string) => {
        if (!t) return "";
        let str = t.trim();
        if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(str)) {
            const parts = str.split(':');
            const h = parseInt(parts[0], 10);
            const m = parseInt(parts[1], 10);
            const ampm = h >= 12 ? 'PM' : 'AM';
            const h12 = h % 12 || 12;
            str = `${h12}:${m < 10 ? '0' + m : m} ${ampm}`;
        }
        return str.replace(/^0/, '').toLowerCase();
    };

    const groupedServices = useMemo(() => {
        const list = servicesList.length > 0 ? servicesList : servicesData;
        const groups: Record<string, any[]> = {};

        list.forEach(s => {
            const cat = s.category || s.department || "General Health & Scans";
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(s);
        });

        return groups;
    }, [servicesList]);

    // Fetch Clinicians & Services lists for assignment / reassignment & edit dropdowns
    useEffect(() => {
        apiClient('/staff?role=clinician')
            .then(res => {
                if (res.data) setStaffList(res.data);
            })
            .catch(() => {});

        apiClient('/services')
            .then(res => {
                if (res.data) setServicesList(res.data);
            })
            .catch(() => {});
    }, []);

    // Fetch booked slots dynamically when editing date or clinician
    useEffect(() => {
        if (editDate && editClinicianId) {
            apiClient(`/appointments/booked-slots?date=${editDate}&staff_id=${editClinicianId}`)
                .then(res => {
                    if (res.bookedSlots) setEditBookedSlots(res.bookedSlots);
                })
                .catch(() => setEditBookedSlots([]));
        } else {
            setEditBookedSlots([]);
        }
    }, [editDate, editClinicianId]);

    useEffect(() => {
        setIsCancelling(false);
        if (selectedApt) {
            setEditDate(selectedApt.date || "");
            setEditTime(selectedApt.time || "");
            setEditNotes(selectedApt.notes || selectedApt.internalNotes || "");
            setEditClinicianId(selectedApt.staffId ? String(selectedApt.staffId) : "");

            let sIds: number[] = [];
            if (Array.isArray((selectedApt as any).serviceIds) && (selectedApt as any).serviceIds.length > 0) {
                sIds = (selectedApt as any).serviceIds.map((id: any) => Number(id)).filter((id: number) => !isNaN(id) && id > 0);
            }
            if (sIds.length === 0 && (selectedApt as any).serviceId) {
                sIds = [Number((selectedApt as any).serviceId)];
            }
            if (sIds.length === 0 && selectedApt.service && servicesList.length > 0) {
                const titles = selectedApt.service.split(' + ').map((t: string) => t.trim().toLowerCase());
                sIds = servicesList
                    .filter(s => titles.includes((s.title || s.name || s.service_name || '').toLowerCase()))
                    .map(s => Number(s.id))
                    .filter((id: number) => !isNaN(id) && id > 0);
            }
            setEditServiceIds(sIds);
        }
    }, [selectedApt?.id, servicesList]);

    const handleSaveAppointment = async () => {
        if (!selectedApt) return;
        if (editServiceIds.length === 0) {
            toast.error("Service Required", "Please select at least one service for the appointment.");
            return;
        }
        setSaving(true);
        try {
            await apiClient(`/appointments/${selectedApt.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    status: selectedApt.status,
                    staff_id: editClinicianId || null,
                    service_id: editServiceIds[0] || null,
                    service_ids: editServiceIds,
                    appointment_date: editDate,
                    start_time: editTime,
                    notes: editNotes,
                })
            });
            toast.success("Appointment Saved", `Booking ${selectedApt.id} details updated.`);
            fetchAppointments(page);
            setSelectedApt(null);
        } catch (err: any) {
            console.error("Failed to update appointment on backend API:", err.message);
            toast.error("Update Error", err.message || "Failed to save appointment changes.");
        } finally {
            setSaving(false);
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

    const getStatusBadge = (status: AppointmentStatus) => {
        switch (status) {
            case "Confirmed": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
            case "Pending": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
            case "Checked-In": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
            case "Completed": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            case "Cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
            case "No Show": return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400";
            default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: AppointmentStatus) => {
        setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt));
        if (selectedApt?.id === id) {
            setSelectedApt(prev => prev ? { ...prev, status: newStatus } : null);
        }

        try {
            await apiClient(`/appointments/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ status: newStatus })
            });
            toast.success("Status Updated", `Appointment status set to ${newStatus}.`);
        } catch (err: any) {
            console.error("Failed to update status:", err.message);
            toast.error("Status Update Failed", err.message || "Failed to update status.");
        }
    };

    if (userRole === "clinician") {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
                <Ban className="mb-4 h-12 w-12 text-zinc-" />
                <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
                <p className="mt-2 text-foreground/60">
                    Clinical staff must use the 'My Schedule' module for appointment tracking.
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full overflow-hidden">

            {/* Left Pane: Data Table (Shrinks if drawer is open) */}
            <div className={`flex flex-col transition-all duration-300 ease-in-out ${(selectedApt || isFilterOpen) ? "w-2/3 border-r border-black/[.15] dark:border-white/[.22]" : "w-full"}`}>

                {/* Header & Toolbar */}
                <div className="flex flex-col gap-4 border-b border-black/[.15] p-8 dark:border-white/[.22]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Appointments</h1>
                            <p className="mt-1 text-sm text-foreground/60">Manage bookings, modifications, and cancellations.</p>
                        </div>
                        <Link href="/dashboard/appointments/new">
                            <Button variant="filled" icon={Plus}>
                                New Appointment
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                            <input
                                type="text"
                                placeholder="Search by patient name, ID, or reference..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 pl-9 pr-4 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22]"
                            />
                        </div>
                        <div className="flex gap-2">
                            <div className="relative flex-1 sm:flex-none">
                                <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40 pointer-events-none" />
                                <input
                                    type="date"
                                    value={filterDate}
                                    onChange={(e) => setFilterDate(e.target.value)}
                                    className="h-10 w-full sm:w-auto rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 pl-9 pr-3 text-sm font-medium text-foreground focus:border-brand focus:outline-none dark:border-white/[.22] cursor-pointer"
                                />
                            </div>
                            <Button variant="outline" icon={Filter} onClick={() => {
                                setSelectedApt(null);
                                setIsFilterOpen(true);
                            }}>
                                Filter
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="flex-1 overflow-hidden bg-white dark:bg-zinc-900 p-8">
                    <div className="h-full rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22] overflow-auto thin-scrollbar">
                        <table className="w-full text-left text-sm text-foreground">
                            <thead className="border-b border-black/[.15] bg-black/[.02] text-xs uppercase text-foreground/60 dark:border-white/[.22] dark:bg-white/[.02]">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Patient</th>
                                    <th className="px-6 py-4 font-medium">Service & Clinician</th>
                                    <th className="px-6 py-4 font-medium">Date & Time</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 text-right font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/[.15] dark:divide-white/[.22]">
                                {filteredAppointments.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <CalendarIcon className="h-8 w-8 text-foreground/30" />
                                                <p className="font-semibold text-foreground/80">No appointments scheduled</p>
                                                <p className="text-xs text-foreground/50">Please select a different date or refine your filters.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAppointments.map((apt) => (
                                        <tr
                                            key={apt.id}
                                            onClick={() => {
                                                setIsFilterOpen(false);
                                                setSelectedApt(apt);
                                            }}
                                            className={`cursor-pointer transition-colors hover:bg-black/[.04] dark:hover:bg-white/[.04] ${selectedApt?.id === apt.id ? "bg-brand/5 dark:bg-brand/10" : ""}`}
                                        >
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs">
                                                        {getInitials(apt.patientName)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-foreground">{apt.patientName}</span>
                                                        <span className="text-xs text-foreground/50">{apt.id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-foreground/90">{apt.service}</span>
                                                    <span className="text-xs text-foreground/50 flex items-center gap-1 mt-0.5">
                                                        <Stethoscope className="h-3 w-3" /> {apt.clinician}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-foreground/90 flex items-center gap-1">
                                                        <CalendarIcon className="h-3 w-3" /> {apt.date}
                                                    </span>
                                                    <span className="text-xs text-foreground/50 flex items-center gap-1 mt-0.5">
                                                        <Clock className="h-3 w-3" /> {apt.time}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(apt.status)}`}>
                                                    {apt.status}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right">
                                                <Button variant="ghost" size="xs" icon={MoreVertical} />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-black/[.15] dark:border-white/[.15] px-6 py-4">
                        <p className="text-xs text-foreground/60">
                            Showing page <span className="font-bold text-foreground">{page}</span> of <span className="font-bold text-foreground">{totalPages}</span> ({totalItems} total appointments)
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="xs"
                                disabled={page <= 1 || loading}
                                onClick={() => fetchAppointments(page - 1)}
                            >
                                Previous
                            </Button>
                            <span className="text-xs font-bold text-foreground px-2">{page} / {totalPages}</span>
                            <Button
                                variant="outline"
                                size="xs"
                                disabled={page >= totalPages || loading}
                                onClick={() => fetchAppointments(page + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Pane: Contextual Drawer (Edit / Notes / Cancel) */}
            {selectedApt && (
                <DetailDrawer
                    onClose={() => setSelectedApt(null)}
                    title="Booking Details"
                    subtitle={selectedApt.id}
                >
                    <div className="flex flex-col gap-8">

                        {/* Action Banner */}
                        <div className="flex flex-col gap-4 rounded-lg border border-black/[.15] bg-white dark:bg-zinc-900 p-4 dark:border-white/[.22] dark:bg-zinc-900">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-sm">
                                        {getInitials(selectedApt.patientName)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-foreground">{selectedApt.patientName}</span>
                                        <span className="text-xs text-foreground/50">{selectedApt.id}</span>
                                    </div>
                                </div>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadge(selectedApt.status)}`}>
                                    {selectedApt.status}
                                </span>
                            </div>

                            <hr className="border-black/[.15] dark:border-white/[.22]" />

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-medium text-foreground/70">Update Appointment Status</label>
                                <select
                                    value=""
                                    onChange={(e) => {
                                        if (e.target.value === "cancel_intent") {
                                            setIsCancelling(true);
                                        } else {
                                            setIsCancelling(false);
                                            handleStatusUpdate(selectedApt.id, e.target.value as AppointmentStatus);
                                        }
                                    }}
                                    className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm font-medium focus:border-brand focus:outline-none dark:border-white/[.22] dark:bg-zinc-900 cursor-pointer"
                                >
                                    <option value="" disabled>Select new status...</option>
                                    {selectedApt.status !== "Pending" && <option value="Pending">Revert to Pending</option>}
                                    {selectedApt.status !== "Confirmed" && <option value="Confirmed">Mark Confirmed</option>}
                                    {selectedApt.status !== "Checked-In" && <option value="Checked-In">Check-In Patient</option>}
                                    {selectedApt.status !== "Completed" && <option value="Completed">Mark Completed</option>}
                                    {selectedApt.status !== "No Show" && <option value="No Show">Mark No-Show</option>}
                                    {selectedApt.status !== "Cancelled" && <option value="cancel_intent">Cancel Appointment</option>}
                                </select>
                            </div>
                        </div>

                        {/* Billing / Payment Section */}
                        <div className="flex flex-col gap-3 rounded-lg border border-black/[.15] bg-white dark:bg-zinc-900 p-4 dark:border-white/[.22] dark:bg-zinc-900">
                            <label className="text-xs font-semibold uppercase tracking-wider text-foreground/50">Billing Actions</label>
                            <Link href={`/dashboard/payments?new=true&patientName=${encodeURIComponent(selectedApt.patientName)}&appointmentRef=${encodeURIComponent(selectedApt.id)}&service=${encodeURIComponent(selectedApt.service)}`}>
                                <Button variant="outline" className="w-full flex items-center justify-center gap-2 border-brand text-brand hover:bg-[#3C43EC]/5" icon={CreditCard}>
                                    Pay Now
                                </Button>
                            </Link>
                        </div>

                        {selectedApt.status === "Cancelled" ? (
                            <div className="flex flex-col gap-4 pb-8">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Cancellation Details</h3>
                                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-900/30 dark:bg-zinc-900/10">
                                    <div className="space-y-4">
                                        <div>
                                            <span className="block text-xs font-medium text-zinc-800/70 dark:text-zinc-400/70 mb-1">Reason for Cancellation</span>
                                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-300">{selectedApt.cancellationReason || "No reason provided"}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="block text-xs font-medium text-zinc-800/70 dark:text-zinc-400/70 mb-1">Date</span>
                                                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-300">{selectedApt.cancellationDate || "Unknown"}</span>
                                            </div>
                                            <div>
                                                <span className="block text-xs font-medium text-zinc-800/70 dark:text-zinc-400/70 mb-1">Cancelled By</span>
                                                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-300">{selectedApt.cancelledBy || "Unknown staff"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : isCancelling ? (
                            <div className="flex flex-col gap-4 pb-8">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Cancel Appointment</h3>
                                <div className="flex flex-col gap-3">
                                    <p className="text-xs text-foreground/70">
                                        Cancelling will release this time slot. You must provide a reason.
                                    </p>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-foreground/80">Cancellation Reason</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Patient requested, No show..."
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22]"
                                        />
                                    </div>

                                    {/* <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-foreground/80">Cancellation Date</label>
                                            <input
                                                type="date"
                                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22]"
                                            />
                                        </div> */}

                                    <div className="flex gap-2 mt-2">
                                        <Button variant="outline" className="flex-[2] whitespace-nowrap border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20" icon={Ban} onClick={() => {
                                            handleStatusUpdate(selectedApt.id, "Cancelled");
                                            setIsCancelling(false);
                                        }}>
                                            Confirm Cancel
                                        </Button>
                                        <Button variant="outline" className="flex-1" onClick={() => setIsCancelling(false)}>
                                            Back
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Modification Form (SRS Requirement) */}
                                <div className="flex flex-col gap-4">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/50">Modify Details</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
                                                Services (Check multiple if applicable)
                                            </label>
                                            <div className="flex flex-col gap-3 max-h-48 overflow-y-auto thin-scrollbar rounded-lg border border-black/[.15] dark:border-white/[.22] p-3">
                                                {Object.entries(groupedServices).map(([category, items]) => (
                                                    <div key={category} className="flex flex-col gap-1.5">
                                                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                                            {category}
                                                        </span>
                                                        <div className="grid grid-cols-1 gap-1.5 pl-1">
                                                            {(items as any[]).map((s) => {
                                                                const sId = Number(s.id);
                                                                const isChecked = editServiceIds.includes(sId);
                                                                return (
                                                                    <label key={s.id} className="flex items-center gap-2 cursor-pointer text-xs text-foreground hover:text-blue-600">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={isChecked}
                                                                            onChange={(e) => {
                                                                                if (e.target.checked) {
                                                                                    setEditServiceIds(prev => [...prev, sId]);
                                                                                } else {
                                                                                    setEditServiceIds(prev => prev.filter(id => id !== sId));
                                                                                }
                                                                            }}
                                                                            className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                                        />
                                                                        <span>{s.title || s.name || s.service_name} ({s.price ? `£${s.price}` : 'Available'})</span>
                                                                    </label>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-foreground/70">Assign / Reassign Clinician</label>
                                            <select
                                                value={editClinicianId}
                                                onChange={(e) => setEditClinicianId(e.target.value)}
                                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]"
                                            >
                                                <option value="">-- Select Clinician --</option>
                                                {staffList.map((c: any) => (
                                                    <option key={c.id || c.rawId} value={c.rawId || c.id}>
                                                        {c.name} ({c.specialization || c.role})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-foreground/70">Date</label>
                                            <input
                                                type="date"
                                                value={editDate}
                                                onChange={(e) => setEditDate(e.target.value)}
                                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-xs font-semibold text-foreground/80">
                                                Available Time Slots {selectedApt && <span className="text-[11px] font-normal text-foreground/60">(Highlighted slot is current booking)</span>}
                                            </label>
                                            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto thin-scrollbar p-1">
                                                {standardTimeSlots.map(time => {
                                                    const normTime = normalizeTimeSlot(time);
                                                    const normEditTime = normalizeTimeSlot(editTime);
                                                    const normOrigTime = selectedApt ? normalizeTimeSlot(selectedApt.time) : "";

                                                    const sameDate = selectedApt && editDate === selectedApt.date;
                                                    const sameStaff = selectedApt && (
                                                        String(editClinicianId || "") === String(selectedApt.staffId || "") ||
                                                        (!editClinicianId && !selectedApt.staffId)
                                                    );

                                                    const isCurrentSlot = Boolean(sameDate && sameStaff && normTime === normOrigTime);
                                                    const isBookedInDB = editBookedSlots.some(b => normalizeTimeSlot(b) === normTime);
                                                    const isBookedByOther = isBookedInDB && !isCurrentSlot;
                                                    const isSelected = normEditTime === normTime;

                                                    let buttonStyle = "";
                                                    let badge = null;

                                                    if (isCurrentSlot) {
                                                        if (isSelected) {
                                                            buttonStyle = "border-blue-600 bg-blue-600 text-white shadow-md ring-2 ring-blue-500/30 font-bold";
                                                            badge = (
                                                                <span className="ml-1 rounded bg-blue-500/40 text-white px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider">
                                                                    Current Slot
                                                                </span>
                                                            );
                                                        } else {
                                                            buttonStyle = "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 font-bold hover:bg-blue-100 dark:hover:bg-blue-900/60";
                                                            badge = (
                                                                <span className="ml-1 rounded bg-blue-200 dark:bg-blue-900 px-1.5 py-0.5 text-[9px] font-extrabold text-blue-800 dark:text-blue-200 uppercase tracking-wider">
                                                                    Current Slot
                                                                </span>
                                                            );
                                                        }
                                                    } else if (isBookedByOther) {
                                                        buttonStyle = "border-red-200 bg-red-50 text-red-400 line-through cursor-not-allowed dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-500/60";
                                                        badge = (
                                                            <span className="ml-1 rounded bg-red-100 px-1 py-0.2 text-[8px] font-bold text-red-700 no-underline dark:bg-red-950 dark:text-red-300">
                                                                Booked
                                                            </span>
                                                        );
                                                    } else if (isSelected) {
                                                        buttonStyle = "border-blue-600 bg-blue-600 text-white shadow-sm font-semibold";
                                                    } else {
                                                        buttonStyle = "border-black/[.15] bg-white text-foreground hover:border-blue-600 dark:bg-zinc-900 dark:border-white/[.22] font-semibold";
                                                    }

                                                    return (
                                                        <button
                                                            key={time}
                                                            type="button"
                                                            disabled={isBookedByOther}
                                                            onClick={() => setEditTime(time)}
                                                            className={`relative rounded-lg border px-3 py-1.5 text-xs transition-all flex items-center gap-1 ${buttonStyle}`}
                                                        >
                                                            <span>{time}</span>
                                                            {badge}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Appointment Notes */}
                                <div className="flex flex-col gap-4">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/50">Appointment Notes</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-1 flex items-center gap-1 text-xs font-medium text-foreground/70">
                                                <AlertCircle className="h-3 w-3" /> Internal Staff Note
                                            </label>
                                            <textarea
                                                value={editNotes}
                                                onChange={(e) => setEditNotes(e.target.value)}
                                                placeholder="Add a private internal staff note..."
                                                className="w-full resize-none rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 p-3 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22]"
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button variant="filled" disabled={saving} onClick={() => handleSaveAppointment()} className="w-full mt-4">
                                    {saving ? "Saving Changes..." : "Save Changes"}
                                </Button>
                            </>
                        )}

                    </div>
                </DetailDrawer>
            )}

            {/* Filter Drawer */}
            {isFilterOpen && (
                <DetailDrawer
                    onClose={() => setIsFilterOpen(false)}
                    title="Filter Appointments"
                    subtitle="Refine your view"
                >
                    <div className="flex flex-col gap-6">
                        {/* Status Filter */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-foreground/80">Status</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]"
                            >
                                <option value="All">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Checked-In">Checked-In</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="No Show">No Show</option>
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-foreground/80">Service Category</label>
                            <select
                                value={filterCategory}
                                onChange={(e) => {
                                    setFilterCategory(e.target.value);
                                    setFilterService("All");
                                }}
                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]"
                            >
                                <option value="All">All Categories</option>
                                <option value="Pregnancy Scans">Pregnancy Scans</option>
                                <option value="Blood Tests">Blood Tests</option>
                            </select>
                        </div>

                        {/* Service Filter */}
                        <div className={`transition-opacity duration-300 ${filterCategory === "All" ? "opacity-50 pointer-events-none" : ""}`}>
                            <label className="mb-2 block text-sm font-semibold text-foreground/80">Specific Service</label>
                            <select
                                value={filterService}
                                onChange={(e) => setFilterService(e.target.value)}
                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]"
                            >
                                <option value="All">All Services</option>
                                {filterCategory !== "All" && servicesData.filter(s => s.category === filterCategory).map(s => (
                                    <option key={s.id} value={s.name}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Clinician Filter */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-foreground/80">Clinician</label>
                            <select
                                value={filterClinician}
                                onChange={(e) => setFilterClinician(e.target.value)}
                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]"
                            >
                                <option value="All">All Clinicians</option>
                                {uniqueClinicians.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <Button variant="filled" className="flex-1" onClick={() => setIsFilterOpen(false)}>Apply Filters</Button>
                            <Button variant="outline" className="flex-1" onClick={() => {
                                setFilterStatus("All");
                                setFilterCategory("All");
                                setFilterService("All");
                                setFilterClinician("All");
                            }}>Reset Filters</Button>
                        </div>
                    </div>
                </DetailDrawer>
            )}
        </div>
    );
}
