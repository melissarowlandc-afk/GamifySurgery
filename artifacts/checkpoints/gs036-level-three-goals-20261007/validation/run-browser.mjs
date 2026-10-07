import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(process.argv[2] ?? path.resolve(import.meta.dirname, "../../../.."));
if (!existsSync(path.join(root, "tests/e2e/level-three-goals.spec.ts"))) {
  throw new Error("A compatible checkout containing the restored GS-036 browser test is required.");
}
const { createServer } = await import(pathToFileURL(path.join(root, "node_modules/vite/dist/node/index.js")).href);
const server = await createServer({
  root: path.join(root, "apps/player"),
  cacheDir: path.join(root, ".local-dev/gs036-level-three-goals/vite-cache"),
  server: { host: "127.0.0.1", port: 0, strictPort: true, watch: null },
});
try {
  await server.listen();
  const address = server.httpServer.address();
  const origin = `http://127.0.0.1:${address.port}`;
  console.log(`Isolated GS-036 test origin: ${origin}; fresh Playwright contexts.`);
  const child = spawn(process.execPath, [
    path.join(root, "node_modules/@playwright/test/cli.js"), "test",
    "tests/e2e/level-three-goals.spec.ts", "--project=desktop-chrome",
    "--project=compact-desktop-chrome", "--workers=1",
    "--output=.local-dev/gs036-level-three-goals/browser-results",
  ], {
    cwd: root,
    env: { ...process.env, GAMIFY_E2E_EXTERNAL_SERVER: "1", GAMIFY_E2E_BASE_URL: origin },
    stdio: "inherit",
  });
  process.exitCode = await new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", (code) => resolve(code ?? 1));
  });
} finally {
  await server.close();
}
