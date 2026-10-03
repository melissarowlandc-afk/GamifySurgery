import { buildFamily,type FamilySpec } from "./family-builder"; import { variants } from "./spec-utils"; import { SOURCES } from "./source-catalog";
const R="claim.nutrition.screen",F="claim.nutrition.referral",E="claim.nutrition.oral-enteral",P="claim.nutrition.pn-boundary";
const screening=variants([
 {
  slug:"poor-intake-loss",
  complaint:"Nutrition before surgery",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents before major elective surgery and reports reduced intake with unintentional weight loss and declining functional strength. No structured nutritional-risk assessment has been completed.",
  stem:"Which next step is most appropriate?",
  correct:["Structured nutrition-risk assessment","The clinical history warrants formal preoperative nutritional assessment and individualized planning."],
  wrong:[["Use serum albumin as the only screen","One laboratory value is not a complete nutrition assessment."],["Wait for postoperative weight loss","Risk should be identified before major surgery when possible."],["Prescribe one supplement without assessment","A universal product does not replace patient-specific evaluation."]],
  explanation:"Assess nutritional risk before major surgery using a structured clinical process and refer identified risk for individualized planning.",
  claims:[R,F]},
 {
  slug:"albumin-only",
  complaint:"Low albumin before surgery",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents before elective surgery with a low albumin value during active inflammatory disease. Intake, weight trajectory, function, and gastrointestinal tolerance have not been assessed.",
  stem:"Which interpretation is most appropriate?",
  correct:["Albumin alone is not a nutrition diagnosis","The result may mark risk but cannot replace structured clinical assessment."],
  wrong:[["Severe malnutrition is proven by albumin","Inflammation and illness affect albumin, so the value alone is not diagnostic."],["Nutrition risk is excluded by normal weight","Body weight alone does not capture intake or recent change."],["Parenteral nutrition is automatically required","One laboratory result does not select a feeding route."]],
  explanation:"Use the laboratory result within a broader nutritional assessment rather than treating it as a standalone diagnosis or route decision.",
  claims:[R]},
 {
  slug:"apparently-well",
  complaint:"Preoperative assessment",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents before major elective surgery with stable weight, adequate intake, preserved function, and no gastrointestinal limitation. A structured preoperative assessment is being completed.",
  stem:"Which conclusion best fits the current information?",
  correct:["No major nutritional risk identified today","The structured clinical review does not identify current high-risk features."],
  wrong:[["Nutrition assessment is unnecessary for surgery","Assessment is still part of preoperative planning even when risk is not found."],["Albumin must determine the final answer","No single laboratory value replaces the clinical process."],["Parenteral nutrition should begin routinely","Routine PN is not indicated with adequate intake and a functional gut."]],
  explanation:"A structured screen can identify low current risk without implying that screening itself was unnecessary.",
  claims:[R]},
 {
  slug:"positive-screen",
  complaint:"Weight loss before operation",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents before elective gastrointestinal surgery with reduced intake, unintentional weight loss, and weakness. The operation is nonurgent and the gastrointestinal tract remains functional.",
  stem:"Which response to the positive risk assessment is best?",
  correct:["Individualized nutrition planning","Dietitian and perioperative review should define a feasible oral or enteral plan."],
  wrong:[["Choose parenteral nutrition immediately","A functional gastrointestinal tract favors oral or enteral strategies first."],["Ignore risk until hospital admission","Preoperative risk should be addressed when time and clinical status permit."],["Use one standard supplement for everyone","Nutrition support should be individualized rather than product-driven."]],
  explanation:"A positive assessment leads to individualized preoperative nutrition planning rather than an automatic route or product.",
  claims:[F,E]},
]);
const route=variants([
 {
  slug:"oral-possible",
  complaint:"Improve intake before surgery",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, returns after nutritional-risk assessment before nonurgent elective surgery. The gastrointestinal tract functions, swallowing is safe, and the patient can eat but current intake is inadequate.",
  stem:"Which nutrition route should be tried first?",
  correct:["Oral food and oral supplements","When eating is safe and the gut functions, oral strategies are preferred first."],
  wrong:[["Immediate exclusive parenteral nutrition","PN is not first line when oral intake remains feasible."],["Routine feeding-tube placement","Enteral access is not the first step when oral intake can be improved."],["No nutrition support until surgery","Identified risk and inadequate intake warrant an active plan."]],
  explanation:"Use the least invasive effective route: improve oral intake and supplements before escalating.",
  claims:[E,P]},
 {
  slug:"oral-inadequate",
  complaint:"Inadequate oral intake",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents before elective surgery with a functional gastrointestinal tract and safe enteral access, but oral intake remains inadequate despite an individualized oral plan.",
  stem:"Which route is preferred next?",
  correct:["Enteral nutrition through the gut","A functional gut favors enteral support when oral intake is inadequate."],
  wrong:[["Exclusive parenteral nutrition first","PN is reserved for oral and enteral infeasibility or inadequacy."],["Stop nutrition intervention","Persistent inadequate intake still requires support."],["Choose the route from albumin alone","A laboratory value does not determine gastrointestinal-route feasibility."]],
  explanation:"Escalate from inadequate oral intake to enteral nutrition when the gastrointestinal tract can be used.",
  claims:[E,P]},
 {
  slug:"obstruction",
  complaint:"Nutrition with obstruction",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, is seen by the hospital surgical team before necessary surgery with a documented nonfunctional gastrointestinal tract and no safe oral or enteral route. The surgical and nutrition teams are assessing support.",
  stem:"Which route boundary is most appropriate?",
  correct:["Assess parenteral nutrition","Documented gastrointestinal nonfunction can make oral and enteral routes infeasible."],
  wrong:[["Oral supplementation despite infeasibility","Oral feeding is not safe or feasible when the gastrointestinal tract is nonfunctional."],["Enteral nutrition without a safe route","Enteral use requires a safe feasible route and functioning tract."],["No nutrition planning before surgery","Infeasibility of oral and enteral routes triggers an alternative-route assessment."]],
  explanation:"PN is considered when oral and enteral routes are infeasible or contraindicated; this objective does not teach a fixed duration or formula.",
  claims:[P]},
 {
  slug:"functional-gut-pn-request",
  complaint:"Request for IV nutrition",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, returns before elective surgery with documented nutritional risk and inadequate intake, asking for intravenous nutrition. Swallowing is safe, the gastrointestinal tract functions, and no individualized oral or enteral trial has been attempted.",
  stem:"Which counseling response is best?",
  correct:["Use oral or enteral nutrition before PN","A functional usable gut supports oral and then enteral strategies before parenteral nutrition."],
  wrong:[["Start PN because it is intravenous","Route convenience does not override gastrointestinal feasibility."],["Avoid all preoperative nutrition support","Nutritional risk still warrants an individualized plan."],["Select PN from one albumin result","A single laboratory value does not establish route infeasibility."]],
  explanation:"Parenteral nutrition is not routine when oral or enteral feeding is feasible.",
  claims:[E,P]},
]);
const spec:FamilySpec={slug:"preoperative-nutrition",label:"Preoperative nutrition",pairing:{indices:[0],updates:["Structured assessment confirms nutritional risk, while swallowing remains safe and the gastrointestinal tract functions; oral intake is inadequate but possible."]},
  claims:[{id:R,statement:"Nutritional status should be assessed before major surgery with a structured clinical process; albumin alone is not treated as a nutrition diagnosis.",sourceIds:[SOURCES.nutritionEspen.id],category:"evaluation",limitation:"Single older permitted guideline; no proprietary screening tool or exact cutoff is reproduced.",population:"Adults preparing for major surgery."},{id:F,statement:"Identified preoperative nutritional risk supports dietitian and perioperative-team assessment with an individualized nutrition plan.",sourceIds:[SOURCES.nutritionEspen.id],category:"management",limitation:"No universal supplement, formula, or duration is prescribed.",population:"Adults with preoperative nutritional risk."},{id:E,statement:"When the gastrointestinal tract functions, oral intake and oral supplements are preferred first, with enteral nutrition used when oral intake is inadequate.",sourceIds:[SOURCES.nutritionEspen.id],category:"management",limitation:"Route choice remains individualized.",population:"Nutritionally at-risk adult surgical patients with a functional gastrointestinal tract."},{id:P,statement:"Parenteral nutrition is reserved for situations in which oral and enteral routes are infeasible, contraindicated, or insufficient.",sourceIds:[SOURCES.nutritionEspen.id],category:"safety_boundary",limitation:"No fixed timing, formulation, or dose is taught.",population:"Adult surgical patients needing nutrition support."}],sources:[SOURCES.nutritionEspen],concepts:[{id:"concept.preoperative-nutrition.nutritional-risk-screening",displayName:"Assess preoperative nutritional risk",learningObjective:"Use structured clinical nutritional-risk assessment before major surgery rather than albumin alone.",stage:0,educationalTier:0,conceptType:"workup",evidenceClaimIds:[R,F],variants:screening},{id:"concept.preoperative-nutrition.oral-enteral-first-line",displayName:"Choose oral or enteral nutrition before PN",learningObjective:"Prefer oral and then enteral nutrition when the gastrointestinal tract is functional, reserving PN for infeasibility.",stage:0,educationalTier:1,conceptType:"management",evidenceClaimIds:[E,P],variants:route}]};
export const PREOPERATIVE_NUTRITION=buildFamily(spec);




















































