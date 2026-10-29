import { act } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppShell } from "../AppShell";
import MobileShell from "../mobile/MobileShell";
import { allElements, cleanupPhoneTests, phoneFixture, phoneTestDom } from "../mobile/screenTestUtils";
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
      if (text && control.view.phase !== "closed") expect(markup).toContain(text.replaceAll("&", "&amp;").replaceAll("'", "&#x27;"));
      if (text && control.view.canExecute) expect(markup).toContain('aria-label="Account save status:');
      else expect(markup).not.toContain('aria-label="Account save status:');
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
  ] as const)("hides normal status for $phase / pending $pending", async view => {
    const env = phoneTestDom(), control = save(view);
    await env.render(<CloudSaveControls save={control} />);
    expect(cloudStatusText(control.view)).toBeNull();
    expect(env.element.textContent).toBe("Save & Close");
    expect(control.onSaveAndClose).not.toHaveBeenCalled();
  });
  it("offers exactly one Open here action for a fenced writer above an open chart", async () => {
    const env = phoneTestDom(), control = save({ phase: "conflict", canExecute: false, failure: "writer" });
    await env.render(<CloudSaveControls save={control} />);
    const notice = allElements(env.doc.body, node => node.attributes["aria-label"] === "Clinic status")[0]!;
    expect(notice.parentNode).toBe(env.doc.body);
    expect(notice.textContent).toContain("This clinic is now open on another device.");
    expect(allElements(notice, node => node.tagName === "BUTTON")).toHaveLength(1);
    await env.clickElement(allElements(notice, node => node.tagName === "BUTTON")[0]!);
    expect(control.onRetry).toHaveBeenCalledOnce(); expect(control.onContinue).not.toHaveBeenCalled();
  });
  it.each(["capacity", "prior-recovery", "network"])("reserves phone header space for %s so More and recovery export stay reachable", async failure => {
    const env = phoneTestDom(), control = save({ phase: failure === "capacity" ? "capacity" : "readonly", canExecute: false, failure });
    await env.render(<MobileShell {...phoneFixture({ cloudSave: control })} />);
    const notice = allElements(env.doc.body, node => node.attributes["aria-label"] === "Clinic status")[0]!;
    const header = allElements(env.doc.body, node => node.attributes["aria-label"] === "Clinic resources")[0]!;
    expect(header.contains(notice)).toBe(true);
    expect(notice.parentNode).not.toBe(env.doc.body);
    await env.click("More clinic options");
    expect(env.element.textContent).toContain("Layout on this device");
    const css = readFileSync(new URL("./cloudSaves.css", import.meta.url), "utf8");
    expect(css).toMatch(/\.cloud-command-blocked\.is-inline\s*\{\s*position:\s*static/);
  });
  it("does not claim Safe to close until the asynchronous save and fenced release succeed", async () => {
    const env = phoneTestDom(), waiting = deferred(), control = save();
    control.onSaveAndClose = vi.fn(async () => { await waiting.promise; return true; });
    await env.render(<CloudSaveControls save={control} />); await env.click("Save & Close");
    expect(env.element.textContent).toContain("Waiting for account confirmation"); expect(env.element.textContent).not.toContain("Safe to close this tab");
    // The coordinator reports the closed session before the close promise settles.
    control.view = { ...control.view, phase: "closed", pending: false, failure: null };
    await act(async () => { waiting.resolve(); await waiting.promise; });
    expect(env.element.textContent).toContain("Safe to close this tab"); expect(env.element.textContent).toContain("saved to your account and paused");
  });
  it("keeps a failed close honest without save choices or an erase shortcut", async () => {
    const env = phoneTestDom(), control = save();
    control.onSaveAndClose = vi.fn(async () => false);
    await env.render(<CloudSaveControls save={control} />); await env.click("Save & Close");
    expect(env.element.textContent).not.toContain("Safe to close this tab");
    expect(env.element.textContent).toContain("Account save is not confirmed");
    expect(env.element.textContent).not.toContain("Clear local campaigns");
    expect(env.element.textContent).not.toContain("Use the account save");
    await env.click("Retry"); expect(control.onSaveAndClose).toHaveBeenCalledTimes(2);
  });
  it("does not close a newly mounted playing control by replaying the previous shell request", async () => {
    const env = phoneTestDom(), first = save(), reopened = save();
    await env.render(<CloudSaveControls key="first" save={first} closeRequest={0} />);
    await env.render(<CloudSaveControls key="first" save={first} closeRequest={1} />);
    expect(first.onSaveAndClose).toHaveBeenCalledOnce();
    await env.render(<CloudSaveControls key="reopened" save={reopened} closeRequest={1} />);
    expect(reopened.onSaveAndClose).not.toHaveBeenCalled();
    expect(env.element.textContent).toBe("Save & Close");
    await env.render(<CloudSaveControls key="reopened" save={reopened} closeRequest={2} />);
    expect(reopened.onSaveAndClose).toHaveBeenCalledOnce();
  });
  it("keeps a corrupt head read-only with one Retry and no rewind choice", async () => {
    const env = phoneTestDom(), control = save({ phase: "readonly", failure: "prior-recovery", canExecute: false,
      priorRecovery: { verifiedRevision: "1", serverRevision: "2" } });
    await env.render(<CloudSaveControls save={control} />);
    const notice = allElements(env.doc.body, node => node.attributes["aria-label"] === "Clinic status")[0]!;
    expect(notice.textContent).toContain("latest save could not be verified");
    expect(allElements(notice, node => node.tagName === "BUTTON")).toHaveLength(1);
    expect(notice.textContent).not.toContain("Use the account save");
  });
  it("uses touch targets, visible focus, wrapping and a scrollable bounded dialog", () => {
    const css = readFileSync(new URL("./cloudSaves.css", import.meta.url), "utf8");
    for (const token of ["min-height: 44px", "focus-visible", "overflow-wrap: anywhere", "100dvh", "overflow-y: auto"]) expect(css).toContain(token);
  });

  it("offers a working retry for the reported ready/pending closed gate", async () => {
    const env = phoneTestDom(), control = save({ phase: "ready", canExecute: false, pending: true });
    await env.render(<CloudSaveControls save={control} />);
    const retry = allElements(env.doc.body, node => node.tagName === "BUTTON" && node.textContent === "Retry")[0]!;
    await env.clickElement(retry); expect(control.onRetry).toHaveBeenCalledOnce();
  });
  it("automatically removes the blocking notice when play recovers", async () => {
    const env = phoneTestDom(), control = save({ phase: "storage", failure: "storage", canExecute: false, localDurable: false, pending: true });
    await env.render(<CloudSaveControls save={control} />);
    expect(allElements(env.doc.body, node => node.attributes["aria-label"] === "Clinic status")).toHaveLength(1);
    control.view = { ...control.view, phase: "ready", failure: null, canExecute: true, localDurable: true };
    await env.render(<CloudSaveControls save={control} />);
    expect(allElements(env.doc.body, node => node.attributes["aria-label"] === "Clinic status")).toHaveLength(0);
  });
  for (const [layout, Shell] of [["desktop", AppShell], ["phone", MobileShell]] as const) {
    it.each(["writer", "revision", "storage", "capacity", "clock", "lease-check"])(`${layout} has one action and no save choices for %s`, async failure => {
      const env = phoneTestDom(), control = save({ phase: "conflict", canExecute: false, pending: true, failure });
      await env.render(<Shell {...phoneFixture({ cloudSave: control })} />);
      const notice = allElements(env.doc.body, node => node.attributes["aria-label"] === "Clinic status")[0]!;
      expect(allElements(notice, node => node.tagName === "BUTTON")).toHaveLength(1);
      for (const removed of ["Continue on this device?", "Use the account save", "Keep both", "Keep a recovery copy", "Not now"])
        expect(notice.textContent).not.toContain(removed);
    });
  }
});
