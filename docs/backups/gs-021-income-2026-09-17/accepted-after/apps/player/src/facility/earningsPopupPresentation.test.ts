import { describe, expect, it } from "vitest";

import {
  EARNINGS_POPUP_DURATION_MILLISECONDS,
  formatEarningsPopupAmount,
  getEarningsPopupLabelY,
  reconcileEarningsPopups,
  type FacilityEarningsReceipt,
} from "./earningsPopupPresentation";

const patientReceipt: FacilityEarningsReceipt = {
  transactionKey: "income.patient.1",
  actorKind: "patient",
  actorId: "patient.1",
  grossAmount: 120,
};

const employeeReceipt: FacilityEarningsReceipt = {
  transactionKey: "income.employee.1",
  actorKind: "employee",
  actorId: "employee.1",
  grossAmount: 50,
};

const visibleActors = {
  patient: { "patient.1": true },
  employee: { "employee.1": true },
  founder: { founder: true },
};

describe("earnings popup presentation", () => {
  it("seeds a loaded campaign from receipt history without replaying cash or markup", () => {
    const state = reconcileEarningsPopups(undefined, {
      campaignId: "campaign.a",
      receipts: [patientReceipt],
      actorAnchors: visibleActors,
      nowMilliseconds: 100,
    });

    expect(state.activePopups).toEqual([]);
    expect(state.observedTransactionKeys).toEqual(["income.patient.1"]);
  });

  it("shows simultaneous fresh receipts exactly once for their actual actors", () => {
    const initial = reconcileEarningsPopups(undefined, {
      campaignId: "campaign.a",
      receipts: [],
      actorAnchors: visibleActors,
      nowMilliseconds: 100,
    });
    const fresh = reconcileEarningsPopups(initial, {
      campaignId: "campaign.a",
      receipts: [patientReceipt, employeeReceipt, patientReceipt],
      actorAnchors: visibleActors,
      nowMilliseconds: 250,
    });
    const repeated = reconcileEarningsPopups(fresh, {
      campaignId: "campaign.a",
      receipts: [patientReceipt, employeeReceipt],
      actorAnchors: visibleActors,
      nowMilliseconds: 500,
    });

    expect(fresh.activePopups).toEqual([
      expect.objectContaining({ transactionKey: "income.patient.1", actorKind: "patient", actorId: "patient.1", grossAmount: 120 }),
      expect.objectContaining({ transactionKey: "income.employee.1", actorKind: "employee", actorId: "employee.1", grossAmount: 50 }),
    ]);
    expect(repeated.activePopups).toEqual(fresh.activePopups);
  });

  it("does not fabricate a customer for remote income, but accepts an explicit future fallback anchor", () => {
    const initial = reconcileEarningsPopups(undefined, {
      campaignId: "campaign.a", receipts: [], actorAnchors: visibleActors, nowMilliseconds: 0,
    });
    const remote: FacilityEarningsReceipt = {
      transactionKey: "income.remote.1", actorKind: "remote", actorId: "telehealth.station", grossAmount: 50,
    };
    const withoutAnchor = reconcileEarningsPopups(initial, {
      campaignId: "campaign.a", receipts: [remote], actorAnchors: visibleActors, nowMilliseconds: 10,
    });
    const withAnchor = reconcileEarningsPopups(initial, {
      campaignId: "campaign.a", receipts: [remote], actorAnchors: { ...visibleActors, remote: { "telehealth.station": true } }, nowMilliseconds: 10,
    });

    expect(withoutAnchor.activePopups).toEqual([]);
    expect(withAnchor.activePopups).toEqual([
      expect.objectContaining({ actorKind: "remote", actorId: "telehealth.station" }),
    ]);
  });

  it("anchors a fresh retail receipt to its distinct outside buyer and rejects a zero-dollar popup", () => {
    const initial = reconcileEarningsPopups(undefined, {
      campaignId: "campaign.a", receipts: [], actorAnchors: visibleActors, nowMilliseconds: 0,
    });
    const receipt: FacilityEarningsReceipt = {
      transactionKey: "income.retail.visitor.1", actorKind: "retail_visitor", actorId: "retail-visitor.1", grossAmount: 5,
    };
    const retail = reconcileEarningsPopups(initial, {
      campaignId: "campaign.a", receipts: [receipt],
      actorAnchors: { ...visibleActors, retail_visitor: { "retail-visitor.1": true } }, nowMilliseconds: 10,
    });
    const zero = reconcileEarningsPopups(initial, {
      campaignId: "campaign.a", receipts: [{ ...receipt, grossAmount: 0 }],
      actorAnchors: { ...visibleActors, retail_visitor: { "retail-visitor.1": true } }, nowMilliseconds: 10,
    });

    expect(retail.activePopups).toEqual([
      expect.objectContaining({ actorKind: "retail_visitor", actorId: "retail-visitor.1", grossAmount: 5 }),
    ]);
    expect(zero.activePopups).toEqual([]);
  });

  it("resets its local cursor for a campaign switch and expires finite events after 1.5 real seconds", () => {
    const initial = reconcileEarningsPopups(undefined, {
      campaignId: "campaign.a", receipts: [], actorAnchors: visibleActors, nowMilliseconds: 0,
    });
    const fresh = reconcileEarningsPopups(initial, {
      campaignId: "campaign.a", receipts: [patientReceipt], actorAnchors: visibleActors, nowMilliseconds: 25,
    });
    const expired = reconcileEarningsPopups(fresh, {
      campaignId: "campaign.a", receipts: [patientReceipt], actorAnchors: visibleActors,
      nowMilliseconds: 25 + EARNINGS_POPUP_DURATION_MILLISECONDS,
    });
    const switched = reconcileEarningsPopups(fresh, {
      campaignId: "campaign.b", receipts: [patientReceipt], actorAnchors: visibleActors, nowMilliseconds: 30,
    });

    expect(expired.activePopups).toEqual([]);
    expect(switched).toMatchObject({ campaignId: "campaign.b", activePopups: [] });
    expect(formatEarningsPopupAmount(50)).toBe("+$50");
    expect(formatEarningsPopupAmount(3.5)).toBe("+$3.50");
  });

  it("places labels above an actor head and vertically stacks simultaneous credits", () => {
    const first = getEarningsPopupLabelY(100, 32, 0);
    const second = getEarningsPopupLabelY(100, 32, 1);

    expect(first).toBeLessThan(100);
    expect(second).toBeLessThan(first);
    expect(first - second).toBeGreaterThanOrEqual(14);
  });
});
