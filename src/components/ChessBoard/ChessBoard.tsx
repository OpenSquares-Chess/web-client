import React, { useMemo, useState } from "react";
import Square from "./Square";
import "./chessboard.css";
import PromotionPicker from "./PromotionPicker";
import { fenToBoardArray, idxToCoord } from "../../lib/fenUtils";
import { Chess } from "chess.js";

type Props = {
  fen: string;
  myColor: "white" | "black" | null;     // board oriented to your color
  lastMove?: { from: string; to: string } | null;
  onMove: (uci: string) => void;         // send UCI (e.g., e2e4, e7e8q)
};

export default function ChessBoard({ fen, myColor, lastMove, onMove }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [dragFrom, setDragFrom] = useState<string | null>(null);
  const [promo, setPromo] = useState<{ from: string; to: string; color: "white" | "black" } | null>(null);

  const chess = useMemo(() => new Chess(fen), [fen]);
  const { board } = useMemo(() => fenToBoardArray(chess.fen()), [chess]);
  const orientation: "white" | "black" = myColor ?? "white";

  const toColorChar = (c: "white" | "black" | null) => (c === "white" ? "w" : c === "black" ? "b" : null);

  const canControlSquare = (coord: string) => {
    const piece = chess.get(coord as any);
    const mine = toColorChar(myColor);
    return !!piece && mine === piece.color && piece.color === chess.turn();
  };

  const targetsFrom = (from: string) =>
    new Set<string>(chess.moves({ square: from as any, verbose: true }).map((m: any) => m.to));

  const [targets, setTargets] = useState<Set<string>>(new Set());

  const startSelect = (coord: string) => {
    if (canControlSquare(coord)) {
      setSelected(coord);
      setTargets(targetsFrom(coord));
    } else {
      setSelected(null);
      setTargets(new Set());
    }
  };

  const tryMove = (from: string, to: string) => {
    const m = chess.moves({ verbose: true }).find((mv: any) => mv.from === from && mv.to === to);
    if (!m) return false;

    if (m.promotion) {
      const pieceColor = chess.get(from as any)?.color === "w" ? "white" : "black";
      setPromo({ from, to, color: pieceColor as "white" | "black" });
      return true;
    }

    onMove(from + to);
    setSelected(null);
    setTargets(new Set());
    return true;
  };

  // Click-to-move
  const handleClick = (rank: number, file: number) => {
    const coord = idxToCoord(rank, file);
    if (!selected) { startSelect(coord); return; }
    if (coord === selected) { setSelected(null); setTargets(new Set()); return; }
    if (targets.has(coord)) { tryMove(selected, coord); }
    else { startSelect(coord); }
  };

  // Drag & drop
  const handleDragStart = (coord: string, e: React.DragEvent) => {
    if (!canControlSquare(coord)) { e.preventDefault(); return; }
    setDragFrom(coord);
    setSelected(coord);
    setTargets(targetsFrom(coord));
    e.dataTransfer.setData("text/plain", coord);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragEnd = () => setDragFrom(null);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (rank: number, file: number, e: React.DragEvent) => {
    e.preventDefault();
    const to = idxToCoord(rank, file);
    const from = (e.dataTransfer.getData("text/plain") || dragFrom) as string | null;
    if (!from || from === to) return;
    if (targets.has(to)) { tryMove(from, to); }
    setDragFrom(null);
  };

  const onPromote = (piece: "q" | "r" | "b" | "n") => {
    if (!promo) return;
    onMove(promo.from + promo.to + piece);
    setPromo(null);
    setSelected(null);
    setTargets(new Set());
  };
  const onCancelPromo = () => setPromo(null);

  
  const squares = [];
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const rr = orientation === "white" ? r : 7 - r;
      const ff = orientation === "white" ? f : 7 - f;

      const cell = board[rr][ff];
      const isDark = (rr + ff) % 2 === 1;
      const coord = idxToCoord(rr, ff);

      const pieceInfo = chess.get(coord as any);
      const mine = toColorChar(myColor);
      const draggable = !!pieceInfo && mine === pieceInfo.color && pieceInfo.color === chess.turn();

      const isLast = lastMove ? lastMove.from === coord || lastMove.to === coord : false;

      squares.push(
        <Square
          key={`${r}-${f}`}
          coord={coord}
          color={isDark ? "dark" : "light"}
          piece={cell?.piece}
          highlighted={selected === coord}
          target={targets.has(coord)}
          last={isLast}
          draggable={draggable}
          onClick={() => handleClick(rr, ff)}
          onDragStart={(e) => handleDragStart(coord, e)}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(rr, ff, e)}
        />
      );
    }
  }

  return (
    <>
      <div className="board">{squares}</div>
      {promo && (
        <PromotionPicker color={promo.color} onSelect={onPromote} onCancel={onCancelPromo} />
      )}
    </>
  );
}
