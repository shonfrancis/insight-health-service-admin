"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Search,
    Plus,
    Filter,
    User,
    Phone,
    Mail,
    ShieldAlert,
    ChevronRight
} from "lucide-react";
import { Patient, mockPatientsData } from "./data";

import { apiClient } from "@/lib/api-client";

export default function PatientCRM() {
    const router = useRouter();
    const [userRole, setUserRole] = useState<"super_admin" | "administrator" | "reception" | "clinician">("reception");
    const [activeTab, setActiveTab] = useState<"patients" | "customers">("patients");
    
    const [patients, setPatients] = useState<any[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("focus") === "search" && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole") as "super_admin" | "administrator" | "reception" | "clinician" | null;
        if (storedRole) {
            setUserRole(storedRole);
        }
    }, []);

    // Fetch data based on active tab & search query
    useEffect(() => {
        setLoading(true);
        const endpoint = activeTab === "patients" ? "/patients" : "/customers";
        const query = searchQuery ? `${endpoint}?search=${encodeURIComponent(searchQuery)}` : endpoint;

        apiClient(query)
            .then((res) => {
                if (res.data) {
                    if (activeTab === "patients") {
                        setPatients(res.data);
                    } else {
                        setCustomers(res.data);
                    }
                }
            })
            .catch((err) => {
                console.warn(`Failed to fetch ${activeTab}:`, err.message);
            })
            .finally(() => setLoading(false));
    }, [activeTab, searchQuery]);

    const getInitials = (name: string) => {
        if (!name) return "P";
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    if (userRole === "clinician") {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
                <ShieldAlert className="mb-4 h-12 w-12 text-zinc-500" />
                <h1 className="text-2xl font-bold text-foreground">Access Restricted</h1>
                <p className="mt-2 text-foreground/60">
                    Clinical staff must access patient charts directly through their scheduled queue.
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full overflow-hidden">
            <div className="flex flex-col w-full">
                {/* Header & Search */}
                <div className="flex flex-col gap-6 border-b border-black/[.15] p-8 dark:border-white/[.22]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Directory Vault</h1>
                            <p className="mt-1 text-sm text-foreground/60">Manage clinical patient records and account holder customer profiles.</p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative w-64 md:w-80">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder={`Search ${activeTab === "patients" ? "Patients" : "Customers"} by Name, Email, Phone...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 pl-9 pr-4 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22]"
                                />
                            </div>
                            <Button variant="filled" icon={Plus} onClick={() => router.push("/dashboard/appointments/new")}>
                                New Appointment
                            </Button>
                        </div>
                    </div>

                    {/* Tab Switcher: Patients vs Customers */}
                    <div className="flex items-center gap-2 border-b border-black/[.1] dark:border-white/[.1] pt-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab("patients")}
                            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all ${activeTab === "patients" ? "border-blue-600 text-blue-600" : "border-transparent text-foreground/60 hover:text-foreground"}`}
                        >
                            Patients Directory (Clinical Records)
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("customers")}
                            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all ${activeTab === "customers" ? "border-blue-600 text-blue-600" : "border-transparent text-foreground/60 hover:text-foreground"}`}
                        >
                            Customers Directory (Account Holders)
                        </button>
                    </div>
                </div>

                {/* Database Table */}
                <div className="flex-1 overflow-hidden p-8">
                    <div className="h-full rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22] overflow-auto thin-scrollbar">
                        {activeTab === "patients" ? (
                            <table className="w-full text-left text-sm text-foreground">
                                <thead className="border-b border-black/[.15] bg-black/[.02] text-xs uppercase text-foreground/60 dark:border-white/[.22] dark:bg-white/[.02]">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Patient Info</th>
                                        <th className="px-6 py-4 font-medium">Account / Customer</th>
                                        <th className="px-6 py-4 font-medium">Contact Details</th>
                                        <th className="px-6 py-4 font-medium">Patient Code</th>
                                        <th className="px-6 py-4 text-right font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/[.08] dark:divide-white/[.145]">
                                    {patients.map((patient) => (
                                        <tr
                                            key={patient.id}
                                            onClick={() => router.push(`/dashboard/patients/${patient.rawId || patient.id}`)}
                                            className="cursor-pointer transition-colors hover:bg-black/[.04] dark:hover:bg-white/[.04]"
                                        >
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-sm">
                                                        {getInitials(patient.name)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-foreground">{patient.name}</span>
                                                        <span className="text-xs text-foreground/50">DOB: {patient.dob || 'N/A'} • Gender: {patient.gender || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className="text-xs font-semibold text-foreground/80 bg-black/[.04] dark:bg-white/[.06] px-2.5 py-1 rounded-md">
                                                    {patient.customerName || 'Account Holder'}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="flex items-center gap-1 text-xs text-foreground/80"><Phone className="h-3 w-3" /> {patient.phone || 'N/A'}</span>
                                                    <span className="flex items-center gap-1 text-xs text-foreground/80"><Mail className="h-3 w-3" /> {patient.email || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-blue-600 font-mono text-xs font-bold">
                                                {patient.id}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right">
                                                <ChevronRight className="ml-auto h-4 w-4 text-foreground/40" />
                                            </td>
                                        </tr>
                                    ))}
                                    {patients.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-foreground/50">No patients found matching your search.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <table className="w-full text-left text-sm text-foreground">
                                <thead className="border-b border-black/[.15] bg-black/[.02] text-xs uppercase text-foreground/60 dark:border-white/[.22] dark:bg-white/[.02]">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Customer Account Holder</th>
                                        <th className="px-6 py-4 font-medium">Contact Details</th>
                                        <th className="px-6 py-4 font-medium">Patients Registered</th>
                                        <th className="px-6 py-4 font-medium">Customer Code</th>
                                        <th className="px-6 py-4 text-right font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/[.08] dark:divide-white/[.145]">
                                    {customers.map((cust) => (
                                        <tr
                                            key={cust.id}
                                            onClick={() => router.push(`/dashboard/customers/${cust.rawId || cust.id}`)}
                                            className="cursor-pointer transition-colors hover:bg-black/[.04] dark:hover:bg-white/[.04]"
                                        >
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-sm">
                                                        {getInitials(cust.name)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-foreground">{cust.name}</span>
                                                        <span className="text-xs text-foreground/50">{cust.address || 'London, UK'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="flex items-center gap-1 text-xs text-foreground/80"><Phone className="h-3 w-3" /> {cust.phone || 'N/A'}</span>
                                                    <span className="flex items-center gap-1 text-xs text-foreground/80"><Mail className="h-3 w-3" /> {cust.email || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                                        {cust.patientsCount || 0} Patient(s)
                                                    </span>
                                                    {cust.patientsList && cust.patientsList.length > 0 && (
                                                        <span className="text-xs text-foreground/60 max-w-[200px] truncate">
                                                            ({cust.patientsList.join(', ')})
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-blue-600 font-mono text-xs font-bold">
                                                {cust.id}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right">
                                                <ChevronRight className="ml-auto h-4 w-4 text-foreground/40" />
                                            </td>
                                        </tr>
                                    ))}
                                    {customers.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-foreground/50">No customer account holders found matching your search.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}