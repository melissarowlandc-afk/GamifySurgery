import { expect, it } from "vitest";
import { createGameEvidenceCheckpoint } from "@gamify-surgery/game-domain";
import { hydrateSharedSpace, sharedSpaceFixture, SharedSpaceCareMonitor } from "../../../../packages/game-domain/tests/periop-shared-working-space-fixture";
import { OperationalEngineProcessor } from "./cloud/operationalEngineProcessor";
import { applyOperationalStatePatch } from "./cloud/operationalStatePatch";
import { createPrototypePlayerView } from "./viewModels";
import { describeFacilityCharacter } from "./characterActivityPresentation";

it("B-013 real operational-engine hydration/ticks clear the stalled nurse tooltip and Services queue as bedside care and cases resume", () => {
  const fixture = sharedSpaceFixture({ retained: true });
  const initialView = createPrototypePlayerView(fixture.state, null, false, null);
  expect(initialView.serviceIncome.periopNurseQueueLength).toBe(fixture.patientIds.length);
  const oldest = fixture.state.serviceOperations.find(op => op.id === fixture.oldestId)!;
  expect(describeFacilityCharacter(fixture.state, { kind: "service-visitor", id: oldest.actorId })?.activity).toBe("Waiting for peri-op nurse");
  let state = hydrateSharedSpace(fixture.state);
  const history = JSON.stringify(state.learningHistories);

  // This is the production engine processor used by the worker/client, with
  // its real evidence import/verification, command boundary and state patches.
  // No reducer, actor movement, allocation or presentation result is mocked.
  const engine = new OperationalEngineProcessor();
  const initialized = engine.handle({ id: 1, kind: "initialize", checkpoint: createGameEvidenceCheckpoint(state),
    visibleState: structuredClone(state), atRealMs: state.createdAtRealMs });
  expect(initialized.kind).toBe("initialized");
  const monitor = new SharedSpaceCareMonitor(fixture, state);
  for (let minute = 0; minute < fixture.bound; minute++) {
    const reply = engine.handle({ id: minute + 2, kind: "command", expectedVersion: minute,
      command: { type: "ADVANCE_TICK", operationId: `shared.worker.tick.${minute}`, advancedAtRealMs: state.createdAtRealMs + minute } });
    expect(reply.kind).toBe("applied");
    if (reply.kind !== "applied") throw new Error(`Real operational engine failed: ${JSON.stringify(reply)}`);
    state = applyOperationalStatePatch(state, structuredClone(reply.patch));
    monitor.observe(state);
    if (monitor.done) break;
  }
  const view = createPrototypePlayerView(state, null, false, null);
  const diagnostics = JSON.stringify({ ...monitor.summary(state), queue: view.serviceIncome.periopNurseQueueLength,
    patientLabels: fixture.patientIds.map(id => {
      const op = state.serviceOperations.find(candidate => candidate.id === id)!;
      return { id, tooltip: describeFacilityCharacter(state, { kind: "service-visitor", id: op.actorId })?.activity,
        services: view.serviceIncome.activeOperations.find(candidate => candidate.id === id)?.statusLabel };
    }) });
  expect([...monitor.completed], `B-013 must clear the actual stalled work, not merely hide its label. ${diagnostics}`).toEqual(expect.arrayContaining(fixture.patientIds));
  expect(monitor.procedures.size, diagnostics).toBeGreaterThan(0);
  expect(monitor.summary(state).violations, diagnostics).toEqual([]);
  expect(view.serviceIncome.periopNurseQueueLength, diagnostics).toBe(0);
  for (const id of fixture.patientIds) {
    const op = state.serviceOperations.find(candidate => candidate.id === id)!;
    expect(describeFacilityCharacter(state, { kind: "service-visitor", id: op.actorId })?.activity).not.toBe("Waiting for peri-op nurse");
    expect(view.serviceIncome.activeOperations.find(candidate => candidate.id === id)?.statusLabel).not.toBe("Waiting for peri-op nurse");
  }
  for (const nurse of state.employees.filter(employee => employee.staffRoleDefinitionId === "staff.periop_nurse")) {
    expect(view.facility.staff.find(employee => employee.instanceId === nurse.id)?.location).toEqual(nurse.location);
  }
  expect(JSON.stringify(state.learningHistories)).toBe(history);
});
