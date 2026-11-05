# Flags2 round two and exact G06 acceptance

## Goal and authority

Implement the manager decision after `question-flags2-review-20261105.json`:
accept the exact G06 PASS if its key has no source hold; revise G01, G02, G03,
G05, G05-staging and G07; write G04-R as a harder replacement pregnancy decision.
Keep the original G04 live until the replacement passes independent review and
the manager accepts it. Directly bind G03 to the flagged live v1, not B2B36.
Every new clinical version remains `needs_clinician_review`.

## Ownership and constraints

Own new `question-flags2-round2-*` clinical modules/tests and offline tooling,
source/claim ledger, packet and handoff; minimal index exports; the existing
source-view/concept/timing integration strictly necessary for G06; one G06
acceptance and its exact reviewed header binding in the manifest. Preserve every
other acceptance row and all N3 hunks/files. Do not rewrite round-one definitions
or its PASS version. Any historical test must keep checking its retained stage,
with explicit current G06 acceptance checked separately.

No Git, installs, network, agents, external messages, release/deploy, session/
cloud/Supabase, selectors/routing, Level 5 evidence/pins or N3 timing-count repair.
Shared files require bounded hunks and byte-preservation receipts. No retirement,
FSRS transfer, source access-date refresh or clinical approval is implied.

## Method and acceptance

Capture exact live/source versions, prior packets, review notes, claims, metadata
and hashes before editing. Reuse adequately recorded atomic facts offline; mark
extensions/uncertain ranking with an explicit source hold. No accepted key may
have a hold. Write a per-note response, full visible-history self-check, deciding
finding, closest credible error and counterfactual for every new item.

Use concrete findings and three/four specific, parallel, same-stage actions.
Default to a consequential interpretation then decision; no named omissions,
pre-answer rationale, uniquely cautious key or sham second step. Preserve named
patients, bound ages/sexes, short complaints, randomized choices, exact historical
identities and wait metadata. Review the PHPT pair together and prevent a DXA
result from becoming permission to start operative consultation.

Regenerate `question-flags2-round2-20261105.json` with key first explicitly for
review only, rationale pairs, indexed note responses, evidence/holds, rubric and
lint before/after. Require zero cue findings across new canonical and finite
profiles, including earlier feedback. Do not suppress rules to achieve zero.

## Validation and handoff

Use `--pool=threads --maxWorkers=2` for focused clinical tests (old retained view,
round-two view and G06 manifest/composition/timing), cue-linter tests and clinical-
content typecheck. Report exact native counts; broad suites remain shared-tree
integration receipts rather than permission to change N3. Record exact files,
source holds, G04 retirement condition and Level 5 bound inputs in
`question-flags2-round2-handoff-20261105.md`, plus the G06 manager-decision doc
and current-thread handoff. STOP for independent review of new versions.

## Progress

- Read AGENTS, current handoff, standard, integration contract and every review
  note. G06's table arithmetic has no key hold and must remain exact.
- Captured immutable live/round-one versions, exact question metadata, review,
  sources/claims, timing and file hashes before editing. Direct G03 uses live v1;
  original G04 is preserved. All old G06/PASS runtime and packet artifacts remain
  byte-exact; historical tests now assert its explicit manager acceptance.
- Wrote seven new exact versions and seven changed-objective concept versions,
  with twenty atomic mappings. Every one of the 86 returned notes has an indexed
  response. Manual rubric includes the data that change the decision, closest
  credible errors and counterfactuals. The PHPT self-check rejected an ambiguous
  operative comparison; the final version tests the supported inherited-calcium
  differential before localization, with referral preceding skeletal results.
- Added only G06's one acceptance and its matching reviewed header pin. The
  necessary retained-view/concept/no-test-timing integration preserves all other
  rows and shared/N3 bytes. Default live changes exactly one case and adds one
  history card; all earlier concepts survive. No new draft enters live play.
- New cue findings: three before to zero after over seven variants/31 contexts;
  the initial authoring pass's four findings were repaired in wording/matrix
  labels without changing the linter. G04-R has three same-day diagnostic plans
  instead of assay-recognition foils or an only-urgent key.
- Sources: nineteen recorded records/eighteen DOI-or-URL publication identities;
  original dates, rights and authority metadata checked unchanged. Five actual
  keyed-extension holds: G01, G02, G04-R, G05-staging and G07. G03 and G05 apply
  supported recorded claims with clinical review still required. G06 has no key
  hold. No fresh retrieval or new independent corroboration.
- Final focused clinical 80/80 in five files, cue-linter 33/33 and clinical-content
  typecheck all pass (native exit 0); Vitest threads/maxWorkers2. No new broad-
  suite/whole-tree-green claim. An initial test-only union-narrowing type error
  was corrected before the final run. N3's count work is preserved.
- Packet, source ledger, exact G06 decision, full handoff, scope/integration and
  validation receipts written. Four changed existing bound runtime inputs and
  five new runtime dependencies listed with exact hashes. No Level 5 rebind,
  deployment or Git operation. STOP at independent-review gate; manager owns
  the next review/source resolution and conditional G04 retirement/merge.
