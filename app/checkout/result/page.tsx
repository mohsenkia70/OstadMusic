"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";

function generateOrderNumber() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `AR-${n}`;
}

function ResultContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") === "success" ? "success" : "failed";
  const { clearCart } = useCart();
  const [orderNumber] = useState(generateOrderNumber);
  const [copied, setCopied] = useState(false);
  const clearedRef = useRef(false);

  useEffect(() => {
    if (status === "success" && !clearedRef.current) {
      clearedRef.current = true;
      clearCart();
    }
  }, [status, clearCart]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard not available — ignore silently
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center">
        {status === "success" ? (
          <>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold-soft">
              <CheckCircle2 className="h-10 w-10 text-gold" />
            </div>
            <h1 className="text-2xl font-bold mb-3">پرداخت با موفقیت انجام شد</h1>
            <p className="text-muted mb-8">
              سفارشت ثبت شد و به‌زودی برایت ارسال می‌شود. رسید و جزئیات سفارش برایت پیامک شد.
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold mb-3">پرداخت انجام نشد</h1>
            <p className="text-muted mb-8">
              تراکنش ناموفق بود یا لغو شد. سبد خریدت همچنان محفوظ است و می‌توانی دوباره تلاش کنی.
            </p>
          </>
        )}

        <div className="rounded-2xl border border-line bg-surface p-5 mb-8 flex items-center justify-between">
          <div className="text-start">
            <div className="text-xs text-muted mb-1">
              {status === "success" ? "شماره سفارش" : "شماره پیگیری"}
            </div>
            <div className="font-display font-bold" dir="ltr">
              {orderNumber}
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-gold hover:underline"
            aria-label="کپی شماره"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "کپی شد" : "کپی"}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {status === "success" ? (
            <Button asChild size="lg">
              <Link href="/dashboard/student">مشاهده در حساب کاربری</Link>
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link href="/checkout/payment">تلاش دوباره</Link>
            </Button>
          )}
          <Button asChild variant="glass" size="lg">
            <Link href="/shop">بازگشت به فروشگاه</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ResultContent />
    </Suspense>
  );
}
