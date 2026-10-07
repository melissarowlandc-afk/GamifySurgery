import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { createServer } from 'vite';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(scriptDirectory, '../../..');
const output = path.join(repo, 'artifacts/character-statics/patient-demographics20-v4/analysis');
const receiptPath = path.join(output, 'demographic-audit.json');
const notePath = path.join(output, 'demographic-audit.md');
const bandOrder = ['under-18', '18-29', '30-44', '45-64', '65+'];
const sexes = ['Female', 'Male'];
const keys = bandOrder.flatMap(band => sexes.map(sex => `${sex}|${band}`));
const primaryPaths = [
  'packages/clinical-content/src/synthetic-content.ts',
  'packages/clinical-content/src/schema.ts',
  'packages/game-domain/src/clinical-selection.ts',
  'packages/game-domain/src/patientDemographics.ts',
  'packages/game-domain/src/characterStillCatalog.ts',
  'packages/game-domain/src/patientAppearanceCatalog.ts',
  'packages/game-domain/src/appearance.ts',
  'packages/game-domain/src/reducer.ts',
  'packages/game-domain/src/selectors.ts',
  'packages/game-domain/src/employee-discussions.ts',
  'packages/balance-config/src/prototype-balance.ts',
  'tools/character-mapping/patient-women-20-v3/README.md',
  'tools/character-mapping/patient-demographics20-v4/demographic-audit.mjs',
];
const hashText = body => createHash('sha256').update(body).digest('hex');
const rel = file => path.relative(repo, file).replaceAll('\\', '/');
const digest = async file => hashText(await readFile(path.join(repo, file)));
const round = number => Number(number.toFixed(12));
const empty = () => Object.fromEntries(keys.map(key => [key, 0]));
const sum = values => values.reduce((total, value) => total + value, 0);
const bandFor = age => age < 18 ? 'under-18' : age < 30 ? '18-29' : age < 45 ? '30-44' : age < 65 ? '45-64' : '65+';
const visualBands = {young_adult: '18-29', adult: '30-44', middle_aged: '45-64', older_adult: '65+'};
const caseConcepts = clinicalCase => [...new Set(clinicalCase.decisionNodes.map(node => node.primaryConceptId))].sort();
const profilesFor = clinicalCase => clinicalCase.approvedInstantiationProfiles?.length
  ? clinicalCase.approvedInstantiationProfiles.map(profile => ({id: profile.id, demographics: profile.prototypeDemographics ?? clinicalCase.prototypeDemographics}))
  : [{id: null, demographics: clinicalCase.prototypeDemographics}];

// This mirrors the display-only completion rules, not a disease/demographic
// selection weight. Actual completePatientDemographics outputs are checked
// against the distribution below for every authored case/profile.
function ageDistribution(clinicalCase, demographics) {
  const age = demographics?.ageYears;
  if (Number.isInteger(age) && age >= 0 && age <= 120) return [{age, probability: 1, rule: 'explicit'}];
  const fixed = {
    'case.fhh.evaluation-to-confirmed-management': 27,
    'case.pancreatic-tail-adenocarcinoma.clinic-counseling': 70,
    'case.choledochal-cyst.type-iva.2a': 52,
  };
  if (fixed[clinicalCase.id] !== undefined) return [{age: fixed[clinicalCase.id], probability: 1, rule: 'case-specific display constraint'}];
  const young = clinicalCase.id === 'case.fhh.suggestive-results-confirmation';
  const start = young ? 18 : 30, count = young ? 12 : 35;
  return Array.from({length: count}, (_, index) => ({age: start + index, probability: 1 / count, rule: young ? 'case-specific editorial 18-29 completion' : 'editorial 30-64 completion'}));
}

function sexDistribution(clinicalCase, demographics) {
  const sex = demographics?.sexLabel;
  if (sexes.includes(sex)) return [{sex, probability: 1, rule: 'explicit'}];
  if (clinicalCase.id === 'case.anal-hsil.hpv.3d') return [{sex: 'Female', probability: 1, rule: 'case-specific display constraint'}];
  return sexes.map(sex => ({sex, probability: 0.5, rule: 'editorial two-sex completion'}));
}

function caseDistribution(clinicalCase) {
  const byCell = empty(), byAgeSex = {}, profileRows = [];
  const profiles = profilesFor(clinicalCase);
  for (const profile of profiles) {
    const ageRows = ageDistribution(clinicalCase, profile.demographics);
    const sexRows = sexDistribution(clinicalCase, profile.demographics);
    for (const ageRow of ageRows) for (const sexRow of sexRows) {
      const probability = ageRow.probability * sexRow.probability / profiles.length;
      const cell = `${sexRow.sex}|${bandFor(ageRow.age)}`;
      byCell[cell] += probability;
      const ageSex = `${sexRow.sex}|${ageRow.age}`;
      byAgeSex[ageSex] = (byAgeSex[ageSex] ?? 0) + probability;
    }
    profileRows.push({
      profileId: profile.id,
      authoredAge: profile.demographics?.ageYears ?? null,
      authoredSex: profile.demographics?.sexLabel ?? null,
      ageRules: [...new Set(ageRows.map(row => row.rule))],
      sexRules: [...new Set(sexRows.map(row => row.rule))],
      profileProbability: 1 / profiles.length,
    });
  }
  assert(Math.abs(sum(Object.values(byCell)) - 1) < 1e-10, `demographic distribution not normalized: ${clinicalCase.id}`);
  return {byCell, byAgeSex, profileRows};
}

function expectedRows(cases, caseWeights, distributions, rosterCounts) {
  const byCell = empty(), ageSex = {};
  for (const clinicalCase of cases) {
    const weight = caseWeights.get(clinicalCase.id) ?? 0;
    const distribution = distributions.get(clinicalCase.id);
    for (const key of keys) byCell[key] += weight * distribution.byCell[key];
    for (const [key, probability] of Object.entries(distribution.byAgeSex)) ageSex[key] = (ageSex[key] ?? 0) + weight * probability;
  }
  assert(Math.abs(sum(Object.values(byCell)) - 1) < 1e-10, 'encounter shares not normalized');
  return {
    cells: keys.map(key => ({
      sex: key.split('|')[0], ageBand: key.split('|')[1],
      encounterShare: round(byCell[key]),
      stills: rosterCounts[key],
      sharePerStill: rosterCounts[key] ? round(byCell[key] / rosterCounts[key]) : null,
    })),
    ageHistogram: Object.entries(ageSex).map(([key, encounterShare]) => ({sex: key.split('|')[0], ageYears: Number(key.split('|')[1]), encounterShare: round(encounterShare)})).sort((left, right) => left.sex.localeCompare(right.sex) || left.ageYears - right.ageYears),
  };
}

function conceptWeights(cases) {
  const byConcept = new Map();
  for (const clinicalCase of cases) for (const conceptId of caseConcepts(clinicalCase)) {
    if (!byConcept.has(conceptId)) byConcept.set(conceptId, []);
    byConcept.get(conceptId).push(clinicalCase.id);
  }
  const weights = new Map(cases.map(clinicalCase => [clinicalCase.id, 0]));
  for (const ids of byConcept.values()) for (const id of ids) weights.set(id, weights.get(id) + 1 / byConcept.size / ids.length);
  assert(Math.abs(sum([...weights.values()]) - 1) < 1e-10, 'concept-first case weights not normalized');
  return {weights, byConcept};
}

function allocationFor(cells, slots = 20) {
  const counts = Object.fromEntries(cells.map(row => [`${row.sex}|${row.ageBand}`, row.stills]));
  const shares = Object.fromEntries(cells.map(row => [`${row.sex}|${row.ageBand}`, row.encounterShare]));
  const allocated = empty(), steps = [];
  const eligible = keys.filter(key => !key.endsWith('|under-18') && counts[key] > 0);
  // Existing occupancy/LRU rules affect short-run repetition. This planning
  // proxy minimizes the largest demand-per-design cell; it is not a forecast
  // of actual repeated encounters or a new runtime probability.
  for (let index = 0; index < slots; index += 1) {
    const key = [...eligible].sort((left, right) => shares[right] / (counts[right] + allocated[right]) - shares[left] / (counts[left] + allocated[left]) || keys.indexOf(left) - keys.indexOf(right))[0];
    allocated[key] += 1;
    steps.push(key);
  }
  return {
    method: 'Allocate each of 20 additions to the currently largest encounter-share/eligible-still cell (discrete load leveling). This is an editorial art-planning proxy; runtime occupancy/LRU selection is unchanged.',
    slots,
    allocation: keys.filter(key => allocated[key] > 0).map(key => ({sex: key.split('|')[0], ageBand: key.split('|')[1], additions: allocated[key], beforeStills: counts[key], afterStills: counts[key] + allocated[key], beforeSharePerStill: round(shares[key] / counts[key]), afterSharePerStill: round(shares[key] / (counts[key] + allocated[key]))})),
    steps,
  };
}

function inventory(cases) {
  const rawStructured = {}, missingCaseIds = [], rawProfileRows = [];
  for (const clinicalCase of cases) {
    const profiles = profilesFor(clinicalCase);
    if (!profiles.some(profile => profile.demographics)) missingCaseIds.push(clinicalCase.id);
    for (const profile of profiles) {
      const demographics = profile.demographics;
      const key = demographics ? `${demographics.sexLabel}|${bandFor(demographics.ageYears)}` : 'missing structured age/sex';
      rawStructured[key] = (rawStructured[key] ?? 0) + 1 / profiles.length;
      rawProfileRows.push({caseId: clinicalCase.id, profileId: profile.id, ageYears: demographics?.ageYears ?? null, sexLabel: demographics?.sexLabel ?? null, caseEquivalentWeight: 1 / profiles.length});
    }
  }
  return {
    cases: cases.length,
    decisionNodes: sum(cases.map(clinicalCase => clinicalCase.decisionNodes.length)),
    distinctPrimaryConcepts: new Set(cases.flatMap(caseConcepts)).size,
    profileRows: rawProfileRows.length,
    pediatricAuthoredProfileRows: rawProfileRows.filter(row => row.ageYears !== null && row.ageYears < 18).length,
    rawStructuredCaseEquivalents: Object.fromEntries(Object.entries(rawStructured).sort().map(([key, value]) => [key, round(value)])),
    missingStructuredCaseIds: missingCaseIds,
  };
}

async function buildAudit() {
  const before = Object.fromEntries(await Promise.all(primaryPaths.map(async file => [file, await digest(file)])));
  const vite = await createServer({configFile: false, root: repo, appType: 'custom', logLevel: 'error', server: {middlewareMode: true, hmr: false, watch: null}});
  try {
    const clinical = await vite.ssrLoadModule('/packages/clinical-content/src/synthetic-content.ts');
    const newestBatch = await vite.ssrLoadModule('/packages/clinical-content/src/development-batch/2026-10-07-variety/variety-batch.ts');
    const balanceModule = await vite.ssrLoadModule('/packages/balance-config/src/prototype-balance.ts');
    const catalogModule = await vite.ssrLoadModule('/packages/game-domain/src/characterStillCatalog.ts');
    const demographicModule = await vite.ssrLoadModule('/packages/game-domain/src/patientDemographics.ts');
    const selectionModule = await vite.ssrLoadModule('/packages/game-domain/src/clinical-selection.ts');
    const release = clinical.SYNTHETIC_CLINICAL_RELEASE, balance = balanceModule.PROTOTYPE_BALANCE_RELEASE;
    const catalog = catalogModule.CHARACTER_STILL_CATALOG;
    const adultPatients = catalog.filter(entry => entry.category === 'patient');
    const rosterCounts = empty();
    for (const entry of adultPatients) rosterCounts[`${entry.compatibleSexLabel}|${visualBands[entry.ageBand]}`] += 1;
    assert.equal(adultPatients.length, 96, 'Current approved roster is no longer the 96-design baseline; review allocation before proceeding.');
    const distributions = new Map(release.cases.map(clinicalCase => [clinicalCase.id, caseDistribution(clinicalCase)]));
    const patientCases = release.cases.filter(clinicalCase => clinicalCase.participant?.kind !== 'employee_discussion');
    const routinePatients = patientCases.filter(clinicalCase => clinicalCase.routineEligible);

    // Verify mirrored completion against the actual runtime function for
    // every authored profile, with multiple independent deterministic seeds.
    let completionChecks = 0;
    for (const clinicalCase of release.cases) for (const profile of profilesFor(clinicalCase)) {
      const allowedAges = new Set(ageDistribution(clinicalCase, profile.demographics).map(row => row.age));
      const allowedSexes = new Set(sexDistribution(clinicalCase, profile.demographics).map(row => row.sex));
      for (let index = 0; index < 8; index += 1) {
        const demographics = demographicModule.completePatientDemographics({caseId: clinicalCase.id, campaignSeed: `demographic-audit-v4-${index}`, encounterId: `audit.${clinicalCase.id}.${profile.id}.${index}`, demographics: profile.demographics});
        assert(allowedAges.has(demographics.ageYears) && allowedSexes.has(demographics.sexLabel), `runtime completion rules changed: ${clinicalCase.id}`);
        completionChecks += 1;
      }
    }

    const casesById = new Map(release.cases.map(clinicalCase => [clinicalCase.id, clinicalCase]));
    const scenarios = [];
    const scenarioCasePools = new Map();
    const addScenario = (id, cases, gates) => {
      assert(cases.length > 0, `empty scenario ${id}`);
      const {weights, byConcept} = conceptWeights(cases);
      const shares = expectedRows(cases, weights, distributions, rosterCounts);
      scenarios.push({id, gates, counts: inventory(cases), conceptFirst: shares, recommendedTwenty: allocationFor(shares.cells), caseWeights: [...weights.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([caseId, probability]) => ({caseId, probability: round(probability)})), conceptPools: [...byConcept.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([conceptId, caseIds]) => ({conceptId, caseIds: [...caseIds].sort()}))});
      scenarioCasePools.set(id, cases);
    };
    addScenario('all-release-patient-cases-ungated', patientCases, 'All patient cases in the current release, without stage/capability or routine-eligibility gating; comparison only. Employee discussions excluded.');
    addScenario('routine-patients-all-capabilities', routinePatients, 'Routine-eligible patient cases with every required capability available; no stage restriction. Employee discussions excluded.');
    for (const stage of [0, 1, 2, 3]) {
      const rooms = balance.facility.roomDefinitions.filter(definition => definition.unlockFacilityLevel <= stage);
      const roles = balance.facility.staffRoleDefinitions.filter(definition => definition.unlockFacilityLevel <= stage);
      const available = new Set([...rooms.flatMap(definition => definition.capabilityIds), ...roles.flatMap(definition => definition.capabilityIds)]);
      if (['room.endoscopy', 'room.periop_recovery'].every(id => rooms.some(room => room.id === id)) && ['staff.endoscopy_nurse', 'staff.periop_nurse'].every(id => roles.some(role => role.id === id))) available.add('capability.endoscopy');
      const cases = routinePatients.filter(clinicalCase => clinicalCase.earliestFacilityStage <= stage && clinicalCase.requiredCapabilityIds.every(capability => available.has(capability)));
      addScenario(`level-${stage}-all-unlocked-operational`, cases, {facilityLevel: stage, assumption: 'Every unlocked room/role is present, reachable, staffed and operational. This is a capability ceiling, not a saved campaign or a level-only runtime gate.', capabilityIds: [...available].sort(), omittedForRequiredCapabilityCaseIds: routinePatients.filter(clinicalCase => clinicalCase.earliestFacilityStage <= stage && !clinicalCase.requiredCapabilityIds.every(capability => available.has(capability))).map(clinicalCase => clinicalCase.id).sort()});
    }
    // Additional comparison for a Level 3 campaign that has not installed
    // optional endoscopy capabilities. Only content admission is changed.
    const levelThreeCapabilities = new Set(scenarios.find(scenario => scenario.id === 'level-3-all-unlocked-operational').gates.capabilityIds);
    levelThreeCapabilities.delete('capability.endoscopy');
    addScenario('level-3-without-operational-endoscopy', routinePatients.filter(clinicalCase => clinicalCase.earliestFacilityStage <= 3 && clinicalCase.requiredCapabilityIds.every(capability => levelThreeCapabilities.has(capability))), 'Level 3 capability ceiling minus compound capability.endoscopy; optional-installation sensitivity only.');
    const newestIds = new Set(newestBatch.GS028_20261007_CASES.map(clinicalCase => clinicalCase.id));
    const earlierCases = release.cases.filter(clinicalCase => !newestIds.has(clinicalCase.id));
    addScenario('before-gs028-20261007-comparison', earlierCases.filter(clinicalCase => clinicalCase.routineEligible && clinicalCase.participant?.kind !== 'employee_discussion'), 'Diagnostic comparison excluding the 78 newly admitted GS028 2026-10-07 cases; does not withdraw or change current runtime content.');

    // Exercise the real selector, without a player save or reducer mutation.
    // An empty history/encounter state must draw from the same eligible concept
    // pools. Counts are analytic above; this is a bounded behavioral check.
    let selectorChecks = 0;
    for (const scenario of scenarios) for (let index = 0; index < 32; index += 1) {
      const cases = scenarioCasePools.get(scenario.id);
      const selected = selectionModule.selectRoutineClinicalCase({campaignSeed: `demographic-audit-selector-${index}`, encounters: {}, learningHistories: {}, routineArrivalSequence: index}, cases, 0);
      assert(selected?.kind === 'new_concept');
      assert(scenario.conceptPools.some(row => row.conceptId === selected.selectedConceptId && row.caseIds.includes(selected.clinicalCase.id)));
      assert(casesById.has(selected.clinicalCase.id));
      selectorChecks += 1;
    }
    const rawEqualCase = expectedRows(patientCases, new Map(patientCases.map(clinicalCase => [clinicalCase.id, 1 / patientCases.length])), distributions, rosterCounts);
    const rawEqualQuestion = expectedRows(patientCases, new Map(patientCases.map(clinicalCase => [clinicalCase.id, clinicalCase.decisionNodes.length / sum(patientCases.map(row => row.decisionNodes.length))])), distributions, rosterCounts);
    const baseOnlyDistributions = new Map(release.cases.map(clinicalCase => [clinicalCase.id, caseDistribution({...clinicalCase, approvedInstantiationProfiles: undefined})]));
    const baseOnly = expectedRows(patientCases, conceptWeights(patientCases).weights, baseOnlyDistributions, rosterCounts);
    const earlierBaseOnly = expectedRows(earlierCases, conceptWeights(earlierCases).weights, baseOnlyDistributions, rosterCounts);
    const dependencies = [...new Set([...vite.moduleGraph.idToModuleMap.values()].map(module => module.file && path.resolve(module.file)).filter(file => file && file.startsWith(repo + path.sep) && !file.includes(`${path.sep}node_modules${path.sep}`) && /\.[cm]?[jt]s$/.test(file)).map(rel))];
    const sourcePaths = [...new Set([...primaryPaths, ...dependencies])].sort();
    const sourceHashes = Object.fromEntries(await Promise.all(sourcePaths.map(async file => [file, await digest(file)])));
    for (const file of primaryPaths) assert.equal(sourceHashes[file], before[file], `concurrent source edit during audit: ${file}`);
    const rawRows = release.cases.flatMap(clinicalCase => profilesFor(clinicalCase).map(profile => ({caseId: clinicalCase.id, profileId: profile.id, ageYears: profile.demographics?.ageYears ?? null, sexLabel: profile.demographics?.sexLabel ?? null, conceptIds: caseConcepts(clinicalCase), routineEligible: clinicalCase.routineEligible, earliestFacilityStage: clinicalCase.earliestFacilityStage, requiredCapabilityIds: [...clinicalCase.requiredCapabilityIds].sort(), participantKind: clinicalCase.participant?.kind ?? 'patient'}))).sort((left, right) => left.caseId.localeCompare(right.caseId) || String(left.profileId).localeCompare(String(right.profileId)));
    return {
      schemaVersion: 'patient-demographics20-v4-software-mix-audit/v1',
      purpose: 'Select 20 new visual identities against existing authored question demographics and the approved adult patient roster. This neither changes clinical content, review status, simulation selection weights, nor disease probabilities.',
      method: {
        release: 'SYNTHETIC_CLINICAL_RELEASE loaded through Vite SSR from actual current sources',
        rawTotals: 'Raw authored cases, decision nodes and profile rows are reported separately. Each case counts once in the equal-case comparison; each decision node counts once in the equal-question comparison. Profiles split their case/decision-node weight uniformly.',
        encounterModel: 'Exact first-unseen selection distribution with empty learning histories and no active patient or employee-discussion concepts: uniform distinct primary concept, then uniform eligible case containing that concept, then uniform instantiation profile. Multi-decision cases may be reachable through several concepts; their probabilities are summed.',
        displayCompletion: 'Existing explicit demographic values take priority. New-encounter display constraints and the existing uniform 30-64 age / two-sex completion are modeled analytically; Not specified sex completes under the existing two-sex fallback. No saved legacy identity is supplied for new encounters.',
        limits: ['This is a planning snapshot, not a campaign-long forecast. FSRS due dates prioritize earliest due concepts, while active or not-yet-due concepts block complete cases.', 'Tutorial/guaranteed critical encounters, ambient/service-only visitors and employee discussions are separate paths; patient allocation is based on routine patient encounters.', 'Capability scenarios assume operational reachable resources and are not substitutes for actual saved facility state.', 'Appearance occupancy/LRU rotation changes short-run repetition; demand share per still is a load proxy.', 'Race, ethnicity, clothing and body build are never used to select disease or questions.'],
      },
      release: {id: release.id, publicationStatus: release.publicationStatus, declaredConcepts: release.concepts.length, ...inventory(release.cases), employeeDiscussionCases: release.cases.filter(clinicalCase => clinicalCase.participant?.kind === 'employee_discussion').length, patientCases: patientCases.length, patientDecisionNodes: sum(patientCases.map(clinicalCase => clinicalCase.decisionNodes.length)), routinePatientCases: routinePatients.length, nonroutinePatientCaseIds: patientCases.filter(clinicalCase => !clinicalCase.routineEligible).map(clinicalCase => clinicalCase.id).sort()},
      currentRoster: {totalCatalogEntries: catalog.length, adultPatientStills: adultPatients.length, cohorts: Object.fromEntries([...new Set(adultPatients.map(entry => entry.sourceCohort))].sort().map(cohort => [cohort, adultPatients.filter(entry => entry.sourceCohort === cohort).length])), cells: keys.map(key => ({sex: key.split('|')[0], ageBand: key.split('|')[1], stills: rosterCounts[key]})), futurePediatricStills: catalog.filter(entry => entry.category === 'future-presentation' && entry.futurePresentationKind === 'pediatric').map(entry => ({stillId: entry.stillId, intendedVisualAge: entry.intendedVisualAge, availability: entry.availability})), entries: adultPatients.map(entry => ({stillId: entry.stillId, sourceCohort: entry.sourceCohort, compatibleSexLabel: entry.compatibleSexLabel, ageBand: entry.ageBand, intendedAge: entry.intendedAge ?? null}))},
      rawEqualPatientCaseComparison: rawEqualCase,
      rawEqualPatientQuestionComparison: rawEqualQuestion,
      priorReadmeDiscrepancyDiagnostic: {
        priorReadmeClaim: '856 cases / 291 concepts, about 87.5% female encounters in patient-women-20-v3/README.md.',
        priorSizedRelease: {cases: earlierCases.length, distinctPrimaryConcepts: new Set(earlierCases.flatMap(caseConcepts)).size},
        omittedProfileModelWarning: 'The following base-demographics-only comparison is intentionally incorrect for runtime: createEncounter randomly selects approvedInstantiationProfiles before demographic completion. It is included solely to diagnose the earlier demographic claim.',
        currentPatientBaseDemographicsOnly: baseOnly,
        priorSizedAllCasesBaseDemographicsOnly: earlierBaseOnly,
        conclusion: 'Ignoring profile overrides materially biases age/sex demand. Use the current profile-aware runtime model and the approved roster for this new batch; no existing approved art is removed.',
      },
      scenarios,
      recommendationScenario: 'level-3-all-unlocked-operational',
      recommendation: scenarios.find(scenario => scenario.id === 'level-3-all-unlocked-operational').recommendedTwenty,
      validation: {runtimeCompletionChecks: completionChecks, actualFirstUnseenSelectorChecks: selectorChecks, sourceFilesUnchangedDuringAudit: true, noRuntimeOrClinicalWrites: true},
      sourceHashes,
      releaseDemographicFingerprintSha256: hashText(JSON.stringify(rawRows)),
      caseDemographicProfiles: release.cases.map(clinicalCase => ({caseId: clinicalCase.id, profiles: distributions.get(clinicalCase.id).profileRows})).sort((left, right) => left.caseId.localeCompare(right.caseId)),
    };
  } finally { await vite.close(); }
}

function markdown(audit) {
  const scenario = audit.scenarios.find(row => row.id === audit.recommendationScenario);
  const pct = value => `${(value * 100).toFixed(2)}%`;
  const table = scenario.conceptFirst.cells.filter(row => row.ageBand !== 'under-18').map(row => `| ${row.sex} | ${row.ageBand} | ${pct(row.encounterShare)} | ${row.stills} | ${pct(row.sharePerStill)} |`).join('\n');
  return `# Current question demographics and next 20 still designs\n\n` +
    `This is software mix analysis for visual planning. It does not change questions, clinical review status, runtime selection or medical probabilities. The release remains \`${audit.release.publicationStatus}\`.\n\n` +
    `The current release has ${audit.release.declaredConcepts} declared concepts, ${audit.release.cases} authored cases and ${audit.release.decisionNodes} decision nodes; ${audit.release.employeeDiscussionCases} cases are employee discussions. There are ${audit.release.patientCases} patient cases and ${audit.release.routinePatientCases} routine-eligible patient cases. The adult-patient catalog has ${audit.currentRoster.adultPatientStills} designs, including the 20 approved women in v3.\n\n` +
    `Recommended next batch: ${audit.recommendation.allocation.map(row => `${row.additions} ${row.sex.toLowerCase()} patients aged ${row.ageBand}`).join(' and ')}. Ages within each visual band are art briefs, not additional clinical constraints.\n\n` +
    `The table models a fully equipped Level 3 facility's first unseen routine encounter: uniform eligible primary concept, then uniform eligible case containing that concept, then uniform authored profile. It excludes employee discussions and honors stage/capability gates. Explicit demographics take priority; missing display values use existing runtime completion rules.\n\n` +
    `| Sex | Visual age band | Modeled encounter share | Current designs | Share per design |\n|---|---|---:|---:|---:|\n${table}\n\n` +
    `The 20 slots are assigned successively to the cell with the highest encounter share divided by available designs. Afterwards the allocated cells carry ${audit.recommendation.allocation.map(row => `${pct(row.afterSharePerStill)} per design (${row.afterStills} ${row.sex.toLowerCase()} ${row.ageBand} designs)`).join('; ')}. Runtime occupancy/LRU rotation remains authoritative; this load proxy is not a measured repeat rate.\n\n` +
    `The JSON receipt separately records raw equal-case and equal-question comparisons, all-release comparison, fully equipped Levels 0–3, an endoscopy-capability sensitivity, per-concept case pools, demographic profiles and every source hash. It also checks the mirrored display rules against ${audit.validation.runtimeCompletionChecks} actual runtime completions and checks ${audit.validation.actualFirstUnseenSelectorChecks} actual selector results.\n\n` +
    `No authored patient profile is pediatric: ${audit.release.pediatricAuthoredProfileRows} under-18 profile rows. The existing ${audit.currentRoster.futurePediatricStills.length} pediatric designs remain future-only, excluded until a future approved pediatric release. No new pediatric art is needed for this current question mix.\n\n` +
    `This is a first-unseen planning snapshot. Actual encounters depend on active concepts, FSRS due dates, capabilities and separate tutorial/critical paths; it is not an exact campaign-long frequency prediction. Visual diversity is independent of disease and question selection.\n\n` +
    `The earlier women-v3 README described a smaller 856-case/291-concept snapshot and about 87.5% female encounters. The diagnostic section shows that ignoring approved profile overrides can reproduce that skew; actual runtime selects a profile before display completion. The current profile-aware model therefore takes precedence. Existing approved women remain useful and unchanged.\n\n` +
    `Run from the repository root with the installed Node runtime:\n\n\`\`\`text\nnode tools/character-mapping/patient-demographics20-v4/demographic-audit.mjs --check\n\`\`\`\n\nUse \`--write\` to create or deliberately refresh the analysis receipt after reviewing a content/roster change. Vite runs in middleware mode without a network listener and closes before exit.\n`;
}

const audit = await buildAudit();
if (process.argv.includes('--write')) {
  await mkdir(output, {recursive: true});
  await writeFile(receiptPath, JSON.stringify(audit, null, 2) + '\n');
  await writeFile(notePath, markdown(audit));
}
if (process.argv.includes('--check')) {
  assert(isDeepStrictEqual(JSON.parse(await readFile(receiptPath, 'utf8')), audit), 'Demographic receipt changed: review the actual content/roster difference before refreshing.');
  assert.equal(await readFile(notePath, 'utf8'), markdown(audit), 'Demographic markdown does not match rebuilt receipt.');
}
const femaleShare = distribution => round(sum(distribution.cells.filter(row => row.sex === 'Female').map(row => row.encounterShare)));
process.stdout.write(JSON.stringify({
  status: 'PASS',
  releaseCounts: {concepts: audit.release.declaredConcepts, cases: audit.release.cases, decisionNodes: audit.release.decisionNodes, profileRows: audit.release.profileRows, employeeDiscussionCases: audit.release.employeeDiscussionCases, patientCases: audit.release.patientCases, patientDecisionNodes: audit.release.patientDecisionNodes},
  currentAdultPatientDesigns: audit.currentRoster.adultPatientStills,
  sourceHashCount: Object.keys(audit.sourceHashes).length,
  recommendation: audit.recommendation.allocation,
  scenarioSummaries: audit.scenarios.map(scenario => ({id: scenario.id, cases: scenario.counts.cases, concepts: scenario.counts.distinctPrimaryConcepts, additions: Object.fromEntries(scenario.recommendedTwenty.allocation.map(row => [`${row.sex}|${row.ageBand}`, row.additions]))})),
  diagnosticFemaleShares: {currentRuntimeProfileAware: femaleShare(audit.scenarios.find(scenario => scenario.id === audit.recommendationScenario).conceptFirst), priorSizedIncorrectBaseOnly: femaleShare(audit.priorReadmeDiscrepancyDiagnostic.priorSizedAllCasesBaseDemographicsOnly)},
  validation: audit.validation,
  receipt: rel(receiptPath),
}, null, 2) + '\n');
