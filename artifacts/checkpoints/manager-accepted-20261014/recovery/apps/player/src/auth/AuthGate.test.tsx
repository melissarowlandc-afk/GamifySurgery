import { act, useEffect } from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthGate } from "./AuthGate";
import { useAuthAccountId } from "./AuthAccountContext";
import { createLocalPrototypeSession } from "./prototypeAuth";
import { cleanupPhoneTests, phoneTestDom } from "../mobile/screenTestUtils";
import { testElementProps } from "../mobile/testDom";

const mock = vi.hoisted(() => ({
  configured: true, bypass: false, local: null as ReturnType<typeof createLocalPrototypeSession> | null,
  listener: null as ((event: AuthChangeEvent, session: Session | null) => void) | null,
  getSession: vi.fn(), getUser: vi.fn(), signIn: vi.fn(), update: vi.fn(), recover: vi.fn(), signOut: vi.fn(),
  unsubscribe: vi.fn(), network: vi.fn(), mounts: vi.fn(), cleanups: vi.fn(),
}));

vi.mock("./prototypeAuth", async importOriginal => ({
  ...await importOriginal<typeof import("./prototypeAuth")>(),
  hostedAuthConfiguration: () => mock.configured ? { supabaseUrl: "https://synthetic.supabase.co", supabaseAnonKey: "synthetic-public-key" } : null,
  localPrototypeBypassEnabled: () => mock.bypass,
  loadPrototypeAccessSession: () => mock.local,
}));
vi.mock("./supabaseAuth", async importOriginal => ({
  ...await importOriginal<typeof import("./supabaseAuth")>(),
  getSupabaseAuthClient: () => mock.configured ? { auth: {
    getSession: mock.getSession, getUser: mock.getUser, signInWithPassword: mock.signIn,
    updateUser: mock.update, resetPasswordForEmail: mock.recover, signOut: mock.signOut,
    onAuthStateChange: (listener: typeof mock.listener) => {
      mock.listener = listener;
      return { data: { subscription: { unsubscribe: mock.unsubscribe } } };
    },
  } } : null,
}));

function session(id = "account-a"): Session {
  return {
    access_token: `synthetic-${id}`, refresh_token: "synthetic-refresh", expires_in: 3600, token_type: "bearer",
    user: { id, aud: "authenticated", created_at: "2026-10-13T00:00:00Z", email: `${id}@example.invalid`,
      email_confirmed_at: "2026-10-13T00:00:00Z", invited_at: "2026-10-13T00:00:00Z",
      app_metadata: {}, user_metadata: {} },
  };
}
function Clinic() {
  const accountId = useAuthAccountId();
  useEffect(() => { mock.mounts(accountId); return () => { mock.cleanups(accountId); }; }, [accountId]);
  return <p data-clinic={accountId ?? "local"}>Clinic {accountId ?? "local"}</p>;
}

type Harness = ReturnType<typeof phoneTestDom>;
async function input(env: Harness, type: string, value: string) {
  await act(async () => {
    const node = env.find(element => element.tagName === "INPUT" && testElementProps(element).type === type);
    (testElementProps(node).onChange as (event: unknown) => void)({ target: { value } });
  });
}
async function submit(env: Harness) {
  await act(async () => {
    await (testElementProps(env.find(node => node.tagName === "FORM")).onSubmit as (event: unknown) => Promise<void>)({ preventDefault() {} });
  });
}
async function emit(event: AuthChangeEvent, value: Session | null) {
  await act(async () => { mock.listener!(event, value); });
}
async function setup(hash = "", layout = "desktop", stored = new Map<string, string>()) {
  const env = phoneTestDom();
  Object.assign(env.browser.location, { origin: "https://melissarowlandc-afk.github.io", hash, search: `?layout=${layout}` });
  Object.assign(env.browser.localStorage, {
    getItem: (key: string) => stored.get(key) ?? null,
    setItem: (key: string, value: string) => stored.set(key, value),
    removeItem: (key: string) => stored.delete(key),
  });
  vi.stubGlobal("fetch", mock.network);
  await env.render(<AuthGate><Clinic /></AuthGate>);
  return env;
}

beforeEach(() => {
  vi.resetAllMocks();
  mock.configured = true; mock.bypass = false; mock.local = null; mock.listener = null;
  mock.getSession.mockResolvedValue({ data: { session: null }, error: null });
  mock.getUser.mockImplementation(async (token: string) => ({ data: { user: session(token.replace("synthetic-", "")).user }, error: null }));
  mock.signIn.mockResolvedValue({ data: { session: session() }, error: null });
  mock.update.mockResolvedValue({ data: { user: session().user }, error: null });
  mock.recover.mockResolvedValue({ error: null }); mock.signOut.mockResolvedValue({ error: null });
  mock.network.mockImplementation(() => { throw new Error("Unexpected network during mocked auth test"); });
  vi.stubEnv("BASE_URL", "/GamifySurgery/");
});
afterEach(async () => {
  expect(mock.network).not.toHaveBeenCalled();
  await cleanupPhoneTests(); vi.unstubAllEnvs();
});

describe("invite-only shared auth gate", () => {
  it.each(["desktop", "phone"])("accepts an invitation and sets a 15+ character password before mounting %s play", async layout => {
    mock.getSession.mockResolvedValue({ data: { session: session() }, error: null });
    const env = await setup("#type=invite&access_token=synthetic", layout);
    expect(env.element.textContent).toContain("Set Your Password");
    expect(mock.mounts).not.toHaveBeenCalled();
    await input(env, "password", "short"); await submit(env);
    expect(mock.update).not.toHaveBeenCalled();
    expect(env.element.textContent).toContain("at least 15 characters");
    await input(env, "password", "a long synthetic passphrase"); await submit(env);
    expect(mock.update).toHaveBeenCalledWith({ password: "a long synthetic passphrase" });
    expect(mock.mounts).toHaveBeenCalledExactlyOnceWith("account-a");
    expect(env.element.textContent).toContain("Sign out");
  });

  it("keeps unfinished invitation setup across a reload after the URL is consumed", async () => {
    const stored = new Map<string, string>();
    mock.getSession.mockResolvedValue({ data: { session: session() }, error: null });
    const first = await setup("#type=invite", "phone", stored);
    await act(async () => first.root.unmount());
    const reload = await setup("", "phone", stored);
    expect(reload.element.textContent).toContain("Set Your Password");
    expect(mock.mounts).not.toHaveBeenCalled();
  });

  it("renders reset after PASSWORD_RECOVERY even for an already verified remembered session", async () => {
    const remembered = session();
    mock.getSession.mockResolvedValue({ data: { session: remembered }, error: null });
    const env = await setup();
    expect(env.element.textContent).toContain("Clinic account-a");
    await emit("PASSWORD_RECOVERY", remembered);
    expect(env.element.textContent).toContain("Choose New Password");
    expect(env.element.textContent).not.toContain("Clinic account-a");
    await input(env, "password", "another synthetic passphrase"); await submit(env);
    expect(env.element.textContent).toContain("Clinic account-a");
  });

  it("detects a direct recovery callback before session initialization", async () => {
    mock.getSession.mockResolvedValue({ data: { session: session() }, error: null });
    const env = await setup("#type=recovery&access_token=synthetic", "phone");
    expect(env.element.textContent).toContain("Choose New Password");
    expect(mock.mounts).not.toHaveBeenCalled();
  });

  it("has no sign-up action and gives recovery the canonical Pages root redirect", async () => {
    const env = await setup();
    expect(env.element.textContent).not.toContain("Create invited account");
    expect(env.element.textContent).toContain("Cloud saves come in Beta 2");
    await env.click("Forgot password?"); await input(env, "email", " tester@example.invalid "); await submit(env);
    expect(mock.recover).toHaveBeenCalledExactlyOnceWith("tester@example.invalid", {
      redirectTo: "https://melissarowlandc-afk.github.io/GamifySurgery/",
    });
    expect(env.element.textContent).toContain("If that invited account exists");
  });

  it("signs in, signs out, then remounts under another account without retaining the first clinic", async () => {
    const env = await setup();
    await input(env, "email", "account-a@example.invalid"); await input(env, "password", "synthetic sign-in passphrase"); await submit(env);
    expect(mock.signIn).toHaveBeenCalledWith({ email: "account-a@example.invalid", password: "synthetic sign-in passphrase" });
    await env.click("Sign out");
    expect(mock.signOut).toHaveBeenCalledWith({ scope: "local" });
    expect(env.element.textContent).not.toContain("Clinic account-a");
    mock.signIn.mockResolvedValue({ data: { session: session("account-b") }, error: null });
    await input(env, "password", "synthetic sign-in passphrase"); await submit(env);
    expect(env.element.textContent).toContain("Clinic account-b");
    expect(mock.mounts.mock.calls).toEqual([["account-a"], ["account-b"]]);
    expect(mock.cleanups).toHaveBeenCalledWith("account-a");
  });

  it("refreshes the same account without remounting its clinic", async () => {
    mock.getSession.mockResolvedValue({ data: { session: session() }, error: null });
    const env = await setup();
    await emit("TOKEN_REFRESHED", session());
    expect(env.element.textContent).toContain("Clinic account-a");
    expect(mock.mounts).toHaveBeenCalledTimes(1); expect(mock.cleanups).not.toHaveBeenCalled();
  });

  it.each([null, ""])("denies an unconfirmed server user (%s) even if the remembered session looks verified", async confirmed => {
    mock.getSession.mockResolvedValue({ data: { session: session() }, error: null });
    mock.getUser.mockResolvedValue({ data: { user: { ...session().user, email_confirmed_at: confirmed } }, error: null });
    const env = await setup();
    expect(mock.mounts).not.toHaveBeenCalled(); expect(env.element.textContent).toContain("could not be verified");
  });

  it("denies a noninvited user and a mismatched server identity", async () => {
    mock.getSession.mockResolvedValue({ data: { session: session() }, error: null });
    mock.getUser.mockResolvedValue({ data: { user: { ...session().user, invited_at: undefined } as User }, error: null });
    const env = await setup(); expect(mock.mounts).not.toHaveBeenCalled();
    mock.getUser.mockResolvedValue({ data: { user: session("other").user }, error: null });
    await emit("SIGNED_IN", session());
    expect(mock.mounts).not.toHaveBeenCalled(); expect(env.element.textContent).toContain("could not be verified");
  });

  it("denies an expired/revoked session rather than trusting browser persistence", async () => {
    mock.getSession.mockResolvedValue({ data: { session: session() }, error: null });
    mock.getUser.mockResolvedValue({ data: { user: null }, error: { status: 401 } });
    const env = await setup(); expect(mock.mounts).not.toHaveBeenCalled();
    expect(env.element.textContent).toContain("Sign in again");
  });

  it("does not let a late remembered-session response undo sign-out", async () => {
    let resolve!: (value: unknown) => void;
    mock.getSession.mockImplementation(() => new Promise(done => { resolve = done; }));
    const env = await setup();
    await emit("SIGNED_OUT", null);
    await act(async () => { resolve({ data: { session: session() }, error: null }); });
    expect(mock.mounts).not.toHaveBeenCalled(); expect(env.element.textContent).toContain("Sign In");
  });

  it("shows safe sign-in, rate-limit, password and sign-out errors without raw provider output", async () => {
    const env = await setup();
    mock.signIn.mockRejectedValue(new Error("private provider details"));
    await input(env, "password", "synthetic sign-in passphrase"); await submit(env);
    expect(env.element.textContent).toContain("Sign-in could not be completed");
    await env.click("Forgot password?");
    mock.recover.mockResolvedValue({ error: { status: 429, message: "private provider details" } }); await submit(env);
    expect(env.element.textContent).toContain("Wait a few minutes");
    await emit("PASSWORD_RECOVERY", session());
    mock.update.mockResolvedValue({ error: { code: "weak_password", message: "private provider details" } });
    await input(env, "password", "synthetic sign-in passphrase"); await submit(env);
    expect(env.element.textContent).toContain("less common password");
    mock.update.mockResolvedValue({ error: null }); await submit(env);
    mock.signOut.mockRejectedValue(new Error("private provider details")); await env.click("Sign out");
    expect(env.element.textContent).toContain("contact the owner");
    expect(env.element.textContent).not.toContain("private provider details");
  });

  it("blocks an expired link even if an older account session is remembered", async () => {
    mock.getSession.mockResolvedValue({ data: { session: session() }, error: null });
    const env = await setup("#error=access_denied&error_code=otp_expired&error_description=private");
    expect(env.element.textContent).toContain("invalid or has expired"); expect(mock.mounts).not.toHaveBeenCalled();
    expect(env.element.textContent).not.toContain("private");
  });

  it("reports an invitation callback with no session when the provider initializes via its auth event", async () => {
    mock.getSession.mockImplementation(() => new Promise(() => {}));
    const env = await setup("#type=invite");
    await emit("INITIAL_SESSION", null);
    expect(env.element.textContent).toContain("invalid or has expired");
    expect(mock.mounts).not.toHaveBeenCalled();
  });

  it("retains the unconfigured local entry and its remembered prototype access", async () => {
    mock.configured = false; mock.bypass = true;
    const env = await setup(); await env.click("Enter Local Prototype");
    expect(env.element.textContent).toContain("Clinic local"); expect(mock.getSession).not.toHaveBeenCalled();
  });

  it("fails closed on a remembered prototype flag when local bypass is disabled", async () => {
    mock.configured = false; mock.local = createLocalPrototypeSession();
    const env = await setup(); expect(mock.mounts).not.toHaveBeenCalled();
    expect(env.element.textContent).toContain("Local bypass is disabled");
  });
});
