'use client';

import { MessageCircle, ClipboardList, Settings, PackageCheck } from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';

export function ProcessSteps() {
  const { t } = useLanguage();

  const steps = [
    { num: 1, key: 'processSteps.step1', icon: MessageCircle, color: 'from-blue-500 to-blue-600', glow: 'shadow-blue-500/20', ring: 'ring-blue-100 dark:ring-blue-900/30' },
    { num: 2, key: 'processSteps.step2', icon: ClipboardList, color: 'from-indigo-500 to-indigo-600', glow: 'shadow-indigo-500/20', ring: 'ring-indigo-100 dark:ring-indigo-900/30' },
    { num: 3, key: 'processSteps.step3', icon: Settings, color: 'from-cyan-500 to-cyan-600', glow: 'shadow-cyan-500/20', ring: 'ring-cyan-100 dark:ring-cyan-900/30' },
    { num: 4, key: 'processSteps.step4', icon: PackageCheck, color: 'from-emerald-500 to-emerald-600', glow: 'shadow-emerald-500/20', ring: 'ring-emerald-100 dark:ring-emerald-900/30' },
  ];

  return (
    <section id="process" className="relative z-10 py-20 lg:py-28 px-4 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white">
            {t('processSteps.title')}
          </h2>
          <span className="section-title-underline" />
        </div>

        {/* Steps row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative flex flex-col items-center group">
                {/* Connecting line (between steps, desktop only) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[calc(100%-20%)] h-[2px]">
                    <div className="w-full h-full bg-gradient-to-r from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-full" />
                    <div
                      className="absolute inset-0 h-full bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-500 dark:to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    />
                  </div>
                )}

                {/* Circle */}
                <div
                  className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl ${step.glow} ring-4 ${step.ring} transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl animate-float`}
                  style={{ animationDelay: `${i * 300}ms`, animationDuration: '5s' }}
                >
                  <Icon className="w-8 h-8 text-white drop-shadow-sm" strokeWidth={2} />
                  {/* Step number badge */}
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 flex items-center justify-center text-xs font-extrabold text-slate-800 dark:text-white shadow-md">
                    {step.num}
                  </span>
                </div>

                {/* Label */}
                <span className="mt-5 text-sm lg:text-base font-bold text-slate-800 dark:text-slate-100 text-center">
                  {t(step.key)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
