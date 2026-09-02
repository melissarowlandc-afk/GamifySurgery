import type { ApprovedInstantiationProfile, SyntheticClinicalCase } from "./schema";

type PendingComplaintRevision = Readonly<{
  caseId: string;
  patientPresentationVariantId: string;
  chiefComplaint: string;
}>;

export const PATIENT_PRESENTATION_REVISION_CONTENT_VERSION =
  "presentation-revision.chief-complaint-and-presentation.2026-09-01.v2";

const pending = (
  caseId: string,
  patientPresentationVariantId: string,
  chiefComplaint: string,
): PendingComplaintRevision => ({ caseId, patientPresentationVariantId, chiefComplaint });

/**
 * Exact, authored preview-only revisions. These are intentionally not derived
 * from source strings at runtime: every entry is reviewable against one frozen
 * case presentation and receives independent pending-review metadata below.
 */
export const PENDING_PATIENT_PRESENTATION_REVISIONS = [
  pending("case.ventral-hernia.pulmonary-optimization.a", "presentation.ventral-hernia.pulmonary-optimization.a", "I want to discuss fixing my reducible incisional hernia."),
  pending("case.ventral-hernia.pulmonary-optimization.b", "presentation.ventral-hernia.pulmonary-optimization.b", "I want to know if my hernia operation can be scheduled now."),
  pending("case.breast-cyst.under-30-asymptomatic-simple", "presentation.breast-cyst.under-30-asymptomatic-simple", "I found a new breast lump."),
  pending("case.breast-cyst.under-30-painful-simple", "presentation.breast-cyst.under-30-painful-simple", "I found a new breast lump that is uncomfortable."),
  pending("case.ebv-associated-malignancy.burkitt", "presentation.ebv-associated-malignancy.burkitt", "I want to understand the diagnoses on my oncology referral."),
  pending("case.ebv-associated-malignancy.gastric", "presentation.ebv-associated-malignancy.gastric", "I want to understand the Epstein-Barr virus note in my pathology report."),
  pending("case.ebv-associated-malignancy.nasopharyngeal", "presentation.ebv-associated-malignancy.nasopharyngeal", "I want to understand the Epstein-Barr virus note in my referral."),
  pending("case.hcc.milan.solitary-within", "presentation.hcc.milan.solitary-within", "I want to know what my HCC staging means for transplant evaluation."),
  pending("case.hcc.milan.multifocal-within", "presentation.hcc.milan.multifocal-within", "I want to know what my HCC staging means for transplant evaluation."),
  pending("case.hcc.milan.solitary-above-size", "presentation.hcc.milan.solitary-above-size", "I want to know what my HCC staging means for transplant evaluation."),
  pending("case.hcc.milan.too-many-lesions", "presentation.hcc.milan.too-many-lesions", "I want to know what my HCC staging means for transplant evaluation."),
  pending("case.hcc.milan.macrovascular-invasion", "presentation.hcc.milan.macrovascular-invasion", "I want to know what my HCC staging means for transplant evaluation."),
  pending("case.hcc.milan.extrahepatic-spread", "presentation.hcc.milan.extrahepatic-spread", "I want to know what my HCC staging means for transplant evaluation."),
  pending("case.hcc.milan.choose-boundary-profile", "presentation.hcc.milan.solitary-within", "I want to know what my HCC staging means for transplant evaluation."),
  pending("case.hcc.milan.choose-invasion-spread-profile", "presentation.hcc.milan.multifocal-within", "I want to know what my HCC staging means for transplant evaluation."),
  pending("case.hcc.milan.choose-multifocal-boundary", "presentation.hcc.milan.multifocal-within", "I want to know what my HCC staging means for transplant evaluation."),
  pending("case.hcc.milan.choose-combined-profile", "presentation.hcc.milan.solitary-within", "I want to know what my HCC staging means for transplant evaluation."),
  pending("case.mondor-disease.full-pathway", "presentation.mondor-disease.full-pathway", "I have a tender cord and redness along my breast."),
  pending("case.mondor-disease.evaluation-and-management", "presentation.mondor-disease.evaluation-and-management", "I have new burning breast pain and a palpable cord."),
  pending("case.mondor-disease.select-matching-patient", "presentation.mondor-disease.select-matching-patient", "I have focal breast and chest-wall discomfort."),
  pending("case.mondor-disease.underlying-process", "presentation.mondor-disease.underlying-process", "I have a new tender cord beneath my chest-wall skin."),
  pending("case.mondor-disease.uncertain-targeted-ultrasound", "presentation.mondor-disease.uncertain-targeted-ultrasound", "I have a tender line beneath the skin of my breast."),
  pending("case.mondor-disease.ultrasound-finding", "presentation.mondor-disease.ultrasound-finding", "I want to review the ultrasound for my tender breast cord."),
  pending("case.mondor-disease.safety-boundary", "presentation.mondor-disease.safety-boundary", "I want to know what changes after my presumed Mondor disease need reevaluation."),
  pending("case.mondor-disease.select-supportive-patient", "presentation.mondor-disease.select-supportive-patient", "I have a tender breast cord and want to know if I can avoid a procedure."),
  pending("case.aaa.female-perioperative-mortality.direct", "presentation.aaa.female-perioperative-mortality.direct", "I want to know whether AAA repair outcomes differ for women and men."),
  pending("case.aaa.female-perioperative-mortality.repair-approaches", "presentation.aaa.female-perioperative-mortality.repair-approaches", "I want to know how my AAA repair approach relates to outcomes."),
  pending("case.aaa.female-perioperative-mortality.interpretation", "presentation.aaa.female-perioperative-mortality.interpretation", "I want to understand how AAA outcome differences apply to me."),
  pending("case.aaa.female-perioperative-mortality.mixed-boundaries", "presentation.aaa.female-perioperative-mortality.mixed-boundaries", "I want to discuss future management of my AAA."),
  pending("case.desmoid.surveillance-to-progressing-abdominal-wall", "presentation.desmoid.surveillance-to-progressing-abdominal-wall", "I want to know if my new abdominal-wall desmoid can be watched."),
  pending("case.desmoid.select-surveillance-patient", "presentation.desmoid.select-surveillance-patient", "I want to know when watching my new desmoid is reasonable."),
  pending("case.desmoid.initial-management-principle", "presentation.desmoid.initial-management-principle", "I want to know if my newly confirmed desmoid needs treatment now."),
  pending("case.desmoid.stable-follow-up", "presentation.desmoid.stable-follow-up", "I want to know if my stable desmoid changes the surveillance plan."),
  pending("case.desmoid.select-abdominal-wall-surgical-candidate", "presentation.desmoid.select-abdominal-wall-surgical-candidate", "I want to know what changes could make surgery reasonable for my desmoid."),
  pending("case.desmoid.function-preserving-margin", "presentation.desmoid.function-preserving-margin", "I want to know if a wider margin is worth functional loss during my surgery."),
  pending("case.desmoid.location-specific-surgery", "presentation.desmoid.location-specific-surgery", "I want to discuss treatment options for my progressing abdominal-wall desmoid."),
  pending("case.pancreatic-tail-adenocarcinoma.clinic-counseling", "presentation.pancreatic-tail-adenocarcinoma.clinic-counseling", "I want to know what operation is discussed for my pancreatic-tail cancer."),
  pending("case.pancreatic-tail-adenocarcinoma.spleen-counseling", "presentation.pancreatic-tail-adenocarcinoma.spleen-counseling", "I want to know whether my planned pancreatic surgery keeps my spleen."),
  pending("case.pancreatic-tail-adenocarcinoma.operative-candidate", "presentation.pancreatic-tail-adenocarcinoma.operative-candidate", "I want to discuss possible surgery for my pancreatic cancer."),
  pending("case.pancreatic-tail-adenocarcinoma.referral-plan", "presentation.pancreatic-tail-adenocarcinoma.referral-plan", "I have a resectable tumor in the tail of my pancreas and am ready to discuss surgery."),
  pending("case.felty-syndrome.recognition-to-refractory-splenectomy", "presentation.felty-syndrome.classic-recognition", "I have recurrent infections with rheumatoid arthritis."),
  pending("case.felty-syndrome.no-splenomegaly-boundary", "presentation.felty-syndrome.no-splenomegaly-boundary", "I have persistent neutropenia with rheumatoid arthritis."),
  pending("case.felty-syndrome.reverse-pattern", "presentation.felty-syndrome.reverse-pattern", "I have recurrent infections with rheumatoid arthritis."),
  pending("case.felty-syndrome.treatment-principle", "presentation.felty-syndrome.treatment-principle", "I want to discuss treatment for my Felty syndrome."),
  pending("case.fhh.evaluation-to-confirmed-management", "presentation.fhh.initial-biochemical-evaluation", "I have persistent mild hypercalcemia."),
  pending("case.fhh.suggestive-results-confirmation", "presentation.fhh.suggestive-results-confirmation", "I want to discuss my urine calcium results."),
  pending("case.fhh.confirmed-asymptomatic-management", "presentation.fhh.confirmed-asymptomatic-management", "I want to discuss management after my genetic confirmation."),
  pending("case.fhh.parathyroid-surgery-counseling", "presentation.fhh.parathyroid-surgery-counseling", "I have a question about parathyroid surgery."),
  pending("case.lymphangitis.toe-inguinal", "presentation.lymphangitis.toe-inguinal", "I have a tender red streak after a toe blister."),
  pending("case.lymphangitis.palm-axillary", "presentation.lymphangitis.palm-axillary", "I have a tender red line after a palm cut."),
  pending("case.lymphangitis.heel-inguinal", "presentation.lymphangitis.heel-inguinal", "I have redness after a cracked heel."),
  pending("case.lymphangitis.reverse-axillary", "presentation.lymphangitis.reverse-axillary", "I have a hand injury and tenderness near my axilla."),
  pending("case.lymphangitis.finger-axillary", "presentation.lymphangitis.finger-axillary", "I have a tender red streak after a finger puncture."),
  pending("case.gallbladder-polyp.16mm", "presentation.gallbladder-polyp.16mm", "I want to discuss my gallbladder polyp seen on ultrasound."),
  pending("case.gallbladder-polyp.12mm-wall-thickening", "presentation.gallbladder-polyp.12mm-wall-thickening", "I want to discuss my gallbladder polyp seen on ultrasound."),
  pending("case.gallbladder-polyp.8mm-thick-stalk", "presentation.gallbladder-polyp.8mm-thick-stalk", "I want to discuss my gallbladder polyp seen on ultrasound."),
  pending("case.gallbladder-polyp.4mm-thin-stalk", "presentation.gallbladder-polyp.4mm-thin-stalk", "I want to discuss my gallbladder polyp seen on ultrasound."),
  pending("case.gallbladder-polyp.select-surgical-profile", "presentation.gallbladder-polyp.select-surgical-profile", "I am here to discuss an incidental gallbladder finding."),
  pending("case.gallbladder-polyp.select-surveillance-profile", "presentation.gallbladder-polyp.select-surveillance-profile", "I am here to discuss an incidental gallbladder finding."),
  pending("case.distal-cholangiocarcinoma.active-treatment", "presentation.distal-cholangiocarcinoma.active-treatment", "I want to discuss my confirmed lower bile-duct cancer."),
  pending("case.distal-cholangiocarcinoma.active-location", "presentation.distal-cholangiocarcinoma.active-location", "I have bile-duct cancer and want to discuss the operation planned at the hospital."),
  pending("case.obstructive-jaundice.vitamin-k.bleeding", "presentation.obstructive-jaundice.vitamin-k.bleeding", "I have progressive jaundice and new bruising."),
  pending("case.obstructive-jaundice.vitamin-k.mechanism", "presentation.obstructive-jaundice.vitamin-k.mechanism", "I want to discuss my jaundice and abnormal coagulation testing."),
  pending("case.obstructive-jaundice.vitamin-k.lab", "presentation.obstructive-jaundice.vitamin-k.lab", "I have obstructive jaundice before an invasive procedure."),
  pending("case.obstructive-jaundice.vitamin-k.reverse", "presentation.obstructive-jaundice.vitamin-k.reverse", "I have jaundice and new gum bleeding."),
  pending("case.hcc.resection.direct-selection", "presentation.hcc.resection.direct-selection", "I want to discuss treatment for my HCC."),
  pending("case.hcc.resection.milan-trap", "presentation.hcc.resection.milan-trap", "I want to discuss treatment for my HCC."),
  pending("case.hcc.resection.candidate-profile", "presentation.hcc.resection.candidate-profile", "I have HCC and want to know whether surgery is possible."),
  pending("case.hcc.resection.future-liver-remnant", "presentation.hcc.resection.future-liver-remnant", "I want to discuss treatment for my HCC."),
  pending("case.hcc.resection.combined-milan-to-resection", "presentation.hcc.resection.combined-milan-to-resection", "I want to discuss my staged HCC treatment options."),
  pending("case.accessory-spleen.preoperative-counseling", "presentation.accessory-spleen.preoperative-counseling", "I have hereditary spherocytosis and am getting ready to discuss splenectomy."),
  pending("case.accessory-spleen.imaging-review", "presentation.accessory-spleen.imaging-review", "I am back to talk about my imaging before splenectomy."),
  pending("case.accessory-spleen.hospital-planning", "presentation.accessory-spleen.hospital-planning", "I am getting ready to talk with the hospital team before splenectomy."),
  pending("case.accessory-spleen.reverse-location", "presentation.accessory-spleen.reverse-location", "I am back to talk about a small nodule found on my imaging."),
  pending("case.hs.postsplenectomy.reassess", "presentation.hs.postsplenectomy.reassess", "I have persistent anemia after my total splenectomy."),
  pending("case.hs.postsplenectomy.howell-jolly", "presentation.hs.postsplenectomy.howell-jolly", "I have ongoing hemolysis after my total splenectomy."),
  pending("case.hs.postsplenectomy.reverse", "presentation.hs.postsplenectomy.reverse", "I want to discuss anemia after my total splenectomy."),
  pending("case.hs.accessory-spleen.hospital-referral", "presentation.hs.accessory-spleen.hospital-referral", "I have confirmed functioning accessory splenic tissue."),
  pending("case.hs.accessory-spleen.incidental", "presentation.hs.accessory-spleen.incidental", "I have an incidental splenic tissue finding."),
  pending("case.hs.accessory-spleen.threshold", "presentation.hs.accessory-spleen.threshold", "I want to discuss my confirmed accessory splenic tissue."),
  pending("case.hs.postsplenectomy.combined-evaluation-to-referral", "presentation.hs.postsplenectomy.combined", "I have persistent symptomatic hemolysis after my total splenectomy."),
  pending("case.ipaa.pouchitis.1a", "presentation.ipaa.pouchitis.1a", "I am considering restorative proctocolectomy with IPAA."),
  pending("case.ipaa.pouchitis.1b", "presentation.ipaa.pouchitis.1b", "I want long-term counseling after my IPAA."),
  pending("case.ipaa.pouchitis.1c", "presentation.ipaa.pouchitis.1c", "I want counseling after my restorative proctocolectomy with IPAA."),
  pending("case.ipaa.pouchitis.1d", "presentation.ipaa.pouchitis.1d", "I have questions after my IPAA."),
  pending("case.choledochal-cyst.type-iva.2a", "presentation.choledochal-cyst.type-iva.2a", "I have intermittent abdominal pain and jaundice."),
  pending("case.choledochal-cyst.type-iva.2b", "presentation.choledochal-cyst.type-iva.2b", "I want to discuss my congenital bile duct cyst found on imaging."),
  pending("case.choledochal-cyst.type-iva.2c", "presentation.choledochal-cyst.type-iva.2c", "I want to discuss my Type IVA congenital bile duct cyst."),
  pending("case.choledochal-cyst.type-iva.2d", "presentation.choledochal-cyst.type-iva.2d", "I want to discuss my congenital bile duct cyst after MRCP."),
  pending("case.anal-hsil.hpv.3a", "presentation.anal-hsil.hpv.3a", "I want to discuss my anal HSIL biopsy result."),
  pending("case.anal-hsil.hpv.3b", "presentation.anal-hsil.hpv.3b", "I want to discuss my anal HSIL."),
  pending("case.anal-hsil.hpv.3c", "presentation.anal-hsil.hpv.3c", "I want to discuss my anal HSIL pathology result."),
  pending("case.anal-hsil.hpv.3d", "presentation.anal-hsil.hpv.3d", "I have a new anal squamous intraepithelial lesion."),
  pending("case.men2a.1a", "presentation.men2a.1a", "I want to discuss my medullary thyroid cancer, pheochromocytoma, and hypercalcemia."),
  pending("case.men2a.1b", "presentation.men2a.1b", "I want counseling after my medullary thyroid cancer diagnosis."),
  pending("case.men2a.1c", "presentation.men2a.1c", "I have hypercalcemia with an elevated PTH level."),
  pending("case.men2a.1d", "presentation.men2a.1d", "I am being evaluated for MEN2A with pheochromocytoma and primary hyperparathyroidism."),
  pending("case.men2a.2a", "presentation.men2a.2a", "I am preparing for thyroid surgery and have a functioning pheochromocytoma."),
  pending("case.men2a.2b", "presentation.men2a.2b", "I am preparing for thyroid intervention after my neck evaluation."),
  pending("case.men2a.2c", "presentation.men2a.2c", "I have MEN2A with medullary thyroid cancer and a functioning pheochromocytoma."),
  pending("case.men2a.2d", "presentation.men2a.2d", "I am planning my endocrine operations after a pheochromocytoma was found."),
  pending("case.men2a.3a", "presentation.men2a.3a", "I have a functioning pheochromocytoma and persistent tachycardia before surgery."),
  pending("case.men2a.3b", "presentation.men2a.3b", "I have a functioning pheochromocytoma and a medication plan before surgery."),
  pending("case.men2a.3c", "presentation.men2a.3c", "I have a functioning pheochromocytoma with persistent tachycardia."),
  pending("case.men2a.3d", "presentation.men2a.3d", "I am preparing for surgery after a medication-order problem."),
] as const satisfies readonly PendingComplaintRevision[];

type PendingBasePresentationRevision = Readonly<{ caseId: string; patientPresentationVariantId: string; sourcePresentation: string; revisedPresentation: string; }>;
type PendingProfilePresentationRevision = Readonly<{ caseId: string; approvedInstantiationProfileId: string; sourcePresentation: string; revisedPresentation: string; }>;
export type PatientPresentationRevisionMappings = Readonly<{ complaintRevisions: readonly PendingComplaintRevision[]; basePresentationRevisions: readonly PendingBasePresentationRevision[]; profilePresentationRevisions: readonly PendingProfilePresentationRevision[]; }>;
const presentationRevision = (caseId: string, patientPresentationVariantId: string, sourcePresentation: string, revisedPresentation: string): PendingBasePresentationRevision => ({ caseId, patientPresentationVariantId, sourcePresentation, revisedPresentation });
const profilePresentationRevision = (caseId: string, approvedInstantiationProfileId: string, sourcePresentation: string, revisedPresentation: string): PendingProfilePresentationRevision => ({ caseId, approvedInstantiationProfileId, sourcePresentation, revisedPresentation });

/** Complete literal source-to-final records; no runtime text stripping. */
export const PENDING_BASE_PRESENTATION_REVISIONS = [
  presentationRevision("case.ventral-hernia.pulmonary-optimization.a", "presentation.ventral-hernia.pulmonary-optimization.a", "An adult with a reducible midline incisional hernia comes to discuss elective repair. There is no obstruction, increasing pain, irreducibility, skin change, or systemic illness, but their COPD is poorly controlled. They ask what needs to happen before an operation can be scheduled.", "An adult with a reducible midline incisional hernia comes to discuss elective repair. There is no obstruction, increasing pain, irreducibility, skin change, or systemic illness, but their COPD is poorly controlled."),
  presentationRevision("case.ventral-hernia.pulmonary-optimization.b", "presentation.ventral-hernia.pulmonary-optimization.b", "An adult returns hoping to finalize elective repair of a stable, reducible incisional hernia. The hernia has no urgent features, but the patient continues to have poorly controlled COPD symptoms. They ask whether the operation should be scheduled now.", "An adult returns hoping to finalize elective repair of a stable, reducible incisional hernia. The hernia has no urgent features, but the patient continues to have poorly controlled COPD symptoms."),
  presentationRevision("case.breast-cyst.under-30-asymptomatic-simple", "presentation.breast-cyst.under-30-asymptomatic-simple", "A nonpregnant, nonlactating 26-year-old woman at average breast-cancer risk recently noticed a discrete breast lump and is worried about what it could be. Examination shows no erythema, skin or nipple change, or adenopathy. She asks which test should come first.", "A nonpregnant, nonlactating 26-year-old woman at average breast-cancer risk recently noticed a discrete breast lump and is worried about what it could be. Examination shows no erythema, skin or nipple change, or adenopathy."),
  presentationRevision("case.breast-cyst.under-30-painful-simple", "presentation.breast-cyst.under-30-painful-simple", "A nonpregnant, nonlactating 28-year-old woman at average breast-cancer risk noticed a new breast lump that remains focally uncomfortable. There is no erythema, drainage, skin or nipple change, or adenopathy. She wants to know what is causing it and whether it can be relieved.", "A nonpregnant, nonlactating 28-year-old woman at average breast-cancer risk noticed a new breast lump that remains focally uncomfortable. There is no erythema, drainage, skin or nipple change, or adenopathy."),
  presentationRevision("case.ebv-associated-malignancy.burkitt", "presentation.ebv-associated-malignancy.burkitt", "An adult brings an oncology referral containing several candidate diagnoses and a note asking about Epstein-Barr virus. The patient wants to understand which diagnosis on the list has a recognized EBV association; the discussion does not predict their individual future cancer risk.", "An adult brings an oncology referral containing several candidate diagnoses and a note asking about Epstein-Barr virus. The discussion does not predict their individual future cancer risk."),
  presentationRevision("case.ebv-associated-malignancy.gastric", "presentation.ebv-associated-malignancy.gastric", "An adult returns while an epithelial-cancer referral is being clarified. The pathology note asks which possible primary diagnosis can occur as an EBV-associated molecular subtype, and the patient asks what that note means. The discussion does not imply that every tumor at that site shares the association.", "An adult returns while an epithelial-cancer referral is being clarified. The discussion does not imply that every tumor at that site shares the association."),
  presentationRevision("case.mondor-disease.full-pathway", "presentation.mondor-disease.full-pathway", "A 44-year-old woman reports sudden burning discomfort and redness along the anterolateral breast. Examination shows a tender, taut subcutaneous cord without fever or fluctuance. She asks what the cord could be and whether it needs testing.", "A 44-year-old woman reports sudden burning discomfort and redness along the anterolateral breast. Examination shows a tender, taut subcutaneous cord without fever or fluctuance."),
  presentationRevision("case.mondor-disease.evaluation-and-management", "presentation.mondor-disease.evaluation-and-management", "A 44-year-old woman presents with new focal, noncyclic burning pain and a palpable superficial breast cord. There was no clear procedure or trauma. She asks whether imaging is needed to evaluate the cord and exclude an underlying breast problem.", "A 44-year-old woman presents with new focal, noncyclic burning pain and a palpable superficial breast cord. There was no clear procedure or trauma."),
  presentationRevision("case.mondor-disease.select-matching-patient", "presentation.mondor-disease.select-matching-patient", "A stable 41-year-old woman comes to clinic for focal breast and chest-wall discomfort that she finds difficult to describe. She asks which examination pattern would most strongly point to Mondor disease.", "A stable 41-year-old woman comes to clinic for focal breast and chest-wall discomfort that she finds difficult to describe."),
  presentationRevision("case.mondor-disease.underlying-process", "presentation.mondor-disease.underlying-process", "A 39-year-old woman develops a tender cord immediately beneath the anterior chest-wall skin without a deep extremity process. She asks what structure could produce such a sharply outlined finding.", "A 39-year-old woman develops a tender cord immediately beneath the anterior chest-wall skin without a deep extremity process."),
  presentationRevision("case.mondor-disease.uncertain-targeted-ultrasound", "presentation.mondor-disease.uncertain-targeted-ultrasound", "A 35-year-old woman presents with a tender linear subcutaneous breast finding. Examination is not definitive, and there is no discrete mass or systemic illness. She asks which test could clarify what the line represents.", "A 35-year-old woman presents with a tender linear subcutaneous breast finding. Examination is not definitive, and there is no discrete mass or systemic illness."),
  presentationRevision("case.mondor-disease.ultrasound-finding", "presentation.mondor-disease.ultrasound-finding", "A stable 42-year-old woman returns to review targeted ultrasound obtained for a tender superficial breast cord. She asks which imaging feature would confirm the suspected venous process.", "A stable 42-year-old woman returns to review targeted ultrasound obtained for a tender superficial breast cord."),
  presentationRevision("case.mondor-disease.safety-boundary", "presentation.mondor-disease.safety-boundary", "A 46-year-old woman returns after supportive management for presumed uncomplicated Mondor disease. She asks which new change should prompt her to stop routine supportive care and seek renewed evaluation.", "A 46-year-old woman returns after supportive management for presumed uncomplicated Mondor disease."),
  presentationRevision("case.mondor-disease.select-supportive-patient", "presentation.mondor-disease.select-supportive-patient", "A stable 40-year-old woman with a tender superficial breast cord returns to decide whether routine supportive care is safe. Her final examination and imaging summary is being reconciled, and she asks whether she can avoid an invasive procedure.", "A stable 40-year-old woman with a tender superficial breast cord returns to decide whether routine supportive care is safe. Her final examination and imaging summary is being reconciled."),
  presentationRevision("case.aaa.female-perioperative-mortality.direct", "presentation.aaa.female-perioperative-mortality.direct", "A 72-year-old woman with an intact infrarenal AAA has met criteria for elective repair. She asks whether operative outcomes differ between women and men.", "A 72-year-old woman with an intact infrarenal AAA has met criteria for elective repair."),
  presentationRevision("case.aaa.female-perioperative-mortality.repair-approaches", "presentation.aaa.female-perioperative-mortality.repair-approaches", "A woman with an intact infrarenal AAA is considering elective repair and asks whether choosing EVAR instead of open repair eliminates the observed outcome difference between women and men.", "A woman with an intact infrarenal AAA is considering elective repair."),
  presentationRevision("case.aaa.female-perioperative-mortality.interpretation", "presentation.aaa.female-perioperative-mortality.interpretation", "A woman preparing for vascular-surgery referral asks whether a group-level difference in AAA outcomes means that her own result is predetermined. She wants a clear explanation of how the association should be used in counseling.", "A woman is preparing for vascular-surgery referral."),
  presentationRevision("case.aaa.female-perioperative-mortality.mixed-boundaries", "presentation.aaa.female-perioperative-mortality.mixed-boundaries", "A 73-year-old woman with an asymptomatic infrarenal AAA is reviewing future management options. She asks how sex-associated operative outcomes should influence counseling without replacing individualized assessment.", "A 73-year-old woman with an asymptomatic infrarenal AAA is reviewing future management options."),
  presentationRevision("case.desmoid.surveillance-to-progressing-abdominal-wall", "presentation.desmoid.surveillance-to-progressing-abdominal-wall", "A patient with a newly diagnosed, biopsy-confirmed abdominal-wall desmoid has minimal discomfort, no functional limitation, and no threat to a critical structure. The patient asks whether the tumor can be watched instead of treated immediately.", "A patient with a newly diagnosed, biopsy-confirmed abdominal-wall desmoid has minimal discomfort, no functional limitation, and no threat to a critical structure."),
  presentationRevision("case.desmoid.select-surveillance-patient", "presentation.desmoid.select-surveillance-patient", "A patient with a newly diagnosed desmoid asks what findings would make active surveillance a reasonable first plan. The multidisciplinary team is considering several possible completed summaries of this same tumor.", "A patient has a newly diagnosed desmoid. The multidisciplinary team is considering several possible completed summaries of this same tumor."),
  presentationRevision("case.desmoid.initial-management-principle", "presentation.desmoid.initial-management-principle", "A stable patient with a newly confirmed desmoid asks whether every desmoid must be treated immediately.", "A stable patient has a newly confirmed desmoid."),
  presentationRevision("case.desmoid.stable-follow-up", "presentation.desmoid.stable-follow-up", "A patient returns for specialist follow-up of a desmoid that remains stable without new pain, functional limitation, obstruction, or critical-site concern. The patient asks whether stability changes the surveillance plan.", "A patient returns for specialist follow-up of a desmoid that remains stable without new pain, functional limitation, obstruction, or critical-site concern."),
  presentationRevision("case.desmoid.select-abdominal-wall-surgical-candidate", "presentation.desmoid.select-abdominal-wall-surgical-candidate", "A patient with a newly diagnosed desmoid asks what future course might make surgery a reasonable option. The multidisciplinary team discusses several possible ways this same tumor could behave or affect function.", "A patient has a newly diagnosed desmoid. The multidisciplinary team discusses several possible ways this same tumor could behave or affect function."),
  presentationRevision("case.desmoid.function-preserving-margin", "presentation.desmoid.function-preserving-margin", "A patient selected for abdominal-wall desmoid surgery asks whether obtaining the widest possible microscopic margin is worth avoidable functional loss.", "A patient has been selected for abdominal-wall desmoid surgery."),
  presentationRevision("case.desmoid.location-specific-surgery", "presentation.desmoid.location-specific-surgery", "A patient with persistently progressing abdominal-wall desmoid disease reviews active-treatment options with a multidisciplinary team and asks whether tumor location affects the role of surgery.", "A patient with persistently progressing abdominal-wall desmoid disease reviews active-treatment options with a multidisciplinary team."),
  presentationRevision("case.pancreatic-tail-adenocarcinoma.clinic-counseling", "presentation.pancreatic-tail-adenocarcinoma.clinic-counseling", "A medically fit older adult has biopsy-confirmed pancreatic adenocarcinoma in the tail. Staging shows no distant metastases, and multidisciplinary review has judged the tumor resectable. The patient asks what operation would be discussed if they proceed with surgery.", "A medically fit older adult has biopsy-confirmed pancreatic adenocarcinoma in the tail. Staging shows no distant metastases, and multidisciplinary review has judged the tumor resectable."),
  presentationRevision("case.pancreatic-tail-adenocarcinoma.spleen-counseling", "presentation.pancreatic-tail-adenocarcinoma.spleen-counseling", "A fit patient with biopsy-confirmed, resectable pancreatic-tail adenocarcinoma and no distant metastases asks whether the planned distal resection ordinarily preserves the spleen.", "A fit patient has biopsy-confirmed, resectable pancreatic-tail adenocarcinoma and no distant metastases."),
  presentationRevision("case.pancreatic-tail-adenocarcinoma.operative-candidate", "presentation.pancreatic-tail-adenocarcinoma.operative-candidate", "A patient with biopsy-confirmed pancreatic adenocarcinoma comes to discuss possible major oncologic surgery. The referral note is incomplete, and the patient asks which possible completed staging summary would fit distal pancreatectomy with splenectomy counseling.", "A patient with biopsy-confirmed pancreatic adenocarcinoma comes to discuss possible major oncologic surgery. The referral note is incomplete."),
  presentationRevision("case.pancreatic-tail-adenocarcinoma.referral-plan", "presentation.pancreatic-tail-adenocarcinoma.referral-plan", "A medically fit patient has biopsy-confirmed pancreatic adenocarcinoma in the tail, no distant metastases, and a multidisciplinary determination that the tumor is resectable. The patient is ready for surgical-oncology referral and asks what operation the referral should anticipate.", "A medically fit patient has biopsy-confirmed pancreatic adenocarcinoma in the tail, no distant metastases, and a multidisciplinary determination that the tumor is resectable."),
  presentationRevision("case.felty-syndrome.recognition-to-refractory-splenectomy", "presentation.felty-syndrome.classic-recognition", "A patient with long-standing seropositive erosive rheumatoid arthritis returns after recurrent leg-ulcer infections. Evaluation shows marked persistent neutropenia and splenomegaly after medication, infectious, and clonal large-granular-lymphocyte causes have been excluded. The patient asks what single syndrome connects these findings.", "A patient with long-standing seropositive erosive rheumatoid arthritis returns after recurrent leg-ulcer infections. Evaluation shows marked persistent neutropenia and splenomegaly after medication, infectious, and clonal large-granular-lymphocyte causes have been excluded."),
  presentationRevision("case.felty-syndrome.no-splenomegaly-boundary", "presentation.felty-syndrome.no-splenomegaly-boundary", "A patient with long-standing seropositive rheumatoid arthritis has persistent otherwise-unexplained neutropenia, but examination and imaging show no splenic enlargement. Medication, infection, and clonal LGL causes have been evaluated and excluded. The patient asks whether a normal spleen rules out Felty syndrome.", "A patient with long-standing seropositive rheumatoid arthritis has persistent otherwise-unexplained neutropenia, but examination and imaging show no splenic enlargement. Medication, infection, and clonal LGL causes have been evaluated and excluded."),
  presentationRevision("case.felty-syndrome.reverse-pattern", "presentation.felty-syndrome.reverse-pattern", "A patient with established seropositive rheumatoid arthritis reports recurrent skin and respiratory infections. After other causes are excluded, the patient asks which additional finding would make Felty syndrome the best fit.", "A patient with established seropositive rheumatoid arthritis reports recurrent skin and respiratory infections. Other causes have been excluded."),
  presentationRevision("case.felty-syndrome.treatment-principle", "presentation.felty-syndrome.treatment-principle", "A stable patient with confirmed Felty syndrome asks how methotrexate, glucocorticoids, and surgery generally fit into treatment. There is no active infection.", "A stable patient has confirmed Felty syndrome. There is no active infection."),
  presentationRevision("case.fhh.evaluation-to-confirmed-management", "presentation.fhh.initial-biochemical-evaluation", "A 27-year-old with repeatedly mild hypercalcemia, high-normal PTH, no nephrolithiasis, and a parent with similar calcium values is referred before parathyroid localization. The patient asks which test can help determine whether an inherited disorder is responsible.", "A 27-year-old with repeatedly mild hypercalcemia, high-normal PTH, no nephrolithiasis, and a parent with similar calcium values is referred before parathyroid localization."),
  presentationRevision("case.fhh.suggestive-results-confirmation", "presentation.fhh.suggestive-results-confirmation", "A young adult with mild hypercalcemia and nonsuppressed PTH returns to review testing. Renal function and vitamin-D status are adequate, there is no thiazide use, the calcium-to-creatinine clearance ratio is 0.007, and several relatives have mild hypercalcemia. The patient asks what these results mean before surgery is considered.", "A young adult with mild hypercalcemia and nonsuppressed PTH returns to review testing. Renal function and vitamin-D status are adequate, there is no thiazide use, the calcium-to-creatinine clearance ratio is 0.007, and several relatives have mild hypercalcemia."),
  presentationRevision("case.fhh.confirmed-asymptomatic-management", "presentation.fhh.confirmed-asymptomatic-management", "Genetic testing confirms a pathogenic CASR variant in an asymptomatic patient with stable mild hypercalcemia, no nephrolithiasis, and no other authored complication. The patient asks whether the confirmed diagnosis requires an operation.", "Genetic testing confirms a pathogenic CASR variant in an asymptomatic patient with stable mild hypercalcemia, no nephrolithiasis, and no other authored complication."),
  presentationRevision("case.fhh.parathyroid-surgery-counseling", "presentation.fhh.parathyroid-surgery-counseling", "A patient with confirmed uncomplicated FHH and stable mild hypercalcemia asks why the clinic is not referring them for parathyroid surgery.", "A patient has confirmed uncomplicated FHH and stable mild hypercalcemia."),
  presentationRevision("case.ipaa.pouchitis.1d", "presentation.ipaa.pouchitis.1d", "A patient with ulcerative colitis had IPAA several years ago and asks about recognized long-term inflammatory problems of the reconstruction.", "A patient with ulcerative colitis had IPAA several years ago."),
  presentationRevision("case.men2a.2d", "presentation.men2a.2d", "A patient with MEN2A asks why a confirmed pheochromocytoma changes the order of the planned endocrine operations.", "A patient with MEN2A has a confirmed pheochromocytoma."),
  presentationRevision("case.hcc.milan.solitary-within", "presentation.hcc.milan.solitary-within", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. Staging shows one 4.8-cm HCC lesion, no macrovascular invasion, and no extrahepatic disease. The patient asks what the staging means for transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. Staging shows one 4.8-cm HCC lesion, no macrovascular invasion, and no extrahepatic disease."),
  presentationRevision("case.hcc.milan.multifocal-within", "presentation.hcc.milan.multifocal-within", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. Staging shows three HCC lesions measuring 2.2, 2.6, and 2.9 cm, with no macrovascular invasion and no extrahepatic disease. The patient asks what the staging means for transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. Staging shows three HCC lesions measuring 2.2, 2.6, and 2.9 cm, with no macrovascular invasion and no extrahepatic disease."),
  presentationRevision("case.hcc.milan.solitary-above-size", "presentation.hcc.milan.solitary-above-size", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. Staging shows one 6.0-cm HCC lesion, no macrovascular invasion, and no extrahepatic disease. The patient asks what the staging means for transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. Staging shows one 6.0-cm HCC lesion, no macrovascular invasion, and no extrahepatic disease."),
  presentationRevision("case.hcc.milan.too-many-lesions", "presentation.hcc.milan.too-many-lesions", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. Staging shows four HCC lesions measuring 1.4, 1.6, 1.8, and 2.0 cm, with no macrovascular invasion and no extrahepatic disease. The patient asks what the staging means for transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. Staging shows four HCC lesions measuring 1.4, 1.6, 1.8, and 2.0 cm, with no macrovascular invasion and no extrahepatic disease."),
  presentationRevision("case.hcc.milan.macrovascular-invasion", "presentation.hcc.milan.macrovascular-invasion", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. Staging shows two HCC lesions measuring 2.1 and 2.8 cm with macrovascular invasion and no extrahepatic disease. The patient asks what the staging means for transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. Staging shows two HCC lesions measuring 2.1 and 2.8 cm with macrovascular invasion and no extrahepatic disease."),
  presentationRevision("case.hcc.milan.extrahepatic-spread", "presentation.hcc.milan.extrahepatic-spread", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. Staging shows one 3.8-cm HCC lesion, no macrovascular invasion, and confirmed extrahepatic disease. The patient asks what the staging means for transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. Staging shows one 3.8-cm HCC lesion, no macrovascular invasion, and confirmed extrahepatic disease."),
  presentationRevision("case.hcc.milan.choose-boundary-profile", "presentation.hcc.milan.solitary-within", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. The patient's final lesion measurements are still being reconciled, and the team has outlined several possible final staging summaries. The patient asks what the staging means for transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. The patient's final lesion measurements are still being reconciled, and the team has outlined several possible final staging summaries."),
  presentationRevision("case.hcc.milan.choose-invasion-spread-profile", "presentation.hcc.milan.multifocal-within", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. The patient's final staging report is being reconciled, and the team has outlined several possible summaries of lesion burden, invasion, and spread. The patient asks what the staging means for transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. The patient's final staging report is being reconciled, and the team has outlined several possible summaries of lesion burden, invasion, and spread."),
  presentationRevision("case.hcc.milan.choose-multifocal-boundary", "presentation.hcc.milan.multifocal-within", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. The patient's multifocal lesion measurements are still being reconciled, and the team has outlined several possible final summaries. The patient asks what the staging means for transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. The patient's multifocal lesion measurements are still being reconciled, and the team has outlined several possible final summaries."),
  presentationRevision("case.hcc.milan.choose-combined-profile", "presentation.hcc.milan.solitary-within", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. The patient's final tumor profile is still being reconciled, and the team has outlined several possible combinations of size, invasion, and spread. The patient asks what the staging means for transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. The patient's final tumor profile is still being reconciled, and the team has outlined several possible combinations of size, invasion, and spread."),
  presentationRevision("case.accessory-spleen.hospital-planning", "presentation.accessory-spleen.hospital-planning", "A patient asks what anatomical finding will be discussed with the hospital team before a planned splenectomy referral.", "A patient is preparing for a planned splenectomy referral."),
  presentationRevision("case.anal-hsil.hpv.3b", "presentation.anal-hsil.hpv.3b", "A patient with anal HSIL asks which virus is etiologically linked to this dysplastic lesion.", "A patient has anal HSIL."),
] as const satisfies readonly PendingBasePresentationRevision[];
/** Every revised HCC profile has an independent, complete pending record. */
export const PENDING_PROFILE_PRESENTATION_REVISIONS = [
  profilePresentationRevision("case.hcc.milan.solitary-within", "profile.hcc.milan.solitary-within.review", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. Staging shows one 4.8-cm HCC lesion, no macrovascular invasion, and no extrahepatic disease. The patient asks what the staging means for transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. Staging shows one 4.8-cm HCC lesion, no macrovascular invasion, and no extrahepatic disease."),
  profilePresentationRevision("case.hcc.milan.solitary-within", "profile.hcc.milan.solitary-within.return", "An adult with cirrhosis and confirmed hepatocellular carcinoma returns after cross-sectional staging. Staging shows one 4.8-cm HCC lesion, no macrovascular invasion, and no extrahepatic disease. They want to understand whether the findings support transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma returns after cross-sectional staging. Staging shows one 4.8-cm HCC lesion, no macrovascular invasion, and no extrahepatic disease."),
  profilePresentationRevision("case.hcc.milan.solitary-within", "profile.hcc.milan.solitary-within.referral", "An adult with cirrhosis and confirmed hepatocellular carcinoma is referred to discuss the completed staging summary. Staging shows one 4.8-cm HCC lesion, no macrovascular invasion, and no extrahepatic disease. They bring a short list of questions about what the findings mean for transplant evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is referred to discuss the completed staging summary. Staging shows one 4.8-cm HCC lesion, no macrovascular invasion, and no extrahepatic disease."),
  profilePresentationRevision("case.hcc.milan.multifocal-within", "profile.hcc.milan.multifocal-within.review", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. Staging shows three HCC lesions measuring 2.2, 2.6, and 2.9 cm, with no macrovascular invasion and no extrahepatic disease. The patient asks what the staging means for transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. Staging shows three HCC lesions measuring 2.2, 2.6, and 2.9 cm, with no macrovascular invasion and no extrahepatic disease."),
  profilePresentationRevision("case.hcc.milan.multifocal-within", "profile.hcc.milan.multifocal-within.return", "An adult with cirrhosis and confirmed hepatocellular carcinoma returns after cross-sectional staging. Staging shows three HCC lesions measuring 2.2, 2.6, and 2.9 cm, with no macrovascular invasion and no extrahepatic disease. They want to understand whether the findings support transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma returns after cross-sectional staging. Staging shows three HCC lesions measuring 2.2, 2.6, and 2.9 cm, with no macrovascular invasion and no extrahepatic disease."),
  profilePresentationRevision("case.hcc.milan.multifocal-within", "profile.hcc.milan.multifocal-within.referral", "An adult with cirrhosis and confirmed hepatocellular carcinoma is referred to discuss the completed staging summary. Staging shows three HCC lesions measuring 2.2, 2.6, and 2.9 cm, with no macrovascular invasion and no extrahepatic disease. They bring a short list of questions about what the findings mean for transplant evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is referred to discuss the completed staging summary. Staging shows three HCC lesions measuring 2.2, 2.6, and 2.9 cm, with no macrovascular invasion and no extrahepatic disease."),
  profilePresentationRevision("case.hcc.milan.solitary-above-size", "profile.hcc.milan.solitary-above-size.review", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. Staging shows one 6.0-cm HCC lesion, no macrovascular invasion, and no extrahepatic disease. The patient asks what the staging means for transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. Staging shows one 6.0-cm HCC lesion, no macrovascular invasion, and no extrahepatic disease."),
  profilePresentationRevision("case.hcc.milan.solitary-above-size", "profile.hcc.milan.solitary-above-size.return", "An adult with cirrhosis and confirmed hepatocellular carcinoma returns after cross-sectional staging. Staging shows one 6.0-cm HCC lesion, no macrovascular invasion, and no extrahepatic disease. They want to understand whether the findings support transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma returns after cross-sectional staging. Staging shows one 6.0-cm HCC lesion, no macrovascular invasion, and no extrahepatic disease."),
  profilePresentationRevision("case.hcc.milan.solitary-above-size", "profile.hcc.milan.solitary-above-size.referral", "An adult with cirrhosis and confirmed hepatocellular carcinoma is referred to discuss the completed staging summary. Staging shows one 6.0-cm HCC lesion, no macrovascular invasion, and no extrahepatic disease. They bring a short list of questions about what the findings mean for transplant evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is referred to discuss the completed staging summary. Staging shows one 6.0-cm HCC lesion, no macrovascular invasion, and no extrahepatic disease."),
  profilePresentationRevision("case.hcc.milan.too-many-lesions", "profile.hcc.milan.too-many-lesions.review", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. Staging shows four HCC lesions measuring 1.4, 1.6, 1.8, and 2.0 cm, with no macrovascular invasion and no extrahepatic disease. The patient asks what the staging means for transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. Staging shows four HCC lesions measuring 1.4, 1.6, 1.8, and 2.0 cm, with no macrovascular invasion and no extrahepatic disease."),
  profilePresentationRevision("case.hcc.milan.too-many-lesions", "profile.hcc.milan.too-many-lesions.return", "An adult with cirrhosis and confirmed hepatocellular carcinoma returns after cross-sectional staging. Staging shows four HCC lesions measuring 1.4, 1.6, 1.8, and 2.0 cm, with no macrovascular invasion and no extrahepatic disease. They want to understand whether the findings support transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma returns after cross-sectional staging. Staging shows four HCC lesions measuring 1.4, 1.6, 1.8, and 2.0 cm, with no macrovascular invasion and no extrahepatic disease."),
  profilePresentationRevision("case.hcc.milan.too-many-lesions", "profile.hcc.milan.too-many-lesions.referral", "An adult with cirrhosis and confirmed hepatocellular carcinoma is referred to discuss the completed staging summary. Staging shows four HCC lesions measuring 1.4, 1.6, 1.8, and 2.0 cm, with no macrovascular invasion and no extrahepatic disease. They bring a short list of questions about what the findings mean for transplant evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is referred to discuss the completed staging summary. Staging shows four HCC lesions measuring 1.4, 1.6, 1.8, and 2.0 cm, with no macrovascular invasion and no extrahepatic disease."),
  profilePresentationRevision("case.hcc.milan.macrovascular-invasion", "profile.hcc.milan.macrovascular-invasion.review", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. Staging shows two HCC lesions measuring 2.1 and 2.8 cm with macrovascular invasion and no extrahepatic disease. The patient asks what the staging means for transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. Staging shows two HCC lesions measuring 2.1 and 2.8 cm with macrovascular invasion and no extrahepatic disease."),
  profilePresentationRevision("case.hcc.milan.macrovascular-invasion", "profile.hcc.milan.macrovascular-invasion.return", "An adult with cirrhosis and confirmed hepatocellular carcinoma returns after cross-sectional staging. Staging shows two HCC lesions measuring 2.1 and 2.8 cm with macrovascular invasion and no extrahepatic disease. They want to understand whether the findings support transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma returns after cross-sectional staging. Staging shows two HCC lesions measuring 2.1 and 2.8 cm with macrovascular invasion and no extrahepatic disease."),
  profilePresentationRevision("case.hcc.milan.macrovascular-invasion", "profile.hcc.milan.macrovascular-invasion.referral", "An adult with cirrhosis and confirmed hepatocellular carcinoma is referred to discuss the completed staging summary. Staging shows two HCC lesions measuring 2.1 and 2.8 cm with macrovascular invasion and no extrahepatic disease. They bring a short list of questions about what the findings mean for transplant evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is referred to discuss the completed staging summary. Staging shows two HCC lesions measuring 2.1 and 2.8 cm with macrovascular invasion and no extrahepatic disease."),
  profilePresentationRevision("case.hcc.milan.extrahepatic-spread", "profile.hcc.milan.extrahepatic-spread.review", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. Staging shows one 3.8-cm HCC lesion, no macrovascular invasion, and confirmed extrahepatic disease. The patient asks what the staging means for transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. Staging shows one 3.8-cm HCC lesion, no macrovascular invasion, and confirmed extrahepatic disease."),
  profilePresentationRevision("case.hcc.milan.extrahepatic-spread", "profile.hcc.milan.extrahepatic-spread.return", "An adult with cirrhosis and confirmed hepatocellular carcinoma returns after cross-sectional staging. Staging shows one 3.8-cm HCC lesion, no macrovascular invasion, and confirmed extrahepatic disease. They want to understand whether the findings support transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma returns after cross-sectional staging. Staging shows one 3.8-cm HCC lesion, no macrovascular invasion, and confirmed extrahepatic disease."),
  profilePresentationRevision("case.hcc.milan.extrahepatic-spread", "profile.hcc.milan.extrahepatic-spread.referral", "An adult with cirrhosis and confirmed hepatocellular carcinoma is referred to discuss the completed staging summary. Staging shows one 3.8-cm HCC lesion, no macrovascular invasion, and confirmed extrahepatic disease. They bring a short list of questions about what the findings mean for transplant evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is referred to discuss the completed staging summary. Staging shows one 3.8-cm HCC lesion, no macrovascular invasion, and confirmed extrahepatic disease."),
  profilePresentationRevision("case.hcc.milan.choose-boundary-profile", "profile.hcc.milan.choose-boundary-profile.review", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. The patient's final lesion measurements are still being reconciled, and the team has outlined several possible final staging summaries. The patient asks what the staging means for transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. The patient's final lesion measurements are still being reconciled, and the team has outlined several possible final staging summaries."),
  profilePresentationRevision("case.hcc.milan.choose-boundary-profile", "profile.hcc.milan.choose-boundary-profile.return", "An adult with cirrhosis and confirmed hepatocellular carcinoma returns after cross-sectional staging. The patient's final lesion measurements are still being reconciled, and the team has outlined several possible final staging summaries. They want to understand whether the findings support transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma returns after cross-sectional staging. The patient's final lesion measurements are still being reconciled, and the team has outlined several possible final staging summaries."),
  profilePresentationRevision("case.hcc.milan.choose-boundary-profile", "profile.hcc.milan.choose-boundary-profile.referral", "An adult with cirrhosis and confirmed hepatocellular carcinoma is referred to discuss the completed staging summary. The patient's final lesion measurements are still being reconciled, and the team has outlined several possible final staging summaries. They bring a short list of questions about what the findings mean for transplant evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is referred to discuss the completed staging summary. The patient's final lesion measurements are still being reconciled, and the team has outlined several possible final staging summaries."),
  profilePresentationRevision("case.hcc.milan.choose-invasion-spread-profile", "profile.hcc.milan.choose-invasion-spread-profile.review", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. The patient's final staging report is being reconciled, and the team has outlined several possible summaries of lesion burden, invasion, and spread. The patient asks what the staging means for transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. The patient's final staging report is being reconciled, and the team has outlined several possible summaries of lesion burden, invasion, and spread."),
  profilePresentationRevision("case.hcc.milan.choose-invasion-spread-profile", "profile.hcc.milan.choose-invasion-spread-profile.return", "An adult with cirrhosis and confirmed hepatocellular carcinoma returns after cross-sectional staging. The patient's final staging report is being reconciled, and the team has outlined several possible summaries of lesion burden, invasion, and spread. They want to understand whether the findings support transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma returns after cross-sectional staging. The patient's final staging report is being reconciled, and the team has outlined several possible summaries of lesion burden, invasion, and spread."),
  profilePresentationRevision("case.hcc.milan.choose-invasion-spread-profile", "profile.hcc.milan.choose-invasion-spread-profile.referral", "An adult with cirrhosis and confirmed hepatocellular carcinoma is referred to discuss the completed staging summary. The patient's final staging report is being reconciled, and the team has outlined several possible summaries of lesion burden, invasion, and spread. They bring a short list of questions about what the findings mean for transplant evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is referred to discuss the completed staging summary. The patient's final staging report is being reconciled, and the team has outlined several possible summaries of lesion burden, invasion, and spread."),
  profilePresentationRevision("case.hcc.milan.choose-multifocal-boundary", "profile.hcc.milan.choose-multifocal-boundary.review", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. The patient's multifocal lesion measurements are still being reconciled, and the team has outlined several possible final summaries. The patient asks what the staging means for transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. The patient's multifocal lesion measurements are still being reconciled, and the team has outlined several possible final summaries."),
  profilePresentationRevision("case.hcc.milan.choose-multifocal-boundary", "profile.hcc.milan.choose-multifocal-boundary.return", "An adult with cirrhosis and confirmed hepatocellular carcinoma returns after cross-sectional staging. The patient's multifocal lesion measurements are still being reconciled, and the team has outlined several possible final summaries. They want to understand whether the findings support transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma returns after cross-sectional staging. The patient's multifocal lesion measurements are still being reconciled, and the team has outlined several possible final summaries."),
  profilePresentationRevision("case.hcc.milan.choose-multifocal-boundary", "profile.hcc.milan.choose-multifocal-boundary.referral", "An adult with cirrhosis and confirmed hepatocellular carcinoma is referred to discuss the completed staging summary. The patient's multifocal lesion measurements are still being reconciled, and the team has outlined several possible final summaries. They bring a short list of questions about what the findings mean for transplant evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is referred to discuss the completed staging summary. The patient's multifocal lesion measurements are still being reconciled, and the team has outlined several possible final summaries."),
  profilePresentationRevision("case.hcc.milan.choose-combined-profile", "profile.hcc.milan.choose-combined-profile.review", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. The patient's final tumor profile is still being reconciled, and the team has outlined several possible combinations of size, invasion, and spread. The patient asks what the staging means for transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is seen to review completed staging imaging. The patient's final tumor profile is still being reconciled, and the team has outlined several possible combinations of size, invasion, and spread."),
  profilePresentationRevision("case.hcc.milan.choose-combined-profile", "profile.hcc.milan.choose-combined-profile.return", "An adult with cirrhosis and confirmed hepatocellular carcinoma returns after cross-sectional staging. The patient's final tumor profile is still being reconciled, and the team has outlined several possible combinations of size, invasion, and spread. They want to understand whether the findings support transplant-center evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma returns after cross-sectional staging. The patient's final tumor profile is still being reconciled, and the team has outlined several possible combinations of size, invasion, and spread."),
  profilePresentationRevision("case.hcc.milan.choose-combined-profile", "profile.hcc.milan.choose-combined-profile.referral", "An adult with cirrhosis and confirmed hepatocellular carcinoma is referred to discuss the completed staging summary. The patient's final tumor profile is still being reconciled, and the team has outlined several possible combinations of size, invasion, and spread. They bring a short list of questions about what the findings mean for transplant evaluation.", "An adult with cirrhosis and confirmed hepatocellular carcinoma is referred to discuss the completed staging summary. The patient's final tumor profile is still being reconciled, and the team has outlined several possible combinations of size, invasion, and spread."),
] as const satisfies readonly PendingProfilePresentationRevision[];
export const DEFAULT_PATIENT_PRESENTATION_REVISION_MAPPINGS = {
  complaintRevisions: PENDING_PATIENT_PRESENTATION_REVISIONS,
  basePresentationRevisions: PENDING_BASE_PRESENTATION_REVISIONS,
  profilePresentationRevisions: PENDING_PROFILE_PRESENTATION_REVISIONS,
} as const satisfies PatientPresentationRevisionMappings;

function uniqueMap<T>(
  entries: readonly T[],
  keyFor: (entry: T) => string,
  duplicateLabel: string,
): Map<string, T> {
  const result = new Map<string, T>();

  for (const entry of entries) {
    const key = keyFor(entry);
    if (result.has(key)) {
      throw new Error(`Duplicate ${duplicateLabel}: ${key}`);
    }
    result.set(key, entry);
  }

  return result;
}

export function applyPendingPatientPresentationRevisions(
  sourceCases: readonly SyntheticClinicalCase[],
  mappings: PatientPresentationRevisionMappings = DEFAULT_PATIENT_PRESENTATION_REVISION_MAPPINGS,
): SyntheticClinicalCase[] {
  const sourceById = uniqueMap(sourceCases, (clinicalCase) => clinicalCase.id, "source case");
  const complaintsByCaseId = uniqueMap(
    mappings.complaintRevisions,
    (revision) => revision.caseId,
    "patient-presentation revision",
  );
  const basesByCaseId = uniqueMap(
    mappings.basePresentationRevisions,
    (revision) => revision.caseId,
    "base presentation revision",
  );
  const profilesByKey = uniqueMap(
    mappings.profilePresentationRevisions,
    (revision) => `${revision.caseId}/${revision.approvedInstantiationProfileId}`,
    "profile presentation revision",
  );

  for (const revision of mappings.complaintRevisions) {
    const sourceCase = sourceById.get(revision.caseId);
    if (!sourceCase) throw new Error(`Stale patient-presentation revision: ${revision.caseId}`);
    if (sourceCase.patientPresentationVariantId !== revision.patientPresentationVariantId) {
      throw new Error(`Presentation variant mismatch: ${revision.caseId}`);
    }
    if (!sourceCase.chiefComplaint) {
      throw new Error(`Revision targets a case without a chief complaint: ${revision.caseId}`);
    }
  }

  for (const revision of mappings.basePresentationRevisions) {
    const sourceCase = sourceById.get(revision.caseId);
    if (!sourceCase) throw new Error(`Stale base presentation revision: ${revision.caseId}`);
    if (sourceCase.patientPresentationVariantId !== revision.patientPresentationVariantId) {
      throw new Error(`Presentation variant mismatch: ${revision.caseId}`);
    }
    if (sourceCase.presentation !== revision.sourcePresentation) {
      throw new Error(`Base presentation drift: ${revision.caseId}`);
    }
  }

  for (const revision of mappings.profilePresentationRevisions) {
    const sourceCase = sourceById.get(revision.caseId);
    if (!sourceCase) {
      throw new Error(
        `Stale profile presentation revision: ${revision.caseId}/${revision.approvedInstantiationProfileId}`,
      );
    }
    const profile = sourceCase.approvedInstantiationProfiles?.find(
      (candidate) => candidate.id === revision.approvedInstantiationProfileId,
    );
    if (!profile) {
      throw new Error(
        `Stale profile presentation revision: ${revision.caseId}/${revision.approvedInstantiationProfileId}`,
      );
    }
    if (profile.presentation !== revision.sourcePresentation) {
      throw new Error(`Profile presentation drift: ${sourceCase.id}/${profile.id}`);
    }
  }

  for (const sourceCase of sourceCases) {
    const profileWithComplaint = sourceCase.approvedInstantiationProfiles?.find(
      (profile) => profile.chiefComplaint,
    );
    if (profileWithComplaint) {
      throw new Error(
        `Active profile chief complaint needs explicit revision: ${sourceCase.id}/${profileWithComplaint.id}`,
      );
    }
    if (sourceCase.chiefComplaint && !complaintsByCaseId.has(sourceCase.id)) {
      throw new Error(`Missing patient-presentation revision: ${sourceCase.id}`);
    }
    if (!sourceCase.chiefComplaint && complaintsByCaseId.has(sourceCase.id)) {
      throw new Error(`Unexpected patient-presentation revision: ${sourceCase.id}`);
    }

    const profiles = sourceCase.approvedInstantiationProfiles ?? [];
    const mapped = profiles.map((profile) => profilesByKey.get(`${sourceCase.id}/${profile.id}`));
    if (mapped.some(Boolean) && mapped.some((revision) => !revision)) {
      throw new Error(`Missing profile presentation revision: ${sourceCase.id}`);
    }
    if (
      !mapped.some(Boolean) &&
      mappings.profilePresentationRevisions.some((revision) => revision.caseId === sourceCase.id)
    ) {
      throw new Error(`Missing profile presentation revision: ${sourceCase.id}`);
    }
  }

  return sourceCases.map((sourceCase) => {
    const complaintRevision = complaintsByCaseId.get(sourceCase.id);
    const baseRevision = basesByCaseId.get(sourceCase.id);
    const sourceProfiles = sourceCase.approvedInstantiationProfiles ?? [];
    const revisedProfiles = sourceProfiles.map((profile) => {
      const revision = profilesByKey.get(`${sourceCase.id}/${profile.id}`);
      return revision
        ? { ...profile, presentation: revision.revisedPresentation }
        : { ...profile };
    });
    const profileRevisions = revisedProfiles.flatMap((profile) => {
      const revision = profilesByKey.get(`${sourceCase.id}/${profile.id}`);
      return revision
        ? [{
            id: `pprv2.${profile.id}`,
            approvedInstantiationProfileId: profile.id,
            contentVersion: PATIENT_PRESENTATION_REVISION_CONTENT_VERSION,
            revisedPresentation: profile.presentation,
            revisedFields: ["presentation"] as ["presentation"],
            aiAssistedDrafting: true as const,
            reviewStatus: "needs_clinician_review" as const,
            lastClinicianReview: null,
          }]
        : [];
    });

    if (!complaintRevision && !baseRevision && profileRevisions.length === 0) {
      return { ...sourceCase };
    }

    const presentation = baseRevision?.revisedPresentation ?? sourceCase.presentation;
    return {
      ...sourceCase,
      ...(complaintRevision ? { chiefComplaint: complaintRevision.chiefComplaint } : {}),
      presentation,
      ...(sourceProfiles.length ? { approvedInstantiationProfiles: revisedProfiles } : {}),
      patientPresentationRevision: {
        id: `pprv2.${sourceCase.id}`,
        patientPresentationVariantId: sourceCase.patientPresentationVariantId,
        contentVersion: PATIENT_PRESENTATION_REVISION_CONTENT_VERSION,
        ...(complaintRevision ? { revisedChiefComplaint: complaintRevision.chiefComplaint } : {}),
        ...(baseRevision ? { revisedPresentation: presentation } : {}),
        revisedFields: [
          ...(complaintRevision ? ["chiefComplaint" as const] : []),
          ...(baseRevision ? ["presentation" as const] : []),
        ],
        ...(profileRevisions.length ? { revisedProfilePresentations: profileRevisions } : {}),
        aiAssistedDrafting: true,
        reviewStatus: "needs_clinician_review",
        lastClinicianReview: null,
      },
    };
  });
}
