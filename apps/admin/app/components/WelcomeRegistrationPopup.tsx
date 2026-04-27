"use client";

import { useEffect, useState } from "react";
import { Gift, Sparkles, X } from "lucide-react";

export default function WelcomeRegistrationPopup() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 220);
  };

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-start justify-center bg-slate-950/55 p-4 pt-20 backdrop-blur-sm transition-opacity duration-200 ${
        closing ? "opacity-0" : "opacity-100"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-registration-title"
      dir="rtl"
    >
      <div
        className={`relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-blue-950 via-blue-700 to-indigo-700 p-6 text-white shadow-2xl transition-transform duration-200 ${
          closing ? "scale-95" : "scale-100"
        }`}
      >
        <button
          type="button"
          onClick={closePopup}
          className="absolute left-3 top-3 rounded-full bg-white/15 p-1.5 text-white/85 transition-colors hover:bg-white/25"
          aria-label="إغلاق"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-400/15 px-3 py-1 text-xs font-bold text-amber-200">
          <Sparkles className="h-3.5 w-3.5" />
          عرض خاص
        </div>

        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-white shadow-lg shadow-amber-400/40">
          <Gift className="h-7 w-7" />
        </div>

        <h2 id="welcome-registration-title" className="text-2xl font-black leading-tight">
          إحجز استشارتك المجانية
        </h2>
        <p className="mt-2 text-base text-blue-100/95">
          هادي تاع التسجيل: فريقنا يجاوبك ويعاونك بخطة واضحة للاستيراد بدون أي تكلفة.
        </p>

        <div className="mt-5 flex items-center gap-2 text-sm text-emerald-200">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-300" />
          100% مجانية
          <span className="mx-1 h-1 w-1 rounded-full bg-white/40" />
          في دقائق
        </div>

        <button
          type="button"
          onClick={closePopup}
          className="mt-6 w-full rounded-xl bg-white/95 px-4 py-3 text-sm font-extrabold text-blue-800 transition-colors hover:bg-white"
        >
          فهمت
        </button>
      </div>
    </div>
  );
}
