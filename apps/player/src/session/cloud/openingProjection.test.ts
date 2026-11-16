import { afterEach, expect, it, vi } from "vitest";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { cloudOpeningProjection } from "./openingProjection";
import { facilityCameraPreferenceKey } from "../facilityCameraPreference";

afterEach(() => vi.unstubAllGlobals());
it.each([false, true, null])("uses the restored camera without writing or changing the nullable mode (%s)", mode => {
  const state = createInitialGameState(), camera = { zoom: 1.4, panX: 17, panY: -23 };
  const getItem = vi.fn((key: string) => key === facilityCameraPreferenceKey(state.campaignId)
    ? JSON.stringify({ schemaVersion: 1, camera }) : null), setItem = vi.fn();
  vi.stubGlobal("window", { localStorage: { getItem, setItem } });
  const before = JSON.stringify(state), args = cloudOpeningProjection(state, "public.account", mode);
  expect(args).toEqual([state.openChartEncounterId, false, null, false, null, 0, camera, [], mode]);
  expect(setItem).not.toHaveBeenCalled(); expect(JSON.stringify(state)).toBe(before);
});

it("keeps optional unavailable presentation storage outside the save-opening failure path", () => {
  const state = createInitialGameState();
  vi.stubGlobal("window", { get localStorage() { throw new Error("unavailable"); } });
  expect(cloudOpeningProjection(state, "public.account", false)).toEqual(
    [state.openChartEncounterId, false, null, false, null, 0, { zoom: 1.1, panX: 0, panY: 0 }, [], false]);
});
