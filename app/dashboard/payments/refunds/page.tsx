"use client";

import { useState, useMemo, useEffect } from "react";
import {
    Search,
    ShieldAlert,
    Undo2,
    PoundSterling,
    ReceiptText,
    AlertCircle,
    X,
    CheckCircle2,
    Lock,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DetailDrawer } from "@/components/ui/detail-drawer";

// Mock Transaction Data Structure for Refunds
interface RefundableTransaction {
    id: string;
    patientName: string;
    service: string;
    date: string;
    originalAmount: number;
    refundableAmount: number; // What is left to refund
    status: "Eligible" | "Partial Refunded" | "Fully Refunded";
}

export default function RefundManagement() {
    // DEMONSTRATION ONLY: Mock role
    const [userRole, setUserRole] = useState<"super_admin" | "administrator" | "reception" | "clinician">("reception");

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole") as "super_admin" | "administrator" | "reception" | "clinician" | null;
        if (storedRole) {
            setUserRole(storedRole);
        }

        if (typeof window !== "undefined") {
            const query = new URLSearchParams(window.location.search).get("search");
            if (query) {
                setSearchQuery(query);
            }
        }
    }, []);

    // Mock Database of paid transactions
    const [transactions, setTransactions] = useState<RefundableTransaction[]>([
        { id: "TXN-9021", patientName: "Eleanor Vance", service: "4D/5D Baby Scan", date: "2026-07-08", originalAmount: 150, refundableAmount: 150, status: "Eligible" },
        { id: "TXN-9015", patientName: "James Holden", service: "Well Woman Scan", date: "2026-07-07", originalAmount: 120, refundableAmount: 70, status: "Partial Refunded" },
        { id: "TXN-8842", patientName: "Amos Burton", service: "NIPT Blood Test", date: "2026-07-02", originalAmount: 350, refundableAmount: 0, status: "Fully Refunded" },
        { id: "TXN-9010", patientName: "Naomi Nagata", service: "Growth Scan", date: "2026-07-06", originalAmount: 95, refundableAmount: 95, status: "Eligible" },
    ]);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTxn, setSelectedTxn] = useState<RefundableTransaction | null>(null);
    const [refundType, setRefundType] = useState<"full" | "partial">("full");
    const [customAmount, setCustomAmount] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    const filteredTransactions = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return transactions.filter(t =>
            t.patientName.toLowerCase().includes(q) ||
            t.id.toLowerCase().includes(q)
        );
    }, [searchQuery, transactions]);

    // Security Layer: Hard lock for operational and clinical staff
    if (userRole !== "super_admin" && userRole !== "administrator") {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-white dark:bg-zinc-900">
                <ShieldAlert className="mb-4 h-12 w-12 text-zinc-" />
                <h1 className="text-2xl font-bold text-foreground">Restricted Authorization</h1>
                <p className="mt-2 text-foreground/60">
                    Only Administrators possess the cryptographic clearance to authorize revenue refunds.
                </p>
            </div>
        );
    }

    const handleAuthorizeRefund = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate API Authorization Delay
        setTimeout(() => {
            setIsProcessing(false);
            alert(`Refund authorized and recorded in the ledger for ${selectedTxn?.id}.`);
            setSelectedTxn(null);
        }, 1500);
    };

    return (
        <div className="flex h-full w-full overflow-hidden">

            {/* Left Pane: Transaction Search & Grid */}
            <div className={`flex flex-col transition-all duration-300 ease-in-out ${selectedTxn ? "w-2/3 border-r border-black/[.15] dark:border-white/[.22]" : "w-full"}`}>

                {/* Header Block */}
                <div className="flex flex-col gap-6 border-b border-black/[.15] p-8 dark:border-white/[.22]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Refund Controls</h1>
                            <p className="mt-1 text-sm text-foreground/60">Authorize and record manual transaction reversals.</p>
                        </div>
                        {/* <div className="flex items-center gap-2 rounded-full border border-zinc- bg-zinc- px-3 py-1.5 text-xs font-bold text-zinc- dark:border-zinc-/30 dark:bg-zinc-/20 dark:text-zinc-">
                            <ShieldAlert className="h-4 w-4" />
                            Admin Secured
                        </div> */}
                    </div>

                    <div className="relative mt-2 flex w-full max-w-lg items-center">
                        <Search className="absolute left-3 h-4 w-4 text-foreground/40" />
                        <input
                            type="text"
                            placeholder="Search by Patient Name or TXN ID to initiate refund..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-12 w-full rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 pl-9 pr-4 text-sm text-foreground focus:border-zinc- focus:outline-none focus:ring-1 focus:ring-zinc- dark:border-white/[.22]"
                        />
                    </div>
                </div>

                {/* Audit Table */}
                <div className="flex-1 overflow-hidden bg-white dark:bg-zinc-900 p-8">
                    <div className="h-full rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22] overflow-auto thin-scrollbar">
                        <table className="w-full text-left text-sm text-foreground">
                            <thead className="border-b border-black/[.15] bg-black/[.02] text-xs uppercase text-foreground/60 dark:border-white/[.22] dark:bg-white/[.02]">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Transaction ID & Patient</th>
                                    <th className="px-6 py-4 font-medium">Date & Service</th>
                                    <th className="px-6 py-4 font-medium">Original Amount</th>
                                    <th className="px-6 py-4 font-medium">Eligibility Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/[.08] dark:divide-white/[.145]">
                                {filteredTransactions.map((txn) => (
                                    <tr
                                        key={txn.id}
                                        onClick={() => txn.refundableAmount > 0 && setSelectedTxn(txn)}
                                        className={`transition-colors ${txn.refundableAmount > 0 ? "cursor-pointer hover:bg-black/[.04] dark:hover:bg-white/[.04]" : "opacity-60"} ${selectedTxn?.id === txn.id ? "bg-zinc-/50 dark:bg-zinc-/10" : ""}`}
                                    >
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs">
                                                    {getInitials(txn.patientName)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-mono text-xs font-semibold text-foreground/60">{txn.id}</span>
                                                    <span className="font-bold text-foreground">{txn.patientName}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-foreground/80">{txn.date}</span>
                                                <span className="text-xs text-foreground/50">{txn.service}</span>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-foreground">
                                            £{txn.originalAmount.toFixed(2)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${txn.status === "Eligible" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                                                txn.status === "Partial Refunded" ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" :
                                                    "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                                                }`}>
                                                {txn.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Right Pane: Authorization Terminal */}
            {selectedTxn && (
                <DetailDrawer
                    onClose={() => setSelectedTxn(null)}
                    title="Authorization Terminal"
                    subtitle={<span className="font-mono">{selectedTxn.id}</span>}
                    className="border-l-4 border-l-zinc-"
                >
                    <form onSubmit={handleAuthorizeRefund} className="flex flex-col gap-8">

                        {/* Financial Context */}
                        <div className="rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-6 dark:border-white/[.22] dark:bg-zinc-900">
                            <div className="mb-4 flex items-center gap-2">
                                <ReceiptText className="h-4 w-4 text-foreground/50" />
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/50">Transaction Ledger</h3>
                            </div>
                            <div className="flex justify-between border-b border-black/[.04] pb-3 text-sm dark:border-white/[.04]">
                                <span className="text-foreground/70">Original Payment</span>
                                <span className="font-medium text-foreground">£{selectedTxn.originalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between pt-3 text-sm">
                                <span className="font-bold text-foreground">Available to Refund</span>
                                <span className="font-bold text-green-600 dark:text-green-500">£{selectedTxn.refundableAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* SRS Requirement: Full or Partial Decision */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/50">Select Refund Type</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRefundType("full")}
                                    className={`flex flex-col items-start gap-1 rounded-lg border p-4 transition-all ${refundType === "full" ? "border-zinc- bg-zinc- dark:bg-zinc-/20" : "border-black/[.15] bg-white dark:bg-zinc-900 hover:border-black/[.2] dark:border-white/[.22]"}`}
                                >
                                    <span className={`text-sm font-bold ${refundType === "full" ? "text-zinc- dark:text-zinc-" : "text-foreground"}`}>Full Refund</span>
                                    <span className="text-xs text-foreground/60">£{selectedTxn.refundableAmount.toFixed(2)}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRefundType("partial")}
                                    className={`flex flex-col items-start gap-1 rounded-lg border p-4 transition-all ${refundType === "partial" ? "border-zinc- bg-zinc- dark:bg-zinc-/20" : "border-black/[.15] bg-white dark:bg-zinc-900 hover:border-black/[.2] dark:border-white/[.22]"}`}
                                >
                                    <span className={`text-sm font-bold ${refundType === "partial" ? "text-zinc- dark:text-zinc-" : "text-foreground"}`}>Partial Refund</span>
                                    <span className="text-xs text-foreground/60">Custom Amount</span>
                                </button>
                            </div>
                        </div>

                        {/* Custom Amount Field (Reveals on Partial) */}
                        {refundType === "partial" && (
                            <div className="animate-in slide-in-from-top-2 fade-in">
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/50">Amount to Refund</label>
                                <div className="relative">
                                    <PoundSterling className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                                    <input
                                        type="number"
                                        max={selectedTxn.refundableAmount}
                                        value={customAmount}
                                        onChange={(e) => setCustomAmount(e.target.value)}
                                        placeholder="0.00"
                                        required
                                        className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 pl-9 pr-3 text-sm text-foreground focus:border-zinc- focus:outline-none focus:ring-1 focus:ring-zinc- dark:border-white/[.22]"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Accountability / Reason Logging */}
                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/50">Reason for Refund (Required)</label>
                            <textarea
                                required
                                rows={3}
                                placeholder="Log reason for financial audit..."
                                className="w-full resize-none rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 p-3 text-sm text-foreground focus:border-zinc- focus:outline-none focus:ring-1 focus:ring-zinc- dark:border-white/[.22]"
                            />
                        </div>

                        {/* Submit Block */}
                        <div className="mt-4 flex flex-col gap-4">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="mt-0.5 h-4 w-4 text-foreground/70" />
                                <p className="text-xs text-foreground/70">
                                    This action is irreversible. It will deduct from today's net collected revenue report.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                variant="outline"
                                loading={isProcessing}
                                icon={Lock}
                                className="w-full py-3 text-sm font-bold"
                            >
                                Authorize & Process
                            </Button>
                        </div>

                    </form>
                </DetailDrawer>
            )}
        </div>
    );
}
