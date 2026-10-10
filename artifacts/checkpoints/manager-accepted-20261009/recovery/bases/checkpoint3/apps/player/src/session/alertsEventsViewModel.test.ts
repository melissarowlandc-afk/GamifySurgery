import { describe, expect, it } from "vitest";
import {
  TUTORIAL_ENCOUNTER_ID, createInitialGameState, deserializeGameState, gameReducer,
  getRoomDefinition, isRoomOperationalForFacilityWork, serializeGameState,
  synchronizeFacilityOperationalAlertOccurrences,
  type DiagnosticOrderPlan, type GameState, type PendingResult,
} from "@gamify-surgery/game-domain";
import { createClinicFeedView, createNeedsYouView } from "./alertsEventsViewModel";

function patient(state: GameState) {
  const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
  encounter.patientMovement = null;
  encounter.patientLocation = { x: 34, y: 29 };
  encounter.checkInStatus = "checked_in";
  encounter.waiting.patienceExempt = false;
  encounter.idleWaitingSinceTick = 1;
  encounter.departureRiskWarningAtTick = 12;
  encounter.patientSatisfaction = encounter.walkoutThreshold + 5;
  return encounter;
}

function addConnectedRoom(state: GameState, definitionId: string) {
  const definition = getRoomDefinition(definitionId)!;
  const id = `test.${definitionId}`;
  state.rooms.push({ id, roomDefinitionId: definitionId, x: 32 - definition.width, y: 20,
    orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  state.rooms.push(...Array.from({ length: 9 }, (_, index) => ({ id: `hall.${index}`, roomDefinitionId: "room.hallway", x: 32, y: 20 + index, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })));
  state.doors.push({ id: "test.desk.west", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
    { id: "test.room.east", roomId: id, side: "east", offset: 1, exterior: false });
  expect(isRoomOperationalForFacilityWork(state, id)).toBe(true);
  return id;
}

function localPlan(encounterId: string): DiagnosticOrderPlan {
  return {
    version: "diagnostic-order.v1", timingVersion: "diagnostic-timing.v1", orderId: "accepted.order", encounterId,
    createdAtTick: 10, execution: "supported", sources: [],
    phases: [{ id: "acquire", componentId: null, kind: "acquisition", mode: "local", patientPresent: true,
      durationMinutes: 5, dependsOn: [], requirement: { roomDefinitionId: "room.xray", staffRoleDefinitionIds: ["staff.imaging_technician"], providerRoleDefinitionIds: [], founderEligible: false, stationKind: null },
      resource: null, forecast: { readyAtTick: 10, startsAtTick: 10, endsAtTick: 15, queueMinutes: 0, walkingMinutes: 0, patientPath: [], employeePaths: [], founderPath: [], tilesPerTick: 2 },
      status: "queued", remainingMinutes: 5, startedAtTick: null, completedAtTick: null, serviceOperationId: null, operationPhaseId: null }],
    resultReady: { afterPhaseIds: ["acquire"], forecastAtTick: 15, reachedAtTick: null },
    visualResultReady: null, careComplete: { afterPhaseIds: ["acquire"], forecastAtTick: 15, reachedAtTick: null },
  };
}

describe("Alerts & Events admission and history", () => {
  it("supersedes low cash with zero cash without a false Handled row, then handles genuine recovery once", () => {
    const state = createInitialGameState(); state.cash = 60; state.cashCents = 6000;
    synchronizeFacilityOperationalAlertOccurrences(state);
    state.facilityTick = 10; state.cash = 0; state.cashCents = 0;
    synchronizeFacilityOperationalAlertOccurrences(state);
    const feed = () => createClinicFeedView(state);
    expect(feed().filter((row) => row.speaker === "Finance")).toHaveLength(1);
    expect(feed().some((row) => row.rowKind === "resolved")).toBe(false);
    expect(feed().find((row) => row.speaker === "Finance")!.message).toContain("at zero");
    state.environment.facilityConditionOccurrences[0]!.resolvedAtFacilityTick = 10;
    expect(feed().some((row) => row.rowKind === "resolved")).toBe(false);
    state.facilityTick = 20; state.cash = 200; state.cashCents = 20000;
    synchronizeFacilityOperationalAlertOccurrences(state);
    expect(feed().filter((row) => row.rowKind === "resolved")).toHaveLength(1);
  });
  it("shows only the daily reminder while cash remains low, including legacy renewal-as-resolution history", () => {
    const state = createInitialGameState(); state.cash = 60; state.cashCents = 6000;
    synchronizeFacilityOperationalAlertOccurrences(state);
    state.facilityTick = 600;
    synchronizeFacilityOperationalAlertOccurrences(state);
    const cashRows = () => createClinicFeedView(state).filter((row) => row.speaker === "Finance");
    expect(cashRows()).toHaveLength(1);
    expect(cashRows()[0]).toMatchObject({ rowKind: "event", message: "Cash is low." });
    expect(cashRows()[0]!.timeLabel).toContain("Day 2");
    state.environment.facilityConditionOccurrences[0]!.resolvedAtFacilityTick = 600;
    state.environment.facilityConditionOccurrences[0]!.target = { id: "emergency-glp1", kind: "emergency_glp1" };
    expect(cashRows()).toHaveLength(1);
    expect(createClinicFeedView(state).some((row) => row.rowKind === "resolved")).toBe(false);
    state.facilityTick = 601; state.cash = 200; state.cashCents = 20000;
    synchronizeFacilityOperationalAlertOccurrences(state);
    const handled = createClinicFeedView(state).filter((row) => row.rowKind === "resolved");
    expect(handled).toHaveLength(1); expect(handled[0]!.speaker).toBe("Handled");
  });
  it("attributes current conditions to their source and leaves instructions on the one-click buttons", () => {
    const state = createInitialGameState(); state.facilityTick = 61;
    delete state.alertHumor.guidanceTips; // Legacy conditions retain their original presentation.
    state.environment.waterCoolerFillPercent = 0;
    state.environment.litterItems.push({ id: "litter", roomId: state.rooms[0]!.id, location: { x: 34, y: 30 }, spawnedAtFacilityTick: 0 });
    state.environment.facilityConditionOccurrences.push(
      { id: "water", conditionKey: "empty_water_cooler", kind: "onset", occurredAtFacilityTick: 61, resolvedAtFacilityTick: null, definitionId: "alert.environment.water-empty", message: "The water cooler is empty. It is now a large blue vase. Refill it.", priority: "action_required", target: { kind: "water_cooler", id: "water-cooler.front-desk" } },
      { id: "trash", conditionKey: "visible_litter", kind: "onset", occurredAtFacilityTick: 61, resolvedAtFacilityTick: null, definitionId: "alert.environment.trash-visible", message: "The floor has acquired a backstory. Select the trash to send the founder to clean it.", priority: "action_required", target: { kind: "litter", id: "litter" } },
    );
    const feed = createClinicFeedView(state);
    expect(feed.find((row) => row.id === "water")).toMatchObject({ speaker: "Water cooler", message: "The water cooler is empty. It is now a large blue vase.", actionLabel: "Send founder to refill" });
    expect(feed.find((row) => row.id === "trash")).toMatchObject({ speaker: "Housekeeping", message: "The floor has acquired a backstory.", actionLabel: "Send founder to clean" });
  });
  it("does not admit optional setup, goals, low cash, water or trash", () => {
    const state = createInitialGameState();
    state.facilityLevel = 3;
    state.cash = 0; state.cashCents = 0;
    state.environment.waterCoolerFillPercent = 0;
    state.environment.waterCoolerEmptySinceTick = 0;
    state.environment.litterItems.push({ id: "litter", roomId: state.rooms[0]!.id, location: { x: 34, y: 30 }, spawnedAtFacilityTick: 0 });
    state.rooms.push({ ...state.rooms[0]!, id: "idle.endoscopy", roomDefinitionId: "room.endoscopy", x: 10, y: 10 });
    expect(createNeedsYouView(state)).toEqual([]);
  });

  it("uses the exact live patient predicate and preserves the saved warning onset", () => {
    const state = createInitialGameState();
    state.facilityTick = 50;
    const encounter = patient(state);
    const card = createNeedsYouView(state)[0]!;
    expect(card).toMatchObject({ id: `need.patient.${encounter.id}`, sortKey: 12, action: { kind: "open_chart", encounterId: encounter.id } });
    expect(card.deadline).toBeUndefined();
    state.facilityTick = 51;
    expect(createNeedsYouView(state)[0]?.sortKey).toBe(12);
    state.openChartEncounterId = encounter.id;
    expect(createNeedsYouView(state)).toEqual([]);
    state.openChartEncounterId = null;
    encounter.patientSatisfaction = encounter.walkoutThreshold + 11;
    expect(createNeedsYouView(state)).toEqual([]);
  });

  it("orders separate at-risk patients by their actual satisfaction margin", () => {
    const state = createInitialGameState();
    const first = patient(state);
    state.encounters.second = { ...first, id: "second", patientDisplayName: "Second", patientSatisfaction: first.walkoutThreshold + 1 };
    expect(createNeedsYouView(state).map((card) => card.pin?.id)).toEqual(["second", first.id]);
  });

  it("merges employee warnings into one posting card with the real cash gap and deadline", () => {
    let state = createInitialGameState();
    state.facilityLevel = 1; state.cash = 10_000; state.cashCents = 1_000_000;
    state = gameReducer(state, { type: "HIRE_STAFF", operationId: "hire", staffRoleDefinitionId: "staff.receptionist", employeeId: "receptionist" });
    expect(state.operationReceipts.hire?.status).toBe("applied");
    state.facilityTick = 10; state.nextFinancialPostingTick = 15; state.cash = 0; state.cashCents = 0;
    state.employees[0]!.morale = 12;
    const cards = createNeedsYouView(state);
    expect(cards).toHaveLength(1);
    expect(cards[0]).toMatchObject({ id: "need.finance.payroll", targetType: "money", action: { kind: "emergency_consult" }, deadline: { minutesLeft: 5, windowMinutes: 15 } });
    expect(cards[0]!.why).toContain("$2.00 is missing");
    expect(cards[0]!.why).toContain(state.employees[0]!.displayName);
    state.cash = 2; state.cashCents = 200;
    expect(createNeedsYouView(state)).toEqual([]);
  });

  it("withholds payroll cards with no eligible funding control", () => {
    let state = createInitialGameState();
    state.facilityLevel = 1; state.cash = 10_000; state.cashCents = 1_000_000;
    state = gameReducer(state, { type: "HIRE_STAFF", operationId: "hire", staffRoleDefinitionId: "staff.receptionist", employeeId: "receptionist" });
    state.cash = 0; state.cashCents = 0;
    state.emergencyGlp1.lastUsedAtFacilityTick = state.facilityTick;
    expect(createNeedsYouView(state)).toEqual([]);
  });

  it("admits a present accepted local phase with its missing legal staff remedy", () => {
    const state = createInitialGameState();
    state.facilityLevel = 2; state.facilityTick = 20; state.cash = 5_000; state.cashCents = 500_000;
    addConnectedRoom(state, "room.xray");
    const encounter = patient(state);
    encounter.lifecycle = "active_pending_result";
    encounter.pendingResult = { diagnosticTiming: localPlan(encounter.id) } as PendingResult;
    expect(createNeedsYouView(state)[0]).toMatchObject({ kind: "resource", action: { kind: "hire_staff", roleId: "staff.imaging_technician" } });
    expect(createNeedsYouView(state)[0]?.actionLabel).toContain("$300.00");
    state.cash = 1; state.cashCents = 100;
    expect(createNeedsYouView(state)).toEqual([]);
  });

  it.each(["external", "dependency", "scheduled", "away"])("does not admit %s accepted work", (reason) => {
    const state = createInitialGameState();
    state.facilityLevel = 2; state.facilityTick = 20; state.cash = 5_000; state.cashCents = 500_000;
    const encounter = patient(state);
    encounter.lifecycle = "active_pending_result";
    const plan = localPlan(encounter.id);
    if (reason === "external") plan.phases[0]!.mode = "external";
    if (reason === "dependency") plan.phases[0]!.dependsOn = ["not-completed"];
    if (reason === "scheduled") plan.phases[0]!.forecast.readyAtTick = 100;
    if (reason === "away") encounter.patientLocation = null;
    encounter.pendingResult = { diagnosticTiming: plan } as PendingResult;
    expect(createNeedsYouView(state)).toEqual([]);
  });

  it("attributes humor and removes actions/markers from historical patient risk and milestones", () => {
    const state = createInitialGameState();
    state.events = [
      { id: "joke", type: "ambient_message", facilityTick: 12, encounterId: null, message: "The printer has opinions.", priority: "flavor" },
      { id: "risk", type: "patience_warning", definitionId: "alert.patient.departure-risk", facilityTick: 11, encounterId: TUTORIAL_ENCOUNTER_ID, message: "Open chart now.", priority: "critical", alertCategory: "action_required" },
      { id: "level", type: "facility_level_advanced", facilityTick: 13, encounterId: null, message: "Facility advanced to Level 1.", priority: "action_required", alertCategory: "action_required" },
    ];
    const feed = createClinicFeedView(state);
    expect(feed.find((item) => item.id === "joke")).toMatchObject({ rowKind: "humor", speaker: "Printer" });
    expect(feed.find((item) => item.id === "risk")).toMatchObject({ rowKind: "resolved", showAttentionMarker: false, actionLabel: undefined });
    expect(feed.find((item) => item.id === "risk")?.message).not.toContain("Open chart now");
    expect(feed.find((item) => item.id === "level")).toMatchObject({ rowKind: "milestone", showAttentionMarker: false });
  });

  it("renders one stable day divider from its persisted snapshot and handles old rollovers honestly", () => {
    const state = createInitialGameState();
    state.events = [{ id: "event.day-rollover.2", type: "day_rollover", facilityTick: 600, encounterId: null, message: "Day 2 begins.",
      clinicDaySummary: { dayNumber: 1, patientsSeen: 11, moneyEarnedCents: 124000, satisfactionPercent: 82, reviewLine: "I was seen by three magazines and zero clinicians.", completedTotal: 11, earnedTotalCents: 124000 } },
      { id: "old.rollover", type: "day_rollover", facilityTick: 1200, encounterId: null, message: "Day 3 begins." }];
    const restored = deserializeGameState(serializeGameState(state));
    const feed = createClinicFeedView(restored);
    expect(feed.find((item) => item.id === "event.day-rollover.2")).toMatchObject({ rowKind: "day_summary", daySummary: { patientsSeen: 11, moneyEarnedLabel: "$1,240.00", satisfactionLabel: "82%" } });
    expect(feed.find((item) => item.id === "old.rollover")?.message).toContain("older save did not record");
  });
  it("suppresses an old live cooler warning after usable receptionist coverage is installed", () => {
    let state = createInitialGameState(); state.facilityLevel = 1; state.cash = 5000; state.cashCents = 500000;
    delete state.alertHumor.guidanceTips;
    state.environment.waterCoolerFillPercent = 0;
    state.environment.facilityConditionOccurrences.push({ id: "water.warning", conditionKey: "empty_water_cooler", kind: "onset", occurredAtFacilityTick: 61, resolvedAtFacilityTick: null,
      definitionId: "alert.environment.water-empty", message: "The cooler is empty.", priority: "action_required", target: { kind: "water_cooler", id: "water-cooler.front-desk" } });
    expect(createClinicFeedView(state).find((row) => row.id === "water.warning")?.action?.kind).toBe("refill_water");
    state = gameReducer(state, { type: "HIRE_STAFF", operationId: "hire.water", employeeId: "water.coverage", staffRoleDefinitionId: "staff.receptionist" });
    state.employees[0]!.facilityTask = { kind: "take_break", startedAtFacilityTick: 0, workMinutesRemaining: 10 };
    expect(createClinicFeedView(state).some((row) => row.id === "water.warning")).toBe(false);
    expect(createNeedsYouView(state)).toEqual([]);
  });
  it("names the room and quotes its next upgrade; historical resolution is past tense", () => {
    const state = createInitialGameState(); state.facilityLevel = 3; state.cash = 5000; state.cashCents = 500000;
    delete state.alertHumor.guidanceTips;
    const roomId = addConnectedRoom(state, "room.examination");
    state.environment.facilityConditionOccurrences.push({ id: "room.upgrade", conditionKey: "room_upgrade_requested", kind: "onset", occurredAtFacilityTick: 60, resolvedAtFacilityTick: null,
      definitionId: "alert.patient.room-upgrade-requested", message: "An upgrade was requested.", priority: "informational", target: { kind: "room", id: roomId } });
    const row = createClinicFeedView(state).find((item) => item.id === "room.upgrade")!;
    expect(row.message).toContain("Examination Room");
    expect(row.action).toEqual({ kind: "upgrade_room", roomId, expectedCost: 90 });
    expect(row.actionLabel).toContain("$90.00");
    state.environment.facilityConditionOccurrences[0]!.resolvedAtFacilityTick = 75;
    const resolved = createClinicFeedView(state).find((item) => item.id === "room.upgrade")!;
    expect(resolved.message).toContain("was resolved"); expect(resolved.sortKey).toBe(75); expect(resolved.action).toBeUndefined();
  });
  it("removes team-answer receipts and employee-navigation links from old quit events", () => {
    const state = createInitialGameState(); state.events = [
      { id: "answer", type: "employee_discussion_decision", facilityTick: 10, encounterId: null, message: "Decision recorded.", target: { kind: "employee", id: "old.employee" } },
      { id: "quit", type: "staff_quit", facilityTick: 11, encounterId: null, message: "Morgan quit.", priority: "critical", target: { kind: "employee", id: "old.employee" } },
    ];
    const feed = createClinicFeedView(state);
    expect(feed.some((row) => row.id === "answer")).toBe(false);
    expect(feed.find((row) => row.id === "quit")).toMatchObject({ rowKind: "resolved", actionLabel: undefined, showAttentionMarker: false });
  });
  it("keeps setup timestamps stable at Level 3 and preserves the requested construction definition", () => {
    const state = createInitialGameState(); state.facilityLevel = 3; state.facilityTick = 100; state.cash = 5000; state.cashCents = 500000;
    delete state.alertHumor.guidanceTips;
    addConnectedRoom(state, "room.examination");
    const roomId = "setup.endoscopy";
    state.rooms.push({ id: roomId, roomDefinitionId: "room.endoscopy", x: 10, y: 10, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    state.events.push({ id: "built", type: "room_placed", facilityTick: 50, encounterId: null, message: "Built Endoscopy", target: { kind: "room", id: roomId } });
    const before = createClinicFeedView(state).find((row) => row.id === "persistent.alert.facility.endoscopy-inoperable")!;
    expect(before).toBeDefined(); expect(before.action).toMatchObject({ kind: "place_room", definitionId: "room.periop_recovery" });
    state.facilityTick = 101;
    const after = createClinicFeedView(state).find((row) => row.id === before.id)!;
    expect(after.sortKey).toBe(before.sortKey); expect(after.timeLabel).toBe(before.timeLabel);
  });
  it("places same-tick morning news after the preceding end-of-day divider", () => {
    const state = createInitialGameState(); state.events = [
      { id: "rollover", type: "day_rollover", facilityTick: 600, encounterId: null, message: "Day 2 begins." },
      { id: "morning", type: "ambient_message", facilityTick: 600, encounterId: null, message: "The printer awoke.", priority: "flavor" },
    ];
    const feed = createClinicFeedView(state);
    expect(feed.findIndex((row) => row.id === "rollover")).toBeLessThan(feed.findIndex((row) => row.id === "morning"));
  });
});
