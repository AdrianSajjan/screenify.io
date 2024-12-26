import "@screenify.io/ui/globals.css";
import "@screenify.io/recorder/styles.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Recorder } from "@screenify.io/recorder/recorder";

const root = document.getElementById("screenify-app");
if (root) document.removeChild(root);

const app = document.createElement("div");
app.id = "screenify-app";
document.body.appendChild(app);

createRoot(app).render(
  <StrictMode>
    <Recorder />
  </StrictMode>,
);
