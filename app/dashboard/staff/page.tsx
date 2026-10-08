"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DetailDrawer } from "@/components/ui/detail-drawer";
import { Modal } from "@/components/ui/modal";
import {
    Search,
    Plus,
    ShieldAlert,
    ShieldCheck,
    UserCog,
    Mail,
    Phone,
    GraduationCap,
    CalendarClock,
    X,
    Lock,
    Stethoscope,
    Briefcase,
    CheckCircle2,
    XCircle,
    UserCheck,
    UserX
} from "lucide-react";

// SRS Module 8 Staff Structure
type PermissionLevel = "Administrator" | "Clinician" | "Receptionist";

interface WorkingHours {
    days: string;
    hours: string;
}

interface StaffMember {
    id: string;
    rawId?: number;
    name: string;
    position: string;
    role: PermissionLevel;
    qualifications: string;
    contact: {
        email: string;
        phone: string;
    };
    schedule: WorkingHours;
    breaks?: string;
    holidays?: string[];
    unavailableDates?: string[];
    isActive: boolean; // System Account Access (Granted vs Revoked)
    isAvailable: boolean; // Clinician Booking Availability (Available vs Unavailable)
    maxSlotsPerDay?: number | null; // Max patient bookings per day (null = unlimited)
}

import { apiClient } from "@/lib/api-client";
import { useToast } from "@/components/ui/toast";

export default function StaffManagement() {
    const toast = useToast();
    const [userRole, setUserRole] = useState<"super_admin" | "administrator" | "reception" | "clinician">("administrator");
    const [staffList, setStaffList] = useState<StaffMember[]>([]);

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole") as any;
        if (storedRole) {
            setUserRole(storedRole);
        }

        apiClient('/staff')
            .then((res) => {
                if (res.data && res.data.length > 0) {
                    setStaffList(res.data.map((s: any) => ({
                        id: s.id,
                        rawId: s.rawId,
                        name: s.name,
                        position: s.specialization || s.role,
                        role: s.role === 'super_admin' || s.role === 'administrator' ? 'Administrator' : (s.role === 'clinician' ? 'Clinician' : 'Receptionist'),
                        qualifications: s.specialization || 'Certified Staff',
                        contact: { email: s.email, phone: s.phone || 'N/A' },
                        schedule: { days: 'Mon - Fri', hours: '08:30 - 17:30' },
                        isActive: s.status === 'active',
                        isAvailable: s.availability !== 'unavailable',
                        maxSlotsPerDay: s.max_slots_per_day ?? 10
                    })));
                }
            })
            .catch((err) => {
                console.warn("Using local staff list fallback:", err.message);
            });
    }, []);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [newHoliday, setNewHoliday] = useState("");
    const [newUnavailable, setNewUnavailable] = useState("");
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [modalSearchQuery, setModalSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [accessFilter, setAccessFilter] = useState("All");
    const [availabilityFilter, setAvailabilityFilter] = useState("All");

    // Add Staff Modal State
    const [showAddStaffModal, setShowAddStaffModal] = useState(false);
    const [addFirstName, setAddFirstName] = useState("");
    const [addLastName, setAddLastName] = useState("");
    const [addEmail, setAddEmail] = useState("");
    const [addPhone, setAddPhone] = useState("");
    const [addRole, setAddRole] = useState<"administrator" | "clinician" | "reception" | "super_admin">("administrator");
    const [addSpecialization, setAddSpecialization] = useState("");
    const [addMaxSlots, setAddMaxSlots] = useState("10");
    const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);

    const modalFilteredStaff = useMemo(() => {
        return staffList.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(modalSearchQuery.toLowerCase());
            return matchesSearch;
        });
    }, [staffList, modalSearchQuery]);

    const handleAddHoliday = () => {
        if (newHoliday && selectedStaff) {
            setSelectedStaff({
                ...selectedStaff,
                holidays: [...(selectedStaff.holidays || []), newHoliday]
            });
            setNewHoliday("");
            toast.info("Holiday Scheduled", `Added holiday on ${newHoliday}`);
        }
    };

    const handleRemoveHoliday = (index: number) => {
        if (selectedStaff) {
            const newHolidays = [...(selectedStaff.holidays || [])];
            newHolidays.splice(index, 1);
            setSelectedStaff({ ...selectedStaff, holidays: newHolidays });
            toast.info("Holiday Removed", "Schedule updated.");
        }
    };

    const handleAddUnavailable = () => {
        if (newUnavailable && selectedStaff) {
            setSelectedStaff({
                ...selectedStaff,
                unavailableDates: [...(selectedStaff.unavailableDates || []), newUnavailable]
            });
            setNewUnavailable("");
            toast.info("Unavailability Added", `Set unavailable on ${newUnavailable}`);
        }
    };

    const handleRemoveUnavailable = (index: number) => {
        if (selectedStaff) {
            const newDates = [...(selectedStaff.unavailableDates || [])];
            newDates.splice(index, 1);
            setSelectedStaff({ ...selectedStaff, unavailableDates: newDates });
        }
    };

    // Toggle Clinician Booking Availability (Available vs Unavailable)
    const toggleClinicianAvailability = async (id: string) => {
        const staffItem = staffList.find(s => s.id === id);
        if (!staffItem) return;
        const newAvailability = !staffItem.isAvailable;

        setStaffList(prev => prev.map(s => s.id === id ? { ...s, isAvailable: newAvailability } : s));
        if (selectedStaff?.id === id) {
            setSelectedStaff({ ...selectedStaff, isAvailable: newAvailability });
        }

        try {
            await apiClient(`/staff/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ availability: newAvailability ? 'available' : 'unavailable' })
            });
            toast.info(
                newAvailability ? "Clinician Available" : "Clinician Marked Unavailable",
                `${staffItem.name} booking status updated to ${newAvailability ? 'Available' : 'Unavailable'}.`
            );
        } catch (err: any) {
            console.error("Failed to update clinician availability:", err.message);
            toast.error("Update Failed", err.message || "Failed to update clinician availability.");
        }
    };

    // Toggle System Account Access (Granted vs Revoked)
    const toggleAccountAccess = async (id: string) => {
        const staffItem = staffList.find(s => s.id === id);
        if (!staffItem) return;
        const newAccess = !staffItem.isActive;

        setStaffList(prev => prev.map(s => s.id === id ? { ...s, isActive: newAccess } : s));
        if (selectedStaff?.id === id) {
            setSelectedStaff({ ...selectedStaff, isActive: newAccess });
        }

        try {
            await apiClient(`/staff/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ status: newAccess ? 'active' : 'inactive' })
            });
            toast.info(
                newAccess ? "Access Granted" : "Access Revoked",
                `System login access for ${staffItem.name} is now ${newAccess ? 'Granted' : 'Revoked'}.`
            );
        } catch (err: any) {
            console.error("Failed to update account access:", err.message);
            toast.error("Status Update Failed", err.message || "Failed to update account access.");
        }
    };

    const handleSaveProfile = async () => {
        if (!selectedStaff) return;
        try {
            const nameParts = selectedStaff.name.split(' ');
            const firstName = nameParts[0] || selectedStaff.name;
            const lastName = nameParts.slice(1).join(' ') || '';
            const backendRole = selectedStaff.role === 'Administrator' ? 'administrator' : (selectedStaff.role === 'Clinician' ? 'clinician' : 'reception');

            await apiClient(`/staff/${selectedStaff.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email: selectedStaff.contact.email,
                    phone: selectedStaff.contact.phone,
                    specialization: selectedStaff.qualifications,
                    role: backendRole,
                    status: selectedStaff.isActive ? 'active' : 'inactive',
                    availability: selectedStaff.isAvailable ? 'available' : 'unavailable',
                    max_slots_per_day: selectedStaff.maxSlotsPerDay ?? 10
                })
            });

            setStaffList(prev => prev.map(s => s.id === selectedStaff.id ? selectedStaff : s));
            toast.success("Profile Saved", `Staff profile for ${selectedStaff.name} was updated successfully.`);
            setSelectedStaff(null);
        } catch (err: any) {
            console.error("Failed to save staff profile:", err.message);
            toast.error("Save Error", err.message || "Failed to update staff profile.");
        }
    };

    const handleCreateStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingAdd(true);
        // Daily slot cap: blank / invalid → default 10
        const dailySlots = addMaxSlots && Number(addMaxSlots) >= 1
            ? Math.min(500, Math.round(Number(addMaxSlots)))
            : 10;
        try {
            const res = await apiClient('/staff', {
                method: 'POST',
                body: JSON.stringify({
                    first_name: addFirstName,
                    last_name: addLastName,
                    email: addEmail,
                    phone: addPhone,
                    role: addRole,
                    specialization: addSpecialization || 'Healthcare Specialist',
                    availability: 'available',
                    max_slots_per_day: dailySlots,
                })
            });

            const newMember: StaffMember = {
                id: res?.data?.id || `STF-${Math.floor(Math.random() * 10000)}`,
                name: `${addFirstName} ${addLastName}`,
                position: addSpecialization || addRole,
                role: addRole === 'administrator' || addRole === 'super_admin' ? 'Administrator' : (addRole === 'clinician' ? 'Clinician' : 'Receptionist'),
                qualifications: addSpecialization || 'Certified Staff',
                contact: { email: addEmail, phone: addPhone || 'N/A' },
                schedule: { days: 'Mon - Fri', hours: '08:30 - 17:30' },
                isActive: true,
                isAvailable: true,
                maxSlotsPerDay: dailySlots,
            };

            setStaffList([newMember, ...staffList]);
            toast.success("Staff Account Created", `${addFirstName} ${addLastName} added successfully.`);
            setShowAddStaffModal(false);
            setAddFirstName("");
            setAddLastName("");
            setAddEmail("");
            setAddPhone("");
            setAddSpecialization("");
            setAddMaxSlots("10");
        } catch (err: any) {
            toast.error("Failed to Create Staff", err.message || "Failed to create staff record.");
        } finally {
            setIsSubmittingAdd(false);
        }
    };

    // Filter logic
    const filteredStaff = useMemo(() => {
        return staffList.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.contact.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = roleFilter === "All" || s.role === roleFilter;
            const matchesAccess = accessFilter === "All" || (accessFilter === "Granted" ? s.isActive : !s.isActive);
            const matchesAvailability = availabilityFilter === "All" || (availabilityFilter === "Available" ? s.isAvailable : !s.isAvailable);
            return matchesSearch && matchesRole && matchesAccess && matchesAvailability;
        });
    }, [staffList, searchQuery, roleFilter, accessFilter, availabilityFilter]);

    const getRoleIcon = (role: PermissionLevel) => {
        switch (role) {
            case "Administrator": return <ShieldCheck className="h-4 w-4" />;
            case "Clinician": return <Stethoscope className="h-4 w-4" />;
            case "Receptionist": return <Briefcase className="h-4 w-4" />;
        }
    };

    const getRoleColors = (role: PermissionLevel) => {
        switch (role) {
            case "Administrator": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800";
            case "Clinician": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
            case "Receptionist": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
        }
    };

    if (userRole !== "super_admin" && userRole !== "administrator") {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-white dark:bg-zinc-900">
                <ShieldAlert className="mb-4 h-12 w-12 text-zinc-400" />
                <h1 className="text-2xl font-bold text-foreground">Administrative Lock</h1>
                <p className="mt-2 text-foreground/60">
                    Staff directories and permissions are restricted to Administrative personnel.
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full overflow-hidden">

            {/* Left Pane: Staff Roster */}
            <div className={`flex flex-col transition-all duration-300 ease-in-out ${selectedStaff ? "hidden md:flex md:w-2/3 border-r border-black/[.15] dark:border-white/[.22]" : "w-full"}`}>

                {/* Header & Seat Tracker */}
                <div className="flex flex-col gap-4 border-b border-black/[.15] p-8 dark:border-white/[.22]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Staff Directory</h1>
                            <p className="mt-1 text-sm text-foreground/60">Manage account access, permissions, and clinician booking availability.</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                icon={UserCog}
                                onClick={() => setShowStatusModal(true)}
                            >
                                Quick Status Overview
                            </Button>
                            <Button
                                variant="filled"
                                icon={Plus}
                                onClick={() => setShowAddStaffModal(true)}
                            >
                                Add Staff
                            </Button>
                        </div>
                    </div>

                    <div className="mt-2 flex flex-col sm:flex-row gap-3 w-full items-start sm:items-center">
                        <div className="relative flex-1 max-w-md w-full">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 pl-9 pr-4 text-sm text-foreground focus:border-[#3C43EC] focus:outline-none dark:border-white/[.22]"
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap w-full sm:w-auto">
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="h-10 rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm font-medium text-foreground focus:border-[#3C43EC] focus:outline-none dark:border-white/[.22] cursor-pointer flex-1 sm:flex-none"
                            >
                                <option value="All">All Roles</option>
                                <option value="Administrator">Administrator</option>
                                <option value="Clinician">Clinician</option>
                                <option value="Receptionist">Receptionist</option>
                            </select>
                            <select
                                value={accessFilter}
                                onChange={(e) => setAccessFilter(e.target.value)}
                                className="h-10 rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm font-medium text-foreground focus:border-[#3C43EC] focus:outline-none dark:border-white/[.22] cursor-pointer flex-1 sm:flex-none"
                            >
                                <option value="All">All Access</option>
                                <option value="Granted">Access Granted</option>
                                <option value="Revoked">Access Revoked</option>
                            </select>
                            <select
                                value={availabilityFilter}
                                onChange={(e) => setAvailabilityFilter(e.target.value)}
                                className="h-10 rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm font-medium text-foreground focus:border-[#3C43EC] focus:outline-none dark:border-white/[.22] cursor-pointer flex-1 sm:flex-none"
                            >
                                <option value="All">All Availability</option>
                                <option value="Available">Available (Booking)</option>
                                <option value="Unavailable">Unavailable (Booking)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Directory Table */}
                <div className="flex-1 overflow-auto p-8 thin-scrollbar">
                    <div className="rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22] overflow-hidden">
                        <table className="w-full text-left text-sm text-foreground">
                            <thead className="border-b border-black/[.15] bg-black/[.02] text-xs uppercase text-foreground/60 dark:border-white/[.22] dark:bg-white/[.02]">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Team Member</th>
                                    <th className="px-6 py-4 font-medium">System Role</th>
                                    <th className="px-6 py-4 font-medium">System Access</th>
                                    <th className="px-6 py-4 font-medium">Clinician Booking Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/[.08] dark:divide-white/[.145]">
                                {filteredStaff.map((staff) => {
                                    const isSelected = selectedStaff?.id === staff.id;
                                    return (
                                        <tr
                                            key={staff.id}
                                            onClick={() => setSelectedStaff(staff)}
                                            className={`cursor-pointer transition-colors hover:bg-black/[.04] dark:hover:bg-white/[.04] ${isSelected ? "bg-brand/5 dark:bg-brand/10" : ""}`}
                                        >
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3C43EC] text-white font-bold text-sm">
                                                        {getInitials(staff.name)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-foreground">{staff.name}</span>
                                                        <span className="text-xs text-foreground/50">{staff.position}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${getRoleColors(staff.role)}`}>
                                                    {getRoleIcon(staff.role)}
                                                    {staff.role}
                                                </span>
                                            </td>
                                            {/* System Account Access Badge */}
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${
                                                    staff.isActive
                                                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                                        : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800"
                                                }`}>
                                                    {staff.isActive ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                                                    {staff.isActive ? "Access Granted" : "Access Revoked"}
                                                </span>
                                            </td>
                                            {/* Clinician Booking Availability */}
                                            <td className="whitespace-nowrap px-6 py-4">
                                                {staff.role === 'Clinician' ? (
                                                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                                                        staff.isAvailable ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                                                    }`}>
                                                        <span className={`h-2 w-2 rounded-full ${staff.isAvailable ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                                                        {staff.isAvailable ? "Available for Booking" : "Unavailable (No Bookings)"}
                                                        {staff.isAvailable ? (
                                                            <span className="font-normal text-foreground/50">· {staff.maxSlotsPerDay ?? 10}/day</span>
                                                        ) : null}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-foreground/40 italic">N/A (Non-Clinical)</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredStaff.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-foreground/50">No staff members found matching your search filters.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Right Pane: Staff Detail Drawer */}
            {selectedStaff && (
                <DetailDrawer
                    onClose={() => setSelectedStaff(null)}
                    title={selectedStaff.name}
                    subtitle={selectedStaff.position}
                >
                    <div className="space-y-6">

                        {/* Top Profile Summary */}
                        <div className="flex items-center gap-4 rounded-xl border border-black/[.15] bg-black/[.02] p-4 dark:border-white/[.22] dark:bg-white/[.02]">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3C43EC] text-white font-bold text-xl">
                                {getInitials(selectedStaff.name)}
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <span className="font-semibold text-lg text-foreground truncate">{selectedStaff.name}</span>
                                <span className="text-xs text-foreground/60 font-mono">{selectedStaff.id}</span>
                            </div>
                        </div>

                        {/* System Access Control (All Roles) */}
                        <div className="rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-4 dark:border-white/[.22] space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-1.5">
                                        <Lock className="h-3.5 w-3.5 text-[#3C43EC]" /> System Account Access
                                    </h4>
                                    <p className="text-xs text-foreground/50 mt-0.5">
                                        {selectedStaff.isActive
                                            ? "Staff can log in and access authorized modules."
                                            : "Account is locked. Login attempts will be blocked (403 Forbidden)."}
                                    </p>
                                </div>
                                <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${
                                    selectedStaff.isActive
                                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                        : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                                }`}>
                                    {selectedStaff.isActive ? "Access Granted" : "Access Revoked"}
                                </span>
                            </div>

                            <div className="pt-2 flex justify-end">
                                {selectedStaff.isActive ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={UserX}
                                        onClick={() => toggleAccountAccess(selectedStaff.id)}
                                        className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-950/40"
                                    >
                                        Revoke Account Access
                                    </Button>
                                ) : (
                                    <Button
                                        variant="filled"
                                        size="sm"
                                        icon={UserCheck}
                                        onClick={() => toggleAccountAccess(selectedStaff.id)}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                    >
                                        Grant System Access
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Clinician Booking Availability Section (CLINICIANS ONLY) */}
                        {selectedStaff.role === 'Clinician' && (
                            <div className="rounded-xl border border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20 p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                                            <Stethoscope className="h-3.5 w-3.5 text-blue-600" /> Clinician Booking Availability
                                        </h4>
                                        <p className="text-xs text-blue-800/70 dark:text-blue-300/70 mt-0.5">
                                            Controls if patients can book appointments with this clinician. Does not block system login.
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={selectedStaff.isAvailable}
                                            onChange={() => toggleClinicianAvailability(selectedStaff.id)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-zinc-300 dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                </div>
                                <p className="text-xs font-semibold text-foreground/80">
                                    Status: <span className={selectedStaff.isAvailable ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}>
                                        {selectedStaff.isAvailable ? "Available for Patient Bookings" : "Unavailable (No New Bookings Allowed)"}
                                    </span>
                                </p>

                                {/* Daily booking slot limit */}
                                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-blue-500/20 bg-white/70 px-3 py-2.5 dark:bg-zinc-900/50">
                                    <div className="flex items-start gap-2.5 min-w-0">
                                        <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                                        <div>
                                            <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">Max slots per day</p>
                                            <p className="text-[11px] text-blue-800/70 dark:text-blue-300/70">Maximum patient bookings this clinician can accept per day.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            required
                                            min={1}
                                            max={500}
                                            value={selectedStaff.maxSlotsPerDay ?? ""}
                                            onChange={(e) => {
                                                const v = e.target.value;
                                                setSelectedStaff({
                                                    ...selectedStaff,
                                                    maxSlotsPerDay: v === "" ? null : Math.min(500, Math.max(1, Math.round(Number(v))))
                                                });
                                            }}
                                            onBlur={() => {
                                                setSelectedStaff(prev => (prev && !prev.maxSlotsPerDay ? { ...prev, maxSlotsPerDay: 10 } : prev));
                                            }}
                                            title="Max patient bookings per day"
                                            className="h-9 w-20 rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-2 text-center text-sm font-semibold text-foreground focus:border-[#3C43EC] focus:outline-none dark:border-white/[.22]"
                                        />
                                        <span className="inline-flex items-center whitespace-nowrap rounded-md bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                                            {selectedStaff.maxSlotsPerDay ?? 10} / day
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <hr className="border-black/[.15] dark:border-white/[.22]" />

                        {/* Profile Edit Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-foreground/70">Full Name</label>
                                <input
                                    type="text"
                                    value={selectedStaff.name}
                                    onChange={(e) => setSelectedStaff({ ...selectedStaff, name: e.target.value })}
                                    className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-[#3C43EC] focus:outline-none dark:border-white/[.22]"
                                />
                            </div>

                            {/* SRS RBAC Configuration */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-foreground/70">System Permission Role</label>
                                <select
                                    value={selectedStaff.role}
                                    onChange={(e) => setSelectedStaff({ ...selectedStaff, role: e.target.value as PermissionLevel })}
                                    className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm font-semibold text-foreground focus:border-[#3C43EC] focus:outline-none dark:border-white/[.22] cursor-pointer"
                                >
                                    <option value="Administrator">Administrator (Full Access)</option>
                                    <option value="Clinician">Clinician (Sonographer / Medical)</option>
                                    <option value="Receptionist">Receptionist (Bookings & CRM)</option>
                                </select>
                            </div>

                            {/* Qualifications & Specialization */}
                            <div>
                                <label className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground/50">
                                    <GraduationCap className="h-4 w-4" /> Specialization & Qualifications
                                </label>
                                <textarea
                                    value={selectedStaff.qualifications}
                                    onChange={(e) => setSelectedStaff({ ...selectedStaff, qualifications: e.target.value, position: e.target.value })}
                                    rows={2}
                                    className="w-full resize-none rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 p-3 text-sm text-foreground focus:border-[#3C43EC] focus:outline-none dark:border-white/[.22]"
                                />
                            </div>

                            <div>
                                <label className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground/50">
                                    <CalendarClock className="h-4 w-4" /> Working Schedule
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        value={selectedStaff.schedule.days}
                                        onChange={(e) => setSelectedStaff({ ...selectedStaff, schedule: { ...selectedStaff.schedule, days: e.target.value } })}
                                        placeholder="e.g. Mon - Fri"
                                        className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-[#3C43EC] focus:outline-none dark:border-white/[.22]"
                                    />
                                    <input
                                        type="text"
                                        value={selectedStaff.schedule.hours}
                                        onChange={(e) => setSelectedStaff({ ...selectedStaff, schedule: { ...selectedStaff.schedule, hours: e.target.value } })}
                                        placeholder="e.g. 09:00 AM - 05:00 PM"
                                        className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-[#3C43EC] focus:outline-none dark:border-white/[.22]"
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="border-black/[.15] dark:border-white/[.22]" />

                        {/* Availability & Exceptions */}
                        <div className="space-y-4">
                            <label className="text-xs font-bold uppercase tracking-wider text-foreground/50">Schedule Exceptions & Holidays</label>
                            <div>
                                <label className="mb-2 block text-xs font-semibold text-foreground/70">Holidays</label>
                                <div className="space-y-3">
                                    {(!selectedStaff.holidays || selectedStaff.holidays.length === 0) ? (
                                        <p className="text-sm text-foreground/50">No dates currently.</p>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedStaff.holidays.map((date, i) => (
                                                <div key={i} className="flex items-center gap-1.5 rounded-md bg-black/[.04] dark:bg-white/[.04] px-2.5 py-1 text-sm text-foreground">
                                                    <span>{date}</span>
                                                    <button type="button" onClick={() => handleRemoveHoliday(i)} className="text-foreground/50 hover:text-foreground">
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <input
                                            type="date"
                                            value={newHoliday}
                                            onChange={(e) => setNewHoliday(e.target.value)}
                                            className="h-8 flex-1 rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-2 text-sm text-foreground focus:border-[#3C43EC] focus:outline-none dark:border-white/[.22]"
                                        />
                                        <button type="button" onClick={handleAddHoliday} className="h-8 px-3 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90 flex items-center justify-center">
                                            <Plus className="h-4 w-4 mr-1" /> Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-semibold text-foreground/70">Unavailable Dates</label>
                                <div className="space-y-3">
                                    {(!selectedStaff.unavailableDates || selectedStaff.unavailableDates.length === 0) ? (
                                        <p className="text-sm text-foreground/50">No dates currently.</p>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedStaff.unavailableDates.map((date, i) => (
                                                <div key={i} className="flex items-center gap-1.5 rounded-md bg-black/[.04] dark:bg-white/[.04] px-2.5 py-1 text-sm text-foreground">
                                                    <span>{date}</span>
                                                    <button type="button" onClick={() => handleRemoveUnavailable(i)} className="text-foreground/50 hover:text-foreground">
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <input
                                            type="date"
                                            value={newUnavailable}
                                            onChange={(e) => setNewUnavailable(e.target.value)}
                                            className="h-8 flex-1 rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-2 text-sm text-foreground focus:border-[#3C43EC] focus:outline-none dark:border-white/[.22]"
                                        />
                                        <button type="button" onClick={handleAddUnavailable} className="h-8 px-3 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90 flex items-center justify-center">
                                            <Plus className="h-4 w-4 mr-1" /> Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-black/[.15] dark:border-white/[.22]" />

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <label className="text-xs font-bold uppercase tracking-wider text-foreground/50">Contact Details</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                                <input
                                    type="email"
                                    value={selectedStaff.contact.email}
                                    onChange={(e) => setSelectedStaff({ ...selectedStaff, contact: { ...selectedStaff.contact, email: e.target.value } })}
                                    className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 pl-9 pr-3 text-sm text-foreground focus:border-[#3C43EC] focus:outline-none dark:border-white/[.22]"
                                />
                            </div>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                                <input
                                    type="text"
                                    value={selectedStaff.contact.phone}
                                    onChange={(e) => setSelectedStaff({ ...selectedStaff, contact: { ...selectedStaff.contact, phone: e.target.value } })}
                                    className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 pl-9 pr-3 text-sm text-foreground focus:border-[#3C43EC] focus:outline-none dark:border-white/[.22]"
                                />
                            </div>
                        </div>

                    </div>

                    {/* Action Footer */}
                    <div className="mt-auto flex items-center justify-end gap-3 border-t border-black/[.15] dark:border-white/[.22] pt-6">
                        <Button
                            variant="filled"
                            onClick={handleSaveProfile}
                        >
                            Save Profile Changes
                        </Button>
                    </div>
                </DetailDrawer>
            )}

            {/* Quick Status Overview Modal */}
            <Modal
                isOpen={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                title="Quick Status Overview"
                description="Manage account access and clinician booking availability across team members."
                maxWidth="lg"
            >
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                    <input
                        type="text"
                        placeholder="Filter staff by name or role..."
                        value={modalSearchQuery}
                        onChange={(e) => setModalSearchQuery(e.target.value)}
                        className="h-9 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 pl-9 pr-3 text-sm text-foreground focus:border-[#3C43EC] focus:outline-none dark:border-white/[.22]"
                    />
                </div>

                <div className="max-h-96 overflow-y-auto thin-scrollbar space-y-3 pr-1">
                    {modalFilteredStaff.map((staff) => (
                        <div key={staff.id} className="flex items-center justify-between p-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[.01] dark:bg-white/[.01]">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3C43EC] text-white font-bold text-xs">
                                    {getInitials(staff.name)}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">{staff.name}</p>
                                    <p className="text-xs text-foreground/50">{staff.role} • {staff.position}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Account Access Button */}
                                <button
                                    type="button"
                                    onClick={() => toggleAccountAccess(staff.id)}
                                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                                        staff.isActive
                                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                            : "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"
                                    }`}
                                >
                                    {staff.isActive ? "Access Granted" : "Access Revoked"}
                                </button>

                                {/* Clinician Booking Availability Toggle (Clinicians Only) */}
                                {staff.role === 'Clinician' ? (
                                    <label className="relative inline-flex items-center cursor-pointer select-none" title="Toggle Clinician Booking Availability">
                                        <input
                                            type="checkbox"
                                            checked={staff.isAvailable}
                                            onChange={() => toggleClinicianAvailability(staff.id)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-9 h-5 bg-zinc-300 dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                ) : (
                                    <span className="text-xs text-foreground/40 italic">N/A</span>
                                )}
                            </div>
                        </div>
                    ))}
                    {modalFilteredStaff.length === 0 && (
                        <p className="text-center py-6 text-sm text-foreground/50">No staff found matching search query.</p>
                    )}
                </div>
            </Modal>

            {/* Add New Staff Member Modal */}
            <Modal
                isOpen={showAddStaffModal}
                onClose={() => setShowAddStaffModal(false)}
                title="Add New Staff Member"
                description="Create a new staff user profile and assign system access permissions."
                maxWidth="lg"
            >
                <form onSubmit={handleCreateStaff} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-foreground">First Name *</label>
                            <input
                                type="text"
                                required
                                value={addFirstName}
                                onChange={(e) => setAddFirstName(e.target.value)}
                                placeholder="e.g. Sarah"
                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-[#3C43EC] focus:outline-none dark:border-white/[.22]"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-foreground">Last Name *</label>
                            <input
                                type="text"
                                required
                                value={addLastName}
                                onChange={(e) => setAddLastName(e.target.value)}
                                placeholder="e.g. Connor"
                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-[#3C43EC] focus:outline-none dark:border-white/[.22]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-foreground">Email Address *</label>
                            <input
                                type="email"
                                required
                                value={addEmail}
                                onChange={(e) => setAddEmail(e.target.value)}
                                placeholder="e.g. sarah@insight.com"
                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-[#3C43EC] focus:outline-none dark:border-white/[.22]"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-foreground">Phone Number</label>
                            <input
                                type="text"
                                value={addPhone}
                                onChange={(e) => setAddPhone(e.target.value)}
                                placeholder="e.g. +44 7700 900001"
                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-[#3C43EC] focus:outline-none dark:border-white/[.22]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-foreground">Access Role *</label>
                            <select
                                value={addRole}
                                onChange={(e) => setAddRole(e.target.value as any)}
                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-[#3C43EC] focus:outline-none dark:border-white/[.22] cursor-pointer"
                            >
                                <option value="administrator">Administrator (Full Access)</option>
                                <option value="clinician">Clinician (Sonographer / Doctor)</option>
                                <option value="reception">Receptionist (Front Desk)</option>
                                <option value="super_admin">Super Admin (Global Root)</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-foreground">Specialization / Title</label>
                            <input
                                type="text"
                                value={addSpecialization}
                                onChange={(e) => setAddSpecialization(e.target.value)}
                                placeholder="e.g. Lead Sonographer"
                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-[#3C43EC] focus:outline-none dark:border-white/[.22]"
                            />
                        </div>
                    </div>

                    {addRole === 'clinician' && (
                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-500/20 bg-blue-50/50 p-3 dark:bg-blue-950/20">
                            <div className="flex items-start gap-2.5 min-w-0">
                                <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                                <div>
                                    <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">Max slots per day</p>
                                    <p className="text-[11px] text-blue-800/70 dark:text-blue-300/70">Maximum patient bookings this clinician can accept per day.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    required
                                    min={1}
                                    max={500}
                                    value={addMaxSlots}
                                    onChange={(e) => setAddMaxSlots(e.target.value)}
                                    title="Max patient bookings per day"
                                    className="h-9 w-20 rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-2 text-center text-sm font-semibold text-foreground focus:border-[#3C43EC] focus:outline-none dark:border-white/[.22]"
                                />
                                <span className="inline-flex items-center whitespace-nowrap rounded-md bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                                    {addMaxSlots && Number(addMaxSlots) >= 1 ? `${Math.min(500, Math.round(Number(addMaxSlots)))} / day` : "10 / day"}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => setShowAddStaffModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="filled"
                            type="submit"
                            loading={isSubmittingAdd}
                        >
                            Create Staff Member
                        </Button>
                    </div>
                </form>
            </Modal>

        </div>
    );
}
