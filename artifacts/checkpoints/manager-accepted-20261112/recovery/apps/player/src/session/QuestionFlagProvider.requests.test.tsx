import { act } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { QuestionFlagProvider } from "./QuestionFlagProvider";
import { accountStorageKey } from "./accountStorageKey";
import { HOSTED_FLAGS_KEY, type HostedQuestionFlag } from "./hostedQuestionFlags";
import { phoneTestDom, cleanupPhoneTests } from "../mobile/screenTestUtils";
import { setAccountRequestsActive } from "./requestBudget";

const fixture = vi.hoisted(() => ({ listeners: new Set<() => void>(), read: vi.fn(async () => []), send: vi.fn() }));
vi.mock("../auth/AuthAccountContext", () => ({ useAuthAccountId: () => "poll.account" }));
vi.mock("../auth/prototypeAuth", () => ({ hostedAuthConfiguration: () => ({ supabaseUrl: "https://synthetic.invalid", supabaseAnonKey: "synthetic" }) }));
vi.mock("../auth/supabaseAuth", () => ({ getSupabaseAuthClient: () => ({}) }));
vi.mock("../playtime/UsageProvider", () => {
  const usage = { canRecordQuestions: () => true, status: () => ({ state: "ready" }),
    subscribe: (fn: () => void) => { fixture.listeners.add(fn); return () => fixture.listeners.delete(fn); } };
  return { useUsageTracking: () => usage };
});
vi.mock("./hostedQuestionFlags", async original => ({ ...await original<typeof import("./hostedQuestionFlags")>(),
  createFlagTransport: () => ({ read: fixture.read, send: fixture.send }) }));
afterEach(async () => { await cleanupPhoneTests(); vi.restoreAllMocks(); fixture.listeners.clear(); fixture.read.mockClear(); setAccountRequestsActive("poll.account", true); });

it("does not query flag statuses hidden/closed, coalesces resume bursts and stops its timer on unmount", async () => {
  const env = phoneTestDom(); let now = Date.now(), interval: (() => void) | undefined;
  const stored = new Map<string, string>(); Object.assign(env.browser.localStorage, {
    getItem: (key: string) => stored.get(key) ?? null, setItem: (key: string, value: string) => stored.set(key, value) });
  vi.spyOn(Date, "now").mockImplementation(() => now);
  const clear = vi.fn(); Object.assign(env.browser, { setInterval: (fn: () => void) => { interval = fn; return 1; }, clearInterval: clear });
  const payload: HostedQuestionFlag = { user_id: "poll.account", flag_id: "00000000-0000-4000-8000-000000000001", question_id: "slot", question_variant_id: "variant",
    question_variant_version: "v1", concept_id: "concept", concept_version: "v1", clinical_release_id: "release", content_version: "v1", app_version: "test",
    displayed_choice_order: ["a", "b"], chosen_answer_id: null, comment: "synthetic", flagged_at: new Date(now).toISOString() };
  env.browser.localStorage.setItem(accountStorageKey(HOSTED_FLAGS_KEY, "poll.account"), JSON.stringify({ schemaVersion: 1, entries: [{ contextKey: "ctx", payload, delivery: "sent", status: "open" }] }));
  await env.render(<QuestionFlagProvider><span>Game</span></QuestionFlagProvider>);
  expect(fixture.read).toHaveBeenCalledOnce();
  for (let i = 0; i < 100; i++) { interval?.(); env.browser.dispatchEvent(new Event("online")); }
  await act(async () => {}); expect(fixture.read).toHaveBeenCalledOnce();
  Object.assign(env.doc, { visibilityState: "hidden" }); now += 3_600_000;
  interval?.(); env.browser.dispatchEvent(new Event("online")); await act(async () => {}); expect(fixture.read).toHaveBeenCalledOnce();
  Object.assign(env.doc, { visibilityState: "visible" }); setAccountRequestsActive("poll.account", false);
  interval?.(); await act(async () => {}); expect(fixture.read).toHaveBeenCalledOnce();
  setAccountRequestsActive("poll.account", true); interval?.(); await act(async () => {}); expect(fixture.read).toHaveBeenCalledTimes(2);
  await env.render(null); expect(clear).toHaveBeenCalledOnce(); interval?.(); await act(async () => {}); expect(fixture.read).toHaveBeenCalledTimes(2);
});
