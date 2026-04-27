'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import watinexLogo from './logo vertical.png';
import Link from 'next/link';
import {
  Menu,
  X,
  MessageCircle,
  Plus,
  Minus,
  ClipboardList,
  Send,
} from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ExpertiseCards } from './components/ExpertiseCards';
import { MissionBanner } from './components/MissionBanner';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ServicesDetail } from './components/ServicesDetail';
import { ProcessSteps } from './components/ProcessSteps';
import { MetricsStrip } from './components/MetricsStrip';
import { TestimonialsRow } from './components/TestimonialsRow';
import { ContactCTA } from './components/ContactCTA';
import { Footer } from './components/Footer';
import { StickyActionBar } from './components/StickyActionBar';
import { FinancingAlert } from './components/FinancingAlert';
import { FreeConsultationPopup } from './components/FreeConsultationPopup';
import { useLanguage } from './providers/LanguageProvider';

export default function WatinexLanding() {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const whatsappNumber = '+213794964029';
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\+/g, '')}`;
  const telegramGroupUrl = process.env.NEXT_PUBLIC_TELEGRAM_GROUP_URL ?? 'https://t.me/watinex';
  const adminAppUrl = process.env.NEXT_PUBLIC_ADMIN_APP_URL ?? 'https://watinex-panel-admin.vercel.app';
  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? 'admin@your-company.com')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2500);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedEmail = loginEmail.trim().toLowerCase();
    if (!normalizedEmail) return;

    const isAdminEmail =
      adminEmails.includes(normalizedEmail) || normalizedEmail.startsWith('admin@');

    if (!isAdminEmail) {
      setLoginModalOpen(false);
      setMobileMenuOpen(false);
      setLoginEmail('');
      setLoginPassword('');
      setToastMessage('User access is coming soon');
      return;
    }

    // Frontend and admin run on separate domains, so auth must happen in admin app.
    setLoginModalOpen(false);
    setMobileMenuOpen(false);
    setLoginEmail('');
    setLoginPassword('');
    window.location.href = adminAppUrl;
  };

  const navLinks = [
    { key: 'nav.about', href: '#about' },
    { key: 'nav.services', href: '#services' },
    { key: 'nav.process', href: '#process' },
    { key: 'nav.contact', href: '#contact' },
  ];

  const faqs = [
    { questionKey: 'landing.faqQ1', answerKey: 'landing.faqA1' },
    { questionKey: 'landing.faqQ2', answerKey: 'landing.faqA2' },
    { questionKey: 'landing.faqQ3', answerKey: 'landing.faqA3' },
    { questionKey: 'landing.faqQ4', answerKey: 'landing.faqA4' },
    { questionKey: 'landing.faqQ5', answerKey: 'landing.faqA5' },
  ];
  return (
    <>
      <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300">

        {/* ─── Navbar ─── */}
        <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center h-16 lg:h-18">
              {/* Logo */}
              <Link href="/" className="flex items-center shrink-0">
                <Image
                  src={watinexLogo}
                  alt="WATINEX"
                  className="h-9 w-auto lg:h-11 object-contain"
                  priority
                  sizes="280px"
                />
              </Link>

              {/* Desktop nav */}
              <div className="hidden lg:flex items-center gap-6">
                {navLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {t(link.key)}
                  </a>
                ))}
              </div>

              {/* Right side actions */}
              <div className="flex items-center gap-2">
                <Link
                  href="/booking"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 px-3 py-2 text-sm font-bold text-slate-800 dark:text-slate-100 shadow-sm hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                >
                  <ClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  {t('nav.register')}
                </Link>
                <LanguageSwitcher />
                <ThemeToggle />

                {/* Mobile hamburger */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu dropdown */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50 shadow-lg">
              <div className="px-4 py-4 space-y-3">
                {navLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-base font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 py-2"
                  >
                    {t(link.key)}
                  </a>
                ))}
                <div className="flex gap-2 pt-2">
                  <Link
                    href="/booking"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center rounded-xl bg-blue-600 text-white px-4 py-2.5 text-sm font-bold"
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* ─── Hero ─── */}
        <HeroSection whatsappLink={whatsappLink} />

        {/* ─── 75% Financing Alert ─── */}
        <FinancingAlert />
        <section className="px-4 pt-2 pb-6">
          <div className="mx-auto max-w-6xl text-center">
            <Link
              href={telegramGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-sky-500 to-sky-700 px-8 py-4 text-sm font-extrabold uppercase tracking-wide text-white shadow-[0_8px_0_0_#0369a1,0_18px_30px_-14px_rgba(2,132,199,0.8)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_10px_0_0_#0369a1,0_22px_34px_-14px_rgba(2,132,199,0.85)] active:translate-y-1 active:shadow-[0_4px_0_0_#0369a1,0_12px_24px_-14px_rgba(2,132,199,0.75)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
            >
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              Join Telegram Group
            </Link>
          </div>
        </section>

        {/* ─── About Us ─── */}
        <AboutSection />

        {/* ─── Expertise Cards ─── */}
        <ExpertiseCards />

        {/* ─── Mission Banner ─── */}
        <MissionBanner />

        {/* ─── Why Choose Us ─── */}
        <WhyChooseUs />

        {/* ─── Team ─── */}
        {/* <TeamSection /> */}

        {/* ─── Services Detail ─── */}
        <ServicesDetail />

        {/* ─── Process Steps ─── */}
        <ProcessSteps />

        {/* ─── Metrics Strip ─── */}
        <MetricsStrip />

        {/* ─── Testimonials ─── */}
        <TestimonialsRow />

        {/* ─── FAQ ─── */}
        <section className="relative z-10 py-16 lg:py-24 px-4 bg-white dark:bg-slate-950">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">
                {t('landing.faqTitle')}
              </h2>
              <span className="section-title-underline" />
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                {t('landing.faqSubtitle')}
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="card-accent-left bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <span className="font-semibold text-lg text-slate-900 dark:text-white pe-4">
                      {t(faq.questionKey)}
                    </span>
                    {openFAQ === index ? (
                      <Minus className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    ) : (
                      <Plus className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFAQ === index ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <div className="px-6 pb-5 text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-4">
                      {t(faq.answerKey)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Contact CTA ─── */}
        <ContactCTA whatsappLink={whatsappLink} />

        {/* ─── Footer ─── */}
        <Footer />

        {/* ─── Floating WhatsApp Button ─── */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 left-6 z-50 bg-[#25d366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 whatsapp-glow"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-7 h-7" />
        </a>
      </div>

      {toastMessage && (
        <div className="fixed right-4 top-20 z-[70] rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800 shadow-lg dark:border-amber-700 dark:bg-amber-950/80 dark:text-amber-200">
          {toastMessage}
        </div>
      )}

      {loginModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Login</h3>
              <button
                type="button"
                onClick={() => setLoginModalOpen(false)}
                className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Close login"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <input
                type="email"
                required
                autoFocus
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      )}

      <StickyActionBar whatsappLink={whatsappLink} />
      <FreeConsultationPopup />
    </>
  );
}