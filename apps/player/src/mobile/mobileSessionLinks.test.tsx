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
  it("puts both named controls below the tabs outside the map without either full-width HUD row", async () => {
    const env = phoneTestDom();
    await env.render(<AuthGate><MobileShell {...phoneFixture({ cloudSave: cloudSave() })} /></AuthGate>);
    const group = env.find(node => node.attributes["aria-label"] === "Session actions");
    expect(group.attributes.hidden).toBeUndefined();
    const strip = env.find(node => node.attributes.class === "mobile-session-strip");
    const footer = env.find(node => node.attributes.class === "mobile-navigation");
    const tabs = env.find(node => node.attributes["aria-label"] === "Clinic tabs");
    const row = env.find(node => node.attributes.class === "mobile-session-row");
    const map = env.find(node => node.attributes.class === "mobile-map");
    expect(group.parentNode).toBe(strip);
    expect(strip.parentNode).toBe(footer);
    expect(tabs.parentNode).toBe(footer);
    expect(tabs.nextSibling).toBe(strip);
    expect(row.parentNode).toBe(group);
    expect(allElements(tabs, node => node.tagName === "BUTTON").map(node => node.attributes["data-mobile-tab"]))
      .toEqual(["clinic", "patients", "alerts", "manage", "build"]);
    expect(allElements(map, node => node.attributes.class === "mobile-session-links")).toHaveLength(0);
    expect(env.button("Recenter facility").parentNode?.parentNode).toBe(map);
    for (const name of ["Save & Close", "Sign out"]) {
      const matches = allElements(env.element, node => node.tagName === "BUTTON" && (node.attributes["aria-label"] ?? node.textContent) === name);
      expect(matches).toHaveLength(1);
      expect(matches[0]?.parentNode).toBe(row);
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

  it("announces sign-out failures above the link row in the navigation without covering tabs", async () => {
    const env = phoneTestDom(), guard = vi.fn(async () => { throw new Error("Synthetic durability refusal"); });
    await env.render(<AuthGate><GuardedPhone guard={guard} /></AuthGate>);
    await env.click("Sign out");
    expect(auth.signOut).not.toHaveBeenCalled();
    const alert = env.find(node => node.attributes.role === "alert");
    const group = env.find(node => node.attributes["aria-label"] === "Session actions");
    expect(alert.attributes.class).toBe("mobile-session-error");
    expect(alert.parentNode).toBe(group);
    expect(alert.nextSibling?.attributes.class).toBe("mobile-session-row");
    expect(group.attributes.hidden).toBeUndefined();
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

  it.each(["Patients", "Alerts", "Manage", "Build", "More clinic options"])("hides links for %s and restores them on Clinic", async name => {
    const env = phoneTestDom();
    await env.render(<MobileShell {...phoneFixture({ onEnterBuildMode: vi.fn(), onEnterManagementMode: vi.fn() })} />);
    const group = () => env.find(node => node.attributes["aria-label"] === "Session actions");
    await env.click(name);
    expect(group().attributes.hidden).toBe("");
    expect(group().parentNode?.attributes.class).toBe("mobile-session-strip");
    await env.click("Clinic");
    expect(group().attributes.hidden).toBeUndefined();
  });

  it("keeps Build controls, the measured map inset, sheets and tutorial coach in the workspace above navigation", async () => {
    const env = phoneTestDom();
    await env.render(<MobileShell {...phoneFixture({ buildMode: true, tutorialStep: {
      id: "place-exam-room", eyebrow: "Build", title: "Fixture guidance", body: "Fixture guidance body",
      target: "facility-placement", targetSelector: ".mobile-map",
    } })} />);
    const main = env.find(node => node.attributes.class === "mobile-content");
    const workspace = env.find(node => node.attributes.class === "mobile-workspace");
    const map = env.find(node => node.attributes.class === "mobile-map");
    const controls = env.find(node => node.attributes["aria-label"] === "Build actions");
    const coach = env.find(node => node.attributes["data-tutorial-step"] === "place-exam-room");
    expect(controls.parentNode).toBe(workspace);
    expect(map.parentNode).toBe(workspace);
    expect(workspace.style["--mobile-build-control-height"]).toBe(map.style.bottom);
    expect(Number.parseInt(String(map.style.bottom))).toBeGreaterThan(0);
    expect(env.find(node => node.attributes["aria-label"] === "Build").parentNode).toBe(workspace);
    expect(workspace.parentNode).toBe(main);
    expect(coach.parentNode).toBe(main);
    expect(main.nextSibling?.attributes.class).toBe("mobile-navigation");
  });

  it("uses the safe-area strip with compact targets, right-side home-indicator clearance and normal-flow errors", () => {
    const css = readFileSync(new URL("./mobileShell.css", import.meta.url), "utf8");
    expect(css).toMatch(/\.mobile-shell\s*\{[^}]*grid-template-rows: auto minmax\(0, 1fr\) auto/);
    expect(css).toMatch(/\.mobile-navigation\s*\{[^}]*--mobile-bottom-inset: env\(safe-area-inset-bottom, 0px\)/);
    expect(css).toMatch(/\.mobile-session-strip\s*\{[^}]*min-height: max\(32px, var\(--mobile-bottom-inset\)\)/);
    expect(css).toMatch(/\.mobile-session-row\s*\{[^}]*width: min\(40%, calc\(50% - min\(72px, calc\(var\(--mobile-bottom-inset\) \* 3\)\)\)\)[^}]*align-self: flex-end/);
    expect(css).toMatch(/\.mobile-session-links\[hidden\]\s*\{\s*display: none/);
    expect(css).toMatch(/\.mobile-session-link\s*\{[^}]*min-height: 32px !important[^}]*font-size: 11px[^}]*text-decoration: underline/);
    expect(css).not.toMatch(/\.mobile-session-(?:links|error)\s*\{[^}]*position: absolute/);
    expect(css).toMatch(/\.mobile-map-recenter\s*\{[^}]*position: absolute[^}]*bottom: 10px[^}]*right: 8px/);
    expect(css).toContain("safe-area-inset-bottom");
    const entryCss = readFileSync(new URL("./mobileEntry.css", import.meta.url), "utf8");
    expect(entryCss).not.toMatch(/:has\(\.auth-signout-button\) \.mobile-shell/);
  });

  it("keeps landscape session links beneath the tab column with scrolling available at short heights", () => {
    const css = readFileSync(new URL("./mobilePolish.css", import.meta.url), "utf8");
    expect(css).toContain('(orientation: landscape) and (min-width: 600px) and (max-height: 500px)');
    expect(css).toContain('grid-template-areas: "top top" "tabs content"');
    expect(css).toMatch(/\.mobile-navigation\s*\{[^}]*grid-area: tabs[^}]*min-height: 0[^}]*height: 100%[^}]*max-height: 100%[^}]*overflow-y: auto/);
    expect(css).toMatch(/\.mobile-tab-bar\s*\{[^}]*min-height: 180px[^}]*grid-template-rows: repeat\(5, minmax\(36px, 1fr\)\)[^}]*flex: 1 1 180px/);
    expect(css).toMatch(/\.mobile-session-strip\s*\{[^}]*min-height: 0/);
    expect(css).toMatch(/\.mobile-session-row\s*\{[^}]*width: 100%[^}]*flex-direction: column/);
  });

  it("budgets at most 240px for landscape controls and keeps overflow inside the safe-area grid row at 320px heights", () => {
    const base = readFileSync(new URL("./mobileShell.css", import.meta.url), "utf8");
    const css = readFileSync(new URL("./mobilePolish.css", import.meta.url), "utf8");
    const landscape = css.slice(css.indexOf('@media (orientation: landscape)'));
    const rule = (selector: string) => {
      const declaration = landscape.split(`${selector} {`)[1]?.split("}")[0];
      expect(declaration, `landscape rule for ${selector}`).toBeDefined();
      return declaration!;
    };
    const tab = rule(".mobile-shell .mobile-tab-bar button");
    const link = rule(".mobile-shell .mobile-session-link");
    const navigation = rule(".mobile-shell .mobile-navigation");
    // !important must beat the shell-wide 44px minimum. Read the actual CSS
    // values so restoring the old 44px tabs / 32px links breaks this budget.
    const minimumHeight = (declaration: string) => Number(declaration.match(/min-height: (\d+)px !important/)?.[1]);
    const padding = Number(navigation.match(/padding: (\d+)px/)?.[1]);
    const budget = 5 * minimumHeight(tab) + 2 * minimumHeight(link) + 2 * padding;
    expect(budget).toBeLessThanOrEqual(240);
    expect(rule(".mobile-shell .mobile-session-row")).toContain("gap: 0");
    expect(tab).toContain("font-size: 11px");
    expect(tab).toContain("padding: 1px 2px");
    expect(link).toContain("padding: 0 2px");
    // At 320px with a 21px bottom inset the header has only 59px spare.
    // Larger headers and arbitrary account errors must grow scroll content,
    // never the grid row or the shell's physical viewport height.
    expect(320 - 21 - budget).toBeGreaterThanOrEqual(59);
    expect(rule(".mobile-shell")).toContain("grid-template-rows: auto minmax(0, 1fr)");
    expect(rule(".mobile-shell")).toContain("padding-bottom: env(safe-area-inset-bottom, 0px)");
    expect(base).toContain("height: 100dvh");
    for (const edge of ["top", "left", "right"]) expect(base).toContain(`padding-${edge}: env(safe-area-inset-${edge}, 0px)`);
    for (const constraint of ["min-height: 0", "height: 100%", "max-height: 100%", "overflow-y: auto", "scroll-padding-block: 2px"])
      expect(navigation).toContain(constraint);
    expect(rule(".mobile-shell .mobile-tab-bar")).toContain("flex: 1 1 180px");
    expect(base).toMatch(/\.mobile-session-strip\s*\{[^}]*flex: 0 0 auto/);
    expect(base).toMatch(/\.mobile-session-error\s*\{[^}]*overflow-wrap: anywhere/);
  });
});
