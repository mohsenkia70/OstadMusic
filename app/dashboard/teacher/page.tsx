"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CalendarDays, ArrowLeft, Star } from "lucide-react";
import { DashPageHeader, StatCard } from "@/components/dashboard/shared";
import { Button } from "@/components/ui/button";
import { teacherStudents, teacherReviews } from "@/lib/data";
import { useAuthStore } from "@/lib/store/auth-store";

export default function TeacherOverviewPage() {
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
    if (role !== "teacher") {
      if (role === "student") {
        router.replace("/dashboard/student");
      } else {
        router.replace("/");
      }
    }
  }, [user, hasHydrated, isTokenExpired, logout, router]);


  if (!hasHydrated || !user) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-muted text-sm">
        در حال بارگذاری...
      </div>
    );
  }

  const role = String(user.role).toLowerCase();
  if (role !== "teacher") {
    return null; 
  }

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "استاد";
  const nextUp = teacherStudents.slice(0, 3);

  return (
    <>
      <DashPageHeader
        title={`سلام ${displayName} 👋`}
        desc="این خلاصه‌ای از فعالیت تدریس تو در استاد موزیک است."
        action={
          <Button asChild variant="glass">
            <Link href="/dashboard/teacher/schedule">مدیریت برنامه</Link>
          </Button>
        }
      />

      <div className="grid sm:grid-cols-4 gap-5 mb-9">
        <StatCard label="هنرجوان فعال" value="۱۸" hint="۲ نفر جدید این ماه" />
        <StatCard label="کلاس این هفته" value="۱۲ جلسه" />
        <StatCard label="درآمد این ماه" value="۶,۴۰۰,۰۰۰ تومان" />
        <StatCard label="امتیاز کلی" value="۴.۹ از ۵" />
      </div>

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold">کلاس‌های پیش‌رو</h2>
            <Link
              href="/dashboard/teacher/schedule"
              className="text-xs text-gold hover:underline"
            >
              مشاهده‌ی برنامه
            </Link>
          </div>
          <div className="space-y-3">
            {nextUp.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-xl bg-surface-2 px-4 py-3.5"
              >
                <div>
                  <div className="text-sm font-semibold">{s.name}</div>
                  <div className="text-xs text-muted mt-1">سطح {s.level}</div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <CalendarDays className="h-3.5 w-3.5" /> {s.nextSession}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-bold mb-5">آخرین نظرات</h2>
          <div className="space-y-4">
            {teacherReviews.slice(0, 2).map((r) => (
              <div key={r.name} className="rounded-xl bg-surface-2 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">{r.name}</span>
                  <span className="flex items-center gap-1 text-xs text-gold">
                    <Star className="h-3.5 w-3.5 fill-gold" /> {r.rating}
                  </span>
                </div>
                <p className="text-xs text-muted">{r.text}</p>
              </div>
            ))}
          </div>
          <Link
            href="/dashboard/teacher/reviews"
            className="mt-5 flex items-center gap-1.5 text-sm text-gold hover:underline"
          >
            مشاهده‌ی همه‌ی نظرات <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </>
  );
}