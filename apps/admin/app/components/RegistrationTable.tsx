"use client";

import {
  type Registration,
  type RegistrationStatus,
  statusLabel,
  statusColor,
  serviceLabel,
  nicheLabel,
  relativeAge,
  type Locale,
} from "../lib";

interface RegistrationTableProps {
  registrations: Registration[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onGeneratePdf?: (id: string) => void;
  themeMode: "dark" | "light";
  text: {
    recentSubmissions: string;
    showing: string;
    of: string;
    noData: string;
  };
  locale: Locale;
}

export default function RegistrationTable({
  registrations,
  selectedId,
  onSelect,
  onGeneratePdf,
  themeMode,
  text,
  locale,
}: RegistrationTableProps) {
  const isDark = themeMode === "dark";
  const isRtl = locale === "ar";
  const cardBg = isDark ? "bg-slate-900/50 border-slate-800/50" : "bg-white border-slate-200";
  const headerBg = isDark ? "bg-slate-800/30" : "bg-slate-50";
  const headerText = isDark ? "text-slate-400" : "text-slate-500";
  const rowBorder = isDark ? "border-slate-800/30" : "border-slate-100";
  const rowHover = isDark ? "hover:bg-slate-800/30" : "hover:bg-blue-50/50";
  const rowSelected = isDark
    ? `bg-blue-500/8 ${isRtl ? "border-r-blue-500" : "border-l-blue-500"}`
    : `bg-blue-50 ${isRtl ? "border-r-blue-500" : "border-l-blue-500"}`;
  const muted = isDark ? "text-slate-500" : "text-slate-400";

  if (registrations.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center rounded-2xl border px-6 py-16 ${cardBg}`}>
        <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${isDark ? "bg-slate-800/60" : "bg-slate-100"}`}>
          <span className={`material-symbols-outlined text-3xl ${muted}`}>inbox</span>
        </div>
        <p className={`text-sm font-medium ${muted}`}>{text.noData}</p>
        <p className={`mt-1 text-xs ${muted}`}>{locale === "ar" ? "حاول تعديل الفلاتر أو البحث" : "Essayez de modifier vos filtres ou votre recherche"}</p>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-2xl border ${cardBg}`}>
      {/* Header */}
      <div className={`flex items-center justify-between border-b px-5 py-3 ${headerBg} ${rowBorder}`}>
        <h2 className="text-sm font-semibold">{text.recentSubmissions}</h2>
        <span className={`text-xs ${muted}`}>
          {text.showing} {registrations.length} {text.of} {registrations.length}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className={`w-full text-sm ${isRtl ? "text-right" : "text-left"}`}>
          <thead>
            <tr className={`border-b ${rowBorder} ${headerBg}`}>
              <th className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-wider ${headerText}`}>{locale === "ar" ? "الاسم" : "Nom"}</th>
              <th className={`hidden px-5 py-3 text-[11px] font-semibold uppercase tracking-wider md:table-cell ${headerText}`}>{locale === "ar" ? "البريد" : "Email"}</th>
              <th className={`hidden px-5 py-3 text-[11px] font-semibold uppercase tracking-wider lg:table-cell ${headerText}`}>{locale === "ar" ? "الهاتف" : "Téléphone"}</th>
              <th className={`hidden px-5 py-3 text-[11px] font-semibold uppercase tracking-wider sm:table-cell ${headerText}`}>{locale === "ar" ? "الخدمة" : "Service"}</th>
              <th className={`hidden px-5 py-3 text-[11px] font-semibold uppercase tracking-wider xl:table-cell ${headerText}`}>{locale === "ar" ? "المجال" : "Niche"}</th>
              <th className={`hidden px-5 py-3 text-[11px] font-semibold uppercase tracking-wider xl:table-cell ${headerText}`}>{locale === "ar" ? "ملاحظات" : "Notes"}</th>
              <th className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-wider ${headerText}`}>{locale === "ar" ? "الحالة" : "Statut"}</th>
              <th className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-wider ${headerText} ${isRtl ? "text-left" : "text-right"}`}>{locale === "ar" ? "التاريخ" : "Date"}</th>
              <th className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-wider ${headerText} ${isRtl ? "text-right" : "text-left"}`}>{locale === "ar" ? "PDF" : "PDF"}</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg, idx) => {
              const isSelected = reg.id === selectedId;
              return (
                <tr
                  key={reg.id}
                  onClick={() => onSelect(reg.id)}
                  className={`cursor-pointer border-b transition-all duration-150 ${rowBorder} ${isRtl ? "border-r-2" : "border-l-2"} ${
                    isSelected
                      ? rowSelected
                      : `${isRtl ? "border-r-transparent" : "border-l-transparent"} ${rowHover}`
                  }`}
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="font-semibold">{reg.full_name}</p>
                      <p className={`text-xs md:hidden ${muted}`}>{reg.email}</p>
                    </div>
                  </td>
                  <td className={`hidden px-5 py-3.5 md:table-cell ${muted}`}>
                    <span className="text-xs">{reg.email}</span>
                  </td>
                  <td className={`hidden px-5 py-3.5 lg:table-cell ${muted}`}>
                    <span className="text-xs">{reg.phone}</span>
                  </td>
                  <td className="hidden px-5 py-3.5 sm:table-cell">
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${
                      reg.service_type === "SHIPPING"
                        ? isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-cyan-50 text-cyan-700"
                        : isDark ? "bg-violet-500/10 text-violet-400" : "bg-violet-50 text-violet-700"
                    }`}>
                      {serviceLabel(reg.service_type, locale)}
                    </span>
                  </td>
                  <td className="hidden px-5 py-3.5 xl:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {reg.niche.slice(0, 2).map((n) => (
                        <span
                          key={n}
                          className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                            isDark ? "bg-slate-800/60 text-slate-400" : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {nicheLabel(n, locale)}
                        </span>
                      ))}
                      {reg.niche.length > 2 && (
                        <span className={`text-[10px] ${muted}`}>+{reg.niche.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className={`hidden max-w-[180px] px-5 py-3.5 text-xs xl:table-cell ${muted}`}>
                    <span className="line-clamp-2">{(reg.admin_notes ?? "").trim() || "—"}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusColor(reg.status)}`}>
                      <span className={`inline-block h-1.5 w-1.5 rounded-full ${
                        reg.status === "NEW" ? "bg-blue-400" :
                        reg.status === "CONTACTED" ? "bg-amber-400" :
                        reg.status === "CONFIRMED" ? "bg-emerald-400" :
                        "bg-red-400"
                      }`} />
                      {statusLabel(reg.status, locale)}
                    </span>
                  </td>
                  <td className={`px-5 py-3.5 text-xs ${muted} ${isRtl ? "text-left" : "text-right"}`}>
                    {relativeAge(reg.created_at, locale)}
                  </td>
                  <td className={`px-5 py-3.5 ${isRtl ? "text-right" : "text-left"}`}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onGeneratePdf?.(reg.id);
                      }}
                      className={`rounded-lg p-2 transition-colors ${
                        isDark ? "text-blue-300 hover:bg-slate-800/70" : "text-blue-700 hover:bg-blue-50"
                      }`}
                      aria-label={locale === "ar" ? "توليد PDF" : "Generate PDF"}
                    >
                      <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
