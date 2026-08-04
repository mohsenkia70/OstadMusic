"use client";

import { useCallback, useRef, useState } from "react";
import { useChatStore } from "./store";
import { streamChatReply, ChatServiceError } from "./chat-service";
import type { AssistantModeId, ChatMessage } from "./types";

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useChat(conversationId: string | null, mode: AssistantModeId) {
  const addMessage = useChatStore((s) => s.addMessage);
  const updateMessage = useChatStore((s) => s.updateMessage);
  const removeMessage = useChatStore((s) => s.removeMessage);
  const messages = useChatStore((s) => (conversationId ? (s.messages[conversationId] ?? []) : []));

  const [isStreaming, setIsStreaming] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const runAssistantReply = useCallback(
    async (convId: string, history: { role: "user" | "assistant" | "system"; content: string }[]) => {
      const assistantMessageId = newId();
      addMessage(convId, {
        id: assistantMessageId,
        conversationId: convId,
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
        pending: true,
      });

      setIsStreaming(true);
      const controller = new AbortController();
      abortRef.current = controller;

      let accumulated = "";
      try {
        const { demo } = await streamChatReply(
          { conversationId: convId, mode, messages: history },
          (chunk) => {
            accumulated += chunk;
            updateMessage(convId, assistantMessageId, { content: accumulated });
          },
          controller.signal
        );
        setDemoMode(demo);
        updateMessage(convId, assistantMessageId, { content: accumulated.trim(), pending: false });
      } catch (err) {
        const message =
          err instanceof ChatServiceError || err instanceof Error
            ? err.message
            : "ارتباط با دستیار هوشمند برقرار نشد.";
        updateMessage(convId, assistantMessageId, {
          content: accumulated || message,
          pending: false,
          error: true,
        });
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [addMessage, updateMessage, mode]
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (!conversationId || !text.trim() || isStreaming) return;

      const userMessage: ChatMessage = {
        id: newId(),
        conversationId,
        role: "user",
        content: text.trim(),
        createdAt: new Date().toISOString(),
      };
      addMessage(conversationId, userMessage);

      const history = [...messages, userMessage].map((m) => ({ role: m.role, content: m.content }));
      await runAssistantReply(conversationId, history);
    },
    [conversationId, isStreaming, messages, addMessage, runAssistantReply]
  );

  const regenerate = useCallback(async () => {
    if (!conversationId || isStreaming) return;
    const current = messages;
    const lastUserIndex = [...current].map((m) => m.role).lastIndexOf("user");
    if (lastUserIndex === -1) return;

    // Drop every message after (and including) the last assistant reply so we
    // can regenerate it, but keep everything up to and including that user turn.
    const trailing = current.slice(lastUserIndex + 1);
    trailing.forEach((m) => removeMessage(conversationId, m.id));

    const history = current.slice(0, lastUserIndex + 1).map((m) => ({ role: m.role, content: m.content }));
    await runAssistantReply(conversationId, history);
  }, [conversationId, isStreaming, messages, removeMessage, runAssistantReply]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  return { messages, isStreaming, demoMode, sendMessage, regenerate, stop };
}
