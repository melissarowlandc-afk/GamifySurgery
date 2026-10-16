import { buildFamily,type FamilySpec } from "./family-builder"; import { variants } from "./spec-utils"; import { SOURCES } from "./source-catalog";
const R="claim.cirrhosis.multifactor-risk",O="claim.cirrhosis.optimize-decompensation";
const assessment=variants([
 {
  slug:"single-albumin",
  complaint:"Surgery risk review",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex} with cirrhosis, presents before elective hernia repair. A referral note asks whether one albumin result alone can determine operative risk; portal-hypertension history, decompensation, comorbidity, and procedure details have not yet been integrated.",
  stem:"Which assessment approach is most appropriate?",
  correct:["Perioperative risk review","Liver severity, portal hypertension, decompensation, procedure, comorbidity, and center factors all matter."],
  wrong:[["Use albumin as the sole decision","One laboratory value cannot capture perioperative cirrhosis risk."],["Use patient age as the sole decision","Age alone omits liver and procedure-specific factors."],["Use hernia size as the sole decision","Procedure anatomy alone omits liver severity and comorbidity."]],
  explanation:"Perioperative cirrhosis assessment combines liver, patient, procedure, and center factors rather than one marker.",
  claims:[R]},
 {
  slug:"compensated",
  complaint:"Elective surgery planning",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex} with compensated cirrhosis, presents to discuss elective nonhepatic surgery. There is no current ascites, encephalopathy, bleeding, or infection, and the procedure and cardiopulmonary comorbidities still need review.",
  stem:"Which next step best frames risk assessment?",
  correct:["Joint liver-procedure risk assessment","Compensation is favorable but does not replace procedure and comorbidity assessment."],
  wrong:[["Clear surgery from compensation alone","Compensated status does not by itself define total operative risk."],["Cancel every elective operation","Cirrhosis does not create a universal prohibition."],["Estimate risk from platelet count alone","One laboratory measure cannot replace a complete assessment."]],
  explanation:"A compensated profile still requires multidisciplinary review of liver status, procedure, comorbidity, and local expertise.",
  claims:[R]},
 {
  slug:"portal-hypertension",
  complaint:"Preoperative cirrhosis consult",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents before elective abdominal surgery with cirrhosis, prior variceal bleeding, thrombocytopenia, and splenomegaly. A generic risk score appears modest.",
  stem:"Which feature must remain central to the assessment?",
  correct:["Portal hypertension history","Portal-hypertension history adds risk information not erased by one composite score."],
  wrong:[["A composite liver-risk score alone","A score should not replace clinically important portal-hypertension findings."],["The planned procedure risk alone","Procedure risk matters but does not replace liver and patient assessment."],["The cardiopulmonary assessment alone","Comorbidity assessment matters but does not erase portal-hypertension risk."]],
  explanation:"Clinical portal-hypertension and decompensation history remain part of a multidimensional decision even when a score is available.",
  claims:[R]},
 {
  slug:"center-expertise",
  complaint:"Where to have surgery",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex} with cirrhosis and multiple comorbidities, presents about a complex elective operation proposed at a facility without hepatology support. Liver severity and procedure risk have been reviewed.",
  stem:"Which additional factor should influence planning?",
  correct:["Experienced multidisciplinary care","Center expertise and rescue capability are part of the perioperative decision."],
  wrong:[["Procedure complexity without facility review","Procedure complexity matters but does not establish available rescue capability."],["Liver severity without facility review","Liver severity matters but does not establish local multidisciplinary capability."],["Comorbidity burden without facility review","Comorbidity matters but does not determine whether the center has needed expertise."]],
  explanation:"Facility experience and multidisciplinary resources belong in the risk discussion for complex surgery in cirrhosis.",
  claims:[R]},
]);
const optimization=variants([
 {
  slug:"tense-ascites",
  complaint:"Hernia surgery timing",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex} with cirrhosis, presents for a nonurgent elective repair while tense ascites remains uncontrolled. There is no strangulation or obstruction.",
  stem:"Which plan is most appropriate now?",
  correct:["Optimize before elective surgery","Uncontrolled ascites supports multidisciplinary optimization before a nonurgent elective plan."],
  wrong:[["Proceed based on the clinic date","Scheduling does not override active decompensation."],["Cancel surgery permanently","The current issue is optimization and reassessment, not a universal prohibition."],["Use albumin alone to decide","One laboratory value cannot settle the timing decision."]],
  explanation:"For a nonurgent case, active ascites should be optimized with hepatology, anesthesia, and surgery before proceeding.",
  claims:[O]},
 {
  slug:"encephalopathy",
  complaint:"Elective operation review",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex} with cirrhosis, arrives for elective surgery clearance with new confusion and asterixis concerning for active encephalopathy. The proposed operation is not urgent.",
  stem:"Which disposition best fits this visit?",
  correct:["Pause the elective plan for evaluation","New decompensation requires prompt medical evaluation and optimization before elective surgery."],
  wrong:[["Proceed because vitals are stable","Stable vital signs do not neutralize active encephalopathy."],["Approve surgery from the diagnosis alone","Cirrhosis and encephalopathy require case-specific multidisciplinary review."],["Set a permanent no-surgery rule","The guideline supports optimization and reassessment rather than an automatic permanent ban."]],
  explanation:"Active encephalopathy changes a nonurgent plan to medical evaluation and multidisciplinary optimization.",
  claims:[O],
  acuity:"urgent"},
 {
  slug:"controlled-followup",
  complaint:"Optimization follow-up",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex} returns after multidisciplinary management of prior ascites. The patient is clinically compensated today, the elective procedure remains desired, and hepatology and anesthesia have updated their assessments.",
  stem:"Which next step is most appropriate?",
  correct:["Reassess the individualized operative plan","Improvement permits renewed risk-benefit review rather than automatic approval or permanent cancellation."],
  wrong:[["Proceed without reviewing updated risk","Optimization does not eliminate the need for a current shared assessment."],["Cancel permanently because ascites occurred","A prior episode does not create an automatic lifetime prohibition."],["Decide from one laboratory result","One test does not replace the multidisciplinary reassessment."]],
  explanation:"Optimization is followed by a fresh individualized decision using current liver, procedure, and patient factors.",
  claims:[R,O]},
 {
  slug:"urgent-different",
  complaint:"Painful incarcerated hernia",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex} with cirrhosis, presents with an acutely painful irreducible hernia, vomiting, and peritoneal tenderness. Ascites is also present.",
  stem:"Which planning principle applies?",
  correct:["Emergency surgical assessment","An acute surgical emergency is not managed like a deferrable elective case."],
  wrong:[["Delay until all cirrhosis risk is eliminated","Complete optimization cannot precede care for a possible strangulating emergency."],["Treat the risk score as a prohibition","A score informs risk but does not replace emergency assessment."],["Schedule routine hepatology follow-up only","Routine follow-up is inadequate for peritoneal signs and obstruction."]],
  explanation:"The optimization boundary applies to nonurgent elective surgery; acute surgical danger requires immediate hospital assessment with concurrent cirrhosis management.",
  claims:[O],
  acuity:"urgent"},
]);
const spec:FamilySpec={slug:"cirrhosis-perioperative",label:"Perioperative cirrhosis",pairing:{indices:[0],updates:["The multidimensional review identifies uncontrolled ascites in this nonurgent case without an acute surgical emergency."]},
  claims:[{id:R,statement:"Perioperative risk in cirrhosis depends on liver severity, portal hypertension and decompensation, procedure type, comorbidity, and center experience; no one score or laboratory value captures the whole decision.",sourceIds:[SOURCES.cirrhosis.id],category:"evaluation",limitation:"Single expert-review source; no fixed mortality estimate is taught.",population:"Adults with cirrhosis being considered for nonhepatic surgery."},{id:O,statement:"Active decompensation supports multidisciplinary optimization before proceeding with a nonurgent elective plan; deferral is an inferred case-specific boundary rather than an automatic prohibition.",sourceIds:[SOURCES.cirrhosis.id],category:"safety_boundary",limitation:"Urgent surgical emergencies require immediate assessment despite elevated risk.",population:"Adults with cirrhosis and a proposed nonurgent elective operation."}],sources:[SOURCES.cirrhosis],concepts:[{id:"concept.cirrhosis-perioperative-risk.multifactor-assessment",displayName:"Assess perioperative cirrhosis risk",learningObjective:"Use multidimensional liver, patient, procedure, and facility factors in perioperative cirrhosis assessment.",stage:0,educationalTier:1,conceptType:"workup",evidenceClaimIds:[R],variants:assessment},{id:"concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary",displayName:"Optimize active cirrhosis decompensation",learningObjective:"Pause a nonurgent elective plan for case-specific multidisciplinary optimization when active decompensation is present.",stage:0,educationalTier:1,conceptType:"management",evidenceClaimIds:[O],variants:optimization}]};
export const CIRRHOSIS_PERIOPERATIVE=buildFamily(spec);




















































