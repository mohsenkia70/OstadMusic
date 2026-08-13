"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Users, Settings } from "lucide-react";
import { DashboardSidebar, type NavItem } from "@/components/dashboard/sidebar";
import { DashboardMobileNav } from "@/components/dashboard/mobile-nav";
import { useAuthStore } from "@/lib/store/auth-store";

const items: NavItem[] = [
 
  { href: "/dashboard/admin/teachers", label: "مدیریت اساتید", icon: Users },
];

// ✅ تابع کمکی برای normalize کردن role
function normalizeRole(role: string | undefined | null): string {
  return (role ?? "").toLowerCase();
}

export default function AdminDashboardLayout({
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
    // ✅ صبر کن hydration تموم بشه
    if (!hasHydrated) return;

    // ✅ اگه لاگین نکرده یا توکن expire شده
    if (!user || isTokenExpired()) {
      logout();
      router.replace("/login");
      return;
    }

    // ✅ اگه ادمین نیست
    const role = normalizeRole(user.role);
    if (role !== "admin") {
      if (role === "teacher") {
        router.replace("/dashboard/teacher");
      } else if (role === "student") {
        router.replace("/dashboard/student");
      } else {
        router.replace("/");
      }
    }
  }, [user, hasHydrated, isTokenExpired, logout, router]);

  // ✅ نمایش loading تا hydration تموم بشه
  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted text-sm">
        در حال بارگذاری...
      </div>
    );
  }

  // ✅ اگه user نداره یا ادمین نیست، چیزی نشون نده
  if (!user || normalizeRole(user.role) !== "admin") {
    return null;
  }

  const displayName = `${user.firstName} ${user.lastName}`;
  const initials = `${user.firstName?.[0] ?? "A"}.${user.lastName?.[0] ?? "D"}`;

  return (
    <div className="flex">
      <DashboardSidebar
        items={items}
        userName={displayName}
        userRole="ادمین"
        userInitials={initials}
      />
      <div className="flex-1 min-w-0">
        <DashboardMobileNav items={items} />
        <main className="p-6 md:p-9 max-w-[1200px]">{children}</main>
      </div>
    </div>
  );
}