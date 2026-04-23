"use client";

interface SidebarProps {
  adminEmail: string;
  onSignOut: () => void;
  onCreateConfirmatrice: () => void;
  isAdmin: boolean;
  activeSection: "dashboard" | "registrations" | "analytics" | "settings";
  onSectionChange: (section: "dashboard" | "registrations" | "analytics" | "settings") => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  text: {
    brand: string;
    dashboard: string;
    registrations: string;
    analytics: string;
    settings: string;
    signingOut: string;
    createConfirmatrice: string;
  };
  themeMode: "dark" | "light";
}

export default function Sidebar({
  adminEmail,
  onSignOut,
  onCreateConfirmatrice,
  isAdmin,
  activeSection,
  onSectionChange,
  mobileOpen,
  onCloseMobile,
  text,
  themeMode,
}: SidebarProps) {
  const isDark = themeMode === "dark";

  const bg = isDark ? "bg-[#0b1120]" : "bg-white";
  const border = isDark ? "border-slate-800/60" : "border-slate-200";
  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const hoverBg = isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-100";

  const navItems = [
    { id: "dashboard", label: text.dashboard, icon: "dashboard" },
    { id: "registrations", label: text.registrations, icon: "person_add" },
    { id: "analytics", label: text.analytics, icon: "analytics" },
    { id: "settings", label: text.settings, icon: "settings" },
  ] as const;

  const handleSectionClick = (section: "dashboard" | "registrations" | "analytics" | "settings") => {
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
          <p className={`text-[10px] ${muted}`}>Import Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        <p className={`mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest ${muted}`}>
          Menu
        </p>
        {navItems.map((item) => (
          <button
            type="button"
            key={item.label}
            onClick={() => handleSectionClick(item.id)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
              activeSection === item.id
                ? "bg-blue-500/12 text-blue-400 shadow-sm shadow-blue-500/5"
                : `${muted} ${hoverBg}`
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            <span>{item.label}</span>
            {activeSection === item.id && (
              <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400" />
            )}
          </button>
        ))}

        {isAdmin && (
          <>
            <div className={`my-4 border-t ${border}`} />
            <p className={`mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest ${muted}`}>
              Admin
            </p>
            <button
              type="button"
              onClick={onCreateConfirmatrice}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${muted} ${hoverBg}`}
            >
              <span className="material-symbols-outlined text-[20px]">person_add</span>
              <span className="truncate">{text.createConfirmatrice}</span>
            </button>
          </>
        )}
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
            <p className={`text-[10px] ${muted}`}>Administrator</p>
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
      <aside className={`fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r md:flex md:flex-col ${bg} ${border}`}>
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 animate-overlay-in"
            onClick={onCloseMobile}
          />
          <aside className={`absolute inset-y-0 left-0 w-[280px] animate-sidebar-in ${bg}`}>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
