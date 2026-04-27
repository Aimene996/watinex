'use client';

import { useEffect, useRef, useState } from 'react';
import { Package, Ship, Clock, Users } from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';

function useInViewCounter(target: number, start: boolean, durationMs = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    const startTs = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - startTs) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, durationMs]);
  return value;
}

export function MetricsStrip() {
  const { t, locale, dir } = useLanguage();
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.35 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const clients = useInViewCounter(250, visible);
  const shipments = useInViewCounter(1200, visible);
  const hours = useInViewCounter(48, visible);
  const retention = useInViewCounter(98, visible);

  const fmt = (n: number) =>
    new Intl.NumberFormat(locale === 'ar' ? 'ar-DZ' : 'fr-DZ').format(n);

  const items = [
    { icon: Users, value: `${fmt(clients)}+`, label: t('metrics.clients'), color: 'bg-blue-600' },
    { icon: Package, value: `${fmt(shipments)}+`, label: t('metrics.shipments'), color: 'bg-indigo-600' },
    { icon: Clock, value: `${fmt(hours)}h`, label: t('metrics.dubaiEta'), color: 'bg-cyan-600' },
    { icon: Ship, value: `${fmt(retention)}%`, label: t('metrics.retention'), color: 'bg-emerald-600' },
  ];

  return (
    <section
      ref={ref}
      dir={dir}
      className="relative z-10 border-y border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-14"
    >
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div
              key={it.label}
              className="group flex flex-col items-center text-center p-5 rounded-xl hover:-translate-y-0.5 transition-transform duration-300"
            >
              <span className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${it.color} text-white shadow-lg`}>
                <Icon className="h-5 w-5" />
              </span>
              <div className="text-3xl font-black text-slate-900 dark:text-white">{it.value}</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {it.label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
