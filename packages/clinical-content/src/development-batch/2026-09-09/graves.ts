import type { ClinicalSource, EvidenceClaim, QuestionVariant } from "../../pilot-schema";
import type {
  ApprovedInstantiationProfile,
  SyntheticClinicalCase,
  TestedConcept,
} from "../../schema";

const CHECKED_ON = "2026-09-09";
const EVIDENCE_CONTENT_VERSION = "evidence.graves-row-061.2026-09-09.1";

interface GravesSnapshotBinding {
  concept: string;
  path: string;
  hash: string;
  receipt: string;
}

type GravesClinicalSource =
  | ClinicalSource
  | (Omit<ClinicalSource, "publicationYear"> & {
      publicationYear: null;
      publicationDateNote: "Source is explicitly undated; no publication year is claimed.";
    });

interface GravesVariant extends QuestionVariant {
  patientPresentationVariantId: string;
  patientPresentation: string;
  approvedInstantiationProfiles: ApprovedInstantiationProfile[];
  frozenSnapshotPath: string;
  frozenSnapshotSha256: string;
  originalClinicianReceipt: string;
  runtimeAdaptationReview: {
    contentVersion: string;
    reviewStatus: "needs_clinician_review";
    aiAssistedDrafting: true;
    lastClinicianReview: null;
    authority: "owner-delegated agent review";
    clinicianSignOff: false;
    scope: string;
  };
}

export const GRAVES_SNAPSHOT_BINDINGS = [
  {
    "concept": "concept.graves.clinical-pattern-recognition",
    "path": "docs/clinical-workbench/workthroughs/owner-row-061-graves-pattern-recognition-v2.md",
    "hash": "849f556a1849c3f93cfcb150d66b3f0f351c70b168d4e820567ded8103ffac5b",
    "receipt": "docs/clinical-workbench/approvals/owner-row-061-graves-pattern-recognition-2026-09-09.md"
  },
  {
    "concept": "concept.graves.trab-diagnostic-support",
    "path": "docs/clinical-workbench/workthroughs/owner-row-061-graves-trab-diagnostic-support-v1.md",
    "hash": "5003e0445fbf753d560b40ab16d2bbc8c6b754ea0bdf668a9c600950bc89e609",
    "receipt": "docs/clinical-workbench/approvals/owner-row-061-graves-trab-diagnostic-support-2026-09-09.md"
  },
  {
    "concept": "concept.graves.rai-appropriate-candidate",
    "path": "docs/clinical-workbench/workthroughs/owner-row-061-graves-rai-appropriate-candidate-v1.md",
    "hash": "2f14cea6b47d72825f8ca48ede601026469e1a149d2e04b87a1c4c069f478702",
    "receipt": "docs/clinical-workbench/approvals/owner-row-061-graves-rai-appropriate-candidate-2026-09-09.md"
  },
  {
    "concept": "concept.graves.rai-pregnancy-contraindication",
    "path": "docs/clinical-workbench/workthroughs/owner-row-061-graves-rai-pregnancy-contraindication-v1.md",
    "hash": "bddc991cd919e941536c67968d1a9814c677833691ddbb479c33ac01d0915945",
    "receipt": "docs/clinical-workbench/approvals/owner-row-061-graves-rai-pregnancy-contraindication-2026-09-09.md"
  },
  {
    "concept": "concept.graves.rai-lactation-contraindication",
    "path": "docs/clinical-workbench/workthroughs/owner-row-061-graves-rai-lactation-contraindication-v1.md",
    "hash": "b41274c14fdf3b1b3b5fc222a532da4ba3b3b5f5218c7dfd574d37e560bc23cf",
    "receipt": "docs/clinical-workbench/approvals/owner-row-061-graves-rai-lactation-contraindication-2026-09-09.md"
  },
  {
    "concept": "concept.graves.rai-active-ted-avoidance",
    "path": "docs/clinical-workbench/workthroughs/owner-row-061-graves-rai-active-ted-avoidance-v1.md",
    "hash": "dbc25a353744766aa912aa5369c3816c023baf1640446317aaab8f8479a01435",
    "receipt": "docs/clinical-workbench/approvals/owner-row-061-graves-rai-active-ted-avoidance-2026-09-09.md"
  }
] as const satisfies readonly GravesSnapshotBinding[];

const FROZEN_VARIANT_TEXT = [
  {
    "id": "question.graves-pattern-recognition.v1",
    "conceptId": "concept.graves.clinical-pattern-recognition",
    "contentVersion": "review.owner-row-061.graves-pattern-recognition.2026-09-09.2",
    "patientPresentationVariantId": "presentation.graves-pattern-recognition.v1",
    "patientPresentation": "{patientName} attends clinic because palpitations,\nheat intolerance, hand tremor, and unintentional weight loss are interfering\nwith daily activities. Her current examination shows a diffusely enlarged\nthyroid and bilateral proptosis.",
    "stem": "Which cause of thyrotoxicosis most likely explains this patient's\nfindings?",
    "choices": [
      "Toxic multinodular goiter",
      "Painful subacute thyroiditis",
      "Graves disease",
      "Toxic adenoma"
    ],
    "correctChoiceIndex": 2,
    "explanation": "The diffuse thyroid enlargement with bilateral proptosis\nsupports Graves disease in the setting of symptoms compatible with\nthyroid-hormone excess. Painful subacute thyroiditis and nodular causes are\nalternative causes of thyrotoxicosis, but do not describe this full pattern.",
    "supportingEvidenceClaimIds": [
      "claim.graves-pattern-recognition.classic-clinical-constellation",
      "claim.graves-pattern-recognition.thyrotoxicosis-symptoms-nonspecific",
      "claim.graves-pattern-recognition.nodular-thyroid-disease-boundary",
      "claim.graves-pattern-recognition.painful-subacute-thyroiditis-boundary"
    ],
    "profileSpecs": [
      {
        "ageYears": 29,
        "sexLabel": "Female"
      },
      {
        "ageYears": 33,
        "sexLabel": "Female"
      }
    ],
    "frozenSnapshotPath": "docs/clinical-workbench/workthroughs/owner-row-061-graves-pattern-recognition-v2.md",
    "frozenSnapshotSha256": "849f556a1849c3f93cfcb150d66b3f0f351c70b168d4e820567ded8103ffac5b",
    "originalClinicianReceipt": "docs/clinical-workbench/approvals/owner-row-061-graves-pattern-recognition-2026-09-09.md"
  },
  {
    "id": "question.graves-pattern-recognition.v2",
    "conceptId": "concept.graves.clinical-pattern-recognition",
    "contentVersion": "review.owner-row-061.graves-pattern-recognition.2026-09-09.2",
    "patientPresentationVariantId": "presentation.graves-pattern-recognition.v2",
    "patientPresentation": "{patientName} is seen in clinic after outside testing\ndocumented thyrotoxicosis. During today’s examination, the clinician notes fine\nhand tremor, resting tachycardia, bilateral proptosis, and muscle weakness.",
    "stem": "Which finding in this patient's examination most strongly\nsupports Graves disease as the cause?",
    "choices": [
      "Fine hand tremor",
      "Resting tachycardia",
      "Bilateral proptosis",
      "Muscle weakness"
    ],
    "correctChoiceIndex": 2,
    "explanation": "Fine tremor, resting tachycardia, and muscle weakness may\naccompany thyroid-hormone excess from more than one cause. Bilateral proptosis\nis the finding here that most strongly supports Graves disease; it is\nsupportive, not required in every patient.",
    "supportingEvidenceClaimIds": [
      "claim.graves-pattern-recognition.classic-clinical-constellation",
      "claim.graves-pattern-recognition.thyrotoxicosis-symptoms-nonspecific"
    ],
    "profileSpecs": [
      {
        "ageYears": 35,
        "sexLabel": "Female"
      },
      {
        "ageYears": 39,
        "sexLabel": "Female"
      },
      {
        "ageYears": 36,
        "sexLabel": "Male"
      },
      {
        "ageYears": 40,
        "sexLabel": "Male"
      }
    ],
    "frozenSnapshotPath": "docs/clinical-workbench/workthroughs/owner-row-061-graves-pattern-recognition-v2.md",
    "frozenSnapshotSha256": "849f556a1849c3f93cfcb150d66b3f0f351c70b168d4e820567ded8103ffac5b",
    "originalClinicianReceipt": "docs/clinical-workbench/approvals/owner-row-061-graves-pattern-recognition-2026-09-09.md"
  },
  {
    "id": "question.graves-pattern-recognition.v3",
    "conceptId": "concept.graves.clinical-pattern-recognition",
    "contentVersion": "review.owner-row-061.graves-pattern-recognition.2026-09-09.2",
    "patientPresentationVariantId": "presentation.graves-pattern-recognition.v3",
    "patientPresentation": "{patientName} returns to clinic after outside testing\ndocumented thyrotoxicosis and reports neck fullness. Graves disease is being\nconsidered. A focused thyroid and eye examination is planned today.",
    "stem": "Which examination pattern in this patient would most support\nGraves disease?",
    "choices": [
      "A tender enlarged thyroid and localized neck pain",
      "Multiple discrete thyroid nodules and fine hand tremor",
      "One discrete thyroid nodule and a rapid pulse",
      "Diffuse thyroid enlargement and bilateral proptosis"
    ],
    "correctChoiceIndex": 3,
    "explanation": "The keyed finding pattern combines diffuse enlargement and\nbilateral proptosis. Painful thyroid enlargement and nodular thyroid findings\ndescribe competing clinical presentations; this item does not determine their\nfinal diagnoses.",
    "supportingEvidenceClaimIds": [
      "claim.graves-pattern-recognition.classic-clinical-constellation",
      "claim.graves-pattern-recognition.thyrotoxicosis-symptoms-nonspecific",
      "claim.graves-pattern-recognition.nodular-thyroid-disease-boundary",
      "claim.graves-pattern-recognition.painful-subacute-thyroiditis-boundary"
    ],
    "profileSpecs": [
      {
        "ageYears": 41,
        "sexLabel": "Female"
      },
      {
        "ageYears": 45,
        "sexLabel": "Female"
      },
      {
        "ageYears": 42,
        "sexLabel": "Male"
      },
      {
        "ageYears": 46,
        "sexLabel": "Male"
      }
    ],
    "frozenSnapshotPath": "docs/clinical-workbench/workthroughs/owner-row-061-graves-pattern-recognition-v2.md",
    "frozenSnapshotSha256": "849f556a1849c3f93cfcb150d66b3f0f351c70b168d4e820567ded8103ffac5b",
    "originalClinicianReceipt": "docs/clinical-workbench/approvals/owner-row-061-graves-pattern-recognition-2026-09-09.md"
  },
  {
    "id": "question.graves-pattern-recognition.v4",
    "conceptId": "concept.graves.clinical-pattern-recognition",
    "contentVersion": "review.owner-row-061.graves-pattern-recognition.2026-09-09.2",
    "patientPresentationVariantId": "presentation.graves-pattern-recognition.v4",
    "patientPresentation": "{patientName} attends clinic for sweating,\npalpitations, difficulty tolerating heat, and new changes over the shins. Her\nexamination shows diffuse thyroid enlargement and thickened raised plaques over\nthe anterior shins. Proptosis is not present.",
    "stem": "Which cause of thyrotoxicosis most likely explains this patient's\nfindings?",
    "choices": [
      "Painful subacute thyroiditis",
      "Toxic adenoma",
      "Graves disease",
      "Toxic multinodular goiter"
    ],
    "correctChoiceIndex": 2,
    "explanation": "The compatible symptoms, diffuse enlargement, and pretibial\ndermopathy support Graves disease even though proptosis is absent. Neither\nproptosis nor dermopathy is required to identify Graves disease.",
    "supportingEvidenceClaimIds": [
      "claim.graves-pattern-recognition.classic-clinical-constellation",
      "claim.graves-pattern-recognition.pretibial-dermopathy-association",
      "claim.graves-pattern-recognition.thyrotoxicosis-symptoms-nonspecific",
      "claim.graves-pattern-recognition.nodular-thyroid-disease-boundary",
      "claim.graves-pattern-recognition.painful-subacute-thyroiditis-boundary"
    ],
    "profileSpecs": [
      {
        "ageYears": 47,
        "sexLabel": "Female"
      },
      {
        "ageYears": 51,
        "sexLabel": "Female"
      }
    ],
    "frozenSnapshotPath": "docs/clinical-workbench/workthroughs/owner-row-061-graves-pattern-recognition-v2.md",
    "frozenSnapshotSha256": "849f556a1849c3f93cfcb150d66b3f0f351c70b168d4e820567ded8103ffac5b",
    "originalClinicianReceipt": "docs/clinical-workbench/approvals/owner-row-061-graves-pattern-recognition-2026-09-09.md"
  },
  {
    "id": "question.graves-trab-diagnostic-support.v1",
    "conceptId": "concept.graves.trab-diagnostic-support",
    "contentVersion": "review.owner-row-061.graves-trab-diagnostic-support.2026-09-09.1",
    "patientPresentationVariantId": "presentation.graves-trab-diagnostic-support.v1",
    "patientPresentation": "{patientName} attends clinic to discuss palpitations\nand heat intolerance. Outside testing has already documented biochemical\nthyrotoxicosis, but the cause remains unclear after today’s focused history and\nexamination.",
    "stem": "Which blood test would most directly add etiologic support for\nGraves disease in this patient?",
    "choices": [
      "Total T3 measurement",
      "Free T4 measurement",
      "TSH measurement",
      "TRAb measurement"
    ],
    "correctChoiceIndex": 3,
    "explanation": "The available thyroid function results establish that {patientName}\nhas thyrotoxicosis but do not identify its cause. A TRAb result adds antibody\nevidence relevant to Graves etiology; this question does not select treatment\nor require an imaging pathway.",
    "supportingEvidenceClaimIds": [
      "claim.graves-trab-diagnostic-support.function-versus-cause",
      "claim.graves-trab-diagnostic-support.positive-trab-supports-etiology",
      "claim.graves-trab-diagnostic-support.symptom-goiter-context"
    ],
    "profileSpecs": [
      {
        "ageYears": 29,
        "sexLabel": "Female"
      },
      {
        "ageYears": 33,
        "sexLabel": "Female"
      },
      {
        "ageYears": 30,
        "sexLabel": "Male"
      },
      {
        "ageYears": 34,
        "sexLabel": "Male"
      }
    ],
    "frozenSnapshotPath": "docs/clinical-workbench/workthroughs/owner-row-061-graves-trab-diagnostic-support-v1.md",
    "frozenSnapshotSha256": "5003e0445fbf753d560b40ab16d2bbc8c6b754ea0bdf668a9c600950bc89e609",
    "originalClinicianReceipt": "docs/clinical-workbench/approvals/owner-row-061-graves-trab-diagnostic-support-2026-09-09.md"
  },
  {
    "id": "question.graves-trab-diagnostic-support.v2",
    "conceptId": "concept.graves.trab-diagnostic-support",
    "contentVersion": "review.owner-row-061.graves-trab-diagnostic-support.2026-09-09.1",
    "patientPresentationVariantId": "presentation.graves-trab-diagnostic-support.v2",
    "patientPresentation": "{patientName} returns to clinic after palpitations\nand heat intolerance prompted outside testing. The report shows low TSH and\nhigh free T4. Today’s examination shows diffuse thyroid enlargement, and the\nordered TRAb result is positive.",
    "stem": "Which cause best fits this patient's current findings and test\nresults?",
    "choices": [
      "Painless thyroiditis",
      "Toxic adenoma",
      "Toxic multinodular goiter",
      "Graves disease"
    ],
    "correctChoiceIndex": 3,
    "explanation": "{patientName}’s thyroid function results establish hormone excess,\nwhile the positive TRAb result adds etiologic support for Graves disease in the\ncurrent clinical context. The function results alone would not identify the\ncause.",
    "supportingEvidenceClaimIds": [
      "claim.graves-trab-diagnostic-support.positive-trab-supports-etiology",
      "claim.graves-trab-diagnostic-support.function-versus-cause",
      "claim.graves-trab-diagnostic-support.biochemical-thyrotoxicosis-context",
      "claim.graves-trab-diagnostic-support.symptom-goiter-context"
    ],
    "profileSpecs": [
      {
        "ageYears": 35,
        "sexLabel": "Female"
      },
      {
        "ageYears": 39,
        "sexLabel": "Female"
      },
      {
        "ageYears": 36,
        "sexLabel": "Male"
      },
      {
        "ageYears": 40,
        "sexLabel": "Male"
      }
    ],
    "frozenSnapshotPath": "docs/clinical-workbench/workthroughs/owner-row-061-graves-trab-diagnostic-support-v1.md",
    "frozenSnapshotSha256": "5003e0445fbf753d560b40ab16d2bbc8c6b754ea0bdf668a9c600950bc89e609",
    "originalClinicianReceipt": "docs/clinical-workbench/approvals/owner-row-061-graves-trab-diagnostic-support-2026-09-09.md"
  },
  {
    "id": "question.graves-trab-diagnostic-support.v3",
    "conceptId": "concept.graves.trab-diagnostic-support",
    "contentVersion": "review.owner-row-061.graves-trab-diagnostic-support.2026-09-09.1",
    "patientPresentationVariantId": "presentation.graves-trab-diagnostic-support.v3",
    "patientPresentation": "{patientName} is evaluated in clinic for palpitations\nand heat intolerance. Outside testing shows low TSH and high free T4, and\ntoday’s examination shows diffuse thyroid enlargement. Her TRAb result is\nnegative.",
    "stem": "Which interpretation best fits this patient's negative TRAb\nresult?",
    "choices": [
      "Graves disease is excluded",
      "Thyroiditis is established",
      "Graves disease remains possible",
      "Nodular autonomy is established"
    ],
    "correctChoiceIndex": 2,
    "explanation": "A negative TRAb result does not fully exclude Graves disease\nwhen the clinical and biochemical context remains compatible. This result does\nnot by itself establish another cause or determine the degree of hormone\nexcess.",
    "supportingEvidenceClaimIds": [
      "claim.graves-trab-diagnostic-support.negative-trab-not-full-exclusion",
      "claim.graves-trab-diagnostic-support.function-versus-cause",
      "claim.graves-trab-diagnostic-support.biochemical-thyrotoxicosis-context",
      "claim.graves-trab-diagnostic-support.symptom-goiter-context"
    ],
    "profileSpecs": [
      {
        "ageYears": 41,
        "sexLabel": "Female"
      },
      {
        "ageYears": 45,
        "sexLabel": "Female"
      }
    ],
    "frozenSnapshotPath": "docs/clinical-workbench/workthroughs/owner-row-061-graves-trab-diagnostic-support-v1.md",
    "frozenSnapshotSha256": "5003e0445fbf753d560b40ab16d2bbc8c6b754ea0bdf668a9c600950bc89e609",
    "originalClinicianReceipt": "docs/clinical-workbench/approvals/owner-row-061-graves-trab-diagnostic-support-2026-09-09.md"
  },
  {
    "id": "question.graves-trab-diagnostic-support.v4",
    "conceptId": "concept.graves.trab-diagnostic-support",
    "contentVersion": "review.owner-row-061.graves-trab-diagnostic-support.2026-09-09.1",
    "patientPresentationVariantId": "presentation.graves-trab-diagnostic-support.v4",
    "patientPresentation": "{patientName} returns to clinic to discuss\npalpitations and unintentional weight loss. Outside results have already shown\nlow TSH and high free T4, so thyrotoxicosis is established while its cause\nremains under evaluation. Supplemental results are available for review today.",
    "stem": "Which supplemental result most specifically supports Graves\ndisease as the cause in this patient?",
    "choices": [
      "A high total T3 result",
      "A low TSH result",
      "A positive TRAb result",
      "A high free T4 result"
    ],
    "correctChoiceIndex": 2,
    "explanation": "TSH, T4, and T3 results describe thyroid function. A positive\nTRAb result supplies antibody evidence that supports a Graves etiology in the\nappropriate clinical context.",
    "supportingEvidenceClaimIds": [
      "claim.graves-trab-diagnostic-support.function-versus-cause",
      "claim.graves-trab-diagnostic-support.positive-trab-supports-etiology",
      "claim.graves-trab-diagnostic-support.biochemical-thyrotoxicosis-context",
      "claim.graves-trab-diagnostic-support.symptom-goiter-context"
    ],
    "profileSpecs": [
      {
        "ageYears": 47,
        "sexLabel": "Female"
      },
      {
        "ageYears": 51,
        "sexLabel": "Female"
      },
      {
        "ageYears": 48,
        "sexLabel": "Male"
      },
      {
        "ageYears": 52,
        "sexLabel": "Male"
      }
    ],
    "frozenSnapshotPath": "docs/clinical-workbench/workthroughs/owner-row-061-graves-trab-diagnostic-support-v1.md",
    "frozenSnapshotSha256": "5003e0445fbf753d560b40ab16d2bbc8c6b754ea0bdf668a9c600950bc89e609",
    "originalClinicianReceipt": "docs/clinical-workbench/approvals/owner-row-061-graves-trab-diagnostic-support-2026-09-09.md"
  },
  {
    "id": "question.graves-rai-appropriate-candidate.v1",
    "conceptId": "concept.graves.rai-appropriate-candidate",
    "contentVersion": "review.owner-row-061.graves-rai-appropriate-candidate.2026-09-09.1",
    "patientPresentationVariantId": "presentation.graves-rai-appropriate-candidate.v1",
    "patientPresentation": "{patientName} returns because palpitations and heat\nintolerance recurred after withdrawal of an antithyroid drug. Her endocrinology\nrecord documents established Graves disease and confirms recurrent\nhyperthyroidism after withdrawal. She is stable in clinic; the chart explicitly\nrecords that she is not pregnant or breastfeeding and has no active thyroid eye\ndisease. After discussing the available treatments, she asks for a definitive\nnonsurgical option.",
    "stem": "Which counseling option best fits this patient's stated goal?",
    "choices": [
      "Restart antithyroid-drug treatment",
      "Discuss RAI evaluation and referral",
      "Arrange thyroidectomy consultation",
      "Use beta-blocking medication for symptom control only"
    ],
    "correctChoiceIndex": 1,
    "explanation": "Confirmed recurrence after antithyroid-drug withdrawal is a\nsetting in which RAI evaluation is reasonable to discuss. RAI fits {patientName}'s goal\nbecause it is a nonsurgical treatment intended to destroy overactive thyroid\ntissue. This does not promise freedom from later medication. Thyroidectomy and\nantithyroid-drug treatment remain valid choices when they better fit a patient's\nclinical circumstances and preferences; beta-blocking medication controls\nsymptoms without lowering thyroid-hormone production.",
    "supportingEvidenceClaimIds": [
      "claim.graves-rai-appropriate-candidate.recurrence-after-atd-withdrawal",
      "claim.graves-rai-appropriate-candidate.preference-sensitive-options",
      "claim.graves-rai-appropriate-candidate.rai-treatment-role",
      "claim.graves-rai-appropriate-candidate.graves-context",
      "claim.graves-rai-appropriate-candidate.eligibility-context",
      "claim.graves-rai-appropriate-candidate.specialist-counseling-context"
    ],
    "profileSpecs": [
      {
        "ageYears": 28,
        "sexLabel": "Female"
      },
      {
        "ageYears": 32,
        "sexLabel": "Female"
      }
    ],
    "frozenSnapshotPath": "docs/clinical-workbench/workthroughs/owner-row-061-graves-rai-appropriate-candidate-v1.md",
    "frozenSnapshotSha256": "2f14cea6b47d72825f8ca48ede601026469e1a149d2e04b87a1c4c069f478702",
    "originalClinicianReceipt": "docs/clinical-workbench/approvals/owner-row-061-graves-rai-appropriate-candidate-2026-09-09.md"
  },
  {
    "id": "question.graves-rai-appropriate-candidate.v2",
    "conceptId": "concept.graves.rai-appropriate-candidate",
    "contentVersion": "review.owner-row-061.graves-rai-appropriate-candidate.2026-09-09.1",
    "patientPresentationVariantId": "presentation.graves-rai-appropriate-candidate.v2",
    "patientPresentation": "{patientName} returns because palpitations and heat\nintolerance came back after withdrawal of an antithyroid drug. His chart\ndocuments established Graves disease, including a prior positive TRAb result\nand diffuse thyroid enlargement, and the endocrinology record confirms\nrecurrent hyperthyroidism after withdrawal. He is stable today and asks whether\nRAI evaluation is reasonable.",
    "stem": "Which feature of this patient's record most strongly supports\nconsidering RAI evaluation?",
    "choices": [
      "Initial report of palpitations at diagnosis",
      "Prior positive TRAb result in the chart",
      "Recurrent hyperthyroidism after drug withdrawal",
      "Diffuse thyroid enlargement on examination"
    ],
    "correctChoiceIndex": 2,
    "explanation": "The confirmed recurrence after antithyroid-drug withdrawal is\nthe record feature that directly supports considering RAI evaluation. The prior\nTRAb result and diffuse enlargement support the Graves diagnosis, while the\ninitial palpitation history describes hormone excess; those findings do not by\nthemselves establish the same treatment-selection setting.",
    "supportingEvidenceClaimIds": [
      "claim.graves-rai-appropriate-candidate.recurrence-after-atd-withdrawal",
      "claim.graves-rai-appropriate-candidate.preference-sensitive-options",
      "claim.graves-rai-appropriate-candidate.graves-context"
    ],
    "profileSpecs": [
      {
        "ageYears": 35,
        "sexLabel": "Male"
      },
      {
        "ageYears": 39,
        "sexLabel": "Male"
      }
    ],
    "frozenSnapshotPath": "docs/clinical-workbench/workthroughs/owner-row-061-graves-rai-appropriate-candidate-v1.md",
    "frozenSnapshotSha256": "2f14cea6b47d72825f8ca48ede601026469e1a149d2e04b87a1c4c069f478702",
    "originalClinicianReceipt": "docs/clinical-workbench/approvals/owner-row-061-graves-rai-appropriate-candidate-2026-09-09.md"
  },
  {
    "id": "question.graves-rai-appropriate-candidate.v3",
    "conceptId": "concept.graves.rai-appropriate-candidate",
    "contentVersion": "review.owner-row-061.graves-rai-appropriate-candidate.2026-09-09.1",
    "patientPresentationVariantId": "presentation.graves-rai-appropriate-candidate.v3",
    "patientPresentation": "{patientName} attends follow-up for established Graves\ndisease because palpitations and heat intolerance returned after withdrawal of\nan antithyroid drug. She is stable and asks about RAI if the outside records\nconfirm that overt hyperthyroidism returned after a documented remission. The\nclinician is reviewing her follow-up course after withdrawal before counseling\nher about treatment options.",
    "stem": "Which follow-up course in this patient's records best supports\ndiscussing RAI as a definitive option?",
    "choices": [
      "Thyroid function remained normal after medication withdrawal",
      "Overt hyperthyroidism returned after a documented remission",
      "Symptoms returned while thyroid function remained normal",
      "Thyroid hormone levels remained low after medication withdrawal"
    ],
    "correctChoiceIndex": 1,
    "explanation": "Confirmed recurrence of overt Graves hyperthyroidism after\nantithyroid-drug withdrawal is a setting in which RAI may be considered as a\ndefinitive option. Normal thyroid function, symptoms without biochemical\nrecurrence, or persistently low thyroid hormone levels do not establish that\nrecurrent hyperthyroid setting.",
    "supportingEvidenceClaimIds": [
      "claim.graves-rai-appropriate-candidate.recurrence-after-atd-withdrawal",
      "claim.graves-rai-appropriate-candidate.preference-sensitive-options",
      "claim.graves-rai-appropriate-candidate.graves-context",
      "claim.graves-rai-appropriate-candidate.rai-treatment-role"
    ],
    "profileSpecs": [
      {
        "ageYears": 41,
        "sexLabel": "Female"
      },
      {
        "ageYears": 45,
        "sexLabel": "Female"
      }
    ],
    "frozenSnapshotPath": "docs/clinical-workbench/workthroughs/owner-row-061-graves-rai-appropriate-candidate-v1.md",
    "frozenSnapshotSha256": "2f14cea6b47d72825f8ca48ede601026469e1a149d2e04b87a1c4c069f478702",
    "originalClinicianReceipt": "docs/clinical-workbench/approvals/owner-row-061-graves-rai-appropriate-candidate-2026-09-09.md"
  },
  {
    "id": "question.graves-rai-appropriate-candidate.v4",
    "conceptId": "concept.graves.rai-appropriate-candidate",
    "contentVersion": "review.owner-row-061.graves-rai-appropriate-candidate.2026-09-09.1",
    "patientPresentationVariantId": "presentation.graves-rai-appropriate-candidate.v4",
    "patientPresentation": "{patientName} returns because palpitations and heat\nintolerance recurred after withdrawal of an antithyroid drug. His chart\ndocuments established Graves disease, and the endocrinology record confirms\nrecurrent hyperthyroidism after withdrawal. He is stable in clinic and asks\nwhether RAI is compulsory because antithyroid-drug treatment and surgery were\nalso discussed.",
    "stem": "What is the appropriate role of RAI in this patient's counseling?",
    "choices": [
      "RAI is required whenever hyperthyroidism recurs",
      "RAI is excluded after prior antithyroid-drug treatment",
      "RAI is reserved for recurrence after thyroid surgery",
      "RAI can be weighed with antithyroid drugs and surgery"
    ],
    "correctChoiceIndex": 3,
    "explanation": "RAI is a reasonable option to discuss after confirmed recurrent\nGraves hyperthyroidism following antithyroid-drug withdrawal. It is not\ncompulsory after every recurrence, excluded because of prior drug treatment, or\nreserved until after surgery. The choice among RAI, antithyroid-drug treatment,\nand surgery depends on clinical circumstances and the patient's preferences.",
    "supportingEvidenceClaimIds": [
      "claim.graves-rai-appropriate-candidate.recurrence-after-atd-withdrawal",
      "claim.graves-rai-appropriate-candidate.preference-sensitive-options",
      "claim.graves-rai-appropriate-candidate.graves-context"
    ],
    "profileSpecs": [
      {
        "ageYears": 47,
        "sexLabel": "Male"
      },
      {
        "ageYears": 51,
        "sexLabel": "Male"
      }
    ],
    "frozenSnapshotPath": "docs/clinical-workbench/workthroughs/owner-row-061-graves-rai-appropriate-candidate-v1.md",
    "frozenSnapshotSha256": "2f14cea6b47d72825f8ca48ede601026469e1a149d2e04b87a1c4c069f478702",
    "originalClinicianReceipt": "docs/clinical-workbench/approvals/owner-row-061-graves-rai-appropriate-candidate-2026-09-09.md"
  },
  {
    "id": "question.graves-rai-pregnancy-contraindication.v1",
    "conceptId": "concept.graves.rai-pregnancy-contraindication",
    "contentVersion": "review.owner-row-061.graves-rai-pregnancy-contraindication.2026-09-09.1",
    "patientPresentationVariantId": "presentation.graves-rai-pregnancy-contraindication.v1",
    "patientPresentation": "{patientName} attends a Graves counseling visit after\nlearning that she is currently pregnant. She asks whether RAI could provide a\ndefinitive treatment during this pregnancy.",
    "stem": "Which statement best describes RAI treatment for this patient?",
    "choices": [
      "It is acceptable only early in pregnancy",
      "It is acceptable only late in pregnancy",
      "It is contraindicated throughout pregnancy",
      "It is acceptable after obstetric referral"
    ],
    "correctChoiceIndex": 2,
    "explanation": "Current pregnancy contraindicates RAI treatment. This does\nnot prevent counseling or appropriate endocrine and obstetric assessment.",
    "supportingEvidenceClaimIds": [
      "claim.graves-rai-pregnancy-contraindication.pregnancy-treatment-contraindication",
      "claim.graves-rai-pregnancy-contraindication.continued-assessment-boundary"
    ],
    "profileSpecs": [
      {
        "ageYears": 28,
        "sexLabel": "Female"
      },
      {
        "ageYears": 32,
        "sexLabel": "Female"
      }
    ],
    "frozenSnapshotPath": "docs/clinical-workbench/workthroughs/owner-row-061-graves-rai-pregnancy-contraindication-v1.md",
    "frozenSnapshotSha256": "bddc991cd919e941536c67968d1a9814c677833691ddbb479c33ac01d0915945",
    "originalClinicianReceipt": "docs/clinical-workbench/approvals/owner-row-061-graves-rai-pregnancy-contraindication-2026-09-09.md"
  },
  {
    "id": "question.graves-rai-pregnancy-contraindication.v2",
    "conceptId": "concept.graves.rai-pregnancy-contraindication",
    "contentVersion": "review.owner-row-061.graves-rai-pregnancy-contraindication.2026-09-09.1",
    "patientPresentationVariantId": "presentation.graves-rai-pregnancy-contraindication.v2",
    "patientPresentation": "{patientName} returns for RAI counseling after a\nGraves recurrence. Updated records are arriving before treatment selection; she\nhas tremor and palpitations but remains stable in clinic.",
    "stem": "Which new finding would make RAI treatment contraindicated now?",
    "choices": [
      "Confirmed current pregnancy",
      "Persistent hand tremor",
      "Positive TRAb result",
      "Diffuse thyroid enlargement"
    ],
    "correctChoiceIndex": 0,
    "explanation": "Confirmed pregnancy changes the treatment-safety boundary for\nRAI. The other findings may describe Graves disease or its activity but do not\nstate this pregnancy contraindication.",
    "supportingEvidenceClaimIds": [
      "claim.graves-rai-pregnancy-contraindication.pregnancy-treatment-contraindication",
      "claim.graves-rai-pregnancy-contraindication.graves-context-findings"
    ],
    "profileSpecs": [
      {
        "ageYears": 30,
        "sexLabel": "Female"
      },
      {
        "ageYears": 34,
        "sexLabel": "Female"
      }
    ],
    "frozenSnapshotPath": "docs/clinical-workbench/workthroughs/owner-row-061-graves-rai-pregnancy-contraindication-v1.md",
    "frozenSnapshotSha256": "bddc991cd919e941536c67968d1a9814c677833691ddbb479c33ac01d0915945",
    "originalClinicianReceipt": "docs/clinical-workbench/approvals/owner-row-061-graves-rai-pregnancy-contraindication-2026-09-09.md"
  },
  {
    "id": "question.graves-rai-pregnancy-contraindication.v3",
    "conceptId": "concept.graves.rai-pregnancy-contraindication",
    "contentVersion": "review.owner-row-061.graves-rai-pregnancy-contraindication.2026-09-09.1",
    "patientPresentationVariantId": "presentation.graves-rai-pregnancy-contraindication.v3",
    "patientPresentation": "{patientName}, who is currently pregnant, meets the\nclinic team to understand why RAI is excluded from her Graves treatment plan.\nShe asks what risk makes the treatment unsafe in pregnancy.",
    "stem": "Which effect best explains excluding RAI treatment for this\npatient?",
    "choices": [
      "It blocks fetal thyroid hormone receptors",
      "It causes fetal thyroid tissue damage",
      "It prevents maternal thyroid blood flow",
      "It prevents placental thyroid-hormone transfer"
    ],
    "correctChoiceIndex": 1,
    "explanation": "Radioiodine can cross the placenta and be taken up by the fetal\nthyroid, where it can damage thyroid tissue and cause permanent hypothyroidism.",
    "supportingEvidenceClaimIds": [
      "claim.graves-rai-pregnancy-contraindication.fetal-thyroid-harm-mechanism"
    ],
    "profileSpecs": [
      {
        "ageYears": 32,
        "sexLabel": "Female"
      },
      {
        "ageYears": 36,
        "sexLabel": "Female"
      }
    ],
    "frozenSnapshotPath": "docs/clinical-workbench/workthroughs/owner-row-061-graves-rai-pregnancy-contraindication-v1.md",
    "frozenSnapshotSha256": "bddc991cd919e941536c67968d1a9814c677833691ddbb479c33ac01d0915945",
    "originalClinicianReceipt": "docs/clinical-workbench/approvals/owner-row-061-graves-rai-pregnancy-contraindication-2026-09-09.md"
  },
  {
    "id": "question.graves-rai-pregnancy-contraindication.v4",
    "conceptId": "concept.graves.rai-pregnancy-contraindication",
    "contentVersion": "review.owner-row-061.graves-rai-pregnancy-contraindication.2026-09-09.1",
    "patientPresentationVariantId": "presentation.graves-rai-pregnancy-contraindication.v4",
    "patientPresentation": "{patientName} is currently pregnant and worried that\nexcluding RAI means no one can continue helping with her Graves disease. She\ncomes to clinic to discuss what care can continue during pregnancy.",
    "stem": "Which counseling conclusion best fits this patient's care now?",
    "choices": [
      "Defer thyroid assessment until the pregnancy has ended",
      "Reconsider RAI once the first trimester has ended",
      "Continue endocrine and obstetric care without RAI",
      "Proceed with RAI once thyroid hormone levels improve"
    ],
    "correctChoiceIndex": 2,
    "explanation": "RAI remains excluded during pregnancy, but endocrine and\nobstetric care can continue with care tailored to {patientName}.",
    "supportingEvidenceClaimIds": [
      "claim.graves-rai-pregnancy-contraindication.pregnancy-treatment-contraindication",
      "claim.graves-rai-pregnancy-contraindication.continued-assessment-boundary"
    ],
    "profileSpecs": [
      {
        "ageYears": 34,
        "sexLabel": "Female"
      },
      {
        "ageYears": 38,
        "sexLabel": "Female"
      }
    ],
    "frozenSnapshotPath": "docs/clinical-workbench/workthroughs/owner-row-061-graves-rai-pregnancy-contraindication-v1.md",
    "frozenSnapshotSha256": "bddc991cd919e941536c67968d1a9814c677833691ddbb479c33ac01d0915945",
    "originalClinicianReceipt": "docs/clinical-workbench/approvals/owner-row-061-graves-rai-pregnancy-contraindication-2026-09-09.md"
  },
  {
    "id": "question.graves-rai-lactation-contraindication.v1",
    "conceptId": "concept.graves.rai-lactation-contraindication",
    "contentVersion": "review.owner-row-061.graves-rai-lactation-contraindication.2026-09-09.1",
    "patientPresentationVariantId": "presentation.graves-rai-lactation-contraindication.v1",
    "patientPresentation": "{patientName} has established Graves disease and is\ncurrently breastfeeding her infant. At a stable outpatient counseling visit,\nshe asks whether therapeutic iodine-131 could be given now.",
    "stem": "Which statement best describes therapeutic iodine-131 for this\npatient now?",
    "choices": [
      "It is available while she is breastfeeding",
      "It is available after routine clinic counseling",
      "It is available after endocrine referral",
      "It is contraindicated while she is breastfeeding"
    ],
    "correctChoiceIndex": 3,
    "explanation": "Current breastfeeding contraindicates therapeutic iodine-131.\nThis does not prevent counseling, referral, or individualized planning.",
    "supportingEvidenceClaimIds": [
      "claim.graves-rai-lactation-contraindication.lactation-treatment-contraindication"
    ],
    "profileSpecs": [
      {
        "ageYears": 28,
        "sexLabel": "Female"
      },
      {
        "ageYears": 32,
        "sexLabel": "Female"
      }
    ],
    "frozenSnapshotPath": "docs/clinical-workbench/workthroughs/owner-row-061-graves-rai-lactation-contraindication-v1.md",
    "frozenSnapshotSha256": "b41274c14fdf3b1b3b5fc222a532da4ba3b3b5f5218c7dfd574d37e560bc23cf",
    "originalClinicianReceipt": "docs/clinical-workbench/approvals/owner-row-061-graves-rai-lactation-contraindication-2026-09-09.md"
  },
  {
    "id": "question.graves-rai-lactation-contraindication.v2",
    "conceptId": "concept.graves.rai-lactation-contraindication",
    "contentVersion": "review.owner-row-061.graves-rai-lactation-contraindication.2026-09-09.1",
    "patientPresentationVariantId": "presentation.graves-rai-lactation-contraindication.v2",
    "patientPresentation": "{patientName} returns to discuss treatment options for\nestablished Graves disease because her symptoms are interfering with daily\nactivities. She is stable in clinic, and the team is reviewing updated records\nbefore deciding whether therapeutic iodine-131 is suitable.",
    "stem": "Which finding in this patient's updated record would make\ntherapeutic iodine-131 contraindicated now?",
    "choices": [
      "Current breastfeeding",
      "Persistent hand tremor",
      "Positive TRAb result",
      "Diffuse thyroid enlargement"
    ],
    "correctChoiceIndex": 0,
    "explanation": "Current breastfeeding changes the treatment-safety boundary\nfor therapeutic iodine-131. The other findings provide Graves context but do\nnot state this lactation contraindication.",
    "supportingEvidenceClaimIds": [
      "claim.graves-rai-lactation-contraindication.lactation-treatment-contraindication",
      "claim.graves-rai-lactation-contraindication.graves-context-findings"
    ],
    "profileSpecs": [
      {
        "ageYears": 30,
        "sexLabel": "Female"
      },
      {
        "ageYears": 34,
        "sexLabel": "Female"
      }
    ],
    "frozenSnapshotPath": "docs/clinical-workbench/workthroughs/owner-row-061-graves-rai-lactation-contraindication-v1.md",
    "frozenSnapshotSha256": "b41274c14fdf3b1b3b5fc222a532da4ba3b3b5f5218c7dfd574d37e560bc23cf",
    "originalClinicianReceipt": "docs/clinical-workbench/approvals/owner-row-061-graves-rai-lactation-contraindication-2026-09-09.md"
  },
  {
    "id": "question.graves-rai-lactation-contraindication.v3",
    "conceptId": "concept.graves.rai-lactation-contraindication",
    "contentVersion": "review.owner-row-061.graves-rai-lactation-contraindication.2026-09-09.1",
    "patientPresentationVariantId": "presentation.graves-rai-lactation-contraindication.v3",
    "patientPresentation": "{patientName} is currently breastfeeding and attends\na Graves counseling visit to understand why therapeutic iodine-131 is unsafe\nfor her infant. She asks what risk leads the team to exclude that treatment.",
    "stem": "Which effect best explains excluding therapeutic iodine-131 for\nthis patient?",
    "choices": [
      "It stays in maternal tissue and is absent from milk",
      "It passes into milk and reaches the infant’s thyroid",
      "It reaches milk but cannot be absorbed by the infant",
      "It reaches the infant but is excluded from thyroid tissue"
    ],
    "correctChoiceIndex": 1,
    "explanation": "Therapeutic iodine-131 can enter breast milk and expose the\nnursing infant's thyroid to radioiodine.",
    "supportingEvidenceClaimIds": [
      "claim.graves-rai-lactation-contraindication.milk-infant-thyroid-exposure"
    ],
    "profileSpecs": [
      {
        "ageYears": 32,
        "sexLabel": "Female"
      },
      {
        "ageYears": 36,
        "sexLabel": "Female"
      }
    ],
    "frozenSnapshotPath": "docs/clinical-workbench/workthroughs/owner-row-061-graves-rai-lactation-contraindication-v1.md",
    "frozenSnapshotSha256": "b41274c14fdf3b1b3b5fc222a532da4ba3b3b5f5218c7dfd574d37e560bc23cf",
    "originalClinicianReceipt": "docs/clinical-workbench/approvals/owner-row-061-graves-rai-lactation-contraindication-2026-09-09.md"
  },
  {
    "id": "question.graves-rai-lactation-contraindication.v4",
    "conceptId": "concept.graves.rai-lactation-contraindication",
    "contentVersion": "review.owner-row-061.graves-rai-lactation-contraindication.2026-09-09.1",
    "patientPresentationVariantId": "presentation.graves-rai-lactation-contraindication.v4",
    "patientPresentation": "{patientName} is currently breastfeeding and is\nconsidering therapeutic iodine-131 for Graves disease. Before any treatment is\nscheduled, she asks whether a brief pump-and-discard pause would let her resume\nbreastfeeding this child afterward.",
    "stem": "If she chooses therapeutic iodine-131, which counseling\nrecommendation best fits this patient's plan?",
    "choices": [
      "Resume breastfeeding this child after a brief interruption",
      "Do not resume breastfeeding this child after treatment",
      "Resume breastfeeding this child when thyroid symptoms improve",
      "Resume breastfeeding this child if feeds are less frequent"
    ],
    "correctChoiceIndex": 1,
    "explanation": "Breastfeeding cessation must be planned before therapeutic\niodine-131. Standard guidance advises against resuming breastfeeding the\ncurrent child after treatment.",
    "supportingEvidenceClaimIds": [
      "claim.graves-rai-lactation-contraindication.pre-treatment-feeding-boundary",
      "claim.graves-rai-lactation-contraindication.same-child-no-resumption-recommendation"
    ],
    "profileSpecs": [
      {
        "ageYears": 34,
        "sexLabel": "Female"
      },
      {
        "ageYears": 38,
        "sexLabel": "Female"
      }
    ],
    "frozenSnapshotPath": "docs/clinical-workbench/workthroughs/owner-row-061-graves-rai-lactation-contraindication-v1.md",
    "frozenSnapshotSha256": "b41274c14fdf3b1b3b5fc222a532da4ba3b3b5f5218c7dfd574d37e560bc23cf",
    "originalClinicianReceipt": "docs/clinical-workbench/approvals/owner-row-061-graves-rai-lactation-contraindication-2026-09-09.md"
  },
  {
    "id": "question.graves-rai-active-ted-avoidance.v1",
    "conceptId": "concept.graves.rai-active-ted-avoidance",
    "contentVersion": "review.owner-row-061.graves-rai-active-ted-avoidance.2026-09-09.1",
    "patientPresentationVariantId": "presentation.graves-rai-active-ted-avoidance.v1",
    "patientPresentation": "{patientName} has established Graves disease and asks\nabout therapeutic iodine-131 at a stable clinic visit. His ophthalmology note\ndocuments active moderate-to-severe thyroid eye disease (TED).",
    "stem": "Which counseling conclusion best fits this patient's treatment discussion?",
    "choices": [
      "Favor iodine-131 to treat the thyroid and eye disease together",
      "Avoid iodine-131 because it may aggravate the eye disease",
      "Favor iodine-131 because eye disease does not affect treatment selection",
      "Avoid iodine-131 because eye disease prevents uptake by the thyroid"
    ],
    "correctChoiceIndex": 1,
    "explanation": "Therapeutic iodine-131 can worsen existing TED. In ordinary\ncounseling, active moderate-to-severe TED is a reason to generally avoid it.",
    "supportingEvidenceClaimIds": [
      "claim.graves-rai-active-ted-avoidance.general-avoidance",
      "claim.graves-rai-active-ted-avoidance.worsening-risk"
    ],
    "profileSpecs": [
      {
        "ageYears": 29,
        "sexLabel": "Male"
      },
      {
        "ageYears": 33,
        "sexLabel": "Male"
      }
    ],
    "frozenSnapshotPath": "docs/clinical-workbench/workthroughs/owner-row-061-graves-rai-active-ted-avoidance-v1.md",
    "frozenSnapshotSha256": "dbc25a353744766aa912aa5369c3816c023baf1640446317aaab8f8479a01435",
    "originalClinicianReceipt": "docs/clinical-workbench/approvals/owner-row-061-graves-rai-active-ted-avoidance-2026-09-09.md"
  },
  {
    "id": "question.graves-rai-active-ted-avoidance.v2",
    "conceptId": "concept.graves.rai-active-ted-avoidance",
    "contentVersion": "review.owner-row-061.graves-rai-active-ted-avoidance.2026-09-09.1",
    "patientPresentationVariantId": "presentation.graves-rai-active-ted-avoidance.v2",
    "patientPresentation": "{patientName} returns to review Graves treatment options.\nShe is stable in clinic, and the team is reviewing updated records before deciding\nwhether therapeutic iodine-131 is suitable.",
    "stem": "Which finding in this patient's updated records would most strongly support avoiding therapeutic iodine-131?",
    "choices": [
      "Diffuse thyroid uptake on the diagnostic scan",
      "Heat intolerance accompanied by a fine hand tremor",
      "Active moderate-to-severe thyroid eye disease",
      "Mild diffuse thyroid enlargement without compression"
    ],
    "correctChoiceIndex": 2,
    "explanation": "Active moderate-to-severe thyroid eye disease supports generally avoiding therapeutic iodine-131 because treatment may worsen the eye disease. The other findings provide Graves context.",
    "supportingEvidenceClaimIds": [
      "claim.graves-rai-active-ted-avoidance.general-avoidance",
      "claim.graves-rai-active-ted-avoidance.worsening-risk",
      "claim.graves-rai-active-ted-avoidance.graves-background-findings"
    ],
    "profileSpecs": [
      {
        "ageYears": 35,
        "sexLabel": "Female"
      },
      {
        "ageYears": 39,
        "sexLabel": "Female"
      }
    ],
    "frozenSnapshotPath": "docs/clinical-workbench/workthroughs/owner-row-061-graves-rai-active-ted-avoidance-v1.md",
    "frozenSnapshotSha256": "dbc25a353744766aa912aa5369c3816c023baf1640446317aaab8f8479a01435",
    "originalClinicianReceipt": "docs/clinical-workbench/approvals/owner-row-061-graves-rai-active-ted-avoidance-2026-09-09.md"
  },
  {
    "id": "question.graves-rai-active-ted-avoidance.v3",
    "conceptId": "concept.graves.rai-active-ted-avoidance",
    "contentVersion": "review.owner-row-061.graves-rai-active-ted-avoidance.2026-09-09.1",
    "patientPresentationVariantId": "presentation.graves-rai-active-ted-avoidance.v3",
    "patientPresentation": "{patientName} has Graves disease and an ophthalmology assessment documenting active moderate-to-severe thyroid eye disease. During treatment counseling, she asks what therapeutic iodine-131 could mean for her eye symptoms.",
    "stem": "Which statement best describes the possible effect on this patient's eye disease?",
    "choices": [
      "It improves eye disease before affecting thyroid hormone levels",
      "It resolves eye disease once thyroid hormone levels normalize",
      "It leaves existing eye disease unaffected by treatment",
      "It can worsen the thyroid eye disease already present"
    ],
    "correctChoiceIndex": 3,
    "explanation": "Therapeutic iodine-131 may worsen existing TED, supporting\ngeneral avoidance in this documented active moderate-to-severe setting.",
    "supportingEvidenceClaimIds": [
      "claim.graves-rai-active-ted-avoidance.general-avoidance",
      "claim.graves-rai-active-ted-avoidance.worsening-risk",
      "claim.graves-rai-active-ted-avoidance.eye-course-thyroid-function-distinction"
    ],
    "profileSpecs": [
      {
        "ageYears": 41,
        "sexLabel": "Female"
      },
      {
        "ageYears": 45,
        "sexLabel": "Female"
      }
    ],
    "frozenSnapshotPath": "docs/clinical-workbench/workthroughs/owner-row-061-graves-rai-active-ted-avoidance-v1.md",
    "frozenSnapshotSha256": "dbc25a353744766aa912aa5369c3816c023baf1640446317aaab8f8479a01435",
    "originalClinicianReceipt": "docs/clinical-workbench/approvals/owner-row-061-graves-rai-active-ted-avoidance-2026-09-09.md"
  },
  {
    "id": "question.graves-rai-active-ted-avoidance.v4",
    "conceptId": "concept.graves.rai-active-ted-avoidance",
    "contentVersion": "review.owner-row-061.graves-rai-active-ted-avoidance.2026-09-09.1",
    "patientPresentationVariantId": "presentation.graves-rai-active-ted-avoidance.v4",
    "patientPresentation": "{patientName} returns for Graves follow-up. His palpitations have improved, but ophthalmology still documents active moderate-to-severe thyroid eye disease. He asks whether the improvement removes the concern about therapeutic iodine-131.",
    "stem": "Which conclusion best fits this patient's current counseling?",
    "choices": [
      "Proceed with iodine-131 because improved palpitations indicate inactive eye disease",
      "Proceed with iodine-131 because thyroid symptoms determine eye-disease activity",
      "Continue to avoid iodine-131 because active moderate-to-severe eye disease persists",
      "Continue to avoid iodine-131 because improved palpitations indicate worsening eye disease"
    ],
    "correctChoiceIndex": 2,
    "explanation": "Improved thyroid symptoms do not by themselves establish that\nthyroid eye disease is inactive. Documented active moderate-to-severe thyroid eye disease still supports general avoidance.",
    "supportingEvidenceClaimIds": [
      "claim.graves-rai-active-ted-avoidance.general-avoidance",
      "claim.graves-rai-active-ted-avoidance.eye-course-thyroid-function-distinction",
      "claim.graves-rai-active-ted-avoidance.graves-background-findings"
    ],
    "profileSpecs": [
      {
        "ageYears": 47,
        "sexLabel": "Male"
      },
      {
        "ageYears": 51,
        "sexLabel": "Male"
      }
    ],
    "frozenSnapshotPath": "docs/clinical-workbench/workthroughs/owner-row-061-graves-rai-active-ted-avoidance-v1.md",
    "frozenSnapshotSha256": "dbc25a353744766aa912aa5369c3816c023baf1640446317aaab8f8479a01435",
    "originalClinicianReceipt": "docs/clinical-workbench/approvals/owner-row-061-graves-rai-active-ted-avoidance-2026-09-09.md"
  }
] as const;

export const GRAVES_CLAIMS = [
  {
    "id": "claim.graves-pattern-recognition.classic-clinical-constellation",
    "statement": "Thyroid-hormone-excess symptoms with diffuse thyroid enlargement and bilateral\nproptosis form a clinical pattern that supports Graves disease.",
    "sourceIds": [
      "source.niddk.graves-disease.2021",
      "source.ata.graves-disease.undated"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": "a supporting pattern, not a stand-alone diagnostic\n  rule; Graves disease may occur without proptosis.",
    "applicablePopulation": "Adults undergoing clinic evaluation for a clinical pattern compatible with Graves disease.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.graves-pattern-recognition.thyrotoxicosis-symptoms-nonspecific",
    "statement": "Palpitations, heat intolerance, tremor, sweating, unintentional weight loss,\nand muscle weakness can occur with thyroid-hormone excess but do not alone\nestablish its cause.",
    "sourceIds": [
      "source.niddk.hyperthyroidism.2021"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "the variants use a fuller clinical pattern and do not\n  teach diagnosis from symptoms alone.",
    "applicablePopulation": "Adults undergoing clinic evaluation for a clinical pattern compatible with Graves disease.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.graves-pattern-recognition.pretibial-dermopathy-association",
    "statement": "Pretibial dermopathy, such as thickened raised plaques over the anterior shins,\nis an associated Graves finding that can add support to an otherwise compatible\nclinical pattern.",
    "sourceIds": [
      "source.niddk.graves-disease.2021",
      "source.ata.graves-disease.undated"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": "an associated finding, not a required feature or\n  independent diagnostic rule.",
    "applicablePopulation": "Adults undergoing clinic evaluation for a clinical pattern compatible with Graves disease.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.graves-pattern-recognition.nodular-thyroid-disease-boundary",
    "statement": "Overactive thyroid nodules can cause thyroid-hormone excess, so hormone-excess\nsymptoms do not by themselves distinguish Graves disease from nodular disease.",
    "sourceIds": [
      "source.niddk.hyperthyroidism.2021"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "a competing cause of thyroid-hormone excess; this\n  draft does not teach imaging, laboratory testing, or management.",
    "applicablePopulation": "Adults undergoing clinic evaluation for a clinical pattern compatible with Graves disease.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.graves-pattern-recognition.painful-subacute-thyroiditis-boundary",
    "statement": "Subacute thyroiditis can present with a painful enlarged thyroid and is a\ncompeting clinical presentation when thyroid-hormone excess is documented.",
    "sourceIds": [
      "source.niddk.hyperthyroidism.2021"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "this draft identifies a competing presentation only;\n  it does not teach thyroiditis testing or treatment.",
    "applicablePopulation": "Adults undergoing clinic evaluation for a clinical pattern compatible with Graves disease.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.graves-trab-diagnostic-support.positive-trab-supports-etiology",
    "statement": "In a patient with compatible clinical findings and biochemical thyrotoxicosis,\na positive TRAb result supports Graves disease as the etiology.",
    "sourceIds": [
      "source.ata.graves-disease.undated",
      "source.niddk.graves-disease.2021"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "supportive in clinical context, not a stand-alone\n  replacement for the complete evaluation.",
    "applicablePopulation": "Adults with compatible clinical findings and biochemical thyrotoxicosis undergoing etiologic evaluation.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.graves-trab-diagnostic-support.negative-trab-not-full-exclusion",
    "statement": "A negative TRAb result does not fully exclude Graves disease when the clinical\nand biochemical context remains compatible.",
    "sourceIds": [
      "source.ata.graves-disease.undated"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "low",
    "limitation": "the result changes diagnostic support but does not\n  independently resolve the cause or prescribe a next imaging step.",
    "applicablePopulation": "Adults with compatible clinical findings and biochemical thyrotoxicosis undergoing etiologic evaluation.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.graves-trab-diagnostic-support.function-versus-cause",
    "statement": "TSH, T4, and T3 results describe thyroid function, whereas TRAb supplies\netiologic antibody evidence relevant to Graves disease.",
    "sourceIds": [
      "source.ata.thyroid-function-tests.undated",
      "source.niddk.thyroid-tests.2017"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "this draft uses qualitative result labels only and does\n  not teach thresholds, assay selection beyond TRAb, or broad antibody panels.",
    "applicablePopulation": "Adults with compatible clinical findings and biochemical thyrotoxicosis undergoing etiologic evaluation.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.graves-trab-diagnostic-support.biochemical-thyrotoxicosis-context",
    "statement": "A low TSH result with a high free T4 result is a biochemical pattern of thyroid\nhormone excess; those functional results do not by themselves identify Graves\ndisease as the cause.",
    "sourceIds": [
      "source.ata.thyroid-function-tests.undated"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": "qualitative functional context only; this draft does\n  not teach thresholds, severity classification, or a treatment decision.",
    "applicablePopulation": "Adults with compatible clinical findings and biochemical thyrotoxicosis undergoing etiologic evaluation.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.graves-trab-diagnostic-support.symptom-goiter-context",
    "statement": "Palpitations, heat intolerance, unintentional weight loss, and diffuse thyroid\nenlargement can accompany Graves disease; these findings alone do not establish\nthe cause of thyrotoxicosis.",
    "sourceIds": [
      "source.ata.graves-disease.undated",
      "source.niddk.graves-disease.2021"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": "supporting presentation context only; a full clinical\n  evaluation remains necessary.",
    "applicablePopulation": "Adults with compatible clinical findings and biochemical thyrotoxicosis undergoing etiologic evaluation.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.graves-rai-appropriate-candidate.recurrence-after-atd-withdrawal",
    "statement": "For Graves disease, recurrent hyperthyroidism after antithyroid-drug withdrawal\nis a setting in which RAI therapy may be considered.",
    "sourceIds": [
      "source.eanm.benign-thyroid-rai-guideline.2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "a guideline-supported indication for consideration, not\n  a mandate or a universal preferred treatment for every recurrence.",
    "applicablePopulation": "Stable nonpregnant, nonbreastfeeding adults with established Graves disease and no active thyroid eye disease who are considering treatment options.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.graves-rai-appropriate-candidate.preference-sensitive-options",
    "statement": "Antithyroid drugs, RAI, and surgery are treatment options for Graves disease;\ntheir selection should incorporate the patient’s circumstances and preferences.",
    "sourceIds": [
      "source.ata.graves-disease.undated",
      "source.niddk.graves-disease.2021"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "this draft presents a bounded counseling choice and\n  does not establish a universal treatment hierarchy.",
    "applicablePopulation": "Stable nonpregnant, nonbreastfeeding adults with established Graves disease and no active thyroid eye disease who are considering treatment options.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.graves-rai-appropriate-candidate.rai-treatment-role",
    "statement": "RAI is a nonsurgical, disease-directed treatment that destroys overactive\nthyroid cells. Antithyroid drugs reduce thyroid-hormone production, while\nbeta-blocking medicines can control symptoms without reducing hormone\nproduction.",
    "sourceIds": [
      "source.eanm.benign-thyroid-rai-guideline.2023",
      "source.niddk.graves-disease.2021"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "distinguishes the broad roles of these options for the\n  counseling question; it does not specify a dose, preparation regimen,\n  treatment timeline, or universal treatment preference.",
    "applicablePopulation": "Stable nonpregnant, nonbreastfeeding adults with established Graves disease and no active thyroid eye disease who are considering treatment options.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.graves-rai-appropriate-candidate.graves-context",
    "statement": "Palpitations and heat intolerance are compatible with Graves hyperthyroidism;\na diffuse goiter and a positive TRAb result can add support for Graves disease\nin the appropriate clinical context.",
    "sourceIds": [
      "source.ata.graves-disease.undated",
      "source.niddk.graves-disease.2021"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "these features support the established diagnosis in\n  the patient presentations but do not independently select RAI treatment.",
    "applicablePopulation": "Stable nonpregnant, nonbreastfeeding adults with established Graves disease and no active thyroid eye disease who are considering treatment options.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.graves-rai-appropriate-candidate.eligibility-context",
    "statement": "RAI evaluation requires individualized selection. Pregnancy and current\nbreastfeeding are contraindications to RAI treatment, while active thyroid eye\ndisease requires individualized assessment.",
    "sourceIds": [
      "source.eanm.benign-thyroid-rai-guideline.2023"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "these are background eligibility facts for this set;\n  they do not replace the separate pregnancy, lactation, or thyroid-eye-disease\n  concepts and do not create a self-directed treatment algorithm.",
    "applicablePopulation": "Stable nonpregnant, nonbreastfeeding adults with established Graves disease and no active thyroid eye disease who are considering treatment options.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.graves-rai-appropriate-candidate.specialist-counseling-context",
    "statement": "RAI evaluation includes specialist counseling, informed consent, and practical\nprecaution instructions before treatment.",
    "sourceIds": [
      "source.eanm.benign-thyroid-rai-guideline.2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "a clinical counseling claim only; it does not determine\n  where RAI is delivered or teach jurisdiction-specific requirements. The\n  game's clinic-only counseling and referral boundary is release metadata, not\n  a medical claim.",
    "applicablePopulation": "Stable nonpregnant, nonbreastfeeding adults with established Graves disease and no active thyroid eye disease who are considering treatment options.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.graves-rai-pregnancy-contraindication.pregnancy-treatment-contraindication",
    "statement": "RAI treatment is contraindicated throughout pregnancy for a patient with Graves\ndisease.",
    "sourceIds": [
      "source.eanm.benign-thyroid-rai-guideline.2023",
      "source.niddk.thyroid-disease-pregnancy.2017"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "applies to RAI treatment; it does not prohibit clinical\n  counseling, referral, or other individualized pregnancy care.",
    "applicablePopulation": "Pregnant adults with Graves disease being counseled about therapeutic iodine-131.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.graves-rai-pregnancy-contraindication.fetal-thyroid-harm-mechanism",
    "statement": "Radioiodine can cross the placenta, be taken up by the fetal thyroid, and harm\nor destroy fetal thyroid tissue, causing permanent hypothyroidism.",
    "sourceIds": [
      "source.ata.hyperthyroidism-in-pregnancy.undated"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "explains the treatment exclusion; this draft does not\n  teach timing, dose, fetal testing, or pregnancy-loss counseling.",
    "applicablePopulation": "Pregnant adults with Graves disease being counseled about therapeutic iodine-131.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.graves-rai-pregnancy-contraindication.continued-assessment-boundary",
    "statement": "Avoiding RAI during pregnancy does not end care: endocrine and obstetric\nassessment and individually tailored monitoring can continue.",
    "sourceIds": [
      "source.niddk.thyroid-disease-pregnancy.2017",
      "source.ata.hyperthyroidism-in-pregnancy.undated"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "no regimen, dose, surgery timing, or assertion that all\n  pregnant patients require medication is taught.",
    "applicablePopulation": "Pregnant adults with Graves disease being counseled about therapeutic iodine-131.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.graves-rai-pregnancy-contraindication.graves-context-findings",
    "statement": "Palpitations, tremor, diffuse thyroid enlargement, and a positive TRAb result\ncan provide clinical and diagnostic context supporting Graves disease.",
    "sourceIds": [
      "source.ata.graves-disease.undated"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "background context only; it is not a separate scored\n  recognition or antibody-interpretation concept in this packet.",
    "applicablePopulation": "Pregnant adults with Graves disease being counseled about therapeutic iodine-131.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.graves-rai-lactation-contraindication.lactation-treatment-contraindication",
    "statement": "Current breastfeeding contraindicates therapeutic iodine-131 treatment for a\npatient with Graves disease.",
    "sourceIds": [
      "source.eanm.benign-thyroid-rai-guideline.2023",
      "source.lactmed.sodium-iodide-i131.2026",
      "source.ata.radioactive-iodine.undated"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "applies to therapeutic iodine-131; it does not prohibit\n  counseling, referral, or individualized endocrine and pediatric guidance.",
    "applicablePopulation": "Adults currently breastfeeding who have Graves disease and are being counseled about therapeutic iodine-131.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.graves-rai-lactation-contraindication.milk-infant-thyroid-exposure",
    "statement": "Therapeutic iodine-131 can enter breast milk and expose the nursing infant's\nthyroid to radioiodine.",
    "sourceIds": [
      "source.lactmed.sodium-iodide-i131.2026",
      "source.ata.radioactive-iodine.undated"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "explains the lactation exclusion without teaching an\n  infant dose, radiation measurement, emergency response, or exposure protocol.",
    "applicablePopulation": "Adults currently breastfeeding who have Graves disease and are being counseled about therapeutic iodine-131.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.graves-rai-lactation-contraindication.pre-treatment-feeding-boundary",
    "statement": "For therapeutic iodine-131, breastfeeding cessation must be planned before\ntreatment.",
    "sourceIds": [
      "source.eanm.benign-thyroid-rai-guideline.2023",
      "source.lactmed.sodium-iodide-i131.2026",
      "source.ata.radioactive-iodine.undated"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "this is pre-treatment counseling, not an exposure\n  emergency. It supplies no interval, dose, or weaning protocol.",
    "applicablePopulation": "Adults currently breastfeeding who have Graves disease and are being counseled about therapeutic iodine-131.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.graves-rai-lactation-contraindication.same-child-no-resumption-recommendation",
    "statement": "After therapeutic iodine-131, standard guidance advises against resuming\nbreastfeeding the current child.",
    "sourceIds": [
      "source.lactmed.sodium-iodide-i131.2026",
      "source.ata.radioactive-iodine.undated"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "this recommendation does not claim a lifelong anatomic\n  inability to breastfeed, address a future child after a future pregnancy, or\n  supply a resumption interval, dose, or protocol.",
    "applicablePopulation": "Adults currently breastfeeding who have Graves disease and are being counseled about therapeutic iodine-131.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.graves-rai-lactation-contraindication.graves-context-findings",
    "statement": "Palpitations, tremor, diffuse thyroid enlargement, and a positive TRAb result\ncan provide clinical and diagnostic context supporting Graves disease.",
    "sourceIds": [
      "source.ata.graves-disease.undated"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "background context only; it is not a separate scored\n  recognition or antibody-interpretation concept in this packet.",
    "applicablePopulation": "Adults currently breastfeeding who have Graves disease and are being counseled about therapeutic iodine-131.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.graves-rai-active-ted-avoidance.general-avoidance",
    "statement": "In ordinary Graves treatment selection, therapeutic iodine-131 is generally\navoided when thyroid eye disease is active and moderate-to-severe.",
    "sourceIds": [
      "source.eanm.benign-thyroid-rai-guideline.2023",
      "source.ata.thyroid-eye-disease.undated"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "not an absolute lifetime prohibition; specialist\n  exceptions may be considered when alternatives are not feasible.",
    "applicablePopulation": "Adults with Graves disease and specialist-documented active moderate-to-severe thyroid eye disease.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.graves-rai-active-ted-avoidance.worsening-risk",
    "statement": "Therapeutic iodine-131 may worsen existing thyroid eye disease.",
    "sourceIds": [
      "source.eanm.benign-thyroid-rai-guideline.2023",
      "source.ata.thyroid-eye-disease.undated",
      "source.niddk.graves-disease.2021"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "supports counseling avoidance in the documented active\n  moderate-to-severe setting; it does not create an emergency-treatment rule.",
    "applicablePopulation": "Adults with Graves disease and specialist-documented active moderate-to-severe thyroid eye disease.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.graves-rai-active-ted-avoidance.eye-course-thyroid-function-distinction",
    "statement": "Improvement in thyroid symptoms alone does not establish that thyroid eye disease has become inactive.",
    "sourceIds": [
      "source.ata.thyroid-eye-disease.undated",
      "source.niddk.graves-disease.2021"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "this is a synthetic application: ATA and NIDDK document\n  that TED can coexist with normal thyroid function, while the case independently\n  states specialist-confirmed active disease. It does not establish a timeline or cause.",
    "applicablePopulation": "Adults with Graves disease and specialist-documented active moderate-to-severe thyroid eye disease.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "id": "claim.graves-rai-active-ted-avoidance.graves-background-findings",
    "statement": "Palpitations, fine tremor, heat intolerance, diffuse goiter, and diffuse scan uptake can provide clinical context for Graves disease.",
    "sourceIds": [
      "source.niddk.graves-disease.2021"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "background context only, not an extra scored concept; these findings do not grade TED or independently select treatment.",
    "applicablePopulation": "Adults with Graves disease and specialist-documented active moderate-to-severe thyroid eye disease.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "evidence.graves-row-061.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  }
] satisfies EvidenceClaim[];

const SOURCE_METADATA = [
  {
    id: "source.niddk.graves-disease.2021",
    title: "Graves’ Disease",
    completeCitation: "National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK), National Institutes of Health. Graves’ Disease. Last reviewed November 2021.",
    organizationOrJournal: "National Institute of Diabetes and Digestive and Kidney Diseases, National Institutes of Health",
    authors: ["National Institute of Diabetes and Digestive and Kidney Diseases"],
    publicationYear: 2021,
    doi: null,
    pmid: null,
    officialUrl: "https://www.niddk.nih.gov/health-information/endocrine-diseases/graves-disease",
    sourceClass: "government_guidance",
    licenseLabel: "United States government public information; stated NIDDK exceptions apply",
    reuseStatus: "public_domain_conditions_apply",
    reuseNotes: "Targeted factual verification and independently written synthesis only; confirm credited third-party material separately.",
    authorityAssessment: "United States government patient education used as an independent cross-check for Graves presentation, diagnostic context, treatment roles, and thyroid-eye-disease risk.",
    usageRole: "both",
  },
  {
    id: "source.niddk.hyperthyroidism.2021",
    title: "Hyperthyroidism (Overactive Thyroid)",
    completeCitation: "National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK), National Institutes of Health. Hyperthyroidism (Overactive Thyroid). Last reviewed August 2021.",
    organizationOrJournal: "National Institute of Diabetes and Digestive and Kidney Diseases, National Institutes of Health",
    authors: ["National Institute of Diabetes and Digestive and Kidney Diseases"],
    publicationYear: 2021,
    doi: null,
    pmid: null,
    officialUrl: "https://www.niddk.nih.gov/health-information/endocrine-diseases/hyperthyroidism",
    sourceClass: "government_guidance",
    licenseLabel: "United States government public information; stated NIDDK exceptions apply",
    reuseStatus: "public_domain_conditions_apply",
    reuseNotes: "Targeted factual verification and independently written synthesis only; confirm credited third-party material separately.",
    authorityAssessment: "United States government patient education used for symptom and differential boundaries.",
    usageRole: "evidence",
  },
  {
    id: "source.ata.graves-disease.undated",
    title: "Graves’ Disease",
    completeCitation: "American Thyroid Association. Graves’ Disease. Undated; accessed September 9, 2026.",
    organizationOrJournal: "American Thyroid Association",
    authors: ["American Thyroid Association"],
    publicationYear: null,
    publicationDateNote: "Source is explicitly undated; no publication year is claimed.",
    doi: null,
    pmid: null,
    officialUrl: "https://www.thyroid.org/graves-disease/",
    sourceClass: "open_educational_resource",
    licenseLabel: "Copyrighted American Thyroid Association content",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes: "Targeted factual verification and citation only; no source-expression reuse or redistribution.",
    authorityAssessment: "Professional-society patient education used for Graves recognition, TRAb context, and treatment-option cross-checks.",
    usageRole: "both",
  },
  {
    id: "source.ata.thyroid-function-tests.undated",
    title: "Thyroid Function Tests",
    completeCitation: "American Thyroid Association. Thyroid Function Tests. Undated; accessed September 9, 2026.",
    organizationOrJournal: "American Thyroid Association",
    authors: ["American Thyroid Association"],
    publicationYear: null,
    publicationDateNote: "Source is explicitly undated; no publication year is claimed.",
    doi: null,
    pmid: null,
    officialUrl: "https://www.thyroid.org/thyroid-function-tests/",
    sourceClass: "open_educational_resource",
    licenseLabel: "Copyrighted American Thyroid Association content",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes: "Targeted factual verification and citation only; no source-expression reuse or redistribution.",
    authorityAssessment: "Professional-society patient education used for the thyroid-function versus etiologic-antibody distinction.",
    usageRole: "evidence",
  },
  {
    id: "source.niddk.thyroid-tests.2017",
    title: "Thyroid Tests",
    completeCitation: "National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK), National Institutes of Health. Thyroid Tests. Last reviewed May 2017.",
    organizationOrJournal: "National Institute of Diabetes and Digestive and Kidney Diseases, National Institutes of Health",
    authors: ["National Institute of Diabetes and Digestive and Kidney Diseases"],
    publicationYear: 2017,
    doi: null,
    pmid: null,
    officialUrl: "https://www.niddk.nih.gov/health-information/diagnostic-tests/thyroid",
    sourceClass: "government_guidance",
    licenseLabel: "United States government public information; stated NIDDK exceptions apply",
    reuseStatus: "public_domain_conditions_apply",
    reuseNotes: "Targeted factual verification and independently written synthesis only; confirm credited third-party material separately.",
    authorityAssessment: "Older United States government patient education retained as an independent thyroid-function-testing cross-check.",
    usageRole: "cross_check",
  },
  {
    id: "source.eanm.benign-thyroid-rai-guideline.2023",
    title: "The EANM guideline on radioiodine therapy of benign thyroid disease",
    completeCitation: "Campennì A, Avram AM, Verburg FA, Iakovou I, Hänscheid H, de Keizer B, Petranović Ovčariček P, Giovanella L. The EANM guideline on radioiodine therapy of benign thyroid disease. European Journal of Nuclear Medicine and Molecular Imaging. 2023;50:3324–3348. doi:10.1007/s00259-023-06274-5.",
    organizationOrJournal: "European Association of Nuclear Medicine; European Journal of Nuclear Medicine and Molecular Imaging",
    authors: ["Campennì A", "Avram AM", "Verburg FA", "Iakovou I", "Hänscheid H", "de Keizer B", "Petranović Ovčariček P", "Giovanella L"],
    publicationYear: 2023,
    doi: "10.1007/s00259-023-06274-5",
    pmid: null,
    officialUrl: "https://link.springer.com/article/10.1007/s00259-023-06274-5",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Creative Commons Attribution 4.0 International",
    reuseStatus: "cc_by_4_0",
    reuseNotes: "CC BY 4.0: https://creativecommons.org/licenses/by/4.0/. This record uses original factual synthesis with attribution and a change notice; it does not reproduce source prose, tables, figures, or algorithms.",
    authorityAssessment: "Professional guideline used as direct authority for therapeutic iodine-131 selection and pregnancy, lactation, and thyroid-eye-disease boundaries.",
    usageRole: "evidence",
  },
  {
    id: "source.ata.thyroid-eye-disease.undated",
    title: "Thyroid Eye Disease",
    completeCitation: "American Thyroid Association. Thyroid Eye Disease. Undated; accessed September 9, 2026.",
    organizationOrJournal: "American Thyroid Association",
    authors: ["American Thyroid Association"],
    publicationYear: null,
    publicationDateNote: "Source is explicitly undated; no publication year is claimed.",
    doi: null,
    pmid: null,
    officialUrl: "https://www.thyroid.org/thyroid-eye-disease/",
    sourceClass: "open_educational_resource",
    licenseLabel: "Copyrighted American Thyroid Association content",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes: "Targeted factual verification and citation only; no source-expression reuse or redistribution.",
    authorityAssessment: "Professional-society patient education used for TED severity context, thyroid-function distinction, and RAI worsening-risk cross-checks.",
    usageRole: "both",
  },
  {
    id: "source.niddk.thyroid-disease-pregnancy.2017",
    title: "Thyroid Disease & Pregnancy",
    completeCitation: "National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK), National Institutes of Health. Thyroid Disease & Pregnancy. Last reviewed December 2017.",
    organizationOrJournal: "National Institute of Diabetes and Digestive and Kidney Diseases, National Institutes of Health",
    authors: ["National Institute of Diabetes and Digestive and Kidney Diseases"],
    publicationYear: 2017,
    doi: null,
    pmid: null,
    officialUrl: "https://www.niddk.nih.gov/health-information/endocrine-diseases/pregnancy-thyroid-disease",
    sourceClass: "government_guidance",
    licenseLabel: "United States government public information; stated NIDDK exceptions apply",
    reuseStatus: "public_domain_conditions_apply",
    reuseNotes: "Targeted factual verification and independently written synthesis only; older patient education, not a current guideline.",
    authorityAssessment: "United States government patient education used as an independent cross-check for pregnancy treatment and continued-care boundaries.",
    usageRole: "cross_check",
  },
  {
    id: "source.ata.hyperthyroidism-in-pregnancy.undated",
    title: "Hyperthyroidism in Pregnancy",
    completeCitation: "American Thyroid Association. Hyperthyroidism in Pregnancy. Undated; accessed September 9, 2026.",
    organizationOrJournal: "American Thyroid Association",
    authors: ["American Thyroid Association"],
    publicationYear: null,
    publicationDateNote: "Source is explicitly undated; no publication year is claimed.",
    doi: null,
    pmid: null,
    officialUrl: "https://www.thyroid.org/hyperthyroidism-in-pregnancy/",
    sourceClass: "open_educational_resource",
    licenseLabel: "Copyrighted American Thyroid Association content",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes: "Targeted factual verification and citation only; no source-expression reuse or redistribution.",
    authorityAssessment: "Professional-society patient education used for fetal-thyroid mechanism and ongoing-care boundaries.",
    usageRole: "evidence",
  },
  {
    id: "source.lactmed.sodium-iodide-i131.2026",
    title: "Sodium Iodide I 131",
    completeCitation: "National Institute of Child Health and Human Development. Drugs and Lactation Database (LactMed®) [Internet]. Bethesda (MD): National Institute of Child Health and Human Development; 2006–. Sodium Iodide I 131. Updated August 15, 2026.",
    organizationOrJournal: "Drugs and Lactation Database (LactMed®), National Institute of Child Health and Human Development",
    authors: ["National Institute of Child Health and Human Development"],
    publicationYear: 2026,
    doi: null,
    pmid: null,
    officialUrl: "https://www.ncbi.nlm.nih.gov/books/NBK501563/",
    sourceClass: "government_guidance",
    licenseLabel: "United States government publication; NCBI Bookshelf source-specific conditions apply",
    reuseStatus: "public_domain_conditions_apply",
    reuseNotes: "Original factual synthesis and attribution only; no source prose, dose, timing, case detail, or bulk reuse. LactMed® is an HHS trademark.",
    authorityAssessment: "United States government lactation reference used to cross-check therapeutic iodine-131 lactation and infant-thyroid-exposure boundaries.",
    usageRole: "cross_check",
  },
  {
    id: "source.ata.radioactive-iodine.undated",
    title: "Radioactive Iodine",
    completeCitation: "American Thyroid Association. Radioactive Iodine. Undated; accessed September 9, 2026.",
    organizationOrJournal: "American Thyroid Association",
    authors: ["American Thyroid Association"],
    publicationYear: null,
    publicationDateNote: "Source is explicitly undated; no publication year is claimed.",
    doi: null,
    pmid: null,
    officialUrl: "https://www.thyroid.org/radioactive-iodine/",
    sourceClass: "open_educational_resource",
    licenseLabel: "Copyrighted American Thyroid Association content",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes: "Targeted factual verification and citation only; no source-expression reuse or redistribution. Therapeutic iodine-131 facts only.",
    authorityAssessment: "Professional-society patient education used to cross-check therapeutic iodine-131 lactation and infant-thyroid-protection boundaries.",
    usageRole: "cross_check",
  },
] as const;

export const GRAVES_SOURCES: GravesClinicalSource[] = SOURCE_METADATA.map((source) => ({
  ...source,
  authors: [...source.authors],
  accessedOn: CHECKED_ON,
  contentVersion: EVIDENCE_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
  evidenceClaimIds: GRAVES_CLAIMS.filter((claim) => claim.sourceIds.includes(source.id)).map((claim) => claim.id),
}));

export const GRAVES_CONCEPTS = [
  {
    id: "concept.graves.clinical-pattern-recognition",
    displayName: "Graves clinical-pattern recognition",
    learningObjective: "Recognize an adult clinical pattern that supports Graves disease: symptoms compatible with thyroid-hormone excess together with diffuse thyroid enlargement and characteristic eye or pretibial skin findings when present, without requiring every feature in every patient.",
    earliestFacilityStage: 0,
    conceptType: "diagnosis",
  },
  {
    id: "concept.graves.trab-diagnostic-support",
    displayName: "TRAb diagnostic support for Graves disease",
    learningObjective: "Use TRAb as etiologic support for Graves disease when a patient already has biochemical thyrotoxicosis; distinguish thyroid function from cause and recognize that a negative TRAb result does not fully exclude Graves disease.",
    earliestFacilityStage: 0,
    conceptType: "workup",
  },
  {
    id: "concept.graves.rai-appropriate-candidate",
    displayName: "RAI evaluation for recurrent Graves hyperthyroidism",
    learningObjective: "Recognize recurrent hyperthyroidism after antithyroid-drug withdrawal as a setting where RAI evaluation is a reasonable counseling option, while retaining surgery and antithyroid-drug treatment as preference-sensitive alternatives.",
    earliestFacilityStage: 0,
    conceptType: "management",
  },
  {
    id: "concept.graves.rai-pregnancy-contraindication",
    displayName: "RAI contraindication during pregnancy",
    learningObjective: "Recognize current pregnancy as a contraindication to RAI treatment for Graves disease while continuing appropriate endocrine and obstetric assessment without RAI during pregnancy.",
    earliestFacilityStage: 0,
    conceptType: "management",
  },
  {
    id: "concept.graves.rai-lactation-contraindication",
    displayName: "RAI contraindication during lactation",
    learningObjective: "Recognize current breastfeeding as a contraindication to therapeutic iodine-131 for Graves disease and recognize the pre-treatment counseling boundary for feeding the current child.",
    earliestFacilityStage: 0,
    conceptType: "management",
  },
  {
    id: "concept.graves.rai-active-ted-avoidance",
    displayName: "RAI avoidance with active moderate-to-severe TED",
    learningObjective: "Generally avoid therapeutic iodine-131 in ordinary Graves treatment counseling when specialist assessment documents active moderate-to-severe thyroid eye disease.",
    earliestFacilityStage: 0,
    conceptType: "management",
  },
] satisfies TestedConcept[];

export const GRAVES_VARIANTS: GravesVariant[] = FROZEN_VARIANT_TEXT.map((variant) => ({
  id: variant.id,
  conceptId: variant.conceptId,
  stem: variant.stem,
  answerChoices: variant.choices.map((label, index) => ({
    id: `answer.${variant.id.replace(/^question\./, "")}.${index + 1}`,
    label,
    isCorrect: index === variant.correctChoiceIndex,
    distractorRationale: null,
  })),
  explanation: variant.explanation,
  supportingEvidenceClaimIds: [...variant.supportingEvidenceClaimIds],
  contentVersion: variant.contentVersion,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: CHECKED_ON,
    contentVersion: variant.contentVersion,
  },
  patientPresentationVariantId: variant.patientPresentationVariantId,
  patientPresentation: variant.patientPresentation,
  approvedInstantiationProfiles: variant.profileSpecs.map((profile, index) => ({
    id: `profile.${variant.patientPresentationVariantId.replace(/^presentation\./, "")}.${profile.sexLabel.toLowerCase()}.${index + 1}`,
    prototypeDemographics: profile,
    presentation: variant.patientPresentation,
  })),
  frozenSnapshotPath: variant.frozenSnapshotPath,
  frozenSnapshotSha256: variant.frozenSnapshotSha256,
  originalClinicianReceipt: variant.originalClinicianReceipt,
  runtimeAdaptationReview: {
    contentVersion: `adaptation.${variant.id.replace(/^question\./, "")}.patient-name-slot.2026-09-09`,
    reviewStatus: "needs_clinician_review",
    aiAssistedDrafting: true,
    lastClinicianReview: null,
    authority: "owner-delegated agent review",
    clinicianSignOff: false,
    scope: "The illustrative first name was replaced with {patientName}; clinical wording, choices, key, and stable IDs remain frozen to the clinician-approved snapshot.",
  },
}));

const displayNameForConcept = (conceptId: string): string => {
  if (conceptId.includes("clinical-pattern-recognition")) return "Thyroid symptom evaluation";
  if (conceptId.includes("trab-diagnostic-support")) return "Thyroid test review";
  return "Thyroid treatment counseling";
};

const clinicalReferenceLabels = (variant: GravesVariant): string[] => {
  const sourceIds = new Set(
    GRAVES_CLAIMS.filter((claim) => variant.supportingEvidenceClaimIds.includes(claim.id)).flatMap((claim) => claim.sourceIds),
  );
  return GRAVES_SOURCES.filter((source) => sourceIds.has(source.id)).map(
    (source) => `Clinical reference: ${source.title} (${source.id})`,
  );
};

export const GRAVES_CASES = GRAVES_VARIANTS.map((variant) => {
  const sourceLabels = clinicalReferenceLabels(variant);
  return {
    id: `case.${variant.id.replace(/^question\./, "")}`,
    displayName: displayNameForConcept(variant.conceptId),
    patientPresentationVariantId: variant.patientPresentationVariantId,
    releasePointId: "release.l0.clinic_evaluation",
    patientDisplayName: "{patientName}",
    presentation: variant.patientPresentation,
    approvedInstantiationProfiles: variant.approvedInstantiationProfiles,
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: 0,
    requiredClinicalSetting: "clinic" as const,
    requiredCapabilityIds: [],
    rewardTierId: "reward.clinic_basic",
    sourceLabels: [
      ...sourceLabels,
      `Clinician-approved frozen wording: ${variant.originalClinicianReceipt}`,
    ],
    decisionNodes: [
      {
        id: `node.${variant.id.replace(/^question\./, "")}`,
        questionVariantId: variant.id,
        primaryConceptId: variant.conceptId,
        stem: variant.stem,
        answerChoices: variant.answerChoices.map((choice) => ({
          id: choice.id,
          label: choice.label,
          isCorrect: choice.isCorrect,
          serviceRequest: null,
        })),
        shuffleAnswers: true,
        explanation: variant.explanation,
        sourceLabels,
        resultGateAfter: null,
        terminalDispositions: variant.answerChoices
          .filter((choice) => !choice.isCorrect)
          .map((choice) => ({
            answerChoiceId: choice.id,
            kind: "no_terminal_outcome" as const,
            consequenceNarrative: "The encounter closes after recording the learner’s response.",
            clinicalRationale: variant.explanation,
            sourceLabels,
          })),
      },
    ],
    learningSummary: variant.explanation,
  };
}) satisfies SyntheticClinicalCase[];
