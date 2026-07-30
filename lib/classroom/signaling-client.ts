import type { ClientMessage, ServerMessage } from "./types";

type Listener = (msg: ServerMessage) => void;

export const SIGNALING_URL =
  process.env.NEXT_PUBLIC_SIGNALING_URL || "ws://localhost:4001";

export class SignalingClient {
  private ws: WebSocket | null = null;
  private listeners = new Set<Listener>();
  private queue: ClientMessage[] = [];
  private manuallyClosed = false;

  connect() {
    this.manuallyClosed = false;
    this.ws = new WebSocket(SIGNALING_URL);

    this.ws.onopen = () => {
      // Flush anything queued before the socket was ready (e.g. the initial "join")
      this.queue.forEach((m) => this.ws?.send(JSON.stringify(m)));
      this.queue = [];
    };

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as ServerMessage;
        this.listeners.forEach((l) => l(msg));
      } catch {
        // ignore malformed frames
      }
    };

    this.ws.onclose = () => {
      // Intentionally no auto-reconnect loop here: a dropped classroom connection
      // should surface to the UI (see ConnectionState) rather than silently retry
      // mid-call, which could produce duplicate peer connections.
    };
  }

  on(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  send(msg: ClientMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    } else {
      this.queue.push(msg);
    }
  }

  get readyState() {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }

  close() {
    this.manuallyClosed = true;
    this.ws?.close();
    this.ws = null;
    this.listeners.clear();
  }

  get wasManuallyClosed() {
    return this.manuallyClosed;
  }
}
