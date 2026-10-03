# GS-028 second pre-Endoscopy batch: editorial receipt

September 29, 2026. Version `development-batch.2026-09-29.pre-endoscopy.1`.
Owner requested another 20 concept groups under the standing GS-028 contract.
Editorial review and integrated acceptance are complete. This receipt does
not grant clinical approval. Every new
clinical record remains `needs_clinician_review`, with no named clinician
sign-off. Scope is the local unapproved owner/development prototype.

## Exact scope

20 new scored objectives, four substantive variants each: 80 questions/nodes,
70 encounters (60 standalone and 10 paired), 252 instantiation profiles,
25 atomic evidence claims, 14 deduplicated sources and 80 timing entries.
Every objective has independent encounter access when a paired sibling is not
FSRS-due. Sixteen objectives are stage 0; all twenty are available by stage 1,
before Endoscopy. Case stages are 55 at stage 0 and 15 at stage 1.

Families: postherniorrhaphy pain, Spigelian hernia, prosthetic mesh infection,
perioperative cirrhosis, PTLD, differentiated thyroid cancer, nipple discharge,
post-neoadjuvant noninflammatory breast cancer, basal cell carcinoma, and
preoperative nutrition. Two narrow objectives per family. Existing concept
identities and prior clinical content are preserved.

Named patients retain coherent age, sex and existing characters. Complaints
contain 2–5 words, authored presentations 17–47, and prompts 4–10. Choices
shuffle; named-story and longest-key guards pass without exceptions. Every
testing option, including distractors, has centralized neutral timing. These
durations remain gameplay placeholders, not clinical turnaround claims.

Two ultrasound result gates and one external diagnostic-breast-imaging gate
support actual test/return/decision flows. Four exact terminal orders cover two
cervical ultrasound choices and two external breast-imaging choices. Urgent
cases escalate without artificial clinic waits. Groin nerve blocks and PTLD
tissue diagnosis remain specialist coordination, not invented onsite services.

## Evidence and source limits

The live Google concept sheet was refreshed read-only through row162, including
guidance columns I:M; the checked tail through1000 was empty. There are161
candidate rows. No raw export, private note collection or sheet mutation was
created. New meanings were compared against203 active objectives, including
prior variants and inactive pilot distinctions. The source contract records
duplicate exclusions, exact mappings and source boundaries:
[September29 source contract](../../execplans/gs028-pre-endoscopy-source-contract-2026-09-29.md).

Current official ABSITE metadata still identifies the January2021 outline.
Automatic approval review rejected a fresh public SCORE PDF download because
it classified the action as prohibited SCORE access. No retry or workaround
occurred. Curriculum mapping uses the previously verified September28 official
2025–2026 outline, SHA256
`2b98112b218e0b612fe6ea2f8ad5cf7c6f4555d79289c2f569234aa6b5748c09`.
PTLD mapping is explicitly inferred; no individual exam-frequency claim is made.

Current ATA2025 primary guidance was legitimately read from its official-linked
publisher PDF; the blocked PMC mirror was not bypassed. AST2019 supports PTLD
tissue classification; an accessible CC-BY2026 review cross-checks its phenotype.
ASBrS documents are expert-informed resource guides, not falsely represented
as independently graded guidelines. NCI supports BCC morphology and behavior.
Nutrition uses accessible ESPEN2021 targeted verification with an explicit
older/single-guidance limitation. ACS Strong for Surgery evidence was removed;
ESPEN2025 and EASL2026 AI/TDM-restricted material and NICE were excluded.

Single-source or low-certainty limits remain visible for hernia pain/block
assessment, Spigelian repair, mesh infection, perioperative cirrhosis and
nipple-discharge imaging. Thyroid sources from one society are not independent
corroboration. Source records separate authority from reuse permission and map
original claims in both directions. No article text, source excerpts, tables,
proprietary textbook material, SCORE modules or question-bank content is stored.

## Measured pre-Endoscopy supply

Same selector fixtures and16 seeds, with reachable installed rooms/staff and
without Endoscopy or Recovery. These are synthetic bounds, not the owner's save.

| Fixture | Eligible objectives before → after | Cases before → after | Unseen exhaustion before → after |
| --- | ---: | ---: | --- |
| Stage0, no capabilities | 66 → 82 | 224 → 279 | 54–60 → 68–73 |
| Stage1, Minor Procedure + Ultrasound + technician | 176 → 196 | 461 → 531 | 112–118 → 129–137 |
| Stage2, diagnostics without Endoscopy | 192 → 212 | 497 → 567 | 122–128 → 139–146 |

All-not-due states still produce no eligible patient; due items are prioritized.
Unresolved encounters block their own concepts while other new objectives remain
available. This is a content-supply improvement, not proof of an arrival-rate,
staffing or economic fix. A new natural Endoscopy-purchase playthrough was not
claimed; the previous controlled no-grant progression evidence retains its limits.

## Integration and preservation

Additive admission changes clinical exports, synthetic inventory/release and
timing registry. Four exact terminal-service records reuse existing routes.
The new busy-ultrasound regression found a waiting-chair origin lookup gap:
queued patients could remain stuck after resources became free. The bounded
fix adds the persisted waiting-destination room to both timing-origin candidate
lists, preserving current service contracts and the concurrent perioperative work.

Before-release SHA256:
`a1dd3c479ead999fce6c28ba98310aa0a47767b3a342fd19577265f6a228a798`.
Deep comparison preserves all203 prior concepts,518 cases and783 nodes exactly.
New runtime totals are223 concepts,588 cases and863 nodes. Existing withdrawn
content guards remain enabled.

Fresh final direct-runtime-import capture SHA256:
`56cfa63e6ff42033ac444b7f3df2398e65b9ef5a7c920cdd93fe4dc0c4777411`.
The capture test passed1/1 and repeated the exact frozen-content comparison.
Parent caught and replaced an earlier stale snapshot after two Vite capture
timeouts. All15 dated production fingerprints below match current files.
Supply figures retain the successful dated selector measurement; they do not
claim a new final selector recapture. Current full-suite supply tests also pass.

This is a shared dirty worktree. Concurrent tasks changed selectors, persistence,
prototype balance, player view models and additional perioperative/runtime
surfaces. The pre-registry comparison distinguishes those changes; they were not
reverted or attributed to this batch. The reducer snapshot also contains a
separate concurrent terminal-movement correction after the queue-fix snapshot.
Only the two waiting-destination additions belong to GS-028's engine fix.

## Validation and accountability

Final broad serial Vitest run: **1,965 tests passed in 202 files** (280.15s),
covering clinical content, game domain, player source and balance configuration,
with ignored local scratch tests excluded. The scoped new-batch, terminal-order
inventory and supply checks passed 202/202 before that run. All eight repository
TypeScript configurations passed. App-boundary and launcher-contract checks
passed, and the isolated final production build passed (existing chunk-size
warning only).

Desktop Chrome browser acceptance passed 3/3 scenarios: ultrasound return,
external breast-imaging return and standalone presentation. A further breast
scenario passed 1/1 against the final build, including scrolling the returned
second decision to verify all four choices. Astra inspected the screenshots,
including the returned final-choice capture. Save/reload, hidden pending results,
wrong-answer correction and single FSRS submission were exercised. Owned preview
processes were stopped and port4317 was verified closed. Browser coverage is
desktop Chrome, not a claim of every device/browser or a natural economy run.

The initial broad run was1950 passing/9 failing across201 files: a new complaint
length violation (corrected), two inventory/supply expectations, the new queue
regression, and five concurrent Endoscopy/preparation migration failures. This
initial run was superseded by the fully passing final serial run above.

Sol `batch_roster_sources` researched/authored the dated package, corrected
editorial findings and diagnosed/implemented the bounded queue fix. Terra
`runtime_supply_audit` captured the exact baseline, integrated registry/orders,
wrote actual reducer-flow/browser tests and measured supply/preservation. Terra
`authoring_reference_review` independently checked sources and40 variants,
corrected the bounded groin-pain file and performed isolated browser acceptance.
Astra selected scope, reviewed actual content/source/diffs/assertions and images,
ran integrated checks and owns this acceptance. Astra's only implementation edit
was the tiny review correction of one six-word nutrition complaint. Substantial
implementation milestones were delegated.

Evidence is under ignored `.local-dev/gs028-20260929-baseline/`,
`.local-dev/gs028-20260929-browser-results/`, and
`.local-dev/gs028-20260929-build/`. Browser testing uses isolated synthetic
storage at `http://127.0.0.1:4317`. Owner launch remains `START_GAME.cmd` →
`http://127.0.0.1:4173` in the usual persistent profile. No owner-save access,
commit, push, deployment or clinical publication is authorized by this batch.
The prior GS029 website release remains a separate historical checkpoint.
Say **"push to GitHub"** for an audited backup. GS-028 stays open for future batches.

## Exact concept inventory

| Stable concept ID | Scored objective | Stage |
| --- | --- | ---: |
| concept.postherniorrhaphy-pain.neuropathic-pattern-recognition | Recognize postherniorrhaphy pain patterns | 0 |
| concept.postherniorrhaphy-pain.targeted-block-specialist-evaluation | Select specialist diagnostic-block evaluation | 0 |
| concept.spigelian-hernia.clinical-imaging-recognition | Recognize Spigelian hernia | 0 |
| concept.spigelian-hernia.elective-repair-referral | Refer confirmed Spigelian hernia | 0 |
| concept.prosthetic-mesh-infection.deep-infection-recognition | Recognize deep mesh infection | 0 |
| concept.prosthetic-mesh-infection.specialist-source-control-evaluation | Escalate deep mesh infection | 0 |
| concept.cirrhosis-perioperative-risk.multifactor-assessment | Assess perioperative cirrhosis risk | 0 |
| concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary | Optimize active cirrhosis decompensation | 0 |
| concept.ptld.posttransplant-pattern-recognition | Recognize a PTLD pattern | 1 |
| concept.ptld.tissue-diagnosis-coordination | Coordinate tissue diagnosis for PTLD | 1 |
| concept.differentiated-thyroid-cancer.preoperative-nodal-ultrasound | Map DTC with preoperative neck ultrasound | 1 |
| concept.differentiated-thyroid-cancer.individualized-surgical-extent | Individualize DTC surgical extent | 1 |
| concept.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition | Classify nipple discharge patterns | 0 |
| concept.pathologic-nipple-discharge.diagnostic-imaging | Select diagnostic imaging for pathologic discharge | 0 |
| concept.breast-cancer-after-neoadjuvant-therapy.response-mapping | Map breast cancer response after neoadjuvant therapy | 0 |
| concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection | Select breast conservation after neoadjuvant therapy | 0 |
| concept.basal-cell-carcinoma.clinical-pattern-recognition | Recognize a basal cell carcinoma pattern | 0 |
| concept.basal-cell-carcinoma.local-invasion-metastasis-counseling | Counsel about BCC disease behavior | 0 |
| concept.preoperative-nutrition.nutritional-risk-screening | Assess preoperative nutritional risk | 0 |
| concept.preoperative-nutrition.oral-enteral-first-line | Choose oral or enteral nutrition before PN | 0 |

## Version fingerprints

SHA256 of UTF-8 source text with CRLF normalized to LF; production files only. These fingerprints bind editorial acceptance to the reviewed version, not clinical sign-off.

| Dated package file | SHA256 |
| --- | --- |
| basal-cell-carcinoma.ts | 71f987df27f9a82cb7fd3689e1b610674212f29d7fced5bdbf0cdae541d90000 |
| batch-helpers.ts | d9a4702af99bf67069d3b55b57bfeef818a98bf09b7c4b6d9b145aeb0512426b |
| cirrhosis-perioperative.ts | 30810ef6b957d078b235fd4289eb04f66723f54cde7fa13e6a07848011d79132 |
| differentiated-thyroid-cancer.ts | 7d7f3cdbfe4c30f842c111ed5658139f1f40c9e7bde38922bc299854b19e1ceb |
| family-builder.ts | 2a00aea1ac89138549a9d290a307d2dafcb80fbf7938cd9405d5bdf73dd47656 |
| mesh-infection.ts | 0156d87ab19d7ada505ad9a748afebfa5f249ceab5a95e9f61b70563048d5033 |
| nipple-discharge.ts | 32aeaf36ee19b8c94f44471b9a61a879a084ca40757ceff30c961e936ebf3007 |
| post-neoadjuvant-breast.ts | 90a174e4f2f8686dee5374af960fcd08581cc7f754be2081bad739bc39592138 |
| postherniorrhaphy-pain.ts | dc80d96892c498ac8e10274fea650ce22f0d4777ab59b94608ac5f12746c602b |
| pre-endoscopy-batch.ts | 1a373d0d34d49d758b0afa302d8c2d3f21265537b3462b88c63d455c388cad67 |
| preoperative-nutrition.ts | dee57f059feab7f4d1d7d60b155832285f65ad0453721c815eb3860dc30417db |
| ptld.ts | cd5c17042465388fc158972a10c5332f93861b2f3dd5208fa063a874d2e321b7 |
| source-catalog.ts | a7e0cc7afd050996dbf7a4e67274bbf09247548d7f20330dfe6e126779b268e3 |
| spec-utils.ts | 2243241ca728de0e9472227786a08728118cd0871f64b26f8909c1e4ca50f777 |
| spigelian-hernia.ts | 98271471e82f64010a3108d58cbfc577545adad7f38b5d1853e437b9c77e5676 |
