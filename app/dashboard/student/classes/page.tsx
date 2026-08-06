"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  Loader2,
  CreditCard,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { DashPageHeader } from "@/components/dashboard/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getMyBookings,
  requestZarinpalPayment,
  extractPaymentUrl,
} from "@/lib/api/bookings";
import { ApiError } from "@/lib/api/types";
import type { BookingItem } from "@/lib/api/types";
import { useAuthStore } from "@/lib/store/auth-store";

function getStatusInfo(status?: string) {
  const s = (status || "").toLowerCase();

  // در انتظار تأیید استاد
  if (
    s === "pending" ||
    s === "pendingteacherapproval" ||
    s === "awaitingapproval" ||
    s === "waiting"
  ) {
    return {
      label: "در انتظار تأیید استاد",
      variant: "warning" as const,
    };
  }

  // تأیید شده و آماده پرداخت
  if (
    s === "approved" ||
    s === "accepted" ||
    s === "awaitingpayment"
  ) {
    return {
      label: "تأیید شده — آماده پرداخت",
      variant: "gold" as const,
    };
  }

  // رد شده
if (s === "rejected" || s === "declined") {
  return {
    label: "رد شده توسط استاد", // یا "رد شده"
    variant: "warning" as const,   // یا "neutral"
  };
}

  // لغو شده
  if (s === "cancelled" || s === "canceled") {
    return {
      label: "لغو شده",
      variant: "neutral" as const,
    };
  }

  // پرداخت شده
  if (s === "paid" || s === "confirmed" || s === "completed") {
    return {
      label: "پرداخت‌شده",
      variant: "success" as const,
    };
  }

  return {
    label: "نامشخص",
    variant: "neutral" as const,
  };
}

function formatSession(dateStr?: string) {
  if (!dateStr) return { date: "—", time: "—" };
  try {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString("fa-IR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: d.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  } catch {
    return { date: "—", time: "—" };
  }
}

export default function StudentClassesPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isTokenExpired = useAuthStore((s) => s.isTokenExpired);
  const logout = useAuthStore((s) => s.logout);

  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);

  // محافظت دسترسی
  useEffect(() => {
    if (!hasHydrated) return;

    if (!user || isTokenExpired()) {
      logout();
      router.replace("/login");
      return;
    }

    const role = String(user.role).toLowerCase();
    if (role !== "student") {
      if (role === "teacher") router.replace("/dashboard/teacher");
      else router.replace("/");
    }
  }, [user, hasHydrated, isTokenExpired, logout, router]);

  // دریافت لیست رزروها
  useEffect(() => {
    if (!hasHydrated || !user) return;
    if (String(user.role).toLowerCase() !== "student") return;

    setLoading(true);
    setError(null);

    getMyBookings()
      .then((list) => {
        const sorted = [...list].sort((a, b) => {
          const da = a.sessionStartUtc
            ? new Date(a.sessionStartUtc).getTime()
            : 0;
          const db = b.sessionStartUtc
            ? new Date(b.sessionStartUtc).getTime()
            : 0;
          return db - da;
        });
        setBookings(sorted);
      })
      .catch((err) => {
        setError(
          err instanceof ApiError
            ? err.message
            : "خطا در دریافت لیست کلاس‌ها"
        );
      })
      .finally(() => setLoading(false));
  }, [hasHydrated, user]);

  // پرداخت
  const handlePay = async (bookingId: string) => {
    setPayingId(bookingId);
    setError(null);

    try {
      const payRes = await requestZarinpalPayment({ bookingId });
      const paymentUrl = extractPaymentUrl(payRes);

      if (!paymentUrl) {
        setError("لینک پرداخت ساخته نشد. لطفاً دوباره تلاش کن.");
        setPayingId(null);
        return;
      }

      window.location.href = paymentUrl;
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "خطا در ایجاد لینک پرداخت"
      );
      setPayingId(null);
    }
  };

  if (!hasHydrated || !user) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-muted text-sm">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <>
      <DashPageHeader
        title="کلاس‌های رزروشده"
        desc="فهرست درخواست‌ها، کلاس‌های تأییدشده و برگزارشده‌ی تو."
        action={
          <Button asChild>
            <Link href="/teachers">رزرو کلاس جدید</Link>
          </Button>
        }
      />

      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-xl bg-red-400/10 border border-red-400/20 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh] gap-3 text-muted">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">در حال دریافت کلاس‌ها...</span>
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-10 text-center">
          <CalendarDays className="h-12 w-12 mx-auto text-muted mb-4 opacity-50" />
          <h3 className="font-bold mb-2">هنوز کلاسی رزرو نکرده‌ای</h3>
          <p className="text-sm text-muted mb-6">
            از بین استادها یکی را انتخاب کن و درخواست رزرو بفرست.
          </p>
          <Button asChild>
            <Link href="/teachers">مشاهده استادها</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => {
            const statusInfo = getStatusInfo(booking.status);
            const { date, time } = formatSession(booking.sessionStartUtc);
            const statusLower = (booking.status || "").toLowerCase();

            // فقط وقتی آماده پرداخت است دکمه نشان داده شود
            const canPay =
              statusLower === "approved" ||
              statusLower === "accepted" ||
              statusLower === "awaitingpayment";

            const isPaid = ["paid", "confirmed", "completed"].includes(
              statusLower
            );

            const teacherName = booking.teacherFullName || "استاد";

            return (
              <div
                key={booking.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-5"
              >
                <div className="min-w-0">
                  <div className="font-semibold mb-1 truncate">
                    {teacherName}
                  </div>
                  <div className="text-sm text-muted">
                    {booking.musicCategoryName && (
                      <span>{booking.musicCategoryName}</span>
                    )}
                    {booking.durationMinutes && (
                      <span>
                        {booking.musicCategoryName ? " • " : ""}
                        {booking.durationMinutes} دقیقه
                      </span>
                    )}
                    {booking.priceAmount != null && (
                      <span>
                        {" • "}
                        {Number(booking.priceAmount).toLocaleString("fa-IR")}{" "}
                        تومان
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5 text-muted">
                    <CalendarDays className="h-4 w-4" />
                    {date}
                  </span>
                  <span className="flex items-center gap-1.5 text-muted">
                    <Clock className="h-4 w-4" />
                    {time}
                  </span>

                  <Badge variant={statusInfo.variant}>
                    {statusInfo.label}
                  </Badge>

                  {/* دکمه پرداخت فقط وقتی وضعیت آماده پرداخت باشد */}
                  {canPay && (
                    <Button
                      size="sm"
                      disabled={payingId === booking.id}
                      onClick={() => handlePay(booking.id)}
                      className="gap-1.5"
                    >
                      {payingId === booking.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          در حال انتقال...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4" />
                          پرداخت و نهایی‌سازی
                        </>
                      )}
                    </Button>
                  )}

                  {isPaid && (
                    <div className="flex items-center gap-1.5 text-green-500 text-xs font-medium">
                      <CheckCircle2 className="h-4 w-4" />
                      پرداخت شده
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}