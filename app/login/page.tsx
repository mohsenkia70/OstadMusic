"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/auth-store";

type LoginForm = { emailOrPhone: string; password: string };

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      const user = await login(data.emailOrPhone, data.password);
      router.push(user.role === "Teacher" ? "/dashboard/teacher" : "/dashboard/student");
    } catch {
      // error message is already set on the store and rendered below
    }
  };

  return (
    <AuthShell
      title="خوش اومدی"
      subtitle="برای ادامه‌ی مسیرت وارد حساب کاربری‌ات شو."
      footer={
        <>
          حساب کاربری نداری؟{" "}
          <Link href="/signup" className="text-gold font-semibold hover:underline">
            ثبت‌نام کن
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {error && (
          <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <div>
          <Label htmlFor="emailOrPhone">ایمیل یا شماره موبایل</Label>
          <Input
            id="emailOrPhone"
            placeholder="you@email.com"
            onFocus={clearError}
            {...register("emailOrPhone", { required: true })}
          />
          {errors.emailOrPhone && <p className="text-xs text-red-600 mt-1.5">این فیلد الزامی است</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="password" className="mb-0">
              رمز عبور
            </Label>
            <Link href="/forgot-password" className="text-xs text-gold hover:underline">
              فراموشی رمز عبور؟
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-11"
              onFocus={clearError}
              {...register("password", { required: true })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              aria-label="نمایش رمز عبور"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-600 mt-1.5">این فیلد الزامی است</p>}
        </div>

        <Button type="submit" size="lg" className="w-full gap-2" disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          ورود به حساب
        </Button>

        <div className="relative py-2 text-center text-xs text-muted">
          <span className="relative bg-bg px-3">یا</span>
          <div className="absolute inset-x-0 top-1/2 h-px bg-line -z-10" />
        </div>

        <Button asChild variant="glass" type="button" className="w-full" size="lg">
          <Link href="/login/phone">ورود با شماره موبایل و کد یک‌بار‌مصرف</Link>
        </Button>
      </form>
    </AuthShell>
  );
}
