import { describe, expect, it } from "vitest";
import { renderPrototypeAlert } from "@gamify-surgery/balance-config";
import {
  TUTORIAL_ENCOUNTER_ID,
  SECOND_TUTORIAL_ENCOUNTER_ID,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  serializeGameState,
  synchronizeFacilityConditionOccurrences,
  type DomainEvent,
  type GameState,
} from "@gamify-surgery/game-domain";
import { createMessageBoardView } from "./alertViewModels";

function cloneState(state: GameState): GameState {
  return JSON.parse(JSON.stringify(state)) as GameState;
}

function event(
  overrides: Partial<DomainEvent> &
    Pick<DomainEvent, "id" | "type" | "facilityTick">,
): DomainEvent {
  return {
    encounterId: null,
    message: overrides.type,
    target: null,
    ...overrides,
  };
}

function checkInTutorialPatient(state: GameState): void {
  const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
  encounter.lifecycle = "waiting_unopened";
  encounter.patientMovement = null;
  encounter.patientLocation = { x: 34, y: 29 };
  encounter.assignedRoomInstanceId = "room.instance.founder_desk";
  encounter.checkInStatus = "checked_in";
  encounter.checkInWaitingSinceTick = null;
  encounter.feedAttentionKind = "checked_in";
  encounter.feedAttentionStartedAtTick = state.facilityTick;
  encounter.idleWaitingSinceTick = state.facilityTick;
}

describe("createMessageBoardView data-driven alerts", () => {
  it("keeps retained alert history as plain chronological rows", () => {
    let state = createInitialGameState();
    const firstTutorial = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID] = {
      ...firstTutorial,
      id: SECOND_TUTORIAL_ENCOUNTER_ID,
    };
    for (const encounter of Object.values(state.encounters)) {
      encounter.resolutionReason = "completed";
      encounter.patientMovement = null;
      encounter.patientLocation = null;
    }
    state.alertHumor.alertsTutorialAcknowledgedAtTick = 0;
    state.alertHumor.nextAmbientAlertTick = 120;
    for (let minute = 1; minute <= 240; minute += 1) {
      state = gameReducer(state, {
        type: "ADVANCE_TICK",
        operationId: `routine-ambient.${minute}`,
      });
    }

    const rawAmbientEvents = state.events.filter(
      (candidate) => candidate.type === "ambient_message",
    );
    state.events = rawAmbientEvents;
    state.environment.facilityConditionOccurrences = [
      {
        id: "condition.water.onset",
        conditionKey: "empty_water_cooler",
        kind: "onset",
        occurredAtFacilityTick: 30,
        resolvedAtFacilityTick: null,
        definitionId: "alert.environment.water-empty",
        message: "The water cooler is empty.",
        priority: "action_required",
        target: { kind: "water_cooler", id: "water-cooler.front-desk" },
      },
      {
        id: "condition.water.reminder",
        conditionKey: "empty_water_cooler",
        kind: "reminder",
        occurredAtFacilityTick: 90,
        resolvedAtFacilityTick: null,
        definitionId: "alert.environment.water-empty",
        message: "The water cooler is still empty.",
        priority: "action_required",
        target: { kind: "water_cooler", id: "water-cooler.front-desk" },
      },
      {
        id: "condition.water.latest",
        conditionKey: "empty_water_cooler",
        kind: "reminder",
        occurredAtFacilityTick: 180,
        resolvedAtFacilityTick: null,
        definitionId: "alert.environment.water-empty",
        message: "The water cooler is still empty; refill it.",
        priority: "action_required",
        target: { kind: "water_cooler", id: "water-cooler.front-desk" },
      },
    ];
    state.cash = 100_000;
    state.cashCents = 10_000_000;
    const items = createMessageBoardView(state);
    expect(rawAmbientEvents).toHaveLength(2);
    expect(items.filter((item) => !item.persistent)).toHaveLength(5);
    expect(new Set(items.map((item) => item.id))).toEqual(new Set([
      ...rawAmbientEvents.map((entry) => entry.id),
      "condition.water.onset",
      "condition.water.reminder",
      "condition.water.latest",
    ]));
    expect(items.find((item) => item.id === "condition.water.latest")).toMatchObject({
      priority: "action_required",
      showAttentionMarker: true,
      targetType: "water_cooler",
    });
  });

  it("suppresses legacy check-in and result-return rows while retaining generic waits", () => {
    const state = createInitialGameState();
    state.events = [
      event({
        id: "event.patient-a.resolved",
        type: "patience_warning",
        facilityTick: 1,
        definitionId: "alert.patient.arrived",
        priority: "action_required",
        encounterId: "encounter.a",
        target: { kind: "encounter", id: "encounter.a" },
        message: "A is ready.",
      }),
      event({
        id: "event.patient-result",
        type: "result_ready",
        facilityTick: 2,
        definitionId: "alert.patient.result-ready",
        priority: "action_required",
        encounterId: "encounter.a",
        target: { kind: "encounter", id: "encounter.a" },
        message: "Result ready.",
      }),
      event({
        id: "event.patient-decision",
        type: "patient_arrived",
        facilityTick: 3,
        definitionId: "alert.patient.waiting",
        priority: "action_required",
        encounterId: TUTORIAL_ENCOUNTER_ID,
        target: { kind: "encounter", id: TUTORIAL_ENCOUNTER_ID },
        message: "Decision ready.",
      }),
      event({
        id: "event.patient-waiting",
        type: "patience_warning",
        facilityTick: 4,
        definitionId: "alert.patient.waiting",
        priority: "action_required",
        encounterId: TUTORIAL_ENCOUNTER_ID,
        target: { kind: "encounter", id: TUTORIAL_ENCOUNTER_ID },
        message: "The patient has been waiting for clinical attention.",
      }),
    ];

    const items = createMessageBoardView(state);
    expect(items.some((item) => item.id === "event.patient-a.resolved")).toBe(false);
    expect(items.some((item) => item.id === "event.patient-result")).toBe(false);
    expect(items.some((item) => item.id === "event.patient-decision")).toBe(false);
    expect(items.some((item) => item.id === "event.patient-waiting")).toBe(true);
  });

  it("adds non-attention Level 2 phlebotomy guidance only for the accepted station ID", () => {
    const state = createInitialGameState();
    state.facilityLevel = 2;
    state.rooms.push({
      ...state.rooms[0]!,
      id: "room.test.phlebotomy",
      roomDefinitionId: "room.phlebotomy",
      x: 50,
      y: 50,
    });
    const guidance = createMessageBoardView(state).find(
      (item) => item.id === "persistent.alert.facility.phlebotomy-inoperable",
    );
    expect(guidance).toMatchObject({
      category: "guidance",
      showAttentionMarker: false,
      targetType: "build_mode",
      targetId: "room.phlebotomy",
      actionLabel: "Open Build Mode",
    });
  });
  it("renders persisted ambient events from their registry definition", () => {
    const state = createInitialGameState();
    state.encounters = {};
    state.cash = 1_000;
    state.cashCents = 100_000;
    state.events = [
      event({
        id: "event.ambient.test",
        type: "ambient_message",
        facilityTick: 12,
        message: "A fax arrived. Historians have been notified.",
        priority: "flavor",
        definitionId: "alert.ambient.01",
        alertCategory: "ambient_flavor",
        alertVariantId: "alert.ambient.01.default",
      }),
    ];

    expect(
      createMessageBoardView(state).find(
        (item) => item.id === "event.ambient.test",
      ),
    ).toMatchObject({
      category: "ambient_flavor",
      priority: "flavor",
      showAttentionMarker: false,
      title: "Around the clinic",
      message: "A fax arrived. Historians have been notified.",
      sortKey: 12,
      persistent: false,
    });
  });

  it("keeps flavor and condition guidance anchored to their original occurrence times", () => {
    const state = createInitialGameState();
    checkInTutorialPatient(state);
    state.facilityLevel = 1;
    state.facilityTick = 100;
    state.cash = 1_000;
    state.cashCents = 100_000;
    state.events = [
      event({
        id: "event.ambient.recency",
        type: "ambient_message",
        facilityTick: 100,
        message: "The fax machine remains historically significant.",
        priority: "flavor",
        definitionId: "alert.ambient.01",
        alertCategory: "ambient_flavor",
        alertVariantId: "alert.ambient.01.default",
      }),
    ];
    state.environment.facilityConditionOccurrences = [{
      id: "condition.receptionist.recency",
      conditionKey: "no_receptionist",
      kind: "onset",
      occurredAtFacilityTick: 30,
      resolvedAtFacilityTick: null,
      definitionId: "alert.staff.receptionist-recommended",
      message: "Hire a receptionist to keep the Front Desk moving.",
      priority: "informational",
      target: { kind: "staff_role", id: "staff.receptionist" },
    }];

    const initialItems = createMessageBoardView(state);
    const flavor = initialItems.find(
      (item) => item.id === "event.ambient.recency",
    )!;
    const guidance = initialItems.find(
      (item) =>
        item.id === "condition.receptionist.recency",
    )!;
    expect(flavor.sortKey).toBe(100);
    expect(flavor.sortKey!).toBeGreaterThan(guidance.sortKey!);

    state.facilityTick = 300;
    const laterFlavor = createMessageBoardView(state).find(
      (item) => item.id === "event.ambient.recency",
    )!;
    const laterGuidance = createMessageBoardView(state).find(
      (item) =>
        item.id === "condition.receptionist.recency",
    )!;
    expect(laterFlavor.sortKey).toBe(flavor.sortKey);
    expect(laterGuidance.sortKey).toBe(guidance.sortKey);
  });

  it("shows an attention marker only for action-required items", () => {
    const state = createInitialGameState();
    checkInTutorialPatient(state);
    state.facilityLevel = 1;
    state.cash = 1_000;
    state.cashCents = 100_000;
    state.facilityTick = 6;
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    encounter.lifecycle = "active_action_required";
    encounter.steps[encounter.currentNodeIndex]!.status = "action_required";
    encounter.feedAttentionKind = "clinical_decision";
    encounter.feedAttentionStartedAtTick = 0;
    state.events = [
      event({
        id: "event.decision.marker-test",
        type: "patience_warning",
        facilityTick: 0,
        encounterId: encounter.id,
        priority: "action_required",
        definitionId: "alert.patient.waiting",
        target: { kind: "encounter", id: encounter.id },
      }),
      event({
        id: "event.ambient.marker-test",
        type: "ambient_message",
        facilityTick: 1,
        message: "Ambient.",
        priority: "flavor",
        definitionId: "alert.ambient.02",
        alertCategory: "ambient_flavor",
        alertVariantId: "alert.ambient.02.default",
      }),
      event({
        id: "event.success.marker-test",
        type: "success_message",
        facilityTick: 2,
        message:
          "First patient resolved. The clinic remains structurally optimistic.",
        priority: "informational",
        definitionId:
          "alert.success.first-ordinary-patient-resolved",
        alertCategory: "success",
      }),
    ];
    state.environment.facilityConditionOccurrences = [{
      id: "condition.guidance.marker-test",
      conditionKey: "no_receptionist",
      kind: "onset",
      occurredAtFacilityTick: 1,
      resolvedAtFacilityTick: null,
      definitionId: "alert.staff.receptionist-recommended",
      message: "Hire a receptionist.",
      priority: "informational",
      target: { kind: "staff_role", id: "staff.receptionist" },
    }];

    const items = createMessageBoardView(state);
    expect(items.some((item) => item.category === "action_required")).toBe(
      true,
    );
    expect(items.some((item) => item.category === "guidance")).toBe(true);
    expect(items.some((item) => item.category === "success")).toBe(true);
    expect(items.some((item) => item.category === "ambient_flavor")).toBe(
      true,
    );

    for (const item of items) {
      expect(item.showAttentionMarker === true).toBe(
        item.category === "action_required",
      );
    }
  });

  it("provides condition-backed guidance with the correct interface targets", () => {
    const state = createInitialGameState();
    checkInTutorialPatient(state);
    state.facilityLevel = 1;
    state.facilityTick = 31;
    state.cash = 1_000;
    state.cashCents = 100_000;
    state.environment.litterItems = [
      {
        id: "litter.guidance",
        roomId: "room.instance.founder_desk",
        location: { x: 34, y: 29 },
        spawnedAtFacilityTick: 30,
      },
    ];
    state.environment.facilityConditionOccurrences = [
      {
        id: "condition.receptionist.guidance",
        conditionKey: "no_receptionist",
        kind: "onset",
        occurredAtFacilityTick: 1,
        resolvedAtFacilityTick: null,
        definitionId: "alert.staff.receptionist-recommended",
        message: "Hire a receptionist to support patient check-in.",
        priority: "informational",
        target: { kind: "staff_role", id: "staff.receptionist" },
      },
      {
        id: "condition.waiting.guidance",
        conditionKey: "missing_waiting_room",
        kind: "onset",
        occurredAtFacilityTick: 2,
        resolvedAtFacilityTick: null,
        definitionId: "alert.facility.waiting-room-needed",
        message: "Build a waiting room.",
        priority: "informational",
        target: { kind: "build_mode", id: "room.waiting" },
      },
      {
        id: "condition.litter.guidance",
        conditionKey: "visible_litter",
        kind: "onset",
        occurredAtFacilityTick: 3,
        resolvedAtFacilityTick: null,
        definitionId: "alert.environment.trash-visible",
        message: "Select the trash to clean it up.",
        priority: "informational",
        target: { kind: "litter", id: "litter.guidance" },
      },
    ];

    const items = createMessageBoardView(state);

    expect(
      items.find(
        (item) =>
          item.id === "condition.receptionist.guidance",
      ),
    ).toMatchObject({
      category: "guidance",
      showAttentionMarker: false,
      targetType: "staff_role",
      targetId: "staff.receptionist",
      actionLabel: "Show hiring",
      message: expect.stringContaining("Hire a receptionist"),
    });
    expect(
      items.find(
        (item) =>
          item.id === "condition.waiting.guidance",
      ),
    ).toMatchObject({
      category: "guidance",
      showAttentionMarker: false,
      targetType: "build_mode",
      actionLabel: "Open Build Mode",
    });
    expect(
      items.find(
        (item) => item.id === "condition.litter.guidance",
      ),
    ).toMatchObject({
      category: "guidance",
      showAttentionMarker: false,
      targetType: "litter",
      targetId: "litter.guidance",
      actionLabel: "Show trash",
    });
  });

  it("distinguishes missing onsite X-ray from an X-ray room without a technician", () => {
    const state = createInitialGameState();
    state.environment.facilityConditionOccurrences = [{
      id: "condition.xray.room",
      conditionKey: "unavailable_onsite_xray",
      kind: "onset",
      occurredAtFacilityTick: 1,
      resolvedAtFacilityTick: null,
      definitionId: "alert.facility.onsite-imaging-requested",
      message: "Build an X-ray room to keep imaging onsite.",
      priority: "informational",
      target: { kind: "build_mode", id: "room.xray" },
    }];

    expect(
      createMessageBoardView(state).find(
        (item) =>
          item.id ===
          "condition.xray.room",
      ),
    ).toMatchObject({
      category: "guidance",
      showAttentionMarker: false,
      targetType: "build_mode",
      message: expect.stringContaining("Build an X-ray room"),
    });

    state.environment.facilityConditionOccurrences[0]!.resolvedAtFacilityTick = 2;
    state.environment.facilityConditionOccurrences.push({
      id: "condition.xray.staff",
      conditionKey: "unavailable_onsite_xray",
      kind: "onset",
      occurredAtFacilityTick: 2,
      resolvedAtFacilityTick: null,
      definitionId: "alert.staff.imaging-technician-needed",
      message: "Hire an imaging technician.",
      priority: "informational",
      target: { kind: "staff_role", id: "staff.imaging_technician" },
    });
    const withRoom = createMessageBoardView(state);
    expect(
      withRoom.some(
        (item) =>
          item.id ===
          "condition.xray.room",
      ),
    ).toBe(true);
    expect(
      withRoom.find(
        (item) =>
          item.id ===
          "condition.xray.staff",
      ),
    ).toMatchObject({
      category: "guidance",
      showAttentionMarker: false,
      targetType: "staff_role",
      targetId: "staff.imaging_technician",
      actionLabel: "Show hiring",
    });
  });

  it("keeps prior patient alerts as history while only the newest unresolved warning requires attention", () => {
    const state = createInitialGameState();
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    checkInTutorialPatient(state);
    encounter.waiting.patienceExempt = false;
    encounter.patientSatisfaction = 74;
    encounter.satisfactionWarningsShown = [75];
    state.events = [
      event({
        id: "event.patient-arrived.duplicate",
        type: "patient_arrived",
        facilityTick: 0,
        encounterId: encounter.id,
        priority: "action_required",
        target: { kind: "encounter", id: encounter.id },
      }),
      event({
        id: "event.patience-warning.duplicate.1",
        type: "patience_warning",
        facilityTick: 1,
        encounterId: encounter.id,
        priority: "action_required",
        target: { kind: "encounter", id: encounter.id },
      }),
      event({
        id: "event.patience-warning.duplicate.2",
        type: "patience_warning",
        facilityTick: 2,
        encounterId: encounter.id,
        priority: "critical",
        target: { kind: "encounter", id: encounter.id },
      }),
    ];

    const patientItems = createMessageBoardView(state).filter(
      (item) => item.targetId === encounter.id,
    );

    expect(patientItems).toHaveLength(1);
    expect(patientItems[0]).toMatchObject({
      id: "event.patience-warning.duplicate.2",
      category: "action_required",
      showAttentionMarker: true,
      targetType: "patient",
      actionLabel: "Open chart",
      persistent: false,
    });
    for (const historicalId of [
      "event.patience-warning.duplicate.1",
    ]) {
      expect(
        createMessageBoardView(state).find(
          (item) => item.id === historicalId,
        ),
      ).toMatchObject({
        category: "guidance",
        priority: "informational",
        showAttentionMarker: false,
        persistent: false,
      });
    }
  });

  it("retains the irreversible leaving alert after the persistent wait warning ends", () => {
    const state = createInitialGameState();
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    checkInTutorialPatient(state);
    encounter.patientMovement = {
      kind: "leaving_after_walkout",
      path: [{ x: 34, y: 29 }, { x: 34, y: 30 }],
      pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick,
      destinationRoomInstanceId: null,
    };
    state.events = [
      event({
        id: "event.patient-leaving.test",
        type: "patience_warning",
        facilityTick: 10,
        encounterId: encounter.id,
        message: `${encounter.patientDisplayName} is leaving the clinic.`,
        priority: "critical",
        definitionId: "alert.patient.leaving",
        target: { kind: "encounter", id: encounter.id },
      }),
    ];

    expect(
      createMessageBoardView(state).find(
        (item) => item.id === "event.patient-leaving.test",
      ),
    ).toMatchObject({
      category: "action_required",
      priority: "critical",
      showAttentionMarker: true,
      title: "Patient leaving",
      persistent: false,
    });
    const leaving = createMessageBoardView(state).find(
      (item) => item.id === "event.patient-leaving.test",
    );
    expect(leaving?.targetType).toBeUndefined();
    expect(leaving?.actionLabel).toBeUndefined();

    encounter.patientMovement = null;
    encounter.lifecycle = "resolved";
    encounter.resolutionReason = "walkout";
    expect(
      createMessageBoardView(state).find(
        (item) => item.id === "event.patient-leaving.test",
      ),
    ).toMatchObject({
      id: "event.patient-leaving.test",
      category: "guidance",
      priority: "informational",
      showAttentionMarker: false,
      persistent: false,
      sortKey: 10,
    });
    const resolvedLeaving = createMessageBoardView(state).find(
      (item) => item.id === "event.patient-leaving.test",
    );
    expect(resolvedLeaving?.targetType).toBeUndefined();
    expect(resolvedLeaving?.actionLabel).toBeUndefined();
  });

  it("suppresses legacy check-in and water aliases without synthesizing live duplicates", () => {
    const state = createInitialGameState();
    checkInTutorialPatient(state);
    state.environment.waterCoolerFillPercent = 10;
    state.events = [
      event({
        id: "event.arrival.1",
        type: "patient_arrived",
        facilityTick: 1,
        encounterId: TUTORIAL_ENCOUNTER_ID,
        priority: "action_required",
        definitionId: "alert.patient.arrived",
        target: {
          kind: "encounter",
          id: TUTORIAL_ENCOUNTER_ID,
        },
      }),
      event({
        id: "event.arrival.2",
        type: "patient_arrived",
        facilityTick: 2,
        encounterId: TUTORIAL_ENCOUNTER_ID,
        priority: "action_required",
        definitionId: "alert.patient.arrived",
        target: {
          kind: "encounter",
          id: TUTORIAL_ENCOUNTER_ID,
        },
      }),
      event({
        id: "event.water.1",
        type: "water_cooler_low",
        facilityTick: 3,
        priority: "action_required",
        definitionId: "alert.environment.water-low",
        target: {
          kind: "room",
          id: "room.instance.founder_desk",
        },
      }),
      event({
        id: "event.water.2",
        type: "water_cooler_low",
        facilityTick: 4,
        priority: "action_required",
        definitionId: "alert.environment.water-low",
        target: {
          kind: "room",
          id: "room.instance.founder_desk",
        },
      }),
    ];

    const items = createMessageBoardView(state);
    expect(
      items.filter(
        (item) =>
          item.id ===
          `persistent.patient.${TUTORIAL_ENCOUNTER_ID}.waiting`,
      ),
    ).toHaveLength(0);
    expect(
      items.filter(
        (item) =>
          item.id === "persistent.environment.water-cooler-low",
      ),
    ).toHaveLength(0);
    for (const eventId of [
      "event.arrival.1",
      "event.arrival.2",
      "event.water.1",
      "event.water.2",
    ]) {
      expect(items.some((item) => item.id === eventId)).toBe(false);
    }
  });

  it("keeps routine accounting, staff success, correct-XP, GLP-1, litter-spawn, and build audit events out of the player feed", () => {
    const state = createInitialGameState();
    state.encounters = {};
    state.cash = 1_000;
    state.cashCents = 100_000;
    const suppressedTypes = [
      "operating_expense",
      "clinical_decision_recorded",
      "encounter_settled",
      "emergency_glp1_consultation",
      "development_money_added",
      "room_placed",
      "room_sold",
      "room_upgraded",
      "room_moved",
      "room_rotated",
      "door_placed",
      "door_removed",
      "litter_appeared",
      "litter_collected",
      "water_cooler_refilled",
      "staff_hired",
      "employee_praised",
    ] as const;
    state.events = [
      ...suppressedTypes.map((type, index) =>
        event({
          id: `event.suppressed.${type}`,
          type,
          facilityTick: index + 1,
          message: `${type} audit record`,
        }),
      ),
      event({
        id: "event.suppressed.correct-xp",
        type: "clinical_decision_recorded",
        facilityTick: 20,
        message: "Correct decision. +10 Learning XP.",
        definitionId: "event.clinical.decision-correct",
        reward: {
          cashDelta: 0,
          learningXpDelta: 10,
          satisfactionDelta: 1,
        },
      }),
    ];

    const items = createMessageBoardView(state);
    expect(state.events).toHaveLength(suppressedTypes.length + 1);
    for (const hiddenId of [
      ...suppressedTypes.map(
        (type) => `event.suppressed.${type}`,
      ),
      "event.suppressed.correct-xp",
    ]) {
      expect(items.some((item) => item.id === hiddenId)).toBe(false);
    }
  });

  it("suppresses hired and praised staff rows including first-hire aliases", () => {
    const state = createInitialGameState();
    state.encounters = {};
    state.cash = 1_000;
    state.cashCents = 100_000;
    state.events = [
      event({
        id: "event.staff.hired.base",
        type: "staff_hired",
        facilityTick: 10,
        definitionId: "alert.staff.hired",
      }),
      event({
        id: "event.staff.hired.receptionist",
        type: "staff_hired",
        facilityTick: 11,
        definitionId: "alert.success.receptionist-hired",
      }),
      event({
        id: "event.staff.hired.imaging",
        type: "staff_hired",
        facilityTick: 12,
        definitionId: "alert.success.imaging-technician-hired",
      }),
      event({
        id: "event.staff.praised",
        type: "employee_praised",
        facilityTick: 13,
        definitionId: "alert.staff.praised",
      }),
    ];

    const items = createMessageBoardView(state);
    for (const id of state.events.map((candidate) => candidate.id)) {
      expect(items.some((item) => item.id === id)).toBe(false);
    }
    expect(state.events).toHaveLength(4);
  });

  it("shows one durable litter occurrence only after the continuous delay", () => {
    const state = createInitialGameState();
    state.cash = 1_000;
    state.cashCents = 100_000;
    checkInTutorialPatient(state);
    const roomId = "room.instance.founder_desk";
    state.environment.litterItems = [
      {
        id: "litter.lesson",
        roomId,
        location: { ...state.environment.founderLocation },
        spawnedAtFacilityTick: 0,
      },
    ];

    synchronizeFacilityConditionOccurrences(state);
    expect(
      createMessageBoardView(state).some(
        (item) => item.targetId === "litter.lesson",
      ),
    ).toBe(false);

    state.facilityTick = 61;
    synchronizeFacilityConditionOccurrences(state);
    expect(
      createMessageBoardView(state).find(
        (item) => item.targetId === "litter.lesson",
      ),
    ).toMatchObject({
      persistent: false,
      targetType: "litter",
      actionLabel: "Show trash",
    });

    const started = gameReducer(state, {
      type: "COLLECT_LITTER",
      operationId: "collect.lesson",
      litterId: "litter.lesson",
    });
    expect(
      started.operationReceipts["collect.lesson"]?.status,
    ).toBe("applied");
    expect(
      started.environment.trashTeachingAcknowledgedAtTick,
    ).toBe(started.facilityTick);
    expect(
      createMessageBoardView(started).some(
        (item) =>
          item.id === "persistent.environment.trash-visible",
      ),
    ).toBe(false);

    const restored = deserializeGameState(
      serializeGameState(started),
    );
    restored.facilityLevel = 1;
    restored.facilityTick = 100;
    restored.environment.founderActivity = null;
    restored.environment.lastLitterCleanupAtTick = 1;
    restored.environment.litterItems = [
      {
        id: "litter.accumulated.1",
        roomId,
        location: { x: 33, y: 29 },
        spawnedAtFacilityTick: 40,
      },
      {
        id: "litter.accumulated.2",
        roomId,
        location: { x: 35, y: 29 },
        spawnedAtFacilityTick: 45,
      },
    ];
    synchronizeFacilityConditionOccurrences(restored);
    restored.facilityTick = 662;
    synchronizeFacilityConditionOccurrences(restored);
    const complaintItems = createMessageBoardView(restored).filter(
      (item) => item.targetId === "litter.accumulated.1",
    );
    expect(complaintItems).toHaveLength(1);
    expect(complaintItems[0]).toMatchObject({
      category: "guidance",
      showAttentionMarker: false,
      targetType: "litter",
      actionLabel: "Show trash",
    });
  });

  it("keeps a delayed litter occurrence actionable when cleanup is rejected", () => {
    const state = createInitialGameState();
    state.environment.litterItems = [
      {
        id: "litter.lesson",
        roomId: "room.instance.founder_desk",
        location: { ...state.environment.founderLocation },
        spawnedAtFacilityTick: 0,
      },
    ];
    state.environment.founderActivity = {
      kind: "refill_water",
      targetId: "room.instance.founder_desk",
      path: [{ ...state.environment.founderLocation }],
      pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick,
      workMinutesRemaining: 1,
    };
    synchronizeFacilityConditionOccurrences(state);
    state.facilityTick = 61;
    synchronizeFacilityConditionOccurrences(state);

    const rejected = gameReducer(state, {
      type: "COLLECT_LITTER",
      operationId: "collect.lesson.rejected",
      litterId: "litter.lesson",
    });

    expect(
      rejected.operationReceipts["collect.lesson.rejected"]?.status,
    ).toBe("rejected");
    expect(
      rejected.environment.trashTeachingAcknowledgedAtTick,
    ).toBeNull();
    expect(
      createMessageBoardView(rejected).some(
        (item) =>
          item.targetType === "litter" &&
          item.targetId === "litter.lesson" &&
          item.persistent === false,
      ),
    ).toBe(true);
  });

  it("hides legacy room-upgrade complaint rows below facility level three", () => {
    const state = createInitialGameState();
    state.facilityLevel = 1;
    state.facilityTick = 61;
    state.cash = 1_000;
    state.cashCents = 100_000;
    checkInTutorialPatient(state);
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    encounter.patientSatisfaction = 82;
    encounter.waiting.arrivedAtTick = 0;
    encounter.assignedRoomInstanceId = "room.exam.complaint";
    encounter.patientLocation = { x: 21, y: 21 };
    state.rooms.push({
      id: "room.exam.complaint",
      roomDefinitionId: "room.examination",
      x: 20,
      y: 20,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    });

    state.environment.facilityConditionOccurrences.push({
      id: "condition.legacy.room-upgrade",
      conditionKey: "room_upgrade_requested",
      kind: "onset",
      occurredAtFacilityTick: 60,
      resolvedAtFacilityTick: null,
      definitionId: "alert.patient.room-upgrade-requested",
      message: "Upgrade Examination Room.",
      priority: "informational",
      target: { kind: "room", id: "room.exam.complaint" },
    });
    expect(
      createMessageBoardView(state).some(
        (item) =>
          item.id === "condition.legacy.room-upgrade" ||
          item.id.startsWith("persistent.room-upgrade-requested."),
      ),
    ).toBe(false);
  });

  it("renders cause-aware walkout reviews as non-actionable ended-encounter events", () => {
    const state = createInitialGameState();
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    encounter.lifecycle = "resolved";
    encounter.resolutionReason = "walkout";
    state.events = [
      event({
        id: "event.walkout-review.test",
        type: "left_before_seen",
        facilityTick: 18,
        encounterId: encounter.id,
        message: `New 1-star review from ${encounter.patientDisplayName}: The dust bunny was seen before I was.`,
        priority: "informational",
        definitionId: "alert.review.poor-cleanliness",
        alertCategory: "walkout_review",
        alertVariantId: "alert.review.poor-cleanliness.01",
        walkoutReview: {
          rating: 1,
          cause: "poor_cleanliness",
        },
        target: { kind: "encounter", id: encounter.id },
      }),
    ];

    expect(
      createMessageBoardView(state).find(
        (item) => item.id === "event.walkout-review.test",
      ),
    ).toMatchObject({
      category: "walkout_review",
      priority: "informational",
      showAttentionMarker: false,
      title: "New patient review",
      message: expect.stringContaining(
        "The dust bunny was seen before I was.",
      ),
      persistent: false,
    });
    const review = createMessageBoardView(state).find(
      (item) => item.id === "event.walkout-review.test",
    );
    expect(review?.targetType).toBeUndefined();
    expect(review?.actionLabel).toBeUndefined();
  });

  it("renders a meaningful retained success from the registry", () => {
    const state = createInitialGameState();
    state.encounters = {};
    state.cash = 1_000;
    state.cashCents = 100_000;
    state.events = [
      event({
        id: "event.first-patient.success",
        type: "success_message",
        facilityTick: 8,
        message:
          "First patient resolved. The clinic remains structurally optimistic.",
        definitionId:
          "alert.success.first-ordinary-patient-resolved",
        alertCategory: "success",
        alertVariantId:
          "alert.success.first-ordinary-patient-resolved.default",
      }),
    ];

    expect(
      createMessageBoardView(state).find(
        (item) => item.id === "event.first-patient.success",
      ),
    ).toMatchObject({
      category: "success",
      priority: "informational",
      showAttentionMarker: false,
      title: "First ordinary patient resolved",
      message:
        "First patient resolved. The clinic remains structurally optimistic.",
    });
  });

  it("renders persisted event content identically after save and reload", () => {
    const state = createInitialGameState();
    state.encounters = {};
    state.cash = 1_000;
    state.cashCents = 100_000;
    state.alertHumor.recentAmbientDefinitionIds = [
      "alert.ambient.03",
    ];
    state.alertHumor.recentWalkoutReviewVariantIds = [
      "alert.review.general.02",
    ];
    state.events = [
      event({
        id: "event.ambient.reload",
        type: "ambient_message",
        facilityTick: 14,
        message: "Stored fallback.",
        priority: "flavor",
        definitionId: "alert.ambient.03",
        alertCategory: "ambient_flavor",
        alertVariantId: "alert.ambient.03.default",
      }),
    ];

    const before = createMessageBoardView(state);
    const restored = deserializeGameState(serializeGameState(state));
    const after = createMessageBoardView(restored);

    expect(after).toEqual(before);
    expect(restored.alertHumor.recentAmbientDefinitionIds).toEqual([
      "alert.ambient.03",
    ]);
    expect(
      restored.alertHumor.recentWalkoutReviewVariantIds,
    ).toEqual(["alert.review.general.02"]);
  });

  it("retains a resolved facility-condition row at its onset position while clearing attention and clickability", () => {
    const state = createInitialGameState();
    state.encounters = {};
    state.cash = 1_000;
    state.cashCents = 100_000;
    state.environment.facilityConditionOccurrences = [
      {
        id: "condition.empty-water.1",
        conditionKey: "empty_water_cooler",
        kind: "onset",
        occurredAtFacilityTick: 40,
        resolvedAtFacilityTick: null,
        definitionId: "alert.environment.water-empty",
        message:
          "The water cooler is empty. It is now a large blue vase. Refill it.",
        priority: "action_required",
        target: {
          kind: "water_cooler",
          id: "water-cooler.front-desk",
        },
      },
    ];

    expect(
      createMessageBoardView(state).find(
        (item) => item.id === "condition.empty-water.1",
      ),
    ).toMatchObject({
      category: "action_required",
      priority: "action_required",
      showAttentionMarker: true,
      targetType: "water_cooler",
      targetId: "water-cooler.front-desk",
      actionLabel: "Show water cooler",
      sortKey: 40,
    });

    state.environment.facilityConditionOccurrences[0]!.resolvedAtFacilityTick =
      55;
    const resolved = createMessageBoardView(state).find(
      (item) => item.id === "condition.empty-water.1",
    );
    expect(resolved).toMatchObject({
      category: "guidance",
      priority: "informational",
      showAttentionMarker: false,
      sortKey: 40,
    });
    expect(resolved?.targetType).toBeUndefined();
    expect(resolved?.targetId).toBeUndefined();
    expect(resolved?.actionLabel).toBeUndefined();

    const restored = deserializeGameState(
      serializeGameState(state),
    );
    expect(
      createMessageBoardView(restored).find(
        (item) => item.id === "condition.empty-water.1",
      ),
    ).toMatchObject({
      category: "guidance",
      showAttentionMarker: false,
      sortKey: 40,
    });
  });

  it("keeps an active low-cash marker at its real occurrence time behind newer feed history", () => {
    const state = createInitialGameState();
    state.encounters = {};
    state.facilityTick = 100;
    state.cash = 50;
    state.cashCents = 5_000;
    state.environment.facilityConditionOccurrences = [
      {
        id: "condition.low-cash.onset",
        conditionKey: "low_cash",
        kind: "onset",
        occurredAtFacilityTick: 40,
        resolvedAtFacilityTick: null,
        definitionId: "alert.finance.low-cash",
        message: "Less than $200 remains.",
        priority: "action_required",
        target: { kind: "emergency_glp1", id: "emergency-glp1" },
      },
    ];
    state.events = [
      event({
        id: "event.ambient.newer",
        type: "ambient_message",
        facilityTick: 80,
        alertCategory: "ambient_flavor",
        priority: "flavor",
      }),
    ];

    const items = createMessageBoardView(state);
    const lowCash = items.find(
      (item) => item.id === "condition.low-cash.onset",
    );
    const newer = items.find((item) => item.id === "event.ambient.newer");
    expect(lowCash).toMatchObject({
      showAttentionMarker: true,
      sortKey: 40,
      targetType: "emergency_glp1",
      targetId: "emergency-glp1",
    });
    expect(items.indexOf(lowCash!)).toBeLessThan(items.indexOf(newer!));
  });

  it("renders clinic-wide complaint copy and normalizes saved patient-specific complaint history", () => {
    const rendered = [
      "alert.facility.private-exam-needed",
      "alert.staff.receptionist-recommended",
      "alert.facility.onsite-imaging-requested",
      "alert.staff.imaging-technician-needed",
      "alert.facility.waiting-room-needed",
      "alert.facility.bathroom-needed",
      "alert.patient.cleanliness-complaint",
      "alert.patient.room-upgrade-requested",
      "alert.facility.waiting-room-crowded",
    ].map((definitionId) =>
      renderPrototypeAlert(definitionId, {
        patient_name: "Avery Patient",
        room_name: "Examination Room",
      }).body,
    );
    for (const message of rendered) {
      expect(message).not.toContain("Avery Patient");
      expect(message).not.toContain("{{patient_name}}");
    }
    expect(rendered).toContain("Patients are asking for a restroom. Build a bathroom.");
    expect(rendered).toContain(
      "Patients would appreciate a Waiting Room instead of waiting beside the Front Desk. Build a Waiting Room.",
    );

    const state = createInitialGameState();
    state.encounters = {};
    state.facilityTick = 100;
    state.environment.facilityConditionOccurrences = [
      {
        id: "condition.cleanliness.legacy",
        conditionKey: "visible_litter",
        kind: "onset",
        occurredAtFacilityTick: 40,
        resolvedAtFacilityTick: null,
        definitionId: "alert.patient.cleanliness-complaint",
        message: "Avery Patient has started reviewing the visible trash.",
        priority: "informational",
        target: { kind: "litter", id: "litter.legacy" },
      },
      {
        id: "condition.cleanliness.measured",
        conditionKey: "dirty_cleanliness",
        kind: "onset",
        occurredAtFacilityTick: 41,
        resolvedAtFacilityTick: null,
        definitionId: "alert.facility.cleanliness-low",
        message: "Clinic cleanliness is 23%. Even the dust looks concerned.",
        priority: "informational",
        target: { kind: "litter", id: "litter.measured" },
      },
    ];
    expect(
      createMessageBoardView(state).find(
        (item) => item.id === "condition.cleanliness.legacy",
      )?.message,
    ).toBe("Visible trash is distracting patients. Select it to send the founder to clean it.");
    expect(
      createMessageBoardView(state).find(
        (item) => item.id === "condition.cleanliness.measured",
      )?.message,
    ).toBe("Clinic cleanliness is 23%. Even the dust looks concerned.");
    expect(
      state.environment.facilityConditionOccurrences[1]?.message,
    ).toBe("Clinic cleanliness is 23%. Even the dust looks concerned.");
  });

  it("keeps individual patient waiting copy patient-specific", () => {
    const state = createInitialGameState();
    checkInTutorialPatient(state);
    state.facilityTick = 61;
    state.encounters[TUTORIAL_ENCOUNTER_ID]!.idleWaitingSinceTick = 0;

    const waiting = createMessageBoardView(state).find(
      (item) => item.id === `persistent.patient.${TUTORIAL_ENCOUNTER_ID}.waiting`,
    );
    expect(waiting?.message).toContain(
      state.encounters[TUTORIAL_ENCOUNTER_ID]!.patientDisplayName,
    );
  });

  it("does not synthesize a low-cash fallback while saved cadence is cooling down", () => {
    const state = createInitialGameState();
    state.encounters = {};
    state.facilityTick = 200;
    state.cash = 50;
    state.cashCents = 5_000;
    state.alertHumor.conditionLastEmittedTicks["finance.low-cash"] = 100;
    state.environment.facilityConditionOccurrences = [];

    expect(createMessageBoardView(state)).not.toContainEqual(
      expect.objectContaining({ id: "persistent.finance.low-cash" }),
    );
  });

  it("gives attention and clickability only to the latest unresolved occurrence of one facility condition", () => {
    const state = createInitialGameState();
    state.encounters = {};
    state.environment.facilityConditionOccurrences = [
      {
        id: "condition.empty-water.onset",
        conditionKey: "empty_water_cooler",
        kind: "onset",
        occurredAtFacilityTick: 40,
        resolvedAtFacilityTick: null,
        definitionId: "alert.environment.water-empty",
        message: "The water cooler is empty.",
        priority: "action_required",
        target: {
          kind: "water_cooler",
          id: "water-cooler.front-desk",
        },
      },
      {
        id: "condition.empty-water.reminder",
        conditionKey: "empty_water_cooler",
        kind: "reminder",
        occurredAtFacilityTick: 640,
        resolvedAtFacilityTick: null,
        definitionId: "alert.environment.water-empty",
        message: "The water cooler is still empty.",
        priority: "action_required",
        target: {
          kind: "water_cooler",
          id: "water-cooler.front-desk",
        },
      },
    ];

    const items = createMessageBoardView(state);
    expect(
      items.find(
        (item) => item.id === "condition.empty-water.onset",
      ),
    ).toMatchObject({
      category: "guidance",
      priority: "informational",
      showAttentionMarker: false,
      sortKey: 40,
    });
    expect(
      items.find(
        (item) => item.id === "condition.empty-water.reminder",
      ),
    ).toMatchObject({
      category: "action_required",
      priority: "action_required",
      showAttentionMarker: true,
      targetType: "water_cooler",
      sortKey: 640,
    });
  });

  it("does not synthesize a duplicate live row when a durable facility-condition occurrence exists", () => {
    const state = createInitialGameState();
    checkInTutorialPatient(state);
    state.facilityLevel = 1;
    state.environment.facilityConditionOccurrences = [
      {
        id: "condition.waiting-room.1",
        conditionKey: "missing_waiting_room",
        kind: "onset",
        occurredAtFacilityTick: 12,
        resolvedAtFacilityTick: null,
        definitionId: "alert.facility.waiting-room-needed",
        message: "Build a Waiting Room.",
        priority: "informational",
        target: {
          kind: "build_mode",
          id: "room.waiting",
        },
      },
      {
        id: "condition.receptionist.1",
        conditionKey: "no_receptionist",
        kind: "onset",
        occurredAtFacilityTick: 13,
        resolvedAtFacilityTick: null,
        definitionId: "alert.staff.receptionist-recommended",
        message: "Hire a receptionist.",
        priority: "informational",
        target: {
          kind: "staff_role",
          id: "staff.receptionist",
        },
      },
    ];

    const items = createMessageBoardView(state);
    expect(
      items.some(
        (item) =>
          item.id === "persistent.facility.waiting-room-needed",
      ),
    ).toBe(false);
    expect(
      items.some(
        (item) =>
          item.id === "persistent.staff.receptionist-recommended",
      ),
    ).toBe(false);
    expect(
      items.find(
        (item) => item.id === "condition.waiting-room.1",
      ),
    ).toMatchObject({
      targetType: "build_mode",
      targetId: "room.waiting",
      sortKey: 12,
    });
    expect(
      items.find(
        (item) => item.id === "condition.receptionist.1",
      ),
    ).toMatchObject({
      targetType: "staff_role",
      targetId: "staff.receptionist",
      sortKey: 13,
    });
  });

  it("does not expose a chart alert before Front Desk check-in", () => {
    const state = createInitialGameState();
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    expect(encounter.patientMovement?.kind).toBe(
      "arriving_for_check_in",
    );

    const items = createMessageBoardView(state);
    expect(
      items.some(
        (item) =>
          item.targetId === encounter.id &&
          item.actionLabel === "Open chart",
      ),
    ).toBe(false);
    expect(
      items.some((item) => item.message.includes("has checked in")),
    ).toBe(false);
  });

  it("routes an overdue unstaffed check-in alert to the Front Desk, not an unavailable chart", () => {
    const state = createInitialGameState();
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    encounter.checkInStatus = "awaiting_staff";
    state.events = [
      event({
        id: "event.patient-check-in-overdue.tutorial.0",
        type: "patience_warning",
        facilityTick: 61,
        encounterId: encounter.id,
        definitionId: "alert.patient.check-in-unattended",
        priority: "action_required",
        target: { kind: "room", id: "room.instance.founder_desk" },
      }),
    ];

    const active = createMessageBoardView(state).find(
      (item) => item.id === "event.patient-check-in-overdue.tutorial.0",
    );
    expect(active).toMatchObject({
      targetType: "room",
      targetId: "room.instance.founder_desk",
      actionLabel: "Show Front Desk",
    });

    encounter.checkInStatus = "checked_in";
    const resolved = createMessageBoardView(state).find(
      (item) => item.id === "event.patient-check-in-overdue.tutorial.0",
    );
    expect(resolved?.actionLabel).toBeUndefined();
    expect(resolved?.targetType).toBeUndefined();
  });

  it("keeps encounter settlement audit events out of Alerts and Events", () => {
    const state = createInitialGameState();
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    encounter.lifecycle = "resolved_summary_available";
    encounter.resolutionReason = "completed";
    encounter.patientMovement = null;
    state.events = [
      {
        id: "event.settlement.tutorial",
        type: "encounter_settled",
        facilityTick: 18,
        encounterId: encounter.id,
        message: "Encounter complete: +$75.",
        priority: "informational",
        definitionId: "alert.patient.complete",
        target: { kind: "encounter", id: encounter.id },
      },
    ];

    expect(
      createMessageBoardView(state).some(
        (item) =>
          item.id === "event.settlement.tutorial" ||
          item.message.includes("Encounter complete: +$"),
      ),
    ).toBe(false);

    encounter.lifecycle = "resolved";
    expect(
      createMessageBoardView(state).some(
        (item) => item.id === "event.settlement.tutorial",
      ),
    ).toBe(false);
  });

  it("hides a legacy decision-ready row without deleting raw history", () => {
    const state = createInitialGameState();
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    encounter.lifecycle = "active_action_required";
    encounter.patientMovement = null;
    encounter.feedAttentionKind = "clinical_decision";
    encounter.feedAttentionStartedAtTick = 6;
    state.facilityTick = 12;
    state.events = [
      {
        id: "event.patient-ready.tutorial",
        type: "patient_arrived",
        facilityTick: 12,
        encounterId: encounter.id,
        message: `${encounter.patientDisplayName} is ready for a clinical decision.`,
        priority: "action_required",
        definitionId: "alert.patient.decision-required",
        target: { kind: "encounter", id: encounter.id },
      },
    ];

    const items = createMessageBoardView(state);
    expect(
      items.filter(
        (item) =>
          item.id === "event.patient-ready.tutorial",
      ),
    ).toHaveLength(0);
    expect(state.events).toHaveLength(1);
  });

  it("does not describe a 25-percent-full cooler as empty", () => {
    const state = createInitialGameState();
    state.encounters = {};
    state.cash = 1_000;
    state.cashCents = 100_000;
    state.environment.waterCoolerFillPercent = 25;
    state.environment.facilityConditionOccurrences = [];
    state.events = state.events.filter(
      (event) => event.type !== "water_cooler_low",
    );

    expect(
      createMessageBoardView(state).some(
        (item) =>
          item.id === "persistent.environment.water-cooler-low" ||
          item.message.toLowerCase().includes("water cooler is empty"),
      ),
    ).toBe(false);
  });
});
