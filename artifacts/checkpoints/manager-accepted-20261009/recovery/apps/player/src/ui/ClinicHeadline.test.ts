import { describe, expect, it } from "vitest";
import { clinicHeadlineCandidates } from "./ClinicHeadline";

describe("clinic headline announcements", () => {
  it("leaves terminal Level 4 completion to Goals and the feed, while announcing advances and urgent needs", () => {
    const items = [
      { id: "event.facility-level-4-complete", message: "Level 4 complete - Level 5 coming later.", sortKey: 40 },
      ...[2, 3, 4].map((level) => ({ id: `advance.${level}`, message: `Facility advanced to Level ${level}.`, sortKey: level })),
    ];
    const candidates = clinicHeadlineCandidates(items, [{
      id: "urgent", kind: "save", title: "Campaign save failed", why: "Retry save", sortKey: 10,
      action: { kind: "save_and_pause" }, actionLabel: "Retry save & pause",
    }]);
    expect(candidates.map((item) => item.id)).toEqual(["urgent", "advance.4", "advance.3", "advance.2"]);
  });
});
