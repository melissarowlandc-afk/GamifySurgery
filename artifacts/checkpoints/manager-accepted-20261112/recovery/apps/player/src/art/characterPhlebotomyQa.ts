import Phaser from "phaser";
import { FacilityScene, type FacilitySceneBridge } from "../facility/FacilityScene";
import type { ApprovedActorSupport } from "../facility/approvedRoomPresentation";
import type { FacilityActorSupportRole, FacilityRoomView } from "../facility/types";
import { applyRoomTouchupsToRecords } from "../facility/roomTouchups";
import { assertCanvasRoomLighting } from "../facility/canvasRoomLighting";
import { DESKTOP_FACILITY_ASSETS } from "../mobile/performance/roomAssets";
import { getPhaserTextureKey, preloadBitmapAssets } from "./bitmapAssetAdapters";
import { getCharacterStillEntry, type CharacterStillDirection, type CharacterStillPosture } from "./characterStillRegistry";
import { characterBitmapLayers, characterBitmapRegistration } from "./characterBitmapArt";
import measuredFrames from "./characterPhlebotomyQa.frames.json";
import {
  PHLEBOTOMY_QA_STATES, PHLEBOTOMY_QA_VIEWPORT, PHLEBOTOMY_QA_ZOOMS, phlebotomyQaAppearance, phlebotomyQaModel, phlebotomyQaProof,
  type PhlebotomyQaState, type PhlebotomyQaVersion,
} from "./characterPhlebotomyQaModel";

if (!import.meta.env.DEV || location.hostname !== "127.0.0.1") throw new Error("Phlebotomy QA requires the loopback development server");
const bridge: FacilitySceneBridge = { viewModel: phlebotomyQaModel(0, "after", "active"), onPlaceRoom: () => false };
const characterAssets = measuredFrames.map(([id, posture, facing]) => {
  const asset = getCharacterStillEntry(id!)!.poses[posture as CharacterStillPosture][facing as CharacterStillDirection];
  return { id: `character-still:${id}:${asset.sha256.slice(0, 12)}`, relativePath: asset.url, nativeWidth: 160, nativeHeight: 320,
    anchor: { x: asset.anchors.bodyAxisX, y: asset.anchors.floorY }, kind: "character" as const, orientation: "all" as const };
});
const fixtureIds = new Set(["gs015:phlebotomy:south", "gs015:phlebotomy:east", "gs015:phlebotomy:window", "room-touchup:sample-cart", "room-touchup:biohazard-bin"]);
const fixtureAssets = DESKTOP_FACILITY_ASSETS.filter(asset => fixtureIds.has(asset.id));
if (fixtureAssets.length !== fixtureIds.size) throw new Error("Missing phlebotomy QA fixture descriptors");
const assets = [...new Map([...fixtureAssets, ...characterAssets].map(a => [a.id, a])).values()];
const state = {
  protocolVersion: 3, filterModes: { nearest: Phaser.Textures.FilterMode.NEAREST, linear: Phaser.Textures.FilterMode.LINEAR },
  ready: false, error: null as string | null, origin: location.origin, orientations: [0, 270] as const,
  states: PHLEBOTOMY_QA_STATES, zooms: PHLEBOTOMY_QA_ZOOMS, cameraViewport: PHLEBOTOMY_QA_VIEWPORT, sourceAssets: assets.map(a => a.relativePath!),
  capture: async (_orientation: 0 | 270, _zoom: number, _version: PhlebotomyQaVersion, _seatedCorrections: boolean, _actorState: PhlebotomyQaState): Promise<ReturnType<CharacterPhlebotomyQaScene["readCapture"]> & { dataUrl: string }> => { throw new Error("Scene not ready"); },
};
declare global { interface Window { __characterPhlebotomyQa: typeof state } }
window.__characterPhlebotomyQa = state;
const fail = (message: string) => { state.error = message; document.getElementById("error")!.textContent = message; };
window.addEventListener("error", e => fail(e.message));
window.addEventListener("unhandledrejection", e => fail(String(e.reason)));

class CharacterPhlebotomyQaScene extends FacilityScene {
  private version: PhlebotomyQaVersion = "after";
  protected override ensureEnvironmentAtlas(): void {
    // This isolated page needs only its explicitly preloaded room sources.
    // The normal async world bootstrap can redraw the landscape over a capture.
  }
  public preload(): void {
    this.load.on(Phaser.Loader.Events.FILE_LOAD_ERROR, (file: Phaser.Loader.File) => fail(`Source asset failed: ${file.key}`));
    preloadBitmapAssets(this.load, assets);
  }
  protected override getTouchupDrawRecords(room: FacilityRoomView) {
    if (this.version !== "before" || room.definitionId !== "room.phlebotomy") return super.getTouchupDrawRecords(room);
    return applyRoomTouchupsToRecords(room.definitionId, room.orientation === 270 ? 270 : 0, 3,
      phlebotomyQaProof(room.orientation === 270 ? 270 : 0).records);
  }
  protected override getRoomActorSupports(room: FacilityRoomView, role: FacilityActorSupportRole): readonly ApprovedActorSupport[] {
    if (this.version !== "before" || room.definitionId !== "room.phlebotomy") return super.getRoomActorSupports(room, role);
    const supports = phlebotomyQaProof(room.orientation === 270 ? 270 : 0).supports;
    return role === "staff-idle" ? supports.filter(s => s.role === "phlebotomy-clinician").map(s => ({ ...s, id: "phlebotomy:stool", role })) : supports;
  }
  public readCapture(zoom: number, version: PhlebotomyQaVersion, seatedCorrections: boolean, actorState: PhlebotomyQaState) {
    // Use the exact production zoom transform, independent of the QA canvas
    // resizing needed to keep the room and reference in the captured PNG.
    bridge.viewModel.camera = { zoom, panX: 0, panY: 0 };
    const tileSize = this.calculateLayout(PHLEBOTOMY_QA_VIEWPORT.width, PHLEBOTOMY_QA_VIEWPORT.height).tileSize;
    const rendered = this.renderOccupiedCharacterQa(tileSize, !seatedCorrections);
    const snapshots = this.debugCharacterGaitSnapshot();
    const figures = rendered.figures.map(figure => {
      const actor = snapshots[figure.key]!;
      const layers = [false, true].map(right => characterBitmapLayers(phlebotomyQaAppearance(figure.stillId), actor.direction!, actor.pose!, right)!)
        .find(layers => layers.actor.asset.url === figure.source)!;
      const registration = characterBitmapRegistration(layers);
      return { ...figure, frameWidth: actor.displayWidth!, textureUsesLinearFiltering: actor.textureUsesLinearFiltering,
        centerX: actor.groundX, depth: actor.depth,
        left: actor.groundX + (registration.visibleBounds.x / 160 - registration.floorAnchorX) * actor.displayWidth!,
        right: actor.groundX + ((registration.visibleBounds.x + registration.visibleBounds.width) / 160 - registration.floorAnchorX) * actor.displayWidth!,
      };
    });
    const { before: seatedScaleBaseline, ...geometry } = rendered;
    return { ...geometry, protocolVersion: 3, figures, fixtures: this.debugApprovedFixtureSnapshot(), chairLayers: this.debugApprovedSideChairLayerSnapshot(), zoom, version, seatedCorrections, seatedScaleBaseline, actorState };
  }
  public override create(): void {
    const missing = assets.filter(a => !this.textures.exists(getPhaserTextureKey(a)));
    if (missing.length || state.error) { fail(state.error ?? `Missing assets: ${missing.map(a => a.id).join(", ")}`); return; }
    super.create(); assertCanvasRoomLighting(this.game.renderer);
    let busy = false;
    state.capture = async (orientation, zoom, version, seatedCorrections, actorState) => {
      if (busy) throw new Error("Captures must be sequential");
      if (![0, 270].includes(orientation) || !Number.isFinite(zoom) || zoom < .1 || zoom > 2.5 ||
          !["before", "after"].includes(version) || !PHLEBOTOMY_QA_STATES.includes(actorState)) throw new Error("Invalid phlebotomy QA case");
      busy = true;
      try {
        this.version = version;
        bridge.viewModel = phlebotomyQaModel(orientation, version, actorState);
        const result = this.readCapture(zoom, version, seatedCorrections, actorState);
        await new Promise<void>((resolve, reject) => {
          const timer = window.setTimeout(() => reject(new Error("No Phaser POST_RENDER within 10s")), 10_000);
          this.game.events.once(Phaser.Core.Events.POST_RENDER, () => { window.clearTimeout(timer); resolve(); });
        });
        document.getElementById("status")!.textContent = `${orientation}° · ${version} · ${actorState} · camera ${zoom} / tile ${result.stage.tileSize}px · seated corrections ${seatedCorrections ? "on" : "off"} · ${location.origin}`;
        document.getElementById("measurements")!.textContent = JSON.stringify(result, null, 2);
        return { ...result, dataUrl: this.game.canvas.toDataURL("image/png") };
      } finally { busy = false; }
    };
    const controls = document.getElementById("controls")!;
    const select = (title: string, values: readonly (number | string)[], initial: string) => {
      const label = document.createElement("label"), control = document.createElement("select"); label.textContent = title;
      for (const value of values) { const option = document.createElement("option"); option.value = option.textContent = String(value); control.append(option); }
      control.value = initial; label.append(control); controls.append(label); return control;
    };
    const orientation = select("Orientation", [0, 270], "0"), zoom = select("Camera zoom", PHLEBOTOMY_QA_ZOOMS, "1");
    const version = select("Layout", ["before", "after"], "after"), actorState = select("Actors", PHLEBOTOMY_QA_STATES, "active");
    const corrected = select("Pending seated factors", ["off", "on"], "off");
    const redraw = () => state.capture(Number(orientation.value) as 0 | 270, Number(zoom.value), version.value as PhlebotomyQaVersion, corrected.value === "on", actorState.value as PhlebotomyQaState).catch(e => fail(String(e)));
    for (const control of [orientation, zoom, version, actorState, corrected]) control.onchange = () => { void redraw(); };
    // SceneManager marks a scene RUNNING after create() returns. Pause/render
    // only after that transition; otherwise update() can overwrite the first
    // room PNG after each resize with a normal full-world redraw.
    this.events.once(Phaser.Scenes.Events.CREATE, () => {
      void redraw().then(() => { state.ready = true; });
    });
  }
}
new Phaser.Game({ type: Phaser.CANVAS, parent: "scene", ...PHLEBOTOMY_QA_VIEWPORT, transparent: false, pixelArt: true, antialias: false,
  roundPixels: true, audio: { noAudio: true }, banner: false, scene: [new CharacterPhlebotomyQaScene(bridge)] });
