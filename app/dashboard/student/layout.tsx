"use client";

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
  { href: "/dashboard/student/progress", label: "پیشرفت یادگیری", icon: TrendingUp },
  { href: "/dashboard/student/wishlist", label: "علاقه‌مندی‌ها", icon: Heart },
  { href: "/dashboard/student/messages", label: "پیام‌ها", icon: MessageCircle },
  { href: "/dashboard/student/payments", label: "پرداخت‌ها", icon: CreditCard },
  { href: "/dashboard/student/notifications", label: "اعلان‌ها", icon: Bell },
  { href: "/dashboard/student/settings", label: "تنظیمات", icon: Settings },
];

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  const displayName = hasHydrated && user ? `${user.firstName} ${user.lastName}` : "مهسا رستمی";
  const initials = hasHydrated && user ? `${user.firstName[0]}.${user.lastName[0]}` : "م.ر";

  return (
    <div className="flex">
      <DashboardSidebar items={items} userName={displayName} userRole="شاگرد" userInitials={initials} />
      <div className="flex-1 min-w-0">
        <DashboardMobileNav items={items} />
        <main className="p-6 md:p-9 max-w-[1100px]">{children}</main>
      </div>
    </div>
  );
}
