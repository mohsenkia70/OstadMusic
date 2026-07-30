import { DashPageHeader } from "@/components/dashboard/shared";
import { Button } from "@/components/ui/button";
import { GraduationCap, Award, Briefcase } from "lucide-react";

const education = [
  { title: "کارشناسی ارشد نوازندگی ویولن", place: "دانشگاه هنر تهران، ۱۳۹۵" },
  { title: "کارشناسی آهنگسازی", place: "دانشگاه تهران، ۱۳۹۲" },
];

const experience = [
  { title: "مدرس ویولن، آموزشگاه موسیقی راستان", place: "۱۳۹۸ تا کنون" },
  { title: "نوازنده‌ی ارکستر مجلسی تهران", place: "۱۳۹۶ تا ۱۴۰۱" },
];

const certificates = [
  "گواهی تدریس روش سوزوکی، سطح ۲",
  "دیپلم افتخار جشنواره‌ی موسیقی جوان، ۱۳۹۴",
];

export default function TeacherResumePage() {
  return (
    <>
      <DashPageHeader
        title="رزومه"
        desc="سوابق تحصیلی، تجربه‌ی کاری و گواهینامه‌های تدریس."
        action={<Button variant="outline">دانلود PDF</Button>}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <GraduationCap className="h-4 w-4 text-gold" />
            <h2 className="font-bold">تحصیلات</h2>
          </div>
          <div className="space-y-4">
            {education.map((e) => (
              <div key={e.title} className="rounded-xl bg-surface-2 p-4">
                <div className="text-sm font-semibold">{e.title}</div>
                <div className="text-xs text-muted mt-1">{e.place}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <Briefcase className="h-4 w-4 text-gold" />
            <h2 className="font-bold">تجربه‌ی کاری</h2>
          </div>
          <div className="space-y-4">
            {experience.map((e) => (
              <div key={e.title} className="rounded-xl bg-surface-2 p-4">
                <div className="text-sm font-semibold">{e.title}</div>
                <div className="text-xs text-muted mt-1">{e.place}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6 md:col-span-2">
          <div className="flex items-center gap-2.5 mb-5">
            <Award className="h-4 w-4 text-gold" />
            <h2 className="font-bold">گواهینامه‌ها</h2>
          </div>
          <ul className="space-y-2.5 text-sm text-muted list-disc pr-5">
            {certificates.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
