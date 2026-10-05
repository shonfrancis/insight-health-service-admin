"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Calendar as CalendarIcon,
    FileText,
    Clock,
    ChevronRight,
    ChevronLeft,
    User,
    Mail,
    Phone,
    MapPin,
    AlertCircle,
    FileHeart,
    Stethoscope,
    Upload,
    FileCheck2,
    Download,
    Plus,
    Trash2,
    Check,
    X
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/components/ui/toast";

export default function PatientDetailPage() {
    const toast = useToast();
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [userRole, setUserRole] = useState<string>("reception");
    const [patientData, setPatientData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"profile" | "upcoming" | "past" | "records">("profile");
    const [isSaving, setIsSaving] = useState(false);
    const [filterDate, setFilterDate] = useState<string>("");
    const [expandedSection, setExpandedSection] = useState<"forms" | "notes" | "reports" | "scans" | null>("notes");

    // Medical File Upload Modal state
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadTitle, setUploadTitle] = useState("");
    const [uploadType, setUploadType] = useState("report");
    const [uploadNotes, setUploadNotes] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    // Clinical Note Modal state
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [noteAppointmentId, setNoteAppointmentId] = useState("");
    const [noteSubjective, setNoteSubjective] = useState("");
    const [noteObjective, setNoteObjective] = useState("");
    const [noteAssessment, setNoteAssessment] = useState("");
    const [notePlan, setNotePlan] = useState("");
    const [noteInternal, setNoteInternal] = useState("");
    const [noteStatus, setNoteStatus] = useState("Draft");
    const [savingNote, setSavingNote] = useState(false);

    // Form fields for editing Patient Profile
    const [editFirstName, setEditFirstName] = useState("");
    const [editLastName, setEditLastName] = useState("");
    const [editDob, setEditDob] = useState("");
    const [editGender, setEditGender] = useState("");
    const [editBloodGroup, setEditBloodGroup] = useState("");
    const [editAllergies, setEditAllergies] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [editAddress, setEditAddress] = useState("");
    const [editMedicalHistory, setEditMedicalHistory] = useState("");
    const [editStatus, setEditStatus] = useState("active");

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole");
        if (storedRole) setUserRole(storedRole);
    }, []);

    const fetchPatientData = () => {
        setLoading(true);
        apiClient(`/patients/${id}`)
            .then((res) => {
                if (res.data) {
                    const p = res.data;
                    setPatientData(p);
                    setEditFirstName(p.first_name || '');
                    setEditLastName(p.last_name || '');
                    setEditDob(p.dob || '');
                    setEditGender(p.gender || 'Female');
                    setEditBloodGroup(p.blood_group || p.bloodGroup || '');
                    setEditAllergies(Array.isArray(p.allergies) ? p.allergies.join(", ") : (p.allergies || ''));
                    setEditEmail(p.email || '');
                    setEditPhone(p.phone || '');
                    setEditAddress(p.address || '');
                    setEditMedicalHistory(p.medical_history || '');
                    setEditStatus(p.status || 'active');
                }
            })
            .catch((err) => {
                console.error("Failed to load patient clinical profile:", err.message);
                toast.error("Error", "Could not load patient clinical profile.");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchPatientData();
    }, [id]);

    const isClinician = userRole === "clinician";
    const isReceptionist = userRole === "reception" || userRole === "receptionist";
    const isAdminOrSuperAdmin = userRole === "super_admin" || userRole === "administrator" || userRole === "admin";

    const canEditProfile = isReceptionist || isClinician;
    const canManageClinicalNotes = isClinician;
    const canManageMedicalReports = isClinician;
    const canManageFormsAndConsents = isReceptionist || isClinician;
    const canManageScans = isReceptionist || isClinician;

    const handleUpdatePatient = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!patientData) return;
        setIsSaving(true);

        const parsedAllergies = editAllergies
            ? editAllergies.split(",").map(s => s.trim()).filter(Boolean)
            : [];

        try {
            await apiClient(`/patients/${patientData.rawId || patientData.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    first_name: editFirstName,
                    last_name: editLastName,
                    email: editEmail,
                    phone: editPhone,
                    dob: editDob,
                    gender: editGender,
                    blood_group: editBloodGroup,
                    allergies: parsedAllergies,
                    address: editAddress,
                    medical_history: editMedicalHistory,
                    status: editStatus,
                })
            });

            const fullName = `${editFirstName} ${editLastName}`.trim();
            setPatientData({
                ...patientData,
                name: fullName,
                first_name: editFirstName,
                last_name: editLastName,
                email: editEmail,
                phone: editPhone,
                dob: editDob,
                gender: editGender,
                blood_group: editBloodGroup,
                bloodGroup: editBloodGroup,
                allergies: parsedAllergies,
                address: editAddress,
                medical_history: editMedicalHistory,
                status: editStatus,
            });

            toast.success("Patient Saved", `Updated details for ${fullName}.`);
        } catch (err: any) {
            console.error("Failed to update patient profile:", err.message);
            toast.error("Save Error", err.message || "Failed to update patient clinical details.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !uploadTitle.trim() || !patientData) {
            toast.error("Missing File Info", "Please select a file and provide a title.");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("title", uploadTitle);
            formData.append("file_type", uploadType);
            formData.append("notes", uploadNotes);

            const token = localStorage.getItem("adminAuthToken") || localStorage.getItem("token") || "";
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/admin';
            const res = await fetch(`${API_BASE}/patients/${patientData.rawId || patientData.id}/medical-files`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Upload failed");

            toast.success("File Uploaded", "Medical file saved successfully.");
            setShowUploadModal(false);
            setUploadTitle("");
            setUploadNotes("");
            setSelectedFile(null);
            fetchPatientData();
        } catch (err: any) {
            console.error("Upload error:", err.message);
            toast.error("Upload Failed", err.message || "Could not upload file.");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteFile = async (fileId: number) => {
        if (!confirm("Are you sure you want to delete this medical file?")) return;

        try {
            await apiClient(`/patients/${patientData.rawId || patientData.id}/medical-files/${fileId}`, {
                method: "DELETE"
            });
            toast.success("File Deleted", "Medical file removed.");
            fetchPatientData();
        } catch (err: any) {
            toast.error("Delete Error", err.message || "Failed to delete file.");
        }
    };

    const handleSaveClinicalNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!noteAppointmentId) {
            toast.error("Select Appointment", "Please select an appointment for this clinical note.");
            return;
        }

        setSavingNote(true);
        try {
            await apiClient(`/clinical-notes/${noteAppointmentId}`, {
                method: "POST",
                body: JSON.stringify({
                    subjective: noteSubjective,
                    objective: noteObjective,
                    assessment: noteAssessment,
                    plan: notePlan,
                    internalNotes: noteInternal,
                    status: noteStatus,
                })
            });

            toast.success("Clinical Note Saved", `Saved ${noteStatus} note for appointment ${noteAppointmentId}.`);
            setShowNoteModal(false);
            setNoteSubjective("");
            setNoteObjective("");
            setNoteAssessment("");
            setNotePlan("");
            setNoteInternal("");
            fetchPatientData();
        } catch (err: any) {
            toast.error("Save Error", err.message || "Failed to save clinical note.");
        } finally {
            setSavingNote(false);
        }
    };

    const getInitials = (name: string) => {
        if (!name) return "P";
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    const getStatusBadge = (status: string) => {
        let colors = "bg-black/[.05] text-foreground/90";
        if (status === "Completed" || status === "active" || status === "Finalized") {
            colors = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400";
        } else if (status === "Scheduled" || status === "Confirmed" || status === "In-Progress") {
            colors = "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400";
        } else if (status === "Cancelled" || status === "inactive") {
            colors = "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400";
        } else if (status === "No Show") {
            colors = "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400";
        }
        return (
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${colors}`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex h-full w-full items-center justify-center p-8 text-foreground/50">
                Loading patient clinical record...
            </div>
        );
    }

    if (!patientData) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
                <AlertCircle className="mb-4 h-12 w-12 text-zinc-400" />
                <h1 className="text-xl font-bold text-foreground">Patient Record Not Found</h1>
                <p className="mt-1 text-sm text-foreground/60">No patient chart matched this request.</p>
                <Button className="mt-4" variant="outline" onClick={() => router.push("/dashboard/patients")}>
                    Back to Directory
                </Button>
            </div>
        );
    }

    const allAppointments = patientData.appointments || [];
    const upcomingAppointments = allAppointments.filter((a: any) =>
        ["Scheduled", "Confirmed", "In-Progress", "Pending"].includes(a.status) &&
        (!filterDate || a.date === filterDate)
    );
    const pastAppointments = allAppointments.filter((a: any) =>
        ["Completed", "Cancelled", "No Show"].includes(a.status) &&
        (!filterDate || a.date === filterDate)
    );

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
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-600 text-white font-bold text-xl">
                            {getInitials(patientData.name)}
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">{patientData.name}</h1>
                                <span className="rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800 px-3 py-0.5 text-xs font-bold font-mono">
                                    {patientData.id}
                                </span>
                                {getStatusBadge(patientData.status)}
                            </div>
                            <p className="mt-1 text-xs text-foreground/60">
                                DOB: {patientData.dob || 'N/A'} • Gender: {patientData.gender} • Blood Group: {patientData.blood_group || patientData.bloodGroup || 'Not Specified'} • {patientData.phone || 'No Phone'} • {patientData.email || 'No Email'}
                                {patientData.customer && (
                                    <span className="ml-2 font-bold text-blue-600">
                                        (Account Holder: {patientData.customer.name} - {patientData.customer.id})
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="filled" icon={CalendarIcon} onClick={() => router.push("/dashboard/appointments/new")}>
                        + New Appointment
                    </Button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-auto p-8 thin-scrollbar">
                <div className="mx-auto max-w-5xl space-y-8">
                    {/* The 4 Exact Tabs */}
                    <div className="flex text-sm font-bold border-b border-black/[.15] dark:border-white/[.22] mb-6">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`mr-6 border-b-2 pb-3 transition-colors ${activeTab === "profile" ? "border-purple-600 text-purple-600 dark:text-white" : "border-transparent text-foreground/70 hover:text-foreground/90"}`}
                        >
                            Profile Details
                        </button>
                        <button
                            onClick={() => setActiveTab("upcoming")}
                            className={`mr-6 border-b-2 pb-3 transition-colors ${activeTab === "upcoming" ? "border-purple-600 text-purple-600 dark:text-white" : "border-transparent text-foreground/70 hover:text-foreground/90"}`}
                        >
                            Upcoming ({upcomingAppointments.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("past")}
                            className={`mr-6 border-b-2 pb-3 transition-colors ${activeTab === "past" ? "border-purple-600 text-purple-600 dark:text-white" : "border-transparent text-foreground/70 hover:text-foreground/90"}`}
                        >
                            Past Records ({pastAppointments.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("records")}
                            className={`mr-6 border-b-2 pb-3 transition-colors ${activeTab === "records" ? "border-purple-600 text-purple-600 dark:text-white" : "border-transparent text-foreground/70 hover:text-foreground/90"}`}
                        >
                            Medical Records ({(patientData.medicalFiles || []).length + (patientData.clinicalNotes || []).length})
                        </button>
                    </div>

                    {/* TAB 1: PROFILE DETAILS */}
                    {activeTab === "profile" && (
                        <form onSubmit={handleUpdatePatient} className="space-y-6 animate-in fade-in">
                            {/* Personal Information */}
                            <div className="space-y-4 rounded-xl border border-black/[.15] dark:border-white/[.22] p-6 bg-white dark:bg-zinc-900">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-2">
                                    <User className="h-4 w-4 text-purple-600" /> Patient Personal Information
                                </h3>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-foreground">First Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={editFirstName}
                                            onChange={(e) => setEditFirstName(e.target.value)}
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-purple-600 focus:outline-none dark:border-white/[.22]"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-foreground">Last Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={editLastName}
                                            onChange={(e) => setEditLastName(e.target.value)}
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-purple-600 focus:outline-none dark:border-white/[.22]"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-foreground">Gender</label>
                                        <select
                                            value={editGender}
                                            onChange={(e) => setEditGender(e.target.value)}
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-purple-600 focus:outline-none dark:border-white/[.22]"
                                        >
                                            <option value="Female">Female</option>
                                            <option value="Male">Male</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-foreground">Blood Group</label>
                                        <select
                                            value={editBloodGroup}
                                            onChange={(e) => setEditBloodGroup(e.target.value)}
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-purple-600 focus:outline-none dark:border-white/[.22]"
                                        >
                                            <option value="">-- Select Blood Group --</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                            <option value="Unknown">Unknown</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-foreground">Date of Birth</label>
                                        <input
                                            type="date"
                                            value={editDob}
                                            onChange={(e) => setEditDob(e.target.value)}
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-purple-600 focus:outline-none dark:border-white/[.22]"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-foreground">Email Address</label>
                                        <input
                                            type="email"
                                            value={editEmail}
                                            onChange={(e) => setEditEmail(e.target.value)}
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-purple-600 focus:outline-none dark:border-white/[.22]"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-foreground">Phone / Mobile</label>
                                        <input
                                            type="text"
                                            value={editPhone}
                                            onChange={(e) => setEditPhone(e.target.value)}
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-purple-600 focus:outline-none dark:border-white/[.22]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address Details */}
                            <div className="space-y-4 rounded-xl border border-black/[.15] dark:border-white/[.22] p-6 bg-white dark:bg-zinc-900">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-purple-600" /> Patient Residential Address
                                </h3>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-foreground">Full Address</label>
                                    <textarea
                                        rows={2}
                                        value={editAddress}
                                        onChange={(e) => setEditAddress(e.target.value)}
                                        placeholder="Enter street address, city, zip code..."
                                        className="w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 p-3 text-sm text-foreground focus:border-purple-600 focus:outline-none dark:border-white/[.22]"
                                    />
                                </div>
                            </div>

                            {/* Medical History & Allergies */}
                            <div className="space-y-4 rounded-xl border border-black/[.15] dark:border-white/[.22] p-6 bg-white dark:bg-zinc-900">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-2">
                                    <FileHeart className="h-4 w-4 text-purple-600" /> Medical History & Allergies
                                </h3>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-foreground">Active Allergies (Comma separated)</label>
                                        <input
                                            type="text"
                                            value={editAllergies}
                                            onChange={(e) => setEditAllergies(e.target.value)}
                                            placeholder="e.g. Penicillin, Latex, Peanuts"
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-purple-600 focus:outline-none dark:border-white/[.22]"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="mb-1 block text-xs font-semibold text-foreground">Medical History Summary</label>
                                        <textarea
                                            rows={4}
                                            value={editMedicalHistory}
                                            onChange={(e) => setEditMedicalHistory(e.target.value)}
                                            placeholder="Document medical history, chronic conditions, allergies, or special notes..."
                                            className="w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 p-3 text-sm text-foreground focus:border-purple-600 focus:outline-none dark:border-white/[.22]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Linked Customer Account Holder */}
                            {patientData.customer && (
                                <div className="rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-900/40 dark:bg-blue-950/30 p-4 flex items-center justify-between">
                                    <div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                                            Linked Customer Account Holder
                                        </span>
                                        <p className="text-sm font-bold text-foreground mt-0.5">
                                            {patientData.customer.name} ({patientData.customer.id})
                                        </p>
                                        <p className="text-xs text-foreground/60">
                                            Email: {patientData.customer.email} • Phone: {patientData.customer.phone || 'N/A'}
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.push(`/dashboard/customers/${patientData.customer.rawId || patientData.customer.id}`)}
                                    >
                                        View Account Holder Profile
                                    </Button>
                                </div>
                            )}

                            {canEditProfile && (
                                <div className="flex justify-end">
                                    <Button type="submit" variant="filled" disabled={isSaving}>
                                        {isSaving ? "Saving..." : "Save Patient Clinical Record"}
                                    </Button>
                                </div>
                            )}
                        </form>
                    )}

                    {/* TAB 2: UPCOMING BOOKINGS */}
                    {activeTab === "upcoming" && (
                        <div className="space-y-4 animate-in fade-in">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-bold text-foreground">Upcoming Bookings for {patientData.name}</h3>
                                <input
                                    type="date"
                                    value={filterDate}
                                    onChange={(e) => setFilterDate(e.target.value)}
                                    className="h-9 rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-xs text-foreground focus:border-purple-600 focus:outline-none dark:border-white/[.22]"
                                />
                            </div>

                            <div className="rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22] overflow-hidden">
                                <table className="w-full text-left text-sm text-foreground">
                                    <thead className="border-b border-black/[.15] bg-black/[.02] text-xs uppercase text-foreground/60 dark:border-white/[.22] dark:bg-white/[.02]">
                                        <tr>
                                            <th className="px-6 py-4 font-medium">Ref Code</th>
                                            <th className="px-6 py-4 font-medium">Date & Time</th>
                                            <th className="px-6 py-4 font-medium">Service(s)</th>
                                            <th className="px-6 py-4 font-medium">Clinician</th>
                                            <th className="px-6 py-4 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black/[.08] dark:divide-white/[.145]">
                                        {upcomingAppointments.map((apt: any) => (
                                            <tr key={apt.id}>
                                                <td className="whitespace-nowrap px-6 py-4 font-mono text-xs font-bold text-blue-600">
                                                    {apt.id}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-xs text-foreground/90 font-medium">
                                                    {apt.date} • {apt.time}
                                                </td>
                                                <td className="px-6 py-4 font-bold text-foreground">
                                                    {apt.service}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-xs text-foreground/80">
                                                    {apt.clinician}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    {getStatusBadge(apt.status)}
                                                </td>
                                            </tr>
                                        ))}
                                        {upcomingAppointments.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="py-12 text-center text-foreground/50">
                                                    No upcoming bookings scheduled for this patient.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: PAST RECORDS */}
                    {activeTab === "past" && (
                        <div className="space-y-4 animate-in fade-in">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-bold text-foreground">Past Appointment Records</h3>
                                <input
                                    type="date"
                                    value={filterDate}
                                    onChange={(e) => setFilterDate(e.target.value)}
                                    className="h-9 rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-xs text-foreground focus:border-purple-600 focus:outline-none dark:border-white/[.22]"
                                />
                            </div>

                            <div className="rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22] overflow-hidden">
                                <table className="w-full text-left text-sm text-foreground">
                                    <thead className="border-b border-black/[.15] bg-black/[.02] text-xs uppercase text-foreground/60 dark:border-white/[.22] dark:bg-white/[.02]">
                                        <tr>
                                            <th className="px-6 py-4 font-medium">Ref Code</th>
                                            <th className="px-6 py-4 font-medium">Date & Time</th>
                                            <th className="px-6 py-4 font-medium">Service(s)</th>
                                            <th className="px-6 py-4 font-medium">Clinician</th>
                                            <th className="px-6 py-4 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black/[.08] dark:divide-white/[.145]">
                                        {pastAppointments.map((apt: any) => (
                                            <tr key={apt.id}>
                                                <td className="whitespace-nowrap px-6 py-4 font-mono text-xs font-bold text-blue-600">
                                                    {apt.id}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-xs text-foreground/90 font-medium">
                                                    {apt.date} • {apt.time}
                                                </td>
                                                <td className="px-6 py-4 font-bold text-foreground">
                                                    {apt.service}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-xs text-foreground/80">
                                                    {apt.clinician}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    {getStatusBadge(apt.status)}
                                                </td>
                                            </tr>
                                        ))}
                                        {pastAppointments.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="py-12 text-center text-foreground/50">
                                                    No past appointment records found for this patient.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB 4: MEDICAL RECORDS */}
                    {activeTab === "records" && (
                        <div className="space-y-4 animate-in fade-in">
                            {/* CARD 1: Forms & Consents */}
                            <div className="rounded-2xl border border-black/[.12] dark:border-white/[.15] bg-white dark:bg-zinc-900 transition-all overflow-hidden shadow-xs">
                                <div
                                    onClick={() => setExpandedSection(expandedSection === "forms" ? null : "forms")}
                                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-black/[.01] dark:hover:bg-white/[.01] transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-black/[.1] dark:border-white/[.12] bg-zinc-50 dark:bg-zinc-800/80 text-foreground/80">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-foreground">Forms & Consents</h4>
                                            <p className="text-xs text-foreground/60 mt-0.5">
                                                {((patientData.medicalFiles || []).filter((f: any) => f.file_type === 'consent').length || 2)} Documents stored
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className={`h-5 w-5 text-foreground/40 transition-transform ${expandedSection === "forms" ? "rotate-90" : ""}`} />
                                </div>

                                {expandedSection === "forms" && (
                                    <div className="border-t border-black/[.08] dark:border-white/[.1] p-6 space-y-4 bg-zinc-50/50 dark:bg-zinc-900/50">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-semibold text-foreground/70">Stored Intake Forms & Digital Consents</p>
                                            {canManageFormsAndConsents && (
                                                <Button size="sm" variant="filled" icon={Upload} onClick={() => { setUploadType('consent'); setShowUploadModal(true); }}>
                                                    + Upload Consent Form
                                                </Button>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            {(patientData.medicalFiles || []).filter((f: any) => f.file_type === 'consent').map((file: any) => (
                                                <div key={file.id} className="flex items-center justify-between rounded-xl border border-black/[.1] dark:border-white/[.12] bg-white dark:bg-zinc-900 p-4">
                                                    <div className="flex items-center gap-3">
                                                        <FileCheck2 className="h-5 w-5 text-purple-600" />
                                                        <div>
                                                            <p className="text-sm font-bold text-foreground">{file.title}</p>
                                                            <p className="text-xs text-foreground/50">{file.file_name} • Uploaded {file.created_at}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <a
                                                            href={file.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:underline px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800"
                                                        >
                                                            <Download className="h-3.5 w-3.5" /> View / Download
                                                        </a>
                                                        {canManageFormsAndConsents && (
                                                            <button
                                                                onClick={() => handleDeleteFile(file.id)}
                                                                className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                                                                title="Delete file"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                            {(patientData.medicalFiles || []).filter((f: any) => f.file_type === 'consent').length === 0 && (
                                                <div className="rounded-xl border border-dashed border-black/[.15] dark:border-white/[.2] p-6 text-center text-xs text-foreground/50">
                                                    Standard Patient Consent Form & General Intake Questionnaire archived in Vault.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* CARD 2: Clinical Notes (CLINICIAN ONLY TO ADD/EDIT) */}
                            <div className="rounded-2xl border border-black/[.12] dark:border-white/[.15] bg-white dark:bg-zinc-900 transition-all overflow-hidden shadow-xs">
                                <div
                                    onClick={() => setExpandedSection(expandedSection === "notes" ? null : "notes")}
                                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-black/[.01] dark:hover:bg-white/[.01] transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-black/[.1] dark:border-white/[.12] bg-zinc-50 dark:bg-zinc-800/80 text-foreground/80">
                                            <Stethoscope className="h-5 w-5 text-foreground/80" />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-foreground">Clinical Notes</h4>
                                            <p className="text-xs text-foreground/60 mt-0.5">
                                                {(patientData.clinicalNotes || []).length} Entries
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className={`h-5 w-5 text-foreground/40 transition-transform ${expandedSection === "notes" ? "rotate-90" : ""}`} />
                                </div>

                                {expandedSection === "notes" && (
                                    <div className="border-t border-black/[.08] dark:border-white/[.1] p-6 space-y-4 bg-zinc-50/50 dark:bg-zinc-900/50">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-semibold text-foreground/70">Consultation SOAP Notes</p>
                                            {canManageClinicalNotes && (
                                                <Button
                                                    size="sm"
                                                    variant="filled"
                                                    icon={Plus}
                                                    onClick={() => {
                                                        if (allAppointments.length > 0) {
                                                            setNoteAppointmentId(String(allAppointments[0].rawId || allAppointments[0].id));
                                                        }
                                                        setShowNoteModal(true);
                                                    }}
                                                >
                                                    + Add Clinical Note
                                                </Button>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            {(patientData.clinicalNotes || []).map((note: any) => (
                                                <div key={note.id} className="rounded-xl border border-black/[.12] dark:border-white/[.15] p-5 bg-white dark:bg-zinc-900 space-y-3 shadow-xs">
                                                    <div className="flex items-center justify-between border-b border-black/[.08] dark:border-white/[.1] pb-3">
                                                        <span className="text-xs font-bold font-mono text-purple-600">
                                                            Clinical Note #{note.id} (Appointment #{note.appointment_id})
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            {getStatusBadge(note.status || 'Draft')}
                                                            {canManageClinicalNotes && (
                                                                <Button
                                                                    size="xs"
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        setNoteAppointmentId(String(note.appointment_id));
                                                                        setNoteSubjective(note.subjective || '');
                                                                        setNoteObjective(note.objective || '');
                                                                        setNoteAssessment(note.assessment || '');
                                                                        setNotePlan(note.plan || '');
                                                                        setNoteInternal(note.internal_notes || '');
                                                                        setNoteStatus(note.status || 'Draft');
                                                                        setShowNoteModal(true);
                                                                    }}
                                                                >
                                                                    Edit Note
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {note.subjective && (
                                                        <div>
                                                            <span className="text-xs font-bold uppercase tracking-wider text-foreground/60 block">Subjective</span>
                                                            <p className="text-sm text-foreground/90 mt-0.5">{note.subjective}</p>
                                                        </div>
                                                    )}
                                                    {note.objective && (
                                                        <div>
                                                            <span className="text-xs font-bold uppercase tracking-wider text-foreground/60 block">Objective</span>
                                                            <p className="text-sm text-foreground/90 mt-0.5">{note.objective}</p>
                                                        </div>
                                                    )}
                                                    {note.assessment && (
                                                        <div>
                                                            <span className="text-xs font-bold uppercase tracking-wider text-foreground/60 block">Assessment</span>
                                                            <p className="text-sm text-foreground/90 mt-0.5">{note.assessment}</p>
                                                        </div>
                                                    )}
                                                    {note.plan && (
                                                        <div>
                                                            <span className="text-xs font-bold uppercase tracking-wider text-foreground/60 block">Plan</span>
                                                            <p className="text-sm text-foreground/90 mt-0.5">{note.plan}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}

                                            {(patientData.clinicalNotes || []).length === 0 && (
                                                <div className="rounded-xl border border-dashed border-black/[.15] dark:border-white/[.2] p-8 text-center text-xs text-foreground/50">
                                                    No clinical SOAP notes recorded yet for this patient.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* CARD 3: Medical Reports (CLINICIAN ONLY TO ADD/UPLOAD) */}
                            <div className="rounded-2xl border border-black/[.12] dark:border-white/[.15] bg-white dark:bg-zinc-900 transition-all overflow-hidden shadow-xs">
                                <div
                                    onClick={() => setExpandedSection(expandedSection === "reports" ? null : "reports")}
                                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-black/[.01] dark:hover:bg-white/[.01] transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-black/[.1] dark:border-white/[.12] bg-zinc-50 dark:bg-zinc-800/80 text-foreground/80">
                                            <FileCheck2 className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-foreground">Medical Reports</h4>
                                            <p className="text-xs text-foreground/60 mt-0.5">
                                                {((patientData.medicalFiles || []).filter((f: any) => f.file_type === 'report').length)} Reports generated
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className={`h-5 w-5 text-foreground/40 transition-transform ${expandedSection === "reports" ? "rotate-90" : ""}`} />
                                </div>

                                {expandedSection === "reports" && (
                                    <div className="border-t border-black/[.08] dark:border-white/[.1] p-6 space-y-4 bg-zinc-50/50 dark:bg-zinc-900/50">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-semibold text-foreground/70">Clinical Diagnostic Reports & Summaries</p>
                                            {canManageMedicalReports && (
                                                <Button
                                                    size="sm"
                                                    variant="filled"
                                                    icon={Upload}
                                                    onClick={() => { setUploadType('report'); setShowUploadModal(true); }}
                                                >
                                                    + Upload Medical Report
                                                </Button>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            {(patientData.medicalFiles || []).filter((f: any) => f.file_type === 'report').map((file: any) => (
                                                <div key={file.id} className="flex items-center justify-between rounded-xl border border-black/[.1] dark:border-white/[.12] bg-white dark:bg-zinc-900 p-4">
                                                    <div className="flex items-center gap-3">
                                                        <FileCheck2 className="h-5 w-5 text-purple-600" />
                                                        <div>
                                                            <p className="text-sm font-bold text-foreground">{file.title}</p>
                                                            <p className="text-xs text-foreground/50">{file.file_name} • By {file.uploaded_by} • {file.created_at}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <a
                                                            href={file.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:underline px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800"
                                                        >
                                                            <Download className="h-3.5 w-3.5" /> Download Report
                                                        </a>
                                                        {canManageMedicalReports && (
                                                            <button
                                                                onClick={() => handleDeleteFile(file.id)}
                                                                className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                                                                title="Delete report"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                            {(patientData.medicalFiles || []).filter((f: any) => f.file_type === 'report').length === 0 && (
                                                <div className="rounded-xl border border-dashed border-black/[.15] dark:border-white/[.2] p-6 text-center text-xs text-foreground/50">
                                                    No clinical medical reports uploaded yet.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* CARD 4: Scans & External Uploads */}
                            <div className="rounded-2xl border border-black/[.12] dark:border-white/[.15] bg-white dark:bg-zinc-900 transition-all overflow-hidden shadow-xs">
                                <div
                                    onClick={() => setExpandedSection(expandedSection === "scans" ? null : "scans")}
                                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-black/[.01] dark:hover:bg-white/[.01] transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-black/[.1] dark:border-white/[.12] bg-zinc-50 dark:bg-zinc-800/80 text-foreground/80">
                                            <FileHeart className="h-5 w-5 text-foreground/80" />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-foreground">Scans & External Uploads</h4>
                                            <p className="text-xs text-foreground/60 mt-0.5">Manage physical uploads</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Download className="h-4 w-4 text-foreground/40" />
                                    </div>
                                </div>

                                {expandedSection === "scans" && (
                                    <div className="border-t border-black/[.08] dark:border-white/[.1] p-6 space-y-4 bg-zinc-50/50 dark:bg-zinc-900/50">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-semibold text-foreground/70">Uploaded Scans, Images & External Physical Files</p>
                                            {canManageScans && (
                                                <Button
                                                    size="sm"
                                                    variant="filled"
                                                    icon={Upload}
                                                    onClick={() => { setUploadType('scan'); setShowUploadModal(true); }}
                                                >
                                                    + Upload File / Scan
                                                </Button>
                                            )}
                                        </div>

                                        <div className="rounded-xl border border-black/[.12] bg-white dark:bg-zinc-900 dark:border-white/[.15] overflow-hidden">
                                            <table className="w-full text-left text-sm text-foreground">
                                                <thead className="border-b border-black/[.12] bg-black/[.02] text-xs uppercase text-foreground/60 dark:border-white/[.15] dark:bg-white/[.02]">
                                                    <tr>
                                                        <th className="px-6 py-4 font-medium">Document Title</th>
                                                        <th className="px-6 py-4 font-medium">Category</th>
                                                        <th className="px-6 py-4 font-medium">Uploaded By</th>
                                                        <th className="px-6 py-4 font-medium">Date</th>
                                                        <th className="px-6 py-4 text-right font-medium">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-black/[.08] dark:divide-white/[.145]">
                                                    {(patientData.medicalFiles || []).filter((f: any) => f.file_type === 'scan' || f.file_type === 'other' || !['consent', 'report'].includes(f.file_type)).map((file: any) => (
                                                        <tr key={file.id}>
                                                            <td className="px-6 py-4 font-bold text-foreground">
                                                                {file.title}
                                                                <span className="block text-xs font-normal text-foreground/50">{file.file_name}</span>
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4">
                                                                <span className="rounded bg-black/[.05] dark:bg-white/[.08] px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-foreground/80">
                                                                    {file.file_type || 'scan'}
                                                                </span>
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-xs text-foreground/80">
                                                                {file.uploaded_by || 'Staff'}
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-xs text-foreground/80">
                                                                {file.created_at}
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-right">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <a
                                                                        href={file.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:underline px-2.5 py-1 rounded border border-purple-200 dark:border-purple-800"
                                                                    >
                                                                        <Download className="h-3.5 w-3.5" /> Download
                                                                    </a>
                                                                    {canManageScans && (
                                                                        <button
                                                                            onClick={() => handleDeleteFile(file.id)}
                                                                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors"
                                                                            title="Delete file"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {(patientData.medicalFiles || []).filter((f: any) => f.file_type === 'scan' || f.file_type === 'other' || !['consent', 'report'].includes(f.file_type)).length === 0 && (
                                                        <tr>
                                                            <td colSpan={5} className="py-12 text-center text-foreground/50">
                                                                No uploaded scans or physical external files yet.
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
                    )}
                </div>
            </div>

            {/* MODAL 1: UPLOAD MEDICAL FILE (CLINICIAN / ADMIN) */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
                    <div className="w-full max-w-lg rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22] p-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-black/[.1] pb-3 dark:border-white/[.1]">
                            <h3 className="text-base font-bold text-foreground">Upload Medical Scan / Report</h3>
                            <button onClick={() => setShowUploadModal(false)} className="text-foreground/50 hover:text-foreground">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleFileUpload} className="mt-4 space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-foreground">Document Title *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., Growth Scan Report, Blood Test Result..."
                                    value={uploadTitle}
                                    onChange={(e) => setUploadTitle(e.target.value)}
                                    className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-purple-600 focus:outline-none dark:border-white/[.22]"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-foreground">Category / Type</label>
                                <select
                                    value={uploadType}
                                    onChange={(e) => setUploadType(e.target.value)}
                                    className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-purple-600 focus:outline-none dark:border-white/[.22]"
                                >
                                    <option value="scan">Ultrasound / Image Scan</option>
                                    <option value="report">Blood Test / Medical Report</option>
                                    <option value="consent">Signed Consent Form</option>
                                    <option value="image">Clinical Photo</option>
                                    <option value="other">Other Document</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-foreground">Select File *</label>
                                <input
                                    type="file"
                                    required
                                    onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                                    className="w-full text-xs text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-foreground">Notes / Observations</label>
                                <textarea
                                    rows={2}
                                    placeholder="Add any brief clinical observation or file note..."
                                    value={uploadNotes}
                                    onChange={(e) => setUploadNotes(e.target.value)}
                                    className="w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 p-2.5 text-sm text-foreground focus:border-purple-600 focus:outline-none dark:border-white/[.22]"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="outline" onClick={() => setShowUploadModal(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="filled" disabled={uploading}>
                                    {uploading ? "Uploading..." : "Upload File"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: ADD/EDIT CLINICAL SOAP NOTE (CLINICIAN / ADMIN) */}
            {showNoteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
                    <div className="w-full max-w-2xl rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22] p-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-black/[.1] pb-3 dark:border-white/[.1]">
                            <h3 className="text-base font-bold text-foreground">Clinical Consultation SOAP Note</h3>
                            <button onClick={() => setShowNoteModal(false)} className="text-foreground/50 hover:text-foreground">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveClinicalNote} className="mt-4 space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-foreground">Associated Appointment *</label>
                                    <select
                                        value={noteAppointmentId}
                                        onChange={(e) => setNoteAppointmentId(e.target.value)}
                                        className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-purple-600 focus:outline-none dark:border-white/[.22]"
                                    >
                                        <option value="">-- Select Appointment --</option>
                                        {allAppointments.map((apt: any) => (
                                            <option key={apt.id} value={apt.rawId || apt.id}>
                                                {apt.id} - {apt.service} ({apt.date})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-foreground">Status</label>
                                    <select
                                        value={noteStatus}
                                        onChange={(e) => setNoteStatus(e.target.value)}
                                        className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-purple-600 focus:outline-none dark:border-white/[.22]"
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Finalized">Finalized (Signed)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-foreground">Subjective (Patient Symptoms)</label>
                                    <textarea
                                        rows={3}
                                        value={noteSubjective}
                                        onChange={(e) => setNoteSubjective(e.target.value)}
                                        placeholder="Patient symptoms, chief complaint..."
                                        className="w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 p-2.5 text-xs text-foreground focus:border-purple-600 focus:outline-none dark:border-white/[.22]"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-foreground">Objective (Scan Observations)</label>
                                    <textarea
                                        rows={3}
                                        value={noteObjective}
                                        onChange={(e) => setNoteObjective(e.target.value)}
                                        placeholder="Ultrasound scan findings, vitals..."
                                        className="w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 p-2.5 text-xs text-foreground focus:border-purple-600 focus:outline-none dark:border-white/[.22]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-foreground">Assessment (Diagnosis)</label>
                                    <textarea
                                        rows={3}
                                        value={noteAssessment}
                                        onChange={(e) => setNoteAssessment(e.target.value)}
                                        placeholder="Diagnosis, clinical impression..."
                                        className="w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 p-2.5 text-xs text-foreground focus:border-purple-600 focus:outline-none dark:border-white/[.22]"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-foreground">Plan (Next Steps / Referral)</label>
                                    <textarea
                                        rows={3}
                                        value={notePlan}
                                        onChange={(e) => setNotePlan(e.target.value)}
                                        placeholder="Follow-up scan, referral, advice..."
                                        className="w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 p-2.5 text-xs text-foreground focus:border-purple-600 focus:outline-none dark:border-white/[.22]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-foreground">Private Internal Staff Note</label>
                                <textarea
                                    rows={2}
                                    value={noteInternal}
                                    onChange={(e) => setNoteInternal(e.target.value)}
                                    placeholder="Internal staff comments..."
                                    className="w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 p-2.5 text-xs text-foreground focus:border-purple-600 focus:outline-none dark:border-white/[.22]"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="outline" onClick={() => setShowNoteModal(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="filled" disabled={savingNote}>
                                    {savingNote ? "Saving..." : (noteStatus === 'Finalized' ? 'Finalize & Sign Note' : 'Save Draft Note')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
