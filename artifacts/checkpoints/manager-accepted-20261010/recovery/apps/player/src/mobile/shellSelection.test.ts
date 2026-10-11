import { afterEach, describe, expect, it, vi } from "vitest";
import { PRESENTATION_PREFERENCE_KEY, readPresentationLayout, selectPresentationLayout, setPresentationPreference } from "../shellPresentation";

afterEach(() => vi.unstubAllGlobals());
describe("shell selection", () => {
  it.each([360, 390, 768, 844, 1100, 1600])("keeps a fine-pointer desktop at width %i", (width) => {
    expect(selectPresentationLayout({ search: "", preference: null, coarsePointer: false, width })).toBe("desktop");
  });
  it.each([360, 390, 768, 844, 1100])("automatically selects phone for coarse input at width %i", (width) => {
    expect(selectPresentationLayout({ search: "", preference: null, coarsePointer: true, width })).toBe("phone");
  });
  it("uses desktop for a wide coarse-pointer tablet", () => {
    expect(selectPresentationLayout({ search: "", preference: null, coarsePointer: true, width: 1101 })).toBe("desktop");
  });
  it.each([
    ["?layout=desktop", "phone", true, 390, "desktop"],
    ["?layout=phone", "desktop", false, 1600, "phone"],
    ["", "desktop", true, 390, "desktop"],
    ["", "phone", false, 1600, "phone"],
    ["?layout=unknown", null, false, 390, "desktop"],
  ] as const)("honors query, then device preference, then automatic selection: %s", (search, preference, coarsePointer, width, expected) => {
    expect(selectPresentationLayout({ search, preference, coarsePointer, width })).toBe(expected);
  });
  it("defaults to desktop without browser APIs", () => expect(readPresentationLayout()).toBe("desktop"));
  it("ignores blocked/invalid storage and records only a presentation key", () => {
    const values = new Map<string, string>();
    const target = new EventTarget();
    const browser = Object.assign(target, {
      location: { href: "http://127.0.0.1:5184/?layout=phone&prototype-tools=1#map", search: "?layout=phone&prototype-tools=1" },
      innerWidth: 390, matchMedia: () => ({ matches: false }),
      localStorage: { getItem: () => { throw new Error("Blocked"); }, setItem: (key: string, value: string) => values.set(key, value) },
      history: { state: { existing: true }, replaceState: vi.fn() },
    });
    vi.stubGlobal("window", browser);
    expect(readPresentationLayout()).toBe("phone");
    setPresentationPreference("desktop");
    expect([...values]).toEqual([[PRESENTATION_PREFERENCE_KEY, "desktop"]]);
    expect(String(browser.history.replaceState.mock.calls[0]?.[2])).toBe("http://127.0.0.1:5184/?prototype-tools=1#map");
  });
  it("still switches in this tab if storage cannot persist a preference", () => {
    const replace = vi.fn();
    vi.stubGlobal("window", Object.assign(new EventTarget(), {
      location: { href: "http://127.0.0.1:5184/?layout=phone" },
      localStorage: { setItem: () => { throw new Error("Blocked"); } }, history: { state: null, replaceState: replace },
    }));
    setPresentationPreference("desktop");
    expect(String(replace.mock.calls[0]?.[2])).toBe("http://127.0.0.1:5184/?layout=desktop");
  });
});
