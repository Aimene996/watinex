'use client';

import { Ship, Plane, Search } from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';

export function ExpertiseCards() {
  const { t } = useLanguage();

  const cards = [
    { icon: Ship, titleKey: 'expertise.chinaTitle', descKey: 'expertise.chinaDesc', color: 'bg-blue-600' },
    { icon: Plane, titleKey: 'expertise.dubaiTitle', descKey: 'expertise.dubaiDesc', color: 'bg-cyan-600' },
    { icon: Search, titleKey: 'expertise.sourcingTitle', descKey: 'expertise.sourcingDesc', color: 'bg-indigo-600' },
  ];

  return (
    <section className="relative z-10 py-6 px-4 bg-white dark:bg-slate-950">
      <div className="max-w-4xl mx-auto space-y-5">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="group card-accent-left bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-700/60 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className={`${card.color} p-3 rounded-xl text-white flex-shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {t(card.titleKey)}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {t(card.descKey)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
