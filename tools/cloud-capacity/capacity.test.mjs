import { test } from 'node:test';
import assert from 'node:assert/strict';
import { storageCost, storageProjection, egressProjection, PLAY, LIMITS } from './capacity.mjs';

test('models both retained copies, each sealed page and SQL account/operation allowances', () => {
  assert.equal(storageCost(9), 9 + 2 + 2_048);
  const n = storageProjection({ snapshotBytes: 100, priorSnapshotBytes: 90, headerBytes: 30, pageBytes: [70, 90], campaignIdBytes: 24 });
  assert.equal(n.evidenceReserved, storageCost(30) + storageCost(70) + storageCost(90));
  assert.equal(n.perAccount.snapshots, (storageCost(100) + storageCost(90)) * 2);
  assert.equal(n.beta30Accounts60Campaigns, n.perAccountReserved * 30);
  assert.equal(n.steadyWithSharedReserve, n.beta30Accounts60Campaigns + 50_000_000);
  assert.ok(n.peakWithEightDaysUnverifiedCleanup > n.peakWithOneDayUnverifiedCleanup);
  const full = storageProjection({ snapshotBytes: 3_000_000, headerBytes: 2, pageBytes: [1_000_000], campaignIdBytes: 256 });
  assert.equal(full.accountFits, false); assert.equal(full.campaignEvidenceFits, false);
});
test('never charges checkpoint uploads as egress and counts all five private exports', () => {
  const low = egressProjection(1_000, 2_000, 100), high = egressProjection(1_000, 2_000, 9_000_000);
  assert.deepEqual(low.map(x => x.totalEgressBytes), high.map(x => x.totalEgressBytes));
  assert.equal(low[0].backupEgressBytes, 2_000 * 5);
  assert.equal(low[1].loadEgressBytes, low[0].loadEgressBytes * 2);
  assert.equal(high[0].checkpointSnapshotOnlyIngressBytes, LIMITS.accounts * PLAY.daysPerMonth * PLAY.sessionsPerDay * PLAY.checkpointsPerSession * 9_000_000);
  assert.equal(egressProjection(10_000_000, 0, 0)[0].fits, false);
});
