import { StatCard } from "@/components/dashboard/shared";
import { Badge } from "@/components/ui/badge";

const classes = [
  {
    id: 1,
    title: "آموزش ویولن مقدماتی",
    teacher: "استاد محمد رضایی",
    sessions: "جلسه ۸ از ۲۰",
    nextSession: "شنبه - ۱۸:۰۰",
    status: "در حال برگزاری",
  },
  {
    id: 2,
    title: "تکنیک آرشه‌کشی",
    teacher: "استاد علی کریمی",
    sessions: "جلسه ۳ از ۱۲",
    nextSession: "دوشنبه - ۲۰:۰۰",
    status: "در حال برگزاری",
  },
  {
    id: 3,
    title: "نت‌خوانی و سلفژ",
    teacher: "استاد سارا احمدی",
    sessions: "جلسه ۱۲ از ۱۶",
    nextSession: "چهارشنبه - ۱۷:۳۰",
    status: "در حال برگزاری",
  },
];

export default function OngoingClassesPage() {
  return (
    <>
      <div className="grid sm:grid-cols-3 gap-5 mb-9">
        <StatCard label="کلاس‌های فعال" value="۳" />
        <StatCard label="جلسات باقی‌مانده" value="۱۷" />
        <StatCard label="میانگین پیشرفت" value="۷۲٪" />
      </div>

      <div className="rounded-2xl border border-line bg-surface p-6">
        <h2 className="mb-6 text-lg font-bold">
          کلاس‌های در حال برگزاری
        </h2>

        <div className="space-y-4">
          {classes.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-line p-5 transition hover:border-gold"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{item.title}</h3>

                <Badge>{item.status}</Badge>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-muted sm:grid-cols-3">
                <div>
                  <span className="font-medium text-foreground">استاد: </span>
                  {item.teacher}
                </div>

                <div>
                  <span className="font-medium text-foreground">وضعیت جلسات: </span>
                  {item.sessions}
                </div>

                <div>
                  <span className="font-medium text-foreground">جلسه بعدی: </span>
                  {item.nextSession}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}