"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/auth-store";
import { cn } from "@/lib/utils";

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

    const role = user.role?.toLowerCase();

    if (role === "admin") {
      router.push("/dashboard/admin/teachers");
    } else if (role === "teacher") {
      router.push("/dashboard/teacher");
    } else if (role === "student") {
      router.push("/dashboard/student");
    } else {
      router.push("/");
    }
  } catch {
    const currentError = useAuthStore.getState().error;

    toast.error("ورود ناموفق بود", {
      description:
        currentError || "ایمیل/موبایل یا رمز عبور نادرست است.",
    });
  }
};
  return (
    <AuthShell
      title="خوش اومدی"
      subtitle="برای ادامه‌ی مسیرت وارد حساب کاربری‌ات شو."
      footer={
        <>
          حساب کاربری نداری؟{" "}
          <Link
            href="/signup"
            className="text-[#d4a84b] font-semibold hover:underline underline-offset-4"
          >
            ثبت‌نام کن
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>

        <div className="space-y-1.5">
          <Label
            htmlFor="emailOrPhone"
            className="text-[#d4cfc4] text-[12.5px] font-medium"
          >
            ایمیل یا شماره موبایل
          </Label>
          <Input
            id="emailOrPhone"
            placeholder="you@email.com"
            onFocus={clearError}
            className={cn(
              "h-10.5 rounded-xl text-[14px]",
              "bg-[#16140f]/75 border-[#2c2822] text-[#f5f0e6]",
              "placeholder:text-[#5e574e]",
              "focus-visible:ring-2 focus-visible:ring-[#d4a84b]/35 focus-visible:border-[#d4a84b]/45",
              "transition-all duration-300"
            )}
            {...register("emailOrPhone", { required: true })}
          />
          {errors.emailOrPhone && (
            <p className="text-[11.5px] text-red-400/90 mt-0.5">
              این فیلد الزامی است
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-[#d4cfc4] text-[12.5px] font-medium mb-0"
            >
              رمز عبور
            </Label>
            <Link
              href="/forgot-password"
              className="text-[11.5px] text-[#d4a84b] hover:underline underline-offset-4"
            >
              فراموشی رمز عبور؟
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={cn(
                "h-10.5 pl-10 rounded-xl text-[14px]",
                "bg-[#16140f]/75 border-[#2c2822] text-[#f5f0e6]",
                "placeholder:text-[#5e574e]",
                "focus-visible:ring-2 focus-visible:ring-[#d4a84b]/35 focus-visible:border-[#d4a84b]/45",
                "transition-all duration-300"
              )}
              onFocus={clearError}
              {...register("password", { required: true })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8278] hover:text-[#d4a84b] transition-colors"
              aria-label="نمایش رمز عبور"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11.5px] text-red-400/90 mt-0.5">
              این فیلد الزامی است
            </p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          className={cn(
            "w-full h-10.5 rounded-xl text-[14px] font-semibold gap-2",
            "bg-gradient-to-l from-[#d4a84b] via-[#e0b85c] to-[#d4a84b]",
            "text-[#1a160f] hover:brightness-110",
            "shadow-[0_6px_24px_rgba(212,168,75,0.22)]",
            "transition-all duration-300 active:scale-[0.985]"
          )}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          ورود به حساب
        </Button>

        <div className="relative py-1 text-center text-[11.5px] text-[#6f685e]">
          <span className="relative bg-[#0a0908] px-3">یا</span>
          <div className="absolute inset-x-0 top-1/2 h-px bg-[#2c2822] -z-10" />
        </div>

        <Button
          asChild
          variant="outline"
          type="button"
          size="lg"
          className={cn(
            "w-full h-10.5 rounded-xl text-[13px] font-medium",
            "border-[#2c2822] bg-[#16140f]/50 text-[#d4cfc4]",
            "hover:bg-[#1c1914] hover:border-[#d4a84b]/30 hover:text-[#f5f0e6]",
            "transition-all duration-300"
          )}
        >
          <Link href="/login/phone">ورود با شماره موبایل و کد یک‌بار‌مصرف</Link>
        </Button>
      </form>
    </AuthShell>
  );
}