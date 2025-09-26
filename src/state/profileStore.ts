import { create } from "zustand";
import type { UserProfile } from "../types/api";

type ProfileState = {
  me: UserProfile | null;
  setMe: (p: UserProfile | null) => void;
};

export const useProfileStore = create<ProfileState>((set) => ({
  me: null,
  setMe: (p) => set({ me: p }),
}));
