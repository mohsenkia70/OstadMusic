"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { AuthShell } from "@/components/auth-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type ResetForm = { password: string; confirm: string };

export default function ResetPasswordPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetForm>();

  return (
    <AuthShell title="ساخت رمز عبور جدید" subtitle="یک رمز عبور قوی برای حساب کاربری‌ات انتخاب کن.">
      <form onSubmit={handleSubmit(() => router.push("/login"))} className="space-y-5">
        <div>
          <Label htmlFor="password">رمز عبور جدید</Label>
          <Input
            id="password"
            type="password"
            placeholder="حداقل ۸ کاراکتر"
            {...register("password", { required: true, minLength: 8 })}
          />
          {errors.password && <p className="text-xs text-red-600 mt-1.5">رمز عبور باید حداقل ۸ کاراکتر باشد</p>}
        </div>
        <div>
          <Label htmlFor="confirm">تکرار رمز عبور</Label>
          <Input
            id="confirm"
            type="password"
            placeholder="رمز عبور را دوباره وارد کن"
            {...register("confirm", {
              required: true,
              validate: (v) => v === watch("password") || "رمزهای عبور یکسان نیستند",
            })}
          />
          {errors.confirm && <p className="text-xs text-red-600 mt-1.5">{errors.confirm.message}</p>}
        </div>
        <Button type="submit" size="lg" className="w-full">
          تغییر رمز عبور
        </Button>
      </form>
    </AuthShell>
  );
}
