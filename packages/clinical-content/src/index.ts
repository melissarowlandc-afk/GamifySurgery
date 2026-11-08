export * from "./schema";
export * from "./answer-choice-timing";
export * from "./patient-library-wording-repair";
export * from "./synthetic-content";
export * from "./approved-data/ventral-hernia-pulmonary-optimization";
export * from "./approved-data/direct-inguinal-operative-anatomy";
export * from "./approved-data/breast-cyst-pathway";
export * from "./approved-data/ebv-associated-malignancies";
export * from "./approved-data/hcc-milan-criteria";
export * from "./approved-data/colonic-lipoma";
export * from "./approved-data/suspicious-breast-imaging";
export * from "./approved-data/mondor-disease";
export * from "./approved-data/postoperative-chylous-ascites";
export * from "./approved-data/vitamin-c-collagen-hydroxylation";
export * from "./approved-data/gastric-malt-lymphoma";
export * from "./approved-data/gastroparesis";
export * from "./approved-data/postoperative-ileus";
export * from "./approved-data/gastric-splenectomy";
export * from "./approved-data/severe-burn-early-enteral-nutrition";
export * from "./approved-data/controlled-enterotomy-mesh-selection";
export * from "./approved-data/right-thoracotomy-trauma-exposure";
export * from "./approved-data/meckel-resection-extent";
export * from "./approved-data/aaa-female-sex-perioperative-mortality";
export * from "./approved-data/desmoid-management-pathway";
export * from "./approved-data/peptic-ulcer-bleeding-hemostasis";
export * from "./approved-data/quality-improvement-pdsa-iteration";
export * from "./approved-data/pancreatic-tail-adenocarcinoma-resection";
export * from "./approved-data/felty-syndrome-pathway";
export * from "./approved-data/familial-hypocalciuric-hypercalcemia";
export * from "./approved-data/lymphangitis-recognition";
export * from "./approved-data/gallbladder-polyp-management";
export * from "./approved-data/distal-cholangiocarcinoma";
export * from "./approved-data/obstructive-jaundice-vitamin-k";
export * from "./approved-data/hcc-resection-selection";
export * from "./approved-data/accessory-spleen-location";
export * from "./approved-data/hereditary-spherocytosis-postsplenectomy";
export * from "./approved-data/level-two-runtime";
export * from "./approved-data/early-game-clinic-batch";
export * from "./approved-data/men2a-clinic-batch";
export * from "./approved-data/phyllodes-pathology-follow-up";
export * from "./approved-data/trauma-vka-emergency-reversal";
export * from "./question-quality-pilot-20261028";
export * from "./question-quality-batch1-20261102";
export * from "./question-quality-adversarial-20261102";
export * from "./question-quality-adversarial-r3-20261102";
export * from "./question-quality-adversarial-r4-20261102";
export * from "./question-quality-adversarial-r5-20261102";
export * from "./question-quality-adversarial-r6-20261102";
export * from "./question-quality-adversarial-r7-20261102";
export * from "./question-flags-20261104";
export * from "./question-flags-round2-20261104";
export * from "./question-flags-round2-evidence-20261104";
export * from "./question-bank-batch2a-20261104";
export * from "./question-bank-batch2a-evidence-20261104";
export * from "./question-flags-round3-20261104";
export * from "./question-flags-round3-evidence-20261104";
export * from "./question-quality-round3-batch1-evidence-20261102";
export * from "./development-batch/2026-09-09/twenty-concept-batch";
export * from "./development-batch/2026-09-10/surgery-center-batch";
export * from "./development-batch/2026-09-11/board-expansion-batch";

export * from "./development-batch/2026-09-12/board-expansion-batch";
export * from "./development-batch/2026-09-13/early-levels-batch";
export * from "./development-batch/2026-09-17/brief-early-levels-batch";
export * from "./development-batch/2026-09-17-bread-and-butter/bread-butter-batch";
export * from "./development-batch/2026-09-28-pre-endoscopy/pre-endoscopy-batch";
export * from "./development-batch/2026-09-29-pre-endoscopy/pre-endoscopy-batch";
export * from "./development-batch/2026-09-29-statistics-ethics/statistics-ethics-batch";
export * from "./development-batch/2026-10-02-pre-endoscopy/pre-endoscopy-batch";
export * from "./development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch";
export * from "./development-batch/2026-10-07-variety/variety-batch";
export * from "./development-batch/2026-10-07-variety-2/variety-batch";
export * from "./development-batch/2026-10-07-level3/level3-batch";
export * from "./development-batch/2026-10-08-pediatric-clinic/pediatric-clinic-batch";
export {
  VARIETY3_AUTHORING_CONCEPTS,
  VARIETY3_TESTED_CONCEPTS,
  VARIETY3_QUESTIONS,
  VARIETY3_CASES,
  VARIETY3_CASE_REVIEWS,
  VARIETY3_ADULT_CONTEXTS,
  VARIETY3_STATEMENT_MAPPINGS,
  VARIETY3_TIMING_ENTRIES,
  VARIETY3_SERVICE_CONTRACTS,
  VARIETY3_CLAIMS,
  VARIETY3_SOURCES,
  VARIETY3_SOURCE_LINKS,
  VARIETY3_BATCH_MANIFEST,
  WITHHELD_DISAGREEMENTS as VARIETY3_WITHHELD_DISAGREEMENTS,
  WITHHELD_TOPICS as VARIETY3_WITHHELD_TOPICS,
  EXCLUDED_SOURCE_CHECKS as VARIETY3_EXCLUDED_SOURCE_CHECKS,
} from "./development-batch/2026-10-10-variety-3/variety3-batch";

// BEGIN N1 append — new-content lane, independent of existing-question rewrites.
export * from "./question-new-n1-20261104";
// END N1 append.

// BEGIN N2 append — separate new-content lane; N1 versions remain frozen.
export * from "./question-new-n2-20261104";
// END N2 append.
export * from "./question-bank-batch2a-round2-20261104";
export * from "./question-bank-batch2a-round2-evidence-20261104";

// BEGIN N1 ROUND2 append — original N1 and independently reviewed N2 remain intact.
export * from "./question-new-n1-round2-20261104";
// END N1 ROUND2 append.

export * from "./question-bank-batch2b-20261104";

// BEGIN N2 ROUND2 append — separate draft versions; N1 and two N2 PASS versions retained.
export * from "./question-new-n2-round2-20261104";
// END N2 ROUND2 append.

// BEGIN BATCH2A ROUND3 exports
export * from "./question-bank-batch2a-round3-20261104";
export * from "./question-bank-batch2a-round3-evidence-20261104";
// END BATCH2A ROUND3 exports

// BEGIN N1 ROUND3 append — 31 returned versions; nine exact PASS and N2 frozen.
export * from "./question-new-n1-round3-20261104";
// END N1 ROUND3 append.

export * from "./question-bank-batch2b-round2-20261104";

// BEGIN N2 ROUND3 and ship-gate exports
export * from "./question-new-n2-round3-20261104";
export * from "./question-ship-manifest";
export * from "./question-ship-projection";
// END N2 ROUND3 and ship-gate exports

// BEGIN FLAGS2 retained candidates - no ship-manifest or gate changes.
export * from "./question-flags2-20261105";
// END FLAGS2 retained candidates.

// BEGIN N3 explicit draft exports; no default-release acceptance.
export * from "./question-new-n3-20261105";
// END N3 explicit draft exports.

// BEGIN FLAGS2 round2 retained candidates and exact G06 integration 20261105
export * from "./question-flags2-round2-20261105";
export { withAcceptedQuestionFlags2Concepts } from "./question-flags2-accepted-20261105";
// END FLAGS2 round2 retained candidates and exact G06 integration 20261105

// BEGIN FLAGS2 round3 retained candidates - no manifest acceptance.
export * from "./question-flags2-round3-20261105";
// END FLAGS2 round3 retained candidates.

// BEGIN N3 ROUND2 exports - review drafts only; no manifest acceptance.
export * from "./question-new-n3-round2-20261105";
// END N3 ROUND2 exports.

// BEGIN N3 ROUND3 explicit candidate exports - no default projection change.
export * from "./question-new-n3-round3-20261105";
export * from "./question-new-n3-round3-source-20261105";
// END N3 ROUND3 explicit candidate exports.

// BEGIN FLAGS2 whole-case accepted integration 20261105
export * from "./question-flags2-whole-case-accepted-20261105";
// END FLAGS2 whole-case accepted integration 20261105

// BEGIN FLAGS3 ACCEPTED EXPORTS 20261107
export * from "./question-flags3-20261107";
export * from "./question-flags3-accepted-20261107";
// END FLAGS3 ACCEPTED EXPORTS 20261107
