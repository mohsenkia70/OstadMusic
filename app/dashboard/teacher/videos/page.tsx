import { Video, Plus, Eye } from "lucide-react";
import { DashPageHeader } from "@/components/dashboard/shared";
import { Button } from "@/components/ui/button";

const videos = [
  { title: "معرفی روش تدریس", views: "۱,۲۴۰", duration: "۳:۲۰" },
  { title: "نمونه‌اجرا: کنسرتوی مندلسون", views: "۸۵۰", duration: "۵:۱۰" },
  { title: "تمرین تکنیک کشش کمان", views: "۶۲۰", duration: "۴:۰۵" },
];

export default function TeacherVideosPage() {
  return (
    <>
      <DashPageHeader
        title="ویدیوها"
        desc="ویدیوهای معرفی و نمونه‌اجرا که در پروفایل عمومی‌ات نمایش داده می‌شود."
        action={
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> بارگذاری ویدیوی جدید
          </Button>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map((v) => (
          <div key={v.title} className="rounded-2xl border border-line bg-surface overflow-hidden">
            <div className="relative aspect-video bg-gradient-to-br from-surface-2 to-surface flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/90 text-[#181209]">
                <Video className="h-5 w-5" />
              </div>
              <span className="absolute bottom-2.5 left-2.5 text-xs bg-black/60 rounded-md px-2 py-0.5">
                {v.duration}
              </span>
            </div>
            <div className="p-4">
              <div className="text-sm font-semibold mb-2">{v.title}</div>
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Eye className="h-3.5 w-3.5" /> {v.views} بازدید
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
