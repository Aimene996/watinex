'use client';

import { CircleCheckBig } from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';

export function WhyChooseUs() {
  const { t } = useLanguage();

  const items = [
    'whyUs.item1', 'whyUs.item2', 'whyUs.item3',
    'whyUs.item4', 'whyUs.item5', 'whyUs.item6',
  ];

  return (
    <section id="why-us" className="relative z-10 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-[#0c1f3f] via-[#132d5e] to-[#1e40af] rounded-2xl p-8 lg:p-12 shadow-xl overflow-hidden relative">
          {/* Decorative glow */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            {/* Title */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
              {t('whyUs.title')}
            </h2>
            <p className="text-blue-200/70 text-lg mb-8">
              {t('whyUs.subtitle')}
            </p>

            {/* Checklist */}
            <div className="space-y-4">
              {items.map((key, i) => (
                <div key={i} className="check-item">
                  <span className="check-icon">
                    <CircleCheckBig className="w-4 h-4 text-blue-300" />
                  </span>
                  <span className="text-white/90 text-base lg:text-lg">{t(key)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
