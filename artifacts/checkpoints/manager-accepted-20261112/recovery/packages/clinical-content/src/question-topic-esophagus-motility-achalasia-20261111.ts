import type { ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
import {
  validateSyntheticClinicalRelease,
  type AnswerChoiceTimingRegistryEntry,
  type CaseExhibit,
  type SyntheticClinicalCase,
  type TestedConcept,
} from "./schema";
import ledger from "../../../docs/research/sources-question-topic-esophagus-motility-achalasia-20261111.json";

export const MOTILITY_TOPIC_SLUG = "esophagus-motility-achalasia";
export const MOTILITY_TOPIC_VERSION = "question-topic-esophagus-motility-achalasia.2026-11-11.v1";
export const MOTILITY_TOPIC_DRAFT = {
  contentVersion: MOTILITY_TOPIC_VERSION,
  reviewStatus: "needs_clinician_review" as const,
  aiAssistedDrafting: true,
  lastClinicianReview: null,
};

export const MOTILITY_TOPIC_REVISION_VERSION = "question-topic-esophagus-motility-achalasia.2026-11-11.v2";
const revisionDraft = { ...MOTILITY_TOPIC_DRAFT, contentVersion: MOTILITY_TOPIC_REVISION_VERSION };
const salvageRevisionDraft = {
  ...MOTILITY_TOPIC_DRAFT,
  contentVersion: "question-topic-esophagus-motility-achalasia.2026-11-11.salvage.v2",
};

interface TopicChoice {
  id: string;
  label: string;
  rationale: string;
  temptation: string;
  correctUnder: string;
  claims: string[];
  timingProfileId?: string;
}

interface AuthorReasoning {
  interpret: string;
  apply: string;
  closestChoice: string;
  decidingObservation: string;
  counterfactual: string;
  counterfactualChoice: string;
  deletionTest: string;
  cueAttack: string;
  stageAudit: string;
  predictedDifficulty: "easy" | "moderate" | "hard";
  difficultyReason: string;
  sequenceAudit: string;
  remainingRisk: string;
}

interface TopicNode {
  version?: 2 | 3;
  revisionStatus?: "revised" | "parked";
  parkReason?: string;
  reviewResponse?: string;
  slug: string;
  conceptId: string;
  previousConceptId?: string;
  identityDecision: "new_meaning" | "new_version" | "reuse";
  identityReason: string;
  conceptType: TestedConcept["conceptType"];
  objective: string;
  creationKind: "Rewrite" | "new";
  replacesInventoryIds: string[];
  task: string;
  currentUpdate: string;
  exhibit?: CaseExhibit;
  correctChoice: string;
  choices: TopicChoice[];
  explanation: string;
  claims: string[];
  reasoning: AuthorReasoning;
}

interface TopicCase {
  version?: 2;
  slug: string;
  name: string;
  age: number;
  sex: "Female" | "Male";
  complaint: string;
  presentation: string;
  mode: "clinic_assessment" | "longitudinal_chart_review_in_clinic";
  nodes: TopicNode[];
}

const concept = (name: string) => `concept.esophagus-motility-achalasia.${name}.v1`;
const claimId = (name: string) => `claim.esophagus-motility-achalasia.${name}`;
const draftFor = (node: TopicNode) => node.version === 3 ? salvageRevisionDraft : node.version === 2 ? revisionDraft : MOTILITY_TOPIC_DRAFT;
const questionId = (node: TopicNode) => `question.topic.esophagus-motility-achalasia.${node.slug}.v${node.version ?? 1}`;
const nodeId = (node: TopicNode) => `node.topic.esophagus-motility-achalasia.${node.slug}.v${node.version ?? 1}`;
const caseId = (item: TopicCase) => `case.topic.esophagus-motility-achalasia.${item.slug}.v${item.version ?? 1}`;
const choiceId = (node: TopicNode, suffix: string) => `choice.topic.esophagus-motility-achalasia.${node.slug}.${node.version ? `v${node.version}.` : ""}${suffix}`;

/** Topic-local proposals require an explicit import. Longitudinal records are
 * reviewed in the clinic. Proposed investigations have estimates and do not
 * execute an order or fabricate a result gate.
 */
export const MOTILITY_TOPIC_REVIEWED_V1_ITEMS: TopicCase[] = [
  {
    slug: "medication-reassessment",
    name: "Nolan Price",
    age: 52,
    sex: "Male",
    complaint: "Swallowing follow-up",
    presentation: "{patientName}, a 52-year-old man, attends clinic to review a junction-myotomy referral and the completed reassessment of his dysphagia.",
    mode: "clinic_assessment",
    nodes: [{
      slug: "opioid-response-decision",
      conceptId: "concept.n2r3.interval-opioid-junction-reassessment.v2",
      previousConceptId: "concept.n2r3.interval-opioid-junction-reassessment",
      identityDecision: "new_version",
      identityReason: "The retained draft chooses the next acquisition during opioid exposure. This version interprets an acquired off-medication response and decides whether the existing myotomy referral remains supported.",
      conceptType: "management",
      objective: "Use actual symptom and pressure changes after coordinated opioid adjustment when deciding whether to retain an achalasia myotomy plan.",
      creationKind: "Rewrite",
      replacesInventoryIds: ["inventory.963404437d80b1a4"],
      task: "What should happen to {patientName}'s proposed junction procedure after this reassessment?",
      currentUpdate: "Endoscopy found no fixed narrowing or mucosal lesion. His pain team completed a supervised oxycodone taper and established a nonopioid pain plan. He now eats his usual meals without hold-up or regurgitation. Both pressure studies used the same laboratory, catheter system and adequate positional protocol.",
      exhibit: {
        kind: "table",
        caption: "Constructed serial pressure-study observations",
        columnHeaders: ["Junction relaxation", "Esophageal-body response"],
        rowHeaders: ["During regular oxycodone", "After the supervised adjustment"],
        cells: [
          ["Above the laboratory reference interval", "Premature or failed responses throughout the separated-swallow series"],
          ["Within the laboratory reference interval in both positions", "Sequential propagated contractions with each separated swallow"],
        ],
      },
      correctChoice: "defer",
      choices: [
        {
          id: "poem",
          label: "Proceed with the planned peroral endoscopic myotomy",
          rationale: "The earlier record supported a spastic outflow phenotype during exposure. Resolution of symptoms and normalization on the adequate repeat study remove the current basis for that procedure.",
          temptation: "Treat the earlier abnormal study as proof of a permanent primary motor disorder.",
          correctUnder: "Persistent symptoms and adequately corroborated primary spastic achalasia remain after reversible contributions are addressed.",
          claims: ["opioid-reassessment", "spastic-achalasia-pattern", "type-three-poem"]
        },
        {
          id: "defer",
          label: "Defer junction myotomy and arrange clinical follow-up",
          rationale: "The actual off-medication course and repeat physiology no longer support a junction-disrupting procedure. Reassess if swallowing symptoms return.",
          temptation: "The action requires integrating acquired function with the exposure-linked pressure change.",
          correctUnder: "Symptoms resolve and an adequate reassessment no longer demonstrates the physiology prompting treatment.",
          claims: ["opioid-reassessment", "hrm-acquisition"]
        },
        {
          id: "dilate",
          label: "Replace the myotomy referral with pneumatic dilation",
          rationale: "Choosing a different junction-disrupting procedure still assumes a persisting obstruction that the current record does not demonstrate.",
          temptation: "Preserve a procedural plan by selecting an apparently smaller intervention.",
          correctUnder: "Persistent symptomatic junction obstruction has been established and dilation is chosen after procedural and rescue-risk assessment.",
          claims: ["opioid-reassessment", "dilation-rescue-risk"]
        },
      ],
      explanation: "The changed exposure, recovered swallowing and adequate repeat physiology support deferring the junction procedure. This individual response informs his current plan. It does not establish that every opioid-associated pressure pattern will normalize.",
      claims: ["opioid-reassessment", "hrm-acquisition", "spastic-achalasia-pattern", "type-three-poem", "dilation-rescue-risk"],
      reasoning: {
        interpret: "Read the exposure-linked serial change while confirming that the two studies are comparable.",
        apply: "Use current symptom and physiologic recovery to withdraw an unsupported junction procedure.",
        closestChoice: "poem",
        decidingObservation: "Usual meals are tolerated and normal propagation and relaxation are now acquired off oxycodone.",
        counterfactual: "If symptoms persist and the adequate repeat remains premature/failed with impaired relaxation after the coordinated adjustment, POEM assessment becomes the best offered plan after corroboration.",
        counterfactualChoice: "poem",
        deletionTest: "The taper record establishes the exposure change. Meal recovery supplies current function. Protocol comparability prevents attributing discordance to technical differences. Removing the repeat data leaves the referral unresolved.",
        cueAttack: "Removed the old task's irreversible-procedure phrase and the mirrored unchanged-opioid qualifier on distractors. All options now decide the same referral after a real completed response. The key names a concrete action, with no generic individualized-treatment label.",
        stageAudit: "Three present decisions about the existing junction procedure. No next-test option competes with a premature treatment.",
        predictedDifficulty: "moderate",
        difficultyReason: "The error is anchoring on a prior spastic study despite changed exposure and current acquired recovery. The normal repeat cannot be ignored merely because the original referral was persuasive.",
        sequenceAudit: "Standalone. No preceding feedback supplies the medication-response decision.",
        remainingRisk: "The recorded N2 REVISE hold remains open on the old exact version. Melissa must confirm this changed-meaning response-based successor and its follow-up wording.",
      },
    }],
  },
  {
    slug: "spastic-course",
    name: "Maya Bennett",
    age: 45,
    sex: "Female",
    complaint: "Painful swallowing",
    presentation: "{patientName}, a 45-year-old woman, attends clinic for review of her swallowing evaluation and subsequent outside foregut records.",
    mode: "longitudinal_chart_review_in_clinic",
    nodes: [
      {
        slug: "spastic-procedure",
        conceptId: concept("subtype-directed-myotomy"),
        previousConceptId: "concept.achalasia.physiology-directed-treatment.v1",
        identityDecision: "new_version",
        identityReason: "The older construct distinguishes a definitive procedure from reflux or palliative drugs. This successor compares definitive procedures using subtype and the spastic body segment.",
        conceptType: "management",
        objective: "Integrate a spastic achalasia pattern and its body extent when selecting an initial definitive procedure.",
        creationKind: "new",
        replacesInventoryIds: ["inventory.ee22e809878d3db9"],
        task: "Which initial procedure is best supported by {patientName}'s evaluation?",
        currentUpdate: "Her initial record documents progressive food-and-liquid dysphagia with swallowing-related pain. Endoscopy and cross-sectional assessment show no junction lesion. She uses no opioids and the anesthesia evaluation permits either endoscopic or laparoscopic myotomy.",
        exhibit: {
          kind: "table",
          caption: "Constructed adequate positional manometry record",
          columnHeaders: ["Observation"],
          rowHeaders: ["Junction", "Body timing", "Body distribution"],
          cells: [
            ["Median relaxation pressure above this laboratory's reference interval in the primary and upright series"],
            ["Most separated swallows generate contractions earlier than the laboratory lower latency reference. The remaining swallows fail."],
            ["No normal propagated sequence occurs. Premature activity extends well above the distal junction."],
          ],
        },
        correctChoice: "poem",
        choices: [
          {
            id: "heller",
            label: "Laparoscopic Heller myotomy with Dor fundoplication",
            rationale: "Surgical myotomy remains a legitimate option. The substantial spastic body component supports a tailored approach and the current SAGES panel favors POEM in this subtype.",
            temptation: "Choose the familiar surgical operation while underweighting the body extent and subtype-specific preference.",
            correctUnder: "A suitable type I/II patient chooses surgical myotomy, or an individualized foregut assessment favors a tailored surgical approach.",
            claims: ["type-three-poem", "type-three-length", "type-one-two-options", "myotomy-partial-wrap"]
          },
          {
            id: "dilation",
            label: "Graded pneumatic dilation of the distal junction",
            rationale: "Dilation is a definitive option in selected achalasia patients, but treating junction resistance with a balloon does not address the demonstrated spastic body extent as a tailored myotomy can.",
            temptation: "Treat every achalasia phenotype as an isolated sphincter problem.",
            correctUnder: "A suitable patient with a nonspastic phenotype chooses dilation after discussion of repeat-treatment and rescue risks.",
            claims: ["type-three-length", "type-three-poem", "dilation-rescue-risk"]
          },
          {
            id: "poem",
            label: "Tailored peroral endoscopic myotomy",
            rationale: "The adequate study has impaired relaxation and premature/failed responses without normal peristalsis. A tailored POEM can include the involved body segment and follows the current SAGES preference for type III.",
            temptation: "The key requires interpreting both junction and body findings before applying the procedure preference.",
            correctUnder: "A suitable adult has a substantial spastic achalasia pattern and an experienced foregut team can plan tailored POEM.",
            claims: ["spastic-achalasia-pattern", "type-three-length", "type-three-poem"]
          },
        ],
        explanation: "Impaired relaxation with premature or failed swallows and absent normal peristalsis supports a spastic achalasia pattern. The body extent makes a tailored myotomy consequential. SAGES favors POEM for this subtype by expert opinion. Tailored Heller myotomy remains a clinically legitimate alternative requiring individual assessment.",
        claims: ["spastic-achalasia-pattern", "type-three-length", "type-three-poem", "type-one-two-options", "myotomy-partial-wrap", "dilation-rescue-risk"],
        reasoning: {
          interpret: "Separate premature activity plus impaired relaxation from distal spasm with normal relaxation or preserved-peristalsis EGJOO.",
          apply: "Use the substantial spastic body component and current subtype-specific guidance to compare definitive procedures.",
          closestChoice: "heller",
          decidingObservation: "The adequate study has no normal peristalsis and premature activity well above the junction.",
          counterfactual: "If a nonspastic pattern replaces the premature body activity, a surgically suitable patient choosing the surgical approach can appropriately receive Heller myotomy with partial fundoplication. POEM would lose its subtype-specific preference.",
          counterfactualChoice: "heller",
          deletionTest: "Structural evaluation and opioid history protect primary-pattern attribution. Body timing and distribution distinguish the procedures. Removing the table removes the subtype-specific reason to favor the key.",
          cueAttack: "The task supplies neither a diagnosis nor a desired myotomy length. All three options are actual definitive procedures. The key's tailored phrase describes the operation and remains a weak potential cue requiring independent review. No categorical failure of Heller is taught.",
          stageAudit: "Three initial definitive procedures with comparable care phase and named techniques.",
          predictedDifficulty: "hard",
          difficultyReason: "The credible error is selecting a familiar Heller or balloon plan without applying the body pattern. Expert-opinion ranking makes exact clinician review important.",
          sequenceAudit: "First chart-review node. Feedback covers the initial subtype and procedure, and omits the later test-selection rule.",
          remainingRisk: "Melissa must confirm POEM over the offered Heller option for this exact extent. ACG accepts tailored Heller and SAGES preference is expert opinion.",
        },
      },
      {
        slug: "recurrent-clearance-test",
        conceptId: concept("postmyotomy-objective-clearance"),
        identityDecision: "new_meaning",
        identityReason: "The assigned bank lacks a scored assessment of recurrent symptoms after myotomy using objective bolus clearance.",
        conceptType: "workup",
        objective: "Choose objective clearance assessment when recurrent symptoms and post-myotomy pressure findings disagree.",
        creationKind: "new",
        replacesInventoryIds: [],
        task: "Which investigation should next assess {patientName}'s recurrent symptoms after POEM?",
        currentUpdate: "The later record documents POEM followed by a period of comfortable eating. Food now pauses and fluid returns at night. Repeat manometry shows junction relaxation within the laboratory interval and no residual premature contractions. Her weight and oral hydration are maintained.",
        correctChoice: "barium",
        choices: [
          {
            id: "hrm",
            label: "Repeat positional high-resolution esophageal manometry",
            rationale: "The adequate repeat pressure study has answered the residual spasm and relaxation questions. Another pressure study will not directly establish the degree of retained bolus.",
            temptation: "Use a normal relaxation value as the sole treatment-success measure or repeat it when symptoms disagree.",
            correctUnder: "The prior pressure acquisition is technically inadequate or a new question about residual spasm or relaxation remains.",
            claims: ["post-treatment-tbe", "hrm-acquisition", "recurrence-mechanisms"],
            timingProfileId: "timing.test.esophageal_manometry"
          },
          {
            id: "barium",
            label: "Upright timed barium esophagography with tablet passage",
            rationale: "The current uncertainty is actual clearance despite improved relaxation measurements. Timed barium testing is the guideline-supported first objective assessment of recurrent post-treatment symptoms.",
            temptation: "The key depends on recognizing that pressure relaxation and bolus clearance are different observations.",
            correctUnder: "Persistent or recurrent symptoms after definitive achalasia therapy require objective emptying assessment.",
            claims: ["barium-clearance", "tablet-obstruction", "post-treatment-tbe", "myotomy-limit"],
            timingProfileId: "timing.test.contrast_swallow"
          },
          {
            id: "ph",
            label: "Ambulatory esophageal pH-impedance reflux monitoring",
            rationale: "Reflux is a real alternative after POEM. Clearance assessment should first characterize the food-and-fluid hold-up in this recurrent swallowing presentation, with reflux evaluation as indicated by the resulting assessment.",
            temptation: "Attribute nocturnal fluid return directly to reflux after POEM.",
            correctUnder: "Clearance has been adequately assessed and the unresolved question is whether symptoms correlate with pathologic reflux.",
            claims: ["objective-postpoem-reflux", "post-treatment-tbe"],
            timingProfileId: "timing.test.ambulatory_reflux_monitoring"
          },
        ],
        explanation: "A lower junction relaxation pressure does not establish emptying. Assess the recurrent symptoms with timed barium clearance and integrate the result with the rest of the foregut evaluation. This result is still pending at this point in the chart review.",
        claims: ["post-treatment-tbe", "barium-clearance", "tablet-obstruction", "hrm-acquisition", "myotomy-limit", "recurrence-mechanisms", "objective-postpoem-reflux"],
        reasoning: {
          interpret: "Identify the discordance between recurrent retention-like symptoms and improved pressure findings.",
          apply: "Choose a direct clearance assessment instead of equating normalized relaxation with treatment success.",
          closestChoice: "ph",
          decidingObservation: "Food pauses with nocturnal return despite an adequate manometry showing improved junction relaxation.",
          counterfactual: "If adequate emptying is already documented and the remaining complaint is burning with uncertain reflux correlation, pH-impedance becomes the relevant offered study.",
          counterfactualChoice: "ph",
          deletionTest: "Prior response establishes recurrence. Normal relaxation prevents automatic repetition of a diagnostic test. The current symptom pattern establishes the clearance question. Deleting the update leaves no reason for post-treatment testing.",
          cueAttack: "Three specific studies each receive a timing proposal. No task word repeats barium or emptying. The key is not uniquely cautious or uniquely estimated. Reflux remains credible after POEM.",
          stageAudit: "Three investigations at the same reassessment stage, each with acquisition-specific identity and wait metadata.",
          predictedDifficulty: "moderate",
          difficultyReason: "The resident must resist both normal-IRP reassurance and immediate reflux attribution after an effective initial myotomy.",
          sequenceAudit: "Earlier feedback identifies a subtype-specific initial procedure and never states the post-treatment test rule. The later clearance and mucosal results are not visible yet.",
          remainingRisk: "The contrast-swallow profile is an existing placeholder. Manager must preserve the full timed-series scope when registering its estimate.",
        },
      },
      {
        slug: "postpoem-reflux-response",
        conceptId: concept("postmyotomy-inflammation-versus-obstruction"),
        identityDecision: "new_meaning",
        identityReason: "This consequence-of-myotomy construct distinguishes objective inflammation with adequate clearance from recurrent junction obstruction. Coordinate its boundary with the GERD worker.",
        conceptType: "complication",
        objective: "Use clearance and mucosal findings to choose treatment for symptoms mistakenly attributed to recurrent outflow obstruction.",
        creationKind: "new",
        replacesInventoryIds: [],
        task: "Which treatment should now address {patientName}'s post-POEM symptoms?",
        currentUpdate: "The subsequent timed examination shows prompt liquid clearance and tablet passage into the stomach. Endoscopy shows distal erosive esophagitis, with no retained food or fixed narrowing. She reports burning and sour fluid return and is taking no acid-suppressive medicine.",
        correctChoice: "ppi",
        choices: [
          {
            id: "dilation",
            label: "Arrange pneumatic dilation of the junction",
            rationale: "Symptoms after POEM can reflect residual outflow resistance, but the acquired clearance and endoscopic findings favor mucosal reflux injury in this record.",
            temptation: "Treat every recurrent post-myotomy symptom by further disrupting the junction.",
            correctUnder: "Objective reassessment demonstrates recurrent junction obstruction and the patient is suitable for dilation and rescue.",
            claims: ["recurrence-mechanisms", "barium-clearance", "dilation-rescue-risk"]
          },
          {
            id: "ppi",
            label: "Start oral omeprazole and reassess symptoms",
            rationale: "Objectively documented erosive injury with effective clearance supports acid suppression before another junction procedure.",
            temptation: "The key requires reconciling the normal passage findings with the abnormal mucosa rather than relying on the symptom label.",
            correctUnder: "Post-myotomy reflux injury is documented and there is no acquired evidence of recurrent obstructive retention.",
            claims: ["confirmed-reflux-treatment", "objective-postpoem-reflux", "barium-clearance"]
          },
          {
            id: "redo",
            label: "Arrange repeat peroral endoscopic myotomy",
            rationale: "A repeat myotomy may address an incomplete prior myotomy. The present studies do not show that target, while esophagitis supplies a treatable competing cause.",
            temptation: "Anchor on the original motor diagnosis despite a new objective cause for the symptoms.",
            correctUnder: "Comprehensive reassessment identifies persistent obstructive physiology from an inadequate myotomy and a foregut team selects redo POEM.",
            claims: ["recurrence-mechanisms", "objective-postpoem-reflux", "confirmed-reflux-treatment"]
          },
        ],
        explanation: "The acquired clearance and endoscopic findings redirect treatment toward reflux injury. Oral omeprazole is the appropriate offered initial treatment. Further junction disruption requires a persisting obstructive target, which this reassessment has not demonstrated.",
        claims: ["confirmed-reflux-treatment", "objective-postpoem-reflux", "recurrence-mechanisms", "barium-clearance", "dilation-rescue-risk"],
        reasoning: {
          interpret: "Combine effective passage with erosive mucosal injury to distinguish a post-treatment complication from recurrent outflow obstruction.",
          apply: "Select acid suppression instead of another junction-disrupting procedure.",
          closestChoice: "dilation",
          decidingObservation: "Prompt liquid and tablet passage coexist with distal erosive esophagitis.",
          counterfactual: "Persistent retention and tablet hold-up at a poorly opening junction with no erosive lesion would redirect assessment toward an obstructive target and could support dilation after specialist review.",
          counterfactualChoice: "dilation",
          deletionTest: "Clearance distinguishes the motor-treatment target. Endoscopy identifies the new cause. Current medication status establishes an initial treatment opportunity. Without these acquired findings the prior node still calls for evaluation.",
          cueAttack: "The task says post-POEM symptoms and never calls them reflux. Each option is a named current treatment. The PPI is the only medicine because the clinically credible errors are repeat procedures. That category difference is a residual review concern rather than a claimed cue-free guarantee.",
          stageAudit: "Three present treatments for recurrent post-myotomy symptoms. All investigations are already completed.",
          predictedDifficulty: "moderate",
          difficultyReason: "The intended difficulty is changing a motor-treatment plan when objective clearance and a new mucosal finding disagree with the original diagnosis.",
          sequenceAudit: "Prior feedback gives no PPI answer and no esophagitis result. The new endoscopy changes the action. The learner cannot infer this key from the previous pressure record alone.",
          remainingRisk: "GERD ownership overlaps the consequence-of-myotomy scope. Manager must coordinate placement. Melissa must confirm exact PPI and repeat-intervention ranking.",
        },
      },
    ],
  },
  {
    slug: "limited-rescue-fitness",
    name: "Ruth Ellis",
    age: 81,
    sex: "Female",
    complaint: "Meals sticking",
    presentation: "{patientName}, an 81-year-old woman, attends clinic because food and drinks pause behind the sternum and increasingly limit her meals.",
    mode: "clinic_assessment",
    nodes: [{
      slug: "botulinum-rescue-risk",
      conceptId: concept("symptom-relief-with-limited-rescue-fitness"),
      identityDecision: "new_meaning",
      identityReason: "No assigned variant tests why an apparently less invasive pneumatic dilation can remain unsuitable when perforation rescue is prohibitive.",
      conceptType: "management",
      objective: "Integrate documented outflow physiology and procedural rescue risk when selecting initial symptom relief.",
      creationKind: "new",
      replacesInventoryIds: [],
      task: "Which initial procedure best fits {patientName}'s swallowing findings and perioperative assessment?",
      currentUpdate: "Endoscopy and cardia imaging show no structural lesion. Adequate manometry shows failed body contractions with impaired junction relaxation, and the timed contrast study retains liquid above the junction. She has oxygen-dependent lung disease. The anesthesia record considers a brief sedated endoscopy acceptable but describes prolonged general anesthesia and a major rescue operation as prohibitive.",
      correctChoice: "botox",
      choices: [
        {
          id: "dilation",
          label: "Endoscopic pneumatic dilation of the junction",
          rationale: "Dilation can provide durable relief in suitable patients, but its perforation risk requires a viable rescue plan. The anesthetic assessment is consequential even though the primary treatment is endoscopic.",
          temptation: "Equate an endoscopic intervention with freedom from major rescue risk.",
          correctUnder: "The patient is suitable for dilation and could undergo rescue repair if perforation occurs.",
          claims: ["dilation-rescue-risk", "botulinum-unfit"]
        },
        {
          id: "botox",
          label: "Endoscopic botulinum toxin injection at the sphincter",
          rationale: "This is a guideline-supported symptom-relief option when definitive treatments are unsuitable. Its usually temporary benefit must be weighed against the documented procedural and rescue risks.",
          temptation: "The key requires considering the consequence of a complication, not just the planned route of the procedure.",
          correctUnder: "Established achalasia causes symptoms in a patient unsuitable for definitive junction therapies.",
          claims: ["botulinum-unfit", "dilation-rescue-risk"]
        },
        {
          id: "poem",
          label: "Endoscopic peroral myotomy of the distal junction",
          rationale: "POEM is a definitive treatment with a greater anesthetic and complication-management burden than the limited sedated intervention described here.",
          temptation: "Select a durable endoscopic therapy while treating the anesthesia findings as relevant only to laparoscopy.",
          correctUnder: "A fully assessed patient can tolerate definitive myotomy and its complication management.",
          claims: ["botulinum-unfit", "type-one-two-options"]
        },
      ],
      explanation: "The motor and clearance findings support a junction-relaxation disorder, but treatment selection also depends on anesthesia and rescue risk. Botulinum toxin is the appropriate offered initial symptom-relief option for this risk profile. Age alone does not determine that choice.",
      claims: ["botulinum-unfit", "dilation-rescue-risk", "type-one-two-options", "hrm-acquisition", "barium-clearance"],
      reasoning: {
        interpret: "Recognize established symptomatic outflow physiology after structural evaluation.",
        apply: "Assess the full procedural and rescue burden before selecting an endoscopic treatment.",
        closestChoice: "dilation",
        decidingObservation: "A brief sedated procedure is acceptable but major perforation rescue and prolonged anesthesia are prohibitive.",
        counterfactual: "If the same physiology occurs in someone who can tolerate definitive therapy and perforation rescue and who chooses a dilation strategy, pneumatic dilation becomes a reasonable offered option over temporary injection.",
        counterfactualChoice: "dilation",
        deletionTest: "The acquired motor and retention findings establish the target. The anesthesia assessment separates three otherwise relevant endoscopic procedures. Age is patient context and is not a cutoff.",
        cueAttack: "Every label is an endoscopic intervention with comparable specificity. The clinical risk assessment is necessary and is given once. Removed an explicit author-written declaration that she is ineligible for definitive therapy. No exact comorbidity cutoff is invented.",
        stageAudit: "Three initial junction-directed procedures. The comparison is not diagnostic workup versus treatment.",
        predictedDifficulty: "moderate",
        difficultyReason: "The closest error is recommending pneumatic dilation because it avoids the planned laparoscopic operation while overlooking its rescue requirement.",
        sequenceAudit: "Standalone. Temporary benefit is explained after the choice and supplies no later key.",
        remainingRisk: "Melissa must confirm the exact anesthesia-risk presentation and procedure comparison. The assessment is a constructed individual clinical record.",
      },
    }],
  },
  {
    slug: "preserved-peristalsis",
    name: "Owen Clark",
    age: 58,
    sex: "Male",
    complaint: "Food sticking",
    presentation: "{patientName}, a 58-year-old man, attends clinic with intermittent food-and-liquid hold-up after endoscopy and mucosal sampling found no explanatory lesion.",
    mode: "clinic_assessment",
    nodes: [{
      slug: "egjoo-supportive-study",
      conceptId: concept("egjoo-corroboration"),
      identityDecision: "new_meaning",
      identityReason: "Existing EGJOO appears as a diagnostic foil. This new construct scores the additional evidence needed to establish its clinical relevance.",
      conceptType: "workup",
      objective: "Distinguish a retained-peristalsis pressure pattern from conclusive achalasia and choose a complementary obstruction assessment.",
      creationKind: "new",
      replacesInventoryIds: [],
      task: "Which additional investigation should inform {patientName}'s junction-treatment assessment?",
      currentUpdate: "An adequate junction-crossing study has elevated median relaxation pressure in both positions. Propagated contractions follow most swallows, and intrabolus pressure is raised in most supine swallows. The symptom episodes occur during the study. He takes no opioids and has no prior foregut operation.",
      correctChoice: "barium",
      choices: [
        {
          id: "repeat",
          label: "Repeat the routine positional water-swallow manometry study",
          rationale: "The existing acquisition is adequate. Repeating the same pressure protocol does not add the independent emptying evidence needed to establish the observed pattern's clinical relevance.",
          temptation: "Treat a second similar manometry result as independent corroboration of clinically important obstruction.",
          correctUnder: "The original pressure acquisition has a technical limitation or an unreconciled position/protocol problem.",
          claims: ["egjoo-corroboration", "hrm-acquisition"],
          timingProfileId: "timing.test.esophageal_manometry"
        },
        {
          id: "ph",
          label: "Obtain ambulatory esophageal pH-impedance reflux monitoring",
          rationale: "Reflux monitoring can address a reflux hypothesis, but it does not establish whether the current preserved-peristalsis outflow pattern impedes passage.",
          temptation: "Attribute regurgitation-like hold-up to reflux because some body contractions persist.",
          correctUnder: "Obstructive physiology has been adequately assessed and the unresolved question concerns reflux burden or symptom association.",
          claims: ["egjoo-corroboration", "reflux-testing-purpose"],
          timingProfileId: "timing.test.ambulatory_reflux_monitoring"
        },
        {
          id: "barium",
          label: "Obtain upright timed barium esophagography with a tablet",
          rationale: "The retained peristalsis distinguishes this pattern from conclusive achalasia. A complementary passage study can establish clinically relevant obstruction before choosing junction therapy.",
          temptation: "The key requires interpreting retained peristalsis and then seeking independent functional corroboration.",
          correctUnder: "A symptomatic manometric EGJOO pattern remains to be corroborated by an accepted supportive study.",
          claims: ["egjoo-corroboration", "barium-clearance", "tablet-obstruction"],
          timingProfileId: "timing.test.contrast_swallow"
        },
      ],
      explanation: "Elevated relaxation pressure with retained peristalsis does not establish conclusive achalasia. Use a complementary study to assess the clinical relevance of the outflow pattern. Timed barium with tablet passage is the appropriate offered study. FLIP is another accepted supportive approach.",
      claims: ["egjoo-corroboration", "hrm-acquisition", "barium-clearance", "tablet-obstruction", "reflux-testing-purpose"],
      reasoning: {
        interpret: "Recognize retained peristalsis despite positional relaxation-pressure and intrabolus abnormalities.",
        apply: "Seek an accepted independent obstruction assessment before treating the manometric category as a clinical diagnosis.",
        closestChoice: "repeat",
        decidingObservation: "The study is adequate and demonstrates preserved propagated contractions, so more of the same pressure protocol is not the missing evidence.",
        counterfactual: "If the catheter never crossed the junction or the primary-position series was unusable, repeating an adequate pressure study would become the relevant offered next step.",
        counterfactualChoice: "repeat",
        deletionTest: "Structural and exposure history constrain secondary explanations. Peristalsis distinguishes the category. Adequacy separates complementary testing from repetition. Removing those observations makes the key unsupported.",
        cueAttack: "The task names no barium, emptying endpoint or gold-standard property. All three options are investigations with matched wait metadata. The available FLIP alternative is discussed only in feedback to avoid two defensible supportive-study choices.",
        stageAudit: "Three additional investigations before a junction-treatment decision.",
        predictedDifficulty: "hard",
        difficultyReason: "The resident must separate a manometric category from a clinically conclusive obstructive disorder instead of immediately applying the achalasia treatment pathway.",
        sequenceAudit: "Standalone. No prior answer supplies the EGJOO or corroboration rule.",
        remainingRisk: "The constructed phrase several supine swallows is qualitative. Melissa must confirm sufficient protocol detail and the exact test ranking.",
      },
    }],
  },
  {
    slug: "persistent-acquisition-failure",
    name: "Leah Foster",
    age: 63,
    sex: "Female",
    complaint: "Swallowing evaluation",
    presentation: "{patientName}, a 63-year-old woman, attends clinic with continuing food-and-liquid dysphagia and regurgitation after structural evaluation found no junction lesion.",
    mode: "clinic_assessment",
    nodes: [{
      slug: "flip-after-failed-assistance",
      conceptId: concept("complementary-flip-after-acquisition-failure"),
      identityDecision: "new_meaning",
      identityReason: "The live acquisition questions favor assisted completion. This new boundary asks what to do after assistance has also failed to produce usable measurements.",
      conceptType: "workup",
      objective: "Choose complementary distensibility assessment after genuine repeated inability to complete pressure testing.",
      creationKind: "new",
      replacesInventoryIds: [],
      task: "Which investigation should now advance {patientName}'s motor-disorder assessment?",
      currentUpdate: "The initial catheter study stopped during retching. During a later endoscopically assisted attempt, the catheter crossed the junction, but after recovery she repeatedly displaced it and the separated-swallow series remained unusable. The recent timed contrast study showed substantial retention above a smooth distal taper.",
      correctChoice: "flip",
      choices: [
        {
          id: "hrm",
          label: "Repeat endoscopically assisted high-resolution manometry",
          rationale: "Assisted completion is appropriate after an initial placement failure. It has now also failed to yield usable post-recovery measurements, making a complementary method reasonable.",
          temptation: "Apply the usual failed-catheter repair repeatedly without considering the documented assisted failure.",
          correctUnder: "The initial failure was a placement problem and a feasible assisted attempt has not yet been completed.",
          claims: ["hrm-acquisition", "failed-manometry-flip"],
          timingProfileId: "timing.test.esophageal_manometry"
        },
        {
          id: "flip",
          label: "Obtain endoscopic FLIP topography and junction distensibility",
          rationale: "Persistent incomplete manometry despite assisted placement is an accepted setting for FLIP assessment. It can add motor/outflow information beyond the already acquired retention study.",
          temptation: "The key requires distinguishing failure to acquire pressure data from the supportive obstruction observations already available.",
          correctUnder: "Obstructive symptoms persist and standard pressure testing remains incomplete despite assisted placement.",
          claims: ["failed-manometry-flip", "barium-clearance"],
          timingProfileId: "timing.test.upper_endoscopy"
        },
        {
          id: "barium",
          label: "Repeat timed barium esophagography with tablet passage",
          rationale: "A contrast study has already demonstrated retention. Repeating that same observation will not supply the complementary physiology sought after repeated pressure-acquisition failure.",
          temptation: "Retreat to a familiar supportive study that is already informative but does not answer the remaining question.",
          correctUnder: "The prior contrast acquisition was inadequate or the clinical question now concerns a changed clearance trajectory.",
          claims: ["barium-clearance", "tablet-obstruction", "failed-manometry-flip"],
          timingProfileId: "timing.test.contrast_swallow"
        },
      ],
      explanation: "The record contains a real failure after assisted placement and an already informative retention study. FLIP is a supported complementary route in that circumstance. It does not recreate a complete manometric subtype or prove that an irreversible procedure is indicated.",
      claims: ["failed-manometry-flip", "hrm-acquisition", "barium-clearance", "tablet-obstruction"],
      reasoning: {
        interpret: "Determine that the pressure assessment remains unusable despite an actual assisted attempt, while retention has already been acquired.",
        apply: "Select a supported complementary method rather than repeat an unsuccessful acquisition strategy or the same emptying observation.",
        closestChoice: "hrm",
        decidingObservation: "The post-recovery series was unusable after assisted crossing, rather than merely absent from an exported report.",
        counterfactual: "If the only failure was blind placement and there had been no assisted attempt, assisted HRM would be the appropriate offered way to obtain a complete pressure classification.",
        counterfactualChoice: "hrm",
        deletionTest: "The two acquisition episodes establish the important boundary. The existing contrast result prevents a generic barium choice. Removing assisted failure restores the live bank's familiar completion pathway.",
        cueAttack: "Three genuine diagnostic paths have estimates. The task names no distensibility goal. The failed-assistance record is decision-critical chronology, rather than a sentence announcing an unattempted key.",
        stageAudit: "Three investigations after incomplete pressure testing. No treatment competes with diagnostic completion.",
        predictedDifficulty: "moderate",
        difficultyReason: "The closest error is repeating the familiar assisted-HRM rule even after that method has failed to yield interpretable acquisition.",
        sequenceAudit: "Standalone. This variant must not directly follow the frozen assisted-HRM task as another score of the same unresolved acquisition.",
        remainingRisk: "The generic upper-endoscopy timing profile is a placeholder for FLIP. A new service is not executed. Manager must register the exact planned-test identity.",
      },
    }],
  },
  {
    slug: "borderline-relaxation",
    name: "Gavin Moore",
    age: 60,
    sex: "Male",
    complaint: "Meals taking longer",
    presentation: "{patientName}, a 60-year-old man, attends clinic with persistent food-and-liquid dysphagia after endoscopy and junction imaging showed no structural explanation.",
    mode: "clinic_assessment",
    nodes: [{
      slug: "borderline-aperistalsis-study",
      conceptId: concept("borderline-relaxation-aperistalsis"),
      identityDecision: "new_meaning",
      identityReason: "Assigned recognition variants use clearly elevated relaxation pressures. This new decision concerns unresolved outflow obstruction when the measured pressure is at the upper normal boundary.",
      conceptType: "workup",
      objective: "Avoid closing the achalasia assessment from an upper-normal relaxation value when all body contractions fail.",
      creationKind: "new",
      replacesInventoryIds: [],
      task: "Which investigation should next clarify {patientName}'s swallowing disorder?",
      currentUpdate: "An adequate positional pressure study records failed contractions after every separated swallow. Median junction-relaxation values sit at this laboratory's upper normal limit in both positions. No normal propagation appears during alternate-position swallows. He takes no opioids.",
      correctChoice: "barium",
      choices: [
        {
          id: "meal",
          label: "Extend manometry with a standardized solid-meal recording",
          rationale: "A meal challenge is useful when an adequate liquid study leaves episodic food symptoms unexplained. This study already demonstrates universal body failure with unresolved junction opening, warranting complementary assessment.",
          temptation: "Treat dysphagia with a formally normal relaxation number as a symptom-provocation problem.",
          correctUnder: "Routine liquid acquisition is adequate and unrevealing while meal-associated symptoms remain unexplained.",
          claims: ["provocation-purpose", "borderline-aperistalsis"],
          timingProfileId: "timing.test.esophageal_manometry"
        },
        {
          id: "barium",
          label: "Obtain upright timed barium esophagography with a tablet",
          rationale: "The failed body series with upper-limit relaxation values remains inconclusive for achalasia versus absent contractility. A supportive passage study can clarify the obstruction question.",
          temptation: "The key requires recognizing uncertainty within the reference boundary rather than treating normal-range as complete exclusion.",
          correctUnder: "Dysphagia and an inconclusive achalasia/absent-contractility pattern require supportive assessment.",
          claims: ["borderline-aperistalsis", "barium-clearance", "tablet-obstruction"],
          timingProfileId: "timing.test.contrast_swallow"
        },
        {
          id: "ph",
          label: "Obtain ambulatory esophageal pH-impedance reflux monitoring",
          rationale: "A reflex reflux workup would leave the unresolved emptying and junction-opening question unanswered in this presentation.",
          temptation: "Assign a reflux-associated hypomotility explanation as soon as the relaxation number is printed inside the reference interval.",
          correctUnder: "The obstruction question has been resolved and a reflux mechanism is the remaining specific diagnostic concern.",
          claims: ["borderline-aperistalsis", "reflux-testing-purpose"],
          timingProfileId: "timing.test.ambulatory_reflux_monitoring"
        },
      ],
      explanation: "Universal body failure with relaxation values at the upper normal boundary can remain inconclusive. Obtain supportive obstruction assessment instead of assigning a final label from the reference flag. Timed barium is appropriate among the offered studies. FLIP is another supported complementary option.",
      claims: ["borderline-aperistalsis", "barium-clearance", "tablet-obstruction", "provocation-purpose", "reflux-testing-purpose", "hrm-acquisition"],
      reasoning: {
        interpret: "Recognize that all failed contractions plus an upper-limit relaxation value do not settle achalasia versus absent contractility.",
        apply: "Select complementary passage assessment before allowing the printed normal flag to close the workup.",
        closestChoice: "meal",
        decidingObservation: "Body failure is universal in an adequate study and relaxation is at the boundary in both positions.",
        counterfactual: "If separated liquid swallows have normal propagation and relaxation but fail to reproduce solid-food episodes, a standardized-meal extension becomes the relevant offered next study.",
        counterfactualChoice: "meal",
        deletionTest: "The location within the normal interval matters. Universal failure distinguishes this from an unrevealing liquid series. Removing either observation changes the differential and next-study ranking.",
        cueAttack: "All choices are specific investigations with estimates. The task has no normal-pressure exclusion language. FLIP is kept outside the answer set because it is another defensible supportive test.",
        stageAudit: "Three additional investigations after a completed baseline physiology study.",
        predictedDifficulty: "hard",
        difficultyReason: "The credible error is treating a reference-interval flag as a sufficient exclusion and choosing another symptom-protocol or reflux pathway.",
        sequenceAudit: "Standalone. This shares the barium test with the EGJOO item but the discriminator is upper-normal IRP with absent peristalsis rather than retained peristalsis with elevated pressure.",
        remainingRisk: "Clinician review must confirm that the constructed upper-limit record supplies adequate uncertainty without a fabricated device-specific cutoff.",
      },
    }],
  },
  {
    slug: "failed-therapy-records",
    name: "Elena Ward",
    age: 54,
    sex: "Female",
    complaint: "Foregut record review",
    presentation: "{patientName}, a 54-year-old woman, attends clinic after discharge for aspiration-related respiratory illness. The founder reviews her earlier and current outside foregut records with her.",
    mode: "longitudinal_chart_review_in_clinic",
    nodes: [
      {
        slug: "salvage-before-resection",
        conceptId: concept("incomplete-myotomy-salvage"),
        identityDecision: "new_meaning",
        identityReason: "No assigned item tests organ-preserving salvage after endoscopic treatment failure with evidence of an incomplete myotomy.",
        conceptType: "management",
        objective: "Use residual junction obstruction and favorable anatomy to consider Heller salvage before esophagectomy.",
        creationKind: "new",
        replacesInventoryIds: [],
        task: "Which plan best fits {patientName}'s earlier referral after dilation and POEM had failed?",
        currentUpdate: "At that earlier referral she was fit for major surgery but continued to retain food after graded dilation and POEM. The timed study showed a relatively straight esophagus with hold-up at the junction. Endoscopy showed no reflux stricture or malignancy. Distensibility remained reduced, and review of the POEM report documented that the muscle division had stopped short of the gastric extension.",
        correctChoice: "heller",
        choices: [
          {
            id: "resection",
            label: "Refer for esophagectomy with reconstruction assessment",
            rationale: "Resection can be appropriate after exhausted treatment in severely distorted disease. Favorable anatomy and a documented incomplete myotomy leave an organ-preserving target at this earlier stage.",
            temptation: "Count two failed treatment families as automatic exhaustion of salvage.",
            correctUnder: "Severe distorted anatomy and disabling retention persist after adequate therapies, with no useful residual junction target.",
            claims: ["salvage-heller", "end-stage-referral"]
          },
          {
            id: "heller",
            label: "Refer for Heller myotomy with partial fundoplication",
            rationale: "The record identifies an incomplete prior myotomy and anatomy conducive to salvage. Guidance supports considering Heller before resection in this setting.",
            temptation: "The key depends on distinguishing a failed intervention from a fully treated but irreversibly dysfunctional reservoir.",
            correctUnder: "A fit patient has favorable anatomy and residual obstruction from incomplete myotomy after failed dilation and POEM.",
            claims: ["salvage-heller", "myotomy-partial-wrap"]
          },
          {
            id: "injection",
            label: "Refer for sphincter botulinum toxin injection",
            rationale: "Temporary symptom relief is appropriate when definitive therapy is unsuitable. Her fitness and residual correctable target support considering definitive salvage here.",
            temptation: "Avoid a major salvage decision by defaulting to the lower-burden palliative procedure.",
            correctUnder: "The patient cannot undergo appropriate definitive treatment and symptom relief is the agreed objective.",
            claims: ["botulinum-unfit", "salvage-heller"]
          },
        ],
        explanation: "Treatment failure does not by itself establish an exhausted organ. Favorable anatomy and documented incomplete myotomy support considering Heller salvage before resection. The exact salvage plan requires a specialized foregut assessment.",
        claims: ["salvage-heller", "end-stage-referral", "myotomy-partial-wrap", "botulinum-unfit", "barium-clearance", "recurrence-mechanisms"],
        reasoning: {
          interpret: "Identify a persistent correctable junction target instead of inferring irreversible end-stage failure from treatment count.",
          apply: "Choose organ-preserving salvage assessment before esophagectomy in favorable anatomy.",
          closestChoice: "resection",
          decidingObservation: "The esophagus is relatively straight and the prior division did not reach the gastric extension.",
          counterfactual: "Severe sigmoid distortion with a patent, adequately myotomized junction and continuing disabling retention after completed therapies would shift the offered referral toward esophagectomy assessment.",
          counterfactualChoice: "resection",
          deletionTest: "Prior treatments establish salvage phase. Fitness distinguishes definitive from temporary therapy. Anatomy and incomplete myotomy supply the organ-preserving target. Deleting those findings leaves the treatment-count shortcut unresolved.",
          cueAttack: "All three options are referrals for named treatments. The key has no uniquely cautious assessment qualifier. The actual operative record is necessary evidence rather than an author-written correctable-lesion label.",
          stageAudit: "Three treatment referrals for an already characterized failed-treatment state.",
          predictedDifficulty: "hard",
          difficultyReason: "The resident must prioritize mechanism and anatomy over the number of prior failures while avoiding premature resection.",
          sequenceAudit: "Earlier historical stage. The patient's current age and clinic context remain in the header. Feedback does not specify the later anatomy or a future esophagectomy answer.",
          remainingRisk: "Evidence for exact salvage sequencing is low certainty. Redo POEM is also plausible in some patients and is not ranked against Heller in this option set.",
        },
      },
      {
        slug: "end-stage-center-referral",
        conceptId: concept("distorted-reservoir-resection-assessment"),
        identityDecision: "new_meaning",
        identityReason: "This distinct later construct scores the boundary where severe reservoir failure persists despite a completed myotomy and further junction treatment lacks a demonstrated target.",
        conceptType: "disposition",
        objective: "Recognize severe anatomic reservoir failure after adequate junction therapies and select a high-volume esophageal-center referral.",
        creationKind: "new",
        replacesInventoryIds: [],
        task: "Which referral best fits {patientName}'s current outside-hospital findings?",
        currentUpdate: "The later records document completion of Heller myotomy with partial fundoplication and initial improvement. At her current admission she again regurgitated retained food and developed aspiration-related illness. After respiratory recovery, the esophagram showed a markedly dilated sigmoid esophagus with dependent pools persisting through the timed series. Endoscopy and FLIP showed a widely opening junction with no fixed stricture. The operative record confirms a completed myotomy. Nutrition and cardiopulmonary assessment support considering major surgery after optimization.",
        correctChoice: "center",
        choices: [
          {
            id: "redo",
            label: "Refer for repeat POEM across the distal junction",
            rationale: "Further muscle division can treat an incomplete myotomy. The current record instead shows adequate junction opening and severe distorted-reservoir retention after completed therapies.",
            temptation: "Assume a recurrent symptom always indicates recurrent sphincter resistance.",
            correctUnder: "Reassessment identifies an incomplete myotomy and an anatomic target suited to another junction procedure.",
            claims: ["recurrence-mechanisms", "salvage-heller", "end-stage-referral"]
          },
          {
            id: "center",
            label: "Refer to a high-volume center for esophagectomy assessment",
            rationale: "Disabling retention, aspiration consequences, severe distortion and failure despite adequate junction treatment support specialized resection assessment. The referral does not predetermine the final operation.",
            temptation: "The key requires recognizing a changed mechanism after earlier organ-preserving salvage was appropriate.",
            correctUnder: "A potentially fit patient has severe distorted anatomy and consequential retention after adequate prior therapies.",
            claims: ["end-stage-referral", "myotomy-limit"]
          },
          {
            id: "dilate",
            label: "Refer for further pneumatic dilation of the junction",
            rationale: "Dilation can help recurrent junction resistance, but the current studies show a widely opening junction and a severely distorted retaining reservoir.",
            temptation: "Choose another lower-burden junction treatment despite the absence of its demonstrated target.",
            correctUnder: "A fit patient has recurrent obstructive resistance at the junction and a foregut team selects dilation with rescue planning.",
            claims: ["end-stage-referral", "recurrence-mechanisms", "dilation-rescue-risk"]
          },
        ],
        explanation: "The later findings change the problem from incomplete junction treatment to severe distorted-reservoir failure. A high-volume esophageal center should assess resection after nutritional and cardiopulmonary optimization. Diameter alone and the count of earlier interventions do not decide this referral.",
        claims: ["end-stage-referral", "myotomy-limit", "salvage-heller", "recurrence-mechanisms", "dilation-rescue-risk", "barium-clearance"],
        reasoning: {
          interpret: "Distinguish persistent dependent retention in a severely distorted reservoir from residual obstruction at an incompletely treated junction.",
          apply: "Select specialist esophagectomy assessment after adequate prior treatments and recovery sufficient to consider major surgery.",
          closestChoice: "redo",
          decidingObservation: "The junction opens widely after a completed myotomy while substantial dependent retention and aspiration consequences persist.",
          counterfactual: "A relatively straight esophagus with retained material above a poorly opening junction and documented incomplete division would restore an organ-preserving junction-salvage referral such as redo myotomy.",
          counterfactualChoice: "redo",
          deletionTest: "Completed treatment and actual opening establish the absence of the previous target. Distortion and retention identify reservoir failure. Aspiration establishes consequence. Recovery and fitness support considering major surgery. Removing the new update leaves the earlier salvage plan appropriate.",
          cueAttack: "All labels are referrals for specific procedures, and all include a named target. No invented diameter threshold or end-stage diagnosis appears before choice. The key's high-volume wording is clinically necessary but is a possible specificity cue for independent review.",
          stageAudit: "Three referral destinations after a completed current anatomic and physiologic reassessment.",
          predictedDifficulty: "hard",
          difficultyReason: "The resident must change direction from the previous organ-preserving answer when the current mechanism differs, while respecting the morbidity of resection.",
          sequenceAudit: "The prior explanation gives the earlier salvage rationale and does not name the later referral. Current widely opening junction and distorted retention are new. Delete them and the previous answer would remain appropriate.",
          remainingRisk: "Low-certainty individualized surgery. Melissa must confirm that the constructed observations support resection assessment and that current recovery is adequately represented. No acute hospital care is executed in clinic.",
        },
      },
    ],
  },
];

const reviewedNode = (slug: string): TopicNode => {
  const node = MOTILITY_TOPIC_REVIEWED_V1_ITEMS.flatMap((item) => item.nodes).find((node) => node.slug === slug);
  if (!node) throw new Error(`Missing reviewed topic node: ${slug}`);
  return node;
};

/** One author attempt per returned item. Parked attempts remain reviewable data
 * and are excluded from the candidate preview. The reviewed v1 data above is
 * immutable, including all three editorial PASS nodes and their case headers.
 */
export const MOTILITY_TOPIC_REVISION_ATTEMPTS: TopicNode[] = [
  {
    ...reviewedNode("opioid-response-decision"),
    version: 2,
    revisionStatus: "parked",
    parkReason: "The completed symptom and physiologic recovery fairly supports deferral, but leaves neither offered junction procedure a credible present competitor. Wording repairs do not make this a difficult two-step decision. No accepted basic-purpose exception exists; changing the acquired response would replace the clinical problem.",
    reviewResponse: "Corrected the pressure-column name and aligned the proposed procedure with the POEM referral. Retained the actual recovered function. The remaining easy recovery-to-deferral comparison is explicitly parked rather than claimed as harder.",
    exhibit: {
      ...reviewedNode("opioid-response-decision").exhibit!,
      kind: "table",
      caption: "Constructed serial pressure-study observations",
      columnHeaders: ["Median integrated relaxation pressure", "Esophageal-body response"],
      rowHeaders: ["During regular oxycodone", "After the supervised adjustment"],
      cells: [
        ["Above the laboratory reference interval", "Premature or failed responses throughout the separated-swallow series"],
        ["Within the laboratory reference interval in both positions", "Sequential propagated contractions with each separated swallow"],
      ],
    },
    task: "What should happen to {patientName}'s planned POEM after this reassessment?",
    reasoning: {
      ...reviewedNode("opioid-response-decision").reasoning,
      predictedDifficulty: "easy",
      difficultyReason: "Both procedural competitors assume persisting symptomatic obstruction despite its documented resolution. The serial study requires interpretation, but the current action is straightforward and the second step is not consequential enough for the requested batch.",
      cueAttack: "The misleading pressure heading and procedure-name mismatch are repaired. Re-solving still eliminates both procedures from the current recovery record, so this attempt is parked with that unresolved difficulty limitation.",
      remainingRisk: "Parked. A future different response-based clinical construct requires a new brief and supported competing actions. The old N2 hold remains open.",
    },
  },
  {
    ...reviewedNode("spastic-procedure"),
    version: 2,
    revisionStatus: "parked",
    parkReason: "Removing the unique tailored qualifier and representing comparable body-plus-junction myotomy coverage leaves a legitimate tailored Heller alternative. Current SAGES preference is expert opinion, while ACG accepts tailored POEM or Heller. The represented anatomy does not independently establish a unique patient-specific ranking; do not invent a coverage cutoff or local permission to select POEM.",
    reviewResponse: "Made procedure labels parallel and stated comparable coverage for both myotomy proposals. Preserved initial-treatment chronology and the raw spastic findings. The clinical ranking remains unresolved, so this single attempt is parked for Melissa rather than presented as a single-best-answer candidate.",
    currentUpdate: "Her initial record documents progressive food-and-liquid dysphagia with swallowing-related pain. Endoscopy and cross-sectional assessment show no junction lesion. She uses no opioids. The anesthesia assessment permits either myotomy. The foregut proposals describe muscle division across the involved esophageal-body segment and junction for both myotomy approaches.",
    choices: [
      {
        ...reviewedNode("spastic-procedure").choices[0]!,
        label: "Laparoscopic Heller myotomy with partial fundoplication",
        rationale: "A tailored surgical myotomy can address the spastic segment and remains an accepted option. With comparable proposed coverage, the current observations do not establish why it must rank below POEM for this individual.",
        temptation: "This is a legitimate definitive alternative, which is why the proposed single key remains clinically unresolved.",
        correctUnder: "An individualized foregut assessment selects a tailored surgical myotomy with suitable coverage and reflux protection.",
      },
      {
        ...reviewedNode("spastic-procedure").choices[1]!,
        label: "Endoscopic graded pneumatic dilation of the junction",
      },
      {
        ...reviewedNode("spastic-procedure").choices[2]!,
        label: "Peroral endoscopic myotomy across the involved segment",
        rationale: "The raw findings support a spastic achalasia phenotype and a tailored myotomy. SAGES favors POEM by expert opinion, but this alone does not settle the offered comparison with a comparably tailored Heller plan in an unapproved teaching item.",
      },
    ],
    explanation: "The pressure and body-timing observations support a spastic achalasia phenotype. A myotomy addressing the involved body segment is preferable to treating only the junction with dilation. The offered POEM-versus-tailored-Heller ranking remains unresolved for this constructed patient; the item is parked and its provisional key is not authorized for scoring.",
    reasoning: {
      ...reviewedNode("spastic-procedure").reasoning,
      closestChoice: "heller",
      decidingObservation: "The spastic body segment favors tailored muscle division over junction dilation. No additional represented observation uniquely ranks two myotomies with comparable coverage.",
      counterfactual: "If the phenotype were nonspastic and a specialist selected surgical myotomy with reflux protection, Heller would be a reasonable offered plan. This is not a validated single-best reversal of the current POEM-versus-Heller comparison.",
      counterfactualChoice: "heller",
      cueAttack: "Removed the uniquely favorable tailored label. All options name procedures at the initial-treatment stage. The resulting unresolved Heller comparison is a fairness hold, not a wording problem to hide.",
      predictedDifficulty: "moderate",
      difficultyReason: "Subtype interpretation is consequential, but two accepted myotomy approaches remain insufficiently separated for a fair difficult scored item.",
      sequenceAudit: "This initial historical decision is parked. The later candidate sequence starts with an actual completed outside POEM and does not depend on answering this proposed initial choice.",
      remainingRisk: "Parked for a clinician-supported ranking or a future different decision objective. No length cutoff or service-availability cue was added.",
    },
  },
  {
    ...reviewedNode("recurrent-clearance-test"),
    version: 2,
    revisionStatus: "revised",
    reviewResponse: "Replaced the redundant adequate-manometry repeat with endoscopy, a distinct plausible investigation for post-treatment mucosal injury or stricture. Re-solved TBE versus endoscopy and reflux monitoring for recurrent food hold-up; all choices occupy the same diagnostic stage and later results remain hidden.",
    currentUpdate: "The later record documents POEM followed by a period of comfortable eating. Food now pauses and fluid returns at night. The completed repeat manometry has adequate junction-crossing positional acquisition, relaxation within the laboratory interval and no residual premature contractions. Her weight and oral hydration are maintained.",
    choices: [
      {
        id: "endoscopy",
        label: "Upper endoscopy with esophageal and junction inspection",
        rationale: "Endoscopy can identify reflux injury or a post-treatment narrowing and may be complementary in the full reassessment. For this stable recurrent food-and-fluid hold-up, timed barium is the guideline-supported first objective test of emptying; the reassuring pressure study has not answered that question.",
        temptation: "Prioritize possible reflux injury or stricture after POEM before characterizing whether the esophagus empties.",
        correctUnder: "Objective clearance is satisfactory and a mucosal lesion or luminal narrowing remains the unresolved target of the symptom evaluation.",
        claims: ["posttherapy-endoscopic-targets", "post-treatment-tbe", "recurrence-mechanisms"],
        timingProfileId: "timing.test.upper_endoscopy",
      },
      {
        ...reviewedNode("recurrent-clearance-test").choices[1]!,
        rationale: "Normal measured relaxation and absence of residual spasm do not establish bolus emptying. Upright timed barium testing directly assesses clearance and is the ACG first-line objective investigation for recurrent symptoms after definitive achalasia treatment.",
      },
      {
        ...reviewedNode("recurrent-clearance-test").choices[2]!,
        rationale: "Nocturnal fluid return after POEM makes reflux a credible mechanism. Her recurrent food hold-up still requires objective clearance assessment first; reflux monitoring answers a different question once clearance and structural findings have been considered.",
      },
    ],
    explanation: "Improved pressure relaxation does not show that swallowed material leaves the esophagus. Recurrent food hold-up after POEM warrants timed barium assessment first. Endoscopy can examine injury or narrowing, and reflux monitoring can resolve an outstanding reflux question; neither replaces the present emptying assessment.",
    claims: [...reviewedNode("recurrent-clearance-test").claims, "posttherapy-endoscopic-targets"],
    reasoning: {
      interpret: "Separate an adequate normal post-treatment relaxation measurement from the unmeasured clearance of food and liquid.",
      apply: "Choose first-line objective emptying assessment for recurrent post-treatment swallowing symptoms while retaining mucosal injury and reflux as genuine alternatives.",
      closestChoice: "endoscopy",
      decidingObservation: "Recurrent food hold-up persists after an adequate pressure study, while no new objective clearance result is available.",
      counterfactual: "If a completed timed study instead showed satisfactory passage and the outstanding problem was a suspected mucosal lesion or luminal narrowing, upper endoscopy would become the appropriate offered investigation.",
      counterfactualChoice: "endoscopy",
      deletionTest: "The completed POEM establishes the treatment phase. Food hold-up identifies the unresolved functional problem. Normal acquired pressure data test whether the learner confuses relaxation with emptying. Maintained intake keeps this an outpatient diagnostic choice.",
      cueAttack: "Every label names a distinct investigation. None repeats a just-completed study. The task names symptoms rather than a clearance target, and the key is not the only new option. Endoscopy remains legitimate complementary care but is ranked after first-line emptying assessment here.",
      stageAudit: "Three diagnostic investigations before an additional treatment decision. No present procedure competes against an information-gathering key.",
      predictedDifficulty: "moderate",
      difficultyReason: "The resident must avoid overinterpreting reassuring manometry and rank complementary tests for recurrent obstructive symptoms. This is a fair moderate application, not a claim of independently hard performance.",
      sequenceAudit: "First active node in this case. It explicitly restates actual POEM and its response. Its feedback does not supply subsequent clearance findings, mucosal findings or the medication decision.",
      remainingRisk: "Endoscopy is complementary and may be ordered during a complete assessment. Melissa must confirm the first-investigation ranking for this stable presentation. Exact candidate v2 needs independent and clinical review.",
    },
  },
  {
    ...reviewedNode("postpoem-reflux-response"),
    version: 2,
    revisionStatus: "revised",
    conceptId: "concept.esophagus-motility-achalasia.postmyotomy-inflammation-versus-obstruction.v2",
    previousConceptId: concept("postmyotomy-inflammation-versus-obstruction"),
    identityDecision: "new_version",
    identityReason: "The reviewed v1 chooses initial acid suppression over unsupported repeat junction procedures. This version adds a distinct medication-use decision: optimize an actually acquired daily PPI administration pattern before escalation. Preserve v1 and its history separately.",
    objective: "Interpret post-myotomy clearance and mucosal observations, then optimize conventional PPI administration before escalating reflux therapy.",
    reviewResponse: "Removed the supplied esophagitis diagnosis, retained raw clearance and mucosal observations, supplied actual current medicine use, and replaced excluded junction procedures with three reflux-medicine regimens. The closest competitor is twice-daily PPI escalation, separated by unoptimized current administration.",
    task: "Which medication plan should next address {patientName}'s persistent symptoms after POEM?",
    currentUpdate: "The subsequent upright timed examination shows prompt liquid clearance and tablet passage into the stomach. Endoscopy shows distal mucosal breaks, without retained food or a fixed narrowing. She describes burning and sour fluid return, especially after lying down. Bottle review confirms conventional delayed-release omeprazole taken every day at bedtime, several hours after dinner.",
    correctChoice: "premeal",
    choices: [
      {
        id: "premeal",
        label: "Use omeprazole daily before breakfast",
        rationale: "The clearance and mucosal findings support a reflux-injury target. Daily conventional delayed-release omeprazole has been taken away from a meal. Optimize its administration before judging that regimen insufficient or adding therapy.",
        temptation: "This requires using the actual administration record rather than equating daily pill use with optimized acid suppression.",
        correctUnder: "A conventional daily PPI has not been used before the first meal and persistent reflux symptoms are being reassessed.",
        claims: ["confirmed-reflux-treatment", "daily-ppi-premeal", "optimize-ppi-before-escalation", "objective-postpoem-reflux", "barium-clearance"],
      },
      {
        id: "twice",
        label: "Use omeprazole before breakfast and before dinner",
        rationale: "Twice-daily PPI use can be appropriate after persistent disease despite an optimized daily regimen. The present record has not tested properly administered daily therapy, so increasing treatment now skips that correction.",
        temptation: "Interpret symptoms despite daily pill taking as failure of optimized daily PPI treatment and escalate immediately.",
        correctUnder: "Persistent reflux disease remains after an adequate trial of correctly administered daily PPI, and the treating clinician selects premeal twice-daily therapy.",
        claims: ["optimize-ppi-before-escalation", "daily-ppi-premeal", "twice-daily-ppi-premeal"],
      },
      {
        id: "h2",
        label: "Use daily prebreakfast omeprazole with as-needed bedtime famotidine",
        rationale: "Famotidine provides H2-receptor acid suppression, and selected patients have a role for as-needed bedtime H2 blockade for nocturnal symptoms during optimized PPI use. Adding it while first correcting PPI administration escalates treatment before the response to that correction is known.",
        temptation: "Let the nocturnal symptom timing select an added nighttime medicine without examining how the existing PPI is used.",
        correctUnder: "Selected nocturnal symptoms or demonstrated nocturnal acid breakthrough persist despite an optimized daily premeal PPI regimen.",
        claims: ["h2-nocturnal-addition", "famotidine-class", "optimize-ppi-before-escalation", "daily-ppi-premeal"],
      },
    ],
    explanation: "Prompt passage with distal mucosal injury shifts the present target toward reflux rather than another junction procedure. Daily pill taking does not establish an optimized conventional PPI regimen: move the daily omeprazole to before breakfast before escalating. Persistent disease after an adequate optimized course would justify reconsidering treatment intensity; selected nocturnal breakthrough has a different add-on pathway.",
    claims: ["confirmed-reflux-treatment", "objective-postpoem-reflux", "barium-clearance", "optimize-ppi-before-escalation", "daily-ppi-premeal", "twice-daily-ppi-premeal", "h2-nocturnal-addition", "famotidine-class"],
    reasoning: {
      interpret: "Integrate actual liquid/tablet passage and distal mucosal breaks as evidence of a reflux-injury target after myotomy, rather than infer obstruction from recurrent symptoms.",
      apply: "Inspect actual conventional PPI use and optimize administration before escalating an untested daily regimen.",
      closestChoice: "twice",
      decidingObservation: "Every current daily dose is taken at bedtime hours after dinner; an optimized premeal daily regimen has not been tried.",
      counterfactual: "If an adequate course of correctly administered daily premeal omeprazole had already been completed with persistent reflux disease, the offered before-breakfast-and-dinner regimen would become a reasonable next plan.",
      counterfactualChoice: "twice",
      deletionTest: "Clearance and mucosal observations identify the mechanism. Current formulation and actual use distinguish optimization from escalation. Recumbent symptoms make nighttime H2 blockade a credible temptation. Removing actual administration makes the medication comparison underdetermined.",
      cueAttack: "Three named medicine regimens replace the prior medicine-versus-unsupported-procedures set. Raw mucosal findings replace the supplied diagnosis. Comparable option lengths and repeated omeprazole avoid a sole-new-medicine key. The history states use without telling the learner it is inadequate.",
      stageAudit: "Three current reflux-medication regimens after objective reassessment, with monitoring common to every plan.",
      predictedDifficulty: "moderate",
      difficultyReason: "Requires mechanism interpretation followed by distinguishing medication administration from medication failure. Bedtime symptoms make escalation or H2 addition tempting. This is a fair moderate clinical application, not a measured or guaranteed hard item.",
      sequenceAudit: "Second active node. The first node discusses investigations but neither names a PPI nor teaches medication scheduling. All decisive clearance, mucosal and medication observations appear only in this update, which also states the actual POEM timepoint.",
      remainingRisk: "New medication-use meaning requires a new concept version and independent/clinical review. General ACG GERD guidance directly supports optimization; one adequate guideline supplies this step. Coordinate ownership with the GERD lane. No invented dose, failure interval, injury grade or procedure threshold is used.",
    },
  },
  {
    ...reviewedNode("egjoo-supportive-study"),
    version: 2,
    revisionStatus: "revised",
    reviewResponse: "Used a complete neutral persistent-dysphagia task. Replaced routine repeated liquid-swallow manometry with a distinct standardized solid-meal extension. Feedback now explains why preserved propagation plus elevated outflow pressures remains clinically inconclusive without accepted supportive obstruction evidence.",
    task: "Which investigation should next inform care for {patientName}'s persistent dysphagia?",
    choices: [
      {
        id: "meal",
        label: "High-resolution manometry during a standardized solid meal",
        rationale: "A solid-meal extension can expose meal-related physiology missed by routine liquid swallows. Here the adequate positional study already demonstrates a retained-peristalsis outflow pattern with reproduced symptoms. Independent supportive obstruction evidence, rather than additional pressure provocation, is needed to establish its clinical relevance.",
        temptation: "Choose a meaningful symptom-provoking protocol but mistake more pressure observations for the needed complementary confirmation.",
        correctUnder: "The adequate liquid-swallow study does not explain meal-related symptoms and a solid-meal extension addresses that unresolved symptom-physiology relationship.",
        claims: ["provocation-purpose", "egjoo-corroboration", "hrm-acquisition"],
        timingProfileId: "timing.test.esophageal_manometry",
      },
      {
        ...reviewedNode("egjoo-supportive-study").choices[1]!,
        label: "Ambulatory esophageal pH-impedance reflux monitoring",
      },
      {
        ...reviewedNode("egjoo-supportive-study").choices[2]!,
        label: "Upright timed barium esophagography with a tablet",
        rationale: "Elevated outflow pressure with retained peristalsis is not conclusive achalasia. Even with relevant symptoms, the manometric outflow-obstruction pattern needs accepted supportive evidence that passage is impaired. Timed barium with a tablet addresses that question before treatment is chosen.",
      },
    ],
    explanation: "Preserved propagated contractions change the interpretation of the raised outflow pressures. A symptomatic manometric EGJ outflow-obstruction pattern remains clinically inconclusive until supported by an accepted complementary obstruction assessment. Timed barium with tablet passage supplies that assessment. Meal provocation can address unexplained meal symptoms, while reflux monitoring answers a different physiologic question.",
    claims: [...reviewedNode("egjoo-supportive-study").claims, "provocation-purpose"],
    reasoning: {
      interpret: "Recognize a manometric outflow-obstruction pattern with preserved peristalsis rather than label all elevated relaxation pressures achalasia.",
      apply: "Seek independent supportive obstruction evidence before choosing treatment, rather than adding pressure observations to an already adequate symptomatic study.",
      closestChoice: "meal",
      decidingObservation: "The positional liquid study already shows the outflow pattern and reproduces symptoms, but no independent passage or distensibility result has corroborated obstruction.",
      counterfactual: "If liquid swallows and positional pressures were normal and did not explain symptoms confined to eating solid meals, the offered standardized solid-meal manometry extension would become reasonable.",
      counterfactualChoice: "meal",
      deletionTest: "Retained propagation distinguishes this construct from conclusive achalasia. Positional pressure elevation, intrabolus pressure and symptom reproduction establish the adequate manometric pattern. Exposure and operation history prevent an unrepresented secondary explanation from deciding the item.",
      cueAttack: "The task names persistent dysphagia without naming the desired mechanism or treatment assessment. All choices are distinct plausible investigations; a genuine meal protocol replaces the advertised routine repeat. FLIP is deliberately absent because it is also an accepted corroborating method.",
      stageAudit: "Three investigations at the diagnostic confirmation stage, before junction treatment is selected.",
      predictedDifficulty: "moderate",
      difficultyReason: "Requires interpreting retained propagation with abnormal junction pressures and distinguishing supportive confirmation from meaningful but less decisive meal provocation. This fairly tests a specialized application of a high-value treatment-before-confirmation principle.",
      sequenceAudit: "Standalone. No preceding subtype label or explanation supplies the supportive-test decision.",
      remainingRisk: "Exact v2 diagnostic ranking remains subject to clinical and independent review. This retains the v1 clinical meaning and concept identity; no second accepted supportive modality is offered.",
    },
  },
  {
    ...reviewedNode("flip-after-failed-assistance"),
    version: 2,
    revisionStatus: "revised",
    reviewResponse: "Retained genuine failed acquisition after assisted crossing. Replaced both repeated investigations with new EUS and pH-impedance alternatives. The comparison now requires choosing a physiologic assessment over structural-wall or reflux assessment, rather than choosing the only untried test. Marked this advanced and narrower in yield.",
    task: "Which investigation should next inform care for {patientName}'s continuing dysphagia?",
    currentUpdate: "The initial catheter study stopped during retching. During a later endoscopically assisted attempt, the catheter crossed the junction, but after recovery she repeatedly displaced it and the separated-swallow series remained unusable. The recent timed contrast study showed substantial retention above a smooth distal taper. Her symptom course has been gradual and her weight is stable. The prior endoscopy and contrast-enhanced cardia imaging found no mass or focal wall abnormality.",
    choices: [
      {
        id: "eus",
        label: "Endoscopic ultrasound of the cardia and junction wall",
        rationale: "An infiltrative junction process can mimic a motor disorder despite an unrevealing mucosal examination. EUS is useful when clinical or imaging findings raise that concern. The represented gradual, weight-stable course and prior structural assessment provide no new wall target; the outstanding gap is usable physiology after failed assisted manometry.",
        temptation: "Pursue a real occult structural mimic as the next explanation without weighing the existing structural record and the unresolved physiologic acquisition.",
        correctUnder: "New focal junction-wall thickening or another substantial concern for an infiltrative lesion persists despite unrevealing mucosal inspection or sampling.",
        claims: ["eus-wall-target", "secondary-junction-assessment", "failed-manometry-flip"],
        timingProfileId: "timing.test.upper_endoscopy",
      },
      {
        ...reviewedNode("flip-after-failed-assistance").choices[1]!,
        label: "Endoscopic FLIP topography and junction distensibility",
        rationale: "Retention has been documented but usable pressure physiology has not been acquired despite assisted placement. FLIP is a supported complementary assessment of junction opening and motor response in this circumstance. It neither supplies a complete manometric subtype nor by itself authorizes myotomy.",
      },
      {
        id: "ph",
        label: "Ambulatory esophageal pH-impedance reflux monitoring",
        rationale: "Regurgitation can reflect reflux, but the acquired retained-column pattern and incomplete motor assessment leave obstructive physiology unresolved. Reflux burden and symptom association do not characterize that opening problem.",
        temptation: "Treat regurgitation as evidence of reflux and select a reflux test before resolving the retained-bolus physiology.",
        correctUnder: "Clearance and structural causes have been adequately assessed and the remaining question is whether symptoms track abnormal reflux.",
        claims: ["reflux-testing-purpose", "barium-clearance", "failed-manometry-flip"],
        timingProfileId: "timing.test.ambulatory_reflux_monitoring",
      },
    ],
    explanation: "The contrast record demonstrates retention, while even assisted manometry has not produced usable physiology. With no represented new structural concern, FLIP is a supported complementary way to assess junction opening and motor response. EUS targets a suspected wall process, and pH-impedance targets reflux. FLIP does not establish a complete pressure subtype or automatically justify irreversible treatment.",
    claims: ["failed-manometry-flip", "hrm-acquisition", "barium-clearance", "secondary-junction-assessment", "eus-wall-target", "reflux-testing-purpose"],
    reasoning: {
      interpret: "Separate demonstrated retention from unacquired pressure physiology, while weighing the actual structural workup and the course for a secondary junction process.",
      apply: "Choose complementary opening and motor-response assessment after true assisted-manometry failure rather than a wall-targeting or reflux-targeting study.",
      closestChoice: "eus",
      decidingObservation: "The assisted post-recovery series remains unusable, while the structural assessment has no focal wall finding and the course has no new weight-loss signal.",
      counterfactual: "If the cardia imaging instead showed new focal junction-wall thickening despite unrevealing mucosal examination, EUS would become the offered priority to investigate a secondary structural cause.",
      counterfactualChoice: "eus",
      deletionTest: "Both actual acquisition episodes define the failed-assistance boundary. Retention establishes the unresolved obstructive physiology. The structural assessment and course distinguish an occult-wall workup. Removing those observations would make the EUS comparison less determined.",
      cueAttack: "All three investigations are new in this record and labels have comparable scope. None repeats a narrated failure. The task names no distensibility measurement. Selecting FLIP now requires knowing what each new investigation can resolve rather than selecting novelty.",
      stageAudit: "Three diagnostic investigations after documented acquisition failure, without a premature treatment alternative.",
      predictedDifficulty: "moderate",
      difficultyReason: "Requires interpreting the remaining diagnostic gap and choosing among physiologic, structural-wall and reflux pathways. This is advanced narrow motility coverage; high examination yield and independently hard performance are not claimed.",
      sequenceAudit: "Standalone and optional advanced coverage. It must not be paired immediately with another scored assisted-manometry repair of the same unresolved acquisition.",
      remainingRisk: "Normal structural assessment does not absolutely exclude an infiltrative process. Melissa must confirm the represented course makes FLIP the best offered next step. Upper-endoscopy timing is an existing placeholder for both FLIP and EUS; no new service executes in this sidecar.",
    },
  },
  {
    ...reviewedNode("end-stage-center-referral"),
    version: 2,
    revisionStatus: "parked",
    parkReason: "After repairing chronology and referral-label symmetry, both repeat outlet procedures still lack a target at the widely patent junction. Prior salvage feedback also scaffolds the reservoir-versus-outlet distinction. The supported facts do not supply a credible different remaining strategy with a defensible single-best ranking; retain the fair observations and park the easy comparison.",
    reviewResponse: "Repaired most-recent-admission versus current-clinic chronology and restated the full prior dilation, POEM and completed Heller history. All options are now high-volume-center assessments at the same stage. Re-solving still leaves two already-excluded outlet competitors, so the attempt is parked.",
    currentUpdate: "After graded dilation and POEM failed, the later records document completion of Heller myotomy with partial fundoplication and initial improvement. During her most recent hospital admission she again regurgitated retained food and developed aspiration-related illness. After respiratory recovery, the esophagram showed a markedly dilated sigmoid esophagus with dependent pools persisting through the timed series. Endoscopy and FLIP showed a widely opening junction with no fixed stricture. The operative record confirms a completed myotomy. Nutrition and cardiopulmonary assessment support considering major surgery after optimization. These records are being reviewed at today's clinic visit after discharge.",
    choices: [
      { ...reviewedNode("end-stage-center-referral").choices[0]!, label: "Refer to a high-volume center for repeat POEM assessment" },
      { ...reviewedNode("end-stage-center-referral").choices[1]!, label: "Refer to a high-volume center for esophagectomy assessment" },
      { ...reviewedNode("end-stage-center-referral").choices[2]!, label: "Refer to a high-volume center for pneumatic dilation assessment" },
    ],
    reasoning: {
      ...reviewedNode("end-stage-center-referral").reasoning,
      cueAttack: "Specialist-center and assessment wording is now common to all referrals. The necessary patent-junction finding still disposes of both outlet interventions. That unresolved option-quality limitation is recorded as a park rather than concealed by parallel wording.",
      predictedDifficulty: "easy",
      difficultyReason: "The reservoir-failure mechanism is important, but there is no credible residual competitor in this option set after the acquired patent-junction findings.",
      sequenceAudit: "The previous PASS feedback contrasts favorable anatomy and incomplete myotomy with an exhausted organ. This later reversal is scaffolded application. The entire paired candidate case is withheld from active preview to retain the PASS node's exact serialization while its companion is parked.",
      remainingRisk: "Parked. Future authoring needs a supported alternative remaining strategy and a clinician-confirmed discriminator. The present data do not justify manufacturing one.",
    },
  },
];

const revisionBySlug = new Map(MOTILITY_TOPIC_REVISION_ATTEMPTS.map((node) => [node.slug, node]));
export const MOTILITY_TOPIC_CATALOG_ITEMS: TopicCase[] = MOTILITY_TOPIC_REVIEWED_V1_ITEMS.map((item) => ({
  ...item,
  ...(item.slug === "medication-reassessment" ? {
    presentation: "{patientName}, a 52-year-old man, attends clinic to review a planned POEM referral and the completed reassessment of his dysphagia.",
  } : {}),
  nodes: item.nodes.map((node) => revisionBySlug.get(node.slug) ?? node),
}));

export const MOTILITY_TOPIC_ITEMS: TopicCase[] = MOTILITY_TOPIC_CATALOG_ITEMS
  .filter((item) => item.slug !== "failed-therapy-records")
  .map((item) => ({ ...item, nodes: item.nodes.filter((node) => node.revisionStatus !== "parked") }))
  .filter((item) => item.nodes.length > 0);

export const MOTILITY_TOPIC_SOURCES = ledger.sources as ClinicalSource[];
export const MOTILITY_TOPIC_CLAIMS = ledger.claims as EvidenceClaim[];

function buildBundle(MOTILITY_TOPIC_ITEMS: TopicCase[]) {
const MOTILITY_TOPIC_QUESTIONS: QuestionVariant[] = MOTILITY_TOPIC_ITEMS.flatMap((item) =>
  item.nodes.map((node) => ({
    ...draftFor(node),
    id: questionId(node),
    conceptId: node.conceptId,
    stem: node.task,
    ...(node.exhibit ? { exhibit: node.exhibit } : {}),
    answerChoices: node.choices.map((choice) => ({
      id: choiceId(node, choice.id),
      label: choice.label,
      isCorrect: choice.id === node.correctChoice,
      rationale: choice.rationale,
      distractorRationale: choice.id === node.correctChoice ? null : choice.rationale,
    })),
    explanation: node.explanation,
    supportingEvidenceClaimIds: node.claims.map(claimId),
  })),
);

const MOTILITY_TOPIC_CONCEPTS: TestedConcept[] = MOTILITY_TOPIC_ITEMS.flatMap((item) =>
  item.nodes.map((node) => ({
    id: node.conceptId,
    displayName: node.slug.replaceAll("-", " "),
    learningObjective: node.objective,
    earliestFacilityStage: 2,
    conceptType: node.conceptType,
  })),
);

const MOTILITY_TOPIC_AUTHORING_CONCEPTS = MOTILITY_TOPIC_CONCEPTS.map((record) => {
  const node = MOTILITY_TOPIC_ITEMS.flatMap((item) => item.nodes).find((item) => item.conceptId === record.id)!;
  return {
    ...record,
    ...draftFor(node),
    previousConceptId: node.previousConceptId ?? null,
    identityDecision: node.identityDecision,
    identityReason: node.identityReason,
    educationalTier: 1,
    acuity: "stable",
    requiredCapabilityIds: [],
    evidenceClaimIds: node.claims.map(claimId),
    historyMigration: "Retain prior definitions and histories on their existing identities.",
  };
});

const MOTILITY_TOPIC_CASES: SyntheticClinicalCase[] = MOTILITY_TOPIC_ITEMS.map((item) => {
  const demographics = { ageYears: item.age, sexLabel: item.sex };
  const sourceLabels = ["Original constructed clinical teaching record", "Clinical review pending Melissa Rowland"];
  return {
    id: caseId(item),
    displayName: item.complaint,
    patientDisplayName: item.name,
    patientPresentationVariantId: `presentation.topic.${MOTILITY_TOPIC_SLUG}.${item.slug}.v1`,
    prototypeDemographics: demographics,
    chiefComplaint: item.complaint,
    presentation: item.presentation,
    approvedInstantiationProfiles: [{
      id: `profile.topic.${MOTILITY_TOPIC_SLUG}.${item.slug}.v1`,
      prototypeDemographics: demographics,
      chiefComplaint: item.complaint,
      presentation: item.presentation,
    }],
    releasePointId: "release.l0.clinic_evaluation",
    tutorialEligible: false,
    routineEligible: true,
    earliestFacilityStage: 2,
    requiredClinicalSetting: "clinic",
    requiredCapabilityIds: [],
    rewardTierId: "reward.clinic_basic",
    sourceLabels,
    decisionNodes: item.nodes.map((node, index) => {
      const question = MOTILITY_TOPIC_QUESTIONS.find((candidate) => candidate.id === questionId(node))!;
      return {
        id: nodeId(node),
        questionVariantId: question.id,
        primaryConceptId: node.conceptId,
        stem: question.stem,
        currentUpdate: node.currentUpdate,
        ...(question.exhibit ? { exhibit: question.exhibit } : {}),
        answerChoices: question.answerChoices.map((choice) => ({
          id: choice.id,
          label: choice.label,
          isCorrect: choice.isCorrect,
          rationale: choice.rationale!,
          serviceRequest: null,
        })),
        shuffleAnswers: true,
        explanation: question.explanation,
        sourceLabels,
        resultGateAfter: null,
        terminalDispositions: index === item.nodes.length - 1
          ? question.answerChoices.filter((choice) => !choice.isCorrect).map((choice) => ({
            answerChoiceId: choice.id,
            kind: "no_terminal_outcome" as const,
            consequenceNarrative: "Review the decision and its clinical rationale. Patient outcomes are outside this record-review exercise.",
            clinicalRationale: choice.rationale!,
            sourceLabels,
          }))
          : [],
      };
    }),
    learningSummary: item.nodes.map((node) => node.explanation).join(" "),
  };
});

const MOTILITY_TOPIC_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] = MOTILITY_TOPIC_ITEMS.flatMap((item) =>
  item.nodes.map((node) => ({
    caseId: caseId(item),
    nodeId: nodeId(node),
    questionVariantId: questionId(node),
    classification: node.choices.some((choice) => choice.timingProfileId)
      ? {
        kind: "test_choices" as const,
        choices: node.choices.map((choice) => ({
          choiceId: choiceId(node, choice.id),
          choiceLabel: choice.label,
          timing: choice.timingProfileId
            ? { kind: "test" as const, timingProfileId: choice.timingProfileId }
            : { kind: "no_test" as const },
        })),
      }
      : { kind: "no_test" as const },
  })),
);

const MOTILITY_TOPIC_ORDER_PROPOSALS = MOTILITY_TOPIC_TIMING_ENTRIES.flatMap((entry) =>
  entry.classification.kind === "test_choices"
    ? entry.classification.choices.filter((choice) => choice.timing.kind === "test").map((choice) => ({
      ...(entry.questionVariantId.endsWith(".v2") ? revisionDraft : MOTILITY_TOPIC_DRAFT),
      caseId: entry.caseId,
      nodeId: entry.nodeId,
      questionVariantId: entry.questionVariantId,
      choiceId: choice.choiceId,
      choiceLabel: choice.choiceLabel,
      timing: choice.timing,
      disposition: { kind: "not_executed" as const, reason: "future_planned" as const },
      serviceRequest: null,
      resultGateAfter: null,
    }))
    : [],
);

const MOTILITY_TOPIC_SELF_CHECKS = MOTILITY_TOPIC_ITEMS.flatMap((item) => item.nodes.map((node) => ({
  ...draftFor(node),
  caseId: caseId(item),
  nodeId: nodeId(node),
  questionVariantId: questionId(node),
  rubric: "question-authoring.2026-11-08.v15",
  checkedOn: "2026-11-11",
  authorVerdict: node.revisionStatus === "parked" ? "PARKED_AFTER_ONE_REVISION" : "DRAFT_FOR_INDEPENDENT_REVIEW",
  ...(node.version === 2 ? { revisionStatus: node.revisionStatus, authorRevisionAttempts: 1, parkReason: node.parkReason ?? null } : {}),
  independent: false,
  clinicalApproval: false,
  finiteProfileCount: 1,
  ...node.reasoning,
  closestChoiceId: choiceId(node, node.reasoning.closestChoice),
  counterfactualChoiceId: choiceId(node, node.reasoning.counterfactualChoice),
  optionAudit: node.choices.map((choice) => ({
    choiceId: choiceId(node, choice.id),
    isKey: choice.id === node.correctChoice,
    temptation: choice.temptation,
    whyRankedHere: choice.rationale,
    correctUnder: choice.correctUnder,
    claimIds: choice.claims.map(claimId),
  })),
})));

const MOTILITY_TOPIC_STATEMENT_MAPPINGS = MOTILITY_TOPIC_ITEMS.flatMap((item) => item.nodes.map((node) => ({
  ...draftFor(node),
  caseId: caseId(item),
  nodeId: nodeId(node),
  questionVariantId: questionId(node),
  constructedObservations: node.version === 2
    ? "Original fictional patients and serial records. Acquired findings and actual medicine use are constructed observations; diagnostic and administration rules map to atomic claims. No empirical probability, new cutoff, fixed wait, dose or failure interval is inferred."
    : "Original fictional patients and serial records. Laboratory-relative descriptions are observations. No empirical probabilities, novel cutoffs, fixed waits or drug regimens are inferred.",
  fieldMappings: [
    { field: "presentation", claimIds: node.claims.map(claimId) },
    { field: "currentUpdate", claimIds: node.claims.map(claimId) },
    ...(node.exhibit ? [{ field: "exhibit", claimIds: node.claims.map(claimId) }] : []),
    { field: "stem", claimIds: node.claims.map(claimId) },
    { field: "explanation", claimIds: node.claims.map(claimId) },
    ...node.choices.flatMap((choice) => [
      { field: `answerChoices.${choiceId(node, choice.id)}.label`, claimIds: choice.claims.map(claimId) },
      { field: `answerChoices.${choiceId(node, choice.id)}.rationale`, claimIds: choice.claims.map(claimId) },
    ]),
  ],
})));

const MOTILITY_TOPIC_CASE_REVIEWS = MOTILITY_TOPIC_ITEMS.map((item) => ({
  ...(item.nodes.some((node) => node.version === 2) ? revisionDraft : MOTILITY_TOPIC_DRAFT),
  caseId: caseId(item),
  encounterMode: item.mode,
  educationalTier: 1,
  encounterAcuity: "stable",
  historicalDecisionAcuity: "stable",
  earliestFacilityStage: 2,
  requiredCapabilityIds: [],
  finiteProfileIds: [`profile.topic.${MOTILITY_TOPIC_SLUG}.${item.slug}.v1`],
  evidenceClaimIds: [...new Set(item.nodes.flatMap((node) => node.claims.map(claimId)))],
  selectionLimitation: item.nodes.length > 1
    ? "Paired-only coverage. All concepts in the case must be unseen or due under the existing selector."
    : "Standalone candidate under the existing selector.",
}));

  return {
    questions: MOTILITY_TOPIC_QUESTIONS,
    concepts: MOTILITY_TOPIC_CONCEPTS,
    authoring_concepts: MOTILITY_TOPIC_AUTHORING_CONCEPTS,
    cases: MOTILITY_TOPIC_CASES,
    timing_entries: MOTILITY_TOPIC_TIMING_ENTRIES,
    order_proposals: MOTILITY_TOPIC_ORDER_PROPOSALS,
    self_checks: MOTILITY_TOPIC_SELF_CHECKS,
    statement_mappings: MOTILITY_TOPIC_STATEMENT_MAPPINGS,
    case_reviews: MOTILITY_TOPIC_CASE_REVIEWS,
  };
}

const reviewedBundle = buildBundle(MOTILITY_TOPIC_REVIEWED_V1_ITEMS);
export const MOTILITY_TOPIC_REVIEWED_V1_QUESTIONS = reviewedBundle.questions;
export const MOTILITY_TOPIC_REVIEWED_V1_CONCEPTS = reviewedBundle.concepts;
export const MOTILITY_TOPIC_REVIEWED_V1_AUTHORING_CONCEPTS = reviewedBundle.authoring_concepts;
export const MOTILITY_TOPIC_REVIEWED_V1_CASES = reviewedBundle.cases;
export const MOTILITY_TOPIC_REVIEWED_V1_TIMING_ENTRIES = reviewedBundle.timing_entries;
export const MOTILITY_TOPIC_REVIEWED_V1_ORDER_PROPOSALS = reviewedBundle.order_proposals;
export const MOTILITY_TOPIC_REVIEWED_V1_SELF_CHECKS = reviewedBundle.self_checks;
export const MOTILITY_TOPIC_REVIEWED_V1_STATEMENT_MAPPINGS = reviewedBundle.statement_mappings;
export const MOTILITY_TOPIC_REVIEWED_V1_CASE_REVIEWS = reviewedBundle.case_reviews;

const catalogBundle = buildBundle(MOTILITY_TOPIC_CATALOG_ITEMS);
export const MOTILITY_TOPIC_CATALOG_QUESTIONS = catalogBundle.questions;
export const MOTILITY_TOPIC_CATALOG_CONCEPTS = catalogBundle.concepts;
export const MOTILITY_TOPIC_CATALOG_AUTHORING_CONCEPTS = catalogBundle.authoring_concepts;
export const MOTILITY_TOPIC_CATALOG_CASES = catalogBundle.cases;
export const MOTILITY_TOPIC_CATALOG_TIMING_ENTRIES = catalogBundle.timing_entries;
export const MOTILITY_TOPIC_CATALOG_ORDER_PROPOSALS = catalogBundle.order_proposals;
export const MOTILITY_TOPIC_CATALOG_SELF_CHECKS = catalogBundle.self_checks;
export const MOTILITY_TOPIC_CATALOG_STATEMENT_MAPPINGS = catalogBundle.statement_mappings;
export const MOTILITY_TOPIC_CATALOG_CASE_REVIEWS = catalogBundle.case_reviews;

const activeBundle = buildBundle(MOTILITY_TOPIC_ITEMS);
export const MOTILITY_TOPIC_QUESTIONS = activeBundle.questions;
export const MOTILITY_TOPIC_CONCEPTS = activeBundle.concepts;
export const MOTILITY_TOPIC_AUTHORING_CONCEPTS = activeBundle.authoring_concepts;
export const MOTILITY_TOPIC_CASES = activeBundle.cases;
export const MOTILITY_TOPIC_TIMING_ENTRIES = activeBundle.timing_entries;
export const MOTILITY_TOPIC_ORDER_PROPOSALS = activeBundle.order_proposals;
export const MOTILITY_TOPIC_SELF_CHECKS = activeBundle.self_checks;
export const MOTILITY_TOPIC_STATEMENT_MAPPINGS = activeBundle.statement_mappings;
export const MOTILITY_TOPIC_CASE_REVIEWS = activeBundle.case_reviews;

export const MOTILITY_TOPIC_REVIEWED_V1_SOURCE_RELEASE = validateSyntheticClinicalRelease({
  id: "clinical.synthetic.prototype.v1",
  schemaVersion: 1,
  publicationStatus: "synthetic_unapproved_prototype",
  disclaimer: "Synthetic topic content, not clinically approved. Melissa Rowland is the clinical sign-off.",
  concepts: MOTILITY_TOPIC_REVIEWED_V1_CONCEPTS,
  cases: MOTILITY_TOPIC_REVIEWED_V1_CASES,
});

export const MOTILITY_TOPIC_REVIEW_DISPOSITIONS = MOTILITY_TOPIC_CATALOG_ITEMS.flatMap((item) => item.nodes.map((node) => ({
  reviewedQuestionVariantId: `question.topic.${MOTILITY_TOPIC_SLUG}.${node.slug}.v1`,
  questionVariantId: questionId(node),
  status: node.revisionStatus ?? "pass-preserved" as const,
  authorRevisionAttempts: node.version === 2 ? 1 : 0,
  activePreview: MOTILITY_TOPIC_ITEMS.some((candidate) => candidate.nodes.some((n) => questionId(n) === questionId(node))),
  reason: node.parkReason ?? node.reviewResponse ?? "Exact editorial PASS version preserved; clinical approval remains separate.",
  compositionHold: item.slug === "failed-therapy-records" ? "The PASS first node has empty terminal dispositions in its reviewed paired context. Removing its parked companion would alter that exact node. Preserve the complete reviewed case and withhold this pair from active preview pending manager composition review." : null,
})));

export const MOTILITY_TOPIC_SOURCE_LINKS = MOTILITY_TOPIC_SOURCES.map((source) => ({
  ...MOTILITY_TOPIC_DRAFT,
  sourceId: source.id,
  label: source.title,
  href: source.officialUrl!,
  target: "_blank" as const,
  rel: "noopener noreferrer" as const,
  referrerPolicy: "no-referrer" as const,
}));

export const MOTILITY_TOPIC_SOURCE_RELEASE = validateSyntheticClinicalRelease({
  id: "clinical.synthetic.prototype.v1",
  schemaVersion: 1,
  publicationStatus: "synthetic_unapproved_prototype",
  disclaimer: "Synthetic topic content, not clinically approved. Melissa Rowland is the clinical sign-off.",
  concepts: MOTILITY_TOPIC_CONCEPTS,
  cases: MOTILITY_TOPIC_CASES,
});

export const MOTILITY_TOPIC_MANIFEST = {
  ...revisionDraft,
  topicSlug: MOTILITY_TOPIC_SLUG,
  reviewDisplay: "key shown first for review only",
  variantCount: MOTILITY_TOPIC_QUESTIONS.length,
  reviewedV1VariantCount: MOTILITY_TOPIC_REVIEWED_V1_QUESTIONS.length,
  catalogVariantCount: MOTILITY_TOPIC_CATALOG_QUESTIONS.length,
  revisionDispositionCounts: { passPreserved: 3, revised: 4, parked: 3 },
  preservedPassCompositionHolds: ["question.topic.esophagus-motility-achalasia.salvage-before-resection.v1"],
  caseCount: MOTILITY_TOPIC_CASES.length,
  conceptCount: MOTILITY_TOPIC_CONCEPTS.length,
  managerAccepted: false,
  independentPass: false,
  clinicalApproval: false,
  clinicalSignoff: "Melissa Rowland",
  integrationDependencies: [
    "Three exact v1 editorial PASS versions are preserved. Four revised v2 candidates require independent re-review; three v2 attempts are parked.",
    "The PASS salvage node remains exact in the complete reviewed v1 case. Its paired preview is withheld while the returned companion is parked; manager owns a separately reviewed composition adaptation.",
    "Independent review, exact clinical review and manager acceptance remain separate steps.",
    "Manager installs accepted definitions and explicit source-view bindings while retaining historical definitions.",
    "Append exact timing/order identities for every offered investigation using existing placeholder profiles.",
    "Investigations in this sidecar are planned-test proposals with not_executed/future_planned disposition.",
    "Coordinate the post-POEM inflammatory complication with the GERD-topic lane.",
    "Preserve all exact PASS inputs, current accepted definitions, frozen encounters and existing FSRS histories.",
  ],
};

/** Acceptance salvage is an additive, separately reviewed context. Existing
 * preview/catalog/archive exports and the four accepted nodes stay unchanged.
 * Only these two standalone cases are submitted for this review round.
 */
export const MOTILITY_TOPIC_SALVAGE_VERSION = "question-topic-esophagus-motility-achalasia.2026-11-11.salvage.v1";
const salvageDraft = { ...MOTILITY_TOPIC_DRAFT, contentVersion: MOTILITY_TOPIC_SALVAGE_VERSION };

function standalonePassItem(source: TopicCase, slug: string, nodeSlug: string): TopicCase {
  const node = source.nodes.find((node) => node.slug === nodeSlug);
  if (!node) throw new Error(`Missing PASS node for standalone salvage: ${nodeSlug}`);
  return { ...source, slug, nodes: [node] };
}

export const MOTILITY_TOPIC_SALVAGE_ITEMS: TopicCase[] = [
  standalonePassItem(
    MOTILITY_TOPIC_ITEMS.find((item) => item.slug === "spastic-course")!,
    "recurrent-clearance-standalone",
    "recurrent-clearance-test",
  ),
  standalonePassItem(
    MOTILITY_TOPIC_REVIEWED_V1_ITEMS.find((item) => item.slug === "failed-therapy-records")!,
    "salvage-before-resection-standalone",
    "salvage-before-resection",
  ),
];

const salvageBundle = buildBundle(MOTILITY_TOPIC_SALVAGE_ITEMS);
export const MOTILITY_TOPIC_SALVAGE_QUESTIONS = salvageBundle.questions;
export const MOTILITY_TOPIC_SALVAGE_CONCEPTS = salvageBundle.concepts;
export const MOTILITY_TOPIC_SALVAGE_AUTHORING_CONCEPTS = salvageBundle.authoring_concepts;
export const MOTILITY_TOPIC_SALVAGE_CASES = salvageBundle.cases;
export const MOTILITY_TOPIC_SALVAGE_TIMING_ENTRIES = salvageBundle.timing_entries;
export const MOTILITY_TOPIC_SALVAGE_ORDER_PROPOSALS = salvageBundle.order_proposals.map((record) => ({
  ...record,
  ...salvageDraft,
  status: "salvage" as const,
}));
export const MOTILITY_TOPIC_SALVAGE_SELF_CHECKS = salvageBundle.self_checks.map((record) => ({
  ...record,
  ...salvageDraft,
  status: "salvage" as const,
  authorVerdict: "SALVAGE_CONTEXT_FOR_INDEPENDENT_REVIEW",
  clinicalWordingChanged: false,
  addedPresentationText: false,
  predictedDifficulty: "moderate" as const,
  difficultyReason: record.questionVariantId.includes("recurrent-clearance-test")
    ? "Retains the independently passed distinction between normal post-treatment relaxation and unmeasured clearance, followed by ranking complementary investigations. Splitting the case adds no clinical difficulty claim."
    : "Retains the independently passed distinction between incomplete outlet treatment and exhausted reservoir function before choosing salvage rather than resection. Splitting the case adds no clinical difficulty claim.",
  sequenceAudit: "The standalone case has exactly one scored node. Its original presentation, fixed demographics, current update, task, choices and feedback remain verbatim. There is no preceding feedback or later-companion result in this context.",
  contextChange: "New case/presentation/profile identities; one scored node; its explanation becomes the case summary. The existing builder adds terminal dispositions using the unchanged distractor rationales. No clinical premise or option is added.",
  remainingRisk: `${record.remainingRisk} This standalone composition needs independent context re-review and manager acceptance; the prior editorial PASS is not clinical approval.`,
}));
export const MOTILITY_TOPIC_SALVAGE_STATEMENT_MAPPINGS = salvageBundle.statement_mappings.map((record) => ({
  ...record,
  ...salvageDraft,
  status: "salvage" as const,
  localMappingCheckedOn: "2026-11-11",
  evidenceReuse: "Exact existing clinical statements and claims reused; original source-access and claim-check dates preserved. No fresh source retrieval or new clinical assertion.",
}));
export const MOTILITY_TOPIC_SALVAGE_CASE_REVIEWS = salvageBundle.case_reviews.map((record) => ({
  ...record,
  ...salvageDraft,
  status: "salvage" as const,
  independentContextPass: false,
  clinicalApproval: false,
}));

export const MOTILITY_TOPIC_SALVAGE_DISPOSITIONS = [
  {
    ...salvageDraft,
    status: "salvage" as const,
    caseId: "case.topic.esophagus-motility-achalasia.recurrent-clearance-standalone.v1",
    nodeId: "node.topic.esophagus-motility-achalasia.recurrent-clearance-test.v2",
    questionVariantId: "question.topic.esophagus-motility-achalasia.recurrent-clearance-test.v2",
    sourceCaseId: "case.topic.esophagus-motility-achalasia.spastic-course.v1",
    sourceContext: "active" as const,
    independentPassFile: "docs/research/question-topic-esophagus-motility-achalasia-review2-20261111.json",
    excludedCompanionNodeIds: [
      "node.topic.esophagus-motility-achalasia.postpoem-reflux-response.v2",
      "node.topic.esophagus-motility-achalasia.spastic-procedure.v2",
    ],
  },
  {
    ...salvageDraft,
    status: "salvage" as const,
    caseId: "case.topic.esophagus-motility-achalasia.salvage-before-resection-standalone.v1",
    nodeId: "node.topic.esophagus-motility-achalasia.salvage-before-resection.v1",
    questionVariantId: "question.topic.esophagus-motility-achalasia.salvage-before-resection.v1",
    sourceCaseId: "case.topic.esophagus-motility-achalasia.failed-therapy-records.v1",
    sourceContext: "reviewed_v1" as const,
    independentPassFile: "docs/research/question-topic-esophagus-motility-achalasia-review-20261111.json",
    excludedCompanionNodeIds: [
      "node.topic.esophagus-motility-achalasia.end-stage-center-referral.v1",
      "node.topic.esophagus-motility-achalasia.end-stage-center-referral.v2",
    ],
  },
];

const salvageClaimIds = new Set(MOTILITY_TOPIC_SALVAGE_QUESTIONS.flatMap((question) => question.supportingEvidenceClaimIds));
export const MOTILITY_TOPIC_SALVAGE_CLAIMS = MOTILITY_TOPIC_CLAIMS.filter((claim) => salvageClaimIds.has(claim.id));
const salvageSourceIds = new Set(MOTILITY_TOPIC_SALVAGE_CLAIMS.flatMap((claim) => claim.sourceIds));
export const MOTILITY_TOPIC_SALVAGE_SOURCES = MOTILITY_TOPIC_SOURCES.filter((source) => salvageSourceIds.has(source.id));
export const MOTILITY_TOPIC_SALVAGE_SOURCE_LINKS = MOTILITY_TOPIC_SOURCE_LINKS.filter((link) => salvageSourceIds.has(link.sourceId));

export const MOTILITY_TOPIC_SALVAGE_SOURCE_RELEASE = validateSyntheticClinicalRelease({
  id: "clinical.synthetic.prototype.v1",
  schemaVersion: 1,
  publicationStatus: "synthetic_unapproved_prototype",
  disclaimer: "Synthetic standalone salvage contexts, not clinically approved. Melissa Rowland is the clinical sign-off.",
  concepts: MOTILITY_TOPIC_SALVAGE_CONCEPTS,
  cases: MOTILITY_TOPIC_SALVAGE_CASES,
});

export const MOTILITY_TOPIC_SALVAGE_MANIFEST = {
  ...salvageDraft,
  status: "salvage" as const,
  reviewDisplay: "key shown first for review only",
  acceptanceReceipt: "docs/research/question-topic-acceptance-batch3-dispositions-20261111.json",
  reviewQuestionVariantIds: MOTILITY_TOPIC_SALVAGE_QUESTIONS.map((question) => question.id),
  caseCount: MOTILITY_TOPIC_SALVAGE_CASES.length,
  nodeCount: MOTILITY_TOPIC_SALVAGE_QUESTIONS.length,
  newQuestionCount: 0,
  newConceptCount: 0,
  additionalTestingChoiceBindings: MOTILITY_TOPIC_SALVAGE_ORDER_PROPOSALS.length,
  clinicalWordingChanged: false,
  contextIndependentPass: false,
  managerAccepted: false,
  clinicalApproval: false,
  clinicalSignoff: "Melissa Rowland",
  integrationDependencies: [
    "Independently review only the two standalone salvage contexts; preserve their exact existing question/node/choice/concept IDs and all clinical wording.",
    "Use MOTILITY_TOPIC_SALVAGE_SOURCE_RELEASE for this round; the original mixed/held parent cases remain historical and do not accompany this submission.",
    "Register the three new recurrent-clearance case/timing/order bindings using the existing placeholder profiles, retaining old bindings.",
    "Preserve all four already accepted topic cases/nodes and their manifest/source-view records without change.",
    "After independent context PASS, manager acceptance and exact-version named clinical review remain separate decisions.",
  ],
};

/** One returned salvage context only. The reviewed salvage exports above,
 * including the independently passed resection-salvage case, remain exact.
 */
const clearanceSalvageBefore = MOTILITY_TOPIC_SALVAGE_ITEMS[0]!;
const clearanceNodeBefore = clearanceSalvageBefore.nodes[0]!;
export const MOTILITY_TOPIC_SALVAGE_REVISION_ITEMS: TopicCase[] = [{
  ...clearanceSalvageBefore,
  version: 2,
  nodes: [{
    ...clearanceNodeBefore,
    version: 3,
    identityDecision: "reuse",
    identityReason: "The clearance-assessment meaning is unchanged. This version explicitly supplies the documented treated-achalasia history and scopes feedback to it. Preserve the existing concept and retain the earlier question/context definitions.",
    reviewResponse: "State the original documented achalasia indication, replace the dangling later-record reference with direct postoperative reassessment, and confine the first-test rule to treated achalasia. Preserve the normal pressure findings, recurrent food hold-up, stable intake and three competing investigations.",
    currentUpdate: "Her original foregut records document achalasia treated with POEM, followed by a period of comfortable eating. At this postoperative reassessment, food again pauses and fluid returns at night. The completed repeat manometry has adequate junction-crossing positional acquisition, relaxation within the laboratory interval and no residual premature contractions. Her weight and oral hydration are maintained.",
    explanation: "After treatment of established achalasia, normal pressure relaxation does not establish adequate emptying when food hold-up recurs. Timed barium esophagography is the first-line objective reassessment in this setting. Endoscopy complements the clearance assessment by examining reflux injury or luminal narrowing; maintained weight and hydration do not exclude those causes.",
    reasoning: {
      ...clearanceNodeBefore.reasoning,
      interpret: "For documented treated achalasia, distinguish an adequate normal post-treatment relaxation measurement from the still-unmeasured clearance of food and liquid.",
      apply: "Rank objective emptying assessment first for recurrent symptoms after achalasia treatment, while recognizing that endoscopy complements it for injury or narrowing.",
      decidingObservation: "Documented achalasia treated with POEM, followed by recurrent food hold-up despite normal acquired relaxation; no objective clearance result is yet available.",
      deletionTest: "The original indication establishes why the achalasia follow-up pathway applies. Recurrent food hold-up supplies the unresolved functional problem. Adequate normal pressure findings test the error of equating relaxation with clearance. Maintained intake establishes stability without excluding mucosal disease or narrowing.",
      cueAttack: "Established achalasia is necessary prior history in this management task, not a diagnosis the learner is asked to discover. The update contains observations and chronology without naming the desired test or teaching its priority. All three parallel investigation labels and their credible competing targets are unchanged. No normal endoscopy or later clearance result is added.",
      difficultyReason: "The resident still has to interpret symptoms despite reassuring pressure findings, then rank clearance assessment against complementary endoscopy and reflux testing. Explicit indication repairs fairness without removing either inference. Retain the reviewer's qualitative moderate two-step prediction rather than inventing measured or guaranteed hard performance.",
      sequenceAudit: "One standalone postoperative reassessment. The update documents the original treated condition directly; no removed predecessor, prior feedback or later result is needed.",
      remainingRisk: "Melissa must confirm the exact first-investigation ranking in established treated achalasia. Endoscopy is complementary, and stable intake does not exclude its targets. This changed question/context version requires independent re-review and named clinical sign-off.",
    },
  }],
}];

const salvageRevisionBundle = buildBundle(MOTILITY_TOPIC_SALVAGE_REVISION_ITEMS);
export const MOTILITY_TOPIC_SALVAGE_REVISION_QUESTIONS = salvageRevisionBundle.questions;
export const MOTILITY_TOPIC_SALVAGE_REVISION_CONCEPTS = salvageRevisionBundle.concepts;
export const MOTILITY_TOPIC_SALVAGE_REVISION_AUTHORING_CONCEPTS = salvageRevisionBundle.authoring_concepts;
export const MOTILITY_TOPIC_SALVAGE_REVISION_CASES = salvageRevisionBundle.cases;
export const MOTILITY_TOPIC_SALVAGE_REVISION_TIMING_ENTRIES = salvageRevisionBundle.timing_entries;
export const MOTILITY_TOPIC_SALVAGE_REVISION_ORDER_PROPOSALS = salvageRevisionBundle.order_proposals.map((record) => ({
  ...record,
  ...salvageRevisionDraft,
  status: "salvage" as const,
}));
export const MOTILITY_TOPIC_SALVAGE_REVISION_SELF_CHECKS = salvageRevisionBundle.self_checks.map((record) => ({
  ...record,
  ...salvageRevisionDraft,
  status: "salvage" as const,
  authorVerdict: "SALVAGE_REVISION_FOR_INDEPENDENT_REVIEW",
  authorRevisionAttempts: 1,
  independent: false,
  clinicalApproval: false,
  reviewFile: "docs/research/question-topic-esophagus-motility-achalasia-review-salvage-20261111.json",
}));
export const MOTILITY_TOPIC_SALVAGE_REVISION_STATEMENT_MAPPINGS = salvageRevisionBundle.statement_mappings.map((record) => ({
  ...record,
  ...salvageRevisionDraft,
  status: "salvage" as const,
  localMappingCheckedOn: "2026-11-11",
  constructedObservations: "The manager explicitly confirms established achalasia as the original documented POEM indication. That patient-history premise is supplied directly, not inferred from POEM. Pressure findings, symptoms and intake remain unchanged constructed observations. Existing claims support the condition-specific investigation ranking.",
  evidenceReuse: "Existing permitted-source claims reused with original source-access and claim-check dates. No new source retrieval or clinical management rule.",
}));
export const MOTILITY_TOPIC_SALVAGE_REVISION_CASE_REVIEWS = salvageRevisionBundle.case_reviews.map((record) => ({
  ...record,
  ...salvageRevisionDraft,
  status: "salvage" as const,
  independentContextPass: false,
  clinicalApproval: false,
}));
export const MOTILITY_TOPIC_SALVAGE_REVISION_SOURCE_RELEASE = validateSyntheticClinicalRelease({
  id: "clinical.synthetic.prototype.v1",
  schemaVersion: 1,
  publicationStatus: "synthetic_unapproved_prototype",
  disclaimer: "Synthetic revised salvage context, not clinically approved. Melissa Rowland is the clinical sign-off.",
  concepts: MOTILITY_TOPIC_SALVAGE_REVISION_CONCEPTS,
  cases: MOTILITY_TOPIC_SALVAGE_REVISION_CASES,
});
export const MOTILITY_TOPIC_SALVAGE_REVISION_MANIFEST = {
  ...salvageRevisionDraft,
  status: "salvage" as const,
  caseId: MOTILITY_TOPIC_SALVAGE_REVISION_CASES[0]!.id,
  nodeId: MOTILITY_TOPIC_SALVAGE_REVISION_CASES[0]!.decisionNodes[0]!.id,
  questionVariantId: MOTILITY_TOPIC_SALVAGE_REVISION_QUESTIONS[0]!.id,
  previousCaseId: "case.topic.esophagus-motility-achalasia.recurrent-clearance-standalone.v1",
  previousQuestionVariantId: "question.topic.esophagus-motility-achalasia.recurrent-clearance-test.v2",
  sourceReleaseExport: "MOTILITY_TOPIC_SALVAGE_REVISION_SOURCE_RELEASE",
  reviewOnlyThese: true,
  caseCount: 1,
  nodeCount: 1,
  newConceptCount: 0,
  changedClinicalMeaning: false,
  preservedPassCaseId: "case.topic.esophagus-motility-achalasia.salvage-before-resection-standalone.v1",
  contextIndependentPass: false,
  managerAccepted: false,
  clinicalApproval: false,
  clinicalSignoff: "Melissa Rowland",
};
