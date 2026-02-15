"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../providers/LanguageProvider";

interface FastDeliveryPopupProps {
  onClose: () => void;
}

export function FastDeliveryPopup({ onClose }: FastDeliveryPopupProps) {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    // Show popup after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Animate content in after popup appears
      setTimeout(() => {
        setContentVisible(true);
      }, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md transition-opacity duration-700 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Popup - Bigger */}
      <div className="relative w-full max-w-2xl pointer-events-auto">
        <div className={`bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-amber-200/50 dark:border-amber-800/50 p-8 sm:p-10 transition-all duration-700 ${
          isVisible 
            ? "opacity-100 translate-y-0 scale-100" 
            : "opacity-0 translate-y-8 scale-95"
        }`}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-110"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content with staggered animations */}
          <div className="space-y-6">
            {/* Icon with pulse animation */}
            <div className={`flex items-center justify-center gap-4 transition-all duration-700 delay-100 ${
              contentVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}>
              <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-amber-500/50 animate-pulse">
                <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046a1 1 0 01.14 1.052L8.5 7.5l5.5 1.5a1 1 0 01.5 1.5l-5.5 1.5-2.9 5.402a1 1 0 01-1.052.14l-3.5-1.5a1 1 0 01-.5-1.5l2.9-5.402L1.3 3.046a1 1 0 01.14-1.052l3.5-1.5a1 1 0 011.052-.14l3.5 1.5a1 1 0 01.5 1.5l-2.9 5.402L11.3 1.046z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Title with animation */}
            <div className={`text-center transition-all duration-700 delay-200 ${
              contentVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2">
                {t("fastDelivery.popupTitle")}
              </h2>
              <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-950/50 dark:to-orange-950/50 border-2 border-amber-300 dark:border-amber-700">
                <span className="text-2xl animate-bounce">⚡</span>
                <span className="text-xl font-bold text-amber-700 dark:text-amber-300">
                  {t("fastDelivery.highlight")}
                </span>
              </div>
            </div>

            {/* Message with animation */}
            <div className={`transition-all duration-700 delay-300 ${
              contentVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}>
              <p className="text-lg sm:text-xl leading-relaxed text-slate-700 dark:text-slate-300 text-center px-4">
                {t("fastDelivery.popupMessage")}
              </p>
              {/* Dubai Badge */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <svg className="h-5 w-5 text-cyan-600 dark:text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                  {t("hero.dubai")}
                </span>
                <span className="text-slate-400 dark:text-slate-600">→</span>
                <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {t("footer.algeria")}
                </span>
              </div>
            </div>

            {/* Benefits list with animation */}
            <div className={`space-y-3 transition-all duration-700 delay-400 ${
              contentVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-base text-slate-700 dark:text-slate-300">
                  {t("fastDelivery.benefit1")}
                </p>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-base text-slate-700 dark:text-slate-300">
                  {t("fastDelivery.benefit2")}
                </p>
              </div>
            </div>

            {/* Cancel Button */}
            <div className={`flex justify-center pt-4 transition-all duration-700 delay-500 ${
              contentVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}>
              <button
                onClick={onClose}
                className="rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-8 py-4 text-base font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-[1.02] hover:border-slate-400 dark:hover:border-slate-600"
              >
                {t("fastDelivery.cancel")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
