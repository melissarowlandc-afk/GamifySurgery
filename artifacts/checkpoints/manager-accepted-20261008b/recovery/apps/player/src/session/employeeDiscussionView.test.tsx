import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { createInitialGameState, PROTOTYPE_DOMAIN_CONTEXT, type EmployeeDiscussionState } from "@gamify-surgery/game-domain";
import { employeeDiscussionView } from "./viewModels";
import { PatientLists } from "../ui/PatientLists";

describe("employee discussion presentation", () => {
  it("projects frozen employee identity and each saved lifecycle without patient chart fields", () => {
    const state = createInitialGameState();
    const frozenCase = structuredClone(PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases[0]!);
    frozenCase.presentation = "Ari reviews the reminder project.";
    const discussion: EmployeeDiscussionState = {
      id: "discussion.test", employeeId: "employee.test", employeeDisplayName: "Ari",
      employeeAppearance: state.founder.appearance, clinicalReleaseId: "test", frozenCase,
      lifecycle: "active_traveling", createdAtFacilityTick: 0, firstOpenedAtTick: 0,
      resolvedAtFacilityTick: null, cancellationReason: null, currentNodeIndex: 0, answers: [], steps: [],
    };
    state.employeeDiscussions = { [discussion.id]: discussion };
    state.openEmployeeDiscussionId = discussion.id;
    expect(employeeDiscussionView(state)).toMatchObject({employeeName: "Ari", status: "traveling", presentation: frozenCase.presentation, finalStep: frozenCase.decisionNodes.length === 1});
    expect(employeeDiscussionView(state)?.choices?.every((choice) => !choice.disabled && choice.revealedCorrect === undefined)).toBe(true);
    discussion.lifecycle = "active_action_required";
    const question = employeeDiscussionView(state)!;
    expect(question.status).toBe("question");
    expect(question.choices?.map((choice) => choice.id)).toEqual(frozenCase.decisionNodes[0]!.answerChoices.map((choice) => choice.id));
    expect(question).not.toHaveProperty("vitals");
    expect(question).not.toHaveProperty("patientSatisfactionLabel");
    const node = frozenCase.decisionNodes[0]!;
    const wrong = node.answerChoices.find((choice) => !choice.isCorrect)!;
    discussion.answers = [{decisionNodeId: node.id, primaryConceptId: node.primaryConceptId, answerChoiceId: wrong.id, correct: false, ratingIntent: "Again", answeredAtFacilityTick: 1, explanation: node.explanation, correctedForward: false}];
    discussion.lifecycle = "feedback_pending";
    const feedback = employeeDiscussionView(state)!;
    expect(feedback).toMatchObject({status: "feedback", feedbackTitle: "Incorrect", feedback: node.explanation, correctAnswerText: node.answerChoices.find((choice) => choice.isCorrect)!.label});
    expect(feedback.choices?.find((choice) => choice.id === wrong.id)).toMatchObject({selected: true, disabled: true, revealedCorrect: false});
    expect(feedback.choices?.find((choice) => choice.revealedCorrect)?.label).toBe(feedback.correctAnswerText);
    discussion.lifecycle = "resolved_summary_available";
    expect(employeeDiscussionView(state)).toMatchObject({status: "summary", feedback: node.explanation});
    expect(employeeDiscussionView(state)).not.toHaveProperty("summary");
    state.openEmployeeDiscussionId = null;
    expect(employeeDiscussionView(state)).toBeNull();
  });
  it("puts colleague attention in the existing folders without a satisfaction icon", () => {
    const html = renderToStaticMarkup(<PatientLists patients={[]} onOpen={() => {}} discussions={[{
      subjectKind: "employee-discussion", id: "discussion.test", employeeId: "employee.test",
      folder: "active", name: "Ari", roleLabel: "GLP-1 Nurse Practitioner", statusLabel: "Discussion action required", actionRequired: true, selected: true,
    }]} onOpenDiscussion={() => {}} />);
    expect(html).toContain("patient-folder is-active");
    expect(html).toContain("employee-discussion-tab is-selected");
    expect(html).toContain('aria-label="Action required"');
    expect(html).toContain("Team discussion");
    expect(html).not.toContain("Satisfaction");
  });
});
