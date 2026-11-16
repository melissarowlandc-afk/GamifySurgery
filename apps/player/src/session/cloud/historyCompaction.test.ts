import { expect, it } from "vitest";
import { captureClinicDaySummary, compactGameState, createInitialGameState, getConceptReviewCount,
  getPatientEncounterIncomeCents, getRadiologistReadIncomeSummary, getRollingIncomeSummary,
  getServiceIncomeTotalsCents, importGameEvidence, type GameState } from "@gamify-surgery/game-domain";
import { createHistoryCompactionFixture, outsideReadReceipt } from "../../../../../tests/fixtures/history-compaction";
import { codecTestCampaign } from "./codecTestSupport";
import { compressCloudText, decompressCloudText } from "./codecCompression";
import { logicalJsonText, type CodecJson } from "./codecJson";
import { loadCloudSnapshot, snapshotEvidence } from "./snapshotCodec";
import { runCloudCodecTask } from "./codecTasks";
import { createLearningDevelopmentView } from "../learningDevelopmentView";
import { learningReviewCount } from "../learningReviewCount";
import { averageDailyRevenue, readRevenueHistory } from "../../competition/revenue";
import { createManagementFinanceView } from "../managementViewModels";
import { createGiftShopView } from "../giftShopViewModels";

it("verifies original signed bytes first, compacts only the playable copy, then saves below target", async () => {
  const state = createHistoryCompactionFixture(), original = JSON.stringify(state);
  const campaign = codecTestCampaign(original), lineage = { branchId: "public.compaction", sequence: 19, parents: [] };
  // An actual old native copy, not today's already-compacting encoder.
  const text = logicalJsonText({ cloudFormatVersion: 3, campaign, lineage, gameState: state } as unknown as CodecJson);
  const snapshot = await compressCloudText(text), evidence = await snapshotEvidence();
  const input = { snapshot, evidence, revision: "19", expectedRevision: "19", expectedCampaignId: state.campaignId, expectedBaselineId: "snapshot.v1", lineage };
  const raw = await loadCloudSnapshot(input);
  const beforeCards = Object.fromEntries(Object.entries(raw.state.learningHistories).map(([id, h]) => [id, JSON.stringify(h.card)]));
  const prepared = await runCloudCodecTask({ kind: "hydrate", input: { ...input, preparePlayable: true } });
  expect(prepared.learningAdapted).toBe(true);
  expect(prepared.source).toEqual(raw.source);
  expect(prepared.state).toEqual(compactGameState(raw.state));
  expect(importGameEvidence(prepared.checkpoint.snapshot, prepared.checkpoint.evidence)).toEqual(prepared.state);
  for (const [id, h] of Object.entries(prepared.state.learningHistories)) {
    expect(JSON.stringify(h.card)).toBe(beforeCards[id]);
    expect(getConceptReviewCount(h)).toBe(getConceptReviewCount(raw.state.learningHistories[id]));
  }
  expect((await runCloudCodecTask({ kind: "hydrate", input })).state).toEqual(raw.state);
  expect(await decompressCloudText(snapshot)).toBe(text);
  expect(JSON.stringify(state)).toBe(original);
  const candidate = await runCloudCodecTask({ kind: "snapshotEncode", input: { state: prepared.state, campaign, lineage } });
  expect(candidate.snapshot.uncompressedBytes).toBeLessThan(2_000_000);
  const again = await runCloudCodecTask({ kind: "hydrate", input: { ...input, snapshot: candidate.snapshot, preparePlayable: true } });
  expect(again.state).toEqual(prepared.state);
  await expect(runCloudCodecTask({ kind: "hydrate", input: { ...input, snapshot: { ...snapshot, uncompressedSha256: "0".repeat(64) }, preparePlayable: true } })).rejects.toThrow();
});

it("keeps learning totals/status, management income and competition revenue equivalent", () => {
  const before = createHistoryCompactionFixture(), after = compactGameState(before);
  expect(learningReviewCount(after.learningHistories)).toBe(learningReviewCount(before.learningHistories));
  const concepts = Object.keys(before.learningHistories).map(id => ({ id, displayName: id }));
  const format = (h: typeof before.learningHistories[string] | undefined) => `${h?.reviews.at(-1)?.rating}:${h?.card.dueAtMs}`;
  expect(createLearningDevelopmentView(after, concepts, format)).toEqual(createLearningDevelopmentView(before, concepts, format));
  expect(readRevenueHistory(after)).toEqual(readRevenueHistory(before));
  const a = createManagementFinanceView(before, getServiceIncomeTotalsCents(before), id => id),
    b = createManagementFinanceView(after, getServiceIncomeTotalsCents(after), id => id);
  expect(b).toEqual(a);
});

const settlement = (tick: number): GameState["settlements"][number] => ({
  id: `settlement.calendar.${tick}`, encounterId: `retired.calendar.${tick}`,
  completionRevenue: 20, qualityRevenueBonus: 0, incorrectFinancialConsequence: 0,
  netCashDelta: 20, satisfactionDelta: 0, clinicalXpAwarded: 0, correctAnswers: 1,
  incorrectAnswers: 0, terminalOutcomeSeverity: null, settledAtFacilityTick: tick,
});
const financialReaders = (state: GameState) => ({
  totals: getServiceIncomeTotalsCents(state), patient: getPatientEncounterIncomeCents(state),
  rolling: getRollingIncomeSummary(state), daily: captureClinicDaySummary(state),
  management: createManagementFinanceView(state, getServiceIncomeTotalsCents(state), id => id),
  radiology: getRadiologistReadIncomeSummary(state),
  giftShop: createGiftShopView(state),
});

it("preserves all three completed competition days midway through the following day", () => {
  const before = createInitialGameState(); before.facilityTick = 2_100;
  before.serviceIncomeReceipts = []; before.settlements = [settlement(100)];
  const history = readRevenueHistory(before), after = compactGameState(before);
  expect(averageDailyRevenue(history)).toEqual({ averageDailyRevenueCents: 667, daysCounted: 3 });
  expect(readRevenueHistory(after)).toEqual(history);
  expect(averageDailyRevenue(readRevenueHistory(after))).toEqual(averageDailyRevenue(history));
});

it.each([1_800, 1_801, 2_100, 2_399, 2_400, 2_401, 2_700, 2_999, 3_000, 3_001])(
  "keeps every financial reader equivalent at calendar tick %i, with and without cached days", tick => {
    const before = createInitialGameState(); before.facilityTick = tick;
    before.serviceIncomeReceipts = [];
    before.settlements = [0, 1, 100, 599, 600, 601, 1_199, 1_200, 1_201, 1_799, 1_800, 1_801,
      2_099, 2_100, 2_399, 2_400, 2_401, 2_699, 2_700, 2_999, 3_000, 3_001].filter(t => t <= tick).map(settlement);
    const after = compactGameState(before), history = readRevenueHistory(before);
    expect(financialReaders(after)).toEqual(financialReaders(before));
    expect(readRevenueHistory(after)).toEqual(history);
    expect(averageDailyRevenue(readRevenueHistory(after))).toEqual(averageDailyRevenue(history));
    for (const priorTick of [Math.floor(tick / 600) * 600 - 1, tick]) {
      const previous = readRevenueHistory({ ...before, facilityTick: priorTick });
      expect(readRevenueHistory(after, previous)).toEqual(readRevenueHistory(before, previous));
    }
  });

it.each([600, 601, 1_200, 1_201, 1_800, 1_801, 2_100, 2_399, 2_400, 2_401])(
  "keeps the inclusive one-day finance boundary at tick %i for raw receipts and read buckets", tick => {
    for (const remote of [false, true]) {
      const before = createInitialGameState(); before.facilityTick = tick; before.settlements = [];
      before.facilityLevel = 5;
      before.serviceIncomeReceipts = Array.from({ length: 102 }, (_, n) => ({
        ...outsideReadReceipt(n, n < 52 ? tick - 600 : tick - 10),
        ...(remote ? {} : { incomeLineId: "income.gift_shop", actorKind: "employee" as const }),
      }));
      const after = compactGameState(before);
      expect(financialReaders(after)).toEqual(financialReaders(before));
      expect(readRevenueHistory(after)).toEqual(readRevenueHistory(before));
      if (remote) {
        expect(after.historyCompaction!.outsideReadReceipts).toEqual([[tick - 600, 52,
          before.serviceIncomeReceipts.slice(0, 52).reduce((sum, receipt) => sum + Math.round(receipt.grossAmount * 100), 0)]]);
        // Later expiry uses the same existing completed-day cache, rather than
        // inventing historical daily values once individual receipts retire.
        const previous = readRevenueHistory(before);
        const nextBefore = { ...before, facilityTick: tick + 1 }, nextAfter = compactGameState({ ...after, facilityTick: tick + 1 });
        expect(readRevenueHistory(nextAfter, previous)).toEqual(readRevenueHistory(nextBefore, previous));
      }
    }
  });
