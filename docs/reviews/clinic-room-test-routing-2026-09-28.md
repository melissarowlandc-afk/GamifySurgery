# Clinic room test routing — September 28, 2026

Implemented and validated locally for owner preview; acceptance is tracked in
`docs/execplans/clinic-economy-names-test-expansion.md`. This extends completed
GS-023 order execution rather than replacing it. Clinical stems, answer keys,
concept identities and question rewards are unchanged.

## Additional direct routes

Fees and room-work minutes are editorial game values, not clinical billing or
real-world procedure duration. Outside interpretation/processing and travel may
add waiting beyond the listed room work. Existing orders retain their quotes.

| Exact test family | Current correct choices | Room | Room work | Fee |
| --- | ---: | --- | ---: | ---: |
| Zenker contrast/barium swallow | 4 | X-ray, with bundled fluoroscopy | 60 min | $90 |
| Endoanal ultrasound | 4 terminal choices | Ultrasound, with endoanal probe | 45 min | $120 |
| Resting ankle-brachial index | 8 | Ultrasound, with cuff/Doppler equipment | 45 min | $120 |
| Initial diagnostic urea breath test | 4 | Specimen station, with breath kit | 15 min | $50 |
| Nipple-areolar punch biopsy | 4 | Minor Procedure; external pathology | 15 min | $150 |

Breath collection is not labeled as a blood draw. Delayed H. pylori test-of-cure
orders remain future plans. Endoanal ultrasound is a scan, not a biopsy.

## Local parts of combined workups

| Authored combined order | Correct choices | Local work / fee | Remaining work |
| --- | ---: | --- | --- |
| Anal-lesion biopsy and staging | 4 | CT, 60 min / $180 | Biopsy, pathology and pelvic MRI external |
| Diagnostic mammography and targeted Doppler ultrasound | 2 | Ultrasound, 45 min / $120 | Mammography external |
| GIST EUS core biopsy and molecular testing | 4 | Advanced endoscopy + recovery, 75 + 45 min / $600 | External pathology/molecular processing; no extra patient trip for processing |
| DRE, endoscopy and rectal MRI response assessment | 4 | Endoscopy + recovery, 75 + 45 min / $450 | MRI and remaining assessment external |

Local components execute before the remaining result gate. Busy local resources
queue; absent local capability leaves that work in the external workflow. A
local fee pays only after its work completes. Returning to Front Desk precedes
the next component or outside visit. The original authored result and next
question remain gated; local ultrasound cannot count as a completed mammogram.

## Coverage retained from completed GS-023 work

Existing exact mappings already cover routine US/X-ray/CT, CT angiography,
venous duplex, blood collection/genetic/serology/aldosterone testing, breast
core/FNA/guided aspiration, approved office procedures, and supported routine
endoscopy/biopsies. Correct final and single-question orders continue to hold
patients for local acquisition and pay once before final departure. Existing
terminal breast-imaging bundles already perform their supported ultrasound
component and record the external remainder.

The active content audit includes 1,181 timed answer choices. Execution remains
bound to exact case, question, choice label and service metadata; a shared word
such as biopsy or ultrasound does not justify a generic room visit. Existing
incorrect-answer/corrected-forward behavior is preserved.

## Explicit limits

- No MRI, mammography, dedicated DXA or nuclear-medicine equipment is added.
- Reflux monitoring, manometry, specialist laryngeal work and defecography keep
  their distinct external workflows; none becomes a generic procedure visitor.
- Existing-tissue molecular/IHC tests do not create a fictional blood draw.
- Future surveillance, overnight protocols and delayed testing do not execute
  immediately simply because a room is built.
- Specialist-planned sarcoma biopsy, Mohs/definitive cancer surgery, therapeutic
  ERCP/drainage and acute endoscopic hemostasis are not silently reclassified as
  routine diagnostic tests in this milestone.
- The current anal-cancer question does not explicitly order an ultrasound-guided
  anal biopsy. Its CT component can be local; its biopsy is not relabeled as US.
  Existing explicitly guided breast/core/FNA procedures continue to use US.

Equipment assumptions and atomic source claims are recorded in
`diagnostic-room-expansion-evidence-2026-09-28.md`. New AI-assisted mapping claims
remain `needs_clinician_review`; these are owner/development preview changes,
not a public clinical-content approval or release.
