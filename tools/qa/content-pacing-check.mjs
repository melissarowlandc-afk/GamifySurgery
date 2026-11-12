import '../economy-audit/source-loader.mjs';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

export const CONTENT_PACING_REFERENCE_TICK = 22_690;
export const CONTENT_PACING_MAXIMUM_DRIFT = 0.10;

/** Editorial campaign target approved with the release32 late-game balance. */
export function assertContentPacing(firstFinishTick) {
  assert(Number.isSafeInteger(firstFinishTick) && firstFinishTick > 0,
    'The pacing check requires an actual first-finish tick.');
  const drift = firstFinishTick / CONTENT_PACING_REFERENCE_TICK - 1;
  assert(Math.abs(firstFinishTick - CONTENT_PACING_REFERENCE_TICK) <=
    CONTENT_PACING_REFERENCE_TICK * CONTENT_PACING_MAXIMUM_DRIFT,
    `First finish at ${firstFinishTick} moves ${(drift * 100).toFixed(2)}% from ${CONTENT_PACING_REFERENCE_TICK}. The allowed drift is 10%.`);
  return drift;
}

/** Run the ordinary driver through its first completed inspection without writes. */
export async function runContentPacingCheck(providedContext) {
  const { createLevelFiveStateQaContext } = await import('../../tests/fixtures/level-five-state.ts');
  const { runLevelFiveIntegrationJourney } = await import('../../tests/fixtures/level-five-integration.ts');
  const context = providedContext ?? createLevelFiveStateQaContext();
  const finished = new Error('First finish observed');
  let result = null;
  try {
    runLevelFiveIntegrationJourney(context, (_message, state) => {
      if (!state.levelFive?.progress.gameFinished) return;
      const live = Object.values(state.encounters);
      result = {
        firstFinishTick: state.levelFive.progress.gameFinished.finishedAtFacilityTick,
        closingCashCents: state.cashCents,
        completions: (state.retiredEncounterSummary?.completedCount ?? 0) +
          live.filter(encounter => encounter.resolutionReason === 'completed').length,
        walkouts: (state.retiredEncounterSummary?.retiredCount ?? 0) -
          (state.retiredEncounterSummary?.completedCount ?? 0) +
          live.filter(encounter => encounter.resolutionReason === 'walkout').length,
      };
      throw finished;
    });
  } catch (error) {
    if (error !== finished) throw error;
  }
  assert(result, 'The native journey did not finish.');
  const drift = assertContentPacing(result.firstFinishTick);
  assert.equal(result.walkouts, 0, 'The native pacing journey has walkouts.');
  assert(result.closingCashCents > 0, 'The native pacing journey needs positive closing cash.');
  return { ...result, referenceTick: CONTENT_PACING_REFERENCE_TICK, driftPercent: drift * 100,
    clinicalSha256: createHash('sha256').update(JSON.stringify(context.clinicalRelease)).digest('hex'),
    caseCount: context.clinicalRelease.cases.length, registeredMeanings: context.clinicalRelease.concepts.length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await runContentPacingCheck();
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
}
