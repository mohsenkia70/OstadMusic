"use client";

import { motion } from "framer-motion";
import Link from "next/link";
// import { HeroCanvas } from "@/components/three/hero-canvas";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-6 pt-36 pb-20">
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(600px 420px at 50% 18%, rgba(13,148,136,0.24), transparent 70%)," +
            "radial-gradient(500px 400px at 78% 60%, rgba(124,147,255,0.16), transparent 70%)," +
            "radial-gradient(500px 400px at 20% 65%, rgba(13,148,136,0.14), transparent 70%)",
        }}
      />
      {/* <HeroCanvas /> */}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-3xl"
      >
        <span className="inline-flex items-center gap-2 text-sm text-gold bg-gold-soft border border-gold/30 px-4 py-1.5 rounded-full mb-7">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
        مسیر حرفه‌ای تو از یک انتخاب درست شروع می‌شود
        </span>

        <h1 className="text-[2.4rem] leading-[1.22] sm:text-3xl md:text-4xl mb-6">
         استاد موسیقی‌ات را هوشمندانه انتخاب کن
        </h1>

        <p className="text-base sm:text-lg text-muted max-w-xl mx-auto mb-10">
         از اولین تمرین تا اجرای روی صحنه، استاد مناسب خودت را پیدا کن و قدم‌به‌قدم پیشرفت کن.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-10">
          <Button asChild size="lg">
            <Link href="/teachers">پیدا کردن استاد</Link>
          </Button>
          <Button asChild variant="glass" size="lg">
            <Link href="#how">مسیر یادگیری !!</Link>
          </Button>
        </div>

      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 z-10 flex flex-col items-center gap-2 text-xs text-muted"
      >
        <span>پیمایش کن</span>
        <span className="w-px h-9 bg-gradient-to-b from-gold to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}
