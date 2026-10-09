"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/global/Sidebar";

type RoleType = "super_admin" | "administrator" | "reception" | "clinician";

const roleAllowedRoutes: Record<RoleType, string[]> = {
    super_admin: [
        "/dashboard/overview",
        "/dashboard/calendar",
        "/dashboard/schedule",
        "/dashboard/appointments",
        "/dashboard/patients",
        "/dashboard/patients/clinical",
        "/dashboard/clinical-notes",
        "/dashboard/services",
        "/dashboard/staff",
        "/dashboard/payments",
        "/dashboard/reports",
        "/dashboard/settings",
        "/dashboard/notifications",
        "/dashboard/clinics",
        "/dashboard/forms"
    ],
    administrator: [
        "/dashboard/overview",
        "/dashboard/calendar",
        "/dashboard/schedule",
        "/dashboard/appointments",
        "/dashboard/patients",
        "/dashboard/patients/clinical",
        "/dashboard/clinical-notes",
        "/dashboard/services",
        "/dashboard/staff",
        "/dashboard/payments",
        "/dashboard/reports",
        "/dashboard/settings",
        "/dashboard/notifications",
        "/dashboard/forms"
    ],
    reception: [
        "/dashboard/overview",
        "/dashboard/calendar",
        "/dashboard/appointments",
        "/dashboard/patients",
        "/dashboard/payments",
        "/dashboard/notifications"
    ],
    clinician: [
        "/dashboard/schedule",
        "/dashboard/patients/clinical",
        "/dashboard/clinical-notes",
        "/dashboard/notifications"
    ]
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [userRole, setUserRole] = useState<RoleType | null>(null);

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole") as RoleType | null;

        if (!storedRole) {
            // Not authenticated -> redirect to login
            router.push("/login");
            return;
        }

        setUserRole(storedRole);
    }, [router]);

    // Give a default render so children are always rendered (prevents Next.js hook errors)
    if (!userRole) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-black/60">
                <div className="text-sm font-medium">Loading Dashboard...</div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-transparent">
            <div className="flex h-full w-full border border-black/10 dark:border-white/10 bg-transparent">
                <Sidebar userRole={userRole} />

                <main className="flex-1 overflow-hidden m-2 ml-0 rounded-[2rem] bg-slate-50/60 dark:bg-black/60 backdrop-blur-md border border-black/10 dark:border-white/10">
                    <div className="h-full w-full overflow-y-auto thin-scrollbar ">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
