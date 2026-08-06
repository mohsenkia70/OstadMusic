"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createBooking,
  extractBookingId,
  getMusicCategories,
} from "@/lib/api/bookings";
import { ApiError } from "@/lib/api/types";
import type { MusicCategory } from "@/lib/api/types";
import { useAuthStore } from "@/lib/store/auth-store";

const DURATION_OPTIONS = [
  { value: 45, label: "۴۵ دقیقه" },
  { value: 60, label: "۶۰ دقیقه" },
  { value: 90, label: "۹۰ دقیقه" },
];

const SLOT_OPTIONS = [
  { label: "شنبه ۱۸:۰۰", dayOffset: getNextWeekday(6), hour: 18, minute: 0 },
  { label: "یکشنبه ۱۷:۳۰", dayOffset: getNextWeekday(0), hour: 17, minute: 30 },
  { label: "سه‌شنبه ۱۹:۰۰", dayOffset: getNextWeekday(2), hour: 19, minute: 0 },
  { label: "پنجشنبه ۱۶:۰۰", dayOffset: getNextWeekday(4), hour: 16, minute: 0 },
];

/** weekday: 0=یکشنبه ... 6=شنبه */
function getNextWeekday(weekday: number) {
  const now = new Date();
  const current = now.getDay(); // 0 Sun
  let diff = weekday - current;
  if (diff <= 0) diff += 7;
  return diff;
}

function buildSessionUtc(dayOffset: number, hour: number, minute: number) {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

type Props = {
  teacherProfileId: string;
  teacherCategories: string[];
  hourlyRate: number;
};

export function BookingForm({
  teacherProfileId,
  teacherCategories,
  hourlyRate,
}: Props) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const isTokenExpired = useAuthStore((s) => s.isTokenExpired);

  const [categories, setCategories] = useState<MusicCategory[]>([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [duration, setDuration] = useState(60);
  const [musicCategoryId, setMusicCategoryId] = useState<number | "">("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getMusicCategories()
      .then((list) => {
        setCategories(list);
        const match = list.find((c) => teacherCategories.includes(c.name));
        if (match) setMusicCategoryId(match.id);
        else if (list[0]) setMusicCategoryId(list[0].id);
      })
      .catch(() => {});
  }, [teacherCategories]);

  const filteredCategories = useMemo(() => {
    if (!teacherCategories?.length) return categories;
    const matched = categories.filter((c) =>
      teacherCategories.includes(c.name),
    );
    return matched.length ? matched : categories;
  }, [categories, teacherCategories]);

  const estimatedPrice = Math.round((hourlyRate * duration) / 60);

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);

    if (!accessToken || isTokenExpired() || !user) {
      setError("برای رزرو باید وارد حساب کاربری‌ات شوی.");
      router.push("/login");
      return;
    }

    if (user.role !== "Student") {
      setError("فقط هنرجو می‌تواند کلاس رزرو کند.");
      return;
    }

    if (musicCategoryId === "") {
      setError("لطفاً دسته‌ی موسیقی را انتخاب کن.");
      return;
    }

    const slot = SLOT_OPTIONS[slotIndex];
    if (!slot) {
      setError("زمان جلسه را انتخاب کن.");
      return;
    }

    setLoading(true);

    try {
      // فقط ساخت رزرو (وضعیت Pending)
      const bookingRes = await createBooking({
        teacherProfileId,
        musicCategoryId: Number(musicCategoryId),
        sessionStartUtc: buildSessionUtc(
          slot.dayOffset,
          slot.hour,
          slot.minute,
        ),
        durationMinutes: duration,
        studentNote: note.trim() || null,
      });

      const bookingId = extractBookingId(bookingRes);

      if (!bookingId) {
        setError(
          "رزرو ثبت شد ولی شناسه رزرو دریافت نشد. از بخش رزروهای من پیگیری کن.",
        );
        setLoading(false);
        return;
      }

      // موفقیت — بدون پرداخت
      setSuccess(true);
      setLoading(false);

      // بعد از ۲ ثانیه به صفحه رزروهای من هدایت شود
      setTimeout(() => {
        router.push("/dashboard/student/classes");
      }, 2200);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "خطا در ثبت رزرو. دوباره تلاش کن.";
      setError(message);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-4 text-center py-6">
        <div className="flex justify-center">
          <CheckCircle2 className="h-14 w-14 text-green-500" />
        </div>
        <h3 className="text-lg font-bold text-ink">درخواست رزرو ثبت شد</h3>
        <p className="text-sm text-muted leading-6 px-2">
          درخواستت برای استاد ارسال شد.
          <br />
          وضعیت را از بخش «کلاس‌های رزروشده» پیگیری کن.
        </p>
        <p className="text-xs text-muted">در حال انتقال به بخش رزروها...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-muted mb-3">زمان‌های آزاد این هفته</p>
        <div className="grid grid-cols-2 gap-2.5">
          {SLOT_OPTIONS.map((slot, i) => (
            <button
              key={slot.label}
              type="button"
              onClick={() => setSlotIndex(i)}
              className={`rounded-xl border px-3 py-2.5 text-xs transition-colors ${
                slotIndex === i
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-line bg-surface-2 text-ink/90 hover:border-gold/40 hover:text-gold"
              }`}
            >
              {slot.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm text-muted mb-2 block">مدت جلسه</Label>
        <div className="grid grid-cols-3 gap-2">
          {DURATION_OPTIONS.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setDuration(d.value)}
              className={`rounded-xl border px-2 py-2 text-xs transition-colors ${
                duration === d.value
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-line bg-surface-2 hover:border-gold/40"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {filteredCategories.length > 0 && (
        <div>
          <Label className="text-sm text-muted mb-2 block">دسته‌ی موسیقی</Label>
          <select
            value={musicCategoryId}
            onChange={(e) =>
              setMusicCategoryId(
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
            className="h-11 w-full rounded-xl border border-line bg-surface-2 px-3 text-sm"
          >
            <option value="">انتخاب کنید</option>
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <Label className="text-sm text-muted mb-2 block">
          یادداشت (اختیاری)
        </Label>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="مثلاً سطح فعلی یا هدف از جلسه..."
          rows={3}
        />
      </div>

      <div className="flex items-baseline justify-between text-sm">
        <span className="text-muted">مبلغ تقریبی</span>
        <span className="font-bold">
          {estimatedPrice.toLocaleString("fa-IR")}{" "}
          <span className="text-muted font-normal text-xs">تومان</span>
        </span>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      <Button
        className="w-full"
        size="lg"
        disabled={loading}
        onClick={handleSubmit}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin ml-2" />
            در حال ثبت درخواست...
          </>
        ) : (
          "ثبت درخواست رزرو"
        )}
      </Button>

      <p className="text-[11px] text-muted text-center leading-5">
        پس از ثبت درخواست، استاد باید آن را تأیید کند.
        <br />
        فقط بعد از تأیید استاد می‌توانی پرداخت را انجام دهی.
      </p>
    </div>
  );
}
