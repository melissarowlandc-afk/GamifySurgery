import { describe, expect, it } from "vitest";
import {
  CHARACTER_HOP,
  advanceCharacterHop,
  characterDrawMotion,
  characterHopOffsetTiles,
  characterHopStrideTiles,
  characterMotionSeed,
  type CharacterHopInput,
  type CharacterHopState,
} from "./characterHopMotion";

const TAU = Math.PI * 2;
const walk = (overrides: Partial<CharacterHopInput> = {}): CharacterHopInput => ({
  moving: true, travelledTiles: 0, realMilliseconds: 0, gameMilliseconds: 0,
  tilesPerSecond: 2, seed: 0, travelX: 1, travelY: 0, ...overrides,
});
const stop = (milliseconds = 0): CharacterHopInput =>
  walk({ moving: false, realMilliseconds: milliseconds, gameMilliseconds: milliseconds });
const breathing = { seed: 0, clockMilliseconds: 0 };

/** Walks `tiles` in frames of `step` tiles at 2 tiles per second. */
function walkTiles(state: CharacterHopState | undefined, tiles: number, seed = 0, step = 0.05) {
  let next = advanceCharacterHop(state, walk({ seed }));
  for (let walked = 0; walked < tiles - 1e-9; walked += step) {
    next = advanceCharacterHop(next, walk({ seed, travelledTiles: step, realMilliseconds: step * 500, gameMilliseconds: step * 500 }));
  }
  return next!;
}

describe("approved character hop motion", () => {
  it("keeps the approved values", () => {
    expect(CHARACTER_HOP).toMatchObject({
      liftHeight: 7, plant: 1, squash: 0.03, stretch: 0.025, shadowAlpha: 0.45,
      breathDepth: 0.02, breathPeriodMilliseconds: 3_200, settleMilliseconds: 120,
      sitDropHeight: 6, sitDropMilliseconds: 110, sitSquash: 0.04, sitSquashMilliseconds: 130,
      maxHopsPerSecond: 4,
    });
  });

  it("hops one tile per stride at 1× and 2× and two tiles at 4×", () => {
    expect(characterHopStrideTiles(2)).toBe(1);
    expect(characterHopStrideTiles(4)).toBe(1);
    expect(characterHopStrideTiles(8)).toBe(2);
    expect(characterHopStrideTiles(0)).toBe(1);
    expect(characterHopStrideTiles(Number.NaN)).toBe(1);
  });

  it("gives each character a stable seed and pairs different rhythms", () => {
    const a = characterMotionSeed("character:patient:patient-a");
    const b = characterMotionSeed("character:patient:patient-b");
    expect(a).toBe(characterMotionSeed("character:patient:patient-a"));
    expect(a).not.toBe(b);
    for (const seed of [a, b, characterMotionSeed("")]) {
      expect(seed).toBeGreaterThanOrEqual(0);
      expect(seed).toBeLessThan(1);
    }
    // Two characters setting off together are at different points in their hop.
    const first = walkTiles(undefined, 0.5, 0);
    const second = walkTiles(undefined, 0.5, 0.8);
    expect(characterDrawMotion(first, "walk-a", breathing).lift).not.toBeCloseTo(
      characterDrawMotion(second, "walk-a", breathing).lift,
      3,
    );
  });

  it("starts grounded, peaks at 7 px mid-hop and plants the feet on each tile", () => {
    let state = advanceCharacterHop(undefined, walk());
    expect(characterDrawMotion(state, "walk-a", breathing).lift).toBe(0);
    state = walkTiles(undefined, 0.5);
    expect(characterDrawMotion(state, "walk-a", breathing).lift).toBeCloseTo(7, 6);
    expect(characterHopOffsetTiles(state)).toBeCloseTo(0, 6);
    state = walkTiles(undefined, 0.25);
    expect(characterHopOffsetTiles(state)).toBeCloseTo(1 / TAU, 6);
    for (const tiles of [1, 2, 3]) {
      const landed = walkTiles(undefined, tiles);
      expect(characterDrawMotion(landed, "walk-a", breathing).lift).toBeCloseTo(0, 6);
      expect(characterHopOffsetTiles(landed)).toBeCloseTo(0, 6);
    }
  });

  it("never draws the character moving backward along the route", () => {
    let state = advanceCharacterHop(undefined, walk({ seed: 0.6 }));
    let previousDrawn = 0;
    let logical = 0;
    for (let frame = 0; frame < 200; frame += 1) {
      logical += 0.03;
      state = advanceCharacterHop(state, walk({ seed: 0.6, travelledTiles: 0.03, realMilliseconds: 15, gameMilliseconds: 15 }));
      const drawn = logical - characterHopOffsetTiles(state);
      expect(drawn).toBeGreaterThanOrEqual(previousDrawn - 1e-9);
      expect(Math.abs(characterHopOffsetTiles(state))).toBeLessThanOrEqual(1 / TAU + 1e-9);
      previousDrawn = drawn;
    }
  });

  it("shortens only the first hop by the character seed", () => {
    const state = advanceCharacterHop(undefined, walk({ seed: 0.5 }))!;
    expect(state.firstHopTiles).toBeCloseTo(0.75, 10);
    const afterFirst = walkTiles(undefined, 0.75, 0.5);
    expect(afterFirst.phase).toBeCloseTo(TAU, 6);
    const afterSecond = walkTiles(undefined, 1.75, 0.5);
    expect(afterSecond.phase).toBeCloseTo(2 * TAU, 6);
  });

  it("finishes a hop and waits on the ground when the route stalls", () => {
    let state = walkTiles(undefined, 0.5);
    expect(characterDrawMotion(state, "walk-a", breathing).lift).toBeCloseTo(7, 6);
    for (let frame = 0; frame < 30; frame += 1) {
      state = advanceCharacterHop(state, walk({ realMilliseconds: 16, gameMilliseconds: 16 }))!;
    }
    expect(state.phase).toBeCloseTo(TAU, 10);
    expect(characterDrawMotion(state, "walk-a", breathing).lift).toBeCloseTo(0, 10);
    expect(characterHopOffsetTiles(state)).toBeCloseTo(0, 10);
    // A zero-delta redraw changes nothing.
    expect(advanceCharacterHop(state, walk())!.phase).toBe(state.phase);
  });

  it("squashes on landing, stretches mid-air and ramps the first squash in", () => {
    const start = advanceCharacterHop(undefined, walk())!;
    expect(characterDrawMotion(start, "walk-a", breathing)).toMatchObject({ scaleX: 1, scaleY: 1 });
    const ramped = { ...start, walkMilliseconds: 100 };
    const landing = characterDrawMotion(ramped, "walk-a", breathing);
    expect(landing.scaleY).toBeCloseTo(0.97, 10);
    expect(landing.scaleX).toBeCloseTo(1.0225, 10);
    const rising = characterDrawMotion({ ...ramped, phase: Math.PI / 2 }, "walk-a", breathing);
    expect(rising.scaleY).toBeCloseTo(1.025, 10);
    expect(rising.scaleX).toBeCloseTo(0.9875, 10);
  });

  it("settles a floor stop over 120 ms with a landing squash, then breathes", () => {
    const moving = walkTiles(undefined, 0.25);
    const fromLift = characterDrawMotion(moving, "walk-a", breathing).lift;
    const fromOffset = characterHopOffsetTiles(moving);
    let state = advanceCharacterHop(moving, stop());
    expect(characterDrawMotion(state, "idle", breathing).lift).toBeCloseTo(fromLift, 10);
    expect(characterHopOffsetTiles(state)).toBeCloseTo(fromOffset, 10);
    state = advanceCharacterHop(state, stop(60));
    expect(characterDrawMotion(state, "idle", breathing).lift).toBeCloseTo(fromLift / 2, 10);
    expect(characterHopOffsetTiles(state)).toBeCloseTo(fromOffset / 2, 10);
    expect(characterDrawMotion(state, "idle", breathing).scaleY).toBeLessThan(1);
    state = advanceCharacterHop(state, stop(60));
    expect(characterDrawMotion(state, "idle", breathing).lift).toBe(0);
    expect(characterHopOffsetTiles(state)).toBe(0);
    state = advanceCharacterHop(state, stop(2_000));
    const quarter = { seed: 0, clockMilliseconds: CHARACTER_HOP.breathPeriodMilliseconds * 0.85 / 2 };
    expect(characterDrawMotion(state, "idle", quarter).scaleY).toBeCloseTo(1.02, 10);
  });

  it("drops into a seat or exam table after walking, but not when already seated", () => {
    const moving = walkTiles(undefined, 1);
    let state = advanceCharacterHop(moving, stop());
    expect(characterDrawMotion(state, "seated", breathing).lift).toBe(6);
    state = advanceCharacterHop(state, stop(55));
    expect(characterDrawMotion(state, "exam-table", breathing).lift).toBeCloseTo(4.5, 10);
    state = advanceCharacterHop(state, stop(120));
    const squashed = characterDrawMotion(state, "seated", breathing);
    expect(squashed.lift).toBe(0);
    expect(squashed.scaleY).toBeLessThan(1);
    expect(characterDrawMotion(undefined, "seated", breathing)).toMatchObject({ lift: 0, scaleX: 1, scaleY: 1 });
  });

  it("keeps the shadow on the floor, lighter and smaller at the peak, and hides it on the exam table", () => {
    const grounded = characterDrawMotion(undefined, "idle", breathing);
    expect(grounded).toMatchObject({ shadowAlpha: 0.45, shadowScale: 1 });
    const peak = characterDrawMotion(walkTiles(undefined, 0.5), "walk-a", breathing);
    expect(peak.shadowAlpha).toBeCloseTo(0.27, 6);
    expect(peak.shadowScale).toBeCloseTo(0.8, 6);
    expect(characterDrawMotion(undefined, "exam-table", breathing).shadowAlpha).toBe(0);
  });

  it("breathes out of step: per-character phase and period", () => {
    const at = (seed: number, clockMilliseconds: number) =>
      characterDrawMotion(undefined, "idle", { seed, clockMilliseconds }).scaleY;
    expect(at(0.1, 1_000)).not.toBeCloseTo(at(0.6, 1_000), 4);
    expect(at(0, 0)).toBe(1);
  });
});
