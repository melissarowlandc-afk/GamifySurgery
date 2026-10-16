import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { gameReducer, PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../../tests/fixtures/level-five-state";
import { assertLevelFiveQaEntry, prepareLevelFiveQaProfile } from "../../../../tools/qa/level-five-state-bootstrap";
import { createFreshProfile } from "./prototypeStorage";
import { createPrototypePlayerView } from "./viewModels";
import { inspectionReportView } from "./inspectionViewModels";
import { MoneyPanel } from "../ui/MoneyPanel";
import { GoalsPanel } from "../ui/GoalsPanel";
import { InspectionReportCard } from "../ui/InspectionReportCard";
import { MobileGoals } from "../mobile/MobileGoals";
import { MobileMoney } from "../mobile/manage/MobileMoney";
import { allElements, cleanupPhoneTests, noop, phoneTestDom } from "../mobile/screenTestUtils";

const shipped = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease;
function context() { const result = createLevelFiveStateQaContext(); PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = result.balanceRelease; return result; }
afterEach(async () => { await cleanupPhoneTests(); PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = shipped; });

describe("M8 funded economy and actual inspection in both shells", () => {
  it.each(["economy", "economy-inspection"] as const)("routes and resumes %s on desktop and phone without replacing a campaign", scenario => {
    context();
    for (const layout of ["desktop", "phone"]) expect(assertLevelFiveQaEntry("http://127.0.0.1:5184", "/level4-rooms-qa.html", `?level5=${scenario}&layout=${layout}`)).toBe(scenario);
    const profile = prepareLevelFiveQaProfile(createFreshProfile(), scenario), campaign = profile.campaigns[0]!;
    const original = campaign.state;
    const resumed = prepareLevelFiveQaProfile(profile, scenario);
    expect(resumed.campaigns).toHaveLength(1); expect(resumed.campaigns[0]).toBe(campaign); expect(resumed.campaigns[0]!.state).toBe(original);
    expect(PROTOTYPE_BALANCE_RELEASE.facility.maximumPlayableLevel).toBe(5);
  });

  it("shows zero-XP locked Goals and the $45 funded Executive without a synthetic unlock in either shell", () => {
    const state = createLevelFiveStateQaState("economy", context()), view = createPrototypePlayerView(state, null, false, null);
    expect(state.clinicalXp).toBe(0); expect(state.employees).toHaveLength(9);
    expect(state.levelFive?.progress.inspectionUnlocked ?? null).toBeNull();
    expect(view.staffRoles.find(role => role.id === "staff.executive")!.employees[0]!.salaryLabel).toContain("45");
    expect(view.serviceIncome.finances!.hourlyCosts.find(cost => cost.id === "staff")!.amount).toBe(209);
    const desktop = renderToStaticMarkup(<GoalsPanel view={view.progression} onLevelUp={noop} onProcedureSetupAction={noop} onBookInspection={noop} onCancelInspection={noop} />);
    const phone = renderToStaticMarkup(<MobileGoals view={view.progression} onLevelUp={noop} onSetupAction={noop} onBookInspection={noop} onCancelInspection={noop} />);
    for (const markup of [desktop, phone]) { expect(markup).toContain("2,000"); expect(markup).toContain("Locked"); }
  });

  it("uses the actual posted savings, payroll and Gift receipts in desktop Money and one-tap phone details", async () => {
    const state = createLevelFiveStateQaState("economy-inspection", context()), view = createPrototypePlayerView(state, null, false, null);
    const desktop = renderToStaticMarkup(<MoneyPanel serviceIncome={view.serviceIncome} />);
    expect(desktop).toContain(view.serviceIncome.finances!.supplierSavingsLabel!);
    const dom = phoneTestDom();
    await dom.render(<MobileMoney view={view.serviceIncome} resourceBar={view.resourceBar} advertising={view.advertising} onAdvertisingLevelChange={noop} />);
    expect(allElements(dom.element, node => node.attributes["data-money-tile"] !== undefined)).toHaveLength(5);
    expect(dom.element.textContent).not.toContain("Actual posted supplier savings");
    await dom.click("Costs per game hour");
    expect(dom.element.textContent).toContain(view.serviceIncome.finances!.supplierSavingsLabel!);
    expect(dom.element.textContent).toContain(view.serviceIncome.finances!.hourlyCosts.find(cost => cost.id === "staff")!.amountLabel);
    await dom.click("Back to money"); await dom.click("Gift Shop sales");
    expect(dom.element.textContent).toContain(view.serviceIncome.giftShop!.netLabel);
    expect(dom.element.textContent).toContain(view.serviceIncome.giftShop!.receiptWindowLabel);
  });

  it("shows the actual completed ten-category report as desktop arithmetic and compact one-tap phone tiles", async () => {
    const qa = context(); let state = createLevelFiveStateQaState("economy-inspection", qa);
    state = gameReducer(state, { type: "SET_PAUSED", paused: false, operationId: "m8.phone.play" }, qa);
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: "m8.phone.finish" }, qa);
    const report = inspectionReportView(state.levelFive!.progress.gameFinished!.firstCompletedReport);
    const desktop = renderToStaticMarkup(<InspectionReportCard report={report} />);
    expect(desktop.match(/role="meter"/g)).toHaveLength(10);
    expect(desktop).toContain(report.scoreLabel!);
    const dom = phoneTestDom(); await dom.render(<InspectionReportCard report={report} compact />);
    const tiles = () => allElements(dom.element, node => node.attributes.class === "inspection-category-tile");
    expect(tiles()).toHaveLength(10); expect(dom.element.textContent).not.toContain("How to improve");
    const finance = report.categories.find(category => category.id === "finances")!;
    await dom.clickElement(tiles().find(node => node.textContent.startsWith(finance.label))!);
    expect(tiles()).toHaveLength(0); expect(dom.element.textContent).toContain(finance.formula);
    expect(dom.element.textContent).toContain(finance.improvementHint);
    await dom.click("← Back to report card"); expect(tiles()).toHaveLength(10);
  });
});
