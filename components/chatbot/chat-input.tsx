"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Paperclip, Mic, Smile, Square } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatInput({
  onSend,
  isStreaming,
  onStop,
}: {
  onSend: (text: string) => void;
  isStreaming: boolean;
  onStop: () => void;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const handleSend = () => {
    if (!value.trim() || isStreaming) return;
    onSend(value);
    setValue("");
    requestAnimationFrame(autoResize);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-line bg-surface p-4">
      <div className="flex items-end gap-2 rounded-2xl border border-line bg-surface-2 p-2 focus-within:border-gold/50 transition-colors">
        {/* Prepared for future file upload support — intentionally disabled for now */}
        <button
          type="button"
          disabled
          title="بارگذاری فایل (به‌زودی)"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted/50 cursor-not-allowed"
        >
          <Paperclip className="h-4.5 w-4.5" />
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            autoResize();
          }}
          onKeyDown={handleKeyDown}
          placeholder="پیامت را بنویس... (Enter برای ارسال، Shift+Enter برای خط جدید)"
          rows={1}
          className="flex-1 resize-none bg-transparent py-2 text-sm text-ink placeholder:text-muted/70 focus-visible:outline-none max-h-40"
        />

        {/* Prepared for future emoji picker — intentionally disabled for now */}
        <button
          type="button"
          disabled
          title="شکلک (به‌زودی)"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted/50 cursor-not-allowed"
        >
          <Smile className="h-4.5 w-4.5" />
        </button>

        {/* Prepared for future voice input — intentionally disabled for now */}
        <button
          type="button"
          disabled
          title="ورودی صوتی (به‌زودی)"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted/50 cursor-not-allowed"
        >
          <Mic className="h-4.5 w-4.5" />
        </button>

        {isStreaming ? (
          <button
            onClick={onStop}
            title="توقف پاسخ"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-ink border border-line"
          >
            <Square className="h-3.5 w-3.5" fill="currentColor" />
          </button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!value.trim()}
            title="ارسال"
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors",
              value.trim() ? "bg-gold text-[#181209]" : "bg-surface text-muted/50 cursor-not-allowed"
            )}
          >
            <Send className="h-4 w-4" />
          </motion.button>
        )}
      </div>
      <p className="text-[11px] text-muted text-center mt-2">
        {ASSISTANT_DISCLAIMER}
      </p>
    </div>
  );
}

const ASSISTANT_DISCLAIMER = "پاسخ‌های دستیار هوشمند ممکن است همیشه دقیق نباشند.";
