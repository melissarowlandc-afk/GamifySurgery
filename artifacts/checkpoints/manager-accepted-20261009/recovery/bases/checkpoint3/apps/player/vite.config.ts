import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { forbidPrivateModules } from "../../scripts/vite/forbid-private-modules";

export default defineConfig({
  plugins: [react(), forbidPrivateModules()],
  server: {
    host: "127.0.0.1",
    port: 4173,
  },
});
