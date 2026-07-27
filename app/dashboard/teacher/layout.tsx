"use client";

import {
  LayoutDashboard,
  User,
  Image as ImageIcon,
  FileText,
  Video,
  CalendarDays,
  Users,
  Wallet,
  Star,
  Settings,
} from "lucide-react";
import { DashboardSidebar, type NavItem } from "@/components/dashboard/sidebar";
import { DashboardMobileNav } from "@/components/dashboard/mobile-nav";
import { useAuthStore } from "@/lib/store/auth-store";

const items: NavItem[] = [
  { href: "/dashboard/teacher", label: "بخش کلی", icon: LayoutDashboard },
  { href: "/dashboard/teacher/profile", label: "پروفایل", icon: User },
  { href: "/dashboard/teacher/portfolio", label: "نمونه‌کار", icon: ImageIcon },
  { href: "/dashboard/teacher/resume", label: "رزومه", icon: FileText },
  { href: "/dashboard/teacher/videos", label: "ویدیوها", icon: Video },
  { href: "/dashboard/teacher/schedule", label: "برنامه‌ی تدریس", icon: CalendarDays },
  { href: "/dashboard/teacher/students", label: "شاگردان", icon: Users },
  { href: "/dashboard/teacher/income", label: "درآمد", icon: Wallet },
  { href: "/dashboard/teacher/reviews", label: "نظرات", icon: Star },
  { href: "/dashboard/teacher/settings", label: "تنظیمات", icon: Settings },
];

export default function TeacherDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  const displayName = hasHydrated && user ? `${user.firstName} ${user.lastName}` : "نگار احمدی";
  const initials = hasHydrated && user ? `${user.firstName[0]}.${user.lastName[0]}` : "ن.ا";

  return (
    <div className="flex">
      <DashboardSidebar items={items} userName={displayName} userRole="استاد" userInitials={initials} />
      <div className="flex-1 min-w-0">
        <DashboardMobileNav items={items} />
        <main className="p-6 md:p-9 max-w-[1100px]">{children}</main>
      </div>
    </div>
  );
}
