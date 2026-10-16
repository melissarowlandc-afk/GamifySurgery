import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ClinicMapPins } from "./ClinicMapPins";
import type { FacilityAlertPinView } from "./types";

describe("live map pin actions", () => {
  it("labels a pin with its card action and forwards exactly that card ID", () => {
    const onAction = vi.fn();
    const pin: FacilityAlertPinView = { id: "need.patient.Pat", title: "Pat may walk out", actionLabel: "Open chart", target: { kind: "patient", id: "Pat" } };
    const tree = ClinicMapPins({ pins: [pin], positions: [{ id: pin.id, x: 120, y: 90 }], onAction });
    const buttons = tree.props.children;
    expect(buttons).toHaveLength(1);
    buttons[0].props.onClick({ stopPropagation: vi.fn() });
    expect(onAction).toHaveBeenCalledExactlyOnceWith(pin.id);
    const html = renderToStaticMarkup(tree);
    expect(html).toContain('aria-label="Pat may walk out: Open chart"');
    expect(html).toContain("left:120px;top:90px");
  });
  it("does not retain resolved or absent cards at stale render positions", () => {
    const html = renderToStaticMarkup(<ClinicMapPins pins={[]} positions={[{ id: "removed", x: 20, y: 20 }]} onAction={vi.fn()} />);
    expect(html).not.toContain("<button");
  });
});
