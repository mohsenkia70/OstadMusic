"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { MailCheck } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type ForgotForm = { email: string };

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>();

  return (
    <AuthShell
      title="بازیابی رمز عبور"
      subtitle="ایمیلت را وارد کن تا لینک بازیابی برایت ارسال شود."
      footer={
        <>
          رمزت را به یاد آوردی؟{" "}
          <Link href="/login" className="text-gold font-semibold hover:underline">
            بازگشت به ورود
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="flex flex-col items-center text-center py-10">
          <MailCheck className="h-12 w-12 text-gold mb-5" />
          <h3 className="font-bold mb-2">ایمیل ارسال شد</h3>
          <p className="text-muted text-sm">
            لینک بازیابی رمز عبور را برایت ایمیل کردیم. صندوق ورودی‌ات را بررسی کن.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(() => setSent(true))} className="space-y-5">
          <div>
            <Label htmlFor="email">ایمیل</Label>
            <Input id="email" placeholder="you@email.com" {...register("email", { required: true })} />
            {errors.email && <p className="text-xs text-red-600 mt-1.5">این فیلد الزامی است</p>}
          </div>
          <Button type="submit" size="lg" className="w-full">
            ارسال لینک بازیابی
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
