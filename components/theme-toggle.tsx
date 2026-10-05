"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="flex w-full items-center justify-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-white/70 transition-all hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white">
        <span className="h-5 w-5 opacity-70" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex h-10 w-full cursor-pointer items-center rounded-full bg-slate-200 p-1 transition-colors dark:bg-zinc-900/40 border border-black/5 dark:border-white/10"
      aria-label="Toggle Theme"
    >
      {/* Animated Sliding Background Pill */}
      <div
        className={`absolute left-1 top-1 h-8 w-[calc(50%-4px)] rounded-full bg-white border border-black/10 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] dark:bg-[#3C43EC] dark:border-white/10 ${isDark ? "translate-x-full" : "translate-x-0"
          }`}
      />

      {/* Light Option */}
      <div
        className={`relative z-10 flex w-1/2 items-center justify-center gap-2 text-sm font-medium transition-colors duration-500 ${!isDark ? "text-slate-900" : "text-slate-500 dark:text-white/50"
          }`}
      >
        <Sun className="h-4 w-4" />
      </div>

      {/* Dark Option */}
      <div
        className={`relative z-10 flex w-1/2 items-center justify-center gap-2 text-sm font-medium transition-colors duration-500 ${isDark ? "text-white" : "text-slate-500 dark:text-white/50"
          }`}
      >
        <Moon className="h-4 w-4" />
      </div>
    </button>
  );
}

