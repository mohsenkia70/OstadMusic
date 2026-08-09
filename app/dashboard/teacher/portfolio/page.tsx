import { Plus } from "lucide-react";
import { DashPageHeader } from "@/components/dashboard/shared";
import { Button } from "@/components/ui/button";

const items = [
  { title: "اجرای کنسرتوی مندلسون", venue: "تالار وحدت، ۱۴۰۲" },
  { title: "جشن پایان‌ترم هنرجویان", venue: "آموزشگاه استاد موزیک، ۱۴۰۳" },
  { title: "همنوازی با ارکستر مجلسی", venue: "خانه‌ی هنرمندان، ۱۴۰۳" },
  { title: "اجرای انفرادی باخ", venue: "سالن رودکی، ۱۴۰۴" },
];

export default function TeacherPortfolioPage() {
  return (
    <>
      <DashPageHeader
        title="نمونه‌کار"
        desc="تصاویر و اجراهایی که به هنرجوان بالقوه نشان داده می‌شود."
        action={
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> افزودن نمونه‌کار
          </Button>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <div key={item.title} className="rounded-2xl border border-line bg-surface overflow-hidden">
            <div className="aspect-[4/3] bg-gradient-to-br from-[#f7f2e4] to-[#eee4cc] relative">
              <div
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(circle at 35% 35%, rgba(13,148,136,0.3), transparent 60%)",
                }}
              />
            </div>
            <div className="p-4">
              <div className="text-sm font-semibold mb-1">{item.title}</div>
              <div className="text-xs text-muted">{item.venue}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
