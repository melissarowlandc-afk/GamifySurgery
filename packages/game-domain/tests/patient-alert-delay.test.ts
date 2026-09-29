import { describe, expect, it } from "vitest";
import {
  TUTORIAL_ENCOUNTER_ID,
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  serializeGameState,
  type GameState,
} from "../src";

function tick(state: GameState, operationId: string): GameState {
  return gameReducer(state, {
    type: "ADVANCE_TICK",
    operationId,
  });
}

function advance(
  state: GameState,
  minutes: number,
  prefix: string,
): GameState {
  let next = state;
  for (let minute = 1; minute <= minutes; minute += 1) {
    next = tick(next, `${prefix}.${minute}`);
  }
  return next;
}

function quietTutorialState(): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: "campaign.patient-alert-delay",
    campaignSeed: "patient-alert-delay",
    createdAtRealMs: 0,
  });
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.alertHumor.nextAmbientAlertTick = null;
  state.rooms.push({ id: "room.instance.starter_examination", roomDefinitionId: "room.examination", x: 34, y: 26, orientation: 0, doorSide: "south", upgradeLevel: 1, cleanliness: 100 });
  state.doors.push({ id: "door.instance.starter_examination", roomId: "room.instance.starter_examination", side: "south", offset: 1, exterior: false });
  const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
  encounter.patientMovement = null;
  encounter.patientLocation = { x: 36, y: 27 };
  encounter.assignedRoomInstanceId = "room.instance.starter_examination";
  encounter.checkInStatus = "checked_in";
  encounter.checkInWaitingSinceTick = null;
  encounter.idleWaitingSinceTick = state.facilityTick;
  return state;
}

describe("delayed patient attention events", () => {
  it("keeps an unstaffed Front Desk arrival unavailable, then applies one overdue consequence strictly after an hour", () => {
    let state = quietTutorialState();
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    encounter.lifecycle = "waiting_unopened";
    encounter.checkInStatus = "awaiting_staff";
    encounter.checkInWaitingSinceTick = state.facilityTick;
    encounter.unstaffedCheckInOverdueApplied = false;
    encounter.feedAttentionKind = null;
    encounter.feedAttentionStartedAtTick = null;
    const deskLocation = { ...state.environment.founderLocation };
    state.environment.founderLocation = { x: 0, y: 0 };
    const before = encounter.patientSatisfaction;

    const rejected = gameReducer(state, {
      type: "OPEN_CHART",
      operationId: "awaiting-staff.open-chart",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    expect(
      rejected.operationReceipts["awaiting-staff.open-chart"],
    ).toMatchObject({ status: "rejected" });

    state = advance(state, 60, "check-in-overdue.before-threshold");
    expect(state.encounters[TUTORIAL_ENCOUNTER_ID]!.checkInStatus).toBe(
      "awaiting_staff",
    );
    expect(
      state.events.some(
        (event) => event.definitionId === "alert.patient.check-in-unattended",
      ),
    ).toBe(false);
    expect(state.encounters[TUTORIAL_ENCOUNTER_ID]!.patientSatisfaction).toBe(
      before,
    );

    const restored = deserializeGameState(serializeGameState(state));
    restored.environment.founderLocation = deskLocation;
    state = tick(restored, "check-in-overdue.after-threshold");
    const overdueEvents = state.events.filter(
      (event) => event.definitionId === "alert.patient.check-in-unattended",
    );
    expect(overdueEvents).toHaveLength(1);
    expect(overdueEvents[0]).toMatchObject({
      facilityTick: 61,
      priority: "action_required",
      target: { kind: "room", id: "room.instance.founder_desk" },
    });
    expect(
      state.encounters[TUTORIAL_ENCOUNTER_ID]!.patientSatisfaction,
    ).toBe(
      before -
        PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.patientSatisfaction
          .unstaffedCheckInSatisfactionPenalty,
    );
    expect(
      state.encounters[TUTORIAL_ENCOUNTER_ID]!.unstaffedCheckInOverdueApplied,
    ).toBe(true);
    expect(state.encounters[TUTORIAL_ENCOUNTER_ID]!.checkInStatus).toBe(
      "checked_in",
    );

    state = advance(state, 10, "check-in-overdue.no-repeat");
    expect(
      state.events.filter(
        (event) => event.definitionId === "alert.patient.check-in-unattended",
      ),
    ).toHaveLength(1);
  });

  it("keeps a saved awaiting check-in operationally unstarted until staffed", () => {
    let state = quietTutorialState();
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    const deskLocation = { ...state.environment.founderLocation };
    encounter.lifecycle = "waiting_unopened";
    encounter.checkInStatus = "awaiting_staff";
    encounter.checkInWaitingSinceTick = state.facilityTick;
    encounter.feedAttentionKind = null;
    encounter.feedAttentionStartedAtTick = null;
    encounter.facilityExperienceAtCheckIn = null;
    state.environment.founderLocation = { x: 0, y: 0 };

    state = deserializeGameState(serializeGameState(state));
    const restoredEncounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    expect(restoredEncounter.checkInStatus).toBe("awaiting_staff");
    expect(restoredEncounter.facilityExperienceAtCheckIn).toBeNull();
    expect(restoredEncounter.feedAttentionKind).toBeNull();
    expect(restoredEncounter.feedAttentionStartedAtTick).toBeNull();

    state.environment.founderLocation = deskLocation;
    state = tick(state, "awaiting-staff.staffed");
    const checkedIn = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    expect(checkedIn.checkInStatus).toBe("checked_in");
    expect(checkedIn.facilityExperienceAtCheckIn).not.toBeNull();
    expect(checkedIn.feedAttentionKind).toBe("checked_in");
    const experience = checkedIn.facilityExperienceAtCheckIn;

    state = tick(state, "awaiting-staff.no-double-assessment");
    expect(
      state.encounters[TUTORIAL_ENCOUNTER_ID]!.facilityExperienceAtCheckIn,
    ).toEqual(experience);
  });

  it("migrates version-six arrivals safely while preserving already checked-in charts", () => {
    const arrivalState = createInitialGameState(undefined, {
      campaignId: "campaign.v6-arrival",
      campaignSeed: "v6-arrival",
      createdAtRealMs: 0,
    });
    const arriving = JSON.parse(serializeGameState(arrivalState)) as {
      schemaVersion: number;
      encounters: Record<string, Record<string, unknown>>;
    };
    arriving.schemaVersion = 6;
    delete arriving.encounters[TUTORIAL_ENCOUNTER_ID]!.checkInStatus;
    delete arriving.encounters[TUTORIAL_ENCOUNTER_ID]!.checkInWaitingSinceTick;
    delete arriving.encounters[TUTORIAL_ENCOUNTER_ID]!
      .unstaffedCheckInOverdueApplied;
    const restoredArrival = deserializeGameState(JSON.stringify(arriving));
    expect(restoredArrival.schemaVersion).toBe(8);
    expect(
      restoredArrival.encounters[TUTORIAL_ENCOUNTER_ID]!.checkInStatus,
    ).toBe("approaching");

    const state = quietTutorialState();
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    encounter.patientMovement = null;
    const checkedIn = JSON.parse(serializeGameState(state)) as {
      schemaVersion: number;
      encounters: Record<string, Record<string, unknown>>;
    };
    checkedIn.schemaVersion = 6;
    delete checkedIn.encounters[TUTORIAL_ENCOUNTER_ID]!.checkInStatus;
    delete checkedIn.encounters[TUTORIAL_ENCOUNTER_ID]!.checkInWaitingSinceTick;
    delete checkedIn.encounters[TUTORIAL_ENCOUNTER_ID]!
      .unstaffedCheckInOverdueApplied;
    const restoredCheckedIn = deserializeGameState(JSON.stringify(checkedIn));
    expect(
      restoredCheckedIn.encounters[TUTORIAL_ENCOUNTER_ID]!.checkInStatus,
    ).toBe("checked_in");
  });

  it("records actual idle waiting once only after more than 60 facility minutes", () => {
    let state = quietTutorialState();
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    encounter.lifecycle = "waiting_unopened";
    encounter.firstOpenedAtTick = null;
    encounter.feedAttentionKind = "checked_in";
    encounter.feedAttentionStartedAtTick = state.facilityTick;
    encounter.idleWaitingSinceTick = state.facilityTick;

    state = advance(state, 60, "checked-in.before-threshold");
    expect(
      state.events.some(
        (event) => event.definitionId === "alert.patient.waiting",
      ),
    ).toBe(false);

    const restored = deserializeGameState(serializeGameState(state));
    expect(
      restored.encounters[TUTORIAL_ENCOUNTER_ID],
    ).toMatchObject({
      feedAttentionKind: "checked_in",
      feedAttentionStartedAtTick: 0,
    });

    state = tick(restored, "checked-in.after-threshold");
    expect(
      state.events.filter(
        (event) => event.definitionId === "alert.patient.waiting",
      ),
    ).toHaveLength(1);
    expect(
      state.events.find(
        (event) => event.definitionId === "alert.patient.waiting",
      ),
    ).toMatchObject({
      facilityTick: 61,
      priority: "action_required",
      target: {
        kind: "encounter",
        id: TUTORIAL_ENCOUNTER_ID,
      },
    });
    expect(
      state.alertHumor.conditionLastEmittedTicks[
        `patient.waiting:${TUTORIAL_ENCOUNTER_ID}`
      ],
    ).toBe(61);
    state.events = [];
    state = tick(state, "checked-in.same-episode-after-history-trim");
    expect(
      state.events.filter(
        (event) => event.definitionId === "alert.patient.waiting",
      ),
    ).toHaveLength(0);
    state.encounters[TUTORIAL_ENCOUNTER_ID]!.idleWaitingSinceTick = 61;
    state = advance(state, 59, "checked-in.new-episode.same-tick");
    expect(
      state.events.some(
        (event) => event.definitionId === "alert.patient.waiting",
      ),
    ).toBe(false);
    state = tick(state, "checked-in.new-episode.after-threshold");
    expect(
      state.events.find(
        (event) => event.definitionId === "alert.patient.waiting",
      ),
    ).toMatchObject({ facilityTick: 122 });
  });

  it("never records a brief checked-in wait that the player addresses", () => {
    let state = quietTutorialState();
    state.rooms.push({
      id: "room.test.patient-alert-exam",
      roomDefinitionId: "room.examination",
      x: 34,
      y: 26,
      orientation: 0,
      doorSide: "south",
      upgradeLevel: 1,
      cleanliness: 100,
    });
    state.doors.push({
      id: "door.test.patient-alert-exam",
      roomId: "room.test.patient-alert-exam",
      side: "south",
      offset: 1,
      exterior: false,
    });
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    encounter.lifecycle = "waiting_unopened";
    encounter.firstOpenedAtTick = null;
    encounter.feedAttentionKind = "checked_in";
    encounter.feedAttentionStartedAtTick = 0;

    state = advance(state, 5, "checked-in.brief");
    state = gameReducer(state, {
      type: "OPEN_CHART",
      operationId: "checked-in.open",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    state = advance(state, 2, "checked-in.after-open");

    expect(
      state.events.some(
        (event) => event.definitionId === "alert.patient.waiting",
      ),
    ).toBe(false);
    expect(state.encounters[TUTORIAL_ENCOUNTER_ID]).toMatchObject({
      feedAttentionKind: null,
      feedAttentionStartedAtTick: null,
    });
  });

  it("records a generic clinical wait only after more than 60 idle minutes", () => {
    let state = quietTutorialState();
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    encounter.lifecycle = "active_action_required";
    encounter.steps[encounter.currentNodeIndex]!.status =
      "action_required";
    encounter.feedAttentionKind = "clinical_decision";
    encounter.feedAttentionStartedAtTick = 0;
    encounter.idleWaitingSinceTick = 0;

    state = advance(state, 60, "decision.before-threshold");
    expect(
      state.events.some(
        (event) =>
          event.definitionId === "alert.patient.waiting",
      ),
    ).toBe(false);

    state = tick(state, "decision.after-threshold");
    expect(
      state.events.find(
        (event) =>
          event.definitionId === "alert.patient.waiting",
      ),
    ).toMatchObject({
      type: "patience_warning",
      facilityTick: 61,
      message: expect.stringContaining(
        "has been waiting for clinical attention",
      ),
      priority: "action_required",
    });
  });

  it("suppresses result-ready feed events but alerts after a returned patient idles", () => {
    let state = quietTutorialState();
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    encounter.lifecycle = "active_action_required";
    encounter.steps[encounter.currentNodeIndex]!.status =
      "action_required";
    encounter.feedAttentionKind = "result_ready";
    encounter.feedAttentionStartedAtTick = 0;
    encounter.idleWaitingSinceTick = 0;
    encounter.pendingResult = {
      operationId: "result.delay.test",
      gateId: "gate.delay.test",
      originatingNodeIndex: -1,
      resultTypeId: "result.synthetic",
      pendingLabel: "Second training result pending",
      resultNarrative: "Synthetic result.",
      routeId: "service.route.synthetic",
      routeDisplayName: "Synthetic service",
      scheduledAtTick: 0,
      serviceDurationTicks: 10,
      durationTicks: 10,
      dueTick: 0,
      deliveredAtTick: 0,
      offsiteReturnStartedAtTick: null,
      offsiteTravel: null,
      patientTravel: null,
    };

    state = advance(state, 60, "result.before-threshold");
    expect(
      state.events.some((event) => event.type === "result_ready"),
    ).toBe(false);

    state = tick(state, "result.after-threshold");
    expect(state.events.some((event) => event.type === "result_ready")).toBe(false);
    expect(
      state.events.find(
        (event) => event.definitionId === "alert.patient.waiting",
      ),
    ).toMatchObject({
      type: "patience_warning",
      facilityTick: 61,
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });

    state = gameReducer(state, {
      type: "OPEN_CHART",
      operationId: "result.open",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    expect(state.encounters[TUTORIAL_ENCOUNTER_ID]).toMatchObject({
      feedAttentionKind: null,
      feedAttentionStartedAtTick: null,
    });
    state = gameReducer(state, {
      type: "CLOSE_CHART",
      operationId: "result.close",
      encounterId: TUTORIAL_ENCOUNTER_ID,
    });
    expect(state.encounters[TUTORIAL_ENCOUNTER_ID]).toMatchObject({
      feedAttentionKind: "result_ready",
      feedAttentionStartedAtTick: 61,
      patientMovement: expect.objectContaining({
        kind: "walking_to_waiting",
      }),
    });
    state = advance(state, 1, "result.after-close.no-duplicate");
    expect(
      state.events.filter((event) => event.type === "result_ready"),
    ).toHaveLength(0);
  });

  it("resets the no-arrival clock when an offsite patient reaches the clinic", () => {
    let state = quietTutorialState();
    state.facilityTick = 10;
    state.alertHumor.lastPatientArrivalTick = 2;
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    encounter.lifecycle = "active_action_required";
    encounter.steps[encounter.currentNodeIndex]!.status = "action_required";
    encounter.patientLocation = { x: 34, y: 29 };
    encounter.patientMovement = {
      kind: "returning_from_offsite_testing",
      path: [{ x: 34, y: 29 }],
      pathIndex: 0,
      lastMovedAtFacilityTick: 10,
      destinationRoomInstanceId: "room.instance.founder_desk",
    };

    state = tick(state, "offsite.return.arrival");
    expect(state.alertHumor.lastPatientArrivalTick).toBe(11);
    expect(state.events.some((event) => event.type === "result_ready")).toBe(false);
  });

  it("normalizes legacy unresolved attention timing without rerolling it", () => {
    const state = quietTutorialState();
    state.facilityTick = 4;
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    encounter.lifecycle = "waiting_unopened";
    encounter.idleWaitingSinceTick = 2;
    encounter.feedAttentionKind = "checked_in";
    encounter.feedAttentionStartedAtTick = 2;
    const legacy = JSON.parse(
      serializeGameState(state),
    ) as {
      encounters: Record<string, Record<string, unknown>>;
    };
    delete legacy.encounters[TUTORIAL_ENCOUNTER_ID]!
      .feedAttentionKind;
    delete legacy.encounters[TUTORIAL_ENCOUNTER_ID]!
      .feedAttentionStartedAtTick;

    const restored = deserializeGameState(JSON.stringify(legacy));
    expect(restored.encounters[TUTORIAL_ENCOUNTER_ID]).toMatchObject({
      feedAttentionKind: "checked_in",
      feedAttentionStartedAtTick: 2,
    });
  });
});
