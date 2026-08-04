"use client";

import { useEffect, useRef } from "react";
import { ChatMessage } from "./chat-message";
import { EmptyState } from "./empty-state";
import { ChatInput } from "./chat-input";
import type { ChatMessage as ChatMessageType } from "@/lib/chatbot/types";
import type { AssistantMode } from "@/lib/chatbot/assistant-config";

export function ChatWindow({
  messages,
  mode,
  isStreaming,
  onSend,
  onStop,
  onRegenerate,
}: {
  messages: ChatMessageType[];
  mode: AssistantMode;
  isStreaming: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
  onRegenerate: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const lastMessageContent = messages[messages.length - 1]?.content;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, lastMessageContent]);

  const lastAssistantId = [...messages].reverse().find((m) => m.role === "assistant")?.id;

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full">
      {messages.length === 0 ? (
        <EmptyState mode={mode} onSelectQuestion={onSend} />
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
          {messages.map((m) => (
            <ChatMessage
              key={m.id}
              message={m}
              isLast={m.id === lastAssistantId}
              onRegenerate={m.id === lastAssistantId && !isStreaming ? onRegenerate : undefined}
            />
          ))}
        </div>
      )}

      <ChatInput onSend={onSend} isStreaming={isStreaming} onStop={onStop} />
    </div>
  );
}
