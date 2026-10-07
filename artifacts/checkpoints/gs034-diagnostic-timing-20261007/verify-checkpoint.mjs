import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const archive = path.dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(fs.readFileSync(path.join(archive, "manifest.json"), "utf8"));
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const safeRelative = (name) => typeof name === "string" && !path.isAbsolute(name) && !name.split(/[\\/]/).includes("..") && !name.includes("\\");
const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((item) => {
  const filename = path.join(directory, item.name);
  if (item.isSymbolicLink()) throw new Error(`Symlink is forbidden: ${path.relative(archive, filename)}`);
  return item.isDirectory() ? walk(filename) : [filename];
});
const forbidden = /(?:^|\/)(?:node_modules|dist|coverage|test-results|playwright-report|\.private-clinical-data|\.clinical-workbench|generated_images|\.git|\.env(?:\.[^/]*)?)(?:\/|$)|\.(?:pdf|png|jpe?g|gif|webp|zip|exe|dll|mp4|wasm)$/i;
const secrets = [
  /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/,
  /\b(?:ghp_|gho_|ghu_|ghs_|ghr_)[A-Za-z0-9]{30,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{40,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bsk-(?:proj-)?[A-Za-z0-9_-]{32,}\b/,
  /(?:postgres(?:ql)?|mysql):\/\/[^\s/:]+:[^\s@]+@/i,
];
if (manifest.recoveryOnly !== true || manifest.cleanRunnableCheckout !== false || manifest.publicReleaseAuthorized !== false) throw new Error("Recovery/publication boundary is missing");
const listed = new Set();
let payloadBytes = 0;
for (const row of manifest.payloads) {
  if (!safeRelative(row.archivePath) || listed.has(row.archivePath) || forbidden.test(row.archivePath)) throw new Error(`Invalid payload path: ${row.archivePath}`);
  listed.add(row.archivePath);
  if (/^source\/packages\/clinical-content\//.test(row.archivePath) || /^source\/.*(?:batch|202609|2026100[237]).*\.tsx?$/.test(row.archivePath)) throw new Error(`Excluded corpus or dated test copy: ${row.archivePath}`);
  const bytes = fs.readFileSync(path.join(archive, row.archivePath));
  if (bytes.includes(0) || bytes.toString("utf8").includes("\uFFFD")) throw new Error(`Non-UTF8 text payload: ${row.archivePath}`);
  if (sha256(bytes) !== row.sha256 || bytes.length !== row.bytes) throw new Error(`Payload hash/byte mismatch: ${row.archivePath}`);
  for (let index = 0; index < secrets.length; index += 1) if (secrets[index].test(bytes.toString("utf8"))) throw new Error(`Secret pattern ${index}: ${row.archivePath}`);
  payloadBytes += bytes.length;
}
const actualFiles = walk(archive).map((filename) => path.relative(archive, filename).replaceAll("\\", "/"));
for (const filename of actualFiles) if (filename !== "manifest.json" && !listed.has(filename)) throw new Error(`Unrecorded archive file: ${filename}`);
if (manifest.payloadCount !== listed.size || manifest.payloadBytes !== payloadBytes) throw new Error("Payload totals mismatch");

const sourceHashes = JSON.parse(fs.readFileSync(path.join(archive, "recovery/SOURCE_HASHES.json"), "utf8"));
const fixtureArgument = process.argv.indexOf("--fixture-root");
let verifiedTargets = 0;
if (fixtureArgument >= 0) {
  const supplied = process.argv[fixtureArgument + 1];
  if (!supplied) throw new Error("--fixture-root requires the private compatible before/after comparison directory");
  const fixtures = path.resolve(supplied);
  if (!fs.statSync(fixtures).isDirectory()) throw new Error("Fixture root is not a directory");
  const environment = { ...process.env, GIT_CEILING_DIRECTORIES: fixtures };
  delete environment.GIT_DIR; delete environment.GIT_WORK_TREE; delete environment.GIT_INDEX_FILE;
  const git = (args, cwd) => {
    const result = spawnSync("git", ["-c", "core.autocrlf=false", "-c", "core.safecrlf=false", "apply", ...args], { cwd, env: environment, encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
    if (result.status !== 0) throw new Error(result.stderr || result.stdout);
  };
  for (const row of sourceHashes.patches) {
    if (!safeRelative(row.targetPath) || !safeRelative(row.patchPath) || !/^[a-zA-Z0-9_.-]+$/.test(row.verificationFixtureId)) throw new Error("Unsafe reconstruction metadata");
    const before = fs.readFileSync(path.join(fixtures, row.verificationFixtureId, "before"));
    const after = fs.readFileSync(path.join(fixtures, row.verificationFixtureId, "after"));
    if (sha256(before) !== row.baselineSha256 || sha256(after) !== row.acceptedTargetSha256) throw new Error(`Incompatible private fixture: ${row.targetPath}`);
    const scratch = fs.mkdtempSync(path.join(fixtures, ".archive-verification-"));
    if (!scratch.startsWith(fixtures + path.sep)) throw new Error("Unsafe scratch path");
    const target = path.resolve(scratch, row.targetPath);
    if (!target.startsWith(scratch + path.sep)) throw new Error("Unsafe patch target");
    fs.mkdirSync(path.dirname(target), { recursive: true });
    if (row.preimageKind !== "new-file") fs.writeFileSync(target, before);
    let patch = fs.readFileSync(path.join(archive, row.patchPath));
    if (row.sectionSha256) {
      const section = patch.toString("utf8").split(/(?=^diff --git )/m).find((part) => /^\+\+\+ b\/(.+)$/m.exec(part)?.[1] === row.targetPath);
      if (!section || sha256(Buffer.from(section)) !== row.sectionSha256) throw new Error("Historical section hash mismatch");
      patch = Buffer.from(section);
    }
    const patchFile = path.join(scratch, "scoped.patch"); fs.writeFileSync(patchFile, patch);
    git(["--check", "--whitespace=nowarn", patchFile], scratch);
    git(["--whitespace=nowarn", patchFile], scratch);
    if (!fs.readFileSync(target).equals(after)) throw new Error(`Forward reconstruction failed: ${row.targetPath}`);
    git(["--reverse", "--check", "--whitespace=nowarn", patchFile], scratch);
    git(["--reverse", "--whitespace=nowarn", patchFile], scratch);
    if (row.preimageKind === "new-file" ? fs.existsSync(target) : !fs.readFileSync(target).equals(before)) throw new Error(`Reverse reconstruction failed: ${row.targetPath}`);
    git(["--whitespace=nowarn", patchFile], scratch);
    if (!fs.readFileSync(target).equals(after)) throw new Error(`Reapply reconstruction failed: ${row.targetPath}`);
    verifiedTargets += 1;
  }
}
console.log(JSON.stringify({ passed: true, recoveryOnly: true, cleanRunnableCheckout: false, payloadCount: listed.size, actualFileCount: actualFiles.length, payloadBytes,
  manifestSha256: sha256(fs.readFileSync(path.join(archive, "manifest.json"))), hashAndScopeChecks: "PASS", textAndSecretChecks: "PASS", reconstructionTargets: verifiedTargets,
  note: fixtureArgument >= 0 ? "Exact forward/reverse/reapply checks ran only in fresh private scratch." : "Reconstruction receipts are included; --fixture-root rechecks with compatible private comparison images. No active-source apply mode." }, null, 2));
