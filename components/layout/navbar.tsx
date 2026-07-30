"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
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

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.25, ease: "easeIn" } },
};

const panelVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: {
      type: "spring",
      damping: 32,
      stiffness: 320,
      mass: 0.8,
    },
  },
  exit: {
    x: "100%",
    transition: {
      type: "spring",
      damping: 36,
      stiffness: 380,
      mass: 0.7,
    },
  },
};

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { totalCount, openCart } = useCart();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const isTeacher = user?.role === "Teacher";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav
        className={cn(
          "fixed inset-x-0 top-0 z-[100] flex items-center justify-between px-6 md:px-10 transition-all duration-300",
          scrolled
            ? "bg-bg/75 backdrop-blur-xl border-b border-line py-3.5"
            : "bg-gradient-to-b from-bg/70 to-transparent py-5",
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-xl font-extrabold"
        >
          <LogoMark className="h-8 w-8" />
          استاد موزیک
        </Link>

        <div className="hidden lg:flex items-center gap-9 text-[0.95rem] text-muted">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative transition-colors hover:text-ink group"
            >
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

          {user === null ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">ورود</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">حساب کاربری</Link>
              </Button>
            </>
          ) : (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-ink/85 hover:text-gold hover:bg-ink/5 transition-colors"
                aria-label="منوی کاربر"
              >
                <User className="h-5 w-5" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute end-0 top-full mt-2 w-56 rounded-2xl border border-line bg-bg/95 backdrop-blur-xl shadow-xl overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-line">
                      <div className="font-bold text-sm">
                        {user.firstName} {user.lastName}
                      </div>
                      <div
                        className={`mt-1.5 inline-flex rounded-full px-2.5 py-0.5 text-xs ${
                          isTeacher
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-sky-500/20 text-sky-400"
                        }`}
                      >
                        {isTeacher ? "استاد" : "هنرجو"}
                      </div>
                    </div>

                    <div className="p-2 flex flex-col gap-1">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="justify-start"
                      >
                        <Link
                          href={
                            isTeacher
                              ? "/dashboard/teacher"
                              : "/dashboard/student"
                          }
                          onClick={() => setUserMenuOpen(false)}
                        >
                          پنل کاربری
                        </Link>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                          router.push("/");
                        }}
                      >
                        خروج
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <button
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl text-ink hover:bg-ink/5 transition-colors order-first"
          onClick={() => setOpen(true)}
          aria-label="باز کردن منو"
        >
          <Menu className="h-6 w-6" />
        </button>
      </nav>

      {/* منوی موبایل */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-[200] bg-black/55 backdrop-blur-[6px] lg:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.aside
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-y-0 right-0 z-[210] flex w-[min(86vw,340px)] flex-col bg-bg/98 shadow-[ -12px_0_40px_rgba(0,0,0,0.18)] border-l border-line/80 lg:hidden"
            >
              {/* Header */}
              <div className="relative flex items-center justify-between px-5 py-5 border-b border-line/70">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
                    <LogoMark className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-display text-[1.05rem] font-extrabold leading-none">
                      استاد موزیک
                    </div>
                    <div className="mt-1 text-[11px] text-muted">
                      منوی اصلی
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/5 text-ink/70 transition-all hover:bg-ink/10 hover:text-ink active:scale-95"
                  aria-label="بستن منو"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Links */}
              <motion.nav
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 overflow-y-auto px-3 py-5"
              >
                <ul className="space-y-1">
                  {links.map((l) => (
                    <motion.li key={l.href} variants={itemVariants}>
                      <Link
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className="group flex items-center justify-between rounded-2xl px-4 py-3.5 text-[0.95rem] font-medium text-ink/80 transition-all duration-200 hover:bg-gold/10 hover:text-ink"
                      >
                        <span>{l.label}</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-gold/0 transition-all duration-300 group-hover:bg-gold group-hover:scale-125" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.nav>

              {/* Footer */}
              <div className="shrink-0 space-y-3 border-t border-line/70 bg-ink/[0.015] p-4">
                <Button
                  variant="glass"
                  className="w-full justify-center gap-2.5 rounded-2xl py-5 text-[0.95rem]"
                  onClick={() => {
                    setOpen(false);
                    openCart();
                  }}
                >
                  <ShoppingBag className="h-4.5 w-4.5" />
                  سبد خرید
                  {totalCount > 0 && (
                    <span className="ms-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[11px] font-bold text-[#181209]">
                      {totalCount.toLocaleString("fa-IR")}
                    </span>
                  )}
                </Button>

                {!user ? (
                  <div className="grid grid-cols-2 gap-2.5">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-2xl py-5"
                    >
                      <Link href="/login" onClick={() => setOpen(false)}>
                        ورود
                      </Link>
                    </Button>
                    <Button asChild className="w-full rounded-2xl py-5">
                      <Link href="/signup" onClick={() => setOpen(false)}>
                        ثبت‌نام
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-line/80 bg-bg px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-bold">
                            {user.firstName} {user.lastName}
                          </div>
                          <div
                            className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                              isTeacher
                                ? "bg-amber-500/15 text-amber-400"
                                : "bg-sky-500/15 text-sky-400"
                            }`}
                          >
                            {isTeacher ? "استاد" : "هنرجو"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button asChild className="w-full rounded-2xl py-5">
                      <Link
                        href={
                          isTeacher
                            ? "/dashboard/teacher"
                            : "/dashboard/student"
                        }
                        onClick={() => setOpen(false)}
                      >
                        پنل کاربری
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full rounded-2xl py-5 text-red-400 border-red-500/25 hover:bg-red-500/10 hover:text-red-300"
                      onClick={() => {
                        logout();
                        setOpen(false);
                        router.push("/");
                      }}
                    >
                      خروج از حساب
                    </Button>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}