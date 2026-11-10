import { afterEach, expect, it, vi } from "vitest";
import { beginPhoneCloudOpening, bindPhoneMemoryLifecycle, phoneMemoryProfile, PhoneMemoryGuard, PHONE_LOW_MEMORY_MS, PHONE_MEMORY_KEY, PHONE_RESTART_WINDOW_MS } from "./phoneMemoryPolicy";
import { mobileCanvasSize } from "./presentationPolicy";
import { CharacterTextureBudget } from "./characterTextureBudget";

afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

function fixture() {
  const values = new Map<string, string>([["untouched.save", "exact-original-bytes"]]), writes: string[] = [], codes: string[] = [];
  let now = 100_000;
  const store = { getItem: (key: string) => values.get(key) ?? null, setItem(key: string, value: string) { writes.push(key); values.set(key, value); } };
  return { values, writes, codes, next(ms = 1000) { now += ms; }, guard: () => new PhoneMemoryGuard(store, () => now, code => codes.push(code)) };
}

it("automatically lowers memory before the third opening after two unclean restarts and never writes save keys", () => {
  const f = fixture(); let page = f.guard();
  expect(page.beginOpening().mode).toBe("normal"); page.markPlaying();
  for (let i = 0; i < 100; i++) page.beginOpening(); // Multiple codec tasks are one opening, not100 crashes.
  f.next(); page = f.guard(); expect(page.beginOpening().mode).toBe("normal");
  f.next(); page = f.guard(); expect(page.beginOpening()).toMatchObject({ mode: "reduced", maxDpr: 1, textureCount: 32, keepLiveFamilies: false });
  expect(f.codes).toContain("phone-memory-unclean-restarts");
  expect(f.writes.every(key => key === PHONE_MEMORY_KEY)).toBe(true);
  expect(f.values.get("untouched.save")).toBe("exact-original-bytes");
  expect(f.values.get(PHONE_MEMORY_KEY)!.length).toBeLessThan(300);
  page.clean(); f.next(); expect(f.guard().beginOpening().mode).toBe("reduced"); // Sticky default avoids oscillating back into a loop.
  page.clean(); f.next(PHONE_LOW_MEMORY_MS + 1); expect(f.guard().beginOpening().mode).toBe("normal");
});

it("clears on hidden/pagehide, rearms on visible/pageshow and removes its lifecycle listeners", () => {
  const f = fixture(), page = f.guard(), browser = new EventTarget(), doc = Object.assign(new EventTarget(), { visibilityState: "visible" });
  const cleanup = bindPhoneMemoryLifecycle(page, browser as unknown as Window, doc as unknown as Document);
  page.beginOpening(); page.markPlaying();
  doc.visibilityState = "hidden"; doc.dispatchEvent(new Event("visibilitychange"));
  page.markPlaying(); // A late worker completion while hidden cannot dirty the clean marker.
  expect(JSON.parse(f.values.get(PHONE_MEMORY_KEY)!).active).toBeNull();
  f.next(); expect(f.guard().beginOpening().mode).toBe("normal");
  doc.visibilityState = "visible"; doc.dispatchEvent(new Event("visibilitychange"));
  expect(page.health.phase).toBe("playing");
  browser.dispatchEvent(new Event("pagehide")); expect(page.health.phase).toBe("clean");
  browser.dispatchEvent(new Event("pageshow")); expect(page.health.phase).toBe("playing");
  cleanup(); browser.dispatchEvent(new Event("pagehide")); expect(page.health.phase).toBe("playing");
});

it("expires separated incidents and stale markers, tolerates malformed or unavailable auxiliary storage", () => {
  const f = fixture(); let page = f.guard(); page.beginOpening(); page.markPlaying(); f.next();
  page = f.guard(); page.beginOpening(); page.markPlaying(); f.next(PHONE_RESTART_WINDOW_MS + 1);
  expect(f.guard().beginOpening().mode).toBe("normal");
  f.next(PHONE_LOW_MEMORY_MS + 1); expect(f.guard().beginOpening().mode).toBe("normal");
  for (const raw of ["null", "bad JSON", '{"version":2}', "x".repeat(2000)]) {
    f.values.set(PHONE_MEMORY_KEY, raw); expect(() => f.guard().beginOpening()).not.toThrow();
  }
  const codes: string[] = [], broken = new PhoneMemoryGuard({ getItem() { throw Error("Blocked"); }, setItem() { throw Error("Quota"); } }, Date.now, code => codes.push(code));
  expect(broken.beginOpening().mode).toBe("reduced"); expect(() => broken.clean()).not.toThrow();
  expect(codes).toEqual(["phone-memory-storage-unavailable"]);
});

it("does not start an opening from a late background task after pagehide", () => {
  const f = fixture(), page = f.guard(), browser = new EventTarget(), doc = Object.assign(new EventTarget(), { visibilityState: "visible" });
  const cleanup = bindPhoneMemoryLifecycle(page, browser as unknown as Window, doc as unknown as Document);
  browser.dispatchEvent(new Event("pagehide"));
  page.beginOpening(); page.markPlaying();
  expect(f.writes).toEqual([]);
  browser.dispatchEvent(new Event("pageshow"));
  page.beginOpening();
  expect(page.health.phase).toBe("opening");
  expect(f.writes).toEqual([PHONE_MEMORY_KEY]);
  cleanup();
});

it("wires the automatic opening decision into the actual canvas and character defaults before rendering", () => {
  const f = fixture(); let now = 100_000; vi.spyOn(Date, "now").mockImplementation(() => now);
  const storage = { getItem: (key: string) => f.values.get(key) ?? null, setItem: (key: string, value: string) => { f.values.set(key, value); } };
  const loadPage = () => {
    vi.stubGlobal("window", Object.assign(new EventTarget(), { localStorage: storage, innerWidth: 390, location: { search: "" }, matchMedia: () => ({ matches: true }) }));
    vi.stubGlobal("document", Object.assign(new EventTarget(), { visibilityState: "visible" }));
    beginPhoneCloudOpening(); now += 1000;
  };
  loadPage(); loadPage(); loadPage();
  expect(phoneMemoryProfile().mode).toBe("reduced");
  expect(mobileCanvasSize(390, 844, 3)).toMatchObject({ backingWidth: 390, backingHeight: 844 });
  const textures = new CharacterTextureBudget();
  for (let i = 0; i < 300; i++) { textures.register(`old.${i}`, 160, 320); textures.trim(new Set(), () => {}); }
  expect(textures.size).toBe(32);
  expect(f.values.get("untouched.save")).toBe("exact-original-bytes");
});

it("starts a fresh standalone phone conservatively even when Safari denies the IndexedDB getter", () => {
  const f = fixture(), browser = Object.assign(new EventTarget(), {
    localStorage: { getItem: (key: string) => f.values.get(key) ?? null, setItem: (key: string, text: string) => { f.values.set(key, text); } },
    innerWidth: 390, location: { search: "" }, navigator: { standalone: true }, matchMedia: () => ({ matches: true }),
  });
  Object.defineProperty(browser, "indexedDB", { get() { throw Error("SecurityError"); } });
  vi.stubGlobal("window", browser); vi.stubGlobal("document", Object.assign(new EventTarget(), { visibilityState: "visible" }));
  expect(() => beginPhoneCloudOpening()).not.toThrow();
  expect(phoneMemoryProfile().mode).toBe("reduced");
  expect(f.values.get("untouched.save")).toBe("exact-original-bytes");
});
