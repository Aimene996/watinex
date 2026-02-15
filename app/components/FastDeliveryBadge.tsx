"use client";

import { useLanguage } from "../providers/LanguageProvider";

export function FastDeliveryBadge() {
  const { t } = useLanguage();

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/50 dark:via-yellow-950/50 dark:to-orange-950/50 border-2 border-amber-300/50 dark:border-amber-700/50 px-4 py-2 shadow-sm">
      <svg className="h-4 w-4 text-amber-600 dark:text-amber-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M11.3 1.046a1 1 0 01.14 1.052L8.5 7.5l5.5 1.5a1 1 0 01.5 1.5l-5.5 1.5-2.9 5.402a1 1 0 01-1.052.14l-3.5-1.5a1 1 0 01-.5-1.5l2.9-5.402L1.3 3.046a1 1 0 01.14-1.052l3.5-1.5a1 1 0 011.052-.14l3.5 1.5a1 1 0 01.5 1.5l-2.9 5.402L11.3 1.046z" clipRule="evenodd" />
      </svg>
      <span className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-300 tracking-wide">
        {t("fastDelivery.badge")}
      </span>
    </div>
  );
}
