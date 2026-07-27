"use client";

import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageSquare,
  PenTool,
  Users,
  PhoneOff,
  MonitorUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

type PanelKind = "chat" | "whiteboard" | "participants" | null;

export function ControlBar({
  muted,
  camOff,
  screenSharing,
  activePanel,
  unreadChat,
  isTeacher,
  onToggleMic,
  onToggleCamera,
  onToggleScreenShare,
  onTogglePanel,
  onLeave,
}: {
  muted: boolean;
  camOff: boolean;
  screenSharing: boolean;
  activePanel: PanelKind;
  unreadChat: number;
  isTeacher: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  onTogglePanel: (panel: Exclude<PanelKind, null>) => void;
  onLeave: () => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2.5 border-t border-line bg-surface px-4 py-4">
      <ControlButton active={!muted} danger={muted} onClick={onToggleMic} label={muted ? "میکروفون خاموش" : "میکروفون روشن"}>
        {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </ControlButton>

      <ControlButton active={!camOff} danger={camOff} onClick={onToggleCamera} label={camOff ? "دوربین خاموش" : "دوربین روشن"}>
        {camOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
      </ControlButton>

      <ControlButton active={screenSharing} onClick={onToggleScreenShare} label="اشتراک صفحه">
        <MonitorUp className="h-5 w-5" />
      </ControlButton>

      <div className="w-px h-8 bg-line mx-1" />

      <ControlButton active={activePanel === "chat"} onClick={() => onTogglePanel("chat")} label="گفت‌وگو">
        <span className="relative">
          <MessageSquare className="h-5 w-5" />
          {unreadChat > 0 && (
            <span className="absolute -top-1.5 -end-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-[#181209]">
              {unreadChat > 9 ? "9+" : unreadChat}
            </span>
          )}
        </span>
      </ControlButton>

      <ControlButton active={activePanel === "whiteboard"} onClick={() => onTogglePanel("whiteboard")} label="تخته‌ی سفید">
        <PenTool className="h-5 w-5" />
      </ControlButton>

      <ControlButton active={activePanel === "participants"} onClick={() => onTogglePanel("participants")} label="شرکت‌کنندگان">
        <Users className="h-5 w-5" />
      </ControlButton>

      <div className="w-px h-8 bg-line mx-1" />

      <button
        onClick={onLeave}
        className="flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white px-5 h-11 text-sm font-semibold transition-colors"
      >
        <PhoneOff className="h-4 w-4" />
        {isTeacher ? "پایان کلاس" : "خروج از کلاس"}
      </button>
    </div>
  );
}

function ControlButton({
  children,
  active,
  danger,
  onClick,
  label,
}: {
  children: React.ReactNode;
  active?: boolean;
  danger?: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
        danger
          ? "bg-red-50 text-red-600 hover:bg-red-100"
          : active
            ? "bg-gold-soft text-gold"
            : "bg-surface-2 text-muted hover:text-ink"
      )}
    >
      {children}
    </button>
  );
}
