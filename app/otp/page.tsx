"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";

const LENGTH = 5;

export default function OtpPage() {
  const router = useRouter();
  const [values, setValues] = useState<string[]>(Array(LENGTH).fill(""));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...values];
    next[i] = val;
    setValues(next);
    if (val && i < LENGTH - 1) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !values[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const complete = values.every((v) => v.length === 1);

  return (
    <AuthShell
      title="کد تایید را وارد کن"
      subtitle="کد ۵ رقمی به شماره موبایلت پیامک شد."
      footer={
        <button className="text-gold font-semibold hover:underline" type="button">
          ارسال دوباره‌ی کد
        </button>
      }
    >
      <div className="flex gap-3 justify-between mb-8" dir="ltr">
        {values.map((v, i) => (
          <input
            key={i}
            ref={(el) => {
              inputs.current[i] = el;
            }}
            value={v}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            inputMode="numeric"
            maxLength={1}
            className="h-14 w-14 rounded-xl border border-line bg-surface-2 text-center text-xl font-bold text-ink focus-visible:outline-none focus-visible:border-gold/50 focus-visible:ring-2 focus-visible:ring-gold/20"
          />
        ))}
      </div>

      <Button
        size="lg"
        className="w-full"
        disabled={!complete}
        onClick={() => router.push("/dashboard/student")}
      >
        تایید کد
      </Button>
    </AuthShell>
  );
}
