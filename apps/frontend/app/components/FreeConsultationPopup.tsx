'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, Gift, ArrowLeft, X, Phone } from 'lucide-react';

export function FreeConsultationPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsOpen(true), 3200);
    return () => window.clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setIsClosing(true);
    window.setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 320);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-center justify-center p-4 transition-all duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="free-consultation-title"
    >
      <button
        type="button"
        aria-label="إغلاق"
        onClick={dismiss}
        className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm"
      />

      <div
        className={`consultation-popup relative w-full max-w-md overflow-hidden rounded-3xl shadow-[0_30px_80px_-20px_rgba(2,132,199,0.55)] transition-all duration-500 ${
          isClosing ? 'scale-90 opacity-0' : 'consultation-popup-enter'
        }`}
        dir="rtl"
      >
        <div className="consultation-popup-bg absolute inset-0" />
        <div className="consultation-popup-shimmer absolute inset-0 pointer-events-none" />

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <span className="consultation-particle consultation-particle-1" />
          <span className="consultation-particle consultation-particle-2" />
          <span className="consultation-particle consultation-particle-3" />
          <span className="consultation-particle consultation-particle-4" />
          <span className="consultation-particle consultation-particle-5" />
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="إغلاق التنبيه"
          className="absolute top-3 left-3 z-20 rounded-full bg-white/15 p-1.5 text-white/80 backdrop-blur-md transition-all hover:bg-white/25 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative z-10 px-6 pb-6 pt-8 text-center text-white sm:px-8">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center">
            <div className="consultation-gift-glow absolute h-20 w-20 rounded-full" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-orange-500 shadow-[0_10px_30px_-10px_rgba(245,158,11,0.85)]">
              <Gift className="h-8 w-8 text-white drop-shadow" strokeWidth={2.5} />
            </div>
          </div>

          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-amber-400/15 px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-300 financing-sparkle" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-amber-200">
              عرض حصري
            </span>
            <Sparkles className="h-3.5 w-3.5 text-amber-300 financing-sparkle delay-200" />
          </div>

          <h2
            id="free-consultation-title"
            className="text-2xl font-black leading-snug sm:text-3xl"
          >
            <span className="consultation-text-shine">احجز استشارتك</span>
            <span className="block text-amber-300 drop-shadow-[0_2px_8px_rgba(251,191,36,0.45)]">
              مـجـانـيـة 100%
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-blue-100/90 sm:text-base">
            خوذ موعد مع خبير الاستيراد متاعنا — نشرحوا لك كل شي وندخّلوك على طريق
            <span className="font-extrabold text-white"> النجاح</span> مع واتينكس.
          </p>

          <div className="mt-5 flex items-center justify-center gap-3 text-[11px] font-semibold text-blue-100/80">
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
              بدون التزام
            </span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span className="inline-flex items-center gap-1">
              <Phone className="h-3 w-3" />
              مكالمة مباشرة
            </span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span>دقائق فقط</span>
          </div>

          <Link
            href="/booking"
            onClick={dismiss}
            className="consultation-cta group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-extrabold text-white transition-all"
          >
            احجز الآن وكمل التسجيل
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          </Link>

          <button
            type="button"
            onClick={dismiss}
            className="mt-3 text-xs font-semibold text-white/60 transition-colors hover:text-white/90"
          >
            نشوف بعدين
          </button>
        </div>
      </div>
    </div>
  );
}
