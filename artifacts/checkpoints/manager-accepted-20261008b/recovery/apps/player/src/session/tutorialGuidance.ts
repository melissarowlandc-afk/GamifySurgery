/** Presentation preferences only. Encounter and facility state own progress. */
export interface CampaignTutorialGuidance {
  version: 2;
  mode: "guided" | "off" | "complete";
  exposedTopicIds: string[];
}

interface GuidanceCampaign {
  campaignId: string;
  state: { facilityLevel: number };
}

const LEGACY_TOPICS: Record<string, string> = {
  "sendout-management": "management",
  "sendout-trash": "litter",
  "sendout-water": "water",
};

export function normalizeTutorialGuidanceRecords(
  value: unknown,
  campaigns: readonly GuidanceCampaign[],
  defaultEnabled: boolean,
  legacyAcknowledgments: Record<string, string[]> = {},
): Record<string, CampaignTutorialGuidance> {
  const records = typeof value === "object" && value !== null
    ? value as Record<string, unknown> : {};
  return Object.fromEntries(campaigns.map((campaign) => {
    const raw = records[campaign.campaignId] as Partial<CampaignTutorialGuidance> | null;
    const valid = raw?.version === 2 && ["guided", "off", "complete"].includes(raw.mode ?? "");
    const topics = valid && Array.isArray(raw.exposedTopicIds)
      ? raw.exposedTopicIds.filter((id): id is string => typeof id === "string") : [];
    const mode = campaign.state.facilityLevel >= 1 ? "complete"
      : valid ? raw.mode! : defaultEnabled ? "guided" : "off";
    return [campaign.campaignId, {
      version: 2,
      mode,
      exposedTopicIds: [...new Set([...topics, ...(legacyAcknowledgments[campaign.campaignId] ?? [])
        .flatMap((id) => LEGACY_TOPICS[id] ? [LEGACY_TOPICS[id]!] : [])])],
    } satisfies CampaignTutorialGuidance];
  }));
}

export function getCampaignTutorialGuidance(
  profile: {
    tutorialsEnabled: boolean;
    tutorialGuidanceByCampaign?: Record<string, CampaignTutorialGuidance>;
    tutorialDailyRoutineTipAcknowledgments: Record<string, string[]>;
  },
  campaign: GuidanceCampaign,
): CampaignTutorialGuidance {
  return normalizeTutorialGuidanceRecords(profile.tutorialGuidanceByCampaign, [campaign],
    profile.tutorialsEnabled, profile.tutorialDailyRoutineTipAcknowledgments)[campaign.campaignId]!;
}
