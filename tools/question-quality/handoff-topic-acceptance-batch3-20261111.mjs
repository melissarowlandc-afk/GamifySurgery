import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const directory='.local-dev/question-topic-acceptance-batch3-20261111/';
const read=path=>JSON.parse(fs.readFileSync(path,'utf8'));
const hash=value=>createHash('sha256').update(value).digest('hex');
const packet=read('docs/research/question-topic-acceptance-batch3-packet-20261111.json');
const before=read('tools/question-quality/fixtures/question-topic-acceptance-batch3-before-20261111.json');
const migration=read('tools/question-quality/fixtures/question-topic-acceptance-batch3-source-migration-20261111.json');
const sourceFreeze=read(packet.sourceByteFreeze.path);
function logText(path){const bytes=fs.readFileSync(path);return bytes.toString(bytes[0]===255?'utf16le':'utf8').replace(/^\uFEFF/,'');}
function run(name){
  const path=directory+name+'.json';assert(fs.existsSync(path),'Finish '+name);
  const result=read(path),log=logText(directory+name+'.log');
  return {name,total:result.numTotalTests,passed:result.numPassedTests,failed:result.numFailedTests,skipped:result.numPendingTests,
    files:result.testResults.length,failedFiles:result.testResults.filter(file=>file.status==='failed').length,
    duration:log.match(/Duration\s+([^\r\n]+)/)?.[1]??null,command:log.split('\n').find(line=>line.startsWith('> vitest run'))?.trim(),
    reportSha256:hash(fs.readFileSync(path)),
    failures:result.testResults.flatMap(file=>file.assertionResults.filter(test=>test.status==='failed').map(test=>({
      file:file.name.replaceAll('\\','/').replace(/^.*\/GamifySurgery\//,''),title:test.fullName,messages:test.failureMessages,
    }))),
    failedSuites:result.testResults.filter(file=>file.status==='failed'&&!file.assertionResults.some(test=>test.status==='failed')).map(file=>({file:file.name,message:file.message})),
    testFiles:result.testResults.map(file=>({file:file.name.replaceAll('\\','/').replace(/^.*\/GamifySurgery\//,''),passed:file.assertionResults.filter(test=>test.status==='passed').length,
      failed:file.assertionResults.filter(test=>test.status==='failed').length,status:file.status})),
  };
}
const finalNames=['clinical-complete','clinical-guards-final','domain-complete','domain-collected-suites','domain-supply-close','domain-queue-close','player-final'];
const runs=['clinical-full','clinical-focused-final','clinical-final','clinical-complete','clinical-guards-final','domain-full','domain-historical-focused','domain-board-final','domain-final','domain-collected-suites','domain-complete','domain-supply-close','domain-queue-close','player-new-final','player-endoscopy-final','player-final'].map(run);
const types=logText(directory+'typecheck-close.log');
const typeBlocks=types.split(/(?=> @gamify-surgery\/[^\r\n]+ typecheck)/).filter(block=>block.startsWith('> @gamify-surgery/')).map(block=>({
  workspace:block.split('\n')[0].trim(),errors:block.split('\n').filter(line=>/error TS\d+/.test(line)).map(line=>line.trim()),output:block,
}));
assert.equal(typeBlocks.length,7);
const lint=logText(directory+'lint-tests.log');
const player=runs.find(run=>run.name==='player-final');
const newPlayer=player.testFiles.filter(file=>/questionProgramBatch3(?:SaveCompatibility|StatisticsAdmission)\.test\.ts$/.test(file.file));
assert.equal(newPlayer.reduce((n,file)=>n+file.passed,0),445);assert(newPlayer.every(file=>file.failed===0));
const clinical=runs.find(run=>run.name==='clinical-complete');
const newClinical=clinical.testFiles.find(file=>file.file.endsWith('question-program-batch3-acceptance-20261111.test.ts'));
assert.equal(newClinical.passed,10);assert.equal(newClinical.failed,0);
const validation={checkedOn:'2026-11-11',runs,finalRuns:finalNames,
  typechecks:{command:'npm.cmd run typecheck at repository root',workspaces:7,passed:typeBlocks.filter(block=>!block.errors.length).length,failed:typeBlocks.filter(block=>block.errors.length).length,
    blocks:typeBlocks,logPath:directory+'typecheck-close.log',logSha256:hash(fs.readFileSync(directory+'typecheck-close.log'))},
  lintTests:{command:'npm.cmd run clinical:lint:test with NODE_NO_WARNINGS=1',passed:Number(lint.match(/pass\s+(\d+)/)?.[1]),failed:Number(lint.match(/fail\s+(\d+)/)?.[1]),
    durationMs:Number(lint.match(/duration_ms\s+([^\r\n]+)/)?.[1]),logSha256:hash(fs.readFileSync(directory+'lint-tests.log'))},
  newCompatibility:{passed:445,failed:0,acceptedPatientCases:175,acceptedStaffCases:24,retiredSnapshotCases:123,retiredJournalCases:123},
  newClinicalAcceptance:newClinical,
  playerPreload:'tools/question-quality/adversarial-r5-player-preload-20261102.cjs provides the optional Vite Windows drive probe. Real codec, journal, scoring, timing and existing limits are used.',
};
fs.writeFileSync('docs/research/question-topic-acceptance-batch3-validation-20261111.json',JSON.stringify(validation,null,2)+'\n');
const code=value=>String.fromCharCode(96)+String(value)+String.fromCharCode(96);
const cell=value=>String(value??'none').replaceAll('|','\\|').replaceAll('\n',' ');
const table=(headers,rows)=>['| '+headers.join(' | ')+' |','| '+headers.map(()=>'---').join(' | ')+' |',...rows.map(row=>'| '+row.map(cell).join(' | ')+' |')].join('\n');
const topics=before.topics.map(topic=>({slug:topic.config.slug,salvage:topic.config.salvage,requested:topic.requested.length,
  accepted:packet.accepted.filter(row=>row.sourceView==='topic-batch3-'+topic.config.slug).length,cases:new Set(packet.accepted.filter(row=>row.sourceView==='topic-batch3-'+topic.config.slug).map(row=>row.caseId)).size}));
const literalCases=[...new Map(packet.accepted.filter(row=>row.runtime.route!=='employee_discussion'&&!row.after.Presentation.includes('{patientName}')).map(row=>[row.caseId,row])).values()];
const finalRuns=runs.filter(run=>finalNames.includes(run.name));
const sections=[
  '# Topic program acceptance batch 3 — 2026-11-11',
  'Accepted **211 exact PASS nodes in 199 complete cases** from the manager’s 225 requested identities. **Fourteen are skipped**: thirteen depend on unlisted scored siblings; the conditional thoracic aortic salvage remains REVISE. Every new variant stays **needs_clinician_review**. No clinical approval, Git operation, network access, deployment or evidence rebind was performed.',
  'The executable authority is manifest '+code(packet.manifestId)+'. [Acceptance packet](question-topic-acceptance-batch3-packet-20261111.json), [dispositions](question-topic-acceptance-batch3-dispositions-20261111.json), [raw source freeze](question-topic-acceptance-batch3-source-freeze-20261111.json), [lint](question-topic-acceptance-batch3-lint-20261111.json) and [exact validation](question-topic-acceptance-batch3-validation-20261111.json) accompany this handoff. Keys are shown first for review only; runtime choices shuffle.',
  '## Topic disposition',
  table(['Topic','Context','Requested nodes','Accepted nodes','Accepted cases'],topics.map(topic=>[topic.slug,topic.salvage?'standalone salvage':'main',topic.requested,topic.accepted,topic.cases])),
  'All 175 patient cases admit through ordinary current clinic commands in the existing Level4 QA facility with a real Examination Room. All 24 single-skill statistics cases schedule through the existing surgeon employee-discussion path in a clinic with a real Surgeon’s Office. Patient admission correctly rejects staff discussions; their authoring exemption and minimal statistical tasks are retained. No hospital, OR or endoscopy selection route was introduced.',
  '## Exact accepted nodes',
  table(['Node','Question variant','Case','Meaning','Pending diagnostic tuples'],packet.accepted.map(row=>[code(row.nodeId),code(row.questionVariantId),code(row.caseId),code(row.conceptId),row.runtime.testChoiceOrdersNeeded.length])),
  '## Excluded nodes and siblings',
  table(['Requested node','Reason','Reviewed case contexts','Unlisted scored siblings'],packet.skipped.map(row=>[code(row.nodeId),row.reason,
    [...new Set(row.contexts.map(context=>context.caseId))].map(code).join('<br>'),row.unlistedSiblingIds.map(code).join('<br>')||'none; latest salvage review is REVISE'])),
  'The conditional '+code('node.trauma-thoracic.aortic-repair-sequence.20261111.v1')+' is not admitted: its salvage review takes precedence over its earlier PASS. No unlisted sibling, parked item or held item is added. The duplicate older acute-pancreatitis compartment case is omitted; its exact requested node is accepted once in the current primary context.',
  '## Replacement, consolidation and history',
  'Sixteen ordinary whole-case replacements and twenty-nine explicit topic-program consolidation groups retire **123 fresh cases /188 nodes**. Every old identity is retired once. All prior 193 authority rows, 1,423 legacy bindings and 2,343 timing rows remain exact. The existing resolver/projector mechanism is unchanged; no domain-side acceptance check was added.',
  'Six old paired cases contribute objectives to more than one independently accepted complete case. The authority retires each old identity once at the first declared successor, while all reviewed successors are separately admitted. The following coverage records make that decomposition explicit; no scored case is cut apart during projection.',
  table(['Old paired case','Primary retirement target','All accepted successor cases'],packet.retirementCoverage.filter(row=>row.allTargetCaseIds.length>1).map(row=>[code(row.legacyCaseId),code(row.primaryTargetCaseId),row.allTargetCaseIds.map(code).join('<br>')])),
  'The appendix source ledger declares the four-to-one legacy rewrite for persistent-pain exploration: four old CT-first cases consolidate into its standalone application. The invasive-adenocarcinoma resection item is a new-gap objective with no direct legacy target in that ledger; it is accepted as a new standalone case. No unsupported four-case mapping was invented for it.',
  table(['Consolidation group','Retired cases','Exact accepted target question'],packet.consolidations.map(row=>[code(row.id),row.replaces.map(code).join('<br>'),code(row.with)])),
  table(['Ordinary retired case','Exact accepted target question'],packet.replacements.map(row=>[code(row.replaces),code(row.with)])),
  'All 654 existing registered meaning definitions are preserved byte for byte. The source declares 159 additional meanings. Stable existing meanings retain their histories; new meaning versions use their declared new identities. The following meanings lose their last fresh variants while their original cards, definitions and frozen encounters remain intact:',
  packet.removedFromFreshScoredMeanings.map(id=>'- '+code(id)).join('\n'),
  table(['Retained old case','Original question variants /FSRS identities','SHA-256'],packet.retained.map(row=>[code(row.caseId),row.nodes.map(node=>code(node.questionVariantId)+'<br>'+code(node.conceptId)).join('<br>'),code(row.sha256)])),
  '## Frozen provenance and projection metadata',
  'All 211 reviewed question objects and all 211 scored node fields are exact. The raw-freeze artifact also retains each original JSON serialization and SHA-256. Schema parsing reorders object keys in '+sourceFreeze.objectKeyOrderNormalizations+' node serializations; every field and value matches the raw reviewed node. Both raw-source and runtime hashes are recorded, so representation ordering is explicit. No stem, update, exhibit, option, rationale, explanation or concept identity was rewritten.',
  'Twenty-seven static accepted-only views isolate these versions from mutable topic-worker modules. No live wrapper imports a question-topic-* source or review packet. The archive retains '+packet.claims.length+' existing atomic claims and '+packet.sources.length+' source records, with their evidence categories, bibliographic, access, rights and authority metadata. No source record or clinical claim was invented. Existing nonstandard ledger category/rights labels are preserved in the local frozen metadata type rather than changed or promoted.',
  table(['Source view','Cases /nodes','SHA-256'],packet.sourceViews.map(row=>[code(row.name),row.cases+' /'+row.nodes,code(row.sha256)])),
  'The projected learning summary follows the existing joined-explanation rule. Fourteen source cases adopt the higher floor of an existing registered meaning. Six accepted draft headers switch routineEligible from false to true so the accepted cases can actually enter fresh selection. Those header changes do not touch scored nodes, educational tiers, patient acuity or the shared runtime selector.',
  table(['Case','Stage before','Stage after'],packet.stageAdjustments.map(row=>[code(row.caseId),row.before,row.after])),
  table(['Accepted draft activated for fresh selection'],packet.eligibilityAdjustments.map(row=>[code(row.caseId)])),
  '## Default counts and hashes',
  table(['Measure','Before','After'],Object.keys(packet.counts.before).map(key=>[key,packet.counts.before[key],packet.counts.after[key]])),
  '- Manifest SHA-256: '+code(packet.hashes.manifestAfter)+'\n- Default release SHA-256: '+code(packet.hashes.defaultAfter)+'\n- Unchanged catalog SHA-256: '+code(packet.hashes.catalogAfter),
  'The strict inverse adapter verifies the complete authorized content, registry, authority and timing delta before reconstructing the earlier release. Negative tests reject unrelated drift. Historical clinical/procedural tests now exercise that verified epoch. The synthetic workload constructs already frozen historical encounters and reads its exact retained source; it does not reopen a retired case to fresh play. All original assertions, timing and timeout budgets remain.',
  '## Runtime bindings still needed',
  'All 211 timing classifications are installed, bringing the registry to 2,554 rows. The domain owner still needs **209 exact diagnostic-choice records** from '+code('QUESTION_PROGRAM_BATCH3_ACCEPTED_TEST_ORDER_RECORDS')+' in '+code('packages/game-domain/src/test-choice-orders.ts /EXACT_TEST_CHOICE_ORDER_RECORDS')+'. All use '+code('{kind:"not_executed",reason:"future_planned"}')+' for the reviewed clinic plans. Direct comparison with the current 829-entry domain registry finds none of these 209 tuples installed. Batch1’s 15 and batch2’s 33 records remain a separate pending48. No runtime file was edited.',
  'For every accepted patient case the existing APP clinic affinity already matches; procedureConsultKind is null. There are no required new OR-eligibility, founder-consults endoscopicFindingConcepts, wound/ostomy or selector entries for these chart-review cases. Statistics use their existing '+code('staff.surgeon')+' participant binding and authored stage4 floor; they do not require APP affinity. A broader wound-service affinity for a new objective would be a separate routing decision, not necessary for the verified current clinic path.',
  table(['Case /node /variant','Choice ID and exact label','Existing timing profile'],packet.pendingRuntimeOrders.map(row=>[[row.caseId,row.nodeId,row.questionVariantId].map(code).join('<br>'),code(row.choiceId)+'<br>'+row.choiceLabel,code(row.timingProfileId)])),
  '## Validation',
  table(['Final run','Files passed /failed','Tests passed /failed /skipped','Duration'],[
    ...finalRuns.map(row=>[row.name,(row.files-row.failedFiles)+' /'+row.failedFiles,row.passed+' /'+row.failed+' /'+row.skipped,row.duration]),
    ['Seven root typechecks','7 workspaces',validation.typechecks.passed+' pass /'+validation.typechecks.failed+' fail','see exact log'],
    ['Cue linter tests','1 tool',validation.lintTests.passed+' pass /'+validation.lintTests.failed+' fail',validation.lintTests.durationMs+' ms'],
  ]),
  '**All 445 new player checks pass**: 175 accepted patient admissions, 24 accepted staff discussions, 123 retired format3 snapshots and 123 committed retired admission journals. Every original frozen question, shuffled order, FSRS identity and prior history survives reload and completion. New acceptance tests are **10/10**. The combined player suite’s remaining separateCampaign codec-limit failure is unchanged from batch2; its cloud files were not edited.',
  'The patient compatibility fixture builds the real required Minor-Procedure room and uses the existing staffed Endoscopy/Recovery fixture for the retired dysphagia case. Its staff walk to their operational rooms before admission. Retained external service clocks can be300 minutes: the test advances the exact pending due tick, then applies the original240-tick physical-readiness bound. It does not enlarge that bound, a Vitest timeout or a codec budget.',
  'The three previously uncollected historical suites now run all523 assertions successfully, including248 profiles and318 distinct choices in the Level3 cohort. The final full domain run has no collection errors. Its patient-supply and MRI/APP queue timeouts both disappear in separate isolated reruns:4/4 and1/1 pass with their original budgets. Their full-suite failures remain reported; they are not subtracted from the30 failures.',
  'Final exact failed assertions follow. The validation JSON retains complete failure messages, commands, run counts, file counts, skipped counts and report hashes. Earlier failed iterations are also retained rather than presented as successful runs.',
  ...finalRuns.flatMap(row=>row.failures.map(failure=>'- '+code(row.name)+' '+code(failure.file)+' — '+failure.title+'. '+(failure.messages[0]?.replace(/\x1b\[[0-9;]*m/g,'').split('\n')[0]??''))),
  ...finalRuns.flatMap(row=>row.failedSuites.map(failure=>'- '+code(row.name)+' failed suite '+code(failure.file)+': '+failure.message)),
  ...validation.typechecks.blocks.flatMap(block=>block.errors.map(error=>'- '+code(block.workspace)+': '+error)),
  'Topic-worker source and tests were explicitly out of lane. Their old non-admission, raw input-pin and removed-current-context assertions need the new exact acceptance epoch/retained definitions. Concurrent Burns/Carotid changes also appeared during validation. The pre-existing protected app-appointments, test-choice-orders and cloud codec source mismatches are not refreshed here. Closing topic-sidecar TypeScript diagnostics belong to their source owners. Level5 evidence remains unrebound; concept-count and exact-order inventory failures are separately identified in the final domain output.',
  '## Source presentation residual',
  'The current full-library wording guard reports '+code('case.topic.hematology-transfusion-coagulation.cholestasis-correction.v2')+' because its presentation is the reviewed literal Victor Lane text rather than a patientName template. In total '+literalCases.length+' accepted patient presentations retain literal authored names. These source bytes were intentionally preserved under the manager’s freeze instruction. They pass admission with their authored names, but automatic name materialization should be checked by the source owner before release. This guard was not weakened or excluded.',
  'This is not an exhaustive name audit: the reviewed '+code('question.topic.surgical-infection-antibiotics.postdrain-antibiotic-need.v2')+' also names Nora Ellis in its task/update while its presentation uses the patientName token. A generated patient can therefore have a different chart name. The source owner should check all pre-answer fields before release; fixing that scored wording would change the exact reviewed bytes and was outside this acceptance assignment.',
  table(['Reviewed literal-name case','Authored presentation opening'],literalCases.map(row=>[code(row.caseId),row.after.Presentation.split(/[.!?]\s/)[0]])),
  '## Advisory cues',
  'Accepted subset: '+packet.lint.accepted.findings+' raw findings across '+packet.lint.accepted.variantsWithFindings+' of211 variants. Whole bank: '+packet.lint.wholeBank.findings+' findings across '+packet.lint.wholeBank.variantsWithFindings+' of'+packet.lint.wholeBank.uniqueVariants+' unique variants. The independently passed wording is retained. Fifty-two exact character-length residuals are individually pinned to measured lengths, their authority row and whole-case hash; no broad cue threshold or budget is relaxed.',
  table(['Cue rule','Accepted variants','Whole-bank variants'],[...new Set([...Object.keys(packet.lint.accepted.variantsByRule),...Object.keys(packet.lint.wholeBank.variantsByRule)])].sort().map(key=>[key,packet.lint.accepted.variantsByRule[key]??0,packet.lint.wholeBank.variantsByRule[key]??0])),
  '## Level5 bound inputs',
  'Exactly these three bound inputs change in this milestone. All were already different from the recorded evidence at intake. No evidence, pins, release worktree or rebind file was edited. Other concurrent balance/runtime changes are not attributed to this batch.',
  table(['Bound input','Intake SHA-256','After SHA-256','Recorded evidence SHA-256'],packet.levelFiveInputs.map(row=>[code(row.path),code(row.beforeSha256),code(row.afterSha256),code(row.recordedSha256)])),
  'Two new runtime modules are absent from the old binding map. Include them in the manager’s next dependency/binding inventory; this is separate from changing the three already-bound paths above.',
  table(['New runtime input','SHA-256','Present in old binding'],packet.newUnboundClinicalRuntimeInputs.map(row=>[code(row.path),code(row.sha256),row.presentInOldBinding])),
  '## Files and preserved lanes',
  'Existing files changed (each original preimage and exact postimage is bound in the migration receipt):',
  migration.files.map(row=>'- '+code(row.path)).join('\n'),
  'New files are enumerated with hashes in '+code('question-topic-acceptance-batch3-files-20261111.json')+'. They comprise the accepted data/wrapper, strict test support and clinical test; two player test files; this batch’s capture/build/integration/review/freeze/report tools and immutable fixtures; ExecPlan, packet, dispositions, raw source freeze, lint, validation and this report. The shared thread handoff is appended only.',
  'All source modules, packets, source ledgers and review files for the requested topics match intake hashes. Concurrent question-topic-* work, balance-config, domain runtime, apps/player session/cloud, Supabase, GS-release and Level5 evidence remain untouched by this worker. The receipt records observed changes from other lanes separately.',
  '## Manager handoff',
  'Review the exact acceptance and exclusions, schedule the209 diagnostic tuples and the separate pending48, route the literal-name source issue and topic test/type diagnostics to their owners, then run the managed evidence rebind/release process. The immutable source archive insulates this acceptance from subsequent topic-file edits. No skipped sibling or thoracic salvage is accepted implicitly.',
  'This checkpoint exists only in the shared local working tree. No Git backup or release was made. The manager owns the backup/release gate and may request a checkpoint with “push to GitHub”.',
];
fs.writeFileSync('docs/research/question-topic-acceptance-batch3-20261111.md',sections.join('\n\n')+'\n');
console.log(JSON.stringify({accepted:packet.counts.acceptedNodes,cases:packet.counts.acceptedCases,skipped:packet.counts.skippedNodes,
  validation:finalRuns.map(({name,passed,failed,skipped})=>({name,passed,failed,skipped})),typechecks:validation.typechecks.passed+'/'+validation.typechecks.workspaces,newPlayer:445}));
