"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, UserX, Loader2 } from "lucide-react";
import { useClassroom } from "@/lib/classroom/use-classroom";
import { PreJoinScreen } from "@/components/classroom/pre-join-screen";
import { VideoTile } from "@/components/classroom/video-tile";
import { ControlBar } from "@/components/classroom/control-bar";
import { ChatPanel } from "@/components/classroom/chat-panel";
import { ParticipantsPanel } from "@/components/classroom/participants-panel";
import { WhiteboardPanel } from "@/components/classroom/whiteboard-panel";
import { Button } from "@/components/ui/button";
import type { Role } from "@/lib/classroom/types";

type PanelKind = "chat" | "whiteboard" | "participants" | null;

function ClassroomContent() {
  const params = useParams<{ roomId: string }>();
  const searchParams = useSearchParams();

  const role: Role = searchParams.get("role") === "teacher" ? "teacher" : "student";
  const name = searchParams.get("name") || (role === "teacher" ? "استاد" : "هنرجو");
  const roomId = params.roomId;

  const [phase, setPhase] = useState<"pre-join" | "in-call">("pre-join");
  const [activePanel, setActivePanel] = useState<PanelKind>(null);
  const [lastSeenChatCount, setLastSeenChatCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const {
    selfPeerId,
    connectionState,
    participants,
    remoteStreams,
    localStream,
    chatMessages,
    muted,
    camOff,
    mediaError,
    screenSharing,
    removed,
    join,
    leave,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    sendChat,
    sendWhiteboardEvent,
    onWhiteboardEvent,
    hostControl,
  } = useClassroom({ roomId, name, role });

  const unreadChat = activePanel === "chat" ? 0 : Math.max(0, chatMessages.length - lastSeenChatCount);

  useEffect(() => {
    if (connectionState !== "connected") return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [connectionState]);

  const handleJoin = (stream: MediaStream | null, micOn: boolean, camOn: boolean) => {
    setPhase("in-call");
    join(stream, micOn, camOn);
  };

  const handleTogglePanel = (panel: Exclude<PanelKind, null>) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
    if (panel === "chat") setLastSeenChatCount(chatMessages.length);
  };

  const formatElapsed = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  if (phase === "pre-join") {
    return (
      <PreJoinScreen
        roomTitle={`کلاس آنلاین استاد موزیک — اتاق ${roomId}`}
        name={name}
        onJoin={handleJoin}
      />
    );
  }

  if (removed) {
    return (
      <EndScreen
        icon={<UserX className="h-10 w-10 text-red-600" />}
        title="از کلاس حذف شدی"
        desc="استاد تو را از این کلاس خارج کرده. برای اطلاعات بیشتر با پشتیبانی استاد موزیک در تماس باش."
      />
    );
  }

  if (connectionState === "ended") {
    return (
      <EndScreen
        icon={<CheckCircle2 className="h-10 w-10 text-gold" />}
        title="کلاس به پایان رسید"
        desc="امیدواریم جلسه‌ی خوبی بوده باشه. می‌تونی به داشبورد برگردی."
      />
    );
  }

  const isTeacher = role === "teacher";
  const gridCount = participants.length + 1;

  return (
    <div className="h-screen flex flex-col bg-bg">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-semibold">کلاس آنلاین استاد موزیک</span>
          <span className="text-xs text-muted">{formatElapsed(elapsed)}</span>
        </div>
        {connectionState === "connecting" || connectionState === "requesting-media" ? (
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> در حال اتصال...
          </span>
        ) : (
          <span className="text-xs text-muted">
            {gridCount.toLocaleString("fa-IR")} نفر در کلاس
          </span>
        )}
      </div>

      {mediaError && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-xs px-5 py-2.5 text-center">
          {mediaError}
        </div>
      )}

      <div className="flex-1 flex min-h-0">
        <div
          className={`flex-1 grid gap-3 p-4 content-start ${
            gridCount <= 1
              ? "grid-cols-1"
              : gridCount === 2
                ? "grid-cols-1 sm:grid-cols-2"
                : "grid-cols-2 lg:grid-cols-3"
          }`}
        >
          <VideoTile
            stream={localStream}
            name={name}
            isSelf
            muted={muted}
            camOff={camOff}
            isTeacher={isTeacher}
          />
          {participants.map((p) => (
            <VideoTile
              key={p.peerId}
              stream={remoteStreams[p.peerId] || null}
              name={p.name}
              muted={p.muted}
              camOff={p.camOff}
              isTeacher={p.role === "teacher"}
            />
          ))}
        </div>

        {activePanel && (
          <div className="w-full max-w-[340px] border-s border-line bg-surface shrink-0">
            {activePanel === "chat" && (
              <ChatPanel messages={chatMessages} selfPeerId={selfPeerId} onSend={sendChat} />
            )}
            {activePanel === "participants" && (
              <ParticipantsPanel
                participants={participants}
                selfName={name}
                selfMuted={muted}
                selfCamOff={camOff}
                isTeacher={isTeacher}
                onMute={(peerId) => hostControl("mute", peerId)}
                onRemove={(peerId) => hostControl("remove", peerId)}
              />
            )}
            {activePanel === "whiteboard" && (
              <WhiteboardPanel onSendEvent={sendWhiteboardEvent} subscribeToRemoteEvents={onWhiteboardEvent} />
            )}
          </div>
        )}
      </div>

      <ControlBar
        muted={muted}
        camOff={camOff}
        screenSharing={screenSharing}
        activePanel={activePanel}
        unreadChat={unreadChat}
        isTeacher={isTeacher}
        onToggleMic={toggleMic}
        onToggleCamera={toggleCamera}
        onToggleScreenShare={toggleScreenShare}
        onTogglePanel={handleTogglePanel}
        onLeave={() => {
          if (isTeacher) hostControl("end-class");
          leave();
        }}
      />
    </div>
  );
}

function EndScreen({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold-soft">
          {icon}
        </div>
        <h1 className="text-xl font-bold mb-2.5">{title}</h1>
        <p className="text-muted text-sm mb-8">{desc}</p>
        <Button asChild size="lg">
          <Link href="/dashboard/student">بازگشت به داشبورد</Link>
        </Button>
      </div>
    </div>
  );
}

export default function ClassroomPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ClassroomContent />
    </Suspense>
  );
}
