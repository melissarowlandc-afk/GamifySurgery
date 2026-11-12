// Generated from recorded permitted metadata; no retrieval, date refresh or clinical approval.
import type {ClinicalSource,EvidenceClaim} from "./pilot-schema";

export const QUESTION_NEW_N4_CLAIMS:Array<EvidenceClaim & Record<string,unknown>> = [
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.df90860e477f",
    "statement": "Stable follow-up for persistently increased ileostomy output warrants assessment of renal function, electrolytes, and magnesium for fluid and salt depletion.",
    "sourceIds": [
      "source.bread-butter.bifa-high-output-stoma-2023",
      "source.bread-butter.bifa-oral-rehydration-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "This outpatient pathway excludes shock, acute kidney injury, infection, and obstruction and does not define a universal output threshold.",
    "applicablePopulation": "Stable adults with persistently increased watery ileostomy losses and no acute complication.",
    "lastCheckedOn": "2026-09-17"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.1a302f939983",
    "statement": "After stabilization, a sodium-glucose oral rehydration plan is preferred to simply increasing hypotonic plain-water intake for high-output ileostomy losses.",
    "sourceIds": [
      "source.bread-butter.bifa-high-output-stoma-2023",
      "source.bread-butter.bifa-oral-rehydration-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "No exact output threshold, oral-rehydration formulation, total fluid target, or medication regimen is taught.",
    "applicablePopulation": "Stable adults with high-output ileostomy losses who can drink and have no acute kidney injury, shock, infection, or obstruction.",
    "lastCheckedOn": "2026-09-17"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.10b8e172c6d1",
    "statement": "A localized superficial incisional surgical-site infection with purulence requires opening the involved incision and drainage, with removal of sutures or staples when needed for source control.",
    "sourceIds": [
      "source.bread-butter.idsa-ssti-2014-wound"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Systemic antibiotics depend on systemic response and operative site; deep, organ-space, and necrotizing infections require different care.",
    "applicablePopulation": "Stable adults with purulent superficial incisional infection, intact fascia, and no systemic toxicity.",
    "lastCheckedOn": "2026-09-17"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.23c6ba284b5a",
    "statement": "Suspected eosinophilic esophagitis should be evaluated by upper endoscopy with at least six targeted esophageal biopsies obtained from at least two levels, interpreted with symptoms and exclusion of other causes.",
    "sourceIds": [
      "source.brief.acg-eoe-2025",
      "source.brief.acg-eoe-patient"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "Endoscopic appearance alone is insufficient. The authored patient has no current food impaction or unstable illness.",
    "applicablePopulation": "Stable adults with chronic solid-food dysphagia or food sticking suspicious for eosinophilic esophagitis.",
    "lastCheckedOn": "2026-09-17"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.5294d3feead5",
    "statement": "In a usual adult pathway, positive compatible serology leads to upper endoscopy with duodenal biopsies for diagnostic confirmation.",
    "sourceIds": [
      "source.niddk.celiac-tests.2021",
      "source.niddk.celiac-diagnosis.2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "This does not assert that every adult in every setting must undergo biopsy.",
    "applicablePopulation": "Adults with positive celiac serology and adequate total IgA in a routine diagnostic pathway.",
    "lastCheckedOn": "2026-09-09"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.87469918a5c7",
    "statement": "Starting gluten avoidance before diagnostic testing can alter serologic and biopsy results.",
    "sourceIds": [
      "source.niddk.celiac-tests.2021",
      "source.niddk.celiac-diagnosis.2020",
      "source.acg.celiac-patient-education.2026"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "high",
    "limitation": "The content does not prescribe a gluten challenge.",
    "applicablePopulation": "People undergoing evaluation for possible celiac disease.",
    "lastCheckedOn": "2026-09-09"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.8a59fd5f0d78",
    "statement": "While a patient is eating gluten, tTG-IgA together with total-IgA context is a usual initial serologic assessment for suspected celiac disease.",
    "sourceIds": [
      "source.niddk.celiac-tests.2021",
      "source.niddk.celiac-diagnosis.2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "IgA deficiency changes test selection; serology is not presented as universally definitive.",
    "applicablePopulation": "Adults with compatible symptoms who remain on gluten during diagnostic evaluation.",
    "lastCheckedOn": "2026-09-09"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.3c893f8ee4f0",
    "statement": "A smooth, yellowish, soft gastrointestinal subepithelial lesion that indents with gentle probing has an endoscopic phenotype strongly supportive of lipoma; absence of the cushion or pillow sign alone does not exclude lipoma.",
    "sourceIds": [
      "source.asge.subepithelial-lesions.2017",
      "source.esge.subepithelial-lesions.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The positive phenotype is supportive, while the maneuver has limited sensitivity. Atypical or indeterminate lesions require a separate diagnostic pathway.",
    "applicablePopulation": "Adults with a colonic subepithelial lesion encountered during endoscopy.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.ea03ad0a7d73",
    "statement": "A clearly characterized asymptomatic gastrointestinal lipoma does not require lipoma-directed treatment or dedicated surveillance.",
    "sourceIds": [
      "source.asge.subepithelial-lesions.2017",
      "source.aga.subepithelial-lesions.2022",
      "source.esge.subepithelial-lesions.2022"
    ],
    "evidenceCategory": "management",
    "certainty": "high",
    "limitation": "This applies only when the diagnosis is clear and the lesion is asymptomatic; ordinary colorectal screening or surveillance remains governed by the remainder of the examination and the patient's usual indications.",
    "applicablePopulation": "Adults with a clearly characterized, incidental, asymptomatic colonic lipoma.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.dd856cda49d5",
    "statement": "Sentinel-node biopsy is ordinarily performed with mastectomy for pure DCIS because later lymphatic mapping may be unreliable.",
    "sourceIds": [
      "source.asbrs.axilla.2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single current society source; standard setting without a planned delayed magnetic-tracer strategy.",
    "applicablePopulation": "Adults undergoing mastectomy for pure DCIS.",
    "lastCheckedOn": "2026-10-02"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.6c61d104e5a1",
    "statement": "Routine axillary surgery is generally omitted for pure DCIS treated with uncomplicated breast-conserving surgery when invasion is not suspected.",
    "sourceIds": [
      "source.asbrs.axilla.2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single current society source.",
    "applicablePopulation": "Adults undergoing routine breast conservation for pure DCIS without concern for invasion.",
    "lastCheckedOn": "2026-10-02"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.ddbff2935560",
    "statement": "Sentinel-node biopsy is appropriate when the planned DCIS operation will compromise later mapping or when occult invasion is meaningfully suspected.",
    "sourceIds": [
      "source.asbrs.axilla.2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single current society source; case-specific judgment remains required.",
    "applicablePopulation": "Adults undergoing DCIS surgery with threatened future mapping or concern for occult invasion.",
    "lastCheckedOn": "2026-10-02"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.6b82b00afbc7",
    "statement": "The EHS midline incisional guideline recommends fascial closure with mesh reinforcement rather than routine mesh bridging within its closable-defect scope.",
    "sourceIds": [
      "source.gs028g.ehs-incisional-hernia-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One adequate current guideline; strong recommendation based on low-certainty evidence. Limited to adult midline defects expected to close without advanced release; no forceful closure or guarantee of lower recurrence is taught.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.ed48bbec4ece",
    "statement": "Retrorectus mesh lies between rectus muscle and posterior rectus sheath.",
    "sourceIds": [
      "source.gs028g.ehs-incisional-hernia-2023"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "Anatomic nomenclature from one current society guideline; broader retromuscular terminology also includes the preperitoneal plane. No universal superiority of one operative approach is taught.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.dbcb717c9c9a",
    "statement": "Mucocutaneous separation is detachment between stoma mucosa and adjacent peristomal skin.",
    "sourceIds": [
      "source.gs028g.parini-misstow-ses-2023"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Mapping-review definition; depth, extent and viability must be assessed separately before management.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.fd1d7e5c4396",
    "statement": "Stoma-junction separation is distinct from necrosis, whole-stoma retraction and bowel-segment prolapse.",
    "sourceIds": [
      "source.gs028g.parini-misstow-ses-2023"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Mapping-review definition; depth, extent and viability must be assessed separately before management.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.28f6b50877d4",
    "statement": "Small superficial mucocutaneous separation with viable bowel and no infection can receive conservative local care.",
    "sourceIds": [
      "source.gs028g.parini-misstow-ses-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single adequate mapping review with limited comparative evidence. Only small superficial separation without ischemia, deep contamination or infection is tested; no fixed healing interval is promised.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.7467890b4e97",
    "statement": "Local care of superficial separation includes protection of the wound and pouch seal with follow-up.",
    "sourceIds": [
      "source.gs028g.parini-misstow-ses-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single adequate mapping review with limited comparative evidence. Only small superficial separation without ischemia, deep contamination or infection is tested; no fixed healing interval is promised.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.bcb1afc6bce6",
    "statement": "Deep or severe separation, infection or failed conservative care requires surgical reassessment.",
    "sourceIds": [
      "source.gs028g.parini-misstow-ses-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single adequate mapping review with limited comparative evidence. Only small superficial separation without ischemia, deep contamination or infection is tested; no fixed healing interval is promised.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.a1e25267f8e9",
    "statement": "Intestinal effluent leaking onto peristomal skin can cause irritant dermatitis.",
    "sourceIds": [
      "source.gs028g.babakhanlou-stoma-2022"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": "Single adequate open review; bedside pattern recognition is not proof against superimposed infection, allergy or other skin disease.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.82fe00bb745d",
    "statement": "Moist superficial injury that follows an observed leakage distribution supports an effluent-related irritant process.",
    "sourceIds": [
      "source.gs028g.babakhanlou-stoma-2022"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": "Single adequate open review; bedside pattern recognition is not proof against superimposed infection, allergy or other skin disease.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.1a6b88bdf1b0",
    "statement": "Inspect and correct an ill-fitting pouch when leakage causes peristomal irritant dermatitis.",
    "sourceIds": [
      "source.gs028g.babakhanlou-stoma-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single adequate open review; exact products, convexity, skin preparations and infection treatment must be individualized by the ostomy team.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.da2f704793ec",
    "statement": "Subtotal cholecystectomy is an accepted bailout when safe anatomic identification and the critical view cannot be established.",
    "sourceIds": [
      "source.gs028g.wses-cholecystitis-2020",
      "source.gs028g.ramirez-subtotal-2023"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Guideline plus independent review; subtotal is an accepted option, not the only safe strategy. Conversion or stopping may also be appropriate and are not used as wrong options.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.86849d22206f",
    "statement": "Avoid hazardous division of unidentified structures during difficult cholecystectomy.",
    "sourceIds": [
      "source.gs028g.wses-cholecystitis-2020",
      "source.gs028g.ramirez-subtotal-2023"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Guideline plus independent review; subtotal is an accepted option, not the only safe strategy. Conversion or stopping may also be appropriate and are not used as wrong options.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.77d7aef55c11",
    "statement": "Conversion and other safe bailout strategies remain legitimate alternatives to subtotal surgery.",
    "sourceIds": [
      "source.gs028g.wses-cholecystitis-2020",
      "source.gs028g.ramirez-subtotal-2023"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Guideline plus independent review; subtotal is an accepted option, not the only safe strategy. Conversion or stopping may also be appropriate and are not used as wrong options.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.3ef0d7efc452",
    "statement": "Prosthetic mesh infection may present as a chronic or indolent deep process with sinus drainage, collection, fistula, or systemic infection rather than superficial incisional erythema alone.",
    "sourceIds": [
      "source.mesh.wses-sise-2018"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": "Single consensus source; findings require clinical correlation.",
    "applicablePopulation": "Adults after hernia repair with implanted mesh.",
    "lastCheckedOn": "2026-09-29"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.40b34fe591d8",
    "statement": "Suspected deep mesh infection needs prompt specialist source-control evaluation; treatment is individualized and failed conservative management may require removal, so removal is not automatic.",
    "sourceIds": [
      "source.mesh.wses-sise-2018"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Exact antibiotics and operative technique are outside scope.",
    "applicablePopulation": "Adults with suspected deep prosthetic mesh infection.",
    "lastCheckedOn": "2026-09-29"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.223dab952919",
    "statement": "Stable nonobstructed parastomal hernia symptoms may receive individualized appliance, support, activity, education, and external referral measures.",
    "sourceIds": [
      "source.parastomal.nursing-2025",
      "source.ostomy.missto-wses-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Evidence is limited; no universal garment or routine operation is supported.",
    "applicablePopulation": "Adults with a stable reducible parastomal hernia.",
    "lastCheckedOn": "2026-09-28"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.42635f86f7a9",
    "statement": "A dynamic peristomal bulge compatible with a fascial defect supports parastomal-hernia recognition; uncertainty or obstructive symptoms require further assessment.",
    "sourceIds": [
      "source.ostomy.missto-wses-2023",
      "source.parastomal.ehs-2018"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The EHS source is a limited cross-check; detailed boundaries rely on the open mapping review.",
    "applicablePopulation": "Adults with an established stoma and new peristomal contour change.",
    "lastCheckedOn": "2026-09-28"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.d70e777dbe3f",
    "statement": "A painful nonreducible parastomal bulge with vomiting or reduced output requires urgent surgical evaluation for obstruction or ischemia.",
    "sourceIds": [
      "source.ostomy.missto-wses-2023",
      "source.stoma.acpgbi-2021"
    ],
    "evidenceCategory": "disposition",
    "certainty": "moderate",
    "limitation": "No clinic maneuver should delay transfer.",
    "applicablePopulation": "Adults with a stoma and acute obstructive features.",
    "lastCheckedOn": "2026-09-28"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.c6d38b0b02a0",
    "statement": "Limited adolescent pilonidal disease without an acute abscess can initially be managed with an individualized conservative care plan.",
    "sourceIds": [
      "source.pediatric-clinic.metzger-pilonidal-2021"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One eligible pediatric expert perspective, not a formal guideline. Plan and escalation are individualized; no comparative superiority, exact interval, medication or hair-removal regimen is taught.",
    "applicablePopulation": "Adolescents with limited pilonidal disease and no current acute infection.",
    "lastCheckedOn": "2026-10-08"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.803d081a7ae2",
    "statement": "An acute pilonidal abscess represents a different management situation from limited disease without acute infection.",
    "sourceIds": [
      "source.pediatric-clinic.metzger-pilonidal-2021"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "One eligible pediatric expert perspective, not a formal guideline. Plan and escalation are individualized; no comparative superiority, exact interval, medication or hair-removal regimen is taught. This batch has no acute abscess procedure, antibiotic or pediatric sedation flow.",
    "applicablePopulation": "Adolescents with pilonidal disease.",
    "lastCheckedOn": "2026-10-08"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.64fb82fc7f10",
    "statement": "Cleft cleanliness is a component of conservative pilonidal care.",
    "sourceIds": [
      "source.pediatric-clinic.metzger-pilonidal-2021"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One eligible pediatric expert perspective, not a formal guideline. Plan and escalation are individualized; no comparative superiority, exact interval, medication or hair-removal regimen is taught.",
    "applicablePopulation": "Adolescents receiving conservative pilonidal care.",
    "lastCheckedOn": "2026-10-08"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.9d5eaf817018",
    "statement": "Natal-cleft midline pits with intermittent drainage are compatible with chronic pilonidal disease.",
    "sourceIds": [
      "source.pediatric-clinic.metzger-pilonidal-2021"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": "One eligible pediatric expert perspective, not a formal guideline. Plan and escalation are individualized; no comparative superiority, exact interval, medication or hair-removal regimen is taught.",
    "applicablePopulation": "Adolescents with a natal-cleft complaint.",
    "lastCheckedOn": "2026-10-08"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.fe5e38fe01ce",
    "statement": "Hair management can be discussed as part of an individualized conservative pilonidal plan.",
    "sourceIds": [
      "source.pediatric-clinic.metzger-pilonidal-2021"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One eligible pediatric expert perspective, not a formal guideline. Plan and escalation are individualized; no comparative superiority, exact interval, medication or hair-removal regimen is taught. A universal razor, laser or depilatory protocol is withheld.",
    "applicablePopulation": "Adolescents receiving conservative pilonidal care.",
    "lastCheckedOn": "2026-10-08"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.cf350cc3230f",
    "statement": "Reducing retained moisture in the cleft is a component of conservative pilonidal care.",
    "sourceIds": [
      "source.pediatric-clinic.metzger-pilonidal-2021"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One eligible pediatric expert perspective, not a formal guideline. Plan and escalation are individualized; no comparative superiority, exact interval, medication or hair-removal regimen is taught.",
    "applicablePopulation": "Adolescents receiving conservative pilonidal care.",
    "lastCheckedOn": "2026-10-08"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.5278b9358a66",
    "statement": "Reducing prolonged direct pressure on the affected cleft can be discussed during conservative pilonidal care.",
    "sourceIds": [
      "source.pediatric-clinic.metzger-pilonidal-2021"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One eligible pediatric expert perspective, not a formal guideline. Plan and escalation are individualized; no comparative superiority, exact interval, medication or hair-removal regimen is taught.",
    "applicablePopulation": "Adolescents receiving conservative pilonidal care.",
    "lastCheckedOn": "2026-10-08"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.8290e8a874de",
    "statement": "Persistent symptoms or substantial disease burden should trigger reassessment of a conservative pilonidal plan.",
    "sourceIds": [
      "source.pediatric-clinic.metzger-pilonidal-2021"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One eligible pediatric expert perspective, not a formal guideline. Plan and escalation are individualized; no comparative superiority, exact interval, medication or hair-removal regimen is taught.",
    "applicablePopulation": "Adolescents followed for pilonidal disease.",
    "lastCheckedOn": "2026-10-08"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.8f03b4ef56b7",
    "statement": "Surveillance of a retractile testis should identify acquired ascent requiring referral.",
    "sourceIds": [
      "source.pediatric-clinic.cua-puc-testis-2017",
      "source.pediatric-clinic.cornwall-surgery-2025"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "No invented ascent probability, deadline or automatic operative trigger is assigned.",
    "applicablePopulation": "Boys followed for a true retractile testis.",
    "lastCheckedOn": "2026-10-08"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.32632eb28aa1",
    "statement": "A true retractile testis can be placed in the normal scrotal position without tension and remains there after release.",
    "sourceIds": [
      "source.pediatric-clinic.cua-puc-testis-2017"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "A society examination definition; a persistently high or immediately reascending testis is excluded from the authored true-retractile profiles.",
    "applicablePopulation": "Boys with intermittent testicular retraction.",
    "lastCheckedOn": "2026-10-08"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.ed485fb1c469",
    "statement": "A true retractile testis requires documented follow-up examination of its position.",
    "sourceIds": [
      "source.pediatric-clinic.cua-puc-testis-2017",
      "source.pediatric-clinic.cuh-testis-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Independent society and NHS sources support surveillance. No exact surveillance interval is embedded in question prose.",
    "applicablePopulation": "Boys with a clinically confirmed true retractile testis.",
    "lastCheckedOn": "2026-10-08"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.c78329a0ee7f",
    "statement": "The cited CUA-PUC guideline does not recommend operative treatment of a true retractile testis.",
    "sourceIds": [
      "source.pediatric-clinic.cua-puc-testis-2017",
      "source.pediatric-clinic.cuh-testis-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Applies only to the explicitly defined true-retractile profile, not all high or persistently retractile testes.",
    "applicablePopulation": "Boys whose testis meets the true-retractile examination definition.",
    "lastCheckedOn": "2026-10-08"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.2f251a75ceb4",
    "statement": "A conventional combination pathway for an actively bleeding peptic ulcer uses dilute epinephrine injection for temporary control followed by contact thermal or mechanical hemostasis.",
    "sourceIds": [
      "source.acg.upper-gastrointestinal-ulcer-bleeding-guideline.2021",
      "source.esge.peptic-ulcer-bleeding-guideline.2026"
    ],
    "evidenceCategory": "management",
    "certainty": "high",
    "limitation": "This is a conventional pathway, not a claim that every actively bleeding ulcer must receive epinephrine or that selected contemporary OTS-clip or hemostatic-forceps monotherapy is never appropriate.",
    "applicablePopulation": "Appropriately stabilized adults undergoing hospital endoscopy for an actively bleeding peptic ulcer when the conventional epinephrine-combination pathway is selected.",
    "lastCheckedOn": "2026-08-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.e55b4be019b7",
    "statement": "Epinephrine injection should not be used as the sole definitive endoscopic treatment for a high-risk bleeding peptic ulcer; when epinephrine is selected, it must be paired with a definitive hemostatic modality.",
    "sourceIds": [
      "source.acg.upper-gastrointestinal-ulcer-bleeding-guideline.2021",
      "source.esge.peptic-ulcer-bleeding-guideline.2026"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "high",
    "limitation": "This claim does not require epinephrine in every hemostatic plan and does not make an accepted thermal, mechanical, or selected advanced modality inadequate merely because injection was omitted.",
    "applicablePopulation": "Adults receiving endoscopic hemostasis for a peptic ulcer with active bleeding or a nonbleeding visible vessel when epinephrine injection is under consideration.",
    "lastCheckedOn": "2026-08-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.dda382649df0",
    "statement": "Peptic ulcers with active spurting, active oozing, or a nonbleeding visible vessel are high-risk endoscopic findings for which endoscopic hemostasis is indicated.",
    "sourceIds": [
      "source.acg.upper-gastrointestinal-ulcer-bleeding-guideline.2021",
      "source.esge.peptic-ulcer-bleeding-guideline.2026"
    ],
    "evidenceCategory": "management",
    "certainty": "high",
    "limitation": "This claim assumes the patient has been appropriately assessed and stabilized for endoscopy; it does not define pre-endoscopy resuscitation, transfusion, medication, or disposition decisions.",
    "applicablePopulation": "Adults undergoing upper endoscopy for suspected or confirmed nonvariceal peptic-ulcer bleeding.",
    "lastCheckedOn": "2026-08-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.bf7d58a0e363",
    "statement": "Resting ankle-brachial index testing is an appropriate initial physiologic test for reproducible exertional calf discomfort relieved by rest with examination findings suggesting lower-extremity peripheral arterial disease.",
    "sourceIds": [
      "source.expansion.nhlbi-pad-diagnosis-2022",
      "source.expansion.sbacv-pad-2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Normal or high values can be misleading with noncompressible vessels; exercise ABI or toe-pressure assessment may be needed when suspicion persists.",
    "applicablePopulation": "Stable adults with classic exertional calf symptoms, suggestive examination findings, and no limb threat.",
    "lastCheckedOn": "2026-09-11"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "lastCheckedOn": "2026-11-04",
    "id": "claim.n4.c47adccfb385",
    "statement": "Removal of the breast gland with retention of the skin envelope is a mastectomy rather than a localized breast-conserving excision; the conventional pure-DCIS axillary staging distinction follows the gland operation.",
    "basisClaimIds": [
      "claim.gs028c.dcis.axilla-mastectomy",
      "claim.gs028c.dcis.axilla-omit-bcs"
    ],
    "sourceIds": [
      "source.asbrs.axilla.2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the explicitly described synthetic adult question-flag round-three profiles.",
    "limitation": "Anatomical application of the recorded standard-operation rule. No delayed-tracer strategy or universal oncoplastic-operation rule is added.",
    "verificationScope": "Offline author synthesis/application from recorded claims and their existing source records; no fresh source retrieval, source-access-date change or clinical approval. Direct alignment of the application remains for independent clinical/source review."
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.a172b22493cd",
    "statement": "When a pouch opening leaves peristomal skin exposed to effluent, fit assessment and an opening fitted around the stoma base address continuing contact injury.",
    "sourceIds": [
      "source.gs028g.babakhanlou-stoma-2022",
      "source.qq20261028.wocn-peristomal"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Does not exclude coexisting infection or prescribe one product, wear interval or opening dimension. Exact skin-distribution interpretation requires clinician review.",
    "applicablePopulation": "People with an ostomy and suspected effluent-related peristomal skin injury.",
    "lastCheckedOn": "2026-10-28"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.c2690749ba1d",
    "statement": "Clinically node-negative invasive melanoma in the supplied greater-than-1-mm range calls for sentinel-node staging consideration; reassuring ultrasound does not replace microscopic nodal staging.",
    "sourceIds": [
      "source.qq20261102a.eado2024",
      "source.qq20261102a.nci-melanoma"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Existing synthetic thickness values are retained. No fixed metastatic probability or survival benefit asserted; subtype and patient suitability remain clinician review.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.be062b16f447",
    "statement": "A nonbleeding ulcer vessel can receive mechanical or contact-thermal hemostasis; epinephrine alone is inadequate, and topical agents are not routine sole initial therapy for that finding.",
    "sourceIds": [
      "source.qq20261102a.esge-ulcer"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Current specific guideline only for the new modality comparison; retained ACG evidence independently supports hemostasis indication. Powder can be appropriate rescue/temporizing therapy; after the failed clip the selected contact treatment supplements epinephrine rather than repeating monotherapy. No dose or universal rescue sequence authored.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.34c93980671c",
    "statement": "A feasible image-guided core biopsy is preferred initially for a suspicious deep extremity soft-tissue mass.",
    "sourceIds": [
      "source.qq20261102b.seom2024",
      "source.qq20261102b.essr2015"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Open biopsy is a selected alternative, not universally wrong; no failed core, needle gauge, sample count or tumor subtype is invented.",
    "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.f24af3ddd3a9",
    "statement": "Sentinel-node mapping/biopsy is preferably coordinated with wide excision before flap or graft reconstruction can disrupt later mapping.",
    "sourceIds": [
      "source.qq20261102b.cco-melanoma"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Direct older primary technical guideline; current retained staging-indication evidence is independently mapped. No blanket contraindication after every excision or exact reliability effect is asserted.",
    "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.6ebd44d818b0",
    "statement": "A characteristic submucosal lipoma need not receive another specimen solely because overlying mucosal tissue is normal.",
    "sourceIds": [
      "source.qq20261102c.sel2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One complete primary guideline rechecked for wall layers, diagnostic lipoma patterns and selective tissue acquisition. The normal-mucosa scenario is an anatomic application; atypical or genuinely indeterminate lesions require another pathway.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.db73b0b71f66",
    "statement": "Local MRI for suspected soft-tissue malignancy should depict the full lesion and relevant compartment relationships before biopsy planning.",
    "sourceIds": [
      "source.qq20261102c.essr2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Previously verified primary society guidance. Missing enhancement/viability information is a separate target-planning application, requiring radiologist review; no contrast dose or imaging diagnosis is inferred.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.f1fa567648e6",
    "statement": "Transcatheter embolization should be considered after unsuccessful repeat endoscopic hemostasis when available.",
    "sourceIds": [
      "source.qq20261102c.esge-ulcer2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One adequate current primary guideline. Surgery may be needed when embolization is unavailable/unsuccessful or individual circumstances require it; no universal vital-sign threshold.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.49a69d44d485",
    "statement": "Recurrent peptic-ulcer bleeding after initial successful hemostasis can warrant repeat endoscopic therapy, with consideration of an OTS clip.",
    "sourceIds": [
      "source.qq20261102c.esge-ulcer2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One adequate current full primary guideline. Actual resuscitation/access and prior course matter; not a universal requirement to repeat endoscopy despite any instability or contraindication.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.d8826fad12fe",
    "statement": "A specimen limited to colonic mucosa does not provide histologic confirmation of a mass localized to submucosa, even when the integrated endoscopic and EUS phenotype supports lipoma.",
    "sourceIds": [
      "source.qq20261102d.sel2022"
    ],
    "limitation": "An anatomical application of previously verified primary ESGE guidance, with one adequate source. This separates clinical characterization from histologic proof; it does not imply another biopsy is required or change the passed asymptomatic management premise.",
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "The identified synthetic adult teaching cases; constructed observations are not patient data or clinical thresholds.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.d7381707b15d",
    "statement": "A smaller invasive-depth measurement from a different partial specimen does not erase a greater valid demonstrated invasive extent; an incomplete whole-lesion maximum can still have a known lower bound relevant to a supported planning discussion.",
    "sourceIds": [
      "source.qq20261102f.esmo2025",
      "source.qq20261102f.nci-melanoma"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Original cross-specimen application of previously verified full-thickness sampling and maximum-depth reporting guidance, not a separately retrieved specimen-integration rule. Dermatopathology must confirm validity and mapping. The 1.8-mm value is retained from this case's existing completed-primary record and 0.6 mm from its existing partial report; their new constructed placement is not a management cutoff. The actual greater-than-1-mm nodal-discussion boundary is separately mapped to existing claim.qq20261102a.melanoma-integrated-node-staging.",
    "applicablePopulation": "The identified named synthetic adult teaching cases; measurements and acquisition observations are constructed, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-03"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.55bfe6e710a5",
    "statement": "MRI is appropriate for local characterization of a deep, enlarging, or ultrasound-indeterminate extremity soft-tissue mass before biopsy.",
    "sourceIds": [
      "source.essr.soft-tissue-imaging.2024",
      "source.nci.soft-tissue-sarcoma-pdq.2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "MRI can characterize and guide planning but cannot by itself prove sarcoma.",
    "applicablePopulation": "Stable adults with a deep, enlarging, or ultrasound-indeterminate extremity soft-tissue mass.",
    "lastCheckedOn": "2026-09-09"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.d9ff60dfac0d",
    "statement": "A suspicious extremity soft-tissue mass should reach an experienced sarcoma team before a planned image-guided core biopsy so the biopsy path respects a future surgical approach.",
    "sourceIds": [
      "source.essr.soft-tissue-imaging.2024",
      "source.nci.soft-tissue-sarcoma-pdq.2025"
    ],
    "evidenceCategory": "management",
    "certainty": "high",
    "limitation": "Biopsy technique and selected incisional approaches remain specialist decisions; imaging suspicion is not a tissue diagnosis.",
    "applicablePopulation": "Adults whose extremity mass remains suspicious after local MRI characterization.",
    "lastCheckedOn": "2026-09-09"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.337b094a2876",
    "statement": "A prolapsed stoma requires prompt assessment of reducibility, bowel viability, output or obstruction, pain, and appliance function.",
    "sourceIds": [
      "source.stoma.acpgbi-2021",
      "source.ostomy.missto-wses-2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Evidence quality for many reduction techniques is low.",
    "applicablePopulation": "Adults with an established stoma and elongated protruding bowel.",
    "lastCheckedOn": "2026-09-28"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.02595d974fd5",
    "statement": "A viable reducible stoma prolapse can follow a nonemergency external colorectal and stoma-specialist pathway.",
    "sourceIds": [
      "source.ostomy.missto-wses-2023"
    ],
    "evidenceCategory": "disposition",
    "certainty": "low",
    "limitation": "No specific reduction method or operation is prescribed.",
    "applicablePopulation": "Adults with a viable reducible productive stoma prolapse.",
    "lastCheckedOn": "2026-09-28"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.7360283b9af3",
    "statement": "Prophylactic endoscopic ablation is not recommended for Barrett esophagus without dysplasia.",
    "sourceIds": [
      "source.variety3.esge-barrett-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Sole direct guideline for this negative recommendation; NIDDK only corroborates surveillance. This is not applied to confirmed dysplasia or cancer. No promise that Barrett has no cancer risk.",
    "applicablePopulation": "Adults with confirmed nondysplastic Barrett and no visible neoplastic lesion.",
    "lastCheckedOn": "2026-10-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.4fb9d4bd1ed0",
    "statement": "Endoscopic surveillance is an appropriate follow-up strategy for established nondysplastic Barrett esophagus in a suitable patient.",
    "sourceIds": [
      "source.variety3.esge-barrett-2023",
      "source.variety3.niddk-barrett-diagnosis-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Official ESGE guideline plus independent current government surveillance explanation. Cases supply established segments, no dysplasia/visible lesion and suitability for follow-up/treatment. No interval, zero-risk claim or prophylactic surgery indication.",
    "applicablePopulation": "Adults with established nondysplastic Barrett who are suitable for surveillance.",
    "lastCheckedOn": "2026-10-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.23a644d8ccc5",
    "statement": "Barrett surveillance planning depends on the established segment and the patient's suitability for surveillance and possible treatment.",
    "sourceIds": [
      "source.variety3.esge-barrett-2023",
      "source.variety3.niddk-barrett-diagnosis-2024"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Do not extrapolate to an irregular Z-line, limited life expectancy, confirmed dysplasia or visible neoplasia. All numerical surveillance/cessation schedules are withheld in this batch.",
    "applicablePopulation": "Adults planning follow-up for established nondysplastic Barrett.",
    "lastCheckedOn": "2026-10-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.1c8b5c958ac8",
    "statement": "Cold forceps are not the preferred excision method for the supplied 4 mm or 7 mm polyps because complete resection is less reliable.",
    "sourceIds": [
      "source.variety3.esge-polypectomy-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Sole adequate guideline, sections 7.1/7.2 and recommendation against routine cold-forceps excision. Very tiny or difficult-access exceptions are outside these cases; no numerical recurrence estimate.",
    "applicablePopulation": "Adults comparing techniques for the supplied accessible 4 mm or 7 mm lesions.",
    "lastCheckedOn": "2026-10-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.3027c3cd5377",
    "statement": "Cold snare is the preferred removal technique for an accessible diminutive nonpedunculated colorectal polyp without invasive features.",
    "sourceIds": [
      "source.variety3.esge-polypectomy-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "high",
    "limitation": "Sole adequate directly read guideline, ESGE 2024 section 7.1, strong recommendation/high-quality evidence for polyps at most 5 mm; the synthetic example is 4 mm. No technique algorithm, margin width, risk estimate or difficult-access exception is authored.",
    "applicablePopulation": "Adults with a supplied accessible 4 mm nonpedunculated colorectal polyp selected for removal.",
    "lastCheckedOn": "2026-10-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.8ed95c68d973",
    "statement": "Cold snare is the preferred removal technique for a small nonpedunculated colorectal polyp without invasive features.",
    "sourceIds": [
      "source.variety3.esge-polypectomy-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "high",
    "limitation": "Sole adequate directly read guideline, ESGE 2024 section 7.2, strong recommendation/high-quality evidence for 6-9 mm polyps; the example is 7 mm. Excludes pedunculated, invasive-appearing and complex lesions and medication-specific planning.",
    "applicablePopulation": "Adults with a supplied accessible 7 mm nonpedunculated colorectal polyp selected for removal.",
    "lastCheckedOn": "2026-10-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.256d9311e264",
    "statement": "Hot biopsy forceps are discouraged for diminutive colorectal-polyp excision because of resection, specimen and thermal-injury concerns.",
    "sourceIds": [
      "source.variety3.esge-polypectomy-2024"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "high",
    "limitation": "Sole adequate direct guideline, section 7.1, strong/high-quality recommendation. No exact risk estimate or categorical prohibition on all electrosurgical techniques. For the 7 mm case, the cold-snare preference supplies the direct rejection basis.",
    "applicablePopulation": "Adults comparing forceps and snare plans for the supplied small lesions.",
    "lastCheckedOn": "2026-10-10"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.0b5c4ef72e1b",
    "statement": "Arterial status should be assessed before selecting compression for a suspected venous leg ulcer because coexisting arterial disease changes compression safety and type.",
    "sourceIds": [
      "source.vlu.esvs-cvd.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "ABI can be unreliable with noncompressible arteries and this teaching does not prescribe a numeric cutoff.",
    "applicablePopulation": "Stable adults with a suspected venous leg ulcer and no acute limb ischemia.",
    "lastCheckedOn": "2026-09-13"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.e22669366268",
    "statement": "When a selected single-stage ventral or incisional hernia repair proceeds after controlled enterotomy, permanent macroporous monofilament synthetic mesh is preferred over defaulting to biologic, microporous multifilament, or rapidly absorbable mesh solely because the field is clean-contaminated.",
    "sourceIds": [
      "source.ehs.emergency-ventral-incisional-hernia.2026",
      "source.wses.complicated-abdominal-wall-hernia.2017",
      "source.rosen.contaminated-ventral-hernia-rct.2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The randomized trial addresses elective clean-contaminated and contaminated repairs rather than the exact inadvertent-enterotomy scenario, and the current EHS recommendation is conditional with low to very-low evidence certainty. Mesh plane, fixation, and direct bowel contact are not addressed by this concept.",
    "applicablePopulation": "Selected stable adults proceeding with single-stage ventral or incisional hernia repair after adequate source control in a minimally contaminated field.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.8e30265aebbd",
    "statement": "In a stable adult undergoing ventral or incisional hernia repair, a recognized small-bowel enterotomy that has been securely repaired with adequate source control, minimal controlled contamination, and no ongoing gross spillage does not automatically preclude a selected single-stage mesh repair.",
    "sourceIds": [
      "source.ehs.emergency-ventral-incisional-hernia.2026",
      "source.wses.complicated-abdominal-wall-hernia.2017",
      "source.sages.laparoscopic-ventral-hernia.2016"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Direct evidence for an inadvertent enterotomy during elective repair remains limited. Whether to continue, convert, or defer repair requires individualized judgment; this approved concept begins only after the team has determined that single-stage repair is appropriate.",
    "applicablePopulation": "Stable adults undergoing ventral or incisional hernia repair after immediate recognition and secure repair of a small-bowel enterotomy with controlled contamination and no gross spillage.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n4.4b2bd6d4bf88",
    "statement": "Unstable physiology, uncertain bowel viability, an unrecognized or delayed enterotomy, incomplete source control, or persistent gross enteric or feculent spillage falls outside the approved macroporous-synthetic-mesh selection rule.",
    "sourceIds": [
      "source.ehs.emergency-ventral-incisional-hernia.2026",
      "source.wses.complicated-abdominal-wall-hernia.2017",
      "source.sages.laparoscopic-ventral-hernia.2016"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Falling outside this scope does not by itself prescribe tissue repair, biologic mesh, staged reconstruction, or abandonment; those operative decisions require separately authored content.",
    "applicablePopulation": "Adults with an enterotomy or gastrointestinal contamination encountered during ventral or incisional hernia repair.",
    "lastCheckedOn": "2026-08-06"
  }
];

export const QUESTION_NEW_N4_BASIS_CLAIMS:Array<EvidenceClaim & Record<string,unknown>> = [
  {
    "contentVersion": "development-batch.2026-09-17.bread-and-butter.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.bread-butter.high-output-ileostomy.renal-electrolyte-magnesium-assessment",
    "statement": "Stable follow-up for persistently increased ileostomy output warrants assessment of renal function, electrolytes, and magnesium for fluid and salt depletion.",
    "sourceIds": [
      "source.bread-butter.bifa-high-output-stoma-2023",
      "source.bread-butter.bifa-oral-rehydration-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "This outpatient pathway excludes shock, acute kidney injury, infection, and obstruction and does not define a universal output threshold.",
    "applicablePopulation": "Stable adults with persistently increased watery ileostomy losses and no acute complication.",
    "lastCheckedOn": "2026-09-17"
  },
  {
    "contentVersion": "development-batch.2026-09-17.bread-and-butter.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.bread-butter.high-output-ileostomy.sodium-glucose-oral-rehydration",
    "statement": "After stabilization, a sodium-glucose oral rehydration plan is preferred to simply increasing hypotonic plain-water intake for high-output ileostomy losses.",
    "sourceIds": [
      "source.bread-butter.bifa-high-output-stoma-2023",
      "source.bread-butter.bifa-oral-rehydration-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "No exact output threshold, oral-rehydration formulation, total fluid target, or medication regimen is taught.",
    "applicablePopulation": "Stable adults with high-output ileostomy losses who can drink and have no acute kidney injury, shock, infection, or obstruction.",
    "lastCheckedOn": "2026-09-17"
  },
  {
    "contentVersion": "development-batch.2026-09-17.bread-and-butter.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.bread-butter.superficial-incisional-ssi.open-drain",
    "statement": "A localized superficial incisional surgical-site infection with purulence requires opening the involved incision and drainage, with removal of sutures or staples when needed for source control.",
    "sourceIds": [
      "source.bread-butter.idsa-ssti-2014-wound"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Systemic antibiotics depend on systemic response and operative site; deep, organ-space, and necrotizing infections require different care.",
    "applicablePopulation": "Stable adults with purulent superficial incisional infection, intact fascia, and no systemic toxicity.",
    "lastCheckedOn": "2026-09-17"
  },
  {
    "contentVersion": "development-batch.2026-09-17.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.brief.eoe.multilevel-esophageal-biopsies",
    "statement": "Suspected eosinophilic esophagitis should be evaluated by upper endoscopy with at least six targeted esophageal biopsies obtained from at least two levels, interpreted with symptoms and exclusion of other causes.",
    "sourceIds": [
      "source.brief.acg-eoe-2025",
      "source.brief.acg-eoe-patient"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "Endoscopic appearance alone is insufficient. The authored patient has no current food impaction or unstable illness.",
    "applicablePopulation": "Stable adults with chronic solid-food dysphagia or food sticking suspicious for eosinophilic esophagitis.",
    "lastCheckedOn": "2026-09-17"
  },
  {
    "contentVersion": "development-batch.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.celiac.adult-biopsy",
    "statement": "In a usual adult pathway, positive compatible serology leads to upper endoscopy with duodenal biopsies for diagnostic confirmation.",
    "sourceIds": [
      "source.niddk.celiac-tests.2021",
      "source.niddk.celiac-diagnosis.2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "This does not assert that every adult in every setting must undergo biopsy.",
    "applicablePopulation": "Adults with positive celiac serology and adequate total IgA in a routine diagnostic pathway.",
    "lastCheckedOn": "2026-09-09"
  },
  {
    "contentVersion": "development-batch.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.celiac.gluten-testing-boundary",
    "statement": "Starting gluten avoidance before diagnostic testing can alter serologic and biopsy results.",
    "sourceIds": [
      "source.niddk.celiac-tests.2021",
      "source.niddk.celiac-diagnosis.2020",
      "source.acg.celiac-patient-education.2026"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "high",
    "limitation": "The content does not prescribe a gluten challenge.",
    "applicablePopulation": "People undergoing evaluation for possible celiac disease.",
    "lastCheckedOn": "2026-09-09"
  },
  {
    "contentVersion": "development-batch.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.celiac.initial-serology",
    "statement": "While a patient is eating gluten, tTG-IgA together with total-IgA context is a usual initial serologic assessment for suspected celiac disease.",
    "sourceIds": [
      "source.niddk.celiac-tests.2021",
      "source.niddk.celiac-diagnosis.2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "IgA deficiency changes test selection; serology is not presented as universally definitive.",
    "applicablePopulation": "Adults with compatible symptoms who remain on gluten during diagnostic evaluation.",
    "lastCheckedOn": "2026-09-09"
  },
  {
    "contentVersion": "clinical.owner-row-034.2026-08-06.1",
    "reviewStatus": "clinically_approved",
    "aiAssistedDrafting": true,
    "lastClinicianReview": {
      "reviewer": "Melissa Rowland, MD",
      "reviewedOn": "2026-08-06",
      "contentVersion": "clinical.owner-row-034.2026-08-06.1"
    },
    "id": "claim.colonic-lipoma.characteristic-endoscopic-phenotype",
    "statement": "A smooth, yellowish, soft gastrointestinal subepithelial lesion that indents with gentle probing has an endoscopic phenotype strongly supportive of lipoma; absence of the cushion or pillow sign alone does not exclude lipoma.",
    "sourceIds": [
      "source.asge.subepithelial-lesions.2017",
      "source.esge.subepithelial-lesions.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The positive phenotype is supportive, while the maneuver has limited sensitivity. Atypical or indeterminate lesions require a separate diagnostic pathway.",
    "applicablePopulation": "Adults with a colonic subepithelial lesion encountered during endoscopy.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.owner-row-034.2026-08-06.1",
    "reviewStatus": "clinically_approved",
    "aiAssistedDrafting": true,
    "lastClinicianReview": {
      "reviewer": "Melissa Rowland, MD",
      "reviewedOn": "2026-08-06",
      "contentVersion": "clinical.owner-row-034.2026-08-06.1"
    },
    "id": "claim.colonic-lipoma.clear-asymptomatic.no-directed-follow-up",
    "statement": "A clearly characterized asymptomatic gastrointestinal lipoma does not require lipoma-directed treatment or dedicated surveillance.",
    "sourceIds": [
      "source.asge.subepithelial-lesions.2017",
      "source.aga.subepithelial-lesions.2022",
      "source.esge.subepithelial-lesions.2022"
    ],
    "evidenceCategory": "management",
    "certainty": "high",
    "limitation": "This applies only when the diagnosis is clear and the lesion is asymptomatic; ordinary colorectal screening or surveillance remains governed by the remainder of the examination and the patient's usual indications.",
    "applicablePopulation": "Adults with a clearly characterized, incidental, asymptomatic colonic lipoma.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "development-batch.2026-10-02.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.gs028c.dcis.axilla-mastectomy",
    "statement": "Sentinel-node biopsy is ordinarily performed with mastectomy for pure DCIS because later lymphatic mapping may be unreliable.",
    "sourceIds": [
      "source.asbrs.axilla.2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single current society source; standard setting without a planned delayed magnetic-tracer strategy.",
    "applicablePopulation": "Adults undergoing mastectomy for pure DCIS.",
    "lastCheckedOn": "2026-10-02"
  },
  {
    "contentVersion": "development-batch.2026-10-02.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.gs028c.dcis.axilla-omit-bcs",
    "statement": "Routine axillary surgery is generally omitted for pure DCIS treated with uncomplicated breast-conserving surgery when invasion is not suspected.",
    "sourceIds": [
      "source.asbrs.axilla.2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single current society source.",
    "applicablePopulation": "Adults undergoing routine breast conservation for pure DCIS without concern for invasion.",
    "lastCheckedOn": "2026-10-02"
  },
  {
    "contentVersion": "development-batch.2026-10-02.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.gs028c.dcis.axilla-risk-setting",
    "statement": "Sentinel-node biopsy is appropriate when the planned DCIS operation will compromise later mapping or when occult invasion is meaningfully suspected.",
    "sourceIds": [
      "source.asbrs.axilla.2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single current society source; case-specific judgment remains required.",
    "applicablePopulation": "Adults undergoing DCIS surgery with threatened future mapping or concern for occult invasion.",
    "lastCheckedOn": "2026-10-02"
  },
  {
    "contentVersion": "development-batch.2026-10-07.level3.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.gs028g.incisional-hernia.fascial-closure",
    "statement": "The EHS midline incisional guideline recommends fascial closure with mesh reinforcement rather than routine mesh bridging within its closable-defect scope.",
    "sourceIds": [
      "source.gs028g.ehs-incisional-hernia-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One adequate current guideline; strong recommendation based on low-certainty evidence. Limited to adult midline defects expected to close without advanced release; no forceful closure or guarantee of lower recurrence is taught.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "development-batch.2026-10-07.level3.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.gs028g.incisional-hernia.retrorectus-plane",
    "statement": "Retrorectus mesh lies between rectus muscle and posterior rectus sheath.",
    "sourceIds": [
      "source.gs028g.ehs-incisional-hernia-2023"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "Anatomic nomenclature from one current society guideline; broader retromuscular terminology also includes the preperitoneal plane. No universal superiority of one operative approach is taught.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "development-batch.2026-10-07.level3.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.gs028g.mucocutaneous-separation.recognition",
    "statement": "Mucocutaneous separation is detachment between stoma mucosa and adjacent peristomal skin.",
    "sourceIds": [
      "source.gs028g.parini-misstow-ses-2023"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Mapping-review definition; depth, extent and viability must be assessed separately before management.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "development-batch.2026-10-07.level3.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.gs028g.mucocutaneous-separation.recognition.fact3",
    "statement": "Stoma-junction separation is distinct from necrosis, whole-stoma retraction and bowel-segment prolapse.",
    "sourceIds": [
      "source.gs028g.parini-misstow-ses-2023"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Mapping-review definition; depth, extent and viability must be assessed separately before management.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "development-batch.2026-10-07.level3.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.gs028g.mucocutaneous-separation.superficial-care",
    "statement": "Small superficial mucocutaneous separation with viable bowel and no infection can receive conservative local care.",
    "sourceIds": [
      "source.gs028g.parini-misstow-ses-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single adequate mapping review with limited comparative evidence. Only small superficial separation without ischemia, deep contamination or infection is tested; no fixed healing interval is promised.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "development-batch.2026-10-07.level3.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.gs028g.mucocutaneous-separation.superficial-care.fact2",
    "statement": "Local care of superficial separation includes protection of the wound and pouch seal with follow-up.",
    "sourceIds": [
      "source.gs028g.parini-misstow-ses-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single adequate mapping review with limited comparative evidence. Only small superficial separation without ischemia, deep contamination or infection is tested; no fixed healing interval is promised.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "development-batch.2026-10-07.level3.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.gs028g.mucocutaneous-separation.superficial-care.fact3",
    "statement": "Deep or severe separation, infection or failed conservative care requires surgical reassessment.",
    "sourceIds": [
      "source.gs028g.parini-misstow-ses-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single adequate mapping review with limited comparative evidence. Only small superficial separation without ischemia, deep contamination or infection is tested; no fixed healing interval is promised.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "development-batch.2026-10-07.level3.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.gs028g.peristomal-skin.effluent-irritation",
    "statement": "Intestinal effluent leaking onto peristomal skin can cause irritant dermatitis.",
    "sourceIds": [
      "source.gs028g.babakhanlou-stoma-2022"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": "Single adequate open review; bedside pattern recognition is not proof against superimposed infection, allergy or other skin disease.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "development-batch.2026-10-07.level3.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.gs028g.peristomal-skin.effluent-irritation.fact2",
    "statement": "Moist superficial injury that follows an observed leakage distribution supports an effluent-related irritant process.",
    "sourceIds": [
      "source.gs028g.babakhanlou-stoma-2022"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": "Single adequate open review; bedside pattern recognition is not proof against superimposed infection, allergy or other skin disease.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "development-batch.2026-10-07.level3.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.gs028g.peristomal-skin.restore-seal",
    "statement": "Inspect and correct an ill-fitting pouch when leakage causes peristomal irritant dermatitis.",
    "sourceIds": [
      "source.gs028g.babakhanlou-stoma-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single adequate open review; exact products, convexity, skin preparations and infection treatment must be individualized by the ostomy team.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "development-batch.2026-10-07.level3.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.gs028g.subtotal-cholecystectomy.safe-bailout",
    "statement": "Subtotal cholecystectomy is an accepted bailout when safe anatomic identification and the critical view cannot be established.",
    "sourceIds": [
      "source.gs028g.wses-cholecystitis-2020",
      "source.gs028g.ramirez-subtotal-2023"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Guideline plus independent review; subtotal is an accepted option, not the only safe strategy. Conversion or stopping may also be appropriate and are not used as wrong options.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "development-batch.2026-10-07.level3.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.gs028g.subtotal-cholecystectomy.safe-bailout.fact2",
    "statement": "Avoid hazardous division of unidentified structures during difficult cholecystectomy.",
    "sourceIds": [
      "source.gs028g.wses-cholecystitis-2020",
      "source.gs028g.ramirez-subtotal-2023"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Guideline plus independent review; subtotal is an accepted option, not the only safe strategy. Conversion or stopping may also be appropriate and are not used as wrong options.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "development-batch.2026-10-07.level3.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.gs028g.subtotal-cholecystectomy.safe-bailout.fact3",
    "statement": "Conversion and other safe bailout strategies remain legitimate alternatives to subtotal surgery.",
    "sourceIds": [
      "source.gs028g.wses-cholecystitis-2020",
      "source.gs028g.ramirez-subtotal-2023"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Guideline plus independent review; subtotal is an accepted option, not the only safe strategy. Conversion or stopping may also be appropriate and are not used as wrong options.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "development-batch.2026-09-29.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.mesh.deep-pattern",
    "statement": "Prosthetic mesh infection may present as a chronic or indolent deep process with sinus drainage, collection, fistula, or systemic infection rather than superficial incisional erythema alone.",
    "sourceIds": [
      "source.mesh.wses-sise-2018"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": "Single consensus source; findings require clinical correlation.",
    "applicablePopulation": "Adults after hernia repair with implanted mesh.",
    "lastCheckedOn": "2026-09-29"
  },
  {
    "contentVersion": "development-batch.2026-09-29.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.mesh.source-control",
    "statement": "Suspected deep mesh infection needs prompt specialist source-control evaluation; treatment is individualized and failed conservative management may require removal, so removal is not automatic.",
    "sourceIds": [
      "source.mesh.wses-sise-2018"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Exact antibiotics and operative technique are outside scope.",
    "applicablePopulation": "Adults with suspected deep prosthetic mesh infection.",
    "lastCheckedOn": "2026-09-29"
  },
  {
    "contentVersion": "development-batch.2026-09-28.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.parastomal-hernia.individualized-nonurgent-care",
    "statement": "Stable nonobstructed parastomal hernia symptoms may receive individualized appliance, support, activity, education, and external referral measures.",
    "sourceIds": [
      "source.parastomal.nursing-2025",
      "source.ostomy.missto-wses-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Evidence is limited; no universal garment or routine operation is supported.",
    "applicablePopulation": "Adults with a stable reducible parastomal hernia.",
    "lastCheckedOn": "2026-09-28"
  },
  {
    "contentVersion": "development-batch.2026-09-28.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.parastomal-hernia.recognition",
    "statement": "A dynamic peristomal bulge compatible with a fascial defect supports parastomal-hernia recognition; uncertainty or obstructive symptoms require further assessment.",
    "sourceIds": [
      "source.ostomy.missto-wses-2023",
      "source.parastomal.ehs-2018"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The EHS source is a limited cross-check; detailed boundaries rely on the open mapping review.",
    "applicablePopulation": "Adults with an established stoma and new peristomal contour change.",
    "lastCheckedOn": "2026-09-28"
  },
  {
    "contentVersion": "development-batch.2026-09-28.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.parastomal-hernia.urgent-boundary",
    "statement": "A painful nonreducible parastomal bulge with vomiting or reduced output requires urgent surgical evaluation for obstruction or ischemia.",
    "sourceIds": [
      "source.ostomy.missto-wses-2023",
      "source.stoma.acpgbi-2021"
    ],
    "evidenceCategory": "disposition",
    "certainty": "moderate",
    "limitation": "No clinic maneuver should delay transfer.",
    "applicablePopulation": "Adults with a stoma and acute obstructive features.",
    "lastCheckedOn": "2026-09-28"
  },
  {
    "contentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-clinic.limited-pilonidal-conservative-care",
    "statement": "Limited adolescent pilonidal disease without an acute abscess can initially be managed with an individualized conservative care plan.",
    "sourceIds": [
      "source.pediatric-clinic.metzger-pilonidal-2021"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One eligible pediatric expert perspective, not a formal guideline. Plan and escalation are individualized; no comparative superiority, exact interval, medication or hair-removal regimen is taught.",
    "applicablePopulation": "Adolescents with limited pilonidal disease and no current acute infection.",
    "lastCheckedOn": "2026-10-08"
  },
  {
    "contentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-clinic.pilonidal-acute-infection-distinction",
    "statement": "An acute pilonidal abscess represents a different management situation from limited disease without acute infection.",
    "sourceIds": [
      "source.pediatric-clinic.metzger-pilonidal-2021"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "One eligible pediatric expert perspective, not a formal guideline. Plan and escalation are individualized; no comparative superiority, exact interval, medication or hair-removal regimen is taught. This batch has no acute abscess procedure, antibiotic or pediatric sedation flow.",
    "applicablePopulation": "Adolescents with pilonidal disease.",
    "lastCheckedOn": "2026-10-08"
  },
  {
    "contentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-clinic.pilonidal-cleft-cleanliness",
    "statement": "Cleft cleanliness is a component of conservative pilonidal care.",
    "sourceIds": [
      "source.pediatric-clinic.metzger-pilonidal-2021"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One eligible pediatric expert perspective, not a formal guideline. Plan and escalation are individualized; no comparative superiority, exact interval, medication or hair-removal regimen is taught.",
    "applicablePopulation": "Adolescents receiving conservative pilonidal care.",
    "lastCheckedOn": "2026-10-08"
  },
  {
    "contentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-clinic.pilonidal-cleft-pattern",
    "statement": "Natal-cleft midline pits with intermittent drainage are compatible with chronic pilonidal disease.",
    "sourceIds": [
      "source.pediatric-clinic.metzger-pilonidal-2021"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": "One eligible pediatric expert perspective, not a formal guideline. Plan and escalation are individualized; no comparative superiority, exact interval, medication or hair-removal regimen is taught.",
    "applicablePopulation": "Adolescents with a natal-cleft complaint.",
    "lastCheckedOn": "2026-10-08"
  },
  {
    "contentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-clinic.pilonidal-individual-hair-plan",
    "statement": "Hair management can be discussed as part of an individualized conservative pilonidal plan.",
    "sourceIds": [
      "source.pediatric-clinic.metzger-pilonidal-2021"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One eligible pediatric expert perspective, not a formal guideline. Plan and escalation are individualized; no comparative superiority, exact interval, medication or hair-removal regimen is taught. A universal razor, laser or depilatory protocol is withheld.",
    "applicablePopulation": "Adolescents receiving conservative pilonidal care.",
    "lastCheckedOn": "2026-10-08"
  },
  {
    "contentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-clinic.pilonidal-moisture-reduction",
    "statement": "Reducing retained moisture in the cleft is a component of conservative pilonidal care.",
    "sourceIds": [
      "source.pediatric-clinic.metzger-pilonidal-2021"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One eligible pediatric expert perspective, not a formal guideline. Plan and escalation are individualized; no comparative superiority, exact interval, medication or hair-removal regimen is taught.",
    "applicablePopulation": "Adolescents receiving conservative pilonidal care.",
    "lastCheckedOn": "2026-10-08"
  },
  {
    "contentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-clinic.pilonidal-pressure-reduction",
    "statement": "Reducing prolonged direct pressure on the affected cleft can be discussed during conservative pilonidal care.",
    "sourceIds": [
      "source.pediatric-clinic.metzger-pilonidal-2021"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One eligible pediatric expert perspective, not a formal guideline. Plan and escalation are individualized; no comparative superiority, exact interval, medication or hair-removal regimen is taught.",
    "applicablePopulation": "Adolescents receiving conservative pilonidal care.",
    "lastCheckedOn": "2026-10-08"
  },
  {
    "contentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-clinic.pilonidal-response-reassessment",
    "statement": "Persistent symptoms or substantial disease burden should trigger reassessment of a conservative pilonidal plan.",
    "sourceIds": [
      "source.pediatric-clinic.metzger-pilonidal-2021"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One eligible pediatric expert perspective, not a formal guideline. Plan and escalation are individualized; no comparative superiority, exact interval, medication or hair-removal regimen is taught.",
    "applicablePopulation": "Adolescents followed for pilonidal disease.",
    "lastCheckedOn": "2026-10-08"
  },
  {
    "contentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-clinic.retractile-ascent-surveillance",
    "statement": "Surveillance of a retractile testis should identify acquired ascent requiring referral.",
    "sourceIds": [
      "source.pediatric-clinic.cua-puc-testis-2017",
      "source.pediatric-clinic.cornwall-surgery-2025"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "No invented ascent probability, deadline or automatic operative trigger is assigned.",
    "applicablePopulation": "Boys followed for a true retractile testis.",
    "lastCheckedOn": "2026-10-08"
  },
  {
    "contentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-clinic.true-retractile-examination",
    "statement": "A true retractile testis can be placed in the normal scrotal position without tension and remains there after release.",
    "sourceIds": [
      "source.pediatric-clinic.cua-puc-testis-2017"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "A society examination definition; a persistently high or immediately reascending testis is excluded from the authored true-retractile profiles.",
    "applicablePopulation": "Boys with intermittent testicular retraction.",
    "lastCheckedOn": "2026-10-08"
  },
  {
    "contentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-clinic.true-retractile-followup",
    "statement": "A true retractile testis requires documented follow-up examination of its position.",
    "sourceIds": [
      "source.pediatric-clinic.cua-puc-testis-2017",
      "source.pediatric-clinic.cuh-testis-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Independent society and NHS sources support surveillance. No exact surveillance interval is embedded in question prose.",
    "applicablePopulation": "Boys with a clinically confirmed true retractile testis.",
    "lastCheckedOn": "2026-10-08"
  },
  {
    "contentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.pediatric-clinic.true-retractile-no-operation",
    "statement": "The cited CUA-PUC guideline does not recommend operative treatment of a true retractile testis.",
    "sourceIds": [
      "source.pediatric-clinic.cua-puc-testis-2017",
      "source.pediatric-clinic.cuh-testis-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Applies only to the explicitly defined true-retractile profile, not all high or persistently retractile testes.",
    "applicablePopulation": "Boys whose testis meets the true-retractile examination definition.",
    "lastCheckedOn": "2026-10-08"
  },
  {
    "contentVersion": "clinical.owner-row-049.2026-08-10.1",
    "reviewStatus": "clinically_approved",
    "aiAssistedDrafting": true,
    "lastClinicianReview": {
      "reviewer": "Melissa Rowland, MD",
      "reviewedOn": "2026-08-10",
      "contentVersion": "clinical.owner-row-049.2026-08-10.1"
    },
    "id": "claim.peptic-ulcer-bleeding.active-bleed-conventional-combination",
    "statement": "A conventional combination pathway for an actively bleeding peptic ulcer uses dilute epinephrine injection for temporary control followed by contact thermal or mechanical hemostasis.",
    "sourceIds": [
      "source.acg.upper-gastrointestinal-ulcer-bleeding-guideline.2021",
      "source.esge.peptic-ulcer-bleeding-guideline.2026"
    ],
    "evidenceCategory": "management",
    "certainty": "high",
    "limitation": "This is a conventional pathway, not a claim that every actively bleeding ulcer must receive epinephrine or that selected contemporary OTS-clip or hemostatic-forceps monotherapy is never appropriate.",
    "applicablePopulation": "Appropriately stabilized adults undergoing hospital endoscopy for an actively bleeding peptic ulcer when the conventional epinephrine-combination pathway is selected.",
    "lastCheckedOn": "2026-08-10"
  },
  {
    "contentVersion": "clinical.owner-row-049.2026-08-10.1",
    "reviewStatus": "clinically_approved",
    "aiAssistedDrafting": true,
    "lastClinicianReview": {
      "reviewer": "Melissa Rowland, MD",
      "reviewedOn": "2026-08-10",
      "contentVersion": "clinical.owner-row-049.2026-08-10.1"
    },
    "id": "claim.peptic-ulcer-bleeding.epinephrine-not-monotherapy",
    "statement": "Epinephrine injection should not be used as the sole definitive endoscopic treatment for a high-risk bleeding peptic ulcer; when epinephrine is selected, it must be paired with a definitive hemostatic modality.",
    "sourceIds": [
      "source.acg.upper-gastrointestinal-ulcer-bleeding-guideline.2021",
      "source.esge.peptic-ulcer-bleeding-guideline.2026"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "high",
    "limitation": "This claim does not require epinephrine in every hemostatic plan and does not make an accepted thermal, mechanical, or selected advanced modality inadequate merely because injection was omitted.",
    "applicablePopulation": "Adults receiving endoscopic hemostasis for a peptic ulcer with active bleeding or a nonbleeding visible vessel when epinephrine injection is under consideration.",
    "lastCheckedOn": "2026-08-10"
  },
  {
    "contentVersion": "clinical.owner-row-049.2026-08-10.1",
    "reviewStatus": "clinically_approved",
    "aiAssistedDrafting": true,
    "lastClinicianReview": {
      "reviewer": "Melissa Rowland, MD",
      "reviewedOn": "2026-08-10",
      "contentVersion": "clinical.owner-row-049.2026-08-10.1"
    },
    "id": "claim.peptic-ulcer-bleeding.high-risk-stigmata-require-hemostasis",
    "statement": "Peptic ulcers with active spurting, active oozing, or a nonbleeding visible vessel are high-risk endoscopic findings for which endoscopic hemostasis is indicated.",
    "sourceIds": [
      "source.acg.upper-gastrointestinal-ulcer-bleeding-guideline.2021",
      "source.esge.peptic-ulcer-bleeding-guideline.2026"
    ],
    "evidenceCategory": "management",
    "certainty": "high",
    "limitation": "This claim assumes the patient has been appropriately assessed and stabilized for endoscopy; it does not define pre-endoscopy resuscitation, transfusion, medication, or disposition decisions.",
    "applicablePopulation": "Adults undergoing upper endoscopy for suspected or confirmed nonvariceal peptic-ulcer bleeding.",
    "lastCheckedOn": "2026-08-10"
  },
  {
    "contentVersion": "development-batch.2026-09-11.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.peripheral-arterial-disease.resting-abi",
    "statement": "Resting ankle-brachial index testing is an appropriate initial physiologic test for reproducible exertional calf discomfort relieved by rest with examination findings suggesting lower-extremity peripheral arterial disease.",
    "sourceIds": [
      "source.expansion.nhlbi-pad-diagnosis-2022",
      "source.expansion.sbacv-pad-2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Normal or high values can be misleading with noncompressible vessels; exercise ABI or toe-pressure assessment may be needed when suspicion persists.",
    "applicablePopulation": "Stable adults with classic exertional calf symptoms, suggestive examination findings, and no limb threat.",
    "lastCheckedOn": "2026-09-11"
  },
  {
    "contentVersion": "question-flags-round3.evidence.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "lastCheckedOn": "2026-11-04",
    "id": "claim.qf3.dcis-specimen-operation-application",
    "statement": "Removal of the breast gland with retention of the skin envelope is a mastectomy rather than a localized breast-conserving excision; the conventional pure-DCIS axillary staging distinction follows the gland operation.",
    "basisClaimIds": [
      "claim.gs028c.dcis.axilla-mastectomy",
      "claim.gs028c.dcis.axilla-omit-bcs"
    ],
    "sourceIds": [
      "source.asbrs.axilla.2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the explicitly described synthetic adult question-flag round-three profiles.",
    "limitation": "Anatomical application of the recorded standard-operation rule. No delayed-tracer strategy or universal oncoplastic-operation rule is added.",
    "verificationScope": "Offline author synthesis/application from recorded claims and their existing source records; no fresh source retrieval, source-access-date change or clinical approval. Direct alignment of the application remains for independent clinical/source review."
  },
  {
    "contentVersion": "question-authoring.2026-10-28.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261028.peristomal.fit-exposure",
    "statement": "When a pouch opening leaves peristomal skin exposed to effluent, fit assessment and an opening fitted around the stoma base address continuing contact injury.",
    "sourceIds": [
      "source.gs028g.babakhanlou-stoma-2022",
      "source.qq20261028.wocn-peristomal"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Does not exclude coexisting infection or prescribe one product, wear interval or opening dimension. Exact skin-distribution interpretation requires clinician review.",
    "applicablePopulation": "People with an ostomy and suspected effluent-related peristomal skin injury.",
    "lastCheckedOn": "2026-10-28"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.melanoma-integrated-node-staging",
    "statement": "Clinically node-negative invasive melanoma in the supplied greater-than-1-mm range calls for sentinel-node staging consideration; reassuring ultrasound does not replace microscopic nodal staging.",
    "sourceIds": [
      "source.qq20261102a.eado2024",
      "source.qq20261102a.nci-melanoma"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Existing synthetic thickness values are retained. No fixed metastatic probability or survival benefit asserted; subtype and patient suitability remain clinician review.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v5",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102a.ulcer-local-modality-choice",
    "statement": "A nonbleeding ulcer vessel can receive mechanical or contact-thermal hemostasis; epinephrine alone is inadequate, and topical agents are not routine sole initial therapy for that finding.",
    "sourceIds": [
      "source.qq20261102a.esge-ulcer"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Current specific guideline only for the new modality comparison; retained ACG evidence independently supports hemostasis indication. Powder can be appropriate rescue/temporizing therapy; after the failed clip the selected contact treatment supplements epinephrine rather than repeating monotherapy. No dose or universal rescue sequence authored.",
    "applicablePopulation": "The adult synthetic clinical scenarios identified in the associated question mappings.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102b.sarcoma-initial-core-method",
    "statement": "A feasible image-guided core biopsy is preferred initially for a suspicious deep extremity soft-tissue mass.",
    "sourceIds": [
      "source.qq20261102b.seom2024",
      "source.qq20261102b.essr2015"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Open biopsy is a selected alternative, not universally wrong; no failed core, needle gauge, sample count or tumor subtype is invented.",
    "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102b.sentinel-before-reconstruction",
    "statement": "Sentinel-node mapping/biopsy is preferably coordinated with wide excision before flap or graft reconstruction can disrupt later mapping.",
    "sourceIds": [
      "source.qq20261102b.cco-melanoma"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Direct older primary technical guideline; current retained staging-indication evidence is independently mapped. No blanket contraindication after every excision or exact reliability effect is asserted.",
    "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.classic-lipoma-normal-mucosal-sample",
    "statement": "A characteristic submucosal lipoma need not receive another specimen solely because overlying mucosal tissue is normal.",
    "sourceIds": [
      "source.qq20261102c.sel2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One complete primary guideline rechecked for wall layers, diagnostic lipoma patterns and selective tissue acquisition. The normal-mucosa scenario is an anatomic application; atypical or genuinely indeterminate lesions require another pathway.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.sarcoma-mri-coverage-and-target",
    "statement": "Local MRI for suspected soft-tissue malignancy should depict the full lesion and relevant compartment relationships before biopsy planning.",
    "sourceIds": [
      "source.qq20261102c.essr2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Previously verified primary society guidance. Missing enhancement/viability information is a separate target-planning application, requiring radiologist review; no contrast dose or imaging diagnosis is inferred.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.ulcer-failed-repeat-embolization",
    "statement": "Transcatheter embolization should be considered after unsuccessful repeat endoscopic hemostasis when available.",
    "sourceIds": [
      "source.qq20261102c.esge-ulcer2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One adequate current primary guideline. Surgery may be needed when embolization is unavailable/unsuccessful or individual circumstances require it; no universal vital-sign threshold.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v7",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102c.ulcer-rebleeding-repeat-endoscopy",
    "statement": "Recurrent peptic-ulcer bleeding after initial successful hemostasis can warrant repeat endoscopic therapy, with consideration of an OTS clip.",
    "sourceIds": [
      "source.qq20261102c.esge-ulcer2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One adequate current full primary guideline. Actual resuscitation/access and prior course matter; not a universal requirement to repeat endoscopy despite any instability or contraindication.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v8",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102d.lipoma-histology-provenance",
    "statement": "A specimen limited to colonic mucosa does not provide histologic confirmation of a mass localized to submucosa, even when the integrated endoscopic and EUS phenotype supports lipoma.",
    "sourceIds": [
      "source.qq20261102d.sel2022"
    ],
    "limitation": "An anatomical application of previously verified primary ESGE guidance, with one adequate source. This separates clinical characterization from histologic proof; it does not imply another biopsy is required or change the passed asymptomatic management premise.",
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "The identified synthetic adult teaching cases; constructed observations are not patient data or clinical thresholds.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v10",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102f.integrated-partial-depth-planning",
    "statement": "A smaller invasive-depth measurement from a different partial specimen does not erase a greater valid demonstrated invasive extent; an incomplete whole-lesion maximum can still have a known lower bound relevant to a supported planning discussion.",
    "sourceIds": [
      "source.qq20261102f.esmo2025",
      "source.qq20261102f.nci-melanoma"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Original cross-specimen application of previously verified full-thickness sampling and maximum-depth reporting guidance, not a separately retrieved specimen-integration rule. Dermatopathology must confirm validity and mapping. The 1.8-mm value is retained from this case's existing completed-primary record and 0.6 mm from its existing partial report; their new constructed placement is not a management cutoff. The actual greater-than-1-mm nodal-discussion boundary is separately mapped to existing claim.qq20261102a.melanoma-integrated-node-staging.",
    "applicablePopulation": "The identified named synthetic adult teaching cases; measurements and acquisition observations are constructed, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-03"
  },
  {
    "contentVersion": "development-batch.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.soft-tissue-mass.mri",
    "statement": "MRI is appropriate for local characterization of a deep, enlarging, or ultrasound-indeterminate extremity soft-tissue mass before biopsy.",
    "sourceIds": [
      "source.essr.soft-tissue-imaging.2024",
      "source.nci.soft-tissue-sarcoma-pdq.2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "MRI can characterize and guide planning but cannot by itself prove sarcoma.",
    "applicablePopulation": "Stable adults with a deep, enlarging, or ultrasound-indeterminate extremity soft-tissue mass.",
    "lastCheckedOn": "2026-09-09"
  },
  {
    "contentVersion": "development-batch.2026-09-09.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.soft-tissue-mass.planned-biopsy",
    "statement": "A suspicious extremity soft-tissue mass should reach an experienced sarcoma team before a planned image-guided core biopsy so the biopsy path respects a future surgical approach.",
    "sourceIds": [
      "source.essr.soft-tissue-imaging.2024",
      "source.nci.soft-tissue-sarcoma-pdq.2025"
    ],
    "evidenceCategory": "management",
    "certainty": "high",
    "limitation": "Biopsy technique and selected incisional approaches remain specialist decisions; imaging suspicion is not a tissue diagnosis.",
    "applicablePopulation": "Adults whose extremity mass remains suspicious after local MRI characterization.",
    "lastCheckedOn": "2026-09-09"
  },
  {
    "contentVersion": "development-batch.2026-09-28.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.stoma-prolapse.assessment",
    "statement": "A prolapsed stoma requires prompt assessment of reducibility, bowel viability, output or obstruction, pain, and appliance function.",
    "sourceIds": [
      "source.stoma.acpgbi-2021",
      "source.ostomy.missto-wses-2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Evidence quality for many reduction techniques is low.",
    "applicablePopulation": "Adults with an established stoma and elongated protruding bowel.",
    "lastCheckedOn": "2026-09-28"
  },
  {
    "contentVersion": "development-batch.2026-09-28.pre-endoscopy.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.stoma-prolapse.nonurgent-boundary",
    "statement": "A viable reducible stoma prolapse can follow a nonemergency external colorectal and stoma-specialist pathway.",
    "sourceIds": [
      "source.ostomy.missto-wses-2023"
    ],
    "evidenceCategory": "disposition",
    "certainty": "low",
    "limitation": "No specific reduction method or operation is prescribed.",
    "applicablePopulation": "Adults with a viable reducible productive stoma prolapse.",
    "lastCheckedOn": "2026-09-28"
  },
  {
    "contentVersion": "development-batch.2026-10-10.variety-3.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.variety3.barrett.no-prophylactic-ablation",
    "statement": "Prophylactic endoscopic ablation is not recommended for Barrett esophagus without dysplasia.",
    "sourceIds": [
      "source.variety3.esge-barrett-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Sole direct guideline for this negative recommendation; NIDDK only corroborates surveillance. This is not applied to confirmed dysplasia or cancer. No promise that Barrett has no cancer risk.",
    "applicablePopulation": "Adults with confirmed nondysplastic Barrett and no visible neoplastic lesion.",
    "lastCheckedOn": "2026-10-10"
  },
  {
    "contentVersion": "development-batch.2026-10-10.variety-3.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.variety3.barrett.surveillance-plan",
    "statement": "Endoscopic surveillance is an appropriate follow-up strategy for established nondysplastic Barrett esophagus in a suitable patient.",
    "sourceIds": [
      "source.variety3.esge-barrett-2023",
      "source.variety3.niddk-barrett-diagnosis-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Official ESGE guideline plus independent current government surveillance explanation. Cases supply established segments, no dysplasia/visible lesion and suitability for follow-up/treatment. No interval, zero-risk claim or prophylactic surgery indication.",
    "applicablePopulation": "Adults with established nondysplastic Barrett who are suitable for surveillance.",
    "lastCheckedOn": "2026-10-10"
  },
  {
    "contentVersion": "development-batch.2026-10-10.variety-3.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.variety3.barrett.surveillance-suitability",
    "statement": "Barrett surveillance planning depends on the established segment and the patient's suitability for surveillance and possible treatment.",
    "sourceIds": [
      "source.variety3.esge-barrett-2023",
      "source.variety3.niddk-barrett-diagnosis-2024"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Do not extrapolate to an irregular Z-line, limited life expectancy, confirmed dysplasia or visible neoplasia. All numerical surveillance/cessation schedules are withheld in this batch.",
    "applicablePopulation": "Adults planning follow-up for established nondysplastic Barrett.",
    "lastCheckedOn": "2026-10-10"
  },
  {
    "contentVersion": "development-batch.2026-10-10.variety-3.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.variety3.polypectomy.cold-forceps-limit",
    "statement": "Cold forceps are not the preferred excision method for the supplied 4 mm or 7 mm polyps because complete resection is less reliable.",
    "sourceIds": [
      "source.variety3.esge-polypectomy-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Sole adequate guideline, sections 7.1/7.2 and recommendation against routine cold-forceps excision. Very tiny or difficult-access exceptions are outside these cases; no numerical recurrence estimate.",
    "applicablePopulation": "Adults comparing techniques for the supplied accessible 4 mm or 7 mm lesions.",
    "lastCheckedOn": "2026-10-10"
  },
  {
    "contentVersion": "development-batch.2026-10-10.variety-3.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.variety3.polypectomy.cold-snare-diminutive",
    "statement": "Cold snare is the preferred removal technique for an accessible diminutive nonpedunculated colorectal polyp without invasive features.",
    "sourceIds": [
      "source.variety3.esge-polypectomy-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "high",
    "limitation": "Sole adequate directly read guideline, ESGE 2024 section 7.1, strong recommendation/high-quality evidence for polyps at most 5 mm; the synthetic example is 4 mm. No technique algorithm, margin width, risk estimate or difficult-access exception is authored.",
    "applicablePopulation": "Adults with a supplied accessible 4 mm nonpedunculated colorectal polyp selected for removal.",
    "lastCheckedOn": "2026-10-10"
  },
  {
    "contentVersion": "development-batch.2026-10-10.variety-3.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.variety3.polypectomy.cold-snare-small",
    "statement": "Cold snare is the preferred removal technique for a small nonpedunculated colorectal polyp without invasive features.",
    "sourceIds": [
      "source.variety3.esge-polypectomy-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "high",
    "limitation": "Sole adequate directly read guideline, ESGE 2024 section 7.2, strong recommendation/high-quality evidence for 6-9 mm polyps; the example is 7 mm. Excludes pedunculated, invasive-appearing and complex lesions and medication-specific planning.",
    "applicablePopulation": "Adults with a supplied accessible 7 mm nonpedunculated colorectal polyp selected for removal.",
    "lastCheckedOn": "2026-10-10"
  },
  {
    "contentVersion": "development-batch.2026-10-10.variety-3.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.variety3.polypectomy.hot-forceps-limit",
    "statement": "Hot biopsy forceps are discouraged for diminutive colorectal-polyp excision because of resection, specimen and thermal-injury concerns.",
    "sourceIds": [
      "source.variety3.esge-polypectomy-2024"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "high",
    "limitation": "Sole adequate direct guideline, section 7.1, strong/high-quality recommendation. No exact risk estimate or categorical prohibition on all electrosurgical techniques. For the 7 mm case, the cold-snare preference supplies the direct rejection basis.",
    "applicablePopulation": "Adults comparing forceps and snare plans for the supplied small lesions.",
    "lastCheckedOn": "2026-10-10"
  },
  {
    "contentVersion": "development-batch.2026-09-13.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.venous-leg-ulcer.arterial-assessment-before-compression",
    "statement": "Arterial status should be assessed before selecting compression for a suspected venous leg ulcer because coexisting arterial disease changes compression safety and type.",
    "sourceIds": [
      "source.vlu.esvs-cvd.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "ABI can be unreliable with noncompressible arteries and this teaching does not prescribe a numeric cutoff.",
    "applicablePopulation": "Stable adults with a suspected venous leg ulcer and no acute limb ischemia.",
    "lastCheckedOn": "2026-09-13"
  },
  {
    "contentVersion": "clinical.owner-row-044.2026-08-06.1",
    "reviewStatus": "clinically_approved",
    "aiAssistedDrafting": true,
    "lastClinicianReview": {
      "reviewer": "Melissa Rowland, MD",
      "reviewedOn": "2026-08-06",
      "contentVersion": "clinical.owner-row-044.2026-08-06.1"
    },
    "id": "claim.ventral-hernia.controlled-contamination-macroporous-synthetic-mesh",
    "statement": "When a selected single-stage ventral or incisional hernia repair proceeds after controlled enterotomy, permanent macroporous monofilament synthetic mesh is preferred over defaulting to biologic, microporous multifilament, or rapidly absorbable mesh solely because the field is clean-contaminated.",
    "sourceIds": [
      "source.ehs.emergency-ventral-incisional-hernia.2026",
      "source.wses.complicated-abdominal-wall-hernia.2017",
      "source.rosen.contaminated-ventral-hernia-rct.2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The randomized trial addresses elective clean-contaminated and contaminated repairs rather than the exact inadvertent-enterotomy scenario, and the current EHS recommendation is conditional with low to very-low evidence certainty. Mesh plane, fixation, and direct bowel contact are not addressed by this concept.",
    "applicablePopulation": "Selected stable adults proceeding with single-stage ventral or incisional hernia repair after adequate source control in a minimally contaminated field.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.owner-row-044.2026-08-06.1",
    "reviewStatus": "clinically_approved",
    "aiAssistedDrafting": true,
    "lastClinicianReview": {
      "reviewer": "Melissa Rowland, MD",
      "reviewedOn": "2026-08-06",
      "contentVersion": "clinical.owner-row-044.2026-08-06.1"
    },
    "id": "claim.ventral-hernia.controlled-enterotomy-selected-single-stage-repair",
    "statement": "In a stable adult undergoing ventral or incisional hernia repair, a recognized small-bowel enterotomy that has been securely repaired with adequate source control, minimal controlled contamination, and no ongoing gross spillage does not automatically preclude a selected single-stage mesh repair.",
    "sourceIds": [
      "source.ehs.emergency-ventral-incisional-hernia.2026",
      "source.wses.complicated-abdominal-wall-hernia.2017",
      "source.sages.laparoscopic-ventral-hernia.2016"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Direct evidence for an inadvertent enterotomy during elective repair remains limited. Whether to continue, convert, or defer repair requires individualized judgment; this approved concept begins only after the team has determined that single-stage repair is appropriate.",
    "applicablePopulation": "Stable adults undergoing ventral or incisional hernia repair after immediate recognition and secure repair of a small-bowel enterotomy with controlled contamination and no gross spillage.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.owner-row-044.2026-08-06.1",
    "reviewStatus": "clinically_approved",
    "aiAssistedDrafting": true,
    "lastClinicianReview": {
      "reviewer": "Melissa Rowland, MD",
      "reviewedOn": "2026-08-06",
      "contentVersion": "clinical.owner-row-044.2026-08-06.1"
    },
    "id": "claim.ventral-hernia.enterotomy-mesh-selection-safety-boundary",
    "statement": "Unstable physiology, uncertain bowel viability, an unrecognized or delayed enterotomy, incomplete source control, or persistent gross enteric or feculent spillage falls outside the approved macroporous-synthetic-mesh selection rule.",
    "sourceIds": [
      "source.ehs.emergency-ventral-incisional-hernia.2026",
      "source.wses.complicated-abdominal-wall-hernia.2017",
      "source.sages.laparoscopic-ventral-hernia.2016"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Falling outside this scope does not by itself prescribe tissue repair, biologic mesh, staged reconstruction, or abandonment; those operative decisions require separately authored content.",
    "applicablePopulation": "Adults with an enterotomy or gastrointestinal contamination encountered during ventral or incisional hernia repair.",
    "lastCheckedOn": "2026-08-06"
  }
];

export const QUESTION_NEW_N4_CLAIM_PROVENANCE = [
  {
    "claimId": "claim.n4.df90860e477f",
    "inheritedClaimId": "claim.bread-butter.high-output-ileostomy.renal-electrolyte-magnesium-assessment",
    "inheritedContentVersion": "development-batch.2026-09-17.bread-and-butter.1",
    "inheritedLastCheckedOn": "2026-09-17",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.1a302f939983",
    "inheritedClaimId": "claim.bread-butter.high-output-ileostomy.sodium-glucose-oral-rehydration",
    "inheritedContentVersion": "development-batch.2026-09-17.bread-and-butter.1",
    "inheritedLastCheckedOn": "2026-09-17",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.10b8e172c6d1",
    "inheritedClaimId": "claim.bread-butter.superficial-incisional-ssi.open-drain",
    "inheritedContentVersion": "development-batch.2026-09-17.bread-and-butter.1",
    "inheritedLastCheckedOn": "2026-09-17",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.23c6ba284b5a",
    "inheritedClaimId": "claim.brief.eoe.multilevel-esophageal-biopsies",
    "inheritedContentVersion": "development-batch.2026-09-17.1",
    "inheritedLastCheckedOn": "2026-09-17",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.5294d3feead5",
    "inheritedClaimId": "claim.celiac.adult-biopsy",
    "inheritedContentVersion": "development-batch.2026-09-09.1",
    "inheritedLastCheckedOn": "2026-09-09",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.87469918a5c7",
    "inheritedClaimId": "claim.celiac.gluten-testing-boundary",
    "inheritedContentVersion": "development-batch.2026-09-09.1",
    "inheritedLastCheckedOn": "2026-09-09",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.8a59fd5f0d78",
    "inheritedClaimId": "claim.celiac.initial-serology",
    "inheritedContentVersion": "development-batch.2026-09-09.1",
    "inheritedLastCheckedOn": "2026-09-09",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.3c893f8ee4f0",
    "inheritedClaimId": "claim.colonic-lipoma.characteristic-endoscopic-phenotype",
    "inheritedContentVersion": "clinical.owner-row-034.2026-08-06.1",
    "inheritedLastCheckedOn": "2026-08-06",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.ea03ad0a7d73",
    "inheritedClaimId": "claim.colonic-lipoma.clear-asymptomatic.no-directed-follow-up",
    "inheritedContentVersion": "clinical.owner-row-034.2026-08-06.1",
    "inheritedLastCheckedOn": "2026-08-06",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.dd856cda49d5",
    "inheritedClaimId": "claim.gs028c.dcis.axilla-mastectomy",
    "inheritedContentVersion": "development-batch.2026-10-02.pre-endoscopy.1",
    "inheritedLastCheckedOn": "2026-10-02",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.6c61d104e5a1",
    "inheritedClaimId": "claim.gs028c.dcis.axilla-omit-bcs",
    "inheritedContentVersion": "development-batch.2026-10-02.pre-endoscopy.1",
    "inheritedLastCheckedOn": "2026-10-02",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.ddbff2935560",
    "inheritedClaimId": "claim.gs028c.dcis.axilla-risk-setting",
    "inheritedContentVersion": "development-batch.2026-10-02.pre-endoscopy.1",
    "inheritedLastCheckedOn": "2026-10-02",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.6b82b00afbc7",
    "inheritedClaimId": "claim.gs028g.incisional-hernia.fascial-closure",
    "inheritedContentVersion": "development-batch.2026-10-07.level3.1",
    "inheritedLastCheckedOn": "2026-10-07",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.ed48bbec4ece",
    "inheritedClaimId": "claim.gs028g.incisional-hernia.retrorectus-plane",
    "inheritedContentVersion": "development-batch.2026-10-07.level3.1",
    "inheritedLastCheckedOn": "2026-10-07",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.dbcb717c9c9a",
    "inheritedClaimId": "claim.gs028g.mucocutaneous-separation.recognition",
    "inheritedContentVersion": "development-batch.2026-10-07.level3.1",
    "inheritedLastCheckedOn": "2026-10-07",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.fd1d7e5c4396",
    "inheritedClaimId": "claim.gs028g.mucocutaneous-separation.recognition.fact3",
    "inheritedContentVersion": "development-batch.2026-10-07.level3.1",
    "inheritedLastCheckedOn": "2026-10-07",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.28f6b50877d4",
    "inheritedClaimId": "claim.gs028g.mucocutaneous-separation.superficial-care",
    "inheritedContentVersion": "development-batch.2026-10-07.level3.1",
    "inheritedLastCheckedOn": "2026-10-07",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.7467890b4e97",
    "inheritedClaimId": "claim.gs028g.mucocutaneous-separation.superficial-care.fact2",
    "inheritedContentVersion": "development-batch.2026-10-07.level3.1",
    "inheritedLastCheckedOn": "2026-10-07",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.bcb1afc6bce6",
    "inheritedClaimId": "claim.gs028g.mucocutaneous-separation.superficial-care.fact3",
    "inheritedContentVersion": "development-batch.2026-10-07.level3.1",
    "inheritedLastCheckedOn": "2026-10-07",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.a1e25267f8e9",
    "inheritedClaimId": "claim.gs028g.peristomal-skin.effluent-irritation",
    "inheritedContentVersion": "development-batch.2026-10-07.level3.1",
    "inheritedLastCheckedOn": "2026-10-07",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.82fe00bb745d",
    "inheritedClaimId": "claim.gs028g.peristomal-skin.effluent-irritation.fact2",
    "inheritedContentVersion": "development-batch.2026-10-07.level3.1",
    "inheritedLastCheckedOn": "2026-10-07",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.1a6b88bdf1b0",
    "inheritedClaimId": "claim.gs028g.peristomal-skin.restore-seal",
    "inheritedContentVersion": "development-batch.2026-10-07.level3.1",
    "inheritedLastCheckedOn": "2026-10-07",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.da2f704793ec",
    "inheritedClaimId": "claim.gs028g.subtotal-cholecystectomy.safe-bailout",
    "inheritedContentVersion": "development-batch.2026-10-07.level3.1",
    "inheritedLastCheckedOn": "2026-10-07",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.86849d22206f",
    "inheritedClaimId": "claim.gs028g.subtotal-cholecystectomy.safe-bailout.fact2",
    "inheritedContentVersion": "development-batch.2026-10-07.level3.1",
    "inheritedLastCheckedOn": "2026-10-07",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.77d7aef55c11",
    "inheritedClaimId": "claim.gs028g.subtotal-cholecystectomy.safe-bailout.fact3",
    "inheritedContentVersion": "development-batch.2026-10-07.level3.1",
    "inheritedLastCheckedOn": "2026-10-07",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.3ef0d7efc452",
    "inheritedClaimId": "claim.mesh.deep-pattern",
    "inheritedContentVersion": "development-batch.2026-09-29.pre-endoscopy.1",
    "inheritedLastCheckedOn": "2026-09-29",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.40b34fe591d8",
    "inheritedClaimId": "claim.mesh.source-control",
    "inheritedContentVersion": "development-batch.2026-09-29.pre-endoscopy.1",
    "inheritedLastCheckedOn": "2026-09-29",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.223dab952919",
    "inheritedClaimId": "claim.parastomal-hernia.individualized-nonurgent-care",
    "inheritedContentVersion": "development-batch.2026-09-28.pre-endoscopy.1",
    "inheritedLastCheckedOn": "2026-09-28",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.42635f86f7a9",
    "inheritedClaimId": "claim.parastomal-hernia.recognition",
    "inheritedContentVersion": "development-batch.2026-09-28.pre-endoscopy.1",
    "inheritedLastCheckedOn": "2026-09-28",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.d70e777dbe3f",
    "inheritedClaimId": "claim.parastomal-hernia.urgent-boundary",
    "inheritedContentVersion": "development-batch.2026-09-28.pre-endoscopy.1",
    "inheritedLastCheckedOn": "2026-09-28",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.c6d38b0b02a0",
    "inheritedClaimId": "claim.pediatric-clinic.limited-pilonidal-conservative-care",
    "inheritedContentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
    "inheritedLastCheckedOn": "2026-10-08",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.803d081a7ae2",
    "inheritedClaimId": "claim.pediatric-clinic.pilonidal-acute-infection-distinction",
    "inheritedContentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
    "inheritedLastCheckedOn": "2026-10-08",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.64fb82fc7f10",
    "inheritedClaimId": "claim.pediatric-clinic.pilonidal-cleft-cleanliness",
    "inheritedContentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
    "inheritedLastCheckedOn": "2026-10-08",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.9d5eaf817018",
    "inheritedClaimId": "claim.pediatric-clinic.pilonidal-cleft-pattern",
    "inheritedContentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
    "inheritedLastCheckedOn": "2026-10-08",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.fe5e38fe01ce",
    "inheritedClaimId": "claim.pediatric-clinic.pilonidal-individual-hair-plan",
    "inheritedContentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
    "inheritedLastCheckedOn": "2026-10-08",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.cf350cc3230f",
    "inheritedClaimId": "claim.pediatric-clinic.pilonidal-moisture-reduction",
    "inheritedContentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
    "inheritedLastCheckedOn": "2026-10-08",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.5278b9358a66",
    "inheritedClaimId": "claim.pediatric-clinic.pilonidal-pressure-reduction",
    "inheritedContentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
    "inheritedLastCheckedOn": "2026-10-08",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.8290e8a874de",
    "inheritedClaimId": "claim.pediatric-clinic.pilonidal-response-reassessment",
    "inheritedContentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
    "inheritedLastCheckedOn": "2026-10-08",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.8f03b4ef56b7",
    "inheritedClaimId": "claim.pediatric-clinic.retractile-ascent-surveillance",
    "inheritedContentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
    "inheritedLastCheckedOn": "2026-10-08",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.32632eb28aa1",
    "inheritedClaimId": "claim.pediatric-clinic.true-retractile-examination",
    "inheritedContentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
    "inheritedLastCheckedOn": "2026-10-08",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.ed485fb1c469",
    "inheritedClaimId": "claim.pediatric-clinic.true-retractile-followup",
    "inheritedContentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
    "inheritedLastCheckedOn": "2026-10-08",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.c78329a0ee7f",
    "inheritedClaimId": "claim.pediatric-clinic.true-retractile-no-operation",
    "inheritedContentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
    "inheritedLastCheckedOn": "2026-10-08",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.2f251a75ceb4",
    "inheritedClaimId": "claim.peptic-ulcer-bleeding.active-bleed-conventional-combination",
    "inheritedContentVersion": "clinical.owner-row-049.2026-08-10.1",
    "inheritedLastCheckedOn": "2026-08-10",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.e55b4be019b7",
    "inheritedClaimId": "claim.peptic-ulcer-bleeding.epinephrine-not-monotherapy",
    "inheritedContentVersion": "clinical.owner-row-049.2026-08-10.1",
    "inheritedLastCheckedOn": "2026-08-10",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.dda382649df0",
    "inheritedClaimId": "claim.peptic-ulcer-bleeding.high-risk-stigmata-require-hemostasis",
    "inheritedContentVersion": "clinical.owner-row-049.2026-08-10.1",
    "inheritedLastCheckedOn": "2026-08-10",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.bf7d58a0e363",
    "inheritedClaimId": "claim.peripheral-arterial-disease.resting-abi",
    "inheritedContentVersion": "development-batch.2026-09-11.1",
    "inheritedLastCheckedOn": "2026-09-11",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.c47adccfb385",
    "inheritedClaimId": "claim.qf3.dcis-specimen-operation-application",
    "inheritedContentVersion": "question-flags-round3.evidence.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-11-04",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.a172b22493cd",
    "inheritedClaimId": "claim.qq20261028.peristomal.fit-exposure",
    "inheritedContentVersion": "question-authoring.2026-10-28.v1",
    "inheritedLastCheckedOn": "2026-10-28",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.c2690749ba1d",
    "inheritedClaimId": "claim.qq20261102a.melanoma-integrated-node-staging",
    "inheritedContentVersion": "evidence.question-quality.2026-11-02.v5",
    "inheritedLastCheckedOn": "2026-11-02",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.be062b16f447",
    "inheritedClaimId": "claim.qq20261102a.ulcer-local-modality-choice",
    "inheritedContentVersion": "evidence.question-quality.2026-11-02.v5",
    "inheritedLastCheckedOn": "2026-11-02",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.34c93980671c",
    "inheritedClaimId": "claim.qq20261102b.sarcoma-initial-core-method",
    "inheritedContentVersion": "evidence.question-quality.2026-11-02.v6",
    "inheritedLastCheckedOn": "2026-11-02",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.f24af3ddd3a9",
    "inheritedClaimId": "claim.qq20261102b.sentinel-before-reconstruction",
    "inheritedContentVersion": "evidence.question-quality.2026-11-02.v6",
    "inheritedLastCheckedOn": "2026-11-02",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.6ebd44d818b0",
    "inheritedClaimId": "claim.qq20261102c.classic-lipoma-normal-mucosal-sample",
    "inheritedContentVersion": "evidence.question-quality.2026-11-02.v7",
    "inheritedLastCheckedOn": "2026-11-02",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.db73b0b71f66",
    "inheritedClaimId": "claim.qq20261102c.sarcoma-mri-coverage-and-target",
    "inheritedContentVersion": "evidence.question-quality.2026-11-02.v7",
    "inheritedLastCheckedOn": "2026-11-02",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.f1fa567648e6",
    "inheritedClaimId": "claim.qq20261102c.ulcer-failed-repeat-embolization",
    "inheritedContentVersion": "evidence.question-quality.2026-11-02.v7",
    "inheritedLastCheckedOn": "2026-11-02",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.49a69d44d485",
    "inheritedClaimId": "claim.qq20261102c.ulcer-rebleeding-repeat-endoscopy",
    "inheritedContentVersion": "evidence.question-quality.2026-11-02.v7",
    "inheritedLastCheckedOn": "2026-11-02",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.d8826fad12fe",
    "inheritedClaimId": "claim.qq20261102d.lipoma-histology-provenance",
    "inheritedContentVersion": "evidence.question-quality.2026-11-02.v8",
    "inheritedLastCheckedOn": "2026-11-02",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.d7381707b15d",
    "inheritedClaimId": "claim.qq20261102f.integrated-partial-depth-planning",
    "inheritedContentVersion": "evidence.question-quality.2026-11-02.v10",
    "inheritedLastCheckedOn": "2026-11-03",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.55bfe6e710a5",
    "inheritedClaimId": "claim.soft-tissue-mass.mri",
    "inheritedContentVersion": "development-batch.2026-09-09.1",
    "inheritedLastCheckedOn": "2026-09-09",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.d9ff60dfac0d",
    "inheritedClaimId": "claim.soft-tissue-mass.planned-biopsy",
    "inheritedContentVersion": "development-batch.2026-09-09.1",
    "inheritedLastCheckedOn": "2026-09-09",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.337b094a2876",
    "inheritedClaimId": "claim.stoma-prolapse.assessment",
    "inheritedContentVersion": "development-batch.2026-09-28.pre-endoscopy.1",
    "inheritedLastCheckedOn": "2026-09-28",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.02595d974fd5",
    "inheritedClaimId": "claim.stoma-prolapse.nonurgent-boundary",
    "inheritedContentVersion": "development-batch.2026-09-28.pre-endoscopy.1",
    "inheritedLastCheckedOn": "2026-09-28",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.7360283b9af3",
    "inheritedClaimId": "claim.variety3.barrett.no-prophylactic-ablation",
    "inheritedContentVersion": "development-batch.2026-10-10.variety-3.1",
    "inheritedLastCheckedOn": "2026-10-10",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.4fb9d4bd1ed0",
    "inheritedClaimId": "claim.variety3.barrett.surveillance-plan",
    "inheritedContentVersion": "development-batch.2026-10-10.variety-3.1",
    "inheritedLastCheckedOn": "2026-10-10",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.23a644d8ccc5",
    "inheritedClaimId": "claim.variety3.barrett.surveillance-suitability",
    "inheritedContentVersion": "development-batch.2026-10-10.variety-3.1",
    "inheritedLastCheckedOn": "2026-10-10",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.1c8b5c958ac8",
    "inheritedClaimId": "claim.variety3.polypectomy.cold-forceps-limit",
    "inheritedContentVersion": "development-batch.2026-10-10.variety-3.1",
    "inheritedLastCheckedOn": "2026-10-10",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.3027c3cd5377",
    "inheritedClaimId": "claim.variety3.polypectomy.cold-snare-diminutive",
    "inheritedContentVersion": "development-batch.2026-10-10.variety-3.1",
    "inheritedLastCheckedOn": "2026-10-10",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.8ed95c68d973",
    "inheritedClaimId": "claim.variety3.polypectomy.cold-snare-small",
    "inheritedContentVersion": "development-batch.2026-10-10.variety-3.1",
    "inheritedLastCheckedOn": "2026-10-10",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.256d9311e264",
    "inheritedClaimId": "claim.variety3.polypectomy.hot-forceps-limit",
    "inheritedContentVersion": "development-batch.2026-10-10.variety-3.1",
    "inheritedLastCheckedOn": "2026-10-10",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.0b5c4ef72e1b",
    "inheritedClaimId": "claim.venous-leg-ulcer.arterial-assessment-before-compression",
    "inheritedContentVersion": "development-batch.2026-09-13.1",
    "inheritedLastCheckedOn": "2026-09-13",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.e22669366268",
    "inheritedClaimId": "claim.ventral-hernia.controlled-contamination-macroporous-synthetic-mesh",
    "inheritedContentVersion": "clinical.owner-row-044.2026-08-06.1",
    "inheritedLastCheckedOn": "2026-08-06",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.8e30265aebbd",
    "inheritedClaimId": "claim.ventral-hernia.controlled-enterotomy-selected-single-stage-repair",
    "inheritedContentVersion": "clinical.owner-row-044.2026-08-06.1",
    "inheritedLastCheckedOn": "2026-08-06",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  },
  {
    "claimId": "claim.n4.4b2bd6d4bf88",
    "inheritedClaimId": "claim.ventral-hernia.enterotomy-mesh-selection-safety-boundary",
    "inheritedContentVersion": "clinical.owner-row-044.2026-08-06.1",
    "inheritedLastCheckedOn": "2026-08-06",
    "localMappingCheckedOn": "2026-11-10",
    "statementUnchanged": true,
    "sourceRetrieval": false,
    "verificationDateRefreshed": false,
    "context": "N4 changes the authored simulation phase/capability while reusing the recorded underlying clinical fact and its clinical limits. Legacy no-onsite-simulation notes describe the old case, not new procedural technique evidence.",
    "verificationBasis": "Exact recorded original synthesis and bibliography; no inference that a citation verifies an unrecorded technical recommendation."
  }
];

export const QUESTION_NEW_N4_SOURCES:Array<ClinicalSource & Record<string,unknown>> = [
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.acg.celiac-patient-education.2026",
    "title": "Celiac Disease",
    "completeCitation": "American College of Gastroenterology. Celiac Disease. Original authors Connor G. Loftus and Joseph A. Murray; updated by Patrick McCabe (2021) and Claire Jansson-Knodell (April 2026).",
    "organizationOrJournal": "American College of Gastroenterology patient education",
    "authors": [
      "Connor G. Loftus",
      "Joseph A. Murray",
      "Patrick McCabe",
      "Claire Jansson-Knodell"
    ],
    "publicationYear": 2026,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://gi.org/topics/celiac-disease/",
    "accessedOn": "2026-09-09",
    "sourceClass": "open_educational_resource",
    "licenseLabel": "Copyrighted American College of Gastroenterology patient education",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Citation and bounded factual verification only; no protected wording, lists, tables, or images reproduced.",
    "authorityAssessment": "Current society patient education used only to cross-check gluten-before-testing and dietitian-supported treatment; not a substitute for the full guideline.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.celiac.gluten-free-treatment",
      "claim.celiac.gluten-testing-boundary",
      "claim.n4.87469918a5c7"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.acg.upper-gastrointestinal-ulcer-bleeding-guideline.2021",
    "title": "ACG Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding",
    "completeCitation": "Laine L, Barkun AN, Saltzman JR, Martel M, Leontiadis GI. ACG Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding. American Journal of Gastroenterology. 2021;116(5):899-917. doi:10.14309/ajg.0000000000001245.",
    "organizationOrJournal": "American College of Gastroenterology; American Journal of Gastroenterology",
    "authors": [
      "Loren Laine",
      "Alan N. Barkun",
      "John R. Saltzman",
      "Myriam Martel",
      "Grigorios I. Leontiadis"
    ],
    "publicationYear": 2021,
    "doi": "10.14309/ajg.0000000000001245",
    "pmid": "33929377",
    "officialUrl": "https://pubmed.ncbi.nlm.nih.gov/33929377/",
    "accessedOn": "2026-08-10",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted professional-society guideline; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Use independently written factual synthesis for targeted guideline verification; do not reproduce recommendations, tables, figures, algorithms, or protected explanatory wording.",
    "authorityAssessment": "Current ACG upper-GI and ulcer-bleeding guideline supporting treatment of active bleeding and nonbleeding visible vessels, accepted hemostatic modalities, and the rule that epinephrine is not definitive monotherapy.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.peptic-ulcer-bleeding.high-risk-stigmata-require-hemostasis",
      "claim.peptic-ulcer-bleeding.clean-base-flat-spot-no-hemostasis",
      "claim.peptic-ulcer-bleeding.nonbleeding-visible-vessel-modalities",
      "claim.peptic-ulcer-bleeding.epinephrine-not-monotherapy",
      "claim.peptic-ulcer-bleeding.active-bleed-conventional-combination",
      "claim.n4.2f251a75ceb4",
      "claim.n4.e55b4be019b7",
      "claim.n4.dda382649df0"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.aga.subepithelial-lesions.2022",
    "title": "AGA Clinical Practice Update on Management of Subepithelial Lesions Encountered During Routine Endoscopy: Expert Review",
    "completeCitation": "Sharzehi K, Sethi A, Savides T. AGA Clinical Practice Update on Management of Subepithelial Lesions Encountered During Routine Endoscopy: Expert Review. Clin Gastroenterol Hepatol. 2022;20(11):2435-2443.e4. doi:10.1016/j.cgh.2022.05.054.",
    "organizationOrJournal": "American Gastroenterological Association; Clinical Gastroenterology and Hepatology",
    "authors": [
      "Kaveh Sharzehi",
      "Amrita Sethi",
      "Thomas Savides"
    ],
    "publicationYear": 2022,
    "doi": "10.1016/j.cgh.2022.05.054",
    "pmid": "35842117",
    "officialUrl": "https://gastro.org/clinical-guidance/management-of-subepithelial-lesions-sel-encountered-during-routine-endoscopy/",
    "accessedOn": "2026-08-06",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted professional-society guidance; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Store bibliographic metadata and independently written atomic facts only; do not reproduce protected wording, tables, figures, or algorithms.",
    "authorityAssessment": "AGA expert guidance supporting no further lesion-directed evaluation or surveillance for an endoscopically characteristic lipoma and identifying ulceration, bleeding, or symptoms as management-changing features.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.colonic-lipoma.clear-asymptomatic.no-directed-follow-up",
      "claim.colonic-lipoma.symptoms-or-uncertainty-change-pathway",
      "claim.n4.ea03ad0a7d73"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.asbrs.axilla.2026",
    "title": "Management of the axilla",
    "completeCitation": "American Society of Breast Surgeons. Management of the Axilla in Patients with Invasive and In-Situ Breast Cancer. February 24, 2026.",
    "organizationOrJournal": "American Society of Breast Surgeons",
    "authors": [
      "American Society of Breast Surgeons"
    ],
    "publicationYear": 2026,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.breastsurgeons.org/docs/statements/asbrs-management-of-the-axilla-2026-02-24.pdf",
    "accessedOn": "2026-10-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted society guidance",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.",
    "authorityAssessment": "Current society consensus used only for targeted factual verification.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.gs028c.dcis.axilla-mastectomy",
      "claim.gs028c.dcis.axilla-omit-bcs",
      "claim.gs028c.dcis.axilla-risk-setting",
      "claim.n4.dd856cda49d5",
      "claim.n4.6c61d104e5a1",
      "claim.n4.ddbff2935560",
      "claim.n4.c47adccfb385"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.asge.subepithelial-lesions.2017",
    "title": "The role of endoscopy in subepithelial lesions of the GI tract",
    "completeCitation": "Faulx AL, Kothari S, Acosta RD, et al. The role of endoscopy in subepithelial lesions of the GI tract. Gastrointest Endosc. 2017;85(6):1117-1132. doi:10.1016/j.gie.2017.02.022.",
    "organizationOrJournal": "American Society for Gastrointestinal Endoscopy; Gastrointestinal Endoscopy",
    "authors": [
      "Ashley L. Faulx",
      "Shivangi Kothari",
      "Ruben D. Acosta",
      "ASGE Standards of Practice Committee"
    ],
    "publicationYear": 2017,
    "doi": "10.1016/j.gie.2017.02.022",
    "pmid": "28385194",
    "officialUrl": "https://www.asge.org/home/resources/publications/guidelines/the-role-of-endoscopy-in-subepithelial-lesions-of-the-gi-tract",
    "accessedOn": "2026-08-06",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted professional-society guidance; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Store bibliographic metadata and independently written atomic facts only; do not reproduce protected wording, tables, figures, or algorithms.",
    "authorityAssessment": "ASGE specialty-society guidance supporting the characteristic positive endoscopic phenotype of gastrointestinal lipoma and the absence of lesion-directed follow-up or therapy for a clearly diagnosed asymptomatic lipoma.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.colonic-lipoma.characteristic-endoscopic-phenotype",
      "claim.colonic-lipoma.clear-asymptomatic.no-directed-follow-up",
      "claim.colonic-lipoma.symptoms-or-uncertainty-change-pathway",
      "claim.n4.3c893f8ee4f0",
      "claim.n4.ea03ad0a7d73"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.bread-butter.bifa-high-output-stoma-2023",
    "title": "Managing a High Output Stoma",
    "completeCitation": "Nightingale J, British Intestinal Failure Alliance Committee. Managing a High Output Stoma. BIFA Top Tips Series 1. British Association for Parenteral and Enteral Nutrition. Updated April 2023.",
    "organizationOrJournal": "British Intestinal Failure Alliance / British Association for Parenteral and Enteral Nutrition",
    "authors": [
      "Nightingale J",
      "British Intestinal Failure Alliance Committee"
    ],
    "publicationYear": 2023,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.bapen.org.uk/pdfs/bifa/bifa-top-tips-series-1-updated.pdf",
    "accessedOn": "2026-09-17",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted professional-society guidance",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and original synthesis only; no source prose, table, or figure reproduced.",
    "authorityAssessment": "Current specialist-society practical guidance addressing clinical assessment, biochemical monitoring, and oral fluid strategy for high-output stomas.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n3.df90860e477f",
      "claim.n3.1a302f939983",
      "claim.n4.df90860e477f",
      "claim.n4.1a302f939983"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.bread-butter.bifa-oral-rehydration-2025",
    "title": "The Use of Oral Rehydration Solutions for the Management of High Output Stomas and Fistulas",
    "completeCitation": "Speakman A, Farrer K, Meade U, Culkin A, Nightingale J, British Intestinal Failure Alliance Committee. The Use of Oral Rehydration Solutions for the Management of High Output Stomas and Fistulas. BIFA Top Tips Series 30. British Association for Parenteral and Enteral Nutrition. May 2025.",
    "organizationOrJournal": "British Intestinal Failure Alliance / British Association for Parenteral and Enteral Nutrition",
    "authors": [
      "Speakman A",
      "Farrer K",
      "Meade U",
      "Culkin A",
      "Nightingale J",
      "British Intestinal Failure Alliance Committee"
    ],
    "publicationYear": 2025,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.bapen.org.uk/pdfs/bifa/bifa-top-tips-series-30.pdf",
    "accessedOn": "2026-09-17",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted professional-society guidance",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and original synthesis only; no source prose, formula, table, or figure reproduced.",
    "authorityAssessment": "Current specialist-society guidance directly addressing sodium-glucose oral rehydration and monitoring in high-output stomas.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n3.df90860e477f",
      "claim.n3.1a302f939983",
      "claim.n4.df90860e477f",
      "claim.n4.1a302f939983"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.bread-butter.idsa-ssti-2014-wound",
    "title": "Practice Guidelines for the Diagnosis and Management of Skin and Soft Tissue Infections: 2014 Update",
    "completeCitation": "Stevens DL, Bisno AL, Chambers HF, Dellinger EP, Goldstein EJC, Gorbach SL, Hirschmann JV, Kaplan SL, Montoya JG, Wade JC. Practice guidelines for the diagnosis and management of skin and soft tissue infections: 2014 update by the Infectious Diseases Society of America. Clin Infect Dis. 2014;59(2):e10-e52. doi:10.1093/cid/ciu296. PMID:24973422.",
    "organizationOrJournal": "Clinical Infectious Diseases / Infectious Diseases Society of America",
    "authors": [
      "Stevens DL",
      "Bisno AL",
      "Chambers HF",
      "Dellinger EP",
      "Goldstein EJC",
      "Gorbach SL",
      "Hirschmann JV",
      "Kaplan SL",
      "Montoya JG",
      "Wade JC"
    ],
    "publicationYear": 2014,
    "doi": "10.1093/cid/ciu296",
    "pmid": "24973422",
    "officialUrl": "https://www.idsociety.org/practice-guideline/skin-and-soft-tissue-infections/",
    "accessedOn": "2026-09-17",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted professional-society guidance",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Original synthesis only; no source prose, tables, figures, or algorithms reproduced. N2 uses recorded atomic synthesis and bibliographic metadata, with explicitly identified mathematical derivations. No source text, table, figure or excerpt was retrieved or copied. The original access date is retained, not refreshed.",
    "authorityAssessment": "Current IDSA guidance directly supporting suture removal and incision and drainage for superficial incisional infection.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n3r2.10b8e172c6d1",
      "claim.n4.10b8e172c6d1"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.brief.acg-eoe-2025",
    "title": "ACG Clinical Guideline: Diagnosis and Management of Eosinophilic Esophagitis",
    "completeCitation": "Dellon ES, Muir AB, Katzka DA, Shah SC, Sauer BG, Aceves SS, Furuta GT, Gonsalves N, Hirano I. ACG Clinical Guideline: Diagnosis and Management of Eosinophilic Esophagitis. Am J Gastroenterol. 2025;120:31-59. doi:10.14309/ajg.0000000000003194.",
    "organizationOrJournal": "American College of Gastroenterology / American Journal of Gastroenterology",
    "authors": [
      "Dellon ES",
      "Muir AB",
      "Katzka DA",
      "Shah SC",
      "Sauer BG",
      "Aceves SS",
      "Furuta GT",
      "Gonsalves N",
      "Hirano I"
    ],
    "publicationYear": 2025,
    "doi": "10.14309/ajg.0000000000003194",
    "pmid": null,
    "officialUrl": "https://gi.org/journals-publications/ebgi/eluri_feb2025/",
    "accessedOn": "2026-09-17",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted professional-society guidance",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and citation only; no recommendation table, algorithm, or source wording reproduced.",
    "authorityAssessment": "Current ACG guideline directly supporting multilevel biopsy sampling and dilation alongside anti-inflammatory treatment for strictures.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n3.6e5311561e7e",
      "claim.n3.23c6ba284b5a",
      "claim.n4.23c6ba284b5a"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.brief.acg-eoe-patient",
    "title": "Eosinophilic Esophagitis",
    "completeCitation": "American College of Gastroenterology. Eosinophilic Esophagitis. Patient education page. Accessed September 17, 2026.",
    "organizationOrJournal": "American College of Gastroenterology",
    "authors": [
      "American College of Gastroenterology"
    ],
    "publicationYear": null,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://gi.org/topics/eosinophilic-esophagitis/",
    "accessedOn": "2026-09-17",
    "sourceClass": "open_educational_resource",
    "licenseLabel": "Copyrighted professional-society patient education",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual cross-check and citation only; no page prose or graphics reproduced.",
    "authorityAssessment": "Society patient-education cross-check for dysphagia presentation, biopsy diagnosis, and dilation of narrowing.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n3.6e5311561e7e",
      "claim.n3.23c6ba284b5a",
      "claim.n4.23c6ba284b5a"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.ehs.emergency-ventral-incisional-hernia.2026",
    "title": "EHS Guidelines on the Management of Primary Ventral and Incisional Hernias Under Emergency Conditions",
    "completeCitation": "Stabilini C, Theodorou A, Pawlak M, et al. EHS Guidelines on the Management of Primary Ventral and Incisional Hernias Under Emergency Conditions. J Abdom Wall Surg. 2026;5:16228. doi:10.3389/jaws.2026.16228.",
    "organizationOrJournal": "European Hernia Society; Journal of Abdominal Wall Surgery",
    "authors": [
      "Cesare Stabilini",
      "Alexis Theodorou",
      "Maciej Pawlak",
      "Stavros Antoniou",
      "Eva Deerenberg",
      "European Hernia Society guideline panel"
    ],
    "publicationYear": 2026,
    "doi": "10.3389/jaws.2026.16228",
    "pmid": "41938186",
    "officialUrl": "https://www.frontierspartnerships.org/journals/journal-of-abdominal-wall-surgery/articles/10.3389/jaws.2026.16228/full",
    "accessedOn": "2026-08-06",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Use with attribution for independently written factual synthesis. Do not reproduce guideline tables, algorithms, figures, or extended prose.",
    "authorityAssessment": "Current European Hernia Society guidance conditionally favoring permanent macroporous synthetic mesh over other mesh types in selected emergency mesh-based primary ventral or incisional hernia repairs, with low to very-low evidence certainty.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.ventral-hernia.controlled-enterotomy-selected-single-stage-repair",
      "claim.ventral-hernia.controlled-contamination-macroporous-synthetic-mesh",
      "claim.ventral-hernia.enterotomy-mesh-selection-safety-boundary",
      "claim.n4.e22669366268",
      "claim.n4.8e30265aebbd",
      "claim.n4.4b2bd6d4bf88"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.esge.peptic-ulcer-bleeding-guideline.2026",
    "title": "Endoscopic diagnosis and management of peptic ulcer bleeding: European Society of Gastrointestinal Endoscopy (ESGE) Guideline - Update 2026",
    "completeCitation": "Gralnek IM, Morris J, Laursen SB, et al. Endoscopic diagnosis and management of peptic ulcer bleeding: European Society of Gastrointestinal Endoscopy (ESGE) Guideline - Update 2026. Endoscopy. 2026;58(8):899-924. doi:10.1055/a-2863-8314.",
    "organizationOrJournal": "European Society of Gastrointestinal Endoscopy; Endoscopy",
    "authors": [
      "Ian M. Gralnek",
      "John Morris",
      "Stig Borbjerg Laursen",
      "Marine Camus",
      "Georgios Tziatzios",
      "Lynn K. Debels",
      "Gaurav B. Nigam",
      "Balint Eross",
      "Martin Goetz",
      "Nauzer Forbes",
      "Tiago Curdia Goncalves",
      "Krzysztof Kurek",
      "Michael Bretthauer",
      "Tony C. Tham"
    ],
    "publicationYear": 2026,
    "doi": "10.1055/a-2863-8314",
    "pmid": "42127996",
    "officialUrl": "https://pubmed.ncbi.nlm.nih.gov/42127996/",
    "accessedOn": "2026-08-10",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Free-to-read copyrighted professional-society guideline; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Use independently written factual synthesis only; do not reproduce protected recommendation wording, tables, figures, or algorithms. PubMed lists a published correction (PMID 42173116); this package does not rely on formatting or conflict-of-interest details affected by that notice.",
    "authorityAssessment": "Current ESGE peptic-ulcer-bleeding guideline supporting stigmata-specific hemostasis, monotherapy options for a nonbleeding visible vessel, conventional combination therapy for active bleeding, and selected advanced monotherapy boundaries that prevent overbroad distractors.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.peptic-ulcer-bleeding.high-risk-stigmata-require-hemostasis",
      "claim.peptic-ulcer-bleeding.clean-base-flat-spot-no-hemostasis",
      "claim.peptic-ulcer-bleeding.nonbleeding-visible-vessel-modalities",
      "claim.peptic-ulcer-bleeding.epinephrine-not-monotherapy",
      "claim.peptic-ulcer-bleeding.active-bleed-conventional-combination",
      "claim.peptic-ulcer-bleeding.selected-advanced-monotherapy-boundary",
      "claim.n4.2f251a75ceb4",
      "claim.n4.e55b4be019b7",
      "claim.n4.dda382649df0"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.esge.subepithelial-lesions.2022",
    "title": "Endoscopic management of subepithelial lesions including neuroendocrine neoplasms: European Society of Gastrointestinal Endoscopy (ESGE) Guideline",
    "completeCitation": "Deprez PH, Moons LMG, O'Toole D, et al. Endoscopic management of subepithelial lesions including neuroendocrine neoplasms: European Society of Gastrointestinal Endoscopy (ESGE) Guideline. Endoscopy. 2022;54(4):412-429. doi:10.1055/a-1751-5742.",
    "organizationOrJournal": "European Society of Gastrointestinal Endoscopy; Endoscopy",
    "authors": [
      "Pierre H. Deprez",
      "Leon M. G. Moons",
      "Dermot O'Toole",
      "Rodica Gincul",
      "Andrada Seicean",
      "Pedro Pimentel-Nunes",
      "Gloria Fernandez-Esparrach",
      "Marcin Polkowski",
      "Michael Vieth",
      "Ivan Borbath",
      "Tom G. Moreels",
      "Els Nieveen van Dijkum",
      "Jean-Yves Blay",
      "Jeanin E. van Hooft"
    ],
    "publicationYear": 2022,
    "doi": "10.1055/a-1751-5742",
    "pmid": "35180797",
    "officialUrl": "https://www.esge.com/assets/downloads/pdfs/guidelines/2022_a-1751-5742.pdf",
    "accessedOn": "2026-08-06",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted professional-society guidance; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Store bibliographic metadata and independently written atomic facts only; do not reproduce protected wording, tables, figures, or algorithms.",
    "authorityAssessment": "ESGE specialty-society guidance independently supporting the characteristic positive phenotype and no dedicated surveillance when an asymptomatic lipoma diagnosis is clear.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.colonic-lipoma.characteristic-endoscopic-phenotype",
      "claim.colonic-lipoma.clear-asymptomatic.no-directed-follow-up",
      "claim.colonic-lipoma.symptoms-or-uncertainty-change-pathway",
      "claim.n4.3c893f8ee4f0",
      "claim.n4.ea03ad0a7d73"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.essr.soft-tissue-imaging.2024",
    "title": "Soft tissue tumor imaging in adults: European Society of Musculoskeletal Radiology-Guidelines 2023-overview, and primary local imaging: how and where?",
    "completeCitation": "Noebauer-Huhmann IM, Vanhoenacker FM, Vilanova JC, et al. Soft tissue tumor imaging in adults: European Society of Musculoskeletal Radiology-Guidelines 2023-overview, and primary local imaging: how and where? European Radiology. 2024;34:4427-4437. doi:10.1007/s00330-023-10425-5.",
    "organizationOrJournal": "European Radiology",
    "authors": [
      "Noebauer-Huhmann IM",
      "Vanhoenacker FM",
      "Vilanova JC",
      "et al."
    ],
    "publicationYear": 2024,
    "doi": "10.1007/s00330-023-10425-5",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1007/s00330-023-10425-5",
    "accessedOn": "2026-09-09",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Original modified factual synthesis; no algorithms, figures, or third-party art copied. Attribution and license: https://creativecommons.org/licenses/by/4.0/ .",
    "authorityAssessment": "Peer-reviewed ESSR expert consensus directly checked for MRI characterization, tumor-center referral before intervention, and planned image-guided biopsy.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.soft-tissue-mass.mri",
      "claim.soft-tissue-mass.planned-biopsy",
      "claim.n4.55bfe6e710a5",
      "claim.n4.d9ff60dfac0d"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.expansion.nhlbi-pad-diagnosis-2022",
    "title": "Peripheral Artery Disease — Diagnosis",
    "completeCitation": "National Heart, Lung, and Blood Institute. Peripheral Artery Disease — Diagnosis. Updated March 24, 2022. Accessed 2026-09-11.",
    "organizationOrJournal": "National Heart, Lung, and Blood Institute",
    "authors": [
      "National Heart, Lung, and Blood Institute"
    ],
    "publicationYear": 2022,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.nhlbi.nih.gov/health/peripheral-artery-disease/diagnosis",
    "sourceClass": "government_guidance",
    "licenseLabel": "US federal factual material; public-domain conditions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Exclude third-party content, images, and marks; no endorsement implied.",
    "authorityAssessment": "Government guidance directly supports ABI as the usual initial diagnostic test and additional physiologic testing when resting ABI is insufficient.",
    "usageRole": "evidence",
    "accessedOn": "2026-09-11",
    "evidenceClaimIds": [
      "claim.n3.bf7d58a0e363",
      "claim.n4.bf7d58a0e363"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.expansion.sbacv-pad-2024",
    "title": "Brazilian Society of Angiology and Vascular Surgery guidelines on peripheral artery disease",
    "completeCitation": "Erzinger FL, Polimanti AC, Pinto DM, et al. Brazilian Society of Angiology and Vascular Surgery guidelines on peripheral artery disease. Jornal Vascular Brasileiro. 2024;23:e20230059. doi:10.1590/1677-5449.202300592. Accessed 2026-09-11.",
    "organizationOrJournal": "Brazilian Society of Angiology and Vascular Surgery / Jornal Vascular Brasileiro",
    "authors": [
      "F. L. Erzinger",
      "A. C. Polimanti",
      "D. M. Pinto",
      "Brazilian Society of Angiology and Vascular Surgery"
    ],
    "publicationYear": 2024,
    "doi": "10.1590/1677-5449.202300592",
    "pmid": null,
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11530000/",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Attribution required; claims are original synthesis.",
    "authorityAssessment": "Current society guideline independently supports ABI-based diagnosis and supervised exercise for stable claudication.",
    "usageRole": "cross_check",
    "accessedOn": "2026-09-11",
    "evidenceClaimIds": [
      "claim.n3.bf7d58a0e363",
      "claim.n3.0e51e4d9dd4c",
      "claim.n4.bf7d58a0e363"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.gs028g.babakhanlou-stoma-2022",
    "title": "Stoma-related complications and emergencies",
    "completeCitation": "Babakhanlou R, Larkin K, Hita AG, Stroh J, Yeung SC. Stoma-related complications and emergencies. International Journal of Emergency Medicine. 2022;15:17. doi:10.1186/s12245-022-00421-9.",
    "organizationOrJournal": "International Journal of Emergency Medicine",
    "authors": [
      "Rodrick Babakhanlou",
      "Kelly Larkin",
      "Angel G. Hita",
      "John Stroh",
      "Sai-Ching Yeung"
    ],
    "publicationYear": 2022,
    "doi": "10.1186/s12245-022-00421-9",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s12245-022-00421-9",
    "accessedOn": "2026-10-07",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY 4.0; original factual synthesis with attribution",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.",
    "authorityAssessment": "Peer-reviewed review of stoma complications; supports inspection, fit correction and stoma-nurse care, not a comparative treatment trial.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.gs028g.peristomal-skin.effluent-irritation",
      "claim.gs028g.peristomal-skin.effluent-irritation.fact2",
      "claim.gs028g.peristomal-skin.effluent-irritation.fact3",
      "claim.gs028g.peristomal-skin.restore-seal",
      "claim.gs028g.peristomal-skin.restore-seal.fact2",
      "claim.gs028g.peristomal-skin.restore-seal.fact3",
      "claim.gs028g.peristomal-skin.restore-seal.fact4",
      "claim.n4.a1e25267f8e9",
      "claim.n4.82fe00bb745d",
      "claim.n4.1a6b88bdf1b0",
      "claim.n4.a172b22493cd"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.gs028g.ehs-incisional-hernia-2023",
    "title": "Midline incisional hernia guidelines: the European Hernia Society",
    "completeCitation": "Sanders DL, Pawlak MM, Simons MP, et al. Midline incisional hernia guidelines: the European Hernia Society. British Journal of Surgery. 2023;110(12):1732–1768. doi:10.1093/bjs/znad284. Key Questions 7 and 9.",
    "organizationOrJournal": "British Journal of Surgery / European Hernia Society",
    "authors": [
      "David L. Sanders",
      "Maciej M. Pawlak",
      "Maarten P. Simons",
      "European Hernia Society guideline group"
    ],
    "publicationYear": 2023,
    "doi": "10.1093/bjs/znad284",
    "pmid": null,
    "officialUrl": "https://www.britishherniasociety.org/wp-content/uploads/2023/10/MIDLINEGUIDLINES.pdf",
    "accessedOn": "2026-10-07",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "CC BY 4.0; official society-hosted licensed guideline; original factual synthesis with attribution",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.",
    "authorityAssessment": "Evidence-graded society guideline limited to adult midline incisional hernias expected to close without advanced myofascial release; fascial closure recommendation has low-certainty evidence.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.gs028g.incisional-hernia.fascial-closure",
      "claim.gs028g.incisional-hernia.fascial-closure.fact2",
      "claim.gs028g.incisional-hernia.fascial-closure.fact3",
      "claim.gs028g.incisional-hernia.retrorectus-plane",
      "claim.gs028g.incisional-hernia.retrorectus-plane.fact2",
      "claim.gs028g.incisional-hernia.retrorectus-plane.fact3",
      "claim.gs028g.incisional-hernia.retrorectus-plane.fact4",
      "claim.n4.6b82b00afbc7",
      "claim.n4.ed48bbec4ece"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.gs028g.parini-misstow-ses-2023",
    "title": "Surgical management of ostomy complications: a MISSTO–WSES mapping review",
    "completeCitation": "Parini D, Bondurri A, Ferrara F, et al. Surgical management of ostomy complications: a MISSTO–WSES mapping review. World Journal of Emergency Surgery. 2023;18:48. doi:10.1186/s13017-023-00516-5.",
    "organizationOrJournal": "World Journal of Emergency Surgery / MISSTO–WSES",
    "authors": [
      "Dario Parini",
      "Andrea Bondurri",
      "Francesco Ferrara",
      "MISSTO–WSES review group"
    ],
    "publicationYear": 2023,
    "doi": "10.1186/s13017-023-00516-5",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s13017-023-00516-5",
    "accessedOn": "2026-10-07",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY 4.0; original factual synthesis with attribution",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.",
    "authorityAssessment": "Society-associated mapping review; authors acknowledge limited high-quality evidence for many ostomy management decisions.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.gs028g.mucocutaneous-separation.recognition",
      "claim.gs028g.mucocutaneous-separation.recognition.fact2",
      "claim.gs028g.mucocutaneous-separation.recognition.fact3",
      "claim.gs028g.mucocutaneous-separation.superficial-care",
      "claim.gs028g.mucocutaneous-separation.superficial-care.fact2",
      "claim.gs028g.mucocutaneous-separation.superficial-care.fact3",
      "claim.n4.dbcb717c9c9a",
      "claim.n4.fd1d7e5c4396",
      "claim.n4.28f6b50877d4",
      "claim.n4.7467890b4e97",
      "claim.n4.bcb1afc6bce6"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.gs028g.ramirez-subtotal-2023",
    "title": "State of the art in subtotal cholecystectomy: an overview",
    "completeCitation": "Ramírez-Giraldo C, Torres-Cuellar A, Van-Londoño I. State of the art in subtotal cholecystectomy: an overview. Frontiers in Surgery. 2023;10:1142579. doi:10.3389/fsurg.2023.1142579.",
    "organizationOrJournal": "Frontiers in Surgery",
    "authors": [
      "Camilo Ramírez-Giraldo",
      "Alejandro Torres-Cuellar",
      "Ivan Van-Londoño"
    ],
    "publicationYear": 2023,
    "doi": "10.3389/fsurg.2023.1142579",
    "pmid": null,
    "officialUrl": "https://www.frontiersin.org/journals/surgery/articles/10.3389/fsurg.2023.1142579/full",
    "accessedOn": "2026-10-07",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY 4.0; original factual synthesis with attribution",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.",
    "authorityAssessment": "Peer-reviewed surgical review of bailout and remnant-based nomenclature; no inference of universal superiority or numerical complication rates.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.gs028g.subtotal-cholecystectomy.remnant-classification",
      "claim.gs028g.subtotal-cholecystectomy.remnant-classification.fact2",
      "claim.gs028g.subtotal-cholecystectomy.remnant-classification.fact3",
      "claim.gs028g.subtotal-cholecystectomy.remnant-classification.fact4",
      "claim.gs028g.subtotal-cholecystectomy.safe-bailout",
      "claim.gs028g.subtotal-cholecystectomy.safe-bailout.fact2",
      "claim.gs028g.subtotal-cholecystectomy.safe-bailout.fact3",
      "claim.n4.da2f704793ec",
      "claim.n4.86849d22206f",
      "claim.n4.77d7aef55c11"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.gs028g.wses-cholecystitis-2020",
    "title": "2020 World Society of Emergency Surgery updated guidelines for the diagnosis and treatment of acute calculus cholecystitis",
    "completeCitation": "Pisano M, Allievi N, Gurusamy K, et al. 2020 World Society of Emergency Surgery updated guidelines for the diagnosis and treatment of acute calculus cholecystitis. World Journal of Emergency Surgery. 2020;15:61. doi:10.1186/s13017-020-00336-x. Recommendation 3.4.",
    "organizationOrJournal": "World Journal of Emergency Surgery / WSES",
    "authors": [
      "Michele Pisano",
      "Niccolò Allievi",
      "Kurinchi Gurusamy",
      "WSES guideline group"
    ],
    "publicationYear": 2020,
    "doi": "10.1186/s13017-020-00336-x",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s13017-020-00336-x",
    "accessedOn": "2026-10-07",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "CC BY 4.0; original factual synthesis with attribution",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.",
    "authorityAssessment": "Evidence-graded emergency surgery guideline supports subtotal bailout when safe anatomy cannot be established; conversion and other safe strategies remain legitimate alternatives.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.gs028g.subtotal-cholecystectomy.safe-bailout",
      "claim.gs028g.subtotal-cholecystectomy.safe-bailout.fact2",
      "claim.gs028g.subtotal-cholecystectomy.safe-bailout.fact3",
      "claim.n4.da2f704793ec",
      "claim.n4.86849d22206f",
      "claim.n4.77d7aef55c11"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.mesh.wses-sise-2018",
    "title": "WSES/SIS-E skin and soft-tissue infection consensus",
    "completeCitation": "Sartelli M, Guirao X, Hardcastle TC, et al. 2018 WSES/SIS-E consensus conference: recommendations for the management of skin and soft-tissue infections. World J Emerg Surg. 2018;13:58. doi:10.1186/s13017-018-0219-9.",
    "organizationOrJournal": "WSES and SIS-E",
    "authors": [
      "Sartelli M",
      "Guirao X",
      "Hardcastle TC",
      "et al."
    ],
    "publicationYear": 2018,
    "doi": "10.1186/s13017-018-0219-9",
    "pmid": null,
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6295010/",
    "accessedOn": "2026-09-29",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.",
    "authorityAssessment": "Society consensus supporting deep mesh-infection recognition and individualized source control.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n3.3ef0d7efc452",
      "claim.n3.40b34fe591d8",
      "claim.n4.3ef0d7efc452",
      "claim.n4.40b34fe591d8"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.nci.soft-tissue-sarcoma-pdq.2025",
    "title": "Soft Tissue Sarcoma Treatment, Health Professional Version",
    "completeCitation": "PDQ Adult Treatment Editorial Board. Soft Tissue Sarcoma Treatment, Health Professional Version. Bethesda, MD: National Cancer Institute. Updated February 21, 2025. PMID:26389481.",
    "organizationOrJournal": "National Cancer Institute PDQ",
    "authors": [
      "PDQ Adult Treatment Editorial Board"
    ],
    "publicationYear": 2025,
    "doi": null,
    "pmid": "26389481",
    "officialUrl": "https://www.cancer.gov/types/soft-tissue-sarcoma/hp/adult-soft-tissue-treatment-pdq",
    "accessedOn": "2026-09-09",
    "sourceClass": "government_guidance",
    "licenseLabel": "United States government work; NCI reuse conditions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Original factual synthesis only; no source prose, imagery, agency marks, or PDQ branding reproduced.",
    "authorityAssessment": "NCI expert editorial synthesis directly checked for imaging before intervention, planned biopsy, and experienced pathology review; PDQ is independent of NCI policy.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.soft-tissue-mass.mri",
      "claim.soft-tissue-mass.planned-biopsy",
      "claim.n4.55bfe6e710a5",
      "claim.n4.d9ff60dfac0d"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.niddk.celiac-diagnosis.2020",
    "title": "Diagnosis of Celiac Disease",
    "completeCitation": "National Institute of Diabetes and Digestive and Kidney Diseases. Diagnosis of Celiac Disease. Reviewed October 2020.",
    "organizationOrJournal": "NIDDK",
    "authors": [
      "National Institute of Diabetes and Digestive and Kidney Diseases"
    ],
    "publicationYear": 2020,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.niddk.nih.gov/health-information/digestive-diseases/celiac-disease/diagnosis",
    "accessedOn": "2026-09-09",
    "sourceClass": "government_guidance",
    "licenseLabel": "United States government work; NIDDK reuse conditions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Original factual synthesis only; third-party materials and agency marks excluded.",
    "authorityAssessment": "Federal patient guidance directly checked for blood testing, small-intestinal biopsy, and the effect of gluten avoidance on results.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.celiac.initial-serology",
      "claim.celiac.adult-biopsy",
      "claim.celiac.gluten-testing-boundary",
      "claim.n4.5294d3feead5",
      "claim.n4.87469918a5c7",
      "claim.n4.8a59fd5f0d78"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.niddk.celiac-tests.2021",
    "title": "Celiac Disease Tests",
    "completeCitation": "National Institute of Diabetes and Digestive and Kidney Diseases. Celiac Disease Tests. Reviewed February 2021.",
    "organizationOrJournal": "NIDDK",
    "authors": [
      "National Institute of Diabetes and Digestive and Kidney Diseases"
    ],
    "publicationYear": 2021,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.niddk.nih.gov/health-information/professionals/clinical-tools-patient-management/digestive-diseases/celiac-disease-health-care-professionals?dkrd=www2.niddk.nih.gov",
    "accessedOn": "2026-09-09",
    "sourceClass": "government_guidance",
    "licenseLabel": "United States government work; NIDDK reuse conditions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Original factual synthesis only; third-party materials and agency marks excluded.",
    "authorityAssessment": "Federal professional guidance directly checked for initial serology, total IgA context, gluten exposure, and usual biopsy follow-up.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.celiac.initial-serology",
      "claim.celiac.adult-biopsy",
      "claim.celiac.gluten-testing-boundary",
      "claim.celiac.igg-tests-in-iga-deficiency",
      "claim.celiac.hla-susceptibility-not-active-disease",
      "claim.n4.5294d3feead5",
      "claim.n4.87469918a5c7",
      "claim.n4.8a59fd5f0d78"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.ostomy.missto-wses-2023",
    "title": "MISSTO-WSES mapping review of ostomy complications",
    "completeCitation": "Parini D, Bondurri A, Ferrara F, et al. Surgical management of ostomy complications: a MISSTO-WSES mapping review. World J Emerg Surg. 2023;18:48. doi:10.1186/s13017-023-00516-5.",
    "organizationOrJournal": "MISSTO and World Society of Emergency Surgery",
    "authors": [
      "Parini D",
      "Bondurri A",
      "Ferrara F",
      "et al."
    ],
    "publicationYear": 2023,
    "doi": "10.1186/s13017-023-00516-5",
    "pmid": null,
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10563348/",
    "accessedOn": "2026-09-28",
    "sourceClass": "narrative_review",
    "licenseLabel": "Creative Commons Attribution 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.",
    "authorityAssessment": "Open mapping review supporting recognition and urgent/nonurgent stoma boundaries while acknowledging limited evidence.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.parastomal-hernia.recognition",
      "claim.parastomal-hernia.individualized-nonurgent-care",
      "claim.parastomal-hernia.urgent-boundary",
      "claim.stoma-prolapse.assessment",
      "claim.stoma-prolapse.nonurgent-boundary",
      "claim.stoma-prolapse.urgent-escalation",
      "claim.n4.223dab952919",
      "claim.n4.42635f86f7a9",
      "claim.n4.d70e777dbe3f",
      "claim.n4.337b094a2876",
      "claim.n4.02595d974fd5"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.parastomal.ehs-2018",
    "title": "EHS parastomal hernia guidelines",
    "completeCitation": "Antoniou SA, Agresta F, Garcia Alamino JM, et al. European Hernia Society guidelines on prevention and treatment of parastomal hernias. Hernia. 2018;22:183-198. doi:10.1007/s10029-017-1697-5.",
    "organizationOrJournal": "European Hernia Society",
    "authors": [
      "Antoniou SA",
      "Agresta F",
      "Garcia Alamino JM",
      "et al."
    ],
    "publicationYear": 2018,
    "doi": "10.1007/s10029-017-1697-5",
    "pmid": null,
    "officialUrl": "https://europeanherniasociety.eu/european-hernia-society-guidelines-on-prevention-and-treatment-of-parastomal-hernias/",
    "accessedOn": "2026-09-28",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted guidance; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.",
    "authorityAssessment": "Society guideline used only as a limited cross-check; exact management statements rely on the open mapping review.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.parastomal-hernia.recognition",
      "claim.n4.42635f86f7a9"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.parastomal.nursing-2025",
    "title": "Nursing interventions for parastomal hernia or bulge",
    "completeCitation": "Larsen C, Borglit TB, Leinum LR, Dreyer P. Nursing Interventions for the Management of a Stoma Complicated by a Parastomal Hernia or Bulge: A Scoping Review. J Clin Nurs. 2025;34(7):2591-2624. doi:10.1111/jocn.17671.",
    "organizationOrJournal": "Journal of Clinical Nursing",
    "authors": [
      "Larsen C",
      "Borglit TB",
      "Leinum LR",
      "Dreyer P"
    ],
    "publicationYear": 2025,
    "doi": "10.1111/jocn.17671",
    "pmid": null,
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12181155/",
    "accessedOn": "2026-09-28",
    "sourceClass": "systematic_review",
    "licenseLabel": "Creative Commons Attribution-NonCommercial-NoDerivatives 4.0",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.",
    "authorityAssessment": "Scoping review; evidence is limited and often expert opinion.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.parastomal-hernia.individualized-nonurgent-care",
      "claim.n4.223dab952919"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.pediatric-clinic.cornwall-surgery-2025",
    "title": "Paediatric Surgery",
    "completeCitation": "Faux W, Burns S. Paediatric Surgery. NHS Cornwall and Isles of Scilly Referral Management Service. Version 1.2; partial update 9 May 2025. Review date listed as 9 May 2026. Accessed 8 October 2026.",
    "organizationOrJournal": "NHS Cornwall and Isles of Scilly Referral Management Service",
    "authors": [
      "Will Faux",
      "S. Burns"
    ],
    "publicationYear": 2025,
    "publicationDateNote": "The page identifies a partial update on 2025-05-09 and a review date on 2026-05-09; the latter is not assumed to be a completed update.",
    "officialUrl": "https://rms.cornwall.nhs.uk/rms/primary_care_clinical_referral_criteria/rms/primary_care_clinical_referral_criteria/paediatrics/paediatric_surgery",
    "sourceClass": "government_guidance",
    "licenseLabel": "Copyright NHS/Kernow CCG; all rights reserved",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification only; no copyrighted expression, source excerpts, tables, figures, algorithms or clinical vignettes are stored or reproduced. Copyright is not treated as AI-use permission.",
    "authorityAssessment": "Local NHS referral guidance authored by a consultant pediatric surgeon and GP. Adequate for narrow referral facts; not a national operative guideline. Retractile-testis terminology and umbilical repair ages are retained as disagreements, not teaching rules.",
    "usageRole": "both",
    "accessMethod": "primary_html_targeted_read",
    "doi": null,
    "pmid": null,
    "accessedOn": "2026-10-08",
    "evidenceClaimIds": [
      "claim.pediatric-clinic.dynamic-groin-bulge",
      "claim.pediatric-clinic.clinical-groin-hernia-referral",
      "claim.pediatric-clinic.umbilical-repair-age-disagreement",
      "claim.pediatric-clinic.acquired-testis-ascent",
      "claim.pediatric-clinic.ascending-testis-referral",
      "claim.pediatric-clinic.retractile-ascent-surveillance",
      "claim.pediatric-clinic.high-retractile-terminology-disagreement",
      "claim.n4.8f03b4ef56b7"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.pediatric-clinic.cua-puc-testis-2017",
    "title": "Canadian Urological Association-Pediatric Urologists of Canada (CUA-PUC) guideline for the diagnosis, management, and followup of cryptorchidism",
    "completeCitation": "Braga LH, Lorenzo AJ, Romao RLP. Canadian Urological Association-Pediatric Urologists of Canada (CUA-PUC) guideline for the diagnosis, management, and followup of cryptorchidism. Can Urol Assoc J. 2017;11(7):E251-E260. doi:10.5489/cuaj.4585.",
    "organizationOrJournal": "Canadian Urological Association Journal",
    "authors": [
      "Luis H. Braga",
      "Armando J. Lorenzo",
      "Rodrigo L. P. Romao"
    ],
    "publicationYear": 2017,
    "publicationDateNote": "Published 2017-07-11. Older society guideline, cross-checked against eligible NHS information; no claim of a 2026 update.",
    "officialUrl": "https://cuaj.ca/index.php/journal/article/view/4585",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright Canadian Urological Association; reproduction rights reserved",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification only; no copyrighted expression, source excerpts, tables, figures, algorithms or clinical vignettes are stored or reproduced. Copyright is not treated as AI-use permission. The publisher's guideline PDF was read for the specific examination definition and follow-up/referral distinctions; no algorithm or table was copied.",
    "authorityAssessment": "Professional society guideline with evidence grading. Adequate for the narrowly defined true-retractile versus acquired-ascent distinction; broader high/persistent-retractile terminology remains disputed and withheld.",
    "usageRole": "both",
    "accessMethod": "primary_guideline_pdf_targeted_read",
    "doi": "10.5489/cuaj.4585",
    "pmid": "28761584",
    "accessedOn": "2026-10-08",
    "evidenceClaimIds": [
      "claim.pediatric-clinic.acquired-testis-ascent",
      "claim.pediatric-clinic.nonmaintained-scrotal-position",
      "claim.pediatric-clinic.ascending-testis-referral",
      "claim.pediatric-clinic.true-retractile-examination",
      "claim.pediatric-clinic.true-retractile-followup",
      "claim.pediatric-clinic.retractile-ascent-surveillance",
      "claim.pediatric-clinic.true-retractile-no-operation",
      "claim.pediatric-clinic.high-retractile-terminology-disagreement",
      "claim.n4.8f03b4ef56b7",
      "claim.n4.32632eb28aa1",
      "claim.n4.ed485fb1c469",
      "claim.n4.c78329a0ee7f"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.pediatric-clinic.cuh-testis-2025",
    "title": "Undescended testes and orchidopexy surgery - in children",
    "completeCitation": "Cambridge University Hospitals NHS Foundation Trust, Paediatric Surgery and Urology. Undescended testes and orchidopexy surgery - in children. Document 1716, version 9; approved 7 November 2025. Accessed 8 October 2026.",
    "organizationOrJournal": "Cambridge University Hospitals NHS Foundation Trust",
    "authors": [
      "Paediatric Surgery and Urology Department"
    ],
    "publicationYear": 2025,
    "publicationDateNote": "Approved 2025-11-07; version 9. The leaflet's institutional approval is not approval of this authored batch.",
    "officialUrl": "https://www.cuh.nhs.uk/patient-information/undescended-testes-and-surgery-in-children/",
    "sourceClass": "open_educational_resource",
    "licenseLabel": "Copyright Cambridge University Hospitals NHS Foundation Trust",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification only; no copyrighted expression, source excerpts, tables, figures, algorithms or clinical vignettes are stored or reproduced. Copyright is not treated as AI-use permission.",
    "authorityAssessment": "Current pediatric hospital information, used as independent corroboration of observation for a true retractile testis. Source-specific surveillance intervals and procedure/anesthetic details are not authored.",
    "usageRole": "cross_check",
    "accessMethod": "primary_html_targeted_read",
    "doi": null,
    "pmid": null,
    "accessedOn": "2026-10-08",
    "evidenceClaimIds": [
      "claim.pediatric-clinic.true-retractile-followup",
      "claim.pediatric-clinic.true-retractile-no-operation",
      "claim.pediatric-clinic.high-retractile-terminology-disagreement",
      "claim.n4.ed485fb1c469",
      "claim.n4.c78329a0ee7f"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.pediatric-clinic.metzger-pilonidal-2021",
    "title": "Principles in treating pediatric patients with pilonidal disease - An expert perspective",
    "completeCitation": "Metzger GA, Apfeld JC, Nishimura L, Lutz C, Deans KJ, Minneci PC. Principles in treating pediatric patients with pilonidal disease - An expert perspective. Ann Med Surg (Lond). 2021;64:102233. doi:10.1016/j.amsu.2021.102233. PMID:33868675; PMCID:PMC8040102.",
    "organizationOrJournal": "Annals of Medicine and Surgery",
    "authors": [
      "Gregory A. Metzger",
      "Jordan C. Apfeld",
      "Leah Nishimura",
      "Carley Lutz",
      "Katherine J. Deans",
      "Peter C. Minneci"
    ],
    "publicationYear": 2021,
    "publicationDateNote": "Published 2021-03-27; April 2021 volume.",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8040102/",
    "sourceClass": "narrative_review",
    "licenseLabel": "Creative Commons Attribution 4.0 International (CC BY 4.0)",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Attributed to all authors, article title, DOI and CC BY 4.0. Independently authored factual synthesis; no source prose or clinical stem is reused. The actual article license was verified. PMC browser access showed a CAPTCHA; permitted licensed XML was instead read in memory through the official Europe PMC API, without bypassing access controls or saving the article.",
    "authorityAssessment": "Pediatric surgery expert perspective rather than formal guideline or comparative trial. One adequate pediatric source; individualized conservative care is taught, with no universal hair-removal method, schedule or operation.",
    "usageRole": "evidence",
    "accessMethod": "licensed_europe_pmc_xml_targeted_read",
    "doi": "10.1016/j.amsu.2021.102233",
    "pmid": "33868675",
    "accessedOn": "2026-10-08",
    "evidenceClaimIds": [
      "claim.pediatric-clinic.pilonidal-cleft-pattern",
      "claim.pediatric-clinic.limited-pilonidal-conservative-care",
      "claim.pediatric-clinic.pilonidal-cleft-cleanliness",
      "claim.pediatric-clinic.pilonidal-moisture-reduction",
      "claim.pediatric-clinic.pilonidal-pressure-reduction",
      "claim.pediatric-clinic.pilonidal-individual-hair-plan",
      "claim.pediatric-clinic.pilonidal-response-reassessment",
      "claim.pediatric-clinic.pilonidal-acute-infection-distinction",
      "claim.n4.c6d38b0b02a0",
      "claim.n4.803d081a7ae2",
      "claim.n4.64fb82fc7f10",
      "claim.n4.9d5eaf817018",
      "claim.n4.fe5e38fe01ce",
      "claim.n4.cf350cc3230f",
      "claim.n4.5278b9358a66",
      "claim.n4.8290e8a874de"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261028.wocn-peristomal",
    "title": "Peristomal Skin Assessment Guide for Clinicians",
    "completeCitation": "Wound, Ostomy, and Continence Nurses Society. Peristomal Skin Assessment Guide for Clinicians. Undated online clinician guide. Accessed October 28, 2026.",
    "organizationOrJournal": "Wound, Ostomy, and Continence Nurses Society",
    "authors": [
      "Wound, Ostomy, and Continence Nurses Society"
    ],
    "publicationYear": null,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://psag.wocn.org/index.html",
    "accessedOn": "2026-10-28",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted society guide; no open reuse license established",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual cross-check only. No guide text, workflow, images, videos or algorithm reproduced/adapted. Educational grant funding disclosed by the source.",
    "authorityAssessment": "Specialty-society practical guide; independent of the general stoma review, with no graded comparative-effect estimate implied.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.qq20261028.peristomal.fit-exposure",
      "claim.n4.a172b22493cd"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.eado2024",
    "title": "European consensus-based interdisciplinary guideline for melanoma. Part 1: Diagnostics - Update 2024",
    "completeCitation": "Garbe C, Amaral T, Peris K, Hauschild A, Arenberger P, Basset-Seguin N, et al.; EADO, EDF and EORTC. European consensus-based interdisciplinary guideline for melanoma. Part 1: Diagnostics - Update 2024. Eur J Cancer. 2025;215:115152. doi:10.1016/j.ejca.2024.115152.",
    "organizationOrJournal": "EADO / EDF / EORTC / European Journal of Cancer",
    "authors": [
      "Claus Garbe",
      "Teresa Amaral",
      "Ketty Peris",
      "Axel Hauschild",
      "Petr Arenberger",
      "Nicole Basset-Seguin",
      "et al."
    ],
    "publicationYear": 2025,
    "doi": "10.1016/j.ejca.2024.115152",
    "pmid": null,
    "officialUrl": "https://eado.org/files/2025/01/2024-EADO-CMGuideline-Diagnostics-EJC.pdf",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright Elsevier; freely available society PDF; targeted verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.",
    "authorityAssessment": "Complete publicly parsed society PDF read despite direct-fetch redirect loop. Valid through end 2026. Supports integrated depth/clinical nodal assessment, ultrasound not substituting for sentinel staging, and complete diagnostic excision when feasible.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.melanoma-integrated-node-staging",
      "claim.qq20261102a.melanoma-diagnostic-sampling",
      "claim.n4.c2690749ba1d"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.esge-ulcer",
    "title": "Endoscopic diagnosis and management of peptic ulcer bleeding: ESGE Guideline - Update 2026",
    "completeCitation": "Gralnek IM, Morris J, Laursen SB, Camus M, Tziatzios G, Debels LK, et al. Endoscopic diagnosis and management of peptic ulcer bleeding: European Society of Gastrointestinal Endoscopy (ESGE) Guideline - Update 2026. Endoscopy. 2026;58(8):899-924. doi:10.1055/a-2863-8314.",
    "organizationOrJournal": "European Society of Gastrointestinal Endoscopy / Endoscopy",
    "authors": [
      "Ian M Gralnek",
      "John Morris",
      "Stig Borbjerg Laursen",
      "Marine Camus",
      "Georgios Tziatzios",
      "Lynn K Debels",
      "et al."
    ],
    "publicationYear": 2026,
    "doi": "10.1055/a-2863-8314",
    "pmid": "42127996",
    "officialUrl": "https://www.esge.com/assets/downloads/pdfs/guidelines/2026_a-2863-8314.pdf",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ESGE; freely readable professional guidance, all rights reserved",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted verification of hemostasis/PPI and rescue embolization only. No article text, algorithm, tables, illustrations, appendices, exact regimen or dosing schedule stored or reproduced.",
    "authorityAssessment": "Current complete ESGE2026 PDF rechecked: visible-vessel mechanical/thermal therapy, no epinephrine monotherapy; topical agents have rescue/temporizing roles and are not routine sole initial treatment for the represented vessel. Existing ACG claim supplies independent hemostasis indication. Same publication as source.qq20261102.esge-ulcer-2026; this recheck is not an independent second source.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.ulcer-local-modality-choice",
      "claim.n4.be062b16f447"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102a.nci-melanoma",
    "title": "Melanoma Treatment (PDQ), Health Professional Version",
    "completeCitation": "PDQ Adult Treatment Editorial Board. Melanoma Treatment (PDQ), Health Professional Version. National Cancer Institute. Updated 2025-05-02. PMID:26389469. Accessed 2026-09-10.",
    "organizationOrJournal": "National Cancer Institute PDQ",
    "authors": [
      "PDQ Adult Treatment Editorial Board"
    ],
    "publicationYear": 2025,
    "doi": null,
    "pmid": "26389469",
    "officialUrl": "https://www.cancer.gov/types/skin/hp/melanoma-treatment-pdq",
    "accessedOn": "2026-11-02",
    "sourceClass": "government_guidance",
    "licenseLabel": "United States government factual material; NCI and PDQ reuse conditions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Original factual synthesis only. No PDQ-branded modified summary, source prose, third-party image, table, or agency mark reproduced; credit NCI without endorsement.",
    "authorityAssessment": "Independent federal professional evidence summary supports diagnostic depth assessment and sentinel staging in the supplied thickness range; this does not promise a survival benefit. Same publication as source.sc.nci-melanoma-pdq-2025; this recheck is not an independent second source.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102a.melanoma-integrated-node-staging",
      "claim.qq20261102a.melanoma-diagnostic-sampling",
      "claim.n4.c2690749ba1d"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102b.cco-melanoma",
    "title": "CCO melanoma excision and sentinel-node guideline",
    "completeCitation": "Wright FC, Souter LH, Kellett S, Easson A, Murray C, Toye J, McCready D, Nessim C, Ghazarian D, Look Hong NJ, Johnson S, Goldstein DP, Petrella T; Melanoma Disease Site Group. Primary excision margins, sentinel lymph node biopsy, and completion lymph node dissection in cutaneous melanoma: a clinical practice guideline. Curr Oncol. 2019;26(4):e541-e550. doi:10.3747/co.26.4885.",
    "organizationOrJournal": "Cancer Care Ontario / Current Oncology",
    "authors": [
      "Wright FC",
      "Souter LH",
      "Kellett S",
      "Easson A",
      "Murray C",
      "Toye J",
      "McCready D",
      "Nessim C",
      "Ghazarian D",
      "Look Hong NJ",
      "Johnson S",
      "Goldstein DP",
      "Petrella T",
      "Melanoma Disease Site Group"
    ],
    "publicationYear": 2019,
    "doi": "10.3747/co.26.4885",
    "pmid": "31548823",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6726255/",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "2019 Multimed copyright; no open reuse permission inferred from PMC",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Complete guideline available for targeted factual verification. No source prose/tables/figures stored or adapted; PMC availability does not confer reuse rights.",
    "authorityAssessment": "Primary guideline directly addresses sentinel biopsy with wide excision and reduced reliability after flap/graft repair. Older technical statement: current retained EADO/NCI sources support the indication independently, not a new independent verification of every reconstruction detail.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102b.sentinel-before-reconstruction",
      "claim.n4.f24af3ddd3a9"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102b.essr2015",
    "title": "Soft Tissue Tumors in Adults: ESSR-Approved Guidelines for Diagnostic Imaging",
    "completeCitation": "Noebauer-Huhmann IM, et al. Soft Tissue Tumors in Adults: ESSR-Approved Guidelines for Diagnostic Imaging. Semin Musculoskelet Radiol. 2015;19(5):475-482. doi:10.1055/s-0035-1569251.",
    "organizationOrJournal": "European Society of Musculoskeletal Radiology / Seminars in Musculoskeletal Radiology",
    "authors": [
      "Iris-Melanie Noebauer-Huhmann",
      "et al."
    ],
    "publicationYear": 2015,
    "doi": "10.1055/s-0035-1569251",
    "pmid": null,
    "officialUrl": "https://pure.amsterdamumc.nl/ws/files/173173752/Soft-tissue-tumors-in-adults-essr-approved-guidelines-for-diagnostic-imaging.pdf",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright Thieme; institutional Taverne access, not an open reuse license",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Institutional version states personal-use/reproduction restrictions. Used only for targeted factual verification of professional-society guidance as permitted by AGENTS; no text, figures, biopsy diagrams or procedures copied or distributed. No reusable-content license inferred.",
    "authorityAssessment": "Primary technical guideline rechecked for viable targets, core sampling and avoiding contamination of other compartments. Older technique guidance, corroborated by current SEOM planning guidance. Same publication as source.qq20261102a.essr2015-target; no independent second source is implied.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102b.sarcoma-method-and-tract",
      "claim.qq20261102b.sarcoma-initial-core-method",
      "claim.n4.34c93980671c"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102b.seom2024",
    "title": "SEOM-GEIS Spanish clinical guidelines for the management of soft-tissue sarcomas (2024)",
    "completeCitation": "Serrano C, Arregui M, Carrasco I, et al. SEOM-GEIS Spanish clinical guidelines for the management of soft-tissue sarcomas (2024). Clinical and Translational Oncology. 2025;27(4):1460-1471. doi:10.1007/s12094-024-03842-5.",
    "organizationOrJournal": "Spanish Society of Medical Oncology and Spanish Group for Sarcoma Research; Clinical and Translational Oncology",
    "authors": [
      "Cesar Serrano",
      "Marta Arregui",
      "Irene Carrasco",
      "Nadia Hindi",
      "Javier Martinez-Trufero",
      "Jeronimo Martinez-Garcia",
      "Aurea Molina",
      "Ana Paisan",
      "Raul Sanchez",
      "Maria Angeles Sala"
    ],
    "publicationYear": 2025,
    "doi": "10.1007/s12094-024-03842-5",
    "pmid": "39918719",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12000159/",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Use independently written factual synthesis with attribution; do not copy source prose, tables, figures, or algorithms.",
    "authorityAssessment": "Current open society guideline rechecked for initial image-guided core biopsy, selected open biopsy and planned removal of the tract with the tumor. Same publication as source.qq20261102a.seom2024; no independent second source is implied.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.qq20261102b.sarcoma-method-and-tract",
      "claim.qq20261102b.sarcoma-initial-core-method",
      "claim.n4.34c93980671c"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.esge-ulcer2026",
    "title": "ESGE peptic-ulcer bleeding guideline update",
    "completeCitation": "Gralnek IM, Morris J, Laursen SB, Camus M, Tziatzios G, Debels LK, Nigam GB, Erőss B, Goetz M, Forbes N, Cúrdia Gonçalves T, Kurek K, Bretthauer M, Tham TC. Endoscopic diagnosis and management of peptic ulcer bleeding: ESGE Guideline-Update 2026. Endoscopy. 2026;58(8):899-924. doi:10.1055/a-2863-8314.",
    "organizationOrJournal": "European Society of Gastrointestinal Endoscopy / Endoscopy",
    "authors": [
      "Gralnek IM",
      "Morris J",
      "Laursen SB",
      "Camus M",
      "Tziatzios G",
      "Debels LK",
      "Nigam GB",
      "Erőss B",
      "Goetz M",
      "Forbes N",
      "Cúrdia Gonçalves T",
      "Kurek K",
      "Bretthauer M",
      "Tham TC"
    ],
    "publicationYear": 2026,
    "doi": "10.1055/a-2863-8314",
    "pmid": "42127996",
    "officialUrl": "https://www.esge.com/assets/downloads/pdfs/guidelines/2026_a-2863-8314.pdf",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ESGE/Thieme 2026; all rights reserved",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification, no algorithm/figure/table copied. Correction doi:10.1055/a-2881-7411 (PMID42173116) was identified; its separate PDF could not be retrieved. The actual recommendation text in the current official PDF was checked; no claim that every correction/supplement was independently adjudicated.",
    "authorityAssessment": "Current full official PDF checked for repeat hemostasis in recurrent bleeding, consideration of OTS clips and embolization after failed second hemostasis. This supersedes reliance on 2021 as the latest version.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102c.ulcer-rebleeding-repeat-endoscopy",
      "claim.qq20261102c.ulcer-failed-repeat-embolization",
      "claim.n4.f1fa567648e6",
      "claim.n4.49a69d44d485"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.essr2023",
    "title": "Soft tissue tumor imaging in adults: European Society of Musculoskeletal Radiology-Guidelines 2023-overview, and primary local imaging: how and where?",
    "completeCitation": "Noebauer-Huhmann IM, Vanhoenacker FM, Vilanova JC, et al. Soft tissue tumor imaging in adults: European Society of Musculoskeletal Radiology-Guidelines 2023-overview, and primary local imaging: how and where? European Radiology. 2024;34:4427-4437. doi:10.1007/s00330-023-10425-5.",
    "organizationOrJournal": "European Radiology",
    "authors": [
      "Noebauer-Huhmann IM",
      "Vanhoenacker FM",
      "Vilanova JC",
      "et al."
    ],
    "publicationYear": 2024,
    "doi": "10.1007/s00330-023-10425-5",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1007/s00330-023-10425-5",
    "accessedOn": "2026-11-02",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Original modified factual synthesis; no algorithms, figures, or third-party art copied. Attribution and license: https://creativecommons.org/licenses/by/4.0/ .",
    "authorityAssessment": "Full current primary MSK guideline rechecked this round at https://pmc.ncbi.nlm.nih.gov/articles/PMC11213759/ for whole-lesion/compartment coverage and enhancement-based viable biopsy targeting. CC BY 4.0 independently confirmed; original factual synthesis only, no consensus table/protocol values copied. Exact case protocols still need radiologist review. Same publication as source.qq20261102a.essr2023; a new record ID does not create independent evidence.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.qq20261102c.sarcoma-mri-coverage-and-target",
      "claim.qq20261102c.sarcoma-enhancement-biopsy-target",
      "claim.n4.db73b0b71f66"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.sel2022",
    "title": "Endoscopic management of subepithelial lesions including neuroendocrine neoplasms: ESGE Guideline",
    "completeCitation": "Deprez PH, Moons LMG, O'Toole D, Gincul R, Seicean A, Pimentel-Nunes P, et al. Endoscopic management of subepithelial lesions including neuroendocrine neoplasms: European Society of Gastrointestinal Endoscopy (ESGE) Guideline. Endoscopy. 2022;54(4):412-429. doi:10.1055/a-1751-5742.",
    "organizationOrJournal": "European Society of Gastrointestinal Endoscopy / Endoscopy",
    "authors": [
      "Pierre H Deprez",
      "Leon MG Moons",
      "Dermot O'Toole",
      "Rodica Gincul",
      "Andrada Seicean",
      "Pedro Pimentel-Nunes",
      "et al."
    ],
    "publicationYear": 2022,
    "doi": "10.1055/a-1751-5742",
    "pmid": null,
    "officialUrl": "https://www.esge.com/assets/downloads/pdfs/guidelines/2022_a-1751-5742.pdf",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ESGE; all rights reserved; targeted verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.",
    "authorityAssessment": "Full primary guideline rechecked this round for subepithelial wall layers, characteristic lipoma diagnosis, selective tissue acquisition and no surveillance when clearly diagnosed/asymptomatic. Same publication as source.qq20261102a.esge-sel2022; a new record ID does not create independent evidence.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102c.classic-lipoma-normal-mucosal-sample",
      "claim.n4.6ebd44d818b0"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102d.sel2022",
    "title": "Endoscopic management of subepithelial lesions including neuroendocrine neoplasms: ESGE Guideline",
    "completeCitation": "Deprez PH, Moons LMG, O'Toole D, Gincul R, Seicean A, Pimentel-Nunes P, et al. Endoscopic management of subepithelial lesions including neuroendocrine neoplasms: European Society of Gastrointestinal Endoscopy (ESGE) Guideline. Endoscopy. 2022;54(4):412-429. doi:10.1055/a-1751-5742.",
    "organizationOrJournal": "European Society of Gastrointestinal Endoscopy / Endoscopy",
    "authors": [
      "Pierre H Deprez",
      "Leon MG Moons",
      "Dermot O'Toole",
      "Rodica Gincul",
      "Andrada Seicean",
      "Pedro Pimentel-Nunes",
      "et al."
    ],
    "publicationYear": 2022,
    "doi": "10.1055/a-1751-5742",
    "pmid": null,
    "officialUrl": "https://www.esge.com/assets/downloads/pdfs/guidelines/2022_a-1751-5742.pdf",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ESGE; all rights reserved; targeted verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.",
    "authorityAssessment": "Full primary guideline rechecked this round for subepithelial wall layers, characteristic lipoma diagnosis, selective tissue acquisition and no surveillance when clearly diagnosed/asymptomatic. Same publication as source.qq20261102a.esge-sel2022; a new record ID does not create independent evidence. Round five reuses that already-recorded primary-source verification offline; no new web retrieval or independent corroborating source is claimed. The new source ID records a new atomic mapping, not a new publication.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102d.lipoma-histology-provenance",
      "claim.n4.d8826fad12fe"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102f.esmo2025",
    "title": "ESMO cutaneous melanoma guideline",
    "completeCitation": "Amaral T, Ottaviano M, Arance A, Blank C, Chiarion-Sileni V, Donia M, et al.; ESMO Guidelines Committee. Cutaneous melanoma: ESMO Clinical Practice Guideline for diagnosis, treatment and follow-up. Ann Oncol. 2025;36(1):10-30. doi:10.1016/j.annonc.2024.11.006.",
    "organizationOrJournal": "European Society for Medical Oncology / Annals of Oncology",
    "authors": [
      "Amaral T",
      "Ottaviano M",
      "Arance A",
      "Blank C",
      "Chiarion-Sileni V",
      "Donia M",
      "ESMO Guidelines Committee"
    ],
    "publicationYear": 2025,
    "doi": "10.1016/j.annonc.2024.11.006",
    "pmid": "39550033",
    "officialUrl": "https://doi.org/10.1016/j.annonc.2024.11.006",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Publisher society copyright; targeted verification only (PMC manuscript separately reports CC BY)",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Access route: https://www.icpf.pf/wp-content/uploads/2025/08/ESMO-2025-Melanome.pdf . PMC routes returned a browser check, so no inaccessible snippet was evidence. No staging tables, margin table, figure or treatment algorithm copied.",
    "authorityAssessment": "Full guideline read through the public cancer-institute-hosted copy for complete diagnostic biopsy, microstaging, clinically negative sentinel assessment and stage-based workup. Partial-specimen and missed-node applications are independently authored clinical inferences, not a universal completion algorithm. Round six reuses the existing targeted primary-source verification offline; no fresh retrieval or independent publication is inferred from this new mapping ID. Round seven retains the original publication, rights and access date for offline use. This new mapping ID is neither a fresh source retrieval nor independent corroboration; the technical/cross-specimen application remains clinician review.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102f.integrated-partial-depth-planning",
      "claim.n4.d7381707b15d"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102f.nci-melanoma",
    "title": "Melanoma Treatment (PDQ), Health Professional Version",
    "completeCitation": "PDQ Adult Treatment Editorial Board. Melanoma Treatment (PDQ), Health Professional Version. National Cancer Institute. Updated 2025-05-02. PMID:26389469. Accessed 2026-09-10.",
    "organizationOrJournal": "National Cancer Institute PDQ",
    "authors": [
      "PDQ Adult Treatment Editorial Board"
    ],
    "publicationYear": 2025,
    "doi": null,
    "pmid": "26389469",
    "officialUrl": "https://www.cancer.gov/types/skin/hp/melanoma-treatment-pdq",
    "accessedOn": "2026-11-02",
    "sourceClass": "government_guidance",
    "licenseLabel": "United States government factual material; NCI and PDQ reuse conditions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Original factual synthesis only. No PDQ-branded modified summary, source prose, third-party image, table, or agency mark reproduced; credit NCI without endorsement.",
    "authorityAssessment": "Independent federal professional evidence summary supports diagnostic depth assessment and sentinel staging in the supplied thickness range; this does not promise a survival benefit. Same publication as source.sc.nci-melanoma-pdq-2025; this recheck is not an independent second source. Round six reuses the existing targeted primary-source verification offline; no fresh retrieval or independent publication is inferred from this new mapping ID. Round seven retains the original publication, rights and access date for offline use. This new mapping ID is neither a fresh source retrieval nor independent corroboration; the technical/cross-specimen application remains clinician review.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102f.integrated-partial-depth-planning",
      "claim.n4.d7381707b15d"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.rosen.contaminated-ventral-hernia-rct.2022",
    "title": "Biologic vs Synthetic Mesh for Single-stage Repair of Contaminated Ventral Hernias: A Randomized Clinical Trial",
    "completeCitation": "Rosen MJ, Krpata DM, Petro CC, et al. Biologic vs Synthetic Mesh for Single-stage Repair of Contaminated Ventral Hernias: A Randomized Clinical Trial. JAMA Surg. 2022;157(4):293-301. doi:10.1001/jamasurg.2021.6902.",
    "organizationOrJournal": "JAMA Surgery",
    "authors": [
      "Michael J Rosen",
      "David M Krpata",
      "Clayton C Petro",
      "Alfredo Carbonell",
      "Jeremy Warren",
      "Benjamin K Poulose",
      "Ajita S Prabhu"
    ],
    "publicationYear": 2022,
    "doi": "10.1001/jamasurg.2021.6902",
    "pmid": "35044431",
    "officialUrl": "https://jamanetwork.com/journals/jamasurgery/fullarticle/2788222",
    "accessedOn": "2026-08-06",
    "sourceClass": "randomized_trial",
    "licenseLabel": "Copyrighted journal article; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Use only for targeted factual verification and citation. Do not reproduce article prose, tables, figures, or supplementary materials.",
    "authorityAssessment": "Multicenter randomized trial in elective clean-contaminated and contaminated single-stage ventral hernia repair showing lower recurrence with permanent synthetic than biologic mesh and similar procedural-intervention safety outcomes.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.ventral-hernia.controlled-contamination-macroporous-synthetic-mesh",
      "claim.n4.e22669366268"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.sages.laparoscopic-ventral-hernia.2016",
    "title": "SAGES guidelines for laparoscopic ventral hernia repair",
    "completeCitation": "Earle D, Roth JS, Saber A, et al.; SAGES Guidelines Committee. SAGES guidelines for laparoscopic ventral hernia repair. Surg Endosc. 2016;30(8):3163-3183. doi:10.1007/s00464-016-5072-x.",
    "organizationOrJournal": "Society of American Gastrointestinal and Endoscopic Surgeons; Surgical Endoscopy",
    "authors": [
      "David Earle",
      "J Scott Roth",
      "Alan Saber",
      "Steve Haggerty",
      "William S Richardson",
      "Dimitrios Stefanidis",
      "SAGES Guidelines Committee"
    ],
    "publicationYear": 2016,
    "doi": "10.1007/s00464-016-5072-x",
    "pmid": "27405477",
    "officialUrl": "https://www.sages.org/publications/guidelines/guidelines-for-laparoscopic-ventral-hernia-repair/",
    "accessedOn": "2026-08-06",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted professional-society guidance; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Use only for targeted factual verification and citation. Do not reproduce protected recommendation wording or extended explanatory prose.",
    "authorityAssessment": "Enterotomy-specific professional guidance emphasizing individualized management based on operative findings, contamination, expertise, and patient factors rather than an automatic mesh rule.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.ventral-hernia.controlled-enterotomy-selected-single-stage-repair",
      "claim.ventral-hernia.enterotomy-mesh-selection-safety-boundary",
      "claim.n4.8e30265aebbd",
      "claim.n4.4b2bd6d4bf88"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.stoma.acpgbi-2021",
    "title": "ACPGBI emergency colorectal surgery consensus guideline",
    "completeCitation": "Miller AS, Boyce K, Box B, et al. The Association of Coloproctology of Great Britain and Ireland consensus guidelines in emergency colorectal surgery. Colorectal Dis. 2021;23(2):476-547. doi:10.1111/codi.15503.",
    "organizationOrJournal": "Association of Coloproctology of Great Britain and Ireland",
    "authors": [
      "Miller AS",
      "Boyce K",
      "Box B",
      "et al."
    ],
    "publicationYear": 2021,
    "doi": "10.1111/codi.15503",
    "pmid": "33470518",
    "officialUrl": "https://pubmed.ncbi.nlm.nih.gov/33470518/",
    "accessedOn": "2026-09-28",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Creative Commons Attribution-NonCommercial",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.",
    "authorityAssessment": "Society consensus for urgent stoma-complication boundaries; low evidence grades retained.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.parastomal-hernia.urgent-boundary",
      "claim.stoma-prolapse.assessment",
      "claim.stoma-prolapse.urgent-escalation",
      "claim.n4.d70e777dbe3f",
      "claim.n4.337b094a2876"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.variety3.esge-barrett-2023",
    "title": "Diagnosis and management of Barrett esophagus: ESGE Guideline",
    "completeCitation": "Weusten BLAM, Bisschops R, Dinis-Ribeiro M, et al. Diagnosis and management of Barrett esophagus: European Society of Gastrointestinal Endoscopy (ESGE) Guideline. Endoscopy. 2023;55(12):1124-1146. Published online 9 October 2023. doi:10.1055/a-2176-2440. PMID:37813356. Full author list retained in authors. Accessed 10 October 2026.",
    "organizationOrJournal": "ESGE / Endoscopy",
    "authors": [
      "Bas L. A. M. Weusten",
      "Raf Bisschops",
      "Mario Dinis-Ribeiro",
      "Massimiliano di Pietro",
      "Oliver Pech",
      "Manon C. W. Spaander",
      "Francisco Baldaque-Silva",
      "Maximilien Barret",
      "Emmanuel Coron",
      "Glòria Fernández-Esparrach",
      "Rebecca C. Fitzgerald",
      "Marnix Jansen",
      "Manol Jovani",
      "Ines Marques-de-Sa",
      "Arti Rattan",
      "W. Keith Tan",
      "Eva P. D. Verheij",
      "Pauline A. Zellenrath",
      "Konstantinos Triantafyllou",
      "Roos E. Pouw"
    ],
    "publicationYear": 2023,
    "doi": "10.1055/a-2176-2440",
    "pmid": "37813356",
    "officialUrl": "https://www.esge.com/assets/downloads/pdfs/guidelines/2023_a-2176-2440.pdf",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ESGE / Thieme; all rights reserved",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted verification of underlying facts only. All claims and cases are independently worded; no source prose, excerpts, tables, figures, algorithms or vignettes are retained or reproduced. Copyright is not treated as AI-use permission.",
    "termsUrl": "https://www.esge.com/privacy-policy",
    "authorityAssessment": "Official guideline supports surveillance of established Barrett and avoiding prophylactic ablation without dysplasia. Cases exclude an irregular Z-line, visible neoplasia and a patient unsuitable for surveillance/treatment. Independent NIDDK corroborates surveillance; the no-prophylactic-ablation recommendation has this guideline as sole direct source.",
    "usageRole": "evidence",
    "accessMethod": "primary_guideline_pdf_targeted_read",
    "accessedOn": "2026-10-10",
    "evidenceClaimIds": [
      "claim.variety3.barrett.surveillance-plan",
      "claim.variety3.barrett.no-prophylactic-ablation",
      "claim.variety3.barrett.surveillance-suitability",
      "claim.n4.7360283b9af3",
      "claim.n4.4fb9d4bd1ed0",
      "claim.n4.23a644d8ccc5"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.variety3.esge-polypectomy-2024",
    "title": "Colorectal polypectomy and endoscopic mucosal resection: ESGE Guideline - Update 2024",
    "completeCitation": "Ferlitsch M, Hassan C, Bisschops R, et al. Colorectal polypectomy and endoscopic mucosal resection: European Society of Gastrointestinal Endoscopy (ESGE) Guideline - Update 2024. Endoscopy. 2024;56(7):516-545. Published online 26 April 2024. doi:10.1055/a-2304-3219. PMID:38670139. Full author list retained in authors. Accessed 10 October 2026.",
    "organizationOrJournal": "ESGE / Endoscopy",
    "authors": [
      "Monika Ferlitsch",
      "Cesare Hassan",
      "Raf Bisschops",
      "Pradeep Bhandari",
      "Mário Dinis-Ribeiro",
      "Mauro Risio",
      "Gregorios A. Paspatis",
      "Alan Moss",
      "Diogo Libânio",
      "Vincente Lorenzo-Zúñiga",
      "Andrei M. Voiosu",
      "Matthew D. Rutter",
      "Maria Pellisé",
      "Leon M. G. Moons",
      "Andreas Probst",
      "Halim Awadie",
      "Arnaldo Amato",
      "Yoji Takeuchi",
      "Alessandro Repici",
      "Gabriel Rahmi",
      "Hugo U. Koecklin",
      "Eduardo Albéniz",
      "Lisa-Maria Rockenbauer",
      "Elisabeth Waldmann",
      "Helmut Messmann",
      "Konstantinos Triantafyllou",
      "Rodrigo Jover",
      "Ian M. Gralnek",
      "Evelien Dekker",
      "Michael J. Bourke"
    ],
    "publicationYear": 2024,
    "doi": "10.1055/a-2304-3219",
    "pmid": "38670139",
    "officialUrl": "https://www.esge.com/assets/downloads/pdfs/guidelines/2024_a-2304-3219.pdf",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ESGE / Thieme; all rights reserved",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted verification of underlying facts only. All claims and cases are independently worded; no source prose, excerpts, tables, figures, algorithms or vignettes are retained or reproduced. Copyright is not treated as AI-use permission.",
    "termsUrl": "https://www.esge.com/privacy-policy",
    "authorityAssessment": "Current official guideline, sections 7.1/7.2: preferred cold-snare technique for diminutive/small nonpedunculated polyps and forceps limitations. Sole adequate directly read technique source in this batch; inaccessible independent sources are not counted. No copied resection algorithm, exact margin, complication frequency or antithrombotic rule.",
    "usageRole": "evidence",
    "accessMethod": "primary_guideline_pdf_targeted_read",
    "accessedOn": "2026-10-10",
    "evidenceClaimIds": [
      "claim.variety3.polypectomy.cold-snare-diminutive",
      "claim.variety3.polypectomy.cold-snare-small",
      "claim.variety3.polypectomy.cold-forceps-limit",
      "claim.variety3.polypectomy.hot-forceps-limit",
      "claim.n4.1c8b5c958ac8",
      "claim.n4.3027c3cd5377",
      "claim.n4.8ed95c68d973",
      "claim.n4.256d9311e264"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.variety3.niddk-barrett-diagnosis-2024",
    "title": "Diagnosis of Barrett's Esophagus",
    "completeCitation": "National Institute of Diabetes and Digestive and Kidney Diseases. Diagnosis of Barrett's Esophagus. Last reviewed August 2024. Accessed 10 October 2026.",
    "organizationOrJournal": "NIDDK / National Institutes of Health",
    "authors": [
      "National Institute of Diabetes and Digestive and Kidney Diseases"
    ],
    "publicationYear": 2024,
    "officialUrl": "https://www.niddk.nih.gov/health-information/digestive-diseases/barretts-esophagus/diagnosis",
    "sourceClass": "government_guidance",
    "licenseLabel": "Original federal text generally public domain; NIDDK exceptions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Targeted verification of underlying facts only. All claims and cases are independently worded; no source prose, excerpts, tables, figures, algorithms or vignettes are retained or reproduced. Copyright is not treated as AI-use permission. Original agency text is generally public domain subject to agency conditions; third-party material and logos are excluded. Agency attribution and links do not imply endorsement.",
    "termsUrl": "https://www.niddk.nih.gov/copyright",
    "authorityAssessment": "Current national education independently corroborates repeat endoscopy with biopsy as surveillance, with frequency individualized. Does not independently establish an ablation recommendation or a universal interval.",
    "usageRole": "cross_check",
    "accessMethod": "primary_html_targeted_read",
    "accessedOn": "2026-10-10",
    "doi": null,
    "pmid": null,
    "evidenceClaimIds": [
      "claim.variety3.barrett.surveillance-plan",
      "claim.variety3.barrett.surveillance-suitability",
      "claim.n4.4fb9d4bd1ed0",
      "claim.n4.23a644d8ccc5"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.vlu.esvs-cvd.2022",
    "title": "ESVS 2022 Clinical Practice Guidelines on Chronic Venous Disease of the Lower Limbs",
    "completeCitation": "De Maeseneer MG, Kakkos SK, Aherne T, et al. Editor's Choice — European Society for Vascular Surgery (ESVS) 2022 Clinical Practice Guidelines on the Management of Chronic Venous Disease of the Lower Limbs. European Journal of Vascular and Endovascular Surgery. 2022;63(2):184-267. doi:10.1016/j.ejvs.2021.12.024.",
    "organizationOrJournal": "European Society for Vascular Surgery",
    "authors": [
      "De Maeseneer MG",
      "Kakkos SK",
      "Aherne T",
      "et al."
    ],
    "publicationYear": 2022,
    "doi": "10.1016/j.ejvs.2021.12.024",
    "pmid": null,
    "officialUrl": "https://esvs.org/guideline/chronic-venous-disease-of-lower-limbs/",
    "accessedOn": "2026-09-13",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted society guideline; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, or algorithms reproduced.",
    "authorityAssessment": "Current vascular guideline for arterial-assessment boundaries and compression therapy.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n3.0b5c4ef72e1b",
      "claim.n4.0b5c4ef72e1b"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.wses.complicated-abdominal-wall-hernia.2017",
    "title": "2017 update of the WSES guidelines for emergency repair of complicated abdominal wall hernias",
    "completeCitation": "Birindelli A, Sartelli M, Di Saverio S, et al. 2017 update of the WSES guidelines for emergency repair of complicated abdominal wall hernias. World J Emerg Surg. 2017;12:37. doi:10.1186/s13017-017-0149-y.",
    "organizationOrJournal": "World Society of Emergency Surgery; World Journal of Emergency Surgery",
    "authors": [
      "Arianna Birindelli",
      "Massimo Sartelli",
      "Salomone Di Saverio",
      "Federico Coccolini",
      "Fausto Catena",
      "World Society of Emergency Surgery guideline group"
    ],
    "publicationYear": 2017,
    "doi": "10.1186/s13017-017-0149-y",
    "pmid": "28804507",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5545868/",
    "accessedOn": "2026-08-06",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Use with attribution for independently written factual synthesis. Do not reproduce recommendation tables, algorithms, figures, or extended prose.",
    "authorityAssessment": "Professional-society guidance supporting synthetic mesh in selected clean-contaminated abdominal-wall hernia repair after bowel intervention when gross enteric spillage is absent.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.ventral-hernia.controlled-enterotomy-selected-single-stage-repair",
      "claim.ventral-hernia.controlled-contamination-macroporous-synthetic-mesh",
      "claim.ventral-hernia.enterotomy-mesh-selection-safety-boundary",
      "claim.n4.e22669366268",
      "claim.n4.8e30265aebbd",
      "claim.n4.4b2bd6d4bf88"
    ]
  }
];

export const QUESTION_NEW_N4_SOURCE_LINKS = [
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.18aaf3012d26",
    "sourceId": "source.acg.celiac-patient-education.2026",
    "label": "Celiac Disease",
    "href": "https://gi.org/topics/celiac-disease/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.25e5275c1633",
    "sourceId": "source.acg.upper-gastrointestinal-ulcer-bleeding-guideline.2021",
    "label": "ACG Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding",
    "href": "https://pubmed.ncbi.nlm.nih.gov/33929377/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.72643a85a580",
    "sourceId": "source.aga.subepithelial-lesions.2022",
    "label": "AGA Clinical Practice Update on Management of Subepithelial Lesions Encountered During Routine Endoscopy: Expert Review",
    "href": "https://gastro.org/clinical-guidance/management-of-subepithelial-lesions-sel-encountered-during-routine-endoscopy/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.9513374ebe44",
    "sourceId": "source.asbrs.axilla.2026",
    "label": "Management of the axilla",
    "href": "https://www.breastsurgeons.org/docs/statements/asbrs-management-of-the-axilla-2026-02-24.pdf",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.66d3bfbdc72b",
    "sourceId": "source.asge.subepithelial-lesions.2017",
    "label": "The role of endoscopy in subepithelial lesions of the GI tract",
    "href": "https://www.asge.org/home/resources/publications/guidelines/the-role-of-endoscopy-in-subepithelial-lesions-of-the-gi-tract",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.02eaebf1d412",
    "sourceId": "source.bread-butter.bifa-high-output-stoma-2023",
    "label": "Managing a High Output Stoma",
    "href": "https://www.bapen.org.uk/pdfs/bifa/bifa-top-tips-series-1-updated.pdf",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.4947ad508f71",
    "sourceId": "source.bread-butter.bifa-oral-rehydration-2025",
    "label": "The Use of Oral Rehydration Solutions for the Management of High Output Stomas and Fistulas",
    "href": "https://www.bapen.org.uk/pdfs/bifa/bifa-top-tips-series-30.pdf",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.37f1abe910e8",
    "sourceId": "source.bread-butter.idsa-ssti-2014-wound",
    "label": "Practice Guidelines for the Diagnosis and Management of Skin and Soft Tissue Infections: 2014 Update",
    "href": "https://www.idsociety.org/practice-guideline/skin-and-soft-tissue-infections/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.57e61aed11ae",
    "sourceId": "source.brief.acg-eoe-2025",
    "label": "ACG Clinical Guideline: Diagnosis and Management of Eosinophilic Esophagitis",
    "href": "https://gi.org/journals-publications/ebgi/eluri_feb2025/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.fad6fb90422c",
    "sourceId": "source.brief.acg-eoe-patient",
    "label": "Eosinophilic Esophagitis",
    "href": "https://gi.org/topics/eosinophilic-esophagitis/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.aacaa129f6f8",
    "sourceId": "source.ehs.emergency-ventral-incisional-hernia.2026",
    "label": "EHS Guidelines on the Management of Primary Ventral and Incisional Hernias Under Emergency Conditions",
    "href": "https://www.frontierspartnerships.org/journals/journal-of-abdominal-wall-surgery/articles/10.3389/jaws.2026.16228/full",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.66c6cc8ab735",
    "sourceId": "source.esge.peptic-ulcer-bleeding-guideline.2026",
    "label": "Endoscopic diagnosis and management of peptic ulcer bleeding: European Society of Gastrointestinal Endoscopy (ESGE) Guideline - Update 2026",
    "href": "https://pubmed.ncbi.nlm.nih.gov/42127996/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.cfe0a7119530",
    "sourceId": "source.esge.subepithelial-lesions.2022",
    "label": "Endoscopic management of subepithelial lesions including neuroendocrine neoplasms: European Society of Gastrointestinal Endoscopy (ESGE) Guideline",
    "href": "https://www.esge.com/assets/downloads/pdfs/guidelines/2022_a-1751-5742.pdf",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.8d47bcc457e9",
    "sourceId": "source.essr.soft-tissue-imaging.2024",
    "label": "Soft tissue tumor imaging in adults: European Society of Musculoskeletal Radiology-Guidelines 2023-overview, and primary local imaging: how and where?",
    "href": "https://link.springer.com/article/10.1007/s00330-023-10425-5",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.ed10290a9ad5",
    "sourceId": "source.expansion.nhlbi-pad-diagnosis-2022",
    "label": "Peripheral Artery Disease — Diagnosis",
    "href": "https://www.nhlbi.nih.gov/health/peripheral-artery-disease/diagnosis",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.f0452754e2fa",
    "sourceId": "source.expansion.sbacv-pad-2024",
    "label": "Brazilian Society of Angiology and Vascular Surgery guidelines on peripheral artery disease",
    "href": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11530000/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.ad4dc6c1034a",
    "sourceId": "source.gs028g.babakhanlou-stoma-2022",
    "label": "Stoma-related complications and emergencies",
    "href": "https://link.springer.com/article/10.1186/s12245-022-00421-9",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.63a424264163",
    "sourceId": "source.gs028g.ehs-incisional-hernia-2023",
    "label": "Midline incisional hernia guidelines: the European Hernia Society",
    "href": "https://www.britishherniasociety.org/wp-content/uploads/2023/10/MIDLINEGUIDLINES.pdf",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.cc47784e7fae",
    "sourceId": "source.gs028g.parini-misstow-ses-2023",
    "label": "Surgical management of ostomy complications: a MISSTO–WSES mapping review",
    "href": "https://link.springer.com/article/10.1186/s13017-023-00516-5",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.0bea6ee8ccb5",
    "sourceId": "source.gs028g.ramirez-subtotal-2023",
    "label": "State of the art in subtotal cholecystectomy: an overview",
    "href": "https://www.frontiersin.org/journals/surgery/articles/10.3389/fsurg.2023.1142579/full",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.051b641f6e9a",
    "sourceId": "source.gs028g.wses-cholecystitis-2020",
    "label": "2020 World Society of Emergency Surgery updated guidelines for the diagnosis and treatment of acute calculus cholecystitis",
    "href": "https://link.springer.com/article/10.1186/s13017-020-00336-x",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.b76d60a80775",
    "sourceId": "source.mesh.wses-sise-2018",
    "label": "WSES/SIS-E skin and soft-tissue infection consensus",
    "href": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6295010/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.f6ba4844f89d",
    "sourceId": "source.nci.soft-tissue-sarcoma-pdq.2025",
    "label": "Soft Tissue Sarcoma Treatment, Health Professional Version",
    "href": "https://www.cancer.gov/types/soft-tissue-sarcoma/hp/adult-soft-tissue-treatment-pdq",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.b203af2b4bd9",
    "sourceId": "source.niddk.celiac-diagnosis.2020",
    "label": "Diagnosis of Celiac Disease",
    "href": "https://www.niddk.nih.gov/health-information/digestive-diseases/celiac-disease/diagnosis",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.0f6ffc73f37c",
    "sourceId": "source.niddk.celiac-tests.2021",
    "label": "Celiac Disease Tests",
    "href": "https://www.niddk.nih.gov/health-information/professionals/clinical-tools-patient-management/digestive-diseases/celiac-disease-health-care-professionals?dkrd=www2.niddk.nih.gov",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.ed63da20d3cd",
    "sourceId": "source.ostomy.missto-wses-2023",
    "label": "MISSTO-WSES mapping review of ostomy complications",
    "href": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10563348/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.9025012ce5ef",
    "sourceId": "source.parastomal.ehs-2018",
    "label": "EHS parastomal hernia guidelines",
    "href": "https://europeanherniasociety.eu/european-hernia-society-guidelines-on-prevention-and-treatment-of-parastomal-hernias/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.3316f881fdc0",
    "sourceId": "source.parastomal.nursing-2025",
    "label": "Nursing interventions for parastomal hernia or bulge",
    "href": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12181155/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.c84b84c41adc",
    "sourceId": "source.pediatric-clinic.cornwall-surgery-2025",
    "label": "Paediatric Surgery",
    "href": "https://rms.cornwall.nhs.uk/rms/primary_care_clinical_referral_criteria/rms/primary_care_clinical_referral_criteria/paediatrics/paediatric_surgery",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.d5c1667e4038",
    "sourceId": "source.pediatric-clinic.cua-puc-testis-2017",
    "label": "Canadian Urological Association-Pediatric Urologists of Canada (CUA-PUC) guideline for the diagnosis, management, and followup of cryptorchidism",
    "href": "https://cuaj.ca/index.php/journal/article/view/4585",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.a693714b0d74",
    "sourceId": "source.pediatric-clinic.cuh-testis-2025",
    "label": "Undescended testes and orchidopexy surgery - in children",
    "href": "https://www.cuh.nhs.uk/patient-information/undescended-testes-and-surgery-in-children/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.846cee77e83b",
    "sourceId": "source.pediatric-clinic.metzger-pilonidal-2021",
    "label": "Principles in treating pediatric patients with pilonidal disease - An expert perspective",
    "href": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8040102/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.eef48b3fa6ee",
    "sourceId": "source.qq20261028.wocn-peristomal",
    "label": "Peristomal Skin Assessment Guide for Clinicians",
    "href": "https://psag.wocn.org/index.html",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.78bd019e239d",
    "sourceId": "source.qq20261102a.eado2024",
    "label": "European consensus-based interdisciplinary guideline for melanoma. Part 1: Diagnostics - Update 2024",
    "href": "https://eado.org/files/2025/01/2024-EADO-CMGuideline-Diagnostics-EJC.pdf",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.03c714a148e8",
    "sourceId": "source.qq20261102a.esge-ulcer",
    "label": "Endoscopic diagnosis and management of peptic ulcer bleeding: ESGE Guideline - Update 2026",
    "href": "https://www.esge.com/assets/downloads/pdfs/guidelines/2026_a-2863-8314.pdf",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.15f33b101904",
    "sourceId": "source.qq20261102a.nci-melanoma",
    "label": "Melanoma Treatment (PDQ), Health Professional Version",
    "href": "https://www.cancer.gov/types/skin/hp/melanoma-treatment-pdq",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.854b908ea080",
    "sourceId": "source.qq20261102b.cco-melanoma",
    "label": "CCO melanoma excision and sentinel-node guideline",
    "href": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6726255/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.9c62b38aa9f1",
    "sourceId": "source.qq20261102b.essr2015",
    "label": "Soft Tissue Tumors in Adults: ESSR-Approved Guidelines for Diagnostic Imaging",
    "href": "https://pure.amsterdamumc.nl/ws/files/173173752/Soft-tissue-tumors-in-adults-essr-approved-guidelines-for-diagnostic-imaging.pdf",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.31c35553f9ff",
    "sourceId": "source.qq20261102b.seom2024",
    "label": "SEOM-GEIS Spanish clinical guidelines for the management of soft-tissue sarcomas (2024)",
    "href": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12000159/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.bd94d8db2f0b",
    "sourceId": "source.qq20261102c.esge-ulcer2026",
    "label": "ESGE peptic-ulcer bleeding guideline update",
    "href": "https://www.esge.com/assets/downloads/pdfs/guidelines/2026_a-2863-8314.pdf",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.a8ba7299d03a",
    "sourceId": "source.qq20261102c.essr2023",
    "label": "Soft tissue tumor imaging in adults: European Society of Musculoskeletal Radiology-Guidelines 2023-overview, and primary local imaging: how and where?",
    "href": "https://link.springer.com/article/10.1007/s00330-023-10425-5",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.f6fa9aa1ee7d",
    "sourceId": "source.qq20261102c.sel2022",
    "label": "Endoscopic management of subepithelial lesions including neuroendocrine neoplasms: ESGE Guideline",
    "href": "https://www.esge.com/assets/downloads/pdfs/guidelines/2022_a-1751-5742.pdf",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.d8475abe6f28",
    "sourceId": "source.qq20261102d.sel2022",
    "label": "Endoscopic management of subepithelial lesions including neuroendocrine neoplasms: ESGE Guideline",
    "href": "https://www.esge.com/assets/downloads/pdfs/guidelines/2022_a-1751-5742.pdf",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.c73bf296a1bf",
    "sourceId": "source.qq20261102f.esmo2025",
    "label": "ESMO cutaneous melanoma guideline",
    "href": "https://doi.org/10.1016/j.annonc.2024.11.006",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.de49925016a7",
    "sourceId": "source.qq20261102f.nci-melanoma",
    "label": "Melanoma Treatment (PDQ), Health Professional Version",
    "href": "https://www.cancer.gov/types/skin/hp/melanoma-treatment-pdq",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.449abb0b9805",
    "sourceId": "source.rosen.contaminated-ventral-hernia-rct.2022",
    "label": "Biologic vs Synthetic Mesh for Single-stage Repair of Contaminated Ventral Hernias: A Randomized Clinical Trial",
    "href": "https://jamanetwork.com/journals/jamasurgery/fullarticle/2788222",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.6ee5ef480571",
    "sourceId": "source.sages.laparoscopic-ventral-hernia.2016",
    "label": "SAGES guidelines for laparoscopic ventral hernia repair",
    "href": "https://www.sages.org/publications/guidelines/guidelines-for-laparoscopic-ventral-hernia-repair/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.47dbd58868dc",
    "sourceId": "source.stoma.acpgbi-2021",
    "label": "ACPGBI emergency colorectal surgery consensus guideline",
    "href": "https://pubmed.ncbi.nlm.nih.gov/33470518/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.99d5a5a5a87f",
    "sourceId": "source.variety3.esge-barrett-2023",
    "label": "Diagnosis and management of Barrett esophagus: ESGE Guideline",
    "href": "https://www.esge.com/assets/downloads/pdfs/guidelines/2023_a-2176-2440.pdf",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.4e3b1687a865",
    "sourceId": "source.variety3.esge-polypectomy-2024",
    "label": "Colorectal polypectomy and endoscopic mucosal resection: ESGE Guideline - Update 2024",
    "href": "https://www.esge.com/assets/downloads/pdfs/guidelines/2024_a-2304-3219.pdf",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.59f29bd6c4b5",
    "sourceId": "source.variety3.niddk-barrett-diagnosis-2024",
    "label": "Diagnosis of Barrett's Esophagus",
    "href": "https://www.niddk.nih.gov/health-information/digestive-diseases/barretts-esophagus/diagnosis",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.4e9e36da2bf6",
    "sourceId": "source.vlu.esvs-cvd.2022",
    "label": "ESVS 2022 Clinical Practice Guidelines on Chronic Venous Disease of the Lower Limbs",
    "href": "https://esvs.org/guideline/chronic-venous-disease-of-lower-limbs/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "link.n4.36d9305342d5",
    "sourceId": "source.wses.complicated-abdominal-wall-hernia.2017",
    "label": "2017 update of the WSES guidelines for emergency repair of complicated abdominal wall hernias",
    "href": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5545868/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  }
];
