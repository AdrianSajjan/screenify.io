import { scan } from "react-scan";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Recorder from "@screenify.io/recorder/recorder";
import "@screenify.io/ui/globals.css";

if (typeof window !== "undefined") {
  scan({ enabled: import.meta.env.VITE_REACT_SCAN === "enabled" });
}

createRoot(document.getElementById("screenify-app")!).render(
  <StrictMode>
    <Recorder />
  </StrictMode>,
);
