import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { forbidPrivateModules } from "../../scripts/vite/forbid-private-modules";

export default defineConfig({
  define: { __PLAYER_BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)) },
  plugins: [react(), forbidPrivateModules()],
  test: {
    // Minute-by-minute clinic simulations compete for CPU in the full suite.
    // Bound concurrent files without weakening their assertions or timeouts.
    maxWorkers: 4,
    // Hosted CI runners have about two slow cores; keep the local 5 s default
    // but allow long simulations to finish there instead of timing out.
    testTimeout: process.env.CI ? 60_000 : 5_000,
  },
  server: {
    host: "127.0.0.1",
    port: 4173,
  },
});
