'use client';

import { Ship, Plane, MapPin } from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';

export function Hero3DVisual() {
  const { t } = useLanguage();

  return (
    <div className="relative w-full h-[350px] lg:h-[500px] flex items-center justify-center [perspective:1200px] mt-8 lg:mt-0">
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 [transform-style:preserve-3d] animate-float-3d group cursor-pointer">
        
        {/* Base glow */}
        <div className="absolute -inset-10 bg-cyan-500/30 blur-[60px] rounded-full [transform:translateZ(-150px)] opacity-50 group-hover:opacity-80 transition-opacity duration-500" />

        {/* Bottom Card - China */}
        <div className="absolute inset-0 bg-[#0f2a47]/80 backdrop-blur-md border border-blue-500/40 rounded-2xl shadow-2xl [transform:translateZ(-70px)] flex flex-col items-center justify-center gap-3 transition-transform duration-500 group-hover:[transform:translateZ(-90px)]">
          <div className="bg-blue-500/20 p-3 rounded-full border border-blue-400/30">
            <Ship className="w-8 h-8 text-blue-300" />
          </div>
          <span className="text-white font-bold text-sm tracking-wider uppercase drop-shadow-md">
            {t('hero.titleHighlight').split(' ')[0] || 'الصين'}
          </span>
        </div>

        {/* Middle Card - Dubai */}
        <div className="absolute inset-0 bg-[#132d5e]/80 backdrop-blur-md border border-cyan-500/40 rounded-2xl shadow-2xl [transform:translateZ(10px)] flex flex-col items-center justify-center gap-3 transition-transform duration-500 group-hover:[transform:translateZ(20px)]">
          <div className="bg-cyan-500/20 p-3 rounded-full border border-cyan-400/30">
            <Plane className="w-8 h-8 text-cyan-300" />
          </div>
          <span className="text-white font-bold text-sm tracking-wider uppercase drop-shadow-md">
            {t('hero.titleHighlight').split(' ')[2] || 'دبي'}
          </span>
        </div>

        {/* Top Card - Algeria */}
        <div className="absolute inset-0 bg-blue-600/80 backdrop-blur-md border border-emerald-400/50 rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.4)] [transform:translateZ(90px)] flex flex-col items-center justify-center gap-3 transition-transform duration-500 group-hover:[transform:translateZ(130px)]">
          <div className="bg-emerald-500/20 p-3 rounded-full border border-emerald-400/30">
            <MapPin className="w-8 h-8 text-emerald-300" />
          </div>
          <span className="text-white font-bold text-sm tracking-wider uppercase drop-shadow-md">
            {t('footer.algeria')}
          </span>
        </div>

        {/* Vertical Connecting Line */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 bg-gradient-to-t from-blue-400/0 via-cyan-300/50 to-emerald-400/0 [transform:translateZ(10px)_rotateX(90deg)] h-[200px]" />
      </div>
    </div>
  );
}
