import { Reveal } from "@/components/motion/reveal";

const steps = [
  {
    num: "۰۱",
    title: "استاد را پیدا کن",
    desc: "با فیلتر سبک، شهر، سطح و بازه‌ی زمانی، از میان اساتید تاییدشده انتخاب کن.",
  },
  {
    num: "۰۲",
    title: "کلاس آزمایشی رزرو کن",
    desc: "یک جلسه‌ی کوتاه و رایگان برای اینکه ببینی حس همکاری‌تان چطور است.",
  },
  {
    num: "۰۳",
    title: "مسیر یادگیری را شروع کن",
    desc: "برنامه‌ی هفتگی بچین، پیشرفتت را دنبال کن و قدم‌به‌قدم بهتر شو.",
  },
];

export function StepsSection() {
  return (
    <section id="how" className="py-28 md:py-32 scroll-mt-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <Reveal className="max-w-xl mx-auto text-center mb-16">
          <span className="block text-gold text-sm font-semibold mb-4 tracking-wide">مسیر شروع</span>
          <h2 className="text-3xl md:text-4xl mb-4">در سه قدم، اولین کلاست را رزرو کن</h2>
          <p className="text-muted">از جست‌وجو تا اولین نت، کمتر از یک روز طول می‌کشد.</p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <Reveal key={s.num} delay={i * 0.1}>
              <div className="relative overflow-hidden rounded-[20px] border border-line bg-surface p-9">
                <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-gold/35 text-sm text-gold font-display mb-6">
                  {s.num}
                </div>
                <h3 className="relative z-10 text-lg font-bold mb-2.5">{s.title}</h3>
                <p className="relative z-10 text-muted text-sm">{s.desc}</p>
                <div className="absolute -start-[30%] -bottom-[40%] h-56 w-56 rounded-full bg-gold-soft blur-2xl pointer-events-none" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
