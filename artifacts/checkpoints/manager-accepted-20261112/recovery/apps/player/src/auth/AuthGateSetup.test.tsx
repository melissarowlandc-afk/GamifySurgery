import { act, StrictMode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthGate } from "./AuthGate";
import { isInvitedVerifiedUser } from "./supabaseAuth";
import { cleanupPhoneTests, phoneTestDom } from "../mobile/screenTestUtils";
import { allElements } from "../mobile/screenTestUtils";
import { testElementProps } from "../mobile/testDom";

const mock = vi.hoisted(() => ({
  claim: vi.fn(), client: vi.fn(), signIn: vi.fn(), network: vi.fn(), getSession: vi.fn(), getUser: vi.fn(),
  configuration: true,
}));
vi.mock("./prototypeAuth", async original => ({
  ...await original<typeof import("./prototypeAuth")>(),
  hostedAuthConfiguration: () => mock.configuration ? { supabaseUrl: "https://synthetic.supabase.co", supabaseAnonKey: "synthetic-public-key" } : null,
  loadPrototypeAccessSession: () => null, localPrototypeBypassEnabled: () => false,
}));
vi.mock("./setupLink", async original => ({ ...await original<typeof import("./setupLink")>(), claimPersonalSetupLink: mock.claim }));
vi.mock("./supabaseAuth", async original => ({
  ...await original<typeof import("./supabaseAuth")>(),
  getSupabaseAuthClient: () => mock.client(),
}));
const user = { id: "account-setup", email: "tester@example.org", email_confirmed_at: "2026-10-14T00:00:00Z",
  app_metadata: { gamify_setup_admitted: true }, user_metadata: {}, aud: "authenticated", created_at: "2026-10-14T00:00:00Z" } as User;
const session = { user, access_token: "synthetic-session", refresh_token: "synthetic-refresh", expires_in: 3600, token_type: "bearer" } as Session;
const code = "c".repeat(43);
async function setup(layout = "desktop", fragment = `#setup=${code}&email=tester%40example.org`, strict = false, stored = new Map<string, string>()) {
  const env = phoneTestDom();
  Object.assign(env.browser.location, new URL(`https://melissarowlandc-afk.github.io/GamifySurgery/?layout=${layout}${fragment}`));
  // URL getters are not enumerable; assign the fields used by the auth helpers.
  const location = new URL(`https://melissarowlandc-afk.github.io/GamifySurgery/?layout=${layout}${fragment}`);
  Object.assign(env.browser.location, { href: location.href, origin: location.origin, search: location.search, hash: location.hash });
  const replaceState = vi.fn((_state: unknown, _title: string, value: string) => {
    const next = new URL(value, location);
    Object.assign(env.browser.location, { href: next.href, hash: next.hash, search: next.search });
  });
  Object.assign(env.browser.history, { replaceState });
  Object.assign(env.browser.localStorage, { getItem: (key: string) => stored.get(key) ?? null,
    setItem: (key: string, value: string) => stored.set(key, value), removeItem: (key: string) => stored.delete(key) });
  vi.stubGlobal("fetch", mock.network);
  const gate = <AuthGate><p>Clinic</p></AuthGate>;
  await env.render(strict ? <StrictMode>{gate}</StrictMode> : gate);
  return { ...env, replaceState };
}
type Harness = Awaited<ReturnType<typeof setup>>;
async function passwords(env: Harness, first = "eight888", second = first) {
  const nodes = allElements(env.element, node => node.tagName === "INPUT" && testElementProps(node).type === "password");
  await act(async () => {
    for (const [index, value] of [first, second].entries()) (testElementProps(nodes[index]!).onChange as (event: unknown) => void)({ target: { value } });
  });
}
async function submit(env: Harness) {
  await act(async () => {
    await (testElementProps(env.find(node => node.tagName === "FORM")).onSubmit as (event: unknown) => Promise<void>)({ preventDefault() {} });
  });
}
beforeEach(() => {
  vi.resetAllMocks(); mock.configuration = true;
  mock.claim.mockResolvedValue("ok");
  mock.signIn.mockResolvedValue({ data: { session }, error: null });
  // Setup-link tests without a restored session continue into the form after
  // the ordinary session check completes.
  mock.getSession.mockResolvedValue({ data: { session: null }, error: null });
  mock.getUser.mockResolvedValue({ data: { user }, error: null });
  mock.client.mockReturnValue({ auth: { getSession: mock.getSession, getUser: mock.getUser, signInWithPassword: mock.signIn,
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: vi.fn() } } }) } });
});
afterEach(async () => { expect(mock.network).not.toHaveBeenCalled(); await cleanupPhoneTests(); });

describe("scanner-safe personal setup in the shared gate", () => {
  it.each(["desktop", "phone"])("shows only a form on %s, scrubs immediately and waits for explicit matching-password submission", async layout => {
    const env = await setup(layout);
    expect(env.element.textContent).toContain("Set up your account");
    expect(env.element.textContent).not.toContain("Clinic");
    expect(env.replaceState).toHaveBeenCalledWith(null, "", `/GamifySurgery/?layout=${layout}`);
    expect((env.browser.location as { hash?: string }).hash).toBe("");
    expect(mock.client).toHaveBeenCalled(); expect(mock.getSession).toHaveBeenCalled(); expect(mock.claim).not.toHaveBeenCalled();
    const email = testElementProps(env.find(node => node.tagName === "INPUT" && testElementProps(node).type === "email"));
    expect(email).toMatchObject({ value: "tester@example.org", readOnly: true });
    await passwords(env, "short"); await submit(env); expect(mock.claim).not.toHaveBeenCalled();
    expect(env.element.textContent).toContain("8–128 characters");
    await passwords(env, "eight888", "different"); await submit(env); expect(mock.claim).not.toHaveBeenCalled();
    expect(env.element.textContent).toContain("do not match");
    await passwords(env); await submit(env);
    expect(mock.claim).toHaveBeenCalledExactlyOnceWith(expect.anything(), { email: "tester@example.org", code, invalid: false }, "eight888");
    expect(mock.signIn).toHaveBeenCalledExactlyOnceWith({ email: "tester@example.org", password: "eight888" });
    expect(env.element.textContent).toContain("Sign In");
  });
  it("preserves the captured setup form under StrictMode's repeated initializers", async () => {
    const env = await setup("phone", undefined, true);
    expect(env.element.textContent).toContain("Set up your account"); expect(mock.getSession).toHaveBeenCalled();
    await passwords(env); await submit(env); expect(mock.claim).toHaveBeenCalledTimes(1);
  });
  it("offers Set new password for resets using the same private code claim", async () => {
    const env = await setup(); await env.click("I'm resetting my password");
    expect(env.button("Set new password")).toBeDefined(); await passwords(env); await submit(env);
    expect(mock.claim).toHaveBeenCalledTimes(1); expect(env.element.textContent).toContain("Sign In");
  });
  it.each([["used_link", "This link has already been used — sign in, or ask the person who invited you for a new link."],
    ["invalid_link", "The link is invalid or was cancelled."]])("shows clear %s text without initializing Auth", async (result, message) => {
    mock.claim.mockResolvedValue(result); const env = await setup(); await passwords(env); await submit(env);
    expect(env.element.textContent).toContain(message);
    await submit(env); expect(mock.claim).toHaveBeenCalledTimes(1);
    await env.click("Return to sign in"); expect(env.element.textContent).not.toContain("Set up your account");
  });
  it("never posts a malformed setup link", async () => {
    const env = await setup("desktop", "#setup=bad&email=tester@example.org");
    expect(env.element.textContent).toContain("The link is invalid or was cancelled.");
    await passwords(env); await submit(env); expect(mock.claim).not.toHaveBeenCalled();
  });
  it("preserves the form after an unavailable claim without printing provider details", async () => {
    mock.claim.mockResolvedValue("unavailable"); const env = await setup(); await passwords(env); await submit(env);
    expect(env.element.textContent).toContain("Setup could not be confirmed");
    expect(testElementProps(env.find(node => node.tagName === "INPUT" && testElementProps(node).type === "password")).value).toBe("eight888");
  });
  it("retries sign-in after a successful claim without consuming the link again", async () => {
    mock.signIn.mockResolvedValueOnce({ data: { session: null }, error: { message: "private provider details" } });
    const env = await setup(); await passwords(env); await submit(env);
    expect(env.element.textContent).toContain("Your password was saved"); expect(env.element.textContent).not.toContain("private provider details");
    await submit(env); expect(mock.claim).toHaveBeenCalledTimes(1); expect(mock.signIn).toHaveBeenCalledTimes(2); expect(env.element.textContent).toContain("Sign In");
  });
  it("clears an unfinished legacy provider password flow after successful personal setup", async () => {
    const key = "gamify-surgery.auth.password-flow.v1.account-setup";
    const stored = new Map([[key, "invite"]]);
    const env = await setup("phone", undefined, false, stored); await passwords(env); await submit(env);
    expect(stored.has(key)).toBe(false); expect(env.element.textContent).toContain("Sign In");
    expect(env.element.textContent).not.toContain("Set Your Password");
  });
  it("submits once when two submit events arrive before React disables the button", async () => {
    let finish!: (value: string) => void;
    mock.claim.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
    const env = await setup(); await passwords(env);
    await act(async () => {
      const onSubmit = testElementProps(env.find(node => node.tagName === "FORM")).onSubmit as (event: unknown) => Promise<void>;
      const first = onSubmit({ preventDefault() {} });
      const second = onSubmit({ preventDefault() {} });
      expect(mock.claim).toHaveBeenCalledTimes(1);
      finish("ok"); await Promise.all([first, second]);
    });
    expect(mock.signIn).toHaveBeenCalledTimes(1); expect(env.element.textContent).toContain("Sign In");
  });
  it("accepts only the server-owned boolean setup marker, never user metadata or an unconfirmed user", () => {
    expect(isInvitedVerifiedUser(user)).toBe(true);
    expect(isInvitedVerifiedUser({ ...user, app_metadata: {}, user_metadata: { gamify_setup_admitted: true } })).toBe(false);
    expect(isInvitedVerifiedUser({ ...user, app_metadata: { gamify_setup_admitted: "true" } })).toBe(false);
    expect(isInvitedVerifiedUser({ ...user, app_metadata: { gamify_setup_pending: true } })).toBe(false);
    expect(isInvitedVerifiedUser({ ...user, email_confirmed_at: undefined })).toBe(false);
  });
});
