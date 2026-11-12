import Phaser from "phaser";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { FacilityScene, type FacilitySceneBridge } from "../facility/FacilityScene";
import { fitRoomThumbnail, roomThumbnailAlphaBounds, roomThumbnailModel, type ThumbnailBounds } from "../facility/roomThumbnailCapture";
import { assertCanvasRoomLighting } from "../facility/canvasRoomLighting";
import { assertRoomThumbnailPixels, roomThumbnailFootprint, thumbnailFootprintInFrame, type RoomThumbnailPixelStats } from "../facility/roomThumbnailPixels.mjs";
import { ROOM_THUMBNAIL_MANIFEST } from "../art/roomThumbnailManifest";
import { APPROVED_LEVEL5_BITMAP_ASSETS } from "../art/bitmapAssetManifest";
import { getPhaserTextureKey, preloadBitmapAssets } from "../art/bitmapAssetAdapters";
import { DESKTOP_FACILITY_ASSETS } from "../mobile/performance/roomAssets";

if (!import.meta.env.DEV || location.hostname !== "127.0.0.1") throw new Error("Room thumbnails require the loopback development QA server");

const assets = [...new Map([...DESKTOP_FACILITY_ASSETS, ...APPROVED_LEVEL5_BITMAP_ASSETS].map(asset => [asset.id, asset])).values()];
const definitions = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions.filter(room => room.buildable);
const bridge: FacilitySceneBridge = { viewModel: roomThumbnailModel("room.waiting"), onPlaceRoom: () => false };
const state = {
  ready: false, error: null as string | null, manifest: ROOM_THUMBNAIL_MANIFEST,
  definitions: definitions.map(({ id, displayName, width, height, unlockFacilityLevel, maximumUpgradeLevel }) =>
    ({ id, displayName, width, height, unlockFacilityLevel, maximumUpgradeLevel })),
  sourceAssets: assets.map(asset => asset.relativePath!),
  capture: async (_definitionId: string, _tier: number): Promise<RoomThumbnailCapture> => { throw new Error("Capture not ready"); },
};

interface RoomThumbnailCapture {
  dataUrl: string;
  sourceBounds: ReturnType<typeof roomThumbnailAlphaBounds>;
  destinationBounds: ReturnType<typeof fitRoomThumbnail>;
  stage: { width: number; height: number };
  quality: { source: RoomThumbnailPixelStats; output: RoomThumbnailPixelStats };
  width: number;
  height: number;
}

declare global { interface Window { __roomThumbnailQa: typeof state } }
window.__roomThumbnailQa = state;
window.addEventListener("error", event => { state.error ??= event.message; });
window.addEventListener("unhandledrejection", event => { state.error ??= String(event.reason); });

/** Warmth lives behind the room; the art is one nearest-neighbor draw, without filters. */
function frameRoom(source: HTMLCanvasElement, footprint: ThumbnailBounds): RoomThumbnailCapture {
  const sourceContext = source.getContext("2d", { willReadFrequently: true });
  if (!sourceContext) throw new Error("Canvas2D renderer required");
  const pixels = sourceContext.getImageData(0, 0, source.width, source.height).data;
  const bounds = roomThumbnailAlphaBounds(pixels, source.width, source.height);
  const sourceQuality = assertRoomThumbnailPixels(pixels, source.width, source.height, footprint);
  const { width, height, padding, pixelRatio } = ROOM_THUMBNAIL_MANIFEST;
  const destination = fitRoomThumbnail(bounds, width, height, padding);
  const output = document.createElement("canvas"); output.width = width; output.height = height;
  const context = output.getContext("2d")!;
  context.imageSmoothingEnabled = false;
  const warmth = context.createRadialGradient(width * .35, height * .2, 0, width * .5, height * .5, width * .8);
  warmth.addColorStop(0, "#faf7e8"); warmth.addColorStop(1, "#e4dfce");
  context.fillStyle = warmth; context.fillRect(0, 0, width, height);
  context.shadowColor = "#23272030"; context.shadowBlur = 3 * pixelRatio; context.shadowOffsetY = 2 * pixelRatio;
  context.drawImage(source, bounds.x, bounds.y, bounds.width, bounds.height,
    destination.x, destination.y, destination.width, destination.height);
  const outputQuality = assertRoomThumbnailPixels(context.getImageData(0, 0, width, height).data, width, height,
    thumbnailFootprintInFrame(footprint, bounds, destination));
  return { dataUrl: output.toDataURL("image/png"), sourceBounds: bounds, destinationBounds: destination,
    stage: { width: source.width, height: source.height }, quality: { source: sourceQuality, output: outputQuality }, width, height };
}

class ThumbnailScene extends FacilityScene {
  public preload(): void {
    this.load.on(Phaser.Loader.Events.FILE_LOAD_ERROR, (file: Phaser.Loader.File) => { state.error = `Source art failed: ${file.key}`; });
    preloadBitmapAssets(this.load, assets, import.meta.env.BASE_URL);
  }
  public override create(): void {
    const missing = assets.filter(asset => !this.textures.exists(getPhaserTextureKey(asset)));
    if (state.error || missing.length) { state.error ??= `Missing source art: ${missing.map(asset => asset.id).join(", ")}`; return; }
    super.create();
    assertCanvasRoomLighting(this.game.renderer);
    let busy = false;
    state.capture = async (definitionId, tier) => {
      if (busy) throw new Error("Thumbnail captures must be sequential");
      busy = true;
      try {
        bridge.viewModel = roomThumbnailModel(definitionId, tier);
        this.renderRoomThumbnail();
        // POST_RENDER observes the actual Phaser Canvas output, including
        // canonical wall occluders and depth-sorted touchups/lighting.
        await new Promise<void>((resolve, reject) => {
          const rendered = () => { window.clearTimeout(timer); resolve(); };
          const timer = window.setTimeout(() => {
            this.game.events.off(Phaser.Core.Events.POST_RENDER, rendered);
            reject(new Error("Phaser did not render the thumbnail within 10 seconds"));
          }, 10_000);
          this.game.events.once(Phaser.Core.Events.POST_RENDER, rendered);
        });
        const room = bridge.viewModel.rooms[0]!;
        return frameRoom(this.game.canvas, roomThumbnailFootprint(room.width, room.height));
      } finally { busy = false; }
    };
    state.ready = true;
  }
}

new Phaser.Game({
  type: Phaser.CANVAS, parent: "room-capture", width: 1200, height: 1200,
  transparent: true, pixelArt: true, antialias: false, roundPixels: true,
  audio: { noAudio: true }, banner: false,
  scene: [new ThumbnailScene(bridge)],
});
