import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { PROTOTYPE_DOMAIN_CONTEXT, gameReducer, serializeGameState } from "@gamify-surgery/game-domain";
import { createLevelFiveLaunchQaState, LEVEL_FIVE_LAUNCH_QA_SCENARIOS } from "../../../../tests/fixtures/level-five-launch";
import { assertLevelFiveLaunchQaEntry, bootstrapLevelFiveLaunchQa, prepareLevelFiveLaunchQaProfile } from "../../../../tools/qa/level-five-launch-bootstrap";
import { createPrototypePlayerView } from "./viewModels";
import { createFreshProfile, loadPrototypeProfile, savePrototypeProfileResult } from "./prototypeStorage";
import { GoalsPanel } from "../ui/GoalsPanel";
import { MobileGoals, MobileGoalsChip } from "../mobile/MobileGoals";
import { FinishedGamePage } from "../ui/FinishedGamePage";

vi.mock("../main", () => ({}));
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
const viewOf = (state: ReturnType<typeof createLevelFiveLaunchQaState>) => createPrototypePlayerView(state, null, false, null);

describe("M10 ordinary launch in desktop and phone presentations", () => {
  it.each(["launch-ready", "launch-unmet"] as const)("shows the original Level 4 gates and the correct Advance for %s", scenario => {
    const state = createLevelFiveLaunchQaState(scenario), view = viewOf(state).progression;
    expect(PROTOTYPE_DOMAIN_CONTEXT.balanceRelease).toBe(PROTOTYPE_BALANCE_RELEASE);
    expect(view.goals).toHaveLength(5); expect(view.prototypeComplete).toBe(false);
    expect(view.canLevelUp).toBe(scenario === "launch-ready");
    const markups = [renderToStaticMarkup(<GoalsPanel view={view} onLevelUp={vi.fn()} onProcedureSetupAction={vi.fn()} />),
      renderToStaticMarkup(<MobileGoals view={view} onLevelUp={vi.fn()} onSetupAction={vi.fn()} />)];
    for (const markup of markups) {
      expect(markup.includes("Advance to Level 5")).toBe(scenario === "launch-ready");
      expect(markup).not.toMatch(/coming later|Level 6|You finished/);
    }
    const chip = renderToStaticMarkup(<MobileGoalsChip view={view} onLevelUp={vi.fn()} onShowGoals={vi.fn()} />);
    expect(chip).toContain(scenario === "launch-ready" ? "Advance · Level 5" : "Goals 4/5");
  });

  it("exposes the five rooms, Executive and final-level goals through the ordinary shared view", () => {
    const view = viewOf(createLevelFiveLaunchQaState("launch-build"));
    expect(view.resourceBar.xpProgressLabel).toBe("0/2000 XP");
    expect(view.facility.levelFiveRoomArt).toBe(true);
    for (const id of ["room.founder_office", "room.executive_office", "room.gift_shop", "room.indoor_garden", "room.staff_gym"])
      expect(view.roomOptions.filter(room => room.id === id)).toHaveLength(1);
    expect(view.staffRoles.find(role => role.id === "staff.executive")).toBeDefined();
    expect(view.progression.inspection!.status).toBe("locked");
    const markups = [renderToStaticMarkup(<GoalsPanel view={view.progression} onLevelUp={vi.fn()} onProcedureSetupAction={vi.fn()} />),
      renderToStaticMarkup(<MobileGoals view={view.progression} onLevelUp={vi.fn()} onSetupAction={vi.fn()} />)];
    for (const markup of markups) {
      expect(markup).toContain("Final level"); expect(markup).toContain("Book inspection · Locked");
      expect(markup).not.toMatch(/coming later|Level 6/);
    }
    const active = viewOf(createLevelFiveLaunchQaState("launch-running"));
    expect(active.facility.inspectors).toHaveLength(10);
    expect(active.progression.inspection!.status).toBe("running");
  });

  it.each([false, true])("renders the ordinary finish report with ten categories and both actions, compact=%s", compact => {
    const inspection = viewOf(createLevelFiveLaunchQaState("launch-finish")).progression.inspection!;
    expect(inspection.finish!.report.scoreLabel).toBe("62.49");
    expect(inspection.finish!.report.categories).toHaveLength(10);
    const markup = renderToStaticMarkup(<FinishedGamePage view={inspection.finish!} compact={compact}
      bestLabel={inspection.bestLabel} latestLabel={inspection.latestLabel} onKeepPlaying={vi.fn()} onStartNewCampaign={vi.fn()} />);
    expect(markup).toContain("Congratulations. Your reward is a report card and the opportunity to improve it.");
    expect(markup).toContain("Keep playing"); expect(markup).toContain("Start new campaign");
    expect(markup).not.toMatch(/coming later|Level 6/);
  });
});

describe("M10 disposable QA uses the ordinary entry context", () => {
  it.each(LEVEL_FIVE_LAUNCH_QA_SCENARIOS)("guards desktop/phone URLs and resumes %s without reseeding", scenario => {
    for (const layout of ["desktop", "phone"]) expect(assertLevelFiveLaunchQaEntry("http://127.0.0.1:5184", "/level4-rooms-qa.html", `?level5=${scenario}&layout=${layout}`)).toBe(scenario);
    const profile = prepareLevelFiveLaunchQaProfile(createFreshProfile(), scenario), campaign = profile.campaigns[0]!;
    campaign.state.cash = 1234; campaign.state.cashCents = 123400;
    expect(prepareLevelFiveLaunchQaProfile(profile, scenario).campaigns[0]).toBe(campaign);
    expect(profile.campaigns).toHaveLength(1);
    expect(PROTOTYPE_DOMAIN_CONTEXT.balanceRelease).toBe(PROTOTYPE_BALANCE_RELEASE);
  });

  it.each([
    ["http://127.0.0.1:4173", "/level4-rooms-qa.html", "?level5=launch-ready"],
    ["https://melissadesktop.taile197db.ts.net", "/level4-rooms-qa.html", "?level5=launch-ready"],
    ["http://127.0.0.1:5184", "/", "?level5=launch-ready"],
    ["http://127.0.0.1:5184", "/level4-rooms-qa.html", "?level5=launch-unknown"],
  ])("rejects an unapproved fixture entry %s%s%s", (origin, path, search) => {
    expect(() => assertLevelFiveLaunchQaEntry(origin, path, search)).toThrow();
  });

  it("boots, advances, loads through ordinary storage and reloads without installing QA balance", async () => {
    const balance = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease, memory = new Map<string, string>();
    vi.stubGlobal("window", { localStorage: { getItem: (key: string) => memory.get(key) ?? null,
      setItem: (key: string, value: string) => { memory.set(key, value); }, removeItem: (key: string) => { memory.delete(key); } } });
    vi.stubGlobal("location", { origin: "http://127.0.0.1:5184", pathname: "/level4-rooms-qa.html", search: "?level5=launch-ready&layout=phone" });
    vi.stubGlobal("document", { title: "" }); vi.spyOn(console, "info").mockImplementation(() => {});
    await bootstrapLevelFiveLaunchQa();
    expect(PROTOTYPE_DOMAIN_CONTEXT.balanceRelease).toBe(balance);
    const profile = loadPrototypeProfile().profile, campaign = profile.campaigns[0]!;
    campaign.state = gameReducer(campaign.state, { type: "LEVEL_UP", operationId: "m10.qa.advance" });
    expect(campaign.state.facilityLevel).toBe(5);
    expect(savePrototypeProfileResult(profile).ok).toBe(true);
    const ordinary = loadPrototypeProfile().profile;
    expect(serializeGameState(ordinary.campaigns[0]!.state)).toBe(serializeGameState(campaign.state));
    await bootstrapLevelFiveLaunchQa();
    expect(PROTOTYPE_DOMAIN_CONTEXT.balanceRelease).toBe(balance);
    expect(loadPrototypeProfile().profile.campaigns).toHaveLength(1);
    expect(serializeGameState(loadPrototypeProfile().profile.campaigns[0]!.state)).toBe(serializeGameState(campaign.state));
  });
});
