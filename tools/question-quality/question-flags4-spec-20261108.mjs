import fs from 'node:fs';

export const intake=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-flags4-before-20261108.json','utf8'));
export const draft={contentVersion:'question-authoring.2026-11-08.flags4-r1',reviewStatus:'needs_clinician_review',aiAssistedDrafting:true,lastClinicianReview:null};
export const spec={
 id:'F4-01',title:'Phosphate handling after nutrition restarts',
 variantId:'question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3.r1',
 conceptId:intake.target.node.primaryConceptId,patientName:'Maya Chen',age:31,sex:'Female',complaint:'Nutrition follow-up',
 presentation:'{patientName}, a 31-year-old woman, is reviewed after a monitored nutrition restart following prolonged poor intake.',
 currentUpdate:'Serum phosphate fell as carbohydrate feeding resumed.',
 task:"Which physiological process links carbohydrate reintroduction to {patientName}'s phosphate decline?",
 options:[
  ['Increased cellular uptake of phosphate','Carbohydrate reintroduction can increase insulin-associated cellular uptake, moving phosphate from the circulation into cells. This is the feeding-related mechanism being asked about.'],
  ['Increased urinary excretion of phosphate','This selects removal from the body rather than redistribution into cells. It confuses a different route of phosphate handling with the metabolic response to carbohydrate reintroduction.'],
  ['Decreased intestinal absorption of phosphate','This treats the lower serum concentration as reduced transfer from the intestine. It does not identify the insulin-linked redistribution associated with carbohydrate reintroduction.'],
 ],
 explanation:'Carbohydrate reintroduction increases insulin-associated phosphate uptake into cells as metabolism shifts toward synthesis.\nThe renal and intestinal options describe removal or reduced entry, rather than this redistribution.\nA phosphate fall by itself does not establish refeeding syndrome.',
 meaning:'same',versionReason:'The existing concept explicitly tests carbohydrate-associated insulin, cellular phosphate uptake and the anabolic transition. This revision asks about the phosphate-handling process within that objective; no diagnostic, treatment or threshold objective is added.',
 ownerResolution:'Replaces four repetitive catabolic/anabolic permutations with three parallel phosphate-handling processes. A complete task asks for the link between carbohydrate reintroduction and the observed serum change. The anabolic interpretation and insulin mechanism move to post-answer feedback.',
 inference:['Relate the observed phosphate decline to the resumption of carbohydrate after poor intake.','Distinguish redistribution into cells from removal through kidneys or reduced entry through the intestine.'],
 category:'Physiological phosphate-handling processes: direction of movement plus anatomical destination or source.',
 closest:'The intestinal option substitutes reduced gut entry for redistribution; the renal option treats a fall in serum concentration as loss from the body. Both answer the same mechanism task, rather than introducing a different management stage. Poor intake is not described as malabsorption.',
 deciding:'The task asks for the metabolic link to carbohydrate reintroduction after undernutrition, not for a diagnosis from an isolated low phosphate measurement. The recorded insulin-associated cellular-uptake claim supplies that link.',
 counterfactual:'If the question instead established ongoing phosphate loss or impaired absorption and asked for that process, one of the alternative handling routes could be appropriate. Those diagnoses and their criteria are not asserted or tested here.',
 attack:'Hide the key: there is no pre-answer insulin, cellular uptake, anabolic label, treatment recommendation or key-specific mechanism description. Phosphate appears in every option. Each option has five words, the same noun phrase structure and a single physiological process. The task does not ask for the whole-body phosphate balance or diagnose a syndrome.',
 deletion:'Age/sex/name provide the required short patient frame; prolonged poor intake and resumption of carbohydrate define the mechanism context. The update supplies the observed serum change once. No availability, permission, preference, duration, exclusion list or teaching sentence is retained.',
 difficulty:'Likely foundational/easy to moderate for a prepared PGY-2/3: recognizing the feeding context is straightforward, but the choices require distinguishing concentration redistribution from loss or reduced entry. This is an author prediction, not an independent PASS, accepted-basic label or calibrated hard item. Do not add unsupported renal/GI criteria merely to inflate difficulty.',
 limitation:'The sole recorded direct mechanism source is the background physiology in a 2023 neurocritical cohort report. AuSPEN supports the diagnostic caution, not a new causal exclusion algorithm. No clinical diagnosis, exact phosphate value, feeding interval/rate, incidence or management plan is inferred. Sources are reused offline with their original 2026-10-07 access/check dates.',
};
const claim=(suffix,statement,basisClaimId,category,limitation)=>{
 const basis=intake.claims.find(c=>c.id===basisClaimId);
 if(!basis)throw Error('Missing recorded basis '+basisClaimId);
 return {...draft,id:'claim.flags4.20261108.'+suffix,statement,basisClaimIds:[basisClaimId],sourceIds:basis.sourceIds,
  evidenceCategory:category,certainty:basis.certainty,limitation,applicablePopulation:'The bounded constructed adult nutrition-restart mechanism case; not a diagnostic or management protocol.',
  lastCheckedOn:'2026-11-08',verificationScope:'Independent application of the already recorded atomic fact. No external source retrieval or currentness check; original basis/access dates retained.'};
};
export const claims=[
 claim('carbohydrate-phosphate-uptake','Following substantial undernutrition, carbohydrate reintroduction can lower serum phosphate through insulin-associated uptake into cells.',
  'claim.gs028f.refeeding.insulin-phosphate-shift','definition',spec.limitation),
 claim('anabolic-transition','Resuming nutrition after starvation favors anabolic rather than catabolic metabolism.',
  'claim.gs028f.refeeding.anabolic-transition','definition','Qualitative background physiology only. No anabolic rate, energy requirement or phosphate threshold is introduced; the existing single-source limitation remains.'),
 claim('diagnostic-boundary','A fall in serum phosphate after feeding does not, by itself, establish refeeding syndrome.',
  'claim.gs028f.refeeding.phosphate-not-specific','safety_boundary','Recorded AuSPEN caution only; no diagnostic definition, timing rule, percentage decline, alternate-cause algorithm or treatment rule is adopted.'),
];
