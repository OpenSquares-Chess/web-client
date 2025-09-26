import { parseServerMessage, ServerEvent } from "./gameProtocol";

export type WSEvents = {
  onOpen?: () => void;
  onClose?: (ev: CloseEvent) => void;
  onError?: (ev: Event) => void;
  onServerEvent?: (ev: ServerEvent) => void;
};

export class GameSocket {
  private ws?: WebSocket;
  constructor(private url: string, private events: WSEvents = {}) {}

  connect() {
    this.ws = new WebSocket(this.url);
    this.ws.onopen = () => this.events.onOpen?.();
    this.ws.onclose = (e) => this.events.onClose?.(e);
    this.ws.onerror = (e) => this.events.onError?.(e as Event);
    this.ws.onmessage = (m) => {
      const text = typeof m.data === "string" ? m.data : "";
      this.events.onServerEvent?.(parseServerMessage(text));
    };
  }
  sendJSON(obj: unknown) { this.ws?.send(JSON.stringify(obj)); }
  sendText(text: string) { this.ws?.send(text); }
  close() { this.ws?.close(); }
}
