// One-shot editorial changes after the first exact draft cue attack. N1 v1/N2 excluded.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root='packages/clinical-content/src/question-new-n1-round2-';
const dir='.local-dev/question-new-n1-round2-20261104/draft-before-cues';
fs.mkdirSync(dir,{recursive:true});
const edits={
  abdominal:[
    ['"Reinforce the posterior inguinal wall"','"Reinforce the transversalis fascial layer"'],
    ['"Reinforce the lateral deep-ring defect"','"Reconstruct the deep inguinal ring"'],
    ['"Reinforce the subinguinal femoral defect"','"Reinforce the femoral canal boundary"'],
    [" The hospital's bedside ultrasound record is available for reassessment.",''],
    ['"Contrast-enhanced CT of abdomen and pelvis"','"Computed tomography with intravenous contrast"'],
    ['"MR cholangiopancreatography of the pancreatic ducts"','"Magnetic resonance cholangiopancreatography"'],
    ['"Doppler ultrasound of the portal and splenic veins"','"Ultrasound with portal and splenic venous Doppler"'],
    ['Feeding-related opacity after retroperitoneal dissection raises a lymphatic composition question','The operative field and meal-linked change raise a lymphatic composition question'],
    ['"Add parenteral support to the tolerated enteral intake"','"Add parenteral nutrition to the prescribed tube regimen"'],
    ['"Advance postpyloric feeding to the assessed intake target"','"Increase postpyloric nutrition to the assessed requirement"'],
    ['"Continue the current enteral rate with daily reassessment"','"Continue postpyloric nutrition at the currently tolerated rate"'],
    ['"Segmental ileal resection with anastomosis"','"Segmental resection with primary anastomosis"'],
    ['"Bowel-inclusive wedge resection with transverse closure"','"Wedge resection with transverse bowel closure"'],
    ['"tTG-IgG and deamidated gliadin peptide IgG"','"tTG-IgG and deamidated gliadin peptide IgG assays"',2],
    ['"tTG-IgA and endomysial IgA antibodies"','"tTG-IgA and endomysial IgA antibody assays"'],
    ['"Supervised gluten reintroduction, then repeat disease testing"','"Supervised gluten reintroduction, then repeat serology"'],
    ["An outside 'upper GI biopsy' report contains antral mucosa and esophageal squamous tissue; no duodenal tissue is listed.",
      'The complete specimen list from an outside mucosal-biopsy procedure identifies antral mucosa and esophageal squamous tissue.'],
    ['"Repeat tTG-IgA with endomysial IgA antibodies"','"Repeat tTG-IgA and endomysial IgA assays"'],
    ['"HPB-surgery assessment for partial hepatectomy"','"HPB-surgery assessment for partial liver resection"'],
    ['"Interventional-radiology assessment for tumor ablation"','"Interventional-radiology assessment for liver ablation"'],
    ['"Repeat endoscopy with sampling of the outlet lesion"','"Endoscopic pyloric inspection with lesion biopsy"'],
    ['"Four-hour solid-meal gastric emptying scintigraphy"','"Solid-meal scintigraphy with four-hour acquisition"'],
    ['"Contrast upper-GI study of outlet transit"','"Contrast upper-GI fluoroscopy of outlet transit"'],
    ['"Stop PN; continue meals and oral supplements"','"Withdraw PN; retain meals and oral supplements"'],
    ['"Continue PN and meals; stop oral supplements"','"Retain PN as the primary route; reduce oral supplementation"'],
    ['"Stop PN; replace supplements with postpyloric feeding"','"Replace the drinks with postpyloric tube feeding"'],
    ['"HPB completion-resection assessment after the staging review"','"HPB assessment of completion oncologic resection"'],
    ['"HPB surveillance planning after the cholecystectomy review"','"HPB assessment of post-cholecystectomy surveillance"'],
    ['"HPB duct-stump re-excision assessment after cholangiography"','"HPB assessment of duct-stump re-excision"'],
    ['"timing.test.mrcp")],\n    explanation: "First interpret the wall layer','undefined)],\n    explanation: "First interpret the wall layer'],
    ['; the hospital team judged an oncologic resection feasible.','.'],
  ],
  breast:[
    ['The interval development of irregular spiculated morphology away from the surgical bed is the leading suspicious target','The newly radiating contour at the nonoperative site is the leading suspicious target'],
    ['complete excision has no prescribed fixed-width rim','the completeness target does not mandate a numerical width'],
    ['"Re-excise the lateral cavity margin"','"Lateral cavity re-excision"'],
    ['"Re-excise the superior cavity margin"','"Superior cavity re-excision"'],
    ['"Re-excise superior and lateral cavity margins"','"Superior and lateral cavity re-excision"'],
    ['"Re-excision of the posterior cavity margin"','"Cavity resection at the posterior face"'],
    ['"Breast irradiation with the current surgical margins"','"Breast irradiation including the posterior cavity"'],
    ['"Clinical surveillance with the current surgical margins"','"Clinical surveillance of the posterior cavity"'],
    ['"Mastectomy without an axillary staging operation"','"Mastectomy with no axillary staging surgery"'],
    ['"Repeat ultrasound-guided core of the cortical node target"','"Ultrasound-guided histologic needle biopsy of the node"'],
    ['"CT-guided core biopsy of the pulmonary nodule"','"Image-guided core biopsy of the pulmonary target"'],
    ['"Ultrasound-guided core biopsy of the axillary node"','"Image-guided core biopsy of the axillary target"'],
    ['"Ultrasound-guided core biopsy of the breast operative bed"','"Image-guided core biopsy of the operative-bed target"'],
  ],
  perioperative:[
    ['"Factor IX activity and factor XI activity assays"','"Factor VIII activity and factor IX/XI activity assays"'],
    ['"Lupus-anticoagulant screen and phospholipid confirmation"','"Factor VIII activity and lupus-anticoagulant testing"'],
    ['"Lymphoscintigraphy of the affected lower limb"','"Radionuclide scintigraphy of lower-limb lymphatic drainage"'],
    ["A hospital summary says the venous scan was negative; its acquisition log is attached.",'A hospital summary calls a leg scan negative; its acquisition log is attached.'],
    ['"Which medication plan should Caroline Ward\'s endocrine team initiate for this course?"','"Which medication plan should Caroline Ward\'s endocrine team use for this course?"'],
    [" The hospital's oxygen-content calculation and its input dates are available for review.",' The hospital oxygen-content calculation lists the input dates below.'],
    ['Copied from the preoperative blood count into the postoperative calculation','Copied from the preoperative sample into the postoperative calculation'],
    ['"Blood loss and crystalloid replacement documented"','"900-mL estimated loss with crystalloid replacement"'],
    ['"Current blood count with hemoglobin-trend review"','"Complete blood count and oxygen-content review"'],
    ['"Repeat arterial gas with oxygen-tension trend review"','"Arterial blood gas and oxygen-tension review"'],
    ['"Capnography with expired-carbon-dioxide trend review"','"Capnography and expired-carbon-dioxide review"'],
    ['"Image-guided core biopsy through the mapped route"','"Image-guided core biopsy of the deep neck node"'],
    ['"Review measured minute ventilation and CO2 elimination"','"Review measured minute ventilation and arterial gas trends"'],
    ['"Reassess the central wound depth and transfer plan"','"Burn-center depth and transfer reassessment"'],
    ['"Reassess the analgesic regimen and dressing pain plan"','"Burn-center analgesia and dressing reassessment"'],
    ['"Reassess the exercise schedule and movement pain plan"','"Burn-center mobility and exercise reassessment"'],
    ['"Start low-rate tube feeding with tolerance reassessment"','"Low-rate enteral nutrition with tolerance checks"'],
    ['"Start primary parenteral support with laboratory reassessment"','"Primary parenteral nutrition with chemistry checks"'],
    ['"Defer feeding until stool passage with daily reassessment"','"Deferred nutritional delivery until stool passage"'],
    ['The cervical esophagus and distal hiatus are shown separately.','The neck segment of the esophagus and distal hiatus are shown separately.'],
  ],
};
for(const [name,replacements]of Object.entries(edits)){
  const path=`${root}${name}.ts`;let text=fs.readFileSync(path,'utf8');
  const receipt=`${dir}/${name}.ts`;assert.ok(!fs.existsSync(receipt),'Do not overwrite the earlier draft receipt.');
  fs.writeFileSync(receipt,text);
  for(const [before,after,count=1]of replacements){
    assert.equal(text.split(before).length-1,count,`${name}: missing/ambiguous editorial replacement ${before}`);
    text=text.split(before).join(after);
  }
  fs.writeFileSync(path,text);
}
console.log('Refined three owned round-two data modules; N1 v1 and N2 excluded.');
