import type { SignalingClient } from "./signaling-client";

// Public STUN only. For production use behind restrictive/symmetric NATs
// (many corporate and mobile networks) you'll also want a TURN server —
// see the README note in the classroom section. STUN alone is enough for
// most home/office networks and is fine for development and small classes.
const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

type SignalPayload =
  | { kind: "offer"; sdp: RTCSessionDescriptionInit }
  | { kind: "answer"; sdp: RTCSessionDescriptionInit }
  | { kind: "ice"; candidate: RTCIceCandidateInit };

export class PeerConnectionManager {
  private connections = new Map<string, RTCPeerConnection>();
  private localStream: MediaStream | null = null;

  constructor(
    private signaling: SignalingClient,
    private onRemoteStream: (peerId: string, stream: MediaStream) => void,
    private onPeerClosed: (peerId: string) => void
  ) {}

  setLocalStream(stream: MediaStream) {
    this.localStream = stream;
    // Attach to any already-open connections (e.g. camera enabled after joining)
    this.connections.forEach((pc) => {
      stream.getTracks().forEach((track) => {
        const already = pc.getSenders().some((s) => s.track === track);
        if (!already) pc.addTrack(track, stream);
      });
    });
  }

  private createConnection(remotePeerId: string) {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        pc.addTrack(track, this.localStream as MediaStream);
      });
    }

    pc.ontrack = (event) => {
      this.onRemoteStream(remotePeerId, event.streams[0]);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.signaling.send({
          type: "signal",
          targetPeerId: remotePeerId,
          data: { kind: "ice", candidate: event.candidate.toJSON() } satisfies SignalPayload,
        });
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "failed" || pc.connectionState === "closed") {
        this.closeConnection(remotePeerId);
      }
    };

    this.connections.set(remotePeerId, pc);
    return pc;
  }

  /** Called for participants already in the room when we join — we initiate. */
  async connectTo(remotePeerId: string) {
    const pc = this.createConnection(remotePeerId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    this.signaling.send({
      type: "signal",
      targetPeerId: remotePeerId,
      data: { kind: "offer", sdp: offer } satisfies SignalPayload,
    });
  }

  /** Called when we receive a signaling message from another peer. */
  async handleSignal(fromPeerId: string, data: unknown) {
    const payload = data as SignalPayload;
    let pc = this.connections.get(fromPeerId);

    if (payload.kind === "offer") {
      if (!pc) pc = this.createConnection(fromPeerId);
      await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      this.signaling.send({
        type: "signal",
        targetPeerId: fromPeerId,
        data: { kind: "answer", sdp: answer } satisfies SignalPayload,
      });
    } else if (payload.kind === "answer") {
      if (pc) await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
    } else if (payload.kind === "ice") {
      if (pc) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
        } catch {
          // candidate arriving before remote description is set is expected occasionally
        }
      }
    }
  }

  closeConnection(peerId: string) {
    const pc = this.connections.get(peerId);
    if (pc) {
      pc.close();
      this.connections.delete(peerId);
      this.onPeerClosed(peerId);
    }
  }

  closeAll() {
    this.connections.forEach((pc) => pc.close());
    this.connections.clear();
  }

  toggleLocalTrack(kind: "audio" | "video", enabled: boolean) {
    this.localStream?.getTracks().forEach((track) => {
      if (track.kind === kind) track.enabled = enabled;
    });
  }

  /** Swaps the outgoing video track (camera <-> screen share) on every active connection. */
  async replaceVideoTrack(newTrack: MediaStreamTrack) {
    for (const pc of this.connections.values()) {
      const sender = pc.getSenders().find((s) => s.track?.kind === "video");
      if (sender) await sender.replaceTrack(newTrack);
    }
  }
}
