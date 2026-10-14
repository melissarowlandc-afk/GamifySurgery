import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { forbidPrivateModules } from "../../scripts/vite/forbid-private-modules";

export default defineConfig({
  plugins: [react(), forbidPrivateModules()],
  test: {
    // Minute-by-minute clinic simulations compete for CPU in the full suite.
    // Bound concurrent files without weakening their assertions or timeouts.
    maxWorkers: 4,
  },
  server: {
    host: "127.0.0.1",
    port: 4173,
  },
});
