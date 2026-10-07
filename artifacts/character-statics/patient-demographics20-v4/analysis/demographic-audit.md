# Current question demographics and next 20 still designs

This is software mix analysis for visual planning. It does not change questions, clinical review status, runtime selection or medical probabilities. The release remains `synthetic_unapproved_prototype`.

The current release has 311 declared concepts, 934 authored cases and 1215 decision nodes; 36 cases are employee discussions. There are 898 patient cases and 898 routine-eligible patient cases. The adult-patient catalog has 96 designs, including the 20 approved women in v3.

Recommended next batch: 5 male patients aged 30-44 and 2 female patients aged 45-64 and 7 male patients aged 45-64 and 3 female patients aged 65+ and 3 male patients aged 65+. Ages within each visual band are art briefs, not additional clinical constraints.

The table models a fully equipped Level 3 facility's first unseen routine encounter: uniform eligible primary concept, then uniform eligible case containing that concept, then uniform authored profile. It excludes employee discussions and honors stage/capability gates. Explicit demographics take priority; missing display values use existing runtime completion rules.

| Sex | Visual age band | Modeled encounter share | Current designs | Share per design |
|---|---|---:|---:|---:|
| Female | 18-29 | 2.83% | 9 | 0.31% |
| Male | 18-29 | 1.57% | 9 | 0.17% |
| Female | 30-44 | 17.60% | 21 | 0.84% |
| Male | 30-44 | 14.34% | 9 | 1.59% |
| Female | 45-64 | 21.57% | 19 | 1.14% |
| Male | 45-64 | 18.19% | 11 | 1.65% |
| Female | 65+ | 12.05% | 9 | 1.34% |
| Male | 65+ | 11.85% | 9 | 1.32% |

The 20 slots are assigned successively to the cell with the highest encounter share divided by available designs. Afterwards the allocated cells carry 1.02% per design (14 male 30-44 designs); 1.03% per design (21 female 45-64 designs); 1.01% per design (18 male 45-64 designs); 1.00% per design (12 female 65+ designs); 0.99% per design (12 male 65+ designs). Runtime occupancy/LRU rotation remains authoritative; this load proxy is not a measured repeat rate.

The JSON receipt separately records raw equal-case and equal-question comparisons, all-release comparison, fully equipped Levels 0–3, an endoscopy-capability sensitivity, per-concept case pools, demographic profiles and every source hash. It also checks the mirrored display rules against 25184 actual runtime completions and checks 256 actual selector results.

No authored patient profile is pediatric: 0 under-18 profile rows. The existing 12 pediatric designs remain future-only, excluded until a future approved pediatric release. No new pediatric art is needed for this current question mix.

This is a first-unseen planning snapshot. Actual encounters depend on active concepts, FSRS due dates, capabilities and separate tutorial/critical paths; it is not an exact campaign-long frequency prediction. Visual diversity is independent of disease and question selection.

The earlier women-v3 README described a smaller 856-case/291-concept snapshot and about 87.5% female encounters. The diagnostic section shows that ignoring approved profile overrides can reproduce that skew; actual runtime selects a profile before display completion. The current profile-aware model therefore takes precedence. Existing approved women remain useful and unchanged.

Run from the repository root with the installed Node runtime:

```text
node tools/character-mapping/patient-demographics20-v4/demographic-audit.mjs --check
```

Use `--write` to create or deliberately refresh the analysis receipt after reviewing a content/roster change. Vite runs in middleware mode without a network listener and closes before exit.
