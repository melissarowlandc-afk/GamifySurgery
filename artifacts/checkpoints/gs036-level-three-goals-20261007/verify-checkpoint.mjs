import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const checkpoint = path.dirname(fileURLToPath(import.meta.url));
const repository = path.resolve(checkpoint, "../../..");
const manifest = JSON.parse(readFileSync(path.join(checkpoint, "manifest.json"), "utf8"));
const sourceHashes = JSON.parse(readFileSync(path.join(checkpoint, "recovery/SOURCE_HASHES.json"), "utf8"));
const failures = [];
const assert = (ok, message) => { if (!ok) failures.push(message); };
const sha256 = (data) => createHash("sha256").update(data).digest("hex");
const expectedTests = [
  "apps/player/src/session/level3GoalsViewModels.test.ts",
  "packages/game-domain/tests/level-three-goals.test.ts",
  "tests/e2e/level-three-goals.spec.ts",
];

function inside(root, relativePath) {
  if (typeof relativePath !== "string" || path.isAbsolute(relativePath)) throw new Error(`Unsafe relative path: ${relativePath}`);
  const target = path.resolve(root, relativePath);
  const relative = path.relative(root, target);
  if (!relative || relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) throw new Error(`Path escapes root: ${relativePath}`);
  return target;
}

function walk(root) {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(root, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symlink is not an archive payload: ${target}`);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function lineEndings(bytes) {
  const value = bytes.toString("utf8");
  return { crlf: (value.match(/\r\n/g) ?? []).length, lf: (value.match(/(?<!\r)\n/g) ?? []).length, trailingNewline: value.endsWith("\n") };
}

const payloadPaths = new Set(manifest.payloads.map((item) => item.archivePath));
assert(manifest.recoveryOnly === true, "Manifest must mark this as recovery-only");
assert(payloadPaths.size === manifest.payloadCount, "Duplicate payload or incorrect payload count");
assert(manifest.payloadBytes === manifest.payloads.reduce((sum, item) => sum + item.bytes, 0), "Incorrect payload byte total");
for (const payload of manifest.payloads) {
  const target = inside(checkpoint, payload.archivePath);
  assert(existsSync(target), `Missing payload: ${payload.archivePath}`);
  if (!existsSync(target)) continue;
  assert(!lstatSync(target).isSymbolicLink(), `Symlink payload: ${payload.archivePath}`);
  const bytes = readFileSync(target);
  assert(bytes.length === payload.bytes && sha256(bytes) === payload.sha256, `Payload hash/size: ${payload.archivePath}`);
  assert(bytes.length < 100 * 1024 * 1024, `Oversized GitHub payload: ${payload.archivePath}`);
  assert(!/(?:^|\/)(?:node_modules|dist|\.env(?:\.|$)|\.private-clinical-data|\.clinical-workbench)(?:\/|$)/.test(payload.archivePath), `Excluded archive path: ${payload.archivePath}`);
  assert(!/(?:^|\/)(?:packages\/clinical-content|clinical-data)\//.test(payload.originalPath ?? ""), `Clinical source outside scope: ${payload.archivePath}`);
  if (payload.category === "task-owned-new-test") {
    assert(expectedTests.includes(payload.originalPath), `Unexpected new source file: ${payload.originalPath}`);
    assert(payload.archivePath === `files/${payload.originalPath}`, `Unexpected new-file destination: ${payload.archivePath}`);
  }
  if (payload.category === "synthetic-browser-screenshot") {
    assert(bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), `PNG signature: ${payload.archivePath}`);
    assert(bytes.readUInt32BE(16) === payload.width && bytes.readUInt32BE(20) === payload.height, `PNG dimensions: ${payload.archivePath}`);
  }
  if (/\.(?:md|json|mjs|ts|tsx|css|patch)$/.test(payload.archivePath)) {
    const value = bytes.toString("utf8");
    const credentialPatterns = [
      /(?:ghp_|github_pat_)[A-Za-z0-9_]{25,}/,
      /(?<![A-Za-z0-9_-])sk-[A-Za-z0-9_-]{24,}/,
      /-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----/,
      /AKIA[A-Z0-9]{16}/,
    ];
    assert(!credentialPatterns.some((pattern) => pattern.test(value)), `Potential credential: ${payload.archivePath}`);
  }
}
for (const file of walk(checkpoint)) {
  const relative = path.relative(checkpoint, file).replaceAll(path.sep, "/");
  assert(relative === "manifest.json" || payloadPaths.has(relative), `Unlisted archive file: ${relative}`);
}
const count = (category) => manifest.payloads.filter((item) => item.category === category).length;
assert(count("goal-only-recovery-patch") === 10 && sourceHashes.patches.length === 10, "Expected ten scoped patches");
assert(count("task-owned-new-test") === 3, "Expected three new tests");
assert(count("synthetic-browser-screenshot") === 6, "Expected six synthetic screenshots");
assert(new Set(sourceHashes.patches.map((item) => item.targetPath)).size === 10, "Duplicate patch target");
for (const item of sourceHashes.patches) {
  const payload = manifest.payloads.find((entry) => entry.archivePath === item.patchPath);
  assert(payload?.sha256 === item.patchSha256 && payload?.bytes === item.patchBytes, `Patch metadata: ${item.targetPath}`);
  const patch = readFileSync(inside(checkpoint, item.patchPath), "utf8");
  assert(patch.startsWith(`diff --git a/${item.targetPath} b/${item.targetPath}\n`), `Unexpected patch target: ${item.targetPath}`);
  assert(patch.includes(`--- a/${item.targetPath}\n+++ b/${item.targetPath}\n`), `Patch file headers: ${item.targetPath}`);
  assert((patch.match(/^diff --git /gm) ?? []).length === 1, `Multi-file patch: ${item.targetPath}`);
  assert(!/^[+-].*(?:patientAvailabilityGuidance|createPatientAvailabilityGuidance|patient-availability-guidance)/m.test(patch), `Concurrent availability hunk: ${item.targetPath}`);
  assert((patch.match(/^@@ /gm) ?? []).length === item.hunks.length, `Hunk inventory: ${item.targetPath}`);
}

const args = process.argv.slice(2);
let baselineRoot = null;
if (args.length) {
  if (args.length !== 2 || args[0] !== "--baseline-root") throw new Error("Usage: node verify-checkpoint.mjs [--baseline-root PATH]");
  baselineRoot = path.resolve(args[1]);
}
let scratch = null;
let patchChecks = 0;
let reverseChecks = 0;
let reconstructedTargets = 0;
if (baselineRoot && !failures.length) {
  const baselines = new Map();
  for (const item of sourceHashes.patches) {
    const filename = inside(baselineRoot, item.targetPath);
    assert(existsSync(filename), `Missing exact baseline: ${item.targetPath}`);
    if (!existsSync(filename)) continue;
    const bytes = readFileSync(filename);
    assert(bytes.length === item.baselineBytes && sha256(bytes) === item.baselineSha256, `Baseline mismatch: ${item.targetPath}`);
    assert(JSON.stringify(lineEndings(bytes)) === JSON.stringify(item.baselineLineEndings), `Baseline EOL mismatch: ${item.targetPath}`);
    baselines.set(item.targetPath, bytes);
  }
  if (!failures.length) {
    const scratchParent = path.join(repository, ".local-dev/gs036-level-three-goals");
    mkdirSync(scratchParent, { recursive: true });
    scratch = mkdtempSync(path.join(scratchParent, "backup-verification-"));
    for (const [relative, bytes] of baselines) {
      const target = inside(scratch, relative);
      mkdirSync(path.dirname(target), { recursive: true });
      writeFileSync(target, bytes, { flag: "wx" });
    }
    const env = { ...process.env, GIT_CEILING_DIRECTORIES: scratchParent };
    delete env.GIT_DIR;
    delete env.GIT_WORK_TREE;
    delete env.GIT_INDEX_FILE;
    const run = (gitArgs) => execFileSync("git", ["-c", "core.autocrlf=false", "-c", "core.safecrlf=false", ...gitArgs], { cwd: scratch, env, stdio: "pipe" });
    const checkTargets = () => {
      for (const item of sourceHashes.patches) {
        const bytes = readFileSync(inside(scratch, item.targetPath));
        assert(bytes.length === item.goalOnlyTargetBytes && sha256(bytes) === item.goalOnlyTargetSha256, `Reconstructed target: ${item.targetPath}`);
        assert(JSON.stringify(lineEndings(bytes)) === JSON.stringify(item.goalOnlyTargetLineEndings), `Target EOL mismatch: ${item.targetPath}`);
      }
    };
    try {
      for (const item of sourceHashes.patches) {
        run(["apply", "--check", "--whitespace=nowarn", inside(checkpoint, item.patchPath)]);
        patchChecks += 1;
      }
      const patchFiles = sourceHashes.patches.map((item) => inside(checkpoint, item.patchPath));
      run(["apply", "--whitespace=nowarn", ...patchFiles]);
      checkTargets();
      reconstructedTargets = failures.length ? 0 : sourceHashes.patches.length;
      for (const item of sourceHashes.patches) {
        run(["apply", "--reverse", "--check", "--whitespace=nowarn", inside(checkpoint, item.patchPath)]);
        reverseChecks += 1;
      }
      run(["apply", "--reverse", "--whitespace=nowarn", ...patchFiles]);
      for (const [relative, original] of baselines) assert(readFileSync(inside(scratch, relative)).equals(original), `Byte-exact reverse roundtrip: ${relative}`);
      run(["apply", "--check", "--whitespace=nowarn", ...patchFiles]);
      run(["apply", "--whitespace=nowarn", ...patchFiles]);
      checkTargets();
      for (const payload of manifest.payloads.filter((item) => item.category === "task-owned-new-test")) {
        const target = inside(scratch, payload.originalPath);
        mkdirSync(path.dirname(target), { recursive: true });
        writeFileSync(target, readFileSync(inside(checkpoint, payload.archivePath)), { flag: "wx" });
        assert(sha256(readFileSync(target)) === payload.sha256, `Reconstructed new test: ${payload.originalPath}`);
      }
    } catch (error) {
      failures.push(`Scratch git apply failed: ${error.stderr?.toString() ?? error.message}`);
    }
  }
}

console.log(JSON.stringify({
  checkpoint: manifest.checkpoint,
  payloads: manifest.payloadCount,
  payloadBytes: manifest.payloadBytes,
  recoveryPatches: sourceHashes.patches.length,
  newTests: count("task-owned-new-test"),
  syntheticScreenshots: count("synthetic-browser-screenshot"),
  exactBaselineVerificationRequested: Boolean(baselineRoot),
  forwardPatchChecks: patchChecks,
  reversePatchChecks: reverseChecks,
  reconstructedTargets,
  scratch,
  sharedSourceWrites: 0,
  gitIndexOrRefWrites: 0,
  failures,
}, null, 2));
if (failures.length) process.exitCode = 1;
