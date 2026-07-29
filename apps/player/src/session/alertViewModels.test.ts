import { describe, expect, it } from "vitest";
import {
  TUTORIAL_ENCOUNTER_ID,
  createInitialGameState,
  deserializeGameState,
  serializeGameState,
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
}

describe("createMessageBoardView data-driven alerts", () => {
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
      persistent: false,
    });
  });

  it("shows an attention marker only for action-required items", () => {
    const state = createInitialGameState();
    checkInTutorialPatient(state);
    state.facilityLevel = 1;
    state.cash = 1_000;
    state.cashCents = 100_000;
    state.events = [
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
        type: "water_cooler_refilled",
        facilityTick: 2,
        message: "Refilled.",
        priority: "informational",
        definitionId: "alert.success.water-refilled",
        alertCategory: "success",
      }),
    ];

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

    const items = createMessageBoardView(state);

    expect(
      items.find(
        (item) =>
          item.id === "persistent.staff.receptionist-recommended",
      ),
    ).toMatchObject({
      category: "guidance",
      showAttentionMarker: false,
      targetType: "staff_role",
      targetId: "staff.receptionist",
      actionLabel: "Show receptionist hiring",
      message: expect.stringContaining("Hire a receptionist"),
    });
    expect(
      items.find(
        (item) =>
          item.id === "persistent.facility.waiting-room-needed",
      ),
    ).toMatchObject({
      category: "guidance",
      showAttentionMarker: false,
      targetType: "build_mode",
      actionLabel: "Open Build Mode",
    });
    expect(
      items.find(
        (item) => item.id === "persistent.environment.trash-visible",
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
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    state.facilityLevel = 1;
    state.cash = 1_000;
    state.cashCents = 100_000;
    encounter.lifecycle = "active_pending_result";
    encounter.patientMovement = null;
    encounter.pendingResult = {
      operationId: "result.guidance",
      gateId: "gate.guidance",
      originatingNodeIndex: 0,
      resultTypeId: "service.xray",
      pendingLabel: "Chest X-ray",
      resultNarrative: "Result",
      routeId: "route.xray.outsourced",
      routeDisplayName: "Offsite X-ray",
      scheduledAtTick: 0,
      serviceDurationTicks: 120,
      durationTicks: 120,
      dueTick: 120,
      deliveredAtTick: null,
      offsiteReturnStartedAtTick: null,
      patientTravel: null,
    };

    expect(
      createMessageBoardView(state).find(
        (item) =>
          item.id ===
          "persistent.facility.onsite-imaging-requested",
      ),
    ).toMatchObject({
      category: "guidance",
      showAttentionMarker: false,
      targetType: "build_mode",
      message: expect.stringContaining("Build an X-ray room"),
    });

    state.rooms.push({
      id: "room.xray.guidance",
      roomDefinitionId: "room.xray",
      x: 20,
      y: 20,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    });
    const withRoom = createMessageBoardView(state);
    expect(
      withRoom.some(
        (item) =>
          item.id ===
          "persistent.facility.onsite-imaging-requested",
      ),
    ).toBe(false);
    expect(
      withRoom.find(
        (item) =>
          item.id ===
          "persistent.staff.imaging-technician-needed",
      ),
    ).toMatchObject({
      category: "guidance",
      showAttentionMarker: false,
      targetType: "staff_role",
      targetId: "staff.imaging_technician",
      actionLabel: "Show imaging technician hiring",
    });
  });

  it("shows the below-75% walkout warning once per patient", () => {
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
      id: `persistent.patient.${encounter.id}.leave-warning`,
      category: "action_required",
      showAttentionMarker: true,
      targetType: "patient",
      actionLabel: "Open chart",
      persistent: true,
    });
    expect(patientItems[0]?.message).toContain(
      encounter.patientDisplayName,
    );
  });

  it("does not duplicate event rows already represented by a persistent condition", () => {
    const state = createInitialGameState();
    checkInTutorialPatient(state);
    state.environment.waterCoolerFillPercent = 10;
    state.events = [
      event({
        id: "event.arrival.1",
        type: "patient_arrived",
        facilityTick: 1,
        encounterId: TUTORIAL_ENCOUNTER_ID,
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
        target: {
          kind: "encounter",
          id: TUTORIAL_ENCOUNTER_ID,
        },
      }),
      event({
        id: "event.water.1",
        type: "water_cooler_low",
        facilityTick: 3,
        target: {
          kind: "room",
          id: "room.instance.founder_desk",
        },
      }),
      event({
        id: "event.water.2",
        type: "water_cooler_low",
        facilityTick: 4,
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
    ).toHaveLength(1);
    expect(
      items.filter(
        (item) =>
          item.id === "persistent.environment.water-cooler-low",
      ),
    ).toHaveLength(1);
    for (const eventId of [
      "event.arrival.1",
      "event.arrival.2",
      "event.water.1",
      "event.water.2",
    ]) {
      expect(items.some((item) => item.id === eventId)).toBe(false);
    }
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

  it("renders success copy from the registry and preserves its useful target", () => {
    const state = createInitialGameState();
    state.encounters = {};
    state.cash = 1_000;
    state.cashCents = 100_000;
    state.rooms.push({
      id: "room.waiting.success",
      roomDefinitionId: "room.waiting",
      x: 20,
      y: 20,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    });
    state.events = [
      event({
        id: "event.waiting-room.success",
        type: "room_placed",
        facilityTick: 8,
        message:
          "Waiting Room opened. Patients may now wait professionally.",
        definitionId: "alert.success.waiting-room-constructed",
        alertCategory: "success",
        alertVariantId:
          "alert.success.waiting-room-constructed.default",
        target: { kind: "room", id: "room.waiting.success" },
      }),
    ];

    expect(
      createMessageBoardView(state).find(
        (item) => item.id === "event.waiting-room.success",
      ),
    ).toMatchObject({
      category: "success",
      priority: "informational",
      showAttentionMarker: false,
      title: "Waiting Room opened",
      message:
        "Waiting Room opened. Patients may now wait professionally.",
      targetType: "room",
      targetId: "room.waiting.success",
      actionLabel: "Show room",
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
});
