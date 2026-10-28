import { act, StrictMode } from "react";
import { writeFileSync } from "node:fs";
import { IDBFactory } from "fake-indexeddb";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT, serializeGameState, type GameState } from "@gamify-surgery/game-domain";
import { AppShell } from "../AppShell";
import { AuthAccountContext } from "../auth/AuthAccountContext";
import MobileShell from "../mobile/MobileShell";
import { allElements, cleanupPhoneTests, phoneFixture, phoneTestDom } from "../mobile/screenTestUtils";
import { testElementProps } from "../mobile/testDom";
import { PlaytimeTracker } from "../playtime/playtimeTracker";
import { UsageOutbox } from "../playtime/usageOutbox";
import { scoredEmployeeFixture, scoredPatientFixture } from "../playtime/usageTestFixtures";
import { accountStorageKey } from "./accountStorageKey";
import { MemoryCloudCache } from "./cloud/cache";
import { CloudCacheError, type CloudCacheEntry } from "./cloud/cache";
import { codecTestCampaign } from "./cloud/codecTestSupport";
import { prepareCloudEvidenceImport } from "./cloud/codecEvidence";
import { decompressCloudText } from "./cloud/codecCompression";
import { CloudSyncCoordinator } from "./cloud/coordinator";
import { FakeCloudServer } from "./cloud/fakeTransport";
import { CloudGameSession } from "./cloud/gameSession";
import { MemoryCloudEntryStore } from "./cloud/entryStorage";
import { profileForCloudCampaign } from "./cloud/importCampaigns";
import { TestCloudClock } from "./cloud/syncTestSupport";
import { CLOUD_LEASE_MS } from "./cloud/transport";
import { HOSTED_FLAGS_KEY, type FlagTransport, type HostedQuestionFlag } from "./hostedQuestionFlags";
import { createFreshProfile, PROTOTYPE_PROFILE_KEY, savePrototypeProfileResult, type LocalPrototypeProfile } from "./prototypeStorage";
import { createLevelFiveIntegrationQaState } from "../../../../tests/fixtures/level-five-integration-qa";
import { QuestionFlagProvider } from "./QuestionFlagProvider";
import { loadQuestionReviewFlags, QUESTION_REVIEW_FLAGS_STORAGE_KEY } from "./questionReviewFlags";
import { usePrototypeSession, type PrototypeSession } from "./usePrototypeSession";
import { createPrototypePlayerView } from "./viewModels";

const context = vi.hoisted(() => ({ tracker: null as PlaytimeTracker | null, transport: null as FlagTransport | null }));
vi.mock("../playtime/UsageProvider", () => ({ useUsageTracking: () => context.tracker, useCasualMode: () => context.tracker?.casualMode() ?? false }));
vi.mock("../auth/prototypeAuth", async original => ({
  ...await original<typeof import("../auth/prototypeAuth")>(),
  hostedAuthConfiguration: () => ({ supabaseUrl: "https://synthetic.invalid", supabaseAnonKey: "synthetic-key" }),
}));
vi.mock("../auth/supabaseAuth", () => ({ getSupabaseAuthClient: () => ({}) }));
vi.mock("./hostedQuestionFlags", async original => ({
  ...await original<typeof import("./hostedQuestionFlags")>(), createFlagTransport: () => context.transport,
}));
vi.mock("../facility", () => ({ FacilityCanvas: () => <div>Fixture map</div> }));
vi.mock("../mobile/map/MobileFacilityMap", () => ({ MobileFacilityMap: () => <div>Fixture map</div> }));
vi.mock("react-dom", async original => ({ ...await original<typeof import("react-dom")>(), createPortal: (node: unknown) => node }));

const accountId = "account.flag-freeze";
afterEach(async () => {
  await cleanupPhoneTests(); context.tracker?.stop(); context.tracker = null; context.transport = null; vi.restoreAllMocks();
});

const reportedVariant = "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v4";
async function fixture(layout: "phone" | "desktop", employee: boolean, casual: boolean, reported = false, large = false, automatic = false) {
  const env = phoneTestDom(), stored = new Map<string, string>();
  const budget = { localLimit: Infinity, sharedLimit: Infinity, denyCloud: false, failedCloudWrites: 0 };
  const localBytes = () => [...stored].reduce((total, [key, value]) => total + 2 * (key.length + value.length), 0);
  env.browser.innerWidth = layout === "phone" ? 390 : 1280;
  Object.assign(env.browser.location, {
    origin: "https://melissarowlandc-afk.github.io", pathname: "/GamifySurgery/", search: "",
    href: "https://melissarowlandc-afk.github.io/GamifySurgery/",
  });
  const storage = { getItem: (key: string) => stored.get(key) ?? null,
    get length() { return stored.size; }, key: (index: number) => [...stored.keys()][index] ?? null,
    setItem: (key: string, value: string) => {
      const size = localBytes() - (stored.has(key) ? 2 * (key.length + stored.get(key)!.length) : 0) + 2 * (key.length + value.length);
      if (size > budget.localLimit) throw new DOMException("Synthetic 5 MiB quota", "QuotaExceededError");
      stored.set(key, value);
    }, removeItem: (key: string) => { stored.delete(key); } };
  Object.defineProperty(env.browser, "localStorage", { value: storage });
  Object.assign(env.doc, { visibilityState: "visible" });
  Object.assign(env.browser, { setInterval: vi.fn(() => 1), clearInterval: vi.fn() });
  context.tracker = new PlaytimeTracker(new UsageOutbox(accountId, storage, Date.now), {
    access: async () => ({ admitted: true, notice_accepted: true, deletion_requested: false, casual }),
    acceptNotice: async () => {}, requestDeletion: async () => {}, ingest: async rows => rows.map(row => row.receipt_id),
  }, { monotonic: () => 0, wall: Date.now }, () => crypto.randomUUID());
  await context.tracker.refreshAccess();
  context.transport = { send: vi.fn(async () => ({ status: "open" as const, fixedInVersion: null })), read: vi.fn(async () => []) };
  const state = employee ? scoredEmployeeFixture() : large ? createLevelFiveIntegrationQaState("integration-running", PROTOTYPE_DOMAIN_CONTEXT) : scoredPatientFixture();
  if (large) {
    const encounter = structuredClone(Object.values(scoredPatientFixture().encounters)[0]!);
    encounter.id = "encounter.flag-quota";
    state.encounters[encounter.id] = encounter; state.openChartEncounterId = encounter.id; state.openEmployeeDiscussionId = null;
  }
  const subjectId = employee ? state.openEmployeeDiscussionId! : state.openChartEncounterId!;
  if (reported) {
    const encounter = Object.values(state.encounters)[0]!;
    const clinicalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(value => value.decisionNodes.some(node => node.questionVariantId === reportedVariant))!;
    expect(clinicalCase).toBeDefined();
    expect(clinicalCase.decisionNodes[0]!.questionVariantId).toBe(reportedVariant);
    encounter.frozenCase = structuredClone(clinicalCase);
    encounter.clinicalReleaseId = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.id;
    encounter.steps = clinicalCase.decisionNodes.map((node, nodeIndex) => ({ nodeIndex, decisionNodeId: node.id,
      questionVariantId: node.questionVariantId, primaryConceptId: node.primaryConceptId,
      status: nodeIndex === 0 ? "action_required" : "locked", answer: null, result: null }));
  }
  if (employee) {
    // Unlike the in-memory scoring fixture, a persisted discussion needs its
    // actual colleague with the case's required role to survive save validation.
    const discussion = Object.values(state.employeeDiscussions!)[0]!;
    state.employees.push({ id: discussion.employeeId, displayName: discussion.employeeDisplayName,
      staffRoleDefinitionId: discussion.frozenCase.participant!.requiredStaffRoleDefinitionIds[0]!,
      appearance: state.founder.appearance, hiredAtFacilityTick: 0, salaryPerExpenseInterval: 0,
      morale: 100, trainingLevel: 1, homeRoomInstanceId: state.rooms[0]!.id,
      location: { x: state.rooms[0]!.x, y: state.rooms[0]!.y }, path: [], pathIndex: 0, lastMovedAtFacilityTick: 0,
      lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: 999, facilityTask: null });
  }
  const campaign = codecTestCampaign(serializeGameState(state));
  campaign.name = "Synthetic flag clinic";
  campaign.tutorial = { guidance: { version: 2, mode: "off", exposedTopicIds: [] }, introDismissed: true,
    dailyRoutineTipAcknowledgments: [], dailyRoutinePause: null };
  const prepared = await prepareCloudEvidenceImport({ serializedState: serializeGameState(state), campaign, operationId: "flag-freeze.import" });
  class QuotaCloudCache extends MemoryCloudCache {
    async write(entry: CloudCacheEntry, expected: number | null) {
      const projected = localBytes() + new TextEncoder().encode(JSON.stringify(entry)).length;
      if (budget.denyCloud || projected > budget.sharedLimit) { budget.failedCloudWrites++; throw new CloudCacheError("quota"); }
      return super.write(entry, expected);
    }
  }
  const clock = new TestCloudClock(), server = new FakeCloudServer(() => clock.wall), cache = new QuotaCloudCache(), entryStore = new MemoryCloudEntryStore();
  server.seed(accountId, { campaignId: state.campaignId, revision: "1", acceptedAtMs: clock.wall,
    baselineId: prepared.envelope.baselineId, snapshot: prepared.snapshot, evidence: prepared.packedEvidence });
  let cloud!: CloudGameSession, current!: PrototypeSession, failLocalCopy = false;
  const checkpoints: unknown[] = [];
  const profileFor = (value: GameState): LocalPrototypeProfile => profileForCloudCampaign(value, cloud.metadata);
  function Game() {
    current = usePrototypeSession({ profile: profileFor(cloud.state), notice: "Verified synthetic campaign." }, cloud);
    const view = createPrototypePlayerView(current.state, current.state.openChartEncounterId, current.summaryVisible,
      null, false, null, 0, current.facilityCamera, current.questionReviewFlags, casual);
    const props = phoneFixture({ ...view, paused: current.state.paused, campaigns: current.campaigns,
      questionReviewFlags: current.questionReviewFlags, announcement: current.announcement,
      cloudSave: { campaignName: "Synthetic flag clinic", view: cloud.syncView, writerElsewhere: false,
        onContinue: async () => cloud.coordinator.resume(), onRetry: () => automatic ? cloud.reconnect() : cloud.coordinator.retry(),
        onUseAccountSave: async () => false, onKeepRecovery: async () => true,
        onSaveAndClose: () => Promise.resolve(false), onCampaigns: vi.fn() },
      onFlagQuestion: (...args) => {
        if (failLocalCopy) throw new Error("Synthetic optional local-copy failure");
        current.flagQuestionForReview(...args);
      }, onQuestionReviewStatusChange: current.setQuestionReviewStatus,
      onSubmitAnswer: current.submitAnswer, onCloseChart: current.closeChart, onOpenPatient: current.openPatient,
      onTogglePause: current.togglePause, onCloseEmployeeDiscussion: current.closeEmployeeDiscussion,
      onOpenEmployeeDiscussion: current.openEmployeeDiscussion, onAnswerEmployeeDiscussion: current.answerEmployeeDiscussion,
      onAcknowledgeEmployeeDiscussion: current.acknowledgeEmployeeDiscussion, onFileEmployeeDiscussion: current.fileEmployeeDiscussion,
      onAcknowledgeTerminalFeedback: current.acknowledgeTerminalFeedback, onToggleSummary: current.toggleSummary,
      onFileChart: current.fileChart });
    return layout === "phone" ? <MobileShell {...props} /> : <AppShell {...props} />;
  }
  const mount = async () => {
    const transport = server.transport(accountId), commit = transport.commit;
    transport.commit = async operation => {
      const request = JSON.parse(operation.requestText);
      checkpoints.push({ expectedRevision: request.expectedRevision, campaign: request.campaign,
        snapshotSha256: request.snapshot.uncompressedSha256, records: request.evidence.toRecord });
      return commit(operation);
    };
    const coordinator = new CloudSyncCoordinator({ scope: { backendId: "synthetic", accountId, campaignId: state.campaignId },
      transport, cache, clock, enabled: true, ...(automatic ? { entryStore } : {}) });
    expect(await coordinator.open()).toBe(true);
    cloud = await CloudGameSession.create(coordinator);
    if (automatic) expect(await cloud.reconnect()).toBe(true);
    else { expect(await coordinator.startWriter()).toBe(true); expect(coordinator.resume()).toBe(true); }
    const game = <AuthAccountContext.Provider value={accountId}><QuestionFlagProvider><Game /></QuestionFlagProvider></AuthAccountContext.Provider>;
    await env.render(automatic ? <StrictMode>{game}</StrictMode> : game);
    if (automatic) await vi.waitFor(() => {
      expect(cloud.canExecute, JSON.stringify(cloud.syncView)).toBe(true);
      expect(cloud.syncView).toMatchObject({ phase: "ready", pending: false });
    }, { timeout: large ? 10_000 : 1_000 });
  };
  await mount();
  const subject = () => employee ? current.state.employeeDiscussions![subjectId]! : current.state.encounters[subjectId]!;
  const answer = () => subject().frozenCase.decisionNodes[subject().currentNodeIndex]!.answerChoices.find(choice => choice.isCorrect)!;
  const submitFlag = async () => {
    await env.click("Flag this question for developer review");
    await act(async () => { (testElementProps(env.find(node => node.tagName === "TEXTAREA")).onChange as (event: unknown) => void)({ target: { value: "Synthetic tester comment" } }); });
    await env.click("Submit flag");
    await vi.waitFor(() => expect(context.transport!.send).toHaveBeenCalledOnce());
    await act(async () => { await Promise.resolve(); });
  };
  return { env, stored, storage, submitFlag, answer, subject, current: () => current, cloud: () => cloud, server,
    budget, localBytes, cache, clock, checkpoints,
    failLocalCopy: () => { failLocalCopy = true; },
    reload: async () => { await env.render(null); clock.advance(automatic ? 250 : CLOUD_LEASE_MS + 1); await mount(); } };
}

describe("reported hosted flag recovery boundaries", () => {
  it.each(["phone", "desktop"] as const)("keeps cloud play working when only localStorage rejects flag writes in %s", async layout => {
    vi.stubGlobal("indexedDB", new IDBFactory());
    const f = await fixture(layout, false, false);
    f.budget.localLimit = f.localBytes() + 512;
    await f.submitFlag();
    expect(context.transport!.send).toHaveBeenCalledOnce();
    expect(f.cloud().canExecute).toBe(true);
    await f.env.click("Resume facility time");
    await act(async () => { expect(await f.cloud().durable()).toBe(true); expect(await f.cloud().checkpointNow("ordinary")).toBe(true); });
    await f.reload();
    await vi.waitFor(() => expect(f.current().questionReviewFlags).toHaveLength(1));
    expect(f.current().questionReviewFlags[0]!.comment).toBe("Synthetic tester comment");
    expect(f.env.button("Question flagged for developer review").attributes.disabled).toBe("");
    expect(context.transport!.send).toHaveBeenCalledOnce(); expect(f.cloud().canExecute).toBe(true);
  });
  it.each(["phone", "desktop"] as const)("prioritizes a real Level 5 campaign over auxiliary growth under a modeled 5 MiB shared quota in %s", async layout => {
    vi.stubGlobal("indexedDB", new IDBFactory());
    const f = await fixture(layout, false, false, false, true, true);
    // Real Level 5 checkpoint data, plus a legacy local profile retained from
    // before cloud enrollment. No synthetic padding is added to the campaign.
    const profile: LocalPrototypeProfile = { ...createFreshProfile(), activeCampaignId: f.current().state.campaignId,
      campaigns: [{ campaignId: f.current().state.campaignId, name: "Level 5 prior local clinic", status: "resumable",
        createdAtRealMs: 0, updatedAtRealMs: 0, state: f.current().state }] };
    expect(savePrototypeProfileResult(profile, accountId).ok).toBe(true);
    const profileKey = accountStorageKey(PROTOTYPE_PROFILE_KEY, accountId), originalProfile = f.stored.get(profileKey)!;
    expect(originalProfile.length).toBeGreaterThan(100_000);
    // Model a shared origin budget separately from localStorage-only quota.
    // An oversized legacy cache consumes the remaining space; its contents are
    // reconstructible, unlike either campaign or cloud recovery records.
    const limit = 5 * 1024 * 1024, optionalKey = "gamify-surgery.competition.v1.legacy-cache";
    const cacheBytes = new TextEncoder().encode(JSON.stringify((await f.cache.read(f.cloud().coordinator.scope))!.entry)).length;
    f.storage.setItem(optionalKey, "x".repeat(Math.floor((limit - f.localBytes() - cacheBytes - 512) / 2) - optionalKey.length));
    f.budget.localLimit = limit; f.budget.sharedLimit = limit;
    const beforeFlag = f.localBytes();
    await f.submitFlag();
    expect(f.env.element.textContent).toContain("Thanks, flag sent");
    expect(f.budget.failedCloudWrites).toBe(0);
    // Also exercise an already-full legacy/older-tab cache appearing before
    // the next campaign write. The campaign writer must reclaim and retry.
    const currentCacheBytes = new TextEncoder().encode(JSON.stringify((await f.cache.read(f.cloud().coordinator.scope))!.entry)).length;
    f.storage.setItem(optionalKey, "x".repeat(Math.floor((limit - f.localBytes() - currentCacheBytes - 512) / 2) - optionalKey.length));
    await f.env.click("Resume facility time");
    await act(async () => { expect(await f.cloud().durable()).toBe(true); });
    expect(f.budget.failedCloudWrites).toBeGreaterThan(0);
    expect(f.cloud().canExecute).toBe(true); expect(f.stored.has(optionalKey)).toBe(false);
    expect(f.stored.get(profileKey)).toBe(originalProfile);
    const flags = f.current().questionReviewFlags, pending = f.cloud().coordinator.pendingCandidate;
    expect(flags).toHaveLength(1); expect(pending).not.toBeNull();
    const expectedRevision = String(BigInt(f.cloud().coordinator.confirmedRevision!) + 1n);
    // Kill without a close event or foreground checkpoint: next launch must
    // recognize this device and upload the newest durable local candidate.
    const saved = JSON.parse(serializeGameState(f.current().state));
    await f.reload();
    if (process.env.FLAG_FREEZE_EVIDENCE) {
      const facts = await Promise.all(f.cloud().coordinator.confirmed!.evidence.records.map(async row => JSON.parse(await decompressCloudText(row.content))));
      writeFileSync(`${process.env.FLAG_FREEZE_EVIDENCE}/lifecycle-quota-commands-${layout}.json`, JSON.stringify({ expectedRevision,
        actualRevision: f.cloud().coordinator.confirmedRevision, savedPaused: saved.paused, currentPaused: f.current().state.paused,
        checkpoints: f.checkpoints, commands: facts.filter(row => row.kind === "transition").map(row => row.value.command) }, null, 2));
    }
    expect(f.cloud().coordinator.pendingCandidate).toBeNull();
    expect(f.cloud().coordinator.confirmedRevision).toBe(expectedRevision);
    expect(allElements(f.env.element, node => node.tagName === "DIALOG" && node.attributes.class?.includes("cloud-dialog") === true)).toHaveLength(0);
    await vi.waitFor(() => expect(f.current().questionReviewFlags).toHaveLength(1));
    expect(JSON.parse(serializeGameState(f.current().state))).toEqual(saved);
    expect(f.current().questionReviewFlags[0]!.id).toBe(flags[0]!.id);
    expect(context.transport!.send).toHaveBeenCalledOnce();
    expect(f.env.button("Question flagged for developer review").attributes.disabled).toBe("");
    expect(f.stored.get(profileKey)).toBe(originalProfile);
    expect(f.cloud().canExecute).toBe(true);
    const measurements = { quotaModel: "shared localStorage UTF-16 + cloud-cache UTF-8", layout,
      limitBytes: limit, level5ProfileUtf16Bytes: originalProfile.length * 2, beforeFlagBytes: beforeFlag,
      failedCloudWrites: f.budget.failedCloudWrites, afterRecoveryBytes: f.localBytes() };
    if (process.env.FLAG_FREEZE_EVIDENCE) writeFileSync(`${process.env.FLAG_FREEZE_EVIDENCE}/quota-${layout}.json`, JSON.stringify(measurements, null, 2));
  }, 30_000);

  for (const layout of ["phone", "desktop"] as const) {
    it.each([false, true])(`automatically reopens the newest flagged ${layout} progress after a silent kill (team=%s)`, async employee => {
      const f = await fixture(layout, employee, true, false, false, true);
      await f.submitFlag(); const key = f.answer();
      await f.env.clickElement(f.env.find(node => node.tagName === "BUTTON" && node.textContent.includes(key.label)));
      await act(async () => { expect(await f.cloud().durable()).toBe(true); });
      const saved = JSON.parse(serializeGameState(f.current().state)), flags = f.current().questionReviewFlags;
      expect(f.cloud().coordinator.view.pending).toBe(true);
      await f.reload();
      expect(f.cloud().canExecute).toBe(true); expect(f.cloud().coordinator.view.pending).toBe(false);
      expect(JSON.parse(serializeGameState(f.current().state))).toEqual(saved);
      await vi.waitFor(() => expect(f.current().questionReviewFlags).toEqual(flags));
      expect(context.transport!.send).toHaveBeenCalledOnce();
      expect(allElements(f.env.element, node => node.tagName === "DIALOG" && node.attributes.class?.includes("cloud-dialog") === true)).toHaveLength(0);
      expect(f.env.button("Resume facility time").attributes.disabled).toBeUndefined();
    });

    it(`automatically rechecks a suspended ${layout} chart after duplicate foreground events`, async () => {
      const f = await fixture(layout, false, true, false, false, true);
      await f.submitFlag(); const before = JSON.parse(serializeGameState(f.current().state));
      f.clock.wall += 120_000;
      expect(f.cloud().canExecute).toBe(false);
      await act(async () => {
        f.env.browser.dispatchEvent(new Event("pageshow"));
        f.env.browser.dispatchEvent(new Event("focus"));
        f.env.browser.dispatchEvent(new Event("online"));
        f.env.doc.dispatchEvent(new Event("resume"));
      });
      await vi.waitFor(() => expect(f.cloud().canExecute).toBe(true));
      expect(JSON.parse(serializeGameState(f.current().state))).toEqual(before);
      expect(allElements(f.env.element, node => node.tagName === "DIALOG" && node.attributes.class?.includes("cloud-dialog") === true)).toHaveLength(0);
      expect(f.current().questionReviewFlags).toHaveLength(1);
      await f.env.clickElement(f.env.find(node => node.tagName === "BUTTON" && node.textContent.includes(f.answer().label)));
      expect(f.subject().answers).toHaveLength(1);
      await act(async () => { await f.cloud().durable(); });
    });

    it.each(["visibilitychange", "pagehide", "freeze"] as const)(`checkpoints ${layout} progress on %s and resumes without a prompt`, async event => {
      const f = await fixture(layout, false, false, false, false, true);
      await f.env.click("Resume facility time"); await act(async () => { await f.cloud().durable(); });
      const before = JSON.parse(serializeGameState(f.current().state));
      await act(async () => {
        if (event === "visibilitychange") Object.assign(f.env.doc, { visibilityState: "hidden" });
        (event === "pagehide" ? f.env.browser : f.env.doc).dispatchEvent(new Event(event));
      });
      await vi.waitFor(() => expect(f.cloud().coordinator.view.pending).toBe(false));
      f.clock.wall += 120_000;
      await act(async () => {
        Object.assign(f.env.doc, { visibilityState: "visible" });
        f.env.doc.dispatchEvent(new Event("visibilitychange"));
      });
      await vi.waitFor(() => expect(f.cloud().canExecute).toBe(true));
      expect(JSON.parse(serializeGameState(f.current().state))).toEqual(before);
      expect(allElements(f.env.element, node => node.tagName === "DIALOG" && node.attributes.class?.includes("cloud-dialog") === true)).toHaveLength(0);
    });
  }

  it.each(["phone", "desktop"] as const)("shows an actionable explanation over an open %s chart when storage refuses commands", async layout => {
    const f = await fixture(layout, false, false);
    f.budget.denyCloud = true;
    await f.env.click("Resume facility time");
    await act(async () => { expect(await f.cloud().durable()).toBe(false); });
    expect(f.cloud().canExecute).toBe(false);
    const blocked = f.env.find(node => node.attributes["aria-label"] === "Play paused for account save");
    expect(blocked.attributes.role).toBe("alert"); expect(blocked.textContent).toContain("could not save your progress");
    expect(allElements(f.env.element, node => node.attributes.class === "mobile-chart" || node.attributes.class?.includes("chart-sheet") === true).length).toBeGreaterThan(0);
    const before = serializeGameState(f.current().state);
    await act(async () => { f.current().submitAnswer(f.answer().id); });
    expect(serializeGameState(f.current().state)).toBe(before);
    expect(f.current().announcement).toContain("must be checked");
    await f.env.click("Open account save");
    f.budget.denyCloud = false;
    await f.env.click("Retry account save");
    await vi.waitFor(() => expect(f.cloud().coordinator.view.phase).toBe("ready"));
    await f.env.click("Open account save"); await f.env.click("Resume checked campaign");
    expect(f.cloud().canExecute).toBe(true);
    expect(allElements(f.env.element, node => node.attributes["aria-label"] === "Play paused for account save")).toHaveLength(0);
  });

  it.each(["phone", "desktop"] as const)("recovers a suspend-clock gate over an open %s flagged chart without takeover or losing flags", async layout => {
    const f = await fixture(layout, false, false);
    await f.submitFlag(); const before = JSON.parse(serializeGameState(f.current().state));
    f.clock.wall += 10_000;
    await act(async () => { await f.cloud().coordinator.pulse(); });
    expect(f.cloud().canExecute).toBe(false);
    expect(f.env.find(node => node.attributes["aria-label"] === "Play paused for account save").textContent).toContain("clock change or app suspension");
    await f.env.click("Open account save"); await f.env.click("Retry account save");
    await vi.waitFor(() => expect(f.cloud().coordinator.view.phase).toBe("ready"));
    await f.env.click("Open account save"); await f.env.click("Resume checked campaign");
    expect(f.cloud().canExecute).toBe(true);
    expect(JSON.parse(serializeGameState(f.current().state))).toEqual(before);
    expect(f.current().questionReviewFlags).toHaveLength(1);
    expect(f.server.calls.filter(call => call.method === "acquire")).toHaveLength(1);
  });

  it.each(["phone", "desktop"] as const)("can flag the reported v4 frozen question in %s without changing the cloud campaign", async layout => {
    const f = await fixture(layout, false, false, true), before = serializeGameState(f.current().state);
    await f.submitFlag();
    expect(vi.mocked(context.transport!.send).mock.calls[0]![0].question_variant_id).toBe(reportedVariant);
    await f.reload();
    expect(serializeGameState(f.current().state)).toBe(before);
    expect(f.cloud().canExecute).toBe(true);
    await f.env.clickElement(f.env.find(node => node.tagName === "BUTTON" && node.textContent.includes(f.answer().label)));
    expect(f.subject().answers[0]!.answerChoiceId).toBe(f.answer().id);
    await act(async () => { await f.cloud().durable(); });
  });

  it.each(["phone", "desktop"] as const)("closes the %s composer without awaiting a lost acknowledgement and reload retries the same flag", async layout => {
    const f = await fixture(layout, false, false), received: HostedQuestionFlag[] = [];
    vi.mocked(context.transport!.send).mockImplementation(payload => { received.push(payload); return new Promise(() => {}); });
    await f.submitFlag();
    expect(allElements(f.env.element, node => node.tagName === "TEXTAREA")).toHaveLength(0);
    expect(f.env.element.textContent).toContain("Your flag is queued");
    expect(f.cloud().canExecute).toBe(true);
    expect(f.env.button("Resume facility time").attributes.disabled).toBeUndefined();
    await f.env.click("Resume facility time");
    expect(f.current().state.paused).toBe(false);
    await f.env.click("Pause facility time");
    expect(f.current().state.paused).toBe(true);
    const key = f.answer();
    await f.env.clickElement(f.env.find(node => node.tagName === "BUTTON" && node.textContent.includes(key.label)));
    expect(f.subject().answers[0]).toMatchObject({ answerChoiceId: key.id, correct: true });
    await act(async () => { expect(await f.cloud().durable()).toBe(true); expect(await f.cloud().checkpointNow("scored-answer")).toBe(true); });
    const before = serializeGameState(f.current().state), flags = loadQuestionReviewFlags(f.storage, accountId);
    vi.mocked(context.transport!.send).mockImplementation(async payload => {
      received.push(payload); return { status: "open", fixedInVersion: null };
    });
    await f.reload();
    await vi.waitFor(() => expect(f.env.element.textContent).toContain("Thanks, flag sent"));
    expect(received).toHaveLength(2); expect(received[1]).toEqual(received[0]);
    const savedState = JSON.parse(before), reloadedState = JSON.parse(serializeGameState(f.current().state));
    // Cloud canonicalization changes object key order after new commands.
    expect(reloadedState).toEqual(savedState);
    expect(f.current().questionReviewFlags).toEqual(flags);
    expect(f.subject().answers[0]).toMatchObject({ answerChoiceId: key.id, correct: true });
    expect(f.env.button("Resume facility time").attributes.disabled).toBeUndefined();
  });

  it.each(["phone", "desktop"] as const)("keeps a hosted report and %s play when its optional local review copy throws", async layout => {
    const f = await fixture(layout, false, false);
    f.failLocalCopy(); await f.submitFlag();
    expect(f.env.element.textContent).toContain("Thanks, flag sent");
    expect(allElements(f.env.element, node => node.tagName === "TEXTAREA")).toHaveLength(0);
    const receipt = JSON.parse(f.stored.get(accountStorageKey(HOSTED_FLAGS_KEY, accountId))!).entries[0];
    await f.reload();
    expect(context.transport!.send).toHaveBeenCalledOnce();
    expect(JSON.parse(f.stored.get(accountStorageKey(HOSTED_FLAGS_KEY, accountId))!).entries[0]).toEqual(receipt);
    await f.env.clickElement(f.env.find(node => node.tagName === "BUTTON" && node.textContent.includes(f.answer().label)));
    expect(f.subject().answers).toHaveLength(1);
    await act(async () => { await f.cloud().durable(); });
  });

  it.each(["phone", "desktop"] as const)("loads mixed historical flag records in %s without rewriting storage or losing a valid report", async layout => {
    const f = await fixture(layout, false, true);
    await f.submitFlag();
    const localKey = accountStorageKey(QUESTION_REVIEW_FLAGS_STORAGE_KEY, accountId), queueKey = accountStorageKey(HOSTED_FLAGS_KEY, accountId);
    const local = JSON.parse(f.stored.get(localKey)!), queue = JSON.parse(f.stored.get(queueKey)!);
    delete queue.entries[0].status; delete queue.entries[0].fixedInVersion;
    queue.entries.push(null, { payload: null }, { ...queue.entries[0], delivery: "invalid" });
    local.flags.push(null, { id: "unreadable-record" });
    const localBytes = JSON.stringify(local), queueBytes = JSON.stringify(queue);
    f.stored.set(localKey, localBytes); f.stored.set(queueKey, queueBytes);
    const before = serializeGameState(f.current().state);
    await f.reload();
    expect(f.current().questionReviewFlags).toHaveLength(1);
    expect(f.current().questionReviewFlags[0]!.id).toBe(local.flags[0].id);
    expect(f.env.element.textContent).toContain("Thanks, flag sent");
    expect(f.stored.get(localKey)).toBe(localBytes); expect(f.stored.get(queueKey)).toBe(queueBytes);
    expect(serializeGameState(f.current().state)).toBe(before);
    expect(f.cloud().canExecute).toBe(true);
    await f.env.clickElement(f.env.find(node => node.tagName === "BUTTON" && node.textContent.includes(f.answer().label)));
    expect(f.subject().answers).toHaveLength(1);
    await act(async () => { await f.cloud().durable(); });
  });
});

for (const layout of ["phone", "desktop"] as const) for (const employee of [false, true]) for (const casual of [false, true]) {
  describe(`${layout} hosted ${employee ? "team discussion" : "patient chart"}, casual=${casual}`, () => {
    it("keeps play available after an acknowledged comment and after loading the persisted flag/receipt", async () => {
      const f = await fixture(layout, employee, casual);
      const before = serializeGameState(f.current().state), campaignRevision = f.cloud().coordinator.confirmedRevision;
      await f.submitFlag();
      expect(f.env.element.textContent).toContain("Thanks, flag sent");
      expect(allElements(f.env.element, node => node.tagName === "TEXTAREA")).toHaveLength(0);
      expect(serializeGameState(f.current().state)).toBe(before);
      expect(f.cloud().canExecute).toBe(true); expect(f.cloud().coordinator.confirmedRevision).toBe(campaignRevision);
      for (const name of ["Resume facility time", "Pause facility time"]) expect(f.env.button(name).attributes.disabled).toBeUndefined();
      const local = loadQuestionReviewFlags(f.storage, accountId);
      expect(local).toHaveLength(1); expect(local[0]!.comment).toBe("Synthetic tester comment");
      const queueBytes = f.stored.get(accountStorageKey(HOSTED_FLAGS_KEY, accountId))!;
      expect(JSON.parse(queueBytes).entries[0].delivery).toBe("sent");
      // Remount before answering: the same saved question, local flag and hosted
      // receipt must be usable without clearing data or resubmitting the report.
      await f.reload();
      expect(serializeGameState(f.current().state)).toBe(before);
      expect(f.current().questionReviewFlags).toEqual(local);
      expect(f.env.element.textContent).toContain("Thanks, flag sent");
      expect(context.transport!.send).toHaveBeenCalledOnce();
      expect(f.env.button("Question flagged for developer review").attributes.disabled).toBe("");
      expect(f.cloud().canExecute).toBe(true);
      for (const name of ["Resume facility time", "Pause facility time"]) expect(f.env.button(name).attributes.disabled).toBeUndefined();
      const key = f.answer();
      await f.env.clickElement(f.env.find(node => node.tagName === "BUTTON" && node.textContent.includes(key.label)));
      await act(async () => { expect(await f.cloud().durable()).toBe(true); });
      expect(f.subject().answers[0]).toMatchObject({ answerChoiceId: key.id, correct: true });
      expect(f.current().state.campaignId).toBe(JSON.parse(before).campaignId);
      expect(loadQuestionReviewFlags(f.storage, accountId)).toEqual(local);
      expect(await f.cloud().checkpointNow("scored-answer")).toBe(true);
      expect(f.cloud().canExecute).toBe(true);
    });
  });
}
