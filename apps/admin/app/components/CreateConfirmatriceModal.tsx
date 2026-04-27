"use client";

import { useState } from "react";
import { NICHE_OPTIONS, nicheLabel } from "../lib";

interface CreateConfirmatriceModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (
    email: string,
    password: string,
    niche: string,
  ) => Promise<{
    email: string;
    password: string;
    niche: string;
    saved: boolean;
    saveError: string | null;
  }>;
  themeMode: "dark" | "light";
  text: {
    createConfirmatrice: string;
    confirmatriceHint: string;
    confirmatriceEmail: string;
    confirmatricePassword: string;
    confirmatriceNiche: string;
    chooseNiche: string;
    createAccount: string;
  };
}

export default function CreateConfirmatriceModal({
  open,
  onClose,
  onCreate,
  themeMode,
  text,
}: CreateConfirmatriceModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [createdCredentials, setCreatedCredentials] = useState<{
    email: string;
    password: string;
    niche: string;
    saved: boolean;
    saveError: string | null;
  } | null>(null);

  const isDark = themeMode === "dark";
  const bg = isDark ? "bg-[#0d1424]" : "bg-white";
  const border = isDark ? "border-slate-800/60" : "border-slate-200";
  const inputBg = isDark
    ? "bg-slate-900/60 border-slate-700/60 text-slate-100 placeholder:text-slate-600"
    : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400";
  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const subtle = isDark ? "text-slate-500" : "text-slate-400";

  const resetState = () => {
    setEmail("");
    setPassword("");
    setNiche("");
    setLoading(false);
    setFeedback(null);
    setError(null);
    setCreatedCredentials(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSubmit = async () => {
    if (!email || !password || !niche) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    setError(null);
    setFeedback(null);
    try {
      const created = await onCreate(email, password, niche);
      setCreatedCredentials(created);
      setFeedback(created.saved ? "Account created and credentials saved to Supabase." : "Account created successfully.");
      setEmail("");
      setPassword("");
      setNiche("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const resetForAnother = () => resetState();

  const copyValue = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Ignore clipboard errors; user can copy manually.
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-overlay-in" onClick={handleClose} />

      {/* Modal */}
      <div className={`relative w-full max-w-lg rounded-2xl border p-6 shadow-2xl animate-modal-in ${bg} ${border}`}>
        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold">
              {createdCredentials ? "Credentials Created" : text.createConfirmatrice}
            </h2>
            <p className={`mt-1 text-xs ${subtle}`}>
              {createdCredentials
                ? "Copy and share these credentials with the new confirmatrice."
                : text.confirmatriceHint}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {!createdCredentials ? (
          <div className="space-y-4">
            <div>
              <label className={`mb-1.5 block text-[10px] font-semibold uppercase tracking-widest ${subtle}`}>
                {text.confirmatriceEmail}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="confirmatrice@watinex.com"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 ${inputBg}`}
              />
            </div>
            <div>
              <label className={`mb-1.5 block text-[10px] font-semibold uppercase tracking-widest ${subtle}`}>
                {text.confirmatricePassword}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 ${inputBg}`}
              />
            </div>
            <div>
              <label className={`mb-1.5 block text-[10px] font-semibold uppercase tracking-widest ${subtle}`}>
                {text.confirmatriceNiche}
              </label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors ${inputBg}`}
              >
                <option value="">{text.chooseNiche}</option>
                {NICHE_OPTIONS.map((n) => (
                  <option key={n} value={n}>{nicheLabel(n)}</option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className={`space-y-3 rounded-xl border p-4 ${border}`}>
            <p className={`text-xs ${muted}`}>Share and save these credentials now:</p>
            <div className="space-y-2 text-sm">
              <div className={`flex items-center justify-between rounded-lg border px-3 py-2 ${border}`}>
                <span className={muted}>Email: {createdCredentials.email}</span>
                <button type="button" className="text-xs font-semibold text-blue-500" onClick={() => copyValue(createdCredentials.email)}>
                  Copy
                </button>
              </div>
              <div className={`flex items-center justify-between rounded-lg border px-3 py-2 ${border}`}>
                <span className={muted}>Password: {createdCredentials.password}</span>
                <button type="button" className="text-xs font-semibold text-blue-500" onClick={() => copyValue(createdCredentials.password)}>
                  Copy
                </button>
              </div>
              <div className={`rounded-lg border px-3 py-2 ${border}`}>
                <span className={muted}>Niche: {nicheLabel(createdCredentials.niche)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-medium text-emerald-400">
            {feedback}
          </div>
        )}
        {createdCredentials?.saveError && (
          <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs font-medium text-amber-300">
            {createdCredentials.saveError}
          </div>
        )}
        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-medium text-red-400">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className={`mt-6 flex items-center justify-end gap-3 border-t pt-5 ${border}`}>
          <button
            type="button"
            onClick={handleClose}
            className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${border} ${isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-100"}`}
          >
            {createdCredentials ? "Done" : "Cancel"}
          </button>
          {createdCredentials ? (
            <button
              type="button"
              onClick={resetForAnother}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:shadow-md hover:shadow-emerald-600/30"
            >
              Create Another Confirmatrice
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:shadow-md hover:shadow-emerald-600/30 disabled:opacity-60"
            >
              {loading ? "Creating…" : text.createAccount}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
