import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import { configDefaults } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude],
    environment: "happy-dom",
  },
  plugins: [react(), dts({ include: ["lib"], exclude: ["**/__tests__/**"] })],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "**/__tests__/**"],
      output: {
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].js",
      },
    },
  },
});
