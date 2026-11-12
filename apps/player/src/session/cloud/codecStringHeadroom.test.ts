import { afterAll, describe, expect, it } from "vitest";
import { QUESTION_FLAGS_PRE_REVISION_RELEASE } from "@gamify-surgery/clinical-content";
import { applyGameEvidenceCommand, createInitialGameState, deserializeGameState, PROTOTYPE_DOMAIN_CONTEXT, serializeGameState,
  type DomainContext, type GameState } from "@gamify-surgery/game-domain";
import { CLOUD_JSON_LIMITS, logicalJsonText, utf8Bytes } from "./codecJson";
import { encodeCloudSnapshot, loadCloudSnapshot, prepareSnapshotImport } from "./snapshotCodec";
import { codecTestCampaign } from "./codecTestSupport";
import { decompressCloudText } from "./codecCompression";
import { encodeCloudEvidenceCheckpoint, loadCloudEvidenceCheckpoint, prepareCloudEvidenceImport } from "./codecEvidence";
import { importSeparateCloudCampaign } from "./importCampaigns";
import { MemoryCloudEntryStore } from "./entryStorage";
import { FakeCloudServer } from "./fakeTransport";
import { runCloudCodecTask } from "./codecTasks";
import type { CloudConfirmed } from "./transport";
import { readFileSync, writeFileSync } from "node:fs";
import { CLOUD_CAPACITY_LIMITS } from "./codec";

/** Full-bank guard, extended from the release-only headroom investigation.
 * The original retirement fixture passed sourceRecovery (including
 * .text) as CloudSourceProvenance; codecEvidence.ts:74 embeds that extra property
 * in header.source. Production imports select the three provenance fields.
 * Keep the accidental wide argument here to reproduce the exact string limit,
 * alongside real import/open/branch routes that must retain generous headroom.
 * Never print saved strings, question prose, answers or personal data. */

type StringSize = { path: string; bytes: number };
const measurements: unknown[] = [];
const measure = (kind: string, value: unknown) => { measurements.push({ kind, ...value as object }); console.info(kind, JSON.stringify(value)); };
afterAll(() => {
  // Optional synthetic technical-size artifact; no save text, clinical prose,
  // answers or patient details are written. Normal test runs write no files.
  if (process.env.GAMIFY_CODEC_HEADROOM_REPORT) writeFileSync(process.env.GAMIFY_CODEC_HEADROOM_REPORT, JSON.stringify(measurements, null, 2) + "\n", "utf8");
});
function largestStrings(value: unknown): StringSize[] {
  const found: StringSize[] = [];
  function walk(current: unknown, path: string) {
    if (typeof current === "string") found.push({ path, bytes: utf8Bytes(current) });
    else if (Array.isArray(current)) current.forEach((child, index) => walk(child, `${path}[${index}]`));
    else if (current && typeof current === "object") for (const [key, child] of Object.entries(current)) walk(child, `${path}.${key}`);
  }
  walk(value, "$");
  return found.sort((a, b) => b.bytes - a.bytes || a.path.localeCompare(b.path));
}

type Scenario = "fresh" | "12-retired" | "12-retired-24-active";
function fixture(context: DomainContext, scenario: Scenario): GameState {
  const state = createInitialGameState(context, { campaignId: "codec.headroom.synthetic", campaignSeed: "codec.headroom", createdAtRealMs: 0 });
  if (scenario === "fresh") return state;
  const template = Object.values(state.encounters)[0]!;
  state.encounters = {};
  // Use actual shipped frozen cases, prioritizing the longest strings. This
  // bounds a crowded clinic more conservatively than repeating a tiny tutorial.
  const cases = scenario === "12-retired-24-active" ? context.clinicalRelease.cases
    .map(entry => ({ entry, largest: largestStrings(entry)[0]!.bytes }))
    .sort((a, b) => b.largest - a.largest || a.entry.id.localeCompare(b.entry.id)).slice(0, 24).map(row => row.entry) : [];
  for (let index = 0; index < 12 + cases.length; index++) {
    const id = `codec.headroom.${index}`, resolved = index < 12;
    const encounter = { ...structuredClone(template), id, arrivalClass: "routine" as const,
      ...(resolved ? { lifecycle: "resolved", patientLocation: null, patientMovement: null, pendingResult: null,
        resolvedAtFacilityTick: 0, resolutionReason: "completed", finalPatientSatisfaction: 100 } as const : {}) };
    if (!resolved) {
      encounter.frozenCase = structuredClone(cases[index - 12]!);
      encounter.currentNodeIndex = 0;
      encounter.steps = encounter.frozenCase.decisionNodes.map((node, nodeIndex) => ({ nodeIndex, decisionNodeId: node.id,
        questionVariantId: node.questionVariantId, primaryConceptId: node.primaryConceptId,
        status: nodeIndex === 0 ? "action_required" : "locked", answer: null, result: null }));
    }
    state.encounters[id] = encounter;
  }
  state.openChartEncounterId = null; state.attendedEncounterId = null;
  state.paused = false; state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER; state.serviceAppointmentsEnabled = false;
  // Assign each substituted frozen case its compatible patient identity using
  // the public loader, instead of retaining the tutorial patient's appearance.
  return deserializeGameState(serializeGameState(state), context);
}

const contexts = [
  ["new-default", PROTOTYPE_DOMAIN_CONTEXT],
  ["historical-control", { ...PROTOTYPE_DOMAIN_CONTEXT, clinicalRelease: QUESTION_FLAGS_PRE_REVISION_RELEASE }],
] as const;
const sameState = (state: GameState) => logicalJsonText(JSON.parse(serializeGameState(state)));
function stateDifferences(actual: GameState, expected: GameState): string[] {
  const differences: string[] = [];
  function visit(a: unknown, b: unknown, path: string) {
    if (Object.is(a, b) || differences.length === 20) return;
    if (a && b && typeof a === "object" && typeof b === "object" && Array.isArray(a) === Array.isArray(b)) {
      const left = a as Record<string, unknown>, right = b as Record<string, unknown>;
      for (const key of new Set([...Object.keys(left), ...Object.keys(right)])) {
        if (Object.hasOwn(left, key) !== Object.hasOwn(right, key)) differences.push(`${path}.${key} (presence)`);
        else visit(left[key], right[key], `${path}.${key}`);
        if (differences.length >= 20) break;
      }
    } else differences.push(path);
  }
  visit(JSON.parse(sameState(actual)), JSON.parse(sameState(expected)), "$");
  return differences;
}

describe("full-bank codec string headroom", () => {
  for (const [release, context] of contexts) for (const scenario of ["fresh", "12-retired", "12-retired-24-active"] as const) {
    it(`${release}: ${scenario} preserves snapshot and production format-two headroom`, async () => {
      const state = fixture(context, scenario), text = serializeGameState(state), raw = JSON.parse(text), campaign = codecTestCampaign(text);
      const legacy = await prepareCloudEvidenceImport({ serializedState: text, campaign, operationId: "headroom.import" }, context);
      const checkpoint = scenario === "fresh" ? legacy.checkpoint : applyGameEvidenceCommand(legacy.checkpoint,
        { type: "ADVANCE_TICK", operationId: "headroom.retire", advancedAtRealMs: 60_000 }, context).checkpoint;
      if (scenario !== "fresh") expect(checkpoint.evidence.records.some(row => row.kind === "retired-encounter")).toBe(true);
      const expected = await loadCloudEvidenceCheckpoint({ snapshot: legacy.snapshot, evidence: legacy.packedEvidence,
        revision: "1", expectedRevision: "1", expectedCampaignId: campaign.campaignId, expectedBaselineId: legacy.envelope.baselineId });
      const header = JSON.parse(await decompressCloudText(legacy.packedEvidence.header));
      expect(Object.keys(header.source).sort()).toEqual(["schemaVersion", "sha256", "utf8Bytes"]);
      expect(header.source).not.toHaveProperty("text");
      expect(largestStrings(header)[0]!.bytes).toBeLessThan(CLOUD_JSON_LIMITS.maxStringBytes * 0.8);

      // Reproduce the accidental fixture argument. This extra string is the
      // complete raw save, not a catalog digest or a new evidence requirement.
      const wideHeader = { ...header, source: legacy.sourceRecovery }, accidental = largestStrings(wideHeader)[0]!;
      expect(accidental.path).toBe("$.source.text");
      expect(accidental.bytes).toBe(utf8Bytes(text));
      expect(logicalJsonText(JSON.parse(legacy.sourceRecovery.text)) === logicalJsonText(raw)).toBe(true);
      expect(Object.hasOwn(raw, "clinicalRelease")).toBe(false);
      const wideEncode = encodeCloudEvidenceCheckpoint({ checkpoint, campaign, operationId: "headroom.wide-source", expectedRevision: "1", source: legacy.sourceRecovery });
      if (accidental.bytes > CLOUD_JSON_LIMITS.maxStringBytes) {
        await expect(wideEncode).rejects.toMatchObject({ code: "json_structure", message: "JSON string exceeds the codec limit." });
      } else await expect(wideEncode).resolves.toHaveProperty("snapshot");

      const proper = await encodeCloudEvidenceCheckpoint({ checkpoint, campaign, operationId: "headroom.metadata-only", expectedRevision: "1", source: header.source });
      expect(largestStrings(JSON.parse(await decompressCloudText(proper.packedEvidence.header)))[0]!.bytes)
        .toBeLessThan(CLOUD_JSON_LIMITS.maxStringBytes * 0.8);

      const encoded = await encodeCloudSnapshot({ state, campaign,
        lineage: { branchId: "headroom.synthetic", sequence: 0, parents: [] } });
      const envelope = JSON.parse(await decompressCloudText(encoded.snapshot)), snapshot = largestStrings(envelope)[0]!;
      expect(snapshot.bytes).toBeLessThan(CLOUD_JSON_LIMITS.maxStringBytes * 0.8);
      const opened = await loadCloudSnapshot({ snapshot: encoded.snapshot, revision: "1", expectedRevision: "1", expectedCampaignId: campaign.campaignId });
      expect(stateDifferences(opened.state, state), "native snapshot round trip").toEqual([]);
      expect(encoded.evidence.records).toHaveLength(0);
      const imported = await prepareSnapshotImport({ serializedState: text, campaign, branchId: "headroom.local-import" });
      const importLoaded = await loadCloudSnapshot({ snapshot: imported.snapshot, revision: "1", expectedRevision: "1", expectedCampaignId: campaign.campaignId });
      measure("CODEC_HEADROOM", { release, scenario, concepts: context.clinicalRelease.concepts.length,
        cases: context.clinicalRelease.cases.length, accidentalField: accidental.path, accidentalStringBytes: accidental.bytes,
        accidentalHeadroomBytes: CLOUD_JSON_LIMITS.maxStringBytes - accidental.bytes,
        learningHistoriesBytes: utf8Bytes(JSON.stringify(raw.learningHistories)), encountersBytes: utf8Bytes(JSON.stringify(raw.encounters)),
        snapshotLargest: snapshot, snapshotHeadroomBytes: CLOUD_JSON_LIMITS.maxStringBytes - snapshot.bytes,
        snapshotBytes: encoded.sizes.snapshotRawBytes, snapshotStoredBytes: encoded.sizes.snapshotStoredBytes,
        properHeaderLargest: largestStrings(JSON.parse(await decompressCloudText(proper.packedEvidence.header)))[0],
        limit: CLOUD_JSON_LIMITS.maxStringBytes });
      expect(stateDifferences(importLoaded.state, expected.state), "current import vs legacy normalized input").toEqual([]);
    });
  }

  for (const snapshotSaves of [false, true]) {
    it(`real separate-campaign import keeps current progress with snapshotSaves=${snapshotSaves}`, async () => {
      const state = fixture(PROTOTYPE_DOMAIN_CONTEXT, "12-retired-24-active"), text = serializeGameState(state), campaign = codecTestCampaign(text);
      const prepared = await prepareCloudEvidenceImport({ serializedState: text, campaign, operationId: "headroom.branch-source" });
      const device: CloudConfirmed = { campaignId: state.campaignId, revision: "1", acceptedAtMs: 0,
        baselineId: prepared.envelope.baselineId, snapshot: prepared.snapshot, evidence: prepared.packedEvidence };
      const before = structuredClone(device), server = new FakeCloudServer();
      server.setAccess("headroom.account", { snapshotSaves });
      const result = await importSeparateCloudCampaign(device, server.transport("headroom.account"), new MemoryCloudEntryStore());
      expect(stateDifferences(result.verified.state, { ...state, campaignId: result.marker.campaignId })).toEqual([]);
      expect(JSON.stringify(device) === JSON.stringify(before)).toBe(true);
      expect(result.loaded.evidence.records.length === 0).toBe(snapshotSaves);
      if (!snapshotSaves) expect(logicalJsonText(JSON.parse(JSON.stringify(result.verified.checkpoint.evidence.records))) ===
        logicalJsonText(JSON.parse(JSON.stringify(prepared.checkpoint.evidence.records)))).toBe(true);
    });
  }

  it("converts a real legacy format-two head/recovery copy without embedding the raw source string", async () => {
    const state = fixture(PROTOTYPE_DOMAIN_CONTEXT, "12-retired-24-active"), text = serializeGameState(state), campaign = codecTestCampaign(text);
    const legacy = await prepareCloudEvidenceImport({ serializedState: text, campaign, operationId: "headroom.old-head" });
    const copy: CloudConfirmed = { campaignId: state.campaignId, revision: "1", acceptedAtMs: 0,
      baselineId: legacy.envelope.baselineId, snapshot: legacy.snapshot, evidence: legacy.packedEvidence };
    const converted = await runCloudCodecTask({ kind: "snapshotConvert", input: { copy } });
    const loaded = await loadCloudSnapshot({ ...converted, expectedRevision: converted.revision, expectedCampaignId: converted.campaignId });
    expect(converted.saveFormat).toBe(3); expect(converted.evidence.records).toHaveLength(0);
    expect(stateDifferences(loaded.state, state)).toEqual([]);
    expect(largestStrings(JSON.parse(await decompressCloudText(converted.snapshot)))[0]!.bytes)
      .toBeLessThan(CLOUD_JSON_LIMITS.maxStringBytes * 0.8);
  });

  it("the schema-one compatibility adapter also produces only a current snapshot", async () => {
    const raw = JSON.parse(serializeGameState(fixture(PROTOTYPE_DOMAIN_CONTEXT, "12-retired-24-active")));
    raw.schemaVersion = 1; delete raw.campaignId; delete raw.campaignSeed; delete raw.learningHistories;
    const text = JSON.stringify(raw), campaign = codecTestCampaign(text);
    const legacy = await prepareCloudEvidenceImport({ serializedState: text, campaign, operationId: "headroom.schema-one-control" });
    const expected = await loadCloudEvidenceCheckpoint({ snapshot: legacy.snapshot, evidence: legacy.packedEvidence,
      revision: "1", expectedRevision: "1", expectedCampaignId: campaign.campaignId, expectedBaselineId: legacy.envelope.baselineId });
    const imported = await prepareSnapshotImport({ serializedState: text, campaign, branchId: "headroom.schema-one" });
    const loaded = await loadCloudSnapshot({ snapshot: imported.snapshot, revision: "1", expectedRevision: "1", expectedCampaignId: campaign.campaignId });
    expect(stateDifferences(loaded.state, expected.state)).toEqual([]); expect(imported.evidence.records).toHaveLength(0);
    expect(largestStrings(JSON.parse(await decompressCloudText(imported.snapshot)))[0]!.bytes)
      .toBeLessThan(CLOUD_JSON_LIMITS.maxStringBytes * 0.8);
  });

  for (const name of ["integration-finish", "integration-lower-repeat"]) it(`full-bank Level 5 ${name} keeps snapshot/legacy headroom and every FSRS/frozen field`, async () => {
    const retained = JSON.parse(readFileSync(new URL("../../../../../tests/fixtures/level-five-integration-checkpoints-20261012.json", import.meta.url), "utf8")) as Record<string, unknown>;
    const source = JSON.stringify(retained[name]);
    const state = deserializeGameState(source, PROTOTYPE_DOMAIN_CONTEXT), text = serializeGameState(state), campaign = codecTestCampaign(text);
    const contexts = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease;
    // Use every currently shipped meaning without pinning the catalog to a
    // historical count or pruning retired history to make the fixture smaller.
    for (const concept of contexts.concepts) expect(state.learningHistories[concept.id], concept.id).toBeDefined();
    const legacy = await prepareCloudEvidenceImport({ serializedState: text, campaign, operationId: `headroom.level5.${name}` });
    const header = JSON.parse(await decompressCloudText(legacy.packedEvidence.header));
    expect(Object.keys(header.source).sort()).toEqual(["schemaVersion", "sha256", "utf8Bytes"]);
    const largestHeader = largestStrings(header)[0]!;
    expect(largestHeader.bytes).toBeLessThan(CLOUD_JSON_LIMITS.maxStringBytes * 0.8);
    const encoded = await encodeCloudSnapshot({ state, campaign, lineage: { branchId: `headroom.level5.${name}`, sequence: 0, parents: [] } });
    const envelope = JSON.parse(await decompressCloudText(encoded.snapshot)), largest = largestStrings(envelope)[0]!;
    expect(largest.bytes).toBeLessThan(CLOUD_JSON_LIMITS.maxStringBytes * 0.8);
    expect(encoded.sizes.decodedGameBytes).toBeLessThan(CLOUD_CAPACITY_LIMITS.snapshotCeilingBytes * 0.8);
    expect(encoded.evidence.records).toHaveLength(0);
    const opened = await loadCloudSnapshot({ snapshot: encoded.snapshot, revision: "1", expectedRevision: "1", expectedCampaignId: state.campaignId });
    expect(stateDifferences(opened.state, state), "whole Level 5 state including FSRS reviews/frozen encounters").toEqual([]);
    expect(opened.state.learningHistories).toEqual(state.learningHistories);
    expect(opened.state.encounters).toEqual(state.encounters);
    const oldCopy: CloudConfirmed = { campaignId: state.campaignId, revision: "1", acceptedAtMs: 0,
      baselineId: legacy.envelope.baselineId, snapshot: legacy.snapshot, evidence: legacy.packedEvidence };
    const converted = await runCloudCodecTask({ kind: "snapshotConvert", input: { copy: oldCopy } });
    const loaded = await loadCloudSnapshot({ ...converted, expectedRevision: converted.revision, expectedCampaignId: converted.campaignId });
    expect(converted.saveFormat).toBe(3); expect(converted.evidence.records).toHaveLength(0);
    expect(stateDifferences(loaded.state, state), "legacy Level 5 conversion").toEqual([]);
    measure("CODEC_LEVEL5_HEADROOM", { name, cases: contexts.cases.length, concepts: contexts.concepts.length,
      sourceBytes: utf8Bytes(source), currentStateBytes: utf8Bytes(text), snapshotBytes: encoded.sizes.snapshotRawBytes,
      snapshotStoredBytes: encoded.sizes.snapshotStoredBytes, largest, headroomBytes: CLOUD_JSON_LIMITS.maxStringBytes - largest.bytes,
      headerLargest: largestHeader, reviews: Object.values(state.learningHistories).reduce((sum, history) => sum + history.reviews.length, 0),
      encounters: Object.keys(state.encounters).length, limit: CLOUD_JSON_LIMITS.maxStringBytes });
  });
});
