export type ServerEvent =
  | { type: "connected" }
  | { type: "room_full" }
  | { type: "color"; color: "white" | "black" }
  | { type: "move"; move: string }
  | { type: "fen"; fen: string }
  | { type: "out_of_turn_move" }
  | { type: "unknown"; raw: string };

export function parseServerMessage(raw: string): ServerEvent {
  try {
    const obj = JSON.parse(raw);
    if (obj && typeof obj === "object" && "type" in obj) {
      switch (obj.type) {
        case "connected": return { type: "connected" };
        case "room_full": return { type: "room_full" };
        case "color": return { type: "color", color: obj.color };
        case "move": return { type: "move", move: obj.move };
        case "fen": return { type: "fen", fen: obj.fen };
        case "out_of_turn_move": return { type: "out_of_turn_move" };
      }
    }
  } catch {}

  if (raw === "connected") return { type: "connected" };
  if (raw === "room is full") return { type: "room_full" };
  if (raw === "white" || raw === "black") return { type: "color", color: raw as "white" | "black" };
  if (raw === "not your turn") return { type: "out_of_turn_move" };
  if (/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(raw)) return { type: "move", move: raw };
  if (raw.split(" ").length >= 6 && raw.includes("/")) return { type: "fen", fen: raw };

  return { type: "unknown", raw };
}
