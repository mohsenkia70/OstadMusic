"use client";

import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, Clock, Headset } from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "اساتید تاییدشده",
    desc: "بررسی سابقه، نمونه‌کار و مصاحبه پیش از پذیرش هر استاد.",
    color: "#0d9488",
    delay: 0,
  },
  {
    icon: CreditCard,
    title: "پرداخت امن",
    desc: "پرداخت جلسه‌به‌جلسه یا بسته‌ای، با بازگشت وجه در صورت انصراف.",
    color: "#d4af37",
    delay: 0.1,
  },
  {
    icon: Clock,
    title: "کلاس آزمایشی رایگان",
    desc: "پیش از تعهد، حس همکاری با استاد را در یک جلسه‌ی کوتاه تجربه کن.",
    color: "#7c93ff",
    delay: 0.2,
  },
  {
    icon: Headset,
    title: "پشتیبانی همیشگی",
    desc: "تیم پشتیبانی استاد موزیک هر روز هفته پاسخگوی سوالات توست.",
    color: "#f5d78e",
    delay: 0.3,
  },
];

export function BenefitsSection() {
  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      {/* soft atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[700px] h-[500px] rounded-full opacity-20 blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, rgba(13,148,136,0.35) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[600px] h-[400px] rounded-full opacity-15 blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1150px] px-6 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-16 md:mb-20"
        >
          <span className="inline-block text-xs tracking-[0.25em] text-gold/80 mb-4">
            چرا استاد موزیک
          </span>
          <h2 className="text-2xl md:text-2xl lg:text-[2.1rem] font-medium leading-tight">
            ساخته‌شده برای اعتماد
            <br className="hidden sm:block" />
            و پیشرفت واقعی
          </h2>
        </motion.div>

        {/* Benefits grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {benefits.map((b) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 36, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.65,
                delay: b.delay,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group relative"
            >
              <div className="relative h-full rounded-2xl border border-white/[0.07] bg-white/[0.025] backdrop-blur-md p-7 md:p-8 overflow-hidden transition-colors duration-300 group-hover:border-white/12">
                {/* soft hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(500px circle at 50% 0%, ${b.color}14, transparent 55%)`,
                  }}
                />

                {/* Icon */}
                <div className="relative mb-6">
                  <motion.div
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10"
                    style={{ background: `${b.color}15` }}
                    whileHover={{ scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  >
                    <b.icon
                      className="h-5 w-5"
                      style={{ color: b.color }}
                      strokeWidth={1.8}
                    />
                  </motion.div>

                  {/* subtle pulse behind icon */}
                  <motion.div
                    className="absolute inset-0 rounded-xl blur-md opacity-30"
                    style={{ background: b.color }}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.15, 0.3, 0.15],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: b.delay,
                    }}
                  />
                </div>

                {/* Text */}
                <h4 className="relative text-[15px] md:text-base font-semibold mb-2.5 text-foreground">
                  {b.title}
                </h4>
                <p className="relative text-sm text-muted leading-relaxed">
                  {b.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}