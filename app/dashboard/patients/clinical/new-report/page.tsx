"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  Save,
  FileText,
  Baby,
  Stethoscope,
  ClipboardCheck,
  HeartPulse,
  ShieldAlert,
  Footprints,
  TrendingUp,
  Heart,
  Activity,
  Droplet,
  Layers,
  BriefcaseMedical
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { apiClient } from "@/lib/api-client";
import { mockPatientsData } from "../../data";
import {
  ThreeDFourDScanForm,
  AnomalyScanForm,
  BookingSystemFieldsForm,
  EarlyPregnancyNormalForm,
  EarlyPregnancyAbnormalForm,
  GenderWellBeingForm,
  GrowthPresentationForm,
  ReassuranceScanForm,
  AbdominalUltrasoundForm,
  DVTUltrasoundForm,
  PelvicWellbeingForm,
  TesticularUltrasoundForm
} from "@/components/reports/report-forms";


type ReportType =
  | "3D 4D SCAN"
  | "ANOMALY SCAN"
  | "Booking System Fields"
  | "EARLY PREGNANCY- NORMAL template"
  | "EARLY PRENANCY - ABNORMAL Template"
  | "GENDER WELL BEING REPORT"
  | "GROWTH & PRESENTATION REPORT"
  | "REASSURANCE SCAN"
  | "US ABDOMINAL"
  | "US DEEP VEIN THROMBOSIS"
  | "US PELVIC WELLBEING"
  | "US TESTICULAR";

const REPORT_ICONS: Record<ReportType, any> = {
  "3D 4D SCAN": Baby,
  "ANOMALY SCAN": Stethoscope,
  "Booking System Fields": ClipboardCheck,
  "EARLY PREGNANCY- NORMAL template": HeartPulse,
  "EARLY PRENANCY - ABNORMAL Template": ShieldAlert,
  "GENDER WELL BEING REPORT": Footprints,
  "GROWTH & PRESENTATION REPORT": TrendingUp,
  "REASSURANCE SCAN": Heart,
  "US ABDOMINAL": Activity,
  "US DEEP VEIN THROMBOSIS": Droplet,
  "US PELVIC WELLBEING": Layers,
  "US TESTICULAR": BriefcaseMedical,
};

const REPORT_DISPLAY_TITLES: Record<ReportType, string> = {
  "3D 4D SCAN": "3D / 4D ULTRASOUND SCAN",
  "ANOMALY SCAN": "ANOMALY ULTRASOUND SCAN",
  "Booking System Fields": "Insight Health Services - Patient Registration & Booking System Requirements",
  "EARLY PREGNANCY- NORMAL template": "EARLY PREGNANCY REASSURANCE SCAN REPORT",
  "EARLY PRENANCY - ABNORMAL Template": "EARLY PREGNANCY REASSURANCE ULTRASOUND SCAN REPORT",
  "GENDER WELL BEING REPORT": "GENDER AND WELL BEING SCAN REPORT",
  "GROWTH & PRESENTATION REPORT": "GROWTH & PRESENTATION SCAN REPORT",
  "REASSURANCE SCAN": "REASSURANCE SCAN REPORT",
  "US ABDOMINAL": "ABDOMINAL ULTRASOUND SCAN REPORT",
  "US DEEP VEIN THROMBOSIS": "DEEP VENOUS ULTRASOUND SCAN REPORT",
  "US PELVIC WELLBEING": "PELVIC ULTRASOUND SCAN REPORT",
  "US TESTICULAR": "TESTICULAR ULTRASOUND SCAN REPORT",
};

function NewReportPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get("id") || "";

  const patient = mockPatientsData.find((p) => p.id === patientId);

  const [reportType, setReportType] = useState<ReportType>("3D 4D SCAN");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showModalContent, setShowModalContent] = useState(false);
  const [savedReportTitle, setSavedReportTitle] = useState("");

  // Dynamic form state
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Reset form data when report type changes
  useEffect(() => {
    const defaultData = getDefaultDataForReport(reportType);
    if (reportType === "Booking System Fields" && patient) {
      const nameParts = patient.name.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
      const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";

      setFormData({
        ...defaultData,
        patientId: patient.id,
        firstName,
        middleName,
        lastName,
        dob: patient.dob,
        gender: patient.gender,
        email: patient.email,
        mobile: patient.phone,
        addressLine1: patient.address,
        registrationDate: new Date().toISOString().split("T")[0]
      });
    } else {
      setFormData(defaultData);
    }
  }, [reportType, patient]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveReport = async (e: React.FormEvent) => {
    e.preventDefault();

    const docTitle = `${REPORT_DISPLAY_TITLES[reportType] || reportType} (PDF)`;

    if (patientId) {
      try {
        await apiClient(`/patients/${patientId}/clinical-reports`, {
          method: "POST",
          body: JSON.stringify({
            report_type: reportType,
            display_title: docTitle,
            report_data: formData,
            summary_findings: formData.clinicalObservations || formData.conclusion || formData.findings || null,
            recommendations: formData.recommendation || formData.advice || null,
            status: "Finalized",
          })
        });
      } catch (err: any) {
        console.error("Failed to save report to database:", err.message);
      }
    }

    const newDoc = {
      id: `DOC-${Math.floor(100 + Math.random() * 900)}`,
      title: docTitle,
      type: "Scan" as const,
      date: new Date().toISOString().split("T")[0],
      status: "Completed" as const,
      patientId: patientId
    };

    try {
      const storedDocs = JSON.parse(localStorage.getItem("insight_vault_documents") || "[]");
      localStorage.setItem("insight_vault_documents", JSON.stringify([newDoc, ...storedDocs]));
    } catch (err) {
      console.error("Failed to save document to medical vault", err);
    }

    setSavedReportTitle(docTitle);
    setShowModalContent(false);
    setShowSuccessModal(true);
    
    // Reveal text and buttons after animation completes
    setTimeout(() => {
      setShowModalContent(true);
    }, 1200);
  };

  const handleAddMoreReports = () => {
    setShowSuccessModal(false);
    setShowModalContent(false);
    setReportType("3D 4D SCAN");
  };

  return (
    <>
      <div className="mx-auto max-w-5xl py-6 px-4 lg:px-0 text-foreground min-h-screen">
        {/* Header */}
        <div className="mb-6 overflow-hidden flex items-center justify-between border-b border-black/[.1] pb-4 dark:border-white/[.1]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/dashboard/patients/clinical?id=${patientId}`)}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-black/15 hover:bg-black/[.05] dark:border-white/[.15] dark:hover:bg-white/[.05] transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Create Clinical Report</h1>
              <p className="text-sm text-foreground/60">
                Patient: <span className="font-semibold text-foreground">{patient ? patient.name : "Unknown Patient"}</span> ({patientId})
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/dashboard/patients/clinical?id=${patientId}`)}>
              Cancel
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-6 lg:gap-x-0">
          {/* Left sidebar: Select Report Type */}
          <div className="lg:col-span-1 flex flex-col lg:sticky lg:top-6 self-start border border-black/[.12] dark:border-white/[.12] lg:rounded-r-none rounded-t-lg lg:rounded-l-lg py-4 pl-4 pr-0 bg-white dark:bg-zinc-900">
            <label className="text-xs font-bold uppercase tracking-wider text-foreground/60 mb-2 pl-1">Report Type</label>
            <div className="flex flex-col max-h-[80vh] overflow-y-auto pr-0 thin-scrollbar">
              {(
                [
                  "3D 4D SCAN",
                  "ANOMALY SCAN",
                  "Booking System Fields",
                  "EARLY PREGNANCY- NORMAL template",
                  "EARLY PRENANCY - ABNORMAL Template",
                  "GENDER WELL BEING REPORT",
                  "GROWTH & PRESENTATION REPORT",
                  "REASSURANCE SCAN",
                  "US ABDOMINAL",
                  "US DEEP VEIN THROMBOSIS",
                  "US PELVIC WELLBEING",
                  "US TESTICULAR",
                ] as ReportType[]
              ).map((type) => {
                const IconComponent = REPORT_ICONS[type] || FileText;
                return (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setReportType(type)}
                    className={`w-full text-left px-3 py-3 text-sm font-medium transition-all flex items-center gap-2.5 border-b border-black/[.08] dark:border-white/[.08] last:border-b-0 ${reportType === type
                      ? "bg-[#3C43EC]/10 text-[#3C43EC] dark:bg-[#3C43EC]/20 dark:text-blue-400 font-semibold"
                      : "hover:bg-black/[.03] dark:hover:bg-white/[.03] text-foreground/80"
                      }`}
                  >
                    <IconComponent className={`h-4 w-4 shrink-0 ${reportType === type ? 'text-[#3C43EC] dark:text-blue-400' : 'text-foreground/45'}`} />
                    <span className="truncate">{type}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right side: Dynamic Form */}
          <div className="lg:col-span-3 border border-black/[.12] dark:border-white/[.12] lg:border-l-0 lg:rounded-l-none rounded-b-lg lg:rounded-r-lg p-6 bg-white dark:bg-zinc-900">
            <div className="mb-6 border-b border-black/[.1] dark:border-white/[.1] pb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-foreground/70 uppercase">Report Type</span>
                <h2 className="text-lg font-bold text-foreground mt-1">{REPORT_DISPLAY_TITLES[reportType] || reportType}</h2>
              </div>
              <FileText className="h-5 w-5 text-foreground/45" />
            </div>

            <form onSubmit={handleSaveReport} className="space-y-6">
              {renderActiveForm(reportType, formData, handleInputChange)}

              <div className="border-t border-black/[.1] dark:border-white/[.1] pt-6 flex items-center justify-end gap-3">
                <Button
                  type="submit"
                  variant="filled"
                  icon={Save}
                  className="w-full sm:w-auto"
                >
                  Save Report
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ── Success Modal ── */}
      <Modal isOpen={showSuccessModal} maxWidth="md">
        <div className="flex flex-col items-center text-center py-4">
          {/* Animated success checkmark SVG */}
          <div className="mb-6">
            <svg
              viewBox="0 0 80 80"
              className="h-20 w-20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer pulse ring */}
              <circle cx="40" cy="40" r="38" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="239" strokeDashoffset="239" opacity="0.3">
                <animate attributeName="stroke-dashoffset" from="239" to="0" dur="0.6s" begin="0.1s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
                <animate attributeName="opacity" from="0.3" to="0" dur="1.2s" begin="0.7s" fill="freeze" />
              </circle>
              {/* Solid background circle */}
              <circle cx="40" cy="40" r="34" fill="#f0fdf4" className="dark:fill-green-950/40">
                <animate attributeName="r" from="0" to="34" dur="0.45s" begin="0s" fill="freeze" calcMode="spline" keySplines="0.34 1.56 0.64 1" />
              </circle>
              {/* Green border circle */}
              <circle cx="40" cy="40" r="34" stroke="#22c55e" strokeWidth="2" fill="none">
                <animate attributeName="r" from="0" to="34" dur="0.45s" begin="0s" fill="freeze" calcMode="spline" keySplines="0.34 1.56 0.64 1" />
              </circle>
              {/* Check path */}
              <path
                d="M25 41 L35 51 L55 31"
                stroke="#16a34a"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="40"
                strokeDashoffset="40"
              >
                <animate attributeName="stroke-dashoffset" from="40" to="0" dur="0.4s" begin="0.45s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
              </path>
            </svg>
          </div>

          <div className={`flex w-full flex-col items-center transition-opacity transition-transform duration-500 ease-out ${showModalContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {showModalContent && (
              <>
                <h2 className="text-xl font-bold text-foreground">Report Saved</h2>
                <p className="mt-1.5 text-sm text-foreground/60 leading-relaxed">
                  <span className="font-medium text-foreground/80">{savedReportTitle.replace(" (PDF)", "")}</span>
                  <br />has been added to the Medical Vault.
                </p>

                <div className="mt-8 flex w-full flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => router.push(`/dashboard/patients/clinical?id=${patientId}`)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3C43EC] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#3C43EC]/90 active:scale-[.98]"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2L19 8" />
                    </svg>
                    View Medical Vault &amp; Documents
                  </button>

                  <button
                    type="button"
                    onClick={handleAddMoreReports}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-black/[.12] dark:border-white/[.15] bg-transparent px-5 py-3 text-sm font-semibold text-foreground/80 transition-all hover:bg-black/[.04] dark:hover:bg-white/[.06] active:scale-[.98]"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Another Report
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

export default function NewReportPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3C43EC] border-t-transparent" />
      </div>
    }>
      <NewReportPageContent />
    </Suspense>
  );
}

// Default states for each report
function getDefaultDataForReport(type: ReportType): Record<string, any> {
  switch (type) {
    case "3D 4D SCAN":
      return {
        gestationalAge: "28 weeks 3 days",
        fetalMovement: "Normal",
        heartRate: "148",
        presentation: "Cephalic",
        volumeQuality: "Excellent",
        placenta: "Anterior - High",
        notes: "Excellent visualization of fetal face and extremities. Clear 3D/4D captures saved.",
      };
    case "ANOMALY SCAN":
      return {
        bpd: "48",
        hc: "174",
        ac: "149",
        fl: "32",
        cerebellum: "Normal",
        spine: "Normal",
        heart: "Normal",
        kidneys: "Normal",
        stomach: "Normal",
        placentaPosition: "Posterior",
        amnioticFluid: "Normal",
        summary: "Detailed anomaly scan completed. All fetal biometry falls within normal parameters. Anatomy visualized appears standard with no anomalies detected.",
      };
    case "Booking System Fields":
      return {
        bookingRef: "BK-9921",
        referringClinician: "Dr. Sarah Jenkins",
        serviceRequested: "Obstetric Ultrasound",
        clinicalIndication: "Routine pregnancy monitoring",
        specialPrecautions: "None",
        consentSigned: true,
      };

    case "EARLY PREGNANCY- NORMAL template":
      return {
        gsd: "25",
        yolkSac: "Visible",
        crl: "16",
        gestationalAgeWeeks: "8",
        gestationalAgeDays: "2",
        fetalHeartRate: "155",
        adnexa: "Normal",
        comments: "Live intrauterine pregnancy. Gestational size is compatible with dates. No subchorionic fluid collection noted.",
      };
    case "EARLY PRENANCY - ABNORMAL Template":
      return {
        findings: "Subchorionic Hematoma",
        hematomaSize: "12",
        crl: "8",
        heartRate: "110",
        recommendation: "Rest advised. Re-scan in 7-10 days to monitor hematoma size and fetal growth.",
        referralUrgency: "Urgent",
      };
    case "GENDER WELL BEING REPORT":
      return {
        gender: "Female",
        genderVisibility: "Clear",
        fetalHeartRate: "142",
        movement: "Normal",
        comments: "Fetal gender determined as Female. Genitalia clearly visualized. Fetal movement and cardiac activity are normal.",
      };
    case "GROWTH & PRESENTATION REPORT":
      return {
        presentation: "Cephalic",
        placentaLocation: "Fundal",
        liquorVolume: "Normal",
        efw: "1850",
        percentile: "50",
        comments: "Fetal growth is consistent with gestational age. Presentation is cephalic.",
      };
    case "REASSURANCE SCAN":
      return {
        fetalHeartbeat: "Present",
        heartRate: "140",
        movements: "Normal",
        gestationalAge: "16 weeks",
        comments: "Reassurance scan indicates a normal active fetus with strong, regular heartbeat. Parents reassured.",
      };
    case "US ABDOMINAL":
      return {
        liver: "Normal",
        gallbladder: "Normal",
        pancreas: "Normal",
        spleen: "Normal",
        rightKidney: "Normal",
        leftKidney: "Normal",
        aorta: "Normal",
        comments: "Upper abdominal ultrasound reveals normal appearance of the scanned organs. No gallstones, hydronephrosis, or abdominal aortic aneurysm detected.",
      };
    case "US DEEP VEIN THROMBOSIS":
      return {
        leg: "Left Leg",
        commonFemoralVein: "Compressible",
        femoralVein: "Compressible",
        poplitealVein: "Compressible",
        dvtDiagnosed: "No DVT detected",
        recommendations: "No ultrasound evidence of deep vein thrombosis in the scanned lower limb.",
      };
    case "US PELVIC WELLBEING":
      return {
        uterusSize: "75 x 42 x 38 mm",
        endometrialThickness: "6.5",
        rightOvary: "Normal",
        leftOvary: "Normal",
        pouchOfDouglas: "No free fluid",
        comments: "Pelvic organs are within normal physiological limits for age and cycle phase. Endometrium is homogeneous.",
      };
    case "US TESTICULAR":
      return {
        rightTesticle: "Normal",
        leftTesticle: "Normal",
        rightEpididymis: "Normal",
        leftEpididymis: "Normal",
        hydrocele: "None",
        comments: "Scrotal ultrasound reveals normal size and echotexure of both testes. No mass, hydrocele, or varicocele identified.",
      };
    default:
      return {};
  }
}

// Render form dynamically
function renderActiveForm(
  type: ReportType,
  data: Record<string, any>,
  onChange: (field: string, value: any) => void
) {
  switch (type) {
    case "3D 4D SCAN":
      return <ThreeDFourDScanForm data={data} onChange={onChange} />;
    case "ANOMALY SCAN":
      return <AnomalyScanForm data={data} onChange={onChange} />;
    case "Booking System Fields":
      return <BookingSystemFieldsForm data={data} onChange={onChange} />;

    case "EARLY PREGNANCY- NORMAL template":
      return <EarlyPregnancyNormalForm data={data} onChange={onChange} />;
    case "EARLY PRENANCY - ABNORMAL Template":
      return <EarlyPregnancyAbnormalForm data={data} onChange={onChange} />;
    case "GENDER WELL BEING REPORT":
      return <GenderWellBeingForm data={data} onChange={onChange} />;
    case "GROWTH & PRESENTATION REPORT":
      return <GrowthPresentationForm data={data} onChange={onChange} />;
    case "REASSURANCE SCAN":
      return <ReassuranceScanForm data={data} onChange={onChange} />;
    case "US ABDOMINAL":
      return <AbdominalUltrasoundForm data={data} onChange={onChange} />;
    case "US DEEP VEIN THROMBOSIS":
      return <DVTUltrasoundForm data={data} onChange={onChange} />;
    case "US PELVIC WELLBEING":
      return <PelvicWellbeingForm data={data} onChange={onChange} />;
    case "US TESTICULAR":
      return <TesticularUltrasoundForm data={data} onChange={onChange} />;
    default:
      return null;
  }
}


// Generate text presentation of the form fields
function generateReportSummaryText(type: ReportType, data: Record<string, any>): string {
  const lines: string[] = [];
  lines.push(`CLINICAL REPORT TYPE: ${type}`);
  lines.push(`Date Generated: ${new Date().toLocaleDateString()}`);
  lines.push(`==========================================`);

  Object.entries(data).forEach(([key, val]) => {
    if (typeof val === "boolean") {
      lines.push(`${formatKey(key)}: ${val ? "CONFIRMED/YES" : "NO"}`);
    } else {
      lines.push(`${formatKey(key)}: ${val}`);
    }
  });

  return lines.join("\n");
}

function formatKey(key: string): string {
  const result = key.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}
