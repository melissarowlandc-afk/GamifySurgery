import { Worker } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import type { OperationalEnginePort } from "./operationalEngineClient";
import type { OperationalEngineReply } from "./operationalEngineProtocol";

export function nativeOperationalEngineTestPort(): OperationalEnginePort {
  // Vite rewrites import.meta.url; resolving from this checked-in test-support
  // module still names the adjacent native worker source in Node.
  const worker = new Worker(fileURLToPath(new URL("./operationalEngine.nativeWorker.testSupport.mjs", import.meta.url)), { execArgv: [] });
  let stopped = false;
  const port: OperationalEnginePort = { onmessage: null, onerror: null, onmessageerror: null,
    postMessage: request => worker.postMessage(request), terminate: () => { stopped = true; void worker.terminate(); } };
  worker.on("message", (data: OperationalEngineReply) => port.onmessage?.({ data } as MessageEvent<OperationalEngineReply>));
  worker.on("error", () => { if (!stopped) port.onerror?.({ preventDefault() {} } as ErrorEvent); });
  worker.on("messageerror", () => { if (!stopped) port.onmessageerror?.({} as MessageEvent); });
  worker.on("exit", code => { if (!stopped && code !== 0) port.onerror?.({ preventDefault() {} } as ErrorEvent); });
  return port;
}
