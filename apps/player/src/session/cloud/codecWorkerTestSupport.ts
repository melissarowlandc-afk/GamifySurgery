import { createCloudCodecDispatcher, type CloudCodecMessage, type CloudCodecReply } from "./codecTasks";
import type { CloudCodecWorkerPort } from "./codecWorker";
import { createWorkerReceiptReceiver } from "./workerDelivery";

/** Tests hold real codec work behind a controllable fake message boundary. */
export class FakeCloudCodecWorker implements CloudCodecWorkerPort {
  private listener: CloudCodecWorkerPort["onmessage"] = null;
  get onmessage() { return this.listener; }
  set onmessage(listener: CloudCodecWorkerPort["onmessage"]) {
    this.listener = listener;
    if (listener && this.ready) queueMicrotask(() => {
      if (!this.terminated && this.listener === listener) listener({ data: { ready: true } } as MessageEvent<CloudCodecReply>);
    });
  }
  onerror: CloudCodecWorkerPort["onerror"] = null;
  onmessageerror: CloudCodecWorkerPort["onmessageerror"] = null;
  readonly messages: CloudCodecMessage[] = [];
  private readonly waiting: CloudCodecMessage[] = [];
  private held = true;
  private ready = false;
  private readonly dispatch = createCloudCodecDispatcher(reply => this.reply(reply));
  private readonly receive = createWorkerReceiptReceiver(reply => this.reply(reply), (message: CloudCodecMessage) => {
    if (this.held) this.waiting.push(message); else void this.deliver(message);
  });
  terminated = false;
  postMessage(message: CloudCodecMessage): void {
    const frozen = structuredClone(message);
    this.messages.push(frozen);
    this.receive(frozen);
  }
  reply(reply: CloudCodecReply): void {
    if ("ready" in reply) this.ready = true;
    this.onmessage?.({ data: structuredClone(reply) } as MessageEvent<CloudCodecReply>);
  }
  private async deliver(message: CloudCodecMessage): Promise<void> { await this.dispatch(message); }
  release(): void {
    this.held = false;
    if (!this.ready) queueMicrotask(() => this.reply({ ready: true }));
    for (const message of this.waiting.splice(0)) void this.deliver(message);
  }
  terminate(): void { this.terminated = true; }
}
