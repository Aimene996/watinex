"use client";

import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function HeaderToggles() {
  return (
    <div className="fixed top-20 left-4 right-4 z-50 flex justify-end gap-2 sm:top-24 sm:left-6 sm:right-6 md:top-6 md:left-6 md:right-6 pointer-events-none">
      <div className="pointer-events-auto flex gap-2">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
    </div>
  );
}
