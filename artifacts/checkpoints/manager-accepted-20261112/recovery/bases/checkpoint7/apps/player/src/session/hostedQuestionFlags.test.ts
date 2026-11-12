import { describe, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { scoredPatientFixture, scoredEmployeeFixture } from "../playtime/usageTestFixtures";
import { questionReviewContext } from "./questionReviewContext";
import { createHostedQuestionFlag, HOSTED_FLAGS_KEY, MAX_FLAG_AGE_MS, QuestionFlagQueue, type FlagTransport } from "./hostedQuestionFlags";
import { accountStorageKey } from "./accountStorageKey";

const now = Date.UTC(2026, 9, 13, 12);
const id = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const input = () => {
  const state = scoredPatientFixture();
  const subject = Object.values(state.encounters)[0]!;
  return questionReviewContext(state, subject.id, subject.frozenCase.decisionNodes[0]!.id)!;
};
function fixture() {
  const map = new Map<string, string>();
  const storage = { getItem: (key: string) => map.get(key) ?? null, setItem: (key: string, value: string) => map.set(key, value) };
  const transport: FlagTransport = { send: vi.fn(async () => ({ status: "open" as const, fixedInVersion: null })), read: vi.fn(async () => []) };
  let allowed = true;
  return { map, storage, transport, block: () => { allowed = false; },
    queue: new QuestionFlagQueue("account-a", storage, transport, () => allowed, () => now) };
}

describe("voluntary hosted flags", () => {
  it("sends only the SQL contract, actual frozen order/selected ID and bounded comment", async () => {
    const context = input(); context.answerChoices.reverse(); context.selectedAnswerChoiceId = context.answerChoices[1]!.id;
    const payload = await createHostedQuestionFlag(context, "account-a", "x".repeat(510), id(1), now);
    expect(payload.displayed_choice_order).toEqual(context.answerChoices.map((choice) => choice.id));
    expect(payload.chosen_answer_id).toBe(context.selectedAnswerChoiceId);
    expect(payload.question_id).toMatch(/^question-slot:[a-f0-9]{64}$/);
    expect(payload.question_variant_version).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(payload.comment).toHaveLength(500); expect(payload.flagged_at).toBe(new Date(now).toISOString());
    expect(Object.keys(payload)).toHaveLength(14);
    for (const field of ["stem", "patientDisplayName", "campaignId", "clinicName", "isCorrect", "explanation", "answerWasCorrect"]) expect(payload).not.toHaveProperty(field);
  });

  it("identifies all current patient and employee slots within the SQL lengths", async () => {
    const state = scoredPatientFixture();
    const sample = Object.values(state.encounters)[0]!;
    const slots = new Set<string>();
    for (const clinicalCase of PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases) {
      const subject = { ...sample, frozenCase: clinicalCase, clinicalReleaseId: PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.id };
      state.encounters[subject.id] = subject;
      for (const node of clinicalCase.decisionNodes) {
        const context = questionReviewContext(state, subject.id, node.id)!;
        context.selectedAnswerChoiceId = null;
        const flag = await createHostedQuestionFlag(context, "account-a", "", id(1), now).catch(() => {
          throw new Error(JSON.stringify({ caseId: context.clinicalCaseId, nodeId: node.id, variant: context.questionVariantId,
            version: context.contentVersion, choices: node.answerChoices.map((c) => c.id) }));
        });
        expect(flag).toMatchObject({ concept_id: node.primaryConceptId });
        expect(slots.has(flag.question_id), `Duplicate authored question slot ${node.id}`).toBe(false);
        slots.add(flag.question_id);
      }
    }
    const employee = scoredEmployeeFixture();
    const discussion = Object.values(employee.employeeDiscussions!)[0]!;
    const context = questionReviewContext(employee, discussion.id, discussion.frozenCase.decisionNodes[0]!.id)!;
    expect(context.patientDisplayName).toBe("Synthetic Colleague");
    await expect(createHostedQuestionFlag(context, "account-a", "", id(1), now)).resolves.toBeDefined();
  });

  it("persists offline reports, retries the same UUID, restores only this account and reads dispositions", async () => {
    const f = fixture(); const payload = await createHostedQuestionFlag(input(), "account-a", "Review this", id(1), now);
    vi.mocked(f.transport.send).mockRejectedValueOnce(new Error("Offline"));
    await f.queue.submit(payload, input());
    expect(f.queue.find(input())?.delivery).toBe("pending");
    const reloaded = new QuestionFlagQueue("account-a", f.storage, f.transport, () => true, () => now);
    await reloaded.flush();
    expect(f.transport.send).toHaveBeenNthCalledWith(2, payload);
    expect(reloaded.find(input())).toMatchObject({ delivery: "sent", status: "open" });
    vi.mocked(f.transport.read).mockResolvedValue([{ flag_id: payload.flag_id, status: "fixed_in_version", fixed_in_version: "beta.2" }]);
    await reloaded.refreshStatuses();
    expect(reloaded.find(input())).toMatchObject({ status: "fixed_in_version", fixedInVersion: "beta.2" });
    expect(new QuestionFlagQueue("account-b", f.storage, f.transport, () => true, () => now).list()).toEqual([]);
  });

  it("bounds the offline queue to fifty and seven days without touching historic exports", async () => {
    const f = fixture(); vi.mocked(f.transport.send).mockRejectedValue(new Error("Offline"));
    f.map.set("gamify-surgery.question-review-flags.v1", "Unowned historic export");
    for (let n = 1; n <= 55; n++) await f.queue.submit(await createHostedQuestionFlag(input(), "account-a", "x".repeat(500), id(n), now), input());
    expect(f.queue.list()).toHaveLength(50); expect(f.queue.dropped).toBe(5);
    const encoded = f.map.get(accountStorageKey(HOSTED_FLAGS_KEY, "account-a"))!;
    expect(new TextEncoder().encode(encoded).length).toBeLessThanOrEqual(1_024 * 1_024);
    const expired = new QuestionFlagQueue("account-a", f.storage, f.transport, () => true, () => now + MAX_FLAG_AGE_MS);
    expect(expired.list()).toEqual([]); expect(expired.dropped).toBe(50);
    expect(f.map.get("gamify-surgery.question-review-flags.v1")).toBe("Unowned historic export");
  });

  it("keeps memory delivery honest if browser storage fails", async () => {
    const transport: FlagTransport = { send: vi.fn(async () => { throw new Error("Offline"); }), read: vi.fn() };
    const queue = new QuestionFlagQueue("account-a", { getItem: () => null, setItem: () => { throw new Error("Full"); } }, transport, () => true, () => now);
    await queue.submit(await createHostedQuestionFlag(input(), "account-a", "", id(1), now), input());
    expect(queue.storageAvailable).toBe(false); expect(queue.find(input())?.delivery).toBe("pending");
  });

  it("deletion/stop cannot resurrect a queued flag after a late acknowledgement", async () => {
    const f = fixture(); let resolve!: (result: { status: "open"; fixedInVersion: null }) => void;
    vi.mocked(f.transport.send).mockImplementation(() => new Promise((done) => { resolve = done; }));
    const sending = f.queue.submit(await createHostedQuestionFlag(input(), "account-a", "", id(1), now), input());
    await Promise.resolve(); await Promise.resolve();
    f.block(); f.queue.clear();
    resolve({ status: "open", fixedInVersion: null }); await sending;
    expect(f.queue.list()).toEqual([]);
    await f.queue.flush(); expect(f.transport.send).toHaveBeenCalledTimes(1);
    await expect(f.queue.submit(await createHostedQuestionFlag(input(), "account-a", "", id(2), now), input())).rejects.toThrow();
  });
});
