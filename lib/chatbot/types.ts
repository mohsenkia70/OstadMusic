/**
 * Chatbot domain types.
 *
 * These are shaped so that swapping the current Zustand/localStorage
 * persistence for a real database later (Prisma, Supabase, etc.) is a
 * find-and-replace of the storage layer, not a redesign of the data model.
 * See prisma/schema.prisma.example for the suggested table shapes.
 */

export type ChatRole = "user" | "assistant" | "system";

export type AssistantModeId = "general" | "learning" | "support";

export type ChatMessage = {
  id: string;
  conversationId: string;
  role: ChatRole;
  content: string;
  createdAt: string; // ISO timestamp
  /** true if this message represents a failed request the user can retry */
  error?: boolean;
  /** true while this message is still streaming in */
  pending?: boolean;
};

export type ChatConversation = {
  id: string;
  /** null until real auth is wired to the chatbot — see README */
  userId: string | null;
  title: string;
  mode: AssistantModeId;
  createdAt: string;
  updatedAt: string;
};

export type ChatApiRequest = {
  conversationId: string;
  mode: AssistantModeId;
  messages: { role: ChatRole; content: string }[];
};
