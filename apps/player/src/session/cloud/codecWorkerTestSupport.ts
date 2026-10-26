import { handleCloudCodecMessage, type CloudCodecMessage, type CloudCodecReply } from "./codecTasks";
import type { CloudCodecWorkerPort } from "./codecWorker";

/** Tests hold real codec work behind a controllable fake message boundary. */
export class FakeCloudCodecWorker implements CloudCodecWorkerPort {
  onmessage: CloudCodecWorkerPort["onmessage"] = null;
  onerror: CloudCodecWorkerPort["onerror"] = null;
  onmessageerror: CloudCodecWorkerPort["onmessageerror"] = null;
  readonly messages: CloudCodecMessage[] = [];
  private readonly waiting: CloudCodecMessage[] = [];
  private held = true;
  terminated = false;
  postMessage(message: CloudCodecMessage): void {
    const frozen = structuredClone(message);
    this.messages.push(frozen);
    if (this.held) this.waiting.push(frozen); else void this.deliver(frozen);
  }
  reply(reply: CloudCodecReply): void { this.onmessage?.({ data: reply } as MessageEvent<CloudCodecReply>); }
  private async deliver(message: CloudCodecMessage): Promise<void> { this.reply(await handleCloudCodecMessage(message)); }
  release(): void { this.held = false; for (const message of this.waiting.splice(0)) void this.deliver(message); }
  terminate(): void { this.terminated = true; }
}
