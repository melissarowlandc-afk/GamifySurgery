/** Production realms share immutable content-addressed assets. The engine
 * owns compressed case bytes and at most16 decoded templates; the UI/codec
 * normally keep only indexes and immutable cases already frozen in the save. */
export class RuntimeCatalogueRequired extends Error {
  constructor(readonly caseIndex?: number) { super("Runtime case data is required."); this.name = "RuntimeCatalogueRequired"; }
}
export class RuntimeCatalogueUnavailable extends Error {
  constructor() { super("Game data could not load. Retry the account save."); this.name = "RuntimeCatalogueUnavailable"; }
}
const caseOwners = new WeakMap<object, number>();
function missingCase(this: object): never { throw new RuntimeCatalogueRequired(caseOwners.get(this)); }
/** Define accessors in authored order during decode, rather than converting
 * thousands of already populated objects to expensive dictionary shapes. */
export function defineRuntimeCatalogueField(parent: object, key: string, owner: number): void {
  caseOwners.set(parent, owner); Object.defineProperty(parent, key, { enumerable: true, configurable: true, get: missingCase });
}
export const RUNTIME_CASE_CACHE_LIMIT = 16;
let status: (() => { indexed: boolean; decodedCases: number; bankBytes: number }) | undefined;
export const runtimeCatalogueStatus = () => status?.() ?? { indexed: false, decodedCases: 0, bankBytes: 0 };
let load: (() => Promise<void>) | undefined, pending: Promise<void> | undefined;
let prepare: (() => Promise<void>) | undefined, loadCase: ((index: number) => Promise<void>) | undefined;
let trim: ((pinned: ReadonlySet<number>) => void) | undefined, release: (() => void) | undefined;
export function releaseRuntimeCatalogue(): void { release?.(); }
export function registerRuntimeCatalogue(loader: () => Promise<void>): void { load = loader; pending = undefined; }
export async function ensureRuntimeCatalogue(): Promise<void> {
  if (!load) return;
  pending ??= load().catch(error => { pending = undefined; throw error; }); await pending;
}
export async function prepareRuntimeCaseCatalogue(): Promise<void> { await prepare?.(); }
/** Finite boot/fallback work yields a browser task, not just a microtask.
 * Close both ports after every yield; there is no permanent channel/timer. */
export function yieldRuntimeTask(): Promise<void> {
  return new Promise(resolve => {
    if (typeof MessageChannel === "undefined") { setTimeout(resolve, 0); return; }
    let channel: MessageChannel | undefined;
    try {
      channel = new MessageChannel();
      const done = () => { channel!.port1.close(); channel!.port2.close(); resolve(); };
      channel.port1.onmessage = done; channel.port1.onmessageerror = done;
      channel.port2.postMessage(null);
    } catch {
      channel?.port1.close(); channel?.port2.close(); setTimeout(resolve, 0);
    }
  });
}
export function runtimeCaseCatalogueEnabled(): boolean { return !!loadCase; }
export function requireRuntimeCatalogue(): never { throw new RuntimeCatalogueRequired(); }

/** Codec legacy readers retry before any durable write. Native snapshots use
 * their frozen cases and never need to load the current full catalogue. */
export async function withRuntimeCatalogue<T>(work: () => Promise<T>): Promise<T> {
  try { return await work(); }
  catch (error) {
    if (!(error instanceof RuntimeCatalogueRequired)) throw error;
    try { await ensureRuntimeCatalogue(); } catch { throw new RuntimeCatalogueUnavailable(); }
    return work();
  }
}
/** The processor publishes only after command, evidence, diff AND projection
 * succeed. Missing templates retry that same immutable prefix/operation ID.
 * Pin all cases touched by one request so a wide command cannot thrash the bounded cache. */
export async function withRuntimeCaseSlices<T>(work: () => T): Promise<T> {
  const pinned = new Set<number>();
  try {
    for (;;) {
      try { return work(); }
      catch (error) {
        if (!(error instanceof RuntimeCatalogueRequired) || error.caseIndex === undefined || !loadCase) throw error;
        if (pinned.has(error.caseIndex)) throw Error("Runtime case installation failed");
        pinned.add(error.caseIndex); await loadCase(error.caseIndex); trim?.(pinned);
      }
    }
  } finally { trim?.(new Set()); }
}
interface CatalogueIndex {
  SYNTHETIC_CLINICAL_RELEASE: { cases: Record<string, unknown>[] };
  __runtimeDeferred?: (Record<string, unknown> | string[] | number)[];
}
export interface RuntimeCaseSource {
  prepare(): Promise<void>;
  read(index: number): Promise<Record<string, unknown>>;
  release?(): void;
  bytes?(): number;
}
const replace = (target: Record<string, unknown>, descriptors: PropertyDescriptorMap) => {
  for (const key of Object.keys(target)) delete target[key]; Object.defineProperties(target, descriptors);
};
/** Fields keep their original positions (including optional undefined fields).
 * An index can never be silently frozen/exported as a truncated clinical case. */
export function installRuntimeCatalogueIndex(data: CatalogueIndex, fullCases: () => Promise<Record<string, unknown>[]>, source?: RuntimeCaseSource): void {
  const deferred = data.__runtimeDeferred ?? [], cases = data.SYNTHETIC_CLINICAL_RELEASE.cases;
  for (let i = 0; i < deferred.length; i += 3) for (const key of deferred[i + 1] as string[])
    defineRuntimeCatalogueField(deferred[i] as object, key, deferred[i + 2] as number);
  delete data.__runtimeDeferred;
  const cached = new Map<number, PropertyDescriptorMap>(); let fullLoaded = false, fullBackup: PropertyDescriptorMap[] | undefined;
  status = () => ({ indexed: !fullLoaded, decodedCases: fullLoaded ? cases.length : cached.size, bankBytes: source?.bytes?.() ?? 0 });
  prepare = source ? () => source.prepare() : undefined;
  loadCase = source ? async index => {
    if (!Number.isSafeInteger(index) || index < 0 || index >= cases.length) throw Error("Runtime case index");
    const body = await source.read(index), target = cases[index]!;
    if (body.id !== target.id) throw Error("Runtime catalogue identity mismatch");
    if (!cached.has(index)) cached.set(index, Object.getOwnPropertyDescriptors(target));
    replace(target, Object.getOwnPropertyDescriptors(body));
  } : undefined;
  trim = pinned => {
    if (fullLoaded) return;
    for (const [index, descriptors] of cached) {
      if (cached.size <= RUNTIME_CASE_CACHE_LIMIT) break;
      if (!pinned.has(index)) { replace(cases[index]!, descriptors); cached.delete(index); }
    }
  };
  registerRuntimeCatalogue(async () => {
    const full = await fullCases();
    if (full.length !== cases.length || full.some((c, i) => c.id !== cases[i]!.id)) throw Error("Runtime catalogue identity mismatch");
    fullBackup ??= cases.map((c, i) => cached.get(i) ?? Object.getOwnPropertyDescriptors(c));
    for (let i = 0; i < cases.length; i++) replace(cases[i]!, Object.getOwnPropertyDescriptors(full[i]!));
    fullLoaded = true; cached.clear();
  });
  release = () => {
    if (fullBackup) { cases.forEach((c, i) => replace(c, fullBackup![i]!)); fullBackup = undefined; }
    else for (const [i, descriptors] of cached) replace(cases[i]!, descriptors);
    cached.clear(); fullLoaded = false; pending = undefined; source?.release?.();
  };
}
