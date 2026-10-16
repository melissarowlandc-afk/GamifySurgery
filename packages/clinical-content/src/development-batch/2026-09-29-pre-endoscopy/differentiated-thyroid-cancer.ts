import { buildFamily,type FamilySpec } from "./family-builder"; import { variants } from "./spec-utils"; import { SOURCES } from "./source-catalog";
const U="claim.dtc.preop-ultrasound",E="claim.dtc.extent",L="claim.dtc.lobectomy-boundary"; const usTest={timingProfileId:"timing.test.ultrasound",serviceId:"service.ultrasound"};
const mapping=variants([
 {
  slug:"malignant-cytology",
  complaint:"Thyroid cancer planning",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents after thyroid FNA returned papillary thyroid carcinoma. No dedicated preoperative central or lateral neck-node mapping has been completed.",
  stem:"Which study should be obtained for preoperative cervical mapping?",
  correct:["Central and lateral neck ultrasound","Dedicated neck ultrasonography maps cervical nodes and gross local extension before surgery."],
  wrong:[["Repeat thyroid FNA","Malignancy is already established, and repeat sampling does not map cervical nodes.",{timingProfileId:"timing.test.biopsy",serviceId:"service.thyroid_fna"}],["Contrast-enhanced cross-sectional neck CT","Cross-sectional neck imaging can be adjunctive in advanced disease but does not replace the initial compartment ultrasound here.",{timingProfileId:"timing.test.ct",serviceId:"service.ct"}],["Thyroid uptake scintigraphy","Functional thyroid imaging does not replace anatomic cervical-node mapping.",{timingProfileId:"timing.test.nuclear_imaging"}]],
  explanation:"After malignant cytology, dedicated central and lateral neck ultrasonography informs the operative map.",
  claims:[U],
  test:{...usTest,gate:{serviceId:"service.ultrasound",pendingLabel:"Preoperative neck ultrasound pending",resultNarrative:"Neck ultrasound shows no suspicious central or lateral cervical nodes and no gross extrathyroidal extension.",routeIds:["route.ultrasound.in_house","route.ultrasound.outsourced"]}}},
 {
  slug:"molecular-malignancy",
  complaint:"Review molecular result",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents after a thyroid nodule molecular result establishes malignancy. The thyroid itself has been characterized, but cervical nodal compartments have not been mapped.",
  stem:"Which preoperative imaging is most appropriate?",
  correct:["Cervical-node ultrasound","Malignant molecular findings trigger preoperative central and lateral neck mapping."],
  wrong:[["Repeat thyroid nodule FNA","Malignancy is already established and repeat sampling does not map cervical nodes.",{timingProfileId:"timing.test.biopsy",serviceId:"service.thyroid_fna"}],["Routine chest radiograph","A radiograph does not provide cervical compartment mapping.",{timingProfileId:"timing.test.radiography"}],["Upper abdominal ultrasound","Abdominal imaging does not assess cervical nodes.",{timingProfileId:"timing.test.ultrasound",serviceId:"service.ultrasound"}]],
  explanation:"The next imaging task is cervical mapping rather than repeating the diagnostic nodule workup.",
  claims:[U],
  test:usTest},
 {
  slug:"palpable-node",
  complaint:"Thyroid cancer neck node",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents with confirmed differentiated thyroid cancer and a palpable lateral neck node. No dedicated compartment ultrasound has been performed.",
  stem:"Which initial mapping study best addresses the surgical question?",
  correct:["Complete neck ultrasound","Ultrasound evaluates central and lateral nodes and gross thyroid-cancer extension."],
  wrong:[["Thyroid uptake scan alone","An uptake study does not replace anatomic cervical-node mapping.",{timingProfileId:"timing.test.nuclear_imaging"}],["Repeat thyroid function testing","A laboratory value does not map nodal anatomy.",{timingProfileId:"timing.test.basic_labs"}],["Noncontrast head CT","A head study does not provide the intended cervical-compartment survey.",{timingProfileId:"timing.test.ct",serviceId:"service.ct"}]],
  explanation:"A palpable node heightens the need for dedicated cervical ultrasonographic mapping before operative planning.",
  claims:[U],
  test:usTest},
 {
  slug:"completed-negative",
  complaint:"Review neck ultrasound",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, reviews a completed preoperative neck ultrasound after malignant thyroid cytology. It documents no suspicious central or lateral nodes and no gross extrathyroidal extension.",
  stem:"Which statement best describes the value of this result?",
  correct:["Cervical operative map","The negative compartment survey informs extent planning but does not erase the cancer diagnosis."],
  wrong:[["It proves the thyroid cancer benign","Negative nodal mapping does not reverse malignant cytology."],["Ultrasound eliminates all recurrence risk","No imaging result eliminates all future risk."],["Ultrasound replaces surgical consultation","The imaging result informs rather than replaces operative planning."]],
  explanation:"Preoperative neck ultrasound contributes nodal and local-extension information to an individualized surgical decision.",
  claims:[U,E]},
]);
const extent=variants([
 {
  slug:"unilateral-low",
  complaint:"Discuss thyroid operation",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, returns with a 2-cm intrathyroidal differentiated thyroid cancer confined to one lobe, no gross extension, no suspicious nodes or distant disease, and a preference to preserve thyroid tissue when oncologically reasonable.",
  stem:"Which planning approach is most appropriate?",
  correct:["Discuss lobectomy as an eligible option","Selected unilateral limited disease may be managed with lobectomy after individualized review."],
  wrong:[["Mandate total thyroidectomy for every DTC","Confirmed DTC does not require the same extent in all patients."],["Avoid surgical evaluation entirely","Confirmed malignancy still requires definitive multidisciplinary planning."],["Choose the operation from age alone","Age alone is not the operative-extent decision."]],
  explanation:"Extent is individualized from disease distribution, risk, future treatment needs, and patient goals; this profile permits lobectomy discussion without guaranteeing it.",
  claims:[E,L]},
 {
  slug:"bilateral-disease",
  complaint:"Bilateral thyroid cancer",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents with confirmed differentiated thyroid cancer involving both lobes and completed nodal mapping. The patient seeks operative planning.",
  stem:"Which factor most strongly changes the extent discussion?",
  correct:["Bilateral thyroid disease","Disease in both lobes weighs against a unilateral lobectomy-only plan."],
  wrong:[["Patient age considered by itself","Age alone does not define surgical extent."],["One normal thyroid hormone value","A single hormone result does not define cancer distribution."],["Absence of voice symptoms alone","No voice complaint does not resolve bilateral oncologic extent."]],
  explanation:"Bilateral disease is an anatomic extent factor that must be integrated into specialist operative planning.",
  claims:[E]},
 {
  slug:"nodal-disease",
  complaint:"Cancer with cervical nodes",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, returns with differentiated thyroid cancer and completed ultrasound showing suspicious lateral cervical nodal disease. There is no distant staging result yet.",
  stem:"Which planning principle is most appropriate?",
  correct:["Confirm suspicious cervical nodes","Suspicious cervical nodes need focused confirmation because the result can change the operative map."],
  wrong:[["Base surgery on primary size alone","Primary-tumor size alone omits the unresolved nodal concern."],["Proceed with nodule observation only","Confirmed cancer with suspicious nodes needs active specialist evaluation."],["Ignore ultrasound until after surgery","The suspicious preoperative finding should be resolved before finalizing the operation."]],
  explanation:"Suspicious nodal findings require confirmation and mapping before final operative extent is selected.",
  claims:[U,E]},
 {
  slug:"preference-balance",
  complaint:"Choosing thyroid surgery",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents with localized unilateral differentiated thyroid cancer and no suspicious nodes. Both lobectomy and total thyroidectomy remain under specialist consideration because future treatment preferences differ.",
  stem:"Which counseling approach is best?",
  correct:["Use shared individualized extent planning","When oncologic options remain reasonable, future treatment implications and patient goals belong in the decision."],
  wrong:[["Choose total thyroidectomy without discussion","The profile does not support bypassing patient goals and tradeoffs."],["Choose lobectomy without discussion","Eligibility does not make lobectomy mandatory."],["Let chronological age decide alone","Age alone does not settle the extent decision."]],
  explanation:"When more than one oncologically reasonable extent remains, shared planning incorporates disease factors and preferences.",
  claims:[E]},
]);
const spec:FamilySpec={slug:"differentiated-thyroid-cancer",label:"Differentiated thyroid cancer",pairing:{indices:[0],updates:["Preoperative neck ultrasound returns with no suspicious central or lateral cervical nodes and no gross extrathyroidal extension; the tumor measures 2 cm, remains intrathyroidal and confined to one lobe with no other high-risk driver, and the patient prefers tissue preservation when reasonable."]},
  claims:[{id:U,statement:"Malignant thyroid cytology or molecular findings warrant preoperative central and lateral neck ultrasonography to assess cervical nodes and gross local extension.",sourceIds:[SOURCES.ata.id],category:"evaluation",limitation:"No unchecked numeric node threshold is taught.",population:"Adults proceeding toward surgery for differentiated thyroid cancer confirmed by cytology or molecular findings."},{id:L,statement:"For a patient who has chosen surgery for a differentiated thyroid cancer measuring 2 cm or less, confined to one lobe without gross extension or nodal disease, lobectomy is an eligible initial option.",sourceIds:[SOURCES.ata.id,SOURCES.ataSummary.id],category:"management",limitation:"This exact boundary applies only to the stated low-risk unilateral profile and does not make lobectomy mandatory.",population:"Adults choosing surgery for unilateral intrathyroidal DTC measuring 2 cm or less without gross extension or nodal disease."},{id:E,statement:"Initial thyroid surgical extent is individualized from tumor extent and laterality, nodal or distant disease, recurrence considerations, future treatment needs, and patient preferences.",sourceIds:[SOURCES.ata.id,SOURCES.ataSummary.id],category:"management",limitation:"No operation is selected from age alone or mandated for every DTC.",population:"Adults with confirmed differentiated thyroid cancer."}],sources:[SOURCES.ata,SOURCES.ataSummary],serviceContracts:[{serviceId:"service.ultrasound",allowedRouteIds:["route.ultrasound.in_house","route.ultrasound.outsourced"],delivery:"existing_balance_contract"},{serviceId:"service.ct",allowedRouteIds:["route.ct.in_house","route.ct.outsourced"],delivery:"existing_balance_contract"},{serviceId:"service.thyroid_fna",allowedRouteIds:["route.thyroid_fna.in_house","route.thyroid_fna.outsourced"],delivery:"existing_balance_contract"}],concepts:[{id:"concept.differentiated-thyroid-cancer.preoperative-nodal-ultrasound",displayName:"Map DTC with preoperative neck ultrasound",learningObjective:"Select central and lateral neck ultrasonography after malignant thyroid cytology or molecular findings.",stage:1,educationalTier:1,conceptType:"workup",evidenceClaimIds:[U],variants:mapping},{id:"concept.differentiated-thyroid-cancer.individualized-surgical-extent",displayName:"Individualize DTC surgical extent",learningObjective:"Plan lobectomy versus total thyroidectomy from disease extent and patient goals rather than one blanket rule.",stage:1,educationalTier:1,conceptType:"management",evidenceClaimIds:[E,L],variants:extent}]};
export const DIFFERENTIATED_THYROID_CANCER=buildFamily(spec);

























































