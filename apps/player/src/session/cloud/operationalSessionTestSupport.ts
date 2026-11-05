import { createInitialGameState, type GameState } from "@gamify-surgery/game-domain";
import { MemoryCloudCache } from "./cache";
import { CloudSyncCoordinator } from "./coordinator";
import { FakeCloudServer } from "./fakeTransport";
import { CloudGameSession } from "./gameSession";
import { snapshotCopy } from "./snapshotCodec";
import { TestCloudClock } from "./syncTestSupport";
import { OperationalEngineProcessor } from "./operationalEngineProcessor";
import { dispatchOperationalEngineRequest } from "./operationalEngineDispatch";
import type { OperationalEnginePort } from "./operationalEngineClient";
import type { OperationalEngineReply, OperationalEngineRequest } from "./operationalEngineProtocol";
import type { OperationalSessionOptions } from "./operationalSessionEngine";

export class ControllableOperationalPort implements OperationalEnginePort {
  onmessage: OperationalEnginePort["onmessage"] = null;
  onerror: OperationalEnginePort["onerror"] = null;
  onmessageerror: OperationalEnginePort["onmessageerror"] = null;
  readonly messages: OperationalEngineRequest[] = [];
  readonly waiting: OperationalEngineRequest[] = [];
  auto = true;
  stopped = false;
  private readonly processor = new OperationalEngineProcessor();
  postMessage(request: OperationalEngineRequest): void {
    const captured = structuredClone(request); this.messages.push(captured);
    if (this.auto) queueMicrotask(() => this.deliver(captured)); else this.waiting.push(captured);
  }
  private deliver(request: OperationalEngineRequest, crash = false): void {
    if (request.kind === "journalHashes") {
      dispatchOperationalEngineRequest(this.processor, request, reply => { if (!this.stopped) this.onmessage?.({ data: structuredClone(reply) } as MessageEvent<OperationalEngineReply>); }); return;
    }
    const reply = this.processor.handle(request);
    if (crash) this.onerror?.({ preventDefault() {} } as ErrorEvent);
    else if (!this.stopped) this.onmessage?.({ data: structuredClone(reply) } as MessageEvent<OperationalEngineReply>);
  }
  next(crashAfterApply = false): void {
    const request = this.waiting.shift(); if (!request) throw Error("No pending engine request");
    this.deliver(request, crashAfterApply);
  }
  terminate(): void { this.stopped = true; }
}

export async function operationalSessionFixture(options: OperationalSessionOptions = {}, input?: GameState, operational = true) {
  const state = input ?? createInitialGameState(undefined, { campaignId: "operational.session.public", campaignSeed: "operational.session", createdAtRealMs: 0 });
  const campaign = { campaignId: state.campaignId, name: "Public synthetic clinic", status: "resumable" as const,
    createdAtRealMs: state.createdAtRealMs, updatedAtRealMs: state.createdAtRealMs,
    tutorial: { guidance: { version: 2 as const, mode: "off" as const, exposedTopicIds: [] }, introDismissed: true,
      dailyRoutineTipAcknowledgments: [], dailyRoutinePause: null } };
  const clock = new TestCloudClock(), cache = new MemoryCloudCache(), server = new FakeCloudServer(clock.wallNow);
  const scope = { backendId: "operational.public", accountId: crypto.randomUUID(), campaignId: state.campaignId };
  server.setAccess(scope.accountId, { snapshotSaves: true });
  const confirmed = await snapshotCopy(state, campaign, "1", clock.wall, { branchId: "operational.public.base", sequence: 0, parents: [] });
  server.seed(scope.accountId, confirmed);
  const coordinator = new CloudSyncCoordinator({ scope, cache, transport: server.transport(scope.accountId), clock, enabled: true });
  if (!await coordinator.open() || !await coordinator.startWriter() || !coordinator.resume()) throw Error("Synthetic account must be playable");
  const ports: ControllableOperationalPort[] = [];
  const session = await CloudGameSession.create(coordinator, undefined, undefined, { operational: operational ? { createPort: () => {
    const port = new ControllableOperationalPort(); ports.push(port); return port;
  }, ...options } : false });
  return { session, coordinator, cache, scope, clock, server, ports };
}
