import { describe, expect, it } from "vitest";
import {
  DEFAULT_WORKSPACE_MAP_SHARE,
  WORKSPACE_SPLIT_PREFERENCE_KEY,
  clampWorkspaceMapShare,
  readWorkspaceMapShare,
  workspaceMapShareFromPointer,
  writeWorkspaceMapShare,
} from "./workspaceSplitPreference";

describe("workspace splitter", () => {
  it("clamps against the map and desk minimums when the workspace can fit them", () => {
    expect(clampWorkspaceMapShare(0.05, 700)).toBeCloseTo(220 / 682);
    expect(clampWorkspaceMapShare(0.95, 700)).toBeCloseTo(1 - 190 / 682);
  });

  it("keeps compact workspaces proportional and derives a pointer share", () => {
    expect(clampWorkspaceMapShare(0.05, 350)).toBe(0.2);
    expect(workspaceMapShareFromPointer(450, 100, 700)).toBeCloseTo(0.5);
  });

  it("uses a guarded versioned storage preference", () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    };
    writeWorkspaceMapShare(storage, 0.53);
    expect(values.get(WORKSPACE_SPLIT_PREFERENCE_KEY)).toBe("0.53");
    expect(readWorkspaceMapShare(storage)).toBe(0.53);
    values.set(WORKSPACE_SPLIT_PREFERENCE_KEY, "not-a-share");
    expect(readWorkspaceMapShare(storage)).toBe(DEFAULT_WORKSPACE_MAP_SHARE);
    values.set(WORKSPACE_SPLIT_PREFERENCE_KEY, "0.9");
    expect(readWorkspaceMapShare(storage)).toBe(DEFAULT_WORKSPACE_MAP_SHARE);
  });

  it("falls back when storage is unavailable or throws", () => {
    expect(readWorkspaceMapShare(null)).toBe(DEFAULT_WORKSPACE_MAP_SHARE);
    expect(
      readWorkspaceMapShare({
        getItem: () => {
          throw new Error("blocked");
        },
        setItem: () => {},
      }),
    ).toBe(DEFAULT_WORKSPACE_MAP_SHARE);
    expect(() =>
      writeWorkspaceMapShare(
        {
          getItem: () => null,
          setItem: () => {
            throw new Error("blocked");
          },
        },
        0.5,
      ),
    ).not.toThrow();
  });
});
