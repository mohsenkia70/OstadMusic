import { notFound } from "next/navigation";
import { Star, MapPin, Clock, ShieldCheck, Video } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { teachers, teacherReviews } from "@/lib/data";

export function generateStaticParams() {
  return teachers.map((t) => ({ id: t.id }));
}

const availableSlots = ["شنبه ۱۸:۰۰", "یکشنبه ۱۷:۳۰", "سه‌شنبه ۱۹:۰۰", "پنجشنبه ۱۶:۰۰"];

export default async function TeacherProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const teacher = teachers.find((t) => t.id === id);
  if (!teacher) notFound();

  return (
    <>
      <Navbar />

      <div className="relative pt-36 pb-14 px-6 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(600px 340px at 50% 0%, rgba(13,148,136,0.18), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-[1200px] flex flex-col md:flex-row md:items-end gap-6">
          <div
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[24px] font-display text-2xl font-bold text-[#181209]"
            style={{ background: teacher.gradient }}
          >
            {teacher.initials}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl">{teacher.name}</h1>
              <Badge variant="gold">
                <ShieldCheck className="h-3.5 w-3.5" /> استاد تاییدشده
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-muted text-sm">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {teacher.city}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {teacher.years.toLocaleString("fa-IR")} سال سابقه
              </span>
              <span className="flex items-center gap-1.5 text-gold">
                <Star className="h-4 w-4 fill-gold" /> {teacher.rating.toLocaleString("fa-IR")}{" "}
                <span className="text-muted">({teacher.reviews.toLocaleString("fa-IR")} نظر)</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="px-6 md:px-8 pb-28">
        <div className="mx-auto max-w-[1200px] grid lg:grid-cols-[1fr_360px] gap-10">
          {/* Main column */}
          <div className="space-y-12">
            <div>
              <h2 className="text-xl font-bold mb-4">درباره {teacher.name.split(" ")[0]}</h2>
              <p className="text-muted leading-8">{teacher.bio}</p>
              <div className="flex flex-wrap gap-2 mt-5">
                {teacher.tags.map((tag) => (
                  <Badge key={tag} variant="neutral">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-5">نمونه اجرا</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2].map((v) => (
                  <div
                    key={v}
                    className="relative aspect-video rounded-2xl border border-line bg-gradient-to-br from-surface-2 to-surface flex items-center justify-center"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/90 text-[#181209]">
                      <Video className="h-6 w-6" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-5">نظرات شاگردان</h2>
              <div className="space-y-4">
                {teacherReviews.map((r) => (
                  <div key={r.name} className="rounded-2xl border border-line bg-surface p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-sm">{r.name}</span>
                      <span className="text-gold text-xs tracking-widest">
                        {"★".repeat(r.rating)}
                        <span className="text-line">{"★".repeat(5 - r.rating)}</span>
                      </span>
                    </div>
                    <p className="text-muted text-sm">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking sidebar */}
          <div className="lg:sticky lg:top-28 h-fit">
            <div className="rounded-[20px] border border-line bg-surface p-7">
              <div className="flex items-baseline justify-between mb-6">
                <span className="text-muted text-sm">هزینه‌ی هر جلسه</span>
                <span className="font-display text-xl font-bold">
                  {teacher.price.toLocaleString("fa-IR")}{" "}
                  <span className="text-sm font-normal text-muted">هزار تومان</span>
                </span>
              </div>

              <p className="text-sm text-muted mb-3">زمان‌های آزاد این هفته</p>
              <div className="grid grid-cols-2 gap-2.5 mb-7">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    className="rounded-xl border border-line bg-surface-2 px-3 py-2.5 text-xs text-ink/90 transition-colors hover:border-gold/40 hover:text-gold"
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <Button className="w-full mb-3" size="lg">
                رزرو کلاس آزمایشی رایگان
              </Button>
              <Button variant="glass" className="w-full">
                ارسال پیام به استاد
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
