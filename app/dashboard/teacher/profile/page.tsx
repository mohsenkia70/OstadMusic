"use client";

import { useRef } from "react";
import { Camera, Upload, UserRound } from "lucide-react";

import { DashPageHeader } from "@/components/dashboard/shared";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProfileStore } from "@/lib/store/profile-store";

export default function TeacherProfilePage() {
  const { avatarPreview, setAvatarPreview, clearAvatar } = useProfileStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

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
      const base64 = reader.result as string;
      setAvatarPreview(base64);
    };
    reader.readAsDataURL(selected);
  };

  const handleSave = () => {
    // اینجا بعداً فایل رو به سرور آپلود کن
    console.log("avatar base64 length:", avatarPreview?.length);
    alert("تغییرات با موفقیت ذخیره شد");
  };

  const handleRemoveAvatar = () => {
    clearAvatar();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <DashPageHeader
        title="پروفایل من"
        desc="این اطلاعات برای شاگردان روی صفحه‌ی عمومی‌ات نمایش داده می‌شود."
      />

      <div className="rounded-2xl border border-line bg-surface p-7 max-w-2xl">
        {/* Avatar Section */}
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
            <div className="font-bold text-lg">نگار احمدی</div>
            <div className="text-muted text-sm mt-1">استاد از ۱۴۰۱</div>

            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={handleAvatarClick}
                className="flex items-center gap-1.5 text-xs text-gold hover:underline"
              >
                <Upload className="h-3.5 w-3.5" />
                {avatarPreview ? "تغییر عکس" : "آپلود عکس"}
              </button>

              {avatarPreview && (
                <button
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
              <Label>نام و نام‌خانوادگی</Label>
              <Input defaultValue="نگار احمدی" />
            </div>

            <div>
              <Label>شهر</Label>
              <Input defaultValue="تهران" />
            </div>
          </div>

          <div>
            <Label>تخصص</Label>
            <Input defaultValue="ویولن کلاسیک، آماده‌سازی کنکور هنر" />
          </div>

          <div>
            <Label>هزینه‌ی هر جلسه (تومان)</Label>
            <Input defaultValue="۴۵۰,۰۰۰" />
          </div>

          <div>
            <Label>بیوگرافی</Label>
            <Textarea defaultValue="فارغ‌التحصیل آهنگسازی و نوازندگی ویولن، با ۱۲ سال سابقه‌ی تدریس." />
          </div>

          <div>
            <Label>برچسب‌های تخصص</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {["کلاسیک", "کنکور هنر", "حضوری"].map((tag) => (
                <Badge key={tag} variant="gold">
                  {tag}
                </Badge>
              ))}
            </div>
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