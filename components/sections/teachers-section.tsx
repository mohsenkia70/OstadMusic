import Link from "next/link";
import { teachers } from "@/lib/data";
import { TeacherCard } from "@/components/teacher-card";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

export function TeachersSection() {
  return (
    <section id="teachers" className="py-28 md:py-32 scroll-mt-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <Reveal className="max-w-xl mb-14">
          <span className="block text-gold text-sm font-semibold mb-4 tracking-wide">اساتید برگزیده</span>
          <h2 className="text-3xl md:text-4xl">با استادهایی که هنرجوانشان دوستشان دارند آشنا شو</h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {teachers.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 0.08}>
              <TeacherCard teacher={t} />
            </Reveal>
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="glass" size="lg">
            <Link href="/teachers">دیدن همه‌ی اساتید</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
