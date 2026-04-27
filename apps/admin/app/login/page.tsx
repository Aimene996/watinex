"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const [language, setLanguage] = useState<"ar" | "fr">("ar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted || !session) return;
      window.location.replace("/");
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const text = language === "ar"
    ? {
        title: "لوحة واتينيكس",
        subtitle: "سجل الدخول لإدارة التسجيلات",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        signIn: "تسجيل الدخول",
        signingIn: "جار تسجيل الدخول...",
        hint: "أول مرة؟ اطلب من مسؤول الفريق إنشاء حسابك الإداري في Supabase.",
        serverError: "تعذر الوصول إلى الخادم.",
      }
    : {
        title: "Watinex Admin",
        subtitle: "Connectez-vous pour gérer les inscriptions",
        email: "Email",
        password: "Mot de passe",
        signIn: "Se connecter",
        signingIn: "Connexion...",
        hint: "Première fois ? Demandez à votre responsable de créer votre compte admin dans Supabase.",
        serverError: "Impossible de joindre le serveur.",
      };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      window.location.replace("/");
    } catch {
      setError(text.serverError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md" style={{ animation: "fadeInUp 0.5s ease-out" }}>
        {/* Logo area */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
               style={{ background: "linear-gradient(135deg, #06b6d4, #8b5cf6)" }}>
            <span className="text-2xl font-extrabold text-white">W</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{text.title}</h1>
          <p className="mt-2 text-sm text-slate-400">
            {text.subtitle}
          </p>
        </div>

        <div className="mb-4 flex justify-center">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "ar" | "fr")}
            className="rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-200"
            aria-label="Language"
          >
            <option value="ar">🇩🇿 AR</option>
            <option value="fr">🇫🇷 FR</option>
          </select>
        </div>

        {/* Login card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-sm">
          {error && (
            <div className="mb-4 rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                {text.email}
              </label>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@watinex.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-600/30"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                {text.password}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-600/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3 text-sm font-bold text-white shadow-lg transition-all hover:shadow-cyan-500/20 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #06b6d4, #8b5cf6)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="15" strokeLinecap="round" />
                  </svg>
                  {text.signingIn}
                </span>
              ) : text.signIn}
            </button>
          </form>

          <div className="mt-5 border-t border-slate-800 pt-4">
            <p className="text-center text-xs text-slate-500">
              {text.hint}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
