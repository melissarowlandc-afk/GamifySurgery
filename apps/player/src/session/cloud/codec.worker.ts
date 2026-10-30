import { dispatchCloudCodecMessage, type CloudCodecMessage, type CloudCodecReply } from "./codecTasks";

// DOM types keep the player project independent of the conflicting WebWorker lib declarations.
const worker = globalThis as unknown as {
  onmessage: ((event: MessageEvent<CloudCodecMessage>) => void) | null;
  postMessage(reply: CloudCodecReply): void;
};
worker.onmessage = event => { void dispatchCloudCodecMessage(event.data, reply => worker.postMessage(reply)); };
// Module evaluation (and the unbundled development import graph) precedes any
// task. Tell the caller when processing can actually start.
worker.postMessage({ ready: true });
