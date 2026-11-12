import { writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getClinicalCaseEligibilityIssue, getCurrentCapabilities, PROTOTYPE_DOMAIN_CONTEXT } from "../src";
import { createLevelFourIntegrationState, m9Minute, m9DeferAppDemand } from "../../../tests/fixtures/level-four-integration";

describe("Level 4 M9 isolated defect reproducers", () => {
  it.skip("DEFECT-M9-2: APP on/off preserves the scored case selected at game minute 900", () => {
    let on = createLevelFourIntegrationState("level-four-m9-fairness");
    on.nextRoutineArrivalTick = 1;
    let off = m9DeferAppDemand(structuredClone(on));
    const id = "encounter.auto.4.15";
    const summarize = (state: typeof on) => ({
      tick: state.facilityTick,
      arrivalSequence: state.routineArrivalSequence,
      encounter: state.encounters[id]?.frozenCase.id,
      capabilities: [...getCurrentCapabilities(state)].sort(),
      eligibleCases: PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.filter(clinicalCase =>
        getClinicalCaseEligibilityIssue(state, clinicalCase, PROTOTYPE_DOMAIN_CONTEXT) === null).map(clinicalCase => clinicalCase.id),
      activeEncounters: Object.values(state.encounters).filter(encounter => encounter.resolutionReason === null)
        .map(encounter => ({ id: encounter.id, caseId: encounter.frozenCase.id, lifecycle: encounter.lifecycle,
          concepts: encounter.frozenCase.decisionNodes.map(node => node.primaryConceptId) })),
      earlierPatient: ((encounter) => encounter ? { id: encounter.id, resolutionReason: encounter.resolutionReason,
        patientSatisfaction: encounter.patientSatisfaction, waiting: encounter.waiting, location: encounter.patientLocation,
        idleWaitingSinceTick: encounter.idleWaitingSinceTick, movement: encounter.patientMovement,
        lastSatisfactionDecayAtTick: encounter.lastSatisfactionDecayAtTick } : null)(state.encounters["encounter.auto.4.8"]),
      discussions: Object.values(state.employeeDiscussions ?? {}).map(discussion => ({ id: discussion.id,
        caseId: discussion.frozenCase.id, lifecycle: discussion.lifecycle, employeeId: discussion.employeeId,
        concepts: discussion.frozenCase.decisionNodes.map(node => node.primaryConceptId) })),
      employees: state.employees.map(employee => ({ id: employee.id, role: employee.staffRoleDefinitionId, home: employee.homeRoomInstanceId,
        location: employee.location, task: employee.facilityTask, pathIndex: employee.pathIndex, pathLength: employee.path.length })),
      rooms: state.rooms.filter(room => room.roomDefinitionId !== "room.hallway").map(room => ({ id: room.id, maintenance: room.maintenance })),
    });
    for (let minute = 0; minute < 899; minute++) { on = m9Minute(on); off = m9Minute(m9DeferAppDemand(off)); }
    const before = { on: summarize(on), off: summarize(off) };
    on = m9Minute(on); off = m9Minute(m9DeferAppDemand(off));
    if (process.env.LEVEL_FOUR_M9_REPORT === "1") writeFileSync(new URL("../../../.local-dev/level4-m9/defect-2-trace.json", import.meta.url),
      `${JSON.stringify({ before, after: { on: summarize(on), off: summarize(off) } }, null, 2)}\n`);
    expect(on.encounters[id]!.frozenCase.id).toBe(off.encounters[id]!.frozenCase.id);
  }, 90_000);
});
