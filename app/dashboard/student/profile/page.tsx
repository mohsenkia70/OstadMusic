"use client";

import { useRef } from "react";
import { Camera, Upload, UserRound } from "lucide-react";

import { DashPageHeader } from "@/components/dashboard/shared";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/lib/store/profile-store";
import { useAuthStore } from "@/lib/store/auth-store";

export default function StudentProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setAvatar = useProfileStore((s) => s.setAvatar);
  const clearAvatar = useProfileStore((s) => s.clearAvatar);

  const userId = user?.userId ?? "";

  // سلکت مستقیم داده → ری‌رندر درست کار می‌کنه
  const avatarPreview = useProfileStore((s) =>
    userId ? s.avatars[userId] ?? null : null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "هنرجو";

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected || !userId) return;

    if (!selected.type.startsWith("image/")) {
      alert("لطفاً فقط فایل تصویری انتخاب کنید.");
      return;
    }

    if (selected.size > 2 * 1024 * 1024) {
      alert("حجم تصویر نباید بیشتر از ۲ مگابایت باشد.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(userId, reader.result as string);
    };
    reader.onerror = () => {
      alert("خطا در خواندن فایل. لطفاً دوباره تلاش کنید.");
    };
    reader.readAsDataURL(selected);

    // ریست اینپوت تا بتونی همون فایل رو دوباره انتخاب کنی
    e.target.value = "";
  };

  const handleSave = () => {
    console.log("avatar base64 length:", avatarPreview?.length);
    alert("تغییرات با موفقیت ذخیره شد");
  };

  const handleRemoveAvatar = () => {
    if (!userId) return;
    clearAvatar(userId);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <DashPageHeader
        title="پروفایل من"
        desc="اطلاعات شخصی و اطلاعاتی که استادها می‌بینند."
      />

      <div className="rounded-2xl border border-line bg-surface p-7 max-w-2xl">
        <div className="flex items-center gap-5 mb-8">
          <div className="relative group">
            <Avatar
              onClick={handleAvatarClick}
              className="h-24 w-24 rounded-3xl cursor-pointer overflow-hidden border border-line shadow-sm"
            >
              {avatarPreview ? (
                <AvatarImage
                  src={avatarPreview}
                  alt="عکس پروفایل"
                  className="object-cover rounded-3xl"
                />
              ) : (
                <AvatarFallback className="rounded-3xl bg-gradient-to-br from-gold via-yellow-200 to-orange-200 text-[#181209]">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <UserRound className="h-8 w-8" />
                    <span className="text-[10px] font-medium">عکس</span>
                  </div>
                </AvatarFallback>
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-3xl">
                <Camera className="text-white h-7 w-7" />
              </div>
            </Avatar>

            <button
              type="button"
              onClick={handleAvatarClick}
              className="absolute -bottom-2 -left-2 h-9 w-9 rounded-full bg-gold text-[#181209] flex items-center justify-center shadow-lg hover:scale-105 transition"
            >
              <Upload className="h-4 w-4" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div>
            <div className="font-bold text-lg">{displayName}</div>
            <div className="text-muted text-sm mt-1">هنرجو</div>

            <div className="flex items-center gap-3 mt-3">
              <button
                type="button"
                onClick={handleAvatarClick}
                className="flex items-center gap-1.5 text-xs text-gold hover:underline"
              >
                <Upload className="h-3.5 w-3.5" />
                {avatarPreview ? "تغییر عکس" : "آپلود عکس"}
              </button>

              {avatarPreview && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="text-xs text-red-400 hover:underline"
                >
                  حذف عکس
                </button>
              )}
            </div>
          </div>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="name">نام و نام‌خانوادگی</Label>
              <Input id="name" defaultValue={displayName} />
            </div>
            <div>
              <Label htmlFor="city">شهر</Label>
              <Input id="city" defaultValue="اصفهان" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="email">ایمیل</Label>
              <Input id="email" defaultValue="" placeholder="you@email.com" />
            </div>
            <div>
              <Label htmlFor="phone">شماره موبایل</Label>
              <Input id="phone" defaultValue="" placeholder="۰۹۱۲۳۴۵۶۷۸۹" />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">درباره‌ی من</Label>
            <Textarea
              id="bio"
              defaultValue="از دو سال پیش ویولن یاد می‌گیرم و علاقه‌ی خاصی به قطعات رمانتیک دارم."
            />
          </div>

          <div className="flex gap-3 pt-3">
            <Button type="button" onClick={handleSave}>
              ذخیره تغییرات
            </Button>
            <Button type="button" variant="outline">
              انصراف
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}