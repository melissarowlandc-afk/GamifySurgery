import { expect, it, vi } from "vitest";
import { createMapPinPositionWriter } from "./mapPinPositions";
import { facilityProofEnabled } from "./facilityProofPolicy";

it("moves mounted pins by transform with no React membership update across 1000 camera frames", () => {
  const changed = vi.fn(), writer = createMapPinPositionWriter(changed);
  const base = { id: "pin", x: 80, y: 60 }, element = { style: { transform: "" } } as HTMLButtonElement;
  writer.publish([base]); writer.bind(base.id, element, base); changed.mockClear();
  for (let i = 1; i <= 1000; i++) writer.publish([{ ...base, x: base.x + i, y: base.y - i }]);
  expect(changed).not.toHaveBeenCalled(); expect(element.style.transform).toBe("translate(1000px, -1000px) translate(-50%, -100%)");
  writer.bind(base.id, null, base); writer.publish([{ ...base, x: 0, y: 0 }]);
  expect(element.style.transform).toContain("1000px"); // Removed nodes are never retained/updated.
});
it("publishes visible membership changes and rebases retained buttons after a React commit", () => {
  const changed = vi.fn(), writer = createMapPinPositionWriter(changed), element = { style: { transform: "" } } as HTMLButtonElement;
  writer.publish([{ id: "pin", x: 40, y: 70 }]);
  writer.bind("pin", element, { id: "pin", x: 10, y: 20 });
  expect(element.style.transform).toBe("translate(30px, 50px) translate(-50%, -100%)");
  writer.bind("pin", null, { id: "pin", x: 10, y: 20 });
  writer.bind("pin", element, { id: "pin", x: 40, y: 70 });
  expect(element.style.transform).toBe("translate(0px, 0px) translate(-50%, -100%)");
  writer.publish([]); expect(changed).toHaveBeenCalledTimes(2);
});
it("does not expose the opt-in Phaser proof in an ordinary production build", () => {
  expect(facilityProofEnabled(false, false, "?facility-gait-proof=1")).toBe(false);
  expect(facilityProofEnabled(false, true, "")).toBe(false);
  expect(facilityProofEnabled(false, true, "?facility-gait-proof=1")).toBe(true);
  expect(facilityProofEnabled(true, false, "?facility-gait-proof=1")).toBe(true);
});
