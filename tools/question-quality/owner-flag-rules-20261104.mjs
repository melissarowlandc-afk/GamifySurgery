/** Owner feedback, 2026-11-04. These are transparent editorial candidates,
 * not medical truth, anatomical validation, automatic rewrites or build gates.
 * Only caller-supplied pre-answer fields are inspected; no answers are tracked.
 */
export const OWNER_FLAG_RULES = [
  'option-alone', 'option-generic-individualization', 'availability-permission-cue',
  'supplied-clinical-conclusion', 'unexplained-negative-imaging',
  'ambiguous-cervical-term', 'nerve-competitor-plausibility',
  'unnamed-treatment-action',
];

export function lintOwnerFlagRules({all,fields,key,add,evidence,oe}) {
  const generic=/\b(?:individuali[sz]ed|tailored|shared[- ]decision(?:[- ]making)?|shared planning)\b/gi;
  const specific=/\b(?:ablation|sclerotherapy|stripping|phlebectomy|excision|mastectomy|lumpectomy|biopsy|FNA|drainage|compression stockings|endoscopy|ultrasound|scintigraphy|metanephrines)\b/i;
  const genericRows=all.filter(c=>generic.test(c.label)&&(generic.lastIndex=0,!specific.test(c.label)));
  generic.lastIndex=0;
  for(const c of all)for(const m of c.label.matchAll(/\balone\b/gi))add('option-alone',
    'Owner rule: replace an "X alone" label with the actual specific competing plan. Do not merely hide the same exclusion in a synonym.',
    [oe(c,m.index,m.index+m[0].length),oe(c)]);
  for(const c of all)for(const m of c.label.matchAll(/\b(?:treatment|management)\s+(?:assessment|discussion|planning)\b/gi))add('unnamed-treatment-action',
    'Owner rule: name the proposed treatment or action rather than a generic treatment/management assessment. An actual diagnostic assessment may be necessary; this lexical candidate requires clinical review.',
    [oe(c,m.index,m.index+m[0].length),oe(c)]);
  if(genericRows.length&&genericRows.length<all.length)for(const c of genericRows)add('option-generic-individualization',
    'A generic individualized/tailored/shared-decision label contrasts with concrete alternatives. State the actual proposed action in every option.',
    [oe(c),...all.filter(x=>!genericRows.includes(x)).map(x=>oe(x))],{genericChoiceIds:genericRows.map(x=>x.id)});

  const availability=[
    /\b(?:HIDA|scintigraphy|transfer|transport|medicines?|medications?|drugs?|hospital|care)\b[^.!?;]{0,75}\b(?:available|feasible|permitted|possible)\b[^.!?;]*/gi,
    /\b(?:available|feasible|permitted)\b[^.!?;]{0,75}\b(?:transfer|transport|HIDA|scintigraphy|medicines?|medications?|care)\b[^.!?;]*/gi,
    /\b(?:can|able to)\s+swallow\b[^.!?;]*/gi,
    /\b(?:won['’]t|will not|would not|without)\s+delay(?:ing)?\s+(?:needed\s+|acute\s+)?care\b/gi,
  ];
  for(const [field,value]of Object.entries(fields)){
    const text=String(value??'');
    const availabilitySpans=[];
    for(const pattern of availability)for(const m of text.matchAll(pattern)){
      if(availabilitySpans.some(s=>s.start<=m.index&&s.end>=m.index+m[0].length))continue;
      availabilitySpans.push({start:m.index,end:m.index+m[0].length});
      add('availability-permission-cue','A feasibility/permission statement may supply the rationale for an offered action. Apply the deletion test; retain and neutrally phrase a genuine decision-critical constraint.',
        [evidence(field,text,m.index,m.index+m[0].length),oe(key)],{visibleHistory:field.startsWith('prior')});
    }
    for(const m of text.matchAll(/\b(?:meet(?:s|ing)?\s+(?:(?:the|all|current|size|ultrasound|sonographic)\s+)*(?:biopsy|FNA)\s+criteria|(?:features?|findings?)\s+(?:meet(?:s|ing)?\s+)?(?:biopsy|FNA)\s+criteria|(?:ultrasound|scan|imaging|study|examination)\s+(?:is|was|remains?|calls?[^.!?;]{0,25})\s*(?:inconclusive|indeterminate))\b/gi))
      add('supplied-clinical-conclusion','Supply the criteria-relevant observations instead of an authored conclusion. A genuinely limited report may still need an explicit uncertainty statement.',[evidence(field,text,m.index,m.index+m[0].length)]);
    // Narrow owner example: a named antibody mechanism supplies an immune-
    // effector task. A diagnosis legitimately supplied for management is allowed.
    if(/\b(?:immune effector|mechanism|pathway|diagnos(?:is|es))\b/i.test(fields.stem??''))for(const m of text.matchAll(/\bhyperacute\s+(?:antibody[- ]mediated\s+)?rejection\b/gi))
      add('supplied-clinical-conclusion','The named rejection mechanism precedes an interpretation task. Present the observed timing, vascular injury and immune findings; do not infer rejection from timing alone.',[evidence(field,text,m.index,m.index+m[0].length)]);
    for(const m of text.matchAll(/\b(?:(?:mammograph\w*|ultrasound|imaging|CT|MRI)(?:\s+and\s+(?:mammograph\w*|ultrasound|imaging|CT|MRI))?\s+(?:are|is|was|were|remains?)\s+negative|negative\s+(?:mammograph\w*|ultrasound|imaging|CT|MRI))\b/gi))
      add('unexplained-negative-imaging','Describe what imaging showed or failed to show at the relevant site. A bare negative label does not say whether there was no correlate, benign findings or an inadequate examination.',[evidence(field,text,m.index,m.index+m[0].length)]);
    for(const m of text.matchAll(/\bcervical\b/gi)){
      const sentence=text.slice(Math.max(text.lastIndexOf('.',m.index-1),text.lastIndexOf(';',m.index-1))+1).split(/[.!?;]/)[0];
      if(/\b(?:neck|lymph\s+nodes?|spine|spinal|vertebra\w*|uterine|uterus|cervix)\b/i.test(sentence))continue;
      add('ambiguous-cervical-term','Qualify the anatomical site: for example, neck/cervical lymph node. This lexical check cannot determine the intended organ.',[evidence(field,text,m.index,m.index+m[0].length)]);
    }
  }
  // A bounded anatomical mismatch screen for the actual shoulder-pain flag.
  // It cannot establish that the remaining nerves are plausible competitors.
  const context=Object.values(fields).join(' ');
  if(/\b(?:shoulder|laparoscop\w*)\b/i.test(context)&&all.some(c=>/\bphrenic\b/i.test(c.label))){
    const remote=all.filter(c=>/\b(?:sciatic|femoral|tibial|obturator|median|ulnar)\b/i.test(c.label));
    if(remote.length)add('nerve-competitor-plausibility','A phrenic/shoulder item contains a remote or distal nerve label. Replace it with a clinically credible competitor and have a clinician verify every pathway; this list is not an anatomical ontology.',
      remote.map(c=>oe(c)),{anatomicalScreen:'bounded shoulder/phrenic vocabulary',choiceIds:remote.map(c=>c.id)});
  }
}
