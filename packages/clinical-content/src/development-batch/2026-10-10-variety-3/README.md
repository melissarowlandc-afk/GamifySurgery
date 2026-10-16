# Variety-3 standalone development batch - 2026-10-10

Ten new adult concepts, two variants each: 20 one-decision cases, 35 atomic claims,
19 sources and 20 companion timing entries. Every authored record remains
`needs_clinician_review`; agent checks and automated tests are not clinical approval.
The batch is not registered in the runtime release, global exports, generator or
global timing registry. No release, deployment, Git checkpoint or new clinical
setting is authorized by this batch.

| Existing-level lane | Concepts | Cases | Topics |
| --- | ---: | ---: | --- |
| L1 clinic | 4 | 8 | Rectus diastasis; epidermoid cyst; thrombosed external hemorrhoid; pruritus ani |
| L2 clinic / outside endoscopy planning | 4 | 8 | Inadequate preparation; small-polyp cold snare; nondysplastic Barrett; sedation transport/support |
| L3 clinic / outside ASC preparation | 2 | 4 | Penicillin-label history; non-genital surgical hair preparation |

These existing lanes also broaden Level 4 through normal progression after
manager admission. Level 5 adds no clinical setting. Stage, educational tier,
patient acuity and required capabilities are separate fields. All cases are
clinic recognition/counseling or review of outside care; none executes a procedure
or produces a test result. No facility capability or patient-generator change is
needed to review the draft.

The record and companion-envelope shapes follow the accepted pediatric batch:
authoring/tested concepts, questions, runtime-shaped cases, case reviews,
adult identity contexts, field-level statement mappings, timing entries, sources,
claims, safe external links, exclusions and an unauthorized-admission manifest.
Adult context fields replace the pediatric child/parent fields. Constrained
profiles match the authored adult roster and currently admitted art registry;
their age/sex/name combinations must remain intact at any future assembly.
The legacy `approvedInstantiationProfiles` field is a schema name, not approval.
All ten concepts have new meanings and stable `concept.variety3.*` IDs.

Chief complaints contain 1-5 words. Every presentation starts with its named
patient, age and sex. Each task is complete; each choice has a rationale and
evidence mapping. Review order is explicitly key first; runtime-shaped nodes
shuffle all choices. No key is uniquely longest by JavaScript string length.

Eight timing entries classify test/procedure choices and all their distractors;
twelve classify no testing. Existing hooks are `timing.test.lower_endoscopy`,
`basic_labs`, `ct`, `clinical_procedure` and `endoscopy_with_sampling` (each uses
the full `timing.test.` prefix). They are presentation hooks for future admission,
not executable service requests. Generic laboratory/procedure profiles are
deliberately coarse existing placeholders. The timing design remains governed by
`docs/features/diagnostic-timing-future-design.md`; no wait duration appears in
authored case prose. Manager assembly must admit timing entries with cases.

Sources were actually read through eligible official HTML/PDF or licensed Europe
PMC XML for targeted verification. Full citations, authors, date context, rights,
authority, use and reciprocal claim IDs are in `source-catalog.ts`. Claims in
`evidence-claims.ts` are independently worded, atomic and dated. Public access,
PMC availability and medical authority are not treated as reuse permission.
No source full text, excerpts, tables, algorithms, proprietary PDF or question-bank
material was stored. NHS overdue review markers and undated ASCRS pages are
explicitly identified rather than assigned invented publication dates.

Small-polyp technique and hair preparation each have one adequate directly read
guideline; those limitations stay attached to the claims. No direct second source
is claimed for the Barrett no-prophylactic-ablation rule or the complete adult
post-gastroscopy support arrangement. Current independent material corroborates
the broader surveillance and driving boundaries. Management claims based on
patient education are identified as such rather than called formal guidelines.

Withheld: a universal pruritus soap rule; mandatory same/next-day repeat scheduling;
universal cefazolin choice;
automatic delabeling/testing/challenge protocols; hemorrhoid procedural timing;
fixed Barrett/recovery schedules; and genital/scrotal hair-preparation rules.
Rights/access exclusions for NICE, ASA and inaccessible independent polypectomy/
hair material are recorded separately from clinical disagreement. All ten gap
topics were adequately sourced; none needed replacement.

Contains public sector information licensed under the Open Government Licence
v3.0 where applicable to NHS website material. Hernández-Granados et al. (2021)
is credited under CC BY-NC 4.0; Sexton and Kuruvilla (2024) and Calderwood et al.
(2023) under CC BY 4.0. Hoang et al. (2019) has CC BY-NC-ND 4.0; only underlying
facts were checked and no article adaptation is distributed. Full DOI/license
links and author credits are in the catalog and generated review artifact. Source
figures, third-party material and logos are excluded. Source: CDC and NIDDK/NIH
for their respective underlying guidance. Attribution and links do not imply
endorsement by those agencies, HHS, the United States Government, NHS or societies.

Generate all 20 exact-export review samples from the repository root:

```powershell
node packages/clinical-content/src/development-batch/2026-10-10-variety-3/generate-samples.mjs
```

Required validation from the root, using the existing sandbox preload:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/clinical-content -- src/development-batch/2026-10-10-variety-3 --pool=threads --maxWorkers=1
npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=1
npm.cmd run typecheck
```

The local runtime-guard test validates draft-plus-release copies of both synthetic
and pilot releases, checks no added longest-key violations, and leaves global
registration and the existing approved exception list untouched. Exact completed
output is recorded in the requested owner-request section after validation.

Validated 2026-10-10: batch **2 files / 17 tests passed**; complete clinical-content
suite **86 files / 625 tests passed**, including the unchanged runtime longest-key
guard and local draft-plus-release checks; root `npm.cmd run typecheck` **exit 0**.
All 337 pre-existing clinical-content files match the intake hashes. New batch and
handoff files are UTF-8 without BOM and LF. No additional testing or runtime
registration is needed to review this standalone draft.

Handoff artifacts: `docs/handoffs/CONCEPT_COVERAGE_AUDIT_20261010.md` (pre-batch
snapshot) and `docs/handoffs/VARIETY3_BATCH_SAMPLES.md` (all 20 variants, explicit
key-first notice, claim/source appendix). Manager review/acceptance, runtime
assembly, named clinician review and GitHub backup remain separate steps.
