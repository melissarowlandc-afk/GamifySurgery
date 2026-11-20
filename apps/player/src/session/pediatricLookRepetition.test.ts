import { expect, it } from "vitest";
import { getFacilityClock, type GameState, type PatientDemographics } from "@gamify-surgery/game-domain";
import approved from "../../../../tests/fixtures/kids-reviewers-acceptance.json";
import { LevelFiveIntegrationJourney } from "../../../../tests/fixtures/level-five-integration";
import { createLevelFiveIntegrationQaState } from "../../../../tests/fixtures/level-five-integration-qa";
import { createLevelFiveStateQaContext } from "../../../../tests/fixtures/level-five-state";
import { createPrototypePlayerView } from "./viewModels";

const ownerPeakAndDay = [
  { minimumAge: 5, sex: "Female", peak: 5, day: 8 },
  { minimumAge: 5, sex: "Male", peak: 2, day: 3 },
  { minimumAge: 9, sex: "Female", peak: 5, day: 8 },
  { minimumAge: 9, sex: "Male", peak: 3, day: 4 },
  { minimumAge: 13, sex: "Female", peak: 2, day: 2 },
  { minimumAge: 13, sex: "Male", peak: 2, day: 3 },
] as const; // Published aggregate P/D from the approved capacity plan. No owner save or actor records.
const binKey = (age: number, sex: string) => `${age <= 8 ? 5 : age <= 12 ? 9 : 13}/${sex}`;

function childEpisodes(state: GameState) {
  const records = new Map<string, PatientDemographics>();
  for (const encounter of Object.values(state.encounters)) {
    const demographics = encounter.frozenCase.prototypeDemographics;
    if (encounter.frozenCase.pediatricProfile && demographics) records.set(encounter.consult?.serviceOperationId ?? encounter.id, demographics);
  }
  for (const op of state.serviceOperations) {
    const visit = op.clinicVisit;
    if (visit?.kind === "pediatric_consult" || visit?.kind === "pediatric_procedure") records.set(op.id, visit.demographics);
  }
  return records;
}

it("keeps simultaneous child looks distinct for new families over three operating days in a real Level 5 clinic", () => {
  const context = createLevelFiveStateQaContext();
  const initial = createLevelFiveIntegrationQaState("integration-running", context);
  expect(initial.facilityLevel).toBe(5);
  expect(initial.rooms.length).toBeGreaterThan(80); // The public earned integration clinic has 87 places.
  const day = getFacilityClock(initial, context).operatingMinutesPerDay;
  const days = 3;
  const journey = new LevelFiveIntegrationJourney(context, initial);
  const opening = initial.facilityTick;
  const carryIn = new Set(childEpisodes(initial).keys());
  const seen = new Set(carryIn);
  const arrivals = Array.from({ length: days }, () => 0);
  const bins = new Map(ownerPeakAndDay.map(row => [binKey(row.minimumAge, row.sex), {
    actualPeak: 0, arrivalTicks: [] as number[],
    pool: approved.children.filter(look => look.minimumAge === row.minimumAge && look.sex === row.sex).length,
    planCapacity: row.peak + row.day,
  }]));
  let duplicateMinutes = 0, duplicatePairs = 0, peakVisible = 0;
  const examples: { minute: number; stillId: string; count: number }[] = [];
  journey.apply({ type: "SET_PAUSED", paused: false });
  for (let minute = 0; minute < days * day; minute++) {
    journey.pump(); journey.tick();
    const state = journey.state;
    const episodes = childEpisodes(state);
    for (const [key, demographics] of episodes) {
      if (seen.has(key)) continue;
      seen.add(key);
      arrivals[Math.floor(minute / day)]!++;
      bins.get(binKey(demographics.ageYears!, demographics.sexLabel!))?.arrivalTicks.push(state.facilityTick);
    }
    const facility = createPrototypePlayerView(state, null, false, null).facility;
    const visible = new Map<string, { stillId: string; bin: string }>();
    const record = (episode: string, stillId: string | undefined) => {
      const demographics = episodes.get(episode);
      if (!demographics) return;
      expect(stillId, `Visible child episode ${episode} needs a registered look`).toBeDefined();
      visible.set(episode, { stillId: stillId!, bin: binKey(demographics.ageYears!, demographics.sexLabel!) });
    };
    for (const actor of facility.patients ?? []) if (actor.location) {
      record(state.encounters[actor.instanceId]?.consult?.serviceOperationId ?? actor.instanceId, actor.appearance.stillId);
    }
    for (const actor of facility.serviceVisitors ?? []) if (actor.location) record(actor.instanceId, actor.appearance?.stillId);
    const looks = new Map<string, { total: number; carryIn: number }>();
    const visibleBins = new Map<string, number>();
    for (const [episode, { stillId, bin }] of visible) {
      const entry = looks.get(stillId) ?? { total: 0, carryIn: 0 };
      entry.total++;
      if (carryIn.has(episode)) entry.carryIn++;
      looks.set(stillId, entry);
      visibleBins.set(bin, (visibleBins.get(bin) ?? 0) + 1);
    }
    for (const [key, count] of visibleBins) {
      const bucket = bins.get(key)!;
      bucket.actualPeak = Math.max(bucket.actualPeak, count);
    }
    peakVisible = Math.max(peakVisible, visible.size);
    let pairs = 0;
    for (const [stillId, counts] of looks) {
      const chooseTwo = (n: number) => n * (n - 1) / 2;
      const added = chooseTwo(counts.total) - chooseTwo(counts.carryIn);
      pairs += added;
      if (added && examples.length < 4) examples.push({ minute, stillId, count: counts.total });
    }
    if (pairs) duplicateMinutes++;
    duplicatePairs += pairs;
  }
  expect(journey.state.facilityTick - opening).toBe(days * day);
  expect(arrivals.every(count => count > 0), `Expected new pediatric families in each operating day: ${arrivals}`).toBe(true);
  expect(peakVisible).toBeGreaterThanOrEqual(3);
  const demand = [...bins].map(([bin, row]) => {
    const rollingDay = Math.max(0, ...row.arrivalTicks.map(tick => row.arrivalTicks.filter(at => at > tick - day && at <= tick).length));
    return { bin, pool: row.pool, peak: row.actualPeak, rollingDay, required: Math.max(row.planCapacity, row.actualPeak + rollingDay) };
  });
  const summary = { samples: days * day, arrivals, peakVisible, duplicateMinutes, duplicatePairs, examples, demand };
  console.info("PEDIATRIC_LOOK_COLLISION", JSON.stringify(summary));
  // At most P looks are occupied and at most D were used in the rolling day.
  // N >= P + D covers distinct simultaneous looks, even if all D avoid reuse.
  // Count pairs with at least one new episode: saved carry-ins keep their looks.
  expect(demand.filter(row => row.pool < row.required), "Fixture must stay inside the approved capacity envelope").toEqual([]);
  expect(duplicatePairs, JSON.stringify(summary)).toBeLessThan(1);
}, 300_000);
