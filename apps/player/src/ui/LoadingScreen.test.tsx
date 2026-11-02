import { act, useEffect, useState } from "react";
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { allElements, cleanupPhoneTests, phoneTestDom } from "../mobile/screenTestUtils";
import { testElementProps } from "../mobile/testDom";
import { LoadingCovered, LoadingScreen, LOADING_DEADLINE_MS, LOADING_DELAY_MS } from "./LoadingScreen";
import { CloudSaveControls, cloudCheckNeedsLoading, type CloudShellSave } from "./CloudSaveControls";
import type { CloudSyncView } from "../session/cloud/coordinator";
import { loadingArtwork } from "./loadingArtwork";

beforeEach(() => vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] }));
afterEach(cleanupPhoneTests);
const advance = async (ms: number) => { await act(async () => { await vi.advanceTimersByTimeAsync(ms); }); };
const view = (overrides: Partial<CloudSyncView> = {}): CloudSyncView => ({
  phase: "ready", canExecute: true, localDurable: true, pending: false, revision: "1", confirmedAtMs: 1, failure: null, ...overrides,
});

describe("shared full-screen loading presentation", () => {
  it("never flashes a check that finishes before 400 ms", async () => {
    const env = phoneTestDom();
    await env.render(<LoadingScreen active status="Checking your save…" />);
    await advance(LOADING_DELAY_MS - 1);
    expect(env.doc.body.textContent).toBe("");
    await env.render(<LoadingScreen active={false} status="Checking your save…" />);
    await advance(LOADING_DEADLINE_MS);
    expect(env.doc.body.textContent).toBe("");
  });
  it("does not restart the delay when opening stages change, and has no healthy actions", async () => {
    const env = phoneTestDom();
    await env.render(<LoadingScreen status="Connecting…" stage="connecting" />);
    await advance(250);
    await env.render(<LoadingScreen status="Checking your save…" stage="checking" />);
    await advance(150);
    expect(env.doc.body.textContent).toContain("Checking your save…");
    const bar = allElements(env.doc.body, node => node.attributes.role === "progressbar")[0]!;
    expect(bar.attributes["aria-valuenow"]).toBe("2");
    expect(bar.attributes["aria-valuetext"]).toBe("Step 2 of 3");
    expect(allElements(env.doc.body, node => node.tagName === "BUTTON")).toHaveLength(0);
    expect(allElements(env.doc.body, node => node.attributes.role === "status")).toHaveLength(1);
    await env.render(<LoadingScreen status="Opening your clinic…" stage="opening" />);
    expect(bar.attributes["aria-valuenow"]).toBe("3");
    const art = allElements(env.doc.body, node => node.tagName === "IMG")[0]!;
    expect(art.attributes.src).toContain(loadingArtwork.src);
    expect(art.attributes.alt).toBe(loadingArtwork.alt);
  });
  it("uses an indeterminate bar without invented progress", async () => {
    const env = phoneTestDom(); await env.render(<LoadingScreen status="Saving your clinic…" />); await advance(400);
    const bar = allElements(env.doc.body, node => node.attributes.role === "progressbar")[0]!;
    expect(bar.attributes["aria-valuenow"]).toBeUndefined();
    expect(bar.attributes.class).toContain("is-indeterminate");
    const css = readFileSync(new URL("./LoadingScreen.css", import.meta.url), "utf8");
    expect(css).toContain("prefers-reduced-motion: reduce"); expect(css).toContain("animation: none");
    expect(css).toContain("safe-area-inset-top"); expect(css).toContain("image-rendering: pixelated");
  });
  it.each(["failure", "deadline"])("offers one recovery action only after %s", async kind => {
    const env = phoneTestDom(), retry = vi.fn();
    await env.render(<LoadingScreen status="Checking your save…" failure={kind === "failure" ? "The check failed. Your copies are safe." : null} onRetry={retry} />);
    if (kind === "deadline") {
      await advance(LOADING_DEADLINE_MS - 1);
      expect(allElements(env.doc.body, node => node.tagName === "BUTTON")).toHaveLength(0);
      await advance(1);
    }
    const actions = allElements(env.doc.body, node => node.tagName === "BUTTON");
    expect(actions.map(node => node.textContent)).toEqual(["Try again"]);
    expect(allElements(env.doc.body, node => node.attributes.role === "alert")).toHaveLength(1);
    await env.clickElement(actions[0]!); expect(retry).toHaveBeenCalledOnce();
  });
  it("does not invent a reload action for work that may still own unsaved progress", async () => {
    const env = phoneTestDom(), reload = vi.fn(); Object.assign(env.browser.location, { reload });
    await env.render(<LoadingScreen status="Saving your clinic…" />); await advance(LOADING_DEADLINE_MS);
    expect(env.doc.body.textContent).toContain("Your saved copies are safe");
    expect(allElements(env.doc.body, node => node.tagName === "BUTTON")).toHaveLength(0);
    expect(reload).not.toHaveBeenCalled();
  });
  it("moves focus, shields underlying controls, preserves the mounted game and restores focus", async () => {
    const env = phoneTestDom(), unmount = vi.fn();
    function Game() { const [count, setCount] = useState(0); useEffect(() => unmount, []); return <button onClick={() => setCount(n => n + 1)}>Clinic {count}</button>; }
    const render = (active: boolean) => env.render(<><Game /><LoadingScreen active={active} status="Checking…" /></>);
    await render(false); await env.click("Clinic 0"); const trigger = env.button("Clinic 1"); trigger.focus();
    await render(true); await advance(400);
    const overlay = allElements(env.doc.body, node => node.attributes["aria-label"] === "Loading clinic")[0]!;
    expect(env.doc.activeElement).toBe(overlay);
    expect((env.element as unknown as HTMLElement).inert).toBe(true);
    expect(unmount).not.toHaveBeenCalled();
    await render(false);
    expect(env.button("Clinic 1")).toBe(trigger); expect(env.doc.activeElement).toBe(trigger);
    expect((env.element as unknown as HTMLElement).inert).not.toBe(true);
  });
  it("covers an already-open native chart dialog and prevents Escape from closing it", async () => {
    const env = phoneTestDom(), modal = env.doc.createElement("dialog"); modal.setAttribute("open", ""); env.doc.body.appendChild(modal);
    Object.assign(env.doc, { querySelectorAll: () => [modal] });
    await env.render(<LoadingScreen status="Checking…" />); await advance(400);
    const overlay = allElements(modal, node => node.attributes["aria-label"] === "Loading clinic")[0]!;
    expect(overlay.parentNode).toBe(modal);
    const event = { key: "Escape", target: overlay, preventDefault: vi.fn(), stopPropagation: vi.fn() };
    (testElementProps(overlay).onKeyDown as (event: unknown) => void)(event);
    expect(event.preventDefault).toHaveBeenCalledOnce(); expect(event.stopPropagation).toHaveBeenCalledOnce();
    const reportEvent = { ...event, target: env.doc.body, preventDefault: vi.fn(), stopPropagation: vi.fn() };
    (testElementProps(overlay).onKeyDown as (event: unknown) => void)(reportEvent);
    expect(reportEvent.preventDefault).not.toHaveBeenCalled();
  });
  it("focuses the new clinic landmark when the opening replaced the old focus target", async () => {
    const env = phoneTestDom(), main = env.doc.createElement("main"); env.doc.body.appendChild(main);
    Object.assign(env.doc, { querySelector: () => main });
    await env.render(<LoadingScreen status="Opening…" />); await advance(400);
    await env.render(<LoadingScreen active={false} status="Opening…" />);
    expect(env.doc.activeElement).toBe(main); expect(main.attributes.tabindex).toBeUndefined();
  });
  it("suppresses a nested game's loader while its parent owns the opening screen", async () => {
    const env = phoneTestDom();
    await env.render(<><LoadingCovered><LoadingScreen status="Nested" /></LoadingCovered><LoadingScreen status="Opening your clinic…" /></>);
    await advance(400);
    expect(allElements(env.doc.body, node => node.attributes["aria-label"] === "Loading clinic")).toHaveLength(1);
    expect(env.doc.body.textContent).not.toContain("Nested");
  });
});

describe("command-gate to loading-screen mapping", () => {
  it.each([
    ["valid lease, slow background check", view({ checking: true }), false],
    ["expired lease being rechecked", view({ checking: true, phase: "paused", failure: "lease-expired", canExecute: false }), true],
    ["opening check", view({ phase: "checking", canExecute: false }), true],
    ["failed lease check", view({ phase: "paused", failure: "lease-expired", canExecute: false }), false],
    ["other writer recovery", view({ phase: "conflict", failure: "writer", canExecute: false }), false],
    ["storage recovery", view({ phase: "storage", failure: "storage", canExecute: false, localDurable: false }), false],
    ["healthy saving", view({ phase: "saving", pending: true }), false],
  ])("%s", (_name, state, expected) => expect(cloudCheckNeedsLoading(state as CloudSyncView)).toBe(expected));
  it.each(["phone", "desktop"])("%s check stays covered without Retry and dismisses when play is allowed", async layout => {
    const env = phoneTestDom(); env.browser.location.search = `?layout=${layout}`;
    const save = { campaignName: "Clinic", view: view({ phase: "paused", failure: "lease-expired", checking: true, canExecute: false }),
      onRetry: vi.fn(), onSaveAndClose: vi.fn() } as unknown as CloudShellSave;
    await env.render(<CloudSaveControls save={save} showCloseButton={false} />); await advance(400);
    expect(env.doc.body.textContent).toContain("Checking your clinic’s saved progress…");
    expect(allElements(env.doc.body, node => node.tagName === "BUTTON")).toHaveLength(0);
    save.view = view(); await env.render(<CloudSaveControls save={save} showCloseButton={false} />);
    expect(env.doc.body.textContent).toBe(""); expect(save.onRetry).not.toHaveBeenCalled();
  });
});
