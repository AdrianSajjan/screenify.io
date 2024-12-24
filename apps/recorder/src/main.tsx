import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Recorder from "@screenify.io/recorder/recorder";
import "@screenify.io/ui/globals.css";

createRoot(document.getElementById("screenify-app")!).render(
  <StrictMode>
    <Recorder />
  </StrictMode>,
);
