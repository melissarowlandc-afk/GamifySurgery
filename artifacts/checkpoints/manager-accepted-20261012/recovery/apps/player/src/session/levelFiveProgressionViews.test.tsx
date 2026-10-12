import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LEVEL_FIVE_INSPECTION_UNLOCK_EVENT_ID } from "@gamify-surgery/balance-config";
import { PROTOTYPE_DOMAIN_CONTEXT, deserializeGameState, gameReducer, serializeGameState, type GameState } from "@gamify-surgery/game-domain";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../../tests/fixtures/level-five-state";
import { createLevelFourReadyForFiveQaState } from "../../../../tests/fixtures/level-five-progression";
import { createPrototypePlayerView } from "./viewModels";
import { GoalsPanel } from "../ui/GoalsPanel";
import { EventMessageBoard } from "../ui/EventMessageBoard";
import { clinicHeadlineCandidates } from "../ui/ClinicHeadline";
import { MobileGoals, MobileGoalsChip } from "../mobile/MobileGoals";
import { MobileAlerts } from "../mobile/MobileAlerts";

const shipped = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease;
const context = createLevelFiveStateQaContext();
beforeEach(() => { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = context.balanceRelease; vi.spyOn(Date, "now").mockReturnValue(0); });
afterEach(() => { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = shipped; vi.restoreAllMocks(); });
const viewOf = (state: GameState) => createPrototypePlayerView(state, null, false, null);
const goals = (state: GameState) => {
  const view = viewOf(state).progression;
  return [renderToStaticMarkup(<GoalsPanel view={view} onLevelUp={vi.fn()} onProcedureSetupAction={vi.fn()} />),
    renderToStaticMarkup(<MobileGoals view={view} onLevelUp={vi.fn()} onSetupAction={vi.fn()} />)];
};

describe("M6 shared desktop and phone Goals projection", () => {
  it("offers ordinary Advance immediately for an acknowledged old Level 4 save in shipped cap 5", () => {
    const state = deserializeGameState(serializeGameState(createLevelFourReadyForFiveQaState(context)));
    for (const markup of goals(state)) {
      expect(markup).toContain("Advance to Level 5");
      expect(markup).not.toContain("Level 5 coming later");
    }
    expect(viewOf(state).messages.find(item => item.id === "event.facility-level-4-complete")?.message).not.toContain("coming later");
    const advanced = gameReducer(state, { type: "LEVEL_UP", operationId: "views.m6.advance" });
    expect(viewOf(advanced).resourceBar.xpProgressLabel).toBe("0/2000 XP");
    expect(viewOf(advanced).progression).toMatchObject({ canLevelUp: false, nextLevelLabel: null, prototypeComplete: false,
      inspectionUnlock: { unlocked: false } });
    for (const markup of goals(advanced)) {
      expect(markup).toContain("0/2,000 XP"); expect(markup).toContain("Inspections locked");
      expect(markup).not.toContain("Advance to Level 6");
    }
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = shipped;
    expect(goals(state)[0]).toContain("Advance to Level 5");
    expect(goals(state)[1]).toContain("Advance to Level 5");
    expect(viewOf(state).progression.canLevelUp).toBe(true);
  });

  it.each(["pre-goal", "goals-morale", "goals-satisfaction", "goals-empty"] as const)("shows the three truthful live requirements and Locked in both shells for %s", scenario => {
    const state = createLevelFiveStateQaState(scenario, context), view = viewOf(state).progression;
    expect(view.goals).toHaveLength(3);
    for (const markup of goals(state)) {
      expect(markup).toContain("Current-level Clinical XP");
      expect(markup).toContain("Satisfaction above 90%");
      expect(markup).toContain("Average staff morale at least 85");
      expect(markup).toContain("Book inspection · Locked");
      expect(markup).toContain("disabled");
      expect(markup).not.toMatch(/You finished|Congratulations|Level 4 complete/);
    }
    if (scenario === "pre-goal") expect(view.goals[0]!.progressLabel).toBe("1,999/2,000 XP");
    if (scenario === "goals-empty") expect(view.goals[2]!.progressLabel).toContain("No employees");
    if (scenario === "goals-satisfaction") expect(view.goals[1]).toMatchObject({ complete: false, progressLabel: "90% · goal above 90%" });
  });

  it("does not round a just-below-threshold mean up to a completed-looking 85", () => {
    const state = createLevelFiveStateQaState("goals-morale", context); state.employees[0]!.morale = 84.999;
    expect(viewOf(state).progression.goals[2]).toMatchObject({ complete: false, progressLabel: "84.99/85 · 1 employee" });
  });

  it("shows the durable earned date and current lowered conditions without relocking or finishing", () => {
    const state = createLevelFiveStateQaState("goals-declined", context);
    const view = viewOf(state).progression;
    expect(view.inspectionUnlock).toMatchObject({ unlocked: true, statusLabel: "Inspections unlocked", earnedLabel: expect.stringContaining("Earned Day") });
    expect(view.goals[1]!.complete).toBe(false); expect(view.goals[2]!.complete).toBe(false);
    for (const markup of goals(state)) {
      expect(markup).toContain("Level 5 goals complete. Inspections are now available.");
      expect(markup).toContain("Earned Day");
      expect(markup).toContain("Book inspection");
      expect(markup).toContain("disabled");
      expect(markup).not.toMatch(/You finished|Congratulations|Level 6|Level 4 complete/);
    }
    const chip = renderToStaticMarkup(<MobileGoalsChip view={view} onLevelUp={vi.fn()} onShowGoals={vi.fn()} />);
    expect(chip).toContain("Inspections unlocked"); expect(chip).toContain("--mobile-progress:100%");
    expect(state.levelFive!.progress.gameFinished).toBeNull();
  });

  it("keeps one Alerts milestone plus one next-step tip through reload, out of Needs you, headline and footer", () => {
    let state = createLevelFiveStateQaState("goals-unlocked", context);
    for (let i = 0; i < 3; i++) {
      const view = viewOf(state), rows = view.messages.filter(item => item.id.startsWith(LEVEL_FIVE_INSPECTION_UNLOCK_EVENT_ID));
      expect(rows).toHaveLength(2);
      expect(rows.find(row => row.id === LEVEL_FIVE_INSPECTION_UNLOCK_EVENT_ID)).toMatchObject({
        title: "Inspections unlocked", rowKind: "milestone", priority: "informational", showAttentionMarker: false,
      });
      expect(rows.find(row => row.rowKind === "tip")).toMatchObject({ action: { kind: "show_goals" }, actionLabel: "Show Goals" });
      expect(view.needsYou).toHaveLength(0);
      expect(clinicHeadlineCandidates(rows, [])).toEqual([]);
      const desktop = renderToStaticMarkup(<EventMessageBoard items={rows} needsYou={view.needsYou} />);
      const phone = renderToStaticMarkup(<MobileAlerts items={rows} needs={view.needsYou ?? []} failures={{}} onNeedAction={vi.fn()} onFeedAction={vi.fn()} />);
      for (const markup of [desktop, phone]) {
        expect(markup).toContain('data-row-kind="milestone"'); expect(markup).toContain('data-row-kind="tip"');
        expect(markup).toContain("Inspections unlocked"); expect(markup).toContain("Book your first inspection from Goals");
        expect(markup).not.toContain("Attention required");
      }
      state = deserializeGameState(serializeGameState(state));
      state = gameReducer(state, { type: "SET_PAUSED", paused: true, operationId: `view.m6.reload.${i}` });
      expect(state.events.filter(event => event.id === LEVEL_FIVE_INSPECTION_UNLOCK_EVENT_ID)).toHaveLength(1);
    }
  });

  it("does not treat the live threshold as earned before a domain acknowledgment", () => {
    const state = createLevelFiveStateQaState("goals-ready", context);
    expect(viewOf(state).progression.goals.every(goal => goal.complete)).toBe(true);
    expect(viewOf(state).progression.inspectionUnlock?.unlocked).toBe(false);
    expect(viewOf(gameReducer(state, { type: "SET_PAUSED", paused: true, operationId: "view.m6.earn" })).progression.inspectionUnlock?.unlocked).toBe(true);
    expect(state.levelFive!.inspection.status).toBe("locked");
  });
});
