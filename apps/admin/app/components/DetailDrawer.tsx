"use client";

import { useEffect, useState } from "react";
import {
  type Registration,
  type RegistrationStatus,
  statusLabel,
  statusColor,
  serviceLabel,
  nicheLabel,
  formatDate,
} from "../lib";

interface DetailDrawerProps {
  registration: Registration | null;
  onClose: () => void;
  onStatusChange: (id: string, status: RegistrationStatus) => void;
  onSaveNotes: (id: string, notes: string) => void;
  saving: boolean;
  themeMode: "dark" | "light";
  text: {
    detailsTitle: string;
    notes: string;
    saveNotes: string;
  };
}

export default function DetailDrawer({
  registration,
  onClose,
  onStatusChange,
  onSaveNotes,
  saving,
  themeMode,
  text,
}: DetailDrawerProps) {
  const [notes, setNotes] = useState("");
  const [closing, setClosing] = useState(false);

  const isDark = themeMode === "dark";
  const bg = isDark ? "bg-[#0d1424]" : "bg-white";
  const border = isDark ? "border-slate-800/60" : "border-slate-200";
  const sectionBg = isDark ? "bg-slate-900/40" : "bg-slate-50";
  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const subtle = isDark ? "text-slate-500" : "text-slate-400";
  const inputBg = isDark
    ? "bg-slate-900/60 border-slate-700/60 text-slate-100 placeholder:text-slate-600"
    : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400";

  useEffect(() => {
    if (registration) {
      setNotes(registration.admin_notes ?? "");
      setClosing(false);
    }
  }, [registration]);

  // Escape key to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (registration) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [registration]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
    }, 250);
  };

  if (!registration) return null;

  const reg = registration;

  const statusActions: { status: RegistrationStatus; label: string; color: string; border: string }[] = [
    { status: "CONTACTED", label: "Mark Contacted", color: "text-amber-400", border: "border-amber-500/40 hover:bg-amber-500/10" },
    { status: "CONFIRMED", label: "Confirm", color: "text-emerald-400", border: "border-emerald-500/40 hover:bg-emerald-500/10" },
    { status: "REJECTED", label: "Reject", color: "text-red-400", border: "border-red-500/40 hover:bg-red-500/10" },
    { status: "NEW", label: "Reset to New", color: "text-blue-400", border: "border-blue-500/40 hover:bg-blue-500/10" },
  ];

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm ${closing ? "animate-overlay-out" : "animate-overlay-in"}`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`absolute inset-y-0 right-0 flex w-full max-w-[520px] flex-col border-l shadow-2xl ${bg} ${border} ${
          closing ? "animate-drawer-out" : "animate-drawer-in"
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between border-b px-6 py-4 ${border}`}>
          <div>
            <h2 className="text-base font-bold">{text.detailsTitle}</h2>
            <p className={`text-xs ${subtle}`}>ID: {reg.id.slice(0, 8)}…</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Name + Date */}
          <div>
            <h3 className="text-xl font-bold">{reg.full_name}</h3>
            <p className={`mt-1 text-xs ${subtle}`}>{formatDate(reg.created_at)}</p>
          </div>

          {/* Status */}
          <div>
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${statusColor(reg.status)}`}>
              <span className={`inline-block h-2 w-2 rounded-full ${
                reg.status === "NEW" ? "bg-blue-400" :
                reg.status === "CONTACTED" ? "bg-amber-400" :
                reg.status === "CONFIRMED" ? "bg-emerald-400" :
                "bg-red-400"
              }`} />
              {statusLabel(reg.status)}
            </span>
          </div>

          {/* Contact Info */}
          <div className={`rounded-xl border p-4 ${border} ${sectionBg}`}>
            <p className={`mb-3 text-[10px] font-semibold uppercase tracking-widest ${subtle}`}>Contact Information</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isDark ? "bg-slate-800/60" : "bg-slate-200/60"}`}>
                  <span className={`material-symbols-outlined text-base ${muted}`}>mail</span>
                </div>
                <div>
                  <p className={`text-[10px] ${subtle}`}>Email</p>
                  <p className="text-sm font-medium">{reg.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isDark ? "bg-slate-800/60" : "bg-slate-200/60"}`}>
                  <span className={`material-symbols-outlined text-base ${muted}`}>phone</span>
                </div>
                <div>
                  <p className={`text-[10px] ${subtle}`}>Phone</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{reg.phone}</p>
                    <a
                      href={`https://wa.me/${reg.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400 transition-colors hover:bg-emerald-500/25"
                    >
                      WhatsApp ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service / Niche */}
          <div className={`rounded-xl border p-4 ${border} ${sectionBg}`}>
            <p className={`mb-3 text-[10px] font-semibold uppercase tracking-widest ${subtle}`}>Service Details</p>
            <div className="space-y-3">
              <div>
                <p className={`text-[10px] ${subtle}`}>Service Type</p>
                <p className="mt-0.5 text-sm font-medium">{serviceLabel(reg.service_type)}</p>
              </div>
              <div>
                <p className={`text-[10px] ${subtle}`}>Niche</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {reg.niche.map((n) => (
                    <span
                      key={n}
                      className={`rounded-lg border px-2.5 py-1 text-xs font-medium ${border} ${isDark ? "bg-slate-800/40" : "bg-white"}`}
                    >
                      {nicheLabel(n)}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className={`text-[10px] ${subtle}`}>Previously Imported</p>
                <p className="mt-0.5 text-sm font-medium">{reg.imported_before ? "Yes ✓" : "No"}</p>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          <div>
            <p className={`mb-2 text-[10px] font-semibold uppercase tracking-widest ${subtle}`}>{text.notes}</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 ${inputBg}`}
              placeholder="Add internal notes about this lead..."
            />
            <button
              type="button"
              onClick={() => onSaveNotes(reg.id, notes)}
              disabled={saving || notes === (reg.admin_notes ?? "")}
              className={`mt-2 flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-medium transition-colors disabled:opacity-40 ${border} ${isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-100"}`}
            >
              <span className="material-symbols-outlined text-sm">save</span>
              {saving ? "Saving…" : text.saveNotes}
            </button>
          </div>
        </div>

        {/* Footer: Status Actions */}
        <div className={`border-t px-6 py-4 ${border}`}>
          <p className={`mb-3 text-[10px] font-semibold uppercase tracking-widest ${subtle}`}>Change Status</p>
          <div className="flex flex-wrap gap-2">
            {statusActions
              .filter((a) => a.status !== reg.status)
              .map((action) => (
                <button
                  key={action.status}
                  type="button"
                  onClick={() => onStatusChange(reg.id, action.status)}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${action.color} ${action.border}`}
                >
                  {action.label}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
