import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT, TUTORIAL_ENCOUNTER_ID, createInitialGameState, deserializeGameState, gameReducer, getDisplayedClinicSatisfaction, getEmployeeTrainingQuote, getFacilityProgressionStatus, getRoomSalePreview,
  serializeGameState, type GameState,
} from "../src";
import { createLevelFourAlmostQaState, createLevelThreeReadyQaState } from "../../../tests/fixtures/level-four-progression";

function finishWoundVisit(initial: GameState): GameState {
  let state = { ...initial, paused: false };
  for (let i = 0; i < 300 && !state.levelFourCompletion?.woundOstomyCareVisit; i++) {
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `l4.finish.${state.facilityTick}` });
  }
  expect(state.levelFourCompletion?.woundOstomyCareVisit).toBeTruthy();
  return state;
}

describe("Level 4 launch progression and old saves", () => {
  it.each([5, 9])("lets a mature schema-%i Level 3 save advance without replaying or rehiring", (schemaVersion) => {
    const raw = JSON.parse(serializeGameState(createLevelThreeReadyQaState()));
    raw.schemaVersion = schemaVersion;
    delete raw.levelFourCompletion;
    const restored = deserializeGameState(JSON.stringify(raw));
    expect(getFacilityProgressionStatus(restored)).toMatchObject({ eligible: true, nextFacilityLevel: 4, terminalComplete: false });
    const advanced = gameReducer(restored, { type: "LEVEL_UP", operationId: "l4.advance" });
    expect(advanced.facilityLevel).toBe(4);
    expect(advanced.clinicalXp).toBe(0);
    for (const key of ["cashCents", "rooms", "employees", "encounters", "settlements", "serviceIncomeReceipts", "learningHistories", "reviewIntents"] as const) {
      expect(advanced[key], key).toEqual(restored[key]);
    }
    expect(gameReducer(advanced, { type: "LEVEL_UP", operationId: "l4.advance" })).toBe(advanced);
    const reload = deserializeGameState(serializeGameState(advanced));
    expect(reload.facilityLevel).toBe(4);
    expect(reload.events.filter(event => event.type === "facility_level_advanced")).toHaveLength(1);
    expect(getFacilityProgressionStatus(reload).terminalComplete).toBe(false);
  });

  it.each(["xp", "satisfaction", "pharmacist", "operation"])("keeps a legacy Level 3 save below the %s gate at Level 3", (missing) => {
    const state = createLevelThreeReadyQaState();
    if (missing === "xp") state.clinicalXp = 499;
    if (missing === "satisfaction") for (const encounter of Object.values(state.encounters)) encounter.finalPatientSatisfaction = 90;
    if (missing === "pharmacist") state.employees = state.employees.filter(employee => employee.staffRoleDefinitionId !== "staff.pharmacist");
    if (missing === "operation") state.serviceIncomeReceipts = [];
    const restored = deserializeGameState(serializeGameState(state));
    expect(getFacilityProgressionStatus(restored).eligible).toBe(false);
    const rejected = gameReducer(restored, { type: "LEVEL_UP", operationId: `l4.missing.${missing}` });
    expect(rejected.facilityLevel).toBe(3);
    expect(rejected.clinicalXp).toBe(restored.clinicalXp);
    expect(rejected.operationReceipts[`l4.missing.${missing}`]?.status).toBe("rejected");
  });

  it("has exactly the five binding finish requirements, without MRI or Pediatric Waiting", () => {
    const state = createLevelFourAlmostQaState();
    expect(getDisplayedClinicSatisfaction(state)).toBeGreaterThan(90);
    expect(getFacilityProgressionStatus(state).requirements.map(row => row.id)).toEqual([
      "progression.clinical_xp", "progression.satisfaction", "progression.staff.staff.app",
      "progression.witness.pediatric_visit_with_parent", "progression.witness.wound_ostomy_care_visit",
    ]);
    expect(getFacilityProgressionStatus(state).requirements.filter(row => !row.met).map(row => row.id))
      .toEqual(["progression.witness.wound_ostomy_care_visit"]);
  });

  it.each(["unassigned", "incompatible", "inaccessible", "absent"])("does not credit a %s APP", (condition) => {
    const state = createLevelFourAlmostQaState();
    const app = state.employees.find(employee => employee.staffRoleDefinitionId === "staff.app")!;
    if (condition === "unassigned") app.homeRoomInstanceId = null;
    if (condition === "incompatible") app.homeRoomInstanceId = "room.instance.founder_desk";
    if (condition === "inaccessible") state.doors = state.doors.filter(door => door.roomId !== app.homeRoomInstanceId);
    if (condition === "absent") state.employees = [];
    expect(getFacilityProgressionStatus(state).requirements.find(row => row.id === "progression.staff.staff.app")?.met).toBe(false);
  });

  it("counts installed APP coverage during training and busy work", () => {
    let state = createLevelFourAlmostQaState();
    const appId = state.employees.find(employee => employee.staffRoleDefinitionId === "staff.app")!.id;
    state.paused = false;
    for (let i = 0; i < 100 && !getEmployeeTrainingQuote(state, appId).canTrain; i++) {
      state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `l4.training-arrival.${i}` });
    }
    const app = state.employees.find(employee => employee.id === appId)!;
    const training = gameReducer(state, { type: "TRAIN_EMPLOYEE", operationId: "l4.train", employeeId: app.id });
    expect(training.operationReceipts["l4.train"]?.status, training.operationReceipts["l4.train"]?.message).toBe("applied");
    expect(training.employees.find(employee => employee.id === appId)?.training).toBeTruthy();
    expect(getFacilityProgressionStatus(training).requirements.find(row => row.id === "progression.staff.staff.app")?.met).toBe(true);
  });

  it("uses strict displayed satisfaction and current-level XP", () => {
    const state = createLevelFourAlmostQaState();
    state.clinicalXp = 749;
    const ended = createInitialGameState().encounters[TUTORIAL_ENCOUNTER_ID]!;
    ended.lifecycle = "resolved"; ended.resolutionReason = "completed"; ended.resolvedAtFacilityTick = 0;
    ended.finalPatientSatisfaction = 90 + 100 - getDisplayedClinicSatisfaction(state);
    state.encounters = { [ended.id]: ended };
    expect(getDisplayedClinicSatisfaction(state)).toBe(90);
    expect(getFacilityProgressionStatus(state).requirements.slice(0, 2).every(row => !row.met)).toBe(true);
  });

  it("resumes a mid-Level-4 visit and earns terminal completion once, with no XP, FSRS, Level 5 or reward", () => {
    let state = createLevelFourAlmostQaState();
    state.paused = false;
    for (let i = 0; i < 25; i++) state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `l4.mid.${i}` });
    expect(state.levelFourCompletion?.woundOstomyCareVisit).toBeNull();
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.serviceOperations).toEqual(state.serviceOperations);
    expect(getFacilityProgressionStatus(restored).terminalComplete).toBe(false);
    state = finishWoundVisit(restored);
    expect(state.clinicalXp).toBe(750);
    expect(state.learningHistories).toEqual(restored.learningHistories);
    expect(state.reviewIntents).toEqual(restored.reviewIntents);
    expect(getFacilityProgressionStatus(state)).toMatchObject({ eligible: false, nextFacilityLevel: null, terminalComplete: true });
    const completed = state.events.filter(event => event.id === "event.facility-level-4-complete");
    expect(completed).toHaveLength(1);
    expect(completed[0]?.reward).toBeUndefined();
    const acknowledgement = state.levelFourCompletion!.acknowledgedAtFacilityTick;
    expect(acknowledgement).toBe(state.levelFourCompletion!.woundOstomyCareVisit!.completedAtFacilityTick);
    for (let i = 0; i < 3; i++) {
      state = deserializeGameState(serializeGameState(state));
      const cash = state.cashCents;
      state = gameReducer(state, { type: "LEVEL_UP", operationId: `l4.no-five.${i}` });
      expect(state.facilityLevel).toBe(4);
      expect(state.cashCents).toBe(cash);
      expect(state.levelFourCompletion!.acknowledgedAtFacilityTick).toBe(acknowledgement);
      expect(state.events.filter(event => event.id === "event.facility-level-4-complete")).toHaveLength(1);
    }
    state.paused = true;
    const woundRoomId = state.rooms.find(room => room.roomDefinitionId === "room.wound_ostomy")!.id;
    const sale = getRoomSalePreview(state, woundRoomId, PROTOTYPE_DOMAIN_CONTEXT)!;
    state = gameReducer(state, { type: "SELL_ROOM", operationId: "l4.completed.sale", roomId: woundRoomId, saleConfirmationToken: sale.confirmationToken });
    expect(state.operationReceipts["l4.completed.sale"]?.status).toBe("applied");
    expect(getFacilityProgressionStatus(state).requirements.find(row => row.id === "progression.staff.staff.app")?.met).toBe(false);
    expect(getFacilityProgressionStatus(state).requirements.filter(row => row.id.startsWith("progression.witness.")).every(row => row.met)).toBe(true);
    // History, actors and sold departments may disappear; earned witnesses remain.
    state.serviceOperations = []; state.serviceIncomeReceipts = []; state.retailExternalActors = [];
    state.pediatricFamilies = {}; state.employees = [];
    state.rooms = state.rooms.filter(room => !["room.wound_ostomy", "room.pediatric_examination", "room.pediatric_waiting"].includes(room.roomDefinitionId));
    state.doors = state.doors.filter(door => state.rooms.some(room => room.id === door.roomId));
    state = deserializeGameState(serializeGameState(state));
    expect(getFacilityProgressionStatus(state).terminalComplete).toBe(true);
    expect(getFacilityProgressionStatus(state).requirements.filter(row => row.id.startsWith("progression.witness.")).every(row => row.met)).toBe(true);
  });
});
