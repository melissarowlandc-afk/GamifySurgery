import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { lintQuestion } from "./lint.mjs";
import { inventoryRelease, preAnswerFields, collectAuthoredMetadata, authoredRationales } from "./bank.mjs";
const choices=labels=>labels.map((label,i)=>({id:"choice"+i,label,isCorrect:i===0}));
const lint=(labels,fields={},concept={})=>lintQuestion({variantId:"question.test.r2",caseId:"case.test",choices:choices(labels),fields,concept});
const has=(r,rule)=>r.findings.some(f=>f.rule===rule);

test("reports key-only phrases and exact reconstructable spans",()=>{
  const fields={presentation:"The chart repeats plasma free metanephrines here.",stem:"Which study?"};
  const cs=choices(["Plasma free metanephrines","Dexamethasone suppression test","Aldosterone renin ratio"]);
  const r=lintQuestion({variantId:"q",caseId:"c",fields,choices:cs});
  assert(has(r,"key-only-phrase-overlap"));
  for(const f of r.findings)for(const e of f.evidence){const original=e.choiceId?cs.find(c=>c.id===e.choiceId).label:fields[e.field];assert.equal(original.slice(e.start,e.end),e.text);}
  assert(!has(lint(["Plasma assay","Urine assay","Saliva assay"],{stem:"Which assay?"}),"key-only-word-overlap"));
});

test("owner rule flags X alone in either key or distractor, with exact spans",()=>{
  const r=lint(["Compression stockings alone","Endovenous ablation","Foam sclerotherapy"]);
  const f=r.findings.find(f=>f.rule==="option-alone");assert(f);assert.equal(f.evidence[0].text,"alone");
  assert.equal(f.evidence[0].choiceId,"choice0");
  assert(has(lint(["Hospital assessment","Diet advice alone","Repeat potassium"]),"option-alone"));
  assert(!has(lint(["Compression stockings","Endovenous ablation","Foam sclerotherapy"]),"option-alone"));
});

test("owner rule compares generic individualization with concrete options",()=>{
  for(const term of ["Individualized vascular consultation","Tailored management","Shared-decision planning","Shared decision making"])
    assert(has(lint([term,"Endovenous ablation","Compression stockings"]),"option-generic-individualization"),term);
  assert(!has(lint(["Tailored management","Individualized management","Shared planning"]),"option-generic-individualization"));
  assert(!has(lint(["Individualized endovenous ablation","Foam sclerotherapy","Compression stockings"]),"option-generic-individualization"));
});

test("owner rule asks for a named treatment while retaining exact candidate spans",()=>{
  const r=lint(["Esophageal treatment assessment","Laparoscopic Heller myotomy","Oral omeprazole therapy"]);
  const f=r.findings.find(f=>f.rule==="unnamed-treatment-action");assert(f);
  assert.equal(f.evidence[0].text,"treatment assessment");assert.equal(f.evidence[0].choiceId,"choice0");
  for(const label of ["Management discussion","Treatment planning"])assert(has(lint([label,"Myotomy","Omeprazole"]),"unnamed-treatment-action"));
  assert(!has(lint(["Repeat diagnostic manometry","Laparoscopic Heller myotomy","Oral omeprazole therapy"]),"unnamed-treatment-action"));
});

test("image inventory checks visible descriptions and captions, excluding the asset path",()=>{
  const cs={presentation:"{patientName} has dysphagia.",decisionNodes:[{stem:"Which interpretation?",exhibit:{kind:"image",caption:"Pressure tracing",assetPath:"clinical-exhibits/achalasia-key.png",description:"The junction relaxes slowly."}}]};
  const fields=preAnswerFields(cs,0);
  assert.equal(fields["exhibit.caption"],"Pressure tracing");assert.equal(fields["exhibit.description"],"The junction relaxes slowly.");
  assert(!Object.hasOwn(fields,"exhibit.assetPath"));assert(!Object.values(fields).some(v=>String(v).includes("achalasia-key")));
  assert(has(lint(["Slow junction relaxation","Absent body contraction","Normal propagation"],fields),"key-only-word-overlap"));
});

test("investigation categories recognize full modality names and physiological/pathological studies",()=>{
  const task={stem:"Which investigation should be arranged?"};
  assert(!has(lint(["Repeat high-resolution manometry","Obtain a timed barium esophagram","Obtain pH-impedance monitoring"],task),"heterogeneous-option-category"));
  assert(!has(lint(["Obtain ultrasonography","Obtain magnetic resonance imaging","Obtain computed tomography"],task),"heterogeneous-option-category"));
  assert(!has(lint(["Perform an excisional biopsy","Perform a punch biopsy","Request deeper histological sections"],task),"heterogeneous-option-category"));
  assert(has(lint(["Obtain ultrasound","Obtain computed tomography","Achalasia"],task),"heterogeneous-option-category"));
});

test("owner availability cues are found in presentation, task, update and exhibit without using feedback metadata",()=>{
  for(const phrase of ["The patient is available for immediate transfer.","HIDA is available and won't delay care.","She can swallow and medicines are available."]){
    for(const field of ["presentation","stem","currentUpdate","exhibit.caption"]){
      const r=lint(["Hospital assessment","Repeat potassium","Diet advice"],{[field]:phrase});
      const findings=r.findings.filter(f=>f.rule==="availability-permission-cue");assert(findings.length,phrase);
      for(const f of findings){const e=f.evidence[0];assert.equal(e.field,field);assert.equal(phrase.slice(e.start,e.end),e.text);}
    }
  }
  assert(!has(lint(["Alpha plan","Beta plan","Gamma plan"],{presentation:"She brings the completed ultrasound report."}),"availability-permission-cue"));
});

test("owner findings rule flags supplied eligibility and named rejection but permits a supplied diagnosis for management",()=>{
  for(const phrase of ["The nodule meets biopsy criteria.","Suspicious features meeting biopsy criteria.","The ultrasound is inconclusive."])
    assert(has(lint(["Thyroid FNA","Thyroid scan","Repeat ultrasound"],{presentation:phrase}),"supplied-clinical-conclusion"),phrase);
  const presentation="The team diagnosed hyperacute antibody-mediated rejection.";
  assert(has(lint(["Preformed antibodies","New antibodies","Activated T cells"],{presentation,stem:"Which immune effector explains this?"}),"supplied-clinical-conclusion"));
  assert(!has(lint(["Plan A","Plan B","Plan C"],{presentation,stem:"Which management plan is appropriate?"}),"supplied-clinical-conclusion"));
  assert(!has(lint(["Thyroid FNA","Thyroid scan","Repeat ultrasound"],{presentation:"Ultrasound shows a solid hypoechoic nodule with irregular margins."}),"supplied-clinical-conclusion"));
});

test("owner clarity rules distinguish bare negative imaging and unqualified cervical from actual findings and explicit sites",()=>{
  for(const presentation of ["Mammography and ultrasound are negative.","She has negative imaging."])
    assert(has(lint(["Biopsy referral","Breast MRI","Repeat ultrasound"],{presentation}),"unexplained-negative-imaging"));
  assert(!has(lint(["Biopsy referral","Breast MRI","Repeat ultrasound"],{presentation:"At the palpable site, ultrasound shows no solid or cystic correlate."}),"unexplained-negative-imaging"));
  assert(has(lint(["FNA","Open biopsy","Observation"],{presentation:"The lateral cervical mass persists."}),"ambiguous-cervical-term"));
  for(const presentation of ["The lateral neck mass persists.","The cervical lymph node persists.","Cervical spine imaging is complete.","A uterine cervical lesion is present."])
    assert(!has(lint(["FNA","Open biopsy","Observation"],{presentation}),"ambiguous-cervical-term"),presentation);
});

test("bounded anatomy screen detects the actual remote nerve distractors without claiming to validate new choices",()=>{
  assert(has(lint(["Phrenic nerve","Median nerve","Ulnar nerve","Sciatic nerve"],{presentation:"Shoulder pain after laparoscopy."}),"nerve-competitor-plausibility"));
  assert(!has(lint(["Phrenic nerve","Vagus nerve","Supraclavicular nerves","Suprascapular nerve"],{presentation:"Shoulder pain after laparoscopy."}),"nerve-competitor-plausibility"));
});

test("owner's actual flagged records trigger each new targeted rule and reconstruct source spans",()=>{
  const snapshot=JSON.parse(readFileSync(new URL("fixtures/question-flags-before-20261104.json",import.meta.url),"utf8"));
  const examples=[
    ["question.cirrhosis-perioperative-risk.multifactor-assessment.v3","option-alone"],
    ["question.varicose-veins.intervention-referral-after-axial-reflux.v4","option-generic-individualization"],
    ["question.hyperkalaemia.severe-community-result-transfer.v1","availability-permission-cue"],
    ["question.thyroid-nodule.fna-selection.v2","supplied-clinical-conclusion"],
    ["question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v4","unexplained-negative-imaging"],
    ["question.gs028f.head-neck.initial-fna-not-open-biopsy.v4","ambiguous-cervical-term"],
    ["question.postlaparoscopy.benign-referred-shoulder-pain.v2","nerve-competitor-plausibility"],
  ];
  for(const [id,rule]of examples){
    const cs=snapshot.release.cases.find(c=>c.decisionNodes.some(n=>n.questionVariantId===id)),index=cs.decisionNodes.findIndex(n=>n.questionVariantId===id),n=cs.decisionNodes[index],fields=preAnswerFields(cs,index);
    const f=lintQuestion({variantId:id,fields,choices:n.answerChoices}).findings.find(f=>f.rule===rule);assert(f,id);
    for(const e of f.evidence){const source=e.choiceId?n.answerChoices.find(c=>c.id===e.choiceId).label:fields[e.field];assert.equal(source.slice(e.start,e.end),e.text);}
  }
});

test("round-one draft contexts remove owner-rule giveaways; the live held FNA remains explicit",async()=>{
  await import("../economy-audit/source-loader.mjs");
  const c=await import("../../packages/clinical-content/src/index.ts");
  const ownerRules=new Set(["option-alone","option-generic-individualization","availability-permission-cue","supplied-clinical-conclusion","unexplained-negative-imaging","ambiguous-cervical-term","nerve-competitor-plausibility"]);
  for(const r of c.QUESTION_FLAG_REVISIONS){
    const cs=c.QUESTION_FLAGS_ROUND1_RELEASE.cases.find(cs=>cs.id===r.caseId),i=cs.decisionNodes.findIndex(n=>n.id===r.nodeId),n=cs.decisionNodes[i];
    for(const profile of [null,...(cs.approvedInstantiationProfiles??[])]){
      const result=lintQuestion({variantId:n.questionVariantId,choices:n.answerChoices,fields:preAnswerFields(cs,i,profile)});
      assert.deepEqual(result.findings.filter(f=>ownerRules.has(f.rule)),[],r.auditId+" / "+(profile?.id??"canonical"));
    }
  }
  const cs=c.SYNTHETIC_CLINICAL_RELEASE.cases.find(cs=>cs.id==="case.thyroid-nodule.incidental-imaging"),n=cs.decisionNodes[0];
  assert.equal(n.questionVariantId,"question.thyroid-nodule.fna-selection.v2");
  assert(has(lintQuestion({variantId:n.questionVariantId,choices:n.answerChoices,fields:preAnswerFields(cs,0)}),"supplied-clinical-conclusion"));
});
test("detects length and qualifier disparity without requiring a long key",()=>{
  const r=lint(["A compact label","A longer alternative with several clauses before assessment after treatment","Another label"]);
  assert(has(r,"option-length-disparity"));assert(has(r,"key-length-disparity"));assert(has(r,"option-specificity-disparity"));
  assert(!has(lint(["First management plan","Second management plan","Third management plan"]),"option-length-disparity"));
});
test("reports abbreviation, named-test aliases, explanatory clauses and absolutes",()=>{
  const r=lint(["Hepatobiliary scintigraphy (HIDA)","Observation because symptoms always resolve","Repeat clinical assessment"],{presentation:"HIDA is available"});
  for(const rule of ["unique-key-abbreviation","key-test-name-in-context","unique-key-test-name","option-explanation","option-absolute"])assert(has(r,rule),rule);
});

test("compares abbreviation tokens consistently and does not invent a B-cell abbreviation",()=>{
  assert(!has(lint(["B-cell infiltrate","Marginal-zone B-cell lymphoma","Large B-cell lymphoma"]),"unique-key-abbreviation"));
  assert(!has(lint(["EUS-guided drainage","EUS-guided sampling","Percutaneous drainage"]),"unique-key-abbreviation"));
  const r=lint(["EUS-guided drainage","Percutaneous drainage","Operative drainage"]);
  const f=r.findings.find(f=>f.rule==="unique-key-abbreviation");
  assert(f);assert.equal(f.evidence[0].text,"EUS");
  assert.equal("EUS-guided drainage".slice(f.evidence[0].start,f.evidence[0].end),"EUS");
});
test("heterogeneous categories and subtotal scope are advisory",()=>{
  assert(has(lint(["Cystic condition","Arrange a biopsy","Drainage operation"],{stem:"Which diagnosis is most likely?"}),"heterogeneous-option-category"));
  assert(has(lint(["Subtotal fenestrating","Subtotal reconstituting","Total excision"],{stem:"Which subtotal classification applies?"}),"option-scope-mismatch"));
});
test("convergence and near duplicate report the competing option evidence",()=>{
  assert(has(lint(["Posterior pelvic repair","Posterior mesh repair","Anterior pelvic procedure"]),"convergence"));
  assert(!has(lint(["From extracellular fluid into cells","From cells into extracellular fluid","From circulating blood into urine"]),"convergence"));
  const r=lint(["Arrange prompt specialist referral","Arrange prompt specialist referral now","Provide routine reassessment"]);
  assert(has(r,"near-duplicate-options"));assert(r.findings.find(f=>f.rule==="near-duplicate-options").evidence.every(e=>e.choiceId));
});
test("a complete balanced component matrix does not uniquely converge on the key",()=>{
  const full=["Venous restriction and reduced compliance","Venous pooling and reduced compliance","Venous restriction and increased resistance","Venous pooling and increased resistance"];
  assert(!has(lint(full),"convergence"));
  const incomplete=["Venous restriction and reduced compliance","Venous pooling and reduced compliance","Venous restriction and increased resistance"];
  const r=lint(incomplete);assert(has(r,"convergence"));
  assert(r.findings.find(f=>f.rule==="convergence").metrics.optionCoverage.every(c=>typeof c.sharedComponentDensity==="number"));
  assert(has(lint(["Posterior pelvic repair","Posterior mesh repair","Anterior pelvic procedure","Lateral access procedure"]),"convergence"));
});
test("diagnosis disclosure is conditional on task and metadata",()=>{
  const labels=["Merkel cell carcinoma","Small cell carcinoma","Cutaneous malignant melanoma"], concept={conceptType:"diagnosis",diagnosisNames:["cutaneous neuroendocrine carcinoma"]};
  assert(has(lint(labels,{presentation:"Report states cutaneous neuroendocrine carcinoma.",stem:"Which diagnosis fits?"},concept),"diagnosis-disclosed"));
  assert(!has(lint(labels,{presentation:"Merkel cell carcinoma",stem:"Which management plan?"},concept),"diagnosis-disclosed"));
});
test("negative match requires exactly one distractor and stops at contrast",()=>{
  const r=lint(["Dermatitis","Fungal infection","Bacterial infection"],{presentation:"No fungal change but bacterial infection remains possible."});
  const f=r.findings.filter(f=>f.rule==="negative-aligned-to-distractor");
  assert.equal(f.length,1);assert.equal(f[0].metrics.term,"fungal");assert(!f[0].evidence[0].text.includes("bacterial"));
  assert(!has(lint(["Dermatitis","Fungal infection","Fungal colonisation"],{presentation:"No fungal findings."}),"negative-aligned-to-distractor"));
});
test("three and four balanced options both accepted; malformed keys rejected",()=>{
  for(const labels of [["Alpha plan","Beta plan","Gamma plan"],["Alpha plan","Beta plan","Gamma plan","Delta plan"]])assert.equal(lint(labels).optionCount,labels.length);
  assert.throws(()=>lintQuestion({variantId:"q",choices:[{id:"a",label:"A",isCorrect:false}],fields:{}}),/one key/);
});
test("visible history includes prior feedback but excludes future/current feedback",()=>{
  const c={id:"c",chiefComplaint:"Lump",presentation:"Present",decisionNodes:[{stem:"First",explanation:"Prior feedback",resultGateAfter:{resultNarrative:"Returned result"}},{stem:"Current",explanation:"Must be excluded"},{stem:"Future",explanation:"Future"}]};
  const fields=preAnswerFields(c,1,{id:"p",presentation:"Profile presentation"});
  assert.equal(fields.presentation,"Profile presentation");assert.equal(fields["priorFeedback[0]"],"Prior feedback");assert.equal(fields["priorResults[0]"],"Returned result");
  assert(!Object.values(fields).includes("Must be excluded"));assert(!Object.values(fields).includes("Future"));
});
test("census deduplicates variant identity while preserving cases and profile-specific cues",()=>{
  const node={id:"node",questionVariantId:"q",primaryConceptId:"concept.q",stem:"Choose plan",answerChoices:choices(["Alpha plan","Beta plan","Gamma plan"]),explanation:"After answer"};
  const base={id:"c",earliestFacilityStage:0,tutorialEligible:true,chiefComplaint:"Concern",presentation:"Plain",decisionNodes:[node],approvedInstantiationProfiles:[{id:"p",presentation:"Alpha plan"}]};
  const metadata=collectAuthoredMetadata({q:{id:"q",conceptId:"concept.q",contentVersion:"r2",reviewStatus:"needs_clinician_review",answerChoices:node.answerChoices,supportingEvidenceClaimIds:[]},concept:{id:"concept.q",learningObjective:"Choose",educationalTier:1}});
  const r=inventoryRelease({id:"release",cases:[base,{...base,id:"c2"}],concepts:[]},metadata,{tutorialCaseIds:["c"]});
  assert.equal(r.totals.uniqueVariants,1);assert.equal(r.totals.nodeOccurrences,2);assert.equal(r.variants[0].caseReferenceCount,2);assert(r.variants[0].tutorialSequence);assert(r.variants[0].findings.some(f=>f.occurrences.some(o=>o.profileIds.includes("p"))));
});
test("legacy approval metadata applies only to explicitly named old identities",()=>{
  const m=collectAuthoredMetadata({approval:{id:"approval.legacy",decision:"approved",approvedQuestionVariantIds:["q.old"],approvedEvidenceClaimIds:["claim.old"],contentVersion:"legacy.v1",reviewer:"Named clinician"}});
  assert.equal(m.questions.get("q.old")[0].metadataOrigin,"approval_record");
  assert.equal(m.questions.get("q.old")[0].contentVersion,"legacy.v1");
  assert(!m.questions.has("q.old.r2"));
});
test("flags the reviewed A17 principle cue without pretending its rationale match is key-exclusive",()=>{
  const prior=JSON.parse(readFileSync(new URL("fixtures/manager-review-before-20261029.json",import.meta.url),"utf8")).revisions.find(r=>r.auditId==="A17").question;
  const fields={stem:prior.stem}, rationales=authoredRationales([prior],prior.answerChoices);
  const old=lintQuestion({variantId:prior.id,choices:prior.answerChoices,fields,rationales});
  assert(has(old,"lead-in-decision-principle"));
  // The actual old key says pheochromocytoma, whereas both wrong reasons say
  // safety. A lexical rule must not claim semantic key exclusivity here.
  assert(!has(old,"key-rationale-principle-cue"));
  const neutral=lintQuestion({variantId:"q.new",choices:prior.answerChoices,fields:{stem:"Which test should be completed before {patientName}'s adrenal biopsy?"},rationales});
  assert(!has(neutral,"lead-in-decision-principle"));
});
test("reports an alias-matched principle only when every explicit rationale is available and the key is unique",()=>{
  const cs=choices(["Alpha assay","Beta assay","Gamma assay"]),fields={stem:"Which assay addresses the specific safety risk?"};
  const rationales=[{choiceId:"choice0",text:"Evaluates the procedural hazard."},{choiceId:"choice1",text:"Measures another pathway."},{choiceId:"choice2",text:"Addresses a different objective."}];
  const r=lintQuestion({variantId:"q",choices:cs,fields,rationales});
  const f=r.findings.find(f=>f.rule==="key-rationale-principle-cue");assert(f);
  assert.equal(f.metrics.principle,"safety");assert.equal(f.evidence[0].text,"specific safety risk");
  const e=f.evidence[1];assert.equal(e.field,"authoring.answerChoices.rationale");assert.equal(e.postAnswerMetadata,true);
  assert.equal(rationales[0].text.slice(e.start,e.end),e.text);
  for(const variant of [rationales.slice(0,2),rationales.map(x=>x.choiceId==="choice1"?{...x,text:"Also discusses the procedural hazard."}:x)])
    assert(!has(lintQuestion({variantId:"q",choices:cs,fields,rationales:variant}),"key-rationale-principle-cue"));
});
test("reviews named comparison principles without banning ordinary timing or leaking rationale words into context",()=>{
  for(const term of ["first-line","definitive","most specific","gold standard","greatest diagnostic sensitivity","preserving uninvolved thyroid tissue"])
    assert(has(lint(["Alpha plan","Beta plan","Gamma plan"],{stem:"Which plan is "+term+"?"}),"lead-in-decision-principle"),term);
  const cs=choices(["Alpha assay","Beta assay","Gamma assay"]);
  const r=lintQuestion({variantId:"q",choices:cs,fields:{stem:"Which initial test should be arranged next?"},rationales:[{choiceId:"choice0",text:"Alpha assay is the gold standard for safety."}]});
  assert(!has(r,"lead-in-decision-principle"));assert(!has(r,"key-only-word-overlap"));
});
test("uses explicit authoring rationale metadata and refuses missing or conflicting key reasons",()=>{
  const cs=choices(["Alpha plan","Beta plan","Gamma plan"]).map(c=>({...c,rationale:"Runtime fallback repeats every option."}));
  const question={answerChoices:cs.map(c=>({id:c.id,rationale:c.isCorrect?null:"Explicit wrong reason."}))};
  const reasons=authoredRationales([question],cs);assert.equal(reasons[0].text,null);
  const conflict={answerChoices:[{id:"choice1",rationale:"Different authoring reason."}]};
  assert.equal(authoredRationales([question,conflict],cs)[1].text,null);
  const node={id:"n",questionVariantId:"q",primaryConceptId:"concept.q",stem:"Which safety plan?",answerChoices:cs,explanation:"Hidden"};
  const metadata=collectAuthoredMetadata({q:{...question,id:"q",contentVersion:"v",reviewStatus:"needs_clinician_review",supportingEvidenceClaimIds:[]}});
  const report=inventoryRelease({id:"r",concepts:[],cases:[{id:"c",earliestFacilityStage:0,presentation:"Visible",decisionNodes:[node]}]},metadata);
  assert.equal(report.totals.variantsWithCompleteRationales,0);
  assert(!report.variants[0].findings.some(f=>f.rule==="key-rationale-principle-cue"));
});

test("flags the owner's actual round-one preference, availability and mechanism cues outside the task",()=>{
  const old=JSON.parse(readFileSync(new URL("fixtures/owner-round1-before-20261029.json",import.meta.url),"utf8"));
  for(const auditId of ["A02","A11","A30"]){
    const r=old.revisions.find(r=>r.auditId===auditId),c=old.cases.find(c=>c.id===r.caseId),index=c.decisionNodes.findIndex(n=>n.id===r.nodeId),n=c.decisionNodes[index];
    const f=lintQuestion({variantId:n.questionVariantId,choices:n.answerChoices,fields:preAnswerFields(c,index),rationales:authoredRationales([r.question],n.answerChoices)}).findings.find(f=>f.rule==="case-detail-decision-cue");
    assert(f,auditId);assert(["presentation","currentUpdate"].includes(f.evidence[0].field));
    const e=f.evidence[0],source=preAnswerFields(c,index)[e.field];assert.equal(source.slice(e.start,e.end),e.text);
  }
});

test("rationale overlap requires complete explicit reasons and reports separate exact metadata spans",()=>{
  const cs=choices(["Alpha plan","Beta plan","Gamma plan"]),fields={presentation:"She asks to preserve normal tissue during treatment."};
  const rationales=[{choiceId:"choice0",text:"Would preserve normal tissue during treatment."},{choiceId:"choice1",text:"Chooses a different anatomical extent."},{choiceId:"choice2",text:"Changes the follow-up strategy."}];
  const f=lintQuestion({variantId:"q",choices:cs,fields,rationales}).findings.find(f=>f.rule==="case-detail-key-rationale-overlap");assert(f);
  assert.equal(f.evidence[0].field,"presentation");assert.equal(f.evidence[1].postAnswerMetadata,true);
  for(const reasons of [rationales.slice(0,2),rationales.map(r=>r.choiceId==="choice1"?{...r,text:rationales[0].text}:r)])assert(!has(lintQuestion({variantId:"q",choices:cs,fields,rationales:reasons}),"case-detail-key-rationale-overlap"));
});

test("retains raw observations without inventing semantic paraphrase detection or treating prior feedback as a new case detail",()=>{
  const cs=choices(["Reassess pouch fit","Change adhesive brand","Use antifungal treatment"]);
  const r=lintQuestion({variantId:"q",choices:cs,fields:{presentation:"A moist red ring borders the stoma.",currentUpdate:"The removed barrier is moist at its inner edge.","priorFeedback[0]":"Preserving normal tissue is a treatment goal."}});
  assert(!has(r,"case-detail-decision-cue"));assert(!has(r,"case-detail-key-rationale-overlap"));
});

test("flags an explicit cross-field ulcer-site conflict and returns exact spans",()=>{
  const fields={presentation:"The EGD shows a duodenal ulcer with a vessel.",currentUpdate:"The gastric ulcer has stopped bleeding."};
  const result=lint(["Clip treatment","Injection treatment","Powder treatment"],fields);
  const f=result.findings.find(f=>f.rule==="ulcer-location-continuity");assert(f);
  for(const e of f.evidence)assert.equal(fields[e.field].slice(e.start,e.end),e.text);
  assert(!has(lint(["Alpha","Beta","Gamma"],{...fields,currentUpdate:"The same duodenal ulcer has stopped bleeding."}),"ulcer-location-continuity"));
  assert(!has(lint(["Alpha","Beta","Gamma"],{presentation:"Both gastric ulcer and duodenal ulcer are present.",currentUpdate:fields.currentUpdate}),"ulcer-location-continuity"));
});
test("flags repeated complete case findings but excludes legitimate returned-result history",()=>{
  const sentence="No enlarged nodes are felt in the draining basin.";
  const fields={presentation:"Jamie attends clinic. "+sentence,currentUpdate:"Histology is back. "+sentence};
  const result=lint(["Alpha","Beta","Gamma"],fields);const f=result.findings.find(f=>f.rule==="repeated-case-finding");assert(f);
  for(const e of f.evidence)assert.equal(fields[e.field].slice(e.start,e.end),e.text);
  assert(!has(lint(["Alpha","Beta","Gamma"],{presentation:sentence,"priorResults[0]":sentence}),"repeated-case-finding"));
});
