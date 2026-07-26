import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const playerRoot = path.join(repositoryRoot, "apps", "player");
const serverUrl = "http://127.0.0.1:4173";
const playerRequire = createRequire(path.join(playerRoot, "package.json"));
const viteModuleUrl = pathToFileURL(playerRequire.resolve("vite")).href;
const { createServer } = await import(viteModuleUrl);

async function isServerAvailable() {
  try {
    const response = await fetch(serverUrl, {
      method: "HEAD",
      signal: AbortSignal.timeout(1_000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

function runPlaywright() {
  const playwrightCli = path.join(
    repositoryRoot,
    "node_modules",
    "@playwright",
    "test",
    "cli.js",
  );
  const child = spawn(
    process.execPath,
    [playwrightCli, "test", ...process.argv.slice(2)],
    {
      cwd: repositoryRoot,
      env: {
        ...process.env,
        GAMIFY_E2E_EXTERNAL_SERVER: "1",
      },
      stdio: "inherit",
    },
  );

  return new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (signal) {
        reject(new Error(`Playwright exited after receiving ${signal}.`));
        return;
      }
      resolve(code ?? 1);
    });
  });
}

let server;

try {
  if (!(await isServerAvailable())) {
    server = await createServer({
      root: playerRoot,
      server: {
        host: "127.0.0.1",
        port: 4173,
        strictPort: true,
      },
    });
    await server.listen();
  }

  process.exitCode = await runPlaywright();
} finally {
  await server?.close();
}
