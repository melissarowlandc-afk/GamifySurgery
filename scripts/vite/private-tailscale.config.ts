import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { mergeConfig } from "vite";
import baseConfig from "../../apps/player/vite.config";

const configDirectory = fileURLToPath(new URL(".", import.meta.url));
const playerDirectory = resolve(configDirectory, "../../apps/player");
const tailscaleHost = "melissadesktop.taile197db.ts.net";

/** Development-only endpoint; the canonical launcher stays on loopback 4173. */
export default mergeConfig(baseConfig, {
  server: {
    host: "127.0.0.1",
    port: 4174,
    strictPort: true,
    allowedHosts: [tailscaleHost],
    hmr: { protocol: "wss", host: tailscaleHost, clientPort: 443 },
    fs: {
      strict: true,
      allow: [
        playerDirectory,
        resolve(playerDirectory, "../../packages/game-domain"),
        resolve(playerDirectory, "../../packages/balance-config"),
        resolve(playerDirectory, "../../packages/clinical-content"),
        resolve(playerDirectory, "../../node_modules"),
      ],
      deny: [
        "**/.env",
        "**/.env.*",
        "**/*.{key,crt,pem,p12,pfx,cer,der}",
        "**/.git/**",
        "**/.npmrc",
        "**/.yarnrc.yml",
        "**/clinical-data/**",
        "**/.clinical-workbench/**",
        "**/.private-clinical-data/**",
        "**/private/**",
      ],
    },
  },
}, false);
