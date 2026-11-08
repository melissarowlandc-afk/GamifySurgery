# Flags4 acceptance handoff — 2026-11-08

**F4-01 is integrated into the local accepted default as a draft.** One exact
manifest row replaces legacy v3 for fresh encounters. Only the redundant
seven-word Current update was deleted from the reviewed candidate; its complete
task, three options, rationales, explanation, header/profile and evidence are
unchanged. New exact version: **v3.r2**. Stable concept and single-node case
shape are preserved. No deploy, release-tree edit or rebind occurred.

[Manager decision](question-flags4-manager-decision-20261108.md) records the
independent **REVISE/easy** result and the manager's acceptance because the owner
note is fully resolved, with no FAIL, fairness or accuracy issue. Difficulty is
future work, not a blocker. No independent PASS or clinical approval is implied:
all new clinical metadata remains **`needs_clinician_review`**, with no named
clinician review recorded. Melissa Rowland remains clinical sign-off.

## Accepted identity and exact scope

| Field | Accepted value |
| --- | --- |
| Acceptance | `F4-01` |
| Case | `case.gs028f.nutrition.c1-metabolic-transition` |
| Node | `node.gs028f.nutrition.c1-metabolic-transition.1` |
| Fresh question | `question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3.r2` |
| Retained legacy question | `question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v3` |
| Stable concept | `concept.gs028f.nutrition.refeeding-insulin-phosphate-shift` |
| Exact source view | `flags4-accepted` / `QUESTION_FLAGS4_ACCEPTED_SOURCE_RELEASE` |

The reviewed r1 source, packet, independent review, claim definitions and source
ledger remain exact. The accepted view deletes “Serum phosphate fell as
carbohydrate feeding resumed.” The unchanged task already identifies the
exposure and the patient's phosphate decline; the review's deletion test
explicitly confirms the answer does not depend on repeating that update.
No new observation, threshold, management rule, diagnosis or claim was added.
The [acceptance packet](question-flags4-accepted-20261108.json) displays the
reviewed/accepted fields, **key shown first for review only**, and pins exact
question/node/case/source hashes. Runtime options remain randomized.

No whole-case relation is necessary: the existing case has one node, with the
same node/concept identity. All 133 earlier acceptance rows, 1,423 legacy
bindings and three existing whole-case relations remain exact. The only header
pin added is for this case. No domain acceptance check or selector edit.

The prior [source ledger](sources-question-flags4-20261108.json) still supplies
two recorded sources, three basis claims and three atomic applications. The
mechanism has the disclosed single direct source (Zhang et al., 2023 background
physiology); AuSPEN supports the diagnostic caution. **No held key.** Actual
source access/check dates are unchanged; no network or new source verification.

## Default counts and hashes

| Object | Before | After |
| --- | ---: | ---: |
| Cases | 1,141 | 1,141 |
| Scored nodes | 1,452 | 1,452 |
| Registered meanings | 606 | 606 |
| Active concept identities | 450 | 450 |
| Accepted manifest rows | 133 | **134** |
| Exact archived/current timing rows | 2,283 | **2,284** |

All 1,140 other current cases, every registered meaning and their order remain
exact. The catalog is unchanged. One `no_test` identity is appended; no testing
order, wait estimate or old timing row is removed. The timing-test sum now
includes that new identity, retaining its complete uniqueness, exact-label and
one-binding-per-node checks.

SHA-256 of `JSON.stringify`:

| Object | Before SHA-256 | After SHA-256 |
| --- | --- | --- |
| Default release | `1ab9a80611a3f4e09629b4f49f6e7b49fedb93a8102475620450417dfdca4813` | `db795ec578f8b5bfa77d1260b2e53c5a59f779f51edcba538fd8753bdb3de139` |
| Manifest | `8b3ec2e429e0c4b170c1a0170456b5b6e4e54f3be5582e80576d45aadc193c77` | `0e70c49460b6f93ec6766f6f59ad10eb9e4b0e38d8745283d9fa35818d68c06c` |
| Global timing | `937dd59c71ca96e38e5b41002b6dda9fb5846d915302ab2e774a17ed48bc80ac` | `bf4b96a2160a8c4855ef0ad6b7a1906d7328170ab53b15dbfa2661952db4ab43` |

Manifest version: `question-ship.2026-11-08.v7`. Reviewed r1 source remains
`c74ad1bafc355076c4483c60e919b740aaed9ebaa17c02f909a053519ac4b4d9`.
Accepted source:
`ae92408582c12638d88fb8b1a4d86f96b150437eb4135488b23c162dbae95cbd`.
Catalog remains
`3e0d1bb346abc1579e5c24400565c36c158d90304b60171b24b6a88f64b2ed40`.
Full preservation proof: [scope receipt](question-flags4-acceptance-scope-20261108.json).

## Frozen compatibility and clinical guards

The new player test admits the actual accepted default, then serializes and
reopens it as a **format-3** save and completes it. It also reopens waiting and
in-progress legacy v3 encounters, preserving their original four-choice order,
scored question identity and stable FSRS card/history. A committed old admission
is replayed from the durable journal against the current default, preserving
the original frozen question instead of selecting r2. All four scenarios pass;
duplicate answer operations do not create duplicate reviews. Save formats,
codec limits and runtime save/cloud implementation are unchanged by this lane.

Older clinical assertions retain their original epoch through a test-only
adapter. It first verifies the complete exact one-case/one-row/one-timing delta
and every other release byte, then restores the prior epoch for those tests.
Source preimages/hashes are pinned in a new migration receipt; no existing
capture was refreshed, removed or re-blessed. An unrelated case/manifest mutation
is explicitly rejected. These adapters are never called by runtime admission,
scoring, serialization or replay.

## Validation — exact final output

Raw commands, exit codes, log hashes and **every exact failure title**:
[validation receipt](question-flags4-acceptance-validation-20261108.json).
Logs: `.local-dev/question-flags4-acceptance-20261108/`.

| Working directory / command | Files | Tests / result | Duration / exit |
| --- | --- | --- | --- |
| `packages/clinical-content`: `npm.cmd test -- --pool=threads` | 124 pass / 3 fail (127) | **1,581 pass / 3 fail (1,584)** | 69.32 s / **1** |
| `packages/game-domain`: `npm.cmd test -- --pool=threads` | 203 pass / 3 fail (206) | **5,225 pass / 28 fail / 1 skip (5,254)** | 492.75 s / **1** |
| Root: `npm.cmd run typecheck` | Seven workspaces | **All seven PASS** | **0** |
| Root: `npm.cmd run clinical:lint:test` | — | **33 pass / 0 fail** | 3,990.1606 ms / **0** |
| Clinical focused: `npm.cmd test -- --pool=threads question-flags4-acceptance-20261108.test.ts question-flags4-20261108.test.ts answer-choice-timing.test.ts` | 3 pass | **20 pass / 0 fail** | 11.48 s / **0** |
| Player focused, four files below | 3 pass / 1 fail (4) | **82 pass / 1 fail (83)** | 62.19 s / **1** |
| New flags4 player file alone | 1 pass | **4 pass / 0 fail** | 57.58 s / **0** |

Final player command, from `apps/player`, with the existing
`tools/question-quality/adversarial-r5-player-preload-20261102.cjs` required via
`NODE_OPTIONS`:

```text
npm.cmd test -- --pool=threads --maxWorkers=2 src/questionShipSaveCompatibility.test.ts src/questionFlags4SaveCompatibility.test.ts src/session/cloud/separateCampaign.test.ts src/session/flagFreeze.test.tsx
```

This runs every test in all four files. All 31 existing ship-save tests and all
four new flags4 tests pass. Initial simultaneous full-suite execution produced
two 5,000 ms ship-save timeouts (80 pass / 3 fail, 98.34 s); neither recurred with
the same four files after the full jobs and `maxWorkers=2`. No test timeout,
tick bound, assertion or codec budget was increased. The sole final player
failure is the previously recorded:

`src/session/cloud/separateCampaign.test.ts > explicit separate account campaign for a divergent local branch > retains real retired encounters which no longer exist in the playable state`

It throws `CloudCodecError: JSON string exceeds the codec limit` at
`codecJson.ts:63`, called from `separateCampaign.test.ts:54`. Cloud/perf workers
retain ownership; no existing player file was edited.

Accepted-view advisory lint: **one variant / two contexts / zero findings /
zero suppression**. Original live v3 had one near-duplicate-option finding;
reviewed r1 and accepted r2 both have zero. Source-migration and packet
regeneration `--check` commands pass.

### Remaining full-suite failures

**Clinical: three historical source guards; no flags4 functional failure.**

- `question-flags3-20261107.test.ts` — “leaves every existing protected source
  and decision file byte-exact”: current `diagnostic-timing.ts` hash differs
  from its old capture.
- `question-stats1-20261108.test.ts` — “preserves every protected source/capture
  through the exact authorized standard/test-hook migration”: same timing drift.
- `question-stats1-acceptance-20261108.test.ts` — “pins each authorized
  existing-source delta before preserving old capture assertions”: active cloud
  lane's `codecJson.ts` differs from that older capture.

`diagnostic-timing.ts` is already
`499e069e78d1755c1f23e6ab6b29052ee072896248d792c019a1336301334d2b`
in this milestone's immutable **before** capture and remains exactly that now;
the older guards expect `2a8e9158…`. It was not changed by this acceptance.
`codecJson.ts` is outside this lane and not absorbed into its source receipt.
Full old/current hashes are in the validation record. These assertions remain
intact for their owning lanes/manager to reconcile.

**Domain: 28 failures, with exactly the same titles as the preceding stats1
acceptance report; zero newly failing titles.** That comparison is not claimed
as a fresh pre-change baseline. The exact 28 titles are in the validation JSON:

- `approved-clinical-admission.test.ts`: existing expected-585 versus actual-606
  registered-meaning fixture.
- `level-five-integration.test.ts`: existing current-input binding failure.
- Same file: 25 existing serialized loaded-state hash mismatches, levels 0–4
  crossed with schemas 5–9, in the pre-M9/next-120-minutes tests.
- `patient-supply.test.ts`: “records the current clinical inventory and exact
  unseen-patient boundary by stage”, existing 10,000 ms timeout.

None was hidden through fixture updates, retries with relaxed budgets or
evidence rebinds. **Full clinical, domain and focused-player suites are not
green.** Integration/compatibility checks for this accepted row are green.

## Changed Level 5 inputs

Exactly these existing paths edited by this milestone appear in the current
`tools/qa/level-five-integration-results-20261012.json` input map:

- `packages/clinical-content/src/index.ts`
- `packages/clinical-content/src/synthetic-content.ts`
- `packages/clinical-content/src/answer-choice-timing.ts`

Raw file SHA-256 values (before this milestone → after) are in
`levelFiveInputHashes` in the scope receipt, alongside the older evidence-bound
values. `question-ship-manifest.ts` is another changed runtime dependency,
currently outside that older explicit input map. Five runtime source modules
become default-loaded: the new accepted module and the four unchanged flags4
reviewed/data/evidence/retained modules. Their exact names are listed in the
scope receipt for the manager's later binding. No Level 5 evidence, pin,
checkpoint or release-tree file was edited or rebound by this lane.

## File ownership and handoff

[File receipt](question-flags4-acceptance-files-20261108.json) lists new and
modified paths with hashes. **Nine existing clinical files** changed:

- Runtime integration: `question-ship-manifest.ts`, `synthetic-content.ts`,
  `index.ts`, `answer-choice-timing.ts`.
- Clinical test/support integration: `answer-choice-timing.test.ts`,
  `question-ship-manifest.test.ts`, `question-flags4-20261108.test.ts`,
  `question-stats1-acceptance-20261108.test.ts`,
  `question-stats1-acceptance-test-support.ts`.

All are under `packages/clinical-content/src/`. Of 1,341 protected intake paths,
**1,332 remain exact**, with only those nine authorized deltas. New files include
the accepted module, exact-delta helper, eight-test clinical acceptance file,
`apps/player/src/questionFlags4SaveCompatibility.test.ts`, intake/migration
fixtures and generation/validation tools, decision/accepted packet/scope/lint/
validation/file receipts, this handoff and the bounded ExecPlan. The shared
current-thread handoff gets an additive entry with its old prefix preserved.

No existing app, save/cloud, perf, domain, balance, Supabase, other question,
source ledger, clinical approval or evidence file was edited. No Git, install,
network, agent, external message, deploy or rebind. Work remains a local
checkpoint; manager owns cross-lane guard reconciliation, prior red baselines,
release integration and any separately authorized GitHub backup (owner phrase:
**“push to GitHub”**). No playtest origin or save-opening pathway changed;
already frozen encounters intentionally retain their old wording/options.

Open follow-up: resident difficulty improvement; owning-lane/manager resolution
of the listed shared/pre-existing test failures; later Level 5 input binding.
Acceptance and all requested validation are recorded. Stop here.
