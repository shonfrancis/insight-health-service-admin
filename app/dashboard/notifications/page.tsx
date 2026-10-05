"use client";

import { useState } from "react";
import { UserX, AlertCircle, CheckCircle, Info, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
    // Extended mock data for the notifications page
    const [alerts, setAlerts] = useState([
        { id: 1, type: "Cancellation", message: "James Holden cancelled Growth Scan", time: "10 mins ago", icon: UserX, color: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30", read: false },
        { id: 2, type: "No-Show", message: "Amos Burton missed 08:30 AM appointment", time: "1 hr ago", icon: AlertCircle, color: "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30", read: false },
        { id: 3, type: "Confirmation", message: "Eleanor Vance confirmed 4D/5D Baby Scan", time: "2 hrs ago", icon: CheckCircle, color: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30", read: true },
        // { id: 4, type: "System Update", message: "New version of the software has been deployed.", time: "1 day ago", icon: Info, color: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30", read: true },
    ]);

    const markAllAsRead = () => {
        setAlerts(alerts.map(a => ({ ...a, read: true })));
    };

    return (
        <div className="flex w-full flex-col gap-8 p-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground">Notifications</h1>
                    <p className="mt-1 text-sm text-foreground/60">
                        View and manage all your alerts and notifications.
                    </p>
                </div>
                {alerts.some(a => !a.read) && (
                    <Button variant="outline" size="sm" icon={Check} onClick={markAllAsRead}>
                        Mark all as read
                    </Button>
                )}
            </div>

            <div className="rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22] overflow-hidden">
                <div className="divide-y divide-black/[.08] dark:divide-white/[.145]">
                    {alerts.map((alert) => {
                        const Icon = alert.icon;
                        return (
                            <div key={alert.id} className={`flex gap-4 p-5 transition-colors hover:bg-black/[.02] dark:hover:bg-white/[.02] ${!alert.read ? "bg-brand/5 dark:bg-brand/10" : ""}`}>
                                <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${alert.color}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col gap-1 flex-1">
                                    <div className="flex justify-between items-start">
                                        <span className={`text-sm ${!alert.read ? "font-bold text-foreground" : "font-medium text-foreground/80"}`}>{alert.type}</span>
                                        <span className="text-xs font-medium text-foreground/50">{alert.time}</span>
                                    </div>
                                    <span className={`text-sm ${!alert.read ? "text-foreground/90 font-medium" : "text-foreground/70"}`}>{alert.message}</span>
                                </div>
                                {!alert.read && (
                                    <div className="flex items-center justify-center pl-2">
                                        <span className="block h-2.5 w-2.5 rounded-full bg-brand" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {alerts.length === 0 && (
                        <div className="p-12 text-center text-sm text-foreground/50">
                            You're all caught up! No notifications to display.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

