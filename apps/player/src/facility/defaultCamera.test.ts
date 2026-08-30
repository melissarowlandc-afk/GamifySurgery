import { describe, expect, it } from "vitest";

import { getInitialFacilityCamera } from "./defaultCamera";

describe("initial facility camera", () => {
  it("keeps the complete isolated Level 0 cutaway shell within the viewport", () => {
    expect(getInitialFacilityCamera({
      facilityLevel: 0,
      rooms: [{ roomDefinitionId: "room.front_desk" }],
    } as never)).toEqual({ zoom: 1.1, panX: 0, panY: 0 });
  });

  it("keeps expanded and later clinics at the normal overview", () => {
    expect(getInitialFacilityCamera({
      facilityLevel: 0,
      rooms: [
        { roomDefinitionId: "room.front_desk" },
        { roomDefinitionId: "room.examination" },
      ],
    } as never)).toEqual({ zoom: 1, panX: 0, panY: 0 });
    expect(getInitialFacilityCamera({
      facilityLevel: 1,
      rooms: [{ roomDefinitionId: "room.front_desk" }],
    } as never)).toEqual({ zoom: 1, panX: 0, panY: 0 });
  });
});
