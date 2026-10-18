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
  Object.assign(env.browser.location, { origin: "https://melissarowlandc-afk.github.io", hash, search: `?layout=${layout}`,
    href: `https://melissarowlandc-afk.github.io/GamifySurgery/?layout=${layout}${hash}` });
  Object.assign(env.browser.history, { replaceState: (_state: unknown, _title: string, next: string) => {
    const url = new URL(next, "https://melissarowlandc-afk.github.io");
    Object.assign(env.browser.location, { href: url.href, hash: url.hash, search: url.search });
  } });
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
  it.each([
    ["same email", "account-a@example.invalid", true],
    ["different email", "other@example.invalid", false],
  ])("handles a setup link with a restored session (%s)", async (_label, email, admitted) => {
    const remembered = session();
    mock.getSession.mockResolvedValue({ data: { session: remembered }, error: null });
    const hash = `#setup=${"s".repeat(43)}&email=${encodeURIComponent(email)}`;
    const env = await setup(hash);
    expect((env.browser.location as { hash?: string }).hash).toBe("");
    expect(mock.network).not.toHaveBeenCalled();
    if (admitted) {
      expect(env.element.textContent).toContain("Clinic account-a");
      expect(env.element.textContent).not.toContain("Set up your account");
      expect(mock.mounts).toHaveBeenCalledExactlyOnceWith("account-a");
    } else {
      expect(env.element.textContent).toContain("Set up your account");
      expect(mock.mounts).not.toHaveBeenCalled();
    }
  });

  it("shows setup form without a session and scrubs its fragment", async () => {
    const hash = `#setup=${"s".repeat(43)}&email=account-a%40example.invalid`;
    const env = await setup(hash);
    expect((env.browser.location as { hash?: string }).hash).toBe("");
    expect(env.element.textContent).toContain("Set up your account");
    expect(mock.mounts).not.toHaveBeenCalled();
    expect(mock.network).not.toHaveBeenCalled();
  });

  it.each(["desktop", "phone"])("accepts an invitation and sets an 8-character password before mounting %s play", async layout => {
    mock.getSession.mockResolvedValue({ data: { session: session() }, error: null });
    const env = await setup("#type=invite&access_token=synthetic", layout);
    expect(env.element.textContent).toContain("Set Your Password");
    expect(mock.mounts).not.toHaveBeenCalled();
    const passwordProps = testElementProps(env.find(node => node.tagName === "INPUT" && testElementProps(node).type === "password"));
    expect(passwordProps).toMatchObject({ minLength: 8, maxLength: 128, autoComplete: "new-password" });
    await input(env, "password", "seven77"); await submit(env);
    expect(mock.update).not.toHaveBeenCalled();
    expect(env.element.textContent).toContain("at least 8 characters");
    await input(env, "password", "eight888"); await submit(env);
    expect(mock.update).toHaveBeenCalledWith({ password: "eight888" });
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

  it.each(["desktop", "phone"])("finishes a direct recovery callback on the Pages base before mounting %s play", async layout => {
    mock.getSession.mockResolvedValue({ data: { session: session() }, error: null });
    const env = await setup("#type=recovery&access_token=synthetic", layout);
    const replaceState = vi.spyOn(env.browser.history, "replaceState");
    expect(env.element.textContent).toContain("Choose New Password");
    expect(mock.mounts).not.toHaveBeenCalled();
    await input(env, "password", "seven77"); await submit(env);
    expect(mock.update).not.toHaveBeenCalled();
    await input(env, "password", "eight888"); await submit(env);
    expect(mock.update).toHaveBeenCalledExactlyOnceWith({ password: "eight888" });
    expect(replaceState).toHaveBeenCalledWith(null, "", `/GamifySurgery/?layout=${layout}`);
    expect(env.element.textContent).toContain("Clinic account-a");
  });

  it.each(["desktop", "phone"])("gives manual reset instructions on %s sign-in without sending email", async layout => {
    const env = await setup("", layout);
    expect(env.element.textContent).not.toContain("Create invited account");
    expect(env.element.textContent).toContain("Cloud saves come in Beta 2");
    await env.click("Forgot password?");
    expect(env.element.textContent).toContain("Contact the person who invited you");
    expect(env.element.textContent).toContain("email you a password-reset link");
    expect(env.element.textContent).not.toContain("Send recovery email");
    expect(env.element.textContent).toContain("Sign In");
    expect(mock.recover).not.toHaveBeenCalled(); expect(mock.signIn).not.toHaveBeenCalled();
  });

  it.each(["desktop", "phone"])("keeps the same %s sign-in copy when the cloud build flag is on", async layout => {
    vi.stubEnv("VITE_CLOUD_SAVES_ENABLED", "false");
    const baseline = await setup("", layout), copy = baseline.element.textContent;
    await cleanupPhoneTests();
    vi.stubEnv("VITE_CLOUD_SAVES_ENABLED", "true");
    const enabledBuild = await setup("", layout);
    expect(enabledBuild.element.textContent).toBe(copy);
    expect(enabledBuild.element.textContent).not.toContain("accept the cloud notice");
    expect(mock.network).not.toHaveBeenCalled();
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

  it.each(["desktop", "phone"])("keeps a cached %s session pending through transport failures and retries with backoff", async layout => {
    vi.useFakeTimers();
    mock.getSession.mockResolvedValue({ data: { session: session() }, error: null });
    mock.getUser.mockRejectedValueOnce(new TypeError("Synthetic failed fetch"))
      .mockResolvedValueOnce({ data: { user: null }, error: { name: "AuthRetryableFetchError", status: 0 } });
    const env = await setup("", layout);
    expect(env.element.textContent).toContain("Checking your sign-in…");
    expect(mock.mounts).not.toHaveBeenCalled(); expect(mock.signOut).not.toHaveBeenCalled();
    await act(async () => { await vi.advanceTimersByTimeAsync(999); });
    expect(mock.getUser).toHaveBeenCalledTimes(1);
    await act(async () => { await vi.advanceTimersByTimeAsync(1); });
    expect(mock.getUser).toHaveBeenCalledTimes(2);
    expect(env.element.textContent).toContain("Checking your sign-in…");
    await act(async () => { await vi.advanceTimersByTimeAsync(1999); });
    expect(mock.getUser).toHaveBeenCalledTimes(2);
    await act(async () => { await vi.advanceTimersByTimeAsync(1); });
    expect(mock.getUser).toHaveBeenCalledTimes(3);
    expect(env.element.textContent).toContain("Clinic account-a");
    expect(mock.mounts).toHaveBeenCalledExactlyOnceWith("account-a");
    expect(mock.signOut).not.toHaveBeenCalled();
  });

  it("caps repeated service failures at a 30-second retry delay", async () => {
    vi.useFakeTimers();
    mock.getSession.mockResolvedValue({ data: { session: session() }, error: null });
    mock.getUser.mockResolvedValue({ data: { user: null }, error: { status: 503 } });
    const env = await setup();
    let calls = 1;
    for (const delay of [1000, 2000, 4000, 8000, 16000, 30000, 30000]) {
      await act(async () => { await vi.advanceTimersByTimeAsync(delay - 1); });
      expect(mock.getUser).toHaveBeenCalledTimes(calls);
      await act(async () => { await vi.advanceTimersByTimeAsync(1); });
      expect(mock.getUser).toHaveBeenCalledTimes(++calls);
    }
    expect(env.element.textContent).toContain("Checking your sign-in…");
    expect(mock.signOut).not.toHaveBeenCalled(); expect(mock.mounts).not.toHaveBeenCalled();
  });

  it("retries immediately when connectivity returns and cancels the delayed retry", async () => {
    vi.useFakeTimers();
    mock.getSession.mockResolvedValue({ data: { session: session() }, error: null });
    mock.getUser.mockRejectedValueOnce(new TypeError("Synthetic offline"));
    const env = await setup();
    await act(async () => { env.browser.dispatchEvent(new Event("online")); });
    expect(mock.getUser).toHaveBeenCalledTimes(2);
    expect(env.element.textContent).toContain("Clinic account-a");
    await act(async () => { await vi.advanceTimersByTimeAsync(60_000); });
    expect(mock.getUser).toHaveBeenCalledTimes(2); expect(mock.signOut).not.toHaveBeenCalled();
  });

  it.each([{ status: 401 }, { status: 403 }, { status: 400, code: "bad_jwt" },
    { code: "session_not_found" }, { code: "user_banned" }, { code: "not_invited" }])(
    "clears rejected credentials without retrying (%j)", async error => {
      vi.useFakeTimers();
      mock.getSession.mockResolvedValue({ data: { session: session() }, error: null });
      mock.getUser.mockResolvedValue({ data: { user: null }, error });
      const env = await setup();
      expect(env.element.textContent).toContain("Sign in again");
      expect(mock.signOut).toHaveBeenCalledExactlyOnceWith({ scope: "local" });
      await act(async () => { await vi.advanceTimersByTimeAsync(60_000); });
      expect(mock.getUser).toHaveBeenCalledTimes(1); expect(mock.mounts).not.toHaveBeenCalled();
    });

  it.each([{ deleted_at: "2026-10-13T00:00:00Z" }, { banned_until: "2199-01-01T00:00:00Z" }])(
    "denies a disabled server identity (%j)", async fields => {
      mock.getSession.mockResolvedValue({ data: { session: session() }, error: null });
      mock.getUser.mockResolvedValue({ data: { user: { ...session().user, ...fields } }, error: null });
      await setup(); expect(mock.mounts).not.toHaveBeenCalled();
      expect(mock.signOut).toHaveBeenCalledWith({ scope: "local" });
    });

  it("cancels pending retries on sign-out and on unmount", async () => {
    vi.useFakeTimers();
    mock.getSession.mockResolvedValue({ data: { session: session() }, error: null });
    mock.getUser.mockRejectedValue(new TypeError("Synthetic offline"));
    const env = await setup();
    await emit("SIGNED_OUT", null);
    await act(async () => { await vi.advanceTimersByTimeAsync(60_000); env.browser.dispatchEvent(new Event("online")); });
    expect(mock.getUser).toHaveBeenCalledTimes(1); expect(mock.mounts).not.toHaveBeenCalled();
    await emit("SIGNED_IN", session());
    await act(async () => { env.root.unmount(); });
    await act(async () => { await vi.advanceTimersByTimeAsync(60_000); env.browser.dispatchEvent(new Event("online")); });
    expect(mock.getUser).toHaveBeenCalledTimes(2);
  });

  it("does not let an old account's retry or late check replace a newer account", async () => {
    vi.useFakeTimers();
    let resolve!: (value: unknown) => void;
    mock.getSession.mockResolvedValue({ data: { session: session() }, error: null });
    mock.getUser.mockImplementationOnce(() => new Promise(done => { resolve = done; }));
    const env = await setup();
    await emit("SIGNED_IN", session("account-b"));
    await act(async () => { resolve({ data: { user: null }, error: { status: 401 } }); });
    expect(env.element.textContent).toContain("Clinic account-b");
    expect(mock.signOut).not.toHaveBeenCalled();
    await act(async () => { await vi.advanceTimersByTimeAsync(60_000); });
    expect(mock.getUser).toHaveBeenCalledTimes(2);
  });

  it("preserves an admitted clinic while a refresh check has a temporary service failure", async () => {
    vi.useFakeTimers();
    mock.getSession.mockResolvedValue({ data: { session: session() }, error: null });
    const env = await setup();
    mock.getUser.mockResolvedValueOnce({ data: { user: null }, error: { status: 502 } });
    await emit("TOKEN_REFRESHED", session());
    expect(env.element.textContent).toContain("Clinic account-a");
    expect(mock.cleanups).not.toHaveBeenCalled();
    await act(async () => { await vi.advanceTimersByTimeAsync(1000); });
    expect(mock.mounts).toHaveBeenCalledTimes(1); expect(mock.signOut).not.toHaveBeenCalled();
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
    mock.signIn.mockResolvedValue({ error: { status: 429, message: "private provider details" }, data: { session: null } }); await submit(env);
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
