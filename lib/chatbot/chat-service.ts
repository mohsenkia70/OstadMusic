import type { ChatApiRequest } from "./types";

export class ChatServiceError extends Error {}

/**
 * Calls POST /api/chat and reads the streamed plain-text response chunk by
 * chunk, invoking onChunk() as they arrive. Returns whether the server was
 * running in demo mode (no AI provider key configured) so the UI can show
 * that state honestly.
 */
export async function streamChatReply(
  request: ChatApiRequest,
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<{ demo: boolean }> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: request.mode, messages: request.messages }),
    signal,
  });

  if (!response.ok || !response.body) {
    const text = await response.text().catch(() => "");
    throw new ChatServiceError(text || "ارتباط با دستیار هوشمند برقرار نشد.");
  }

  const demo = response.headers.get("X-Ai-Demo") === "1";
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let full = "";
  const ERROR_MARKER = "\n\n[error]";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    full += chunk;

    const markerIndex = full.indexOf(ERROR_MARKER);
    if (markerIndex !== -1) {
      // Forward only the part of this chunk that arrived before the marker,
      // then stop — everything after it is the error message, not content.
      const alreadySentLength = full.length - chunk.length;
      const visiblePortionOfChunk = full.slice(alreadySentLength, markerIndex);
      if (visiblePortionOfChunk) onChunk(visiblePortionOfChunk);
      break;
    }

    onChunk(chunk);
  }

  const markerIndex = full.indexOf(ERROR_MARKER);
  if (markerIndex !== -1) {
    const errorMessage = full.slice(markerIndex + ERROR_MARKER.length).trim();
    throw new ChatServiceError(errorMessage || "خطایی در پاسخ دستیار هوشمند رخ داد.");
  }

  return { demo };
}
