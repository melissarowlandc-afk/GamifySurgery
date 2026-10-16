import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { serializeGameState, type FounderIdentity } from "@gamify-surgery/game-domain";
import { getInitialFacilityCamera } from "../facility/defaultCamera";
import {
  appendLocalCampaign, createFreshProfile, PROTOTYPE_PROFILE_KEY, savePrototypeProfile,
} from "./prototypeStorage";
import {
  bindFacilityCameraPreferenceLifecycle,
  createFacilityCameraPreferenceSession,
  FACILITY_CAMERA_SAVE_DEBOUNCE_MS,
  facilityCameraPreferenceKey,
  readFacilityCameraPreference,
  writeFacilityCameraPreference,
} from "./facilityCameraPreference";

const defaultCamera = { zoom: 1.1, panX: 0, panY: 0 };
const cameraA = { zoom: 1.7, panX: -172.25, panY: 281.5 };
const cameraB = { zoom: 0.6, panX: 82, panY: -52 };

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    values,
    getItem: (key: string) => values.get(key) ?? null,
    setItem: vi.fn((key: string, value: string) => { values.set(key, value); }),
  };
}

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("per-campaign facility camera preferences", () => {
  it("round-trips both clinics through a new session without changing game or FSRS bytes", () => {
    const storage = memoryStorage();
    vi.stubGlobal("window", { localStorage: storage });
    const founder = { displayName: "Avery", headId: "head.test", bodyId: "body.test",
      appearance: { version: "pixel-avatar.v1", bodyShape: "broad", hairStyle: "parted",
        hairShade: 3, faceStyle: "square", outfitStyle: "checked", outfitShade: 2,
        accessory: "none" } } as FounderIdentity;
    const first = appendLocalCampaign(createFreshProfile(), founder, "Camera A", 123);
    const second = appendLocalCampaign(first.profile, founder, "Camera B", 456);
    expect(savePrototypeProfile(second.profile)).toBe(true);
    const profileBytes = storage.getItem(PROTOTYPE_PROFILE_KEY);
    const gameBytes = second.profile.campaigns.map((campaign) => serializeGameState(campaign.state));
    const preferences = createFacilityCameraPreferenceSession();
    preferences.change(first.campaign.campaignId, cameraA);
    preferences.change(second.campaign.campaignId, cameraB);
    vi.advanceTimersByTime(FACILITY_CAMERA_SAVE_DEBOUNCE_MS);

    const reloaded = createFacilityCameraPreferenceSession();
    expect(reloaded.restore(first.campaign.campaignId, defaultCamera)).toEqual(cameraA);
    expect(reloaded.restore(second.campaign.campaignId, defaultCamera)).toEqual(cameraB);
    expect(storage.getItem(PROTOTYPE_PROFILE_KEY)).toBe(profileBytes);
    expect(second.profile.campaigns.map((campaign) => serializeGameState(campaign.state))).toEqual(gameBytes);
  });

  it("debounces rapid gesture/control changes and writes only the latest camera", () => {
    const storage = memoryStorage();
    const preferences = createFacilityCameraPreferenceSession(storage);
    preferences.change("A", cameraA);
    vi.advanceTimersByTime(FACILITY_CAMERA_SAVE_DEBOUNCE_MS - 1);
    preferences.change("A", cameraB);
    vi.advanceTimersByTime(FACILITY_CAMERA_SAVE_DEBOUNCE_MS - 1);
    expect(storage.setItem).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(readFacilityCameraPreference("A", storage)).toEqual(cameraB);
  });

  it("flushes the outgoing clinic before switching and restores each clinic independently", () => {
    const storage = memoryStorage();
    const preferences = createFacilityCameraPreferenceSession(storage);
    expect(preferences.restore("A", defaultCamera)).toEqual(defaultCamera);
    preferences.change("A", cameraA);
    expect(preferences.restore("B", defaultCamera)).toEqual(defaultCamera);
    expect(readFacilityCameraPreference("A", storage)).toEqual(cameraA);
    expect(readFacilityCameraPreference("B", storage)).toBeNull();
    preferences.change("B", cameraB);
    expect(preferences.restore("A", defaultCamera)).toEqual(cameraA);
    expect(readFacilityCameraPreference("B", storage)).toEqual(cameraB);
    expect(preferences.restore("B", defaultCamera)).toEqual(cameraB);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("keeps today's default for missing/legacy camera data, including after facility growth", () => {
    const storage = memoryStorage();
    const preferences = createFacilityCameraPreferenceSession(storage);
    const fresh = getInitialFacilityCamera({ facilityLevel: 0,
      rooms: [{ roomDefinitionId: "room.front_desk" }] } as never);
    const expanded = getInitialFacilityCamera({ facilityLevel: 1, rooms: [] } as never);
    expect(preferences.restore("legacy", fresh)).toEqual({ zoom: 1.1, panX: 0, panY: 0 });
    preferences.restore("other", fresh);
    expect(preferences.restore("legacy", expanded)).toEqual({ zoom: 1, panX: 0, panY: 0 });
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it.each([
    "broken JSON", "null", "[]", "{}",
    '{"schemaVersion":2,"camera":{"zoom":1,"panX":0,"panY":0}}',
    '{"schemaVersion":1,"camera":{"zoom":0,"panX":0,"panY":0}}',
    '{"schemaVersion":1,"camera":{"zoom":-1,"panX":0,"panY":0}}',
    '{"schemaVersion":1,"camera":{"zoom":"1","panX":0,"panY":0}}',
    '{"schemaVersion":1,"camera":{"zoom":1,"panX":null,"panY":0}}',
    '{"schemaVersion":1,"camera":{"zoom":1,"panX":0}}',
    '{"schemaVersion":1,"camera":{"zoom":1e999,"panX":0,"panY":0}}',
    '{"schemaVersion":1,"camera":{"zoom":1,"panX":0,"panY":1e999}}',
  ])("falls back without rewriting malformed stored data: %s", (serialized) => {
    const storage = memoryStorage();
    storage.values.set(facilityCameraPreferenceKey("A"), serialized);
    const preferences = createFacilityCameraPreferenceSession(storage);
    expect(preferences.restore("A", defaultCamera)).toEqual(defaultCamera);
    expect(storage.getItem(facilityCameraPreferenceKey("A"))).toBe(serialized);
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it("rejects invalid changes and saves copies rather than caller-owned camera objects", () => {
    const storage = memoryStorage();
    const preferences = createFacilityCameraPreferenceSession(storage);
    expect(preferences.change("A", { ...cameraA, zoom: NaN })).toBe(false);
    expect(writeFacilityCameraPreference("A", { ...cameraA, panX: Infinity }, storage)).toBe(false);
    const mutable = { ...cameraA };
    preferences.change("A", mutable);
    mutable.panX = 9999;
    preferences.flush();
    const restored = preferences.restore("A", defaultCamera);
    expect(restored).toEqual(cameraA);
    restored.panX = 0;
    expect(preferences.restore("A", defaultCamera)).toEqual(cameraA);
  });

  it("uses isolated origin-local stores and unambiguous campaign keys", () => {
    const localOrigin = memoryStorage();
    const otherOrigin = memoryStorage();
    writeFacilityCameraPreference("campaign.local.A:/%", cameraA, localOrigin);
    expect(readFacilityCameraPreference("campaign.local.A:/%", localOrigin)).toEqual(cameraA);
    expect(readFacilityCameraPreference("campaign.local.A:/%", otherOrigin)).toBeNull();
    expect(readFacilityCameraPreference("campaign.local.A:/", localOrigin)).toBeNull();
  });

  it("continues playing and remembers cameras during the session when storage is blocked", () => {
    vi.stubGlobal("window", { get localStorage() { throw new Error("blocked"); } });
    expect(readFacilityCameraPreference("A")).toBeNull();
    expect(writeFacilityCameraPreference("A", cameraA)).toBe(false);
    const unavailable = createFacilityCameraPreferenceSession();
    unavailable.change("A", cameraA);
    unavailable.restore("B", defaultCamera);
    expect(unavailable.restore("A", defaultCamera)).toEqual(cameraA);

    const broken = createFacilityCameraPreferenceSession({
      getItem: () => { throw new Error("read blocked"); },
      setItem: () => { throw new Error("quota exceeded"); },
    });
    expect(broken.restore("A", defaultCamera)).toEqual(defaultCamera);
    broken.change("A", cameraA);
    expect(() => broken.flush()).not.toThrow();
    expect(broken.restore("A", defaultCamera)).toEqual(cameraA);
  });

  it.each(["pagehide", "beforeunload", "visibilitychange", "unmount"])(
    "flushes before the debounce on %s and cleans up its listeners/timer", (eventName) => {
      const storage = memoryStorage();
      const preferences = createFacilityCameraPreferenceSession(storage);
      const page = new EventTarget();
      const visibility = Object.assign(new EventTarget(), { visibilityState: "visible" });
      const cleanup = bindFacilityCameraPreferenceLifecycle(preferences, page, visibility);
      preferences.change("A", cameraA);
      if (eventName === "visibilitychange") {
        visibility.dispatchEvent(new Event("visibilitychange"));
        expect(storage.setItem).not.toHaveBeenCalled();
        visibility.visibilityState = "hidden";
        visibility.dispatchEvent(new Event("visibilitychange"));
      } else if (eventName === "unmount") cleanup();
      else page.dispatchEvent(new Event(eventName));
      expect(readFacilityCameraPreference("A", storage)).toEqual(cameraA);
      expect(vi.getTimerCount()).toBe(0);
      cleanup();
      page.dispatchEvent(new Event("pagehide"));
      vi.advanceTimersByTime(FACILITY_CAMERA_SAVE_DEBOUNCE_MS);
      expect(storage.setItem).toHaveBeenCalledTimes(1);
    },
  );

  it("discards a pending camera before campaign reset so exit cannot recreate it", () => {
    const storage = memoryStorage();
    const preferences = createFacilityCameraPreferenceSession(storage);
    preferences.change("A", cameraA);
    preferences.discard();
    preferences.flush();
    vi.advanceTimersByTime(FACILITY_CAMERA_SAVE_DEBOUNCE_MS);
    expect(storage.setItem).not.toHaveBeenCalled();
    expect(preferences.restore("A", defaultCamera)).toEqual(defaultCamera);
  });
});
