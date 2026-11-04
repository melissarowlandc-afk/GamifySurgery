# Offline question quality tools

No new dependencies, network requests, player-data collection or build gates.
The source loader reads checked-in TypeScript; it does not build or rewrite it.
Run from the repository root in the existing source-loader environment;
validated here with Node 24.19.0.

```text
npm run clinical:lint -- --summary
npm run clinical:lint -- --json <local-output.json>
npm run clinical:lint -- --inventory docs/research/question-inventory-20261028.md
npm run clinical:lint:test
node --disable-warning=ExperimentalWarning tools/question-quality/review-round3-batch1-20261102.mjs
```

Without output flags, lint prints the full per-variant JSON report. Findings
include exact field text, offsets, choice IDs and occurrence/profile ranges.
Repeated contexts are grouped; rule counts are per variant, not per player or
verified clinical flaw. Scope includes the default assembled unapproved bank,
not archived authored siblings. Case count and variant count differ. Source
metadata gaps are explicit. Educational tier and facility entry stage are separate.

The [standard](../../docs/clinical/question-authoring-standard.md) uses reviewer
predictions for difficulty. Quality assurance combines the standard, advisory
cue lint, owner/clinician review and voluntary tester question flags.
No tool here collects or accepts per-question answer statistics. Do not use
saves, FSRS history or flag exports as analytics input. The cue JSON report is
about authored fields and wording only; it grants no clinical approval.

`fixtures/pilot-before-20261028.json` contains project-owned synthetic source
cases, provenance and original timing identities captured before the pilot.
It verifies the historical assembly and supports review of unchanged frozen
identities. `pilot-drafts-20261028.json` is the editorial draft worksheet; the
versioned TypeScript source is authoritative for runtime. Key shown first for
review only in both authoring artifacts; runtime shuffles. These fixtures have
no external article text or real-player data. The source-before fixture records
the scoped pre-edit bytes/hashes for a no-Git review.

`fixtures/manager-review-before-20261029.json` captures the 19 prior local
drafts, assembled cases/timings and scoped source hashes before the lead-in
review. The archived `.r2` TypeScript definitions retain those identities;
at that review, 16 drafts advanced to `.r3` and three retained `.r2`. The current TypeScript
definitions, not the earlier worksheet, are authoritative. All 19 were reviewed
for task cues and pre-answer teaching. **These pilot rewrites must remain in
the working tree and must not ship before owner review and clinician approval.**

Lexical heuristics deliberately expose evidence instead of making medical
judgments. The negative rule matches a term in a negated clause to exactly one
distractor, without inferring that the term clinically excludes it. The small
test-name alias list and lexical categories are transparent and incomplete.
Do not equate a clean report, a low warning count or passed tests with a fair
item, difficult item or clinician sign-off.

`lead-in-decision-principle` flags explicit safety, first-line, definitive,
sensitivity/specificity, gold-standard and tissue-preservation framing in the
task. These can be legitimate requested comparisons; review every warning.
`key-rationale-principle-cue` additionally requires complete explicit authored
per-choice reasons and a principle alias appearing only in the key's reason.
Missing or conflicting reasons disable that comparison, rather than imply
exclusivity. Report coverage in `variantsWithCompleteRationales`. Exact task
and post-answer metadata spans are reported separately; rationales never enter
the visible pre-answer overlap calculation. The old adrenal task is caught by
the broad rule, without falsely claiming its old rationales prove exclusivity.

The four revised keyed test identities have explicit domain bindings retaining
the old timing, routing and non-execution contracts. Original records remain for
frozen encounters. The [round-two handoff](../../docs/research/question-pilot-round2-handoff-20261029.md)
records integration validation and the Level 5 input-binding impact.

Both original and prior-local-draft timing/binding records remain. The four
then-current `.r3` keyed tests append exact contracts; no resolver or save format
changes. The spatial performance candidate from the earlier investigation was
declined for this milestone and remains unapplied. `spatial.ts` is untouched;
the three reproduced journey timeouts are pre-existing.

`compare-level-five-journeys.mjs` is a read-only diagnostic for the checked-in
synthetic Level 5 checkpoints. Run it after other test workloads finish:
`node --disable-warning=ExperimentalWarning tools/question-quality/compare-level-five-journeys.mjs`.
It compares pre-pilot/live trajectories and retains journey assertions. It has
no player-data input, collection, evidence-writing or test-timeout adjustment.

Owner round two is captured in `fixtures/owner-round1-before-20261029.json`.
The current source keeps all original/r2/owner-round-one identities available;
nine changed identities cover six returned tasks and three shared-context
companions. The eight owner-approved question drafts stay byte-equivalent as
authored questions, and all content still needs clinician review.

Round two appends exact `.r4` keyed-test bindings for A02 and A06-context;
their original and earlier draft records remain valid. The owner JSON and
40-variant batch proposal can be regenerated with `owner-round2-review.mjs`.
That generator reads synthetic authored content only and never rewrites the
proposed batch.

Linter v3 adds `case-detail-decision-cue` for explicit preservation, availability
permission and opening-mismatch wording, plus
`case-detail-key-rationale-overlap` for phrases unique to the complete explicit
keyed rationale. The rationale is post-answer metadata, not visible context.
Synonymous paraphrases and the sentence-deletion test still require human
review. A warning never orders deletion of a safety/eligibility finding.

Current milestone: owner round three and batch one, 2026-11-02. The snapshot is
`fixtures/round3-batch1-before-20261102.json`. Forty proposed tasks and 28 context
identities coexist with all original definitions; five pilot identities advance
while eleven exact owner-approved task drafts stay unchanged. Review JSON keeps
the requested Presentation/Current update/Exhibit/Task/Options fields and adds
visible history, lint evidence and nested context packets. It contains only
project-owned synthetic authoring data.

The historical v4 `review-round3-batch1-20261102.mjs` implementation is captured
in the immutable entry snapshot. Its current entry point regenerates the two
current review JSON files using the adversarial correction compiler described
below. Previous review JSON is
historical; do not regenerate it with the old milestone scripts against the
current bank. `round3-batch1-author.mjs` compiles the reviewed worksheet against
the immutable snapshot into source; changing source requires rerunning all
applicable validation. `build-revision-choice-records-20261102.mjs` clones only
exact original record dispositions into explicit revised identities, never
guesses services or routes, and preserves every historical record.

Linter v4 fixes acronym-token comparison: B-cell no longer yields a spurious
`B-` acronym, and a shared acronym before a hyphenated suffix is compared
consistently. Both sides of the current cue comparison use this same version.
No rule is suppressed for the rewrites and no correctness analytics is added.

The final full batch-one validation also observed three additional suite timeouts.
`compare-batch1-timeouts-20261102.mjs` is a read-only synthetic diagnosis: it
executes the exact project-owned inventory and mixed-nurse callbacks/assertions
against captured pre-edit/current cases, restores the disposable process-local
context and prints result hashes/timings. Unsupported or changed callback
structure/matchers fail closed. It changes no test, timeout, evidence or runtime
file and reads no player data. Diagnostic times do not replace the retained
Vitest failures or establish performance. The current handoff records the
subsequent passes under the original deadlines.

Historical first continuation: adversarial corrections of all 43 main and 30 context
items. `fixtures/adversarial-before-20261102.json` captures the exact drafts
reviewed by Astra; the independent review file is immutable. No worker or
sub-agent was spawned. Melissa's eleven exact approvals use the existing
AuthoredClinicalRecord fields and do not approve another identity or evidence
claim. Pipeline-qualified drafts may enter invited beta through manager
acceptance/release checks; this worker never publishes.

`adversarial-specs-20261102.mjs` is the independently written synthetic
worksheet. `adversarial-evidence-20261102.mjs` compiles 39 atomic claims and 35
source records. `author-adversarial-20261102.mjs` adds 73 versioned definitions
without overwriting the old ones. `build-adversarial-choice-records-20261102.mjs`
appends fourteen exact records, preserving prior dispositions; B24 is explicitly
a future-planned, nonexecuted terminal diagnostic decision. New testing choices
use existing placeholder timing profiles; no duration, service route, save or
frozen-encounter schema changes are introduced.

After deliberate source changes, regenerate in that order, then run
`node tools/question-quality/review-round3-batch1-20261102.mjs`,
`node tools/question-quality/write-adversarial-docs-20261102.mjs`, and
`node tools/question-quality/verify-review-20261102.mjs`. The current reports
are `adversarial-cue-before-20261102.json`, `adversarial-cue-after-20261102.json`
and `adversarial-cue-comparison-20261102.json`; historical v4 reports stay
historical. Both comparison sides use linter v5. The before fields in owner
packets show the drafts attacked by Astra; originalAuthoringBefore preserves
the earlier baseline. Every note has an indexed response and every retained
warning has a review reason, without claiming independent acceptance.

Linter v5 adds two narrow advisory checks: explicit gastric/duodenal ulcer-site
disagreement across presentation/update, and duplicate complete case findings.
It does not infer anatomy, reject clinically necessary negatives, suppress
balanced plan comparisons or collect/expect answer statistics. Review linked
tasks and wait previews as well as authored words; one uniquely timed key can
also cue an answer. Pancreatic referral/repeat-imaging choices now all carry
existing placeholder estimates while execution remains unchanged.

Historical third author revision after independent review two:
`fixtures/adversarial-r3-before-20261102.json` is immutable. The 17 passed
versions remain exact; 56 returned versions advance to v6. Thirty-five narrow
items are explicitly basic, with reasons, and 21 assess applications. Basic
does not mean independent PASS or clinical approval. Every one of the second
review's 999 indexed notes, including 586 earlier-note assessments, is retained
in the response mapping.

The current source worksheet/compiler is `adversarial-r3-specs-20261102.mjs`,
`adversarial-r3-evidence-20261102.mjs`, then
`author-adversarial-r3-20261102.mjs` and
`build-adversarial-r3-choice-records-20261102.mjs`. They retain all v5 source
and timing identities. The new registry block clones nine exact dispositions;
no new route, execution rule, save format or duration is inferred.
Run the existing `review-round3-batch1-20261102.mjs` entry point to regenerate
the current packets; its historical target was `review-adversarial-r3-20261102.mjs`.
Earlier v4/v5 author/review generators are historical and must not overwrite
current packets. Both sides of the new comparison still use linter v5.
No player-data input or correctness analytics exists in these offline tools.

Current fourth author revision after independent review three:
`fixtures/adversarial-r4-before-20261102.json` is immutable. Twenty-seven
PASS versions and all three accepted-basic versions stay exact; B29's
overlapping REVISE recovery note is pending clarification. Forty-five other
returned items have v7 application drafts; all 32 rejected basic flags are
removed. Eighteen explicit new concept versions retain the old 370 definitions
and frozen histories. No clinical approval transfers to a new version.

Regenerate from the independently written worksheet in this order:

```text
node tools/question-quality/adversarial-r4-evidence-20261102.mjs
node tools/question-quality/author-adversarial-r4-20261102.mjs
node tools/question-quality/build-adversarial-r4-choice-records-20261102.mjs
node tools/question-quality/review-round3-batch1-20261102.mjs
node tools/question-quality/write-adversarial-r4-docs-20261102.mjs
node tools/question-quality/verify-review-20261102.mjs
node tools/question-quality/adversarial-r4-bound-inputs-20261102.mjs
```

The entry points now target the r4 review/QA modules; earlier generators must
not overwrite current packets. Linter v5 is unchanged on both comparison sides.
Reports use `adversarial-r4-*20261102.json`. The new runtime module checks
explicit old/new keyed-service, gate and concept projections; it does not
modify saved encounters or services. Six exact order records are additive;
all 1,669 older timing rows and the entire pre-r4 order-registry source remain
exact. The evidence compiler stores 35 original claims and 25 source records.

The source templates use the existing `{ageYears}` and `{sexNoun}` fields,
not an unsupported combined token. The existing selector requires every paired concept to be unseen or due.
Sixteen new versions have only paired coverage, and any future-due companion
can defer their selection; either position can otherwise draw an eligible pair.
This constraint is explicit rather than hidden by changing routing or history.
All 394 third-review notes have indexed author responses. Exact claims,
source limitations, unresolved B29 direction and final checks are in the r4
source/response/handoff documents. These are offline authoring tools without
answer-statistics inputs, gameplay data reads or correctness collection.

The r4 worksheet now stores only the 45 current specifications; stale override
drafts are removed. `author-adversarial-r4-20261102.mjs --check` and
`adversarial-r4-evidence-20261102.mjs --check` compare generated output byte for
byte without writing a bound input. The specification-check receipt preserves
the before/after tool hashes and consumed-field hash.

`compare-adversarial-r4-supply-20261102.mjs` runs the exact captured/current
synthetic supply callbacks and their functional assertions against pre-r4 and
current releases in the same restored process-local domain context.
`review-adversarial-r4-snapshots-20261102.mjs` proves unchanged assertion/deadline
code outside the explicit catalog count and three reviewed snapshot literals,
and records every scalar/concept-ID change. These are test diagnostics, not
player analytics or substitutes for the full Vitest run.

`diagnose-adversarial-r4-legacy-load-20261102.mjs` reproduces the recorded
legacy load hashes and continuations against the retained entry release, then
compares the current release without editing the fixture. All 25 current load
differences are the 18 new empty concept histories initialized by the existing
loader. Old frozen encounters continue exactly; later differences are confined
to newly admitted cases at Levels 1–4. The released legacy behavioral evidence
needs manager regeneration/review alongside the input rebind. This diagnostic
does not turn those 25 failing Vitest assertions into passes.

Historical fifth author revision after independent review four:
`fixtures/adversarial-r5-before-20261102.json` is immutable. All 47 exact PASS
versions and eleven exact clinical approvals remain frozen. Twenty-six returned
versions advance under v8; B29 has the express manager fairness-repair exception
and retains its accepted basic role, without passing its new wording. B01/B10
remain exact. One new v3 lipoma evidence-status construct retains all prior IDs.
The manager accepts paired-only coverage; no selector/routing change.

The current entry points target `review-adversarial-r5-20261102.mjs` and
`verify-adversarial-r5-20261102.mjs`. Earlier author/review generators are
historical and must not overwrite current packets. Source is compiled from
`adversarial-r5-specs-20261102.mjs` using `author-adversarial-r5-20261102.mjs`,
with `adversarial-r5-evidence-20261102.mjs` and the explicit additive record
builder. Both author and evidence compilers have read-only --check modes.
The cue-cleanup application script is one-shot, only for the returned specs.

Use the standard, per-item response ledger and source ledger in docs/research.
All 172 returned notes have direct indexed responses; the full fourth-review
packet has 337 notes. Both comparison sides use unchanged linter v5. New
interpretation choices lose inherited biopsy waits; new testing distractors
receive existing profiles. Old 1,714 timing rows and exact records remain.
There are 26 new rows (1,740 total), two new exact records, and no keyed-service
change. Current timed choices are 1,466 with 138 terminal timed keys.

The controlled supply and snapshot-review tools compare exact synthetic test
callbacks against the entry/current release with unchanged assertions/deadlines.
The legacy diagnosis separates the 19 histories added since the old fixture
from this round's one new history. Evidence refresh and input rebinding belong
to the manager in the release worktree; do not run a rebind here. No player data,
answer-statistics input or correctness analytics is used.

The command-local r5 player preload reports Vite's optional net-use probe as
unavailable through its callback, leaving fs.realpathSync. It does not execute
that command, query network mappings, modify storage, change dependencies or
change permissions. All other child-process calls are forwarded unchanged.

## Current sixth revision after independent review five (completed 2026-11-03)

The r5 section above is historical. Current entry points target
`review-adversarial-r6-20261102.mjs` and `verify-adversarial-r6-20261102.mjs`.
Only the sixteen review-five REVISE entries advance under v9. All 57 exact
PASS versions, B01/B10/B29 accepted-basic versions and eleven clinical approvals
remain exact. The immutable entry is `fixtures/adversarial-r6-before-20261102.json`.
Compile original specifications with `author-adversarial-r6-20261102.mjs` and
`adversarial-r6-evidence-20261102.mjs`; both accept read-only `--check`.

Three new scored-objective versions retain all 389 previous concept definitions.
All 1,740 old timing rows remain beside sixteen new rows (1,756 total). Current
timed choices are 1,469; terminal timed keys remain 138. Shared-procedure
interpretation options use the same profile. B05 alone changes to the existing
MRI service/result route. No new terminal/unsupported exact order record is
needed; the entire prior registry source is unchanged.

All 117 returned notes have indexed responses in the packets and response ledger.
Same-linter before/after and exact phrase/field reconstruction are separate from
clinical approval or observed difficulty. Controlled supply callbacks reproduce
the captured and current snapshots at their respective releases; source
normalization preserves functional assertions/deadlines. The legacy diagnosis
separates three round-six empty concept histories from nineteen prior additions.
The manager owns evidence refresh/rebinding in the release worktree; these tools
do neither. Use the existing command-local r5 Vite preload for the four player
presentation suites; no player storage, save, permission or dependency changes.

## Current seventh and final authoring round

The r6 section is historical. Current review/verification entry points target r7.
Only the eleven review-six REVISE items advance under v10; all 62 PASS versions,
B01/B10/B29 and eleven exact clinician approvals remain frozen. The immutable
r7 entry and original fallback records are retained. Four explicit construct
versions retain all 392 earlier definitions (396 total). All 1,756 old timing
rows remain beside eleven new rows (1,767 total); live timed choices are 1,467,
terminal timed keys 138, with no keyed-service/result-gate or exact-registry edit.

Author/evidence compilers have --check modes. The r7 sequence audit records all
eight prior-feedback flags; B19 no longer teaches the later tract answer. Two
residual B21/B22 feedback caveats cannot be repaired without changing a frozen
PASS version and remain explicit. The manager owns routing, evidence rebind,
release and review-seven fallback decisions. No player data, correctness
analytics, installs, network, Git or publication is used by these offline tools.
