"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/lib/store/auth-store";
import { LogoMark } from "@/components/logo-mark";

export type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }> };

export function DashboardSidebar({
  items,
  userName,
  userRole,
  userInitials,
}: {
  items: NavItem[];
  userName: string;
  userRole: string;
  userInitials: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-e border-line bg-bg-2 h-screen sticky top-0 p-5">
      <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-extrabold mb-8 px-2">
        <LogoMark className="h-8 w-8" />
        استاد موزیک
      </Link>

      <nav className="flex-1 space-y-1">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active ? "bg-gold-soft text-gold" : "text-muted hover:text-ink hover:bg-surface"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-line pt-4 flex items-center gap-3 px-2">
        <Avatar>
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">{userName}</div>
          <div className="text-xs text-muted">{userRole}</div>
        </div>
        <button onClick={handleLogout} className="text-muted hover:text-red-600" aria-label="خروج">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
