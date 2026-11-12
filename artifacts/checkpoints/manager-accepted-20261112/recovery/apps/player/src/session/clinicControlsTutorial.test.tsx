import { act } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialGameState, gameReducer, getCurrentQuestion, serializeGameState, TUTORIAL_ENCOUNTER_ID,
  type GameCommand, type GameState } from "@gamify-surgery/game-domain";
import { AdvertisingPanel } from "../ui/AdvertisingPanel";
import { ResourceBar } from "../ui/ResourceBar";
import { TutorialCoach } from "../ui/TutorialCoach";
import { MobileAdvertising, MobileAdvertisingChip } from "../mobile/MobileQuickControls";
import { MobileTopBar } from "../mobile/MobileTopBar";
import { MobileTutorialCoach } from "../mobile/MobileTutorialCoach";
import { cleanupPhoneTests, noop, phoneFixture, phoneTestDom } from "../mobile/screenTestUtils";
import { createFreshProfile, loadPrototypeProfile, type LoadedPrototypeProfile } from "./prototypeStorage";
import { createTutorialStepView } from "./tutorialViewModels";
import { usePrototypeSession, type PrototypeSession } from "./usePrototypeSession";
import { createPrototypePlayerView } from "./viewModels";

afterEach(cleanupPhoneTests);

function afterFirstVisit(): GameState {
  let state = createInitialGameState();
  let sequence = 0;
  const run = (command: object) => { state = gameReducer(state, { ...command, operationId: `controls-test.${++sequence}` } as GameCommand); };
  for (let ticks = 0; state.encounters[TUTORIAL_ENCOUNTER_ID]!.checkInStatus !== "checked_in" && ticks < 300; ticks += 1) run({ type: "ADVANCE_TICK" });
  run({ type: "OPEN_CHART", encounterId: TUTORIAL_ENCOUNTER_ID });
  const question = getCurrentQuestion(state, TUTORIAL_ENCOUNTER_ID)!;
  run({ type: "SUBMIT_ANSWER", encounterId: TUTORIAL_ENCOUNTER_ID, decisionNodeId: question.node.id,
    answerChoiceId: question.node.answerChoices.find((choice) => choice.isCorrect)!.id, reviewedAtMs: 1_000 });
  run({ type: "ACKNOWLEDGE_TERMINAL_FEEDBACK", encounterId: TUTORIAL_ENCOUNTER_ID });
  run({ type: "CLOSE_CHART", encounterId: TUTORIAL_ENCOUNTER_ID });
  expect(state.encounters[TUTORIAL_ENCOUNTER_ID]!.lifecycle).toBe("resolved");
  return state;
}

describe("controls lessons in both presentations", () => {
  it("renders the ordered lessons against the desktop time group and persistent advertising controls", () => {
    const state = afterFirstVisit();
    const view = createPrototypePlayerView(state, null, false, null);
    const input = { state, tutorialsEnabled: true, introDismissed: true, acknowledgedStepIds: new Set<string>(),
      buildMode: false, selectedRoomDefinitionId: null };
    const speed = createTutorialStepView(input)!;
    const advertising = createTutorialStepView({ ...input, acknowledgedStepIds: new Set([`${state.campaignId}:${speed.id}`]) })!;
    expect([speed.id, advertising.id]).toEqual(["speed-controls-tour", "advertising-tour"]);
    const markup = renderToStaticMarkup(<><ResourceBar view={view.resourceBar} paused={state.paused} onTogglePause={noop} onSimulationSpeedChange={noop} />
      <AdvertisingPanel view={view.advertising} onDecrease={noop} onIncrease={noop} />
      <TutorialCoach step={speed} onAction={noop} /><TutorialCoach step={advertising} onAction={noop} /></>);
    expect(speed.targetSelector).toBe(".time-control-group"); expect(markup).toContain('class="time-control-group"');
    expect(advertising.targetSelector).toBe("[data-advertising-control]"); expect(markup).toContain("data-advertising-control");
    for (const value of [1, 2, 4]) expect(markup).toContain(`aria-label="Set facility speed to ${value}x"`);
    expect(markup).toContain("below the patient folders"); expect(markup).not.toContain("top middle of the Clinic map");
    expect(markup.match(/>Got it<\/button>/g)).toHaveLength(2);
  });

  it("renders the same ordered lessons with the phone map pin, speed-cycle control and cost note", () => {
    const state = afterFirstVisit();
    const view = createPrototypePlayerView(state, null, false, null);
    const input = { state, tutorialsEnabled: true, introDismissed: true, acknowledgedStepIds: new Set<string>(),
      buildMode: false, selectedRoomDefinitionId: null };
    const speed = createTutorialStepView(input)!;
    const advertising = createTutorialStepView({ ...input, acknowledgedStepIds: new Set([`${state.campaignId}:${speed.id}`]) })!;
    const markup = renderToStaticMarkup(<><MobileTopBar {...phoneFixture({ ...view })} onCash={noop} onMore={noop} />
      <MobileAdvertisingChip view={view.advertising} onOpen={noop} /><MobileAdvertising view={view.advertising} onLevelChange={noop} />
      <MobileTutorialCoach step={speed} targetTab={null} onNavigate={noop} onAction={noop} onDisableTutorials={noop} />
      <MobileTutorialCoach step={advertising} targetTab={null} onNavigate={noop} onAction={noop} onDisableTutorials={noop} /></>);
    expect([speed.id, advertising.id]).toEqual(["speed-controls-tour", "advertising-tour"]);
    for (const anchor of ["speed", "pause", "advertising-chip", "advertising"]) expect(markup).toContain(`data-phone-anchor="${anchor}"`);
    expect(markup).toContain("cycle 1×, 2×, 4×"); expect(markup).toContain("top middle of the Clinic map");
    expect(markup).toContain(advertising.note); expect(markup).not.toContain("below the patient folders");
    expect(markup.match(/>Got it<\/button>/g)).toHaveLength(2);
  });
});

describe("optional controls lesson receipts in the real shared session", () => {
  it.each([false, true])("persists each dismissal across reloads without changing game state (paused=%s)", async paused => {
    const env = phoneTestDom();
    Object.assign(env.doc, { visibilityState: "visible" });
    Object.assign(env.browser, { setInterval: vi.fn(() => 1), clearInterval: vi.fn() });
    const storage = new Map<string, string>();
    Object.assign(env.browser.localStorage, { getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value), removeItem: (key: string) => storage.delete(key) });
    const state = afterFirstVisit(); state.paused = paused;
    const loaded: LoadedPrototypeProfile = { notice: "Controls tutorial test", profile: { ...createFreshProfile(), activeCampaignId: state.campaignId,
      campaigns: [{ campaignId: state.campaignId, name: "Tutorial test", createdAtRealMs: 0, updatedAtRealMs: 0, status: "resumable", state }] } };
    let session!: PrototypeSession;
    function Host({ profile }: { profile: LoadedPrototypeProfile }) {
      session = usePrototypeSession(profile);
      return <output>{session.tutorialStep?.id ?? "none"}</output>;
    }
    await env.render(<Host key="first" profile={loaded} />);
    const before = JSON.parse(serializeGameState(session.state));
    expect(env.element.textContent).toBe("speed-controls-tour");
    await act(async () => session.performTutorialAction("acknowledge-step"));
    expect(env.element.textContent).toBe("advertising-tour");
    expect(session.profile.tutorialDailyRoutineTipAcknowledgments[state.campaignId]).toEqual(["speed-controls-tour"]);
    expect(JSON.parse(serializeGameState(session.state))).toEqual(before);
    const reloaded = loadPrototypeProfile();
    expect(reloaded.profile.tutorialDailyRoutineTipAcknowledgments[state.campaignId]).toEqual(["speed-controls-tour"]);
    await env.render(<Host key="second" profile={reloaded} />);
    expect(env.element.textContent).toBe("advertising-tour");
    await act(async () => session.performTutorialAction("acknowledge-step"));
    expect(session.profile.tutorialDailyRoutineTipAcknowledgments[state.campaignId]).toEqual(["speed-controls-tour", "advertising-tour"]);
    expect(JSON.parse(serializeGameState(session.state))).toEqual(before);
    await env.render(<Host key="third" profile={loadPrototypeProfile()} />);
    expect(env.element.textContent).not.toMatch(/speed-controls-tour|advertising-tour/);
    expect(JSON.parse(serializeGameState(session.state))).toEqual(before);
  });
});
