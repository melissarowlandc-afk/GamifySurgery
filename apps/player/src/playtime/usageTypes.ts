export const USAGE_NOTICE_VERSION = "beta1.usage.v1";
export const USAGE_METRIC_VERSION = "first-scored-patient-and-employee.v1";
export const USAGE_NOTICE_TEXT = "We record how long you play (only while the game is open, unpaused and in use) and how many questions you answer — never your answers in usage counts. Voluntary question flags and feedback comments are stored for the game owner to review. Data is kept 90 days. You can ask to delete it any time.";
export const USAGE_IDLE_MS = 5 * 60_000;
export const USAGE_HEARTBEAT_MS = 60_000;
export const USAGE_INTERVAL_MS = 30_000;
export const USAGE_MAX_OBSERVATION_GAP_MS = 5_000;
export const USAGE_MAX_AGE_MS = 7 * 86_400_000;
// Small aggregate outbox; reserve local storage for campaign checkpoints.
export const USAGE_QUEUE_BYTES = 64 * 1_024 - 256; // Reserve envelope/stop-marker overhead.
export const USAGE_BATCH_SIZE = 100;

export interface QuestionUsageReceipt {
  receipt_id: string;
  kind: "question";
  occurred_at: string;
}

export interface PlaytimeUsageReceipt {
  receipt_id: string;
  kind: "playtime";
  session_id: string;
  started_at: string;
  ended_at: string;
  active_ms: number;
}

/** Count/time only. Clinical identifiers and answers never cross this boundary. */
export type UsageReceipt = QuestionUsageReceipt | PlaytimeUsageReceipt;
export interface UsageAccess {
  admitted: boolean;
  notice_accepted: boolean;
  deletion_requested: boolean;
  /** Read-only server assignment; absent on older servers means standard play. */
  casual?: boolean;
}
export type UsageUploadState = "requires-notice" | "ready" | "pending" | "unavailable" | "blocked" | "deleted";
export interface UsageStatus {
  state: UsageUploadState;
  pendingReceipts: number;
  droppedReceipts: number;
  storageAvailable: boolean;
  countingHere: boolean;
}
export interface UsageTransport {
  access(): Promise<UsageAccess>;
  acceptNotice(version: string): Promise<void>;
  ingest(receipts: readonly UsageReceipt[], keepalive: boolean): Promise<readonly string[]>;
  requestDeletion(): Promise<void>;
}

export function usageReceiptTime(receipt: UsageReceipt): number {
  return Date.parse(receipt.kind === "question" ? receipt.occurred_at : receipt.ended_at);
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function isUsageReceipt(value: unknown): value is UsageReceipt {
  if (!value || typeof value !== "object") return false;
  const r = value as Record<string, unknown>;
  if (typeof r.receipt_id !== "string" || !uuidPattern.test(r.receipt_id)) return false;
  if (r.kind === "question") {
    return Object.keys(r).length === 3 && typeof r.occurred_at === "string" && Number.isFinite(Date.parse(r.occurred_at));
  }
  return r.kind === "playtime" && Object.keys(r).length === 6 &&
    typeof r.session_id === "string" && uuidPattern.test(r.session_id) &&
    typeof r.started_at === "string" && typeof r.ended_at === "string" &&
    typeof r.active_ms === "number" && Number.isSafeInteger(r.active_ms) && r.active_ms > 0 &&
    r.active_ms <= USAGE_INTERVAL_MS && Number.isFinite(Date.parse(r.started_at)) &&
    Date.parse(r.ended_at) - Date.parse(r.started_at) >= r.active_ms &&
    Date.parse(r.ended_at) - Date.parse(r.started_at) <= USAGE_INTERVAL_MS &&
    r.started_at.slice(0, 10) === new Date(Date.parse(r.ended_at) - 1).toISOString().slice(0, 10);
}

export function boundUsageReceipts<T extends UsageReceipt>(receipts: readonly T[], now: number): { receipts: T[]; dropped: number } {
  const unique = new Map<string, T>();
  let dropped = 0;
  for (const r of receipts) {
    if (!isUsageReceipt(r) || usageReceiptTime(r) <= now - USAGE_MAX_AGE_MS || usageReceiptTime(r) > now + 60_000) {
      dropped += 1;
    } else if (!unique.has(r.receipt_id)) unique.set(r.receipt_id, r);
  }
  const bounded = [...unique.values()].sort((a, b) => usageReceiptTime(a) - usageReceiptTime(b));
  let bytes = 2 + bounded.reduce((total, r) => total + new TextEncoder().encode(JSON.stringify(r)).length + 1, 0);
  while (bytes > USAGE_QUEUE_BYTES && bounded.length) {
    bytes -= new TextEncoder().encode(JSON.stringify(bounded.shift()!)).length + 1;
    dropped += 1;
  }
  return { receipts: bounded, dropped };
}

/** Optional local staging is decoded independently from gameplay/history. */
export function parseQuestionUsageReceipts(value: unknown, now = Date.now()): QuestionUsageReceipt[] {
  return boundUsageReceipts(Array.isArray(value)
    ? value.filter((r): r is QuestionUsageReceipt => isUsageReceipt(r) && r.kind === "question") : [], now).receipts;
}
