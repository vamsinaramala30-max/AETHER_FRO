import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_SETTINGS, type AetherSettings } from "@/lib/aether/types";

interface SettingsState extends AetherSettings {
  update: <K extends keyof AetherSettings>(key: K, value: AetherSettings[K]) => void;
  reset: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      update: (key, value) => set({ [key]: value } as Partial<SettingsState>),
      reset: () => set({ ...DEFAULT_SETTINGS }),
    }),
    { name: "aether.settings", version: 1 },
  ),
);
