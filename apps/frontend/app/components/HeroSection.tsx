'use client';

import Link from 'next/link';
import { ChevronDown, ClipboardList } from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';
import { HeroFlowVisual } from './HeroFlowVisual';

export function HeroSection({ whatsappLink }: { whatsappLink: string }) {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[90vh] flex items-center bg-[#fafbff] dark:bg-slate-950 overflow-hidden pt-20 pb-16 transition-colors">
      {/* Soft ambient blurs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-indigo-100/30 dark:bg-indigo-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: Animated Flow Visual */}
          <div className="order-2 lg:order-1 flex items-center justify-center animate-fade-in-up delay-300">
            <HeroFlowVisual />
          </div>

          {/* Right: Text Content */}
          <div className="order-1 lg:order-2 text-center lg:text-start flex flex-col items-center lg:items-start animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50/80 dark:bg-blue-900/20 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-bold tracking-wide text-blue-700 dark:text-blue-300 uppercase">
                {t('hero.badge')}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.15] text-slate-900 dark:text-white mb-6 tracking-tight">
              <span className="block">{t('hero.title1')}</span>
              <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600">
                {t('hero.titleHighlight')}
              </span>
              <span className="block mt-1">{t('hero.title2')}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Link
                href="/booking"
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-[1.02] transition-all duration-300"
              >
                <ClipboardList className="w-4 h-4" />
                {t('hero.ctaPrimary')}
              </Link>
              <a
                href="#services"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
              >
                {t('hero.ctaSecondary')}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-float">
        <ChevronDown className="w-7 h-7 text-slate-300 dark:text-slate-600" />
      </div>
    </section>
  );
}
