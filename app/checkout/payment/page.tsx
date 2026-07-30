"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCart } from "@/components/cart/cart-provider";

function formatToman(n: number) {
  return n.toLocaleString("fa-IR");
}

const SHIPPING_COST = 250;

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function PaymentGatewayPage() {
  const router = useRouter();
  const { items, totalPrice } = useCart();
  const shipping = items.length > 0 ? SHIPPING_COST : 0;
  const payable = totalPrice + shipping;

  const [cardNumber, setCardNumber] = useState("");
  const [holder, setHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv2, setCvv2] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const isValid =
    cardNumber.replace(/\s/g, "").length === 16 &&
    holder.trim().length > 2 &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    cvv2.length >= 3;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setError("اطلاعات کارت را کامل و درست وارد کن.");
      return;
    }
    setError("");
    setProcessing(true);
    setTimeout(() => {
      router.push("/checkout/result?status=success");
    }, 1600);
  };

  if (items.length === 0 && !processing) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center">
        <div>
          <p className="text-muted mb-6">سبد خریدی برای پرداخت پیدا نشد.</p>
          <Button asChild>
            <Link href="/shop">بازگشت به فروشگاه</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16 bg-bg-2">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 font-display font-bold text-lg">
            <Lock className="h-4 w-4 text-gold" />
            درگاه پرداخت امن
          </div>
          <span className="text-xs bg-amber-500/10 text-amber-700 border border-amber-500/25 rounded-full px-3 py-1">
            حالت آزمایشی (Sandbox)
          </span>
        </div>

        <div className="rounded-[20px] border border-line bg-surface p-7">
          <div className="flex items-start gap-2.5 rounded-xl bg-surface-2 p-4 mb-6 text-xs text-muted leading-6">
            <ShieldAlert className="h-4 w-4 text-gold shrink-0 mt-0.5" />
            این صفحه شبیه‌سازیِ یک درگاه پرداخت است و فقط برای نمایش رابط کاربری طراحی شده؛ هیچ تراکنش
            واقعی یا اطلاعات بانکی واقعی پردازش نمی‌شود.
          </div>

          <div className="flex items-baseline justify-between mb-6 pb-6 border-b border-line">
            <span className="text-muted text-sm">مبلغ قابل پرداخت</span>
            <span className="font-display text-xl font-bold">{formatToman(payable)} تومان</span>
          </div>

          <form onSubmit={handlePay} className="space-y-5">
            <div>
              <Label htmlFor="cardNumber">شماره کارت</Label>
              <Input
                id="cardNumber"
                dir="ltr"
                inputMode="numeric"
                placeholder="•••• •••• •••• ••••"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="holder">نام دارنده کارت</Label>
              <Input id="holder" placeholder="به لاتین، طبق کارت بانکی" value={holder} onChange={(e) => setHolder(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">تاریخ انقضا</Label>
                <Input
                  id="expiry"
                  dir="ltr"
                  inputMode="numeric"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="cvv2">CVV2</Label>
                <Input
                  id="cvv2"
                  dir="ltr"
                  inputMode="numeric"
                  placeholder="••••"
                  maxLength={4}
                  value={cvv2}
                  onChange={(e) => setCvv2(e.target.value.replace(/\D/g, "").slice(0, 4))}
                />
              </div>
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}

            <Button type="submit" size="lg" className="w-full gap-2" disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> در حال ارتباط با بانک...
                </>
              ) : (
                `پرداخت ${formatToman(payable)} تومان`
              )}
            </Button>

            <Link
              href="/cart"
              className="block text-center text-xs text-muted hover:text-ink transition-colors"
            >
              انصراف و بازگشت به سبد خرید
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
