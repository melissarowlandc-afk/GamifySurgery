// Read-only diagnosis against checked-in synthetic checkpoints. No player data,
// evidence writes, test timeout changes or gameplay/answer analytics.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { performance } from "node:perf_hooks";
import "../economy-audit/source-loader.mjs";

const domain = await import("../../packages/game-domain/src/index.ts");
const content = await import("../../packages/clinical-content/src/index.ts");
const { replaceDiagnosticOrderPlan } = await import("../../packages/game-domain/src/diagnostic-orders.ts");
const { LevelFiveIntegrationJourney } = await import("../../tests/fixtures/level-five-integration.ts");
const { createLevelFiveIntegrationQaState } = await import("../../tests/fixtures/level-five-integration-qa.ts");
const read = path => JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
const checkpoints = read("../../tests/fixtures/level-five-integration-checkpoints-20261012.json");
const garden = read("../../packages/game-domain/tests/fixtures/level-five-garden-offsite-overlap-20261017.json");
const { deserializeGameState, serializeGameState, gameReducer, getPatientAmenityTrip } = domain;
const baseline = { ...domain.PROTOTYPE_DOMAIN_CONTEXT, clinicalRelease: content.QUESTION_QUALITY_SOURCE_RELEASE };
const contexts = { baseline, live: domain.PROTOTYPE_DOMAIN_CONTEXT };
const pilotCaseIds = new Set(content.QUESTION_QUALITY_REVISIONS.map(r => r.caseId));
const canonical = (state, context) => deserializeGameState(serializeGameState(state), context);
const scenarios = process.argv.slice(2);
if (scenarios.some(s => !["garden", "continuation", "retry"].includes(s)))
  throw new Error("Use garden, continuation and/or retry; inputs are synthetic repository checkpoints only.");

function runGarden(context, mode, observe) {
  const id = "encounter.auto.5.255";
  let state = structuredClone(garden);
  if (mode === "legacy reload") state = canonical(state, context);
  else {
    const encounter = state.encounters[id];
    encounter.patientMovement = null;
    const plan = structuredClone(encounter.pendingResult.diagnosticTiming);
    const departure = plan.phases.find(p => p.kind === "patient_departure");
    departure.status = "pending"; departure.startedAtTick = null;
    replaceDiagnosticOrderPlan(encounter, plan);
  }
  state.paused = false;
  const returnTarget = getPatientAmenityTrip(state, "encounter", id).returnTarget;
  let sawReturn = false, sawDeparture = false, leftMap = false, minutes = 0;
  for (let minute = 0; minute < 60; minute++) {
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `garden.departure.${mode}.${minute}` }, context);
    const encounter = state.encounters[id], trip = getPatientAmenityTrip(state, "encounter", id);
    if (trip) {
      sawReturn = true;
      assert.equal(trip.status, "returning"); assert.equal(trip.returnRequested, true);
      assert.equal(encounter.patientMovement, null);
      assert.deepEqual(encounter.patientLocation, trip.path[trip.pathIndex]);
    }
    if (encounter.patientMovement?.kind === "departing_for_offsite_testing") {
      if (!sawDeparture) assert.deepEqual(encounter.patientMovement.path[0], returnTarget);
      sawDeparture = true; assert.equal(trip, null);
    }
    const restored = canonical(state, context);
    assert.deepEqual(restored.encounters[id].patientLocation, encounter.patientLocation);
    observe(restored); minutes++;
    if (sawDeparture && encounter.patientLocation === null) { leftMap = true; break; }
  }
  assert.deepEqual([sawReturn, sawDeparture, leftMap], [true, true, true]);
  return { state, minutes, mode };
}

function runContinuation(context, observe) {
  const before = structuredClone(checkpoints["integration-running"]);
  const loaded = canonical(before, context);
  assert.deepEqual(loaded.levelFive, before.levelFive);
  for (const employee of before.employees)
    assert.equal(loaded.employees.find(e => e.id === employee.id).nextIdleActionAtFacilityTick, employee.nextIdleActionAtFacilityTick);
  for (const encounter of Object.values(before.encounters))
    assert.equal(loaded.encounters[encounter.id].nextIdleActionAtFacilityTick, encounter.nextIdleActionAtFacilityTick);
  const control = new LevelFiveIntegrationJourney(context, before), resumed = new LevelFiveIntegrationJourney(context, loaded);
  for (const branch of [control, resumed]) branch.apply({ type: "SET_PAUSED", paused: false });
  for (let minute = 0; minute < 120; minute++) {
    for (const branch of [control, resumed]) { branch.pump(); branch.tick(); }
    const restored = canonical(resumed.state, context);
    assert.deepEqual(restored, canonical(control.state, context), `minute ${minute}`);
    observe(restored);
  }
  return { state: resumed.state, minutes: 120, commands: resumed.commands };
}

function runRetry(context, observe) {
  const opening = createLevelFiveIntegrationQaState("integration-repeat", context);
  const first = structuredClone(opening.levelFive.progress.gameFinished);
  const journey = new LevelFiveIntegrationJourney(context, opening); journey.accuracy = 0;
  let newFinishNotices = 0, minutes = 0;
  const check = action => {
    const had = journey.state.events.some(e => e.id === "event.level-five.game-finished");
    action();
    if (!had && journey.state.events.some(e => e.id === "event.level-five.game-finished")) newFinishNotices++;
  };
  journey.apply({ type: "BOOK_INSPECTION" }); journey.apply({ type: "SET_PAUSED", paused: false });
  for (let i = 0; i < 3061 && ["preparing", "running"].includes(journey.state.levelFive.inspection.status); i++) {
    check(() => journey.pump()); check(() => journey.tick());
    observe(journey.state); minutes++;
  }
  const inspection = journey.state.levelFive.inspection;
  assert.equal(inspection.lastReport.outcome, "completed");
  assert.ok(inspection.lastReport.rawTotalScore < opening.levelFive.inspection.bestCompletedReport.rawTotalScore);
  assert.deepEqual(inspection.latestCompletedReport, inspection.lastReport);
  assert.deepEqual(inspection.bestCompletedReport, opening.levelFive.inspection.bestCompletedReport);
  assert.deepEqual(journey.state.levelFive.progress.gameFinished, first);
  assert.equal(journey.state.levelFive.progress.finishPageAcknowledgedAtFacilityTick, opening.levelFive.progress.finishPageAcknowledgedAtFacilityTick);
  assert.equal(newFinishNotices, 0);
  assert.ok(journey.state.retiredServiceHistory.retiredReceiptCount > opening.retiredServiceHistory.retiredReceiptCount);
  return { state: journey.state, minutes, commands: journey.commands };
}

for (const scenario of scenarios.length ? scenarios : ["garden", "continuation", "retry"]) {
  for (const mode of scenario === "garden" ? ["live", "legacy reload"] : [null]) {
    const results = {};
    for (const [name, context] of Object.entries(contexts)) {
      const started = performance.now(), trajectory = createHash("sha256"), seen = new Set(), revised = new Set();
      const observe = state => {
        trajectory.update(serializeGameState(state));
        for (const e of Object.values(state.encounters)) {
          seen.add(e.id);
          if (pilotCaseIds.has(e.frozenCase.id)) revised.add(e.id);
        }
      };
      const result = scenario === "garden" ? runGarden(context, mode, observe)
        : scenario === "continuation" ? runContinuation(context, observe) : runRetry(context, observe);
      results[name] = { ...result, durationMs: Math.round(performance.now() - started), trajectoryHash: trajectory.digest("hex"),
        encountered: seen.size, pilotEncounterIds: [...revised].sort() };
      const { state, ...summary } = results[name];
      process.stdout.write(JSON.stringify({ scenario, context: name, ...summary }) + "\n");
    }
    assert.deepEqual(results.live.state, results.baseline.state, `${scenario}/${mode}: final state changed`);
    assert.equal(results.live.trajectoryHash, results.baseline.trajectoryHash, `${scenario}/${mode}: intermediate state changed`);
    process.stdout.write(JSON.stringify({ scenario, mode, identicalTrajectory: true }) + "\n");
  }
}
