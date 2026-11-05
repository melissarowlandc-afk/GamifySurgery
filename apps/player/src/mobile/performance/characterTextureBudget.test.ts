import { expect, it } from "vitest";
import { CharacterTextureBudget } from "./characterTextureBudget";

it("bounds decoded memory across the 1,054-still catalogue while keeping every live pose", () => {
  const budget = new CharacterTextureBudget(), textures = new Set<string>(), pinned = new Set(["founder", "nurse"]);
  for (const key of pinned) { textures.add(key); budget.register(key, 160, 320); }
  const bytesPerStill = 160 * 320 * 4;
  for (let i = 0; i < 1054; i++) {
    const key = `patient.${i}`; textures.add(key); budget.register(key, 160, 320);
    budget.touch("founder"); budget.trim(pinned, key => { textures.delete(key); });
    expect(textures.has("founder") && textures.has("nurse")).toBe(true);
    expect(budget.retainedBytes).toBeLessThanOrEqual(24 * 1024 * 1024);
    expect(budget.size).toBeLessThanOrEqual(96);
  }
  expect(textures.size).toBe(96); expect(budget.retainedBytes).toBe(96 * bytesPerStill);
  // An evicted identity can be loaded again; there is no permanent failure bit.
  expect(textures.has("patient.0")).toBe(false);
  textures.add("patient.0"); budget.register("patient.0", 160, 320);
  budget.trim(new Set([...pinned, "patient.0"]), key => { textures.delete(key); });
  expect(textures.has("patient.0")).toBe(true);
});

it("pins the complete live/in-flight working set even above budget, then releases it after departure", () => {
  const budget = new CharacterTextureBudget(100, 2), remove: string[] = [];
  for (const key of ["live", "loading", "fallback"]) budget.register(key, 10, 10);
  budget.trim(new Set(["live", "loading", "fallback"]), key => remove.push(key));
  expect(remove).toEqual([]); expect(budget.retainedBytes).toBe(1200);
  budget.trim(new Set(["live"]), key => remove.push(key));
  expect(remove).toEqual(["loading", "fallback"]); expect(budget.retainedBytes).toBe(400);
});

it("keeps a live identity's other walk/idle poses warm instead of repeatedly decoding them", () => {
  const budget = new CharacterTextureBudget(100, 1), removed: string[] = [];
  for (const pose of ["idle", "walk-a", "walk-b"]) { budget.register(pose, 10, 10); budget.touch(pose, "patient.live"); }
  budget.trim(new Set(["walk-a"]), key => removed.push(key), new Set(["patient.live"]));
  expect(removed).toEqual([]);
  budget.trim(new Set(), key => removed.push(key), new Set());
  expect(removed).toEqual(["idle", "walk-a", "walk-b"]);
});
