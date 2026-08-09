import Link from "next/link";
import { teachers } from "@/lib/data";
import { TeacherCard } from "@/components/teacher-card";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

export function TeachersSection() {
  return (
    <section id="teachers" className="scroll-mt-24 py-28 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <Reveal className="mb-14 max-w-xl">
          <span className="mb-4 block text-sm font-semibold tracking-wide text-gold">
            اساتید برگزیده
          </span>
          <h2 className="text-3xl md:text-4xl">
            با استادهایی که شاگردانشان دوستشان دارند آشنا شو
          </h2>
        </Reveal>

        <div className="mb-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 0.1}>
              <TeacherCard teacher={t} />
            </Reveal>
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="glass" size="lg" className="rounded-2xl px-8">
            <Link href="/teachers">دیدن همه‌ی اساتید</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}