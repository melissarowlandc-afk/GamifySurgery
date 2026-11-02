import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { INTRO_TAGLINES, LAST_INTRO_TAGLINE_SESSION_KEY } from "../content/introTaglines";
import { allElements, cleanupPhoneTests, phoneTestDom } from "./testDomHarness";
import { LoadingScreen, LOADING_DELAY_MS } from "./LoadingScreen";
import { OpeningBrand } from "./OpeningBrand";

// These presentation tests do not exercise feedback submission. Its real
// consent/recovery integration remains covered by LoadingScreen/feedback tests.
vi.mock("../feedback/TesterFeedback", () => ({ ProblemReportButton: () => null }));

afterEach(async () => { await cleanupPhoneTests(); vi.restoreAllMocks(); });
const advance = async (ms = LOADING_DELAY_MS) => { await act(async () => { await vi.advanceTimersByTimeAsync(ms); }); };
const displayed = (env: ReturnType<typeof phoneTestDom>) => allElements(env.doc.body, node => node.attributes["data-testid"] === "intro-tagline")[0]!.textContent;
function session(env: ReturnType<typeof phoneTestDom>) {
  const values = new Map([[LAST_INTRO_TAGLINE_SESSION_KEY, INTRO_TAGLINES[0] as string]]);
  Object.assign(env.browser, { sessionStorage: { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) } });
  return values;
}

describe("rotating welcome subtitles", () => {
  it("keeps one approved line through every stage, failure and Retry, then excludes it on the next load", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] }); vi.spyOn(Math, "random").mockReturnValue(0);
    const env = phoneTestDom(), values = session(env), retry = vi.fn();
    await env.render(<LoadingScreen status="Connecting…" stage="connecting" onRetry={retry} />);
    expect(values.get(LAST_INTRO_TAGLINE_SESSION_KEY)).toBe(INTRO_TAGLINES[0]);
    await advance(); const first = displayed(env);
    expect(INTRO_TAGLINES).toContain(first); expect(first).not.toBe(INTRO_TAGLINES[0]);
    expect(values.get(LAST_INTRO_TAGLINE_SESSION_KEY)).toBe(first);
    for (const stage of ["checking", "opening"] as const) {
      await env.render(<LoadingScreen status={`Stage ${stage}`} stage={stage} onRetry={retry} />);
      expect(displayed(env)).toBe(first);
    }
    await env.render(<LoadingScreen status="Opening…" failure="The check failed." onRetry={retry} />);
    await env.clickElement(allElements(env.doc.body, node => node.tagName === "BUTTON" && node.textContent === "Try again")[0]!);
    expect(retry).toHaveBeenCalledOnce(); expect(displayed(env)).toBe(first);
    await env.render(<LoadingScreen active={false} status="Opening…" />);
    await env.render(<LoadingScreen status="Connecting again…" />); await advance();
    expect(displayed(env)).not.toBe(first); expect(INTRO_TAGLINES).toContain(displayed(env));
    expect(allElements(env.doc.body, node => node.attributes["data-testid"] === "intro-tagline")).toHaveLength(1);
  });
  it("does not consume a subtitle for a check that never becomes visible", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const env = phoneTestDom(), values = session(env);
    await env.render(<LoadingScreen status="Checking…" />); await advance(LOADING_DELAY_MS - 1);
    await env.render(<LoadingScreen active={false} status="Checking…" />);
    expect(values.get(LAST_INTRO_TAGLINE_SESSION_KEY)).toBe(INTRO_TAGLINES[0]);
    expect(allElements(env.doc.body, node => node.attributes["data-testid"] === "intro-tagline")).toHaveLength(0);
  });
  it("shares the existing no-repeat rotation with sign-in and campaign headers", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const env = phoneTestDom(); session(env);
    await env.render(<OpeningBrand />); const first = displayed(env);
    await env.render(<OpeningBrand />); expect(displayed(env)).toBe(first);
    await env.render(<div />); await env.render(<OpeningBrand />);
    expect(displayed(env)).not.toBe(first); expect(INTRO_TAGLINES).toContain(displayed(env));
  });
});
