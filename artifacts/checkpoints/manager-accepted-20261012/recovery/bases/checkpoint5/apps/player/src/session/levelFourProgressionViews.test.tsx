import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { deserializeGameState, gameReducer, getRollingIncomeSummary, serializeGameState, staffStillEligibleEntries, type GameState } from "@gamify-surgery/game-domain";
import { createLevelThreeReadyQaState, createLevelFourAlmostQaState } from "../../../../tests/fixtures/level-four-progression";
import { createEarlyLevelFourEconomyState } from "../../../../tools/economy-audit/level-four-simulation";
import { createPrototypePlayerView } from "./viewModels";
import { getClinicAlertActionProblem } from "./clinicAlertActions";
import { GoalsPanel } from "../ui/GoalsPanel";
import { clinicHeadlineCandidates } from "../ui/ClinicHeadline";

const viewOf = (state: GameState) => createPrototypePlayerView(state, null, false, null);
const goalsMarkup = (state: GameState) => renderToStaticMarkup(<GoalsPanel view={viewOf(state).progression} onLevelUp={vi.fn()} onProcedureSetupAction={vi.fn()} />);
function finishWoundVisit(): GameState {
  let state = createLevelFourAlmostQaState();
  state.paused = false;
  for (let i = 0; i < 180 && !state.levelFourCompletion?.woundOstomyCareVisit; i++)
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `views.complete.${i}` });
  expect(state.levelFourCompletion?.woundOstomyCareVisit).toBeTruthy();
  return state;
}

describe("Level 4 player progression and operating views", () => {
  it("offers Advance immediately on an eligible legacy Level 3 save and unlocks the real catalogs", () => {
    const state = deserializeGameState(serializeGameState(createLevelThreeReadyQaState()));
    expect(goalsMarkup(state)).toContain("Advance to Level 4");
    expect(viewOf(state).progression.secondaryGoals![0]!.complete).toBe(false);
    const advanced = gameReducer(state, { type: "LEVEL_UP", operationId: "views.advance" });
    const view = viewOf(advanced);
    expect(view.resourceBar.xpProgressLabel).toBe("0/750 XP");
    expect(view.progression.canLevelUp).toBe(false);
    expect(view.progression.nextLevelLabel).toBeNull();
    for (const id of ["room.mri", "room.pediatric_waiting", "room.pediatric_examination", "room.wound_ostomy"])
      expect(view.roomOptions.some((room) => room.id === id)).toBe(true);
    expect(view.staffRoles.some((role) => role.id === "staff.app")).toBe(true);
    expect(view.serviceIncome.catalogLines.find((line) => line.id === "income.mri")!.group).not.toBe("locked");
  });

  it("shows exactly the five finishing items, historical witnesses and a durable terminal state", () => {
    const almost = viewOf(createLevelFourAlmostQaState()).progression;
    expect(almost.goals).toHaveLength(5);
    expect(almost.goals.filter((goal) => !goal.complete).map((goal) => goal.id)).toEqual(["progression.witness.wound_ostomy_care_visit"]);
    expect(almost.goals.some((goal) => /MRI|Waiting/.test(goal.label))).toBe(false);
    const complete = finishWoundVisit();
    let state = deserializeGameState(serializeGameState(complete));
    expect(viewOf(state).progression.prototypeComplete).toBe(true);
    expect(goalsMarkup(state)).toContain("Level 4 complete - Level 5 coming later.");
    expect(goalsMarkup(state)).not.toContain("level-up-button");
    expect(getClinicAlertActionProblem(state, { kind: "level_up" })).toBeTruthy();
    const milestones = viewOf(state).messages.filter((row) => row.id === "event.facility-level-4-complete");
    expect(milestones).toHaveLength(1);
    expect(milestones[0]).toMatchObject({ rowKind: "milestone", priority: "informational", showAttentionMarker: false });
    expect(viewOf(state).needsYou).toHaveLength(0);
    expect(clinicHeadlineCandidates(viewOf(state).messages, viewOf(state).needsYou!))
      .not.toContainEqual(expect.objectContaining({ id: milestones[0]!.id }));
    for (let reload = 0; reload < 3; reload++) {
      state = deserializeGameState(serializeGameState(state));
      state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `views.reload.${reload}` });
      expect(state.events.filter((event) => event.id === milestones[0]!.id)).toHaveLength(1);
      expect(viewOf(state).messages.filter((row) => row.id === milestones[0]!.id)).toHaveLength(1);
      expect(state.levelFourCompletion!.acknowledgedAtFacilityTick).toBe(complete.levelFourCompletion!.acknowledgedAtFacilityTick);
    }
  });

  it("reports APP receipts in Money and the HUD using the same rate, with full payroll and no new XP", () => {
    const state = finishWoundVisit();
    const view = viewOf(state);
    const finance = view.serviceIncome.finances!;
    const summary = getRollingIncomeSummary(state);
    expect(state.clinicalXp).toBe(750);
    expect(finance.hourlyIncomeSources.find((source) => source.id === "scheduled_services")!.amount).toBe(summary.incomePerHour);
    expect(finance.hourlyCosts.find((cost) => cost.id === "staff")!.amount).toBe(state.employees.reduce((sum, employee) => sum + employee.salaryPerExpenseInterval, 0));
    expect(view.resourceBar.moneyHourlyDeltaLabel).toBe(finance.hourlyNetLabel);
    expect(view.resourceBar.moneyHourlyBreakdown?.incomeLabel).toBe(finance.hourlyIncomeLabel);
    expect(view.serviceIncome.catalogLines.find((line) => line.id === "income.wound_care")!.group).toBe("earning");
  });

  it("explains the current room/look limits and guards an exhausted APP roster, including departing identities", () => {
    const state = createEarlyLevelFourEconomyState();
    const template = state.employees.find((employee) => employee.staffRoleDefinitionId === "staff.app")!;
    state.employees = state.employees.filter((employee) => employee.staffRoleDefinitionId !== "staff.app");
    state.departingEmployees = staffStillEligibleEntries("staff.app").map((entry, i) => ({ ...structuredClone(template),
      id: `departing.app.${i}`, appearance: { ...template.appearance, stillId: entry.stillId }, dismissedAtFacilityTick: 0 }));
    const view = viewOf(state);
    const app = view.staffRoles.find((role) => role.id === "staff.app")!;
    expect(app.staffingGuidance).toContain(`(${staffStillEligibleEntries("staff.app").length} total)`);
    expect(app.staffingGuidance).toContain("no Clinical XP or FSRS practice");
    expect(app.staffingGuidance).not.toContain("pending");
    expect(app.canHire).toBe(false);
    expect(view.staffOptions.find((role) => role.id === "staff.app")!.enabled).toBe(false);
    expect(getClinicAlertActionProblem(state, { kind: "hire_staff", roleId: "staff.app" })).toContain("approved APP looks");
    expect(view.needsYou).toHaveLength(0);
  });
});
