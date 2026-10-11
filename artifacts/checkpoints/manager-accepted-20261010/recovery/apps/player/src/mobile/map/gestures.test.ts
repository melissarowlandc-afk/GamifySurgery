import { describe, expect, it } from "vitest";
import { MapTouchGestures, MAP_TOUCH_THRESHOLDS } from "./gestures";

const point = (x: number, y = 100) => ({ x, y });
describe("phone map gesture intent", () => {
  it("emits a short, small-movement tap immediately on release, without a timer", () => {
    const gestures = new MapTouchGestures();
    expect(gestures.down(1, point(100), 0)).toEqual([]);
    expect(gestures.move(1, point(107))).toEqual([]);
    expect(gestures.up(1, point(106), 200)).toEqual([{ kind: "tap", point: point(106) }]);
    expect(gestures.activeCount).toBe(0);
  });
  it("pans from the initial contact at the movement threshold, then incrementally", () => {
    const gestures = new MapTouchGestures();
    gestures.down(1, point(100), 0);
    expect(gestures.move(1, point(108))).toEqual([{ kind: "pan", from: point(100), to: point(108) }]);
    expect(gestures.move(1, point(110))).toEqual([{ kind: "pan", from: point(108), to: point(110) }]);
    gestures.move(1, point(100));
    expect(gestures.up(1, point(100), 100).filter(intent => intent.kind === "tap")).toEqual([]); // Returning to the start is still a drag.
  });
  it("checks release movement even when the browser omitted a move event", () => {
    const gestures = new MapTouchGestures(); gestures.down(1, point(100), 0);
    expect(gestures.up(1, point(120), 100)).toEqual([{ kind: "pan", from: point(100), to: point(120) }]);
  });
  it("copies Phaser's mutable prototype coordinate getters into stable CSS points", () => {
    class PhaserPoint {
      position = { x: 100, y: 100 };
      get x() { return this.position.x; }
      get y() { return this.position.y; }
    }
    const pointer = new PhaserPoint(); const gestures = new MapTouchGestures();
    gestures.down(1, pointer, 0); pointer.position.x = 120;
    expect(gestures.move(1, pointer)).toEqual([{ kind: "pan", from: point(100), to: point(120) }]);
    expect(gestures.up(1, pointer, 100).filter(intent => intent.kind === "tap")).toEqual([]);
    gestures.down(1, pointer, 2000); const released = gestures.up(1, pointer, 2050); pointer.position.x = 200;
    expect(released).toEqual([{ kind: "tap", point: point(120) }]);
  });
  it("does not select a long press; includes the tap-duration boundary", () => {
    const gestures = new MapTouchGestures(); gestures.down(1, point(100), 0);
    expect(gestures.up(1, point(100), MAP_TOUCH_THRESHOLDS.tapDuration + 1)).toEqual([]);
    gestures.down(1, point(100), 2000);
    expect(gestures.up(1, point(100), 2250)).toEqual([{ kind: "tap", point: point(100) }]);
  });
  it("treats rapid nearby taps as two immediate taps with no zoom intent", () => {
    const gestures = new MapTouchGestures(); gestures.down(1, point(100), 0);
    expect(gestures.up(1, point(100), 80)).toEqual([{ kind: "tap", point: point(100) }]);
    expect(gestures.down(1, point(120), 200)).toEqual([]);
    expect(gestures.up(1, point(121), 410)).toEqual([{ kind: "tap", point: point(121) }]);
  });
  it.each([{ time: 500, x: 100 }, { time: 200, x: 123 }])("keeps distant or late taps separate ($time, $x)", ({ time, x }) => {
    const gestures = new MapTouchGestures(); gestures.down(1, point(100), 0);
    expect(gestures.up(1, point(100), 50)).toEqual([{ kind: "tap", point: point(100) }]);
    expect(gestures.down(1, point(x), time)).toEqual([]);
    expect(gestures.up(1, point(x), time + 50)).toEqual([{ kind: "tap", point: point(x) }]);
  });
  it("pinches around the midpoint and includes midpoint panning", () => {
    const gestures = new MapTouchGestures(); gestures.down(1, point(100), 0); gestures.down(2, point(200), 10);
    expect(gestures.move(2, point(240, 120))).toEqual([{ kind: "pinch", from: point(150), to: point(170, 110), scale: Math.hypot(140, 20) / 100 }]);
    expect(gestures.hadMultipleTouches).toBe(true);
    expect(gestures.up(2, point(240, 120), 100).filter(intent => intent.kind === "tap")).toEqual([]); gestures.move(1, point(140));
    expect(gestures.up(1, point(140), 150)).toEqual([]);
    expect(gestures.activeCount).toBe(0);
  });
  it("handles zero-distance pinch, cancels active contacts and ignores orphan events", () => {
    const gestures = new MapTouchGestures(); gestures.down(1, point(100), 0); gestures.up(1, point(100), 50);
    gestures.down(1, point(100), 150); gestures.down(2, point(100), 160);
    expect(gestures.move(2, point(120))[0]).toMatchObject({ kind: "pinch", scale: 1 });
    gestures.cancel(); expect(gestures.activeCount).toBe(0);
    expect(gestures.move(2, point(200))).toEqual([]); expect(gestures.up(2, point(200), 200)).toEqual([]);
  });
});
