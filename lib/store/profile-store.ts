import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProfileState {
  avatarPreview: string | null;
  setAvatarPreview: (preview: string | null) => void;
  clearAvatar: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      avatarPreview: null,
      setAvatarPreview: (preview) => set({ avatarPreview: preview }),
      clearAvatar: () => set({ avatarPreview: null }),
    }),
    {
      name: "ostad-music-profile",
    }
  )
);