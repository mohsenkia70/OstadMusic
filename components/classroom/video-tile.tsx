"use client";

import { useEffect, useRef } from "react";
import { MicOff, VideoOff, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export function VideoTile({
  stream,
  name,
  isSelf,
  muted,
  camOff,
  isTeacher,
  speaking,
}: {
  stream: MediaStream | null;
  name: string;
  isSelf?: boolean;
  muted?: boolean;
  camOff?: boolean;
  isTeacher?: boolean;
  speaking?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const initials = name.trim().slice(0, 2);

  return (
    <div
      className={cn(
        "relative aspect-video rounded-2xl overflow-hidden bg-surface-2 border transition-colors",
        speaking ? "border-gold" : "border-line"
      )}
    >
      {stream && !camOff ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isSelf}
          className={cn("h-full w-full object-cover", isSelf && "scale-x-[-1]")}
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-blue font-display font-bold text-lg text-[#181209]">
            {initials}
          </div>
        </div>
      )}

      <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 rounded-lg bg-black/55 backdrop-blur-sm px-2.5 py-1 text-xs text-white">
          {isTeacher && <Crown className="h-3 w-3 text-gold" />}
          {name} {isSelf && "(خودت)"}
        </span>
        {muted && (
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-black/55 backdrop-blur-sm text-white">
            <MicOff className="h-3.5 w-3.5" />
          </span>
        )}
      </div>

      {camOff && stream && (
        <span className="absolute top-2.5 end-2.5 flex h-6 w-6 items-center justify-center rounded-md bg-black/55 backdrop-blur-sm text-white">
          <VideoOff className="h-3.5 w-3.5" />
        </span>
      )}
    </div>
  );
}
