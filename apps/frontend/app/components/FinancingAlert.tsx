'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Percent, TrendingUp, X } from 'lucide-react';

export function FinancingAlert() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const alertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger entrance animation after mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      const timer = setTimeout(() => setHasAnimated(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [isVisible, hasAnimated]);

  if (isDismissed) return null;

  return (
    <section
      ref={alertRef}
      className={`relative overflow-hidden transition-all duration-700 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 max-h-[500px]'
          : 'opacity-0 -translate-y-8 max-h-0'
      }`}
    >
      {/* Main Banner */}
      <div className="financing-alert-bg relative py-8 md:py-10 lg:py-12">
        {/* Animated Shimmer Overlay */}
        <div className="financing-shimmer absolute inset-0 pointer-events-none" />

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="financing-particle financing-particle-1" />
          <div className="financing-particle financing-particle-2" />
          <div className="financing-particle financing-particle-3" />
          <div className="financing-particle financing-particle-4" />
          <div className="financing-particle financing-particle-5" />
          <div className="financing-particle financing-particle-6" />
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-3 right-3 md:top-4 md:right-4 z-20 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200 backdrop-blur-sm"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10">

            {/* Left: Animated Badge */}
            <div className={`flex-shrink-0 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}>
              <div className="financing-percentage-badge relative">
                {/* Glow ring */}
                <div className="financing-glow-ring absolute inset-0 rounded-full" />
                {/* Inner circle */}
                <div className="relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-white/15 backdrop-blur-md border-2 border-white/30 flex flex-col items-center justify-center shadow-2xl">
                  <span className="text-3xl md:text-4xl lg:text-5xl font-black text-white financing-number-glow">
                    75
                  </span>
                  <Percent className="absolute top-2 right-2 md:top-3 md:right-3 w-5 h-5 md:w-6 md:h-6 text-amber-300" />
                  <span className="text-[10px] md:text-xs font-bold text-amber-200 uppercase tracking-wider mt-[-2px]">
                    تمويل
                  </span>
                </div>
              </div>
            </div>

            {/* Center: Text */}
            <div className={`text-center lg:text-start transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
              {/* Sparkle badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 financing-sparkle" />
                <span className="text-xs font-bold text-amber-200 uppercase tracking-wide">
                  عرض حصري
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 financing-sparkle delay-200" />
              </div>

              {/* Main heading */}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-2 leading-tight">
                <span className="financing-text-gradient">75% تاع التمويل</span>
                <span className="block text-xl md:text-2xl lg:text-3xl font-extrabold text-white/90 mt-1">
                  علينا 🎉
                </span>
              </h2>

              {/* Subtitle */}
              <p className="text-sm md:text-base text-blue-100/80 max-w-md mx-auto lg:mx-0 leading-relaxed">
                استفد من تمويل يصل إلى <strong className="text-amber-300 font-extrabold">75%</strong> من قيمة الطلبية — نحن ندعمك في كل خطوة!
              </p>

              {/* Trust indicators */}
              <div className="flex items-center justify-center lg:justify-start gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-emerald-300 font-semibold">+500 عميل مستفيد</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/30" />
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-blue-200 font-semibold">⚡ عرض لمدة محدودة</span>
                </div>
              </div>
            </div>

            {/* Right: CTA */}
            <div className={`flex-shrink-0 transition-all duration-700 delay-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}>
              <Link
                href="/booking"
                className="group financing-cta-btn inline-flex items-center gap-2 px-7 py-4 rounded-xl text-sm md:text-base font-extrabold transition-all duration-300"
              >
                سجّل الآن
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
              </Link>
            </div>

          </div>
        </div>

        {/* Bottom decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path
              d="M0 40V20C240 0 480 0 720 20C960 40 1200 40 1440 20V40H0Z"
              className="fill-[#f8fafc] dark:fill-slate-950"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
