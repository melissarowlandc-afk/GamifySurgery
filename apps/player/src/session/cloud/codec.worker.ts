import { handleCloudCodecMessage, type CloudCodecMessage, type CloudCodecReply } from "./codecTasks";

// DOM types keep the player project independent of the conflicting WebWorker lib declarations.
const worker = globalThis as unknown as {
  onmessage: ((event: MessageEvent<CloudCodecMessage>) => void) | null;
  postMessage(reply: CloudCodecReply): void;
};
worker.onmessage = event => { void handleCloudCodecMessage(event.data).then(reply => worker.postMessage(reply)); };
