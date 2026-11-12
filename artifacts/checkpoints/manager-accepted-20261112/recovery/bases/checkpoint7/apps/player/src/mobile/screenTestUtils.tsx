import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { vi } from "vitest";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "../session/viewModels";
import type { PrototypeShellProps } from "../shellContract";
import { TestDocument, TestElement, findTestElement, testElementProps } from "./testDom";

export const noop = () => undefined;
export function phoneFixture(overrides: Partial<PrototypeShellProps> = {}): PrototypeShellProps {
  const view = createPrototypePlayerView(createInitialGameState(), null, false, null);
  return new Proxy({ ...view, paused: false, simulationSpeed: 1, employeeDiscussion: null,
    buildMode: false, managementMode: false, buildUndoCount: 0, buildExitBlockedReason: null, buildExitBlockedIssues: [],
    placementOrientation: 0, campaigns: [], systemNotices: [], questionReviewFlags: [], tutorialsEnabled: false,
    tutorialTargetEncounterId: null, tutorialStep: null, announcement: "", ...overrides,
  }, { get(target, key) { return Reflect.has(target, key) ? Reflect.get(target, key) : typeof key === "string" && key.startsWith("on") ? noop : undefined; } }) as PrototypeShellProps;
}

export function allElements(root: TestElement, predicate: (element: TestElement) => boolean): TestElement[] {
  return [...(predicate(root) ? [root] : []), ...root.childNodes.flatMap((child) => allElements(child, predicate))];
}
const roots = new Set<Root>();
export async function cleanupPhoneTests() {
  await act(async () => { for (const root of roots) root.unmount(); });
  roots.clear(); vi.unstubAllGlobals(); vi.useRealTimers();
}

/** Same minimal React DOM harness as MB1. Physical geometry is manager browser QA. */
export function phoneTestDom() {
  const doc = new TestDocument();
  const element = doc.createElement("div"); doc.body.appendChild(element);
  const entries: unknown[] = [null]; let index = 0;
  const browser = Object.assign(new EventTarget(), {
    document: doc, innerWidth: 390, innerHeight: 844,
    location: { href: "http://127.0.0.1:5184/?layout=phone&prototype-tools=1", search: "?layout=phone&prototype-tools=1" },
    navigator: { webdriver: true }, localStorage: { getItem: () => null, setItem: vi.fn() },
    matchMedia: () => Object.assign(new EventTarget(), { matches: false }),
    HTMLElement: TestElement, HTMLIFrameElement: class extends TestElement {},
    requestAnimationFrame: (callback: FrameRequestCallback) => setTimeout(() => callback(0), 0),
    cancelAnimationFrame: (timer: ReturnType<typeof setTimeout>) => clearTimeout(timer), setTimeout, clearTimeout,
    history: {
      get state() { return entries[index]; },
      pushState(state: unknown) { entries.splice(index + 1); entries.push(state); index += 1; },
      replaceState(state: unknown) { entries[index] = state; },
      go(delta: number) { index = Math.max(0, index + delta); queueMicrotask(() => browser.dispatchEvent(new Event("popstate"))); },
      back() { this.go(-1); },
    },
  });
  doc.defaultView = browser;
  vi.stubGlobal("window", browser); vi.stubGlobal("document", doc); vi.stubGlobal("HTMLElement", TestElement);
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const root = createRoot(element as unknown as HTMLElement); roots.add(root);
  const find = (predicate: (element: TestElement) => boolean) => {
    const found = findTestElement(element, predicate);
    if (!found) throw new Error("Phone test element missing");
    return found;
  };
  const button = (name: string) => find((node) => node.tagName === "BUTTON" &&
    (node.attributes["aria-label"] === name || node.textContent === name));
  const clickElement = async (node: TestElement) => {
    if (node.attributes.disabled !== undefined) throw new Error(`Button disabled: ${node.textContent}`);
    await act(async () => { (testElementProps(node).onClick as () => void)(); });
  };
  return { root, element, doc, browser, find, button, clickElement,
    render: async (node: ReactNode) => { await act(async () => root.render(node)); },
    click: async (name: string) => clickElement(button(name)),
    back: async () => { await act(async () => browser.history.back()); },
  };
}
