// Offline editorial mapping. The sole topic frame is the recorded public ABSITE outline.
import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
const content = await import('../../packages/clinical-content/src/index.ts');
const { PROTOTYPE_BALANCE_RELEASE: balance } = await import('../../packages/balance-config/src/index.ts');
const audit = JSON.parse(fs.readFileSync('docs/clinical-workbench/audits/gs028-subject-coverage-2026-10-03.json', 'utf8'));
const frame = audit.activeSubjectCounts.map(row => row.category);
const old = new Map(audit.activeMappings.map(row => [row.id, row.primaryCategory]));
const explicit = new Map(content.QUESTION_NEW_N1_ITEMS.map(item => [item.conceptId, item.category]));
const families = {
  ards: 'SurgicalCriticalCare', 'blunt-cardiac-injury': 'Trauma', 'head-injury': 'Trauma', 'pelvic-trauma': 'Trauma',
  'metabolic-acidosis': 'FluidsElectrolytesAcidBase', hyperkalaemia: 'FluidsElectrolytesAcidBase',
  'dialysis-access': 'VascularAccess', 'preoperative-osa': 'PreopPeriop', 'malignant-hyperthermia-susceptibility': 'Anesthesia',
  'preoperative-frailty': 'GeriatricEndOfLife', 'postoperative-delirium': 'GeriatricEndOfLife',
  'lung-cancer-screening': 'Thoracic', 'spontaneous-pneumothorax': 'Thoracic', 'pleural-infection': 'Thoracic', 'pleural-effusion': 'Thoracic',
  imaging: 'Radiology', mri: 'Radiology', 'iodinated-contrast': 'Radiology',
  'sglt2-inhibitor': 'Pharmacology', naloxone: 'Pharmacology', 'perioperative-sglt2': 'PreopPeriop',
  laparoscopy: 'MISPrinciples', pneumoperitoneum: 'MISPrinciples', postlaparoscopy: 'MISPrinciples',
  'wound-healing': 'WoundHealing', wound: 'WoundHealing', immunology: 'Immunology', coagulation: 'TransfusionCoagulation',
  oncology: 'OncologyTumorBiology', infection: 'InfectionAntimicrobial',
  dcis: 'Breast', 'palpable-mass': 'Breast', 'palpable-breast': 'Breast', 'malignant-polyp': 'Alimentary-LargeIntestine',
  'dialysis-nutrition': 'NutritionMetabolism', 'retained-antrum': 'Alimentary-Stomach', 'marginal-ulcer': 'Alimentary-Stomach',
  appendicitis: 'Alimentary-SmallIntestine', cholecystitis: 'Biliary', 'acute-pancreatitis': 'Pancreas',
  'acute-limb-ischemia': 'VascularArterial', 'acute-mesenteric-ischemia': 'VascularArterial',
  'head-neck': 'HeadNeck', cirrhosis: 'PreopPeriop', lymphangitis: 'InfectionAntimicrobial',
  'perioperative-dnr': 'GeriatricEndOfLife', osa: 'PreopPeriop', dtc: 'Endocrine',
  gallstones: 'Biliary', 'varicose-veins': 'VascularVenous', achalasia: 'Alimentary-Esophagus',
  'pigmented-skin-lesion': 'SkinSoftTissue', 'soft-tissue-mass': 'SkinSoftTissue', 'pseudocyst': 'Pancreas',
  'gastric-malt-lymphoma': 'Alimentary-Stomach', 'inflammatory-breast-cancer': 'Breast', 'peptic-ulcer-bleeding': 'Alimentary-Stomach',
  'hyperacute-rejection': 'Immunology',
  'colon-cancer': 'Alimentary-LargeIntestine', 'differentiated-thyroid-cancer': 'Endocrine', melanoma: 'SkinSoftTissue',
  'inguinal-hernia': 'Hernia', 'colonic-lipoma': 'Alimentary-LargeIntestine',
};
const gsF = { gynecology: 'Gynecology', plastic: 'Plastic', 'head-neck': 'HeadNeck', transplantation: 'Transplantation',
  pharmacology: 'Pharmacology', anesthesia: 'Anesthesia', nutrition: 'NutritionMetabolism', outcomes: 'Outcomes',
  'critical-care': 'SurgicalCriticalCare', oncology: 'OncologyTumorBiology', esophagus: 'Alimentary-Esophagus' };
const gsG = { 'hiv-perioperative': 'PreopPeriop', 'neuromuscular-recovery': 'Anesthesia', 'peristomal-skin': 'SkinSoftTissue',
  'mucocutaneous-separation': 'WoundHealing', 'incidental-gallbladder': 'Biliary', 'merkel-cell': 'SkinSoftTissue',
  'incisional-hernia': 'Hernia', 'subtotal-cholecystectomy': 'Biliary', 'laparoscopy-respiratory': 'MISPrinciples', 'postoperative-scapula': 'NervousSystem' };
const variety = { 'rectus-diastasis-recognition': 'Hernia', 'epidermoid-cyst-recognition': 'SkinSoftTissue',
  'thrombosed-external-hemorrhoid-recognition': 'Alimentary-Anorectal', 'pruritus-ani-gentle-skin-care': 'Alimentary-Anorectal',
  'inadequate-bowel-prep-repeat-colonoscopy': 'Endoscopy', 'small-polyp-cold-snare-selection': 'Endoscopy',
  'nondysplastic-barrett-surveillance': 'Alimentary-Esophagus', 'endoscopic-sedation-escort-planning': 'Anesthesia',
  'penicillin-label-structured-history': 'Immunology', 'surgical-hair-preparation': 'InfectionAntimicrobial' };
function classify(concept) {
  if (explicit.has(concept.id)) return { category: explicit.get(concept.id), basis: 'N1 author-assigned primary category' };
  if (old.has(concept.id)) return { category: old.get(concept.id), basis: 'Recorded 2026-10-03 editorial semantic mapping' };
  const base = concept.id.replace(/\.v\d+$/, '');
  if (old.has(base)) return { category: old.get(base), basis: 'Same organ/topic as recorded prior identity; changed objectives remain separate IDs' };
  const parts = base.split('.');
  let category;
  if (parts[1] === 'gs028f') category = gsF[parts[2]];
  else if (parts[1] === 'gs028g') category = gsG[parts[2]];
  else if (parts[1] === 'pediatric-clinic') category = parts[2] === 'developmental-assent-discussion' ? 'Ethics' : 'Pediatric';
  else if (parts[1] === 'variety3') category = variety[parts[2]];
  else category = families[parts[1]];
  return { category: category ?? 'Unclassified', basis: category ? 'Explicit family-to-public-ABS-topic editorial mapping, checked against objective' : 'Unresolved mapping; not silently assigned' };
}
const release = content.SYNTHETIC_CLINICAL_RELEASE;
const patientCases = release.cases.filter(c => c.routineEligible && !c.participant);
const activeIds = new Set(release.cases.flatMap(c => c.decisionNodes.map(n => n.primaryConceptId)));
const mappings = release.concepts.filter(c => activeIds.has(c.id)).map(concept => ({ ...concept, ...classify(concept),
  earliestPatientStage: Math.min(...patientCases.filter(c => c.decisionNodes.some(n => n.primaryConceptId === concept.id)).map(c => c.earliestFacilityStage)),
  patientVariants: new Set(patientCases.flatMap(c => c.decisionNodes.filter(n => n.primaryConceptId === concept.id).map(n => n.questionVariantId))).size,
  newInN1: explicit.has(concept.id) }));
const unknown = mappings.filter(m => !frame.includes(m.category));
const preN1PatientIds = new Set(content.QUESTION_NEW_N1_PRE_RELEASE.cases.filter(c => c.routineEligible && !c.participant).flatMap(c => c.decisionNodes.map(n => n.primaryConceptId)));
const counts = frame.map(category => ({ category,
  preN1ActivePatientConcepts: content.QUESTION_NEW_N1_PRE_RELEASE.concepts.filter(c => preN1PatientIds.has(c.id) && classify(c).category === category).length,
  allActiveConcepts: mappings.filter(m => m.category === category).length,
  patientConceptsAtL3: mappings.filter(m => m.category === category && m.earliestPatientStage <= 3).length,
  patientConceptsAtL4: mappings.filter(m => m.category === category && m.earliestPatientStage <= 4).length,
  N1Concepts: mappings.filter(m => m.category === category && m.newInN1).length,
}));
const source = {
  id: 'source.abs.absite-content-outline.2021', title: 'General Surgery In-Training Examination (ABSITE) Content Outline',
  completeCitation: 'American Board of Surgery. General Surgery In-Training Examination (ABSITE) Content Outline. Updated January 2021. American Board of Surgery; 2021. Official ABS content-outline page.',
  organizationOrJournal: 'American Board of Surgery', authors: ['American Board of Surgery'], publicationYear: 2021,
  doi: null, officialUrl: 'https://www.absurgery.org/resources/exam-content-outlines/general-surgery-in-training-examination-absite-content-outline/',
  accessedOn: '2026-10-03', sourceClass: 'bibliographic_metadata', licenseLabel: 'Copyrighted official outline; targeted topic verification only',
  reuseStatus: 'copyrighted_targeted_verification_only', reuseNotes: 'Retain citation, normalized short topic identifiers and original editorial mappings. No outline prose, detailed weighting table, examination item or source excerpt copied.',
  authorityAssessment: 'Authoritative for ABSITE topic structure; not a clinical evidence source or a topic-level frequency guarantee.',
  usageRole: 'cross_check', evidenceClaimIds: [], supportedCoverageRecordIds: ['coverage.n0.20261104'],
  localVerificationReceipts: ['clinical-data/public/official-frameworks.json', 'docs/clinical-workbench/OFFICIAL_FRAMEWORK_SOURCES.md', 'docs/clinical-workbench/audits/gs028-subject-coverage-2026-10-03.json'],
  priorPdfSha256Receipt: '1df9fca970d5d6307b57d76e54f784c4e3763197b851bfcb960d2939354754c5',
  checkedLocallyOn: '2026-11-04', currentWebVerification: 'Not performed: task prohibits network. Original access date retained; current outline changes cannot be excluded.',
  reviewStatus: 'needs_clinician_review', aiAssistedDrafting: true, lastClinicianReview: null,
};
const result = { schemaVersion: 1, id: 'coverage.n0.20261104', source, counts, mappings,
  roomAndCapabilityProgression: [0, 1, 2, 3, 4].map(level => ({ level,
    newlyUnlockedRooms: balance.facility.roomDefinitions.filter(r => r.kind !== 'hallway' && r.unlockFacilityLevel === level).map(r => ({ id: r.id, capabilities: r.capabilityIds })),
    staffCapabilities: balance.facility.staffRoleDefinitions.filter(r => r.unlockFacilityLevel === level).flatMap(r => r.capabilityIds),
  })),
  limitations: ['All mappings are editorial inferences, not mappings supplied by ABS.',
    'Topic counts measure authored objectives, not mastery, item quality, clinical approval, ABSITE frequency or equal-weight targets.',
    'Levels are numeric facility stages, independent of educational tier and acuity.',
    'A room unlock is not an installed operational capability; staffing, access, room readiness and paired eligibility can reduce availability.',
    'N1 adds 40 playable concepts: 17 new decision identities and 23 retained previously unadmitted identities; this is not 40 newly invented clinical meanings.',
    'No SCORE topic structure, proprietary teaching corpus or recalled examination content is used.'],
};
fs.writeFileSync('docs/research/question-coverage-gaps-20261104.json', JSON.stringify(result, null, 2) + '\n');
fs.writeFileSync('docs/research/sources-question-new-n1-20261104.json', JSON.stringify({ sourceVerification: content.QUESTION_NEW_N1_BATCH_MANIFEST.sourceVerification,
  coverageSource: source, clinicalSources: content.QUESTION_NEW_N1_SOURCES,
  atomicClaims: content.QUESTION_NEW_N1_CLAIMS, inheritedClaimProvenance: content.QUESTION_NEW_N1_CLAIM_PROVENANCE }, null, 2) + '\n');
const reportPath = 'docs/research/question-coverage-gaps-20261104.md';
if (fs.existsSync(reportPath)) {
  const table = ['| Public-outline topic identifier | Pre-N1 patient concepts | With N1, Level 3 | With N1, Level 4 | N1 additions | All active scored concepts |',
    '|---|---:|---:|---:|---:|---:|', ...counts.map(c => `| ${c.category} | ${c.preN1ActivePatientConcepts} | ${c.patientConceptsAtL3} | ${c.patientConceptsAtL4} | ${c.N1Concepts} | ${c.allActiveConcepts} |`)].join('\n');
  fs.writeFileSync(reportPath, fs.readFileSync(reportPath, 'utf8').replace(/<!-- BEGIN N1_COVERAGE_TABLE -->[\s\S]*?<!-- END N1_COVERAGE_TABLE -->/,
    `<!-- BEGIN N1_COVERAGE_TABLE -->\n\n${table}\n\n<!-- END N1_COVERAGE_TABLE -->`));
}
console.log(JSON.stringify({ counts, unresolved: unknown.map(m => ({ id: m.id, objective: m.learningObjective, category: m.category })) }, null, 2));
