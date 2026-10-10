import type { EvidenceClaim } from "../../pilot-schema";
import { CHECKED_ON, NEEDS_REVIEW } from "./batch-helpers";
import { linkSourcesToClaims, S } from "./source-catalog";

const claimId = (slug: string) => `claim.pediatric-clinic.${slug}`;
export const C = {
  groinBulge: claimId("dynamic-groin-bulge"),
  groinReferral: claimId("clinical-groin-hernia-referral"),
  epigastric: claimId("epigastric-fat-defect"),
  umbilical: claimId("umbilical-location"),
  inguinalLocation: claimId("inguinal-location"),
  femoralLocation: claimId("femoral-location"),
  umbilicalConflict: claimId("umbilical-repair-age-disagreement"),
  reactiveNodes: claimId("reactive-child-neck-nodes"),
  nodeObservation: claimId("well-child-node-observation"),
  nodeSafetyNet: claimId("node-change-safety-net"),
  supraclavicular: claimId("supraclavicular-node-red-flag"),
  growingNode: claimId("growing-firm-node-red-flag"),
  nodeFever: claimId("unexplained-node-associated-fever"),
  nodeWeightLoss: claimId("unexplained-node-associated-weight-loss"),
  nodeNightSweats: claimId("unexplained-node-associated-night-sweats"),
  nodeSkinTether: claimId("cervical-node-skin-tethering"),
  nodeReferral: claimId("concerning-node-pediatric-review"),
  testisAscent: claimId("acquired-testis-ascent"),
  persistentHighTestis: claimId("nonmaintained-scrotal-position"),
  ascentReferral: claimId("ascending-testis-referral"),
  retractileDefinition: claimId("true-retractile-examination"),
  retractileFollowup: claimId("true-retractile-followup"),
  retractileAscent: claimId("retractile-ascent-surveillance"),
  retractileNoOperation: claimId("true-retractile-no-operation"),
  testisConflict: claimId("high-retractile-terminology-disagreement"),
  excavatumAppearance: claimId("pectus-excavatum-appearance"),
  excavatumSymptoms: claimId("pectus-exertional-symptoms"),
  excavatumEvaluation: claimId("symptomatic-pectus-evaluation"),
  excavatumUncertainty: claimId("pectus-physiologic-benefit-uncertainty"),
  carinatumAppearance: claimId("pectus-carinatum-appearance"),
  braceOption: claimId("carinatum-brace-option"),
  braceSelection: claimId("carinatum-brace-suitability"),
  braceEvidence: claimId("carinatum-brace-evidence-limitation"),
  pilonidalPattern: claimId("pilonidal-cleft-pattern"),
  pilonidalCare: claimId("limited-pilonidal-conservative-care"),
  pilonidalClean: claimId("pilonidal-cleft-cleanliness"),
  pilonidalMoisture: claimId("pilonidal-moisture-reduction"),
  pilonidalPressure: claimId("pilonidal-pressure-reduction"),
  pilonidalHair: claimId("pilonidal-individual-hair-plan"),
  pilonidalReassessment: claimId("pilonidal-response-reassessment"),
  pilonidalInfection: claimId("pilonidal-acute-infection-distinction"),
  childInformation: claimId("developmentally-appropriate-information"),
  childAssent: claimId("invite-child-participation-and-assent"),
  voluntaryDiscussion: claimId("noncoercive-child-discussion"),
  consentBoundary: claimId("assent-legal-consent-boundary"),
} as const;

function claim(id: string, statement: string, sourceIds: string[], evidenceCategory: EvidenceClaim["evidenceCategory"], applicablePopulation: string, limitation: string, certainty: EvidenceClaim["certainty"] = "moderate"): EvidenceClaim {
  return { ...NEEDS_REVIEW, id, statement, sourceIds, evidenceCategory, certainty, limitation, applicablePopulation, lastCheckedOn: CHECKED_ON };
}
const nodes = "Children younger than 16 years with cervical lymphadenopathy, within the cited local pathway.";
const nodeLimit = "One current eligible local NHS guideline was fully verified; no independent national management guideline was admitted. No numeric size or duration rule is generalized.";
const pectusLimit = "One eligible pediatric narrative review was fully verified; no current independent society guideline was admitted. Referral does not establish symptom causation or an indication for surgery.";
const pilonidalLimit = "One eligible pediatric expert perspective, not a formal guideline. Plan and escalation are individualized; no comparative superiority, exact interval, medication or hair-removal regimen is taught.";
const assentLimit = "One reaffirmed Canadian society statement. Used for ethical participation only; legal decision-maker, capacity, privacy and refusal rules are jurisdiction- and context-dependent. Parent placement is an owner prototype constraint, not a universal clinical recommendation.";

export const PEDIATRIC_CLINIC_CLAIMS: EvidenceClaim[] = [
  claim(C.groinBulge, "A groin hernia can produce an intermittent bulge that becomes more evident with strain and less evident while lying down.", [S.nhsHernia, S.cornwallSurgery], "presentation", "School-age children and adolescents with a suspected groin hernia.", "General NHS bulge facts are cross-checked with a child-specific referral pathway; the narrative does not prescribe a reduction maneuver."),
  claim(C.groinReferral, "A clinically suspected childhood inguinal hernia warrants pediatric surgical referral based on the history or examination.", [S.cornwallSurgery], "disposition", "Children with a clinically apparent or parent-reported inguinal hernia.", "One eligible local NHS referral pathway, partially updated in 2025; its displayed 2026 review date is not assumed to be a completed update. No independent national pediatric management guideline was admitted. No operative deadline or technique is taught."),
  claim(C.epigastric, "An epigastric hernia is a focal upper-midline abdominal-wall defect through which fat may protrude.", [S.goshHernia], "anatomy", "Children with a focal upper-midline abdominal-wall lump.", "One eligible specialist hospital anatomy source, last reviewed in 2016. Its repair timing and outcome statements are not adopted."),
  claim(C.umbilical, "An umbilical hernia is centered at or near the navel.", [S.nhsUmbilical, S.goshHernia, S.nhsHernia], "anatomy", "Children with a focal abdominal-wall lump.", "Location is used to distinguish the illustrated epigastric finding; no repair-age rule is inferred."),
  claim(C.inguinalLocation, "An inguinal hernia is located in the groin.", [S.nhsHernia], "anatomy", "Patients with an abdominal-wall or groin lump.", "General anatomical cross-check only; adult management is not transferred to children."),
  claim(C.femoralLocation, "A femoral hernia is located in the upper thigh near the groin.", [S.nhsHernia], "anatomy", "Patients with an abdominal-wall or groin lump.", "General anatomical cross-check only; no pediatric prevalence, risk estimate or repair rule is taught."),
  claim(C.umbilicalConflict, "The checked NHS and GOSH sources do not give a uniform age for considering persistent childhood umbilical hernia repair.", [S.nhsUmbilical, S.goshHernia, S.cornwallSurgery], "management", "Children with a persistent umbilical hernia.", "Withheld from questions. NHS patient guidance discusses persistence at age 5, dated GOSH information discusses age 3, and Cornwall lists repair no earlier than age 4 alongside a narrower review policy. These are source positions, not averaged recommendations.", "conflicting"),
  claim(C.reactiveNodes, "Reactive cervical lymph nodes commonly accompany childhood viral illnesses.", [S.cornwallNodes], "presentation", nodes, nodeLimit),
  claim(C.nodeObservation, "A well child with small mobile cervical nodes and no concerning findings can be observed with reassurance and safety-net advice.", [S.cornwallNodes], "management", nodes, nodeLimit),
  claim(C.nodeSafetyNet, "Node enlargement or new systemic symptoms should prompt reassessment during observation of childhood cervical lymphadenopathy.", [S.cornwallNodes], "safety_boundary", nodes, nodeLimit),
  claim(C.supraclavicular, "Supraclavicular lymphadenopathy is a concerning finding in a child.", [S.cornwallNodes], "evaluation", nodes, nodeLimit),
  claim(C.growingNode, "Rapid growth or a firm abnormal cervical node is a concerning finding in a child.", [S.cornwallNodes], "evaluation", nodes, nodeLimit),
  claim(C.nodeFever, "Unexplained fever accompanying childhood cervical lymphadenopathy is a concerning systemic finding.", [S.cornwallNodes], "evaluation", nodes, nodeLimit),
  claim(C.nodeWeightLoss, "Unexplained weight loss accompanying childhood cervical lymphadenopathy is a concerning systemic finding.", [S.cornwallNodes], "evaluation", nodes, nodeLimit),
  claim(C.nodeNightSweats, "Unexplained night sweating accompanying childhood cervical lymphadenopathy is a concerning systemic finding.", [S.cornwallNodes], "evaluation", nodes, nodeLimit),
  claim(C.nodeSkinTether, "Skin tethering associated with an abnormal cervical node is a concerning finding in a child.", [S.cornwallNodes], "evaluation", nodes, nodeLimit),
  claim(C.nodeReferral, "Concerning childhood cervical lymphadenopathy merits early pediatric discussion or assessment.", [S.cornwallNodes], "disposition", nodes, `${nodeLimit} A red flag does not by itself diagnose malignancy or specify biopsy.`),
  claim(C.testisAscent, "A testis previously documented in the scrotum can subsequently acquire a persistently higher position.", [S.cuaTestis, S.cornwallSurgery], "presentation", "Boys with a previously scrotal testis and a newly abnormal position.", "Prior documentation informs the acquired-ascent distinction; no risk percentage or age threshold is assigned."),
  claim(C.persistentHighTestis, "A testis that cannot be maintained in a normal scrotal position does not meet the cited definition of a true retractile testis.", [S.cuaTestis], "evaluation", "Boys undergoing a clinical testicular-position examination.", "The examination definition is narrow. The batch does not resolve all high-scrotal, gliding or persistently retractile terminology."),
  claim(C.ascentReferral, "Suspected acquired testicular ascent warrants specialist pediatric urologic or surgical assessment.", [S.cuaTestis, S.cornwallSurgery], "disposition", "Boys with suspected acquired testicular ascent.", "A society guideline and a later local NHS pathway agree on assessment. Operation timing and technique remain outside this batch."),
  claim(C.retractileDefinition, "A true retractile testis can be placed in the normal scrotal position without tension and remains there after release.", [S.cuaTestis], "evaluation", "Boys with intermittent testicular retraction.", "A society examination definition; a persistently high or immediately reascending testis is excluded from the authored true-retractile profiles."),
  claim(C.retractileFollowup, "A true retractile testis requires documented follow-up examination of its position.", [S.cuaTestis, S.cuhTestis], "management", "Boys with a clinically confirmed true retractile testis.", "Independent society and NHS sources support surveillance. No exact surveillance interval is embedded in question prose."),
  claim(C.retractileAscent, "Surveillance of a retractile testis should identify acquired ascent requiring referral.", [S.cuaTestis, S.cornwallSurgery], "safety_boundary", "Boys followed for a true retractile testis.", "No invented ascent probability, deadline or automatic operative trigger is assigned."),
  claim(C.retractileNoOperation, "The cited CUA-PUC guideline does not recommend operative treatment of a true retractile testis.", [S.cuaTestis, S.cuhTestis], "management", "Boys whose testis meets the true-retractile examination definition.", "Applies only to the explicitly defined true-retractile profile, not all high or persistently retractile testes."),
  claim(C.testisConflict, "The checked guidance uses high or persistently retractile testis terminology differently when discussing surgical indications.", [S.cuaTestis, S.cornwallSurgery, S.cuhTestis], "management", "Boys described as having high or persistently retractile testes.", "Withheld from questions. Cornwall lists these terms among surgical indications; CUA-PUC excludes surgery for a true retractile testis, and CUH describes observation. Clinician review must distinguish the actual examination phenotype before extending a rule.", "conflicting"),
  claim(C.excavatumAppearance, "Pectus excavatum has an inward depression of the anterior chest wall.", [S.pectusReview], "anatomy", "Children and adolescents with pectus excavatum.", pectusLimit),
  claim(C.excavatumSymptoms, "Exercise intolerance or exertional breathlessness can be reported by adolescents with pectus excavatum.", [S.pectusReview], "presentation", "Adolescents with pectus excavatum.", pectusLimit),
  claim(C.excavatumEvaluation, "Symptomatic pectus excavatum warrants evaluation of possible cardiopulmonary effects before a treatment decision.", [S.pectusReview], "evaluation", "Stable adolescents with pectus excavatum and exertional symptoms.", pectusLimit),
  claim(C.excavatumUncertainty, "Physiologic impairment and improvement after pectus excavatum repair are not consistently demonstrated across the reviewed studies.", [S.pectusReview], "management", "Children and adolescents considering pectus excavatum treatment.", "The disagreement in the review is preserved; guaranteed causation or postoperative functional benefit is withheld.", "low"),
  claim(C.carinatumAppearance, "Pectus carinatum produces an outward prominence of the anterior chest wall.", [S.shtgBrace, S.alderBrace], "anatomy", "Children and adolescents with pectus carinatum.", "The authored profile describes a stable chest-wall finding without an acute chest complaint."),
  claim(C.braceOption, "External chest-wall bracing is a potential nonsurgical treatment for selected young people with pectus carinatum.", [S.shtgBrace, S.alderBrace], "management", "Children and young people with pectus carinatum considering treatment.", "Government assessment plus specialist orthotics information; suitability and preferences matter. Bracing is not guaranteed effective or appropriate for every patient."),
  claim(C.braceSelection, "Brace assessment for pectus carinatum considers chest-wall flexibility and willingness to follow the treatment plan.", [S.shtgBrace], "evaluation", "Children and young people being assessed for pectus carinatum bracing.", "No compression pressure, wear duration, age cutoff or clinic fitting procedure is authored."),
  claim(C.braceEvidence, "The assessed pectus carinatum bracing evidence is mainly observational and heterogeneous.", [S.shtgBrace], "management", "Children and young people considering pectus carinatum treatment.", "No exact success probability, comparative superiority or mandatory treatment is taught.", "low"),
  claim(C.pilonidalPattern, "Natal-cleft midline pits with intermittent drainage are compatible with chronic pilonidal disease.", [S.pilonidal], "presentation", "Adolescents with a natal-cleft complaint.", pilonidalLimit),
  claim(C.pilonidalCare, "Limited adolescent pilonidal disease without an acute abscess can initially be managed with an individualized conservative care plan.", [S.pilonidal], "management", "Adolescents with limited pilonidal disease and no current acute infection.", pilonidalLimit),
  claim(C.pilonidalClean, "Cleft cleanliness is a component of conservative pilonidal care.", [S.pilonidal], "management", "Adolescents receiving conservative pilonidal care.", pilonidalLimit),
  claim(C.pilonidalMoisture, "Reducing retained moisture in the cleft is a component of conservative pilonidal care.", [S.pilonidal], "management", "Adolescents receiving conservative pilonidal care.", pilonidalLimit),
  claim(C.pilonidalPressure, "Reducing prolonged direct pressure on the affected cleft can be discussed during conservative pilonidal care.", [S.pilonidal], "management", "Adolescents receiving conservative pilonidal care.", pilonidalLimit),
  claim(C.pilonidalHair, "Hair management can be discussed as part of an individualized conservative pilonidal plan.", [S.pilonidal], "management", "Adolescents receiving conservative pilonidal care.", `${pilonidalLimit} A universal razor, laser or depilatory protocol is withheld.`),
  claim(C.pilonidalReassessment, "Persistent symptoms or substantial disease burden should trigger reassessment of a conservative pilonidal plan.", [S.pilonidal], "management", "Adolescents followed for pilonidal disease.", pilonidalLimit),
  claim(C.pilonidalInfection, "An acute pilonidal abscess represents a different management situation from limited disease without acute infection.", [S.pilonidal], "safety_boundary", "Adolescents with pilonidal disease.", `${pilonidalLimit} This batch has no acute abscess procedure, antibiotic or pediatric sedation flow.`),
  claim(C.childInformation, "Children should receive information about proposed care in language suited to their understanding.", [S.cpsAssent], "management", "School-age children participating in a nonurgent clinic visit.", assentLimit),
  claim(C.childAssent, "A child's views and developmentally appropriate assent should be invited during nonurgent care discussions.", [S.cpsAssent], "management", "School-age children discussing nonurgent care with a parent present.", assentLimit),
  claim(C.voluntaryDiscussion, "Meaningful pediatric participation requires an opportunity for questions without coercion.", [S.cpsAssent], "management", "School-age children participating in nonurgent care discussions.", assentLimit),
  claim(C.consentBoundary, "Developmentally appropriate assent does not establish a universal legal-consent rule for all children.", [S.cpsAssent], "safety_boundary", "Children and families discussing nonurgent care.", assentLimit),
];

export const PEDIATRIC_CLINIC_SOURCES = linkSourcesToClaims(PEDIATRIC_CLINIC_CLAIMS);

export function labelsForClaims(ids: string[]) {
  const sourceIds = new Set(ids.flatMap((id) => PEDIATRIC_CLINIC_CLAIMS.find((claim) => claim.id === id)?.sourceIds ?? []));
  return PEDIATRIC_CLINIC_SOURCES.filter((source) => sourceIds.has(source.id)).map((source) => source.id);
}

export const WITHHELD_DISAGREEMENTS = [
  {
    ...NEEDS_REVIEW, id: "conflict.pediatric-clinic.umbilical-repair-age", claimId: C.umbilicalConflict,
    disputedTeachingPointWithheld: true,
    topic: "A fixed childhood umbilical-hernia repair age or mandatory age-based referral rule",
    decision: "No question authored. Preserve the different source positions for named clinician review; do not average ages or imply the oldest source controls.",
  },
  {
    ...NEEDS_REVIEW, id: "conflict.pediatric-clinic.high-retractile-terminology", claimId: C.testisConflict,
    disputedTeachingPointWithheld: true,
    topic: "A universal operation rule for any testis called high or persistently retractile",
    decision: "Questions use only a strict true-retractile examination or a previously scrotal testis that cannot stay down. Broader terminology requires named clinician resolution.",
  },
];

export const WITHHELD_TOPICS = [
  { ...NEEDS_REVIEW, id: "withheld.pediatric-clinic.varicocele", topic: "Adolescent varicocele intervention thresholds", reason: "Current EAU material was excluded by its AI-use terms; an adequate current independent eligible management source was not verified in this bounded pass." },
  { ...NEEDS_REVIEW, id: "withheld.pediatric-clinic.hydrocele", topic: "School-age hydrocele management", reason: "One local referral source was found; independent age-appropriate corroboration and differentiation were not completed. Deferred rather than borrowing infant observation rules." },
  { ...NEEDS_REVIEW, id: "withheld.pediatric-clinic.umbilical-timing", topic: "Umbilical repair age", reason: "Eligible source disagreement is preserved in conflict.pediatric-clinic.umbilical-repair-age; the planned timing/referral concept was dropped." },
  { ...NEEDS_REVIEW, id: "withheld.pediatric-clinic.pilonidal-regimen", topic: "Exact pilonidal hair-removal method or interval", reason: "A single expert perspective does not support a universal comparative regimen. No exact protocol or prophylactic medication rule was authored." },
  { ...NEEDS_REVIEW, id: "withheld.pediatric-clinic.pectus-outcomes", topic: "Pectus operative indications or guaranteed exercise benefit", reason: "The eligible review preserves disagreement about physiologic effects; an independent current guideline was not fully verified. Referral assessment only." },
  { ...NEEDS_REVIEW, id: "withheld.pediatric-clinic.adolescent-confidentiality", topic: "Adolescent privacy, refusal and legal consent", reason: "The owner prototype keeps one parent in the room. Confidentiality, mature-minor status and refusal require context and jurisdiction review; no universal same-room clinical rule is taught." },
  { ...NEEDS_REVIEW, id: "withheld.pediatric-clinic.test-procedure-flows", topic: "Pediatric testing, MRI, sedation, procedures and infant cases", reason: "Outside the approved outpatient examination/referral and current art scope; pediatric test routes and parent-placement contracts are not admitted here." },
];

/** Rights/access exclusions, not medical evidence and not placeholders for citations. */
export const EXCLUDED_SOURCE_CHECKS = [
  { ...NEEDS_REVIEW, id: "excluded.pediatric-clinic.acs", organization: "American College of Surgeons", officialUrl: "https://www.facs.org/general-terms/", reason: "Terms restrict incorporating ACS content/data/information into AI applications without permission; excluded from evidence." },
  { ...NEEDS_REVIEW, id: "excluded.pediatric-clinic.eau", organization: "European Association of Urology", officialUrl: "https://uroweb.org/disclaimer", reason: "Guideline copyright/terms prohibit AI incorporation without permission; excluded from evidence." },
  { ...NEEDS_REVIEW, id: "excluded.pediatric-clinic.rch-melbourne", organization: "Royal Children's Hospital Melbourne", officialUrl: "https://www.rch.org.au/terms-and-conditions/", reason: "Terms prohibit automated robot/scraper access; excluded from evidence. This is a different institution from Cornwall's RCHT." },
  { ...NEEDS_REVIEW, id: "excluded.pediatric-clinic.bmj-epigastric", organization: "World Journal of Pediatric Surgery / BMJ", officialUrl: "https://doi.org/10.1136/wjps-2022-000544", reason: "Additional AI/TDM rights language and full-text access could not be reconciled in this pass; excluded rather than relying on a snippet or assuming a PMC license settles terms." },
];
