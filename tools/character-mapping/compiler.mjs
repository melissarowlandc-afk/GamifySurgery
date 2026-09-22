import { createHash } from "node:crypto";
import { existsSync, lstatSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, parse, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { compileLateral, compileNorthSouth, distance2, distance3 } from "./math.mjs";

const TOOL_FILES = ["math.mjs", "compiler.mjs"];
const SAFE_KEY = /^[a-z0-9][a-z0-9._-]*$/;
const HALF_CYCLE = { "01": "05", "02": "06", "03": "07", "04": "08", "05": "01", "06": "02", "07": "03", "08": "04" };
const sha = bytes => createHash("sha256").update(bytes).digest("hex");
export const canonicalJson = value => JSON.stringify(sortValue(value), null, 2) + "\n";
function sortValue(value) {
  if (Array.isArray(value)) return value.map(sortValue);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map(key => [key, sortValue(value[key])]));
  return value;
}
function fail(message) { throw new Error(message); }
function finitePositive(value, label, allowZero = false) {
  if (!Number.isFinite(value) || (allowZero ? value < 0 : value <= 0)) fail(`${label} must be ${allowZero ? "non-negative" : "positive"} and finite`);
}
export function safeKey(value, label = "key") {
  const reserved = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/;
  if (typeof value !== "string" || !SAFE_KEY.test(value) || /[. ]$/.test(value) || reserved.test(value)) fail(`${label} is not a portable safe directory key`);
  return value;
}
export function safeResolve(base, relativePath, label = "path") {
  if (typeof relativePath !== "string" || !relativePath || isAbsolute(relativePath)) fail(`${label} must be a non-empty relative path`);
  const target = resolve(base, relativePath), rel = relative(resolve(base), target);
  if (rel === ".." || rel.startsWith(`..${sep}`) || isAbsolute(rel)) fail(`${label} escapes its allowed root`);
  return target;
}
function within(parent, child) { const rel = relative(resolve(parent), resolve(child)); return rel === "" || (!rel.startsWith(`..${sep}`) && rel !== ".." && !isAbsolute(rel)); }
function assertUnlinkedPath(path, label) {
  const absolute = resolve(path), parsed = parse(absolute);
  let cursor = parsed.root;
  for (const segment of absolute.slice(parsed.root.length).split(sep).filter(Boolean)) {
    cursor = resolve(cursor, segment);
    try {
      if (lstatSync(cursor).isSymbolicLink()) fail(`${label} contains a symbolic link or junction: ${cursor}`);
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
  }
  return absolute;
}

export function compilerCodeFingerprint() {
  const folder = dirname(fileURLToPath(import.meta.url));
  return sha(TOOL_FILES.map(name => `${name}\0${readFileSync(resolve(folder, name))}`).join("\0"));
}

function validateLineage(recipe) {
  for (const view of ["east", "west", "south", "north"]) {
    const item = recipe.lineage?.[view];
    if (!item) fail(`lineage.${view} is required`);
    if (item.kind === "independent") {
      if (!item.sourcePath || !/^[a-f0-9]{64}$/.test(item.sourceSha256 ?? "") || !item.acceptanceState) fail(`lineage.${view} independent source path/hash/acceptanceState required`);
    } else if (item.kind === "reflected") {
      if (item.approved !== true || !["east", "west", "south", "north"].includes(item.fromView)) fail(`lineage.${view} reflection must be explicitly approved with a source view`);
      if (canonicalJson(item.phasePermutation) !== canonicalJson(HALF_CYCLE)) fail(`lineage.${view} reflection requires the shared half-cycle permutation`);
      const opposite = view === "east" ? "west" : view === "west" ? "east" : null;
      if (!opposite || item.fromView !== opposite) fail(`lineage.${view} reflection is allowed only from the opposite lateral view`);
    } else fail(`lineage.${view}.kind must be independent or reflected`);
  }
  for (const view of ["east", "west"]) if (recipe.lineage[view].kind === "reflected" && recipe.lineage[recipe.lineage[view].fromView]?.kind !== "independent") fail(`lineage.${view} reflection requires a grounded independent opposite source`);
}

function validateDonorContract(contract) {
  if (contract == null) return;
  if (contract.status !== "declared_unverified_input" || !Array.isArray(contract.pieces) || contract.pieces.length === 0) fail("donorContract must be declared_unverified_input with pieces");
  const keys = new Set();
  for (const [index, piece] of contract.pieces.entries()) {
    safeKey(piece.key, `donorContract.pieces[${index}].key`);
    if (keys.has(piece.key)) fail(`duplicate donor piece ${piece.key}`); keys.add(piece.key);
    if (!piece.sourcePath || !/^[a-f0-9]{64}$/.test(piece.sourceSha256 ?? "")) fail(`donor ${piece.key} requires declared source path/hash`);
    if (![piece.crop?.x, piece.crop?.y, piece.crop?.width, piece.crop?.height, piece.pivot?.x, piece.pivot?.y].every(Number.isFinite) || piece.crop.width <= 0 || piece.crop.height <= 0) fail(`donor ${piece.key} requires finite crop and crop-local pivot`);
    if (piece.pivot.x < 0 || piece.pivot.y < 0 || piece.pivot.x > piece.crop.width || piece.pivot.y > piece.crop.height) fail(`donor ${piece.key} pivot is outside crop`);
    if (!piece.overlapPolicy || canonicalJson(piece.permittedRigidTransforms) !== canonicalJson(["translate", "rotate"])) fail(`donor ${piece.key} must declare overlap and translate/rotate-only transforms`);
  }
}

export function validateRecipe(recipe) {
  if (recipe?.contractId !== "shared-character-walk-v1" || recipe.contractVersion !== 1) fail("recipe must declare shared-character-walk-v1 version 1");
  if (recipe.status !== "complete_numeric_fit") fail("recipe status must be complete_numeric_fit; pending measurements cannot compile");
  safeKey(recipe.identity?.templateId, "identity.templateId"); safeKey(recipe.identity?.outputKey, "identity.outputKey");
  if (recipe.identity.templateId !== recipe.identity.outputKey) fail("identity/output key mismatch is not allowed");
  if (!Array.isArray(recipe.evidence) || recipe.evidence.length === 0) fail("measured/estimated evidence is required");
  for (const [index, item] of recipe.evidence.entries()) {
    if (!["measured", "estimated"].includes(item.classification) || !item.field || !item.source || !item.uncertainty) fail(`evidence[${index}] requires classification, field, source and uncertainty`);
  }
  if (!Array.isArray(recipe.references) || recipe.references.length < 2) fail("motion/reference dependencies are required");
  validateLineage(recipe);
  validateDonorContract(recipe.donorContract);
  const positivePaths = [
    "lateral.frame.width", "lateral.frame.height", "lateral.frame.axisX", "lateral.frame.floorY",
    "lateral.centers.headY", "lateral.centers.shoulderLeftX", "lateral.centers.shoulderRightX", "lateral.centers.shoulderY", "lateral.centers.chestY", "lateral.centers.hipX", "lateral.centers.hipY", "lateral.centers.ankleY",
    "lateral.foot.heelBack", "lateral.foot.toeForward",
    "lateral.envelope.headRadiusX", "lateral.envelope.headRadiusY", "lateral.envelope.torsoShoulderHalfDepth", "lateral.envelope.torsoChestHalfDepth", "lateral.envelope.torsoHipHalfDepth",
    "lateral.segmentLengths.upperArm", "lateral.segmentLengths.forearm", "lateral.segmentLengths.hand", "lateral.segmentLengths.thigh", "lateral.segmentLengths.shin",
    "lateral.motion.bobStride", "lateral.motion.bobTransition", "lateral.motion.strideReach", "lateral.motion.transitionReach", "lateral.motion.recoveryLift", "lateral.motion.passingLift", "lateral.motion.transitionLift", "lateral.motion.armStrideReach", "lateral.motion.armTransitionReach", "lateral.motion.armStrideDrop", "lateral.motion.armTransitionDrop", "lateral.motion.armPassingDrop",
    "northSouth.frame.width", "northSouth.frame.height", "northSouth.frame.axisX", "northSouth.frame.floorY",
    "northSouth.lanes.hipHalfWidth", "northSouth.lanes.kneeBendLateralPreference",
    "northSouth.segmentLengths3D.upperArm", "northSouth.segmentLengths3D.forearm", "northSouth.segmentLengths3D.hand", "northSouth.segmentLengths3D.thigh", "northSouth.segmentLengths3D.shin",
    "northSouth.body.shoulderHeightAboveHip", "northSouth.body.headHeightAboveHip", "northSouth.body.shoulderHalfWidth", "northSouth.body.wristHalfWidth", "northSouth.body.torsoShoulderHalfWidth", "northSouth.body.torsoChestHalfWidth", "northSouth.body.torsoHipHalfWidth", "northSouth.body.torsoChestHeightAboveHip", "northSouth.body.headRadiusLateral", "northSouth.body.headRadiusHeight",
    "northSouth.projection.verticalScale", "northSouth.projection.depthScale", "northSouth.projection.lateralScale",
    "northSouth.foot.ankleHeight", "northSouth.foot.toeForwardOffset", "northSouth.foot.heelHalfWidth", "northSouth.foot.toeHalfWidth",
    "northSouth.motion.strideReach", "northSouth.motion.transitionReach", "northSouth.motion.recoveryLift", "northSouth.motion.passingLift", "northSouth.motion.transitionLift", "northSouth.motion.armStrideReach", "northSouth.motion.armTransitionReach", "northSouth.motion.armStrideSpan", "northSouth.motion.armTransitionSpan", "northSouth.motion.armPassingSpan"
  ];
  const zeroAllowedPaths = ["lateral.motion.bobPassing", "northSouth.foot.contactForwardOffset", "northSouth.foot.liftedHeelRise", "northSouth.foot.liftedToeRise"];
  const signedPaths = ["northSouth.foot.heelForwardOffset"];
  const valueAt = path => path.split(".").reduce((value, key) => value?.[key], recipe);
  for (const path of positivePaths) finitePositive(valueAt(path), path);
  for (const path of zeroAllowedPaths) finitePositive(valueAt(path), path, true);
  for (const path of signedPaths) if (!Number.isFinite(valueAt(path))) fail(`${path} must be finite`);
  const checkedGroups = [["lateral.segmentLengths", recipe.lateral?.segmentLengths], ["lateral.envelope", recipe.lateral?.envelope], ["northSouth.segmentLengths3D", recipe.northSouth?.segmentLengths3D], ["northSouth.body", recipe.northSouth?.body], ["northSouth.projection", recipe.northSouth?.projection], ["northSouth.foot", recipe.northSouth?.foot]];
  for (const [prefix, group] of checkedGroups) {
    if (!group) fail("complete lateral and northSouth measurements are required");
    for (const [key, value] of Object.entries(group)) if (typeof value === "number" && key !== "heelForwardOffset" && !zeroAllowedPaths.includes(`${prefix}.${key}`)) finitePositive(value, `${prefix}.${key}`, false);
    if (typeof group.heelForwardOffset === "number" && !Number.isFinite(group.heelForwardOffset)) fail("heelForwardOffset must be finite");
  }
  for (const name of ["east", "west"]) validateRegistration(recipe.lateral.registration?.[name], `lateral.${name}`);
  for (const name of ["south", "north"]) validateRegistration(recipe.northSouth.registration?.[name], `northSouth.${name}`);
  return recipe;
}
function validateRegistration(registration, label) {
  if (!registration) fail(`${label} registration required`);
  for (const key of ["scale", "sourceAxisX", "sourceFloorY", "sourceWidth", "sourceHeight"]) finitePositive(registration[key], `${label}.${key}`);
}

function verifyReferences(recipe, repositoryRoot) {
  return recipe.references.map((reference, index) => {
    const path = safeResolve(repositoryRoot, reference.path, `references[${index}].path`);
    assertUnlinkedPath(path, `references[${index}].path`);
    if (!existsSync(path)) fail(`missing reference ${reference.path}`);
    const actual = sha(readFileSync(path));
    if (actual !== reference.sha256) fail(`reference hash mismatch for ${reference.path}`);
    return { path: reference.path, sha256: actual, role: reference.role };
  });
}
function pointBounds(target) {
  const points = [];
  const visit = value => {
    if (Array.isArray(value)) return value.forEach(visit);
    if (!value || typeof value !== "object") return;
    if (Number.isFinite(value.x) && Number.isFinite(value.y)) points.push(value);
    else Object.values(value).forEach(visit);
  };
  const frame = target.view === "east" || target.view === "west" ? target.geometry : target.geometry.frame;
  visit(frame.joints); visit(frame.torso); visit(frame.body?.torso);
  const head = frame.headEnvelope ?? frame.body?.headEnvelope;
  if (head) points.push({ x: head.center.x - head.radiusX, y: head.center.y - head.radiusY }, { x: head.center.x + head.radiusX, y: head.center.y + head.radiusY });
  return points;
}
function validateGeometry(recipe, targets) {
  if (targets.length !== 32 || new Set(targets.map(target => target.outputKey)).size !== 32) fail("compiler must produce 32 unique phase/view targets");
  for (const target of targets) {
    const frame = target.view === "east" || target.view === "west" ? recipe.lateral.frame : recipe.northSouth.frame;
    for (const point of pointBounds(target)) if (!Number.isFinite(point.x) || !Number.isFinite(point.y) || point.x < 0 || point.x > frame.width || point.y < 0 || point.y > frame.height) fail(`${target.outputKey} geometry outside ${frame.width}x${frame.height} frame`);
    if (target.view === "south" || target.view === "north") {
      const widthScale = recipe.northSouth.projection.lateralScale;
      for (const side of ["left", "right"]) for (const [part, halfWidth] of [["heel", recipe.northSouth.foot.heelHalfWidth], ["toe", recipe.northSouth.foot.toeHalfWidth]]) {
        const point = target.geometry.frame.joints[side][part], projectedHalfWidth = halfWidth * widthScale;
        if (point.x - projectedHalfWidth < 0 || point.x + projectedHalfWidth > frame.width) fail(`${target.outputKey} ${side} ${part} sole outside ${frame.width}x${frame.height} frame`);
      }
    }
    const joints = target.view === "east" || target.view === "west" ? target.geometry.joints : target.geometry.latent.joints;
    const lengths = target.view === "east" || target.view === "west" ? recipe.lateral.segmentLengths : recipe.northSouth.segmentLengths3D;
    const distance = target.view === "east" || target.view === "west" ? distance2 : distance3;
    for (const side of ["left", "right"]) {
      if (Math.abs(distance(joints[side].hip, joints[side].knee) - lengths.thigh) > 0.002 || Math.abs(distance(joints[side].knee, joints[side].ankle) - lengths.shin) > 0.002) fail(`${target.outputKey} ${side} leg length invariant failed`);
      if (Math.abs(distance(joints[side].shoulder, joints[side].elbow) - lengths.upperArm) > 0.002 || Math.abs(distance(joints[side].elbow, joints[side].wrist) - lengths.forearm) > 0.002 || Math.abs(distance(joints[side].wrist, joints[side].hand) - lengths.hand) > 0.002) fail(`${target.outputKey} ${side} arm length invariant failed`);
    }
    if ((target.phaseId === "03" || target.phaseId === "07")) {
      const support = target.phaseId === "03" ? "right" : "left";
      const supportLift = target.view === "east" || target.view === "west" ? joints[support].footLift : joints[support].latentFootLift;
      if (!joints[support].support || supportLift !== 0) fail(`${target.outputKey} support semantics failed`);
      if (Math.abs(distance(joints[support].hip, joints[support].ankle) - lengths.thigh - lengths.shin) > 0.003) fail(`${target.outputKey} support leg is not straight`);
    }
  }
}

export function compileRecipe(recipe, { repositoryRoot, codeFingerprint = compilerCodeFingerprint() }) {
  validateRecipe(recipe);
  const references = verifyReferences(recipe, repositoryRoot);
  const recipeHash = sha(canonicalJson(recipe));
  const dependencyFingerprint = sha(canonicalJson({ recipeHash, references, codeFingerprint }));
  const targets = [...compileLateral(recipe), ...compileNorthSouth(recipe)].sort((a, b) => a.outputKey.localeCompare(b.outputKey));
  validateGeometry(recipe, targets);
  return {
    schemaVersion: 1, contractId: "shared-character-walk-v1", contractVersion: 1,
    status: "authoring_target_pending_raster_review", outputClass: "target_only",
    identity: recipe.identity, dependencyFingerprint, dependencies: { recipeHash, references, codeFingerprint },
    sourceLineageVerification: { status: "declared_not_read_by_numeric_tool", responsibility: "GS-010 must verify actual source and donor image bytes before raster composition", lineage: recipe.lineage },
    phaseContract: { countPerView: 8, viewCount: 4, targetCount: 32, normalizedIntervals: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875], reviewFrameMilliseconds: 180, reviewLoopMilliseconds: 1440 },
    limitations: ["No raster was read, generated or reviewed.", "Targets do not establish runtime integration, artwork completion or owner approval."],
    targets,
  };
}

function outputPathFor(compiled, outputRoot) { return resolve(outputRoot, compiled.identity.outputKey, compiled.dependencyFingerprint, "targets.json"); }
function assertOutputSafety(outputRoot, inputPaths) {
  assertUnlinkedPath(outputRoot, "output root");
  for (const input of inputPaths) if (within(outputRoot, input) || resolve(outputRoot) === resolve(input)) fail("output root may not contain or overwrite an input/reference path");
}
function writeImmutable(path, bytes) {
  assertUnlinkedPath(path, "output path");
  assertUnlinkedPath(`${path}.partial`, "partial output path");
  if (existsSync(path)) {
    if (readFileSync(path, "utf8") !== bytes) fail(`tampered immutable output: ${path}`);
    if (existsSync(`${path}.partial`)) rmSync(`${path}.partial`);
    return "reused";
  }
  mkdirSync(dirname(path), { recursive: true });
  assertUnlinkedPath(dirname(path), "output directory");
  assertUnlinkedPath(path, "output path");
  const partial = `${path}.partial`;
  assertUnlinkedPath(partial, "partial output path");
  writeFileSync(partial, bytes);
  renameSync(partial, path);
  return "written";
}
export function compileRecipeFile(recipePath, { repositoryRoot, outputRoot, codeFingerprint }) {
  const absoluteRecipe = assertUnlinkedPath(resolve(recipePath), "recipe path");
  const recipe = JSON.parse(readFileSync(absoluteRecipe, "utf8"));
  assertOutputSafety(outputRoot, [absoluteRecipe, ...recipe.references.map((reference, index) => safeResolve(repositoryRoot, reference.path, `references[${index}].path`))]);
  const compiled = compileRecipe(recipe, { repositoryRoot, codeFingerprint });
  const path = outputPathFor(compiled, outputRoot), disposition = writeImmutable(path, canonicalJson(compiled));
  return { identityKey: recipe.identity.templateId, outputKey: recipe.identity.outputKey, path, dependencyFingerprint: compiled.dependencyFingerprint, disposition, targetCount: compiled.targets.length };
}
export function checkRecipeFile(recipePath, options) {
  const absoluteRecipe = assertUnlinkedPath(resolve(recipePath), "recipe path");
  const recipe = JSON.parse(readFileSync(absoluteRecipe, "utf8"));
  const compiled = compileRecipe(recipe, options), path = outputPathFor(compiled, options.outputRoot);
  assertOutputSafety(options.outputRoot, [absoluteRecipe, ...recipe.references.map((reference, index) => safeResolve(options.repositoryRoot, reference.path, `references[${index}].path`))]);
  assertUnlinkedPath(path, "output path"); assertUnlinkedPath(`${path}.partial`, "partial output path");
  if (!existsSync(path)) fail(`missing or stale output: ${path}`);
  if (readFileSync(path, "utf8") !== canonicalJson(compiled)) fail(`tampered output: ${path}`);
  if (existsSync(`${path}.partial`)) fail(`partial interrupted output remains: ${path}.partial`);
  return { identityKey: recipe.identity.templateId, path, dependencyFingerprint: compiled.dependencyFingerprint, status: "verified", targetCount: 32 };
}

export function runBatchFile(manifestPath, { repositoryRoot, outputRoot, selectedKeys, codeFingerprint, interruptAfter }) {
  const absoluteManifest = assertUnlinkedPath(resolve(manifestPath), "manifest path"), manifest = JSON.parse(readFileSync(absoluteManifest, "utf8"));
  assertOutputSafety(outputRoot, [absoluteManifest]);
  safeKey(manifest.batchKey, "batchKey");
  const identities = new Set(), outputs = new Set();
  for (const [index, member] of manifest.members.entries()) {
    safeKey(member.identityKey, `members[${index}].identityKey`); safeKey(member.outputKey, `members[${index}].outputKey`);
    if (identities.has(member.identityKey)) fail(`duplicate identity key in batch: ${member.identityKey}`);
    if (outputs.has(member.outputKey)) fail(`duplicate output key in batch: ${member.outputKey}`);
    identities.add(member.identityKey); outputs.add(member.outputKey);
    if (!["ready", "pending_measurement"].includes(member.status)) fail(`invalid member status for ${member.identityKey}`);
    if (member.status === "ready" && !member.recipe) fail(`ready member ${member.identityKey} has no recipe`);
    if (member.status === "pending_measurement" && member.recipe) fail(`pending member ${member.identityKey} must not claim a recipe`);
    if (member.status === "pending_measurement" && (!Array.isArray(member.blockers) || member.blockers.length === 0)) fail(`pending member ${member.identityKey} requires explicit measurement blockers`);
  }
  const selected = selectedKeys?.length ? new Set(selectedKeys) : identities;
  for (const key of selected) if (!identities.has(key)) fail(`selected identity ${key} is outside batch ${manifest.batchKey}`);
  const resolvedCodeFingerprint = codeFingerprint ?? compilerCodeFingerprint();
  const results = [], pending = [];
  for (const member of manifest.members) {
    if (!selected.has(member.identityKey)) continue;
    if (member.status === "pending_measurement") { pending.push({ identityKey: member.identityKey, outputKey: member.outputKey, blockers: member.blockers }); continue; }
    const recipePath = assertUnlinkedPath(safeResolve(repositoryRoot, member.recipe, `${member.identityKey}.recipe`), `${member.identityKey}.recipe`);
    const recipe = JSON.parse(readFileSync(recipePath, "utf8"));
    if (recipe.identity.templateId !== member.identityKey || recipe.identity.outputKey !== member.outputKey) fail(`manifest/recipe identity mismatch for ${member.identityKey}`);
    const compiledResult = compileRecipeFile(recipePath, { repositoryRoot, outputRoot, codeFingerprint: resolvedCodeFingerprint });
    results.push({ ...compiledResult, path: relative(outputRoot, compiledResult.path).split(sep).join("/") });
    if (interruptAfter && results.length >= interruptAfter) fail(`simulated interruption after ${interruptAfter} compiled member(s)`);
  }
  const stableResults = results.map(({ disposition, ...result }) => result);
  const summary = { schemaVersion: 1, batchKey: manifest.batchKey, status: pending.length ? "measurement_blocked" : "targets_compiled_pending_raster_review", outputClass: "target_only", compilerCodeFingerprint: resolvedCodeFingerprint, selectedKeys: [...selected].sort(), compiled: stableResults, pending, counts: { selected: selected.size, compiled: results.length, pending: pending.length, targets: results.reduce((sum, item) => sum + item.targetCount, 0) }, timing: { localToolMilliseconds: null, unmeasuredManualAndRasterWork: "not measured; no art work was performed" } };
  const fingerprint = sha(canonicalJson({ manifest: sha(readFileSync(absoluteManifest)), compilerCodeFingerprint: resolvedCodeFingerprint, selected: [...selected].sort(), compiled: stableResults.map(item => item.dependencyFingerprint), pending }));
  const path = resolve(outputRoot, "worker-batches", manifest.batchKey, fingerprint, "summary.json");
  writeImmutable(path, canonicalJson(summary));
  return { ...summary, invocationDispositions: results.map(item => ({ identityKey: item.identityKey, disposition: item.disposition })), path, fingerprint };
}

export function clearPartialForSafeRerun(path) { assertUnlinkedPath(path, "partial output path"); if (existsSync(path) && path.endsWith(".partial")) rmSync(path); }
