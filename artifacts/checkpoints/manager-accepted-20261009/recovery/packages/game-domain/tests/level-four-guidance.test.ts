import { describe, expect, it } from "vitest";
import { evaluateGuidanceTipCandidates, staffStillEligibleEntries } from "../src";
import { createEarlyLevelFourEconomyState } from "../../../tools/economy-audit/level-four-simulation";
import { createLevelFourAlmostQaState } from "../../../tests/fixtures/level-four-progression";
import { tipsFixture } from "./guidance-tips-fixtures";

describe("Level 4 actionable guidance", () => {
  it("keeps the new guidance out of Levels 0-3 and the tutorial", () => {
    const f = tipsFixture();
    for (const level of [0, 1, 2, 3] as const) {
      f.state.facilityLevel = level;
      expect(evaluateGuidanceTipCandidates(f.state, f.context).filter((tip) => /tip\.(app|pediatric|wound)\./.test(tip.id))).toHaveLength(0);
    }
  });
  it("enables a real wound-only APP stream without assuming an ordinary exam home", () => {
    const state = createLevelFourAlmostQaState();
    state.serviceAppointmentsEnabled = false;
    state.facilityTick = 1500;
    const tip = evaluateGuidanceTipCandidates(state).find((entry) => entry.id === "tip.app.appointments");
    expect(tip?.action).toEqual({ kind: "enable_appointments" });
    state.serviceAppointmentsEnabled = true;
    expect(evaluateGuidanceTipCandidates(state).some((entry) => entry.id === "tip.app.appointments")).toBe(false);
  });
  it("withholds APP hiring and extra-room promises while departing staff use every approved look", () => {
    const state = createEarlyLevelFourEconomyState();
    const template = state.employees.find((employee) => employee.staffRoleDefinitionId === "staff.app")!;
    state.employees = state.employees.filter((employee) => employee.staffRoleDefinitionId !== "staff.app");
    state.departingEmployees = staffStillEligibleEntries("staff.app").map((entry, i) => ({ ...structuredClone(template),
      id: `departing.guidance.${i}`, appearance: { ...template.appearance, stillId: entry.stillId }, dismissedAtFacilityTick: 0 }));
    state.facilityTick = 1500;
    expect(evaluateGuidanceTipCandidates(state).filter((tip) => ["tip.app.hire", "tip.app.capacity"].includes(tip.id))).toHaveLength(0);
    state.departingEmployees = [];
    expect(evaluateGuidanceTipCandidates(state).some((tip) => tip.id === "tip.app.hire")).toBe(true);
  });
});
