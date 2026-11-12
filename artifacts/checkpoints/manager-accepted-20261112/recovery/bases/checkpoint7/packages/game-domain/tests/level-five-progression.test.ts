import { describe, expect, it } from "vitest";
import { LEVEL_FIVE_INSPECTION_UNLOCK_EVENT_ID, PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import {
  PROTOTYPE_DOMAIN_CONTEXT, deserializeGameState, gameReducer, getAverageEffectiveStaffMorale,
  getCurrentQuestion, getDisplayedClinicSatisfaction, getEmployeeTrainingQuote, getFacilityProgressionStatus,
  getInspectionBookingBlockedReason, serializeGameState, type GameCommand, type GameState,
} from "../src";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../tests/fixtures/level-five-state";
import { createLevelFourReadyForFiveQaState, LEVEL_FIVE_GOALS_QA_ENCOUNTER_ID, setLevelFiveQaDisplayedSatisfaction } from "../../../tests/fixtures/level-five-progression";
import { createPreLevelFiveLaunchContext } from "../../../tests/fixtures/level-five-launch";

const context = createLevelFiveStateQaContext();
const base = createLevelFiveStateQaState("pre-goal", context);
const ready = () => ({ ...structuredClone(base), clinicalXp: 2000 });
const apply = (state: GameState, command: GameCommand) => gameReducer(state, command, context);
const acknowledge = (state: GameState, id = "m6.ack") => apply(state, { type: "SET_PAUSED", paused: state.paused, operationId: id });
const unlock = (state: GameState) => state.levelFive?.progress.inspectionUnlocked;

describe("M6 three-goal inspection eligibility", () => {
  it("uses exactly current-level XP, displayed satisfaction and the nonempty effective workforce mean", () => {
    const state = ready();
    expect(getDisplayedClinicSatisfaction(state, context)).toBeGreaterThan(90);
    expect(state.rooms.some(room => room.roomDefinitionId.startsWith("room.") &&
      ["room.founder_office", "room.executive_office", "room.gift_shop", "room.indoor_garden", "room.staff_gym"].includes(room.roomDefinitionId))).toBe(false);
    expect(state.employees.some(employee => employee.staffRoleDefinitionId === "staff.executive")).toBe(false);
    expect(getFacilityProgressionStatus(state, context)).toMatchObject({ eligible: false, terminalComplete: false, nextFacilityLevel: null });
    expect(getFacilityProgressionStatus(state, context).requirements.map(goal => goal.id)).toEqual([
      "progression.clinical_xp", "progression.satisfaction", "progression.staff_morale",
    ]);
    const earned = acknowledge(state);
    expect(unlock(earned)).toEqual({ version: "level-five-inspection-unlock.v1", earnedAtFacilityTick: state.facilityTick,
      clinicalXp: 2000, displayedSatisfaction: getDisplayedClinicSatisfaction(state, context), averageStaffMorale: 85, employedStaffCount: 1 });
    expect(earned.levelFive!.inspection.status).toBe("ready");
    for (const key of ["cashCents", "clinicalXp", "learningHistories", "reviewIntents", "settlements", "serviceIncomeReceipts", "rooms", "employees"] as const)
      expect(earned[key], key).toEqual(state[key]);
    expect(earned.levelFive!.progress.gameFinished).toBeNull();
    expect(earned.levelFive!.progress.finishPageAcknowledgedAtFacilityTick).toBeNull();
    expect(earned.events.find(event => event.id === LEVEL_FIVE_INSPECTION_UNLOCK_EVENT_ID)).toMatchObject({ priority: "informational", type: "success_message" });
    expect(earned.events.find(event => event.id === LEVEL_FIVE_INSPECTION_UNLOCK_EVENT_ID)?.reward).toBeUndefined();
  });

  it.each([
    [1999, 91, 85, false], [2000, 90, 85, false], [2000, 91, 84.999, false],
    [2000, 91, 85, true], [2001, 100, 100, true],
  ])("XP %i, displayed satisfaction %i, morale %f => unlocked %s", (xp, satisfaction, morale, expected) => {
    const state = ready(); state.clinicalXp = xp; state.employees[0]!.morale = morale;
    setLevelFiveQaDisplayedSatisfaction(state, context, satisfaction);
    expect(getDisplayedClinicSatisfaction(state, context)).toBe(satisfaction);
    expect(Boolean(unlock(acknowledge(state)))).toBe(expected);
  });

  it("keeps an empty workforce unmet and never substitutes the Founder", () => {
    const state = ready(); state.employees = [];
    expect(getAverageEffectiveStaffMorale(state)).toBeNull();
    expect(getFacilityProgressionStatus(state, context).requirements.at(-1)).toMatchObject({ met: false, current: 0 });
    expect(unlock(acknowledge(state))).toBeNull();
    expect(getInspectionBookingBlockedReason(state, context)).toContain("all three");
  });

  it("requires simultaneous fulfillment rather than remembering three separate live successes", () => {
    let state = ready(); state.clinicalXp = 1999;
    state = acknowledge(state, "m6.separate.1");
    state.clinicalXp = 2000; state.employees[0]!.morale = 84;
    state = acknowledge(state, "m6.separate.2");
    state.employees[0]!.morale = 85;
    setLevelFiveQaDisplayedSatisfaction(state, context, 90);
    state = acknowledge(state, "m6.separate.3");
    expect(unlock(state)).toBeNull();
    setLevelFiveQaDisplayedSatisfaction(state, context, 91);
    expect(unlock(acknowledge(state, "m6.separate.4"))).toBeTruthy();
  });

  it("uses the arithmetic mean of every employed member including busy staff, with clamping and ownership once", () => {
    const state = ready(), employee = state.employees[0]!;
    state.employees = [{ ...employee, morale: 80 }, { ...structuredClone(employee), id: "m6.other", morale: 90,
      facilityTask: { kind: "take_break", workMinutesRemaining: 20, startedAtFacilityTick: state.facilityTick } }];
    expect(getAverageEffectiveStaffMorale(state)).toBe(85);
    expect(unlock(acknowledge(state))).toMatchObject({ averageStaffMorale: 85, employedStaffCount: 2 });
    state.rooms.push({ id: "m6.office", roomDefinitionId: "room.founder_office", x: 1, y: 1,
      orientation: 0, doorSide: null, upgradeLevel: 5 });
    state.employees[0]!.morale = 75; state.employees[1]!.morale = 99;
    expect(getAverageEffectiveStaffMorale(state)).toBe((85 + 100) / 2);
    expect(unlock(acknowledge(state, "m6.ownership"))).toMatchObject({ averageStaffMorale: 92.5 });
    expect(state.employees.map(employee => employee.morale)).toEqual([75, 99]);
  });

  it("counts a real paid trainee along with the rest of the workforce", () => {
    let state = createLevelFiveStateQaState("executive", context); state.paused = false;
    const id = state.employees.find(employee => employee.staffRoleDefinitionId === "staff.executive")!.id;
    for (let i = 0; i < 180 && !getEmployeeTrainingQuote(state, id, context).canTrain; i++)
      state = apply(state, { type: "ADVANCE_TICK", operationId: `m6.arrive.${i}` });
    state = apply(state, { type: "TRAIN_EMPLOYEE", employeeId: id, operationId: "m6.train" });
    expect(state.operationReceipts["m6.train"]?.status).toBe("applied");
    expect(state.employees.find(employee => employee.id === id)?.training).toBeTruthy();
    state.clinicalXp = 2000;
    for (const employee of state.employees) employee.morale = 83; // +2 owned Founder Office = 85.
    expect(unlock(acknowledge(state))).toMatchObject({ averageStaffMorale: 85, employedStaffCount: state.employees.length });
  });

  it("keeps the unlock, original evidence and one notice through decline, removal, retirement and repeated reload/commands", () => {
    let state = acknowledge(ready()); const earned = structuredClone(unlock(state));
    const first = state;
    expect(acknowledge(state)).toBe(first);
    state.employees = []; setLevelFiveQaDisplayedSatisfaction(state, context, 70);
    for (let i = 0; i < 3; i++) {
      state = deserializeGameState(serializeGameState(state), context);
      state = acknowledge(state, `m6.reload.${i}`);
      expect(unlock(state)).toEqual(earned);
      expect(state.levelFive!.inspection.status).toBe("ready");
      expect(state.levelFive!.progress.gameFinished).toBeNull();
      expect(state.events.filter(event => event.id === LEVEL_FIVE_INSPECTION_UNLOCK_EVENT_ID)).toHaveLength(1);
      expect(state.clinicalXp).toBe(2000);
      expect(getInspectionBookingBlockedReason(state, context)).toBeNull();
    }
    state.events = []; state.encounters = {}; state.serviceOperations = []; state.serviceIncomeReceipts = [];
    state = acknowledge(deserializeGameState(serializeGameState(state), context), "m6.retired");
    expect(unlock(state)).toEqual(earned);
    expect(state.events.some(event => event.id === LEVEL_FIVE_INSPECTION_UNLOCK_EVENT_ID)).toBe(false);
  });

  it("earns the record at the first individual fast-forward tick even if satisfaction falls later in the batch", () => {
    const state = ready(); state.paused = false;
    state.environment.nextLitterSpawnTick = state.facilityTick + 2;
    state.environment.nextWaterCoolerDrainTick = state.facilityTick + 2;
    const next = apply(state, { type: "DEV_FAST_FORWARD", tickCount: 100, operationId: "m6.fast" });
    expect(unlock(next)?.earnedAtFacilityTick).toBe(state.facilityTick + 1);
    expect(next.clinicalXp).toBe(2000);
    expect(next.events.filter(event => event.id === LEVEL_FIVE_INSPECTION_UNLOCK_EVENT_ID)).toHaveLength(1);
  });

  it("earns normal 10/2 first-answer XP and unlocks on the real accepted answer without a second reward", () => {
    let state = createLevelFiveStateQaState("goals", context); state.paused = false;
    for (let i = 0; i < 160 && state.encounters[LEVEL_FIVE_GOALS_QA_ENCOUNTER_ID]!.checkInStatus !== "checked_in"; i++)
      state = apply(state, { type: "ADVANCE_TICK", operationId: `m6.chart.arrival.${i}` });
    state = apply(state, { type: "OPEN_CHART", encounterId: LEVEL_FIVE_GOALS_QA_ENCOUNTER_ID, operationId: "m6.chart.open" });
    for (let i = 0; i < 160 && state.encounters[LEVEL_FIVE_GOALS_QA_ENCOUNTER_ID]!.patientMovement; i++)
      state = apply(state, { type: "ADVANCE_TICK", operationId: `m6.chart.care.${i}` });
    const question = getCurrentQuestion(state, LEVEL_FIVE_GOALS_QA_ENCOUNTER_ID, context)!;
    const answer = { type: "SUBMIT_ANSWER" as const, encounterId: LEVEL_FIVE_GOALS_QA_ENCOUNTER_ID,
      decisionNodeId: question.node.id, answerChoiceId: question.node.answerChoices.find(choice => choice.isCorrect)!.id, operationId: "m6.chart.answer" };
    const before = state;
    const correct = apply(before, answer);
    const wrong = apply(before, { ...answer, answerChoiceId: question.node.answerChoices.find(choice => !choice.isCorrect)!.id, operationId: "m6.chart.wrong" });
    expect(correct.clinicalXp).toBe(2000); expect(unlock(correct)).toBeTruthy();
    expect(wrong.clinicalXp).toBe(1992); expect(unlock(wrong)).toBeNull();
    expect(apply(correct, answer)).toBe(correct);
    expect(correct.levelFive!.progress.gameFinished).toBeNull();
  });
});

describe("Ordinary Level 4 advance and compatibility", () => {
  it.each([5, 9])("loads an acknowledged old schema-%i Level 4 save unchanged and advances once under shipped cap 5", schemaVersion => {
    const old = createLevelFourReadyForFiveQaState(context);
    const raw = JSON.parse(serializeGameState(old)); raw.schemaVersion = schemaVersion;
    const loaded = deserializeGameState(JSON.stringify(raw), context);
    expect(loaded).toEqual(deserializeGameState(JSON.stringify(raw), PROTOTYPE_DOMAIN_CONTEXT));
    expect(loaded).not.toHaveProperty("levelFive");
    expect(getFacilityProgressionStatus(loaded, context)).toMatchObject({ eligible: true, nextFacilityLevel: 5, terminalComplete: false });
    expect(getFacilityProgressionStatus(loaded)).toMatchObject({ eligible: true, nextFacilityLevel: 5, terminalComplete: false });
    expect(getFacilityProgressionStatus(loaded, createPreLevelFiveLaunchContext())).toMatchObject({ eligible: false, nextFacilityLevel: null, terminalComplete: true });
    const next = apply(loaded, { type: "LEVEL_UP", operationId: "m6.advance" });
    expect(next.facilityLevel).toBe(5); expect(next.clinicalXp).toBe(0);
    for (const key of ["cashCents", "rooms", "employees", "encounters", "learningHistories", "reviewIntents", "settlements", "serviceIncomeReceipts", "levelFourCompletion"] as const)
      expect(next[key], key).toEqual(loaded[key]);
    expect(next.levelFive!.inspection.status).toBe("locked"); expect(unlock(next)).toBeNull();
    expect(apply(next, { type: "LEVEL_UP", operationId: "m6.advance" })).toBe(next);
    const again = apply(deserializeGameState(serializeGameState(next), context), { type: "LEVEL_UP", operationId: "m6.again" });
    expect(again.operationReceipts["m6.again"]?.status).toBe("rejected");
    expect(again.clinicalXp).toBe(0); expect(again.facilityLevel).toBe(5);
    expect(again.events.filter(event => event.type === "facility_level_advanced" && event.id === "event.facility-level.5")).toHaveLength(1);
  });

  it.each(["xp", "satisfaction", "app", "pediatric", "wound"])("does not let historical acknowledgment bypass the live Level 4 %s goal", missing => {
    const state = createLevelFourReadyForFiveQaState(context);
    if (missing === "xp") state.clinicalXp = 749;
    if (missing === "satisfaction") setLevelFiveQaDisplayedSatisfaction(state, context, 90);
    if (missing === "app") state.employees = state.employees.filter(employee => employee.staffRoleDefinitionId !== "staff.app");
    if (missing === "pediatric") state.levelFourCompletion!.pediatricVisitWithParent = null;
    if (missing === "wound") state.levelFourCompletion!.woundOstomyCareVisit = null;
    const next = apply(state, { type: "LEVEL_UP", operationId: `m6.missing.${missing}` });
    expect(next.operationReceipts[`m6.missing.${missing}`]?.status).toBe("rejected");
    expect(next.facilityLevel).toBe(4); expect(next.clinicalXp).toBe(state.clinicalXp);
    expect(next.levelFourCompletion!.acknowledgedAtFacilityTick).toBe(0);
    expect(next).not.toHaveProperty("levelFive");
  });

  it("preserves legacy cap-4 rejection and prior saves with no fabricated Level 5 data or booking", () => {
    const state = createLevelFourReadyForFiveQaState(context);
    const capped = createPreLevelFiveLaunchContext();
    const rejected = gameReducer(state, { type: "LEVEL_UP", operationId: "m6.live-locked" }, capped);
    expect(rejected.facilityLevel).toBe(4); expect(rejected.clinicalXp).toBe(750);
    expect(rejected).not.toHaveProperty("levelFive");
    expect(PROTOTYPE_BALANCE_RELEASE.facility.maximumPlayableLevel).toBe(5);
    expect(getInspectionBookingBlockedReason(state)).toContain("Level 5");
    expect(() => deserializeGameState(serializeGameState(ready()), capped)).toThrow();
  });
});
