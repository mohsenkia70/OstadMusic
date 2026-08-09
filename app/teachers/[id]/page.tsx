import { notFound } from "next/navigation";
import { Star, MapPin, Clock, ShieldCheck, Video } from "lucide-react";
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

      <div className="relative pt-36 pb-14 px-6 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(600px 340px at 50% 0%, rgba(13,148,136,0.18), transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-[1200px] flex flex-col md:flex-row md:items-end gap-6">
          <div
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[24px] font-display text-2xl font-bold text-[#181209]"
            style={{ background: gradient }}
          >
            {initials}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl">{teacher.fullName}</h1>
              {teacher.isVerified && (
                <Badge variant="gold">
                  <ShieldCheck className="h-3.5 w-3.5" /> استاد تاییدشده
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-muted text-sm">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {teacher.city}
                {teacher.district ? `، ${teacher.district}` : ""}
              </span>

              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {teacher.yearsOfExperience.toLocaleString("fa-IR")} سال سابقه
              </span>

              <span className="flex items-center gap-1.5 text-gold">
                <Star className="h-4 w-4 fill-gold" />
                {teacher.ratingAverage > 0
                  ? teacher.ratingAverage.toLocaleString("fa-IR")
                  : "—"}{" "}
                <span className="text-muted">
                  ({teacher.ratingCount.toLocaleString("fa-IR")} نظر)
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="px-6 md:px-8 pb-28">
        <div className="mx-auto max-w-[1200px] grid lg:grid-cols-[1fr_360px] gap-10">
          {/* Main */}
          <div className="space-y-12">
            <div>
              <h2 className="text-xl font-bold mb-4">درباره {firstName}</h2>
              <p className="text-muted leading-8">
                {teacher.bio || teacher.bioShort || "بیوگرافی ثبت نشده است."}
              </p>

              {teacher.categories?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5">
                  {teacher.categories.map((tag) => (
                    <Badge key={tag} variant="neutral">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
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
              <h2 className="text-xl font-bold mb-5">نظرات هنرجوان</h2>
              <p className="text-muted text-sm">هنوز نظری ثبت نشده است.</p>
            </div>
          </div>

          {/* Sidebar — رزرو + پرداخت */}
          <div className="lg:sticky lg:top-28 h-fit">
            <div className="rounded-[20px] border border-line bg-surface p-7">
              <div className="flex items-baseline justify-between mb-6">
                <span className="text-muted text-sm">هزینه‌ی هر جلسه</span>
                <span className="font-display text-xl font-bold">
                  {teacher.hourlyRate.toLocaleString("fa-IR")}{" "}
                  <span className="text-sm font-normal text-muted">تومان</span>
                </span>
              </div>

              <BookingForm
                teacherProfileId={teacher.teacherProfileId}
                teacherCategories={teacher.categories ?? []}
                hourlyRate={teacher.hourlyRate}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}