import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

export function StorySection() {
  return (
    <section className="py-28 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 grid md:grid-cols-2 gap-14 md:gap-18 items-center">
        <Reveal>
          <div className="relative aspect-[4/5] rounded-[28px] overflow-hidden border border-line bg-gradient-to-br from-[#faf6ec] to-[#f0e8d4]">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 30% 20%, rgba(13,148,136,0.28), transparent 55%), radial-gradient(circle at 75% 75%, rgba(124,147,255,0.14), transparent 50%)",
              }}
            />
            <div
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(115deg, rgba(23,21,18,0.035) 0 2px, transparent 2px 26px)",
              }}
            />
            <div className="absolute bottom-7 inset-x-7 font-display text-lg font-semibold leading-relaxed text-ink">
              «معلمم فقط تکنیک یاد نداد؛ یاد داد چطور گوش کنم.»
              <small className="block mt-2.5 font-body font-normal text-sm text-muted">
                مهسا، هنرجو استاد موزیک از سال ۱۴۰۱
              </small>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <span className="block text-gold text-sm font-semibold mb-4 tracking-wide">داستان استاد موزیک</span>
          <h2 className="text-3xl md:text-2xl mb-5 leading-snug">
            یادگیری ویولن چیزی بیشتر از تمرین گام‌هاست
          </h2>
          <p className="text-muted mb-5 leading-8">
            هر نوازنده یک نقطه‌ی شروع دارد؛ یک لحظه که کمان روی سیم می‌نشیند و صدایی بیرون می‌آید
            که تا آن روز نشنیده بودی. <strong className="text-ink font-semibold">استاد موزیک</strong>{" "}
            برای همین لحظه ساخته شده — مسیری شخصی، با استادی که سبک، سرعت و روحیه‌ی تو را می‌فهمد.
          </p>
          <p className="text-muted mb-7 leading-8">
            ما اساتید را با بررسی سابقه‌ی تدریس، نمونه‌اجرا و بازخورد هنرجوان واقعی تایید می‌کنیم،
            تا انتخاب تو نه یک حدس، بلکه یک تصمیم مطمئن باشد.
          </p>
          <Button asChild variant="glass">
            <Link href="/teachers">آشنایی با اساتید</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
