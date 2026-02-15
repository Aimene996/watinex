"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import en from "../../locales/en.json";
import ar from "../../locales/ar.json";
import fr from "../../locales/fr.json";

const LOCALE_COOKIE = "locale";
const LOCALE_STORAGE = "locale";

type Locale = "ar" | "en" | "fr";
type Translations = typeof ar;

const translations: Record<Locale, Translations> = { ar, en, fr };

function setLocaleCookie(value: Locale) {
  if (typeof document === "undefined") return;
  document.cookie = `${LOCALE_COOKIE}=${value};path=/;max-age=31536000;SameSite=Lax`;
}


interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getNested(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const p of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[p];
  }
  return typeof current === "string" ? current : undefined;
}

export function LanguageProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    setLocaleCookie(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCALE_STORAGE, next);
      document.documentElement.lang = next;
      document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [mounted, locale]);

  const t = useCallback(
    (key: string) => {
      const value = getNested(translations[locale] as Record<string, unknown>, key);
      return value ?? key;
    },
    [locale]
  );

  const dir = locale === "ar" ? "rtl" : "ltr";

  const value = useMemo<LanguageContextValue>(
    () => ({ locale, setLocale, t, dir }),
    [locale, setLocale, t, dir]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
