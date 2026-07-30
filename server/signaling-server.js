/**
 * آرشه — Classroom Signaling Server
 * ----------------------------------
 * A standalone WebSocket server that relays:
 *   - WebRTC signaling (offer / answer / ICE candidates) between peers in the same room
 *   - Text chat messages
 *   - Shared whiteboard draw events
 *   - Presence (join / leave) and host controls (mute participant, remove participant, end class)
 *
 * This process does NOT carry any audio/video/whiteboard data itself — actual media flows
 * peer-to-peer via WebRTC once signaling has completed. This server only exchanges the
 * small JSON handshake messages needed to set that connection up, plus chat/whiteboard
 * events which are cheap enough to relay this way for a small classroom-sized room.
 *
 * Run:  node server/signaling-server.js
 * Env:  SIGNALING_PORT (default 4001)
 */

const { WebSocketServer } = require("ws");

const PORT = process.env.SIGNALING_PORT ? Number(process.env.SIGNALING_PORT) : 4001;
const wss = new WebSocketServer({ port: PORT });

/** roomId -> Map<peerId, { ws, name, role, muted, camOff }> */
const rooms = new Map();

function getRoom(roomId) {
  if (!rooms.has(roomId)) rooms.set(roomId, new Map());
  return rooms.get(roomId);
}

function send(ws, payload) {
  if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(payload));
}

function broadcast(roomId, payload, exceptPeerId) {
  const room = rooms.get(roomId);
  if (!room) return;
  for (const [peerId, peer] of room) {
    if (peerId !== exceptPeerId) send(peer.ws, payload);
  }
}

function roomParticipants(roomId) {
  const room = rooms.get(roomId);
  if (!room) return [];
  return [...room.entries()].map(([peerId, p]) => ({
    peerId,
    name: p.name,
    role: p.role,
    muted: p.muted,
    camOff: p.camOff,
  }));
}

wss.on("connection", (ws) => {
  let currentRoomId = null;
  let peerId = null;

  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return; // ignore malformed frames
    }

    switch (msg.type) {
      case "join": {
        currentRoomId = msg.roomId;
        peerId = msg.peerId;
        const room = getRoom(currentRoomId);
        room.set(peerId, {
          ws,
          name: msg.name || "کاربر",
          role: msg.role === "teacher" ? "teacher" : "student",
          muted: false,
          camOff: false,
        });

        // Tell the newly joined peer who is already in the room
        send(ws, {
          type: "room-state",
          participants: roomParticipants(currentRoomId).filter((p) => p.peerId !== peerId),
        });

        // Tell everyone else that a new peer joined
        broadcast(
          currentRoomId,
          { type: "peer-joined", peerId, name: msg.name, role: msg.role },
          peerId
        );
        break;
      }

      case "signal": {
        // Relay WebRTC offer/answer/ice-candidate to a specific target peer
        const room = rooms.get(currentRoomId);
        const target = room && room.get(msg.targetPeerId);
        if (target) {
          send(target.ws, { type: "signal", fromPeerId: peerId, data: msg.data });
        }
        break;
      }

      case "chat": {
        broadcast(currentRoomId, {
          type: "chat",
          fromPeerId: peerId,
          name: msg.name,
          text: msg.text,
          ts: Date.now(),
        });
        break;
      }

      case "whiteboard": {
        broadcast(currentRoomId, { type: "whiteboard", fromPeerId: peerId, event: msg.event }, peerId);
        break;
      }

      case "media-state": {
        const room = rooms.get(currentRoomId);
        const self = room && room.get(peerId);
        if (self) {
          self.muted = Boolean(msg.muted);
          self.camOff = Boolean(msg.camOff);
        }
        broadcast(currentRoomId, {
          type: "media-state",
          peerId,
          muted: msg.muted,
          camOff: msg.camOff,
        });
        break;
      }

      case "host-control": {
        // action: "mute" | "remove" | "end-class"
        const room = rooms.get(currentRoomId);
        if (!room) break;
        if (msg.action === "end-class") {
          broadcast(currentRoomId, { type: "class-ended" });
          break;
        }
        const target = room.get(msg.targetPeerId);
        if (target) {
          send(target.ws, { type: "host-control", action: msg.action });
        }
        break;
      }

      default:
        break;
    }
  });

  ws.on("close", () => {
    if (currentRoomId && peerId) {
      const room = rooms.get(currentRoomId);
      if (room) {
        room.delete(peerId);
        if (room.size === 0) rooms.delete(currentRoomId);
      }
      broadcast(currentRoomId, { type: "peer-left", peerId });
    }
  });
});

console.log(`[areshe-signaling] listening on ws://localhost:${PORT}`);
