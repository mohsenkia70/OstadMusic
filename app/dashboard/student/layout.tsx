"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  CalendarDays,
  TrendingUp,
  Heart,
  MessageCircle,
  CreditCard,
  Bell,
  Settings,
} from "lucide-react";
import { DashboardSidebar, type NavItem } from "@/components/dashboard/sidebar";
import { DashboardMobileNav } from "@/components/dashboard/mobile-nav";
import { useAuthStore } from "@/lib/store/auth-store";

const items: NavItem[] = [
  { href: "/dashboard/student", label: "بخش کلی", icon: LayoutDashboard },
  { href: "/dashboard/student/profile", label: "پروفایل", icon: User },
  { href: "/dashboard/student/classes", label: "کلاس‌های رزروشده", icon: CalendarDays },
  { href: "/dashboard/student/wishlist", label: "علاقه‌مندی‌ها", icon: Heart },
  { href: "/dashboard/student/messages", label: "پیام‌ها", icon: MessageCircle },
  { href: "/dashboard/student/payments", label: "پرداخت‌ها", icon: CreditCard },
  { href: "/dashboard/student/notifications", label: "اعلان‌ها", icon: Bell },
  { href: "/dashboard/student/settings", label: "تنظیمات", icon: Settings },
];

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isTokenExpired = useAuthStore((s) => s.isTokenExpired);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!user || isTokenExpired()) {
      logout();
      router.replace("/login");
      return;
    }

    const role = String(user.role).toLowerCase();
    if (role !== "student") {
      if (role === "teacher") {
        router.replace("/dashboard/teacher");
      } else {
        router.replace("/");
      }
    }
  }, [user, hasHydrated, isTokenExpired, logout, router]);

 console.log(".");
 
  if (!hasHydrated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted text-sm">
        در حال بارگذاری...
      </div>
    );
  }

  const role = String(user.role).toLowerCase();
  if (role !== "student") {
    return null;
  }

  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || "هنرجو";
  const initials =
    [user.firstName?.[0], user.lastName?.[0]].filter(Boolean).join(".") || "ش";

  return (
    <div className="flex">
      <DashboardSidebar
        items={items}
        userName={displayName}
        userRole="هنرجو"
        userInitials={initials}
      />
      <div className="flex-1 min-w-0">
        <DashboardMobileNav items={items} />
        <main className="p-6 md:p-9 max-w-[1100px]">{children}</main>
      </div>
    </div>
  );
}