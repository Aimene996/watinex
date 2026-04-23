"use client";

interface SkeletonTableProps {
  rows?: number;
  themeMode: "dark" | "light";
}

export default function SkeletonTable({ rows = 8, themeMode }: SkeletonTableProps) {
  const isDark = themeMode === "dark";
  const cardBg = isDark ? "bg-slate-900/50 border-slate-800/50" : "bg-white border-slate-200";
  const headerBg = isDark ? "bg-slate-800/40" : "bg-slate-100";
  const skelBg = isDark ? "bg-slate-700/40" : "bg-slate-200";
  const rowBorder = isDark ? "border-slate-800/30" : "border-slate-100";

  return (
    <div className={`overflow-hidden rounded-2xl border ${cardBg}`}>
      {/* Header skeleton */}
      <div className={`flex items-center gap-4 px-5 py-3.5 ${headerBg}`}>
        {[120, 160, 100, 80, 100, 80, 60].map((w, i) => (
          <div
            key={i}
            className={`h-3 rounded animate-skeleton ${skelBg}`}
            style={{ width: w, animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
      {/* Row skeletons */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`flex items-center gap-4 border-t px-5 py-4 ${rowBorder}`}>
          {[140, 180, 110, 90, 70, 90, 50].map((w, j) => (
            <div
              key={j}
              className={`h-3 rounded animate-skeleton ${skelBg}`}
              style={{
                width: w + Math.random() * 30,
                animationDelay: `${(i * 7 + j) * 60}ms`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
