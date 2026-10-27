import { act } from "react";
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT, type GameState } from "@gamify-surgery/game-domain";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../../tests/fixtures/level-five-state";
import { createFreshProfile, type LoadedPrototypeProfile } from "../session/prototypeStorage";
import { usePrototypeSession, type PrototypeSession } from "../session/usePrototypeSession";
import { createPrototypePlayerView } from "../session/viewModels";
import { GoalsPanel } from "../ui/GoalsPanel";
import MobileShell from "./MobileShell";
import { allElements, cleanupPhoneTests, phoneFixture, phoneTestDom } from "./screenTestUtils";
import { testElementProps } from "./testDom";

vi.mock("./map/MobileFacilityMap", () => ({ MobileFacilityMap: () => <div data-testid="facility-canvas">Map</div> }));
const shipped = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease;
beforeEach(() => { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = createLevelFiveStateQaContext().balanceRelease; vi.spyOn(Date, "now").mockReturnValue(0); });
afterEach(async () => { await cleanupPhoneTests(); PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = shipped; vi.restoreAllMocks(); });

async function mount(state: GameState, desktop = false) {
  const env = phoneTestDom(); Object.assign(env.doc, { visibilityState: "visible" });
  Object.assign(env.browser, { setInterval: vi.fn(() => 1), clearInterval: vi.fn() });
  const loaded: LoadedPrototypeProfile = { notice: "M6 disposable test", profile: { ...createFreshProfile(), activeCampaignId: state.campaignId,
    tutorialsEnabled: false, tutorialIntroDismissedCampaignIds: [state.campaignId], campaigns: [{ campaignId: state.campaignId,
      name: "M6 test", createdAtRealMs: 0, updatedAtRealMs: 0, status: "resumable", state }] } };
  let session!: PrototypeSession;
  const advance = vi.fn(() => session.levelUp());
  const alertAction = vi.fn((action: Parameters<PrototypeSession["runClinicAlertAction"]>[0]) => session.runClinicAlertAction(action));
  function Host() {
    session = usePrototypeSession(loaded);
    const view = createPrototypePlayerView(session.state, null, false, null);
    return desktop ? <GoalsPanel view={view.progression} onLevelUp={advance} onProcedureSetupAction={vi.fn()} />
      : <MobileShell {...phoneFixture({ ...view, paused: session.state.paused, simulationSpeed: session.state.simulationSpeed,
          onLevelUp: advance, onClinicAlertAction: alertAction, onTogglePause: session.togglePause })} />;
  }
  await env.render(<Host />);
  return { ...env, advance, alertAction, get session() { return session; } };
}

describe("M6 phone Goals chip and sheet through the shared session", () => {
  it.each(["chip", "sheet", "desktop"])("advances a ready old Level 4 save through %s once and shows locked Level 5 goals", async surface => {
    const env = await mount(createLevelFiveStateQaState("l4-ready"), surface === "desktop");
    const original = env.session.state;
    if (surface === "sheet") { await env.click("More clinic options"); await env.click("Goals"); }
    const button = env.button("Advance to Level 5"), tap = testElementProps(button).onClick as () => void;
    await act(async () => { tap(); tap(); });
    expect(env.session.state.facilityLevel).toBe(5); expect(env.session.state.clinicalXp).toBe(0);
    expect(env.session.state.cashCents).toBe(original.cashCents);
    expect(env.session.state.levelFourCompletion).toEqual(original.levelFourCompletion);
    expect(env.session.state.levelFive!.inspection.status).toBe("locked");
    expect(Object.values(env.session.state.operationReceipts).filter(receipt => receipt.commandType === "LEVEL_UP" && receipt.status === "applied")).toHaveLength(1);
    if (surface === "chip") {
      expect(env.advance).toHaveBeenCalledOnce(); await env.click("Goals 1/3");
    }
    expect(env.element.textContent).toContain("Current-level Clinical XP");
    expect(env.element.textContent).toContain("0/2,000 XP");
    expect(env.element.textContent).toContain("Average staff morale at least 85");
    expect(env.element.textContent).toContain("Inspections locked");
    expect(env.element.textContent).not.toContain("Level 5 coming later");
  });

  it("opens the earned Goals sheet in one tap after conditions decline, with a disabled booking hook", async () => {
    const env = await mount(createLevelFiveStateQaState("goals-declined"));
    const before = env.session.state;
    await env.click("Inspections unlocked");
    expect(env.element.textContent).toContain("Earned Day");
    expect(env.element.textContent).toContain("90% · goal above 90%");
    expect(env.element.textContent).toContain("Book inspection");
    expect(env.button("Book inspection").attributes.disabled).toBeDefined();
    expect(env.advance).not.toHaveBeenCalled(); expect(env.session.state).toBe(before);
    await env.back();
    expect(allElements(env.element, node => node.attributes["data-phone-anchor"] === "goals")).toHaveLength(0);
    expect(env.session.state).toBe(before);
  });

  it("shows the milestone and short tip in Alerts and sends its Show Goals action once without booking", async () => {
    const env = await mount(createLevelFiveStateQaState("goals-unlocked"));
    const before = env.session.state;
    await env.click("Alerts");
    expect(allElements(env.element, node => node.attributes["data-row-kind"] === "milestone" && node.textContent.includes("Inspections unlocked"))).toHaveLength(1);
    expect(allElements(env.element, node => node.attributes["data-row-kind"] === "tip" && node.textContent.includes("Book your first inspection"))).toHaveLength(1);
    expect(allElements(env.element, node => node.attributes["data-need-id"] !== undefined)).toHaveLength(0);
    await env.click("Show Goals");
    expect(env.alertAction.mock.calls).toEqual([[{ kind: "show_goals" }]]);
    expect(env.element.textContent).toContain("Book inspection");
    expect(env.session.state).toBe(before);
    expect(env.session.state.levelFive!.progress.gameFinished).toBeNull();
  });

  it("keeps the Level 5 sheet compact and 44px actions scoped to the phone", () => {
    const css = readFileSync(new URL("./mobileScreens.css", import.meta.url), "utf8");
    expect(css).toContain(".mobile-shell .mobile-goal-card { padding: 4px 8px; margin-bottom: 4px;");
    expect(css).toContain(".mobile-shell .goal-completion-toggle { min-height: 44px;");
    expect(css).toContain(".mobile-shell .mobile-inspection-unlock button { min-height: 44px; width: 100%; white-space: normal; }");
  });
});
