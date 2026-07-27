import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import { DashPageHeader } from "@/components/dashboard/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { studentClasses } from "@/lib/data";

export default function StudentClassesPage() {
  return (
    <>
      <DashPageHeader title="کلاس‌های رزروشده" desc="فهرست کلاس‌های پیش‌رو و برگزارشده‌ی تو." />

      <div className="space-y-3">
        {studentClasses.map((c) => (
          <div
            key={c.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-5"
          >
            <div>
              <div className="font-semibold mb-1">{c.topic}</div>
              <div className="text-sm text-muted">با {c.teacher}</div>
            </div>
            <div className="flex items-center gap-5 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" /> {c.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {c.time}
              </span>
              <Badge variant={c.status === "برگزارشده" ? "neutral" : "gold"}>{c.status}</Badge>
              {c.status === "برنامه‌ریزی‌شده" && (
                <Button size="sm" variant="glass" asChild>
                  <Link href={`/classroom/class-${c.id}?role=student&name=${encodeURIComponent("مهسا رستمی")}`}>
                    ورود به کلاس
                  </Link>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
