import { GraduationCap, LifeBuoy, Sparkles, type LucideIcon } from "lucide-react";
import type { AssistantModeId } from "./types";

export const ASSISTANT_NAME = "نوا";

export type AssistantMode = {
  id: AssistantModeId;
  label: string;
  description: string;
  icon: LucideIcon;
  /** Sent to the AI provider as the system prompt when this mode is active. */
  systemPrompt: string;
  suggestedQuestions: string[];
};

/**
 * Add more modes here any time — nothing else in the chatbot needs to change.
 * ChatHeader, EmptyState, and the API route all read from this array.
 */
export const ASSISTANT_MODES: AssistantMode[] = [
  {
    id: "general",
    label: "دستیار عمومی",
    description: "سوال عمومی درباره‌ی استاد موزیک",
    icon: Sparkles,
    systemPrompt:
      "تو «نوا» هستی، دستیار هوشمند سایت «استاد موزیک»، پلتفرمی برای وصل‌کردن هنرجویان و اساتید ویولن در ایران. با لحنی گرم، مختصر و مفید به فارسی پاسخ بده.",
    suggestedQuestions: [
      "استاد موزیک چطور کار می‌کند؟",
      "چطور کلاس آزمایشی رزرو کنم؟",
      "هزینه‌ی کلاس‌ها معمولاً چقدر است؟",
    ],
  },
  {
    id: "learning",
    label: "دستیار یادگیری",
    description: "راهنمایی برای تمرین و یادگیری ویولن",
    icon: GraduationCap,
    systemPrompt:
      "تو «نوا» هستی، دستیار یادگیری ویولن در سایت «استاد موزیک». به سوالات درباره‌ی تکنیک، تمرین، انتخاب ساز و آماده‌سازی برای اجرا با لحنی مشوق‌کننده و کاربردی پاسخ بده.",
    suggestedQuestions: [
      "چطور تکنیک کشش کمان را تمرین کنم؟",
      "برای شروع ویولن از کجا شروع کنم؟",
      "چطور استرس اجرای صحنه‌ای را کم کنم؟",
    ],
  },
  {
    id: "support",
    label: "پشتیبانی",
    description: "کمک برای استفاده از سایت",
    icon: LifeBuoy,
    systemPrompt:
      "تو «نوا» هستی، دستیار پشتیبانی سایت «استاد موزیک». به سوالات درباره‌ی رزرو کلاس، پرداخت، کلاس آنلاین و حساب کاربری با لحنی روشن و گام‌به‌گام پاسخ بده.",
    suggestedQuestions: [
      "چطور با استادم پیام رد و بدل کنم؟",
      "کلاس آنلاینم را چطور شروع کنم؟",
      "اگر از استاد راضی نبودم چه کار کنم؟",
    ],
  },
];

export function getAssistantMode(id: AssistantModeId): AssistantMode {
  return ASSISTANT_MODES.find((m) => m.id === id) ?? ASSISTANT_MODES[0];
}
