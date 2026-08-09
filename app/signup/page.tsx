"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  GraduationCap,
  Music2,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { AuthShell } from "@/components/auth-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth-store";

type SignupForm = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
};

export default function SignupPage() {
  const router = useRouter();

  const [role, setRole] = useState<"student" | "teacher">("student");

  const registerStudent = useAuthStore((state) => state.registerStudent);
  const registerTeacher = useAuthStore((state) => state.registerTeacher);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>();

  function splitName(fullName: string) {
    const parts = fullName.trim().split(" ");
    return {
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" ") || "-",
    };
  }

  const onSubmit = async (data: SignupForm) => {
    try {
      clearError();

      const { firstName, lastName } = splitName(data.fullName);

      let user;

      if (role === "student") {
        user = await registerStudent({
          firstName,
          lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          password: data.password,
          city: "تهران",
          district: "تهران",
          learningGoal: "یادگیری موسیقی",
        });
      } else {
        user = await registerTeacher({
          firstName,
          lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          password: data.password,
          city: "",
          district: "",
          bio: "",
          yearsOfExperience: 0,
          hourlyRate: 0,
          musicCategoryIds: [],
        });
      }

      if (user.role === "Teacher") {
        router.push("/dashboard/teacher");
      } else {
        router.push("/dashboard/student");
      }
    } catch {
      // Error is already handled inside Zustand store
    }
  };

  return (
    <AuthShell
      title="ساخت حساب کاربری"
      subtitle="در کمتر از یک دقیقه به جمع استاد موزیک بپیوند."
      footer={
        <>
          قبلا ثبت‌نام کردی؟{" "}
          <Link
            href="/login"
            className="text-[#d4a84b] font-semibold hover:underline underline-offset-4"
          >
            وارد شو
          </Link>
        </>
      }
    >
      {/* Role Selector */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button
          type="button"
          onClick={() => {
            clearError();
            setRole("student");
          }}
          className={cn(
            "flex flex-col items-center gap-2.5 rounded-2xl border p-4 text-[13.5px] font-medium transition-all duration-300",
            role === "student"
              ? "border-[#d4a84b]/50 bg-[#d4a84b]/10 text-[#d4a84b] shadow-[0_0_24px_rgba(212,168,75,0.12)]"
              : "border-[#2c2822] text-[#8a8278] hover:border-[#3a352e] hover:text-[#b0a69a]"
          )}
        >
          <GraduationCap className="h-5 w-5" />
          هنرجو هستم
        </button>

        <button
          type="button"
          onClick={() => {
            clearError();
            setRole("teacher");
          }}
          className={cn(
            "flex flex-col items-center gap-2.5 rounded-2xl border p-4 text-[13.5px] font-medium transition-all duration-300",
            role === "teacher"
              ? "border-[#d4a84b]/50 bg-[#d4a84b]/10 text-[#d4a84b] shadow-[0_0_24px_rgba(212,168,75,0.12)]"
              : "border-[#2c2822] text-[#8a8278] hover:border-[#3a352e] hover:text-[#b0a69a]"
          )}
        >
          <Music2 className="h-5 w-5" />
          استاد هستم
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {error && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-red-500/10 border border-red-500/20 p-3.5 text-[13px] text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Full Name */}
        <div className="space-y-2.5">
          <Label
            htmlFor="fullName"
            className="text-[#d4cfc4] text-[13.5px] font-medium"
          >
            نام و نام خانوادگی
          </Label>
          <Input
            id="fullName"
            placeholder="مثلا محسن کیا"
            onFocus={clearError}
            className={cn(
              "h-14 rounded-2xl text-[15px]",
              "bg-[#16140f]/75 border-[#2c2822] text-[#f5f0e6]",
              "placeholder:text-[#5e574e]",
              "focus-visible:ring-2 focus-visible:ring-[#d4a84b]/35 focus-visible:border-[#d4a84b]/45",
              "transition-all duration-300"
            )}
            {...register("fullName", { required: true })}
          />
          {errors.fullName && (
            <p className="text-[13px] text-red-400/90 mt-1.5">
              این فیلد الزامی است
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2.5">
          <Label
            htmlFor="email"
            className="text-[#d4cfc4] text-[13.5px] font-medium"
          >
            ایمیل
          </Label>
          <Input
            id="email"
            placeholder="example@gmail.com"
            onFocus={clearError}
            className={cn(
              "h-14 rounded-2xl text-[15px]",
              "bg-[#16140f]/75 border-[#2c2822] text-[#f5f0e6]",
              "placeholder:text-[#5e574e]",
              "focus-visible:ring-2 focus-visible:ring-[#d4a84b]/35 focus-visible:border-[#d4a84b]/45",
              "transition-all duration-300"
            )}
            {...register("email", { required: true })}
          />
          {errors.email && (
            <p className="text-[13px] text-red-400/90 mt-1.5">
              ایمیل الزامی است
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2.5">
          <Label
            htmlFor="phoneNumber"
            className="text-[#d4cfc4] text-[13.5px] font-medium"
          >
            شماره تماس
          </Label>
          <Input
            id="phoneNumber"
            placeholder="09123456789"
            onFocus={clearError}
            className={cn(
              "h-14 rounded-2xl text-[15px]",
              "bg-[#16140f]/75 border-[#2c2822] text-[#f5f0e6]",
              "placeholder:text-[#5e574e]",
              "focus-visible:ring-2 focus-visible:ring-[#d4a84b]/35 focus-visible:border-[#d4a84b]/45",
              "transition-all duration-300"
            )}
            {...register("phoneNumber", { required: true })}
          />
          {errors.phoneNumber && (
            <p className="text-[13px] text-red-400/90 mt-1.5">
              شماره تماس الزامی است
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2.5">
          <Label
            htmlFor="password"
            className="text-[#d4cfc4] text-[13.5px] font-medium"
          >
            رمز عبور
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="حداقل ۸ کاراکتر"
            onFocus={clearError}
            className={cn(
              "h-14 rounded-2xl text-[15px]",
              "bg-[#16140f]/75 border-[#2c2822] text-[#f5f0e6]",
              "placeholder:text-[#5e574e]",
              "focus-visible:ring-2 focus-visible:ring-[#d4a84b]/35 focus-visible:border-[#d4a84b]/45",
              "transition-all duration-300"
            )}
            {...register("password", { required: true, minLength: 8 })}
          />
          {errors.password && (
            <p className="text-[13px] text-red-400/90 mt-1.5">
              رمز عبور باید حداقل ۸ کاراکتر باشد
            </p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          className={cn(
            "w-full h-14 rounded-2xl text-[15.5px] font-semibold gap-2 mt-2",
            "bg-gradient-to-l from-[#d4a84b] via-[#e0b85c] to-[#d4a84b]",
            "text-[#1a160f] hover:brightness-110",
            "shadow-[0_10px_36px_rgba(212,168,75,0.28)]",
            "transition-all duration-300 active:scale-[0.985]"
          )}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {role === "student" ? "ساخت حساب هنرجو" : "ساخت حساب استاد"}
        </Button>

        <p className="text-[12.5px] text-[#6f685e] text-center leading-6 pt-1">
          با ثبت‌نام، شرایط استفاده و حریم خصوصی استاد موزیک را می‌پذیری.
        </p>
      </form>
    </AuthShell>
  );
}