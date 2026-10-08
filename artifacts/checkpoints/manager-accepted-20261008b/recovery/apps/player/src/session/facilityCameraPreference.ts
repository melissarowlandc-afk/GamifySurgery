import type { FacilityCameraView } from "../facility/types";
import { isValidFacilityCamera } from "../facility/facilityCameraBounds";

export const FACILITY_CAMERA_PREFERENCE_KEY = "gamify-surgery.prototype.facility-camera.v1";
export const FACILITY_CAMERA_SAVE_DEBOUNCE_MS = 250;
const SCHEMA_VERSION = 1;

type CameraStorage = Pick<Storage, "getItem" | "setItem">;

function browserStorage(): CameraStorage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function facilityCameraPreferenceKey(campaignId: string): string {
  return `${FACILITY_CAMERA_PREFERENCE_KEY}:${encodeURIComponent(campaignId)}`;
}

function copyCamera(camera: FacilityCameraView): FacilityCameraView {
  return { zoom: camera.zoom, panX: camera.panX, panY: camera.panY };
}

export function readFacilityCameraPreference(
  campaignId: string,
  storage: CameraStorage | null = browserStorage(),
): FacilityCameraView | null {
  if (!storage) return null;
  try {
    const serialized = storage.getItem(facilityCameraPreferenceKey(campaignId));
    if (serialized === null) return null;
    const stored: unknown = JSON.parse(serialized);
    if (typeof stored !== "object" || stored === null || Array.isArray(stored)) return null;
    const preference = stored as { schemaVersion?: unknown; camera?: unknown };
    return preference.schemaVersion === SCHEMA_VERSION && isValidFacilityCamera(preference.camera)
      ? copyCamera(preference.camera) : null;
  } catch {
    return null;
  }
}

export function writeFacilityCameraPreference(
  campaignId: string,
  camera: FacilityCameraView,
  storage: CameraStorage | null = browserStorage(),
): boolean {
  if (!storage || !isValidFacilityCamera(camera)) return false;
  try {
    storage.setItem(facilityCameraPreferenceKey(campaignId), JSON.stringify({
      schemaVersion: SCHEMA_VERSION,
      camera: copyCamera(camera),
    }));
    return true;
  } catch {
    // Match other presentation preferences: optional storage must not stop play.
    return false;
  }
}

export interface FacilityCameraPreferenceSession {
  restore: (campaignId: string, fallback: FacilityCameraView) => FacilityCameraView;
  change: (campaignId: string, camera: FacilityCameraView) => boolean;
  flush: () => void;
  discard: () => void;
}

/** Small origin-local presentation entries; never serialize or revise game/FSRS data. */
export function createFacilityCameraPreferenceSession(
  storage: CameraStorage | null = browserStorage(),
): FacilityCameraPreferenceSession {
  const cameras = new Map<string, FacilityCameraView>();
  const pending = new Map<string, FacilityCameraView>();
  let timer: ReturnType<typeof setTimeout> | null = null;
  const cancel = () => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
  };
  const flush = () => {
    cancel();
    for (const [campaignId, camera] of pending) {
      if (writeFacilityCameraPreference(campaignId, camera, storage)) pending.delete(campaignId);
    }
  };
  return {
    restore: (campaignId, fallback) => {
      // Flush the outgoing clinic even when switching before the debounce fires.
      flush();
      const saved = cameras.get(campaignId) ?? readFacilityCameraPreference(campaignId, storage);
      if (saved) cameras.set(campaignId, saved);
      return copyCamera(saved ?? fallback);
    },
    change: (campaignId, camera) => {
      if (!isValidFacilityCamera(camera)) return false;
      const copy = copyCamera(camera);
      cameras.set(campaignId, copy);
      pending.set(campaignId, copy);
      cancel();
      timer = setTimeout(flush, FACILITY_CAMERA_SAVE_DEBOUNCE_MS);
      return true;
    },
    flush,
    discard: () => {
      cancel();
      pending.clear();
      cameras.clear();
    },
  };
}

/** No unload prompt: flush synchronously before a refresh/navigation discards the page. */
export function bindFacilityCameraPreferenceLifecycle(
  preferences: FacilityCameraPreferenceSession,
  page: EventTarget,
  visibility: EventTarget & { readonly visibilityState: string },
): () => void {
  const flush = () => preferences.flush();
  const onVisibilityChange = () => {
    if (visibility.visibilityState === "hidden") flush();
  };
  page.addEventListener("pagehide", flush);
  page.addEventListener("beforeunload", flush);
  visibility.addEventListener("visibilitychange", onVisibilityChange);
  return () => {
    page.removeEventListener("pagehide", flush);
    page.removeEventListener("beforeunload", flush);
    visibility.removeEventListener("visibilitychange", onVisibilityChange);
    flush();
  };
}
