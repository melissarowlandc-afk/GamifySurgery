import { expect, it, vi } from "vitest";
import { deserializeGameState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "../../session/viewModels";
import { headlessFacilityScene } from "../../facility/retainedCameraTestSupport";
import checkpoints from "../../../../../tests/fixtures/level-five-integration-checkpoints-20261012.json";

vi.mock("phaser", () => ({ default: { Scene: class {}, BlendModes: { MULTIPLY: 2, SCREEN: 3 },
  Display: { Color: { HexStringToColor: (value: string) => ({ color: parseInt(value.replace("#", ""), 16) }) } } } }));

it.each(["integration-l4", "integration-build"] as const)("%s requests only the exact phone actor poses, leaving desktop prefetch intact", key => {
  const state = deserializeGameState(JSON.stringify(checkpoints[key])); state.paused = true;
  const model = createPrototypePlayerView(state, null, false, null).facility;
  for (const phone of [true, false]) {
    const f = headlessFacilityScene(model, phone);
    f.scene.ensureLevelFiveAtlases = () => {};
    const request = vi.spyOn(f.scene, "ensureCharacterStills").mockImplementation(() => {});
    f.scene.update(0, 33.333);
    expect(request.mock.calls.length).toBeGreaterThan(0);
    const sizes = request.mock.calls.map(args => (args[0] as unknown[]).length);
    if (phone) expect(Math.max(...sizes)).toBe(1);
    else expect(Math.max(...sizes)).toBeGreaterThan(1);
  }
});
