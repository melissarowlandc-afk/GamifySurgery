# Clinical Data Directories

- `public/` contains deliberately public-safe registries or project-owned
  examples. Validate these with the `--public-safe` guardrails.
- `templates/` contains blank starting structures.
- `private/`, `imports/`, and `exports/` are ignored working areas and must not
  be committed.

Raw textbooks, commercial question-bank text, PHI, private source excerpts,
signed download links, and credentials never belong in a tracked directory.
Place legitimately obtained raw source files only in the fixed ignored
`.private-clinical-data/` intake tree. Canonical Workbench state, immutable
extraction artifacts, metadata-provider artifacts, and private authoring output
belong under the ignored `.clinical-workbench/` tree.

`public/clinical-release-points.json` is the machine-readable accepted
release-point vocabulary for owner intake and future authoring validation. It
contains game-design metadata only and does not admit any clinical content to a
runtime release.

Use `npm run clinical:workbook:init` to create the ignored schema-v2
manual-authoring CSV interchange subset with staged, no-clobber writes. These
CSVs validate the initial import contract; they do not author extraction
batches, AI suggestions, patient/question records, or releases, and they are
not the final owner-facing Google Sheet. Use
`npm run clinical:fingerprint-source -- <path>` to calculate an exact checksum
without copying the source into this repository.

The local Clinical Context Workbench is an evidence-review sidecar rather than
a public clinical-data directory. Start it with
`START_CLINICAL_WORKBENCH.cmd` or `npm run clinical:context`. It keeps
bibliographic search candidates distinct from reviewed evidence, enforces
operation-specific rights, and sends only reviewed proposals—not raw source
text—toward the clinical-authoring workspace.
