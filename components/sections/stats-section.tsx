import { Counter } from "@/components/motion/counter";

const stats = [
  { value: 480, label: "استاد فعال" },
  { value: 12400, label: "ساعت آموزش برگزارشده" },
  { value: 31, label: "شهر تحت پوشش" },
];

export function StatsSection() {
  return (
    <div className="border-y border-line bg-bg-2">
      <div className="mx-auto max-w-[1200px] grid grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`text-center py-11 px-5 ${i !== 0 ? "border-s border-line" : ""} ${
              i === 2 ? "border-s-0 md:border-s" : ""
            }`}
          >
            <Counter target={s.value} />
            <div className="text-muted text-sm mt-1.5">{s.label}</div>
          </div>
        ))}
        <div className="text-center py-11 px-5 border-s-0 md:border-s border-line">
          <div className="font-display text-3xl md:text-4xl font-extrabold text-gold">۴.۹</div>
          <div className="text-muted text-sm mt-1.5">رضایت شاگردان</div>
        </div>
      </div>
    </div>
  );
}
