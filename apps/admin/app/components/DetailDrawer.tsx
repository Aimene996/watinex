"use client";

import { useCallback, useEffect, useState } from "react";
import {
  type Registration,
  type RegistrationImage,
  type RegistrationStatus,
  statusLabel,
  statusColor,
  serviceLabel,
  nicheLabel,
  formatDate,
  type Locale,
} from "../lib";

interface DetailDrawerProps {
  registration: Registration | null;
  images: RegistrationImage[];
  imageBusy: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: RegistrationStatus) => void;
  onSaveNotes: (id: string, notes: string) => void;
  onUploadImage: (registrationId: string, file: File) => Promise<void>;
  onGeneratePdf: (registration: Registration, notes: string, images: RegistrationImage[]) => Promise<void>;
  saving: boolean;
  themeMode: "dark" | "light";
  text: {
    detailsTitle: string;
    notes: string;
    saveNotes: string;
  };
  locale: Locale;
}

export default function DetailDrawer({
  registration,
  images,
  imageBusy,
  onClose,
  onStatusChange,
  onSaveNotes,
  onUploadImage,
  onGeneratePdf,
  saving,
  themeMode,
  text,
  locale,
}: DetailDrawerProps) {
  const [notes, setNotes] = useState("");
  const [closing, setClosing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const isDark = themeMode === "dark";
  const bg = isDark ? "bg-[#0d1424]" : "bg-white";
  const border = isDark ? "border-slate-800/60" : "border-slate-200";
  const sectionBg = isDark ? "bg-slate-900/40" : "bg-slate-50";
  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const subtle = isDark ? "text-slate-500" : "text-slate-400";
  const isRtl = locale === "ar";
  const inputBg = isDark
    ? "bg-slate-900/60 border-slate-700/60 text-slate-100 placeholder:text-slate-600"
    : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400";

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
    }, 250);
  }, [onClose]);

  useEffect(() => {
    if (!registration) return;
    setNotes(registration.admin_notes ?? "");
    setClosing(false);
    setUploadError(null);
  }, [registration]);

  // Escape key to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (registration) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [registration, handleClose]);

  if (!registration) return null;

  const reg = registration;
  const selectedImages = images.filter((image) => image.registration_id === reg.id);

  const statusActions: { status: RegistrationStatus; label: string; color: string; border: string }[] = [
    { status: "CONTACTED", label: locale === "ar" ? "تم التواصل" : "Marquer contacté", color: "text-amber-400", border: "border-amber-500/40 hover:bg-amber-500/10" },
    { status: "CONFIRMED", label: locale === "ar" ? "تأكيد" : "Confirmer", color: "text-emerald-400", border: "border-emerald-500/40 hover:bg-emerald-500/10" },
    { status: "REJECTED", label: locale === "ar" ? "رفض" : "Rejeter", color: "text-red-400", border: "border-red-500/40 hover:bg-red-500/10" },
    { status: "NEW", label: locale === "ar" ? "إرجاع كجديد" : "Réinitialiser", color: "text-blue-400", border: "border-blue-500/40 hover:bg-blue-500/10" },
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
        className={`absolute inset-y-0 flex w-full max-w-[520px] flex-col shadow-2xl ${bg} ${border} ${
          isRtl ? "left-0 border-r" : "right-0 border-l"
        } ${
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
            <p className={`mt-1 text-xs ${subtle}`}>{formatDate(reg.created_at, locale)}</p>
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
              {statusLabel(reg.status, locale)}
            </span>
          </div>

          {/* Contact Info */}
          <div className={`rounded-xl border p-4 ${border} ${sectionBg}`}>
            <p className={`mb-3 text-[10px] font-semibold uppercase tracking-widest ${subtle}`}>{locale === "ar" ? "معلومات التواصل" : "Informations de contact"}</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isDark ? "bg-slate-800/60" : "bg-slate-200/60"}`}>
                  <span className={`material-symbols-outlined text-base ${muted}`}>mail</span>
                </div>
                <div>
                  <p className={`text-[10px] ${subtle}`}>{locale === "ar" ? "البريد" : "Email"}</p>
                  <p className="text-sm font-medium">{reg.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isDark ? "bg-slate-800/60" : "bg-slate-200/60"}`}>
                  <span className={`material-symbols-outlined text-base ${muted}`}>phone</span>
                </div>
                <div>
                  <p className={`text-[10px] ${subtle}`}>{locale === "ar" ? "الهاتف" : "Téléphone"}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{reg.phone}</p>
                    <a
                      href={`https://wa.me/${reg.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400 transition-colors hover:bg-emerald-500/25"
                    >
                      {locale === "ar" ? "واتساب ↗" : "WhatsApp ↗"}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service / Niche */}
          <div className={`rounded-xl border p-4 ${border} ${sectionBg}`}>
            <p className={`mb-3 text-[10px] font-semibold uppercase tracking-widest ${subtle}`}>{locale === "ar" ? "تفاصيل الخدمة" : "Détails du service"}</p>
            <div className="space-y-3">
              <div>
                <p className={`text-[10px] ${subtle}`}>{locale === "ar" ? "نوع الخدمة" : "Type de service"}</p>
                <p className="mt-0.5 text-sm font-medium">{serviceLabel(reg.service_type, locale)}</p>
              </div>
              <div>
                <p className={`text-[10px] ${subtle}`}>{locale === "ar" ? "المجال" : "Niche"}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {reg.niche.map((n) => (
                    <span
                      key={n}
                      className={`rounded-lg border px-2.5 py-1 text-xs font-medium ${border} ${isDark ? "bg-slate-800/40" : "bg-white"}`}
                    >
                      {nicheLabel(n, locale)}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className={`text-[10px] ${subtle}`}>{locale === "ar" ? "تم الاستيراد سابقا" : "Déjà importé"}</p>
                <p className="mt-0.5 text-sm font-medium">{reg.imported_before ? (locale === "ar" ? "نعم ✓" : "Oui ✓") : (locale === "ar" ? "لا" : "Non")}</p>
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
              placeholder={locale === "ar" ? "أضف ملاحظات داخلية حول هذا العميل..." : "Ajouter des notes internes sur ce prospect..."}
            />
            <button
              type="button"
              onClick={() => onSaveNotes(reg.id, notes)}
              disabled={saving || notes === (reg.admin_notes ?? "")}
              className={`mt-2 flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-medium transition-colors disabled:opacity-40 ${border} ${isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-100"}`}
            >
              <span className="material-symbols-outlined text-sm">save</span>
              {saving ? (locale === "ar" ? "جار الحفظ..." : "Enregistrement...") : text.saveNotes}
            </button>
          </div>

          {/* Attachments */}
          <div>
            <p className={`mb-2 text-[10px] font-semibold uppercase tracking-widest ${subtle}`}>
              {locale === "ar" ? "صور إضافية" : "Images"}
            </p>
            <div className={`rounded-xl border p-3 ${border} ${sectionBg}`}>
              <label className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-3 text-xs font-medium transition-colors ${border} ${isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-100"}`}>
                <span className="material-symbols-outlined text-sm">upload</span>
                {imageBusy ? (locale === "ar" ? "جار الرفع..." : "Upload...") : (locale === "ar" ? "إضافة صورة لهذا العميل" : "Add image for this lead")}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      setUploadError(null);
                      await onUploadImage(reg.id, file);
                      e.currentTarget.value = "";
                    } catch (err) {
                      setUploadError(err instanceof Error ? err.message : "Upload failed");
                    }
                  }}
                />
              </label>
              {uploadError && (
                <p className="mt-2 text-xs text-red-400">{uploadError}</p>
              )}
              {selectedImages.length === 0 ? (
                <p className={`mt-3 text-xs ${muted}`}>
                  {locale === "ar" ? "لا توجد صور بعد." : "No images uploaded yet."}
                </p>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {selectedImages.map((image) => (
                    <a
                      key={image.id}
                      href={image.image_data_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group overflow-hidden rounded-lg border border-slate-700/40"
                    >
                      <img
                        src={image.image_data_url}
                        alt="lead attachment"
                        className="h-24 w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer: Status Actions */}
        <div className={`border-t px-6 py-4 ${border}`}>
          <p className={`mb-3 text-[10px] font-semibold uppercase tracking-widest ${subtle}`}>{locale === "ar" ? "تغيير الحالة" : "Changer le statut"}</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onGeneratePdf(reg, notes, selectedImages)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                isDark
                  ? "border-blue-500/40 text-blue-300 hover:bg-blue-500/10"
                  : "border-blue-300 text-blue-700 hover:bg-blue-50"
              }`}
            >
              <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
              {locale === "ar" ? "توليد PDF" : "Generate PDF"}
            </button>
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
