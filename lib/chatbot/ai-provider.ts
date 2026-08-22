import { getAssistantMode } from "./assistant-config";
import type { AssistantModeId, ChatRole } from "./types";

export type ProviderMessage = { role: ChatRole; content: string };

export function isDemoMode() {
  return !process.env.OPENAI_API_KEY;
}


export async function* streamAssistantReply(
  messages: ProviderMessage[],
  modeId: AssistantModeId
): AsyncGenerator<string> {
  const mode = getAssistantMode(modeId);

  if (isDemoMode()) {
    yield* demoReply(messages, modeId);
    return;
  }

  yield* callRealProvider(messages, mode.systemPrompt);
}

async function* callRealProvider(messages: ProviderMessage[], systemPrompt: string): AsyncGenerator<string> {
  const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      stream: true,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    }),
  });

  if (!response.ok || !response.body) {
    const text = await response.text().catch(() => "");
    throw new Error(`AI provider request failed (${response.status}): ${text || "no body"}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        const parsed = JSON.parse(data);
        const delta: string | undefined = parsed.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {
        // ignore partial/malformed SSE frames
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Demo mode: no external calls, no API key needed — fully testable offline.
// Gives on-topic canned answers for the suggested questions and an honest
// fallback for anything else, so the feature is demonstrable before you add
// a real OPENAI_API_KEY.
// ---------------------------------------------------------------------------

const CANNED_ANSWERS: { match: RegExp; reply: string }[] = [
  {
    match: /(چطور|چگونه).*(کار می‌?کند|کار میکنه)|استاد موزیک چیست/,
    reply:
      "استاد موزیک هنرجویان ویولن را با اساتید تاییدشده در سراسر ایران وصل می‌کند. می‌توانی از صفحه‌ی «اساتید» بر اساس شهر، سبک تدریس و بودجه فیلتر کنی، یک کلاس آزمایشی رایگان رزرو کنی، و بعد از اطمینان از هم‌خوانی با استاد، مسیر یادگیری‌ات را شروع کنی.",
  },
  {
    match: /کلاس آزمایشی|رزرو.*کلاس/,
    reply:
      "برای رزرو کلاس آزمایشی، وارد پروفایل استاد موردنظر شو و یکی از زمان‌های آزاد را انتخاب کن. این جلسه‌ی کوتاه رایگان است و هیچ تعهد مالی‌ای نداره؛ فقط برای اینه که مطمئن بشی سبک تدریس استاد با تو جور در میاد.",
  },
  {
    match: /هزینه|قیمت|تعرفه/,
    reply:
      "هزینه‌ی هر جلسه بسته به سابقه و تخصص استاد فرق می‌کنه و روی پروفایل هر استاد شفاف نوشته شده. معمولاً می‌تونی جلسه‌ای پرداخت کنی یا بسته‌ی چندجلسه‌ای با تخفیف بخری.",
  },
  {
    match: /کشش کمان|تکنیک.*کمان/,
    reply:
      "برای تمرین کشش کمان، با حرکت‌های آرام و کوتاه روی سیم‌های باز شروع کن و تمرکزت رو روی صاف نگه‌داشتن مچ و فشار یکنواخت بگذار. تمرین روزانه‌ی حتی ۱۰ دقیقه‌ای جلوی صحنه یا آینه، کمک زیادی به اصلاح زاویه‌ی کمان می‌کنه.",
  },
  {
    match: /شروع ویولن|از کجا شروع کنم|مبتدی/,
    reply:
      "بهترین شروع، پیدا کردن یک استاد صبور برای پایه‌ریزی درسته؛ وضعیت درست بدن، گرفتن صحیح ساز و کمان، و آشنایی با نت‌خوانی ساده. می‌تونی از صفحه‌ی «اساتید» فیلتر «شروع از صفر» را بزنی تا استادهای مناسب مبتدی‌ها رو ببینی.",
  },
  {
    match: /استرس|اجرای صحنه/,
    reply:
      "برای کاهش استرس اجرا، قطعه رو چند بار در شرایط نزدیک به واقعی (ایستاده، جلوی جمع کوچیک) تمرین کن، پیش از اجرا چند نفس عمیق بکش، و بپذیر که یک اشتباه کوچک پایان دنیا نیست. اساتید استاد موزیک هم معمولاً قبل از اولین اجرا راهنمایی‌های عملی می‌دن.",
  },
  {
    match: /پیام.*استاد|چت.*استاد/,
    reply:
      "از داشبورد هنرجو، بخش «پیام‌ها» رو باز کن — همون‌جا می‌تونی مستقیم با استادت گفت‌وگو کنی، سوال بپرسی یا ویدیوی تمرینت رو براش بفرستی.",
  },
  {
    match: /کلاس آنلاین|شروع کلاس/,
    reply:
      "برای کلاس آنلاین، سر ساعت مقرر از داشبورد روی دکمه‌ی «ورود به کلاس» بزن. یک صفحه‌ی بررسی دوربین و میکروفون باز می‌شه و بعد وارد کلاس زنده با استادت می‌شی.",
  },
  {
    match: /راضی نبودم|تغییر استاد|بازگشت وجه/,
    reply:
      "هر زمان می‌تونی استاد رو تغییر بدی. برای جلسات پرداخت‌شده‌ای که هنوز برگزار نشده، امکان بازگشت وجه هم وجود داره — از بخش پشتیبانی درخواست بده.",
  },
];

async function* demoReply(messages: ProviderMessage[], modeId: AssistantModeId): AsyncGenerator<string> {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const question = lastUser?.content?.trim() ?? "";

  const matched = CANNED_ANSWERS.find((c) => c.match.test(question));
  const mode = getAssistantMode(modeId);

  const reply =
    matched?.reply ??
    `این پاسخ در «حالت آزمایشی» تولید شده چون هنوز کلید API هوش مصنوعی واقعی (OPENAI_API_KEY) تنظیم نشده. ` +
      `در حالت ${mode.label}، معمولاً کمک می‌کنم با سوالاتی مثل «${mode.suggestedQuestions[0]}». ` +
      `برای پاسخ‌های واقعی و هوشمند، کلید API را در .env.local تنظیم کن.`;

  // Yield word-by-word with a tiny delay so the client sees a genuine
  // streaming/typing effect even without a real model behind it.
  const words = reply.split(" ");
  for (const word of words) {
    yield word + " ";
    await new Promise((r) => setTimeout(r, 18));
  }
}
