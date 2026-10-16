import { describe, expect, it } from "vitest";

import { advanceSeatSettle, SEAT_SETTLE_DURATION_MS, type SeatSettleState } from "./characterSeatSettle";

const TILE = 60;

describe("seat settle", () => {
  it("glides from the walk's end onto the seat with an ease-out, then holds", () => {
    let state: SeatSettleState | undefined = advanceSeatSettle(undefined, { x: 100, y: 200 }, "walk-neutral", 16, TILE).state;
    const first = advanceSeatSettle(state, { x: 100, y: 170 }, "seated", 16, TILE);
    expect(first.point).toEqual({ x: 100, y: 200 });
    state = first.state;
    const ys: number[] = [];
    for (let elapsed = 0; elapsed < SEAT_SETTLE_DURATION_MS + 32; elapsed += 16) {
      const frame = advanceSeatSettle(state, { x: 100, y: 170 }, "seated", 16, TILE);
      state = frame.state;
      ys.push(frame.point.y);
    }
    expect(ys.at(-1)).toBe(170);
    // Monotonic toward the seat, and faster at the start than the end.
    for (let index = 1; index < ys.length; index += 1) expect(ys[index]!).toBeLessThanOrEqual(ys[index - 1]!);
    expect(200 - ys[0]!).toBeGreaterThan(ys.at(-3)! - ys.at(-2)!);
    expect(state?.glide).toBeUndefined();
  });

  it("glides off the seat toward a moving walker when standing up", () => {
    const seated = advanceSeatSettle(undefined, { x: 100, y: 170 }, "seated", 16, TILE).state;
    const up = advanceSeatSettle(seated, { x: 102, y: 200 }, "walk-neutral", 16, TILE);
    expect(up.point).toEqual({ x: 100, y: 170 });
    const next = advanceSeatSettle(up.state, { x: 104, y: 202 }, "walk-neutral", 90, TILE);
    expect(next.point.y).toBeGreaterThan(170);
    expect(next.point.y).toBeLessThan(202);
  });

  it("snaps when nothing jumps, when the pose is unchanged, or when the jump is a relocation", () => {
    const standing = advanceSeatSettle(undefined, { x: 100, y: 200 }, "walk-neutral", 16, TILE).state;
    expect(advanceSeatSettle(standing, { x: 100, y: 200 }, "idle", 16, TILE).point).toEqual({ x: 100, y: 200 });
    expect(advanceSeatSettle(standing, { x: 140, y: 200 }, "walk-neutral", 16, TILE).point).toEqual({ x: 140, y: 200 });
    expect(advanceSeatSettle(standing, { x: 100, y: 200 + TILE * 2 }, "seated", 16, TILE).point).toEqual({ x: 100, y: 320 });
  });
});
