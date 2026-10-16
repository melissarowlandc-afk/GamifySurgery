import { act } from "react";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthGate } from "../auth/AuthGate";
import { useAuthAccountId } from "../auth/AuthAccountContext";
import { AccountMenu, UsageNotice } from "../ui/AccountMenu";
import { UsageProvider, useUsageTracking } from "./UsageProvider";
import { QuestionFlagProvider, useQuestionFlags } from "../session/QuestionFlagProvider";
import { usePrototypeSession, type PrototypeSession } from "../session/usePrototypeSession";
import { createFreshProfile, savePrototypeProfileResult, PROTOTYPE_PROFILE_KEY } from "../session/prototypeStorage";
import { createPrototypePlayerView } from "../session/viewModels";
import { loadQuestionReviewFlags, createQuestionReviewExport, recordQuestionReviewFlag, saveQuestionReviewFlags } from "../session/questionReviewFlags";
import { questionReviewContext } from "../session/questionReviewContext";
import { accountStorageKey } from "../session/accountStorageKey";
import { HOSTED_FLAGS_KEY, type QuestionFlagQueue } from "../session/hostedQuestionFlags";
import { USAGE_OUTBOX_KEY } from "./usageOutbox";
import { USAGE_NOTICE_TEXT, USAGE_NOTICE_VERSION, type UsageReceipt } from "./usageTypes";
import type { PlaytimeTracker } from "./playtimeTracker";
import { scoredPatientFixture } from "./usageTestFixtures";
import { ChartPanel } from "../ui/ChartPanel";
import { MobileChart } from "../mobile/MobileChart";
import { cleanupPhoneTests, phoneTestDom } from "../mobile/screenTestUtils";
import { testElementProps } from "../mobile/testDom";
import { VersionLabel } from "../appVersion";

const backend = vi.hoisted(() => ({
  session: null as Session | null, listener: null as ((event: AuthChangeEvent, session: Session | null) => void) | null,
  notice: false, deleted: false, admitted: true, flagOnline: true, failDelete: false, loseFlagAck: false, failNotice: false,
  receipts: new Map<string, UsageReceipt>(), flags: new Map<string, Record<string, unknown>>(),
  rpcCalls: [] as { name: string; args: Record<string, unknown> }[],
  getSession: vi.fn(), getUser: vi.fn(), signIn: vi.fn(), signOut: vi.fn(), update: vi.fn(), network: vi.fn(),
}));

// The real adapters/gate run against a synthetic Supabase client, never fetch.
vi.mock("@supabase/supabase-js", () => ({ createClient: () => ({ auth: {
  getSession: backend.getSession, getUser: backend.getUser, signInWithPassword: backend.signIn,
  signOut: backend.signOut, updateUser: backend.update,
  onAuthStateChange: (listener: typeof backend.listener) => {
    backend.listener = listener; return { data: { subscription: { unsubscribe: () => { backend.listener = null; } } } };
  },
}, rpc: (name: string, args: Record<string, unknown>) => ({ setHeader: async (_key: string, value: string) => {
  expect(value).toBe(`Bearer ${backend.session?.access_token}`);
  backend.rpcCalls.push({ name, args });
  if (name === "get_usage_access") return { data: { admitted: backend.admitted, notice_accepted: backend.notice, deletion_requested: backend.deleted }, error: null };
  if (name === "accept_usage_notice") {
    if (backend.failNotice) return { data: null, error: { message: "Synthetic notice failure" } };
    expect(args).toEqual({ p_version: "beta1.usage.v1" }); backend.notice = true; return { data: null, error: null };
  }
  if (name === "request_usage_data_deletion") {
    if (backend.failDelete) return { data: null, error: { message: "Synthetic offline error" } };
    backend.deleted = true; backend.notice = false; backend.receipts.clear(); backend.flags.clear(); return { data: null, error: null };
  }
  if (name === "ingest_player_usage") {
    expect(backend.notice && backend.admitted && !backend.deleted).toBe(true);
    const receipts = args.p_receipts as UsageReceipt[];
    for (const receipt of receipts) {
      if (backend.receipts.has(receipt.receipt_id)) expect(backend.receipts.get(receipt.receipt_id)).toEqual(receipt);
      backend.receipts.set(receipt.receipt_id, receipt);
    }
    return { data: { acknowledged_receipt_ids: receipts.map((receipt) => receipt.receipt_id) }, error: null };
  }
  throw new Error(`Unexpected mock RPC ${name}`);
} }), from: (table: string) => {
  expect(table).toBe("question_flags");
  let payload: Record<string, unknown> | null = null;
  const filters = new Map<string, unknown>(); let ids: string[] | null = null; let header = "";
  const execute = async (single = false) => {
    expect(header).toBe(`Bearer ${backend.session?.access_token}`);
    if (!backend.flagOnline) throw new Error("Synthetic offline flag service");
    if (payload) {
      expect(backend.notice && backend.admitted && !backend.deleted).toBe(true);
      expect(payload.user_id).toBe(backend.session?.user.id);
      const id = payload.flag_id as string;
      if (backend.flags.has(id)) return { data: null, error: { code: "23505" } };
      backend.flags.set(id, { ...payload, status: "open", fixed_in_version: null });
      if (backend.loseFlagAck) { backend.loseFlagAck = false; throw new Error("Synthetic lost acknowledgement"); }
      return { data: backend.flags.get(id), error: null };
    }
    const rows = [...backend.flags.values()].filter((row) => [...filters].every(([key, value]) => row[key] === value) &&
      (!ids || ids.includes(row.flag_id as string)));
    return { data: single ? rows[0] ?? null : rows, error: null };
  };
  const builder = {
    insert: (value: Record<string, unknown>) => { payload = value; return builder; },
    select: (_columns: string) => builder,
    eq: (key: string, value: unknown) => { filters.set(key, value); return builder; },
    in: (_key: string, value: string[]) => { ids = value; return builder; },
    setHeader: (_key: string, value: string) => { header = value; return builder; },
    single: () => execute(true),
    then: (resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) => execute().then(resolve, reject),
  };
  return builder;
} }) }));
vi.mock("react-dom", async (original) => ({ ...await original<typeof import("react-dom")>(), createPortal: (node: unknown) => node }));

const accountId = "11111111-1111-4111-8111-111111111111";
function session(): Session {
  return { access_token: "synthetic-beta1", refresh_token: "synthetic-refresh", expires_in: 3600, token_type: "bearer",
    user: { id: accountId, aud: "authenticated", created_at: "2026-10-13T00:00:00Z", email: "beta1@example.invalid",
      invited_at: "2026-10-13T00:00:00Z", email_confirmed_at: "2026-10-13T00:00:00Z", app_metadata: {}, user_metadata: {} } };
}
let current!: PrototypeSession;
let usage: PlaytimeTracker | null = null;
let flagQueue: QuestionFlagQueue | null = null;
let mono = 0;
const intervals = new Map<number, { callback: () => void; ms: number }>();
let intervalId = 0;
type Harness = ReturnType<typeof phoneTestDom>;
function FlowGame({ layout }: { layout: "desktop" | "phone" }) {
  current = usePrototypeSession(); usage = useUsageTracking();
  flagQueue = useQuestionFlags();
  const account = useAuthAccountId();
  const view = createPrototypePlayerView(current.state, current.state.openChartEncounterId, false, null,
    false, null, 0, undefined, current.questionReviewFlags);
  const chartProps = { chart: view.chart!, onClose: current.closeChart, onSubmitAnswer: current.submitAnswer,
    onFlagQuestion: current.flagQuestionForReview, onAcknowledgeTerminalFeedback: current.acknowledgeTerminalFeedback,
    onToggleSummary: current.toggleSummary, onFileChart: current.fileChart };
  return <>
    <p>Playing {account ?? "local"}</p>
    <button type="button" onClick={current.togglePause}>Toggle synthetic pause</button>
    {view.chart ? layout === "phone" ? <MobileChart {...chartProps} /> : <ChartPanel {...chartProps} /> : null}
    <AccountMenu /><VersionLabel />
  </>;
}
async function setup(layout: "desktop" | "phone", invite = true, configured = true) {
  const env = phoneTestDom(); const stored = new Map<string, string>();
  Object.assign(env.browser.location, { origin: "https://melissarowlandc-afk.github.io", hash: invite ? "#type=invite" : "", search: `?layout=${layout}` });
  Object.assign(env.browser.localStorage, { getItem: (key: string) => stored.get(key) ?? null,
    setItem: (key: string, value: string) => stored.set(key, value), removeItem: (key: string) => stored.delete(key) });
  Object.assign(env.browser, { setInterval: (callback: () => void, ms: number) => { intervals.set(++intervalId, { callback, ms }); return intervalId; },
    clearInterval: (id: number) => intervals.delete(id) });
  Object.assign(env.doc, { visibilityState: "visible" });
  Object.assign(env.browser.navigator, { locks: { request: async (_name: string, _options: unknown, callback: (lock: object) => Promise<void>) => callback({}) } });
  const state = scoredPatientFixture();
  const profile = { ...createFreshProfile(), tutorialsEnabled: false, activeCampaignId: state.campaignId,
    campaigns: [{ campaignId: state.campaignId, name: "Synthetic Beta 1 clinic", createdAtRealMs: Date.now(), updatedAtRealMs: Date.now(), status: "resumable" as const, state }] };
  expect(savePrototypeProfileResult(profile, configured ? accountId : null).ok).toBe(true);
  stored.set("gamify-surgery.prototype.save.v1", "Protected legacy bytes");
  vi.stubGlobal("fetch", backend.network);
  await env.render(<AuthGate><UsageProvider><QuestionFlagProvider><UsageNotice /><FlowGame layout={layout} /></QuestionFlagProvider></UsageProvider></AuthGate>);
  return { env, stored };
}
async function changeInput(env: Harness, tag: string, type: string | null, value: string) {
  await act(async () => {
    const input = env.find((node) => node.tagName === tag && (!type || testElementProps(node).type === type));
    (testElementProps(input).onChange as (event: unknown) => void)({ target: { value } });
  });
}
async function submitForm(env: Harness) {
  await act(async () => { await (testElementProps(env.find((node) => node.tagName === "FORM")).onSubmit as (event: unknown) => Promise<void>)({ preventDefault() {} }); });
}
async function signIn(env: Harness) {
  await changeInput(env, "INPUT", "email", "beta1@example.invalid");
  await changeInput(env, "INPUT", "password", "synthetic sign-in passphrase"); await submitForm(env);
}
async function heartbeat(seconds = 60) {
  const started = Date.now();
  for (let i = 1; i <= seconds; i++) await act(async () => {
    mono += 1_000; vi.setSystemTime(started + i * 1_000);
    for (const timer of [...intervals.values()].filter((timer) => timer.ms === 1_000)) timer.callback();
  });
}

beforeEach(() => {
  vi.resetAllMocks(); vi.useFakeTimers({ toFake: ["Date"] }); vi.setSystemTime(Date.UTC(2026, 9, 13, 12));
  mono = 0; intervals.clear(); intervalId = 0; usage = null; flagQueue = null;
  vi.spyOn(performance, "now").mockImplementation(() => mono);
  vi.stubEnv("VITE_SUPABASE_URL", "https://synthetic.supabase.co"); vi.stubEnv("VITE_SUPABASE_ANON_KEY", "synthetic-public-key");
  vi.stubEnv("VITE_ENABLE_LOCAL_PROTOTYPE_BYPASS", "false"); vi.stubEnv("BASE_URL", "/GamifySurgery/");
  backend.session = session(); backend.notice = false; backend.deleted = false; backend.admitted = true; backend.flagOnline = true; backend.failDelete = false; backend.loseFlagAck = false;
  backend.flags.clear(); backend.receipts.clear(); backend.rpcCalls = []; backend.failNotice = false;
  backend.getSession.mockImplementation(async () => ({ data: { session: backend.session }, error: null }));
  backend.getUser.mockImplementation(async () => ({ data: { user: backend.session?.user ?? null }, error: null }));
  backend.update.mockResolvedValue({ error: null });
  backend.signIn.mockImplementation(async () => { backend.session = session(); return { data: { session: backend.session }, error: null }; });
  backend.signOut.mockImplementation(async () => { backend.session = null; backend.listener?.("SIGNED_OUT", null); return { error: null }; });
  backend.network.mockImplementation(() => { throw new Error("No network is allowed in Beta 1 integration tests"); });
});
afterEach(async () => {
  await cleanupPhoneTests(); vi.restoreAllMocks(); vi.unstubAllEnvs();
  expect(backend.network).not.toHaveBeenCalled();
});

describe("Beta 1 real adapter integration with a mocked Supabase client", () => {
  it.each(["desktop", "phone"] as const)("runs invite/password/sign-in/notice/play/count/comment/sign-out/re-sign-in/deletion in %s", async (layout) => {
    const { env, stored } = await setup(layout);
    expect(env.element.textContent).toContain("Set Your Password"); expect(backend.rpcCalls).toEqual([]);
    await changeInput(env, "INPUT", "password", "synthetic invitation passphrase"); await submitForm(env);
    expect(backend.update).toHaveBeenCalledExactlyOnceWith({ password: "synthetic invitation passphrase" });
    await env.click("Sign out"); await signIn(env);
    expect(env.element.textContent).toContain(USAGE_NOTICE_TEXT);
    expect(usage?.canRecordQuestions()).toBe(false);
    await heartbeat(); expect(backend.receipts.size).toBe(0);
    expect(backend.rpcCalls.some((call) => call.name === "ingest_player_usage")).toBe(false);
    await env.click("Accept");
    expect(backend.rpcCalls).toContainEqual({ name: "accept_usage_notice", args: { p_version: USAGE_NOTICE_VERSION } });
    expect(usage?.canRecordQuestions()).toBe(true);
    expect(current.state.paused).toBe(true); await env.click("Toggle synthetic pause");
    await act(async () => { usage!.activity(); });
    await heartbeat();
    const time = [...backend.receipts.values()].filter((receipt) => receipt.kind === "playtime").reduce((sum, receipt) => sum + receipt.active_ms, 0);
    expect(time).toBe(60_000);
    const encounter = current.state.encounters[current.state.openChartEncounterId!]!;
    const node = encounter.frozenCase.decisionNodes[0]!;
    const selected = node.answerChoices.find((choice) => choice.isCorrect)!.id;
    await act(async () => { current.submitAnswer(selected); });
    await act(async () => { await usage!.flush(); });
    expect([...backend.receipts.values()].filter((receipt) => receipt.kind === "question")).toHaveLength(1);
    for (const receipt of backend.receipts.values()) {
      expect(receipt).not.toHaveProperty("chosen_answer_id"); expect(receipt).not.toHaveProperty("question_id"); expect(receipt).not.toHaveProperty("correct");
    }
    await env.click("Flag this question for developer review");
    await changeInput(env, "TEXTAREA", null, "Please review the wording.");
    await env.click("Submit flag");
    // Web Crypto completes outside the React microtask batch.
    await act(async () => { await vi.waitFor(() => expect(backend.flags.size).toBe(1)); });
    const flag = [...backend.flags.values()][0]!;
    expect(flag).toMatchObject({ comment: "Please review the wording.", chosen_answer_id: selected, clinical_release_id: encounter.clinicalReleaseId });
    expect(flag.displayed_choice_order).toEqual(node.answerChoices.map((choice) => choice.id));
    expect(env.element.textContent).toContain("Thanks, flag sent · open");
    expect(env.element.textContent).toContain("Version 0.1.0-beta.1");
    expect(env.element.textContent).toContain("Saves stay on this device until cloud saves arrive.");
    const savedCampaign = stored.get(accountStorageKey(PROTOTYPE_PROFILE_KEY, accountId));
    await env.click("Sign out"); await signIn(env);
    expect(env.element.textContent).not.toContain("Before you play");
    expect(usage!.canRecordQuestions()).toBe(true);
    expect(current.questionReviewFlags).toHaveLength(1);
    await env.click("Delete my usage data");
    expect(backend.deleted).toBe(false);
    await env.click("Cancel deletion"); expect(backend.deleted).toBe(false);
    await env.click("Delete my usage data"); await env.click("Confirm delete my usage data");
    expect(backend.deleted).toBe(true); expect(backend.flags.size).toBe(0); expect(backend.receipts.size).toBe(0);
    expect(usage!.canRecordQuestions()).toBe(false);
    expect(env.element.textContent).toContain("Usage and submitted flags deleted. Recording is off");
    expect(JSON.parse(stored.get(accountStorageKey(HOSTED_FLAGS_KEY, accountId))!).entries).toEqual([]);
    expect(loadQuestionReviewFlags(undefined, accountId)).toEqual([]);
    expect(stored.get("gamify-surgery.prototype.save.v1")).toBe("Protected legacy bytes");
    expect(savedCampaign).toBeDefined(); expect(stored.has(accountStorageKey(PROTOTYPE_PROFILE_KEY, accountId))).toBe(true);
    await heartbeat(); expect(backend.receipts.size).toBe(0);
  });

  it("keeps deletion off immediately on failure, and retries after another sign-in", async () => {
    backend.notice = true; backend.failDelete = true;
    const { env } = await setup("phone", false);
    await env.click("Delete my usage data"); await env.click("Confirm delete my usage data");
    expect(usage!.canRecordQuestions()).toBe(false); expect(backend.deleted).toBe(false);
    expect(env.element.textContent).toContain("hosted deletion is not yet confirmed");
    await env.click("Sign out"); await signIn(env);
    expect(usage!.canRecordQuestions()).toBe(false);
    backend.failDelete = false;
    await env.click("Retry delete my usage data"); await env.click("Confirm delete my usage data");
    expect(backend.deleted).toBe(true);
  });

  it.each(["offline", "lost acknowledgement"])("retries a flag after %s with the identical payload and reads reviewed/fixed status", async (failure) => {
    backend.notice = true;
    const { env } = await setup("phone", false);
    backend.flagOnline = failure !== "offline"; backend.loseFlagAck = failure !== "offline";
    await env.click("Flag this question for developer review"); await changeInput(env, "TEXTAREA", null, "Queued comment"); await env.click("Submit flag");
    await act(async () => { await vi.waitFor(() => expect(flagQueue!.list()).toHaveLength(1)); });
    expect(flagQueue!.list()[0]!.delivery).toBe("pending"); expect(env.element.textContent).toContain("Waiting to send");
    const immutable = structuredClone(flagQueue!.list()[0]!.payload);
    backend.flagOnline = true;
    await act(async () => { await flagQueue!.flush(); });
    expect(backend.flags.size).toBe(1); expect(flagQueue!.list()[0]!.payload).toEqual(immutable);
    expect(env.element.textContent).toContain("Thanks, flag sent · open");
    const flag = backend.flags.get(immutable.flag_id)!;
    flag.status = "no_change";
    await act(async () => { await flagQueue!.refreshStatuses(); });
    expect(env.element.textContent).toContain("Thanks, flag sent · reviewed");
    flag.status = "fixed_in_version"; flag.fixed_in_version = "0.1.0-beta.2";
    await act(async () => { await flagQueue!.refreshStatuses(); });
    expect(env.element.textContent).toContain("Thanks, flag sent · fixed in 0.1.0-beta.2");
  });

  it("keeps tracking off after failed notice acceptance and does not auto-send historic local flags", async () => {
    const { env } = await setup("desktop", false);
    const state = current.state; const encounter = state.encounters[state.openChartEncounterId!]!;
    const context = questionReviewContext(state, encounter.id, encounter.frozenCase.decisionNodes[0]!.id)!;
    const historical = recordQuestionReviewFlag([], { ...context, comment: "Historic local report" }, Date.now() - 1_000).flags;
    expect(saveQuestionReviewFlags(historical, undefined, accountId)).toBe(true);
    backend.failNotice = true; await env.click("Accept");
    expect(env.element.textContent).toContain("Recording remains off"); expect(usage!.canRecordQuestions()).toBe(false);
    backend.failNotice = false; await env.click("Accept");
    await env.click("Sign out"); await signIn(env);
    expect(current.questionReviewFlags).toHaveLength(1);
    expect(flagQueue!.list()).toEqual([]); expect(backend.flags.size).toBe(0);
  });

  it.each(["desktop", "phone"] as const)("preserves the unconfigured %s local prototype, flags and exports", async (layout) => {
    vi.stubEnv("VITE_SUPABASE_URL", ""); vi.stubEnv("VITE_SUPABASE_ANON_KEY", ""); vi.stubEnv("VITE_ENABLE_LOCAL_PROTOTYPE_BYPASS", "true");
    backend.session = null;
    const { env, stored } = await setup(layout, false, false);
    await env.click("Enter Local Prototype");
    expect(usage).toBeNull(); expect(backend.getSession).not.toHaveBeenCalled(); expect(backend.rpcCalls).toEqual([]);
    expect(env.element.textContent).not.toContain("Before you play");
    expect(env.element.textContent).not.toContain("Account & privacy");
    await env.click("Flag this question for developer review"); await changeInput(env, "TEXTAREA", null, "Local comment"); await env.click("Submit flag");
    const flags = loadQuestionReviewFlags(); expect(flags).toHaveLength(1);
    expect(createQuestionReviewExport(flags).flags[0]?.comment).toBe("Local comment");
    expect(backend.flags.size).toBe(0); expect([...stored.keys()].some((key) => key.startsWith(HOSTED_FLAGS_KEY) || key.startsWith(USAGE_OUTBOX_KEY))).toBe(false);
    expect(stored.get("gamify-surgery.prototype.save.v1")).toBe("Protected legacy bytes");
  });
});
