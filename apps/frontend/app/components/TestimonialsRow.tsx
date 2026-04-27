'use client';

import { Star } from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';

const items = [
  { nameKey: 'testimonials.name1', bizKey: 'testimonials.business1', textKey: 'testimonials.text1', initials: 'MA', color: 'bg-blue-600' },
  { nameKey: 'testimonials.name2', bizKey: 'testimonials.business2', textKey: 'testimonials.text2', initials: 'FB', color: 'bg-cyan-600' },
  { nameKey: 'testimonials.name3', bizKey: 'testimonials.business3', textKey: 'testimonials.text3', initials: 'KB', color: 'bg-indigo-600' },
];

export function TestimonialsRow() {
  const { t, dir } = useLanguage();
  return (
    <section
      id="testimonials"
      dir={dir}
      className="relative z-10 py-20 px-4 bg-slate-50 dark:bg-slate-900"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
            <Star className="h-3.5 w-3.5 fill-current" />
            {t('testimonials.badge')}
          </span>
          <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">
            {t('testimonials.title')}
          </h2>
          <span className="section-title-underline" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((tt) => (
            <figure
              key={tt.nameKey}
              className="group relative flex h-full flex-col card-accent-left rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-slate-700/60 dark:bg-slate-800"
            >
              <div className="mb-3 flex items-center gap-0.5 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="relative z-10 flex-1 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                &ldquo;{t(tt.textKey)}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${tt.color} text-sm font-extrabold text-white shadow`}
                >
                  {tt.initials}
                </span>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{t(tt.nameKey)}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{t(tt.bizKey)}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
