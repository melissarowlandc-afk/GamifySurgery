import { IDBFactory } from "fake-indexeddb";
import { beforeEach, describe, expect, it } from "vitest";
import {
  serializeGameState,
  type FounderIdentity,
  type GameState,
  type OperationReceipt,
} from "@gamify-surgery/game-domain";
import {
  appendLocalCampaign,
  createFreshProfile,
  type LocalCampaignRecord,
  type LocalPrototypeProfile,
} from "./prototypeStorage";
import {
  LOCAL_CAMPAIGN_DATABASE_NAME,
  LocalCampaignRepository,
  type LocalCampaignRepositoryOptions,
} from "./localCampaignRepository";

const founder: FounderIdentity = {
  displayName: "Avery",
  headId: "head.test",
  bodyId: "body.test",
  appearance: {
    version: "pixel-avatar.v1",
    bodyShape: "broad",
    hairStyle: "parted",
    hairShade: 3,
    faceStyle: "square",
    outfitStyle: "checked",
    outfitShade: 2,
    accessory: "none",
  },
};

let factory: IDBFactory;

beforeEach(() => {
  factory = new IDBFactory();
});

function createCampaignProfile(name = "North Clinic", campaignId = name) {
  return appendLocalCampaign(createFreshProfile(), founder, name, 123, campaignId);
}

function createRepository(options?: LocalCampaignRepositoryOptions) {
  return new LocalCampaignRepository(factory, options);
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

function idbRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function openDatabase(): Promise<IDBDatabase> {
  return idbRequest(factory.open(LOCAL_CAMPAIGN_DATABASE_NAME));
}

async function readStore<T>(storeName: string, key?: IDBValidKey): Promise<T> {
  const database = await openDatabase();
  try {
    const transaction = database.transaction(storeName, "readonly");
    const done = transactionDone(transaction);
    const request =
      key === undefined
        ? transaction.objectStore(storeName).getAll()
        : transaction.objectStore(storeName).get(key);
    const value = await idbRequest(request);
    await done;
    return value as T;
  } finally {
    database.close();
  }
}

async function putStore(storeName: string, value: unknown): Promise<void> {
  const database = await openDatabase();
  try {
    const transaction = database.transaction(storeName, "readwrite");
    const done = transactionDone(transaction);
    transaction.objectStore(storeName).put(value);
    await done;
  } finally {
    database.close();
  }
}

async function changeProfile(
  change: (profile: Record<string, unknown>) => void,
): Promise<void> {
  const profile = await readStore<Record<string, unknown>>("profile", "profile");
  change(profile);
  await putStore("profile", profile);
}

async function changeCurrent(
  campaignId: string,
  change: (snapshot: Record<string, unknown>) => void | Promise<void>,
): Promise<void> {
  const database = await openDatabase();
  try {
    const transaction = database.transaction("campaigns", "readwrite");
    const done = transactionDone(transaction);
    const store = transaction.objectStore("campaigns");
    const snapshot = (await idbRequest(store.get(campaignId))) as Record<string, unknown>;
    await change(snapshot);
    store.put(snapshot);
    await done;
  } finally {
    database.close();
  }
}

async function changePrior(
  campaignId: string,
  revision: number,
  change: (snapshot: Record<string, unknown>) => void,
): Promise<void> {
  const database = await openDatabase();
  try {
    const transaction = database.transaction("revisions", "readwrite");
    const done = transactionDone(transaction);
    const store = transaction.objectStore("revisions");
    const key = [campaignId, revision];
    const snapshot = (await idbRequest(store.get(key))) as Record<string, unknown>;
    change(snapshot);
    store.put(snapshot);
    await done;
  } finally {
    database.close();
  }
}

async function deleteCurrent(campaignId: string): Promise<void> {
  const database = await openDatabase();
  try {
    const transaction = database.transaction("campaigns", "readwrite");
    const done = transactionDone(transaction);
    transaction.objectStore("campaigns").delete(campaignId);
    await done;
  } finally {
    database.close();
  }
}

async function sha256(value: string): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(hash)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function changedCampaign(campaign: LocalCampaignRecord, facilityTick: number) {
  return { ...campaign, state: { ...campaign.state, facilityTick } };
}

function profileWithCampaign(
  profile: LocalPrototypeProfile,
  campaign: LocalCampaignRecord,
): LocalPrototypeProfile {
  return {
    ...profile,
    campaigns: profile.campaigns.map((candidate) =>
      candidate.campaignId === campaign.campaignId ? campaign : candidate,
    ),
  };
}

function createLargeCampaign(campaign: LocalCampaignRecord): LocalCampaignRecord {
  const operationReceipts: Record<string, OperationReceipt> = {};
  for (let index = 0; index < 2_000; index += 1) {
    const operationId = `receipt.${index}`;
    operationReceipts[operationId] = {
      operationId,
      commandType: "ADVANCE_TICK",
      status: "applied",
      message: "x".repeat(1_024),
      facilityTick: index,
    };
  }
  const state: GameState = {
    ...campaign.state,
    operationReceipts,
  };
  return { ...campaign, state };
}

function createSyntheticFailureFactory(
  mode: "request" | "setup",
  events: string[],
): IDBFactory {
  const transaction = {
    error: namedDomError("SyntheticTransactionError", "synthetic transaction failure"),
    oncomplete: null as ((event: Event) => void) | null,
    onerror: null as ((event: Event) => void) | null,
    onabort: null as ((event: Event) => void) | null,
    abort: () => {
      events.push("abort-requested");
      setTimeout(() => {
        events.push("abort-terminal");
        transaction.onabort?.(new Event("abort"));
      }, 0);
    },
    objectStore: (name: string) => {
      return {
        get: () => syntheticRequest(undefined, mode === "request" ? transaction : undefined),
        getAllKeys: () => {
          if (mode === "setup" && name === "campaigns") {
            throw namedDomError("NotFoundError", "synthetic setup failure");
          }
          return syntheticRequest([], undefined);
        },
        index: () => ({ getAll: () => syntheticRequest([], undefined) }),
      };
    },
  } as unknown as IDBTransaction;
  const database = {
    transaction: () => transaction,
    close: () => events.push("closed"),
  } as unknown as IDBDatabase;
  const opening = syntheticRequest(database, undefined) as unknown as IDBOpenDBRequest;
  return { open: () => opening } as unknown as IDBFactory;
}

function namedDomError(name: string, message: string): DOMException {
  return new DOMException(message, name);
}

function syntheticRequest<T>(
  result: T,
  failedTransaction: IDBTransaction | undefined,
): IDBRequest<T> {
  const request = {
    result,
    error: failedTransaction?.error ?? null,
    onsuccess: null as ((event: Event) => void) | null,
    onerror: null as ((event: Event) => void) | null,
  };
  queueMicrotask(() => {
    if (failedTransaction) {
      request.onerror?.(new Event("error"));
      failedTransaction.onerror?.(new Event("error"));
      return;
    }
    request.onsuccess?.(new Event("success"));
  });
  return request as unknown as IDBRequest<T>;
}

describe("LocalCampaignRepository", () => {
  it("returns structured encoder and checksum preparation failures", async () => {
    const created = createCampaignProfile();
    const checksumFailure = await createRepository({
      calculateChecksum: async () => {
        throw new Error("crypto unavailable");
      },
    }).saveCampaign(created.profile, created.campaign, 0);
    expect(checksumFailure).toMatchObject({
      ok: false,
      failure: { category: "validation", operation: "write" },
    });

    const encodingFailure = await createRepository({
      encodeUtf8: () => {
        throw new Error("TextEncoder unavailable");
      },
    }).saveCampaign(created.profile, created.campaign, 0);
    expect(encodingFailure).toMatchObject({
      ok: false,
      failure: { category: "validation", operation: "write" },
    });
  });

  it("distinguishes unavailable, open, upgrade, and blocked opens and closes late success", async () => {
    expect(await new LocalCampaignRepository(undefined).loadCampaign("missing")).toMatchObject({
      ok: false,
      failure: { category: "unavailable", operation: "open" },
    });

    const deniedFactory = {
      open: () => {
        throw new DOMException("denied", "SecurityError");
      },
    } as unknown as IDBFactory;
    expect(await new LocalCampaignRepository(deniedFactory).loadCampaign("missing")).toMatchObject({
      ok: false,
      failure: { category: "open", name: "SecurityError" },
    });

    const upgradeFailure = await createRepository({
      configureUpgrade: () => {
        throw new Error("upgrade test failure");
      },
    }).loadCampaign("missing");
    expect(upgradeFailure).toMatchObject({
      ok: false,
      failure: { category: "upgrade", name: "UpgradeError" },
    });
    expect(await createRepository().loadCampaign("missing")).toEqual({ ok: true, value: null });

    factory = new IDBFactory();
    const asynchronousUpgradeFailure = await createRepository({
      configureUpgrade: (database) => {
        const store = database.createObjectStore("upgrade-probe", { keyPath: "id" });
        store.createIndex("unique-value", "value", { unique: true });
        store.add({ id: 1, value: "duplicate" });
        store.add({ id: 2, value: "duplicate" });
      },
    }).loadCampaign("missing");
    expect(asynchronousUpgradeFailure).toMatchObject({
      ok: false,
      failure: { category: "upgrade", operation: "open" },
    });
    expect(await createRepository().loadCampaign("missing")).toEqual({ ok: true, value: null });

    const heldConnection = await openDatabase();
    const blockingFactory = {
      open: (name: string, version?: number) => factory.open(name, (version ?? 1) + 1),
    } as unknown as IDBFactory;
    expect(await new LocalCampaignRepository(blockingFactory).loadCampaign("missing")).toMatchObject({
      ok: false,
      failure: { category: "blocked", name: "BlockedError" },
    });
    heldConnection.close();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await expect(
      new Promise<void>((resolve, reject) => {
        const deletion = factory.deleteDatabase(LOCAL_CAMPAIGN_DATABASE_NAME);
        deletion.onsuccess = () => resolve();
        deletion.onerror = () => reject(deletion.error);
        deletion.onblocked = () => reject(new Error("late successful connection leaked"));
      }),
    ).resolves.toBeUndefined();
  });

  it.each(["request", "setup"] as const)(
    "awaits transaction abort before closing after a %s failure",
    async (mode) => {
      const events: string[] = [];
      const result = await new LocalCampaignRepository(
        createSyntheticFailureFactory(mode, events),
      ).loadCampaign("campaign");

      expect(result).toMatchObject({
        ok: false,
        failure: { operation: "read" },
      });
      expect(events).toEqual(["abort-requested", "abort-terminal", "closed"]);
    },
  );

  it("allows one same-campaign concurrent writer and rejects the stale writer", async () => {
    const created = createCampaignProfile();
    const repository = createRepository();
    const results = await Promise.all([
      repository.saveCampaign(created.profile, changedCampaign(created.campaign, 1), 0),
      repository.saveCampaign(created.profile, changedCampaign(created.campaign, 2), 0),
    ]);

    expect(results.filter((result) => result.ok)).toHaveLength(1);
    expect(results.filter((result) => !result.ok)).toMatchObject([
      { failure: { category: "conflict", name: "RevisionConflict" } },
    ]);
    const loaded = await repository.loadCampaign(created.campaign.campaignId);
    expect(loaded).toMatchObject({ ok: true, value: { revision: 1, recovered: false } });
  });

  it("rolls back changed current, metadata, and populated history after abort", async () => {
    const created = createCampaignProfile();
    const stable = createRepository();
    expect((await stable.saveCampaign(created.profile, created.campaign, 0)).ok).toBe(true);
    const revisionTwo = changedCampaign(created.campaign, 2);
    expect(
      (await stable.saveCampaign(profileWithCampaign(created.profile, revisionTwo), revisionTwo, 1)).ok,
    ).toBe(true);
    const profileBefore = await readStore<Record<string, unknown>>("profile", "profile");
    const campaignBefore = await readStore<Record<string, unknown>>(
      "campaigns",
      created.campaign.campaignId,
    );
    const historyBefore = await readStore<unknown[]>("revisions");

    const revisionThree = {
      ...changedCampaign(created.campaign, 3),
      name: "Renamed Clinic",
    };
    const modifiedProfile = {
      ...profileWithCampaign(created.profile, revisionThree),
      tutorialsEnabled: false,
    };
    const failed = await createRepository({
      beforeTransactionCommit: () => {
        throw new Error("injected rollback");
      },
    }).saveCampaign(modifiedProfile, revisionThree, 2);

    expect(failed).toMatchObject({ ok: false, failure: { category: "transaction" } });
    expect(await readStore("profile", "profile")).toEqual(profileBefore);
    expect(await readStore("campaigns", created.campaign.campaignId)).toEqual(campaignBefore);
    expect(await readStore("revisions")).toEqual(historyBefore);
  });

  it("rejects post-commit valid state when exact intended bytes and metadata differ", async () => {
    const created = createCampaignProfile();
    const wrongCampaign = changedCampaign(created.campaign, 99);
    const wrongSerializedState = serializeGameState(wrongCampaign.state);
    const wrongChecksum = await sha256(wrongSerializedState);
    let changed = false;
    const repository = createRepository({
      afterTransactionCommit: async () => {
        if (changed) {
          return;
        }
        changed = true;
        await changeCurrent(created.campaign.campaignId, (snapshot) => {
          snapshot.serializedState = wrongSerializedState;
          snapshot.utf8Bytes = new TextEncoder().encode(wrongSerializedState).byteLength;
          snapshot.checksum = wrongChecksum;
        });
      },
    });

    expect(await repository.saveCampaign(created.profile, created.campaign, 0)).toMatchObject({
      ok: false,
      failure: { category: "validation", name: "PostCommitVerificationFailed" },
    });
    expect(await createRepository().loadCampaign(created.campaign.campaignId)).toMatchObject({
      ok: true,
      value: { campaign: { state: { facilityTick: 99 } } },
    });
  });

  it("rejects post-commit campaign metadata that differs from the intended summary", async () => {
    const created = createCampaignProfile();
    let changed = false;
    const repository = createRepository({
      afterTransactionCommit: async () => {
        if (changed) {
          return;
        }
        changed = true;
        await changeProfile((profile) => {
          const campaigns = profile.campaigns as Array<Record<string, unknown>>;
          campaigns[0] = { ...campaigns[0], name: "Wrong committed name" };
        });
      },
    });

    expect(await repository.saveCampaign(created.profile, created.campaign, 0)).toMatchObject({
      ok: false,
      failure: { category: "validation", name: "PostCommitVerificationFailed" },
    });
  });

  it("rejects a post-commit revision that differs from the intended revision", async () => {
    const created = createCampaignProfile();
    let changed = false;
    const repository = createRepository({
      afterTransactionCommit: async () => {
        if (changed) {
          return;
        }
        changed = true;
        await changeCurrent(created.campaign.campaignId, (snapshot) => {
          snapshot.revision = 42;
        });
      },
    });

    expect(await repository.saveCampaign(created.profile, created.campaign, 0)).toMatchObject({
      ok: false,
      failure: { category: "validation", name: "PostCommitVerificationFailed" },
    });
  });

  it("retains the two newest verified priors when a newer prior is corrupt", async () => {
    const created = createCampaignProfile();
    const repository = createRepository();
    let campaign = created.campaign;
    for (let revision = 0; revision < 4; revision += 1) {
      campaign = changedCampaign(created.campaign, revision);
      const profile = profileWithCampaign(created.profile, campaign);
      expect((await repository.saveCampaign(profile, campaign, revision)).ok).toBe(true);
    }
    await changePrior(created.campaign.campaignId, 3, (snapshot) => {
      snapshot.checksum = "corrupt";
    });

    const revisionFive = changedCampaign(created.campaign, 5);
    expect(
      await repository.saveCampaign(
        profileWithCampaign(created.profile, revisionFive),
        revisionFive,
        4,
      ),
    ).toEqual({ ok: true, value: { revision: 5 } });
    const history = await readStore<Array<{ revision: number; checksum: string }>>("revisions");
    expect(history.map((snapshot) => snapshot.revision).sort()).toEqual([2, 4]);
    expect(history.every((snapshot) => snapshot.checksum !== "corrupt")).toBe(true);

    await changeCurrent(created.campaign.campaignId, (snapshot) => {
      snapshot.checksum = "corrupt";
    });
    expect(await repository.loadCampaign(created.campaign.campaignId)).toMatchObject({
      ok: true,
      value: { revision: 4, recovered: true },
    });
    const repaired = changedCampaign(created.campaign, 6);
    expect(
      await repository.saveCampaign(
        profileWithCampaign(created.profile, repaired),
        repaired,
        4,
      ),
    ).toEqual({ ok: true, value: { revision: 6 } });
  });

  it("recovers a missing current from prior history and saves the next revision", async () => {
    const created = createCampaignProfile();
    const repository = createRepository();
    expect((await repository.saveCampaign(created.profile, created.campaign, 0)).ok).toBe(true);
    const second = changedCampaign(created.campaign, 2);
    expect(
      (await repository.saveCampaign(profileWithCampaign(created.profile, second), second, 1)).ok,
    ).toBe(true);
    await deleteCurrent(created.campaign.campaignId);

    expect(await repository.loadCampaign(created.campaign.campaignId)).toMatchObject({
      ok: true,
      value: { revision: 1, recovered: true },
    });
    const repaired = changedCampaign(created.campaign, 3);
    expect(
      await repository.saveCampaign(
        profileWithCampaign(created.profile, repaired),
        repaired,
        1,
      ),
    ).toEqual({ ok: true, value: { revision: 2 } });
  });

  it("classifies mixed unrecoverable checksum and envelope errors as validation", async () => {
    const created = createCampaignProfile();
    const repository = createRepository();
    expect((await repository.saveCampaign(created.profile, created.campaign, 0)).ok).toBe(true);
    const second = changedCampaign(created.campaign, 2);
    expect(
      (await repository.saveCampaign(profileWithCampaign(created.profile, second), second, 1)).ok,
    ).toBe(true);
    await changeCurrent(created.campaign.campaignId, (snapshot) => {
      snapshot.checksum = "corrupt";
    });
    await changePrior(created.campaign.campaignId, 1, (snapshot) => {
      snapshot.schemaVersion = 99;
    });

    expect(await repository.loadCampaign(created.campaign.campaignId)).toMatchObject({
      ok: false,
      failure: { category: "validation", name: "UnrecoverableValidation" },
    });
  });

  it("classifies structurally valid snapshots with only bad checksums as checksum failure", async () => {
    const created = createCampaignProfile();
    const repository = createRepository();
    expect((await repository.saveCampaign(created.profile, created.campaign, 0)).ok).toBe(true);
    const second = changedCampaign(created.campaign, 2);
    expect(
      (await repository.saveCampaign(profileWithCampaign(created.profile, second), second, 1)).ok,
    ).toBe(true);
    const third = changedCampaign(created.campaign, 3);
    expect(
      (await repository.saveCampaign(profileWithCampaign(created.profile, third), third, 2)).ok,
    ).toBe(true);
    await changeCurrent(created.campaign.campaignId, (snapshot) => {
      snapshot.checksum = "bad-current-checksum";
    });
    await changePrior(created.campaign.campaignId, 1, (snapshot) => {
      snapshot.checksum = "bad-prior-one-checksum";
    });
    await changePrior(created.campaign.campaignId, 2, (snapshot) => {
      snapshot.checksum = "bad-prior-two-checksum";
    });
    const profileBefore = await readStore("profile", "profile");
    const campaignsBefore = await readStore("campaigns");
    const revisionsBefore = await readStore("revisions");

    expect(await repository.loadCampaign(created.campaign.campaignId)).toMatchObject({
      ok: false,
      failure: { category: "checksum", name: "UnrecoverableChecksum" },
    });
    expect(await readStore("profile", "profile")).toEqual(profileBefore);
    expect(await readStore("campaigns")).toEqual(campaignsBefore);
    expect(await readStore("revisions")).toEqual(revisionsBefore);
  });

  it("does not overwrite a campaign when every stored envelope is malformed", async () => {
    const created = createCampaignProfile();
    const repository = createRepository();
    expect((await repository.saveCampaign(created.profile, created.campaign, 0)).ok).toBe(true);
    const currentBefore = await readStore<Record<string, unknown>>(
      "campaigns",
      created.campaign.campaignId,
    );
    await changeCurrent(created.campaign.campaignId, (snapshot) => {
      snapshot.schemaVersion = 99;
    });
    const malformed = await readStore("campaigns", created.campaign.campaignId);

    expect(
      await repository.saveCampaign(
        created.profile,
        changedCampaign(created.campaign, 8),
        null,
      ),
    ).toMatchObject({
      ok: false,
      failure: { category: "validation", operation: "write" },
    });
    expect(await readStore("campaigns", created.campaign.campaignId)).toEqual(malformed);
    expect(malformed).not.toEqual(currentBefore);
  });

  it("aborts before mutating any store when supplied campaign metadata is invalid", async () => {
    const created = createCampaignProfile();
    const repository = createRepository();
    expect((await repository.saveCampaign(created.profile, created.campaign, 0)).ok).toBe(true);
    const profileBefore = await readStore("profile", "profile");
    const campaignBefore = await readStore("campaigns", created.campaign.campaignId);
    const revisionsBefore = await readStore("revisions");
    const invalidCampaign = {
      ...changedCampaign(created.campaign, 9),
      status: "invalid",
    } as unknown as LocalCampaignRecord;
    const invalidProfile = {
      ...profileWithCampaign(created.profile, invalidCampaign),
      nextCampaignNumber: Number.NaN,
    };

    expect(await repository.saveCampaign(invalidProfile, invalidCampaign, 1)).toMatchObject({
      ok: false,
      failure: { category: "validation", name: "MetadataValidationError" },
    });
    expect(await readStore("profile", "profile")).toEqual(profileBefore);
    expect(await readStore("campaigns", created.campaign.campaignId)).toEqual(campaignBefore);
    expect(await readStore("revisions")).toEqual(revisionsBefore);
  });

  it("fails closed for malformed or dangling profile metadata", async () => {
    const created = createCampaignProfile();
    const repository = createRepository();
    expect((await repository.saveCampaign(created.profile, created.campaign, 0)).ok).toBe(true);
    const stored = await readStore<Record<string, unknown>>("profile", "profile");
    await putStore("profile", { ...stored, nextCampaignNumber: "invalid" });
    expect(await repository.loadProfile()).toMatchObject({
      ok: false,
      failure: { category: "validation", name: "MetadataValidationError" },
    });

    await putStore("profile", {
      ...stored,
      campaigns: [
        ...(stored.campaigns as unknown[]),
        {
          campaignId: "ghost",
          name: "Ghost",
          createdAtRealMs: 1,
          updatedAtRealMs: 1,
          status: "resumable",
        },
      ],
      activeCampaignId: "ghost",
    });
    expect(await repository.loadProfile()).toMatchObject({
      ok: false,
      failure: { category: "validation", name: "MetadataValidationError" },
    });
  });

  it("assembles a profile from a valid prior when current and newer prior envelopes are malformed", async () => {
    const created = createCampaignProfile();
    const repository = createRepository();
    expect((await repository.saveCampaign(created.profile, created.campaign, 0)).ok).toBe(true);
    const second = changedCampaign(created.campaign, 2);
    expect(
      (await repository.saveCampaign(profileWithCampaign(created.profile, second), second, 1)).ok,
    ).toBe(true);
    const third = changedCampaign(created.campaign, 3);
    expect(
      (await repository.saveCampaign(profileWithCampaign(created.profile, third), third, 2)).ok,
    ).toBe(true);
    await changeCurrent(created.campaign.campaignId, (snapshot) => {
      snapshot.schemaVersion = 99;
    });
    await changePrior(created.campaign.campaignId, 2, (snapshot) => {
      snapshot.utf8Bytes = "invalid";
    });

    const loaded = await repository.loadProfile();
    expect(loaded).toMatchObject({
      ok: true,
      value: { campaigns: [{ campaignId: created.campaign.campaignId }] },
    });
    if (loaded.ok && loaded.value) {
      expect(serializeGameState(loaded.value.campaigns[0]!.state)).toBe(
        serializeGameState(created.campaign.state),
      );
    }
    const repaired = changedCampaign(created.campaign, 4);
    expect(
      await repository.saveCampaign(
        profileWithCampaign(created.profile, repaired),
        repaired,
        1,
      ),
    ).toEqual({ ok: true, value: { revision: 4 } });
  });

  it("isolates large and small raw campaign writes", async () => {
    const first = createCampaignProfile("Small Clinic", "small");
    const second = appendLocalCampaign(first.profile, founder, "Large Clinic", 124, "large");
    const large = createLargeCampaign(second.campaign);
    const completeProfile = profileWithCampaign(second.profile, large);
    const repository = createRepository();
    expect((await repository.saveCampaign(completeProfile, large, 0)).ok).toBe(true);
    expect((await repository.saveCampaign(completeProfile, first.campaign, 0)).ok).toBe(true);
    const largeBefore = await readStore<Record<string, unknown>>("campaigns", large.campaignId);
    const smallBefore = await readStore<Record<string, unknown>>(
      "campaigns",
      first.campaign.campaignId,
    );
    expect(largeBefore.utf8Bytes).toEqual(expect.any(Number));
    expect(largeBefore.utf8Bytes as number).toBeGreaterThan(1_000_000);
    expect(largeBefore.utf8Bytes as number).toBeGreaterThan(
      (smallBefore.utf8Bytes as number) + 1_000_000,
    );
    const initiallyLoadedLarge = await repository.loadCampaign(large.campaignId);
    const initiallyLoadedSmall = await repository.loadCampaign(first.campaign.campaignId);
    expect(initiallyLoadedLarge.ok && initiallyLoadedLarge.value).toBeTruthy();
    expect(initiallyLoadedSmall.ok && initiallyLoadedSmall.value).toBeTruthy();
    if (initiallyLoadedLarge.ok && initiallyLoadedLarge.value) {
      expect(serializeGameState(initiallyLoadedLarge.value.campaign.state)).toBe(
        serializeGameState(large.state),
      );
      expect(initiallyLoadedLarge.value.campaign.state.operationReceipts).toEqual(
        large.state.operationReceipts,
      );
    }
    if (initiallyLoadedSmall.ok && initiallyLoadedSmall.value) {
      expect(serializeGameState(initiallyLoadedSmall.value.campaign.state)).toBe(
        serializeGameState(first.campaign.state),
      );
    }

    const smallUpdate = changedCampaign(first.campaign, 7);
    expect(
      (await repository.saveCampaign(completeProfile, smallUpdate, 1)).ok,
    ).toBe(true);
    expect(await readStore("campaigns", large.campaignId)).toEqual(largeBefore);
    const loadedSmallUpdate = await repository.loadCampaign(first.campaign.campaignId);
    if (loadedSmallUpdate.ok && loadedSmallUpdate.value) {
      expect(serializeGameState(loadedSmallUpdate.value.campaign.state)).toBe(
        serializeGameState(smallUpdate.state),
      );
    }

    const smallBeforeFailure = await readStore("campaigns", first.campaign.campaignId);
    const profileBeforeFailure = await readStore("profile", "profile");
    const historyBeforeFailure = await readStore("revisions");
    const failedLarge = createLargeCampaign(changedCampaign(large, 8));
    expect(
      await createRepository({
        beforeTransactionCommit: () => {
          throw new Error("large write failed");
        },
      }).saveCampaign(completeProfile, failedLarge, 1),
    ).toMatchObject({ ok: false, failure: { category: "transaction" } });
    expect(await readStore("campaigns", first.campaign.campaignId)).toEqual(smallBeforeFailure);
    expect(await readStore("campaigns", large.campaignId)).toEqual(largeBefore);
    expect(await readStore("profile", "profile")).toEqual(profileBeforeFailure);
    expect(await readStore("revisions")).toEqual(historyBeforeFailure);
  });

  it("merges different-campaign concurrent writes without dropping metadata", async () => {
    const first = createCampaignProfile("First Clinic", "first");
    const second = appendLocalCampaign(first.profile, founder, "Second Clinic", 124, "second");
    const repository = createRepository();
    const results = await Promise.all([
      repository.saveCampaign(first.profile, first.campaign, 0),
      repository.saveCampaign(second.profile, second.campaign, 0),
    ]);

    expect(results).toEqual([
      { ok: true, value: { revision: 1 } },
      { ok: true, value: { revision: 1 } },
    ]);
    const loaded = await repository.loadProfile();
    expect(loaded).toMatchObject({
      ok: true,
      value: {
        campaigns: [
          { campaignId: first.campaign.campaignId },
          { campaignId: second.campaign.campaignId },
        ],
      },
    });
    if (loaded.ok && loaded.value) {
      expect(loaded.value.campaigns.map((campaign) => serializeGameState(campaign.state))).toEqual([
        serializeGameState(first.campaign.state),
        serializeGameState(second.campaign.state),
      ]);
    }
  });

  it("migrates into populated storage, reports interruption, and resumes without source mutation", async () => {
    const unrelated = createCampaignProfile("Existing Clinic", "existing");
    const repository = createRepository();
    expect((await repository.saveCampaign(unrelated.profile, unrelated.campaign, 0)).ok).toBe(true);
    const unrelatedBefore = await readStore("campaigns", unrelated.campaign.campaignId);

    const first = createCampaignProfile("Legacy One", "legacy-one");
    const second = appendLocalCampaign(first.profile, founder, "Legacy Two", 124, "legacy-two");
    const source = JSON.stringify(second.profile);
    let writes = 0;
    const interrupted = createRepository({
      beforeTransactionCommit: () => {
        writes += 1;
        if (writes === 2) {
          throw new Error("stop migration");
        }
      },
    });
    expect(await interrupted.migrateLegacyProfile(second.profile)).toMatchObject({
      ok: false,
      failure: {
        migratedCampaignIds: [first.campaign.campaignId],
        skippedCampaignIds: [],
        failingCampaignId: second.campaign.campaignId,
      },
    });
    expect(JSON.stringify(second.profile)).toBe(source);
    expect(await readStore("campaigns", unrelated.campaign.campaignId)).toEqual(unrelatedBefore);
    expect(await repository.loadProfile()).toMatchObject({
      ok: true,
      value: {
        activeCampaignId: unrelated.campaign.campaignId,
        campaigns: [
          { campaignId: unrelated.campaign.campaignId },
          { campaignId: first.campaign.campaignId },
        ],
      },
    });

    expect(await repository.migrateLegacyProfile(second.profile)).toMatchObject({
      ok: true,
      value: {
        migratedCampaignIds: [second.campaign.campaignId],
        skippedCampaignIds: [first.campaign.campaignId],
      },
    });
    expect(await repository.loadProfile()).toMatchObject({
      ok: true,
      value: {
        activeCampaignId: second.campaign.campaignId,
        campaigns: [
          { campaignId: unrelated.campaign.campaignId },
          { campaignId: first.campaign.campaignId },
          { campaignId: second.campaign.campaignId },
        ],
      },
    });
  });

  it("reports skipped progress and the failing campaign for a later same-id mismatch", async () => {
    const first = createCampaignProfile("First", "first");
    const second = appendLocalCampaign(first.profile, founder, "Second", 124, "second");
    const repository = createRepository();
    expect((await repository.migrateLegacyProfile(first.profile)).ok).toBe(true);
    const differentSecond = changedCampaign(second.campaign, 99);
    expect(
      (
        await repository.saveCampaign(
          profileWithCampaign(second.profile, differentSecond),
          differentSecond,
          0,
        )
      ).ok,
    ).toBe(true);
    const source = JSON.stringify(second.profile);

    expect(await repository.migrateLegacyProfile(second.profile)).toMatchObject({
      ok: false,
      failure: {
        category: "conflict",
        migratedCampaignIds: [],
        skippedCampaignIds: [first.campaign.campaignId],
        failingCampaignId: second.campaign.campaignId,
      },
    });
    expect(JSON.stringify(second.profile)).toBe(source);
  });

  it("skips only exact current content and repairs matching recovered content", async () => {
    const created = createCampaignProfile();
    const repository = createRepository();
    expect(await repository.migrateLegacyProfile(created.profile)).toMatchObject({
      ok: true,
      value: { migratedCampaignIds: [created.campaign.campaignId], skippedCampaignIds: [] },
    });
    expect(await repository.migrateLegacyProfile(created.profile)).toMatchObject({
      ok: true,
      value: { migratedCampaignIds: [], skippedCampaignIds: [created.campaign.campaignId] },
    });

    const second = changedCampaign(created.campaign, 2);
    expect(
      (await repository.saveCampaign(profileWithCampaign(created.profile, second), second, 1)).ok,
    ).toBe(true);
    await changeCurrent(created.campaign.campaignId, (snapshot) => {
      snapshot.checksum = "corrupt";
    });
    expect(await repository.migrateLegacyProfile(created.profile)).toMatchObject({
      ok: true,
      value: { migratedCampaignIds: [created.campaign.campaignId], skippedCampaignIds: [] },
    });
    expect(await repository.loadCampaign(created.campaign.campaignId)).toMatchObject({
      ok: true,
      value: { revision: 3, recovered: false, campaign: { state: { facilityTick: 0 } } },
    });

    const renamed = {
      ...created.profile,
      campaigns: [{ ...created.campaign, name: "Different metadata" }],
    };
    expect(await repository.migrateLegacyProfile(renamed)).toMatchObject({
      ok: false,
      failure: { category: "conflict", name: "LegacyCampaignContentConflict" },
    });
  });

  it("reports a post-commit migration as migrated after independent exact verification", async () => {
    const created = createCampaignProfile();
    const repository = createRepository({
      afterTransactionCommit: () => {
        throw new Error("verification path interrupted after commit");
      },
    });

    expect(await repository.migrateLegacyProfile(created.profile)).toMatchObject({
      ok: true,
      value: { migratedCampaignIds: [created.campaign.campaignId], skippedCampaignIds: [] },
    });
    expect(await createRepository().loadCampaign(created.campaign.campaignId)).toMatchObject({
      ok: true,
      value: { recovered: false, revision: 1 },
    });
  });

  it("does not report migration success when required metadata remains stale", async () => {
    const created = createCampaignProfile();
    const repository = createRepository();
    expect((await repository.saveCampaign(created.profile, created.campaign, 0)).ok).toBe(true);
    const sourceProfile = { ...created.profile, tutorialsEnabled: false };

    expect(
      await createRepository({
        beforeTransactionCommit: () => {
          throw new Error("metadata update aborted");
        },
      }).migrateLegacyProfile(sourceProfile),
    ).toMatchObject({
      ok: false,
      failure: {
        operation: "migration",
        migratedCampaignIds: [],
        skippedCampaignIds: [],
        failingCampaignId: created.campaign.campaignId,
      },
    });
    expect(await repository.loadProfile()).toMatchObject({
      ok: true,
      value: { tutorialsEnabled: true },
    });
  });
});
