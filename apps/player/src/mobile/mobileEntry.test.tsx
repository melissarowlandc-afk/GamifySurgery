import { act } from "react";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AuthGate } from "../auth/AuthGate";
import { OpeningSequence } from "../ui/OpeningSequence";
import { createFreshProfile } from "../session/prototypeStorage";
import MobileEntryPresentation from "./MobileEntryPresentation";
import { allElements, cleanupPhoneTests, noop, phoneTestDom } from "./screenTestUtils";
import { testElementProps } from "./testDom";

const auth = vi.hoisted(() => ({ save: vi.fn(), local: { id: "fixture.local" } }));
vi.mock("../auth/supabaseAuth", () => ({ getSupabaseAuthClient: () => null }));
vi.mock("../auth/prototypeAuth", () => ({ hostedAuthConfiguration: () => null, localPrototypeBypassEnabled: () => true,
  loadPrototypeAccessSession: () => null, createLocalPrototypeSession: () => auth.local, savePrototypeAccessSession: auth.save }));
afterEach(async () => { await cleanupPhoneTests(); vi.clearAllMocks(); });

describe("phone-only entry presentation (shared AuthGate and opening)", () => {
  it("owns only the removable presentation flag and never adds entry markup", async () => {
    const env = phoneTestDom();
    Object.assign(env.doc.body, { getAttribute: (name: string) => env.doc.body.attributes[name] ?? null });
    await env.render(<MobileEntryPresentation />); expect(env.doc.body.attributes["data-phone-entry"]).toBe("true");
    expect(env.element.childNodes).toHaveLength(0);
    await env.render(<div>Desktop</div>); expect(env.doc.body.attributes["data-phone-entry"]).toBeUndefined();
  });
  it("preserves explicit local entry and the shared founder/new-campaign handlers", async () => {
    const env = phoneTestDom(); const begin = vi.fn();
    Object.assign(env.doc.body, { getAttribute: (name: string) => env.doc.body.attributes[name] ?? null });
    await env.render(<><MobileEntryPresentation /><AuthGate><OpeningSequence profile={createFreshProfile()}
      initialStep="founder" campaignSeed="fixture.seed" onBeginClinic={begin} onResumeCampaign={noop} onRestoreCampaign={noop} /></AuthGate></>);
    expect(env.element.textContent).toContain("Local Prototype"); await env.click("Enter Local Prototype");
    expect(auth.save).toHaveBeenCalledExactlyOnceWith(auth.local); expect(env.element.textContent).toContain("Open Your Clinic");
    const inputs = allElements(env.element, node => node.tagName === "INPUT" && node.attributes.type !== "checkbox");
    await act(async () => {
      (testElementProps(inputs[0]!).onChange as (event: unknown) => void)({ target: { value: "Fixture Founder" } });
      (testElementProps(inputs[1]!).onChange as (event: unknown) => void)({ target: { value: "Fixture Clinic" } });
    });
    await env.click("Next founder"); await env.click("Previous founder");
    const form = env.find(node => node.tagName === "FORM");
    await act(async () => {
      const submit = testElementProps(form).onSubmit as (event: { preventDefault: () => void }) => void;
      submit({ preventDefault: noop }); submit({ preventDefault: noop });
    });
    expect(begin).toHaveBeenCalledOnce(); expect(begin.mock.calls[0]?.slice(1)).toEqual(["Fixture Clinic", "fixture.seed", true]);
    expect(begin.mock.calls[0]?.[0].displayName).toBe("Fixture Founder");
  });
  it("keeps complete desktop opening markup identical and scopes every phone entry CSS selector to its flag", () => {
    const opening = <OpeningSequence profile={createFreshProfile()} initialStep="founder" onBeginClinic={noop} onResumeCampaign={noop} onRestoreCampaign={noop} />;
    expect(renderToStaticMarkup(<><MobileEntryPresentation />{opening}</>)).toBe(renderToStaticMarkup(opening));
    const css = readFileSync(new URL("./mobileEntry.css", import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    expect(css).toContain('min-height: 44px'); expect(css).toContain('font-size: 16px');
    expect(css).toContain('grid-template-columns: 48px minmax(0, 1fr) 48px');
    for (const selector of css.matchAll(/(?:^|\})\s*([^@\s{}][^{}]*)\{/g)) expect(selector[1]).toMatch(/^body\[data-phone-entry="true"\]/);
  });
});
