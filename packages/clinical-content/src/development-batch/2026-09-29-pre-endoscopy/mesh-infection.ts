import { buildFamily,type FamilySpec } from "./family-builder"; import { variants } from "./spec-utils"; import { SOURCES } from "./source-catalog";
const R="claim.mesh.deep-pattern",S="claim.mesh.source-control";
const recognition=variants([
 {
  slug:"chronic-sinus",
  complaint:"Drainage near old repair",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents years after ventral-hernia mesh repair with a persistent small opening that intermittently drains purulent fluid and probes toward the prior repair plane. There is no diffuse skin rash.",
  stem:"Which diagnosis is most concerning?",
  correct:["Chronic deep mesh infection","A draining sinus tracking toward implanted mesh supports a deep prosthetic infection."],
  wrong:[["Superficial contact dermatitis","Dermatitis does not create a chronic purulent tract toward the repair plane."],["Uncomplicated postoperative seroma","A seroma does not explain years-later purulent sinus drainage."],["Recurrent reducible ventral hernia","A recurrent defect does not itself explain a draining sinus."]],
  explanation:"An indolent draining sinus after prosthetic hernia repair is concerning for deep mesh infection.",
  claims:[R]},
 {
  slug:"early-cellulitis",
  complaint:"Red incision edge",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents ten days after hernia repair with a small superficial erythematous area at a tape edge. The incision is closed, there is no drainage, fluctuance, fever, deep tenderness, or tract.",
  stem:"Which interpretation best fits the current findings?",
  correct:["Superficial incisional skin process","The limited surface finding lacks evidence of a deep prosthetic infection."],
  wrong:[["Established chronic mesh infection","No sinus, deep collection, fistula, or systemic finding is present."],["Enterocutaneous fistula involving mesh","There is no enteric drainage or tract."],["Necrotizing soft-tissue infection","The stable localized finding lacks severe pain, toxicity, or progression."]],
  explanation:"Do not label every postoperative skin change as deep mesh infection; depth and systemic context matter.",
  claims:[R]},
 {
  slug:"deep-collection",
  complaint:"Fever after hernia repair",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents two months after mesh repair with fever, deep abdominal-wall tenderness, and an outside CT showing a rim-enhancing collection around the prosthesis.",
  stem:"Which diagnosis best integrates the findings?",
  correct:["Deep prosthetic mesh infection","A deep collection surrounding mesh with fever supports prosthetic infection."],
  wrong:[["Uncomplicated postoperative seroma","Fever, rim enhancement, and deep tenderness argue against a simple seroma."],["Superficial stitch reaction","A stitch reaction does not explain a periprosthetic collection."],["Recurrent noninfected hernia","A fascial recurrence does not explain the febrile collection."]],
  explanation:"Systemic inflammation plus a periprosthetic collection is a deep source-control problem.",
  claims:[R],
  acuity:"urgent"},
 {
  slug:"enteric-drainage",
  complaint:"Fluid from repair scar",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents years after mesh repair with new enteric-appearing drainage from a chronic abdominal-wall sinus and increasing deep tenderness. Vital signs are stable.",
  stem:"Which complication requires prompt evaluation?",
  correct:["Mesh infection with fistula","Enteric drainage through a chronic tract raises concern for fistula involving an infected prosthetic field."],
  wrong:[["Simple superficial folliculitis","Folliculitis does not produce enteric drainage from a deep chronic tract."],["Sterile late seroma only","Enteric-appearing drainage is not explained by an uncomplicated sterile seroma."],["Asymptomatic hernia recurrence","The draining tract and tenderness are not an asymptomatic recurrence."]],
  explanation:"A chronic sinus with enteric drainage requires prompt specialist assessment for deep infection and fistula.",
  claims:[R,S]},
]);
const planning=variants([
 {
  slug:"stable-sinus",
  complaint:"Chronic mesh drainage",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents with a stable chronic draining sinus tracking toward prior ventral-hernia mesh. There is no shock, peritonitis, or rapidly spreading infection.",
  stem:"Which next step is most appropriate?",
  correct:["Hernia-infection review","Deep prosthetic infection needs specialist source-control planning."],
  wrong:[["Topical skin care alone","Surface care does not address a tract toward implanted material."],["Routine annual observation","Persistent purulent drainage warrants active specialist evaluation."],["Automatic mesh removal today","Removal may be needed, but the source and operative plan require individualized evaluation."]],
  explanation:"Coordinate prompt specialist evaluation; source control is individualized rather than reduced to surface treatment or automatic explantation.",
  claims:[S]},
 {
  slug:"septic-collection",
  complaint:"Fever and wound pain",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents after mesh repair with fever, tachycardia, worsening deep wound pain, and a known periprosthetic collection.",
  stem:"Which disposition is required?",
  correct:["Immediate hospital assessment","Systemic illness with a periprosthetic collection requires urgent source-control evaluation."],
  wrong:[["Routine outpatient wound visit","Routine scheduling is unsafe with systemic illness and a deep collection."],["Oral antibiotics without review","Antibiotics alone do not replace source-control assessment."],["Delayed elective wound review","Delayed reassessment is unsafe in a worsening systemic presentation."]],
  explanation:"Systemic illness and a deep prosthetic collection require immediate hospital surgical assessment without a clinic testing delay.",
  claims:[S],
  acuity:"urgent",
  prototypeVitalSigns:{heartRateBpm:116,systolicBloodPressureMmHg:104,diastolicBloodPressureMmHg:66,temperatureF:101.5,oxygenSaturationPercent:97}},
 {
  slug:"failed-conservative",
  complaint:"Persistent mesh sinus",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, returns after a specialist-directed conservative attempt for deep mesh infection. Drainage and the sinus persist, and the hernia specialist is reassessing source control.",
  stem:"Which counseling statement is most accurate?",
  correct:["Mesh removal may become necessary","Persistent infection after conservative care may require prosthetic removal within an individualized operative plan."],
  wrong:[["Continue the same conservative plan unchanged","Persistent drainage warrants reassessment rather than automatic continuation."],["Schedule immediate removal without reassessment","Removal may be needed, but anatomy, infection source, and operative risk still require planning."],["Treat only the draining skin opening","Surface treatment does not address the unresolved deep prosthetic source."]],
  explanation:"Failure of conservative management can make removal necessary, but the decision is individualized rather than universal.",
  claims:[S]},
 {
  slug:"superficial-only",
  complaint:"Small skin irritation",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents after repair with a limited superficial tape reaction, a closed incision, and no fever, drainage, fluctuance, sinus, or deep tenderness.",
  stem:"Which management frame is appropriate?",
  correct:["Treat superficial skin disease","The current findings do not establish a deep prosthetic source requiring mesh intervention."],
  wrong:[["Refer for prosthetic explantation","There is no evidence of deep mesh infection."],["Admit for deep source control","The stable superficial presentation does not justify that pathway."],["Begin treatment for a deep fistula","No drainage or fistulous tract is present."]],
  explanation:"Depth-specific assessment prevents unnecessary prosthetic intervention for a superficial process.",
  claims:[R,S]},
]);
const spec:FamilySpec={slug:"mesh-infection",label:"Prosthetic mesh infection",pairing:{indices:[0],updates:["Focused examination confirms a chronic sinus tracking toward the prior mesh plane without acute systemic instability."]},
  claims:[{id:R,statement:"Prosthetic mesh infection may present as a chronic or indolent deep process with sinus drainage, collection, fistula, or systemic infection rather than superficial incisional erythema alone.",sourceIds:[SOURCES.mesh.id],category:"presentation",limitation:"Single consensus source; findings require clinical correlation.",population:"Adults after hernia repair with implanted mesh."},{id:S,statement:"Suspected deep mesh infection needs prompt specialist source-control evaluation; treatment is individualized and failed conservative management may require removal, so removal is not automatic.",sourceIds:[SOURCES.mesh.id],category:"management",limitation:"Exact antibiotics and operative technique are outside scope.",population:"Adults with suspected deep prosthetic mesh infection."}],sources:[SOURCES.mesh],concepts:[{id:"concept.prosthetic-mesh-infection.deep-infection-recognition",displayName:"Recognize deep mesh infection",learningObjective:"Distinguish deep prosthetic mesh infection from a superficial postoperative skin process.",stage:0,educationalTier:1,conceptType:"diagnosis",evidenceClaimIds:[R],variants:recognition},{id:"concept.prosthetic-mesh-infection.specialist-source-control-evaluation",displayName:"Escalate deep mesh infection",learningObjective:"Arrange prompt specialist source-control evaluation without assuming universal mesh removal.",stage:0,educationalTier:1,conceptType:"management",evidenceClaimIds:[S],variants:planning}]};
export const MESH_INFECTION=buildFamily(spec);





















































