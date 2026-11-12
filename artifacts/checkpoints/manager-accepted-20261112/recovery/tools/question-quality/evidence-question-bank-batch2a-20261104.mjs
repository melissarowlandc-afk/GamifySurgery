// Original qualitative facts for the explicit treatment comparison. Existing
// source metadata/access dates are retained; no new source retrieval is claimed.
const shared={contentVersion:'evidence.question-bank-program.2026-11-04.v1',reviewStatus:'needs_clinician_review',aiAssistedDrafting:true,lastClinicianReview:null,
 evidenceCategory:'management',certainty:'moderate',applicablePopulation:'Adult synthetic achalasia case with an adequate structural/physiological workup; exact candidate suitability remains for foregut review.',lastCheckedOn:'2026-11-04',
 verificationScope:'Offline author synthesis against real recorded guideline references. Original access/authority metadata documents earlier narrower checks. No treatment section was freshly retrieved; direct treatment alignment remains an independent source/clinician-review requirement.'};
export const claims=[
 {...shared,id:'claim.qbp2a.achalasia-heller',statement:'Laparoscopic Heller myotomy is an established junction-directed treatment for appropriately selected adults with achalasia.',
  sourceIds:['source.sc.seoul-achalasia-2020','source.qq20261102b.acg-achalasia'],basisClaimIds:['claim.achalasia.manometric-recognition','claim.qq20261102a.primary-position-achalasia'],
  limitation:'Broad treatment-family comparison only; no claim of superiority to pneumatic dilation or POEM, exact operative technique, numerical benefit or universal treatment selection. New management mapping needs direct source-alignment and clinical review.'},
 {...shared,id:'claim.qbp2a.achalasia-ppi',statement:'Acid suppression with a proton-pump inhibitor does not correct the absent peristalsis and impaired junction relaxation of achalasia.',
  sourceIds:['source.sc.seoul-achalasia-2020','source.qq20261102b.acg-achalasia'],basisClaimIds:['claim.achalasia.manometric-recognition'],
  limitation:'This does not preclude treatment of coexisting reflux. It does not prescribe an omeprazole dose or claim that reflux symptoms establish GERD. Direct new management alignment remains for review.'},
 {...shared,id:'claim.qbp2a.achalasia-nitrates',statement:'Nitrate therapy such as isosorbide dinitrate is a less effective pharmacological approach to achalasia, generally reserved for patients unsuitable for more effective treatment options.',
  sourceIds:['source.sc.seoul-achalasia-2020'],basisClaimIds:['claim.achalasia.manometric-recognition'],
  limitation:'Single recorded guideline reference for the pharmacological comparison; no dose, timing, effect size or assertion that every individual should undergo surgery. Confirm the named medication and ranking directly before clinical sign-off.'},
];
