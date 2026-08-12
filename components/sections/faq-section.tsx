import { faqs } from "@/lib/data";
import { Reveal } from "@/components/motion/reveal";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export function FaqSection() {
  return (
    <section id="faq" className="py-28 md:py-32 scroll-mt-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <Reveal className="max-w-xl mx-auto text-center mb-14">
          <span className="block text-gold text-sm font-semibold mb-4 tracking-wide">سوالات متداول</span>
          <h2 className="text-2xl md:text-2xl">هر آنچه پیش از شروع باید بدانی</h2>
        </Reveal>

        <Reveal className="max-w-[760px] mx-auto">
          <Accordion type="single" collapsible>
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
