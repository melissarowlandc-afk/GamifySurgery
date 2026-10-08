import { describe, expect, it } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT, TUTORIAL_ENCOUNTER_ID, SECOND_TUTORIAL_ENCOUNTER_ID, createInitialGameState, deserializeGameState, gameReducer, serializeGameState, advanceGuidanceTips } from "../src";
import { tipsFixture } from "./guidance-tips-fixtures";
import { GUIDANCE_TIP_CATALOG } from "@gamify-surgery/balance-config";

describe("first shift and contextual guidance share durable topics", () => {
  it("records exposure without a pause, answer, settlement, cash change or false usage", () => {
    const state = createInitialGameState();
    const next = gameReducer(state, {type: "RECORD_GUIDANCE_TOPIC_EXPOSURE", topicIds: ["management", "water"], operationId: "exposure.1"});
    expect(next.paused).toBe(state.paused);
    expect(next.cash).toBe(state.cash);
    expect(next.reviewIntents).toEqual(state.reviewIntents);
    expect(next.settlements).toEqual(state.settlements);
    expect(next.encounters).toEqual(state.encounters);
    expect(next.alertHumor.guidanceTips?.topicActivity?.management).toEqual({exposedAtTick: 0});
    const twice = gameReducer(next, {type: "RECORD_GUIDANCE_TOPIC_EXPOSURE", topicIds: ["management"], operationId: "exposure.2"});
    expect(twice.alertHumor.guidanceTips?.topicActivity).toEqual(next.alertHumor.guidanceTips?.topicActivity);
    const restored = deserializeGameState(serializeGameState(twice));
    expect(restored).toEqual(twice);
    expect(JSON.stringify(restored.alertHumor.guidanceTips?.topicActivity)).toBe(JSON.stringify(twice.alertHumor.guidanceTips?.topicActivity));
  });
  it("records native usage separately and preserves serialization order after later exposure", () => {
    const state = createInitialGameState();
    const used = gameReducer(state, {type: "SET_SIMULATION_SPEED", speed: 4, operationId: "use.speed"});
    expect(used.alertHumor.guidanceTips?.topicActivity?.["pause-speed"]).toEqual({usedAtTick: 0});
    const exposed = gameReducer(used, {type: "RECORD_GUIDANCE_TOPIC_EXPOSURE", topicIds: ["pause-speed"], operationId: "expose.speed"});
    expect(exposed.alertHumor.guidanceTips?.topicActivity?.["pause-speed"]).toEqual({exposedAtTick: 0, usedAtTick: 0});
    const restored = deserializeGameState(serializeGameState(exposed));
    expect(restored).toEqual(exposed);
    expect(JSON.stringify(restored.alertHumor.guidanceTips?.topicActivity)).toBe(JSON.stringify(exposed.alertHumor.guidanceTips?.topicActivity));
    const invalid = gameReducer(exposed, {type: "RECORD_GUIDANCE_TOPIC_EXPOSURE", topicIds: ["invented-topic"], operationId: "invalid.topic"});
    expect(invalid.operationReceipts["invalid.topic"]?.status).toBe("rejected");
    expect(invalid.alertHumor.guidanceTips?.topicActivity).toEqual(exposed.alertHumor.guidanceTips?.topicActivity);
  });
  it("lets the active coach own its topic without spending cadence or pausing", () => {
    const f = tipsFixture();
    f.state.facilityLevel = 1; f.state.cash = 0; f.state.cashCents = 0;
    const tips = f.state.alertHumor.guidanceTips!;
    const otherTopics = GUIDANCE_TIP_CATALOG.filter((tip) => tip.id !== "tip.cash.manual-consult").map((tip) => tip.id);
    const blocked = {...f.context, guidanceBlockedTopicIds: [...otherTopics, "paid-consult"]};
    f.state.facilityTick = 1500;
    advanceGuidanceTips(f.state, blocked);
    f.state.facilityTick = 1560;
    expect(advanceGuidanceTips(f.state, blocked)).toBe(false);
    expect(tips.history).toHaveLength(0);
    expect(tips.lastEmittedAtTick).toBeNull();
    expect(f.state.paused).toBe(false);
    expect(advanceGuidanceTips(f.state, {...f.context, guidanceBlockedTopicIds: otherTopics})).toBe(true);
    expect(tips.history[0]?.tipId).toBe("tip.cash.manual-consult");
    expect(tips.topicActivity?.["paid-consult"]?.exposedAtTick).toBe(1560);
  });
  it("defers ordinary teaching during Help/repair attention without marking a dire event", () => {
    const f = tipsFixture(); f.state.facilityLevel = 1;
    f.state.facilityTick = 1500; advanceGuidanceTips(f.state);
    f.state.facilityTick = 1560;
    expect(advanceGuidanceTips(f.state, {...PROTOTYPE_DOMAIN_CONTEXT, guidanceAttentionBlocked: true})).toBe(false);
    expect(f.state.alertHumor.guidanceTips?.lastDireAtTick).toBeNull();
    expect(f.state.alertHumor.guidanceTips?.history).toHaveLength(0);
  });
  it.each([1,2,3] as const)("unlocks advanced legacy level %s without fabricating a second visit or resetting cadence", (level) => {
    const state = createInitialGameState(); state.facilityLevel = level;
    delete state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID];
    state.alertHumor.nextAmbientAlertTick = 250;
    state.alertHumor.conditionLastEmittedTicks["ambient:previous"] = 0;
    const next = gameReducer(state, {type: "SET_PAUSED", paused: false, operationId: "legacy.advance"});
    expect(next.alertHumor.alertsTutorialAcknowledgedAtTick).toBe(0);
    expect(next.alertHumor.nextAmbientAlertTick).toBe(250);
    expect(next.alertHumor.conditionLastEmittedTicks["ambient:previous"]).toBe(0);
    expect(next.alertHumor.ambientSequence).toBe(state.alertHumor.ambientSequence);
    expect(next.alertHumor.recentAmbientDefinitionIds).toEqual(state.alertHumor.recentAmbientDefinitionIds);
    expect(next.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]).toBeUndefined();
    const paused = gameReducer(next, {type: "SET_PAUSED", paused: true, operationId: "legacy.pause"});
    expect(paused.alertHumor.nextAmbientAlertTick).toBe(250);
    expect(paused.paused).toBe(true);
  });
  it("automatically unlocks commentary only after both Level-0 charts are filed", () => {
    const state = createInitialGameState();
    const first = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    first.lifecycle = "resolved"; first.resolutionReason = "completed";
    state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID] = {...structuredClone(first), id: SECOND_TUTORIAL_ENCOUNTER_ID, lifecycle: "resolved_summary_available"};
    const before = gameReducer(state, {type: "SET_PAUSED", paused: true, operationId: "before.filing"});
    expect(before.alertHumor.alertsTutorialAcknowledgedAtTick).toBeNull();
    before.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]!.lifecycle = "resolved";
    const after = gameReducer(before, {type: "SET_PAUSED", paused: true, operationId: "after.filing"});
    expect(after.alertHumor.alertsTutorialAcknowledgedAtTick).toBe(0);
    expect(after.alertHumor.nextAmbientAlertTick).toBeGreaterThanOrEqual(120);
    expect(after.paused).toBe(true);
  });
});
