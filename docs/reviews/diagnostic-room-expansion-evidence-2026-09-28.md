# Diagnostic room expansion: source and decision record

Development-preview operational mappings; no clinical-content release approval.
Owner requested barium swallow in X-ray and both endoanal ultrasound and
ultrasound-guided biopsy when appropriate (September 28, 2026). These are game
facility decisions, not a claim that any plain X-ray/ultrasound room inherently
has all specialized equipment. Exact procedures retain their own names/routes.

## Sources

### source.room-expansion.upper-gi.2024

- Citation: RadiologyInfo.org. *Upper GI x-ray*. Reviewed September 1, 2024.
- Organization/authors: American College of Radiology and Radiological Society
  of North America; corporate authors, no individual author listed.
- Publication year: 2024 (displayed review year).
- Official URL: https://www.radiologyinfo.org/en/info/uppergi
- Accessed: 2026-09-28.
- Source class/medical authority: professional-society patient information,
  physician-reviewed imaging procedure description; not a management guideline.
- License/reuse: copyrighted; no open-content reuse license asserted. Targeted
  factual verification only; no source prose, images or full text stored.
- Intended use: verify underlying imaging modality/equipment distinction, not
  clinical indications, game fees or simulation duration.
- Supported claim: claim.room-expansion.contrast-swallow-fluoroscopy.

### source.room-expansion.endoanal.2025

- Citation: Kingston and Richmond NHS Foundation Trust. *Endoanal ultrasound
  scan*. Updated June 10, 2025.
- Organization/authors: Kingston and Richmond NHS Foundation Trust, corporate
  author; no individual author listed.
- Publication year: 2025 (displayed update year).
- Official URL: https://www.kingstonandrichmond.nhs.uk/patients-and-families/patient-leaflets/endoanal-ultrasound-scan
- Accessed: 2026-09-28.
- Source class/medical authority: NHS provider patient information describing
  its clinical service; not a general practice or management guideline.
- License/reuse: no open-content license verified. Targeted factual verification
  only; no source prose, images or full text stored.
- Intended use: verify modality and probe distinction, not indications, staffing
  qualifications, game fees or simulation duration.
- Supported claim: claim.room-expansion.endoanal-probe.

### source.room-expansion.paget.2025

- Citation/author/organization: National Cancer Institute. *Paget Disease of the
  Breast*. Updated December 2, 2025. Corporate author; no individual author listed.
- Publication year: 2025 (displayed update year).
- Official URL: https://www.cancer.gov/types/breast/breast-cancer-types/paget-disease-breast
- Accessed: 2026-09-28. Source class/authority: government cancer information.
- License/reuse: NCI reuse policy applies; targeted factual verification only,
  no prose/images copied and no blanket license asserted for third-party material.
- Intended use: distinguish nipple skin sampling from ultrasound guidance, not
  teach a new diagnostic algorithm or assert a real procedure duration.
- Supported claim: claim.room-expansion.nipple-skin-sampling.

### source.room-expansion.gist.2020

- Citation: PDQ Adult Treatment Editorial Board. *PDQ Gastrointestinal Stromal
  Tumors Treatment (Adult), Patient Version*. Bethesda, MD: National Cancer
  Institute. Updated August 28, 2020. PMID 26389367.
- Author/organization: PDQ Adult Treatment Editorial Board / National Cancer
  Institute. Publication year: 2020 (displayed update year).
- Official URL: https://www.cancer.gov/types/soft-tissue-sarcoma/patient/gist-treatment-pdq
- Accessed: 2026-09-28. Source class/authority: government-hosted expert-board
  cancer evidence summary, not a formal management guideline.
- License/reuse: page permits PDQ text reuse subject to identification conditions;
  images have separate rights. Only factual synthesis used here, no text/images
  copied. No reuse claim made for linked third-party material.
- Intended use: distinguish endoscopic ultrasound-guided sampling from a routine
  transcutaneous ultrasound room scan. No management recommendation or timing.
- Supported claim: claim.room-expansion.gist-endoscopic-sampling.

### source.room-expansion.breath.2022

- Citation/author/organization: National Institute of Diabetes and Digestive and
  Kidney Diseases. *Diagnosis of Peptic Ulcers (Stomach or Duodenal Ulcers)*.
  Reviewed September 2022. Corporate author, no individual author listed.
- Publication year: 2022 (displayed review year).
- Official URL: https://www.niddk.nih.gov/health-information/digestive-diseases/peptic-ulcers-stomach-ulcers/diagnosis
- Accessed: 2026-09-28. Source class/authority: US government patient information.
- License/reuse: government-authored information; targeted factual verification
  only, no prose/images copied; no third-party reuse rights inferred.
- Intended use: distinguish breath specimen collection from blood collection;
  not a recommendation about when to test or a real-world timing claim.
- Supported claim: claim.room-expansion.urea-breath-specimen.

### source.room-expansion.abi.2022

- Citation/author/organization: National Heart, Lung, and Blood Institute.
  *Peripheral Artery Disease: Diagnosis*. Updated March 24, 2022. Corporate author,
  no individual author listed. Publication year: 2022 (displayed update year).
- Official URL: https://www.nhlbi.nih.gov/health/peripheral-artery-disease/diagnosis
- Accessed: 2026-09-28. Source class/authority: US government patient information.
- License/reuse: government-authored information; targeted factual verification
  only, no prose/images copied; no third-party reuse rights inferred.
- Intended use: verify equipment distinction for ABI acquisition; no thresholds,
  treatment recommendations, or clinical timing copied into the game.
- Supported claim: claim.room-expansion.abi-equipment.

## Atomic evidence claims

| Stable ID | Independently synthesized claim | Source | Evidence category / limitation | Checked | Review status |
| --- | --- | --- | --- | --- | --- |
| claim.room-expansion.contrast-swallow-fluoroscopy | Barium contrast assessment of swallowing uses fluoroscopic X-ray imaging. | source.room-expansion.upper-gi.2024 | Procedure description; one society source, no management recommendation. | 2026-09-28 | needs_clinician_review |
| claim.room-expansion.endoanal-probe | Endoanal ultrasound images the anal sphincter region using a probe introduced into the anal canal. | source.room-expansion.endoanal.2025 | Procedure description; one provider source, not evidence of biopsy capability. | 2026-09-28 | needs_clinician_review |
| claim.room-expansion.nipple-skin-sampling | Nipple-areolar skin can be sampled with a skin-biopsy technique. | source.room-expansion.paget.2025 | Procedure description; one government source, no automatic ultrasound guidance implied. | 2026-09-28 | needs_clinician_review |
| claim.room-expansion.gist-endoscopic-sampling | Endoscopic ultrasound can guide tissue sampling of a gastrointestinal stromal tumor. | source.room-expansion.gist.2020 | Procedure description; single source last updated 2020, no preference or treatment recommendation inferred. | 2026-09-28 | needs_clinician_review |
| claim.room-expansion.urea-breath-specimen | A urea breath test analyzes exhaled breath collected after administration of labeled urea. | source.room-expansion.breath.2022 | Procedure description; one government source, not a blood test or an immediate post-treatment test. | 2026-09-28 | needs_clinician_review |
| claim.room-expansion.abi-equipment | ABI acquisition compares limb blood pressures using cuffs and an ultrasound device. | source.room-expansion.abi.2022 | Equipment description; one government source, no clinical thresholds inferred. | 2026-09-28 | needs_clinician_review |

## Simulation constraints

Treat fluoroscopy and the endoanal probe as explicit capabilities bundled into
the respective prototype rooms for these exact owner-requested routes. Shared
imaging-technician animation is a simulation staffing abstraction, not a statement
of real-world credentialing or supervision. Reuse editorial timing policy rather
than claiming sourced real duration. Existing procedure fees remain approved
game values. An endoanal scan does not imply a tissue biopsy was performed.

Do not route all biopsy labels to ultrasound. Existing exact guided breast/core
and thyroid-FNA routes remain appropriate implementation precedents. Mixed
biopsy/CT/MRI or mammography/ultrasound workups must preserve unperformed/external
components and their result gates if local acquisition is added. Reflux monitoring
must not become a generic procedure-room stay.

Broader collection-room support for breath kits and ultrasound-room support for
ABI cuffs are explicit prototype equipment abstractions. Display breath
collection, not blood draw, for breath testing. Preserve delayed test-of-cure
plans as future work, not immediate repeat testing. Rectal response assessment
may use its explicitly authored endoscopy component locally while keeping MRI
and the remaining assessment external; this adds no new clinical indication.
