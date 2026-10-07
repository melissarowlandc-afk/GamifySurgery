import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const manifestPath = join(root, "artifacts/level3-implementation-20261004/room-promotion-manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const hash = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
const sameHash = (left, right) => left.toLowerCase() === right.toLowerCase();
const requireHash = (path, expected, label) => {
  if (!existsSync(path)) throw new Error(`Missing ${label}: ${path}`);
  const actual = hash(path);
  if (!sameHash(actual, expected)) throw new Error(`${label} hash mismatch: expected ${expected}, found ${actual}`);
};

if (manifest.rooms.length !== 7) throw new Error("Expected seven approved Level 3 rooms");
for (const room of manifest.rooms) {
  const proofDirectory = join(root, "tools/room-design/level-3", room.sourceName, "proof");
  const sourceDirectory = join(proofDirectory, "processed-assets");
  const promotedDirectory = join(root, "apps/player/public/art/rooms/level3-v1", room.runtimeName);
  const proofPath = resolve(root, room.proofPath);
  requireHash(proofPath, room.approvedProofSha256, `${room.sourceName} approved proof`);
  requireHash(proofPath, room.actualProofSha256, `${room.sourceName} recorded proof`);
  requireHash(join(proofDirectory, "handoff-contract.json"), room.handoffContractSha256, `${room.sourceName} handoff contract`);

  const expectedFiles = room.files.map(({ file }) => file).sort();
  const sourceFiles = readdirSync(sourceDirectory).filter((file) => file.endsWith(".webp")).sort();
  const promotedFiles = readdirSync(promotedDirectory).filter((file) => file.endsWith(".webp")).sort();
  if (JSON.stringify(sourceFiles) !== JSON.stringify(expectedFiles)) {
    throw new Error(`${room.sourceName} source file list differs from the promotion manifest`);
  }
  if (JSON.stringify(promotedFiles) !== JSON.stringify(expectedFiles)) {
    throw new Error(`${room.runtimeName} promoted file list differs from the promotion manifest`);
  }
  for (const file of room.files) {
    requireHash(join(sourceDirectory, file.file), file.sourceSha256, `${room.sourceName}/${file.file} source`);
    requireHash(join(promotedDirectory, file.file), file.promotedSha256, `${room.runtimeName}/${file.file} promoted`);
    if (!sameHash(file.sourceSha256, file.promotedSha256)) {
      throw new Error(`${room.sourceName}/${file.file} recorded source/promoted hashes differ`);
    }
  }
}
console.log(`PASS ${manifest.rooms.length} approved proof hashes and ${manifest.rooms.reduce((count, room) => count + room.files.length, 0)} current source/runtime asset pairs`);
