import { createCloudCodecDispatcher, type CloudCodecMessage } from "./codecTasks";
import type { CloudCodecWorkerPort } from "./codecWorker";

/** Real queued, structured-cloned messages in both directions, with the same
 * async IDB factory. Used by coordinator/game-session DOM integration tests. */
export class MessageChannelCloudCodecWorker implements CloudCodecWorkerPort {
  private listener: CloudCodecWorkerPort["onmessage"] = null;
  private ready = false;
  get onmessage() { return this.listener; }
  set onmessage(listener: CloudCodecWorkerPort["onmessage"]) {
    this.listener = listener;
    if (listener && this.ready) queueMicrotask(() => {
      if (this.listener === listener) listener({ data: { ready: true } } as MessageEvent);
    });
  }
  onerror: CloudCodecWorkerPort["onerror"] = null;
  onmessageerror: CloudCodecWorkerPort["onmessageerror"] = null;
  private readonly channel = new MessageChannel();
  constructor() {
    const dispatch = createCloudCodecDispatcher(reply => this.channel.port1.postMessage(reply));
    this.channel.port1.onmessage = event => { void dispatch(event.data as CloudCodecMessage); };
    this.channel.port2.onmessage = event => {
      if ("ready" in event.data) this.ready = true;
      this.onmessage?.(event);
    };
    this.channel.port2.onmessageerror = event => this.onmessageerror?.(event);
    this.channel.port1.postMessage({ ready: true });
  }
  postMessage(message: CloudCodecMessage) { this.channel.port2.postMessage(message); }
  terminate() { this.channel.port1.close(); this.channel.port2.close(); }
}
