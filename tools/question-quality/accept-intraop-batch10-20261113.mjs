import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';

const base = 'question-intraop-acceptance-batch10';
const date = '20261113';
const clinicalDirectory = 'packages/clinical-content/src/';
const beforePath = `tools/question-quality/fixtures/${base}-before-${date}.json`;
const decision = `docs/research/${base}-${date}.md`;
const sha = value => createHash('sha256').update(value).digest('hex');
const digest = value => sha(JSON.stringify(value));
const read = path => JSON.parse(fs.readFileSync(path, 'utf8').replace(/^\uFEFF/, ''));
const write = (path, value) => fs.writeFileSync(path, JSON.stringify(value, null, 2) + '\n');

const equipmentRequests = [
  ['asc-access-and-soft-tissue-surprises', 'node.intraop.asc-access.anterior-port-course.20261112.v1', 'procedure.central_venous_port_insertion', ['capability.fluoroscopy']],
  ['biliary-safety-and-duct-decisions', 'node.intraop.biliary-safety.major-injury-transfer.20261112.v1', 'procedure.laparoscopic_cholecystectomy', ['capability.fluoroscopy', 'capability.intraoperative_cholangiography']],
  ['biliary-safety-and-duct-decisions', 'node.intraop.biliary-safety.stone-clearance-route.20261112.v1', 'procedure.laparoscopic_cholecystectomy', ['capability.fluoroscopy', 'capability.intraoperative_cholangiography', 'capability.transcystic_exploration']],
  ['biliary-safety-and-duct-decisions', 'node.intraop.biliary-safety.unexplained-bile.20261112.v1', 'procedure.laparoscopic_cholecystectomy', ['capability.fluoroscopy', 'capability.intraoperative_cholangiography']],
  ['endoscopic-perforation-and-injury', 'node.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1', 'procedure.colonoscopy_polypectomy', ['capability.endoscopic_closure', 'capability.endoscopic_rescue']],
  ['endoscopic-perforation-and-injury', 'node.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1', 'procedure.egd', ['capability.endoscopic_closure', 'capability.endoscopic_rescue']],
  ['endoscopic-perforation-and-injury', 'node.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1', 'procedure.colonoscopy_polypectomy', ['capability.endoscopic_closure', 'capability.endoscopic_rescue']],
  ['suspicious-polyps-retrieval-and-tattoo', 'node.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1', 'procedure.colonoscopy_polypectomy', ['capability.chromoendoscopy']],
].map(([slug, nodeId, familyId, capabilities]) => ({slug, nodeId, familyId, capabilities}));

const salvageTopics = [
  'anesthetic-intraoperative-crises', 'anorectal-eua-and-fistula', 'endoscopic-upper-gi-hemostasis',
  'parathyroid-localization-and-preservation', 'pediatric-anesthesia-events', 'pediatric-orchiopexy-findings',
];

function sourceArrays(module, pattern) {
  return Object.entries(module)
    .filter(([name, value]) => pattern.test(name) && Array.isArray(value))
    .flatMap(([, value]) => value);
}

function observeSources() {
  const observed = {};
  function walk(directory) {
    for (const item of fs.readdirSync(directory, {withFileTypes: true})) {
      const path = directory + '/' + item.name;
      if (item.isDirectory()) walk(path);
      else if (/\.(ts|tsx)$/.test(path)) observed[path] = sha(fs.readFileSync(path));
    }
  }
  for (const directory of ['packages/clinical-content/src', 'packages/game-domain/src', 'packages/game-domain/tests', 'packages/balance-config/src', 'apps/player/src']) walk(directory);
  return observed;
}

if (process.argv.includes('capture')) {
  assert(!fs.existsSync(beforePath), 'Keep the first intake immutable');
  const content = await import('../../packages/clinical-content/src/index.ts');
  const reviewPath = 'docs/research/question-intraop-salvage-review-20261113.json';
  const salvageReviews = read(reviewPath);
  const inputs = new Map();
  const input = path => {
    if (fs.existsSync(path)) inputs.set(path, {path, sha256: sha(fs.readFileSync(path))});
  };
  input(reviewPath);
  const modules = {};
  for (const slug of new Set([...equipmentRequests.map(row => row.slug), ...salvageTopics])) {
    const path = `${clinicalDirectory}question-intraop-${slug}-20261112.ts`;
    const module = await import('../../' + path);
    input(path);
    for (const path of [
      `docs/research/question-intraop-${slug}-20261112.json`,
      `docs/research/sources-question-intraop-${slug}-20261112.json`,
      `docs/research/question-intraop-${slug}-20261112.md`,
    ]) input(path);
    const reviewFiles = fs.readdirSync('docs/research').filter(name =>
      name.startsWith(`question-intraop-${slug}-review`) && name.endsWith('-20261112.json'));
    const rank = name => Number(name.match(/-review(\d*)-/)?.[1] || 1);
    reviewFiles.sort((a, b) => rank(a) - rank(b));
    const reviews = reviewFiles.map(name => {
      const path = 'docs/research/' + name;
      input(path);
      return {path, records: read(path)};
    });
    const salvageKey = Object.keys(module).find(name => name.endsWith('_SALVAGE'));
    const salvage = salvageKey ? module[salvageKey] : null;
    modules[slug] = {
      path,
      cases: sourceArrays(module, /(?<!SALVAGE)(?<!RETAINED)(?<!REVIEWED)_CASES$/)
        .filter(row => Array.isArray(row.decisionNodes)),
      questions: sourceArrays(module, /(?<!RETAINED)(?<!REVIEWED)_QUESTIONS$/),
      concepts: sourceArrays(module, /(?<!AUTHORING)_CONCEPTS$/),
      authoredConcepts: sourceArrays(module, /AUTHORING_CONCEPTS$|CONCEPT_PROPOSALS$/),
      timings: sourceArrays(module, /TIMING_ENTRIES$|TIMING_PROPOSALS$/),
      claims: sourceArrays(module, /CLAIMS$/),
      sources: sourceArrays(module, /SOURCES$/),
      reviews,
      salvage,
    };
  }
  const candidates = [];
  const seen = new Set();
  for (const request of equipmentRequests) {
    const source = modules[request.slug];
    const clinicalCase = source.cases.find(row => row.decisionNodes.some(node => node.id === request.nodeId));
    assert(clinicalCase, request.nodeId);
    if (seen.has(clinicalCase.id)) continue;
    seen.add(clinicalCase.id);
    const requests = equipmentRequests.filter(row => clinicalCase.decisionNodes.some(node => node.id === row.nodeId));
    const reviews = clinicalCase.decisionNodes.map(node => {
      const matches = source.reviews.flatMap(review => review.records
        .filter(record => record.nodeId === node.id)
        .map(record => ({path: review.path, record})));
      return matches.at(-1);
    });
    candidates.push({group: 'ENG-I01b', slug: request.slug, case: clinicalCase, requests, reviews});
  }
  for (const slug of salvageTopics) {
    const source = modules[slug];
    assert(source.salvage, slug + ' salvage export');
    for (const clinicalCase of source.salvage.cases) {
      const reviews = clinicalCase.decisionNodes.map(node => ({path: reviewPath,
        record: salvageReviews.find(row => row.caseId === clinicalCase.id && row.nodeId === node.id)}));
      candidates.push({group: 'salvage', slug, case: clinicalCase, requests: [], reviews});
    }
  }
  assert.equal(candidates.length, 14);
  assert.equal(candidates.flatMap(row => row.case.decisionNodes).length, 16);
  const paths = [
    ...['question-ship-manifest.ts', 'synthetic-content.ts', 'index.ts', 'answer-choice-timing.ts',
      'answer-choice-timing.test.ts', 'question-ship-manifest.test.ts', 'patient-library-wording-repair.test.ts',
      'question-program-batch9-acceptance-test-support.ts', 'question-program-batch9-acceptance-20261112.test.ts',
      'question-intraop-anesthetic-intraoperative-crises-20261112.test.ts'].map(name => clinicalDirectory + name),
    'packages/game-domain/src/test-choice-orders.ts', 'apps/player/src/session/topicRuntimeBindings.test.ts',
  ];
  const schemaPath = 'packages/clinical-content/src/schema.ts';
  const schemaBeforePath = '.local-dev/eng-i01-live-procedure-questions-20261112/before/' + schemaPath;
  const schemaBefore = fs.readFileSync(schemaBeforePath, 'utf8');
  const schemaAfter = fs.readFileSync(schemaPath, 'utf8');
  assert.equal(sha(schemaBefore), 'c4d1640ba549c49b6a3dc7bfdf9155504611dd04c756865bc9f5fa0fd40015c7');
  assert.equal(sha(schemaAfter), '530198fa3bb3f9270ba1eaee74974011736d98ba6deb14e9cd27e19d63108296');
  const authority = 'docs/execplans/eng-i01-live-procedure-questions-20261112.md';
  input(authority);
  write(`tools/question-quality/fixtures/${base}-schema-pin-${date}.json`, {
    path: schemaPath, beforeText: schemaBefore, beforeSha256: sha(schemaBefore), afterSha256: sha(schemaAfter),
    authority, purpose: 'Reconcile the I11 authoring-era source pin through the exact manager-approved optional ENG-I01 source-context schema addition.',
  });
  write(beforePath, {
    capturedOn: '2026-11-13', candidates, modules, equipmentRequests,
    excluded: salvageReviews.filter(row => row.caseId.includes('polypectomy')),
    defaultRelease: content.SYNTHETIC_CLINICAL_RELEASE,
    defaultSha256: digest(content.SYNTHETIC_CLINICAL_RELEASE),
    manifest: content.QUESTION_SHIP_MANIFEST, manifestSha256: digest(content.QUESTION_SHIP_MANIFEST),
    timing: content.ANSWER_CHOICE_TIMING_REGISTRY, timingSha256: digest(content.ANSWER_CHOICE_TIMING_REGISTRY),
    catalogSha256: digest(content.QUESTION_CATALOG_RELEASE), sourceInputs: [...inputs.values()], observed: observeSources(),
    sourcePreimages: paths.map(path => ({path, beforeText: fs.readFileSync(path, 'utf8'), beforeSha256: sha(fs.readFileSync(path))})),
  });
  console.log('Captured 16 requested nodes in 14 complete cases and the exact pre-batch10 source epoch.');
}

function replacePatientNames(value, name, path, corrections) {
  if (typeof value === 'string') {
    let after = value;
    for (const part of [name, name.split(' ')[0]]) after = after.replace(new RegExp('\\b' + part + '\\b', 'g'), '{patientName}');
    if (after !== value) corrections.push({path, before: value, after, kind: 'patient_name_placeholder'});
    return after;
  }
  if (Array.isArray(value)) return value.map((item, index) => replacePatientNames(item, name, `${path}[${index}]`, corrections));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key,
    ['id', 'patientDisplayName', 'patientPresentationVariantId'].includes(key) ? item : replacePatientNames(item, name, path + '.' + key, corrections)]));
  return value;
}

if (process.argv.includes('build')) {
  const before = read(beforePath);
  const {procedureFamilyKind, supportedProcedureContext} = await import('../../packages/game-domain/src/procedure-context.ts');
  const accepted = [], skipped = [], questions = [], timings = [], orders = [], families = [], frozen = [], corrections = [];
  const views = {}, authoredConcepts = [], usedTopics = new Set();
  for (const candidate of before.candidates) {
    const {slug, group} = candidate;
    const source = before.modules[slug];
    const original = candidate.case;
    if (candidate.reviews.some(review => review?.record?.verdict !== 'PASS')) {
      skipped.push({caseId: original.id, nodeIds: original.decisionNodes.map(node => node.id), reason: 'A scored sibling lacks the required independent PASS.'});
      continue;
    }
    let proposal;
    if (group === 'salvage') proposal = source.salvage.procedureContextProposals.find(row => row.caseId === original.id);
    let context;
    if (group === 'ENG-I01b') {
      const request = candidate.requests[0];
      assert(candidate.requests.every(row => row.familyId === request.familyId));
      const kind = procedureFamilyKind(request.familyId);
      assert(kind, request.familyId);
      context = {version: 'procedure-context.v1', mode: 'live', familyId: request.familyId, kind, phase: 'procedure',
        allowedIncomeLineIds: [kind === 'operation' ? 'income.ambulatory_operation' : 'income.endoscopy'],
        requiredCapabilityIds: [...new Set([...original.requiredCapabilityIds, ...candidate.requests.flatMap(row => row.capabilities)])]};
    } else if (original.requiredClinicalSetting === 'clinic') {
      context = {version: 'procedure-context.v1', mode: 'chart_review', familyId: 'procedure.egd',
        recordKind: 'endoscopy_report', recordCheckpoint: 'Initial source-directed endoscopic treatment'};
    } else if (proposal?.procedureContext) {
      context = structuredClone(proposal.procedureContext);
    } else if (slug === 'pediatric-orchiopexy-findings') {
      context = {version: 'procedure-context.v1', mode: 'live', familyId: 'procedure.orchiopexy', kind: 'operation', phase: 'procedure',
        allowedIncomeLineIds: ['income.ambulatory_operation', 'income.ambulatory_operation_extended'],
        requiredCapabilityIds: [...original.requiredCapabilityIds], pediatricFamilyContext: proposal.pediatricFamily};
    } else if (slug === 'anesthetic-intraoperative-crises') {
      context = {version: 'procedure-context.v1', mode: 'live', familyId: 'procedure.groin_hernia_repair', kind: 'operation', phase: 'procedure',
        allowedIncomeLineIds: ['income.ambulatory_operation', 'income.ambulatory_operation_extended'], requiredCapabilityIds: [...original.requiredCapabilityIds]};
    } else {
      const proposed = proposal?.proposedContext ?? proposal;
      skipped.push({caseId: original.id, nodeIds: original.decisionNodes.map(node => node.id),
        familyId: proposed?.familyId, reason: 'The reviewed live case requires a procedure family and specialized resources outside the current ENG-I01b registry.'});
      continue;
    }
    const clinicalCase = replacePatientNames(structuredClone(original), original.patientDisplayName, original.id, corrections);
    clinicalCase.routineEligible = true;
    clinicalCase.procedureContext = context;
    const summary = clinicalCase.decisionNodes.map(node => node.explanation).join(' ');
    if (summary !== clinicalCase.learningSummary) {
      corrections.push({path: clinicalCase.id + '.learningSummary', before: clinicalCase.learningSummary, after: summary,
        kind: summary.replace(/\s+/g, ' ') === clinicalCase.learningSummary.replace(/\s+/g, ' ')
          ? 'native_summary_whitespace' : 'native_summary_from_exact_reviewed_node_explanations'});
      clinicalCase.learningSummary = summary;
    }
    if (context.mode === 'live') assert(supportedProcedureContext(clinicalCase), clinicalCase.id + ' supported source contract');
    if (clinicalCase.pediatricProfile) {
      const family = context.pediatricFamilyContext;
      assert(family, clinicalCase.id + ' child-parent-art context');
      families.push({id: clinicalCase.id.replace(/^case\./, 'family.'), caseId: clinicalCase.id, ...family,
        prototypeDemographics: clinicalCase.prototypeDemographics, parentCount: 1, parentPlacement: 'same_room_throughout',
        metadataSource: 'tools/character-mapping/level3-roster-complete-v2/roster.json', profileValuesBasis: 'editorial_art_contract_not_disease_probability',
        reviewStatus: 'needs_clinician_review', aiAssistedDrafting: true, lastClinicianReview: null});
    }
    const viewName = 'intraop-batch10-' + slug;
    views[viewName] ??= {...before.defaultRelease, cases: [], concepts: []};
    views[viewName].cases.push(clinicalCase);
    usedTopics.add(slug);
    for (const node of clinicalCase.decisionNodes) {
      const sourceQuestion = (group === 'salvage' ? source.salvage.questions : source.questions).find(row => row.id === node.questionVariantId);
      assert(sourceQuestion, node.questionVariantId);
      const question = replacePatientNames(sourceQuestion, original.patientDisplayName, sourceQuestion.id, corrections);
      assert.equal(question.reviewStatus, 'needs_clinician_review');
      questions.push(question);
      const concept = (group === 'salvage' ? source.salvage.concepts : source.concepts).find(row => row.id === node.primaryConceptId);
      assert(concept, node.primaryConceptId);
      if (!views[viewName].concepts.some(row => row.id === concept.id)) views[viewName].concepts.push(concept);
      const authored = (group === 'salvage' ? source.salvage.authoringConcepts : source.authoredConcepts).find(row => row.id === concept.id);
      assert(authored, concept.id + ' authored metadata');
      authoredConcepts.push(authored);
      const row = {acceptanceId: question.id, caseId: clinicalCase.id, nodeId: node.id, questionVariantId: question.id,
        conceptId: node.primaryConceptId, sourceView: viewName, decision};
      accepted.push(row);
      const timing = (group === 'salvage' ? source.salvage.timingEntries : source.timings).find(row =>
        row.caseId === original.id && row.nodeId === node.id && row.questionVariantId === node.questionVariantId);
      assert(timing, node.id + ' exact timing classification');
      timings.push(timing);
      if (timing.classification.kind === 'test_choices') for (const option of timing.classification.choices.filter(row => row.timing.kind === 'test')) {
        assert(node.answerChoices.some(row => row.id === option.choiceId && row.label === option.choiceLabel));
        orders.push({caseId: clinicalCase.id, nodeId: node.id, questionVariantId: question.id, choiceId: option.choiceId,
          choiceLabel: option.choiceLabel, timingProfileId: option.timing.timingProfileId,
          disposition: {kind: 'not_executed', reason: 'future_planned'}});
      }
      const sourceNode = original.decisionNodes.find(row => row.id === node.id);
      frozen.push({group, slug, caseId: clinicalCase.id, nodeId: node.id, questionVariantId: question.id,
        sourceQuestionJson: JSON.stringify(sourceQuestion), sourceNodeJson: JSON.stringify(sourceNode), sourceCaseJson: JSON.stringify(original),
        sourceQuestionSha256: digest(sourceQuestion), sourceNodeSha256: digest(sourceNode), sourceCaseSha256: digest(original),
        acceptedQuestionSha256: digest(question), acceptedNodeSha256: digest(node), acceptedCaseSha256: digest(clinicalCase),
        review: candidate.reviews.find(review => review.record.nodeId === node.id)});
    }
  }
  assert.equal(accepted.length, 13);
  assert.equal(skipped.length, 3);
  assert.equal(Object.values(views).flatMap(view => view.cases).length, 11);
  const claims = [...new Map([...usedTopics].flatMap(slug => before.modules[slug].claims).map(row => [row.id, row])).values()];
  const sources = [...new Map([...usedTopics].flatMap(slug => before.modules[slug].sources).map(row => [row.id, row])).values()];
  for (const question of questions) for (const id of question.supportingEvidenceClaimIds) {
    const claim = claims.find(row => row.id === id);
    assert(claim, id);
    for (const sourceId of claim.sourceIds) assert(sources.some(row => row.id === sourceId), sourceId);
  }
  const exports = {
    PROGRAM_BATCH10_ROWS: ['QuestionShipAcceptance[]', accepted],
    PROGRAM_BATCH10_VIEWS: ['Record<string,SyntheticClinicalRelease>', views],
    PROGRAM_BATCH10_QUESTIONS: ['Array<QuestionVariant & Record<string,unknown>>', questions],
    PROGRAM_BATCH10_AUTHORED_CONCEPTS: [null, authoredConcepts],
    PROGRAM_BATCH10_TIMINGS: ['AnswerChoiceTimingRegistryEntry[]', timings],
    PROGRAM_BATCH10_ORDERS: [null, orders], PROGRAM_BATCH10_FAMILIES: [null, families],
    PROGRAM_BATCH10_FROZEN: [null, frozen], PROGRAM_BATCH10_CORRECTIONS: [null, corrections],
    PROGRAM_BATCH10_CLAIMS: ['Array<EvidenceClaim & Record<string,unknown>>', claims],
    PROGRAM_BATCH10_SOURCES: ['Array<ClinicalSource & Record<string,unknown>>', sources],
  };
  let text = '// Frozen manager acceptance for the reviewed source versions.\n' +
    'import type {SyntheticClinicalRelease,AnswerChoiceTimingRegistryEntry} from "./schema";\n' +
    'import type {QuestionVariant,EvidenceClaim,ClinicalSource} from "./pilot-schema";\n' +
    'import type {QuestionShipAcceptance} from "./question-ship-manifest";\n';
  for (const [name, [type, value]] of Object.entries(exports)) {
    text += `export const ${name}${type ? ':' + type : ''} = ${JSON.stringify(value, null, 2)}` +
      (name === 'PROGRAM_BATCH10_ORDERS' || name === 'PROGRAM_BATCH10_FAMILIES' ? ' as const' : '') + ';\n';
  }
  fs.writeFileSync(clinicalDirectory + 'question-program-batch10-accepted-data-20261113.ts', text);
  write(`docs/research/${base}-dispositions-${date}.json`, {accepted, skipped, excluded: before.excluded, corrections, orders, families});
  write(`docs/research/${base}-source-freeze-${date}.json`, {records: frozen, sourceInputs: before.sourceInputs});
  console.log(JSON.stringify({accepted: accepted.length, skipped: skipped.length, cases: 11, waits: orders.length, families: families.length, corrections: corrections.length}));
}

function replaceOnce(text, before, after) {
  assert.equal(text.split(before).length, 2, 'Unique integration anchor ' + before);
  return text.replace(before, after);
}

function closingIndex(text, anchor) {
  let position = text.indexOf(anchor);
  assert(position >= 0, anchor);
  position += anchor.length - 1;
  const open = text[position], close = open === '[' ? ']' : '}';
  let depth = 0, quoted = false, escaped = false, line = false, comment = false;
  for (; position < text.length; position++) {
    const char = text[position], next = text[position + 1];
    if (line) { if (char === '\n') line = false; continue; }
    if (comment) { if (char === '*' && next === '/') { comment = false; position++; } continue; }
    if (quoted) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') quoted = false;
      continue;
    }
    if (char === '/' && next === '/') { line = true; position++; continue; }
    if (char === '/' && next === '*') { comment = true; position++; continue; }
    if (char === '"') { quoted = true; continue; }
    if (char === open) depth++;
    if (char === close && --depth === 0) return position;
  }
  throw new Error('Unclosed ' + anchor);
}

if (process.argv.includes('integrate')) {
  const before = read(beforePath);
  const data = await import('../../packages/clinical-content/src/question-program-batch10-accepted-data-20261113.ts');
  function edit(path, change) {
    const original = fs.readFileSync(path, 'utf8');
    assert.equal(sha(original), before.observed[path], path + ' exact intake');
    fs.writeFileSync(path, change(original));
  }
  edit(clinicalDirectory + 'question-ship-manifest.ts', text => {
    const rows = data.PROGRAM_BATCH10_ROWS;
    assert(rows.every(row => !before.manifest.accepted.some(old => old.acceptanceId === row.acceptanceId)));
    const end = closingIndex(text, '  accepted: [');
    const comma = /,\s*$/.test(text.slice(0, end)) ? '' : ',';
    text = text.slice(0, end) + comma + '\n  // Batch10 exact whole-case ENG-I01b and standalone salvage acceptance.\n' +
      JSON.stringify(rows, null, 2).slice(1, -1) + ',\n' + text.slice(end);
    const headers = Object.fromEntries(rows.map(row => [row.caseId, row.sourceView]));
    assert(Object.keys(headers).every(id => !before.manifest.headerSources[id]));
    const headerEnd = closingIndex(text, '  headerSources: {');
    const headerComma = /,\s*$/.test(text.slice(0, headerEnd)) ? '' : ',';
    text = text.slice(0, headerEnd) + headerComma + '\n' + JSON.stringify(headers, null, 2).slice(1, -1) + '\n' + text.slice(headerEnd);
    return replaceOnce(text, 'question-ship.2026-11-12.v18', 'question-ship.2026-11-13.v19');
  });
  edit(clinicalDirectory + 'synthetic-content.ts', text => {
    text = 'import {QUESTION_PROGRAM_BATCH10_ACCEPTED_SOURCE_VIEWS,withAcceptedQuestionProgramBatch10Concepts} from "./question-program-batch10-accepted-20261113";\n' + text;
    text = replaceOnce(text, 'projectManagerAcceptedQuestions(withAcceptedQuestionProgramBatch9Concepts(',
      'projectManagerAcceptedQuestions(withAcceptedQuestionProgramBatch10Concepts(withAcceptedQuestionProgramBatch9Concepts(');
    const line = text.split('\n').find(row => row.includes('export const SYNTHETIC_CLINICAL_RELEASE ='));
    assert(line);
    text = replaceOnce(text, line, line.replace('), QUESTION_FLAGS_PRE_REVISION_RELEASE, {', ')), QUESTION_FLAGS_PRE_REVISION_RELEASE, {'));
    return replaceOnce(text, '  ...QUESTION_PROGRAM_BATCH9_ACCEPTED_SOURCE_VIEWS,',
      '  ...QUESTION_PROGRAM_BATCH10_ACCEPTED_SOURCE_VIEWS,\n  ...QUESTION_PROGRAM_BATCH9_ACCEPTED_SOURCE_VIEWS,');
  });
  edit(clinicalDirectory + 'index.ts', text => replaceOnce(text,
    'QUESTION_PROGRAM_BATCH9_RUNTIME_FAMILY_CONTEXTS as PEDIATRIC_CLINIC_FAMILY_CONTEXTS} from "./question-program-batch9-accepted-20261112"',
    'QUESTION_PROGRAM_BATCH10_RUNTIME_FAMILY_CONTEXTS as PEDIATRIC_CLINIC_FAMILY_CONTEXTS} from "./question-program-batch10-accepted-20261113"') +
    '\nexport * from "./question-program-batch10-accepted-20261113";\n');
  edit(clinicalDirectory + 'answer-choice-timing.ts', text => text +
    '\nimport {QUESTION_PROGRAM_BATCH10_ACCEPTED_TIMING_ENTRIES} from "./question-program-batch10-accepted-20261113";\nANSWER_CHOICE_TIMING_REGISTRY.push(...QUESTION_PROGRAM_BATCH10_ACCEPTED_TIMING_ENTRIES);\n');
  edit('packages/game-domain/src/test-choice-orders.ts', text => replaceOnce(
    'import {QUESTION_PROGRAM_BATCH10_ACCEPTED_TEST_ORDER_RECORDS} from "@gamify-surgery/clinical-content";\n' + text,
    '  ...QUESTION_PROGRAM_BATCH9_ACCEPTED_TEST_ORDER_RECORDS,',
    '  ...QUESTION_PROGRAM_BATCH9_ACCEPTED_TEST_ORDER_RECORDS,\n  ...QUESTION_PROGRAM_BATCH10_ACCEPTED_TEST_ORDER_RECORDS,'));
  console.log('Integrated batch10 rows, frozen views, concepts, families and exact planning waits.');
}

if (process.argv.includes('record')) {
  const before = read(beforePath), content = await import('../../packages/clinical-content/src/index.ts');
  const release = content.SYNTHETIC_CLINICAL_RELEASE;
  const cases = content.QUESTION_PROGRAM_BATCH10_ACCEPTED_CASES;
  const rows = content.QUESTION_PROGRAM_BATCH10_ACCEPTED_ROWS;
  const after = {
    defaultSha256: digest(release), manifestSha256: digest(content.QUESTION_SHIP_MANIFEST),
    timingSha256: digest(content.ANSWER_CHOICE_TIMING_REGISTRY), catalogSha256: digest(content.QUESTION_CATALOG_RELEASE),
    newCaseIds: cases.map(row => row.id), newQuestionIds: rows.map(row => row.questionVariantId),
    newConceptIds: release.concepts.filter(row => !before.defaultRelease.concepts.some(old => old.id === row.id)).map(row => row.id),
    cases: release.cases.length, nodes: release.cases.flatMap(row => row.decisionNodes).length,
    registeredMeanings: release.concepts.length,
    scoredMeanings: new Set(release.cases.flatMap(row => row.decisionNodes.map(node => node.primaryConceptId))).size,
    acceptedRows: content.QUESTION_SHIP_MANIFEST.accepted.length, timingEntries: content.ANSWER_CHOICE_TIMING_REGISTRY.length,
    caseHashes: Object.fromEntries(release.cases.map(row => [row.id, digest(row)])),
    conceptHashes: Object.fromEntries(release.concepts.map(row => [row.id, digest(row)])),
  };
  write(`tools/question-quality/fixtures/${base}-after-${date}.json`, after);
  const extraPath = `tools/question-quality/fixtures/${base}-test-source-before-${date}.json`;
  const preimages = [...before.sourcePreimages, ...(fs.existsSync(extraPath) ? read(extraPath) : [])];
  const files = preimages.filter(row => sha(fs.readFileSync(row.path)) !== row.beforeSha256)
    .map(row => ({...row, afterSha256: sha(fs.readFileSync(row.path))}));
  write(`tools/question-quality/fixtures/${base}-source-migration-${date}.json`, {files});
  console.log(JSON.stringify({...after, caseHashes: undefined, conceptHashes: undefined}));
}
