import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readFile } from "node:fs/promises";
import path from "node:path";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const playerRoot = path.join(repositoryRoot, "apps", "player");
const expectedHealthContract = JSON.parse(
  await readFile(
    path.join(playerRoot, "public", "gamify-surgery-launcher-health.json"),
    "utf8",
  ),
);
const preferredServerUrl = "http://127.0.0.1:4173";
const playerRequire = createRequire(path.join(playerRoot, "package.json"));
const viteModuleUrl = pathToFileURL(playerRequire.resolve("vite")).href;
const { createServer } = await import(viteModuleUrl);

async function isHealthyProjectServer(serverUrl) {
  try {
    const response = await fetch(
      `${serverUrl}/gamify-surgery-launcher-health.json`,
      {
        method: "GET",
        signal: AbortSignal.timeout(1_000),
      },
    );
    if (!response.ok) return false;
    const actual = await response.json();
    return Object.entries(expectedHealthContract).every(
      ([field, value]) => actual?.[field] === value,
    );
  } catch {
    return false;
  }
}

function runPlaywright(serverUrl) {
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
        GAMIFY_E2E_BASE_URL: serverUrl,
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
let serverUrl = preferredServerUrl;

try {
  if (!(await isHealthyProjectServer(preferredServerUrl))) {
    server = await createServer({
      root: playerRoot,
      server: {
        host: "127.0.0.1",
        // Port zero safely selects a free loopback port when 4173 is absent
        // or belongs to another application. Never stop or overwrite it.
        port: 0,
        strictPort: true,
      },
    });
    await server.listen();
    const address = server.httpServer?.address();
    if (!address || typeof address === "string") {
      throw new Error("The E2E Vite server did not report a loopback port.");
    }
    serverUrl = `http://127.0.0.1:${address.port}`;
    if (!(await isHealthyProjectServer(serverUrl))) {
      throw new Error("The E2E Vite server did not satisfy the launcher health contract.");
    }
  }

  process.exitCode = await runPlaywright(serverUrl);
} finally {
  await server?.close();
}
