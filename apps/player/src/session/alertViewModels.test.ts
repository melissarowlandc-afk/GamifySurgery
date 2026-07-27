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

  it("consolidates escalating patience warnings and suppresses flavor while critical", () => {
    const state = createInitialGameState();
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    state.facilityTick = 4;
    encounter.waiting.patienceExempt = false;
    encounter.waiting.departureDueTick = 4;
    encounter.waiting.warningThresholdsShown = [2, 0];
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

    const items = createMessageBoardView(state);
    const patientAlerts = items.filter(
      (item) => item.targetId === encounter.id && item.priority !== "flavor",
    );

    expect(patientAlerts).toHaveLength(1);
    expect(patientAlerts[0]).toMatchObject({
      id: `persistent.patient.${encounter.id}.waiting`,
      priority: "critical",
      persistent: true,
    });
    expect(patientAlerts[0]?.message).toContain(encounter.patientDisplayName);
    expect(items.some((item) => item.priority === "flavor")).toBe(false);
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
