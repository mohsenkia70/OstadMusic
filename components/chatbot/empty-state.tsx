"use client";

import { motion } from "framer-motion";
import { ASSISTANT_NAME, type AssistantMode } from "@/lib/chatbot/assistant-config";
import { SuggestedQuestions } from "./suggested-questions";

export function EmptyState({ mode, onSelectQuestion }: { mode: AssistantMode; onSelectQuestion: (q: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-blue font-display text-xl font-bold text-[#181209] mb-5">
        {ASSISTANT_NAME.slice(0, 1)}
      </div>
      <h2 className="text-xl font-bold mb-2">سلام! من {ASSISTANT_NAME} هستم</h2>
      <p className="text-muted text-sm max-w-sm mb-8">{mode.description}. هر سوالی داری بپرس، یا یکی از نمونه‌ها را انتخاب کن.</p>
      <SuggestedQuestions questions={mode.suggestedQuestions} onSelect={onSelectQuestion} />
    </motion.div>
  );
}
