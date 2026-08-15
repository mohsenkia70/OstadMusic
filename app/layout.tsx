import type { Metadata, Viewport } from "next";
import "@fontsource/vazirmatn/arabic-400.css";
import "@fontsource/vazirmatn/arabic-500.css";
import "@fontsource/vazirmatn/arabic-600.css";
import "@fontsource/vazirmatn/arabic-700.css";
import "@fontsource/vazirmatn/arabic-800.css";
import "@fontsource/vazirmatn/arabic-900.css";

import "@fontsource/estedad/arabic-300.css";
import "@fontsource/estedad/arabic-400.css";
import "@fontsource/estedad/arabic-500.css";
import "@fontsource/estedad/arabic-600.css";

import "./globals.css";

import { Toaster } from "sonner";

import { SmoothScrollProvider } from "@/components/layout/smooth-scroll-provider";
import { CartProvider } from "@/components/cart/cart-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { PWAProvider } from "@/components/pwa/pwa-provider"; // این کامپوننت را در قدم بعد می‌سازیم

export const metadata: Metadata = {
  title: "استاد موزیک | همراه شما هستیم در مسیر موسیقی",
  description:
    "استاد موزیک هنرجو مشتاق هر سازی را به بهترین اساتید ایران وصل می‌کند؛ آنلاین یا حضوری، از اولین جلسه تا اجرای صحنه‌ای.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "استاد موزیک",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="استاد موزیک" />
      </head>
      <body className="bg-bg text-ink antialiased">
        <SmoothScrollProvider>
          <CartProvider>
            <PWAProvider>
              {children}
              <CartDrawer />
              <Toaster
                position="top-center"
                dir="rtl"
                richColors
                closeButton
              />
            </PWAProvider>
          </CartProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}