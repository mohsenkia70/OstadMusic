import Link from "next/link";
import { Video } from "lucide-react";
import { DashPageHeader } from "@/components/dashboard/shared";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const days = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];
const hours = ["۱۶:۰۰", "۱۷:۰۰", "۱۸:۰۰", "۱۹:۰۰", "۲۰:۰۰"];

const booked: Record<string, string> = {
  "شنبه-۱۸:۰۰": "مهسا رستمی",
  "یکشنبه-۱۷:۰۰": "بهراد نوری",
  "سه‌شنبه-۱۹:۰۰": "آیدا فرهادی",
  "چهارشنبه-۱۸:۰۰": "کاوه مرادی",
};

export default function TeacherSchedulePage() {
  return (
    <>
      <DashPageHeader
        title="برنامه‌ی تدریس"
        desc="زمان‌های رزروشده و بازه‌های آزاد این هفته. برای شروع کلاس روی هر جلسه بزن."
        action={<Button variant="outline">مدیریت زمان‌های آزاد</Button>}
      />

      <div className="rounded-2xl border border-line bg-surface overflow-x-auto">
        <div className="grid grid-cols-8 min-w-[720px]">
          <div className="p-4 text-xs text-muted border-b border-line" />
          {days.map((d) => (
            <div key={d} className="p-4 text-sm font-semibold text-center border-b border-e border-line last:border-e-0">
              {d}
            </div>
          ))}

          {hours.map((h) => (
            <div key={h} className="contents">
              <div className="p-4 text-xs text-muted border-b border-line flex items-center">{h}</div>
              {days.map((d) => {
                const key = `${d}-${h}`;
                const student = booked[key];
                return (
                  <div
                    key={key}
                    className={cn(
                      "border-b border-e last:border-e-0 border-line min-h-[68px]",
                      student && "bg-gold-soft"
                    )}
                  >
                    {student ? (
                      <Link
                        href={`/classroom/class-${encodeURIComponent(key)}?role=teacher&name=${encodeURIComponent("نگار احمدی")}`}
                        className="group h-full w-full flex flex-col items-center justify-center gap-1 p-2 text-center"
                      >
                        <span className="text-xs text-gold font-medium leading-tight">{student}</span>
                        <span className="flex items-center gap-1 text-[10px] text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                          <Video className="h-3 w-3" /> شروع کلاس
                        </span>
                      </Link>
                    ) : (
                      <div className="h-full w-full" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
