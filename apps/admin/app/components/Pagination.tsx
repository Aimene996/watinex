"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  themeMode: "dark" | "light";
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  themeMode,
}: PaginationProps) {
  const isDark = themeMode === "dark";
  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const btnBase = isDark
    ? "border-slate-700/60 text-slate-300 hover:bg-slate-800/60"
    : "border-slate-200 text-slate-600 hover:bg-slate-100";
  const btnActive = "border-blue-500/50 bg-blue-500/15 text-blue-400";
  const btnDisabled = "opacity-40 cursor-not-allowed";

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers to show
  const getPages = (): (number | "...")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages: (number | "...")[] = [1];
    if (currentPage > 3) pages.push("...");

    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-3 px-1 py-3 sm:flex-row">
      <p className={`text-xs ${muted}`}>
        Showing <span className="font-semibold">{start}–{end}</span> of{" "}
        <span className="font-semibold">{totalItems}</span> registrations
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
            currentPage === 1 ? btnDisabled : btnBase
          }`}
        >
          <span className="material-symbols-outlined text-sm">chevron_left</span>
          Prev
        </button>

        {getPages().map((page, idx) =>
          page === "..." ? (
            <span key={`dots-${idx}`} className={`px-2 text-xs ${muted}`}>...</span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-medium transition-colors ${
                page === currentPage ? btnActive : btnBase
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
            currentPage === totalPages ? btnDisabled : btnBase
          }`}
        >
          Next
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
