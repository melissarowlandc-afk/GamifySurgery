import { describe, expect, it } from "vitest";

import {
  canAcceptExpertOpinion,
  resolveLocalReviewerProfile,
} from "./reviewer.js";

describe("local reviewer profile", () => {
  it("uses an explicit stable server-side audit identity", () => {
    expect(
      resolveLocalReviewerProfile({
        CLINICAL_WORKBENCH_REVIEWER_ID: "reviewer.local.developer_one",
        CLINICAL_WORKBENCH_REVIEWER_ROLE: "developer",
      }),
    ).toEqual({
      id: "reviewer.local.developer_one",
      role: "developer",
      configuredExplicitly: true,
    });
  });

  it("keeps a safe single-user default and rejects ambiguous values", () => {
    expect(resolveLocalReviewerProfile({})).toEqual({
      id: "reviewer.local.owner",
      role: "owner",
      configuredExplicitly: false,
    });
    expect(() =>
      resolveLocalReviewerProfile({
        CLINICAL_WORKBENCH_REVIEWER_ID: "Jane Doe",
        CLINICAL_WORKBENCH_REVIEWER_ROLE: "owner",
      }),
    ).toThrow(/stable lowercase identifier/i);
    expect(() =>
      resolveLocalReviewerProfile({
        CLINICAL_WORKBENCH_REVIEWER_ID: "reviewer.local.jane",
        CLINICAL_WORKBENCH_REVIEWER_ROLE: "clinical_approver",
      }),
    ).toThrow(/must be one of/i);
  });

  it("limits Expert Opinion acceptance to owner and clinical reviewer roles", () => {
    expect(canAcceptExpertOpinion("owner")).toBe(true);
    expect(canAcceptExpertOpinion("clinical_reviewer")).toBe(true);
    expect(canAcceptExpertOpinion("developer")).toBe(false);
    expect(canAcceptExpertOpinion("rights_reviewer")).toBe(false);
    expect(canAcceptExpertOpinion("administrator")).toBe(false);
  });
});
