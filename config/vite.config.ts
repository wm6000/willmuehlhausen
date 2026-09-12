import { copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const root = fileURLToPath(new URL("..", import.meta.url));

/**
 * GitHub Pages serves static files and has no rewrite rule, so a cold load of a real
 * route — /recadvisor, or any project post — asks for a file that does not exist and
 * gets the 404. Pages serves 404.html for every unmatched path, so an identical copy
 * of the entry point hands those requests to the router instead, which then resolves
 * them client-side.
 *
 * This is why the copy is made at build time rather than committed: it has to stay
 * byte-identical to index.html, and a stale hand-maintained copy would load an old
 * bundle on exactly the deep links people share.
 */
function spaFallback(): Plugin {
  return {
    name: "spa-fallback",
    apply: "build",
    closeBundle() {
      const dist = fileURLToPath(new URL("../dist/", import.meta.url));
      copyFileSync(`${dist}index.html`, `${dist}404.html`);
    },
  };
}

export default defineConfig({
  root,
  plugins: [react(), spaFallback()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) },
  },
  build: { outDir: "dist", emptyOutDir: true },
});
