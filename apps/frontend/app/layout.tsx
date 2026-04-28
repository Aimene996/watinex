import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers/Providers";
import { SplashScreen } from "./components/SplashScreen";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "WATINEX - Import Services from China & Dubai | Algeria",
  description: "Professional import services from China and Dubai for Algerian e-commerce businesses. Reliable sourcing, logistics coordination, and personalized support for your import needs.",
  keywords: "import Algeria, China import, Dubai import, e-commerce import, sourcing Algeria",
};

const DEFAULT_LOCALE = "ar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={DEFAULT_LOCALE} dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} antialiased`} suppressHydrationWarning>
        <SplashScreen />
        <Providers initialLocale={DEFAULT_LOCALE}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
