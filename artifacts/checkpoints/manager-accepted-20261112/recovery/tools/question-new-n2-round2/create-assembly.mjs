// Adapt the established separate-version projection; never change the N1 lane.
import fs from 'node:fs';
import assert from 'node:assert/strict';
let text=fs.readFileSync('packages/clinical-content/src/question-new-n1-round2-20261104.ts','utf8');
text=text.replaceAll('N1','N2').replaceAll('n1','n2');
text=text.replace('import { QUESTION_NEW_N2_ROUND2_BREAST } from "./question-new-n2-round2-breast";',
 'import { QUESTION_NEW_N2_ROUND2_SPECIALTY } from "./question-new-n2-round2-specialty";\nimport { QUESTION_NEW_N2_ROUND2_RESEARCH } from "./question-new-n2-round2-research";');
text=text.replace('...QUESTION_NEW_N2_ROUND2_BREAST, ...QUESTION_NEW_N2_ROUND2_PERIOPERATIVE',
 '...QUESTION_NEW_N2_ROUND2_PERIOPERATIVE, ...QUESTION_NEW_N2_ROUND2_SPECIALTY, ...QUESTION_NEW_N2_ROUND2_RESEARCH');
text=text.replace('"review.n2.phyllodes-benign-margin.v1", "review.n2.aldosterone-overt-phenotype.v1"',
 '"review.n2.irreversible-ischemia-revascularization-boundary.v1", "review.n2.case-mix-standardized-risk.v1"');
text=text.replace('const q = QUESTION_NEW_N2_ROUND2_QUESTIONS[i]!, node = old.decisionNodes[0]!;',
 'const q = QUESTION_NEW_N2_ROUND2_QUESTIONS[i]!;\n  const { exhibit: _oldExhibit, ...node } = old.decisionNodes[0]!;');
text=text.replace('id: item.conceptId, learningObjective: item.learningObjective, conceptType: item.conceptType,',
 'id: item.conceptId, displayName: item.displayName, learningObjective: item.learningObjective, conceptType: item.conceptType,');
text=text.replace('policyBasis: cs.presentation.includes("Bishr") ? "Independently synthesized limited policy facts from Bishr et al., BJS 2025, doi:10.1093/bjs/znaf152; original access date retained. No source table/prose copied." : null',
 'policyBasis: item.category === "Statistics" || item.category === "Research" || item.category === "Outcomes" ? "Explicitly constructed study counts, assumptions and action rules; no empirical rates or clinical thresholds claimed." : null');
text=text.replace('const ids = QUESTION_NEW_N2_ROUND2_QUESTIONS[i]!.supportingEvidenceClaimIds;',
 'const ids = QUESTION_NEW_N2_ROUND2_QUESTIONS[i]!.supportingEvidenceClaimIds;\n  const item = QUESTION_NEW_N2_ROUND2_ITEMS[i]!;');
text=text.replace('Fictional patient observations, dated input records and resection maps.', 'Fictional patient observations, administration records, original vascular/duct sketches and constructed study datasets.');
text=text.replace('originalReviewCounts: { PASS: 2, REVISE: 37, FAIL: 1 }','originalReviewCounts: { PASS: 2, REVISE: 37, FAIL: 0 }');
text=text.replace('variantCount: 40, revisedVariantCount: 38','variantCount: 39, revisedVariantCount: 37');
text=text.replace('All 38 returned items have manual cover-key, same-stage/category, two-step, predicted PGY-2/3 difficulty and unique-key records.',
 'All 37 returned items have manually authored attacks, same-stage/category decisions, raw-interpretation/application steps, predicted PGY-2/3 difficulty and distractor-specific counterfactual records.');
text=text.replace('Offline reuse with actual previous dates; five explicit new syntheses, including named-drug examples that require targeted exact-support verification. No source retrieved or currentness claim.',
 'Offline recorded support with original access/check dates; 15 explicit new local syntheses include six clinical extensions with targeted verification holds. No source retrieved or currentness claim.');
text=text.replace('  N2: "Frozen and excluded from this turn\'s edits and rubric review while independent review runs.",',
 '  N1: "Original and round-two N1 files and registry blocks are frozen while independent review runs; no N1 rubric review or edits.",\n  calibration: "68 independently PASSed batch-one exact projections studied; construction lessons documented, no clinical approval or measured difficulty inferred.",');
assert.ok(!text.includes('Bishr')&&!text.includes('ROUND2_BREAST')&&!text.includes('variantCount: 40'));
fs.writeFileSync('packages/clinical-content/src/question-new-n2-round2-20261104.ts',text);
console.log('Created the N2-only assembly; original case IDs and both PASS exact definitions remain intact.');
