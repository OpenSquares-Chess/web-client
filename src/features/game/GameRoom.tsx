import React, { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import ChessBoard from "../../components/ChessBoard/ChessBoard";
import { useGameStore } from "../../state/gameStore";
import { useAuthStore } from "../../state/authStore";
import { GameSocket } from "../../lib/ws";
import { Chess } from "chess.js";

const WS_URL = import.meta.env.VITE_WS_URL as string;

function makeUuid(): string {
  if (typeof crypto !== "undefined" && typeof (crypto as any).randomUUID === "function") {
    return (crypto as any).randomUUID();
  }
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}

function orderedRooms(): number[] { return Array.from({ length: 10 }, (_, i) => i); }

type LastMove = { from: string; to: string } | null;

export default function GameRoom() {
  const authUser = useAuthStore((s) => s.user);
  const myUuid = useRef<string>(authUser?.id ?? makeUuid()).current;

  const { setRoom, setUuid, setColor, myColor, fen, setFen, setConnected } = useGameStore();

  const [status, setStatus] = useState("Not connected");
  const [opponentConnected, setOpponentConnected] = useState(false);
  const [activeRoom, setActiveRoom] = useState<number | null>(null);
  const [lastMove, setLastMove] = useState<LastMove>(null);

  const sockRef = useRef<GameSocket | null>(null);
  const chessView = useMemo(() => new Chess(fen), [fen]);

  const attemptsRef = useRef<number[]>([]);
  const idxRef = useRef(0);

  
  const topbarRef = useRef<HTMLDivElement>(null);
  const [topbarH, setTopbarH] = useState(72);
  useLayoutEffect(() => {
    const measure = () => setTopbarH(topbarRef.current?.offsetHeight ?? 72);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    return () => {
      sockRef.current?.close();
      setConnected(false);
      setOpponentConnected(false);
    };
  }, [setConnected]);

  const startRoomHunt = () => {
    setStatus("Connecting…");
    setConnected(false);
    setOpponentConnected(false);
    setActiveRoom(null);
    setLastMove(null);
    attemptsRef.current = orderedRooms();
    idxRef.current = 0;

    const sock = new GameSocket(WS_URL, {
      onOpen: () => {
        const first = attemptsRef.current[idxRef.current];
        setStatus(`Finding a room… (trying ${first})`);
        sock.sendJSON({ room: first, uuid: myUuid });
      },
      onClose: () => {
        if (activeRoom !== null) setStatus("Disconnected");
        setConnected(false);
      },
      onError: () => setStatus("Connection error"),
      onServerEvent: (ev) => {
        switch (ev.type) {
          case "connected": {
            const r = attemptsRef.current[idxRef.current];
            setConnected(true);
            setActiveRoom(r);
            setRoom(r);
            setUuid(myUuid);
            setStatus(`Joined room ${r}`);
            break;
          }
          case "room_full": {
            idxRef.current += 1;
            const next = attemptsRef.current[idxRef.current];
            if (next === undefined) {
              setStatus("All rooms are full right now. Try again soon.");
              return;
            }
            setStatus(`Room full — trying ${next}…`);
            sock.sendJSON({ room: next, uuid: myUuid });
            break;
          }
          case "color":
            setColor(ev.color);
            break;
          case "fen":
            alert("connection error — resyncing board");
            setFen(ev.fen);
            break;
          case "move": {
            setOpponentConnected(true);
            const from = ev.move.slice(0, 2);
            const to = ev.move.slice(2, 4);
            setLastMove({ from, to });
            try {
              chessView.move({ from, to, promotion: ev.move[4] as any });
              const next = chessView.fen();
              setFen(next);
            } catch {}
            break;
          }
          case "out_of_turn_move":
            alert("It's not your turn");
            break;
          case "unknown":
            console.log("Unknown message:", ev.raw);
            break;
        }
      },
    });

    sock.connect();
    sockRef.current = sock;
  };

  const reconnect = () => {
    sockRef.current?.close();
    startRoomHunt();
  };

  const sendMove = (uci: string) => {
    if (!sockRef.current) return;
    const from = uci.slice(0, 2);
    const to = uci.slice(2, 4);
    setLastMove({ from, to });
    try {
      chessView.move({ from, to, promotion: uci[4] as any });
      setFen(chessView.fen());
    } catch {}
    sockRef.current.sendText(uci);
  };

  useEffect(() => { if (!sockRef.current) startRoomHunt(); }, []);

  const sideToMove = useMemo(() => new Chess(fen).turn(), [fen]);
  const playersLine = useMemo(() => opponentConnected ? "You + Opponent" : "You (waiting for opponent to join or move)", [opponentConnected]);
  const myColorLabel = myColor ?? "assigning…";

  return (
    <div
      className="room-root"
      style={{ ["--topbar-h" as any]: `${topbarH}px` }} /* pass measured height to CSS */
    >
      <div className="room-topbar" ref={topbarRef}>
        <div className="container">
          <div className="row" style={{ gap: 8, flexWrap: "wrap", width: "100%" }}>
            <button className="btn primary" onClick={reconnect}>Reconnect / Find Room</button>
            {activeRoom !== null && (
              <button
                className="btn"
                onClick={async () => {
                  const text = `OpenSquares-Chess — join room ${activeRoom}. Open the app, Sign Up, go to Game Room.`;
                  try { await navigator.clipboard.writeText(text); alert("Room invite copied!"); }
                  catch { window.prompt("Copy this invite:", text); }
                }}
              >
                Copy Room Invite
              </button>
            )}
            <div style={{ marginLeft: "auto" }}>
              <b>Status:</b> {status}
              {activeRoom !== null && <> &nbsp;|&nbsp; <b>Room:</b> {activeRoom}</>}
            </div>
          </div>

          <div className="meta">
            <b>Players:</b> {playersLine}
            &nbsp;|&nbsp; <b>Your color:</b> {myColorLabel}
            &nbsp;|&nbsp; <b>Turn:</b> {sideToMove === "w" ? "white" : "black"}
          </div>
        </div>
      </div>

      <div className="room-stage">
        <ChessBoard fen={fen} myColor={myColor} lastMove={lastMove} onMove={sendMove} />
      </div>
    </div>
  );
}
