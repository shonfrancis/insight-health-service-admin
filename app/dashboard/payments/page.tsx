"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DetailDrawer } from "@/components/ui/detail-drawer";
import {
    Search,
    Filter,
    CreditCard,
    PoundSterling,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    ShieldAlert,
    X,
    Undo2,
    CheckCircle2,
    Receipt
} from "lucide-react";

// SRS Payment Data Structure
type PaymentStatus = "Paid" | "Partial" | "Unpaid" | "Refunded";

interface Transaction {
    id: string;
    patientName: string;
    appointmentRef: string;
    service: string;
    date: string;
    amountDue: number;
    amountPaid: number;
    outstandingBalance: number;
    status: PaymentStatus;
    refundHistory: number; // Amount refunded, if any
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

export default function FinancialLedger() {
    const router = useRouter();
    // DEMONSTRATION ONLY: Mock role
    const [userRole, setUserRole] = useState<"super_admin" | "administrator" | "reception" | "clinician">("reception");

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole") as "super_admin" | "administrator" | "reception" | "clinician" | null;
        if (storedRole) {
            setUserRole(storedRole);
        }
    }, []);

    // Security layer: Block clinical staff entirely


    // Mock Database based on SRS requirements
    const [transactions, setTransactions] = useState<Transaction[]>([
        { id: "TXN-9021", patientName: "Eleanor Vance", appointmentRef: "APT-201", service: "4D/5D Baby Scan", date: "2026-07-08", amountDue: 150, amountPaid: 150, outstandingBalance: 0, status: "Paid", refundHistory: 0 },
        { id: "TXN-9022", patientName: "James Holden", appointmentRef: "APT-202", service: "Well Woman Scan", date: "2026-07-08", amountDue: 120, amountPaid: 50, outstandingBalance: 70, status: "Partial", refundHistory: 0 },
        { id: "TXN-9023", patientName: "Naomi Nagata", appointmentRef: "APT-203", service: "Growth Scan", date: "2026-07-09", amountDue: 95, amountPaid: 0, outstandingBalance: 95, status: "Unpaid", refundHistory: 0 },
        { id: "TXN-9018", patientName: "Amos Burton", appointmentRef: "APT-199", service: "NIPT Blood Test", date: "2026-07-05", amountDue: 350, amountPaid: 350, outstandingBalance: 0, status: "Refunded", refundHistory: 350 },
    ]);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

    const [showNewTxnForm, setShowNewTxnForm] = useState(false);
    const [newTxnPatient, setNewTxnPatient] = useState("");
    const [newTxnApptRef, setNewTxnApptRef] = useState("");
    const [newTxnCategory, setNewTxnCategory] = useState("Pregnancy Scans");
    const [newTxnService, setNewTxnService] = useState("Early Pregnancy Scan");
    const [newTxnAmountDue, setNewTxnAmountDue] = useState("80");
    const [newTxnAmountPaid, setNewTxnAmountPaid] = useState("0");
    const [newTxnStatus, setNewTxnStatus] = useState<PaymentStatus>("Paid");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const search = params.get("search");
        if (search) {
            setSearchQuery(search);
        }

        const openNewForm = params.get("new");
        if (openNewForm === "true") {
            setShowNewTxnForm(true);
            const patientName = params.get("patientName");
            const appointmentRef = params.get("appointmentRef");
            const service = params.get("service");
            
            if (patientName) setNewTxnPatient(patientName);
            if (appointmentRef) setNewTxnApptRef(appointmentRef);
            if (service) {
                setNewTxnService(service);
                const matchedService = servicesData.find(s => s.name === service);
                if (matchedService) {
                    setNewTxnCategory(matchedService.category);
                    setNewTxnAmountDue(matchedService.price.toString());
                }
            }
        }
    }, []);

    const handleCategoryChange = (cat: string) => {
        setNewTxnCategory(cat);
        const filtered = servicesData.filter(s => s.category === cat);
        if (filtered.length > 0) {
            setNewTxnService(filtered[0].name);
            setNewTxnAmountDue(filtered[0].price.toString());
        }
    };

    const handleServiceChange = (serviceName: string) => {
        setNewTxnService(serviceName);
        const service = servicesData.find(s => s.name === serviceName);
        if (service) {
            setNewTxnAmountDue(service.price.toString());
        }
    };

    const handleCreateTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        const due = parseFloat(newTxnAmountDue) || 0;
        const paid = parseFloat(newTxnAmountPaid) || 0;
        const outstanding = Math.max(0, due - paid);
        
        const newTxn: Transaction = {
            id: "TXN-" + Math.floor(1000 + Math.random() * 9000),
            patientName: newTxnPatient,
            appointmentRef: newTxnApptRef || "N/A",
            service: newTxnService || "General Service",
            date: new Date().toISOString().split('T')[0],
            amountDue: due,
            amountPaid: paid,
            outstandingBalance: outstanding,
            status: newTxnStatus,
            refundHistory: 0
        };

        setTransactions([newTxn, ...transactions]);
        setShowNewTxnForm(false);

        // Reset fields
        setNewTxnPatient("");
        setNewTxnApptRef("");
        setNewTxnCategory("Pregnancy Scans");
        setNewTxnService("Early Pregnancy Scan");
        setNewTxnAmountDue("80");
        setNewTxnAmountPaid("0");
        setNewTxnStatus("Paid");
    };

    const filteredTransactions = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return transactions.filter(t =>
            t.patientName.toLowerCase().includes(q) ||
            t.id.toLowerCase().includes(q) ||
            t.appointmentRef.toLowerCase().includes(q)
        );
    }, [searchQuery, transactions]);

    const getStatusBadge = (status: PaymentStatus) => {
        switch (status) {
            case "Paid": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            case "Partial": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
            case "Unpaid": return "bg-zinc- text-zinc- dark:bg-zinc-/30 dark:text-zinc-";
            case "Refunded": return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400";
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

    // Metrics Calculations
    const totalRevenue = transactions.reduce((acc, curr) => acc + curr.amountPaid - curr.refundHistory, 0);
    const totalOutstanding = transactions.reduce((acc, curr) => acc + curr.outstandingBalance, 0);

    if (userRole === "clinician") {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-white dark:bg-zinc-900">
                <ShieldAlert className="mb-4 h-12 w-12 text-zinc-" />
                <h1 className="text-2xl font-bold text-foreground">Financial Lock</h1>
                <p className="mt-2 text-foreground/60">
                    Clinical personnel do not have clearance to view financial ledgers or process payments.
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full overflow-hidden">

            {/* Left Pane: Ledger Grid */}
            <div className={`flex flex-col transition-all duration-300 ease-in-out ${(selectedTxn || showNewTxnForm) ? "w-2/3 border-r border-black/[.15] dark:border-white/[.22]" : "w-full"}`}>

                {/* Header & Metrics */}
                <div className="flex flex-col gap-6 border-b border-black/[.15] p-8 dark:border-white/[.22]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Financial Ledger</h1>
                            <p className="mt-1 text-sm text-foreground/60">Process transactions, track balances, and manage refunds.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {(selectedTxn || showNewTxnForm) ? (
                                <Button
                                    variant="outline"
                                    icon={Search}
                                    onClick={() => {
                                        setSelectedTxn(null);
                                        setShowNewTxnForm(false);
                                    }}
                                    title="Open Search"
                                />
                            ) : (
                                <div className="relative flex items-center">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                                    <input
                                        type="text"
                                        placeholder="Search Patient or TXN ID..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="h-10 w-64 rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 pl-9 pr-4 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22]"
                                    />
                                </div>
                            )}
                             <Button variant="filled" icon={CreditCard} onClick={() => {
                                setSelectedTxn(null);
                                setNewTxnCategory("Pregnancy Scans");
                                setNewTxnService("Early Pregnancy Scan");
                                setNewTxnAmountDue("80");
                                setNewTxnAmountPaid("0");
                                setNewTxnStatus("Paid");
                                setShowNewTxnForm(true);
                            }}>
                                New Transaction
                            </Button>
                        </div>
                    </div>

                    {/* Quick Metrics Row */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex flex-col justify-between rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-5 dark:border-white/[.22] dark:bg-zinc-900">
                            <span className="text-xs font-bold uppercase tracking-wider text-foreground/50">Net Collected</span>
                            <span className="mt-2 text-2xl font-bold text-foreground">£{totalRevenue.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col justify-between rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-5 dark:border-white/[.22] dark:bg-zinc-900">
                            <span className="text-xs font-bold uppercase tracking-wider text-foreground/50">Outstanding</span>
                            <span className="mt-2 text-2xl font-semibold text-orange-600 dark:text-orange-500">£{totalOutstanding.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Ledger Table */}
                <div className="flex-1 overflow-hidden bg-white dark:bg-zinc-900 p-8">
                    <div className="h-full rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22] overflow-auto thin-scrollbar">
                        <table className="w-full text-left text-sm text-foreground">
                            <thead className="border-b border-black/[.15] bg-black/[.02] text-xs uppercase text-foreground/60 dark:border-white/[.22] dark:bg-white/[.02]">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Transaction Details</th>
                                    <th className="px-6 py-4 font-medium">Date & Ref</th>
                                    <th className="px-6 py-4 font-medium">Tracking (Due / Paid)</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/[.08] dark:divide-white/[.145]">
                                {filteredTransactions.map((txn) => (
                                    <tr
                                        key={txn.id}
                                        onClick={() => {
                                            setShowNewTxnForm(false);
                                            setSelectedTxn(txn);
                                        }}
                                        className={`cursor-pointer transition-colors hover:bg-black/[.04] dark:hover:bg-white/[.04] ${selectedTxn?.id === txn.id ? "bg-brand/5 dark:bg-brand/10" : ""}`}
                                    >
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs">
                                                    {getInitials(txn.patientName)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-foreground">{txn.patientName}</span>
                                                    <span className="text-xs text-foreground/50">{txn.service}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-foreground">{txn.date}</span>
                                                <span className="text-xs font-mono text-foreground/50">{txn.id}</span>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="flex items-center gap-1 text-xs font-medium text-foreground">
                                                    <PoundSterling className="h-3 w-3 opacity-50" /> {txn.amountDue.toFixed(2)} Due
                                                </span>
                                                <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-500">
                                                    <ArrowUpRight className="h-3 w-3" /> {txn.amountPaid.toFixed(2)} Paid
                                                </span>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(txn.status)}`}>
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

            {/* Right Pane: Cashier & Action Drawer */}
            {selectedTxn && (
                <DetailDrawer
                    onClose={() => setSelectedTxn(null)}
                    title="Cashier Terminal"
                    subtitle={<span className="font-mono">{selectedTxn.id}</span>}
                >
                    <div className="flex flex-col gap-6">

                        {/* Context Summary */}
                        <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-zinc-900 p-6 text-center dark:bg-zinc-900">
                            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-base">
                                {getInitials(selectedTxn.patientName)}
                            </div>
                            <h3 className="text-xl font-bold text-foreground">{selectedTxn.patientName}</h3>
                            <p className="text-sm font-medium text-foreground/60">{selectedTxn.service}</p>
                            <div className="mt-4 flex w-full justify-between border-t border-black/[.15] pt-4 dark:border-white/[.22]">
                                <div className="flex flex-col items-start">
                                    <span className="text-xs uppercase text-foreground/50">Total</span>
                                    <span className="font-semibold text-foreground">£{selectedTxn.amountDue.toFixed(2)}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs uppercase text-foreground/50">Outstanding</span>
                                    <span className={`font-bold ${selectedTxn.outstandingBalance > 0 ? 'text-orange-500' : 'text-green-500'}`}>
                                        £{selectedTxn.outstandingBalance.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <hr className="border-black/[.15] dark:border-white/[.22]" />

                        {/* Payment Processing (SRS Requirement: Full or Deposit) */}
                        {selectedTxn.outstandingBalance > 0 && (
                            <div className="flex flex-col gap-4">
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/50">Process Payment</h4>
                                <div className="space-y-3">
                                    <Button variant="outline" className="w-full h-auto p-4">
                                        <div className="w-full flex items-center justify-between">
                                            <div className="flex flex-col items-start">
                                                <span className="font-bold text-foreground">Full Balance</span>
                                                <span className="text-xs text-foreground/60">Pay remaining amount</span>
                                            </div>
                                            <span className="font-bold text-brand">£{selectedTxn.outstandingBalance.toFixed(2)}</span>
                                        </div>
                                    </Button>

                                    <Button variant="outline" className="w-full h-auto p-4">
                                        <div className="w-full flex items-center justify-between">
                                            <div className="flex flex-col items-start">
                                                <span className="font-bold text-foreground">Custom / Deposit</span>
                                                <span className="text-xs text-foreground/60">Process partial amount</span>
                                            </div>
                                            <CreditCard className="h-5 w-5 text-foreground/40" />
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        )}

                        {selectedTxn.outstandingBalance === 0 && selectedTxn.status !== "Refunded" && (
                            <div className="flex items-center justify-center gap-2 text-green-700 dark:border-green-900/30 dark:bg-green-950/20 dark:text-green-400">
                                <CheckCircle2 className="h-5 w-5" />
                                <span className="font-semibold">Balance Settled in Full</span>
                            </div>
                        )}

                        {/* Refund Management (SRS Requirement: Manual, Restricted to Admin) */}
                        {(userRole === "super_admin" || userRole === "administrator") && selectedTxn.amountPaid > 0 && (
                            <>
                                <hr className="border-black/[.15] dark:border-white/[.22]" />
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/50">Refund Controls</h4>
                                        <span title="Admin Restricted">
                                            <ShieldAlert className="h-4 w-4 text-foreground opacity-50" />
                                        </span>
                                    </div>
                                    <div className="space-y-3 rounded-lg border border-black/[.15] bg-white p-4 dark:border-white/[.22] dark:bg-zinc-900">
                                        <p className="text-xs font-medium leading-relaxed text-foreground/70">
                                            Record a manual refund. This adjusts the ledger and re-calculates total clinic revenue.
                                        </p>
                                        <div className="flex">
                                            <Button
                                                variant="filled"
                                                size="sm"
                                                className="w-full justify-center"
                                                icon={Undo2}
                                                onClick={() => router.push(`/dashboard/payments/refunds?search=${selectedTxn.id}`)}
                                            >
                                                Initiate Refund
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                    </div>
                </DetailDrawer>
            )}

            {/* New Transaction Form Drawer */}
            {showNewTxnForm && (
                <DetailDrawer
                    onClose={() => setShowNewTxnForm(false)}
                    title="Create Transaction"
                    subtitle="Record new payment / ledger entry"
                    className="md:!w-1/2 lg:!w-5/12"
                >
                    <form onSubmit={handleCreateTransaction} className="flex flex-col gap-5">
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-foreground">Patient Name</label>
                            <input
                                type="text"
                                required
                                value={newTxnPatient}
                                onChange={(e) => setNewTxnPatient(e.target.value)}
                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]"
                                placeholder="e.g. John Doe"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-foreground">Appointment Reference</label>
                            <input
                                type="text"
                                value={newTxnApptRef}
                                onChange={(e) => setNewTxnApptRef(e.target.value)}
                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]"
                                placeholder="e.g. APT-201"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-foreground">Service Category</label>
                            <select
                                value={newTxnCategory}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22] cursor-pointer"
                            >
                                <option value="Pregnancy Scans">Pregnancy Scans</option>
                                <option value="Blood Tests">Blood Tests</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-foreground">Service</label>
                            <select
                                value={newTxnService}
                                onChange={(e) => handleServiceChange(e.target.value)}
                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22] cursor-pointer"
                            >
                                {servicesData.filter(s => s.category === newTxnCategory).map(s => (
                                    <option key={s.id} value={s.name}>{s.name} (£{s.price})</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-foreground">Amount Due (£)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={newTxnAmountDue}
                                    onChange={(e) => setNewTxnAmountDue(e.target.value)}
                                    className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-foreground">Amount Paid (£)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={newTxnAmountPaid}
                                    onChange={(e) => setNewTxnAmountPaid(e.target.value)}
                                    className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-foreground">Status</label>
                            <select
                                value={newTxnStatus}
                                onChange={(e) => setNewTxnStatus(e.target.value as PaymentStatus)}
                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22] cursor-pointer"
                            >
                                <option value="Paid">Paid</option>
                                <option value="Partial">Partial</option>
                                <option value="Unpaid">Unpaid</option>
                            </select>
                        </div>

                        <div className="mt-4 flex gap-3">
                            <Button type="submit" variant="filled" className="flex-1">
                                Save Transaction
                            </Button>
                            <Button type="button" variant="outline" className="flex-1" onClick={() => setShowNewTxnForm(false)}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </DetailDrawer>
            )}
        </div>
    );
}
