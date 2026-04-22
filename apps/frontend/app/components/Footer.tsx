'use client';

import Image from 'next/image';
import watinexLogo from '../logo vertical.png';
import { useLanguage } from '../providers/LanguageProvider';

export function Footer() {
  const { t } = useLanguage();

  const links = [
    { key: 'footer.aboutUs', href: '#about' },
    { key: 'footer.services', href: '#services' },
    { key: 'footer.howWeWork', href: '#process' },
    { key: 'footer.whyUs', href: '#why-us' },
  ];

  return (
    <footer className="relative z-10 bg-[#0a1628] text-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Logo + tagline */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src={watinexLogo}
              alt="WATINEX"
              className="h-12 w-auto object-contain opacity-90"
              sizes="200px"
            />
          </div>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            {t('footer.tagline')}
          </p>
        </div>

        {/* Nav links */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="text-blue-400 hover:text-cyan-300 text-sm font-semibold transition-colors"
            >
              {t(link.key)}
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-6 text-center">
          <p className="text-slate-500 text-sm">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
