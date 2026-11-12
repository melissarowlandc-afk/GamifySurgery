import type { ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
import { validateSyntheticClinicalRelease, type AnswerChoiceTimingRegistryEntry, type SyntheticClinicalCase, type TestedConcept } from "./schema";
import ledger from "../../../docs/research/sources-question-topic-stomach-ulcer-bleeding-motility-20261111.json";

/** Additive authoring sidecar. Key shown first for review only; runtime shuffles.
 * No registration, live replacement, executable order, network call or save migration.
 */
export const STOMACH_TOPIC_SLUG = "stomach-ulcer-bleeding-motility";
export const STOMACH_TOPIC_DRAFT = {
  contentVersion: "question-topic.stomach-ulcer-bleeding-motility.2026-11-11.v1",
  reviewStatus: "needs_clinician_review" as const,
  aiAssistedDrafting: true,
  lastClinicianReview: null,
};
const claimId = (slug: string) => `claim.${STOMACH_TOPIC_SLUG}.${slug}`;
const newConcept = (slug: string) => `concept.${STOMACH_TOPIC_SLUG}.${slug}.v1`;
interface Choice {
  id: string; label: string; rationale: string; temptation: string; reasonableWhen: string;
  claims: string[]; timingProfileId?: string;
}
interface Reasoning {
  interpret: string; apply: string; closest: string; decider: string; consequence: string;
  counterfactual: string; counterfactualChoice: string; deletionTest: string;
  cueAttack: string; stage: string; difficulty: string; sequence: string; limitation: string;
}
interface TopicNode {
  version?: 1 | 2;
  slug: string; conceptId: string; previousConceptId?: string;
  relation: "reuse" | "new_meaning" | "new_version";
  creation: "Rewrite" | "Retire-and-replace" | "new";
  beforeRecordIds: string[]; title: string; objective: string;
  conceptType: TestedConcept["conceptType"]; update: string; task: string;
  choices: Choice[]; explanation: string; claims: string[]; reasoning: Reasoning;
}
interface TopicCase {
  version?: 1 | 2;
  slug: string; patientName: string; age: number; sex: "Female" | "Male";
  complaint: string; presentation: string;
  historicalAcuity: "stable" | "urgent_stable" | "obvious_emergency";
  nodes: TopicNode[];
}
const choice = (id: string, label: string, rationale: string, temptation: string,
  reasonableWhen: string, claims: string[], timingProfileId?: string): Choice =>
  ({ id, label, rationale, temptation, reasonableWhen, claims, ...(timingProfileId ? { timingProfileId } : {}) });

export const STOMACH_TOPIC_REVIEWED_V1_ITEMS: TopicCase[] = [
  {
    slug: "recurrent-ulcer-gastrin", patientName: "Mara Ellis", age: 53, sex: "Female",
    complaint: "Recurrent ulcer review", historicalAcuity: "stable",
    presentation: "{patientName}, a 53-year-old woman, attends clinic to review recurrent marginal ulceration after a Billroth II operation performed for peptic ulcer disease.",
    nodes: [{
      slug: "gastrin-safe-assessment", conceptId: newConcept("gastrin-context-before-localization"),
      previousConceptId: "concept.retained-antrum.recognition", relation: "new_meaning", creation: "Rewrite",
      beforeRecordIds: ["inventory.5a3123b18302cd1d"], title: "Contextualize postoperative hypergastrinemia",
      objective: "Choose supervised physiologic and reconstruction assessment before attributing postoperative hypergastrinemia to a gastrinoma.", conceptType: "workup",
      update: "The operative summary calls the procedure an antrectomy, but its specimen map is absent. Fasting gastrin was elevated while she was taking omeprazole. Gastric aspirate obtained during that endoscopy had pH 6. The marginal ulcer was still present.",
      task: "Which diagnostic plan should be arranged next for {patientName}'s elevated gastrin?",
      choices: [
        choice("context", "Review reconstruction anatomy and obtain supervised gastrin/acid assessment", "The drug exposure and nonacidic aspirate prevent the gastrin result from proving inappropriate acid secretion. Reconstruct the prior operation and arrange specialist-supervised assessment; retained antrum remains a postsurgical alternative.", "Integrate acid status, treatment exposure and incomplete resection documentation.", "The result is confounded and prior gastric surgery introduces an alternative source.", ["gastrin-confounding", "gastrin-surgery", "ppi-withdrawal"], "timing.test.combined_diagnostic"),
        choice("secretin", "Repeat gastrin and perform secretin testing during current PPI therapy", "Repeating the hormone or adding a provocative test during acid suppression does not resolve the physiologic confounding represented here.", "Treat any elevated gastrin as an appropriate entry point for a tumor-provocation test.", "Specialist evaluation has established interpretable acid conditions and a remaining biochemical question.", ["gastrin-confounding", "ppi-withdrawal"], "timing.test.metabolic_workup"),
        choice("localization", "Obtain receptor PET/CT and pancreatic endoscopic ultrasonography", "Localization does not establish why gastrin is elevated. The current biochemical record and prior surgery need interpretation before a tumor-location strategy.", "Jump from a hormone result to tumor localization.", "A sufficiently established functional tumor diagnosis requires localization, outside this node's scored scope.", ["gastrin-confounding", "gastrin-surgery"], "timing.test.combined_diagnostic"),
      ],
      explanation: "Interpret gastrin together with gastric acidity, acid-suppressive treatment and prior reconstruction. The current result does not establish gastrinoma. Arrange a supervised assessment rather than abrupt PPI withdrawal during active ulcer disease.",
      claims: ["gastrin-confounding", "gastrin-surgery", "ppi-withdrawal"],
      reasoning: {
        interpret: "An elevated hormone in a nonacidic stomach during PPI treatment is not evidence of unopposed acid hypersecretion.",
        apply: "Select a physiologic/reconstruction assessment before tumor-directed testing; protect ongoing ulcer treatment.",
        closest: "secretin", decider: "Gastrin was measured during omeprazole exposure and the aspirate was nonacidic; the resection map is incomplete.",
        consequence: "A false tumor attribution or unsafe drug withdrawal can lead to inappropriate testing and ulcer complications.",
        counterfactual: "If supervised acid testing establishes interpretable inappropriate hypergastrinemia and the reconstruction excludes retained antral tissue, additional provocative biochemical testing can become appropriate.",
        counterfactualChoice: "secretin", deletionTest: "Without treatment/acid observations, immediate biochemical escalation becomes plausible; without the surgery history, reconstructing the operation adds no value.",
        cueAttack: "Removed the old phrase residual antral mucosa and the answer-label match. All choices are diagnostic plans. The two-part key is comparable in scope to the two named alternatives; pH is necessary evidence, not a supplied interpretation.",
        stage: "Three diagnostic plans before a functional tumor diagnosis, with active ulcer treatment common to all.",
        difficulty: "Hard predicted: residents may overinterpret gastrin or order secretin/localization before checking acid conditions.",
        sequence: "Standalone; no prior feedback identifies the cause or promises an antral remnant.",
        limitation: "Single recent specialist review; clinician must review the exact safe diagnostic pathway. No retained-antrum operation or tumor-treatment ranking is asserted.",
      },
    }],
  },
  {
    slug: "persistent-ulcer-infection", patientName: "Nora Chen", age: 46, sex: "Female",
    complaint: "Ulcer treatment follow-up", historicalAcuity: "stable",
    presentation: "{patientName}, a 46-year-old woman, attends clinic after treatment of an uncomplicated duodenal ulcer. She completed PPI, amoxicillin and clarithromycin, but intermittent epigastric discomfort persists.",
    nodes: [
      {
        slug: "active-infection-recheck", conceptId: "concept.h-pylori-ulcer.active-infection-testing", relation: "reuse", creation: "Rewrite",
        beforeRecordIds: ["inventory.810e7aec201373e7"], title: "Assess active infection after a confounded negative test",
        objective: "Select a nonserologic active H. pylori test rather than infer infection status from serology or a confounded negative specimen.", conceptType: "workup",
        update: "A stool antigen specimen collected six weeks after antibiotics was negative while she was still taking omeprazole. Later serum IgG was positive. There has been no recurrent bleeding, weight loss or vomiting; no additional antibiotics or bismuth have been taken.",
        task: "Which testing plan should be arranged next to assess {patientName}'s H. pylori status?",
        choices: [
          choice("breath", "Urea breath testing after PPI washout", "The prior negative specimen was obtained during acid suppression; antibody positivity cannot settle whether infection persists. A prepared active-infection test addresses the remaining question.", "Reconcile conflicting results with their acquisition conditions.", "Active infection remains uncertain after an inadequately prepared specimen.", ["hp-nonserologic", "hp-preparation", "hp-test-of-cure"], "timing.test.h_pylori_breath"),
          choice("serology", "Repeat serum H. pylori IgG testing", "Another antibody result will not distinguish persistent infection from prior exposure after treatment.", "Use the positive assay as the more convincing of two discordant tests.", "A prior-exposure question rather than eradication assessment is being studied; this is not a cure test.", ["hp-nonserologic"], "timing.test.basic_labs"),
          choice("endoscopy", "Repeat upper endoscopy with gastric biopsies", "Biopsy-based testing can assess infection, but this stable uncomplicated-ulcer follow-up has a preparation problem and no supplied separate indication for repeat invasive examination.", "Resolve test disagreement by escalating directly to invasive sampling.", "A new alarm feature or a structural lesion independently requires endoscopy and appropriate biopsy.", ["hp-test-of-cure", "hp-preparation"], "timing.test.endoscopy_with_sampling"),
        ],
        explanation: "Use an active-infection assay with appropriate preparation. A negative on-PPI specimen and positive post-treatment IgG do not establish cure or persistence. PPI must be withheld for two weeks and antibiotics/bismuth for four weeks before eradication testing.",
        claims: ["hp-nonserologic", "hp-preparation", "hp-test-of-cure"],
        reasoning: {
          interpret: "Identify the on-PPI negative as insufficient and the antibody as evidence that cannot establish persistence.",
          apply: "Choose a prepared noninvasive active assay rather than repeat the uninformative assay or add invasive evaluation.", closest: "endoscopy",
          decider: "Medication exposure explains a valid uncertainty; there is no independent structural or alarm indication for endoscopy.",
          consequence: "Calling cure or prescribing another course from these results risks missed infection or unnecessary antibiotic exposure.",
          counterfactual: "If vomiting and a new irregular outlet lesion accompanied the unresolved tests, upper endoscopy with biopsy would become the priority.", counterfactualChoice: "endoscopy",
          deletionTest: "Remove the on-PPI collection condition and the premise for repeat active testing changes. Alarm negatives retain their job of ranking invasive reassessment.",
          cueAttack: "Replaced FIT and fasting gastrin foils with competing infection-assessment routes. No task word uniquely names breath testing. The PPI observation establishes an interference problem without announcing the assay choice.",
          stage: "Three specific investigations for current infection-status uncertainty.", difficulty: "Moderate predicted: reconcile acquisition conditions and choose the proportional next investigation.",
          sequence: "The subsequent node receives a later positive prepared test. This feedback teaches assay validity, not the later antibiotic regimen.",
          limitation: "No assertion that breath testing is superior to a properly prepared stool antigen test; that equally valid alternative is not offered.",
        },
      },
      {
        slug: "salvage-eradication", conceptId: newConcept("hp-salvage-after-clarithromycin"), relation: "new_meaning", creation: "new", beforeRecordIds: [],
        title: "Select eradication after clarithromycin failure", objective: "Select optimized bismuth quadruple therapy after a failed clarithromycin course when susceptibility is unknown and BQT has not been used.", conceptType: "management",
        update: "At a later visit, the prepared urea breath test is positive. The prior clarithromycin course was completed. She has never received bismuth quadruple therapy, and susceptibility results are unavailable.",
        task: "Which eradication regimen should be selected next for {patientName}?",
        choices: [
          choice("bqt", "PPI–bismuth–tetracycline–metronidazole therapy", "Optimized bismuth quadruple therapy is the recommended offered salvage after clarithromycin triple-therapy failure when it has not been used previously.", "Use the prior antibiotic history and absence of earlier BQT.", "Persistent infection follows clarithromycin triple therapy and optimized BQT has not been given.", ["hp-salvage-bqt", "hp-resistance"]),
          choice("clarithromycin", "PPI–amoxicillin–clarithromycin triple therapy", "This repeats the unsuccessful antibiotic backbone without susceptibility evidence supporting clarithromycin.", "Attribute failure to chance and repeat a familiar regimen.", "A susceptibility-guided plan establishes a reason to use clarithromycin in a different adequately assessed treatment context.", ["hp-resistance"]),
          choice("levofloxacin", "PPI–amoxicillin–levofloxacin triple therapy", "Changing drug class does not establish susceptibility; empiric levofloxacin salvage is not the recommended offered choice here.", "Assume a new antibiotic class automatically solves resistance.", "Demonstrated levofloxacin susceptibility supports a selected salvage plan.", ["hp-resistance"]),
        ],
        explanation: "A prepared positive active test supports persistent infection. Choose optimized bismuth quadruple therapy after this failed clarithromycin course; the supported course is 14 days. Empiric clarithromycin or levofloxacin use needs susceptibility support.", claims: ["hp-salvage-bqt", "hp-resistance", "hp-test-of-cure"],
        reasoning: {
          interpret: "The properly prepared positive result after a completed course establishes a different decision from resolving the earlier assay conflict.",
          apply: "Apply prior-regimen and susceptibility information to salvage selection.", closest: "levofloxacin", decider: "Clarithromycin has failed, susceptibility is unknown, and optimized BQT has not been tried.",
          consequence: "Unselected reuse of resistance-prone antibiotics risks another failed eradication course.",
          counterfactual: "A documented levofloxacin-susceptible isolate after prior optimized BQT failure can support levofloxacin-based salvage.", counterfactualChoice: "levofloxacin",
          deletionTest: "Deleting the prior regimen or previous-BQT history removes the basis for the offered salvage ranking.",
          cueAttack: "All three labels name medication combinations, with no unique caution clause or dose-length cue. Regimen composition is needed to identify treatment; the four-agent key reflects the actual therapy, not added explanation.",
          stage: "Three antibiotic eradication regimens after confirmed persistence.", difficulty: "Moderate predicted: a resident may favor empiric fluoroquinolone salvage over an unused optimized BQT course.",
          sequence: "Prior assay-validity feedback names no salvage drugs. Later actual test information is supplied only at this node.",
          limitation: "ACG highlights and commentary refer to one publication. Alternative rifabutin or PCAB regimens are not ranked against BQT here.",
        },
      },
    ],
  },
  {
    slug: "cure-collection-calendar", patientName: "Owen Marsh", age: 54, sex: "Male", complaint: "Ulcer test scheduling", historicalAcuity: "stable",
    presentation: "{patientName}, a 54-year-old man, attends clinic to schedule a stool antigen test after H. pylori eradication therapy.",
    nodes: [{
      slug: "cure-calendar", conceptId: "concept.h-pylori-ulcer.test-of-cure-plan", relation: "reuse", creation: "Rewrite", beforeRecordIds: ["inventory.fe956a412d93c43e"],
      title: "Reconcile later antibiotics before cure testing", objective: "Schedule nonserologic eradication assessment using the actual latest interfering medication exposures.", conceptType: "workup",
      update: "Eradication antibiotics ended eight weeks ago. Omeprazole ended three weeks ago, and he has taken no bismuth. A later amoxicillin course for a dental infection ended four days ago. The listed medicines remain stopped.",
      task: "Which collection date should be used for {patientName}'s stool antigen test?",
      choices: [
        choice("day24", "Collect the stool specimen 24 days from today", "Four more days have elapsed since the later antibiotic course; another 24 days completes the four-week antibiotic-free interval. The PPI interval has already been met.", "Use the latest medication exposure rather than the original eradication date.", "The most recent antibiotic ended four days ago and no further interference occurs.", ["hp-preparation"], "timing.test.microbiology"),
        choice("day14", "Collect the stool specimen 14 days from today", "This follows the familiar two-week interval but leaves only 18 days since the later antibiotic course.", "Apply the PPI interval to the later antibiotic.", "The latest antibiotic ended two weeks ago and the other preparation requirements are met.", ["hp-preparation"], "timing.test.microbiology"),
        choice("today", "Collect the stool specimen at today's clinic visit", "The remote eradication date and completed PPI hold do not negate the recent antibiotic exposure.", "Count preparation from eradication treatment while overlooking later medicines.", "All antibiotic/bismuth exposures ended at least four weeks ago and PPI ended at least two weeks ago.", ["hp-preparation"], "timing.test.microbiology"),
      ],
      explanation: "Use the most recent relevant exposure: four days since the later antibiotic plus 24 more days equals four weeks. The three-week PPI hold already exceeds the two-week preparation interval. These clinical preparation intervals are separate from runtime laboratory waits.", claims: ["hp-preparation", "hp-test-of-cure"],
      reasoning: {
        interpret: "The later dental antibiotic resets the antibiotic-free interval even though eradication therapy ended much earlier.",
        apply: "Reconcile the completed PPI interval with the remaining antibiotic interval and select the offered date.", closest: "day14", decider: "The later antibiotic ended four days ago, while PPI ended three weeks ago.",
        consequence: "An early negative specimen could be accepted incorrectly as eradication.",
        counterfactual: "If the dental antibiotic had ended fourteen days ago, collection fourteen days from today would meet the same rules.", counterfactualChoice: "day14",
        deletionTest: "Deleting the later antibiotic changes the answer to today; deleting the PPI record leaves necessary preparation uncertain.",
        cueAttack: "Every option is the same specimen collection with a different date and identical wait-profile scope. No antibody backstory, explanatory qualifier or treatment-choice distraction remains.",
        stage: "Specimen collection dates, not antibiotic treatment decisions.", difficulty: "Moderate predicted: the credible error is applying a two-week interval to all drugs or using the original eradication end date.",
        sequence: "Standalone to prevent earlier feedback from supplying the medication-hold calculation.", limitation: "Preparation is supported by one current primary guideline; arithmetic is an original constructed application.",
      },
    }],
  },
  {
    slug: "cure-serology-disagreement", patientName: "Simon Park", age: 55, sex: "Male", complaint: "Conflicting ulcer tests", historicalAcuity: "stable",
    presentation: "{patientName}, a 55-year-old man, attends clinic after an outside laboratory reports positive H. pylori IgG following ulcer treatment.",
    nodes: [{
      slug: "valid-cure-antibody", conceptId: "concept.n2.hpylori-antibody-after-valid-cure-test", relation: "reuse", creation: "Rewrite", beforeRecordIds: ["inventory.f3f02a1b2bf98eed"],
      title: "Avoid retreatment from post-cure antibodies", objective: "Do not overturn a valid active-infection test of cure with later antibody positivity.", conceptType: "management",
      update: "The earlier stool antigen test was negative eight weeks after eradication antibiotics. PPI had been stopped for three weeks; there had been no antibiotics or bismuth for six weeks. Epigastric symptoms have resolved.",
      task: "Which H. pylori treatment plan best fits {patientName}'s current results?",
      choices: [
        choice("no-antibiotics", "Do not prescribe another eradication course", "The active-infection specimen met preparation intervals. Later antibody positivity does not establish persistent infection requiring antibiotics.", "Judge the assays by what they measure and how the specimen was obtained.", "A prepared active test is negative and no new clinical reason overrides it.", ["hp-nonserologic", "hp-preparation", "hp-test-of-cure"]),
        choice("bqt", "Prescribe bismuth-based quadruple eradication therapy", "BQT treats established infection; IgG positivity does not establish persistence after this adequately prepared negative active test.", "Treat the latest positive laboratory label as the decisive result.", "A prepared active-infection test is positive and prior-regimen history supports BQT.", ["hp-nonserologic", "hp-salvage-bqt"]),
        choice("levofloxacin", "Prescribe levofloxacin-based triple eradication therapy", "Neither persistent infection nor levofloxacin susceptibility is demonstrated by antibody positivity.", "Assume a positive follow-up antibody requires a different antibiotic family.", "Persistent active infection and susceptibility-guided salvage support that regimen.", ["hp-nonserologic", "hp-resistance"]),
      ],
      explanation: "A correctly prepared active-infection test has a different role from antibody serology. Preserve the supported cure assessment rather than prescribe another course for IgG positivity.", claims: ["hp-nonserologic", "hp-preparation", "hp-test-of-cure", "hp-resistance"],
      reasoning: {
        interpret: "Check every relevant medication interval before accepting the negative active assay, then distinguish antibody persistence from current infection.",
        apply: "Avoid an unnecessary eradication course.", closest: "bqt", decider: "The earlier active test is negative with adequate preparation; the later positive test is antibody-based.", consequence: "Unnecessary antibiotics create adverse effects and avoidable selection pressure.",
        counterfactual: "A positive prepared active assay after prior clarithromycin failure, with no prior BQT, would support BQT.", counterfactualChoice: "bqt",
        deletionTest: "Without preparation data, the negative test cannot carry this conclusion and re-evaluation would be needed.",
        cueAttack: "Replaced abstract retain-the-conclusion wording with actual prescribing plans. No generic individualized key. The symptom resolution is supportive context, not proof of eradication; medication and assay identity determine the answer.",
        stage: "Three current antibiotic-prescribing decisions.", difficulty: "Moderate predicted: the trap is privileging a newer positive assay over a properly prepared active test.", sequence: "Standalone; no prior calendar question teaches that this particular specimen was valid.",
        limitation: "Clinical review must confirm the assay/preparation assumptions. No claim that symptoms alone demonstrate cure.",
      },
    }],
  },
  {
    slug: "vomiting-and-nutrition", patientName: "Elena Ward", age: 49, sex: "Female", complaint: "Vomiting after meals", historicalAcuity: "stable",
    presentation: "{patientName}, a 49-year-old woman with diabetes, attends clinic for persistent nausea, early satiety and vomiting after solid meals.",
    nodes: [
      {
        slug: "complete-emptying-acquisition", conceptId: "concept.gastroparesis.confirmatory-gastric-emptying-scintigraphy", relation: "reuse", creation: "Rewrite", beforeRecordIds: ["inventory.dfa38f82e7f467e7"],
        title: "Complete the gastric-emptying investigation", objective: "Select four-hour solid-meal scintigraphy after excluding obstruction when a shorter study leaves delayed emptying unresolved.", conceptType: "workup",
        update: "Endoscopy documented a traversable pylorus and duodenum, with no narrowing or obstructing lesion. A solid-meal emptying study was reported within the laboratory range at two hours; the acquisition log ends at that time. Glucose was controlled and no motility-altering medicines were used during testing.",
        task: "Which investigation should be arranged next for {patientName}'s persistent meal-related vomiting?",
        choices: [
          choice("four-hour", "Solid-meal scintigraphy with four-hour acquisition", "The prior study did not acquire the later measurement. A directly measured four-hour solid-meal protocol can resolve the remaining emptying question.", "Read the acquisition log rather than treat the report's normal label as a complete assessment.", "Structural obstruction has been evaluated, but later emptying has not been measured.", ["gp-four-hour", "gp-short-study", "gp-obstruction"], "timing.test.four_hour_protocol"),
          choice("repeat-egds", "Repeat endoscopy with repeat pyloric inspection", "An adequate recent examination already addressed an outlet lesion. Repeating that structural assessment does not supply the missing emptying acquisition.", "Treat persistent vomiting as proof the structural examination must have missed the cause.", "A new focal outlet abnormality or an incomplete earlier examination reopens the structural question.", ["gp-obstruction", "gp-four-hour"], "timing.test.upper_endoscopy"),
          choice("manometry", "High-resolution esophageal manometry with impedance", "The unresolved evidence concerns gastric emptying rather than esophageal propulsion or passage at the esophagogastric junction.", "Substitute another motility test for the gastric measurement.", "Swallow-related dysphagia or regurgitation with an esophageal motor question remains after structural evaluation.", ["gp-four-hour"], "timing.test.physiology"),
        ],
        explanation: "Separate an adequate outlet examination from an incomplete emptying acquisition. A two-hour report cannot supply an unacquired four-hour measurement. Use a standardized solid-meal protocol with direct later imaging.", claims: ["gp-obstruction", "gp-four-hour", "gp-short-study", "gp-confounders"],
        reasoning: {
          interpret: "The outlet was examined adequately, but the normal two-hour result does not establish the later emptying result.", apply: "Choose the investigation that fills the remaining physiologic evidence gap.", closest: "repeat-egds",
          decider: "The acquisition log ends at two hours while the outlet examination is complete.", consequence: "Prematurely closing the emptying question can mislabel persistent symptoms or trigger inappropriate treatment.",
          counterfactual: "If the endoscope had stopped before an irregular pyloric lesion and sampled only proximal mucosa, repeat targeted endoscopy would take priority.", counterfactualChoice: "repeat-egds",
          deletionTest: "Deleting the acquisition log makes the word normal misleadingly conclusive; deleting the outlet details leaves repeat endoscopy reasonable.",
          cueAttack: "The old result-label question was replaced by an acquisition decision. The task does not say confirm gastroparesis. All choices are named investigations with waits. Necessary adequacy observations are retained without the sentence no repeat test yet.",
          stage: "Diagnostic investigations after persistent symptoms and review of actual prior acquisition.", difficulty: "Moderate predicted: distinguish a normal early observation from a complete negative study and keep structural versus motility workup separate.",
          sequence: "Feedback discusses acquisition only. The next node receives a later completed test and asks a nutrition decision, not the same test choice.", limitation: "Clinical review of symptom plausibility and esophageal distractor required; no test-sensitivity percentage or new threshold is authored.",
        },
      },
      {
        slug: "motility-diet", conceptId: newConcept("gastroparesis-diet-selection"), relation: "new_meaning", creation: "new", beforeRecordIds: [],
        title: "Select an initial gastric-tolerance diet", objective: "Choose a diet that addresses gastric food tolerance while maintaining nutrition in established delayed emptying.", conceptType: "management",
        update: "The later standardized study directly measures delayed solid emptying at four hours. Her diet log shows large raw-vegetable meals and added bran for diabetes care. She vomits recognizable solids but retains smooth soups and blended meals. She has not had a structured nutrition intervention.",
        task: "Which nutrition prescription best fits {patientName}'s current oral tolerance?",
        choices: [
          choice("small-low-residue", "Small low-fat, low-fiber meals with blended foods", "This plan reduces the solid and residue burden while using the foods she can retain to sustain intake.", "Adapt a familiar healthy diet to the patient's demonstrated gastric tolerance.", "Delayed solid emptying is established and oral intake can still supply nutrition.", ["gp-diet"]),
          choice("fiber", "Small whole-grain meals with added bran supplements", "Generic high-fiber advice does not address the retained rough solids that now limit this patient's intake.", "Continue a usual diabetes-oriented high-fiber strategy despite the changed gastric problem.", "An appropriate dietary problem calls for more fiber and the patient tolerates it; this is not the current gastric plan.", ["gp-diet"]),
          choice("fat", "Small high-fat meals with dense solid supplements", "Concentrating solid calories with fat does not match the low-fat, easier-to-process dietary approach or her observed food tolerance.", "Treat the nutritional risk by increasing calorie density without considering gastric processing.", "A different nutrition problem and demonstrated fat tolerance justify that prescription; no such evidence is given here.", ["gp-diet"]),
        ],
        explanation: "Dietary treatment must fit both the emptying disorder and actual food tolerance. Use small, lower-fat and lower-fiber meals, with blended foods as needed, before concluding that oral nutrition has failed.", claims: ["gp-diet", "gp-four-hour"],
        reasoning: {
          interpret: "Whole solids are poorly retained while blended intake remains possible; a standard high-fiber diet is not serving this new physiology.", apply: "Select a gastric-tolerance nutrition plan rather than maximize fiber or solid calorie density.", closest: "fiber",
          decider: "Retained recognizable solids and successful blended intake occur with documented delayed solid emptying.", consequence: "An ill-matched diet can perpetuate vomiting and inadequate nutrition.",
          counterfactual: "If delayed emptying were not present and the actual dietary problem were fiber-responsive bowel symptoms with preserved food tolerance, the whole-grain/bran plan could become reasonable.", counterfactualChoice: "fiber",
          deletionTest: "Without the diet log and food-form response, the item becomes simple dietary recall; those observations defeat the credible generic diabetes-diet error.",
          cueAttack: "All options are small-meal prescriptions of similar scope; no uniquely comprehensive feeding-access key. The task does not say low residue. The known diagnosis is appropriate because the scored task is treatment.",
          stage: "Three oral dietary prescriptions before oral nutrition has been optimized.", difficulty: "Moderate predicted, with a residual risk of being too familiar for PGY-2/3; independent review must assess the fiber-versus-gastric-tolerance error.",
          sequence: "Prior feedback establishes test adequacy, not diet composition. This feedback does not name the next node's feeding route.", limitation: "Government diet guidance is broad; calorie, fluid and diabetes medication adjustments remain outside the keyed objective.",
        },
      },
      {
        slug: "jejunal-nutrition", conceptId: newConcept("gastroparesis-enteral-route"), relation: "new_meaning", creation: "new", beforeRecordIds: [],
        title: "Use a demonstrated postpyloric feeding response", objective: "Choose an enteral route beyond the stomach when optimized oral treatment is inadequate and a postpyloric trial succeeds.", conceptType: "management",
        update: "At a later outside admission, dietitian-guided oral changes and medical therapy still did not meet her nutritional needs. Gastric tube feeds caused repeated regurgitation. During a nasojejunal trial, the prescribed feed was delivered and retained, with no recurrent vomiting or abdominal distension.",
        task: "Which longer-term nutrition route best fits {patientName}'s observed feeding response?",
        choices: [
          choice("jejunal", "Jejunal enteral feeding access", "The trial demonstrates that bypassing the stomach can deliver the prescribed nutrition. It supports an enteral route beyond the dysfunctional stomach.", "Use actual route-specific tolerance rather than the severity label alone.", "Oral/gastric intake is inadequate while postpyloric feeding is tolerated.", ["gp-jejunal", "gp-parenteral"]),
          choice("gastric", "Gastric enteral feeding access", "This places the feed in the compartment that repeatedly regurgitated it; permanent access does not itself correct that observed tolerance problem.", "Choose the simpler common feeding tube without using the trial response.", "The stomach can retain adequate feeds and the primary limitation is safe oral delivery.", ["gp-jejunal"]),
          choice("parenteral", "Central venous parenteral nutrition", "The record demonstrates a usable enteral route. Parenteral nutrition is not required simply because gastric emptying is severely impaired.", "Equate failure of oral and gastric feeding with failure of the whole intestinal route.", "Adequate postpyloric nutrition cannot be achieved or enteral feeding is contraindicated.", ["gp-parenteral"]),
        ],
        explanation: "The decisive evidence is successful delivery and retention during the postpyloric trial after oral and gastric routes failed. Consider jejunal access; parenteral nutrition remains a fallback when adequate enteral support cannot be delivered.", claims: ["gp-jejunal", "gp-parenteral"],
        reasoning: {
          interpret: "The stomach has failed as a feeding reservoir, but the intestinal trial demonstrates adequate enteral delivery.", apply: "Choose durable jejunal rather than gastric or intravenous feeding.", closest: "parenteral", decider: "The prescribed postpyloric feed was actually delivered and retained, not merely planned.",
          consequence: "Ignoring the response can cause recurrent gastric-feed failure or avoidable central-line nutrition exposure.",
          counterfactual: "If appropriately placed postpyloric feeding repeatedly failed to provide nutrition and enteral delivery could not be achieved, parenteral nutrition would become reasonable.", counterfactualChoice: "parenteral",
          deletionTest: "Remove actual trial delivery/tolerance and the long-term route is insufficiently established; a proposed trial would not prove success.",
          cueAttack: "All labels are concrete feeding routes. No generic individualized plan or uniquely complete key. Successful trial language is essential response evidence, not permission that an untested procedure is feasible.",
          stage: "Three longer-term nutrition-access strategies after demonstrated treatment responses.", difficulty: "Moderate predicted: distinguish gastric failure from intestinal failure using what nutrition was actually delivered.",
          sequence: "Diet feedback did not name jejunal or parenteral routes. The later admission supplies new consequential response data; no future findings were used earlier.", limitation: "Single adequate government source; access technique and exact nutrition targets require clinician selection and are not tested.",
        },
      },
    ],
  },
  {
    slug: "confounded-emptying-record", patientName: "Lena Grant", age: 58, sex: "Female", complaint: "Vomiting test review", historicalAcuity: "stable",
    presentation: "{patientName}, a 58-year-old woman, attends clinic to review an outside delayed gastric-emptying report before an invasive pyloric-treatment consultation.",
    nodes: [{
      slug: "confounded-scan", conceptId: newConcept("emptying-acquisition-confounding"), previousConceptId: "concept.gastroparesis.confirmatory-gastric-emptying-scintigraphy",
      relation: "new_meaning", creation: "Retire-and-replace", beforeRecordIds: ["inventory.06eab479317d2aba"],
      title: "Reassess a confounded emptying measurement", objective: "Resolve medication and metabolic confounding before using a gastric-emptying result to select an invasive motility intervention.", conceptType: "workup",
      update: "The outside study used a solid meal with four-hour imaging. Its medication record shows oxycodone before the meal, and glucose was well above that laboratory's testing target. CT and endoscopy had shown no outlet lesion. Since the postoperative opioid course ended and glucose returned to the usual range, vomiting has become much less frequent.",
      task: "Which investigation should be arranged next before {patientName}'s pyloric treatment decision?",
      choices: [
        choice("repeat-prepared", "Repeat solid-meal scintigraphy under controlled preparation", "The acquisition duration was adequate, but drug/metabolic exposures and interval improvement raise a different validity problem. Reassess emptying without the documented confounders.", "Distinguish an acquired value from evidence of an intrinsic persistent disorder.", "The prior result was confounded and a treatment decision depends on persistent delayed emptying.", ["gp-confounders", "gp-four-hour"], "timing.test.four_hour_protocol"),
        choice("pylorus", "Endoscopic measurement of pyloric distensibility", "A pyloric measurement does not establish that the confounded emptying abnormality persists after reversible factors change.", "Use a treatment-selection measurement before confirming the continuing physiology.", "Persistent, adequately established refractory gastroparesis leaves a pylorus-specific assessment question.", ["gp-confounders", "gp-four-hour"], "timing.test.physiology"),
        choice("anatomic", "Repeat contrast examination of the gastric outlet", "The reviewed CT and endoscopy addressed an outlet lesion, and no new obstructive pattern is supplied. The unresolved discrepancy is physiologic test preparation and interval response.", "Treat improvement as unreliable while reopening an adequately examined structural question.", "New structural findings or an inadequate outlet examination reopen obstruction assessment.", ["gp-obstruction", "gp-confounders"], "timing.test.contrast_swallow"),
      ],
      explanation: "A four-hour duration does not remove medication or glucose confounding. The interval improvement makes persistence clinically important to reassess before an invasive pyloric decision. Use controlled preparation rather than a universal drug-hold or glucose cutoff invented for the case.", claims: ["gp-confounders", "gp-four-hour", "gp-obstruction"],
      reasoning: {
        interpret: "The test measured emptying during opioid exposure and excess glucose; the subsequent improvement is evidence against treating that result as a fixed current phenotype.", apply: "Obtain an interpretable current emptying measurement before a pylorus-specific selection test.", closest: "pylorus",
        decider: "The exposure record conflicts with the current untreated symptom course despite adequate imaging duration.", consequence: "Premature invasive treatment can target a reversible or no-longer-present abnormality.",
        counterfactual: "If repeated properly prepared studies showed continuing delay despite optimized medical care, a pyloric distensibility assessment could become reasonable during specialist procedural evaluation.", counterfactualChoice: "pylorus",
        deletionTest: "Deleting the medication/glucose record and interval improvement turns repeat testing into an unsupported delay. The four-hour acquisition must remain to distinguish this from the short-study item.",
        cueAttack: "All options gather specific diagnostic evidence. The task names the actual upcoming phase but no preferred investigation. There is no single cautious option against two premature operations. No named missing test sentence.",
        stage: "Three investigations before committing to an invasive pyloric strategy.", difficulty: "Hard predicted: an apparently technically complete study can distract from preparation and changing symptoms.", sequence: "Standalone; no earlier explanation rehearses medication confounding or repeats the same acquisition objective.",
        limitation: "No unique G-POEM/GES/pyloroplasty ranking is supplied. The exact need and preparation for a repeat test remain clinician judgments.",
      },
    }],
  },
  {
    slug: "prokinetic-after-reaction", patientName: "Priya Lane", age: 42, sex: "Female", complaint: "Persistent meal-related vomiting", historicalAcuity: "stable",
    presentation: "{patientName}, a 42-year-old woman with objectively documented diabetic gastroparesis, attends clinic because vomiting persists despite dietary treatment.",
    nodes: [{
      slug: "prokinetic-reaction", conceptId: newConcept("prokinetic-after-dystonia"), relation: "new_meaning", creation: "new", beforeRecordIds: [],
      title: "Choose a prokinetic after a prior drug reaction", objective: "Recognize a prior metoclopramide-associated dystonic episode and select an offered alternative aimed at gastric emptying.", conceptType: "management",
      update: "An earlier emergency record describes painful neck twisting and sustained upward eye deviation soon after metoclopramide was started; the movements resolved after it was stopped and treated. The current ECG QTc is within the laboratory range, and medication reconciliation identifies no interacting QT-prolonging drug.",
      task: "Which medicine should be considered next to improve {patientName}'s gastric emptying?",
      choices: [
        choice("erythromycin", "Oral erythromycin", "Erythromycin is an offered prokinetic alternative. The earlier movement reaction precludes another metoclopramide trial; current QT/interaction assessment remains necessary.", "Recognize the prior reaction and choose a different motility mechanism.", "A clinician judges prokinetic treatment appropriate and safety review supports this alternative.", ["gp-prokinetic", "metoclopramide-dystonia", "metoclopramide-reaction"]),
        choice("metoclopramide", "Oral metoclopramide", "The prior reaction is compatible with acute dystonia, which contraindicates metoclopramide reuse.", "Choose the familiar approved prokinetic while dismissing a resolved event.", "Gastroparesis requires a prokinetic and no contraindication or prior dystonic/TD event is present.", ["metoclopramide-dystonia", "metoclopramide-reaction"]),
        choice("ondansetron", "Oral ondansetron", "Antiemetic symptom control does not address the requested gastric-emptying objective.", "Treat vomiting and gastric motor delay as the same medication target.", "Nausea relief is the remaining target while a separate nutrition/motility plan is addressed.", ["gp-prokinetic", "gp-antiemetic-target"]),
      ],
      explanation: "Interpret the prior neck and eye movements as a metoclopramide-associated dystonic reaction and avoid re-exposure. Erythromycin is an alternative prokinetic to consider after safety review; an antiemetic addresses a different target. No dose or long-term regimen is implied.", claims: ["gp-prokinetic", "metoclopramide-dystonia", "metoclopramide-reaction"],
      reasoning: {
        interpret: "Recognize the prior movement pattern and drug relationship rather than consider it a resolved nonspecific intolerance.", apply: "Avoid the contraindicated prokinetic and choose an alternative that addresses emptying rather than nausea alone.", closest: "metoclopramide",
        decider: "The prior event began after metoclopramide and involved sustained neck/eye movements; the current goal is emptying.", consequence: "Re-exposure can reproduce a serious movement adverse effect; symptom-only treatment can miss the requested physiologic target.",
        counterfactual: "Without a prior dystonic event or other contraindication, metoclopramide could be an appropriate initial prokinetic; the present alternative ranking would no longer be unique.", counterfactualChoice: "metoclopramide",
        deletionTest: "Remove the reaction and two prokinetics become defensible; remove QT/interaction review and erythromycin safety is insufficiently specified.",
        cueAttack: "Three parallel drug names; none contains the desired mechanism. The movement pattern replaces an authored diagnosis label. The task's emptying goal is necessary to distinguish an antiemetic from a prokinetic, not a unique label match.",
        stage: "Three medication choices for the current target after nutrition intervention.", difficulty: "Moderate/hard predicted: identify a historical adverse event and distinguish motor from nausea targets.", sequence: "Standalone; no prior explanation supplies the reaction diagnosis or the alternative drug.",
        limitation: "Erythromycin benefits are conditional and limited; no dose/duration, pediatric use or invasive-procedure preference is authored.",
      },
    }],
  },
  {
    slug: "current-ulcer-risk", patientName: "Caleb Stone", age: 61, sex: "Male", complaint: "Bleeding record review", historicalAcuity: "stable",
    presentation: "{patientName}, a 61-year-old man, attends clinic to review a recent outside admission for melena. A separate admission last year required clipping of a bleeding ulcer.",
    nodes: [{
      slug: "current-low-risk-course", conceptId: "concept.peptic-ulcer-bleeding.high-risk-stigmata-endoscopic-hemostasis", relation: "reuse", creation: "Rewrite", beforeRecordIds: ["inventory.f16e3cf0f0f76cb3"],
      title: "Base current ulcer treatment on current stigmata", objective: "Distinguish a flat pigmented ulcer finding from a protruding vessel when selecting current ulcer-directed therapy.", conceptType: "management",
      update: "During this admission, irrigation exposed a shallow duodenal ulcer with a dark mark level with the base. No projection or blood stream remained. No hemostatic intervention was performed. Subsequent hemoglobin measurements were unchanged, and oral intake resumed.",
      task: "Which acid-suppression plan best fits {patientName}'s current admission findings?",
      choices: [
        choice("healing-ppi", "Scheduled oral omeprazole for ulcer healing", "The current flat finding and stable course do not call for an intensive post-hemostasis course simply because last year's ulcer required clipping. An active ulcer still needs healing treatment.", "Interpret the current lesion rather than inherit an older treatment intensity.", "The current ulcer has low-risk stigmata with a stable course and oral tolerance.", ["bleed-low-risk", "bleed-healing-ppi"]),
        choice("intensive-ppi", "High-dose pantoprazole during monitored post-hemostasis care", "That course follows treatment of high-risk ulcer stigmata; the current procedure did not show or treat such a lesion.", "Treat a prior clipped ulcer or the word melena as an enduring high-risk stigma.", "The current admission requires successful hemostasis of a high-risk ulcer and its initial PPI course.", ["bleed-high-risk", "bleed-ppi"]),
        choice("h2", "Scheduled oral famotidine for ulcer treatment", "A less intensive setting does not remove the indication for the PPI-based ulcer-healing plan offered here.", "Conflate no local hemostasis requirement with no need for the preferred ulcer-directed acid suppression.", "A clinician establishes a separate reason for an H2-based acid plan, such as inability to use a PPI; that constraint is not supplied here.", ["bleed-healing-ppi"]),
      ],
      explanation: "Classify the current endoscopic observation: a flat pigmented mark differs from a protruding vessel. The prior admission does not determine today's stigma or require a new post-hemostasis PPI course. Provide oral ulcer-healing therapy in the stable represented course.", claims: ["bleed-low-risk", "bleed-healing-ppi", "bleed-high-risk", "bleed-ppi"],
      reasoning: {
        interpret: "The mark is level with the base after irrigation, not a nonbleeding protruding vessel.", apply: "Use ulcer-healing PPI treatment rather than inherit high-risk post-hemostasis care from a different episode.", closest: "intensive-ppi",
        decider: "The current endoscopic geometry and stable subsequent course differ from the prior clipped-ulcer episode.", consequence: "Misclassification can cause unnecessary invasive/intensive treatment or undertreatment of an actual high-risk lesion.",
        counterfactual: "If this admission instead documented a protruding vessel treated endoscopically, the initial high-dose PPI course would be appropriate.", counterfactualChoice: "intensive-ppi",
        deletionTest: "Deleting the current procedure record makes the older clipping history dominate; deleting last year's history removes the intended episode-anchoring error.",
        cueAttack: "All options are specific acid-suppression courses. The task does not use low risk or name the favored route. Flat geometry is indispensable clinical evidence rather than an authored classification.",
        stage: "Current ulcer-directed acid suppression after the actual EGD course.", difficulty: "Moderate predicted: separate a previous high-risk event from present stigmata. Independent review should challenge whether the episode comparison adds sufficient resident difficulty.",
        sequence: "Standalone; no earlier explanation labels the current ulcer.", limitation: "The proposed regimen ranking needs clinician review; this is not a universal discharge rule or an exact oral dose/duration protocol.",
      },
    }],
  },
  {
    slug: "multiple-ulcer-sites", patientName: "Diane West", age: 64, sex: "Female", complaint: "Endoscopy record review", historicalAcuity: "urgent_stable",
    presentation: "{patientName}, a 64-year-old woman, attends clinic to review an outside admission for melena. The admission endoscopy documented three ulcer sites after lavage.",
    nodes: [{
      slug: "ulcer-treatment-target", conceptId: "concept.peptic-ulcer-bleeding.high-risk-stigmata-endoscopic-hemostasis", relation: "reuse", creation: "Retire-and-replace", beforeRecordIds: ["inventory.9cc7f1025eee4bb7"],
      title: "Select the hemostatic target from site-specific observations", objective: "Use the actual findings at each ulcer site to choose which lesion requires endoscopic hemostasis.", conceptType: "management",
      update: "In the gastric body, a dark dot lay level with the ulcer floor. In the antrum, pale fibrin covered an even ulcer floor. In the duodenal bulb, a rounded red projection persisted above the ulcer floor after irrigation. The field at each site remained dry.",
      task: "Which treatment should the endoscopist have performed for {patientName}'s recorded findings?",
      choices: [
          choice("duodenum", "Place hemostatic clips at the duodenal-bulb focus", "A persisting protruding vessel remains a high-risk stigma despite the dry field. The other described sites lack that finding.", "Interpret geometry and retain its exact site.", "The duodenal-bulb finding is a nonbleeding protruding vessel.", ["bleed-high-risk", "bleed-low-risk", "bleed-vessel-modality"]),
        choice("body", "Place hemostatic clips at the gastric-body focus", "The body finding is flat after lavage. Its dark color does not give it the same significance as a protruding vessel.", "Treat a dark mark as evidence requiring local treatment regardless of its geometry.", "That site instead has active bleeding or a protruding vessel.", ["bleed-high-risk", "bleed-low-risk", "bleed-vessel-modality"]),
        choice("antrum", "Place hemostatic clips at the gastric-antral focus", "A fibrin-covered even base without a vessel or flow is not the high-risk target described in this record.", "Treat the visible crater with the most extensive surface material.", "That site instead shows active bleeding or a protruding vessel after appropriate inspection.", ["bleed-high-risk", "bleed-low-risk", "bleed-vessel-modality"]),
      ],
      explanation: "Use the relationship to the ulcer floor, not color or the absence of current flow. The duodenal-bulb projection represents the offered target requiring hemostasis. Keep the gastric sites and duodenal site distinct.", claims: ["bleed-high-risk", "bleed-low-risk"],
      reasoning: {
        interpret: "Distinguish the raised nonbleeding focus from two low-risk base appearances.", apply: "Localize the consequential hemostatic action to the correct site.", closest: "body", decider: "A projection persists above the duodenal floor; the gastric dark mark is level with its floor.",
        consequence: "Treating the wrong site leaves the high-risk vessel untreated while exposing another lesion to an unnecessary procedure.",
        counterfactual: "Swap the body and duodenal geometric observations, keeping the labels and dry field unchanged, and the gastric-body treatment becomes correct.", counterfactualChoice: "body",
        deletionTest: "Without the level-versus-raised observations, color and anatomical labels cannot establish the best target.",
        cueAttack: "Every site has an observation; all options name the same action at one site and use parallel lengths. No protected image is promised. The prose record is the actual exhibit; a diagnosis label is withheld without withholding necessary geometry.",
        stage: "Three site-specific local-hemostasis actions during the same endoscopy.", difficulty: "Moderate predicted; tests record interpretation and wrong-site risk rather than an abstract high-risk label. Residual recognition simplicity is flagged for independent review.",
        sequence: "Standalone to prevent earlier feedback classifying a companion lesion or rehearsing the same geometry.", limitation: "Clinical review must confirm the prose observations distinguish a vessel; no device-specific superiority is asserted.",
      },
    }],
  },
  {
    slug: "posthemostasis-ppi-course", patientName: "Arthur Bell", age: 69, sex: "Male", complaint: "Ulcer medication review", historicalAcuity: "stable",
    presentation: "{patientName}, a 69-year-old man, attends clinic for a chart review of acid-suppression treatment during a recent hospital admission for duodenal-ulcer bleeding.",
    nodes: [{
      slug: "initial-ppi-course", conceptId: newConcept("high-risk-ulcer-ppi-phase"), previousConceptId: "concept.n2.ulcer-posthemostasis-acid-suppression", relation: "new_meaning", creation: "Rewrite", beforeRecordIds: ["inventory.54d621b54ff69a27"],
      title: "Do not downstage the initial PPI course from a later dry view", objective: "Use original treated ulcer stigmata and elapsed course stage to distinguish initial high-dose PPI therapy from later ulcer-healing intensity.", conceptType: "management",
      update: "The admission EGD documented spurting from the ulcer, stopped with injection and clipping. A later EGD showed the clips in place with a dry base. At that point, only one day of the initial post-hemostasis PPI course had been completed and there was no new bleeding.",
      task: "Which medication plan should have been continued at this point in {patientName}'s hospital course?",
      choices: [
        choice("high-dose", "Continue the initial high-dose pantoprazole course", "The indication is the treated high-risk lesion and its initial post-hemostasis phase. A dry later view does not erase that treatment history.", "Use the original treated stigma and current course stage together.", "Successful high-risk hemostasis is still within its initial high-dose PPI course.", ["bleed-high-risk", "bleed-ppi"]),
        choice("standard", "Change to a standard-dose omeprazole healing course", "That is an appropriate later stage but downstages the represented initial post-hemostasis phase prematurely.", "Treat a later dry view as though the index ulcer had always been low risk.", "The initial high-dose course is complete or the index lesion had low-risk stigmata without hemostasis.", ["bleed-ppi", "bleed-healing-ppi"]),
        choice("h2", "Change to a scheduled famotidine healing course", "A dry endoscopic field does not replace the supported post-hemostasis PPI indication with an H2-based strategy.", "Assume procedural success makes acid-suppression intensity or class unimportant.", "A separately justified non-PPI acid strategy is needed; no such constraint appears in this record.", ["bleed-ppi"]),
      ],
      explanation: "The index spurting lesion was successfully treated, and only one day of the initial high-dose PPI phase had elapsed. Continue that initial phase, supported for 72 hours, rather than classify the ulcer solely from the later dry view. Accepted high-dose delivery regimens need not all be continuous infusion.", claims: ["bleed-high-risk", "bleed-ppi", "bleed-healing-ppi"],
      reasoning: {
        interpret: "The later dry base documents treatment response, not low-risk pretreatment stigmata.", apply: "Retain the initial post-hemostasis PPI course before moving to ulcer-healing intensity.", closest: "standard",
        decider: "Spurting required successful hemostasis and only one day of the initial course has elapsed.", consequence: "Mistaking response for original risk can prematurely discontinue a supported protective treatment phase.",
        counterfactual: "After completion of the initial high-dose course, a clinically appropriate oral ulcer-healing course becomes reasonable.", counterfactualChoice: "standard",
        deletionTest: "Remove either the original spurting/hemostasis record or the elapsed course stage and the current dry view cannot establish the required intensity.",
        cueAttack: "Three medication courses have parallel labels. The history does not announce that PPI was omitted. A known treated lesion is needed for the regimen task; current absence of bleeding is necessary response evidence, not a safety giveaway.",
        stage: "Three acid-suppression courses at a defined post-hemostasis stage.", difficulty: "Moderate predicted: distinguish pretreatment risk from observed treatment response and course completion.",
        sequence: "Standalone; the low-risk case is not a preceding scored companion. No feedback reveals another item's regimen.", limitation: "No claim that pantoprazole is uniquely superior to another accepted high-dose PPI or that the later EGD is routine care.",
      },
    }],
  },
  {
    slug: "ulcer-rescue-course", patientName: "Henry Cole", age: 69, sex: "Male", complaint: "Hospital bleeding review", historicalAcuity: "obvious_emergency",
    presentation: "{patientName}, a 69-year-old man, attends clinic to review the records of a recent duodenal-ulcer bleeding admission. Each decision concerns the outside hospital's care at the displayed point in that admission.",
    nodes: [
      {
        slug: "recurrent-bleeding-repeat", conceptId: "concept.n2r3.ulcer-recurrence-rescue-sequence", relation: "reuse", creation: "Rewrite", beforeRecordIds: ["inventory.e91555ce66564f4f"],
        title: "Recognize recurrence and select a repeat therapeutic attempt", objective: "Distinguish passage of old blood from a new hemorrhage after successful initial hemostasis and select repeat endoscopic treatment in the stabilized course.", conceptType: "management",
        update: "Injection and clipping stopped a jet from an 8 mm duodenal-bulb ulcer. One subsequent dark stool occurred with unchanged hemoglobin. Later, fresh hematemesis accompanied a new hemoglobin fall and transient hypotension. After resuscitation, blood pressure was 118/70 mmHg and pulse 94/min. The first EGD had reached the focal ulcer directly.",
        task: "Which hemostatic procedure should the hospital have arranged at this point in {patientName}'s admission?",
        choices: [
          choice("repeat-endoscopy", "Repeat therapeutic upper endoscopy", "The new hematemesis and clinical change establish recurrence after initial success. The current resuscitated course and previously accessible target support a further endoscopic therapeutic attempt.", "Read chronology and current response instead of classifying every post-treatment dark stool as failed hemostasis.", "Initial hemostasis succeeded, bleeding recurs, and the current course supports repeat endoscopic treatment.", ["bleed-old-blood", "bleed-repeat"], "timing.test.upper_endoscopy"),
          choice("embolization", "Transcatheter arterial embolization", "The current restored circulation and focal small-ulcer course support the offered endoscopic approach to this new episode. Direct angiographic escalation is not the best offered stage in this record.", "Treat recurrence itself as proof that repeat endoscopic rescue has failed.", "Appropriate repeat endoscopic hemostasis is unsuccessful in a patient suitable for angiographic rescue.", ["bleed-repeat", "bleed-embolization"], "timing.test.advanced_diagnostic"),
          choice("operation", "Operative duodenotomy and ulcer hemostasis", "Operative rescue is consequential, but this current record supports an endoscopic recurrence attempt before that escalation.", "Anchor on the earlier hypotension and overlook the actual resuscitation response.", "Less invasive rescue has failed or current physiology/anatomy supports operative control.", ["bleed-repeat", "bleed-operation"], "timing.test.advanced_diagnostic"),
        ],
        explanation: "The isolated early dark stool and the later fresh hematemesis are different observations. After successful first treatment, the later change represents recurrence. The stabilized course supports repeat therapeutic endoscopy at this stage.", claims: ["bleed-old-blood", "bleed-repeat", "bleed-embolization", "bleed-operation"],
        reasoning: {
          interpret: "Separate old blood passage without a new trend from the later episode with fresh emesis and a new circulatory/hemoglobin change.", apply: "Use present resuscitation response and initial success to choose repeat therapeutic endoscopy.", closest: "embolization",
          decider: "A genuinely new hemorrhage followed documented initial success, with current circulation restored and a small previously reached target.", consequence: "Misreading chronology can cause unnecessary rescue or premature bypass of a useful endoscopic stage.",
          counterfactual: "If a properly performed repeat endoscopic treatment failed to control the same bleeding target in the stabilized patient, arterial embolization would become the supported escalation.", counterfactualChoice: "embolization",
          deletionTest: "Remove the later fresh bleeding and intervention is not established by old stool; remove the resuscitation response and the endoscopy-versus-operation ranking becomes unsafe to assume.",
          cueAttack: "Removed named missing-action and equal-availability permission sentences. Every option is a concrete hemostatic procedure with a preview estimate. No future failure is disclosed in the current context or feedback.",
          stage: "Hemostatic procedure selection after recurrence and resuscitation.", difficulty: "Moderate/hard predicted: chronology, response and stage must all be used.",
          sequence: "Post-answer explanation is restricted to recurrence and the current endoscopic stage; it does not state the next node's keyed rescue.", limitation: "The old N2 source hold remains historical. New targeted ESGE verification supports this narrower draft; unresolved shock/large-ulcer ranking remains withheld.",
        },
      },
      {
        slug: "failed-endoscopy-embolization", conceptId: "concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality.v2", relation: "reuse", creation: "new", beforeRecordIds: [],
        title: "Escalate after documented repeat-treatment failure", objective: "Choose angiographic rescue after repeat endoscopic hemostasis has failed under the described resuscitated conditions.", conceptType: "management",
        update: "At repeat EGD of the same ulcer, attempted cap-mounted capture and contact therapy did not stop the jet. Topical rescue briefly obscured it, but fresh blood continued through the treated field. Repeated lavage could not maintain a targetable view. During continued resuscitation, blood pressure was maintained without increasing support.",
        task: "Which hemostatic procedure should the hospital have arranged next for {patientName} after this repeat EGD?",
        choices: [
          choice("embolization", "Transcatheter arterial embolization", "The repeated therapeutic attempt has now failed across attempted endoscopic rescue modalities. The represented response permits angiographic escalation rather than another poorly targeted attempt.", "Use the newly demonstrated failure boundary.", "Repeat endoscopic control is unsuccessful and the current course supports angiographic rescue.", ["bleed-embolization"], "timing.test.advanced_diagnostic"),
          choice("repeat-endoscopy", "Another therapeutic upper endoscopy", "The record describes treatment failure and a persistently untargetable field, not merely a prior procedure or an untreated accessible focus.", "Repeat a generally useful modality despite its documented present access/control failure.", "A correctable acquisition/access problem leaves a newly targetable focus for a meaningful repeat intervention.", ["bleed-repeat", "bleed-embolization"], "timing.test.upper_endoscopy"),
          choice("operation", "Operative duodenotomy and ulcer hemostasis", "Operation is a consequential alternative, but the represented maintained circulation and guideline-supported angiographic stage determine the offered ranking in the current record.", "Jump directly from failed endoscopy to operation without considering supported angiographic rescue.", "Angiographic control is unsuccessful or another current reason requires operation.", ["bleed-embolization", "bleed-operation"], "timing.test.advanced_diagnostic"),
        ],
        explanation: "This record crosses a new boundary: the repeat therapeutic attempt failed and the field no longer supports accurate treatment. Arterial embolization is the supported next escalation for the represented course.", claims: ["bleed-embolization", "bleed-repeat", "bleed-operation"],
        reasoning: {
          interpret: "Recognize persistent bleeding despite attempted repeat definitive and topical rescue, rather than simply recurrent bleeding after an earlier success.", apply: "Select an angiographic route instead of repeating the failed access strategy.", closest: "repeat-endoscopy",
          decider: "Actual rescue attempts failed and lavage cannot maintain a targetable view; circulatory support is not escalating.", consequence: "Further untargeted treatment can delay hemorrhage control or cause injury.",
          counterfactual: "If lavage instead restored a stable view of an untreated focal vessel and the preceding attempt had ended before targeted therapy, another therapeutic endoscopic intervention could become appropriate.", counterfactualChoice: "repeat-endoscopy",
          deletionTest: "Without actual treatment/access failure, the prior node's repeat-endoscopy plan remains defensible. Current support response is retained to avoid an unstable-patient blanket rule.",
          cueAttack: "The three labels match the prior stage's procedure category, but the key changes because new failure evidence changes the decision. No statement announces that embolization is available or guarantees its success.",
          stage: "Procedural rescue after unsuccessful repeat endoscopic hemostasis.", difficulty: "Hard predicted: keep recurrence and repeated-control failure distinct despite familiar procedure labels.",
          sequence: "The preceding feedback never names this escalation. This explanation stops at embolization and does not name the next node's answer.", limitation: "Reuses an existing rescue concept; adds a different actual endoscopic-failure context without moving old FSRS history to a new meaning.",
        },
      },
      {
        slug: "failed-embolization-operation", conceptId: newConcept("operative-rescue-after-embolization"), relation: "new_meaning", creation: "new", beforeRecordIds: [],
        title: "Escalate after unsuccessful angiographic control", objective: "Choose operative ulcer hemostasis after the recorded endoscopic and angiographic rescue attempts fail.", conceptType: "management",
        update: "Angiography identified extravasation at the ulcer territory. Embolization was performed, but completion runs still showed filling through a collateral that the microcatheter could not enter. Hematemesis continued. The endoscopic field remained obscured, and circulatory support requirements were increasing despite ongoing resuscitation.",
        task: "Which hemostatic procedure should the hospital have arranged at this later point in {patientName}'s admission?",
        choices: [
          choice("operation", "Operative duodenotomy and ulcer hemostasis", "The record now documents unsuccessful endoscopic and angiographic rescue with continuing bleeding and worsening support needs. Operative control is the supported escalation.", "Use actual completion-angiography findings rather than the fact that a procedure was performed.", "Bleeding persists after unsuccessful angiographic and endoscopic control.", ["bleed-operation"] , "timing.test.advanced_diagnostic"),
          choice("endoscopy", "Repeat therapeutic upper endoscopy", "The same target remains obscured after prior failed rescue. No new endoscopic access improvement is supplied.", "Return to the least invasive familiar procedure despite unchanged failure conditions.", "New access findings establish a useful endoscopic target before the recorded sequence has failed.", ["bleed-repeat", "bleed-operation"], "timing.test.upper_endoscopy"),
          choice("angiography", "Repeat selective catheter embolization", "Completion imaging documents continued collateral filling and the remaining route was not catheterizable during the current attempt. Repeating that same access plan does not address the demonstrated failure and escalating course.", "Read coils deployed as nearly successful control and discount the residual vessel access finding.", "A newly identified, catheterizable bleeding vessel offers a credible additional route and the patient's current course supports it.", ["bleed-operation", "bleed-embolization"], "timing.test.advanced_diagnostic"),
        ],
        explanation: "Procedure completion is not proof of hemostasis. Continued extravasation, an inaccessible residual collateral and increasing support requirements show unsuccessful angiographic rescue. Arrange operative control at the outside hospital.", claims: ["bleed-operation", "bleed-embolization", "bleed-repeat"],
        reasoning: {
          interpret: "Read residual filling and continuing blood loss as failed control, despite placement of embolic material.", apply: "Escalate to operative hemostasis when both less invasive control routes have failed in the worsening course.", closest: "angiography",
          decider: "The completion run still fills the bleeding territory through a noncatheterizable route and support needs rise.", consequence: "Mislabeling an attempted embolization as successful control delays source control during continued hemorrhage.",
          counterfactual: "A new accessible arterial branch with a credible catheter route and a stable course could justify another selective embolization attempt rather than this operative escalation.", counterfactualChoice: "angiography",
          deletionTest: "Remove the residual-flow/access record and repeat catheter treatment becomes plausible; remove current deterioration and urgency is incompletely characterized.",
          cueAttack: "All choices name a hemostatic procedure; none adds a uniquely cautious or comprehensive package. Completion results replace the teaching phrase embolization failed. Current worsening is necessary clinical context rather than invented unavailability.",
          stage: "Current definitive procedural rescue after actual treatment outcomes.", difficulty: "Hard predicted: distinguish an attempted intervention from achieved control and interpret the remaining access constraint.",
          sequence: "Prior feedback taught why to start angiographic rescue, not what to do after its new completion findings. This node has a separate operative-rescue construct.", limitation: "The exact collateral scenario and repeat-embolization ranking require clinician review; no technical vessel-control recipe is invented.",
        },
      },
    ],
  },
  {
    slug: "aspirin-after-ulcer", patientName: "Paul Young", age: 67, sex: "Male", complaint: "Discharge medication review", historicalAcuity: "stable",
    presentation: "{patientName}, a 67-year-old man, attends clinic after an outside admission for gastric-ulcer bleeding. Before admission he took aspirin after a documented myocardial infarction.",
    nodes: [{
      slug: "secondary-prevention-aspirin", conceptId: newConcept("aspirin-secondary-prevention-after-bleed"), relation: "new_meaning", creation: "new", beforeRecordIds: [],
      title: "Balance secondary prevention with recurrent-ulcer protection", objective: "Retain indicated secondary-prevention aspirin with ulcer gastroprotection after hemostasis rather than wait for complete healing or substitute an unsupported antiplatelet plan.", conceptType: "management",
      update: "Endoscopic ulcer hemostasis was achieved. The discharge record documents recovery without further bleeding; aspirin had been stopped during the admission. There is no coronary stent or second antiplatelet medicine in his record.",
      task: "Which discharge medication plan best fits {patientName}'s recorded aspirin indication and ulcer course?",
      choices: [
        choice("aspirin-ppi", "Resume aspirin with PPI gastroprotection", "The aspirin indication is secondary cardiovascular prevention. After control, it should not remain withheld until complete ulcer healing; PPI protection addresses recurrent-ulcer risk.", "Weigh the established antiplatelet indication together with the treated ulcer.", "Secondary-prevention aspirin remains indicated after successful hemostasis.", ["aspirin-secondary", "aspirin-ppi"]),
        choice("withhold", "Withhold aspirin until endoscopic ulcer healing", "Waiting for full healing disregards the secondary-prevention indication after a recovered bleeding course.", "Apply a blanket stop rule after a serious bleed.", "A clinician determines aspirin has no continuing secondary-prevention indication or a specific unresolved bleeding reason requires a different temporary plan.", ["aspirin-secondary"]),
        choice("clopidogrel", "Substitute clopidogrel with PPI gastroprotection", "The record supplies no indication to change antiplatelet agents. The supported ulcer-bleeding recommendation preserves the indicated aspirin rather than automatically substitute another agent.", "Assume changing antiplatelet identity solves the ulcer-risk problem.", "A separate established cardiovascular indication or aspirin contraindication calls for clopidogrel.", ["aspirin-secondary", "aspirin-ppi"]),
      ],
      explanation: "The prior infarction establishes secondary prevention, and hemostasis has been achieved. Resume the indicated aspirin with PPI protection rather than wait for complete healing or change agents solely from the ulcer history. This item does not prescribe an exact restart day.", claims: ["aspirin-secondary", "aspirin-ppi"],
      reasoning: {
        interpret: "Distinguish secondary prevention after infarction from an optional preventive medication, then use the achieved hemostasis/current course.", apply: "Restore the indicated aspirin while addressing ulcer protection.", closest: "withhold", decider: "A documented prior infarction provides an ongoing indication after controlled bleeding.",
        consequence: "Unnecessarily prolonged interruption exposes the patient to avoidable thrombotic risk.",
        counterfactual: "If review instead showed no secondary-prevention indication, withholding aspirin for reassessment would become reasonable; that would be a different prescribing question.", counterfactualChoice: "withhold",
        deletionTest: "Without the actual aspirin indication, the balance is ambiguous. Without achieved control/current recovery, the discharge-phase recommendation cannot be assumed.",
        cueAttack: "All options are specific antiplatelet plans, not a generic risk-benefit discussion. PPI appears in two options so its presence cannot identify the key. The stent/second-agent negatives define scope and avoid a hidden DAPT decision.",
        stage: "Discharge antiplatelet prescribing after a controlled ulcer bleed.", difficulty: "Moderate predicted: secondary-prevention interruption and automatic substitution are credible competing errors.", sequence: "Standalone; the preceding PPI item is not its case companion and cannot supply this antiplatelet decision.",
        limitation: "Single current ESGE source; precise restart timing, recent stent/DAPT and anticoagulant cases remain outside the keyed scope.",
      },
    }],
  },
  {
    slug: "perforation-record", patientName: "James Porter", age: 57, sex: "Male", complaint: "Perforation admission review", historicalAcuity: "obvious_emergency",
    presentation: "{patientName}, a 57-year-old man, attends clinic after a hospital admission for sudden upper abdominal pain. The chart review follows the investigation and source-control decisions during that admission.",
    nodes: [
      {
        slug: "perforation-imaging", conceptId: newConcept("suspected-perforation-imaging"), relation: "new_meaning", creation: "new", beforeRecordIds: [],
        title: "Investigate suspected perforation after a negative radiograph", objective: "Select CT for suspected gastroduodenal perforation when plain imaging does not settle the clinical question.", conceptType: "workup",
        update: "At presentation, pain began abruptly after several weeks of epigastric discomfort. Examination recorded upper abdominal guarding and pain with movement. The upright chest radiograph showed no subdiaphragmatic free air. Blood pressure was maintained during initial treatment.",
        task: "Which investigation should the hospital have arranged next for {patientName}'s acute abdominal findings?",
        choices: [
          choice("ct", "CT of the abdomen and pelvis", "Persistent clinical concern remains despite the radiograph. CT can assess a gastroduodenal leak and other causes of the acute abdominal findings.", "Integrate the examination with the limits of a negative plain film.", "The clinical findings raise concern for gastroduodenal perforation and CT is appropriate for the patient.", ["perforation-ct"], "timing.test.ct"),
          choice("contrast", "Water-soluble upper gastrointestinal contrast study", "A contrast study has a selected role when a suspected leak remains unresolved, but CT is the recommended next examination in this initial radiograph-negative acute evaluation.", "Choose a luminal leak test before the broader recommended cross-sectional assessment.", "Initial CT leaves continued suspicion of a sealed or small gastroduodenal leak requiring further contrast assessment.", ["perforation-ct", "perforation-nom"], "timing.test.contrast_swallow"),
          choice("endoscopy", "Upper endoscopy with gastric and duodenal inspection", "A possible free perforation is not an uncomplicated-ulcer mucosal evaluation. This study does not replace the recommended cross-sectional assessment of the acute extraluminal question.", "Anchor on preceding dyspepsia and use the familiar ulcer investigation.", "A stable nonperforation ulcer or structural mucosal question is the actual investigation target.", ["perforation-ct", "perforation-source-control"], "timing.test.upper_endoscopy"),
        ],
        explanation: "A plain radiograph without visible free air does not settle suspected perforation. Persistent acute guarding and pain with movement require interpretation of that limitation; CT addresses the remaining acute abdominal question.", claims: ["perforation-ct", "perforation-source-control", "perforation-nom"],
        reasoning: {
          interpret: "The negative plain film has not explained an abrupt peritoneal-pattern presentation.", apply: "Choose the appropriate next imaging investigation rather than downgrade to a mucosal-ulcer workup.", closest: "contrast", decider: "Acute guarding remains unexplained after a plain radiograph; no CT has yet supplied cross-sectional evidence.",
          consequence: "Misreading the plain film can delay recognition and control of a leak.", counterfactual: "If CT were equivocal and clinical suspicion persisted for a small or sealed gastroduodenal leak, a water-soluble contrast study could become reasonable.", counterfactualChoice: "contrast",
          deletionTest: "Remove the acute examination and outpatient mucosal workup becomes plausible; remove the actual prior modality and the next imaging stage is unclear.",
          cueAttack: "Three named investigations, all with estimates. No perforation diagnosis appears in the complaint or presentation, and the task does not name CT or a sensitivity superlative. Guarding is necessary safety/interpretation data.",
          stage: "Initial acute diagnostic investigation at the outside hospital.", difficulty: "Moderate predicted: integrate a negative low-sensitivity observation with the clinical course and choose the next diagnostic stage.",
          sequence: "Feedback does not specify a repair technique. CT/operative findings are revealed only at the next node.", limitation: "Single WSES guideline; no clinical sensitivity percentage, contrast protocol or universal stability cutoff is authored.",
        },
      },
      {
        slug: "small-duodenal-repair", conceptId: newConcept("small-duodenal-perforation-repair"), relation: "new_meaning", creation: "new", beforeRecordIds: [],
        title: "Select the scope of repair for a small duodenal perforation", objective: "Choose primary repair for a small viable duodenal perforation rather than an unnecessarily extensive diversion or resection.", conceptType: "management",
        update: "CT showed contrast beyond the duodenal bulb with adjacent gas and fluid. After resuscitation, diagnostic laparoscopy found an 8 mm anterior bulb defect with edges that held sutures. No outlet narrowing or mass was seen; blood pressure remained maintained without vasoactive support.",
        task: "Which source-control operation best fits {patientName}'s operative findings?",
        choices: [
          choice("primary", "Primary suture repair with peritoneal lavage", "The small viable defect and maintained physiology support primary repair. The record does not establish a need for a larger resection or diversion.", "Match repair scope to actual defect anatomy and tissue quality.", "A small peptic perforation has tissue suitable for repair and no separate resection/diversion indication.", ["perforation-primary-repair", "perforation-source-control"]),
          choice("resection", "Distal gastrectomy with gastrojejunal reconstruction", "This is a more extensive operation than the represented small anterior duodenal defect requires.", "Treat emergency source control as an indication to add a definitive resection for ulcer disease.", "Different gastric lesion anatomy or other established indications justify resection, particularly a large concerning gastric defect.", ["perforation-primary-repair", "perforation-complex-defect"]),
          choice("exclusion", "Pyloric exclusion with gastrojejunal bypass", "The viable small defect and absence of a narrowing or complex local disruption do not establish a need for diversion.", "Apply a complex-duodenal-defect strategy to a directly repairable lesion.", "A large, complex duodenal defect requires a tailored diversion strategy after assessment of anatomy and physiology.", ["perforation-primary-repair", "perforation-source-control", "perforation-complex-defect"]),
        ],
        explanation: "The measured small defect, suture-holding edges and maintained physiology support primary repair. Do not make a routine omental patch mandatory: the guideline does not establish that it adds protection in every small perforation. Larger or complex defects require a different, individualized operation.", claims: ["perforation-primary-repair", "perforation-source-control", "perforation-access"],
        reasoning: {
          interpret: "Identify a small directly repairable duodenal defect, rather than a large gastric or complex duodenal disruption.", apply: "Select a source-control operation proportional to that anatomy and current physiology.", closest: "exclusion", decider: "The anterior bulb defect is 8 mm, holds sutures, and has no mass or outlet narrowing.",
          consequence: "An unnecessary diversion/resection adds operative burden; inappropriate primary closure of a complex defect would be a different error.",
          counterfactual: "A large friable duodenal disruption with anatomy unsuitable for primary repair could make a tailored exclusion/diversion plan reasonable, pending specialist judgment.", counterfactualChoice: "exclusion",
          deletionTest: "Without size, tissue quality and site, the repair-versus-diversion choice is underdetermined. The physiologic response constrains the operative context.",
          cueAttack: "All options are concrete source-control operations. The key is not a generic limited-operation label; no tissue-preservation goal announces it. The exact 8 mm value is a constructed operative observation, not an invented cutoff.",
          stage: "Source-control procedure choice after direct operative inspection.", difficulty: "Moderate predicted: distinguish repairable anatomy from a larger historical ulcer operation. Independent review must assess whether the diversion foil is sufficiently credible for PGY-2/3.",
          sequence: "Prior feedback established imaging adequacy but did not rank repairs. New direct tissue observations earn this separate decision.", limitation: "Single guideline, low-certainty repair evidence. Patch-versus-no-patch and exact large-defect operations are withheld from unique-best keys.",
        },
      },
    ],
  },
  {
    slug: "perforation-unstable-access", patientName: "Ruth Allen", age: 71, sex: "Female", complaint: "Surgical admission review", historicalAcuity: "obvious_emergency",
    presentation: "{patientName}, a 71-year-old woman, attends clinic to review an outside hospital operation for a perforated duodenal ulcer.",
    nodes: [{
      slug: "unstable-perforation-access", conceptId: newConcept("unstable-perforation-operative-access"), relation: "new_meaning", creation: "new", beforeRecordIds: [],
      title: "Choose source-control access using current physiology", objective: "Use persistent instability to choose open operative source control for a perforated ulcer rather than extrapolate a stable-patient laparoscopic pathway.", conceptType: "management",
      update: "Before operation, CT showed leaking contrast and widespread intraperitoneal fluid. Examination recorded diffuse guarding. Fluid treatment and vasopressors had begun, but support requirements continued to increase. The question concerns the access decision before source control, not later postoperative recovery.",
      task: "Which source-control approach should the hospital have selected for {patientName} at that preoperative stage?",
      choices: [
        choice("open", "Open ulcer repair and peritoneal lavage", "Ongoing instability despite resuscitation supports open source control under the WSES approach, rather than applying the stable-patient laparoscopic preference.", "Use the current support trajectory rather than a general minimally invasive preference.", "A perforated-ulcer patient remains unstable during resuscitation.", ["perforation-access", "perforation-source-control"]),
        choice("laparoscopy", "Laparoscopic ulcer repair and peritoneal lavage", "Laparoscopic access is a supported option for stable patients; the displayed preoperative trajectory has not reached that condition.", "Generalize the benefits of minimally invasive access across different physiology.", "Resuscitation establishes a stable course and suitable expertise is present.", ["perforation-access"]),
        choice("endoscopic", "Endoscopic ulcer closure and percutaneous drainage", "This does not provide the guideline's standard operative response to the represented free leak, diffuse peritoneal findings and worsening support needs.", "Choose a less invasive-looking source-control combination despite a different evidence and physiologic context.", "A specialist team selects a highly unusual, constrained alternative; it is not a standard substitute for this course.", ["perforation-source-control", "perforation-nom"]),
      ],
      explanation: "Current resuscitation response matters more than a generic preference for smaller incisions. A persistent free leak, peritoneal findings and increasing support requirements support open source control in this represented course.", claims: ["perforation-access", "perforation-source-control", "perforation-nom"],
      reasoning: {
        interpret: "Increasing support requirements show that treatment has begun without establishing a stable preoperative state.", apply: "Choose open access for operative source control rather than a stable-patient access pathway.", closest: "laparoscopy", decider: "Support needs continue to rise before source control despite active resuscitation.",
        consequence: "Treating resuscitation started as resuscitation achieved can misapply a different access strategy and delay control.",
        counterfactual: "If treatment instead produced a maintained stable course, laparoscopic repair with suitable expertise would become a reasonable approach.", counterfactualChoice: "laparoscopy",
        deletionTest: "Removing the support trajectory makes stable-patient laparoscopy defensible. Diffuse peritoneal/leak findings retain the source-control indication.",
        cueAttack: "The same repair/lavage operation appears in the two closest options; access is the contested component. No availability sentence selects the key. Started treatment is separated explicitly from actual response.",
        stage: "Preoperative access for source control at the outside hospital.", difficulty: "Moderate predicted: current trajectory defeats anchoring on general laparoscopic benefit or on resuscitation merely being underway.",
        sequence: "Standalone; no stable-perforation feedback precedes this case and gives an access rule.", limitation: "WSES instability-access recommendation is based on very low-certainty evidence. No universal vasopressor dose or physiologic cutoff is invented.",
      },
    }],
  },
  {
    slug: "postgastrectomy-meal-response", patientName: "Martin Hayes", age: 60, sex: "Male", complaint: "Weakness after meals", historicalAcuity: "stable",
    presentation: "{patientName}, a 60-year-old man, attends clinic after distal gastrectomy with Billroth I reconstruction for benign ulcer disease.",
    nodes: [
      {
        slug: "early-meal-diet", conceptId: newConcept("postgastrectomy-early-dumping-diet"), relation: "new_meaning", creation: "new", beforeRecordIds: [],
        title: "Treat the early post-meal response", objective: "Interpret early gastrointestinal/vasomotor symptoms after benign gastric surgery and choose an initial dietary strategy.", conceptType: "management",
        update: "After a large meal with a sweetened drink, he develops cramping, palpitations and loose stool within about twenty minutes. Glucose measured during one episode was 96 mg/dL. He does not vomit retained food and has not changed meal size or composition.",
        task: "Which initial dietary plan best fits {patientName}'s recorded meal-related episodes?",
        choices: [
          choice("small-separated", "Small mixed meals, fewer simple sugars and drinks between meals", "The early gastrointestinal and vasomotor response after gastric surgery supports reducing nutrient bolus size and rapidly absorbed carbohydrate, with drinks separated from meals.", "Interpret timing and glucose rather than equate every weak spell with hypoglycemia.", "Early post-gastric-surgery meal responses are the current problem before dietary treatment.", ["dumping-early", "dumping-diet"]),
          choice("liquid", "Low-fat blended meals with sweetened liquid calorie supplements", "That liquid-calorie approach can help a different gastric tolerance problem, but it does not address this early response to a large sweet liquid-containing meal.", "Apply a delayed-emptying nutrition strategy to the opposite post-meal physiology.", "Solid-food retention from delayed emptying limits nutrition and appropriate liquid supplements are tolerated.", ["dumping-early", "dumping-diet", "gp-diet"]),
          choice("large-low-carb", "Three larger low-carbohydrate meals with drinks between meals", "Reducing carbohydrate does not address the large nutrient load per meal that contributes to this early post-gastric-surgery response.", "Correct the carbohydrate component while preserving an unfavorable meal-volume pattern.", "Usual meal volumes are tolerated and a separate dietary problem is being managed; this is not the initial dumping strategy.", ["dumping-diet"]),
        ],
        explanation: "The early cramping, palpitations and diarrhea with a normal measured glucose fit an early post-gastric-surgery meal response. Begin dietary changes that reduce bolus size and rapidly absorbed carbohydrate, with liquids taken separately. Normal glucose does not exclude that mechanism.", claims: ["dumping-early", "dumping-diet", "gp-diet"],
        reasoning: {
          interpret: "The episode's early timing, gastrointestinal/vasomotor features and measured glucose differ from late hypoglycemia or retained-food vomiting.", apply: "Choose an initial meal-pattern strategy rather than a delayed-emptying diet or carbohydrate restriction with large meals.", closest: "large-low-carb", decider: "Symptoms follow a large sweet liquid-containing meal promptly, with normal glucose during the spell.",
          consequence: "Treating the wrong mechanism can preserve the provoking bolus pattern and prolong symptoms.",
          counterfactual: "If the dominant evidence were retained solid food and a properly documented emptying delay, a low-fat blended/liquid nutrition plan could become appropriate.", counterfactualChoice: "liquid",
          deletionTest: "Without timing and the concurrent glucose, early versus late mechanisms remain uncertain; meal-volume observations distinguish the closest dietary error.",
          cueAttack: "The complaint names a symptom, not dumping. Each option is an actual dietary prescription. The key has an extra component because it describes the supported plan; the closest foil shares liquid separation so that property cannot uniquely cue the answer. Residual length risk requires reviewer attention.",
          stage: "Initial dietary treatment before a dietary trial has failed.", difficulty: "Moderate predicted: identify the early mechanism and avoid applying generic carbohydrate-only or delayed-emptying advice.",
          sequence: "Feedback does not name acarbose or any later medication. The next node requires a new measured late response after actual dietary treatment.", limitation: "Diet-component evidence is uneven. No forced meal count, fluid interval or empiric disease probability is authored.",
        },
      },
      {
        slug: "late-meal-acarbose", conceptId: newConcept("postgastrectomy-late-dumping-treatment"), relation: "new_meaning", creation: "new", beforeRecordIds: [],
        title: "Treat persistent late post-meal hypoglycemia", objective: "Use a new late hypoglycemic response after dietary treatment to select acarbose before further escalation.", conceptType: "management",
        update: "After dietitian-guided smaller meals and reduced simple sugars, the early cramping and diarrhea improve. A later episode of sweating and confusion occurs about two and a half hours after a carbohydrate-rich meal; laboratory glucose is 43 mg/dL and symptoms resolve after carbohydrate. No fasting episodes are recorded. He has not received medication for these episodes.",
        task: "Which preventive medicine should be considered next for {patientName}'s remaining post-meal episodes?",
        choices: [
          choice("acarbose", "Acarbose with meals", "The remaining episodes are late, documented hypoglycemic events despite dietary treatment. Acarbose is the supported offered next medication for this late pattern.", "Use the new time course and measured response rather than the earlier early-symptom label.", "Late dumping persists after dietary intervention and a medication trial is being selected.", ["dumping-late", "dumping-acarbose", "dumping-octreotide"]),
          choice("octreotide", "Octreotide before meals", "Somatostatin analogues are an escalation option, particularly after dietary measures and acarbose have not controlled symptoms. No acarbose trial has yet occurred in this record.", "Escalate directly to a broader injectable treatment when a targeted oral step remains.", "Adequate dietary measures and acarbose fail or cannot be used and a clinician selects further pharmacologic escalation.", ["dumping-octreotide", "dumping-acarbose"]),
          choice("metoclopramide", "Metoclopramide before meals", "A prokinetic addresses delayed gastric emptying, not the represented late hypoglycemic consequence of rapid post-gastric-surgery nutrient delivery.", "Treat any post-gastric-surgery meal symptom with a familiar gastric-motility medicine.", "An adequately established delayed-emptying disorder requires a suitable prokinetic and contraindications are absent.", ["dumping-late", "gp-prokinetic"]),
        ],
        explanation: "The remaining late episodes include measured hypoglycemia and response to carbohydrate after dietary changes. Consider acarbose for this late post-gastrectomy pattern. Somatostatin-analogue escalation may be appropriate if diet and acarbose are inadequate; this is a preventive plan after the acute episode was corrected.", claims: ["dumping-late", "dumping-acarbose", "dumping-octreotide", "gp-prokinetic"],
        reasoning: {
          interpret: "The original early symptoms improved, while a later meal-linked episode now has documented hypoglycemia and corrective response.", apply: "Select the supported medication stage for persistent late dumping rather than a prokinetic or immediate broader escalation.", closest: "octreotide", decider: "Diet was actually tried; the remaining pattern is late hypoglycemia and no medication trial has occurred.",
          consequence: "Treating the former mechanism or skipping the supported targeted stage can leave recurrent neuroglycopenic episodes or add unnecessary treatment burden.",
          counterfactual: "If adequate diet and acarbose failed or acarbose was not tolerated, octreotide could become a reasonable next medication.", counterfactualChoice: "octreotide",
          deletionTest: "Delete the late timing/glucose/correction and the earlier early-response interpretation could persist. Delete actual dietary treatment and a medication-first recommendation is not established.",
          cueAttack: "All options name preventive drugs with parallel timing labels; the task does not say glucose-lowering enzyme inhibitor or identify a mechanism matched only by the key. The acute correction is explicit so emergency carbohydrate treatment is not an omitted competitor.",
          stage: "Preventive pharmacotherapy after acute correction and a completed dietary trial.", difficulty: "Moderate/hard predicted: distinguish the new residual mechanism and sequence acarbose versus somatostatin treatment.",
          sequence: "Earlier feedback supplies no medication name or late hypoglycemia rule. This node uses new treatment response and measured late findings, not a repeated early-mechanism question.", limitation: "Selected post-gastrectomy late pattern, not an exclusion of every hypoglycemia cause. Fasting or unexplained episodes would need a separate evaluation.",
        },
      },
    ],
  },
];

export const STOMACH_TOPIC_ROUND2_DRAFT = { ...STOMACH_TOPIC_DRAFT,
  contentVersion: "question-topic.stomach-ulcer-bleeding-motility.2026-11-11.v2" };
export const STOMACH_TOPIC_PASS_SLUGS = ["cure-calendar", "valid-cure-antibody", "confounded-scan", "prokinetic-reaction",
  "recurrent-bleeding-repeat", "secondary-prevention-aspirin", "perforation-imaging", "unstable-perforation-access", "late-meal-acarbose"];
export const STOMACH_TOPIC_PARKED_SLUGS = ["motility-diet", "jejunal-nutrition", "ulcer-treatment-target", "failed-embolization-operation", "small-duodenal-repair"];
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const reviewedNode = (slug: string) => STOMACH_TOPIC_REVIEWED_V1_ITEMS.flatMap(c => c.nodes).find(n => n.slug === slug)!;
const revise = (slug: string, patch: Partial<TopicNode>): TopicNode => ({ ...clone(reviewedNode(slug)), ...patch, version: 2 });

/** Exactly one attempt for each of the thirteen returned versions. Parked
 * attempts remain inspectable here; they never enter the scored preview.
 */
export const STOMACH_TOPIC_REVISION_ATTEMPTS: TopicNode[] = [
  revise("gastrin-safe-assessment", {
    objective: "Interpret paired gastrin/acid observations during PPI treatment and choose a concrete, safely supervised biochemical reassessment before provocative or localization studies.",
    update: "The operative report documents Billroth II reconstruction for ulcer disease. Fasting gastrin was elevated during omeprazole treatment; gastric aspirate obtained at the same endoscopy had pH 6. Endoscopy still showed a marginal ulcer.",
    task: "Which diagnostic testing plan should be arranged next for {patientName}'s elevated gastrin?",
    choices: [
      choice("paired-biochemistry", "Fasting gastrin with gastric pH after specialist-managed PPI adjustment", "Paired biochemical and acid observations must be interpretable before the elevated gastrin can establish inappropriate secretion. Plan the drug adjustment with specialist protection of the active ulcer, rather than an unsupervised stop.", "Interpret the hormone together with the nonacidic aspirate and PPI exposure.", "The current hormone/acid assessment is confounded and a specialist can plan safe reassessment.", ["gastrin-confounding", "ppi-withdrawal"], "timing.test.combined_diagnostic"),
      choice("secretin", "Secretin-stimulated gastrin measurement during unchanged omeprazole treatment", "Provocation during the current confounded acid-suppression state does not answer the initial question of inappropriate hypergastrinemia.", "Treat an elevated fasting hormone as sufficient grounds for the next provocative study.", "Specialist evaluation establishes interpretable acid conditions and an indication for provocation; the testing conditions would differ.", ["gastrin-confounding", "ppi-withdrawal"], "timing.test.metabolic_workup"),
      choice("localization", "Receptor PET/CT with pancreatic EUS during unchanged omeprazole treatment", "Localization cannot establish why the hormone is elevated in this nonacidic, treated stomach.", "Use an anatomic search to bypass unresolved biochemical interpretation.", "A sufficiently established functional tumor diagnosis calls for localization, outside this node's scored objective.", ["gastrin-confounding", "gastrin-surgery"], "timing.test.combined_diagnostic"),
    ],
    explanation: "An elevated gastrin during PPI treatment with a nonacidic aspirate does not establish inappropriate acid secretion. Arrange repeat paired fasting gastrin and gastric pH through specialist-managed acid-suppression preparation. The active ulcer makes abrupt unmonitored withdrawal unsafe.",
    reasoning: {
      interpret: "Read the hormone and pH together: the current PPI-exposed, nonacidic sample does not establish the biochemical syndrome.",
      apply: "Choose paired biochemical reassessment with managed preparation before provocation or localization.", closest: "secretin", decider: "The hormone and aspirate were acquired during omeprazole use while an ulcer remained active.", consequence: "Misinterpretation can prompt a false tumor attribution or hazardous unsupervised acid-treatment withdrawal.",
      counterfactual: "With interpretable inappropriate hypergastrinemia established under specialist-controlled conditions and a remaining biochemical question, secretin testing could be appropriate; the current unchanged-PPI conditions would no longer apply.", counterfactualChoice: "secretin",
      deletionTest: "Without paired pH/drug information, the biochemical ambiguity is lost. Without the active ulcer, the particular preparation-safety constraint is not established.",
      cueAttack: "Deleted the named missing specimen map and the broad anatomy-review key. Every label names an actual test plan with explicit treatment conditions; no option is an unspecified assessment umbrella.",
      stage: "Three specific testing strategies before attributing hypergastrinemia to a functional tumor.", difficulty: "Moderate predicted: interpret physiologic confounding, then select an interpretable and safely prepared testing stage.", sequence: "Standalone; no preceding feedback supplies either diagnostic testing conditions or the answer.",
      limitation: "No PPI withdrawal dose, bridge, hold interval or immediate testing instruction is invented. A clinician must specify the actual supervised preparation.",
    },
  }),
  revise("active-infection-recheck", {
    update: "The earlier stool antigen sample was negative six weeks after eradication antibiotics while she was taking omeprazole. Later serum IgG was positive. Omeprazole has now been stopped for three weeks; the most recent antibiotics ended eight weeks ago, with no subsequent bismuth. She has no recurrent bleeding, weight loss or vomiting.",
    choices: [
      choice("breath", "Repeat urea breath testing", "The current shared preparation permits an active-infection reassessment. The earlier on-PPI negative and later antibody result cannot settle persistence.", "Judge assay purpose and acquisition conditions before choosing the next study.", "Active infection remains uncertain after an inadequately prepared specimen and current preparation is adequate.", ["hp-nonserologic", "hp-preparation", "hp-test-of-cure"], "timing.test.h_pylori_breath"),
      choice("serology", "Repeat serum H. pylori IgG testing", "Adequate preparation does not turn antibody serology into a test of current infection after treatment.", "Privilege a recent positive laboratory result over the assay's purpose.", "A prior-exposure research question is being studied rather than eradication; it remains unsuitable for the current task.", ["hp-nonserologic"], "timing.test.basic_labs"),
      choice("endoscopy", "Repeat upper endoscopy with gastric biopsies", "Biopsy can assess infection, but this stable uncomplicated-ulcer follow-up has a noninvasive route to the unresolved infection question and no separate alarm indication.", "Escalate discordant assay results to invasive sampling.", "A structural lesion or alarm feature creates an independent endoscopic indication.", ["hp-test-of-cure", "hp-preparation"], "timing.test.endoscopy_with_sampling"),
    ],
    explanation: "Validate the earlier collection and distinguish antibody persistence from active infection. Current preparation is adequate for a noninvasive active assay. Repeat breath testing is the best offered investigation; repeating IgG does not resolve persistence, and the record supplies no independent endoscopic indication.",
    reasoning: { ...clone(reviewedNode("active-infection-recheck").reasoning),
      decider: "The earlier negative was obtained on PPI, while current medication intervals permit a prepared active assay and no alarm indication redirects the workup.",
      cueAttack: "Preparation is now shared context for every choice. All labels begin Repeat; none uniquely advertises washout or a corrective qualification. The necessary original on-PPI exposure stays visible.",
      sequence: "Standalone version; later salvage selection is a separate case and cannot change this exact question's visible context.",
    },
  }),
  revise("salvage-eradication", {
    conceptId: newConcept("hp-salvage-after-optimized-bqt"), previousConceptId: newConcept("hp-salvage-after-clarithromycin"), relation: "new_meaning",
    title: "Choose salvage after a documented optimized bismuth course",
    objective: "Interpret actual prior eradication regimens and a prepared positive cure test, then select a supported empiric salvage without assuming antibiotic susceptibility.",
    update: "The medication record lists an earlier omeprazole–amoxicillin–clarithromycin course, followed by 14 days of twice-daily PPI, bismuth four times daily, tetracycline 500 mg four times daily and metronidazole 500 mg three times daily, with recorded completion. Stool antigen is positive eight weeks after those antibiotics and three weeks after PPI cessation; no intervening bismuth or antibiotics were taken. Susceptibility results are unavailable. She has no penicillin allergy.",
    task: "Which eradication drug combination best fits {patientName}'s current treatment record?",
    choices: [
      choice("rifabutin", "PPI–amoxicillin–rifabutin therapy", "The actual medication record identifies a completed optimized bismuth regimen, and prepared testing documents persistence. Rifabutin triple therapy is a supported offered empiric salvage in this setting.", "Classify prior treatment from components, validate persistence and distinguish empiric from susceptibility-dependent salvage.", "Persistent infection follows optimized BQT and amoxicillin can be used.", ["r2-hp-rifabutin-salvage", "r2-hp-bqt-components", "hp-preparation"]),
      choice("levofloxacin", "PPI–amoxicillin–levofloxacin therapy", "An unused drug family does not establish susceptibility. This offered fluoroquinolone salvage needs demonstrated susceptibility.", "Change to a new antibiotic family without evaluating the evidence required to use it.", "A susceptible isolate and the patient's prior regimen record support levofloxacin salvage.", ["hp-resistance", "r2-hp-rifabutin-salvage"]),
      choice("clarithromycin", "PPI–amoxicillin–clarithromycin therapy", "The prior course and absent susceptibility evidence do not support empiric clarithromycin reuse.", "Return to a familiar regimen without interpreting the complete prior-treatment record.", "Verified susceptibility and a clinician's adequately evaluated treatment context support a clarithromycin-containing regimen.", ["hp-resistance"]),
    ],
    explanation: "The recorded components and duration identify an optimized bismuth course, not an untried treatment family. The later active test met preparation intervals and remains positive. Among these combinations, rifabutin triple therapy is supported without susceptibility testing; levofloxacin and clarithromycin plans require susceptibility support.",
    claims: ["r2-hp-rifabutin-salvage", "r2-hp-bqt-components", "hp-preparation", "hp-resistance"],
    reasoning: {
      interpret: "Reconstruct the actual completed regimen and validate that the positive follow-up active assay represents persistent infection.", apply: "Use prior optimized-BQT exposure and unknown susceptibility to choose the offered empiric salvage.", closest: "levofloxacin", decider: "A completed optimized bismuth regimen is documented by components/duration, prepared stool antigen remains positive, and no susceptible isolate is available.", consequence: "Selecting an unverified resistance-dependent regimen can produce another failed eradication course.",
      counterfactual: "A documented levofloxacin-susceptible isolate, with the relevant prior treatment history and eligibility reviewed, can make levofloxacin salvage appropriate.", counterfactualChoice: "levofloxacin",
      deletionTest: "Without actual prior components the treatment-experienced branch cannot be selected. Without test preparation, persistence is inadequately established. Without susceptibility status, the closest competing regimen cannot be ranked.",
      cueAttack: "Removed never-received-bismuth wording. All options are three-drug regimens of parallel scope. Both rifabutin and levofloxacin introduce new drug families, so novelty cannot select the key.",
      stage: "Three eradication regimens after an adequately documented treatment-experienced positive cure test.", difficulty: "Hard predicted: interpret regimen composition and assay validity before applying the susceptibility boundary.", sequence: "Self-contained case; preparation and all prior regimen components are restated rather than borrowed from another node.",
      limitation: "VA government guidance cross-checks the current ACG approach. This does not establish a rifabutin dose or rank every possible susceptibility-guided regimen.",
    },
  }),
  revise("complete-emptying-acquisition", {
    conceptId: newConcept("emptying-acquisition-versus-export"), previousConceptId: "concept.gastroparesis.confirmatory-gastric-emptying-scintigraphy", relation: "new_meaning",
    title: "Distinguish incomplete transfer from unperformed acquisition",
    objective: "Interpret acquisition and export records, then recover the actual late gastric-emptying measurement rather than repeat an adequate acquisition or extrapolate it.",
    update: "Endoscopy documented a traversable pylorus and duodenum without an obstructing lesion. The transferred solid-meal study contains paired stomach views and reported retention through two hours. The camera acquisition index lists paired anterior/posterior stomach images at 0, 60, 120 and 240 minutes after the same meal; the export log lists files through 120 minutes. Glucose was controlled and motility-altering medicines were withheld for that study.",
    task: "Which plan should be arranged next to complete {patientName}'s gastric-emptying assessment?",
    choices: [
      choice("recover", "Retrieve the four-hour images and quantify their gastric retention", "The acquisition log documents direct late imaging, while the transfer stops earlier. Recover and interpret the acquired measurement rather than equate an incomplete export with an unperformed study.", "Separate what was measured from what was transferred.", "Direct late images exist under appropriate acquisition conditions and can be recovered for interpretation.", ["gp-four-hour", "gp-short-study", "r2-gp-direct-measurement"], "timing.test.general_diagnostic"),
      choice("repeat", "Repeat the complete solid-meal study with four-hour imaging", "This repeats an acquisition that the camera record documents. It becomes appropriate if the late images were never acquired, cannot be recovered, or are unusable.", "Treat the transferred report as the complete acquisition record.", "The necessary late images were not obtained or cannot provide an interpretable measurement.", ["gp-four-hour", "r2-gp-direct-measurement"], "timing.test.four_hour_protocol"),
      choice("project", "Calculate four-hour retention from the available two-hour measurements", "Projection from earlier time points is not the directly measured late result required by the protocol.", "Treat mathematical completion of an incomplete report as equivalent to the actual late measurement.", "A separate validated modeling exercise, rather than clinical diagnostic acquisition, is the requested task.", ["r2-gp-direct-measurement"], "timing.test.physiology"),
    ],
    explanation: "The acquisition index and export log answer different questions. Direct four-hour images were acquired, so request them and quantify the observed retention. Do not substitute mathematical projection for the late measurement or repeat an entire acquired study just because the transfer stopped early.",
    claims: ["gp-obstruction", "gp-four-hour", "gp-short-study", "gp-confounders", "r2-gp-direct-measurement"],
    reasoning: {
      interpret: "The late acquisition exists; the transfer is incomplete. The normal early report cannot substitute for the actual late observation.", apply: "Recover the acquired late images for quantification rather than order a duplicate acquisition or calculate an unmeasured result.", closest: "repeat", decider: "The acquisition index has a same-meal 240-minute paired image entry while the export ends at 120 minutes.", consequence: "Confusing export with acquisition can cause unnecessary repeat testing or an invalid projected diagnostic result.",
      counterfactual: "If the camera acquisition itself ended at 120 minutes, a new appropriately prepared four-hour solid-meal study would be needed rather than image retrieval.", counterfactualChoice: "repeat",
      deletionTest: "Without the camera-versus-export distinction, retrieval is not established as useful. The adequate outlet examination and preparation prevent reopening a different structural or confounding question.",
      cueAttack: "Every option addresses the gastric measurement and explicitly concerns four-hour data; esophageal and already-excluded structural foils are removed. No single option uniquely repeats the study family.",
      stage: "Three ways of completing the same unresolved diagnostic evidence, not diagnostic tests versus treatments.", difficulty: "Moderate/hard predicted: distinguish acquisition provenance from a report gap, then choose recovery versus repeat or projection.", sequence: "Standalone; no later delayed result or nutrition decision is visible before this choice.",
      limitation: "The image index is an original constructed record. Recovery/quantification is a proposed review plan, not a gameplay image retrieval service; no patient scan or protected figure is reproduced.",
    },
  }),
  revise("motility-diet", {
    update: "A standardized four-hour study documented delayed solid emptying after endoscopy excluded outlet obstruction. Nausea and vomiting limit meal completion. She is still eating by mouth, and the clinic is choosing an initial structured dietary prescription.",
    choices: [
      choice("small-low-residue", "Small low-fat, low-fiber meals with liquid nutrition as needed", "This is a supported initial oral strategy for established delayed emptying.", "Use gastric tolerance and nutritional needs together.", "Oral nutrition remains a reasonable initial route in established gastroparesis.", ["gp-diet"]),
      choice("fiber", "Small whole-grain meals with fiber-enriched nutrition supplements", "Fiber enrichment does not fit the supported initial low-fiber gastric-tolerance strategy.", "Apply general diabetes dietary advice to a different gastric physiology.", "A separate fiber-responsive dietary problem with preserved gastric tolerance is being managed.", ["gp-diet"]),
      choice("fat", "Small calorie-dense meals with high-fat nutrition supplements", "Calorie density does not by itself address the supported lower-fat approach.", "Prioritize calories without considering their gastric tolerance.", "A clinician has established tolerance and a different nutritional indication for that prescription.", ["gp-diet"]),
    ],
    explanation: "Small, lower-fat and lower-fiber meals can support oral intake in gastroparesis. The prescription still requires individual nutritional assessment.",
    reasoning: { ...clone(reviewedNode("motility-diet").reasoning),
      interpret: "The record establishes delayed emptying and a need for structured oral nutrition without a structural obstruction.", apply: "Choose the supported initial diet.", decider: "Established delayed emptying determines the initial diet; the new record deliberately avoids the old tolerated-texture word match.",
      deletionTest: "Deleting the meal-tolerance observations still leaves the same standard dietary key; the attempted repair does not earn a second consequential inference.",
      cueAttack: "Removed the blended-food key match and the already-failed bran prescription. The remaining fat/fiber alternatives are still largely recall contrasts.",
      difficulty: "Still easy after one attempt: fair basic dietary application, not a defensible moderate/hard two-step item.", sequence: "Standalone attempted revision; it cannot scaffold or block other scored nodes.",
      limitation: "PARKED: the verified guidance does not uniquely rank a more complex patient-specific dietary tradeoff. No basic-purpose exception is accepted; no new cutoff or formula is invented to manufacture difficulty.",
    },
  }),
  revise("jejunal-nutrition", {
    task: "Which nutrition support should continue while {patientName}'s longer-term access plan is developed?",
    choices: [
      choice("jejunal", "Continue postpyloric enteral feeding", "The documented successful delivery supports continued intestinal nutrition while access is planned.", "Use actual delivered nutrition rather than assume all gut feeding failed.", "Postpyloric feeding achieves the prescribed nutrition.", ["gp-jejunal", "gp-parenteral"]),
      choice("parenteral", "Substitute central venous parenteral nutrition", "The record documents a successful enteral route, so intravenous substitution is not established as necessary.", "Escalate to intravenous support because gastric feeding failed.", "Adequate enteral support cannot be achieved or safely used.", ["gp-parenteral"]),
      choice("gastric", "Resume gastric enteral feeding", "The gastric route had regurgitated feed while postpyloric delivery was retained.", "Treat permanent planning as a reason to return to the earlier route.", "Current evidence establishes adequate gastric tolerance.", ["gp-jejunal"]),
    ],
    explanation: "Continue a demonstrated adequate postpyloric enteral route rather than treat gastric-feed failure as failure of intestinal nutrition. Access design remains a separate clinical decision.",
    reasoning: { ...clone(reviewedNode("jejunal-nutrition").reasoning),
      interpret: "Actual delivery separates gastric from intestinal route tolerance.", apply: "Continue the successful support while access is considered.", closest: "parenteral", counterfactualChoice: "parenteral",
      cueAttack: "The task now asks a remaining support-continuity decision instead of translating nasojejunal trial directly into a named permanent tube. The necessary actual trial evidence is retained.",
      deletionTest: "Removing successful trial delivery would create unfair uncertainty. With it retained, continuation is still a direct one-step route application.",
      difficulty: "Still easy after one attempt. The supported remaining choice does not produce two consequential inferences.", sequence: "Standalone parked attempt, disconnected from the returned dietary node.",
      limitation: "PARKED: a harder access-design comparison would require evidence to distinguish clinically adequate methods, not a uniquely comprehensive decompression/feeding bundle. No unsupported device ranking or accepted basic exception is claimed.",
    },
  }),
  revise("current-low-risk-course", {
    update: "During this admission, irrigation exposed a shallow duodenal ulcer with a dark mark level with the base. No projection or blood stream remained. Subsequent hemoglobin measurements were unchanged, and oral intake resumed.",
    choices: [
      choice("healing-ppi", "Scheduled oral omeprazole", "The current flat stigma and stable course support ulcer-healing PPI therapy; last year's clipped ulcer does not determine the present episode's intensity.", "Classify the current finding rather than inherit a previous episode's treatment.", "Current stigmata and course are low risk, with oral treatment appropriate.", ["bleed-low-risk", "bleed-healing-ppi"]),
      choice("intensive-ppi", "High-dose intravenous pantoprazole", "A prior clipped episode does not make the current flat lesion a newly treated high-risk ulcer.", "Anchor on the prior hemorrhage when choosing current treatment intensity.", "The current episode includes treated high-risk stigmata and its early high-dose phase.", ["bleed-high-risk", "bleed-ppi"]),
      choice("h2", "Scheduled oral famotidine", "Lower-intensity care does not remove the supported PPI ulcer-healing indication.", "Treat no current spurting as equivalent to no need for preferred ulcer-directed suppression.", "A separate clinician-established reason requires an H2-based plan.", ["bleed-healing-ppi"]),
    ],
    reasoning: { ...clone(reviewedNode("current-low-risk-course").reasoning),
      cueAttack: "Removed the no-hemostatic-intervention event cue. Labels are parallel specific drug/route/intensity regimens at the same decision time; none uniquely says post-hemostasis care.",
      stage: "Current acid-suppression prescribing for the reviewed episode; no option is assigned a different care phase in its label.", sequence: "Standalone, with the actual flat finding and prior episode both visible.",
      difficulty: "Moderate predicted: classify the current stigma, then resist importing treatment intensity from a separate historical episode.",
    },
  }),
  revise("ulcer-treatment-target", {
    update: "During the admission EGD, irrigation removed the clot covering a duodenal-bulb ulcer. Beneath it, an exposed small vessel protruded from the ulcer base; no blood stream was visible. The question concerns local treatment of that focus.",
    task: "Which local endoscopic treatment best fits {patientName}'s documented ulcer focus?",
    choices: [
      choice("thermal", "Contact bipolar coagulation", "This is an accepted definitive local modality for a nonbleeding visible vessel.", "Recognize a persistent high-risk vascular focus despite absent current flow.", "A visible ulcer vessel is suitable for accepted thermal hemostasis.", ["bleed-high-risk", "bleed-vessel-modality"]),
      choice("injection", "Dilute epinephrine injection", "Injection is not a complete definitive monotherapy for this vascular focus.", "Treat temporary injection control as the complete local plan.", "Epinephrine is used as an adjunct in an appropriate combined treatment, not as the sole completed regimen.", ["bleed-epinephrine"]),
      choice("powder", "Topical hemostatic powder", "The current guideline does not make topical therapy interchangeable first-line monotherapy for the described visible vessel.", "Substitute a temporizing surface treatment for a definitive vessel-directed modality.", "A clinician selects topical rescue for persistent active bleeding in its appropriate context.", ["bleed-vessel-modality", "bleed-epinephrine"]),
    ],
    explanation: "A protruding exposed vessel remains a high-risk stigma when the field is dry. Use an accepted definitive vessel-directed modality; injection response does not itself complete therapy.",
    claims: ["bleed-high-risk", "bleed-vessel-modality", "bleed-epinephrine"],
    reasoning: { ...clone(reviewedNode("ulcer-treatment-target").reasoning),
      interpret: "The covering clot was removed and an exposed vessel remained; this is not an unresolved clot-versus-vessel description.", apply: "Select an accepted definitive local hemostatic modality.", closest: "injection", counterfactualChoice: "injection",
      counterfactual: "If choosing a temporary adjunct during active bleeding rather than a completed local regimen, epinephrine could be reasonable; that would be a different task.",
      decider: "An exposed protruding vessel persists after clot removal.", deletionTest: "Deleting most contextual details leaves the same modality rule; this attempted repair still does not establish two consequential inferences.",
      cueAttack: "Removed decorative multiple sites and specified clot removal plus exposed vessel. Three specific local therapies now compete, but the objective remains a basic modality rule.",
      difficulty: "Still easy after one attempt. A fair moderate/hard ranking needs a supported patient-specific modality discriminator that the verified record does not supply.",
      stage: "Local endoscopic therapy during the same procedure.", sequence: "Standalone parked attempt; no frozen companion is modified to make it appear harder.",
      limitation: "PARKED: do not invent a thermal/clip/powder geometry ranking or call this independently accepted foundational practice. The described focus still needs clinician review.",
    },
  }),
  revise("initial-ppi-course", {
    update: "At 09:00 yesterday, admission EGD documented spurting from a duodenal ulcer, stopped by epinephrine and clipping. The medication record shows high-dose pantoprazole from the end of that procedure through 09:00 today. At morning review he was alert, had no further hematemesis and had unchanged serial hemoglobin. Oral intake had resumed.",
    task: "Which acid-suppression regimen best fits this point in {patientName}'s documented hospital course?",
    choices: [
      choice("high-dose", "High-dose pantoprazole", "The treated index stigma and elapsed day place this within the early high-dose phase despite current control.", "Use index risk and neutral elapsed time rather than equate clinical response with completion of protective treatment.", "The early course after successful high-risk ulcer hemostasis is still underway.", ["bleed-high-risk", "bleed-ppi"]),
      choice("standard", "Standard-dose omeprazole", "The oral healing regimen belongs to a different phase or to an initially lower-risk course; current absence of hematemesis does not redefine the index lesion.", "Downstage from current stability while ignoring treated stigmata and elapsed time.", "The early high-dose phase is complete or the initial lesion was low risk.", ["bleed-ppi", "bleed-healing-ppi"]),
      choice("h2", "Scheduled-dose famotidine", "This does not replace the supported PPI-based early post-hemostasis regimen in the displayed record.", "Treat successful hemostasis as a reason to substitute a less appropriate acid regimen.", "A separately justified H2-based strategy is required, outside this record.", ["bleed-ppi"]),
    ],
    explanation: "The clinical response does not change the original spurting stigma. The neutral chronology places this one day after successful hemostasis, within the supported 72-hour high-dose PPI phase. An accepted high-dose delivery regimen need not be continuous infusion; the offered standard-dose healing and H2 regimens do not match this phase.",
    reasoning: { ...clone(reviewedNode("initial-ppi-course").reasoning),
      interpret: "Current absence of hematemesis documents a response; the index spurting lesion and yesterday/today chronology determine the treatment phase.", apply: "Select high-dose PPI at that phase rather than a standard-dose healing or H2 plan.",
      decider: "The record spans one elapsed day after hemostasis of a spurting lesion, with response rather than a new untreated low-risk ulcer.",
      deletionTest: "Without the index stigma or neutral elapsed time, a standard-dose healing course becomes plausible. No second-look endoscopy is needed to establish this comparison.",
      cueAttack: "Removed only/incomplete-course language, unexplained repeat EGD and Continue-versus-Change label pattern. All options are regimen labels. Actual treatment and current response remain clinical observations.",
      stage: "Medication reconciliation at the current morning review after the documented index procedure.",
      sequence: "Standalone; no older low-risk item or changed preceding feedback supplies this phase conclusion.",
    },
  }),
  revise("failed-endoscopy-embolization", {
    update: "During the outside admission, an 8 mm duodenal-bulb ulcer initially stopped bleeding after epinephrine and clips. When bleeding recurred, repeat EGD used attempted cap-mounted clipping and contact therapy, but a jet continued. Powder covered the focus; fresh blood then emerged through that layer and accumulated again after lavage. At that time he was alert, blood pressure was 116/72 mmHg and pulse 96/min, without a vasopressor infusion; repeated measurements were similar during ongoing resuscitation.",
    task: "Which hemostatic procedure should the hospital have arranged after this repeat EGD for {patientName}'s duodenal-bulb ulcer?",
    explanation: "Continued fresh bleeding through the treated field documents lack of control, rather than interpreting powder-related obscuration as a hemostatic response. The contemporaneous restored circulation supports arterial embolization as the next offered rescue after repeat endoscopic therapy failed.",
    reasoning: { ...clone(reviewedNode("failed-endoscopy-embolization").reasoning),
      interpret: "Read continued bleeding after repeat definitive attempts and topical coverage as unsuccessful control, not merely poor visibility.",
      apply: "Use contemporaneous pressure, alertness and absence of vasopressor support to rank angiographic rescue against operative escalation.",
      decider: "Actual repeat treatment has not controlled fresh bleeding; current pressure is 116/72 with pulse 96 and no vasopressor, not an inherited earlier pressure.",
      cueAttack: "Necessary current treatment-response observations remain, but the label untargetable view is removed. The nearest consequential comparison is embolization versus surgery, resolved by the current clinical state and rescue stage rather than a generic maintained-pressure summary.",
      deletionTest: "Without contemporaneous physiology the surgery comparison is underdetermined; without actual fresh blood after treatment, failure is not established by powder obscuration.",
      difficulty: "Moderate/hard predicted: distinguish failure from obscuration, then apply current resuscitation state to the rescue boundary.", sequence: "Self-contained case restates site/size and prior therapy. The exact PASS recurrence node is separately preserved with its original wording.",
    },
  }),
  revise("failed-embolization-operation", {
    update: "During the outside admission, an 8 mm duodenal-bulb ulcer continued bleeding after repeat cap-mounted and contact endoscopic treatment. Gastroduodenal embolization was then attempted. Completion angiography still showed extravasation through collateral filling, and fresh hematemesis continued. Blood pressure was 92/58 mmHg with pulse 118/min while vasopressor support requirements were increasing.",
    task: "Which hemostatic procedure should the hospital have arranged at this point in {patientName}'s recorded duodenal-ulcer course?",
    explanation: "Current fresh bleeding, residual angiographic extravasation and worsening support show unsuccessful hemorrhage control after endoscopic and catheter treatment. Operative ulcer hemostasis is the intended escalation; the exact record does not establish a difficult separate operative-technique choice.",
    reasoning: { ...clone(reviewedNode("failed-embolization-operation").reasoning),
      interpret: "Continuing extravasation and fresh hematemesis show failure despite an attempted embolization.", apply: "Recognize the need for operative escalation in the worsening course.",
      decider: "Both prior rescue routes have failed, with current hypotension and increasing support.",
      cueAttack: "Removed explicit noncatheterizable-collateral and obscured-endoscopy permissions. Necessary actual failure and shock evidence remains; the earlier interventions still make surgery the obvious escalation.",
      deletionTest: "Removing the prior failures would change the care stage and create unfair uncertainty. Retaining them leaves an urgent, essentially single-rule escalation item.",
      difficulty: "Still easy after one attempt. A separate difficult operative-control decision needs supported anatomy and credible technique alternatives that are not established by this record.",
      sequence: "Standalone attempted revision includes the exact bulb site, size, previous interventions and current measurements; no earlier pressure is silently reused.",
      limitation: "PARKED: no accepted safety/basic exception is claimed. Do not manufacture a uniquely best oversewing, resection or collateral-control operation from low-certainty general guidance.",
    },
  }),
  revise("small-duodenal-repair", {
    task: "Which repair strategy is best supported by {patientName}'s measured duodenal defect and operative tissue findings?",
    choices: [
      choice("suture", "Primary suture repair without an omental patch", "Primary repair is supported for the small directly repairable defect, but the guideline does not establish this as uniquely better than added patching.", "Apply the small-defect repair recommendation.", "A clinician selects primary repair without patch for an appropriate defect.", ["perforation-primary-repair"]),
      choice("patch", "Primary suture repair with an omental patch", "The same guideline does not establish a universal advantage or prohibition of patching for this small defect. This remains a defensible competing choice.", "Add local reinforcement in an appropriate repair.", "A clinician selects an adjunctive patch for an appropriate tissue/defect context.", ["perforation-primary-repair"]),
      choice("resection", "Distal gastrectomy with gastrojejunal reconstruction", "The small viable duodenal defect does not establish a resection indication.", "Add a larger ulcer operation during emergency source control.", "Different lesion anatomy or a separately established indication supports resection.", ["perforation-complex-defect"]),
    ],
    explanation: "Primary repair is supported by the small viable defect, but the verified evidence does not uniquely distinguish repair with versus without an omental patch. This comparison is withheld rather than selecting an unsupported winner.",
    reasoning: { ...clone(reviewedNode("small-duodenal-repair").reasoning),
      interpret: "The measured small defect and tissue quality support repair, not a large resection.", apply: "The attempted closer repair alternatives cannot be uniquely ranked from the verified evidence.", closest: "patch", counterfactualChoice: "patch",
      counterfactual: "A clinician-selected tissue context may favor a patch, but this record and the cited guideline do not establish a unique decision-changing criterion.",
      cueAttack: "Retained necessary tissue/physiology instead of hiding feasibility. Replaced disproportionate exclusion with a genuinely plausible patch competitor; this reveals the evidence limit rather than solving it.",
      deletionTest: "Removing tissue quality would make even the primary-repair choice unfair; adding a mandatory patch threshold would invent unsupported precision.",
      difficulty: "Unresolved single-best-answer fairness after one attempt; the plausible patch competitor remains defensible.", sequence: "Standalone parked attempt. The exact PASS imaging question is preserved separately.",
      limitation: "PARKED / KEY WITHHELD: the first array position is an attempted comparison, not a validated key. Both primary-repair variants are defensible; no patch-versus-no-patch teaching point enters scored supply.",
    },
  }),
  revise("early-meal-diet", {
    conceptId: newConcept("dumping-residual-early-symptom-treatment"), previousConceptId: newConcept("postgastrectomy-early-dumping-diet"), relation: "new_meaning",
    title: "Treat a residual post-meal pattern after partial response",
    objective: "Distinguish persistent early vasomotor/gastrointestinal symptoms from controlled later hypoglycemia after diet and acarbose, then select an appropriate pharmacologic escalation.",
    update: "After dietitian-guided small mixed meals with drinks separated from food, he began acarbose. His later post-meal sweating episodes with low glucose stopped. A different pattern persists: nausea, abdominal fullness, palpitations and diarrhea about twenty minutes after eating, with glucose 96 mg/dL during a spell. Increasing acarbose caused marked bloating and diarrhea, so the earlier tolerated dose was resumed.",
    task: "Which additional medicine best fits {patientName}'s remaining meal-related episodes at this stage?",
    choices: [
      choice("octreotide", "Octreotide before meals", "Persistent early vasomotor/GI symptoms remain despite dietary measures and an actual acarbose trial that controlled later hypoglycemia. A somatostatin analogue is a supported escalation for the residual syndrome.", "Interpret the two response patterns rather than assume every residual episode has the same mechanism.", "Established dumping remains symptomatic after dietary treatment with or without acarbose, under clinician assessment.", ["r2-dumping-octreotide", "dumping-early", "dumping-late", "dumping-octreotide"]),
      choice("prokinetic", "Metoclopramide before meals", "A prokinetic targets delayed gastric emptying, not this early vasomotor/diarrheal meal response after gastric resection.", "Anchor on nausea and fullness while overlooking timing, glucose and the accompanying circulatory/GI response.", "Proper testing and the clinical course establish delayed emptying rather than this rapid post-gastrectomy syndrome, with contraindications excluded.", ["gp-prokinetic", "dumping-early"]),
      choice("acarbose-increase", "Higher-dose acarbose with meals", "The existing drug controlled the later hypoglycemic events but did not control this other pattern; the attempted increase also produced limiting symptoms.", "Escalate the medicine that helped one event pattern without distinguishing the residual one.", "Persistent late hypoglycemic events and tolerability support clinician-directed acarbose adjustment.", ["dumping-acarbose", "r2-acarbose-intolerance", "dumping-late"]),
    ],
    explanation: "The response record separates controlled later hypoglycemia from persistent early vasomotor/GI episodes with normal measured glucose. Consider octreotide after the actual dietary and medication trials. Metoclopramide addresses a different motility problem, and the acarbose response does not show control of the remaining pattern.",
    claims: ["dumping-early", "dumping-late", "dumping-acarbose", "dumping-octreotide", "r2-dumping-octreotide", "r2-acarbose-intolerance", "gp-prokinetic"],
    reasoning: {
      interpret: "Compare episode timing, measured glucose and actual response: late low-glucose events improved while an early vasomotor/diarrheal pattern remains.", apply: "Select supported pharmacologic escalation for the residual pattern after diet/acarbose, instead of treating gastric slowing or simply increasing the earlier drug.", closest: "prokinetic", decider: "Early palpitations/diarrhea with glucose 96 persist after the later hypoglycemic events stopped; acarbose escalation was not tolerated.", consequence: "Misclassification can add a prokinetic for the wrong physiology or prolong uncontrolled symptoms through a mismatched dose escalation.",
      counterfactual: "If the remaining course instead showed retained-food vomiting with a properly established solid-emptying delay and no early vasomotor/diarrheal response, an appropriate prokinetic could become reasonable.", counterfactualChoice: "prokinetic",
      deletionTest: "Without the separate timing/glucose/response patterns, a different residual mechanism cannot be inferred. Without actual dietary and medication trials, this escalation stage is not established.",
      cueAttack: "Removed trigger-repeating dietary foils and the uniquely comprehensive meal plan. Three named drug strategies require medical interpretation; neither octreotide nor metoclopramide repeats a symptom phrase. The prior dose-response is actual evidence, not an invented universal maximum.",
      stage: "Pharmacologic management after actual dietary intervention and partial medication response.", difficulty: "Moderate/hard predicted: infer the remaining physiology from two response patterns, then choose a supported next treatment target.",
      sequence: "Self-contained later follow-up, separate from the exact preserved late-acarbose PASS; no changed preceding explanation is attached to that PASS node.",
      limitation: "No dose or formulation hierarchy for octreotide is asserted. Acarbose is not claimed universally ineffective for early symptoms; the actual patient response defines this comparison.",
    },
  }),
];

export const STOMACH_TOPIC_ITEM_STATUSES = STOMACH_TOPIC_REVIEWED_V1_ITEMS.flatMap(c => c.nodes).map(n => ({
  slug: n.slug, reviewedQuestionVariantId: `question.topic.${STOMACH_TOPIC_SLUG}.${n.slug}.v1`,
  questionVariantId: `question.topic.${STOMACH_TOPIC_SLUG}.${n.slug}.v${STOMACH_TOPIC_PASS_SLUGS.includes(n.slug) ? 1 : 2}`,
  status: STOMACH_TOPIC_PASS_SLUGS.includes(n.slug) ? "pass-preserved" as const
    : STOMACH_TOPIC_PARKED_SLUGS.includes(n.slug) ? "parked" as const : "revised" as const,
  revisionAttempts: STOMACH_TOPIC_PASS_SLUGS.includes(n.slug) ? 0 : 1,
  independentPass: STOMACH_TOPIC_PASS_SLUGS.includes(n.slug), clinicalApproval: false,
}));
const revisedCase = (node: TopicNode): TopicCase => {
  const old = STOMACH_TOPIC_REVIEWED_V1_ITEMS.find(c => c.nodes.some(n => n.slug === node.slug))!;
  const presentation = node.slug === "salvage-eradication"
    ? "{patientName}, a 46-year-old woman, attends clinic to review persistent positive H. pylori tests after ulcer-eradication treatment."
    : node.slug === "early-meal-diet"
      ? "{patientName}, a 60-year-old man, attends clinic after Billroth I reconstruction for benign ulcer disease to review symptoms during later dietary and medication treatment."
      : old.presentation;
  return { ...clone(old), version: 2, slug: `${node.slug}-standalone`, presentation, nodes: [node] };
};
export const STOMACH_TOPIC_REVISION_ATTEMPT_ITEMS = STOMACH_TOPIC_REVISION_ATTEMPTS.map(revisedCase);
export const STOMACH_TOPIC_PARKED_ATTEMPT_ITEMS = STOMACH_TOPIC_REVISION_ATTEMPT_ITEMS.filter(c => STOMACH_TOPIC_PARKED_SLUGS.includes(c.nodes[0]!.slug));
export const STOMACH_TOPIC_REVISED_ITEMS = STOMACH_TOPIC_REVISION_ATTEMPT_ITEMS.filter(c => !STOMACH_TOPIC_PARKED_SLUGS.includes(c.nodes[0]!.slug));
export const STOMACH_TOPIC_PASS_ITEMS = STOMACH_TOPIC_REVIEWED_V1_ITEMS.flatMap(c => c.nodes.filter(n => STOMACH_TOPIC_PASS_SLUGS.includes(n.slug)).map(n => ({ ...clone(c), nodes: [clone(n)] })));
export const STOMACH_TOPIC_ITEMS = [...STOMACH_TOPIC_PASS_ITEMS, ...STOMACH_TOPIC_REVISED_ITEMS];
export const STOMACH_TOPIC_SOURCES = ledger.sources as ClinicalSource[];
export const STOMACH_TOPIC_CLAIMS = ledger.claims as EvidenceClaim[];
export const stomachQuestionId = (node: TopicNode) => `question.topic.${STOMACH_TOPIC_SLUG}.${node.slug}.v${node.version ?? 1}`;
export const stomachCaseId = (item: TopicCase) => `case.topic.${STOMACH_TOPIC_SLUG}.${item.slug}.v${item.version ?? 1}`;
export const stomachNodeId = (node: TopicNode) => `node.topic.${STOMACH_TOPIC_SLUG}.${node.slug}.v${node.version ?? 1}`;
const choiceId = (node: TopicNode, item: Choice) => node.version === 2
  ? `choice.topic.${STOMACH_TOPIC_SLUG}.${node.slug}.v2.${item.id}`
  : `choice.topic.${STOMACH_TOPIC_SLUG}.${node.slug}.${item.id}`;
const draftFor = (node: TopicNode) => node.version === 2 ? STOMACH_TOPIC_ROUND2_DRAFT : STOMACH_TOPIC_DRAFT;
const allClaims = (node: TopicNode) => [...new Set([...node.claims, ...node.choices.flatMap(c => c.claims)])].map(claimId);
const sourceLabelsFor = (node: TopicNode) => {
  const ids = new Set(STOMACH_TOPIC_CLAIMS.filter(c => allClaims(node).includes(c.id)).flatMap(c => c.sourceIds));
  return STOMACH_TOPIC_SOURCES.filter(s => ids.has(s.id)).map(s => s.title);
};
const buildQuestions = (definitions: TopicCase[]): QuestionVariant[] => definitions.flatMap(item => item.nodes.map(node => ({
  ...draftFor(node), id: stomachQuestionId(node), conceptId: node.conceptId, stem: node.task,
  answerChoices: node.choices.map((c, i) => ({ id: choiceId(node, c), label: c.label, isCorrect: i === 0,
    rationale: c.rationale, distractorRationale: i === 0 ? null : c.rationale })),
  explanation: node.explanation, supportingEvidenceClaimIds: allClaims(node),
})));
const uniqueNodesFor = (definitions: TopicCase[]) => [...new Map(definitions.flatMap(c => c.nodes).map(n => [n.conceptId, n])).values()];
const buildConcepts = (definitions: TopicCase[]): TestedConcept[] => uniqueNodesFor(definitions).map(node => ({
  id: node.conceptId, displayName: node.title, learningObjective: node.objective, conceptType: node.conceptType, earliestFacilityStage: 1,
}));
const buildCases = (definitions: TopicCase[]): SyntheticClinicalCase[] => definitions.map(item => {
  const demographics = { ageYears: item.age, sexLabel: item.sex };
  const labels = [...new Set(item.nodes.flatMap(sourceLabelsFor))];
  const version = item.version ?? 1;
  return {
    id: stomachCaseId(item), displayName: item.complaint, patientDisplayName: item.patientName,
    patientPresentationVariantId: `presentation.topic.${STOMACH_TOPIC_SLUG}.${item.slug}.v${version}`, prototypeDemographics: demographics,
    chiefComplaint: item.complaint, presentation: item.presentation,
    approvedInstantiationProfiles: [{ id: `profile.topic.${STOMACH_TOPIC_SLUG}.${item.slug}.v${version}`,
      prototypeDemographics: demographics, chiefComplaint: item.complaint, presentation: item.presentation }],
    releasePointId: 'release.l0.clinic_evaluation', tutorialEligible: false, routineEligible: true,
    earliestFacilityStage: 1, requiredClinicalSetting: 'clinic', requiredCapabilityIds: [], rewardTierId: 'reward.clinic_basic', sourceLabels: labels,
    decisionNodes: item.nodes.map((node, index) => ({
      id: stomachNodeId(node), questionVariantId: stomachQuestionId(node), primaryConceptId: node.conceptId,
      currentUpdate: node.update, stem: node.task, shuffleAnswers: true,
      answerChoices: node.choices.map((c, i) => ({ id: choiceId(node, c), label: c.label, isCorrect: i === 0, rationale: c.rationale, serviceRequest: null })),
      explanation: node.explanation, teachingPoint: node.explanation, sourceLabels: sourceLabelsFor(node), resultGateAfter: null,
      terminalDispositions: index === item.nodes.length - 1 ? node.choices.slice(1).map(c => ({
        answerChoiceId: choiceId(node, c), kind: 'no_terminal_outcome' as const,
        consequenceNarrative: 'This clinic chart review ends with feedback on the proposed care decision; no hospital treatment is executed.',
        clinicalRationale: c.rationale, sourceLabels: sourceLabelsFor(node),
      })) : [],
    })), learningSummary: item.nodes.map(n => n.explanation).join(' '),
  };
});
export const STOMACH_TOPIC_REVIEWED_V1_QUESTIONS = buildQuestions(STOMACH_TOPIC_REVIEWED_V1_ITEMS);
export const STOMACH_TOPIC_REVIEWED_V1_CASES = buildCases(STOMACH_TOPIC_REVIEWED_V1_ITEMS);
export const STOMACH_TOPIC_REVIEWED_V1_CONCEPTS = buildConcepts(STOMACH_TOPIC_REVIEWED_V1_ITEMS);
export const STOMACH_TOPIC_REVISION_ATTEMPT_QUESTIONS = buildQuestions(STOMACH_TOPIC_REVISION_ATTEMPT_ITEMS);
export const STOMACH_TOPIC_REVISION_ATTEMPT_CASES = buildCases(STOMACH_TOPIC_REVISION_ATTEMPT_ITEMS);
export const STOMACH_TOPIC_PARKED_ATTEMPT_QUESTIONS = buildQuestions(STOMACH_TOPIC_PARKED_ATTEMPT_ITEMS);
export const STOMACH_TOPIC_PARKED_ATTEMPT_CASES = buildCases(STOMACH_TOPIC_PARKED_ATTEMPT_ITEMS);
/** The original full reviewed cases remain exact above. Splitting a passed
 * nonterminal node requires only completion metadata for schema validity;
 * all question, scored-node and patient/profile words remain unchanged.
 */
export const STOMACH_TOPIC_PASS_CASES: SyntheticClinicalCase[] = STOMACH_TOPIC_PASS_SLUGS.map(slug => {
  const questionId = `question.topic.${STOMACH_TOPIC_SLUG}.${slug}.v1`;
  const old = STOMACH_TOPIC_REVIEWED_V1_CASES.find(c => c.decisionNodes.some(n => n.questionVariantId === questionId))!;
  if (old.decisionNodes.length === 1) return clone(old);
  const node = clone(old.decisionNodes.find(n => n.questionVariantId === questionId)!);
  if (!node.terminalDispositions.length) node.terminalDispositions = node.answerChoices.filter(c => !c.isCorrect).map(c => ({
    answerChoiceId: c.id, kind: 'no_terminal_outcome' as const,
    consequenceNarrative: 'This clinic chart review ends with feedback on the proposed care decision; no hospital treatment is executed.',
    clinicalRationale: c.rationale!, sourceLabels: node.sourceLabels,
  }));
  return { ...clone(old), id: old.id.replace(/\.v1$/, '.pass-standalone.v1'), decisionNodes: [node], learningSummary: node.explanation };
});
export const STOMACH_TOPIC_QUESTIONS = buildQuestions(STOMACH_TOPIC_ITEMS);
export const STOMACH_TOPIC_CONCEPTS = buildConcepts(STOMACH_TOPIC_ITEMS);
export const STOMACH_TOPIC_CASES = [...STOMACH_TOPIC_PASS_CASES, ...buildCases(STOMACH_TOPIC_REVISED_ITEMS)];
export const STOMACH_TOPIC_CASE_COMPOSITIONS = STOMACH_TOPIC_PASS_CASES.map(c => {
  const old = STOMACH_TOPIC_REVIEWED_V1_CASES.find(v => v.decisionNodes.some(n => n.questionVariantId === c.decisionNodes[0]!.questionVariantId))!;
  return { originalCaseId: old.id, caseId: c.id, questionVariantId: c.decisionNodes[0]!.questionVariantId,
    disposition: old.id === c.id ? 'exact-standalone-preserved' : 'pass-split-to-standalone',
    changes: old.id === c.id ? [] : ['case identity', 'remove returned companions', 'final completion metadata when needed', 'summary limited to preserved explanation'],
    wordingPreservation: 'Question, complaint, presentation, demographics, profiles, current update, choices, feedback and all scored-node fields except completion metadata are exact.' };
});
const currentCaseFor = (node: TopicNode, item: TopicCase) => STOMACH_TOPIC_CASES.find(c => c.decisionNodes.some(n => n.questionVariantId === stomachQuestionId(node)))?.id ?? stomachCaseId(item);
export const STOMACH_TOPIC_AUTHORING_CONCEPTS = uniqueNodesFor(STOMACH_TOPIC_ITEMS).map(node => ({
  ...draftFor(node), ...STOMACH_TOPIC_CONCEPTS.find(c => c.id === node.conceptId)!, educationalTier: 1,
  conceptRelation: node.relation, previousConceptId: node.previousConceptId ?? null,
  evidenceClaimIds: [...new Set(STOMACH_TOPIC_ITEMS.flatMap(c => c.nodes).filter(n => n.conceptId === node.conceptId).flatMap(allClaims))],
  identityDecision: node.relation === 'reuse' ? 'Existing scored meaning retained; new wording does not reset history.' : 'Distinct scored meaning; preserve predecessor definitions and histories without transfer.',
}));
const buildTimings = (definitions: TopicCase[], bindCurrent = false): AnswerChoiceTimingRegistryEntry[] => definitions.flatMap(item => item.nodes.map(node => ({
  caseId: bindCurrent ? currentCaseFor(node, item) : stomachCaseId(item), nodeId: stomachNodeId(node), questionVariantId: stomachQuestionId(node),
  classification: node.choices.some(c => c.timingProfileId) ? { kind: 'test_choices' as const,
    choices: node.choices.map(c => ({ choiceId: choiceId(node, c), choiceLabel: c.label,
      timing: c.timingProfileId ? { kind: 'test' as const, timingProfileId: c.timingProfileId } : { kind: 'no_test' as const } }))
  } : { kind: 'no_test' as const },
})));
export const STOMACH_TOPIC_REVIEWED_V1_TIMING = buildTimings(STOMACH_TOPIC_REVIEWED_V1_ITEMS);
export const STOMACH_TOPIC_REVISION_ATTEMPT_TIMING = buildTimings(STOMACH_TOPIC_REVISION_ATTEMPT_ITEMS);
export const STOMACH_TOPIC_TIMING = buildTimings(STOMACH_TOPIC_ITEMS, true);
export const STOMACH_TOPIC_ORDER_PROPOSALS = STOMACH_TOPIC_TIMING.flatMap(t => t.classification.kind === 'test_choices'
  ? t.classification.choices.flatMap(c => c.timing.kind === 'test' ? [{ caseId: t.caseId, nodeId: t.nodeId, questionVariantId: t.questionVariantId,
    choiceId: c.choiceId, choiceLabel: c.choiceLabel, timingProfileId: c.timing.timingProfileId,
    disposition: { kind: 'not_executed' as const, reason: 'future_planned' as const },
    scope: 'Presentation-only placeholder profile; chart review does not schedule or perform a clinical investigation/procedure.' }] : []) : []);
export const STOMACH_TOPIC_CASE_REVIEWS = STOMACH_TOPIC_ITEMS.map(item => ({
  ...draftFor(item.nodes[0]!), caseId: currentCaseFor(item.nodes[0]!, item), educationalTier: 1, acuity: 'stable' as const,
  historicalAcuity: item.historicalAcuity, requiredClinicalSetting: 'clinic' as const, requiredFacilityCapabilityIds: [] as string[], earliestFacilityStage: 1,
  settingBasis: 'The named patient is in clinic; acute findings are outside hospital records, not an ED/ICU runtime setting.',
  questionVariantIds: item.nodes.map(stomachQuestionId), evidenceClaimIds: [...new Set(item.nodes.flatMap(allClaims))],
}));
const buildChecks = (definitions: TopicCase[], bindCurrent = false) => definitions.flatMap(item => item.nodes.map(node => ({
  ...draftFor(node), questionVariantId: stomachQuestionId(node), caseId: bindCurrent ? currentCaseFor(node, item) : stomachCaseId(item),
  kind: 'manual_author_self_check', checkedOn: '2026-11-11', independent: false, clinicalApproval: false,
  authorVerdict: node.version === 2 ? (STOMACH_TOPIC_PARKED_SLUGS.includes(node.slug) ? 'Parked after one attempt; no independent PASS' : 'Revised once; pending independent review; no independent PASS') : 'Draft for independent review; no independent PASS',
  rubric: 'question-authoring.2026-11-08.v15', coverTheKey: node.reasoning.cueAttack, oneStageAndCategory: node.reasoning.stage,
  reasoning: { interpret: node.reasoning.interpret, apply: node.reasoning.apply }, predictedResidentDifficulty: node.reasoning.difficulty,
  singleBest: { key: node.choices[0]!.label, closestChoiceId: choiceId(node, node.choices.find(c => c.id === node.reasoning.closest)!),
    decidingObservation: node.reasoning.decider, consequenceOfError: node.reasoning.consequence },
  deletionTest: node.reasoning.deletionTest, decisionChangingCounterfactual: node.reasoning.counterfactual,
  counterfactualChoiceId: choiceId(node, node.choices.find(c => c.id === node.reasoning.counterfactualChoice)!),
  fullSequenceCheck: node.reasoning.sequence, remainingClinicalLimitation: node.reasoning.limitation,
  competitorAudit: node.choices.slice(1).map(c => ({ choiceId: choiceId(node, c), temptation: c.temptation, whyNotHere: c.rationale,
    reasonableWhen: c.reasonableWhen, evidenceClaimIds: c.claims.map(claimId) })),
})));
export const STOMACH_TOPIC_SELF_CHECKS = buildChecks(STOMACH_TOPIC_ITEMS, true);
export const STOMACH_TOPIC_REVISION_ATTEMPT_CHECKS = buildChecks(STOMACH_TOPIC_REVISION_ATTEMPT_ITEMS);
const buildMappings = (definitions: TopicCase[], bindCurrent = false) => definitions.flatMap(item => item.nodes.map(node => ({
  ...draftFor(node), caseId: bindCurrent ? currentCaseFor(node, item) : stomachCaseId(item), questionVariantId: stomachQuestionId(node),
  constructedObservationBasis: 'Original fictional patient observations, medication/response records, actual acquisition/export records and neutral elapsed times; no empirical rate, demographic weight or new cutoff.',
  fields: ['presentation', 'currentUpdate', 'stem', 'explanation', 'authorReasoningAndCounterfactuals'].map(field => ({ field, evidenceClaimIds: allClaims(node) })),
  choiceMappings: node.choices.map(c => ({ choiceId: choiceId(node, c), fields: ['label', 'rationale', 'temptation', 'reasonableWhen'], evidenceClaimIds: c.claims.map(claimId) })),
  numericRuleBasis: node.slug === 'salvage-eradication' && node.version === 2
    ? 'ACG/VA support 14-day optimized BQT components/doses and prepared active testing. Patient collection intervals are constructed observations.'
    : node.slug === 'initial-ppi-course' ? 'ESGE supports the 72-hour high-dose PPI phase; yesterday/today observations are constructed elapsed chronology.'
      : 'Exact clinical rules retain their mapped verified claims; patient values/timestamps are observations, not new clinical decision thresholds.',
})));
export const STOMACH_TOPIC_STATEMENT_MAPPINGS = buildMappings(STOMACH_TOPIC_ITEMS, true);
export const STOMACH_TOPIC_REVISION_ATTEMPT_MAPPINGS = buildMappings(STOMACH_TOPIC_REVISION_ATTEMPT_ITEMS);
export const STOMACH_TOPIC_SOURCE_LINKS = STOMACH_TOPIC_SOURCES.filter(s => s.officialUrl).map(s => ({
  ...STOMACH_TOPIC_DRAFT, sourceId: s.id, label: s.title, href: s.officialUrl!, target: '_blank' as const,
  rel: 'noopener noreferrer', referrerPolicy: 'no-referrer' as const,
}));
const previewFor = (concepts: TestedConcept[], cases: SyntheticClinicalCase[]) => validateSyntheticClinicalRelease({
  id: 'clinical.synthetic.prototype.v1', schemaVersion: 1, publicationStatus: 'synthetic_unapproved_prototype',
  disclaimer: 'Synthetic clinic chart-review drafts, not clinically approved. Melissa Rowland clinical review and manager acceptance are separate from author checks and editorial PASS.', concepts, cases,
});
export const STOMACH_TOPIC_REVIEWED_V1_RELEASE = previewFor(STOMACH_TOPIC_REVIEWED_V1_CONCEPTS, STOMACH_TOPIC_REVIEWED_V1_CASES);
export const STOMACH_TOPIC_SOURCE_RELEASE = previewFor(STOMACH_TOPIC_CONCEPTS, STOMACH_TOPIC_CASES);
export const STOMACH_TOPIC_PASS_RELEASE = previewFor(buildConcepts(STOMACH_TOPIC_PASS_ITEMS), STOMACH_TOPIC_PASS_CASES);
export const STOMACH_TOPIC_MANIFEST = {
  ...STOMACH_TOPIC_ROUND2_DRAFT, id: 'batch.question-topic-stomach-ulcer-bleeding-motility.2026-11-11.v2',
  questionCount: STOMACH_TOPIC_QUESTIONS.length, caseCount: STOMACH_TOPIC_CASES.length,
  passPreservedCount: 9, revisedCount: 8, parkedCount: 5, revisionAttempts: 13,
  publicReleaseAuthorized: false, pipelinePassed: false, clinicalApproval: false,
  selectionLimitation: 'All current scored cases are standalone. No returned or parked companion can block a PASS node; original full reviewed cases remain audit-only. Recombination requires all exact component versions to pass independent review.',
  integrationDependencies: ['Manager reviews eight new v2 candidates and the five park dispositions; no author self-check confers independent PASS.',
    'Three passed nodes are isolated with exact clinical wording; case identity, completion metadata and limited summaries are recorded composition changes. Full original cases/questions remain exact in reviewed-v1 exports.',
    'Install only exact accepted case/question/concept/source/timing/order tuples. Retain prior IDs and frozen histories; revised choices have v2-specific identities.',
    'No clinical service, runtime network/AI call, new hospital setting, shared registry edit, FSRS migration, commit or publication is introduced.'],
};
