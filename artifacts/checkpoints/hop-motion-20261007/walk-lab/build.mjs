// Embeds four identities' standing stills (read-only from the repo) into the
// Walk Lab page as data URIs. Writes walk-lab.html next to this script; do not commit that output.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const repo = fileURLToPath(new URL("../../../../", import.meta.url)).replace(/[\\/]$/, "");
const registry = JSON.parse(
  readFileSync(`${repo}/apps/player/src/art/characterStillRegistry.generated.json`, "utf8"),
);
const VISIBLE_HEIGHT_CAP = 246; // CHARACTER_STILL_VISIBLE_HEIGHT_CAP
const PICKS = [
  ["founder.01", "Founder"],
  ["gs026-employee-001", "Employee A"],
  ["gs022-new-employee-003", "Employee B"],
  ["patient.adult.001", "Patient"],
];

const characters = PICKS.map(([id, label]) => {
  const entry = registry.characters.find((c) => c.id === id);
  if (!entry) throw new Error(`Missing still identity ${id}`);
  const stand = entry.poses.stand;
  const south = stand.south;
  const dirs = {};
  for (const dir of ["south", "east", "west", "north"]) {
    const asset = stand[dir];
    if (asset.width !== 160 || asset.height !== 320 || asset.anchors.floorY !== south.anchors.floorY) {
      throw new Error(`Unexpected geometry for ${id} ${dir}`);
    }
    dirs[dir] = `data:image/png;base64,${readFileSync(`${repo}/apps/player/public/${asset.url}`).toString("base64")}`;
  }
  const sit = entry.poses.sit?.south;
  if (!sit || sit.width !== 160 || sit.height !== 320 || sit.anchors.floorY !== south.anchors.floorY || !(sit.anchors.seatContactY > 0)) {
    throw new Error(`Missing or unexpected seated still for ${id}`);
  }
  dirs.sit = `data:image/png;base64,${readFileSync(`${repo}/apps/player/public/${sit.url}`).toString("base64")}`;
  const visibleHeight = south.anchors.floorY - south.visibleBounds.y;
  return {
    id,
    label,
    scale: Math.min(1, VISIBLE_HEIGHT_CAP / visibleHeight),
    anchor: south.anchors.floorY / south.height,
    seatRise: (sit.anchors.floorY - sit.anchors.seatContactY) / sit.height,
    frames: dirs,
  };
});

const template = readFileSync(new URL("./walk-lab.template.html", import.meta.url), "utf8");
if (!template.includes("/*__STILLS__*/null")) throw new Error("Template placeholder missing");
const html = template.replace("/*__STILLS__*/null", JSON.stringify(characters));
writeFileSync(new URL("./walk-lab.html", import.meta.url), html);
console.log(
  characters.map((c) => `${c.label} (${c.id}) scale=${c.scale.toFixed(3)} anchor=${c.anchor.toFixed(4)}`).join("\n"),
);
console.log(`walk-lab.html: ${(html.length / 1024).toFixed(0)} KB`);
