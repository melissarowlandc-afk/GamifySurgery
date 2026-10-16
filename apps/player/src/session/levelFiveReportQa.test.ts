import { afterEach, describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { PROTOTYPE_DOMAIN_CONTEXT, deserializeGameState, serializeGameState } from "@gamify-surgery/game-domain";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState, levelFiveQaCampaignId } from "../../../../tests/fixtures/level-five-state";
import { assertLevelFiveQaEntry, prepareLevelFiveQaProfile } from "../../../../tools/qa/level-five-state-bootstrap";
import { createFreshProfile } from "./prototypeStorage";
import { createFacilityInspectionView } from "./inspectionViewModels";

const shipped = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease;
afterEach(() => { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = shipped; });
describe("M7c earned report and finish QA states on the existing 5184 server", () => {
  it.each(["inspection-finish", "inspection-report-card"] as const)("provides %s through real scoring and preserves it on resume in both layouts", scenario => {
    const context = createLevelFiveStateQaContext(); PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = context.balanceRelease;
    for (const layout of ["desktop", "phone"]) expect(assertLevelFiveQaEntry("http://127.0.0.1:5184", "/level4-rooms-qa.html", `?level5=${scenario}&layout=${layout}`)).toBe(scenario);
    const state = deserializeGameState(serializeGameState(createLevelFiveStateQaState(scenario, context)), context);
    const report = state.levelFive!.progress.gameFinished!.firstCompletedReport;
    expect(report).toMatchObject({ outcome: "completed", observedActiveMinutes: 3000, qualifyingScoredPatientCount: 25, recognition: "improving" });
    expect(state.clinicalXp).toBe(2250); expect(report.categories).toHaveLength(10);
    expect(report.categories.reduce((sum, category) => sum + category.weightPercent, 0)).toBe(100);
    expect(report.categories.reduce((sum, category) => sum + category.weightedPoints!, 0)).toBe(report.rawTotalScore);
    const view = createFacilityInspectionView(state);
    expect(view.finish!.report.scoreLabel).toBe("60.05"); expect(view.bestLabel).toBe("60.05");
    expect(view.finish!.acknowledged).toBe(scenario === "inspection-report-card");
    expect(state.levelFive!.inspectionPresentation.actors).toHaveLength(0);
    const base = createFreshProfile();
    const profile = { ...base, activeCampaignId: state.campaignId, campaigns: [{ campaignId: state.campaignId, name: "M7c test",
      createdAtRealMs: 0, updatedAtRealMs: 0, status: "resumable" as const, state }] };
    const existing = profile.campaigns[0]!; existing.state.cash = 1234; existing.state.cashCents = 123400;
    const resumed = prepareLevelFiveQaProfile(profile, scenario);
    expect(resumed.campaigns).toHaveLength(1); expect(resumed.campaigns[0]).toBe(existing);
    expect(resumed.activeCampaignId).toBe(levelFiveQaCampaignId(scenario)); expect(existing.state.cashCents).toBe(123400);
    expect(base.campaigns).toHaveLength(0); expect(PROTOTYPE_BALANCE_RELEASE.facility.maximumPlayableLevel).toBe(5);
  }, 60_000);
});
