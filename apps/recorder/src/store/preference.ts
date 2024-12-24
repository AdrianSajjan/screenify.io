import { Autocomplete } from "@screenify.io/recorder/types/core";
import { create } from "zustand";

interface PreferenceState {
  camera: Autocomplete<"n/a">;
  microphone: Autocomplete<"n/a">;
  setCamera: (camera: string) => void;
  setMicrophone: (microphone: string) => void;
}

const usePreferenceStore = create<PreferenceState>()((set) => ({
  camera: "n/a",
  microphone: "n/a",
  setCamera: (camera: string) => set({ camera }),
  setMicrophone: (microphone: string) => set({ microphone }),
}));

export { usePreferenceStore };
