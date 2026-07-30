"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { DashPageHeader } from "@/components/dashboard/shared";
import { teachers } from "@/lib/data";
import { cn } from "@/lib/utils";

const conversations = teachers.slice(0, 4).map((t, i) => ({
  teacher: t,
  lastMessage: [
    "حتما، هفته‌ی بعد قطعه‌ی جدید رو شروع می‌کنیم.",
    "تمرین گام امروز عالی بود!",
    "برای جلسه‌ی فردا آماده‌ای؟",
    "ویدیوی تمرینت رو دیدم، بازخورد گذاشتم.",
  ][i],
  unread: i === 0,
}));

const sampleThread = [
  { from: "them", text: "سلام مهسا، تمرین این هفته چطور پیش رفت؟" },
  { from: "me", text: "سلام استاد، بهتر شدم ولی هنوز روی کشش کمان مشکل دارم." },
  { from: "them", text: "طبیعیه، توی جلسه‌ی بعدی روش کار می‌کنیم. حتما ویدیوی تمرینت رو هم بفرست." },
  { from: "me", text: "چشم، امشب می‌فرستم 🙏" },
];

export default function StudentMessagesPage() {
  const [active, setActive] = useState(0);

  return (
    <>
      <DashPageHeader title="پیام‌ها" desc="گفتگو با اساتیدت." />

      <div className="grid md:grid-cols-[300px_1fr] rounded-2xl border border-line bg-surface overflow-hidden h-[560px]">
        <div className="border-e border-line overflow-y-auto">
          {conversations.map((c, i) => (
            <button
              key={c.teacher.id}
              onClick={() => setActive(i)}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3.5 text-start border-b border-line transition-colors",
                active === i ? "bg-surface-2" : "hover:bg-surface-2/60"
              )}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-xs font-bold text-[#181209]"
                style={{ background: c.teacher.gradient }}
              >
                {c.teacher.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold truncate">{c.teacher.name}</span>
                  {c.unread && <span className="h-2 w-2 rounded-full bg-gold shrink-0" />}
                </div>
                <p className="text-xs text-muted truncate">{c.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-3 border-b border-line px-5 py-4">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl font-display text-xs font-bold text-[#181209]"
              style={{ background: conversations[active].teacher.gradient }}
            >
              {conversations[active].teacher.initials}
            </div>
            <span className="font-semibold text-sm">{conversations[active].teacher.name}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {sampleThread.map((m, i) => (
              <div key={i} className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                    m.from === "me" ? "bg-gold text-[#181209]" : "bg-surface-2 text-ink"
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <form
            className="flex items-center gap-3 border-t border-line p-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              placeholder="پیامت را بنویس..."
              className="flex-1 h-11 rounded-xl border border-line bg-surface-2 px-4 text-sm focus-visible:outline-none focus-visible:border-gold/50"
            />
            <button
              type="submit"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold text-[#181209]"
              aria-label="ارسال"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
