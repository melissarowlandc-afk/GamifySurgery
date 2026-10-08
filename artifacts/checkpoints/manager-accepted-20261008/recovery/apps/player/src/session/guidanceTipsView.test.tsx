import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { GUIDANCE_TIP_CATALOG } from "@gamify-surgery/balance-config";
import {
  advanceGuidanceTips, createInitialGameState, deserializeGameState, serializeGameState,
  evaluateGuidanceTipCandidates, gameReducer, getRoomDefinition, isRoomOperationalForFacilityWork,
  synchronizeFacilityConditionOccurrences,
  TUTORIAL_ENCOUNTER_ID, SECOND_TUTORIAL_ENCOUNTER_ID,
} from "@gamify-surgery/game-domain";
import { createClinicFeedView, createNeedsYouView } from "./alertsEventsViewModel";
import { getClinicAlertActionProblem } from "./clinicAlertActions";
import { EventMessageBoard } from "../ui/EventMessageBoard";

function waterTip() {
  const state = createInitialGameState();
  state.facilityLevel = 1; state.cash = 5000; state.cashCents = 500000;
  state.openChartEncounterId = null; state.environment.founderActivity = null;
  for (const id of [TUTORIAL_ENCOUNTER_ID, SECOND_TUTORIAL_ENCOUNTER_ID]) {
    state.encounters[id] = { ...structuredClone(state.encounters[TUTORIAL_ENCOUNTER_ID]!), id,
      lifecycle: "resolved", resolutionReason: "completed", resolvedAtFacilityTick: 0,
      patientLocation: null, patientMovement: null, pendingResult: null };
  }
  state.environment.waterCoolerFillPercent = 0; state.environment.waterCoolerEmptySinceTick = 0;
  state.environment.facilityConditionOccurrences.push({ id: "old.water", conditionKey: "empty_water_cooler",
    kind: "onset", occurredAtFacilityTick: 61, resolvedAtFacilityTick: null,
    definitionId: "alert.environment.water-empty", message: "The cooler is empty.", priority: "action_required",
    target: { kind: "water_cooler", id: "water-cooler.front-desk" } });
  state.facilityTick = 200; expect(advanceGuidanceTips(state)).toBe(false);
  state.facilityTick = 260; expect(advanceGuidanceTips(state)).toBe(true);
  return state;
}

function progressionClinic() {
  const state = createInitialGameState();
  state.cash = 5000; state.cashCents = 500000; state.clinicalXp = 0; state.facilityTick = 200;
  state.openChartEncounterId = null; state.environment.founderActivity = null;
  for (const id of [TUTORIAL_ENCOUNTER_ID, SECOND_TUTORIAL_ENCOUNTER_ID]) state.encounters[id] = {
    ...structuredClone(state.encounters[TUTORIAL_ENCOUNTER_ID]!), id, lifecycle: "resolved", resolutionReason: "completed",
    resolvedAtFacilityTick: 0, finalPatientSatisfaction: 80, patientLocation: null, patientMovement: null, pendingResult: null,
  };
  return state;
}

function addProgressionRoom(state: ReturnType<typeof createInitialGameState>, definitionId: string, y: number) {
  const definition = getRoomDefinition(definitionId)!; const id = `test.${definitionId}`;
  state.rooms.push({ id, roomDefinitionId: definitionId, x: 32 - definition.width, y,
    orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  for (let row = y; row < 29; row++) if (!state.rooms.some((room) => room.roomDefinitionId === "room.hallway" && room.x === 32 && room.y === row))
    state.rooms.push({ id: `test.hall.${row}`, roomDefinitionId: "room.hallway", x: 32, y: row, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  if (!state.doors.some((door) => door.id === "test.desk.west"))
    state.doors.push({ id: "test.desk.west", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false });
  state.doors.push({ id: `test.door.${definitionId}`, roomId: id, side: "east", offset: 1, exterior: false });
  expect(isRoomOperationalForFacilityWork(state, id)).toBe(true);
}

describe("guidance tips in Around the clinic", () => {
  it("preserves the first required Examination Room tutorial guidance before introductory tip delivery unlocks", () => {
    const state = createInitialGameState();
    state.facilityTick = 60;
    state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID] = { ...structuredClone(state.encounters[TUTORIAL_ENCOUNTER_ID]!),
      id: SECOND_TUTORIAL_ENCOUNTER_ID, lifecycle: "resolved", resolutionReason: "completed", resolvedAtFacilityTick: 60 };
    synchronizeFacilityConditionOccurrences(state);
    const occurrence = state.environment.facilityConditionOccurrences.find((item) => item.conditionKey === "missing_examination_room")!;
    expect(occurrence).toBeDefined();
    const row = createClinicFeedView(state).find((item) => item.id === occurrence.id);
    expect(row).toBeDefined(); expect(row!.rowKind).not.toBe("tip");
  });
  it("keeps the exact Level-0 Place remedy visible after the gate and suppresses duplicate T38 delivery", () => {
    const state = progressionClinic(); synchronizeFacilityConditionOccurrences(state);
    const occurrence = state.environment.facilityConditionOccurrences.find((item) => item.conditionKey === "missing_examination_room")!;
    const row = createClinicFeedView(state).find((item) => item.id === occurrence.id)!;
    expect(row).toMatchObject({ rowKind: "event", action: { kind: "place_room", definitionId: "room.examination" } });
    expect(row.actionLabel).toContain(`$${getRoomDefinition("room.examination")!.constructionCost.toFixed(2)}`);
    expect(evaluateGuidanceTipCandidates(state).some((tip) => tip.id === "tip.progression.next-step")).toBe(false);
    advanceGuidanceTips(state); state.facilityTick += 60; advanceGuidanceTips(state);
    expect(state.alertHumor.guidanceTips!.history.some((tip) => tip.tipId === "tip.progression.next-step")).toBe(false);
    const markup = renderToStaticMarkup(<EventMessageBoard items={createClinicFeedView(state)} needsYou={[]} onAction={vi.fn()} />);
    expect(markup).toContain("Place Examination Room");
    expect(markup).not.toContain("Review Goals");
  });
  it("renders T38 from Goals with the concrete room button and removes that action when a condition takes over", () => {
    const state = progressionClinic();
    advanceGuidanceTips(state); state.facilityTick += 60; expect(advanceGuidanceTips(state)).toBe(true);
    const row = createClinicFeedView(state).find((item) => item.rowKind === "tip")!;
    expect(row).toMatchObject({ speaker: "Goals", action: { kind: "place_room", definitionId: "room.examination" } });
    expect(row.actionLabel).toContain(`$${getRoomDefinition("room.examination")!.constructionCost.toFixed(2)}`);
    const markup = renderToStaticMarkup(<EventMessageBoard items={[row]} needsYou={[]} onAction={vi.fn()} />);
    expect(markup).toContain("Goals"); expect(markup).toContain("Place Examination Room");
    expect(markup).not.toMatch(/Review Goals|Open Goals|finish Build/);
    synchronizeFacilityConditionOccurrences(state);
    const historical = createClinicFeedView(state).find((item) => item.id === row.id)!;
    expect(historical).toMatchObject({ message: row.message, sortKey: row.sortKey, speaker: "Goals" });
    expect(historical.action).toBeUndefined();
    expect(getClinicAlertActionProblem(state, row.action!)).toContain("no longer applies");
  });
  it("renders an actual metric-only T38 with its remaining XP and no navigation button", () => {
    let state = progressionClinic(); state.facilityLevel = 1;
    addProgressionRoom(state, "room.ultrasound", 20); addProgressionRoom(state, "room.minor_procedure", 12);
    state = gameReducer(state, { type: "HIRE_STAFF", operationId: "test.t38.hire", employeeId: "test.tech", staffRoleDefinitionId: "staff.imaging_technician" });
    expect(state.operationReceipts["test.t38.hire"]?.status).toBe("applied");
    const candidate = evaluateGuidanceTipCandidates(state).find((tip) => tip.id === "tip.progression.next-step")!;
    expect(candidate.targetKey).toBe("progression.clinical_xp"); expect(candidate.action).toBeUndefined();
    advanceGuidanceTips(state); state.facilityTick += 60; expect(advanceGuidanceTips(state)).toBe(true);
    const row = createClinicFeedView(state).find((item) => item.rowKind === "tip")!;
    expect(row.speaker).toBe("Goals"); expect(row.message).toContain(candidate.values.guidance);
    expect(row.action).toBeUndefined(); expect(row.actionLabel).toBeUndefined();
    expect(getClinicAlertActionProblem(state, { kind: "show_goals", tip: { id: candidate.id, targetKey: candidate.targetKey } })).toContain("no longer applies");
    const markup = renderToStaticMarkup(<EventMessageBoard items={[row]} needsYou={[]} onAction={vi.fn()} />);
    expect(markup).toContain("Clinical XP"); expect(markup).not.toMatch(/<button|Review Goals|Open Goals/);
  });
  it("renders the approved copy, speaker, time and action as an ordinary Tip, with no complaint, card or pin", () => {
    const state = waterTip(); const feed = createClinicFeedView(state);
    const row = feed.find((item) => item.rowKind === "tip")!;
    expect(row).toMatchObject({ message: GUIDANCE_TIP_CATALOG.find((tip) => tip.id === "tip.water.manual")!.variants[0],
      speaker: "Water cooler", sortKey: 260, showAttentionMarker: false,
      action: { kind: "refill_water", tip: { id: "tip.water.manual", targetKey: "water" } } });
    expect(row.actionLabel).toBe("Send founder to refill");
    expect(feed.some((item) => item.id === "old.water")).toBe(false);
    expect(createNeedsYouView(state)).toEqual([]);
    expect(getClinicAlertActionProblem(state, row.action!)).toBeNull();
    const action = vi.fn();
    const markup = renderToStaticMarkup(<EventMessageBoard items={feed} needsYou={[]} onAction={action} />);
    expect(markup).toContain('data-row-kind="tip"');
    expect(markup).toContain('class="clinic-tip-label">Tip</b>');
    expect(markup).toContain("Water cooler"); expect(markup).toContain(row.timeLabel);
    expect(markup).not.toContain('data-attention-marker="true"');
    expect(markup).not.toContain("clinic-map-pin");
    expect(markup).not.toMatch(/Dismiss|Acknowledge/); expect(action).not.toHaveBeenCalled();
  });

  it("keeps receipt ID, copy and emission time through render/reload while expiring a resolved action", () => {
    const state = waterTip(); const before = createClinicFeedView(state).find((row) => row.rowKind === "tip")!;
    state.facilityTick = 261;
    const after = createClinicFeedView(deserializeGameState(serializeGameState(state))).find((row) => row.rowKind === "tip")!;
    expect(after).toEqual(before);
    state.environment.waterCoolerFillPercent = 100;
    const handled = createClinicFeedView(state).find((row) => row.id === before.id)!;
    expect(handled).toMatchObject({ message: before.message, sortKey: before.sortKey, timeLabel: before.timeLabel });
    expect(handled.action).toBeUndefined(); expect(handled.actionLabel).toBeUndefined();
    expect(getClinicAlertActionProblem(state, before.action!)).toContain("no longer applies");
  });

  it("hides the optional feed in Build Mode without promoting tips to the Needs-you tray", () => {
    const state = waterTip();
    const markup = renderToStaticMarkup(<EventMessageBoard items={createClinicFeedView(state)}
      needsYou={createNeedsYouView(state)} compact onAction={vi.fn()} />);
    expect(markup).toContain("Needs you"); expect(markup).toContain("All quiet");
    expect(markup).toMatch(/class="message-board-feed"[^>]*hidden=""/);
  });
});
