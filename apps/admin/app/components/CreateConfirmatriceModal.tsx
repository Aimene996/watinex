"use client";

import { useState } from "react";
import { NICHE_OPTIONS, nicheLabel } from "../lib";

interface CreateConfirmatriceModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (email: string, password: string, niche: string) => Promise<void>;
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

  const isDark = themeMode === "dark";
  const bg = isDark ? "bg-[#0d1424]" : "bg-white";
  const border = isDark ? "border-slate-800/60" : "border-slate-200";
  const inputBg = isDark
    ? "bg-slate-900/60 border-slate-700/60 text-slate-100 placeholder:text-slate-600"
    : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400";
  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const subtle = isDark ? "text-slate-500" : "text-slate-400";

  const handleSubmit = async () => {
    if (!email || !password || !niche) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    setError(null);
    setFeedback(null);
    try {
      await onCreate(email, password, niche);
      setFeedback("Account created successfully!");
      setEmail("");
      setPassword("");
      setNiche("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-overlay-in" onClick={onClose} />

      {/* Modal */}
      <div className={`relative w-full max-w-lg rounded-2xl border p-6 shadow-2xl animate-modal-in ${bg} ${border}`}>
        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold">{text.createConfirmatrice}</h2>
            <p className={`mt-1 text-xs ${subtle}`}>{text.confirmatriceHint}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Form */}
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

        {/* Feedback */}
        {feedback && (
          <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-medium text-emerald-400">
            {feedback}
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
            onClick={onClose}
            className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${border} ${isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-100"}`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:shadow-md hover:shadow-emerald-600/30 disabled:opacity-60"
          >
            {loading ? "Creating…" : text.createAccount}
          </button>
        </div>
      </div>
    </div>
  );
}
