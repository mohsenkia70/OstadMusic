export type Role = "teacher" | "student";

export type ParticipantInfo = {
  peerId: string;
  name: string;
  role: Role;
  muted: boolean;
  camOff: boolean;
};

export type ChatMessage = {
  fromPeerId: string;
  name: string;
  text: string;
  ts: number;
};

export type WhiteboardEvent =
  | { type: "start"; x: number; y: number; color: string; size: number }
  | { type: "draw"; x: number; y: number }
  | { type: "end" }
  | { type: "clear" };

export type ServerMessage =
  | { type: "room-state"; participants: ParticipantInfo[] }
  | { type: "peer-joined"; peerId: string; name: string; role: Role }
  | { type: "peer-left"; peerId: string }
  | { type: "signal"; fromPeerId: string; data: unknown }
  | { type: "chat"; fromPeerId: string; name: string; text: string; ts: number }
  | { type: "whiteboard"; fromPeerId: string; event: WhiteboardEvent }
  | { type: "media-state"; peerId: string; muted: boolean; camOff: boolean }
  | { type: "host-control"; action: "mute" | "remove" }
  | { type: "class-ended" };

export type ClientMessage =
  | { type: "join"; roomId: string; peerId: string; name: string; role: Role }
  | { type: "signal"; targetPeerId: string; data: unknown }
  | { type: "chat"; name: string; text: string }
  | { type: "whiteboard"; event: WhiteboardEvent }
  | { type: "media-state"; muted: boolean; camOff: boolean }
  | { type: "host-control"; action: "mute" | "remove" | "end-class"; targetPeerId?: string };
