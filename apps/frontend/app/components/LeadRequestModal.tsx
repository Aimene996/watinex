'use client';

import { useCallback, useEffect, useState } from 'react';
import { X, Loader2, Phone, UserCircle } from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';
import { apiUrl } from '../../lib/publicApi';

type Tier = 'BEGINNER' | 'MEDIUM' | 'BIG';

function defaultSlaHours(): number {
  const raw = process.env.NEXT_PUBLIC_CONTACT_SLA_HOURS;
  const n = raw ? Number.parseInt(raw, 10) : 24;
  return Number.isFinite(n) && n > 0 ? n : 24;
}

export function LeadRequestModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t, dir } = useLanguage();
  const [step, setStep] = useState<'form' | 'success' | 'error'>('form');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [tier, setTier] = useState<Tier>('BEGINNER');
  const [submitting, setSubmitting] = useState(false);
  const [contactHours, setContactHours] = useState(defaultSlaHours());

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const reset = useCallback(() => {
    setStep('form');
    setPhone('');
    setName('');
    setTier('BEGINNER');
    setSubmitting(false);
    setContactHours(defaultSlaHours());
  }, []);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStep('form');
    try {
      const res = await fetch(apiUrl('/api/leads'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.trim(),
          name: name.trim() || undefined,
          tier,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        contactWithinHours?: number;
        error?: string;
      };
      if (!res.ok) {
        setStep('error');
        return;
      }
      if (typeof data.contactWithinHours === 'number' && data.contactWithinHours > 0) {
        setContactHours(data.contactWithinHours);
      }
      setStep('success');
    } catch {
      setStep('error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const successText = t('leadRequest.successBody').replace(
    '{hours}',
    String(contactHours)
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-request-title"
      dir={dir}
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        aria-label={t('leadRequest.close')}
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-200/80 dark:border-slate-800">
          <h2 id="lead-request-title" className="text-lg font-bold text-slate-900 dark:text-white">
            {t('leadRequest.title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={t('leadRequest.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-5">
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('leadRequest.subtitle')}
              </p>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                  <Phone className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  {t('leadRequest.phoneLabel')}
                </label>
                <input
                  type="tel"
                  required
                  minLength={8}
                  autoComplete="tel"
                  placeholder={t('leadRequest.phonePlaceholder')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                  <UserCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  {t('leadRequest.nameLabel')}
                </label>
                <input
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              <fieldset>
                <legend className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  {t('leadRequest.tierLabel')}
                </legend>
                <div className="space-y-2">
                  {(
                    [
                      { value: 'BEGINNER' as const, title: 'tierBeginner', desc: 'tierBeginnerDesc' },
                      { value: 'MEDIUM' as const, title: 'tierMedium', desc: 'tierMediumDesc' },
                      { value: 'BIG' as const, title: 'tierBig', desc: 'tierBigDesc' },
                    ] as const
                  ).map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex cursor-pointer gap-3 rounded-xl border px-4 py-3 transition-colors ${
                        tier === opt.value
                          ? 'border-cyan-500 bg-cyan-50/80 dark:bg-cyan-950/30 dark:border-cyan-500'
                          : 'border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="tier"
                        value={opt.value}
                        checked={tier === opt.value}
                        onChange={() => setTier(opt.value)}
                        className="mt-1"
                      />
                      <span>
                        <span className="block font-semibold text-slate-900 dark:text-white">
                          {t(`leadRequest.${opt.title}`)}
                        </span>
                        <span className="block text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                          {t(`leadRequest.${opt.desc}`)}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-3.5 shadow-lg hover:opacity-95 disabled:opacity-60 transition-opacity"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {t('leadRequest.submit')}
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4 py-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-2xl font-bold">
                ✓
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t('leadRequest.successTitle')}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{successText}</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 py-3 font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80"
              >
                {t('leadRequest.close')}
              </button>
            </div>
          )}

          {step === 'error' && (
            <div className="text-center space-y-4 py-2">
              <p className="text-slate-600 dark:text-slate-300">
                {t('leadRequest.errorNetwork')}
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="flex-1 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-3"
                >
                  {t('leadRequest.submit')}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-3 font-semibold text-slate-800 dark:text-slate-200"
                >
                  {t('leadRequest.close')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
