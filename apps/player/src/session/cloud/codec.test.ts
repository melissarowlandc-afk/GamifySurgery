import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialGameState, deserializeGameState, serializeGameState } from "@gamify-surgery/game-domain";
import golden from "./codecGoldenVectors.json";
import {
  assessCloudCodecCapacity, assertCloudRevision, CLOUD_CAPACITY_LIMITS, loadCloudBaselineImport,
  prepareCloudBaselineImport, sha256Utf8, utf8Bytes, verifyCloudStoredText,
} from "./codec";
import { CLOUD_EVIDENCE_CONTRACT, CLOUD_PROFILE_FIELD_OWNERSHIP } from "./codecOwnership";
import { parseCodecJson, sameLogicalJson } from "./codecJson";
import { codecTestCampaign, testTextReceipt } from "./codecTestSupport";

afterEach(() => vi.unstubAllGlobals());

function sourceState() {
  return createInitialGameState(undefined, { campaignId: "campaign.codec.unit", campaignSeed: "codec.unit", createdAtRealMs: 0 });
}

async function preparedImport(source = serializeGameState(sourceState())) {
  return prepareCloudBaselineImport({ serializedState: source, campaign: codecTestCampaign(source), operationId: "import.codec.unit" });
}

async function loadInput() {
  const prepared = await preparedImport();
  return { snapshot: { ...prepared.snapshot, revision: "1" }, evidence: prepared.evidence,
    expectedCampaignId: prepared.request.campaignId, expectedRevision: "1",
    expectedBaselineId: JSON.parse(prepared.evidence.text).baselineId as string };
}

describe("B2.1 exact-byte JS/SQL golden contract", () => {
  it.each(golden.vectors)("verifies Unicode, precision, order and whitespace for $id", async vector => {
    expect(utf8Bytes(vector.inputText)).toBe(vector.inputUtf8Bytes);
    expect(utf8Bytes(vector.storedText)).toBe(vector.storedUtf8Bytes);
    expect(await sha256Utf8(vector.inputText)).toBe(vector.inputSha256);
    expect(await sha256Utf8(vector.storedText)).toBe(vector.storedSha256);
    expect(sameLogicalJson(parseCodecJson(vector.inputText), parseCodecJson(vector.storedText))).toBe(true);
    expect(vector.inputSha256).not.toBe(vector.storedSha256);
    await verifyCloudStoredText({ text: vector.storedText, sha256: vector.storedSha256, utf8Bytes: vector.storedUtf8Bytes });
  });

  it("pins every assertion in executable rollback-only SQL without claiming an SQL run", () => {
    const sql = readFileSync(new URL("./codecGoldenVectors.sql", import.meta.url), "utf8");
    expect(sql).toContain("ROLLBACK;");
    expect(sql).toContain("actual_text := (convert_from(input_bytes, 'UTF8')::jsonb)::text;");
    for (const vector of golden.vectors) {
      expect(sql).toContain(Buffer.from(vector.inputText, "utf8").toString("hex"));
      expect(sql).toContain(Buffer.from(vector.storedText, "utf8").toString("hex"));
      expect(sql).toContain(vector.inputSha256);
      expect(sql).toContain(vector.storedSha256);
    }
    expect(golden.sqlValidation).toBe("pending-manager-disposable-postgresql-run");
  });

  it("counts UTF-8 bytes instead of characters and never normalizes distinct Unicode", async () => {
    expect(utf8Bytes("🩺é")).toBe(6);
    expect(await sha256Utf8("é")).not.toBe(await sha256Utf8("é"));
  });

  it("fails closed when SHA-256 is unavailable", async () => {
    vi.stubGlobal("crypto", undefined);
    await expect(sha256Utf8("{}")).rejects.toMatchObject({ code: "crypto_unavailable" });
  });
});

describe("B2.1 bounded lossless JSON boundary", () => {
  it.each([
    "9007199254740993", "-9007199254740993", "1e400", "1e-400", "-0", "-0.0", "9007199254740990.5", "0.10000000000000001",
  ])("rejects the lossy numeric token %s before JSON.parse rounds it", token => {
    expect(() => parseCodecJson(`{"number":${token}}`)).toThrowError(expect.objectContaining({ code: "unsafe_number" }));
  });

  it.each(["9007199254740991", "1.2300", "0.0000001", "5e-324", "0.30000000000000004", "0e99"])("preserves the supported numeric token %s", token => {
    expect(parseCodecJson(token)).toBe(Number(token));
  });

  it.each(['"\\u0000"', '"\\ud800"', '"\\udfff"', '"\ud800"'])("rejects JSONB-incompatible Unicode %j", token => {
    expect(() => parseCodecJson(token)).toThrowError(expect.objectContaining({ code: "invalid_unicode" }));
  });

  it("rejects duplicate decoded keys rather than accepting JSONB's last-value rule", () => {
    expect(() => parseCodecJson('{"a":1,"\\u0061":2}')).toThrowError(expect.objectContaining({ code: "duplicate_key" }));
  });

  it.each(["{", "[1,]", '{"a":}', "true false", "01", '{"x":1,}', '"unterminated'])("rejects malformed JSON %s", text => {
    expect(() => parseCodecJson(text)).toThrowError(expect.objectContaining({ code: "invalid_json" }));
  });

  it("bounds total input, nesting, collection count, string size and node count", () => {
    expect(() => parseCodecJson(" ".repeat(6_000_001))).toThrowError(expect.objectContaining({ code: "json_size" }));
    expect(() => parseCodecJson("[".repeat(65) + "0" + "]".repeat(65))).toThrowError(expect.objectContaining({ code: "json_structure" }));
    expect(() => parseCodecJson(JSON.stringify(Array(50_001).fill(0)))).toThrowError(expect.objectContaining({ code: "json_structure" }));
    expect(() => parseCodecJson(JSON.stringify("é".repeat(131_073)))).toThrowError(expect.objectContaining({ code: "json_structure" }));
    expect(() => parseCodecJson(JSON.stringify(Array.from({ length: 7 }, () => Array(49_999).fill(0))))).toThrowError(expect.objectContaining({ code: "json_structure" }));
  });
});

describe("B2.1 baseline ownership, import identity and immutable request", () => {
  it("retains exact original bytes, metadata and immutable history without generating question-count receipts", async () => {
    const source = JSON.stringify(sourceState(), null, 2) + "\n";
    const prepared = await preparedImport(source);
    expect(prepared.sourceRecovery.text).toBe(source);
    expect(prepared.sourceRecovery).toEqual(testTextReceipt(source));
    expect(prepared.liveEvidenceReady).toBe(false);
    expect(prepared.blocker).toBe("domain-evidence-export-required");
    const baseline = JSON.parse(prepared.evidence.text);
    expect(baseline.sourceState).toEqual(JSON.parse(source));
    expect(baseline.historicalQuestionCountCredit).toBe(0);
    expect(baseline.historicalCoverage).toBe("available-local-data-only");
    expect(prepared.request.expectedRevision).toBe("0");
    expect(prepared.request).not.toHaveProperty("ownerId");
    expect(prepared.request).not.toHaveProperty("usageReceipts");
    expect(CLOUD_PROFILE_FIELD_OWNERSHIP.pendingUsageQuestions).toBe("device-only");
    expect(CLOUD_PROFILE_FIELD_OWNERSHIP.activeCampaignId).toBe("device-only");
    expect(CLOUD_EVIDENCE_CONTRACT.historicalQuestionCountCredit).toBe(0);
  });

  it("produces an identical retry only for the same full request and preserves every material field in its digest", async () => {
    const source = serializeGameState(sourceState()), campaign = codecTestCampaign(source);
    const input = { serializedState: source, campaign, operationId: "import.codec.retry" };
    const first = await prepareCloudBaselineImport(input), retry = await prepareCloudBaselineImport(input);
    expect(first.transport).toEqual(retry.transport);
    const variants = [
      { ...input, operationId: "import.codec.other" },
      { ...input, serializedState: source + "\n" },
      { ...input, campaign: { ...campaign, name: "Another synthetic name" } },
      { ...input, campaign: { ...campaign, status: "archived" as const } },
      { ...input, campaign: { ...campaign, updatedAtRealMs: campaign.updatedAtRealMs + 1 } },
      { ...input, campaign: { ...campaign, tutorial: { ...campaign.tutorial, introDismissed: false } } },
    ];
    for (const variant of variants) expect((await prepareCloudBaselineImport(variant)).transport.sha256).not.toBe(first.transport.sha256);
    for (const [field, value] of Object.entries(first.request)) {
      const changed = { ...first.request, [field]: typeof value === "number" ? value + 1 : value + "changed" };
      expect(await sha256Utf8(JSON.stringify(changed))).not.toBe(first.transport.sha256);
    }
    expect(first.transport).toEqual(testTextReceipt(JSON.stringify(first.request)));
  });

  it("preserves an existing review, FSRS card and frozen question without replaying it on hydration", async () => {
    const source = readFileSync(new URL("../../../../../tests/fixtures/level-five-economy-checkpoint-20261012.json", import.meta.url), "utf8");
    const state = deserializeGameState(source), encounter = Object.values(state.encounters)[0]!;
    const prepared = await preparedImport(source);
    const loaded = await loadCloudBaselineImport({ snapshot: { ...prepared.snapshot, revision: "1" }, evidence: prepared.evidence,
      expectedCampaignId: state.campaignId, expectedRevision: "1", expectedBaselineId: JSON.parse(prepared.evidence.text).baselineId });
    expect(Object.values(state.learningHistories).flatMap(history => history.reviews).length).toBeGreaterThan(0);
    expect(loaded.state.learningHistories).toEqual(state.learningHistories);
    expect(loaded.state.encounters[encounter.id]!.frozenCase).toEqual(state.encounters[encounter.id]!.frozenCase);
    expect(loaded.baseline.historicalQuestionCountCredit).toBe(0);
    const envelope = JSON.parse(prepared.snapshot.text);
    const history = Object.values(envelope.gameState.learningHistories).find(value =>
      (value as { reviews: unknown[] }).reviews.length > 0) as { reviews: unknown[] };
    history.reviews.pop();
    await expect(loadCloudBaselineImport({ snapshot: { ...testTextReceipt(JSON.stringify(envelope)), revision: "1" },
      evidence: prepared.evidence, expectedCampaignId: state.campaignId, expectedRevision: "1",
      expectedBaselineId: loaded.baseline.baselineId })).rejects.toMatchObject({ code: "baseline_projection_mismatch" });
  });

  it("rejects unknown fields, incompatible pins, future schemas and campaign ID substitution", async () => {
    const source = serializeGameState(sourceState()), campaign = codecTestCampaign(source);
    const input = { serializedState: source, campaign, operationId: "import.codec.invalid" };
    await expect(prepareCloudBaselineImport({ ...input, campaign: { ...campaign, campaignId: "campaign.someone.else" } }))
      .rejects.toMatchObject({ code: "campaign_identity" });
    await expect(prepareCloudBaselineImport({ ...input, serializedState: JSON.stringify({ ...JSON.parse(source), authToken: "synthetic-forbidden-field" }) }))
      .rejects.toMatchObject({ code: "unmapped_field" });
    await expect(prepareCloudBaselineImport({ ...input, serializedState: JSON.stringify({ ...JSON.parse(source), schemaVersion: 10 }) }))
      .rejects.toMatchObject({ code: "unsupported_game_schema" });
    await expect(prepareCloudBaselineImport({ ...input, serializedState: JSON.stringify({ ...JSON.parse(source), clinicalReleaseId: "release.incompatible" }) }))
      .rejects.toMatchObject({ code: "domain_validation" });
  });

  it("rejects metadata that would leak other profile fields or lose tutorial state", async () => {
    const source = serializeGameState(sourceState()), campaign = codecTestCampaign(source);
    await expect(prepareCloudBaselineImport({ serializedState: source,
      campaign: { ...campaign, activeCampaignId: "device-preference" } as typeof campaign, operationId: "import.codec.metadata" }))
      .rejects.toMatchObject({ code: "invalid_shape" });
    await expect(prepareCloudBaselineImport({ serializedState: source,
      campaign: { ...campaign, tutorial: { ...campaign.tutorial, guidance: { ...campaign.tutorial.guidance!, version: 3 } } } as unknown as typeof campaign,
      operationId: "import.codec.metadata" })).rejects.toMatchObject({ code: "invalid_shape" });
  });
});

describe("B2.1 verified load and projection reconciliation", () => {
  it("checks exact bytes before parsing and rejects invalid measured bytes", async () => {
    const input = await loadInput();
    await expect(loadCloudBaselineImport({ ...input, snapshot: { ...input.snapshot, text: "not JSON" } }))
      .rejects.toMatchObject({ code: "stored_size" });
    await expect(loadCloudBaselineImport({ ...input, snapshot: { ...input.snapshot, sha256: "0".repeat(64) } }))
      .rejects.toMatchObject({ code: "checksum" });
    const malformed = testTextReceipt("not JSON");
    await expect(loadCloudBaselineImport({ ...input, snapshot: { ...malformed, revision: "1", sha256: "0".repeat(64) } }))
      .rejects.toMatchObject({ code: "checksum" });
    await expect(loadCloudBaselineImport({ ...input, snapshot: { ...malformed, revision: "1" } }))
      .rejects.toMatchObject({ code: "invalid_json" });
    await expect(verifyCloudStoredText({ ...input.snapshot, utf8Bytes: -1 })).rejects.toMatchObject({ code: "stored_size" });
  });

  it("requires the requested campaign, immutable baseline and exact revision", async () => {
    const input = await loadInput();
    await expect(loadCloudBaselineImport({ ...input, expectedCampaignId: "campaign.wrong" })).rejects.toMatchObject({ code: "campaign_identity" });
    await expect(loadCloudBaselineImport({ ...input, expectedBaselineId: "baseline.wrong" })).rejects.toMatchObject({ code: "campaign_identity" });
    await expect(loadCloudBaselineImport({ ...input, expectedRevision: "2" })).rejects.toMatchObject({ code: "revision_mismatch" });
  });

  it.each([0, 1, "0", "01", "-1", "1.0", "9223372036854775808"])("rejects invalid server revision %j", revision => {
    expect(() => assertCloudRevision(revision)).toThrowError(expect.objectContaining({ code: "invalid_revision" }));
  });

  it.each(["1", "9007199254740993", "9223372036854775807"])("preserves bigint revision %s without a Number conversion", revision => {
    expect(() => assertCloudRevision(revision)).not.toThrow();
  });

  it("rejects incompatible cloud formats and altered cached money even with valid storage hashes", async () => {
    const input = await loadInput(), envelope = JSON.parse(input.snapshot.text);
    const incompatible = testTextReceipt(JSON.stringify({ ...envelope, cloudFormatVersion: 2 }));
    await expect(loadCloudBaselineImport({ ...input, snapshot: { ...incompatible, revision: "1" } }))
      .rejects.toMatchObject({ code: "unsupported_cloud_format" });
    envelope.gameState.cashCents += 100;
    envelope.gameState.cash += 1;
    const altered = testTextReceipt(JSON.stringify(envelope));
    await expect(loadCloudBaselineImport({ ...input, snapshot: { ...altered, revision: "1" } }))
      .rejects.toMatchObject({ code: "baseline_projection_mismatch" });
  });

  it("rejects changed opening money evidence and historical question-count credit", async () => {
    const input = await loadInput(), baseline = JSON.parse(input.evidence.text);
    baseline.sourceState.cashCents += 100;
    baseline.sourceState.cash += 1;
    await expect(loadCloudBaselineImport({ ...input, evidence: testTextReceipt(JSON.stringify(baseline)) }))
      .rejects.toMatchObject({ code: "baseline_projection_mismatch" });
    baseline.historicalQuestionCountCredit = 1;
    await expect(loadCloudBaselineImport({ ...input, evidence: testTextReceipt(JSON.stringify(baseline)) }))
      .rejects.toMatchObject({ code: "unsupported_evidence_contract" });
  });
});

describe("B2.1 explicit capacity failure", () => {
  it("counts duplicated baseline evidence and escaped transport with independent limits", () => {
    const exact = { decodedStateBytes: 3_000_000, snapshotBytes: 3_000_000, baselineEvidenceBytes: 1_000_000, transportBytes: 6_000_000 };
    expect(assessCloudCodecCapacity(exact)).toEqual({ eligibleForBaselineImport: true, withinSnapshotTarget: false, failures: [] });
    expect(assessCloudCodecCapacity({ decodedStateBytes: 3_000_001, snapshotBytes: 3_000_001,
      baselineEvidenceBytes: 1_000_001, transportBytes: 6_000_001 }).failures).toEqual([
      "decoded-state-ceiling", "snapshot-ceiling", "baseline-evidence-allowance", "transport-body-ceiling",
    ]);
    expect(assessCloudCodecCapacity({ ...exact, snapshotBytes: 2_000_000 }).withinSnapshotTarget).toBe(true);
    expect(() => assessCloudCodecCapacity({ ...exact, transportBytes: NaN })).toThrow();
    expect(CLOUD_CAPACITY_LIMITS.retainedSnapshotsPerAccountBytes).toBe(8_000_000);
    expect(CLOUD_CAPACITY_LIMITS.evidencePerAccountBytes).toBe(2_000_000);
    expect(CLOUD_CAPACITY_LIMITS.campaignsPerAccount).toBe(2);
  });

  it("measures the whole actual import body, including both nested-string escaping layers", async () => {
    const prepared = await preparedImport();
    expect(prepared.sizes.transportBytes).toBe(Buffer.byteLength(JSON.stringify(prepared.request), "utf8"));
    expect(prepared.sizes.transportBytes).toBeGreaterThan(prepared.sizes.snapshotBytes + prepared.sizes.baselineEvidenceBytes);
    expect(prepared.capacity.eligibleForBaselineImport).toBe(true);
  });
});
