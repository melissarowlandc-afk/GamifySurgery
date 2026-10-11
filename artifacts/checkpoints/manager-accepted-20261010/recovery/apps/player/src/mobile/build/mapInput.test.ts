import { describe, expect, it, vi } from "vitest";
import { PhoneBuildMapInput } from "./mapInput";
import type { MobileBuildMapState } from "./types";

function harness(hallway = false) {
  const state: MobileBuildMapState = { ghost: hallway ? null : { x: 3, y: 4, valid: true, reason: null, cost: 100 },
    initialGhost: null, hallway: hallway ? { cells: [], buildCells: [], cost: 0, reason: null } : null,
    doors: [], selectedDoorId: null, onIntent: vi.fn() };
  const input = new PhoneBuildMapInput(() => state, () => ({ originX: 10, originY: 10, tileSize: 20 }), () => ({ width: 3, height: 2 }));
  return { state, input };
}
describe("deliberate phone construction input emits previews only", () => {
  it("keeps the finger's grab offset and snaps an immutable ghost drag to grid cells", () => {
    const { input, state } = harness();
    const finger = { x: 90, y: 100 };
    input.down(1, finger, 0); finger.x = 115; input.move(1, finger);
    expect(state.onIntent).toHaveBeenLastCalledWith({ kind: "ghost", point: { x: 4, y: 4 } });
    finger.x = 130; input.up(1, finger, 100);
    expect(state.onIntent).toHaveBeenLastCalledWith({ kind: "ghost", point: { x: 5, y: 4 } });
    expect(input.ownsDrag).toBe(false);
  });
  it("a second-finger interruption restores the original ghost and never turns the remaining finger into a drag", () => {
    const { input, state } = harness(); input.down(1, { x: 90, y: 100 }, 0);
    input.move(1, { x: 130, y: 100 }); input.cancel();
    expect(state.onIntent).toHaveBeenLastCalledWith({ kind: "ghost", point: { x: 3, y: 4 } });
    input.move(1, { x: 160, y: 100 }); expect(input.up(1, { x: 160, y: 100 }, 200)).toBe(false);
  });
  it("rasterizes one-finger hallway preview, never saves/places, and restores the prior preview on cancel", () => {
    const { input, state } = harness(true);
    input.down(1, { x: 40, y: 40 }, 0); input.move(1, { x: 100, y: 80 });
    const last = vi.mocked(state.onIntent).mock.calls.at(-1)![0];
    expect(last.kind).toBe("hallway");
    if (last.kind !== "hallway") throw new Error("Expected hallway preview");
    last.cells.slice(1).forEach((cell, index) => expect(Math.abs(cell.x - last.cells[index]!.x) + Math.abs(cell.y - last.cells[index]!.y)).toBe(1));
    expect(last.cells[0]).toEqual({ x: 1, y: 1 }); expect(last.cells.at(-1)).toEqual({ x: 4, y: 3 });
    input.cancel(); expect(state.onIntent).toHaveBeenLastCalledWith({ kind: "hallway", cells: [] });
  });
  it("allows pan outside the ghost and selects only short, stationary taps", () => {
    const { input } = harness(); input.down(1, { x: 250, y: 300 }, 0);
    expect(input.ownsDrag).toBe(false); expect(input.up(1, { x: 250, y: 300 }, 100)).toBe(true);
    input.down(1, { x: 250, y: 300 }, 200); expect(input.up(1, { x: 270, y: 300 }, 300)).toBe(false);
    input.down(1, { x: 250, y: 300 }, 400); expect(input.up(1, { x: 250, y: 300 }, 700)).toBe(false);
  });
  it("ignores off-site hallway samples and reconnects from the last valid tile just like desktop", () => {
    const { state } = harness(true);
    const input = new PhoneBuildMapInput(() => state, () => ({ originX: 0, originY: 0, tileSize: 20, columns: 8, rows: 6 }), () => null);
    input.down(1, { x: -10, y: 30 }, 0); expect(state.onIntent).not.toHaveBeenCalled();
    input.move(1, { x: 30, y: 30 }); input.move(1, { x: 210, y: 30 }); input.move(1, { x: -30, y: -30 });
    expect(state.onIntent).toHaveBeenCalledTimes(1);
    input.up(1, { x: 70, y: 30 }, 150);
    expect(state.onIntent).toHaveBeenLastCalledWith({ kind: "hallway", cells: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }] });
  });
});
