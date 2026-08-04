import { NextRequest } from "next/server";
import { isDemoMode, streamAssistantReply, type ProviderMessage } from "@/lib/chatbot/ai-provider";
import type { AssistantModeId } from "@/lib/chatbot/types";

export const runtime = "nodejs";

type RequestBody = {
  mode?: AssistantModeId;
  messages?: ProviderMessage[];
};

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ message: "بدنه‌ی درخواست نامعتبر است." }), { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const mode: AssistantModeId = body.mode ?? "general";

  if (messages.length === 0) {
    return new Response(JSON.stringify({ message: "هیچ پیامی برای پاسخ‌دادن ارسال نشده." }), { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of streamAssistantReply(messages, mode)) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "خطای ناشناخته در سرویس هوش مصنوعی.";
        controller.enqueue(encoder.encode(`\n\n[error]${message}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Ai-Demo": isDemoMode() ? "1" : "0",
    },
  });
}
