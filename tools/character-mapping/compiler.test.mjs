import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { canonicalJson, checkRecipeFile, compileRecipe, compileRecipeFile, runBatchFile, safeKey, safeResolve, validateRecipe } from "./compiler.mjs";
import { distance2, distance3 } from "./math.mjs";

const root = resolve(import.meta.dirname, "..", "..");
const recipePath = resolve(root, "docs/features/character-movement/recipes/patient-01.json");
const batchPath = resolve(root, "docs/features/character-movement/batches/first-existing-four.json");
const baseRecipe = () => JSON.parse(readFileSync(recipePath, "utf8"));
const clone = value => structuredClone(value);
const temporary = name => mkdtempSync(resolve(tmpdir(), `character-mapping-${name}-`));
const targetFor = (compiled, view, phaseIndex) => compiled.targets.find(target => target.view === view && target.phaseIndex === phaseIndex);

test("Patient 01 deterministically compiles all 32 accepted targets with an explicit numerical allowance", () => {
  const first = compileRecipe(baseRecipe(), { repositoryRoot: root, codeFingerprint: "test-code" });
  const second = compileRecipe(baseRecipe(), { repositoryRoot: root, codeFingerprint: "test-code" });
  assert.equal(canonicalJson(first), canonicalJson(second));
  assert.equal(first.targets.length, 32);
  assert.deepEqual([...new Set(first.targets.map(target => target.view))].sort(), ["east", "north", "south", "west"]);
  assert.equal(first.status, "authoring_target_pending_raster_review");
  assert.equal(first.outputClass, "target_only");
  assert.equal(first.sourceLineageVerification.status, "declared_not_read_by_numeric_tool");
  const expectedKeys = ["right", "left", "front", "back"].flatMap(view => Array.from({ length: 8 }, (_, index) => `${first.identity.templateId}:${view}-walk-${index + 1}`)).sort();
  assert.deepEqual(first.targets.map(target => target.outputKey).sort(), expectedKeys);
  for (const target of first.targets.filter(target => target.view === "north" || target.view === "south")) for (const side of ["left", "right"]) {
    const latentJoint = target.geometry.latent.joints[side], frameJoint = target.geometry.frame.joints[side], nativeJoint = target.geometry.nativeMaster.joints[side];
    assert.equal("footLiftUnits" in latentJoint || "footLiftUnits" in frameJoint || "footLiftUnits" in nativeJoint, false);
    assert.equal(latentJoint.latentFootLiftUnits, "latent-frame-authoring-units-upward");
    assert.equal(frameJoint.projectedFootLiftUnits, "frame-pixels-upward");
    assert.equal(nativeJoint.latentFootLiftUnits, "latent-frame-authoring-units-upward");
    assert.equal(nativeJoint.projectedFootLiftUnits, "source-pixels-upward");
  }

  const lateral = JSON.parse(readFileSync(resolve(root, "docs/features/character-movement/patient-01-fit.json"), "utf8"));
  const northSouth = JSON.parse(readFileSync(resolve(root, "docs/features/character-movement/patient-01-north-south-fit.json"), "utf8"));
  let maxDeviation = 0;
  const comparePoint = (actual, expected) => {
    maxDeviation = Math.max(maxDeviation, Math.abs(actual.x - expected.x), Math.abs(actual.y - expected.y));
  };
  for (const target of first.targets) {
    const reference = (target.view === "east" || target.view === "west" ? lateral : northSouth).phases[target.phaseIndex - 1][target.view];
    if (target.view === "east" || target.view === "west") {
      for (const side of ["left", "right"]) for (const key of ["shoulder", "elbow", "wrist", "hand", "hip", "knee", "ankle", "shoeContact", "shoeHeel", "shoeToe"]) comparePoint(target.geometry.joints[side][key], reference.joints[side][key]);
      comparePoint(target.geometry.headEnvelope.center, reference.headEnvelope.center);
      for (const key of Object.keys(reference.torso)) comparePoint(target.geometry.torso[key], reference.torso[key]);
    } else {
      for (const side of ["left", "right"]) for (const key of ["shoulder", "elbow", "wrist", "hand", "hip", "knee", "ankle", "contact", "heel", "toe"]) {
        comparePoint(target.geometry.frame.joints[side][key], reference.frame.joints[side][key]);
        for (const axis of ["lateral", "forward", "height"]) maxDeviation = Math.max(maxDeviation, Math.abs(target.geometry.latent.joints[side][key][axis] - reference.latent.joints[side][key][axis]));
      }
    }
  }
  // The accepted fixtures round published coordinates to four decimals. Keep
  // this regression allowance separate from any future raster/art tolerance.
  assert.ok(maxDeviation <= 0.0001, `numeric regression deviation ${maxDeviation}`);
});

test("changed character measurements recompute joints and preserve authored lengths/support", () => {
  const original = compileRecipe(baseRecipe(), { repositoryRoot: root, codeFingerprint: "test-code" });
  const changedRecipe = baseRecipe();
  changedRecipe.identity = { ...changedRecipe.identity, templateId: "synthetic-ratio-fit", outputKey: "synthetic-ratio-fit", displayLabel: "Synthetic ratio fit" };
  changedRecipe.lateral.segmentLengths.thigh = 30; changedRecipe.lateral.segmentLengths.shin = 27;
  changedRecipe.northSouth.segmentLengths3D.thigh = 35; changedRecipe.northSouth.segmentLengths3D.shin = 31;
  changedRecipe.northSouth.body.headRadiusLateral = 17;
  const changed = compileRecipe(changedRecipe, { repositoryRoot: root, codeFingerprint: "test-code" });
  const oldSide = targetFor(original, "east", 2).geometry.joints.left.knee;
  const newSide = targetFor(changed, "east", 2).geometry.joints.left.knee;
  assert.notDeepEqual(newSide, oldSide);
  const sidePass = targetFor(changed, "east", 3).geometry.joints;
  assert.ok(Math.abs(distance2(sidePass.right.hip, sidePass.right.knee) - 30) < 0.002);
  assert.ok(Math.abs(distance2(sidePass.right.knee, sidePass.right.ankle) - 27) < 0.002);
  assert.ok(Math.abs(distance2(sidePass.right.hip, sidePass.right.ankle) - 57) < 0.002);
  const latentPass = targetFor(changed, "south", 3).geometry.latent.joints;
  assert.ok(Math.abs(distance3(latentPass.right.hip, latentPass.right.knee) - 35) < 0.002);
  assert.ok(Math.abs(distance3(latentPass.right.knee, latentPass.right.ankle) - 31) < 0.002);
  assert.equal(targetFor(changed, "south", 1).geometry.frame.body.headEnvelope.radiusX, 17);
});

test("content-addressed outputs reuse verified bytes and changed dependencies become stale", () => {
  const outputRoot = temporary("cache");
  const written = compileRecipeFile(recipePath, { repositoryRoot: root, outputRoot, codeFingerprint: "code-a" });
  const bytes = readFileSync(written.path, "utf8");
  const reused = compileRecipeFile(recipePath, { repositoryRoot: root, outputRoot, codeFingerprint: "code-a" });
  assert.equal(reused.disposition, "reused"); assert.equal(readFileSync(reused.path, "utf8"), bytes);
  assert.throws(() => checkRecipeFile(recipePath, { repositoryRoot: root, outputRoot, codeFingerprint: "code-b" }), /missing or stale output/);
  const changed = compileRecipeFile(recipePath, { repositoryRoot: root, outputRoot, codeFingerprint: "code-b" });
  assert.notEqual(changed.path, written.path); assert.ok(existsSync(written.path));
});

test("tampered and partial outputs fail check while compile safely repairs its own partial marker", () => {
  const tamperedRoot = temporary("tamper"), tampered = compileRecipeFile(recipePath, { repositoryRoot: root, outputRoot: tamperedRoot, codeFingerprint: "code" });
  writeFileSync(tampered.path, "{}\n");
  assert.throws(() => checkRecipeFile(recipePath, { repositoryRoot: root, outputRoot: tamperedRoot, codeFingerprint: "code" }), /tampered output/);
  assert.throws(() => compileRecipeFile(recipePath, { repositoryRoot: root, outputRoot: tamperedRoot, codeFingerprint: "code" }), /tampered immutable output/);

  const partialRoot = temporary("partial"), clean = compileRecipeFile(recipePath, { repositoryRoot: root, outputRoot: partialRoot, codeFingerprint: "code" });
  writeFileSync(`${clean.path}.partial`, "interrupted");
  assert.throws(() => checkRecipeFile(recipePath, { repositoryRoot: root, outputRoot: partialRoot, codeFingerprint: "code" }), /partial interrupted output/);
  assert.equal(compileRecipeFile(recipePath, { repositoryRoot: root, outputRoot: partialRoot, codeFingerprint: "code" }).disposition, "reused");
  assert.equal(checkRecipeFile(recipePath, { repositoryRoot: root, outputRoot: partialRoot, codeFingerprint: "code" }).status, "verified");
});

test("missing, nonnumeric, nonfinite, negative, bad provenance, unreachable and bounds inputs fail", () => {
  const cases = [
    [recipe => { delete recipe.lateral.centers.hipY; }, /lateral\.centers\.hipY/],
    [recipe => { recipe.northSouth.motion.strideReach = "24"; }, /northSouth\.motion\.strideReach/],
    [recipe => { recipe.lateral.motion.transitionReach = null; }, /lateral\.motion\.transitionReach/],
    [recipe => { recipe.northSouth.projection.depthScale = Number.NaN; }, /depthScale/],
    [recipe => { recipe.lateral.segmentLengths.thigh = -1; }, /thigh must be positive/],
    [recipe => { recipe.evidence = []; }, /evidence is required/],
    [recipe => { recipe.references[0].sha256 = "0".repeat(64); }, /reference hash mismatch/],
    [recipe => { recipe.lateral.motion.strideReach = 120; }, /unreachable lateral target|geometry outside/],
    [recipe => { recipe.lateral.envelope.headRadiusX = 100; }, /geometry outside/],
  ];
  for (const [mutate, pattern] of cases) { const recipe = baseRecipe(); mutate(recipe); assert.throws(() => compileRecipe(recipe, { repositoryRoot: root, codeFingerprint: "test" }), pattern); }
});

test("schema-permitted zero foot offsets compile and projected sole bounds are measured separately", () => {
  const zeroFoot = baseRecipe();
  zeroFoot.northSouth.foot.contactForwardOffset = 0;
  zeroFoot.northSouth.foot.liftedHeelRise = 0;
  zeroFoot.northSouth.foot.liftedToeRise = 0;
  assert.equal(compileRecipe(zeroFoot, { repositoryRoot: root, codeFingerprint: "zero-foot" }).targets.length, 32);

  const wideHead = baseRecipe();
  wideHead.northSouth.body.headRadiusLateral = 50;
  assert.equal(compileRecipe(wideHead, { repositoryRoot: root, codeFingerprint: "wide-head" }).targets.length, 32);
  const overflowingSole = baseRecipe();
  overflowingSole.northSouth.foot.toeHalfWidth = 60;
  assert.throws(() => compileRecipe(overflowingSole, { repositoryRoot: root, codeFingerprint: "sole-overflow" }), /toe sole outside/);
});

test("reflections require a grounded opposite lateral source and the exact shared permutation", () => {
  const reflected = baseRecipe();
  reflected.lineage.west = { kind: "reflected", fromView: "east", approved: true, phasePermutation: { "01": "05", "02": "06", "03": "07", "04": "08", "05": "01", "06": "02", "07": "03", "08": "04" } };
  assert.doesNotThrow(() => validateRecipe(reflected));
  for (const mutate of [
    recipe => { recipe.lineage.west.fromView = "west"; },
    recipe => { recipe.lineage.north = { ...recipe.lineage.west, fromView: "south" }; },
    recipe => { recipe.lineage.east = { ...recipe.lineage.west, fromView: "west" }; },
    recipe => { recipe.lineage.west.phasePermutation["01"] = "01"; },
    recipe => { recipe.lineage.west.approved = false; },
  ]) { const recipe = clone(reflected); mutate(recipe); assert.throws(() => validateRecipe(recipe), /reflection/); }
  assert.equal(baseRecipe().lineage.east.kind, "independent"); assert.equal(baseRecipe().lineage.west.kind, "independent");
});

test("portable keys, traversal, input overwrite and duplicate batch identities are rejected", () => {
  for (const key of ["../escape", "con", "aux.json", "trailing.", "has space"]) assert.throws(() => safeKey(key), /safe directory key/);
  assert.throws(() => safeResolve(root, "../escape.json"), /escapes/);
  assert.throws(() => compileRecipeFile(recipePath, { repositoryRoot: root, outputRoot: dirname(recipePath), codeFingerprint: "test" }), /output root/);
  const folder = temporary("duplicate"), manifest = { batchKey: "duplicate-test", members: [
    { identityKey: "same", outputKey: "one", status: "pending_measurement", blockers: ["measurement"] },
    { identityKey: "same", outputKey: "two", status: "pending_measurement", blockers: ["measurement"] },
  ] };
  const path = resolve(folder, "batch.json"); writeFileSync(path, canonicalJson(manifest));
  assert.throws(() => runBatchFile(path, { repositoryRoot: root, outputRoot: resolve(folder, "out") }), /duplicate identity/);
  const duplicateOutput = { ...manifest, members: [
    { identityKey: "first", outputKey: "same-output", status: "pending_measurement", blockers: ["measurement"] },
    { identityKey: "second", outputKey: "same-output", status: "pending_measurement", blockers: ["measurement"] },
  ] };
  const duplicateOutputPath = resolve(folder, "duplicate-output.json"); writeFileSync(duplicateOutputPath, canonicalJson(duplicateOutput));
  assert.throws(() => runBatchFile(duplicateOutputPath, { repositoryRoot: root, outputRoot: resolve(folder, "out") }), /duplicate output/);
  assert.throws(() => runBatchFile(batchPath, { repositoryRoot: root, outputRoot: resolve(folder, "out"), selectedKeys: ["outside-batch"] }), /outside batch/);
});

test("CLI rejects unknown options, unexpected positionals and root escapes before work", () => {
  const cli = resolve(root, "tools/character-mapping/cli.mjs");
  const cases = [
    ["batch", "--manifest", "docs/features/character-movement/batches/first-existing-four.json", "--memberr", "mixed-20260910-patient-01"],
    ["compile", "unexpected", "--recipe", "docs/features/character-movement/recipes/patient-01.json"],
    ["compile", "--recipe", "../escape.json"],
    ["compile", "--recipe", "docs/features/character-movement/recipes/patient-01.json", "--output-root", "../escape"]
  ];
  for (const args of cases) {
    const result = spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: "utf8" });
    assert.notEqual(result.status, 0, `CLI unexpectedly accepted ${args.join(" ")}`);
    assert.equal(JSON.parse(result.stderr).ok, false);
  }
});

test("linked output and input ancestry, linked output files and linked partials are rejected", t => {
  const folder = temporary("links"), outputRoot = resolve(folder, "out"), outside = resolve(folder, "outside");
  mkdirSync(outputRoot, { recursive: true }); mkdirSync(outside, { recursive: true });
  const linkType = process.platform === "win32" ? "junction" : "dir";
  try { symlinkSync(outside, resolve(outputRoot, baseRecipe().identity.outputKey), linkType); }
  catch (error) { t.skip(`platform cannot create safe temporary directory link: ${error.code ?? error.message}`); return; }
  assert.throws(() => compileRecipeFile(recipePath, { repositoryRoot: root, outputRoot, codeFingerprint: "linked-output" }), /symbolic link or junction/);
  assert.deepEqual(readdirSync(outside), []);

  const linkedRoot = resolve(folder, "linked-repository"); symlinkSync(root, linkedRoot, linkType);
  assert.throws(() => compileRecipeFile(resolve(linkedRoot, "docs/features/character-movement/recipes/patient-01.json"), { repositoryRoot: root, outputRoot: resolve(folder, "input-out"), codeFingerprint: "linked-input" }), /symbolic link or junction/);

  const fileRoot = resolve(folder, "linked-files"), clean = compileRecipeFile(recipePath, { repositoryRoot: root, outputRoot: fileRoot, codeFingerprint: "linked-file" });
  rmSync(clean.path); mkdirSync(resolve(folder, "outside-partial")); symlinkSync(resolve(folder, "outside-partial"), `${clean.path}.partial`, linkType);
  assert.throws(() => compileRecipeFile(recipePath, { repositoryRoot: root, outputRoot: fileRoot, codeFingerprint: "linked-file" }), /partial output path contains a symbolic link or junction/);
  rmSync(`${clean.path}.partial`); symlinkSync(outside, clean.path, linkType);
  assert.throws(() => checkRecipeFile(recipePath, { repositoryRoot: root, outputRoot: fileRoot, codeFingerprint: "linked-file" }), /output path contains a symbolic link or junction/);
});

test("first batch writes only ready selected members and reports three measurement blockers", () => {
  const outputRoot = temporary("first-batch");
  const result = runBatchFile(batchPath, { repositoryRoot: root, outputRoot, codeFingerprint: "test" });
  const firstBytes = readFileSync(result.path, "utf8");
  const repeated = runBatchFile(batchPath, { repositoryRoot: root, outputRoot, codeFingerprint: "test" });
  assert.deepEqual(result.counts, { selected: 4, compiled: 1, pending: 3, targets: 32 });
  assert.equal(result.status, "measurement_blocked");
  assert.equal(result.pending.every(item => item.blockers.length > 0), true);
  assert.equal(result.compiled[0].identityKey, "mixed-20260910-patient-01");
  assert.equal(result.timing.localToolMilliseconds, null);
  assert.equal(result.invocationDispositions[0].disposition, "written");
  assert.equal(repeated.invocationDispositions[0].disposition, "reused");
  assert.equal(repeated.fingerprint, result.fingerprint);
  assert.equal(repeated.path, result.path);
  assert.equal(readFileSync(repeated.path, "utf8"), firstBytes);
  assert.equal("invocationDispositions" in JSON.parse(firstBytes), false);
});

test("an interrupted batch safely resumes verified per-character outputs", () => {
  const folder = temporary("resume"), outputRoot = resolve(folder, "out");
  const recipe = baseRecipe();
  const manifest = { batchKey: "resume-test", members: [{ identityKey: recipe.identity.templateId, outputKey: recipe.identity.outputKey, status: "ready", recipe: "docs/features/character-movement/recipes/patient-01.json" }] };
  const manifestFile = resolve(folder, "batch.json"); writeFileSync(manifestFile, canonicalJson(manifest));
  assert.throws(() => runBatchFile(manifestFile, { repositoryRoot: root, outputRoot, codeFingerprint: "test", interruptAfter: 1 }), /simulated interruption/);
  const resumed = runBatchFile(manifestFile, { repositoryRoot: root, outputRoot, codeFingerprint: "test" });
  const resumedBytes = readFileSync(resumed.path, "utf8");
  const repeated = runBatchFile(manifestFile, { repositoryRoot: root, outputRoot, codeFingerprint: "test" });
  assert.equal(resumed.invocationDispositions[0].disposition, "reused"); assert.equal(resumed.counts.targets, 32);
  assert.equal(repeated.invocationDispositions[0].disposition, "reused");
  assert.equal(repeated.fingerprint, resumed.fingerprint);
  assert.equal(readFileSync(repeated.path, "utf8"), resumedBytes);
});

test("all-pending batch fingerprints include compiler code", () => {
  const folder = temporary("pending-code"), manifestFile = resolve(folder, "batch.json");
  writeFileSync(manifestFile, canonicalJson({ batchKey: "all-pending", members: [{ identityKey: "pending-one", outputKey: "pending-one", status: "pending_measurement", blockers: ["measurement"] }] }));
  const outputRoot = resolve(folder, "out");
  const first = runBatchFile(manifestFile, { repositoryRoot: root, outputRoot, codeFingerprint: "compiler-a" });
  const changed = runBatchFile(manifestFile, { repositoryRoot: root, outputRoot, codeFingerprint: "compiler-b" });
  assert.notEqual(first.fingerprint, changed.fingerprint);
  assert.notEqual(first.path, changed.path);
  assert.equal(first.compilerCodeFingerprint, "compiler-a");
  assert.equal(changed.compilerCodeFingerprint, "compiler-b");
});

test("synthetic 300-character batch demonstrates local numeric capacity only", () => {
  const started = process.hrtime.bigint(); let targets = 0;
  for (let index = 0; index < 300; index += 1) {
    const recipe = baseRecipe(), id = `synthetic-capacity-${String(index).padStart(3, "0")}`;
    recipe.identity = { ...recipe.identity, templateId: id, outputKey: id, displayLabel: `Synthetic ${index}` };
    const ratioDelta = (index % 3) - 1;
    recipe.lateral.segmentLengths.thigh = 29 + ratioDelta; recipe.lateral.segmentLengths.shin = 28 - ratioDelta;
    recipe.northSouth.segmentLengths3D.thigh = 34 + ratioDelta; recipe.northSouth.segmentLengths3D.shin = 32 - ratioDelta;
    recipe.northSouth.body.headRadiusLateral = 17 + (index % 3);
    targets += compileRecipe(recipe, { repositoryRoot: root, codeFingerprint: "synthetic-capacity-test" }).targets.length;
  }
  const localToolMilliseconds = Number(process.hrtime.bigint() - started) / 1e6;
  assert.equal(targets, 9_600);
  assert.ok(localToolMilliseconds < 30_000, `synthetic capacity exceeded 30s: ${localToolMilliseconds}ms`);
});
