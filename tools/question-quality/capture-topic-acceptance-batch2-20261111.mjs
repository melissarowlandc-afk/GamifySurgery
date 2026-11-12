import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {TOPIC_BATCH2_CONFIG} from './topic-acceptance-batch2-config-20261111.mjs';
import {collectAuthoredMetadata} from './bank.mjs';
import {syntheticClinicalCaseSchema} from '../../packages/clinical-content/src/schema.ts';
const content = await import('../../packages/clinical-content/src/index.ts');
const domain = await import('../../packages/game-domain/src/index.ts');
const {createLevelFourRoomsQaState} = await import('../../tests/fixtures/level-four-rooms.ts');
const hash = value => createHash('sha256').update(value).digest('hex');
const digest = value => hash(JSON.stringify(value));
const raw = path => hash(fs.readFileSync(path));
const read = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const output = 'tools/question-quality/fixtures/question-topic-acceptance-batch2-before-20261111.json';
assert(!fs.existsSync(output), 'Intake is immutable. Use the existing capture.');
const modules = {}, topics = [];
const values = (module, names) => (Array.isArray(names) ? names : [names]).flatMap(name => {
  assert(Array.isArray(module[name]), 'Missing export ' + name);
  return module[name];
});
function unique(records) {
  return [...new Map(records.map(record => [digest(record), record])).values()];
}
let prepared = createLevelFourRoomsQaState(domain.PROTOTYPE_DOMAIN_CONTEXT);
for (const command of [
  {type:'PLACE_ROOM', operationId:'topic2.exam', roomDefinitionId:'room.examination', roomId:'room.topic2.exam', x:35, y:24, orientation:0},
  {type:'PLACE_DOOR', operationId:'topic2.door', roomId:'room.topic2.exam', doorId:'door.topic2.exam', side:'south', offset:1},
]) {
  prepared = domain.gameReducer(prepared, command, domain.PROTOTYPE_DOMAIN_CONTEXT);
  assert.equal(prepared.operationReceipts[command.operationId]?.status, 'applied');
}
Object.assign(prepared, {paused:false, serviceAppointmentsEnabled:false, nextRoutineArrivalTick:Number.MAX_SAFE_INTEGER, nextEmployeeDiscussionTick:Number.MAX_SAFE_INTEGER});
for (const config of TOPIC_BATCH2_CONFIG) {
  const sourcePath = `packages/clinical-content/src/question-topic-${config.slug}-20261111.ts`;
  const packetPath = `docs/research/question-topic-${config.slug}-20261111.json`;
  const ledgerPath = `docs/research/sources-question-topic-${config.slug}-20261111.json`;
  const sourceHash = raw(sourcePath), packetHash = raw(packetPath);
  const module = await import('../../' + sourcePath);
  modules[config.slug] = module;
  const packet = read(packetPath);
  const reviews = fs.readdirSync('docs/research').filter(name => name.startsWith('question-topic-' + config.slug + '-review') && name.endsWith('-20261111.json'))
    .sort((a,b) => Number(a.match(/review(\d+)/)?.[1] ?? 1) - Number(b.match(/review(\d+)/)?.[1] ?? 1))
    .map(name => ({path:'docs/research/' + name, sha256:raw('docs/research/' + name), records:read('docs/research/' + name)}));
  const evidence = node => reviews.flatMap(review => review.records.filter(record => record.id === node.questionVariantId || record.nodeId === node.id)
    .map(record => ({path:review.path, record}))).at(-1);
  const retained = config.slug === 'vascular-aorta' ? packet.frozenPassContexts : [];
  const cases = unique([...values(module, config.cases), ...retained.map(record => record.clinicalCase)]).map(cs => syntheticClinicalCaseSchema.parse(cs));
  const questions = unique([...values(module, config.questions), ...retained.map(record => record.question)]);
  const concepts = values(module, config.concepts);
  const timing = unique([...values(module, config.timing), ...retained.map(record => record.timing)]);
  const wanted = node => config.suffixes.some(suffix => node.id.endsWith('.' + suffix));
  const requested = config.suffixes.map(suffix => {
    const contexts = cases.filter(cs => cs.decisionNodes.some(node => node.id.endsWith('.' + suffix)));
    assert(contexts.length, 'Missing exact reviewed context ' + suffix);
    const node = contexts[0].decisionNodes.find(node => node.id.endsWith('.' + suffix));
    const review = evidence(node);
    assert.equal(review?.record.verdict, 'PASS', suffix + ' latest verdict');
    return {suffix, nodeId:node.id, questionVariantId:node.questionVariantId, evidence:review,
      contexts:contexts.map(cs => ({caseId:cs.id, sha256:digest(cs), unlistedSiblingIds:cs.decisionNodes.filter(n => !wanted(n)).map(n => n.id)}))};
  });
  const proposals = [...(packet.proposals ?? []), ...(packet.proposedNodes ?? []), ...(packet.nodes ?? []), ...(packet.drafts ?? [])];
  const audit = Array.isArray(packet.audit) ? packet.audit : packet.audit?.rows ?? packet.auditRows ?? [];
  const complete = cases.filter(cs => cs.decisionNodes.every(wanted));
  assert.equal(new Set(complete.map(cs => cs.id)).size, complete.length, config.slug + ' ambiguous complete contexts');
  const candidates = complete.map(cs => {
    const records = cs.decisionNodes.map(node => {
      const matches = questions.filter(q => q.id === node.questionVariantId);
      assert.equal(matches.length, 1, 'One exact authored question ' + node.questionVariantId);
      const question = matches[0];
      assert.equal(question.reviewStatus, 'needs_clinician_review');
      const proposal = proposals.find(p => p.questionVariantId === question.id || p.id === question.id);
      const inventoryIds = proposal?.beforeInventoryRecordIds ?? proposal?.editorialReplacementForInventoryIds ??
        (proposal?.beforeInventoryRecordId ? [proposal.beforeInventoryRecordId] : proposal?.replacementForInventoryRecordIds ?? []);
      const legacy = audit.filter(row => inventoryIds.includes(row.inventoryRecordId ?? row.recordId)).flatMap(row => {
        const source = content.SYNTHETIC_CLINICAL_RELEASE.cases.find(old => old.id === row.caseId);
        if (!source) return [];
        const ids = row.variantIds ?? [row.questionVariantId];
        return source.decisionNodes.filter(old => ids.includes(old.questionVariantId)).map(old => ({caseId:source.id, nodeId:old.id,
          questionVariantId:old.questionVariantId, conceptId:old.primaryConceptId, inventoryRecordId:row.inventoryRecordId ?? row.recordId}));
      });
      const concept = concepts.find(co => co.id === node.primaryConceptId);
      assert(concept, 'Missing concept ' + node.primaryConceptId);
      return {node, question, concept, evidence:evidence(node), legacyRewrites:legacy, inventoryIds};
    });
    const estimates = cs.decisionNodes.map(node => {
      const matches = timing.filter(t => t.caseId === cs.id && t.nodeId === node.id && t.questionVariantId === node.questionVariantId);
      assert.equal(matches.length, 1, 'Exact timing ' + node.id);
      return matches[0];
    });
    const registry = [...new Map([...content.SYNTHETIC_CLINICAL_RELEASE.concepts, ...concepts].map(co => [co.id, co])).values()];
    const context = {...domain.PROTOTYPE_DOMAIN_CONTEXT, clinicalRelease:{...content.SYNTHETIC_CLINICAL_RELEASE, concepts:registry, cases:[cs]}};
    const state = structuredClone(prepared), issue = domain.getClinicalCaseEligibilityIssue(state, cs, context);
    const command = {type:'ADMIT_PATIENT', operationId:'topic2.admit', encounterId:'encounter.topic2.capture', caseId:cs.id, patientDisplayName:cs.patientDisplayName, arrivalClass:'routine'};
    const admitted = domain.gameReducer(state, command, context), receipt = admitted.operationReceipts[command.operationId];
    return {case:cs, records, timing:estimates, legacyCaseIds:[...new Set(records.flatMap(r => r.legacyRewrites.map(old => old.caseId)))],
      runtime:{setting:cs.requiredClinicalSetting, issue, receipt, clinicAdmissible:cs.requiredClinicalSetting === 'clinic' && issue === null && receipt?.status === 'applied'}};
  });
  assert.equal(raw(sourcePath), sourceHash, 'Source changed during capture');
  assert.equal(raw(packetPath), packetHash, 'Packet changed during capture');
  topics.push({config, sourcePath, sourceSha256:sourceHash, packetPath, packetSha256:packetHash, ledgerPath, ledgerSha256:raw(ledgerPath),
    reviews:reviews.map(({records,...r}) => r), requested, candidates});
}
const metadata = collectAuthoredMetadata({...content, modules});
const claimIds = [...new Set(topics.flatMap(topic => topic.candidates.flatMap(row => row.records.flatMap(r => r.question.supportingEvidenceClaimIds))))];
const claims = claimIds.map(id => {assert(metadata.claims.has(id), 'Missing claim ' + id); return metadata.claims.get(id);});
const sourceIds = [...new Set(claims.flatMap(claim => claim.sourceIds))];
const sources = sourceIds.map(id => {assert(metadata.sources.has(id), 'Missing source ' + id); return metadata.sources.get(id);});
const sourcePaths = ['question-ship-manifest.ts', 'question-ship-case-replacements.ts', 'question-ship-projection.ts', 'synthetic-content.ts',
  'index.ts', 'answer-choice-timing.ts', 'answer-choice-timing.test.ts', 'question-ship-manifest.test.ts', 'pilot-content.test.ts',
  'question-program-batch1-acceptance-test-support.ts', 'question-program-batch1-acceptance-20261111.test.ts'].map(name => 'packages/clinical-content/src/' + name);
const observed = {};
for (const root of ['packages/clinical-content/src', 'packages/game-domain/src', 'packages/balance-config/src', 'apps/player/src/session']) {
  const walk = path => {for (const entry of fs.readdirSync(path, {withFileTypes:true})) {
    const child = path + '/' + entry.name;
    if (entry.isDirectory()) walk(child);
    else if (/\.tsx?$/.test(entry.name)) observed[child] = raw(child);
  }};
  walk(root);
}
const release = content.SYNTHETIC_CLINICAL_RELEASE;
const legacyCaseIds = new Set(topics.flatMap(topic => topic.candidates.flatMap(row => row.legacyCaseIds)));
const shared = 'docs/handoffs/CURRENT_THREAD_HANDOFF.md', sharedBytes = fs.readFileSync(shared);
const intake = {capturedOn:'2026-11-11', topics, claims, sources, observed,
  default:{sha256:digest(release), cases:release.cases.length, nodes:release.cases.flatMap(cs => cs.decisionNodes).length,
    scoredMeanings:new Set(release.cases.flatMap(cs => cs.decisionNodes.map(n => n.primaryConceptId))).size,
    caseIds:release.cases.map(cs => cs.id), conceptIds:release.concepts.map(co => co.id),
    caseHashes:Object.fromEntries(release.cases.map(cs => [cs.id, digest(cs)])),
    conceptHashes:Object.fromEntries(release.concepts.map(co => [co.id, digest(co)])),
    retainedCases:release.cases.filter(cs => legacyCaseIds.has(cs.id))},
  manifest:content.QUESTION_SHIP_MANIFEST, manifestSha256:digest(content.QUESTION_SHIP_MANIFEST),
  catalogSha256:digest(content.QUESTION_CATALOG_RELEASE), timing:content.ANSWER_CHOICE_TIMING_REGISTRY,
  sourcePreimages:sourcePaths.map(path => ({path, beforeSha256:raw(path), beforeText:fs.readFileSync(path, 'utf8')})),
  sharedHandoff:{path:shared, bytes:sharedBytes.length, sha256:hash(sharedBytes)}};
fs.writeFileSync(output, JSON.stringify(intake, null, 2) + '\n');
fs.mkdirSync('.local-dev/question-topic-acceptance-batch2-20261111', {recursive:true});
console.log(JSON.stringify({requested:topics.reduce((n,t) => n+t.requested.length,0),
  candidates:topics.map(topic => ({topic:topic.config.slug, nodes:topic.candidates.flatMap(row => row.records).length,
    cases:topic.candidates.length, replacements:topic.candidates.filter(row => row.legacyCaseIds.length).map(row => ({caseId:row.case.id, replaces:row.legacyCaseIds})),
    inadmissible:topic.candidates.filter(row => !row.runtime.clinicAdmissible).map(row => row.runtime)}))}));
