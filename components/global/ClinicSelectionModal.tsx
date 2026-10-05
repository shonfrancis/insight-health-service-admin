"use client";

import { useState } from "react";
import { Building2, MapPin, Check } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface Clinic {
    id: string;
    name: string;
    location: string;
}

const mockClinics: Clinic[] = [
    { id: "1", name: "Downtown Medical Center", location: "New York, NY" },
    { id: "2", name: "Westside Family Clinic", location: "Los Angeles, CA" },
    { id: "3", name: "Northpoint Health", location: "Chicago, IL" },
    { id: "4", name: "Sunrise Care", location: "Miami, FL" },
    { id: "5", name: "Pine Valley Wellness", location: "Seattle, WA" },
    { id: "6", name: "Lakeside Medical Group", location: "Austin, TX" },
    { id: "7", name: "Oakridge Health Partners", location: "Denver, CO" },
    { id: "8", name: "Summit Health", location: "Boston, MA" },
];

export default function ClinicSelectionModal({ onSelect }: { onSelect: (clinicId: string) => void }) {
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <Modal
            isOpen={true}
            title="Select a Clinic"
            description="Please choose the facility you wish to manage for this session."
            maxWidth="2xl"
        >
            <div className="grid max-h-[50vh] grid-cols-1 gap-3 overflow-y-auto thin-scrollbar sm:grid-cols-2 p-1 pr-2">
                {mockClinics.map((clinic) => (
                    <div
                        key={clinic.id}
                        onClick={() => setSelected(clinic.id)}
                        className={`group relative flex cursor-pointer items-center gap-4 rounded-xl border p-5 transition-all hover:bg-slate-50 dark:hover:bg-black/40 ${
                            selected === clinic.id
                                ? "border-[#3C43EC] bg-slate-50 dark:border-[#3C43EC] dark:bg-black/60 ring-1 ring-[#3C43EC]"
                                : "border-black/10 dark:border-white/10"
                        }`}
                    >
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                            selected === clinic.id
                                ? "border-[#3C43EC]/20 bg-[#3C43EC]/10 text-[#3C43EC]"
                                : "border-black/10 bg-transparent text-slate-600 dark:border-white/10 dark:text-slate-300"
                        }`}>
                            <Building2 className="h-6 w-6" />
                        </div>

                        <div className="flex flex-col overflow-hidden">
                            <span className="truncate text-base font-semibold text-slate-900 dark:text-white">
                                {clinic.name}
                            </span>
                            <span className="flex items-center gap-1.5 truncate text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                                <MapPin className="h-4 w-4" />
                                {clinic.location}
                            </span>
                        </div>

                        {selected === clinic.id && (
                            <div className="absolute right-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#3C43EC] text-white">
                                <Check className="h-4 w-4" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-end">
                <Button
                    variant="filled"
                    onClick={() => {
                        if (selected) {
                            localStorage.setItem('selectedClinic', selected);
                            onSelect(selected);
                        }
                    }}
                    disabled={!selected}
                    className="rounded-full px-8"
                >
                    Continue to Dashboard
                </Button>
            </div>
        </Modal>
    );
}

