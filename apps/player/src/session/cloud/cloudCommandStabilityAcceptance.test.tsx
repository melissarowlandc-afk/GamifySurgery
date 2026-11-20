import { act } from "react";
import { afterEach, expect, it, vi } from "vitest";
import * as domain from "@gamify-surgery/game-domain";
import {
  bridgeHall, buildFixture, examRoom, hallwaySaleClinic, pausedClinic,
} from "../../../../../packages/game-domain/tests/paused-command-outage-fixtures";
import { AuthAccountContext } from "../../auth/AuthAccountContext";
import { showCommandProblem } from "../../diagnostics/problemDiagnostics";
import { ActionFeedbackLayer } from "../../ui/ActionFeedbackLayer";
import { allElements, cleanupPhoneTests, phoneTestDom } from "../../ui/testDomHarness";
import { createFreshProfile } from "../prototypeStorage";
import { usePrototypeSession } from "../usePrototypeSession";
import { operationalSessionFixture } from "./operationalSessionTestSupport";
import { loadCloudSnapshot } from "./snapshotCodec";
import { deferred } from "./syncTestSupport";
import { CLOUD_LEASE_MS, CLOUD_RENEW_MS, CloudSyncError } from "./transport";

const context = domain.PROTOTYPE_DOMAIN_CONTEXT;

afterEach(async () => {
  await cleanupPhoneTests();
  showCommandProblem(null);
  vi.restoreAllMocks();
});

async function accountCopy(fixture: Awaited<ReturnType<typeof operationalSessionFixture>>) {
  const { scope, server } = fixture;
  const copy = await server.transport(scope.accountId).load(scope.campaignId);
  const { state } = await loadCloudSnapshot({
    snapshot: copy.snapshot, revision: copy.revision, expectedRevision: copy.revision,
    expectedCampaignId: scope.campaignId, lineage: copy.lineage,
  });
  return { revision: copy.revision, state };
}

async function verifyHallwaySale(input: domain.GameState, roomId: string, worker: boolean, startsOutage: boolean) {
  const f = await operationalSessionFixture({}, input, worker);
  try {
    const action = { type: "SELL_ROOM", roomId, operationId: "public.cloud.sale" } as const;
    const expected = domain.gameReducer(structuredClone(input), action, context);
    expect(expected.operationReceipts[action.operationId]?.status).toBe("applied");
    expect(f.session.canExecute).toBe(true);
    const applied = await f.session.executeControllerCommand(action, context);
    expect(applied?.operationReceipts[action.operationId], "Cloud sale receipt").toEqual(expected.operationReceipts[action.operationId]);
    expect(await f.session.checkpointNow("purchase")).toBe(true);
    await f.session.commandsSettled();
    const saved = await accountCopy(f);
    expect(saved.revision).toBe("2");
    expect(saved.state.operationReceipts[action.operationId]).toStrictEqual(expected.operationReceipts[action.operationId]);
    expect(saved.state.rooms.some(room => room.id === roomId)).toBe(false);
    expect(saved.state.rooms.find(room => room.id === examRoom)?.upkeepOutage).toEqual(startsOutage ? {
      version: "room-upkeep-outage.v1", sinceFacilityTick: input.facilityTick, lastObservedFacilityTick: input.facilityTick,
    } : undefined);
    expect(f.session.syncView).toMatchObject({ revision: saved.revision, canExecute: true, failure: null, pending: false });
  } finally {
    f.session.dispose();
  }
}

it.each([true, false])("B-020 accepts and saves the B-018 hallway sale (worker=%s)", async worker => {
  await verifyHallwaySale(hallwaySaleClinic(), bridgeHall, worker, true);
});

it("control: the same codec and writer save an off-route hallway sale", async () => {
  const roomId = "public.cloud.off-route";
  const state = buildFixture(hallwaySaleClinic(), {
    type: "PLACE_ROOM", roomId, roomDefinitionId: "room.hallway", x: 34, y: 26, orientation: 0,
  });
  await verifyHallwaySale(state, roomId, true, false);
});

it.each([true, false])("B-020 contains an execute throw across an own-save receipt and lease renewal (worker=%s)", async worker => {
  const f = await operationalSessionFixture({}, pausedClinic(), worker);
  const { session, coordinator, scope, server, clock } = f;
  const transport = server.transport(scope.accountId);
  const holdReceipt = deferred();
  const original = await transport.head(scope.campaignId);
  const initialExpiry = clock.wall + CLOUD_LEASE_MS;
  const observedFailures: string[] = [];
  const unsubscribe = coordinator.subscribe(() => {
    if (coordinator.view.failure) observedFailures.push(coordinator.view.failure);
  });
  let save: Promise<boolean> | undefined;
  try {
    const first = { type: "SET_SIMULATION_SPEED", speed: 2, operationId: "public.cloud.before-throw" } as const;
    expect((await session.executeControllerCommand(first, context))?.operationReceipts[first.operationId]?.status).toBe("applied");

    const env = phoneTestDom();
    Object.assign(env.doc, { visibilityState: "visible" });
    Object.assign(env.browser, { setInterval: () => 1, clearInterval() {} });
    const profile = { ...createFreshProfile(), activeCampaignId: scope.campaignId, tutorialsEnabled: false,
      campaigns: [{ ...session.metadata, state: session.state }] };
    function Controller() {
      const game = usePrototypeSession({ profile, notice: "" }, session);
      return <>
        <button onClick={() => game.setSimulationSpeed(4)}>Change simulation speed</button>
        <button onClick={() => game.togglePause()}>Resume clinic</button>
        <ActionFeedbackLayer shell="desktop" />
      </>;
    }
    await env.render(<AuthAccountContext.Provider value={scope.accountId}><Controller /></AuthAccountContext.Provider>);

    await act(async () => {
      server.faults.push({ method: "commit", at: "after", wait: holdReceipt.promise });
      save = session.checkpointNow("purchase");
      await vi.waitFor(() => expect(server.operationCount(scope.accountId)).toBe(1), { timeout: 10_000 });
    });
    expect((await transport.head(scope.campaignId)).revision).toBe("2");
    expect(coordinator.confirmedRevision).toBe(original.revision); // The real commit is ahead of its held acknowledgment.

    const execute = vi.spyOn(domain, "applyGameEvidenceCommand").mockImplementationOnce(() => {
      throw new TypeError("Synthetic command execution fault");
    });
    await env.click("Change simulation speed");
    await act(async () => { await session.commandsSettled(); });
    expect(execute).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      type: "SET_SIMULATION_SPEED", speed: 4,
    }), expect.anything());
    const failedCommand = execute.mock.calls[0]![1];
    execute.mockRestore();
    expect(session.state.operationReceipts[failedCommand.operationId]).toBeUndefined();
    expect(session.state.simulationSpeed).toBe(2);
    expect(session.syncView).toMatchObject({ canExecute: true, failure: null });
    const notice = allElements(env.doc.body, element => element.attributes["data-action-feedback"] !== undefined)
      .map(element => element.textContent).join(" ");

    // Simulate a stale-revision reply to a renewal while only this writer's
    // receipt is pending. The fake server still owns the real committed head.
    server.faults.push({ method: "renew", at: "before", error: new CloudSyncError("revision") });
    await act(async () => {
      clock.advance(CLOUD_RENEW_MS);
      await session.pulse();
      expect(server.calls.filter(call => call.method === "renew").length).toBeGreaterThanOrEqual(1);
      holdReceipt.resolve();
      expect(await save).toBe(true);
      await session.commandsSettled();
      for (let elapsed = CLOUD_RENEW_MS; elapsed <= CLOUD_LEASE_MS; elapsed += CLOUD_RENEW_MS) {
        clock.advance(CLOUD_RENEW_MS);
        await session.pulse();
      }
    });
    expect(clock.wall).toBeGreaterThan(initialExpiry);
    expect(session.syncView).toMatchObject({ revision: "2", failure: null, canExecute: true, localDurable: true, pending: false });
    expect(await transport.head(scope.campaignId)).toMatchObject({
      revision: "2", writerActive: true, writerGeneration: original.writerGeneration,
    });
    expect(server.calls.filter(call => call.method === "renew").length).toBeGreaterThan(1);
    expect(server.calls.filter(call => call.method === "acquire")).toHaveLength(1);
    expect(observedFailures).toEqual([]);

    await env.click("Resume clinic");
    await act(async () => {
      await session.commandsSettled();
      expect(await session.checkpointNow("purchase")).toBe(true);
    });
    const saved = await accountCopy(f);
    expect(saved.revision).toBe("3");
    expect(saved.state.paused).toBe(false);
    expect(saved.state.simulationSpeed).toBe(2);
    expect(saved.state.operationReceipts[failedCommand.operationId]).toBeUndefined();
    expect(saved.state.operationReceipts[first.operationId]?.status).toBe("applied");
    expect(observedFailures).toEqual([]);
    expect(notice).toMatch(/\b(?:action|speed)\b/i);
    expect(notice).toMatch(/\b(?:did not|didn't|could not|couldn't|failed|unable)\b/i);
    expect(notice).not.toContain("Account saving must be checked before continuing.");
  } finally {
    holdReceipt.resolve();
    await save?.catch(() => {});
    unsubscribe();
    f.session.dispose();
  }
});
