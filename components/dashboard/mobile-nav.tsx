"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/logo-mark";
import { useAuthStore } from "@/lib/store/auth-store";
import type { NavItem } from "./sidebar";

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

const panelVariants: Variants = {
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

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function DashboardMobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  // جلوگیری از اسکرول صفحه وقتی منو باز است
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
      {/* هدر موبایل */}
      <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between border-b border-line bg-bg/90 backdrop-blur-xl px-5 py-4">
         <button
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-ink hover:bg-ink/5 transition-colors"
          aria-label="باز کردن منو"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-extrabold"
        >
          <LogoMark className="h-7 w-7 rounded-[8px]" />
          استاد موزیک
        </Link>

     
      </div>

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

            {/* Panel - از سمت راست باز می‌شود */}
            <motion.aside
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-y-0 right-0 z-[210] flex w-[min(86vw,340px)] flex-col bg-bg/98 shadow-[-12px_0_40px_rgba(0,0,0,0.18)] border-l border-line/80 lg:hidden"
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
                      پنل استاد
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
                  {items.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <motion.li key={item.href} variants={itemVariants}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-[0.95rem] font-medium transition-all duration-200",
                            active
                              ? "bg-gold/10 text-gold"
                              : "text-ink/80 hover:bg-gold/10 hover:text-ink"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-5 w-5 shrink-0",
                              active ? "text-gold" : "text-ink/60 group-hover:text-ink"
                            )}
                          />
                          <span className="flex-1">{item.label}</span>
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full transition-all duration-300",
                              active
                                ? "bg-gold scale-125"
                                : "bg-gold/0 group-hover:bg-gold group-hover:scale-125"
                            )}
                          />
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </motion.nav>

              {/* Footer */}
              <div className="shrink-0 space-y-3 border-t border-line/70 bg-ink/[0.015] p-4">
                {user && (
                  <div className="rounded-2xl border border-line/80 bg-bg px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold">
                        <span className="text-sm font-bold">
                          {user.firstName?.[0]}
                          {user.lastName?.[0]}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-bold">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="mt-1 inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-amber-500/15 text-amber-400">
                          استاد
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  className="w-full flex items-center justify-center gap-2.5 rounded-2xl border border-red-500/25 py-3.5 text-[0.95rem] font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                  onClick={() => {
                    logout();
                    setOpen(false);
                    router.push("/");
                  }}
                >
                  <LogOut className="h-4.5 w-4.5" />
                  خروج از حساب
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}