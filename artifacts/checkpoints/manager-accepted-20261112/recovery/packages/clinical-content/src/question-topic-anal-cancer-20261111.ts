import type { ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
import {
  answerChoiceTimingRegistryEntrySchema, caseExhibitSchema, decisionNodeSchema,
  syntheticClinicalCaseSchema, testedConceptSchema, validateSyntheticClinicalRelease,
  type AnswerChoiceTimingRegistryEntry, type CaseExhibit, type DecisionNode,
  type SyntheticClinicalCase, type TestedConcept,
} from "./schema";
import ledger from "../../../docs/research/sources-question-topic-anal-cancer-20261111.json";

/** Explicit-import authoring sidecar. No definition here enters fresh live supply. */
export const ANAL_CANCER_VERSION = "question-topic.anal-cancer.2026-11-11.v1";
export const ANAL_CANCER_REVIEW = {
  contentVersion: ANAL_CANCER_VERSION, reviewStatus: "needs_clinician_review" as const,
  aiAssistedDrafting: true, lastClinicianReview: null,
};
const claimId = (id: string) => `claim.question-topic.anal-cancer.${id}`;
const questionId = (id: string) => `question.topic.anal-cancer.${id}.v1`;
const nodeId = (id: string) => `node.topic.anal-cancer.${id}.v1`;
const caseId = (id: string) => `case.topic.anal-cancer.${id}.v1`;
const conceptId = (id: string) => `concept.topic.anal-cancer.${id}.v1`;
const WORKUP = "concept.anal-scc.biopsy-and-staging";
const LOCAL = "concept.n3.anal-cancer-distant-staging-versus-local-extent";
const CRT = "concept.anal-scc.localized-chemoradiation-referral";

interface ChoiceSpec {
  id: string; label: string; isCorrect: boolean; rationale: string;
  temptation: string; counterfactual: string; evidenceClaimIds: string[];
  timingProfileId: string | null;
}
export interface AnalCancerAuthorGate {
  coverTheKey: string;
  sameDecisionStageAndCategory: string;
  reasoningSteps: [string, string];
  closestError: string;
  decidingObservation: string;
  consequence: string;
  residentDifficulty: string;
  singleDefensibleBestAnswer: string;
  counterfactual: string;
  deletionTest: string[];
  sequenceReview: string;
  repairAndRecheck: string;
}
interface NodeSpec {
  slug: string; caseSlug: string; conceptId: string; previousConceptId: string | null;
  creationKind: "Rewrite" | "new"; before: string[] | null;
  objective: string; conceptType: TestedConcept["conceptType"];
  currentUpdate: string; task: string; exhibit: CaseExhibit;
  choices: ChoiceSpec[]; explanation: string; supportingEvidenceClaimIds: string[];
  manualAuthorGate: AnalCancerAuthorGate;
}
interface CaseSpec {
  slug: string; patientDisplayName: string; age: number; sex: "Female" | "Male";
  complaint: string; presentation: string; nodes: string[];
}
const choice = (id: string, label: string, isCorrect: boolean, rationale: string,
  temptation: string, counterfactual: string, claims: string[], timingProfileId: string | null = null): ChoiceSpec =>
  ({ id, label, isCorrect, rationale, temptation, counterfactual, evidenceClaimIds: claims.map(claimId), timingProfileId });
const exhibit = (items: [string, string][]): CaseExhibit => caseExhibitSchema.parse({
  kind: "keyValue", caption: "Constructed clinic teaching record; fictional patient observations",
  items: items.map(([label, value]) => ({ label, value })),
});

export const ANAL_CANCER_SPECS: NodeSpec[] = [
  {
    slug: "sample-provenance", caseSlug: "new-lesion", conceptId: WORKUP, previousConceptId: null,
    creationKind: "Rewrite", before: ["question.anal-scc.biopsy-and-staging.v1"], conceptType: "workup",
    objective: "Obtain representative tissue from a suspicious anal-canal lesion before interpreting a benign outside specimen as clearance.",
    currentUpdate: "Evelyn brings the outside specimen map and pathology report to clinic.",
    task: "Which sampling procedure should the clinic arrange now for Evelyn Marsh’s bleeding anal lesion?",
    exhibit: exhibit([
      ["Clinic examination", "A firm, friable mass occupies the left lateral anal canal. A separate soft skin tag lies posterior to the anal verge."],
      ["Outside procedure map", "The excised specimen is labelled posterior perianal skin tag."],
      ["Histology", "The skin-tag specimen contains benign keratinized squamous epithelium and fibrous tissue."],
    ]),
    choices: [
      choice("mass", "Anoscopy-guided biopsy of the canal mass", true,
        "The benign posterior skin specimen does not represent the left canal mass. Obtain tissue from the unresolved lesion.",
        "Use the benign finding locally while checking which lesion was sampled.",
        "A concerning posterior skin lesion would instead justify targeted posterior skin sampling.", ["representative-tissue", "sampling-limits"], "timing.test.biopsy"),
      choice("swab", "Anal cytology with HPV genotyping", false,
        "A screening swab does not establish histology of this firm visible lesion.",
        "Choose a less invasive HPV assessment after seeing benign tissue.",
        "Anal cytology can screen an eligible asymptomatic person with HIV rather than diagnose a mass.", ["representative-tissue", "abnormal-cytology-hra"], "timing.test.pathology_review"),
      choice("levels", "Deeper sections of the outside tissue block", false,
        "Additional sections can reassess the submitted skin tissue but cannot sample the separate canal mass.",
        "Look for missed cancer in the existing block without reconciling its anatomic target.",
        "If the block represented the suspicious lesion and retained relevant deeper tissue, additional sections could clarify an initially nondiagnostic sample.", ["representative-tissue", "sampling-limits"], "timing.test.pathology_review"),
    ],
    explanation: "The benign histology belongs to a different target. Obtain representative tissue from the canal mass; subsequent cancer staging depends on its diagnosis.",
    supportingEvidenceClaimIds: ["representative-tissue", "sampling-limits", "abnormal-cytology-hra"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "Covered the key across header and specimen map. No field calls the mass cancer or says it was not sampled. Two anatomic targets replace the named omission; all options acquire or process diagnostic specimens and the key is not uniquely qualified.",
      sameDecisionStageAndCategory: "Three diagnostic specimen approaches: acquire lesion tissue, repeat screening, or process existing tissue; no treatment foil.",
      reasoningSteps: ["Assign the benign report to the posterior skin specimen, separate from the left canal mass.", "Choose tissue from the unexplained lesion rather than screening or deeper sections of a different target."],
      closestError: "Treating benign tissue from one site as exclusion of disease at another palpable site.",
      decidingObservation: "Procedure map and current examination identify different anatomic lesions.",
      consequence: "A wrong-site interpretation delays diagnosis of the canal mass.",
      residentDifficulty: "Moderate PGY-2/3 prediction from specimen provenance and screening-versus-diagnostic sampling; not measured or independently passed.",
      singleDefensibleBestAnswer: "Direct biopsy of the accessible unexplained mass resolves the current histology among the offered samples.",
      counterfactual: "If the submitted block represented the suspicious lesion and contained unexamined relevant deeper tissue, additional sections could reasonably clarify its diagnosis; that is not the current wrong-target record.",
      deletionTest: ["Deleting the specimen map removes the basis for locating the benign result.", "Deleting the mass-versus-tag distinction makes the biopsy target ambiguous.", "Name, age and short clinic frame are required patient context, not key discriminators."],
      sequenceReview: "First node. Neither later histology nor staging is visible. Feedback gives no later nodal classification or treatment regimen.",
      repairAndRecheck: "Removed the already-ordered keyed workup and explicit missing-biopsy sentence. Final attack rejected repeat sampling of a soft benign tag as too weak; replaced it with credible deeper-block review and re-solved the target mismatch. All three diagnostic paths have estimates.",
    },
  },
  {
    slug: "local-staging-record", caseSlug: "new-lesion", conceptId: LOCAL, previousConceptId: null,
    creationKind: "Rewrite", before: ["question.n3.anal-cancer-distant-staging-versus-local-extent.v1"], conceptType: "workup",
    objective: "Distinguish completed distant staging from a usable local-staging assessment before treatment planning.",
    currentUpdate: "Biopsy of Evelyn’s canal mass now shows invasive squamous carcinoma. The outside imaging acquisition and transfer records are available.",
    task: "Which step should the clinic arrange next to complete Evelyn Marsh’s pelvic staging review before treatment planning?",
    exhibit: exhibit([
      ["Diagnostic CT chest, abdomen and pelvis", "No distant lesion is identified. The interface between the anal mass and posterior vaginal wall is indistinct."],
      ["MRI acquisition log", "Dedicated pelvic T2 and diffusion series were completed. The archive contains the full series."],
      ["Transferred MRI media", "Contains scout/localizer images. No diagnostic pelvic series appears on the transferred media."],
    ]),
    choices: [
      choice("review", "Specialist review of the archived pelvic MRI", true,
        "Local anatomy remains a planning question, but the diagnostic acquisition exists. Obtain and review it rather than equate incomplete transfer with an unperformed scan.",
        "Reconcile acquisition, storage and transferred-series records.",
        "If the examination ended after localizers and the archive had no diagnostic series, dedicated MRI acquisition would be needed.", ["mri-local"], "timing.test.general_diagnostic"),
      choice("repeat", "Repeat dedicated pelvic MRI acquisition", false,
        "The completed diagnostic series is retained in the archive; the current limitation is the transferred media.",
        "Infer that missing exported series were never acquired.",
        "A technically incomplete or nondiagnostic original examination would justify a new acquisition.", ["mri-local"], "timing.test.mri"),
      choice("pet", "Obtain a new FDG PET/CT acquisition", false,
        "Metabolic staging can complement standard studies but does not replace the acquired anatomic assessment of this interface.",
        "Substitute a new whole-body study for resolution of local anatomy.",
        "An unresolved nodal or distant distribution question can justify complementary metabolic assessment.", ["mri-local", "ct-distant"], "timing.test.pet_ct"),
    ],
    explanation: "Local anatomy matters despite CT without distant disease. The full pelvic MRI was acquired and retained; transfer and specialist review resolve the current information gap without repeating acquisition.",
    supportingEvidenceClaimIds: ["mri-local", "ct-distant"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "The task does not name a missing test. Two options share MRI and pelvic wording, so modality matching cannot select the key. All plans have timing proposals, including specialist review; no unique wait exemption cues the answer.",
      sameDecisionStageAndCategory: "Three imaging-assessment steps: review an existing acquisition, repeat it, or acquire a different modality.",
      reasoningSteps: ["Recognize an unresolved local tumor–vaginal interface despite completed distant CT assessment.", "Distinguish missing exported series from an unperformed acquisition and use the retained diagnostic examination."],
      closestError: "Repeat MRI because the referral media contains only localizers.",
      decidingObservation: "The scanner log and archive confirm completed diagnostic pelvic series.",
      consequence: "Misreading transfer status adds unnecessary testing or leaves planning anatomy unresolved.",
      residentDifficulty: "Moderate to hard PGY-2/3 prediction from local-versus-distant scope plus acquisition-versus-export evidence.",
      singleDefensibleBestAnswer: "The needed local acquisition exists in the archive, so obtaining specialist review is the justified next step.",
      counterfactual: "If the log showed an examination stopped after localizers and no diagnostic series existed, repeat dedicated MRI becomes best.",
      deletionTest: ["Without the log/archive rows retrieval cannot be ranked against repeat scanning.", "Without the CT interface finding the local anatomic planning consequence is less explicit.", "The media row establishes the actual information failure rather than an author conclusion."],
      sequenceReview: "Prior feedback only resolves tissue provenance. This feedback does not name inguinal staging or the next treatment answer.",
      repairAndRecheck: "Removed the old hip radiograph and the statement that local staging is missing. Re-solved separate acquisition/archive/export observations; preserve the original N3 construct, not its held v2 treatment identity.",
    },
  },
  {
    slug: "regional-node-treatment", caseSlug: "new-lesion", conceptId: CRT, previousConceptId: null,
    creationKind: "Rewrite", before: ["question.anal-scc.localized-chemoradiation-referral.v1"], conceptType: "management",
    objective: "Select initial treatment after interpreting inguinal involvement as regional anal-cancer disease.",
    currentUpdate: "Evelyn returns after review of the archived MRI and groin-node sample.",
    task: "Which initial cancer treatment should be offered to Evelyn Marsh on the basis of these completed findings?",
    exhibit: exhibit([
      ["Biopsy", "Invasive squamous carcinoma from the anal-canal mass."],
      ["Pelvic MRI", "A 4.2-cm canal primary involves the sphincter complex. Bladder, urethra and vaginal walls are separate from the mass."],
      ["Left inguinal-node FNA", "Squamous carcinoma matching the canal primary."],
      ["Diagnostic CT chest, abdomen and pelvis", "No other metastatic site identified."],
    ]),
    choices: [
      choice("crt", "Radiation with concurrent fluorouracil and mitomycin", true,
        "An involved inguinal node is regional disease. This untreated canal primary remains on a curative chemoradiation pathway.",
        "Integrate nodal geography and histology before choosing treatment intent.",
        "Disseminated distant disease would shift the main pathway toward systemic treatment.", ["inguinal-regional", "nonmetastatic-crt", "crt-regimen"]),
      choice("systemic", "Retifanlimab with carboplatin and paclitaxel", false,
        "This systemic option addresses inoperable recurrent or metastatic disease; the involved inguinal node does not establish distant spread.",
        "Call a node outside the mesorectum a distant metastasis.",
        "Multiple biopsy-confirmed distant metastases without prior platinum would support a first-line systemic regimen.", ["inguinal-regional", "first-line-retifanlimab"]),
      choice("apr", "Primary abdominoperineal resection with colostomy", false,
        "Sphincter involvement in this newly treated squamous primary does not create the post-chemoradiation failure indication for APR.",
        "Import a rectal-resection rule or treat sphincter invasion as an automatic operation indication.",
        "Confirmed resectable isolated canal recurrence after definitive chemoradiation can support salvage APR.", ["nonmetastatic-crt", "salvage-apr"]),
    ],
    explanation: "Inguinal spread is regional for anal SCC. A canal squamous primary without distant disease is treated with definitive chemoradiation using an established concurrent regimen; nodal positivity does not itself require a metastatic pathway or primary APR.",
    supportingEvidenceClaimIds: ["inguinal-regional", "nonmetastatic-crt", "crt-regimen", "first-line-retifanlimab", "salvage-apr"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "Raw site and sampling results replace a supplied nonmetastatic stage label. No lead-in term uniquely matches one plan. Each option is a real named cancer treatment; no alone/individualized or explanatory qualifier.",
      sameDecisionStageAndCategory: "Three initial cancer-treatment pathways with shared background care.",
      reasoningSteps: ["Classify the sampled inguinal node as regional and retain the anal-canal squamous identity.", "Use that distribution and untreated phase to select curative concurrent chemoradiation."],
      closestError: "Choose metastatic systemic treatment because the involved inguinal node is outside the pelvis.",
      decidingObservation: "The only secondary site is inguinal; diagnostic distant staging is otherwise clear.",
      consequence: "Misclassification diverts the patient from standard potentially curative local-regional treatment.",
      residentDifficulty: "Moderate to hard PGY-2/3 prediction from nodal anatomy and treatment phase; replaces supplied diagnosis/stage followed by referral recall.",
      singleDefensibleBestAnswer: "The bulky node-positive untreated canal primary fits chemoradiation; a tiny superficial-lesion exception does not apply.",
      counterfactual: "Replace groin-only disease with multiple biopsy-confirmed hepatic metastases and the systemic combination becomes the main pathway.",
      deletionTest: ["Delete the node site and regional-versus-distant intent is unresolved.", "Delete distant staging and disseminated disease may change intent.", "Primary site and histology prevent importing a rectal adenocarcinoma pathway."],
      sequenceReview: "Earlier nodes establish tissue and recover imaging but do not teach inguinal classification or name treatment. This node introduces the node sample and earns a separate decision.",
      repairAndRecheck: "Removed explicit nonmetastatic labeling, local-excision caricatures and treatment-feasibility permissions. Re-solved three specific pathways.",
    },
  },
];

ANAL_CANCER_SPECS.push(
  {
    slug: "cytology-to-histology", caseSlug: "hsil", conceptId: conceptId("cytology-hra"),
    previousConceptId: "concept.anal-hsil.high-risk-hpv-association", creationKind: "new", before: null, conceptType: "workup",
    objective: "Use HRA-directed tissue assessment after abnormal anal cytology despite normal palpation in an adult with HIV.",
    currentUpdate: "Daniel’s anal swab reports high-grade squamous cytologic abnormalities and oncogenic HPV. Digital examination finds no mass.",
    task: "Which diagnostic investigation should the clinic arrange next for Daniel Mercer’s anal-screening findings?",
    exhibit: exhibit([
      ["Screening specimen", "Anal swab with high-grade squamous cytologic abnormalities and oncogenic HPV detected."],
      ["Current examination", "No palpable anal lesion."],
      ["Outside procedural record", "Anal swab collection and digital examination; no anal tissue specimen submitted."],
    ]),
    choices: [
      choice("hra", "High-resolution anoscopy with directed biopsies", true,
        "Cytology detects abnormal cells but does not supply tissue architecture. HRA identifies and samples flat lesions that need not be palpable.",
        "Connect specimen type with the limits of a normal examination.",
        "If representative tissue already showed invasive cancer and local extent were unresolved, pelvic staging MRI would fit the next task.", ["abnormal-cytology-hra", "normal-palpation"], "timing.test.biopsy"),
      choice("swab", "Repeat anal cytology and HPV testing", false,
        "Another swab does not resolve this high-grade screening result with histology.",
        "Use normal palpation to downgrade the abnormal screen.",
        "Cytology can be used to screen an eligible asymptomatic person rather than replace evaluation of an already high-grade result.", ["abnormal-cytology-hra", "normal-palpation"], "timing.test.pathology_review"),
      choice("mri", "Pelvic MRI with local-staging sequences", false,
        "The swab has not established invasive cancer; MRI does not replace lesion histology at this stage.",
        "Equate a high cytologic grade with a tissue diagnosis of invasive cancer.",
        "Biopsy-established anal cancer requiring primary and pelvic-node assessment supports pelvic MRI.", ["mri-local", "abnormal-cytology-hra"], "timing.test.mri"),
    ],
    explanation: "The swab and palpation answer different questions. Abnormal cytologic screening requires HRA-directed histologic assessment; a nonpalpable lesion can still be present.",
    supportingEvidenceClaimIds: ["abnormal-cytology-hra", "normal-palpation", "mri-local"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "The task requests a diagnostic investigation without naming HRA. Specimen provenance is a swab, not a biopsy. All testing choices have exact wait proposals. The key does not have a unique rationale or cautious qualifier in its label.",
      sameDecisionStageAndCategory: "Three named diagnostic investigations, with no treatment or generic referral foil.",
      reasoningSteps: ["Identify cytology as screening and recognize that normal palpation does not clear flat epithelial disease.", "Obtain directed histology rather than repeat screening or skip to invasive-cancer staging."],
      closestError: "Repeat the swab because there is no palpable tumor.",
      decidingObservation: "High-grade cells on an anal swab without tissue histology.",
      consequence: "False reassurance delays histologic diagnosis of precursor disease or cancer.",
      residentDifficulty: "Moderate PGY-2/3 prediction from the conflict between specimen type and reassuring examination. HRA vocabulary alone is not claimed to make the item difficult.",
      singleDefensibleBestAnswer: "HRA-directed biopsy resolves the current abnormal screen among the three offered investigations.",
      counterfactual: "With biopsy-confirmed invasive SCC and unresolved local extent, pelvic MRI becomes the appropriate offered next-stage test.",
      deletionTest: ["Without swab provenance the report could be mistaken for histology.", "Without normal palpation the main reassurance error is no longer tested.", "The procedural log establishes the actual specimen history instead of a named instruction to obtain biopsy."],
      sequenceReview: "First node. Feedback stops at histologic assessment and does not identify a lesion treatment or future follow-up finding.",
      repairAndRecheck: "Removed the earlier proposed biopsy-confirmed HSIL premise, which skipped the diagnostic inference. Re-solved all three investigations.",
    },
  },
  {
    slug: "treat-intraepithelial-lesion", caseSlug: "hsil", conceptId: conceptId("hsil-treatment-hiv"),
    previousConceptId: "concept.anal-hsil.high-risk-hpv-association", creationKind: "new", before: null, conceptType: "management",
    objective: "Treat biopsy-established anal HSIL in an adult with HIV rather than infer that virologic control removes its importance.",
    currentUpdate: "HRA identifies two small flat lesions and both are biopsied. Daniel’s HIV RNA remains undetectable on antiretroviral therapy.",
    task: "Which lesion-directed management should be offered to Daniel Mercer after these biopsy findings?",
    exhibit: exhibit([
      ["HRA", "Two accessible flat epithelial lesions; no indurated nodule."],
      ["Both targeted biopsies", "Full-thickness squamous atypia. The basement membrane is intact; represented subepithelial tissue contains no invasive nests."],
      ["HIV care", "Virologic suppression maintained on antiretroviral therapy."],
    ]),
    choices: [
      choice("ablate", "HRA-guided electrocautery ablation", true,
        "The represented disease is intraepithelial. Treating HSIL in adults with HIV reduces cancer progression; electrocautery is a reasonable option for these accessible lesions.",
        "Separate absence of invasion from absence of a treatment indication.",
        "An unbiopsied indurated lesion would require tissue assessment before ablation.", ["hsil-intraepithelial", "treat-hsil-hiv", "hyfrecation"]),
      choice("monitor", "Active monitoring with repeat HRA", false,
        "Monitoring was a real competing strategy, but current HIV guidance recommends treatment of biopsy-confirmed HSIL. Virologic suppression does not replace lesion care.",
        "Read intact membrane and controlled HIV as grounds to wait for progression.",
        "Ongoing HRA surveillance is appropriate after successful lesion treatment.", ["treat-hsil-hiv", "post-hsil-hra"], "timing.test.clinical_procedure"),
      choice("crt", "Fluorouracil–mitomycin chemoradiation", false,
        "The tissue shows intraepithelial disease rather than an invasive canal cancer; cancer chemoradiation would overtreat the represented lesions.",
        "Read full-thickness epithelial atypia as invasion through its boundary.",
        "Representative tissue showing invasive anal-canal SCC with appropriate staging supports a cancer chemoradiation pathway.", ["hsil-intraepithelial", "nonmetastatic-crt", "crt-regimen"]),
    ],
    explanation: "Intact epithelial boundaries and represented stroma distinguish HSIL from invasive cancer. Treat these lesions despite virologic suppression; electrocautery is a supported option, not a proven superior modality.",
    supportingEvidenceClaimIds: ["hsil-intraepithelial", "treat-hsil-hiv", "hyfrecation", "post-hsil-hra", "nonmetastatic-crt", "crt-regimen"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "The report supplies epithelial and stromal observations without a diagnosis label or pre-answer cancer-prevention rule. The key is shortest. ART is shared background care, not attached to a uniquely complete option.",
      sameDecisionStageAndCategory: "Three real management strategies: ablation, active HRA monitoring and invasive-cancer chemoradiation. Monitoring is the closest competitor.",
      reasoningSteps: ["Interpret the epithelial atypia with an intact membrane and represented negative stroma as intraepithelial disease.", "Use the HIV-specific treatment evidence to choose lesion treatment despite suppression."],
      closestError: "Equate no invasion plus controlled HIV with permission to observe untreated HSIL.",
      decidingObservation: "Fully represented intraepithelial lesions in an adult with HIV match the treatment evidence.",
      consequence: "The error leaves a treatable precursor untreated or leads to invasive-cancer overtreatment.",
      residentDifficulty: "Moderate PGY-2/3 prediction requiring tissue architecture and post-ANCHOR evidence. No ranking among otherwise eligible ablative/topical treatments is claimed.",
      singleDefensibleBestAnswer: "Electrocautery is the supported offered lesion treatment; effective topical/other ablative approaches are not declared inferior.",
      counterfactual: "Change the tissue to invasive stromal nests in a staged canal primary and chemoradiation becomes appropriate.",
      deletionTest: ["Without represented subepithelial tissue, the biopsy may not resolve invasion fairly.", "Without HIV context, the strongest trial population no longer matches directly.", "Accessible focal lesions establish the proposed local-treatment setting."],
      sequenceReview: "Prior feedback says why tissue is needed, not how a confirmed precursor is treated. Feedback here does not state the next nodule’s target or a fixed next-test interval.",
      repairAndRecheck: "Rejected an unsupported contest for the best ablation modality. Re-solved treatment versus genuine monitoring using architecture and HIV-specific evidence.",
    },
  },
  {
    slug: "new-nodule-after-hsil", caseSlug: "hsil", conceptId: WORKUP, previousConceptId: null,
    creationKind: "new", before: null, conceptType: "workup",
    objective: "Reassess a new palpable anal lesion after HSIL treatment despite a reassuring screening swab.",
    currentUpdate: "Six months after treatment, Daniel reports focal pain. Cytology is negative, but examination now detects a firm ulcerated nodule at a different position from the treated lesions.",
    task: "Which diagnostic investigation should the clinic arrange for Daniel Mercer’s new anal nodule?",
    exhibit: exhibit([
      ["Current examination", "New indurated ulcerated anal-canal nodule."],
      ["Anal cytology", "No intraepithelial lesion or malignancy reported in the swab."],
      ["Previous treatment", "HRA-directed ablation of the two prior flat lesions; the present nodule is a new finding."],
    ]),
    choices: [
      choice("sample", "Anoscopy with directed biopsy of the nodule", true,
        "A negative screening swab does not establish the histology of a new suspicious palpable lesion. Sample the current target.",
        "Give the new clinical lesion priority over a reassuring screen.",
        "With representative biopsy-confirmed SCC and unresolved local extent, MRI becomes a next-stage investigation.", ["new-lesion-after-hsil", "representative-tissue"], "timing.test.biopsy"),
      choice("swab", "Repeat anal cytology and HPV testing", false,
        "Another screening specimen does not diagnose this new indurated nodule.",
        "Use another swab to resolve a conflict requiring lesion tissue.",
        "Screening belongs in asymptomatic surveillance when there is no suspicious current lesion.", ["new-lesion-after-hsil", "post-hsil-hra"], "timing.test.pathology_review"),
      choice("mri", "Pelvic MRI with local-staging sequences", false,
        "MRI can define extent later but does not replace tissue evaluation of the new lesion.",
        "Treat the nodule as known invasive cancer because HSIL was previously treated.",
        "After tissue confirms invasive disease, pelvic MRI can inform local staging.", ["mri-local", "representative-tissue"], "timing.test.mri"),
    ],
    explanation: "The new lesion changes screening follow-up into a diagnostic problem. Obtain tissue despite the negative swab; treatment of different flat lesions does not settle this finding.",
    supportingEvidenceClaimIds: ["new-lesion-after-hsil", "representative-tissue", "post-hsil-hra", "mri-local"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "No pre-answer field says needs biopsy. All options are investigations with wait proposals. The different target preserves chronology rather than naming a diagnosis. Negative cytology is purposeful conflicting evidence.",
      sameDecisionStageAndCategory: "Three diagnostic investigations for the current lesion.",
      reasoningSteps: ["Recognize that negative screening and treatment of other lesions do not clear a new suspicious nodule.", "Obtain current lesion histology before choosing cancer staging or further dysplasia treatment."],
      closestError: "Let negative cytology and prior ablation overrule a newly palpable lesion.",
      decidingObservation: "New induration and ulceration are unlike the earlier flat sampled lesions.",
      consequence: "Screening reassurance can delay recognition of invasive disease.",
      residentDifficulty: "Moderate PGY-2/3 prediction from a conflicting negative screen and changed target. This is a new variant of the existing tissue-workup concept, not a new construct.",
      singleDefensibleBestAnswer: "Lesion biopsy answers unresolved current histology; the screen cannot establish that result.",
      counterfactual: "If representative tissue already showed SCC and local extent were unresolved, MRI becomes the appropriate offered next-stage test.",
      deletionTest: ["Without the new lesion this becomes a different routine-surveillance problem.", "Without the negative swab the competing reassurance error loses its basis.", "Distinct target chronology prevents treating old tissue as a current result."],
      sequenceReview: "First node: abnormal screen with normal palpation. This node: negative screen with a new mass. Prior feedback supplies neither the new finding nor its conclusion; this encounter contains no repeated scored concept ID.",
      repairAndRecheck: "Reused the existing workup identity to avoid concept inflation. Six months is a sourced follow-up setting, not a test turnaround or universal symptom deadline.",
    },
  },
);

ANAL_CANCER_SPECS.push(
  {
    slug: "irradiated-groin-recurrence", caseSlug: "groin-recurrence", conceptId: conceptId("inguinal-salvage"),
    previousConceptId: CRT, creationKind: "new", before: null, conceptType: "management",
    objective: "Select regional salvage for isolated inguinal recurrence using primary-site status and prior radiation coverage.",
    currentUpdate: "",
    task: "Which local-regional salvage plan should the clinic recommend for Noah Reed’s current anal-cancer recurrence?",
    exhibit: exhibit([
      ["Earlier treatment", "Definitive chemoradiation for anal-canal SCC; the archived radiation plan includes both inguinal basins."],
      ["Current node", "A mobile right inguinal node contains squamous carcinoma matching the original tumor."],
      ["Current anal assessment", "Anoscopy and examination show the treated primary site remains clinically clear."],
      ["Restaging CT and pelvic MRI", "Disease is confined to the right inguinal node; no distant site or pelvic sidewall involvement identified."],
    ]),
    choices: [
      choice("dissect", "Right inguinal lymph-node dissection", true,
        "The active target is an isolated node in a previously irradiated groin. Regional dissection addresses that target rather than removing a controlled primary.",
        "Use recurrence geography and the archived field to select salvage.",
        "With no previous groin irradiation, chemoradiation to that region could become reasonable.", ["irradiated-groin-salvage"]),
      choice("apr", "Salvage abdominoperineal resection", false,
        "APR addresses local primary-site failure; the active target here is inguinal and the canal primary remains controlled.",
        "Apply recurrence-after-chemoradiation means APR without locating the recurrence.",
        "Biopsy-proven isolated resectable canal-primary recurrence supports APR.", ["irradiated-groin-salvage", "salvage-apr"]),
      choice("groin-crt", "Definitive chemoradiation to the right groin", false,
        "The original field included this groin. Selected reirradiation remains specialist work; the offered standard salvage for an isolated operable irradiated nodal target is dissection.",
        "Treat the groin as an untreated region or repeat the original regional strategy automatically.",
        "An isolated inguinal recurrence in an unirradiated groin can be treated with chemoradiation.", ["irradiated-groin-salvage", "nonmetastatic-crt"]),
    ],
    explanation: "Recurrence geography matters. Nodal failure in a previously treated groin with primary-site control supports inguinal dissection planning rather than automatic repeat groin chemoradiation or APR.",
    supportingEvidenceClaimIds: ["irradiated-groin-salvage", "salvage-apr", "nonmetastatic-crt"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "Both dissection and chemoradiation name the groin, so target-word matching cannot select the key. The archived field is a raw observation, not a declaration that all further radiation is forbidden. No unique consultation or caution phrase appears in the key.",
      sameDecisionStageAndCategory: "Three concrete local-regional salvage treatments after confirmation/restaging.",
      reasoningSteps: ["Locate recurrence in the groin while retaining the controlled canal primary.", "Read original radiation coverage and select regional surgical salvage for the already irradiated basin."],
      closestError: "Repeat groin chemoradiation without checking the original field.",
      decidingObservation: "Prior radiation included the involved basin and the primary is clinically clear.",
      consequence: "Wrong field/location assumptions can repeat an unsuitable treatment plan or direct surgery at the controlled primary.",
      residentDifficulty: "Hard PGY-2/3 prediction requiring both recurrence geography and previous field coverage. Extent of dissection and reirradiation eligibility remain specialist decisions.",
      singleDefensibleBestAnswer: "An isolated mobile confirmed node in the irradiated basin supports dissection among these choices; no universal prohibition on reirradiation is asserted.",
      counterfactual: "Keep isolated inguinal recurrence but change the old plan to no groin irradiation: groin chemoradiation becomes a reasonable competing salvage route.",
      deletionTest: ["Without the original field, the dissection-versus-chemoradiation discriminator disappears.", "Without primary control, concurrent local failure could make APR relevant.", "Without tissue and distant staging, this is not established isolated nodal salvage."],
      sequenceReview: "Standalone case, not immediately after an APR node in a fixed sequence. The task names the patient, phase and cancer context independently.",
      repairAndRecheck: "Replaced a generic referral answer with named dissection, APR and groin chemoradiation. Rechecked that regional classification does not alone choose between groin options.",
    },
  },
  {
    slug: "metastatic-first-systemic-line", caseSlug: "distant-recurrence", conceptId: conceptId("metastatic-line-selection"),
    previousConceptId: CRT, creationKind: "new", before: null, conceptType: "management",
    objective: "Select initial metastatic systemic treatment without misclassifying earlier radiosensitizing chemotherapy as platinum-refractory treatment.",
    currentUpdate: "",
    task: "Which systemic treatment should be discussed with oncology for Deirdre Lane’s current metastatic anal-canal squamous cancer?",
    exhibit: exhibit([
      ["Previous treatment", "Definitive pelvic radiation with fluorouracil and mitomycin. No platinum agent or checkpoint inhibitor was given."],
      ["Current staging", "Multiple lesions in both liver lobes and bilateral lung nodules. The treated anal primary remains clinically clear."],
      ["Liver biopsy", "Squamous carcinoma matching the previous anal-canal primary."],
      ["Current function", "Independent in daily activities."],
    ]),
    choices: [
      choice("combo", "Retifanlimab with carboplatin and paclitaxel", true,
        "This is initial systemic treatment of disseminated recurrence, not progression on platinum. The combination has a current US first-line indication in this setting.",
        "Interpret the actual previous drugs and treatment intent before assigning a line of therapy.",
        "Progression on or intolerance to platinum can instead support retifanlimab monotherapy.", ["first-line-retifanlimab", "post-platinum-monotherapy"]),
      choice("mono", "Retifanlimab monotherapy", false,
        "The stated history does not meet the post-platinum progression/intolerance context. Prior fluorouracil–mitomycin chemoradiation is not platinum-refractory metastatic therapy.",
        "Read any prior chemotherapy as enough for a post-platinum monotherapy path.",
        "Progression on platinum-based treatment or platinum intolerance supports the approved monotherapy indication.", ["post-platinum-monotherapy", "first-line-retifanlimab"]),
      choice("fu-mmc", "Fluorouracil and mitomycin chemotherapy", false,
        "This imports the prior radiosensitizing drugs as the systemic plan for disseminated recurrence.",
        "Reuse familiar anal-cancer drugs without accounting for current metastatic treatment intent.",
        "Concurrent fluorouracil and mitomycin with radiation remains established for an appropriate untreated nonmetastatic primary.", ["crt-regimen", "nonmetastatic-crt", "first-line-retifanlimab"]),
    ],
    explanation: "Her earlier chemoradiation did not include platinum or treat this disseminated recurrence. Retifanlimab with carboplatin–paclitaxel is a supported first-line systemic option; monotherapy concerns platinum progression or intolerance.",
    supportingEvidenceClaimIds: ["first-line-retifanlimab", "post-platinum-monotherapy", "crt-regimen", "nonmetastatic-crt"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "The task names systemic treatment because all choices are systemic drug plans, not a key-only FDA-approved property. Two options share retifanlimab. No dose, schedule, survival claim or invented contraindication supplies the answer.",
      sameDecisionStageAndCategory: "Three named systemic drug plans for the current metastatic decision; no operation or vague referral foil.",
      reasoningSteps: ["Interpret disseminated biopsy-matched recurrence and distinguish previous radiosensitizing fluorouracil–mitomycin from platinum therapy.", "Choose a first-line metastatic combination rather than post-platinum monotherapy or recycling the local-regional regimen."],
      closestError: "Select monotherapy because she has already had chemotherapy.",
      decidingObservation: "The prior regimen was fluorouracil–mitomycin with radiation, not platinum progression/intolerance.",
      consequence: "Misread regimen and intent lead to the wrong line-specific systemic pathway.",
      residentDifficulty: "Moderate to hard PGY-2/3 prediction from treatment-line interpretation and the current 2025 approval absent from the old PDQ summary.",
      singleDefensibleBestAnswer: "Distribution and stated history match the combination indication among offered plans. This is a US option, not mandatory therapy or an overall-survival superiority claim.",
      counterfactual: "Replace the history with progression on platinum-based systemic therapy and no prior checkpoint inhibitor: retifanlimab monotherapy becomes an indicated next-line option.",
      deletionTest: ["Without exact previous drugs, monotherapy cannot be ranked fairly.", "Without dissemination and biopsy match, local salvage or another primary remains possible.", "Independence is minimal treatment context; no fitness score or threshold is invented."],
      sequenceReview: "Standalone clinic chart-review case; no earlier drug question rehearses the line-specific answer. Previous treatment is completely stated here.",
      repairAndRecheck: "Used the May 2025 FDA approval and May 2026 NCI drug page. Replaced a weak surgery foil with a credible post-platinum monotherapy error and re-solved all drug plans.",
    },
  },
);

// Same construct, independent cases, identical option labels and opposite keys.
for (const adverse of [false, true]) {
  const name = adverse ? "Renee Carter" : "Paula Ellis";
  ANAL_CANCER_SPECS.push({
    slug: adverse ? "adverse-margin-histology" : "clear-margin-observation",
    caseSlug: adverse ? "margin-poor" : "margin-favorable",
    conceptId: conceptId("margin-adjuvant-selection"), previousConceptId: CRT,
    creationKind: "new", before: null, conceptType: "management",
    objective: "Choose postoperative care for a small anal-margin SCC using site, differentiation and clearance rather than a blanket canal pathway.",
    currentUpdate: "",
    task: `What should be planned next for ${name}’s excised anal-margin squamous cancer?`,
    exhibit: exhibit([
      ["Operative map", "The lesion was on hair-bearing perianal skin; anoscopy showed no mucosal extension. The excision did not enter sphincter muscle."],
      ["Definitive specimen", `${adverse ? "1.6" : "1.4"}-cm invasive squamous carcinoma, ${adverse ? "poorly" : "well"} differentiated. No lymphovascular or perineural invasion reported. All margins are negative; nearest measured clearance is 12 mm.`],
      ["Regional and distant assessment", "No suspicious groin or pelvic node; no distant metastasis identified."],
    ]),
    choices: [
      choice("follow", "Clinical and anoscopic surveillance", !adverse,
        adverse ? "Negative margins do not remove the adverse differentiation that puts this lesion outside the selected excision pathway."
          : "The small well-differentiated skin-based tumor has generous negative clearance and no nodal disease; further immediate cancer treatment is not required among these options.",
        adverse ? "Use margin negativity as the only postoperative eligibility criterion." : "Apply the selected margin-lesion pathway rather than the cancer label in isolation.",
        adverse ? "Well-differentiated histology with the same generous clearance supports surveillance."
          : "Poorly differentiated histology with the same site and clearance would favor the offered chemoradiation plan.",
        ["selected-margin-excision", "adverse-margin-histology"], "timing.test.clinical_procedure"),
      choice("wider", "Wider perianal re-excision", false,
        "Clearance is already generous and negative. More local resection does not address the actual treatment boundary in this record.",
        "Treat the invasive label or adverse histology as an unsolved local-clearance problem.",
        "Gross residual disease or an involved edge creates a new clearance issue. The precise re-excision-versus-adjuvant ranking is held for clinical adjudication, not taught here.",
        ["selected-margin-excision", "margin-disagreement-held"]),
      choice("crt", "Fluorouracil–mitomycin chemoradiation", adverse,
        adverse ? "Poor differentiation excludes this lesion from the selected excision pathway despite small size and generous negative clearance."
          : "This adds treatment beyond the represented favorable, adequately excised skin-margin lesion; canal origin or an adverse histologic feature would change the judgment.",
        adverse ? "Use differentiation as a treatment-selection feature rather than equating small size with favorable biology."
          : "Apply the usual anal-canal regimen to every anal-region squamous cancer.",
        adverse ? "Change to well-differentiated histology with the same generous clearance and surveillance becomes appropriate."
          : "The same lesion with poorly differentiated histology favors this cancer-treatment pathway.",
        ["selected-margin-excision", "adverse-margin-histology", "crt-regimen"]),
    ],
    explanation: adverse
      ? "Small size and negative margins do not make poorly differentiated anal-margin SCC a favorable excision case. Offer multidisciplinary chemoradiation planning rather than another clearance operation or surveillance."
      : "The small skin-based, well-differentiated, node-negative SCC has generous negative clearance. Use surveillance rather than automatically treating it as a canal primary; no minimum margin cutoff is taught.",
    supportingEvidenceClaimIds: ["selected-margin-excision", "adverse-margin-histology", "crt-regimen", "margin-disagreement-held"].map(claimId),
    manualAuthorGate: {
      coverTheKey: adverse
        ? "Options match the favorable sibling and the key switches. No pre-answer sentence calls poor grade high-risk or explains its consequence. Small size and negative margins must be weighed against differentiation."
        : "The task supplies no key-only preservation goal. All options are specific postoperative plans. Twelve millimeters is an observed specimen clearance, not a claimed universal rule; the report does not call the patient eligible for surveillance.",
      sameDecisionStageAndCategory: "Three postoperative cancer-care plans, identical across independent sibling cases; no cautious diagnostic key against premature treatments.",
      reasoningSteps: adverse
        ? ["Recognize adverse differentiation despite otherwise favorable site, size and clearance.", "Choose the cancer-treatment pathway instead of surveillance or another clearance operation."]
        : ["Distinguish an adequately excised favorable skin-margin cancer from a canal primary.", "Apply the selected excision pathway to avoid unnecessary adjuvant treatment."],
      closestError: adverse ? "Observe because diameter and margins look favorable." : "Apply routine canal chemoradiation to a favorable excised skin-margin tumor.",
      decidingObservation: adverse ? "Poor differentiation despite small skin-based disease and 12-mm negative clearance." : "Well differentiation, skin origin, small size, generous clearance and no regional disease.",
      consequence: adverse ? "An important adverse feature is ignored when selecting postoperative care." : "Avoidable chemoradiation or repeat local surgery.",
      residentDifficulty: adverse
        ? "Moderate to hard PGY-2/3 prediction because favorable size/site/margins make surveillance credible, but grade changes the pathway."
        : "Moderate PGY-2/3 prediction. A resident familiar with selected excision may find this easier; independent review must assess value rather than infer an accepted basic exception.",
      singleDefensibleBestAnswer: adverse
        ? "Poor grade excludes the selected excision pathway; generous clearance makes re-excision a poor response to the actual adverse feature."
        : "This lesion lies beyond disputed close-margin boundaries and has no canal extension, adverse differentiation or regional disease requiring added treatment among these choices.",
      counterfactual: adverse ? "Change poor to well differentiation with everything else held constant and surveillance becomes best."
        : "Change well to poor differentiation with everything else held constant and chemoradiation becomes best.",
      deletionTest: ["Without the operative map canal versus skin origin is unresolved.", "Without differentiation the two sibling plans cannot be distinguished.", "Without clearance/nodal assessment another added-treatment indication could remain.", "Negative lymphovascular/perineural findings keep grade as the deliberate changed adverse feature."],
      sequenceReview: "Standalone sibling cases, never a fixed two-node sequence. One new stable construct with two consequential variants and opposite keys; no cosmetic name-only variant count.",
      repairAndRecheck: "Rejected a close-margin contest because guidance differs. Used generous observed clearance and changed histology. Wider-excision counterfactual explicitly preserves the unresolved margin decision rather than ranking it.",
    },
  });
}

ANAL_CANCER_SPECS.push(
  {
    slug: "confirm-local-recurrence", caseSlug: "local-recurrence", conceptId: conceptId("recurrence-confirmation"),
    previousConceptId: WORKUP, creationKind: "new", before: null, conceptType: "workup",
    objective: "Confirm viable tumor histologically when a new treated-site finding may otherwise be mistaken for scar.",
    currentUpdate: "",
    task: "Which investigation should the clinic arrange next for Maria Bennett’s new post-treatment anal nodule?",
    exhibit: exhibit([
      ["Prior follow-up", "Clinical complete response after definitive fluorouracil–mitomycin chemoradiation; later examinations documented a flat scar."],
      ["Current examination", "New firm nodule within the scar, with contact bleeding."],
      ["Pelvic MRI", "Dedicated diagnostic T2 and diffusion images show focal scar-site thickening. The report cannot separate viable tumor from treatment-related change."],
    ]),
    choices: [
      choice("tissue", "Anoscopy-guided biopsy of the scar nodule", true,
        "The new clinical abnormality needs current histology before radical salvage; indeterminate imaging is not tissue proof of recurrence.",
        "Resolve the scar-versus-tumor discrepancy with tissue.",
        "With biopsy-confirmed recurrence and undefined local extent, MRI becomes the next staging step.", ["recurrence-histology", "representative-tissue"], "timing.test.biopsy"),
      choice("mri", "Repeat pelvic MRI with diffusion imaging", false,
        "The dedicated diagnostic examination already leaves viability uncertain; repeating it does not provide histology of this accessible target.",
        "Assume the current scan lacked the appropriate acquisition or that another image proves viability.",
        "If the existing images were only localizers or nondiagnostic, a proper pelvic acquisition would be appropriate.", ["mri-local", "recurrence-histology"], "timing.test.mri"),
      choice("pet", "FDG PET/CT for metabolic reassessment", false,
        "Metabolic findings can complement restaging but do not provide histologic confirmation before radical salvage of an accessible nodule.",
        "Substitute uptake for viable-tumor confirmation in an irradiated field.",
        "Established recurrence with unresolved distant distribution can justify complementary PET/CT.", ["ct-distant", "recurrence-histology"], "timing.test.pet_ct"),
    ],
    explanation: "Change from a flat scar to a firm bleeding nodule matters, but it is not itself tissue proof of recurrence. Obtain histology before selecting radical salvage treatment.",
    supportingEvidenceClaimIds: ["recurrence-histology", "representative-tissue", "mri-local", "ct-distant"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "No pre-answer field calls this recurrent SCC or instructs biopsy. All choices are investigations with wait proposals. Acquired sequences, not an unsupported adequate-scan label, establish the imaging scope.",
      sameDecisionStageAndCategory: "Three investigations for uncertain current lesion viability; treatment choices belong to the later node.",
      reasoningSteps: ["Interpret newly acquired nodularity against the previously flat scar while recognizing indeterminate post-treatment imaging.", "Seek histologic confirmation before radical salvage rather than treat another image as tissue proof."],
      closestError: "Accept functional imaging as sufficient proof for major salvage surgery.",
      decidingObservation: "New palpable change with a completed indeterminate local MRI and no current lesion histology.",
      consequence: "Radical treatment could be offered for unconfirmed recurrence, or true recurrence diagnosed late.",
      residentDifficulty: "Moderate PGY-2/3 prediction from post-treatment evidence limits and a credible repeat-imaging error. No early-response timing rule is scored.",
      singleDefensibleBestAnswer: "Biopsy addresses current viable-tumor uncertainty in an accessible newly abnormal target.",
      counterfactual: "If biopsy already confirmed recurrence and the only pelvic images were localizers, dedicated pelvic MRI becomes the appropriate offered next-stage test.",
      deletionTest: ["Without prior flat scar this could be stable post-treatment change.", "Without acquisition details repeat MRI may be a reasonable completion test.", "The indeterminate report explains why imaging has not settled tissue viability."],
      sequenceReview: "First node. Feedback says confirmation is needed but names no APR or later treatment. Subsequent pathology/restaging are not visible.",
      repairAndRecheck: "Removed redundant PET uptake from the exhibit. Retained a new trajectory and completed local acquisition, then re-solved the three tests.",
    },
  },
  {
    slug: "salvage-local-failure", caseSlug: "local-recurrence", conceptId: conceptId("salvage-apr"),
    previousConceptId: CRT, creationKind: "new", before: null, conceptType: "management",
    objective: "Select salvage APR for confirmed resectable isolated local failure after definitive chemoradiation.",
    currentUpdate: "Maria remains independent in daily activities at her clinic follow-up.",
    task: "Which cancer-treatment plan should now be recommended for Maria Bennett’s confirmed local failure?",
    exhibit: exhibit([
      ["Current biopsy", "Invasive squamous carcinoma matching the original anal primary."],
      ["Prior treatment", "Completed definitive pelvic chemoradiation followed by a documented complete response."],
      ["Current MRI", "Tumor occupies the canal and sphincter complex. Pelvic sidewall planes are preserved; no adjacent-organ or nodal lesion described."],
      ["CT chest, abdomen and pelvis", "No distant metastatic lesion identified."],
    ]),
    choices: [
      choice("apr", "Salvage abdominoperineal resection", true,
        "This is confirmed isolated local failure in a previously irradiated primary with an anatomic basis for complete resection. APR is the standard salvage operative pathway.",
        "Use tissue, previous treatment and current distribution together.",
        "Disseminated distant metastases would make systemic treatment the main pathway.", ["salvage-apr"]),
      choice("crt", "Repeat definitive fluorouracil–mitomycin chemoradiation", false,
        "That repeats the primary full definitive pathway after local failure. Selected reirradiation requires specialist planning and is not automatic repetition of initial treatment.",
        "Apply the initial treatment rule again without incorporating prior radiation and local failure.",
        "An untreated nonmetastatic canal primary fits initial concurrent chemoradiation.", ["nonmetastatic-crt", "crt-regimen", "salvage-apr"]),
      choice("systemic", "Retifanlimab with carboplatin and paclitaxel", false,
        "This systemic option addresses inoperable recurrent or metastatic disease. The confined failure has a standard potentially curative local salvage pathway.",
        "Read recurrent as synonymous with inoperable or metastatic.",
        "Inoperable pelvic recurrence or disseminated metastases supports systemic oncology planning.", ["salvage-apr", "first-line-retifanlimab"]),
    ],
    explanation: "This is a salvage decision after tissue-confirmed local failure. With no distant disease and preserved resection planes, recommend multidisciplinary salvage APR planning.",
    supportingEvidenceClaimIds: ["salvage-apr", "nonmetastatic-crt", "crt-regimen", "first-line-retifanlimab"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "No header or lead-in names the operation. Removed an author assertion that R0 is feasible and retained the observed planes. Each option is a specific treatment; the key is not uniquely cautious or comprehensive.",
      sameDecisionStageAndCategory: "Three treatment plans after confirmation and restaging; no diagnostic information-gathering key.",
      reasoningSteps: ["Combine viable tumor, prior radiation and distant restaging to identify isolated local failure.", "Use the anatomic context to choose salvage APR instead of primary-regimen repetition or a systemic inoperable/metastatic pathway."],
      closestError: "Choose metastatic systemic therapy simply because the tumor recurred.",
      decidingObservation: "Biopsy-proven canal recurrence in a previously irradiated field, preserved sidewall planes and no distant lesion.",
      consequence: "A potentially curative local salvage plan can be replaced with the wrong treatment intent.",
      residentDifficulty: "Moderate to hard PGY-2/3 prediction distinguishing untreated disease, isolated local failure and systemic recurrence.",
      singleDefensibleBestAnswer: "The represented tissue/distribution fits standard salvage APR; multidisciplinary assessment of complete resection remains required.",
      counterfactual: "Disseminated biopsy-confirmed distant disease makes the offered systemic regimen the main pathway.",
      deletionTest: ["Without prior radiation, initial chemoradiation can become correct.", "Without current tissue, radical salvage is premature.", "Without distant restaging or resection planes, inoperable/metastatic systemic planning may compete."],
      sequenceReview: "Prior feedback only establishes the need for histology. This node introduces confirmation and the new distribution/resection evidence, without reusing a taught treatment answer.",
      repairAndRecheck: "Balanced choice scopes, removed a weak local-excision foil and replaced feasibility permission with observed planes before re-solving.",
    },
  },
);

export const ANAL_CANCER_CASE_SPECS: CaseSpec[] = [
  { slug: "new-lesion", patientDisplayName: "Evelyn Marsh", age: 59, sex: "Female", complaint: "Anal bleeding",
    presentation: "{patientName}, a 59-year-old woman, attends clinic for persistent bleeding from an anal lesion after an outside procedure.",
    nodes: ["sample-provenance", "local-staging-record", "regional-node-treatment"] },
  { slug: "hsil", patientDisplayName: "Daniel Mercer", age: 48, sex: "Male", complaint: "Anal screening review",
    presentation: "{patientName}, a 48-year-old man living with HIV, attends clinic to review outside anal-screening results.",
    nodes: ["cytology-to-histology", "treat-intraepithelial-lesion", "new-nodule-after-hsil"] },
  { slug: "margin-favorable", patientDisplayName: "Paula Ellis", age: 62, sex: "Female", complaint: "Skin excision follow-up",
    presentation: "{patientName}, a 62-year-old woman, attends clinic after outside excision of a perianal skin lesion.", nodes: ["clear-margin-observation"] },
  { slug: "margin-poor", patientDisplayName: "Renee Carter", age: 57, sex: "Female", complaint: "Skin excision follow-up",
    presentation: "{patientName}, a 57-year-old woman, attends clinic after outside excision of a perianal skin lesion.", nodes: ["adverse-margin-histology"] },
  { slug: "local-recurrence", patientDisplayName: "Maria Bennett", age: 64, sex: "Female", complaint: "Recurrent anal bleeding",
    presentation: "{patientName}, a 64-year-old woman, comes to clinic to review a new anal finding 18 months after definitive anal-cancer chemoradiation.",
    nodes: ["confirm-local-recurrence", "salvage-local-failure"] },
  { slug: "groin-recurrence", patientDisplayName: "Noah Reed", age: 67, sex: "Male", complaint: "Groin lump",
    presentation: "{patientName}, a 67-year-old man, attends clinic to review an outside groin-node biopsy three years after treatment of anal-canal cancer.", nodes: ["irradiated-groin-recurrence"] },
  { slug: "distant-recurrence", patientDisplayName: "Deirdre Lane", age: 60, sex: "Female", complaint: "Liver biopsy review",
    presentation: "{patientName}, a 60-year-old woman, attends clinic to review outside records after anal-canal cancer treatment and discovery of liver lesions.", nodes: ["metastatic-first-systemic-line"] },
];

// Remove framing-only updates; raw record observations carry the decision.
for (const spec of ANAL_CANCER_SPECS) {
  if (["sample-provenance", "regional-node-treatment", "cytology-to-histology"].includes(spec.slug)) spec.currentUpdate = "";
  if (spec.slug === "local-staging-record") spec.currentUpdate = "Biopsy of Evelyn’s canal mass now shows invasive squamous carcinoma.";
  if (spec.slug === "treat-intraepithelial-lesion") spec.currentUpdate = "";
  if (spec.slug === "new-nodule-after-hsil") spec.currentUpdate = "Six months after treatment, Daniel reports new focal pain.";
}

export const ANAL_CANCER_PROPOSALS = ANAL_CANCER_SPECS.map(spec => ({
  ...ANAL_CANCER_REVIEW, ...spec,
  questionVariantId: questionId(spec.slug), nodeId: nodeId(spec.slug), caseId: caseId(spec.caseSlug),
  conceptRelation: [WORKUP, LOCAL, CRT].includes(spec.conceptId) ? "reuse" as const : "new_meaning" as const,
  shuffleAnswers: true as const, pipelinePassed: false,
  choices: spec.choices.map(c => ({ ...c, id: `choice.topic.anal-cancer.${spec.slug}.${c.id}` })),
}));
export const ANAL_CANCER_SOURCES = ledger.sources as ClinicalSource[];
export const ANAL_CANCER_CLAIMS = ledger.claims as EvidenceClaim[];

const caseSpecFor = (slug: string) => ANAL_CANCER_CASE_SPECS.find(c => c.slug === slug)!;
const template = (text: string, slug: string) => {
  const c = caseSpecFor(slug);
  return text.replaceAll(c.patientDisplayName, "{patientName}").replaceAll(c.patientDisplayName.split(" ")[0]!, "{patientName}");
};
const labels = (ids: string[]) => {
  const sourceIds = new Set(ANAL_CANCER_CLAIMS.filter(c => ids.includes(c.id)).flatMap(c => c.sourceIds));
  return ANAL_CANCER_SOURCES.filter(s => sourceIds.has(s.id)).map(s => s.title);
};

export const ANAL_CANCER_QUESTIONS: QuestionVariant[] = ANAL_CANCER_PROPOSALS.map(p => ({
  ...ANAL_CANCER_REVIEW, id: p.questionVariantId, conceptId: p.conceptId,
  stem: template(p.task, p.caseSlug), exhibit: p.exhibit,
  answerChoices: p.choices.map(c => ({ id: c.id, label: c.label, isCorrect: c.isCorrect,
    rationale: c.rationale, distractorRationale: c.isCorrect ? null : c.rationale })),
  explanation: p.explanation, supportingEvidenceClaimIds: p.supportingEvidenceClaimIds,
}));

export const ANAL_CANCER_CONCEPT_PROPOSALS = [...new Set(ANAL_CANCER_PROPOSALS.map(p => p.conceptId))].map(id => {
  const p = ANAL_CANCER_PROPOSALS.find(p => p.conceptId === id)!;
  return { ...ANAL_CANCER_REVIEW, id, displayName: p.objective, learningObjective: p.objective,
    conceptType: p.conceptType, earliestFacilityStage: 3, educationalTier: 2,
    previousConceptId: p.previousConceptId, conceptRelation: p.conceptRelation,
    evidenceClaimIds: [...new Set(ANAL_CANCER_PROPOSALS.filter(n => n.conceptId === id).flatMap(n => n.supportingEvidenceClaimIds))] };
});
export const ANAL_CANCER_CONCEPTS: TestedConcept[] = ANAL_CANCER_CONCEPT_PROPOSALS.map(c => testedConceptSchema.parse({
  id: c.id, displayName: c.displayName, learningObjective: c.learningObjective,
  conceptType: c.conceptType, earliestFacilityStage: c.earliestFacilityStage,
}));
export const ANAL_CANCER_NODES: DecisionNode[] = ANAL_CANCER_PROPOSALS.map(p => {
  const final = caseSpecFor(p.caseSlug).nodes.at(-1) === p.slug;
  return decisionNodeSchema.parse({
    id: p.nodeId, questionVariantId: p.questionVariantId, primaryConceptId: p.conceptId,
    ...(p.currentUpdate ? { currentUpdate: template(p.currentUpdate, p.caseSlug) } : {}),
    stem: template(p.task, p.caseSlug), exhibit: p.exhibit,
    answerChoices: p.choices.map(c => ({ id: c.id, label: c.label, isCorrect: c.isCorrect, rationale: c.rationale, serviceRequest: null })),
    shuffleAnswers: true, explanation: p.explanation, sourceLabels: labels(p.supportingEvidenceClaimIds), resultGateAfter: null,
    terminalDispositions: final ? p.choices.filter(c => !c.isCorrect).map(c => ({
      answerChoiceId: c.id, kind: "no_terminal_outcome",
      consequenceNarrative: "This authoring preview records interpretation feedback and simulates no patient outcome.",
      clinicalRationale: c.rationale, sourceLabels: labels(c.evidenceClaimIds),
    })) : [],
  });
});
export const ANAL_CANCER_CASES: SyntheticClinicalCase[] = ANAL_CANCER_CASE_SPECS.map(c => {
  const demographics = { ageYears: c.age, sexLabel: c.sex };
  const nodes = c.nodes.map(slug => ANAL_CANCER_NODES.find(n => n.id === nodeId(slug))!);
  return syntheticClinicalCaseSchema.parse({
    id: caseId(c.slug), displayName: c.complaint,
    patientPresentationVariantId: `presentation.topic.anal-cancer.${c.slug}.v1`,
    patientDisplayName: c.patientDisplayName, prototypeDemographics: demographics,
    chiefComplaint: c.complaint, presentation: c.presentation,
    approvedInstantiationProfiles: [{ id: `profile.topic.anal-cancer.${c.slug}.v1`, prototypeDemographics: demographics,
      chiefComplaint: c.complaint, presentation: c.presentation }],
    tutorialEligible: false, routineEligible: true, earliestFacilityStage: 3,
    requiredClinicalSetting: "clinic", requiredCapabilityIds: [], rewardTierId: "reward.clinic_basic",
    sourceLabels: [...new Set(nodes.flatMap(n => n.sourceLabels))], decisionNodes: nodes,
    learningSummary: nodes.map(n => n.explanation).join(" "),
  });
});
export const ANAL_CANCER_TIMING_PROPOSALS: AnswerChoiceTimingRegistryEntry[] = ANAL_CANCER_PROPOSALS.map(p =>
  answerChoiceTimingRegistryEntrySchema.parse({
    caseId: p.caseId, nodeId: p.nodeId, questionVariantId: p.questionVariantId,
    classification: p.choices.some(c => c.timingProfileId) ? { kind: "test_choices",
      choices: p.choices.map(c => ({ choiceId: c.id, choiceLabel: c.label,
        timing: c.timingProfileId ? { kind: "test", timingProfileId: c.timingProfileId } : { kind: "no_test" } }))
    } : { kind: "no_test" },
  }));
export const ANAL_CANCER_ORDER_PROPOSALS = ANAL_CANCER_TIMING_PROPOSALS.flatMap(entry =>
  entry.classification.kind === "test_choices" ? entry.classification.choices.filter(c => c.timing.kind === "test").map(c => ({
    ...ANAL_CANCER_REVIEW, caseId: entry.caseId, nodeId: entry.nodeId, questionVariantId: entry.questionVariantId,
    choiceId: c.choiceId, choiceLabel: c.choiceLabel, timing: c.timing,
    disposition: { kind: "not_executed" as const, reason: "future_planned" as const },
    executionScope: "clinic_plan_or_outside_record_review", serviceRequest: null, resultGateAfter: null,
  })) : []);
export const ANAL_CANCER_SOURCE_LINKS = ANAL_CANCER_SOURCES.map(s => ({
  ...ANAL_CANCER_REVIEW, sourceId: s.id, label: s.title, attribution: s.completeCitation,
  licenseLabel: s.licenseLabel, href: s.officialUrl!, target: "_blank" as const,
  rel: "noopener noreferrer" as const, referrerPolicy: "no-referrer" as const,
  changes: "Independent factual synthesis and fictional application; no protected expression or visual reproduced.",
}));
export const ANAL_CANCER_AUTHOR_CHECKS = ANAL_CANCER_PROPOSALS.map(p => ({
  ...ANAL_CANCER_REVIEW, questionVariantId: p.questionVariantId, ...p.manualAuthorGate,
}));
export const ANAL_CANCER_STATEMENT_MAPPINGS = ANAL_CANCER_PROPOSALS.map(p => ({
  ...ANAL_CANCER_REVIEW, questionVariantId: p.questionVariantId, caseId: p.caseId,
  constructedFields: ["presentation", "prototypeDemographics", "currentUpdate", "exhibit"],
  constructedBasis: "Original finite fictional observations, specimen maps and chronology. No new probability, clinical cutoff, dose, regimen schedule or diagnostic duration is invented.",
  assertions: [
    { field: "learningObjective", text: p.objective, claimIds: p.supportingEvidenceClaimIds },
    { field: "explanation", text: p.explanation, claimIds: p.supportingEvidenceClaimIds },
    ...p.choices.flatMap(c => [
      { field: `answerChoices[id=${c.id}].rationale`, text: c.rationale, claimIds: c.evidenceClaimIds },
      { field: `answerChoices[id=${c.id}].counterfactual`, text: c.counterfactual, claimIds: c.evidenceClaimIds },
    ]),
  ],
}));
export const ANAL_CANCER_CASE_REVIEWS = ANAL_CANCER_CASE_SPECS.map(c => ({
  ...ANAL_CANCER_REVIEW, caseId: caseId(c.slug), educationalTier: 2,
  patientAcuity: "stable", historicalAcuity: "outside oncology workup or previously treated disease",
  facilityProgressionLevel: 3, requiredCapabilityIds: [] as string[], clinicalSetting: "clinic",
  selectionConstraint: c.nodes.length > 1
    ? "Paired-only sidecar coverage. Existing all-concepts-unseen/due eligibility applies; a future-due companion can block selection."
    : "Standalone sidecar coverage.",
}));
export const ANAL_CANCER_PREVIEW_RELEASE = validateSyntheticClinicalRelease({
  id: "clinical.synthetic.prototype.v1", schemaVersion: 1,
  publicationStatus: "synthetic_unapproved_prototype",
  disclaimer: "Synthetic authoring preview, not clinically approved. Exact drafts need independent review, manager admission and Melissa Rowland’s clinical sign-off.",
  concepts: ANAL_CANCER_CONCEPTS, cases: ANAL_CANCER_CASES,
});
export const ANAL_CANCER_MANIFEST = {
  ...ANAL_CANCER_REVIEW, scope: "explicit_import_authoring_sidecar",
  reviewDisplay: "key shown first for review only.",
  caseCount: ANAL_CANCER_CASES.length, nodeCount: ANAL_CANCER_QUESTIONS.length,
  conceptCount: ANAL_CANCER_CONCEPTS.length, pipelinePassed: false, managerAccepted: false,
  clinicalApproval: false, publicReleaseAuthorized: false,
};

/** v1 exports above are the exact reviewed archive. Use CURRENT_ARTIFACTS below
 * for the response queue; a revised item has no independent PASS yet. */
export const ANAL_CANCER_RESPONSE_VERSION = "question-topic.anal-cancer.2026-11-11.v2";
const responseReview = { ...ANAL_CANCER_REVIEW, contentVersion: ANAL_CANCER_RESPONSE_VERSION };
const responseQuestionId = (slug: string) => `question.topic.anal-cancer.${slug}.v2`;
const responseNodeId = (slug: string) => `node.topic.anal-cancer.${slug}.v2`;
const responseCaseId = (slug: string) => `case.topic.anal-cancer.${slug}.v2`;
function revisedSpec(slug: string, patch: Partial<NodeSpec>): NodeSpec {
  const original = ANAL_CANCER_SPECS.find(n => n.slug === slug)!;
  return { ...original, ...patch, creationKind: "Rewrite", before: [questionId(slug)] };
}
export const ANAL_CANCER_REVISED_SPECS: NodeSpec[] = [
  revisedSpec("sample-provenance", {
    caseSlug: "sample-depth",
    objective: "Interpret represented biopsy architecture before deciding between additional block sections and new lesion tissue.",
    currentUpdate: "",
    task: "Which diagnostic step should the clinic arrange now for Evelyn Marsh’s anal lesion?",
    exhibit: exhibit([
      ["Clinic examination", "A firm anal-wall nodule lies beneath a shallow left-lateral ulcer and bleeds with contact."],
      ["Outside procedure map", "Forceps biopsies were taken from the left-lateral ulcer edge."],
      ["Histology", "Squamous epithelial strips show high-grade atypia. No connective tissue is present on the examined levels."],
      ["Block inventory", "The remaining embedded material consists of epithelial strips."],
    ]),
    choices: [
      choice("incision", "Anoscopy-guided incisional biopsy", true,
        "The biopsy sampled the correct surface site but contains no tissue that characterizes the underlying firm nodule. Obtain representative lesion architecture rather than infer that epithelial dysplasia excludes invasion.",
        "Reconcile the sampled layers with the palpable abnormality before selecting how to obtain diagnostic tissue.",
        "If the block contained unexamined connective tissue representing the nodule, specialist deeper-level review could clarify invasion without a new acquisition.",
        ["representative-tissue", "sampling-limits", "r2.epithelial-sample-limits"], "timing.test.biopsy"),
      choice("levels", "Specialist review with additional block sections", false,
        "Additional sections can reassess the submitted epithelium but cannot create unsampled underlying tissue. The block inventory does not supply the nodule's architecture.",
        "Treat a correct surface biopsy location as proof that the clinically important deeper tissue is in the block.",
        "This is reasonable when retained tissue actually includes the unresolved lesion compartment and further sections can evaluate it.",
        ["sampling-limits", "r2.epithelial-sample-limits"], "timing.test.pathology_review"),
      choice("swab", "Repeat anal cytology with HPV testing", false,
        "A swab cannot supply tissue architecture of this palpable lesion or settle whether its deeper tissue is invasive.",
        "Use a less invasive epithelial test to resolve a question about underlying lesion architecture.",
        "Anal cytology can be used for appropriate asymptomatic screening rather than as the diagnostic endpoint for a palpable nodule.",
        ["representative-tissue", "abnormal-cytology-hra"], "timing.test.pathology_review"),
    ],
    explanation: "The sampled site is correct, but represented tissue matters as well as location. Epithelial atypia does not characterize the firm underlying nodule; obtain representative tissue rather than use extra levels of epithelial material as proof about invasion.",
    supportingEvidenceClaimIds: ["representative-tissue", "sampling-limits", "r2.epithelial-sample-limits", "abnormal-cytology-hra"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "The neutral diagnostic-step task allows both tissue acquisition and processing of existing tissue. Removed the separate benign tag and labels repeating canal mass only in the key. All labels name a diagnostic process; deeper-section review remains a credible competitor until the layer/block observations are interpreted.",
      sameDecisionStageAndCategory: "Three diagnostic plans: new tissue acquisition, additional evaluation of retained tissue, and epithelial screening. No treatment option is mixed in.",
      reasoningSteps: ["Distinguish epithelial high-grade atypia from an assessment of invasion in the underlying palpable nodule.", "Use the epithelial-only block inventory to choose representative new tissue rather than additional levels that cannot include the missing compartment."],
      closestError: "Assume a biopsy from the correct lesion location necessarily contains the tissue needed to assess its full clinical abnormality.",
      decidingObservation: "Both examined levels and retained block material contain epithelial strips, whereas examination identifies a firm underlying nodule.",
      consequence: "The nodule's diagnosis could be delayed by treating surface dysplasia or another epithelial result as an adequate assessment of deeper disease.",
      residentDifficulty: "Fair moderate PGY-2/3 author prediction. Layer-versus-target adequacy creates two linked inferences; no hard label or basic-item exception is claimed.",
      singleDefensibleBestAnswer: "Incisional lesion tissue addresses the unrepresented architecture; review cannot recover tissue not submitted and a swab cannot establish it.",
      counterfactual: "Change the block inventory to retained unexamined connective tissue representing the nodule: specialist deeper-level review becomes a reasonable first diagnostic step.",
      deletionTest: ["Remove the nodule finding and the need to assess underlying architecture is no longer established.", "Remove the block inventory and deeper levels become a genuinely unresolved alternative.", "Keep the sampled location because this revision deliberately tests depth/architecture rather than another wrong-site match."],
      sequenceReview: "Standalone response case. No earlier answer establishes sampling insufficiency or rehearses the biopsy choice; no later staging result is visible.",
      repairAndRecheck: "Addressed category mismatch and both target-matching cues. Re-solved matched-location but unrepresented-layer evidence against retained-block review; no exact biopsy depth cutoff or unsupported route hierarchy is invented.",
    },
  }),
  revisedSpec("local-staging-record", {
    caseSlug: "local-extent",
    objective: "Choose an appropriate local-extent investigation after interpreting the clinical canal constraint and completed distant staging.",
    currentUpdate: "",
    task: "Which additional imaging investigation should be arranged for Evelyn Marsh’s anal-cancer treatment planning?",
    exhibit: exhibit([
      ["Biopsy", "Invasive squamous carcinoma from the anal-canal lesion."],
      ["Examination", "A firm annular narrowing limits passage beyond the distal canal. Stool continues to pass; there is no vomiting."],
      ["Diagnostic CT chest, abdomen and pelvis", "A bulky canal mass contacts the posterior vaginal wall; that interface is indistinct. No distant lesion is identified."],
    ]),
    choices: [
      choice("mri", "Pelvic MRI", true,
        "The unresolved issue is the primary's relationship to adjacent pelvic structures. MRI provides local anatomic coverage without passing a probe through the narrowed canal.",
        "Interpret the unresolved local interface and the acquisition constraint together.",
        "If adequate local MRI already mapped the interface but the remaining question were systemic nodal distribution, PET/CT could supply complementary staging information.",
        ["mri-local", "r2.eus-stenosis-limit"], "timing.test.mri"),
      choice("eus", "Endoanal ultrasonography", false,
        "Ultrasound can assess selected local lesions, but canal narrowing limits probe-based assessment and its coverage is less comprehensive for the represented pelvic extent question.",
        "Use a local wall-staging modality without accounting for the stenotic acquisition or required field of view.",
        "For a small nonstenotic lesion when MRI cannot be obtained, endoanal ultrasound is a reasonable local-assessment alternative.",
        ["mri-local", "r2.eus-stenosis-limit"], "timing.test.advanced_diagnostic"),
      choice("pet", "FDG PET/CT", false,
        "Metabolic staging can supplement the workup, but the current unresolved question concerns a specific local soft-tissue interface rather than a demonstrated systemic distribution gap.",
        "Treat completed distant staging as a reason to add another whole-body study instead of resolving local extent.",
        "An unresolved nodal or distant distribution question after appropriate local assessment can justify complementary PET/CT.",
        ["mri-local", "ct-distant"], "timing.test.pet_ct"),
    ],
    explanation: "Distant CT assessment does not settle local invasion. The indistinct pelvic interface and narrowed canal favor pelvic MRI over probe-based ultrasound or another whole-body metabolic study for the current planning question.",
    supportingEvidenceClaimIds: ["mri-local", "ct-distant", "r2.eus-stenosis-limit"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "Removed archive completeness, transfer omissions and the task word review. All alternatives are actual imaging acquisitions with estimates; the key is the shortest label. No modality is named as missing or already waiting to be retrieved.",
      sameDecisionStageAndCategory: "Three named staging investigations; MRI and ultrasound genuinely compete for local assessment, while PET has a complementary distribution role.",
      reasoningSteps: ["Separate the unresolved adjacent-organ interface from the completed distant staging question.", "Account for canal narrowing and the required anatomic coverage when choosing MRI rather than probe-based ultrasound."],
      closestError: "Choose endoanal ultrasound as a local wall test without incorporating the stenotic acquisition and broader pelvic interface.",
      decidingObservation: "A narrowed canal and an indistinct tumor–vaginal interface remain despite a diagnostic distant CT assessment.",
      consequence: "The chosen investigation may not answer the local treatment-planning question or may fail to acquire the required extent.",
      residentDifficulty: "Fair moderate PGY-2/3 prediction from local-versus-distant scope and modality limitations; not an administrative retrieval item and not independently passed.",
      singleDefensibleBestAnswer: "Current society guidance favors MRI for local extent; the technical canal constraint further weakens ultrasound for this particular presentation. PET is not portrayed as having no staging role.",
      counterfactual: "Keep a local-assessment task but change to a small nonstenotic lesion and an inability to obtain MRI: endoanal ultrasound becomes a reasonable offered alternative.",
      deletionTest: ["Without the CT interface the clinical local-extent consequence is less specific.", "Without narrowing the strongest ultrasound acquisition discriminator disappears.", "Ongoing stool passage without vomiting keeps the constructed visit in a stable staging phase rather than an obstruction emergency."],
      sequenceReview: "Standalone imaging question; neither an earlier tissue question nor a completed-MRI retrieval explanation supplies the key. The preserved regional-treatment PASS is in a separate case.",
      repairAndRecheck: "Replaced the low-yield retrieval problem with a consequential local staging choice. Verified ultrasound limitations from a rights-checked open imaging review and local MRI preference from current society guidance; no unperformed-study ambiguity is hidden.",
    },
  }),
  revisedSpec("cytology-to-histology", {
    caseSlug: "screening-target",
    currentUpdate: "",
    task: "Which diagnostic plan should the clinic arrange next for Daniel Mercer’s anal-screening findings?",
    exhibit: exhibit([
      ["Anal swab", "High-grade squamous cytologic abnormalities and oncogenic HPV detected."],
      ["Outside examination", "Digital examination found no mass. Standard anoscopy was performed with white light; a pedunculated perianal wart was sampled."],
      ["Submitted wart tissue", "Low-grade squamous changes in perianal skin, without invasion in the represented tissue."],
    ]),
    choices: [
      choice("hra", "High-resolution anoscopy with directed biopsies", true,
        "The low-grade skin-wart specimen does not resolve high-grade cells in an anal swab. HRA more precisely delineates flat epithelial lesions that a normal palpation or standard white-light examination can miss.",
        "Match the represented specimen and examination acquisition to the question raised by the high-grade anal screen.",
        "If high-grade cells were traced to a fully assessed represented lesion and the unresolved issue were its slide interpretation, targeted pathology review could be appropriate instead.",
        ["abnormal-cytology-hra", "normal-palpation", "sampling-limits", "r2.hra-flat-lesions"], "timing.test.biopsy"),
      choice("standard", "Standard anoscopy with directed biopsies", false,
        "Repeating white-light assessment does not provide HRA's more precise delineation of potential flat lesions behind the discordant high-grade screen.",
        "Treat a second standard examination as equivalent to the different acquisition needed after the first did not resolve the screen.",
        "When HRA is unavailable, standard anoscopy with biopsy of identified lesions is a supported pathway, with its scope made explicit.",
        ["abnormal-cytology-hra", "r2.hra-flat-lesions"], "timing.test.biopsy"),
      choice("slides", "Specialist review of the wart histology", false,
        "Review can refine the submitted skin diagnosis but does not inspect the anal epithelium that produced the high-grade screening cells.",
        "Use the low-grade tissue result as if it represented every possible anal lesion.",
        "A diagnostic uncertainty within a representative biopsy of the actual unresolved lesion can justify specialist slide review.",
        ["sampling-limits", "abnormal-cytology-hra"], "timing.test.pathology_review"),
    ],
    explanation: "This high-grade anal cytology result remains unresolved by a low-grade perianal wart specimen and a standard examination. Arrange HRA-directed assessment; normal palpation does not establish that flat epithelial disease is absent.",
    supportingEvidenceClaimIds: ["abnormal-cytology-hra", "normal-palpation", "sampling-limits", "r2.hra-flat-lesions"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "Deleted the named missing-tissue sentence and staging-MRI foil. Two options now obtain directed biopsies, so tissue acquisition does not uniquely mark the key. The standard examination and actual skin specimen must be interpreted rather than simply matched to an omitted action.",
      sameDecisionStageAndCategory: "Three diagnostic plans: a different visualization acquisition, repeat standard acquisition, and review of submitted tissue.",
      reasoningSteps: ["Distinguish the sampled perianal wart's low-grade histology from the unresolved high-grade anal screening result.", "Use the examination's white-light acquisition and normal palpation limits to choose HRA for potential flat lesions."],
      closestError: "Accept the benign/low-grade submitted skin specimen and another standard anoscopy as a complete assessment of the high-grade anal result.",
      decidingObservation: "The submitted specimen is perianal wart tissue and the prior canal examination used standard white-light visualization.",
      consequence: "High-grade epithelial disease can remain unlocalized and unbiopsied despite a reassuring tissue result from another compartment.",
      residentDifficulty: "Fair moderate PGY-2/3 prediction from provenance plus acquisition scope. No unsupported screening cutoff or accepted basic-role label is used.",
      singleDefensibleBestAnswer: "For this high-grade anal result, HRA addresses the unresolved compartment/acquisition; repeat standard examination and skin-slide review do not supply that scope.",
      counterfactual: "If HRA were unavailable, standard anoscopy with biopsy of identified lesions becomes the supported offered pathway; that exception is not invented as a universal equivalent acquisition.",
      deletionTest: ["Without specimen location, the low-grade tissue could incorrectly be assumed to represent the high-grade source.", "Without acquisition details, standard anoscopy cannot be fairly compared with HRA.", "The high-grade result stays because this is not an algorithm for every abnormal screening combination."],
      sequenceReview: "Standalone diagnostic case. The preserved HSIL treatment PASS is isolated, so neither this feedback nor later treatment feedback rehearses a companion's answer.",
      repairAndRecheck: "Addressed both cue findings and narrowed feedback to this high-grade result. Added a supported standard-versus-high-resolution competitor rather than an already-completed swab or premature staging test.",
    },
  }),
  revisedSpec("adverse-margin-histology", {
    caseSlug: "margin-initial", conceptId: "concept.topic.anal-cancer.margin-initial-treatment.v2",
    previousConceptId: "concept.topic.anal-cancer.margin-adjuvant-selection.v1",
    objective: "Select initial treatment of a small perianal SCC using adverse differentiation rather than extrapolating a postoperative adjuvant rule.",
    currentUpdate: "",
    task: "Which initial definitive treatment should be offered to Renee Carter for the perianal squamous cancer?",
    exhibit: exhibit([
      ["Examination", "A 1.6-cm lesion is confined to hair-bearing perianal skin. Anoscopy shows no mucosal extension."],
      ["Incisional biopsy", "Poorly differentiated invasive squamous carcinoma. The lesion remains in place after sampling."],
      ["Pelvic MRI", "No sphincter or adjacent-organ involvement; no suspicious regional node."],
      ["CT chest and abdomen", "No distant lesion identified."],
    ]),
    choices: [
      choice("crt", "Definitive fluorouracil–mitomycin chemoradiation", true,
        "Poor differentiation excludes this still-present perianal SCC from the selected favorable local-excision group despite small size and skin location. A definitive chemoradiation pathway addresses the initial-treatment setting.",
        "Use differentiation as a selection feature rather than equating small skin-based disease with a favorable excision candidate.",
        "A small well-differentiated node-negative skin-margin lesion amenable to negative-margin excision can instead be considered for local excision.",
        ["adverse-margin-histology", "r2.perianal-crt-initial", "crt-regimen"]),
      choice("local", "Wide local excision of the perianal lesion", false,
        "Small size, skin location and absent nodes make this tempting, but poor differentiation defeats the favorable local-excision selection in this scenario.",
        "Apply favorable-site and size observations while ignoring adverse histology.",
        "With well-differentiated histology and otherwise suitable small node-negative skin-based disease, local excision is a supported option.",
        ["selected-margin-excision", "adverse-margin-histology"]),
      choice("apr", "Abdominoperineal resection with colostomy", false,
        "An adverse differentiation result is not itself a reason for primary APR of this nonmetastatic skin-margin tumor. Radical resection has a different role in appropriate local failure after treatment.",
        "Escalate an adverse histologic feature directly to radical surgery instead of selecting the supported initial oncologic pathway.",
        "Confirmed resectable isolated anal-canal recurrence after definitive chemoradiation can support salvage APR.",
        ["r2.perianal-crt-initial", "salvage-apr"]),
    ],
    explanation: "Poor differentiation excludes this small skin-margin tumor from the favorable local-excision pathway. With the lesion still present after incisional biopsy, plan definitive chemoradiation rather than treating size and site as sufficient for excision.",
    supportingEvidenceClaimIds: ["adverse-margin-histology", "r2.perianal-crt-initial", "crt-regimen", "selected-margin-excision", "salvage-apr"].map(claimId),
    manualAuthorGate: {
      coverTheKey: "Removed the already-excised 12-mm-clearance setting. The task explicitly fixes the initial definitive-treatment phase, while the biopsy gives poor grade without announcing its management consequence. Each option is a specific cancer treatment.",
      sameDecisionStageAndCategory: "Three initial definitive treatment plans. No postoperative observation or re-clearance option is mixed into an upfront treatment question.",
      reasoningSteps: ["Recognize that small skin-based node-negative disease looks favorable except for poor differentiation.", "Apply the adverse-grade exclusion to select definitive chemoradiation rather than local excision or automatic radical surgery."],
      closestError: "Choose local excision from site and size while ignoring differentiation.",
      decidingObservation: "Poorly differentiated invasive SCC in a lesion still present after incisional sampling.",
      consequence: "Initial treatment may follow a favorable-lesion exception that the actual histology does not satisfy.",
      residentDifficulty: "Fair moderate PGY-2/3 prediction with a credible local-excision competitor. Uncertainty about postoperative treatment is excluded rather than relabeled as difficulty.",
      singleDefensibleBestAnswer: "Current society exclusion of poorly differentiated tumors from selected excision and the locoregional CRT pathway support the key in this initial setting.",
      counterfactual: "Change poor to well differentiation with the small skin-based node-negative presentation otherwise retained: wide local excision becomes a supported offered option.",
      deletionTest: ["Without incisional sampling and retained lesion, treatment phase becomes ambiguous again.", "Without grade the main local-excision competitor may be appropriate.", "Site, extent and nodal assessment preserve a fair initial-treatment comparison."],
      sequenceReview: "Standalone new clinical meaning. The exact favorable postoperative PASS is preserved separately; its answer is not earlier feedback for this case.",
      repairAndRecheck: "Did not assert an unsupported postoperative CRT ranking. Changed to the reviewer's suggested initial-treatment setting, assigned an explicit new concept version and kept the original adjuvant question archived/unadmitted.",
    },
  }),
  revisedSpec("salvage-local-failure", {
    caseSlug: "salvage-standalone",
    task: "Which cancer-treatment plan should be recommended for Maria Bennett’s anal-canal cancer?",
    manualAuthorGate: {
      coverTheKey: "Removed confirmed local failure from the lead-in and removed the preceding confirmation question from this composition. No earlier explanation announces radical salvage. The resident must interpret the biopsy, old treatment and current distribution.",
      sameDecisionStageAndCategory: "Three specific cancer-treatment plans after current biopsy and restaging; no diagnostic-information key competes with treatments.",
      reasoningSteps: ["Use biopsy-matched tumor, prior definitive radiation and current negative distant staging to infer isolated local failure.", "Use the preserved planes and local extent to select a salvage resection pathway instead of repeating initial therapy or assuming metastatic intent."],
      closestError: "Treat recurrence as automatically metastatic/inoperable, or repeat the initial full definitive regimen without incorporating prior radiation.",
      decidingObservation: "Viable canal tumor after a prior complete response, preserved sidewall planes and no distant lesion.",
      consequence: "The plan can abandon potentially curative local salvage or repeat a failed initial-treatment pathway.",
      residentDifficulty: "Fair moderate PGY-2/3 prediction, matching the independent review's assessment when the preceding radical-salvage scaffold is absent.",
      singleDefensibleBestAnswer: "The supplied tissue, prior therapy and resection/distribution context support multidisciplinary salvage APR planning among the offered plans.",
      counterfactual: "Replace the negative distant study with disseminated biopsy-confirmed visceral metastases: the offered systemic regimen becomes the main pathway.",
      deletionTest: ["Without old definitive radiation, the initial CRT option can become appropriate.", "Without current biopsy the lesion is not confirmed viable disease.", "Without distant restaging and preserved planes, the local salvage versus systemic comparison is underspecified."],
      sequenceReview: "Standalone current case. The returned confirmation node is parked and supplies no preceding feedback, while the current exhibit explicitly supplies all prerequisite histology and restaging.",
      repairAndRecheck: "Addressed both sequence and task cues, preserving the clinically necessary findings and the original supported treatment meaning. The earlier diagnostic explanation was rewritten neutrally in its parked attempt; it is not executed before this node.",
    },
  }),
];

export const ANAL_CANCER_PARKED_ATTEMPTS = [
  {
    originalQuestionVariantId: questionId("new-nodule-after-hsil"), status: "parked" as const,
    originalReviewVerdict: "REVISE", currentQuestionVariantId: null, isCorrect: null,
    attemptedRevision: {
      presentation: "Daniel Mercer, a 48-year-old man with treated anal HSIL, attends clinic six months later with focal pain.",
      observations: ["Indurated ulcerated canal nodule", "Negative screening cytology"],
      task: "Which tissue-assessment approach should be arranged for Daniel Mercer’s anal finding?",
      options: ["Office HRA-directed biopsy", "Anoscopy-guided incisional biopsy", "Ultrasound-guided core biopsy"],
      feedback: "Current lesion histology, rather than the screening swab, must explain the clinical finding.",
    },
    issueDisposition: "Removed repeated new-finding sentences and the repeated biopsy/swab/MRI answer set. A once-attempted tissue-route comparison has no supported patient-specific observation ranking these potentially adequate methods. Adding an invented route restriction would replace easy recognition with unfair ambiguity.",
    reason: "The fair retained principle is a straightforward diagnostic safety rule already represented by the revised biopsy item. No accepted basic role exists; no executable key is emitted for this unsupported route contest.",
    nextAction: "Manager may retain unscored follow-up teaching or commission a specifically sourced route/target case. Do not admit this archived question as a fresh moderate scored companion.",
    evidenceClaimIds: ["new-lesion-after-hsil", "representative-tissue", "sampling-limits"].map(claimId),
  },
  {
    originalQuestionVariantId: questionId("confirm-local-recurrence"), status: "parked" as const,
    originalReviewVerdict: "REVISE", currentQuestionVariantId: null, isCorrect: null,
    attemptedRevision: {
      presentation: "Maria Bennett, a 64-year-old woman, attends clinic with a scar-site nodule after prior anal-cancer chemoradiation.",
      observations: ["Previously flat scar is now nodular and bleeds", "Current local imaging is indeterminate"],
      task: "Which diagnostic approach should be arranged for Maria Bennett’s scar-site finding?",
      options: ["Anoscopy-guided incisional biopsy", "Image-guided core biopsy", "Specialist review of prior biopsy material"],
      feedback: "Obtain current histology to distinguish viable tumor from treatment-related change.",
    },
    issueDisposition: "Removed the completed diffusion-MRI repeat foil and all radical-salvage wording from the attempted feedback. The proposed tissue-method alternatives need an actual supported depth/access observation to rank them; prior material cannot diagnose the acquired nodule, leaving either two adequate routes or a weak foil.",
    reason: "Cannot establish a distinct harder unambiguous diagnostic key from the supported facts after one revision attempt. Keep the confirmation principle as background; the new standalone salvage item receives current biopsy/restaging as prerequisites.",
    nextAction: "No scored confirmation companion. A future diagnostic-route item requires a sourced target/access problem and a fresh independent review.",
    evidenceClaimIds: ["recurrence-histology", "representative-tissue", "sampling-limits"].map(claimId),
  },
];

export const ANAL_CANCER_REVISED_CASE_SPECS: CaseSpec[] = [
  { slug: "sample-depth", patientDisplayName: "Evelyn Marsh", age: 59, sex: "Female", complaint: "Anal bleeding",
    presentation: "{patientName}, a 59-year-old woman, attends clinic for persistent bleeding after an outside anal biopsy.", nodes: ["sample-provenance"] },
  { slug: "local-extent", patientDisplayName: "Evelyn Marsh", age: 59, sex: "Female", complaint: "Treatment planning",
    presentation: "{patientName}, a 59-year-old woman, attends clinic after biopsy of an anal-canal lesion.", nodes: ["local-staging-record"] },
  { slug: "screening-target", patientDisplayName: "Daniel Mercer", age: 48, sex: "Male", complaint: "Anal screening review",
    presentation: "{patientName}, a 48-year-old man living with HIV, attends clinic to review anal-screening findings after outside anoscopy.", nodes: ["cytology-to-histology"] },
  { slug: "margin-initial", patientDisplayName: "Renee Carter", age: 57, sex: "Female", complaint: "Perianal lesion",
    presentation: "{patientName}, a 57-year-old woman, attends clinic after incisional biopsy of a perianal skin lesion.", nodes: ["adverse-margin-histology"] },
  { slug: "salvage-standalone", patientDisplayName: "Maria Bennett", age: 64, sex: "Female", complaint: "Recurrent anal bleeding",
    presentation: "{patientName}, a 64-year-old woman, comes to clinic to review a new anal finding 18 months after definitive anal-cancer chemoradiation.", nodes: ["salvage-local-failure"] },
];
const revisedCaseFor = (slug: string) => ANAL_CANCER_REVISED_CASE_SPECS.find(c => c.slug === slug)!;
const revisedTemplate = (text: string, slug: string) => {
  const c = revisedCaseFor(slug);
  return text.replaceAll(c.patientDisplayName, "{patientName}").replaceAll(c.patientDisplayName.split(" ")[0]!, "{patientName}");
};
export const ANAL_CANCER_REVISED_PROPOSALS = ANAL_CANCER_REVISED_SPECS.map(spec => ({
  ...responseReview, ...spec, status: "revised" as const,
  questionVariantId: responseQuestionId(spec.slug), nodeId: responseNodeId(spec.slug), caseId: responseCaseId(spec.caseSlug),
  previousQuestionVariantId: questionId(spec.slug),
  conceptRelation: spec.slug === "adverse-margin-histology" ? "new_meaning" as const : "reuse" as const,
  shuffleAnswers: true as const, pipelinePassed: false,
  choices: spec.choices.map(c => ({ ...c, id: `choice.topic.anal-cancer.${spec.slug}.v2.${c.id}` })),
}));
export const ANAL_CANCER_REVISED_QUESTIONS: QuestionVariant[] = ANAL_CANCER_REVISED_PROPOSALS.map(p => ({
  ...responseReview, id: p.questionVariantId, conceptId: p.conceptId,
  stem: revisedTemplate(p.task, p.caseSlug), exhibit: p.exhibit,
  answerChoices: p.choices.map(c => ({ id: c.id, label: c.label, isCorrect: c.isCorrect,
    rationale: c.rationale, distractorRationale: c.isCorrect ? null : c.rationale })),
  explanation: p.explanation, supportingEvidenceClaimIds: p.supportingEvidenceClaimIds,
}));
export const ANAL_CANCER_REVISED_NODES: DecisionNode[] = ANAL_CANCER_REVISED_PROPOSALS.map(p => decisionNodeSchema.parse({
  id: p.nodeId, questionVariantId: p.questionVariantId, primaryConceptId: p.conceptId,
  ...(p.currentUpdate ? { currentUpdate: revisedTemplate(p.currentUpdate, p.caseSlug) } : {}),
  stem: revisedTemplate(p.task, p.caseSlug), exhibit: p.exhibit,
  answerChoices: p.choices.map(c => ({ id: c.id, label: c.label, isCorrect: c.isCorrect, rationale: c.rationale, serviceRequest: null })),
  shuffleAnswers: true, explanation: p.explanation, sourceLabels: labels(p.supportingEvidenceClaimIds), resultGateAfter: null,
  terminalDispositions: p.choices.filter(c => !c.isCorrect).map(c => ({ answerChoiceId: c.id,
    kind: "no_terminal_outcome", consequenceNarrative: "This authoring preview records interpretation feedback and simulates no patient outcome.",
    clinicalRationale: c.rationale, sourceLabels: labels(c.evidenceClaimIds) })),
}));
export const ANAL_CANCER_REVISED_CASES: SyntheticClinicalCase[] = ANAL_CANCER_REVISED_CASE_SPECS.map(c => {
  const node = ANAL_CANCER_REVISED_NODES.find(n => n.questionVariantId === responseQuestionId(c.nodes[0]!))!;
  const demographics = { ageYears: c.age, sexLabel: c.sex };
  return syntheticClinicalCaseSchema.parse({
    id: responseCaseId(c.slug), displayName: c.complaint,
    patientPresentationVariantId: `presentation.topic.anal-cancer.${c.slug}.v2`,
    patientDisplayName: c.patientDisplayName, prototypeDemographics: demographics,
    chiefComplaint: c.complaint, presentation: c.presentation,
    approvedInstantiationProfiles: [{ id: `profile.topic.anal-cancer.${c.slug}.v2`, prototypeDemographics: demographics,
      chiefComplaint: c.complaint, presentation: c.presentation }],
    tutorialEligible: false, routineEligible: true, earliestFacilityStage: 3,
    requiredClinicalSetting: "clinic", requiredCapabilityIds: [], rewardTierId: "reward.clinic_basic",
    sourceLabels: node.sourceLabels, decisionNodes: [node], learningSummary: node.explanation,
  });
});
const passSlugs = ["regional-node-treatment", "treat-intraepithelial-lesion", "irradiated-groin-recurrence",
  "metastatic-first-systemic-line", "clear-margin-observation"] as const;
const independentReviewFile = "docs/research/question-topic-anal-cancer-review-20261111.json";
const independentReviewSha256 = "d3001beee96024405269333eaa28225ce81ba4a520f635c6ec07fa944e4d3ab9";

export const ANAL_CANCER_PASS_PRESERVED_QUESTIONS = passSlugs.map(slug => ANAL_CANCER_QUESTIONS.find(q => q.id === questionId(slug))!);
export const ANAL_CANCER_PASS_COMPOSITIONS = passSlugs.map(slug => {
  const oldCase = ANAL_CANCER_CASES.find(c => c.decisionNodes.some(n => n.questionVariantId === questionId(slug)))!;
  const oldNode = oldCase.decisionNodes.find(n => n.questionVariantId === questionId(slug))!;
  const split = oldCase.decisionNodes.length > 1;
  const needsFinalRouting = oldNode.terminalDispositions.length === 0;
  // The standalone terminal route is neutral. Every reviewed scored/visible
  // field is exact; no answer text, rationale, update or exhibit is rewritten.
  const currentNode: DecisionNode = needsFinalRouting ? decisionNodeSchema.parse({ ...oldNode,
    terminalDispositions: oldNode.answerChoices.filter(c => !c.isCorrect).map(c => ({
      answerChoiceId: c.id, kind: "no_terminal_outcome",
      consequenceNarrative: "This authoring preview records interpretation feedback and simulates no patient outcome.",
      clinicalRationale: c.rationale ?? oldNode.explanation, sourceLabels: oldNode.sourceLabels,
    })) }) : oldNode;
  const clinicalCase = split ? syntheticClinicalCaseSchema.parse({ ...oldCase,
    id: `case.topic.anal-cancer.${slug}.standalone.v1`, decisionNodes: [currentNode], learningSummary: oldNode.explanation,
  }) : oldCase;
  return { slug, originalCaseId: oldCase.id, currentCaseId: clinicalCase.id,
    questionVariantId: oldNode.questionVariantId, status: "pass-preserved" as const,
    originalIndependentPass: true, newCompositionIndependentPass: !split,
    splitFromReturnedCompanions: split, neutralFinalRoutingAdded: needsFinalRouting,
    preservedVisibleFields: ["patientDisplayName", "prototypeDemographics", "chiefComplaint", "presentation", "approvedInstantiationProfiles"],
    preservedScoredFields: "All node fields except terminalDispositions; complete authored QuestionVariant is unchanged.",
    reviewFile: independentReviewFile, reviewFileSha256: independentReviewSha256, clinicalCase };
});
export const ANAL_CANCER_PASS_PRESERVED_CASES = ANAL_CANCER_PASS_COMPOSITIONS.map(c => c.clinicalCase);
export const ANAL_CANCER_ITEM_STATUSES = [
  ...ANAL_CANCER_PASS_COMPOSITIONS.map(c => ({
    originalQuestionVariantId: c.questionVariantId, currentQuestionVariantId: c.questionVariantId,
    currentCaseId: c.currentCaseId, status: "pass-preserved" as const, sourceReviewVerdict: "PASS" as const,
    independentlyPassedExactQuestion: true, currentCompositionIndependentPass: c.newCompositionIndependentPass,
    clinicalReviewStatus: "needs_clinician_review" as const, reviewFile: independentReviewFile,
  })),
  ...ANAL_CANCER_REVISED_PROPOSALS.map(p => ({
    originalQuestionVariantId: p.previousQuestionVariantId, currentQuestionVariantId: p.questionVariantId,
    currentCaseId: p.caseId, status: "revised" as const, sourceReviewVerdict: "REVISE" as const,
    independentlyPassedExactQuestion: false, currentCompositionIndependentPass: false,
    clinicalReviewStatus: "needs_clinician_review" as const, reviewFile: independentReviewFile,
  })),
  ...ANAL_CANCER_PARKED_ATTEMPTS.map(p => ({
    originalQuestionVariantId: p.originalQuestionVariantId, currentQuestionVariantId: null,
    currentCaseId: null, status: "parked" as const, sourceReviewVerdict: "REVISE" as const,
    independentlyPassedExactQuestion: false, currentCompositionIndependentPass: false,
    clinicalReviewStatus: "needs_clinician_review" as const, reviewFile: independentReviewFile,
  })),
];
const currentQuestions = [...ANAL_CANCER_PASS_PRESERVED_QUESTIONS, ...ANAL_CANCER_REVISED_QUESTIONS];
const currentCases = [...ANAL_CANCER_PASS_PRESERVED_CASES, ...ANAL_CANCER_REVISED_CASES];
const currentConceptIds = new Set(currentQuestions.map(q => q.conceptId));
const currentConceptProposals = [
  ...ANAL_CANCER_CONCEPT_PROPOSALS.filter(c => currentConceptIds.has(c.id)),
  { ...responseReview, id: "concept.topic.anal-cancer.margin-initial-treatment.v2",
    displayName: "Initial treatment of poorly differentiated perianal SCC",
    learningObjective: ANAL_CANCER_REVISED_PROPOSALS.find(p => p.slug === "adverse-margin-histology")!.objective,
    conceptType: "management" as const, earliestFacilityStage: 3, educationalTier: 2,
    previousConceptId: "concept.topic.anal-cancer.margin-adjuvant-selection.v1", conceptRelation: "new_meaning" as const,
    evidenceClaimIds: ANAL_CANCER_REVISED_PROPOSALS.find(p => p.slug === "adverse-margin-histology")!.supportingEvidenceClaimIds },
];
const currentConcepts: TestedConcept[] = currentConceptProposals.map(c => testedConceptSchema.parse({
  id: c.id, displayName: c.displayName, learningObjective: c.learningObjective,
  conceptType: c.conceptType, earliestFacilityStage: c.earliestFacilityStage,
}));
export const ANAL_CANCER_REVISED_TIMING_PROPOSALS: AnswerChoiceTimingRegistryEntry[] = ANAL_CANCER_REVISED_PROPOSALS.map(p =>
  answerChoiceTimingRegistryEntrySchema.parse({ caseId: p.caseId, nodeId: p.nodeId, questionVariantId: p.questionVariantId,
    classification: p.choices.some(c => c.timingProfileId) ? { kind: "test_choices", choices: p.choices.map(c => ({
      choiceId: c.id, choiceLabel: c.label, timing: c.timingProfileId ? { kind: "test", timingProfileId: c.timingProfileId } : { kind: "no_test" },
    })) } : { kind: "no_test" } }));
const currentTiming = [
  ...ANAL_CANCER_PASS_COMPOSITIONS.map(c => ({
    ...ANAL_CANCER_TIMING_PROPOSALS.find(t => t.questionVariantId === c.questionVariantId)!, caseId: c.currentCaseId,
  })), ...ANAL_CANCER_REVISED_TIMING_PROPOSALS,
];
const currentOrders = currentTiming.flatMap(entry => entry.classification.kind === "test_choices"
  ? entry.classification.choices.filter(c => c.timing.kind === "test").map(c => ({
    ...responseReview, caseId: entry.caseId, nodeId: entry.nodeId, questionVariantId: entry.questionVariantId,
    choiceId: c.choiceId, choiceLabel: c.choiceLabel, timing: c.timing,
    disposition: { kind: "not_executed" as const, reason: "future_planned" as const },
    executionScope: "clinic_plan_or_outside_record_review", serviceRequest: null, resultGateAfter: null,
  })) : []);
export const ANAL_CANCER_REVISED_STATEMENT_MAPPINGS = ANAL_CANCER_REVISED_PROPOSALS.map(p => ({
  ...responseReview, questionVariantId: p.questionVariantId, caseId: p.caseId,
  constructedFields: ["presentation", "prototypeDemographics", "currentUpdate", "exhibit"],
  constructedBasis: "Original finite fictional specimen, examination and staging observations; no new universal threshold, dose, probability or service duration.",
  assertions: [
    { field: "learningObjective", text: p.objective, claimIds: p.supportingEvidenceClaimIds },
    { field: "explanation", text: p.explanation, claimIds: p.supportingEvidenceClaimIds },
    ...p.choices.flatMap(c => [
      { field: `answerChoices[id=${c.id}].rationale`, text: c.rationale, claimIds: c.evidenceClaimIds },
      { field: `answerChoices[id=${c.id}].counterfactual`, text: c.counterfactual, claimIds: c.evidenceClaimIds },
    ]),
  ],
}));
export const ANAL_CANCER_CURRENT_ARTIFACTS = {
  contentVersion: ANAL_CANCER_RESPONSE_VERSION, questions: currentQuestions, cases: currentCases,
  concepts: currentConcepts, conceptProposals: currentConceptProposals, timing: currentTiming,
  orders: currentOrders, sources: ANAL_CANCER_SOURCES, claims: ANAL_CANCER_CLAIMS,
  statementMappings: [...ANAL_CANCER_STATEMENT_MAPPINGS.filter(m => passSlugs.some(s => m.questionVariantId === questionId(s)))
    .map(m => ({ ...m, caseId: ANAL_CANCER_PASS_COMPOSITIONS.find(c => c.questionVariantId === m.questionVariantId)!.currentCaseId })),
    ...ANAL_CANCER_REVISED_STATEMENT_MAPPINGS],
  itemStatuses: ANAL_CANCER_ITEM_STATUSES,
  previewRelease: validateSyntheticClinicalRelease({
    id: "clinical.anal-cancer.review-response.v2", schemaVersion: 1,
    publicationStatus: "synthetic_unapproved_prototype",
    disclaimer: "Synthetic authoring response preview, not clinically approved. Revised items and new standalone compositions need independent review and manager acceptance.",
    concepts: currentConcepts, cases: currentCases,
  }),
};
export const ANAL_CANCER_RESPONSE_CASE_REVIEWS = currentCases.map(c => ({
  ...responseReview, caseId: c.id, educationalTier: 2, patientAcuity: "stable",
  historicalAcuity: "outside oncology workup or previously treated disease",
  facilityProgressionLevel: c.earliestFacilityStage, requiredCapabilityIds: c.requiredCapabilityIds,
  requiredClinicalSetting: c.requiredClinicalSetting,
  nodeStatuses: c.decisionNodes.map(n => ANAL_CANCER_ITEM_STATUSES.find(s => s.currentQuestionVariantId === n.questionVariantId)!.status),
  selectionConstraint: "Standalone composition. No unresolved scored companion can block or supply the answer; standard unseen/due selection is unchanged.",
}));
export const ANAL_CANCER_RESPONSE_MANIFEST = {
  ...responseReview, scope: "explicit_import_review_response_only",
  currentEntryPoint: "ANAL_CANCER_CURRENT_ARTIFACTS", archivedEntryPoint: "ANAL_CANCER_PREVIEW_RELEASE",
  passPreserved: 5, revised: 5, parked: 2, currentCaseCount: currentCases.length,
  currentNodeCount: currentQuestions.length, activeMultiPartCases: 0,
  casePolicy: "Passing nodes isolated from returned companions; all current cases are standalone. Recompose only after every companion independently passes and the complete sequence is reviewed.",
  reviewFile: independentReviewFile, reviewFileSha256: independentReviewSha256,
  pipelinePassed: false, managerAccepted: false, clinicalApproval: false, publicReleaseAuthorized: false,
};
