'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import watinexLogo from '../logo vertical.png';

export function SplashScreen() {
  const [show, setShow] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // 1. Simulate data/video loading time (e.g. 2.5 seconds)
    const timer = setTimeout(() => {
      // 2. Start fade out animation
      setIsFading(true);
      
      // 3. Unmount completely after fade finishes (500ms)
      setTimeout(() => {
        setShow(false);
      }, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#061224] transition-all duration-500 overflow-hidden ${
        isFading ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
    >
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 blur-[100px] rounded-full animate-pulse-slow pointer-events-none" />

      {/* 3D Animated Logo Container */}
      <div className="relative [perspective:1000px] z-10">
        <div className="animate-splash-flip [transform-style:preserve-3d]">
          <Image
            src={watinexLogo}
            alt="Watinex"
            className="w-48 md:w-64 h-auto drop-shadow-[0_0_30px_rgba(37,99,235,0.4)]"
            priority
          />
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="absolute bottom-20 flex flex-col items-center gap-3 animate-fade-in delay-500">
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></div>
        </div>
        <span className="text-blue-200/60 text-xs tracking-widest uppercase font-semibold">
          Loading Data...
        </span>
      </div>
    </div>
  );
}
