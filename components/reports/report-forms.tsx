import React from "react";

interface ReportFormProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

const labelClass = "block text-xs font-bold uppercase tracking-wider text-foreground/75 mb-2.5";
const inputClass = "w-full rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3.5 py-2 text-sm focus:border-[#3C43EC] focus:outline-none transition-all";
const selectClass = "w-full rounded-md border border-black/15 dark:border-white/20 bg-white dark:bg-zinc-900 px-3.5 py-2 text-sm focus:border-[#3C43EC] focus:outline-none transition-all";
const checkboxClass = "h-4 w-4 rounded border-black/25 dark:border-white/30 text-[#3C43EC] focus:ring-[#3C43EC]";

export const ThreeDFourDScanForm: React.FC<ReportFormProps> = ({ data, onChange }) => (
  <div className="space-y-6">
    {/* Study Metadata Row */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div>
        <label className={labelClass}>Study Date</label>
        <input type="date" className={inputClass} value={data.studyDate || new Date().toISOString().split("T")[0]} onChange={(e) => onChange("studyDate", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Contact No</label>
        <input type="text" className={inputClass} value={data.contactNo || ""} onChange={(e) => onChange("contactNo", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Consent to Scan</label>
        <select className={selectClass} value={data.consentToScan || "Yes"} onChange={(e) => onChange("consentToScan", e.target.value)}>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
    </div>

    <div>
      <label className={labelClass}>Clinical Indication</label>
      <input type="text" className={inputClass} value={data.clinicalIndication || ""} onChange={(e) => onChange("clinicalIndication", e.target.value)} />
    </div>

    {/* Method and Cardiac Row */}
    <div className="border-t border-black/[.08] dark:border-white/[.08] pt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label className={labelClass}>Scan Method</label>
        <select className={selectClass} value={data.scanMethod || "Transabdominal"} onChange={(e) => onChange("scanMethod", e.target.value)}>
          <option value="Transabdominal">Transabdominal</option>
          <option value="Transvaginal">Transvaginal</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>Fetal Heart</label>
        <input type="text" className={inputClass} value={data.fetalHeart || "Visualized"} onChange={(e) => onChange("fetalHeart", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Placenta</label>
        <input type="text" className={inputClass} value={data.placenta || ""} onChange={(e) => onChange("placenta", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Placental Position</label>
        <input type="text" className={inputClass} value={data.placentalPosition || ""} onChange={(e) => onChange("placentalPosition", e.target.value)} />
      </div>
    </div>

    {/* Gestation and Fetus Count */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label className={labelClass}>Fetal Number</label>
        <select className={selectClass} value={data.fetalNumber || "Singleton"} onChange={(e) => onChange("fetalNumber", e.target.value)}>
          <option value="Singleton">Singleton</option>
          <option value="Multiple">Multiple</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelClass}>Gestation Weeks</label>
          <input type="number" className={inputClass} value={data.gestationWeeks || ""} onChange={(e) => onChange("gestationWeeks", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Gestation Days</label>
          <input type="number" className={inputClass} value={data.gestationDays || ""} onChange={(e) => onChange("gestationDays", e.target.value)} />
        </div>
      </div>
    </div>

    <div>
      <label className={labelClass}>Estimated Due Date</label>
      <input type="date" className={inputClass} value={data.edd || ""} onChange={(e) => onChange("edd", e.target.value)} />
    </div>

    {/* Biometry Measurements */}
    <div className="border-t border-black/[.08] dark:border-white/[.08] pt-6">
      <h3 className="text-sm font-semibold mb-4">Measurements</h3>
      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className={labelClass}>HC (mm)</label>
          <input type="number" className={inputClass} value={data.hc || ""} onChange={(e) => onChange("hc", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>AC (mm)</label>
          <input type="number" className={inputClass} value={data.ac || ""} onChange={(e) => onChange("ac", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>FL (mm)</label>
          <input type="number" className={inputClass} value={data.fl || ""} onChange={(e) => onChange("fl", e.target.value)} />
        </div>
      </div>
    </div>

    {/* Presentation, Fluid & Weight */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div>
        <label className={labelClass}>Fetal Presentation</label>
        <input type="text" className={inputClass} value={data.fetalPresentation || "Cephalic"} onChange={(e) => onChange("fetalPresentation", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Amniotic Fluid (MPD - cm)</label>
        <input type="number" step="0.1" className={inputClass} value={data.amnioticFluidMpd || ""} onChange={(e) => onChange("amnioticFluidMpd", e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelClass}>EFW (Oz/Lb)</label>
          <input type="text" className={inputClass} value={data.efwOzLb || ""} onChange={(e) => onChange("efwOzLb", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>EFW (Grams)</label>
          <input type="number" className={inputClass} value={data.efwGrams || ""} onChange={(e) => onChange("efwGrams", e.target.value)} />
        </div>
      </div>
    </div>

    {/* Summary Textarea */}
    <div>
      <label className={labelClass}>Report Summary</label>
      <textarea rows={3} className={inputClass} value={data.reportSummary || "Advised to follow NHS antenatal care pathway."} onChange={(e) => onChange("reportSummary", e.target.value)} />
    </div>

    {/* Signatures Row */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 border-t border-black/[.08] dark:border-white/[.08] pt-6">
      <div>
        <label className={labelClass}>Sonographer</label>
        <input type="text" className={inputClass} value={data.sonographer || ""} onChange={(e) => onChange("sonographer", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Chaperone</label>
        <input type="text" className={inputClass} value={data.chaperone || ""} onChange={(e) => onChange("chaperone", e.target.value)} />
      </div>
    </div>
  </div>
);


export const AnomalyScanForm: React.FC<ReportFormProps> = ({ data, onChange }) => (
  <div className="space-y-6">
    {/* Study Details */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div>
        <label className={labelClass}>Study Date</label>
        <input type="date" className={inputClass} value={data.studyDate || new Date().toISOString().split("T")[0]} onChange={(e) => onChange("studyDate", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Contact No</label>
        <input type="text" className={inputClass} value={data.contactNo || ""} onChange={(e) => onChange("contactNo", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Consent to Scan</label>
        <select className={selectClass} value={data.consentToScan || "Yes"} onChange={(e) => onChange("consentToScan", e.target.value)}>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>Gestation</label>
        <input type="text" className={inputClass} value={data.gestation || ""} placeholder="e.g. 20 Weeks 3 Days" onChange={(e) => onChange("gestation", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Estimated Date of Delivery</label>
        <input type="date" className={inputClass} value={data.edd || ""} onChange={(e) => onChange("edd", e.target.value)} />
      </div>
    </div>

    {/* Primary & Gender Row */}
    <div className="border-t border-black/[.08] dark:border-white/[.08] pt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Fetal Heart Beat</label>
          <input type="text" className={inputClass} value={data.fetalHeartBeat || "Visualized"} onChange={(e) => onChange("fetalHeartBeat", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Placenta Position</label>
          <input type="text" className={inputClass} value={data.placentaPosition || ""} onChange={(e) => onChange("placentaPosition", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Placenta Site</label>
          <input type="text" className={inputClass} value={data.placentaSite || ""} onChange={(e) => onChange("placentaSite", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Amniotic Fluid</label>
          <input type="text" className={inputClass} value={data.amnioticFluid || "Normal"} onChange={(e) => onChange("amnioticFluid", e.target.value)} />
        </div>
      </div>

      <div className="space-y-4 border-l border-black/[.08] dark:border-white/[.08] pl-6">
        <div>
          <label className={labelClass}>Fetal Gender Requested</label>
          <select className={selectClass} value={data.genderRequested || "Yes"} onChange={(e) => onChange("genderRequested", e.target.value)}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Fetal Gender</label>
          <select className={selectClass} value={data.fetalGender || "Female"} onChange={(e) => onChange("fetalGender", e.target.value)}>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Indeterminate">Indeterminate</option>
            <option value="Undisclosed">Undisclosed / Secret</option>
          </select>
        </div>
      </div>
    </div>

    {/* Biometry Measurements */}
    <div className="border-t border-black/[.08] dark:border-white/[.08] pt-6">
      <h3 className="text-sm font-semibold mb-4">Biometry Measurements</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Head Circumference (HC - mm)</label>
          <input type="number" className={inputClass} value={data.hc || ""} onChange={(e) => onChange("hc", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Abdominal Circumference (AC - mm)</label>
          <input type="number" className={inputClass} value={data.ac || ""} onChange={(e) => onChange("ac", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Femur Length (FL - mm)</label>
          <input type="number" className={inputClass} value={data.fl || ""} onChange={(e) => onChange("fl", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Cerebellum (CER - mm)</label>
          <input type="number" className={inputClass} value={data.cer || ""} onChange={(e) => onChange("cer", e.target.value)} />
        </div>
      </div>
    </div>

    {/* Anatomical Checklists */}
    <div className="border-t border-black/[.08] dark:border-white/[.08] pt-6">
      <h3 className="text-sm font-semibold mb-4">Detailed Anatomy</h3>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* CNS */}
        <div className="space-y-2 flex flex-col h-full">
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/80 pl-1">CNS - Head and Neck</h4>
          <div className="space-y-4 border border-black/[.08] dark:border-white/[.08] p-4 rounded-md bg-white dark:bg-white/[.01] flex-1">
            <div>
              <label className={labelClass}>Skull</label>
              <input type="text" className={inputClass} value={data.skull || "Normal"} onChange={(e) => onChange("skull", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Atrium (mm)</label>
              <input type="number" className={inputClass} value={data.atrium || ""} onChange={(e) => onChange("atrium", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Brain</label>
              <input type="text" className={inputClass} value={data.brainCNS || "Normal"} onChange={(e) => onChange("brainCNS", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Nuchal</label>
              <input type="text" className={inputClass} value={data.nuchal || "Normal"} onChange={(e) => onChange("nuchal", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Abdomen */}
        <div className="space-y-2 flex flex-col h-full">
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/80 pl-1">Abdomen</h4>
          <div className="space-y-4 border border-black/[.08] dark:border-white/[.08] p-4 rounded-md bg-white dark:bg-white/[.01] flex-1">
            <div>
              <label className={labelClass}>Stomach</label>
              <input type="text" className={inputClass} value={data.stomach || "Normal"} onChange={(e) => onChange("stomach", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Abdominal Wall</label>
              <input type="text" className={inputClass} value={data.abdominalWall || "Normal"} onChange={(e) => onChange("abdominalWall", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Bowel</label>
              <input type="text" className={inputClass} value={data.bowel || "Normal"} onChange={(e) => onChange("bowel", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Kidneys</label>
              <input type="text" className={inputClass} value={data.kidneysAnatomy || "Normal"} onChange={(e) => onChange("kidneysAnatomy", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Bladder</label>
              <input type="text" className={inputClass} value={data.bladder || "Normal"} onChange={(e) => onChange("bladder", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Spine */}
        <div className="space-y-2 flex flex-col h-full">
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/80 pl-1">Spine</h4>
          <div className="space-y-4 border border-black/[.08] dark:border-white/[.08] p-4 rounded-md bg-white dark:bg-white/[.01] flex-1">
            <div>
              <label className={labelClass}>Sagittal</label>
              <input type="text" className={inputClass} value={data.spineSagittal || "Normal"} onChange={(e) => onChange("spineSagittal", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Transverse</label>
              <input type="text" className={inputClass} value={data.spineTransverse || "Normal"} onChange={(e) => onChange("spineTransverse", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Coronal</label>
              <input type="text" className={inputClass} value={data.spineCoronal || "Normal"} onChange={(e) => onChange("spineCoronal", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Chest */}
        <div className="space-y-2 flex flex-col h-full">
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/80 pl-1">Chest</h4>
          <div className="space-y-4 border border-black/[.08] dark:border-white/[.08] p-4 rounded-md bg-white dark:bg-white/[.01] flex-1">
            <div>
              <label className={labelClass}>Heart 4CH</label>
              <input type="text" className={inputClass} value={data.heart4ch || "Normal"} onChange={(e) => onChange("heart4ch", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Situs</label>
              <input type="text" className={inputClass} value={data.situs || "Normal"} onChange={(e) => onChange("situs", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>LVOT</label>
              <input type="text" className={inputClass} value={data.lvot || "Normal"} onChange={(e) => onChange("lvot", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>RVOT</label>
              <input type="text" className={inputClass} value={data.rvot || "Normal"} onChange={(e) => onChange("rvot", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>3VT View</label>
              <input type="text" className={inputClass} value={data.threeVtView || "Normal"} onChange={(e) => onChange("threeVtView", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Extremities */}
        <div className="space-y-2 flex flex-col h-full">
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/80 pl-1">Extremities</h4>
          <div className="space-y-4 border border-black/[.08] dark:border-white/[.08] p-4 rounded-md bg-white dark:bg-white/[.01] flex-1">
            <div>
              <label className={labelClass}>Femur</label>
              <input type="text" className={inputClass} value={data.femurAnatomy || "Normal"} onChange={(e) => onChange("femurAnatomy", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Both Hands</label>
              <input type="text" className={inputClass} value={data.bothHands || "Normal"} onChange={(e) => onChange("bothHands", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Both Feet</label>
              <input type="text" className={inputClass} value={data.bothFeet || "Normal"} onChange={(e) => onChange("bothFeet", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Face / Lips & Scan Complete */}
        <div className="space-y-2 flex flex-col h-full">
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/80 pl-1">Status & Face</h4>
          <div className="space-y-4 border border-black/[.08] dark:border-white/[.08] p-4 rounded-md bg-white dark:bg-white/[.01] flex-1">
            <div>
              <label className={labelClass}>Face / Lips</label>
              <input type="text" className={inputClass} value={data.faceLips || "Normal"} onChange={(e) => onChange("faceLips", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Scan Complete</label>
              <select className={selectClass} value={data.scanComplete || "Yes"} onChange={(e) => onChange("scanComplete", e.target.value)}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Comments summary */}
    <div>
      <label className={labelClass}>Comments</label>
      <textarea rows={3} className={inputClass} value={data.comments || "No obvious fetal abnormalities detected on scan today. Advised to follow NHS antenatal care pathway."} onChange={(e) => onChange("comments", e.target.value)} />
    </div>
  </div>
);

export const BookingSystemFieldsForm: React.FC<ReportFormProps> = ({ data, onChange }) => (
  <div className="space-y-8">
    {/* Section 1: Core Patient Information */}
    <div>
      <h3 className="text-sm font-semibold border-b border-black/[.08] dark:border-white/[.08] pb-1.5 mb-4">Core Patient Information (Mandatory)</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Title</label>
          <select className={selectClass} value={data.title || ""} onChange={(e) => onChange("title", e.target.value)}>
            <option value="">Select Title</option>
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Miss">Miss</option>
            <option value="Ms">Ms</option>
            <option value="Dr">Dr</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>First Name</label>
          <input type="text" className={inputClass} value={data.firstName || ""} onChange={(e) => onChange("firstName", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Middle Name</label>
          <input type="text" className={inputClass} value={data.middleName || ""} onChange={(e) => onChange("middleName", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Last Name</label>
          <input type="text" className={inputClass} value={data.lastName || ""} onChange={(e) => onChange("lastName", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Preferred Name</label>
          <input type="text" className={inputClass} value={data.preferredName || ""} onChange={(e) => onChange("preferredName", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Date of Birth</label>
          <input type="date" className={inputClass} value={data.dob || ""} onChange={(e) => onChange("dob", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Gender</label>
          <select className={selectClass} value={data.gender || ""} onChange={(e) => onChange("gender", e.target.value)}>
            <option value="">Select Gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
            <option value="Undisclosed">Prefer not to say</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Mobile Number</label>
          <input type="tel" className={inputClass} value={data.mobile || ""} onChange={(e) => onChange("mobile", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Email Address</label>
          <input type="email" className={inputClass} value={data.email || ""} onChange={(e) => onChange("email", e.target.value)} />
        </div>
      </div>
    </div>

    {/* Section 2: Address Information */}
    <div>
      <h3 className="text-sm font-semibold border-b border-black/[.08] dark:border-white/[.08] pb-1.5 mb-4">Address Information</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Address Line 1</label>
          <input type="text" className={inputClass} value={data.addressLine1 || ""} onChange={(e) => onChange("addressLine1", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Address Line 2</label>
          <input type="text" className={inputClass} value={data.addressLine2 || ""} onChange={(e) => onChange("addressLine2", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Town / City</label>
          <input type="text" className={inputClass} value={data.city || ""} onChange={(e) => onChange("city", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>County</label>
          <input type="text" className={inputClass} value={data.county || ""} onChange={(e) => onChange("county", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Postcode</label>
          <input type="text" className={inputClass} value={data.postcode || ""} onChange={(e) => onChange("postcode", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Country</label>
          <input type="text" className={inputClass} value={data.country || "United Kingdom"} onChange={(e) => onChange("country", e.target.value)} />
        </div>
      </div>
    </div>

    {/* Section 3: Emergency Contact */}
    <div>
      <h3 className="text-sm font-semibold border-b border-black/[.08] dark:border-white/[.08] pb-1.5 mb-4">Emergency Contact</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Emergency Contact Name</label>
          <input type="text" className={inputClass} value={data.emergencyName || ""} onChange={(e) => onChange("emergencyName", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Relationship to Patient</label>
          <input type="text" className={inputClass} value={data.emergencyRelationship || ""} onChange={(e) => onChange("emergencyRelationship", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Emergency Contact Number</label>
          <input type="tel" className={inputClass} value={data.emergencyPhone || ""} onChange={(e) => onChange("emergencyPhone", e.target.value)} />
        </div>
      </div>
    </div>

    {/* Section 4: GP Details */}
    <div>
      <h3 className="text-sm font-semibold border-b border-black/[.08] dark:border-white/[.08] pb-1.5 mb-4">GP Details</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label className={labelClass}>GP Practice Name</label>
          <input type="text" className={inputClass} value={data.gpPractice || ""} onChange={(e) => onChange("gpPractice", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>GP Telephone Number</label>
          <input type="tel" className={inputClass} value={data.gpPhone || ""} onChange={(e) => onChange("gpPhone", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>GP Address (Optional)</label>
          <input type="text" className={inputClass} value={data.gpAddress || ""} onChange={(e) => onChange("gpAddress", e.target.value)} />
        </div>
      </div>
    </div>

    {/* Section 5: Communication & Marketing */}
    <div>
      <h3 className="text-sm font-semibold border-b border-black/[.08] dark:border-white/[.08] pb-1.5 mb-4">Communication & Marketing</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Preferred Contact Method</label>
          <select className={selectClass} value={data.preferredContact || ""} onChange={(e) => onChange("preferredContact", e.target.value)}>
            <option value="">Select Option</option>
            <option value="Email">Email</option>
            <option value="Mobile">Mobile SMS</option>
            <option value="Phone">Phone Call</option>
            <option value="Post">Post</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>How Did You Hear About Us?</label>
          <input type="text" className={inputClass} value={data.howHeard || ""} onChange={(e) => onChange("howHeard", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Referral Source</label>
          <input type="text" className={inputClass} value={data.referralSource || ""} onChange={(e) => onChange("referralSource", e.target.value)} />
        </div>
        <div className="sm:col-span-3 flex items-center gap-2.5 mt-2">
          <input type="checkbox" id="marketingConsent" className={checkboxClass} checked={!!data.marketingConsent} onChange={(e) => onChange("marketingConsent", e.target.checked)} />
          <label htmlFor="marketingConsent" className="text-sm text-foreground/80 cursor-pointer">Opt-in to marketing updates and newsletters</label>
        </div>
      </div>
    </div>

    {/* Section 6: Administrative Fields */}
    <div>
      <h3 className="text-sm font-semibold border-b border-black/[.08] dark:border-white/[.08] pb-1.5 mb-4">Administrative Fields</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Patient ID</label>
          <input type="text" className={inputClass} value={data.patientId || ""} onChange={(e) => onChange("patientId", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Registration Date</label>
          <input type="date" className={inputClass} value={data.registrationDate || new Date().toISOString().split("T")[0]} onChange={(e) => onChange("registrationDate", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Last Appointment Date</label>
          <input type="date" className={inputClass} value={data.lastAppointmentDate || ""} onChange={(e) => onChange("lastAppointmentDate", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Notes</label>
          <textarea rows={3} className={inputClass} value={data.notes || ""} onChange={(e) => onChange("notes", e.target.value)} />
        </div>
      </div>
    </div>

    {/* Section 7: Additional Recommended Fields */}
    <div>
      <h3 className="text-sm font-semibold border-b border-black/[.08] dark:border-white/[.08] pb-1.5 mb-4">Additional Recommended Fields</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass}>NHS Number (Optional)</label>
          <input type="text" className={inputClass} value={data.nhsNumber || ""} onChange={(e) => onChange("nhsNumber", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Occupation</label>
          <input type="text" className={inputClass} value={data.occupation || ""} onChange={(e) => onChange("occupation", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Interpreter Required</label>
          <select className={selectClass} value={data.interpreterRequired || "No"} onChange={(e) => onChange("interpreterRequired", e.target.value)}>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Accessibility Requirements</label>
          <input type="text" className={inputClass} value={data.accessibility || ""} placeholder="e.g. Wheelchair access" onChange={(e) => onChange("accessibility", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Communication Preferences</label>
          <input type="text" className={inputClass} value={data.communicationPreferences || ""} placeholder="e.g. Large print, braille, audio" onChange={(e) => onChange("communicationPreferences", e.target.value)} />
        </div>
      </div>
    </div>
  </div>
);


export const EarlyPregnancyNormalForm: React.FC<ReportFormProps> = ({ data, onChange }) => (
  <div className="space-y-6">
    {/* Study Details */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div>
        <label className={labelClass}>Study Date</label>
        <input type="date" className={inputClass} value={data.studyDate || new Date().toISOString().split("T")[0]} onChange={(e) => onChange("studyDate", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Contact No</label>
        <input type="text" className={inputClass} value={data.contactNo || ""} onChange={(e) => onChange("contactNo", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Consent to Scan</label>
        <select className={selectClass} value={data.consentToScan || "Yes"} onChange={(e) => onChange("consentToScan", e.target.value)}>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
    </div>

    <div>
      <label className={labelClass}>Clinical Indication</label>
      <input type="text" className={inputClass} value={data.clinicalIndication || ""} onChange={(e) => onChange("clinicalIndication", e.target.value)} />
    </div>

    {/* Scan Method and cardiac Row */}
    <div className="border-t border-black/[.08] dark:border-white/[.08] pt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label className={labelClass}>Scan Method</label>
        <select className={selectClass} value={data.scanMethod || "Transabdominal"} onChange={(e) => onChange("scanMethod", e.target.value)}>
          <option value="Transabdominal">Transabdominal</option>
          <option value="Transvaginal">Transvaginal</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>Fetal Heart</label>
        <select className={selectClass} value={data.fetalHeart || "Present"} onChange={(e) => onChange("fetalHeart", e.target.value)}>
          <option value="Present">Present</option>
          <option value="Not Visualized">Not Visualized</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>Placenta</label>
        <input type="text" className={inputClass} value={data.placenta || ""} onChange={(e) => onChange("placenta", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Placental Position</label>
        <input type="text" className={inputClass} value={data.placentalPosition || ""} onChange={(e) => onChange("placentalPosition", e.target.value)} />
      </div>
    </div>

    {/* Gestation and Fetus Count */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label className={labelClass}>Fetal Number</label>
        <select className={selectClass} value={data.fetalNumber || "Singleton"} onChange={(e) => onChange("fetalNumber", e.target.value)}>
          <option value="Singleton">Singleton</option>
          <option value="Multiple">Multiple</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelClass}>Gestation Weeks</label>
          <input type="number" className={inputClass} value={data.gestationWeeks || ""} onChange={(e) => onChange("gestationWeeks", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Gestation Days</label>
          <input type="number" className={inputClass} value={data.gestationDays || ""} onChange={(e) => onChange("gestationDays", e.target.value)} />
        </div>
      </div>
    </div>

    <div>
      <label className={labelClass}>Estimated Due Date</label>
      <input type="date" className={inputClass} value={data.edd || ""} onChange={(e) => onChange("edd", e.target.value)} />
    </div>



    {/* Comments */}
    <div>
      <label className={labelClass}>Comments</label>
      <textarea rows={3} className={inputClass} value={data.comments || "Single IU pregnancy. CRL measures . Advised to follow NHS antenatal carepathway."} onChange={(e) => onChange("comments", e.target.value)} />
    </div>

    {/* Signatures */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 border-t border-black/[.08] dark:border-white/[.08] pt-6">
      <div>
        <label className={labelClass}>Sonographer</label>
        <input type="text" className={inputClass} value={data.sonographer || ""} onChange={(e) => onChange("sonographer", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Chaperone</label>
        <input type="text" className={inputClass} value={data.chaperone || ""} onChange={(e) => onChange("chaperone", e.target.value)} />
      </div>
    </div>
  </div>
);

export const EarlyPregnancyAbnormalForm: React.FC<ReportFormProps> = ({ data, onChange }) => (
  <div className="space-y-6">
    {/* <div className="text-xs space-y-2.5 text-foreground/80">
      <p className="font-bold">EARLY PREGNANCY REASSURANCE ULTRASOUND SCAN REPORT</p>
      <p>
        Transabdominal and transvaginal ultrasound examination performed with consent. Consent form signed. Transvaginal probe decontaminated with TRISTEL DUO LOT (10) 816901 Expiry date: 09.07.2026.
      </p>
    </div> */}

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label className={labelClass}>Study Date</label>
        <input type="date" className={inputClass} value={data.studyDate || new Date().toISOString().split("T")[0]} onChange={(e) => onChange("studyDate", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Referrer</label>
        <input type="text" className={inputClass} value={data.referrer || "Self-referral"} onChange={(e) => onChange("referrer", e.target.value)} />
      </div>
    </div>

    <div>
      <label className={labelClass}>Clinical Indication</label>
      <input type="text" className={inputClass} value={data.clinicalIndication || "Early pregnancy reassurance scan."} onChange={(e) => onChange("clinicalIndication", e.target.value)} />
    </div>

    <div>
      <label className={labelClass}>Scan Findings</label>
      <textarea rows={4} className={inputClass} value={data.scanFindings || "Advised to follow NHS antenatal care pathway."} onChange={(e) => onChange("scanFindings", e.target.value)} />
    </div>

    <div>
      <label className={labelClass}>Disclaimer & Advice</label>
      <textarea rows={8} className={inputClass} value={data.disclaimer || "Patient is advised to take this report provided by Insight Health Services if seeing GP with the above symptoms. The ultrasound scan has been performed with care and is intended to aid in monitoring your overall health. However, due to the inherent limitations of ultrasound, not all pathologies may be detected. The findings on today’s scan should be reviewed alongside usual NHS care. This report does not replace a full clinical evaluation. Insight Health service is not liable for any undetected conditions or outcomes."} onChange={(e) => onChange("disclaimer", e.target.value)} />
    </div>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 border-t border-black/[.08] dark:border-white/[.08] pt-6">
      <div>
        <label className={labelClass}>Sonographer</label>
        <input type="text" className={inputClass} value={data.sonographer || ""} onChange={(e) => onChange("sonographer", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Chaperone</label>
        <input type="text" className={inputClass} value={data.chaperone || ""} onChange={(e) => onChange("chaperone", e.target.value)} />
      </div>
    </div>
  </div>
);

export const GenderWellBeingForm: React.FC<ReportFormProps> = ({ data, onChange }) => (
  <div className="space-y-6">
    {/* Study Details */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div>
        <label className={labelClass}>Study Date</label>
        <input type="date" className={inputClass} value={data.studyDate || new Date().toISOString().split("T")[0]} onChange={(e) => onChange("studyDate", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Contact No</label>
        <input type="text" className={inputClass} value={data.contactNo || ""} onChange={(e) => onChange("contactNo", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Consent to Scan</label>
        <select className={selectClass} value={data.consentToScan || "Yes"} onChange={(e) => onChange("consentToScan", e.target.value)}>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
    </div>

    <div>
      <label className={labelClass}>Clinical Indication</label>
      <input type="text" className={inputClass} value={data.clinicalIndication || ""} onChange={(e) => onChange("clinicalIndication", e.target.value)} />
    </div>

    {/* Scan Method and cardiac Row */}
    <div className="border-t border-black/[.08] dark:border-white/[.08] pt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label className={labelClass}>Scan Method</label>
        <input type="text" className={inputClass} value={data.scanMethod || "Transabdominal"} onChange={(e) => onChange("scanMethod", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Fetal Heart</label>
        <input type="text" className={inputClass} value={data.fetalHeart || "Visualized"} onChange={(e) => onChange("fetalHeart", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Placenta</label>
        <input type="text" className={inputClass} value={data.placenta || ""} onChange={(e) => onChange("placenta", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Placental Position</label>
        <input type="text" className={inputClass} value={data.placentalPosition || ""} onChange={(e) => onChange("placentalPosition", e.target.value)} />
      </div>
    </div>

    {/* Gestation and Fetus Count */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label className={labelClass}>Fetal Number</label>
        <select className={selectClass} value={data.fetalNumber || "Singleton"} onChange={(e) => onChange("fetalNumber", e.target.value)}>
          <option value="Singleton">Singleton</option>
          <option value="Multiple">Multiple</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelClass}>Gestation Weeks</label>
          <input type="number" className={inputClass} value={data.gestationWeeks || ""} onChange={(e) => onChange("gestationWeeks", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Gestation Days</label>
          <input type="number" className={inputClass} value={data.gestationDays || ""} onChange={(e) => onChange("gestationDays", e.target.value)} />
        </div>
      </div>
    </div>

    <div>
      <label className={labelClass}>Estimated Due Date</label>
      <input type="date" className={inputClass} value={data.edd || ""} onChange={(e) => onChange("edd", e.target.value)} />
    </div>

    {/* Comments */}
    <div>
      <label className={labelClass}>Comments</label>
      <textarea rows={3} className={inputClass} value={data.comments || "Normal growth velocity. Advised to follow NHS antenatal care pathway."} onChange={(e) => onChange("comments", e.target.value)} />
    </div>

    {/* Signatures */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 border-t border-black/[.08] dark:border-white/[.08] pt-6">
      <div>
        <label className={labelClass}>Sonographer</label>
        <input type="text" className={inputClass} value={data.sonographer || ""} onChange={(e) => onChange("sonographer", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Chaperone</label>
        <input type="text" className={inputClass} value={data.chaperone || ""} onChange={(e) => onChange("chaperone", e.target.value)} />
      </div>
    </div>
  </div>
);

export const GrowthPresentationForm: React.FC<ReportFormProps> = ({ data, onChange }) => (
  <div className="space-y-6">
    {/* Study Details */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div>
        <label className={labelClass}>Study Date</label>
        <input type="date" className={inputClass} value={data.studyDate || new Date().toISOString().split("T")[0]} onChange={(e) => onChange("studyDate", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Contact No</label>
        <input type="text" className={inputClass} value={data.contactNo || ""} onChange={(e) => onChange("contactNo", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Consent to Scan</label>
        <select className={selectClass} value={data.consentToScan || "Yes"} onChange={(e) => onChange("consentToScan", e.target.value)}>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
    </div>

    {/* Gestation & EDD */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div>
        <label className={labelClass}>Estimated Due Date</label>
        <input type="date" className={inputClass} value={data.edd || ""} onChange={(e) => onChange("edd", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Gestational Age (Weeks)</label>
        <input type="number" className={inputClass} value={data.gestationWeeks || ""} onChange={(e) => onChange("gestationWeeks", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Gestational Age (Days)</label>
        <input type="number" className={inputClass} value={data.gestationDays || ""} onChange={(e) => onChange("gestationDays", e.target.value)} />
      </div>
    </div>

    {/* Primary scan findings */}
    <div className="border-t border-black/[.08] dark:border-white/[.08] pt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label className={labelClass}>Fetal Heart</label>
        <input type="text" className={inputClass} value={data.fetalHeart || "Visualized"} onChange={(e) => onChange("fetalHeart", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Fetal Movement</label>
        <input type="text" className={inputClass} value={data.fetalMovement || "Normal"} onChange={(e) => onChange("fetalMovement", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Placenta</label>
        <input type="text" className={inputClass} value={data.placenta || ""} onChange={(e) => onChange("placenta", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Placenta Site</label>
        <input type="text" className={inputClass} value={data.placentaSite || ""} onChange={(e) => onChange("placentaSite", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Fetal Presentation</label>
        <input type="text" className={inputClass} value={data.fetalPresentation || "Cephalic"} onChange={(e) => onChange("fetalPresentation", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Amniotic Fluid (MPD - cm)</label>
        <input type="number" step="0.1" className={inputClass} value={data.amnioticFluidMpd || ""} onChange={(e) => onChange("amnioticFluidMpd", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>End Diastolic Flow</label>
        <input type="text" className={inputClass} value={data.endDiastolicFlow || "Positive / Normal"} onChange={(e) => onChange("endDiastolicFlow", e.target.value)} />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-6">
      <div>
        <label className={labelClass}>Pulsatility Index (PI)</label>
        <input type="number" step="0.01" className={inputClass} value={data.pi || ""} onChange={(e) => onChange("pi", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Resistive Index (RI)</label>
        <input type="number" step="0.01" className={inputClass} value={data.ri || ""} onChange={(e) => onChange("ri", e.target.value)} />
      </div>
    </div>

    {/* Fetal Biometry section */}
    <div className="border-t border-black/[.08] dark:border-white/[.08] pt-6">
      <h3 className="text-sm font-semibold mb-4">Fetal Biometry</h3>
      <div className="space-y-6">
        {/* HC */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/80 pl-0.5">Head Circumference</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>HC - mm</label>
              <input type="number" className={inputClass} value={data.hc || ""} onChange={(e) => onChange("hc", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>HC Weeks</label>
              <input type="number" className={inputClass} value={data.hcWeeks || ""} onChange={(e) => onChange("hcWeeks", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>HC Days</label>
              <input type="number" className={inputClass} value={data.hcDays || ""} onChange={(e) => onChange("hcDays", e.target.value)} />
            </div>
          </div>
        </div>

        {/* AC */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/80 pl-0.5">Abdominal Circumference</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>AC - mm</label>
              <input type="number" className={inputClass} value={data.ac || ""} onChange={(e) => onChange("ac", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>AC Weeks</label>
              <input type="number" className={inputClass} value={data.acWeeks || ""} onChange={(e) => onChange("acWeeks", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>AC Days</label>
              <input type="number" className={inputClass} value={data.acDays || ""} onChange={(e) => onChange("acDays", e.target.value)} />
            </div>
          </div>
        </div>

        {/* FL */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/80 pl-0.5">Femur Length</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>FL - mm</label>
              <input type="number" className={inputClass} value={data.fl || ""} onChange={(e) => onChange("fl", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>FL Weeks</label>
              <input type="number" className={inputClass} value={data.flWeeks || ""} onChange={(e) => onChange("flWeeks", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>FL Days</label>
              <input type="number" className={inputClass} value={data.flDays || ""} onChange={(e) => onChange("flDays", e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Comments */}
    <div>
      <label className={labelClass}>Comments</label>
      <textarea rows={3} className={inputClass} value={data.comments || "Normal growth velocity. Advised to follow NHS antenatal care pathway."} onChange={(e) => onChange("comments", e.target.value)} />
    </div>

    {/* Signatures */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 border-t border-black/[.08] dark:border-white/[.08] pt-6">
      <div>
        <label className={labelClass}>Sonographer</label>
        <input type="text" className={inputClass} value={data.sonographer || ""} onChange={(e) => onChange("sonographer", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Chaperone</label>
        <input type="text" className={inputClass} value={data.chaperone || ""} onChange={(e) => onChange("chaperone", e.target.value)} />
      </div>
    </div>
  </div>
);

export const ReassuranceScanForm: React.FC<ReportFormProps> = ({ data, onChange }) => (
  <div className="space-y-6">
    {/* Study Details */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div>
        <label className={labelClass}>Study Date</label>
        <input type="date" className={inputClass} value={data.studyDate || new Date().toISOString().split("T")[0]} onChange={(e) => onChange("studyDate", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Contact No</label>
        <input type="text" className={inputClass} value={data.contactNo || ""} onChange={(e) => onChange("contactNo", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Consent to Scan</label>
        <select className={selectClass} value={data.consentToScan || "Yes"} onChange={(e) => onChange("consentToScan", e.target.value)}>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
    </div>

    <div>
      <label className={labelClass}>Clinical Indication</label>
      <input type="text" className={inputClass} value={data.clinicalIndication || ""} onChange={(e) => onChange("clinicalIndication", e.target.value)} />
    </div>

    {/* Scan Method and cardiac Row */}
    <div className="border-t border-black/[.08] dark:border-white/[.08] pt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label className={labelClass}>Scan Method</label>
        <input type="text" className={inputClass} value={data.scanMethod || "Transabdominal"} onChange={(e) => onChange("scanMethod", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Fetal Heart</label>
        <input type="text" className={inputClass} value={data.fetalHeart || "Visualized"} onChange={(e) => onChange("fetalHeart", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Placenta</label>
        <input type="text" className={inputClass} value={data.placenta || ""} onChange={(e) => onChange("placenta", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Placental Position</label>
        <input type="text" className={inputClass} value={data.placentalPosition || ""} onChange={(e) => onChange("placentalPosition", e.target.value)} />
      </div>
    </div>

    {/* Gestation and Fetus Count */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label className={labelClass}>Fetal Number</label>
        <select className={selectClass} value={data.fetalNumber || "Singleton"} onChange={(e) => onChange("fetalNumber", e.target.value)}>
          <option value="Singleton">Singleton</option>
          <option value="Multiple">Multiple</option>
        </select>
      </div>
    </div>

    {/* Gestation & EDD in the same row */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div>
        <label className={labelClass}>Estimated Due Date</label>
        <input type="date" className={inputClass} value={data.edd || ""} onChange={(e) => onChange("edd", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Gestation Weeks</label>
        <input type="number" className={inputClass} value={data.gestationWeeks || ""} onChange={(e) => onChange("gestationWeeks", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Gestation Days</label>
        <input type="number" className={inputClass} value={data.gestationDays || ""} onChange={(e) => onChange("gestationDays", e.target.value)} />
      </div>
    </div>

    {/* Comments */}
    <div>
      <label className={labelClass}>Comments</label>
      <textarea rows={3} className={inputClass} value={data.comments || "Advised to follow NHS antenatal care pathway."} onChange={(e) => onChange("comments", e.target.value)} />
    </div>

    {/* Signatures */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 border-t border-black/[.08] dark:border-white/[.08] pt-6">
      <div>
        <label className={labelClass}>Sonographer</label>
        <input type="text" className={inputClass} value={data.sonographer || ""} onChange={(e) => onChange("sonographer", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Chaperone</label>
        <input type="text" className={inputClass} value={data.chaperone || ""} onChange={(e) => onChange("chaperone", e.target.value)} />
      </div>
    </div>
  </div>
);

export const AbdominalUltrasoundForm: React.FC<ReportFormProps> = ({ data, onChange }) => (
  <div className="space-y-6">
    {/* <div className="text-xs space-y-2.5 text-foreground/80">
      <p className="font-bold">ABDOMINAL ULTRASOUND SCAN REPORT</p>
      <p className="italic text-foreground/60">
        (Verbal consent was obtained for the ultrasound scan)
      </p>
    </div> */}

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div>
        <label className={labelClass}>Study Date</label>
        <input type="date" className={inputClass} value={data.studyDate || new Date().toISOString().split("T")[0]} onChange={(e) => onChange("studyDate", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>NHS No</label>
        <input type="text" className={inputClass} value={data.nhsNumber || ""} onChange={(e) => onChange("nhsNumber", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Referrer</label>
        <input type="text" className={inputClass} value={data.referrer || "Self-referral"} onChange={(e) => onChange("referrer", e.target.value)} />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label className={labelClass}>Study Description</label>
        <input type="text" className={inputClass} value={data.studyDescription || "Abdominal examination"} onChange={(e) => onChange("studyDescription", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Clinical Indication</label>
        <input type="text" className={inputClass} value={data.clinicalIndication || ""} onChange={(e) => onChange("clinicalIndication", e.target.value)} />
      </div>
    </div>

    <div>
      <label className={labelClass}>Scan Findings</label>
      <textarea rows={8} className={inputClass} value={data.scanFindings || "Liver is normal in size, echotexture and outline. No intra or extra ductal dilatation or focal lesions. Portal vein shows patent venous flow. Thin-walled gall bladder appears normal and shows no pathology within. Common bile duct is within normal limits (mm). \n\nKidneys are normal in size, echotexture and cortical thickness. No obvious evidence of scarring or focal lesions. No hydronephrosis seen bilaterally. Bipolar renal measurements: Right kidney – cm, Left kidney –cm. Spleen is normal in contour and size. Cranio-caudal splenic measurement – cm. Pancreas appear normal where visualised. Partially obscured by gassy shadows. Aorta is of normal calibre, measuring cm in transverse diameter. No obvious ascites seen."} onChange={(e) => onChange("scanFindings", e.target.value)} />
    </div>

    <div>
      <label className={labelClass}>Summary</label>
      <input type="text" className={inputClass} value={data.summary || "Normal upper abdominal examination. No obvious cause identified on scan today."} onChange={(e) => onChange("summary", e.target.value)} />
    </div>

    <div>
      <label className={labelClass}>Disclaimer & Advice</label>
      <textarea rows={8} className={inputClass} value={data.disclaimer || "Patient is advised to take this report provided by Insight Health Services if seeing GP with the above symptoms. \nThe general upper abdominal ultrasound scan has been performed with care and is intended to aid in monitoring your overall health. However, due to the inherent limitations of ultrasound, not all pathologies may be detected. The findings on today’s scan should be reviewed alongside usual NHS care. This report does not replace a full clinical evaluation. Insight Health service is not liable for any undetected conditions or outcomes."} onChange={(e) => onChange("disclaimer", e.target.value)} />
    </div>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 border-t border-black/[.08] dark:border-white/[.08] pt-6">
      <div>
        <label className={labelClass}>Sonographer</label>
        <input type="text" className={inputClass} value={data.sonographer || ""} onChange={(e) => onChange("sonographer", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Chaperone</label>
        <input type="text" className={inputClass} value={data.chaperone || ""} onChange={(e) => onChange("chaperone", e.target.value)} />
      </div>
    </div>
  </div>
);

export const DVTUltrasoundForm: React.FC<ReportFormProps> = ({ data, onChange }) => (
  <div className="space-y-6">
    <div className="text-xs space-y-2.5 text-foreground/80">
      <p className="font-bold">DEEP VENOUS ULTRASOUND SCAN REPORT</p>
      <p className="italic text-foreground/60">
        (Verbal consent was obtained for the ultrasound scan)
      </p>
    </div>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div>
        <label className={labelClass}>Study Date</label>
        <input type="date" className={inputClass} value={data.studyDate || new Date().toISOString().split("T")[0]} onChange={(e) => onChange("studyDate", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>NHS No</label>
        <input type="text" className={inputClass} value={data.nhsNumber || ""} onChange={(e) => onChange("nhsNumber", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Referrer</label>
        <input type="text" className={inputClass} value={data.referrer || "Self-referral"} onChange={(e) => onChange("referrer", e.target.value)} />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label className={labelClass}>Study Description</label>
        <input type="text" className={inputClass} value={data.studyDescription || "Deep venous examination"} onChange={(e) => onChange("studyDescription", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Clinical Indication</label>
        <input type="text" className={inputClass} value={data.clinicalIndication || ""} onChange={(e) => onChange("clinicalIndication", e.target.value)} />
      </div>
    </div>

    <div>
      <label className={labelClass}>Scan Findings</label>
      <textarea rows={6} className={inputClass} value={data.scanFindings || ""} onChange={(e) => onChange("scanFindings", e.target.value)} />
    </div>

    <div>
      <label className={labelClass}>Summary</label>
      <input type="text" className={inputClass} value={data.summary || ""} onChange={(e) => onChange("summary", e.target.value)} />
    </div>

    <div>
      <label className={labelClass}>Disclaimer & Advice</label>
      <textarea rows={8} className={inputClass} value={data.disclaimer || "Patient is advised to take this report provided by Insight Health Services if seeing GP with the above symptoms. \nThe general ultrasound scan has been performed with care and is intended to aid in monitoring your overall health. However, due to the inherent limitations of ultrasound, not all pathologies may be detected. The findings on today’s scan should be reviewed alongside usual NHS care. This report does not replace a full clinical evaluation. Insight Health service is not liable for any undetected conditions or outcomes."} onChange={(e) => onChange("disclaimer", e.target.value)} />
    </div>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 border-t border-black/[.08] dark:border-white/[.08] pt-6">
      <div>
        <label className={labelClass}>Sonographer</label>
        <input type="text" className={inputClass} value={data.sonographer || ""} onChange={(e) => onChange("sonographer", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Chaperone</label>
        <input type="text" className={inputClass} value={data.chaperone || ""} onChange={(e) => onChange("chaperone", e.target.value)} />
      </div>
    </div>
  </div>
);

export const PelvicWellbeingForm: React.FC<ReportFormProps> = ({ data, onChange }) => (
  <div className="space-y-6">
    <div className="text-xs space-y-2.5 text-foreground/80">
      <p className="font-bold">PELVIC ULTRASOUND SCAN REPORT</p>
      <p>
        Transabdominal and transvaginal ultrasound examination performed with consent. Consent form signed. Transvaginal probe decontaminated with TRISTEL DUO LOT (10) 816901 Expiry date: 09.07.2026.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div>
        <label className={labelClass}>Study Date</label>
        <input type="date" className={inputClass} value={data.studyDate || new Date().toISOString().split("T")[0]} onChange={(e) => onChange("studyDate", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>NHS No</label>
        <input type="text" className={inputClass} value={data.nhsNumber || ""} onChange={(e) => onChange("nhsNumber", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Referrer</label>
        <input type="text" className={inputClass} value={data.referrer || "Self-referral"} onChange={(e) => onChange("referrer", e.target.value)} />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label className={labelClass}>Study Description</label>
        <input type="text" className={inputClass} value={data.studyDescription || "Gynaecological ultrasound"} onChange={(e) => onChange("studyDescription", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Clinical Indication</label>
        <input type="text" className={inputClass} value={data.clinicalIndication || "Nil gynae history. Nil medical history."} onChange={(e) => onChange("clinicalIndication", e.target.value)} />
      </div>
    </div>

    {/* LMP & Obstetric History Section */}
    <div className="border-t border-black/[.08] dark:border-white/[.08] pt-6 flex flex-col sm:flex-row sm:items-end gap-6">
      <div className="flex-1 max-w-xs">
        <label className={labelClass}>LMP</label>
        <input type="text" className={inputClass} value={data.lmp || ""} placeholder="Last Menstrual Period" onChange={(e) => onChange("lmp", e.target.value)} />
      </div>
      <div className="flex items-center gap-6 pb-2.5">
        <div className="flex items-center gap-2">
          <input type="checkbox" id="para" className={checkboxClass} checked={!!data.para} onChange={(e) => onChange("para", e.target.checked)} />
          <label htmlFor="para" className="text-sm font-medium text-foreground/80 cursor-pointer">Para</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="normalBirths" className={checkboxClass} checked={!!data.normalBirths} onChange={(e) => onChange("normalBirths", e.target.checked)} />
          <label htmlFor="normalBirths" className="text-sm font-medium text-foreground/80 cursor-pointer">Normal births</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="cs" className={checkboxClass} checked={!!data.cs} onChange={(e) => onChange("cs", e.target.checked)} />
          <label htmlFor="cs" className="text-sm font-medium text-foreground/80 cursor-pointer">CS</label>
        </div>
      </div>
    </div>

    <div>
      <label className={labelClass}>Scan Findings</label>
      <textarea rows={6} className={inputClass} value={data.scanFindings || "Normal looking anteverted uterus measures : \nThe myometrium is unremarkable\nCx appears normal – up to date with smears. \nEndometrium is well defined/triphasic measuring    mm \nBoth ovaries are normal in size/shape and appearance. \nNil adnexal mass/cyst or free fluid."} onChange={(e) => onChange("scanFindings", e.target.value)} />
    </div>

    <div>
      <label className={labelClass}>Impression</label>
      <input type="text" className={inputClass} value={data.impression || ""} onChange={(e) => onChange("impression", e.target.value)} />
    </div>

    <div>
      <label className={labelClass}>Disclaimer & Advice</label>
      <textarea rows={8} className={inputClass} value={data.disclaimer || "The pelvic ultrasound scan has been performed with care and is intended to aid in monitoring your overall health. However, due to the inherent limitations of ultrasound, not all pathologies may be detected. The findings on today’s scan should be reviewed alongside usual NHS care. This report does not replace a full clinical evaluation. Insight Health service is not liable for any undetected conditions or outcomes."} onChange={(e) => onChange("disclaimer", e.target.value)} />
    </div>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 border-t border-black/[.08] dark:border-white/[.08] pt-6">
      <div>
        <label className={labelClass}>Sonographer</label>
        <input type="text" className={inputClass} value={data.sonographer || ""} onChange={(e) => onChange("sonographer", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Chaperone</label>
        <input type="text" className={inputClass} value={data.chaperone || ""} onChange={(e) => onChange("chaperone", e.target.value)} />
      </div>
    </div>
  </div>
);

export const TesticularUltrasoundForm: React.FC<ReportFormProps> = ({ data, onChange }) => (
  <div className="space-y-6">
    {/* <div className="text-xs space-y-2.5 text-foreground/80">
      <p className="font-bold">TESTICULAR ULTRASOUND SCAN REPORT</p>
      <p className="italic text-foreground/60">
        (Verbal consent was obtained for the ultrasound scan)
      </p>
    </div> */}

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div>
        <label className={labelClass}>Study Date</label>
        <input type="date" className={inputClass} value={data.studyDate || new Date().toISOString().split("T")[0]} onChange={(e) => onChange("studyDate", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>NHS No</label>
        <input type="text" className={inputClass} value={data.nhsNumber || ""} onChange={(e) => onChange("nhsNumber", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Referrer</label>
        <input type="text" className={inputClass} value={data.referrer || "Self-referral"} onChange={(e) => onChange("referrer", e.target.value)} />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label className={labelClass}>Study Description</label>
        <input type="text" className={inputClass} value={data.studyDescription || ""} onChange={(e) => onChange("studyDescription", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Clinical Indication</label>
        <input type="text" className={inputClass} value={data.clinicalIndication || ""} onChange={(e) => onChange("clinicalIndication", e.target.value)} />
      </div>
    </div>

    <div>
      <label className={labelClass}>Scan Findings</label>
      <textarea rows={6} className={inputClass} value={data.scanFindings || ""} onChange={(e) => onChange("scanFindings", e.target.value)} />
    </div>

    <div>
      <label className={labelClass}>Summary</label>
      <input type="text" className={inputClass} value={data.summary || ""} onChange={(e) => onChange("summary", e.target.value)} />
    </div>

    <div>
      <label className={labelClass}>Disclaimer & Advice</label>
      <textarea rows={8} className={inputClass} value={data.disclaimer || "Patient is advised to take this report provided by Insight Health Services if seeing GP with the above symptoms. \nThe ultrasound scan has been performed with care and is intended to aid in monitoring your overall health. However, due to the inherent limitations of ultrasound, not all pathologies may be detected. The findings on today’s scan should be reviewed alongside usual NHS care. This report does not replace a full clinical evaluation. Insight Health service is not liable for any undetected conditions or outcomes."} onChange={(e) => onChange("disclaimer", e.target.value)} />
    </div>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 border-t border-black/[.08] dark:border-white/[.08] pt-6">
      <div>
        <label className={labelClass}>Sonographer</label>
        <input type="text" className={inputClass} value={data.sonographer || ""} onChange={(e) => onChange("sonographer", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Chaperone</label>
        <input type="text" className={inputClass} value={data.chaperone || ""} onChange={(e) => onChange("chaperone", e.target.value)} />
      </div>
    </div>
  </div>
);
