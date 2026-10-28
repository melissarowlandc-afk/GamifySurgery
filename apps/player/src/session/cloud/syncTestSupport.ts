import { CloudSyncCoordinator, type CloudClock } from "./coordinator";
import { syncFixture } from "./syncFixtureSupport";
export { syncFixture };
import { MemoryCloudCache, type CloudCache } from "./cache";
import { FakeCloudServer } from "./fakeTransport";
import type { CloudScope } from "./transport";

export class TestCloudClock implements CloudClock {
  wall = 1_800_000_000_000;
  mono = 0;
  wallNow = (): number => this.wall;
  monotonicNow = (): number => this.mono;
  advance(ms: number): void { this.wall += ms; this.mono += ms; }
}
export function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>(done => { resolve = done; });
  return { promise, resolve };
}
let harnessSequence = 0;
export async function syncHarness(options: { cache?: CloudCache; server?: FakeCloudServer; clock?: TestCloudClock;
  accountId?: string; backendId?: string; enabled?: boolean; campaignId?: string } = {}) {
  const fixture = await syncFixture(options.campaignId), clock = options.clock ?? new TestCloudClock();
  const server = options.server ?? new FakeCloudServer(() => clock.wall);
  const scope: CloudScope = { backendId: options.backendId ?? "backend-a", accountId: options.accountId ?? "account-a", campaignId: fixture.confirmed.campaignId };
  server.seed(scope.accountId, fixture.confirmed);
  const cache = options.cache ?? new MemoryCloudCache();
  let sequence = 0; const instance = ++harnessSequence;
  const coordinator = new CloudSyncCoordinator({ scope, cache, transport: server.transport(scope.accountId), enabled: options.enabled ?? true,
    clock, newOperationId: () => `sync.${instance}.${scope.accountId}.${++sequence}` });
  return { ...fixture, scope, clock, server, cache, coordinator };
}
