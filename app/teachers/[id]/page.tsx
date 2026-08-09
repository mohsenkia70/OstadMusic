import { notFound } from "next/navigation";
import {
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Video,
  Play,
  Award,
  MessageCircle,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { BookingForm } from "@/components/booking/booking-form";
import { getTeacherById } from "@/lib/api/teachers";
import { ApiError } from "@/lib/api/types";

function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

function getGradient(id: string) {
  const gradients = [
    "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
    "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  ];
  const index =
    id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    gradients.length;
  return gradients[index];
}

export default async function TeacherProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let teacher;
  try {
    teacher = await getTeacherById(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  if (!teacher) notFound();

  const initials = getInitials(teacher.fullName);
  const gradient = getGradient(teacher.teacherProfileId);
  const firstName = teacher.fullName.split(" ")[0] || teacher.fullName;

  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden pt-32 pb-16 md:pt-36 md:pb-20">
        {/* Soft glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(700px 380px at 50% -10%, rgba(13,148,136,0.22), transparent 65%)",
          }}
        />
        <div
          className="pointer-events-none absolute -right-20 top-20 h-72 w-72 rounded-full opacity-30 blur-3xl"
          style={{ background: gradient }}
        />

        <div className="relative mx-auto max-w-[1200px] px-6 md:px-8">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-end">
            {/* Avatar */}
            <div className="relative">
              <div
                className="flex h-28 w-28 items-center justify-center rounded-[28px] font-display text-3xl font-bold text-[#181209] shadow-lg md:h-32 md:w-32 md:text-4xl"
                style={{ background: gradient }}
              >
                {initials}
              </div>
              {teacher.isVerified && (
                <div className="absolute -bottom-2 -left-2 flex h-9 w-9 items-center justify-center rounded-full border-4 border-bg bg-gold text-[#181209] shadow-md">
                  <ShieldCheck className="h-4 w-4" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
                  {teacher.fullName}
                </h1>
                {teacher.isVerified && (
                  <Badge variant="gold" className="rounded-full px-3 py-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    استاد تاییدشده
                  </Badge>
                )}
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-gold/80" />
                  {teacher.city}
                  {teacher.district ? `، ${teacher.district}` : ""}
                </span>

                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-gold/80" />
                  {teacher.yearsOfExperience.toLocaleString("fa-IR")} سال سابقه
                </span>

                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-gold text-gold" />
                  <span className="font-medium text-ink">
                    {teacher.ratingAverage > 0
                      ? teacher.ratingAverage.toLocaleString("fa-IR")
                      : "—"}
                  </span>
                  <span className="text-muted">
                    ({teacher.ratingCount.toLocaleString("fa-IR")} نظر)
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <section className="px-6 pb-28 md:px-8">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[1fr_380px]">
          {/* Left column */}
          <div className="space-y-14">
            {/* About */}
            <div>
              <div className="mb-5 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-soft">
                  <Award className="h-4 w-4 text-gold" />
                </div>
                <h2 className="text-xl font-bold">درباره {firstName}</h2>
              </div>

              <p className="leading-8 text-muted">
                {teacher.bio || teacher.bioShort || "بیوگرافی ثبت نشده است."}
              </p>

              {teacher.categories?.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {teacher.categories.map((tag) => (
                    <Badge
                      key={tag}
                      variant="neutral"
                      className="rounded-full border border-line/60 bg-bg-2 px-3.5 py-1 text-sm"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Sample performances */}
            <div>
              <div className="mb-6 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-soft">
                  <Video className="h-4 w-4 text-gold" />
                </div>
                <h2 className="text-xl font-bold">نمونه اجرا</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2].map((v) => (
                  <div
                    key={v}
                    className="group relative aspect-video overflow-hidden rounded-2xl border border-line/70 bg-gradient-to-br from-surface-2 to-surface transition-all duration-300 hover:border-gold/30 hover:shadow-[0_12px_40px_-12px_rgba(13,148,136,0.2)]"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(13,148,136,0.08),transparent_60%)]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-[#181209] shadow-lg transition-transform duration-300 group-hover:scale-110">
                        <Play className="h-6 w-6 fill-current" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 rounded-lg bg-black/40 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
                      نمونه {v}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="mb-6 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-soft">
                  <MessageCircle className="h-4 w-4 text-gold" />
                </div>
                <h2 className="text-xl font-bold">نظرات هنرجوان</h2>
              </div>

              <div className="rounded-2xl border border-dashed border-line bg-surface/40 py-16 text-center">
                <p className="text-sm text-muted">هنوز نظری ثبت نشده است.</p>
                <p className="mt-1 text-xs text-muted/70">
                  اولین نفری باش که تجربهٔ خود را به اشتراک می‌گذارد.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar — Booking */}
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <div className="overflow-hidden rounded-3xl border border-line/70 bg-surface shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)]">
              {/* Price header */}
              <div className="border-b border-line/50 bg-gradient-to-l from-gold-soft/40 to-transparent px-7 py-6">
                <p className="mb-1 text-sm text-muted">هزینه‌ی هر جلسه</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-3xl font-extrabold tracking-tight text-ink">
                    {teacher.hourlyRate.toLocaleString("fa-IR")}
                  </span>
                  <span className="text-sm text-muted">تومان</span>
                </div>
              </div>

              <div className="p-7">
                <BookingForm
                  teacherProfileId={teacher.teacherProfileId}
                  teacherCategories={teacher.categories ?? []}
                  hourlyRate={teacher.hourlyRate}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}