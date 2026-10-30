import { createServer as createHttpServer } from "node:http";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Worker } from "node:worker_threads";
import { createServer } from "vite";
import react from "@vitejs/plugin-react";
import { init, parse } from "es-module-lexer";
import type { CloudCodecWorkerPort } from "./codecWorker";

/** Exercise the actual development transforms in a separate worker realm.
 * No HTTP/WebSocket server listens and the bootstrap forbids network traffic.
 * Bundling would tree-shake the JSX/HMR import that caused the entry regression. */
export async function nativeDevCodecFactory(legacyVersionImport = false): Promise<{ create(): CloudCodecWorkerPort; errors: string[]; close(): Promise<void> }> {
  const player = fileURLToPath(new URL("../../../", import.meta.url)), repo = resolve(player, "../..");
  const scratch = join(repo, ".local-dev"); await mkdir(scratch, { recursive: true });
  const directory = await mkdtemp(join(scratch, "codec-native-")), graph = join(directory, "graph"); await mkdir(graph);
  const hmr = createHttpServer(); // Attach Vite's HMR transforms, without opening a port.
  const server = await createServer({ configFile: false, root: player, cacheDir: join(directory, "vite-cache"), logLevel: "silent",
    plugins: [{ name: "worker-regression-control", enforce: "pre", transform(code, id) {
      if (legacyVersionImport && id.replaceAll("\\", "/").endsWith("/diagnostics/problemDiagnostics.ts"))
        return code.replace('from "../buildVersion"', 'from "../appVersion"');
    } }, react()], define: { __PLAYER_BUILD_DATE__: JSON.stringify("2026-10-30") },
    server: { middlewareMode: true, hmr: { server: hmr } },
    optimizeDeps: { noDiscovery: true, include: ["react", "react/jsx-dev-runtime", "ts-fsrs"] } });
  const name = (url: string) => createHash("sha256").update(url).digest("hex") + ".mjs";
  const first = "/src/session/cloud/codec.worker.ts?worker_file&type=module", queue = [first], seen = new Set<string>();
  const workers: Worker[] = [], errors: string[] = [];
  try {
    await init;
    while (queue.length) {
      const urls = [...new Set(queue.splice(0))].filter(url => !seen.has(url));
      for (const url of urls) seen.add(url);
      await Promise.all(urls.map(async url => {
        let transformed;
        try { transformed = await server.transformRequest(url); }
        catch (error) {
          if ((error as { code?: string }).code !== "ERR_OUTDATED_OPTIMIZED_DEP") throw error;
          // A fresh optimizer can publish its hash during import discovery.
          // Ask for its current output; never wait on a fixed sleep.
          const optimizer = server.environments.client!.depsOptimizer!;
          await Promise.all(Object.values({ ...optimizer.metadata.discovered, ...optimizer.metadata.optimized }).map(row => row.processing));
          transformed = await server.transformRequest(url.split("?")[0]!);
        }
        if (!transformed) throw new Error("Native worker transform missing");
        let code = transformed.code;
        const changes: { start: number; end: number; text: string }[] = [];
        for (const item of parse(code)[0]) {
          if (!item.n) continue;
          const next = item.n.startsWith(".") ? new URL(item.n, "http://local" + url).pathname : item.n;
          if (!next.startsWith("/")) throw new Error("Native worker has an unresolved import");
          queue.push(next); changes.push({ start: item.s, end: item.e, text: "./" + name(next) });
        }
        for (const change of changes.reverse()) code = code.slice(0, change.start) + change.text + code.slice(change.end);
        await writeFile(join(graph, name(url)), code);
      }));
      if (seen.size > 800) throw new Error("Native worker graph exceeded its bound");
    }
  } finally { await server.close(); }
  const module = pathToFileURL(join(graph, name(first))).href;
  const indexedDBModule = pathToFileURL(createRequire(import.meta.url).resolve("fake-indexeddb")).href;
  const bootstrap = `import {parentPort,workerData} from "node:worker_threads";
globalThis.self=globalThis;
globalThis.WorkerGlobalScope=class {static [Symbol.hasInstance](value){return value===globalThis;}};
globalThis.location={href:"http://127.0.0.1:5184/codec.worker.ts",reload(){throw Error("Unexpected worker reload");}};
globalThis.WebSocket=class extends EventTarget {readyState=1;constructor(url){super();this.url=url;queueMicrotask(()=>this.dispatchEvent(new Event("open")));}send(){}close(){}};
globalThis.fetch=()=>{throw Error("Worker test may not use the network");};
const idb=await import(workerData.indexedDBModule);globalThis.indexedDB=new idb.IDBFactory();globalThis.IDBKeyRange=idb.IDBKeyRange;
globalThis.postMessage=reply=>parentPort.postMessage(reply);
parentPort.on("message",data=>globalThis.onmessage?.({data}));
await import(workerData.module);`;
  return {
    errors,
    create() {
      const native = new Worker(new URL("data:text/javascript," + encodeURIComponent(bootstrap)), { workerData: { module, indexedDBModule } });
      workers.push(native);
      const port: CloudCodecWorkerPort = { onmessage: null, onerror: null, onmessageerror: null,
        postMessage: message => native.postMessage(message), terminate: () => { void native.terminate(); } };
      native.on("message", data => port.onmessage?.({ data } as MessageEvent));
      native.on("error", error => {
        const message = error instanceof Error ? error.message : "Worker failed";
        errors.push(message); port.onerror?.({ error, message, preventDefault() {} } as ErrorEvent);
      });
      native.on("messageerror", error => port.onmessageerror?.({ data: error } as MessageEvent));
      return port;
    },
    async close() {
      await Promise.all(workers.map(worker => worker.terminate()));
      // Recursive removal is confined to the mkdtemp directory owned above.
      if (dirname(directory) !== scratch || relative(scratch, directory).startsWith("..")) throw new Error("Unexpected worker scratch directory");
      await rm(directory, { recursive: true, force: true });
    },
  };
}
