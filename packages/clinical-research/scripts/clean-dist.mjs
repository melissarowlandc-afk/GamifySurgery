import { rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(packageRoot, "dist");

if (dirname(dist) !== packageRoot || !dist.endsWith(`${process.platform === "win32" ? "\\" : "/"}dist`)) {
  throw new Error("Refusing to clean an unexpected build-output path.");
}

await rm(dist, { recursive: true, force: true });
