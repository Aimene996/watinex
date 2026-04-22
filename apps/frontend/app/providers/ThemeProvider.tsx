"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

const STORAGE_KEY = "theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      storageKey={STORAGE_KEY}
    >
      {children}
    </NextThemesProvider>
  );
}
