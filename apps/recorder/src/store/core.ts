import { create } from "zustand";

interface CoreState {
  recording: boolean;
  setRecording: (recording: boolean) => void;
}

const useCoreStore = create<CoreState>()((set) => ({
  recording: false,
  setRecording: (recording: boolean) => set({ recording }),
}));

export { useCoreStore };
