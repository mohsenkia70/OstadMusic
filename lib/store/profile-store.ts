import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProfileState {
  /** کلید: userId → base64 آواتار */
  avatars: Record<string, string>;
  setAvatar: (userId: string, preview: string) => void;
  clearAvatar: (userId: string) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      avatars: {},

      setAvatar: (userId, preview) =>
        set((state) => ({
          avatars: { ...state.avatars, [userId]: preview },
        })),

      clearAvatar: (userId) =>
        set((state) => {
          const next = { ...state.avatars };
          delete next[userId];
          return { avatars: next };
        }),
    }),
    {
      name: "ostad-music-profile",
    }
  )
);