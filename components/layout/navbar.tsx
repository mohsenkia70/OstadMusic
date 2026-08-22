"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ShoppingBag,
  User,
  Home,
  Users,
  BookOpen,
  HelpCircle,
  Info,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import { useAuthStore } from "@/lib/store/auth-store";
import { LogoMark } from "@/components/logo-mark";
import { cn } from "@/lib/utils";


const desktopLinks = [
  { href: "/teachers", label: "اساتید" },
  { href: "/shop", label: "فروشگاه" },
  { href: "/blog", label: "وبلاگ" },
  { href: "/faq", label: "سوالات متداول" },
  { href: "/about", label: "درباره ما" },
];


const bottomNavItems = [
  { href: "/", label: "خانه", icon: Home },
  { href: "/teachers", label: "اساتید", icon: Users },
  { href: "/shop", label: "فروشگاه", icon: ShoppingBag },
  { href: "/blog", label: "وبلاگ", icon: BookOpen },
];

function normalizeRole(role: string | undefined | null): string {
  return (role ?? "").toLowerCase();
}

function getDashboardPath(role: string): string {
  switch (role) {
    case "admin":
      return "/dashboard/admin/teachers";
    case "teacher":
      return "/dashboard/teacher";
    case "student":
      return "/dashboard/student";
    default:
      return "/";
  }
}

function getRoleLabel(role: string): string {
  switch (role) {
    case "admin":
      return "ادمین";
    case "teacher":
      return "استاد";
    case "student":
      return "هنرجو";
    default:
      return "کاربر";
  }
}

function getRoleBadgeClasses(role: string): string {
  switch (role) {
    case "admin":
      return "bg-purple-500/20 text-purple-400";
    case "teacher":
      return "bg-amber-500/20 text-amber-400";
    case "student":
      return "bg-sky-500/20 text-sky-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const { totalCount, openCart } = useCart();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const role = normalizeRole(user?.role);
  const dashboardPath = getDashboardPath(role);
  const roleLabel = getRoleLabel(role);
  const roleBadgeClasses = getRoleBadgeClasses(role);
  const isAdmin = role === "admin";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
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

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[100] flex items-center justify-between px-4 md:px-8 transition-all duration-300",
          scrolled
            ? "bg-bg/75 backdrop-blur-xl border-b border-line py-3"
            : "bg-gradient-to-b from-bg/70 to-transparent py-4"
        )}
      >

        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-xl font-extrabold"
        >
          <LogoMark className="h-8 w-8" />
          <span className="hidden sm:inline">استاد موزیک</span>
        </Link>


        <div className="hidden lg:flex items-center gap-7 text-[0.95rem] text-muted">
          {desktopLinks.map((l) => (
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

   
        <div className="flex items-center gap-2">
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


          <div className="hidden lg:block">
            {user === null ? (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">ورود</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/signup">ثبت‌ نام</Link>
                </Button>
              </div>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-ink/85 hover:bg-ink/5 hover:text-ink transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden xl:inline">{user?.firstName}</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-0 top-full mt-2 w-56 rounded-2xl border border-line bg-bg/95 backdrop-blur-xl shadow-xl overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-line">
                        <div className="font-bold text-sm">
                          {user.firstName} {user.lastName}
                        </div>
                        <div
                          className={`mt-1.5 inline-flex rounded-full px-2.5 py-0.5 text-xs ${roleBadgeClasses}`}
                        >
                          {roleLabel}
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
                            href={dashboardPath}
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <LayoutDashboard className="h-4 w-4 ml-2" />
                            {isAdmin ? "پنل مدیریت" : "پنل کاربری"}
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
                          <LogOut className="h-4 w-4 ml-2" />
                          خروج
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>


          <div className="lg:hidden">
            {user === null ? (
              <Link
                href="/login"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-ink/85 hover:text-gold hover:bg-ink/5 transition-colors"
              >
                <User className="h-5 w-5" />
              </Link>
            ) : (
              <Link
                href={dashboardPath}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-ink/85 hover:text-gold hover:bg-ink/5 transition-colors"
              >
                <User className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </header>


      <nav className="fixed bottom-0 inset-x-0 z-[100] lg:hidden">
        <div className="mx-2 mb-2 rounded-2xl border border-line/80 bg-bg/95 backdrop-blur-xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] overflow-hidden">
          <div className="flex items-center justify-between px-1.5 py-2">
            {bottomNavItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-1"
                >
                  <motion.div
                    className={cn(
                      "relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                      active ? "text-gold" : "text-ink/60 hover:text-ink"
                    )}
                    whileTap={{ scale: 0.88 }}
                  >
                    {active && (
                      <motion.span
                        layoutId="bottom-nav-active"
                        className="absolute inset-0 rounded-xl bg-gold/15"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <Icon
                      className={cn(
                        "h-5 w-5 relative z-10 transition-transform",
                        active && "scale-110"
                      )}
                      strokeWidth={active ? 2.4 : 1.9}
                    />
                  </motion.div>

                  <span
                    className={cn(
                      "text-[10px] font-medium transition-colors",
                      active ? "text-gold" : "text-ink/55"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}

   
            <button
              onClick={openCart}
              className="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-1"
            >
              <motion.div
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-ink/60 hover:text-ink"
                whileTap={{ scale: 0.88 }}
              >
                <ShoppingBag className="h-5 w-5" strokeWidth={1.9} />
                {totalCount > 0 && (
                  <span className="absolute -top-0.5 -end-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-[#181209]">
                    {totalCount > 9 ? "۹+" : totalCount.toLocaleString("fa-IR")}
                  </span>
                )}
              </motion.div>
              <span className="text-[10px] font-medium text-ink/55">سبد</span>
            </button>
          </div>
        </div>
      </nav>


      <div className="h-20 lg:hidden" />
    </>
  );
}