export type BoardCell = { piece?: string; color?: "w" | "b" };
export type BoardArray = (BoardCell | null)[][]; // [rank][file]

const PIECE_TO_UNICODE: Record<string, string> = {
  K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
  k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟",
};

export function fenToBoardArray(fen: string): { board: BoardArray; sideToMove: "w" | "b" } {
  const [placement, side] = fen.split(" ");
  const ranks = placement.split("/");
  const board: BoardArray = new Array(8).fill(null).map(() => new Array(8).fill(null));

  for (let r = 0; r < 8; r++) {
    let file = 0;
    for (const ch of ranks[r]) {
      if (/\d/.test(ch)) file += parseInt(ch, 10);
      else {
        const isWhite = ch === ch.toUpperCase();
        board[r][file] = { piece: PIECE_TO_UNICODE[ch], color: isWhite ? "w" : "b" };
        file++;
      }
    }
  }
  return { board, sideToMove: side as "w" | "b" };
}

export function idxToCoord(rank: number, file: number): string {
  return String.fromCharCode("a".charCodeAt(0) + file) + (8 - rank);
}
