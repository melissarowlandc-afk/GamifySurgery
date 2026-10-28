import { useEffect, useState } from "react";
import { setAuxiliaryItem } from "./session/storagePressure";

export type PresentationLayout = "phone" | "desktop";
export const PRESENTATION_PREFERENCE_KEY = "gamify-surgery.presentation-layout.v1";
const PREFERENCE_EVENT = "gamify-surgery-layout-change";

export function selectPresentationLayout({
  search, preference, coarsePointer, width,
}: {
  search: string;
  preference: PresentationLayout | null;
  coarsePointer: boolean;
  width: number;
}): PresentationLayout {
  const override = new URLSearchParams(search).get("layout");
  if (override === "phone" || override === "desktop") return override;
  if (preference) return preference;
  return coarsePointer && width <= 1100 ? "phone" : "desktop";
}

function readPreference(): PresentationLayout | null {
  try {
    const value = window.localStorage.getItem(PRESENTATION_PREFERENCE_KEY);
    return value === "phone" || value === "desktop" ? value : null;
  } catch {
    return null;
  }
}

export function readPresentationLayout(): PresentationLayout {
  if (typeof window === "undefined") return "desktop";
  return selectPresentationLayout({
    search: window.location.search,
    preference: readPreference(),
    coarsePointer: window.matchMedia?.("(pointer: coarse)").matches ?? false,
    width: window.innerWidth,
  });
}

/** This key is per browser/device, independent of campaign and camera saves. */
export function setPresentationPreference(layout: PresentationLayout): void {
  // An explicit switch also removes a QA override so it takes effect immediately.
  const url = new URL(window.location.href);
  url.searchParams.delete("layout");
  try {
    setAuxiliaryItem(window.localStorage, PRESENTATION_PREFERENCE_KEY, layout);
  } catch {
    // Still honor the choice in this tab when browser storage is unavailable.
    url.searchParams.set("layout", layout);
  }
  window.history.replaceState(window.history.state, "", url);
  window.dispatchEvent(new Event(PREFERENCE_EVENT));
}

export function usePresentationLayout(): PresentationLayout {
  const [layout, setLayout] = useState(readPresentationLayout);
  useEffect(() => {
    const update = () => setLayout(readPresentationLayout());
    const pointer = window.matchMedia?.("(pointer: coarse)");
    const events = ["resize", "orientationchange", "popstate", "storage", PREFERENCE_EVENT];
    for (const event of events) window.addEventListener(event, update);
    pointer?.addEventListener("change", update);
    // Reconcile a resize between render and subscription.
    update();
    return () => {
      for (const event of events) window.removeEventListener(event, update);
      pointer?.removeEventListener("change", update);
    };
  }, []);
  return layout;
}
