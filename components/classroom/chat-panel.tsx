"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import type { ChatMessage } from "@/lib/classroom/types";
import { cn } from "@/lib/utils";

export function ChatPanel({
  messages,
  selfPeerId,
  onSend,
}: {
  messages: ChatMessage[];
  selfPeerId: string;
  onSend: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-muted text-sm text-center mt-8">هنوز پیامی ارسال نشده.</p>
        ) : (
          messages.map((m, i) => {
            const isSelf = m.fromPeerId === selfPeerId;
            return (
              <div key={i} className={cn("flex flex-col", isSelf ? "items-end" : "items-start")}>
                {!isSelf && <span className="text-xs text-muted mb-1 px-1">{m.name}</span>}
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm",
                    isSelf ? "bg-gold text-[#181209]" : "bg-surface-2 text-ink"
                  )}
                >
                  {m.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-line p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="پیامت را بنویس..."
          className="flex-1 h-10 rounded-xl border border-line bg-surface-2 px-3.5 text-sm focus-visible:outline-none focus-visible:border-gold/50"
        />
        <button
          type="submit"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold text-[#181209]"
          aria-label="ارسال پیام"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
