import { afterEach, describe, expect, it, vi } from "vitest";
import { claimPersonalSetupLink, takeSetupLink } from "./setupLink";

const code = "s".repeat(43);
const link = { email: "tester+clinic@example.org", code, invalid: false };
const configuration = { supabaseUrl: "https://synthetic.supabase.co", supabaseAnonKey: "synthetic-public-key" };
afterEach(() => vi.unstubAllGlobals());

describe("personal setup fragment and transport", () => {
  it("captures only in memory and scrubs the entire fragment immediately, preserving Pages path/query/history", () => {
    const replaceState = vi.fn(), storage = vi.fn();
    vi.stubGlobal("window", { location: new URL(`https://melissarowlandc-afk.github.io/GamifySurgery/?layout=phone#setup=${code}&email=tester%2Bclinic%40example.org`),
      history: { state: { fixture: true }, replaceState }, localStorage: { setItem: storage }, sessionStorage: { setItem: storage } });
    expect(takeSetupLink()).toEqual(link);
    expect(replaceState).toHaveBeenCalledExactlyOnceWith({ fixture: true }, "", "/GamifySurgery/?layout=phone");
    expect(storage).not.toHaveBeenCalled();
  });
  it.each([`#setup=&email=tester@example.org`, `#setup=${code}&email=bad`, `#setup=${code}&setup=${code}&email=tester@example.org`,
    `#setup=${code}&email=tester@example.org&email=other@example.org`])("scrubs and blocks malformed setup fragments (%s)", hash => {
    const replaceState = vi.fn(); vi.stubGlobal("window", { location: new URL(`http://127.0.0.1:4173/${hash}`), history: { state: null, replaceState } });
    expect(takeSetupLink()?.invalid).toBe(true); expect(replaceState).toHaveBeenCalledWith(null, "", "/");
  });
  it("fails closed when the browser cannot remove the fragment", () => {
    vi.stubGlobal("window", { location: new URL(`http://127.0.0.1:4173/#setup=${code}&email=tester@example.org`),
      history: { replaceState: () => { throw new Error("Synthetic history restriction"); } } });
    expect(takeSetupLink()?.invalid).toBe(true);
  });
  it("ignores legacy/unrelated fragments without changing history", () => {
    const replaceState = vi.fn(); vi.stubGlobal("window", { location: new URL("http://127.0.0.1:4173/#type=invite&access_token=synthetic"), history: { replaceState } });
    expect(takeSetupLink()).toBeNull(); expect(replaceState).not.toHaveBeenCalled();
  });
  it("sends one explicit JSON POST with the public key and chosen password, without credentials in URLs", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true })));
    expect(await claimPersonalSetupLink(configuration, link, "eight888", fetchImpl)).toBe("ok");
    expect(fetchImpl).toHaveBeenCalledExactlyOnceWith("https://synthetic.supabase.co/functions/v1/claim-setup-link", expect.objectContaining({
      method: "POST", credentials: "omit", cache: "no-store", redirect: "error",
      headers: { "Content-Type": "application/json", apikey: "synthetic-public-key" },
      body: JSON.stringify({ email: link.email, code, password: "eight888" }),
    }));
  });
  it.each([[409, "used_link"], [400, "invalid_link"], [400, "invalid_password"], [503, "unavailable"]] as const)(
    "maps only the reviewed endpoint errors (%s, %s)", async (status, error) => {
      const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify({ error, details: "private provider response" }), { status }));
      expect(await claimPersonalSetupLink(configuration, link, "eight888", fetchImpl)).toBe(error);
    });
  it("does not post a malformed link and hides transport/unexpected responses", async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error("Private details"));
    expect(await claimPersonalSetupLink(configuration, { ...link, invalid: true }, "eight888", fetchImpl)).toBe("invalid_link");
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(await claimPersonalSetupLink(configuration, link, "eight888", fetchImpl)).toBe("unavailable");
    fetchImpl.mockResolvedValue(new Response(JSON.stringify({ ok: false, error: "unreviewed details" })));
    expect(await claimPersonalSetupLink(configuration, link, "eight888", fetchImpl)).toBe("unavailable");
  });
});
