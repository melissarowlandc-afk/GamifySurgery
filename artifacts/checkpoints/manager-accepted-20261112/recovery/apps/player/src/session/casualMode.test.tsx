import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { gameReducer, type GameCommand } from "@gamify-surgery/game-domain";
import { ChartPanel } from "../ui/ChartPanel";
import { EmployeeDiscussionPanel } from "../ui/EmployeeDiscussionPanel";
import { MobileChart, MobileTeamDiscussion } from "../mobile/MobileChart";
import { allElements, cleanupPhoneTests, phoneTestDom } from "../mobile/screenTestUtils";
import { scoredEmployeeFixture, scoredPatientFixture } from "../playtime/usageTestFixtures";
import { isFirstScoredAnswer } from "../playtime/scoredQuestionUsage";
import { createPrototypePlayerView } from "./viewModels";

afterEach(cleanupPhoneTests);

function fixture(employee: boolean) {
  const state = employee ? scoredEmployeeFixture() : scoredPatientFixture();
  const subject = employee ? Object.values(state.employeeDiscussions!)[0]! : Object.values(state.encounters)[0]!;
  subject.frozenCase.presentation = "Synthetic scenario retained for reading.";
  const node = subject.frozenCase.decisionNodes[0]!;
  node.stem = "Which fixture option should be selected next?";
  node.explanation = "Synthetic explanation retained after answering.";
  node.teachingPoint = "Synthetic lesson retained after answering.";
  node.exhibit = { kind: "keyValue", caption: "Synthetic exhibit", items: [{ label: "Fixture field", value: "Fixture finding" }] };
  node.answerChoices.forEach((choice, index) => {
    choice.label = choice.isCorrect ? "Correct fixture option" : `Distractor fixture ${index}`;
    choice.rationale = choice.isCorrect ? "Synthetic correct rationale." : "Synthetic other rationale.";
  });
  // Deliberately place the key last to catch index-based submissions/shortcuts.
  node.answerChoices.sort((a, b) => Number(a.isCorrect) - Number(b.isCorrect));
  return { state, subject, node };
}

for (const shell of ["desktop", "phone"] as const) for (const employee of [false, true]) {
  describe(`${shell} casual ${employee ? "employee discussions" : "patient charts"}`, () => {
    it("shows only the correct choice and uses normal scoring, usage detection and teaching flow", async () => {
      const f = fixture(employee), before = f.state, frozen = JSON.stringify(f.subject.frozenCase);
      let state = before;
      const key = f.node.answerChoices.find(choice => choice.isCorrect)!;
      const env = phoneTestDom();
      // The desktop sheet portals to body; the phone chart stays in its shell.
      const root = shell === "desktop" ? env.doc.body : env.element;
      const submit = vi.fn((answerChoiceId: string) => {
        const command: GameCommand = employee
          ? { type: "SUBMIT_EMPLOYEE_DISCUSSION_ANSWER", discussionId: f.subject.id, decisionNodeId: f.node.id, answerChoiceId, operationId: "casual.submit", reviewedAtMs: Date.now() }
          : { type: "SUBMIT_ANSWER", encounterId: f.subject.id, decisionNodeId: f.node.id, answerChoiceId, operationId: "casual.submit", reviewedAtMs: Date.now() };
        state = gameReducer(state, command);
        expect(state.operationReceipts[command.operationId]?.status).toBe("applied");
        expect(isFirstScoredAnswer(before, state, command)).toBe(true);
        expect(isFirstScoredAnswer(state, state, command)).toBe(false);
      });
      const render = async (mode: boolean | null) => {
        const view = createPrototypePlayerView(state, state.openChartEncounterId, false, null, false, null, 0, undefined, [], mode);
        if (employee) {
          const props = { discussion: view.employeeDiscussion!, onAnswer: submit, onClose: vi.fn(), onAcknowledge: vi.fn(), onFile: vi.fn() };
          await env.render(shell === "phone" ? <MobileTeamDiscussion {...props} /> : <EmployeeDiscussionPanel {...props} />);
        } else {
          const props = { chart: view.chart!, onSubmitAnswer: submit, onClose: vi.fn(), onFlagQuestion: vi.fn(), onAcknowledgeTerminalFeedback: vi.fn(), onToggleSummary: vi.fn(), onFileChart: vi.fn() };
          await env.render(shell === "phone" ? <MobileChart {...props} /> : <ChartPanel {...props} />);
        }
      };
      await render(true);
      const choices = allElements(root, node => node.tagName === "BUTTON" && (node.attributes.class === "cs-answer" || node.attributes["data-choice-id"] !== undefined));
      expect(choices).toHaveLength(1);
      expect(choices[0]!.textContent).toContain(key.label);
      expect(root.textContent).not.toContain("Distractor fixture");
      for (const text of ["Synthetic scenario retained", "Which fixture option", "Synthetic exhibit", "Fixture finding"]) expect(root.textContent).toContain(text);
      expect(root.textContent).not.toContain(f.node.explanation);
      expect(allElements(root, node => ["BUTTON", "INPUT", "SELECT"].includes(node.tagName) && /casual/i.test(node.textContent + (node.attributes["aria-label"] ?? "")))).toHaveLength(0);
      expect(JSON.stringify(f.subject.frozenCase)).toBe(frozen);
      if (shell === "desktop") {
        // Hidden indices must not let the keyboard submit a distractor.
        await act(async () => {
          const event = new Event("keydown", { cancelable: true }); Object.defineProperty(event, "key", { value: "2" }); env.doc.dispatchEvent(event);
        });
        expect(submit).not.toHaveBeenCalled();
      }
      await env.clickElement(choices[0]!);
      expect(submit).toHaveBeenCalledExactlyOnceWith(key.id);
      const answeredSubject = employee ? state.employeeDiscussions![f.subject.id]! : state.encounters[f.subject.id]!;
      expect(answeredSubject.answers[0]).toMatchObject({ answerChoiceId: key.id, correct: true });
      expect(JSON.stringify(answeredSubject.frozenCase)).toBe(frozen);
      expect(state).not.toHaveProperty("casual");
      await render(true);
      const feedbackView = createPrototypePlayerView(state, state.openChartEncounterId, false, null, false, null, 0, undefined, [], true);
      expect(employee ? feedbackView.employeeDiscussion!.feedback : feedbackView.chart!.decisionSteps![0]!.feedbackBody).toContain(f.node.explanation);
      // Desktop's existing card gives the authored lesson precedence over the
      // explanation; phone displays both. Casual mode keeps that same flow.
      for (const text of ["Correct", f.node.teachingPoint!, key.rationale!]) expect(root.textContent).toContain(text);
      if (shell === "phone") expect(root.textContent).toContain(f.node.explanation);
      expect(root.textContent).not.toContain("Distractor fixture");
    });

    it("preserves every standard choice and hides choices while server access is pending", async () => {
      const f = fixture(employee), env = phoneTestDom();
      const root = shell === "desktop" ? env.doc.body : env.element;
      for (const mode of [false, null] as const) {
        const view = createPrototypePlayerView(f.state, f.state.openChartEncounterId, false, null, false, null, 0, undefined, [], mode);
        if (employee) {
          const props = { discussion: view.employeeDiscussion!, onAnswer: vi.fn(), onClose: vi.fn(), onAcknowledge: vi.fn(), onFile: vi.fn() };
          await env.render(shell === "phone" ? <MobileTeamDiscussion {...props} /> : <EmployeeDiscussionPanel {...props} />);
          expect(view.employeeDiscussion!.choices!.map(c => c.id)).toEqual(mode === false ? f.node.answerChoices.map(c => c.id) : []);
        } else {
          const props = { chart: view.chart!, onSubmitAnswer: vi.fn(), onClose: vi.fn(), onFlagQuestion: vi.fn(), onAcknowledgeTerminalFeedback: vi.fn(), onToggleSummary: vi.fn(), onFileChart: vi.fn() };
          await env.render(shell === "phone" ? <MobileChart {...props} /> : <ChartPanel {...props} />);
          expect(view.chart!.answerChoices.map(c => c.id)).toEqual(mode === false ? f.node.answerChoices.map(c => c.id) : []);
        }
        const choices = allElements(root, node => node.tagName === "BUTTON" && (node.attributes.class === "cs-answer" || node.attributes["data-choice-id"] !== undefined));
        expect(choices).toHaveLength(mode === false ? f.node.answerChoices.length : 0);
        if (mode === null) expect(root.textContent).toContain("Checking your account mode...");
        else expect(root.textContent).toContain("Distractor fixture");
      }
    });
  });
}
