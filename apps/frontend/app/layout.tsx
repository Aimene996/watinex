import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("locale")?.value;
  const initialLocale = localeCookie === "en" || localeCookie === "ar" || localeCookie === "fr" ? localeCookie : "ar";
  const dir = initialLocale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={initialLocale} dir={dir} suppressHydrationWarning>
      <body className={`${cairo.variable} antialiased`} suppressHydrationWarning>
        <SplashScreen />
        <Providers initialLocale={initialLocale}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
