'use client';

import Image from 'next/image';
import { Ship, Plane, Search, PackageCheck, Truck, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';
import watinexLogo from '../logo vertical.png';

export function HeroFlowVisual() {
  const { t } = useLanguage();

  return (
    <div className="relative w-full max-w-[520px] mx-auto aspect-square select-none">
      {/* SVG Connecting Lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 500 500"
        fill="none"
      >
        <path d="M120 120 Q 200 180 250 250" stroke="url(#grad1)" strokeWidth="2" strokeDasharray="6 4" className="animate-dash" />
        <path d="M380 120 Q 310 180 250 250" stroke="url(#grad2)" strokeWidth="2" strokeDasharray="6 4" className="animate-dash" />
        <path d="M250 250 Q 170 310 100 370" stroke="url(#grad3)" strokeWidth="2" strokeDasharray="6 4" className="animate-dash" />
        <path d="M250 250 Q 330 310 400 370" stroke="url(#grad4)" strokeWidth="2" strokeDasharray="6 4" className="animate-dash" />
        <path d="M60 240 Q 150 245 250 250" stroke="url(#grad5)" strokeWidth="2" strokeDasharray="6 4" className="animate-dash" />
        <path d="M250 250 Q 370 250 440 240" stroke="url(#grad6)" strokeWidth="2" strokeDasharray="6 4" className="animate-dash" />
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" /><stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" /></linearGradient>
          <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" /><stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" /></linearGradient>
          <linearGradient id="grad3" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#10b981" stopOpacity="0.8" /><stop offset="100%" stopColor="#10b981" stopOpacity="0.3" /></linearGradient>
          <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" /><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" /></linearGradient>
          <linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" /><stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" /></linearGradient>
          <linearGradient id="grad6" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" /><stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" /></linearGradient>
        </defs>
      </svg>

      {/* Central Hub — Logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-xl shadow-blue-600/20 border border-slate-200 dark:border-slate-700 flex items-center justify-center animate-float overflow-hidden p-1.5">
          <Image
            src={watinexLogo}
            alt="Watinex"
            className="w-full h-full object-contain"
            sizes="64px"
          />
        </div>
      </div>

      {/* Card: China (top-left) */}
      <div className="absolute top-[8%] left-[5%] z-10 animate-float" style={{ animationDelay: '0s' }}>
        <div className="flex items-center gap-2.5 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 shadow-lg shadow-slate-200/60 dark:shadow-slate-900/60 border border-slate-100 dark:border-slate-700 min-w-[150px]">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
            <Ship className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-white leading-none">{t('expertise.chinaTitle')}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">🇨🇳</p>
          </div>
        </div>
      </div>

      {/* Card: Dubai (top-right) */}
      <div className="absolute top-[8%] right-[5%] z-10 animate-float" style={{ animationDelay: '0.5s' }}>
        <div className="flex items-center gap-2.5 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 shadow-lg shadow-slate-200/60 dark:shadow-slate-900/60 border border-slate-100 dark:border-slate-700 min-w-[150px]">
          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
            <Plane className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-white leading-none">{t('expertise.dubaiTitle')}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">🇦🇪 48h</p>
          </div>
        </div>
      </div>

      {/* Card: Sourcing (middle-left) */}
      <div className="absolute top-[42%] left-[-2%] z-10 animate-float" style={{ animationDelay: '1s' }}>
        <div className="flex items-center gap-2.5 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 shadow-lg shadow-slate-200/60 dark:shadow-slate-900/60 border border-slate-100 dark:border-slate-700 min-w-[140px]">
          <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center shrink-0">
            <Search className="w-4 h-4 text-pink-600 dark:text-pink-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-white leading-none">{t('expertise.sourcingTitle')}</p>
          </div>
        </div>
      </div>

      {/* Card: Delivery (middle-right) */}
      <div className="absolute top-[42%] right-[-2%] z-10 animate-float" style={{ animationDelay: '1.5s' }}>
        <div className="flex items-center gap-2.5 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 shadow-lg shadow-slate-200/60 dark:shadow-slate-900/60 border border-slate-100 dark:border-slate-700 min-w-[140px]">
          <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-white leading-none">{t('processSteps.step4')}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">🇩🇿</p>
          </div>
        </div>
      </div>

      {/* Card: Quality Check (bottom-left) */}
      <div className="absolute bottom-[10%] left-[2%] z-10 animate-float" style={{ animationDelay: '2s' }}>
        <div className="flex items-center gap-2.5 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 shadow-lg shadow-slate-200/60 dark:shadow-slate-900/60 border border-slate-100 dark:border-slate-700 min-w-[150px]">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-white leading-none">{t('whyUs.item3')}</p>
            <p className="text-[10px] text-emerald-500 dark:text-emerald-400 mt-0.5 font-semibold">✓</p>
          </div>
        </div>
      </div>

      {/* Card: Order Confirmed (bottom-right) */}
      <div className="absolute bottom-[10%] right-[2%] z-10 animate-float" style={{ animationDelay: '2.5s' }}>
        <div className="flex items-center gap-2.5 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 shadow-lg shadow-slate-200/60 dark:shadow-slate-900/60 border border-slate-100 dark:border-slate-700 min-w-[150px]">
          <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center shrink-0">
            <PackageCheck className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-white leading-none">{t('whyUs.item6')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
