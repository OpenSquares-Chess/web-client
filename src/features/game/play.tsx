import { useEffect, useMemo, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Link } from "react-router-dom";

/**
 * CHANGE THIS if your server runs elsewhere:
 * Your Rust server listens on ws://localhost:8080 and expects:
 *  1) On connect: {"room": 0, "uuid": "some-id"}
 *  2) Then it sends: "connected", then "white"/"black", then a FEN string
 *  3) To make a move, send LAN like "e2e4"
 */
const WS_URL = "ws://localhost:8080";

// Quick test to recognize LAN move strings like "e2e4" or "a7a8q"
const isLanMove = (s: string) => /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(s);
const looksLikeFen = (s: string) =>
  s.includes(" KQ") || s.includes(" kq") || s.includes(" w ") || s.includes(" b ");

export default function Play() {
  // Stable chess engine instance (client-side mirror; server remains authoritative)
  const game = useMemo(() => new Chess(), []);

  // UI state
  const [uuid] = useState(() => "user-" + Math.floor(Math.random() * 10000));
  const [color, setColor] = useState<"white" | "black" | null>(null);
  const [fen, setFen] = useState<string>(game.fen());
  const [log, setLog] = useState<string[]>([]);

  // WebSocket hook
  const { sendMessage, lastMessage, readyState } = useWebSocket(WS_URL, {
    share: true,
    shouldReconnect: () => true,
  });

  // When socket opens, send the join message once
  const [joined, setJoined] = useState(false);
  useEffect(() => {
    if (readyState === ReadyState.OPEN && !joined) {
      sendMessage(JSON.stringify({ room: 0, uuid }));
      setJoined(true);
      setLog((l) => [...l, `➡ join: {"room":0,"uuid":"${uuid}"}`]);
    }
  }, [readyState, joined, sendMessage, uuid]);

  // Handle each message from the server
  useEffect(() => {
    if (!lastMessage) return;
    const msg = String(lastMessage.data);
    setLog((l) => [...l, `⬅ ${msg}`]);

    if (msg === "connected") return;

    if (msg === "white" || msg === "black") {
      setColor(msg);
      return;
    }

    if (msg === "not your turn") {
      alert("Not your turn!");
      // Re-render from current game state (the server will keep us honest)
      setFen(game.fen());
      return;
    }

    if (isLanMove(msg)) {
      // Opponent move arrives as LAN (e.g., "e2e4"); we wait for the FEN that follows.
      // No local action needed here because your server also sends a FEN right after.
      return;
    }

    if (looksLikeFen(msg)) {
      // Server sent an authoritative FEN; load it into our local mirror.
      try {
        // chess.js can load FEN via load()
        // If your version doesn't have load(), use game.reset(); game.loadPgn(pgn) for PGN.
        // For FEN, load() is correct in chess.js v1+
        // @ts-ignore - types vary by version, but runtime supports load(fen)
        game.load(msg);
        setFen(game.fen());
      } catch (e) {
        console.error("Could not load FEN from server:", msg, e);
      }
      return;
    }

    // Otherwise: treat as plain text, ignore
  }, [lastMessage, game]);

  // Whose turn? (from the FEN)
  const sideToMove = fen.split(" ")[1]; // "w" or "b"
  const yourTurn =
    (color === "white" && sideToMove === "w") ||
    (color === "black" && sideToMove === "b");

  // Called when you drop a piece on the board
  async function onDrop(sourceSquare: string, targetSquare: string) {
    // Build the LAN string the server expects
    // Handle promotion (simple default to queen if a pawn reaches last rank)
    let lan = `${sourceSquare}${targetSquare}`;
    const srcRank = Number(sourceSquare[1]);
    const dstRank = Number(targetSquare[1]);
    const movingPiece = game.get(sourceSquare as any);

    const isPawn =
      movingPiece && movingPiece.type && movingPiece.type.toLowerCase() === "p";

    const promotionToLastRank =
      isPawn &&
      ((color === "white" && dstRank === 8) || (color === "black" && dstRank === 1));

    if (promotionToLastRank) {
      lan += "q"; // always promote to queen for now
    }

    // Send to the server; DO NOT update board until server sends FEN
    if (!yourTurn) {
      alert("Not your turn!");
      return false; // snap back piece
    }

    sendMessage(lan);
    setLog((l) => [...l, `➡ move: ${lan}`]);
    return false; // wait for server FEN; piece will snap back then update from FEN
  }

  return (
    <div style={{ textAlign: "center", marginTop: 32 }}>
      <h1>♟ Game Room</h1>

      <p>
        WebSocket:{" "}
        {readyState === ReadyState.OPEN ? "✅ Connected" : "❌ Not Connected"}
      </p>
      <p>Your ID: <code>{uuid}</code></p>
      <p>
        Your Color: <b>{color ?? "waiting…"}</b> | Side to move in FEN:{" "}
        <b>{sideToMove}</b> | Your turn? <b>{yourTurn ? "Yes" : "No"}</b>
      </p>

      <div style={{ maxWidth: 520, margin: "20px auto" }}>
        <Chessboard
          position={fen}
          boardOrientation={(color ?? "white") as "white" | "black"}
          arePiecesDraggable={yourTurn}
          onPieceDrop={onDrop}
        />
      </div>

      <p style={{ marginTop: 8 }}>
        <Link to="/dashboard">⬅ Back to Dashboard</Link>
      </p>

      <div
        style={{
          textAlign: "left",
          width: "80%",
          margin: "24px auto",
          border: "1px solid #ddd",
          padding: 12,
          maxHeight: 220,
          overflow: "auto",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas",
          fontSize: 13,
          background: "#fafafa",
        }}
      >
        <b>Event log</b>
        {log.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
}
