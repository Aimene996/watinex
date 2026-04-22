"use client";

import { useLanguage } from "../providers/LanguageProvider";
import { ChevronDown, Languages } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const LOCALES: { value: "ar" | "en" | "fr"; label: string }[] = [
  { value: "ar", label: "العربية" },
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = LOCALES.find((l) => l.value === locale) ?? LOCALES[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 sm:h-9 min-w-[6rem] sm:min-w-[7rem] items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 transition hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <Languages className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" aria-hidden />
        <span className="truncate">{current.label}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute top-full left-0 z-50 mt-1 min-w-[6rem] sm:min-w-[7rem] rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 py-1 shadow-lg"
        >
          {LOCALES.map((opt) => (
            <li key={opt.value} role="option" aria-selected={locale === opt.value}>
              <button
                type="button"
                onClick={() => {
                  setLocale(opt.value);
                  setOpen(false);
                }}
                className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs sm:text-sm transition hover:bg-slate-100 dark:hover:bg-slate-700 ${
                  locale === opt.value ? "bg-slate-100 dark:bg-slate-700 font-medium" : ""
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
