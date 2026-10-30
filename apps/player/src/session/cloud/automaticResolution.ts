import type { CloudAccountRuntime } from "./CloudAccount";
import { type CloudClock, CloudSyncCoordinator } from "./coordinator";
import { cloudCheckDeadline, CLOUD_READ_TIMEOUT_MS } from "./checkDeadline";
import { cloudCodec } from "./codecWorker";
import type { CloudCodecExecutor } from "./codecTasks";
import { logicalJsonText, sha256Utf8, utf8Bytes } from "./codecJson";
import { automaticCopyId, cloudCopyFamily, copyDescendsFrom } from "./copySelection";
import { discoverClinicCopies, protectClinicCopy, retainedCopyParents, type VerifiedClinicCopy } from "./retainedCopies";
import { importSeparateCloudCampaign } from "./importCampaigns";
import { CloudGameSession } from "./gameSession";
import { CLOUD_SYNC_PROTOCOL, CloudSyncError, type CloudConfirmed } from "./transport";
import { CloudCacheError } from "./codecCache";
import { cloudScopeData } from "./scopeData";

interface Promotion {
  version: 1; family: string; originalId: string; targetId: string; name: string; olderName: string;
  winner: VerifiedClinicCopy; account: CloudConfirmed;
  phase: "prepared" | "archived" | "removing" | "imported" | "superseded";
  archivedRevision?: string;
}
export interface AutomaticOpenOptions {
  runtime: CloudAccountRuntime; campaignId: string; codec?: CloudCodecExecutor; clock?: CloudClock;
  storage?: Pick<Storage, "getItem">; cancelled?: () => boolean;
}
const canonical = (value: unknown) => logicalJsonText(JSON.parse(JSON.stringify(value)));
const uniqueName = (name: string, ending: string, taken: readonly string[]) => {
  let index = 1;
  for (;;) {
    const suffix = ending + (index === 1 ? "" : ` (${index})`), letters = Array.from(name);
    while (utf8Bytes(letters.join("") + suffix) > 160) letters.pop();
    const candidate = letters.join("") + suffix;
    if (!taken.some(row => row.toLowerCase() === candidate.toLowerCase())) return candidate;
    index++;
  }
};

/** Resolves before hydrating a playing session. Server authority remains CAS
 * fenced; every displaced copy is durably protected before any replacement. */
export async function openAutomaticCloudCampaign(options: AutomaticOpenOptions): Promise<CloudSyncCoordinator> {
  let cancelled = false;
  const current = () => !cancelled && !options.cancelled?.();
  const coordinators = new Set<CloudSyncCoordinator>();
  const codec = options.codec ?? cloudCodec, { runtime } = options;
  // Full load includes bounded decompression/repacking of large evidence pages;
  // retain its 30-second budget instead of treating CPU work as a network stall.
  const reads = new Set(["capabilities", "list", "head", "operation"]);
  const transport = new Proxy(runtime.transport, { get(target, name) {
    const method = Reflect.get(target, name);
    if (typeof method !== "function") return method;
    return (...args: unknown[]) => reads.has(String(name)) ? cloudCheckDeadline(method.apply(target, args), CLOUD_READ_TIMEOUT_MS) : method.apply(target, args);
  } });
  const make = (id: string) => {
    if (!current()) throw new CloudSyncError("auth");
    const value = new CloudSyncCoordinator({ ...runtime, transport, scope: cloudScopeData(runtime, id),
      clock: options.clock, codec, enabled: true });
    coordinators.add(value); return value;
  };
  const check = async () => {
    if (!current()) throw new CloudSyncError("auth");
    if (await runtime.entryStore.read("deletion-requested")) throw new CloudSyncError("deleted");
    const access = await transport.capabilities();
    if (!current() || access.accountId !== runtime.accountId) throw new CloudSyncError("auth");
    if (access.deletionRequested || !access.admitted) {
      await runtime.entryStore.write("account-command-block", { failure: access.deletionRequested ? "deleted" : "revoked" }).catch(() => {});
      throw new CloudSyncError(access.deletionRequested ? "deleted" : "revoked");
    }
    if (!access.enabled || access.writesEnabled === false) throw new CloudSyncError("disabled");
    if (!access.noticeAccepted) throw new CloudSyncError("notice");
    if (access.minProtocol > CLOUD_SYNC_PROTOCOL) throw new CloudSyncError("protocol");
    try { if (await runtime.entryStore.read("account-command-block")) await runtime.entryStore.write("account-command-block", null); }
    catch { /* Fresh admission permits online play; an unreadable gate denies offline fallback. */ }
  };
  const load = async (id: string) => {
    const head = await transport.head(id), copy = await transport.load(id, head.revision);
    const inspection = await codec.run({ kind: "inspectCopy", input: copy });
    if (copy.revision !== head.revision || copy.campaignId !== id) throw new CloudSyncError("corrupt");
    if (head.name !== undefined && inspection.campaign.name !== head.name || head.status !== undefined && inspection.campaign.status !== head.status) throw new CloudSyncError("corrupt");
    return copy;
  };
  const open = async (id: string, verifyRemoteHead = false) => {
    const coordinator = make(id);
    if (!await coordinator.open(verifyRemoteHead)) throw coordinator.hasLocalCacheConflict ? new CloudCacheError("conflict") :
      new CloudSyncError(coordinator.view.failure as "network" ?? "network");
    return coordinator;
  };
  const ready = async (account: CloudConfirmed, winner: VerifiedClinicCopy) => {
    const coordinator = await open(account.campaignId);
    if (await coordinator.journalChangedSinceOpen()) throw new CloudCacheError("conflict");
    // Resolve an uncertain acknowledgement using its original immutable request
    // before considering a rebase. A failed old lease cannot silently write.
    if (coordinator.view.pending) await coordinator.focus();
    if (coordinator.hasLocalCacheConflict) throw new CloudCacheError("conflict");
    const fresh = await load(account.campaignId);
    if (await coordinator.journalChangedSinceOpen()) throw new CloudCacheError("conflict");
    if (fresh.snapshot.uncompressedSha256 !== account.snapshot.uncompressedSha256) {
      // Our own acknowledgement is harmless if it is exactly the chosen copy.
      const inspection = await codec.run({ kind: "inspectCopy", input: fresh });
      if (inspection.digest !== winner.inspection.digest) throw new CloudSyncError("revision");
    }
    if (coordinator.view.canExecute && coordinator.confirmed?.snapshot.uncompressedSha256 === winner.copy.snapshot.uncompressedSha256 && !coordinator.view.pending) return coordinator;
    if (!await coordinator.adoptAutomaticCopy(fresh, winner.copy, winner.usageQuestions)) throw coordinator.hasLocalCacheConflict ? new CloudCacheError("conflict") :
      new CloudSyncError(coordinator.view.failure as "network" ?? "network");
    return coordinator;
  };
  const archiveHead = async (plan: Promotion): Promise<CloudConfirmed> => {
    const account = await load(plan.originalId), inspection = await codec.run({ kind: "inspectCopy", input: account });
    const expected = await codec.run({ kind: "inspectCopy", input: plan.account });
    if (inspection.digest !== expected.digest) throw new CloudSyncError("revision");
    if (inspection.campaign.status === "archived" && inspection.campaign.name === plan.olderName) return account;
    const coordinator = await ready(account, { copy: account, inspection, source: "account", usageQuestions: [] });
    // This metadata-only archival job deliberately handles the older account
    // branch. Its newer local journal has already been protected and must not
    // be rebound/replaced by the temporary projection.
    const session = await CloudGameSession.create(coordinator, undefined, undefined, { journal: false });
    session.updateMetadata({ ...session.metadata, name: plan.olderName, status: "archived" });
    if (!await session.checkpointNow("campaign-switch")) throw new CloudSyncError(coordinator.view.failure as "network" ?? "network");
    // Closing the lease does not add a gameplay command or change progress rank.
    if (!await coordinator.saveAndClose()) throw new CloudSyncError(coordinator.view.failure as "network" ?? "network");
    session.dispose(); return load(plan.originalId);
  };
  const finishPromotion = async (key: string, original: Promotion) => {
    let plan = original;
    await check();
    await protectClinicCopy(runtime.entryStore, plan.family, plan.winner, "active branch promotion");
    const oldInspection = await codec.run({ kind: "inspectCopy", input: plan.account });
    await protectClinicCopy(runtime.entryStore, plan.family, { copy: plan.account, inspection: oldInspection, source: "account", usageQuestions: [] }, "older account branch");
    if (plan.phase === "prepared") {
      const archived = await archiveHead(plan);
      plan = await runtime.entryStore.write(key, { ...plan, phase: "archived" as const, archivedRevision: archived.revision });
    }
    await check();
    let summaries = await transport.list();
    if (!summaries.some(row => row.campaignId === plan.targetId) && summaries.length >= 2) {
      if (!transport.deleteCampaign || !plan.archivedRevision) throw new CloudSyncError("capacity");
      // The exact old head and all evidence were verified, archived, protected
      // and its lease released. Only that older slot may be reclaimed. This
      // durable intent also handles a kill/lost acknowledgement after deletion.
      plan = await runtime.entryStore.write(key, { ...plan, phase: "removing" as const });
      await check();
      await transport.deleteCampaign({ campaignId: plan.originalId, expectedRevision: plan.archivedRevision! });
      summaries = await transport.list();
    }
    if (!summaries.some(row => row.campaignId === plan.targetId)) {
      await check();
      await importSeparateCloudCampaign(plan.winner.copy, transport, runtime.entryStore,
        { campaignId: plan.targetId, name: plan.name, status: "resumable" });
    }
    const active = await load(plan.targetId), inspection = await codec.run({ kind: "inspectCopy", input: active });
    if (inspection.digest !== plan.winner.inspection.digest && !copyDescendsFrom(active, { ...plan.winner.copy, campaignId: active.campaignId })) {
      // A later head is valid, but must be considered by the next ranked pass.
      // Never install an older frozen import over it.
      if (inspection.progress.facilityTick < plan.winner.inspection.progress.facilityTick) throw new CloudSyncError("corrupt");
    }
    await runtime.entryStore.write(key, { ...plan, phase: "imported" as const });
    await runtime.entryStore.write(`active-copy:${plan.family}`, { campaignId: plan.targetId });
    return plan.targetId;
  };
  let result: CloudSyncCoordinator | null = null;
  try {
    result = await cloudCheckDeadline((async () => {
      const initialEntries = await runtime.cache.accountEntries?.(runtime) ?? [];
      const parents = await retainedCopyParents(runtime, runtime.entryStore, initialEntries);
      const family = await cloudCopyFamily(options.campaignId, parents);
      let requested = options.campaignId;
      const pendingPlans = (await runtime.entryStore.entries()).filter(row => row.key.startsWith(`promotion:${family}:`));
      for (const row of pendingPlans) {
        const plan = row.value as Promotion;
        if (plan.version !== 1 || plan.family !== family) throw new CloudSyncError("storage");
        if (!["imported", "superseded"].includes(plan.phase)) {
          try { requested = await finishPromotion(row.key, plan); }
          catch (error) {
            if (!(error instanceof CloudSyncError) || !["revision", "writer"].includes(error.code)) throw error;
            // A real writer advanced this head after the old intent. Preserve
            // that intent and rank the fresh heads instead of looping forever.
            await runtime.entryStore.write(row.key, { ...plan, phase: "superseded" });
          }
        }
      }
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          await check();
          const summaries = await transport.list();
          const related = [];
          for (const row of summaries) if (await cloudCopyFamily(row.campaignId, parents) === family) related.push(row);
          // Never resurrect a deleted campaign from its old local cache. A
          // completed, verified promotion is the only cross-ID continuation.
          if (!related.length) throw new CloudSyncError("deleted");
          const account: CloudConfirmed[] = [];
          for (const row of related) {
            try { account.push(await load(row.campaignId)); }
            catch (error) {
              if (error instanceof CloudSyncError && ["auth", "deleted", "revoked", "network"].includes(error.code)) throw error;
              // Existing prior-revision recovery stays read-only. A corrupt
              // head cannot be overwritten/deleted by automatic resolution.
              // Selection already found corrupt remote bytes. Reusing a valid
              // same-revision cache here would hide that failure and miss the
              // verified-prior recovery branch below. Preserve that cache, then
              // verify the actual head and its prior revision explicitly.
              const coordinator = await open(row.campaignId, true);
              if (coordinator.confirmed?.priorRecovery) return coordinator;
              throw error;
            }
          }
          const entries = await runtime.cache.accountEntries?.(runtime) ?? [];
          const copies = await discoverClinicCopies({ scope: cloudScopeData(runtime, requested), family, codec,
            store: runtime.entryStore, entries, account, storage: options.storage, parents });
          let winner = copies[0]; if (!winner) throw new CloudSyncError("corrupt");
          const equivalentHead = copies.find(row => row.source === "account" && row.inspection.digest === winner!.inspection.digest && row.copy.campaignId !== winner!.copy.campaignId);
          if (equivalentHead) winner = equivalentHead;
          const active = related.find(row => row.status === "resumable" && !Object.hasOwn(parents, row.campaignId)) ??
            related.find(row => row.status === "resumable") ?? related.find(row => row.campaignId === requested) ?? related[0]!;
          let namingId = active.campaignId;
          const seenParents = new Set<string>();
          while (Object.hasOwn(parents, namingId) && !seenParents.has(namingId)) { seenParents.add(namingId); namingId = parents[namingId]!; }
          const originalName = namingId !== active.campaignId ? related.find(row => row.campaignId === namingId)?.name ??
            copies.find(row => row.copy.campaignId === namingId)?.inspection.campaign.name : null;
          const name = originalName?.replace(/ \(older copy\)(?: \(\d+\))?$/, "") ?? (active.status === "resumable" ? active.name :
            winner.inspection.campaign.name.replace(/ \(older copy\)(?: \(\d+\))?$/, ""));
          const compatible = account.find(row => copyDescendsFrom(winner.copy, row));
          const ordinaryPending = compatible && !Object.hasOwn(parents, compatible.campaignId) &&
            ["current:following", "current:in-flight"].includes(winner.source);
          // A normal descendant remains in its current durable cache while
          // ready() resolves its exact operation. Adoption protects it before
          // replacement if needed. Other branch/promotion work needs whole
          // frozen requests and usage retained before any mutation.
          for (const entry of entries) if (await cloudCopyFamily(entry.scope.campaignId, parents) === family && entry.recovery &&
            (!ordinaryPending || entry.scope.campaignId !== compatible.campaignId)) {
            const value = { scope: entry.scope, device: entry, account: account.find(row => row.campaignId === entry.scope.campaignId) ?? account[0]! };
            const key = `conflict:${entry.scope.campaignId}:${await sha256Utf8(canonical(value))}`;
            const stored = await runtime.entryStore.create(key, value);
            if (canonical(stored) !== canonical(value) || canonical(await runtime.entryStore.read(key)) !== canonical(value)) throw new CloudSyncError("storage");
          }
          const distinct = new Map(copies.map(row => [row.inspection.digest, row]));
          for (const copy of distinct.values()) {
            const base = account.find(row => copyDescendsFrom(row, copy.copy));
            if ((!base || copy.inspection.digest === winner.inspection.digest && winner.source !== "account") &&
              !(ordinaryPending && copy.inspection.digest === winner.inspection.digest))
              await protectClinicCopy(runtime.entryStore, family, copy, "automatic progress selection");
          }
          if (compatible && !Object.hasOwn(parents, compatible.campaignId)) {
            for (const previous of account) if (previous.campaignId !== compatible.campaignId) {
              const inspected = copies.find(row => row.source === "account" && row.copy.campaignId === previous.campaignId)!;
              if (inspected.inspection.campaign.status === "resumable") {
                await protectClinicCopy(runtime.entryStore, family, inspected, "older account branch");
                await archiveHead({ version: 1, family, originalId: previous.campaignId, targetId: compatible.campaignId, name,
                  olderName: uniqueName(name, " (older copy)", (await transport.list()).filter(row => row.campaignId !== previous.campaignId).map(row => row.name)),
                  winner, account: previous, phase: "prepared" });
              }
            }
            // Preserve divergent losers as archived account campaigns when a
            // slot is free; otherwise their verified local copy remains intact.
            for (const copy of distinct.values()) {
              // A retained ancestor is already in the winner's immutable
              // history. Keep its frozen journal locally; it needs no slot.
              if (copy.inspection.digest === winner.inspection.digest || copyDescendsFrom(winner.copy, copy.copy) || account.some(row => copyDescendsFrom(row, copy.copy)) ||
                account.some(row => row.snapshot.uncompressedSha256 === copy.copy.snapshot.uncompressedSha256)) continue;
              const id = automaticCopyId(family, copy.inspection.digest), latest = await transport.list();
              if (latest.length < 2 && !latest.some(row => row.campaignId === id)) {
                await importSeparateCloudCampaign(copy.copy, transport, runtime.entryStore,
                  { campaignId: id, name: uniqueName(name, " (older copy)", latest.map(row => row.name)), status: "archived" });
              }
            }
            const coordinator = await ready(compatible, winner);
            if (winner.inspection.campaign.status !== "resumable" || winner.inspection.campaign.name !== name) {
              const session = await CloudGameSession.create(coordinator);
              session.updateMetadata({ ...session.metadata, name, status: "resumable" });
              if (!await session.prepareRecoveryCopy()) throw new CloudSyncError("storage");
              // Detach the temporary observer; it shares the returned owner.
              session.detach();
            }
            return coordinator;
          }
          const previous = compatible ?? account.find(row => row.campaignId === active.campaignId)!;
          // Upgrade a legacy separate-copy ID to a family-bearing ID so other
          // devices can discover the active clinic without this device's journal.
          for (const other of account) if (other.campaignId !== previous.campaignId) {
            const inspection = await codec.run({ kind: "inspectCopy", input: other });
            if (inspection.campaign.status === "resumable") {
              const latest = await transport.list();
              await archiveHead({ version: 1, family, originalId: other.campaignId, targetId: previous.campaignId, name,
                olderName: uniqueName(name, " (older copy)", latest.filter(row => row.campaignId !== other.campaignId).map(row => row.name)),
                winner, account: other, phase: "prepared" });
            }
          }
          const targetId = automaticCopyId(family, winner.inspection.digest);
          const key = `promotion:${family}:${winner.inspection.digest}:${previous.snapshot.uncompressedSha256}`;
          const latestNames = await transport.list();
          const plan: Promotion = { version: 1, family, originalId: previous.campaignId, targetId, name,
            olderName: uniqueName(name, " (older copy)", latestNames.filter(row => row.campaignId !== previous.campaignId).map(row => row.name)),
            winner, account: previous, phase: "prepared" };
          requested = await finishPromotion(key, await runtime.entryStore.create(key, plan));
        } catch (error) {
          if (!current() || !(error instanceof CloudSyncError) ||
            !(["revision", "writer"].includes(error.code) || error instanceof CloudCacheError && error.reason === "conflict") || attempt === 2) throw error;
          // Bounded fresh selection after a server CAS or a previous document's
          // late local checkpoint. Re-read/rank, never overwrite the new cache.
        }
      }
      throw new CloudSyncError("revision");
    })(), 30_000, () => { cancelled = true; for (const coordinator of coordinators) coordinator.dispose(); });
    if (!current()) throw new CloudSyncError("auth");
    return result;
  } catch (error) {
    if (!(error instanceof CloudSyncError) || !["network", "throttled"].includes(error.code) || options.cancelled?.()) throw error;
    // A failed network check cannot erase verified device progress. It grants
    // local durability only; no account writes or invented server lease.
    result = await cloudCheckDeadline((async () => {
      if (await runtime.entryStore.read("deletion-requested") || await runtime.entryStore.read("account-command-block")) throw error;
      const entries = await runtime.cache.accountEntries?.(runtime) ?? [], parents = await retainedCopyParents(runtime, runtime.entryStore, entries);
      const family = await cloudCopyFamily(options.campaignId, parents);
      const copies = await discoverClinicCopies({ scope: cloudScopeData(runtime, options.campaignId), family, codec,
        store: runtime.entryStore, entries, account: [], storage: options.storage, parents });
      const winner = copies[0]; if (!winner || options.cancelled?.()) throw error;
      for (const copy of copies) await protectClinicCopy(runtime.entryStore, family, copy, "offline recovery");
      const coordinator = new CloudSyncCoordinator({ ...runtime, scope: cloudScopeData(runtime, winner.copy.campaignId), codec, clock: options.clock, enabled: true });
      coordinators.add(coordinator);
      if (!await coordinator.restoreVerifiedOffline(winner.copy, winner.usageQuestions)) throw error;
      if (options.cancelled?.()) { coordinator.dispose(); throw new CloudSyncError("auth"); }
      return coordinator;
    })());
    return result;
  } finally {
    for (const coordinator of coordinators) if (coordinator !== result) coordinator.dispose();
  }
}
