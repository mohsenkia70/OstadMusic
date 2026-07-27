import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(600px 420px at 50% 40%, rgba(13,148,136,0.20), transparent 70%)",
        }}
      />
      <div className="relative">
        <div className="font-display text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gold to-[#0f766e] mb-6">
          ۴۰۴
        </div>
        <h1 className="text-2xl md:text-3xl mb-3">این صفحه پیدا نشد</h1>
        <p className="text-muted mb-9 max-w-sm mx-auto">
          به‌نظر می‌رسد سازی که دنبالش بودی، از این صحنه کوک نشده. برگرد به خانه و دوباره تلاش کن.
        </p>
        <Button asChild size="lg">
          <Link href="/">بازگشت به صفحه‌ی اصلی</Link>
        </Button>
      </div>
    </div>
  );
}
