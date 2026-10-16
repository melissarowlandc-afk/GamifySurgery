import { act } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT, createInitialGameState, type GameState } from "@gamify-surgery/game-domain";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../../tests/fixtures/level-five-state";
import { createFreshProfile, type LoadedPrototypeProfile } from "./prototypeStorage";
import { usePrototypeSession, type PrototypeSession } from "./usePrototypeSession";
import { createPrototypePlayerView } from "./viewModels";
import { GoalsPanel } from "../ui/GoalsPanel";
import { InspectionControls } from "../ui/InspectionControls";
import { MobileGoals } from "../mobile/MobileGoals";
import MobileShell from "../mobile/MobileShell";
import { allElements, cleanupPhoneTests, phoneFixture, phoneTestDom } from "../mobile/screenTestUtils";
import { testElementProps } from "../mobile/testDom";
import { createFacilityInspectionView } from "./inspectionViewModels";

vi.mock("../facility/FacilityCanvas", () => ({ FacilityCanvas: () => <div data-testid="facility-canvas" /> }));
const shipped = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease;
beforeEach(() => { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = createLevelFiveStateQaContext().balanceRelease; vi.spyOn(Date, "now").mockReturnValue(0); });
afterEach(async () => { await cleanupPhoneTests(); PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = shipped; vi.restoreAllMocks(); });

async function mount(state: GameState, desktop: boolean) {
  const env = phoneTestDom();
  Object.assign(env.browser, { setInterval: vi.fn(() => 1), clearInterval: vi.fn() });
  const loaded: LoadedPrototypeProfile = { notice: "M7a disposable test", profile: { ...createFreshProfile(), activeCampaignId: state.campaignId,
    tutorialsEnabled: false, tutorialIntroDismissedCampaignIds: [state.campaignId], campaigns: [{ campaignId: state.campaignId,
      name: "M7a test", createdAtRealMs: 0, updatedAtRealMs: 0, status: "resumable", state }] } };
  let session!: PrototypeSession;
  function Host() {
    session = usePrototypeSession(loaded);
    const view = createPrototypePlayerView(session.state, null, false, null);
    return desktop ? <GoalsPanel view={view.progression} onLevelUp={session.levelUp} onProcedureSetupAction={vi.fn()}
      onBookInspection={session.bookInspection} onCancelInspection={session.cancelInspection} />
      : <MobileShell {...phoneFixture({ ...view, paused: session.state.paused, simulationSpeed: session.state.simulationSpeed,
        onLevelUp: session.levelUp, onBookInspection: session.bookInspection, onCancelInspection: session.cancelInspection })} />;
  }
  await env.render(<Host />);
  if (!desktop) await env.click("Inspections unlocked");
  return { ...env, get session() { return session; } };
}

describe("M7a shared inspection hooks in desktop and phone Goals", () => {
  it.each([true, false])("books once through the %s desktop/shared session and cancels preparation without a reward", async desktop => {
    const env = await mount(createLevelFiveStateQaState("goals-unlocked"), desktop);
    const original = env.session.state;
    const book = testElementProps(env.button("Book inspection")).onClick as () => void;
    await act(async () => { book(); book(); });
    expect(env.session.state.levelFive!.inspection).toMatchObject({ status: "preparing", preparation: { durationMinutes: 60, executiveQuote: null } });
    expect(Object.values(env.session.state.operationReceipts).filter(receipt => receipt.commandType === "BOOK_INSPECTION" && receipt.status === "applied")).toHaveLength(1);
    expect(env.element.textContent).toContain("Preparing · 60 active min left");
    expect(env.session.state.paused).toBe(original.paused);
    expect(env.session.state.cashCents).toBe(original.cashCents); expect(env.session.state.clinicalXp).toBe(original.clinicalXp);
    await env.click("Cancel inspection");
    expect(env.session.state.levelFive!.inspection.status).toBe("cancelled");
    expect(env.session.state.levelFive!.progress.gameFinished).toBeNull();
    await env.click("Book another inspection");
    expect(Object.values(env.session.state.operationReceipts).filter(receipt => receipt.commandType === "BOOK_INSPECTION" && receipt.status === "applied")).toHaveLength(2);
  });

  it.each(["pre-goal", "preparing", "running", "report", "incomplete", "cancelled"] as const)("renders the same %s status/evidence in both shells", scenario => {
    const state = createLevelFiveStateQaState(scenario), progression = createPrototypePlayerView(state, null, false, null).progression;
    const markup = [renderToStaticMarkup(<GoalsPanel view={progression} onLevelUp={vi.fn()} onProcedureSetupAction={vi.fn()} onBookInspection={vi.fn()} onCancelInspection={vi.fn()} />),
      renderToStaticMarkup(<MobileGoals view={progression} onLevelUp={vi.fn()} onSetupAction={vi.fn()} onBookInspection={vi.fn()} onCancelInspection={vi.fn()} />)];
    for (const rendered of markup) {
      expect(rendered).toContain(progression.inspection!.statusLabel.replace(/&/g, "&amp;"));
      expect(rendered).toContain("qualifying scored completions");
      if (scenario === "pre-goal") expect(rendered).toContain("Book inspection · Locked");
      if (scenario === "preparing") expect(rendered).toContain("Preparing · 40 active min left");
      if (scenario === "running") expect(rendered).toContain("10/3000 active min");
      if (scenario === "report") { expect(rendered).toContain("Best prestige 85.00/100"); expect(rendered).toContain("85.00/100 · prestige"); }
      if (scenario === "incomplete") expect(rendered).toContain("No prestige score");
      expect(rendered).not.toMatch(/Congratulations|Start new campaign|Keep playing/); // Goals links to the full-page finish dialog.
    }
  });

  it("keeps a running cancel confirmation through ticking progress and dispatches cancel once", async () => {
    const env = phoneTestDom(), cancel = vi.fn();
    const view = createFacilityInspectionView(createLevelFiveStateQaState("running"));
    await env.render(<InspectionControls view={view} onBook={vi.fn()} onCancel={cancel} />);
    await env.click("Cancel inspection"); expect(cancel).not.toHaveBeenCalled();
    await env.render(<InspectionControls view={{ ...view, statusLabel: "Inspection running · 11/3000 active min" }} onBook={vi.fn()} onCancel={cancel} />);
    const confirm = testElementProps(env.button("Confirm cancel")).onClick as () => void;
    await act(async () => { confirm(); confirm(); });
    expect(cancel).toHaveBeenCalledOnce();
  });

  it("retains all ten score bars, arithmetic, weights, points and hints behind compact disclosures", async () => {
    const env = phoneTestDom();
    const state = createLevelFiveStateQaState("report"), view = createFacilityInspectionView(state);
    await env.render(<InspectionControls view={view} onBook={vi.fn()} onCancel={vi.fn()} />);
    expect(allElements(env.element, node => node.attributes.role === "meter")).toHaveLength(10);
    expect(allElements(env.element, node => node.tagName === "SUMMARY" && node.textContent.includes("points ·"))).toHaveLength(10);
    expect(allElements(env.element, node => node.tagName === "STRONG" && node.textContent === "How to improve")).toHaveLength(10);
    expect(allElements(env.element, node => node.tagName === "DETAILS").every(node => node.attributes.open === undefined)).toBe(true);
    expect(env.element.textContent).toContain("20% weight");
    expect(env.element.textContent).toContain("Synthetic report metadata"); // historical M1 fixture remains honestly labelled
  });

  it.each([0, 1, 2, 3, 4] as const)("leaves Level %i views and both Goals renderings free of inspection hooks", level => {
    const state = createInitialGameState(); state.facilityLevel = level;
    const view = createPrototypePlayerView(state, null, false, null).progression;
    expect(view.inspection).toBeUndefined(); expect(view.inspectionUnlock).toBeUndefined();
    for (const markup of [renderToStaticMarkup(<GoalsPanel view={view} onLevelUp={vi.fn()} onProcedureSetupAction={vi.fn()} />),
      renderToStaticMarkup(<MobileGoals view={view} onLevelUp={vi.fn()} onSetupAction={vi.fn()} />)]) {
      expect(markup).not.toContain("inspection-controls"); expect(markup).not.toContain("Book inspection");
    }
  });
});
