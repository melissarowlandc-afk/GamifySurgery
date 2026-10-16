import { describe, expect, it, vi } from "vitest";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { createLevelFourRoomsQaContext } from "../../../../tests/fixtures/level-four-rooms";
import { createPediatricChartsQaState, PEDIATRIC_CHARTS_QA_ENCOUNTER_ID } from "../../../../tests/fixtures/pediatric-charts";
import { createPrototypePlayerView } from "../session/viewModels";
import { FacilityScene, type FacilitySceneBridge } from "./FacilityScene";
import { patientChartIdForCharacter } from "./characterInspect";
import type { FacilityCharacterRef, FacilityViewModel } from "./types";

vi.mock("phaser", () => ({ default: { Scene: class {} } }));

const model = createPrototypePlayerView(createInitialGameState(), null, false, null).facility;
function sceneHarness(viewModel = model, mobileInput?: boolean) {
  const scene = Object.create(FacilityScene.prototype) as {
    bridge: FacilitySceneBridge;
    time: { now: number };
    inspectTarget: { kind: string; key: string; ref: FacilityCharacterRef; shownAt: number } | null;
    inspectLabelCache: unknown;
    dragStart: { dragged: boolean } | null;
    pointerDownCharacterKey: string | null;
    handleCharacterClick: (key: string) => void;
    handlePointerUp: (pointer: unknown) => void;
    endHallwayPaint: ReturnType<typeof vi.fn>;
    setInteractionHint: ReturnType<typeof vi.fn>;
    ordinaryChairAtPointer: ReturnType<typeof vi.fn>;
    walkDestinationAtPointer: ReturnType<typeof vi.fn>;
  };
  scene.bridge = { viewModel, mobileInput, onPlaceRoom: vi.fn(), onHighlightPatientChart: vi.fn(),
    onPraiseEmployee: vi.fn(), onMoveFounder: vi.fn(), onSeatFounderInChair: vi.fn() };
  scene.time = { now: 100 };
  scene.inspectTarget = null;
  scene.inspectLabelCache = {};
  scene.endHallwayPaint = vi.fn();
  scene.setInteractionHint = vi.fn();
  scene.ordinaryChairAtPointer = vi.fn();
  scene.walkDestinationAtPointer = vi.fn();
  const click = (key: string, dragged = false) => {
    scene.dragStart = { dragged };
    scene.pointerDownCharacterKey = key;
    scene.handlePointerUp({ x: 100, y: 100 });
  };
  return { scene, click };
}

describe("desktop map character chart locator", () => {
  it.each(["waiting", "existing", "open", "resolved"])("requests the exact %s patient's chart on click without founder movement", (id) => {
    const { scene, click } = sceneHarness();
    click(`character:patient:chart.${id}`);
    expect(scene.bridge.onHighlightPatientChart).toHaveBeenCalledExactlyOnceWith(`chart.${id}`);
    expect(scene.inspectTarget).toMatchObject({ key: `character:patient:chart.${id}`, ref: { kind: "patient", id: `chart.${id}` }, shownAt: 100 });
    expect(scene.inspectLabelCache).toBeNull();
    expect(scene.bridge.onMoveFounder).not.toHaveBeenCalled();
    expect(scene.bridge.onSeatFounderInChair).not.toHaveBeenCalled();
    expect(scene.ordinaryChairAtPointer).not.toHaveBeenCalled();
    expect(scene.bridge.onPraiseEmployee).not.toHaveBeenCalled();
    expect(scene.bridge.viewModel).toBe(model);
  });

  it("projects a real pediatric parent's stored link and locates the child's chart", () => {
    const state = createPediatricChartsQaState(createLevelFourRoomsQaContext());
    const child = state.encounters[PEDIATRIC_CHARTS_QA_ENCOUNTER_ID]!;
    child.checkInStatus = "checked_in";
    child.lifecycle = "active_action_required";
    child.patientMovement = null;
    const view = createPrototypePlayerView(state, null, false, null);
    const parent = view.facility.retailExternalActors!.find((actor) => actor.pediatricFamilyId)!;
    expect(parent.linkedEncounterId).toBe(PEDIATRIC_CHARTS_QA_ENCOUNTER_ID);
    expect(view.patients.some((patient) => patient.id === parent.linkedEncounterId)).toBe(true);
    const { scene, click } = sceneHarness(view.facility);
    click(`character:retail-companion:${parent.instanceId}`);
    expect(scene.bridge.onHighlightPatientChart).toHaveBeenCalledExactlyOnceWith(PEDIATRIC_CHARTS_QA_ENCOUNTER_ID);
    expect(scene.inspectTarget?.ref).toEqual({ kind: "companion", id: parent.instanceId });
    expect(scene.bridge.onMoveFounder).not.toHaveBeenCalled();
  });

  it("preserves employee inspection followed by second-click Praise", () => {
    const { scene, click } = sceneHarness();
    click("character:staff:employee.nurse");
    expect(scene.inspectTarget?.ref).toEqual({ kind: "staff", id: "employee.nurse" });
    expect(scene.bridge.onPraiseEmployee).not.toHaveBeenCalled();
    click("character:staff:employee.nurse");
    expect(scene.bridge.onPraiseEmployee).toHaveBeenCalledExactlyOnceWith("employee.nurse");
    expect(scene.inspectTarget).toBeNull();
    expect(scene.bridge.onHighlightPatientChart).not.toHaveBeenCalled();
  });

  it.each(["character:founder", "character:service-visitor:app.visit", "character:retail-retail_visitor:shopper", "character:retail-companion:companion", "character:ambient:passerby"])("keeps inspection only for %s", (key) => {
    const { scene, click } = sceneHarness();
    click(key);
    expect(scene.inspectTarget?.key).toBe(key);
    expect(scene.bridge.onHighlightPatientChart).not.toHaveBeenCalled();
    expect(scene.bridge.onMoveFounder).not.toHaveBeenCalled();
    expect(scene.bridge.onPraiseEmployee).not.toHaveBeenCalled();
  });

  it("does not alias APP-family parents or ordinary companions to charts", () => {
    const actors: NonNullable<FacilityViewModel["retailExternalActors"]> = [
      { instanceId: "app.parent", actorKind: "companion", displayName: "Parent", appearance: model.founder.appearance, pediatricFamilyId: "app.family" },
      { instanceId: "ordinary.companion", actorKind: "companion", displayName: "Companion", appearance: model.founder.appearance, linkedEncounterId: "chart.ordinary" },
    ];
    const { scene, click } = sceneHarness({ ...model, retailExternalActors: actors });
    for (const actor of actors) {
      expect(patientChartIdForCharacter({ kind: "companion", id: actor.instanceId }, scene.bridge.viewModel)).toBeNull();
      click(`character:retail-companion:${actor.instanceId}`);
    }
    expect(scene.bridge.onHighlightPatientChart).not.toHaveBeenCalled();
  });

  it("does not highlight when a drag begins on a patient", () => {
    const { scene, click } = sceneHarness();
    click("character:patient:chart.waiting", true);
    expect(scene.bridge.onHighlightPatientChart).not.toHaveBeenCalled();
    expect(scene.inspectTarget).toBeNull();
  });

  it("guards the desktop locator when the mobile flag is on", () => {
    const { scene } = sceneHarness(model, true);
    scene.handleCharacterClick("character:patient:chart.waiting");
    expect(scene.bridge.onHighlightPatientChart).not.toHaveBeenCalled();
  });
});
