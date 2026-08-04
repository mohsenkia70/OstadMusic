"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { Check, Copy, RotateCcw, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CodeBlock } from "./code-block";
import { TypingIndicator } from "./typing-indicator";
import { ASSISTANT_NAME } from "@/lib/chatbot/assistant-config";
import type { ChatMessage as ChatMessageType } from "@/lib/chatbot/types";
import { cn } from "@/lib/utils";

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export function ChatMessage({
  message,
  isLast,
  onRegenerate,
}: {
  message: ChatMessageType;
  isLast: boolean;
  onRegenerate?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — silently ignore
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
    >
      <Avatar className="h-8 w-8 shrink-0 mt-0.5">
        {isUser ? (
          <AvatarFallback className="text-xs">تو</AvatarFallback>
        ) : (
          <AvatarFallback className="text-xs">{ASSISTANT_NAME.slice(0, 2)}</AvatarFallback>
        )}
      </Avatar>

      <div className={cn("flex flex-col max-w-[80%] sm:max-w-[70%]", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "bg-gold text-[#181209] rounded-tl-md"
              : message.error
                ? "bg-red-50 border border-red-200 text-red-700 rounded-tr-md"
                : "bg-surface-2 text-ink rounded-tr-md"
          )}
        >
          {message.error && (
            <div className="flex items-center gap-1.5 text-xs font-semibold mb-1.5">
              <AlertCircle className="h-3.5 w-3.5" /> خطا در دریافت پاسخ
            </div>
          )}

          {message.pending && message.content.length === 0 ? (
            <TypingIndicator />
          ) : isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="chat-markdown">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p className="mb-2.5 last:mb-0 whitespace-pre-wrap">{children}</p>,
                  ul: ({ children }) => <ul className="mb-2.5 list-disc pr-5 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="mb-2.5 list-decimal pr-5 space-y-1">{children}</ol>,
                  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                  a: ({ children, href }) => (
                    <a href={href} target="_blank" rel="noreferrer" className="text-gold underline">
                      {children}
                    </a>
                  ),
                  code: ({ className, children }) => {
                    const isBlock = /language-/.test(className || "");
                    const raw = String(children).replace(/\n$/, "");
                    if (isBlock) {
                      const language = className?.replace("language-", "");
                      return <CodeBlock code={raw} language={language} />;
                    }
                    return (
                      <code className="rounded bg-black/[0.06] px-1.5 py-0.5 font-mono text-[0.85em]" dir="ltr">
                        {raw}
                      </code>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mt-1.5 px-1">
          <span className="text-[11px] text-muted">{formatTime(message.createdAt)}</span>
          {!isUser && !message.pending && message.content && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-muted hover:text-ink transition-colors"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "کپی شد" : "کپی"}
              </button>
              {isLast && onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="flex items-center gap-1 text-[11px] text-muted hover:text-ink transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  تولید دوباره
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
