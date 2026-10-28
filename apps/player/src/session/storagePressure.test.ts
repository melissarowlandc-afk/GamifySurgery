import { IDBFactory, IDBObjectStore as FakeObjectStore } from "fake-indexeddb";
import { afterEach, describe, expect, it, vi } from "vitest";
import { accountStorageKey } from "./accountStorageKey";
import { scoredPatientFixture } from "../playtime/usageTestFixtures";
import { questionReviewContext } from "./questionReviewContext";
import { loadArchivedQuestionReviewFlags, recordQuestionReviewFlag, saveQuestionReviewFlagsDurably, QUESTION_REVIEW_FLAGS_STORAGE_KEY } from "./questionReviewFlags";
import { archiveReviewFlags, AUXILIARY_ITEM_BYTES, clearArchivedReviewFlags, readArchivedReviewFlags,
  AUXILIARY_ARCHIVE_ITEM_BYTES, AUXILIARY_ARCHIVE_TOTAL_BYTES, AUXILIARY_RECLAIM_BUDGET_MS, reclaimAuxiliaryStorage, reclaimOptionalStorage, setAuxiliaryItem, type AuxiliaryStorage } from "./storagePressure";
import { IndexedDbCloudCache } from "./cloud/cache";
import { IndexedDbCloudEntryStore } from "./cloud/entryStorage";
import { syncFixture } from "./cloud/syncTestSupport";
import { createFreshProfile, PROTOTYPE_PROFILE_KEY, savePrototypeProfileResult } from "./prototypeStorage";
import { phoneTestDom, cleanupPhoneTests } from "../mobile/screenTestUtils";

afterEach(async () => { await cleanupPhoneTests(); vi.restoreAllMocks(); });
function store(limit = Infinity) {
  const values = new Map<string, string>(); let failures = 0;
  const size = () => [...values].reduce((total, [key, value]) => total + 2 * (key.length + value.length), 0);
  const storage: AuxiliaryStorage = { get length() { return values.size; }, key: index => [...values.keys()][index] ?? null,
    getItem: key => values.get(key) ?? null, removeItem: key => { values.delete(key); },
    setItem(key, value) { const old = values.get(key), delta = 2 * (key.length + value.length) - (old === undefined ? 0 : 2 * (key.length + old.length));
      if (size() + delta > limit) { failures++; throw new DOMException("Synthetic quota", "QuotaExceededError"); } values.set(key, value); } };
  return { storage, values, size, failures: () => failures };
}
function reviewFlags(count = 45) {
  const state = scoredPatientFixture(), subject = Object.values(state.encounters)[0]!;
  const input = questionReviewContext(state, subject.id, subject.frozenCase.decisionNodes[0]!.id)!;
  return Array.from({ length: count }, (_, index) => recordQuestionReviewFlag([], {
    ...input, questionVariantId: `question.storage-fixture.${index}`, comment: `Synthetic review ${index}`,
  }, 1000 + index).flag);
}

describe("campaign-priority auxiliary storage", () => {
  it("grandfathers oversized archived history without allowing further auxiliary growth", async () => {
    vi.stubGlobal("indexedDB", new IDBFactory());
    const f = store(), flags = reviewFlags(220), key = accountStorageKey(QUESTION_REVIEW_FLAGS_STORAGE_KEY, "archive-limit");
    const raw = JSON.stringify({ schemaVersion: 1, flags }); expect(raw.length * 2).toBeGreaterThan(AUXILIARY_ARCHIVE_ITEM_BYTES);
    f.storage.setItem(key, raw); expect(await archiveReviewFlags(key, raw, f.storage)).toBe(true);
    const archived = await readArchivedReviewFlags(key), added = { ...flags[0]!, id: "new-over-budget" };
    expect(await archiveReviewFlags(key, JSON.stringify({ schemaVersion: 1, flags: [...flags, added] }), f.storage)).toBe(false);
    expect(await readArchivedReviewFlags(key)).toBe(archived);
    expect(await loadArchivedQuestionReviewFlags("archive-limit")).toEqual(flags);
  });
  it("bounds new review archives across accounts without evicting earlier flags", async () => {
    vi.stubGlobal("indexedDB", new IDBFactory());
    const raw = JSON.stringify({ schemaVersion: 1, flags: reviewFlags() }); let accepted = 0;
    for (let index = 0; index < 10; index++) {
      const key = accountStorageKey(QUESTION_REVIEW_FLAGS_STORAGE_KEY, `bounded-${index}`);
      if (!await archiveReviewFlags(key, raw, null)) break;
      accepted++;
    }
    expect(accepted).toBeGreaterThan(0); expect(accepted).toBeLessThan(10);
    expect(accepted * raw.length * 2).toBeLessThanOrEqual(AUXILIARY_ARCHIVE_TOTAL_BYTES);
    for (let index = 0; index < accepted; index++) expect(await readArchivedReviewFlags(accountStorageKey(QUESTION_REVIEW_FLAGS_STORAGE_KEY, `bounded-${index}`))).toBe(raw);
  });
  it.each(["create", "compare-and-set"])("retries a quota-failed IDB %s without replacing its immutable source", async kind => {
    const env = phoneTestDom(), f = store(), entries = new IndexedDbCloudEntryStore({ backendId: "b", accountId: "a" }, new IDBFactory());
    Object.defineProperty(env.browser, "localStorage", { value: f.storage });
    if (kind === "compare-and-set") await entries.create("source", { version: 1 });
    f.storage.setItem("gamify-surgery.competition.v1.legacy", "disposable cache");
    const original = FakeObjectStore.prototype.put;
    vi.spyOn(FakeObjectStore.prototype, "put").mockImplementationOnce(() => { throw new DOMException("Quota", "QuotaExceededError"); }).mockImplementation(original);
    const result = kind === "create" ? await entries.create("source", { version: 2 })
      : await entries.compareAndSet("source", { version: 1 }, { version: 2 });
    expect(result).toEqual({ version: 2 }); expect(f.values.has("gamify-surgery.competition.v1.legacy")).toBe(false);
    expect(await entries.create("source", { version: 3 })).toEqual({ version: 2 });
    expect(await entries.compareAndSet("source", { version: 1 }, { version: 4 })).toEqual({ version: 2 });
  });
  it("never waits indefinitely for auxiliary IDB housekeeping and preserves the source bytes", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("indexedDB", { open: () => ({}) } as unknown as IDBFactory);
    const f = store(), key = accountStorageKey(QUESTION_REVIEW_FLAGS_STORAGE_KEY, "a"), raw = JSON.stringify({ schemaVersion: 1, flags: reviewFlags() });
    f.storage.setItem(key, raw);
    const reclaiming = reclaimAuxiliaryStorage(f.storage, true);
    await vi.advanceTimersByTimeAsync(AUXILIARY_RECLAIM_BUDGET_MS);
    await reclaiming; expect(f.values.get(key)).toBe(raw);
    await vi.advanceTimersByTimeAsync(2_000);
  });
  it("rejects oversized auxiliary growth without overwriting its original bytes", () => {
    const f = store(), key = "gamify-surgery.question-flag-outbox.v1.account.a";
    f.storage.setItem(key, "existing pending report");
    expect(() => setAuxiliaryItem(f.storage, key, "x".repeat(AUXILIARY_ITEM_BYTES))).toThrow();
    expect(f.values.get(key)).toBe("existing pending report");
  });
  it("reclaims only explicit disposable caches and preserves campaigns, flags, usage, auth and recovery", () => {
    const f = store();
    for (const key of [PROTOTYPE_PROFILE_KEY, "gamify-surgery.question-review-flags.v1.account.a",
      "gamify-surgery.question-flag-outbox.v1.account.a", "gamify-surgery.usage.outbox.v1.account.a",
      "gamify-surgery.cloud-cache.v1", "gamify-surgery.unknown", "sb-auth-token"]) f.storage.setItem(key, key);
    const protectedValues = new Map(f.values);
    for (const key of ["gamify-surgery.competition.v1.server.account.a", "gamify-surgery.competition-tip.v1.clinic.account.a",
      "gamify-surgery.casual-mode.v1.account.a", "gamify-surgery.prototype.facility-camera.v1:clinic"]) f.storage.setItem(key, "cached");
    expect(reclaimOptionalStorage(f.storage)).toBeGreaterThan(0); expect(f.values).toEqual(protectedValues);
  });
  it("reserves campaign headroom across all auxiliary keys and accounts", () => {
    const f = store(), campaign = "x".repeat((5 * 1024 * 1024 - 256 * 1024) / 2);
    f.storage.setItem(PROTOTYPE_PROFILE_KEY, campaign);
    const before = f.values.get(PROTOTYPE_PROFILE_KEY);
    expect(() => setAuxiliaryItem(f.storage, "gamify-surgery.casual-mode.v1.account.a", "true")).toThrow();
    expect(f.values.get(PROTOTYPE_PROFILE_KEY)).toBe(before);
  });
  it("retries a synchronous local campaign write after quota without clearing the existing campaign", () => {
    const env = phoneTestDom(), f = store(800_000);
    Object.defineProperty(env.browser, "localStorage", { value: f.storage });
    const state = scoredPatientFixture(), profile = { ...createFreshProfile(), activeCampaignId: state.campaignId,
      campaigns: [{ campaignId: state.campaignId, name: "Synthetic local quota clinic", status: "resumable" as const,
        createdAtRealMs: 0, updatedAtRealMs: 0, state }] };
    f.storage.setItem("gamify-surgery.competition.v1.legacy", "x".repeat(390_000));
    expect(savePrototypeProfileResult(profile).ok).toBe(true);
    expect(f.failures()).toBe(1); expect(f.values.has(PROTOTYPE_PROFILE_KEY)).toBe(true);
    expect(f.values.has("gamify-surgery.competition.v1.legacy")).toBe(false);
  });
  it("archives oversized legacy review snapshots on startup and reloads every flag without losing comments", async () => {
    vi.stubGlobal("indexedDB", new IDBFactory());
    const f = store(), flags = reviewFlags(), key = accountStorageKey(QUESTION_REVIEW_FLAGS_STORAGE_KEY, "a");
    const raw = JSON.stringify({ schemaVersion: 1, flags }); expect(raw.length * 2).toBeGreaterThan(AUXILIARY_ITEM_BYTES);
    f.storage.setItem(key, raw); await reclaimAuxiliaryStorage(f.storage, true);
    expect(f.values.has(key)).toBe(false);
    expect(await loadArchivedQuestionReviewFlags("a")).toEqual(flags);
  });
  it.each(["unavailable", "quota", "malformed"])("keeps the original flag bytes if archive verification fails (%s)", async reason => {
    vi.stubGlobal("indexedDB", reason === "unavailable" ? undefined : new IDBFactory());
    if (reason === "quota") vi.spyOn(FakeObjectStore.prototype, "put").mockImplementation(() => { throw new DOMException("Quota", "QuotaExceededError"); });
    const f = store(), flags: unknown[] = reviewFlags(), key = accountStorageKey(QUESTION_REVIEW_FLAGS_STORAGE_KEY, "a");
    if (reason === "malformed") flags.push(null);
    const raw = JSON.stringify({ schemaVersion: 1, flags }); f.storage.setItem(key, raw);
    await reclaimAuxiliaryStorage(f.storage, true);
    expect(f.values.get(key)).toBe(raw);
  });
  it("saves a new oversized review history independently, merging concurrent archived flags", async () => {
    vi.stubGlobal("indexedDB", new IDBFactory());
    const f = store(), flags = reviewFlags(), key = accountStorageKey(QUESTION_REVIEW_FLAGS_STORAGE_KEY, "a");
    expect(await saveQuestionReviewFlagsDurably(flags, f.storage, "a")).toBe(true);
    const added = reviewFlags(2).map((flag, index) => ({ ...flag, id: `extra.${index}` }));
    await Promise.all(added.map(flag => archiveReviewFlags(key, JSON.stringify({ schemaVersion: 1, flags: [flag] }), f.storage)));
    const loaded = await loadArchivedQuestionReviewFlags("a");
    expect(loaded).toHaveLength(flags.length + added.length);
    for (const flag of [...flags, ...added]) expect(loaded).toContainEqual(flag);
  });
  it("clears only the selected account archive and fences late writes during deletion", async () => {
    vi.stubGlobal("indexedDB", new IDBFactory());
    const flags = reviewFlags(1), raw = JSON.stringify({ schemaVersion: 1, flags });
    const a = accountStorageKey(QUESTION_REVIEW_FLAGS_STORAGE_KEY, "a"), b = accountStorageKey(QUESTION_REVIEW_FLAGS_STORAGE_KEY, "b");
    expect(await archiveReviewFlags(a, raw, null)).toBe(true); expect(await archiveReviewFlags(b, raw, null)).toBe(true);
    const late = archiveReviewFlags(a, raw, null); await clearArchivedReviewFlags(a); await late;
    expect(await readArchivedReviewFlags(a)).toBeNull(); expect(await readArchivedReviewFlags(b)).toBe(raw);
  });
  it("identifies an IndexedDB quota failure so the coordinator can reclaim and retry safely", async () => {
    const fixture = await syncFixture(), cache = new IndexedDbCloudCache(new IDBFactory());
    const original = FakeObjectStore.prototype.put;
    vi.spyOn(FakeObjectStore.prototype, "put").mockImplementationOnce(() => { throw new DOMException("Quota", "QuotaExceededError"); }).mockImplementation(original);
    const entry = { schemaVersion: 1 as const, scope: { backendId: "b", accountId: "a", campaignId: fixture.confirmed.campaignId },
      confirmed: fixture.confirmed, recovery: null };
    await expect(cache.write(entry, null)).rejects.toMatchObject({ reason: "quota", code: "storage" });
    expect(await cache.read(entry.scope)).toBeNull();
    expect((await cache.write(entry, null)).entry).toEqual(entry); await cache.close();
  });
});
