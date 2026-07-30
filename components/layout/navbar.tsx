"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import { LogoMark } from "@/components/logo-mark";
import { cn } from "@/lib/utils";

const links = [
  { href: "/teachers", label: "اساتید" },
  { href: "/shop", label: "فروشگاه" },
  { href: "/#how", label: "چگونه کار می‌کند" },
  { href: "/blog", label: "وبلاگ" },
  { href: "/faq", label: "سوالات متداول" },
  { href: "/about", label: "درباره ما" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { totalCount, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-[100] flex items-center justify-between px-6 md:px-10 transition-all duration-300",
        scrolled
          ? "bg-bg/75 backdrop-blur-xl border-b border-line py-3.5"
          : "bg-gradient-to-b from-bg/70 to-transparent py-5"
      )}
    >
      <Link href="/" className="flex items-center gap-2.5 font-display text-xl font-extrabold">
        <LogoMark className="h-8 w-8" />
        استاد موزیک
      </Link>

      <div className="hidden lg:flex items-center gap-9 text-[0.95rem] text-muted">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="relative transition-colors hover:text-ink group">
            {l.label}
            <span className="absolute -bottom-1 right-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
          </Link>
        ))}
      </div>

      <div className="hidden lg:flex items-center gap-3">
        <button
          onClick={openCart}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-ink/85 hover:text-gold transition-colors"
          aria-label="سبد خرید"
        >
          <ShoppingBag className="h-5 w-5" />
          {totalCount > 0 && (
            <span className="absolute -top-1 -end-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-[#181209]">
              {totalCount.toLocaleString("fa-IR")}
            </span>
          )}
        </button>
        <Button asChild variant="ghost" size="sm">
          <Link href="/login">ورود</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/signup">شروع کن</Link>
        </Button>
      </div>

      <button
        className="lg:hidden text-ink"
        onClick={() => setOpen(true)}
        aria-label="باز کردن منو"
      >
        <Menu className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-bg/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex justify-between items-center px-6 py-5 border-b border-line">
              <span className="font-display text-xl font-extrabold">استاد موزیک</span>
              <button onClick={() => setOpen(false)} aria-label="بستن منو">
                <X className="h-6 w-6" />
              </button>
            </div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col gap-2 p-6"
            >
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-lg border-b border-line text-ink/90"
                >
                  {l.label}
                </Link>
              ))}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="glass"
                  className="flex-1 gap-2"
                  onClick={() => {
                    setOpen(false);
                    openCart();
                  }}
                >
                  <ShoppingBag className="h-4 w-4" />
                  سبد خرید {totalCount > 0 && `(${totalCount.toLocaleString("fa-IR")})`}
                </Button>
              </div>
              <div className="flex gap-3 mt-3">
                <Button asChild variant="glass" className="flex-1">
                  <Link href="/login" onClick={() => setOpen(false)}>ورود</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/signup" onClick={() => setOpen(false)}>شروع کن</Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
