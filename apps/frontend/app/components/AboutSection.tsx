'use client';

import { Play } from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';

export function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="relative z-10 py-20 lg:py-28 px-4 bg-white dark:bg-slate-950">
      <div className="max-w-4xl mx-auto text-center">
        {/* Title with underline */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">
          {t('about.title')}
        </h2>
        <span className="section-title-underline" />

        {/* Description */}
        <p className="mt-8 text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
          {t('about.desc1')}
        </p>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
          {t('about.desc2')}
        </p>

        {/* Video placeholder - flexible for future video */}
        <div className="mt-12 relative max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
          <div className="aspect-video bg-gradient-to-br from-[#0c1f3f] via-[#132d5e] to-[#1a3a6e] flex items-center justify-center relative">
            {/* Decorative overlay */}
            <div className="absolute inset-0 bg-[url('/pat-whelen-xSsWBa4rb6E-unsplash.jpg')] bg-cover bg-center opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c1f3f] via-[#0c1f3f]/60 to-transparent" />

            {/* Play button */}
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                <Play className="w-8 h-8 text-white ms-1" fill="white" />
              </div>
              <span className="text-white/80 font-semibold text-lg">
                {t('about.videoBtn')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
