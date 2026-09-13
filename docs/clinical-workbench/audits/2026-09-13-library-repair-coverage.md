# Implemented patient-library wording repair — 2026-09-13

## Scope and result

The repair reviewed the active library assembled on September 13: 123 concepts,
298 cases, 463 decision nodes, 664 approved instantiation profiles, and 962 base
or profile presentations. The exact pre-repair runtime release is retained in
the ignored local snapshot `.local-dev/patient-library-before-root-2026-09-13.json`.
The prior random-patient audit remains an unchanged historical snapshot.

The implementation contains one literal before/after binding for every case and
every approved profile. Runtime assembly rejects duplicate, missing, stale,
variant-mismatched, or source-drifted bindings. It does not use a generic runtime
regex rewrite. Fine existing named prose remains byte-for-byte unchanged.

All 298 cases now have a one-to-five-word chief-complaint symptom, question, or
visit-reason phrase. Before repair, 45 cases had no complaint and 244 of the 253
existing complaints exceeded five words. All 962 base and profile presentations
now identify the runtime patient through `{patientName}`; 126 base presentations
and 30 profile presentations changed, while already suitable named prose stayed
unchanged. No repaired presentation opens with `A patient`, `An adult`, or
`Patient with`.

All 463 decision stems remain complete questions. One stem changed:
`case.anal-hsil.hpv.3b` / `node.anal-hsil.hpv.3b` /
`question.anal-hsil.hpv.3b.v1` now asks, “Which virus is etiologically linked to
this dysplastic lesion?” The presentation now brings `{patientName}` back to
clinic for follow-up of documented anal HSIL. The concept ID, answers, key,
routes, gates, and explanation are unchanged.

Every repaired case carries independent v3 AI-assisted wording metadata with
`needs_clinician_review`, `lastClinicianReview: null`, and exact bindings for
each changed base presentation, profile presentation, or decision stem. The
release remains `synthetic_unapproved_prototype`; this audit and automated tests
do not constitute clinical approval.

## Representative corrections

| Field | Before | After |
| --- | --- | --- |
| Chief complaint | `I found a new breast lump that is uncomfortable.` | `Breast lump` |
| Missing chief complaint | none for the colonic-lipoma encounter | `Colonic lesion` |
| Named presentation | `A 27-year-old with repeatedly mild hypercalcemia...` | `{patientName}, a 27-year-old with repeatedly mild hypercalcemia...` |
| Artificial report-profile prose | `A patient with an incidental gallbladder-polyp finding reviews possible completed ultrasound report profiles...` | `{patientName} had a recent ultrasound showing an incidental gallbladder polyp and comes to discuss the report with the clinic.` |
| HSIL presentation | `A patient has anal HSIL.` | `{patientName} returns to clinic for follow-up of documented anal HSIL.` |
| HSIL question | `Which answer is appropriate?` | `Which virus is etiologically linked to this dysplastic lesion?` |

The FHH stories retain the explicitly authored `27-year-old` and `young adult`
descriptions. All clinical details in changed presentations, including negative
findings, measurements, laboratory values, chronology, and profile-specific
findings, remain present. The invariant test compares every non-editorial field
against the pre-repair assembly and covers stable case/presentation/profile/node
identities, concepts, answers, keys, gates, routes, explanations, outcomes,
settings, capability requirements, reward tiers, source labels, and learning
summaries.

## Validation

- `npm test --workspace @gamify-surgery/clinical-content -- --run src/patient-library-wording-repair.test.ts src/patient-presentation-revisions.test.ts`: 2 files, 17 tests passed.
- `npm test --workspace @gamify-surgery/clinical-content`: 54 files, 339 tests passed.
- `npm run typecheck --workspace @gamify-surgery/clinical-content`: passed.

Machine-readable counts are in
`docs/clinical-workbench/audits/2026-09-13-library-repair-coverage.json`.

## Integrated identity and saved-chart verification

Terra implemented deterministic missing-demographic completion before name and
character generation. Specified ages and Female/Male labels are preserved;
missing or "Not specified" sex receives a consistent display value. Narrow
authored constraints cover FHH age 27 and young adulthood, the older pancreatic
cancer patient, the middle-aged bile-duct-cyst patient, and the vulvar-history
case. Characters match the resulting age band and sex. Compatible saved
identities and names remain stable across reloads.

Known old wording receives exact-match chart display corrections. Custom or
unrecognized text stays unchanged; frozen clinical facts, answers and progress
are not replaced. Root reviewed the implementation and independently compared
the entire final release with its pre-task snapshot, including numerical
findings and all unchanged question stems.

Full integrated checks passed: 339 clinical-content tests, 264 domain tests and
431 player tests (1,034 total), plus the build, workspace typechecks and runtime
boundaries. A final test-only adjustment permits short question-form complaints;
all seven targeted repair tests passed afterward.

Diagnostic wait values remain prototype estimates. The owner-requested future
design is in [Diagnostic timing future design](../../features/diagnostic-timing-future-design.md).
This repair has not selected facility-upgrade effects or changed timing values.
