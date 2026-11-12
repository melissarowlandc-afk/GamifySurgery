// Reviewable performance experiment only. Never edits runtime files or evidence.
// The runtime spatial module is outside the currently authorized source lane.
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { registerHooks, stripTypeScriptTypes } from "node:module";
import { pathToFileURL } from "node:url";
import "../economy-audit/source-loader.mjs";

const keyBefore = '  return [pointKey(inside), pointKey(outside)].sort().join("|");';
const keyAfter = [
  '  const insideKey = pointKey(inside), outsideKey = pointKey(outside);',
  '  return insideKey < outsideKey ? `${insideKey}|${outsideKey}` : `${outsideKey}|${insideKey}`;',
].join("\n");
const slotsBefore = '  if (!owner) return false;\n  return owner.doorSlots.some((slot) => {';
const slotsAfter = [
  '  if (!owner) return false;',
  '  // The physical door set is constant across this fixture\'s candidate slots.',
  '  // Keep it local so geometry changes never reuse a stale navigation result.',
  '  const physicalDoors = new Set<string>();',
  '  for (const door of doors) {',
  '    const placed = rooms.find((candidate) => candidate.id === door.roomId);',
  '    const placedDefinition = placed ? getDefinition(placed.roomDefinitionId) : null;',
  '    const cells = placed && placedDefinition',
  '      ? getDoorCellsForSpatial(door, placed, placedDefinition)',
  '      : null;',
  '    if (cells) physicalDoors.add(physicalDoorKey(cells.inside, cells.outside));',
  '  }',
  '  return owner.doorSlots.some((slot) => {',
].join("\n");
const scanBefore = [
  '    return doors.some((door) => {',
  '      const placed = rooms.find((candidate) => candidate.id === door.roomId);',
  '      const placedDefinition = placed ? getDefinition(placed.roomDefinitionId) : null;',
  '      const cells = placed && placedDefinition',
  '        ? getDoorCellsForSpatial(door, placed, placedDefinition)',
  '        : null;',
  '      return cells ? physicalDoorKey(cells.inside, cells.outside) === expected : false;',
  '    });',
].join("\n");
const replacements = [[keyBefore, keyAfter], [slotsBefore, slotsAfter], [scanBefore, '    return physicalDoors.has(expected);']];

export function candidateSource(original) {
  let source = original.replaceAll("\r\n", "\n");
  for (const [before, after] of replacements) {
    if (source.split(before).length !== 2) throw new Error("Candidate no longer binds to exactly one original source span");
    source = source.replace(before, after);
  }
  return source;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const target = new URL("../../packages/game-domain/src/spatial.ts", import.meta.url);
  const original = readFileSync(target, "utf8"), candidate = candidateSource(original);
  if (process.argv[2] === "--print-patch") {
    process.stdout.write("*** Begin Patch\n*** Update File: packages/game-domain/src/spatial.ts\n" +
      replacements.map(([before, after]) => "@@\n" + before.split("\n").map(l => "-" + l).join("\n") + "\n" + after.split("\n").map(l => "+" + l).join("\n")).join("\n") + "\n*** End Patch\n");
  } else {
    const hash = s => createHash("sha256").update(s).digest("hex");
    process.stdout.write(JSON.stringify({ experiment: "NOT APPLIED: process-local spatial candidate", path: "packages/game-domain/src/spatial.ts", originalSha256: hash(original), candidateSha256: hash(candidate) }) + "\n");
    registerHooks({ load(url, context, nextLoad) {
      if (url !== target.href) return nextLoad(url, context);
      return { format: "module", source: stripTypeScriptTypes(candidate, { mode: "transform", sourceUrl: url }), shortCircuit: true };
    } });
    await import("./compare-level-five-journeys.mjs");
  }
}
