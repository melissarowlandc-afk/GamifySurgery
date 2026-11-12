import type { SupabaseClient } from "@supabase/supabase-js";
import { APP_BUILD_VERSION } from "../appVersion";
import { accountStorageKey } from "./accountStorageKey";
import type { QuestionReviewFlagInput } from "./questionReviewFlags";

export const HOSTED_FLAGS_KEY = "gamify-surgery.question-flag-outbox.v1";
export const MAX_PENDING_FLAGS = 50;
export const MAX_FLAG_QUEUE_BYTES = 1_024 * 1_024;
export const MAX_FLAG_AGE_MS = 7 * 86_400_000;
export type HostedFlagStatus = "open" | "fixed_in_version" | "needs_owner" | "no_change";
export interface HostedQuestionFlag {
  user_id: string; flag_id: string; question_id: string; question_variant_id: string;
  question_variant_version: string; concept_id: string; concept_version: string;
  clinical_release_id: string; content_version: string; app_version: string;
  displayed_choice_order: string[]; chosen_answer_id: string | null; comment: string; flagged_at: string;
}
export interface FlagEntry {
  contextKey: string;
  payload: HostedQuestionFlag; delivery: "pending" | "sent";
  status?: HostedFlagStatus; fixedInVersion?: string | null;
}
export interface FlagStorage { getItem(key: string): string | null; setItem(key: string, value: string): void; }
export interface FlagTransport {
  send(payload: HostedQuestionFlag): Promise<{ status: HostedFlagStatus; fixedInVersion: string | null }>;
  read(ids: readonly string[]): Promise<{ flag_id: string; status: HostedFlagStatus; fixed_in_version: string | null }[]>;
}
const statuses = new Set(["open", "fixed_in_version", "needs_owner", "no_change"]);

/** Stable question slot = SHA-256 of the authored case/decision pair. Some
 * node IDs repeat across cases; joining the raw pair can exceed SQL's 160 cap. */
const slotIdentity = (input: QuestionReviewFlagInput) => JSON.stringify([input.clinicalCaseId, input.decisionNodeId]);
const contextKey = (input: QuestionReviewFlagInput) => JSON.stringify([input.clinicalCaseId, input.decisionNodeId,
  input.patientPresentationVariantId, input.selectedInstantiationProfileId]);
async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
export function matchesFlag(entry: FlagEntry, input: QuestionReviewFlagInput) {
  return entry.contextKey === contextKey(input) && entry.payload.question_variant_id === input.questionVariantId &&
    entry.payload.clinical_release_id === input.clinicalReleaseId;
}

export async function createHostedQuestionFlag(input: QuestionReviewFlagInput, accountId: string, comment: string,
  flagId: string = crypto.randomUUID(), now = Date.now()): Promise<HostedQuestionFlag> {
  // A digest identifies the exact frozen display revision, including profile,
  // without uploading names, clinical prose, correctness or the local campaign.
  const revision = JSON.stringify([input.patientPresentationVariantId, input.selectedInstantiationProfileId,
    input.patientPresentation, input.stem, [...input.answerChoices].sort((a, b) => a.id.localeCompare(b.id)), input.explanation]);
  const [slotDigest, revisionDigest] = await Promise.all([sha256(slotIdentity(input)), sha256(revision)]);
  const version = `sha256:${revisionDigest}`;
  const payload: HostedQuestionFlag = {
    user_id: accountId, flag_id: flagId, question_id: `question-slot:${slotDigest}`, question_variant_id: input.questionVariantId,
    question_variant_version: version, concept_id: input.primaryConceptId, concept_version: input.conceptVersion ?? input.clinicalReleaseId,
    clinical_release_id: input.clinicalReleaseId, content_version: input.contentVersion ?? input.clinicalReleaseId,
    app_version: APP_BUILD_VERSION, displayed_choice_order: input.answerChoices.map((choice) => choice.id),
    chosen_answer_id: input.selectedAnswerChoiceId, comment: comment.slice(0, 500), flagged_at: new Date(now).toISOString(),
  };
  if (!isHostedQuestionFlag(payload)) throw new Error("Question context is unavailable");
  return payload;
}

function isHostedQuestionFlag(value: unknown): value is HostedQuestionFlag {
  if (!value || typeof value !== "object") return false;
  const p = value as HostedQuestionFlag;
  const strings = ["question_id", "question_variant_id", "concept_id", "clinical_release_id"] as const;
  const versions = ["question_variant_version", "concept_version", "content_version", "app_version"] as const;
  return Object.keys(p).length === 14 && typeof p.user_id === "string" && typeof p.flag_id === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p.flag_id) && strings.every((key) => typeof p[key] === "string" && p[key].length > 0 && p[key].length <= 160) &&
    versions.every((key) => typeof p[key] === "string" && p[key].length > 0 && p[key].length <= 80) &&
    typeof p.comment === "string" && p.comment.length <= 500 && typeof p.flagged_at === "string" && Number.isFinite(Date.parse(p.flagged_at)) &&
    Array.isArray(p.displayed_choice_order) && p.displayed_choice_order.length >= 2 && p.displayed_choice_order.length <= 8 &&
    p.displayed_choice_order.every((id) => typeof id === "string" && id.length > 0 && id.length <= 160) &&
    new Set(p.displayed_choice_order).size === p.displayed_choice_order.length &&
    (p.chosen_answer_id === null || p.displayed_choice_order.includes(p.chosen_answer_id));
}

export function createFlagTransport(client: SupabaseClient, accountId: string): FlagTransport {
  async function token() {
    const { data, error } = await client.auth.getSession();
    if (error || data.session?.user.id !== accountId) throw new Error("Flag account unavailable");
    return data.session.access_token;
  }
  return {
    async send(payload) {
      if (payload.user_id !== accountId) throw new Error("Flag account mismatch");
      const accessToken = await token();
      const { data, error } = await client.from("question_flags").insert(payload)
        .select("flag_id,status,fixed_in_version").setHeader("Authorization", `Bearer ${accessToken}`).single();
      if (error) {
        // A lost acknowledgement can meet the duplicate constraint or an insert
        // rate limit on retry. Verify the immutable original, never overwrite it.
        const { data: original, error: readError } = await client.from("question_flags").select("*")
          .eq("user_id", accountId).eq("flag_id", payload.flag_id).setHeader("Authorization", `Bearer ${accessToken}`).single();
        if (readError || !original || !Object.entries(payload).every(([key, value]) =>
          key === "flagged_at" ? Date.parse(original[key]) === Date.parse(String(value)) : JSON.stringify(original[key]) === JSON.stringify(value))) {
          throw new Error("Flag acknowledgement unavailable");
        }
        if (!statuses.has(original.status)) throw new Error("Flag status unavailable");
        return { status: original.status as HostedFlagStatus, fixedInVersion: original.fixed_in_version };
      }
      if (error || data?.flag_id !== payload.flag_id || !statuses.has(data.status)) throw new Error("Flag service unavailable");
      return { status: data.status as HostedFlagStatus, fixedInVersion: data.fixed_in_version };
    },
    async read(ids) {
      if (!ids.length) return [];
      const accessToken = await token();
      const { data, error } = await client.from("question_flags").select("flag_id,status,fixed_in_version")
        .eq("user_id", accountId).in("flag_id", [...ids]).setHeader("Authorization", `Bearer ${accessToken}`);
      if (error || !Array.isArray(data)) throw new Error("Flag status unavailable");
      return data.filter((row) => ids.includes(row.flag_id) && statuses.has(row.status));
    },
  };
}

/** Bounded, account-only queue. Historic local review exports never enter it. */
export class QuestionFlagQueue {
  private entries: FlagEntry[] = [];
  private listeners = new Set<() => void>();
  private inFlight: Promise<void> | null = null;
  private stopped = false;
  private generation = 0;
  storageAvailable = true;
  dropped = 0;
  unavailable = false;
  constructor(readonly accountId: string, private storage: FlagStorage | null, private transport: FlagTransport,
    private allowed: () => boolean, private now = Date.now) {
    try {
      const parsed = JSON.parse(storage?.getItem(this.key()) ?? "null");
      if (parsed?.schemaVersion === 1 && Array.isArray(parsed.entries)) this.entries = parsed.entries.filter((entry: FlagEntry) =>
        entry && isHostedQuestionFlag(entry.payload) && entry.payload.user_id === accountId &&
        typeof entry.contextKey === "string" && entry.contextKey.length <= 600 &&
        ["pending", "sent"].includes(entry.delivery) && (entry.status === undefined || statuses.has(entry.status)));
    } catch { this.storageAvailable = false; }
    this.bound();
  }
  private key() { return accountStorageKey(HOSTED_FLAGS_KEY, this.accountId); }
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  private publish() { for (const listener of this.listeners) listener(); }
  list() { return this.entries; }
  find(input: QuestionReviewFlagInput) { return [...this.entries].reverse().find((entry) => matchesFlag(entry, input)); }
  private bound() {
    const previous = this.entries.length;
    this.entries = this.entries.filter((entry) => Date.parse(entry.payload.flagged_at) > this.now() -
      (entry.delivery === "pending" ? MAX_FLAG_AGE_MS : 90 * 86_400_000) && Date.parse(entry.payload.flagged_at) <= this.now() + 60_000);
    while (this.entries.length > MAX_PENDING_FLAGS || new TextEncoder().encode(JSON.stringify(this.entries)).length > MAX_FLAG_QUEUE_BYTES - 256) this.entries.shift();
    this.dropped += previous - this.entries.length;
  }
  private persist() {
    this.bound();
    try {
      if (!this.storage) throw new Error("No flag storage");
      this.storage.setItem(this.key(), JSON.stringify({ schemaVersion: 1, entries: this.entries }));
      this.storageAvailable = true;
    } catch { this.storageAvailable = false; }
    this.publish();
  }
  async submit(payload: HostedQuestionFlag, input: QuestionReviewFlagInput) {
    if (this.stopped || !this.allowed() || !isHostedQuestionFlag(payload) || payload.user_id !== this.accountId) throw new Error("Flag submission is unavailable");
    const existing = this.entries.find((entry) => entry.payload.flag_id === payload.flag_id);
    if (existing && (JSON.stringify(existing.payload) !== JSON.stringify(payload) || existing.contextKey !== contextKey(input))) throw new Error("Flag identity conflict");
    if (!existing) {
      this.entries.push({ payload, contextKey: contextKey(input), delivery: "pending" }); this.persist();
    }
    await this.flush();
  }
  flush(): Promise<void> {
    if (this.stopped || !this.allowed()) return Promise.resolve();
    if (this.inFlight) return this.inFlight;
    this.bound();
    const generation = this.generation;
    const request = (async () => {
      await Promise.resolve();
      for (const entry of [...this.entries].filter((item) => item.delivery === "pending")) {
        if (this.stopped || !this.allowed() || generation !== this.generation) break;
        try {
          const result = await this.transport.send(entry.payload);
          if (this.stopped || !this.allowed() || generation !== this.generation) break;
          entry.delivery = "sent"; entry.status = result.status; entry.fixedInVersion = result.fixedInVersion;
          this.unavailable = false; this.persist();
        } catch { this.unavailable = true; this.publish(); break; }
      }
    })().finally(() => { this.inFlight = null; });
    this.inFlight = request;
    return request;
  }
  async refreshStatuses() {
    if (this.stopped || !this.allowed()) return;
    const generation = this.generation;
    try {
      const rows = await this.transport.read(this.entries.filter((entry) => entry.delivery === "sent").map((entry) => entry.payload.flag_id));
      if (this.stopped || !this.allowed() || generation !== this.generation) return;
      for (const row of rows) {
        const entry = this.entries.find((item) => item.payload.flag_id === row.flag_id);
        if (entry) { entry.status = row.status; entry.fixedInVersion = row.fixed_in_version; }
      }
      this.persist();
    } catch { /* Last acknowledged status remains available; no false disposition. */ }
  }
  clear() { this.generation += 1; this.entries = []; this.persist(); }
  stop() { this.stopped = true; this.generation += 1; }
}
