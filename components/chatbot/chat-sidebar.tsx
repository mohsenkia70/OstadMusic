"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Search, Pencil, Trash2, Check, X } from "lucide-react";
import Link from "next/link";
import { groupConversationsByDate } from "@/lib/chatbot/group-by-date";
import type { ChatConversation } from "@/lib/chatbot/types";
import { LogoMark } from "@/components/logo-mark";
import { cn } from "@/lib/utils";

export function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onCreate,
  onRename,
  onDelete,
  isOpen,
  onClose,
}: {
  conversations: ChatConversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const filtered = query.trim()
    ? conversations.filter((c) => c.title.toLowerCase().includes(query.trim().toLowerCase()))
    : conversations;
  const groups = groupConversationsByDate(filtered);

  const startRename = (c: ChatConversation) => {
    setRenamingId(c.id);
    setRenameValue(c.title);
  };

  const commitRename = () => {
    if (renamingId && renameValue.trim()) onRename(renamingId, renameValue.trim());
    setRenamingId(null);
  };

  const content = (
    <div className="flex h-full w-72 flex-col bg-bg-2 border-e border-line">
      <div className="p-4 space-y-3">
        <Link href="/" className="flex items-center gap-2 font-display text-base font-extrabold px-1">
          <LogoMark className="h-7 w-7 rounded-[8px]" />
          استاد موزیک
        </Link>
        <button
          onClick={onCreate}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold text-[#181209] py-2.5 text-sm font-semibold"
        >
          <Plus className="h-4 w-4" /> گفت‌وگوی جدید
        </button>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جست‌وجوی گفت‌وگو..."
            className="w-full h-10 rounded-xl border border-line bg-surface pr-9 pl-3 text-sm focus-visible:outline-none focus-visible:border-gold/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-4">
        {groups.length === 0 && (
          <p className="text-center text-xs text-muted mt-6">گفت‌وگویی پیدا نشد.</p>
        )}
        {groups.map((group) => (
          <div key={group.label}>
            <div className="px-2 mb-1.5 text-xs text-muted font-medium">{group.label}</div>
            <div className="space-y-1">
              {group.conversations.map((c) => (
                <div
                  key={c.id}
                  className={cn(
                    "group relative flex items-center gap-2 rounded-xl px-3 py-2.5 cursor-pointer",
                    activeId === c.id ? "bg-gold-soft" : "hover:bg-surface"
                  )}
                  onClick={() => renamingId !== c.id && onSelect(c.id)}
                >
                  {renamingId === c.id ? (
                    <div className="flex flex-1 items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        autoFocus
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitRename();
                          if (e.key === "Escape") setRenamingId(null);
                        }}
                        className="flex-1 h-7 rounded-lg border border-gold/40 bg-surface px-2 text-xs focus-visible:outline-none"
                      />
                      <button onClick={commitRename} className="text-emerald-600">
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setRenamingId(null)} className="text-muted">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span
                        className={cn(
                          "flex-1 truncate text-sm",
                          activeId === c.id ? "text-gold font-medium" : "text-ink/90"
                        )}
                      >
                        {c.title}
                      </span>
                      <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startRename(c);
                          }}
                          className="p-1 text-muted hover:text-ink"
                          aria-label="تغییر نام"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(c.id);
                          }}
                          className="p-1 text-muted hover:text-red-600"
                          aria-label="حذف"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: static sidebar */}
      <div className="hidden lg:block h-screen sticky top-0 shrink-0">{content}</div>

      {/* Mobile: drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="lg:hidden fixed inset-0 z-[200]">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={onClose}
              aria-label="بستن فهرست"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="absolute inset-y-0 start-0"
            >
              {content}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
