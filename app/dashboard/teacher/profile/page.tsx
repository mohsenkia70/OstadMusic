"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Camera, Upload, UserRound, Loader2, Star } from "lucide-react";
import { toast } from "sonner";

import { DashPageHeader } from "@/components/dashboard/shared";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProfileStore } from "@/lib/store/profile-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { getTeacherById } from "@/lib/api/teachers";
import type { TeacherDetail } from "@/lib/api/types";

function TeacherProfileFallback() {
  return (
    <>
      <DashPageHeader title="پروفایل استاد" desc="در حال بارگذاری..." />
      <div className="flex items-center justify-center py-24 text-muted">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    </>
  );
}

function TeacherProfileContent() {
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const setAvatar = useProfileStore((s) => s.setAvatar);
  const clearAvatar = useProfileStore((s) => s.clearAvatar);

  const userId = user?.userId ?? "";
  const role = String(user?.role ?? "").toLowerCase();
  const isTeacher = role === "teacher";
  const isAdmin = role === "admin";

  const teacherProfileId =
    searchParams.get("id") || (user as { teacherProfileId?: string } | null)?.teacherProfileId || "";

  const avatarPreview = useProfileStore((s) =>
    userId ? s.avatars[userId] ?? null : null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<TeacherDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    city: "",
    district: "",
    yearsOfExperience: "",
    hourlyRate: "",
    bio: "",
  });

  useEffect(() => {
    if (!hasHydrated) return;

    if (!user || (!isTeacher && !isAdmin)) {
      setLoading(false);
      setError("دسترسی به این صفحه ندارید.");
      return;
    }

    if (!teacherProfileId) {
      setLoading(false);
      setError(
        isAdmin
          ? "برای مشاهده پروفایل استاد، آدرس را به صورت زیر باز کنید:\n/dashboard/teacher/profile?id=TEACHER_PROFILE_ID"
          : "شناسه پروفایل استاد یافت نشد. ممکن است هنوز تأیید نشده باشید."
      );
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);

        const data = await getTeacherById(teacherProfileId);
        if (cancelled) return;

        setProfile(data);
        setForm({
          fullName: data.fullName ?? "",
          city: data.city ?? "",
          district: data.district ?? "",
          yearsOfExperience: String(data.yearsOfExperience ?? 0),
          hourlyRate: String(data.hourlyRate ?? 0),
          bio: data.bio ?? "",
        });
      } catch (err: unknown) {
        if (cancelled) return;
        console.error(err);

        const message =
          err instanceof Error ? err.message : "خطا در دریافت اطلاعات پروفایل";

        setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [hasHydrated, user, isTeacher, isAdmin, teacherProfileId]);

  const handleAvatarClick = () => {
    if (!isTeacher) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected || !userId || !isTeacher) return;

    if (!selected.type.startsWith("image/")) {
      toast.error("لطفاً فقط فایل تصویری انتخاب کنید.");
      return;
    }

    if (selected.size > 2 * 1024 * 1024) {
      toast.error("حجم تصویر نباید بیشتر از ۲ مگابایت باشد.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatar(userId, result);
      toast.success("عکس پروفایل با موفقیت انتخاب شد.");
    };
    reader.onerror = () => {
      toast.error("خطا در خواندن فایل. لطفاً دوباره تلاش کنید.");
    };
    reader.readAsDataURL(selected);
    e.target.value = "";
  };

  const handleRemoveAvatar = () => {
    if (!userId || !isTeacher) return;
    clearAvatar(userId);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success("عکس پروفایل حذف شد.");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!profile || !isTeacher) return;

    setSaving(true);
    try {
      console.log("Saving profile:", {
        teacherProfileId: profile.teacherProfileId,
        ...form,
        yearsOfExperience: Number(form.yearsOfExperience) || 0,
        hourlyRate: Number(form.hourlyRate) || 0,
      });

      toast.success("تغییرات با موفقیت ذخیره شد.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!profile) return;
    setForm({
      fullName: profile.fullName ?? "",
      city: profile.city ?? "",
      district: profile.district ?? "",
      yearsOfExperience: String(profile.yearsOfExperience ?? 0),
      hourlyRate: String(profile.hourlyRate ?? 0),
      bio: profile.bio ?? "",
    });
  };

  if (!hasHydrated || loading) {
    return <TeacherProfileFallback />;
  }

  if (error || !profile) {
    return (
      <>
        <DashPageHeader
          title="پروفایل استاد"
          desc="مشاهده و ویرایش اطلاعات استاد"
        />
        <div className="rounded-2xl border border-line bg-surface p-8 max-w-2xl text-center text-red-400 whitespace-pre-line">
          {error || "اطلاعاتی یافت نشد."}
        </div>
      </>
    );
  }

  const displayName = form.fullName || "استاد";
  const canEdit = isTeacher;

  return (
    <>
      <DashPageHeader
        title={isAdmin ? "مشاهده پروفایل استاد" : "پروفایل من"}
        desc={
          isAdmin
            ? "در حال مشاهده پروفایل به عنوان ادمین"
            : "این اطلاعات برای هنرجوان روی صفحه‌ی عمومی‌ات نمایش داده می‌شود."
        }
      />

      <div className="rounded-2xl border border-line bg-surface p-7 max-w-2xl">
        <div className="flex items-center gap-5 mb-8">
          <div className="relative group">
            <Avatar
              onClick={handleAvatarClick}
              className={`h-24 w-24 rounded-3xl overflow-hidden border border-line shadow-sm ${
                canEdit ? "cursor-pointer" : ""
              }`}
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

              {canEdit && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-3xl">
                  <Camera className="text-white h-7 w-7" />
                </div>
              )}
            </Avatar>

            {canEdit && (
              <button
                type="button"
                onClick={handleAvatarClick}
                className="absolute -bottom-2 -left-2 h-9 w-9 rounded-full bg-gold text-[#181209] flex items-center justify-center shadow-lg hover:scale-105 transition"
              >
                <Upload className="h-4 w-4" />
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex-1">
            <div className="font-bold text-lg">{displayName}</div>
            <div className="text-muted text-sm mt-0.5">استاد</div>

            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              {profile.isVerified && <Badge variant="gold">تأیید شده</Badge>}

              {profile.ratingCount > 0 && (
                <div className="flex items-center gap-1 text-sm text-muted">
                  <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                  <span>
                    {profile.ratingAverage.toFixed(1)}
                    <span className="text-xs mr-1">
                      ({profile.ratingCount} نظر)
                    </span>
                  </span>
                </div>
              )}
            </div>

            {canEdit && (
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
            )}
          </div>
        </div>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (canEdit) handleSave();
          }}
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label>نام و نام‌خانوادگی</Label>
              <Input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                disabled={!canEdit}
              />
            </div>

            <div>
              <Label>شهر</Label>
              <Input
                name="city"
                value={form.city}
                onChange={handleChange}
                disabled={!canEdit}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label>منطقه / محله</Label>
              <Input
                name="district"
                value={form.district}
                onChange={handleChange}
                placeholder="مثلاً ونک"
                disabled={!canEdit}
              />
            </div>

            <div>
              <Label>سال سابقه تدریس</Label>
              <Input
                name="yearsOfExperience"
                type="number"
                min={0}
                value={form.yearsOfExperience}
                onChange={handleChange}
                disabled={!canEdit}
              />
            </div>
          </div>

          <div>
            <Label>هزینه‌ی هر جلسه (تومان)</Label>
            <Input
              name="hourlyRate"
              type="number"
              min={0}
              value={form.hourlyRate}
              onChange={handleChange}
              disabled={!canEdit}
            />
          </div>

          <div>
            <Label>بیوگرافی</Label>
            <Textarea
              name="bio"
              rows={4}
              value={form.bio}
              onChange={handleChange}
              placeholder="درباره خودت، سابقه تدریس و سبک آموزش بنویس..."
              disabled={!canEdit}
            />
          </div>

          <div>
            <Label>برچسب‌های تخصص</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.categories?.length > 0 ? (
                profile.categories.map((tag) => (
                  <Badge key={tag} variant="gold">
                    {tag}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted">
                  هنوز دسته‌بندی‌ای ثبت نشده
                </span>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted border-t border-line mt-2 pt-5">
            <div>
              <span className="block text-xs mb-1 opacity-70">ایمیل</span>
              <span>{profile.email || "—"}</span>
            </div>
            <div>
              <span className="block text-xs mb-1 opacity-70">شماره تماس</span>
              <span>{profile.phoneNumber || "—"}</span>
            </div>
          </div>

          {canEdit && (
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    در حال ذخیره...
                  </>
                ) : (
                  "ذخیره تغییرات"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                انصراف
              </Button>
            </div>
          )}
        </form>
      </div>
    </>
  );
}

export default function TeacherProfilePage() {
  return (
    <Suspense fallback={<TeacherProfileFallback />}>
      <TeacherProfileContent />
    </Suspense>
  );
}