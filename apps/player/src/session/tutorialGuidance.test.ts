import { describe, expect, it } from "vitest";
import { getCampaignTutorialGuidance, normalizeTutorialGuidanceRecords } from "./tutorialGuidance";

const campaigns = [{ campaignId: "first", state: { facilityLevel: 0 } }, { campaignId: "later", state: { facilityLevel: 3 } }];
describe("per-campaign guidance compatibility", () => {
  it("migrates each campaign independently and treats old receipts as exposure", () => {
    expect(normalizeTutorialGuidanceRecords(undefined, campaigns, false, { first: ["sendout-management", "sendout-trash", "sendout-water"] })).toEqual({
      first: {version: 2, mode: "off", exposedTopicIds: ["management", "litter", "water"]},
      later: {version: 2, mode: "complete", exposedTopicIds: []},
    });
  });
  it("keeps an explicit campaign opt-out separate from the default and another campaign", () => {
    const profile = { tutorialsEnabled: true, tutorialDailyRoutineTipAcknowledgments: {}, tutorialGuidanceByCampaign: {
      first: {version: 2 as const, mode: "off" as const, exposedTopicIds: ["patient-folders"]},
    }};
    expect(getCampaignTutorialGuidance(profile, campaigns[0]!)).toEqual(profile.tutorialGuidanceByCampaign.first);
    expect(getCampaignTutorialGuidance(profile, {campaignId: "new", state: {facilityLevel: 0}}).mode).toBe("guided");
  });
  it("normalizes malformed/future records without losing campaign data or inventing progress", () => {
    expect(normalizeTutorialGuidanceRecords({first: {version: 99, mode: "complete"}, later: null, unrelated: {}}, campaigns, true).first?.mode).toBe("guided");
    expect(normalizeTutorialGuidanceRecords({first: {version: 2, mode: "guided", exposedTopicIds: ["management", 5, "management"]}}, campaigns, true).first?.exposedTopicIds).toEqual(["management"]);
  });
});
