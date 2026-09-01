# Repository instructions

## Clinical-content safety and provenance

Clinical content in this repository is software content, not medical advice. New
AI-assisted diagnoses, phenotypes, evidence claims, concepts, question variants,
explanations, and chart summaries must remain `needs_clinician_review` until a
named clinician explicitly approves a version. Automated tests are not clinical
approval. Draft content may be exposed only through the owner/development
preview or an explicitly unapproved prototype release.

Keep educational tier, patient acuity, facility capability, and facility
progression level as separate fields. Clinical relationships and editorial
simulation weights must also remain separate. Do not use race or ethnicity as a
disease-selection variable. Do not invent exact probabilities, thresholds,
timelines, medication rules, or demographic weights; an exact value requires a
source that directly supports that exact value.

### Source restrictions

Do not:

- upload, read, ingest, scrape, or commit proprietary textbook PDFs;
- use UpToDate, AccessSurgery, commercial question banks, paid review products,
  proprietary SCORE modules, or recalled ABSITE questions as a corpus;
- copy or closely paraphrase source prose;
- copy tables, figures, algorithms, illustrations, question stems, or answer
  explanations;
- store full article text or source excerpts in the repository;
- treat a citation as permission to copy;
- treat public web access as permission for AI ingestion when a site's terms
  prohibit automated or AI use;
- assume PubMed Central availability grants reusable rights;
- rely on inaccessible or paywalled search-result snippets; or
- create placeholder citations.

Permitted work includes reading current government guidance, suitably licensed
open-access articles, and professional-society guidelines; extracting underlying
medical facts; independently synthesizing short original statements; and
storing bibliographic metadata, atomic claim mappings, reuse status, and
external links. Copyrighted society guidance may be used for targeted factual
verification and citation without reproducing protected expression. Follow all
attribution requirements for Creative Commons material.

Every source record must include a stable ID, complete citation, organization or
journal, authors when applicable, publication year, DOI or official URL, access
date, source class, license/reuse status, intended evidence or cross-check use,
and the supported evidence-claim IDs. Record medical authority separately from
license permissiveness.

Every substantive clinical statement must be represented by an atomic,
independently written evidence claim with a stable ID, supporting source IDs,
evidence category, certainty or limitation, last-checked date, and clinical
review status. Prefer a current guideline plus an independent source for
management claims. If only one adequate source exists, record that limitation.
If adequate sources conflict, preserve the disagreement and withhold the
disputed teaching point for clinician review instead of averaging or guessing.

External clinical links must open safely in a new tab. Do not retrieve web
content or call an AI model during gameplay.

### Change discipline

Preserve stable concept IDs when only patient details or question wording
change so FSRS history remains attached to the intended concept. Create a new
concept version when the underlying clinical meaning changes materially. Keep
new clinical data replaceable without rewriting the patient generator, preserve
existing frozen encounters and saves, and do not silently promote draft content
into an approved public release.

### Question-authoring presentation

Runtime answer choices must be randomized. A review artifact may show the key
first only when it explicitly says so. Straightforward single-best-answer
options must use parallel grammar, comparable specificity and length, and the
same semantic category; do not use odd-one-out qualifiers or explanatory
distractor wording that reveals the key.

<!-- BEGIN BOUNDED_THREAD_LIFECYCLE -->
## Bounded thread lifecycle

Prefer one specific bounded task per Codex thread. When that task is completed
and validated, update `docs/handoffs/CURRENT_THREAD_HANDOFF.md`, close the
thread, and start a new thread for the next distinct task. A new thread must
read the handoff and inspect the dirty working tree before editing.

Do not abandon active atomic work or split one unfinished bounded task merely
because a thread is old. The user may explicitly override this lifecycle when
they want a continuous or differently scoped thread.

### GitHub checkpoint backups

Treat the completion of a substantial validated milestone, a broad integrated
prototype checkpoint, or another materially valuable worktree state as a
GitHub-backup checkpoint. Do not leave such a checkpoint only in the local
working tree without explicitly calling that out to the user. At the checkpoint,
remind the user to say **"push to GitHub"** so the backup can be created.

After that explicit direction, inspect the scoped diff and repository status,
perform the applicable source, secret, privacy, generated-asset, and clinical-
content safety checks, create an appropriately described checkpoint commit,
push the current branch to GitHub, and verify the remote branch contains the
commit. Never use broad staging until the audit establishes that every included
path belongs in the checkpoint. Never include ignored/private clinical inputs,
credentials, proprietary sources, or unrelated user work.

A GitHub backup push does not authorize a merge, release, deployment, Pages
publication, history rewrite, or deletion. Record the pushed branch and commit
in `docs/handoffs/CURRENT_THREAD_HANDOFF.md`. If a safe push is blocked, report
the blocker and leave an exact recovery action rather than implying that a
backup exists.
<!-- END BOUNDED_THREAD_LIFECYCLE -->
