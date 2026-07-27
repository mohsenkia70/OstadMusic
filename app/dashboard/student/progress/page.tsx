import { DashPageHeader, StatCard } from "@/components/dashboard/shared";
import { Progress } from "@/components/ui/progress";

const skills = [
  { label: "تکنیک کمان", value: 70 },
  { label: "کوک و تشخیص گوش", value: 55 },
  { label: "قطعات میانی", value: 40 },
  { label: "خوانش نت", value: 82 },
  { label: "ریتم و ضرب‌آهنگ", value: 60 },
];

const milestones = [
  { title: "اولین قطعه‌ی کامل", desc: "اجرای کامل «آهسته و آرام» ویوالدی", done: true },
  { title: "تسلط بر گام سه اکتاو", desc: "نواختن روان گام دو ماژور در سه اکتاو", done: true },
  { title: "اولین اجرای صحنه‌ای", desc: "اجرا در جشن پایان‌ترم آموزشگاه", done: false },
  { title: "شروع کنسرتوی ویوالدی", desc: "آغاز کار روی موومان اول", done: false },
];

export default function StudentProgressPage() {
  return (
    <>
      <DashPageHeader title="پیشرفت یادگیری" desc="نمای کلی از مهارت‌ها و نقاط عطف مسیر تو." />

      <div className="grid sm:grid-cols-3 gap-5 mb-9">
        <StatCard label="ماه‌های تمرین پیوسته" value="۴ ماه" />
        <StatCard label="قطعات تکمیل‌شده" value="۶ قطعه" />
        <StatCard label="میانگین بازخورد استاد" value="۴.۸ از ۵" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-bold mb-6">مهارت‌ها</h2>
          <div className="space-y-5">
            {skills.map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span>{s.label}</span>
                  <span className="text-muted">{s.value}٪</span>
                </div>
                <Progress value={s.value} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-bold mb-6">نقاط عطف</h2>
          <div className="space-y-5">
            {milestones.map((m) => (
              <div key={m.title} className="flex gap-3">
                <span
                  className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                    m.done ? "bg-gold" : "border border-line"
                  }`}
                />
                <div>
                  <div className={`text-sm font-semibold ${m.done ? "" : "text-muted"}`}>{m.title}</div>
                  <div className="text-xs text-muted mt-0.5">{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
