import { act, useEffect } from "react";
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AppShell } from "./AppShell";
import { AuthGate } from "./auth/AuthGate";
import { useAuthAccountActions } from "./auth/AuthAccountContext";
import MobileShell from "./mobile/MobileShell";
import { allElements, cleanupPhoneTests, phoneFixture, phoneTestDom } from "./mobile/screenTestUtils";
import { deferred } from "./session/cloud/syncTestSupport";
import type { CloudShellSave } from "./ui/CloudSaveControls";

const auth = vi.hoisted(() => ({ signOut: vi.fn(), user: { id: "desktop-account", email: "desktop@example.invalid" } }));
vi.mock("./auth/prototypeAuth", async importOriginal => ({
  ...await importOriginal<typeof import("./auth/prototypeAuth")>(),
  hostedAuthConfiguration: () => ({ supabaseUrl: "https://synthetic.invalid", supabaseAnonKey: "synthetic-public-key" }),
  localPrototypeBypassEnabled: () => false, loadPrototypeAccessSession: () => null,
}));
vi.mock("./auth/supabaseAuth", () => ({
  getSupabaseAuthClient: () => ({ auth: { signOut: auth.signOut, getUser: async () => ({ data: { user: auth.user }, error: null }) } }),
  isInvitedVerifiedUser: () => true, isTransientAuthFailure: () => false,
  loadHostedSession: async () => ({ user: auth.user, access_token: "synthetic-token" }),
  subscribeToHostedAuth: () => () => {},
}));
vi.mock("./facility", () => ({ FacilityCanvas: () => <div data-testid="facility-canvas">Map</div> }));

beforeEach(() => { auth.signOut.mockReset().mockResolvedValue({ error: null }); });
afterEach(cleanupPhoneTests);

function cloudSave(): CloudShellSave {
  return {
    campaignName: "Synthetic desktop clinic", writerElsewhere: false,
    view: { phase: "ready", canExecute: true, pending: false, localDurable: true, revision: "1", confirmedAtMs: null, failure: null },
    onContinue: vi.fn(async () => true), onRetry: vi.fn(async () => true), onUseAccountSave: vi.fn(async () => true),
    onKeepRecovery: vi.fn(async () => true), onSaveAndClose: vi.fn(async () => true), onCampaigns: vi.fn(),
  };
}
function GuardedDesktop({ guard }: { guard: () => Promise<void> }) {
  const account = useAuthAccountActions();
  useEffect(() => {
    const slot = account?.signOutGuard;
    if (!slot) return;
    slot.current = guard;
    return () => { if (slot.current === guard) slot.current = null; };
  }, [account?.signOutGuard, guard]);
  return <AppShell {...phoneFixture()} />;
}
const footerLink = (env: ReturnType<typeof phoneTestDom>, name: string) =>
  env.find(node => node.attributes.class === "text-button footer-session-link" && node.attributes["aria-label"] === name);

describe("desktop footer session links", () => {
  it.each([1024, 1180, 1280, 1440])("keeps both controls at the end of the existing footer at width %i", async width => {
    const env = phoneTestDom(); env.browser.innerWidth = width;
    await env.render(<AuthGate><AppShell {...phoneFixture({ cloudSave: cloudSave() })} /></AuthGate>);
    const actions = env.find(node => node.attributes.class === "footer-actions");
    const links = actions.childNodes.filter(node => node.attributes.class === "text-button footer-session-link");
    expect(links.map(node => node.attributes["aria-label"])).toEqual(["Save & Close", "Sign out"]);
    expect(actions.childNodes.at(-1)).toBe(links[1]);
    expect(actions.childNodes.at(-2)).toBe(links[0]);
    for (const name of ["Help", "Account campaigns", "Restart Campaign"]) {
      expect(actions.childNodes.some(node => node.tagName === "BUTTON" && node.textContent === name)).toBe(true);
    }
    expect(allElements(env.element, node => node.attributes.class === "auth-signout-button")).toHaveLength(0);
    const header = env.find(node => node.attributes["aria-label"] === "Clinic resources");
    expect(allElements(header, node => node.tagName === "BUTTON" && node.textContent === "Save & Close")).toHaveLength(0);
    expect(allElements(header, node => node.attributes.class === "cloud-save-controls")).toHaveLength(0);
  });

  it("uses the guarded local-scope sign-out action and keeps its accessible name while pending", async () => {
    const env = phoneTestDom(), waiting = deferred(), guard = vi.fn(async () => { await waiting.promise; });
    await env.render(<AuthGate><GuardedDesktop guard={guard} /></AuthGate>);
    await env.clickElement(footerLink(env, "Sign out"));
    expect(guard).toHaveBeenCalledOnce(); expect(auth.signOut).not.toHaveBeenCalled();
    expect(footerLink(env, "Sign out").attributes.disabled).toBe("");
    expect(footerLink(env, "Sign out").textContent).toBe("Signing out…");
    await act(async () => { waiting.resolve(); await waiting.promise; });
    expect(auth.signOut).toHaveBeenCalledExactlyOnceWith({ scope: "local" });
    expect(env.element.textContent).toContain("Sign in");
  });

  it("shows sign-out failures in the footer without restoring a floating control", async () => {
    const env = phoneTestDom(), guard = vi.fn(async () => { throw new Error("Synthetic durability refusal"); });
    await env.render(<AuthGate><GuardedDesktop guard={guard} /></AuthGate>);
    await env.clickElement(footerLink(env, "Sign out"));
    expect(auth.signOut).not.toHaveBeenCalled();
    const error = env.find(node => node.attributes.class === "footer-session-error");
    expect(error.attributes.role).toBe("alert"); expect(error.parentNode?.tagName).toBe("FOOTER");
    expect(footerLink(env, "Sign out").attributes.disabled).toBeUndefined();
    expect(allElements(env.element, node => node.attributes.class === "auth-signout-button")).toHaveLength(0);
  });

  it("uses the same cloud close and waits for confirmed save/release before Safe to close", async () => {
    const env = phoneTestDom(), control = cloudSave(), waiting = deferred(), localSave = vi.fn();
    control.onSaveAndClose = vi.fn(async () => { await waiting.promise; return true; });
    const render = () => env.render(<AppShell {...phoneFixture({ cloudSave: control, onSaveAndPause: localSave })} />);
    await render(); await env.click("Save & Close");
    expect(control.onSaveAndClose).toHaveBeenCalledOnce(); expect(localSave).not.toHaveBeenCalled();
    expect(env.button("Save & Close").attributes.disabled).toBe("");
    expect(env.element.textContent).not.toContain("Safe to close this tab");
    control.view = { ...control.view, phase: "closed", canExecute: false };
    await render();
    await act(async () => { waiting.resolve(); await waiting.promise; });
    expect(env.element.textContent).toContain("Safe to close this tab");
    expect(env.button("Save & Close").attributes["aria-label"]).toBe("Save & Close");
  });

  it("retains failed cloud-close warnings, recovery choices and HUD status actions", async () => {
    const env = phoneTestDom(), control = cloudSave();
    control.view = { ...control.view, phase: "waiting", failure: "network", pending: true };
    control.onSaveAndClose = vi.fn(async () => false);
    await env.render(<AppShell {...phoneFixture({ cloudSave: control })} />);
    const header = env.find(node => node.attributes["aria-label"] === "Clinic resources");
    expect(allElements(header, node => node.tagName === "BUTTON" && node.attributes["aria-label"]?.startsWith("Account save status:") === true)).toHaveLength(1);
    await env.click("Save & Close");
    expect(env.element.textContent).toContain("Account save and session close are not confirmed");
    expect(env.element.textContent).not.toContain("Safe to close this tab");
    await env.click("Keep a recovery copy"); expect(control.onKeepRecovery).toHaveBeenCalledOnce();
  });

  it("preserves phone links across layout switches and restores the auth control only on entry", async () => {
    const env = phoneTestDom(), control = cloudSave();
    await env.render(<AuthGate><AppShell {...phoneFixture({ cloudSave: control })} /></AuthGate>);
    await env.render(<AuthGate><MobileShell {...phoneFixture({ cloudSave: control })} /></AuthGate>);
    const group = env.find(node => node.attributes["aria-label"] === "Session actions");
    const row = env.find(node => node.attributes.class === "mobile-session-row");
    const tabs = env.find(node => node.attributes["aria-label"] === "Clinic tabs");
    expect(group.parentNode?.attributes.class).toBe("mobile-session-strip");
    expect(group.parentNode?.parentNode?.attributes.class).toBe("mobile-navigation");
    expect(tabs.nextSibling).toBe(group.parentNode);
    expect(row.parentNode).toBe(group);
    expect(env.button("Sign out").parentNode).toBe(row);
    expect(env.button("Save & Close").parentNode).toBe(row);
    expect(allElements(env.element, node => node.attributes.class === "auth-signout-button")).toHaveLength(0);
    await env.render(<AuthGate><AppShell {...phoneFixture({ cloudSave: control })} /></AuthGate>);
    expect(footerLink(env, "Sign out").parentNode?.attributes.class).toBe("footer-actions");
    await env.render(<AuthGate><p>Entry</p></AuthGate>);
    expect(env.button("Sign out").attributes.class).toBe("auth-signout-button");
  });

  it("omits account links without an account and keeps the existing local save control", async () => {
    const env = phoneTestDom();
    await env.render(<AppShell {...phoneFixture()} />);
    const actions = env.find(node => node.attributes.class === "footer-actions");
    expect(actions.childNodes.some(node => node.attributes.class === "text-button footer-session-link")).toBe(false);
    expect(allElements(env.element, node => node.tagName === "BUTTON" && node.textContent === "Sign out")).toHaveLength(0);
    expect(env.button("Save & Close").attributes.class).toBe("button button-secondary save-close-button");
  });

  it("lets the footer actions shrink/wrap in normal flow and constrains both desktop grid layouts", () => {
    const css = readFileSync(new URL("./styles/global.css", import.meta.url), "utf8");
    expect(css).toMatch(/\.game-shell \.footer-actions\s*\{[^}]*min-width: 0[^}]*max-width: 100%[^}]*flex: 0 1 auto[^}]*flex-wrap: wrap/);
    expect(css).toMatch(/\.game-shell \.footer-actions > \.footer-session-link\s*\{[^}]*position: static[^}]*border: 0[^}]*background: transparent[^}]*box-shadow: none[^}]*white-space: normal/);
    expect(css).toMatch(/@media \(min-width: 1181px\)\s*\{\s*\.game-shell \.footer-bar\s*\{\s*grid-template-columns: minmax\(0, 1fr\) minmax\(0, 2fr\) minmax\(0, auto\)/);
    expect(css).toMatch(/@media \(min-width: 761px\) and \(max-width: 1180px\)\s*\{\s*\.game-shell \.footer-bar\s*\{\s*grid-template-columns: minmax\(0, 1fr\) minmax\(0, 2fr\)/);
  });
});
