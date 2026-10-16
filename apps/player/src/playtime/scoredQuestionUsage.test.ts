import { describe, expect, it } from "vitest";
import { gameReducer, PROTOTYPE_DOMAIN_CONTEXT, TUTORIAL_ENCOUNTER_ID, type GameCommand } from "@gamify-surgery/game-domain";
import { isFirstScoredAnswer } from "./scoredQuestionUsage";

import { scoredEmployeeFixture, scoredPatientFixture } from "./usageTestFixtures";

describe("first scored answer usage transition", () => {
  for (const employee of [false, true]) for (const correct of [false, true]) {
    it(`counts a ${correct ? "right" : "wrong"} first ${employee ? "employee discussion" : "patient"} answer once, including a paused answer`, () => {
      const before = employee ? scoredEmployeeFixture() : scoredPatientFixture();
      const subject = employee ? Object.values(before.employeeDiscussions!)[0]! : before.encounters[TUTORIAL_ENCOUNTER_ID]!;
      const node = subject.frozenCase.decisionNodes[0]!;
      const command: GameCommand = employee ? { type: "SUBMIT_EMPLOYEE_DISCUSSION_ANSWER", discussionId: subject.id,
        decisionNodeId: node.id, answerChoiceId: node.answerChoices.find((c) => c.isCorrect === correct)!.id, operationId: "usage.first", reviewedAtMs: Date.now() } :
        { type: "SUBMIT_ANSWER", encounterId: subject.id, decisionNodeId: node.id,
          answerChoiceId: node.answerChoices.find((c) => c.isCorrect === correct)!.id, operationId: "usage.first", reviewedAtMs: Date.now() };
      const after = gameReducer(before, command, PROTOTYPE_DOMAIN_CONTEXT);
      expect(after.operationReceipts[command.operationId]?.status).toBe("applied");
      expect(isFirstScoredAnswer(before, after, command)).toBe(true);
      const duplicate = { ...command, operationId: "usage.duplicate" };
      expect(isFirstScoredAnswer(after, gameReducer(after, duplicate, PROTOTYPE_DOMAIN_CONTEXT), duplicate)).toBe(false);
      expect(isFirstScoredAnswer(after, after, command)).toBe(false);
    });
  }

  it("rejects stale/missing choices and provisional reviews from a rejected reducer result", () => {
    const before = scoredPatientFixture(); const e = before.encounters[TUTORIAL_ENCOUNTER_ID]!, node = e.frozenCase.decisionNodes[0]!;
    for (const invalid of [{ decisionNodeId: "stale", answerChoiceId: node.answerChoices[0]!.id }, { decisionNodeId: node.id, answerChoiceId: "missing" }]) {
      const command: GameCommand = { type: "SUBMIT_ANSWER", encounterId: e.id, operationId: "usage.reject", ...invalid };
      const after = gameReducer(before, command, PROTOTYPE_DOMAIN_CONTEXT);
      expect(isFirstScoredAnswer(before, after, command)).toBe(false);
    }
    const valid: GameCommand = { type: "SUBMIT_ANSWER", encounterId: e.id, decisionNodeId: node.id,
      answerChoiceId: node.answerChoices[0]!.id, operationId: "usage.provisional", reviewedAtMs: Date.now() };
    const provisional = gameReducer(before, valid, PROTOTYPE_DOMAIN_CONTEXT);
    provisional.operationReceipts[valid.operationId]!.status = "rejected";
    expect(isFirstScoredAnswer(before, provisional, valid)).toBe(false);
  });

  it("does not infer counts from historical reviews, opening, acknowledgements, flags, or ticks", () => {
    const before = scoredPatientFixture();
    const command: GameCommand = { type: "SET_PAUSED", paused: true, operationId: "usage.unscored" };
    const after = gameReducer(before, command, PROTOTYPE_DOMAIN_CONTEXT);
    expect(isFirstScoredAnswer(before, after, command)).toBe(false);
    const e = before.encounters[TUTORIAL_ENCOUNTER_ID]!, node = e.frozenCase.decisionNodes[0]!;
    const scored: GameCommand = { type: "SUBMIT_ANSWER", encounterId: e.id, decisionNodeId: node.id,
      answerChoiceId: node.answerChoices[0]!.id, operationId: "usage.historical", reviewedAtMs: Date.now() };
    const historical = gameReducer(before, scored, PROTOTYPE_DOMAIN_CONTEXT);
    expect(isFirstScoredAnswer(historical, structuredClone(historical), scored)).toBe(false);
  });

  it("counts each newly scored node in a chart, and a later encounter of the same concept", () => {
    let before = scoredPatientFixture(); const encounter = before.encounters[TUTORIAL_ENCOUNTER_ID]!;
    const repeatedNode = structuredClone(encounter.frozenCase.decisionNodes[0]!);
    repeatedNode.id = `${repeatedNode.id}.usage-second-node`;
    encounter.frozenCase.decisionNodes.push(repeatedNode);
    encounter.steps.push({ ...structuredClone(encounter.steps[0]!), nodeIndex: 1, decisionNodeId: repeatedNode.id, status: "locked" });
    let scored = 0;
    for (const [index, node] of encounter.frozenCase.decisionNodes.entries()) {
      // Synthetic readiness between result/feedback gates; scoring is the real reducer.
      const current = before.encounters[encounter.id]!;
      current.currentNodeIndex = index; current.lifecycle = "active_action_required"; current.patientMovement = null;
      const command: GameCommand = { type: "SUBMIT_ANSWER", encounterId: current.id, decisionNodeId: node.id,
        answerChoiceId: node.answerChoices.find((c) => c.isCorrect)!.id, operationId: `usage.node.${index}`, reviewedAtMs: Date.now() + index };
      const next = gameReducer(before, command, PROTOTYPE_DOMAIN_CONTEXT);
      expect(next.operationReceipts[command.operationId]?.status).toBe("applied");
      scored += Number(isFirstScoredAnswer(before, next, command)); before = next;
    }
    expect(scored).toBe(encounter.frozenCase.decisionNodes.length); expect(scored).toBeGreaterThan(1);
    const later = scoredPatientFixture();
    later.learningHistories = structuredClone(before.learningHistories);
    const repeated = later.encounters[TUTORIAL_ENCOUNTER_ID]!;
    delete later.encounters[repeated.id]; repeated.id = "encounter.later-usage"; later.encounters[repeated.id] = repeated;
    later.openChartEncounterId = repeated.id;
    const node = repeated.frozenCase.decisionNodes[0]!;
    const command: GameCommand = { type: "SUBMIT_ANSWER", encounterId: repeated.id, decisionNodeId: node.id,
      answerChoiceId: node.answerChoices[0]!.id, operationId: "usage.later", reviewedAtMs: Date.now() + 100 };
    const next = gameReducer(later, command, PROTOTYPE_DOMAIN_CONTEXT);
    expect(isFirstScoredAnswer(later, next, command)).toBe(true);
  });
});
