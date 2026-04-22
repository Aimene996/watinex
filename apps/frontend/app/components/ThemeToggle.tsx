"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

type ThemeOption = "light" | "dark" | "system";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
        aria-hidden
      >
        <span className="h-3 w-3 sm:h-4 sm:w-4" />
      </div>
    );
  }

  const current: ThemeOption = (theme as ThemeOption) || "system";
  const cycle = () => {
    const next: ThemeOption =
      current === "light" ? "dark" : current === "dark" ? "system" : "light";
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={cycle}
      className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 transition hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500"
      aria-label={
        current === "light"
          ? "Switch to dark mode"
          : current === "dark"
            ? "Switch to system theme"
            : "Switch to light mode"
      }
    >
      {resolvedTheme === "dark" ? (
        <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
      ) : (
        <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
      )}
    </button>
  );
}
