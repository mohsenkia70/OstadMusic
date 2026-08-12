"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const steps = [
  {
    num: "۰۱",
    title: "استاد را پیدا کن",
    desc: "با فیلتر سبک، شهر، سطح و بازه‌ی زمانی، از میان اساتید تاییدشده انتخاب کن.",
    color: "#0d9488",
    image: "/assets/images/1.png",
  },
  {
    num: "۰۲",
    title: "کلاسِ خودتو رزرو کن",
    desc: "یک جلسه‌ی کوتاه و رایگان برای اینکه ببینی حس همکاری‌تان چطور است.",
    color: "#d4af37",
    image: "/assets/images/2.png",
  },
  {
    num: "۰۳",
    title: "مسیر یادگیری را شروع کن",
    desc: "برنامه‌ی هفتگی بچین، پیشرفتت را دنبال کن و قدم‌به‌قدم بهتر شو.",
    color: "#7c93ff",
    image: "/assets/images/3.png",
  },
];

export function StepsSection() {
  return (
    <section
      id="how"
      className="relative py-28 md:py-36 scroll-mt-24 overflow-hidden"
    >
      {/* soft background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full opacity-20 blur-[140px]"
          style={{
            background:
              "radial-gradient(circle, rgba(13,148,136,0.35) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1100px] px-6 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20 md:mb-24"
        >
          <span className="inline-block text-xs tracking-[0.25em] text-gold/80 mb-4">
            مسیر شروع
          </span>
          <h2 className="text-3xl md:text-2xl lg:text-[2.1rem] font-medium mb-4 leading-tight">
            در سه قدم، اولین کلاست را رزرو کن
          </h2>
          <p className="text-muted text-base md:text-md max-w-md mx-auto">
            از جست‌وجو تا اولین نت، کمتر از یک روز طول می‌کشد.
          </p>
        </motion.div>

        {/* Steps – Desktop: horizontal pathway / Mobile: vertical */}
        <div className="relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-[52px] left-[16%] right-[16%] h-[2px] bg-line/40">
            <motion.div
              className="h-full origin-left rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, #0d9488, #d4af37, #7c93ff)",
              }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 1.4,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-10 md:gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Number circle */}
                <div className="relative mb-8">
                  <motion.div
                    className="relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-full border border-white/10 bg-surface/80 backdrop-blur-md shadow-lg"
                    whileHover={{ scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <span
                      className="font-display text-xl font-bold tracking-wider"
                      style={{ color: s.color }}
                    >
                      {s.num}
                    </span>
                  </motion.div>

                  {/* soft glow behind number */}
                  <motion.div
                    className="absolute inset-0 rounded-full blur-xl opacity-40"
                    style={{ background: s.color }}
                    animate={{
                      scale: [1, 1.25, 1],
                      opacity: [0.25, 0.45, 0.25],
                    }}
                    transition={{
                      duration: 3.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.4,
                    }}
                  />
                </div>

                {/* Content */}
                <div className="w-full max-w-[260px] flex flex-col items-center">
                  <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">
                    {s.title}
                  </h3>

                  {/* Image – fixed size + centered */}
                  <motion.div
                    className="relative w-[220px] h-[165px] mb-5 rounded-2xl overflow-hidden border border-white/10 bg-surface/50"
                    initial={{ opacity: 0, scale: 0.92 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: 0.2 + i * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      className="object-cover object-center"
                      sizes="220px"
                    />
                  </motion.div>

                  <p className="text-muted text-sm leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                {/* Mobile connector (except last) */}
                {i < steps.length - 1 && (
                  <div className="md:hidden mt-8 flex flex-col items-center">
                    <motion.div
                      className="w-[2px] h-10 rounded-full"
                      style={{
                        background: `linear-gradient(to bottom, ${s.color}, transparent)`,
                      }}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}