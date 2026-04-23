"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";
import {
  type Registration, type RegistrationStatus, type ServiceType,
  STATUSES, SERVICE_TYPES, NICHE_OPTIONS,
  statusLabel, statusColor, serviceLabel, nicheLabel,
  relativeAge, formatDate,
} from "./lib";

import Sidebar from "./components/Sidebar";
import StatsStrip from "./components/StatsStrip";
import FilterBar from "./components/FilterBar";
import RegistrationTable from "./components/RegistrationTable";
import DetailDrawer from "./components/DetailDrawer";
import CreateConfirmatriceModal from "./components/CreateConfirmatriceModal";
import Pagination from "./components/Pagination";
import SkeletonTable from "./components/SkeletonTable";

const PAGE_SIZE = 15;

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<"dashboard" | "registrations" | "analytics" | "settings">("dashboard");
  const [authed, setAuthed] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [viewerRole, setViewerRole] = useState<"admin" | "confirmatrice">("admin");
  const [viewerNiches, setViewerNiches] = useState<string[]>([]);

  // Data
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<RegistrationStatus | "">("");
  const [serviceFilter, setServiceFilter] = useState<ServiceType | "">("");
  const [nicheFilter, setNicheFilter] = useState("");
  const [importedFilter, setImportedFilter] = useState<"" | "yes" | "no">("");
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const [language, setLanguage] = useState<"en" | "fr">("en");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // UI state
  const [saving, setSaving] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [confirmatriceModalOpen, setConfirmatriceModalOpen] = useState(false);

  // Check auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setAuthed(true);
        setAdminEmail(session.user.email ?? "");
        const metadata = session.user.user_metadata as { role?: string; niches?: string[] } | undefined;
        const role = metadata?.role === "confirmatrice" ? "confirmatrice" : "admin";
        setViewerRole(role);
        setViewerNiches(Array.isArray(metadata?.niches) ? metadata.niches : []);
      } else {
        window.location.href = "/login";
      }
    });
  }, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 400);
    return () => clearTimeout(t);
  }, [q]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, serviceFilter, nicheFilter, importedFilter, debouncedQ]);

  // Load registrations
  const loadData = useCallback(async () => {
    if (!authed) return;
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter) query = query.eq("status", statusFilter);
      if (serviceFilter) query = query.eq("service_type", serviceFilter);
      if (nicheFilter) query = query.contains("niche", [nicheFilter]);
      if (viewerRole === "confirmatrice" && viewerNiches.length > 0) {
        query = query.overlaps("niche", viewerNiches);
      }
      if (importedFilter === "yes") query = query.eq("imported_before", true);
      if (importedFilter === "no") query = query.eq("imported_before", false);
      if (debouncedQ) {
        query = query.or(`full_name.ilike.%${debouncedQ}%,phone.ilike.%${debouncedQ}%,email.ilike.%${debouncedQ}%`);
      }

      const { data, error: fetchErr } = await query;
      if (fetchErr) throw fetchErr;
      setRegistrations((data as Registration[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  }, [authed, statusFilter, serviceFilter, nicheFilter, importedFilter, debouncedQ, viewerRole, viewerNiches]);

  useEffect(() => { loadData(); }, [loadData]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(registrations.length / PAGE_SIZE));
  const paginatedRegistrations = useMemo(
    () => registrations.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [registrations, currentPage],
  );

  const selected = useMemo(
    () => registrations.find((r) => r.id === selectedId) ?? null,
    [registrations, selectedId],
  );
  const recentRegistrations = useMemo(
    () => registrations.slice(0, 8),
    [registrations],
  );

  const activeFiltersCount = useMemo(
    () => [statusFilter, serviceFilter, nicheFilter, importedFilter, debouncedQ].filter(Boolean).length,
    [statusFilter, serviceFilter, nicheFilter, importedFilter, debouncedQ],
  );

  // Stats
  const stats = useMemo(() => {
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    return {
      total: registrations.length,
      newToday: registrations.filter(r => r.status === "NEW" && new Date(r.created_at) >= todayStart).length,
      pending: registrations.filter(r => r.status === "NEW" || r.status === "CONTACTED").length,
      confirmed: registrations.filter(r => r.status === "CONFIRMED").length,
      rejected: registrations.filter(r => r.status === "REJECTED").length,
    };
  }, [registrations]);

  // Update status
  const updateStatus = async (id: string, newStatus: RegistrationStatus) => {
    setSaving(true);
    const { error: updateErr } = await supabase
      .from("registrations")
      .update({ status: newStatus })
      .eq("id", id);
    setSaving(false);
    if (!updateErr) loadData();
  };

  // Save notes
  const saveNotes = async (id: string, notes: string) => {
    setSaving(true);
    const { error: updateErr } = await supabase
      .from("registrations")
      .update({ admin_notes: notes })
      .eq("id", id);
    setSaving(false);
    if (!updateErr) loadData();
  };

  // Create confirmatrice
  const createConfirmatrice = async (email: string, password: string, niche: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) throw new Error("Your session expired. Please sign in again.");

    const response = await fetch("/api/confirmatrices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, password, niche }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error((payload as { error?: string })?.error ?? "Failed to create confirmatrice account.");
    }
  };

  // Sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  useEffect(() => {
    const html = document.documentElement;
    html.lang = language;
    html.dataset.theme = themeMode;
  }, [language, themeMode]);

  const text = useMemo(() => {
    const dict = {
      en: {
        brand: "Watinex",
        queue: "Registration Queue",
        dashboard: "Dashboard",
        registrations: "Registrations",
        analytics: "Analytics",
        settings: "Settings",
        search: "Search by name, email, or phone...",
        filter: "Filter",
        refresh: "Refresh",
        recentSubmissions: "All Registrations",
        showing: "Showing",
        of: "of",
        today: "today",
        noData: "No registrations found",
        detailsTitle: "Registration Details",
        notes: "Admin Notes",
        saveNotes: "Save Notes",
        signingOut: "Sign out",
        language: "Language",
        theme: "Theme",
        dark: "Dark",
        light: "Light",
        createConfirmatrice: "Create Confirmatrice",
        confirmatriceHint: "Create a login with access limited to one niche.",
        confirmatriceEmail: "Email",
        confirmatricePassword: "Temporary Password",
        confirmatriceNiche: "Allowed Niche",
        chooseNiche: "Choose a niche",
        createAccount: "Create Account",
        comingSoon: "This section is coming soon.",
      },
      fr: {
        brand: "Watinex",
        queue: "File des inscriptions",
        dashboard: "Tableau de bord",
        registrations: "Inscriptions",
        analytics: "Analytique",
        settings: "Paramètres",
        search: "Rechercher par nom, email ou téléphone...",
        filter: "Filtrer",
        refresh: "Actualiser",
        recentSubmissions: "Toutes les inscriptions",
        showing: "Affichage",
        of: "sur",
        today: "aujourd'hui",
        noData: "Aucune inscription trouvée",
        detailsTitle: "Détails de l'inscription",
        notes: "Notes admin",
        saveNotes: "Enregistrer",
        signingOut: "Se déconnecter",
        language: "Langue",
        theme: "Thème",
        dark: "Sombre",
        light: "Clair",
        createConfirmatrice: "Créer confirmatrice",
        confirmatriceHint: "Créer un accès limité à une seule niche.",
        confirmatriceEmail: "Email",
        confirmatricePassword: "Mot de passe temporaire",
        confirmatriceNiche: "Niche autorisée",
        chooseNiche: "Choisir une niche",
        createAccount: "Créer le compte",
        comingSoon: "Cette section arrive bientôt.",
      },
    } as const;
    return dict[language];
  }, [language]);

  if (!authed) return null;

  const isDark = themeMode === "dark";

  return (
    <div className={`min-h-screen ${isDark ? "bg-[#080d19] text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      {/* Sidebar */}
      <Sidebar
        adminEmail={adminEmail}
        onSignOut={handleSignOut}
        onCreateConfirmatrice={() => setConfirmatriceModalOpen(true)}
        isAdmin={viewerRole === "admin"}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        text={text}
        themeMode={themeMode}
      />

      {/* Main content */}
      <main className="md:ml-[260px]">
        {/* Top bar */}
        <header className={`sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 backdrop-blur-lg md:px-6 ${
          isDark ? "border-slate-800/60 bg-[#080d19]/80" : "border-slate-200 bg-white/80"
        }`}>
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg md:hidden ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div>
              <h1 className="text-base font-bold tracking-tight">
                {activeSection === "dashboard" ? text.dashboard :
                  activeSection === "registrations" ? text.registrations :
                    activeSection === "analytics" ? text.analytics : text.settings}
              </h1>
              <p className={`text-[11px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                Manage and track your import leads
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "en" | "fr")}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium outline-none transition-colors ${
                isDark ? "border-slate-700/60 bg-slate-900/60 text-slate-300" : "border-slate-200 bg-white text-slate-600"
              }`}
              aria-label={text.language}
            >
              <option value="en">🇬🇧 EN</option>
              <option value="fr">🇫🇷 FR</option>
            </select>
            <button
              type="button"
              onClick={() => setThemeMode((prev) => (prev === "dark" ? "light" : "dark"))}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
                isDark ? "border-slate-700/60 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-100"
              }`}
              aria-label={text.theme}
            >
              <span className="material-symbols-outlined text-base">
                {themeMode === "dark" ? "dark_mode" : "light_mode"}
              </span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="space-y-5 px-4 py-5 md:px-6">
          {(activeSection === "dashboard" || activeSection === "registrations") && (
            <>
              {/* Stats */}
              <StatsStrip stats={stats} themeMode={themeMode} />

              {/* Filters */}
              <FilterBar
                q={q}
                onQChange={setQ}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                serviceFilter={serviceFilter}
                onServiceChange={setServiceFilter}
                nicheFilter={nicheFilter}
                onNicheChange={setNicheFilter}
                importedFilter={importedFilter}
                onImportedChange={setImportedFilter}
                activeFiltersCount={activeFiltersCount}
                onRefresh={loadData}
                loading={loading}
                text={text}
                themeMode={themeMode}
              />
            </>
          )}

          {activeSection === "dashboard" && (
            <section className={`rounded-2xl border ${isDark ? "border-slate-800/50 bg-slate-900/40" : "border-slate-200 bg-white"}`}>
              <div className={`flex items-center justify-between border-b px-4 py-3 ${isDark ? "border-slate-800/50" : "border-slate-200"}`}>
                <h2 className="text-sm font-semibold">{text.recentSubmissions}</h2>
                <button
                  type="button"
                  onClick={() => setActiveSection("registrations")}
                  className={`text-xs font-medium ${isDark ? "text-blue-300 hover:text-blue-200" : "text-blue-600 hover:text-blue-500"}`}
                >
                  {text.registrations}
                </button>
              </div>
              <RegistrationTable
                registrations={recentRegistrations}
                selectedId={selectedId}
                onSelect={(id) => setSelectedId(id)}
                themeMode={themeMode}
                text={text}
              />
            </section>
          )}

          {activeSection === "registrations" && (
            <>
              {/* Table or Skeleton */}
              {loading ? (
                <SkeletonTable themeMode={themeMode} />
              ) : (
                <>
                  <RegistrationTable
                    registrations={paginatedRegistrations}
                    selectedId={selectedId}
                    onSelect={(id) => setSelectedId(id)}
                    themeMode={themeMode}
                    text={text}
                  />
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={registrations.length}
                    pageSize={PAGE_SIZE}
                    onPageChange={setCurrentPage}
                    themeMode={themeMode}
                  />
                </>
              )}
            </>
          )}

          {activeSection === "analytics" && (
            <section className={`grid gap-4 md:grid-cols-3`}>
              <div className={`rounded-2xl border p-4 ${isDark ? "border-slate-800/50 bg-slate-900/40" : "border-slate-200 bg-white"}`}>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Conversion</p>
                <p className="mt-2 text-3xl font-bold">
                  {stats.total > 0 ? Math.round((stats.confirmed / stats.total) * 100) : 0}%
                </p>
              </div>
              <div className={`rounded-2xl border p-4 ${isDark ? "border-slate-800/50 bg-slate-900/40" : "border-slate-200 bg-white"}`}>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Rejection Rate</p>
                <p className="mt-2 text-3xl font-bold">
                  {stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0}%
                </p>
              </div>
              <div className={`rounded-2xl border p-4 ${isDark ? "border-slate-800/50 bg-slate-900/40" : "border-slate-200 bg-white"}`}>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Pending Follow-ups</p>
                <p className="mt-2 text-3xl font-bold">{stats.pending}</p>
              </div>
            </section>
          )}

          {activeSection === "settings" && (
            <section className={`rounded-2xl border p-5 ${isDark ? "border-slate-800/50 bg-slate-900/40" : "border-slate-200 bg-white"}`}>
              <h2 className="text-sm font-semibold">{text.settings}</h2>
              <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>{text.comingSoon}</p>
            </section>
          )}

          {/* Error */}
          {error && (
            <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
              isDark ? "border-red-700/40 bg-red-950/30 text-red-200" : "border-red-200 bg-red-50 text-red-700"
            }`}>
              <span className="material-symbols-outlined text-base text-red-400">error</span>
              {error}
            </div>
          )}
        </div>
      </main>

      {/* Detail Drawer */}
      <DetailDrawer
        registration={selected}
        onClose={() => setSelectedId(null)}
        onStatusChange={updateStatus}
        onSaveNotes={saveNotes}
        saving={saving}
        themeMode={themeMode}
        text={text}
      />

      {/* Create Confirmatrice Modal */}
      {viewerRole === "admin" && (
        <CreateConfirmatriceModal
          open={confirmatriceModalOpen}
          onClose={() => setConfirmatriceModalOpen(false)}
          onCreate={createConfirmatrice}
          themeMode={themeMode}
          text={text}
        />
      )}
    </div>
  );
}
