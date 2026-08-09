"use client";

import { useState } from "react";
import { DashPageHeader } from "@/components/dashboard/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors shrink-0",
        checked ? "bg-gold" : "bg-surface-2 border border-line"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
          checked ? "translate-x-[-22px]" : "translate-x-[-2px]"
        )}
        style={{ right: 2 }}
      />
    </button>
  );
}

export default function TeacherSettingsPage() {
  const [prefs, setPrefs] = useState({
    newBookings: true,
    studentMessages: true,
    payoutAlerts: true,
    marketing: false,
    autoAcceptTrial: true,
  });

  const toggle = (key: keyof typeof prefs) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <>
      <DashPageHeader title="تنظیمات" desc="اعلان‌ها، تنظیمات رزرو و امنیت حساب استادی‌ات." />

      <div className="space-y-6 max-w-2xl">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-bold mb-5">اعلان‌ها</h2>
          <div className="space-y-4">
            {[
              { key: "newBookings" as const, label: "رزرو کلاس جدید" },
              { key: "studentMessages" as const, label: "پیام‌های جدید از هنرجوان" },
              { key: "payoutAlerts" as const, label: "اعلان واریز درآمد" },
              { key: "marketing" as const, label: "اخبار و بروزرسانی‌های استاد موزیک" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-sm">{item.label}</span>
                <Toggle checked={prefs[item.key]} onChange={() => toggle(item.key)} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-bold mb-5">تنظیمات رزرو</h2>
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-sm">پذیرش خودکار کلاس آزمایشی</div>
              <div className="text-xs text-muted mt-1">درخواست‌های کلاس آزمایشی بدون تایید دستی پذیرفته شوند.</div>
            </div>
            <Toggle checked={prefs.autoAcceptTrial} onChange={() => toggle("autoAcceptTrial")} />
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-bold mb-5">اطلاعات بانکی</h2>
          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <div>
              <Label htmlFor="iban">شماره شبا</Label>
              <Input id="iban" defaultValue="IR820540102680020817909002" dir="ltr" />
            </div>
            <div>
              <Label htmlFor="owner">نام صاحب حساب</Label>
              <Input id="owner" defaultValue="نگار احمدی" />
            </div>
          </div>
          <Button>ذخیره‌ی اطلاعات بانکی</Button>
        </div>
      </div>
    </>
  );
}
