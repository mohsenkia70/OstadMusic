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

  // بستن منوی کاربر با کلیک بیرون
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

  return (
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
              <span className="font-display text-xl font-extrabold">
                استاد موزیک
              </span>
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
                  سبد خرید{" "}
                  {totalCount > 0 && `(${totalCount.toLocaleString("fa-IR")})`}
                </Button>
              </div>

              <div className="flex flex-col gap-3 mt-3">
                {!user ? (
                  <>
                    <Button asChild variant="glass">
                      <Link href="/login" onClick={() => setOpen(false)}>
                        ورود
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href="/signup" onClick={() => setOpen(false)}>
                        شروع کن
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="rounded-xl border border-line p-4 text-center">
                      <div className="font-bold">
                        {user.firstName} {user.lastName}
                      </div>
                      <div
                        className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs ${
                          isTeacher
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-sky-500/20 text-sky-400"
                        }`}
                      >
                        {isTeacher ? "استاد" : "هنرجو"}
                      </div>
                    </div>

                    <Button asChild>
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
                      onClick={() => {
                        logout();
                        setOpen(false);
                        router.push("/");
                      }}
                    >
                      خروج
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}