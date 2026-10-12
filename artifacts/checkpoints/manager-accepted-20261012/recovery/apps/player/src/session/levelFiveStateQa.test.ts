import { afterEach, describe, expect, it, vi } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { PROTOTYPE_DOMAIN_CONTEXT, createInitialGameState, deserializeGameState, serializeGameState } from "@gamify-surgery/game-domain";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState, levelFiveQaCampaignId,
  LEVEL_FIVE_QA_SCENARIOS } from "../../../../tests/fixtures/level-five-state";
import { assertLevelFiveQaEntry, assertLevelFourQaProfileCompatible, bootstrapLevelFiveStateQa, prepareLevelFiveQaProfile } from "../../../../tools/qa/level-five-state-bootstrap";
import { createFreshProfile, loadPrototypeProfile, PROTOTYPE_PROFILE_KEY, savePrototypeProfileResult } from "./prototypeStorage";
import { createPrototypePlayerView } from "./viewModels";

// Bootstrapping the real App/auth/React is manager browser QA, not a Node test side effect.
vi.mock("../main", () => ({}));
const shippedBalance = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease;
afterEach(() => { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = shippedBalance; vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe("isolated Level 5 M1 state QA", () => {
  it.each([
    ["http://127.0.0.1:4173", "/level4-rooms-qa.html", "?level5=pre-goal"],
    ["http://localhost:5184", "/level4-rooms-qa.html", "?level5=pre-goal"],
    ["http://127.0.0.1:5184", "/", "?level5=pre-goal"],
    ["http://127.0.0.1:5184", "/level4-rooms-qa.html", "?layout=phone"],
    ["http://127.0.0.1:5184", "/level4-rooms-qa.html", "?level5=unknown"],
  ])("rejects an unapproved entry %s%s%s before touching storage/context", (origin, pathname, search) => {
    expect(() => assertLevelFiveQaEntry(origin, pathname, search)).toThrow();
    expect(PROTOTYPE_DOMAIN_CONTEXT.balanceRelease).toBe(shippedBalance);
  });

  it("requires the explicit query while preserving phone/desktop query parameters", () => {
    expect(assertLevelFiveQaEntry("http://127.0.0.1:5184", "/level4-rooms-qa.html", "?level5=&layout=phone")).toBe("pre-goal");
    expect(assertLevelFiveQaEntry("http://127.0.0.1:5184", "/level4-rooms-qa.html", "?level5=finish&layout=desktop")).toBe("finish");
  });

  it("protects Level 5 QA saves from a cap-4 entry while leaving old/empty profile handling intact", () => {
    for (const value of [null, "invalid", "{}", JSON.stringify({ campaigns: [{ serializedState: "invalid" }] }),
      JSON.stringify({ campaigns: [0, { serializedState: JSON.stringify({ facilityLevel: 4 }) }] })]) {
      expect(() => assertLevelFourQaProfileCompatible(value)).not.toThrow();
    }
    const value = JSON.stringify({ campaigns: [{ serializedState: serializeGameState(createLevelFiveStateQaState()) }] });
    expect(() => assertLevelFourQaProfileCompatible(value, 4)).toThrow(/Keep \?level5=/);
    expect(() => assertLevelFourQaProfileCompatible(value)).not.toThrow();
    expect(PROTOTYPE_DOMAIN_CONTEXT.balanceRelease).toBe(shippedBalance);
  });

  it("selects separate scenario campaigns without overwriting existing Level 4/Level 5 data or the caller profile", () => {
    const existingState = createInitialGameState(); existingState.facilityLevel = 4;
    const base = createFreshProfile();
    base.campaigns.push({ campaignId: existingState.campaignId, name: "Existing disposable Level 4",
      createdAtRealMs: 0, updatedAtRealMs: 0, status: "resumable", state: existingState });
    const eligible = prepareLevelFiveQaProfile(base, "eligible");
    expect(base.campaigns).toHaveLength(1);
    expect(eligible.campaigns[0]).toBe(base.campaigns[0]);
    const target = eligible.campaigns[1]!;
    target.state.cash = 1234; target.state.cashCents = 123400; target.state.paused = false;
    const actors = prepareLevelFiveQaProfile(eligible, "actors"), resumed = prepareLevelFiveQaProfile(actors, "eligible");
    expect(resumed.campaigns).toHaveLength(3);
    expect(resumed.campaigns[1]).toBe(target);
    expect(resumed.campaigns[1]!.state).toMatchObject({ cashCents: 123400, paused: false });
    expect(resumed.activeCampaignId).toBe(levelFiveQaCampaignId("eligible"));
  });

  it.each(LEVEL_FIVE_QA_SCENARIOS.filter(scenario => !scenario.startsWith("executive") && !scenario.startsWith("inspection-") && !scenario.startsWith("economy") && !scenario.startsWith("integration-")))("keeps foundation records outside the M6 unlock view out of the shared projection for %s", scenario => {
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = createLevelFiveStateQaContext().balanceRelease;
    vi.spyOn(Date, "now").mockReturnValue(0);
    const state = deserializeGameState(serializeGameState(createLevelFiveStateQaState(scenario)), PROTOTYPE_DOMAIN_CONTEXT);
    const control = structuredClone(state); delete control.levelFive;
    const view = createPrototypePlayerView(state, null, false, null);
    const controlView = createPrototypePlayerView(control, null, false, null);
    if (state.facilityLevel === 5) {
      expect(view.progression.inspectionUnlock?.unlocked).toBe(Boolean(state.levelFive?.progress.inspectionUnlocked));
      controlView.progression.inspectionUnlock = view.progression.inspectionUnlock;
      // M7a exposes the activated inspection lane through its dedicated model.
      controlView.progression.inspection = view.progression.inspection;
      // M7b activates only the dedicated presentation projection; all other fields remain equal.
      if (view.facility.inspectors) controlView.facility.inspectors = view.facility.inspectors;
    }
    expect(view).toEqual(controlView);
    expect(view.facility.staff).toHaveLength(state.employees.length);
    expect(state.employees.some(employee => employee.staffRoleDefinitionId === "staff.executive")).toBe(scenario === "gift-suppliers");
    expect(PROTOTYPE_BALANCE_RELEASE.facility.maximumPlayableLevel).toBe(5);
  });

  it("loads, saves and resumes the same synthetic campaign in memory with the opt-in installed before storage validation", async () => {
    const memory = new Map<string, string>();
    vi.stubGlobal("window", { localStorage: { getItem: (key: string) => memory.get(key) ?? null,
      setItem: (key: string, value: string) => { memory.set(key, value); }, removeItem: (key: string) => { memory.delete(key); } } });
    vi.stubGlobal("location", { origin: "http://127.0.0.1:5184", pathname: "/level4-rooms-qa.html", search: "?level5=actors&layout=phone" });
    vi.stubGlobal("document", { title: "" });
    vi.spyOn(console, "info").mockImplementation(() => {});
    await bootstrapLevelFiveStateQa();
    expect(PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.maximumPlayableLevel).toBe(5);
    const loaded = loadPrototypeProfile().profile;
    const campaign = loaded.campaigns.find(campaign => campaign.campaignId === loaded.activeCampaignId)!;
    expect(campaign.state.levelFive!.inspectionPresentation.actors).toHaveLength(10);
    campaign.state.cashCents = 123456; campaign.state.cash = 1234.56;
    const foundation = structuredClone(campaign.state.levelFive);
    expect(savePrototypeProfileResult(loaded).ok).toBe(true);
    await bootstrapLevelFiveStateQa();
    const persisted = JSON.parse(memory.get(PROTOTYPE_PROFILE_KEY)!);
    expect(persisted.campaigns).toHaveLength(1);
    const saved = deserializeGameState(persisted.campaigns[0].serializedState, PROTOTYPE_DOMAIN_CONTEXT);
    expect(saved.cashCents).toBe(123456);
    expect(saved.levelFive).toEqual(foundation);
    expect(PROTOTYPE_BALANCE_RELEASE.facility.maximumPlayableLevel).toBe(5);
  });
});
