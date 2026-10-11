import { afterEach, describe, expect, it, vi } from "vitest";
import { facilityCameraPreferenceKey, readFacilityCameraPreference, writeFacilityCameraPreference } from "../../session/facilityCameraPreference";
import { createPhoneCameraPreferenceSession, phoneCameraPreferenceKey, readPhoneCameraPreference } from "./cameraPreference";

const desktop = { zoom: 1.1, panX: 10, panY: 20 };
const phone = { zoom: 2, panX: -100, panY: 250 };
function storage() { const values = new Map<string, string>(); return { values, getItem: (key: string) => values.get(key) ?? null,
  setItem: (key: string, value: string) => { values.set(key, value); } }; }
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
describe("independent per-campaign phone camera preferences", () => {
  it("does not inherit or overwrite desktop entries, including switch/reload and encoded campaign IDs", () => {
    const store = storage(); const campaign = "campaign:/% A";
    writeFacilityCameraPreference(campaign, desktop, store);
    const original = store.getItem(facilityCameraPreferenceKey(campaign));
    const preferences = createPhoneCameraPreferenceSession(store);
    expect(readPhoneCameraPreference(campaign, store)).toBeNull();
    expect(preferences.restore(campaign, phone)).toEqual(phone);
    preferences.change(campaign, phone); preferences.change("B", { ...phone, zoom: 0.8 }); preferences.flush();
    expect(store.getItem(facilityCameraPreferenceKey(campaign))).toBe(original);
    expect(readFacilityCameraPreference(campaign, store)).toEqual(desktop);
    const reloaded = createPhoneCameraPreferenceSession(store);
    expect(reloaded.restore(campaign, desktop)).toEqual(phone);
    expect(reloaded.restore("B", desktop).zoom).toBe(0.8);
    expect(phoneCameraPreferenceKey(campaign)).not.toEqual(facilityCameraPreferenceKey(campaign));
    expect([...store.values.keys()]).toHaveLength(3);
  });
  it("reuses debounce and validation and tolerates blocked origin-local storage", () => {
    vi.useFakeTimers(); const store = storage(); const preferences = createPhoneCameraPreferenceSession(store);
    preferences.change("A", phone); preferences.change("A", { ...phone, zoom: 1.5 });
    expect(store.values.size).toBe(0); vi.advanceTimersByTime(250);
    expect(readPhoneCameraPreference("A", store)?.zoom).toBe(1.5);
    expect(preferences.change("A", { ...phone, panX: NaN })).toBe(false);
    store.values.set(phoneCameraPreferenceKey("bad"), "broken"); expect(readPhoneCameraPreference("bad", store)).toBeNull();
    vi.stubGlobal("window", { get localStorage() { throw new Error("blocked"); } });
    expect(readPhoneCameraPreference("A")).toBeNull();
    const unavailable = createPhoneCameraPreferenceSession(); unavailable.change("A", phone); unavailable.flush();
    expect(unavailable.restore("A", desktop)).toEqual(phone);
  });
});
