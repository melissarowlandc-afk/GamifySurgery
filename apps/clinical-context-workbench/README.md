# Clinical Context Workbench

This is a local-only research triage surface. Its Vite development server binds
to `127.0.0.1:4174` and mounts a same-origin Node API. It has no build, preview,
publishing, source-file selection, external-AI, or deployment command.

From the repository root, use the launcher for the install/open loop:

```sh
START_CLINICAL_WORKBENCH.cmd
```

Or run the individual commands:

```sh
npm run dev --workspace @gamify-surgery/clinical-context-workbench
npm run test --workspace @gamify-surgery/clinical-context-workbench
npm run typecheck --workspace @gamify-surgery/clinical-context-workbench
```

Validated revisions are stored outside this application under the already
ignored `.clinical-workbench/context-workbench/` directory. Raw clinical source
material does not belong in the workbench workspace document.

Private intake uses a 25 MiB per-source pilot limit for both inbox scanning and
local extraction. Source hashes remain private integrity metadata and are not
returned to the browser. Queue refreshes are lightweight; use **Run deep
integrity audit** to rehash all retained extraction artifacts. Image-only PDFs
show `ocr_required` and remain action-required.

Default PDF/DOCX parsing runs in an isolated worker with a 45-second deadline,
V8 heap/stack limits, and hard page, block, and extracted-character caps.
This protects the Workbench event loop but is not an operating-system malware
sandbox. Use the bounded one-chapter pilot and trusted, legitimately obtained
files before attempting broader batches.

Metadata scouting is disabled until the trusted Node process receives a valid
`CLINICAL_SCOUT_CONTACT_EMAIL`. `CLINICAL_SCOUT_AUTO=false` disables due-run
automation while retaining the explicit Scout action; `NCBI_API_KEY` is
optional. These values remain server-side and are never returned by the API.

Manual review records use the server-side
`CLINICAL_WORKBENCH_REVIEWER_ID`/`CLINICAL_WORKBENCH_REVIEWER_ROLE` profile.
The default is a stable single-user owner identity; configure distinct IDs
before more than one person records decisions. Only an `owner` or
`clinical_reviewer` may accept Expert Opinion into Known; all other configured
roles are blocked from that action server-side even if they construct a command
manually.
Repeated DOI, PMID, exact
provider-record, or exact manual-metadata matches reuse one Candidate while
preserving immutable per-search observations and per-gap screening.
