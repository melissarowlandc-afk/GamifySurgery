import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { createInitialGameState, deserializeGameState, serializeGameState } from "@gamify-surgery/game-domain";
import { assessCloudCodecCapacity, loadCloudBaselineImport, prepareCloudBaselineImport } from "./codec";
import { CLOUD_GAME_FIELD_OWNERSHIP } from "./codecOwnership";
import { codecTestCampaign, reorderedStoredText, testTextReceipt } from "./codecTestSupport";

const fixtureRoot = new URL("../../../../../tests/fixtures/", import.meta.url);
const legacy = JSON.parse(readFileSync(new URL("level-five-legacy-behavior-20261012.json", fixtureRoot), "utf8")) as {
  rows: Array<{ level: number; serializedInput: string; after: unknown }>;
};
const measured: Array<{ name: string; source: string; file: string; hash: string; fileBytes: number }> = [];
for (const file of ["level-four-legacy-pre-m3.json", "level-five-economy-checkpoint-20261012.json",
  "level-five-integration-checkpoints-20261012.json"]) {
  const bytes = readFileSync(new URL(file, fixtureRoot)), parsed = JSON.parse(bytes.toString("utf8"));
  const hash = createHash("sha256").update(bytes).digest("hex");
  const states = parsed.schemaVersion ? [[file, parsed]] : Object.entries(parsed);
  for (const [name, state] of states) measured.push({ name, source: JSON.stringify(state), file, hash, fileBytes: bytes.length });
}

async function roundTrip(source: string, name: string) {
  const campaign = codecTestCampaign(source), operationId = `import.synthetic.${name}`;
  const prepared = await prepareCloudBaselineImport({ serializedState: source, campaign, operationId });
  const snapshot = testTextReceipt(reorderedStoredText(JSON.parse(prepared.snapshot.text)));
  const evidence = testTextReceipt(reorderedStoredText(JSON.parse(prepared.evidence.text)));
  const loaded = await loadCloudBaselineImport({ snapshot: { ...snapshot, revision: "9007199254740993" }, evidence,
    expectedCampaignId: campaign.campaignId, expectedRevision: "9007199254740993",
    expectedBaselineId: JSON.parse(prepared.evidence.text).baselineId });
  // Whole logical states: all frozen content/order, FSRS/timezones, money, RNG
  // inputs/counters, inspections, operations and retired summaries are compared.
  expect(JSON.parse(serializeGameState(loaded.state))).toEqual(JSON.parse(serializeGameState(deserializeGameState(source))));
  expect(loaded.campaign).toEqual(campaign);
  expect(loaded.baseline.sourceState).toEqual(JSON.parse(source));
  expect(prepared.sourceRecovery.text).toBe(source);
  expect(prepared.sourceRecovery).toEqual(testTextReceipt(source));
  expect(loaded.baseline.historicalQuestionCountCredit).toBe(0);
  expect(loaded.liveEvidenceReady).toBe(false);
  const state = JSON.parse(serializeGameState(loaded.state));
  expect(Object.keys(state).every(key => Object.hasOwn(CLOUD_GAME_FIELD_OWNERSHIP, key))).toBe(true);
  return { prepared, snapshot, evidence, loaded };
}

describe("B2.1 complete fixture round trips and capacity receipts", () => {
  it.each(measured)("preserves every available logical field in $name", async fixture => {
    const { prepared, snapshot, evidence } = await roundTrip(fixture.source, fixture.name);
    const storedCapacity = assessCloudCodecCapacity({ ...prepared.sizes, snapshotBytes: snapshot.utf8Bytes,
      baselineEvidenceBytes: evidence.utf8Bytes });
    process.stdout.write(`B2.1 MEASURE ${JSON.stringify({ fixture: fixture.name, file: fixture.file,
      fileBytes: fixture.fileBytes, fileSha256: fixture.hash, sourceBytes: Buffer.byteLength(fixture.source),
      ...prepared.sizes, reorderedSnapshotBytes: snapshot.utf8Bytes, reorderedEvidenceBytes: evidence.utf8Bytes,
      withinTarget: storedCapacity.withinSnapshotTarget, capacityFailures: storedCapacity.failures,
      migrationFields: prepared.migration.changedFields })}\n`);
  }, 30_000);

  it.each([0, 1, 2, 3, 4, 5] as const)("round-trips a fresh synthetic facility at level %i without creating earned evidence", async level => {
    const state = createInitialGameState(undefined, { campaignId: `campaign.codec.fresh.${level}`,
      campaignSeed: `codec.fresh.${level}`, createdAtRealMs: 0 });
    state.facilityLevel = level;
    const { loaded } = await roundTrip(serializeGameState(state), `fresh.${level}`);
    expect(loaded.state.levelFive).toBeUndefined();
    expect(loaded.state.levelFourCompletion).toBeUndefined();
    expect(Object.values(loaded.state.learningHistories).every(history => history.reviews.length === 0)).toBe(true);
  });

  it.each([1, 2, 3, 4, 5, 6, 7, 8, 9])("preserves the original and the public migration for schema %i", async schemaVersion => {
    // Compatibility fixtures follow the existing domain tests' version-downgrade
    // method; these are not claimed to be historical production saves.
    const old = JSON.parse(serializeGameState(createInitialGameState(undefined, {
      campaignId: "campaign.codec.legacy", campaignSeed: "codec.legacy", createdAtRealMs: 0,
    })));
    old.schemaVersion = schemaVersion;
    if (schemaVersion === 1) {
      delete old.campaignId; delete old.campaignSeed; delete old.learningHistories;
    }
    if (schemaVersion === 3) delete old.founder;
    const { loaded, prepared } = await roundTrip(JSON.stringify(old), `schema.${schemaVersion}`);
    expect(loaded.state.schemaVersion).toBe(9);
    expect(loaded.baseline.sourceSchemaVersion).toBe(schemaVersion);
    expect(loaded.baseline.legacyReviewProjection).toBe(schemaVersion === 1
      ? "domain-v1-reconstruction-not-observed-evidence" : "not-reconstructed");
    expect(prepared.migration.sourceSchemaVersion).toBe(schemaVersion);
  });

  it.each(legacy.rows.flatMap(row => [5, 6, 7, 8, 9].map(schema => ({ ...row, schema }))))(
    "round-trips the existing pre-M9 synthetic fixture at level $level/schema $schema", async row => {
      const state = JSON.parse(row.serializedInput);
      state.schemaVersion = row.schema;
      await roundTrip(JSON.stringify(state), `pre-m9.level.${row.level}.schema.${row.schema}`);
    });

  it.each(legacy.rows)("round-trips the existing pre-M9 next-120-minute state at level $level", async row => {
    await roundTrip(JSON.stringify(row.after), `pre-m9.after.${row.level}`);
  });

  it("round-trips the concurrent domain worker's serialized garden/offsite regression fixture through the public API", async () => {
    const source = readFileSync(new URL("../../../../../packages/game-domain/tests/fixtures/level-five-garden-offsite-overlap-20261017.json", import.meta.url), "utf8");
    await roundTrip(source, "garden.offsite.overlap");
  });

  it("keeps actual legacy review intents while distinguishing the domain's v1 reconstructed projection", async () => {
    const full = JSON.parse(readFileSync(new URL("level-five-economy-checkpoint-20261012.json", fixtureRoot), "utf8"));
    const encounter = Object.values(full.encounters).find(value => (value as { answers: unknown[] }).answers.length > 0 &&
      full.reviewIntents.some((intent: { encounterId: string }) => intent.encounterId === (value as { id: string }).id)) as { id: string };
    const intent = full.reviewIntents.find((item: { encounterId: string }) => item.encounterId === encounter.id);
    // Use recorded synthetic facts only. Version 1 had no campaign ID or cards.
    const old = { schemaVersion: 1, clinicalReleaseId: full.clinicalReleaseId, balanceReleaseId: full.balanceReleaseId,
      facilityTick: full.facilityTick, paused: true, cash: full.cash,
      encounters: { [encounter.id]: full.encounters[encounter.id] }, reviewIntents: [intent] };
    const { loaded } = await roundTrip(JSON.stringify(old), "legacy.v1.recorded-intent");
    expect(loaded.baseline.sourceState).not.toHaveProperty("learningHistories");
    expect(loaded.baseline.sourceState.reviewIntents).toEqual([intent]);
    expect(Object.values(loaded.state.learningHistories).flatMap(history => history.reviews).length).toBeGreaterThan(0);
    expect(loaded.baseline.legacyReviewProjection).toBe("domain-v1-reconstruction-not-observed-evidence");
  });
});
