import { ContinuousLoading, LOADING_SURFACE_ID } from "./ui/ContinuousLoading";
import { CLINIC_PRESENTATION_EVENT } from "./ui/clinicPresentation";
import { act } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { IDBFactory, IDBKeyRange } from "fake-indexeddb";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { AuthenticatedPrototype } from "./App";
import * as catalogue from "./mobile/performance/runtimeCatalogue";
import * as storage from "./session/prototypeStorage";
import * as recovery from "./session/localProfileJournal";
import { deferred } from "./session/cloud/syncTestSupport";
import { allElements, cleanupPhoneTests, phoneTestDom } from "./mobile/screenTestUtils";

vi.mock("./ui/TutorialCoach", () => ({ TutorialCoach: () => null }));
vi.mock("./facility", () => ({ FacilityCanvas: () => <div data-testid="facility-canvas" data-clinic-frame="waiting">Fixture map</div> }));
vi.mock("./mobile/map/MobileFacilityMap", () => ({ MobileFacilityMap: () => <div data-testid="facility-canvas" data-clinic-frame="waiting">Fixture map</div> }));
afterEach(async () => { vi.restoreAllMocks(); await cleanupPhoneTests(); });
function fixture() {
  const env = phoneTestDom(), values = new Map<string, string>();
  Object.assign(env.browser, { localStorage: { getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value), removeItem: (key: string) => values.delete(key) } });
  Object.assign(env.browser, { setInterval: () => 1, clearInterval: vi.fn() });
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
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

it.each(["phone", "desktop"])("automatically restores the clear local clinic behind one screen until its %s art-ready frame", async layout => {
  const f = fixture(), warm = deferred(), recovered = deferred();
  Object.assign(f.env.browser.location, { search: `?layout=${layout}` });
  vi.stubGlobal("indexedDB", new IDBFactory()); vi.stubGlobal("IDBKeyRange", IDBKeyRange);
  vi.spyOn(catalogue, "ensureRuntimeCatalogue").mockImplementation(() => warm.promise);
  const journal = vi.spyOn(recovery, "recoverLocalProfile").mockImplementation(async profile => { await recovered.promise; return profile; });
  await f.env.render(<ContinuousLoading><AuthenticatedPrototype /></ContinuousLoading>);
  const surface = f.env.doc.getElementById(LOADING_SURFACE_ID)!;
  expect(surface.attributes.hidden).toBeUndefined();
  await vi.waitFor(() => expect(journal).toHaveBeenCalledOnce());
  await act(async () => recovered.resolve()); expect(surface.attributes.hidden).toBeUndefined();
  await act(async () => warm.resolve());
  await vi.waitFor(async () => { await act(async () => {}); expect(allElements(f.env.element, node => node.attributes["data-testid"] === "facility-canvas")).toHaveLength(1); });
  expect(surface.attributes.hidden).toBeUndefined();
  const host = allElements(f.env.element, node => node.attributes["data-testid"] === "facility-canvas")[0]!;
  Object.assign(f.env.doc, { querySelector: (selector: string) => selector.includes("facility-canvas") ? host : null });
  await act(async () => { host.setAttribute("data-clinic-frame", "ready"); f.env.doc.dispatchEvent(new Event(CLINIC_PRESENTATION_EVENT)); });
  await vi.waitFor(async () => { await act(async () => {}); expect(surface.attributes.hidden).toBe(""); });
  expect(f.env.doc.getElementById(LOADING_SURFACE_ID)).toBe(surface);
  expect(allElements(f.env.element, node => node.tagName === "H1" && node.textContent === "Your campaigns")).toHaveLength(0);
});
