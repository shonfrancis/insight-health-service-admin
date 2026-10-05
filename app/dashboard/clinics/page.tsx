"use client";

import { useState, useEffect } from "react";
import {
    Building2,
    Plus,
    Search,
    MoreHorizontal,
    Activity,
    CreditCard,
    ShieldCheck,
    Users
} from "lucide-react";
import { Button } from "@/components/ui/button";

type RoleType = "super_admin" | "administrator" | "reception" | "clinician";

export default function ClinicsDashboard() {
    // DEMONSTRATION ONLY: In production, pull this from your Auth context/Zustand.
    const [userRole, setUserRole] = useState<RoleType>("super_admin");

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole") as RoleType | null;
        if (storedRole) {
            setUserRole(storedRole);
        }
    }, []);

    // Security layer: If a non-super-admin breaches the layout wrapper, explicitly block the UI.
    if (userRole !== "super_admin") {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
                <ShieldCheck className="h-12 w-12 text-zinc- mb-4" />
                <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
                <p className="text-foreground/60 mt-2">
                    This module requires Super Admin (Global Root) privileges[cite: 2].
                </p>
            </div>
        );
    }

    // Mock Data for Tenant Management[cite: 2]
    const clinics = [
        { id: "TEN-001", name: "Insight Health - Downtown", location: "New York, NY", status: "Active", plan: "Enterprise", patients: "12,450", revenue: "£145k/mo" },
        { id: "TEN-002", name: "Insight Health - Westside", location: "Los Angeles, CA", status: "Active", plan: "Professional", patients: "8,120", revenue: "£89k/mo" },
        { id: "TEN-003", name: "Insight Health - North", location: "Chicago, IL", status: "Provisioning", plan: "Professional", patients: "---", revenue: "---" },
        { id: "TEN-004", name: "Insight Health - South", location: "Miami, FL", status: "Suspended", plan: "Basic", patients: "2,340", revenue: "£12k/mo" },
    ];

    return (
        <div className="flex w-full flex-col gap-8 p-8">

            {/* Page Header & Quick Actions */}
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground">Clinic Management</h1>
                    <p className="mt-1 text-sm text-foreground/60">
                        Global tenant administration and deployment controls.
                    </p>
                </div>

                {/* Quick Actions for Add/Edit Clinic Branches[cite: 2] */}
                <div className="flex w-full gap-3 md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                        <input
                            type="text"
                            placeholder="Search tenants..."
                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 pl-9 pr-4 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22]"
                        />
                    </div>
                    <Button variant="filled" icon={Plus}>
                        Provision Clinic
                    </Button>
                </div>
            </div>

            {/* Global Subscription Metrics[cite: 2] */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col justify-between rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-6 dark:border-white/[.22] dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground/70">Total Active Clinics</span>
                        <Building2 className="h-4 w-4 text-foreground/70" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-foreground">2</span>
                        <span className="text-xs font-medium text-foreground/50">/ 4 Deployed</span>
                    </div>
                </div>

                <div className="flex flex-col justify-between rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-6 dark:border-white/[.22] dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground/70">Global System Health</span>
                        <Activity className="h-4 w-4 text-foreground/70" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-foreground">99.9%</span>
                        <span className="text-xs font-medium text-green-600">Optimal</span>
                    </div>
                </div>

                <div className="flex flex-col justify-between rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-6 dark:border-white/[.22] dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground/70">Total Patient Volume</span>
                        <Users className="h-4 w-4 text-foreground/70" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-foreground">22.9k</span>
                        <span className="text-xs font-medium text-blue-600">Across all tenants</span>
                    </div>
                </div>

                <div className="flex flex-col justify-between rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-6 dark:border-white/[.22] dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground/70">Global Monthly Recurring</span>
                        <CreditCard className="h-4 w-4 text-foreground/70" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-foreground">£246k</span>
                        <span className="text-xs font-medium text-green-600">+8.4%</span>
                    </div>
                </div>
            </div>

            {/* Tenant Management Table[cite: 2] */}
            <div className="flex flex-col rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22] overflow-auto thin-scrollbar max-h-[calc(100vh-350px)]">
                    <table className="w-full text-left text-sm text-foreground">
                        <thead className="border-b border-black/[.15] bg-black/[.02] text-xs uppercase text-foreground/60 dark:border-white/[.22] dark:bg-white/[.02]">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-medium">Tenant ID & Name</th>
                                <th scope="col" className="px-6 py-4 font-medium">Location</th>
                                <th scope="col" className="px-6 py-4 font-medium">Status</th>
                                <th scope="col" className="px-6 py-4 font-medium">Subscription Plan</th>
                                <th scope="col" className="px-6 py-4 font-medium">Patient Load</th>
                                <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/[.08] dark:divide-white/[.145]">
                            {clinics.map((clinic) => (
                                <tr key={clinic.id} className="transition-colors hover:bg-black/[.02] dark:hover:bg-white/[.02]">
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-foreground">{clinic.name}</span>
                                            <span className="text-xs text-foreground/50">{clinic.id}</span>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-foreground/80">{clinic.location}</td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${clinic.status === "Active" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                                            clinic.status === "Provisioning" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                                                "bg-zinc- text-zinc- dark:bg-zinc-/30 dark:text-zinc-"
                                            }`}>
                                            {clinic.status}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-foreground/80">{clinic.plan}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-foreground/80">{clinic.patients}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right">
                                        <Button variant="ghost" size="xs" icon={MoreHorizontal} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
            </div>

        </div>
    );
}
