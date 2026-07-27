"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SignalingClient } from "./signaling-client";
import { PeerConnectionManager } from "./peer-connection-manager";
import type { ChatMessage, ParticipantInfo, Role, WhiteboardEvent } from "./types";

export type ConnectionState = "idle" | "requesting-media" | "connecting" | "connected" | "ended" | "media-error";

export function useClassroom({
  roomId,
  name,
  role,
}: {
  roomId: string;
  name: string;
  role: Role;
}) {
  const [connectionState, setConnectionState] = useState<ConnectionState>("idle");
  const [participants, setParticipants] = useState<ParticipantInfo[]>([]);
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [screenSharing, setScreenSharing] = useState(false);
  const [removed, setRemoved] = useState(false);
  const cameraTrackRef = useRef<MediaStreamTrack | null>(null);

  const [selfPeerId] = useState<string>(() =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `peer-${Math.random().toString(36).slice(2)}`
  );

  const signalingRef = useRef<SignalingClient | null>(null);
  const pcManagerRef = useRef<PeerConnectionManager | null>(null);

  const join = useCallback(async (preAcquiredStream?: MediaStream | null, initialMicOn = true, initialCamOn = true) => {
    setConnectionState("requesting-media");
    setMediaError(null);

    let stream: MediaStream;
    if (preAcquiredStream) {
      stream = preAcquiredStream;
    } else {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        stream.getAudioTracks().forEach((t) => (t.enabled = initialMicOn));
        stream.getVideoTracks().forEach((t) => (t.enabled = initialCamOn));
        if (!initialMicOn) setMuted(true);
        if (!initialCamOn) setCamOff(true);
      } catch {
        // Camera/mic denied or unavailable — still let them join with no local media
        // so a device issue doesn't lock the student/teacher out of the class entirely.
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
          setCamOff(true);
        } catch {
          setMediaError("دسترسی به دوربین و میکروفون ممکن نشد. می‌توانی بدون تصویر/صدا وارد کلاس شوی یا دسترسی مرورگر را بررسی کنی.");
          stream = new MediaStream();
        }
      }
    }
    setLocalStream(stream);
    cameraTrackRef.current = stream.getVideoTracks()[0] ?? null;

    setConnectionState("connecting");
    const signaling = new SignalingClient();
    signalingRef.current = signaling;

    const pcManager = new PeerConnectionManager(
      signaling,
      (peerId, remoteStream) => {
        setRemoteStreams((prev) => ({ ...prev, [peerId]: remoteStream }));
      },
      (peerId) => {
        setRemoteStreams((prev) => {
          const next = { ...prev };
          delete next[peerId];
          return next;
        });
      }
    );
    pcManagerRef.current = pcManager;
    pcManager.setLocalStream(stream);

    signaling.on((msg) => {
      switch (msg.type) {
        case "room-state": {
          setParticipants(msg.participants);
          setConnectionState("connected");
          msg.participants.forEach((p) => {
            pcManager.connectTo(p.peerId);
          });
          break;
        }
        case "peer-joined": {
          setParticipants((prev) => [
            ...prev,
            { peerId: msg.peerId, name: msg.name, role: msg.role, muted: false, camOff: false },
          ]);
          break;
        }
        case "peer-left": {
          setParticipants((prev) => prev.filter((p) => p.peerId !== msg.peerId));
          pcManager.closeConnection(msg.peerId);
          break;
        }
        case "signal": {
          pcManager.handleSignal(msg.fromPeerId, msg.data);
          break;
        }
        case "chat": {
          setChatMessages((prev) => [
            ...prev,
            { fromPeerId: msg.fromPeerId, name: msg.name, text: msg.text, ts: msg.ts },
          ]);
          break;
        }
        case "media-state": {
          setParticipants((prev) =>
            prev.map((p) => (p.peerId === msg.peerId ? { ...p, muted: msg.muted, camOff: msg.camOff } : p))
          );
          break;
        }
        case "host-control": {
          if (msg.action === "mute") {
            stream.getAudioTracks().forEach((t) => (t.enabled = false));
            setMuted(true);
          } else if (msg.action === "remove") {
            setRemoved(true);
            setConnectionState("ended");
            stream.getTracks().forEach((t) => t.stop());
            pcManager.closeAll();
          }
          break;
        }
        case "class-ended": {
          setConnectionState("ended");
          break;
        }
        default:
          break;
      }
    });

    signaling.connect();
    signaling.send({ type: "join", roomId, peerId: selfPeerId, name, role });
  }, [roomId, name, role, selfPeerId]);

  const leave = useCallback(() => {
    localStream?.getTracks().forEach((t) => t.stop());
    pcManagerRef.current?.closeAll();
    signalingRef.current?.close();
    setConnectionState("ended");
  }, [localStream]);

  const toggleMic = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      pcManagerRef.current?.toggleLocalTrack("audio", !next);
      signalingRef.current?.send({ type: "media-state", muted: next, camOff });
      return next;
    });
  }, [camOff]);

  const toggleCamera = useCallback(() => {
    setCamOff((prev) => {
      const next = !prev;
      pcManagerRef.current?.toggleLocalTrack("video", !next);
      signalingRef.current?.send({ type: "media-state", muted, camOff: next });
      return next;
    });
  }, [muted]);

  const sendChat = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      signalingRef.current?.send({ type: "chat", name, text });
      setChatMessages((prev) => [...prev, { fromPeerId: selfPeerId, name, text, ts: Date.now() }]);
    },
    [name, selfPeerId]
  );

  const sendWhiteboardEvent = useCallback((event: WhiteboardEvent) => {
    signalingRef.current?.send({ type: "whiteboard", event });
  }, []);

  const onWhiteboardEvent = useCallback((handler: (event: WhiteboardEvent, fromPeerId: string) => void) => {
    return signalingRef.current?.on((msg) => {
      if (msg.type === "whiteboard") handler(msg.event, msg.fromPeerId);
    });
  }, []);

  const toggleScreenShare = useCallback(async () => {
    if (!pcManagerRef.current) return;

    if (!screenSharing) {
      try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = displayStream.getVideoTracks()[0];
        await pcManagerRef.current.replaceVideoTrack(screenTrack);
        screenTrack.onended = () => {
          // user stopped sharing via the browser's own "stop sharing" UI
          if (cameraTrackRef.current) pcManagerRef.current?.replaceVideoTrack(cameraTrackRef.current);
          setScreenSharing(false);
        };
        setScreenSharing(true);
      } catch {
        // user cancelled the screen-share picker — no-op
      }
    } else {
      if (cameraTrackRef.current) await pcManagerRef.current.replaceVideoTrack(cameraTrackRef.current);
      setScreenSharing(false);
    }
  }, [screenSharing]);

  const hostControl = useCallback((action: "mute" | "remove" | "end-class", targetPeerId?: string) => {
    signalingRef.current?.send({ type: "host-control", action, targetPeerId });
  }, []);

  useEffect(() => {
    return () => {
      localStream?.getTracks().forEach((t) => t.stop());
      pcManagerRef.current?.closeAll();
      signalingRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
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
  };
}
