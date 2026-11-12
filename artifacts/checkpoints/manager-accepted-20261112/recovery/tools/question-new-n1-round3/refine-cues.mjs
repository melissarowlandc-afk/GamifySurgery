// One-shot, manually selected wording refinements. Not a suppression or automatic clinical-quality gate.
import fs from 'node:fs';
const edits={
 'abdominal':[
  ['displaces the posterior canal wall medial','displaces the canal wall medial'],
  ['Pancreatic MRI with MRCP','Magnetic resonance imaging with duct sequences'],
  ['Endoscopic retrograde pancreatography','Endoscopic retrograde pancreatography study'],
  ['Long-chain-fat restriction with medium-chain fat','Long-chain-fat restriction with medium-chain fat'],
  ['Oral low-long-chain-fat meals with MCT supplements','Long-chain-fat restriction with medium-chain fat'],
  ['Standard postpyloric formula with protein supplements','Standard postpyloric nutrition with protein supplements'],
  ['Exclusive parenteral feeding with lipid emulsion','Exclusive parenteral nutrition with intravenous lipid emulsion'],
  ['Segmental resection of the involved ileum','Segmental small-bowel resection'],
  ['HLA-DQ2/DQ8 typing, then a challenge if compatible','Human leukocyte antigen testing before gluten challenge'],
  ['Supervised gluten challenge, then serology and biopsy','Supervised gluten challenge before serology and biopsy'],
  ['Duodenal biopsy, then a challenge if nondiagnostic','Duodenal mucosal biopsy before a supervised gluten challenge'],
  ['The first celiac label came from symptoms improving on dietary restriction; no susceptibility typing is in the record','The first celiac label came from symptoms improving during dietary restriction'],
  ['Obtain tTG-IgA on the current diet','Obtain tTG-IgA during gluten exposure'],
  ['His outside endoscopy was stopped','His outside gastroscopy was stopped'],
  ['The biopsy obtained before that event','The mucosal specimen obtained before that event'],
  ['Contrast fluoroscopy with gastric-outlet mapping','Contrast fluoroscopy with pyloric-channel mapping'],
  ['Withdraw PN; prescribe intravenous fluid replacement','Withdraw PN; replace fluid and electrolyte losses'],
  ['Gastrectomy with en-bloc distal pancreatic and splenic resection','En-bloc gastrectomy and distal pancreatectomy/splenectomy'],
  ['Gastrectomy with interface separation and splenic preservation','Gastrectomy after pancreatic-plane separation; retain spleen'],
  ['Bypass gastrojejunostomy with abandonment of gastric resection','Palliative gastrojejunostomy with gastric tumor left in situ'],
 ],
 'breast':[
  ['Localized re-excision of the nipple-side cavity edge','Localized completion excision of the retained segment'],
  ['Superior and lateral cavity re-excision','Re-excise the superior and lateral faces'],
  ['Lateral cavity re-excision','Re-excise the lateral face; observe superior'],
  ['Superior cavity re-excision','Re-excise the superior face; observe lateral'],
  ['A layer of residual breast tissue remains between the cavity and pectoral fascia','A layer of glandular tissue separates the cavity wall from an uninterrupted pectoral fascial line'],
  ['Mastectomy with no axillary operation','Mastectomy with axillary surveillance'],
  ['Mastectomy with sentinel-node sampling','Mastectomy with axillary sentinel-node biopsy'],
  ['Mastectomy with excision of the imaged node','Mastectomy with targeted axillary node excision'],
  ['Core needle sampling of the solid wall nodule','Core biopsy of the cavity-wall nodule'],
  ['Repeat aspiration sampling of the fluid cavity','Fluid aspiration with cavity-wall nodule ultrasound'],
  ['Short-interval ultrasound of the entire cavity','Serial ultrasound of fluid and cavity-wall nodule'],
  ['Breast-conserving excision with underlying pectoral fascia','Breast-conserving excision with pectoral fascia'],
  ['Breast-conserving excision with a pectoral-muscle segment','Breast-conserving excision with pectoral-muscle resection'],
  ['Capsule-following excision with retained pectoral fascia','Breast-conserving excision following the tumor capsule'],
 ],
 'perioperative':[
  ['Pelvic CT with venous-phase imaging','Computed tomography of iliac veins with venous-phase acquisition'],
  ['Repeat femoral-popliteal compression ultrasound','Repeat duplex ultrasound of common femoral and popliteal veins'],
  ['Lymphoscintigraphy of the affected lower limb','Radionuclide lymphoscintigraphy test of the affected leg'],
  ['Continue the prescribed therapeutic enoxaparin','Continue therapeutic enoxaparin treatment'],
  ['Ferritin and transferrin-saturation studies','Serum ferritin and transferrin saturation'],
  ['Repeat arterial blood gas and co-oximetry','Arterial blood gas and co-oximetry assays'],
  ['Resting transthoracic echocardiography','Transthoracic echocardiography with Doppler'],
  ['Two image-guided FNAs','Two ultrasound-guided FNAs'],
  ['Image-guided core biopsy with histology and ancillary studies','Ultrasound-guided core biopsy with ancillary studies'],
  ['Repeat FNA with on-site assessment and a fresh cell block','Ultrasound-guided FNA biopsy with cell-block/flow studies'],
  ['Open node excision with histology and ancillary studies','Open excision biopsy with histology and ancillary studies'],
  ['Intravenous phytonadione with serial INR testing','Intravenous vitamin K with serial INR testing'],
  ['Which immediate reversal regimen best fits Harold Evans\'s hospital findings while hemorrhage control proceeds?','Which rapid factor-replacement product should accompany intravenous vitamin K while hemorrhage control proceeds for Harold Evans?'],
  ['Four-factor prothrombin complex concentrate plus IV vitamin K','Four-factor prothrombin complex concentrate'],
  ['Further plasma factor replacement plus intravenous vitamin K','Thawed plasma for vitamin-K-dependent factor replacement'],
  ['Recombinant activated factor VII plus intravenous vitamin K','Recombinant activated factor VII concentrate'],
  ['Pause enteral delivery during resuscitation and assessment','Pause enteral delivery during abdominal assessment'],
 ]
};
for(const [name,rows]of Object.entries(edits)){
 const p=`packages/clinical-content/src/question-new-n1-round3-${name}.ts`;let s=fs.readFileSync(p,'utf8');
 for(const [before,after]of rows){if(before===after)continue;if(!s.includes(before))throw new Error(`Missing ${name}: ${before}`);s=s.replaceAll(before,after);}
 fs.writeFileSync(p,s);
}
