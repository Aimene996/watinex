"use client";

import {
  type RegistrationStatus,
  type ServiceType,
  STATUSES,
  SERVICE_TYPES,
  NICHE_OPTIONS,
  type Locale,
  statusLabel,
  serviceLabel,
  nicheLabel,
} from "../lib";

interface FilterBarProps {
  q: string;
  onQChange: (v: string) => void;
  statusFilter: RegistrationStatus | "";
  onStatusChange: (v: RegistrationStatus | "") => void;
  serviceFilter: ServiceType | "";
  onServiceChange: (v: ServiceType | "") => void;
  nicheFilter: string;
  onNicheChange: (v: string) => void;
  importedFilter: "" | "yes" | "no";
  onImportedChange: (v: "" | "yes" | "no") => void;
  activeFiltersCount: number;
  onRefresh: () => void;
  loading: boolean;
  text: {
    search: string;
    filter: string;
    refresh: string;
  };
  themeMode: "dark" | "light";
  locale: Locale;
}

export default function FilterBar({
  q,
  onQChange,
  statusFilter,
  onStatusChange,
  serviceFilter,
  onServiceChange,
  nicheFilter,
  onNicheChange,
  importedFilter,
  onImportedChange,
  activeFiltersCount,
  onRefresh,
  loading,
  text,
  themeMode,
  locale,
}: FilterBarProps) {
  const isDark = themeMode === "dark";
  const isRtl = locale === "ar";
  const inputBg = isDark
    ? "bg-slate-900/60 border-slate-700/60 text-slate-100 placeholder:text-slate-500"
    : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400";
  const selectBg = isDark
    ? "bg-slate-900/60 border-slate-700/60 text-slate-300"
    : "bg-white border-slate-200 text-slate-700";
  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const cardBg = isDark ? "bg-slate-900/40 border-slate-800/50" : "bg-white border-slate-200";

  const clearAll = () => {
    onStatusChange("");
    onServiceChange("");
    onNicheChange("");
    onImportedChange("");
    onQChange("");
  };

  return (
    <section className={`rounded-2xl border p-4 ${cardBg}`}>
      {/* Search Row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <span className={`material-symbols-outlined absolute top-1/2 -translate-y-1/2 text-lg ${muted} ${isRtl ? "right-3" : "left-3"}`}>
            search
          </span>
          <input
            value={q}
            onChange={(e) => onQChange(e.target.value)}
            placeholder={text.search}
            className={`w-full rounded-xl border py-2.5 text-sm outline-none transition-colors focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 ${inputBg} ${
              isRtl ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
            }`}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-500 hover:shadow-md hover:shadow-blue-600/30 disabled:opacity-60"
          >
            <span className={`material-symbols-outlined text-base ${loading ? "animate-spin" : ""}`}>
              refresh
            </span>
            {text.refresh}
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as RegistrationStatus | "")}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium outline-none transition-colors ${selectBg}`}
        >
          <option value="">{locale === "ar" ? "كل الحالات" : "Tous les statuts"}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{statusLabel(s, locale)}</option>
          ))}
        </select>

        {/* Service */}
        <select
          value={serviceFilter}
          onChange={(e) => onServiceChange(e.target.value as ServiceType | "")}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium outline-none transition-colors ${selectBg}`}
        >
          <option value="">{locale === "ar" ? "كل الخدمات" : "Tous les services"}</option>
          {SERVICE_TYPES.map((s) => (
            <option key={s} value={s}>{serviceLabel(s, locale)}</option>
          ))}
        </select>

        {/* Niche */}
        <select
          value={nicheFilter}
          onChange={(e) => onNicheChange(e.target.value)}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium outline-none transition-colors ${selectBg}`}
        >
          <option value="">{locale === "ar" ? "كل المجالات" : "Toutes les niches"}</option>
          {NICHE_OPTIONS.map((n) => (
            <option key={n} value={n}>{nicheLabel(n, locale)}</option>
          ))}
        </select>

        {/* Imported */}
        <select
          value={importedFilter}
          onChange={(e) => onImportedChange(e.target.value as "" | "yes" | "no")}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium outline-none transition-colors ${selectBg}`}
        >
          <option value="">{locale === "ar" ? "تم الاستيراد؟" : "Importé ?"}</option>
          <option value="yes">{locale === "ar" ? "نعم" : "Oui"}</option>
          <option value="no">{locale === "ar" ? "لا" : "Non"}</option>
        </select>

        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10"
          >
            <span className="material-symbols-outlined text-sm">close</span>
            {locale === "ar"
              ? `مسح ${activeFiltersCount} ${activeFiltersCount > 1 ? "فلاتر" : "فلتر"}`
              : `Effacer ${activeFiltersCount} filtre${activeFiltersCount > 1 ? "s" : ""}`}
          </button>
        )}
      </div>
    </section>
  );
}
