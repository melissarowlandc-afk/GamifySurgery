import { dispatchCloudCodecMessage, type CloudCodecMessage } from "./codecTasks";
import type { CloudCodecWorkerPort } from "./codecWorker";

/** Real queued, structured-cloned messages in both directions, with the same
 * async IDB factory. Used by coordinator/game-session DOM integration tests. */
export class MessageChannelCloudCodecWorker implements CloudCodecWorkerPort {
  onmessage: CloudCodecWorkerPort["onmessage"] = null;
  onerror: CloudCodecWorkerPort["onerror"] = null;
  onmessageerror: CloudCodecWorkerPort["onmessageerror"] = null;
  private readonly channel = new MessageChannel();
  constructor() {
    this.channel.port1.onmessage = event => { void dispatchCloudCodecMessage(event.data as CloudCodecMessage, reply => this.channel.port1.postMessage(reply)); };
    this.channel.port2.onmessage = event => this.onmessage?.(event);
    this.channel.port2.onmessageerror = event => this.onmessageerror?.(event);
    this.channel.port1.postMessage({ ready: true });
  }
  postMessage(message: CloudCodecMessage) { this.channel.port2.postMessage(message); }
  terminate() { this.channel.port1.close(); this.channel.port2.close(); }
}
