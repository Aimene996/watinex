"use client";

import {
  type Registration,
  type RegistrationStatus,
  statusLabel,
  statusColor,
  serviceLabel,
  nicheLabel,
  relativeAge,
} from "../lib";

interface RegistrationTableProps {
  registrations: Registration[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  themeMode: "dark" | "light";
  text: {
    recentSubmissions: string;
    showing: string;
    of: string;
    noData: string;
  };
}

export default function RegistrationTable({
  registrations,
  selectedId,
  onSelect,
  themeMode,
  text,
}: RegistrationTableProps) {
  const isDark = themeMode === "dark";
  const cardBg = isDark ? "bg-slate-900/50 border-slate-800/50" : "bg-white border-slate-200";
  const headerBg = isDark ? "bg-slate-800/30" : "bg-slate-50";
  const headerText = isDark ? "text-slate-400" : "text-slate-500";
  const rowBorder = isDark ? "border-slate-800/30" : "border-slate-100";
  const rowHover = isDark ? "hover:bg-slate-800/30" : "hover:bg-blue-50/50";
  const rowSelected = isDark ? "bg-blue-500/8 border-l-blue-500" : "bg-blue-50 border-l-blue-500";
  const muted = isDark ? "text-slate-500" : "text-slate-400";

  if (registrations.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center rounded-2xl border px-6 py-16 ${cardBg}`}>
        <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${isDark ? "bg-slate-800/60" : "bg-slate-100"}`}>
          <span className={`material-symbols-outlined text-3xl ${muted}`}>inbox</span>
        </div>
        <p className={`text-sm font-medium ${muted}`}>{text.noData}</p>
        <p className={`mt-1 text-xs ${muted}`}>Try adjusting your filters or search query</p>
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
        <table className="w-full text-left text-sm">
          <thead>
            <tr className={`border-b ${rowBorder} ${headerBg}`}>
              <th className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-wider ${headerText}`}>Name</th>
              <th className={`hidden px-5 py-3 text-[11px] font-semibold uppercase tracking-wider md:table-cell ${headerText}`}>Email</th>
              <th className={`hidden px-5 py-3 text-[11px] font-semibold uppercase tracking-wider lg:table-cell ${headerText}`}>Phone</th>
              <th className={`hidden px-5 py-3 text-[11px] font-semibold uppercase tracking-wider sm:table-cell ${headerText}`}>Service</th>
              <th className={`hidden px-5 py-3 text-[11px] font-semibold uppercase tracking-wider xl:table-cell ${headerText}`}>Niche</th>
              <th className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-wider ${headerText}`}>Status</th>
              <th className={`px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider ${headerText}`}>Date</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg, idx) => {
              const isSelected = reg.id === selectedId;
              return (
                <tr
                  key={reg.id}
                  onClick={() => onSelect(reg.id)}
                  className={`cursor-pointer border-b border-l-2 transition-all duration-150 ${rowBorder} ${
                    isSelected
                      ? rowSelected
                      : `border-l-transparent ${rowHover}`
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
                      {serviceLabel(reg.service_type)}
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
                          {nicheLabel(n)}
                        </span>
                      ))}
                      {reg.niche.length > 2 && (
                        <span className={`text-[10px] ${muted}`}>+{reg.niche.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusColor(reg.status)}`}>
                      <span className={`inline-block h-1.5 w-1.5 rounded-full ${
                        reg.status === "NEW" ? "bg-blue-400" :
                        reg.status === "CONTACTED" ? "bg-amber-400" :
                        reg.status === "CONFIRMED" ? "bg-emerald-400" :
                        "bg-red-400"
                      }`} />
                      {statusLabel(reg.status)}
                    </span>
                  </td>
                  <td className={`px-5 py-3.5 text-right text-xs ${muted}`}>
                    {relativeAge(reg.created_at)}
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
