"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, ChevronRight, CheckCircle2, ChevronLeft, Calendar as CalendarIcon, Clock, CreditCard, User, FileText, Check, ShieldCheck, Stethoscope, Syringe, Users, UserPlus, AlertCircle } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/components/ui/toast";
import DatePickerField from "@/components/ui/date-picker";

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

export default function NewAppointmentPage() {
    const toast = useToast();
    const [currentStep, setCurrentStep] = useState(1);

    // Step 1 State: Patient & Consent
    const [patientType, setPatientType] = useState<"new" | "existing">("new");
    const [patientSearch, setPatientSearch] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedPatientId, setSelectedPatientId] = useState<any>(null);

    // Email matching states
    const [checkingEmail, setCheckingEmail] = useState(false);
    const [customerMatch, setCustomerMatch] = useState<{
        exists: boolean;
        customer: any;
        patients: any[];
    } | null>(null);
    const [isAddingDependent, setIsAddingDependent] = useState(false);

    const [patientInfo, setPatientInfo] = useState({
        title: "",
        firstName: "",
        lastName: "",
        fullName: "",
        dob: "",
        gender: "Female",
        email: "",
        mobile: "",
        addressLine1: "",
        addressLine2: "",
        suburb: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United Kingdom",
        emergencyContact: "",
        medicalInfo: "",
        questionnaire: ""
    });

    // Step 2 State: Service & Schedule
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedServices, setSelectedServices] = useState<any[]>([]);
    const selectedService = selectedServices[0] || null;
    const setSelectedService = (s: any) => setSelectedServices(s ? [s] : []);
    const [selectedClinician, setSelectedClinician] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    // Step 3 State: Payment & Confirm
    const [paymentMethod, setPaymentMethod] = useState("pay_at_clinic");
    const [submitting, setSubmitting] = useState(false);

    // Final Confirmation
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [bookingRef, setBookingRef] = useState("");
    // Step steps definition
    const steps = [
        { id: 1, title: "Patient Info", icon: User },
        { id: 2, title: "Service & Schedule", icon: CalendarIcon },
        { id: 3, title: "Payment & Confirm", icon: CreditCard },
    ];

    const timeSlots = [
        "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
        "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", 
        "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM"
    ];

    const [servicesList, setServicesList] = useState<any[]>(servicesData);

    // Fetch Services List from DB
    useEffect(() => {
        apiClient('/services')
            .then(res => {
                if (res.data && res.data.length > 0) {
                    setServicesList(res.data);
                }
            })
            .catch(() => {});
    }, []);

    const filteredServices = servicesList.filter(s => {
        const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
        const sName = s.name || s.title || "";
        const matchesSearch = sName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Clinicians & Available slots state
    const [staffList, setStaffList] = useState<any[]>([]);
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);

    // Fetch Staff List for Clinician Selection (Only Clinicians)
    useEffect(() => {
        apiClient('/staff?role=clinician')
            .then(res => {
                if (res.data && res.data.length > 0) {
                    const cliniciansOnly = res.data.filter((s: any) => s.role === 'clinician');
                    setStaffList(cliniciansOnly.length > 0 ? cliniciansOnly : res.data);
                } else {
                    setStaffList([
                        { id: "1", rawId: 1, name: "Dr. Sarah Jenkins", role: "clinician", specialization: "Obstetrics & Lead Sonographer", status: "active", availability: "available" },
                        { id: "2", rawId: 2, name: "Dr. Marcus Thorne", role: "clinician", specialization: "Lead Sonographer", status: "active", availability: "available" },
                        { id: "3", rawId: 3, name: "Nurse Sarah", role: "clinician", specialization: "Phlebotomist & Nurse", status: "active", availability: "available" },
                    ]);
                }
            })
            .catch(() => {
                setStaffList([
                    { id: "1", rawId: 1, name: "Dr. Sarah Jenkins", role: "clinician", specialization: "Obstetrics & Lead Sonographer", status: "active", availability: "available" },
                    { id: "2", rawId: 2, name: "Dr. Marcus Thorne", role: "clinician", specialization: "Lead Sonographer", status: "active", availability: "available" },
                    { id: "3", rawId: 3, name: "Nurse Sarah", role: "clinician", specialization: "Phlebotomist & Nurse", status: "active", availability: "available" },
                ]);
            });
    }, []);

    // Fetch Booked Slots when Date or Clinician changes
    useEffect(() => {
        if (!selectedDate || !selectedClinician) {
            setBookedSlots([]);
            return;
        }

        const clinicianId = typeof selectedClinician === 'object' ? ((selectedClinician as any).rawId || (selectedClinician as any).id) : selectedClinician;
        apiClient(`/appointments/booked-slots?date=${encodeURIComponent(selectedDate)}&staff_id=${encodeURIComponent(clinicianId)}`)
            .then(res => {
                if (res.bookedSlots) setBookedSlots(res.bookedSlots);
            })
            .catch(() => setBookedSlots([]));
    }, [selectedDate, selectedClinician]);

    // Patient Search Autocomplete
    useEffect(() => {
        if (patientType !== "existing") return;
        if (!patientSearch.trim()) {
            setSearchResults([]);
            return;
        }

        const timer = setTimeout(() => {
            apiClient(`/patients/search?q=${encodeURIComponent(patientSearch)}`)
                .then(res => {
                    if (res.data) setSearchResults(res.data);
                })
                .catch(() => setSearchResults([]));
        }, 300);

        return () => clearTimeout(timer);
    }, [patientSearch, patientType]);

    // Handle Email Lookup for New Patient Creation
    const handleCheckEmail = async (emailToCheck?: string) => {
        const targetEmail = (emailToCheck !== undefined ? emailToCheck : patientInfo.email).trim();
        if (!targetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail)) return;

        setCheckingEmail(true);
        try {
            const res = await apiClient(`/patients/check-email?email=${encodeURIComponent(targetEmail)}`);
            if (res.exists) {
                setCustomerMatch({
                    exists: true,
                    customer: res.customer,
                    patients: res.patients || []
                });
                // Auto select first existing patient under customer if available
                if (res.patients && res.patients.length > 0) {
                    const firstP = res.patients[0];
                    setSelectedPatientId(firstP.id);
                    setPatientInfo(prev => ({
                        ...prev,
                        firstName: firstP.first_name,
                        lastName: firstP.last_name,
                        fullName: firstP.name || `${firstP.first_name} ${firstP.last_name}`,
                        dob: firstP.dob || "",
                        gender: firstP.gender || "Female",
                        mobile: firstP.phone || prev.mobile,
                    }));
                }
            } else {
                setCustomerMatch({ exists: false, customer: null, patients: [] });
                setSelectedPatientId(null);
            }
        } catch (err: any) {
            console.error("Email check failed:", err.message);
        } finally {
            setCheckingEmail(false);
        };
    };

    const handleConfirmBooking = async () => {
        if (selectedServices.length === 0 || !selectedClinician || !selectedDate || !selectedTime) {
            toast.error("Missing Info", "Please select at least one service, a clinician, date, and available time slot.");
            return;
        }

        if (bookedSlots.includes(selectedTime)) {
            toast.error("Slot Unavailable", "This time slot has already been booked for this clinician. Please select another slot.");
            return;
        }

        setSubmitting(true);
        try {
            let finalPatientId = selectedPatientId;

            // Scenario A: Customer Exists & Admin selected "Add New Dependent Patient under Customer"
            if (patientType === "new" && customerMatch?.exists && isAddingDependent) {
                const res = await apiClient('/patients/create-under-customer', {
                    method: 'POST',
                    body: JSON.stringify({
                        customer_id: customerMatch.customer.id,
                        first_name: patientInfo.firstName,
                        last_name: patientInfo.lastName,
                        dob: patientInfo.dob || null,
                        gender: patientInfo.gender,
                        email: patientInfo.email,
                        phone: patientInfo.mobile,
                    })
                });
                finalPatientId = res.data.id;
            }
            // Scenario B: Brand New Customer + Patient
            else if (patientType === "new" && (!customerMatch || !customerMatch.exists) && !finalPatientId) {
                const res = await apiClient('/patients/create-with-customer', {
                    method: 'POST',
                    body: JSON.stringify({
                        first_name: patientInfo.firstName,
                        last_name: patientInfo.lastName,
                        email: patientInfo.email,
                        phone: patientInfo.mobile,
                        dob: patientInfo.dob || null,
                        gender: patientInfo.gender,
                        title: patientInfo.title,
                        address_line_1: patientInfo.addressLine1,
                        city: patientInfo.city,
                        zip_code: patientInfo.zipCode,
                    })
                });
                finalPatientId = res.data.patient_id;
            }

            if (!finalPatientId) {
                toast.error("Patient Error", "Please select or create a valid patient.");
                setSubmitting(false);
                return;
            }

            // Resolve numeric service_ids and primary service_id
            const serviceIds = selectedServices.map(s => {
                if (typeof s.id === 'number') return s.id;
                if (s.rawId) return s.rawId;
                const parsed = parseInt(String(s.id).replace(/\D/g, ''), 10);
                return isNaN(parsed) || parsed <= 0 ? 1 : parsed;
            });
            const finalServiceId = serviceIds[0] || 1;

            // Resolve staff_id
            let finalStaffId = null;
            if (selectedClinician) {
                if (typeof selectedClinician === 'object') {
                    finalStaffId = (selectedClinician as any).rawId || (selectedClinician as any).id;
                } else {
                    finalStaffId = selectedClinician;
                }
            }

            // Create Appointment
            const aptRes = await apiClient('/appointments', {
                method: 'POST',
                body: JSON.stringify({
                    patient_id: finalPatientId,
                    service_id: finalServiceId,
                    service_ids: serviceIds,
                    appointment_date: selectedDate,
                    start_time: selectedTime,
                    staff_id: finalStaffId,
                    notes: patientInfo.medicalInfo || null,
                })
            });

            setBookingRef(aptRes.data?.appointment_code || (aptRes.data?.id ? `APT-${String(aptRes.data.id).padStart(4, '0')}` : "APT-0001"));
            setIsConfirmed(true);
            toast.success("Appointment Scheduled", "Booking successfully saved.");
        } catch (err: any) {
            console.error("Failed to book appointment:", err.message);
            toast.error("Booking Failed", err.message || "Could not save appointment.");
        } finally {
            setSubmitting(false);
        }
    };

    if (isConfirmed) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center p-8">
                <div className="flex max-w-md flex-col items-center justify-center rounded-2xl border border-black/[.15] bg-white dark:bg-zinc-900 p-12 text-center dark:border-white/[.22]">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500 animate-in zoom-in duration-500 ease-out">
                        <style>{`
                            @keyframes drawCheck {
                                to { stroke-dashoffset: 0; }
                            }
                            .animate-check {
                                stroke-dasharray: 24;
                                stroke-dashoffset: 24;
                                animation: drawCheck 0.5s 0.2s ease-in-out forwards;
                            }
                        `}</style>
                        <svg className="h-10 w-10 text-green-600 dark:text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path className="animate-check" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Booking Confirmed!</h1>
                    <p className="mt-2 text-foreground/70">
                        The appointment for {patientInfo.fullName || "the patient"} has been successfully scheduled.
                    </p>
                    <div className="mt-6 w-full rounded-xl bg-black/[.04] dark:bg-white/[.04] p-4 text-left space-y-2">
                        <div>
                            <p className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Booking Reference</p>
                            <p className="text-xl font-mono font-bold text-foreground tracking-widest">{bookingRef}</p>
                        </div>
                    </div>
                    <div className="mt-8 flex w-full flex-col gap-3">
                        <Link href="/dashboard/overview" className="w-full">
                            <Button variant="filled" className="w-full">Back to Overview</Button>
                        </Link>
                        <Button variant="outline" className="w-full" onClick={() => {
                            setCurrentStep(1);
                            setSelectedService(null);
                            setSelectedClinician("");
                            setSelectedDate("");
                            setSelectedTime("");
                            setSelectedPatientId(null);
                            setCustomerMatch(null);
                            setIsAddingDependent(false);
                            setPatientInfo({
                                title: "",
                                firstName: "",
                                lastName: "",
                                fullName: "",
                                dob: "",
                                gender: "Female",
                                email: "",
                                mobile: "",
                                addressLine1: "",
                                addressLine2: "",
                                suburb: "",
                                city: "",
                                state: "",
                                zipCode: "",
                                country: "United Kingdom",
                                emergencyContact: "",
                                medicalInfo: "",
                                questionnaire: ""
                            });
                            setIsConfirmed(false);
                        }}>Book Another</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full flex-col">
            {/* Header & Progress Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-black/[.15] px-8 py-5 dark:border-white/[.22]">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/overview">
                        <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full border border-black/[.15] bg-white text-foreground hover:bg-black/[.04] dark:border-white/[.22] dark:bg-zinc-900 dark:hover:bg-white/[.04] transition-colors">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground">New Appointment</h1>
                        <p className="text-xs text-foreground/60">Complete the flow to book a patient.</p>
                    </div>
                </div>

                {/* Progressive Bar */}
                <div className="relative w-full md:w-[380px] shrink-0">
                    <div className="absolute left-0 top-[16px] -z-10 h-[3px] w-full rounded-full bg-black/[.08] dark:bg-white/[.145]"></div>
                    <div className="absolute left-0 top-[16px] -z-10 h-[3px] rounded-full bg-blue-600 transition-all duration-500 ease-in-out" style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}></div>

                    <div className="flex justify-between">
                        {steps.map((step, idx) => (
                            <div key={step.id} className="flex flex-col items-center gap-1.5">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full border-1 transition-all duration-300 ${currentStep > step.id ? "border-blue-600 bg-blue-600 text-white scale-105" : currentStep === step.id ? "border-blue-600 bg-white dark:bg-zinc-900 text-blue-600 scale-105" : "border-black/[.15] dark:border-white/[.2] bg-white dark:bg-zinc-900 text-foreground/40"}`}>
                                    {currentStep > step.id ? <Check className="h-4 w-4 animate-in zoom-in-50 duration-300" /> : <step.icon className="h-4 w-4" />}
                                </div>
                                <span className={`text-[10px] font-semibold transition-colors duration-300 ${currentStep >= step.id ? "text-foreground" : "text-foreground/40"}`}>{step.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-auto p-8 thin-scrollbar">
                <div className="mx-auto max-w-4xl rounded-2xl border border-black/[.15] bg-white dark:bg-zinc-900 p-8 dark:border-white/[.22]">

                    {/* STEP 2: SERVICE & SCHEDULE */}
                    {currentStep === 2 && (
                        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-8 duration-500">

                            {/* Service Selection */}
                            <div className="flex flex-col gap-4">
                                <h2 className="text-lg font-bold text-foreground">1. Select Service</h2>

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex gap-2">
                                        {["All", "Pregnancy Scans", "Blood Tests"].map(cat => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setSelectedCategory(cat)}
                                                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${selectedCategory === cat ? "bg-blue-600 text-white" : "bg-black/[.04] dark:bg-white/[.04] text-foreground hover:bg-black/[.08] dark:hover:bg-white/[.08]"}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                                        <input
                                            type="text"
                                            placeholder="Search services..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 pl-9 pr-4 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22] sm:w-64"
                                        />
                                    </div>
                                </div>

                                {/* Sectional Grouping of Services */}
                                {Object.entries(
                                    filteredServices.reduce((acc, s) => {
                                        const cat = s.category || "General Services";
                                        if (!acc[cat]) acc[cat] = [];
                                        acc[cat].push(s);
                                        return acc;
                                    }, {} as Record<string, typeof filteredServices>)
                                ).map(([categoryName, services]: [string, any]) => (
                                    <div key={categoryName} className="mt-2 flex flex-col gap-3">
                                        <div className="flex items-center gap-2 border-b border-black/[.08] dark:border-white/[.1] pb-1.5">
                                            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                                {categoryName}
                                            </span>
                                            <span className="text-[11px] font-medium text-foreground/50">
                                                ({(services as any[]).length} available)
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                                            {(services as any[]).map((service: any) => {
                                                const isChecked = selectedServices.some(s => s.id === service.id);
                                                return (
                                                    <div
                                                        key={service.id}
                                                        onClick={() => {
                                                            setSelectedServices(prev => {
                                                                const exists = prev.some(s => s.id === service.id);
                                                                if (exists) {
                                                                    return prev.filter(s => s.id !== service.id);
                                                                } else {
                                                                    return [...prev, service];
                                                                }
                                                            });
                                                            setSelectedClinician("");
                                                            setSelectedDate("");
                                                            setSelectedTime("");
                                                        }}
                                                        className={`cursor-pointer rounded-xl border p-4 transition-all hover:-translate-y-1 ${isChecked ? "border-blue-600 bg-blue-600/5 ring-1 ring-blue-600/30 dark:bg-blue-600/10" : "border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22] hover:border-black/[.15] dark:hover:border-white/[.3]"}`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    readOnly
                                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                                />
                                                                <span className="text-xs font-bold uppercase tracking-wider text-black/60">{service.category}</span>
                                                            </div>
                                                            <span className="text-sm font-bold text-foreground">£{service.price}</span>
                                                        </div>
                                                        <h3 className="mt-2 font-bold text-foreground">{service.name || service.title}</h3>
                                                        <div className="mt-2 flex items-center gap-2 text-xs text-foreground/60">
                                                            <Clock className="h-3 w-3" />
                                                            {service.duration || '30 mins'}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Multi-Service Selected Summary */}
                            {selectedServices.length > 0 && (
                                <div className="mt-2 rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-900/40 dark:bg-blue-950/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                                            Checked Services ({selectedServices.length})
                                        </span>
                                        <p className="text-sm font-semibold text-foreground mt-0.5">
                                            {selectedServices.map(s => s.name || s.title).join(" • ")}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-foreground/60 block">Total Price</span>
                                        <span className="text-lg font-extrabold text-blue-700 dark:text-blue-300">
                                            £{selectedServices.reduce((sum, s) => sum + (Number(s.price) || 0), 0)}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <hr className="border-black/[.15] dark:border-white/[.22]" />

                            {/* Clinician Selection */}
                            <div className={`flex flex-col gap-6 transition-opacity duration-300 ${!selectedService ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
                                <h2 className="text-lg font-bold text-foreground">2. Select Clinician / Staff</h2>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                                    {staffList.map((c: any) => {
                                        const cId = c.rawId || c.id;
                                        const selectedId = typeof selectedClinician === 'object' ? ((selectedClinician as any).rawId || (selectedClinician as any).id) : selectedClinician;
                                        const isSelected = selectedId === cId || selectedClinician === c.name;

                                        return (
                                            <button
                                                type="button"
                                                key={c.id || c.name}
                                                onClick={() => {
                                                    setSelectedClinician(cId);
                                                    setSelectedDate("");
                                                    setSelectedTime("");
                                                }}
                                                className={`rounded-xl border p-4 text-left transition-all flex items-start gap-3 ${isSelected ? "border-blue-600 bg-blue-600/5 ring-1 ring-blue-600/30 dark:bg-blue-600/10 text-blue-600" : "border-black/[.15] bg-white dark:bg-zinc-900 text-foreground hover:border-black/[.3] dark:border-white/[.22]"}`}
                                            >
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                                    {c.name.includes("Nurse") || c.role === "nurse" ? <Syringe className="h-5 w-5" /> : <Stethoscope className="h-5 w-5" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-foreground">{c.name}</p>
                                                    <p className="text-xs text-foreground/60">{c.specialization || c.role}</p>
                                                    <span className="mt-1 inline-block text-[10px] font-mono font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded dark:bg-blue-950/60">
                                                        {c.id || ('STF-' + c.rawId)}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <hr className="border-black/[.15] dark:border-white/[.22]" />

                            {/* Date & Time Selection */}
                            <div className={`flex flex-col gap-6 transition-opacity duration-300 ${(!selectedService || !selectedClinician) ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
                                <h2 className="text-lg font-bold text-foreground">3. Date & Time Selection</h2>

                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-foreground/80">Select Date</label>
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => {
                                                setSelectedDate(e.target.value);
                                                setSelectedTime("");
                                            }}
                                            className="h-12 w-full rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 px-4 text-sm text-foreground focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-white/[.22]"
                                        />
                                    </div>

                                    <div className={`transition-opacity duration-300 ${!selectedDate ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
                                        <label className="mb-2 block text-sm font-semibold text-foreground/80">
                                            Available Time Slots {selectedDate && <span className="text-xs font-normal text-foreground/60">(Select a free slot)</span>}
                                        </label>
                                        <div className="flex flex-wrap gap-2.5">
                                            {timeSlots.map(time => {
                                                const isBooked = bookedSlots.includes(time);
                                                const isSelected = selectedTime === time;

                                                return (
                                                    <button
                                                        key={time}
                                                        type="button"
                                                        disabled={isBooked}
                                                        onClick={() => setSelectedTime(time)}
                                                        className={`relative rounded-lg border px-3.5 py-2 text-sm font-semibold transition-all ${
                                                            isBooked
                                                                ? "border-red-200 bg-red-50 text-red-400 line-through cursor-not-allowed dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-500/60"
                                                                : isSelected
                                                                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                                                                : "border-black/[.15] bg-white text-foreground hover:border-blue-600 dark:bg-zinc-900 dark:border-white/[.22]"
                                                        }`}
                                                    >
                                                        {time}
                                                        {isBooked && (
                                                            <span className="ml-1.5 rounded bg-red-100 px-1 py-0.2 text-[9px] font-bold text-red-700 no-underline dark:bg-red-950 dark:text-red-300">
                                                                Booked
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* STEP 1: PATIENT INFO & CONSENT */}
                    {currentStep === 1 && (
                        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <h2 className="text-lg font-bold text-foreground">Patient Information</h2>
                                    <div className="flex gap-2 rounded-xl bg-black/[.04] dark:bg-white/[.04] p-1 self-start">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPatientType("new");
                                                setPatientInfo({
                                                    title: "",
                                                    firstName: "",
                                                    lastName: "",
                                                    fullName: "",
                                                    dob: "",
                                                    gender: "Female",
                                                    email: "",
                                                    mobile: "",
                                                    addressLine1: "",
                                                    addressLine2: "",
                                                    suburb: "",
                                                    city: "",
                                                    state: "",
                                                    zipCode: "",
                                                    country: "United Kingdom",
                                                    emergencyContact: "",
                                                    medicalInfo: "",
                                                    questionnaire: ""
                                                });
                                            }}
                                            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${patientType === "new" ? "bg-blue-600 text-white shadow-sm" : "text-foreground/60 hover:text-foreground"}`}
                                        >
                                            New Patient
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPatientType("existing")}
                                            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${patientType === "existing" ? "bg-blue-600 text-white shadow-sm" : "text-foreground/60 hover:text-foreground"}`}
                                        >
                                            Existing Patient
                                        </button>
                                    </div>
                                </div>

                                {patientType === "existing" && (
                                    <div className="flex flex-col gap-4 rounded-xl border border-black/[.15] bg-black/[.02] dark:bg-white/[.02] p-4 dark:border-white/[.22]">
                                        <label className="text-sm font-semibold text-foreground/80">Search Existing Patient (Name, Email, or Code)</label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                                            <input
                                                type="text"
                                                placeholder="Search by name, email, or PAT-1001..."
                                                value={patientSearch}
                                                onChange={(e) => setPatientSearch(e.target.value)}
                                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 pl-9 pr-4 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22]"
                                            />
                                        </div>

                                        {patientSearch && (
                                            <div className="mt-2 max-h-56 overflow-y-auto divide-y divide-black/[.08] dark:divide-white/[.145] rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22]">
                                                {searchResults.length === 0 ? (
                                                    <p className="p-3 text-sm text-foreground/50">No matching patients found.</p>
                                                ) : (
                                                    searchResults.map(p => (
                                                        <div
                                                            key={p.id}
                                                            onClick={() => {
                                                                setSelectedPatientId(p.id);
                                                                setPatientInfo({
                                                                    title: "",
                                                                    firstName: p.firstName || p.name.split(' ')[0],
                                                                    lastName: p.lastName || p.name.split(' ').slice(1).join(' '),
                                                                    fullName: p.name,
                                                                    dob: p.dob || "",
                                                                    gender: p.gender || "Female",
                                                                    email: p.email || "",
                                                                    mobile: p.phone || "",
                                                                    addressLine1: "",
                                                                    addressLine2: "",
                                                                    suburb: "",
                                                                    city: "",
                                                                    state: "",
                                                                    zipCode: "",
                                                                    country: "United Kingdom",
                                                                    emergencyContact: "",
                                                                    medicalInfo: "",
                                                                    questionnaire: ""
                                                                });
                                                                setPatientSearch("");
                                                            }}
                                                            className={`flex cursor-pointer items-center justify-between p-3 transition-colors ${selectedPatientId === p.id ? "bg-blue-50 dark:bg-blue-950/40" : "hover:bg-black/[.02] dark:hover:bg-white/[.02]"}`}
                                                        >
                                                            <div>
                                                                <p className="text-sm font-semibold text-foreground">{p.name}</p>
                                                                <p className="text-xs text-foreground/50">DOB: {p.dob || 'N/A'} • Email: {p.email || 'N/A'}</p>
                                                            </div>
                                                            <span className="text-xs font-mono font-bold text-blue-600">{p.patient_code || p.id}</span>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {patientType === "new" && (
                                    <div className="flex flex-col gap-5">
                                        {/* Email check section */}
                                        <div className="flex flex-col gap-2 rounded-xl border border-blue-500/20 bg-blue-50/50 p-4 dark:bg-blue-950/20">
                                            <label className="text-sm font-bold text-foreground">Patient / Customer Email Check</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="email"
                                                    placeholder="Enter email to check customer account..."
                                                    value={patientInfo.email}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        setPatientInfo(prev => ({ ...prev, email: val }));
                                                        setCustomerMatch(null);
                                                    }}
                                                    onBlur={() => handleCheckEmail()}
                                                    className="h-10 flex-1 rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22]"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => handleCheckEmail()}
                                                    disabled={checkingEmail || !patientInfo.email}
                                                    className="h-10 text-xs font-bold"
                                                >
                                                    {checkingEmail ? "Checking..." : "Check Email"}
                                                </Button>
                                            </div>

                                            {/* Customer Match Notification Banner */}
                                            {customerMatch && customerMatch.exists && (
                                                <div className="mt-3 flex flex-col gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-700/50 dark:bg-amber-950/30">
                                                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                                                        <AlertCircle className="h-5 w-5 shrink-0" />
                                                        <div>
                                                            <p className="text-sm font-bold">Existing Customer Account Found!</p>
                                                            <p className="text-xs">Account Name: <strong>{customerMatch.customer.name}</strong> ({customerMatch.customer.email})</p>
                                                        </div>
                                                    </div>

                                                    <p className="text-xs font-semibold text-foreground/80">Select which patient under this customer account is receiving the scan:</p>

                                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                        {customerMatch.patients.map((p: any) => (
                                                            <div
                                                                key={p.id}
                                                                onClick={() => {
                                                                    setSelectedPatientId(p.id);
                                                                    setIsAddingDependent(false);
                                                                    setPatientInfo(prev => ({
                                                                        ...prev,
                                                                        firstName: p.first_name,
                                                                        lastName: p.last_name,
                                                                        fullName: p.name,
                                                                        dob: p.dob || "",
                                                                        gender: p.gender || "Female",
                                                                    }));
                                                                }}
                                                                className={`cursor-pointer rounded-lg border p-3 text-left transition-all ${selectedPatientId === p.id && !isAddingDependent ? "border-blue-600 bg-blue-600/10 ring-1 ring-blue-600" : "border-black/[.15] bg-white dark:bg-zinc-900 hover:border-black/[.3]"}`}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-xs font-bold font-mono text-blue-600">{p.patient_code}</span>
                                                                    {selectedPatientId === p.id && !isAddingDependent && <Check className="h-4 w-4 text-blue-600" />}
                                                                </div>
                                                                <p className="text-sm font-bold text-foreground mt-1">{p.name}</p>
                                                                <p className="text-xs text-foreground/60">DOB: {p.dob || 'N/A'} • Gender: {p.gender}</p>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setIsAddingDependent(true);
                                                            setSelectedPatientId(null);
                                                            setPatientInfo(prev => ({
                                                                ...prev,
                                                                firstName: "",
                                                                lastName: "",
                                                                fullName: "",
                                                                dob: "",
                                                            }));
                                                        }}
                                                        className={`mt-2 flex items-center justify-center gap-1.5 rounded-lg border border-dashed p-2.5 text-xs font-bold transition-colors ${isAddingDependent ? "border-blue-600 bg-blue-600 text-white" : "border-amber-400 bg-amber-100/50 text-amber-900 hover:bg-amber-100"}`}
                                                    >
                                                        <UserPlus className="h-4 w-4" />
                                                        + Add New Patient / Dependent under this Customer
                                                    </button>
                                                </div>
                                            )}

                                            {customerMatch && !customerMatch.exists && (
                                                <div className="mt-2 flex items-center gap-2 text-xs font-bold text-green-700 dark:text-green-400">
                                                    <Check className="h-4 w-4" />
                                                    No existing customer found. Ready to register new customer & primary patient.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                                    <div className="sm:col-span-1">
                                        <label className="mb-1.5 block text-sm font-semibold text-foreground/80">Title</label>
                                        <select
                                            value={patientInfo.title}
                                            onChange={(e) => setPatientInfo({ ...patientInfo, title: e.target.value })}
                                            disabled={patientType === "existing"}
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22] disabled:opacity-60"
                                        >
                                            <option value="">Select</option>
                                            <option value="Mrs">Mrs</option>
                                            <option value="Mr">Mr</option>
                                            <option value="Ms">Ms</option>
                                            <option value="Miss">Miss</option>
                                            <option value="Dr">Dr</option>
                                            <option value="Prof">Prof</option>
                                        </select>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <label className="mb-1.5 block text-sm font-semibold text-foreground/80">First Name *</label>
                                        <input
                                            type="text"
                                            placeholder="Sarah"
                                            value={patientInfo.firstName}
                                            onChange={(e) => setPatientInfo({ ...patientInfo, firstName: e.target.value, fullName: `${e.target.value} ${patientInfo.lastName}`.trim() })}
                                            disabled={patientType === "existing"}
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22] disabled:opacity-60"
                                        />
                                    </div>
                                    <div className="sm:col-span-1">
                                        <label className="mb-1.5 block text-sm font-semibold text-foreground/80">Last Name *</label>
                                        <input
                                            type="text"
                                            placeholder="Vance"
                                            value={patientInfo.lastName}
                                            onChange={(e) => setPatientInfo({ ...patientInfo, lastName: e.target.value, fullName: `${patientInfo.firstName} ${e.target.value}`.trim() })}
                                            disabled={patientType === "existing"}
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22] disabled:opacity-60"
                                        />
                                    </div>
                                    <div className="sm:col-span-1">
                                        <label className="mb-1.5 block text-sm font-semibold text-foreground/80">Gender</label>
                                        <select
                                            value={patientInfo.gender}
                                            onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })}
                                            disabled={patientType === "existing"}
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22] disabled:opacity-60"
                                        >
                                            <option value="Female">Female</option>
                                            <option value="Male">Male</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-foreground/80">Date of Birth</label>
                                        <DatePickerField
                                            value={patientInfo.dob}
                                            onChange={(v) => setPatientInfo({ ...patientInfo, dob: v })}
                                            disabled={patientType === "existing"}
                                            maxDate={new Date()}
                                            placeholder="Select date of birth"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-foreground/80">Email Address *</label>
                                        <input
                                            type="email"
                                            placeholder="sarah@example.com"
                                            value={patientInfo.email}
                                            onChange={(e) => setPatientInfo({ ...patientInfo, email: e.target.value })}
                                            disabled={patientType === "existing"}
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22] disabled:opacity-60"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-foreground/80">Mobile Number</label>
                                        <input
                                            type="text"
                                            placeholder="+44 7700 900000"
                                            value={patientInfo.mobile}
                                            onChange={(e) => setPatientInfo({ ...patientInfo, mobile: e.target.value })}
                                            disabled={patientType === "existing"}
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22] disabled:opacity-60"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/70">Residential Address Details</h3>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-sm font-semibold text-foreground/80">Address Line 1</label>
                                            <input
                                                type="text"
                                                placeholder="123 Healthcare Way"
                                                value={patientInfo.addressLine1}
                                                onChange={(e) => setPatientInfo({ ...patientInfo, addressLine1: e.target.value })}
                                                disabled={patientType === "existing"}
                                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22] disabled:opacity-60"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-sm font-semibold text-foreground/80">Address Line 2</label>
                                            <input
                                                type="text"
                                                placeholder="Suite 4B"
                                                value={patientInfo.addressLine2}
                                                onChange={(e) => setPatientInfo({ ...patientInfo, addressLine2: e.target.value })}
                                                disabled={patientType === "existing"}
                                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22] disabled:opacity-60"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                        <div>
                                            <label className="mb-1.5 block text-sm font-semibold text-foreground/80">Suburb / District</label>
                                            <input
                                                type="text"
                                                placeholder="Camden"
                                                value={patientInfo.suburb}
                                                onChange={(e) => setPatientInfo({ ...patientInfo, suburb: e.target.value })}
                                                disabled={patientType === "existing"}
                                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22] disabled:opacity-60"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-sm font-semibold text-foreground/80">City</label>
                                            <input
                                                type="text"
                                                placeholder="London"
                                                value={patientInfo.city}
                                                onChange={(e) => setPatientInfo({ ...patientInfo, city: e.target.value })}
                                                disabled={patientType === "existing"}
                                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22] disabled:opacity-60"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-sm font-semibold text-foreground/80">State / Province</label>
                                            <input
                                                type="text"
                                                placeholder="Greater London"
                                                value={patientInfo.state}
                                                onChange={(e) => setPatientInfo({ ...patientInfo, state: e.target.value })}
                                                disabled={patientType === "existing"}
                                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22] disabled:opacity-60"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-sm font-semibold text-foreground/80">Postcode / Zip Code</label>
                                            <input
                                                type="text"
                                                placeholder="NW1 2DB"
                                                value={patientInfo.zipCode}
                                                onChange={(e) => setPatientInfo({ ...patientInfo, zipCode: e.target.value })}
                                                disabled={patientType === "existing"}
                                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22] disabled:opacity-60"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-foreground/80">Country</label>
                                        <input
                                            type="text"
                                            placeholder="United Kingdom"
                                            value={patientInfo.country}
                                            onChange={(e) => setPatientInfo({ ...patientInfo, country: e.target.value })}
                                            disabled={patientType === "existing"}
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22] disabled:opacity-60"
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-black/[.15] dark:border-white/[.22]" />

                            <div className="flex flex-col gap-6">
                                <h2 className="text-lg font-bold text-foreground">Medical History & Emergency</h2>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-foreground/80">Emergency Contact (Optional)</label>
                                        <input
                                            type="text"
                                            placeholder="Name & Phone"
                                            value={patientInfo.emergencyContact}
                                            onChange={(e) => setPatientInfo({ ...patientInfo, emergencyContact: e.target.value })}
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22]"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="mb-1.5 block text-sm font-semibold text-foreground/80">Medical History / Allergies / Notes</label>
                                        <textarea
                                            rows={3}
                                            placeholder="Any existing medical conditions, allergies, or past history notes..."
                                            value={patientInfo.medicalInfo}
                                            onChange={(e) => setPatientInfo({ ...patientInfo, medicalInfo: e.target.value })}
                                            className="w-full resize-none rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 p-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* <hr className="border-black/[.15] dark:border-white/[.22]" /> */}

                            {/* <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                                    <h2 className="text-lg font-bold text-foreground">Consent & Policies</h2>
                                </div>
                                <div className="flex flex-col gap-4 rounded-xl border border-black/[.15] bg-black/[.02] dark:bg-white/[.02] p-6 dark:border-white/[.22]">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input type="checkbox" checked={consent.policies} onChange={(e) => setConsent({ ...consent, policies: e.target.checked })} className="mt-1 h-4 w-4 rounded border-black/[.2] text-blue-600 focus:ring-blue-600" />
                                        <span className="text-sm text-foreground/80">I confirm the patient accepts the clinic policies regarding cancellations and delays.</span>
                                    </label>
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input type="checkbox" checked={consent.privacy} onChange={(e) => setConsent({ ...consent, privacy: e.target.checked })} className="mt-1 h-4 w-4 rounded border-black/[.2] text-blue-600 focus:ring-blue-600" />
                                        <span className="text-sm text-foreground/80">I confirm the patient accepts the Privacy Policy for data processing.</span>
                                    </label>
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input type="checkbox" checked={consent.digitalForms} onChange={(e) => setConsent({ ...consent, digitalForms: e.target.checked })} className="mt-1 h-4 w-4 rounded border-black/[.2] text-blue-600 focus:ring-blue-600" />
                                        <span className="text-sm text-foreground/80">Digital consent forms have been provided and reviewed.</span>
                                    </label>

                                    <div className="mt-4">
                                        <label className="mb-1.5 block text-sm font-semibold text-foreground/80">Electronic Signature (Staff Initials or Patient Name)</label>
                                        <input
                                            type="text"
                                            placeholder="Type name here to sign..."
                                            value={consent.signature}
                                            onChange={(e) => setConsent({ ...consent, signature: e.target.value })}
                                            className="h-10 w-full max-w-sm rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22]"
                                        />
                                    </div>
                                </div>
                            </div> */}

                        </div>
                    )}

                    {/* STEP 3: PAYMENT & CONFIRMATION */}
                    {currentStep === 3 && (
                        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-8 duration-500">

                            <div className="flex flex-col gap-6">
                                <h2 className="text-lg font-bold text-foreground">Review Appointment</h2>
                                <div className="rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-6 dark:border-white/[.22]">
                                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                                        <div>
                                            <p className="text-foreground/50 font-medium">Service</p>
                                            <p className="font-semibold text-foreground">{selectedService?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-foreground/50 font-medium">Total Price</p>
                                            <p className="font-semibold text-foreground">£{selectedService?.price}</p>
                                        </div>
                                        <div>
                                            <p className="text-foreground/50 font-medium">Clinician</p>
                                            <p className="font-semibold text-foreground">{selectedClinician}</p>
                                        </div>
                                        <div>
                                            <p className="text-foreground/50 font-medium">Date</p>
                                            <p className="font-semibold text-foreground">{selectedDate}</p>
                                        </div>
                                        <div>
                                            <p className="text-foreground/50 font-medium">Time</p>
                                            <p className="font-semibold text-foreground">{selectedTime}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-foreground/50 font-medium">Patient</p>
                                            <p className="font-semibold text-foreground">{patientInfo.fullName} ({patientInfo.email})</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-black/[.15] dark:border-white/[.22]" />

                            <div className="flex flex-col gap-6">
                                <h2 className="text-lg font-bold text-foreground">Payment Options</h2>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div
                                        onClick={() => setPaymentMethod("full")}
                                        className={`cursor-pointer rounded-xl border p-4 transition-all ${paymentMethod === "full" ? "border-blue-600 bg-blue-600/5 ring-1 ring-blue-600/30 dark:bg-blue-600/10" : "border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22] hover:border-black/[.15] dark:hover:border-white/[.3]"}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-4 w-4 items-center justify-center rounded-full border ${paymentMethod === "full" ? "border-blue-600" : "border-black/[.2] dark:border-white/[.3]"}`}>
                                                {paymentMethod === "full" && <div className="h-2 w-2 rounded-full bg-blue-600"></div>}
                                            </div>
                                            <span className="font-semibold text-foreground">Full Payment</span>
                                        </div>
                                        <p className="mt-2 text-xs text-foreground/60 ml-7">Pay £{selectedService?.price} now</p>
                                    </div>
                                    <div
                                        onClick={() => setPaymentMethod("deposit")}
                                        className={`cursor-pointer rounded-xl border p-4 transition-all ${paymentMethod === "deposit" ? "border-blue-600 bg-blue-600/5 ring-1 ring-blue-600/30 dark:bg-blue-600/10" : "border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22] hover:border-black/[.15] dark:hover:border-white/[.3]"}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-4 w-4 items-center justify-center rounded-full border ${paymentMethod === "deposit" ? "border-blue-600" : "border-black/[.2] dark:border-white/[.3]"}`}>
                                                {paymentMethod === "deposit" && <div className="h-2 w-2 rounded-full bg-blue-600"></div>}
                                            </div>
                                            <span className="font-semibold text-foreground">Deposit</span>
                                        </div>
                                        <p className="mt-2 text-xs text-foreground/60 ml-7">Pay 50% (£{selectedService ? selectedService.price / 2 : 0}) now to secure booking</p>
                                    </div>
                                    <div
                                        onClick={() => setPaymentMethod("pay_at_clinic")}
                                        className={`cursor-pointer rounded-xl border p-4 transition-all ${paymentMethod === "pay_at_clinic" ? "border-blue-600 bg-blue-600/5 ring-1 ring-blue-600/30 dark:bg-blue-600/10" : "border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22] hover:border-black/[.15] dark:hover:border-white/[.3]"}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-4 w-4 items-center justify-center rounded-full border ${paymentMethod === "pay_at_clinic" ? "border-blue-600" : "border-black/[.2] dark:border-white/[.3]"}`}>
                                                {paymentMethod === "pay_at_clinic" && <div className="h-2 w-2 rounded-full bg-blue-600"></div>}
                                            </div>
                                            <span className="font-semibold text-foreground">Pay at Clinic</span>
                                        </div>
                                        <p className="mt-2 text-xs text-foreground/60 ml-7">Settle payment on arrival</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Navigation */}
                <div className="mx-auto mt-6 flex max-w-4xl items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                        disabled={currentStep === 1}
                    >
                        Back
                    </Button>

                    {currentStep < 3 ? (
                        <Button
                            variant="filled"
                            onClick={() => setCurrentStep(prev => Math.min(3, prev + 1))}
                            disabled={
                                (currentStep === 1 && !patientInfo.fullName) ||
                                (currentStep === 2 && (!selectedService || !selectedClinician || !selectedDate || !selectedTime))
                            }
                        >
                            Continue to Step {currentStep + 1}
                        </Button>
                    ) : (
                        <Button
                            variant="filled"
                            onClick={handleConfirmBooking}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            Confirm Booking
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

