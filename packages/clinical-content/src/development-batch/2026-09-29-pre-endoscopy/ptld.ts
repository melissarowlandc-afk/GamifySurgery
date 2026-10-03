import { buildFamily,type FamilySpec } from "./family-builder"; import { variants } from "./spec-utils"; import { SOURCES } from "./source-catalog";
const R="claim.ptld.pattern",T="claim.ptld.tissue";
const pattern=variants([
 {
  slug:"nodes-fever",
  complaint:"Fever and neck nodes",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex} with a kidney transplant, presents with persistent unexplained fever, weight loss, and enlarging cervical nodes while receiving immunosuppression. No localized bacterial source is evident.",
  stem:"Which process must be included in the prompt transplant differential?",
  correct:["Post-transplant lymphoproliferative disorder","The transplant context with unexplained systemic symptoms and lymphadenopathy warrants PTLD evaluation."],
  wrong:[["Opportunistic infection with generalized lymphadenitis","Infection remains a mimic, but no localized infectious source explains the progressive pattern."],["Medication toxicity with reactive nodes","Medication effects alone do not explain progressive nodal enlargement and systemic symptoms."],["Allograft rejection with reactive nodes","Rejection remains a consideration but does not explain the full pattern without evaluation."]],
  explanation:"PTLD has heterogeneous presentations; persistent unexplained fever and lymphadenopathy in a transplant recipient require prompt transplant-team evaluation while infection and rejection remain in the differential.",
  claims:[R]},
 {
  slug:"organ-dysfunction",
  complaint:"Transplant organ dysfunction",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex} with a liver transplant, presents with new graft dysfunction and an outside scan describing an unexplained extranodal mass. Infection testing is still in progress.",
  stem:"Which diagnostic category should be raised now?",
  correct:["Post-transplant lymphoproliferative disorder","Unexplained organ dysfunction plus an extranodal mass in a transplant recipient can represent PTLD."],
  wrong:[["Allograft rejection with inflammatory mass","Rejection is a mimic, but the unexplained extranodal mass requires broader evaluation."],["Opportunistic infection with inflammatory mass","Infection remains a mimic but is not yet established."],["Benign post-transplant inflammatory lesion","A new extranodal mass with graft dysfunction requires active evaluation."]],
  explanation:"PTLD can be extranodal and can present with organ dysfunction; the finding triggers evaluation rather than a definitive diagnosis from imaging alone.",
  claims:[R]},
 {
  slug:"rising-ebv",
  complaint:"Review transplant laboratory trend",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex} with a heart transplant, reviews rising EBV viremia and new constitutional symptoms but has no tissue diagnosis or completed staging.",
  stem:"Which interpretation is most appropriate?",
  correct:["PTLD requiring diagnostic evaluation","The combination raises concern, but EBV testing alone does not establish PTLD."],
  wrong:[["PTLD proven by EBV alone","Viremia is supportive rather than a substitute for tissue diagnosis."],["PTLD excluded without enlarged nodes","PTLD may be extranodal and heterogeneous."],["Routine transplant follow-up only","New symptoms and a rising trend warrant prompt transplant-team assessment."]],
  explanation:"Rising EBV viremia can support concern, but diagnosis and classification require further evaluation and tissue pathology.",
  claims:[R,T]},
 {
  slug:"infection-mimic",
  complaint:"Fever after transplant",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex} with a lung transplant, presents with fever, cough, and a focal pulmonary infiltrate. There is no mass, lymphadenopathy, organ dysfunction, or EBV trend yet, and cultures are pending.",
  stem:"Which framing is most appropriate?",
  correct:["Evaluate infection and rejection","A focal infectious presentation should be evaluated without declaring PTLD from transplant status alone."],
  wrong:[["Diagnose PTLD from fever alone","Fever is nonspecific and does not establish a lymphoproliferative disorder."],["Exclude PTLD permanently","The current presentation does not permanently exclude a later or occult process."],["Diagnose rejection from cough alone","Cough and an infiltrate do not establish rejection without further assessment."]],
  explanation:"Transplant recipients have important mimics; clinical findings guide the immediate evaluation while PTLD remains a context-dependent concern.",
  claims:[R]},
]);
const tissue=variants([
 {
  slug:"accessible-node",
  complaint:"Plan node evaluation",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex} with a solid-organ transplant, presents with persistent unexplained lymphadenopathy and a completed scan showing an accessible enlarged node. PTLD is suspected but not classified.",
  stem:"Which next diagnostic plan is most appropriate?",
  correct:["Coordinate transplant-team biopsy","Histopathology is needed to diagnose and classify suspected PTLD."],
  wrong:[["Diagnose PTLD from imaging alone","Imaging cannot provide the required tissue classification."],["Diagnose PTLD from EBV DNA alone","EBV testing is supportive and does not replace pathology."],["Change immunosuppression without coordination","Management changes require transplant-team involvement and a defined diagnostic plan."]],
  explanation:"Coordinate external transplant/hematology evaluation and tissue sampling; this clinic does not invent a biopsy service or act on imaging alone.",
  claims:[T]},
 {
  slug:"extranodal-mass",
  complaint:"Review mass imaging",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex} with a kidney transplant, reviews imaging that shows an extranodal bowel mass. EBV DNA is detectable, but no pathology has been obtained.",
  stem:"Which result is still required for diagnosis and classification?",
  correct:["Tissue pathology","Histopathologic examination is required to classify suspected PTLD."],
  wrong:[["A repeat EBV DNA level","A trend may support evaluation but cannot replace tissue classification."],["A second staging scan","Additional imaging does not substitute for histopathology."],["A routine graft-function panel","Organ tests do not classify a lymphoproliferative lesion."]],
  explanation:"Neither EBV viremia nor imaging establishes the histopathologic PTLD category.",
  claims:[T]},
 {
  slug:"negative-ebv",
  complaint:"Mass with negative EBV test",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex} with a heart transplant, presents with an enlarging extranodal mass and systemic symptoms. Blood EBV DNA is not detected, and no biopsy has been performed.",
  stem:"Which conclusion is most appropriate?",
  correct:["Proceed with tissue-based evaluation","A negative blood EBV result does not replace pathology or resolve a concerning mass."],
  wrong:[["Exclude PTLD from the negative test","PTLD cannot be excluded solely by one blood EBV result."],["Call the mass benign from imaging","Imaging appearance alone does not provide histologic classification."],["Begin lymphoma treatment without tissue","Treatment should not precede coordinated diagnostic classification in this stable case."]],
  explanation:"Suspected PTLD remains a tissue diagnosis; blood and imaging findings support but do not replace histopathology.",
  claims:[T]},
 {
  slug:"pathology-returned",
  complaint:"Review biopsy report",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex} with a liver transplant, returns after an external biopsy has confirmed and classified PTLD. The transplant and hematology teams are reviewing the pathology together.",
  stem:"Which care structure is most appropriate?",
  correct:["Transplant-hematology planning","Pathology classification should be reviewed jointly in the transplant-specific clinical context."],
  wrong:[["Independent medication changes in clinic","Uncoordinated immunosuppression changes can threaten the graft and do not provide oncology planning."],["Repeat biopsy before reading pathology","The returned representative pathology already supplies the classification for team review."],["Routine annual surveillance only","Confirmed PTLD requires active specialty planning rather than routine follow-up alone."]],
  explanation:"Once tissue confirms PTLD, the transplant and hematology teams review the pathology classification together; this objective does not teach a subtype regimen.",
  claims:[T]},
]);
const spec:FamilySpec={slug:"ptld",label:"Post-transplant lymphoproliferative disorder",
  claims:[{id:R,statement:"PTLD is heterogeneous; in a solid-organ recipient, unexplained fever, lymphadenopathy, an extranodal mass, organ dysfunction, or rising EBV viremia should prompt evaluation while infection and rejection remain mimics.",sourceIds:[SOURCES.ptld.id,SOURCES.ptldReview.id],category:"presentation",limitation:"The list is nonexhaustive and no one feature establishes PTLD.",population:"Solid-organ transplant recipients with otherwise unexplained concerning findings."},{id:T,statement:"Tissue pathology is required to diagnose and classify suspected PTLD; EBV DNA and imaging are supportive and do not replace histopathologic diagnosis.",sourceIds:[SOURCES.ptld.id,SOURCES.ptldReview.id],category:"evaluation",limitation:"No biopsy technique, staging system, surveillance cutoff, or treatment regimen is taught.",population:"Transplant recipients with suspected PTLD."}],sources:[SOURCES.ptld,SOURCES.ptldReview],concepts:[{id:"concept.ptld.posttransplant-pattern-recognition",displayName:"Recognize a PTLD pattern",learningObjective:"Recognize findings that warrant PTLD evaluation while preserving infection and rejection as mimics.",stage:1,educationalTier:1,conceptType:"diagnosis",evidenceClaimIds:[R],variants:pattern},{id:"concept.ptld.tissue-diagnosis-coordination",displayName:"Coordinate tissue diagnosis for PTLD",learningObjective:"Coordinate transplant and hematology evaluation with tissue pathology rather than diagnosing PTLD from EBV DNA or imaging alone.",stage:1,educationalTier:1,conceptType:"workup",evidenceClaimIds:[T],variants:tissue}]};
export const PTLD=buildFamily(spec);






















































