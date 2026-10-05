"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
    LayoutDashboard,
    Calendar,
    Users,
    FolderHeart,
    FileText,
    Settings,
    CreditCard,
    Stethoscope,
    BriefcaseMedical,
    Building2,
    Undo2,
    LogOut,
    PieChart,
    MoreVertical,
    Bell,
    KeyRound,
    Eye,
    EyeOff,
    AlertCircle
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { apiClient } from "@/lib/api-client";

const sidebarConfig = [
    { label: "Overview", route: "/dashboard/overview", roles: ["super_admin", "administrator", "reception"], icon: LayoutDashboard },
    { label: "Calendar Matrix", route: "/dashboard/calendar", roles: ["super_admin", "administrator", "reception"], icon: Calendar },
    { label: "My Schedule", route: "/dashboard/schedule", roles: ["clinician"], icon: Calendar },
    { label: "Appointments", route: "/dashboard/appointments", roles: ["super_admin", "administrator", "reception"], icon: FolderHeart },
    { label: "Patient Profiles", route: "/dashboard/patients", roles: ["super_admin", "administrator", "reception"], icon: Users },
    { label: "Patient Database", route: "/dashboard/patients/clinical", roles: ["clinician"], icon: Users },
    { label: "Service Catalogs", route: "/dashboard/services", roles: ["super_admin", "administrator"], icon: BriefcaseMedical },
    { label: "Staff Directories", route: "/dashboard/staff", roles: ["super_admin", "administrator"], icon: Users },
    { label: "Financial Ledgers", route: "/dashboard/payments", roles: ["super_admin", "administrator", "reception"], icon: CreditCard },
    { label: "Refund Management", route: "/dashboard/payments/refunds", roles: ["super_admin", "administrator"], icon: Undo2 },
    { label: "System Analytics", route: "/dashboard/reports", roles: ["super_admin", "administrator"], icon: PieChart },
    { label: "Global Settings", route: "/dashboard/settings", roles: ["super_admin", "administrator"], icon: Settings },
];

interface SidebarProps {
    userRole: "super_admin" | "administrator" | "reception" | "clinician";
    firstName?: string;
    lastName?: string;
}

export default function Sidebar({ userRole, firstName = "John", lastName = "Doe" }: SidebarProps) {
    const toast = useToast();
    const pathname = usePathname();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Profile Details
    const [displayName, setDisplayName] = useState(`${firstName} ${lastName}`);
    const [displayEmail, setDisplayEmail] = useState("");

    // Change Password Modal States
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);
    const [pwError, setPwError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const storedInfo = localStorage.getItem("userInfo");
        if (storedInfo) {
            try {
                const info = JSON.parse(storedInfo);
                if (info.name) setDisplayName(info.name);
                if (info.email) setDisplayEmail(info.email);
            } catch (e) {
                // Ignore parse errors
            }
        }
    }, []);

    const authorizedLinks = sidebarConfig.filter((item) =>
        item.roles.includes(userRole)
    );

    const handleLogout = () => {
        localStorage.removeItem('adminAuthToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('selectedClinic');
        window.location.href = '/login';
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwError("");

        if (newPassword.length < 6) {
            setPwError("New password must be at least 6 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPwError("New password and confirm password do not match.");
            return;
        }

        setIsSubmitting(true);
        try {
            await apiClient('/change-password', {
                method: 'PUT',
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                }),
            });

            toast.success("Password Changed Successfully", "Your account password has been updated in the database.");
            setIsChangePasswordOpen(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            console.error("Failed to change password:", err.message);
            setPwError(err.message || "Failed to update password. Verify current password.");
            toast.error("Password Update Failed", err.message || "Invalid current password provided.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const initials = displayName
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);

    return (
        <aside className="flex h-screen w-64 flex-col bg-transparent text-slate-900 dark:text-white transition-colors">

            {/* Brand Header */}
            <div className="flex h-20 items-center px-6 border-b border-black/10 dark:border-white/10">
                <div className="flex flex-col">
                    <Image
                        src="/logo/logo.png"
                        alt="Insight Health Services Logo"
                        width={140}
                        height={35}
                    />
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-1 overflow-y-auto p-4 thin-scrollbar">
                {authorizedLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = link.route === "/dashboard/payments"
                        ? pathname === link.route
                        : pathname.startsWith(link.route);

                    return (
                        <Link
                            key={link.route}
                            href={link.route}
                            className={`group flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${isActive
                                ? "bg-[#3C43EC] text-white"
                                : "text-slate-600 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-[#01068B] hover:text-slate-900 dark:hover:text-white"
                                }`}
                        >
                            <Icon
                                className={`h-5 w-5 transition-colors ${isActive ? "text-white" : "text-slate-500 dark:text-white/50 group-hover:text-slate-900 dark:group-hover:text-white"
                                    }`}
                            />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Profile / Logout Area */}
            <div className="relative p-4 border-t border-black/10 dark:border-white/10" ref={menuRef}>
                {showProfileMenu && (
                    <div className="absolute bottom-full left-4 mb-2 w-[calc(100%-2rem)] rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-[#0f172a] shadow-xl z-50 flex flex-col gap-1">
                        <div className="px-3 py-2 border-b border-slate-100 dark:border-white/10 mb-1">
                            <p className="text-xs font-semibold text-slate-900 dark:text-white">{displayName}</p>
                            {displayEmail && <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{displayEmail}</p>}
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setShowProfileMenu(false);
                                setIsChangePasswordOpen(true);
                            }}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
                        >
                            <KeyRound className="h-4 w-4 text-[#3C43EC]" />
                            Change Password
                        </button>

                        <div className="my-1 border-t border-slate-100 dark:border-white/10" />

                        <div className="px-1 py-1 flex items-center justify-center">
                            <ThemeToggle />
                        </div>

                        <div className="my-1 border-t border-slate-100 dark:border-white/10" />

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full items-center justify-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/20 transition-all hover:bg-red-100 dark:hover:bg-red-950/40 hover:text-red-700 dark:hover:text-red-300"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                )}

                <div
                    className="flex items-center justify-between rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 p-2 transition-colors cursor-pointer select-none"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3C43EC] text-xs font-bold text-white border border-black/10 dark:border-white/10">
                            {initials}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-900 dark:text-white">
                                {displayName}
                            </span>
                            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                {userRole.replace('_', ' ')}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Link href="/dashboard/notifications" className="relative text-slate-600 dark:text-white p-1 rounded-md bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 transition-colors">
                            <Bell className="h-4 w-4" />
                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-900" />
                        </Link>
                        <button className="text-slate-600 dark:text-white p-1 rounded-md bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 transition-colors">
                            <MoreVertical className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Change Password Modal */}
            <Modal
                isOpen={isChangePasswordOpen}
                onClose={() => {
                    setIsChangePasswordOpen(false);
                    setPwError("");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                }}
                title="Change Password"
                description="Update your administrative account password in the database."
                maxWidth="md"
            >
                <form onSubmit={handleChangePassword} className="space-y-4">
                    {pwError && (
                        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-50 dark:bg-red-950/30 p-3 text-xs text-red-600 dark:text-red-400">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{pwError}</span>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrentPw ? "text" : "password"}
                                required
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="h-10 w-full rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 pl-3 pr-10 text-sm text-slate-900 dark:text-white focus:border-[#3C43EC] focus:outline-none"
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPw(!showCurrentPw)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                            >
                                {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showNewPw ? "text" : "password"}
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="h-10 w-full rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 pl-3 pr-10 text-sm text-slate-900 dark:text-white focus:border-[#3C43EC] focus:outline-none"
                                placeholder="At least 6 characters"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPw(!showNewPw)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                            >
                                {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPw ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="h-10 w-full rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 pl-3 pr-10 text-sm text-slate-900 dark:text-white focus:border-[#3C43EC] focus:outline-none"
                                placeholder="Re-enter new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPw(!showConfirmPw)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                            >
                                {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/10">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => {
                                setIsChangePasswordOpen(false);
                                setPwError("");
                                setCurrentPassword("");
                                setNewPassword("");
                                setConfirmPassword("");
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="filled"
                            type="submit"
                            loading={isSubmitting}
                        >
                            Update Password
                        </Button>
                    </div>
                </form>
            </Modal>

        </aside>
    );
}
