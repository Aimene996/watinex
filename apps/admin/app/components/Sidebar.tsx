"use client";

interface SidebarProps {
  adminEmail: string;
  onSignOut: () => void;
  isAdmin: boolean;
  activeSection: "dashboard" | "registrations" | "analytics" | "pdf" | "confirmatrices" | "settings";
  onSectionChange: (section: "dashboard" | "registrations" | "analytics" | "pdf" | "confirmatrices" | "settings") => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  text: {
    brand: string;
    dashboard: string;
    registrations: string;
    analytics: string;
    pdf: string;
    settings: string;
    signingOut: string;
    createConfirmatrice: string;
  };
  themeMode: "dark" | "light";
  locale: "ar" | "fr";
}

export default function Sidebar({
  adminEmail,
  onSignOut,
  isAdmin,
  activeSection,
  onSectionChange,
  mobileOpen,
  onCloseMobile,
  text,
  themeMode,
  locale,
}: SidebarProps) {
  const isDark = themeMode === "dark";
  const isRtl = locale === "ar";

  const bg = isDark ? "bg-[#0b1120]" : "bg-white";
  const border = isDark ? "border-slate-800/60" : "border-slate-200";
  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const hoverBg = isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-100";

  const navItems = [
    { id: "dashboard", label: text.dashboard, icon: "dashboard" },
    { id: "registrations", label: text.registrations, icon: "person_add" },
    { id: "analytics", label: text.analytics, icon: "analytics" },
    { id: "pdf", label: text.pdf, icon: "picture_as_pdf" },
    ...(isAdmin ? [{ id: "confirmatrices", label: text.createConfirmatrice, icon: "manage_accounts" } as const] : []),
    { id: "settings", label: text.settings, icon: "settings" },
  ] as const;

  const handleSectionClick = (section: "dashboard" | "registrations" | "analytics" | "pdf" | "confirmatrices" | "settings") => {
    onSectionChange(section);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="mb-8 flex items-center gap-3 px-4 pt-6">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-lg"
          style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
        >
          <span className="text-sm font-extrabold">W</span>
        </div>
        <div>
          <span className="text-base font-bold tracking-tight">{text.brand}</span>
          <p className={`text-[10px] ${muted}`}>{locale === "ar" ? "منصة الاستيراد" : "Plateforme d'import"}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        <p className={`mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest ${muted}`}>
          {locale === "ar" ? "القائمة" : "Menu"}
        </p>
        {navItems.map((item) => (
          <button
            type="button"
            key={item.label}
            onClick={() => handleSectionClick(item.id)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              activeSection === item.id
                ? "bg-blue-500/12 text-blue-400 shadow-sm shadow-blue-500/5"
                : `${muted} ${hoverBg}`
            } ${isRtl ? "text-right" : "text-left"}`}
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            <span>{item.label}</span>
            {activeSection === item.id && (
              <div className={`${isRtl ? "mr-auto" : "ml-auto"} h-1.5 w-1.5 rounded-full bg-blue-400`} />
            )}
          </button>
        ))}

        {isAdmin && <div className={`my-4 border-t ${border}`} />}
      </nav>

      {/* User Card */}
      <div className={`mx-3 mb-4 rounded-xl border p-3 ${border} ${isDark ? "bg-slate-900/40" : "bg-slate-50"}`}>
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
          >
            {adminEmail.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">{adminEmail}</p>
            <p className={`text-[10px] ${muted}`}>{locale === "ar" ? "مسؤول" : "Administrateur"}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${border} ${hoverBg} ${muted}`}
        >
          <span className="material-symbols-outlined text-[14px]">logout</span>
          {text.signingOut}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`fixed inset-y-0 z-40 hidden w-[260px] md:flex md:flex-col ${bg} ${border} ${isRtl ? "right-0 border-l" : "left-0 border-r"}`}>
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 animate-overlay-in"
            onClick={onCloseMobile}
          />
          <aside className={`absolute inset-y-0 w-[280px] animate-sidebar-in ${bg} ${isRtl ? "right-0" : "left-0"}`}>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
