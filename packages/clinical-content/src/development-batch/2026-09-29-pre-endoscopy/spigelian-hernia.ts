import { buildFamily, type FamilySpec } from "./family-builder";
import { variants } from "./spec-utils";
import { SOURCES } from "./source-catalog";
const R="claim.spigelian.anatomy-recognition",P="claim.spigelian.repair-referral";
const recognition=variants([
 {
  slug:"palpable-lateral",
  complaint:"Lateral abdominal bulge",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents with a reducible focal bulge lateral to the rectus muscle along the semilunar region. It becomes visible with standing and cough and is not at a prior incision.",
  stem:"Which diagnosis best fits this location and examination?",
  correct:["Spigelian hernia","A lateral ventral defect along the semilunar region is the characteristic anatomic pattern."],
  wrong:[["Incisional ventral hernia","There is no prior incision at the defect."],["Primary umbilical hernia","An umbilical defect is midline rather than lateral."],["Rectus diastasis","Diastasis is a broad midline separation rather than a focal lateral defect."]],
  explanation:"The focal lateral semilunar-region defect supports a Spigelian hernia.",
  claims:[R]},
 {
  slug:"occult-standing",
  complaint:"Intermittent side swelling",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, reports an intermittent focal swelling at the left lateral abdominal wall with standing. Supine examination is equivocal, and no prior incision crosses the area.",
  stem:"Which next test is most appropriate for this diagnostic uncertainty?",
  correct:["Abdominal-wall ultrasound","Dynamic targeted ultrasound can assess an equivocal lateral abdominal-wall defect."],
  wrong:[["Hepatobiliary ultrasound","A hepatobiliary study does not target the suspected fascial defect.",{timingProfileId:"timing.test.ultrasound",serviceId:"service.ultrasound"}],["Pelvic organ ultrasound","A pelvic-organ study does not target the lateral abdominal-wall defect.",{timingProfileId:"timing.test.ultrasound",serviceId:"service.ultrasound"}],["Lower-extremity venous duplex","A venous study does not assess an abdominal-wall fascial defect.",{timingProfileId:"timing.test.ultrasound",serviceId:"service.ultrasound"}]],
  explanation:"When examination is uncertain, targeted abdominal-wall ultrasonography or CT can establish the diagnosis.",
  claims:[R],
  test:{timingProfileId:"timing.test.ultrasound",serviceId:"service.ultrasound",gate:{serviceId:"service.ultrasound",pendingLabel:"Abdominal-wall ultrasound pending",resultNarrative:"Targeted ultrasound confirms a small reducible lateral defect through the Spigelian fascia without obstruction.",routeIds:["route.ultrasound.in_house","route.ultrasound.outsourced"]}}},
 {
  slug:"completed-ct",
  complaint:"Review abdominal CT",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, reviews an outside CT obtained for a lateral abdominal-wall lump. The report describes fat protruding through a focal defect in the Spigelian fascia, lateral to the rectus muscle.",
  stem:"Which diagnosis does the completed report support?",
  correct:["Spigelian hernia","The report localizes a focal defect to the Spigelian fascia."],
  wrong:[["Lumbar hernia","A lumbar defect is posterior or posterolateral rather than along the semilunar region."],["Incisional hernia","No incision-related fascial defect is described."],["Rectus sheath hematoma","A hematoma does not protrude through a fascial defect."]],
  explanation:"Completed cross-sectional imaging can confirm the characteristic lateral ventral defect.",
  claims:[R]},
 {
  slug:"diffuse-midline",
  complaint:"Midline abdominal ridge",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents with a broad midline ridge during a sit-up. There is no focal lateral defect, pain, incarceration, or prior abdominal-wall incision.",
  stem:"Which finding argues against a Spigelian hernia?",
  correct:["Broad midline ridge","A Spigelian hernia is a focal lateral defect, not diffuse midline widening."],
  wrong:[["Focal semilunar-region cough impulse","That finding would support a Spigelian hernia."],["Lateral fascial defect on ultrasound","That result would support a Spigelian hernia."],["Localized lateral bulge with standing","That pattern would support a Spigelian hernia."]],
  explanation:"Anatomic localization prevents a diffuse midline process from being mislabeled as a lateral Spigelian defect.",
  claims:[R]},
]);
const planning=variants([
 {
  slug:"stable-confirmed",
  complaint:"Discuss hernia CT",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, returns with a CT-confirmed reducible Spigelian hernia, intermittent discomfort, normal bowel function, and no skin change or acute tenderness.",
  stem:"Which disposition is most appropriate?",
  correct:["Elective hernia-surgery consultation","A confirmed stable Spigelian hernia supports individualized repair discussion."],
  wrong:[["Immediate emergency operation","The presentation lacks obstruction, ischemia, or irreducibility."],["Routine gastroenterology referral","The problem is an abdominal-wall defect rather than a luminal gastrointestinal disorder."],["Permanent observation without review","The confirmed symptomatic defect warrants surgical discussion even though technique is individualized."]],
  explanation:"Refer the stable confirmed defect for elective repair discussion; the evidence does not support one universal operative method.",
  claims:[P]},
 {
  slug:"asymptomatic-confirmed",
  complaint:"Incidental lateral hernia",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, is seen after outside imaging incidentally confirmed a small reducible Spigelian hernia. There are no obstructive symptoms or acute examination findings, and the patient wants to understand options.",
  stem:"Which plan best addresses this finding?",
  correct:["Elective hernia review","A specialist can discuss repair, observation considerations, and patient goals without declaring an emergency."],
  wrong:[["Emergency transfer for incarceration","No irreducibility or obstruction is described."],["Choose laparoscopic repair in clinic","The evidence does not establish one universal technique and repair is not a clinic procedure."],["Dismiss the imaging finding","A confirmed uncommon hernia merits a documented shared discussion."]],
  explanation:"A confirmed stable Spigelian hernia receives individualized surgical counseling rather than automatic emergency care or a mandated technique.",
  claims:[P]},
 {
  slug:"irreducible-pain",
  complaint:"Painful fixed side bulge",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, presents with a known Spigelian hernia that became acutely painful and irreducible with vomiting and abdominal distention.",
  stem:"Which disposition is required?",
  correct:["Emergency surgical assessment","Pain, irreducibility, vomiting, and distention raise concern for an incarcerated obstructing hernia."],
  wrong:[["Same-week elective hernia consultation","The acute obstructive pattern is unsafe for elective scheduling."],["Outpatient analgesia with next-day review","Symptom control and a delayed return do not address possible incarceration and obstruction."],["Outpatient ultrasound before referral","A clinic test must not delay emergency surgical assessment.",{timingProfileId:"timing.test.ultrasound",serviceId:"service.ultrasound"}]],
  explanation:"Urgent features override the elective pathway and require immediate hospital surgical assessment.",
  claims:[P],
  acuity:"urgent"},
 {
  slug:"technique-question",
  complaint:"Choosing a repair method",
  presentation:"{patientName}, a {patientAge}-year-old {patientSex}, returns with a stable confirmed Spigelian hernia and asks whether every patient should receive the same open or laparoscopic repair.",
  stem:"Which counseling response is best supported?",
  correct:["Technique depends on case and expertise","Limited evidence does not establish one repair method for every Spigelian hernia."],
  wrong:[["Select laparoscopy from hernia type alone","The guideline does not establish one approach from the diagnosis alone."],["Select open repair from reducibility alone","Reducibility does not determine a universal operative approach."],["Choose observation from symptom status alone","Symptoms matter, but management also depends on anatomy, patient factors, and expertise."]],
  explanation:"The repair decision belongs in specialist shared planning because available evidence does not support one universal technique.",
  claims:[P]},
]);
const spec:FamilySpec={slug:"spigelian-hernia",label:"Spigelian hernia",pairing:{indices:[0,1],updates:["The lateral defect is confirmed as reducible, bowel function remains normal, and the patient asks about definitive options.","Targeted ultrasound confirms a small reducible Spigelian hernia without obstruction, and the patient asks about management options."]},
  claims:[{id:R,statement:"Spigelian hernia occurs through the Spigelian fascia along the lateral ventral abdominal wall; examination, ultrasonography, or CT may establish the diagnosis.",sourceIds:[SOURCES.spigelian.id],category:"evaluation",limitation:"Single-guideline evidence; no imaging test is mandatory when examination is clear.",population:"Adults with a suspected lateral ventral abdominal-wall defect."},{id:P,statement:"A confirmed Spigelian hernia supports surgical repair discussion, but evidence is insufficient to prescribe one open or laparoscopic technique for every patient.",sourceIds:[SOURCES.spigelian.id],category:"management",certainty:"low",limitation:"Urgent incarceration or obstruction requires emergency assessment.",population:"Adults with confirmed Spigelian hernia."}],sources:[SOURCES.spigelian],serviceContracts:[{serviceId:"service.ultrasound",allowedRouteIds:["route.ultrasound.in_house","route.ultrasound.outsourced"],delivery:"existing_balance_contract"},{serviceId:"service.ct",allowedRouteIds:["route.ct.in_house","route.ct.outsourced"],delivery:"existing_balance_contract"}],concepts:[{id:"concept.spigelian-hernia.clinical-imaging-recognition",displayName:"Recognize Spigelian hernia",learningObjective:"Recognize a lateral semilunar-region Spigelian hernia and select imaging when examination is uncertain.",stage:0,educationalTier:1,conceptType:"diagnosis",evidenceClaimIds:[R],variants:recognition},{id:"concept.spigelian-hernia.elective-repair-referral",displayName:"Refer confirmed Spigelian hernia",learningObjective:"Refer a confirmed stable Spigelian hernia for individualized repair discussion while escalating urgent features.",stage:0,educationalTier:1,conceptType:"management",evidenceClaimIds:[P],variants:planning}]};
export const SPIGELIAN_HERNIA=buildFamily(spec);




















































