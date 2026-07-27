import { Heart } from "lucide-react";
import { DashPageHeader, EmptyState } from "@/components/dashboard/shared";
import { TeacherCard } from "@/components/teacher-card";
import { teachers } from "@/lib/data";

export default function StudentWishlistPage() {
  const wishlist = teachers.slice(0, 3);

  return (
    <>
      <DashPageHeader title="علاقه‌مندی‌ها" desc="اساتیدی که برای بعد نشان‌کرده‌ای." />

      {wishlist.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-5">
          {wishlist.map((t) => (
            <TeacherCard key={t.id} teacher={t} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="هنوز چیزی ذخیره نکرده‌ای"
          desc="با ضربه روی نماد قلب در پروفایل هر استاد، او را به این‌جا اضافه کن."
        />
      )}
      <div className="flex items-center gap-2 text-xs text-muted mt-6">
        <Heart className="h-3.5 w-3.5" /> این فهرست فقط برای خودت قابل مشاهده است.
      </div>
    </>
  );
}
