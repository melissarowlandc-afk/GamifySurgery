import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "./prototype-balance";

describe("row 57 off-site functional-study services", () => {
  it("keeps every displayed study off-site with equal editorial prototype timing", () => {
    const services = [
      "service.hs.heat-damaged-rbc-scintigraphy",
      "service.hs.sulfur-colloid-scintigraphy",
      "service.hs.noncontrast-abdominal-ct",
    ].map((id) =>
      PROTOTYPE_BALANCE_RELEASE.services.find((service) => service.id === id),
    );

    expect(services).toHaveLength(3);
    expect(services.every((service) => Boolean(service?.routes))).toBe(true);
    expect(
      services.map((service) => service!.routes[0]!.durationTicks),
    ).toEqual([120, 120, 120]);
    expect(
      services.flatMap((service) => service!.routes).every(
        (route) => route.requiredCapabilityId === null && route.requiredCapabilityIds.length === 0,
      ),
    ).toBe(true);
  });
});
