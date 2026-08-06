"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock,
  Loader2,
  CheckCircle2,
  XCircle,
  Ban,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { DashPageHeader } from "@/components/dashboard/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  getMyBookings,
  approveBooking,
  rejectBooking,
  cancelBooking,
} from "@/lib/api/bookings";
import { ApiError } from "@/lib/api/types";
import type { BookingItem } from "@/lib/api/types";
import { useAuthStore } from "@/lib/store/auth-store";

function getStatusInfo(status?: string) {
  const s = (status || "").toLowerCase();

  if (
    s === "pending" ||
    s === "pendingteacherapproval" ||
    s === "awaitingapproval" ||
    s === "waiting"
  ) {
    return { label: "در انتظار بررسی", variant: "warning" as const };
  }

  if (
    s === "approved" ||
    s === "accepted" ||
    s === "awaitingpayment"
  ) {
    return { label: "تأیید شده — در انتظار پرداخت", variant: "gold" as const };
  }

  if (s === "rejected" || s === "declined") {
    return { label: "رد شده", variant: "warning" as const };
  }

  if (s === "cancelled" || s === "canceled") {
    return { label: "لغو شده", variant: "neutral" as const };
  }

  if (s === "paid" || s === "confirmed" || s === "completed") {
    return { label: "پرداخت‌شده", variant: "success" as const };
  }

  return { label: "نامشخص", variant: "neutral" as const };
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

export default function TeacherBookingsPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isTokenExpired = useAuthStore((s) => s.isTokenExpired);
  const logout = useAuthStore((s) => s.logout);

  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [activeAction, setActiveAction] = useState<{
    id: string;
    type: "approve" | "reject" | "cancel";
  } | null>(null);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!user || isTokenExpired()) {
      logout();
      router.replace("/login");
      return;
    }
    const role = String(user.role).toLowerCase();
    if (role !== "teacher") {
      if (role === "student") router.replace("/dashboard/student");
      else router.replace("/");
    }
  }, [user, hasHydrated, isTokenExpired, logout, router]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getMyBookings();
      const sorted = [...list].sort((a, b) => {
        const da = a.sessionStartUtc ? new Date(a.sessionStartUtc).getTime() : 0;
        const db = b.sessionStartUtc ? new Date(b.sessionStartUtc).getTime() : 0;
        return db - da;
      });
      setBookings(sorted);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "خطا در دریافت درخواست‌ها"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasHydrated || !user) return;
    if (String(user.role).toLowerCase() !== "teacher") return;
    fetchBookings();
  }, [hasHydrated, user]);

  const handleAction = async () => {
    if (!activeAction) return;

    setActionLoading(activeAction.id);
    setError(null);

    try {
      if (activeAction.type === "approve") {
        await approveBooking(activeAction.id, note.trim() || undefined);
      } else if (activeAction.type === "reject") {
        await rejectBooking(activeAction.id, note.trim() || undefined);
      } else {
        await cancelBooking(activeAction.id, note.trim() || undefined);
      }

      await fetchBookings();
      setActiveAction(null);
      setNote("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "خطا در انجام عملیات");
    } finally {
      setActionLoading(null);
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
        title="درخواست‌های رزرو"
        desc="درخواست‌های هنرجویان را بررسی و تأیید یا رد کن."
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
          <span className="text-sm">در حال دریافت درخواست‌ها...</span>
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-10 text-center">
          <CalendarDays className="h-12 w-12 mx-auto text-muted mb-4 opacity-50" />
          <h3 className="font-bold mb-2">هنوز درخواستی دریافت نکرده‌ای</h3>
          <p className="text-sm text-muted">
            وقتی هنرجویی درخواست رزرو بفرستد، اینجا نمایش داده می‌شود.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const statusInfo = getStatusInfo(booking.status);
            const { date, time } = formatSession(booking.sessionStartUtc);
            const statusLower = (booking.status || "").toLowerCase();

            const isPending = [
              "pending",
              "pendingteacherapproval",
              "awaitingapproval",
              "waiting",
            ].includes(statusLower);

            const studentName = booking.studentFullName || "هنرجو";

            return (
              <div
                key={booking.id}
                className="rounded-2xl border border-line bg-surface p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-base">{studentName}</h3>
                      <Badge variant={statusInfo.variant}>
                        {statusInfo.label}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-2">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4" />
                        {date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {time}
                      </span>
                      {booking.durationMinutes && (
                        <span>{booking.durationMinutes} دقیقه</span>
                      )}
                      {booking.musicCategoryName && (
                        <span>{booking.musicCategoryName}</span>
                      )}
                      {booking.priceAmount != null && (
                        <span>
                          {Number(booking.priceAmount).toLocaleString("fa-IR")}{" "}
                          تومان
                        </span>
                      )}
                    </div>

                    {booking.studentNote && (
                      <div className="flex items-start gap-2 mt-3 text-sm bg-surface-2 rounded-xl px-3 py-2">
                        <MessageSquare className="h-4 w-4 text-muted shrink-0 mt-0.5" />
                        <span className="text-muted">{booking.studentNote}</span>
                      </div>
                    )}
                  </div>

                  {isPending && (
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <Button
                        size="sm"
                        className="gap-1.5"
                        disabled={!!actionLoading}
                        onClick={() =>
                          setActiveAction({ id: booking.id, type: "approve" })
                        }
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        تأیید
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 text-red-400 border-red-400/30 hover:bg-red-400/10"
                        disabled={!!actionLoading}
                        onClick={() =>
                          setActiveAction({ id: booking.id, type: "reject" })
                        }
                      >
                        <XCircle className="h-4 w-4" />
                        رد
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1.5 text-muted"
                        disabled={!!actionLoading}
                        onClick={() =>
                          setActiveAction({ id: booking.id, type: "cancel" })
                        }
                      >
                        <Ban className="h-4 w-4" />
                        لغو
                      </Button>
                    </div>
                  )}
                </div>

                {activeAction?.id === booking.id && (
                  <div className="mt-5 pt-5 border-t border-line">
                    <p className="text-sm mb-3">
                      {activeAction.type === "approve" &&
                        "آیا از تأیید این درخواست مطمئنی؟"}
                      {activeAction.type === "reject" &&
                        "دلیل رد را بنویس (اختیاری):"}
                      {activeAction.type === "cancel" &&
                        "دلیل لغو را بنویس (اختیاری):"}
                    </p>

                    {(activeAction.type === "reject" ||
                      activeAction.type === "cancel") && (
                      <Textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="یادداشت برای هنرجو..."
                        rows={2}
                        className="mb-4"
                      />
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={actionLoading === booking.id}
                        onClick={handleAction}
                      >
                        {actionLoading === booking.id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin ml-1" />
                            در حال انجام...
                          </>
                        ) : (
                          "تأیید نهایی"
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={!!actionLoading}
                        onClick={() => {
                          setActiveAction(null);
                          setNote("");
                        }}
                      >
                        انصراف
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}