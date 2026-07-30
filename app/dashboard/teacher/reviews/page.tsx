import { Star } from "lucide-react";
import { DashPageHeader, StatCard } from "@/components/dashboard/shared";
import { teacherReviews } from "@/lib/data";

export default function TeacherReviewsPage() {
  return (
    <>
      <DashPageHeader title="نظرات" desc="بازخورد شاگردانت درباره‌ی کیفیت تدریس." />

      <div className="grid sm:grid-cols-3 gap-5 mb-9">
        <StatCard label="امتیاز کلی" value="۴.۹ از ۵" />
        <StatCard label="تعداد نظرات" value="۲۱۴" />
        <StatCard label="نرخ رضایت" value="۹۸٪" />
      </div>

      <div className="space-y-4">
        {teacherReviews.map((r) => (
          <div key={r.name} className="rounded-2xl border border-line bg-surface p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold">{r.name}</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < r.rating ? "fill-gold text-gold" : "text-line"}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-muted text-sm">{r.text}</p>
          </div>
        ))}
      </div>
    </>
  );
}
