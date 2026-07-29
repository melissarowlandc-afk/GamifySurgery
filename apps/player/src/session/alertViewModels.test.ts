import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_ALERT_DEFINITIONS,
  PROTOTYPE_FLAVOR_POOLS,
} from "@gamify-surgery/balance-config";
import {
  TUTORIAL_ENCOUNTER_ID,
  createInitialGameState,
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

describe("prototype alert data", () => {
  it("uses unique stable IDs and complete current-level routing metadata", () => {
    const ids = PROTOTYPE_ALERT_DEFINITIONS.map((definition) => definition.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const definition of PROTOTYPE_ALERT_DEFINITIONS) {
      expect(definition.id).toMatch(/^alert\.[a-z0-9.-]+$/);
      expect(definition.titleTemplate.trim()).not.toBe("");
      expect(definition.bodyTemplate.trim()).not.toBe("");
      expect(definition.consolidationKeyTemplate.trim()).not.toBe("");
      expect(definition.priority).not.toBe("flavor");
      expect(definition.eligibleFacilityLevels.length).toBeGreaterThan(0);
      expect(
        definition.eligibleFacilityLevels.every(
          (level) => level === 0 || level === 1,
        ),
      ).toBe(true);

      if (definition.targetKind === "patient") {
        expect(definition.clickAction).toBe("open_patient");
      }
      if (definition.targetKind === "room") {
        expect(definition.clickAction).toBe("open_room");
      }
      if (definition.targetKind === "employee") {
        expect(definition.clickAction).toBe("open_employee");
      }
    }
  });

  it("keeps flavor pools deterministic-ready, noncritical, and internally unique", () => {
    const poolIds = PROTOTYPE_FLAVOR_POOLS.map((pool) => pool.id);
    expect(new Set(poolIds).size).toBe(poolIds.length);

    for (const pool of PROTOTYPE_FLAVOR_POOLS) {
      expect(pool.cooldownTicks).toBeGreaterThan(0);
      expect(pool.permittedDuringCritical).toBe(false);
      expect(pool.messages.length).toBeGreaterThan(1);
      expect(new Set(pool.messages).size).toBe(pool.messages.length);
    }
  });
});

describe("createMessageBoardView", () => {
  it("creates one clickable persistent alert for a waiting patient", () => {
    const state = createInitialGameState();
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    encounter.patientMovement = null;
    encounter.patientLocation = { x: 34, y: 29 };
    encounter.assignedRoomInstanceId = "room.instance.founder_desk";
    state.events = [
      event({
        id: "event.patient-arrived.test",
        type: "patient_arrived",
        facilityTick: 0,
        encounterId: TUTORIAL_ENCOUNTER_ID,
        message: "A patient arrived.",
        priority: "action_required",
        target: { kind: "encounter", id: TUTORIAL_ENCOUNTER_ID },
      }),
    ];

    const items = createMessageBoardView(state);
    const actionable = items.filter(
      (item) =>
        item.targetId === TUTORIAL_ENCOUNTER_ID &&
        item.priority === "action_required",
    );

    expect(actionable).toHaveLength(1);
    expect(actionable[0]).toMatchObject({
      id: `persistent.patient.${TUTORIAL_ENCOUNTER_ID}.waiting`,
      targetType: "patient",
      targetId: TUTORIAL_ENCOUNTER_ID,
      actionLabel: "Open chart",
      persistent: true,
    });
    expect(items.some((item) => item.id === "event.patient-arrived.test")).toBe(
      false,
    );
    expect(
      items.find((item) => item.id === "persistent.finance.low-cash"),
    ).toMatchObject({
      targetType: "emergency_glp1",
      actionLabel: "Open emergency cash option",
    });
  });

  it("does not claim a patient checked in while the patient is still approaching the Front Desk", () => {
    const state = createInitialGameState();
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    expect(encounter.patientMovement?.kind).toBe("arriving_for_check_in");

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

  it("shows one leave warning only below 75% and ignores the obsolete countdown", () => {
    const state = createInitialGameState();
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    state.facilityTick = 4;
    encounter.patientMovement = null;
    encounter.patientLocation = { x: 34, y: 29 };
    encounter.assignedRoomInstanceId = "room.instance.founder_desk";
    encounter.waiting.patienceExempt = false;
    encounter.waiting.departureDueTick = 0;
    encounter.waiting.warningThresholdsShown = [8, 4, 0];
    encounter.patientSatisfaction = 75;
    state.events = [
      event({
        id: "event.patient-arrived.test",
        type: "patient_arrived",
        facilityTick: 0,
        encounterId: encounter.id,
        target: { kind: "encounter", id: encounter.id },
      }),
      event({
        id: "event.patience-warning.test.2",
        type: "patience_warning",
        facilityTick: 2,
        encounterId: encounter.id,
        priority: "action_required",
        target: { kind: "encounter", id: encounter.id },
      }),
      event({
        id: "event.patience-warning.test.0",
        type: "patience_warning",
        facilityTick: 4,
        encounterId: encounter.id,
        priority: "critical",
        target: { kind: "encounter", id: encounter.id },
      }),
    ];

    const atThreshold = createMessageBoardView(state);
    expect(
      atThreshold.some((item) => item.priority === "critical"),
    ).toBe(false);

    encounter.patientSatisfaction = 74;
    encounter.satisfactionWarningsShown = [75];
    const items = createMessageBoardView(state);
    const patientAlerts = items.filter(
      (item) => item.targetId === encounter.id && item.priority !== "flavor",
    );

    expect(patientAlerts).toHaveLength(1);
    expect(patientAlerts[0]).toMatchObject({
      id: `persistent.patient.${encounter.id}.leave-warning`,
      priority: "critical",
      persistent: true,
    });
    expect(patientAlerts[0]?.message).toContain(encounter.patientDisplayName);
    expect(items.some((item) => item.priority === "flavor")).toBe(false);
  });

  it("provides stable receptionist, amenity, and cleanliness guidance without stacking copies", () => {
    const state = createInitialGameState();
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    state.facilityLevel = 1;
    state.facilityTick = 31;
    state.cash = 1_000;
    state.cashCents = 100_000;
    encounter.waiting.patienceExempt = false;
    encounter.patientMovement = null;
    encounter.patientLocation = { x: 34, y: 29 };
    state.environment.litterItems = [
      {
        id: "litter.guidance",
        roomId: "room.instance.founder_desk",
        location: { x: 34, y: 29 },
        spawnedAtFacilityTick: 30,
      },
    ];

    const first = createMessageBoardView(state);
    const second = createMessageBoardView(cloneState(state));
    const guidanceIds = [
      "persistent.staff.receptionist-recommended",
      "persistent.facility.waiting-room-needed",
      "persistent.facility.bathroom-needed",
      "persistent.facility.cleanliness-low",
    ];

    for (const id of guidanceIds) {
      expect(first.filter((item) => item.id === id)).toHaveLength(1);
      expect(second.filter((item) => item.id === id)).toHaveLength(1);
    }
    expect(
      first.find(
        (item) =>
          item.id === "persistent.staff.receptionist-recommended",
      ),
    ).toMatchObject({
      targetType: "employee",
      actionLabel: "View employees",
    });
    expect(
      first.find(
        (item) =>
          item.id === "persistent.facility.waiting-room-needed",
      ),
    ).toMatchObject({
      targetType: "build_mode",
      actionLabel: "Open Build Mode",
    });
  });

  it("distinguishes missing onsite X-ray from a built X-ray without a technician", () => {
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
      targetType: "build_mode",
      message: expect.stringContaining("available onsite"),
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
      targetType: "employee",
      message: expect.stringContaining("Imaging Technician"),
    });
  });

  it("expires stale critical patience alerts and treats a completed departure as informational", () => {
    const state = createInitialGameState();
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    state.facilityTick = 5;
    encounter.lifecycle = "resolved";
    encounter.resolutionReason = "walkout";
    state.events = [
      event({
        id: "event.patience-warning.stale",
        type: "patience_warning",
        facilityTick: 4,
        encounterId: encounter.id,
        priority: "critical",
        target: { kind: "encounter", id: encounter.id },
      }),
      event({
        id: "event.left-before-seen.test",
        type: "left_before_seen",
        facilityTick: 5,
        encounterId: encounter.id,
        message: `${encounter.patientDisplayName} left without being seen.`,
        priority: "critical",
        target: { kind: "encounter", id: encounter.id },
      }),
    ];

    const items = createMessageBoardView(state);
    const departure = items.find(
      (item) => item.id === "event.left-before-seen.test",
    );

    expect(items.some((item) => item.id === "event.patience-warning.stale")).toBe(
      false,
    );
    expect(departure).toMatchObject({
      priority: "informational",
      targetType: "patient",
      targetId: encounter.id,
      actionLabel: "Open chart",
    });
    expect(items.some((item) => item.priority === "critical")).toBe(false);
    expect(items.some((item) => item.priority === "flavor")).toBe(true);
  });

  it("applies minute cooldowns and chooses reproducible flavor lines", () => {
    const state = createInitialGameState();
    state.encounters = {};
    state.facilityTick = 4;
    state.events = [
      event({
        id: "event.room.1",
        type: "room_placed",
        facilityTick: 1,
        target: { kind: "room", id: "room.1" },
      }),
      event({
        id: "event.room.2",
        type: "room_placed",
        facilityTick: 2,
        target: { kind: "room", id: "room.2" },
      }),
      event({
        id: "event.room.3",
        type: "room_placed",
        facilityTick: 4,
        target: { kind: "room", id: "room.3" },
      }),
    ];

    const first = createMessageBoardView(state).filter(
      (item) => item.priority === "flavor",
    );
    const second = createMessageBoardView(cloneState(state)).filter(
      (item) => item.priority === "flavor",
    );

    expect(first).toHaveLength(1);
    expect(first.map((item) => item.id)).toEqual([
      "flavor.event.room.1.construction",
    ]);
    expect(first.map((item) => item.message)).toEqual(
      second.map((item) => item.message),
    );
  });

  it("uses stable click targets for room and employee events", () => {
    const state = createInitialGameState();
    state.encounters = {};
    state.facilityLevel = 1;
    state.events = [
      event({
        id: "event.room.target",
        type: "room_placed",
        facilityTick: 1,
        target: { kind: "room", id: "room.target" },
      }),
      event({
        id: "event.employee.target",
        type: "staff_hired",
        facilityTick: 2,
        target: { kind: "employee", id: "employee.target" },
      }),
    ];

    const items = createMessageBoardView(state);

    expect(items.find((item) => item.id === "event.room.target")).toMatchObject({
      targetType: "room",
      targetId: "room.target",
      actionLabel: "Show room",
    });
    expect(
      items.find((item) => item.id === "event.employee.target"),
    ).toMatchObject({
      targetType: "employee",
      targetId: "employee.target",
      actionLabel: "Show employee",
    });
  });

  it("routes a low-water alert to the visible refill interaction", () => {
    const state = createInitialGameState();
    state.encounters = {};
    state.environment.waterCoolerFillPercent = 10;
    state.events = [
      event({
        id: "event.water-cooler.low",
        type: "water_cooler_low",
        facilityTick: 12,
        message: "The water cooler needs refilling.",
        target: {
          kind: "room",
          id: "room.instance.founder_desk",
        },
      }),
    ];

    expect(
      createMessageBoardView(state).find(
        (item) =>
          item.id === "persistent.environment.water-cooler-low",
      ),
    ).toMatchObject({
      targetType: "water_cooler",
      actionLabel: "Show water cooler",
      persistent: true,
    });
    expect(
      createMessageBoardView(state).some(
        (item) => item.id === "event.water-cooler.low",
      ),
    ).toBe(false);

    state.environment.waterCoolerFillPercent = 100;
    expect(
      createMessageBoardView(state).some(
        (item) =>
          item.id === "persistent.environment.water-cooler-low",
      ),
    ).toBe(false);
  });

  it("keeps the bounded emergency consultation update informational and useful", () => {
    const state = createInitialGameState();
    state.encounters = {};
    state.cash = 40;
    state.events = [
      event({
        id: "event.emergency-glp1.test",
        type: "emergency_glp1_consultation",
        facilityTick: 1,
        message: "Emergency GLP-1 consultation completed: +$20.",
        priority: "informational",
        target: { kind: "campaign", id: state.campaignId },
      }),
    ];

    const items = createMessageBoardView(state);
    const update = items.find(
      (item) => item.id === "event.emergency-glp1.test",
    );

    expect(update).toMatchObject({
      priority: "informational",
      title: "Emergency side business",
      message: "Emergency GLP-1 consultation completed: +$20.",
      persistent: false,
    });
  });
});
