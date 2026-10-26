import type { GameState } from "@gamify-surgery/game-domain";
import { averageDailyRevenue, readRevenueHistory, type RevenueHistory } from "./revenue";
import { CompetitionAccessError, CompetitionValidationError, isCompetitionSubmission,
  type CompetitionSubmission, type CompetitionTransport } from "./types";

export type CompetitionStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export const COMPETITION_STORAGE_KEY = "gamify-surgery.competition.v1";
const RETENTION_MS = 90 * 86_400_000;
const QUEUE_MAX_AGE_MS = 7 * 86_400_000;
const MAX_CLINICS = 32;
interface RecordEntry extends RevenueHistory {
  campaignId: string;
  touchedAt: number;
  pending?: CompetitionSubmission;
  sentDay?: number;
}

/** Small aggregate-only outbox; no campaign, patient, answer, token or email data. */
export class CompetitionClient {
  private records = new Map<string, RecordEntry>();
  private flushing: Promise<void> | null = null;
  private blocked = false;
  constructor(private transport: CompetitionTransport, private storage: CompetitionStorage | null,
    readonly storageKey: string, private now = () => Date.now()) {
    try {
      const parsed: unknown = JSON.parse(storage?.getItem(storageKey) ?? "[]");
      if (Array.isArray(parsed)) for (const value of parsed.slice(-MAX_CLINICS)) {
        if (!value || typeof value !== "object") continue;
        const r = value as RecordEntry;
        if (typeof r.campaignId !== "string" || r.campaignId.length > 256 || !Number.isSafeInteger(r.boundaryDay) || r.boundaryDay < 0 ||
          !Number.isSafeInteger(r.boundaryGrossCents) || r.boundaryGrossCents < 0 || !Number.isFinite(r.touchedAt) ||
          r.touchedAt <= now() - RETENTION_MS || r.touchedAt > now() + 60_000 || !Array.isArray(r.days) || r.days.length > 3 ||
          !r.days.every(d => Number.isInteger(d?.day) && d.day >= 1 && Number.isSafeInteger(d.grossCents) && d.grossCents >= 0)) continue;
        this.records.set(r.campaignId, { campaignId: r.campaignId, boundaryDay: r.boundaryDay,
          boundaryGrossCents: r.boundaryGrossCents, days: r.days, touchedAt: r.touchedAt,
          ...(Number.isInteger(r.sentDay) ? { sentDay: r.sentDay } : {}),
          ...(isCompetitionSubmission(r.pending) && r.pending.campaignId === r.campaignId && r.touchedAt > now() - QUEUE_MAX_AGE_MS ? { pending: r.pending } : {}) });
      }
    } catch { /* Storage unavailable/corrupt: keep a bounded in-memory queue. */ }
  }

  /** Call only on mount/campaign change or a new completed game day. */
  observe(state: GameState, clinicName: string): void {
    if (this.blocked) return;
    const previous = this.records.get(state.campaignId);
    const history = readRevenueHistory(state, previous);
    // Restoring an older save must not move the queued/server day backwards.
    if (previous && previous.boundaryDay > history.boundaryDay) return;
    const record: RecordEntry = { ...history, campaignId: state.campaignId, touchedAt: this.now(),
      sentDay: previous?.sentDay, pending: previous?.pending };
    const average = averageDailyRevenue(history);
    if (average && history.boundaryDay > (previous?.sentDay ?? 0)) {
      const submission = { campaignId: state.campaignId, clinicName: clinicName.trim(), facilityLevel: state.facilityLevel,
        completedDay: history.boundaryDay, ...average };
      if (isCompetitionSubmission(submission)) record.pending = previous?.pending &&
        JSON.stringify(previous.pending) === JSON.stringify(submission) ? previous.pending : submission;
    }
    this.records.delete(state.campaignId); this.records.set(state.campaignId, record);
    this.persist();
  }

  private persist(): void {
    for (const [key, record] of this.records) if (record.touchedAt <= this.now() - RETENTION_MS) this.records.delete(key);
    while (this.records.size > MAX_CLINICS) this.records.delete(this.records.keys().next().value!);
    try { this.storage?.setItem(this.storageKey, JSON.stringify([...this.records.values()])); } catch { /* Never block gameplay. */ }
  }
  clear(): void {
    this.blocked = true; this.records.clear();
    try { this.storage?.removeItem(this.storageKey); } catch { /* The server membership tombstone is authoritative. */ }
  }
  async leaderboard() {
    if (this.blocked) throw new CompetitionAccessError("Competition access stopped");
    try { return await this.transport.leaderboard(); }
    catch (error) { if (error instanceof CompetitionAccessError) this.clear(); throw error; }
  }
  async setHidden(hidden: boolean): Promise<void> {
    if (this.blocked) throw new CompetitionAccessError("Competition access stopped");
    try { await this.transport.setHidden(hidden); }
    catch (error) { if (error instanceof CompetitionAccessError) this.clear(); throw error; }
  }
  flush(): Promise<void> {
    if (this.blocked) return Promise.resolve();
    if (this.flushing) return this.flushing;
    this.flushing = this.upload().finally(() => { this.flushing = null; });
    return this.flushing;
  }
  private async upload(): Promise<void> {
    for (const record of this.records.values()) {
      const pending = record.pending;
      if (!pending || this.blocked) continue;
      if (record.touchedAt <= this.now() - QUEUE_MAX_AGE_MS) { record.pending = undefined; this.persist(); continue; }
      try {
        await this.transport.submit(pending);
        if (this.blocked) return;
        const current = this.records.get(record.campaignId);
        if (current) {
          current.sentDay = Math.max(current.sentDay ?? 0, pending.completedDay);
          // A newly completed day may have replaced this pending value in flight.
          if (current.pending === pending) current.pending = undefined;
          this.persist();
        }
      } catch (error) {
        if (error instanceof CompetitionAccessError) this.clear();
        if (error instanceof CompetitionValidationError) {
          if (this.records.get(record.campaignId)?.pending === pending) this.records.get(record.campaignId)!.pending = undefined;
          this.persist(); continue;
        }
        return; // Offline/quota failures retain the newest clinic sample for retry.
      }
    }
  }
}
