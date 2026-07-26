# Clinical Data Directories

- `public/` contains deliberately public-safe registries or project-owned
  examples. Validate these with the `--public-safe` guardrails.
- `templates/` contains blank starting structures.
- `private/`, `imports/`, and `exports/` are ignored working areas and must not
  be committed.

Raw textbooks, commercial question-bank text, PHI, private source excerpts,
signed download links, and credentials never belong in a tracked directory.
The recommended local working directory is `.clinical-workbench/`.

Use `npm run clinical:workbook:init` to create the ignored schema-v2
manual-authoring CSV interchange subset with staged, no-clobber writes. These
CSVs validate the initial import contract; they do not author extraction
batches, AI suggestions, patient/question records, or releases, and they are
not the final owner-facing Google Sheet. Use
`npm run clinical:fingerprint-source -- <path>` to calculate an exact checksum
without copying the source into this repository.
