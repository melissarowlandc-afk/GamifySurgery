import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthAccountContext } from "../auth/AuthAccountContext";
import type { PlaytimeTracker } from "../playtime/playtimeTracker";
import { AppShell } from "../AppShell";
import MobileShell from "../mobile/MobileShell";
import { cleanupPhoneTests, phoneFixture, phoneTestDom } from "../mobile/screenTestUtils";
import { testElementProps } from "../mobile/testDom";
import { TesterFeedbackForm } from "./TesterFeedback";
import { APP_BUILD_VERSION, APP_VERSION } from "../appVersion";

const mock = vi.hoisted(() => ({ configured: true, account: "account-a", getClient: vi.fn(), getSession: vi.fn(),
  rpc: vi.fn(), header: vi.fn(), network: vi.fn(), usage: null as PlaytimeTracker | null }));
vi.mock("../auth/prototypeAuth", async original => ({ ...await original<typeof import("../auth/prototypeAuth")>(),
  hostedAuthConfiguration: () => mock.configured ? { supabaseUrl: "https://synthetic.supabase.co", supabaseAnonKey: "synthetic-public" } : null }));
vi.mock("../auth/supabaseAuth", async original => ({ ...await original<typeof import("../auth/supabaseAuth")>(),
  getSupabaseAuthClient: () => { mock.getClient(); return { auth: { getSession: mock.getSession }, rpc: mock.rpc }; } }));
vi.mock("../playtime/UsageProvider", () => ({ useUsageTracking: () => mock.usage }));
vi.mock("../facility", () => ({ FacilityCanvas: () => <div>Map</div> }));
vi.mock("../mobile/map/MobileFacilityMap", () => ({ MobileFacilityMap: () => <div>Phone map</div> }));
vi.mock("react-dom", async original => ({ ...await original<typeof import("react-dom")>(), createPortal: (node: unknown) => node }));

type Harness = ReturnType<typeof phoneTestDom>;
async function comment(env: Harness, value: string) {
  await act(async () => { (testElementProps(env.find(node => node.tagName === "TEXTAREA")).onChange as (event: unknown) => void)({ target: { value } }); });
}
async function send(env: Harness) {
  await act(async () => { (testElementProps(env.find(node => node.tagName === "FORM")).onSubmit as (event: unknown) => void)({ preventDefault() {} }); });
}
async function setup(layout: "desktop" | "phone", account: string | null = "account-a") {
  const env = phoneTestDom();
  vi.stubGlobal("fetch", mock.network);
  const initial = phoneFixture();
  const pause = vi.fn(), answer = vi.fn();
  const props = phoneFixture({ progression: { ...initial.progression, facilityLevelLabel: "Level 4" }, onTogglePause: pause, onSubmitAnswer: answer });
  const render = (level = 4) => env.render(<AuthAccountContext.Provider value={account}>
    {layout === "desktop" ? <AppShell {...props} progression={{ ...props.progression, facilityLevelLabel: `Level ${level}` }} /> :
      <MobileShell {...props} progression={{ ...props.progression, facilityLevelLabel: `Level ${level}` }} />}
  </AuthAccountContext.Provider>);
  await render();
  if (layout === "phone") await env.click("More clinic options");
  return { env, render, pause, answer };
}

beforeEach(() => {
  vi.resetAllMocks(); mock.configured = true; mock.account = "account-a"; mock.usage = null;
  mock.getSession.mockImplementation(async () => ({ data: { session: { user: { id: mock.account }, access_token: "synthetic-account-token" } }, error: null }));
  mock.rpc.mockReturnValue({ setHeader: mock.header });
  mock.header.mockImplementation(async () => ({ data: { id: mock.rpc.mock.calls.at(-1)![1].p_id, created_at: "2026-10-14T00:00:00Z" }, error: null }));
  mock.network.mockImplementation(() => { throw new Error("Unexpected real fetch in feedback test"); });
});
afterEach(async () => { expect(mock.network).not.toHaveBeenCalled(); await cleanupPhoneTests(); });

describe("feedback in both game menus", () => {
  it.each(["desktop", "phone"] as const)("sends a %s comment with automatic context and shows confirmation without game commands", async layout => {
    const { env, pause, answer } = await setup(layout);
    await env.click("Send feedback");
    const textarea = testElementProps(env.find(node => node.tagName === "TEXTAREA"));
    expect(textarea.maxLength).toBe(1000);
    expect(env.element.textContent).toContain("Comments go to the game owner");
    if (layout === "phone") expect(env.find(node => node.attributes["aria-label"] === "Send feedback").attributes.class).toContain("is-bottom");
    await comment(env, "  Please improve the menu.  ");
    expect(env.element.textContent).toContain("28/1000 characters");
    await send(env);
    expect(mock.rpc).toHaveBeenCalledExactlyOnceWith("submit_tester_feedback", {
      p_id: expect.any(String), p_comment: "Please improve the menu.", p_release_version: APP_VERSION,
      p_app_version: APP_BUILD_VERSION, p_level: 4, p_shell: layout });
    expect(mock.header).toHaveBeenCalledWith("Authorization", "Bearer synthetic-account-token");
    expect(env.element.textContent).toContain("Sent - thank you");
    expect(pause).not.toHaveBeenCalled(); expect(answer).not.toHaveBeenCalled();
  });

  it.each(["desktop", "phone"] as const)("preserves failed %s text and reuses the same frozen context/ID on retry", async layout => {
    const { env, render } = await setup(layout);
    mock.header.mockRejectedValueOnce(new TypeError("Synthetic offline"));
    await env.click("Send feedback"); await comment(env, "A retryable comment"); await send(env);
    const first = mock.rpc.mock.calls[0]![1];
    expect(env.element.textContent).toContain("Your text is still here");
    expect(testElementProps(env.find(node => node.tagName === "TEXTAREA")).value).toBe("A retryable comment");
    expect(env.element.textContent).not.toContain("Sent - thank you");
    await render(5); await send(env);
    expect(mock.rpc.mock.calls[1]![1]).toEqual(first);
    expect(env.element.textContent).toContain("Sent - thank you");
  });

  it.each(["desktop", "phone"] as const)("bounds %s comments, disables whitespace-only sends and cancels without uploading", async layout => {
    const { env } = await setup(layout); await env.click("Send feedback");
    expect(env.button("Send").attributes.disabled).toBeDefined();
    await comment(env, " \n "); expect(env.button("Send").attributes.disabled).toBeDefined();
    await send(env); expect(mock.rpc).not.toHaveBeenCalled();
    await comment(env, "é".repeat(1010)); expect(env.element.textContent).toContain("1000/1000");
    await env.click("Cancel"); expect(mock.rpc).not.toHaveBeenCalled();
    expect(env.element.textContent).not.toContain("1000/1000");
  });

  it.each(["desktop", "phone"] as const)("hides %s feedback in a local prototype or without backend configuration", async layout => {
    const { env } = await setup(layout, null);
    expect(env.element.textContent).not.toContain("Send feedback");
    expect(mock.getClient).not.toHaveBeenCalled(); expect(mock.getSession).not.toHaveBeenCalled();
    mock.configured = false;
    const missing = await setup(layout, "account-a");
    expect(missing.env.element.textContent).not.toContain("Send feedback"); expect(mock.getClient).not.toHaveBeenCalled();
    expect(mock.rpc).not.toHaveBeenCalled();
  });

  it("prevents a changed account from sending the previous account's text", async () => {
    const { env } = await setup("desktop"); await env.click("Send feedback"); await comment(env, "Keep under this account");
    mock.account = "account-b"; await send(env);
    expect(mock.rpc).not.toHaveBeenCalled();
    expect(env.element.textContent).toContain("Your text is still here");
  });

  it("suppresses duplicate sends while an acknowledgement is pending", async () => {
    let finish!: (value: unknown) => void;
    mock.header.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
    const { env } = await setup("desktop"); await env.click("Send feedback"); await comment(env, "One submission");
    await send(env); await send(env);
    expect(mock.rpc).toHaveBeenCalledTimes(1);
    expect(testElementProps(env.find(node => node.tagName === "TEXTAREA")).disabled).toBe(true);
    await act(async () => { finish({ data: { id: mock.rpc.mock.calls[0]![1].p_id, created_at: "2026-10-14T00:00:00Z" }, error: null }); });
    expect(env.element.textContent).toContain("Sent - thank you");
  });

  it("stops feedback immediately after a pending deletion request", async () => {
    mock.usage = { status: () => ({ state: "blocked" }), subscribe: () => () => {} } as unknown as PlaytimeTracker;
    const transport = { send: vi.fn() }; const env = phoneTestDom();
    await env.render(<TesterFeedbackForm transport={transport} level={2} shell="desktop" onCancel={() => {}} />);
    await comment(env, "Comment"); await send(env);
    expect(env.element.textContent).toContain("Feedback is off for this account");
    expect(transport.send).not.toHaveBeenCalled();
  });

  it("honors the persisted deletion marker even when a later access refresh is unavailable", async () => {
    mock.usage = { status: () => ({ state: "unavailable" }), outbox: { deletionRequested: () => true },
      subscribe: () => () => {} } as unknown as PlaytimeTracker;
    const transport = { send: vi.fn() }; const env = phoneTestDom();
    await env.render(<TesterFeedbackForm transport={transport} level={2} shell="phone" onCancel={() => {}} />);
    await comment(env, "Keep deletion stopped"); await send(env);
    expect(env.button("Send").attributes.disabled).toBeDefined();
    expect(transport.send).not.toHaveBeenCalled();
  });
});
