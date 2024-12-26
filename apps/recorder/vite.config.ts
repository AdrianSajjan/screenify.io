import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "build",
    rollupOptions: {
      output: {
        entryFileNames: "content.js",
        assetFileNames: "styles.css",
      },
    },
    cssCodeSplit: false,
  },
  resolve: {
    alias: {
      "@screenify.io/recorder": path.resolve(__dirname, "./src"),
      "@ui": path.resolve(__dirname, "../../packages/ui/src"),
    },
  },
});
