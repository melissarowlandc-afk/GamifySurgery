import { createRequire } from "node:module";
import { dirname, join } from "node:path";

/** Installed native classes without browser device probing. No renderer shim. */
export function nativePhaserMemoryClass(path: string) {
  const require = createRequire(import.meta.url), root = dirname(require.resolve("phaser/package.json"));
  const device = join(root, "src/device/index.js"), previous = require.cache[device];
  require.cache[device] = { id: device, filename: device, loaded: true,
    exports: { features: {}, os: {}, browser: {}, canvasFeatures: {}, input: {} } } as NodeJS.Module;
  try { return require(join(root, "src", path)); }
  finally { if (previous) require.cache[device] = previous; else delete require.cache[device]; }
}
