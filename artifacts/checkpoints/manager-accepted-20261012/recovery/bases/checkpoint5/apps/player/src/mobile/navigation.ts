import { useEffect, useRef, useState, useSyncExternalStore } from "react";

export type MobileTab = "clinic" | "patients" | "alerts" | "manage" | "build";
export type MobileSheetId = Exclude<MobileTab, "clinic"> | "more" | "goals" | "cash" |
  "advertising" | "emergency" | "tools" | "help" | "save" | "chart" | "discussion" | "room" | "inspector";
export interface MobileNavigationState {
  tab: MobileTab;
  sheets: readonly MobileSheetId[];
}
const HISTORY_KEY = "gamifySurgeryMobileSheet";
type NavigationBrowser = Pick<Window, "history" | "addEventListener" | "removeEventListener">;

/** Presentation history never contains campaign state or executes game commands. */
export class MobileNavigator {
  private state: MobileNavigationState;
  private listeners = new Set<() => void>();
  private browser: NavigationBrowser | null = null;
  private ignoreNextPop = false;
  private queuedBack = 0;
  private pendingMark: boolean | null = null;
  private connectedBefore = false;
  private owner = Math.random().toString(36).slice(2);
  beforeClose: (sheet: MobileSheetId) => boolean = () => true;

  constructor(tab: MobileTab = "clinic") {
    this.state = { tab, sheets: tab === "clinic" ? [] : [tab] };
  }

  getSnapshot = (): MobileNavigationState => this.state;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };

  private update(state: MobileNavigationState) {
    this.state = state;
    for (const listener of this.listeners) listener();
  }

  private mark(push: boolean) {
    if (!this.browser) return;
    if (this.ignoreNextPop) {
      this.pendingMark = this.pendingMark === true || push;
      return;
    }
    const value = { ...this.browser.history.state, [HISTORY_KEY]: this.owner };
    if (push) this.browser.history.pushState(value, "");
    else this.browser.history.replaceState(value, "");
  }

  private ownsEntry() {
    return this.browser?.history.state?.[HISTORY_KEY] === this.owner;
  }

  private back(delta: number) {
    if (!this.browser) return;
    if (this.ignoreNextPop) { this.queuedBack += delta; return; }
    this.ignoreNextPop = true;
    if (delta === -1) this.browser.history.back();
    else this.browser.history.go(delta);
  }

  connect(browser: NavigationBrowser) {
    this.browser = browser;
    browser.addEventListener("popstate", this.onPop);
    if (this.state.sheets.length) this.mark(!this.connectedBefore);
    this.connectedBefore = true;
    return () => {
      browser.removeEventListener("popstate", this.onPop);
      if (this.ownsEntry()) {
        const state = { ...browser.history.state };
        delete state[HISTORY_KEY];
        browser.history.replaceState(state, "");
      }
      this.browser = null;
    };
  }

  private onPop = () => {
    if (this.ignoreNextPop) {
      if (this.queuedBack !== 0 && this.browser) {
        const delta = this.queuedBack; this.queuedBack = 0;
        this.browser.history.go(delta);
        return;
      }
      this.ignoreNextPop = false;
      const push = this.pendingMark ?? false;
      this.pendingMark = null;
      if (this.state.sheets.length) this.mark(push);
      return;
    }
    const sheet = this.state.sheets.at(-1);
    if (!sheet) return;
    if (!this.beforeClose(sheet)) {
      // Guarded chart acknowledgment/access validation may leave the sheet open.
      this.mark(true);
      return;
    }
    this.removeTop(false);
  };

  open(sheet: MobileSheetId) {
    if (this.state.sheets.includes(sheet)) return;
    this.mark(true);
    this.update({ ...this.state, sheets: [...this.state.sheets, sheet] });
  }

  replaceTop(sheet: MobileSheetId) {
    if (!this.state.sheets.length) { this.open(sheet); return; }
    this.update({ ...this.state, sheets: [...this.state.sheets.slice(0, -1), sheet] });
  }

  selectTab(tab: MobileTab) {
    const hadSheets = this.state.sheets.length > 0;
    const count = this.state.sheets.length;
    if (tab === "clinic") {
      this.update({ tab, sheets: [] });
      if (hadSheets && (this.ownsEntry() || this.ignoreNextPop)) {
        this.back(-count);
      }
      return;
    }
    // Tabs replace the root screen. Overlays retain individual Back entries.
    if (count > 1 && (this.ownsEntry() || this.ignoreNextPop)) {
      this.back(-(count - 1));
    }
    this.mark(!hadSheets);
    this.update({ tab, sheets: [tab] });
  }

  closeTop() {
    const sheet = this.state.sheets.at(-1);
    if (sheet && this.beforeClose(sheet)) this.removeTop(true);
  }

  /** Reconcile a session-owned sheet after its guarded action actually closes it. */
  dismiss(sheet: MobileSheetId) {
    if (this.state.sheets.at(-1) === sheet) this.removeTop(true);
    else if (this.state.sheets.includes(sheet)) {
      this.update({ ...this.state, sheets: this.state.sheets.filter((item) => item !== sheet) });
    }
  }

  private removeTop(back: boolean) {
    const sheets = this.state.sheets.slice(0, -1);
    const owns = this.ownsEntry();
    this.update({ tab: sheets.length ? this.state.tab : "clinic", sheets });
    if (back && (owns || this.ignoreNextPop)) {
      this.back(-1);
    }
  }
}

export function useMobileNavigation(initialTab: MobileTab, beforeClose: MobileNavigator["beforeClose"]) {
  const [navigator] = useState(() => new MobileNavigator(initialTab));
  const closeRef = useRef(beforeClose);
  closeRef.current = beforeClose;
  navigator.beforeClose = (sheet) => closeRef.current(sheet);
  useEffect(() => navigator.connect(window), [navigator]);
  const state = useSyncExternalStore(navigator.subscribe, navigator.getSnapshot, navigator.getSnapshot);
  return { navigator, state };
}
