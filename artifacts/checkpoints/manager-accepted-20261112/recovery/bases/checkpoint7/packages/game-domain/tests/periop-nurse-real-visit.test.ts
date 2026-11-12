import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getCurrentPeriopNurseAttention, getPeriopNurseStandingPoints, getRoomDefinition, getRoomNavigableTiles, isEmployeeAwayForTraining,
  periopNurseAttentionStatus, PROTOTYPE_DOMAIN_CONTEXT } from "../src";
import { periopNurses, periopFlowFixture } from "./periop-nurse-flow-fixture";
import { periopRealVisitFixture } from "./periop-nurse-real-visit-fixture";

describe("Peri-op nurses through the real chart UI command pipeline", () => {
  it("checks a normally arriving colonoscopy patient before procedure and discharge", () => {
    const clinic = periopRealVisitFixture();
    const checks = new Map<string, { nurse: string; walked: boolean; stood: boolean }>();
    const phases = new Set<string>();
    const transitions: unknown[] = [];
    let last = "";
    let checkedIn = false;
    for (let minute = 0; minute < 360; minute++) {
      const state = clinic.advance();
      const patient = state.encounters["periop.real.patient"]!;
      checkedIn ||= patient.checkInStatus === "checked_in";
      const operation = state.serviceOperations.find((entry) => entry.actorId === patient.id);
      const signature = `${patient.lifecycle}:${patient.currentNodeIndex}:${patient.checkInStatus}:${operation?.status}:${operation?.phaseIndex}`;
      if (signature !== last) {
        transitions.push({ tick: state.facilityTick, signature, patient: patient.patientLocation, movement: patient.patientMovement?.kind,
          attention: operation?.periopNurseAttention, phases: operation?.frozenOperationPhases, receipts: Object.values(state.operationReceipts).slice(-1) });
        last = signature;
      }
      if (operation) {
        const phase = operation.frozenOperationPhases?.[operation.phaseIndex];
        if (operation.status === "in_service" && phase) phases.add(phase.id);
        const task = getCurrentPeriopNurseAttention(operation);
        if (task?.employeeId) {
          const nurse = state.employees.find((entry) => entry.id === task.employeeId)!;
          const prior = checks.get(task.kind) ?? { nurse: nurse.id, walked: false, stood: false };
          prior.walked ||= nurse.pathIndex < nurse.path.length - 1;
          if (task.startedAtFacilityTick !== null) {
            expect(nurse.location).toEqual(task.standingPoint);
            expect(getPeriopNurseStandingPoints(state, operation, PROTOTYPE_DOMAIN_CONTEXT)).toContainEqual(nurse.location);
            expect(patient.patientLocation).toEqual(operation.periopBedReservation?.endpoint);
            prior.stood = true;
          }
          checks.set(task.kind, prior);
        }
        if (operation.phaseIndex > 0) expect(operation.periopNurseAttention?.tasks.find((task) => task.kind === "pre_op")?.completedAtFacilityTick, JSON.stringify(transitions)).toEqual(expect.any(Number));
        if (operation.status === "completed") {
          expect(operation.periopNurseAttention?.tasks.find((task) => task.kind === "post_op")?.completedAtFacilityTick, JSON.stringify(transitions)).toEqual(expect.any(Number));
        }
      }
      if (patient.lifecycle === "resolved" && operation?.status === "completed") break;
    }
    if (process.env.PERIOP_SECOND_QA_EXPORT === "1") writeFileSync(resolve(process.cwd(), "../../.local-dev/periop-second-fix/real-visit-transitions.json"), JSON.stringify(transitions, null, 2), "utf8");
    const state = clinic.state;
    const operation = state.serviceOperations.find((entry) => entry.actorId === "periop.real.patient");
    expect(checkedIn, JSON.stringify(transitions)).toBe(true);
    expect(operation, JSON.stringify(transitions)).toBeDefined();
    expect(operation?.status, JSON.stringify(transitions)).toBe("completed");
    expect(checks.size, JSON.stringify(transitions)).toBe(2);
    expect(new Set([...checks.values()].map((check) => check.nurse)).size).toBe(2);
    for (const check of checks.values()) expect(check).toMatchObject({ walked: true, stood: true });
    for (const task of operation!.periopNurseAttention!.tasks) {
      expect(task.completedAtFacilityTick! - task.startedAtFacilityTick!).toBe(15);
      expect(task.employeeId).toBeNull();
    }
    expect(periopNurses(state).every((nurse) => nurse.facilityTask === null)).toBe(true);
    expect(phases.size).toBe(3);
    expect(state.encounters["periop.real.patient"]!.lifecycle).toBe("resolved");
  });

  it("shares four normal chart orders across both nurses without a room-wide cover task", () => {
    const clinic = periopRealVisitFixture(4);
    const assignments = new Set<string>();
    let concurrent = false;
    for (let minute = 0; minute < 600; minute++) {
      const state = clinic.advance();
      const nurses = periopNurses(state);
      expect(nurses.some((nurse) => nurse.facilityTask?.kind === "cover_periop")).toBe(false);
      concurrent ||= nurses.filter((nurse) => nurse.facilityTask?.kind === "periop_attention").length === 2;
      for (const nurse of nurses) if (nurse.facilityTask?.kind === "periop_attention") assignments.add(nurse.id);
      if (clinic.patientIds.every((id) => state.encounters[id]!.lifecycle === "resolved")) break;
    }
    const summary = clinic.state.serviceOperations.map((operation) => ({ patient: operation.displayName, status: operation.status, attention: operation.periopNurseAttention }));
    expect(concurrent, JSON.stringify(summary)).toBe(true);
    expect(assignments.size).toBe(2);
    expect(summary.length, JSON.stringify(clinic.state.operationReceipts)).toBe(4);
    expect(clinic.patientIds.every((id) => clinic.state.encounters[id]!.lifecycle === "resolved"), JSON.stringify(summary)).toBe(true);
    expect(clinic.state.serviceOperations.every((operation) => operation.status === "completed" && operation.periopNurseAttention?.tasks.length === 2)).toBe(true);
    if (process.env.PERIOP_SECOND_QA_EXPORT === "1") writeFileSync(resolve(process.cwd(), "../../.local-dev/periop-second-fix/four-real-visits.json"), JSON.stringify({ finalTick: clinic.state.facilityTick, concurrent, assignments: [...assignments], summary }, null, 2), "utf8");
  }, 30000);

  it("holds real pre-op and recovery beyond their timers when both nurses are away training, including reload", () => {
    const clinic = periopRealVisitFixture();
    const requested = new Set<string>();
    const delayed = new Set<string>();
    const absent = new Set<string>();
    let reloaded = false;
    for (let minute = 0; minute < 420; minute++) {
      const patient = clinic.state.encounters["periop.real.patient"]!;
      const operation = clinic.state.serviceOperations.find((entry) => entry.actorId === patient.id);
      const beforePreparation = patient.steps[0]?.status === "feedback_pending";
      const beforeRecovery = operation?.phaseIndex === 1 && operation.phaseEndsAtFacilityTick !== null && operation.phaseEndsAtFacilityTick - clinic.state.facilityTick <= 5;
      const stage = beforePreparation ? "pre_op" : beforeRecovery ? "post_op" : null;
      if (stage && !requested.has(stage)) {
        for (const nurse of periopNurses(clinic.state)) clinic.dispatch({ type: "TRAIN_EMPLOYEE", operationId: clinic.commandId(), employeeId: nurse.id });
        requested.add(stage);
      }
      const state = clinic.advance();
      const current = state.serviceOperations.find((entry) => entry.actorId === patient.id);
      const task = current && getCurrentPeriopNurseAttention(current);
      for (const nurse of periopNurses(state)) if (isEmployeeAwayForTraining(nurse)) {
        absent.add(nurse.id);
        expect(nurse.facilityTask).toBeNull();
        expect(task?.employeeId).not.toBe(nurse.id);
      }
      if (task && task.requiredUntilFacilityTick !== null && state.facilityTick > task.requiredUntilFacilityTick && task.completedAtFacilityTick === null) {
        delayed.add(task.kind);
        expect(current!.status).toBe("in_service");
        expect(state.encounters[patient.id]!.patientLocation).toEqual(current!.periopBedReservation!.endpoint);
        if (task.startedAtFacilityTick === null || task.employeeId === null) expect(periopNurseAttentionStatus(current!, state.facilityTick)).toBe("Waiting for peri-op nurse");
        if (!reloaded) {
          const loaded = clinic.reload();
          expect(loaded.serviceOperations.find((entry) => entry.id === current!.id)!.periopNurseAttention).toEqual(current!.periopNurseAttention);
          reloaded = true;
        }
      }
      if (current?.phaseIndex && current.phaseIndex > 0) expect(current.periopNurseAttention!.tasks[0]!.completedAtFacilityTick).toEqual(expect.any(Number));
      if (current?.status === "completed") expect(current.periopNurseAttention!.tasks[1]!.completedAtFacilityTick).toEqual(expect.any(Number));
      if (state.encounters[patient.id]!.lifecycle === "resolved") break;
    }
    const operation = clinic.state.serviceOperations[0]!;
    expect([...requested]).toEqual(["pre_op", "post_op"]);
    expect([...delayed], JSON.stringify(operation)).toEqual(["pre_op", "post_op"]);
    expect(absent.size).toBe(2);
    expect(reloaded).toBe(true);
    expect(operation.status).toBe("completed");
    for (const task of operation.periopNurseAttention!.tasks) {
      expect(task.completedAtFacilityTick! - task.startedAtFacilityTick!).toBe(15);
      expect(task.completedAtFacilityTick!).toBeGreaterThan(task.requiredUntilFacilityTick!);
    }
    if (process.env.PERIOP_SECOND_QA_EXPORT === "1") writeFileSync(resolve(process.cwd(), "../../.local-dev/periop-second-fix/delayed-real-visit.json"), JSON.stringify({ finalTick: clinic.state.facilityTick, delayed: [...delayed], reloaded, attention: operation.periopNurseAttention }, null, 2), "utf8");
  });

  it("does not pin both idle nurses to their completed seat paths for hours", () => {
    const clinic = periopFlowFixture(2, 2, { amenities: true });
    const positions = new Map(periopNurses(clinic.state).map((nurse) => [nurse.id, new Set<string>()]));
    for (let minute = 0; minute < 240; minute++) for (const nurse of periopNurses(clinic.advance())) {
      positions.get(nurse.id)!.add(`${nurse.location.x},${nurse.location.y}`);
    }
    for (const [id, locations] of positions) expect(locations.size, `${id}: ${[...locations].join(";")}`).toBeGreaterThan(1);
  });

  it("abandons an old idle path through the approved room's solid bed footprint", () => {
    const clinic = periopFlowFixture();
    const nurse = periopNurses(clinic.state)[0]!;
    const home = clinic.state.rooms.find((room) => room.id === nurse.homeRoomInstanceId)!;
    // Saved destination predates fixed furniture clearance. Only the stale
    // path is injected; normal reducer ticks must repair it before moving.
    nurse.path = [{ ...nurse.location }, { x: home.x + 2, y: home.y + 1 }, { x: home.x + 2, y: home.y }];
    nurse.pathIndex = 0;
    nurse.lastMovedAtFacilityTick = clinic.state.facilityTick;
    const state = clinic.advance();
    const moved = state.employees.find((employee) => employee.id === nurse.id)!;
    expect(getRoomNavigableTiles(home, getRoomDefinition(home.roomDefinitionId)!, state.doors)).toContainEqual(moved.location);
    expect(moved.path).not.toEqual(nurse.path);
  });
});
