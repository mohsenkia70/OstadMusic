"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PreJoinScreen({
  roomTitle,
  name,
  onJoin,
}: {
  roomTitle: string;
  name: string;
  onJoin: (stream: MediaStream | null, micOn: boolean, camOn: boolean) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((s) => {
        if (!active) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => {
        setError("به دوربین یا میکروفون دسترسی پیدا نشد. می‌توانی بدون آن‌ها هم وارد کلاس شوی.");
      })
      .finally(() => setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  const toggleMic = () => {
    setMicOn((prev) => {
      const next = !prev;
      stream?.getAudioTracks().forEach((t) => (t.enabled = next));
      return next;
    });
  };

  const toggleCam = () => {
    setCamOn((prev) => {
      const next = !prev;
      stream?.getVideoTracks().forEach((t) => (t.enabled = next));
      return next;
    });
  };

  const handleJoin = () => {
    stream?.getTracks().forEach((t) => t.stop());
    onJoin(null, micOn, camOn);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-bg-2">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold mb-1.5">آماده‌ی ورود به کلاس؟</h1>
          <p className="text-muted text-sm">{roomTitle}</p>
        </div>

        <div className="relative aspect-video rounded-2xl overflow-hidden bg-surface-2 border border-line mb-5">
          {camOn && stream ? (
            <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover scale-x-[-1]" />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-blue font-display font-bold text-lg text-[#181209]">
                {name.trim().slice(0, 2)}
              </div>
            </div>
          )}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center text-muted text-sm bg-surface-2/80">
              در حال آماده‌سازی دوربین...
            </div>
          )}
          <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-3">
            <button
              onClick={toggleMic}
              className={`flex h-11 w-11 items-center justify-center rounded-full ${
                micOn ? "bg-white/90 text-ink" : "bg-red-600 text-white"
              }`}
              aria-label="میکروفون"
            >
              {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </button>
            <button
              onClick={toggleCam}
              className={`flex h-11 w-11 items-center justify-center rounded-full ${
                camOn ? "bg-white/90 text-ink" : "bg-red-600 text-white"
              }`}
              aria-label="دوربین"
            >
              {camOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-800 mb-5">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <Button size="lg" className="w-full" onClick={handleJoin}>
          ورود به کلاس
        </Button>
      </div>
    </div>
  );
}
