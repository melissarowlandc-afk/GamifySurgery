import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';

const base='question-intraop-acceptance-batch9';
const date='20261112';
const fixture=`tools/question-quality/fixtures/${base}-before-${date}.json`;
const dir='packages/clinical-content/src/';
const decision=`docs/research/${base}-${date}.md`;
const read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const sha=b=>createHash('sha256').update(b).digest('hex');
const digest=v=>sha(JSON.stringify(v));
const output=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const scan=()=>{const observed={};for(const d of ['packages/clinical-content/src','packages/game-domain/src','packages/game-domain/tests','apps/player/src','packages/balance-config/src']){
  const walk=p=>{for(const e of fs.readdirSync(p,{withFileTypes:true})){const f=p+'/'+e.name;if(e.isDirectory())walk(f);else if(/\.(ts|tsx)$/.test(f))observed[f]=sha(fs.readFileSync(f));}};walk(d);
}return observed;};

if(process.argv.includes('capture')){
  assert(!fs.existsSync(fixture),'Immutable intake already exists');
  const inspection=read(`.local-dev/${base}-${date}/inspection.json`);
  const content=await import('../../packages/clinical-content/src/index.ts');
  const names=['question-ship-manifest.ts','synthetic-content.ts','index.ts','answer-choice-timing.ts',
    'answer-choice-timing.test.ts','question-ship-manifest.test.ts','pilot-content.test.ts',
    'question-program-batch8-acceptance-test-support.ts','question-program-batch8-acceptance-20261112.test.ts',
    'patient-library-wording-repair.test.ts','playable-patient-narrative.test.ts'];
  const paths=[...names.map(n=>dir+n),'packages/game-domain/src/test-choice-orders.ts',
    'packages/game-domain/tests/question-ship-gate.test.ts','apps/player/src/session/topicRuntimeBindings.test.ts'];
  const inputs=new Map();
  for(const t of Object.values(inspection.byTopic)){
    inputs.set(t.file,{path:t.file,sha256:sha(fs.readFileSync(t.file))});
    for(const r of t.reviews)inputs.set(r.path,{path:r.path,sha256:sha(fs.readFileSync(r.path))});
  }
  output(fixture,{capturedOn:'2026-11-12',...inspection,
    defaultRelease:content.SYNTHETIC_CLINICAL_RELEASE,defaultSha256:digest(content.SYNTHETIC_CLINICAL_RELEASE),
    manifest:content.QUESTION_SHIP_MANIFEST,manifestSha256:digest(content.QUESTION_SHIP_MANIFEST),
    timing:content.ANSWER_CHOICE_TIMING_REGISTRY,timingSha256:digest(content.ANSWER_CHOICE_TIMING_REGISTRY),
    sourceInputs:[...inputs.values()],observed:scan(),
    sourcePreimages:paths.map(path=>({path,beforeSha256:sha(fs.readFileSync(path)),beforeText:fs.readFileSync(path,'utf8')})),
  });
  console.log('Captured '+inspection.requested.length+' requested nodes and exact pre-batch9 default/manifest/timings');
}

if(process.argv.includes('build')){
  const before=read(fixture),wanted=new Set(before.requested.map(r=>r.nodeId));
  const skipped=[],records=[],views={},questions=[],frozen=[],corrections=[],timings=[],orders=[],families=[];
  // A generic suite does not assert these specialized installed services/resources.
  const unsupported={
    'asc-access-and-soft-tissue-surprises':'No supported port-insertion procedure family or fluoroscopic port-redirection capability exists in ENG-I01.',
    'biliary-safety-and-duct-decisions':'As written the cases require fluoroscopy/near-infrared cholangiography or transcystic exploration. ENG-I01 does not establish these specialized capabilities from its generic cholecystectomy family.',
    'endoscopic-perforation-and-injury':'The live cases explicitly require confirmed closure-device expertise and stocked closure/rescue equipment. ENG-I01 establishes a generic EGD/colonoscopy source, not those specialized capabilities.',
    'endoscopic-upper-gi-hemostasis':'The live case requires a booked therapeutic hemostasis service/equipment; ENG-I01 does not establish that scope from the generic diagnostic EGD family.',
    'suspicious-polyps-retrieval-and-tattoo':'Magnifying dye chromoendoscopy and its trained optical-assessment/specimen workflow are not represented by the installed generic colonoscopy capability.',
  };
  const selected=new Map();
  for(const req of before.results){
    assert.equal(req.latestReview?.record.verdict,'PASS',req.nodeId+' latest independent verdict');
    let matches=req.matches.filter(m=>!/_RETAINED_|_REVIEWED_/.test(m.exportName));
    if(req.slug==='ercp-access-and-adverse-events')matches=matches.filter(m=>m.exportName==='I18_SCORABLE_PREVIEW_CASES');
    let match=matches[0];
    if(!match&&req.slug==='parathyroid-localization-and-preservation'){
      const c=before.byTopic[req.slug].metadata.I07_FROZEN_PASS_CONTEXTS?.find(c=>c.decisionNodes.some(n=>n.id===req.nodeId));
      if(c)match={exportName:'I07_FROZEN_PASS_CONTEXTS',case:c};
    }
    if(!match){skipped.push({slug:req.slug,nodeId:req.nodeId,reason:'No current complete executable source case contains this node; the frozen pass context still needs non-PASS siblings.',siblings:[]});continue;}
    const c=match.case;
    const missing=c.decisionNodes.filter(n=>!wanted.has(n.id)).map(n=>n.id);
    if(missing.length){skipped.push({slug:req.slug,nodeId:req.nodeId,caseId:c.id,reason:'Whole-case acceptance: scored siblings are not in the manager PASS list.',siblings:missing});continue;}
    if(c.requiredClinicalSetting!=='clinic'&&unsupported[req.slug]){
      skipped.push({slug:req.slug,nodeId:req.nodeId,caseId:c.id,reason:unsupported[req.slug],siblings:[]});continue;
    }
    if(c.requiredClinicalSetting!=='clinic'&&req.slug==='parathyroid-localization-and-preservation'){
      skipped.push({slug:req.slug,nodeId:req.nodeId,caseId:c.id,reason:'ENG-I01 supports neither parathyroidectomy nor thyroidectomy as a live family.',siblings:[]});continue;
    }
    selected.set(c.id,{slug:req.slug,exportName:match.exportName,case:c});
  }
  const replaceNames=(value,name,path)=>{
    if(typeof value==='string'){
      let next=value;for(const token of [name,name.split(' ')[0]])next=next.replace(new RegExp('\\b'+token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','g'),'{patientName}');
      if(next!==value)corrections.push({path,before:value,after:next,kind:'presentation_only_patient_name_placeholder'});
      return next;
    }
    if(Array.isArray(value))return value.map((v,i)=>replaceNames(v,name,path+'['+i+']'));
    if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>
      [k,['id','patientDisplayName','patientPresentationVariantId'].includes(k)?v:replaceNames(v,name,path+'.'+k)]));
    return value;
  };
  for(const item of selected.values()){
    const original=item.case,c=replaceNames(structuredClone(original),original.patientDisplayName,original.id);
    c.routineEligible=true;
    // The existing projector derives this display summary using a space join.
    // Capture that exact native postimage; original source bytes remain frozen.
    const projectedSummary=c.decisionNodes.map(n=>n.explanation).join(' ');
    if(c.learningSummary!==projectedSummary){
      assert.equal(c.learningSummary.replace(/\s+/g,' '),projectedSummary.replace(/\s+/g,' '),'Only native summary whitespace may differ');
      corrections.push({path:c.id+'.learningSummary',before:c.learningSummary,after:projectedSummary,kind:'native_projection_summary_whitespace'});
      c.learningSummary=projectedSummary;
    }
    const t=before.byTopic[item.slug];
    const proposals=Object.entries(t.metadata).filter(([k])=>/PROCEDURE_CONTEXT|CONTEXT_PROPOSALS/.test(k)).flatMap(([,v])=>v);
    const proposal=proposals.find(r=>r.caseId===c.id);
    assert(proposal,c.id+' exact authored procedure-context proposal');
    if(c.requiredClinicalSetting==='clinic'){
      c.procedureContext=proposal.contextCandidate??proposal.proposedNormalizedContext??{
        version:'procedure-context.v1',mode:'chart_review',familyId:proposal.familyId??'procedure.hospital_operation',
        recordKind:proposal.recordKind==='anesthesia_record'?'anesthesia_record':/endoscop|ercp/.test(item.slug)?'endoscopy_report':'operative_note',
        recordCheckpoint:proposal.recordCheckpoint??'Recorded operative checkpoint',
      };
      assert.equal(c.procedureContext.mode,'chart_review');
    }else{
      c.procedureContext=proposal.proposedNormalizedContext??{
        version:'procedure-context.v1',mode:'live',familyId:'procedure.groin_hernia_repair',kind:'operation',phase:'procedure',
        allowedIncomeLineIds:['income.ambulatory_operation','income.ambulatory_operation_extended'],requiredCapabilityIds:[...c.requiredCapabilityIds],
      };
      assert(['anesthetic-intraoperative-crises','groin-hernia-anatomy-and-injury','pediatric-egd-food-impaction-eoe'].includes(item.slug),'No implicit family normalization');
    }
    if(c.pediatricProfile){
      const family=proposal.pediatricFamilyContext??c.procedureContext.pediatricFamilyContext;assert(family,c.id+' exact authored child/parent/art');
      families.push({id:c.id.replace(/^case\./,'family.'),caseId:c.id,...family,prototypeDemographics:c.prototypeDemographics,
        parentCount:1,parentPlacement:'same_room_throughout',metadataSource:'tools/character-mapping/level3-roster-complete-v2/roster.json',
        profileValuesBasis:'editorial_art_contract_not_disease_probability',reviewStatus:'needs_clinician_review',aiAssistedDrafting:true,lastClinicianReview:null});
    }
    const viewName='intraop-batch9-'+item.slug;
    if(!views[viewName])views[viewName]={...before.defaultRelease,concepts:[],cases:[]};
    views[viewName].cases.push(c);
    for(const n of c.decisionNodes){
      const req=before.results.find(r=>r.nodeId===n.id);assert(req&&wanted.has(n.id));
      const q0=req.questions.find(q=>!/_RETAINED_|_REVIEWED_/.test(q.exportName))?.question;assert(q0,n.id+' exact current question');
      const q=replaceNames(structuredClone(q0),original.patientDisplayName,q0.id);assert.equal(q.reviewStatus,'needs_clinician_review');
      questions.push(q);
      const concepts=Object.entries(t.metadata).filter(([k])=>/CONCEPTS$/.test(k)&&!/AUTHORING/.test(k)).flatMap(([,v])=>v);
      const concept=concepts.find(x=>x.id===n.primaryConceptId);assert(concept,n.primaryConceptId);
      if(!views[viewName].concepts.some(x=>x.id===concept.id))views[viewName].concepts.push(concept);
      const row={acceptanceId:q.id,caseId:c.id,nodeId:n.id,questionVariantId:q.id,conceptId:n.primaryConceptId,sourceView:viewName,decision};
      records.push(row);
      const sourceTiming=Object.entries(t.metadata).filter(([k])=>/TIMING(?:_(ENTRIES|PROPOSALS))?$/.test(k)&&!/_RETAINED_|_REVIEWED_/.test(k)).flatMap(([,v])=>v).find(r=>r.classification&&r.caseId===c.id&&r.nodeId===n.id&&r.questionVariantId===q.id);
      assert(sourceTiming,n.id+' authored exact timing metadata');timings.push(sourceTiming);
      const sourceOrders=sourceTiming.classification.kind==='test_choices'?sourceTiming.classification.choices.filter(a=>a.timing.kind==='test'):[];
      for(const order of sourceOrders){const a=n.answerChoices.find(a=>a.id===order.choiceId);assert(a&&a.label===order.choiceLabel,JSON.stringify({node:n.id,order,actual:n.answerChoices}));orders.push({caseId:c.id,nodeId:n.id,questionVariantId:q.id,choiceId:a.id,choiceLabel:a.label,timingProfileId:order.timing.timingProfileId,
        disposition:{kind:'not_executed',reason:'future_planned'}});}
      frozen.push({nodeId:n.id,caseId:c.id,questionVariantId:q.id,sourceCaseExport:item.exportName,sourceQuestionJson:JSON.stringify(q0),sourceNodeJson:JSON.stringify(original.decisionNodes.find(x=>x.id===n.id)),sourceCaseJson:JSON.stringify(original),
        sourceQuestionSha256:digest(q0),sourceNodeSha256:digest(original.decisionNodes.find(x=>x.id===n.id)),sourceCaseSha256:digest(original),acceptedQuestionSha256:digest(q),acceptedNodeSha256:digest(n),acceptedCaseSha256:digest(c),review:req.latestReview,
        permittedDifferences:'Patient-name placeholders only in clinical text; routine eligibility and versioned ENG-I01 source metadata only in case admission fields. No clinical meaning, option, key, explanation or concept-identity changes.'});
    }
  }
  assert.equal(records.length+skipped.length,35);
  assert.equal(new Set(records.map(r=>r.nodeId)).size,records.length);
  for(const o of orders){const t=timings.find(t=>t.caseId===o.caseId&&t.nodeId===o.nodeId&&t.questionVariantId===o.questionVariantId);assert(t.classification.kind==='test_choices');assert(t.classification.choices.some(x=>x.choiceId===o.choiceId&&x.timing.kind==='test'&&x.timing.timingProfileId===o.timingProfileId));}
  const acceptedSlugs=new Set(Array.from(selected.values(),i=>i.slug));
  const claims=[...new Map(Object.entries(before.byTopic).filter(([s])=>acceptedSlugs.has(s)).flatMap(([,t])=>Object.entries(t.metadata).filter(([k])=>/CLAIMS$/.test(k)).flatMap(([,v])=>v)).map(c=>[c.id,c])).values()];
  const sources=[...new Map(Object.entries(before.byTopic).filter(([s])=>acceptedSlugs.has(s)).flatMap(([,t])=>Object.entries(t.metadata).filter(([k])=>/SOURCES$/.test(k)).flatMap(([,v])=>v)).map(c=>[c.id,c])).values()];
  const authoredConcepts=[];
  for(const slug of acceptedSlugs){const source=await import('../../'+before.byTopic[slug].file);
    const metadata=Object.entries(source).filter(([k,v])=>Array.isArray(v)&&/AUTHORING_CONCEPTS$|CONCEPT_PROPOSALS$/.test(k)).flatMap(([,v])=>v);
    for(const id of new Set(records.filter(r=>r.sourceView==='intraop-batch9-'+slug).map(r=>r.conceptId))){
      const entry=metadata.find(c=>c.id===id);assert(entry,id+' original authored concept record');authoredConcepts.push(entry);
    }
  }
  const exports={PROGRAM_BATCH9_ROWS:['QuestionShipAcceptance[]',records],PROGRAM_BATCH9_VIEWS:['Record<string,SyntheticClinicalRelease>',views],PROGRAM_BATCH9_QUESTIONS:['Array<QuestionVariant & Record<string,unknown>>',questions],
    PROGRAM_BATCH9_AUTHORED_CONCEPTS:[null,authoredConcepts],
    PROGRAM_BATCH9_TIMINGS:['AnswerChoiceTimingRegistryEntry[]',timings],PROGRAM_BATCH9_ORDERS:[null,orders],PROGRAM_BATCH9_FAMILIES:[null,families],PROGRAM_BATCH9_FROZEN:[null,frozen],
    PROGRAM_BATCH9_CORRECTIONS:[null,corrections],PROGRAM_BATCH9_CLAIMS:['Array<EvidenceClaim & Record<string,unknown>>',claims],PROGRAM_BATCH9_SOURCES:['Array<ClinicalSource & Record<string,unknown>>',sources]};
  let text='// Exact manager acceptance; immutable author sources remain untouched. All clinical versions remain drafts.\nimport type {SyntheticClinicalRelease,AnswerChoiceTimingRegistryEntry} from "./schema";\nimport type {QuestionVariant,EvidenceClaim,ClinicalSource} from "./pilot-schema";\nimport type {QuestionShipAcceptance} from "./question-ship-manifest";\n';
  for(const[name,[type,value]]of Object.entries(exports))text+='export const '+name+(type?':'+type:'')+' = '+JSON.stringify(value,null,2)+(name==='PROGRAM_BATCH9_ORDERS'||name==='PROGRAM_BATCH9_FAMILIES'?' as const':'')+';\n';
  fs.writeFileSync(dir+'question-program-batch9-accepted-data-20261112.ts',text);
  output(`docs/research/${base}-dispositions-${date}.json`,{accepted:records,skipped,wholeCaseChoices:[...selected.values()].map(x=>({slug:x.slug,caseId:x.case.id,exportName:x.exportName,nodeIds:x.case.decisionNodes.map(n=>n.id)})),corrections,orders,families,sourceInputs:before.sourceInputs});
  const dependencies=`tools/question-quality/fixtures/${base}-source-dependencies-${date}.json`;
  output(`docs/research/${base}-source-freeze-${date}.json`,{records:frozen,sourceInputs:before.sourceInputs,...(fs.existsSync(dependencies)?{sourceDependencies:read(dependencies)}:{})});
  console.log(JSON.stringify({accepted:records.length,skipped:skipped.length,cases:selected.size,live:Object.values(views).flatMap(v=>v.cases).filter(c=>c.procedureContext.mode==='live').length,chartReview:Object.values(views).flatMap(v=>v.cases).filter(c=>c.procedureContext.mode==='chart_review').length,orders:orders.length,families:families.length,corrections:corrections.length,claims:claims.length,sources:sources.length}));
}

if(process.argv.includes('integrate')){
  const before=read(fixture);
  const data=await import('../../packages/clinical-content/src/question-program-batch9-accepted-data-20261112.ts');
  const replace=(text,a,b)=>{assert.equal(text.split(a).length,2,'Unique anchor '+a);return text.replace(a,b);};
  function edit(path,change){const text=fs.readFileSync(path,'utf8');assert.equal(sha(text),before.observed[path],path+' exact captured preimage');fs.writeFileSync(path,change(text));}
  edit(dir+'question-ship-manifest.ts',text=>{
    function endOf(anchor){let at=text.indexOf(anchor);assert(at>=0);at+=anchor.length-1;const start=at,open=text[at],close=open==='['?']':'}';let depth=0,quote=false,escape=false,line=false,comment=false;
      for(;at<text.length;at++){const c=text[at],n=text[at+1];if(line){if(c==='\n')line=false;continue;}if(comment){if(c==='*'&&n==='/'){comment=false;at++;}continue;}
        if(quote){if(escape)escape=false;else if(c==='\\')escape=true;else if(c==='"')quote=false;continue;}if(c==='/'&&n==='/'){line=true;at++;continue;}if(c==='/'&&n==='*'){comment=true;at++;continue;}if(c==='"'){quote=true;continue;}if(c===open)depth++;if(c===close&&--depth===0)return{start,end:at};}throw new Error(anchor);}
    const rows=data.PROGRAM_BATCH9_ROWS;
    assert(rows.every(r=>!before.manifest.accepted.some(a=>a.acceptanceId===r.acceptanceId)));
    const a=endOf('  accepted: [');const comma=/,\s*$/.test(text.slice(a.start+1,a.end))?'':',';
    text=text.slice(0,a.end)+comma+'\n  // Batch9: exact reviewed, whole-case, ENG-I01-compatible intraop/record drafts.\n'+JSON.stringify(rows,null,2).slice(1,-1)+',\n'+text.slice(a.end);
    const h=endOf('  headerSources: {');const headers=Object.fromEntries(rows.map(r=>[r.caseId,r.sourceView]));
    assert(Object.keys(headers).every(id=>!before.manifest.headerSources[id]));
    const hc=/,\s*$/.test(text.slice(h.start+1,h.end))?'':',';
    text=text.slice(0,h.end)+hc+'\n'+JSON.stringify(headers,null,2).slice(1,-1)+'\n'+text.slice(h.end);
    return replace(text,'question-ship.2026-11-12.v17','question-ship.2026-11-12.v18');
  });
  edit(dir+'synthetic-content.ts',text=>{
    text='import {QUESTION_PROGRAM_BATCH9_ACCEPTED_SOURCE_VIEWS,withAcceptedQuestionProgramBatch9Concepts} from "./question-program-batch9-accepted-20261112";\n'+text;
    text=replace(text,'projectManagerAcceptedQuestions(withAcceptedQuestionProgramBatch8Concepts(','projectManagerAcceptedQuestions(withAcceptedQuestionProgramBatch9Concepts(withAcceptedQuestionProgramBatch8Concepts(');
    text=replace(text,'QUESTION_CATALOG_RELEASE, QUESTION_NEW_N3_PRE_RELEASE.concepts))))','QUESTION_CATALOG_RELEASE, QUESTION_NEW_N3_PRE_RELEASE.concepts)))))');
    return replace(text,'  ...QUESTION_PROGRAM_BATCH8_ACCEPTED_SOURCE_VIEWS,','  ...QUESTION_PROGRAM_BATCH9_ACCEPTED_SOURCE_VIEWS,\n  ...QUESTION_PROGRAM_BATCH8_ACCEPTED_SOURCE_VIEWS,');
  });
  edit(dir+'index.ts',text=>replace(text,'QUESTION_PROGRAM_BATCH6_RUNTIME_FAMILY_CONTEXTS as PEDIATRIC_CLINIC_FAMILY_CONTEXTS} from "./question-program-batch6-accepted-20261112"','QUESTION_PROGRAM_BATCH9_RUNTIME_FAMILY_CONTEXTS as PEDIATRIC_CLINIC_FAMILY_CONTEXTS} from "./question-program-batch9-accepted-20261112"')+
    '\n// Batch9 exact manifest/source integration; author sidecars remain immutable.\nexport * from "./question-program-batch9-accepted-20261112";\n');
  edit(dir+'answer-choice-timing.ts',text=>text+'\nimport {QUESTION_PROGRAM_BATCH9_ACCEPTED_TIMING_ENTRIES} from "./question-program-batch9-accepted-20261112";\nANSWER_CHOICE_TIMING_REGISTRY.push(...QUESTION_PROGRAM_BATCH9_ACCEPTED_TIMING_ENTRIES);\n');
  edit('packages/game-domain/src/test-choice-orders.ts',text=>{
    text='import {QUESTION_PROGRAM_BATCH9_ACCEPTED_TEST_ORDER_RECORDS} from "@gamify-surgery/clinical-content";\n'+text;
    return replace(text,'  ...QUESTION_PROGRAM_BATCH8_ACCEPTED_TEST_ORDER_RECORDS,','  ...QUESTION_PROGRAM_BATCH8_ACCEPTED_TEST_ORDER_RECORDS,\n  ...QUESTION_PROGRAM_BATCH9_ACCEPTED_TEST_ORDER_RECORDS,');
  });
  edit(dir+'question-program-batch8-acceptance-test-support.ts',text=>{
    text='import {beforeProgramBatch9AcceptanceRelease,beforeProgramBatch9AcceptanceManifest,beforeProgramBatch9AcceptanceTimings,beforeProgramBatch9AcceptanceSource} from "./question-program-batch9-acceptance-test-support";\n'+text;
    text=replace(text,'  if(digest(release)===before.defaultSha256)return release;','  if(release.cases.some(c=>c.procedureContext&&c.id.startsWith("case.intraop.")))release=beforeProgramBatch9AcceptanceRelease(release);\n  if(digest(release)===before.defaultSha256)return release;');
    text=replace(text,'  if(!manifest.accepted.some(r=>r.sourceView==="owner-decisions-batch8"))return manifest;','  if(manifest.accepted.some(r=>r.sourceView.startsWith("intraop-batch9-")))manifest=beforeProgramBatch9AcceptanceManifest(manifest);\n  if(!manifest.accepted.some(r=>r.sourceView==="owner-decisions-batch8"))return manifest;');
    text=replace(text,'  // Earlier inverse steps call this again','  actual=beforeProgramBatch9AcceptanceTimings(actual);\n  // Earlier inverse steps call this again');
    return replace(text,'  const row=migration.files.find(r=>r.path===path);','  current=beforeProgramBatch9AcceptanceSource(path,current);\n  const row=migration.files.find(r=>r.path===path);');
  });
  console.log('Integrated exact manifest rows, source views, concepts, parent metadata, waits and strict historical-epoch bridge.');
}

if(process.argv.includes('record')){
  const before=read(fixture),content=await import('../../packages/clinical-content/src/index.ts');
  const live=content.SYNTHETIC_CLINICAL_RELEASE;
  const rows=content.QUESTION_PROGRAM_BATCH9_ACCEPTED_ROWS;
  output(`tools/question-quality/fixtures/${base}-after-${date}.json`,{
    defaultSha256:digest(live),manifestSha256:digest(content.QUESTION_SHIP_MANIFEST),timingSha256:digest(content.ANSWER_CHOICE_TIMING_REGISTRY),
    catalogSha256:digest(content.QUESTION_CATALOG_RELEASE),newQuestionIds:rows.map(r=>r.questionVariantId),newCaseIds:content.QUESTION_PROGRAM_BATCH9_ACCEPTED_CASES.map(c=>c.id),
    newConceptIds:live.concepts.filter(c=>!before.defaultRelease.concepts.some(p=>p.id===c.id)).map(c=>c.id),conceptHashes:Object.fromEntries(live.concepts.map(c=>[c.id,digest(c)])),
    cases:live.cases.length,nodes:live.cases.flatMap(c=>c.decisionNodes).length,registeredMeanings:live.concepts.length,
    scoredMeanings:new Set(live.cases.flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId))).size,acceptedRows:content.QUESTION_SHIP_MANIFEST.accepted.length,
    caseHashes:Object.fromEntries(live.cases.map(c=>[c.id,digest(c)])),bindings:live.cases.flatMap(c=>c.decisionNodes.map(n=>[c.id,n.id,n.questionVariantId,n.primaryConceptId])),
  });
  const more=`tools/question-quality/fixtures/${base}-test-source-before-${date}.json`;
  const preimages=[...before.sourcePreimages,...(fs.existsSync(more)?read(more):[])];
  const files=preimages.filter(f=>sha(fs.readFileSync(f.path))!==f.beforeSha256).map(f=>({...f,afterSha256:sha(fs.readFileSync(f.path))}));
  output(`tools/question-quality/fixtures/${base}-source-migration-${date}.json`,{files});
  console.log(JSON.stringify({cases:live.cases.length,nodes:live.cases.flatMap(c=>c.decisionNodes).length,meanings:live.concepts.length,rows:content.QUESTION_SHIP_MANIFEST.accepted.length,manifestSha256:digest(content.QUESTION_SHIP_MANIFEST),newCases:content.QUESTION_PROGRAM_BATCH9_ACCEPTED_CASES.length,sourceMigrations:files.length}));
}
