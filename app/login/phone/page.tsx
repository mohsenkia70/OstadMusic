"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, Phone } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { OtpInput } from "@/components/otp-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    if (step !== "otp") return;
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [step, countdown]);

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
        <form onSubmit={handleSendCode} className="space-y-6" noValidate>
          <div className="space-y-2.5">
            <Label htmlFor="phone" className="text-[#d4cfc4] text-[13.5px] font-medium">
              شماره موبایل
            </Label>
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#d4a84b]/15 to-[#0d9488]/15 opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-500" />
              <div className="relative">
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#8a8278] group-focus-within:text-[#d4a84b] transition-colors duration-300" />
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  dir="ltr"
                  placeholder="۰۹۱۲ ۳۴۵ ۶۷۸۹"
                  className={cn(
                    "h-14 pr-12 text-left text-[16px] rounded-2xl",
                    "bg-[#16140f]/75 border-[#2c2822] text-[#f5f0e6]",
                    "placeholder:text-[#5e574e]",
                    "focus-visible:ring-2 focus-visible:ring-[#d4a84b]/35 focus-visible:border-[#d4a84b]/45",
                    "transition-all duration-300"
                  )}
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (phoneError) setPhoneError("");
                  }}
                  aria-invalid={Boolean(phoneError)}
                />
              </div>
            </div>
            {phoneError && (
              <p className="text-[13px] text-red-400/90 mt-1.5 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400" />
                {phoneError}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className={cn(
              "w-full h-14 rounded-2xl text-[15.5px] font-semibold",
              "bg-gradient-to-l from-[#d4a84b] via-[#e0b85c] to-[#d4a84b]",
              "text-[#1a160f] hover:brightness-110",
              "shadow-[0_10px_36px_rgba(212,168,75,0.28)]",
              "transition-all duration-300 active:scale-[0.985]"
            )}
          >
            دریافت کد تایید
          </Button>

          <p className="text-[12.5px] text-[#6f685e] text-center leading-6 pt-1">
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
          className="text-[#d4a84b] font-semibold hover:underline underline-offset-4 transition-all disabled:opacity-40"
          disabled={status !== "idle"}
        >
          ویرایش شماره موبایل
        </button>
      }
    >
      <div className="space-y-8">
        <OtpInput
          key={otpKey}
          length={5}
          disabled={status !== "idle"}
          onComplete={handleOtpComplete}
        />

        <div className="min-h-[56px] flex flex-col items-center justify-center">
          {status === "verifying" && (
            <div className="flex items-center gap-2.5 text-[14px] text-[#a89f8f]">
              <Loader2 className="h-4 w-4 animate-spin text-[#d4a84b]" />
              در حال بررسی کد...
            </div>
          )}

          {status === "success" && (
            <div className="flex items-center gap-2.5 text-[14px] text-[#d4a84b]">
              <CheckCircle2 className="h-5 w-5" />
              کد تایید شد، در حال ورود به حساب...
            </div>
          )}

          {status === "idle" && (
            <div className="text-[13px] text-[#8a8278]">
              {countdown > 0 ? (
                <span>
                  ارسال دوباره‌ی کد تا{" "}
                  <span className="text-[#d4a84b] font-medium tabular-nums">
                    {toPersianDigits(String(countdown))}
                  </span>{" "}
                  ثانیه‌ی دیگر
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-[#d4a84b] font-semibold hover:underline underline-offset-4 transition-all"
                >
                  ارسال دوباره‌ی کد
                </button>
              )}
            </div>
          )}

          {resendHint && (
            <p className="text-[12.5px] text-[#14b8a6] mt-3">کد جدید ارسال شد</p>
          )}
        </div>
      </div>
    </AuthShell>
  );
}