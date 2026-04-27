"use client";

import { useEffect, useRef, useState } from "react";

interface StatsStripProps {
  stats: {
    total: number;
    newToday: number;
    pending: number;
    confirmed: number;
    rejected: number;
  };
  themeMode: "dark" | "light";
  locale: "ar" | "fr";
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const start = display;
    const diff = value - start;
    if (diff === 0) return;

    const duration = 600;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) {
        ref.current = requestAnimationFrame(tick);
      }
    };

    ref.current = requestAnimationFrame(tick);
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [value]);

  return <span>{display}</span>;
}

export default function StatsStrip({ stats, themeMode, locale }: StatsStripProps) {
  const isDark = themeMode === "dark";
  const cardBg = isDark ? "bg-slate-900/50" : "bg-white";
  const border = isDark ? "border-slate-800/50" : "border-slate-200";
  const muted = isDark ? "text-slate-500" : "text-slate-400";

  const cards = [
    {
      label: locale === "ar" ? "إجمالي العملاء" : "Total des prospects",
      value: stats.total,
      icon: "groups",
      accentClass: "stat-card-blue",
      iconColor: "text-blue-400",
      gradientBg: isDark ? "bg-blue-500/5" : "bg-blue-50",
    },
    {
      label: locale === "ar" ? "اليوم" : "Nouveaux aujourd'hui",
      value: stats.newToday,
      icon: "fiber_new",
      accentClass: "stat-card-violet",
      iconColor: "text-violet-400",
      gradientBg: isDark ? "bg-violet-500/5" : "bg-violet-50",
    },
    {
      label: locale === "ar" ? "متابعة" : "Suivi",
      value: stats.pending,
      icon: "schedule",
      accentClass: "stat-card-amber",
      iconColor: "text-amber-400",
      gradientBg: isDark ? "bg-amber-500/5" : "bg-amber-50",
    },
    {
      label: locale === "ar" ? "مؤكد" : "Confirmé",
      value: stats.confirmed,
      icon: "verified",
      accentClass: "stat-card-emerald",
      iconColor: "text-emerald-400",
      gradientBg: isDark ? "bg-emerald-500/5" : "bg-emerald-50",
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {cards.map((card, idx) => (
        <div
          key={card.label}
          className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${cardBg} ${border} ${card.accentClass}`}
          style={{ animationDelay: `${idx * 80}ms` }}
        >
          <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${card.gradientBg}`} />
          <div className="relative">
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-semibold uppercase tracking-wider ${muted}`}>
                {card.label}
              </span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.gradientBg}`}>
                <span className={`material-symbols-outlined text-lg ${card.iconColor}`}>
                  {card.icon}
                </span>
              </div>
            </div>
            <p className="mt-3 text-3xl font-extrabold tracking-tight animate-count-up">
              <AnimatedNumber value={card.value} />
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
