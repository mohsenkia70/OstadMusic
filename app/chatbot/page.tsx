// "use client";

// import { useEffect, useState } from "react";
// import { useChatStore } from "@/lib/chatbot/store";
// import { useChat } from "@/lib/chatbot/use-chat";
// import { getAssistantMode } from "@/lib/chatbot/assistant-config";
// import type { AssistantModeId } from "@/lib/chatbot/types";
// import { ChatSidebar } from "@/components/chatbot/chat-sidebar";
// import { ChatHeader } from "@/components/chatbot/chat-header";
// import { ChatWindow } from "@/components/chatbot/chat-window";

// export default function ChatbotPage() {
//   const conversations = useChatStore((s) => s.conversations);
//   const activeConversationId = useChatStore((s) => s.activeConversationId);
//   const hasHydrated = useChatStore((s) => s.hasHydrated);
//   const createConversation = useChatStore((s) => s.createConversation);
//   const setActiveConversation = useChatStore((s) => s.setActiveConversation);
//   const renameConversation = useChatStore((s) => s.renameConversation);
//   const setConversationMode = useChatStore((s) => s.setConversationMode);
//   const deleteConversation = useChatStore((s) => s.deleteConversation);
//   const clearConversationMessages = useChatStore((s) => s.clearConversationMessages);

//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const activeConversation = conversations.find((c) => c.id === activeConversationId) ?? null;
//   const modeId: AssistantModeId = activeConversation?.mode ?? "general";
//   const mode = getAssistantMode(modeId);

//   const { messages, isStreaming, demoMode, sendMessage, regenerate, stop } = useChat(
//     activeConversationId,
//     modeId
//   );

//   useEffect(() => {
//     if (hasHydrated && conversations.length === 0) {
//       createConversation("general");
//     }
//   }, [hasHydrated, conversations.length, createConversation]);

//   const handleSend = (text: string) => {
//     if (!activeConversationId) return;
//     const isFirstMessage = messages.length === 0;
//     sendMessage(text);
//     if (isFirstMessage) {
//       renameConversation(activeConversationId, text.slice(0, 42));
//     }
//   };

//   const handleCreate = () => {
//     createConversation(modeId);
//     setSidebarOpen(false);
//   };

//   const handleSelect = (id: string) => {
//     setActiveConversation(id);
//     setSidebarOpen(false);
//   };

//   const handleDelete = (id: string) => {
//     deleteConversation(id);
//   };

//   if (!hasHydrated || !activeConversationId) {
//     return <div className="h-dvh bg-bg" />;
//   }

//   return (
//     <div
//       className="
//         flex bg-bg overflow-hidden
//         h-dvh
//         pb-[calc(5.5rem+env(safe-area-inset-bottom))] 
//         lg:pb-0
//       "
//     >
//       <ChatSidebar
//         conversations={conversations}
//         activeId={activeConversationId}
//         onSelect={handleSelect}
//         onCreate={handleCreate}
//         onRename={renameConversation}
//         onDelete={handleDelete}
//         isOpen={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//       />

//       <div className="flex flex-1 flex-col min-w-0">
//         <ChatHeader
//           mode={mode}
//           onModeChange={(id) =>
//             activeConversationId && setConversationMode(activeConversationId, id)
//           }
//           demoMode={demoMode}
//           onOpenSidebar={() => setSidebarOpen(true)}
//           onClearChat={() =>
//             activeConversationId && clearConversationMessages(activeConversationId)
//           }
//           onDeleteConversation={() =>
//             activeConversationId && handleDelete(activeConversationId)
//           }
//         />
//         <ChatWindow
//           messages={messages}
//           mode={mode}
//           isStreaming={isStreaming}
//           onSend={handleSend}
//           onStop={stop}
//           onRegenerate={regenerate}
//         />
//       </div>
//     </div>
//   );
// }