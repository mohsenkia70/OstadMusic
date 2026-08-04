"use client";

import { useState } from "react";
import { ChevronDown, Menu, Trash2, Eraser } from "lucide-react";
import { ASSISTANT_MODES, ASSISTANT_NAME, type AssistantMode } from "@/lib/chatbot/assistant-config";
import type { AssistantModeId } from "@/lib/chatbot/types";
import { cn } from "@/lib/utils";

export function ChatHeader({
  mode,
  onModeChange,
  demoMode,
  onOpenSidebar,
  onClearChat,
  onDeleteConversation,
}: {
  mode: AssistantMode;
  onModeChange: (id: AssistantModeId) => void;
  demoMode: boolean;
  onOpenSidebar: () => void;
  onClearChat: () => void;
  onDeleteConversation: () => void;
}) {
  const [modeMenuOpen, setModeMenuOpen] = useState(false);
  const [actionsMenuOpen, setActionsMenuOpen] = useState(false);

  return (
    <div className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3.5">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted hover:text-ink"
          aria-label="فهرست گفت‌وگوها"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-blue font-display text-sm font-bold text-[#181209]">
          {ASSISTANT_NAME.slice(0, 1)}
        </div>

        <div className="relative min-w-0">
          <button
            onClick={() => setModeMenuOpen((v) => !v)}
            className="flex items-center gap-1.5 min-w-0"
          >
            <span className="font-semibold text-sm truncate">{ASSISTANT_NAME}</span>
            <span className="text-xs text-muted truncate hidden sm:inline">— {mode.label}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted shrink-0" />
          </button>

          {modeMenuOpen && (
            <>
              <button
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setModeMenuOpen(false)}
                aria-label="بستن منو"
              />
              <div className="absolute start-0 top-9 z-20 w-64 rounded-xl border border-line bg-surface shadow-lg py-1.5">
                {ASSISTANT_MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onModeChange(m.id);
                      setModeMenuOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-start gap-2.5 px-3.5 py-2.5 text-start hover:bg-surface-2",
                      mode.id === m.id && "bg-gold-soft"
                    )}
                  >
                    <m.icon className={cn("h-4 w-4 mt-0.5 shrink-0", mode.id === m.id ? "text-gold" : "text-muted")} />
                    <div>
                      <div className={cn("text-sm font-medium", mode.id === m.id && "text-gold")}>{m.label}</div>
                      <div className="text-xs text-muted">{m.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {demoMode && (
          <span className="hidden sm:inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[11px] text-amber-800 shrink-0">
            حالت آزمایشی
          </span>
        )}
      </div>

      <div className="relative shrink-0">
        <button
          onClick={() => setActionsMenuOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-muted hover:text-ink hover:bg-surface-2"
          aria-label="گزینه‌های بیشتر"
        >
          <Eraser className="h-4.5 w-4.5" />
        </button>
        {actionsMenuOpen && (
          <>
            <button
              className="fixed inset-0 z-10 cursor-default"
              onClick={() => setActionsMenuOpen(false)}
              aria-label="بستن منو"
            />
            <div className="absolute end-0 top-11 z-20 w-52 rounded-xl border border-line bg-surface shadow-lg py-1.5">
              <button
                onClick={() => {
                  onClearChat();
                  setActionsMenuOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-start text-sm hover:bg-surface-2"
              >
                <Eraser className="h-4 w-4 text-muted" /> پاک‌کردن گفت‌وگو
              </button>
              <button
                onClick={() => {
                  onDeleteConversation();
                  setActionsMenuOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-start text-sm text-red-600 hover:bg-surface-2"
              >
                <Trash2 className="h-4 w-4" /> حذف این گفت‌وگو
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
