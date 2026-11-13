import { act } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { IDBFactory, IDBKeyRange } from "fake-indexeddb";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { AuthenticatedPrototype } from "./App";
import * as catalogue from "./mobile/performance/runtimeCatalogue";
import * as storage from "./session/prototypeStorage";
import * as recovery from "./session/localProfileJournal";
import { deferred } from "./session/cloud/syncTestSupport";
import { cleanupPhoneTests, phoneTestDom } from "./mobile/screenTestUtils";

vi.mock("./facility", () => ({ FacilityCanvas: () => <div>Fixture map</div> }));
vi.mock("./mobile/map/MobileFacilityMap", () => ({ MobileFacilityMap: () => <div>Fixture map</div> }));
afterEach(async () => { vi.restoreAllMocks(); await cleanupPhoneTests(); });
function fixture() {
  const env = phoneTestDom(), values = new Map<string, string>();
  Object.assign(env.browser, { localStorage: { getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value), removeItem: (key: string) => values.delete(key) } });
  const state = createInitialGameState(), created = storage.appendLocalCampaign(storage.createFreshProfile(), state.founder, "Public reload", 0);
  expect(storage.savePrototypeProfileResult(created.profile).ok).toBe(true);
  vi.spyOn(catalogue, "runtimeCatalogueStatus").mockReturnValue({ indexed: true, decodedCases: 0, bankBytes: 0 });
  return { env, values, profile: storage.loadPrototypeProfile() };
}
it("shows the recovered chooser before catalogue readiness and admits no local action early", async () => {
  const f = fixture(), warm = deferred(), recovered = deferred();
  vi.stubGlobal("indexedDB", new IDBFactory()); vi.stubGlobal("IDBKeyRange", IDBKeyRange);
  const bank = vi.spyOn(catalogue, "ensureRuntimeCatalogue").mockImplementation(() => warm.promise);
  const journal = vi.spyOn(recovery, "recoverLocalProfile").mockImplementation(async profile => { await recovered.promise;
    return { ...profile, campaigns: profile.campaigns.map(row => ({ ...row, name: "Recovered clinic" })) }; });
  const before = f.values.get(storage.PROTOTYPE_PROFILE_KEY);
  await f.env.render(<AuthenticatedPrototype />);
  expect(f.env.button("Resume Public reload").attributes.disabled).not.toBeUndefined();
  expect(f.env.button("New Campaign").attributes.disabled).not.toBeUndefined();
  expect(f.values.get(storage.PROTOTYPE_PROFILE_KEY)).toBe(before);
  await vi.waitFor(() => expect(bank).toHaveBeenCalledTimes(1));
  await vi.waitFor(() => expect(journal).toHaveBeenCalledTimes(1));
  await act(async () => recovered.resolve());
  await vi.waitFor(() => expect(f.env.button("Resume Recovered clinic").attributes.disabled).not.toBeUndefined());
  expect(f.env.doc.body.textContent).toContain("Getting ready to resume");
  expect(f.values.get(storage.PROTOTYPE_PROFILE_KEY)).toBe(before);
  await act(async () => warm.resolve());
  await vi.waitFor(() => expect(f.env.button("Resume Recovered clinic").attributes.disabled).toBeUndefined());
  expect(f.values.get(storage.PROTOTYPE_PROFILE_KEY)).toBe(before);
});
it("waits for missing legacy catalogue fields without replacing the original save", async () => {
  const f = fixture(), warm = deferred(); let ready = false;
  vi.stubGlobal("indexedDB", undefined);
  vi.spyOn(catalogue, "ensureRuntimeCatalogue").mockImplementation(async () => { await warm.promise; ready = true; });
  vi.spyOn(storage, "loadPrototypeProfile").mockImplementation(() => { if (!ready) throw new catalogue.RuntimeCatalogueRequired(0); return f.profile; });
  const before = f.values.get(storage.PROTOTYPE_PROFILE_KEY);
  await f.env.render(<AuthenticatedPrototype />);
  await vi.waitFor(() => expect(f.env.doc.body.textContent).toContain("Opening your device save"), { timeout: 2_000 });
  expect(f.values.get(storage.PROTOTYPE_PROFILE_KEY)).toBe(before);
  await act(async () => warm.resolve());
  await vi.waitFor(() => expect(f.env.button("Resume Public reload").attributes.disabled).toBeUndefined());
  expect(f.values.get(storage.PROTOTYPE_PROFILE_KEY)).toBe(before);
});
