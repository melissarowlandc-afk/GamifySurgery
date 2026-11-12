import type {SyntheticClinicalRelease,AnswerChoiceTimingRegistryEntry} from "./schema";
import {QUESTION_SHIP_MANIFEST} from "./question-ship-manifest";
import * as first from "./question-new-n4-20261110";
import * as second from "./question-new-n4-round2-20261110";
/** Exact manager editorial acceptance only. All authored clinical metadata
 * remains needs_clinician_review; no clinical approval or runtime domain gate. */
export const QUESTION_N4_ACCEPTED_ROWS=[
  {
    "acceptanceId": "review.n4.cholecystectomy-neck-plane-bailout.v1",
    "caseId": "case.n4.cholecystectomy-neck-plane-bailout.v1",
    "nodeId": "node.n4.cholecystectomy-neck-plane-bailout.v1",
    "questionVariantId": "question.n4.cholecystectomy-neck-plane-bailout.v1",
    "conceptId": "concept.gs028g.subtotal-cholecystectomy.safe-bailout",
    "sourceView": "n4-round1",
    "decision": "docs/research/question-n4-manager-decision-20261110.md"
  },
  {
    "acceptanceId": "review.n4.colonic-wall-pattern-after-mucosal-biopsy.v1",
    "caseId": "case.n4.colonic-wall-pattern-after-mucosal-biopsy.v1",
    "nodeId": "node.n4.colonic-wall-pattern-after-mucosal-biopsy.v1",
    "questionVariantId": "question.n4.colonic-wall-pattern-after-mucosal-biopsy.v1",
    "conceptId": "concept.colonic-lipoma.endoscopic-recognition.v3",
    "sourceView": "n4-round1",
    "decision": "docs/research/question-n4-manager-decision-20261110.md"
  },
  {
    "acceptanceId": "review.n4.venous-ulcer-contralateral-pressure-trap.v1",
    "caseId": "case.n4.venous-ulcer-contralateral-pressure-trap.v1",
    "nodeId": "node.n4.venous-ulcer-contralateral-pressure-trap.v1",
    "questionVariantId": "question.n4.venous-ulcer-contralateral-pressure-trap.v1",
    "conceptId": "concept.venous-leg-ulcer.arterial-assessment-before-compression",
    "sourceView": "n4-round1",
    "decision": "docs/research/question-n4-manager-decision-20261110.md"
  },
  {
    "acceptanceId": "review.n4.incisional-pocket-above-retained-mesh.v1",
    "caseId": "case.n4.incisional-pocket-above-retained-mesh.v1",
    "nodeId": "node.n4.incisional-pocket-above-retained-mesh.v1",
    "questionVariantId": "question.n4.incisional-pocket-above-retained-mesh.v1",
    "conceptId": "concept.superficial-incisional-ssi.open-drain",
    "sourceView": "n4-round1",
    "decision": "docs/research/question-n4-manager-decision-20261110.md"
  },
  {
    "acceptanceId": "review.n4.ventral-controlled-enterotomy-mesh-material.v2",
    "caseId": "case.n4.ventral-controlled-enterotomy-mesh-material.v2",
    "nodeId": "node.n4.ventral-controlled-enterotomy-mesh-material.v2",
    "questionVariantId": "question.n4.ventral-controlled-enterotomy-mesh-material.v2",
    "conceptId": "concept.n4r2.mesh-material-and-contact-compartment",
    "sourceView": "n4-round2",
    "decision": "docs/research/question-n4-manager-decision-20261110.md"
  },
  {
    "acceptanceId": "review.n4.unexpected-deep-mass-during-lipoma-excision.v2",
    "caseId": "case.n4.unexpected-deep-mass-during-lipoma-excision.v2",
    "nodeId": "node.n4.unexpected-deep-mass-during-lipoma-excision.v2",
    "questionVariantId": "question.n4.unexpected-deep-mass-during-lipoma-excision.v2",
    "conceptId": "concept.soft-tissue-mass.extremity-mri.v2",
    "sourceView": "n4-round2",
    "decision": "docs/research/question-n4-manager-decision-20261110.md"
  },
  {
    "acceptanceId": "review.n4.ulcer-recurrent-bleeding-after-clips.v2",
    "caseId": "case.n4.ulcer-recurrent-bleeding-after-clips.v2",
    "nodeId": "node.n4.ulcer-recurrent-bleeding-after-clips.v2",
    "questionVariantId": "question.n4.ulcer-recurrent-bleeding-after-clips.v2",
    "conceptId": "concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality.v2",
    "sourceView": "n4-round2",
    "decision": "docs/research/question-n4-manager-decision-20261110.md"
  },
  {
    "acceptanceId": "review.n4.cholangiogram-lucencies-and-proximal-coverage.v1",
    "caseId": "case.n4.cholangiogram-lucencies-and-proximal-coverage.v1",
    "nodeId": "node.n4.cholangiogram-lucencies-and-proximal-coverage.v1",
    "questionVariantId": "question.n4.cholangiogram-lucencies-and-proximal-coverage.v1",
    "conceptId": "concept.n4r2.cholangiogram-quality-before-duct-treatment",
    "sourceView": "n4-round2",
    "decision": "docs/research/question-n4-manager-decision-20261110.md"
  }
] as const;
export const QUESTION_N4_FROZEN_PRESERVATION=[
  {
    "acceptanceId": "review.n4.cholecystectomy-neck-plane-bailout.v1",
    "sourceView": "n4-round1",
    "sourceReleaseSha256": "6e52115019ab011b59722b68c6cb2ddca7c8f43943a56652327cc87bb2f69782",
    "caseId": "case.n4.cholecystectomy-neck-plane-bailout.v1",
    "questionVariantId": "question.n4.cholecystectomy-neck-plane-bailout.v1",
    "conceptId": "concept.gs028g.subtotal-cholecystectomy.safe-bailout",
    "rawAuthoringCaseSha256": "9c8ae1ab0710baf8d33e106ee127340c38f1fceaa17efc13ffcf6b245ae3fc29",
    "acceptedCaseSha256": "71596ae9074acd2aea1540811e27041b43e1b5c844d638b7a5496d0eb247b47a",
    "acceptedQuestionSha256": "47ac63fc3a5216dbe62ea5421ecada5e05e9fe8625db4be0a708077bd8d8af87"
  },
  {
    "acceptanceId": "review.n4.colonic-wall-pattern-after-mucosal-biopsy.v1",
    "sourceView": "n4-round1",
    "sourceReleaseSha256": "6e52115019ab011b59722b68c6cb2ddca7c8f43943a56652327cc87bb2f69782",
    "caseId": "case.n4.colonic-wall-pattern-after-mucosal-biopsy.v1",
    "questionVariantId": "question.n4.colonic-wall-pattern-after-mucosal-biopsy.v1",
    "conceptId": "concept.colonic-lipoma.endoscopic-recognition.v3",
    "rawAuthoringCaseSha256": "209929b44a2ffb520d848cab46760473bb6ac7cb4bd0f9d042cf02adf16ced72",
    "acceptedCaseSha256": "62125405ca2999a938c9d1e7d9bab4d8f34471d60017b8e4db8585ed755f483b",
    "acceptedQuestionSha256": "ed54c806ca92aa3d79c4a99d6680e71c201751a81e5178bdb03e93332084ac2b"
  },
  {
    "acceptanceId": "review.n4.venous-ulcer-contralateral-pressure-trap.v1",
    "sourceView": "n4-round1",
    "sourceReleaseSha256": "6e52115019ab011b59722b68c6cb2ddca7c8f43943a56652327cc87bb2f69782",
    "caseId": "case.n4.venous-ulcer-contralateral-pressure-trap.v1",
    "questionVariantId": "question.n4.venous-ulcer-contralateral-pressure-trap.v1",
    "conceptId": "concept.venous-leg-ulcer.arterial-assessment-before-compression",
    "rawAuthoringCaseSha256": "580212c160bda5ff4caed600b32df96e785dad4b378249865466c26c92c76c6e",
    "acceptedCaseSha256": "f6b8431cc3b4c406c058cd87d59e03bb3a73c61eff88dd870f7c29f4ed2ec1c3",
    "acceptedQuestionSha256": "3ffb49049945a8bff438631845c84f34cf0c42c99b65264600b0638a783af088"
  },
  {
    "acceptanceId": "review.n4.incisional-pocket-above-retained-mesh.v1",
    "sourceView": "n4-round1",
    "sourceReleaseSha256": "6e52115019ab011b59722b68c6cb2ddca7c8f43943a56652327cc87bb2f69782",
    "caseId": "case.n4.incisional-pocket-above-retained-mesh.v1",
    "questionVariantId": "question.n4.incisional-pocket-above-retained-mesh.v1",
    "conceptId": "concept.superficial-incisional-ssi.open-drain",
    "rawAuthoringCaseSha256": "4ed850f7bc0b74cc67db52f9e21d8dce79eb0faa540fae0b7442acd38e832616",
    "acceptedCaseSha256": "184bf66e9648c13714aee1e9047229b09de949295bd1b8080e4f67d1c69e3dcb",
    "acceptedQuestionSha256": "c642e19e54114b49d050c9f0dab1c8d93117695425eea8f0b0048477477343a2"
  },
  {
    "acceptanceId": "review.n4.ventral-controlled-enterotomy-mesh-material.v2",
    "sourceView": "n4-round2",
    "sourceReleaseSha256": "5ee26ba76c9deaa161e423f1419a9030e2886dd4a7c678626b9156a22b5f0c51",
    "caseId": "case.n4.ventral-controlled-enterotomy-mesh-material.v2",
    "questionVariantId": "question.n4.ventral-controlled-enterotomy-mesh-material.v2",
    "conceptId": "concept.n4r2.mesh-material-and-contact-compartment",
    "rawAuthoringCaseSha256": "1c451ae253df4390756153060b54b707c965984869a91a1a8dcb28ea83e3b9fb",
    "acceptedCaseSha256": "d40eb51fc66b0c74a63bfa92d787f88389f4bac39ccbf606c62fb9244135ed35",
    "acceptedQuestionSha256": "44d1ccb4229916f293427caa03aac68b5e6049b957075db6ea2e0715e8481100"
  },
  {
    "acceptanceId": "review.n4.unexpected-deep-mass-during-lipoma-excision.v2",
    "sourceView": "n4-round2",
    "sourceReleaseSha256": "5ee26ba76c9deaa161e423f1419a9030e2886dd4a7c678626b9156a22b5f0c51",
    "caseId": "case.n4.unexpected-deep-mass-during-lipoma-excision.v2",
    "questionVariantId": "question.n4.unexpected-deep-mass-during-lipoma-excision.v2",
    "conceptId": "concept.soft-tissue-mass.extremity-mri.v2",
    "rawAuthoringCaseSha256": "27e4055cb6544d7ca9142fe09ebafd7b7d5504dce08b0d3ee94c1fe8b5924771",
    "acceptedCaseSha256": "067aab80675869b4edeb1dac4c86c271e6737ca135564525d53ea42e15d8f68f",
    "acceptedQuestionSha256": "449c68a08d762efbb651672688054bf7b2d9dd78cad953f35b4259afd15f5de7"
  },
  {
    "acceptanceId": "review.n4.ulcer-recurrent-bleeding-after-clips.v2",
    "sourceView": "n4-round2",
    "sourceReleaseSha256": "5ee26ba76c9deaa161e423f1419a9030e2886dd4a7c678626b9156a22b5f0c51",
    "caseId": "case.n4.ulcer-recurrent-bleeding-after-clips.v2",
    "questionVariantId": "question.n4.ulcer-recurrent-bleeding-after-clips.v2",
    "conceptId": "concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality.v2",
    "rawAuthoringCaseSha256": "26f17c2966c50a6c7e9566d219f37b4dcd1255f38678a1b7c2e47aa41309a297",
    "acceptedCaseSha256": "1535a568d89cd5f306aeb3d9cd74ffb59dd4d07b5e3f31dfb95c3f5c4962d23b",
    "acceptedQuestionSha256": "ff415f4eef08123bfcb2cc9292566bbcb41fbe6918220d9ded18cabc32329aee"
  },
  {
    "acceptanceId": "review.n4.cholangiogram-lucencies-and-proximal-coverage.v1",
    "sourceView": "n4-round2",
    "sourceReleaseSha256": "5ee26ba76c9deaa161e423f1419a9030e2886dd4a7c678626b9156a22b5f0c51",
    "caseId": "case.n4.cholangiogram-lucencies-and-proximal-coverage.v1",
    "questionVariantId": "question.n4.cholangiogram-lucencies-and-proximal-coverage.v1",
    "conceptId": "concept.n4r2.cholangiogram-quality-before-duct-treatment",
    "rawAuthoringCaseSha256": "e737f6ad5ae6cf053c43c546df28bdf4d38c9bb64d6300507095132b2b4ade3f",
    "acceptedCaseSha256": "2fcd76f1c88d262848b9b258716c0aa0dfb0d0cfa0098c275ce4f275cdb3874b",
    "acceptedQuestionSha256": "f2c9dee7b9e9c2a409e813727ca64bf5ddd3f08b4fd957865392c1267232ce51"
  }
] as const;
export const QUESTION_N4_ACCEPTED_SOURCE_VIEWS={"n4-round1":first.QUESTION_NEW_N4_SOURCE_RELEASE,"n4-round2":second.QUESTION_NEW_N4_ROUND2_SOURCE_RELEASE};
export const QUESTION_N4_ACCEPTED_CASES=QUESTION_N4_ACCEPTED_ROWS.map(r=>QUESTION_N4_ACCEPTED_SOURCE_VIEWS[r.sourceView].cases.find(c=>c.id===r.caseId)!);
export const QUESTION_N4_ACCEPTED_QUESTIONS=QUESTION_N4_ACCEPTED_ROWS.map(r=>[...first.QUESTION_NEW_N4_QUESTIONS,...second.QUESTION_NEW_N4_ROUND2_QUESTIONS].find(q=>q.id===r.questionVariantId)!);
export const QUESTION_N4_ACCEPTED_CONCEPTS=QUESTION_N4_ACCEPTED_ROWS.map(r=>QUESTION_N4_ACCEPTED_SOURCE_VIEWS[r.sourceView].concepts.find(c=>c.id===r.conceptId)!);
const exactAccepted=(id:string)=>QUESTION_N4_ACCEPTED_ROWS.some(r=>r.questionVariantId===id&&QUESTION_SHIP_MANIFEST.accepted.some(a=>
 a.acceptanceId===r.acceptanceId&&a.caseId===r.caseId&&a.nodeId===r.nodeId&&a.questionVariantId===r.questionVariantId&&a.conceptId===r.conceptId&&a.sourceView===r.sourceView));
export function withAcceptedQuestionN4Concepts(release:SyntheticClinicalRelease):SyntheticClinicalRelease{
 const ids=new Set(release.concepts.map(c=>c.id));
 const added=QUESTION_N4_ACCEPTED_ROWS.flatMap((r,i)=>{if(ids.has(r.conceptId)||!exactAccepted(r.questionVariantId))return [];ids.add(r.conceptId);return [QUESTION_N4_ACCEPTED_CONCEPTS[i]!];});
 return {...release,concepts:[...release.concepts,...added]};
}
export const QUESTION_N4_ACCEPTED_TIMING_ENTRIES:AnswerChoiceTimingRegistryEntry[]=QUESTION_N4_ACCEPTED_ROWS.filter(r=>exactAccepted(r.questionVariantId)).map(r=>
 [...first.QUESTION_NEW_N4_TIMING_ENTRIES,...second.QUESTION_NEW_N4_ROUND2_TIMING_ENTRIES].find(t=>t.questionVariantId===r.questionVariantId)!);
/** Exact accepted-only handoff data, NOT installed into game-domain runtime.
 * Each diagnostic choice is a future-planned preview, never a circular order
 * of the operation/endoscopy already in progress. */
export const QUESTION_N4_ACCEPTED_TEST_ORDER_RECORDS=QUESTION_N4_ACCEPTED_ROWS.filter(r=>exactAccepted(r.questionVariantId)).flatMap(r=>
 [...first.QUESTION_NEW_N4_CANDIDATE_TEST_ORDER_RECORDS,...second.QUESTION_NEW_N4_ROUND2_CANDIDATE_TEST_ORDER_RECORDS]
 .filter(t=>t.questionVariantId===r.questionVariantId).filter((t,index,all)=>all.findIndex(a=>a.choiceId===t.choiceId)===index));
export const QUESTION_N4_ACCEPTED_CASE_REVIEWS=QUESTION_N4_ACCEPTED_ROWS.map(r=>
 [...first.QUESTION_NEW_N4_CASE_REVIEWS,...second.QUESTION_NEW_N4_ROUND2_CASE_REVIEWS].find(v=>v.id===r.acceptanceId)!);
export * from "./question-new-n4-20261110";
export * from "./question-new-n4-round2-20261110";
