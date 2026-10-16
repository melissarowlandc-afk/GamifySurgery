import { buildFamily,type FamilySpec } from "./family-builder"; import { variants } from "./spec-utils"; import { SOURCES } from "./source-catalog";
const R="claim.nact.response-mapping",B="claim.nact.bcs-selection",O="claim.nact.oncoplastic-selection";
const mapping=variants([
 {
  slug:"marker-residual",
  complaint:"Plan surgery after therapy",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents after completing neoadjuvant therapy for noninflammatory breast cancer. The mass is no longer palpable, and a marker was placed at the original biopsy site before treatment.",
  stem:"Which preoperative plan best maps the treated site?",
  correct:["Imaging with marker localization","Residual extent and the original marked site should be mapped for surgical planning."],
  wrong:[["Planning from current examination alone","A complete clinical response can leave no palpable target while surgery remains necessary."],["Planning without marker localization","Clinical response does not eliminate the need to localize the treated site."],["Planning from baseline imaging alone","The current response and treated marker site must also guide the operation."]],
  explanation:"Planning after neoadjuvant therapy integrates baseline distribution, current examination, post-treatment imaging, and localization of the original site when needed.",
  claims:[R],
  sexLabels:["Female"],
  ageYears:[42,58],
  test:{timingProfileId:"timing.test.breast_imaging_bundle",serviceId:"service.diagnostic_breast_imaging",gate:{serviceId:"service.diagnostic_breast_imaging",pendingLabel:"Post-treatment breast mapping pending",resultNarrative:"Post-treatment imaging shows localized unifocal residual disease around the original marker with feasible localization for surgery.",routeIds:["route.diagnostic_breast_imaging.outsourced"]}}},
 {
  slug:"residual-palpable",
  complaint:"Residual breast mass",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, returns after neoadjuvant therapy with a smaller but still palpable unifocal breast lesion. Baseline imaging and the biopsy-site marker are available.",
  stem:"Which information should guide the operative map?",
  correct:["Longitudinal disease extent","Both the original distribution and current residual findings inform resection planning."],
  wrong:[["Current palpation as the only map","Examination alone omits baseline extent and marker location."],["Baseline imaging as the only map","Current response and residual distribution also matter."],["Treatment completion date alone","Timing does not define residual anatomic extent."]],
  explanation:"The operative plan uses the longitudinal disease map rather than one time point in isolation.",
  claims:[R],
  sexLabels:["Female"],
  ageYears:[45,61]},
 {
  slug:"axillary-response",
  complaint:"Review response imaging",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents after neoadjuvant therapy with prior biopsy-proven breast cancer and baseline axillary involvement. Breast and axillary response must be reassessed before surgery.",
  stem:"Which assessment frame is most appropriate?",
  correct:["Map both breast and axillary response","The preoperative plan integrates residual disease in both regions."],
  wrong:[["Assess the breast and omit the axilla","Known baseline axillary disease remains part of operative mapping."],["Assess the axilla and omit the breast","The primary breast site still requires surgical planning."],["Use systemic symptoms as the anatomic map","Symptoms cannot replace breast and regional assessment."]],
  explanation:"Post-treatment planning includes the original breast and axillary disease distribution and current response.",
  claims:[R],
  sexLabels:["Female"],
  ageYears:[39,56]},
 {
  slug:"no-marker",
  complaint:"Nonpalpable site after therapy",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents after neoadjuvant therapy with no palpable residual breast lesion. Records show the original site was not marked, but baseline and current imaging are available.",
  stem:"Which planning principle is most important?",
  correct:["Establish localization before surgery","A nonpalpable treated site still requires a reliable operative target."],
  wrong:[["Plan from current examination alone","A nonpalpable response leaves no reliable examination target."],["Plan broad resection without localization","A broad unguided resection does not substitute for reliable site localization."],["Defer surgery for interval surveillance","Response does not justify substituting surveillance for definitive local treatment."]],
  explanation:"When the treated site is no longer palpable, the breast team must establish a reliable localization plan from prior and current records.",
  claims:[R],
  sexLabels:["Female"],
  ageYears:[41,59]},
]);
const conservation=variants([
 {
  slug:"unifocal-response",
  complaint:"Discuss breast conservation",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, returns after neoadjuvant therapy for noninflammatory breast cancer. Imaging shows localized unifocal residual disease, negative margins appear feasible, radiotherapy is acceptable, and the patient prefers breast conservation.",
  stem:"Which local-treatment plan best fits the patient's stated conservation goal?",
  correct:["Breast-conserving surgery plus radiotherapy","Selected localized residual disease after response can remain eligible for conservation."],
  wrong:[["Mastectomy with reconstruction discussion","Mastectomy remains an option, but it does not best match the stated conservation goal when conservation is feasible."],["Radiotherapy without breast surgery","Radiotherapy does not replace definitive breast surgery in this setting."],["Medical-oncology follow-up without local surgery","Systemic follow-up does not replace definitive local treatment."],],
  explanation:"Conservation eligibility depends on residual extent, localization, margin feasibility, radiotherapy, biology/genetics, and patient preference—not response alone.",
  claims:[B],
  sexLabels:["Female"],
  ageYears:[43,57]},
 {
  slug:"diffuse-residual",
  complaint:"Choose breast operation",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents after neoadjuvant therapy with diffuse multicentric residual disease spanning separate breast regions. A satisfactory single conservation resection is not feasible.",
  stem:"Which planning direction is most appropriate?",
  correct:["Mastectomy-based surgical planning","Diffuse residual distribution can make breast conservation oncologically or technically unsuitable."],
  wrong:[["Conservation based on response alone","Response does not override diffuse residual extent."],["No surgery because therapy was given","Neoadjuvant therapy does not replace definitive local surgery."],["Remove only the easiest residual focus","Leaving separate known disease sites is not an adequate conservation plan."]],
  explanation:"Post-treatment disease distribution, not the fact of response alone, determines conservation feasibility.",
  claims:[B],
  sexLabels:["Female"],
  ageYears:[46,62]},
 {
  slug:"radiation-declined",
  complaint:"Preferences after chemotherapy",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, returns after a strong neoadjuvant response with a small localized residual lesion but has a prior treatment history that makes additional whole-breast radiotherapy unsuitable.",
  stem:"Which operative direction should now be discussed?",
  correct:["Mastectomy-based planning","If required radiotherapy is not feasible, conservation may no longer be an appropriate option."],
  wrong:[["Breast conservation without radiotherapy","This plan omits a required component of the proposed conservation pathway."],["Observation without breast surgery","Response does not eliminate the need for definitive local surgery."],["Additional systemic therapy without planning","The radiotherapy constraint needs an operative decision rather than an indefinite therapy delay."]],
  explanation:"Radiotherapy feasibility is part of conservation selection even after a favorable response.",
  claims:[B],
  sexLabels:["Female"],
  ageYears:[48,64]},
 {
  slug:"oncoplastic-conservation",
  complaint:"Conservation after response",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, returns after neoadjuvant therapy for noninflammatory breast cancer with localized residual disease larger than expected for a simple lumpectomy. The site is reliably localized, negative margins and acceptable cosmesis appear feasible with an oncoplastic approach, radiotherapy is acceptable, and the patient prefers conservation.",
  stem:"Which surgical option remains reasonable to discuss?",
  correct:["Oncoplastic breast-conserving surgery","Selected localized residual disease may remain eligible for conservation when margins, cosmesis, radiotherapy, and preference align."],
  wrong:[["Mastectomy as the only allowable operation","The stated profile preserves a reasonable conservation option."],["Simple lumpectomy without volume planning","The residual extent requires a plan that addresses resection volume and cosmesis."],["Observation without definitive breast surgery","Response does not eliminate the need for local treatment."]],
  explanation:"Breast conservation after neoadjuvant therapy can include an oncoplastic strategy when the residual distribution can be reliably localized and an acceptable oncologic and cosmetic result is feasible.",
  claims:[B,O],
  sexLabels:["Female"],
  ageYears:[40,55]},
]);
const spec:FamilySpec={slug:"post-neoadjuvant-breast",label:"Breast surgery after neoadjuvant therapy",pairing:{indices:[0],updates:["Returned breast mapping shows localized unifocal residual disease around the marker, with reliable localization, feasible negative margins and acceptable cosmesis, radiation eligibility, no overriding genetic contraindication, and a preference for conservation."]},
  claims:[{id:R,statement:"After neoadjuvant systemic therapy, operative planning integrates original disease distribution, current breast and axillary examination, post-treatment imaging, and localization of the residual lesion or original marker when needed.",sourceIds:[SOURCES.nact.id,SOURCES.bcs.id],category:"evaluation",limitation:"Expert-informed society resource guides; no imaging modality is universal.",population:"Adult women with known noninflammatory breast cancer after completed neoadjuvant therapy."},{id:B,statement:"Selected noninflammatory breast cancer may remain eligible for breast-conserving surgery after adequate response when residual extent can be localized and acceptable conservation, margins, radiotherapy, and patient preference align.",sourceIds:[SOURCES.nact.id,SOURCES.bcs.id],category:"management",limitation:"Response alone does not prove eligibility or permit omission of surgery; inflammatory breast cancer is excluded.",population:"Adult women with noninflammatory breast cancer after neoadjuvant therapy."},{id:O,statement:"An oncoplastic breast-conserving approach can remain an option for selected localized residual disease when a wider resection is needed and negative margins with acceptable cosmesis appear feasible.",sourceIds:[SOURCES.bcs.id],category:"management",limitation:"Expert-informed society resource guide; this does not make oncoplastic conservation suitable for every response pattern.",population:"Adult women with localized noninflammatory breast cancer after neoadjuvant therapy."}],sources:[SOURCES.nact,SOURCES.bcs],serviceContracts:[{serviceId:"service.diagnostic_breast_imaging",allowedRouteIds:["route.diagnostic_breast_imaging.outsourced"],delivery:"existing_balance_contract"}],concepts:[{id:"concept.breast-cancer-after-neoadjuvant-therapy.response-mapping",displayName:"Map breast cancer response after neoadjuvant therapy",learningObjective:"Integrate baseline and post-treatment breast/axillary findings and localization into operative mapping.",stage:0,educationalTier:1,conceptType:"workup",evidenceClaimIds:[R],variants:mapping},{id:"concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection",displayName:"Select breast conservation after neoadjuvant therapy",learningObjective:"Recognize selected noninflammatory breast cancers that remain eligible for breast conservation after response.",stage:0,educationalTier:1,conceptType:"management",evidenceClaimIds:[B,O],variants:conservation}]};
export const POST_NEoadjuvant_BREAST=buildFamily(spec);





















































