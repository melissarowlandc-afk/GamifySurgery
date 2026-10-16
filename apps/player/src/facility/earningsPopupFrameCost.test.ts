import { describe, expect, it, vi } from "vitest";

import {
  EARNINGS_POPUP_DURATION_MILLISECONDS,
  reconcileEarningsPopups,
  type FacilityEarningsReceipt,
} from "./earningsPopupPresentation";

const receipt: FacilityEarningsReceipt = {
  transactionKey: "income.patient.1",
  actorKind: "patient",
  actorId: "patient.1",
  grossAmount: 120,
};

describe("earnings popup per-frame cost", () => {
  it("only expires popups while the per-tick receipt list is unchanged", () => {
    const seeded = reconcileEarningsPopups(undefined, {
      campaignId: "campaign.a",
      receipts: [],
      actorAnchors: {},
      nowMilliseconds: 0,
    });
    const receipts = [receipt];
    const anchors = vi.fn(() => ({ patient: { "patient.1": true } }));
    const fresh = reconcileEarningsPopups(seeded, {
      campaignId: "campaign.a",
      receipts,
      actorAnchors: anchors,
      nowMilliseconds: 10,
    });
    expect(anchors).toHaveBeenCalledTimes(1);
    expect(fresh.activePopups).toHaveLength(1);

    // Later frames of the same facility tick reuse the same projection.
    const sameFrame = reconcileEarningsPopups(fresh, {
      campaignId: "campaign.a",
      receipts,
      actorAnchors: anchors,
      nowMilliseconds: 20,
    });
    expect(sameFrame).toBe(fresh);
    const expired = reconcileEarningsPopups(sameFrame, {
      campaignId: "campaign.a",
      receipts,
      actorAnchors: anchors,
      nowMilliseconds: 10 + EARNINGS_POPUP_DURATION_MILLISECONDS,
    });
    expect(expired.activePopups).toEqual([]);
    expect(expired.observedTransactionKeys).toEqual(["income.patient.1"]);
    expect(anchors).toHaveBeenCalledTimes(1);

    // A rebuilt projection with no new receipt never replays the old popup.
    const nextTick = reconcileEarningsPopups(expired, {
      campaignId: "campaign.a",
      receipts: [{ ...receipt }],
      actorAnchors: anchors,
      nowMilliseconds: 2_000,
    });
    expect(nextTick.activePopups).toEqual([]);
  });

  it("still resets for a different campaign with the same receipt list", () => {
    const receipts = [receipt];
    const first = reconcileEarningsPopups(undefined, {
      campaignId: "campaign.a", receipts, actorAnchors: {}, nowMilliseconds: 0,
    });
    const switched = reconcileEarningsPopups(first, {
      campaignId: "campaign.b", receipts, actorAnchors: {}, nowMilliseconds: 5,
    });
    expect(switched).toMatchObject({ campaignId: "campaign.b", activePopups: [] });
  });
});
