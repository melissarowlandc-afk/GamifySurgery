import { describe, expect, it } from "vitest";
import { getCurrentEmployeeDiscussionQuestion, PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { routineOrFixture } from "../../../../packages/game-domain/tests/routine-or-demand.fixture";
import { qaAttendanceCommand as command, qaAttendanceTick as tick, qaAttendanceUntil as until } from "../../../../packages/game-domain/tests/founder-qa-attendance.fixture";
import { createPrototypePlayerView } from "./viewModels";

describe("staff-question physical attendance", () => {
  it("stands beside the actual discussing staff member through feedback until close", () => {
    let state = routineOrFixture().state;
    // This mechanical fixture suppresses discussion demand; restore its first ordinary deadline.
    state.nextEmployeeDiscussionTick = 30;
    const waiting = (s: typeof state) => Object.values(s.employeeDiscussions ?? {}).find(d => d.lifecycle === "waiting_unopened");
    state = until(state, s => Boolean(waiting(s)), 600);
    const id = waiting(state)!.id;
    state = command(state, { type: "OPEN_EMPLOYEE_DISCUSSION", discussionId: id });
    state = until(state, s => s.environment.founderActivity?.kind === "attend_employee_discussion" &&
      s.environment.founderActivity.pathIndex === s.environment.founderActivity.path.length - 1, 600);
    const employee = state.employees.find(e => e.id === state.employeeDiscussions![id]!.employeeId)!;
    const location = { ...state.environment.founderLocation };
    expect(Math.abs(location.x - employee.location.x) + Math.abs(location.y - employee.location.y)).toBe(1);
    expect(createPrototypePlayerView(state, null, false, null).facility.founder).toMatchObject({ location, seated: false, moving: false });
    const question = getCurrentEmployeeDiscussionQuestion(state, id, PROTOTYPE_DOMAIN_CONTEXT)!;
    state = command(state, { type: "SUBMIT_EMPLOYEE_DISCUSSION_ANSWER", discussionId: id, decisionNodeId: question.node.id,
      answerChoiceId: question.node.answerChoices.find(c => c.isCorrect)!.id, reviewedAtMs: state.createdAtRealMs + state.facilityTick * 60_000 });
    state = tick(state, 90);
    expect(state.environment.founderLocation).toEqual(location);
    expect(state.environment.founderActivity).toMatchObject({ kind: "attend_employee_discussion", targetId: id });
    state = command(state, { type: "CLOSE_EMPLOYEE_DISCUSSION", discussionId: id });
    expect(state.environment.founderActivity?.kind).not.toBe("attend_employee_discussion");
  });
});
