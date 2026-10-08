import { describe, expect, it } from "vitest";
import { GUIDANCE_TIP_POLICY } from "@gamify-surgery/balance-config";
import { advanceGuidanceTips, createInitialGameState, createGuidanceTipsState, deserializeGameState, serializeGameState, gameReducer,
  TUTORIAL_ENCOUNTER_ID, SECOND_TUTORIAL_ENCOUNTER_ID, type GameState } from "../src";
import { tipsFixture, addLitter } from "./guidance-tips-fixtures";

function manyCandidates() {
  const f = tipsFixture();
  const room = f.addRoom("room.surgeon_office"); const employee = f.employee("staff.surgeon", room.room.id);
  f.state.doors = f.state.doors.filter((door) => door.roomId !== room.room.id);
  addLitter(f.state); f.state.environment.waterCoolerFillPercent = 0; f.state.environment.waterCoolerEmptySinceTick = 0;
  f.state.clinicalXp = 0; f.discussion(employee);
  return f;
}
function runAt(f: ReturnType<typeof tipsFixture>, tick: number) { f.state.facilityTick = tick; return advanceGuidanceTips(f.state, f.context); }
function completedCampaign(): GameState {
  const state = createInitialGameState(undefined, { createdAtRealMs: 0 });
  const first = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
  first.lifecycle = "resolved"; first.resolutionReason = "completed"; first.resolvedAtFacilityTick = 0;
  first.finalPatientSatisfaction = first.patientSatisfaction; first.patientLocation = null; first.patientMovement = null;
  state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID] = { ...structuredClone(first), id: SECOND_TUTORIAL_ENCOUNTER_ID };
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER; state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  return state;
}

describe("persistent occasional tip delivery", () => {
  it("waits for both completed introductions plus 120 running minutes and a continuous 60-minute trigger", () => {
    const f = tipsFixture(); f.state.alertHumor.guidanceTips = createGuidanceTipsState(0);
    for (const id of [TUTORIAL_ENCOUNTER_ID, SECOND_TUTORIAL_ENCOUNTER_ID]) f.state.encounters[id]!.resolvedAtFacilityTick = 1000;
    f.state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.resolutionReason = null;
    expect(runAt(f, 1000)).toBe(false); expect(f.state.alertHumor.guidanceTips.history).toHaveLength(0);
    f.state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.resolutionReason = "completed";
    expect(runAt(f, 1060)).toBe(false); expect(runAt(f, 1119)).toBe(false);
    expect(runAt(f, 1120)).toBe(true); expect(f.state.alertHumor.guidanceTips.history[0]?.emittedAtTick).toBe(1120);
    const reset = tipsFixture(); reset.state.facilityLevel = 1; reset.state.alertHumor.guidanceTips!.lastEmittedById["tip.progression.next-step"] = 1500; expect(runAt(reset, 1500)).toBe(false);
    reset.encounter.idleWaitingSinceTick = null; runAt(reset, 1530); reset.encounter.idleWaitingSinceTick = 1531;
    expect(runAt(reset, 1531)).toBe(false); expect(runAt(reset, 1590)).toBe(false); expect(runAt(reset, 1591)).toBe(true);
  });
  it("enforces 180-minute clinic spacing and three receipts in every rolling 600 minutes", () => {
    const f = manyCandidates(); expect(runAt(f, 1500)).toBe(false); expect(runAt(f, 1560)).toBe(true);
    expect(runAt(f, 1739)).toBe(false); expect(runAt(f, 1740)).toBe(true); expect(runAt(f, 1920)).toBe(true);
    expect(runAt(f, 2100)).toBe(false); expect(runAt(f, 2159)).toBe(false); expect(runAt(f, 2160)).toBe(true);
    const tips = f.state.alertHumor.guidanceTips!;
    expect(tips.history.map((tip) => tip.emittedAtTick)).toEqual([1560, 1740, 1920, 2160]);
    expect(tips.rollingEmissionTicks).toEqual([1740, 1920, 2160]);
  });
  it("shares per-ID cooldown across targets and alternates variants without render rerolls", () => {
    const f = manyCandidates(); runAt(f, 1500); runAt(f, 1560);
    const first = f.state.alertHumor.guidanceTips!.history[0]!; expect(first.tipId).toBe("tip.access.restore"); expect(first.variant).toBe("A");
    const replacement = f.addRoom("room.training"); f.employee("staff.phlebotomist", replacement.room.id);
    f.state.doors = f.state.doors.filter((door) => door.roomId !== replacement.room.id);
    runAt(f, 1600); runAt(f, 1740); runAt(f, 1920); runAt(f, 2159);
    expect(f.state.alertHumor.guidanceTips!.history.filter((tip) => tip.tipId === first.tipId)).toHaveLength(1);
    runAt(f, 2160); const sameId = f.state.alertHumor.guidanceTips!.history.filter((tip) => tip.tipId === first.tipId);
    expect(sameId).toHaveLength(2); expect(sameId[1]?.variant).toBe("B");
  });
  it("spaces topic families and keeps one EVS root in its selected family until addressed", () => {
    const f = tipsFixture(); f.state.facilityLevel = 2; f.encounter.idleWaitingSinceTick = null; f.state.alertHumor.lastPatientArrivalTick = null; f.state.alertHumor.guidanceTips!.lastEmittedById["tip.progression.next-step"] = 1500;
    f.roomAndStaff("room.evs_closet", "staff.evs_worker"); f.addRoom("room.training"); f.state.rooms[0]!.cleanliness = 50;
    runAt(f, 1500); runAt(f, 2100); runAt(f, 2160);
    const tips = f.state.alertHumor.guidanceTips!;
    tips.lastEmittedById["tip.room.other-upgrade"] = 1500; // Isolate the EVS root from useful Training Room advice.
    expect(tips.history[0]?.tipId).toBe("tip.evs.room-upgrade");
    runAt(f, 2340); expect(tips.history.some((tip) => tip.tipId === "tip.evs.training")).toBe(false);
    // A real purchase releases the root and starts a fresh recent-fix grace.
    f.state.rooms.find((room) => room.roomDefinitionId === "room.evs_closet")!.upgradeLevel = 2;
    tips.lastEmittedById["tip.progression.next-step"] = 2350;
    runAt(f, 2350); expect(tips.rootLocks.evs).toBeUndefined();
    runAt(f, 2949); expect(tips.history.some((tip) => tip.tipId === "tip.evs.training")).toBe(false);
    runAt(f, 2950); runAt(f, 3010);
    expect(tips.history.some((tip) => tip.tipId === "tip.evs.training")).toBe(true);
  });
  it("holds a different tip ID in the same family for 600 minutes after the first remedy is fixed", () => {
    const f = tipsFixture(); f.state.facilityLevel = 1; f.encounter.idleWaitingSinceTick = null;
    f.addRoom("room.bathroom");
    const tips = f.state.alertHumor.guidanceTips!;
    tips.lastEmittedById["tip.progression.next-step"] = 1500;
    tips.lastEmittedById["tip.reception.coverage"] = 1500;
    f.state.environment.waterCoolerFillPercent = 0; f.state.environment.waterCoolerEmptySinceTick = 0;
    runAt(f, 1500); expect(runAt(f, 1560)).toBe(true);
    expect(tips.history[0]?.tipId).toBe("tip.water.manual");
    f.state.environment.waterCoolerFillPercent = 100; f.encounter.idleWaitingSinceTick = 1570;
    runAt(f, 1570); expect(runAt(f, 1740)).toBe(false); expect(runAt(f, 2159)).toBe(false);
    expect(runAt(f, 2160)).toBe(true); expect(tips.history[1]?.tipId).toBe("tip.waiting.build");
  });
  it("holds during dire problems, care interactions and storage failure, then waits 60 quiet minutes", () => {
    const f = manyCandidates(); runAt(f, 1500); f.encounter.patientSatisfaction = f.encounter.walkoutThreshold;
    expect(runAt(f, 1560)).toBe(false); expect(runAt(f, 1740)).toBe(false);
    f.encounter.patientSatisfaction = 100; expect(runAt(f, 1799)).toBe(false); expect(runAt(f, 1800)).toBe(true);
    const count = f.state.alertHumor.guidanceTips!.history.length;
    f.state.openChartEncounterId = f.encounter.id; expect(runAt(f, 2100)).toBe(false);
    f.state.openChartEncounterId = null; f.state.facilityTick = 2100;
    expect(advanceGuidanceTips(f.state, { ...f.context, guidanceTipsDeliveryBlocked: true })).toBe(false);
    expect(f.state.alertHumor.guidanceTips!.history).toHaveLength(count);
    expect(runAt(f, 2159)).toBe(false); expect(runAt(f, 2160)).toBe(true);
  });
  it("does not spend suppressed budgets or catch up from wall time, pause or a long resume", () => {
    const f = manyCandidates(); runAt(f, 1500); runAt(f, 1560);
    expect(advanceGuidanceTips(f.state, f.context, 90 * 86400000)).toBe(false);
    const before = structuredClone(f.state.alertHumor.guidanceTips);
    f.state.paused = true; f.state.facilityTick = 50_000;
    expect(advanceGuidanceTips(f.state, f.context)).toBe(false); expect(f.state.alertHumor.guidanceTips).toEqual(before);
    f.state.paused = false; expect(advanceGuidanceTips(f.state, f.context)).toBe(true);
    expect(advanceGuidanceTips(f.state, f.context)).toBe(false);
    expect(f.state.alertHumor.guidanceTips!.history).toHaveLength(2);
    expect(runAt(f, 50179)).toBe(false);
  });
  it("persists clocks, IDs, eligibility, root ownership and emission copy exactly through save/reload", () => {
    const state = completedCampaign(); state.facilityTick = 700;
    const tips = state.alertHumor.guidanceTips!;
    tips.introductoryCompletedAtTick = 0; tips.eligibleSince["tip.cash.manual-consult|cash"] = 600;
    tips.lastEmittedAtTick = 700; tips.lastEmittedById["tip.cash.manual-consult"] = 700; tips.lastEmittedByFamily.finance = 700;
    tips.emissionCounts["tip.cash.manual-consult"] = 1; tips.rollingEmissionTicks = [700]; tips.sequence = 1;
    tips.rootLocks.finance = { tipId: "tip.cash.manual-consult", targetKey: "cash" };
    tips.history.push({ id: "tip.occurrence.0", tipId: "tip.cash.manual-consult", targetKey: "cash", rootKey: "finance", emittedAtTick: 700, variant: "A", speaker: "Finance", message: "Saved tip copy." });
    const restored = deserializeGameState(serializeGameState(state)); expect(restored.alertHumor.guidanceTips).toEqual(tips);
    restored.facilityTick = 701; restored.paused = false;
    expect(advanceGuidanceTips(restored)).toBe(false); expect(restored.alertHumor.guidanceTips!.history[0]?.emittedAtTick).toBe(700);
  });
  it("keeps fresh and normalized save bytes stable for verified campaign writes and migration", () => {
    const state = createInitialGameState();
    const raw = serializeGameState(state);
    expect(serializeGameState(deserializeGameState(raw))).toBe(raw);
    delete state.alertHumor.guidanceTips;
    const normalized = serializeGameState(deserializeGameState(serializeGameState(state)));
    expect(serializeGameState(deserializeGameState(normalized))).toBe(normalized);
  });
  it("defaults old saves and unknown namespace versions to fresh observation, not old neglect or a burst", () => {
    const state = completedCampaign(); state.facilityTick = 900; delete state.alertHumor.guidanceTips;
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.alertHumor.guidanceTips).toMatchObject({ version: "guidance-tips.v1", initializedAtTick: 900, history: [], eligibleSince: {}, emissionCounts: {} });
    restored.paused = false; restored.facilityTick = 901; expect(advanceGuidanceTips(restored)).toBe(false);
    const raw = JSON.parse(serializeGameState(state)); raw.alertHumor.guidanceTips = { version: "future", lastEmittedAtTick: -1, history: [{ id: "fake" }] };
    expect(deserializeGameState(JSON.stringify(raw)).alertHumor.guidanceTips?.history).toEqual([]);
  });
  it("teaches appointments once for a supported setup and observes a deliberate Off change", () => {
    const f = tipsFixture(); f.roomAndStaff("room.endoscopy", "staff.endoscopy_nurse"); f.roomAndStaff("room.periop_recovery", "staff.periop_nurse");
    f.state.facilityLevel = 2;
    f.state.alertHumor.guidanceTips!.lastEmittedById["tip.progression.next-step"] = 1500;
    f.state.alertHumor.lastPatientArrivalTick = null;
    f.encounter.resolutionReason = "completed"; f.encounter.lifecycle = "resolved";
    runAt(f, 1500); f.state.serviceAppointmentsEnabled = false; runAt(f, 1510); runAt(f, 2109);
    expect(f.state.alertHumor.guidanceTips!.history.some((tip) => tip.tipId === "tip.services.appointments")).toBe(false);
    runAt(f, 2110); runAt(f, 2170);
    const tips = f.state.alertHumor.guidanceTips!;
    expect(tips.history.some((tip) => tip.tipId === "tip.services.appointments")).toBe(true);
    expect(tips.taughtServiceSetups).toHaveLength(1);
    runAt(f, 5000); expect(tips.history.filter((tip) => tip.tipId === "tip.services.appointments")).toHaveLength(1);
  });
  it("lets a due tip win over humor without a same-tick or next-tick joke burst", () => {
    let state = completedCampaign(); state.paused = false; state.facilityTick = 120; state.cash = 60; state.cashCents = 6000;
    state.alertHumor.alertsTutorialAcknowledgedAtTick = 0; state.alertHumor.nextAmbientAlertTick = 121;
    state.alertHumor.guidanceTips!.introductoryCompletedAtTick = 0;
    state.alertHumor.guidanceTips!.eligibleSince["tip.cash.manual-consult|cash"] = 61;
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: "tip.arbitration" });
    expect(state.alertHumor.guidanceTips!.history).toHaveLength(1); expect(state.events.some((event) => event.type === "ambient_message")).toBe(false);
    expect(state.alertHumor.nextAmbientAlertTick).toBe(241);
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: "tip.no-next-tick-joke" });
    expect(state.events.some((event) => event.type === "ambient_message")).toBe(false);
  });
  it("uses the approved B variant while the OR itself is still missing", () => {
    const f = tipsFixture(); f.encounter.idleWaitingSinceTick = null;
    f.state.alertHumor.guidanceTips!.lastEmittedById["tip.progression.next-step"] = 1500;
    runAt(f, 1500); expect(runAt(f, 1560)).toBe(true);
    expect(f.state.alertHumor.guidanceTips!.history[0]).toMatchObject({ tipId: "tip.surgery.setup", variant: "B" });
    expect(f.state.alertHumor.guidanceTips!.history[0]?.message).not.toContain("The OR is ready");
  });
});
