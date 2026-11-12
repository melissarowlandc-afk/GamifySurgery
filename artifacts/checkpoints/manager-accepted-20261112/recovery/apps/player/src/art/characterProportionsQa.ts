import type { PixelAppearanceDescriptor } from "@gamify-surgery/game-domain";
import { characterBitmapLayers, characterBitmapRegistration, characterStillScaleForAppearance } from "./characterBitmapArt";
import { CHARACTER_PROPORTION_REFERENCE, getCharacterProportionProfile } from "./characterProportions";
import { CHARACTER_STILL_DIRECTIONS, getAllCharacterStillEntries, getCharacterStillEntry, resolveCharacterStillAssetUrl, type CharacterStillAsset, type CharacterStillEntry } from "./characterStillRegistry";
import { alignCharacterStillSeatToWorld, characterStillVisibleTop, getCharacterStillPresentationMetrics } from "../facility/characterPresentation";

if (!import.meta.env.DEV || location.hostname !== "127.0.0.1") throw new Error("Character QA requires the loopback development server");

const entries = getAllCharacterStillEntries();
const params = new URLSearchParams(location.search);
const state = { ready: false, error: null as string | null, zoom: Number(params.get("zoom") ?? 1), version: params.get("version") ?? "after", pose: params.get("pose") ?? "stand-south", view: params.get("view") ?? "lineup", id: params.get("id") ?? "founder.14", origin: location.origin, rows: [] as { id: string; source: string; width: number; height: number; floorY: number; headY: number; seatY: number | null }[] };
if (!Number.isFinite(state.zoom) || state.zoom < .1 || state.zoom > 2.5) state.zoom = 1;
declare global { interface Window { __characterProportionsQa: typeof state & { render: () => Promise<void> } } }
window.__characterProportionsQa = Object.assign(state, { render });
const appearances = (entry: CharacterStillEntry): PixelAppearanceDescriptor => ({ version: "pixel-avatar.v1", stillId: entry.id, roleStyle: entry.id.startsWith("founder.") ? "founder" : "patient", bodyShape: "average", hairStyle: "short", hairShade: 0, faceStyle: "round", outfitStyle: "plain", outfitShade: 0, accessory: "none" });
const urls = new Map<string, Promise<HTMLImageElement>>();
function image(asset: CharacterStillAsset) {
  if (!urls.has(asset.url)) urls.set(asset.url, new Promise((resolve, reject) => { const img = new Image(); img.onload = () => resolve(img); img.onerror = () => reject(new Error("Failed asset: " + asset.url)); img.src = resolveCharacterStillAssetUrl(asset); }));
  return urls.get(asset.url)!;
}

function selectedEntries() {
  if (state.view === "all") return entries;
  if (state.view === "poses") return [getCharacterStillEntry(state.id) ?? getCharacterStillEntry("founder.14")!];
  const selected = new Set(["founder.14", "founder.01", "founder.11", "founder.21", "patient.adult.001", "gs022-new-employee-009", "retained.gray-braid"]);
  for (const cohort of new Set(entries.map(e => e.cohort))) selected.add(entries.find(e => e.cohort === cohort)!.id);
  for (const role of ["staff.receptionist", "staff.imaging_technician", "staff.phlebotomist"]) { const entry = entries.find(e => e.role === role); if (entry) selected.add(entry.id); }
  for (const group of ["young-child", "school-child", "teen"]) selected.add(entries.find(e => getCharacterProportionProfile(e.id)?.group === group)!.id);
  return [...selected].map(id => getCharacterStillEntry(id)).filter((entry): entry is CharacterStillEntry => Boolean(entry));
}
const poses = [...["stand", "walk", "sit"].flatMap(p => CHARACTER_STILL_DIRECTIONS.map(d => `${p}-${d}`)), "clipboard-south"];
function controls() {
  const root = document.getElementById("controls")!;
  root.replaceChildren();
  const add = (labelText: string, values: readonly string[], value: string, changed: (v: string) => void) => {
    const label = document.createElement("label"); label.textContent = labelText;
    const select = document.createElement("select"); for (const v of values) { const option = document.createElement("option"); option.value = v; option.textContent = v; select.append(option); }
    select.value = value; select.onchange = () => { changed(select.value); void render(); }; label.append(select); root.append(label);
  };
  add("Version", ["before", "after", "both"], state.version, v => state.version = v);
  add("View", ["lineup", "poses", "all"], state.view, v => state.view = v);
  add("Pose", poses, state.pose, v => state.pose = v);
  add("Identity", entries.map(e => e.id), state.id, v => state.id = v);
  add("Zoom", ["0.1", "0.5", "0.7", "1", "1.6", "2.5"], String(state.zoom), v => state.zoom = Number(v));
}

async function drawActor(ctx: CanvasRenderingContext2D, entry: CharacterStillEntry, poseKey: string, x: number, plane: number, after: boolean, reference = false) {
  const [posture, facing] = poseKey.split("-");
  const cardinal = CHARACTER_STILL_DIRECTIONS.find(d => d === facing) ?? "south";
  const direction = cardinal === "south" ? "front" : cardinal === "north" ? "back" : "side";
  const pose = posture === "sit" ? "seated" : posture === "walk" ? "walk-neutral" : posture === "clipboard" ? "interaction" : "idle";
  const appearance = appearances(entry);
  const layers = characterBitmapLayers(appearance, direction, pose, cardinal === "east")!;
  const asset = layers.actor.asset;
  const current = characterBitmapRegistration(layers);
  const south = entry.poses.stand.south;
  const factor = after ? characterStillScaleForAppearance(appearance, pose) : Math.min(1, 246 / (south.anchors.floorY - south.visibleBounds.y));
  const metrics = getCharacterStillPresentationMetrics(52 * state.zoom, factor);
  const floor = after ? current.floorY : asset.anchors.floorY;
  const top = after ? current.visibleBounds.y : asset.visibleBounds.y;
  const base = posture === "sit" && asset.anchors.seatContactY !== undefined ? alignCharacterStillSeatToWorld(plane, floor, asset.anchors.seatContactY, metrics.height) : plane;
  ctx.imageSmoothingEnabled = !after;
  ctx.imageSmoothingQuality = "high";
  ctx.globalAlpha = reference ? .5 : 1;
  ctx.drawImage(await image(asset), Math.round(x - asset.anchors.bodyAxisX * metrics.width / 160), Math.round(base) - floor * metrics.height / 320, metrics.width, metrics.height);
  ctx.globalAlpha = 1;
  const headY = characterStillVisibleTop(Math.round(base), floor, top, metrics.height);
  ctx.strokeStyle = "#a74b3b"; ctx.beginPath(); ctx.moveTo(x - 5, headY); ctx.lineTo(x + 5, headY); ctx.stroke();
  if (!reference) state.rows.push({ id: entry.id, source: asset.url, width: metrics.width, height: metrics.height, floorY: base, headY, seatY: posture === "sit" ? base - (floor - asset.anchors.seatContactY!) * metrics.height / 320 : null });
  return { base, headY };
}

let generation = 0;
async function render() {
  const currentGeneration = ++generation;
  state.ready = false; state.rows = [];
  const stage = document.getElementById("stage")!; stage.replaceChildren();
  const selected = selectedEntries();
  const versions = state.version === "both" ? [false, true] : [state.version !== "before"];
  const reference = getCharacterStillEntry("founder.14")!;
  const cellWidth = Math.max(205, Math.ceil(135 * state.zoom)), cellHeight = Math.max(178, Math.ceil(178 * state.zoom));
  const columns = 5;
  for (const after of versions) {
    const heading = document.createElement("h2"); heading.textContent = after ? "After" : "Before"; stage.append(heading);
    // Separate canvases keep the all-identity view below browser canvas limits.
    const cells = state.view === "poses" ? poses.map(pose => ({ entry: selected[0]!, pose })) : selected.map(entry => ({ entry, pose: state.pose }));
    for (let start = 0; start < cells.length; start += 25) {
      const page = cells.slice(start, start + 25), canvas = document.createElement("canvas");
      canvas.width = cellWidth * columns; canvas.height = cellHeight * Math.ceil(page.length / columns);
      canvas.dataset.version = after ? "after" : "before"; canvas.dataset.page = String(start / 25);
      const ctx = canvas.getContext("2d")!; ctx.fillStyle = "#eee9da"; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.font = "12px system-ui";
      for (const [index, cell] of page.entries()) {
        const x = index % columns * cellWidth, y = Math.floor(index / columns) * cellHeight;
        const plane = y + cellHeight - (cell.pose.startsWith("sit") ? 43 * state.zoom : 28);
        ctx.strokeStyle = cell.pose.startsWith("sit") ? "#397eaf" : "#657966"; ctx.beginPath(); ctx.moveTo(x + 4, plane); ctx.lineTo(x + cellWidth - 4, plane); ctx.stroke();
        if (cell.pose.startsWith("sit")) { ctx.fillStyle = "#638e9b66"; ctx.fillRect(x + cellWidth * .22, plane, cellWidth * .2, 5 * state.zoom); }
        await drawActor(ctx, cell.entry, cell.pose, x + cellWidth * .32, plane, after);
        await drawActor(ctx, reference, cell.pose, x + cellWidth * .75, plane, after, true);
        ctx.fillStyle = "#26352d"; ctx.fillText(cell.entry.id, x + 5, y + 14); ctx.fillText(state.view === "poses" ? cell.pose : cell.entry.cohort, x + 5, y + 29);
        ctx.fillText(getCharacterProportionProfile(cell.entry.id)!.group, x + 5, y + cellHeight - 6);
        if (cell.pose.startsWith("clipboard") && !cell.entry.clipboard) ctx.fillText("stand (no clipboard)", x + 5, y + 44);
      }
      if (currentGeneration !== generation) return;
      stage.append(canvas);
    }
  }
  document.getElementById("status")!.textContent = `${selected.length} identities · ${state.zoom * 100}% zoom · tile ${52 * state.zoom}px · reference ${CHARACTER_PROPORTION_REFERENCE.renderedHeight.toFixed(2)}px at 100% · ${location.origin}`;
  state.ready = true;
}
window.addEventListener("error", event => { state.error = event.message; document.getElementById("error")!.textContent = event.message; });
window.addEventListener("unhandledrejection", event => { state.error = String(event.reason); document.getElementById("error")!.textContent = state.error; });
controls();
await render();
