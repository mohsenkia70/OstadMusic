"use client";

import { Crown, Mic, MicOff, VideoOff, MoreVertical } from "lucide-react";
import { useState } from "react";
import type { ParticipantInfo } from "@/lib/classroom/types";

export function ParticipantsPanel({
  participants,
  selfName,
  selfMuted,
  selfCamOff,
  isTeacher,
  onMute,
  onRemove,
}: {
  participants: ParticipantInfo[];
  selfName: string;
  selfMuted: boolean;
  selfCamOff: boolean;
  isTeacher: boolean;
  onMute: (peerId: string) => void;
  onRemove: (peerId: string) => void;
}) {
  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);

  return (
    <div className="p-4 space-y-2 overflow-y-auto h-full">
      <p className="text-xs text-muted mb-2">
        {(participants.length + 1).toLocaleString("fa-IR")} نفر در کلاس
      </p>

      {/* self row */}
      <div className="flex items-center justify-between rounded-xl bg-surface-2 px-3.5 py-2.5">
        <span className="text-sm font-medium">{selfName} (خودت)</span>
        <div className="flex items-center gap-2 text-muted">
          {selfMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          {selfCamOff && <VideoOff className="h-4 w-4" />}
        </div>
      </div>

      {participants.map((p) => (
        <div key={p.peerId} className="flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-surface-2">
          <span className="flex items-center gap-1.5 text-sm font-medium">
            {p.role === "teacher" && <Crown className="h-3.5 w-3.5 text-gold" />}
            {p.name}
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-muted">
              {p.muted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {p.camOff && <VideoOff className="h-4 w-4" />}
            </div>
            {isTeacher && p.role !== "teacher" && (
              <div className="relative">
                <button
                  onClick={() => setOpenMenuFor(openMenuFor === p.peerId ? null : p.peerId)}
                  className="p-1 text-muted hover:text-ink"
                  aria-label="گزینه‌های بیشتر"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
                {openMenuFor === p.peerId && (
                  <div className="absolute left-0 top-7 z-10 w-40 rounded-xl border border-line bg-surface shadow-lg py-1.5">
                    <button
                      onClick={() => {
                        onMute(p.peerId);
                        setOpenMenuFor(null);
                      }}
                      className="w-full text-start px-3.5 py-2 text-xs hover:bg-surface-2"
                    >
                      قطع میکروفون
                    </button>
                    <button
                      onClick={() => {
                        onRemove(p.peerId);
                        setOpenMenuFor(null);
                      }}
                      className="w-full text-start px-3.5 py-2 text-xs text-red-600 hover:bg-surface-2"
                    >
                      حذف از کلاس
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
