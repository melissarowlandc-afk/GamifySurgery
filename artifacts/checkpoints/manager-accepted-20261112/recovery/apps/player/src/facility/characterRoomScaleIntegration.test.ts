import { describe, expect, it, vi } from "vitest";
vi.mock("phaser", () => ({ default: { Scene: class { constructor(_config?: unknown) {} } } }));
import { FacilityScene } from "./FacilityScene";
import { characterRoomQaCases, characterRoomQaModel, qaCharacterAppearance } from "../art/characterRoomQaModel";
import { characterStillScaleForAppearance } from "../art/characterBitmapArt";
import { RESTING_CHARACTER_MOTION } from "./characterHopMotion";

describe("live occupied character draw scale integration", () => {
  it("passes the seated correction through the actual scene draw and freezes it without double scaling", () => {
    const model = characterRoomQaModel(characterRoomQaCases().find(c => c.room === "room.phlebotomy")!);
    const scene = new FacilityScene({ viewModel: model, onPlaceRoom: () => false }) as any;
    scene.layout = { originX: 0, originY: 0, tileSize: 52 };
    scene.characterPresentationFrozen = () => false;
    scene.characterStepMotion = () => RESTING_CHARACTER_MOTION;
    scene.drawPixelPerson = vi.fn((_g, _x, y) => ({ baseY: y, representation: "bitmap" }));
    const appearance = qaCharacterAppearance("gs022-new-employee-015");
    const candidate = { centerX: 100, baseY: 200, appearance, direction: "front", pose: "seated", rightFacing: false, displayScale: 1, alignSeatContact: true };
    scene.drawCharacterPresentation({}, "qa", candidate, 0);
    const scale = scene.drawPixelPerson.mock.calls[0][9];
    expect(scale).toBe(characterStillScaleForAppearance(appearance, "seated"));
    expect(scale).not.toBe(characterStillScaleForAppearance(appearance, "idle"));
    scene.characterPresentationFrozen = () => true;
    scene.drawCharacterPresentation({}, "qa", candidate, 0);
    expect(scene.drawPixelPerson.mock.calls[1][9]).toBe(scale);
    scene.characterMotionSnapshots.clear(); scene.characterRoomQaBefore = true;
    scene.drawCharacterPresentation({}, "before", candidate, 0);
    expect(scene.drawPixelPerson.mock.calls[2][9]).toBe(characterStillScaleForAppearance(appearance, "idle"));
  });
});
