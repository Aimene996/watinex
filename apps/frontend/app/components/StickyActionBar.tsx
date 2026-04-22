'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClipboardList, MessageCircle, X } from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';

export function StickyActionBar({ whatsappLink }: { whatsappLink: string }) {
  const { t, dir } = useLanguage();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (dismissed || !show) return null;

  return (
    <div
      dir={dir}
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 md:px-4 md:pb-4"
    >
      <div className="mx-auto flex w-full max-w-3xl items-center gap-2 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-2xl backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/95">
        <div className="hidden flex-1 ps-3 text-sm font-semibold text-slate-700 dark:text-slate-200 md:block">
          {t('stickyBar.tagline')}
        </div>
        <Link
          href="/booking"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md md:flex-none"
        >
          <ClipboardList className="h-4 w-4" />
          {t('stickyBar.register')}
        </Link>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700/60 dark:bg-emerald-950/30 dark:text-emerald-300"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="hidden sm:inline">{t('stickyBar.whatsapp')}</span>
        </a>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded-lg p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          aria-label={t('stickyBar.dismiss')}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
