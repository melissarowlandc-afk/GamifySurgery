// Generated offline by tools/question-new-n1-round3/build-evidence.mjs. No new retrieval or clinical approval.
import type {ClinicalSource,EvidenceClaim} from "./pilot-schema";
export const QUESTION_NEW_N1_ROUND3_CLAIMS: EvidenceClaim[] = [
  {
    "statement": "After diagnostic imaging identifies an accessible suspicious solid breast mass, image-guided core biopsy can establish a tissue diagnosis before definitive excision planning.",
    "sourceIds": [
      "source.bread-butter.acr-palpable-breast-mass-2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "This pathway excludes clinically urgent infection and does not prescribe a particular imaging modality or biopsy device. Unchanged offline recorded statement; original check/access dates retained. Exact N1 round-two application and source currentness remain unverified.",
    "applicablePopulation": "Stable adults with an accessible solid breast mass categorized as suspicious on completed diagnostic imaging.",
    "lastCheckedOn": "2026-09-17",
    "contentVersion": "clinical.question-new-n1.2026-11-04.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r2.4ffb2fc1fbe9"
  },
  {
    "statement": "An indirect inguinal hernia enters the inguinal canal through the deep ring lateral to the inferior epigastric vessels.",
    "sourceIds": [
      "source.bread-butter.picasso-groin-ultrasound-2021"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "high",
    "limitation": "The vessel relationship classifies anatomy but does not establish acuity or select a repair technique. Unchanged offline recorded statement; original check/access dates retained. Exact N1 round-two application and source currentness remain unverified.",
    "applicablePopulation": "Adults whose operative or imaging report directly describes a groin hernia's relationship to the inferior epigastric vessels.",
    "lastCheckedOn": "2026-09-17",
    "contentVersion": "clinical.question-new-n1.2026-11-04.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r2.1c9136f72fb2"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.d2d731b45c78",
    "statement": "Fine pleomorphic or fine linear or fine linear-branching calcifications are suspicious morphologies, and a linear or segmental distribution can add concern when interpreted with morphology and the complete examination.",
    "sourceIds": [
      "source.acr.birads-mammography-summary.2025",
      "source.nci.mammograms.2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "No morphology or distribution descriptor independently establishes cancer. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Adults whose mammographic assessment includes breast calcifications.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.6709782fef79",
    "statement": "Vascular, large rod-like, rim, layering, and coarse densely calcified patterns are among calcification appearances categorized as typically benign in the current mammography lexicon.",
    "sourceIds": [
      "source.acr.birads-mammography-summary.2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "The classification belongs within the complete radiologist assessment and cannot override other suspicious findings. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Adults whose mammographic assessment includes breast calcifications.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.640146b1029b",
    "statement": "Mammographic mass density is one descriptor and must be interpreted with shape, margin, associated features, comparison imaging, and the final radiologist assessment rather than being used alone to diagnose or exclude malignancy.",
    "sourceIds": [
      "source.acr.birads-mammography-summary.2025",
      "source.nci.mammograms.2025"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "high",
    "limitation": "The approved questions do not assign a final BI-RADS category from density alone. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Adults whose diagnostic mammogram includes a described breast mass.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.25cb8cbda68e",
    "statement": "An irregular mammographic mass with a spiculated margin is a concerning morphologic combination that warrants suspicious assessment rather than benign reassurance.",
    "sourceIds": [
      "source.acr.birads-mammography-summary.2025",
      "source.nci.mammograms.2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "Imaging morphology raises or lowers concern but is not itself a tissue diagnosis. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Adults undergoing diagnostic mammographic assessment of a breast mass.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.60fa5e6f41c7",
    "statement": "Suspicious breast imaging warrants the indicated diagnostic pathway and does not by itself establish a cancer diagnosis or authorize cancer-directed surgery without tissue diagnosis.",
    "sourceIds": [
      "source.nci.mammograms.2025"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "high",
    "limitation": "This package teaches imaging-feature recognition only; biopsy technique and cancer treatment are separate concepts. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Adults with breast imaging assessed as suspicious or highly suggestive of malignancy.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.ce34a3a54ed6",
    "statement": "For a woman age 30 to 39 with a new palpable breast mass, diagnostic mammography or tomosynthesis and targeted breast ultrasound are appropriate components of the initial diagnostic imaging evaluation.",
    "sourceIds": [
      "source.acr.palpable-breast-masses.2022-update"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "Only one adequate authoritative source is mapped. The exact combined-order question wording and distractors remain pending named-clinician review. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Nonpregnant, nonlactating, average-risk adult women age 30 to 39 with a new persistent palpable breast mass and no overt inflammatory findings.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.041c942faf2d",
    "statement": "A deep partial-thickness burn involving the hand warrants burn-center consultation for transfer planning.",
    "sourceIds": [
      "source.burn.aba-referral-2022"
    ],
    "evidenceCategory": "disposition",
    "certainty": "moderate",
    "limitation": "Consultation and transfer are distinct decisions shaped by the receiving center and local resources. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Adults with deep partial-thickness hand burns.",
    "lastCheckedOn": "2026-09-28"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.8e0e2cdeb284",
    "statement": "Deep partial-thickness burns tend to be paler or drier, less blanching, and less sensate; full-thickness burns are dry or leathery, nonblanching, and insensate.",
    "sourceIds": [
      "source.burn.aba-referral-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Burn depth can be mixed or evolve. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Adults with thermal burns.",
    "lastCheckedOn": "2026-09-28"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.7be9fe6e82d2",
    "statement": "Burn-center consultation or transfer depends on depth, extent, special location, mechanism, inhalation concern, comorbidity, pain, local resources, and associated trauma; consultation does not make every small burn an automatic transfer.",
    "sourceIds": [
      "source.burn.aba-referral-2022",
      "source.burn.aha-redcross-2024"
    ],
    "evidenceCategory": "disposition",
    "certainty": "moderate",
    "limitation": "No unsourced numeric threshold or general treatment algorithm is taught. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Adults with burns evaluated in a general clinic or emergency handoff.",
    "lastCheckedOn": "2026-09-28"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.f4db77ade866",
    "statement": "A superficial partial-thickness burn is typically moist, red, blanching, blistered, and very painful; depth can evolve and requires reassessment.",
    "sourceIds": [
      "source.burn.aba-referral-2022",
      "source.burn.aha-redcross-2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Individual findings are interpreted together rather than as absolute rules. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Adults with thermal burns.",
    "lastCheckedOn": "2026-09-28"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.5294d3feead5",
    "statement": "In a usual adult pathway, positive compatible serology leads to upper endoscopy with duodenal biopsies for diagnostic confirmation.",
    "sourceIds": [
      "source.niddk.celiac-tests.2021",
      "source.niddk.celiac-diagnosis.2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "This does not assert that every adult in every setting must undergo biopsy. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Adults with positive celiac serology and adequate total IgA in a routine diagnostic pathway.",
    "lastCheckedOn": "2026-09-09"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.87469918a5c7",
    "statement": "Starting gluten avoidance before diagnostic testing can alter serologic and biopsy results.",
    "sourceIds": [
      "source.niddk.celiac-tests.2021",
      "source.niddk.celiac-diagnosis.2020",
      "source.acg.celiac-patient-education.2026"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "high",
    "limitation": "The content does not prescribe a gluten challenge. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "People undergoing evaluation for possible celiac disease.",
    "lastCheckedOn": "2026-09-09"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.101c4b1dec35",
    "statement": "HLA-DQ2 and HLA-DQ8 typing addresses genetic susceptibility and does not by itself establish active celiac disease.",
    "sourceIds": [
      "source.niddk.celiac-tests.2021"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "This claim does not specify test performance or every clinical use of HLA typing. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "People undergoing evaluation for possible celiac disease.",
    "lastCheckedOn": "2026-09-09"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.50691038a9ee",
    "statement": "IgG-based celiac serology has a limited diagnostic role when IgA deficiency makes IgA-based tests unreliable.",
    "sourceIds": [
      "source.niddk.celiac-tests.2021"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "This does not make an IgG panel the preferred routine first test before total IgA context is known. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "People evaluated for celiac disease when IgA deficiency is present or suspected.",
    "lastCheckedOn": "2026-09-09"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.8a59fd5f0d78",
    "statement": "While a patient is eating gluten, tTG-IgA together with total-IgA context is a usual initial serologic assessment for suspected celiac disease.",
    "sourceIds": [
      "source.niddk.celiac-tests.2021",
      "source.niddk.celiac-diagnosis.2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "IgA deficiency changes test selection; serology is not presented as universally definitive. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Adults with compatible symptoms who remain on gluten during diagnostic evaluation.",
    "lastCheckedOn": "2026-09-09"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.41c158e0d466",
    "statement": "Suspected postoperative chylous ascites requires diagnostic fluid sampling with triglyceride measurement and studies directed at infection and other plausible postoperative leaks rather than diagnosis from imaging appearance alone.",
    "sourceIds": [
      "source.al-busafi.chylous-ascites-review.2014",
      "source.bhardwaj.chylous-ascites-review.2018"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The exact ancillary fluid studies depend on the operation and differential diagnosis. This approved concept does not teach an unsourced universal numeric triglyceride cutoff. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Stable postoperative adults with newly identified ascites and suspected lymphatic leakage.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.8a0b5986a99c",
    "statement": "Cross-sectional imaging can demonstrate and localize ascites but cannot by appearance alone establish that the fluid is chylous.",
    "sourceIds": [
      "source.bhardwaj.chylous-ascites-review.2018"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Imaging remains useful for extent, associated pathology, and procedural planning; this claim addresses fluid composition rather than overall imaging utility. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Adults with postoperative intraperitoneal fluid under evaluation for possible chylous ascites.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "statement": "In the approved population, adding prophylactic splenectomy increases operative morbidity while spleen preservation maintains oncologic survival.",
    "sourceIds": [
      "source.korean-gastric-cancer-guideline.2024",
      "source.japanese-gastric-cancer-guideline.2021",
      "source.jcog0110.prophylactic-splenectomy.2017"
    ],
    "evidenceCategory": "management",
    "certainty": "high",
    "limitation": "The package does not teach exact complication rates or substitute this population-level result for individualized operative planning. Unchanged offline recorded statement; original check/access dates retained. Exact N1 round-two application and source currentness remain unverified.",
    "applicablePopulation": "Adults in the approved proximal-gastric-cancer operative population.",
    "lastCheckedOn": "2026-08-06",
    "contentVersion": "clinical.question-new-n1.2026-11-04.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r2.53fd4a912f74"
  },
  {
    "statement": "Routine prophylactic splenectomy does not improve survival during curative gastrectomy for resectable proximal gastric adenocarcinoma without greater-curvature invasion, direct splenic invasion, or suspected splenic-hilar disease.",
    "sourceIds": [
      "source.korean-gastric-cancer-guideline.2024",
      "source.japanese-gastric-cancer-guideline.2021",
      "source.jcog0110.prophylactic-splenectomy.2017"
    ],
    "evidenceCategory": "management",
    "certainty": "high",
    "limitation": "This claim applies to prophylactic splenectomy in the defined proximal-gastric-cancer population and must not be generalized to every gastric tumor or to a therapeutic splenectomy indication. Unchanged offline recorded statement; original check/access dates retained. Exact N1 round-two application and source currentness remain unverified.",
    "applicablePopulation": "Adults undergoing curative resection for proximal gastric adenocarcinoma without greater-curvature invasion, splenic invasion, or suspected splenic-hilar disease.",
    "lastCheckedOn": "2026-08-06",
    "contentVersion": "clinical.question-new-n1.2026-11-04.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r2.60c60d811db1"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.5b207d0586d5",
    "statement": "The spleen-preservation teaching point is not a rule that splenectomy is never appropriate; direct splenic invasion, greater-curvature invasion, or suspected splenic-hilar disease falls outside the approved routine-prophylaxis scenario.",
    "sourceIds": [
      "source.korean-gastric-cancer-guideline.2024",
      "source.japanese-gastric-cancer-guideline.2021",
      "source.jcog0110.prophylactic-splenectomy.2017"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "high",
    "limitation": "Falling outside this scope does not by itself prescribe splenectomy; the specific operative decision remains separately authored clinical content. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Adults being evaluated for curative proximal gastric-cancer surgery.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.b718f6a72a97",
    "statement": "Gastroparesis is diagnosed in a patient with compatible upper gastrointestinal symptoms by documenting objectively delayed gastric emptying after mechanical obstruction has been excluded.",
    "sourceIds": [
      "source.acg.gastroparesis-guideline.2022",
      "source.aga.gastroparesis-guideline.2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "Compatible symptoms alone are not diagnostic, and this concept assumes that an appropriate prior evaluation has already excluded mechanical obstruction. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Adults with chronic nausea, vomiting, early satiety, or postprandial fullness and no demonstrated mechanical gastric-outlet obstruction.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.e7e333d36883",
    "statement": "Four-hour solid-meal gastric emptying scintigraphy is the preferred objective study in this concept for suspected gastroparesis after mechanical obstruction has been excluded.",
    "sourceIds": [
      "source.acg.gastroparesis-guideline.2022",
      "source.aga.gastroparesis-guideline.2025",
      "source.acg.gastroparesis-patient-information.2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The 2022 ACG guideline recommends solid-meal scintigraphy for at least three hours, while the 2025 AGA guideline specifically favors four-hour testing over studies lasting two hours or less. This concept does not teach an exact abnormal-retention cutoff. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Adults undergoing objective evaluation for suspected gastroparesis after mechanical obstruction has been excluded.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.55ab54b0240a",
    "statement": "Upper endoscopy can help exclude mechanical obstruction but does not replace objective gastric emptying measurement; esophageal manometry and ambulatory pH monitoring evaluate different physiologic questions.",
    "sourceIds": [
      "source.acg.gastroparesis-guideline.2022"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "high",
    "limitation": "Other validated gastric-emptying modalities may have selected roles. They are not taught or used as false distractors in this narrowly approved scintigraphic-testing concept. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Adults undergoing outpatient evaluation for suspected gastroparesis.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "id": "claim.n1.25d060186678",
    "statement": "RAI is a nonsurgical, disease-directed treatment that destroys overactive\nthyroid cells. Antithyroid drugs reduce thyroid-hormone production, while\nbeta-blocking medicines can control symptoms without reducing hormone\nproduction.",
    "sourceIds": [
      "source.eanm.benign-thyroid-rai-guideline.2023",
      "source.niddk.graves-disease.2021"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "distinguishes the broad roles of these options for the\n  counseling question; it does not specify a dose, preparation regimen,\n  treatment timeline, or universal treatment preference. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Stable nonpregnant, nonbreastfeeding adults with established Graves disease and no active thyroid eye disease who are considering treatment options.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "statement": "Current breastfeeding contraindicates therapeutic iodine-131 treatment for a\npatient with Graves disease.",
    "sourceIds": [
      "source.eanm.benign-thyroid-rai-guideline.2023",
      "source.lactmed.sodium-iodide-i131.2026",
      "source.ata.radioactive-iodine.undated"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "applies to therapeutic iodine-131; it does not prohibit\n  counseling, referral, or individualized endocrine and pediatric guidance. Unchanged offline recorded statement; original check/access dates retained. Exact N1 round-two application and source currentness remain unverified.",
    "applicablePopulation": "Adults currently breastfeeding who have Graves disease and are being counseled about therapeutic iodine-131.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "clinical.question-new-n1.2026-11-04.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r2.6d89da8ecd7a"
  },
  {
    "id": "claim.n1.dae1a9bf76fe",
    "statement": "A low TSH result with a high free T4 result is a biochemical pattern of thyroid\nhormone excess; those functional results do not by themselves identify Graves\ndisease as the cause.",
    "sourceIds": [
      "source.ata.thyroid-function-tests.undated"
    ],
    "evidenceCategory": "presentation",
    "certainty": "moderate",
    "limitation": "qualitative functional context only; this draft does\n  not teach thresholds, severity classification, or a treatment decision. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Adults with compatible clinical findings and biochemical thyrotoxicosis undergoing etiologic evaluation.",
    "lastCheckedOn": "2026-09-09",
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null
  },
  {
    "statement": "When reduced plasma bicarbonate suggests metabolic acidosis, blood-gas assessment confirms the acidemia and identifies respiratory or mixed acid-base contributions.",
    "sourceIds": [
      "source.french-panel.metabolic-acidosis.2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "R1.1 is expert opinion; arterial sampling is not claimed universally superior. Unchanged offline recorded statement; original check/access dates retained. Exact N1 round-two application and source currentness remain unverified.",
    "applicablePopulation": "Adults with reduced plasma bicarbonate and suspected metabolic acidosis.",
    "lastCheckedOn": "2026-10-03",
    "contentVersion": "clinical.question-new-n1.2026-11-04.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r2.94bfa8e95e0e"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.6bcc3f0847f4",
    "statement": "Peritoneal CO2 absorption adds a CO2 load; when pulmonary elimination does not match that load, blood CO2 can rise and produce respiratory acidemia.",
    "sourceIds": [
      "source.jcm.laparoscopic-anesthesia-review.2020",
      "source.jroboticsurg.pneumoperitoneum-acid-base-study.2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "Ventilation and respiratory mechanics also affect blood CO2. The current observational study cannot establish every mechanistic contribution; these cases supply completed-care records rather than asking the clinic to select ventilator settings or manage live hypercarbia. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Adults reviewing a resolved CO2-associated event in an outside anesthesia record.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.1d724576493f",
    "statement": "Mixing studies are incompletely standardized, cannot by themselves establish or exclude acquired hemophilia A, and should not replace appropriate parallel factor assays.",
    "sourceIds": [
      "source.gs028e.tiede_mixing2020",
      "source.gs028e.czempik_mixing2020"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "high",
    "limitation": "No universal correction threshold or isolated-aPTT bleeding-risk estimate is inferred. Interpretation remains tied to the laboratory method and clinical context. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Adults with an outside specialist workup of an unexplained prolonged aPTT.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.5e25f9e918c6",
    "statement": "An aPTT mixing study evaluates the aPTT response after combining patient plasma with normal plasma; immediate and incubated assessments can reveal different inhibitory patterns.",
    "sourceIds": [
      "source.gs028e.tiede_mixing2020",
      "source.gs028e.czempik_mixing2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "Qualitative method only. No mixing ratio, incubation duration, temperature or correction threshold is specified. Neither platelet testing nor a patient-only repeat is that plasma comparison. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Stable adults reviewing the purpose or method of an outside specialist mixing assessment.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.b02be3363804",
    "statement": "Initial correction followed by loss of correction after incubation can indicate a time-dependent inhibitor; immediate correction alone does not exclude that possibility.",
    "sourceIds": [
      "source.gs028e.tiede_mixing2020",
      "source.gs028e.czempik_mixing2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "No exact incubation period, temperature, ratio or laboratory cutoff is authored. A qualitative pattern suggests a mechanism and requires appropriate factor/inhibitor assessment; it is not a definitive diagnosis. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Adults reviewing immediate versus incubated results from a specialist coagulation laboratory.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "statement": "A cancer metastasis retains the identity of its established primary cancer; its new anatomic location does not by itself make it a primary cancer of that organ.",
    "sourceIds": [
      "source.gs028f.nci_metastatic2026"
    ],
    "evidenceCategory": "definition",
    "certainty": "high",
    "limitation": "Current NCI explanation directly supports primary identity and naming after metastatic spread. The cases give a specialist pathology comparison confirming the relationship to a known cutaneous primary. No unknown-primary ranking, diagnosis from one stain, melanoma subtype inference or management decision. Unchanged offline recorded statement; original check/access dates retained. Exact N1 round-two application and source currentness remain unverified.",
    "applicablePopulation": "Adults reviewing a confirmed metastasis from a supplied known primary.",
    "lastCheckedOn": "2026-10-07",
    "contentVersion": "clinical.question-new-n1.2026-11-04.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r2.a6defa925838"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.dae72efb5f1b",
    "statement": "Core needle biopsy may be appropriate for selected neck masses when the tissue or ancillary testing needed is not adequately supplied by fine-needle aspiration.",
    "sourceIds": [
      "source.gs028f.uk.head-neck-guidelines.2024"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "high",
    "limitation": "Single guideline; core is acknowledged in feedback and is never an incorrect alternative to FNA. The cases do not ask for lymphoma-specific sampling or prescribe open biopsy after a fixed number of attempts. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Specialist-assessed neck masses with technique selection based on pathology requirements.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.6b82036e466c",
    "statement": "Cross-sectional neck imaging characterizes anatomy, whereas cell or tissue sampling supplies the material for a cytological or histological diagnosis of an undiagnosed suspicious neck mass.",
    "sourceIds": [
      "source.gs028f.uk.head-neck-guidelines.2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "Single guideline's independently synthesized distinction between imaging and needle-sampling roles. A supplied CT description does not substitute for a tissue specimen; no universal sequence or guaranteed sampling result is claimed. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Adults with an imaged but still undiagnosed suspicious cervical mass.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.f0828e8bc9b1",
    "statement": "After appropriate assessment of an undiagnosed at-risk adult neck mass, fine-needle aspiration is an appropriate initial needle-sampling approach; open incisional or excisional biopsy should not replace the initial needle approach.",
    "sourceIds": [
      "source.gs028f.uk.head-neck-guidelines.2024"
    ],
    "evidenceCategory": "management",
    "certainty": "high",
    "limitation": "Single independent guideline. FNA is the best offered needle option, not universally preferable to core biopsy. The game action is specialist referral, not a fabricated local generic-FNA procedure or a complete cancer-workup sequence. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Adults with an assessed, undiagnosed suspicious cervical mass requiring an initial needle sample.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.47d310305029",
    "statement": "Reduced hemoglobin can reduce blood oxygen-carrying content even when the remaining hemoglobin has a normal oxygen saturation, so a normal SpO2 alone does not exclude anemia or establish adequate oxygen content.",
    "sourceIds": [
      "source.gs028f.nhlbi_anemia2025",
      "source.gs028f.fda_oximetry2024"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "high",
    "limitation": "Qualitative physiological inference from independently verified hemoglobin-carriage and saturation-fraction facts; FDA device background also describes reduced oxygen-carrying ability in anemia. Other determinants of tissue oxygen delivery are not assessed. No numeric content equation, hemoglobin threshold or treatment decision. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Stable adults with established anemia discussing an outside blood-count result.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.05bd95260a85",
    "statement": "An ordinary pulse-oximeter display can report oxygen saturation and pulse rate, sometimes with signal strength; those displayed values do not provide a hemoglobin concentration.",
    "sourceIds": [
      "source.gs028f.fda_oximeter2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "FDA 2025 consumer page is the sole direct source for ordinary clip display fields. Cases explicitly supply those fields only. This does not claim that every specialized multi-parameter device lacks additional functions, and it does not order a new blood test. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Adults interpreting supplied ordinary pulse-oximeter display values.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.39e090dfc4f0",
    "statement": "Hemoglobin in red blood cells carries oxygen, and its blood concentration is a separate quantity from the percentage oxygen saturation.",
    "sourceIds": [
      "source.gs028f.nhlbi_anemia2025",
      "source.gs028f.fda_oximetry2024"
    ],
    "evidenceCategory": "definition",
    "certainty": "high",
    "limitation": "NHLBI December 2025 CBC explanation verifies hemoglobin carriage; FDA background verifies saturation's proportional meaning. Original qualitative comparison, without a numeric anemia threshold, race-specific reference range, transfusion indication or claim about cardiac output. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Adults with a supplied outside hemoglobin result and saturation reading.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.c3c167a7739f",
    "statement": "Pulse-oximeter SpO2 estimates the proportion of hemoglobin oxygen-binding capacity occupied by oxygen, expressed as a percentage.",
    "sourceIds": [
      "source.gs028f.fda_oximetry2024",
      "source.gs028f.fda_oximeter2025"
    ],
    "evidenceCategory": "definition",
    "certainty": "high",
    "limitation": "FDA 2024 executive-summary Introduction supplies the hemoglobin-fraction explanation; FDA 2025 consumer page independently confirms the percentage estimate. SpO2 is an estimate with device limitations, not a direct measurement of blood oxygen content or tissue delivery. No formula or fixed normal threshold. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Adults interpreting an ordinary supplied pulse-oximeter reading.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.2682ba46b469",
    "statement": "Simple cholecystectomy may suffice after complete removal of margin-negative incidental T1a gallbladder carcinoma.",
    "sourceIds": [
      "source.gs028g.lee-gallbladder-guideline-2014",
      "source.gs028g.acs-gallbladder-surgery-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Older specialist guideline cross-checked against 2025 society guidance. This applies only to confirmed completely resected T1a disease; uncertain depth, positive margins, residual disease and T1b or deeper disease need a different specialist plan. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.49bbc47617f1",
    "statement": "Uncertain depth, positive margins or residual gallbladder carcinoma require a different specialist assessment.",
    "sourceIds": [
      "source.gs028g.lee-gallbladder-guideline-2014",
      "source.gs028g.acs-gallbladder-surgery-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Older specialist guideline cross-checked against 2025 society guidance. This applies only to confirmed completely resected T1a disease; uncertain depth, positive margins, residual disease and T1b or deeper disease need a different specialist plan. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.0edd7f3d0ae9",
    "statement": "Gallbladder carcinoma invading the muscular layer is T1b.",
    "sourceIds": [
      "source.gs028g.nci-gallbladder-pdq-2025",
      "source.gs028g.lee-gallbladder-guideline-2014"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Only the local pathologic T category is assigned; node status, metastasis and full stage grouping are not inferred from wall depth alone. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Adult synthetic perioperative or postoperative clinic encounters; no onsite hospital operation is simulated.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.a2f96b40428e",
    "statement": "Meeting standard Milan criteria supports transplant-center evaluation but does not by itself guarantee listing or transplantation; disease outside Milan criteria may still warrant specialist evaluation of other pathways.",
    "sourceIds": [
      "source.aasld.hcc-practice-guidance.2023",
      "source.aasld-ast.liver-transplant-candidate-evaluation.2026"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "high",
    "limitation": "This concept intentionally excludes AFP policy, downstaging selection, organ allocation, liver function, comorbid contraindications, and individualized treatment choice. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Learners applying standard Milan criteria without equating a tumor-burden classification with automatic listing or permanent exclusion.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.e0b6bc7a19dc",
    "statement": "Standard Milan classification requires no macrovascular invasion and no extrahepatic disease.",
    "sourceIds": [
      "source.aasld-ast.liver-transplant-candidate-evaluation.2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "Microscopic pathology, transplant-center assessment, tumor biology, and other candidacy factors are outside this narrow recognition concept. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Adults with confirmed hepatocellular carcinoma whose staging is being compared with standard Milan criteria.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.306f7180fb92",
    "statement": "Standard Milan tumor-burden criteria for hepatocellular carcinoma comprise one lesion measuring 1 through 5 cm, or two to three lesions each measuring 1 through 3 cm.",
    "sourceIds": [
      "source.aasld.hcc-practice-guidance.2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "This claim describes the standard tumor-number and size envelope; it is not a complete transplant-candidacy or organ-allocation rule. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Adults with confirmed hepatocellular carcinoma being considered for specialist liver-transplant evaluation.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.addcd31f93bb",
    "statement": "For the approved profile of a solitary HCC with preserved liver function, no clinically significant portal hypertension, adequate future liver remnant, and no macrovascular invasion or extrahepatic disease, hospital HPB-surgery referral for hepatic resection evaluation is the selected disposition.",
    "sourceIds": [
      "source.aasld.hcc-practice-guidance.2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "This is a deliberately favorable multiparametric profile, not a universal treatment rule for every solitary HCC or every person with Child-Pugh A cirrhosis. EASL 2025 metadata was not locally verifiable, so this package records the single-source limitation rather than inventing a second citation. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Adults represented by the owner-approved compensated-cirrhosis profiles in this package.",
    "lastCheckedOn": "2026-08-21"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.bf9e72bc7198",
    "statement": "Clinically significant portal hypertension is one selection consideration in the approved favorable resection profile.",
    "sourceIds": [
      "source.aasld.hcc-practice-guidance.2023"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "This package does not teach clinically significant portal hypertension as an absolute contraindication to every limited hepatic resection, nor does it make preserved liver function alone sufficient for selection. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Learners applying only the clear favorable-profile boundary in the approved cases.",
    "lastCheckedOn": "2026-08-21"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.589f16048c12",
    "statement": "A direct inguinal hernia protrudes through Hesselbach's triangle medial to the inferior epigastric vessels.",
    "sourceIds": [
      "source.review.inguinal-releasing-incisions.2023"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "The supporting source is a technical narrative review rather than a diagnostic-performance study. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Adults undergoing evaluation of direct inguinal operative anatomy.",
    "lastCheckedOn": "2026-07-30"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.ed07ff6b964e",
    "statement": "A direct inguinal defect involves weakness of the transversalis fascia in the posterior inguinal wall.",
    "sourceIds": [
      "source.review.inguinal-releasing-incisions.2023"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "This bounded statement does not define every component or variation of the posterior inguinal wall. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Adults with a direct inguinal defect encountered in operative anatomy.",
    "lastCheckedOn": "2026-07-30"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.5cdd738832f7",
    "statement": "Acute DVT, infection, recurrent malignancy, and systemic causes must be considered and investigated when the tempo or associated findings indicate them.",
    "sourceIds": [
      "source.lymphedema.isl-2023",
      "source.lymphedema.nci-pdq-current"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Testing is driven by the differential rather than ordered routinely for every stable case. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Adults with suspected or established secondary lymphedema.",
    "lastCheckedOn": "2026-09-28"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.89526aa237e7",
    "statement": "Chronic limb swelling after lymph-node or lymphatic-vessel treatment may represent secondary lymphedema when history and tissue findings are compatible.",
    "sourceIds": [
      "source.lymphedema.isl-2023",
      "source.lymphedema.nci-pdq-current"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "The diagnosis is not made solely from prior treatment history. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Adults with chronic limb swelling after lymphatic treatment.",
    "lastCheckedOn": "2026-09-28"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.a667976ba66d",
    "statement": "Simple diverticulectomy is an appropriate resection for a long, narrow Meckel diverticulum when uncomplicated inflammation is confined to the distal tip and the base and adjacent ileum are healthy.",
    "sourceIds": [
      "source.blouhos.meckel-adult-surgical-concerns.2018",
      "source.varcoe.short-meckel-heterotopic-mucosa.2004",
      "source.tree.meckel-diverticulectomy-multicentre.2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Macroscopic morphology does not perfectly predict heterotopic tissue. This claim does not extend to bleeding, tumor, obstruction, base perforation, or adjacent ileal disease. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Adolescent or adult patients with a symptomatic long, narrow Meckel diverticulum and inflammation confined to the distal tip.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.716431389a46",
    "statement": "For a symptomatic Meckel diverticulum, inflammation or disruption involving the diverticular base and adjacent ileum favors bowel-inclusive resection over simple diverticulectomy; segmental ileal resection is appropriate when adjacent ileum is involved.",
    "sourceIds": [
      "source.blouhos.meckel-adult-surgical-concerns.2018",
      "source.ding.perforated-meckel-adults.2012",
      "source.tree.meckel-diverticulectomy-multicentre.2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Wedge and segmental resection can both be reasonable in selected base-involved cases. The approved segmental-resection variants therefore specify adjacent ileal involvement rather than using base width alone. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Adolescent or adult patients with a symptomatic Meckel diverticulum identified during abdominal exploration.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.a10ad9a5021b",
    "statement": "No exact base-width measurement should be treated as a universal stand-alone rule for Meckel resection extent; disease location and the integrity of the base and adjacent ileum remain necessary operative context.",
    "sourceIds": [
      "source.blouhos.meckel-adult-surgical-concerns.2018",
      "source.ding.perforated-meckel-adults.2012",
      "source.varcoe.short-meckel-heterotopic-mucosa.2004",
      "source.tree.meckel-diverticulectomy-multicentre.2023",
      "source.park.mayo-meckel-1476.2005"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Morphology studies are retrospective and partly conflicting. Diverticulum length greater than 2 cm is a separate observation about symptomatic risk and must not be confused with a 2 cm base-width definition. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Patients with a Meckel diverticulum undergoing operative assessment.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r2.gas-record-interpretation",
    "statement": "In the constructed paired gas record, a CO2 rise with unchanged elevated bicarbonate introduces a respiratory contribution even though the later pH lies at the reporting interval boundary.",
    "sourceIds": [
      "source.jcm.laparoscopic-anesthesia-review.2020",
      "source.jroboticsurg.pneumoperitoneum-acid-base-study.2026",
      "source.french-panel.metabolic-acidosis.2019"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Explicit synthesis limited to the displayed observations; the two gases are internally consistent with their reported components. No compensation formula, reference-interval universality or treatment cutoff is asserted. Source access/currentness not refreshed. This is an author draft, not clinician verification or independent question acceptance.",
    "applicablePopulation": "The explicitly scoped N1 round-two constructed teaching cases; no empirical patient probabilities or medication doses.",
    "lastCheckedOn": "2026-11-04"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r2.named-enoxaparin-role",
    "statement": "Enoxaparin is used in distinct preventive and therapeutic anticoagulation regimens; a prescription documented for postoperative prevention is not documentation of therapeutic treatment of an established proximal DVT.",
    "sourceIds": [
      "source.board.dvt-ash-2014",
      "source.board.dvt-nhlbi-treatment-2022"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Named regimen/indication distinction applied to the recorded therapeutic-anticoagulation requirement; no dose, treatment-failure rescue or postoperative-resumption rule. Exact named-regimen support not newly retrieved; clinician/source verification required. Source access/currentness not refreshed. This is an author draft, not clinician verification or independent question acceptance.",
    "applicablePopulation": "The explicitly scoped N1 round-two constructed teaching cases; no empirical patient probabilities or medication doses.",
    "lastCheckedOn": "2026-11-04"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r2.named-methimazole",
    "statement": "Methimazole is an antithyroid medicine that reduces thyroid-hormone synthesis.",
    "sourceIds": [
      "source.eanm.benign-thyroid-rai-guideline.2023",
      "source.niddk.graves-disease.2021"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Named example of the recorded antithyroid-drug class. New offline naming synthesis; exact named-drug support was not newly retrieved and requires targeted verification before clinical approval. Source access/currentness not refreshed. This is an author draft, not clinician verification or independent question acceptance.",
    "applicablePopulation": "The explicitly scoped N1 round-two constructed teaching cases; no empirical patient probabilities or medication doses.",
    "lastCheckedOn": "2026-11-04"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r2.named-propranolol",
    "statement": "Propranolol is a beta-adrenergic blocking medicine used for adrenergic symptoms of thyroid-hormone excess.",
    "sourceIds": [
      "source.eanm.benign-thyroid-rai-guideline.2023",
      "source.niddk.graves-disease.2021"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Named example of the recorded beta-blocker symptom-control class. New offline naming synthesis; no claim that all doses lack other thyroid effects. Targeted named-drug verification remains a clinical/source hold. Source access/currentness not refreshed. This is an author draft, not clinician verification or independent question acceptance.",
    "applicablePopulation": "The explicitly scoped N1 round-two constructed teaching cases; no empirical patient probabilities or medication doses.",
    "lastCheckedOn": "2026-11-04"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r2.target-representation",
    "statement": "A sample documented to come from a different anatomical target does not establish the tissue diagnosis of the intended unsampled target.",
    "sourceIds": [
      "source.gs028f.uk.head-neck-guidelines.2024",
      "source.nci.mammograms.2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Observation-bound logical synthesis from recorded tissue-versus-imaging claims; no new biopsy threshold or universal adequacy algorithm. Source access/currentness not refreshed. This is an author draft, not clinician verification or independent question acceptance.",
    "applicablePopulation": "The explicitly scoped N1 round-two constructed teaching cases; no empirical patient probabilities or medication doses.",
    "lastCheckedOn": "2026-11-04"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.e2f4cca1859a",
    "statement": "When the gastrointestinal tract functions, oral intake and oral supplements are preferred first, with enteral nutrition used when oral intake is inadequate.",
    "sourceIds": [
      "source.nutrition.espen-practical-2021"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Route choice remains individualized. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Nutritionally at-risk adult surgical patients with a functional gastrointestinal tract.",
    "lastCheckedOn": "2026-09-29"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.e757fd75ecb1",
    "statement": "Parenteral nutrition is reserved for situations in which oral and enteral routes are infeasible, contraindicated, or insufficient.",
    "sourceIds": [
      "source.nutrition.espen-practical-2021"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "No fixed timing, formulation, or dose is taught. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Adult surgical patients needing nutrition support.",
    "lastCheckedOn": "2026-09-29"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.49101d9d3b5b",
    "statement": "For benign phyllodes tumors, complete excision is the counseling target without a prescribed fixed-width margin.",
    "sourceIds": [
      "source.rosenberger.asbrs-sbi-benign-fel.2025",
      "source.bishr.uk-abs-phyllodes.2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Management wording is evidence-sensitive consensus guidance and does not establish a universal biological cutoff. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Patients with pathology-confirmed benign phyllodes tumors considering local treatment.",
    "lastCheckedOn": "2026-08-31"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.8ace163cc27a",
    "statement": "A positive margin after benign phyllodes excision does not by itself require re-excision; residual or transected-tumor concern changes the discussion.",
    "sourceIds": [
      "source.rosenberger.asbrs-sbi-benign-fel.2025",
      "source.bishr.uk-abs-phyllodes.2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "This is counseling guidance, not a substitute for individualized pathology and multidisciplinary review. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Patients with benign phyllodes tumors after complete excision and a positive margin.",
    "lastCheckedOn": "2026-08-31"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.bb08015a8192",
    "statement": "For borderline phyllodes, a margin below 3 mm supports re-excision and a 3-to-under-5-mm margin supports individualized re-excision discussion.",
    "sourceIds": [
      "source.bishr.uk-abs-phyllodes.2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Intervals are evidence-sensitive consensus management boundaries rather than universal biological cutoffs. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Patients with borderline phyllodes tumors after excision with a close margin.",
    "lastCheckedOn": "2026-08-31"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.66ccd63686fe",
    "statement": "Borderline phyllodes counseling uses a 5-mm margin aim for complete excision planning.",
    "sourceIds": [
      "source.bishr.uk-abs-phyllodes.2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The margin aim is consensus management guidance with evidence limitations, not a biological cliff. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Patients with borderline phyllodes tumors undergoing local treatment planning.",
    "lastCheckedOn": "2026-08-31"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.866880df6471",
    "statement": "Phyllodes tumors have a predominantly hematogenous metastatic pattern, with nodal spread uncommon relative to hematogenous spread.",
    "sourceIds": [
      "source.bishr.uk-abs-phyllodes.2025"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "This describes a usual pattern and does not predict the course for an individual patient. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Patients receiving counseling about malignant phyllodes tumor spread patterns.",
    "lastCheckedOn": "2026-08-31"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.e09de46b1f33",
    "statement": "For malignant phyllodes, a margin below 5 mm supports re-excision; at 5 to under 10 mm, re-excision is recommended while surveillance may be considered only after explicit risk-benefit discussion.",
    "sourceIds": [
      "source.bishr.uk-abs-phyllodes.2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Intervals are evidence-sensitive consensus management boundaries rather than universal biological cutoffs. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Patients with malignant phyllodes tumors after excision with a close margin.",
    "lastCheckedOn": "2026-08-31"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.f580ee9e46ac",
    "statement": "Malignant phyllodes counseling uses a 10-mm margin aim for complete excision planning.",
    "sourceIds": [
      "source.bishr.uk-abs-phyllodes.2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The margin aim is consensus management guidance with evidence limitations, not a biological cliff. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Patients with malignant phyllodes tumors undergoing local treatment planning.",
    "lastCheckedOn": "2026-08-31"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.2ac9c5b4784e",
    "statement": "Routine sentinel-node or axillary staging is not indicated for phyllodes tumors when axillary nodes are nonsuspicious.",
    "sourceIds": [
      "source.bishr.uk-abs-phyllodes.2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "This boundary applies to nonsuspicious nodes and does not replace evaluation of a concerning axillary finding. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Patients with benign, borderline, or malignant phyllodes tumors and nonsuspicious axillary nodes.",
    "lastCheckedOn": "2026-08-31"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.94adc8a176b5",
    "statement": "A suspicious axillary node in a patient with phyllodes history warrants image-guided histopathologic needle biopsy; biopsy-proven involvement may prompt axillary-dissection consideration after MDT discussion.",
    "sourceIds": [
      "source.bishr.uk-abs-phyllodes.2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "This exception is driven by the suspicious-node evaluation and requires individualized multidisciplinary review. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Patients with a phyllodes tumor history and a suspicious axillary node during follow-up.",
    "lastCheckedOn": "2026-08-31"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.68a1f43b7b9f",
    "statement": "For a hemodynamically stable patient with progressive nonlocalized abdominal symptoms after extensive abdominal surgery, contrast-enhanced CT of the abdomen and pelvis is an appropriate initial cross-sectional study to evaluate the extent of fluid and look for other postoperative complications.",
    "sourceIds": [
      "source.acr.acute-nonlocalized-abdominal-pain.2018"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "This is a scoped initial-imaging choice for the approved stable presentation. Hemodynamic instability, peritonitis, a dominant organ-specific syndrome, or a contraindication to contrast requires a different pathway. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Hemodynamically stable adults with progressive abdominal swelling and discomfort after extensive abdominal surgery.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.9eec3f70b5d0",
    "statement": "Initial hospital management of large, symptomatic, reaccumulating postoperative chylous ascites can include symptom-directed peritoneal drainage, restriction of long-chain triglycerides with medium-chain triglyceride enrichment, and monitoring of nutrition, fluid, and electrolytes.",
    "sourceIds": [
      "source.al-busafi.chylous-ascites-review.2014",
      "source.bhardwaj.chylous-ascites-review.2018",
      "source.espen.hospital-nutrition.2021"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Evidence is heterogeneous, drainage is symptom- and accumulation-dependent, and persistent or severe refractory leakage may require individualized lymphatic localization, intervention, or surgery. This claim does not impose a rigid escalation timeline. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Hemodynamically stable postoperative adults with confirmed large, symptomatic, reaccumulating chylous ascites.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.9c12bef8ae65",
    "statement": "New unilateral swelling and tenderness after major surgery warrants prompt venous duplex/compression ultrasound; a noncompressible proximal vein supports proximal DVT.",
    "sourceIds": [
      "source.board.dvt-cdc-2024",
      "source.board.dvt-nhlbi-diagnosis-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Game timing is editorial simulation, not a recommended delay. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Stable postoperative adults with new unilateral leg symptoms and no chest symptoms or threatened limb.",
    "lastCheckedOn": "2026-09-12"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.8a0b2ca37037",
    "statement": "A first uncomplicated proximal DVT provoked by resolved major surgery generally receives therapeutic anticoagulation for three months when bleeding risk allows; routine IVC filter is not needed when anticoagulation is possible.",
    "sourceIds": [
      "source.board.dvt-ash-2014",
      "source.board.dvt-nhlbi-treatment-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Excludes cancer, prior VTE, persistent risks, active bleeding, and contraindications. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Stable adults with first major-surgery-provoked proximal DVT and low bleeding risk.",
    "lastCheckedOn": "2026-09-12"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.d585be062067",
    "statement": "Parenteral nutrition supplies nutrients while oral and enteral feeding are infeasible; it does not directly restore bowel motility, replace evaluation for obstruction, or prevent resumption of enteral feeding when gastrointestinal function returns.",
    "sourceIds": [
      "source.espen.clinical-nutrition-surgery.2025",
      "source.vather-bissett.prolonged-postoperative-ileus.2013"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Ongoing ileus management and reassessment are outside this single nutritional-support concept. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Hospitalized adults receiving parenteral nutrition because prolonged postoperative ileus prevents adequate oral or enteral feeding.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.c1bd8baa573c",
    "statement": "Parenteral nutrition is appropriate nutritional support in the approved presentation when prolonged postoperative ileus prevents adequate oral or enteral nutrition beyond seven days and mechanical obstruction has been excluded.",
    "sourceIds": [
      "source.espen.clinical-nutrition-surgery.2025",
      "source.vather-bissett.prolonged-postoperative-ileus.2013"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "This scope does not establish a universal instruction to delay nutrition until day seven. Malnutrition, high metabolic risk, critical illness, expected duration, and partial enteral tolerance can change timing and whether supplemental or total parenteral nutrition is used. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Hospitalized adults with persistent severe postoperative ileus who cannot use the gastrointestinal route for adequate nutrition.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.6aa4b6371145",
    "statement": "The approved prolonged postoperative-ileus presentation requires persistent severe gastrointestinal dysfunction beyond seven postoperative days, exclusion of mechanical obstruction or another precipitating diagnosis, and inability to tolerate adequate oral or enteral nutrition.",
    "sourceIds": [
      "source.espen.clinical-nutrition-surgery.2025",
      "source.vather-bissett.prolonged-postoperative-ileus.2013"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "A postoperative-day number or high nasogastric output alone is insufficient. Nutritional status, likely duration, reversible contributors, and oral or enteral feasibility remain clinically important. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Hospitalized adults with prolonged severe postoperative ileus after major abdominal surgery.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.c9e80d7dd8ad",
    "statement": "An adult with confirmed primary aldosteronism who wants and is a candidate for adrenalectomy generally undergoes adrenal CT plus adrenal venous sampling before choosing unilateral surgery.",
    "sourceIds": [
      "source.board.primary-aldosteronism-endocrine-society-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One adequate current guideline source; excludes the narrow very-young-patient exception and does not teach AVS indices or operative technique. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Adults with overt confirmed primary aldosteronism who desire and are candidates for surgical treatment.",
    "lastCheckedOn": "2026-09-12"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.228e2a181e73",
    "statement": "In resistant hypertension with spontaneous hypokalemia, immunoassay aldosterone above 20 ng/dL with plasma renin activity below 0.2 ng/mL/h is overt renin-independent aldosterone production for which a separate suppression test is not required before surgical-localization evaluation.",
    "sourceIds": [
      "source.board.primary-aldosteronism-endocrine-society-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One adequate current guideline source; the authored 24 ng/dL aldosterone and 0.1 ng/mL/h PRA values are a case instance of this narrow branch, not universal screening cutoffs. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Adults with resistant hypertension, spontaneous hypokalemia, safely prepared sampling, and overt renin-independent aldosterone results.",
    "lastCheckedOn": "2026-09-12"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.edd802be1c43",
    "statement": "Primary aldosteronism screening measures aldosterone and renin to calculate the ARR, with potassium correction and safe management of interfering medications needed for interpretable results.",
    "sourceIds": [
      "source.board.primary-aldosteronism-endocrine-society-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One adequate current guideline source; no universal assay cutoff or blanket medication-withdrawal rule is taught. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review. Only one recorded source supports this atomic claim; no independent management cross-check has been added.",
    "applicablePopulation": "Adults with resistant hypertension and spontaneous hypokalemia undergoing safely prepared biochemical evaluation.",
    "lastCheckedOn": "2026-09-12"
  },
  {
    "lastCheckedOn": "2026-11-04",
    "statement": "A pH fall from above to within the laboratory reference interval is not demonstrated acidemia, even when arterial CO2 rises; direction of change and the later acid-base state are separate interpretations.",
    "sourceIds": [
      "source.french-panel.metabolic-acidosis.2019",
      "source.jcm.laparoscopic-anesthesia-review.2020",
      "source.jroboticsurg.pneumoperitoneum-acid-base-study.2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "Only the explicitly described synthetic adult question-flag round-three profiles.",
    "limitation": "Reference-interval/definition inference without invented numeric values, a compensation formula, proof of CO2 source or a ventilator adjustment. Unchanged offline recorded statement; original check/access dates retained. Exact N1 round-two application and source currentness remain unverified.",
    "contentVersion": "clinical.question-new-n1.2026-11-04.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r2.a64275d45f37"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.e498c90de8b4",
    "statement": "Combined pancreatic and splenic resection during gastrectomy is an extension considered for relevant direct invasion, not a default consequence of a proximal gastric primary.",
    "sourceIds": [
      "source.japanese-gastric-cancer-guideline.2021",
      "source.qq20261102.jgca-2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The question concerns uninvolved organs and does not specify an operative technique. The 2025 English hilar-node recommendation contains contradictory wording, recorded separately and withheld from the item. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Operative planning for the supplied resectable proximal gastric adenocarcinoma.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.72256312b855",
    "statement": "The approved early-enteral-nutrition rule requires adequate resuscitation and no enteral contraindication; ongoing shock, incomplete resuscitation, suspected intestinal ischemia, or mechanical obstruction falls outside this teaching scenario.",
    "sourceIds": [
      "source.jsbi.burn-care-guideline.2022",
      "source.east.trauma-nutritional-support.2004"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Falling outside the approved scenario does not itself specify parenteral nutrition or another intervention; those decisions require separately authored clinical content. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Patients with extensive burns being assessed for initiation of enteral nutritional support.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.84c927796922",
    "statement": "For an extensively burned patient who has been adequately resuscitated and has no enteral contraindication, enteral nutrition should begin as soon as feasible within the first 24 hours after injury.",
    "sourceIds": [
      "source.jsbi.burn-care-guideline.2022",
      "source.east.trauma-nutritional-support.2004",
      "source.naeini.burn-nutrition-umbrella-review.2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The evidence supports early feeding but does not establish eight hours as a universal cutoff. The exact start depends on resuscitation, hemodynamic status, access, contraindications, and clinical feasibility. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Patients with extensive burns who are adequately resuscitated, hemodynamically stable, unable to meet nutritional needs orally, and without a contraindication to enteral nutrition.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.f73aaaad7469",
    "statement": "When the gastrointestinal tract is usable, enteral nutrition is the preferred initial route for nutritional support after an extensive burn rather than routine first-line parenteral nutrition.",
    "sourceIds": [
      "source.jsbi.burn-care-guideline.2022",
      "source.east.trauma-nutritional-support.2004",
      "source.naeini.burn-nutrition-umbrella-review.2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "This claim does not prescribe a feeding-access site, formula, advancement protocol, or management plan when adequate enteral nutrition is infeasible or contraindicated. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Patients with extensive burns who require nutritional support and have a usable gastrointestinal tract.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.c2583fb48102",
    "statement": "For a sufficiently stable trauma patient undergoing planned open repair of a localized upper or middle thoracic esophageal injury, a right posterolateral thoracotomy is an appropriate exposure; selected associated azygos or intrathoracic tracheal injuries can reinforce the right-sided choice.",
    "sourceIds": [
      "source.wses-aast.thoracic-trauma-guideline.2025",
      "source.caputo.thoracic-trauma-approach.2024",
      "source.sudarshan-cassivi.traumatic-esophageal-injuries.2019",
      "source.aast.esophageal-perforation-module.2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "This claim assumes that the injury is localized and the patient can undergo a planned definitive exposure. Distal esophageal injuries are generally approached from the left, and the side of major pleural contamination or a competing cardiac or great-vessel injury can change the incision. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Hemodynamically stable or stabilized trauma patients with a localized upper or middle thoracic esophageal injury selected for planned open repair.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.f54f71900adc",
    "statement": "A planned right posterolateral thoracotomy is not the default incision for a patient in traumatic arrest or extremis who requires immediate resuscitative chest access; resuscitative access is generally anterior and may require left anterolateral or clamshell exposure according to the suspected injury and local protocol.",
    "sourceIds": [
      "source.caputo.thoracic-trauma-approach.2024",
      "source.aast.esophageal-perforation-module.2026"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "This boundary does not define eligibility for resuscitative thoracotomy or prescribe one incision for every arrest scenario. Those indications and technique choices require separate content. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Trauma patients being assessed for immediate resuscitative versus planned definitive thoracic exposure.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.5058009b6a15",
    "statement": "A right thoracotomy directly exposes the proximal or middle intrathoracic esophagus, intrathoracic trachea, and azygos vein and can therefore address selected combinations of localized injuries to those structures.",
    "sourceIds": [
      "source.wses-aast.thoracic-trauma-guideline.2025",
      "source.caputo.thoracic-trauma-approach.2024",
      "source.sudarshan-cassivi.traumatic-esophageal-injuries.2019"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "Exposure is not equivalent to a universal operative recommendation. Hemodynamic state, exact injury level, trajectory, associated injuries, pleural contamination, and need for vascular or cardiac control may require a different or extended incision. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Trauma patients with localized intrathoracic injuries undergoing operative exposure selection after initial assessment.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.9e8ad73ce186",
    "statement": "The named procoagulant factors in the approved 4F-PCC teaching set are II, VII, IX, and X.",
    "sourceIds": [
      "source.tomaselli.acc-oac-bleeding.2020",
      "source.fda.kcentra.2023"
    ],
    "evidenceCategory": "definition",
    "certainty": "high",
    "limitation": "Formulation details beyond the named teaching set are out of scope. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Patients within the approved VKA emergency-reversal teaching scope.",
    "lastCheckedOn": "2026-08-31"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.106cf1da9d54",
    "statement": "IV vitamin K is paired with PCC in the approved VKA emergency-reversal teaching because vitamin K does not supply the immediate factor replacement provided by PCC.",
    "sourceIds": [
      "source.rossaint.trauma-bleeding.2023",
      "source.tomaselli.acc-oac-bleeding.2020"
    ],
    "evidenceCategory": "management",
    "certainty": "high",
    "limitation": "No timing or dosing instruction is encoded. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Patients within the approved VKA emergency-reversal teaching scope.",
    "lastCheckedOn": "2026-08-31"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.0fc2b1f318e6",
    "statement": "In the approved VKA emergency-reversal scope, 4F-PCC is the rapid clotting-factor replacement product; plasma is a fallback when 4F-PCC is unavailable.",
    "sourceIds": [
      "source.rossaint.trauma-bleeding.2023",
      "source.tomaselli.acc-oac-bleeding.2020",
      "source.fda.kcentra.2023",
      "source.acs.tbi.2024"
    ],
    "evidenceCategory": "management",
    "certainty": "high",
    "limitation": "Does not provide dose, inventory, or patient-specific prescribing instructions. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Patients within the approved VKA emergency-reversal teaching scope.",
    "lastCheckedOn": "2026-08-31"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.5eca14d67493",
    "statement": "Emergency VKA reversal teaching is limited to documented VKA/warfarin exposure with major or critical-site traumatic bleeding or an urgent intervention; an elevated INR alone does not establish that medication-specific pathway.",
    "sourceIds": [
      "source.rossaint.trauma-bleeding.2023",
      "source.tomaselli.acc-oac-bleeding.2020",
      "source.fda.kcentra.2023",
      "source.acs.tbi.2024"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "high",
    "limitation": "Does not define all causes or management of INR elevation. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Patients with documented VKA/warfarin exposure and traumatic major or critical-site bleeding, or an urgent intervention.",
    "lastCheckedOn": "2026-08-31"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.e22669366268",
    "statement": "When a selected single-stage ventral or incisional hernia repair proceeds after controlled enterotomy, permanent macroporous monofilament synthetic mesh is preferred over defaulting to biologic, microporous multifilament, or rapidly absorbable mesh solely because the field is clean-contaminated.",
    "sourceIds": [
      "source.ehs.emergency-ventral-incisional-hernia.2026",
      "source.wses.complicated-abdominal-wall-hernia.2017",
      "source.rosen.contaminated-ventral-hernia-rct.2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The randomized trial addresses elective clean-contaminated and contaminated repairs rather than the exact inadvertent-enterotomy scenario, and the current EHS recommendation is conditional with low to very-low evidence certainty. Mesh plane, fixation, and direct bowel contact are not addressed by this concept. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Selected stable adults proceeding with single-stage ventral or incisional hernia repair after adequate source control in a minimally contaminated field.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.8e30265aebbd",
    "statement": "In a stable adult undergoing ventral or incisional hernia repair, a recognized small-bowel enterotomy that has been securely repaired with adequate source control, minimal controlled contamination, and no ongoing gross spillage does not automatically preclude a selected single-stage mesh repair.",
    "sourceIds": [
      "source.ehs.emergency-ventral-incisional-hernia.2026",
      "source.wses.complicated-abdominal-wall-hernia.2017",
      "source.sages.laparoscopic-ventral-hernia.2016"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Direct evidence for an inadvertent enterotomy during elective repair remains limited. Whether to continue, convert, or defer repair requires individualized judgment; this approved concept begins only after the team has determined that single-stage repair is appropriate. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Stable adults undergoing ventral or incisional hernia repair after immediate recognition and secure repair of a small-bowel enterotomy with controlled contamination and no gross spillage.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1.4b2bd6d4bf88",
    "statement": "Unstable physiology, uncertain bowel viability, an unrecognized or delayed enterotomy, incomplete source control, or persistent gross enteric or feculent spillage falls outside the approved macroporous-synthetic-mesh selection rule.",
    "sourceIds": [
      "source.ehs.emergency-ventral-incisional-hernia.2026",
      "source.wses.complicated-abdominal-wall-hernia.2017",
      "source.sages.laparoscopic-ventral-hernia.2016"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Falling outside this scope does not by itself prescribe tissue repair, biologic mesh, staged reconstruction, or abandonment; those operative decisions require separately authored content. Offline reuse: source verification and currentness have not been refreshed for N1. Exact authored application and option ranking require clinician review.",
    "applicablePopulation": "Adults with an enterotomy or gastrointestinal contamination encountered during ventral or incisional hernia repair.",
    "lastCheckedOn": "2026-08-06"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r3.7b235321cfc5",
    "statement": "Watchful waiting is a safe option for informed men with asymptomatic or minimally symptomatic reducible inguinal hernias, although later repair is common when symptoms develop.",
    "sourceIds": [
      "source.bread-butter.herniasurge-2018",
      "source.bread-butter.herniasurge-update-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "high",
    "limitation": "This does not apply to women, femoral hernias, activity-limiting symptoms, irreducibility, obstruction, or strangulation. Unchanged recorded statement; original last-check date retained. Exact N1 round-three application and source currentness remain unverified.",
    "applicablePopulation": "Men with a confirmed reducible inguinal hernia and absent or minimal symptoms.",
    "lastCheckedOn": "2026-09-17"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r3.9f2884215d43",
    "statement": "A clinically suspicious persistent palpable breast mass requires tissue diagnosis even when diagnostic mammography and targeted ultrasonography are negative.",
    "sourceIds": [
      "source.acr.palpable-breast-masses.2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single current specialty guideline; biopsy technique depends on whether an imaging target exists and local specialist assessment. Unchanged recorded statement; original last-check date retained. Exact N1 round-three application and source currentness remain unverified.",
    "applicablePopulation": "Adults with a persistently suspicious palpable breast mass despite negative mammography and targeted ultrasound.",
    "lastCheckedOn": "2026-10-02"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r3.149ce209d4ee",
    "statement": "A high-risk nutrition-restart plan includes close clinical and electrolyte monitoring; planned thiamine supplementation does not replace that monitoring.",
    "sourceIds": [
      "source.gs028f.auspen_refeeding2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "AuSPEN 2025 summary and treatment discussion are the sole direct management source. A qualitative multidisciplinary-care principle, not a bedside feeding protocol or a guarantee of avoiding complications. No monitoring frequency, numeric target, prophylactic electrolyte dose or universal feeding rate. Unchanged recorded statement; original last-check date retained. Exact N1 round-three application and source currentness remain unverified.",
    "applicablePopulation": "Adults receiving an expert-coordinated high-risk nutrition-restart plan.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r3.a2a9c29cbbcf",
    "statement": "A low serum phosphate concentration has causes other than refeeding, so that result alone does not establish refeeding syndrome.",
    "sourceIds": [
      "source.gs028f.auspen_refeeding2025"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "AuSPEN 2025 risk and diagnosis discussion supports this limit. No particular diagnostic definition, percentage fall, timing rule or alternative-cause algorithm is adopted. The mechanism cases supply the outside team's assessment and relevant course. Unchanged recorded statement; original last-check date retained. Exact N1 round-three application and source currentness remain unverified.",
    "applicablePopulation": "Adults with low phosphate interpreted in a clinical context.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r3.78d2ba5c0eb0",
    "statement": "For adults identified as at risk of refeeding syndrome, the AuSPEN consensus recommends planned thiamine supplementation before restarting nutrition.",
    "sourceIds": [
      "source.gs028f.auspen_refeeding2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single adequate directly verified management source: AuSPEN 2025 section 3.4.1. Expert consensus explicitly reports no specific evidence evaluating thiamine's preventive role; benefit is not guaranteed. Original underlying-fact synthesis under conservative CC BY-NC-ND targeted-verification status. Dose, route, duration, feeding rate and NICE recommendations are excluded. Unchanged recorded statement; original last-check date retained. Exact N1 round-three application and source currentness remain unverified.",
    "applicablePopulation": "Adults already assessed by a specialist nutrition team as at risk during a monitored nutrition restart.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r3.ee52cfc5f587",
    "statement": "Failure to identify a cord-associated sac can prompt inspection for a direct defect, but does not by itself exclude every other occult groin lesion.",
    "sourceIds": [
      "source.review.inguinal-releasing-incisions.2023"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "low",
    "limitation": "This is a bounded operative-search safeguard, not a validated diagnostic sequence or proof that a direct defect is present. Unchanged recorded statement; original last-check date retained. Exact N1 round-three application and source currentness remain unverified.",
    "applicablePopulation": "Adults undergoing open inguinal exploration in which no cord-associated sac is initially identified.",
    "lastCheckedOn": "2026-07-30"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r3.f7c0c4468398",
    "statement": "For a patient with a confirmed reducible inguinal hernia and meaningful activity-limiting symptoms, elective repair discussion and planning are appropriate.",
    "sourceIds": [
      "source.sc.herniasurge-2018",
      "source.sc.niddk-inguinal-hernia"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "This does not select a repair technique, mesh, or timing protocol, and does not treat watchful waiting as the default for the symptomatic profiles used here. NIDDK cites HerniaSurge as underlying evidence. Unchanged recorded statement; original last-check date retained. Exact N1 round-three application and source currentness remain unverified.",
    "applicablePopulation": "Stable adults with confirmed reducible inguinal hernia and authored symptomatic activity limitation.",
    "lastCheckedOn": "2026-09-10"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r3.acefc98ce84f",
    "statement": "Iron studies are used to confirm iron deficiency in an already anemic patient, and low ferritin supports depleted iron stores.",
    "sourceIds": [
      "source.bsg.iron-deficiency-anaemia.2021",
      "source.nhlbi.iron-deficiency-anemia.2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "high",
    "limitation": "A normal ferritin can be misleading with inflammation; this content uses no numeric threshold and does not claim isolated low ferritin proves anemia. Unchanged recorded statement; original last-check date retained. Exact N1 round-three application and source currentness remain unverified.",
    "applicablePopulation": "Adults with established anemia undergoing evaluation for iron deficiency.",
    "lastCheckedOn": "2026-09-09"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r3.axillary-core-scope",
    "statement": "In the constructed suspicious axillary node after phyllodes, unresolved classification after atypical FNA material supports a representative image-guided core attempt before deep open excision, while a specific whole-node requirement can change that sequence.",
    "sourceIds": [
      "source.bishr.uk-abs-phyllodes.2025",
      "source.gs028f.uk.head-neck-guidelines.2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The core-after-FNA atom is neck-specific. Its axillary application and priority over excision require direct verification; the general node-needle exception does not prove every core is adequate. Offline author synthesis on 2026-11-04, not external verification. Source access/currentness not refreshed. Named-clinician review required.",
    "applicablePopulation": "The expressly bounded fictional N1 round-three teaching case; no new empirical rate, medication dose or universal clinical threshold.",
    "lastCheckedOn": "2026-11-04"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r3.beta-blocker-slow-pulse",
    "statement": "A slow pulse with lightheadedness while taking propranolol warrants reassessing beta blockade rather than automatically increasing it for a historical thyroid symptom indication.",
    "sourceIds": [
      "source.eanm.benign-thyroid-rai-guideline.2023",
      "source.niddk.graves-disease.2021"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "New named-drug effect/adjustment application; the earlier named example already carried a direct-support hold. Verify the exact clinical/drug recommendation. Offline author synthesis on 2026-11-04, not external verification. Source access/currentness not refreshed. Named-clinician review required.",
    "applicablePopulation": "The expressly bounded fictional N1 round-three teaching case; no new empirical rate, medication dose or universal clinical threshold.",
    "lastCheckedOn": "2026-11-04"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r3.burn-release-scope",
    "statement": "Deep burn findings by themselves do not establish an eschar-release indication; release addresses a constricting eschar with a corresponding perfusion or ventilation problem.",
    "sourceIds": [
      "source.burn.aba-referral-2022",
      "source.burn.aha-redcross-2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Eschar-release distinction is not established by the recorded depth/referral atoms. Verify in permitted burn guidance before using this operative distractor ranking. Offline author synthesis on 2026-11-04, not external verification. Source access/currentness not refreshed. Named-clinician review required.",
    "applicablePopulation": "The expressly bounded fictional N1 round-three teaching case; no new empirical rate, medication dose or universal clinical threshold.",
    "lastCheckedOn": "2026-11-04"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r3.co2-ventilatory-response",
    "statement": "In the constructed intraoperative paired-gas record, an acute CO2 rise with reduced delivered ventilation supports increasing effective alveolar ventilation and checking the response despite an offsetting elevated bicarbonate.",
    "sourceIds": [
      "source.jcm.laparoscopic-anesthesia-review.2020",
      "source.jroboticsurg.pneumoperitoneum-acid-base-study.2026",
      "source.french-panel.metabolic-acidosis.2019"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The source atoms describe physiology; the directional ventilatory action is a new scoped application requiring anesthesia verification. No rate, volume or target value is prescribed. Offline author synthesis on 2026-11-04, not external verification. Source access/currentness not refreshed. Named-clinician review required.",
    "applicablePopulation": "The expressly bounded fictional N1 round-three teaching case; no new empirical rate, medication dose or universal clinical threshold.",
    "lastCheckedOn": "2026-11-04"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r3.current-grade-margin-scope",
    "statement": "A superseding malignant interpretation of a component within the same continuous phyllodes tumor requires reconsideration of the margins under the current malignant guidance rather than retaining the earlier borderline operation unchanged.",
    "sourceIds": [
      "source.bishr.uk-abs-phyllodes.2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Grade-addendum scope across the continuous lesion is an explicit extension; verify with the breast pathologist and recorded UK guidance. Offline author synthesis on 2026-11-04, not external verification. Source access/currentness not refreshed. Named-clinician review required.",
    "applicablePopulation": "The expressly bounded fictional N1 round-three teaching case; no new empirical rate, medication dose or universal clinical threshold.",
    "lastCheckedOn": "2026-11-04"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r3.gastric-inseparable-invaded-interface",
    "statement": "For the constructed locally resectable gastric cancer with previously represented pancreatic invasion and a persistent inseparable pancreatic/splenic interface, an en-bloc plan preserves the tumor plane rather than dividing through that interface because imaging thickening has decreased.",
    "sourceIds": [
      "source.japanese-gastric-cancer-guideline.2021",
      "source.qq20261102.jgca-2025",
      "source.korean-gastric-cancer-guideline.2024",
      "source.jcog0110.prophylactic-splenectomy.2017"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Post-treatment inseparable-interface/en-bloc ranking is a new scoped application; the older claim states only the direct-invasion scope. Verify the exact oncologic plane and resectability recommendation. Offline author synthesis on 2026-11-04, not external verification. Source access/currentness not refreshed. Named-clinician review required.",
    "applicablePopulation": "The expressly bounded fictional N1 round-three teaching case; no new empirical rate, medication dose or universal clinical threshold.",
    "lastCheckedOn": "2026-11-04"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r3.graves-tsh-lag",
    "statement": "During treatment of Graves hyperthyroidism, TSH may remain suppressed after free thyroid hormones normalize and should not by itself determine early antithyroid escalation.",
    "sourceIds": [
      "source.eanm.benign-thyroid-rai-guideline.2023",
      "source.niddk.graves-disease.2021",
      "source.ata.thyroid-function-tests.undated"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "TSH recovery lag and early titration priority were not established by the recorded functional-context atom. Verify in permitted thyroid guidance before acceptance. Offline author synthesis on 2026-11-04, not external verification. Source access/currentness not refreshed. Named-clinician review required.",
    "applicablePopulation": "The expressly bounded fictional N1 round-three teaching case; no new empirical rate, medication dose or universal clinical threshold.",
    "lastCheckedOn": "2026-11-04"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r3.hla-before-challenge",
    "statement": "In an adult whose celiac evaluation occurred after gluten withdrawal, HLA-DQ2/DQ8 testing can precede a gluten challenge; absence of both makes celiac disease very unlikely, whereas a compatible result does not establish active disease.",
    "sourceIds": [
      "source.niddk.celiac-tests.2021",
      "source.niddk.celiac-diagnosis.2020",
      "source.acg.celiac-patient-education.2026"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Negative-typing exclusion value and HLA-first sequencing are extensions beyond the recorded susceptibility-only atom. Verify directly in the recorded ACG/NIDDK guidance. Offline author synthesis on 2026-11-04, not external verification. Source access/currentness not refreshed. Named-clinician review required.",
    "applicablePopulation": "The expressly bounded fictional N1 round-three teaching case; no new empirical rate, medication dose or universal clinical threshold.",
    "lastCheckedOn": "2026-11-04"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r3.nutrition-fluid-separation",
    "statement": "Adequate tolerated gastrointestinal nutrient delivery and an ongoing need for intravenous fluid/electrolyte replacement are separate indications; continued intravenous fluid need does not by itself establish a need for parenteral nutrients.",
    "sourceIds": [
      "source.nutrition.espen-practical-2021"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Bounded logical separation of recorded route indications; no fluid formula, stoma-output cutoff or PN taper protocol. Offline author synthesis on 2026-11-04, not external verification. Source access/currentness not refreshed. Named-clinician review required.",
    "applicablePopulation": "The expressly bounded fictional N1 round-three teaching case; no new empirical rate, medication dose or universal clinical threshold.",
    "lastCheckedOn": "2026-11-04"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r3.phyllodes-posterior-plane",
    "statement": "In the constructed malignant-phyllodes cases, a close posterior breast/fascial boundary is distinguished from direct muscle involvement when planning focused further clearance; adjacency alone is not represented as proof that a muscle strip is required.",
    "sourceIds": [
      "source.bishr.uk-abs-phyllodes.2025"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The recorded atoms establish margin aims/actions, not the exact fascia-versus-muscle operation. Directly verify both posterior-plane option rankings; no claim of verified fascia/muscle equivalence. Offline author synthesis on 2026-11-04, not external verification. Source access/currentness not refreshed. Named-clinician review required.",
    "applicablePopulation": "The expressly bounded fictional N1 round-three teaching case; no new empirical rate, medication dose or universal clinical threshold.",
    "lastCheckedOn": "2026-11-04"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r3.proximal-venous-waveform",
    "statement": "In a patient with new unilateral whole-leg swelling, asymmetric loss of respiratory variation in common-femoral venous flow can prompt pelvic/iliac outflow assessment despite compressible examined leg veins.",
    "sourceIds": [
      "source.board.dvt-cdc-2024",
      "source.board.dvt-nhlbi-diagnosis-2022",
      "source.lymphedema.isl-2023",
      "source.lymphedema.nci-pdq-current"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Indirect waveform interpretation and the next pelvic venous protocol are new details beyond the recorded leg-duplex atom. Verify against permitted vascular guidance; no performance value or diagnostic certainty is asserted. Offline author synthesis on 2026-11-04, not external verification. Source access/currentness not refreshed. Named-clinician review required.",
    "applicablePopulation": "The expressly bounded fictional N1 round-three teaching case; no new empirical rate, medication dose or universal clinical threshold.",
    "lastCheckedOn": "2026-11-04"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r3.residual-dvt-not-failure",
    "statement": "Residual early venous noncompressibility with unchanged clot extent and improving symptoms does not by itself establish anticoagulation failure or an indication for routine IVC filter placement.",
    "sourceIds": [
      "source.board.dvt-ash-2014",
      "source.board.dvt-nhlbi-treatment-2022"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Persistence-versus-progression distinction and follow-up drug ranking extend the recorded initial-treatment/filter atom. Verify directly in permitted VTE guidance; no universal scan interval is claimed. Offline author synthesis on 2026-11-04, not external verification. Source access/currentness not refreshed. Named-clinician review required.",
    "applicablePopulation": "The expressly bounded fictional N1 round-three teaching case; no new empirical rate, medication dose or universal clinical threshold.",
    "lastCheckedOn": "2026-11-04"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r3.vka-sustained-reversal",
    "statement": "An early corrected INR after PCC does not by itself establish sustained warfarin reversal; a later INR rise without VKA redosing and unreliable vitamin-K delivery requires reassessment of the vitamin-K component rather than automatic repeat rapid factor loading in a controlled-bleeding patient.",
    "sourceIds": [
      "source.rossaint.trauma-bleeding.2023",
      "source.tomaselli.acc-oac-bleeding.2020",
      "source.fda.kcentra.2023",
      "source.acs.tbi.2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The paired-agent atom does not fully establish rebound management after hemostasis. Verify the exact sustained-reversal interpretation and repeat-PCC boundary. Offline author synthesis on 2026-11-04, not external verification. Source access/currentness not refreshed. Named-clinician review required.",
    "applicablePopulation": "The expressly bounded fictional N1 round-three teaching case; no new empirical rate, medication dose or universal clinical threshold.",
    "lastCheckedOn": "2026-11-04"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r3.a671422d11b7",
    "statement": "Targeted ultrasound can characterize an uncertain superficial postoperative breast collection and distinguish simple fluid features from a solid or suspiciously vascular finding.",
    "sourceIds": [
      "source.sc.ucla-post-surgical-fluid"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "This imaging detail is supported by a single institutional teaching source rather than a society guideline, and ultrasound is not presented as universally definitive outside the complete clinical context. Unchanged recorded statement; original last-check date retained. Exact N1 round-three application and source currentness remain unverified.",
    "applicablePopulation": "Stable adults with uncertain superficial fullness after benign breast excision and no emergency or infectious features.",
    "lastCheckedOn": "2026-09-10"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r3.a2269c919525",
    "statement": "Benign breast tissue that does not explain the suspicious imaging target warrants further representative histologic assessment.",
    "sourceIds": [
      "source.qq20261102c.breast-eusobi2020",
      "source.qq20261102c.asbrs2024-archived"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Repeat core, vacuum-assisted or surgical sampling may be appropriate. The missed-target case does not rank all possible techniques universally; skin sampling alone does not clear an unsampled parenchymal lesion. Unchanged recorded statement; original last-check date retained. Exact N1 round-three application and source currentness remain unverified.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r3.d3c31e54d4ba",
    "statement": "MRCP can assess suspected pancreatic duct disruption or disconnection before selecting a drainage strategy.",
    "sourceIds": [
      "source.qq20261102c.ksge2021",
      "source.qq20261102c.ilatam2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "Current guidance includes low-quality evidence; secretin is preferable when available but is not silently made a required resource in these cases. Unchanged recorded statement; original last-check date retained. Exact N1 round-three application and source currentness remain unverified.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r3.64dbe972aff7",
    "statement": "A selected small communicating collection with a partial pancreatic duct leak may be treated by transpapillary bridging when transmural access is unsuitable.",
    "sourceIds": [
      "source.qq20261102c.ksge2021"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "One adequate retrieved technical guideline: it describes a small collection under 5 cm and partial rather than complete disruption. The 4-cm case is fictional, not a new cutoff. Exact bridging feasibility requires endoscopy review. Unchanged recorded statement; original last-check date retained. Exact N1 round-three application and source currentness remain unverified.",
    "applicablePopulation": "The identified synthetic adult clinical or employee teaching cases; observed values are constructed case inputs, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.n1r3.e32ff5667375",
    "statement": "Available 4F-PCC provides concentrated factor replacement with less infusion volume and more rapid preparation or administration than plasma in the approved VKA-reversal comparison.",
    "sourceIds": [
      "source.tomaselli.acc-oac-bleeding.2020"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Does not replace hemorrhage control, resuscitation, or local protocol. Unchanged recorded statement; original last-check date retained. Exact N1 round-three application and source currentness remain unverified.",
    "applicablePopulation": "Patients within the approved VKA emergency-reversal teaching scope when 4F-PCC and plasma are available.",
    "lastCheckedOn": "2026-08-31"
  }
];
export const QUESTION_NEW_N1_ROUND3_SOURCES: ClinicalSource[] = [
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.aasld-ast.liver-transplant-candidate-evaluation.2026",
    "title": "AASLD AST Practice Guideline on adult liver transplantation: Candidate evaluation",
    "completeCitation": "Dove L, Chadha RM, Lai JC, DiMartini A, Liapakis A, Parikh ND, Firpi-Morell R, Conteh L, Fallon M, Trotter J, Ladner DP, Sapisochin G, Lucey MR. AASLD AST Practice Guideline on adult liver transplantation: Candidate evaluation. Hepatology. 2026;83(6):1609-1645. doi:10.1097/HEP.0000000000001644.",
    "organizationOrJournal": "Hepatology; American Association for the Study of Liver Diseases and American Society of Transplantation",
    "authors": [
      "Lorna Dove",
      "Ryan M. Chadha",
      "Jennifer C. Lai",
      "Andrea DiMartini",
      "AnnMarie Liapakis",
      "Neehar D. Parikh",
      "Roberto Firpi-Morell",
      "Lanla Conteh",
      "Michael Fallon",
      "James Trotter",
      "Daniela P. Ladner",
      "Gonzalo Sapisochin",
      "Michael R. Lucey"
    ],
    "publicationYear": 2026,
    "doi": "10.1097/HEP.0000000000001644",
    "pmid": "41405234",
    "officialUrl": "https://pubmed.ncbi.nlm.nih.gov/41405234/",
    "accessedOn": "2026-08-06",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted professional-society guideline; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Use independently written factual synthesis and citation; do not reproduce protected prose, recommendation tables, figures, or algorithms. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Current joint AASLD/AST guideline supporting use of Milan criteria as a guide for transplantation listing and downstaging, with macrovascular invasion and extrahepatic disease as key boundaries.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.n1.a2f96b40428e",
      "claim.n1.e0b6bc7a19dc"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.aasld.hcc-practice-guidance.2023",
    "title": "AASLD Practice Guidance on prevention, diagnosis, and treatment of hepatocellular carcinoma",
    "completeCitation": "Singal AG, Llovet JM, Yarchoan M, Mehta N, Heimbach JK, Dawson LA, Jou JH, Kulik LM, Agopian VG, Marrero JA, Mendiratta-Lala M, Brown DB, Rilling WS, Goyal L, Wei AC, Taddei TH. AASLD Practice Guidance on prevention, diagnosis, and treatment of hepatocellular carcinoma. Hepatology. 2023;78(6):1922-1965. doi:10.1097/HEP.0000000000000466.",
    "organizationOrJournal": "Hepatology; American Association for the Study of Liver Diseases",
    "authors": [
      "Amit G. Singal",
      "Josep M. Llovet",
      "Mark Yarchoan",
      "Neil Mehta",
      "Julie K. Heimbach",
      "Laura A. Dawson",
      "Janice H. Jou",
      "Laura M. Kulik",
      "Vatche G. Agopian",
      "Jorge A. Marrero",
      "Mishal Mendiratta-Lala",
      "Daniel B. Brown",
      "William S. Rilling",
      "Lipika Goyal",
      "Alice C. Wei",
      "Tamar H. Taddei"
    ],
    "publicationYear": 2023,
    "doi": "10.1097/HEP.0000000000000466",
    "pmid": "37199193",
    "officialUrl": "https://doi.org/10.1097/HEP.0000000000000466",
    "accessedOn": "2026-08-21",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted professional-society guidance; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Store bibliographic metadata and independently written atomic facts only; do not reproduce guideline prose, figures, tables, or algorithms. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Current AASLD guidance supporting the narrowly approved favorable profile for specialist hepatic-resection evaluation.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.a2f96b40428e",
      "claim.n1.306f7180fb92",
      "claim.n1.addcd31f93bb",
      "claim.n1.bf9e72bc7198"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.aast.esophageal-perforation-module.2026",
    "title": "Esophageal Perforation",
    "completeCitation": "Mendoza A, Reilly P, Campbell A. Esophageal Perforation. American Association for the Surgery of Trauma educational module. 2026.",
    "organizationOrJournal": "American Association for the Surgery of Trauma",
    "authors": [
      "April Mendoza",
      "Pat Reilly",
      "Andre Campbell",
      "Clay Cothren Burlew",
      "Marc deMoya",
      "Therese Duane",
      "Eric Toschlog",
      "Kimberly A. Davis"
    ],
    "publicationYear": 2026,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.aast.org/asset/E6C2A1CC-E681-4A62-B1426CAD3B8ED3A9/",
    "accessedOn": "2026-08-06",
    "sourceClass": "open_educational_resource",
    "licenseLabel": "Copyrighted professional-society educational material; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Use only for targeted factual verification and citation. Do not reproduce protected module wording, operative diagrams, tables, or extended prose. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Current AAST educational module explicitly distinguishing planned right posterolateral exposure for upper thoracic esophageal injury from anterolateral thoracotomy in an unstable patient.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n1.c2583fb48102",
      "claim.n1.f54f71900adc"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
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
    "reuseNotes": "Citation and bounded factual verification only; no protected wording, lists, tables, or images reproduced. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Current society patient education used only to cross-check gluten-before-testing and dietitian-supported treatment; not a substitute for the full guideline.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n1.87469918a5c7",
      "claim.n1r3.hla-before-challenge"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.acg.gastroparesis-guideline.2022",
    "title": "ACG Clinical Guideline: Gastroparesis",
    "completeCitation": "Camilleri M, Kuo B, Nguyen L, Vaughn VM, Petrey J, Greer K, Yadlapati R, Abell TL. ACG Clinical Guideline: Gastroparesis. Am J Gastroenterol. 2022;117(8):1197-1220. doi:10.14309/ajg.0000000000001874.",
    "organizationOrJournal": "American Journal of Gastroenterology / American College of Gastroenterology",
    "authors": [
      "Michael Camilleri",
      "Braden Kuo",
      "Linda Nguyen",
      "Vida M. Vaughn",
      "Jessica Petrey",
      "Katarina Greer",
      "Rena Yadlapati",
      "Thomas L. Abell"
    ],
    "publicationYear": 2022,
    "doi": "10.14309/ajg.0000000000001874",
    "pmid": "35926490",
    "officialUrl": "https://pubmed.ncbi.nlm.nih.gov/35926490/",
    "accessedOn": "2026-08-06",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright American College of Gastroenterology and Wolters Kluwer; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Use only for targeted factual verification and citation. Do not reproduce guideline prose, tables, algorithms, figures, or extended recommendations. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Professional-society guideline supporting the diagnostic framework and solid-meal scintigraphic assessment of gastric emptying.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.b718f6a72a97",
      "claim.n1.e7e333d36883",
      "claim.n1.55ab54b0240a"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.acg.gastroparesis-patient-information.2026",
    "title": "Gastroparesis",
    "completeCitation": "Deiss-Yehiely N, Javed S. Gastroparesis. American College of Gastroenterology patient information. Updated April 2026.",
    "organizationOrJournal": "American College of Gastroenterology",
    "authors": [
      "Nimrod Deiss-Yehiely",
      "Saad Javed"
    ],
    "publicationYear": 2026,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://gi.org/topics/gastroparesis/",
    "accessedOn": "2026-08-06",
    "sourceClass": "open_educational_resource",
    "licenseLabel": "Copyright American College of Gastroenterology; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Use only for current factual cross-checking and citation. Do not reproduce patient-page prose, graphics, or handouts. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Current specialist-authored patient reference cross-checking the four-hour gastric-emptying-test formulation in accessible language.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n1.e7e333d36883"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.acr.acute-nonlocalized-abdominal-pain.2018",
    "title": "ACR Appropriateness Criteria Acute Nonlocalized Abdominal Pain",
    "completeCitation": "Scheirey CD, Fowler KJ, Therrien JA, et al. ACR Appropriateness Criteria Acute Nonlocalized Abdominal Pain. J Am Coll Radiol. 2018;15(11S):S217-S231. doi:10.1016/j.jacr.2018.09.010.",
    "organizationOrJournal": "American College of Radiology; Journal of the American College of Radiology",
    "authors": [
      "Christopher D. Scheirey",
      "Kathryn J. Fowler",
      "Julie A. Therrien",
      "American College of Radiology Appropriateness Criteria Expert Panel"
    ],
    "publicationYear": 2018,
    "doi": "10.1016/j.jacr.2018.09.010",
    "pmid": "30392591",
    "officialUrl": "https://acsearch.acr.org/docs/69467/Narrative/",
    "accessedOn": "2026-08-06",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted professional-society guidance; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Store bibliographic metadata and independently written atomic facts only; do not reproduce protected tables, rating matrices, or explanatory wording. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Radiology-society guidance supporting contrast-enhanced CT as an appropriate broad cross-sectional study for acute nonlocalized abdominal symptoms when postoperative complication is in the differential.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.68a1f43b7b9f"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.acr.birads-mammography-summary.2025",
    "title": "ACR BI-RADS v2025 Mammography Lexicon Summary Form",
    "completeCitation": "Destounis SV, Friedewald SM, Grimm LJ, Poplack SP, Sung JS. Mammography. In: ACR BI-RADS v2025 Manual. Reston, VA: American College of Radiology; 2025. Public resource used: ACR BI-RADS v2025 Mammography Lexicon Summary Form, Appendix B.",
    "organizationOrJournal": "American College of Radiology",
    "authors": [
      "Stamatia V. Destounis",
      "Sarah M. Friedewald",
      "Lars J. Grimm",
      "Steven P. Poplack",
      "Jessica S. Sung"
    ],
    "publicationYear": 2025,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/Reporting-and-Data-Systems/BI-RADS",
    "accessedOn": "2026-08-06",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted professional-society reporting standard",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Use for targeted factual verification and citation only. Do not reproduce manual prose, tables, figures, clinical images, or algorithms. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Current authoritative ACR breast-imaging lexicon for mammographic mass and calcification descriptors.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.d2d731b45c78",
      "claim.n1.6709782fef79",
      "claim.n1.640146b1029b",
      "claim.n1.25cb8cbda68e"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.acr.palpable-breast-masses.2022",
    "title": "ACR Appropriateness Criteria: Palpable Breast Masses",
    "completeCitation": "American College of Radiology. ACR Appropriateness Criteria: Palpable Breast Masses. Revised 2022.",
    "organizationOrJournal": "American College of Radiology",
    "authors": [
      "American College of Radiology Appropriateness Criteria Expert Panel"
    ],
    "publicationYear": 2022,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://acsearch.acr.org/docs/69495/Narrative",
    "accessedOn": "2026-08-06",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted professional-society guidance",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Use for targeted factual verification and citation only; do not reproduce appropriateness tables or protected explanatory wording. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Authoritative radiology-society guidance for initial imaging of a palpable breast mass within its stated variants.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1r3.9f2884215d43"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.acr.palpable-breast-masses.2022-update",
    "title": "ACR Appropriateness Criteria: Palpable Breast Masses, 2022 Update",
    "completeCitation": "Expert Panel on Breast Imaging; Klein KA, Kocher M, Lourenco AP, et al. ACR Appropriateness Criteria Palpable Breast Masses: 2022 Update. J Am Coll Radiol. 2023;20(5S):S146-S163. doi:10.1016/j.jacr.2023.02.013.",
    "organizationOrJournal": "American College of Radiology; Journal of the American College of Radiology",
    "authors": [
      "Katherine A. Klein",
      "Maddi Kocher",
      "Ana P. Lourenco",
      "Bethany L. Niell",
      "Debbie L. Bennett",
      "ACR Expert Panel on Breast Imaging"
    ],
    "publicationYear": 2023,
    "doi": "10.1016/j.jacr.2023.02.013",
    "pmid": "37236740",
    "officialUrl": "https://acsearch.acr.org/docs/69495/Narrative",
    "accessedOn": "2026-08-06",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted professional-society guidance",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Use for targeted factual verification and citation only. Do not reproduce appropriateness tables or protected explanatory wording. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Authoritative radiology-society guidance for initial imaging of a palpable breast mass in its specified age groups.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.ce34a3a54ed6"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.acs.tbi.2024",
    "title": "Best Practices Guidelines for the Management of Traumatic Brain Injury",
    "completeCitation": "American College of Surgeons Trauma Quality Programs. Best Practices Guidelines for the Management of Traumatic Brain Injury. 2024.",
    "organizationOrJournal": "American College of Surgeons Trauma Quality Programs",
    "authors": [
      "American College of Surgeons Trauma Quality Programs"
    ],
    "publicationYear": 2024,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.facs.org/quality-programs/trauma/quality/best-practices-guidelines/",
    "accessedOn": "2026-08-31",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted; targeted verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Use only for targeted factual verification and independently written synthesis. Do not reproduce source prose, tables, figures, or algorithms. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Professional trauma guidance; high authority for traumatic intracranial-bleeding context.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n1.0fc2b1f318e6",
      "claim.n1.5eca14d67493",
      "claim.n1r3.vka-sustained-reversal"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.aga.gastroparesis-guideline.2025",
    "title": "AGA Clinical Practice Guideline on Management of Gastroparesis",
    "completeCitation": "Staller K, Parkman HP, Greer KB, Leiman DA, Zhou MJ, Singh S, Camilleri M, Altayar O; AGA Clinical Guidelines Committee. AGA Clinical Practice Guideline on Management of Gastroparesis. Gastroenterology. 2025;169(5):828-861. doi:10.1053/j.gastro.2025.08.004.",
    "organizationOrJournal": "Gastroenterology / American Gastroenterological Association",
    "authors": [
      "Kyle Staller",
      "Henry P. Parkman",
      "Katarina B. Greer",
      "David A. Leiman",
      "Margaret J. Zhou",
      "Shailendra Singh",
      "Michael Camilleri",
      "Osama Altayar",
      "AGA Clinical Guidelines Committee"
    ],
    "publicationYear": 2025,
    "doi": "10.1053/j.gastro.2025.08.004",
    "pmid": "40976635",
    "officialUrl": "https://gastro.org/clinical-guidance/clinical-guidance-on-the-management-of-gastroparesis/",
    "accessedOn": "2026-08-06",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright AGA Institute and Elsevier; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Use only for targeted factual verification and citation. Do not reproduce guideline prose, tables, evidence profiles, algorithms, or figures. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Current professional-society guideline independently supporting four-hour rather than two-hour-or-shorter gastric emptying testing for suspected gastroparesis.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.b718f6a72a97",
      "claim.n1.e7e333d36883"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.al-busafi.chylous-ascites-review.2014",
    "title": "Chylous Ascites: Evaluation and Management",
    "completeCitation": "Al-Busafi SA, Ghali P, Deschênes M, Wong P. Chylous Ascites: Evaluation and Management. ISRN Hepatol. 2014;2014:240473. doi:10.1155/2014/240473.",
    "organizationOrJournal": "ISRN Hepatology",
    "authors": [
      "Said A. Al-Busafi",
      "Peter Ghali",
      "Marc Deschênes",
      "Philip Wong"
    ],
    "publicationYear": 2014,
    "doi": "10.1155/2014/240473",
    "pmid": "27335837",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4890871/",
    "accessedOn": "2026-08-06",
    "sourceClass": "narrative_review",
    "licenseLabel": "Open-access article; publisher and article-specific reuse terms apply",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Use for targeted factual verification and independently written synthesis only; do not reproduce source prose, figures, or tables. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Peer-reviewed clinical review supporting diagnostic paracentesis with fluid analysis and conservative nutritional management of chylous ascites.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.41c158e0d466",
      "claim.n1.9eec3f70b5d0"
    ]
  },
  {
    "id": "source.ata.radioactive-iodine.undated",
    "title": "Radioactive Iodine",
    "completeCitation": "American Thyroid Association. Radioactive Iodine. Undated; accessed September 9, 2026.",
    "organizationOrJournal": "American Thyroid Association",
    "authors": [
      "American Thyroid Association"
    ],
    "publicationYear": null,
    "publicationDateNote": "Source is explicitly undated; no publication year is claimed.",
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.thyroid.org/radioactive-iodine/",
    "sourceClass": "open_educational_resource",
    "licenseLabel": "Copyrighted American Thyroid Association content",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and citation only; no source-expression reuse or redistribution. Therapeutic iodine-131 facts only. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Professional-society patient education used to cross-check therapeutic iodine-131 lactation and infant-thyroid-protection boundaries.",
    "usageRole": "cross_check",
    "accessedOn": "2026-09-09",
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "evidenceClaimIds": [
      "claim.n1r2.6d89da8ecd7a"
    ]
  },
  {
    "id": "source.ata.thyroid-function-tests.undated",
    "title": "Thyroid Function Tests",
    "completeCitation": "American Thyroid Association. Thyroid Function Tests. Undated; accessed September 9, 2026.",
    "organizationOrJournal": "American Thyroid Association",
    "authors": [
      "American Thyroid Association"
    ],
    "publicationYear": null,
    "publicationDateNote": "Source is explicitly undated; no publication year is claimed.",
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.thyroid.org/thyroid-function-tests/",
    "sourceClass": "open_educational_resource",
    "licenseLabel": "Copyrighted American Thyroid Association content",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and citation only; no source-expression reuse or redistribution. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Professional-society patient education used for the thyroid-function versus etiologic-antibody distinction.",
    "usageRole": "evidence",
    "accessedOn": "2026-09-09",
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "evidenceClaimIds": [
      "claim.n1.dae1a9bf76fe",
      "claim.n1r3.graves-tsh-lag"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.bhardwaj.chylous-ascites-review.2018",
    "title": "Chylous Ascites: A Review of Pathogenesis, Diagnosis and Treatment",
    "completeCitation": "Bhardwaj R, Vaziri H, Gautam A, Ballesteros E, Karimeddini D, Wu GY. Chylous Ascites: A Review of Pathogenesis, Diagnosis and Treatment. J Clin Transl Hepatol. 2018;6(1):105-113. doi:10.14218/JCTH.2017.00035.",
    "organizationOrJournal": "Journal of Clinical and Translational Hepatology",
    "authors": [
      "Rohit Bhardwaj",
      "Haleh Vaziri",
      "Anuj Gautam",
      "Enrique Ballesteros",
      "Darius Karimeddini",
      "George Y. Wu"
    ],
    "publicationYear": 2018,
    "doi": "10.14218/JCTH.2017.00035",
    "pmid": "29577037",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5863006/",
    "accessedOn": "2026-08-06",
    "sourceClass": "narrative_review",
    "licenseLabel": "Creative Commons Attribution-NonCommercial 4.0 International",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Use with attribution for noncommercial development; retain the noncommercial restriction and do not reproduce source prose, figures, or tables. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Peer-reviewed review independently supporting the imaging-composition boundary, fluid confirmation, dietary therapy, symptom-directed drainage, and escalation only for selected persistent cases.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.n1.41c158e0d466",
      "claim.n1.8a0b5986a99c",
      "claim.n1.9eec3f70b5d0"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.bishr.uk-abs-phyllodes.2025",
    "title": "Contemporary management of phyllodes tumours of the breast: recommendations from the UK Association of Breast Surgery",
    "completeCitation": "Bishr MK, Humphreys A, Ahmed M, Cox K, Hughes A, Isherwood J, Pinder SE, Remoundos DD, Sawyer E, Tamimy MS, Whisker L. Contemporary management of phyllodes tumours of the breast: recommendations from the UK Association of Breast Surgery. BJS. 2025;112(8):znaf152. doi:10.1093/bjs/znaf152. PMID: 40847758. PMCID: PMC12374188.",
    "organizationOrJournal": "UK Association of Breast Surgery; BJS",
    "authors": [
      "M K Bishr",
      "A Humphreys",
      "M Ahmed",
      "K Cox",
      "A Hughes",
      "J Isherwood",
      "S E Pinder",
      "D D Remoundos",
      "E Sawyer",
      "M S Tamimy",
      "L Whisker"
    ],
    "publicationYear": 2025,
    "doi": "10.1093/bjs/znaf152",
    "pmid": "40847758",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12374188/",
    "accessedOn": "2026-08-31",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution-NonCommercial 4.0 International",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "CC BY-NC 4.0 material requires attribution and noncommercial reuse. This package stores only independently written claims and bibliographic metadata, not source prose, tables, figures, or algorithms. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "2025 UK Association of Breast Surgery recommendations, used for targeted verification of pathology-follow-up and counseling boundaries; margin intervals remain evidence-sensitive consensus management guidance.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.49101d9d3b5b",
      "claim.n1.8ace163cc27a",
      "claim.n1.bb08015a8192",
      "claim.n1.66ccd63686fe",
      "claim.n1.866880df6471",
      "claim.n1.e09de46b1f33",
      "claim.n1.f580ee9e46ac",
      "claim.n1.2ac9c5b4784e",
      "claim.n1.94adc8a176b5",
      "claim.n1r3.axillary-core-scope",
      "claim.n1r3.current-grade-margin-scope",
      "claim.n1r3.phyllodes-posterior-plane"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.blouhos.meckel-adult-surgical-concerns.2018",
    "title": "Meckel's Diverticulum in Adults: Surgical Concerns",
    "completeCitation": "Blouhos K, Boulas KA, Tsalis K, Barettas N, Paraskeva A, Kariotis I, Keskinis C, Hatzigeorgiadis A. Meckel's Diverticulum in Adults: Surgical Concerns. Front Surg. 2018;5:55. doi:10.3389/fsurg.2018.00055.",
    "organizationOrJournal": "Frontiers in Surgery",
    "authors": [
      "Konstantinos Blouhos",
      "Konstantinos A. Boulas",
      "Konstantinos Tsalis",
      "Nikolaos Barettas",
      "Aikaterini Paraskeva",
      "Ioannis Kariotis",
      "Christodoulos Keskinis",
      "Anestis Hatzigeorgiadis"
    ],
    "publicationYear": 2018,
    "doi": "10.3389/fsurg.2018.00055",
    "pmid": "30234126",
    "officialUrl": "https://www.frontiersin.org/journals/surgery/articles/10.3389/fsurg.2018.00055/full",
    "accessedOn": "2026-08-06",
    "sourceClass": "narrative_review",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Use with attribution for independently written factual synthesis. Do not reproduce the article's prose, tables, figures, or operative algorithm. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Open adult surgical review relating resection extent to the integrity of the diverticular base and adjacent ileum and describing diverticulectomy for long diverticula with simple distal diverticulitis.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.n1.a667976ba66d",
      "claim.n1.716431389a46",
      "claim.n1.a10ad9a5021b"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.board.dvt-ash-2014",
    "title": "Choosing Wisely recommendation on duration of anticoagulation",
    "completeCitation": "American Society of Hematology. Choosing Wisely recommendation 6. 2014 expansion. Accessed 2026-09-12.",
    "organizationOrJournal": "American Society of Hematology",
    "authors": [
      "American Society of Hematology"
    ],
    "publicationYear": 2014,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.hematology.org/education/clinicians/guidelines-and-quality-care/choosing-wisely",
    "accessedOn": "2026-09-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted professional-society recommendation",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification only; independently written content. N1 reuses locally recorded atomic synthesis and bibliographic metadata only; no source text, table, figure or excerpt was retrieved or copied. Access date is inherited; N1 did not refresh it. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Supports finite three-month treatment after first VTE caused by resolved major transient surgery risk.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1r2.named-enoxaparin-role",
      "claim.n1.8a0b2ca37037",
      "claim.n1r3.residual-dvt-not-failure"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.board.dvt-cdc-2024",
    "title": "Testing and Diagnosis for Venous Thromboembolism",
    "completeCitation": "Centers for Disease Control and Prevention. Testing and Diagnosis for Venous Thromboembolism. May 15, 2024. Accessed 2026-09-12.",
    "organizationOrJournal": "Centers for Disease Control and Prevention",
    "authors": [
      "Centers for Disease Control and Prevention"
    ],
    "publicationYear": 2024,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.cdc.gov/blood-clots/testing-diagnosis/index.html",
    "accessedOn": "2026-09-12",
    "sourceClass": "government_guidance",
    "licenseLabel": "U.S. government material; conditions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Original factual synthesis only. N1 reuses locally recorded atomic synthesis and bibliographic metadata only; no source text, table, figure or excerpt was retrieved or copied. Access date is inherited; N1 did not refresh it. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Direct support for ultrasound evaluation of suspected DVT.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.9c12bef8ae65",
      "claim.n1r3.proximal-venous-waveform"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.board.dvt-nhlbi-diagnosis-2022",
    "title": "Venous Thromboembolism: Deep Vein Thrombosis (DVT)",
    "completeCitation": "National Heart, Lung, and Blood Institute. Venous Thromboembolism: Deep Vein Thrombosis (DVT). Updated September 19, 2022. Accessed 2026-09-12.",
    "organizationOrJournal": "National Heart, Lung, and Blood Institute",
    "authors": [
      "National Heart, Lung, and Blood Institute"
    ],
    "publicationYear": 2022,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.nhlbi.nih.gov/health/deep-vein-thrombosis",
    "accessedOn": "2026-09-12",
    "sourceClass": "government_guidance",
    "licenseLabel": "U.S. government material; conditions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Original factual synthesis only; explicitly copyrighted third-party video excluded. N1 reuses locally recorded atomic synthesis and bibliographic metadata only; no source text, table, figure or excerpt was retrieved or copied. Access date is inherited; N1 did not refresh it. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Cross-check for postoperative risk, characteristic symptoms, and compression-ultrasound findings.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n1.9c12bef8ae65",
      "claim.n1r3.proximal-venous-waveform"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.board.dvt-nhlbi-treatment-2022",
    "title": "Venous Thromboembolism: Treatment",
    "completeCitation": "National Heart, Lung, and Blood Institute. Venous Thromboembolism: Treatment. Updated September 20, 2022. Accessed 2026-09-12.",
    "organizationOrJournal": "National Heart, Lung, and Blood Institute",
    "authors": [
      "National Heart, Lung, and Blood Institute"
    ],
    "publicationYear": 2022,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.nhlbi.nih.gov/health/venous-thromboembolism/treatment",
    "accessedOn": "2026-09-12",
    "sourceClass": "government_guidance",
    "licenseLabel": "U.S. government material; conditions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Original factual synthesis only. N1 reuses locally recorded atomic synthesis and bibliographic metadata only; no source text, table, figure or excerpt was retrieved or copied. Access date is inherited; N1 did not refresh it. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Cross-check for anticoagulation as treatment and the filter boundary when anticoagulation is possible.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n1r2.named-enoxaparin-role",
      "claim.n1.8a0b2ca37037",
      "claim.n1r3.residual-dvt-not-failure"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.board.primary-aldosteronism-endocrine-society-2025",
    "title": "Primary Aldosteronism: An Endocrine Society Clinical Practice Guideline",
    "completeCitation": "Adler GK, Stowasser M, Correa RR, Khan N, Kline G, McGowan MJ, Mulatero P, Murad MH, Touyz RM, Vaidya A, Williams TA, Yang J, Young WF, Zennaro MC, Brito JP. Primary Aldosteronism: An Endocrine Society Clinical Practice Guideline. Journal of Clinical Endocrinology & Metabolism. 2025;110(9):2453-2495. doi:10.1210/clinem/dgaf284. Official society page updated July 14, 2025. Accessed 2026-09-12.",
    "organizationOrJournal": "Endocrine Society / Journal of Clinical Endocrinology & Metabolism",
    "authors": [
      "GK Adler",
      "M Stowasser",
      "RR Correa",
      "N Khan",
      "G Kline",
      "MJ McGowan",
      "P Mulatero",
      "MH Murad",
      "RM Touyz",
      "A Vaidya",
      "TA Williams",
      "J Yang",
      "WF Young",
      "MC Zennaro",
      "JP Brito"
    ],
    "publicationYear": 2025,
    "doi": "10.1210/clinem/dgaf284",
    "pmid": "40658480",
    "officialUrl": "https://www.endocrine.org/clinical-practice-guidelines/primary-aldosteronism-2",
    "accessedOn": "2026-09-12",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright © 2025 Endocrine Society",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification from the official society recommendation page and PubMed metadata; OUP full article was not ingested. N1 reuses locally recorded atomic synthesis and bibliographic metadata only; no source text, table, figure or excerpt was retrieved or copied. Access date is inherited; N1 did not refresh it. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Current primary guideline for prepared ARR screening, overt-phenotype confirmation boundary, and CT plus AVS before surgical lateralization.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.c9e80d7dd8ad",
      "claim.n1.228e2a181e73",
      "claim.n1.edd802be1c43"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.bread-butter.acr-palpable-breast-mass-2023",
    "title": "ACR Appropriateness Criteria Palpable Breast Masses: 2022 Update",
    "completeCitation": "Expert Panel on Breast Imaging; Klein KA, Kocher M, Lourenco AP, et al. ACR Appropriateness Criteria Palpable Breast Masses: 2022 Update. J Am Coll Radiol. 2023;20:S146-S163. doi:10.1016/j.jacr.2023.02.013. PMID:37236740.",
    "organizationOrJournal": "American College of Radiology / Journal of the American College of Radiology",
    "authors": [
      "Expert Panel on Breast Imaging",
      "Katherine A Klein",
      "Maddi Kocher",
      "Ana P Lourenco",
      "Bethany L Niell",
      "Debbie L Bennett",
      "Alison Chetlen",
      "Phoebe Freer",
      "Lillian K Ivansco",
      "Maxine S Jochelson",
      "Mallory E Kremer",
      "Sharp F Malak",
      "Marion McCrary",
      "Tejas S Mehta",
      "Colleen H Neal",
      "Andrea Porpiglia",
      "Gary A Ulaner",
      "Linda Moy"
    ],
    "publicationYear": 2023,
    "doi": "10.1016/j.jacr.2023.02.013",
    "pmid": "37236740",
    "officialUrl": "https://pubmed.ncbi.nlm.nih.gov/37236740/",
    "accessedOn": "2026-09-17",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted professional-society guidance",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification from the bibliographic abstract; no source prose, table, or algorithm reproduced. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Specialty-society appropriateness guidance supporting tissue sampling for suspicious imaging findings.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1r2.4ffb2fc1fbe9"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.bread-butter.herniasurge-2018",
    "title": "International guidelines for groin hernia management",
    "completeCitation": "The HerniaSurge Group. International guidelines for groin hernia management. Hernia. 2018;22(1):1-165. doi:10.1007/s10029-017-1668-x. PMID:29330835. PMCID:PMC5809582.",
    "organizationOrJournal": "Hernia / HerniaSurge Group",
    "authors": [
      "The HerniaSurge Group"
    ],
    "publicationYear": 2018,
    "doi": "10.1007/s10029-017-1668-x",
    "pmid": "29330835",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5809582/",
    "accessedOn": "2026-09-17",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution-NonCommercial 4.0 International",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Attributed original factual synthesis for noncommercial development; no source prose, tables, figures, or algorithms reproduced. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Multisociety international guideline defining the selected watchful-waiting phenotype and timely femoral-hernia repair direction.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1r3.7b235321cfc5"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.bread-butter.herniasurge-update-2023",
    "title": "Update of the international HerniaSurge guidelines for groin hernia management",
    "completeCitation": "Stabilini C, van Veenendaal N, Aasvang E, et al. Update of the international HerniaSurge guidelines for groin hernia management. BJS Open. 2023;7(5):zrad080. doi:10.1093/bjsopen/zrad080. PMID:37862616.",
    "organizationOrJournal": "BJS Open / HerniaSurge Collaboration",
    "authors": [
      "Cesare Stabilini",
      "Nadine van Veenendaal",
      "Eske Aasvang",
      "Ferdinando Agresta",
      "Theo Aufenacker",
      "Frederik Berrevoet",
      "Ine Burgmans",
      "David Chen",
      "Andrew de Beaux",
      "Barbora East",
      "José Garcia-Alamino",
      "Nadia Henriksen",
      "Ferdinand Köckerling",
      "Jan Kukleta",
      "Maarten Loos",
      "Manuel Lopez-Cano",
      "Ralph Lorenz",
      "Marc Miserez",
      "Agneta Montgomery",
      "Salvador Morales-Conde",
      "Chris Oppong",
      "Maciej Pawlak",
      "Mauro Podda",
      "Wolfgang Reinpold",
      "David Sanders",
      "Alberto Sartori",
      "Hanh Minh Tran",
      "Mireia Verdaguer",
      "Reiko Wiessner",
      "Michael Yeboah",
      "Willem Zwaans",
      "Maarten Simons"
    ],
    "publicationYear": 2023,
    "doi": "10.1093/bjsopen/zrad080",
    "pmid": "37862616",
    "officialUrl": "https://academic.oup.com/bjsopen/article/7/5/zrad080/7325871",
    "accessedOn": "2026-09-17",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Original factual synthesis with citation; no source prose, tables, figures, or algorithms reproduced. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Current international guideline update corroborating safety and later crossover for watchful waiting in selected men.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n1r3.7b235321cfc5"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.bread-butter.picasso-groin-ultrasound-2021",
    "title": "High-resolution ultrasound of spigelian and groin hernias: a closer look at fascial architecture and aponeurotic passageways",
    "completeCitation": "Picasso R, Pistoia F, Zaottini F, Airaldi S, Miguel Perez M, Pansecchi M, Tovt L, Sanguinetti S, Moller I, Bruns A, Martinoli C. High-resolution ultrasound of spigelian and groin hernias: a closer look at fascial architecture and aponeurotic passageways. J Ultrason. 2021;21(84):e53-e62. doi:10.15557/JoU.2021.0008. PMID:33791116. PMCID:PMC8008201.",
    "organizationOrJournal": "Journal of Ultrasonography / Polish Ultrasound Society",
    "authors": [
      "Picasso R",
      "Pistoia F",
      "Zaottini F",
      "Airaldi S",
      "Miguel Perez M",
      "Pansecchi M",
      "Tovt L",
      "Sanguinetti S",
      "Moller I",
      "Bruns A",
      "Martinoli C"
    ],
    "publicationYear": 2021,
    "doi": "10.15557/JoU.2021.0008",
    "pmid": "33791116",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8008201/",
    "accessedOn": "2026-09-17",
    "sourceClass": "narrative_review",
    "licenseLabel": "Creative Commons Attribution-NonCommercial-NoDerivatives",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Only an independently written anatomy fact is stored; no source prose, images, diagrams, videos, or tables reproduced. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Open peer-reviewed imaging-anatomy review directly supporting the deep-ring and vessel relationship.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1r2.1c9136f72fb2"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.bsg.iron-deficiency-anaemia.2021",
    "title": "British Society of Gastroenterology guidelines for the management of iron deficiency anaemia in adults",
    "completeCitation": "Snook J, Bhala N, Beales ILP, Cannings D, Kightley C, Logan RPH, Pritchard DM, Sidhu R, Surgenor S, Thomas W, Verma AM, Goddard AF. British Society of Gastroenterology guidelines for the management of iron deficiency anaemia in adults. Gut. 2021;70(11):2030-2051. doi:10.1136/gutjnl-2021-325210.",
    "organizationOrJournal": "Gut",
    "authors": [
      "Snook J",
      "Bhala N",
      "Beales ILP",
      "Cannings D",
      "Kightley C",
      "Logan RPH",
      "Pritchard DM",
      "Sidhu R",
      "Surgenor S",
      "Thomas W",
      "Verma AM",
      "Goddard AF"
    ],
    "publicationYear": 2021,
    "doi": "10.1136/gutjnl-2021-325210",
    "pmid": null,
    "officialUrl": "https://www.bsg.org.uk/clinical-resource/guidelines-iron-deficiency-anaemia-in-adults",
    "accessedOn": "2026-09-09",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution-NonCommercial 4.0 International",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Original factual synthesis under https://creativecommons.org/licenses/by-nc/4.0/ . Development use only; commercial reuse requires renewed rights review or permission. No source prose, tables, or algorithms copied. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Externally peer-reviewed society guideline directly checked in the official PDF; BSG review in 2026 does not change the 2021 publication year.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1r3.acefc98ce84f"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.burn.aba-referral-2022",
    "title": "ABA Guidelines for Burn Patient Referral",
    "completeCitation": "American Burn Association. Guidelines for Burn Patient Referral: Advice on Transfer and Consultation. 2022.",
    "organizationOrJournal": "American Burn Association",
    "authors": [
      "American Burn Association"
    ],
    "publicationYear": 2022,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.ameriburn.org/burn-care-team/resources/guidelines-for-burn-patient-referral",
    "accessedOn": "2026-09-28",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted guidance; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced. N1 reuses locally recorded atomic synthesis and bibliographic metadata only; no source text, table, figure or excerpt was retrieved or copied. Access date is inherited; N1 did not refresh it. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Professional-society authority for burn depth descriptors and consultation/transfer factors.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.041c942faf2d",
      "claim.n1.8e0e2cdeb284",
      "claim.n1.7be9fe6e82d2",
      "claim.n1.f4db77ade866",
      "claim.n1r3.burn-release-scope"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.burn.aha-redcross-2024",
    "title": "2024 Guidelines for First Aid",
    "completeCitation": "American Heart Association and American Red Cross. 2024 Guidelines for First Aid: Thermal Burns. 2024.",
    "organizationOrJournal": "American Heart Association and American Red Cross",
    "authors": [
      "American Heart Association",
      "American Red Cross"
    ],
    "publicationYear": 2024,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://cpr.heart.org/en/resuscitation-science/2024-first-aid-guidelines",
    "accessedOn": "2026-09-28",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted guidance; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced. N1 reuses locally recorded atomic synthesis and bibliographic metadata only; no source text, table, figure or excerpt was retrieved or copied. Access date is inherited; N1 did not refresh it. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Independent first-aid guideline cross-check for burn assessment and referral.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.7be9fe6e82d2",
      "claim.n1.f4db77ade866",
      "claim.n1r3.burn-release-scope"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.caputo.thoracic-trauma-approach.2024",
    "title": "Thoracic Trauma: Current Approach in Emergency Medicine",
    "completeCitation": "Caputo G, Meda S, Piccioni A, et al. Thoracic Trauma: Current Approach in Emergency Medicine. Clin Pract. 2024;14(5):1869-1885. doi:10.3390/clinpract14050148.",
    "organizationOrJournal": "Clinical Practice",
    "authors": [
      "Giorgia Caputo",
      "Stefano Meda",
      "Andrea Piccioni",
      "Angela Saviano",
      "Veronica Ojetti",
      "Gabriele Savioli",
      "Gaia Bavestrello Piccini",
      "Chiara Ferrari",
      "Antonio Voza",
      "Lavinia Pellegrini",
      "Miriam Ottaviani",
      "Federica Spadazzi",
      "Gianpietro Volonnino",
      "Raffaele La Russa"
    ],
    "publicationYear": 2024,
    "doi": "10.3390/clinpract14050148",
    "pmid": "39311298",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11417912/",
    "accessedOn": "2026-08-06",
    "sourceClass": "narrative_review",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Use with attribution for independently written factual synthesis. Do not reproduce the article's tables, figures, or extended prose. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Recent open review mapping proximal esophagus and azygos exposure to right thoracotomy, upper and middle esophageal injury to a right posterolateral approach, and emergency-department resuscitative access to an anterior incision.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.n1.c2583fb48102",
      "claim.n1.f54f71900adc",
      "claim.n1.5058009b6a15"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.ding.perforated-meckel-adults.2012",
    "title": "Laparoscopic Management of Perforated Meckel's Diverticulum in Adults",
    "completeCitation": "Ding Y, Zhou Y, Ji Z, Zhang J, Wang Q. Laparoscopic Management of Perforated Meckel's Diverticulum in Adults. Int J Med Sci. 2012;9(3):243-247. doi:10.7150/ijms.4170.",
    "organizationOrJournal": "International Journal of Medical Sciences",
    "authors": [
      "Yinlu Ding",
      "Yong Zhou",
      "Zhipeng Ji",
      "Jianliang Zhang",
      "Qisan Wang"
    ],
    "publicationYear": 2012,
    "doi": "10.7150/ijms.4170",
    "pmid": "22577339",
    "officialUrl": "https://www.medsci.org/v09p0243.htm",
    "accessedOn": "2026-08-06",
    "sourceClass": "observational_study",
    "licenseLabel": "Creative Commons Attribution-NonCommercial-NoDerivatives 3.0",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Use for targeted factual verification and independently written synthesis only. The source's noncommercial and no-derivatives terms prohibit adapting its protected expression. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Small retrospective adult perforation series that operationally labeled base width of 2 cm or greater as broad and less than 2 cm as narrow; it does not establish a universal threshold.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.716431389a46",
      "claim.n1.a10ad9a5021b"
    ]
  },
  {
    "id": "source.eanm.benign-thyroid-rai-guideline.2023",
    "title": "The EANM guideline on radioiodine therapy of benign thyroid disease",
    "completeCitation": "Campennì A, Avram AM, Verburg FA, Iakovou I, Hänscheid H, de Keizer B, Petranović Ovčariček P, Giovanella L. The EANM guideline on radioiodine therapy of benign thyroid disease. European Journal of Nuclear Medicine and Molecular Imaging. 2023;50:3324–3348. doi:10.1007/s00259-023-06274-5.",
    "organizationOrJournal": "European Association of Nuclear Medicine; European Journal of Nuclear Medicine and Molecular Imaging",
    "authors": [
      "Campennì A",
      "Avram AM",
      "Verburg FA",
      "Iakovou I",
      "Hänscheid H",
      "de Keizer B",
      "Petranović Ovčariček P",
      "Giovanella L"
    ],
    "publicationYear": 2023,
    "doi": "10.1007/s00259-023-06274-5",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1007/s00259-023-06274-5",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "CC BY 4.0: https://creativecommons.org/licenses/by/4.0/. This record uses original factual synthesis with attribution and a change notice; it does not reproduce source prose, tables, figures, or algorithms. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Professional guideline used as direct authority for therapeutic iodine-131 selection and pregnancy, lactation, and thyroid-eye-disease boundaries.",
    "usageRole": "evidence",
    "accessedOn": "2026-09-09",
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "evidenceClaimIds": [
      "claim.n1.25d060186678",
      "claim.n1r2.6d89da8ecd7a",
      "claim.n1r2.named-methimazole",
      "claim.n1r2.named-propranolol",
      "claim.n1r3.beta-blocker-slow-pulse",
      "claim.n1r3.graves-tsh-lag"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.east.trauma-nutritional-support.2004",
    "title": "Practice Management Guidelines for Nutritional Support of the Trauma Patient",
    "completeCitation": "Jacobs DG, Jacobs DO, Kudsk KA, et al.; EAST Practice Management Guidelines Work Group. Practice management guidelines for nutritional support of the trauma patient. J Trauma. 2004;57(3):660-679.",
    "organizationOrJournal": "Eastern Association for the Surgery of Trauma; Journal of Trauma",
    "authors": [
      "David G. Jacobs",
      "Danny O. Jacobs",
      "Kenneth A. Kudsk",
      "Frederick A. Moore",
      "EAST Practice Management Guidelines Work Group"
    ],
    "publicationYear": 2004,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.east.org/education-resources/practice-management-guidelines/details/nutritional-support-timing-early-versus-delayed-enteral-feedings-update-in-process",
    "accessedOn": "2026-08-06",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted professional-society guidance; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Use only for targeted factual verification and citation. Do not reproduce protected recommendation wording, evidentiary tables, or extended prose. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Professional-society trauma nutrition guidance supporting early intragastric feeding in severe burns and identifying incomplete resuscitation as a safety boundary.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n1.72256312b855",
      "claim.n1.84c927796922",
      "claim.n1.f73aaaad7469"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
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
    "reuseNotes": "Use with attribution for independently written factual synthesis. Do not reproduce guideline tables, algorithms, figures, or extended prose. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Current European Hernia Society guidance conditionally favoring permanent macroporous synthetic mesh over other mesh types in selected emergency mesh-based primary ventral or incisional hernia repairs, with low to very-low evidence certainty.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.e22669366268",
      "claim.n1.8e30265aebbd",
      "claim.n1.4b2bd6d4bf88"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.espen.clinical-nutrition-surgery.2025",
    "title": "ESPEN guideline on clinical nutrition in surgery - Update 2025",
    "completeCitation": "Weimann A, Bezmarevic M, Braga M, et al. ESPEN guideline on clinical nutrition in surgery - Update 2025. Clin Nutr. 2025;53:222-261. doi:10.1016/j.clnu.2025.08.029.",
    "organizationOrJournal": "Clinical Nutrition / European Society for Clinical Nutrition and Metabolism",
    "authors": [
      "Arved Weimann",
      "Mihailo Bezmarevic",
      "Marco Braga",
      "M. Isabel T. D. Correia",
      "Pamela Funk-Debleds",
      "Luca Gianotti",
      "Chelsia Gillis",
      "Martin Hübner",
      "Jesus Fernando B. Inciong",
      "Mohammad Shukri Jahit",
      "Stanislaw Klek",
      "Takayuki Kori",
      "Alessandro Laviano",
      "Olle Ljungqvist",
      "Dileep N. Lobo",
      "Carmelo Loinaz Segurola",
      "Isacco Montroni",
      "B. Ravinder Reddy",
      "Nicole M. Saur",
      "Anna Schweinlin",
      "Han-Ping Shi",
      "Hiroya Takeuchi",
      "Dan L. Waitzberg",
      "Ola Wallengren",
      "Paul E. Wischmeyer",
      "Dirk Ysebaert",
      "Stephan C. Bischoff"
    ],
    "publicationYear": 2025,
    "doi": "10.1016/j.clnu.2025.08.029",
    "pmid": "40957230",
    "officialUrl": "https://pubmed.ncbi.nlm.nih.gov/40957230/",
    "accessedOn": "2026-08-06",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright European Society for Clinical Nutrition and Metabolism and Elsevier; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Use only for targeted factual verification and citation. Do not reproduce guideline prose, recommendation tables, decision flowcharts, or figures. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Current professional-society guideline supporting early nutritional assessment and parenteral support when postoperative gastrointestinal dysfunction prevents adequate oral or enteral nutrition.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.d585be062067",
      "claim.n1.c1bd8baa573c",
      "claim.n1.6aa4b6371145"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.espen.hospital-nutrition.2021",
    "title": "ESPEN guideline on hospital nutrition",
    "completeCitation": "Thibault R, Abbasoglu O, Ioannou E, et al. ESPEN guideline on hospital nutrition. Clin Nutr. 2021;40(12):5684-5709. doi:10.1016/j.clnu.2021.09.039.",
    "organizationOrJournal": "European Society for Clinical Nutrition and Metabolism; Clinical Nutrition",
    "authors": [
      "Ronan Thibault",
      "Osman Abbasoglu",
      "Evangelia Ioannou",
      "European Society for Clinical Nutrition and Metabolism"
    ],
    "publicationYear": 2021,
    "doi": "10.1016/j.clnu.2021.09.039",
    "pmid": "34742138",
    "officialUrl": "https://clinicalnutrition.espen.org/files/ESPEN-Guidelines/ESPEN_guideline_on_hospital_nutrition.pdf",
    "accessedOn": "2026-08-06",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted professional-society guidance; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Use for targeted factual verification and citation only; do not reproduce protected recommendations, tables, or algorithms. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Multidisciplinary nutrition guidance supporting a low-long-chain-triglyceride diet enriched with medium-chain triglycerides for a proven chyle leak while recognizing the limited evidence base.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.9eec3f70b5d0"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.fda.kcentra.2023",
    "title": "Kcentra",
    "completeCitation": "U.S. Food and Drug Administration. Kcentra. 2023 approval information and prescribing-information locator.",
    "organizationOrJournal": "U.S. Food and Drug Administration",
    "authors": [
      "U.S. Food and Drug Administration"
    ],
    "publicationYear": 2023,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.fda.gov/vaccines-blood-biologics/approved-blood-products/kcentra",
    "accessedOn": "2026-08-31",
    "sourceClass": "government_guidance",
    "licenseLabel": "U.S. government work; public-domain conditions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Use only for targeted factual verification and independently written synthesis. Check FDA page-specific notices before reuse. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "U.S. regulatory product information; high authority for labeled VKA urgent-reversal indication and product identity.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.n1.9e8ad73ce186",
      "claim.n1.0fc2b1f318e6",
      "claim.n1.5eca14d67493",
      "claim.n1r3.vka-sustained-reversal"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.french-panel.metabolic-acidosis.2019",
    "title": "Diagnosis and management of metabolic acidosis: guidelines from a French expert panel",
    "completeCitation": "Jung B, Martinez M, Claessens YE, Darmon M, Klouche K, Lautrette A, Levraut J, Maury E, Oberlin M, Terzi N, Viglino D, Yordanov Y, Claret PG, Bigé N; SRLF; SFMU. Diagnosis and management of metabolic acidosis: guidelines from a French expert panel. Ann Intensive Care. 2019;9:92. doi:10.1186/s13613-019-0563-2.",
    "organizationOrJournal": "Annals of Intensive Care / SRLF / SFMU",
    "authors": [
      "Boris Jung",
      "Mikaël Martinez",
      "Yann-Erick Claessens",
      "Michaël Darmon",
      "Kada Klouche",
      "Alexandre Lautrette",
      "Jacques Levraut",
      "Eric Maury",
      "Mathieu Oberlin",
      "Nicolas Terzi",
      "Damien Viglino",
      "Youri Yordanov",
      "Pierre-Géraud Claret",
      "Naïke Bigé",
      "Société de Réanimation de Langue Française",
      "Société Française de Médecine d'Urgence"
    ],
    "publicationYear": 2019,
    "doi": "10.1186/s13613-019-0563-2",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s13613-019-0563-2",
    "accessedOn": "2026-10-03",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International; https://creativecommons.org/licenses/by/4.0/; attribution, source and license links, and change indication required; third-party material may have separate terms",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Formal multidisciplinary guideline; R1.1 is expert opinion and R1.3 is Grade 2+. Diagnostic physiology only; management currency is not inferred.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1r2.94bfa8e95e0e",
      "claim.n1r2.gas-record-interpretation",
      "claim.n1r2.a64275d45f37",
      "claim.n1r3.co2-ventilatory-response"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.gs028e.czempik_mixing2020",
    "title": "Isolated prolongation of activated partial thromboplastin time in intensive care unit patients",
    "completeCitation": "Czempik PF, Żurawska E, Krzych ŁJ. Isolated prolongation of activated partial thromboplastin time in intensive care unit patients: a practical diagnostic algorithm and management options. Anaesthesiol Intensive Ther. 2020;52(2):165–170. Published June 28, 2020. doi:10.5114/ait.2020.96484. Printed p. 168 / physical PDF p. 4, mixing-study discussion following congenital causes; accessed October 7, 2026.",
    "organizationOrJournal": "Anaesthesiology Intensive Therapy; Polish Society of Anaesthesiology and Intensive Therapy",
    "authors": [
      "Piotr F. Czempik",
      "Elżbieta Żurawska",
      "Łukasz J. Krzych"
    ],
    "publicationYear": 2020,
    "doi": "10.5114/ait.2020.96484",
    "pmid": null,
    "officialUrl": "https://www.ait-journal.com/pdf-120403-121971",
    "accessedOn": "2026-10-07",
    "sourceClass": "narrative_review",
    "licenseLabel": "Author institutional record confirms CC BY-NC-SA 4.0, https://creativecommons.org/licenses/by-nc-sa/4.0/, https://ppm.sum.edu.pl/info/article/SUMad15725785874be7b52463ed0a761ea2?lang=en. The schema lacks an SA category; conservative targeted factual verification only. Czempik, Żurawska and Krzych and original publication credited; no source expression adapted or redistributed.",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced. N1 reuses locally recorded atomic synthesis and bibliographic metadata only; no source text, table, figure or excerpt was retrieved or copied. Access date is inherited; N1 did not refresh it. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Independent society-journal review supports initial immediate/incubated correction-versus-inhibition patterns, laboratory-specific criteria and specimen/drug limitations. Its ICU algorithm is not generalized to all preoperative patients, and its local-laboratory statement does not establish this game's onsite capability.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.n1.1d724576493f",
      "claim.n1.5e25f9e918c6",
      "claim.n1.b02be3363804"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.gs028e.tiede_mixing2020",
    "title": "International recommendations on the diagnosis and treatment of acquired hemophilia A",
    "completeCitation": "Tiede A, Collins P, Knoebl P, Teitel J, Kessler C, Shima M, Di Minno G, d’Oiron R, Salaj P, Jiménez-Yuste V, Huth-Kühne A, Giangrande P. International recommendations on the diagnosis and treatment of acquired hemophilia A. Haematologica. 2020;105(7):1791–1801. doi:10.3324/haematol.2019.230771. PMID:32381574. Diagnosis, Mixing tests; accessed October 7, 2026.",
    "organizationOrJournal": "Haematologica; Ferrata Storti Foundation",
    "authors": [
      "Andreas Tiede",
      "Peter Collins",
      "Paul Knoebl",
      "Jerome Teitel",
      "Craig Kessler",
      "Midori Shima",
      "Giovanni Di Minno",
      "Roseline d’Oiron",
      "Peter Salaj",
      "Victor Jiménez-Yuste",
      "Angela Huth-Kühne",
      "Paul Giangrande"
    ],
    "publicationYear": 2020,
    "doi": "10.3324/haematol.2019.230771",
    "pmid": "32381574",
    "officialUrl": "https://haematologica.org/article/view/9931",
    "accessedOn": "2026-10-07",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Publisher default is CC BY-NC; article-specific license version not verified. Rights: https://haematologica.org/rights-and-permissions and /our-policies. Targeted guideline factual verification only; no expression, algorithm or commercial text mining.",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced. N1 reuses locally recorded atomic synthesis and bibliographic metadata only; no source text, table, figure or excerpt was retrieved or copied. Access date is inherited; N1 did not refresh it. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "International consensus guideline supports the conditional role of mixing tests when immediate FVIII:C is unavailable, parallel factor assays, time-dependent inhibitors and inability of mixing alone to establish or exclude acquired hemophilia A. No universal mandatory next-test rule or bleeding-risk prediction is authored.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.1d724576493f",
      "claim.n1.5e25f9e918c6",
      "claim.n1.b02be3363804"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.gs028f.auspen_refeeding2025",
    "title": "AuSPEN consensus statements on refeeding syndrome",
    "completeCitation": "Matthews-Rensch K, Blackwood K, Lawlis D, Breik L, McLean C, Nguyen T, Phillips S, Small K, Stewart T, Thatcher A, Venkat L, Brodie E, Cleeve B, Diamond L, Ng MY, Small A, Viner Smith E, Asrani V. The Australasian Society of Parenteral and Enteral Nutrition: Consensus statements on refeeding syndrome. Nutrition & Dietetics. 2025;82(2):128–142. Published March 16, 2025. doi:10.1111/1747-0080.70003. PMID:40090863. Accessed October 7, 2026.",
    "organizationOrJournal": "Australasian Society of Parenteral and Enteral Nutrition; Nutrition & Dietetics",
    "authors": [
      "Kylie Matthews-Rensch",
      "Kirrilee Blackwood",
      "Deborah Lawlis",
      "Lina Breik",
      "Cameron McLean",
      "Truc Nguyen",
      "Sarah Phillips",
      "Kimberly Small",
      "Tim Stewart",
      "Amber Thatcher",
      "Leanne Venkat",
      "Emily Brodie",
      "Brydie Cleeve",
      "Lauren Diamond",
      "Mei Yuen Ng",
      "Anna Small",
      "Elizabeth Viner Smith",
      "Varsha Asrani"
    ],
    "publicationYear": 2025,
    "doi": "10.1111/1747-0080.70003",
    "pmid": "40090863",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11973624/",
    "accessedOn": "2026-10-07",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Article-specific CC BY-NC-ND 4.0, https://creativecommons.org/licenses/by-nc-nd/4.0/ verified in the actual article October 7, 2026. The schema lacks a BY-NC-ND category, so conservative targeted-verification status is used. Only underlying facts in original claims; no source prose, tables, figures or algorithm adaptations.",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced. N2 uses recorded atomic synthesis and bibliographic metadata, with explicitly identified mathematical derivations. No source text, table, figure or excerpt was retrieved or copied. The original access date is retained, not refreshed. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Adult multidisciplinary 2025 society consensus, literature search through November 20, 2024. Section 3.4.1 recommends thiamine before nutrition and explicitly notes absence of specific evidence evaluating thiamine's preventive role. Section 3.5 and summary support close electrolyte/clinical monitoring; risk and diagnosis sections caution that phosphate decline has other causes. Recommendation is expert consensus with limited direct preventive evidence. No dose, duration, feeding rate, diagnostic threshold or claimed prevention certainty is imported; NICE content is excluded.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1r3.149ce209d4ee",
      "claim.n1r3.a2a9c29cbbcf",
      "claim.n1r3.78d2ba5c0eb0"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.gs028f.fda_oximeter2025",
    "title": "FDA pulse oximeter basics",
    "completeCitation": "US Food and Drug Administration. Pulse Oximeter Basics. Consumer Update. Content current March 26, 2025. Section What is a pulse oximeter? Accessed October 7, 2026.",
    "organizationOrJournal": "US Food and Drug Administration",
    "authors": [
      "US Food and Drug Administration"
    ],
    "publicationYear": 2025,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.fda.gov/consumers/consumer-updates/pulse-oximeter-basics",
    "accessedOn": "2026-10-07",
    "sourceClass": "government_guidance",
    "licenseLabel": "FDA government consumer text; FDA Website Policies https://www.fda.gov/about-fda/about-website/website-policies checked October 7, 2026, government text public domain unless otherwise noted. Agency attribution recorded; no image, logo or third-party copyrighted material reused.",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced. N1 reuses locally recorded atomic synthesis and bibliographic metadata only; no source text, table, figure or excerpt was retrieved or copied. Access date is inherited; N1 did not refresh it. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Current March 26, 2025 official consumer explanation verifies SpO2 as a percentage estimate, pulse-rate display and occasional signal-strength display. Used for what an ordinary clip reading reports, not for an exact normal threshold, device clearance, anemia treatment, or reassurance that symptoms are safe. Device limitations are acknowledged; no demographic selection rule is adopted.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.05bd95260a85",
      "claim.n1.c3c167a7739f"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.gs028f.fda_oximetry2024",
    "title": "FDA pulse-oximetry executive summary: measurement background",
    "completeCitation": "US Food and Drug Administration, Center for Devices and Radiological Health. FDA Executive Summary: Performance Evaluation of Pulse Oximeters Taking into Consideration Skin Pigmentation, Race and Ethnicity. Prepared for the Anesthesiology and Respiratory Therapy Devices Panel meeting, February 2, 2024. Introduction, printed page 1/physical page 4; Current Technology, printed pages 4–5/physical pages 7–8. Accessed October 7, 2026.",
    "organizationOrJournal": "US Food and Drug Administration; Center for Devices and Radiological Health",
    "authors": [
      "US Food and Drug Administration, Center for Devices and Radiological Health"
    ],
    "publicationYear": 2024,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.fda.gov/media/175828/download",
    "accessedOn": "2026-10-07",
    "sourceClass": "government_guidance",
    "licenseLabel": "FDA-authored government device-background text; FDA Website Policies, Linking to or Copying Information, https://www.fda.gov/about-fda/about-website/website-policies checked October 7, 2026 permits government text unless otherwise noted. Public-domain conditions apply; no third-party references, graphics or agency mark reused.",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced. N1 reuses locally recorded atomic synthesis and bibliographic metadata only; no source text, table, figure or excerpt was retrieved or copied. Access date is inherited; N1 did not refresh it. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Official 2024 advisory-panel background, not a clinical anemia-management guideline. Introduction verifies saturation as the proportion of hemoglobin oxygen capacity occupied; technology discussion identifies reduced oxygen-carrying ability in anemia. Original qualitative saturation-versus-carrier-quantity inference only. No device regulatory recommendation, race-based case selection, accuracy formula or transfusion decision is adopted.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.47d310305029",
      "claim.n1.39e090dfc4f0",
      "claim.n1.c3c167a7739f"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.gs028f.nci_metastatic2026",
    "title": "NCI metastatic cancer: primary identity after spread",
    "completeCitation": "National Cancer Institute. Metastatic Cancer: When Cancer Spreads. National Institutes of Health. Updated August 17, 2026. Opening explanation of metastatic-cell identity and primary-cancer naming. Accessed October 7, 2026.",
    "organizationOrJournal": "National Cancer Institute; National Institutes of Health",
    "authors": [
      "National Cancer Institute"
    ],
    "publicationYear": 2026,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.cancer.gov/types/metastatic-cancer",
    "accessedOn": "2026-10-07",
    "sourceClass": "government_guidance",
    "licenseLabel": "NCI text reuse policy https://www.cancer.gov/policies/copyright-reuse checked October 7, 2026: NCI text is copyright-free unless indicated otherwise; credit and original-product link are recorded. Government-text conditions apply, with no private graphics, logo or PDQ trademark reproduced.",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Current NCI patient explanation updated August 17, 2026 directly supports metastatic-cell similarity to the primary and preservation of the primary cancer's name. Used with supplied specialist pathology and a known primary, not to establish origin from a single stain or rank likely primary sites. This source does not specifically establish small-bowel melanoma occurrence; the independent cohort does.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1r2.a6defa925838"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.gs028f.nhlbi_anemia2025",
    "title": "NHLBI anemia diagnosis: hemoglobin oxygen carriage",
    "completeCitation": "National Heart, Lung, and Blood Institute. Anemia: Diagnosis. National Institutes of Health. Last updated December 18, 2025. Complete blood count section. Accessed October 7, 2026.",
    "organizationOrJournal": "National Heart, Lung, and Blood Institute; National Institutes of Health",
    "authors": [
      "National Heart, Lung, and Blood Institute"
    ],
    "publicationYear": 2025,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.nhlbi.nih.gov/health/anemia/diagnosis",
    "accessedOn": "2026-10-07",
    "sourceClass": "government_guidance",
    "licenseLabel": "Official NIH/NHLBI patient information. No article-specific open licence verified in this packet; conservative targeted factual verification is used rather than presuming every hosted element is public domain. Underlying hemoglobin-carriage facts only, with agency credit and no copied ranges, tables or graphics.",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced. N1 reuses locally recorded atomic synthesis and bibliographic metadata only; no source text, table, figure or excerpt was retrieved or copied. Access date is inherited; N1 did not refresh it. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Actual December 18, 2025 update independently verifies hemoglobin as an oxygen-carrying protein in red cells and blood hemoglobin measurement in anemia evaluation. This patient information is not a transfusion guideline. No numeric anemia threshold, treatment rule, race-adjusted reference range or acute critical-care protocol is imported.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.47d310305029",
      "claim.n1.39e090dfc4f0"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.gs028f.uk.head-neck-guidelines.2024",
    "title": "Head and Neck Cancer: United Kingdom National Multidisciplinary Guidelines, Sixth Edition",
    "completeCitation": "Homer JJ, Winter SC, editors, with the United Kingdom national multidisciplinary guideline author group. Head and Neck Cancer: United Kingdom National Multidisciplinary Guidelines, Sixth Edition. J Laryngol Otol. 2024;138(Suppl1):S1–S224. doi:10.1017/S0022215123001615. Neck lumps and needle-versus-open biopsy, printed S15–S16; imaging S16–S17; unknown primary S172–S174. Accessed October 7, 2026.",
    "organizationOrJournal": "The Journal of Laryngology & Otology / United Kingdom multidisciplinary head-and-neck societies",
    "authors": [
      "J J Homer",
      "S C Winter",
      "United Kingdom National Multidisciplinary Guidelines author group"
    ],
    "publicationYear": 2024,
    "doi": "10.1017/S0022215123001615",
    "pmid": null,
    "officialUrl": "https://discovery.ucl.ac.uk/10193598/1/head-and-neck-cancer-united-kingdom-national-multidisciplinary-guidelines-sixth-edition.pdf",
    "accessedOn": "2026-10-07",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "CC BY 4.0, ©Authors2024, publisher-version institutional copy; https://creativecommons.org/licenses/by/4.0/ verified on printed S1. Credit: Homer, Winter and guideline author group, original journal and DOI. No source wording, illustrations, algorithms, tables or embedded third-party recommendations reproduced.",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced. N1 reuses locally recorded atomic synthesis and bibliographic metadata only; no source text, table, figure or excerpt was retrieved or copied. Access date is inherited; N1 did not refresh it. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Independent multidisciplinary guideline directly supports malignancy concern in adult lateral/cystic masses and needle sampling before initial open biopsy. Core biopsy may be appropriate, so FNA is only the best offered needle option. CT helps delineate tumor/nodal anatomy, but MRI/US can be appropriate and CT is not universally required before FNA. No AAO-HNS or NICE body/reprint is used. May2024 author-name corrigendum does not alter these clinical facts.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.dae72efb5f1b",
      "claim.n1.6b82036e466c",
      "claim.n1.f0828e8bc9b1",
      "claim.n1r2.target-representation",
      "claim.n1r3.axillary-core-scope"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.gs028g.acs-gallbladder-surgery-2025",
    "title": "Surgery for Gallbladder Cancer",
    "completeCitation": "American Cancer Society medical and editorial content team. Surgery for Gallbladder Cancer. Revised May 16, 2025.",
    "organizationOrJournal": "American Cancer Society",
    "authors": [
      "American Cancer Society medical and editorial content team"
    ],
    "publicationYear": 2025,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.cancer.org/cancer/types/gallbladder-cancer/treating/surgery.html",
    "accessedOn": "2026-10-07",
    "sourceClass": "open_educational_resource",
    "licenseLabel": "Copyrighted society educational guidance; targeted factual cross-check only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced. N1 reuses locally recorded atomic synthesis and bibliographic metadata only; no source text, table, figure or excerpt was retrieved or copied. Access date is inherited; N1 did not refresh it. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Current society patient guidance corroborates that completely removed T1a disease may not need further surgery; not an independent specialist guideline.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n1.2682ba46b469",
      "claim.n1.49bbc47617f1"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.gs028g.lee-gallbladder-guideline-2014",
    "title": "Practical Guidelines for the Surgical Treatment of Gallbladder Cancer",
    "completeCitation": "Lee SE, Kim KS, Kim WB, et al.; Korean Association of Hepato-Biliary and Pancreas Surgery. Practical Guidelines for the Surgical Treatment of Gallbladder Cancer. Journal of Korean Medical Science. 2014;29(10):1333–1340. doi:10.3346/jkms.2014.29.10.1333.",
    "organizationOrJournal": "Journal of Korean Medical Science / Korean Association of Hepato-Biliary and Pancreas Surgery",
    "authors": [
      "Seung Eun Lee",
      "Kyung Sik Kim",
      "Wan Bae Kim",
      "Korean Association of Hepato-Biliary and Pancreas Surgery"
    ],
    "publicationYear": 2014,
    "doi": "10.3346/jkms.2014.29.10.1333",
    "pmid": null,
    "officialUrl": "https://jkms.org/DOIx.php?id=10.3346/jkms.2014.29.10.1333",
    "accessedOn": "2026-10-07",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "CC BY-NC 3.0; conservatively restricted to targeted factual verification without reproduced expression",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced. N1 reuses locally recorded atomic synthesis and bibliographic metadata only; no source text, table, figure or excerpt was retrieved or copied. Access date is inherited; N1 did not refresh it. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Older surgical guideline used only for completely resected T1a disease; no extrapolation to disputed T1b treatment or historical port-site policy.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.2682ba46b469",
      "claim.n1.49bbc47617f1",
      "claim.n1.0edd7f3d0ae9"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.gs028g.nci-gallbladder-pdq-2025",
    "title": "Gallbladder Cancer Treatment (PDQ), Health Professional Version",
    "completeCitation": "PDQ Adult Treatment Editorial Board. Gallbladder Cancer Treatment (PDQ), Health Professional Version. National Cancer Institute. Updated February 12, 2025.",
    "organizationOrJournal": "National Cancer Institute",
    "authors": [
      "PDQ Adult Treatment Editorial Board"
    ],
    "publicationYear": 2025,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.cancer.gov/types/gallbladder/hp/gallbladder-treatment-pdq",
    "accessedOn": "2026-10-07",
    "sourceClass": "government_guidance",
    "licenseLabel": "NCI PDQ summary conditions apply; factual staging synthesis only; no third-party AJCC tables or figures reused",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced. N1 reuses locally recorded atomic synthesis and bibliographic metadata only; no source text, table, figure or excerpt was retrieved or copied. Access date is inherited; N1 did not refresh it. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Peer-reviewed government evidence summary; not a formal NCI policy or individualized treatment recommendation.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.0edd7f3d0ae9"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.japanese-gastric-cancer-guideline.2021",
    "title": "Japanese Gastric Cancer Treatment Guidelines 2021",
    "completeCitation": "Japanese Gastric Cancer Association. Japanese Gastric Cancer Treatment Guidelines 2021 (6th edition). Gastric Cancer. 2023;26(1):1-25. doi:10.1007/s10120-022-01331-8.",
    "organizationOrJournal": "Gastric Cancer / Japanese Gastric Cancer Association",
    "authors": [
      "Japanese Gastric Cancer Association"
    ],
    "publicationYear": 2023,
    "doi": "10.1007/s10120-022-01331-8",
    "pmid": "36342574",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9813208/",
    "accessedOn": "2026-08-06",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Use for independently written factual synthesis with attribution. Do not reproduce guideline tables, algorithms, or figures. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Professional-society guideline strongly recommending against splenectomy or splenic-hilar dissection when an advanced proximal gastric tumor does not invade the greater curvature.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n1r2.53fd4a912f74",
      "claim.n1r2.60c60d811db1",
      "claim.n1.5b207d0586d5",
      "claim.n1.e498c90de8b4",
      "claim.n1r3.gastric-inseparable-invaded-interface"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.jcm.laparoscopic-anesthesia-review.2020",
    "title": "Do Small Incisions Need Only Minimal Anesthesia? Anesthetic Management in Laparoscopic and Robotic Surgery",
    "completeCitation": "Hottenrott S, Schlesinger T, Helmer P, Meybohm P, Alkatout I, Kranke P. Do Small Incisions Need Only Minimal Anesthesia?—Anesthetic Management in Laparoscopic and Robotic Surgery. Journal of Clinical Medicine. 2020;9(12):4058. Published December 15, 2020. doi:10.3390/jcm9124058. Sections 3.1 and 3.4, pp. 3–4; accessed October 7, 2026.",
    "organizationOrJournal": "Journal of Clinical Medicine",
    "authors": [
      "Sebastian Hottenrott",
      "Tobias Schlesinger",
      "Philipp Helmer",
      "Patrick Meybohm",
      "Ibrahim Alkatout",
      "Peter Kranke"
    ],
    "publicationYear": 2020,
    "doi": "10.3390/jcm9124058",
    "pmid": null,
    "officialUrl": "https://mdpi-res.com/d_attachment/jcm/jcm-09-04058/article_deploy/jcm-09-04058.pdf",
    "accessedOn": "2026-10-07",
    "sourceClass": "narrative_review",
    "licenseLabel": "Article-specific Creative Commons Attribution 4.0 notice verified on PDF p. 15, https://creativecommons.org/licenses/by/4.0/; credited to the six named authors and Journal of Clinical Medicine. Original underlying-fact synthesis only. The publisher HTML and general terms/open-access pages were unavailable during checking; general site terms were not asserted to have been read.",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced. N1 reuses locally recorded atomic synthesis and bibliographic metadata only; no source text, table, figure or excerpt was retrieved or copied. Access date is inherited; N1 did not refresh it. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Peer-reviewed physiology review directly supports absorption/exhalation of insufflated CO2 and context-dependent pressure/position effects on venous return. The older review is cross-checked with a current independent clinical study; no numeric pressure limit, ventilator setting or operating-room treatment protocol is authored.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.6bcc3f0847f4",
      "claim.n1r2.gas-record-interpretation",
      "claim.n1r2.a64275d45f37",
      "claim.n1r3.co2-ventilatory-response"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.jcog0110.prophylactic-splenectomy.2017",
    "title": "Randomized Controlled Trial to Evaluate Splenectomy in Total Gastrectomy for Proximal Gastric Carcinoma",
    "completeCitation": "Sano T, Sasako M, Mizusawa J, et al. Randomized Controlled Trial to Evaluate Splenectomy in Total Gastrectomy for Proximal Gastric Carcinoma. Ann Surg. 2017;265(2):277-283. doi:10.1097/SLA.0000000000001814.",
    "organizationOrJournal": "Annals of Surgery / Japan Clinical Oncology Group",
    "authors": [
      "Takeshi Sano",
      "Mitsuru Sasako",
      "Junki Mizusawa",
      "Seiichiro Yamamoto",
      "Hitoshi Katai",
      "Takaki Yoshikawa",
      "Stomach Cancer Study Group of the Japan Clinical Oncology Group"
    ],
    "publicationYear": 2017,
    "doi": "10.1097/SLA.0000000000001814",
    "pmid": "27280511",
    "officialUrl": "https://pubmed.ncbi.nlm.nih.gov/27280511/",
    "accessedOn": "2026-08-06",
    "sourceClass": "randomized_trial",
    "licenseLabel": "Copyright Wolters Kluwer; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Use only for targeted factual verification and citation. Do not reproduce article prose, tables, or figures. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Pivotal multicenter randomized trial establishing noninferiority of spleen preservation and higher morbidity with splenectomy in the narrowly defined study population.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1r2.53fd4a912f74",
      "claim.n1r2.60c60d811db1",
      "claim.n1.5b207d0586d5",
      "claim.n1r3.gastric-inseparable-invaded-interface"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.jroboticsurg.pneumoperitoneum-acid-base-study.2026",
    "title": "Acid–base balance and respiratory mechanics during robotic-assisted surgery: an observational study",
    "completeCitation": "Pitimada M, Chiumello D, Monte A, Fratti I, Festa F, Pozzi T, Coppola S. Acid–base balance and respiratory mechanics during robotic-assisted surgery: an observational study. Journal of Robotic Surgery. 2026;20:440. Published April 21, 2026. doi:10.1007/s11701-026-03392-8. Introduction and discussion: acid-base equilibrium and gas exchange; accessed October 7, 2026.",
    "organizationOrJournal": "Journal of Robotic Surgery",
    "authors": [
      "Matteo Pitimada",
      "Davide Chiumello",
      "Alessandro Monte",
      "Isabella Fratti",
      "Federica Festa",
      "Tommaso Pozzi",
      "Silvia Coppola"
    ],
    "publicationYear": 2026,
    "doi": "10.1007/s11701-026-03392-8",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1007/s11701-026-03392-8",
    "accessedOn": "2026-10-07",
    "sourceClass": "observational_study",
    "licenseLabel": "Creative Commons Attribution 4.0 International, https://creativecommons.org/licenses/by/4.0/; credited to the seven named authors and Journal of Robotic Surgery. Original underlying-fact synthesis only; no source expression, data tables, images or ventilation protocol is reproduced.",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced. N1 reuses locally recorded atomic synthesis and bibliographic metadata only; no source text, table, figure or excerpt was retrieved or copied. Access date is inherited; N1 did not refresh it. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Current peer-reviewed observational study corroborates peritoneal CO2 absorption with increased arterial CO2/respiratory acidemia and pressure-associated hemodynamic effects. Colorectal/gynecological surgical population and observational design limit universal mechanistic inference; no renal, numeric outcome or treatment claim is extrapolated.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n1.6bcc3f0847f4",
      "claim.n1r2.gas-record-interpretation",
      "claim.n1r2.a64275d45f37",
      "claim.n1r3.co2-ventilatory-response"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.jsbi.burn-care-guideline.2022",
    "title": "The Japanese Society for Burn Injuries (JSBI) Clinical Practice Guidelines for Management of Burn Care (3rd Edition)",
    "completeCitation": "Sasaki J, Matsushima A, Ikeda H, et al. The Japanese Society for Burn Injuries (JSBI) Clinical Practice Guidelines for Management of Burn Care (3rd Edition). Acute Med Surg. 2022;9(1):e739. doi:10.1002/ams2.739.",
    "organizationOrJournal": "Japanese Society for Burn Injuries; Acute Medicine & Surgery",
    "authors": [
      "Junichi Sasaki",
      "Asako Matsushima",
      "Hiroto Ikeda",
      "Clinical Practice Guidelines Committee of the Japanese Society for Burn Injuries"
    ],
    "publicationYear": 2022,
    "doi": "10.1002/ams2.739",
    "pmid": "35493773",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9045063/",
    "accessedOn": "2026-08-06",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution-NonCommercial 4.0 International",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Use with attribution for independently written noncommercial factual synthesis. Do not reproduce guideline tables, algorithms, figures, or extended prose. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Current professional-society burn guideline recommending enteral nutrition as early as possible within 24 hours for patients with severe burns, subject to clinical feasibility and safety.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.72256312b855",
      "claim.n1.84c927796922",
      "claim.n1.f73aaaad7469"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.korean-gastric-cancer-guideline.2024",
    "title": "Korean Practice Guidelines for Gastric Cancer 2024: An Evidence-based, Multidisciplinary Approach",
    "completeCitation": "Kim IH, Kang SJ, Choi W, et al. Korean Practice Guidelines for Gastric Cancer 2024: An Evidence-based, Multidisciplinary Approach (Update of 2022 Guideline). J Gastric Cancer. 2025;25(1):5-114. doi:10.5230/jgc.2025.25.e11.",
    "organizationOrJournal": "Journal of Gastric Cancer / Korean Gastric Cancer Association",
    "authors": [
      "In-Ho Kim",
      "Seung Joo Kang",
      "Wonyoung Choi",
      "Development Working Group for the Korean Practice Guideline for Gastric Cancer 2024 Task Force Team"
    ],
    "publicationYear": 2025,
    "doi": "10.5230/jgc.2025.25.e11",
    "pmid": "39822170",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11739648/",
    "accessedOn": "2026-08-06",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution-NonCommercial 4.0",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Use for factual synthesis with attribution. Do not reproduce guideline tables, flowcharts, figures, or extended prose. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Current multidisciplinary gastric-cancer guideline with a strong recommendation against prophylactic splenectomy for proximal advanced gastric cancer without greater-curvature invasion.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1r2.53fd4a912f74",
      "claim.n1r2.60c60d811db1",
      "claim.n1.5b207d0586d5",
      "claim.n1r3.gastric-inseparable-invaded-interface"
    ]
  },
  {
    "id": "source.lactmed.sodium-iodide-i131.2026",
    "title": "Sodium Iodide I 131",
    "completeCitation": "National Institute of Child Health and Human Development. Drugs and Lactation Database (LactMed®) [Internet]. Bethesda (MD): National Institute of Child Health and Human Development; 2006–. Sodium Iodide I 131. Updated August 15, 2026.",
    "organizationOrJournal": "Drugs and Lactation Database (LactMed®), National Institute of Child Health and Human Development",
    "authors": [
      "National Institute of Child Health and Human Development"
    ],
    "publicationYear": 2026,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.ncbi.nlm.nih.gov/books/NBK501563/",
    "sourceClass": "government_guidance",
    "licenseLabel": "United States government publication; NCBI Bookshelf source-specific conditions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Original factual synthesis and attribution only; no source prose, dose, timing, case detail, or bulk reuse. LactMed® is an HHS trademark. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "United States government lactation reference used to cross-check therapeutic iodine-131 lactation and infant-thyroid-exposure boundaries.",
    "usageRole": "cross_check",
    "accessedOn": "2026-09-09",
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "evidenceClaimIds": [
      "claim.n1r2.6d89da8ecd7a"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.lymphedema.isl-2023",
    "title": "ISL 2023 consensus on peripheral lymphedema",
    "completeCitation": "Executive Committee of the International Society of Lymphology. The Diagnosis and Treatment of Peripheral Lymphedema: 2023 Consensus Document. Lymphology. 2023;56(4):133-151. PMID:39207406.",
    "organizationOrJournal": "International Society of Lymphology",
    "authors": [
      "Executive Committee of the International Society of Lymphology"
    ],
    "publicationYear": 2023,
    "doi": null,
    "pmid": "39207406",
    "officialUrl": "https://isl.arizona.edu/sites/default/files/2024-11/THE-DIAGNOSIS-AND-TREATMENT-OF-PERIPHERAL-LYMPHEDEMA-2023-CONSENSUS-DOCUMENT-OF-THE-INTERNATIONAL-SOCIETY-OF-LYMPHOLOGY.pdf",
    "accessedOn": "2026-09-28",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted guidance; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced. N1 reuses locally recorded atomic synthesis and bibliographic metadata only; no source text, table, figure or excerpt was retrieved or copied. Access date is inherited; N1 did not refresh it. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "International consensus; uncertainty and patient-specific care retained.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.5cdd738832f7",
      "claim.n1.89526aa237e7",
      "claim.n1r3.proximal-venous-waveform"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.lymphedema.nci-pdq-current",
    "title": "Lymphedema PDQ Health Professional Version",
    "completeCitation": "National Cancer Institute PDQ Supportive and Palliative Care Editorial Board. Lymphedema (PDQ), Health Professional Version. Updated December 18, 2024. Accessed September 28, 2026.",
    "organizationOrJournal": "National Cancer Institute",
    "authors": [
      "NCI PDQ Supportive and Palliative Care Editorial Board"
    ],
    "publicationYear": 2024,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.cancer.gov/about-cancer/treatment/side-effects/lymphedema/lymphedema-hp-pdq",
    "accessedOn": "2026-09-28",
    "sourceClass": "government_guidance",
    "licenseLabel": "US government factual material; third-party exclusions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced. N1 reuses locally recorded atomic synthesis and bibliographic metadata only; no source text, table, figure or excerpt was retrieved or copied. Access date is inherited; N1 did not refresh it. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Government editorial synthesis for diagnosis, differential, and individualized decongestive care.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.5cdd738832f7",
      "claim.n1.89526aa237e7",
      "claim.n1r3.proximal-venous-waveform"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.naeini.burn-nutrition-umbrella-review.2024",
    "title": "Nutritional interventions in patients with burn injury: an umbrella review of systematic reviews and meta-analyses of randomised clinical trials",
    "completeCitation": "Naeini F, Zeraattalab-Motlagh S, Rahimlou M, et al. Nutritional interventions in patients with burn injury: an umbrella review of systematic reviews and meta-analyses of randomised clinical trials. Br J Nutr. 2024;132(10):1317-1324. doi:10.1017/S0007114524002344.",
    "organizationOrJournal": "British Journal of Nutrition",
    "authors": [
      "Fatemeh Naeini",
      "Sheida Zeraattalab-Motlagh",
      "Mehran Rahimlou",
      "Mahsa Ranjbar",
      "Amirhossein Hemmati",
      "Sajedeh Habibi",
      "Sajjad Moradi",
      "Hamed Mohammadi"
    ],
    "publicationYear": 2024,
    "doi": "10.1017/S0007114524002344",
    "pmid": "39501634",
    "officialUrl": "https://pubmed.ncbi.nlm.nih.gov/39501634/",
    "accessedOn": "2026-08-06",
    "sourceClass": "systematic_review",
    "licenseLabel": "Publisher-controlled article; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Use for targeted verification of the evidence direction and independently written synthesis only. Do not reproduce article prose, tables, or figures. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Recent umbrella review supporting clinical benefit from early enteral nutrition in adult burn populations while not establishing a universal eight-hour cutoff.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n1.84c927796922",
      "claim.n1.f73aaaad7469"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.nci.mammograms.2025",
    "title": "Mammograms",
    "completeCitation": "National Cancer Institute. Mammograms. Updated December 2, 2025.",
    "organizationOrJournal": "National Cancer Institute",
    "authors": [
      "National Cancer Institute"
    ],
    "publicationYear": 2025,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.cancer.gov/types/breast/screening/mammograms",
    "accessedOn": "2026-08-06",
    "sourceClass": "government_guidance",
    "licenseLabel": "U.S. government resource; NCI reuse conditions and third-party credits apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Store independently written facts and bibliographic metadata only. Exclude illustrations and separately credited material. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Current U.S. government cancer-information resource independently cross-checking concerning mass morphology, calcification findings, follow-up, and the need for tissue diagnosis when imaging is suspicious.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n1.d2d731b45c78",
      "claim.n1.640146b1029b",
      "claim.n1.25cb8cbda68e",
      "claim.n1.60fa5e6f41c7",
      "claim.n1r2.target-representation"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.nhlbi.iron-deficiency-anemia.2022",
    "title": "Anemia: Iron-Deficiency Anemia",
    "completeCitation": "National Heart, Lung, and Blood Institute. Anemia: Iron-Deficiency Anemia. Updated March 24, 2022.",
    "organizationOrJournal": "NHLBI",
    "authors": [
      "National Heart, Lung, and Blood Institute"
    ],
    "publicationYear": 2022,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.nhlbi.nih.gov/health/anemia/iron-deficiency-anemia",
    "accessedOn": "2026-09-09",
    "sourceClass": "government_guidance",
    "licenseLabel": "United States government patient guidance",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Bounded factual cross-check only; no numeric-cutoff image, source prose, or art reproduced. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Federal patient guidance used to cross-check that CBC/hemoglobin, iron, and ferritin contribute to diagnostic assessment.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n1r3.acefc98ce84f"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
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
    "reuseNotes": "Original factual synthesis only; third-party materials and agency marks excluded. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Federal patient guidance directly checked for blood testing, small-intestinal biopsy, and the effect of gluten avoidance on results.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.5294d3feead5",
      "claim.n1.87469918a5c7",
      "claim.n1.8a59fd5f0d78",
      "claim.n1r3.hla-before-challenge"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
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
    "reuseNotes": "Original factual synthesis only; third-party materials and agency marks excluded. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Federal professional guidance directly checked for initial serology, total IgA context, gluten exposure, and usual biopsy follow-up.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.5294d3feead5",
      "claim.n1.87469918a5c7",
      "claim.n1.101c4b1dec35",
      "claim.n1.50691038a9ee",
      "claim.n1.8a59fd5f0d78",
      "claim.n1r3.hla-before-challenge"
    ]
  },
  {
    "id": "source.niddk.graves-disease.2021",
    "title": "Graves’ Disease",
    "completeCitation": "National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK), National Institutes of Health. Graves’ Disease. Last reviewed November 2021.",
    "organizationOrJournal": "National Institute of Diabetes and Digestive and Kidney Diseases, National Institutes of Health",
    "authors": [
      "National Institute of Diabetes and Digestive and Kidney Diseases"
    ],
    "publicationYear": 2021,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.niddk.nih.gov/health-information/endocrine-diseases/graves-disease",
    "sourceClass": "government_guidance",
    "licenseLabel": "United States government public information; stated NIDDK exceptions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Targeted factual verification and independently written synthesis only; confirm credited third-party material separately. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "United States government patient education used as an independent cross-check for Graves presentation, diagnostic context, treatment roles, and thyroid-eye-disease risk.",
    "usageRole": "both",
    "accessedOn": "2026-09-09",
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "evidenceClaimIds": [
      "claim.n1.25d060186678",
      "claim.n1r2.named-methimazole",
      "claim.n1r2.named-propranolol",
      "claim.n1r3.beta-blocker-slow-pulse",
      "claim.n1r3.graves-tsh-lag"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.nutrition.espen-practical-2021",
    "title": "ESPEN practical guideline on clinical nutrition in surgery",
    "completeCitation": "Weimann A, Braga M, Carli F, et al. ESPEN practical guideline: Clinical nutrition in surgery. Clin Nutr. 2021;40(7):4745-4761. doi:10.1016/j.clnu.2021.03.031.",
    "organizationOrJournal": "European Society for Clinical Nutrition and Metabolism",
    "authors": [
      "Weimann A",
      "Braga M",
      "Carli F",
      "et al."
    ],
    "publicationYear": 2021,
    "doi": "10.1016/j.clnu.2021.03.031",
    "pmid": null,
    "officialUrl": "https://doi.org/10.1016/j.clnu.2021.03.031",
    "accessedOn": "2026-09-29",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted guidance; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced. N1 reuses locally recorded atomic synthesis and bibliographic metadata only; no source text, table, figure or excerpt was retrieved or copied. Access date is inherited; N1 did not refresh it. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Copyrighted society practical guideline for screening and oral/enteral/parenteral route boundaries.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.e2f4cca1859a",
      "claim.n1.e757fd75ecb1",
      "claim.n1r3.nutrition-fluid-separation"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.park.mayo-meckel-1476.2005",
    "title": "Meckel diverticulum: the Mayo Clinic experience with 1476 patients (1950-2002)",
    "completeCitation": "Park JJ, Wolff BG, Tollefson MK, Walsh EE, Larson DR. Meckel diverticulum: the Mayo Clinic experience with 1476 patients (1950-2002). Ann Surg. 2005;241(3):529-533. doi:10.1097/01.sla.0000154270.14308.5f.",
    "organizationOrJournal": "Annals of Surgery",
    "authors": [
      "John J. Park",
      "Bruce G. Wolff",
      "Matthew K. Tollefson",
      "Erin E. Walsh",
      "Dirk R. Larson"
    ],
    "publicationYear": 2005,
    "doi": "10.1097/01.sla.0000154270.14308.5f",
    "pmid": "15729078",
    "officialUrl": "https://pubmed.ncbi.nlm.nih.gov/15729078/",
    "accessedOn": "2026-08-06",
    "sourceClass": "observational_study",
    "licenseLabel": "Copyrighted journal article; abstract and bibliographic metadata available",
    "reuseStatus": "metadata_only_rights_reserved",
    "reuseNotes": "Use bibliographic metadata and abstract-level factual cross-checking only. Do not reproduce or adapt article prose, tables, or figures. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Large retrospective series showing that diverticulum length greater than 2 cm was associated with symptomatic presentation while base width was not, helping prevent conflation of length and base-width observations.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n1.a10ad9a5021b"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102.jgca-2025",
    "title": "Japanese gastric cancer treatment guidelines 2025 (7th edition)",
    "completeCitation": "Japanese Gastric Cancer Association. Japanese gastric cancer treatment guidelines 2025 (7th edition). Gastric Cancer. 2026;29:271-299. Published January 22, 2026. doi:10.1007/s10120-025-01698-4.",
    "organizationOrJournal": "Japanese Gastric Cancer Association / Gastric Cancer",
    "authors": [
      "Japanese Gastric Cancer Association"
    ],
    "publicationYear": 2026,
    "doi": "10.1007/s10120-025-01698-4",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1007/s10120-025-01698-4",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "CC BY 4.0; publisher statement checked",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "https://creativecommons.org/licenses/by/4.0/ . Original scope synthesis and discrepancy metadata only; no algorithms, operative tables, figures or source excerpts stored. Edition year 2025 differs from English publication year 2026. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Current society guidance for invasion-related combined resection. CQ3-2 has internally contradictory greater-curvature wording; that hilar-dissection point is withheld, not silently corrected.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.n1.e498c90de8b4",
      "claim.n1r3.gastric-inseparable-invaded-interface"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.asbrs2024-archived",
    "title": "ASBrS archived high-risk lesion resource guide",
    "completeCitation": "American Society of Breast Surgeons. Resource Guide: Surgical Management of Benign or High-Risk Lesions. 2024. Archived version, accessed November 2, 2026.",
    "organizationOrJournal": "American Society of Breast Surgeons",
    "authors": [
      "American Society of Breast Surgeons"
    ],
    "publicationYear": 2024,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.breastsurgeons.org/docs/statements/asbrs-high-risk-lesions.pdf",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ASBrS; archived guidance, no reuse license",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Full archived PDF read; alternate rg-high-risk-lesions URL served the same edition. No source table, gauge, lesion threshold or expression adapted. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Cross-check only of the general discordance principle and repeat-core/vacuum/excision alternatives. The visible Archived label is preserved; this is not represented as current comprehensive lesion-management guidance.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n1r3.a2269c919525"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.breast-eusobi2020",
    "title": "EUSOBI image-guided breast biopsy recommendations",
    "completeCitation": "Bick U, Trimboli RM, Athanasiou A, Balleyguier C, Baltzer PAT, Bernathova M, et al.; European Society of Breast Imaging. Image-guided breast biopsy and localisation: recommendations for information to women and referring physicians by the European Society of Breast Imaging. Insights Imaging. 2020;11:12. doi:10.1186/s13244-019-0803-x.",
    "organizationOrJournal": "European Society of Breast Imaging / Insights into Imaging",
    "authors": [
      "Bick U",
      "Trimboli RM",
      "Athanasiou A",
      "Balleyguier C",
      "Baltzer PAT",
      "Bernathova M",
      "European Society of Breast Imaging"
    ],
    "publicationYear": 2020,
    "doi": "10.1186/s13244-019-0803-x",
    "pmid": "32025985",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7002629/",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "CC BY 4.0; copyright the authors",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "https://creativecommons.org/licenses/by/4.0/ . Original synthesis with citation only; no source prose, patient images or figures copied. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Full primary society recommendations directly support checking target/specimen concordance and further histology after discordance; multiple repeat techniques may be appropriate.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1r3.a2269c919525"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.ilatam2026",
    "title": "Current Ibero-Latin American acute pancreatitis guideline",
    "completeCitation": "Cárdenas-Jaén K, Guilabert L, Martínez-Moneo E, Mancilla C, Bispo M, Moutinho-Ribeiro P, et al. AEG-AESPANC-OPGE-SIED-SPG Ibero-Latin American Guidelines on Acute Pancreatitis (iLATAM-AP). United European Gastroenterol J. 2026;14(5):e70190. doi:10.1002/ueg2.70190.",
    "organizationOrJournal": "AEG/AESPANC/OPGE/SIED/SPG / United European Gastroenterology Journal",
    "authors": [
      "Cárdenas-Jaén K",
      "Guilabert L",
      "Martínez-Moneo E",
      "Mancilla C",
      "Bispo M",
      "Moutinho-Ribeiro P",
      "et al."
    ],
    "publicationYear": 2026,
    "doi": "10.1002/ueg2.70190",
    "pmid": "42216617",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13240590/",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "CC BY-NC-ND 4.0; copyright the authors",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "https://creativecommons.org/licenses/by-nc-nd/4.0/ . No adaptation of guideline expression, algorithm, table or figures. Underlying clinical facts independently synthesized with citation. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Current full primary guideline directly addresses MRCP/duct discontinuity, transluminal drainage, long-term plastic stents and step-up intervention. Duct/stent recommendations include low-quality evidence and must remain clinician-reviewed.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1r3.d3c31e54d4ba"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102c.ksge2021",
    "title": "Clinical Practice Guidelines for the Endoscopic Management of Peripancreatic Fluid Collections",
    "completeCitation": "Oh CH, Lee JK, Song TJ, Park JS, Lee JM, Son JH, et al. Clinical Endoscopy. 2021;54(4):505-521. doi:10.5946/ce.2021.185.",
    "organizationOrJournal": "Korean Society of Gastrointestinal Endoscopy",
    "authors": [
      "Oh CH",
      "Lee JK",
      "Song TJ",
      "Park JS",
      "Lee JM",
      "Son JH",
      "et al."
    ],
    "publicationYear": 2021,
    "doi": "10.5946/ce.2021.185",
    "pmid": null,
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8357592/",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "CC BY-NC 3.0; copyright Korean Society of Gastrointestinal Endoscopy",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "https://creativecommons.org/licenses/by-nc/3.0/ . Targeted factual verification only; no article text, algorithm, table, figure or protocol copied/adapted. Current document explicitly uses version 3.0, not an assumed 4.0 license. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Full primary guideline rechecked for contents/duct imaging, apposition, partial leaks, arterial bleeding and post-procedure risks. Older technical guidance corroborated against current 2026 recommendations. Same publication as source.ksge.pancreatic-fluid-collections.2021; a new record ID does not create independent evidence.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n1r3.d3c31e54d4ba",
      "claim.n1r3.64dbe972aff7"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.review.inguinal-releasing-incisions.2023",
    "title": "The Role of Releasing Incisions in Emergency Inguinal Hernia Repair",
    "completeCitation": "Weitzner ZN, Chen DC. The Role of Releasing Incisions in Emergency Inguinal Hernia Repair. J Abdom Wall Surg. 2023;2:11378. doi:10.3389/jaws.2023.11378.",
    "organizationOrJournal": "Journal of Abdominal Wall Surgery",
    "authors": [
      "ZN Weitzner",
      "DC Chen"
    ],
    "publicationYear": 2023,
    "doi": "10.3389/jaws.2023.11378",
    "pmid": null,
    "officialUrl": "https://www.frontierspartnerships.org/journals/journal-of-abdominal-wall-surgery/articles/10.3389/jaws.2023.11378/full",
    "accessedOn": "2026-07-30",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Credit the authors and publication, link the license, and exclude figures, supplementary video, separately credited material, and third-party assets. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "A current technical narrative review suitable for the bounded spatial anatomy of direct inguinal hernia; it is not comparative or diagnostic-performance evidence.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.589f16048c12",
      "claim.n1.ed07ff6b964e",
      "claim.n1r3.ee52cfc5f587"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
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
    "reuseNotes": "Use only for targeted factual verification and citation. Do not reproduce article prose, tables, figures, or supplementary materials. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Multicenter randomized trial in elective clean-contaminated and contaminated single-stage ventral hernia repair showing lower recurrence with permanent synthetic than biologic mesh and similar procedural-intervention safety outcomes.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.e22669366268"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.rosenberger.asbrs-sbi-benign-fel.2025",
    "title": "American Society of Breast Surgeons and Society of Breast Imaging 2025 Guidelines for the Management of Benign Breast Fibroepithelial Lesions",
    "completeCitation": "Rosenberger LH, White RL, Tafra L, Boughey JC, Johnson NM, Pass HA, Boolbol SK, Landrum K, Gao Y, Yao K. American Society of Breast Surgeons and Society of Breast Imaging 2025 Guidelines for the Management of Benign Breast Fibroepithelial Lesions. JAMA Surg. 2025;160(12):1378-1385. doi:10.1001/jamasurg.2025.4392. PMID: 41123921.",
    "organizationOrJournal": "American Society of Breast Surgeons; Society of Breast Imaging; JAMA Surgery",
    "authors": [
      "L H Rosenberger",
      "R L White",
      "L Tafra",
      "J C Boughey",
      "N M Johnson",
      "H A Pass",
      "S K Boolbol",
      "K Landrum",
      "Y Gao",
      "K Yao"
    ],
    "publicationYear": 2025,
    "doi": "10.1001/jamasurg.2025.4392",
    "pmid": "41123921",
    "officialUrl": "https://pubmed.ncbi.nlm.nih.gov/41123921/",
    "accessedOn": "2026-08-31",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted; targeted verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Use only for targeted factual verification and independently written synthesis. Do not reproduce guideline prose, tables, figures, or algorithms. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Current professional-society guidance for benign breast fibroepithelial lesions; used to cross-check the benign complete-excision and positive-margin counseling boundaries.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.n1.49101d9d3b5b",
      "claim.n1.8ace163cc27a"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.rossaint.trauma-bleeding.2023",
    "title": "The European guideline on management of major bleeding and coagulopathy following trauma: sixth edition",
    "completeCitation": "Rossaint R, Afshari A, Bouillon B, et al. The European guideline on management of major bleeding and coagulopathy following trauma: sixth edition. Critical Care. 2023;27:80. doi:10.1186/s13054-023-04327-7. PMID: 36859355. PMCID: PMC9977110.",
    "organizationOrJournal": "Critical Care",
    "authors": [
      "R Rossaint",
      "A Afshari",
      "B Bouillon",
      "et al."
    ],
    "publicationYear": 2023,
    "doi": "10.1186/s13054-023-04327-7",
    "pmid": "36859355",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9977110/",
    "accessedOn": "2026-08-31",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Open-access article; reuse status requires verification",
    "reuseStatus": "metadata_only_rights_reserved",
    "reuseNotes": "Use only for targeted factual verification and independently written synthesis. Do not reproduce source prose, tables, figures, or algorithms until reuse terms are verified. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "European multidisciplinary trauma guideline; high authority for trauma bleeding and VKA-reversal context.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.n1.106cf1da9d54",
      "claim.n1.0fc2b1f318e6",
      "claim.n1.5eca14d67493",
      "claim.n1r3.vka-sustained-reversal"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
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
    "reuseNotes": "Use only for targeted factual verification and citation. Do not reproduce protected recommendation wording or extended explanatory prose. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Enterotomy-specific professional guidance emphasizing individualized management based on operative findings, contamination, expertise, and patient factors rather than an automatic mesh rule.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n1.8e30265aebbd",
      "claim.n1.4b2bd6d4bf88"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.sc.herniasurge-2018",
    "title": "International guidelines for groin hernia management",
    "completeCitation": "The HerniaSurge Group. International guidelines for groin hernia management. Hernia. 2018;22(1):1-165. Published 2018-01-12. doi:10.1007/s10029-017-1668-x. PMID:29330835.",
    "organizationOrJournal": "Hernia / HerniaSurge Group",
    "authors": [
      "The HerniaSurge Group"
    ],
    "publicationYear": 2018,
    "doi": "10.1007/s10029-017-1668-x",
    "pmid": "29330835",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5809582/",
    "accessedOn": "2026-09-10",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Creative Commons Attribution-NonCommercial 4.0 International",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Original factual synthesis only for local noncommercial development. Attribute the source and CC BY-NC 4.0 license at https://creativecommons.org/licenses/by-nc/4.0/; no source prose, figures, tables, or other third-party material is reproduced. Commercial reuse requires separate review. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "International society evidence-based guideline directly checked for exam-first selected imaging, uncertainty around occult imaging, and symptomatic groin-hernia management. It does not establish a universal ultrasound algorithm.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1r3.f7c0c4468398"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.sc.niddk-inguinal-hernia",
    "title": "Inguinal Hernia",
    "completeCitation": "National Institute of Diabetes and Digestive and Kidney Diseases. Inguinal Hernia. Last reviewed September 2019. Accessed 2026-09-10.",
    "organizationOrJournal": "National Institute of Diabetes and Digestive and Kidney Diseases",
    "authors": [
      "National Institute of Diabetes and Digestive and Kidney Diseases",
      "Neal E. Seymour, MD (acknowledged reviewer)"
    ],
    "publicationYear": 2019,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.niddk.nih.gov/health-information/digestive-diseases/inguinal-hernia",
    "accessedOn": "2026-09-10",
    "sourceClass": "government_guidance",
    "licenseLabel": "United States government factual material; NIDDK reuse conditions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Original factual synthesis only. Third-party content, images, and agency marks are excluded; credit NIDDK without implying endorsement. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Directly checked NIDDK patient education cross-checking selected imaging after an unclear examination, elective repair, and watchful waiting limited to men with few or no symptoms. It cites HerniaSurge, so it is not independent underlying evidence.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n1r3.f7c0c4468398"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.sc.ucla-post-surgical-fluid",
    "title": "Post-Surgical Fluid Collections: Causes, Symptoms, and Management",
    "completeCitation": "Sparks H, Manchandia TC. Post-Surgical Fluid Collections: Causes, Symptoms, and Management. UCLA Health Department of Radiology, Breast Imaging Teaching Resources. Undated. Accessed 2026-09-10.",
    "organizationOrJournal": "UCLA Health Department of Radiology, Breast Imaging Teaching Resources",
    "authors": [
      "Sparks H",
      "Manchandia TC"
    ],
    "publicationYear": null,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.uclahealth.org/departments/radiology/education/breast-imaging-teaching-resources/cases/post-surgical-fluid-collections",
    "accessedOn": "2026-09-10",
    "sourceClass": "open_educational_resource",
    "licenseLabel": "Copyright University of California; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Original factual synthesis and citation only. No source wording, images, or marks reproduced; the public terms do not provide an explicit content-reuse grant. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Institutional physician teaching guidance directly checked for simple-fluid ultrasound features and observation of small asymptomatic seromas without wound tension. It is not a society guideline.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1r3.a671422d11b7"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.sudarshan-cassivi.traumatic-esophageal-injuries.2019",
    "title": "Management of traumatic esophageal injuries",
    "completeCitation": "Sudarshan M, Cassivi SD. Management of traumatic esophageal injuries. J Thorac Dis. 2019;11(Suppl 2):S172-S176. doi:10.21037/jtd.2018.10.86.",
    "organizationOrJournal": "Journal of Thoracic Disease",
    "authors": [
      "Monisha Sudarshan",
      "Stephen D. Cassivi"
    ],
    "publicationYear": 2019,
    "doi": "10.21037/jtd.2018.10.86",
    "pmid": "30906582",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6389559/",
    "accessedOn": "2026-08-06",
    "sourceClass": "narrative_review",
    "licenseLabel": "Publisher-hosted open article; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Use only for targeted factual verification and independently written synthesis. Do not reproduce article prose, images, or operative figures. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Thoracic-surgery review stating that middle thoracic esophageal injuries are approached from the right and that associated injuries may modify the access incision.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n1.c2583fb48102",
      "claim.n1.5058009b6a15"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.tomaselli.acc-oac-bleeding.2020",
    "title": "2020 ACC Expert Consensus Decision Pathway on Management of Bleeding in Patients on Oral Anticoagulants",
    "completeCitation": "Tomaselli GF, Mahaffey KW, Cuker A, Dobesh PP, Doherty JU, Eikelboom JW, Florido R, Gluckman TJ, Hucker WJ, Mehran R, Messé SR, Perino AC, Rodriguez F, Sarode R, Siegal DM, Wiggins BS. 2020 ACC Expert Consensus Decision Pathway on Management of Bleeding in Patients on Oral Anticoagulants. J Am Coll Cardiol. 2020;76(5):594-622. doi:10.1016/j.jacc.2020.04.053. PMID: 32680646.",
    "organizationOrJournal": "American College of Cardiology; Journal of the American College of Cardiology",
    "authors": [
      "G F Tomaselli",
      "K W Mahaffey",
      "A Cuker",
      "P P Dobesh",
      "J U Doherty",
      "J W Eikelboom",
      "R Florido",
      "T J Gluckman",
      "W J Hucker",
      "R Mehran",
      "S R Messé",
      "A C Perino",
      "F Rodriguez",
      "R Sarode",
      "D M Siegal",
      "B S Wiggins"
    ],
    "publicationYear": 2020,
    "doi": "10.1016/j.jacc.2020.04.053",
    "pmid": "32680646",
    "officialUrl": "https://www.jacc.org/doi/10.1016/j.jacc.2020.04.053",
    "accessedOn": "2026-08-31",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyrighted; targeted verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Use only for targeted factual verification and independently written synthesis. Do not reproduce source prose, tables, figures, or algorithms. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "ACC expert consensus; high authority for anticoagulant-specific reversal framing.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.n1.9e8ad73ce186",
      "claim.n1.106cf1da9d54",
      "claim.n1.0fc2b1f318e6",
      "claim.n1.5eca14d67493",
      "claim.n1r3.vka-sustained-reversal",
      "claim.n1r3.e32ff5667375"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.tree.meckel-diverticulectomy-multicentre.2023",
    "title": "Meckel's diverticulectomy: a multi-centre 19-year retrospective study",
    "completeCitation": "Tree K, Kotecha K, Reeves J, Aitchison L, Chui JN, Gill AJ, Mittal A, Samra JS. Meckel's diverticulectomy: a multi-centre 19-year retrospective study. ANZ J Surg. 2023;93(5):1280-1286. doi:10.1111/ans.18351.",
    "organizationOrJournal": "ANZ Journal of Surgery",
    "authors": [
      "Kevin Tree",
      "Krishna Kotecha",
      "Jenna Reeves",
      "Lucy Aitchison",
      "Juanita Noeline Chui",
      "Anthony J. Gill",
      "Anubhav Mittal",
      "Jaswinder S. Samra"
    ],
    "publicationYear": 2023,
    "doi": "10.1111/ans.18351",
    "pmid": "36821518",
    "officialUrl": "https://pubmed.ncbi.nlm.nih.gov/36821518/",
    "accessedOn": "2026-08-06",
    "sourceClass": "observational_study",
    "licenseLabel": "Copyrighted journal article; abstract and bibliographic metadata available",
    "reuseStatus": "metadata_only_rights_reserved",
    "reuseNotes": "Use bibliographic metadata and abstract-level factual cross-checking only. Do not reproduce or adapt article prose, tables, or figures. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Seven-hospital retrospective study finding no significant length, width, or ratio difference between diverticulectomy and bowel-resection groups and supporting caution against an absolute morphology-only rule.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n1.a667976ba66d",
      "claim.n1.716431389a46",
      "claim.n1.a10ad9a5021b"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.varcoe.short-meckel-heterotopic-mucosa.2004",
    "title": "Diverticulectomy is inadequate treatment for short Meckel's diverticulum with heterotopic mucosa",
    "completeCitation": "Varcoe RL, Wong SW, Taylor CF, Newstead GL. Diverticulectomy is inadequate treatment for short Meckel's diverticulum with heterotopic mucosa. ANZ J Surg. 2004;74(10):869-872. doi:10.1111/j.1445-1433.2004.03191.x.",
    "organizationOrJournal": "ANZ Journal of Surgery",
    "authors": [
      "Ramon L. Varcoe",
      "Shing W. Wong",
      "Claire F. Taylor",
      "Graham L. Newstead"
    ],
    "publicationYear": 2004,
    "doi": "10.1111/j.1445-1433.2004.03191.x",
    "pmid": "15456435",
    "officialUrl": "https://pubmed.ncbi.nlm.nih.gov/15456435/",
    "accessedOn": "2026-08-06",
    "sourceClass": "observational_study",
    "licenseLabel": "Copyrighted journal article; abstract and bibliographic metadata available",
    "reuseStatus": "metadata_only_rights_reserved",
    "reuseNotes": "Use bibliographic metadata and abstract-level factual cross-checking only. Do not reproduce or adapt article prose, tables, or figures. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Retrospective morphology study supporting the height-to-diameter ratio as a limited predictor of whether heterotopic gastric mucosa may extend to the base.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n1.a667976ba66d",
      "claim.n1.a10ad9a5021b"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.vather-bissett.prolonged-postoperative-ileus.2013",
    "title": "Management of prolonged post-operative ileus: evidence-based recommendations",
    "completeCitation": "Vather R, Bissett I. Management of prolonged post-operative ileus: evidence-based recommendations. ANZ J Surg. 2013;83(5):319-324. doi:10.1111/ans.12102.",
    "organizationOrJournal": "ANZ Journal of Surgery",
    "authors": [
      "Ryash Vather",
      "Ian Bissett"
    ],
    "publicationYear": 2013,
    "doi": "10.1111/ans.12102",
    "pmid": "23418987",
    "officialUrl": "https://pubmed.ncbi.nlm.nih.gov/23418987/",
    "accessedOn": "2026-08-06",
    "sourceClass": "narrative_review",
    "licenseLabel": "Copyright Royal Australasian College of Surgeons and Wiley; targeted factual verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Use only for targeted factual verification and independently written synthesis. Do not reproduce review prose, tables, or recommendation wording. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Ileus-specific evidence review supporting parenteral nutrition when adequate oral intake remains intolerable beyond seven postoperative days while acknowledging a variable evidence base.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.d585be062067",
      "claim.n1.c1bd8baa573c",
      "claim.n1.6aa4b6371145"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.wses-aast.thoracic-trauma-guideline.2025",
    "title": "Thoracic trauma WSES-AAST guidelines",
    "completeCitation": "Coccolini F, Cremonini C, Moore EE, et al. Thoracic trauma WSES-AAST guidelines. World J Emerg Surg. 2025;20(1):78. doi:10.1186/s13017-025-00651-1.",
    "organizationOrJournal": "World Society of Emergency Surgery; American Association for the Surgery of Trauma; World Journal of Emergency Surgery",
    "authors": [
      "Federico Coccolini",
      "Camilla Cremonini",
      "Ernest E. Moore",
      "Ian Civil",
      "Zsolt Balogh",
      "Ari Leppaniemi",
      "WSES-AAST guideline group"
    ],
    "publicationYear": 2025,
    "doi": "10.1186/s13017-025-00651-1",
    "pmid": "41094688",
    "officialUrl": "https://link.springer.com/article/10.1186/s13017-025-00651-1",
    "accessedOn": "2026-08-06",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Use for targeted factual verification and independently written synthesis. Do not adapt or reproduce guideline prose, tables, figures, or algorithms. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Current WSES-AAST thoracic-trauma guideline identifying right thoracotomy as the typical open exposure for azygos-vein repair while emphasizing physiology- and injury-dependent surgical access.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.n1.c2583fb48102",
      "claim.n1.5058009b6a15"
    ]
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
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
    "reuseNotes": "Use with attribution for independently written factual synthesis. Do not reproduce recommendation tables, algorithms, figures, or extended prose. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Professional-society guidance supporting synthetic mesh in selected clean-contaminated abdominal-wall hernia repair after bowel intervention when gross enteric spillage is absent.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.n1.e22669366268",
      "claim.n1.8e30265aebbd",
      "claim.n1.4b2bd6d4bf88"
    ]
  }
];
export const QUESTION_NEW_N1_ROUND3_CLAIM_PROVENANCE = [
  {
    "claimId": "claim.n1r2.4ffb2fc1fbe9",
    "inheritedClaimId": "claim.bread-butter.breast-mass.image-guided-core-biopsy",
    "statementUnchanged": true,
    "inheritedContentVersion": "development-batch.2026-09-17.bread-and-butter.1",
    "inheritedLastCheckedOn": "2026-09-17",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Unchanged earlier recorded claim under a round-two metadata version",
    "sourcePublicationKeys": [
      "doi:10.1016/j.jacr.2023.02.013"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1r2.1c9136f72fb2",
    "inheritedClaimId": "claim.bread-butter.indirect-inguinal-hernia.lateral-epigastric",
    "statementUnchanged": true,
    "inheritedContentVersion": "development-batch.2026-09-17.bread-and-butter.1",
    "inheritedLastCheckedOn": "2026-09-17",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Unchanged earlier recorded claim under a round-two metadata version",
    "sourcePublicationKeys": [
      "doi:10.15557/jou.2021.0008"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.d2d731b45c78",
    "inheritedClaimId": "claim.breast-imaging.calcification.suspicious-pattern",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "url:https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/Reporting-and-Data-Systems/BI-RADS",
      "url:https://www.cancer.gov/types/breast/screening/mammograms"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.6709782fef79",
    "inheritedClaimId": "claim.breast-imaging.calcification.typically-benign-patterns",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "url:https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/Reporting-and-Data-Systems/BI-RADS"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.640146b1029b",
    "inheritedClaimId": "claim.breast-imaging.mass.density-not-diagnostic-alone",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "url:https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/Reporting-and-Data-Systems/BI-RADS",
      "url:https://www.cancer.gov/types/breast/screening/mammograms"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.25cb8cbda68e",
    "inheritedClaimId": "claim.breast-imaging.mass.suspicious-morphology",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "url:https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/Reporting-and-Data-Systems/BI-RADS",
      "url:https://www.cancer.gov/types/breast/screening/mammograms"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.60fa5e6f41c7",
    "inheritedClaimId": "claim.breast-imaging.suspicion-is-not-tissue-diagnosis",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "url:https://www.cancer.gov/types/breast/screening/mammograms"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.ce34a3a54ed6",
    "inheritedClaimId": "claim.breast-mass.age-30-to-39.initial-diagnostic-imaging",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1016/j.jacr.2023.02.013"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.041c942faf2d",
    "inheritedClaimId": "claim.burn.deep-hand-consult",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-09-28",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "url:https://www.ameriburn.org/burn-care-team/resources/guidelines-for-burn-patient-referral"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.8e0e2cdeb284",
    "inheritedClaimId": "claim.burn.deeper-depth-contrast",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-09-28",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "url:https://www.ameriburn.org/burn-care-team/resources/guidelines-for-burn-patient-referral"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.7be9fe6e82d2",
    "inheritedClaimId": "claim.burn.referral-boundary",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-09-28",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "url:https://www.ameriburn.org/burn-care-team/resources/guidelines-for-burn-patient-referral",
      "url:https://cpr.heart.org/en/resuscitation-science/2024-first-aid-guidelines"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.f4db77ade866",
    "inheritedClaimId": "claim.burn.superficial-partial-depth",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-09-28",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "url:https://www.ameriburn.org/burn-care-team/resources/guidelines-for-burn-patient-referral",
      "url:https://cpr.heart.org/en/resuscitation-science/2024-first-aid-guidelines"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.5294d3feead5",
    "inheritedClaimId": "claim.celiac.adult-biopsy",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-09-09",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "url:https://www.niddk.nih.gov/health-information/professionals/clinical-tools-patient-management/digestive-diseases/celiac-disease-health-care-professionals",
      "url:https://www.niddk.nih.gov/health-information/digestive-diseases/celiac-disease/diagnosis"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.87469918a5c7",
    "inheritedClaimId": "claim.celiac.gluten-testing-boundary",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-09-09",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "url:https://www.niddk.nih.gov/health-information/professionals/clinical-tools-patient-management/digestive-diseases/celiac-disease-health-care-professionals",
      "url:https://www.niddk.nih.gov/health-information/digestive-diseases/celiac-disease/diagnosis",
      "url:https://gi.org/topics/celiac-disease/"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.101c4b1dec35",
    "inheritedClaimId": "claim.celiac.hla-susceptibility-not-active-disease",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-09-09",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "url:https://www.niddk.nih.gov/health-information/professionals/clinical-tools-patient-management/digestive-diseases/celiac-disease-health-care-professionals"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.50691038a9ee",
    "inheritedClaimId": "claim.celiac.igg-tests-in-iga-deficiency",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-09-09",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "url:https://www.niddk.nih.gov/health-information/professionals/clinical-tools-patient-management/digestive-diseases/celiac-disease-health-care-professionals"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.8a59fd5f0d78",
    "inheritedClaimId": "claim.celiac.initial-serology",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-09-09",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "url:https://www.niddk.nih.gov/health-information/professionals/clinical-tools-patient-management/digestive-diseases/celiac-disease-health-care-professionals",
      "url:https://www.niddk.nih.gov/health-information/digestive-diseases/celiac-disease/diagnosis"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.41c158e0d466",
    "inheritedClaimId": "claim.chylous-ascites.fluid-analysis-confirmation",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1155/2014/240473",
      "doi:10.14218/jcth.2017.00035"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.8a0b5986a99c",
    "inheritedClaimId": "claim.chylous-ascites.imaging-does-not-confirm-composition",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.14218/jcth.2017.00035"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1r2.53fd4a912f74",
    "inheritedClaimId": "claim.gastric-adenocarcinoma.prophylactic-splenectomy-increased-morbidity",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.owner-row-042.2026-08-06.1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Unchanged earlier recorded claim under a round-two metadata version",
    "sourcePublicationKeys": [
      "doi:10.5230/jgc.2025.25.e11",
      "doi:10.1007/s10120-022-01331-8",
      "doi:10.1097/sla.0000000000001814"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1r2.60c60d811db1",
    "inheritedClaimId": "claim.gastric-adenocarcinoma.prophylactic-splenectomy-no-survival-benefit",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.owner-row-042.2026-08-06.1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Unchanged earlier recorded claim under a round-two metadata version",
    "sourcePublicationKeys": [
      "doi:10.5230/jgc.2025.25.e11",
      "doi:10.1007/s10120-022-01331-8",
      "doi:10.1097/sla.0000000000001814"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.5b207d0586d5",
    "inheritedClaimId": "claim.gastric-adenocarcinoma.spleen-preservation-scope-boundary",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.5230/jgc.2025.25.e11",
      "doi:10.1007/s10120-022-01331-8",
      "doi:10.1097/sla.0000000000001814"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.b718f6a72a97",
    "inheritedClaimId": "claim.gastroparesis.diagnostic-framework",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.14309/ajg.0000000000001874",
      "doi:10.1053/j.gastro.2025.08.004"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.e7e333d36883",
    "inheritedClaimId": "claim.gastroparesis.four-hour-solid-meal-scintigraphy",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.14309/ajg.0000000000001874",
      "doi:10.1053/j.gastro.2025.08.004",
      "url:https://gi.org/topics/gastroparesis/"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.55ab54b0240a",
    "inheritedClaimId": "claim.gastroparesis.nonemptying-test-boundary",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.14309/ajg.0000000000001874"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.25d060186678",
    "inheritedClaimId": "claim.graves-rai-appropriate-candidate.rai-treatment-role",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-09-09",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1007/s00259-023-06274-5",
      "url:https://www.niddk.nih.gov/health-information/endocrine-diseases/graves-disease"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1r2.6d89da8ecd7a",
    "inheritedClaimId": "claim.graves-rai-lactation-contraindication.lactation-treatment-contraindication",
    "statementUnchanged": true,
    "inheritedContentVersion": "evidence.graves-row-061.2026-09-09.1",
    "inheritedLastCheckedOn": "2026-09-09",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Unchanged earlier recorded claim under a round-two metadata version",
    "sourcePublicationKeys": [
      "doi:10.1007/s00259-023-06274-5",
      "url:https://www.ncbi.nlm.nih.gov/books/NBK501563/",
      "url:https://www.thyroid.org/radioactive-iodine/"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.dae1a9bf76fe",
    "inheritedClaimId": "claim.graves-trab-diagnostic-support.biochemical-thyrotoxicosis-context",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-09-09",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "url:https://www.thyroid.org/thyroid-function-tests/"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1r2.94bfa8e95e0e",
    "inheritedClaimId": "claim.gs028d.acidosis.blood-gas",
    "statementUnchanged": true,
    "inheritedContentVersion": "development-batch.2026-10-03.coverage-gaps.1",
    "inheritedLastCheckedOn": "2026-10-03",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Unchanged earlier recorded claim under a round-two metadata version",
    "sourcePublicationKeys": [
      "doi:10.1186/s13613-019-0563-2"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.6bcc3f0847f4",
    "inheritedClaimId": "claim.gs028e.laparoscopy.co2-load-respiratory-acidemia",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-10-07",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.3390/jcm9124058",
      "doi:10.1007/s11701-026-03392-8"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.1d724576493f",
    "inheritedClaimId": "claim.gs028e.mixing_limits",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-10-07",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.3324/haematol.2019.230771",
      "doi:10.5114/ait.2020.96484"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.5e25f9e918c6",
    "inheritedClaimId": "claim.gs028e.mixing_method",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-10-07",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.3324/haematol.2019.230771",
      "doi:10.5114/ait.2020.96484"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.b02be3363804",
    "inheritedClaimId": "claim.gs028e.mixing_time_dependent",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-10-07",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.3324/haematol.2019.230771",
      "doi:10.5114/ait.2020.96484"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1r2.a6defa925838",
    "inheritedClaimId": "claim.gs028f.melanoma.metastatic-primary-identity",
    "statementUnchanged": true,
    "inheritedContentVersion": "development-batch.2026-10-07.variety.2",
    "inheritedLastCheckedOn": "2026-10-07",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Unchanged earlier recorded claim under a round-two metadata version",
    "sourcePublicationKeys": [
      "url:https://www.cancer.gov/types/metastatic-cancer"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.dae72efb5f1b",
    "inheritedClaimId": "claim.gs028f.neck.core-biopsy-alternative",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-10-07",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1017/s0022215123001615"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.6b82036e466c",
    "inheritedClaimId": "claim.gs028f.neck.imaging-versus-tissue-diagnosis",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-10-07",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1017/s0022215123001615"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.f0828e8bc9b1",
    "inheritedClaimId": "claim.gs028f.neck.needle-before-open",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-10-07",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1017/s0022215123001615"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.47d310305029",
    "inheritedClaimId": "claim.gs028f.oxygen.anemia-content-limit",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-10-07",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "url:https://www.nhlbi.nih.gov/health/anemia/diagnosis",
      "url:https://www.fda.gov/media/175828/download"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.05bd95260a85",
    "inheritedClaimId": "claim.gs028f.oxygen.clip-display-limit",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-10-07",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "url:https://www.fda.gov/consumers/consumer-updates/pulse-oximeter-basics"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.39e090dfc4f0",
    "inheritedClaimId": "claim.gs028f.oxygen.hemoglobin-carriage",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-10-07",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "url:https://www.nhlbi.nih.gov/health/anemia/diagnosis",
      "url:https://www.fda.gov/media/175828/download"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.c3c167a7739f",
    "inheritedClaimId": "claim.gs028f.oxygen.saturation-fraction",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-10-07",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "url:https://www.fda.gov/media/175828/download",
      "url:https://www.fda.gov/consumers/consumer-updates/pulse-oximeter-basics"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.2682ba46b469",
    "inheritedClaimId": "claim.gs028g.incidental-gallbladder.completely-resected-t1a",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-10-07",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.3346/jkms.2014.29.10.1333",
      "url:https://www.cancer.org/cancer/types/gallbladder-cancer/treating/surgery.html"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.49bbc47617f1",
    "inheritedClaimId": "claim.gs028g.incidental-gallbladder.completely-resected-t1a.fact2",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-10-07",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.3346/jkms.2014.29.10.1333",
      "url:https://www.cancer.org/cancer/types/gallbladder-cancer/treating/surgery.html"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.0edd7f3d0ae9",
    "inheritedClaimId": "claim.gs028g.incidental-gallbladder.t1a-depth.fact2",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-10-07",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "url:https://www.cancer.gov/types/gallbladder/hp/gallbladder-treatment-pdq",
      "doi:10.3346/jkms.2014.29.10.1333"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.a2f96b40428e",
    "inheritedClaimId": "claim.hcc.milan.guides-evaluation-not-automatic-listing",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1097/hep.0000000000000466",
      "doi:10.1097/hep.0000000000001644"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.e0b6bc7a19dc",
    "inheritedClaimId": "claim.hcc.milan.no-macrovascular-invasion-or-extrahepatic-spread",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1097/hep.0000000000001644"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.306f7180fb92",
    "inheritedClaimId": "claim.hcc.milan.standard-tumor-burden",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1097/hep.0000000000000466"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.addcd31f93bb",
    "inheritedClaimId": "claim.hcc.resection.favorable-compensated-cirrhosis-profile",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-21",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1097/hep.0000000000000466"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.bf9e72bc7198",
    "inheritedClaimId": "claim.hcc.resection.portal-hypertension-selection-nuance",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-21",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1097/hep.0000000000000466"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.589f16048c12",
    "inheritedClaimId": "claim.inguinal-hernia.direct-anatomic-location",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-07-30",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.3389/jaws.2023.11378"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.ed07ff6b964e",
    "inheritedClaimId": "claim.inguinal-hernia.direct-posterior-wall-defect",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-07-30",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.3389/jaws.2023.11378"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.5cdd738832f7",
    "inheritedClaimId": "claim.lymphedema.differential-safety",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-09-28",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "url:https://isl.arizona.edu/sites/default/files/2024-11/THE-DIAGNOSIS-AND-TREATMENT-OF-PERIPHERAL-LYMPHEDEMA-2023-CONSENSUS-DOCUMENT-OF-THE-INTERNATIONAL-SOCIETY-OF-LYMPHOLOGY.pdf",
      "url:https://www.cancer.gov/about-cancer/treatment/side-effects/lymphedema/lymphedema-hp-pdq"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.89526aa237e7",
    "inheritedClaimId": "claim.lymphedema.secondary-recognition",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-09-28",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "url:https://isl.arizona.edu/sites/default/files/2024-11/THE-DIAGNOSIS-AND-TREATMENT-OF-PERIPHERAL-LYMPHEDEMA-2023-CONSENSUS-DOCUMENT-OF-THE-INTERNATIONAL-SOCIETY-OF-LYMPHOLOGY.pdf",
      "url:https://www.cancer.gov/about-cancer/treatment/side-effects/lymphedema/lymphedema-hp-pdq"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.a667976ba66d",
    "inheritedClaimId": "claim.meckel-diverticulum.long-narrow-tip-only-diverticulectomy",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.3389/fsurg.2018.00055",
      "doi:10.1111/j.1445-1433.2004.03191.x",
      "doi:10.1111/ans.18351"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.716431389a46",
    "inheritedClaimId": "claim.meckel-diverticulum.resection-extent-base-and-ileum",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.3389/fsurg.2018.00055",
      "doi:10.7150/ijms.4170",
      "doi:10.1111/ans.18351"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.a10ad9a5021b",
    "inheritedClaimId": "claim.meckel-diverticulum.size-alone-not-universal",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.3389/fsurg.2018.00055",
      "doi:10.7150/ijms.4170",
      "doi:10.1111/j.1445-1433.2004.03191.x",
      "doi:10.1111/ans.18351",
      "doi:10.1097/01.sla.0000154270.14308.5f"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1r2.gas-record-interpretation",
    "inheritedClaimId": "claim.n1r2.gas-record-interpretation",
    "statementUnchanged": false,
    "checkedLocallyOn": "2026-11-04",
    "basisClaimIds": [
      "claim.qf2.qualitative-co2-acid-base-pattern",
      "claim.qf3.direction-versus-acidemia",
      "claim.gs028d.acidosis.blood-gas"
    ],
    "basisChecks": [
      {
        "id": "claim.qf2.qualitative-co2-acid-base-pattern",
        "lastCheckedOn": "2026-11-04",
        "contentVersion": "question-flags-round2.evidence.2026-11-04.v1"
      },
      {
        "id": "claim.qf3.direction-versus-acidemia",
        "lastCheckedOn": "2026-11-04",
        "contentVersion": "question-flags-round3.evidence.2026-11-04.v1"
      },
      {
        "id": "claim.gs028d.acidosis.blood-gas",
        "lastCheckedOn": "2026-10-03",
        "contentVersion": "development-batch.2026-10-03.coverage-gaps.1"
      }
    ],
    "method": "Explicit synthesis limited to the displayed observations; the two gases are internally consistent with their reported components. No compensation formula, reference-interval universality or treatment cutoff is asserted.",
    "sourcePublicationKeys": [
      "doi:10.3390/jcm9124058",
      "doi:10.1007/s11701-026-03392-8",
      "doi:10.1186/s13613-019-0563-2"
    ],
    "externalVerification": "No new retrieval. Named-drug examples retain an explicit exact-support hold; logical record interpretations are limited to the constructed observations.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1r2.named-enoxaparin-role",
    "inheritedClaimId": "claim.n1r2.named-enoxaparin-role",
    "statementUnchanged": false,
    "checkedLocallyOn": "2026-11-04",
    "basisClaimIds": [
      "claim.postoperative-dvt.three-month-anticoagulation"
    ],
    "basisChecks": [
      {
        "id": "claim.postoperative-dvt.three-month-anticoagulation",
        "lastCheckedOn": "2026-09-12",
        "contentVersion": "development-batch.2026-09-12.1"
      }
    ],
    "method": "Named regimen/indication distinction applied to the recorded therapeutic-anticoagulation requirement; no dose, treatment-failure rescue or postoperative-resumption rule. Exact named-regimen support not newly retrieved; clinician/source verification required.",
    "sourcePublicationKeys": [
      "url:https://www.hematology.org/education/clinicians/guidelines-and-quality-care/choosing-wisely",
      "url:https://www.nhlbi.nih.gov/health/venous-thromboembolism/treatment"
    ],
    "externalVerification": "No new retrieval. Named-drug examples retain an explicit exact-support hold; logical record interpretations are limited to the constructed observations.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1r2.named-methimazole",
    "inheritedClaimId": "claim.n1r2.named-methimazole",
    "statementUnchanged": false,
    "checkedLocallyOn": "2026-11-04",
    "basisClaimIds": [
      "claim.graves-rai-appropriate-candidate.rai-treatment-role"
    ],
    "basisChecks": [
      {
        "id": "claim.graves-rai-appropriate-candidate.rai-treatment-role",
        "lastCheckedOn": "2026-09-09",
        "contentVersion": "evidence.graves-row-061.2026-09-09.1"
      }
    ],
    "method": "Named example of the recorded antithyroid-drug class. New offline naming synthesis; exact named-drug support was not newly retrieved and requires targeted verification before clinical approval.",
    "sourcePublicationKeys": [
      "doi:10.1007/s00259-023-06274-5",
      "url:https://www.niddk.nih.gov/health-information/endocrine-diseases/graves-disease"
    ],
    "externalVerification": "No new retrieval. Named-drug examples retain an explicit exact-support hold; logical record interpretations are limited to the constructed observations.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1r2.named-propranolol",
    "inheritedClaimId": "claim.n1r2.named-propranolol",
    "statementUnchanged": false,
    "checkedLocallyOn": "2026-11-04",
    "basisClaimIds": [
      "claim.graves-rai-appropriate-candidate.rai-treatment-role"
    ],
    "basisChecks": [
      {
        "id": "claim.graves-rai-appropriate-candidate.rai-treatment-role",
        "lastCheckedOn": "2026-09-09",
        "contentVersion": "evidence.graves-row-061.2026-09-09.1"
      }
    ],
    "method": "Named example of the recorded beta-blocker symptom-control class. New offline naming synthesis; no claim that all doses lack other thyroid effects. Targeted named-drug verification remains a clinical/source hold.",
    "sourcePublicationKeys": [
      "doi:10.1007/s00259-023-06274-5",
      "url:https://www.niddk.nih.gov/health-information/endocrine-diseases/graves-disease"
    ],
    "externalVerification": "No new retrieval. Named-drug examples retain an explicit exact-support hold; logical record interpretations are limited to the constructed observations.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1r2.target-representation",
    "inheritedClaimId": "claim.n1r2.target-representation",
    "statementUnchanged": false,
    "checkedLocallyOn": "2026-11-04",
    "basisClaimIds": [
      "claim.gs028f.neck.imaging-versus-tissue-diagnosis",
      "claim.breast-imaging.suspicion-is-not-tissue-diagnosis"
    ],
    "basisChecks": [
      {
        "id": "claim.gs028f.neck.imaging-versus-tissue-diagnosis",
        "lastCheckedOn": "2026-10-07",
        "contentVersion": "development-batch.2026-10-07.variety.2"
      },
      {
        "id": "claim.breast-imaging.suspicion-is-not-tissue-diagnosis",
        "lastCheckedOn": "2026-08-06",
        "contentVersion": "clinical.owner-row-035.2026-08-06.1"
      }
    ],
    "method": "Observation-bound logical synthesis from recorded tissue-versus-imaging claims; no new biopsy threshold or universal adequacy algorithm.",
    "sourcePublicationKeys": [
      "doi:10.1017/s0022215123001615",
      "url:https://www.cancer.gov/types/breast/screening/mammograms"
    ],
    "externalVerification": "No new retrieval. Named-drug examples retain an explicit exact-support hold; logical record interpretations are limited to the constructed observations.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.e2f4cca1859a",
    "inheritedClaimId": "claim.nutrition.oral-enteral",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-09-29",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1016/j.clnu.2021.03.031"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.e757fd75ecb1",
    "inheritedClaimId": "claim.nutrition.pn-boundary",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-09-29",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1016/j.clnu.2021.03.031"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.49101d9d3b5b",
    "inheritedClaimId": "claim.phyllodes.benign-complete-excision",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-31",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1001/jamasurg.2025.4392",
      "doi:10.1093/bjs/znaf152"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.8ace163cc27a",
    "inheritedClaimId": "claim.phyllodes.benign-positive-margin-management",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-31",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1001/jamasurg.2025.4392",
      "doi:10.1093/bjs/znaf152"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.bb08015a8192",
    "inheritedClaimId": "claim.phyllodes.borderline-close-margin-management",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-31",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1093/bjs/znaf152"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.66ccd63686fe",
    "inheritedClaimId": "claim.phyllodes.borderline-margin-target",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-31",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1093/bjs/znaf152"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.866880df6471",
    "inheritedClaimId": "claim.phyllodes.hematogenous-spread-pattern",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-31",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1093/bjs/znaf152"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.e09de46b1f33",
    "inheritedClaimId": "claim.phyllodes.malignant-close-margin-management",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-31",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1093/bjs/znaf152"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.f580ee9e46ac",
    "inheritedClaimId": "claim.phyllodes.malignant-margin-target",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-31",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1093/bjs/znaf152"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.2ac9c5b4784e",
    "inheritedClaimId": "claim.phyllodes.no-routine-axillary-staging",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-31",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1093/bjs/znaf152"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.94adc8a176b5",
    "inheritedClaimId": "claim.phyllodes.suspicious-node-biopsy-exception",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-31",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1093/bjs/znaf152"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.68a1f43b7b9f",
    "inheritedClaimId": "claim.postoperative-abdominal-symptoms.ct-evaluation",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1016/j.jacr.2018.09.010"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.9eec3f70b5d0",
    "inheritedClaimId": "claim.postoperative-chylous-ascites.initial-hospital-management",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1155/2014/240473",
      "doi:10.14218/jcth.2017.00035",
      "doi:10.1016/j.clnu.2021.09.039"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.9c12bef8ae65",
    "inheritedClaimId": "claim.postoperative-dvt.prompt-venous-duplex",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-09-12",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "url:https://www.cdc.gov/blood-clots/testing-diagnosis/index.html",
      "url:https://www.nhlbi.nih.gov/health/deep-vein-thrombosis"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.8a0b2ca37037",
    "inheritedClaimId": "claim.postoperative-dvt.three-month-anticoagulation",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-09-12",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "url:https://www.hematology.org/education/clinicians/guidelines-and-quality-care/choosing-wisely",
      "url:https://www.nhlbi.nih.gov/health/venous-thromboembolism/treatment"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.d585be062067",
    "inheritedClaimId": "claim.postoperative-ileus.nutrition-not-motility-treatment",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1016/j.clnu.2025.08.029",
      "doi:10.1111/ans.12102"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.c1bd8baa573c",
    "inheritedClaimId": "claim.postoperative-ileus.parenteral-nutrition-support",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1016/j.clnu.2025.08.029",
      "doi:10.1111/ans.12102"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.6aa4b6371145",
    "inheritedClaimId": "claim.postoperative-ileus.persistent-enteral-infeasibility",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1016/j.clnu.2025.08.029",
      "doi:10.1111/ans.12102"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.c9e80d7dd8ad",
    "inheritedClaimId": "claim.primary-aldosteronism.ct-avs-before-surgery",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-09-12",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1210/clinem/dgaf284"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.228e2a181e73",
    "inheritedClaimId": "claim.primary-aldosteronism.overt-phenotype-no-suppression",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-09-12",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1210/clinem/dgaf284"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.edd802be1c43",
    "inheritedClaimId": "claim.primary-aldosteronism.prepared-arr-screening",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-09-12",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1210/clinem/dgaf284"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1r2.a64275d45f37",
    "inheritedClaimId": "claim.qf3.direction-versus-acidemia",
    "statementUnchanged": true,
    "inheritedContentVersion": "question-flags-round3.evidence.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-11-04",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Unchanged earlier recorded claim under a round-two metadata version",
    "sourcePublicationKeys": [
      "doi:10.1186/s13613-019-0563-2",
      "doi:10.3390/jcm9124058",
      "doi:10.1007/s11701-026-03392-8"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.e498c90de8b4",
    "inheritedClaimId": "claim.qq20261102.gastric-adjacent-organ-scope",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-11-02",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1007/s10120-022-01331-8",
      "doi:10.1007/s10120-025-01698-4"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.72256312b855",
    "inheritedClaimId": "claim.severe-burn.early-enteral-nutrition-safety-boundary",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1002/ams2.739",
      "url:https://www.east.org/education-resources/practice-management-guidelines/details/nutritional-support-timing-early-versus-delayed-enteral-feedings-update-in-process"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.84c927796922",
    "inheritedClaimId": "claim.severe-burn.early-enteral-nutrition-within-24-hours",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1002/ams2.739",
      "url:https://www.east.org/education-resources/practice-management-guidelines/details/nutritional-support-timing-early-versus-delayed-enteral-feedings-update-in-process",
      "doi:10.1017/s0007114524002344"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.f73aaaad7469",
    "inheritedClaimId": "claim.severe-burn.enteral-route-preferred-when-feasible",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1002/ams2.739",
      "url:https://www.east.org/education-resources/practice-management-guidelines/details/nutritional-support-timing-early-versus-delayed-enteral-feedings-update-in-process",
      "doi:10.1017/s0007114524002344"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.c2583fb48102",
    "inheritedClaimId": "claim.thoracic-trauma.planned-right-posterolateral-context",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1186/s13017-025-00651-1",
      "doi:10.3390/clinpract14050148",
      "doi:10.21037/jtd.2018.10.86",
      "url:https://www.aast.org/asset/E6C2A1CC-E681-4A62-B1426CAD3B8ED3A9/"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.f54f71900adc",
    "inheritedClaimId": "claim.thoracic-trauma.resuscitative-incision-boundary",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.3390/clinpract14050148",
      "url:https://www.aast.org/asset/E6C2A1CC-E681-4A62-B1426CAD3B8ED3A9/"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.5058009b6a15",
    "inheritedClaimId": "claim.thoracic-trauma.right-thoracotomy-exposure",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1186/s13017-025-00651-1",
      "doi:10.3390/clinpract14050148",
      "doi:10.21037/jtd.2018.10.86"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.9e8ad73ce186",
    "inheritedClaimId": "claim.trauma-vka.composition",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-31",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1016/j.jacc.2020.04.053",
      "url:https://www.fda.gov/vaccines-blood-biologics/approved-blood-products/kcentra"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.106cf1da9d54",
    "inheritedClaimId": "claim.trauma-vka.iv-vitamin-k",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-31",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1186/s13054-023-04327-7",
      "doi:10.1016/j.jacc.2020.04.053"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.0fc2b1f318e6",
    "inheritedClaimId": "claim.trauma-vka.pcc-selection",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-31",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1186/s13054-023-04327-7",
      "doi:10.1016/j.jacc.2020.04.053",
      "url:https://www.fda.gov/vaccines-blood-biologics/approved-blood-products/kcentra",
      "url:https://www.facs.org/quality-programs/trauma/quality/best-practices-guidelines/"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.5eca14d67493",
    "inheritedClaimId": "claim.trauma-vka.scope",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-31",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.1186/s13054-023-04327-7",
      "doi:10.1016/j.jacc.2020.04.053",
      "url:https://www.fda.gov/vaccines-blood-biologics/approved-blood-products/kcentra",
      "url:https://www.facs.org/quality-programs/trauma/quality/best-practices-guidelines/"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.e22669366268",
    "inheritedClaimId": "claim.ventral-hernia.controlled-contamination-macroporous-synthetic-mesh",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.3389/jaws.2026.16228",
      "doi:10.1186/s13017-017-0149-y",
      "doi:10.1001/jamasurg.2021.6902"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.8e30265aebbd",
    "inheritedClaimId": "claim.ventral-hernia.controlled-enterotomy-selected-single-stage-repair",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.3389/jaws.2026.16228",
      "doi:10.1186/s13017-017-0149-y",
      "doi:10.1007/s00464-016-5072-x"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1.4b2bd6d4bf88",
    "inheritedClaimId": "claim.ventral-hernia.enterotomy-mesh-selection-safety-boundary",
    "statementUnchanged": true,
    "inheritedContentVersion": "clinical.question-new-n1.2026-11-04.v1",
    "inheritedLastCheckedOn": "2026-08-06",
    "checkedLocallyOn": "2026-11-04",
    "reuseKind": "Exact N1 claim record retained",
    "sourcePublicationKeys": [
      "doi:10.3389/jaws.2026.16228",
      "doi:10.1186/s13017-017-0149-y",
      "doi:10.1007/s00464-016-5072-x"
    ],
    "externalVerification": "Original dates only; no source newly retrieved.",
    "reuseRound": "exact_round_two_record_retained"
  },
  {
    "claimId": "claim.n1r3.7b235321cfc5",
    "inheritedClaimId": "claim.bread-butter.inguinal-hernia.watchful-waiting",
    "statementUnchanged": true,
    "inheritedLastCheckedOn": "2026-09-17",
    "inheritedContentVersion": "development-batch.2026-09-17.bread-and-butter.1",
    "checkedLocallyOn": "2026-11-04",
    "reuseRound": "unchanged_recorded_statement",
    "externalVerification": "No new retrieval; original source dates retained."
  },
  {
    "claimId": "claim.n1r3.9f2884215d43",
    "inheritedClaimId": "claim.gs028c.palpable.biopsy",
    "statementUnchanged": true,
    "inheritedLastCheckedOn": "2026-10-02",
    "inheritedContentVersion": "development-batch.2026-10-02.pre-endoscopy.1",
    "checkedLocallyOn": "2026-11-04",
    "reuseRound": "unchanged_recorded_statement",
    "externalVerification": "No new retrieval; original source dates retained."
  },
  {
    "claimId": "claim.n1r3.149ce209d4ee",
    "inheritedClaimId": "claim.gs028f.refeeding.monitoring-separate",
    "statementUnchanged": true,
    "inheritedLastCheckedOn": "2026-10-07",
    "inheritedContentVersion": "development-batch.2026-10-07.variety.2",
    "checkedLocallyOn": "2026-11-04",
    "reuseRound": "unchanged_recorded_statement",
    "externalVerification": "No new retrieval; original source dates retained."
  },
  {
    "claimId": "claim.n1r3.a2a9c29cbbcf",
    "inheritedClaimId": "claim.gs028f.refeeding.phosphate-not-specific",
    "statementUnchanged": true,
    "inheritedLastCheckedOn": "2026-10-07",
    "inheritedContentVersion": "development-batch.2026-10-07.variety.2",
    "checkedLocallyOn": "2026-11-04",
    "reuseRound": "unchanged_recorded_statement",
    "externalVerification": "No new retrieval; original source dates retained."
  },
  {
    "claimId": "claim.n1r3.78d2ba5c0eb0",
    "inheritedClaimId": "claim.gs028f.refeeding.thiamine-before-intake",
    "statementUnchanged": true,
    "inheritedLastCheckedOn": "2026-10-07",
    "inheritedContentVersion": "development-batch.2026-10-07.variety.2",
    "checkedLocallyOn": "2026-11-04",
    "reuseRound": "unchanged_recorded_statement",
    "externalVerification": "No new retrieval; original source dates retained."
  },
  {
    "claimId": "claim.n1r3.ee52cfc5f587",
    "inheritedClaimId": "claim.inguinal-hernia.direct-search-boundary",
    "statementUnchanged": true,
    "inheritedLastCheckedOn": "2026-07-30",
    "inheritedContentVersion": "clinical.owner-rows-008-025.2026-08-06.1",
    "checkedLocallyOn": "2026-11-04",
    "reuseRound": "unchanged_recorded_statement",
    "externalVerification": "No new retrieval; original source dates retained."
  },
  {
    "claimId": "claim.n1r3.f7c0c4468398",
    "inheritedClaimId": "claim.inguinal-hernia.symptomatic-elective-repair",
    "statementUnchanged": true,
    "inheritedLastCheckedOn": "2026-09-10",
    "inheritedContentVersion": "development-batch.2026-09-10.1",
    "checkedLocallyOn": "2026-11-04",
    "reuseRound": "unchanged_recorded_statement",
    "externalVerification": "No new retrieval; original source dates retained."
  },
  {
    "claimId": "claim.n1r3.acefc98ce84f",
    "inheritedClaimId": "claim.iron-deficiency.iron-studies",
    "statementUnchanged": true,
    "inheritedLastCheckedOn": "2026-09-09",
    "inheritedContentVersion": "development-batch.2026-09-09.1",
    "checkedLocallyOn": "2026-11-04",
    "reuseRound": "unchanged_recorded_statement",
    "externalVerification": "No new retrieval; original source dates retained."
  },
  {
    "claimId": "claim.n1r3.axillary-core-scope",
    "inheritedClaimId": "claim.n1r3.axillary-core-scope",
    "statementUnchanged": false,
    "checkedLocallyOn": "2026-11-04",
    "basisClaimIds": [
      "claim.phyllodes.suspicious-node-biopsy-exception",
      "claim.gs028f.neck.core-biopsy-alternative"
    ],
    "basisChecks": [
      {
        "id": "claim.phyllodes.suspicious-node-biopsy-exception",
        "lastCheckedOn": "2026-08-31",
        "contentVersion": "clinical.owner-row-053.2026-08-31.1"
      },
      {
        "id": "claim.gs028f.neck.core-biopsy-alternative",
        "lastCheckedOn": "2026-10-07",
        "contentVersion": "development-batch.2026-10-07.variety.2"
      }
    ],
    "sourceVerificationHold": true,
    "method": "The core-after-FNA atom is neck-specific. Its axillary application and priority over excision require direct verification; the general node-needle exception does not prove every core is adequate.",
    "externalVerification": "No source retrieved; this new application must not be represented as externally verified."
  },
  {
    "claimId": "claim.n1r3.beta-blocker-slow-pulse",
    "inheritedClaimId": "claim.n1r3.beta-blocker-slow-pulse",
    "statementUnchanged": false,
    "checkedLocallyOn": "2026-11-04",
    "basisClaimIds": [
      "claim.n1r2.named-propranolol"
    ],
    "basisChecks": [
      {
        "id": "claim.n1r2.named-propranolol",
        "lastCheckedOn": "2026-11-04",
        "contentVersion": "clinical.question-new-n1.2026-11-04.v2"
      }
    ],
    "sourceVerificationHold": true,
    "method": "New named-drug effect/adjustment application; the earlier named example already carried a direct-support hold. Verify the exact clinical/drug recommendation.",
    "externalVerification": "No source retrieved; this new application must not be represented as externally verified."
  },
  {
    "claimId": "claim.n1r3.burn-release-scope",
    "inheritedClaimId": "claim.n1r3.burn-release-scope",
    "statementUnchanged": false,
    "checkedLocallyOn": "2026-11-04",
    "basisClaimIds": [
      "claim.burn.deeper-depth-contrast",
      "claim.burn.referral-boundary"
    ],
    "basisChecks": [
      {
        "id": "claim.burn.deeper-depth-contrast",
        "lastCheckedOn": "2026-09-28",
        "contentVersion": "development-batch.2026-09-28.pre-endoscopy.1"
      },
      {
        "id": "claim.burn.referral-boundary",
        "lastCheckedOn": "2026-09-28",
        "contentVersion": "development-batch.2026-09-28.pre-endoscopy.1"
      }
    ],
    "sourceVerificationHold": true,
    "method": "Eschar-release distinction is not established by the recorded depth/referral atoms. Verify in permitted burn guidance before using this operative distractor ranking.",
    "externalVerification": "No source retrieved; this new application must not be represented as externally verified."
  },
  {
    "claimId": "claim.n1r3.co2-ventilatory-response",
    "inheritedClaimId": "claim.n1r3.co2-ventilatory-response",
    "statementUnchanged": false,
    "checkedLocallyOn": "2026-11-04",
    "basisClaimIds": [
      "claim.gs028e.laparoscopy.co2-load-respiratory-acidemia",
      "claim.n1r2.gas-record-interpretation"
    ],
    "basisChecks": [
      {
        "id": "claim.gs028e.laparoscopy.co2-load-respiratory-acidemia",
        "lastCheckedOn": "2026-10-07",
        "contentVersion": "development-batch.2026-10-07.variety.1"
      },
      {
        "id": "claim.n1r2.gas-record-interpretation",
        "lastCheckedOn": "2026-11-04",
        "contentVersion": "clinical.question-new-n1.2026-11-04.v2"
      }
    ],
    "sourceVerificationHold": true,
    "method": "The source atoms describe physiology; the directional ventilatory action is a new scoped application requiring anesthesia verification. No rate, volume or target value is prescribed.",
    "externalVerification": "No source retrieved; this new application must not be represented as externally verified."
  },
  {
    "claimId": "claim.n1r3.current-grade-margin-scope",
    "inheritedClaimId": "claim.n1r3.current-grade-margin-scope",
    "statementUnchanged": false,
    "checkedLocallyOn": "2026-11-04",
    "basisClaimIds": [
      "claim.phyllodes.borderline-close-margin-management",
      "claim.phyllodes.malignant-close-margin-management"
    ],
    "basisChecks": [
      {
        "id": "claim.phyllodes.borderline-close-margin-management",
        "lastCheckedOn": "2026-08-31",
        "contentVersion": "clinical.owner-row-053.2026-08-31.1"
      },
      {
        "id": "claim.phyllodes.malignant-close-margin-management",
        "lastCheckedOn": "2026-08-31",
        "contentVersion": "clinical.owner-row-053.2026-08-31.1"
      }
    ],
    "sourceVerificationHold": true,
    "method": "Grade-addendum scope across the continuous lesion is an explicit extension; verify with the breast pathologist and recorded UK guidance.",
    "externalVerification": "No source retrieved; this new application must not be represented as externally verified."
  },
  {
    "claimId": "claim.n1r3.gastric-inseparable-invaded-interface",
    "inheritedClaimId": "claim.n1r3.gastric-inseparable-invaded-interface",
    "statementUnchanged": false,
    "checkedLocallyOn": "2026-11-04",
    "basisClaimIds": [
      "claim.qq20261102.gastric-adjacent-organ-scope",
      "claim.gastric-adenocarcinoma.spleen-preservation-scope-boundary"
    ],
    "basisChecks": [
      {
        "id": "claim.qq20261102.gastric-adjacent-organ-scope",
        "lastCheckedOn": "2026-11-02",
        "contentVersion": "question-authoring.2026-11-02.v4"
      },
      {
        "id": "claim.gastric-adenocarcinoma.spleen-preservation-scope-boundary",
        "lastCheckedOn": "2026-08-06",
        "contentVersion": "clinical.owner-row-042.2026-08-06.1"
      }
    ],
    "sourceVerificationHold": true,
    "method": "Post-treatment inseparable-interface/en-bloc ranking is a new scoped application; the older claim states only the direct-invasion scope. Verify the exact oncologic plane and resectability recommendation.",
    "externalVerification": "No source retrieved; this new application must not be represented as externally verified."
  },
  {
    "claimId": "claim.n1r3.graves-tsh-lag",
    "inheritedClaimId": "claim.n1r3.graves-tsh-lag",
    "statementUnchanged": false,
    "checkedLocallyOn": "2026-11-04",
    "basisClaimIds": [
      "claim.graves-rai-appropriate-candidate.rai-treatment-role",
      "claim.graves-trab-diagnostic-support.biochemical-thyrotoxicosis-context"
    ],
    "basisChecks": [
      {
        "id": "claim.graves-rai-appropriate-candidate.rai-treatment-role",
        "lastCheckedOn": "2026-09-09",
        "contentVersion": "evidence.graves-row-061.2026-09-09.1"
      },
      {
        "id": "claim.graves-trab-diagnostic-support.biochemical-thyrotoxicosis-context",
        "lastCheckedOn": "2026-09-09",
        "contentVersion": "evidence.graves-row-061.2026-09-09.1"
      }
    ],
    "sourceVerificationHold": true,
    "method": "TSH recovery lag and early titration priority were not established by the recorded functional-context atom. Verify in permitted thyroid guidance before acceptance.",
    "externalVerification": "No source retrieved; this new application must not be represented as externally verified."
  },
  {
    "claimId": "claim.n1r3.hla-before-challenge",
    "inheritedClaimId": "claim.n1r3.hla-before-challenge",
    "statementUnchanged": false,
    "checkedLocallyOn": "2026-11-04",
    "basisClaimIds": [
      "claim.celiac.hla-susceptibility-not-active-disease",
      "claim.celiac.gluten-testing-boundary"
    ],
    "basisChecks": [
      {
        "id": "claim.celiac.hla-susceptibility-not-active-disease",
        "lastCheckedOn": "2026-09-09",
        "contentVersion": "development-batch.2026-09-09.1"
      },
      {
        "id": "claim.celiac.gluten-testing-boundary",
        "lastCheckedOn": "2026-09-09",
        "contentVersion": "development-batch.2026-09-09.1"
      }
    ],
    "sourceVerificationHold": true,
    "method": "Negative-typing exclusion value and HLA-first sequencing are extensions beyond the recorded susceptibility-only atom. Verify directly in the recorded ACG/NIDDK guidance.",
    "externalVerification": "No source retrieved; this new application must not be represented as externally verified."
  },
  {
    "claimId": "claim.n1r3.nutrition-fluid-separation",
    "inheritedClaimId": "claim.n1r3.nutrition-fluid-separation",
    "statementUnchanged": false,
    "checkedLocallyOn": "2026-11-04",
    "basisClaimIds": [
      "claim.nutrition.oral-enteral",
      "claim.nutrition.pn-boundary"
    ],
    "basisChecks": [
      {
        "id": "claim.nutrition.oral-enteral",
        "lastCheckedOn": "2026-09-29",
        "contentVersion": "development-batch.2026-09-29.pre-endoscopy.1"
      },
      {
        "id": "claim.nutrition.pn-boundary",
        "lastCheckedOn": "2026-09-29",
        "contentVersion": "development-batch.2026-09-29.pre-endoscopy.1"
      }
    ],
    "sourceVerificationHold": false,
    "method": "Bounded logical separation of recorded route indications; no fluid formula, stoma-output cutoff or PN taper protocol.",
    "externalVerification": "No source retrieved; this new application must not be represented as externally verified."
  },
  {
    "claimId": "claim.n1r3.phyllodes-posterior-plane",
    "inheritedClaimId": "claim.n1r3.phyllodes-posterior-plane",
    "statementUnchanged": false,
    "checkedLocallyOn": "2026-11-04",
    "basisClaimIds": [
      "claim.phyllodes.malignant-margin-target",
      "claim.phyllodes.malignant-close-margin-management"
    ],
    "basisChecks": [
      {
        "id": "claim.phyllodes.malignant-margin-target",
        "lastCheckedOn": "2026-08-31",
        "contentVersion": "clinical.owner-row-053.2026-08-31.1"
      },
      {
        "id": "claim.phyllodes.malignant-close-margin-management",
        "lastCheckedOn": "2026-08-31",
        "contentVersion": "clinical.owner-row-053.2026-08-31.1"
      }
    ],
    "sourceVerificationHold": true,
    "method": "The recorded atoms establish margin aims/actions, not the exact fascia-versus-muscle operation. Directly verify both posterior-plane option rankings; no claim of verified fascia/muscle equivalence.",
    "externalVerification": "No source retrieved; this new application must not be represented as externally verified."
  },
  {
    "claimId": "claim.n1r3.proximal-venous-waveform",
    "inheritedClaimId": "claim.n1r3.proximal-venous-waveform",
    "statementUnchanged": false,
    "checkedLocallyOn": "2026-11-04",
    "basisClaimIds": [
      "claim.postoperative-dvt.prompt-venous-duplex",
      "claim.lymphedema.differential-safety"
    ],
    "basisChecks": [
      {
        "id": "claim.postoperative-dvt.prompt-venous-duplex",
        "lastCheckedOn": "2026-09-12",
        "contentVersion": "development-batch.2026-09-12.1"
      },
      {
        "id": "claim.lymphedema.differential-safety",
        "lastCheckedOn": "2026-09-28",
        "contentVersion": "development-batch.2026-09-28.pre-endoscopy.1"
      }
    ],
    "sourceVerificationHold": true,
    "method": "Indirect waveform interpretation and the next pelvic venous protocol are new details beyond the recorded leg-duplex atom. Verify against permitted vascular guidance; no performance value or diagnostic certainty is asserted.",
    "externalVerification": "No source retrieved; this new application must not be represented as externally verified."
  },
  {
    "claimId": "claim.n1r3.residual-dvt-not-failure",
    "inheritedClaimId": "claim.n1r3.residual-dvt-not-failure",
    "statementUnchanged": false,
    "checkedLocallyOn": "2026-11-04",
    "basisClaimIds": [
      "claim.postoperative-dvt.three-month-anticoagulation"
    ],
    "basisChecks": [
      {
        "id": "claim.postoperative-dvt.three-month-anticoagulation",
        "lastCheckedOn": "2026-09-12",
        "contentVersion": "development-batch.2026-09-12.1"
      }
    ],
    "sourceVerificationHold": true,
    "method": "Persistence-versus-progression distinction and follow-up drug ranking extend the recorded initial-treatment/filter atom. Verify directly in permitted VTE guidance; no universal scan interval is claimed.",
    "externalVerification": "No source retrieved; this new application must not be represented as externally verified."
  },
  {
    "claimId": "claim.n1r3.vka-sustained-reversal",
    "inheritedClaimId": "claim.n1r3.vka-sustained-reversal",
    "statementUnchanged": false,
    "checkedLocallyOn": "2026-11-04",
    "basisClaimIds": [
      "claim.trauma-vka.iv-vitamin-k",
      "claim.trauma-vka.scope",
      "claim.trauma-vka.pcc-selection"
    ],
    "basisChecks": [
      {
        "id": "claim.trauma-vka.iv-vitamin-k",
        "lastCheckedOn": "2026-08-31",
        "contentVersion": "clinical.owner-row-054.2026-08-31.1"
      },
      {
        "id": "claim.trauma-vka.scope",
        "lastCheckedOn": "2026-08-31",
        "contentVersion": "clinical.owner-row-054.2026-08-31.1"
      },
      {
        "id": "claim.trauma-vka.pcc-selection",
        "lastCheckedOn": "2026-08-31",
        "contentVersion": "clinical.owner-row-054.2026-08-31.1"
      }
    ],
    "sourceVerificationHold": true,
    "method": "The paired-agent atom does not fully establish rebound management after hemostasis. Verify the exact sustained-reversal interpretation and repeat-PCC boundary.",
    "externalVerification": "No source retrieved; this new application must not be represented as externally verified."
  },
  {
    "claimId": "claim.n1r3.a671422d11b7",
    "inheritedClaimId": "claim.postoperative-seroma.ultrasound-characterization",
    "statementUnchanged": true,
    "inheritedLastCheckedOn": "2026-09-10",
    "inheritedContentVersion": "development-batch.2026-09-10.1",
    "checkedLocallyOn": "2026-11-04",
    "reuseRound": "unchanged_recorded_statement",
    "externalVerification": "No new retrieval; original source dates retained."
  },
  {
    "claimId": "claim.n1r3.a2269c919525",
    "inheritedClaimId": "claim.qq20261102c.breast-core-target-discordance",
    "statementUnchanged": true,
    "inheritedLastCheckedOn": "2026-11-02",
    "inheritedContentVersion": "evidence.question-quality.2026-11-02.v7",
    "checkedLocallyOn": "2026-11-04",
    "reuseRound": "unchanged_recorded_statement",
    "externalVerification": "No new retrieval; original source dates retained."
  },
  {
    "claimId": "claim.n1r3.d3c31e54d4ba",
    "inheritedClaimId": "claim.qq20261102c.pancreatic-duct-mapping",
    "statementUnchanged": true,
    "inheritedLastCheckedOn": "2026-11-02",
    "inheritedContentVersion": "evidence.question-quality.2026-11-02.v7",
    "checkedLocallyOn": "2026-11-04",
    "reuseRound": "unchanged_recorded_statement",
    "externalVerification": "No new retrieval; original source dates retained."
  },
  {
    "claimId": "claim.n1r3.64dbe972aff7",
    "inheritedClaimId": "claim.qq20261102c.pancreatic-partial-leak-bridge",
    "statementUnchanged": true,
    "inheritedLastCheckedOn": "2026-11-02",
    "inheritedContentVersion": "evidence.question-quality.2026-11-02.v7",
    "checkedLocallyOn": "2026-11-04",
    "reuseRound": "unchanged_recorded_statement",
    "externalVerification": "No new retrieval; original source dates retained."
  },
  {
    "claimId": "claim.n1r3.e32ff5667375",
    "inheritedClaimId": "claim.trauma-vka.pcc-vs-plasma",
    "statementUnchanged": true,
    "inheritedLastCheckedOn": "2026-08-31",
    "inheritedContentVersion": "clinical.owner-row-054.2026-08-31.1",
    "checkedLocallyOn": "2026-11-04",
    "reuseRound": "unchanged_recorded_statement",
    "externalVerification": "No new retrieval; original source dates retained."
  }
] as const;
export const QUESTION_NEW_N1_ROUND3_SOURCE_HOLDS = [
  {
    "claimId": "claim.n1r3.axillary-core-scope",
    "limitation": "The core-after-FNA atom is neck-specific. Its axillary application and priority over excision require direct verification; the general node-needle exception does not prove every core is adequate.",
    "slugs": [
      "phyllodes-suspicious-node"
    ]
  },
  {
    "claimId": "claim.n1r3.beta-blocker-slow-pulse",
    "limitation": "New named-drug effect/adjustment application; the earlier named example already carried a direct-support hold. Verify the exact clinical/drug recommendation.",
    "slugs": [
      "graves-beta-blocker-boundary"
    ]
  },
  {
    "claimId": "claim.n1r3.burn-release-scope",
    "limitation": "Eschar-release distinction is not established by the recorded depth/referral atoms. Verify in permitted burn guidance before using this operative distractor ranking.",
    "slugs": [
      "burn-depth-reassessment"
    ]
  },
  {
    "claimId": "claim.n1r3.co2-ventilatory-response",
    "limitation": "The source atoms describe physiology; the directional ventilatory action is a new scoped application requiring anesthesia verification. No rate, volume or target value is prescribed.",
    "slugs": [
      "respiratory-acidosis"
    ]
  },
  {
    "claimId": "claim.n1r3.current-grade-margin-scope",
    "limitation": "Grade-addendum scope across the continuous lesion is an explicit extension; verify with the breast pathologist and recorded UK guidance.",
    "slugs": [
      "phyllodes-borderline-close"
    ]
  },
  {
    "claimId": "claim.n1r3.gastric-inseparable-invaded-interface",
    "limitation": "Post-treatment inseparable-interface/en-bloc ranking is a new scoped application; the older claim states only the direct-invasion scope. Verify the exact oncologic plane and resectability recommendation.",
    "slugs": [
      "gastric-adjacent-invasion"
    ]
  },
  {
    "claimId": "claim.n1r3.graves-tsh-lag",
    "limitation": "TSH recovery lag and early titration priority were not established by the recorded functional-context atom. Verify in permitted thyroid guidance before acceptance.",
    "slugs": [
      "graves-beta-blocker-boundary"
    ]
  },
  {
    "claimId": "claim.n1r3.hla-before-challenge",
    "limitation": "Negative-typing exclusion value and HLA-first sequencing are extensions beyond the recorded susceptibility-only atom. Verify directly in the recorded ACG/NIDDK guidance.",
    "slugs": [
      "celiac-gluten-withdrawal"
    ]
  },
  {
    "claimId": "claim.n1r3.phyllodes-posterior-plane",
    "limitation": "The recorded atoms establish margin aims/actions, not the exact fascia-versus-muscle operation. Directly verify both posterior-plane option rankings; no claim of verified fascia/muscle equivalence.",
    "slugs": [
      "phyllodes-malignant-close",
      "phyllodes-malignant-target"
    ]
  },
  {
    "claimId": "claim.n1r3.proximal-venous-waveform",
    "limitation": "Indirect waveform interpretation and the next pelvic venous protocol are new details beyond the recorded leg-duplex atom. Verify against permitted vascular guidance; no performance value or diagnostic certainty is asserted.",
    "slugs": [
      "lymphedema-new-swelling"
    ]
  },
  {
    "claimId": "claim.n1r3.residual-dvt-not-failure",
    "limitation": "Persistence-versus-progression distinction and follow-up drug ranking extend the recorded initial-treatment/filter atom. Verify directly in permitted VTE guidance; no universal scan interval is claimed.",
    "slugs": [
      "dvt-filter"
    ]
  },
  {
    "claimId": "claim.n1r3.vka-sustained-reversal",
    "limitation": "The paired-agent atom does not fully establish rebound management after hemostasis. Verify the exact sustained-reversal interpretation and repeat-PCC boundary.",
    "slugs": [
      "vka-vitamin-k"
    ]
  }
] as const;
