import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] border border-line bg-gradient-to-br from-gold-soft to-surface-2 px-8 py-16 md:py-20 text-center">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(500px 300px at 50% 0%, rgba(13,148,136,0.26), transparent 70%)",
              }}
            />
            <div className="relative">
              <h2 className="text-2xl md:text-4xl mb-4">اولین قدم را همین امروز بردار</h2>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button className="mt-10" asChild size="lg">
                  <Link href="/teachers">پیدا کردن استاد مناسب</Link>
                </Button>
                <Button className="mt-10" asChild variant="glass" size="lg">
                  <Link href="/signup">عضویت به‌عنوان استاد</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
