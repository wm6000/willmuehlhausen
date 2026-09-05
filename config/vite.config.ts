import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const root = fileURLToPath(new URL("..", import.meta.url));

export default defineConfig({
  root,
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) },
  },
  build: { outDir: "dist", emptyOutDir: true },
});
