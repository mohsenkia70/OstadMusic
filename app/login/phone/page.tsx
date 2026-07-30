"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, Phone } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { OtpInput } from "@/components/otp-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const RESEND_SECONDS = 60;

const toPersianDigits = (value: string) =>
  value.replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

const toLatinDigits = (value: string) =>
  value.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));

function isValidIranianMobile(raw: string) {
  const digits = toLatinDigits(raw).replace(/[^0-9]/g, "");
  return /^0?9\d{9}$/.test(digits);
}

function formatPhoneDisplay(raw: string) {
  const digits = toLatinDigits(raw).replace(/[^0-9]/g, "");
  const withZero = digits.startsWith("9") ? `0${digits}` : digits;
  const grouped = withZero.replace(/^(\d{4})(\d{3})(\d{4})$/, "$1 $2 $3");
  return toPersianDigits(grouped);
}

type Step = "phone" | "otp";

export default function PhoneLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otpKey, setOtpKey] = useState(0);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [status, setStatus] = useState<"idle" | "verifying" | "success">("idle");
  const [resendHint, setResendHint] = useState(false);
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Resend countdown, only ticks while on the OTP step
  useEffect(() => {
    if (step !== "otp") return;
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [step, countdown]);

  // Clean up any pending redirect if the component unmounts mid-flow
  useEffect(() => {
    return () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    };
  }, []);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidIranianMobile(phone)) {
      setPhoneError("شماره موبایل را درست وارد کن؛ مثلا ۰۹۱۲۳۴۵۶۷۸۹");
      return;
    }
    setPhoneError("");
    setStep("otp");
    setCountdown(RESEND_SECONDS);
    setStatus("idle");
    setOtpKey((k) => k + 1);
  };

  const handleEditPhone = () => {
    setStep("phone");
    setStatus("idle");
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(RESEND_SECONDS);
    setOtpKey((k) => k + 1);
    setStatus("idle");
    setResendHint(true);
    setTimeout(() => setResendHint(false), 3000);
  };

  const handleOtpComplete = () => {
    setStatus("verifying");
    redirectTimer.current = setTimeout(() => {
      setStatus("success");
      redirectTimer.current = setTimeout(() => {
        router.push("/dashboard/student");
      }, 700);
    }, 900);
  };

  if (step === "phone") {
    return (
      <AuthShell
        title="ورود با شماره موبایل"
        subtitle="شماره موبایلت را وارد کن تا کد تایید برایت پیامک شود."
      >
        <form onSubmit={handleSendCode} className="space-y-5" noValidate>
          <div>
            <Label htmlFor="phone">شماره موبایل</Label>
            <div className="relative">
              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <Input
                id="phone"
                type="tel"
                inputMode="numeric"
                dir="ltr"
                placeholder="۰۹۱۲ ۳۴۵ ۶۷۸۹"
                className="pr-11 text-left"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (phoneError) setPhoneError("");
                }}
                aria-invalid={Boolean(phoneError)}
              />
            </div>
            {phoneError && <p className="text-xs text-red-600 mt-1.5">{phoneError}</p>}
          </div>

          <Button type="submit" size="lg" className="w-full">
            دریافت کد تایید
          </Button>

          <p className="text-xs text-muted text-center leading-6">
            با ادامه، شرایط استفاده و حریم خصوصی استاد موزیک را می‌پذیری.
          </p>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="کد تایید را وارد کن"
      subtitle={`کد ۵ رقمی به شماره ${formatPhoneDisplay(phone)} پیامک شد.`}
      footer={
        <button
          type="button"
          onClick={handleEditPhone}
          className="text-gold font-semibold hover:underline"
          disabled={status !== "idle"}
        >
          ویرایش شماره موبایل
        </button>
      }
    >
      <div className="space-y-6">
        <OtpInput key={otpKey} length={5} disabled={status !== "idle"} onComplete={handleOtpComplete} />

        <div className="min-h-[52px]">
          {status === "verifying" && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted">
              <Loader2 className="h-4 w-4 animate-spin text-gold" />
              در حال بررسی کد...
            </div>
          )}
          {status === "success" && (
            <div className="flex items-center justify-center gap-2 text-sm text-gold">
              <CheckCircle2 className="h-4 w-4" />
              کد تایید شد، در حال ورود به حساب...
            </div>
          )}
          {status === "idle" && (
            <div className="flex items-center justify-center text-xs text-muted">
              {countdown > 0 ? (
                <span>ارسال دوباره‌ی کد تا {toPersianDigits(String(countdown))} ثانیه‌ی دیگر</span>
              ) : (
                <button type="button" onClick={handleResend} className="text-gold font-semibold hover:underline">
                  ارسال دوباره‌ی کد
                </button>
              )}
            </div>
          )}
          {resendHint && (
            <p className="text-center text-xs text-gold mt-2">کد جدید ارسال شد</p>
          )}
        </div>
      </div>
    </AuthShell>
  );
}
