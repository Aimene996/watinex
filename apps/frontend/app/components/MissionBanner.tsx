'use client';

import { Shield } from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';

export function MissionBanner() {
  const { t } = useLanguage();

  return (
    <section className="relative z-10 my-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-br from-[#0c1f3f] via-[#132d5e] to-[#1a3a6e] rounded-2xl p-10 lg:p-14 text-center text-white shadow-xl">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-400/40 flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-blue-300" />
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            {t('mission.title')}
          </h2>

          {/* Description */}
          <p className="text-blue-100/80 text-lg leading-relaxed max-w-2xl mx-auto">
            {t('mission.desc')}
          </p>
        </div>
      </div>
    </section>
  );
}
