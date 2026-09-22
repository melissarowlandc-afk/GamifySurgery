#!/usr/bin/env node
/**
 * Metadata-only preservation registry. It hashes local reference files but
 * never copies, decodes, transforms, or publishes their pixels.
 *
 * node tools/character-mapping/retained-roster/build-retained-roster.mjs --write
 * node tools/character-mapping/retained-roster/build-retained-roster.mjs --validate
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, relative } from "node:path";

const root = resolve(fileURLToPath(new URL("../../..", import.meta.url)));
const retainedDir = resolve(root, "Photos for Codex 2/Patients or Staff or Other Characters");
const patientManifestPath = resolve(root, "apps/player/public/art/characters/patients-v1/manifest.json");
const founderManifestPath = resolve(root, "apps/player/public/art/characters/founders-v4/manifest.json");
const candidateManifestPath = resolve(root, "artifacts/character-movement/retained-donor-merge/all-directions-v1/all-directions-manifest.json");
const outputPath = resolve(root, "artifacts/character-movement/retained-roster/retained-roster.json");
const toRepoPath = (path) => relative(root, path).replaceAll("\\", "/");
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

function pngDimensions(bytes, path) {
  if (bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") throw new Error(`Not a PNG: ${path}`);
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

async function build() {
  const [patientManifest, founderManifest, candidateManifestBytes, names] = await Promise.all([
    readFile(patientManifestPath, "utf8").then(JSON.parse),
    readFile(founderManifestPath, "utf8").then(JSON.parse),
    readFile(candidateManifestPath),
    readdir(retainedDir),
  ]);
  const patientByHash = new Map(patientManifest.variants.map((entry) => [entry.sourceSha256, entry.id]));
  if (patientByHash.size !== 50) throw new Error("Expected 50 unique patient source hashes.");
  const candidateManifest = JSON.parse(candidateManifestBytes);
  if (candidateManifest.schemaVersion !== 1 || candidateManifest.status !== "expansion-review-candidate" || !Array.isArray(candidateManifest.characters)) {
    throw new Error("Expected the immutable all-directions review-candidate manifest schema.");
  }
  const candidateBySourceHash = new Map(candidateManifest.characters.map((entry) => [entry.sourceSha256, entry.id]));
  const candidateManifestSha256 = sha256(candidateManifestBytes);
  const sources = [];
  for (const name of names.filter((name) => name.endsWith(".png")).sort()) {
    const path = resolve(retainedDir, name);
    const bytes = await readFile(path);
    const sourceSha256 = sha256(bytes);
    const dimensions = pngDimensions(bytes, path);
    const patientId = patientByHash.get(sourceSha256);
    const candidateId = candidateBySourceHash.get(sourceSha256);
    const candidateEastOnly = patientId === "patient.adult.032" || patientId === "patient.adult.033";
    const candidate = candidateManifest.characters.find((entry) => entry.sourceSha256 === sourceSha256);
    if (candidateEastOnly) {
      if (!candidateId || candidate.runtimeId !== patientId) throw new Error(`Missing or mismatched all-directions candidate source for ${patientId}`);
      for (const direction of ["east", "west", "south", "north"]) {
        if (Object.keys(candidate.directions?.[direction] ?? {}).length !== 8) throw new Error(`Candidate ${candidateId} lacks eight ${direction} phases.`);
      }
      if (!candidate.static?.standSouth || !candidate.static?.sitSouth) throw new Error(`Candidate ${candidateId} lacks required south stills.`);
    }
    sources.push({
      file: toRepoPath(path),
      sourceSha256,
      dimensions,
      ...(patientId
        ? {
            family: "patient",
            stableId: patientId,
            mappingStatus: candidateEastOnly ? "repair_required" : "pending_mapping",
            expectedCoverage: candidateEastOnly
              ? { walkFrames: 32, standingSouth: 1, seatedSouth: 1, status: "not_production_accepted" }
              : { walkFrames: 32, standingSouth: 1, seated: 1, status: "unverified" },
            ...(candidateEastOnly
              ? { renderedCoverage: {
                  east: 8, west: 8, south: 8, north: 8, walkFrames: 32, standSouth: 1, sitSouth: 1,
                },
                visualStatus: "user_rejected",
                rejection: {
                  date: "2026-09-11",
                  feedback: "walking poor all directions; chunky/cut-off arms and legs",
                },
                candidateEvidence: {
                  manifest: toRepoPath(candidateManifestPath),
                  schemaVersion: candidateManifest.schemaVersion,
                  manifestStatus: candidateManifest.status,
                  candidateId,
                  manifestSha256: candidateManifestSha256,
                  scope: "all directions and south stills remain pinned rendered evidence; user-rejected pending structural repair, with no production or full-roster acceptance",
                } }
              : {}),
          }
        : {
            family: "unresolved_retained_reference",
            mappingStatus: "identity_resolution_required",
            exception: name === "exec-e644a34b-c74e-4787-b593-d009b00768ac.png"
              ? "documented_style_guide"
              : "no_exact_patient_manifest_hash_match",
            expectedCoverage: name === "exec-e644a34b-c74e-4787-b593-d009b00768ac.png"
              ? {
                  status: "not_applicable_pending_role",
                  evidence: "docs/handoffs/PATIENT_EMPLOYEE_CHARACTERS_HANDOFF.md#reference-style-and-execution-findings",
                }
              : { walkFrames: 32, standingSouth: 1, seated: 1, status: "pending_role" },
          }),
    });
  }
  const founders = founderManifest.variants.map((entry) => {
    const number = Number(entry.id.match(/(\d+)$/)?.[1]);
    return ({
    stableId: entry.id,
    source: entry.source,
    family: "founder",
    silhouetteClass: number >= 21 && number <= 30 ? "nonhuman_exception" : "human",
    mappingStatus: "pending_mapping",
    expectedCoverage: { walkFrames: 32, standingSouth: 1, seated: 1, status: "unverified" },
    });
  });
  return {
    schemaVersion: 1,
    scope: "metadata-only preservation coverage; no artwork readiness or pose completion is inferred",
    evidencePaths: {
      retainedSourceDirectory: toRepoPath(retainedDir),
      patientManifest: toRepoPath(patientManifestPath),
      founderManifest: toRepoPath(founderManifestPath),
      candidateManifest: toRepoPath(candidateManifestPath),
      founderExceptionPlan: "docs/execplans/redesign-30-authored-founders.md",
    },
    counts: {
      retainedPngFiles: sources.length,
      exactPatientHashJoins: sources.filter((source) => source.family === "patient").length,
      unmatchedRetainedReferences: sources.filter((source) => source.family !== "patient").length,
      founders: founders.length,
      founderNonhumanExceptions: founders.filter((founder) => founder.silhouetteClass === "nonhuman_exception").length,
    },
    retainedSources: sources,
    founders,
  };
}

function validate(registry) {
  if (registry.counts.retainedPngFiles !== 55) throw new Error("Expected exactly 55 retained PNGs.");
  if (registry.counts.exactPatientHashJoins !== 50 || registry.counts.unmatchedRetainedReferences !== 5) throw new Error("Expected a 50/5 retained crosswalk.");
  if (registry.counts.founders !== 30 || registry.counts.founderNonhumanExceptions !== 10) throw new Error("Expected 30 founders with IDs 21–30 exceptional.");
  const ids = registry.retainedSources.filter((s) => s.family === "patient").map((s) => s.stableId);
  if (new Set(ids).size !== 50 || !ids.includes("patient.adult.032") || !ids.includes("patient.adult.033")) throw new Error("Patient hash joins are missing or duplicate.");
  const sourceHashes = registry.retainedSources.map((s) => s.sourceSha256);
  if (new Set(sourceHashes).size !== 55) throw new Error("Retained source content is duplicated.");
  for (const source of registry.retainedSources) {
    if (source.dimensions.width !== 1536 || source.dimensions.height !== 1024) throw new Error(`Unexpected dimensions for ${source.file}`);
    if (!["unverified", "pending_role", "not_applicable_pending_role", "not_production_accepted"].includes(source.expectedCoverage.status)) throw new Error(`Unexpected coverage status: ${source.file}`);
  }
  for (const founder of registry.founders) {
    const number = Number(founder.stableId.slice(-2));
    if ((number >= 21 && number <= 30) !== (founder.silhouetteClass === "nonhuman_exception")) throw new Error(`Founder exception mismatch: ${founder.stableId}`);
  }
}

const mode = process.argv[2];
if (mode === "--write") {
  const registry = await build();
  validate(registry);
  await mkdir(resolve(outputPath, ".."), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(registry, null, 2)}\n`);
  console.log(`Wrote ${toRepoPath(outputPath)} with ${registry.counts.retainedPngFiles} retained sources.`);
} else if (mode === "--validate") {
  const expected = JSON.parse(await readFile(outputPath, "utf8"));
  const actual = await build();
  validate(expected);
  validate(actual);
  if (JSON.stringify(expected) !== JSON.stringify(actual)) throw new Error("Registry is stale: regenerate with --write.");
  console.log(`Validated ${toRepoPath(outputPath)}: 55 retained sources, 50 patient joins, 5 exceptions, 30 founders.`);
} else {
  throw new Error("Use --write or --validate.");
}
