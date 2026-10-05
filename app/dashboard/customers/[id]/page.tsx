"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    User,
    Mail,
    Phone,
    MapPin,
    Users,
    ChevronRight,
    Check,
    AlertCircle
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/components/ui/toast";

export default function CustomerDetailPage() {
    const toast = useToast();
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [customer, setCustomer] = useState<any>(null);
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<"details" | "patients">("details");

    // Form fields
    const [editTitle, setEditTitle] = useState("");
    const [editFirstName, setEditFirstName] = useState("");
    const [editLastName, setEditLastName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [editDob, setEditDob] = useState("");
    const [editGender, setEditGender] = useState("");
    const [editAddressLine1, setEditAddressLine1] = useState("");
    const [editAddressLine2, setEditAddressLine2] = useState("");
    const [editCity, setEditCity] = useState("");
    const [editState, setEditState] = useState("");
    const [editZipCode, setEditZipCode] = useState("");
    const [editCountry, setEditCountry] = useState("");
    const [editStatus, setEditStatus] = useState("active");

    useEffect(() => {
        setLoading(true);
        apiClient(`/customers/${id}`)
            .then((res) => {
                if (res.data) {
                    const c = res.data;
                    setCustomer(c);
                    setPatients(c.patients || []);
                    setEditTitle(c.title || '');
                    setEditFirstName(c.first_name || '');
                    setEditLastName(c.last_name || '');
                    setEditEmail(c.email || '');
                    setEditPhone(c.phone || '');
                    setEditDob(c.dob || '');
                    setEditGender(c.gender || 'Female');
                    setEditAddressLine1(c.address_line_1 || '');
                    setEditAddressLine2(c.address_line_2 || '');
                    setEditCity(c.city || '');
                    setEditState(c.state || '');
                    setEditZipCode(c.zip_code || '');
                    setEditCountry(c.country || 'United Kingdom');
                    setEditStatus(c.status || 'active');
                }
            })
            .catch((err) => {
                console.error("Failed to load customer profile:", err.message);
                toast.error("Error", "Could not load customer account details.");
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleUpdateCustomer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customer) return;
        setIsSaving(true);

        try {
            await apiClient(`/customers/${customer.rawId || customer.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    title: editTitle,
                    first_name: editFirstName,
                    last_name: editLastName,
                    email: editEmail,
                    phone: editPhone,
                    dob: editDob,
                    gender: editGender,
                    address_line_1: editAddressLine1,
                    address_line_2: editAddressLine2,
                    city: editCity,
                    state: editState,
                    zip_code: editZipCode,
                    country: editCountry,
                    status: editStatus,
                })
            });

            const fullName = `${editTitle ? editTitle + ' ' : ''}${editFirstName} ${editLastName}`.trim();
            setCustomer({
                ...customer,
                name: fullName,
                email: editEmail,
                phone: editPhone,
            });

            toast.success("Account Saved", `Updated account holder details for ${fullName}.`);
        } catch (err: any) {
            console.error("Failed to update customer:", err.message);
            toast.error("Update Error", err.message || "Failed to update customer account.");
        } finally {
            setIsSaving(false);
        }
    };

    const getInitials = (name: string) => {
        if (!name) return "C";
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    if (loading) {
        return (
            <div className="flex h-full w-full items-center justify-center p-8 text-foreground/50">
                Loading customer account profile...
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
                <AlertCircle className="mb-4 h-12 w-12 text-zinc-400" />
                <h1 className="text-xl font-bold text-foreground">Customer Not Found</h1>
                <p className="mt-1 text-sm text-foreground/60">No account record matched this request.</p>
                <Button className="mt-4" variant="outline" onClick={() => router.push("/dashboard/patients")}>
                    Back to Directory
                </Button>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-black/[.15] p-8 dark:border-white/[.22]">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push("/dashboard/patients")}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[.15] bg-white text-foreground hover:bg-black/[.04] dark:border-white/[.22] dark:bg-zinc-900 dark:hover:bg-white/[.04] transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xl">
                            {getInitials(customer.name)}
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">{customer.name}</h1>
                                <span className="rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-3 py-0.5 text-xs font-bold font-mono">
                                    {customer.id}
                                </span>
                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${editStatus === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400'}`}>
                                    {editStatus === 'active' ? 'Active Customer Account' : 'Inactive'}
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-foreground/60">
                                Customer Account Holder • Registered Patients: {patients.length} • {customer.email}
                            </p>
                        </div>
                    </div>
                </div>

                <Button variant="filled" icon={Users} onClick={() => router.push("/dashboard/appointments/new")}>
                    + Schedule Appointment
                </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-auto p-8 thin-scrollbar">
                <div className="mx-auto max-w-5xl space-y-8">
                    {/* Tabs Navigation */}
                    <div className="flex text-sm font-bold border-b border-black/[.15] dark:border-white/[.22] mb-6">
                        <button
                            onClick={() => setActiveTab("details")}
                            className={`mr-6 border-b-2 pb-3 transition-colors ${activeTab === "details" ? "border-blue-600 text-blue-600 dark:text-white" : "border-transparent text-foreground/70 hover:text-foreground/90"}`}
                        >
                            Account Holder Details
                        </button>
                        <button
                            onClick={() => setActiveTab("patients")}
                            className={`mr-6 border-b-2 pb-3 transition-colors ${activeTab === "patients" ? "border-blue-600 text-blue-600 dark:text-white" : "border-transparent text-foreground/70 hover:text-foreground/90"}`}
                        >
                            Registered Dependent Patients ({patients.length})
                        </button>
                    </div>

                    {/* ACCOUNT HOLDER DETAILS TAB */}
                    {activeTab === "details" && (
                        <form onSubmit={handleUpdateCustomer} className="space-y-6 animate-in fade-in">
                            <div className="space-y-4 rounded-xl border border-black/[.15] dark:border-white/[.22] p-6 bg-white dark:bg-zinc-900">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-2">
                                    <User className="h-4 w-4 text-blue-600" /> Account Holder Profile
                                </h3>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                                    <div className="sm:col-span-1">
                                        <label className="mb-1 block text-xs font-semibold text-foreground">Title</label>
                                        <select
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22]"
                                        >
                                            <option value="">Select</option>
                                            <option value="Mrs">Mrs</option>
                                            <option value="Mr">Mr</option>
                                            <option value="Ms">Ms</option>
                                            <option value="Miss">Miss</option>
                                            <option value="Dr">Dr</option>
                                        </select>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <label className="mb-1 block text-xs font-semibold text-foreground">First Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={editFirstName}
                                            onChange={(e) => setEditFirstName(e.target.value)}
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22]"
                                        />
                                    </div>
                                    <div className="sm:col-span-1">
                                        <label className="mb-1 block text-xs font-semibold text-foreground">Last Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={editLastName}
                                            onChange={(e) => setEditLastName(e.target.value)}
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22]"
                                        />
                                    </div>
                                    <div className="sm:col-span-1">
                                        <label className="mb-1 block text-xs font-semibold text-foreground">Account Status</label>
                                        <select
                                            value={editStatus}
                                            onChange={(e) => setEditStatus(e.target.value)}
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22]"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-foreground">Email Address *</label>
                                        <input
                                            type="email"
                                            required
                                            value={editEmail}
                                            onChange={(e) => setEditEmail(e.target.value)}
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22]"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-foreground">Phone Number</label>
                                        <input
                                            type="text"
                                            value={editPhone}
                                            onChange={(e) => setEditPhone(e.target.value)}
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address Details */}
                            <div className="space-y-4 rounded-xl border border-black/[.15] dark:border-white/[.22] p-6 bg-white dark:bg-zinc-900">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-blue-600" /> Account Holder Address
                                </h3>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-foreground">Address Line 1</label>
                                        <input
                                            type="text"
                                            value={editAddressLine1}
                                            onChange={(e) => setEditAddressLine1(e.target.value)}
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22]"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-foreground">Address Line 2</label>
                                        <input
                                            type="text"
                                            value={editAddressLine2}
                                            onChange={(e) => setEditAddressLine2(e.target.value)}
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-foreground">City</label>
                                        <input
                                            type="text"
                                            value={editCity}
                                            onChange={(e) => setEditCity(e.target.value)}
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22]"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-foreground">Zip Code</label>
                                        <input
                                            type="text"
                                            value={editZipCode}
                                            onChange={(e) => setEditZipCode(e.target.value)}
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22]"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-foreground">Country</label>
                                        <input
                                            type="text"
                                            value={editCountry}
                                            onChange={(e) => setEditCountry(e.target.value)}
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" variant="filled" disabled={isSaving}>
                                    {isSaving ? "Saving..." : "Save Account Changes"}
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* REGISTERED DEPENDENT PATIENTS TAB */}
                    {activeTab === "patients" && (
                        <div className="space-y-4 animate-in fade-in">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-foreground">Patients Registered under {customer.name}</h3>
                                    <p className="text-xs text-foreground/60">Click any patient to open their detailed clinical profile, medical records, and appointment history.</p>
                                </div>
                            </div>

                            <div className="rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22] overflow-hidden">
                                <table className="w-full text-left text-sm text-foreground">
                                    <thead className="border-b border-black/[.15] bg-black/[.02] text-xs uppercase text-foreground/60 dark:border-white/[.22] dark:bg-white/[.02]">
                                        <tr>
                                            <th className="px-6 py-4 font-medium">Patient Code</th>
                                            <th className="px-6 py-4 font-medium">Patient Name</th>
                                            <th className="px-6 py-4 font-medium">DOB & Gender</th>
                                            <th className="px-6 py-4 font-medium">Contact</th>
                                            <th className="px-6 py-4 text-right font-medium">Clinical Profile</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black/[.08] dark:divide-white/[.145]">
                                        {patients.map((p) => (
                                            <tr
                                                key={p.id}
                                                className="cursor-pointer transition-colors hover:bg-black/[.04] dark:hover:bg-white/[.04]"
                                                onClick={() => router.push(`/dashboard/patients/${p.rawId || p.id}`)}
                                            >
                                                <td className="whitespace-nowrap px-6 py-4 font-mono text-xs font-bold text-blue-600">
                                                    {p.patient_code || p.id}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 font-bold text-foreground">
                                                    {p.name}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-xs text-foreground/80">
                                                    DOB: {p.dob || 'N/A'} • {p.gender || 'Other'}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-xs text-foreground/80">
                                                    {p.email || p.phone || 'N/A'}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(`/dashboard/patients/${p.rawId || p.id}`);
                                                        }}
                                                    >
                                                        View Full Clinical Profile <ChevronRight className="ml-1 h-3.5 w-3.5" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {patients.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="py-12 text-center text-foreground/50">
                                                    No registered patients under this account holder.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
