"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CalendarDays, Clock, ArrowLeft } from "lucide-react";
import { DashPageHeader, StatCard } from "@/components/dashboard/shared";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { studentClasses } from "@/lib/data";
import { useAuthStore } from "@/lib/store/auth-store";

export default function StudentOverviewPage() {
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

  if (!hasHydrated || !user) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-muted text-sm">
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
  const upcoming = studentClasses.filter((c) => c.status === "برنامه‌ریزی‌شده");

  return (
    <>
      <DashPageHeader
        title={`سلام ${displayName} 👋`}
        desc="این خلاصه‌ای از مسیر یادگیری‌ات در استاد موزیک است."
        action={
          <Button asChild>
            <Link href="/teachers">رزرو کلاس جدید</Link>
          </Button>
        }
      />

      <div className="grid sm:grid-cols-3 gap-5 mb-9">
        <StatCard label="کلاس‌های برگزارشده" value="۲۴" hint="از ابتدای عضویت" />
        <StatCard
          label="ساعت تمرین این ماه"
          value="۹ ساعت"
          hint="نسبت به ماه قبل ۱۲٪ بیشتر"
        />
        <StatCard label="استاد فعلی" value="نگار احمدی" hint="از ۴ ماه پیش" />
      </div>

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold">کلاس‌های پیش‌رو</h2>
            <Link
              href="/dashboard/student/classes"
              className="text-xs text-gold hover:underline"
            >
              مشاهده همه
            </Link>
          </div>
          <div className="space-y-3">
            {upcoming.map((c, i) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-xl bg-surface-2 px-4 py-3.5"
              >
                <div>
                  <div className="text-sm font-semibold">{c.topic}</div>
                  <div className="text-xs text-muted mt-1">با {c.teacher}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-left text-xs text-muted">
                    <div className="flex items-center gap-1.5 mb-1">
                      <CalendarDays className="h-3.5 w-3.5" /> {c.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> {c.time}
                    </div>
                  </div>
                  {i === 0 && (
                    <Button size="sm" asChild>
                      <Link
                        href={`/classroom/class-${c.id}?role=student&name=${encodeURIComponent(displayName)}`}
                      >
                        ورود
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-bold mb-5">پیشرفت یادگیری</h2>
          <div className="space-y-5">
            {[
              { label: "تکنیک کمان", value: 70 },
              { label: "کوک و تشخیص گوش", value: 55 },
              { label: "قطعات میانی", value: 40 },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span>{s.label}</span>
                  <span className="text-muted">{s.value}٪</span>
                </div>
                <Progress value={s.value} />
              </div>
            ))}
          </div>
          <Link
            href="/dashboard/student/progress"
            className="mt-6 flex items-center gap-1.5 text-sm text-gold hover:underline"
          >
            مشاهده‌ی کامل پیشرفت <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </>
  );
}