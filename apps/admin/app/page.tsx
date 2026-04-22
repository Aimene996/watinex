"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";
import {
  type Registration, type RegistrationStatus, type ServiceType,
  STATUSES, SERVICE_TYPES, NICHE_OPTIONS,
  statusLabel, statusColor, serviceLabel, serviceColor, nicheLabel,
  relativeAge, formatDate,
} from "./lib";

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

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

  // Detail editing
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // Check auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setAuthed(true);
        setAdminEmail(session.user.email ?? "");
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
  }, [authed, statusFilter, serviceFilter, nicheFilter, importedFilter, debouncedQ]);

  useEffect(() => { loadData(); }, [loadData]);

  const selected = useMemo(() => registrations.find((r) => r.id === selectedId) ?? null, [registrations, selectedId]);

  // When selection changes, load notes
  useEffect(() => {
    if (selected) setEditNotes(selected.admin_notes ?? "");
  }, [selected]);

  // Stats
  const stats = useMemo(() => {
    const now = Date.now();
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
  const saveNotes = async () => {
    if (!selected) return;
    setSaving(true);
    const { error: updateErr } = await supabase
      .from("registrations")
      .update({ admin_notes: editNotes })
      .eq("id", selected.id);
    setSaving(false);
    if (!updateErr) loadData();
  };

  // Sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (!authed) return null;

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Watinex</p>
          <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">Registration Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">{adminEmail}</span>
          <button type="button" onClick={handleSignOut}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-500 transition-colors">
            Sign out
          </button>
        </div>
      </header>

      {/* Stats Strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { label: "Total", value: stats.total, color: "text-white" },
          { label: "New Today", value: stats.newToday, color: "text-blue-400" },
          { label: "Pending", value: stats.pending, color: "text-amber-400" },
          { label: "Confirmed", value: stats.confirmed, color: "text-emerald-400" },
          { label: "Rejected", value: stats.rejected, color: "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{s.label}</p>
            <p className={`mt-1 text-2xl font-extrabold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 mr-1">Status</span>
          {(["", ...STATUSES] as const).map((s) => (
            <button key={s || "all"} type="button" onClick={() => setStatusFilter(s as RegistrationStatus | "")}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors ${
                statusFilter === s ? "border-cyan-500 bg-cyan-950/50 text-cyan-100" : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
              }`}>
              {s === "" ? "All" : statusLabel(s as RegistrationStatus)}
            </button>
          ))}
          <div className="h-4 w-px bg-slate-800 mx-1" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 mr-1">Service</span>
          {(["", ...SERVICE_TYPES] as const).map((sv) => (
            <button key={sv || "all"} type="button" onClick={() => setServiceFilter(sv as ServiceType | "")}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors ${
                serviceFilter === sv ? "border-violet-500 bg-violet-950/50 text-violet-100" : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
              }`}>
              {sv === "" ? "All" : serviceLabel(sv as ServiceType)}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={nicheFilter} onChange={(e) => setNicheFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500/60">
            <option value="">All niches</option>
            {NICHE_OPTIONS.map((n) => <option key={n} value={n}>{nicheLabel(n)}</option>)}
          </select>
          <select value={importedFilter} onChange={(e) => setImportedFilter(e.target.value as "" | "yes" | "no")}
            className="rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500/60">
            <option value="">Imported?</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, email…"
            className="w-48 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500/60" />
          <button type="button" onClick={() => loadData()} disabled={loading}
            className="rounded-xl border border-slate-600 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-800 disabled:opacity-50 transition-colors">
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Registration list */}
        <section className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold text-slate-400">Registrations ({registrations.length})</h2>
          <ul className="space-y-2 max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
            {registrations.map((reg) => (
              <li key={reg.id}>
                <button type="button" onClick={() => setSelectedId(reg.id)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${
                    selectedId === reg.id
                      ? "border-cyan-500/60 bg-slate-900/80 shadow-lg shadow-cyan-500/5"
                      : "border-slate-800 bg-slate-900/30 hover:border-slate-600 hover:bg-slate-900/50"
                  }`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-white truncate">{reg.full_name}</span>
                    <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase ${statusColor(reg.status)}`}>
                      {statusLabel(reg.status)}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between gap-2 text-xs">
                    <span className="text-slate-500">{relativeAge(reg.created_at)}</span>
                    <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${serviceColor(reg.service_type)}`}>
                      {serviceLabel(reg.service_type)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 truncate">{reg.phone} · {reg.email}</p>
                </button>
              </li>
            ))}
          </ul>
          {!loading && registrations.length === 0 && (
            <div className="mt-6 rounded-xl border border-dashed border-slate-700 p-8 text-center">
              <p className="text-3xl mb-3">📭</p>
              <p className="text-sm font-medium text-slate-400">No registrations found</p>
            </div>
          )}
        </section>

        {/* Detail pane */}
        <section className="lg:col-span-3">
          {!selected ? (
            <div className="rounded-xl border border-dashed border-slate-700 p-12 text-center">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-sm font-medium text-slate-400">Select a registration to view details</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{selected.full_name}</h3>
                  <p className="text-sm text-slate-400 mt-1">{formatDate(selected.created_at)}</p>
                </div>
                <span className={`rounded-lg border px-2.5 py-1 text-xs font-bold uppercase ${statusColor(selected.status)}`}>
                  {statusLabel(selected.status)}
                </span>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-3">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Phone</p>
                  <p className="text-sm font-semibold text-white mt-0.5" dir="ltr">{selected.phone}</p>
                </div>
                <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-3">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Email</p>
                  <p className="text-sm font-semibold text-white mt-0.5 truncate">{selected.email}</p>
                </div>
              </div>

              {/* Profile */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-3">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Imported Before</p>
                  <p className={`text-sm font-bold mt-0.5 ${selected.imported_before ? "text-emerald-400" : "text-amber-400"}`}>
                    {selected.imported_before ? "✓ Yes" : "✗ No"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-3">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Service Type</p>
                  <p className="text-sm font-bold text-white mt-0.5">{serviceLabel(selected.service_type)}</p>
                </div>
              </div>

              {/* Niches */}
              <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-3">
                <p className="text-[10px] font-bold uppercase text-slate-500 mb-2">Products / Niche</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.niche.map((n) => (
                    <span key={n} className="rounded-lg bg-slate-700/50 border border-slate-600/50 px-2.5 py-1 text-xs font-semibold text-slate-200">
                      {nicheLabel(n)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500 mb-2">Admin Notes</p>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500/60 resize-none"
                  placeholder="Add internal notes about this registration…"
                />
                <button type="button" onClick={saveNotes} disabled={saving}
                  className="mt-2 rounded-lg border border-slate-600 px-4 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-50 transition-colors">
                  {saving ? "Saving…" : "Save Notes"}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 border-t border-slate-800 pt-4">
                {selected.status !== "CONTACTED" && (
                  <button type="button" onClick={() => updateStatus(selected.id, "CONTACTED")} disabled={saving}
                    className="rounded-xl border border-amber-500/40 bg-amber-950/30 px-4 py-2 text-sm font-bold text-amber-300 hover:bg-amber-900/40 disabled:opacity-50 transition-colors">
                    📞 Mark Contacted
                  </button>
                )}
                {selected.status !== "CONFIRMED" && (
                  <button type="button" onClick={() => updateStatus(selected.id, "CONFIRMED")} disabled={saving}
                    className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-4 py-2 text-sm font-bold text-emerald-300 hover:bg-emerald-900/40 disabled:opacity-50 transition-colors">
                    ✓ Confirm
                  </button>
                )}
                {selected.status !== "REJECTED" && (
                  <button type="button" onClick={() => updateStatus(selected.id, "REJECTED")} disabled={saving}
                    className="rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-2 text-sm font-bold text-red-300 hover:bg-red-900/40 disabled:opacity-50 transition-colors">
                    ✗ Reject
                  </button>
                )}
                {selected.status !== "NEW" && (
                  <button type="button" onClick={() => updateStatus(selected.id, "NEW")} disabled={saving}
                    className="rounded-xl border border-blue-500/40 bg-blue-950/30 px-4 py-2 text-sm font-bold text-blue-300 hover:bg-blue-900/40 disabled:opacity-50 transition-colors">
                    ↩ Reset to New
                  </button>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
