'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ListChecks,
  Loader2,
  Mail,
  Package,
  Phone,
  Search,
  Truck,
  User,
} from 'lucide-react';
import watinexLogo from '../logo vertical.png';
import { ThemeToggle } from '../components/ThemeToggle';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useLanguage } from '../providers/LanguageProvider';
import { supabase } from '../../lib/supabase';

type ServiceType = 'SHIPPING' | 'SOURCING';

export default function BookingRegistrationPage() {
  const { t, dir } = useLanguage();
  const [step, setStep] = useState(1);
  const [phase, setPhase] = useState<'form' | 'success' | 'error'>('form');
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [importedBefore, setImportedBefore] = useState<boolean | null>(null);
  const [niche, setNiche] = useState<string[]>([]);
  const [nicheDropdownOpen, setNicheDropdownOpen] = useState(false);
  const [serviceType, setServiceType] = useState<ServiceType | null>(null);
  const [detailsConfirmed, setDetailsConfirmed] = useState(false);

  const steps = useMemo(
    () => [
      { id: 1, short: t('booking.step1Short'), icon: User },
      { id: 2, short: t('booking.step2Short'), icon: Package },
      { id: 3, short: t('booking.step3Short'), icon: Truck },
      { id: 4, short: t('booking.step4Short'), icon: ListChecks },
    ],
    [t]
  );

  const canGoNext1 = name.trim().length >= 2 && phone.trim().length >= 8 && email.includes('@');
  const canGoNext2 = importedBefore !== null && niche.length > 0;
  const canGoNext3 = serviceType !== null;

  const toggleNiche = (id: string) => {
    setNiche((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const nichesList = [
    { id: 'electronics', label: t('booking.nicheElectronics') },
    { id: 'clothing', label: t('booking.nicheClothing') },
    { id: 'home', label: t('booking.nicheHome') },
    { id: 'auto', label: t('booking.nicheAuto') },
    { id: 'beauty', label: t('booking.nicheBeauty') },
    { id: 'toys', label: t('booking.nicheToys') },
    { id: 'sports', label: t('booking.nicheSports') },
    { id: 'other', label: t('booking.nicheOther') },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from('registrations').insert({
        full_name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        imported_before: importedBefore ?? false,
        niche,
        service_type: serviceType,
      });
      if (error) throw error;
      setPhase('success');
    } catch {
      setPhase('error');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-950 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-shadow';

  const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400';

  return (
    <div
      className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
      dir={dir}
    >
      <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
          >
            <Image
              src={watinexLogo}
              alt="Watinex Logo"
              className="h-8 w-auto max-w-[200px] object-contain object-left dark:brightness-110"
              sizes="200px"
            />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 sm:inline"
            >
              {t('booking.navHome')}
            </Link>
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 pb-16">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0c1f3f] to-blue-600 text-white shadow-lg shadow-blue-900/20">
            <Building2 className="h-7 w-7" aria-hidden />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-3xl">
            {t('booking.pageTitle')}
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400 md:text-base">
            {t('booking.pageSubtitle')}
          </p>
        </div>

        {phase === 'form' && (
          <>
            <nav className="mb-8 flex justify-center gap-2 md:gap-4" aria-label={t('booking.progressAria')}>
              {steps.map((s) => {
                const Icon = s.icon;
                const active = step === s.id;
                const done = step > s.id;
                return (
                  <div
                    key={s.id}
                    className={`flex flex-1 max-w-[140px] flex-col items-center gap-1 rounded-xl border px-2 py-3 text-center transition-colors md:max-w-none md:flex-row md:px-4 ${
                      active
                        ? 'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/40'
                        : done
                          ? 'border-emerald-300 bg-emerald-50/80 dark:border-emerald-800 dark:bg-emerald-950/30'
                          : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/50'
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 md:h-9 md:w-9 shrink-0 items-center justify-center rounded-full text-xs md:text-sm font-bold transition-colors ${
                        done
                          ? 'bg-emerald-600 text-white'
                          : active
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                            : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {done ? <Check className="h-4 w-4" /> : s.id}
                    </span>
                    <span className="text-[10px] font-semibold leading-tight text-slate-700 dark:text-slate-200 md:text-sm">
                      <Icon className="mx-auto mb-0.5 hidden h-3.5 w-3.5 opacity-60 md:inline md:me-1" />
                      {s.short}
                    </span>
                  </div>
                );
              })}
            </nav>

            <form
              onSubmit={step === 4 ? handleSubmit : (e) => e.preventDefault()}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 md:p-8"
            >
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <label htmlFor="bk-name" className={labelClass}>
                      {t('booking.fullName')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="bk-name"
                        type="text"
                        required
                        minLength={2}
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`${inputClass} ps-10`}
                        placeholder={t('booking.fullNamePlaceholder')}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="bk-phone" className={labelClass}>
                      {t('booking.phone')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="bk-phone"
                        type="tel"
                        required
                        minLength={8}
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`${inputClass} ps-10`}
                        placeholder={t('booking.phonePlaceholder')}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="bk-email" className={labelClass}>
                      {t('booking.email')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="bk-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`${inputClass} ps-10`}
                        placeholder={t('booking.emailPlaceholder')}
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-fade-in">
                  {/* Imported Before Question */}
                  <fieldset>
                    <legend className={labelClass}>{t('booking.importedBeforeLabel')}</legend>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => setImportedBefore(true)}
                        className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3 px-4 font-bold transition-all ${
                          importedBefore === true
                            ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {importedBefore === true && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                        {t('booking.yes')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setImportedBefore(false)}
                        className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3 px-4 font-bold transition-all ${
                          importedBefore === false
                            ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {importedBefore === false && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                        {t('booking.no')}
                      </button>
                    </div>
                  </fieldset>

                  {/* Niche Selection Dropdown */}
                  <fieldset>
                    <legend className={labelClass}>{t('booking.nicheLabel')}</legend>
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => setNicheDropdownOpen((prev) => !prev)}
                        className="flex w-full items-center justify-between rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        aria-expanded={nicheDropdownOpen}
                      >
                        <span>
                          {niche.length > 0
                            ? `${niche.length} ${t('booking.step2Short')}`
                            : t('booking.nicheLabel')}
                        </span>
                        <span className={`transition-transform ${nicheDropdownOpen ? 'rotate-180' : ''}`}>▾</span>
                      </button>

                      {nicheDropdownOpen && (
                        <div className="mt-2 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-900/70">
                          {nichesList.map((item) => {
                            const isSelected = niche.includes(item.id);
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => toggleNiche(item.id)}
                                className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-start font-semibold text-sm transition-all ${
                                  isSelected
                                    ? 'border-blue-600 bg-blue-50 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200'
                                    : 'border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300'
                                }`}
                              >
                                <span>{item.label}</span>
                                <span
                                  className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                                    isSelected
                                      ? 'border-blue-600 bg-blue-600 text-white'
                                      : 'border-slate-300 dark:border-slate-600'
                                  }`}
                                  aria-hidden
                                >
                                  {isSelected ? <Check className="h-3.5 w-3.5" /> : null}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </fieldset>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <fieldset>
                    <legend className={`${labelClass} mb-4 text-base`}>{t('booking.serviceLabel')}</legend>
                    <div className="space-y-4 mt-2">
                      <label
                        className={`flex cursor-pointer gap-4 rounded-xl border-2 p-4 sm:p-5 transition-all ${
                          serviceType === 'SHIPPING'
                            ? 'border-blue-600 bg-blue-50/80 dark:border-blue-500 dark:bg-blue-900/30'
                            : 'border-slate-200 hover:border-blue-300 dark:border-slate-700 dark:hover:border-slate-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="serviceType"
                          checked={serviceType === 'SHIPPING'}
                          onChange={() => setServiceType('SHIPPING')}
                          className="mt-1 h-5 w-5 border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Truck className={`w-5 h-5 ${serviceType === 'SHIPPING' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`} />
                            <span className="block font-bold text-slate-900 dark:text-white">{t('booking.serviceShipping')}</span>
                          </div>
                        </div>
                      </label>

                      <label
                        className={`flex cursor-pointer gap-4 rounded-xl border-2 p-4 sm:p-5 transition-all ${
                          serviceType === 'SOURCING'
                            ? 'border-blue-600 bg-blue-50/80 dark:border-blue-500 dark:bg-blue-900/30'
                            : 'border-slate-200 hover:border-blue-300 dark:border-slate-700 dark:hover:border-slate-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="serviceType"
                          checked={serviceType === 'SOURCING'}
                          onChange={() => setServiceType('SOURCING')}
                          className="mt-1 h-5 w-5 border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Search className={`w-5 h-5 ${serviceType === 'SOURCING' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`} />
                            <span className="block font-bold text-slate-900 dark:text-white">{t('booking.serviceSourcing')}</span>
                          </div>
                        </div>
                      </label>
                    </div>
                  </fieldset>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-3">
                    {t('booking.summaryTitle')}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                        <span className="block text-xs font-bold text-slate-500 uppercase">{t('booking.summaryName')}</span>
                        <span className="block mt-1 font-semibold text-slate-900 dark:text-white">{name}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                        <span className="block text-xs font-bold text-slate-500 uppercase">{t('booking.summaryPhone')}</span>
                        <span className="block mt-1 font-semibold text-slate-900 dark:text-white" dir="ltr">{phone}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                      <span className="block text-xs font-bold text-slate-500 uppercase">{t('booking.summaryEmail')}</span>
                      <span className="block mt-1 font-semibold text-slate-900 dark:text-white">{email}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                        <span className="block text-xs font-bold text-slate-500 uppercase">{t('booking.summaryImported')}</span>
                        <span className="block mt-1 font-semibold text-slate-900 dark:text-white">
                          {importedBefore ? t('booking.yes') : t('booking.no')}
                        </span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                        <span className="block text-xs font-bold text-slate-500 uppercase">{t('booking.summaryService')}</span>
                        <span className="block mt-1 font-semibold text-blue-600 dark:text-blue-400">
                          {serviceType === 'SHIPPING' ? t('booking.serviceShipping') : t('booking.serviceSourcing')}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                      <span className="block text-xs font-bold text-slate-500 uppercase">{t('booking.summaryNiche')}</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {niche.map(id => {
                          const label = nichesList.find(n => n.id === id)?.label;
                          return (
                            <span key={id} className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800">
                              {label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-4">
                    <input
                      type="checkbox"
                      checked={detailsConfirmed}
                      onChange={(e) => setDetailsConfirmed(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {t('booking.confirmBeforeSubmit')}
                    </span>
                  </label>

                  <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-6">{t('booking.privacyNote')}</p>
                </div>
              )}

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row sm:justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (step === 4) setDetailsConfirmed(false);
                      setStep((s) => Math.max(1, s - 1));
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                  >
                    {dir === 'rtl' ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                    {t('booking.back')}
                  </button>
                ) : (
                  <span />
                )}
                
                {step < 4 ? (
                  <button
                    type="button"
                    disabled={
                      (step === 1 && !canGoNext1) ||
                      (step === 2 && !canGoNext2) ||
                      (step === 3 && !canGoNext3)
                    }
                    onClick={() => {
                      if (step === 3) setDetailsConfirmed(false);
                      setStep((s) => Math.min(4, s + 1));
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('booking.next')}
                    {dir === 'rtl' ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting || !detailsConfirmed}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition-all disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                    {t('booking.submit')}
                  </button>
                )}
              </div>
            </form>
          </>
        )}

        {phase === 'success' && (
          <div className="rounded-2xl border border-emerald-200 bg-white p-10 text-center shadow-xl dark:border-emerald-900/50 dark:bg-slate-900 animate-fade-in-up">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 ring-8 ring-emerald-50 dark:ring-emerald-900/20">
              ✓
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{t('booking.successTitle')}</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-md mx-auto text-lg leading-relaxed font-medium">
              {t('booking.successBody')}
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-lg hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all"
            >
              <ArrowRight className={`h-4 w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              {t('booking.navHome')}
            </Link>
          </div>
        )}

        {phase === 'error' && (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-xl dark:border-red-900/50 dark:bg-slate-900">
            <p className="text-slate-700 dark:text-slate-300">{t('booking.errorNetwork')}</p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => {
                  setPhase('form');
                }}
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg"
              >
                {t('booking.retry')}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
