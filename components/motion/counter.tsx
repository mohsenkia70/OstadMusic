"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CounterProps {
  target: number;
  className?: string;
}

export function Counter({ target, className }: CounterProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obj = { val: 0 };

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = Math.floor(obj.val).toLocaleString("fa-IR");
          },
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [target]);

  return (
    <div
      ref={ref}
      className={
        className ??
        "font-display text-3xl md:text-4xl font-extrabold text-gold"
      }
    >
    </div>
  );
}