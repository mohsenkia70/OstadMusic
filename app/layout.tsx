import type { Metadata } from "next";
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
import { SmoothScrollProvider } from "@/components/layout/smooth-scroll-provider";
import { CartProvider } from "@/components/cart/cart-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";

export const metadata: Metadata = {
  title: "استاد موزیک | همراه شما در مسیر ویولن",
  description:
    "استاد موزیک هنرجو مشتاق ویولن را به بهترین اساتید ایران وصل می‌کند؛ آنلاین یا حضوری، از اولین جلسه تا اجرای صحنه‌ای.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-bg text-ink antialiased">
        <SmoothScrollProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
