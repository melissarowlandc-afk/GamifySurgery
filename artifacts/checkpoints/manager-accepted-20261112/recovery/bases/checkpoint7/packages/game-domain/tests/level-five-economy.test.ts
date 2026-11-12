import { describe, expect, it } from "vitest";
import { gameReducer, getEmployeeEffectiveMorale } from "../src";
import { LevelFiveReducerAudit } from "../../../tools/economy-audit/level-five-simulation";
import { createLevelFiveStateQaContext } from "../../../tests/fixtures/level-five-state";

describe("Level 5 M8 actual reducer audit", () => {
  it("keeps the accepted consultation trip when another checked-in chart is ready", () => {
    const context = createLevelFiveStateQaContext(), audit = new LevelFiveReducerAudit(context, "m8.consultation-travel", true, 80);
    const clinicalCase = context.clinicalRelease.cases.find(c => c.routineEligible && !c.tutorialEligible && !c.pediatricProfile && !c.participant && c.earliestFacilityStage <= 1 &&
      c.requiredCapabilityIds.every(id => id === "capability.examination") && c.decisionNodes.length === 1 && !c.decisionNodes[0]!.resultGateAfter)!;
    for (const id of ["m8.travel.1", "m8.travel.2"]) audit.apply({ type: "ADMIT_PATIENT", encounterId: id, caseId: clinicalCase.id, patientDisplayName: clinicalCase.patientDisplayName, arrivalClass: "routine" });
    for (let minute = 0; minute < 120 && !Object.values(audit.state.encounters).filter(e => e.id.startsWith("m8.travel.")).every(e => e.checkInStatus === "checked_in" && !e.patientMovement); minute++) audit.tick();
    const patients = Object.values(audit.state.encounters).filter(e => e.id.startsWith("m8.travel."));
    expect(patients.every(e => e.checkInStatus === "checked_in" && !e.patientMovement)).toBe(true);
    audit.pump();
    const openedId = audit.state.openChartEncounterId!;
    expect(audit.state.encounters[openedId]!.patientMovement?.kind).toBe("walking_to_care");
    audit.pump();
    expect(audit.state.openChartEncounterId).toBe(openedId);
    expect(audit.state.encounters[openedId]!.patientMovement?.kind).toBe("walking_to_care");
  }, 30_000);

  it("starts funded at zero XP, uses default wages/tiers, and reconciles real cash through repeat ticks and reload", () => {
    const context = createLevelFiveStateQaContext();
    const audit = new LevelFiveReducerAudit(context, "level-five-m8.test", true, 80);
    expect(audit.state.clinicalXp).toBe(0);
    const executive = audit.state.employees.find(e => e.staffRoleDefinitionId === "staff.executive")!;
    expect(executive.salaryPerExpenseInterval).toBe(45);
    expect(audit.state.rooms.filter(r => r.roomDefinitionId.startsWith("room.") && ["room.founder_office", "room.executive_office", "room.gift_shop", "room.indoor_garden", "room.staff_gym"].includes(r.roomDefinitionId))).toHaveLength(5);
    expect(audit.state.employees.every(e => e.trainingLevel === 1)).toBe(true);
    expect(getEmployeeEffectiveMorale(audit.state, executive)).toBe(executive.morale + 2);
    for (let minute = 0; minute < 600; minute++) { audit.pump(); audit.tick(); }
    expect(audit.receipts.size).toBeGreaterThan(0);
    expect(audit.answers.size).toBeGreaterThan(0);
    expect(audit.completedRounds.size).toBe(1);
    expect(audit.staleActors.size).toBe(0);
    const state = audit.state;
    const repeat = gameReducer(state, { type: "ADVANCE_TICK", operationId: `m8.audit.${audit.sequence - 1}` }, context);
    expect(repeat).toBe(state);
    audit.reload();
    expect(audit.state.levelFive).toEqual(state.levelFive);
    expect(audit.state.cashCents).toBe(state.cashCents);
    expect(audit.state.clinicalXp).toBe([...audit.answers.values()].reduce((sum, answer) => sum + (answer.correct ? 10 : 2), 0));
  }, 120_000);

  it("keeps the $45 wage and full support upkeep when a real blocked office cannot complete a round", () => {
    const context = createLevelFiveStateQaContext(), audit = new LevelFiveReducerAudit(context, "level-five-m8.no-round", false, 80, { blockExecutive: true });
    for (let minute = 0; minute < 180; minute++) audit.tick();
    expect(audit.completedRounds.size).toBe(0);
    expect(audit.state.levelFive?.management.supplierSavings ?? { stockCents: 0, upkeepSixtiethCents: 0 }).toEqual({ stockCents: 0, upkeepSixtiethCents: 0 });
    expect(audit.state.employees.find(e => e.staffRoleDefinitionId === "staff.executive")!.salaryPerExpenseInterval).toBe(45);
    expect(audit.minuteCosts.every(row => row.roomUpkeep["room.executive_office"] === 1 && row.supplier === 0)).toBe(true);
  }, 60_000);
});
