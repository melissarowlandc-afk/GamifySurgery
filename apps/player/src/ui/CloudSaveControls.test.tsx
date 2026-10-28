import { act } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppShell } from "../AppShell";
import MobileShell from "../mobile/MobileShell";
import { allElements, cleanupPhoneTests, phoneFixture, phoneTestDom } from "../mobile/screenTestUtils";
import { testElementProps } from "../mobile/testDom";
import type { CloudSyncView } from "../session/cloud/coordinator";
import { CloudSaveControls, cloudStatusText, type CloudShellSave } from "./CloudSaveControls";
import { deferred } from "../session/cloud/syncTestSupport";

vi.mock("../facility", () => ({ FacilityCanvas: () => <div>Live clinic map</div> }));
afterEach(cleanupPhoneTests);
function save(view: Partial<CloudSyncView> = {}): CloudShellSave {
  return { campaignName: "A very long synthetic clinic name that wraps safely", writerElsewhere: true,
    view: { phase: "ready", canExecute: true, pending: false, localDurable: true, revision: "1", confirmedAtMs: 1_800_000_000_000, failure: null, ...view },
    onContinue: vi.fn(async () => true), onRetry: vi.fn(async () => true), onUseAccountSave: vi.fn(async () => true),
    onKeepRecovery: vi.fn(async () => true), onSaveAndClose: vi.fn(async () => true), onCampaigns: vi.fn() };
}
const states: Partial<CloudSyncView>[] = [
  { phase: "checking", canExecute: false }, { phase: "readonly", canExecute: false }, { phase: "ready" },
  { phase: "saving", pending: true }, { phase: "ready", pending: true }, { phase: "waiting", failure: "network", pending: true },
  { phase: "ready", pending: true, canExecute: false, localDurable: false },
  { phase: "paused", canExecute: false, failure: "lease-expired" }, { phase: "conflict", canExecute: false, failure: "revision" },
  { phase: "conflict", canExecute: false, failure: "writer", pending: true }, { phase: "auth", canExecute: false, failure: "auth" },
  { phase: "storage", canExecute: false, localDurable: false, failure: "storage" }, { phase: "capacity", canExecute: false, failure: "capacity" },
  { phase: "blocked", canExecute: false, failure: "disabled" }, { phase: "blocked", canExecute: false, failure: "corrupt" },
  { phase: "blocked", canExecute: false, failure: "protocol" }, { phase: "blocked", canExecute: false, failure: "revoked" },
  { phase: "blocked", canExecute: false, failure: "deleted" }, { phase: "waiting", failure: "throttled" }, { phase: "closed", canExecute: false },
  { phase: "closed", canExecute: false, pending: true, failure: "sign-out" },
  { phase: "readonly", canExecute: false, failure: "prior-recovery", priorRecovery: { verifiedRevision: "1", serverRevision: "2" } },
];
describe("identical account save states in desktop and phone shells", () => {
  for (const [layout, Shell] of [["desktop", AppShell], ["phone", MobileShell]] as const) {
    it.each(states)(`${layout} shows only actionable $phase / $failure status`, view => {
      phoneTestDom(); const control = save(view);
      const markup = renderToStaticMarkup(<Shell {...phoneFixture({ cloudSave: control })} />);
      const text = cloudStatusText(control.view);
      if (text) {
        expect(markup).toContain(text); expect(markup).toContain('aria-label="Account save status:');
      } else expect(markup).not.toContain('aria-label="Account save status:');
      expect(markup).not.toContain("Preparing recovery on this device");
      expect(markup).not.toContain("account save waiting");
      expect(markup).toContain("Save &amp; Close"); expect(markup).not.toContain("Safe to close this tab");
      if (!control.view.canExecute) expect(markup).toMatch(/aria-label="(?:Resume facility time|Resume facility clock)[^>]*disabled|disabled[^>]*aria-label="(?:Resume facility time|Resume facility clock)/);
    });
    it(`${layout} labels the preserved prototype/local path Local only`, () => {
      phoneTestDom(); expect(renderToStaticMarkup(<Shell {...phoneFixture()} />)).toContain("Local only");
    });
  }
  it.each([
    { phase: "ready", pending: false }, { phase: "ready", pending: true },
    { phase: "ready", pending: true, localDurable: false }, { phase: "saving", pending: true },
    { phase: "checking", canExecute: false }, { phase: "closed", canExecute: false },
  ] as const)("hides normal status for $phase / pending $pending", async view => {
    const env = phoneTestDom(), control = save(view);
    await env.render(<CloudSaveControls save={control} />);
    expect(cloudStatusText(control.view)).toBeNull();
    if (control.view.canExecute) expect(env.element.textContent).toBe("Save & Close");
    else {
      const notice = allElements(env.doc.body, node => node.attributes["aria-label"] === "Play paused for account save")[0]!;
      expect(notice.attributes.role).toBe("alert");
      expect(notice.parentNode).toBe(env.doc.body);
      expect(allElements(notice, node => node.tagName === "BUTTON" && node.textContent === "Open account save")[0]!.attributes.disabled).toBeUndefined();
    }
    expect(control.onSaveAndClose).not.toHaveBeenCalled();
  });
  it("uses one explicit takeover choice and restores keyboard focus when dismissed", async () => {
    const env = phoneTestDom(), control = save({ phase: "readonly", canExecute: false });
    await env.render(<CloudSaveControls save={control} />);
    expect(env.element.textContent).not.toContain("Continue on this device?");
    await env.click("Continue clinic");
    expect(env.element.textContent).toContain("Continue on this device?");
    expect(env.element.textContent).toContain("Only progress saved to your account can move here.");
    expect(env.doc.activeElement.tagName).toBe("H2");
    await env.click("Not now"); expect(control.onContinue).not.toHaveBeenCalled();
    const trigger = env.button("Continue clinic"); trigger.focus(); await env.clickElement(trigger);
    const dialog = env.find(node => node.tagName === "DIALOG");
    await act(async () => { (testElementProps(dialog).onCancel as (event: { preventDefault(): void }) => void)({ preventDefault() {} }); });
    expect(env.doc.activeElement).toBe(trigger);
    await env.clickElement(trigger); await env.click("Continue on this device"); expect(control.onContinue).toHaveBeenCalledExactlyOnceWith(true);
  });
  it("does not claim Safe to close until the asynchronous save and fenced release succeed", async () => {
    const env = phoneTestDom(), waiting = deferred(), control = save();
    control.onSaveAndClose = vi.fn(async () => { await waiting.promise; return true; });
    await env.render(<CloudSaveControls save={control} />); await env.click("Save & Close");
    expect(env.element.textContent).toContain("Waiting for account confirmation"); expect(env.element.textContent).not.toContain("Safe to close this tab");
    // The coordinator reports the closed session before the close promise settles.
    control.view = { ...control.view, phase: "closed", pending: false, failure: null };
    await act(async () => { waiting.resolve(); await waiting.promise; });
    expect(env.element.textContent).toContain("Safe to close this tab"); expect(env.element.textContent).toContain("released its session");
  });
  it("keeps a failed close honest and preserves recovery choices without a local erase shortcut", async () => {
    const env = phoneTestDom(), control = save({ phase: "conflict", canExecute: false, failure: "writer", pending: true });
    control.onSaveAndClose = vi.fn(async () => false);
    await env.render(<CloudSaveControls save={control} />);
    expect(env.element.textContent).toContain("You continued on another device. Recent changes here have not replaced your account save.");
    await env.click("Save & Close"); expect(env.element.textContent).toContain("close are not confirmed");
    expect(env.element.textContent).not.toContain("Safe to close this tab");
    expect(env.element.textContent).not.toContain("Clear local campaigns");
    await env.click("Keep a recovery copy"); expect(control.onKeepRecovery).toHaveBeenCalledOnce();
  });
  it("reports prior verification recovery without offering continuation or a rewind", async () => {
    const env = phoneTestDom(), control = save({ phase: "readonly", failure: "prior-recovery", canExecute: false, priorRecovery: { verifiedRevision: "1", serverRevision: "2" } });
    await env.render(<CloudSaveControls save={control} />);
    expect(env.element.textContent).toContain("latest save failed verification"); expect(env.element.textContent).toContain("later evidence have not been replaced");
    expect(env.element.textContent).not.toContain("Continue on this device?"); expect(env.element.textContent).not.toContain("Use the account save");
  });
  it("uses touch targets, visible focus, wrapping and a scrollable bounded dialog", () => {
    const css = readFileSync(new URL("./cloudSaves.css", import.meta.url), "utf8");
    for (const token of ["min-height: 44px", "focus-visible", "overflow-wrap: anywhere", "100dvh", "overflow-y: auto"]) expect(css).toContain(token);
  });

  it("offers a working Resume for the reported ready/pending state without opening a routine prompt", async () => {
    const env = phoneTestDom(), control = save({ phase: "ready", canExecute: false, pending: true });
    await env.render(<CloudSaveControls save={control} />);
    expect(allElements(env.element, node => node.tagName === "DIALOG")).toHaveLength(0);
    await env.click("Resume clinic"); await env.click("Resume checked campaign");
    expect(control.onContinue).toHaveBeenCalledExactlyOnceWith(false);
  });

  it("dismisses an automatic storage dialog after recovery while retaining manually opened dialogs", async () => {
    const env = phoneTestDom(), control = save({ phase: "storage", failure: "storage", canExecute: false, localDurable: false, pending: true });
    await env.render(<CloudSaveControls save={control} />);
    expect(allElements(env.element, node => node.tagName === "DIALOG")).toHaveLength(1);
    control.view = { ...control.view, phase: "ready", failure: null, canExecute: true, localDurable: true };
    await env.render(<CloudSaveControls save={control} />);
    expect(allElements(env.element, node => node.tagName === "DIALOG")).toHaveLength(0);
    control.view = { ...control.view, canExecute: false }; await env.render(<CloudSaveControls save={control} />);
    await env.click("Resume clinic");
    control.view = { ...control.view, canExecute: true }; await env.render(<CloudSaveControls save={control} />);
    expect(allElements(env.element, node => node.tagName === "DIALOG")).toHaveLength(1);
  });

  it.each(["device", "account"] as const)("shows verified copy details and prefers newer %s progress in a real conflict", async newer => {
    const env = phoneTestDom(), control = save({ phase: "conflict", failure: "revision", pending: true, canExecute: false,
      conflictCopies: { device: { facilityTick: 1514, dayTime: "Day 2 · 9:14 AM", cash: 1131.8, level: 1, xp: 72 },
        account: { facilityTick: 0, dayTime: "Day 1 · 8:00 AM", cash: 500, level: 1, xp: 0 }, accountRevision: "2", newer, canKeepDevice: true } });
    control.onKeepDevice = vi.fn(async () => true);
    await env.render(<CloudSaveControls save={control} />);
    expect(env.element.textContent).toContain("On this device: Day 2 · 9:14 AM · $1,131.80 · Level 1 · 72 XP");
    expect(env.element.textContent).toContain("Account save: Day 1 · 8:00 AM · $500.00");
    expect(env.button(newer === "device" ? "Keep playing with this device's progress" : "Use the account save").attributes.class).toContain("button-primary");
    await env.click("Keep playing with this device's progress"); expect(control.onKeepDevice).toHaveBeenCalledOnce();
  });

  for (const [layout, Shell] of [["desktop", AppShell], ["phone", MobileShell]] as const) {
    it(`${layout} opens the explicit visible-other-writer choice`, async () => {
      const env = phoneTestDom(), control = save({ phase: "readonly", canExecute: false, failure: "writer-elsewhere" });
      await env.render(<Shell {...phoneFixture({ cloudSave: control })} />);
      expect(env.element.textContent).toContain("Continue on this device?");
      expect(env.element.textContent).toContain("This campaign is open somewhere else.");
      await env.click("Continue on this device"); expect(control.onContinue).toHaveBeenCalledExactlyOnceWith(true);
    });

    it.each([true, false])(`${layout} offers separate campaign preservation with slot availability %s`, async available => {
      const env = phoneTestDom(), control = save({ phase: "conflict", canExecute: false, pending: true, failure: "revision",
        conflictCopies: { device: { facilityTick: 1514, dayTime: "Day 2 · 9:14 AM", cash: 1131.8, level: 1, xp: 72 },
          account: { facilityTick: 0, dayTime: "Day 1 · 8:00 AM", cash: 500, level: 1, xp: 0 }, accountRevision: "2",
          newer: "device", canKeepDevice: false, canSaveSeparate: available, separateCampaignSlots: available ? 1 : 0 } });
      control.onKeepBoth = vi.fn(async () => true);
      await env.render(<Shell {...phoneFixture({ cloudSave: control })} />);
      const label = "Keep both — save this device's progress as a separate campaign";
      expect(env.element.textContent).toContain("On this device: Day 2 · 9:14 AM · $1,131.80");
      expect(env.element.textContent).toContain("Account save: Day 1 · 8:00 AM · $500.00");
      expect(env.button("Use the account save").attributes.disabled).toBeUndefined();
      if (available) {
        expect(env.button(label).attributes.class).toContain("button-primary");
        await env.click(label); expect(control.onKeepBoth).toHaveBeenCalledOnce();
      } else {
        expect(env.button(label).attributes.disabled).toBeDefined();
        expect(env.element.textContent).toContain("No slot is free");
        expect(env.element.textContent).toContain("protected copy is retained");
        await env.click("Keep a recovery copy"); expect(control.onKeepRecovery).toHaveBeenCalledOnce();
        expect(control.onKeepBoth).not.toHaveBeenCalled();
      }
    });
  }
});
