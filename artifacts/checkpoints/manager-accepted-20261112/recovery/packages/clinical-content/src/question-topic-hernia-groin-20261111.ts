import type { ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
import type { AnswerChoiceTimingClassification, AnswerChoiceTimingRegistryEntry, CaseExhibit, SyntheticClinicalCase, TestedConcept } from "./schema";
import sourceLedger from "../../../docs/research/sources-question-topic-hernia-groin-20261111.json";

/** Explicit-import, unapproved authoring sidecar. No manifest or shared registry admission. */
export const HERNIA_GROIN_TOPIC_DRAFT = {
  contentVersion: "clinical.question-topic-hernia-groin.2026-11-11.v1",
  reviewStatus: "needs_clinician_review", aiAssistedDrafting: true, lastClinicianReview: null,
} as const;
export const HERNIA_GROIN_TOPIC_SOURCES = sourceLedger.sources as ClinicalSource[];
export const HERNIA_GROIN_TOPIC_CLAIMS = sourceLedger.claims as EvidenceClaim[];
const claim = (...slugs: string[]) => slugs.map(slug => `claim.hernia-groin.${slug}`);
const none: AnswerChoiceTimingClassification = { kind: "no_test" };
const timing = (profile: string): AnswerChoiceTimingClassification => ({ kind: "test", timingProfileId: `timing.test.${profile}` });

export interface TopicChoice {
  id: string; label: string; isCorrect: boolean; rationale: string;
  temptation: string; counterfactual: string; timing: AnswerChoiceTimingClassification;
}
export interface AuthorGate {
  interpret: string; apply: string; cueAttack: string; stageCategory: string;
  difficulty: string; decidingObservation: string; counterfactual: string;
  deletionTest: string; sequenceCheck: string;
}
export interface TopicNode {
  slug: string; kind: "rewrite" | "new"; beforeRecordIds: string[]; version?: number;
  conceptId: string; previousConceptId: string | null; identityReason: string;
  objective: string; currentUpdate: string; stem: string; exhibit?: CaseExhibit;
  choices: TopicChoice[]; explanation: string; claimIds: string[]; gate: AuthorGate;
}
export interface TopicCase {
  slug: string; name: string; age: number; sex: "Male" | "Female";
  complaint: string; presentation: string; acuity: "stable" | "urgent_stable";
  educationalTier: 1; earliestFacilityStage: 1; setting: "clinic";
  frame: "current_clinic" | "outside_records_in_clinic"; nodes: TopicNode[];
}
const c = (id: string, label: string, isCorrect: boolean, rationale: string, temptation: string, counterfactual: string, wait: AnswerChoiceTimingClassification = none): TopicChoice => ({ id, label, isCorrect, rationale, temptation, counterfactual, timing: wait });
const g = (interpret: string, apply: string, cueAttack: string, stageCategory: string, difficulty: string, decidingObservation: string, counterfactual: string, deletionTest: string, sequenceCheck: string): AuthorGate => ({ interpret, apply, cueAttack, stageCategory, difficulty, decidingObservation, counterfactual, deletionTest, sequenceCheck });
const kv = (items: Array<[string, string]>): CaseExhibit => ({ kind: "keyValue", caption: "Original constructed teaching record; fictional observations", items: items.map(([label, value]) => ({ label, value })) });

export const HERNIA_GROIN_TOPIC_V1_NODES: TopicNode[] = [
  {
    slug: "marked-femoral-repair", kind: "rewrite", beforeRecordIds: ["inventory.5bace988607cd35b"],
    conceptId: "concept.femoral-hernia.timely-elective-repair", previousConceptId: null,
    identityReason: "Same stable femoral repair-versus-observation meaning; new anatomical evidence and credible competing attribution.",
    objective: "Identify which of two groin findings accounts for the marked swelling before choosing repair or surveillance.",
    currentUpdate: "Elena marks the lump she notices while standing. It empties when she lies down and is nontender. She is eating normally without vomiting.",
    exhibit: kv([["At Elena's marker", "A sac containing bowel passes below the inguinal ligament, immediately medial to the common femoral vein."], ["Separate cranial finding", "Fat protrudes above the ligament, medial to the inferior epigastric vessels; pressing here does not reproduce the marked lump."]]),
    stem: "Which plan should be recommended for Elena's marked groin swelling?",
    choices: [
      c("surveillance", "Schedule groin surveillance", false, "Painless reduction does not place a femoral hernia in the selected-male inguinal observation population.", "Overgeneralize observation from painless inguinal hernias.", "A minimally symptomatic reducible inguinal hernia in a man would permit informed observation."),
      c("repair", "Arrange elective groin repair", true, "The marked sac follows the femoral compartment. Its stable reducing course supports elective repair assessment rather than emergency exploration.", "Integrate the marked target, anatomical neck and present acuity.", "New fixed tenderness or suspected ischemia would change the urgency."),
      c("emergency", "Arrange emergency groin exploration", false, "Femoral anatomy supports repair but does not by itself establish an acute ischemic emergency in this reducing, nontender presentation.", "Translate higher complication concern into emergency treatment for every femoral defect.", "An acutely irreducible tender sac with compromised bowel enhancement would support emergency exploration."),
    ],
    explanation: "The marked swelling follows the femoral route; the separate cranial direct defect does not explain that target. A femoral hernia warrants timely elective repair assessment despite little discomfort. Current reduction and absence of acute illness determine the elective rather than emergency pathway.",
    claimIds: claim("femoral-route", "inguinal-routes", "femoral-repair", "selected-observation", "strangulation-action"),
    gate: g("Localize the neck of the marked sac rather than anchoring on a second visible defect.", "Apply the femoral repair boundary and current acuity to select an elective plan.", "Removed the named femoral diagnosis from the complaint and vignette. All choices are groin-care plans; the key is not a longer combined plan. Necessary reducing/nontender observations distinguish urgency.", "Current groin management, three concrete policies.", "Predicted moderate: the painless reducing course and incidental cranial defect tempt surveillance or wrong-target attribution.", "The sac at the marker is below the ligament and medial to the vein, and currently reduces.", "Move the marked sac above the ligament into the inguinal compartment in a minimally symptomatic man: surveillance becomes reasonable. Add irreducibility and ischemia concern: emergency exploration.", "The separate defect earns its place by competing for attribution; removing compartment or reduction observations makes the repair/urgency choice underdetermined.", "Standalone; neither a prior type label nor a companion explanation supplies the classification."),
  },
  {
    slug: "selected-observation", kind: "rewrite", beforeRecordIds: ["inventory.24ba0349bbe27236"],
    conceptId: "concept.inguinal-hernia.selected-watchful-waiting", previousConceptId: null,
    identityReason: "Preserves the selected-male observation boundary; a task-specific activity record replaces the supplied minimally symptomatic interpretation.",
    objective: "Use current function and symptom concordance to decide whether immediate elective inguinal repair is necessary.",
    currentUpdate: "Daniel's scan shows a right inguinal sac that enters during strain and reduces at rest. He completes his usual warehouse lifts while the contour is visible, without groin pressure. The pain that stops running is medial to the pubis and is reproduced by resisted adduction. He prefers to defer an operation if reasonable.",
    stem: "Which inguinal-hernia plan should be offered to Daniel at this review?",
    choices: [
      c("repeat-scan", "Repeat dynamic groin ultrasound before planning", false, "The diagnosis and reduction are already established; there is no unresolved acquisition or anatomy question here.", "Seek another image because there is pain somewhere in the groin.", "A reported lump outside the acquired field would support a targeted repeat study.", timing("ultrasound")),
      c("repair", "Arrange elective inguinal repair now", false, "Repair can be discussed, but attributing the current running limitation to this painless protrusion is unsupported. The requested plan incorporates Daniel's preference to defer.", "Treat any positive image in a patient with pain as a symptomatic surgical target.", "Lifting interrupted by pressure at the protrusion that resolves on reduction would favor repair planning."),
      c("observe", "Continue hernia observation with return precautions", true, "A man completing usual activity without protrusion-related limitation can choose informed observation. The separate attachment pain does not automatically negate that option.", "Distinguish the activity-limiting symptom from a coexisting reducible hernia.", "A new painful nonreducing lump would require urgent assessment rather than continued observation."),
    ],
    explanation: "Daniel's limiting pain is dissociated from the protrusion during the activity actually attempted. Informed observation is a reasonable hernia policy under his stated preference, with return precautions and reassessment if the hernia changes. This does not dismiss the separate painful condition or guarantee that symptoms will remain mild.",
    claimIds: claim("selected-observation", "symptom-concordance", "symptomatic-repair", "ultrasound-first"),
    gate: g("Compare the pain that stops running with painless completion of the original lifting task.", "Apply the selected-male inguinal observation boundary and preference after that attribution.", "All choices are hernia policies; no option says individualized. The task names the inguinal plan so it does not ask the learner to rank an unsupported hip regimen. A patient preference is necessary because repair remains a reasonable elective choice.", "Current hernia policy after diagnostic confirmation.", "Predicted moderate: a positive scan plus pain tempts immediate repair, while repeating imaging feels cautious.", "Usual lifting is completed with the contour present, while a separate maneuver reproduces the limiting medial pain.", "Replace painless lifting with load interruption during protrusion and relief on reduction: elective repair becomes the best offered policy.", "Without actual usual-load performance, symptom location or preference, observation versus elective repair becomes less determinate.", "First node of a later-change pair. Feedback gives no later examination, interval response or specific future referral trigger."),
  },
  {
    slug: "interval-symptom-shift", kind: "rewrite", beforeRecordIds: ["inventory.4411c25cffd5e665"],
    conceptId: "concept.inguinal-hernia.symptomatic-elective-repair.v3", previousConceptId: null,
    identityReason: "Preserves interval function and symptom attribution, without transferring it to the older broader symptomatic-repair identities.",
    objective: "Reassess a prior observation plan when the functional limitation changes despite improvement of a competing pain source.",
    currentUpdate: "At a later clinic visit, Daniel completes resisted adduction and his running program without the earlier medial pain. During a trial of his usual warehouse lift, focal inguinal pressure makes him put the load down as the lump appears. The pressure resolves when the lump reduces. He wants to resume this task. Rehabilitation continues in every offered plan.",
    stem: "Which hernia-care policy should now be offered for Daniel's warehouse lifting limitation?",
    choices: [
      c("repair", "Arrange elective inguinal repair assessment", true, "The remaining original-task restriction now tracks protrusion and reduction despite recovery of the earlier attachment symptom.", "Update attribution rather than preserving the old observation plan by inertia.", "If usual lifts were painless and completed with the contour present, observation would remain reasonable."),
      c("observe", "Continue scheduled inguinal hernia surveillance", false, "Completed exercise does not establish recovery of the original load-bearing task, which is now interrupted by a concordant hernia episode.", "Use improving running as evidence that all groin function has recovered.", "Painless completion of usual work with the reducing contour could support observation."),
      c("image", "Repeat dynamic groin ultrasound before referral", false, "A demonstrated hernia and currently reproduced reduction-responsive restriction support consultation without requiring another identical confirmation.", "Require anatomical growth before considering a symptomatic hernia for repair.", "A new lump in a different compartment or an unestablished diagnosis would justify targeted imaging.", timing("ultrasound")),
    ],
    explanation: "The new functional record changes the earlier symptom attribution. The original load now produces a focal, reduction-responsive episode while the earlier attachment pain has improved. Elective hernia assessment is supported without promising that surgery treats every future groin symptom.",
    claimIds: claim("symptom-concordance", "symptomatic-repair", "selected-observation", "ultrasound-first"),
    gate: g("Separate actual recovery of running from failure of the usual warehouse lift.", "Change the hernia policy for concordant current limitation, rather than demanding scan progression.", "Deleted generic treatment-priority labels and kept rehabilitation common. Three concrete hernia policies have similar scope. The observation is raw performance, not an author declaration of symptomatic hernia.", "Hernia management after interval functional reassessment.", "Predicted moderate: prior successful observation and improved exercise compete with the new original-load failure.", "Pressure arises with the protrusion during the attempted usual lift and resolves on reduction.", "Change the attempted lift to painless completion despite the contour: observation becomes reasonable.", "Removing the interval update restores the prior observation answer; this later node earns an independent changed inference.", "Earlier feedback explains the earlier observation but cannot supply the new load test, new preference or recovery of attachment pain. No future repair technique is taught here."),
  },
  {
    slug: "partial-block-response", kind: "rewrite", beforeRecordIds: ["inventory.b3a83a4941e1b5f7"],
    conceptId: "concept.postherniorrhaphy-pain.block-evidence-limits.v1", previousConceptId: "concept.postherniorrhaphy-pain.targeted-block-specialist-evaluation",
    identityReason: "New meaning: interpret component-specific block evidence, rather than select a block because a target exists. Preserve old FSRS history.",
    objective: "Interpret selective relief of one pain component without converting it into proof that all postoperative pain has one cause.",
    currentUpdate: "Before injection, Mara recorded superficial burning with clothing contact and a separate deep ache on stairs. After an ultrasound-guided ilioinguinal/iliohypogastric block, pinprick is reduced over the intended skin region and clothing no longer provokes burning. Stair climbing still produces the same deep ache. Both symptoms return to their previous pattern as the block wears off.",
    stem: "Which interpretation of Mara's diagnostic block is best supported?",
    choices: [
      c("all", "Both pain components are localized to the injected nerves", false, "The stair-related ache persisted despite the observed skin sensory change. Response of one component does not localize every symptom.", "Count any relief as confirmation of a single nerve explanation.", "A reproducible response of both components would support a broader contribution, while still not guaranteeing surgery success."),
      c("component", "The superficial component has an injection-responsive contribution", true, "The temporally matched cutaneous sensory and clothing response supports that component, while the unchanged deep ache remains unresolved. It does not uniquely prove a particular injured nerve.", "Use component-specific response instead of an all-or-none label.", "If neither intended sensory change nor superficial relief occurred, a localized response could not be inferred."),
      c("none", "Neither pain component is informed by the injection", false, "Dismissing the observed superficial response loses valid local information because another symptom persists.", "Treat an incomplete overall response as a wholly useless test.", "No target sensory effect or symptom change would make this block nondiagnostic for localization."),
    ],
    explanation: "The block informs the superficial component and leaves the stair-related deep ache unresolved. Block responses have limited specificity and can reflect overlapping targets or nonspecific effects. This result neither establishes a single cause for both symptoms nor selects a particular operation.",
    claimIds: claim("block-information", "cpip-phenotype"),
    gate: g("Compare the observed sensory effect and clothing response with the unchanged stair symptom.", "Limit localization to the responsive component without dismissing useful local evidence.", "Replaced supportive information versus absurd infection/recurrence claims with three equally scoped interpretations. The key avoids the uniquely cautious umbrella plan. No surgical selection is embedded in the stem.", "Interpretation of an acquired diagnostic response; three component-scope conclusions.", "Predicted moderate: both overgeneralizing a partial response and discarding it are credible errors.", "Superficial symptom relief accompanies the intended skin sensory effect, while the deep symptom is unchanged.", "Remove target sensory change and symptom relief: a localized injection-responsive contribution is no longer established.", "Both before/after component observations are necessary; deleting the deep symptom removes the main localization boundary.", "First node of the chronic-pain pair. Feedback does not supply a minimum treatment interval or the later treatment response."),
  },
  {
    slug: "negative-study-mri", kind: "rewrite", beforeRecordIds: ["inventory.5ac9cface9d3f6d9"],
    conceptId: "concept.inguinal-hernia.equivocal-exam-ultrasound.v2", previousConceptId: null,
    identityReason: "Same adequacy-dependent escalation meaning, narrowed to avoid ranking MRI over an unresolved symptomatic hip or block.",
    objective: "Choose the next investigation after an adequately targeted negative dynamic study when episodic groin anatomy remains unresolved.",
    currentUpdate: "Priya's patient-marked swelling was scanned by an experienced examiner supine and standing during cough and Valsalva; the contour and familiar pressure occurred during recording, without a demonstrable sac. The complete acquisition and cine loops have been reviewed. Examination reproduces no separate hip or adductor pain. The episodes continue to stop her lifting.",
    stem: "Which investigation should next assess Priya's unresolved episodic groin swelling?",
    choices: [
      c("repeat", "Repeat the same dynamic groin ultrasound", false, "The symptomatic target, provocation and complete acquisition have already been adequately assessed. A different acquisition would be reasonable if those conditions were missing.", "Repeat a familiar first-line study without identifying a new target or acquisition defect.", "If the previous worksheet documented an adductor-only examination, targeted dynamic groin ultrasound would become the best option.", timing("ultrasound")),
      c("mri", "Obtain pelvic MRI with groin strain acquisitions", true, "Persistent diagnostic uncertainty after an adequate examination and ultrasound supports dynamic cross-sectional assessment. No claim is made that it will resolve every pain source.", "Escalate because of genuine residual uncertainty after an adequate first investigation.", "An unexamined symptomatic site would favor a properly targeted ultrasound first.", timing("mri")),
      c("arthrogram", "Obtain hip MRI with intra-articular contrast", false, "The represented unresolved event is an intermittent groin contour, not a clinically reproduced hip-joint problem requiring this acquisition.", "Treat every deep groin symptom as an intra-articular hip disorder.", "Usual pain reproduced by hip rotation with mechanical joint symptoms and no contour question would support a hip-directed pathway.", timing("mri")),
    ],
    explanation: "The actual target and provocation were acquired, so this is not a missing-view or wrong-site negative. Persistent anatomical uncertainty can justify dynamic MRI. The narrowed case provides no competing reproduced hip symptom and does not resolve the held mixed-pain MRI-versus-hip-versus-block question.",
    claimIds: claim("ultrasound-first", "dynamic-imaging", "symptom-concordance"),
    gate: g("Use acquisition records, symptom reproduction and complete loops to judge what the negative study evaluated.", "Select cross-sectional dynamic assessment for the remaining anatomical question.", "Removed available-MRI permission and the supplied inadequate/adequate label. All choices are named imaging protocols with wait metadata. Preserved actual acquisition rather than treating missing exports as unperformed maneuvers.", "Next imaging after a reviewed negative symptomatic acquisition.", "Predicted moderate: protocol adequacy makes repeating ultrasound versus advancing to MRI consequential. One-guideline source limitation remains.", "The correct marked target and clinical event were recorded during a complete dynamic examination, yet no sac was shown.", "Change the recorded acquisition to a different tender attachment at rest: repeat targeted groin ultrasound becomes preferred.", "Deleting the acquisition record removes the reason not to repeat ultrasound. Hip observations earn their role because a hip protocol is offered, but no hip symptom is suppressed from an actual patient.", "Standalone, independent of the frozen proximal-neck workup. Does not alter any approved/PASS companion."),
  },
  {
    slug: "partial-wall-urgency", kind: "rewrite", beforeRecordIds: ["inventory.c8deb51f3baa8dd9"],
    conceptId: "concept.groin-hernia.femoral-defect-repair-priority.v2", previousConceptId: null,
    identityReason: "Same compartment-plus-wall-viability intervention meaning; change the original ultrasound observations to supported CT observations and use a hospital chart-review frame.",
    objective: "Apply partial-wall anatomy and impaired enhancement to select operative evaluation despite continued stool passage.",
    currentUpdate: "The referring hospital reports a newly fixed tender right groin lump. Andre still passes stool and has not vomited. Contrast CT shows part of the bowel circumference entering a small opening below the inguinal ligament, medial to the common femoral vein. The remaining lumen stays in the abdomen. The trapped wall enhances substantially less than adjacent bowel. Initial IV support and surgical consultation are underway.",
    stem: "Which hernia-directed intervention should be recommended for Andre's current hospital episode?",
    choices: [
      c("reduce", "Attempt manual reduction with analgesia", false, "Continued passage does not exclude wall compromise when only part of the circumference is trapped. Tender fixation and reduced enhancement raise ischemia concern.", "Use absence of complete obstruction to declare reduction safe.", "An acutely irreducible sac with no ischemic concern may be considered for gentle reduction by the hospital team."),
      c("elective", "Plan elective repair after discharge", false, "The current episode contains fixed tenderness and compromised enhancement, not an uncomplicated reducing femoral hernia.", "Apply the elective femoral pathway despite changed acuity.", "A nontender sac that empties at rest without ischemic findings would support elective planning."),
      c("explore", "Proceed to emergency operative exploration", true, "The anatomy is femoral and the partial-wall pattern permits continued lumen passage despite threatened tissue. Suspected strangulation supports emergency surgery.", "Prioritize tissue viability over stool passage as reassurance.", "If the sac reduced and the wall had normal enhancement with resolving symptoms, this immediate exploration comparison would change."),
    ],
    explanation: "Only part of the circumference is trapped, so stool passage is compatible with threatened wall. The femoral compartment, fixed tenderness and reduced enhancement support suspected strangulation and emergency operative evaluation rather than taxis. This does not claim that CT alone proves irreversible necrosis or choose a repair material.",
    claimIds: claim("femoral-route", "partial-wall", "perfusion-observation", "strangulation-action", "reduction-selection", "femoral-repair"),
    gate: g("Recognize that preserved lumen passage and partial-wall entrapment can coexist.", "Interpret reduced wall enhancement and tender fixation as a contraindication to attempted reduction in this offered comparison.", "Neutral intervention task, three specific hernia plans; shared IV support stays common. No named Richter/strangulation diagnosis is provided. The continuing stool detail creates the closest error, not decorative reassurance.", "Hernia intervention in an outside-hospital episode reviewed from clinic.", "Predicted moderate to hard: false reassurance from intestinal passage competes with the wall-specific perfusion and acute examination.", "The trapped wall enhances less than adjacent bowel despite the residual abdominal lumen.", "Replace compromised enhancement and acute fixed tenderness with an uncomplicated reducible sac: planned elective repair becomes appropriate.", "Removing partial-wall geometry makes stool passage less interpretable; removing enhancement and tender fixation removes the main reduction-versus-exploration boundary.", "First node of a hospital-record sequence. Feedback does not name later contamination, mesh material or wound class."),
  },
  {
    slug: "medial-defect-plan", kind: "rewrite", beforeRecordIds: ["inventory.62ce7e151079b021"],
    conceptId: "concept.n1r3.symptomatic-medial-groin-plan", previousConceptId: null,
    identityReason: "Retains the existing applied medial-defect care objective; does not overwrite the three clinician-approved direct-anatomy definitions.",
    objective: "Use a moving medial wall defect rather than static cord fat to choose the relevant repair plan.",
    currentUpdate: "Owen stops his usual delivery lifts because of focal pressure at a right groin bulge. On standing strain, a broad sac displaces the canal wall medial to the inferior epigastric vessels and withdraws when supine. Fat alongside the cord remains unchanged throughout the same maneuvers. He has no vomiting or fixed tenderness.",
    stem: "Which groin plan should be offered for Owen's lifting limitation?",
    choices: [
      c("cord", "Plan isolated cord-fat excision", false, "The static cord finding does not explain the moving medial wall protrusion or its symptom concordance.", "Anchor on the earlier cord-fat label instead of the dynamic defect.", "An isolated symptomatic cord mass without a moving wall defect would require a different targeted assessment."),
      c("wall", "Plan inguinal posterior-wall reinforcement", true, "The dynamic medial wall defect with concordant limitation supports elective repair directed to that defect.", "Correlate dynamic anatomy with the symptom-producing target.", "A painless protrusion during completed usual activity could support informed observation in a selected man."),
      c("observe", "Plan scheduled groin observation", false, "Reducibility removes an acute emergency indication but does not negate the observed activity-limiting hernia episode.", "Confuse a reducing course with lack of a repair indication.", "Minimal hernia symptoms and painless usual activity could make observation reasonable."),
    ],
    explanation: "The moving medial canal-wall defect is the relevant direct inguinal target; static cord fat does not account for the observed bulge. Its concordant interruption of usual work supports elective reinforcement. The question does not establish a uniquely superior mesh technique or reopen the exact approved basic anatomy questions.",
    claimIds: claim("inguinal-routes", "symptomatic-repair", "selected-observation", "symptom-concordance"),
    gate: g("Separate a dynamic medial wall defect from a static nearby cord finding.", "Connect the symptom-producing moving defect to elective wall repair rather than mass excision or observation.", "Replaced a broad generic plan with three named operative/observation policies. Static cord fat is retained as a credible anchoring competitor; the task does not name direct anatomy or its deficient layer.", "Current groin-care plan after diagnostic confirmation.", "Predicted moderate: wrong-target anchoring competes with dismissing a reducible defect.", "The medial wall moves with the symptomatic event while the cord finding stays unchanged.", "If no wall defect appeared and a focal mass tracked the symptoms, the current reinforcement key would lose support; if usual work were painless, observation could be chosen.", "Removing either the dynamic/static comparison or the actual work interruption removes an inference needed for the present action.", "Standalone; the approved direct-anatomy items remain exact historical records and are not used to scaffold this draft."),
  },
  {
    slug: "new-component-ultrasound", kind: "rewrite", beforeRecordIds: ["inventory.c2dccc930db20b45"],
    conceptId: "concept.n3.postrepair-pain-new-dynamic-finding", previousConceptId: null,
    identityReason: "Same reassessment of new protrusion-associated symptoms; no promotion of the held adequate-negative MRI variant.",
    objective: "Recognize that an attachment-only acquisition does not assess a new intermittent postoperative contour.",
    currentUpdate: "Victor's earlier superficial burning briefly improved after a specialist nerve block. A different pressure now occurs with a transient contour during lifting. The outside ultrasound worksheet documents the adductor origin supine during resisted adduction and reproduces medial-thigh discomfort. It contains no acquisition of the patient-marked repair site. His lifting video places the contour higher in the groin.",
    stem: "Which investigation should next assess Victor's new lifting-related contour?",
    choices: [
      c("mri", "Pelvic MRI with groin strain views", false, "MRI can follow unresolved anatomical assessment, but the current negative record never assessed the new target dynamically.", "Treat any prior ultrasound as an adequate negative groin study.", "An adequate negative study at the symptomatic repair target during the event could justify dynamic cross-sectional assessment.", timing("mri")),
      c("us", "Groin ultrasound at the marked site during standing strain", true, "The actual acquisition examined another structure and symptom. Targeted dynamic assessment addresses the newly reported event before assigning it to the old pain mechanism.", "Use site and acquisition provenance rather than the generic ultrasound label.", "If complete targeted dynamic views had already captured this event without a sac, further cross-sectional assessment could become reasonable.", timing("ultrasound")),
      c("block", "Ilioinguinal block with cutaneous sensory mapping", false, "A block may inform the earlier burning component, but it cannot establish whether the new dynamic contour reflects recurrent anatomy.", "Let the old positive block explain a newly distinct mechanical symptom.", "Persistent mapped cutaneous pain without a new contour question could support targeted specialist block evaluation.", timing("clinical_procedure")),
    ],
    explanation: "The prior scan assessed an adductor symptom at another target. It is not an adequate negative examination of the new intermittent postoperative contour. Dynamic assessment of the marked repair site is supported before attributing the entire current syndrome to the older injection-responsive burning.",
    claimIds: claim("ultrasound-first", "cpip-phenotype", "block-information", "dynamic-imaging"),
    gate: g("Compare the worksheet's target, maneuver and reproduced symptom with the patient's new event.", "Select a properly targeted dynamic study rather than reusing the old pain mechanism or skipping an unperformed groin assessment.", "Removed a planned repeat nerve procedure that advertised an omitted action. The acquisition record establishes what was actually performed, not merely what was exported. All three tests have mapped waits.", "Next diagnostic investigation of a new postoperative anatomical question.", "Predicted moderate: prior positive block and an outside negative ultrasound are credible anchors.", "The record acquired an adductor examination, not the higher marked repair-site event.", "Replace the acquisition with complete symptomatic groin views during standing strain: dynamic MRI becomes a reasonable next anatomical study.", "Deleting acquisition provenance makes repeated ultrasound versus MRI unfair; deleting new symptom distinction makes the block competitive for a different task.", "First node of a recurrence pair. Feedback does not discuss opposite-plane repair or reveal the later scan result."),
  },
  {
    slug: "anterior-recurrence-plane", kind: "rewrite", beforeRecordIds: ["inventory.4e058373d13510e4"],
    conceptId: "concept.inguinal-hernia.recurrence-after-anterior-repair.v1", previousConceptId: null,
    identityReason: "Same prior-anterior-mesh to posterior-repair decision; moved from an unsupported intraoperative conversion to clinic planning. Frozen B2A05 remains exact.",
    objective: "Infer the prior mesh plane from the operative record before selecting an offered recurrence repair.",
    currentUpdate: "Nolan's dynamic study shows a reducing medial recurrence that interrupts usual lifting. The old operation report describes flat mesh laid on the inguinal floor, with the cord superficial to it and the external oblique closed over both. He has not had pelvic surgery or a preperitoneal repair. The consulting surgeon performs the offered techniques regularly.",
    stem: "Which repair should be planned for Nolan's symptomatic recurrent groin hernia?",
    choices: [
      c("lichtenstein", "Open anterior Lichtenstein mesh repair", false, "This reenters the previously operated anterior mesh plane. For the represented recurrence, the opposite posterior plane is recommended.", "Choose a familiar open repair without interpreting the old mesh position.", "Recurrence after a prior posterior TEP/TAPP repair would favor an anterior approach."),
      c("tep", "Totally extraperitoneal mesh repair", true, "The old record describes anterior mesh placement. The offered TEP accesses the posterior compartment for recurrence after anterior mesh repair.", "Translate mesh location into the previously used compartment and select the opposite plane.", "A prior posterior repair would change the preferred offered approach to anterior repair."),
      c("shouldice", "Open anterior Shouldice tissue repair", false, "Avoiding new mesh does not avoid the old anterior dissection or establish a tissue-repair preference for this recurrence.", "Mistake the material choice for a change in surgical plane.", "A selected primary inguinal hernia with an informed non-mesh preference could be considered for expert Shouldice repair."),
    ],
    explanation: "Mesh on the inguinal floor beneath the cord and external oblique identifies the prior anterior repair. An offered posterior repair is recommended for this recurrence. This ranks TEP against two anterior options, not against TAPP or every other posterior operation.",
    claimIds: claim("recurrence-anterior", "recurrence-posterior", "mesh-tissue", "symptomatic-repair"),
    gate: g("Identify the operated compartment from tissue relationships rather than the incision name.", "Choose the offered posterior repair for a recurrence after anterior mesh repair.", "Removed the intraoperative pause and implied immediate conversion. All options are named repairs. The surgeon's competence applies to every offered approach and is needed for a fair technique comparison.", "Elective repair selection in clinic, before an operation has begun.", "Predicted moderate: tissue material versus plane and old mesh location create credible competing errors.", "Old mesh lies on the floor with cord and external oblique superficial to it.", "Move old mesh to the space behind transversalis fascia after TEP/TAPP: Lichtenstein becomes the offered preferred approach.", "Without prior mesh relationships the recurrence plane cannot be inferred; prior pelvic history constrains use of TEP.", "Standalone; no earlier repair-referral explanation names the plane. Does not alter the passed B2A05 question or presentation."),
  },
];

HERNIA_GROIN_TOPIC_V1_NODES.push(
  {
    slug: "posterior-recurrence-plane", kind: "new", beforeRecordIds: [],
    conceptId: "concept.hernia-groin.recurrence-after-posterior-repair.v1", previousConceptId: null,
    identityReason: "New complementary recurrence-plane construct; the existing anterior-to-posterior identity is not repurposed.",
    objective: "Infer a prior posterior repair from an open operative record and choose an anterior approach for recurrence.",
    currentUpdate: "At a later clinic review, Victor's targeted study demonstrates a reducing recurrent inguinal sac at the site of the lifting episode. The retrieved operation report describes an incision in the groin, division through the transversalis fascia, and a flat mesh unfolded between that fascia and the peritoneum to cover the myopectineal orifice. There was no earlier mesh on the inguinal floor. The offered operations are within the consulting team's experience.",
    stem: "Which repair should be offered for Victor's confirmed symptomatic recurrence?",
    choices: [
      c("tapp", "Transabdominal preperitoneal mesh repair", false, "TAPP reenters the previously dissected posterior compartment despite the old operation having used an open skin incision.", "Treat open skin access as proof that the previous mesh was anterior.", "A recurrence after a prior anterior Lichtenstein repair would favor a posterior approach."),
      c("lichtenstein", "Open anterior Lichtenstein mesh repair", true, "The tissue relationships identify a prior posterior preperitoneal mesh. An anterior repair uses the other plane.", "Distinguish surgical access from implanted mesh compartment.", "If old mesh lay on the floor beneath the cord and external oblique, an offered posterior repair would be preferred."),
      c("tep", "Totally extraperitoneal mesh repair", false, "TEP also revisits the operated posterior space; changing transabdominal to extraperitoneal access does not change the mesh compartment.", "Treat TEP and TAPP as opposite tissue planes.", "An anterior-only prior repair would make TEP a reasonable posterior option."),
    ],
    explanation: "An open incision does not identify the mesh plane. The report places mesh behind transversalis fascia and before peritoneum, so the posterior compartment has already been used. The offered anterior Lichtenstein repair follows the opposite-plane recurrence principle.",
    claimIds: claim("recurrence-posterior", "recurrence-anterior", "symptomatic-repair"),
    gate: g("Read tissue relationships to identify posterior mesh despite an open incision.", "Choose anterior recurrence repair, distinguishing plane from TEP/TAPP access.", "Three named mesh repairs, comparable scope and wording. No supplied anterior/posterior label. Both posterior distractors are credible because the incision and access names can mislead.", "Elective recurrence operation selection after confirmation.", "Predicted moderate to hard: misclassifying an open preperitoneal repair is a practical resident error.", "The old mesh lies between transversalis fascia and peritoneum rather than on the inguinal floor.", "Place the old mesh under external oblique and superficial to fascia: either offered posterior method becomes reasonable, so the present Lichtenstein key no longer wins.", "Deleting the old operative anatomy makes the procedure comparison unfair. The new positive scan earns the transition from investigation to repair planning.", "Previous feedback concerns scan target and pain attribution, with no recurrence-plane rule. This new record and result add a distinct surgical decision."),
  },
  {
    slug: "both-planes-expertise", kind: "new", beforeRecordIds: [],
    conceptId: "concept.hernia-groin.recurrence-both-planes-expert.v1", previousConceptId: null,
    identityReason: "New complex recurrent-repair referral boundary, distinct from either simple opposite-plane rule.",
    objective: "Recognize that two prior operations have used both planes before choosing where to plan another repair.",
    currentUpdate: "Sofia's recurrent groin protrusion again interrupts work but reduces when she lies down. One old report records mesh on the inguinal floor under the external oblique. A later report records removal of part of that mesh and placement of a second prosthesis behind the transversalis fascia. Both reports describe dense scar around the round-ligament region. There is no fixed tenderness, vomiting or abdominal distension.",
    stem: "Which plan should be offered for Sofia's next recurrent groin repair?",
    choices: [
      c("local-posterior", "Schedule routine TEP repair in the ambulatory service", false, "The posterior compartment has already been entered and implanted; it cannot be presumed to be an unused rescue plane.", "Apply anterior-to-posterior repair as if only the first report mattered.", "An anterior-only prior repair with an untouched posterior space could support an experienced team's TEP repair."),
      c("expert", "Refer for repair planning by a complex-hernia surgeon", true, "Both compartments have been operated on. Expert recurrent-hernia assessment is recommended rather than selecting a universally preferred repeat route.", "Integrate both archived operations before applying a repair rule.", "One clearly anterior prior mesh repair with an unused posterior plane would make routine posterior planning reasonable."),
      c("local-anterior", "Schedule routine Lichtenstein repair in the ambulatory service", false, "The anterior compartment is also scarred and implanted. The simple posterior-to-anterior rule does not resolve a recurrence after both approaches.", "Treat only the most recent posterior repair as relevant.", "A posterior-only failed repair could support experienced anterior repair."),
    ],
    explanation: "The two reports document use of both compartments. This is beyond a simple opposite-plane recurrence. A complex-hernia surgeon should plan the next repair; the evidence does not support one mandatory repeat operation for every such patient.",
    claimIds: claim("recurrence-both", "recurrence-anterior", "recurrence-posterior"),
    gate: g("Combine both reports instead of classifying only the last operation.", "Recognize that neither standard route represents a reliably unused plane and escalate operative planning to specialist expertise.", "The referral key competes with concrete repeat repairs, so its caution is necessary only because both planes are documented. No claim of impossible local surgery or universal technique superiority is made.", "Planning responsibility for a multiply recurrent hernia, all options are concrete repair pathways.", "Predicted moderate: recency anchoring and automatic opposite-plane rules compete. Independent review should check that referral remains a consequential decision rather than a generic cautious key.", "Mesh is recorded both on the inguinal floor and behind transversalis fascia in separate operations.", "Delete the posterior operation: a posterior repair becomes reasonable. Delete the anterior operation: anterior repair becomes reasonable.", "Both reports are necessary to defeat each simple repair rule; stable reduction keeps the task elective.", "Standalone; not immediately paired with a simple recurrence-plane item that rehearses both rules."),
  },
  {
    slug: "woman-femoral-coverage", kind: "new", beforeRecordIds: [],
    conceptId: "concept.hernia-groin.woman-myopectineal-coverage.v1", previousConceptId: null,
    identityReason: "New female repair-coverage objective, beyond named hernia classification or repair urgency.",
    objective: "Select an approach that examines and covers possible femoral disease in a nonpregnant woman with incompletely characterized groin anatomy.",
    currentUpdate: "Lydia's painful but reducible right groin lump interrupts walking. The outside scan records a sac beside the round ligament above the inguinal ligament; its recorded field ends at that ligament. On standing examination the visible fullness extends across the crease, and the neck is difficult to palpate. She has no previous pelvic operation and can undergo general anesthesia. The consulting service regularly performs the offered repairs.",
    stem: "Which elective repair should be discussed for Lydia's groin hernia?",
    choices: [
      c("anterior", "Open anterior Lichtenstein mesh repair", false, "It can repair inguinal disease, but the represented uncertainty in a woman includes a femoral compartment that an anterior inguinal repair may overlook.", "Accept the outside inguinal label as complete anatomical coverage.", "A patient requiring local anesthesia with adequately characterized inguinal anatomy could favor an experienced anterior repair."),
      c("tapp", "Transabdominal preperitoneal mesh repair", true, "The preperitoneal approach can inspect and cover both inguinal and femoral openings, addressing the unresolved compartment in this nonpregnant woman.", "Use sex-specific missed-femoral risk and actual scan coverage to choose the offered approach.", "Major prior pelvic surgery or a requirement for local anesthesia would change the balance and require tailored planning."),
      c("tissue", "Open anterior Shouldice tissue repair", false, "An anterior tissue repair does not resolve the unassessed femoral compartment; no non-mesh preference supplies a reason to favor it here.", "Choose a primary inguinal tissue repair without resolving broader groin coverage.", "A selected primary unilateral inguinal hernia after femoral disease is excluded and informed non-mesh choice could support expert Shouldice repair."),
    ],
    explanation: "The scan characterizes an inguinal finding but not the whole groin. In nonpregnant women, a laparo-endoscopic preperitoneal approach helps avoid missed femoral disease and covers both openings. TAPP is the offered posterior option; this question does not claim superiority over TEP or make laparoscopy mandatory despite a genuine contraindication.",
    claimIds: claim("women-coverage", "femoral-route", "inguinal-routes", "tailored-approach", "mesh-tissue"),
    gate: g("Interpret the acquisition boundary and clinical fullness as incomplete characterization rather than proof of isolated inguinal disease.", "Apply the female groin repair-coverage consideration to the offered operations and actual eligibility.", "The task avoids saying comprehensive coverage, and no option alone contains a combined inguinal/femoral phrase. The general-anesthesia and pelvic-history constraints are necessary for this operative comparison and apply to the full option set.", "Elective operation selection, three actual repairs.", "Predicted moderate: a plausible inguinal scan label and common anterior repair compete with the unassessed female femoral compartment.", "The acquisition stops at the ligament while the clinical fullness crosses the crease in a nonpregnant woman.", "Add major pelvic dissection or a need for local anesthesia: a routine posterior preference becomes less secure and anterior planning may be favored.", "Sex, acquisition coverage, symptom burden and operative constraints determine the approach; none is an epidemiological selection weight.", "Standalone; no prior classification answer supplies a femoral diagnosis."),
  },
  {
    slug: "acute-reduction-selection", kind: "new", beforeRecordIds: [],
    conceptId: "concept.hernia-groin.acute-nonischemic-reduction.v1", previousConceptId: null,
    identityReason: "New hospital reduction-selection construct; distinct from the old clinic transfer safety identity.",
    objective: "Separate acute irreducibility from suspected tissue ischemia when considering an initial monitored reduction attempt.",
    currentUpdate: "The outside emergency surgical service reports that Noah's previously reducing inguinal lump has remained out since a lifting episode. He has localized discomfort without increasing continuous pain. The overlying skin has its usual color, the abdomen is soft without guarding, and he has no vomiting or systemic deterioration. Monitored analgesia and surgical rescue are part of that service's care.",
    stem: "Which initial hernia-directed intervention should be recommended for Noah's hospital episode?",
    choices: [
      c("operate", "Proceed directly to operative groin exploration", false, "Operation becomes necessary after failed reduction or suspected ischemia. The represented low-ischemia-concern acute episode can first be considered for gentle reduction.", "Equate acute irreducibility with proven strangulation.", "Increasing continuous pain, discolored skin, guarding or failed gentle reduction would favor operative exploration."),
      c("reduce", "Attempt gentle monitored manual reduction", true, "A previously reducing hernia has become acutely irreducible without suspected bowel ischemia. Current guidance supports considering gentle reduction in this hospital setting.", "Use the clinical ischemia assessment rather than the label irreducible alone.", "If bowel compromise were suspected, reduction would give way to emergency operative assessment."),
      c("wait", "Defer intervention for overnight reassessment", false, "An acutely irreducible hernia needs urgent surgical attention. Monitoring is part of active assessment, not a substitute for addressing irreducibility.", "Treat stable circulation as permission to leave an acute fixed hernia unresolved.", "A long-standing unchanged irreducible lump without new symptoms would represent a different nonacute pathway."),
    ],
    explanation: "Acute irreducibility and strangulation are different findings. A gentle monitored reduction attempt is supported when the hospital team has no ischemia concern; failed reduction or new concern requires emergency surgery. No forceful office reduction, medication dose or fixed time window is authorized by this draft.",
    claimIds: claim("reduction-selection", "strangulation-action"),
    gate: g("Use the change from prior reducibility plus the current observed pain, skin and abdominal findings to characterize the episode.", "Choose an urgent reduction attempt rather than compulsory immediate surgery or passive delay.", "The skin, abdominal and pain observations preserve reduction safety without supplying an ischemia interpretation; the learner distinguishes irreducibility from strangulation. Options are specific interventions at the same immediate phase.", "Initial hospital hernia intervention, reviewed in clinic.", "Predicted moderate, with a safety component: overcalling strangulation and delaying stable patients are competing errors. Difficulty remains qualitative and the weak evidence is explicit.", "Recent loss of reducibility without a concerning clinical ischemia pattern.", "Add progressive continuous pain and skin discoloration, or a failed attempt: operative exploration becomes preferred.", "Removing the acute change conflates chronic irreducibility; removing ischemia assessment makes the reduction key unsafe.", "Standalone hospital chart review; a simple sedation-recovery follow-up was removed after the author gate because it did not predict resident-level difficulty."),
  },
  {
    slug: "spontaneous-reduction-viability", kind: "new", beforeRecordIds: [],
    conceptId: "concept.hernia-groin.reduced-sac-bowel-viability.v1", previousConceptId: null,
    identityReason: "New operative viability-assessment construct after the sac contents reduce before inspection.",
    objective: "Recognize that disappearance of a concerning hernia does not establish bowel viability.",
    currentUpdate: "Iris's outside hospital record describes a tender fixed femoral lump with diminished enhancement of trapped bowel on contrast CT. The surgical team had begun emergency repair. After induction the lump disappeared before the bowel could be inspected. She is hemodynamically stable, and the operative team has laparoscopic expertise.",
    stem: "Which operative step should the hospital team take next in Iris's recorded operation?",
    choices: [
      c("assess", "Inspect the reduced bowel laparoscopically", true, "The previously concerning bowel has not been assessed. Diagnostic laparoscopy can inspect viability after spontaneous reduction in this stable setting.", "Separate disappearance of the lump from evidence about the previously trapped tissue.", "If the bowel had already been directly inspected and found viable, that inspection would not need to be repeated solely because a lump had reduced.", timing("advanced_diagnostic")),
      c("close", "Complete groin repair and wound closure", false, "Repairing the defect does not resolve the unassessed viability of bowel that reduced after concerning preoperative findings.", "Use spontaneous reduction as proof that ischemia has reversed.", "Directly assessed viable bowel with no residual concern would permit completing the repair."),
      c("resect", "Resect the previously trapped bowel segment", false, "CT concern establishes a need to assess viability, not irreversible necrosis of an identified segment. No bowel has yet been inspected or located for resection.", "Convert reduced enhancement into proof that resection is required.", "Directly visualized irreversibly nonviable bowel would support resection."),
    ],
    explanation: "A vanished lump is not a viability examination. Diagnostic laparoscopy is a supported way to inspect previously concerning bowel after spontaneous reduction in a stable patient with the required expertise. Resection depends on what is found, not on CT concern alone.",
    claimIds: claim("reduced-bowel-viability", "perfusion-observation", "strangulation-action"),
    gate: g("Preserve the earlier ischemia concern despite the new absence of the external lump.", "Select direct assessment before either completing repair or committing to resection.", "Removed safe/available-laparoscopy praise; operator expertise and stable circulation are genuine feasibility constraints. All options are operative steps, not imaging versus unrelated outpatient care.", "Next intraoperative step, outside records reviewed in clinic.", "Predicted moderate: spontaneous reduction falsely reassures, whereas prior CT can tempt unjustified resection.", "Concerning bowel reduced before inspection, so viability remains unassessed.", "Supply direct observation of irreversible necrosis: resection becomes the next step. Supply already documented viable tissue: completing repair becomes reasonable.", "Both the earlier compromise and the unperformed inspection are necessary; this is actual chronology, not a missing exported image.", "Standalone; no prior explanation teaches post-reduction viability assessment."),
  },
  {
    slug: "resection-mesh-eligibility", kind: "new", beforeRecordIds: [],
    conceptId: "concept.hernia-groin.mesh-after-controlled-resection.v1", previousConceptId: null,
    identityReason: "New groin repair-material eligibility after bowel resection; distinct from the urgency construct.",
    objective: "Distinguish controlled bowel resection from gross enteric contamination before excluding permanent mesh.",
    currentUpdate: "At the next clinic chart review, Andre's operative record documents removal of the nonviable trapped bowel and a closed anastomosis. The resection was controlled without enteric spillage. The surgeon reports no perforation, pus or peritonitis, and stable circulation. The remaining decision in the record is how to reinforce the groin defect.",
    stem: "Which repair policy is supported by Andre's recorded operative field?",
    choices: [
      c("defer", "Defer groin reinforcement to a later operation", false, "Controlled resection without gross contamination does not require a routine staged groin repair.", "Treat any intestinal procedure as incompatible with definitive hernia repair.", "Severe instability or an uncontrolled contaminated field could require a staged strategy."),
      c("mesh", "Allow permanent macroporous synthetic mesh repair", true, "A controlled clean-contaminated resection is not an automatic exclusion of macroporous permanent synthetic mesh. This is eligibility, not a claim that every patient must receive it.", "Classify the actual contamination rather than using resection as a surrogate.", "Gross enteric spillage with a small closable defect would change the preferred policy toward tissue repair."),
      c("suture", "Restrict groin reinforcement to primary tissue repair", false, "Tissue repair remains possible, but excluding permanent mesh solely because bowel was resected is unsupported in the represented controlled field.", "Overgeneralize a contaminated-field restriction to all bowel resections.", "Gross contamination with a small defect suitable for direct closure supports a primary tissue strategy."),
    ],
    explanation: "The relevant boundary is the actual operative field, not bowel resection as a binary label. Current HerniaSurge guidance allows macroporous mesh after a controlled clean-contaminated resection; older WSES guidance supports the same eligibility. This weak-evidence comparison does not mandate one material or extend to gross spillage.",
    claimIds: claim("mesh-clean-contaminated", "mesh-gross-spillage"),
    gate: g("Classify controlled resection without spillage as a different field from enteric contamination.", "Decide whether permanent mesh must be excluded, without inventing universal operative superiority.", "Repaired an initial material-versus-material ambiguity by asking an eligibility policy. All labels are actual repair policies, without rationale text. The key does not say safe, best or no infection risk.", "Definitive groin reinforcement policy after completed source management.", "Predicted moderate to hard: bowel resection often prompts blanket mesh avoidance, while the field changes that boundary.", "Controlled resection with no spillage, perforation, pus or peritonitis.", "Add gross stool spillage and a small closable defect: primary tissue repair becomes the supported policy.", "Deleting the field observations leaves only bowel resection and makes mesh eligibility underdetermined.", "Earlier acute feedback discusses viability and urgency, not wound class or repair material. This later operative record earns a distinct inference."),
  },
  {
    slug: "gross-spillage-tissue-repair", kind: "new", beforeRecordIds: [],
    conceptId: "concept.hernia-groin.small-contaminated-defect-repair.v1", previousConceptId: null,
    identityReason: "New gross-contamination and defect-closure decision; not a minor wording variant of controlled resection eligibility.",
    objective: "Integrate gross enteric spillage and a directly closable small defect to select the offered repair.",
    currentUpdate: "Lena's outside operative record describes a perforated bowel segment within a femoral sac. Enteric contents spilled into the field before resection. Source control and lavage are complete, circulation is stable, and the groin defect measures 2 cm. The surgeon can approximate its edges without tension.",
    stem: "Which groin repair should be recommended for Lena's recorded operative field?",
    choices: [
      c("synthetic", "Permanent macroporous synthetic mesh repair", false, "The permissive controlled-resection evidence cannot be carried over to gross contamination in a small directly closable defect.", "Ignore the field difference because bowel resection can sometimes accompany mesh repair.", "Controlled resection without spillage would permit considering permanent macroporous mesh."),
      c("biologic", "Biologic mesh reinforcement of the defect", false, "The cited older guideline reserves consideration of biologic material for contaminated defects where primary suture is not feasible; direct closure is feasible here.", "Assume contamination automatically requires biologic material.", "A defect that cannot be closed directly would require a different specialist reconstruction comparison; biologic material is one weak-evidence option."),
      c("tissue", "Primary tissue closure of the groin defect", true, "For a stable patient with gross contamination and a small directly closable defect, WSES supports primary repair. This is a low-certainty, specifically scoped application.", "Use both actual contamination and closure feasibility.", "If the field were controlled without spillage, permanent mesh would become a permissible option rather than being excluded."),
    ],
    explanation: "Gross spillage separates this case from controlled clean-contaminated bowel resection. WSES supports primary tissue repair when such a defect is small and directly closable. Its less-than-3-cm boundary directly supports this constructed 2-cm observation; the recommendation is older and low certainty, not a rule for all contaminated abdominal-wall defects.",
    claimIds: claim("mesh-gross-spillage", "mesh-clean-contaminated"),
    gate: g("Distinguish actual enteric spillage from resection without contamination, then assess direct closure feasibility.", "Choose tissue repair for the represented small closable contaminated defect.", "Three parallel repair options, no uniquely cautious combined plan. The exact constructed dimension is directly inside the sourced boundary; it is not a new invented cutoff.", "Definitive groin repair after source control, all choices are repairs.", "Predicted moderate: both permanent-mesh overextension and automatic biologic-mesh substitution are credible errors.", "Gross spillage plus a 2-cm defect whose edges approximate without tension.", "Change to controlled resection without spillage: synthetic mesh becomes permissible. Make closure infeasible: the present single primary-closure key loses its support.", "Removing contamination or feasibility produces multiple plausible repair strategies.", "Standalone companion scenario; do not precede it with feedback that states the contamination contrast verbatim. No assembled same-patient sequence is proposed."),
  },
  {
    slug: "cpip-treatment-interval", kind: "new", beforeRecordIds: [],
    conceptId: "concept.hernia-groin.cpip-escalation-readiness.v1", previousConceptId: null,
    identityReason: "New readiness for invasive chronic-pain treatment, distinct from block interpretation or nerve localization.",
    objective: "Distinguish elapsed time since repair from an adequate trial of structured chronic-pain treatment.",
    currentUpdate: "At later review, Mara is eight months after open repair. Her wound is healed, repeated targeted examination has not demonstrated recurrence, and pain still limits work. She entered a specialist hernia/pain program two weeks ago, with medication adjustment and injection therapy. She asks for an operation because so much time has passed since repair. No intolerable treatment adverse effect or progressive focal deficit is recorded.",
    stem: "Which treatment plan should be recommended for Mara at this later review?",
    choices: [
      c("neurectomy", "Proceed to open triple neurectomy", false, "Passing a postoperative interval is not the same as completing the recommended period of less invasive pain treatment. The available record does not select triple neurectomy now.", "Use the date of the original repair as the sole escalation criterion.", "Persistent carefully characterized pain after an adequate specialist treatment course may warrant discussion of tailored surgery, without automatically selecting triple neurectomy."),
      c("continue", "Continue the specialist nonoperative pain program", true, "The structured trial has just begun. HerniaSurge suggests continuing pharmacologic/interventional measures for at least three months and being at least six months from repair before invasive treatment planning.", "Interpret treatment exposure as well as time since repair.", "Persistent disabling pain after a completed adequate treatment course would justify a new multidisciplinary discussion of invasive options."),
      c("mesh", "Proceed to anterior mesh explantation", false, "The record supplies neither a specific mesh complication requiring removal nor an adequate completed conservative course. Mesh removal is not selected by postoperative duration alone.", "Attribute all chronic postrepair pain to implanted material.", "A documented mesh-related complication after adequate evaluation may support tailored expert surgery, with its risks considered."),
    ],
    explanation: "Mara has passed the postoperative interval but has only begun structured pain treatment. Continue the specialist pharmacologic/interventional program and reassess. The guideline's minimum intervals do not establish that surgery becomes mandatory after they pass, and any future operation requires individualized evidence and counseling about failure or worsened pain.",
    claimIds: claim("cpip-conservative-interval", "cpip-specialist", "cpip-surgical-limits", "block-information"),
    gate: g("Distinguish eight months since repair from two weeks in the actual structured treatment program.", "Apply readiness for invasive escalation, retaining specialist care rather than selecting a fixed operation.", "The previous partial block response is not reinterpreted as a surgical indication. Three concrete treatment policies at the same decision phase; exact clinical intervals are sourced, not diagnostic wait durations.", "Escalation of chronic postoperative pain treatment after recurrence assessment.", "Predicted moderate: elapsed postoperative time and prior partial block response tempt premature surgery.", "The pain program has lasted two weeks despite eight months since repair.", "Supply an adequate completed specialist treatment course with persistent disabling symptoms: reconsider invasive planning; the exact operation still requires new evidence.", "Deleting either interval hides the tested distinction. The lack of progressive deficit/urgent complication preserves a fair conservative-versus-invasive comparison.", "Prior feedback limits block localization and does not supply the later treatment interval. The new treatment-exposure record is essential to this node."),
  },
  {
    slug: "testicular-pain-source", kind: "new", beforeRecordIds: [],
    conceptId: "concept.hernia-groin.orchialgia-versus-cutaneous-pain.v1", previousConceptId: null,
    identityReason: "New postrepair pain-site/provenance decision, distinct from a named cutaneous nerve-localization question.",
    objective: "Distinguish pain in scrotal contents from mapped scrotal-skin symptoms before selecting the diagnostic referral.",
    currentUpdate: "Rafael describes an ongoing ache within the right testicle after open inguinal repair. Pinprick and light touch over the groin and scrotal skin are symmetric and do not reproduce it. Gentle palpation of the testicle reproduces his usual ache. The groin scar is healed, and dynamic groin examination shows no impulse. There has been no sudden severe onset or systemic illness.",
    stem: "Which evaluation should next address Rafael's postrepair pain?",
    choices: [
      c("genital-block", "Genital-branch block with cutaneous mapping", false, "A skin nerve target is not established by pain reproduced within the testicle while the skin examination is unremarkable.", "Treat scrotal skin innervation as the explanation for all scrotal-content pain.", "Mapped scrotal-skin burning/allodynia could support a targeted specialist cutaneous nerve evaluation.", timing("clinical_procedure")),
      c("urology", "Urological assessment of the scrotal contents", true, "True testicular pain requires assessment of the contents and relevant urological causes; it should not be assumed to be cutaneous postherniorrhaphy neuropathy.", "Preserve the tissue/site distinction before selecting a nerve procedure.", "If light touch over mapped scrotal skin reproduced the symptom and contents were painless, a cutaneous pain pathway would be more appropriate."),
      c("mesh", "Hernia-surgery assessment for mesh removal", false, "The current record does not establish mesh as the source. Evaluate the symptomatic contents before selecting a mesh-directed intervention.", "Use the temporal association with repair to infer a specific mesh complication.", "A demonstrated mesh-related complication after specialist workup could justify tailored surgical assessment."),
    ],
    explanation: "Rafael's symptom is reproduced in the testicular contents rather than the scrotal skin. HerniaSurge distinguishes those sources and supports formal urological evaluation for orchialgia. A prior hernia operation does not establish that a cutaneous nerve block or mesh removal addresses this pain.",
    claimIds: claim("orchialgia-evaluation", "cpip-phenotype", "cpip-specialist", "block-information"),
    gate: g("Localize the reproduced symptom to contents rather than scrotal skin using the actual examination.", "Choose urological assessment instead of a cutaneous block or presumed mesh surgery.", "No orchialgia or genitofemoral diagnosis is supplied before the task. All choices are specific diagnostic/specialist pathways, with the block's wait mapped. Sudden onset is excluded because it would change urgency.", "Next diagnostic evaluation of persistent postrepair pain.", "Predicted moderate: using the genital branch for every scrotal symptom is a credible surgical error.", "Testicular palpation reproduces the usual ache while skin stimulation does not.", "Move the reproduced pain to a mapped skin distribution with painless contents: targeted cutaneous nerve evaluation becomes reasonable.", "Deleting tissue-specific examination collapses the distinction. The nonacute course prevents a hidden acute-scrotum emergency.", "Standalone; no prior nerve-localization answer supplies the referral."),
  },
  {
    slug: "local-anesthesia-selection", kind: "new", beforeRecordIds: [],
    conceptId: "concept.hernia-groin.frail-open-local-anesthesia.v1", previousConceptId: null,
    identityReason: "New anesthesia/repair-context decision within the groin topic; no generic anesthetic-drug objective.",
    objective: "Choose anesthesia for an experienced team's open reducible inguinal repair in a frail older adult.",
    currentUpdate: "Evan has a unilateral reducing inguinal hernia that interrupts dressing and walking. He has severe chronic pulmonary disease without a current exacerbation and previously needed catheterization after spinal anesthesia. The team plans an open Lichtenstein repair. He can cooperate during the procedure, and the team routinely uses both local and general techniques for this operation.",
    stem: "Which anesthetic approach should be favored for Evan's planned open inguinal repair?",
    choices: [
      c("spinal", "Spinal anesthesia", false, "Regional anesthesia is not the favored alternative in this older frail patient with prior retention. Local open repair is an established option with appropriate expertise.", "Assume every way of avoiding general anesthesia has the same risk profile.", "A patient-specific anesthetic assessment may sometimes favor regional care; that preference is not established by this record."),
      c("general", "General anesthesia", false, "General anesthesia is possible, but the severe pulmonary comorbidity, cooperative patient and experienced local-repair team support favoring local anesthesia here.", "Apply the common laparoscopic anesthetic pathway to an already chosen open operation.", "An uncooperative patient or operation not suitable for the team's local technique could favor general anesthesia."),
      c("local", "Local infiltration anesthesia", true, "Experienced local anesthesia is recommended for open reducible inguinal repair and is useful in frail/co-morbid patients. It avoids treating spinal anesthesia as an automatically safer substitute.", "Match the operation, comorbidity and actual ability to cooperate to the anesthetic option.", "If cooperation were impossible or the repair required a different anesthetic plan, this preference would require reassessment."),
    ],
    explanation: "For an experienced team's open repair of a reducing inguinal hernia, local anesthesia is supported and can benefit frail patients. Evan's pulmonary disease and prior retention make an automatic switch to general or spinal anesthesia less attractive. No drug, dose or universal anesthetic contraindication is authored.",
    claimIds: claim("local-open", "older-regional-risk", "tailored-approach"),
    gate: g("Use the actual planned open operation and comorbid/previous anesthetic response, rather than a universal laparoscopic preference.", "Favor local anesthesia when both cooperation and experienced local technique are represented.", "All options are anesthetic techniques, not combined operations. Expertise applies to the comparison and is a genuine prerequisite; the task does not call any option safer by name.", "Anesthesia selection for an already selected open groin repair.", "Predicted moderate: spinal may seem the obvious way to avoid general anesthesia but has a relevant competing risk.", "Frail pulmonary patient, prior spinal-associated retention, cooperative behavior and an experienced local-repair team.", "Make cooperation impossible or change the required operation: general anesthesia may be favored after assessment.", "Removing the planned operation, cooperation or experience makes local technique unfair; prior retention and pulmonary disease create the specific tradeoff.", "Standalone; does not change the anesthesia topic's general drug or airway content."),
  },
  {
    slug: "posterior-mesh-weight", kind: "new", beforeRecordIds: [],
    conceptId: "concept.hernia-groin.large-direct-posterior-mesh.v1", previousConceptId: null,
    identityReason: "New technique-dependent mesh material objective, distinct from recurrence-plane selection.",
    objective: "Avoid transferring the open Lichtenstein lightweight-mesh preference to a large direct posterior repair.",
    currentUpdate: "At later planning review, Nolan's surgeon describes a broad medial defect for the agreed posterior repair. Two equally sized macroporous permanent polypropylene meshes can provide the planned overlap and fixation. One is classified lightweight and the other heavyweight. Nolan's priority is avoiding another recurrence, and he asks whether the lighter implant will also reduce chronic pain in this operation.",
    stem: "Which mesh should be favored for Nolan's planned posterior repair of the broad direct defect?",
    choices: [
      c("light", "The lightweight polypropylene mesh", false, "The chronic-pain advantage described for lightweight material in open Lichtenstein repair does not carry over to posterior repair; recurrence is a concern in large direct defects.", "Generalize a material preference across different operative techniques.", "For an open Lichtenstein repair, lightweight mesh is guideline-supported for pain/foreign-body outcomes."),
      c("heavy", "The heavyweight polypropylene mesh", true, "HerniaSurge recommends heavier mesh in laparo-endoscopic repair, particularly large direct defects, to reduce recurrence; lighter mesh has not shown the proposed chronic-pain advantage in that setting.", "Condition the material choice on technique and defect rather than weight in isolation.", "Changing to an open anterior Lichtenstein operation changes the guideline's weight preference."),
      c("either", "Either mesh with no material preference", false, "Equivalent size and planned fixation do not establish equivalent recurrence behavior for a broad direct posterior defect in the guideline comparison.", "Assume similar coverage cancels technique-specific material evidence.", "For a small lateral posterior defect, the recurrence-weight difference is less supported and a categorical heavy preference is less secure."),
    ],
    explanation: "Mesh weight is not a technique-independent rule. The posterior large-direct setting supports heavier material for recurrence prevention, whereas lightweight mesh is favored in open Lichtenstein repair for pain/foreign-body outcomes. This draft specifies no new numerical weight or defect-size cutoff and makes no all-patient pain guarantee.",
    claimIds: claim("mesh-weight", "mesh-weight-open"),
    gate: g("Combine the posterior technique with the broad medial defect rather than treating lighter mesh as universally better.", "Apply the technique-specific weight recommendation to the patient's recurrence priority.", "Mesh size, composition, overlap and fixation are common so the key is not uniquely complete. Labels have comparable specificity. The equivocal option is an actual material policy, not a vague individualized answer.", "Mesh selection after repair approach is settled.", "Predicted moderate to hard: importing an open-repair pain preference into posterior repair is the central error.", "Broad direct defect treated posteriorly, with both meshes otherwise suitable for the planned repair.", "Change the operation to open Lichtenstein: the lightweight choice becomes preferred for the guideline's pain/foreign-body outcomes.", "Removing technique or defect type makes the weight preference poorly specified; exact grams are unnecessary and omitted.", "The earlier plane answer does not mention material weight or chronic-pain evidence. This later technical planning record supplies a distinct decision."),
  },
  {
    slug: "pregnancy-groin-vessels", kind: "new", beforeRecordIds: [],
    conceptId: "concept.hernia-groin.pregnancy-round-ligament-swelling.v1", previousConceptId: null,
    identityReason: "New adult pregnancy exception and vascular mimic; childhood groin decisions remain outside this lane.",
    objective: "Interpret vascular groin findings during pregnancy before applying the nonpregnant-woman hernia-repair rule.",
    currentUpdate: "Aisha is pregnant and has painless right groin fullness that increases while standing and empties supine. Color Doppler shows compressible serpiginous channels along the round ligament with venous flow augmented during strain. Repeated dynamic views show no protruding bowel or fat sac. She has no acute pain, erythema or vomiting.",
    stem: "Which groin plan should be recommended for Aisha at this clinic review?",
    choices: [
      c("repair", "Arrange elective preperitoneal hernia repair during pregnancy", false, "The record describes a vascular mimic rather than an established visceral hernia. The nonpregnant female hernia policy cannot be applied indiscriminately.", "Treat female groin swelling as a repair indication without interpreting Doppler.", "A true complicated hernia with threatened contents would require surgical assessment regardless of pregnancy."),
      c("excise", "Arrange operative excision of the inguinal swelling", false, "Uncomplicated round-ligament venous enlargement during pregnancy commonly supports observation rather than excision.", "Treat a reducible-appearing vascular swelling as a mass requiring removal.", "Severe persistent symptoms or a complication would prompt specialist reassessment rather than routine observation."),
      c("observe", "Observe the groin swelling with return precautions", true, "Venous channels along the round ligament without a visceral sac support a pregnancy-associated vascular mimic and expectant care in this uncomplicated course.", "Interpret the channels and flow before importing a hernia management rule.", "New severe pain, inflammatory change or a bowel-containing fixed sac would require urgent reassessment."),
    ],
    explanation: "The observed venous channels support round-ligament varicosities, not a demonstrated bowel/fat hernia sac. Uncomplicated pregnancy-associated swelling can be observed with reassessment for new symptoms. The supporting literature is small-cohort/case-series evidence and does not justify ignoring a painful or compromised groin finding.",
    claimIds: claim("pregnancy-swelling", "women-coverage", "strangulation-action"),
    gate: g("Interpret compressible venous channels rather than assuming the reducing contour is a visceral hernia.", "Apply the pregnancy/mimic boundary before choosing observation versus operative treatment.", "Removed varicosity and hernia labels from the pre-answer context. Three concrete management options; Doppler is an observed acquired result with no invented diagnostic cutoff.", "Management of an acquired vascular groin finding during pregnancy.", "Predicted moderate: a generic female-groin repair rule competes with the specific Doppler and pregnancy evidence.", "Venous-flow channels along the round ligament with no dynamically demonstrated visceral sac and no acute symptoms.", "Replace channels with a fixed bowel-containing sac and ischemic concern: urgent operative assessment replaces observation.", "Removing Doppler or pregnancy eliminates the reason not to apply the standard nonpregnant repair discussion.", "Standalone; not immediately preceded by the nonpregnant-woman repair explanation."),
  },
);

const node = (slug: string): TopicNode => {
  const result = HERNIA_GROIN_TOPIC_V1_NODES.find(candidate => candidate.slug === slug);
  if (!result) throw new Error(`Unknown hernia-groin node ${slug}`);
  return result;
};
const clinicCase = (slug: string, name: string, age: number, sex: "Male" | "Female", complaint: string, slugs: string[], outside = false, introduction = ""): TopicCase => ({
  slug, name, age, sex, complaint,
  presentation: `${name}, a ${age}-year-old ${sex === "Male" ? "man" : "woman"}, ${outside ? "is the named patient in an outside-hospital chart review requested at the surgery clinic." : "attends the surgery clinic for groin evaluation."}${introduction ? ` ${introduction}` : ""}`,
  educationalTier: 1, acuity: outside && ["partial-wall", "reduction", "reduced-bowel"].includes(slug) ? "urgent_stable" : "stable",
  earliestFacilityStage: 1, setting: "clinic", frame: outside ? "outside_records_in_clinic" : "current_clinic", nodes: slugs.map(node),
});

/** Exact finite profiles: age and sex are fixed, with no independently recombined clinical attributes. */
export const HERNIA_GROIN_TOPIC_V1_CASE_DEFINITIONS: TopicCase[] = [
  clinicCase("marked-groin", "Elena Ortiz", 48, "Female", "Groin lump", ["marked-femoral-repair"]),
  clinicCase("changing-function", "Daniel Brooks", 46, "Male", "Groin discomfort", ["selected-observation", "interval-symptom-shift"]),
  clinicCase("block-components", "Mara Lewis", 43, "Female", "Pain after repair", ["partial-block-response", "cpip-treatment-interval"], false, "She is reviewing pain after an open inguinal repair."),
  clinicCase("negative-dynamic-study", "Priya Shah", 52, "Female", "Intermittent groin swelling", ["negative-study-mri"]),
  clinicCase("partial-wall", "Andre Silva", 59, "Male", "Hospital record review", ["partial-wall-urgency", "resection-mesh-eligibility"], true),
  clinicCase("moving-medial-wall", "Owen Reed", 63, "Male", "Lifting discomfort", ["medial-defect-plan"]),
  clinicCase("new-postrepair-component", "Victor Chen", 50, "Male", "Pain after repair", ["new-component-ultrasound", "posterior-recurrence-plane"], false, "He reports a new symptom after a prior left inguinal repair."),
  clinicCase("anterior-recurrence", "Nolan Price", 66, "Male", "Recurrent groin bulge", ["anterior-recurrence-plane", "posterior-mesh-weight"]),
  clinicCase("multiple-prior-repairs", "Sofia Grant", 61, "Female", "Recurrent groin discomfort", ["both-planes-expertise"]),
  clinicCase("woman-groin-coverage", "Lydia Foster", 55, "Female", "Groin swelling", ["woman-femoral-coverage"]),
  clinicCase("reduction", "Noah Turner", 54, "Male", "Hospital record review", ["acute-reduction-selection"], true),
  clinicCase("reduced-bowel", "Iris Walker", 69, "Female", "Hospital operation review", ["spontaneous-reduction-viability"], true),
  clinicCase("contaminated-groin", "Lena Morris", 64, "Female", "Hospital operation review", ["gross-spillage-tissue-repair"], true),
  clinicCase("testicular-contents", "Rafael Diaz", 45, "Male", "Testicular ache", ["testicular-pain-source"]),
  clinicCase("open-anesthesia", "Evan Carter", 78, "Male", "Repair planning", ["local-anesthesia-selection"]),
  clinicCase("pregnancy-swelling", "Aisha Wilson", 31, "Female", "Groin fullness", ["pregnancy-groin-vessels"], false, "She is 26 weeks pregnant."),
];

export const herniaGroinQuestionId = (slug: string, version = 1) => `question.topic.hernia-groin.${slug}.v${version}`;
export const herniaGroinCaseId = (slug: string) => `case.topic.hernia-groin.${slug}.v1`;
export const herniaGroinNodeId = (slug: string, version = 1) => `node.topic.hernia-groin.${slug}.v${version}`;
export const herniaGroinChoiceId = (slug: string, choice: string, version = 1) => `choice.topic.hernia-groin.${slug}.${choice}.v${version}`;

export const HERNIA_GROIN_TOPIC_V1_QUESTIONS: Array<QuestionVariant & { shuffleAnswers: true }> = HERNIA_GROIN_TOPIC_V1_NODES.map(definition => ({
  ...HERNIA_GROIN_TOPIC_DRAFT,
  id: herniaGroinQuestionId(definition.slug), conceptId: definition.conceptId, stem: definition.stem,
  shuffleAnswers: true,
  answerChoices: definition.choices.map(choice => ({
    id: herniaGroinChoiceId(definition.slug, choice.id), label: choice.label,
    isCorrect: choice.isCorrect, rationale: choice.rationale, distractorRationale: choice.isCorrect ? null : choice.rationale,
  })),
  explanation: definition.explanation, ...(definition.exhibit ? { exhibit: definition.exhibit } : {}), supportingEvidenceClaimIds: definition.claimIds,
}));

const sourceLabels = (definition: TopicNode) => Array.from(new Set(definition.claimIds.flatMap(id => HERNIA_GROIN_TOPIC_CLAIMS.find(item => item.id === id)?.sourceIds ?? [])))
  .map(id => {
    const source = HERNIA_GROIN_TOPIC_SOURCES.find(candidate => candidate.id === id);
    return source ? `${source.title} (${source.publicationYear})` : id;
  });

export const HERNIA_GROIN_TOPIC_V1_CASES: SyntheticClinicalCase[] = HERNIA_GROIN_TOPIC_V1_CASE_DEFINITIONS.map(definition => ({
  id: herniaGroinCaseId(definition.slug), displayName: `Groin topic: ${definition.slug}`,
  patientPresentationVariantId: `presentation.topic.hernia-groin.${definition.slug}.v1`,
  releasePointId: "release.l0.clinic_evaluation", patientDisplayName: definition.name,
  prototypeDemographics: { ageYears: definition.age, sexLabel: definition.sex },
  chiefComplaint: definition.complaint, presentation: definition.presentation,
  approvedInstantiationProfiles: [{
    id: `profile.topic.hernia-groin.${definition.slug}.v1`,
    prototypeDemographics: { ageYears: definition.age, sexLabel: definition.sex },
    chiefComplaint: definition.complaint, presentation: definition.presentation,
  }],
  tutorialEligible: false, routineEligible: true, earliestFacilityStage: definition.earliestFacilityStage,
  requiredClinicalSetting: definition.setting, requiredCapabilityIds: [], rewardTierId: "reward.clinic_basic",
  sourceLabels: Array.from(new Set(definition.nodes.flatMap(sourceLabels))),
  decisionNodes: definition.nodes.map((item, index) => ({
    id: herniaGroinNodeId(item.slug), questionVariantId: herniaGroinQuestionId(item.slug), primaryConceptId: item.conceptId,
    currentUpdate: item.currentUpdate, stem: item.stem, ...(item.exhibit ? { exhibit: item.exhibit } : {}),
    answerChoices: item.choices.map(choice => ({ id: herniaGroinChoiceId(item.slug, choice.id), label: choice.label, isCorrect: choice.isCorrect, serviceRequest: null })),
    shuffleAnswers: true, showServicePreviews: true, explanation: item.explanation,
    sourceLabels: sourceLabels(item), resultGateAfter: null,
    terminalDispositions: index === definition.nodes.length - 1 ? item.choices.filter(choice => !choice.isCorrect).map(choice => ({
      answerChoiceId: herniaGroinChoiceId(item.slug, choice.id), kind: "no_terminal_outcome" as const,
      consequenceNarrative: `The teaching record selected ${choice.label}.`, clinicalRationale: choice.rationale,
      sourceLabels: sourceLabels(item),
    })) : [],
  })),
  learningSummary: definition.nodes.map(item => item.explanation).join("\n"),
}));

export const HERNIA_GROIN_TOPIC_V1_AUTHORING_CONCEPTS = Array.from(new Map(HERNIA_GROIN_TOPIC_V1_NODES.map(item => [item.conceptId, {
  ...HERNIA_GROIN_TOPIC_DRAFT, id: item.conceptId, displayName: item.slug.replaceAll("-", " "),
  learningObjective: item.conceptId === "concept.postherniorrhaphy-pain.block-evidence-limits.v1"
    ? "Interpret the limited scope of a component-specific response or nonresponse to a diagnostic postrepair-pain block."
    : item.objective,
  earliestFacilityStage: 1, educationalTier: 1, conceptType: (item.slug.includes("block") || item.slug.includes("study") || item.slug.includes("ultrasound") || item.slug.includes("source") ? "workup" : "management") as "workup" | "management",
  previousConceptId: item.previousConceptId, identityReason: item.identityReason,
  evidenceClaimIds: Array.from(new Set(HERNIA_GROIN_TOPIC_V1_NODES.filter(other => other.conceptId === item.conceptId).flatMap(other => other.claimIds))),
}])).values());
export const HERNIA_GROIN_TOPIC_V1_CONCEPTS: TestedConcept[] = HERNIA_GROIN_TOPIC_V1_AUTHORING_CONCEPTS.map(item => ({
  id: item.id, displayName: item.displayName, learningObjective: item.learningObjective, earliestFacilityStage: item.earliestFacilityStage, conceptType: item.conceptType,
}));

/** Presentation-only estimates. Every exact choice is mapped; these records do not execute orders. */
export const HERNIA_GROIN_TOPIC_V1_TIMING_PROPOSALS: AnswerChoiceTimingRegistryEntry[] = HERNIA_GROIN_TOPIC_V1_CASE_DEFINITIONS.flatMap(definition => definition.nodes.map(item => ({
  caseId: herniaGroinCaseId(definition.slug), nodeId: herniaGroinNodeId(item.slug), questionVariantId: herniaGroinQuestionId(item.slug),
  classification: item.choices.some(choice => choice.timing.kind === "test") ? {
    kind: "test_choices" as const,
    choices: item.choices.map(choice => ({ choiceId: herniaGroinChoiceId(item.slug, choice.id), choiceLabel: choice.label, timing: choice.timing })),
  } : { kind: "no_test" as const },
})));
export const HERNIA_GROIN_TOPIC_V1_ORDER_PROPOSALS = HERNIA_GROIN_TOPIC_V1_CASE_DEFINITIONS.flatMap(definition => definition.nodes.flatMap(item => item.choices.filter(choice => choice.timing.kind === "test").map(choice => ({
  caseId: herniaGroinCaseId(definition.slug), nodeId: herniaGroinNodeId(item.slug), questionVariantId: herniaGroinQuestionId(item.slug),
  choiceId: herniaGroinChoiceId(item.slug, choice.id), choiceLabel: choice.label, timing: choice.timing,
  execution: "planning_only_no_new_order" as const, serviceRequest: null, resultGateAfter: null,
  integrationNote: "Use exact label/identity placeholder estimates. Later records are explicitly outside results at a later clinic review; no testing execution is claimed.",
}))));

export const HERNIA_GROIN_TOPIC_SOURCE_LINKS = HERNIA_GROIN_TOPIC_SOURCES.map(source => ({
  sourceId: source.id, href: source.officialUrl, target: "_blank" as const, rel: "noopener noreferrer" as const, referrerPolicy: "no-referrer" as const,
}));
export const HERNIA_GROIN_TOPIC_V1_COMPOSITION_PROPOSALS = HERNIA_GROIN_TOPIC_V1_CASE_DEFINITIONS.map(definition => ({
  caseId: herniaGroinCaseId(definition.slug), frame: definition.frame, setting: definition.setting,
  educationalTier: definition.educationalTier, acuity: definition.acuity,
  facilityProgressionLevel: definition.earliestFacilityStage, requiredFacilityCapabilityIds: [],
  nodeIds: definition.nodes.map(item => herniaGroinNodeId(item.slug)), conceptIds: definition.nodes.map(item => item.conceptId),
  selection: definition.nodes.length > 1 ? "paired_only_all_concepts_unseen_or_due" : "standalone",
  sequenceCheck: definition.nodes.map(item => item.gate.sequenceCheck),
  reviewStatus: HERNIA_GROIN_TOPIC_DRAFT.reviewStatus,
}));

export const HERNIA_GROIN_TOPIC_V1_IDENTITY_PROPOSALS = HERNIA_GROIN_TOPIC_V1_AUTHORING_CONCEPTS.map(item => ({
  conceptId: item.id, previousConceptId: item.previousConceptId, reason: item.identityReason,
  clinicalReviewStatus: "needs_clinician_review" as const,
  historyPolicy: item.previousConceptId ? "Keep the old identity and FSRS history; do not transfer history to a new meaning." : "Reuse only if the retained semantic identity is unchanged; new gap IDs begin separate history.",
}));

/** One response to the independent round-one review. All reviewed v1 data above remain retained. */
export const HERNIA_GROIN_TOPIC_REVISION_DRAFT = {
  ...HERNIA_GROIN_TOPIC_DRAFT,
  contentVersion: "clinical.question-topic-hernia-groin.2026-11-11.v2",
} as const;
export const HERNIA_GROIN_TOPIC_PASS_SLUGS = [
  "selected-observation", "partial-wall-urgency", "posterior-recurrence-plane", "gross-spillage-tissue-repair",
] as const;

export const HERNIA_GROIN_TOPIC_PARKS = [
  { slug: "interval-symptom-shift", attemptedRepair: "Compared referral timing and alternate nonoperative plans after the functional change. Neither supplies a distinct unresolved decision beyond the preceding observation objective.", reason: "The PASS companion already teaches observation with reassessment. The supplied reduction-responsive restriction makes consultation straightforward; adding an arbitrary scan/rehabilitation delay would preserve the rejected weak competition. A different operative construct would require a separately supported objective. Retain this fair safety/management teaching point as background, not a scored basic exception." },
  { slug: "negative-study-mri", attemptedRepair: "Considered equally detailed MRI, CT and repeat-ultrasound protocols while removing the internal hold reference and same-study wording.", reason: "After the adequately targeted negative acquisition, existing guidance allows further cross-sectional assessment but does not uniquely rank all credible protocols without an additional patient-specific indication or constraint. Reintroducing hip disease would reproduce the unresolved owner-held MRI/hip/block priority problem. The easy/modality-elimination version is not fresh supply." },
  { slug: "medial-defect-plan", attemptedRepair: "Replaced posterior-wall wording with named repairs, then changed the defect between direct and indirect in the counterfactual.", reason: "Both symptomatic inguinal routes can support the same repair discussion. The anatomical inference still fails the action-changing deletion test; choosing a named operation from this record would imply an unsupported uniquely preferred technique. Do not confuse deficient posterior wall with a posterior operative approach." },
  { slug: "both-planes-expertise", attemptedRepair: "Removed routine/ambulatory warning labels and compared equally qualified specialist planning routes.", reason: "The record supports expert planning but not a uniquely preferred repeat operation or specialist test. All credible expert plans remained potentially appropriate, while comparing referral against automatic reoperation retained the cautious-key cue. No forced operative ranking is authored." },
  { slug: "woman-femoral-coverage", attemptedRepair: "Made nonpregnancy explicit and removed scan-coverage and anesthesia-permission scaffolding, then changed the imaged route.", reason: "The same population-based preperitoneal recommendation followed with either route; the scan interpretation still did not change the offered action. Adding prior pelvic surgery would need a patient-specific competing plan rather than a universal female approach rule. No accepted basic-role exception exists for this exact item." },
  { slug: "spontaneous-reduction-viability", attemptedRepair: "Compared same-stage laparoscopy, open inspection and imaging rather than inspection versus unassessed closure/resection.", reason: "The supported fact is the need to assess previously concerning bowel, but the available record does not fairly distinguish all real inspection approaches. Keeping only one inspection choice preserved the named-omission shortcut. No unsupported viability cutoff, mandatory resection rule or availability tie-breaker is introduced." },
  { slug: "cpip-treatment-interval", attemptedRepair: "Compared concrete nonoperative next steps instead of a newly begun program against two fixed irreversible operations.", reason: "The recorded evidence supplies no exact active regimen/response that establishes one best nonoperative escalation. Merely adding treatment names would invent a verified ranking. Retaining two weeks of treatment versus elapsed postoperative time still leaves the previously scaffolded easy timing rule. No new drug dose or treatment algorithm is guessed." },
  { slug: "testicular-pain-source", attemptedRepair: "Removed the already-localized within-testicle description and compared diagnostic referral targets using the examination.", reason: "Without an acquired response that separates skin from deeper provocation, the standalone version remained a site-to-specialty match. Its stronger response/provenance decision is now represented by partial-block-response.v2, under a new concept meaning; this old concept is not silently rebound." },
  { slug: "posterior-mesh-weight", attemptedRepair: "Specified TEP, considered measured medial-defect observations and explicitly answered the pain question, then varied the defect classification.", reason: "The verified 2023 recommendation favors heavier mesh for laparo-endoscopic repair more broadly, so adding direct/large anatomy did not reliably change the offered weight policy. A balanced material tradeoff with one supported best answer was not established; this remained narrow guideline recall with testing priority unconfirmed. The original scope/pain wording and any numeric classification extension are withheld rather than cosmetically hardened." },
  { slug: "pregnancy-groin-vessels", attemptedRepair: "Removed repeated pregnancy framing and considered a diagnostic rather than operative comparison, then varied vascular channels versus a reducing hernia.", reason: "Uncomplicated swelling in pregnancy may still be observed with either diagnosis, so the vascular interpretation did not change the offered management. Real complications would need additional verified facts and a different urgent decision. No unsupported anticoagulation or procedure rule is added." },
] as const;

const revised = (slug: string, patch: Partial<TopicNode>): TopicNode => ({
  ...structuredClone(HERNIA_GROIN_TOPIC_V1_NODES.find(item => item.slug === slug)!),
  version: 2, ...patch,
});

export const HERNIA_GROIN_TOPIC_REVISION_NODES: TopicNode[] = [
  revised("marked-femoral-repair", {
    objective: "Localize a man's marked reducing swelling and apply the anatomy-dependent observation boundary.",
    currentUpdate: "Elliot marks the painless swelling that appears during standing. It empties supine, and examination is nontender. He completes his usual lifting without discomfort and would prefer to defer an operation if reasonable.",
    exhibit: { kind: "keyValue", caption: "Radiologist's targeted dynamic groin ultrasound report — constructed findings", items: [
      { label: "Skin marker", value: "The marker overlies a bowel-containing sac whose neck passes below the inguinal ligament and immediately medial to the common femoral vein." },
      { label: "Cranial finding", value: "A separate fat protrusion passes above the ligament, medial to the inferior epigastric vessels." },
    ] },
    stem: "Which plan should be recommended for Elliot's marked groin swelling?",
    choices: [
      c("observe", "Schedule groin surveillance", false, "The male minimally symptomatic inguinal observation policy does not extend to a sac following the femoral route.", "Apply the correct selected-male policy to the wrong anatomical target.", "If the marked sac instead followed the cranial inguinal route, the painless functional course and preference would support observation."),
      c("repair", "Arrange elective groin repair", true, "The radiologist's marked target is in the femoral compartment. Its current reducing, nontender course supports elective repair assessment, despite little functional burden.", "Use the marked target's neck rather than the separate cranial lesion to apply the repair boundary.", "Moving the marked neck above the ligament into the inguinal compartment would make informed observation reasonable in this man."),
      c("explore", "Arrange emergency groin exploration", false, "Femoral anatomy warrants repair assessment, but current reduction and the nontender examination do not establish an ischemic emergency.", "Treat the femoral route itself as proof of current strangulation.", "New fixed tenderness with concern for compromised bowel would change urgency to emergency exploration."),
    ],
    explanation: "The radiologist describes the marked sac below the ligament and medial to the vein, separate from the cranial inguinal protrusion. That femoral route changes the repair boundary even in a man who has little discomfort and prefers observation. Current reduction and a nontender examination support an elective rather than emergency pathway.",
    gate: g("Trace the marker to the appropriate sac neck among two reported findings.", "Apply the femoral exception to selected-male inguinal observation, then preserve the observed elective acuity.", "Removed the pressing-here dismissal and identified the radiologist/modality. Changing the patient to a man makes localization consequential; the wrong inguinal attribution now supports a genuinely different offered plan. All three labels remain parallel care policies.", "Current groin care policy after an acquired anatomical report.", "Predicted moderate: surveillance is a credible competitor under the painless male profile but depends on which neck is actually marked.", "The marked bowel-containing sac passes below the ligament and medial to the vein; the cranial defect is a separate finding.", "Move the marked neck above the ligament into the inguinal compartment while preserving function and preference: surveillance becomes reasonable. Add acute fixed tenderness and bowel compromise: emergency exploration.", "Without target localization, surveillance versus repair is unresolved. The sex/preference/function fields now establish a real counterfactual rather than decorative anatomy in a woman who would still merit repair.", "Standalone v2. No earlier type label or companion feedback supplies the classification. The reviewed v1 case remains archived."),
  }),
  revised("partial-block-response", {
    conceptId: "concept.postherniorrhaphy-pain.response-separated-scrotal-evaluation.v1",
    previousConceptId: "concept.postherniorrhaphy-pain.block-evidence-limits.v1",
    identityReason: "New scored meaning: use a component-specific response to select the remaining evaluation target, rather than label the information content of a block. Keep the old block-evidence identity and history.",
    objective: "Use acquired sensory response and provocation through anesthetized skin to choose the evaluation of a remaining deep symptom.",
    currentUpdate: "Marek reports clothing-triggered burning near the repair and another ache during lifting. Before the specialist's injection, touching the area was too painful to distinguish the two. After an ilioinguinal/iliohypogastric block, the recorded lower-abdominal and anterior scrotal skin field has reduced pinprick sensation, and clothing no longer provokes burning. Through that skin, compression of the palpable right testicular body still reproduces the lifting ache. The course has been gradual without a sudden severe episode. As the anesthetic wears off, the superficial burning returns while the deeper ache persists.",
    stem: "Which diagnostic evaluation should next address Marek's remaining lifting ache?",
    exhibit: undefined,
    choices: [
      c("genital", "Pain-service assessment for a genital-branch block", false, "Scrotal radiation can suggest a cutaneous genital-branch contribution, but pain persisting with compression of the contents through the observed anesthetized skin field warrants assessment of the contents rather than presuming another skin nerve target.", "Treat all postrepair scrotal discomfort as cutaneous genitofemoral pain.", "Persistent mapped scrotal-skin burning with painless deeper compression would make a targeted cutaneous nerve evaluation reasonable.", timing("clinical_procedure")),
      c("contents", "Urological assessment of the scrotal contents", true, "The block separates an injection-responsive superficial component from the deeper provoked symptom. Formal urological evaluation is warranted for the latter; no specific testicular diagnosis is established.", "Use the acquired response to interpret the provenance of the remaining provoked pain.", "If the compression-provoked symptom disappeared with the superficial sensory effect, this record would no longer establish the same contents-focused priority."),
      c("repair-site", "Hernia-service assessment for structural recurrence", false, "Postrepair lifting pain makes recurrence a credible alternative, but the new discriminating observation localizes the reproduced remaining ache to compression of the scrotal contents after the skin response is documented.", "Use the original operation and lifting association to assign all residual pain to the repair site.", "A strain-associated contour and focal repair-site pressure relieved by reduction would prioritize recurrent-anatomy assessment."),
    ],
    explanation: "The observed skin response and loss of clothing-provoked burning distinguish that component from the ache reproduced by compression of the contents through the anesthetized field. Urological assessment is warranted for that remaining symptom. This does not prove a particular testicular disorder, exclude every neural contribution or select pain surgery. The burning returns as the block wears off; the deep ache never resolved.",
    claimIds: claim("block-information", "cpip-phenotype", "orchialgia-evaluation", "r2-response-provenance"),
    gate: g("Use the actual sensory effect and loss of superficial provocation to distinguish the contents-compression response from painful skin contact.", "Choose a contents-focused diagnostic evaluation rather than attributing the residual symptom to another cutaneous nerve or the repair site by default.", "Removed the both/neither/some interpretation set and the contradictory both-return chronology. All choices are named diagnostic service pathways with specific targets. A genital-branch pathway is credible because of scrotal radiation, but the acquired response changes the target.", "One next diagnostic evaluation for the unresolved component, not a fixed operation or a definitive pain-mechanism diagnosis.", "Predicted moderate, with independent review still required: the temptation is to extend a nerve explanation to the remaining scrotal symptom after a partially successful block.", "Contents compression reproduces the usual deep ache through a skin field whose pinprick and clothing response have changed.", "If compression ceased to provoke the ache during the skin response and only mapped skin burning later returned, a cutaneous pain-service evaluation would become appropriate; a new reduction-responsive repair-site contour would instead favor hernia assessment.", "Without the block's sensory/provocation record, the initial painful touch would confound the deeper examination. Without the persistent deeper response, the contents referral would lose its discriminator. No generic deep-ache label is treated as proof of a cause.", "Standalone v2 with a new male finite profile. The returned treatment-interval companion is parked; its timing answer is not rehearsed here."),
  }),
  revised("new-component-ultrasound", {
    currentUpdate: "Victor's earlier superficial burning briefly improved after a specialist block. A different pressure now accompanies a contour during lifting. The outside sonographer's signed acquisition worksheet records the adductor origin at the pubic insertion, supine with resisted adduction; that maneuver reproduced medial-thigh discomfort. The stored cine loops correspond to that worksheet. In Victor's lifting video, the contour appears higher in the groin and withdraws when he lies down.",
    stem: "Which investigation should next assess Victor's lifting-related contour?",
    choices: [
      c("mri", "Dynamic MRI of the groin during strain", false, "MRI can assess persistent groin uncertainty, but the supplied record concerns a different anatomical target and provoked symptom; it is not a completed first groin assessment of this event.", "Treat the label ultrasound as proof that a relevant groin acquisition already occurred.", "A complete, properly targeted dynamic groin study capturing the event without a sac could support cross-sectional assessment.", timing("mri")),
      c("ultrasound", "Dynamic ultrasound of the groin during strain", true, "The worksheet, cine provenance and symptom location must be interpreted together. They document an attachment examination, while the current contour calls for targeted dynamic groin assessment.", "Identify what was actually acquired rather than infer adequacy from the modality name.", "If the same current event had already been adequately acquired at the correct groin target, repeating ultrasound without a new acquisition question would be less useful.", timing("ultrasound")),
      c("ct", "Contrast CT of the groin and pelvis", false, "CT is a possible later anatomical alternative, especially when MRI cannot be performed, but the initial targeted groin investigation remains unresolved by this attachment acquisition.", "Skip the relevant initial groin assessment because another ultrasound report exists.", "Persistent uncertainty after a properly acquired groin examination with MRI not possible could support CT.", timing("ct")),
    ],
    explanation: "The signed acquisition and its cine record assess the adductor insertion and reproduce a different symptom. That record does not establish a negative examination of the new dynamic contour. Targeted dynamic groin ultrasound is appropriate before escalating an as-yet-unanswered groin question or returning to the old cutaneous-pain explanation.",
    gate: g("Reconcile the actual anatomical target and provoked symptom in the signed acquisition with the new contour's site and behavior.", "Select the relevant first dynamic groin study rather than assuming a generic prior ultrasound settles the question or requires immediate cross-sectional escalation.", "Removed the explicit no-acquisition statement and the unusually detailed key. All three labels contain comparable modality/region/protocol detail; every test has a wait profile. The signed worksheet establishes performance, rather than absence of exported images being mistaken for an unperformed scan.", "Next investigation of the new contour; three real imaging paths at the diagnostic stage.", "Predicted fair moderate: the prior block and ultrasound are plausible anchors, but their actual symptom and acquisition provenance differ from the current problem.", "The recorded acquisition is an adductor insertion examination reproducing medial-thigh discomfort, whereas the new higher contour occurs with loading and recedes supine.", "Replace the worksheet and cine with a complete dynamic study at the symptomatic groin site during the contour event: further cross-sectional assessment becomes reasonable.", "Deleting target/provocation provenance makes initial ultrasound versus escalation uncertain. The old block response is relevant to resisting attribution of the newly distinct event to the older symptom.", "Standalone v2. The exact PASS posterior-recurrence question is salvaged separately without changing its words or supplying its anatomical answer here."),
  }),
  revised("anterior-recurrence-plane", {
    currentUpdate: "Nolan's dynamic study shows a reducing medial recurrence that interrupts usual lifting. The archived operative note describes flat mesh placed on the inguinal floor, the cord running superficial to it, and the external oblique closed over both. His other operation was a laparoscopic cholecystectomy. The consulting team regularly performs each offered technique.",
    stem: "Which repair should be planned for Nolan's symptomatic recurrent groin hernia?",
    choices: [
      c("lichtenstein", "Lichtenstein mesh repair", false, "The detailed note places the old mesh in the anterior compartment. Repeating that compartment is not the preferred offered strategy for this recurrence.", "Choose a familiar repair without locating the prior mesh.", "A previous posterior TEP/TAPP repair would favor an anterior Lichtenstein approach."),
      c("tep", "Totally extraperitoneal mesh repair", true, "The tissue relationships identify a prior anterior mesh repair. TEP is the offered posterior alternative for recurrence after that repair.", "Infer the prior compartment from its layers, then choose the different offered plane.", "A prior mesh lying between transversalis fascia and peritoneum would instead favor an anterior approach."),
      c("shouldice", "Shouldice tissue repair", false, "Changing from mesh to tissue does not change the fact that this offered operation reenters the previously operated anterior region.", "Confuse repair material with the compartment being entered.", "A selected primary inguinal hernia with an informed non-mesh choice could support expert Shouldice repair."),
    ],
    explanation: "The cord and external oblique lie superficial to the old mesh on the inguinal floor, identifying an anterior repair. The offered TEP uses the posterior compartment for this recurrence. Cholecystectomy does not describe a prior pelvic dissection. This comparison does not rank TEP above TAPP or every other posterior technique.",
    gate: g("Locate the old mesh from the floor, cord and external-oblique relationships without a supplied anterior/preperitoneal conclusion.", "Select the offered posterior repair rather than reentering the old plane or mistaking tissue repair for a different compartment.", "Removed the explicit no-preperitoneal-repair clause and the repeated Open anterior distractor prefixes. All labels use natural procedure names. Other surgical history is specific rather than an answer-specific permission sentence.", "Elective recurrence repair selection, three named operations.", "Predicted fair moderate after cue repair; no claim of a new hard or independent PASS classification.", "The old mesh is on the floor with the cord and external oblique superficial to it.", "Place old mesh between transversalis fascia and peritoneum: Lichtenstein becomes the preferred offered route. Material substitution alone does not change this plane inference.", "Deleting the operative tissue relationships makes the chosen route indeterminate; the unrelated abdominal operation prevents a hidden prior pelvic constraint without naming the keyed unused plane.", "Standalone v2. The returned mesh-weight companion is parked rather than retained in a mixed case."),
  }),
  revised("acute-reduction-selection", {
    currentUpdate: "The outside surgical service documents that Noah's previously reducing inguinal lump first remained out during lifting at 07:30. At the hospital examination at 10:00 that morning, discomfort remains localized and has not intensified. Skin color is unchanged, the abdomen is soft without guarding, and he has no vomiting or systemic deterioration. He is being evaluated by the hospital surgical team.",
    stem: "Which initial hospital plan is most appropriate for Noah's groin episode?",
    choices: [
      c("explore", "Proceed to operative groin exploration", false, "Exploration is required when ischemia is suspected or a reduction attempt fails. The recent unchanged course and present examination support considering a gentle attempt first.", "Equate the loss of reducibility with proven strangulation.", "Progressive continuous pain, skin discoloration, guarding or a failed attempt would favor operative exploration."),
      c("reduce", "Attempt gentle manual reduction", true, "The newly irreducible hernia has a concrete recent course without a clinical pattern suggesting bowel compromise. Guidance supports considering gentle reduction by the hospital team.", "Use the actual evolution and examination to distinguish irreducibility from suspected ischemia.", "A concerning evolving examination would change the plan to emergency operative assessment; the observed interval is not a universal time cutoff."),
      c("ct", "Obtain contrast-enhanced abdominal and pelvic CT", false, "CT can help when diagnosis or bowel compromise remains uncertain, but this documented inguinal episode and reassuring recent examination support an initial reduction attempt rather than routine imaging before every attempt.", "Require a scan to make an already clinically established acute groin episode actionable.", "An atypical or equivocal examination with unresolved concern about anatomy or bowel compromise could justify CT assessment.", timing("ct")),
    ],
    explanation: "The observed loss of reducibility is recent, and pain, skin and abdominal findings do not currently suggest strangulation. A gentle reduction attempt is defensible in the hospital surgical setting. A failed attempt or emerging ischemic concern requires emergency surgery. The stated clock times describe this fictional course, not an invented eligibility threshold or a guarantee of viability.",
    claimIds: claim("reduction-selection", "strangulation-action", "perfusion-observation", "r2-ct-uncertainty"),
    gate: g("Interpret the documented onset and unchanged local symptoms alongside the skin, abdominal and systemic findings.", "Distinguish a recent acutely irreducible episode without current ischemia concern from a presentation requiring immediate exploration or additional diagnostic clarification.", "Added actual onset/evaluation times and removed the phrase rehearsing monitored analgesia/rescue. Replaced passive overnight deferral with a real imaging competitor; no exact elapsed-time rule is authored.", "Initial hospital action, before intervention or additional imaging; three concrete plans addressing the episode.", "Predicted fair moderate, retaining the review's two-step construction and resolving its chronology/permission issues. A clinician still reviews taxis versus exploration for this exact course.", "Loss of prior reducibility this morning with localized nonprogressive discomfort and no concerning current skin/abdominal/systemic change.", "Replace the stable course with worsening continuous pain and guarding: exploration becomes preferred. Make the anatomical examination genuinely equivocal: CT can become the next diagnostic step.", "Removing onset/evolution recreates the review's missing chronology. Removing the examination makes reduction unsafe to rank; none of the clock values is used as a clinical cutoff.", "Standalone hospital-record question. No recovery/discharge companion is introduced or made to pass by author assertion."),
  }),
  revised("resection-mesh-eligibility", {
    objective: "Classify controlled enteric entry and apply the corresponding permanent-mesh eligibility boundary.",
    currentUpdate: "Andre's outside operative record documents removal of the nonviable trapped bowel and a closed anastomosis. Resection was controlled without enteric spillage. There was no perforation, pus or peritonitis, and circulation remained stable. The surgeon is considering reinforcement of the groin defect.",
    stem: "Which field classification and current permanent-mesh eligibility assessment fit Andre's record?",
    choices: [
      c("clean-eligible", "Clean field; permanent mesh is eligible now", false, "Absence of spillage does not make controlled entry into bowel a clean-field procedure. Mesh eligibility is reasonable, but the field classification is wrong.", "Use no visible contamination as a synonym for no enteric entry.", "Repair involving viable contents without bowel entry or resection could be a clean field in which permanent mesh is eligible."),
      c("controlled-ineligible", "Clean-contaminated field; permanent mesh is not eligible now", false, "The field is correctly classified, but controlled resection in this stable, nonspilled field does not itself make permanent mesh ineligible for the current repair.", "Correctly classify enteric entry but prohibit mesh merely because bowel was resected.", "The same field with severe instability requiring staged source management could preclude definitive reinforcement now; that instability is not present here."),
      c("controlled-eligible", "Clean-contaminated field; permanent mesh is eligible now", true, "Controlled bowel resection without gross spillage is clean-contaminated. Current guidance permits considering macroporous permanent synthetic mesh in this setting rather than automatically excluding it.", "Interpret actual enteric entry and contamination before deciding eligibility.", "Removing bowel entry would change the field to clean. Gross spillage with a small directly closable defect would change the repair-material comparison toward tissue repair."),
      c("clean-ineligible", "Clean field; permanent mesh is not eligible now", false, "Neither the clean-field label nor current mesh ineligibility follows from this stable controlled resection record.", "Misclassify no-spillage resection and still impose a blanket implant prohibition.", "A genuinely clean procedure in a patient who has declined an implant would not permit mesh use now, but neither condition describes this record."),
    ],
    explanation: "Controlled entry and resection of bowel without gross spillage make the represented field clean-contaminated rather than clean. Macroporous permanent synthetic mesh remains an eligible option; bowel resection is not an automatic prohibition. This is an eligibility judgment with weak supporting evidence, not a claim that mesh must be chosen over every tissue repair or that it carries no infection risk.",
    claimIds: claim("mesh-clean-contaminated", "mesh-gross-spillage", "r2-controlled-enteric-entry", "mesh-tissue"),
    gate: g("Separate controlled bowel entry without spillage from an operation with no enteric entry.", "Apply the clean-contaminated eligibility boundary without converting permissive weak evidence into a mandatory operation.", "Replaced allow/restrict/defer scope mismatches with a four-cell classification/policy comparison. Both field labels and both policy components occur twice; there is no majority or sole-permissive-key cue. Each option addresses the same classification-linked eligibility decision.", "Integrated operative-field interpretation and material eligibility, not a ranking of mesh versus tissue operations.", "Predicted moderate: no-spillage equals clean and any-resection forbids-mesh are separate credible errors.", "Controlled bowel resection/anastomosis occurred without gross spillage, perforation or peritonitis, in stable circulation.", "Remove enteric entry: clean field with mesh eligibility fits. Add gross spillage and a small closable defect: primary tissue repair becomes the supported comparison. Instability would introduce a separate staged-management reason.", "Removing actual bowel entry makes the two field labels indistinguishable; removing contamination and stability makes material eligibility underdetermined. The field is not labelled before the task.", "Standalone v2. The exact PASS partial-wall urgency item is salvaged without a returned companion; its explanation teaches no material policy."),
  }),
  revised("local-anesthesia-selection", {
    conceptId: "concept.hernia-groin.retropubic-history-repair-anesthesia.v1",
    previousConceptId: "concept.hernia-groin.frail-open-local-anesthesia.v1",
    identityReason: "New meaning: infer prior pelvic dissection and select a repair/anesthesia strategy, rather than eliminate anesthetic options from pulmonary disease and a prior spinal complication. Preserve the old identity/history.",
    objective: "Use a prior pelvic operative record to individualize primary groin repair and its anesthetic approach.",
    currentUpdate: "Evan has a primary reducing inguinal hernia that limits walking. He remains active without a cardiopulmonary limitation and follows instructions throughout the supine examination. An earlier prostate-cancer operative note describes dissection behind the pubic bone to the prostatic apex and creation of a vesicourethral anastomosis. The consulting surgeons regularly perform the offered repair and anesthesia combinations.",
    stem: "Which repair and anesthetic plan should be favored for Evan's symptomatic primary inguinal hernia?",
    choices: [
      c("open-general", "Lichtenstein mesh repair with general anesthesia", false, "The anterior route is reasonable after the prior pelvic dissection, but experienced local anesthesia is the favored approach for a cooperative patient undergoing a reducing open repair.", "Correct the repair route but default to general anesthesia for every operation.", "Inability to cooperate with the local technique could make general anesthesia the appropriate open-repair plan."),
      c("tep-general", "Totally extraperitoneal mesh repair with general anesthesia", false, "A fit patient may often be considered for laparo-endoscopic repair, but this prior operation entered the retropubic/pelvic region relevant to tailoring that approach.", "Apply the usual primary laparo-endoscopic preference without interpreting the old pelvic operation.", "Without prior pelvic/prostatic dissection, an experienced team's laparo-endoscopic repair could become the favored primary option."),
      c("open-local", "Lichtenstein mesh repair with local infiltration", true, "The prior prostate operation involved pelvic/retropubic dissection, a circumstance in which an anterior open approach can be favored. Experienced local anesthesia is supported for a cooperative patient with a reducing open inguinal repair.", "Combine actual prior operative anatomy with the supported anesthetic choice for the resulting open plan.", "Without the pelvic history, a laparo-endoscopic plan could be favored; if cooperation were not possible, the open general-anesthesia option could become appropriate."),
    ],
    explanation: "The old operation used the retropubic/pelvic region, so primary-repair advice must be individualized rather than automatically applying the usual laparo-endoscopic preference. An offered anterior Lichtenstein repair is reasonable, and experienced local infiltration is favored for this cooperative reducing open-repair patient. Prior prostate surgery is not an absolute ban on expert laparoscopy, and neither general nor spinal anesthesia is universally contraindicated.",
    claimIds: claim("local-open", "tailored-approach", "r2-pelvic-history-plan"),
    gate: g("Interpret the old note's retropubic dissection and urinary reconstruction as relevant prior pelvic/prostatic surgery rather than treating fitness as the only approach criterion.", "Individualize the repair route, then choose the supported anesthetic plan for the cooperative reducing open-repair scenario.", "Removed severe pulmonary disease and prior spinal retention, eliminating the one-fact-per-anesthetic ladder. All options are concrete complete repair/anesthetic combinations with comparable detail. The majority combination of components assembles the open-general distractor, not the key.", "One current repair/anesthetic plan at elective planning, using clinically real combinations.", "Predicted fair moderate rather than a claimed hard item: a healthy active patient tempts routine TEP, while the open-general alternative correctly addresses the plane but misses the preferred local technique.", "The prior note documents retropubic/pelvic dissection, and current behavior supports a cooperative open local technique.", "Remove the pelvic dissection history: routine primary laparo-endoscopic preference can favor TEP. Make cooperation impossible: open general anesthesia becomes appropriate.", "Removing prior operative anatomy changes the route comparison; removing cooperation changes local feasibility. The prior pulmonary/spinal adverse-effect details were removed because they supplied a simple elimination ladder.", "Standalone v2 with no anesthesia-answer scaffold in a preceding question. The original frail-patient meaning is retained in history and not overwritten."),
  }),
];

const passSlugs = new Set<string>(HERNIA_GROIN_TOPIC_PASS_SLUGS);
const revisedBySlug = new Map(HERNIA_GROIN_TOPIC_REVISION_NODES.map(item => [item.slug, item]));
const parkBySlug = new Map(HERNIA_GROIN_TOPIC_PARKS.map(item => [item.slug as string, item]));

export const HERNIA_GROIN_TOPIC_ITEM_STATUSES = HERNIA_GROIN_TOPIC_V1_NODES.map(item => ({
  reviewedQuestionVariantId: herniaGroinQuestionId(item.slug),
  reviewedNodeId: herniaGroinNodeId(item.slug),
  status: passSlugs.has(item.slug) ? "pass-preserved" as const : revisedBySlug.has(item.slug) ? "revised" as const : "parked" as const,
  currentQuestionVariantId: passSlugs.has(item.slug) ? herniaGroinQuestionId(item.slug) : revisedBySlug.has(item.slug) ? herniaGroinQuestionId(item.slug, 2) : null,
  clinicalReviewStatus: "needs_clinician_review" as const,
  independentReview: passSlugs.has(item.slug) ? "PASS_exact_v1" : "no_PASS_for_new_version",
  park: parkBySlug.get(item.slug) ?? null,
}));

/** Current owner-review candidates; parked items and all superseded versions stay in V1 exports. */
export const HERNIA_GROIN_TOPIC_NODES: TopicNode[] = HERNIA_GROIN_TOPIC_V1_NODES.flatMap(item =>
  passSlugs.has(item.slug) ? [structuredClone(item)] : revisedBySlug.has(item.slug) ? [revisedBySlug.get(item.slug)!] : []);

export const HERNIA_GROIN_TOPIC_PASS_CASES: SyntheticClinicalCase[] = HERNIA_GROIN_TOPIC_V1_CASES
  .filter(item => item.decisionNodes.some(n => HERNIA_GROIN_TOPIC_PASS_SLUGS.some(slug => n.questionVariantId === herniaGroinQuestionId(slug))))
  .map(item => {
    const exact = structuredClone(item);
    exact.decisionNodes = exact.decisionNodes.filter(n => HERNIA_GROIN_TOPIC_PASS_SLUGS.some(slug => n.questionVariantId === herniaGroinQuestionId(slug)));
    // Remove returned companions; preserve all scored/display wording and the exact header/profiles.
    exact.learningSummary = exact.decisionNodes.map(n => n.explanation).join("\n");
    const final = exact.decisionNodes[exact.decisionNodes.length - 1]!;
    if (final.terminalDispositions.length === 0) {
      const reviewedQuestion = HERNIA_GROIN_TOPIC_V1_QUESTIONS.find(q => q.id === final.questionVariantId)!;
      // Standalone termination metadata reuses exact reviewed labels/rationales; no scored wording is revised.
      final.terminalDispositions = final.answerChoices.filter(choice => !choice.isCorrect).map(choice => ({
        answerChoiceId: choice.id, kind: "no_terminal_outcome" as const,
        consequenceNarrative: `The teaching record selected ${choice.label}.`,
        clinicalRationale: reviewedQuestion.answerChoices.find(answer => answer.id === choice.id)!.distractorRationale!,
        sourceLabels: [...final.sourceLabels],
      }));
    }
    return exact;
  });

type CurrentTopicCase = TopicCase & {
  version: number; previousCaseId: string; reviewDisposition: "pass-preserved" | "revised";
};
const revisionCase = (item: TopicNode): CurrentTopicCase => {
  const old = HERNIA_GROIN_TOPIC_V1_CASE_DEFINITIONS.find(c => c.nodes.some(n => n.slug === item.slug))!;
  const name = item.slug === "marked-femoral-repair" ? "Elliot Ortiz" : item.slug === "partial-block-response" ? "Marek Lewis" : old.name;
  const sex = item.slug === "marked-femoral-repair" || item.slug === "partial-block-response" ? "Male" as const : old.sex;
  const introduction = item.slug === "partial-block-response" ? " He brings records of pain after a right open inguinal repair." : "";
  return {
    ...structuredClone(old), slug: `r2.${item.slug}`, name, sex, version: 2,
    previousCaseId: herniaGroinCaseId(old.slug), reviewDisposition: "revised",
    presentation: `${name}, a ${old.age}-year-old ${sex === "Male" ? "man" : "woman"}, ${old.frame === "outside_records_in_clinic" ? "is the named patient in an outside-hospital chart review requested at the surgery clinic." : "attends the surgery clinic for groin evaluation."}${introduction}`,
    nodes: [item],
  };
};

export const HERNIA_GROIN_TOPIC_REVISED_CASE_DEFINITIONS = HERNIA_GROIN_TOPIC_REVISION_NODES.map(revisionCase);
export const HERNIA_GROIN_TOPIC_CASE_DEFINITIONS: CurrentTopicCase[] = [
  ...HERNIA_GROIN_TOPIC_V1_CASE_DEFINITIONS.filter(c => c.nodes.some(n => passSlugs.has(n.slug))).map(c => ({
    ...structuredClone(c), nodes: c.nodes.filter(n => passSlugs.has(n.slug)).map(n => structuredClone(n)),
    version: 1, previousCaseId: herniaGroinCaseId(c.slug), reviewDisposition: "pass-preserved" as const,
  })),
  ...HERNIA_GROIN_TOPIC_REVISED_CASE_DEFINITIONS,
];

export const HERNIA_GROIN_TOPIC_REVISED_QUESTIONS: Array<QuestionVariant & { shuffleAnswers: true }> = HERNIA_GROIN_TOPIC_REVISION_NODES.map(item => ({
  ...HERNIA_GROIN_TOPIC_REVISION_DRAFT, id: herniaGroinQuestionId(item.slug, 2), conceptId: item.conceptId,
  stem: item.stem, shuffleAnswers: true,
  answerChoices: item.choices.map(choice => ({ id: herniaGroinChoiceId(item.slug, choice.id, 2), label: choice.label,
    isCorrect: choice.isCorrect, rationale: choice.rationale, distractorRationale: choice.isCorrect ? null : choice.rationale })),
  explanation: item.explanation, ...(item.exhibit ? { exhibit: item.exhibit } : {}), supportingEvidenceClaimIds: item.claimIds,
}));
export const HERNIA_GROIN_TOPIC_QUESTIONS = [
  ...HERNIA_GROIN_TOPIC_V1_QUESTIONS.filter(item => HERNIA_GROIN_TOPIC_PASS_SLUGS.some(slug => item.id === herniaGroinQuestionId(slug))).map(item => structuredClone(item)),
  ...HERNIA_GROIN_TOPIC_REVISED_QUESTIONS,
];

const revisionCaseId = (item: CurrentTopicCase) => `case.topic.hernia-groin.${item.slug}.v2`;
export const HERNIA_GROIN_TOPIC_REVISED_CASES: SyntheticClinicalCase[] = HERNIA_GROIN_TOPIC_REVISED_CASE_DEFINITIONS.map(definition => {
  const item = definition.nodes[0]!;
  const labels = sourceLabels(item);
  return {
    id: revisionCaseId(definition), displayName: `Groin review revision: ${item.slug}`,
    patientPresentationVariantId: `presentation.topic.hernia-groin.${definition.slug}.v2`,
    releasePointId: "release.l0.clinic_evaluation", patientDisplayName: definition.name,
    prototypeDemographics: { ageYears: definition.age, sexLabel: definition.sex },
    chiefComplaint: definition.complaint, presentation: definition.presentation,
    approvedInstantiationProfiles: [{ id: `profile.topic.hernia-groin.${definition.slug}.v2`,
      prototypeDemographics: { ageYears: definition.age, sexLabel: definition.sex },
      chiefComplaint: definition.complaint, presentation: definition.presentation }],
    tutorialEligible: false, routineEligible: false, earliestFacilityStage: definition.earliestFacilityStage,
    requiredClinicalSetting: "clinic", requiredCapabilityIds: [], rewardTierId: "reward.clinic_basic", sourceLabels: labels,
    decisionNodes: [{
      id: herniaGroinNodeId(item.slug, 2), questionVariantId: herniaGroinQuestionId(item.slug, 2), primaryConceptId: item.conceptId,
      currentUpdate: item.currentUpdate, stem: item.stem, ...(item.exhibit ? { exhibit: item.exhibit } : {}),
      answerChoices: item.choices.map(choice => ({ id: herniaGroinChoiceId(item.slug, choice.id, 2), label: choice.label, isCorrect: choice.isCorrect, serviceRequest: null })),
      shuffleAnswers: true, showServicePreviews: true, explanation: item.explanation, sourceLabels: labels, resultGateAfter: null,
      terminalDispositions: item.choices.filter(choice => !choice.isCorrect).map(choice => ({
        answerChoiceId: herniaGroinChoiceId(item.slug, choice.id, 2), kind: "no_terminal_outcome" as const,
        consequenceNarrative: `The teaching record selected ${choice.label}.`, clinicalRationale: choice.rationale, sourceLabels: labels,
      })),
    }], learningSummary: item.explanation,
  };
});
export const HERNIA_GROIN_TOPIC_CASES: SyntheticClinicalCase[] = [...HERNIA_GROIN_TOPIC_PASS_CASES, ...HERNIA_GROIN_TOPIC_REVISED_CASES];

export const HERNIA_GROIN_TOPIC_TIMING_PROPOSALS: AnswerChoiceTimingRegistryEntry[] = [
  ...HERNIA_GROIN_TOPIC_V1_TIMING_PROPOSALS.filter(item => HERNIA_GROIN_TOPIC_PASS_SLUGS.some(slug => item.questionVariantId === herniaGroinQuestionId(slug))).map(item => structuredClone(item)),
  ...HERNIA_GROIN_TOPIC_REVISED_CASE_DEFINITIONS.map(definition => {
    const item = definition.nodes[0]!;
    return {
      caseId: revisionCaseId(definition), nodeId: herniaGroinNodeId(item.slug, 2), questionVariantId: herniaGroinQuestionId(item.slug, 2),
      classification: item.choices.some(choice => choice.timing.kind === "test") ? {
        kind: "test_choices" as const, choices: item.choices.map(choice => ({ choiceId: herniaGroinChoiceId(item.slug, choice.id, 2), choiceLabel: choice.label, timing: choice.timing })),
      } : { kind: "no_test" as const },
    };
  }),
];
export const HERNIA_GROIN_TOPIC_ORDER_PROPOSALS = HERNIA_GROIN_TOPIC_TIMING_PROPOSALS.flatMap(entry =>
  entry.classification.kind === "test_choices" ? entry.classification.choices.filter(choice => choice.timing.kind === "test").map(choice => ({
    caseId: entry.caseId, nodeId: entry.nodeId, questionVariantId: entry.questionVariantId,
    choiceId: choice.choiceId, choiceLabel: choice.choiceLabel, timing: choice.timing,
    execution: "planning_only_no_new_order" as const, serviceRequest: null, resultGateAfter: null,
    integrationNote: "Exact-identity estimate only. No new order or result execution is implemented.",
  })) : []);

export const HERNIA_GROIN_TOPIC_AUTHORING_CONCEPTS = HERNIA_GROIN_TOPIC_NODES.map(item => {
  const retained = HERNIA_GROIN_TOPIC_V1_AUTHORING_CONCEPTS.find(c => c.id === item.conceptId);
  if (passSlugs.has(item.slug)) return structuredClone(retained!);
  return {
    ...HERNIA_GROIN_TOPIC_REVISION_DRAFT, id: item.conceptId,
    displayName: item.slug.replaceAll("-", " "), learningObjective: item.objective,
    earliestFacilityStage: 1, educationalTier: 1,
    conceptType: (item.slug.includes("block") || item.slug.includes("ultrasound") ? "workup" : "management") as "workup" | "management",
    previousConceptId: item.previousConceptId, identityReason: item.identityReason, evidenceClaimIds: item.claimIds,
  };
});
export const HERNIA_GROIN_TOPIC_CONCEPTS: TestedConcept[] = HERNIA_GROIN_TOPIC_AUTHORING_CONCEPTS.map(item => ({
  id: item.id, displayName: item.displayName, learningObjective: item.learningObjective,
  earliestFacilityStage: item.earliestFacilityStage, conceptType: item.conceptType,
}));
export const HERNIA_GROIN_TOPIC_IDENTITY_PROPOSALS = HERNIA_GROIN_TOPIC_AUTHORING_CONCEPTS.map(item => ({
  conceptId: item.id, previousConceptId: item.previousConceptId, reason: item.identityReason,
  clinicalReviewStatus: "needs_clinician_review" as const,
  historyPolicy: "Retain all old identities and FSRS history. New meaning versions receive separate history; unchanged constructs retain their identity.",
}));
export const HERNIA_GROIN_TOPIC_COMPOSITION_PROPOSALS = HERNIA_GROIN_TOPIC_CASES.map(clinicalCase => ({
  caseId: clinicalCase.id, nodeIds: clinicalCase.decisionNodes.map(n => n.id), conceptIds: clinicalCase.decisionNodes.map(n => n.primaryConceptId),
  selection: "standalone" as const, setting: "clinic" as const, facilityProgressionLevel: clinicalCase.earliestFacilityStage,
  educationalTier: 1, acuity: HERNIA_GROIN_TOPIC_CASE_DEFINITIONS.find(c => c.reviewDisposition === "pass-preserved" ? herniaGroinCaseId(c.slug) === clinicalCase.id : revisionCaseId(c) === clinicalCase.id)!.acuity,
  requiredFacilityCapabilityIds: [], reviewStatus: "needs_clinician_review" as const,
  editorialStatus: clinicalCase.routineEligible ? "pass-preserved" : "revised-awaiting-review",
  integrationNote: "PASS salvage is self-contained. Revised candidates remain nonroutine until new independent review; no mixed multi-part case is admitted.",
}));
