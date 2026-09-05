import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Cascade order is explicit here rather than dependent on module resolution:
// tokens, then reset, then base, then the primitive layer, then everything built on it.
// Leaflet ships its own stylesheet; it goes first so our own rules can override it.
import "leaflet/dist/leaflet.css";

import "@/styles/tokens.css";
import "@/styles/reset.css";
import "@/styles/base.css";
import "@/styles/ui.css";
import "@/styles/layout.css";
import "@/styles/components.css";

import { App } from "@/App";

const container = document.getElementById("root");
if (container === null) {
  throw new Error("Missing #root. index.html and main.tsx have drifted apart.");
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);
