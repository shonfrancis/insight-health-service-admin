"use client";

import { useState } from "react";
import {
    FileText,
    Plus,
    Settings2,
    Package,
    MoreVertical,
    ShieldCheck,
    Edit2,
    Trash2
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function FormManagement() {
    // DEMONSTRATION ONLY: Role Check
    const userRole: "super_admin" | "administrator" | "reception" | "clinician" = "administrator";

    const [activeTab, setActiveTab] = useState<"forms" | "packages">("forms");

    // Mock Data
    const forms = [
        { id: "F-001", title: "Standard Patient Registration", status: "Active", responses: 142 },
        { id: "F-002", title: "4D Scan Consent Form", status: "Active", responses: 89 },
        { id: "F-003", title: "Medical History Questionnaire", status: "Active", responses: 210 },
    ];

    const packages = [
        { id: "P-001", name: "Pregnancy Journey Bundle", services: 4, price: 500, type: "Bundle" },
        { id: "P-002", name: "Annual Membership", services: 12, price: 1200, type: "Subscription" },
    ];

    return (
        <div className="flex h-full w-full flex-col p-8 bg-transparent">

            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground">Form & Bundle Manager</h1>
                    <p className="mt-1 text-sm text-foreground/60">Configure digital intake forms and service bundles.</p>
                </div>
                <Button variant="filled" icon={Plus}>
                    Create New {activeTab === "forms" ? "Form" : "Package"}
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-black/[.15] dark:border-white/[.22] mb-6">
                <button
                    onClick={() => setActiveTab("forms")}
                    className={`pb-3 text-sm font-semibold border-b-2 ${activeTab === "forms" ? "border-brand text-brand" : "border-transparent text-foreground/50"}`}
                >
                    Digital Forms
                </button>
                <button
                    onClick={() => setActiveTab("packages")}
                    className={`pb-3 text-sm font-semibold border-b-2 ${activeTab === "packages" ? "border-brand text-brand" : "border-transparent text-foreground/50"}`}
                >
                    Packages & Memberships
                </button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab === "forms" ? (
                    forms.map((form) => (
                        <div key={form.id} className="rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-6 dark:border-white/[.22] dark:bg-zinc-900 flex items-start justify-between">
                            <div className="flex gap-4">
                                <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg text-blue-600 dark:text-blue-400">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">{form.title}</h3>
                                    <p className="text-xs text-foreground/50">{form.responses} responses collected</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="xs" icon={MoreVertical} className="text-foreground/40 hover:text-foreground" />
                        </div>
                    ))
                ) : (
                    packages.map((pkg) => (
                        <div key={pkg.id} className="rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-6 dark:border-white/[.22] dark:bg-zinc-900 flex items-start justify-between">
                            <div className="flex gap-4">
                                <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg text-purple-600 dark:text-purple-400">
                                    <Package className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">{pkg.name}</h3>
                                    <p className="text-xs text-foreground/50">{pkg.services} included services</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="xs" icon={MoreVertical} className="text-foreground/40 hover:text-foreground" />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
