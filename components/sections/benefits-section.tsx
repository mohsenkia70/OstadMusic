import { ShieldCheck, CreditCard, Clock, Headset } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

const benefits = [
  {
    icon: ShieldCheck,
    title: "اساتید تاییدشده",
    desc: "بررسی سابقه، نمونه‌کار و مصاحبه پیش از پذیرش هر استاد.",
  },
  {
    icon: CreditCard,
    title: "پرداخت امن",
    desc: "پرداخت جلسه‌به‌جلسه یا بسته‌ای، با بازگشت وجه در صورت انصراف.",
  },
  {
    icon: Clock,
    title: "کلاس آزمایشی رایگان",
    desc: "پیش از تعهد، حس همکاری با استاد را در یک جلسه‌ی کوتاه تجربه کن.",
  },
  {
    icon: Headset,
    title: "پشتیبانی همیشگی",
    desc: "تیم پشتیبانی استاد موزیک هر روز هفته پاسخگوی سوالات توست.",
  },
];

export function BenefitsSection() {
  return (
    <section className="py-28 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <Reveal className="max-w-xl mb-14">
          <span className="block text-gold text-sm font-semibold mb-4 tracking-wide">چرا استاد موزیک</span>
          <h2 className="text-3xl md:text-4xl">ساخته‌شده برای اعتماد و پیشرفت واقعی</h2>
        </Reveal>

        <Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line rounded-[20px] overflow-hidden">
            {benefits.map((b) => (
              <div key={b.title} className="bg-surface p-8">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-soft text-gold mb-5">
                  <b.icon className="h-5 w-5" />
                </div>
                <h4 className="font-semibold mb-2">{b.title}</h4>
                <p className="text-muted text-sm">{b.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
