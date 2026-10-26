import { act, type ReactNode, type ComponentProps } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthAccountActionsContext, AuthAccountContext } from "../auth/AuthAccountContext";
import { allElements, cleanupPhoneTests, phoneFixture, phoneTestDom } from "../mobile/screenTestUtils";
import { AppShell } from "../AppShell";
import MobileShell from "../mobile/MobileShell";
import { COMPETITION_PRIVACY_NOTICE } from "../competition/types";
import { findTestElement, testElementProps, type TestElement } from "../mobile/testDom";
import { CloudAccountContext, type CloudAccountValue } from "../session/cloud/CloudAccount";
import { MemoryCloudCache } from "../session/cloud/cache";
import { MemoryCloudEntryStore } from "../session/cloud/entryStorage";
import { FakeCloudServer } from "../session/cloud/fakeTransport";
import { syncFixture } from "../session/cloud/syncTestSupport";
import { CloudSyncError } from "../session/cloud/transport";
import { AccountMenu } from "./AccountMenu";
import { CloudCampaignEntry } from "./CloudCampaignEntry";

vi.mock("../facility", () => ({ FacilityCanvas: () => <div>Fixture map</div> }));
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
const entry = (overrides: Partial<ComponentProps<typeof CloudCampaignEntry>> = {}) => <CloudCampaignEntry onOpen={async () => {}} onCreate={() => {}} {...overrides} />;
async function localClinics(env: ReturnType<typeof phoneTestDom>, names: string[], unowned = false) {
  const fixtures = await Promise.all(names.map((_, index) => syncFixture(`local.${index}`)));
  const raw = JSON.stringify({ schemaVersion: 2, campaigns: fixtures.map((fixture, index) => ({ ...fixture.prepared.envelope.campaign,
    name: names[index], serializedState: fixture.prepared.sourceRecovery.text })) }) + "\n";
  const key = `gamify-surgery.prototype.profile.v1${unowned ? "" : ".account.account-a"}`;
  Object.assign(env.browser.localStorage, { getItem: (item: string) => item === key ? raw : null });
  return { raw, key, fixtures };
}
async function settle(assertion: () => void) {
  await vi.waitFor(async () => { await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); }); assertion(); });
}
function refreshAccount(f: ReturnType<typeof account>) {
  f.cloud.refresh = vi.fn(async () => { f.cloud.summaries = await f.cloud.runtime.transport.list(); });
}
async function accountCampaigns(f: ReturnType<typeof account>, count: number) {
  for (let index = 0; index < count; index++) {
    const fixture = await syncFixture(`account.${index}`); f.server.seed("account-a", fixture.confirmed);
    f.server.account("account-a").campaigns.get(fixture.confirmed.campaignId)!.summary = { name: `Account ${index + 1}`, status: index ? "archived" : "resumable" };
  }
  f.cloud.summaries = await f.cloud.runtime.transport.list(); refreshAccount(f);
}
describe("automatic account campaign entry shared by both layouts", () => {
  it.each(["desktop", "phone"])("%s: shows the two account choices at 0/2 without device-only play", async layout => {
    const env = phoneTestDom(), f = account(), create = vi.fn(); env.browser.location.search = `?layout=${layout}`;
    await env.render(wrap(entry({ onCreate: create }), f));
    await settle(() => expect(env.button("Start a new campaign").attributes.disabled).toBeUndefined());
    expect(env.find(node => node.tagName === "MAIN").attributes.class).toContain(`cloud-entry--${layout}`);
    expect(env.element.textContent).toContain("Resume a previous campaign (0/2)"); expect(env.element.textContent).toContain("No previous campaigns yet.");
    for (const text of ["On this device", "Save to my account", "Play on this device only", "Refresh account campaigns"]) expect(env.element.textContent).not.toContain(text);
    await env.click("Start a new campaign"); expect(create).toHaveBeenCalledOnce(); expect(f.server.operationCount("account-a")).toBe(0);
  });
  it.each([1, 2])("shows named Resume buttons, levels and times at %s/2 without acquiring writers", async count => {
    const env = phoneTestDom(), f = account(), open = vi.fn(async () => {}); await accountCampaigns(f, count);
    await env.render(wrap(entry({ onOpen: open }), f));
    await settle(() => { expect(env.button("Resume Account 1").attributes.disabled).toBeUndefined(); expect(env.element.textContent).toContain("Level 0"); });
    expect(env.element.textContent).toContain(`Resume a previous campaign (${count}/2)`);
    expect(env.element.textContent).toContain(`Last saved: ${new Date(f.cloud.summaries[0]!.acceptedAtMs).toLocaleString()}`);
    expect(env.button("Resume Account 1").textContent).toBe("Resume");
    expect(f.server.calls.filter(call => ["acquire", "commit", "importCampaign", "deleteCampaign"].includes(call.method))).toHaveLength(0);
    await env.click("Resume Account 1"); expect(open).toHaveBeenCalledExactlyOnceWith("account.0");
    expect(env.button("Start a new campaign").attributes.disabled).toBeUndefined();
  });
  it("waits for presentation and save processing before enabling entry, without taking a writer", async () => {
    const env = phoneTestDom(), f = account(), open = vi.fn(async () => {}); await accountCampaigns(f, 1);
    await env.render(wrap(entry({ onOpen: open, preparing: true }), f));
    await settle(() => expect(env.element.textContent).toContain("Level 0"));
    expect(env.element.textContent).toContain("Getting your campaigns ready…");
    expect(env.button("Resume Account 1").attributes.disabled).toBeDefined();
    expect(env.button("Start a new campaign").attributes.disabled).toBeDefined();
    expect(open).not.toHaveBeenCalled();
    expect(f.server.calls.filter(call => ["acquire", "commit", "importCampaign", "deleteCampaign"].includes(call.method))).toHaveLength(0);
    await env.render(wrap(entry({ onOpen: open, preparing: false }), f));
    expect(env.button("Resume Account 1").attributes.disabled).toBeUndefined();
    expect(env.button("Start a new campaign").attributes.disabled).toBeUndefined();
    await env.click("Resume Account 1"); expect(open).toHaveBeenCalledExactlyOnceWith("account.0");
  });
  it("automatically enrolls own local campaigns up to the free slots and leaves their exact bytes", async () => {
    const env = phoneTestDom(), f = account(), { raw, key } = await localClinics(env, ["First", "Second"]); refreshAccount(f);
    await env.render(wrap(entry(), f));
    await settle(() => expect(env.button("Resume Second").attributes.disabled).toBeUndefined());
    expect(env.element.textContent).toContain("Resume a previous campaign (2/2)"); expect(f.server.operationCount("account-a")).toBe(2);
    expect((env.browser.localStorage as unknown as Storage).getItem(key)).toBe(raw); expect(f.server.usageCount("account-a")).toBe(0);
    expect(allElements(env.element, node => node.attributes["aria-label"] === "Choose account campaigns")).toHaveLength(0);
    expect(f.server.calls.filter(call => call.method === "deleteCampaign")).toHaveLength(0);
  });
  it("waits for the account notice before automatic enrollment", async () => {
    const env = phoneTestDom(), f = account(), { raw, key } = await localClinics(env, ["First"]); f.cloud.access!.noticeAccepted = false;
    await env.render(wrap(entry(), f)); await act(async () => {});
    expect(f.server.operationCount("account-a")).toBe(0); expect(env.button("Start a new campaign").attributes.disabled).toBeDefined();
    const privacy = env.find(node => node.tagName === "DETAILS"); expect(privacy.attributes.open).toBeUndefined(); expect(privacy.textContent).toContain("Accept account save notice");
    f.cloud.acceptNotice = vi.fn(async () => { f.cloud.access!.noticeAccepted = true; await env.render(wrap(entry(), f)); });
    refreshAccount(f);
    await env.click("Accept account save notice");
    await settle(() => expect(env.button("Resume First").attributes.disabled).toBeUndefined());
    expect((env.browser.localStorage as unknown as Storage).getItem(key)).toBe(raw);
  });
  it("offers one over-slots chooser, retains the others hidden, and never repeats it on this device", async () => {
    const env = phoneTestDom(), f = account(), { raw, key } = await localClinics(env, ["First", "Second", "Third"]); refreshAccount(f);
    await env.render(wrap(entry(), f));
    await settle(() => expect(env.element.textContent).toContain("Your account holds two campaigns. Choose which to keep in your account."));
    expect(f.server.operationCount("account-a")).toBe(0);
    await change(inputFor(env, "First"), { checked: true }); await change(inputFor(env, "Third"), { checked: true });
    expect(inputFor(env, "Second").attributes.disabled).toBeDefined();
    await env.click("Keep selected campaigns"); await settle(() => expect(env.button("Resume Third").attributes.disabled).toBeUndefined());
    expect([...f.server.account("account-a").campaigns.keys()]).toEqual(["local.0", "local.2"]);
    expect(env.element.textContent).not.toContain("Second"); expect((env.browser.localStorage as unknown as Storage).getItem(key)).toBe(raw);
    await env.render(<p>Closed</p>); await env.render(wrap(entry(), f));
    await settle(() => expect(env.button("Resume First").attributes.disabled).toBeUndefined());
    expect(env.element.textContent).not.toContain("Choose which to keep"); expect(f.server.operationCount("account-a")).toBe(2);
  });
  it("keeps a full account without auto-deleting when this device has additional local campaigns", async () => {
    const env = phoneTestDom(), f = account(); await accountCampaigns(f, 2); const { raw, key } = await localClinics(env, ["Older local"]);
    await env.render(wrap(entry(), f)); await settle(() => expect(env.element.textContent).toContain("Both places are already in use."));
    expect(inputFor(env, "Older local").attributes.disabled).toBeDefined();
    await env.click("Keep selected campaigns"); await settle(() => expect(env.button("Start a new campaign").attributes.disabled).toBeUndefined());
    expect(f.server.account("account-a").campaigns.size).toBe(2); expect(f.server.calls.filter(call => call.method === "deleteCampaign")).toHaveLength(0);
    expect((env.browser.localStorage as unknown as Storage).getItem(key)).toBe(raw);
  });
  it("never enrolls campaigns from before sign-in or another account", async () => {
    const env = phoneTestDom(), f = account(), { raw, key } = await localClinics(env, ["Unowned"], true);
    const getItem = vi.fn((item: string) => item === key || item.endsWith(".account.account-b") ? raw : null); Object.assign(env.browser.localStorage, { getItem });
    await env.render(wrap(entry(), f)); await settle(() => expect(env.button("Start a new campaign").attributes.disabled).toBeUndefined());
    expect(getItem.mock.calls.every(([item]) => !item.includes("account-b") && item !== key)).toBe(true); expect(f.server.operationCount("account-a")).toBe(0);
  });
  it("requires choosing a campaign and its second named confirmation before replacing it", async () => {
    const env = phoneTestDom(), f = account(), create = vi.fn(); await accountCampaigns(f, 2);
    await env.render(wrap(entry({ onCreate: create }), f)); await settle(() => expect(env.button("Start a new campaign").attributes.disabled).toBeUndefined());
    await env.click("Start a new campaign"); expect(env.element.textContent).toContain("You can have two campaigns in your account. Starting a new one replaces one of them, and the replaced campaign is deleted.");
    expect(create).not.toHaveBeenCalled(); expect(f.server.calls.filter(call => call.method === "deleteCampaign")).toHaveLength(0);
    await env.click("Cancel starting a new campaign"); expect(f.server.account("account-a").campaigns.size).toBe(2);
    await env.click("Start a new campaign"); await env.click("Replace Account 1"); expect(env.element.textContent).toContain("Delete Account 1 permanently?");
    expect(f.server.calls.filter(call => call.method === "deleteCampaign")).toHaveLength(0);
    await env.click("Keep Account 1"); expect(f.server.account("account-a").campaigns.size).toBe(2);
    await env.click("Start a new campaign"); await env.click("Replace Account 1"); await env.click("Delete Account 1 permanently");
    await settle(() => expect(create).toHaveBeenCalledOnce());
    expect([...f.server.account("account-a").campaigns.keys()]).toEqual(["account.1"]);
    expect(await f.store.read("retired:account.0")).toEqual({ revision: "1" });
  });
  it("reports an open lease from another device and does not delete or start a replacement", async () => {
    const env = phoneTestDom(), f = account(), create = vi.fn(); await accountCampaigns(f, 2);
    await env.render(wrap(entry({ onCreate: create }), f)); await settle(() => expect(env.button("Start a new campaign").attributes.disabled).toBeUndefined());
    await env.click("Start a new campaign"); await env.click("Replace Account 1");
    await f.cloud.runtime.transport.acquire({ campaignId: "account.0", expectedRevision: "1", operationId: "other-device", takeover: false });
    await env.click("Delete Account 1 permanently"); await settle(() => expect(env.element.textContent).toContain("This campaign is open on another device."));
    expect(f.server.account("account-a").campaigns.size).toBe(2); expect(create).not.toHaveBeenCalled();
    expect(f.server.calls.filter(call => call.method === "release")).toHaveLength(0);
  });
  it("retains the first confirmation's revision when another device saves before deletion", async () => {
    const env = phoneTestDom(), f = account(), create = vi.fn(); await accountCampaigns(f, 2);
    await env.render(wrap(entry({ onCreate: create }), f)); await settle(() => expect(env.button("Start a new campaign").attributes.disabled).toBeUndefined());
    await env.click("Start a new campaign"); await env.click("Replace Account 1"); f.server.account("account-a").campaigns.get("account.0")!.confirmed.revision = "2";
    await env.click("Delete Account 1 permanently"); await settle(() => expect(env.element.textContent).toContain("This campaign has a newer save."));
    expect(create).not.toHaveBeenCalled(); expect(f.server.account("account-a").campaigns.size).toBe(2);
  });
  it("retries a lost delete acknowledgement without deleting twice or creating early", async () => {
    const env = phoneTestDom(), f = account(), create = vi.fn(); await accountCampaigns(f, 2);
    f.server.faults.push({ method: "deleteCampaign", at: "after", error: new CloudSyncError("network") });
    await env.render(wrap(entry({ onCreate: create }), f)); await settle(() => expect(env.button("Start a new campaign").attributes.disabled).toBeUndefined());
    await env.click("Start a new campaign"); await env.click("Replace Account 1"); await env.click("Delete Account 1 permanently");
    await settle(() => expect(env.element.textContent).toContain("Deletion is not confirmed.")); expect(create).not.toHaveBeenCalled();
    expect(f.server.account("account-a").campaigns.size).toBe(1);
    await env.click("Delete Account 1 permanently"); await settle(() => expect(create).toHaveBeenCalledOnce()); expect(f.server.account("account-a").campaigns.size).toBe(1);
  });
  it("retries automatic enrollment with the same immutable import after a lost acknowledgement", async () => {
    const env = phoneTestDom(), f = account(), { raw, key } = await localClinics(env, ["First"]); refreshAccount(f);
    f.server.faults.push({ method: "importCampaign", at: "after", error: new CloudSyncError("network") });
    await env.render(wrap(entry(), f)); await settle(() => expect(env.element.textContent).toContain("Saving to your account is not confirmed."));
    expect(f.server.operationCount("account-a")).toBe(1); await env.click("Try saving my campaigns again");
    await settle(() => expect(env.button("Resume First").attributes.disabled).toBeUndefined());
    expect(f.server.operationCount("account-a")).toBe(1); expect((env.browser.localStorage as unknown as Storage).getItem(key)).toBe(raw);
  });
  it("shows the confirmed first campaign when a later automatic save is rejected", async () => {
    const env = phoneTestDom(), f = account(), { raw, key } = await localClinics(env, ["First", "Second"]); refreshAccount(f);
    f.server.faults.push({ method: "importCampaign", at: "before" }, { method: "importCampaign", at: "before", error: new CloudSyncError("capacity") });
    await env.render(wrap(entry(), f));
    await settle(() => { expect(env.button("Resume First").attributes.disabled).toBeUndefined(); expect(env.element.textContent).toContain("Your account has reached its campaign or storage limit."); });
    expect(f.server.operationCount("account-a")).toBe(1); expect(env.button("Start a new campaign").attributes.disabled).toBeDefined();
    expect((env.browser.localStorage as unknown as Storage).getItem(key)).toBe(raw);
    await env.click("Try saving my campaigns again"); await settle(() => expect(env.button("Resume Second").attributes.disabled).toBeUndefined());
    expect(f.server.operationCount("account-a")).toBe(2);
  });
  it("keeps a corrupt account save available for the existing Resume recovery path", async () => {
    const env = phoneTestDom(), f = account(), open = vi.fn(async () => {}); await accountCampaigns(f, 1);
    const row = f.server.account("account-a").campaigns.get("account.0")!; row.confirmed.snapshot = { ...row.confirmed.snapshot, uncompressedSha256: "0".repeat(64) };
    await env.render(wrap(entry({ onOpen: open }), f)); await settle(() => expect(env.element.textContent).toContain("Level unavailable"));
    await env.click("Resume Account 1"); expect(open).toHaveBeenCalledExactlyOnceWith("account.0");
  });
  it("refreshes automatically and removes its focus listener on close", async () => {
    const env = phoneTestDom(), f = account(); await env.render(wrap(entry(), f)); await settle(() => expect(env.button("Start a new campaign").attributes.disabled).toBeUndefined());
    expect(f.cloud.refresh).toHaveBeenCalledOnce(); await act(async () => { env.browser.dispatchEvent(new Event("focus")); }); expect(f.cloud.refresh).toHaveBeenCalledTimes(2);
    await env.render(<p>Closed</p>); env.browser.dispatchEvent(new Event("focus")); expect(f.cloud.refresh).toHaveBeenCalledTimes(2);
  });
  it.each(["deleted", "deletion-requested"] as const)("does not refresh away %s or start migration", async phase => {
    const env = phoneTestDom(), f = account(); f.cloud.phase = phase; await env.render(wrap(entry(), f));
    await act(async () => { env.browser.dispatchEvent(new Event("focus")); }); expect(f.cloud.refresh).not.toHaveBeenCalled(); expect(f.server.operationCount("account-a")).toBe(0);
  });
  it("keeps account privacy collapsed at the bottom and requires a published region", async () => {
    const env = phoneTestDom(), f = account(); f.cloud.access!.noticeAccepted = false; f.cloud.runtime.region = "";
    await env.render(wrap(entry(), f));
    const privacy = env.find(node => node.tagName === "DETAILS"); expect(privacy.attributes.open).toBeUndefined(); expect(env.find(node => node.tagName === "MAIN").lastChild).toBe(privacy);
    expect(allElements(env.element, node => node.tagName === "SUMMARY" && node.textContent === "Account & privacy")).toHaveLength(1);
    expect(privacy.textContent).toContain(COMPETITION_PRIVACY_NOTICE);
    expect(privacy.textContent).toContain("Campaign storage"); expect(privacy.textContent).toContain("Clear this device when I sign out"); expect(privacy.textContent).toContain("Delete my data/account");
    expect(env.button("Accept account save notice").attributes.disabled).toBeDefined(); expect(f.cloud.acceptNotice).not.toHaveBeenCalled();
  });
});
describe("shared cloud account privacy and sign-out UI", () => {
  it.each(["desktop", "phone"] as const)("keeps one collapsed account disclosure with competition privacy in the %s shell", async layout => {
    const env = phoneTestDom(), f = account(), Shell = layout === "phone" ? MobileShell : AppShell;
    await env.render(wrap(<Shell {...phoneFixture()} />, f));
    if (layout === "phone") await env.click("More");
    const summaries = allElements(env.element, node => node.tagName === "SUMMARY" && node.textContent === "Account & privacy");
    expect(summaries).toHaveLength(1);
    const disclosure = summaries[0]!.parentNode!;
    expect(disclosure.attributes.open).toBeUndefined();
    expect(disclosure.textContent).toContain(COMPETITION_PRIVACY_NOTICE);
    expect(disclosure.textContent).toContain("Delete my data/account");
    expect(disclosure.textContent).toContain("Clear this device when I sign out");
  });
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
