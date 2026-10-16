import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { gameReducer, PROTOTYPE_DOMAIN_CONTEXT, type GameState } from "@gamify-surgery/game-domain";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../../tests/fixtures/level-five-state";
import { createPrototypePlayerView } from "./viewModels";
import { prepareLevelFiveQaProfile } from "../../../../tools/qa/level-five-state-bootstrap";
import { createFreshProfile } from "./prototypeStorage";
import { StaffPanel } from "../ui/StaffPanel";
import { MoneyPanel } from "../ui/MoneyPanel";
import { ExecutiveManagementFacts } from "../ui/ExecutiveManagementFacts";
import { MobileEmployees } from "../mobile/manage/MobileEmployees";
import { MobileMoney } from "../mobile/manage/MobileMoney";
import { MobileServices } from "../mobile/manage/MobileServices";
import { phoneFixture, noop, phoneTestDom, cleanupPhoneTests } from "../mobile/screenTestUtils";

const original = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease;
const context = createLevelFiveStateQaContext();
afterEach(async () => { await cleanupPhoneTests(); PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = original; vi.restoreAllMocks(); });
function initial() { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = context.balanceRelease; return createLevelFiveStateQaState("executive", context); }
function advance(state: GameState, count: number) {
  for (let i = 0; i < count; i++) state = gameReducer({ ...state, paused: false }, { type: "ADVANCE_TICK", operationId: `executive.view.${state.facilityTick}` }, context);
  return state;
}
describe("M4 desktop and compact phone parity", () => {
  it("renders the real seated daily task at the approved desk on the common map", () => {
    let state = initial();
    for (let i = 0; i < 100 && state.levelFive!.management.round?.status !== "working"; i++) state = advance(state, 1);
    expect(state.levelFive!.management.round?.status).toBe("working");
    const view = createPrototypePlayerView(state, null, false, null);
    const executive = view.facility.staff.find(employee => employee.staffRoleDefinitionId === "staff.executive")!;
    expect(executive).toMatchObject({ supportRole: "executive-office-seat", supportId: "executiveChair", supportRoomInstanceId: "room.qa.level5.executive" });
    expect(view.staffRoles.find(role => role.id === "staff.executive")!.employees[0]!.activityLabel).toContain("Daily management round");
  });
  it.each([1, 2, 3, 4, 5] as const)("shows all four tier %i current, active and next effects from one model", level => {
    let state = initial(); state.employees.find(employee => employee.staffRoleDefinitionId === "staff.executive")!.trainingLevel = level;
    state = advance(state, 110);
    const view = createPrototypePlayerView(state, null, false, null);
    const executive = view.staffRoles.find(role => role.id === "staff.executive")!.employees[0]!;
    expect(executive.executiveManagement?.effects).toHaveLength(4);
    const markup = renderToStaticMarkup(<ExecutiveManagementFacts view={executive.executiveManagement} />);
    for (const text of ["Staff morale", "Patient/visitor comfort", "Inspection preparation", "Supplier negotiation", "Actual posted savings", "Next tier"]) {
      if (level !== 5 || text !== "Next tier") expect(markup).toContain(text);
    }
    const desk = renderToStaticMarkup(<StaffPanel roles={view.staffRoles} staffTraining={view.staffTraining} onHire={noop} onDecreaseSalary={noop} onIncreaseSalary={noop} onFire={noop} />);
    const phone = renderToStaticMarkup(<MobileEmployees {...phoneFixture(view)} highlightedEmployeeId={executive.id} />);
    for (const text of ["$45/hr", "Executive Office", "Supplier negotiation", "Inspection preparation"]) { expect(desk).toContain(text); expect(phone).toContain(text); }
    expect(executive.training?.currentBenefitLabel).toContain(`${(1 + (level - 1) * .25).toFixed(2)}×`);
    const seated = view.facility.staff.find(employee => employee.instanceId === executive.id);
    // A later optional gym break may own the person; when at the desk both shells use the native seat.
    if (seated?.supportRole === "executive-office-seat") expect(seated.supportId).toBe("executiveChair");
  });
  it("opens the existing phone hire tile and employee detail in one tap each", async () => {
    const state = initial(), view = createPrototypePlayerView(state, null, false, null);
    const dom = phoneTestDom();
    await dom.render(<MobileEmployees {...phoneFixture(view)} />);
    await dom.click("Role details for Executive");
    const executive = view.staffRoles.find(role => role.id === "staff.executive")!.employees[0]!;
    await dom.click(`Employee details for ${executive.displayName}`);
    expect(dom.element.textContent).toContain("Supplier negotiation");
    expect(dom.element.textContent).toContain("$45/hr");
  });
  it("shows actual supplier savings and unchanged payroll in both Money costs", async () => {
    const state = advance(initial(), 180), view = createPrototypePlayerView(state, null, false, null);
    expect(view.serviceIncome.finances?.hourlyCosts.find(cost => cost.id === "supplier")!.amount).toBeLessThan(0);
    expect(view.serviceIncome.finances?.hourlyCosts.find(cost => cost.id === "staff")!.amount).toBe(59);
    const desk = renderToStaticMarkup(<MoneyPanel serviceIncome={view.serviceIncome} />);
    expect(desk).toContain("Actual posted supplier savings");
    const dom = phoneTestDom();
    await dom.render(<MobileMoney view={view.serviceIncome} resourceBar={view.resourceBar} advertising={view.advertising} onAdvertisingLevelChange={noop} />);
    await dom.click("Costs per game hour");
    expect(dom.element.textContent).toContain("Actual posted supplier savings");
    expect(dom.element.textContent).toContain("payroll unchanged");
  });
  it("exposes preparation terms through the existing phone Upkeep detail without an inspection action", async () => {
    const view = createPrototypePlayerView(advance(initial(), 110), null, false, null);
    const dom = phoneTestDom();
    await dom.render(<MobileServices view={view.serviceIncome} onAppointmentsEnabledChange={noop} onStartLaboratoryProcessing={noop} onSetupAction={noop} />);
    await dom.click("Upkeep & quality");
    expect(dom.element.textContent).toContain("Preparation terms:");
    expect(dom.element.textContent).not.toContain("Book inspection");
  });
  it("resumes edited M4 QA campaigns without reseeding and keeps the live cap 4", () => {
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = context.balanceRelease;
    const seeded = prepareLevelFiveQaProfile(createFreshProfile(), "executive");
    const campaign = seeded.campaigns[0]!; campaign.state.cashCents = 12345; campaign.state.cash = 123.45;
    const resumed = prepareLevelFiveQaProfile(seeded, "executive");
    expect(resumed.campaigns).toHaveLength(1); expect(resumed.campaigns[0]).toBe(campaign);
    expect(resumed.campaigns[0]!.state.cashCents).toBe(12345);
    expect(original.facility.maximumPlayableLevel).toBe(5);
  });
});
