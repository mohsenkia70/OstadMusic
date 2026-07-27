import { Camera } from "lucide-react";
import { DashPageHeader } from "@/components/dashboard/shared";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TeacherProfilePage() {
  return (
    <>
      <DashPageHeader title="پروفایل من" desc="این اطلاعات برای شاگردان روی صفحه‌ی عمومی‌ات نمایش داده می‌شود." />

      <div className="rounded-2xl border border-line bg-surface p-7 max-w-2xl">
        <div className="flex items-center gap-5 mb-8">
          <div className="relative">
            <Avatar className="h-20 w-20 rounded-2xl">
              <AvatarFallback className="text-xl rounded-2xl">ن.ا</AvatarFallback>
            </Avatar>
            <button className="absolute -bottom-1.5 -left-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-gold text-[#181209]">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div>
            <div className="font-bold">نگار احمدی</div>
            <div className="text-muted text-sm">استاد از ۱۴۰۱</div>
          </div>
        </div>

        <form className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="name">نام و نام‌خانوادگی</Label>
              <Input id="name" defaultValue="نگار احمدی" />
            </div>
            <div>
              <Label htmlFor="city">شهر</Label>
              <Input id="city" defaultValue="تهران" />
            </div>
          </div>
          <div>
            <Label htmlFor="specialty">تخصص</Label>
            <Input id="specialty" defaultValue="ویولن کلاسیک، آماده‌سازی کنکور هنر" />
          </div>
          <div>
            <Label htmlFor="price">هزینه‌ی هر جلسه (تومان)</Label>
            <Input id="price" defaultValue="۴۵۰,۰۰۰" />
          </div>
          <div>
            <Label htmlFor="bio">بیوگرافی</Label>
            <Textarea
              id="bio"
              defaultValue="فارغ‌التحصیل آهنگسازی و نوازندگی ویولن، با ۱۲ سال سابقه‌ی تدریس به هنرجویان آماده‌ی کنکور هنر."
            />
          </div>
          <div>
            <Label>برچسب‌های تخصص</Label>
            <div className="flex flex-wrap gap-2">
              {["کلاسیک", "کنکور هنر", "حضوری"].map((tag) => (
                <Badge key={tag} variant="gold">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button">ذخیره‌ی تغییرات</Button>
            <Button type="button" variant="outline">
              انصراف
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
