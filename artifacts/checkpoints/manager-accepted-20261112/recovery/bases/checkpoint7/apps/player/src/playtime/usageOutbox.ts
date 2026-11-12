import { accountStorageKey } from "../session/accountStorageKey";
import { boundUsageReceipts, isUsageReceipt, USAGE_BATCH_SIZE, type UsageReceipt } from "./usageTypes";

export const USAGE_OUTBOX_KEY = "gamify-surgery.usage.outbox.v1";
export type UsageStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

/** A separate, account-scoped queue. It never reads or uploads a campaign. */
export class UsageOutbox {
  private memory: UsageReceipt[] = [];
  private storageOk = true;
  private dropped = 0;
  private deleting = false;
  readonly key: string;

  constructor(accountId: string, private storage: UsageStorage | null, private now: () => number) {
    this.key = accountStorageKey(USAGE_OUTBOX_KEY, accountId);
    this.memory = this.read();
    // Prune persisted expired entries even when admission/consent blocks uploads.
    try { if (this.storage && this.storage.getItem(this.key) !== null) this.write(this.memory); } catch { this.storageOk = false; }
    try { this.deleting = this.storage?.getItem(`${this.key}.deletion-requested`) === "true"; } catch { /* Keep the in-memory guard. */ }
  }

  private read(): UsageReceipt[] {
    try {
      if (!this.storage) throw new Error("Storage unavailable");
      const parsed: unknown = JSON.parse(this.storage.getItem(this.key) ?? "[]");
      const bounded = boundUsageReceipts(Array.isArray(parsed) ? parsed.filter(isUsageReceipt) : [], this.now());
      this.dropped += bounded.dropped;
      this.storageOk = true;
      return bounded.receipts;
    } catch {
      this.storageOk = false;
      return this.memory;
    }
  }

  private write(receipts: readonly UsageReceipt[]): boolean {
    const bounded = boundUsageReceipts(receipts, this.now());
    this.dropped += bounded.dropped;
    this.memory = bounded.receipts;
    try {
      if (!this.storage) throw new Error("Storage unavailable");
      this.storage.setItem(this.key, JSON.stringify(this.memory));
      this.storageOk = true;
      return true;
    } catch {
      this.storageOk = false;
      return false;
    }
  }

  append(receipts: readonly UsageReceipt[]): boolean {
    return this.write([...this.read(), ...this.memory, ...receipts]);
  }

  batch(): UsageReceipt[] {
    this.write([...this.read(), ...this.memory]);
    return this.memory.slice(0, USAGE_BATCH_SIZE);
  }

  acknowledge(ids: readonly string[]): void {
    const acknowledged = new Set(ids);
    this.write([...this.read(), ...this.memory].filter((r) => !acknowledged.has(r.receipt_id)));
  }

  clear(): void {
    this.memory = [];
    try { this.storage?.removeItem(this.key); } catch { this.storageOk = false; }
  }

  markDeletionRequested(): void {
    this.deleting = true;
    try { this.storage?.setItem(`${this.key}.deletion-requested`, "true"); } catch { this.storageOk = false; }
  }
  deletionRequested(): boolean { return this.deleting; }

  status() { return { pendingReceipts: this.memory.length, droppedReceipts: this.dropped, storageAvailable: this.storageOk }; }
}
