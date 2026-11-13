import { describe, expect, it } from "vitest";
import { gameReducer, serializeGameState } from "@gamify-surgery/game-domain";
import { createLevelThreeReadyQaState, createLevelFourAlmostQaState } from "../../../../tests/fixtures/level-four-progression";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../../tests/fixtures/level-five-state";
import { setLevelFiveQaCompletedEncounters, setLevelFiveQaPatientSatisfaction } from "../../../../tests/fixtures/level-five-progression";
import { createPrototypePlayerView } from "./viewModels";
import { encodeCloudSnapshot, loadCloudSnapshot } from "./cloud/snapshotCodec";
import { codecTestCampaign } from "./cloud/codecTestSupport";

describe("earned late XP goals in player and snapshot saves", () => {
  it.each([4, 5] as const)("retains the earned round-one Level %i goal through real cloud snapshot adapters", async level => {
    const context = createLevelFiveStateQaContext();
    const state = level === 4 ? createLevelFourAlmostQaState(context) : createLevelFiveStateQaState("pre-goal", context);
    state.lateProgression = {version: "late-progression.v1", preservedClinicalXpGoal: null};
    if (level === 4) state.clinicalXp = 790;
    else {
      setLevelFiveQaCompletedEncounters(state, 330);
      setLevelFiveQaPatientSatisfaction(state, context, 95);
    }
    const campaign = codecTestCampaign(serializeGameState(state));
    const encoded = await encodeCloudSnapshot({state, campaign,
      lineage: {branchId: `public.round2.${level}`, sequence: 1, parents: []}});
    const loaded = await loadCloudSnapshot({snapshot: encoded.snapshot, revision: "1", expectedRevision: "1", expectedCampaignId: state.campaignId});
    expect(loaded.state).toEqual(state); // The snapshot adapter preserves source fields.
    const view = createPrototypePlayerView(loaded.state, null, false, null);
    if (level === 4) expect(view.resourceBar.xpProgressLabel).toBe("790/790 XP");
    else expect(view.progression.goals.find(goal => goal.id === "progression.satisfaction"))
      .toMatchObject({complete: true, displayLabel: "Rating after 330 encounters"});
    const resumed = gameReducer(loaded.state, {type: "SET_PAUSED", paused: true, operationId: `round2.snapshot.${level}`}, context);
    expect(resumed.lateProgression).toEqual({version: "late-progression.v2",
      preservedClinicalXpGoal: level === 4 ? {facilityLevel: 4, minimumClinicalXp: 790} : null,
      preservedCompletedEncounterGoal: level === 5 ? {facilityLevel: 5, minimumCompletedEncounters: 330} : null});
    expect(resumed.facilityLevel).toBe(state.facilityLevel);
    expect(resumed.encounters).toEqual(state.encounters);
    expect(resumed.learningHistories).toEqual(state.learningHistories);
    const saved = await encodeCloudSnapshot({state: resumed, campaign, lineage: {...encoded.lineage, sequence: 2}});
    const reopened = await loadCloudSnapshot({snapshot: saved.snapshot, revision: "2", expectedRevision: "2", expectedCampaignId: state.campaignId});
    expect(reopened.state).toEqual(resumed);
  });

  it.each([true, false])("shows and retains the correct goal across a cloud snapshot, legacy=%s", async legacy => {
    let state = createLevelThreeReadyQaState();
    if (!legacy) state.lateProgression = { version: "late-progression.v1", preservedClinicalXpGoal: null };
    const campaign = codecTestCampaign(serializeGameState(state));
    const encoded = await encodeCloudSnapshot({ state, campaign,
      lineage: { branchId: `public.late-pacing.${legacy}`, sequence: 1, parents: [] } });
    const loaded = await loadCloudSnapshot({ snapshot: encoded.snapshot, revision: "1", expectedRevision: "1", expectedCampaignId: state.campaignId });
    expect(loaded.state).toEqual(state); // Current snapshots preserve every source field.
    state = gameReducer(loaded.state, { type: "SET_PAUSED", paused: true, operationId: "late.pacing.snapshot.resume" });
    const view = createPrototypePlayerView(state, null, false, null);
    expect(view.progression.goals[0]).toMatchObject({ complete: legacy, progressLabel: legacy ? "500/500" : "500/550" });
    expect(view.resourceBar.xpProgressLabel).toBe(legacy ? "500/500 XP" : "500/550 XP");
    expect(state.lateProgression?.preservedClinicalXpGoal).toEqual(legacy ? { facilityLevel: 3, minimumClinicalXp: 500 } : null);
    const saved = await encodeCloudSnapshot({ state, campaign, lineage: { ...encoded.lineage, sequence: 2 } });
    const reopened = await loadCloudSnapshot({ snapshot: saved.snapshot, revision: "2", expectedRevision: "2", expectedCampaignId: state.campaignId });
    expect(reopened.state.lateProgression).toEqual(state.lateProgression);
    expect(createPrototypePlayerView(reopened.state, null, false, null).progression.goals[0]).toEqual(view.progression.goals[0]);
  });
});
