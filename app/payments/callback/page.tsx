"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api/config";
import { useAuthStore } from "@/lib/store/auth-store";

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const authority = searchParams.get("Authority");
  const status = searchParams.get("Status");
  const token = useAuthStore((s) => s.accessToken);

  const [state, setState] = useState<"loading" | "success" | "failed">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verify() {
      if (!authority) {
        setState("failed");
        setMessage("اطلاعات پرداخت ناقص است.");
        return;
      }

      // اگر Status=NOK باشه، کاربر پرداخت رو لغو کرده
      if (status && status.toUpperCase() === "NOK") {
        setState("failed");
        setMessage("پرداخت لغو شد یا ناموفق بود.");
        return;
      }

      try {
        const qs = new URLSearchParams();
        if (authority) qs.set("Authority", authority);
        if (status) qs.set("Status", status);

        const res = await fetch(
          `${API_BASE_URL}/payments/zarinpal/callback?${qs.toString()}`,
          {
            headers: {
              Accept: "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (!res.ok) {
          setState("failed");
          setMessage("تأیید پرداخت ناموفق بود. در صورت کسر وجه با پشتیبانی تماس بگیر.");
          return;
        }

        setState("success");
        setMessage("پرداخت با موفقیت انجام شد. رزرو تو ثبت شد.");
      } catch {
        setState("failed");
        setMessage("خطا در ارتباط با سرور هنگام تأیید پرداخت.");
      }
    }

    verify();
  }, [authority, status, token]);

  return (
    <>
      <Navbar />
      <section className="min-h-[60vh] flex items-center justify-center px-6 py-28">
        <div className="max-w-md w-full rounded-2xl border border-line bg-surface p-8 text-center">
          {state === "loading" && (
            <>
              <Loader2 className="h-10 w-10 animate-spin mx-auto text-gold mb-4" />
              <p className="text-muted">در حال بررسی وضعیت پرداخت...</p>
            </>
          )}

          {state === "success" && (
            <>
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
              <h1 className="text-xl font-bold mb-2">پرداخت موفق</h1>
              <p className="text-muted text-sm mb-6">{message}</p>
              <Button asChild>
                <Link href="/dashboard">رفتن به داشبورد</Link>
              </Button>
            </>
          )}

          {state === "failed" && (
            <>
              <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h1 className="text-xl font-bold mb-2">پرداخت ناموفق</h1>
              <p className="text-muted text-sm mb-6">{message}</p>
              <Button asChild variant="outline">
                <Link href="/teachers">بازگشت به فهرست اساتید</Link>
              </Button>
            </>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}