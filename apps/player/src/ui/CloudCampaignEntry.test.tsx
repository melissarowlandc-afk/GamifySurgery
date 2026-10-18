import { act, type ReactNode, type ComponentProps } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthAccountActionsContext, AuthAccountContext } from "../auth/AuthAccountContext";
import { cleanupPhoneTests, phoneTestDom } from "../mobile/screenTestUtils";
import { findTestElement, testElementProps, type TestElement } from "../mobile/testDom";
import { CloudAccountContext, type CloudAccountValue } from "../session/cloud/CloudAccount";
import { MemoryCloudCache } from "../session/cloud/cache";
import { MemoryCloudEntryStore } from "../session/cloud/entryStorage";
import { FakeCloudServer } from "../session/cloud/fakeTransport";
import { syncFixture } from "../session/cloud/syncTestSupport";
import { CloudSyncError } from "../session/cloud/transport";
import { AccountMenu } from "./AccountMenu";
import { CloudCampaignEntry } from "./CloudCampaignEntry";

afterEach(cleanupPhoneTests);
function account() {
  const server = new FakeCloudServer(), store = new MemoryCloudEntryStore();
  const cloud: CloudAccountValue = { runtime: { accountId: "account-a", backendId: "synthetic", region: "Disposable QA", transport: server.transport("account-a"), cache: new MemoryCloudCache(), entryStore: store },
    access: { accountId: "account-a", admitted: true, enabled: true, noticeAccepted: true, deletionRequested: false, minProtocol: 3, enrollmentsEnabled: true },
    summaries: [], phase: "available", error: null, active: null, refresh: vi.fn(async () => {}), acceptNotice: vi.fn(async () => {}), attach: vi.fn(), stop: vi.fn(async () => {}),
    requestDeletion: vi.fn(async () => {}), exportDeviceRecovery: vi.fn(async () => "{}"), clearDevice: vi.fn(async () => {}), showCampaigns: vi.fn(), setCampaignNavigation: vi.fn() };
  const auth = { email: "a@example.invalid", signOut: vi.fn(async () => true), pending: false, message: null };
  return { server, store, cloud, auth };
}
function wrap(children: ReactNode, f: ReturnType<typeof account>) {
  return <AuthAccountContext.Provider value="account-a"><AuthAccountActionsContext.Provider value={f.auth}><CloudAccountContext.Provider value={f.cloud}>{children}</CloudAccountContext.Provider></AuthAccountActionsContext.Provider></AuthAccountContext.Provider>;
}
async function change(node: TestElement, target: { checked?: boolean; value?: string }) {
  await act(async () => { (testElementProps(node).onChange as (event: unknown) => void)({ target }); });
}
function inputFor(env: ReturnType<typeof phoneTestDom>, label: string) {
  const element = env.find(node => node.tagName === "LABEL" && node.textContent.startsWith(label));
  return findTestElement(element, node => node.tagName === "INPUT")!;
}
const entry = (overrides: Partial<ComponentProps<typeof CloudCampaignEntry>> = {}) => <CloudCampaignEntry onOpen={async () => {}} onLocalCampaign={() => {}} onCreate={() => {}} onLocalOnly={() => {}} {...overrides} />;
describe("account entry and explicit import UI shared by both layouts", () => {
  it.each(["desktop", "phone"])("%s entry offers decline with no upload and an explicit source checkbox", async layout => {
    const env = phoneTestDom(), f = account(), source = await syncFixture();
    env.browser.location.search = `?layout=${layout}`;
    const raw = JSON.stringify({ schemaVersion: 2, campaigns: [{ ...source.prepared.envelope.campaign, name: "Synthetic clinic", serializedState: source.prepared.sourceRecovery.text }] }) + "\n";
    const key = "gamify-surgery.prototype.profile.v1.account.account-a";
    Object.assign(env.browser.localStorage, { getItem: (name: string) => name === key ? raw : null });
    const later = vi.fn(); await env.render(wrap(entry({ onLocalOnly: later }), f));
    await vi.waitFor(async () => { await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); }); expect(env.element.textContent).toContain("Copy Synthetic clinic to my account"); });
    expect(f.server.operationCount("account-a")).toBe(0);
    await env.click("Use this device only"); expect(later).toHaveBeenCalledOnce();
    expect((env.browser.localStorage as unknown as Storage).getItem(key)).toBe(raw);
    await change(inputFor(env, "Copy Synthetic clinic to my account"), { checked: true });
    await env.click("Copy selected local campaigns to my account");
    await vi.waitFor(async () => { await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); }); expect(env.element.textContent).toContain("Copied and verified in your account"); });
    expect(f.server.operationCount("account-a")).toBe(1); expect((env.browser.localStorage as unknown as Storage).getItem(key)).toBe(raw);
  });
  it("requires a separate claim before copying an offered unowned campaign", async () => {
    const env = phoneTestDom(), f = account(), source = await syncFixture();
    const raw = JSON.stringify({ schemaVersion: 2, campaigns: [{ ...source.prepared.envelope.campaign, name: "Synthetic clinic", serializedState: source.prepared.sourceRecovery.text }] });
    Object.assign(env.browser.localStorage, { getItem: (key: string) => key === "gamify-surgery.prototype.profile.v1" ? raw : null });
    await env.render(wrap(entry(), f));
    expect(env.element.textContent).not.toContain("Unowned source");
    await change(inputFor(env, "Inspect unowned legacy"), { checked: true });
    await vi.waitFor(async () => { await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); }); expect(env.element.textContent).toContain("Unowned source"); });
    await change(inputFor(env, "Copy Synthetic clinic to my account"), { checked: true });
    expect(env.button("Copy selected local campaigns to my account").attributes.disabled).toBeDefined();
    await change(inputFor(env, "Copy these unowned campaigns to a@example.invalid"), { checked: true });
    expect(env.button("Copy selected local campaigns to my account").attributes.disabled).toBeUndefined();
    expect(f.server.operationCount("account-a")).toBe(0);
  });
  it("labels two slots and archives clearly, and leaves creation disabled at the limit", async () => {
    const env = phoneTestDom(), f = account();
    f.cloud.summaries = ["First", "Archived"].map((name, index) => ({ name, status: index ? "archived" : "resumable", campaignId: name, revision: "1", writerGeneration: "1", writerActive: false, serverNowMs: Date.now(), acceptedAtMs: Date.now() }));
    await env.render(wrap(entry(), f));
    expect(env.element.textContent).toContain("Account campaigns (2/2)"); expect(env.element.textContent).toContain("Archived — still uses a slot");
    expect(env.button("Create account campaign").attributes.disabled).toBeDefined();
    expect(env.element.textContent).toContain("Extra campaigns stay on this device");
  });
  it("keeps notice acceptance unavailable until the service region is published", async () => {
    const env = phoneTestDom(), f = account(); f.cloud.access!.noticeAccepted = false; f.cloud.runtime.region = "";
    await env.render(wrap(entry(), f));
    expect(env.element.textContent).toContain("beta2.cloud.v1"); expect(env.element.textContent).toContain("full functional clinic");
    expect(env.button("Accept cloud save notice").attributes.disabled).toBeDefined();
    expect(f.cloud.acceptNotice).not.toHaveBeenCalled();
  });
});
describe("shared cloud account privacy and sign-out UI", () => {
  it("defaults sign-out to retaining scoped recovery and makes no deletion request", async () => {
    const env = phoneTestDom(), f = account(); await env.render(wrap(<AccountMenu />, f));
    expect(env.element.textContent).toContain("On a shared device"); expect(env.element.textContent).toContain("keeps this account's recovery copy");
    await env.click("Sign out"); expect(f.cloud.stop).toHaveBeenCalledOnce(); expect(f.auth.signOut).toHaveBeenCalledOnce();
    expect(f.cloud.clearDevice).not.toHaveBeenCalled(); expect(f.cloud.requestDeletion).not.toHaveBeenCalled();
  });
  it("requires explicit saved/exported-progress confirmation before clear-this-device sign-out", async () => {
    const env = phoneTestDom(), f = account(); await env.render(wrap(<AccountMenu />, f));
    await change(inputFor(env, "Clear this device when I sign out"), { checked: true });
    expect(env.button("Sign out and clear this device").attributes.disabled).toBeDefined();
    expect(f.cloud.clearDevice).not.toHaveBeenCalled();
    await change(inputFor(env, "I have confirmed my account saves"), { checked: true });
    await env.click("Sign out and clear this device"); expect(f.cloud.clearDevice).toHaveBeenCalledExactlyOnceWith(true);
  });
  it("reports a failed device clear before signing out, with recovery and originals still reviewable", async () => {
    const env = phoneTestDom(), f = account(); f.cloud.clearDevice = vi.fn(async () => { throw new CloudSyncError("storage"); });
    await env.render(wrap(<AccountMenu />, f));
    await change(inputFor(env, "Clear this device when I sign out"), { checked: true });
    await change(inputFor(env, "I have confirmed my account saves"), { checked: true });
    await env.click("Sign out and clear this device");
    expect(f.auth.signOut).not.toHaveBeenCalled(); expect(env.element.textContent).toContain("Clearing this device and signing out could not be confirmed");
  });
  it("uses the full data scope only after its new confirmation and reports failed deletion honestly", async () => {
    const env = phoneTestDom(), f = account(); f.cloud.requestDeletion = vi.fn(async () => { throw new CloudSyncError("network"); });
    await env.render(wrap(<AccountMenu />, f)); await env.click("Delete my data/account");
    expect(f.cloud.requestDeletion).not.toHaveBeenCalled(); expect(env.element.textContent).toContain("all account cloud campaigns, saved revisions and evidence");
    await env.click("Confirm delete all my account data");
    expect(f.cloud.requestDeletion).toHaveBeenCalledOnce(); expect(env.element.textContent).toContain("Deletion is not confirmed");
    expect(f.cloud.clearDevice).not.toHaveBeenCalled();
  });
});
