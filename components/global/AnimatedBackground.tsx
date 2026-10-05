"use client";

import React from "react";

export default function AnimatedBackground() {
    return (
        <div className="fixed inset-0 -z-50 h-full w-full bg-slate-50 dark:bg-[#050514] overflow-hidden">
            {/* Sphere 1: Dark Blue */}
            <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-blue-300 dark:bg-[#1E227D] opacity-60 blur-3xl animate-blob" />
            
            {/* Sphere 2: Hot Pink */}
            <div className="absolute top-32 right-16 h-[400px] w-[400px] rounded-full bg-pink-300 dark:bg-[#F000E2] opacity-40 blur-3xl animate-blob animation-delay-2000" />
            
            {/* Sphere 3: Dark Blue offset */}
            <div className="absolute top-16 right-64 h-[450px] w-[450px] rounded-full bg-blue-200 dark:bg-[#1E227D] opacity-50 blur-3xl animate-blob animation-delay-4000" />
        </div>
    );
}

