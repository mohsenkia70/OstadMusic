import { CreditCard } from "lucide-react";
import { DashPageHeader, StatCard } from "@/components/dashboard/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const invoices = [
  { id: "INV-1042", desc: "بسته‌ی ۴ جلسه‌ای - نگار احمدی", date: "۱۴۰۴/۰۴/۱۰", amount: "۱,۸۰۰,۰۰۰", status: "پرداخت‌شده" },
  { id: "INV-1031", desc: "کلاس تکی - نگار احمدی", date: "۱۴۰۴/۰۳/۲۲", amount: "۴۵۰,۰۰۰", status: "پرداخت‌شده" },
  { id: "INV-1019", desc: "بسته‌ی ۴ جلسه‌ای - نگار احمدی", date: "۱۴۰۴/۰۳/۰۱", amount: "۱,۸۰۰,۰۰۰", status: "پرداخت‌شده" },
];

export default function StudentPaymentsPage() {
  return (
    <>
      <DashPageHeader title="پرداخت‌ها" desc="روش پرداخت و تاریخچه‌ی تراکنش‌های تو." />

      <div className="grid sm:grid-cols-2 gap-5 mb-9">
        <StatCard label="مجموع پرداختی از ابتدا" value="۹,۸۵۰,۰۰۰ تومان" />
        <StatCard label="بسته‌ی فعال" value="۲ جلسه باقی‌مانده" hint="تا ۵ روز دیگر تمام می‌شود" />
      </div>

      <div className="rounded-2xl border border-line bg-surface p-6 mb-8 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-soft text-gold">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">کارت بانکی پایان یافته با ۴۴۹۲</div>
            <div className="text-xs text-muted">روش پرداخت پیش‌فرض</div>
          </div>
        </div>
        <Button variant="outline" size="sm">
          تغییر روش پرداخت
        </Button>
      </div>

      <h2 className="font-bold mb-4">تاریخچه‌ی تراکنش‌ها</h2>
      <div className="rounded-2xl border border-line bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-muted text-xs">
              <th className="text-start font-medium px-5 py-3.5">شرح</th>
              <th className="text-start font-medium px-5 py-3.5">تاریخ</th>
              <th className="text-start font-medium px-5 py-3.5">مبلغ</th>
              <th className="text-start font-medium px-5 py-3.5">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b border-line last:border-0">
                <td className="px-5 py-4">{inv.desc}</td>
                <td className="px-5 py-4 text-muted">{inv.date}</td>
                <td className="px-5 py-4">{inv.amount} تومان</td>
                <td className="px-5 py-4">
                  <Badge variant="success">{inv.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
