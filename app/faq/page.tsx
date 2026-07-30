import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/page-header";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { faqs } from "@/lib/data";

const moreFaqs = [
  {
    q: "آیا می‌توانم همزمان با چند استاد کلاس داشته باشم؟",
    a: "بله، هیچ محدودیتی برای رزرو کلاس با چند استاد مختلف وجود ندارد.",
  },
  {
    q: "برای عضویت به‌عنوان استاد چه مدارکی لازم است؟",
    a: "سابقه‌ی تدریس یا اجرا، نمونه‌اجرا یا رزومه، و گذراندن یک مصاحبه‌ی کوتاه با تیم استاد موزیک.",
  },
  {
    q: "آیا امکان کلاس گروهی هم هست؟",
    a: "در حال حاضر استاد موزیک روی کلاس‌های خصوصی تمرکز دارد؛ کلاس گروهی به‌زودی اضافه می‌شود.",
  },
];

export default function FaqPage() {
  const all = [...faqs, ...moreFaqs];

  return (
    <>
      <Navbar />
      <PageHeader
        eyebrow="سوالات متداول"
        title="هر آنچه لازم است پیش از شروع بدانی"
      />

      <section className="px-6 md:px-8 pb-28">
        <div className="mx-auto max-w-[760px]">
          <Accordion type="single" collapsible>
            {all.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Footer />
    </>
  );
}
