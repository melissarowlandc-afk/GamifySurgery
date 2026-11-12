import { afterEach, expect, it, vi } from "vitest";
import { QuestionFlagControl } from "./QuestionFlagControl";
import { phoneTestDom, cleanupPhoneTests } from "../mobile/screenTestUtils";
import { QuestionFlagQueue, type HostedQuestionFlag } from "../session/hostedQuestionFlags";
import { setAccountRequestsActive } from "../session/requestBudget";
import type { QuestionReviewFlagInput } from "../session/questionReviewFlags";
import type { ChartDecisionStepView } from "./types";

const fixture = vi.hoisted(() => ({ queue: null as QuestionFlagQueue | null }));
vi.mock("../auth/AuthAccountContext", () => ({ useAuthAccountId: () => "flag-mounts" }));
vi.mock("../playtime/UsageProvider", () => ({ useUsageTracking: () => null }));
vi.mock("../session/QuestionFlagProvider", () => ({ useQuestionFlags: () => fixture.queue }));
afterEach(async () => { await cleanupPhoneTests(); fixture.queue?.stop(); fixture.queue = null; setAccountRequestsActive("flag-mounts", true); });

it("shares the automatic disposition budget across question mounts and never reads hidden or closed", async () => {
  const env = phoneTestDom(); let now = Date.now();
  const read = vi.fn(async () => []);
  const queue = fixture.queue = new QuestionFlagQueue("flag-mounts", null, {
    send: async () => ({ status: "open", fixedInVersion: null }), read,
  }, () => true, () => now);
  const input = { clinicalCaseId: "case", decisionNodeId: "decision", patientPresentationVariantId: "profile",
    selectedInstantiationProfileId: "instance" } as QuestionReviewFlagInput;
  const payload: HostedQuestionFlag = { user_id: "flag-mounts", flag_id: "00000000-0000-4000-8000-000000000001",
    question_id: "slot", question_variant_id: "variant", question_variant_version: "v1", concept_id: "concept", concept_version: "v1",
    clinical_release_id: "release", content_version: "v1", app_version: "test", displayed_choice_order: ["a", "b"],
    chosen_answer_id: null, comment: "synthetic", flagged_at: new Date(now).toISOString() };
  await queue.submit(payload, input);
  const render = (id: string) => {
    const step: ChartDecisionStepView = { id, questionVariantId: id, reviewFlagInput: input, heading: "Question",
      answerChoices: [], current: true, complete: false };
    return env.render(<QuestionFlagControl key={id} step={step} onSubmit={vi.fn()} />);
  };
  await render("first"); expect(read).toHaveBeenCalledOnce();
  for (let i = 0; i < 20; i++) await render(`next.${i}`);
  expect(read).toHaveBeenCalledOnce();
  now += 15 * 60_000; Object.assign(env.doc, { visibilityState: "hidden" });
  await render("hidden"); expect(read).toHaveBeenCalledOnce();
  Object.assign(env.doc, { visibilityState: "visible" }); setAccountRequestsActive("flag-mounts", false);
  await render("closed"); expect(read).toHaveBeenCalledOnce();
  setAccountRequestsActive("flag-mounts", true); await render("reopened"); expect(read).toHaveBeenCalledTimes(2);
});
