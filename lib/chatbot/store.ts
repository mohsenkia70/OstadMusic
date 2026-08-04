import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AssistantModeId, ChatConversation, ChatMessage } from "./types";

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

type ChatStoreState = {
  conversations: ChatConversation[];
  messages: Record<string, ChatMessage[]>; // conversationId -> messages
  activeConversationId: string | null;
  hasHydrated: boolean;

  createConversation: (mode: AssistantModeId, title?: string) => string;
  renameConversation: (id: string, title: string) => void;
  setConversationMode: (id: string, mode: AssistantModeId) => void;
  deleteConversation: (id: string) => void;
  clearConversationMessages: (id: string) => void;
  setActiveConversation: (id: string | null) => void;

  addMessage: (conversationId: string, message: ChatMessage) => void;
  updateMessage: (conversationId: string, messageId: string, patch: Partial<ChatMessage>) => void;
  removeMessage: (conversationId: string, messageId: string) => void;
  setMessages: (conversationId: string, messages: ChatMessage[]) => void;
};

export const useChatStore = create<ChatStoreState>()(
  persist(
    (set) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      hasHydrated: false,

      createConversation: (mode, title = "گفت‌وگوی جدید") => {
        const id = newId();
        const now = new Date().toISOString();
        const conversation: ChatConversation = { id, userId: null, title, mode, createdAt: now, updatedAt: now };
        set((state) => ({
          conversations: [conversation, ...state.conversations],
          messages: { ...state.messages, [id]: [] },
          activeConversationId: id,
        }));
        return id;
      },

      renameConversation: (id, title) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, title, updatedAt: new Date().toISOString() } : c
          ),
        }));
      },

      setConversationMode: (id, mode) => {
        set((state) => ({
          conversations: state.conversations.map((c) => (c.id === id ? { ...c, mode } : c)),
        }));
      },

      deleteConversation: (id) => {
        set((state) => {
          const nextMessages = { ...state.messages };
          delete nextMessages[id];
          const conversations = state.conversations.filter((c) => c.id !== id);
          const wasActive = state.activeConversationId === id;
          return {
            conversations,
            messages: nextMessages,
            activeConversationId: wasActive ? (conversations[0]?.id ?? null) : state.activeConversationId,
          };
        });
      },

      clearConversationMessages: (id) => {
        set((state) => ({ messages: { ...state.messages, [id]: [] } }));
      },

      setActiveConversation: (id) => set({ activeConversationId: id }),

      addMessage: (conversationId, message) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: [...(state.messages[conversationId] ?? []), message],
          },
          conversations: state.conversations.map((c) =>
            c.id === conversationId ? { ...c, updatedAt: new Date().toISOString() } : c
          ),
        }));
      },

      updateMessage: (conversationId, messageId, patch) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: (state.messages[conversationId] ?? []).map((m) =>
              m.id === messageId ? { ...m, ...patch } : m
            ),
          },
        }));
      },

      removeMessage: (conversationId, messageId) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: (state.messages[conversationId] ?? []).filter((m) => m.id !== messageId),
          },
        }));
      },

      setMessages: (conversationId, messages) => {
        set((state) => ({ messages: { ...state.messages, [conversationId]: messages } }));
      },
    }),
    {
      name: "ostad-music-chatbot",
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true;
      },
      partialize: (state) => ({
        conversations: state.conversations,
        messages: state.messages,
        activeConversationId: state.activeConversationId,
      }),
    }
  )
);

export function getMessagesForConversation(conversationId: string | null): ChatMessage[] {
  if (!conversationId) return [];
  return useChatStore.getState().messages[conversationId] ?? [];
}
