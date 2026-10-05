"use client";

import { useState, useEffect } from "react";
import {
    Clock,
    Calendar,
    ShieldAlert,
    PoundSterling,
    Ban,
    Save,
    AlertTriangle,
    Trash2,
    Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSettings() {
    // DEMONSTRATION ONLY: Mock role loadable from localStorage/Context
    const [userRole, setUserRole] = useState<"super_admin" | "administrator" | "reception" | "clinician">("reception");

    const [depositAmounts, setDepositAmounts] = useState("£50.00 standard deposit for booking. Special scans require 50% deposit.");
    const [paymentRules, setPaymentRules] = useState("- All card transactions are subject to a 1.5% fee.\n- Corporate bookings must be paid in full 7 days prior.\n- Cash payments are only accepted at the main reception.");
    const [refundPolicies, setRefundPolicies] = useState("- No refund for cancellations made within 24 hours.\n- Refund processing takes 5-7 business days.\n- Partial refunds are issued as clinic credits.");

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole") as "super_admin" | "administrator" | "reception" | "clinician" | null;
        if (storedRole) {
            setUserRole(storedRole);
        }

        const storedDeposits = localStorage.getItem("settings_deposits_text");
        if (storedDeposits) setDepositAmounts(storedDeposits);

        const storedRules = localStorage.getItem("settings_rules_text");
        if (storedRules) setPaymentRules(storedRules);

        const storedPolicies = localStorage.getItem("settings_policies_text");
        if (storedPolicies) setRefundPolicies(storedPolicies);
    }, []);

    // Security layer: Block clinical staff from global CRM (They use /patients/clinical)
    if (userRole === "clinician") {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
                <ShieldAlert className="mb-4 h-12 w-12 text-zinc-400" />
                <h1 className="text-2xl font-bold text-foreground">Access Restricted</h1>
                <p className="mt-2 text-foreground/60">
                    Clinical staff must access patient charts directly through their scheduled queue.
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-4xl p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">Clinic Settings</h1>
                <p className="mt-1 text-sm text-foreground/80">Configure global clinic operations, booking rules, and financial policies.</p>
            </div>

            <div className="grid gap-8">

                {/* Section: Clinic Operations */}
                <section className="rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-6 dark:border-white/[.22] dark:bg-zinc-900">
                    <div className="mb-6 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-foreground/75" />
                        <h2 className="text-lg font-semibold text-foreground">Clinic Operations</h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Row 1 */}
                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/85">Opening Hours</label>
                            <div className="flex gap-2">
                                <input type="time" defaultValue="09:00" className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]" />
                                <span className="flex items-center text-foreground/75">to</span>
                                <input type="time" defaultValue="17:00" className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]" />
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/85">Public Holidays</label>
                            <input type="text" placeholder="e.g. 25 Dec, 01 Jan" className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]" />
                        </div>
                    </div>
                </section>

                {/* Section: Appointment Rules */}
                <section className="rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-6 dark:border-white/[.22] dark:bg-zinc-900">
                    <div className="mb-6 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-foreground/75" />
                        <h2 className="text-lg font-semibold text-foreground">Appointment Rules</h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {/* <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/85">Advance Booking Limit</label>
                            <input type="number" defaultValue={30} className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]" />
                            <p className="mt-1.5 text-xs font-medium text-foreground/75">Days in advance</p>
                        </div> */}

                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/85">Same-Day Booking</label>
                            <select className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22] cursor-pointer">
                                <option>Allowed (Up to 2 hrs before)</option>
                                <option>Disabled</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/85">Cancellation Deadline</label>
                            <input type="number" defaultValue={24} className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]" />
                            <p className="mt-1.5 text-xs font-medium text-foreground/75">Hours before appointment</p>
                        </div>
                    </div>
                </section>

                {/* Section: Policy Editors */}
                <section className="rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-6 dark:border-white/[.22] dark:bg-zinc-900">
                    <div className="mb-6 flex items-center gap-2">
                        <PoundSterling className="h-5 w-5 text-foreground/75" />
                        <h2 className="text-lg font-semibold text-foreground">Financial Policy Editors</h2>
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* Deposit Amounts Editor */}
                        <div className="space-y-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-foreground/85">Deposit Amounts</label>
                            <textarea
                                value={depositAmounts}
                                onChange={(e) => setDepositAmounts(e.target.value)}
                                placeholder="Configure deposit amount rules..."
                                rows={4}
                                className="w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 p-3 text-sm font-medium leading-relaxed text-foreground focus:border-brand focus:outline-none dark:border-white/[.22] resize-y thin-scrollbar"
                            />
                        </div>

                        {/* Payment Rules Editor */}
                        <div className="space-y-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-foreground/85">Payment Rules</label>
                            <textarea
                                value={paymentRules}
                                onChange={(e) => setPaymentRules(e.target.value)}
                                placeholder="Configure global payment rules..."
                                rows={4}
                                className="w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 p-3 text-sm font-medium leading-relaxed text-foreground focus:border-brand focus:outline-none dark:border-white/[.22] resize-y thin-scrollbar"
                            />
                        </div>

                        {/* Refund Policies Editor */}
                        <div className="space-y-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-foreground/85">Refund Policies</label>
                            <textarea
                                value={refundPolicies}
                                onChange={(e) => setRefundPolicies(e.target.value)}
                                placeholder="Configure clinic refund policies..."
                                rows={4}
                                className="w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 p-3 text-sm font-medium leading-relaxed text-foreground focus:border-brand focus:outline-none dark:border-white/[.22] resize-y thin-scrollbar"
                            />
                        </div>
                    </div>
                </section>

                <div className="flex justify-end">
                    <Button
                        variant="filled"
                        icon={Save}
                        onClick={() => {
                            localStorage.setItem("settings_deposits_text", depositAmounts);
                            localStorage.setItem("settings_rules_text", paymentRules);
                            localStorage.setItem("settings_policies_text", refundPolicies);
                            alert("Configuration saved successfully!");
                        }}
                    >
                        Save Configuration
                    </Button>
                </div>

            </div>
        </div>
    );
}
