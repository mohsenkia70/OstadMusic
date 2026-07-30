import { Bell, CreditCard, MessageSquare, Clock } from "lucide-react";
import { DashPageHeader } from "@/components/dashboard/shared";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { notifications } from "@/lib/data";

const icons = [Clock, CreditCard, MessageSquare, Bell];

export default function StudentNotificationsPage() {
  return (
    <>
      <DashPageHeader
        title="اعلان‌ها"
        desc="آخرین بروزرسانی‌های مربوط به کلاس‌ها و حساب تو."
        action={
          <Button variant="outline" size="sm">
            علامت‌گذاری همه به‌عنوان خوانده‌شده
          </Button>
        }
      />

      <div className="space-y-3">
        {notifications.map((n, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div
              key={n.id}
              className={cn(
                "flex items-start gap-4 rounded-2xl border p-5",
                n.unread ? "border-gold/30 bg-gold-soft/40" : "border-line bg-surface"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  n.unread ? "bg-gold-soft text-gold" : "bg-surface-2 text-muted"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold">{n.title}</span>
                  <span className="text-xs text-muted shrink-0">{n.time}</span>
                </div>
                <p className="text-sm text-muted mt-1">{n.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
