import { describe, expect, it } from "vitest";
import { GUIDANCE_TIP_CATALOG } from "@gamify-surgery/balance-config";
import {
  advanceGuidanceTips, evaluateGuidanceTipCandidates, getDisplayedClinicSatisfaction, getFacilityProgressionStatus,
  getRoomDefinition, getStaffRoleDefinition, synchronizeFacilityConditionOccurrences,
  TUTORIAL_ENCOUNTER_ID, SECOND_TUTORIAL_ENCOUNTER_ID,
} from "../src";
import { tipsFixture } from "./guidance-tips-fixtures";

const id = "tip.progression.next-step";
const candidate = (f: ReturnType<typeof tipsFixture>) => evaluateGuidanceTipCandidates(f.state, f.context).find((tip) => tip.id === id);
function firstRoomGoal() {
  const f = tipsFixture(); f.state.facilityLevel = 0; f.state.clinicalXp = 0;
  f.state.rooms = f.state.rooms.filter((room) => room.roomDefinitionId !== "room.examination");
  f.state.doors = f.state.doors.filter((door) => f.state.rooms.some((room) => room.id === door.roomId));
  for (const tutorial of [TUTORIAL_ENCOUNTER_ID, SECOND_TUTORIAL_ENCOUNTER_ID]) f.state.encounters[tutorial]!.finalPatientSatisfaction = 80;
  return f;
}
function metricGoals() {
  const f = tipsFixture(); f.state.facilityLevel = 1;
  for (const room of ["room.ultrasound", "room.minor_procedure", "room.waiting", "room.bathroom"]) f.addRoom(room);
  f.employee("staff.imaging_technician", "room.fixture.ultrasound"); f.employee();
  return f;
}
function emitted(f: ReturnType<typeof tipsFixture>, variant: "A" | "B" = "A") {
  const tips = f.state.alertHumor.guidanceTips!;
  for (const tip of GUIDANCE_TIP_CATALOG) if (tip.id !== id) tips.lastEmittedById[tip.id] = f.state.facilityTick;
  tips.emissionCounts[id] = variant === "A" ? 0 : 1;
  expect(advanceGuidanceTips(f.state, f.context)).toBe(false);
  f.state.facilityTick += 60;
  expect(advanceGuidanceTips(f.state, f.context)).toBe(true);
  return tips.history.at(-1)!;
}

describe("T38 concrete progression remedies and truthful metrics", () => {
  it("prioritizes the missing Examination Room over earlier unmet XP and satisfaction metrics", () => {
    const f = firstRoomGoal();
    expect(getFacilityProgressionStatus(f.state, f.context).requirements.filter((goal) => !goal.met).map((goal) => goal.id))
      .toEqual(["progression.clinical_xp", "progression.satisfaction", "progression.room.room.examination"]);
    const tip = candidate(f)!; const room = getRoomDefinition("room.examination", f.context)!;
    expect(tip).toMatchObject({ targetKey: "progression.room.room.examination", speaker: "Goals",
      action: { kind: "place_room", definitionId: room.id, expectedCost: room.constructionCost } });
    expect(tip.actionLabel).toContain(`$${room.constructionCost.toFixed(2)}`);
    expect(tip.values.guidance).toBe(`Build ${room.displayName} to meet this room requirement.`);
    const receipt = emitted(f);
    expect(receipt).toMatchObject({ speaker: "Goals", variant: "A" });
    expect(receipt.message).not.toMatch(/Review Goals|Open Goals|finish Build|finish Satisfaction/);
  });
  it("selects concrete room blockers in actual requirement order, ahead of metrics and staffing", () => {
    const f = tipsFixture(); f.state.facilityLevel = 1; f.state.clinicalXp = 0;
    expect(candidate(f)?.action).toMatchObject({ kind: "place_room", definitionId: "room.ultrasound" });
    f.addRoom("room.ultrasound");
    expect(candidate(f)?.action).toMatchObject({ kind: "place_room", definitionId: "room.minor_procedure" });
  });
  it("uses the role's real hire price when a staff requirement is the first concrete blocker", () => {
    const f = metricGoals(); f.state.clinicalXp = 0;
    f.state.employees = f.state.employees.filter((employee) => employee.staffRoleDefinitionId !== "staff.imaging_technician");
    const role = getStaffRoleDefinition("staff.imaging_technician", f.context)!; role.hiringCost = 237;
    expect(candidate(f)).toMatchObject({ targetKey: "progression.staff.staff.imaging_technician", speaker: "Goals",
      action: { kind: "hire_staff", roleId: role.id, expectedCost: role.hiringCost } });
    expect(candidate(f)?.actionLabel).toContain("$237.00");
  });
  it("selects a required room dependency before the goal's named room, with its exact price", () => {
    const f = tipsFixture(); f.state.facilityLevel = 1;
    const room = getRoomDefinition("room.ultrasound", f.context)!;
    room.requiredRoomDefinitionIds = ["room.waiting"];
    expect(candidate(f)?.action).toMatchObject({ kind: "place_room", definitionId: "room.waiting",
      expectedCost: getRoomDefinition("room.waiting", f.context)!.constructionCost });
    expect(candidate(f)?.values.guidance).toContain("first to support the Ultrasound Room requirement");
  });
  it("yields rather than spending the cash buffer or switching to an unrelated metric", () => {
    const f = firstRoomGoal();
    const price = getRoomDefinition("room.examination", f.context)!.constructionCost;
    f.state.cash = price + f.context.balanceRelease.emergencyGlp1.lowCashAlertThreshold - 1;
    f.state.cashCents = Math.round(f.state.cash * 100);
    expect(candidate(f)).toBeUndefined();
    f.state.cash += 1; f.state.cashCents += 100;
    expect(candidate(f)?.action?.kind).toBe("place_room");
  });
  it("suppresses the tip when its exact remedy already has a live condition, even after the intro gate", () => {
    const f = firstRoomGoal(); synchronizeFacilityConditionOccurrences(f.state, f.context);
    const occurrence = f.state.environment.facilityConditionOccurrences.find((row) => row.conditionKey === "missing_examination_room")!;
    expect(occurrence).toMatchObject({ resolvedAtFacilityTick: null, target: { kind: "build_mode", id: "room.examination" } });
    expect(candidate(f)).toBeUndefined();
    occurrence.resolvedAtFacilityTick = f.state.facilityTick - 1;
    expect(candidate(f)?.action?.kind).toBe("place_room");
  });
  it("ignores unrelated live condition targets rather than suppressing all concrete guidance", () => {
    const f = firstRoomGoal(); synchronizeFacilityConditionOccurrences(f.state, f.context);
    f.state.environment.facilityConditionOccurrences[0]!.target = { kind: "build_mode", id: "room.waiting" };
    expect(candidate(f)?.action).toMatchObject({ kind: "place_room", definitionId: "room.examination" });
  });
  it.each(["A", "B"] as const)("gives metric-only XP a truthful remaining amount in variant %s without a Goals button", (variant) => {
    const f = metricGoals(); const stage = f.context.balanceRelease.facility.stageDefinitions.find((entry) => entry.level === 1)!;
    stage.minimumClinicalXp = 73; f.state.clinicalXp = 31;
    expect(candidate(f)).toMatchObject({ targetKey: "progression.clinical_xp", speaker: "Goals",
      values: { guidance: "Complete patient visits to earn 42 more Clinical XP." } });
    expect(candidate(f)?.action).toBeUndefined(); expect(candidate(f)?.actionLabel).toBeUndefined();
    const receipt = emitted(f, variant);
    expect(receipt).toMatchObject({ speaker: "Goals", variant });
    expect(receipt.message).toContain("Complete patient visits to earn 42 more Clinical XP.");
    expect(receipt.message).not.toMatch(/Review Goals|Open Goals/);
  });
  it("names actual satisfaction, the balance target and the largest live cleanliness cause", () => {
    const f = metricGoals();
    for (const tutorial of [TUTORIAL_ENCOUNTER_ID, SECOND_TUTORIAL_ENCOUNTER_ID]) f.state.encounters[tutorial]!.finalPatientSatisfaction = 80;
    f.context.balanceRelease.facility.stageDefinitions.find((entry) => entry.level === 1)!.satisfactionMustBeGreaterThan = 87;
    for (const room of f.state.rooms) room.cleanliness = 0;
    f.state.environment.waterCoolerFillPercent = 0;
    const tip = candidate(f)!;
    expect(tip.targetKey).toBe("progression.satisfaction");
    expect(tip.values.guidance).toContain(`Satisfaction is ${getDisplayedClinicSatisfaction(f.state, f.context)}% (goal: above 87%)`);
    expect(tip.values.guidance).toContain("EVS room cleaning to address dirty rooms, the largest current facility penalty");
    expect(tip.action).toBeUndefined();
  });
  it("names recorded waiting losses when no current facility penalty exists, without reviving a resolved amenity problem", () => {
    const f = metricGoals();
    const visit = f.state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    visit.finalPatientSatisfaction = 60;
    visit.dissatisfactionByCause = { excessive_waiting: { pointsLost: 30, lastAppliedAtFacilityTick: 0 }, missing_amenities: { pointsLost: 5, lastAppliedAtFacilityTick: 0 } };
    expect(candidate(f)?.values.guidance).toBe("Satisfaction is 80% (goal: above 90%); reduce patient waits, the largest recorded satisfaction loss.");
  });
  it("uses the rating's rolling window when attributing recorded losses", () => {
    const f = metricGoals(); f.context.balanceRelease.patientSatisfaction.rollingWindowSize = 1;
    const earlier = f.state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    earlier.finalPatientSatisfaction = 50; earlier.dissatisfactionByCause = { poor_cleanliness: { pointsLost: 40, lastAppliedAtFacilityTick: 0 } };
    const latest = f.state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!;
    latest.resolvedAtFacilityTick = 1; latest.finalPatientSatisfaction = 70;
    latest.dissatisfactionByCause = { excessive_waiting: { pointsLost: 10, lastAppliedAtFacilityTick: 1 } };
    expect(candidate(f)?.values.guidance).toBe("Satisfaction is 70% (goal: above 90%); reduce patient waits, the largest recorded satisfaction loss.");
  });
  it("labels provisional satisfaction accurately when no ended visit has a recorded rating", () => {
    const f = metricGoals();
    for (const encounter of Object.values(f.state.encounters)) encounter.finalPatientSatisfaction = null;
    expect(candidate(f)?.values.guidance).toBe("Provisional satisfaction is 100% (goal: above 90%); complete patient visits to record a rating.");
  });
  it("uses the actual completed-visit shortfall and singular grammar", () => {
    const f = metricGoals(); f.context.balanceRelease.facility.stageDefinitions.find((entry) => entry.level === 1)!.minimumCompletedEncounters = 3;
    expect(candidate(f)?.values.guidance).toBe("Complete 1 more patient visit to meet the completed-patient goal.");
    expect(candidate(f)?.action).toBeUndefined();
  });
  it("puts first-service room/staff setup ahead of metric advice, then explains the actual completion lever", () => {
    const f = metricGoals(); f.state.facilityLevel = 2; f.state.clinicalXp = 0;
    expect(candidate(f)?.action).toMatchObject({ kind: "place_room", definitionId: "room.periop_recovery" });
    f.roomAndStaff("room.periop_recovery", "staff.periop_nurse"); f.roomAndStaff("room.endoscopy", "staff.endoscopy_nurse");
    f.state.clinicalXp = f.context.balanceRelease.facility.stageDefinitions.find((entry) => entry.level === 2)!.minimumClinicalXp;
    expect(candidate(f)).toMatchObject({ targetKey: "progression.endoscopy_completion", speaker: "Goals" });
    expect(candidate(f)?.values.guidance).toContain("Complete the first endoscopy visit through the staffed");
    expect(candidate(f)?.action).toBeUndefined();
  });
  it("keeps the real Advance action and Goals speaker when the next level is eligible", () => {
    const f = tipsFixture(); f.state.facilityLevel = 0;
    expect(candidate(f)).toMatchObject({ speaker: "Goals", action: { kind: "level_up" },
      values: { guidance: "Advance the clinic to Level 1." } });
  });
});
