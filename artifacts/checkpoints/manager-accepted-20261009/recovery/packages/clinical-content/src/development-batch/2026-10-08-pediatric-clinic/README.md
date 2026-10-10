# Pediatric clinic draft - 2026-10-08

Standalone manager-review batch: **10 objectives, 20 variants**, ages 5-17,
one named parent in the same room throughout each outpatient visit. There are
nine new objective IDs and two new pediatric variants of the unchanged
`concept.umbilical-epigastric-hernia.clinical-recognition` objective. Preserve that
existing FSRS identity when assembling; deduplicate its tested-concept record.

Every authoring record is `needs_clinician_review`. Source institutions' own
approval dates and the agent's editorial checks do not approve this batch.
Runtime-shaped cases and tested concepts have the same companion review records
as accepted development batches. Legacy `approvedInstantiationProfiles` names
are structural schema names, not clinical sign-off.

Each case has one exact child profile, named child and parent, age/sex, short
chief complaint, complete task, teaching point and four explained choices.
Authoring arrays are **key first for review only**. Every runtime node has
`shuffleAnswers: true`. No tests, timing durations, sedation, pediatric MRI,
procedure/recovery services, invented vitals, epidemiologic weights or racial
selection variables are authored. Referral options do not enact procedures.

`familyContexts` maps each profile to authored art age/sex metadata in
`tools/character-mapping/level3-roster-complete-v2/roster.json`. It is a draft
assembly contract, not a change to the blocked pediatric art catalog or a
runtime family model. Clinical statements map to independently worded atomic
claims at presentation, stem, explanation, teaching-point and individual-choice
level. Fictional names, matching ages and family placement are editorial fields;
they are not epidemiologic claims. All choices have an explicit `no_test`
classification and no service request, including distractors.

`pediatricDraftCaseSchema` preserves the shared strict case checks and narrows
the stage to exactly 4 locally. At the initial read, the shared case schema
stopped at 3. Concurrent foundation edits now admit 4 and introduce
`pediatric-patient-profile.v1`; each draft case and constrained profile uses
that explicit parent-required outpatient marker. The separate foundation and
family-placement milestone still needs manager acceptance before assembly.
This folder is not imported into `src/index.ts`, active releases,
global timing or patient-generation code. No gameplay fetch or AI call is added.

The twelve source records contain complete citations, authors, dates, DOI or
official link, access date, actual rights status, intended use, separate medical
authority assessment and reverse claim mapping. Only facts were verified;
source prose, full text, algorithms, tables and clinical vignettes were not saved
or reproduced. Safe external-link metadata uses `_blank` and
`noopener noreferrer`. CC BY attribution is retained for Metzger et al.; the
Scalise/Demehri article's actual **CC BY-NC-ND 4.0** license is recorded
conservatively, with no article adaptation or unrestricted reuse claim. NHS
website attribution: Contains public sector information licensed under the
Open Government Licence v3.0. Institution logos and source images are excluded.

Source gaps and disagreements are explicit in `evidence-claims.ts`: umbilical
repair ages and high/persistently-retractile terminology are withheld; the
retractile questions use a strictly defined examination phenotype. Varicocele,
hydrocele, exact pilonidal regimens, pectus operative thresholds/outcome promises,
adolescent confidentiality/legal consent, and pediatric testing/procedure flows
are deferred. Some narrow objectives have only one adequate eligible management
source; every affected claim records this limitation. ACS, EAU, RCH Melbourne
and an unresolved BMJ candidate are excluded from evidence. No paywalled snippet
or placeholder citation substitutes for an eligible read.

Review examples live in `docs/handoffs/PEDIATRIC_BATCH_SAMPLES.md`, one per
objective with key-first ordering explicitly labelled. Regenerate them from the
actual exports with:

```powershell
node packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/generate-samples.mjs
```

The generator uses Node's built-in TypeScript stripping, writes disposable compiled
modules only under `.local-dev/pediatric-clinic-20261008/`, and writes the owned
samples artifact. It does not install, fetch, or assemble an active release.

```powershell
npm.cmd run test --workspace @gamify-surgery/clinical-content -- src/development-batch/2026-10-08-pediatric-clinic --pool=threads --maxWorkers=1
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=1
npm.cmd run typecheck
```

The manager owns admission, integration, shared handoff and checkpoint decisions.
This worker performs no Git operation; files remain a local draft until a
separately authorized backup. At manager acceptance, remind the owner to say
**"push to GitHub"** for the scoped checkpoint.
