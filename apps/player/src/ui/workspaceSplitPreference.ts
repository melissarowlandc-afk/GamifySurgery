export const WORKSPACE_SPLIT_PREFERENCE_KEY = "gamify-surgery.ui.workspace-split.v1";
export const DEFAULT_WORKSPACE_MAP_SHARE = 0.44;
export const MINIMUM_MAP_HEIGHT = 220;
export const MINIMUM_DESK_HEIGHT = 190;
export const WORKSPACE_DIVIDER_HEIGHT = 18;
export const MINIMUM_WORKSPACE_MAP_SHARE = 0.2;
export const MAXIMUM_WORKSPACE_MAP_SHARE = 0.8;

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function getWorkspaceStorage(): StorageLike | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

export function clampWorkspaceMapShare(
  requestedShare: number,
  workspaceHeight: number,
): number {
  const usableHeight = Math.max(
    1,
    workspaceHeight - WORKSPACE_DIVIDER_HEIGHT,
  );
  const minimumShare = MINIMUM_MAP_HEIGHT / usableHeight;
  const maximumShare = 1 - MINIMUM_DESK_HEIGHT / usableHeight;
  if (minimumShare <= maximumShare) {
    return clamp(requestedShare, minimumShare, maximumShare);
  }
  return clamp(
    requestedShare,
    MINIMUM_WORKSPACE_MAP_SHARE,
    MAXIMUM_WORKSPACE_MAP_SHARE,
  );
}

export function workspaceMapShareFromPointer(
  clientY: number,
  workspaceTop: number,
  workspaceHeight: number,
): number {
  const usableHeight = Math.max(
    1,
    workspaceHeight - WORKSPACE_DIVIDER_HEIGHT,
  );
  return clampWorkspaceMapShare(
    (clientY - workspaceTop - WORKSPACE_DIVIDER_HEIGHT / 2) / usableHeight,
    workspaceHeight,
  );
}

export function readWorkspaceMapShare(
  storage: StorageLike | null | undefined,
): number {
  if (!storage) {
    return DEFAULT_WORKSPACE_MAP_SHARE;
  }
  try {
    const stored = Number(storage.getItem(WORKSPACE_SPLIT_PREFERENCE_KEY));
    return Number.isFinite(stored) &&
      stored >= MINIMUM_WORKSPACE_MAP_SHARE &&
      stored <= MAXIMUM_WORKSPACE_MAP_SHARE
      ? stored
      : DEFAULT_WORKSPACE_MAP_SHARE;
  } catch {
    return DEFAULT_WORKSPACE_MAP_SHARE;
  }
}

export function writeWorkspaceMapShare(
  storage: StorageLike | null | undefined,
  share: number,
): void {
  if (!storage || !Number.isFinite(share)) {
    return;
  }
  try {
    storage.setItem(WORKSPACE_SPLIT_PREFERENCE_KEY, String(share));
  } catch {
    // Storage is optional UI polish.
  }
}
