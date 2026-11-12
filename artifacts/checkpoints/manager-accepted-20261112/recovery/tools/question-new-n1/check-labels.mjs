import '../economy-audit/source-loader.mjs';
const batch = await import('../../packages/clinical-content/src/question-new-n1-20261104.ts');
for (const item of batch.QUESTION_NEW_N1_ITEMS) {
  if (item.choices[0].label.length > Math.max(...item.choices.slice(1).map(c => c.label.length)))
    console.log(JSON.stringify({ slug: item.slug, choices: item.choices.map(c => [c.label.length, c.label]) }));
}
for (const clinicalCase of batch.QUESTION_NEW_N1_CASES) for (const choice of clinicalCase.decisionNodes[0].answerChoices) {
  if (!/\b(?:biopsy|CT|MRI|mammography|sampling|assay|genotyping|serology|scintigraphy|endoscopy|manometry|duplex|oximetry|capnography|blood count)\b/i.test(choice.label)) continue;
  const classification = batch.QUESTION_NEW_N1_TIMING_ENTRIES.find(t => t.caseId === clinicalCase.id).classification;
  const registered = classification.kind === 'test_choices' ? classification.choices.find(c => c.choiceId === choice.id) : null;
  if (registered?.timing.kind !== 'test') console.log(JSON.stringify({ missingTestingEstimate: clinicalCase.id, choice: choice.label, classification }));
}
