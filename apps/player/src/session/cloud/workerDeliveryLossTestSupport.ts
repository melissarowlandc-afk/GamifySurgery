/** Public deterministic transport faults; no browser, storage or account data. */
export class LossyWorkerPort<Message extends { id: number }, Reply extends object> {
  onmessage: ((event: MessageEvent<Reply>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  onmessageerror: ((event: MessageEvent) => void) | null = null;
  readonly messages: Message[] = [];
  readonly dropReceipts = new Map<number, number>();
  readonly dropStarts = new Map<number, number>();
  dropPosts = 0;
  duplicates = 0;
  earlyPosts = 0;
  terminated = false;
  private ready = false;
  private readonly receive: (message: Message) => unknown;
  constructor(makeReceiver: (post: (reply: Reply) => void) => (message: Message) => unknown) {
    this.receive = makeReceiver(reply => this.reply(reply));
  }
  announceReady(): void { this.ready = true; this.reply({ ready: true } as unknown as Reply); }
  postMessage(message: Message): void {
    const captured = structuredClone(message); this.messages.push(captured);
    if (!this.ready) { this.earlyPosts++; return; } // WebKit-style early loss.
    if (this.dropPosts > 0) { this.dropPosts--; return; }
    this.receive(captured);
    for (let n = 0; n < this.duplicates; n++) this.receive(structuredClone(captured));
  }
  reply(reply: Reply): void {
    if ("received" in reply && "id" in reply) {
      const left = this.dropReceipts.get(reply.id as number) ?? 0;
      if (left) { this.dropReceipts.set(reply.id as number, left - 1); return; }
    }
    if ("started" in reply && "id" in reply) {
      const left = this.dropStarts.get(reply.id as number) ?? 0;
      if (left) { this.dropStarts.set(reply.id as number, left - 1); return; }
    }
    if (!this.terminated) this.onmessage?.({ data: structuredClone(reply) } as MessageEvent<Reply>);
  }
  terminate(): void { this.terminated = true; }
}
export const flushWorkerMessages = async () => { for (let n = 0; n < 24; n++) await Promise.resolve(); };
