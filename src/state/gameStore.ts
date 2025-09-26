import { create } from "zustand";

type GameState = {
  room: number | null;
  uuid: string | null;
  myColor: "white" | "black" | null;
  fen: string;
  connected: boolean;
  setRoom: (room: number) => void;
  setUuid: (uuid: string) => void;
  setColor: (c: "white" | "black") => void;
  setFen: (fen: string) => void;
  setConnected: (x: boolean) => void;
  reset: () => void;
};

export const useGameStore = create<GameState>((set) => ({
  room: null,
  uuid: null,
  myColor: null,
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  connected: false,
  setRoom: (room) => set({ room }),
  setUuid: (uuid) => set({ uuid }),
  setColor: (c) => set({ myColor: c }),
  setFen: (fen) => set({ fen }),
  setConnected: (x) => set({ connected: x }),
  reset: () =>
    set({
      room: null,
      uuid: null,
      myColor: null,
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      connected: false,
    }),
}));
