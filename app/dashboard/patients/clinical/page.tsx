"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import {
    ChevronLeft,
    Activity,
    AlertTriangle,
    Stethoscope,
    FileText,
    FileCheck2,
    Download,
    Plus,
    Clock,
    ShieldBan,
    FileDigit,
    Search,
    ChevronRight,
    Calendar,
    Loader2,
    UploadCloud,
    Upload
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { apiClient } from "@/lib/api-client";

type RoleType = "super_admin" | "administrator" | "reception" | "clinician";

interface ClinicalNote {
    id: string;
    date: string;
    author: string;
    service: string;
    content: string;
    medicalNotes?: string;
    internalStaffNote?: string;
    patientNote?: string;
}

interface MedicalDocument {
    id: string;
    title: string;
    type: "Scan" | "Lab Result" | "Consent" | "Questionnaire";
    date: string;
    status: "Completed" | "Signed" | "Pending Review";
    url?: string;
}

export default function ClinicalChart() {
    const router = useRouter();
    const [userRole, setUserRole] = useState<RoleType>("clinician");
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"notes" | "vault">("notes");
    const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [newDocTitle, setNewDocTitle] = useState("");
    const [newDocType, setNewDocType] = useState<"Scan" | "Lab Result" | "Consent" | "Questionnaire">("Scan");
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [dbPatients, setDbPatients] = useState<any[]>([]);
    const [clinicalNotes, setClinicalNotes] = useState<ClinicalNote[]>([]);
    const [vaultDocuments, setVaultDocuments] = useState<MedicalDocument[]>([]);

    const handleDownload = (doc: MedicalDocument) => {
        setDownloadingDocId(doc.id);
        setTimeout(() => {
            setDownloadingDocId(null);
            if (doc.url) {
                window.open(doc.url, "_blank");
            }
        }, 1200);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleFileDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    };

    const handleUploadScan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatientId) return;

        const titleToUse = newDocTitle || (selectedFile ? selectedFile.name.split(".")[0] : "Medical Scan");

        try {
            const formData = new FormData();
            formData.append("title", titleToUse);
            formData.append("file_type", newDocType.toLowerCase());
            if (selectedFile) {
                formData.append("file", selectedFile);
            }

            const res = await apiClient(`/patients/${selectedPatientId}/medical-files`, {
                method: "POST",
                body: formData,
            });

            if (res && res.data) {
                const uploaded = res.data;
                const newDoc: MedicalDocument = {
                    id: `DOC-${uploaded.id}`,
                    title: uploaded.title,
                    type: newDocType,
                    date: uploaded.created_at ? uploaded.created_at.split(" ")[0] : new Date().toISOString().split("T")[0],
                    status: "Completed",
                    url: uploaded.url
                };
                setVaultDocuments([newDoc, ...vaultDocuments]);
            }
        } catch (err: any) {
            console.warn("Medical file upload fallback:", err.message);
            const newDoc: MedicalDocument = {
                id: `DOC-${Math.floor(100 + Math.random() * 900)}`,
                title: titleToUse,
                type: newDocType,
                date: new Date().toISOString().split("T")[0],
                status: "Completed"
            };
            setVaultDocuments([newDoc, ...vaultDocuments]);
        }

        setIsUploadModalOpen(false);
        setNewDocTitle("");
        setSelectedFile(null);
    };

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole") as RoleType | null;
        if (storedRole) {
            setUserRole(storedRole);
        }

        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        if (id) {
            setSelectedPatientId(id);
        }

        apiClient("/patients")
            .then(res => {
                if (res && res.data) {
                    setDbPatients(res.data);
                }
            })
            .catch(err => console.error("Failed to load clinical patients directory:", err.message));
    }, []);

    // Load active patient clinical notes and medical vault documents from backend
    useEffect(() => {
        if (!selectedPatientId) return;

        apiClient(`/patients/${selectedPatientId}`)
            .then(res => {
                if (res && res.data) {
                    const p = res.data;
                    setDbPatients(prev => {
                        const exists = prev.some(item => item.id === p.id || item.patient_code === p.patient_code || String(item.rawId) === String(p.id));
                        if (exists) {
                            return prev.map(item => (item.id === p.id || item.patient_code === p.patient_code || String(item.rawId) === String(p.id)) ? { ...item, ...p } : item);
                        }
                        return [...prev, p];
                    });
                    if (p.clinicalNotes) {
                        const mappedNotes: ClinicalNote[] = p.clinicalNotes.map((n: any) => ({
                            id: `NOTE-${n.id}`,
                            date: n.created_at || new Date().toISOString().split("T")[0],
                            author: n.clinician_name || "Clinician",
                            service: n.service || "Consultation",
                            content: `Subjective: ${n.subjective || 'N/A'}\n\nObjective: ${n.objective || 'N/A'}\n\nAssessment: ${n.assessment || 'N/A'}\n\nPlan: ${n.plan || 'N/A'}`,
                            medicalNotes: p.medical_history || '',
                            internalStaffNote: n.internal_notes || '',
                            patientNote: ''
                        }));
                        setClinicalNotes(mappedNotes);
                    }
                    if (p.medicalFiles) {
                        const mappedFiles: MedicalDocument[] = p.medicalFiles.map((f: any) => ({
                            id: `DOC-${f.id}`,
                            title: f.title || f.file_name,
                            type: f.file_type === 'scan' ? 'Scan' : f.file_type === 'consent' ? 'Consent' : 'Lab Result',
                            date: f.created_at ? f.created_at.split(" ")[0] : new Date().toISOString().split("T")[0],
                            status: 'Completed',
                            url: f.url
                        }));
                        setVaultDocuments(mappedFiles);
                    }
                }
            })
            .catch(err => console.error("Failed to load patient clinical record:", err.message));
    }, [selectedPatientId]);

    const handleSelectPatient = (id: string | null) => {
        setSelectedPatientId(id);
        if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            if (id) {
                url.searchParams.set("id", id);
            } else {
                url.searchParams.delete("id");
            }
            window.history.pushState({}, "", url.toString());
        }
    };

    const filteredPatients = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return dbPatients.filter(p =>
            (p.name || '').toLowerCase().includes(q) ||
            (p.id || '').toLowerCase().includes(q) ||
            (p.patient_code || '').toLowerCase().includes(q)
        );
    }, [dbPatients, searchQuery]);

    const activePatient = useMemo(() => {
        return dbPatients.find(p => p.id === selectedPatientId || p.patient_code === selectedPatientId || String(p.rawId) === selectedPatientId);
    }, [dbPatients, selectedPatientId]);

    const getInitials = (name: string) => {
        if (!name) return "P";
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };



    if (userRole === "reception") {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-white dark:bg-zinc-900">
                <ShieldBan className="mb-4 h-12 w-12 text-zinc-500" />
                <h1 className="text-2xl font-bold text-foreground">HIPAA / Data Privacy Lock</h1>
                <p className="mt-2 text-foreground/60">
                    Reception staff do not have clearance to view detailed clinical charts.
                </p>
            </div>
        );
    }

    // FLOW A: Render patient list picker if no active patient is selected
    if (!activePatient) {
        return (
            <div className="flex h-full w-full flex-col p-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Clinical Database</h1>
                    <p className="mt-1 text-sm text-foreground/60">Search and select a patient profile to access clinical records.</p>
                </div>

                <div className="relative max-w-md mb-6">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                    <input
                        type="text"
                        placeholder="Search by Patient Name or Reference ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 pl-9 pr-4 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22]"
                    />
                </div>

                <div className="rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22] overflow-hidden">
                    <table className="w-full text-left text-sm text-foreground">
                        <thead className="border-b border-black/[.15] bg-black/[.02] text-xs uppercase text-foreground/60 dark:border-white/[.22] dark:bg-white/[.02]">
                            <tr>
                                <th className="px-6 py-4 font-bold">Patient Info</th>
                                <th className="px-6 py-4 font-bold">Reference ID</th>
                                <th className="px-6 py-4 text-right font-bold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/[.08] dark:divide-white/[.145]">
                            {filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-foreground/50 font-medium">
                                        No patients match your search query.
                                    </td>
                                </tr>
                            ) : (
                                filteredPatients.map((p) => (
                                    <tr
                                        key={p.id}
                                        onClick={() => handleSelectPatient(p.id)}
                                        className="cursor-pointer transition-colors hover:bg-black/[.04] dark:hover:bg-white/[.04]"
                                    >
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-sm">
                                                    {getInitials(p.name)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-foreground">{p.name}</span>
                                                    <span className="text-xs text-foreground/50">DOB: {p.dob} • {p.gender}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 font-mono text-xs text-foreground/60">
                                            {p.id}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right">
                                            <Button variant="ghost" size="xs" icon={ChevronRight} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // FLOW B: Render clinical chart for selected patient (matching detail page design)
    return (
        <div className="flex h-full w-full flex-col p-8">
            {/* Back Button */}
            <div className="mb-4">
                <button
                    onClick={() => handleSelectPatient(null)}
                    className="flex items-center gap-1 text-sm font-bold text-foreground/70 hover:text-foreground transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" /> Return to Patient List
                </button>
            </div>

            {/* Header / Patient Summary (no contact details) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-black/[.15] dark:border-white/[.22] pb-6 mb-6">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xl">
                        {getInitials(activePatient.name)}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">{activePatient.name}</h1>
                        <div className="flex items-center gap-2 mt-1 text-sm text-foreground/80 font-medium">
                            <span>ID: {activePatient.id}</span>
                            <span>•</span>
                            <span>{activePatient.gender}</span>
                        </div>
                    </div>
                </div>

                {/* Vitals Summary Sub-Header */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
                    <div className="rounded-xl border border-black/[.15] dark:border-white/[.22] p-4 bg-white dark:bg-zinc-900 min-w-[140px] h-28 flex flex-col justify-between">
                        <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" /> Date of Birth
                        </span>
                        <span className="text-base font-bold text-zinc-900 dark:text-zinc-100 block">{activePatient.dob}</span>
                    </div>
                    <div className="rounded-xl border border-black/[.15] dark:border-white/[.22] p-4 bg-white dark:bg-zinc-900 min-w-[100px] h-28 flex flex-col justify-between">
                        <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                            <Activity className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" /> Blood Type
                        </span>
                        <span className="text-base font-bold text-zinc-900 dark:text-zinc-100 block">
                            {activePatient.blood_group || activePatient.bloodGroup || "Not Specified"}
                        </span>
                    </div>
                    {(() => {
                        const rawAllergies = activePatient.allergies;
                        const patientAllergies: string[] = Array.isArray(rawAllergies)
                            ? rawAllergies
                            : typeof rawAllergies === 'string' && rawAllergies.trim().length > 0
                            ? rawAllergies.split(',').map((s: string) => s.trim())
                            : [];

                        return (
                            <div className="rounded-xl border border-black/[.15] dark:border-white/[.22] p-4 bg-white dark:bg-zinc-900 min-w-[160px] h-28 flex flex-col justify-between relative group cursor-help transition-all">
                                <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                                    <AlertTriangle className="h-3.5 w-3.5 text-red-500" /> Allergies
                                </span>
                                <div>
                                    <span className="text-base font-bold text-zinc-900 dark:text-zinc-100 block truncate">
                                        {patientAllergies.length > 0 ? patientAllergies.slice(0, 2).join(", ") : "None Reported"}
                                    </span>
                                    {patientAllergies.length > 2 && (
                                        <span className="text-[12px] text-zinc-400 dark:text-zinc-500 block mt-0.5">
                                            +{patientAllergies.length - 2} more
                                        </span>
                                    )}
                                </div>

                                {/* Popover cloud displaying all patient allergies */}
                                {patientAllergies.length > 0 && (
                                    <div className="absolute right-0 top-full mt-2 hidden group-hover:block z-50 w-64 rounded-lg border border-black/[.15] bg-white p-3 shadow-lg dark:bg-zinc-900 dark:border-white/[.22] animate-in fade-in slide-in-from-top-1">
                                        <span className="block text-[12px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                                            All Allergies ({patientAllergies.length})
                                        </span>
                                        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto thin-scrollbar">
                                            {patientAllergies.map((allergy) => (
                                                <span
                                                    key={allergy}
                                                    className="rounded px-3 py-1 text-[12px] font-bold bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                                                >
                                                    {allergy}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* Content Container (Workspace Tabs) */}
            <div className="mx-auto w-full max-w-4xl bg-white dark:bg-zinc-900 border border-black/[.15] dark:border-white/[.22] rounded-2xl p-8">

                {/* Tabs */}
                <div className="flex text-sm font-bold border-b border-black/[.15] dark:border-white/[.22] mb-6">
                    <button
                        onClick={() => setActiveTab("notes")}
                        className={`mr-6 border-b-2 pb-3 transition-colors ${activeTab === "notes" ? "border-brand text-brand dark:text-white" : "border-transparent text-foreground/70 hover:text-foreground/90"}`}
                    >
                        Clinical Notes
                    </button>
                    <button
                        onClick={() => setActiveTab("vault")}
                        className={`border-b-2 pb-3 transition-colors ${activeTab === "vault" ? "border-brand text-brand dark:text-white" : "border-transparent text-foreground/70 hover:text-foreground/90"}`}
                    >
                        Medical Vault & Documents
                    </button>
                </div>

                {/* TAB: CLINICAL NOTES */}
                {activeTab === "notes" && (
                    <div className="flex flex-col gap-6 animate-in fade-in">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-foreground">Treatment History</h2>
                            <Link
                                href={`/dashboard/clinical-notes?aptId=NEW&patientId=${activePatient.id}`}
                                className="flex items-center gap-2 rounded-md bg-[#3C43EC] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#2b30c6]"
                            >
                                <Plus className="h-4 w-4" /> Add Clinical Note
                            </Link>
                        </div>

                        <div className="flex flex-col gap-4">
                            {clinicalNotes.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-black/[.15] dark:border-white/[.22] p-8 text-center text-sm font-medium text-foreground/50">
                                    No clinical notes recorded for this patient yet.
                                </div>
                            ) : (
                                clinicalNotes.map((note) => (
                                    <div key={note.id} className="rounded-xl border border-black/[.15] bg-black/[.01] dark:bg-white/[.01] p-6 dark:border-white/[.22]">
                                        <div className="mb-4 flex items-center justify-between border-b border-black/[.08] pb-4 dark:border-white/[.08]">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-foreground">{note.author}</span>
                                                <span className="text-xs text-foreground/40">•</span>
                                                <span className="text-xs font-semibold text-foreground/60">{note.service}</span>
                                            </div>
                                            <span className="text-xs font-semibold text-foreground/50 flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5" /> {note.date}
                                            </span>
                                        </div>
                                        {/* Structured SOAP note renderer */}
                                        <div className="flex flex-col gap-4">
                                            {note.content.split('\n\n').map((block, i) => {
                                                const soapLabels = ['Subjective', 'Objective', 'Assessment', 'Plan'];
                                                const matchedLabel = soapLabels.find(l => block.startsWith(`${l}:`));
                                                if (matchedLabel) {
                                                    const body = block.slice(matchedLabel.length + 1).trim();
                                                    return (
                                                        <div key={i} className="flex flex-col gap-1">
                                                            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                                                                {matchedLabel}
                                                            </span>
                                                            <p className="text-sm leading-relaxed text-foreground/85 font-medium pl-0.5">{body}</p>
                                                        </div>
                                                    );
                                                }
                                                return <p key={i} className="text-sm leading-relaxed text-foreground/85 font-medium">{block}</p>;
                                            })}
                                        </div>

                                        {/* Booking Notes from appointment */}
                                        {(note.medicalNotes || note.internalStaffNote || note.patientNote) && (
                                            <div className="mt-5 flex flex-col gap-4 border-t border-black/[.06] pt-5 dark:border-white/[.06]">
                                                {note.medicalNotes && (
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Medical Information / Notes</span>
                                                        <p className="text-sm leading-relaxed text-foreground/85 font-medium pl-0.5">{note.medicalNotes}</p>
                                                    </div>
                                                )}
                                                {note.internalStaffNote && (
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Booking Internal Staff Note</span>
                                                        <p className="text-sm leading-relaxed text-foreground/85 font-medium pl-0.5">{note.internalStaffNote}</p>
                                                    </div>
                                                )}
                                                {note.patientNote && (
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Booking Patient Note</span>
                                                        <p className="text-sm leading-relaxed text-foreground/85 font-medium pl-0.5">{note.patientNote}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* TAB: MEDICAL VAULT */}
                {activeTab === "vault" && (
                    <div className="flex flex-col gap-6 animate-in fade-in">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-foreground">Scans, Labs & Consents</h2>
                            <div className="flex gap-2">
                                <Button variant="filled" icon={Plus} onClick={() => router.push(`/dashboard/patients/clinical/new-report?id=${selectedPatientId || ''}`)}>
                                    Add Report
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {vaultDocuments.length === 0 ? (
                                <div className="col-span-full rounded-xl border border-dashed border-black/[.15] dark:border-white/[.22] p-8 text-center text-sm font-medium text-foreground/50">
                                    No medical reports or documents uploaded for this patient yet.
                                </div>
                            ) : (
                                vaultDocuments.map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between rounded-lg border border-black/[.15] dark:border-white/[.22] px-4 py-0 hover:bg-black/[.02] dark:hover:bg-white/[.02] shadow-none">
                                        <div className="flex items-center gap-4 py-2 min-w-0">
                                             {/* PDF Page Preview Indicator */}
                                             <div className="relative flex h-12 w-9 shrink-0 flex-col items-center justify-center rounded border border-red-700 dark:border-red-800 bg-red-600 dark:bg-red-700 text-white select-none shadow-none overflow-hidden">
                                                 <FileText className="h-5 w-5 text-white" />
                                                 <span className="text-[7px] font-extrabold tracking-wider mt-0.5 uppercase">PDF</span>
                                             </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-semibold text-foreground truncate block">{doc.title}</span>
                                                <div className="flex items-center gap-2 text-xs text-foreground/60">
                                                    <span>{doc.date}</span>
                                                    <span>•</span>
                                                    <span>{doc.type}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {downloadingDocId === doc.id ? (
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3C43EC]/10 text-[#3C43EC] dark:bg-white/10 dark:text-white">
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleDownload(doc)}
                                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/15 bg-white text-foreground/70 hover:text-foreground hover:bg-black/[.03] dark:border-white/[.22] dark:bg-zinc-900 dark:hover:bg-white/[.04] transition-all shadow-none"
                                                title="Download Document"
                                            >
                                                <Download className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

            </div>

            {/* Upload Scan Modal */}
            <Modal
                isOpen={isUploadModalOpen}
                onClose={() => {
                    setIsUploadModalOpen(false);
                    setNewDocTitle("");
                }}
                title="Upload Scan / Document"
                description="Upload medical scans, lab results, consents, or health questionnaires to the patient's medical vault."
                maxWidth="md"
            >
                <form onSubmit={handleUploadScan} className="space-y-5 mt-4">
                    <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Document Title</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Growth Ultrasound Scan"
                            value={newDocTitle}
                            onChange={(e) => setNewDocTitle(e.target.value)}
                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Document Type</label>
                        <select
                            value={newDocType}
                            onChange={(e) => setNewDocType(e.target.value as any)}
                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22] cursor-pointer"
                        >
                            <option value="Scan">Scan / Ultrasound</option>
                            <option value="Lab Result">Lab Result</option>
                            <option value="Consent">Consent Form</option>
                            <option value="Questionnaire">Questionnaire</option>
                        </select>
                    </div>

                    {/* Drag and drop file mock */}
                    <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Scan File</label>
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <label
                            htmlFor="file-upload"
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragActive(true);
                            }}
                            onDragLeave={() => setDragActive(false)}
                            onDrop={handleFileDrop}
                            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${dragActive
                                ? "border-brand bg-brand/5 dark:border-brand dark:bg-brand/10"
                                : "border-black/[.15] dark:border-white/[.22] hover:bg-black/[.01] dark:hover:bg-white/[.01]"
                                }`}
                        >
                            <UploadCloud className="h-8 w-8 text-foreground/40 mb-2" />
                            {selectedFile ? (
                                <div className="flex flex-col items-center">
                                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Selected: {selectedFile.name}</span>
                                    <span className="text-[10px] text-foreground/50 mt-0.5">Click or drag another file to replace</span>
                                </div>
                            ) : (
                                <>
                                    <span className="text-xs font-bold text-foreground">Click to browse or drag & drop file here</span>
                                    <span className="text-[10px] text-foreground/50 mt-1">Supports PDF, JPG, PNG up to 10MB</span>
                                </>
                            )}
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-black/[.15] dark:border-white/[.22]">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setIsUploadModalOpen(false);
                                setNewDocTitle("");
                                setSelectedFile(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="filled">
                            Upload Scan
                        </Button>
                    </div>
                </form>
            </Modal>

        </div>
    );
}
