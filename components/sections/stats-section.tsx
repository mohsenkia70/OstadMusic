"use client";

import { motion } from "framer-motion";
import { Counter } from "@/components/motion/counter";

const stats = [
  {
    value: 480,
    label: "استاد فعال",
    sub: "اساتید تأیید‌شده و حرفه‌ای",
    color: "#0d9488",
    delay: 0,
  },
  {
    value: 12400,
    label: "ساعت آموزش",
    sub: "کلاس‌های برگزار‌شده تا امروز",
    color: "#d4af37",
    delay: 0.12,
  },
  {
    value: 31,
    label: "شهر تحت پوشش",
    sub: "حضوری و آنلاین در سراسر ایران",
    color: "#7c93ff",
    delay: 0.24,
  },
  {
    value: 4.9,
    label: "رضایت هنرجویان",
    sub: "میانگین بیش از ۲۸۰۰ نظر",
    color: "#f5d78e",
    delay: 0.36,
    isRating: true,
  },
];

export function StatsSection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Animated atmospheric background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-30 blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(13,148,136,0.45) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.25, 0.4, 0.25],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full opacity-20 blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, rgba(212,175,55,0.5) 0%, transparent 70%)",
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative mx-auto max-w-[1100px] px-5">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14 md:mb-16"
        >
          <span className="inline-block text-xs tracking-[0.2em] text-gold/80 mb-3">
            اعداد واقعی · اعتماد واقعی
          </span>
          <h2 className="text-2xl md:text-3xl font-medium text-foreground/90">
            مسیر موسیقی شما با اطمینان شروع می‌شود
          </h2>
        </motion.div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {stats.map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 40, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                delay: s.delay,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="relative group"
            >
              {/* Card */}
              <div className="relative h-full rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-md overflow-hidden px-6 py-8 text-center">
                {/* glowing top accent line */}
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-16 rounded-full"
                  style={{ background: s.color }}
                  initial={{ width: 0, opacity: 0 }}
                  whileInView={{ width: 64, opacity: 1 }}
                  transition={{ delay: s.delay + 0.3, duration: 0.6 }}
                />

                {/* soft inner glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(600px circle at 50% 0%, ${s.color}18, transparent 50%)`,
                  }}
                />

                {/* Number */}
                <div className="relative mb-3">
                  {s.isRating ? (
                    <div className="flex items-center justify-center gap-1.5">
                      <span
                        className="font-display text-4xl md:text-[2.75rem] font-extrabold tracking-tight"
                        style={{ color: s.color }}
                      >
                        ۴.۹
                      </span>
                      <motion.span
                        className="text-2xl"
                        style={{ color: s.color }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 2.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        ★
                      </motion.span>
                    </div>
                  ) : (
                    <Counter
                      target={s.value}
                      className="font-display text-4xl md:text-[2.75rem] font-extrabold tracking-tight text-foreground"
                    />
                  )}
                </div>

                {/* Label */}
                <div className="relative text-[15px] font-medium text-foreground/90 mb-1.5">
                  {s.label}
                </div>
                <div className="relative text-xs text-muted/70 leading-relaxed">
                  {s.sub}
                </div>

                {/* floating particle dots */}
                <motion.div
                  className="absolute bottom-4 right-4 w-1.5 h-1.5 rounded-full"
                  style={{ background: s.color }}
                  animate={{
                    y: [0, -6, 0],
                    opacity: [0.4, 0.9, 0.4],
                  }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: s.delay,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}