import { Camera } from "lucide-react";
import { DashPageHeader } from "@/components/dashboard/shared";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function StudentProfilePage() {
  return (
    <>
      <DashPageHeader title="پروفایل من" desc="اطلاعات شخصی و اطلاعاتی که استادها می‌بینند." />

      <div className="rounded-2xl border border-line bg-surface p-7 max-w-2xl">
        <div className="flex items-center gap-5 mb-8">
          <div className="relative">
            <Avatar className="h-20 w-20 rounded-2xl">
              <AvatarFallback className="text-xl rounded-2xl">م.ر</AvatarFallback>
            </Avatar>
            <button className="absolute -bottom-1.5 -left-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-gold text-[#181209]">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div>
            <div className="font-bold">مهسا رستمی</div>
            <div className="text-muted text-sm">شاگرد از ۱۴۰۳/۰۸</div>
          </div>
        </div>

        <form className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="name">نام و نام‌خانوادگی</Label>
              <Input id="name" defaultValue="مهسا رستمی" />
            </div>
            <div>
              <Label htmlFor="city">شهر</Label>
              <Input id="city" defaultValue="اصفهان" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="email">ایمیل</Label>
              <Input id="email" defaultValue="mahsa.rostami@email.com" />
            </div>
            <div>
              <Label htmlFor="phone">شماره موبایل</Label>
              <Input id="phone" defaultValue="۰۹۱۲۳۴۵۶۷۸۹" />
            </div>
          </div>
          <div>
            <Label htmlFor="bio">درباره‌ی من</Label>
            <Textarea
              id="bio"
              defaultValue="از دو سال پیش ویولن یاد می‌گیرم و علاقه‌ی خاصی به قطعات رمانتیک دارم."
            />
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
