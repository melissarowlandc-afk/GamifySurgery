import { act, useEffect, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { LocalPrototypeProfile } from "../session/prototypeStorage";
import { createFreshProfile } from "../session/prototypeStorage";
import { App } from "../App";
import { AuthGate } from "../auth/AuthGate";
import { allElements, cleanupPhoneTests, phoneTestDom } from "./screenTestUtils";
import { testElementProps, type TestElement } from "./testDom";

const evidence = vi.hoisted(() => ({
  profile: null as LocalPrototypeProfile | null,
  entryReady: null as Promise<unknown> | null,
  entryImports: 0, shellImports: 0, sessionMounts: 0, sessionCleanups: 0, clockStarts: 0,
  saveAccess: vi.fn(), saveProfile: vi.fn(() => ({ ok: true })), appendCampaign: vi.fn(),
}));

// Observe the lazy module factories, rather than substituting an entry renderer.
vi.mock("./MobileEntryPresentation", async importOriginal => {
  evidence.entryImports += 1;
  evidence.entryReady = importOriginal();
  return evidence.entryReady;
});
vi.mock("./MobileShell", () => {
  evidence.shellImports += 1;
  return { default: (props: { facility: { tick: number } }) =>
    <section data-shell="phone" data-tick={props.facility.tick}>Phone clinic</section> };
});
vi.mock("../AppShell", () => ({ AppShell: (props: { facility: { tick: number } }) =>
  <section data-shell="desktop" data-tick={props.facility.tick}>Desktop clinic</section> }));
vi.mock("../auth/supabaseAuth", () => ({ getSupabaseAuthClient: () => null }));
vi.mock("../auth/prototypeAuth", () => ({
  hostedAuthConfiguration: () => null, localPrototypeBypassEnabled: () => true,
  loadPrototypeAccessSession: () => null, createLocalPrototypeSession: () => ({ id: "fixture.local" }),
  savePrototypeAccessSession: evidence.saveAccess,
}));
vi.mock("../session/tutorialTiming", () => ({ getTutorialClockMultiplier: () => 1 }));
vi.mock("../session", async importOriginal => {
  const original = await importOriginal<typeof import("../session")>();
  return { ...original,
    loadPrototypeProfile: () => ({ profile: evidence.profile }),
    savePrototypeProfileResult: evidence.saveProfile,
    appendLocalCampaign: (...args: Parameters<typeof original.appendLocalCampaign>) => {
      evidence.appendCampaign(...args);
      return original.appendLocalCampaign(...args);
    },
    createPrototypePlayerView: (state: { tick: number }) => ({
      facility: { tick: state.tick, realMillisecondsPerFacilityMinuteAt1x: 1000 },
      resourceBar: {}, chart: null, patients: [],
    }),
    usePrototypeSession: (loaded: { profile: LocalPrototypeProfile }) => {
      const [tick, setTick] = useState(0);
      useEffect(() => {
        evidence.sessionMounts += 1; evidence.clockStarts += 1;
        const timer = setInterval(() => setTick(value => value + 1), 1000);
        return () => { clearInterval(timer); evidence.sessionCleanups += 1; };
      }, []);
      return new Proxy({
        state: { tick, paused: false, simulationSpeed: 1, openChartEncounterId: null },
        profile: loaded.profile, summaryVisible: false, buildMode: false, managementMode: false,
        tutorialsEnabled: false, campaigns: [], questionReviewFlags: [], systemNotices: [],
      }, { get(target, key) { return Reflect.has(target, key) ? Reflect.get(target, key) : () => undefined; } });
    },
  };
});

const tree = (node: TestElement): unknown => ({
  tag: node.tagName, attributes: node.attributes, value: node.value, text: node.textContent,
  children: node.childNodes.map(tree),
});
afterEach(cleanupPhoneTests);

describe("approved App phone entry seam", () => {
  it("loads entry CSS only through the phone factory, preserves entry DOM and founder state, and retains one clinic clock", async () => {
    vi.useFakeTimers();
    evidence.profile = createFreshProfile();
    const env = phoneTestDom();
    env.browser.location.search = "?layout=desktop";
    expect(renderToStaticMarkup(<App />)).toBe(renderToStaticMarkup(<AuthGate><p>Unshown clinic</p></AuthGate>));
    await env.render(<App />);
    const authTree = tree(env.element);
    expect(evidence.entryImports).toBe(0); expect(evidence.shellImports).toBe(0);
    expect(env.doc.body.attributes["data-phone-entry"]).toBeUndefined();

    const layout = async (name: "phone" | "desktop") => {
      await act(async () => {
        env.browser.location.search = `?layout=${name}`;
        env.browser.dispatchEvent(new Event("popstate"));
      });
      // Vitest resolves the actual lazy module after the first commit begins.
      await act(async () => { await evidence.entryReady; });
    };
    await layout("phone");
    expect(evidence.entryImports).toBe(1); expect(evidence.shellImports).toBe(0);
    expect(env.doc.body.attributes["data-phone-entry"]).toBe("true");
    expect(tree(env.element)).toEqual(authTree);
    await layout("desktop");
    expect(env.doc.body.attributes["data-phone-entry"]).toBeUndefined();
    expect(tree(env.element)).toEqual(authTree);

    await env.click("Enter Local Prototype");
    expect(evidence.saveAccess).toHaveBeenCalledExactlyOnceWith({ id: "fixture.local" });
    await env.click("New Campaign");
    const inputs = allElements(env.element, node => node.tagName === "INPUT" && node.attributes.type !== "checkbox");
    await act(async () => {
      (testElementProps(inputs[0]!).onChange as (event: unknown) => void)({ target: { value: "Fixture Founder" } });
      (testElementProps(inputs[1]!).onChange as (event: unknown) => void)({ target: { value: "Fixture Clinic" } });
    });
    const founderTree = tree(env.element);
    await layout("phone"); expect(tree(env.element)).toEqual(founderTree);
    await layout("desktop"); expect(tree(env.element)).toEqual(founderTree);
    const form = env.find(node => node.tagName === "FORM");
    await act(async () => {
      const submit = testElementProps(form).onSubmit as (event: { preventDefault: () => void }) => void;
      submit({ preventDefault() {} }); submit({ preventDefault() {} });
    });
    expect(evidence.appendCampaign).toHaveBeenCalledOnce();
    expect(evidence.appendCampaign.mock.calls[0]?.[1].displayName).toBe("Fixture Founder");
    expect(evidence.appendCampaign.mock.calls[0]?.[2]).toBe("Fixture Clinic");
    expect(evidence.appendCampaign.mock.calls[0]?.[5]).toBe(true);
    expect(evidence.saveProfile).toHaveBeenCalledOnce();
    expect(evidence.shellImports).toBe(0);
    const clinic = () => env.find(node => Boolean(node.attributes["data-shell"]));
    expect(clinic().attributes["data-shell"]).toBe("desktop");
    await act(async () => vi.advanceTimersByTime(1000));
    expect(clinic().attributes["data-tick"]).toBe("1");
    await layout("phone");
    expect(evidence.shellImports).toBe(1); expect(evidence.entryImports).toBe(1);
    expect(clinic().attributes["data-tick"]).toBe("1");
    await act(async () => vi.advanceTimersByTime(1000));
    await layout("desktop");
    expect(clinic().attributes["data-tick"]).toBe("2");
    expect(evidence.sessionMounts).toBe(1); expect(evidence.clockStarts).toBe(1);
    expect(evidence.sessionCleanups).toBe(0);
  });
});
