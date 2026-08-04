import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PaymentCallbackContent } from "./callback-content";

export default function PaymentCallbackPage() {
  return (
    <>
      <Navbar />
      <section className="min-h-[60vh] flex items-center justify-center px-6 py-28">
        <Suspense
          fallback={
            <div className="max-w-md w-full rounded-2xl border border-line bg-surface p-8 text-center">
              <Loader2 className="h-10 w-10 animate-spin mx-auto text-gold mb-4" />
              <p className="text-muted">در حال بررسی وضعیت پرداخت...</p>
            </div>
          }
        >
          <PaymentCallbackContent />
        </Suspense>
      </section>
      <Footer />
    </>
  );
}