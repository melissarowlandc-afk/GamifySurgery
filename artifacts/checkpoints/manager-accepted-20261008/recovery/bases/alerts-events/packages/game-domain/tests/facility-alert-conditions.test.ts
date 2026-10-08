import { describe, expect, it } from "vitest";
import { ROOM_UPGRADE_CATALOG } from "@gamify-surgery/balance-config";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  SECOND_TUTORIAL_ENCOUNTER_ID,
  TUTORIAL_ENCOUNTER_ID,
  createInitialGameState,
  evaluateFacilityOperationalAlertConditions,
  getRoomDefinition,
  getRoomNavigableTiles,
  deserializeGameState,
  serializeGameState,
  synchronizeFacilityOperationalAlertOccurrences,
} from "../src";

describe("durable operational alert conditions", () => {
  it.each([60, 0])("keeps a continuous $%s cash condition live across day rollover and daily renewal", (cash) => {
    const state = createInitialGameState();
    state.cash = cash; state.cashCents = cash * 100;
    synchronizeFacilityOperationalAlertOccurrences(state);
    const key = cash === 0 ? "no_cash" : "low_cash";
    const firstId = state.environment.facilityConditionOccurrences.find((row) => row.conditionKey === key)!.id;
    for (const tick of [599, 600, 601]) {
      state.facilityTick = tick;
      synchronizeFacilityOperationalAlertOccurrences(state);
    }
    const restored = deserializeGameState(serializeGameState(state));
    const rows = restored.environment.facilityConditionOccurrences.filter((row) => row.conditionKey === key);
    expect(rows).toHaveLength(2);
    expect(rows[0]!.id).toBe(firstId);
    expect(rows.map((row) => row.resolvedAtFacilityTick)).toEqual([null, null]);
    expect(rows[1]).toMatchObject({ kind: "reminder", occurredAtFacilityTick: 600 });
    expect(restored.alertHumor.conditionLastEmittedTicks[`finance.${cash === 0 ? "no-cash" : "low-cash"}`]).toBe(600);
    restored.facilityTick = 602;
    synchronizeFacilityOperationalAlertOccurrences(restored);
    expect(restored.environment.facilityConditionOccurrences.filter((row) => row.conditionKey === key)).toHaveLength(2);
    restored.facilityTick = 603; restored.cash = 200; restored.cashCents = 20_000;
    synchronizeFacilityOperationalAlertOccurrences(restored);
    expect(rows.map((row) => row.resolvedAtFacilityTick)).toEqual([603, 603]);
  });
  it("withholds advertising when eligible content is unavailable and retires the three-patient crowding proxy", () => {
    const state = createInitialGameState(); state.facilityLevel = 1; state.facilityTick = 100;
    const template = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    template.lifecycle = "resolved"; template.resolutionReason = "completed";
    state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID] = { ...structuredClone(template), id: SECOND_TUTORIAL_ENCOUNTER_ID };
    state.alertHumor.lastPatientArrivalTick = 0;
    const unavailable = { ...PROTOTYPE_DOMAIN_CONTEXT, clinicalRelease: { ...PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease, cases: [] } };
    expect(evaluateFacilityOperationalAlertConditions(state, unavailable).some((row) => row.conditionKey === "advertising_recommended")).toBe(false);
    for (let i = 0; i < 3; i++) state.encounters[`waiting.${i}`] = { ...structuredClone(template), id: `waiting.${i}`, resolutionReason: null, lifecycle: "waiting_unopened", checkInStatus: "checked_in", patientMovement: null };
    state.rooms.push({ id: "waiting", roomDefinitionId: "room.waiting", x: 20, y: 20, orientation: 0, doorSide: null, upgradeLevel: 1 });
    expect(evaluateFacilityOperationalAlertConditions(state).some((row) => row.conditionKey === "waiting_room_crowded")).toBe(false);
  });
  it("paces low-cash recurrences across a rolling operating day and survives reload", () => {
    const state = createInitialGameState();
    state.cash = 50;
    state.cashCents = 5_000;

    synchronizeFacilityOperationalAlertOccurrences(state);
    const first = state.environment.facilityConditionOccurrences.find(
      (occurrence) => occurrence.conditionKey === "low_cash",
    );
    expect(first).toMatchObject({
      occurredAtFacilityTick: 0,
      resolvedAtFacilityTick: null,
      definitionId: "alert.finance.low-cash",
      priority: "action_required",
      target: {
        kind: "emergency_glp1",
        id: "emergency-glp1",
      },
    });

    state.facilityTick = 10;
    state.cash = 500;
    state.cashCents = 50_000;
    synchronizeFacilityOperationalAlertOccurrences(state);
    expect(first?.resolvedAtFacilityTick).toBe(10);

    state.facilityTick = 20;
    state.cash = 50;
    state.cashCents = 5_000;
    synchronizeFacilityOperationalAlertOccurrences(state);
    expect(
      state.environment.facilityConditionOccurrences.filter(
        (occurrence) => occurrence.conditionKey === "low_cash"),
    ).toHaveLength(1);

    const restored = deserializeGameState(serializeGameState(state));
    restored.facilityTick = 599;
    synchronizeFacilityOperationalAlertOccurrences(restored);
    expect(
      restored.environment.facilityConditionOccurrences.filter(
        (occurrence) => occurrence.conditionKey === "low_cash"),
    ).toHaveLength(1);

    restored.facilityTick = 600;
    synchronizeFacilityOperationalAlertOccurrences(restored);
    const lowCashOccurrences =
      restored.environment.facilityConditionOccurrences.filter(
        (occurrence) => occurrence.conditionKey === "low_cash",
      );
    expect(lowCashOccurrences).toHaveLength(2);
    expect(lowCashOccurrences[1]).toMatchObject({
      occurredAtFacilityTick: 600,
      resolvedAtFacilityTick: null,
    });
    expect(lowCashOccurrences[1]?.id).not.toBe(first?.id);
  });

  it("paces zero-cash recurrences across a rolling operating day and survives reload", () => {
    const state = createInitialGameState();
    state.cash = 0;
    state.cashCents = 0;
    synchronizeFacilityOperationalAlertOccurrences(state);

    state.facilityTick = 10;
    state.cash = 500;
    state.cashCents = 50_000;
    synchronizeFacilityOperationalAlertOccurrences(state);
    state.facilityTick = 20;
    state.cash = 0;
    state.cashCents = 0;
    synchronizeFacilityOperationalAlertOccurrences(state);
    expect(
      state.environment.facilityConditionOccurrences.filter(
        (occurrence) => occurrence.conditionKey === "no_cash",
      ),
    ).toHaveLength(1);

    const restored = deserializeGameState(serializeGameState(state));
    expect(
      restored.environment.facilityConditionOccurrences.find(
        (occurrence) => occurrence.conditionKey === "no_cash",
      ),
    ).toMatchObject({
      definitionId: "alert.finance.no-cash",
      priority: "action_required",
      target: {
        kind: "emergency_glp1",
        id: "emergency-glp1",
      },
    });
    expect(
      restored.environment.facilityConditionOccurrences.some(
        (occurrence) => occurrence.conditionKey === "low_cash",
      ),
    ).toBe(false);

    restored.facilityTick = 600;
    synchronizeFacilityOperationalAlertOccurrences(restored);
    expect(
      restored.environment.facilityConditionOccurrences.filter(
        (occurrence) => occurrence.conditionKey === "no_cash",
      ),
    ).toHaveLength(2);
  });

  it("paces advertising guidance only when advertising is off and eligible arrivals have room", () => {
    const state = createInitialGameState();
    state.facilityLevel = 1;
    const first = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    first.lifecycle = "resolved";
    first.resolutionReason = "completed";
    state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID] = {
      ...JSON.parse(JSON.stringify(first)),
      id: SECOND_TUTORIAL_ENCOUNTER_ID,
      resolutionReason: "completed",
    };
    state.encounters["encounter.active"] = {
      ...JSON.parse(JSON.stringify(first)),
      id: "encounter.active",
      resolutionReason: null,
      lifecycle: "active_pending_result",
    };
    state.advertisingLevel = 1;
    state.alertHumor.lastPatientArrivalTick = 0;
    state.facilityTick = 60;
    synchronizeFacilityOperationalAlertOccurrences(state);
    expect(
      state.environment.facilityConditionOccurrences.filter(
        (candidate) =>
          candidate.conditionKey === "advertising_recommended",
      ),
    ).toHaveLength(0);

    state.facilityTick = 76;
    synchronizeFacilityOperationalAlertOccurrences(state);
    expect(state.environment.facilityConditionOccurrences.some((candidate) => candidate.conditionKey === "advertising_recommended")).toBe(false);
    state.advertisingLevel = 0;
    synchronizeFacilityOperationalAlertOccurrences(state);
    const occurrence =
      state.environment.facilityConditionOccurrences.find(
        (candidate) =>
          candidate.conditionKey === "advertising_recommended",
      );
    expect(occurrence).toMatchObject({
      priority: "informational",
      target: {
        kind: "advertising",
        id: "advertising",
      },
    });

    state.facilityTick = 77;
    state.alertHumor.lastPatientArrivalTick = 77;
    synchronizeFacilityOperationalAlertOccurrences(state);
    expect(occurrence?.resolvedAtFacilityTick).toBe(77);

    state.facilityTick = 154;
    synchronizeFacilityOperationalAlertOccurrences(state);
    expect(
      state.environment.facilityConditionOccurrences.filter(
        (candidate) => candidate.conditionKey === "advertising_recommended",
      ),
    ).toHaveLength(1);

    state.facilityTick = 677;
    synchronizeFacilityOperationalAlertOccurrences(state);
    expect(
      state.environment.facilityConditionOccurrences.filter(
        (candidate) => candidate.conditionKey === "advertising_recommended",
      ),
    ).toHaveLength(2);
    for (let i = 0; i < 20; i++) state.encounters[`full.${i}`] = { ...state.encounters["encounter.active"]!, id: `full.${i}` };
    expect(evaluateFacilityOperationalAlertConditions(state).some((candidate) => candidate.conditionKey === "advertising_recommended")).toBe(false);
  });
});

describe("current room satisfaction upgrade guidance", () => {
  const rooms = ROOM_UPGRADE_CATALOG.filter((definition) => definition.status !== "future");
  it.each(rooms)("only offers comfort upgrades for the actual satisfaction room $roomDefinitionId", ({ roomDefinitionId }) => {
    const state = createInitialGameState(); state.facilityLevel = 3; state.facilityTick = 120;
    const room = { id: "room.comfort.alert", roomDefinitionId, x: 20, y: 12,
      orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 };
    state.rooms.push(room);
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    encounter.lifecycle = "waiting_unopened"; encounter.patientMovement = null;
    encounter.assignedRoomInstanceId = room.id; encounter.patientSatisfaction = 82;
    encounter.waiting.arrivedAtTick = 0;
    encounter.patientLocation = getRoomNavigableTiles(room, getRoomDefinition(roomDefinitionId)!, state.doors)[0] ?? null;
    state.encounters = { [encounter.id]: encounter };
    const guidance = evaluateFacilityOperationalAlertConditions(state).filter((condition) => condition.conditionKey === "room_upgrade_requested");
    if (["room.waiting", "room.examination", "room.periop_recovery"].includes(roomDefinitionId)) {
      expect(guidance).toHaveLength(1);
      expect(guidance[0]?.target).toEqual({ kind: "room", id: room.id });
      encounter.patientLocation = null;
      expect(evaluateFacilityOperationalAlertConditions(state).some((condition) => condition.conditionKey === "room_upgrade_requested")).toBe(false);
    } else {
      expect(guidance).toEqual([]);
    }
  });

  it("retains recorded revenue-room complaint history through synchronization and reload", () => {
    const state = createInitialGameState(); state.facilityLevel = 3; state.facilityTick = 120;
    state.environment.facilityConditionOccurrences.push({
      id: "condition.old.xray-comfort", conditionKey: "room_upgrade_requested", kind: "onset",
      occurredAtFacilityTick: 0, resolvedAtFacilityTick: 60,
      definitionId: "alert.patient.room-upgrade-requested", message: "Historical X-ray Room upgrade request.",
      priority: "informational", target: { kind: "room", id: "room.old.xray" },
    });
    const before = structuredClone(state.environment.facilityConditionOccurrences);
    synchronizeFacilityOperationalAlertOccurrences(state);
    const reloaded = deserializeGameState(serializeGameState(state));
    expect(reloaded.environment.facilityConditionOccurrences).toEqual(expect.arrayContaining(before));
  });
});
