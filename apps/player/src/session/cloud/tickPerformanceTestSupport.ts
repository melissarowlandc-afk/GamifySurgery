import { readFileSync } from "node:fs";
import { createInitialGameState, deserializeGameState, gameReducer, PROTOTYPE_DOMAIN_CONTEXT, type GameCommand, type GameState } from "@gamify-surgery/game-domain";
import { codecTestCampaign } from "./codecTestSupport";
import { completeSnapshotLearning } from "./snapshotLearning";
import { snapshotCopy } from "./snapshotCodec";
import { CloudSyncCoordinator } from "./coordinator";
import { CloudGameSession } from "./gameSession";
import { MemoryCloudCache } from "./cache";
import { FakeCloudServer } from "./fakeTransport";
import { TestCloudClock } from "./syncTestSupport";

/** Retained Level 3 ready-for-Level-4 campaign: real rooms, employees, frozen
 * encounters and FSRS history. No invented clinical content or padding. */
export function largeTickState() {
  const raw = readFileSync(new URL("../../../../../tests/fixtures/level-four-legacy-pre-m3.json", import.meta.url), "utf8");
  const loaded = completeSnapshotLearning(deserializeGameState(raw));
  return gameReducer(loaded, { type: "SET_PAUSED", paused: false, operationId: "tick-perf.play" }, PROTOTYPE_DOMAIN_CONTEXT);
}

export function tickCommand(index: number, createdAtRealMs: number): GameCommand {
  return { type: "ADVANCE_TICK", operationId: `tick-perf.${index}`, advancedAtRealMs: createdAtRealMs + index * 60_000 };
}

export async function tickSession(large: boolean | GameState = true) {
  const state = typeof large === "object" ? large : large ? largeTickState() : gameReducer(createInitialGameState(),
    { type: "SET_PAUSED", paused: false, operationId: "tick-perf.play" });
  const campaign = codecTestCampaign(JSON.stringify(state)), clock = new TestCloudClock(), cache = new MemoryCloudCache();
  const scope = { backendId: "tick-perf", accountId: crypto.randomUUID(), campaignId: state.campaignId };
  const server = new FakeCloudServer(clock.wallNow);
  server.setAccess(scope.accountId, { snapshotSaves: true });
  const copy = await snapshotCopy(state, campaign, "57", clock.wall, { branchId: "tick-perf.base", sequence: 6760, parents: [] });
  server.seed(scope.accountId, copy);
  const coordinator = new CloudSyncCoordinator({ scope, cache, transport: server.transport(scope.accountId), clock, enabled: true });
  if (!await coordinator.open() || !await coordinator.startWriter() || !coordinator.resume()) throw new Error("Tick fixture must open a playable account session.");
  const openingStart = performance.now();
  const session = await CloudGameSession.create(coordinator);
  const openingMs = performance.now() - openingStart;
  return { state, campaign, clock, cache, scope, server, copy, coordinator, session, openingMs };
}
