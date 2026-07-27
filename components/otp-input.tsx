"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const persianToLatinDigits = (value: string) =>
  value.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[٠-٩]/g, (d) =>
    String("٠١٢٣٤٥٦٧٨٩".indexOf(d))
  );

export function OtpInput({
  length = 5,
  disabled = false,
  onComplete,
}: {
  length?: number;
  disabled?: boolean;
  onComplete: (code: string) => void;
}) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const firedRef = useRef(false);

  useEffect(() => {
    const code = values.join("");
    if (code.length === length && !values.includes("") && !firedRef.current) {
      firedRef.current = true;
      onComplete(code);
    }
    if (values.includes("")) {
      firedRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, length]);

  const setDigitAt = (index: number, raw: string) => {
    const normalized = persianToLatinDigits(raw);
    const digit = normalized.replace(/[^0-9]/g, "").slice(-1);
    setValues((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    return digit;
  };

  const handleChange = (index: number, raw: string) => {
    if (disabled) return;
    const digit = setDigitAt(index, raw);
    if (digit && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.key === "Backspace") {
      if (values[index]) {
        setValues((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
      } else if (index > 0) {
        inputs.current[index - 1]?.focus();
        setValues((prev) => {
          const next = [...prev];
          next[index - 1] = "";
          return next;
        });
      }
      e.preventDefault();
    } else if (e.key === "ArrowLeft" && index < length - 1) {
      inputs.current[index + 1]?.focus();
    } else if (e.key === "ArrowRight" && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    const pasted = persianToLatinDigits(e.clipboardData.getData("text")).replace(/[^0-9]/g, "");
    if (!pasted) return;
    e.preventDefault();
    setValues((prev) => {
      const next = [...prev];
      for (let i = 0; i < pasted.length && index + i < length; i++) {
        next[index + i] = pasted[i];
      }
      return next;
    });
    const lastFilled = Math.min(index + pasted.length, length) - 1;
    requestAnimationFrame(() => inputs.current[lastFilled]?.focus());
  };

  return (
    <div className="flex gap-3 justify-between" dir="ltr">
      {values.map((v, i) => (
        <input
          key={i}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          value={v}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
          disabled={disabled}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          aria-label={`رقم ${i + 1} کد تایید`}
          className={cn(
            "h-14 w-14 rounded-xl border bg-surface-2 text-center text-xl font-bold text-ink transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/20",
            disabled ? "opacity-50" : "border-line focus-visible:border-gold/50",
            v && !disabled && "border-gold/40"
          )}
        />
      ))}
    </div>
  );
}
