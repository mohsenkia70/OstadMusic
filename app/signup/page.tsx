"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { GraduationCap, Music2 } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SignupForm = { name: string; email: string; password: string };

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "teacher">("student");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>();

  const onSubmit = () => {
    router.push("/otp");
  };

  return (
    <AuthShell
      title="ساخت حساب کاربری"
      subtitle="در کمتر از یک دقیقه به جمع استاد موزیک بپیوند."
      footer={
        <>
          قبلا ثبت‌نام کردی؟{" "}
          <Link href="/login" className="text-gold font-semibold hover:underline">
            وارد شو
          </Link>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3 mb-7">
        <button
          type="button"
          onClick={() => setRole("student")}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm transition-colors",
            role === "student" ? "border-gold/50 bg-gold-soft text-gold" : "border-line text-muted"
          )}
        >
          <GraduationCap className="h-5 w-5" />
          شاگرد هستم
        </button>
        <button
          type="button"
          onClick={() => setRole("teacher")}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm transition-colors",
            role === "teacher" ? "border-gold/50 bg-gold-soft text-gold" : "border-line text-muted"
          )}
        >
          <Music2 className="h-5 w-5" />
          استاد هستم
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="name">نام و نام‌خانوادگی</Label>
          <Input id="name" placeholder="مثلا مهسا رستمی" {...register("name", { required: true })} />
          {errors.name && <p className="text-xs text-red-600 mt-1.5">این فیلد الزامی است</p>}
        </div>
        <div>
          <Label htmlFor="email">ایمیل یا شماره موبایل</Label>
          <Input id="email" placeholder="you@email.com" {...register("email", { required: true })} />
          {errors.email && <p className="text-xs text-red-600 mt-1.5">این فیلد الزامی است</p>}
        </div>
        <div>
          <Label htmlFor="password">رمز عبور</Label>
          <Input id="password" type="password" placeholder="حداقل ۸ کاراکتر" {...register("password", { required: true, minLength: 8 })} />
          {errors.password && <p className="text-xs text-red-600 mt-1.5">رمز عبور باید حداقل ۸ کاراکتر باشد</p>}
        </div>

        <Button type="submit" size="lg" className="w-full">
          {role === "student" ? "ساخت حساب شاگرد" : "ساخت حساب استاد"}
        </Button>

        <p className="text-xs text-muted text-center leading-6">
          با ثبت‌نام، شرایط استفاده و حریم خصوصی استاد موزیک را می‌پذیری.
        </p>
      </form>
    </AuthShell>
  );
}
