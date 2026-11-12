import Phaser from "phaser";
import { FacilityScene, type FacilitySceneBridge } from "../facility/FacilityScene";
import { assertCanvasRoomLighting } from "../facility/canvasRoomLighting";
import { DESKTOP_FACILITY_ASSETS } from "../mobile/performance/roomAssets";
import { APPROVED_LEVEL5_BITMAP_ASSETS } from "./bitmapAssetManifest";
import { getPhaserTextureKey, preloadBitmapAssets } from "./bitmapAssetAdapters";
import { getCharacterStillEntry } from "./characterStillRegistry";
import { characterRoomQaCases, characterRoomQaModel } from "./characterRoomQaModel";
import { getSeatedCharacterProportion } from "./characterRoomProportions";

if (!import.meta.env.DEV || location.hostname !== "127.0.0.1") throw new Error("Occupied-room QA requires the loopback development server");
const cases = characterRoomQaCases();
const query = new URLSearchParams(location.search);
const bridge: FacilitySceneBridge = { viewModel: characterRoomQaModel(cases[0]!), onPlaceRoom: () => false };
const characterIds = new Set(cases.flatMap(job => { const m = characterRoomQaModel(job); return [m.founder.appearance.stillId!, ...(m.patients ?? []).map(p => p.appearance.stillId!), ...m.staff.map(s => s.appearance!.stillId!)]; }));
const characterAssets = [...characterIds].flatMap(id => { const entry = getCharacterStillEntry(id)!; return Object.values(entry.poses).flatMap(poses => Object.values(poses)).map(asset => ({ id: `character-still:${id}:${asset.sha256.slice(0, 12)}`, relativePath: asset.url, nativeWidth: 160, nativeHeight: 320, anchor: { x: asset.anchors.bodyAxisX, y: asset.anchors.floorY }, kind: "character" as const, orientation: "all" as const })); });
const assets = [...new Map([...DESKTOP_FACILITY_ASSETS, ...APPROVED_LEVEL5_BITMAP_ASSETS, ...characterAssets].map(a => [a.id, a])).values()];
const state = { ready: false, error: null as string | null, cases, origin: location.origin, sourceAssets: assets.map(a => a.relativePath!),
  capture: async (_id: string, _zoom: number, _before: boolean): Promise<ReturnType<FacilityScene["renderOccupiedCharacterQa"]> & { dataUrl: string }> => { throw new Error("Scene not ready"); } };
declare global { interface Window { __characterRoomsQa: typeof state } }
window.__characterRoomsQa = state;
const fail = (message: string) => { state.error = message; document.getElementById("error")!.textContent = message; };
window.addEventListener("error", e => fail(e.message)); window.addEventListener("unhandledrejection", e => fail(String(e.reason)));

class CharacterRoomsQaScene extends FacilityScene {
  public preload(): void { this.load.on(Phaser.Loader.Events.FILE_LOAD_ERROR, (file: Phaser.Loader.File) => fail(`Source asset failed: ${file.key}`)); preloadBitmapAssets(this.load, assets); }
  public override create(): void {
    const missing = assets.filter(a => !this.textures.exists(getPhaserTextureKey(a)));
    if (missing.length || state.error) { fail(state.error ?? `Missing assets: ${missing.map(a => a.id).join(", ")}`); return; }
    super.create(); assertCanvasRoomLighting(this.game.renderer); this.sys.pause();
    let busy = false;
    state.capture = async (id, zoom, before) => {
      if (busy) throw new Error("Room captures must be sequential");
      const job = cases.find(c => c.id === id); if (!job || !Number.isFinite(zoom) || zoom < .1 || zoom > 2.5) throw new Error("Unknown room case or zoom");
      busy = true;
      try {
        bridge.viewModel = characterRoomQaModel(job);
        const result = this.renderOccupiedCharacterQa(Math.max(5, Math.round(52 * zoom)), before);
        await new Promise<void>((resolve, reject) => { const timer = window.setTimeout(() => reject(new Error("No Phaser POST_RENDER within 10s")), 10_000); this.game.events.once(Phaser.Core.Events.POST_RENDER, () => { window.clearTimeout(timer); resolve(); }); });
        const report = result.figures.map(figure => ({ ...figure, disposition: getSeatedCharacterProportion(figure.stillId)?.status }));
        document.getElementById("status")!.textContent = `${job.id} · ${before ? "Before" : "After"} · world tile ${result.stage.tileSize}px · ${location.origin}`;
        document.getElementById("measurements")!.textContent = JSON.stringify(report, null, 2);
        return { ...result, figures: report, dataUrl: this.game.canvas.toDataURL("image/png") };
      } finally { busy = false; }
    };
    const controls = document.getElementById("controls")!;
    const select = document.createElement("select"); for (const job of cases) { const option = document.createElement("option"); option.value = option.textContent = job.id; select.append(option); }
    select.value = query.get("case") ?? "room.xray-0-t1-occupied";
    const zoom = document.createElement("select"); for (const z of [0.7, 1, 1.6]) { const o = document.createElement("option"); o.value = String(z); o.textContent = `${z * 100}%`; zoom.append(o); } zoom.value = query.get("zoom") ?? "1";
    const before = document.createElement("input"); before.type = "checkbox"; before.checked = query.get("version") === "before";
    const label = document.createElement("label"); label.textContent = "Before seated correction"; label.append(before);
    controls.append(select, zoom, label); const redraw = () => state.capture(select.value, Number(zoom.value), before.checked).catch(e => fail(String(e)));
    select.onchange = zoom.onchange = before.onchange = () => { void redraw(); };
    void redraw().then(() => { state.ready = true; });
  }
}
new Phaser.Game({ type: Phaser.CANVAS, parent: "scene", width: 1000, height: 800, transparent: false, pixelArt: true, antialias: false, roundPixels: true, audio: { noAudio: true }, banner: false, scene: [new CharacterRoomsQaScene(bridge)] });
