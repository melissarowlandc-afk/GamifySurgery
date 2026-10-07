import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, relative } from "node:path";

const root = process.cwd();
const rooms = [
  ["ambulatory-or", "ambulatory-or", "98759E8F0C2ACF681B469D47F84B6F447B52D1D0FD24DBF5E37AEF9F59C90C56"],
  ["laboratory", "laboratory", "1A2D3AE0A8A0623114B52F3D23D56956AC5E21C8E38E496535060766488A4C95"],
  ["pharmacy", "pharmacy", "F2775A9104E494E7F9F51E3424054DAC4CE4A91969266799CA0CD6A03CD00C1C"],
  ["maintenance-workshop", "maintenance-workshop", "A7C8D8BFAC5F5087B795B96EA67D2E3E0DAB7C1BF536701F586945213CFBE439"],
  ["staff-break-room", "staff-break-room", "FD4DE2CA6EAF353AA52D5BAFB2D8C1E9C42C5E3F15498F35DA1433905A71ACFC"],
  ["surgeons-office", "surgeons-office", "AE268AD14EC7F6A9365031C4C7FA45AFFC9F4E1C5AA69CDF077EA9C5E0E375C5"],
  ["vending", "vending", "939A3CFA901891DBFED1578B7CA68819844BB821A7E3E01174347DB6B959573B"],
];
const hash = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
const output = [];
for (const [sourceName, runtimeName, approvedProofSha256] of rooms) {
  const source = join(root, "tools/room-design/level-3", sourceName, "proof", "processed-assets");
  const contract = join(root, "tools/room-design/level-3", sourceName, "proof", "handoff-contract.json");
  const proofFile = join(root, "tools/room-design/level-3", sourceName, "proof", `${sourceName}-proof.html`);
  const destination = join(root, "apps/player/public/art/rooms/level3-v1", runtimeName);
  if (!existsSync(source) || !existsSync(contract) || !existsSync(proofFile)) throw new Error(`Missing approved current proof inputs for ${sourceName}`);
  const actualProofSha256 = hash(proofFile).toUpperCase();
  if (actualProofSha256 !== approvedProofSha256) throw new Error(`Approved proof hash mismatch for ${sourceName}: ${actualProofSha256}`);
  mkdirSync(dirname(destination), { recursive: true });
  cpSync(source, destination, { recursive: true, force: true });
  const files = readdirSync(source).filter((file) => file.endsWith(".webp")).sort().map((file) => ({
    file,
    sourceSha256: hash(join(source, file)),
    promotedSha256: hash(join(destination, file)),
  }));
  if (files.some((file) => file.sourceSha256 !== file.promotedSha256)) throw new Error(`Copy mismatch for ${sourceName}`);
  output.push({ sourceName, runtimeName, approvedProofSha256, proofPath: relative(root, proofFile).replaceAll("\\\\", "/"), actualProofSha256, handoffContractSha256: hash(contract), files });
}
const manifest = { schemaVersion: 1, purpose: "approved-level3-room-runtime-promotion", generatedAt: new Date().toISOString(), rooms: output };
const path = join(root, "artifacts/level3-implementation-20261004/room-promotion-manifest.json");
mkdirSync(dirname(path), { recursive: true });
writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Promoted ${output.reduce((count, room) => count + room.files.length, 0)} approved room assets across ${output.length} rooms.`);
