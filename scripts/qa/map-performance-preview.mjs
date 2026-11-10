import { spawn } from "node:child_process";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const app = resolve(root, "apps/player");
const output = resolve(root, ".local-dev/map-pan-zoom-20261108/round3/production-preview");
const inside = relative(resolve(root, ".local-dev/map-pan-zoom-20261108/round3"), output);
if (!inside || inside.startsWith("..") || isAbsolute(inside)) throw new Error("QA output must stay inside its task directory");
const vite = resolve(root, "node_modules/vite/bin/vite.js");
const env = { ...process.env, VITE_FACILITY_PERF_PROOF: "1", NODE_ENV: "production",
  // Disposable local fixtures, never the developer's configured account service.
  VITE_SUPABASE_URL: "", VITE_SUPABASE_ANON_KEY: "", VITE_ENABLE_LOCAL_PROTOTYPE_BYPASS: "true" };
const run = (args) => new Promise((accept, reject) => {
  const child = spawn(process.execPath, [vite, ...args], { cwd: app, env, stdio: "inherit", windowsHide: true });
  child.once("error", reject);
  child.once("exit", code => code === 0 ? accept() : reject(new Error(`Vite exited ${code}`)));
});
await run(["build", "--mode", "production", "--base", "/", "--outDir", output, "--emptyOutDir"]);
if (!process.argv.includes("--build-only")) {
  console.log("QA production preview: http://127.0.0.1:5186 (disposable test storage; separate from owner 4173).");
  await run(["preview", "--host", "127.0.0.1", "--port", "5186", "--strictPort", "--outDir", output]);
}
