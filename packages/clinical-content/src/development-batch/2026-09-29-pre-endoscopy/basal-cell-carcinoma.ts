import { buildFamily,type FamilySpec } from "./family-builder"; import { variants } from "./spec-utils"; import { SOURCES } from "./source-catalog";
const R="claim.bcc.pattern",L="claim.bcc.local-invasion",M="claim.bcc.rare-metastasis";
const recognition=variants([
 {
  slug:"pearly-nodule",
  complaint:"Slow-growing nose spot",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents with a slowly enlarging pearly translucent papule on the nose with fine surface telangiectasia and occasional bleeding.",
  stem:"Which diagnosis is most concerning?",
  correct:["Basal cell carcinoma","A slowly enlarging pearly telangiectatic lesion is a classic concerning BCC pattern."],
  wrong:[["Seborrheic keratosis","A waxy stuck-on plaque is a different morphology."],["Cutaneous squamous cell carcinoma","A hyperkeratotic or ulcerated keratinizing lesion is a different typical pattern."],["Amelanotic melanoma","Melanoma remains a differential, but the pearly telangiectatic morphology particularly suggests BCC."]],
  explanation:"The clinical pattern raises BCC concern and requires diagnostic confirmation; appearance alone is not histology.",
  claims:[R]},
 {
  slug:"ulcerated-ear",
  complaint:"Bleeding ear lesion",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents with a slowly enlarging translucent papule at the ear rim that has developed central ulceration and recurrent crusting.",
  stem:"Which lesion category best fits the pattern?",
  correct:["Ulcerated basal cell carcinoma","Slow growth, translucency, and central ulceration are concerning for BCC."],
  wrong:[["Inflamed epidermal inclusion cyst","A cyst usually has a subcutaneous nodule or punctum rather than a translucent ulcerated rim."],["Actinic keratosis pattern","Actinic keratosis is usually a rough scaly macule or papule."],["Benign melanocytic nevus pattern","A stable pigmented nevus does not fit progressive translucent ulceration."]],
  explanation:"Ulceration does not identify histology by itself, but this morphology warrants diagnostic confirmation for BCC.",
  claims:[R]},
 {
  slug:"scar-like",
  complaint:"Firm facial plaque",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents with a slowly expanding firm pale scar-like plaque on the cheek despite no prior trauma or procedure at that site. Its borders are indistinct.",
  stem:"Which diagnosis should be considered?",
  correct:["Morpheaform basal cell carcinoma","A firm scar-like plaque with indistinct borders is a concerning morpheaform BCC pattern."],
  wrong:[["Hypertrophic scar after a prior skin procedure","There is no preceding injury or procedure to explain a scar."],["Chronic inflammatory tinea faciei plaque","A fungal plaque is typically scaly and annular rather than firm and scar-like."],["Discoid lupus erythematosus plaque","Inflammatory scale and dyspigmentation would suggest a different process."]],
  explanation:"Morpheaform BCC may appear scar-like and ill-defined, so diagnostic confirmation is needed.",
  claims:[R]},
 {
  slug:"recurrent-crusting",
  complaint:"Crusting scalp plaque",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents with a slowly enlarging translucent scalp plaque with fine telangiectasia, recurrent crusting, and a shallow ulcer that repeatedly reopens.",
  stem:"Which diagnosis is most concerning?",
  correct:["Ulcerated basal cell carcinoma","Slow enlargement, translucency, telangiectasia, and recurrent ulceration are concerning for BCC."],
  wrong:[["Inflamed seborrheic keratosis","An irritated waxy lesion is less consistent with the translucent telangiectatic plaque."],["Chronic traumatic erosion","Repeated trauma is not described and would not explain the pearly telangiectatic border."],["Hypertrophic actinic keratosis","A rough hyperkeratotic plaque differs from the translucent ulcerated pattern."]],
  explanation:"A second positive BCC morphology can combine slow growth, a translucent border, telangiectasia, and recurrent ulceration; diagnostic confirmation remains necessary.",
  claims:[R]},
]);
const counseling=variants([
 {
  slug:"small-nodular",
  complaint:"Review skin pathology",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, returns after external biopsy confirmed a small nodular BCC. The patient asks whether the main concern is rapid distant spread.",
  stem:"Which counseling statement is most accurate?",
  correct:["Local destruction is the main concern","BCC usually grows locally and metastasis is rare, but untreated local damage can be substantial."],
  wrong:[["Distant spread is the usual first event","Metastasis is uncommon in BCC."],["The lesion cannot damage nearby tissue","BCC can be locally infiltrative and destructive."],["Confirmed BCC needs no further care","Low metastatic risk does not eliminate the need for definitive specialist management."]],
  explanation:"Explain the favorable metastatic behavior without minimizing the potential for progressive local tissue destruction.",
  claims:[L,M]},
 {
  slug:"neglected-facial",
  complaint:"Large facial BCC",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents with biopsy-confirmed BCC that has enlarged across the central face after years without treatment. There is no known distant disease.",
  stem:"Which risk should be emphasized?",
  correct:["Progressive local tissue destruction","Neglected BCC can invade adjacent structures even when distant metastasis is absent."],
  wrong:[["Routine spontaneous resolution","BCC does not reliably regress without treatment."],["Distant metastasis as the only concern","Local invasion is the principal morbidity in most BCC."],["No morbidity without nodal disease","Serious local damage can occur without nodal or distant spread."]],
  explanation:"Locally advanced BCC warrants prompt specialist care because local invasion can be deforming and morbid.",
  claims:[L,M]},
 {
  slug:"rare-metastasis",
  complaint:"Questions about spread",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, returns with biopsy-confirmed BCC and asks whether metastasis is impossible because the tumor is usually slow growing.",
  stem:"Which response is best supported?",
  correct:["Metastasis is rare, not impossible","BCC seldom metastasizes, but rare spread and important local invasion can occur."],
  wrong:[["Metastasis occurs in most patients","That substantially overstates the metastatic behavior of BCC."],["Metastasis is biologically impossible","Rare metastatic BCC is documented."],["Only metastasis determines seriousness","Local destructive growth can cause major morbidity without distant spread."]],
  explanation:"Use calibrated language: rare does not mean impossible, and local invasion remains clinically important.",
  claims:[L,M]},
 {
  slug:"recurrent-local",
  complaint:"Recurrent biopsy-confirmed BCC",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents with biopsy-confirmed recurrent BCC near a prior treatment site and asks whether recurrence can simply be ignored because metastasis is uncommon.",
  stem:"Which counseling plan is appropriate?",
  correct:["Specialist review for local control","Recurrence can create difficult local destruction despite low metastatic risk."],
  wrong:[["Observe until distant spread appears","Waiting for metastasis ignores the usual local morbidity."],["Provide reassurance without follow-up","Recurrence requires active evaluation and planning."],["Treat as a harmless scar only","Biopsy has already confirmed recurrent BCC."]],
  explanation:"Rare metastasis is not a reason to dismiss recurrent disease; local control remains the key concern.",
  claims:[L,M]},
]);
const spec:FamilySpec={slug:"basal-cell-carcinoma",label:"Basal cell carcinoma",
  claims:[{id:R,statement:"A slowly enlarging pearly or translucent papule or nodule, often with telangiectasia or ulceration, is concerning for BCC and warrants diagnostic confirmation; a scar-like plaque can represent morpheaform BCC.",sourceIds:[SOURCES.bccNci.id],category:"presentation",limitation:"Clinical appearance raises concern but does not establish histology.",population:"Adults with a new or changing skin lesion."},{id:L,statement:"BCC usually grows locally and can cause substantial destructive morbidity if neglected or recurrent.",sourceIds:[SOURCES.bccNci.id,SOURCES.bccS2k.id],category:"presentation",limitation:"No rate or timeline is asserted.",population:"Adults with biopsy-confirmed BCC."},{id:M,statement:"Metastasis from BCC is rare, but this does not minimize locally advanced disease or remove the need for care.",sourceIds:[SOURCES.bccNci.id,SOURCES.bccS2k.id],category:"safety_boundary",limitation:"No numeric incidence is taught.",population:"Adults with biopsy-confirmed BCC."}],sources:[SOURCES.bccNci,SOURCES.bccS2k],concepts:[{id:"concept.basal-cell-carcinoma.clinical-pattern-recognition",displayName:"Recognize a basal cell carcinoma pattern",learningObjective:"Recognize clinical patterns concerning for BCC and arrange diagnostic confirmation.",stage:0,educationalTier:0,conceptType:"diagnosis",evidenceClaimIds:[R],variants:recognition},{id:"concept.basal-cell-carcinoma.local-invasion-metastasis-counseling",displayName:"Counsel about BCC disease behavior",learningObjective:"Explain that local destruction is the principal concern and metastasis is rare without minimizing advanced disease.",stage:0,educationalTier:0,conceptType:"management",evidenceClaimIds:[L,M],variants:counseling}]};
export const BASAL_CELL_CARCINOMA=buildFamily(spec);




















































