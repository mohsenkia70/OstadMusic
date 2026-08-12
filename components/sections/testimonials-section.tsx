"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { testimonials } from "@/lib/data";
import { Reveal } from "@/components/motion/reveal";

export function TestimonialsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ direction: "rtl", loop: true });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    queueMicrotask(onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="py-28 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <Reveal className="max-w-xl mx-auto text-center mb-14">
          <span className="block text-gold text-sm font-semibold mb-4 tracking-wide">تجربه‌ی هنرجوان</span>
          <h2 className="text-2xl md:text-2xl">حرف‌هایی که پشت هر جلسه‌ی تمرین است</h2>
        </Reveal>

        <Reveal>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-[22px]">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="flex-[0_0_min(420px,86vw)] rounded-[20px] border border-line bg-surface p-8"
                >
                  <div className="text-gold text-sm mb-4 tracking-widest">★★★★★</div>
                  <p className="mb-6">{t.text}</p>
                  <div className="flex items-center gap-3">
                    <div
                      className="rounded-xl"
                      style={{ background: t.gradient, width: 42, height: 42 }}
                    />
                    <div>
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-xs text-muted">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2.5 justify-center mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                aria-label={`اسلاید ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  selected === i ? "w-[22px] bg-gold" : "w-2 bg-line"
                }`}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
