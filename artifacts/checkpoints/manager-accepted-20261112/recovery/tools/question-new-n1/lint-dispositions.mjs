import fs from 'node:fs';
const report = JSON.parse(fs.readFileSync('.local-dev/question-new-content-20261104/lint-n1.json', 'utf8'));
const ownerRules = new Set(['option-alone', 'option-generic-individualization', 'availability-permission-cue',
  'supplied-clinical-conclusion', 'unexplained-negative-imaging', 'ambiguous-cervical-term',
  'nerve-competitor-plausibility', 'unnamed-treatment-action']);
const reasons = {
  'question.n1.gastroparesis-obstruction.v1': {
    'key-only-word-overlap': 'The prior incomplete outlet examination is decision-critical. Repeating its actual modality is clinically necessary; the patient must infer why its inadequate sampling leaves a structural question unresolved.',
    'unique-key-test-name': 'All three alternatives are specific investigations: upper endoscopy, gastric emptying scintigraphy, and esophageal manometry. Distinct modality names are the decision, not an option-format category difference.',
  },
  'question.n1.aldosterone-overt-phenotype.v1': {
    'key-only-word-overlap': 'All alternatives are adrenal pathways (functional sampling, suppression confirmation, or CT-directed surgery). The lexical matcher treats adrenalectomy as a different token from adrenal; the complaint supplies the organ, not the discriminating phenotype rule.',
  },
  'question.n1.celiac-gluten-withdrawal.v1': {
    'key-only-word-overlap': 'The exposure change is the shared limitation of both prior negative studies and must remain visible. All options are concrete diagnostic plans; matching the ingredient word does not establish whether to diagnose, stop, or obtain valid repeat evidence. Independent review must judge the clinical plan and difficulty.',
  },
  'question.n1.meckel-resection.v1': {
    'heterogeneous-option-category': 'All alternatives are bowel operations with parallel Perform grammar. The heuristic recognizes the -ectomy suffix but fails to categorize resection as a procedure. Extent, not semantic option type, is the intended comparison.',
  },
  'question.n1.mixing-study-followup.v1': {
    'unique-key-abbreviation': 'VIII is the conventional factor number, not a decorative abbreviation. All alternatives are laboratory investigation plans; changing the standard factor name would reduce clarity. Independent review must still judge the investigation ranking.',
  },
  'question.n1.postoperative-ascites-ct.v1': {
    'heterogeneous-option-category': 'All three alternatives are imaging studies. The heuristic fails to recognize fully spelled cholangiopancreatography while recognizing computed tomography and ultrasonography. No missing picture or test-versus-treatment contrast is used.',
  },
};
const findings = report.variants.flatMap(v => v.findings.map(f => ({ variantId: v.questionVariantId, findingId: f.id, rule: f.rule,
  evidence: f.evidence, disposition: 'author_retains_for_independent_review', reason: reasons[v.questionVariantId]?.[f.rule] })));
if (findings.some(f => ownerRules.has(f.rule))) throw new Error('N1 has a new owner-rule finding; fix it before handoff.');
if (findings.some(f => !f.reason)) throw new Error('N1 has an undocumented advisory finding.');
const output = { schemaVersion: 1, reviewedOn: '2026-11-04', linterVersion: report.linterVersion,
  reviewStatus: 'needs_clinician_review', independentAcceptance: false, newOwnerRuleFindings: 0,
  note: 'Author dispositions are transparent proposals for independent review, never a lint suppression, editorial PASS, measured difficulty or clinical approval.', findings };
fs.writeFileSync('docs/research/question-new-n1-lint-dispositions-20261104.json', JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ newOwnerRuleFindings: 0, retainedAdvisoryFindings: findings.length }));
