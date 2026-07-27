"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/logo-mark";
import type { NavItem } from "./sidebar";

export function DashboardMobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between border-b border-line bg-bg/90 backdrop-blur-xl px-5 py-4">
      <Link href="/" className="flex items-center gap-2 font-display text-lg font-extrabold">
        <LogoMark className="h-7 w-7 rounded-[8px]" />
        استاد موزیک
      </Link>
      <button onClick={() => setOpen(true)} aria-label="باز کردن منو">
        <Menu className="h-6 w-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[200] bg-bg/97 backdrop-blur-xl">
          <div className="flex justify-between items-center px-6 py-5 border-b border-line">
            <span className="font-display text-lg font-extrabold">استاد موزیک</span>
            <button onClick={() => setOpen(false)} aria-label="بستن منو">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="p-6 space-y-1">
            {items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-base transition-colors",
                    active ? "bg-gold-soft text-gold" : "text-ink/85"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
            <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-3 text-base text-red-600 mt-4 border-t border-line pt-5">
              <LogOut className="h-5 w-5" />
              خروج از حساب
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
