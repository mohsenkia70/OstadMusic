import type { ChatConversation } from "./types";

export type ConversationGroup = { label: string; conversations: ChatConversation[] };

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function groupConversationsByDate(conversations: ChatConversation[]): ConversationGroup[] {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const today: ChatConversation[] = [];
  const yesterdayList: ChatConversation[] = [];
  const previous: ChatConversation[] = [];

  const sorted = [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  for (const c of sorted) {
    const d = new Date(c.updatedAt);
    if (isSameDay(d, now)) today.push(c);
    else if (isSameDay(d, yesterday)) yesterdayList.push(c);
    else previous.push(c);
  }

  const groups: ConversationGroup[] = [];
  if (today.length) groups.push({ label: "امروز", conversations: today });
  if (yesterdayList.length) groups.push({ label: "دیروز", conversations: yesterdayList });
  if (previous.length) groups.push({ label: "قبل‌تر", conversations: previous });
  return groups;
}
