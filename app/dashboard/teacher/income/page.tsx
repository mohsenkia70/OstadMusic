"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { DashPageHeader, StatCard } from "@/components/dashboard/shared";
import { Badge } from "@/components/ui/badge";

const monthly = [
  { month: "فروردین", amount: 4200 },
  { month: "اردیبهشت", amount: 5100 },
  { month: "خرداد", amount: 4800 },
  { month: "تیر", amount: 6400 },
];

const payouts = [
  { id: "PO-118", period: "خرداد ۱۴۰۴", amount: "۴,۸۰۰,۰۰۰", status: "واریزشده" },
  { id: "PO-104", period: "اردیبهشت ۱۴۰۴", amount: "۵,۱۰۰,۰۰۰", status: "واریزشده" },
  { id: "PO-092", period: "فروردین ۱۴۰۴", amount: "۴,۲۰۰,۰۰۰", status: "واریزشده" },
];

export default function TeacherIncomePage() {
  return (
    <>
      <DashPageHeader title="درآمد" desc="خلاصه‌ی درآمد ماهانه و تاریخچه‌ی واریزی‌ها." />

      <div className="grid sm:grid-cols-3 gap-5 mb-9">
        <StatCard label="درآمد این ماه" value="۶,۴۰۰,۰۰۰ تومان" hint="۳۳٪ رشد نسبت به ماه قبل" />
        <StatCard label="مجموع درآمد سال" value="۲۰,۵۰۰,۰۰۰ تومان" />
        <StatCard label="کلاس‌های تسویه‌نشده" value="۳ جلسه" />
      </div>

      <div className="rounded-2xl border border-line bg-surface p-6 mb-8">
        <h2 className="font-bold mb-6">روند درآمد ۴ ماه اخیر (هزار تومان)</h2>
        <div className="h-64" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" vertical={false} />
              <XAxis dataKey="month" stroke="#6b6b74" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b6b74" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 12,
                  color: "#17171b",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                }}
              />
              <Bar dataKey="amount" fill="#0d9488" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h2 className="font-bold mb-4">تاریخچه‌ی واریزی‌ها</h2>
      <div className="rounded-2xl border border-line bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-muted text-xs">
              <th className="text-start font-medium px-5 py-3.5">شناسه</th>
              <th className="text-start font-medium px-5 py-3.5">دوره</th>
              <th className="text-start font-medium px-5 py-3.5">مبلغ</th>
              <th className="text-start font-medium px-5 py-3.5">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="px-5 py-4 text-muted">{p.id}</td>
                <td className="px-5 py-4">{p.period}</td>
                <td className="px-5 py-4">{p.amount} تومان</td>
                <td className="px-5 py-4">
                  <Badge variant="success">{p.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
