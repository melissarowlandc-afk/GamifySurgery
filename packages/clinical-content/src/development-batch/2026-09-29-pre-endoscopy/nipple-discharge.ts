import { buildFamily,type FamilySpec } from "./family-builder"; import { variants } from "./spec-utils"; import { SOURCES } from "./source-catalog";
const R="claim.discharge.pathologic-pattern",I="claim.discharge.imaging"; const imaging={timingProfileId:"timing.test.breast_imaging_bundle",serviceId:"service.diagnostic_breast_imaging"};
const recognition=variants([
 {
  slug:"bloody-single-duct",
  complaint:"Bloody nipple discharge",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents with spontaneous unilateral bloody discharge arising from one duct without compression. No fever or lactation is present.",
  stem:"How should this discharge pattern be classified?",
  correct:["Pathologic discharge pattern","Spontaneous unilateral single-duct bloody discharge is a concerning pathologic pattern."],
  wrong:[["Physiologic multiduct discharge","Physiologic discharge is more often bilateral, multiduct, and expressed with compression."],["Lactational milk production","The presentation is not lactational and the fluid is bloody."],["Superficial breast cellulitis","No skin inflammation or infection pattern is described."]],
  explanation:"The combination of spontaneity, unilateral single-duct origin, and bloody character is pathologic and warrants diagnostic evaluation.",
  claims:[R],
  ageYears:[42,58],
  sexLabels:["Female"]},
 {
  slug:"bilateral-expressed",
  complaint:"Discharge with compression",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents with bilateral milky-green discharge from several ducts only when the nipples are compressed. There is no spontaneous discharge, blood, or palpable mass.",
  stem:"How should this pattern be classified?",
  correct:["Physiologic discharge pattern","Bilateral multiduct discharge elicited only with compression is a physiologic pattern."],
  wrong:[["Pathologic single-duct discharge","The discharge is bilateral, multiduct, and nonspontaneous."],["Breast abscess drainage","There is no tender collection, erythema, or fever."],["Ulcerated breast malignancy","No ulcer, mass, or spontaneous bloody discharge is described."]],
  explanation:"Pattern classification prevents unnecessary diagnostic imaging for a clearly physiologic presentation while clinical context is still reviewed.",
  claims:[R],
  ageYears:[40,55],
  sexLabels:["Female"]},
 {
  slug:"serous-unilateral",
  complaint:"Clear discharge from one side",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, reports recurrent spontaneous clear-serous discharge from one nipple and one apparent duct. It stains clothing without manipulation.",
  stem:"Which classification best fits?",
  correct:["Pathologic discharge pattern","Spontaneous unilateral single-duct serous discharge is pathologic even without visible blood."],
  wrong:[["Physiologic expressed discharge","The fluid is spontaneous and unilateral rather than expressed and multiduct."],["Normal lactational discharge","No lactational context is described."],["Bilateral endocrine discharge","The finding is unilateral and localized to one duct."]],
  explanation:"Serous as well as bloody spontaneous single-duct discharge warrants a pathologic-discharge evaluation.",
  claims:[R],
  ageYears:[45,63],
  sexLabels:["Female"]},
 {
  slug:"male-spontaneous",
  complaint:"Unilateral nipple discharge",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents with spontaneous unilateral serosanguineous nipple discharge and no recent trauma or procedure.",
  stem:"Which interpretation is most appropriate?",
  correct:["Pathologic discharge pattern","Spontaneous unilateral serosanguineous discharge is a pathologic pattern."],
  wrong:[["Routine physiologic discharge","The discharge is spontaneous and unilateral rather than expressed and multiduct."],["Normal lactational change","There is no lactational setting."],["Simple skin perspiration","The fluid arises from the nipple and is serosanguineous."]],
  explanation:"The concerning discharge pattern applies across adult patient contexts and requires diagnostic evaluation.",
  claims:[R],
  ageYears:[48,66],
  sexLabels:["Male"]},
]);
const diagnostic=variants([
 {
  slug:"age-over40",
  complaint:"Plan discharge imaging",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents with spontaneous unilateral single-duct bloody discharge. The patient is at least 40, and no diagnostic imaging has been obtained.",
  stem:"Which initial imaging plan is most appropriate?",
  correct:["Diagnostic mammography and ultrasound","This age and pathologic pattern warrant diagnostic breast imaging with complementary targeted ultrasound."],
  wrong:[["Screening mammography without targeted ultrasound","A symptom requires a diagnostic rather than screening pathway.",{timingProfileId:"timing.test.mammography",serviceId:"service.mammography"}],["Breast MRI without diagnostic mammography","MRI is not the standard sole initial study for this presentation.",{timingProfileId:"timing.test.breast_mri",serviceId:"service.breast_mri"}],["Observation without diagnostic breast imaging","Pathologic discharge warrants evaluation even without a palpable mass."]],
  explanation:"For an adult at least 40 with pathologic discharge, use diagnostic mammography or DBT and targeted ultrasound rather than screening imaging.",
  claims:[I],
  ageYears:[44,61],
  sexLabels:["Female"],
  test:{...imaging,gate:{serviceId:"service.diagnostic_breast_imaging",pendingLabel:"Diagnostic breast imaging pending",resultNarrative:"Diagnostic mammography and targeted ultrasound identify a retroareolar abnormality requiring breast-specialist review.",routeIds:["route.diagnostic_breast_imaging.outsourced"]}}},
 {
  slug:"physiologic-no-image",
  complaint:"Discuss nipple discharge",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents with bilateral multiduct discharge only with compression and no spontaneous fluid, blood, mass, or focal breast symptom.",
  stem:"Which imaging plan is appropriate for this clearly physiologic pattern?",
  correct:["No diagnostic imaging for the discharge","Clearly physiologic discharge generally does not require diagnostic imaging."],
  wrong:[["Diagnostic mammography and ultrasound","The current pattern lacks pathologic discharge features.",{timingProfileId:"timing.test.breast_imaging_bundle",serviceId:"service.diagnostic_breast_imaging"}],["Breast MRI as first-line imaging","MRI is not indicated for an otherwise physiologic pattern.",{timingProfileId:"timing.test.breast_mri",serviceId:"service.breast_mri"}],["Screening mammography for the discharge","A clearly physiologic discharge pattern does not create a diagnostic or screening indication by itself.",{timingProfileId:"timing.test.mammography",serviceId:"service.mammography"}]],
  explanation:"When the history is clearly physiologic and no other concerning finding exists, avoid a diagnostic-imaging cascade.",
  claims:[I],
  ageYears:[43,57],
  sexLabels:["Female"]},
 {
  slug:"male-pathologic",
  complaint:"Image unilateral discharge",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents with spontaneous unilateral serosanguineous nipple discharge and no completed diagnostic breast imaging.",
  stem:"Which initial imaging pathway is appropriate?",
  correct:["Diagnostic mammography and ultrasound","Adult male pathologic discharge warrants diagnostic mammography or DBT with complementary ultrasound."],
  wrong:[["Screening mammography without diagnostic views","This is a symptomatic diagnostic evaluation rather than screening.",{timingProfileId:"timing.test.mammography",serviceId:"service.mammography"}],["Breast MRI without initial diagnostic mammography","MRI is not the standard sole first study here.",{timingProfileId:"timing.test.breast_mri",serviceId:"service.breast_mri"}],["Observation without diagnostic breast imaging","Spontaneous unilateral serosanguineous discharge is pathologic."]],
  explanation:"Use the diagnostic breast-imaging pathway rather than screening or observation for adult male pathologic discharge.",
  claims:[I],
  ageYears:[50,67],
  sexLabels:["Male"],
  test:imaging},
 {
  slug:"negative-first-line",
  complaint:"Persistent discharge after imaging",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, returns with persistent spontaneous unilateral single-duct discharge after diagnostic mammography and targeted ultrasound were negative. The breast specialist is reviewing next steps.",
  stem:"Which interpretation is most appropriate?",
  correct:["Persistent discharge needs breast review","Negative initial imaging does not reclassify a persistent pathologic discharge pattern as physiologic."],
  wrong:[["The discharge is now physiologic","Imaging does not change the spontaneous unilateral single-duct phenotype."],["Malignancy has been completely excluded","Negative initial imaging cannot establish that absolute conclusion."],["Routine screening replaces symptom follow-up","Persistent symptoms remain in a diagnostic pathway."]],
  explanation:"Initial imaging is part of evaluation; persistent pathologic discharge remains a clinical problem for breast-specialist assessment.",
  claims:[R,I],
  ageYears:[46,64],
  sexLabels:["Female"]},
]);
const spec:FamilySpec={slug:"nipple-discharge",label:"Pathologic nipple discharge",pairing:{indices:[0],updates:["The discharge remains spontaneous, unilateral, bloody, and confined to one duct; the patient is over 40 and now asks about diagnostic imaging."]},
  claims:[{id:R,statement:"Spontaneous unilateral single-duct serous or bloody discharge is concerning for a pathologic process, whereas bilateral multiduct discharge elicited with compression more often follows a physiologic pattern.",sourceIds:[SOURCES.acrDischarge.id],category:"presentation",limitation:"Pattern classification does not itself establish etiology.",population:"Adults presenting with nipple discharge."},{id:I,statement:"Clearly physiologic discharge generally does not need diagnostic imaging; pathologic discharge warrants age- and context-appropriate diagnostic mammography or DBT with targeted ultrasonography as applicable.",sourceIds:[SOURCES.acrDischarge.id],category:"evaluation",limitation:"Only directly supported adult contexts are authored; rating tables are not reproduced.",population:"Adults with physiologic or pathologic nipple-discharge patterns."}],sources:[SOURCES.acrDischarge],serviceContracts:[{serviceId:"service.diagnostic_breast_imaging",allowedRouteIds:["route.diagnostic_breast_imaging.outsourced"],delivery:"existing_balance_contract"},{serviceId:"service.breast_mri",allowedRouteIds:["route.breast_mri.outsourced"],delivery:"existing_balance_contract"},{serviceId:"service.mammography",allowedRouteIds:["route.mammography.outsourced"],delivery:"existing_balance_contract"}],concepts:[{id:"concept.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition",displayName:"Classify nipple discharge patterns",learningObjective:"Distinguish pathologic spontaneous unilateral single-duct discharge from physiologic bilateral multiduct expressed discharge.",stage:0,educationalTier:0,conceptType:"diagnosis",evidenceClaimIds:[R],variants:recognition},{id:"concept.pathologic-nipple-discharge.diagnostic-imaging",displayName:"Select diagnostic imaging for pathologic discharge",learningObjective:"Select age- and context-appropriate diagnostic breast imaging for pathologic nipple discharge.",stage:0,educationalTier:1,conceptType:"workup",evidenceClaimIds:[I],variants:diagnostic}]};
export const NIPPLE_DISCHARGE=buildFamily(spec);



















































