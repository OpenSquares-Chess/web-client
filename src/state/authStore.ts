import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthUser = { id: string; username: string; email: string };

type AuthState = {
  isAuthed: boolean;
  token: string | null;
  user: AuthUser | null;
  signIn: (user: AuthUser, token: string) => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthed: false,
      token: null,
      user: null,
      signIn: (user, token) => set({ isAuthed: true, user, token }),
      signOut: () => set({ isAuthed: false, user: null, token: null }),
    }),
    { name: "auth" }
  )
);
