import { createHash } from "node:crypto";
import { lintOwnerFlagRules } from "./owner-flag-rules-20261104.mjs";

export const LINTER_VERSION = "question-cue-lint.2026-11-04.v8";
export const OPTION_LENGTH_RATIO_WARNING = 2;
export const KEY_LENGTH_RATIO_WARNING = 1.5;
export const NEAR_DUPLICATE_JACCARD_WARNING = 0.8;

const STOP = new Set(("a an the of to in on at as by for from with without and or is are be been being this that these those which what how should most best appropriate patient patients clinical clinic case study test treatment plan assessment management evaluation approach finding findings disease condition").split(" "));
const WORD = /[A-Za-z0-9]+(?:['\u2019-][A-Za-z0-9]+)*/g;
export const tokens = text => [...String(text).matchAll(WORD)].map(m => ({
  text: m[0], norm: m[0].toLowerCase(), start: m.index, end: m.index + m[0].length,
}));
const useful = word => word.length >= 4 && !STOP.has(word);
const median = xs => { const a = [...xs].sort((x, y) => x-y); return a.length % 2 ? a[(a.length-1)/2] : (a[a.length/2-1]+a[a.length/2])/2; };
const canonical = s => tokens(s).map(t => t.norm).join(" ");

// Transparent editorial vocabulary, not a medical inference engine. A principle
// can be a legitimate requested comparison; every match still needs review.
export const DECISION_PRINCIPLES = [
  { id: "safety", lead: /\b(?:specific safety risk|safety(?: risk)?|safest|contraindications?)\b/gi, reason: /\b(?:safe|safety|hazards?|risks?|contraindicat\w*)\b/i },
  { id: "first-line", lead: /\bfirst[- ]line\b/gi, reason: /\b(?:first[- ]line|initial (?:recommended )?(?:step|treatment|therapy))\b/i },
  { id: "definitive", lead: /\b(?:definitive|definitively|curative)\b/gi, reason: /\b(?:definitiv\w*|curative|cure)\b/i },
  { id: "sensitivity", lead: /\b(?:(?:greatest|highest)\s+(?:diagnostic\s+)?sensitivity|most\s+sensitive)\b/gi, reason: /\b(?:sensitivity|sensitive)\b/i },
  { id: "specificity", lead: /\b(?:(?:greatest|highest)\s+(?:diagnostic\s+)?specificity|most\s+specific)\b/gi, reason: /\b(?:specificity|most specific)\b/i },
  { id: "gold-standard", lead: /\bgold[- ]standard\b/gi, reason: /\bgold[- ]standard\b/i },
  { id: "preservation", lead: /\b(?:preserv(?:e|ing)\s+(?:(?:uninvolved|normal|healthy)\s+)?(?:thyroid\s+)?tissue|(?:tissue|organ)[- ](?:preservation|preserving|sparing))\b/gi, reason: /\b(?:preserv(?:e|es|ing|ation)|(?:tissue|organ)[- ]sparing)\b/i },
];

// Case observations can supply a decision rule too. These transparent patterns
// flag review candidates, not medical exclusion or a semantic paraphrase proof.
export const CASE_DETAIL_CUES = [
  { id: "preservation-goal", pattern: /\b(?:preserv\w*\s+(?:(?:uninvolved|healthy|normal)\s+)?(?:thyroid\s+)?tissue|(?:tissue|organ)[- ](?:preservation|sparing))\b/gi },
  { id: "availability-permission", pattern: /\b(?:without (?:an? )?availability constraint|(?:promptly|readily|immediately) available|no (?:resource|availability) constraint)\b/gi },
  { id: "opening-mismatch-mechanism", pattern: /\b(?:cutout|(?:pouch|barrier) opening)\b[^.!?;]*(?:extends? beyond|too large|larger than|oversized|leaves[^.!?;]*exposed)[^.!?;]*/gi, key: /\b(?:resize|refit|fit|opening|seal)\b/i },
];

/** A small transparent alias list, not a clinical ontology or an indication rule. */
export const TEST_ALIASES = [
  ["Hepatobiliary scintigraphy", ["HIDA", "hepatobiliary scintigraphy"]],
  ["MRCP", ["MRCP", "magnetic resonance cholangiopancreatography"]],
  ["MRI", ["MRI", "magnetic resonance imaging"]],
  ["CT", ["CT", "computed tomography"]],
  ["Ultrasound", ["ultrasound", "ultrasonography"]],
  ["Plasma metanephrines", ["metanephrines", "metanephrine"]],
  ["Dexamethasone suppression", ["dexamethasone", "DST"]],
  ["Fisher exact test", ["Fisher exact", "Fisher's exact"]],
  ["Chi-square test", ["chi-square", "chi-squared", "chi square"]],
  ["EGD", ["EGD", "upper endoscopy", "esophagogastroduodenoscopy"]],
];
function phraseSpans(text, phrase) {
  const a = tokens(text), b = tokens(phrase).map(t => t.norm), out = [];
  if (!b.length) return out;
  for (let i=0; i<=a.length-b.length; i++) if (b.every((v,j)=>a[i+j].norm===v)) {
    out.push({ start:a[i].start, end:a[i+b.length-1].end, text:text.slice(a[i].start,a[i+b.length-1].end) });
  }
  return out;
}
function evidence(field, text, start=0, end=text.length, extra={}) {
  return { field, text:text.slice(start,end), start, end, ...extra };
}
function optionCategory(choice) {
  const s = choice.label;
  if (/\b(?:test|assay|ultrasound|ultrasonography|scintigraphy|MRI|MRCP|CT|EGD|radiograph|biopsy|mammograph|manometry|esophagram|typing|pH-impedance monitoring|magnetic resonance imaging|computed tomography|histological sections)\b/i.test(s) || choice.serviceRequest) return "investigation";
  if (/\b(?:ectomy|excision|repair|operation|drainage|surgery)\b/i.test(s) || /\b\w+ectomy\b/i.test(s)) return "procedure";
  if (/^(?:arrange|continue|use|start|stop|withhold|refer|discharge|observe|apply|resize|substitute|schedule|provide|discuss|avoid|order|repeat|monitor|optimize|leave)\b/i.test(s)) return "action";
  if (/^(?:from|increased?|decreased?|reduced?|absorption|inhibition|induction)\b/i.test(s)) return "mechanism";
  return "nominal";
}

/**
 * Context is explicitly supplied by the caller; never includes future results or
 * post-answer explanations. Optional explicit authored rationales are compared
 * separately; they are never treated as visible pre-answer context.
 * Every warning is advisory, with exact source spans.
 */
export function lintQuestion({ variantId, concept={}, choices, fields, caseId, profileId=null, rationales=[] }) {
  if (!Array.isArray(choices) || choices.filter(c=>c.isCorrect).length !== 1) throw new Error("Lint input must have one key");
  const key = choices.find(c=>c.isCorrect), wrong = choices.filter(c=>!c.isCorrect);
  if (!wrong.length) throw new Error("Lint input needs distractors");
  const all = choices.map(c=>({ ...c, words:tokens(c.label) }));
  const keyRow = all.find(c=>c.isCorrect), wrongRows = all.filter(c=>!c.isCorrect);
  const findings=[];
  const add=(rule,message,ev,metrics={})=>{
    const body={rule,severity:"advisory",message,caseId,profileId,evidence:ev,metrics};
    const id=createHash("sha256").update(JSON.stringify([variantId,body])).digest("hex").slice(0,16);
    if (!findings.some(f=>f.id===id)) findings.push({id,...body});
  };
  const oe=(c,start=0,end=c.label.length)=>evidence("answerChoices.label",c.label,start,end,{choiceId:c.id});
  lintOwnerFlagRules({all,fields,key:keyRow,add,evidence,oe});
  // Narrow continuity check, not an anatomical inference engine. Two explicitly
  // different singular ulcer sites across the shared case/current update need
  // review; a list of alternatives or multifocal lesions is not diagnosed here.
  const ulcerSites = Object.entries(fields).filter(([field])=>["presentation","currentUpdate"].includes(field)).map(([field,text])=>({field,text:text??"",matches:[...(text??"").matchAll(/\b(gastric|duodenal) ulcer\b/gi)]}));
  const singleSites=ulcerSites.filter(row=>new Set(row.matches.map(m=>m[1].toLowerCase())).size===1);
  if(singleSites.length===2 && singleSites[0].matches[0][1].toLowerCase()!==singleSites[1].matches[0][1].toLowerCase())
    add("ulcer-location-continuity","Presentation and current update name different ulcer sites; verify whether these describe the same lesion.",singleSites.map(row=>evidence(row.field,row.text,row.matches[0].index,row.matches[0].index+row.matches[0][0].length)));
  const repeated=new Map();
  for(const [field,text] of Object.entries(fields).filter(([field])=>["presentation","currentUpdate"].includes(field)))for(const m of String(text??"").matchAll(/[^.!?]+[.!?]?/g)){
    const sentence=m[0].trim(),words=tokens(sentence);if(words.length<5)continue;
    const canonicalSentence=canonical(sentence),offset=m.index+m[0].indexOf(sentence),previous=repeated.get(canonicalSentence);
    if(previous&&previous.field!==field)add("repeated-case-finding","A full observation repeats between presentation and current update; apply the deletion test unless the repeat communicates a meaningful change.",[previous.evidence,evidence(field,text,offset,offset+sentence.length)]);
    else repeated.set(canonicalSentence,{field,evidence:evidence(field,text,offset,offset+sentence.length)});
  }
  const lengths=all.map(c=>c.words.length), minimum=Math.min(...lengths), maximum=Math.max(...lengths);
  const longest=all.find(c=>c.words.length===maximum), shortest=all.find(c=>c.words.length===minimum);
  if (minimum && maximum/minimum>=OPTION_LENGTH_RATIO_WARNING) add("option-length-disparity",
    "Option lengths differ; check necessary specificity and abbreviation effects.",
    [oe(longest),oe(shortest)],{wordCounts:Object.fromEntries(all.map(c=>[c.id,c.words.length])),ratio:maximum/minimum});
  const wrongMedian=median(wrongRows.map(c=>c.words.length)), kr=keyRow.words.length/wrongMedian;
  if (wrongMedian && (kr>=KEY_LENGTH_RATIO_WARNING || kr<=1/KEY_LENGTH_RATIO_WARNING) && Math.abs(keyRow.words.length-wrongMedian)>=3) add("key-length-disparity",
    "The keyed label has a different length from the distractor median.", [oe(keyRow),...wrongRows.map(c=>oe(c))],{keyWords:keyRow.words.length,distractorMedian:wrongMedian,ratio:kr});
  const specificity=all.map(c=>({...c, qualifiers:[...c.label.matchAll(/\b(?:with|without|before|after|unless|when|if|because)\b|[;,]/gi)]}));
  for(const c of specificity) if(c.words.length>=6 && c.qualifiers.length>=2 && median(specificity.filter(d=>d.id!==c.id).map(d=>d.qualifiers.length))===0) add("option-specificity-disparity",
    "One label carries several qualifiers while other labels do not.",[oe(c),...c.qualifiers.map(m=>oe(c,m.index,m.index+m[0].length))],{qualifierCount:c.qualifiers.length});

  for(const c of all){
    for(const m of c.label.matchAll(/\b(?:because|therefore|so that|rather than|solely|regardless|which means|which rules out)\b/gi))
      add("option-explanation","A causal/explanatory or rhetorical clause may reveal the intended judgment.",[oe(c,m.index,m.index+m[0].length),oe(c)]);
    for(const m of c.label.matchAll(/\b(?:always|never|every|all|only|permanently|entirely|absolute|automatically|reliably|completely)\b/gi))
      add("option-absolute","A categorical qualifier may offer a testwise rejection route; verify whether clinically necessary.",[oe(c,m.index,m.index+m[0].length),oe(c)]);
  }
  const wrongWords=new Set(wrongRows.flatMap(c=>c.words.map(t=>t.norm)));
  const keyOnly=keyRow.words.filter(t=>useful(t.norm)&&!wrongWords.has(t.norm));
  for(const [field,text] of Object.entries(fields)){
    if (!text) continue;
    const fw=tokens(text), norm=fw.map(t=>t.norm);
    const phraseCandidates=[];
    for(let size=Math.min(5,keyRow.words.length);size>=2;size--) for(let i=0;i<=keyRow.words.length-size;i++){
      const chunk=keyRow.words.slice(i,i+size), terms=chunk.map(t=>t.norm);
      if(terms.filter(useful).length<2 || wrongRows.some(c=>phraseSpans(c.label,terms.join(" ")).length)) continue;
      for(const span of phraseSpans(text,terms.join(" "))) phraseCandidates.push({span,chunk,size});
    }
    const selected=phraseCandidates.filter((p,i,a)=>!a.slice(0,i).some(q=>q.span.start<=p.span.start&&q.span.end>=p.span.end));
    for(const p of selected) add("key-only-phrase-overlap","A phrase is shared by pre-answer text and the key, but not distractors.",
      [evidence(field,text,p.span.start,p.span.end),oe(keyRow,p.chunk[0].start,p.chunk.at(-1).end)]);
    for(const t of keyOnly) for(let j=0;j<norm.length;j++) if(norm[j]===t.norm && !selected.some(p=>p.span.start<=fw[j].start&&p.span.end>=fw[j].end)) add("key-only-word-overlap",
      "A substantive word appears in the context and key only; clinical relevance may justify it.",
      [evidence(field,text,fw[j].start,fw[j].end),oe(keyRow,t.start,t.end)]);
  }

  const abbreviations = label => [...label.matchAll(/\b[A-Z][A-Z0-9-]{0,10}[A-Z0-9]\b/g)];
  const wrongAbbreviations = new Set(wrong.flatMap(c=>abbreviations(c.label).map(m=>m[0])));
  for(const m of abbreviations(key.label)) if(!wrongAbbreviations.has(m[0]))
    add("unique-key-abbreviation","An abbreviation occurs only in the key; check naming/style parity.",[oe(keyRow,m.index,m.index+m[0].length)]);
  for(const [name,aliases] of TEST_ALIASES){
    const keyAlias=aliases.flatMap(a=>phraseSpans(key.label,a))[0];
    if(!keyAlias || wrong.some(c=>aliases.some(a=>phraseSpans(c.label,a).length))) continue;
    for(const [field,text] of Object.entries(fields)) for(const alias of aliases) for(const span of phraseSpans(text||"",alias))
      add("key-test-name-in-context","A named test/alias in the context identifies the keyed test.",[evidence(field,text,span.start,span.end),oe(keyRow,keyAlias.start,keyAlias.end)],{aliasGroup:name});
    if(!wrong.some(c=>TEST_ALIASES.some(([,aa])=>aa.some(a=>phraseSpans(c.label,a).length))))
      add("unique-key-test-name","Only the key matches the small named-test lexicon; check semantic and naming parity.",[oe(keyRow,keyAlias.start,keyAlias.end)],{aliasGroup:name});
  }

  const cats=all.map(c=>({id:c.id,category:optionCategory(c),label:c.label}));
  const stem=fields.stem||"";
  const rationaleByChoice = new Map(rationales.filter(r => typeof r.text === "string" && r.text.trim()).map(r => [r.choiceId,{...r,field:r.field??"authoring.answerChoices.rationale"}]));
  const completeRationales = choices.every(c => rationaleByChoice.has(c.id));
  const detailFields = Object.entries(fields).filter(([field,text]) => text &&
    (["chiefComplaint","presentation","currentUpdate"].includes(field) || field.startsWith("exhibit.")));
  for (const [field,text] of detailFields) {
    for (const cue of CASE_DETAIL_CUES) {
      if (cue.key && !cue.key.test(key.label)) continue;
      for (const m of text.matchAll(cue.pattern)) add("case-detail-decision-cue",
        "A goal, setting permission or supplied mechanism may state the keyed decision rule. Apply the deletion test and retain genuinely decision-critical observations.",
        [evidence(field,text,m.index,m.index+m[0].length),oe(keyRow)],{cue:cue.id});
    }
    if (!completeRationales) continue;
    const reason = rationaleByChoice.get(key.id), rt = tokens(reason.text), candidates = [];
    for (let size=Math.min(6,rt.length);size>=3;size--) for(let i=0;i<=rt.length-size;i++) {
      const chunk=rt.slice(i,i+size), phrase=chunk.map(t=>t.norm).join(" ");
      if(chunk.filter(t=>useful(t.norm)).length<2 || wrong.some(c=>phraseSpans(rationaleByChoice.get(c.id).text,phrase).length))continue;
      for(const span of phraseSpans(text,phrase)) candidates.push({span,chunk});
    }
    const selected=candidates.filter((p,i,a)=>!a.slice(0,i).some(q=>q.span.start<=p.span.start&&q.span.end>=p.span.end));
    for(const p of selected)add("case-detail-key-rationale-overlap",
      "A case-detail phrase repeats only the explicit keyed reason. Review for pre-answer teaching; raw decision-critical evidence may justify the overlap. Synonymous paraphrases still require human review.",
      [evidence(field,text,p.span.start,p.span.end),evidence(reason.field,reason.text,p.chunk[0].start,p.chunk.at(-1).end,{choiceId:key.id,postAnswerMetadata:true})],
      {explicitRationalesCompared:choices.length});
  }
  for (const principle of DECISION_PRINCIPLES) for (const match of stem.matchAll(principle.lead)) {
    const matched = choices.filter(c => principle.reason.test(rationaleByChoice.get(c.id)?.text ?? ""));
    add("lead-in-decision-principle", "The task names a decision principle; review whether it supplies the inference being tested or states a necessary comparison.",
      [evidence("stem",stem,match.index,match.index+match[0].length)],
      {principle:principle.id,rationaleComparison:completeRationales?"complete":"incomplete",matchedRationaleChoiceIds:matched.map(c=>c.id)});
    if (completeRationales && matched.length === 1 && matched[0].id === key.id) {
      const rationale = rationaleByChoice.get(key.id), reasonMatch = rationale.text.match(principle.reason);
      add("key-rationale-principle-cue", "The task's principle matches only the explicit keyed rationale; review for a relocated cue. This is lexical evidence, not proof of a clinical giveaway.",
        [evidence("stem",stem,match.index,match.index+match[0].length),
         evidence(rationale.field,rationale.text,reasonMatch.index,reasonMatch.index+reasonMatch[0].length,{choiceId:key.id,postAnswerMetadata:true})],
        {principle:principle.id,explicitRationalesCompared:choices.length});
    }
  }
  if(/\b(?:diagnosis|diagnoses|diagnostic study|investigation|imaging study|test|operation)\b/i.test(stem)&&new Set(cats.map(c=>c.category)).size>1 &&
     cats.some(c=>c.category==="nominal")&&cats.some(c=>["investigation","procedure","action"].includes(c.category)))
    add("heterogeneous-option-category","Lexical categories differ for a focused task; this heuristic cannot judge a clinical option ontology.",all.map(c=>oe(c)),{categories:cats.map(({id,category})=>({id,category}))});
  if(/\bsubtotal classification\b/i.test(stem) && all.some(c=>/\bsubtotal\b/i.test(c.label)) && all.some(c=>! /\bsubtotal\b/i.test(c.label)))
    add("option-scope-mismatch","Some labels fall outside the subtotal classification requested.",[evidence("stem",stem),...all.filter(c=>! /\bsubtotal\b/i.test(c.label)).map(c=>oe(c))]);

  const frequency=new Map();
  for(const c of all) for(const word of new Set(c.words.map(t=>t.norm).filter(useful))) frequency.set(word,(frequency.get(word)||0)+1);
  const components=keyRow.words.filter(t=>(frequency.get(t.norm)||0)>=2&&(frequency.get(t.norm)||0)<all.length);
  const componentNames=[...new Set(components.map(t=>t.norm))];
  const sharedDensity=c=>{
    const words=[...new Set(c.words.map(t=>t.norm).filter(useful))];
    return words.filter(w=>(frequency.get(w)||0)>=2&&(frequency.get(w)||0)<all.length).length/(words.length||1);
  };
  const pairs=all.map(c=>c.label.split(/\s+(?:with|and)\s+/i).map(canonical));
  const balancedMatrix=all.length===4 && pairs.every(p=>p.length===2&&p.every(Boolean)) &&
    new Set(pairs.map(p=>p[0])).size===2 && new Set(pairs.map(p=>p[1])).size===2 &&
    new Set(pairs.map(p=>JSON.stringify(p))).size===4;
  // A key that uniquely combines components spread across alternatives can cue
  // convergence. One distractor sharing the entire component set is merely a
  // close/parallel alternative, not evidence of that unique combination.
  // A complete 2x2 combination set balances both component frequencies. This
  // narrow exemption does not silence three-option or arbitrary four-option cues.
  if(!balancedMatrix && componentNames.length>=2 && wrongRows.every(c=>componentNames.filter(w=>c.words.some(t=>t.norm===w)).length<componentNames.length))
    add("convergence","The key combines components reused across options; inspect whether the combinations cue a shortlist.",components.map(t=>oe(keyRow,t.start,t.end)),{components:componentNames,optionCoverage:all.map(c=>({choiceId:c.id,sharedComponentDensity:sharedDensity(c),components:componentNames.filter(w=>c.words.some(t=>t.norm===w))}))});

  for(let i=0;i<all.length;i++)for(let j=i+1;j<all.length;j++){
    const a=new Set(all[i].words.map(t=>t.norm)),b=new Set(all[j].words.map(t=>t.norm)),union=new Set([...a,...b]);
    const similarity=[...a].filter(v=>b.has(v)).length/(union.size||1);
    if(canonical(all[i].label)===canonical(all[j].label)||similarity>=NEAR_DUPLICATE_JACCARD_WARNING)
      add("near-duplicate-options","Labels overlap substantially; small differences can be meaningful and need review.",[oe(all[i]),oe(all[j])],{jaccard:similarity,differingTerms:[...union].filter(v=>!a.has(v)||!b.has(v))});
  }

  if(concept.conceptType==="diagnosis"&&/\b(?:which|what)\b[^?]*\bdiagnos(?:is|es)\b/i.test(stem)){
    const aliases=[key.label,...(concept.diagnosisNames||[]),concept.displayName].filter(a=>typeof a==="string"&&tokens(a).length>=1);
    for(const [field,text] of Object.entries(fields))for(const alias of new Set(aliases))for(const span of phraseSpans(text||"",alias))
      add("diagnosis-disclosed","A diagnosis name from key/concept metadata is stated before a diagnosis task.",[evidence(field,text,span.start,span.end),oe(keyRow)],{metadataSource:alias===key.label?"keyed diagnosis":"concept.diagnosisNames"});
  }

  for(const [field,text] of Object.entries(fields)){
    if(!text)continue;
    for(const m of text.matchAll(/\b(?:no(?: evidence of)?|without|denies?|negative for|exclud(?:es|ed|ing)|ruled? out)\s+([^.!?;]+)/gi)){
      const offset=m.index, clause=m[0].split(/\b(?:but|however|although|yet|then)\b/i)[0];
      const terms=tokens(clause).filter(t=>useful(t.norm));
      for(const t of terms){
        if(keyRow.words.some(x=>x.norm===t.norm)) continue;
        const matches=wrongRows.filter(c=>c.words.some(x=>x.norm===t.norm));
        if(matches.length!==1) continue;
        const c=matches[0],ct=c.words.find(x=>x.norm===t.norm);
        add("negative-aligned-to-distractor","A negated/excluded term appears in exactly one distractor; this is not proof that the finding excludes that diagnosis.",
          [evidence(field,text,offset,offset+clause.length),evidence(field,text,offset+t.start,offset+t.end),oe(c,ct.start,ct.end)],{term:t.norm});
      }
    }
  }
  return {variantId,caseId,profileId,optionCount:choices.length,metrics:{wordCounts:Object.fromEntries(all.map(c=>[c.id,c.words.length])),lengthRatio:minimum?maximum/minimum:null,keyToDistractorMedianRatio:wrongMedian?kr:null,completeAuthoredRationales:completeRationales},findings:findings.sort((a,b)=>a.rule.localeCompare(b.rule)||a.id.localeCompare(b.id))};
}

