import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const checkpoint = path.dirname(fileURLToPath(import.meta.url));
const repository = path.resolve(checkpoint, "../../..");
const manifest = JSON.parse(readFileSync(path.join(checkpoint, "manifest.json"), "utf8"));
const recovery = JSON.parse(readFileSync(path.join(checkpoint, "recovery/SOURCE_HASHES.json"), "utf8"));
const failures = [];
const check = (value, message) => { if (!value) failures.push(message); };
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
function inside(root, relative) {
  if (typeof relative !== "string" || path.isAbsolute(relative) || relative.split(/[\\/]/).includes("..")) throw new Error(`Unsafe relative path: ${relative}`);
  const target = path.resolve(root, relative);
  const distance = path.relative(root, target);
  if (!distance || distance.startsWith(`..${path.sep}`) || path.isAbsolute(distance)) throw new Error(`Path escapes root: ${relative}`);
  return target;
}
function walk(root) {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(root, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symlink not permitted: ${target}`);
    return entry.isDirectory() ? walk(target) : [target];
  });
}
function lineEndings(bytes) {
  const text = bytes.toString("utf8");
  return { crlf: (text.match(/\r\n/g) ?? []).length, lf: (text.match(/(?<!\r)\n/g) ?? []).length, finalNewline: text.endsWith("\n") };
}
const args = process.argv.slice(2);
let baselineRoot = null;
if (args.length) {
  if (args.length !== 2 || args[0] !== "--baseline-root") throw new Error("Usage: node verify-checkpoint.mjs [--baseline-root PATH]. No active-source apply mode exists.");
  baselineRoot = path.resolve(args[1]);
}
const inventory = new Set(manifest.payloads.map((item) => item.archivePath));
check(manifest.recoveryOnly === true && manifest.cleanRunnableCheckout === false, "Recovery-only scope required");
check(manifest.fullBaselinesIncluded === false && recovery.allBaselinesInferred === true, "Baseline limitations must remain explicit");
check(inventory.size === manifest.payloadCount, "Payload count/duplicate mismatch");
check(manifest.payloadBytes === manifest.payloads.reduce((sum, item) => sum + item.bytes, 0), "Payload byte total mismatch");
for (const item of manifest.payloads) {
  const target = inside(checkpoint, item.archivePath);
  check(existsSync(target), `Missing payload: ${item.archivePath}`);
  if (!existsSync(target)) continue;
  check(!lstatSync(target).isSymbolicLink(), `Payload symlink: ${item.archivePath}`);
  const bytes = readFileSync(target);
  check(bytes.length === item.bytes && sha(bytes) === item.sha256, `Payload size/hash: ${item.archivePath}`);
  check(bytes.length < 20 * 1024 * 1024, `Unexpectedly large payload: ${item.archivePath}`);
  check(!/(?:^|\/)(?:node_modules|dist|\.local-dev|\.private-clinical-data|\.clinical-workbench|\.env(?:\.|$))(?:\/|$)/.test(item.archivePath), `Excluded payload path: ${item.archivePath}`);
  check(!/\.(?:pdf|png|jpg|jpeg|zip|sqlite|db)$/i.test(item.archivePath), `Excluded corpus/asset/binary: ${item.archivePath}`);
  const text = bytes.toString("utf8");
  for (const pattern of [/(?:ghp_|github_pat_)[A-Za-z0-9_]{25,}/, /(?<![A-Za-z0-9_-])sk-[A-Za-z0-9_-]{24,}/, /-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----/, /AKIA[A-Z0-9]{16}/, /Bearer\s+[A-Za-z0-9_-]{30,}/]) check(!pattern.test(text), `Potential credential: ${item.archivePath}`);
  if (item.exactByteCopy) check(item.archivePath === `files/${item.originalPath}` && item.originalSha256 === item.sha256, `Exact copy metadata: ${item.archivePath}`);
}
for (const file of walk(checkpoint)) {
  const name = path.relative(checkpoint, file).replaceAll(path.sep, "/");
  check(name === "manifest.json" || inventory.has(name), `Unlisted archive file: ${name}`);
}
const exactFiles = manifest.payloads.filter((item) => item.exactByteCopy);
check(exactFiles.length === 29, "Expected 29 exact task-owned copies");
check(exactFiles.filter((item) => item.category === "task-owned-dated-clinical-content-and-tests").length === 20, "Expected 20 dated TS files");
check(exactFiles.filter((item) => item.category === "task-owned-new-gameplay-test").length === 2, "Expected 2 new gameplay tests");
check(exactFiles.filter((item) => item.category === "dated-task-document-snapshot").length === 7, "Expected 7 dated documents");
check(recovery.patches.length === 17 && new Set(recovery.patches.map((item) => item.targetPath)).size === 17, "Expected 17 unique scoped patches");
for (const item of recovery.patches) {
  const payload = manifest.payloads.find((candidate) => candidate.archivePath === item.patchPath);
  check(payload?.sha256 === item.patchSha256 && payload?.bytes === item.patchBytes, `Patch metadata: ${item.targetPath}`);
  check(item.historicalPreEditSourceCaptured === false && item.preimageKind.startsWith("inferred-counterfactual"), `Unstated inference: ${item.targetPath}`);
  const patch = readFileSync(inside(checkpoint, item.patchPath), "utf8");
  check(patch.startsWith(`diff --git a/${item.targetPath} b/${item.targetPath}\n--- a/${item.targetPath}\n+++ b/${item.targetPath}\n`), `Patch target/header: ${item.targetPath}`);
  check((patch.match(/^diff --git /gm) ?? []).length === 1, `Multi-target patch: ${item.targetPath}`);
  check(JSON.stringify(patch.match(/^@@ .*@@.*$/gm)) === JSON.stringify(item.hunks), `Hunk inventory: ${item.targetPath}`);
  const changed = patch.split(/\r?\n/).filter((line) => /^[+-]/.test(line) && !line.startsWith("+++") && !line.startsWith("---"));
  check(JSON.stringify(changed) === JSON.stringify(item.changedLines), `Changed-line inventory: ${item.targetPath}`);
  if (["packages/clinical-content/src/index.ts", "packages/clinical-content/src/synthetic-content.ts", "packages/clinical-content/src/answer-choice-timing.ts"].includes(item.targetPath)) {
    check(changed.every((line) => line.startsWith("+") && /GS028_20261007|2026-10-07-variety/.test(line)), `Unrelated runtime assembly delta: ${item.targetPath}`);
  }
  if (item.targetPath === "packages/game-domain/src/test-choice-orders.ts") {
    check(changed.every((line) => line.startsWith("+")), "Order patch must only add the Oct7 block/spread");
    check(changed.filter((line) => line.includes("const gs028October7Records:")).length === 1 && changed.filter((line) => line.includes("...gs028October7Records,")).length === 1, "Exact Oct7 order block/spread required");
  }
}
let scratch = null;
let forward = 0;
let reverse = 0;
let reconstructed = 0;
if (baselineRoot && !failures.length) {
  const baselines = new Map();
  for (const item of recovery.patches) {
    const target = inside(baselineRoot, item.targetPath);
    check(existsSync(target), `Missing compatible inferred fixture: ${item.targetPath}`);
    if (!existsSync(target)) continue;
    check(!lstatSync(target).isSymbolicLink(), `Baseline symlink: ${item.targetPath}`);
    const bytes = readFileSync(target);
    check(bytes.length === item.baselineBytes && sha(bytes) === item.baselineSha256, `Baseline divergence: ${item.targetPath}`);
    check(JSON.stringify(lineEndings(bytes)) === JSON.stringify(item.baselineLineEndings), `Baseline EOL divergence: ${item.targetPath}`);
    baselines.set(item.targetPath, bytes);
  }
  if (!failures.length) {
    const scratchParent = path.join(repository, ".local-dev/gs028-20261007/backup");
    mkdirSync(scratchParent, { recursive: true });
    scratch = mkdtempSync(path.join(scratchParent, "verified-roundtrip-"));
    for (const [name, bytes] of baselines) {
      const target = inside(scratch, name);
      mkdirSync(path.dirname(target), { recursive: true });
      writeFileSync(target, bytes, { flag: "wx" });
    }
    const env = { ...process.env, GIT_CEILING_DIRECTORIES: scratchParent };
    delete env.GIT_DIR; delete env.GIT_WORK_TREE; delete env.GIT_INDEX_FILE;
    const git = (options) => execFileSync("git", ["-c", "core.autocrlf=false", "-c", "core.safecrlf=false", ...options], { cwd: scratch, env, stdio: "pipe" });
    const targetsMatch = () => {
      for (const item of recovery.patches) {
        const bytes = readFileSync(inside(scratch, item.targetPath));
        check(bytes.length === item.acceptedTargetBytes && sha(bytes) === item.acceptedTargetSha256, `Accepted-target mismatch: ${item.targetPath}`);
        check(JSON.stringify(lineEndings(bytes)) === JSON.stringify(item.acceptedTargetLineEndings), `Target EOL mismatch: ${item.targetPath}`);
      }
    };
    try {
      const patchFiles = recovery.patches.map((item) => inside(checkpoint, item.patchPath));
      for (const filename of patchFiles) { git(["apply", "--check", "--whitespace=nowarn", filename]); forward += 1; }
      git(["apply", "--whitespace=nowarn", ...patchFiles]);
      targetsMatch();
      for (const filename of patchFiles) { git(["apply", "--reverse", "--check", "--whitespace=nowarn", filename]); reverse += 1; }
      git(["apply", "--reverse", "--whitespace=nowarn", ...patchFiles]);
      for (const [name, bytes] of baselines) check(readFileSync(inside(scratch, name)).equals(bytes), `Reverse byte mismatch: ${name}`);
      git(["apply", "--check", "--whitespace=nowarn", ...patchFiles]);
      git(["apply", "--whitespace=nowarn", ...patchFiles]);
      targetsMatch();
      for (const item of exactFiles) {
        const target = inside(scratch, item.originalPath);
        mkdirSync(path.dirname(target), { recursive: true });
        writeFileSync(target, readFileSync(inside(checkpoint, item.archivePath)), { flag: "wx" });
        check(sha(readFileSync(target)) === item.sha256, `Reconstructed exact file mismatch: ${item.originalPath}`);
        reconstructed += 1;
      }
    } catch (error) { failures.push(`Scratch verification failed: ${error.stderr?.toString() ?? error.message}`); }
  }
}
console.log(JSON.stringify({ checkpoint: manifest.checkpoint, payloads: manifest.payloadCount, payloadBytes: manifest.payloadBytes, patches: recovery.patches.length, exactFiles: exactFiles.length, baselineVerificationRequested: Boolean(baselineRoot), forwardPatchChecks: forward, reversePatchChecks: reverse, exactFilesReconstructed: reconstructed, scratch, activeSourceWrites: 0, baselineWrites: 0, gitIndexOrRefWrites: 0, failures }, null, 2));
if (failures.length) process.exitCode = 1;
