import { describe, expect, it } from "vitest";
import { evaluateGuidanceTipCandidates } from "../src";
import { tipsFixture } from "./guidance-tips-fixtures";

describe("guidance evaluation snapshot", () => {
  it("reevaluates construction and room access on the same mutable state", () => {
    const f = tipsFixture();
    const candidates = () => evaluateGuidanceTipCandidates(f.state, f.context);
    expect(candidates().some((tip) => tip.id === "tip.waiting.build")).toBe(true);
    const waiting = f.addRoom("room.waiting").room;
    expect(candidates().some((tip) => tip.id === "tip.waiting.build")).toBe(false);
    f.state.doors = f.state.doors.filter((door) => door.roomId !== waiting.id);
    expect(candidates().some((tip) => tip.id === "tip.access.restore" && tip.targetKey === waiting.id)).toBe(true);
  });

  it("does not retain staff coverage or leak candidate mutations between evaluations", () => {
    const f = tipsFixture();
    const room = f.addRoom("room.reading").room;
    f.addRoom("room.training");
    const reader = f.employee("staff.radiologist", room.id);
    const { phase } = f.diagnostic("interpretation", room.roomDefinitionId, ["staff.radiologist"]);
    phase.status = "active";
    phase.resource = {
      roomInstanceId: room.id, roomDefinitionId: room.roomDefinitionId,
      stationId: "reading.northwest", employeeIds: [reader.id], provider: null,
      patientAnchor: { ...reader.location }, staffAnchor: { ...reader.location },
    };
    const candidates = () => evaluateGuidanceTipCandidates(f.state, f.context);
    const first = candidates();
    expect(first.some((tip) => tip.id === "tip.reading.training")).toBe(true);
    const expected = candidates();
    first.forEach((tip) => { tip.values.fix = "changed by caller"; });
    expect(candidates()).toEqual(expected);
    f.state.employees = [];
    expect(candidates().some((tip) => tip.id === "tip.reading.training")).toBe(false);
  });
});
