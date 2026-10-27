import { act, useEffect } from "react";
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthGate } from "../auth/AuthGate";
import { useAuthAccountActions } from "../auth/AuthAccountContext";
import { deferred } from "../session/cloud/syncTestSupport";
import type { CloudShellSave } from "../ui/CloudSaveControls";
import MobileShell from "./MobileShell";
import { allElements, cleanupPhoneTests, phoneFixture, phoneTestDom } from "./screenTestUtils";

const auth = vi.hoisted(() => ({
  signOut: vi.fn(),
  user: { id: "phone-account", email: "phone@example.invalid" },
}));
vi.mock("../auth/prototypeAuth", async importOriginal => ({
  ...await importOriginal<typeof import("../auth/prototypeAuth")>(),
  hostedAuthConfiguration: () => ({ supabaseUrl: "https://synthetic.invalid", supabaseAnonKey: "synthetic-public-key" }),
  localPrototypeBypassEnabled: () => false, loadPrototypeAccessSession: () => null,
}));
vi.mock("../auth/supabaseAuth", () => ({
  getSupabaseAuthClient: () => ({ auth: { signOut: auth.signOut, getUser: async () => ({ data: { user: auth.user }, error: null }) } }),
  isInvitedVerifiedUser: () => true, isTransientAuthFailure: () => false,
  loadHostedSession: async () => ({ user: auth.user, access_token: "synthetic-token" }),
  subscribeToHostedAuth: () => () => {},
}));
vi.mock("../facility", () => ({ FacilityCanvas: () => <div data-testid="facility-canvas">Map</div> }));

beforeEach(() => { auth.signOut.mockReset().mockResolvedValue({ error: null }); });
afterEach(cleanupPhoneTests);

function cloudSave(): CloudShellSave {
  return {
    campaignName: "Synthetic phone clinic", writerElsewhere: false,
    view: { phase: "ready", canExecute: true, pending: false, localDurable: true, revision: "1", confirmedAtMs: null, failure: null },
    onContinue: vi.fn(async () => true), onRetry: vi.fn(async () => true), onUseAccountSave: vi.fn(async () => true),
    onKeepRecovery: vi.fn(async () => true), onSaveAndClose: vi.fn(async () => true), onCampaigns: vi.fn(),
  };
}
function GuardedPhone({ guard }: { guard: () => Promise<void> }) {
  const account = useAuthAccountActions();
  useEffect(() => {
    const slot = account?.signOutGuard;
    if (!slot) return;
    slot.current = guard;
    return () => { if (slot.current === guard) slot.current = null; };
  }, [account?.signOutGuard, guard]);
  return <MobileShell {...phoneFixture()} />;
}

describe("phone session links", () => {
  it("puts both named controls in the map overlay without either full-width HUD row", async () => {
    const env = phoneTestDom();
    await env.render(<AuthGate><MobileShell {...phoneFixture({ cloudSave: cloudSave() })} /></AuthGate>);
    const group = env.find(node => node.attributes["aria-label"] === "Session actions");
    expect(group.attributes.hidden).toBeUndefined();
    expect(group.parentNode?.attributes.class).toBe("mobile-map");
    for (const name of ["Save & Close", "Sign out"]) {
      const matches = allElements(env.element, node => node.tagName === "BUTTON" && (node.attributes["aria-label"] ?? node.textContent) === name);
      expect(matches).toHaveLength(1);
      expect(matches[0]?.parentNode).toBe(group);
      expect(matches[0]?.attributes.class).toBe("mobile-session-link");
    }
    const header = env.find(node => node.attributes.class === "mobile-top-bar");
    expect(header.textContent).not.toMatch(/Save & Close|Sign out/);
    expect(allElements(header, node => node.attributes.class === "cloud-save-controls")).toHaveLength(0);
    expect(allElements(env.element, node => node.attributes.class === "auth-signout-button")).toHaveLength(0);

    // Leaving the phone shell restores the existing shared/desktop control.
    await env.render(<AuthGate><p>Desktop or entry</p></AuthGate>);
    expect(env.button("Sign out").attributes.class).toBe("auth-signout-button");
  });

  it("shows only local Save & Close without an account and retains its safe-close confirmation", async () => {
    const env = phoneTestDom(), save = vi.fn(() => ({ ok: true as const, profileCharacters: 0 }));
    await env.render(<MobileShell {...phoneFixture({ onSaveAndPause: save })} />);
    expect(env.button("Save & Close").attributes["aria-label"]).toBe("Save & Close");
    expect(allElements(env.element, node => node.tagName === "BUTTON" && (node.attributes["aria-label"] ?? node.textContent) === "Sign out")).toHaveLength(0);
    await env.click("Save & Close");
    expect(save).toHaveBeenCalledOnce();
    expect(env.element.textContent).toContain("Safe to close this tab");
  });

  it("waits for the same account save and release before confirming cloud Save & Close", async () => {
    const env = phoneTestDom(), control = cloudSave(), waiting = deferred();
    const localSave = vi.fn();
    control.onSaveAndClose = vi.fn(async () => { await waiting.promise; return true; });
    const render = () => env.render(<MobileShell {...phoneFixture({ cloudSave: control, onSaveAndPause: localSave })} />);
    await render(); await env.click("Save & Close");
    expect(control.onSaveAndClose).toHaveBeenCalledOnce();
    expect(localSave).not.toHaveBeenCalled();
    expect(env.button("Save & Close").attributes.disabled).toBe("");
    expect(env.element.textContent).not.toContain("Safe to close this tab");
    control.view = { ...control.view, phase: "closed", canExecute: false };
    await render();
    await act(async () => { waiting.resolve(); await waiting.promise; });
    expect(env.element.textContent).toContain("Safe to close this tab");
    expect(env.button("Save & Close").attributes["aria-label"]).toBe("Save & Close");
  });

  it("uses the existing guarded sign-out action and keeps its name while pending", async () => {
    const env = phoneTestDom(), waiting = deferred(), guard = vi.fn(async () => { await waiting.promise; });
    await env.render(<AuthGate><GuardedPhone guard={guard} /></AuthGate>);
    await env.click("Sign out");
    expect(guard).toHaveBeenCalledOnce(); expect(auth.signOut).not.toHaveBeenCalled();
    expect(env.button("Sign out").attributes.disabled).toBe("");
    expect(env.button("Sign out").textContent).toBe("Signing out…");
    await act(async () => { waiting.resolve(); await waiting.promise; });
    expect(auth.signOut).toHaveBeenCalledExactlyOnceWith({ scope: "local" });
    expect(env.element.textContent).toContain("Sign in");
  });

  it("keeps sign-out failures visible beside the links without restoring the old row", async () => {
    const env = phoneTestDom(), guard = vi.fn(async () => { throw new Error("Synthetic durability refusal"); });
    await env.render(<AuthGate><GuardedPhone guard={guard} /></AuthGate>);
    await env.click("Sign out");
    expect(auth.signOut).not.toHaveBeenCalled();
    expect(env.find(node => node.attributes.role === "alert").attributes.class).toBe("mobile-session-error");
    expect(env.button("Sign out").attributes.disabled).toBeUndefined();
    expect(allElements(env.element, node => node.attributes.class === "auth-signout-button")).toHaveLength(0);
  });

  it("retains cloud-save warning actions in the HUD and keeps links out of covering sheets", async () => {
    const env = phoneTestDom(), control = cloudSave();
    control.view = { ...control.view, phase: "waiting", failure: "network", pending: true };
    await env.render(<MobileShell {...phoneFixture({ cloudSave: control })} />);
    const header = env.find(node => node.attributes.class === "mobile-top-bar");
    expect(allElements(header, node => node.tagName === "BUTTON" && node.attributes["aria-label"]?.startsWith("Account save status:") === true)).toHaveLength(1);
    expect(header.textContent).not.toContain("Save & Close");
    await env.click("More clinic options");
    expect(env.find(node => node.attributes["aria-label"] === "Session actions").attributes.hidden).toBe("");
  });

  it("uses an absolute compact overlay with usable targets and removes the phone-only top offset", () => {
    const css = readFileSync(new URL("./mobileShell.css", import.meta.url), "utf8");
    expect(css).toMatch(/\.mobile-session-links\s*\{[^}]*position: absolute[^}]*bottom: 10px[^}]*right: 60px/);
    expect(css).toMatch(/\.mobile-session-link\s*\{[^}]*min-height: 44px[^}]*font-size: 12px/);
    expect(css).toContain("safe-area-inset-bottom");
    const entryCss = readFileSync(new URL("./mobileEntry.css", import.meta.url), "utf8");
    expect(entryCss).not.toMatch(/:has\(\.auth-signout-button\) \.mobile-shell/);
  });
});
