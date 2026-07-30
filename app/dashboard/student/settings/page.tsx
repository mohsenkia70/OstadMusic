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

export default function StudentSettingsPage() {
  const [prefs, setPrefs] = useState({
    classReminders: true,
    teacherMessages: true,
    marketing: false,
    weeklyDigest: true,
  });

  const toggle = (key: keyof typeof prefs) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <>
      <DashPageHeader title="تنظیمات" desc="اعلان‌ها، امنیت و زبان حساب کاربری‌ات را مدیریت کن." />

      <div className="space-y-6 max-w-2xl">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-bold mb-5">اعلان‌ها</h2>
          <div className="space-y-4">
            {[
              { key: "classReminders" as const, label: "یادآوری کلاس‌ها" },
              { key: "teacherMessages" as const, label: "پیام‌های جدید از استاد" },
              { key: "weeklyDigest" as const, label: "خلاصه‌ی هفتگی پیشرفت" },
              { key: "marketing" as const, label: "پیشنهادها و تخفیف‌های استاد موزیک" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-sm">{item.label}</span>
                <Toggle checked={prefs[item.key]} onChange={() => toggle(item.key)} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-bold mb-5">امنیت حساب</h2>
          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <div>
              <Label htmlFor="cur-pass">رمز عبور فعلی</Label>
              <Input id="cur-pass" type="password" placeholder="••••••••" />
            </div>
            <div>
              <Label htmlFor="new-pass">رمز عبور جدید</Label>
              <Input id="new-pass" type="password" placeholder="••••••••" />
            </div>
          </div>
          <Button>به‌روزرسانی رمز عبور</Button>
        </div>

        <div className="rounded-2xl border border-red-500/25 bg-red-500/5 p-6">
          <h2 className="font-bold mb-2 text-red-700">حذف حساب کاربری</h2>
          <p className="text-sm text-muted mb-4">
            با حذف حساب، تمام اطلاعات، تاریخچه‌ی کلاس‌ها و پیام‌های تو برای همیشه پاک می‌شود.
          </p>
          <Button variant="danger" size="sm">
            حذف حساب کاربری
          </Button>
        </div>
      </div>
    </>
  );
}
