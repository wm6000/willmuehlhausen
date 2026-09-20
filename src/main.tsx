import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Cascade order is explicit here rather than dependent on module resolution:
// tokens, then reset, then base, then the primitive layer, then everything built on it.
// Leaflet's own stylesheet, ahead of ours so whale-map rules can override it. It is
// the one stylesheet not written here; rule 2 governs where our CSS lives, and this
// file is still the single place cascade order is decided.
import "leaflet/dist/leaflet.css";

// The tokens are shared with recadvisor.app and live in their own package, so a palette
// change lands in both sites rather than in whichever one someone remembered. They stay
// first: everything below resolves against them.
import "@wm/design-tokens/core.css";
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
