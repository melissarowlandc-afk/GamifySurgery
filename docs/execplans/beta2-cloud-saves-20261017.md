# Beta 2: cross-device cloud saves - ExecPlan (2026-10-17)

Status: **planning only; proposed implementation and limits await manager review**.
Manager: Claude Code thread "GamifySurgery manager". Planning worker: GPT-6.1
Sol, max. This worker's only output is this document. No code, fixtures, existing
plans, handoff, configuration, database, browser storage or opening pathway was
changed. No Git commands, installations, network calls, agents or external
messages were used. Repository branch/dirty status and hosted state were not
independently verified; the tree is shared with clinical-content/game-domain
workers. Proposed lanes below are future assignments, not dispatched work.

## Goal and authority

The owner's request is: **"I would like the computer and phone saves and
campaigns to cross over."** An invited player should sign into the same account
on desktop or phone, select the same named campaign, and continue from its last
confirmed account save without losing another session's progress.

Read together with these binding records:

- [Accounts/playtime release plan](accounts-playtime-release-20261012.md),
  sections 2 and 5, the 2026-10-13 binding decisions and later Beta 1-first
  override: Beta 1 is live with local campaigns; Beta 2 adds explicit local
  import and safe cloud campaigns; automatic flag triage comes later.
- [ADR 0011](../adr/0011-versioned-hybrid-saves.md),
  [ADR 0017](../adr/0017-browser-authoritative-facility-simulation.md) and
  [ADR 0019](../adr/0019-hybrid-relational-and-jsonb-storage.md): versioned
  operational snapshots, immutable evidence, expected revisions, one fenced
  writer per campaign, explicit takeover, brief connection-loss recovery, no
  automatic merge or last-write-wins, browser-computed facility transitions.
- [ADR 0036](../adr/0036-multiple-resumable-clinics-and-staged-auth-shell.md):
  several resumable campaigns, separate selected campaign, recoverable archive,
  campaign-scoped FSRS, names unique across resumable and archived campaigns.
- [AGENTS.md](../../AGENTS.md), [privacy boundaries](../../SECURITY_AND_PRIVACY.md)
  and the later owner decisions in the accounts plan: preserve owner saves,
  keep clinical material `needs_clinician_review`, invite-only existing Auth,
  count-only owner reporting, no PHI, fingerprints or gameplay research.

The later decisions also retain the existing setup-link/password flow and the
manager's standing authority to publish tested updates. This plan does not
reopen login, introduce SMTP, request per-update approval, authorize a purchase
or execute a release. The manager settles the new design/budget choices below
with the owner before implementation and applies the standing release policy.

## 1. Current save model and measured sizes

### Live persistence

| Area / source | Observed behavior and implication |
| --- | --- |
| `apps/player/src/session/prototypeStorage.ts` | Profile schema **2**, stored under `gamify-surgery.prototype.profile.v1`; the historical single-save key is `gamify-surgery.prototype.save.v1`. A profile contains an array of named campaigns, selected campaign ID, naming counter, tutorial default and per-campaign guidance/dismissal/acknowledgment state. Signed-in profiles may also stage opaque pending question-count receipts. |
| `LocalCampaignRecord` | Stable string campaign ID (for example `campaign.local.<token>`, **not necessarily a UUID**), name, local creation/update milliseconds, `resumable` or `archived`, and complete `GameState`. There is no application campaign-count or serialized-byte ceiling in this local path; browser quota can fail a whole-profile write. |
| `savePrototypeProfileResult` | Serializes every campaign using `serializeGameState`, stores that JSON as a **string inside profile JSON**, then calls synchronous `localStorage.setItem` for the whole profile. Success is a local write result, not a server receipt or independently verified readback. String escaping increases the outer profile size. Failure reports character count, which is not UTF-8 bytes or guaranteed browser quota consumption. |
| `accountStorageKey.ts`, `accountStorage.test.ts` | A signed-in account uses `<base>.account.<encoded account ID>`; `null` retains the historical unowned key. Account A, account B and prototype campaigns stay separate. Sign-in does not claim the unowned profile or historical single save. Auth context remounts account-owned UI; departing writers retain their original account scope. |
| `prototypeAutosave.ts`, `usePrototypeSession.ts` | Meaningful commands save locally; facility ticks are coalesced every 15 facility ticks with idle scheduling. Visibility loss pauses; `pagehide` flushes local state. Client `updatedAtRealMs` is a display/local timestamp, **not a conflict revision**. Existing writes do not coordinate two devices. |
| `App.tsx`, `PrototypeShell.tsx`, `AppShell.tsx`, `mobile/MobileShell.tsx` | Shared session and local account profile feed desktop and phone shells. Campaign creation, selection, restart/archive and restore also write directly from entry/lifecycle paths. These must join the cloud coordinator; changing only the in-game autosave misses them. |
| `localCampaignRepository.ts` | An existing **unused by the live App/session** IndexedDB repository has global database `gamify-surgery.local.v1`, one `profile` key, campaign/revision stores, expected revisions, SHA-256, UTF-8 sizes, post-commit verification and recovery from **two prior local revisions**. It is exported, not an active cloud/account cache. Its global profile namespace and metadata must be adapted; pending usage staging is not part of its stored profile contract. |
| `facilityCameraPreference.ts` | Campaign-keyed camera settings are separate origin-local presentation data. Keep camera, layout and last-selected campaign per device; they should not move the desktop viewport onto the phone. Campaign tutorial progress should travel with its campaign. |

`packages/game-domain/src/persistence.ts:113` currently implements
`serializeGameState` as `JSON.stringify(state)`. `deserializeGameState` accepts
versions 1-9, applies compatibility/normalization and returns schema 9; an
unknown version throws. This is not yet a separate cloud envelope or an
immutable-evidence codec. Some existing readers normalize or bound collections;
do not infer byte-for-byte identity or complete audit retention from a
successful load. Prove intended logical fidelity and record allowed migrations.

The state includes facility/room/employee/task/queue/clock data; founder and
generated identities; frozen clinical encounters and displayed answer order;
campaign seed, randomness contract/state/counters; clinical/balance/scheduler
pins; FSRS cards and reviews; cash/accruals, settlements/income and operation
receipts; event/review intents, retired-history summaries and inspection/Level 5
state. Archives keep their state. Opening another campaign does not transfer
FSRS history, and restart creates a new campaign while archiving the previous
one. Local multiple-campaign support must survive cloud adoption, even where
only a bounded subset is enrolled in cloud storage.

### Read-only fixture measurement on 2026-10-17

Only repository synthetic fixtures were measured; no owner browser saves,
private inputs or live player data were read. The measurement was
`Buffer.byteLength(JSON.stringify(parsedState), "utf8")`, exactly the current
serializer body applied to the stored fixture object, **without loading or
normalizing it through the current deserializer**. Decimal MB = 1,000,000 bytes.

| Fixture / checkpoint | Facility level | Compact serialized state bytes | MB |
| --- | ---: | ---: | ---: |
| `level-four-legacy-pre-m3.json` | 3 | 130,872 | 0.131 |
| Integration `integration-l4` | 4 | 795,214 | 0.795 |
| Integration `integration-build` | 5 | 803,955 | 0.804 |
| Integration `integration-preparing` | 5 | 1,366,094 | 1.366 |
| Integration `integration-running` | 5 | 1,408,713 | 1.409 |
| `level-five-economy-checkpoint-20261012.json` | 5 | 1,429,974 | 1.430 |
| Integration `integration-final` | 5 | 1,602,257 | 1.602 |
| Integration `integration-finish` | 5 | 1,587,292 | 1.587 |
| Integration `integration-repeat-final` | 5 | 1,730,730 | 1.731 |
| Integration `integration-repeat` | 5 | 1,631,468 | 1.631 |
| Integration `integration-lower-repeat` | 5 | **1,807,484** | **1.807** |

Integration rows are the nine states in
`tests/fixtures/level-five-integration-checkpoints-20261012.json`, not nine
campaigns to upload together. Its 12,733,417-byte file is a container, not one
save. The nine-state median is **1,587,292 bytes (1.587 MB)**; advanced fixture
play is commonly about **1.4-1.8 MB**. This is a fixture-based planning baseline,
not a measured player median. The **largest observed snapshot is 1,807,484
bytes; the true application maximum is unbounded by the serializer**. Continuing
after the final inspection can grow histories further. Early-level/fresh,
migrated, pathological and prolonged-play coverage remains B2.1/B2.5 work.

At that largest checkpoint, `learningHistories` alone is 520,406 bytes;
`encounters` 213,843; `reviewIntents` 185,655; `events` 167,016; and
`settlements` 145,493. `JSON.stringify(serializedState)` is **1,978,098 bytes**
before the rest of the profile wrapper, showing the current nested-string
overhead. Two equivalent campaigns need roughly twice that plus metadata.
Browser quotas and PostgreSQL JSONB/TOAST/index storage are different measures.
Do not extrapolate gzip sizes into database capacity.

Fixture SHA-256 receipts (the shared tree can change; remeasure before coding):

| File under `tests/fixtures/` | SHA-256 of file bytes |
| --- | --- |
| `level-four-legacy-pre-m3.json` | `9e806c67b15e08ab03760e84206faad89423496a2d80d38a2c0030c84d547ae3` |
| `level-five-economy-checkpoint-20261012.json` | `813572d7ecaa6ffb232b7bed92c72a14067f96927f42219750c1343b111d6582` |
| `level-five-integration-checkpoints-20261012.json` | `3baf8e3d564893d432ca8a2e86c0093648b8ae804c94af922deab0047a2f28dd` |

Reproduce from the repository root with existing Node; no files are written:

```powershell
@'
const fs = require('node:fs');
const dir = 'tests/fixtures/';
for (const file of ['level-four-legacy-pre-m3.json',
  'level-five-economy-checkpoint-20261012.json',
  'level-five-integration-checkpoints-20261012.json']) {
  const value = JSON.parse(fs.readFileSync(dir + file, 'utf8'));
  const states = value.schemaVersion ? [[file, value]] : Object.entries(value);
  for (const [name, state] of states) {
    const serialized = JSON.stringify(state);
    console.log(name, Buffer.byteLength(serialized, 'utf8'));
  }
}
'@ | node
```

The older accounts plan recorded slightly different integration sizes before
subsequent fixture updates. The receipts above describe this inspection; the
planning worker did not regenerate or edit those fixtures.

## 2. Goals and non-goals

Goals: account-owned, multiple named campaigns available from desktop and phone;
automatic verified checkpoints; safe handoff with a desktop tab left open;
explicit, retryable import of selected existing local campaigns; faithful
versioned game/learning/evidence recovery; owner-only player access; bounded
storage/requests; honest status, updated consent and complete deletion coverage.

Non-goals: unrestricted offline play; simultaneous writers or merging progress
within one campaign; a server that runs facilities; background/closed-tab
catch-up; anti-cheat, leaderboards or research analytics; sharing campaigns
between accounts; a new auth provider; moving all device preferences; importing
historical local question flags; changing clinical content, clinical approval,
concept IDs, game balance or FSRS meaning; enabling hosted auth on the owner's
prototype; provisioning, purchases or release execution in this planning task.

## 3. Sync choices and recommendation

| Option | Advantages | Offline / two-device consequences | Fit |
| --- | --- | --- | --- |
| **(a) Explicit Upload campaign / Download campaign** | Clear deliberate transfer, lower request volume, useful checked export/import recovery path. | Both devices can diverge between button presses. Upload still needs expected revision, identity/version checks and a conflict screen. Download must preserve unsent local work before replacing it. Manual habits determine freshness; a forgotten upload strands phone progress. | Useful recovery/import tools, insufficient as the main cross-device experience. Does not by itself meet the accepted single-writer design. |
| **(b) Automatic saves, last-write-wins per campaign plus a conflict prompt** | Smooth when only one device plays; smaller change than server simulation. | Long offline branches, skewed client clocks and an idle desktop's autosave can overwrite real phone progress. A prompt shown after replacement is too late. `updated_at` alone cannot prove both writers shared a base. | **Literal last-write-wins is prohibited** by ADR 0011 and the binding owner decision. Preserve the automatic UX, replace overwrite rules with transactional expected revisions and a fenced writer. |
| **(c) Server-authoritative simulation** | Server executes/validates each transition; stronger integrity and a single execution authority. | Requires an online command protocol, server runtime, latency handling and much larger migration/operations work; offline actions still need an explicit product design. | Not justified for this noncompetitive invited beta; reverses ADR 0017 and requires a new owner architecture decision. |

**Recommend automatic account checkpoints with optimistic revision checks,
one fenced writer per campaign, explicit takeover and conflict recovery.** This
provides option (b)'s convenient saving without its last-write-wins rule and
implements the already accepted direction. The browser computes game state;
the latest **server-accepted revision** is authoritative for continuation.
Manual export/import remains a recovery facility, not the ordinary handoff.

### Revision and writer protocol

Use a monotonic server `revision bigint` per campaign and a separate monotonic
`writer_generation`. Every state/lifecycle write names its exact base revision,
writer token/generation and unique operation ID. The server locks the campaign,
checks fresh account admission, consent, lease and revision, then accepts all
snapshot/evidence changes atomically or rejects all. A client cannot choose the
next revision. `updated_at` is generated by the server for human-readable status
and list freshness; never select a winner using client wall clocks, facility
ticks or timestamp comparison. Concurrent compare-and-swap rejects a stale
write even if its timestamp is newer. A fencing generation rejects an old
writer after takeover even when no later snapshot has yet been saved.

Starting engineering defaults, inherited from the prior plan and to be tested:
60-second lease, renewal every 15 seconds, ordinary dirty checkpoint every
60 seconds, and an early coalesced checkpoint after scored answers, important
purchases, pause/mode exit, campaign switch and Save & Close. Do not upload on
each tick, frame or localStorage autosave. Clean/read-only tabs never upload a
snapshot or automatically take a lease. One writer **per campaign** permits
different campaigns on different devices; it does not merge their histories.

Load only campaign summaries on sign-in, then the selected campaign's current
snapshot and required evidence. Verify/hydrate before acquiring a writer against
that revision. Acquisition/takeover must return the accepted revision; if it
changed during the fetch, refetch before enabling commands. Poll small metadata
on focus and at a bounded interval while waiting; Realtime is optional for quick
revocation notices and is never the safety mechanism. Never poll whole saves.

### A phone plays while the desktop tab remains open

If desktop holds a valid lease, phone opens a read-only view:
"This campaign is open somewhere else. Continue here? Only progress saved to
your account can move here." **Continue on this device** atomically advances
the generation, revokes the desktop token and grants the phone a new token.
The phone loads/verifies the latest accepted state before playing. **Not now**
leaves it read-only. Do not silently revoke a live lease merely by opening a tab.

Desktop learns revocation on its next save/renewal or focus check, pauses
commands and ticks, and keeps unsent bytes: "You continued on another device.
Recent changes here have not replaced your account save." It may continue to
compute briefly before detection, but those writes cannot commit; the phone
warning must not promise immediate remote suspension. A hidden desktop already
pauses under the current lifecycle rule. On return it must revalidate before
Resume, not push its cached paused state. A visible but unattended tab can
retain its lease until an explicit takeover; it cannot block a phone indefinitely.

Save & Close pauses, awaits a confirmed checkpoint, then releases the lease
with the same generation. A delayed release from an old generation cannot
release the new phone writer. Lease expiry after a crash allows a new writer
to load the latest account save; expiry never authorizes stale queued work.

### Offline, lost responses and refresh

This remains an online-required campaign. A detected connection loss, failed
save or failed renewal starts a **30-second maximum grace**, also capped by
the conservatively calculated remaining server-confirmed lease validity.
Pause immediately if the lease is uncertain/expired, local durability fails or
the pending-size limit is reached. Stop all state-changing commands as well as
ticks; pause is not only an animation overlay. Viewing status, retry, export,
sign-in and deletion controls remains available. No offline sign-in or fresh
cloud campaign load, hidden-time progression or automatic catch-up.

Keep the last acknowledged account state and one bounded recovery record per
open campaign in account-scoped IndexedDB. That record contains an immutable
in-flight request/operation ID plus at most one coalesced following state and
new evidence tail. Preserve it across refresh; never mutate/reuse an in-flight
ID for different bytes. Proposed total cap: **7 MB** (up to 3 MB in-flight state,
3 MB following state and 1 MB evidence/receipts), separate from the confirmed
cache. Measure actual recovery-envelope bytes; escaping/metadata also count
toward the total. It is a bound, not seven MB promised by every browser.

Retry/query the identical operation after a lost acknowledgment before creating
a new write. A successful receipt acknowledges exactly the covered work, not a
newer coalesced candidate. Rebase the following candidate onto that receipt
without re-running answers or purchases. On reconnect, refresh admission and
server state first. An expired lease can be reacquired only if the base remains
unchanged; a new lease cannot bless a stale branch. Clock jumps, sleep and slow
responses must not extend grace or lease validity. Explicit Resume follows a
successful recovery; no surprise unpause.

If the server revision or generation has advanced, preserve local recovery and
offer **Use account save**, **Keep a recovery copy**, or **Not now** (paused).
Show campaign name/level and last confirmed time, plus "changes waiting here";
put revision details behind diagnostics. Never offer a destructive one-click
"force overwrite". Recovery as a separate campaign requires explicit naming,
quota and verified internal-reference migration; until that exists, retain or
download a checked recovery file. No merge of cash, FSRS, answers or patients.

## 4. Capacity for about 30 players

Use the requested **500 MB project database** as the planning limit. The accounts
plan's manager-verified 2026-10-13 facts also include **5 GB egress/month** and
possible Free-project inactivity pauses. No current provider terms, live usage
or physical storage were checked in this no-network task. Reconfirm limits and
available game-project space before enabling Beta 2; leave the ergonomics
project alone. No purchase is authorized.

Snapshots, evidence, Auth/app data, indexes, TOAST, retained/dead rows and other
Beta 1 tables share the project. A compression estimate is not a free-space
guarantee. Retain **current plus one verified prior cloud snapshot**, with
immutable evidence stored once and complete logical state reconstructed on
load. A full fidelity-preserving snapshot may temporarily duplicate evidence
for a first codec milestone, but that cost must be counted; a snapshot-only
implementation cannot silently drop the accepted immutable-evidence boundary.

For **two cloud campaigns/player, two snapshots/campaign**:

| Raw planning scenario | Per player snapshots | 30-player snapshots | Evidence allowance (1 MB/campaign) + other shared allowance (50 MB) | Planned total before measured variance |
| --- | ---: | ---: | ---: | ---: |
| Observed largest fixture, 1.807484 MB/copy | 7.230 MB | 216.898 MB | 60 + 50 MB | **326.898 MB** |
| Target 2 MB/copy | 8 MB | 240 MB | 60 + 50 MB | **350 MB** |
| Every copy at 3 MB acceptance ceiling | 12 MB | 360 MB | 60 + 50 MB | **470 MB** |

The 470 MB scenario leaves only 30 MB below the provider limit and exceeds the
prior plan's 400 MB working ceiling. **The earlier 25-player allowance cannot
simply be relabeled 30.** Evidence and the 50 MB shared allowance are hypotheses,
not measured maxima; old append-only financial/inspection history may need more.

Recommended starting policy, subject to B2.5 and owner question 1:

- Two enrolled cloud campaigns/account, counting resumable, archived and cloud
  recovery campaigns; additional existing campaigns remain local and intact.
  Archive/restart must disclose that an archive still occupies a cloud slot.
- Target <=2 MB per snapshot, hard candidate ceiling **3,000,000 bytes**;
  **8,000,000 aggregate retained snapshot bytes/account** and up to
  **2,000,000 immutable-evidence bytes/account**, with a 1 MB/campaign starting
  evidence allowance. These bounds include all enrolled campaigns, not per
  device. A 3 MB campaign can use six MB for current/prior; the other campaign
  has only the remaining snapshot budget. Never advertise two unrestricted
  3 MB campaigns under this policy.
- This reserves up to **10 MB/player, 300 MB for 30**, plus 50 MB for shared
  data/overhead = **350 MB**, leaving 50 MB below the **400 MB working ceiling**
  and a further 100 MB below the provider cap. Physical measurements may require
  stricter limits. Quotas must include metadata and all history rather than
  shifting data into an uncounted table.
- Warn on approaching per-account limits; owner operational alert at 300 MB
  actual database size. At 400 MB stop new enrollments/imports and optional
  growth. Every save needs a server-side reservation including new-copy,
  evidence, index and cleanup margin; pause existing play when safe commit
  capacity cannot be assured. Concurrent imports cannot each spend the same
  remaining space. Do not wait for provider read-only failure.

Do not truncate FSRS, accepted reviews, money records, frozen content or
inspection history to fit. Existing valid local saves over a proposed limit
remain local/exportable and clearly ineligible for enrollment, not "corrupt".
For a growing cloud campaign, warn early and preserve confirmed/pending state
if capacity is reached. Lossless normalization, revised limits after evidence,
or an owner-approved paid plan is the next step; silently removing a prior copy
or enabling unlimited local divergence is not a solution. Restart at the cloud
campaign limit must not destroy the archive; offer a new local campaign or an
explicit checked export/removal workflow only if separately implemented.

Measure `pg_database_size`, `pg_total_relation_size`, table/index/TOAST sizes,
dead tuples, cleanup/autovacuum behavior and peak transactional allocation via
the restricted owner route. Run repeated writes for hours with 30 synthetic
accounts and long/repeat-inspection fixtures, not just one insert. Demonstrate
both steady state and temporary third-copy/dead-row pressure. App-level JSON
bytes are a conservative allocation input, not a replacement for physical
measurements. If the evidence allowance or operating reserve fails, the Free
rollout does not pass merely because current fixtures fit.

Egress also matters: 30 players x one 2 MB download/day x 30 days = **1.8 GB**;
four 350 MB weekly exports = **1.4 GB**, total **3.2 GB** before overhead. Three
full downloads/player/day would instead total **6.8 GB with those exports**,
above the inherited 5 GB allowance. Desktop -> phone -> desktop is a realistic
source of extra opens. Measure real compressed transfer and evidence hydration,
cache by immutable hash/revision, download only the selected current campaign,
and return small write receipts. Do not assume compression, provider-pausing
avoidance or unlimited device switching; inadequate measured transfer is also
a capacity/plan gate. Do not create artificial keep-alive traffic.

## 5. Explicit migration and the owner's prototype

"First sign-in" here means the first cloud-capable session after Beta 2 is
enabled; existing Beta 1 players already have account-local campaigns. Do not
wait for a new registration and miss their saves.

1. Fetch account summaries after authentication and cloud-notice acceptance.
   Inspect only this account's local profile and any explicitly offered unowned
   legacy source **at this origin**. Never read another account's namespace.
   Preserve a raw source recovery copy before parsing/migrating; do not use the
   ordinary loader's fresh-profile fallback as permission to overwrite damage.
2. Show account and device-local lists separately, with names, levels, statuses,
   sizes and checkboxes. Offer **Copy selected local campaigns to my account**,
   **Use account campaigns**, and **Later**. Nothing uploads on sign-in alone.
   Copying unowned campaigns needs an explicit claim to the displayed account;
   existing account-local campaigns also require an explicit first enrollment.
3. Validate versions, IDs/references, pins, frozen content, FSRS/history,
   tutorial state, checksums and quota; show per-campaign eligibility. Imported
   local timestamps remain provenance, not cloud revisions or trusted dates.
4. Use a stable import operation/source digest per campaign. Create campaign,
   baseline evidence and initial snapshot in one transaction. Mark historical
   reviews as import baseline, never new answered-question counts. Preserve
   already minted Beta 1 count receipt IDs; finish them only through their
   existing deduplication path, without minting a second set from history.
5. Fetch and verify/hydrate the accepted cloud state, including logical round
   trip and identity/history comparison, before marking this campaign enrolled.
   Keep original local/legacy bytes; a marker is additive, not destructive.
   Partial multi-campaign success is reported individually and is retryable.
6. A proven identical import retry is a no-op; a later changed local branch is
   not. Same ID with different content, same normalized name with different ID,
   an existing newer cloud revision, oversize, unsupported or damaged data
   prompts a choice/rename or stays local. Never replace by name or ID match.
   Recovery copies need verified ID/reference migration and their own slot;
   preserving the original in-game ID is the normal import path.

During enrollment, freeze the selected source revision or pause it while a
checked snapshot is taken. Pending edits arriving during upload must remain
explicit pending work, not disappear behind an "import complete" marker.
Crash after server commit but before local marking must recover from the import
receipt. Do not automatically upload historical local flags, Auth credentials,
pending voluntary comments or unrelated browser keys with a campaign.

**Owner prototype: keep `START_GAME.cmd` -> exact
`http://127.0.0.1:4173` in the intended persistent browser profile. Its prototype
mode has no account, makes no cloud-save calls and its campaigns stay local.**
`location.origin` there is `http://127.0.0.1:4173`. Pages cannot read that storage.
Do not configure local Auth, change launcher/host/port/profile, or claim that
enabling Beta 2 migrates the owner's existing local campaign.

For account campaigns, the intended cross-device opening path is the existing
**`https://melissarowlandc-afk.github.io/GamifySurgery/`** on both devices, with
the same invited account. Its `location.origin` is
`https://melissarowlandc-afk.github.io`; the `/GamifySurgery/` deployment path
must remain correct. Other origins/profiles keep separate local caches; only
deliberately authenticated builds using the same backend/account can share
accepted cloud data. The private phone prototype also remains separate.

An eventual owner-requested prototype-to-account copy should use an explicit
checked export at the canonical local origin and file import on Pages. This is
optional and not required for automatic Beta 1 account-local migration; it
must not silently enable an account on the prototype. Keep original local
bytes and stable IDs. Any future durable opening-path change belongs in the
manager's handoff before that task closes. Diagnose persistence with
`location.origin`, build/protocol version and account scope, without tokens or
full saves in support logs.

## 6. Schema, validated RPCs, RLS and privacy

### Logical schema sketch, not an executable migration

Use new additive migrations after the existing Beta 1 sequence. Do not alter
the historical SQL files or assume automatic Data API grants. Schema names are
proposals; the boundaries below are acceptance requirements.

| Record | Key fields and enforced contract |
| --- | --- |
| `public.campaigns` | PK `(owner_id uuid, campaign_id text)`, FK owner to Auth with deletion cascade; normalized unique campaign name per owner, resumable/archived status, immutable seed/version pins, increasing current revision/hash, server-created/updated times, import/restore provenance. Player reads own summaries only; lifecycle mutations through RPC. Store per-campaign tutorial/guidance metadata with campaign authority, not a competing global profile. |
| `public.campaign_snapshots` | PK `(owner_id, campaign_id, revision)`, composite FK to owned campaign; cloud envelope/codec version, game schema/version pins, validated operational `payload jsonb`, SHA-256, authoritative measured bytes, server accepted time and evidence high-water references. Retain current plus one verified prior; rows immutable while retained. Snapshot references exact frozen content/evidence versions. |
| Normalized campaign evidence | Owned composite campaign FK; immutable review/episode/scored-decision identities and frozen versions, current FSRS cards plus append-only reviews, auditable money/settlement records and inspection attempts. Unique evidence/operation IDs, parent revision and ordering. Each fact has one canonical owner; snapshots can cache totals only with reconciliation. Exact tables/field mapping are B2.1 deliverables under ADR 0019. |
| `gamify_private.campaign_writers` | One row per owned campaign: random opaque session token hash, generation, server expiry. Tokens are scoped to the account/campaign/session; no device name, hardware ID, fingerprint or user agent. Only fenced lease RPCs can update it. |
| `gamify_private.campaign_operations` | Owned campaign + operation ID, complete immutable request digest, expected/accepted revision and small result. Same ID/same request returns original receipt; changed reuse rejects. Bound ordinary receipts (proposed seven days), retaining import provenance/evidence dedup for campaign life. An expired unknown operation cannot be blindly replayed or mint new evidence. |
| Private cloud access/quota state | Separate account cloud-enabled capability, accepted cloud-notice version/time, protocol floor, size reservations and bounded rate counters. Reuse the existing membership/revocation/deletion authority and lock order; separate cloud consent from Beta 1 usage consent so rollout does not silently invalidate or expand it. No client-writable admission/role/quota fields. |

Cloud consent does not enable optional usage recording. The cloud guard reuses
the admission/deletion checks without requiring Beta 1 usage consent; only an
eligible count receipt under the player's existing usage acceptance can affect
the two-total report. Declining usage does not authorize counting indirectly
from uploaded learning history.

Use `auth.uid()` for ownership, not a browser-supplied owner ID. Enable RLS
before grants. Player SELECT policies require own `owner_id`, a live admitted
membership and appropriate cloud consent; child access also proves the owned
parent. Anonymous access and cross-player reads/writes are denied, even for a
guessed campaign/revision. Revoke direct INSERT/UPDATE/DELETE from players;
only constrained RPCs may mutate campaigns, snapshots or evidence. Neither a
usage-owner report role nor the question-flag reader gains campaign access.
Owner support/export is a separate restricted operational route, not a global
player-facing RLS exception.

Mirror the existing public **security-invoker wrapper -> private validated
helper** pattern. Private helpers that need definer rights use fixed empty
`search_path`, fully qualified objects and explicit authorization. Revoke
default/PUBLIC/anon EXECUTE, grant only named functions as needed, and keep
`gamify_private` out of exposed API schemas. Explicitly audit grants including
`service_role` and transitive validator execution; the Beta 1 owner-tool grant
fixes show why RLS alone or assumed defaults are insufficient. No owner secret
or database password goes into `VITE_*`, browser cache, a save or this document.

Fresh checks must use the latest setup-link rules: membership plus confirmed,
live, nonanonymous, nonbanned Auth identity admitted through provider invitation
**or the trusted `gamify_setup_admitted` app-metadata marker**. User-editable
metadata never admits a player. Check deletion/revocation at every read/write,
renewal, import and takeover, including with a stale valid-looking JWT.

### Save API and validation contract

Proposed small public RPC surface: get cloud capabilities/list summaries; load
one campaign/revision and required evidence; acquire/renew/release/take over
writer; save; import; archive/restore; query operation outcome. Archive/restore,
rename and restart obey revision/fencing rules too. Unsupported or retired
client protocols are rejected server-side; a frontend-only flag is insufficient.

For a save transaction, lock in a documented consistent order (membership,
account reservation, campaign/writer), then:

1. Require live admission, cloud consent/capability and a compatible protocol.
2. Check the full request digest against an existing operation receipt; identical
   retries return their original result even if the lease subsequently changed,
   but never bypass deletion/revocation. Reject conflicting ID reuse.
3. Validate writer token/generation and conservative server expiry, and compare
   `expected_revision` with current. No partial evidence or usage commit on
   revision/lease conflict. Serial transactions choose a winner, not timestamps.
4. Validate envelope/schema/pins/identity, JSON types, finite supported numeric
   ranges, nested collections/references, payload/evidence sizes, operation
   uniqueness and limits. Verify new evidence appends to the accepted baseline;
   reject removed/edited accepted reviews, money records or inspection evidence.
   Reconcile cash/cards/cached totals to canonical evidence as specified in the
   codec. SQL must perform real structural/basic-invariant checks; a client
   `deserializeGameState` call is not server validation or proof of gameplay.
5. Reserve capacity and atomically append evidence, write snapshot, advance
   revision, record any eligible opaque count receipt through **one existing
   deduplication path**, and store the save receipt. Imported history does not
   count. A Beta 2 scored transition must not be counted twice by both the
   local usage outbox and the cloud RPC; retain already issued Beta 1 IDs.
6. Commit and return only operation ID, accepted revision/hash/bytes/server time
   and relevant evidence high-water marks. Replace local confirmed state only
   for that receipt. Retire excess cloud snapshots only after the replacement
   and required prior are valid/durable; measure transient allocation.

Checksum proposal avoids comparing JS `JSON.stringify` to reordered JSONB:
send bounded UTF-8 payload text plus its request hash, have the server verify
and parse it into JSONB, and store **one** JSONB payload. The server computes a
separate stored hash over its canonical `payload::text` UTF-8 representation.
A load RPC returns that exact canonical text and stored hash; the client hashes
those bytes before parsing/hydration. Request digest covers every material
argument, including evidence and lifecycle metadata; do not confuse it with the
stored snapshot hash. Save receipts acknowledge the request digest as well as
the server hash. Golden vectors must prove Unicode, number precision, key order
and whitespace handling preserve logical state across JS/PostgreSQL. This is a
codec milestone gate, not a claim that the existing repository already supports
this protocol. Do not persist a second full text copy just to get a matching hash.

Proposed engineering limits (not clinical thresholds): <=3 MB decoded candidate
state, <=1 MB new evidence/recovery tail, and a **6 MB transport-body ceiling**
that includes JSON string escaping/metadata; cap collection counts/depth and
text lengths. Also enforce the 3 MB server-canonical snapshot ceiling and the
account aggregate budgets. Measure the real encoded body and reject before
expensive processing where the gateway permits; SQL checks cannot by themselves
stop an oversized request before HTTP parsing. Verify the actual hosted RPC
gateway limit with synthetic maximum-size requests; add a thin bounded ingress
only if direct RPC cannot satisfy the tested size/abuse contract. Never ship a
service secret or weaken authorization to get large saves through.

Initial rate proposals: <=6 newly accepted checkpoints/campaign/minute and <=12
per account/minute; <=30 total cloud mutation/lease calls/account/minute; <=6
full-snapshot loads/account/minute, with small metadata reads separately bounded.
Coalesce urgent bursts without dropping evidence. Use server-time counters and
membership/account locking, not client timers alone. Identical retries consume
request-abuse budget but no second snapshot/evidence allocation. Return retry
delay and preserve/possibly pause pending work; do not disguise throttling as
success. Validate the cadence with two campaigns, renewal, takeover, reconnect
and short bursts so quotas do not create routine false connection-loss pauses.

### Evidence fidelity before implementation acceptance

B2.1 must map every persisted field to operational state, canonical immutable
evidence, mutable card projection, campaign metadata or device-only preference.
Current retired encounters/service summaries and bounded event/receipt views
are **not a complete historical ledger**. Preserve all available imported data
as an immutable import baseline and mark its historical limitations; never
invent missing individual money/review/inspection events. Capture new evidence
before runtime retirement from cloud adoption onward. If current reducer
outputs cannot provide the required deltas, return that gap to the manager for
a separately owned domain lane rather than fabricate evidence or silently
weaken the ADR. Hydration must recreate the same supported full logical state,
not resolve old questions against today's mutable clinical release. No clinical
meaning, random stream, answer order or FSRS change is authorized by storage work.

### Notice, retention and delete-my-data

Before any enrollment/upload, show a versioned cloud notice explaining that
Supabase now stores the full functional campaign, including synthetic cases,
choices/learning history, facility and financial/inspection state. The owner's
routine usage report remains only total playtime and question counts; that must
not be misworded as "only counts are stored" after cloud saves. No clinical
research/analytics or bulk campaign access for the feedback pipeline. Publish
the verified region, access/support purpose and backup schedule in the notice.
Continue the no-real-patient-information and unapproved-clinical-content notices.

Cloud campaigns/evidence remain for account gameplay until explicitly removed
under the approved lifecycle or account deletion; **do not apply the 90-day
usage/feedback purge to campaigns or FSRS**. Ordinary operation/rate records
are bounded separately; deletion removes them too. Default sign-out preserves
account-scoped local recovery, with an explicit clear-this-device choice and
plain shared-device warning; no unconfirmed work is silently discarded.

The current Account menu says **Delete my usage data** and promises clinics
stay local. Beta 2 must provide a clearly scoped **Delete my data/account**
confirmation covering cloud campaigns and immutable evidence. Use a new
versioned full-deletion RPC with explicit scope/notice confirmation; do not
silently widen the destructive effect of the old usage-only endpoint behind
an old client's wording. For a cloud-enrolled account, the legacy endpoint
must reject with an update-required result and leave data intact until the
player uses the new confirmation. Non-enrolled Beta 1 accounts retain the
existing behavior. Test this mixed-client transition before rollout.

The full-deletion transaction extends the existing implementation pattern:
lock membership, set deletion blocker, invalidate writer generations, stop
queues and remove campaign snapshots, evidence/cards,
operations, reservations and cloud-consent data along with existing usage,
flags and feedback. Auth foreign-key cascades are a second deletion path, not
the entire procedure. Privileged deletion is the explicit exception to evidence
immutability; test both paths and that account B survives.

Once the request is confirmed, no stale/offline client may recreate rows or
restore notice/admission. If the request cannot reach the service, say deletion
is **not confirmed**, stop local uploads and let the player retry. Preserve the
existing owner administration/support completion target of seven days for
remaining Auth/invitation/private export cleanup; update the owner tool/runbook
so it cannot omit new cloud tables. Offer removal of only this account's local
cache/recovery/pending queues at this origin; never erase another account or
unowned prototype. Explain that other offline browser copies cannot be remotely
erased and must be cleared there. A minimal protected deletion ledger must
outlive the backup retention window so restoring a backup cannot resurrect a
deleted account; disclose its limited purpose/retention and remove unnecessary
identity details. No public logs or save payloads in error analytics.

## 7. Client work in both shells

Use one account-scoped coordinator above entry and both shells, not two sync
implementations. Extend the shared session/shell contract with asynchronous
save state and actions; the current synchronous `PrototypeSaveResult` and
"Safe to close" UI cannot imply a network acknowledgment. Prototype mode keeps
its existing local behavior and explicit **Local only** label.

| State | Player-facing behavior on desktop and phone |
| --- | --- |
| Checking account save / loading | Disable state-changing play until admission, version, snapshot and writer status are known; offer retry, no blank fresh replacement. |
| Saved to account | Persistent compact status plus last confirmed time; details identify campaign and separate local recovery from account confirmation. Announce meaningful changes accessibly without every heartbeat. |
| Saving / recent changes waiting | Clear pending status. Save & Close waits for confirmed checkpoint and lease release; local persistence alone says "Saved on this device; account save waiting." |
| Open elsewhere / takeover | Same explicit Continue here / Not now dialog and warning in both shells. Read-only cannot execute purchases, answers, restart, archive or Resume. |
| Offline / unavailable provider | Explain local recovery, pause by grace/lease rule and offer Retry; login expiry offers sign-in as the same account. Do not turn a failed request into a new empty campaign. |
| Newer save / lost writer | Pause and present account-save, recovery-copy and Not now choices. Preserve both branches until a verified choice. |
| Quota, storage blocked/full, throttled | Distinguish account capacity, browser durability and temporary rate failures. Preserve confirmed/pending data, give actionable retry/export/contact-owner state; no misleading cloud checkmark. |
| Unsupported/corrupt save / old client | Preserve bytes, offer update/recovery and owner support; never overwrite with fresh state or automatically restore a prior revision. |
| Revoked/deletion-requested | Immediately stop commands/uploads/renewal, invalidate in-memory ownership and show blocked/deletion state. Delayed callbacks cannot write for another signed-in account. |

Show a compact always-visible status in desktop chrome and the phone header,
with details/retry in Account/Save and campaign cards labeled **Account** or
**This device only**. Reuse dialog wording/state across desktop campaign manager,
phone adapters, opening flow and restart/restore. Keyboard focus, screen-reader
status, touch targets, long names, narrow screens and no reliance on color are
acceptance requirements. Keep protocol tokens/revision machinery out of the
normal player journey; expose redacted technical details only for support.

Use a backend+account+campaign namespace in the new IndexedDB cache, verified
transactions/readback and cross-tab coordination (Web Locks/BroadcastChannel
when available); server fencing remains authoritative when those APIs are
missing. Keep original unowned IndexedDB/database/localStorage data untouched
until explicit checked migration; do not adopt the existing global repository
as-is. Bind in-flight work and callbacks to their originating account. Never
store Auth/service secrets in snapshot or pending payload records. Do not rely
on `pagehide`, `beforeunload`, fetch keepalive or mobile shutdown to deliver a
multi-MB final upload; checkpoint while active and provide Save & Close.

## 8. Validation, rollout and rollback

### Unit and integration coverage

- Codec: all saved fields/pins, frozen encounters and exact randomized choice
  order, FSRS cards/reviews/timezone, money reconciliation, inspection history,
  RNG stream states/counters and retired summaries; old schemas, unsupported
  future schemas, migrations, Unicode and numeric hash vectors. Property/fixture
  round trips compare logical fidelity, not a weakened shallow shape assertion.
- Cache/coordinator: A/B/prototype/backend isolation; metadata + usage staging
  atomicity; verified local writes; quota/security/blocked IndexedDB failures;
  crash before/after local commit and server commit; lost ack with an unchanged
  in-flight ID; one coalesced tail; 7 MB cap; clock jump/sleep; stale callback,
  rapid account/campaign changes; reauth and incompatible protocol. Assert
  commands/ticks are stopped when paused for sync, not just disabled buttons.
- Import/lifecycle: opt-in and decline; existing Beta 1 accounts; legacy source
  preservation; archive/restart/restore; identical retry vs changed source;
  ID/name collision; partial batch; oversize/invalid; import concurrent edits;
  historical count baseline and one count-only receipt path. Hash original
  storage bytes before/after declined or failed imports.
- Real disposable SQL/Data API: A/B/anon grants and RLS; guessed child IDs;
  direct-write and private-helper denial; setup and legacy admission; false
  user metadata; expired/banned/revoked/deleted identities; server clocks;
  size/rate/account and global capacity races; schema checks; evidence mutation
  rejection; identical/conflicting operation reuse; all-or-nothing snapshot,
  evidence and count. Use two actual DB sessions for save/takeover/renewal and
  deletion races, not sequential mocks labeled concurrency.
- Operational: maximum request bodies through the real ingress, physical DB
  growth over repeated saves/cleanup, 30-account/60-campaign load and peak
  reservations, transfer volume, read-only/full/unavailable project behavior,
  private backup and isolated restore, deletion replay and old-client rejection.

### Two-context Playwright and physical phone

Add `tests/e2e/cloud-saves.spec.ts` with independently authenticated browser
contexts (desktop and phone viewport) sharing **only the disposable backend**,
not localStorage or a manually copied latest save. Include a two-tab/same-profile
case separately. Run repeatable transport-fault tests plus real Data API tests;
mocked HTTP success is not hosted/RLS acceptance. Synthetic users only.

1. Desktop imports/plays/saves; phone signs into the same account, sees all
   enrolled campaigns and continues the correct state. Return to desktop after
   phone Save & Close; compare exact saved progress/history/cash/order, with no
   extra FSRS review, purchase or count.
2. Leave desktop visible and then hidden in separate cases. Phone takes over;
   desktop cannot save or release the phone's lease, and cannot Resume without
   a fresh check. Race two takeovers and simultaneous saves; one generation and
   expected revision win. Read-only open never takes over by itself.
3. `context.setOffline(true)`: short outage within grace, outage past expiry,
   refresh offline, desktop offline while phone advances, return without change,
   lost save response after commit, slow/out-of-order response, server unavailable
   while browser reports online. Assert bounded recovery and explicit conflict,
   preserved branches and no catch-up/replayed answers.
4. Account switch/sign-out during an upload, account B isolation, deletion while
   another context holds a lease/pending save, and reconnect of the old context.
   No resurrected cloud rows or cross-account UI/callback contamination.
5. Oversize/unsupported/corrupt saves, blocked local storage, rate/capacity limits,
   server-disabled feature and old client. Status and Save & Close wording must
   match what is actually durable on both shells.

The manager must also verify a physical phone browser's suspend/resume/tab-close,
touch dialogs and keyboard, and a real desktop -> phone -> desktop handoff.
Chromium phone emulation alone does not establish mobile background behavior.

Run browser/DB work only in a manager-approved disposable environment with
synthetic accounts, separate caches and exact recorded URL/origin. For local
QA prefer dedicated `http://127.0.0.1:5184` with its disposable browser profile;
it has separate storage and does not move owner 4173 saves. Do not start an
auth-configured QA server over the owner's canonical port, change a launcher or
use owner storage as a test fixture. The workers' unelevated sandbox may block
browser launch; the manager owns reruns in a capable environment.

### Rollout

1. Manager accepts owner choices, field/evidence contract and capacity gates.
   Schedule future domain work after current clinical/game-domain lanes hand
   back; inspect actual shared changes before assigning overlapping files.
2. Prepare additive SQL, tested client and private recovery/backup runbook;
   rehearse on disposable data. No live secret or real save in Git/artifacts.
   Freeze and identify tested app, protocol, migration and release versions.
3. Apply reviewed additive schema through the authorized owner/manager route,
   with cloud capability **off by default**. Confirm grants/RLS and revocation.
   New notice/opt-in precedes first functional save, not a blanket backfill.
4. Enable for the owner account using a synthetic or deliberately selected
   account-local campaign, then a small consenting tester cohort (proposed 2-3),
   then the remaining invited accounts up to about 30 after handoff/error and
   storage/transfer evidence passes. Do not enroll the owner prototype by default.
5. Give testers one plain opening instruction: use the existing Pages URL on
   both devices and the same account; copy selected local campaigns; wait for
   "Saved to account" or Save & Close before changing devices. Explain takeover,
   brief-offline pause, local-only extras and recovery/support. The owner sends
   any tester messages; this plan/worker sends none.
6. Monitor essential redacted failures, aggregate capacity/transfer and backup
   health, without campaign/answer analytics. The manager reviews actual diffs,
   full logs and SQL/browser evidence before acceptance. A validated checkpoint
   is local-only until an authorized audited GitHub backup; manager owns the
   **"push to GitHub"** reminder/checkpoint and release under existing authority.

### Backup, recovery and rollback

Recommended private **weekly logical export**, two generations expiring within
**14 days**, encrypted and outside the public repository, includes campaigns,
retained snapshots, canonical evidence, version manifests and ownership mapping.
It supplements the one prior cloud revision; neither protects progress since
the last successful export against total project loss. State that recovery
point explicitly. Confirm Auth recovery/identity mapping separately; a gameplay
export does not recreate passwords or Auth configuration. Restore into an
isolated disposable database and reconcile deletion records before access.

Corrupt/incompatible current state pauses writes and preserves bytes. A verified
prior snapshot can seed an explicit recovery campaign after quota/identity
checks; it must not erase later accepted immutable evidence. Same-campaign
recovery requires owner-reviewed evidence reconciliation and a **new higher
revision**, never a revision rewind. Later progress remains preserved for
diagnosis; historical reviews do not become new usage counts.

For a bad release, disable new cloud enrollments and use a server protocol/
capability gate to pause incompatible writes/renewals while preserving data and
local pending records. Keep read/export/recovery available when safe; tell
players account saving is unavailable. Publish a tested compatible client under
the manager's existing release authority. Do not destructively roll migrations
back, overwrite cloud saves from old caches, or claim an old Beta 1 local-only
artifact will seamlessly continue a newer cloud campaign. A backend capability
off state must be distinguishable from prototype/local mode, so it cannot
silently authorize divergent local play. Restore/rollback drills must prove
that deleted accounts are not reintroduced and old tokens cannot resume writes.

## 9. Bounded milestones, ownership and acceptance

Normally one write-capable Sol worker at a time. The manager assigns explicit
files after reviewing the shared tree, does planning/integration/acceptance and
records the durable handoff. Workers preserve concurrent work and do not spawn
agents, commit, push, publish, install or contact anyone without an express new
brief. No milestone below authorizes clinical edits or clinician approval.

| Milestone / future lane | Bounded ownership and deliverables | Validation and acceptance |
| --- | --- | --- |
| **B2.1 Codec and evidence contract** | New `apps/player/src/session/cloud/codec*` and focused tests; field/evidence mapping and measured envelope. Read domain/persistence by default. Manager assigns a separate explicit domain evidence-export lane only if audit finds gaps and current domain workers have handed back. Define baseline import, normalized evidence/card ownership, hash/load contract and cloud-format version. | Run focused player codec tests and workspace typecheck; domain tests only for any approved domain change. Golden JS/SQL vectors and full logical round trips for all measured fixtures/old schemas; complete field ownership, no invented history or lost frozen/FSRS/money/RNG state. Remeasured <=target/ceiling or explicit capacity failure. No server/client rollout. |
| **B2.2 Transactional server** | New uniquely named `supabase/migrations/*_beta2_cloud_saves.sql`, `supabase/tests/beta2_cloud_saves.sql` and test instructions. Account/campaign/snapshot/evidence/operation/lease/notice/quota schema, constrained RPCs, additive deletion extension and protocol gate. | Real disposable SQL and Data API assertions, two-session concurrency/crash tests; A/B/anon isolation, fixed grants/search paths, stale generation/revision denial, atomic evidence/count/save, compatible baseline consent, limits and deletion. All prior Beta 1 SQL tests still pass. Migration is reviewed before any live application. |
| **B2.3 Shared cache/sync coordinator** | New `apps/player/src/session/cloud/*` transport/coordinator/cache tests; explicitly scoped adaptation of `localCampaignRepository.ts`, account namespaces and `usePrototypeSession.ts`. No shell redesign. Bind lifecycle/commands, versioned cache, bounded pending state, idempotency, grace and fencing. | Focused cloud/session/account tests and typecheck; fake IndexedDB and fault-injected transport prove durable boundary, one frozen request/tail, caps, reauth/switch/expiry, no stale commits, no silent local fallback and no duplicate usage/evidence. Prototype fixture behavior and original local keys preserved. |
| **B2.4 Entry/import and both shells** | `App.tsx`, shared shell contract, `AppShell.tsx`, `mobile/MobileShell.tsx`, phone adapters, campaign/opening/save/account UI and focused CSS/tests; cloud migration UI/markers only in owned cloud modules. Versioned cloud notice and safe deletion/sign-out wording. | Full player suite/typecheck plus focused two-context browser runs. Same state and statuses on desktop/phone; opt-in import with raw bytes retained; name/ID/size errors; account callbacks; takeover/recovery; async Save & Close; archive/restart slot behavior; keyboard/touch/accessibility. Manager checks actual phone. |
| **B2.5 Capacity, backup and integrated recovery** | Dedicated synthetic `tests/e2e/cloud-saves.spec.ts`, future read-only capacity/load harness and a private-backup/restore setup runbook; avoid editing current game evidence fixtures to make limits pass. | All unit/SQL suites, physical DB/egress measurements for 30 accounts and 60 campaigns plus long play, transient space/cleanup, ingress bounds, unavailable/read-only service, deletion-aware isolated restore and compatible rollback. Demonstrated <400 MB working budget with reserves; realistic transfer fits allowance. Otherwise manager escalates lossless storage/limits/plan before enablement. |
| **B2.6 Manager acceptance and staged enablement** | Manager owns final reviewed manifest/diffs, owner decisions, handoff, backup checkpoint, authorized SQL application, cloud capability cohort and release. Workers may get separate bounded validation briefs. | Required regression/build commands and live synthetic handoff/deletion smoke tests pass; notice/campaign/backup choices settled; rollout/rollback gates operational; no changed owner prototype pathway. Owner and small tester cohort demonstrate desktop -> phone -> desktop before broad enablement. |

Suggested exact command contract for future briefs (new files above must exist
first; none of these suites/builds/DB/browser commands was run by this planning
worker):

```powershell
# B2.1 / B2.3 focused player tests; use existing installed dependencies.
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/session/cloud
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/session/accountStorage.test.ts src/session/accountSessionIntegration.test.tsx src/session/localCampaignRepository.test.ts

# B2.4 / integrated regression.
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1
npm.cmd run typecheck

# B2.2 / B2.5: ONLY a previously provisioned disposable DB, using private env.
# Manager verifies target and migration order first; never print the env value.
psql --dbname "$env:GAMIFY_BETA2_TEST_DB_URL" --set ON_ERROR_STOP=1 --file supabase/tests/beta2_cloud_saves.sql

# Manager browser validation with the isolated QA server already running.
$env:GAMIFY_E2E_EXTERNAL_SERVER = '1'
$env:GAMIFY_E2E_BASE_URL = 'http://127.0.0.1:5184'
node node_modules/@playwright/test/cli.js test tests/e2e/cloud-saves.spec.ts --project=desktop-chrome --project=phone-chrome

# Manager release regression in its authorized environment.
npm.cmd test
npm.cmd run build:pages
```

The new SQL test should follow the existing rollback-only synthetic test style
and print a precise PASS row only after all assertions; actual concurrent
sessions and Data API tests remain additional gates. Run all prior SQL files
from `supabase/tests/README.md` after the complete migration sequence. A local
PostgreSQL/Supabase installation is not assumed available; missing infrastructure
is an explicit manager validation dependency, not permission for a worker to
install or contact a live project. In this sandbox use `--pool=threads` and the
existing approved preload if needed; the manager reruns default-config tests
and browser checks independently. Record exact exit codes/test totals and
redacted logs, distinguish mocked, SQL, hosted and physical-device evidence,
and report unrelated concurrent regression failures rather than weaken tests.

## 10. Owner decisions needed

These are new choices; one writer, explicit takeover, no merges, existing
invite-only Auth and leaving the prototype local are already settled.

1. **How many campaigns should each player keep in the cloud at first?**
   Recommended default: **two**, including archives/recovery copies, within
   the tested account space budget (proposed 8 MB snapshots + 2 MB evidence).
   Keep extra existing campaigns local; do not delete them. Larger campaigns
   may use the available space sooner; explain limits before enrollment/restart.
2. **Are weekly private backups, keeping two copies for up to 14 days, enough?**
   Recommended default: **yes for this invited beta**, plus the prior cloud
   revision and a tested restore. A total-project failure could lose progress
   since the last weekly backup; shorter recovery requires a revised budget.
3. **Should Beta 2 stay on the free plan while tested usage fits?**
   Recommended default: **yes, with capacity warnings and a safe pause if
   limits are reached**; discuss a paid plan before any purchase or expanded
   promise. Do not automatically upgrade or discard history to stay free.
4. **Should signing out keep this account's recovery copy on that device?**
   Recommended default: **keep it**, with an explicit clear-this-device option
   and shared-device warning. Unsent progress must be confirmed/exported before
   intentional removal; signing out never uploads it to a different account.

## Progress, discoveries and next action

- [x] Read repository instructions, the prior Beta 2 design/binding owner
  decisions, current account/local persistence, both shell save boundaries,
  relevant accepted ADRs and existing Supabase grants/RPC/deletion patterns.
- [x] Measure synthetic serialized checkpoints read-only and record byte/hash
  receipts; distinguish sample maximum from an absent true maximum.
- [x] Draft options/recommendation, 30-player capacity correction, opt-in import,
  prototype/origin preservation, schema/security/privacy, UX, validation,
  rollout/rollback and bounded lanes.
- [x] Validate UTF-8/no BOM, LF-only lines, final newline, paired code fences,
  local document links, four owner questions, current fixture hash receipts and
  the 326.898 / 350 / 470 MB scenario calculations with a read-only Node check.
- [ ] Manager reviews this document and resolves the four owner choices; no
  implementation milestone has been accepted, started or delegated here.
- [ ] Manager schedules B2.1 after checking concurrent domain/content ownership,
  then assigns sequential bounded briefs and provisions disposable validation
  through its authorized route.

Key discoveries: the IndexedDB repository is not active/account-scoped; raw
local timestamps are not cloud revisions; local serialization has no maximum;
two 3 MB campaigns for each of 30 players overrun the conservative working
budget once prior copies/history/overhead are included; frequent cross-device
downloads also need an egress test; imports cannot reconstruct already retired
audit events; and existing usage-only deletion/consent must be extended without
claiming existing Beta 1 consent already covers full campaigns.

Next action: manager reviews the proposed budget and evidence contract, obtains
the owner choices, and issues the B2.1 brief. This document is **local only**;
no GitHub backup, implementation, cloud migration, provisioning or publication
was performed. The manager owns its checkpoint reminder and current-thread
handoff; this planning worker intentionally did not edit any other file.

## Owner decisions (2026-10-17)

Owner in chat: "Go with your recommendations." Binding:
1. Two cloud campaigns per player at first (including archives/recovery copies); extra campaigns stay local, never deleted.
2. Weekly private backups keeping two copies for up to 14 days, plus each campaign's prior cloud revision and a tested restore.
3. Stay on the Supabase free plan while measured usage fits; capacity warnings and a safe pause if limits approach; discuss any paid plan before purchase.
4. Signing out keeps that account's local recovery copy on the device, with an explicit "clear this device" option and a shared-device warning.
Manager: B2.1 dispatched 2026-10-17, concurrently with the game-domain Level 5 latent-bug worker (disjoint lanes; B2.1 reads domain only).

## B2.1 handoff (2026-10-17)

Worker: GPT-6.1 Sol. **Baseline codec and offline contract ready for manager
review; live evidence export stopped at the documented domain gap.** This is
not acceptance of cloud gameplay, physical capacity, SQL validation or rollout.
The binding Owner decisions above remain in effect.

New files in the assigned lane:

- `apps/player/src/session/cloud/codec.ts`: cloud/evidence/protocol version 1,
  explicit baseline-only envelope/import preparation, immutable exact-byte
  request receipts, verified hydration and capacity measurements.
- `codecJson.ts`: bounded lossless JSON/Unicode/number checks, exact UTF-8
  SHA-256 and independent logical equality.
- `codecOwnership.ts`: exhaustive GameState, campaign and profile field
  ownership; nested frozen/review/card/money/inspection contract.
- `codecGoldenVectors.json` and `codecGoldenVectors.sql`: four pinned JS/SQL
  vectors and a rollback-only disposable PostgreSQL assertion file.
- `codec.test.ts`, `codec.fixtures.test.ts`, `codecTestSupport.ts`: focused
  tests, complete fixture/migration comparisons and explicitly simulated text
  reordering. The helper is not a PostgreSQL oracle.
- [Short contract/gap note](beta2-b2-1-codec-notes.md).

Only this appended handoff and those new files were written. Domain/session
sources, fixtures, existing local saves, launchers, UI and server configuration
were not edited. No Git commands, installs, network, Supabase access, agents,
external messages, publication or deployment were used. No clinical statements,
approval status, concept IDs, balance or FSRS meaning were authored or changed.
The manager retains the current-thread handoff and GitHub checkpoint reminder;
this work is local only.

### Contract and fidelity result

All original parsed state is retained in an immutable import baseline before
the public deserializer normalizes it; exact source-recovery bytes/hash/size are
returned unchanged for the caller to retain durably. The snapshot caches the
entire supported migrated state. Load verifies both exact stored text hashes
before parsing, checks expected campaign/baseline/revision and compares all
logical fields to the authoritative migrated baseline. No shallow assertions
replace full equality. Hashes do not themselves enforce server immutability.

The complete request digest covers every material argument of the B2.1 import
request. Stored JSONB canonical text requires a separately computed server
hash; JS stringify is never compared byte-for-byte with reordered JSONB.
Revisions stay decimal strings, including values above JS safe integer range.
A later RPC adding writer/lifecycle/usage arguments must extend/version the
complete-request digest and remeasure its actual transport wrapper.

The suite covers all 11 planning checkpoints, existing pre-M9 Level 0-4
synthetic saves across schemas 5-9 and their saved next-120-minute states,
synthetic compatibility inputs for schemas 1-9, fresh levels 0-5, a recorded v1
review-intent migration and the concurrent domain worker's serialized
garden/offsite fixture. Full frozen content/choice order, cards/reviews and
times, money/accrual state, operations, pins, seed/RNG inputs/counters,
inspection state and retired summaries are compared. No fixture was changed.
Version 1's existing domain migration reconstructs card/review projections;
the original intents remain the baseline and the projections are explicitly
marked as reconstructed, not observed evidence. Historical question-count
credit is always zero; no usage receipts are minted.

### Remeasured envelope sizes

Decimal bytes; no compression. These receipts supersede the earlier planning
sizes for this inspection. The integration file is now 12,538,766 bytes with
SHA-256 `0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501`;
the legacy/economy fixture hashes still match the earlier table. Complete
source hashes, migration field names and per-fixture results are in the exact
test output below.

| Fixture | Compact source | Migrated game | JS envelope | Baseline evidence | B2.1 body | Reordered test envelope |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| level-four-legacy-pre-m3.json | 130,872 | 133,840 | 134,401 | 131,353 | 292,907 | 145,846 |
| level-five-economy-checkpoint-20261012.json | 1,429,974 | 1,430,026 | 1,430,586 | 1,430,455 | 3,141,559 | 1,524,512 |
| integration-l4 | 795,214 | 795,266 | 795,838 | 795,706 | 1,761,597 | 855,598 |
| integration-build | 803,955 | 804,007 | 804,579 | 804,447 | 1,782,494 | 865,769 |
| integration-preparing | 1,323,057 | 1,323,109 | 1,323,681 | 1,323,550 | 2,910,759 | 1,412,663 |
| integration-running | 1,397,231 | 1,397,257 | 1,397,829 | 1,397,724 | 3,075,145 | 1,493,023 |
| integration-final | 1,527,601 | 1,527,627 | 1,528,199 | 1,528,094 | 3,356,999 | 1,629,920 |
| integration-finish | 1,513,484 | 1,513,510 | 1,514,082 | 1,513,977 | 3,321,258 | 1,612,683 |
| integration-repeat-final | 1,724,322 | 1,724,322 | 1,724,894 | 1,724,815 | 3,774,644 | 1,833,631 |
| integration-repeat | 1,625,220 | 1,625,220 | 1,625,792 | 1,625,713 | 3,558,810 | 1,728,545 |
| integration-lower-repeat | 1,828,472 | 1,828,398 | 1,828,970 | 1,828,965 | 4,003,116 | 1,945,481 |

All 11 JS envelopes and reordered test envelopes fit the 2,000,000-byte target
and 3,000,000-byte ceiling. All measured B2.1 bodies fit 6,000,000 bytes.
**Capacity failure: eight of 11 immutable baselines exceed the
1,000,000-byte/campaign evidence allowance.** The largest is 1,828,965 bytes
(1,945,462 in reordered test text); two such baselines exceed the
2,000,000-byte/account evidence budget. This temporary full-fidelity layout
counts duplicated evidence and is not eligible for rollout. No history was
truncated to meet a budget. The 8 MB retained-snapshot account budget, actual
canonical SQL bytes, 7 MB recovery record, real ingress wrappers, physical
DB/index/TOAST/transient allocation and egress remain later integration gates;
these client text measurements are not database-capacity proof.

### Domain gap and manager next action

Current public state contains bounded event/receipt views, retired encounter
and service summaries, and latest/best/first inspection projections. It cannot
export all intervening frozen episodes, exact auditable money deltas, immutable
reviews/scored decisions and inspection attempts before retirement. Comparing
snapshots cannot recover missing evidence. No live checkpoint encoder, invented
ledger/history or relational delta exporter was added.

After the Level 5 worker hands back, the manager must explicitly assign a
separate domain evidence-capture/export lane with stable identities, complete
ordered pre-retirement deltas and exact money/card reconciliation. Then assign
the corresponding live codec mode/version and a lossless representation that
passes the evidence budget. Do not enable this baseline-only mode as cloud play.

**SQL gate pending:** no psql command was available, and database/network access
was outside this brief. The JS side verifies four pinned expected SQL-text
vectors; actual PostgreSQL execution is unverified. B2.2 must run
`apps/player/src/session/cloud/codecGoldenVectors.sql` in the manager-approved
disposable database and attach its real PASS output before accepting that gate.

### Final validation: exact output

From repository root, existing dependencies, final exit code **0** for each:

```powershell
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/session/cloud
npm.cmd run typecheck
```

The preload is an absolute file URL so npm's workspace cwd change cannot resolve
it under apps/player. The requested focused tests pass **113/113 in 2 files**;
all **seven workspace typechecks pass**. No domain tests were required because
this worker made no domain change; default-pool/browser/DB/hosted/phone checks
were not run or claimed.

Focused test stdout/stderr (exit 0):

```text

> @gamify-surgery/player@0.0.1 test
> vitest run --pool=threads src/session/cloud


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player

B2.1 MEASURE {"fixture":"level-four-legacy-pre-m3.json","file":"level-four-legacy-pre-m3.json","fileBytes":194747,"fileSha256":"9e806c67b15e08ab03760e84206faad89423496a2d80d38a2c0030c84d547ae3","sourceBytes":130872,"decodedStateBytes":133840,"snapshotBytes":134401,"baselineEvidenceBytes":131353,"transportBytes":292907,"reorderedSnapshotBytes":145846,"reorderedEvidenceBytes":142518,"withinTarget":true,"capacityFailures":[],"migrationFields":["emergencyGlp1","employees","environment","learningHistories","nextExternalRetailOpportunityTick","nextServiceIncomeReceiptSequence"]}
B2.1 MEASURE {"fixture":"level-five-economy-checkpoint-20261012.json","file":"level-five-economy-checkpoint-20261012.json","fileBytes":1429975,"fileSha256":"813572d7ecaa6ffb232b7bed92c72a14067f96927f42219750c1343b111d6582","sourceBytes":1429974,"decodedStateBytes":1430026,"snapshotBytes":1430586,"baselineEvidenceBytes":1430455,"transportBytes":3141559,"reorderedSnapshotBytes":1524512,"reorderedEvidenceBytes":1524361,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":["retailOperations"]}
B2.1 MEASURE {"fixture":"integration-l4","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":795214,"decodedStateBytes":795266,"snapshotBytes":795838,"baselineEvidenceBytes":795706,"transportBytes":1761597,"reorderedSnapshotBytes":855598,"reorderedEvidenceBytes":855446,"withinTarget":true,"capacityFailures":[],"migrationFields":["encounters","retailOperations"]}
B2.1 MEASURE {"fixture":"integration-build","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":803955,"decodedStateBytes":804007,"snapshotBytes":804579,"baselineEvidenceBytes":804447,"transportBytes":1782494,"reorderedSnapshotBytes":865769,"reorderedEvidenceBytes":865617,"withinTarget":true,"capacityFailures":[],"migrationFields":["retailOperations"]}
B2.1 MEASURE {"fixture":"integration-preparing","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1323057,"decodedStateBytes":1323109,"snapshotBytes":1323681,"baselineEvidenceBytes":1323550,"transportBytes":2910759,"reorderedSnapshotBytes":1412663,"reorderedEvidenceBytes":1412512,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":["retailOperations"]}
B2.1 MEASURE {"fixture":"integration-running","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1397231,"decodedStateBytes":1397257,"snapshotBytes":1397829,"baselineEvidenceBytes":1397724,"transportBytes":3075145,"reorderedSnapshotBytes":1493023,"reorderedEvidenceBytes":1492900,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":["retailOperations"]}
B2.1 MEASURE {"fixture":"integration-final","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1527601,"decodedStateBytes":1527627,"snapshotBytes":1528199,"baselineEvidenceBytes":1528094,"transportBytes":3356999,"reorderedSnapshotBytes":1629920,"reorderedEvidenceBytes":1629797,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":["retailOperations"]}
B2.1 MEASURE {"fixture":"integration-finish","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1513484,"decodedStateBytes":1513510,"snapshotBytes":1514082,"baselineEvidenceBytes":1513977,"transportBytes":3321258,"reorderedSnapshotBytes":1612683,"reorderedEvidenceBytes":1612560,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":["retailOperations"]}
B2.1 MEASURE {"fixture":"integration-repeat-final","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1724322,"decodedStateBytes":1724322,"snapshotBytes":1724894,"baselineEvidenceBytes":1724815,"transportBytes":3774644,"reorderedSnapshotBytes":1833631,"reorderedEvidenceBytes":1833536,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":[]}
B2.1 MEASURE {"fixture":"integration-repeat","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1625220,"decodedStateBytes":1625220,"snapshotBytes":1625792,"baselineEvidenceBytes":1625713,"transportBytes":3558810,"reorderedSnapshotBytes":1728545,"reorderedEvidenceBytes":1728450,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":[]}
B2.1 MEASURE {"fixture":"integration-lower-repeat","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1828472,"decodedStateBytes":1828398,"snapshotBytes":1828970,"baselineEvidenceBytes":1828965,"transportBytes":4003116,"reorderedSnapshotBytes":1945481,"reorderedEvidenceBytes":1945462,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":["retailOperations","serviceOperations"]}

 Test Files  2 passed (2)
      Tests  113 passed (113)
   Start at  11:25:47
   Duration  26.32s (transform 9.04s, setup 0ms, import 13.01s, tests 24.07s, environment 0ms)
```

Workspace typecheck stdout/stderr (exit 0):

```text

> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present


> @gamify-surgery/clinical-context-workbench@0.0.1 typecheck
> tsc --noEmit -p tsconfig.client.json && tsc --noEmit -p tsconfig.server.json


> @gamify-surgery/player@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/balance-config@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-authoring@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-research@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/game-domain@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
```


## B2.1b handoff (2026-10-17)

Worker: GPT-6.1 Sol. **Domain evidence export/import and format 2 codec delivered
for manager review.** Existing local save behavior is preserved. Verified
compression and sealed-page measurements address the earlier baseline
duplication/capacity problem; this is not a server, UI or cloud rollout.

### Files and public API

New domain modules:

- `packages/game-domain/src/game-evidence.ts`: public
  `createGameEvidenceCheckpoint`, `applyGameEvidenceCommand`,
  `importGameEvidence`, `exportGameEvidence` and
  `restoreGameEvidenceImportSource`, with separate immutable archive and
  operational snapshot types.
- `game-evidence-json.ts`: portable lossless JSON, complete operational patches,
  logical comparison, safe property writes and immutable value helpers.
- `game-evidence-capture.ts`: synchronous opt-in read-only observations.
- `packages/game-domain/tests/game-evidence.test.ts`: 21 tests covering all
  measured fixtures, complete source recovery, real scored review/card changes,
  money/card/pin reconciliation, inspection completion/cancellation, actual
  retirement, receipt trimming/retries and unchanged ordinary reducer bytes.

Existing domain edits are exactly one public export in `index.ts` plus four
lines in `reducer.ts`: an import and observations before retirement, event
trimming and operation-receipt trimming. A read-only audit removed those lines
in memory and reproduced the starting file hashes exactly. No other recorded
domain input changed. **`persistence.ts` is unchanged**, SHA-256
`2489168f74e18a94f1acf86eedb9b4fd2480333527528dcd8e27d0f86dba0b50`.

New player modules/tests under `apps/player/src/session/cloud/`:

- `codecEvidence.ts` / `codecEvidence.test.ts`: cloud format **2**, domain
  evidence contract **1**, request protocol **2**, immutable row/header packing,
  verified hydration, prefix/high-water support and acknowledged evidence deltas.
- `codecCompression.ts` / `codecCompression.test.ts`: native browser gzip/
  deflate with immediate lossless verification and bounded streaming decode.
- `codecEvidencePages.ts` / `codecEvidencePages.test.ts`: losslessly evaluated
  immutable sealed-page storage candidate; no applied database schema.

Existing player edits: `codec.ts` exports the shared metadata validator and
marks format 1 import preparation deprecated; `codecOwnership.ts` points to the
new public capture API; `codec.test.ts` retains the original assertions;
`codecGoldenVectors.json/sql` preserve all four original vectors and add a
format 2 reference-layout vector. The [contract note](beta2-b2-1-codec-notes.md)
has a B2.1b amendment. This plan change is append-only. No fixture, clinical
release, balance data, approval, save key, launcher, UI, dependency or server
configuration was changed.

### Evidence and fidelity contract

The archive holds the complete available original import with immutable fact
references, historical limitations, opening finance/learning and version pins,
and a canonical append-only fact dictionary. Exact duplicate facts share a
record. Card pointers are mutable projections of immutable card versions.
Frozen cases/order, identities, scored answers, reviews, income/settlements,
receipts/events and inspection evidence are separate from operational snapshots.

A snapshot holds the complete current operational projection as patches against
the immutable import source, references and a journal cursor. It does not copy
the immutable payloads or replay gameplay. Full original imported logical state
remains recoverable after later commands and retirement; exact source text/hash
is retained separately for device recovery. Missing pre-adoption events remain
unknown. Version 1's preexisting reconstructed review projections stay marked
as such, and historical import question-count credit remains zero.

The opt-in command wrapper observes facts before retirement/trimming and records
actual before/after finance, exact integer-cent deltas and command identities.
It does not fabricate itemized transactions that the runtime never exposed.
Hydration reconciles the finance chain, complete card/review projections and
immutable pins. It preserves all existing game state, clinical review status,
concept IDs, frozen choice order, money, seed/RNG inputs/counters and operational
timing. Existing serializers/deserializers remain untouched; observed/ordinary
command outputs are compared byte-for-byte, including 65 simulated minutes, a
real scored answer and final/cancelled inspections. The ordinary reducer path
does not install a capture scope.

A future cloud coordinator must route all cloud commands through this opt-in
boundary and commit snapshot plus appended facts atomically. Existing local
callers are unchanged. The codec sends only new rows after an acknowledged
high-water mark and an immutable header hash. Prior snapshots share the same
archive and load only their exact prefix. Format 1 remains compatibility-only.

### Verified compression and updated capacity table

All figures are **decimal UTF-8/binary bytes**, measured with Node's native
CompressionStream/DecompressionStream implementations. No dependency was
installed. Both gzip and deflate outputs are immediately decompressed and
checked against SHA-256 of the **uncompressed canonical bytes**. Compressed
byte identity is not assumed portable across browsers. Decoded sizes and hashes
are verified before JSON parsing, with bounded per-value/aggregate decoding and
bounded reference expansion.

The following supersedes B2.1's duplicated baseline layout for new format 2
work. Evidence raw includes header and immutable record payload metadata; the
whole-archive raw JSON differs slightly because of its container. Page costs
include the immutable header once and every sealed page once. Wire body is the
implemented gzip row protocol, including base64 and JSON metadata.

| Fixture | Snapshot raw / gzip | Evidence raw | Gzip rows | Gzip sealed pages | Deflate sealed pages | Gzip row-transport body |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| level-four-legacy-pre-m3.json | 4,813 / 1,384 | 108,067 | 19,683 | 18,604 | 18,580 | 31,179 |
| level-five-economy-checkpoint-20261012.json | 30,082 / 3,517 | 1,637,098 | 676,435 | 164,524 | 164,308 | 1,362,471 |
| integration-l4 | 13,063 / 2,102 | 854,362 | 318,733 | 85,723 | 85,615 | 635,555 |
| integration-build | 12,959 / 2,056 | 863,103 | 318,515 | 86,434 | 86,326 | 635,202 |
| integration-preparing | 17,377 / 2,845 | 1,460,018 | 585,625 | 143,159 | 142,967 | 1,158,292 |
| integration-running | 17,850 / 2,682 | 1,536,926 | 600,377 | 151,152 | 150,948 | 1,184,530 |
| integration-final | 23,153 / 3,036 | 1,688,925 | 672,083 | 167,158 | 166,942 | 1,324,486 |
| integration-finish | 23,151 / 3,038 | 1,609,025 | 649,362 | 157,013 | 156,797 | 1,281,690 |
| integration-repeat-final | 788 / 494 | 1,851,315 | 754,764 | 185,013 | 184,761 | 1,483,045 |
| integration-repeat | 788 / 493 | 1,770,160 | 731,711 | 174,605 | 174,353 | 1,439,612 |
| integration-lower-repeat | 124,923 / 10,680 | 1,998,490 | 804,888 | 195,238 | 194,962 | 1,590,918 |

All 11 initial snapshots satisfy the 2 MB target and 3 MB ceiling; reconstructed
games remain below the 3 MB decoded-game ceiling and actual row-transport bodies
below 6 MB. **Raw evidence still exceeds the 1 MB/campaign allowance in eight
fixtures.** Individual gzip rows fit all 11 imported checkpoints, with a maximum
of **804,888 bytes**. The largest initial sealed gzip-page evidence set is
**195,238 bytes**. Whole-archive gzip reaches **178,656 bytes** at that checkpoint,
but is not mislabeled as the cost of separately stored rows.

Continuation from `integration-lower-repeat` runs **360 additional facility
minutes = six simulated facility hours**, not six wall-clock player hours.
No answers or history were replayed, no accepted row was edited/dropped and the
original import remained fully recoverable:

| Continued-play quantity | Bytes / count |
| --- | ---: |
| Reconstructed full game | 1,856,608 |
| Operational snapshot raw / gzip | 311,075 / 30,255 |
| Complete immutable evidence raw | 2,478,063 |
| Individual gzip rows + header | **1,071,025** |
| Sealed gzip pages + header | **252,915** |
| Immutable facts / sealed pages | 3,511 / 34 |
| New facts / new individual-row gzip bytes | 930 / 266,137 |
| Actual acknowledged row save body | 577,541 |

**Capacity failure preserved:** individual-row gzip exceeds the starting
1 MB/campaign evidence allowance after this continuation; two equivalent
campaigns exceed the 2 MB/account evidence budget. Sealed pages pass the same
payload-byte allowance. Growth seals six successive batches of 60 commands,
retains each previously accepted partial page unchanged and round-trips every
row exactly once. No compression or quota claim relies on deleting history.

### Storage recommendation and remaining gates

Recommend **immutable sealed gzip pages in bytea**, with normalized owned
identity/index metadata and a bounded trusted inflater/validator, rather than
assuming individual gzip-row sizes equal whole-file gzip sizes. Operational
snapshots can also use the agreed bytea/canonical-byte contract if that route is
accepted. The new page utility evaluates the physical candidate; it is not an
applied schema or a different live transport.

A JSONB + server TOAST/lz4 alternative makes direct SQL validation/querying
simpler. Verify actual lz4 availability/settings and physical results; short
rows may not compress and gzip bytes must not be credited for another assumed
TOAST saving. Format 2 bytea loads require the agreed canonical text/base64
contract. A JSONB alternative needs the separate server-canonical text/hash
contract or an explicitly versioned adapter; JSONB text is not the same bytes
as JS canonical text. Core TOAST does not provide a tested client-gzip
inflation/validation RPC by itself.

For perspective only, using the largest observed continued-play gzip snapshot
and page set for all 30 accounts, two campaigns each, current + prior snapshots:

- Payload plus the inherited 50 MB shared allowance =
  `30 * (4 * 30,255 + 2 * 252,915) + 50,000,000` =
  **68,805,500 bytes (68.806 MB)**.
- Budgeting snapshots at their raw 311,075 bytes instead, without assuming
  TOAST savings, gives **102,503,900 bytes (102.504 MB)**.

These are payload/planning calculations, **not measured PostgreSQL capacity or
a rollout PASS**. The 500 MB provider limit, 400 MB working ceiling, 8 MB retained
snapshots/account, 2 MB evidence/account and two campaigns/account remain
unchanged. Actual tuple/FK/index/TOAST/dead-row costs, Auth/other application
data, transient reservations, backups and real ingress/egress remain B2.2/B2.5
gates. All metadata/history must be charged; an uncounted side table is not a
capacity fix. History remains unbounded, so even pages require warnings and a
safe pause at a tested limit. The 6 MB decoded processing bound is separate
from physical compressed-storage accounting.

B2.2 must provide bounded trusted decompression before structural/invariant
validation, hash checking, ownership/RLS and atomic writes. Client hash success
alone is insufficient. It must also complete the actual request contract with
writer generation/token, lifecycle and any eligible usage arguments and hash
every material RPC argument. The five SQL golden vectors have **not** been
executed on PostgreSQL; the manager's disposable SQL run remains required.
No real browser/Safari/phone, hosted ingress, physical database or rollback/
backup acceptance is claimed by these Node codec tests.

### Exact recorded-input changes; no evidence rebind

| Existing recorded input | Before | After |
| --- | --- | --- |
| packages/game-domain/src/index.ts | `3045ff30cb0cf9701d6220ac506135db811a206e112fba788fa90c58b18bfa7b` | `1389c04a3c49479ce6d0bdea427a290d791f437b62f9d271856517e0e0d4e879` |
| packages/game-domain/src/reducer.ts | `daf3be68ec8134205113fc7be6136b5a0fdcf7b3d93149a9ffeab83c7599d1f6` | `d4424125c52ba7f9a494f221b7c2933bcdace971ff3d34f22380f77bc3f6f19e` |

These are the **only existing recorded domain inputs changed**. The full suite's
binding assertion stops at `index.ts`; the independent source audit also
identifies `reducer.ts`. The manager must review the additive observations and
exports, include the new modules in the next binding and rebind/rerun the Level
5 evidence through its authorized lane. No test, recorded hash or evidence
artifact was weakened or rebound by this worker.

### Final validation and exact output

Existing dependencies, the approved absolute preload, no Git/install/network:

```powershell
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/session/cloud
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1
npm.cmd run typecheck
```

- Player focused: **145 passed in 5 files, exit 0**.
- Full game-domain: **4,291 passed / 1 failed, 159 passed files / 1 failed file,
  exit 1**. The sole failure is the permitted Level 5 recorded-input binding
  assertion for the changed `index.ts` SHA-256. All 21 new domain tests pass.
- All **seven workspace typechecks pass, exit 0**.
- Scoped source/JSON/SQL/docs are UTF-8 without BOM and LF-only. The existing
  reducer/index edits were audited against their starting byte hashes.
- No Git, installs, network, Supabase, browser/owner storage, external messages,
  agents, publication or deployment. Local-only checkpoint; manager owns the
  current-thread handoff, acceptance, input rebind, physical-capacity gates and
  the **"push to GitHub"** backup reminder.

Player stdout/stderr (exit 0; includes retained format 1 receipts and new
format 2 row/page/continuation receipts):

```text

> @gamify-surgery/player@0.0.1 test
> vitest run --pool=threads src/session/cloud


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/apps/player

B2.1 MEASURE {"fixture":"level-four-legacy-pre-m3.json","file":"level-four-legacy-pre-m3.json","fileBytes":194747,"fileSha256":"9e806c67b15e08ab03760e84206faad89423496a2d80d38a2c0030c84d547ae3","sourceBytes":130872,"decodedStateBytes":133840,"snapshotBytes":134401,"baselineEvidenceBytes":131353,"transportBytes":292907,"reorderedSnapshotBytes":145846,"reorderedEvidenceBytes":142518,"withinTarget":true,"capacityFailures":[],"migrationFields":["emergencyGlp1","employees","environment","learningHistories","nextExternalRetailOpportunityTick","nextServiceIncomeReceiptSequence"]}
B2.1b MEASURE {"fixture":"level-four-legacy-pre-m3.json","file":"level-four-legacy-pre-m3.json","fileSha256":"9e806c67b15e08ab03760e84206faad89423496a2d80d38a2c0030c84d547ae3","sourceBytes":130872,"decodedGameBytes":133840,"snapshotRawBytes":4813,"snapshotStoredBytes":1384,"evidenceRawBytes":108067,"evidenceStoredBytes":19683,"evidenceArchiveRawBytes":107950,"rawJsonBodyBytes":124163,"transportBodyBytes":31179,"immutableRecords":13,"newEvidenceUploadRows":13,"newEvidenceUploadBytes":19683,"deflateSnapshotBytes":1372,"deflateEvidenceRowsBytes":19515,"deflateTransportBodyBytes":30979,"aggregateEvidenceGzipBytes":18366,"aggregateEvidenceDeflateBytes":18354,"gzipPagesEvidenceBytes":18604,"deflatePagesEvidenceBytes":18580,"immutablePages":1,"rawCapacityFailures":[],"compressedCapacityFailures":[]}
B2.1 MEASURE {"fixture":"level-five-economy-checkpoint-20261012.json","file":"level-five-economy-checkpoint-20261012.json","fileBytes":1429975,"fileSha256":"813572d7ecaa6ffb232b7bed92c72a14067f96927f42219750c1343b111d6582","sourceBytes":1429974,"decodedStateBytes":1430026,"snapshotBytes":1430586,"baselineEvidenceBytes":1430455,"transportBytes":3141559,"reorderedSnapshotBytes":1524512,"reorderedEvidenceBytes":1524361,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":["retailOperations"]}
B2.1 MEASURE {"fixture":"integration-l4","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":795214,"decodedStateBytes":795266,"snapshotBytes":795838,"baselineEvidenceBytes":795706,"transportBytes":1761597,"reorderedSnapshotBytes":855598,"reorderedEvidenceBytes":855446,"withinTarget":true,"capacityFailures":[],"migrationFields":["encounters","retailOperations"]}
B2.1 MEASURE {"fixture":"integration-build","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":803955,"decodedStateBytes":804007,"snapshotBytes":804579,"baselineEvidenceBytes":804447,"transportBytes":1782494,"reorderedSnapshotBytes":865769,"reorderedEvidenceBytes":865617,"withinTarget":true,"capacityFailures":[],"migrationFields":["retailOperations"]}
B2.1 MEASURE {"fixture":"integration-preparing","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1323057,"decodedStateBytes":1323109,"snapshotBytes":1323681,"baselineEvidenceBytes":1323550,"transportBytes":2910759,"reorderedSnapshotBytes":1412663,"reorderedEvidenceBytes":1412512,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":["retailOperations"]}
B2.1b MEASURE {"fixture":"level-five-economy-checkpoint-20261012.json","file":"level-five-economy-checkpoint-20261012.json","fileSha256":"813572d7ecaa6ffb232b7bed92c72a14067f96927f42219750c1343b111d6582","sourceBytes":1429974,"decodedGameBytes":1430026,"snapshotRawBytes":30082,"snapshotStoredBytes":3517,"evidenceRawBytes":1637098,"evidenceStoredBytes":676435,"evidenceArchiveRawBytes":1639303,"rawJsonBodyBytes":1863965,"transportBodyBytes":1362471,"immutableRecords":2336,"newEvidenceUploadRows":2336,"newEvidenceUploadBytes":676435,"deflateSnapshotBytes":3505,"deflateEvidenceRowsBytes":648391,"deflateTransportBodyBytes":1332056,"aggregateEvidenceGzipBytes":156098,"aggregateEvidenceDeflateBytes":156086,"gzipPagesEvidenceBytes":164524,"deflatePagesEvidenceBytes":164308,"immutablePages":17,"rawCapacityFailures":["evidence-allowance"],"compressedCapacityFailures":[]}
B2.1 MEASURE {"fixture":"integration-running","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1397231,"decodedStateBytes":1397257,"snapshotBytes":1397829,"baselineEvidenceBytes":1397724,"transportBytes":3075145,"reorderedSnapshotBytes":1493023,"reorderedEvidenceBytes":1492900,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":["retailOperations"]}
B2.1 MEASURE {"fixture":"integration-final","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1527601,"decodedStateBytes":1527627,"snapshotBytes":1528199,"baselineEvidenceBytes":1528094,"transportBytes":3356999,"reorderedSnapshotBytes":1629920,"reorderedEvidenceBytes":1629797,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":["retailOperations"]}
B2.1b MEASURE {"fixture":"integration-l4","file":"level-five-integration-checkpoints-20261012.json","fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":795214,"decodedGameBytes":795266,"snapshotRawBytes":13063,"snapshotStoredBytes":2102,"evidenceRawBytes":854362,"evidenceStoredBytes":318733,"evidenceArchiveRawBytes":855299,"rawJsonBodyBytes":974112,"transportBodyBytes":635555,"immutableRecords":1067,"newEvidenceUploadRows":1067,"newEvidenceUploadBytes":318733,"deflateSnapshotBytes":2090,"deflateEvidenceRowsBytes":305917,"deflateTransportBodyBytes":621643,"aggregateEvidenceGzipBytes":80456,"aggregateEvidenceDeflateBytes":80444,"gzipPagesEvidenceBytes":85723,"deflatePagesEvidenceBytes":85615,"immutablePages":8,"rawCapacityFailures":[],"compressedCapacityFailures":[]}
B2.1 MEASURE {"fixture":"integration-finish","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1513484,"decodedStateBytes":1513510,"snapshotBytes":1514082,"baselineEvidenceBytes":1513977,"transportBytes":3321258,"reorderedSnapshotBytes":1612683,"reorderedEvidenceBytes":1612560,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":["retailOperations"]}
B2.1 MEASURE {"fixture":"integration-repeat-final","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1724322,"decodedStateBytes":1724322,"snapshotBytes":1724894,"baselineEvidenceBytes":1724815,"transportBytes":3774644,"reorderedSnapshotBytes":1833631,"reorderedEvidenceBytes":1833536,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":[]}
B2.1b MEASURE {"fixture":"integration-build","file":"level-five-integration-checkpoints-20261012.json","fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":803955,"decodedGameBytes":804007,"snapshotRawBytes":12959,"snapshotStoredBytes":2056,"evidenceRawBytes":863103,"evidenceStoredBytes":318515,"evidenceArchiveRawBytes":864040,"rawJsonBodyBytes":984446,"transportBodyBytes":635202,"immutableRecords":1067,"newEvidenceUploadRows":1067,"newEvidenceUploadBytes":318515,"deflateSnapshotBytes":2044,"deflateEvidenceRowsBytes":305699,"deflateTransportBodyBytes":621290,"aggregateEvidenceGzipBytes":81128,"aggregateEvidenceDeflateBytes":81116,"gzipPagesEvidenceBytes":86434,"deflatePagesEvidenceBytes":86326,"immutablePages":8,"rawCapacityFailures":[],"compressedCapacityFailures":[]}
B2.1 MEASURE {"fixture":"integration-repeat","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1625220,"decodedStateBytes":1625220,"snapshotBytes":1625792,"baselineEvidenceBytes":1625713,"transportBytes":3558810,"reorderedSnapshotBytes":1728545,"reorderedEvidenceBytes":1728450,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":[]}
B2.1 MEASURE {"fixture":"integration-lower-repeat","file":"level-five-integration-checkpoints-20261012.json","fileBytes":12538766,"fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1828472,"decodedStateBytes":1828398,"snapshotBytes":1828970,"baselineEvidenceBytes":1828965,"transportBytes":4003116,"reorderedSnapshotBytes":1945481,"reorderedEvidenceBytes":1945462,"withinTarget":true,"capacityFailures":["baseline-evidence-allowance"],"migrationFields":["retailOperations","serviceOperations"]}
B2.1b MEASURE {"fixture":"integration-preparing","file":"level-five-integration-checkpoints-20261012.json","fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1323057,"decodedGameBytes":1323109,"snapshotRawBytes":17377,"snapshotStoredBytes":2845,"evidenceRawBytes":1460018,"evidenceStoredBytes":585625,"evidenceArchiveRawBytes":1461803,"rawJsonBodyBytes":1650790,"transportBodyBytes":1158292,"immutableRecords":1916,"newEvidenceUploadRows":1916,"newEvidenceUploadBytes":585625,"deflateSnapshotBytes":2833,"deflateEvidenceRowsBytes":562621,"deflateTransportBodyBytes":1133332,"aggregateEvidenceGzipBytes":134184,"aggregateEvidenceDeflateBytes":134172,"gzipPagesEvidenceBytes":143159,"deflatePagesEvidenceBytes":142967,"immutablePages":15,"rawCapacityFailures":["evidence-allowance"],"compressedCapacityFailures":[]}
B2.1b MEASURE {"fixture":"integration-running","file":"level-five-integration-checkpoints-20261012.json","fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1397231,"decodedGameBytes":1397257,"snapshotRawBytes":17850,"snapshotStoredBytes":2682,"evidenceRawBytes":1536926,"evidenceStoredBytes":600377,"evidenceArchiveRawBytes":1538746,"rawJsonBodyBytes":1736874,"transportBodyBytes":1184530,"immutableRecords":1951,"newEvidenceUploadRows":1951,"newEvidenceUploadBytes":600377,"deflateSnapshotBytes":2670,"deflateEvidenceRowsBytes":576953,"deflateTransportBodyBytes":1159111,"aggregateEvidenceGzipBytes":141020,"aggregateEvidenceDeflateBytes":141008,"gzipPagesEvidenceBytes":151152,"deflatePagesEvidenceBytes":150948,"immutablePages":16,"rawCapacityFailures":["evidence-allowance"],"compressedCapacityFailures":[]}
B2.1b MEASURE {"fixture":"integration-final","file":"level-five-integration-checkpoints-20261012.json","fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1527601,"decodedGameBytes":1527627,"snapshotRawBytes":23153,"snapshotStoredBytes":3036,"evidenceRawBytes":1688925,"evidenceStoredBytes":672083,"evidenceArchiveRawBytes":1690970,"rawJsonBodyBytes":1910545,"transportBodyBytes":1324486,"immutableRecords":2176,"newEvidenceUploadRows":2176,"newEvidenceUploadBytes":672083,"deflateSnapshotBytes":3024,"deflateEvidenceRowsBytes":645959,"deflateTransportBodyBytes":1296146,"aggregateEvidenceGzipBytes":156802,"aggregateEvidenceDeflateBytes":156790,"gzipPagesEvidenceBytes":167158,"deflatePagesEvidenceBytes":166942,"immutablePages":17,"rawCapacityFailures":["evidence-allowance"],"compressedCapacityFailures":[]}
B2.1b MEASURE {"fixture":"integration-finish","file":"level-five-integration-checkpoints-20261012.json","fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1513484,"decodedGameBytes":1513510,"snapshotRawBytes":23151,"snapshotStoredBytes":3038,"evidenceRawBytes":1609025,"evidenceStoredBytes":649362,"evidenceArchiveRawBytes":1611006,"rawJsonBodyBytes":1821994,"transportBodyBytes":1281690,"immutableRecords":2112,"newEvidenceUploadRows":2112,"newEvidenceUploadBytes":649362,"deflateSnapshotBytes":3026,"deflateEvidenceRowsBytes":624006,"deflateTransportBodyBytes":1254182,"aggregateEvidenceGzipBytes":146355,"aggregateEvidenceDeflateBytes":146343,"gzipPagesEvidenceBytes":157013,"deflatePagesEvidenceBytes":156797,"immutablePages":17,"rawCapacityFailures":["evidence-allowance"],"compressedCapacityFailures":[]}
B2.1b MEASURE {"fixture":"integration-repeat-final","file":"level-five-integration-checkpoints-20261012.json","fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1724322,"decodedGameBytes":1724322,"snapshotRawBytes":788,"snapshotStoredBytes":494,"evidenceRawBytes":1851315,"evidenceStoredBytes":754764,"evidenceArchiveRawBytes":1853624,"rawJsonBodyBytes":2062103,"transportBodyBytes":1483045,"immutableRecords":2440,"newEvidenceUploadRows":2440,"newEvidenceUploadBytes":754764,"deflateSnapshotBytes":482,"deflateEvidenceRowsBytes":725472,"deflateTransportBodyBytes":1451271,"aggregateEvidenceGzipBytes":173762,"aggregateEvidenceDeflateBytes":173750,"gzipPagesEvidenceBytes":185013,"deflatePagesEvidenceBytes":184761,"immutablePages":20,"rawCapacityFailures":["evidence-allowance"],"compressedCapacityFailures":[]}
B2.1b MEASURE {"fixture":"integration-repeat","file":"level-five-integration-checkpoints-20261012.json","fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1625220,"decodedGameBytes":1625220,"snapshotRawBytes":788,"snapshotStoredBytes":493,"evidenceRawBytes":1770160,"evidenceStoredBytes":731711,"evidenceArchiveRawBytes":1772404,"rawJsonBodyBytes":1972157,"transportBodyBytes":1439612,"immutableRecords":2375,"newEvidenceUploadRows":2375,"newEvidenceUploadBytes":731711,"deflateSnapshotBytes":481,"deflateEvidenceRowsBytes":703199,"deflateTransportBodyBytes":1408683,"aggregateEvidenceGzipBytes":160240,"aggregateEvidenceDeflateBytes":160228,"gzipPagesEvidenceBytes":174605,"deflatePagesEvidenceBytes":174353,"immutablePages":20,"rawCapacityFailures":["evidence-allowance"],"compressedCapacityFailures":[]}
B2.1b MEASURE {"fixture":"integration-lower-repeat","file":"level-five-integration-checkpoints-20261012.json","fileSha256":"0ba7e974fb60d6926be7bdb8d9642a12cf3b85bce3de714c5646f4d3467b1501","sourceBytes":1828472,"decodedGameBytes":1828398,"snapshotRawBytes":124923,"snapshotStoredBytes":10680,"evidenceRawBytes":1998490,"evidenceStoredBytes":804888,"evidenceArchiveRawBytes":2000940,"rawJsonBodyBytes":2366004,"transportBodyBytes":1590918,"immutableRecords":2581,"newEvidenceUploadRows":2581,"newEvidenceUploadBytes":804888,"deflateSnapshotBytes":10668,"deflateEvidenceRowsBytes":773904,"deflateTransportBodyBytes":1557304,"aggregateEvidenceGzipBytes":178656,"aggregateEvidenceDeflateBytes":178644,"gzipPagesEvidenceBytes":195238,"deflatePagesEvidenceBytes":194962,"immutablePages":22,"rawCapacityFailures":["evidence-allowance"],"compressedCapacityFailures":[]}
B2.1b GROWTH {"fixture":"integration-lower-repeat","additionalFacilityMinutes":360,"initialEvidenceBytes":804888,"decodedGameBytes":1856608,"snapshotRawBytes":311075,"snapshotStoredBytes":30255,"evidenceRawBytes":2478063,"evidenceStoredBytes":1071025,"evidenceArchiveRawBytes":2481443,"rawJsonBodyBytes":893820,"transportBodyBytes":577541,"immutableRecords":3511,"newEvidenceUploadRows":930,"newEvidenceUploadBytes":266137,"gzipPagesEvidenceBytes":252915,"immutablePages":34,"sealedUploadBatches":6,"compressedCapacityFailures":["evidence-allowance"],"rawCapacityFailures":["evidence-allowance"]}

 Test Files  5 passed (5)
      Tests  145 passed (145)
   Start at  12:09:47
   Duration  99.18s (transform 4.18s, setup 0ms, import 5.89s, tests 110.75s, environment 0ms)
```

Full game-domain stdout/stderr (exit 1, permitted binding failure only):

```text

> @gamify-surgery/game-domain@0.0.1 test
> vitest run --pool=threads --maxWorkers=1


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/game-domain

 ❯ tests/level-five-integration.test.ts (36 tests | 1 failed) 272285ms
     × binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash 27ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/level-five-integration.test.ts > M9 connected Level 5 reducer journey > binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash
AssertionError: packages/game-domain/src/index.ts: expected '1389c04a3c49479ce6d0bdea427a290d791f4…' to be '3045ff30cb0cf9701d6220ac506135db811a2…' // Object.is equality

Expected: "3045ff30cb0cf9701d6220ac506135db811a206e112fba788fa90c58b18bfa7b"
Received: "1389c04a3c49479ce6d0bdea427a290d791f437b62f9d271856517e0e0d4e879"

 ❯ tests/level-five-integration.test.ts:47:71
     45|           .replace("        nextFacilityLevel: 5,\n      },\n      LEV…
     46|       }
     47|       expect(createHash("sha256").update(source).digest("hex"), file).…
       |                                                                       ^
     48|     }
     49|     expect(run.commandsReconciled).toBeGreaterThan(20_000);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 159 passed (160)
      Tests  1 failed | 4291 passed (4292)
   Start at  12:03:52
   Duration  977.00s (transform 4.15s, setup 0ms, import 67.31s, tests 898.68s, environment 8ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\game-domain
npm error workspace @gamify-surgery/game-domain@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\game-domain
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads --maxWorkers=1
```

Workspace typecheck stdout/stderr (exit 0):

```text

> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present


> @gamify-surgery/clinical-context-workbench@0.0.1 typecheck
> tsc --noEmit -p tsconfig.client.json && tsc --noEmit -p tsconfig.server.json


> @gamify-surgery/player@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/balance-config@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-authoring@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/clinical-research@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json


> @gamify-surgery/game-domain@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
```


## Owner decision (2026-10-17): test database

Owner chose **"Test on the live project"** (over a local PostgreSQL install or pausing the ergonomics project). Manager rules: the B2.2 schema is additive and unused until the client is enabled; SQL validation uses rollback-only synthetic tests in the established Beta 1 style (simulated roles/JWT claims inside a transaction, PASS row at the end), run in the live project's SQL editor by the manager or owner; no synthetic data persists. Two-session concurrency is proven by (a) lock/generation logic tested in rollback-only scripts and (b) the B2.6 owner desktop -> phone -> desktop trial. The migration is reviewed before it is applied. B2.1b accepted 2026-10-17 (reducer.ts change = three read-only no-op observer hooks); the Level 5 evidence rebind is deferred to the next publish.

## B2.2 handoff (2026-10-17)

Worker: GPT-6.1 Sol, transactional SQL lane. **Implementation prepared and
source-reviewed; no SQL was executed and no database PASS is claimed.** The
binding live-game-project test decision immediately above governs the manager's
validation. This handoff does not enable cloud play or accept B2.2/B2.5/B2.6.

Files changed, only in the assigned lane:

- `supabase/migrations/20261018000100_beta2_cloud_saves.sql`: new additive,
  transactional migration; eleven tables, RLS on each, nine public INVOKER
  wrappers, private validated DEFINER RPCs, explicit EXECUTE ACLs, no direct
  player/service table grants and no anon access. Both project flags and account
  capabilities default off. Pure SQL/PLpgSQL, no new extension dependency.
- `supabase/tests/beta2_cloud_saves.sql`: one `BEGIN ... ROLLBACK` synthetic
  suite, actual roles/claims, one final PASS row only after all assertions.
- `supabase/tests/README.md`: exact SQL Editor procedure, expected output,
  pending acceptance gates and historical Beta 1 instructions retained.
- This append-only handoff. No other plan text or source lane was changed.

No Git commands, installs, network, database/browser access, agents, external
messages, commits, push, deployment or publication were used. The concurrent
B2.3 session lane was read for its codec contract only and was not edited.
No clinical material, approval, FSRS meaning, frozen content, game balance,
launcher, browser origin or owner save was changed. Work is local only; the
manager owns acceptance, the current-thread handoff and the GitHub checkpoint
reminder under the existing rules.

### Storage and transaction result

`public.beta2_campaigns` owns summaries, monotonic bigint revision/generation,
stable string IDs, normalized unique names, journal head and import provenance.
Owned composite FKs cover compressed snapshots, immutable headers and immutable
sealed evidence pages. Private tables own account capability/quota, versioned
consent, writer hashes/expiry, immutable operation receipts, bounded rate buckets,
the project reservation and the protected deletion ledger. These objects are
separate from Beta 1 usage/report roles; an AAL2 count-report owner gains no
other player's campaign access. `gamify_private` must remain unexposed.

The selected B2.1b storage route is **sealed gzip bytea pages plus a gzip bytea
operational snapshot/header**. The decoder is a private, bounded PLpgSQL RFC
1951/1952 implementation: stored/fixed/dynamic blocks, checked distances,
CRC-32/ISIZE, no concatenated members, and a hard actual-output bound independent
of the client-declared size. Protocol 3 accepts single-member browser gzip with
FLG=0; optional gzip headers and deflate transport are rejected. Parsed JSON is
walked before JSONB key collapse, checks duplicate keys, size/depth/nodes and
safe numbers, and must match the codec's sorted UTF-16-key canonical bytes.
Hashes cover **uncompressed canonical UTF-8**; accepted compressed bytes are
stored once and returned in base64. Compressed byte identity is not assumed
portable between clients. The SQL test embeds independently generated Node
zlib fixed/dynamic vectors as well as standard CRC and malformed-size cases.

Server validation reconstructs the complete evidence prefix and current
projection, checks stable IDs/kinds/ownership, backwards-only fact references,
duplicate facts, patch parents/paths, immutable pins and the archive manifest.
Its 79-key game-field allowlist matches `CLOUD_GAME_FIELD_OWNERSHIP` exactly;
profile/outbox/Auth keys cannot ride along as extra top-level game fields.
It reconciles the finance journal and card/review projection back to the opening
baseline, rejects a journal rewind/branch and limits reconstructed game text to
3 MB. This is structural/basic-invariant validation of browser-computed state,
not a server game engine, anti-cheat proof or clinician approval. Original local
file SHA/byte provenance is a client declaration: exact original recovery bytes
remain on the device, so SQL cannot independently prove their pre-migration
file hash. It does prove the received canonical storage bytes and invariants.

Lock order is membership -> account -> global quota -> campaign -> writer.
This reuses Beta 1 revocation/deletion authority without requiring usage consent.
Fresh Auth admission accepts provider invitations or the trusted setup marker,
never user metadata. Revision and generation/token are checked under locks.
Lease acquisition/explicit takeover advances generation, renew/release require
the exact generation/token, and expiry uses wall time after locks. Saves recheck
expiry after validation and immediately before snapshot acceptance. No state is
merged and no client chooses the next revision. The global lock serializes
cross-account reservations; purge skips locked memberships/accounts to avoid
waiting behind a writer while retaining that global lock.

Snapshot, newly sealed pages, eligible already-issued question receipts through
the existing Beta 1 deduplication path, quota reservation, pointer advancement
and receipt are one transaction. Imports cannot submit usage receipts. Current
and one server-validated prior snapshot remain; older snapshot bytes are pruned
only within successful replacement transactions. Prior loads return only their
own complete sealed-page prefix. No accepted evidence/header can be edited,
extended in place, dropped or purged while its campaign exists.

### RPC/transport contract for B2.3/B2.4 integration

**The new server adapter is protocol 3**, cloud envelope format 2 / evidence
contract 1. B2.1b's protocol 2 individual-row request is not directly accepted:
it lacks fencing/lifecycle/usage arguments and uses a different physical
transport. The codec files were not changed to disguise that distinction.
The manager must hand this contract to B2.3/B2.4 before transport integration.

All player calls go through the corresponding `public` functions:

| Function | Arguments / result |
| --- | --- |
| `beta2_cloud_access` | `p_protocol = 3`; capability, gates, notice and quota. Does not imply notice acceptance or enrollment. |
| `beta2_accept_cloud_notice` | `p_protocol = 3`, `p_version = 'beta2.cloud.v1'`; separate from `beta1.usage.v1`. Publish the reviewed notice before using this. |
| `beta2_cloud_list` | `p_protocol = 3`; small own summaries, decimal-string revision/generation, active lease/expiry, quota and server time. Opening a list never takes a lease. |
| `beta2_cloud_load` | `p_protocol`, `p_campaign_id`, nullable `p_revision`; packed snapshot/header/pages for current or retained prior. Decode/verify/hydrate before playing. |
| `beta2_cloud_lease` | `p_protocol`, `p_campaign_id`, `p_action` (`acquire`, `takeover`, `renew`, `release`), decimal-string `p_expected_revision`, decimal-string `p_writer_generation`, `p_writer_token` (64 lowercase random hex characters). Client mints/retains the unpredictable token; only its SHA-256 is stored. Returns accepted revision/generation, server time and expiry/release receipt; never echoes the token. |
| `beta2_cloud_write` | Exactly `p_request_text`, `p_request_sha256`; details below. Returns a small immutable receipt. |
| `beta2_cloud_operation` | `p_protocol`, `p_operation_id`; own `accepted` receipt or explicit `unknown`. Unknown is not permission to replay expired work. |
| `beta2_delete_my_data` | `p_scope = 'all-account-data.v1'`, `p_notice_version = 'beta2.cloud.v1'`; only after the new full-data confirmation. Does not require an unexpired writer, enabled capability or live membership admission. |

The write text contains exactly these fields:

```text
protocolVersion: 3
action: "import" | "save"
operationId: nonempty string, <=256 UTF-8 bytes
issuedAt: immutable ISO timestamp with timezone, within 7 days / +1 minute
expectedRevision: decimal bigint string ("0" for import)
writerGeneration: decimal bigint string ("0" for import)
writerToken: 64 lowercase random hex characters
campaignId: stable string, <=256 UTF-8 bytes
snapshot: CloudCompressedText from the format 2 envelope, encoding "gzip"
evidence: import {header, fromRecord:0, toRecord, pages}
          save   {headerSha256, fromRecord, toRecord, pages}
usageReceipts: [] for import; optional already-issued opaque question receipts
```

`pages` use the existing `CloudEvidencePage` shape (`firstRecord`, `recordCount`,
`content`). Pack only new canonical record texts, starting exactly at the last
accepted high-water. Even an accepted partial page is permanently sealed.
`snapshot` includes all campaign metadata, so rename/archive/restore use the
same fenced write. Restart creates another baseline/campaign and retains its
archive/slot; there is no destructive campaign-removal shortcut.

SHA-256 is over the **exact full `p_request_text` UTF-8**, including every token,
generation, lifecycle field, timestamp, evidence and usage argument. Freeze both
RPC arguments for retries; do not regenerate issuedAt, recompress bytes or reuse
an in-flight ID for a changed request. The same ID/hash returns its original
receipt even after takeover, subject to current admission/notice/capability.
The read-only outcome RPC remains usable when writes are disabled. Ordinary
receipts remain for eight days (longer than the immutable seven-day request
window); import receipts/provenance remain for the campaign's life.

An import creates revision 1/generation 1 and a 60-second lease for its token.
Refetch/verify before enabling commands and use the returned/current revision
when acquiring. Identical acquire/takeover retries preserve their original
expiry; they do not extend lease time. A changed takeover generation is a
conflict, requiring a fresh check and explicit decision. Save receipts contain
`operationId`, `requestSha256`, decimal `revision` / `writerGeneration`, snapshot
SHA/decoded/stored bytes, evidence high-water and server `acceptedAt`.

Expected SQLSTATE categories: `42501` access/notice/unavailable owned campaign;
`22023` invalid/unsupported bytes/protocol/identity; `40001` stale revision;
`55000` fenced/expired writer or server write gate; `54000` capacity; `P0001`
throttle with a JSON `DETAIL.retryAfterSeconds`. Conflict recovery must preserve
pending bytes and refetch; do not reinterpret these as a fresh empty campaign.

### Quotas, deletion and existing-object changes

Two cloud campaigns per account include archives. Snapshot ceiling is 3 MB;
snapshot plus account/campaign/rate/lease/receipt allowances share the 8 MB
account budget. Immutable header/page payload and per-page row/index allowances
share 1 MB/campaign and 2 MB/account. Binary allocations reserve payload + 12.5%
and 2 KiB/row; receipt composite size plus 1 KiB is charged separately. Fixed
account/rate/notice overhead is 8 KiB, campaign/writer overhead 4 KiB, and active
deletion-ledger rows reserve 1 KiB globally. Thus compression is not credited
while moving metadata into an uncounted table. Byte allowances are conservative
engineering reservations, not measured physical costs or a guarantee that the
measured fixture plus all future receipt/history overhead fits.

Processing bound is 6 MB including snapshot/header/all required decoded pages;
new decoded save evidence is capped at 1 MB. The 6 MB request check includes the
actual two-argument JSON wrapper/escaping; it cannot stop HTTP parsing before
PostgREST receives the body. Server rate windows permit 30 successful mutation/
lease calls including identical retries, 12 account / 6 campaign new checkpoints,
6 full loads and 120 metadata reads per 60-second server window. Failed RPCs
roll back their rate increments; ingress abuse limits remain a hosted gate.

Account warnings start at 80%; owner inspection warns at 300 MB actual database
size. Every new save reserves transient third-copy/evidence/index headroom and
cleanup margin against the 400 MB working ceiling. Deleted tuple estimates are
retained in the global reservation. The service-only `beta2_admin_cloud` supports
`inspect`, `configure`, `account`, `purge`, `acknowledge_cleanup`; the last requires
`{"vacuumVerified":true}` after the owner actually verifies cleanup outside a
transaction. It is an explicit operational attestation, not automatic proof of
space reclamation. Routine owner inspection returns aggregate counts/sizes,
not campaign contents. No player can enable capability or change limits.

Exactly two **existing Beta 1 objects** are replaced, with their signatures,
public wrapper/grants and existing Cron target preserved:

1. `gamify_private.request_usage_data_deletion()`: cloud-enrolled accounts get
   update-required `55000`, without deletion. Non-enrolled Beta 1 accounts retain
   the existing usage/flag/feedback deletion behavior and membership blocker.
2. `gamify_private.purge_beta1_retained_data()`: every existing Beta 1 retention
   statement remains; a new private cloud-purge call is added. Active campaigns,
   archived campaigns, current/prior snapshots, immutable evidence and live
   import receipts never inherit the 90-day usage retention rule.

The new full-data endpoint blocks membership, fences writers, removes cloud
account/consent/campaign/snapshot/page/operation/rate/quota state plus existing
usage/flags/feedback, and retains a minimal SHA-256-of-Auth-UUID ledger for 30
days, beyond the owner's 14-day backup retention. Auth cascades also record this
ledger and reconcile reservations. No email or payload enters it. Current
deletion records must be reconciled when restoring a backup; the ledger alone
inside an older backup cannot prove later deletions. Auth/invitation/private
export cleanup remains the owner's seven-day task. Setup-code cleanup stays out
of this transaction to avoid reversing the existing email -> membership lock
order; setup finalization cannot override the protected membership tombstone.

### Manual two-session lock/generation procedure (two SQL Editor tabs)

Use the **live game project**, role **postgres**, after reviewed migration
application; do not use real tester UUIDs or persist synthetic seeds. Complete
queries keep transaction/backend affinity even if the editor pools connections.

1. In tab A, run this whole query. While it sleeps, start tab B:

   ```sql
   begin;
   set local statement_timeout = '30s';
   select singleton from gamify_private.beta2_cloud_quota where singleton for update;
   select pg_sleep(20);
   rollback;
   ```

2. In tab B, run this whole query during A's sleep:

   ```sql
   begin;
   set local lock_timeout = '3s';
   do $lock_probe$
   begin
     begin
       perform 1 from gamify_private.beta2_cloud_quota where singleton for update;
       raise exception 'Expected lock contention was absent; repeat while tab A sleeps';
     exception when lock_not_available then
       raise notice 'Expected shared quota lock contention observed; rollback follows';
     end;
   end;
   $lock_probe$;
   rollback;
   ```

   Expect the notice after about three seconds and successful rollback. A missing
   contention error means the runs did not overlap; repeat. No quota value or
   tester data is modified. On any unexpected error, issue `ROLLBACK;` in that
   connection before continuing.

3. After A finishes, tab B runs the **complete** `beta2_cloud_saves.sql` from the
   README. Its generation checks prove takeover from 1 -> 2 without a new save,
   denial of the displaced token's save/renew/release and stale takeover,
   expiry/reacquisition to 3, immutable receipt retry, monotonic revision and
   prior-prefix retention. Capture its real final PASS row, not this recipe.

Uncommitted synthetic campaigns are invisible to the other editor session.
This procedure proves the shared reservation lock and the rollback suite proves
generation outcomes; it does **not** claim a concurrently committed shared-
campaign save/takeover race. Under the binding owner decision, actual same-
campaign device contention is the B2.6 desktop -> phone -> desktop trial. No
temporary committed synthetic campaign is required or authorized by this recipe.

### Validation and next action

Offline source checks verify UTF-8 without BOM, LF-only lines, final newlines,
balanced SQL lexical delimiters, eleven RLS-enabled/revoked tables, nine paired
wrapper/body signatures and matching explicit grants, exactly the two intended
Beta 1 replacements, rollback termination and a single final test result SELECT.
Independent fixed/dynamic gzip fixture bytes were generated using existing Node
zlib; no SQL interpreter/parser, PostgreSQL, psql, Supabase CLI or database was
used. These are source checks and prepared assertions, not a database execution.

Recorded offline checks (existing Node, inline scripts; each final exit **0**):

```text
STATIC CHECKS OK: 11 tables; 9 paired RPCs/grants; 2 Beta 1 replacements; balanced SQL delimiters; rollback-only single PASS SELECT; documentation fences; assignment declarations. SQL NOT EXECUTED.
FIELD CONTRACT OK: 79 server allowlist keys exactly match codec top-level ownership properties.
GZIP FIXTURES OK: 2 independently decoded Node vectors (fixed and dynamic), exact lengths/SHA-256. SQL NOT EXECUTED.
```

Manager next action: inspect the actual files, review the custom decoder and
byte/lock contract, apply the additive migration through the approved route,
run the full new rollback suite and five golden SQL vectors, and record actual
output. The historical Beta 1 usage/feedback suites include global assertions
that assume an otherwise empty disposable DB; manager live regression copies
must filter those assertions to the synthetic UUIDs while retaining their
expected values and permission checks. Historical test files remain unchanged.
All four Beta 1 regressions remain acceptance gates. Then prove real Data API grants, browser gzip
and byte contracts, ingress maximum, decoder latency comfortably below lease
expiry, 30-account physical/metadata/dead-row capacity, retention Cron, and
deletion-aware backup restore before enabling capability. Do not claim rollout
readiness from static review. The B2.3 handoff appended below reports reading
this migration and implementing the protocol 3 adapter. Manager review should
compare its actual arguments/receipts with this final SQL contract. This worker
did not send external messages or modify the B2.3 lane.

## B2.3 handoff (2026-10-17)

Worker: GPT-6.1 Sol, shared cache/coordinator lane. **Delivered for manager
review; cloud mode remains OFF by default.** This is client/offline protocol
validation, not hosted SQL, browser/phone, capacity or rollout acceptance.
The full plan, binding owner decisions, B2.1/B2.1b handoffs and the concurrent
B2.2 migration/handoff were read. No agents were spawned.

### Changed files and boundaries

New under `apps/player/src/session/cloud/`:

- `transport.ts`: account-bound transport contract, capability default OFF,
  immutable operations/receipts, lease/cadence/grace/recovery constants and
  redacted failure categories.
- `cache.ts`: schema-versioned `gamify-surgery.cloud-cache.v1` IndexedDB cache,
  backend/account/campaign namespace, transaction compare-and-swap, SHA-256/
  UTF-8 verification and readback, Web Locks when available, bounded recovery,
  explicit failure results and a fault-injectable memory cache.
- `coordinator.ts`: read-only verified open; explicit acquisition/takeover and
  Resume; 60 s lease, 15 s renewal; about 60 s ordinary dirty checkpoints and
  early coalescing with a 10 s automatic minimum cadence; fenced release;
  account/campaign lifetime guards; pending/retry/conflict/re-auth/expiry;
  shared asynchronous Save & Close and checked recovery-copy adoption.
- `gameSession.ts`: every cloud command goes through
  `applyGameEvidenceCommand`; current state/evidence and opaque question
  receipts are staged together. Synchronous command sequences coalesce, while
  the evidence wrapper observes each command. No gameplay replay on recovery.
- `supabaseTransport.ts`: thin named B2.2 RPC adapter and the sealed-page
  protocol-3 packing boundary described below.
- `fakeTransport.ts`: account-isolated deterministic server simulator with
  before/after-call failures, delayed replies, operation lookup, fencing and
  atomic fake save/evidence/count outcomes. It is not a SQL/RLS oracle.
- `index.ts`: public integration exports.
- `syncTestSupport.ts`, `cache.test.ts`, `coordinator.test.ts`,
  `gameSession.test.tsx`, `supabaseTransport.test.ts`: synthetic helpers and
  **74 new tests in four files**.

Existing source edits are limited to `accountStorageKey.ts` (new three-part
cloud namespace helper; original function/keys retained) and
`usePrototypeSession.ts` (optional, captured account/campaign cloud binding,
command and lifecycle guards, async cloud status/close fields, metadata
staging, focus/pagehide/unmount protection). No shell/App/UI redesign.

`localCampaignRepository.ts` is deliberately byte-unchanged: its global legacy
database cannot safely become an account/backend cache. The new repository
opens a separate database and never adopts/migrates that global data or the
historical prototype localStorage keys. No original local bytes were migrated,
claimed or deleted. Camera preferences remain device-local. Current callers
pass no cloud session and retain their local path; the full regression passes.

### Durability, recovery and wire contract

Each campaign cache entry atomically contains the last verified confirmation
and at most one recovery record: one immutable in-flight operation plus at
most one coalesced following candidate/evidence/count tail. The actual UTF-8
recovery envelope, including escaping, namespace, metadata and any wire
representation, must fit **7,000,000 bytes**. The 3 MB decoded snapshot/game,
1 MB new evidence/tail, 100-count-receipt and 6 MB actual RPC-wrapper checks
reject/pause instead of truncating history or growing an unbounded queue.
Browser quota/security/blocked/transaction/readback failure stops commands and
uploads and retains the attempted bytes in memory for checked recovery.

No request is sent before its immutable ID, exact bytes/hash and candidate
are committed/read back. Lost replies query the original operation first.
An accepted receipt advances only its covered snapshot/evidence/counts; a
newer following candidate is rebased without replaying commands. Prefixes are
compared by immutable IDs/uncompressed hashes, not assumed gzip-byte identity.
A missing operation may be rebound to a new lease/ID only after fresh admission
and an unchanged server revision/generation; an expired unknown operation
stops. An expired or taken-over branch cannot acquire permission by timestamp.

Detected connection/save/renewal failure gets at most 30 s grace, capped by the
conservative remaining server-confirmed lease. Independent wall/monotonic
deadlines, clock-discontinuity checks and elapsed-response subtraction prevent
sleep, clock changes or a late renewal from extending authority. Revocation,
expiry, storage/capacity failure and conflict block actual commands/ticks.
Focus/recovery requires fresh checks and explicit Resume; it cannot push a
cached paused state or silently start local play. Sign-out/switch/disposal
invalidate later callbacks and keep their original scoped recovery.

The actual B2.2 migration appeared during implementation and is used directly:

- `beta2_cloud_access(p_protocol)` / `beta2_cloud_list(p_protocol)`;
- `beta2_cloud_load(p_protocol, p_campaign_id, p_revision)`;
- `beta2_cloud_lease(p_protocol, p_campaign_id, p_action,
  p_expected_revision, p_writer_generation, p_writer_token)`;
- `beta2_cloud_write(p_request_text, p_request_sha256)`;
- `beta2_cloud_operation(p_protocol, p_operation_id)`.

The in-memory format-2 row candidate is an internal codec representation.
The real adapter seals only NEW canonical rows into existing
`CloudEvidencePage` objects and freezes the **protocol 3** full request:
`protocolVersion`, `action:"save"`, `operationId`, `issuedAt`,
`expectedRevision`, `writerGeneration`, `writerToken`, `campaignId`,
`snapshot`, `evidence:{headerSha256,fromRecord,toRecord,pages}` and
`usageReceipts`. Both exact RPC arguments persist in the frozen record;
retries never regenerate timestamps, tokens, compressed pages or hashes.
The duplicate local codec/wire representations are charged to the recovery
cap; they are not duplicate uploads. Loaded sealed pages are converted locally
to canonical rows for the existing format-2 verifier, with aggregate decode
bounds; accepted server pages are never repacked for upload.

Writer capabilities are random 64-character hex tokens, scoped to this
campaign/session. Auth/service credentials never enter the cache/payload.
RPCs check their captured account before and after each callback. The server
receipt's request digest covers every material wire field. B2.2 receipts omit
campaign/count-ID lists: the adapter reconstructs those only from the matching
durable request, while the coordinator checks its digest, operation, revision,
snapshot hash/bytes and evidence high-water. Unknown operations older than the
immutable seven-day request window are blocked, not reminted blindly.

New cloud answer counts use ONLY the cloud save's existing Beta 1 ingestion
path. They never enter the local usage outbox. Already-issued Beta 1 staged
IDs retain their old deduplication path; historical/imported history creates
no receipts. The real scored-answer test proves one durable opaque receipt,
zero retrospective/replayed count and one accepted upload contribution.

### B2.4 integration and remaining decisions

1. Keep the flag OFF until the manager accepts the remaining server/browser/
   notice/capacity gates. Supply a stable backend ID and the authenticated
   account ID; construct the Supabase adapter with an account-ID reader that
   returns null on session expiry. Call `open()` for a verified read-only view;
   opening never acquires/takes over. Call `startWriter(true)` only for the
   explicit takeover choice, then explicit `resume()` when the player continues.
2. Construct `CloudGameSession.create(coordinator, switchCallback)` from the
   verified state, build the matching loaded profile with its campaign tutorial
   metadata, and pass it as `usePrototypeSession(loadedProfile, cloudSession)`.
   Keep this one owner above entry and both shells, keyed/remounted on account
   or campaign change. `cloudSyncView` is shared by both layouts.
3. Use `saveCloudAndClose()` and await true for confirmed save + fenced release.
   The old synchronous `saveAndPause()` returns confirmation-required in cloud
   mode, never a false "safe to close" success. Duplicate close calls share one
   promise; Resume/new commands are blocked through release. Campaign switch
   invokes its supplied navigation callback only after successful close.
4. On conflict, preserve/download a checked recovery via `exportRecovery()` or
   `useAccountSave(keepRecoveryCopy)`. Adopting the account state must create a
   fresh coordinator/session/keyed mount from that verified state; do not keep
   the old in-memory game projection. Failed copy/export leaves recovery intact.
5. **Resolve before enabling: current build Undo is whole-state replacement,
   outside the domain evidence-command API.** Cloud mode safely refuses it
   instead of rewinding accepted finance/learning evidence. A separately owned
   domain command and its UI integration are needed to retain Undo for cloud
   campaigns. Ordinary local Undo is unchanged. No game-domain file was edited.
6. Entry/import opt-in, notice/deletion/clear-device UI, creation/restart/archive
   routing and shell status/choices remain the explicitly separate B2.4 lane.
   This save adapter does not enroll/import campaigns automatically. Manager
   validation of real Data API calls, SQL/gzip/capacity, browser lifecycle and
   physical-phone handoff remains required; these offline fakes cannot prove it.

### Validation and exact results

Existing installed dependencies and the already-approved narrow Windows
`net use` EPERM preload; no installation, network, Git or default-pool bypass:

```powershell
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/session
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
```

All final command exits **0**:

```text
Focused session: Test Files 93 passed (93)
                 Tests      964 passed (964)
                 Duration   100.88s
Full player:     Test Files 254 passed (254)
                 Tests      2385 passed (2385)
                 Duration   108.02s
Typecheck:       all seven workspaces passed
```

Coverage includes backend/A/B/prototype namespace preservation, IndexedDB CAS
and verification/abort boundaries, bounded frozen request/following state,
lost acknowledgments before/after server commit, refresh, old/new generation,
simultaneous takeovers, delayed release/renewal, focus during upload, sleep and
clock jumps, grace/expiry, re-auth/account switch/deletion, protocol/capability/
notice/capacity/throttle failures, actual blocked commands/ticks through the
shared React hook (including StrictMode), real scored-answer count staging and
the exact named protocol-3 RPC boundary. No test was skipped/weakened.

Raw logs, initial owned-file baselines and the final source manifest are under
ignored `.local-dev/beta2-b23/`: `session-tests-verified.log`, `player-full.log`,
`typecheck.log`, `baseline.json`, `owned-files.json`, `final-manifest.json`.
Scoped source/tests/docs are UTF-8 without BOM, LF-only, with final newlines;
credential-pattern scan passes. No clinical content, approval, concept IDs,
balance, FSRS semantics, fixtures, original saves, launcher or opening path
changed. B2.2 owns `supabase/**`; this worker only read those files.

**LOCAL ONLY:** no Git, installs, network, SQL execution, browser/owner storage,
agents, external messages, push, deployment or publication. The canonical owner
path stays `START_GAME.cmd` -> `http://127.0.0.1:4173` in its persistent profile;
remote remains `https://melissarowlandc-afk.github.io/GamifySurgery/`. No current
player save crosses origins/devices merely from this disabled implementation.
The manager owns acceptance, the current-thread handoff, the audited GitHub
checkpoint/reminder (**"push to GitHub"**) and release/enablement.

## Manager review of B2.2 (2026-10-17): simplify server validation

Not accepted as written. The migration implements gzip inflation (Huffman/CRC32), canonical JSON, patch replay and game-field validation in PL/pgSQL. Bit-level PL/pgSQL loops over 250 KB-1.8 MB payloads would take seconds per save and exceed Supabase's request statement timeout for the authenticated role (about 8 s by default), and the plan treats integrity as tamper-tolerant, not anti-cheat. **Manager decision:** the server stores compressed snapshot/evidence payloads OPAQUELY and validates only envelope metadata: declared and actual compressed byte lengths; pgcrypto sha256 of the compressed bytes against the declared hash; the declared uncompressed size within limits; revision/base-revision, writer generation/token and lease fencing; idempotent operation IDs; campaign count, quota, rate limits; atomicity; retention and deletion. Content validation is client-side: the codec verifies hashes and decodes on load, and on failure the client falls back to the prior verified revision and reports it. Build Undo must keep working unchanged for players: an Undo is checkpointed as a new revision; undone build receipts are marked reverted in evidence (append-only), never erased.

## B2.2 revision 1 (2026-10-17): opaque transactional server

**Status: revised offline for manager review; SQL has NOT run.** This section
supersedes the B2.2 handoff's server decompression, canonicalization, content,
finance/journal, patch/replay and domain-validation claims, and its old wire
examples/test output. The binding manager review immediately above governs.
The owner decision to validate on the live game project with rollback-only
synthetic SQL remains binding. No database, network, Git, install, deployment,
agent or player-source operation was used. This lane remains `supabase/**`
and this plan only; B2.3/player edits and all historical Beta 1 files survive.

Changed files:

- `supabase/migrations/20261018000100_beta2_cloud_saves.sql`
- `supabase/tests/beta2_cloud_saves.sql`
- `supabase/tests/README.md`
- New `supabase/tests/live/beta1_usage_and_flags.sql`,
  `beta1_owner_invite_admin.sql`, `beta1_tester_feedback.sql`, and
  `beta1_setup_links.sql`.

The migration is an unapplied, reviewed-file replacement, not an upgrade script
for an installed rejected draft. If that draft has been applied, the manager
must produce a forward migration that removes its obsolete helpers/types.
Do not rerun this CREATE-only migration against an existing Beta 2 schema.

### Server boundary and retained guarantees

Removed all 20 content/decompression helpers and the two custom composite types:
no inflater, Huffman/bit/CRC logic, canonical JSON, recursive JSON traversal,
UTF-16 ordering, evidence-reference resolver, patch replay, checkpoint/game-field
validator, finance/learning interpretation or tutorial interpretation remains.
No payload is converted to text or parsed by SQL. Stored snapshots, headers and
sealed pages are opaque `bytea`; uncompressed SHA-256 and byte counts remain
client declarations, bounded and returned unchanged for codec verification.

The 34 functions have fixed empty `search_path`. The only digest operations
are fully qualified native `extensions.digest(...,'sha256')`: one helper for
exact UTF-8 request/token/deletion identities and one for compressed payloads.
There are no per-byte PL/pgSQL loops. Each new payload is base64-decoded and
hashed natively; write loops visit at most 512 new page envelopes, twice (one
validation pass and one storage pass). Previously accepted evidence contributes
only indexed metadata counts and declared sizes; it is never fetched/decoded
by a save. A load returns its selected snapshot and sealed prefix unchanged.

Envelope checks are protocol 3 / cloud format 2 / evidence contract 1, exact key
sets/types, gzip encoding declaration, compressed actual versus declared length
and hash, declared uncompressed bounds, campaign summary/identity, immutable
operation ID/request digest and issue window, expected base revision, current
writer generation/token and server lease. Blob validity does not establish
that it is actually gzip or meaningful game data. The client codec must verify
bounded decompression, uncompressed length/hash, identities, manifests and all
content before hydration/confirmation. Tamper tolerance is not anti-cheat.

Preserved: two cloud campaigns/account including archives; account and project
reservations/warnings; all five rate buckets; membership -> account -> global
quota -> campaign -> writer lock order; monotonic bigint revisions/generations
serialized as decimal strings; wall-clock 60-second leases checked after locks
and again before acceptance; takeover fencing even without a new revision;
immutable retries; atomic page/snapshot/operation/optional Beta 1 usage receipts;
current plus immediately prior accepted snapshot; prior loads containing exactly
that revision's accepted evidence prefix; deletion/revocation and retention.
Snapshot/evidence limits and conservative row/index allowances remain as in the
original handoff. Operation accounting is deterministic from bounded identity
and receipt sizes so insertion/TOAST representation cannot change its purge cost.
Warnings cover 80% of account/campaign allowances and 300 MB measured or
accounted project usage; writes reserve below the 400 MB working ceiling.

The prior snapshot is available for **client verification**, not SQL-certified
content. On current-load failure the client must verify the prior revision and
report recovery. Recovery must preserve the actual server head/base revision
and append-only evidence high-water; it cannot decrement revisions or rewrite
sealed pages. Build Undo remains a normal higher-revision checkpoint whose
new evidence records mark undone build receipts reverted. There is no SQL
journal-sequence or game-value monotonicity rule to block it. Codec/Undo/recovery
acceptance remains in the player lane and the manager's integration review.

All 11 new tables have RLS and explicit raw-table revokes for PUBLIC/anon,
authenticated and service_role. Nine public wrappers are INVOKER; their private
RPC bodies are constrained DEFINER functions. Authenticated receives explicit
EXECUTE on the eight player wrappers/bodies and own-access RLS helper; only
service_role receives the aggregate/configuration owner tool. Internal helpers
are ungranted. Neither owner tools nor usage-report MFA confer payload reads.

**Only existing Beta 1 function replacements (both unavoidable and additive):**

1. `gamify_private.request_usage_data_deletion()`: lock/check cloud enrollment
   and reject old usage-only confirmation with SQLSTATE `55000`; otherwise
   preserve every original Beta 1 deletion/blocking statement and clean an unused
   cloud capability row. Its wrapper and prior EXECUTE grants survive.
2. `gamify_private.purge_beta1_retained_data()`: preserve all six original
   DELETE statements and add the private cloud metadata purge. Wrapper, Cron
   target, grants and pending setup-code nonexpiry survive.

No other historical migration/object definition changes. Schema USAGE grants
for authenticated/service_role are explicit. The new full-scope delete removes
cloud plus usage/flags/feedback, leaves the membership blocker and a hash-only
30-day restore ledger (including Auth cascade), and remains available after
revocation. Save receipts/rate rows expire after eight days; imports remain
idempotent for campaign life; expired writer tokens clear without generation
reset. Functional campaign/evidence/snapshot data does not expire at 90 days.
Deleted rows are not credited as reclaimed PostgreSQL space; explicit owner
VACUUM verification is still required before clearing the conservative dead
estimate. The owner's Auth/invitation/private-export cleanup remains seven days.

### Exact B2.3/B2.4 adapter changes required (no player files edited)

Inspected the current `supabaseTransport.ts`, `transport.ts`,
`codecCompression.ts`, `codecEvidencePages.ts` and codec metadata contract.
Keep `CLOUD_SYNC_PROTOCOL = 3`, all nine RPC names/signatures, lease arguments,
receipt keys, decimal revision strings and `evidence.pages` sealing/order.
The pre-enable wire envelope now requires these additions:

1. In `SupabaseCloudTransport.prepare`, put these three fields at the root:
   `cloudFormatVersion: 2`, `evidenceContractVersion: 1`, and
   `campaign: { campaignId: request.campaign.campaignId,
   name: request.campaign.name, status: request.campaign.status }`.
   This is exactly the three-key summary, not the full tutorial/timestamp object.
   The historical `codec.ts` `CLOUD_FORMAT_VERSION` is 1; use the format-2
   evidence constant or literal 2 here, not that deprecated format-1 constant.
2. Add `compressedSha256` to the outgoing snapshot and every page's content;
   the import adapter must also add it to the immutable header. Compute native
   Web Crypto SHA-256 over the exact bytes decoded from `dataBase64`, producing
   64 lowercase hex characters. Preserve `encoding`, `dataBase64`,
   `compressedBytes`, `uncompressedBytes`, `uncompressedSha256` unchanged.
   A transport-local extended wire type/helper is sufficient; changing the
   codec's stored canonical/uncompressed identity is unnecessary.
3. Freeze the new full JSON text and its request hash once, BEFORE durable cache
   commit/send, as the existing coordinator already requires. Apply the 6 MB
   encoded RPC argument-body check after these fields are present. Identical
   retries must reuse those exact bytes and IDs. Do not mutate existing frozen
   requests; resolve their outcome first. Since this is a pre-enable revision
   of protocol 3, old bodies missing the additions fail `22023`; no deployed
   client should be enabled until the adapter is updated. Rebase/rebuild a
   confirmed-unaccepted old operation with a fresh ID and current head rather
   than silently changing an ambiguous in-flight request.
4. `load` returns the same packed fields plus `compressedSha256`. Validate
   its shape and compressed length/hash before decoding, then retain all codec
   uncompressed/content checks. This can use an async transport helper without
   changing `CloudCompressedText`'s uncompressed logical identity. Selective
   response `list.baselineId` is removed (the inspected adapter never read it);
   `CloudConfirmed.baselineId` still comes from the verified snapshot envelope.
   No baseline/manifest/journal fields need new write arguments.
5. Expose/parse list's existing `priorRevision: string | null` in the client
   head/summary and use the already supported `load(campaignId, revision)` /
   `p_revision` path for reported prior recovery when current verification
   fails. Preserve real server base/high-water fencing during subsequent work.
   Receipts still return `snapshotSha256`/`snapshotBytes` as the declared
   uncompressed identity/size; they confirm byte storage, not decoded content.
   Keep Undo's append-only reverted receipts and ordinary new-revision behavior.

### Rollback tests, filtered Beta 1 regression and manual contention

The rewritten Beta 2 suite has exactly one final PASS result row. It covers
A/B/anon, actual RLS and ACLs, trusted versus user metadata, consent separation,
wrong compressed hashes/lengths and envelope versions, size/page/prefix/body
limits, stale base/generation/token, takeover/expiry/release/retry fencing,
atomic late usage failure, prior prefix retention, bigint revisions, quotas and
warnings, all rate buckets, retention, mixed-client/full deletion, fresh Auth
revocation/bans, Auth cascade and deletion-ledger expiry/accounting. Opaque
non-gzip fixtures deliberately prove that SQL does not interpret content.

One accepted checkpoint uses 1.5 MB of native set-generated MD5 blocks (little
repetition), yielding an approximately 2 MB request. Generation and caller-side
request hashing occur outside the timed RPC. The RPC must finish in less than
one second without contention; otherwise the test raises before PASS. The test
prints NOTICE `B2.2 2 MB cloud write elapsed_ms=<measured value>`. No actual
value or live latency result is available in this worker environment.

Expected final row (recipe only, not observed):

```text
PASS: Beta 2 synthetic isolation/fencing/leases/opaque-integrity/atomicity/quotas/limits/retention/deletion/grants/search_path checks; rollback follows
```

README now gives the complete SQL Editor sequence, expected output and exact
live Beta 1 variant files/PASS strings. Run each entire file as postgres in a
separate query; never select fragments or replace ROLLBACK. On any error issue
ROLLBACK immediately in that connection. No Beta 1 assertion is skipped:
39 usage / 20 invite / 35 feedback / 40 setup original assertions survive, with
additional fixture collision guards. Owner-wide usage totals, flag edits/read,
retention/global receipt assertions and feedback owner/service totals are
synthetic-filtered with unchanged expected values. Own-account RLS counts remain
unfiltered to catch leaks. Setup emails now use example.invalid, with guards
for pending-code-only fixture emails too. Actual retention routines still
visit expired live rows under rollback; document/capture their temporary locks
and run in a quiet window. Original historical test files are unchanged.

Short two-editor-tab procedure, still wholly rollback-only, after the reviewed
migration is applied (postgres, same live game project):

1. Tab A runs the entire query below; start B while A sleeps:

   ```sql
   begin;
   set local statement_timeout = '30s';
   select singleton from gamify_private.beta2_cloud_quota where singleton for update;
   select pg_sleep(20);
   rollback;
   ```

2. Tab B runs the entire query during that sleep:

   ```sql
   begin;
   set local lock_timeout = '3s';
   do $probe$ begin
     begin
       perform 1 from gamify_private.beta2_cloud_quota where singleton for update;
       raise exception 'No overlapping lock observed: repeat while A sleeps';
     exception when lock_not_available then
       raise notice 'Expected quota lock contention observed; rollback follows';
     end;
   end $probe$;
   rollback;
   ```

   Expect the notice after about three seconds. On unexpected error run
   ROLLBACK in that connection. Neither query changes any quota value/user row.
3. After A finishes, run the entire revised Beta 2 suite in B and capture its
   actual timing notice and final PASS. Its generation assertions prove takeover
   1 -> 2 without a save, stale-token rejection, expiry/reacquisition to 3,
   original receipt retries and monotonic revisions. Invisible uncommitted
   synthetic campaigns cannot be shared between tabs; this procedure proves
   shared-lock contention plus deterministic generation outcomes, not a committed
   same-campaign race. The binding owner decision assigns the actual device
   race to B2.6 desktop -> phone -> desktop. No committed synthetic seed is used.

### Validation and handback

Local source-only check (Node built-ins, PowerShell, exit 0):

```text
PASS source-only: 7 files UTF-8/no-BOM/LF; SQL quotes/dollar blocks/parentheses balanced.
PASS source-only: 11 RLS-scoped tables; 34 fixed-path functions; 9 invoker wrappers; 2 existing replacements.
PASS source-only: zero content/decompression helpers; 2 fully qualified pgcrypto calls; only bounded new-page envelope loops in writes.
PASS source-only: rollback suites have one final SELECT/PASS; representative 2 MB write has a <1 s live assertion.
PASS source-only: all 6 historical purge DELETE statements and 39/20/35/40 Beta 1 assertions retained.
NOT RUN: PostgreSQL, Supabase/Data API, RPC timings, SQL assertions.
```

The source review checked PostgreSQL 15/17 row/composite expressions, native
bytea digest/base64 handling, bigint string arithmetic, function volatility and
empty paths, SQL role versus JWT claim enforcement, RLS/ACLs, statement rollback,
lock ordering, wall-clock expiry, deterministic receipt accounting and retention
boundaries. Deliberate `22023` errors preserve their constant messages (including
operation expiry for the adapter); native JSON/cast errors are sanitized.
Lexical/source checks are not a PostgreSQL parse or database PASS.
This appended handoff is UTF-8 without BOM/LF as well. No SQL/browser/player
regression result is claimed and no clinical content or owner save was touched.

**Next action:** manager reviews the actual changed files and required adapter
follow-up, applies only the reviewed migration, runs revised Beta 2 + all four
live-filtered Beta 1 suites and the two-tab probe, captures real timing/Data API
and capacity results, and reviews client verification/prior fallback/Undo before
B2.4 enablement/B2.6. Server flags and client default remain off. The manager owns
acceptance, current-thread handoff, audited GitHub checkpoint/reminder and rollout.
This checkpoint remains local only; no Git command was used by this worker.

## B2.2 live application (2026-10-17, manager)

Owner signed in to the dashboard in the manager's browser pane. Applied in the live SQL editor, each from a SHA-256-verified copy of the repository file: 20261017000100 (service_role EXECUTE on gamify_private.valid_flag_choices) and 20261018000100_beta2_cloud_saves.sql. The first application attempt of 20261018000100 failed atomically (begin/commit; nothing applied) on a PL/pgSQL parser quirk: an unparenthesized `case when ... then ... end` inside an IF condition ends the condition at the inner THEN. The manager parenthesized the two affected expressions (lines 480 and 516; a scan found no others) and reapplied: success. Final file SHA-256 prefix a20d18f8df94af64. The dashboard's static "creates tables without RLS" warning is a false positive (RLS is enabled by a dynamic loop); ran exactly as reviewed. Verified live: 11 beta2 tables, 0 without RLS, 32 beta2 functions, 0 anon table grants. Rollback-only tests in the live SQL editor: supabase/tests/beta2_cloud_saves.sql PASS; live-filtered Beta 1 suites PASS (usage_and_flags, owner_invite_admin, setup_links, tester_feedback). Tester flag a09b77ff marked fixed_in_version 1865337f; the owner test flag was closed as no_change. Cloud client remains OFF.

## B2.4 handoff (2026-10-17)

Worker: GPT-6.1 Sol, entry/import and both-shell lane. **Implementation is
complete for manager review; final regression results are recorded below.**
Cloud saving remains OFF by default. No Git, installation, network, Supabase,
browser launch, agent, external message, deployment or publication was used.
The applied migration was read, not edited or accessed remotely; its file SHA-256
is `a20d18f8df94af647382bd415ce8d5a7f07cfd0e32e0136aef8d3c94489ed1d8`.
This handoff does not accept hosted, physical-phone, capacity or rollout gates.

### Files and integration

Existing owned player edits:

- `App.tsx`, `AppShell.tsx`: one account router/coordinator above entry and
  either shell, verified cloud-session mounts, explicit local/account selection,
  fresh account creation, fenced archive/restart/restore, async close/switch,
  recovery adoption via a new session mount, and desktop account controls.
- `mobile/MobileShell.tsx`, `mobile/MobileTopBar.tsx`: the same save controls and
  states in the phone header and More adapter. The desktop and phone share the
  `AppShell`/`PrototypeShellProps` contract; no separate sync implementation.
- `ui/AccountMenu.tsx`, `ui/CampaignManager.tsx`, `ui/RestartDialog.tsx`,
  `ui/ResourceBar.tsx`:
  versioned notice, two-slot/archive wording, full-data deletion, ordinary
  sign-out retaining recovery, explicit clear-this-device confirmation and
  shared-device warning. Local campaign-manager behavior remains the old path.
- `auth/AuthAccountContext.tsx`, `auth/AuthGate.tsx`: an additive durable-save
  sign-out guard, explicit sign-out result and flag-dependent entry wording.
- `playtime/playtimeTracker.ts`: optional full-deletion callback; unchanged
  no-argument Beta 1 usage-only deletion path.
- `session/usePrototypeSession.ts`: additive cloud Undo, cloud mode-entry gates,
  phone hallway persistence routing, and a scoped local writer/export boundary
  so clear-device cannot be undone by pagehide/unmount. Prototype keys and
  ordinary local Undo still use their existing behavior.
- `session/cloud/transport.ts`, `supabaseTransport.ts`, `coordinator.ts`,
  `gameSession.ts`, `cache.ts`, `fakeTransport.ts`, plus the existing
  `supabaseTransport.test.ts` and `gameSession.test.tsx`: opaque-server adapter,
  reported prior recovery, session rebind guard, scoped clearing, import API and
  additive Undo support. Ordinary B2.3 frozen-operation/recovery limits survive.

New player modules/tests:

- `session/cloud/CloudAccount.tsx` and `CloudAccount.test.tsx`: OFF-by-default
  account capability owner, account lifetime fencing, notice/deletion controls,
  checked export and scoped clearing; late entry/import callbacks cannot restore
  records after sign-out/clear. The separate cache database remains unchanged.
- `session/cloud/entryStorage.ts`, `importCampaigns.ts`,
  `importCampaigns.test.ts`, `priorRecovery.test.ts`: verified account/backend
  IndexedDB raw sources, frozen import journals, additive enrollment markers,
  original-byte inspection, source/name/ID/version/size checks and idempotent
  import/readback. This never opens the legacy global IndexedDB repository.
- `ui/CloudSaveControls.tsx`, `CloudSaveControls.test.tsx`,
  `CloudCampaignEntry.tsx`, `CloudCampaignEntry.test.tsx`, `cloudEntryError.ts`,
  `cloudSaves.css`: identical shared status/dialog/action states, compact local
  labels, native keyboard modal behavior, focus restoration, live announcements,
  44px touch targets, wrapping and bounded scrollable dialogs.
  Recovery preparation is distinct from a verified device write and account
  acknowledgement, and disabled playback controls state the actual sync reason.
- `cloud-saves-qa.html`, `src/qa/cloudSavesQa.tsx`, and
  `tests/e2e/cloud-saves.spec.ts`: dev-only disposable fake-transport entry and
  five two-context scenarios (10 listed desktop/phone project cases). The entry
  requires test-runner authentication/transport bindings; it cannot fall through
  to live Supabase and is not an input to the release build. Existing e2e files
  and Playwright configuration were not edited. Listing is not execution.

The sole domain source edit is `packages/game-domain/src/game-evidence.ts`;
new `packages/game-domain/tests/game-evidence-undo.test.ts` covers its additive
boundary. No reducer, persistence, index, balance, clinical content, approval,
concept ID, fixture, launcher, dependency or owner save was edited. Scoped
before/after sources and the actual unified diff are under ignored
`.local-dev/beta2-b24/` (`baseline/`, `baseline.json`, `changes.patch`,
`owned-files.json`, `final-manifest.json`). The manager owns the current-thread
handoff and final diff acceptance; this worker did not change that document.

### Opaque adapter and prior recovery

Protocol 3 now sends exactly the migration's root `cloudFormatVersion:2`,
`evidenceContractVersion:1` and three-key `{campaignId,name,status}` summary.
Snapshot, every sealed page and the import header carry SHA-256 over their
exact compressed bytes. Loaded blobs are checked for shape, compressed bounds,
length and hash before any decoding; existing bounded uncompressed hash,
manifest, identity, finance/card/pin and logical hydration checks remain. The
decoded current campaign summary is checked against its declared server head.
The exact complete wire text/hash is frozen before cache commit and measured
with the final RPC argument wrapper. Imports use the applied `action:"import"`
shape, no usage receipts and the unchanged nine public RPC signatures; full
deletion sends only `all-account-data.v1` / `beta2.cloud.v1`.

List/head expose `priorRevision`. If current content verification fails, the
client verifies that exact prior and reports it. A recovered prior is **view and
export only**: its verified revision, actual server head and actual head evidence
high-water stay separate. It cannot acquire a writer, decrement the server base,
truncate sealed pages or silently replace newer evidence. Current/prior failure
preserves bytes and blocks. A later repaired current save is checked again.
Returning to a different accepted revision also requires a fresh game-session
projection; a newly verified cache cannot authorize the old in-memory game.

### Import, usage and privacy behavior

Sign-in never uploads campaigns. Entry separates account and device lists with
names/status, account-save time and local level/serialized size; the applied
small summary RPC does not provide a facility level for an unopened remote
campaign, so none is invented or downloaded just to fill a card. Archived and
recovery campaigns count toward the two cloud slots. Extra local campaigns stay
intact; archive/restart does not free a slot. New account creation durably keeps
its generated source before import, and failed creation remains a retryable
device source. Account restore is a fenced metadata checkpoint, not a new copy.

Exact own-account profile/legacy strings are retained before parsing. Unowned
sources are inspected only on explicit selection and copied only after a
separate claim to the displayed account; another account's keys are never read.
Copy selection and optional unique name are explicit. Every frozen operation,
timestamp, token and body survives retry. A crash/lost acknowledgement after
server acceptance queries that same operation and verifies the accepted full
logical state/evidence prefix before an additive enrollment marker. ID/name
collisions, changed branches, invalid/future/oversized data, partial batches,
quota or storage failure preserve the original bytes. Raw-source retention is
subject to browser capacity; the 7 MB limit still applies to pending operational
recovery/import requests, not to the whole existing local profile.

Import history creates zero question counts. Already-minted, current own-account
Beta 1 staging receipts finish through the existing usage outbox with their
original IDs and existing usage consent. An additive bounded promotion marker
avoids resubmitting them on every entry; original profile bytes stay unchanged.
Unowned staging IDs are never claimed, and no receipt is derived from FSRS or
clinical history. New cloud answers retain the B2.3 cloud receipt path alone.

The notice is `beta2.cloud.v1` and distinguishes full functional campaign storage
from the owner's count-only report. It states synthetic-only input, support use,
campaign versus 90-day usage retention, weekly/two-copy/14-day backup policy,
seven-day remaining account administration and 30-day hash-only restore ledger.
`VITE_CLOUD_SAVES_ENABLED` is unset/false by default; no flag/env was enabled or
read from a populated environment file. Before enablement the manager must
publish the **verified** service region in `VITE_CLOUD_SAVES_REGION` and accept
the B2.5 backup/restore/capacity gates. Missing region blocks new notice
acceptance; this worker did not invent a region or claim a running backup.

Ordinary sign-out preserves scoped recovery. The explicit clear choice requires
confirmation that unsent work is account-confirmed or exported, warns about
shared devices/other tabs and stops old writers before deletion. Clearing is
checked while the account UI can still report failure, before sign-out. Device
exports include current in-memory local/cloud work; unreadable stored copies
are reported. Clear affects only this account at this backend/origin; other
accounts and the unowned prototype remain. Full deletion has a new confirmation
and stops commands/uploads immediately, including when hosted deletion is not
confirmed; retry stays available. The old endpoint is never silently widened.

### Build Undo and Level 5 rebind

`applyGameEvidenceBuildUndo` restores the exact same whole-state build target
used by local Undo, while appending a compensating transition and
`build-reversion` records referencing the original immutable receipt records.
It checks pause, clock, identity/pins and unchanged learning history. The journal
head advances; finance reconciliation remains intact; accepted evidence is never
removed. The client checkpoints Undo as a higher cloud revision, including an
already-saved build. Desktop Undo labels/count/history and phone hallway strokes
remain the existing player-facing behavior. Long strokes locate all reversed
receipts in the journal, including those trimmed out of the runtime's 96-receipt
view; previously reverted commands are not marked again.

Only one existing Level 5 hashed input changed in this lane:

| Recorded input | Before / recorded | After |
| --- | --- | --- |
| `packages/game-domain/src/game-evidence.ts` | `fe67f56bba365dc6f3a459fd6c06f907784f92ee483cbe6a1041347af045a714` | `82b9af0c1e70bf6d6bfd7b10dd2075093ebce2294b76a3a211839912ec8568e0` |

`index.ts`, `reducer.ts` and `persistence.ts` are byte-unchanged by this worker.
The manager rebinds through its authorized lane after reviewing the additive
Undo evidence. No recorded hash, fixture, test or evidence artifact was weakened
or rebound here. Focused domain Undo validation passes **4/4**, including a real
101-command build/sell sequence, receipt trimming, exact restore and no duplicate
reversion. Ordinary reducer/save byte fidelity remains covered by B2.1b tests.

### Validation and manager next action

Final required regression results: **player 2,474/2,474 in 259 files, exit 0;
all seven workspace typechecks, exit 0; domain 4,295 passed / one permitted
recorded-input failure in 161 files, exit 1**.
The requested commands run unchanged, with the existing approved narrow
Windows preload only for the player suite:

```powershell
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1
npm.cmd run typecheck
```

Final logs are `player-final.log`, `domain-final.log` and
`typecheck-final.log` under `.local-dev/beta2-b24/`. Player-focused integration
passes **103/103 in six files** before the final long-stroke addition; focused
domain Undo passes **4/4** after it. A final import/entry check passes **21/21 in
two files** after the metadata validation/type adjustment. All seven typechecks pass after the final
source change. UTF-8/no-BOM/LF and scoped source checks are recorded with the
final manifest. A Node subprocess logging helper hit sandbox `spawn EPERM`;
the required commands run directly via PowerShell/npm.cmd and their logs use a
UTF-8/no-BOM StreamWriter. No dependency or sandbox bypass was installed.

Exact final summaries from the required commands:

```text
Player: Test Files 259 passed (259)
        Tests      2474 passed (2474)
        Duration   117.14s
        Exit       0
Domain: Test Files 1 failed | 160 passed (161)
        Tests      1 failed | 4295 passed (4296)
        Duration   1052.76s
        Exit       1
Typecheck: all seven workspaces passed; exit 0
```

The only domain failure is
`tests/level-five-integration.test.ts:47`, the unmodified recorded-input check:

```text
Expected: fe67f56bba365dc6f3a459fd6c06f907784f92ee483cbe6a1041347af045a714
Received: 82b9af0c1e70bf6d6bfd7b10dd2075093ebce2294b76a3a211839912ec8568e0
Input:    packages/game-domain/src/game-evidence.ts
```

No other failure or skipped/weakened test was introduced. The PowerShell log's
`System.Management.Automation.RemoteException` separators are stderr-stream
wrappers around this same Vitest/npm failure, not additional failed tests.
Final audit covers **38 owned files**, all UTF-8 without BOM, LF-only, with a
final newline; scoped credential-pattern checks pass. No unexpected existing
source outside this lane changed relative to the worker's captured baseline.

Playwright discovery (exit 0) lists **10 tests in one file** across the desktop
and phone projects. **No Playwright, physical phone, real Auth/Data API, ingress,
database-capacity or hosted save acceptance is claimed.** The manager runs the
new flows and existing e2e regressions in its capable environment, checks actual
phone suspension/touch/keyboard behavior, reviews the diff and rebinds Level 5.

For those manager tests only, use the disposable QA server/profile at exact
`http://127.0.0.1:5184` (`location.origin`), with `cloud-saves-qa.html` loaded by
the e2e runner's fake bindings. It has separate storage and cannot move owner
saves. This worker did not start or reconfigure a server or opening pathway.

```powershell
$env:GAMIFY_E2E_EXTERNAL_SERVER = '1'
$env:GAMIFY_E2E_BASE_URL = 'http://127.0.0.1:5184'
node node_modules/@playwright/test/cli.js test tests/e2e/cloud-saves.spec.ts --project=desktop-chrome --project=phone-chrome
```

The owner pathway remains `START_GAME.cmd` -> exact `http://127.0.0.1:4173` in
the usual persistent browser profile; prototype campaigns stay local. Remote
remains `https://melissarowlandc-afk.github.io/GamifySurgery/` with separate
origin-local storage. No save crossed origins/devices from this OFF build.

**LOCAL ONLY:** the manager owns acceptance, the current-thread handoff, the
audited checkpoint and **"push to GitHub"** reminder, rollout and publication.
Do not enable the client on this worker's mocked evidence alone.

### Manager QA of B2.4 (2026-10-17)

Ran tests/e2e/cloud-saves.spec.ts against the 5184 QA server (fake transport, no live Supabase): 16/20 initially. The four failures (one scenario x four projects) were a real UI race: CloudSaveControls reset its local `closed` flag on any non-closed phase update, so a status update arriving after the Save & Close promise could hide "Safe to close this tab" although the save and fenced release succeeded. Manager fix: derive `showClosed = closed && view.phase === "closed"` and stop resetting on intermediate phases. The unit test now models the coordinator's closed phase. Rerun: CloudSaveControls 51/51 (and MobileShell); cloud-saves e2e 20/20 with no retries.

## B2.5 handoff (2026-10-17)

Worker: GPT-6.1 Sol, capacity/backup/integrated-recovery lane. **Local tools and
recovery assertions delivered for manager review. This is not live capacity,
backup/restore, browser or rollout acceptance.** The full plan, binding owner
decisions, applied opaque B2.2 migration, B2.4 handoff and manager QA were read.
No Git, installations, network, Supabase access, browser launch, agents or
external messages were used. Cloud remains OFF; no real key/env or owner save
was read. No clinical content, approval, balance, game source, player source,
launcher or shared Level 5 evidence/checkpoint was changed.

### Delivered files and boundaries

- `tools/cloud-capacity/capacity.mjs`, `capacity.test.mjs`, `README.md` and
  `results-20261017.json`: Node-only synthetic measurement with the actual
  format-2 codec, protocol-3 packed load shape and immutable sealed gzip pages.
  Imports the existing source loader and reducer journey; no installs/builds.
  Fetch is refused by the CLI. Only the explicitly requested JSON report is
  written; fixtures and real saves are read-only/out of scope.
- `tools/cloud-capacity/capacity-monitor.sql`: **read-only**, one SQL Editor
  result set covering per-account compressed payload/reservations, all eleven
  Beta 2 table allocations with `pg_total_relation_size`, actual database size,
  cleanup estimates and 80% / 300 MB / 400 MB warning/stop thresholds. Physical
  per-account tuple/index attribution is deliberately not invented.
- `scripts/beta-backup/beta-backup.mjs`, `verify-codec.mjs` and
  `beta-backup.test.mjs`: private owner-PC export, disk/hash verification,
  two-copy/14-day pruning, deletion cleanup, scoped default-dry-run restore and
  read-only live codec readback. Uses the existing ignored admin env, injected
  fetch in tests, HTTPS-only fixed project, no redirects or secret/error-body
  output, checked real paths and a local job lock. No dependencies were added.
- `scripts/beta-backup/install-backup-rpcs.sql` and
  `backup-restore.test.sql`: **new optional service-only helpers**, plus a
  rollback-only synthetic live-project rehearsal. The applied B2.2 SQL and its
  existing grants/RLS are unchanged. Manager must review/apply/test these files;
  no SQL execution is claimed here.
- `docs/setup/BETA2_BACKUP_RESTORE.md`: weekly export and daily expiry task
  setup, private encrypted-volume requirement, recovery point, deletion-aware
  restore/readback, limits and exact owner/manager actions.
- `tests/e2e/cloud-recovery.spec.ts`: eight desktop/phone fake-transport cases:
  unavailable service while browser stays online, read-only service gate,
  approaching-capacity warning/hard pause, and verified-prior view/export with
  the actual server head/evidence preserved. Real command blocking, pending
  recovery, no false Safe to close, downloads and no usage replay are asserted.
  Existing QA entry/hooks and existing e2e files are unchanged.

Only this appended handoff and those twelve new files belong to the lane.
The manager retains `CURRENT_THREAD_HANDOFF.md`, Level 5 rebind/evidence,
acceptance, checkpoint, publication and capability/region enablement.

### Capacity results: estimates, not physical database measurements

Reproduction, from the repository root with installed Node 24:

```powershell
node tools/cloud-capacity/capacity.mjs --days 1 --seal-every-minutes 60 --max-wall-seconds 180 --out tools/cloud-capacity/results-20261017.json
```

The JSON records exact fixture/code SHA-256 receipts and every measurement.
The integration input read here is **12,538,464 bytes**, SHA-256
`8a5df5958d85d1a9271ceaf35215793aa4e31318f0afe744a4e7c9f1f9384e73`.
It was read once into memory and was not regenerated by this worker. This
receipt replaces neither the concurrent worker's evidence nor its acceptance.

Decimal MB/GB throughout. Account figures model **two** equivalent campaigns,
each with current plus prior snapshot, one header, all sealed pages, 4 KiB
campaign/writer allowance, a lifetime import receipt and eight days of saves;
the account also reserves 8 KiB. SQL binary cost is payload + ceil(12.5%) +
2 KiB per row. Estimated operation cost uses a 64-byte ID, actual campaign-ID
length and 1 KiB receipt plus the SQL identity/index allowance; the SQL maximum
operation shape is separately recorded as 4,096 bytes. Imports estimate the
prior at current size; continuation uses the previous measured checkpoint.

| Synthetic checkpoint | Current snapshot gzip B | Header + sealed pages gzip B | Evidence SQL reservation B/campaign | All retained bytes + operations MB/account | 30 accounts/60 campaigns + 50 MB shared reserve |
| --- | ---: | ---: | ---: | ---: | ---: |
| Legacy Level 3 | 1,384 | 18,604 | 25,026 | 1.376 | 91.267 MB |
| Level 5 economy | 3,517 | 164,524 | 221,963 | 1.778 | 103.337 MB |
| integration-l4 | 2,102 | 85,723 | 114,875 | 1.571 | 97.137 MB |
| integration-build | 2,056 | 86,434 | 115,673 | 1.573 | 97.178 MB |
| integration-preparing | 2,845 | 143,159 | 193,828 | 1.732 | 101.974 MB |
| integration-running | 2,682 | 151,152 | 204,870 | 1.754 | 102.615 MB |
| integration-final | 3,036 | 167,158 | 224,922 | 1.796 | 103.866 MB |
| integration-finish | 3,038 | 157,013 | 213,510 | 1.773 | 103.181 MB |
| integration-repeat-final | 494 | 185,013 | 251,156 | 1.837 | 105.096 MB |
| integration-repeat | 493 | 174,605 | 239,447 | 1.813 | 104.394 MB |
| integration-lower-repeat | 10,678 | 195,202 | 266,714 | 1.913 | **107.405 MB** |
| Same campaign +204 facility minutes | 29,870 | 238,747 | 330,041 | 2.123 | **113.694 MB** |

All eleven starting fixtures and the observed continuation fit the applied
8 MB snapshot/auxiliary, 2 MB account-evidence and 1 MB campaign-evidence
reservations. The observed continuation decodes a 1,797,220-byte game and
2,622,742-byte complete snapshot/header/page load, below the 3 MB game and
6 MB processing ceilings. That does not bound future growth.

**Long-play coverage is explicitly partial:** requested one 600-minute
operating day; completed **204 minutes = 0.34 facility days**, 217 actual
evidence-routed commands, at the configured 180-second continuation budget
(180.559 seconds recorded before final-tail verification). Reused the existing
journey's chart selection, real answer actions, review clock and day boundaries;
did not rerun the whole expensive Level 4/5 journey. Pages sealed at each
60-minute checkpoint and the final tail (29 total) remained unchanged. Every
original record prefix and all decoded sealed rows were compared exactly.
No history was truncated. Larger `--days` / `--max-wall-seconds` runs are
available to the manager; a full-day or indefinite-play PASS is **not** claimed.

The database estimate leaves the 50 MB shared allowance, the original target's
50 MB below the 400 MB working ceiling, and 100 MB between that ceiling and
the 500 MB provider cap. Actual table/TOAST/index/dead-row and transient bytes
still require the live monitor; client gzip is not credited as another TOAST
saving or proof of physical free space.

| Conservative repeated-write scenario | Mature starting checkpoint | +204-minute checkpoint | Working-budget outcome |
| --- | ---: | ---: | --- |
| Steady reservations + shared reserve | 107.405 MB | 113.694 MB | Below 400 MB |
| One day unverified snapshot/receipt cleanup + 30-account transient margin | 145.634 MB | 199.856 MB | Below 400 MB estimate |
| Eight days unverified cleanup + same transient margin | 392.438 MB | **773.115 MB** | Continued-play model exceeds both 400 and 500 MB |

**Lossless operating condition:** review capacity/cleanup **daily** while the
cohort is active, confirm actual VACUUM/reusable-space behavior, and only then
use the existing explicit `acknowledge_cleanup` attestation. Purging is not proof
of reclamation. Keep the server's conservative safe pause and reservation guard;
an eight-day unattended-cleanup promise fails this model. Further lossless
options are coalescing redundant checkpoints while retaining every evidence
fact, avoiding unchanged uploads, reviewing bounded operation-receipt overhead,
and a smaller staged active cohort. Immutable page caching/delta downloads or
future page layout improvements need a separately reviewed protocol change;
never repack accepted sealed pages or truncate FSRS/money/inspection history.
Discuss an owner-approved paid plan only if measured usage requires it.

### Monthly transfer

Assumptions are exposed in JSON: 30 accounts, 30 active days, two 30-minute
sessions/account/day, 36 checkpoints/session (including early coalesced saves),
15-second renewals, 60-second metadata checks and 2 KiB small-response/header
allowance. Demand is per account and split across two campaigns. Five weekly
exports cover a long billing month; private export JSON doubles binary bytes
for `bytea` hex and includes modeled metadata/operations plus an explicit,
unmeasured **50 MB other-table export allowance**. Failed exports, extra manual
exports and other project traffic consume additional allowance. No HTTP gzip,
immutable download caching or provider billing discount is assumed.

| Full selected-campaign downloads/session | Downloads/account/day | Mature checkpoint egress/month | +204-minute checkpoint egress/month | Against 5 GB |
| --- | ---: | ---: | ---: | --- |
| 1 | 2 | 1.796 GB | 2.001 GB | Fits estimate |
| 2 | 4 | 2.307 GB | 2.666 GB | Fits estimate |
| 3 | 6 | 2.818 GB | 3.332 GB | Fits estimate |

The continued case includes **0.700 GB** small RPC replies and **0.634 GB**
private exports before its 0.666 / 1.331 / 1.997 GB full loads. Only the selected
current campaign/prefix is downloaded, never both retained snapshots on normal
opens. Checkpoint uploads are **ingress**, excluded from every egress total.
The separate snapshot-only ingress estimate excludes new evidence/imports and
is labeled accordingly. Provider dashboard/billing and real transfer remain
manager checks, including growth beyond this short continuation.

### Backup and restore contract

The applied server provides no raw campaign-table service grants or private
Data API schema. Therefore the reviewed optional SQL adds two service-only
public-invoker/private-definer operational RPCs, plus one ungranted row helper.
It does not alter the applied migration or expose private tables. Export covers
all eight Beta 1 and eleven Beta 2 application tables. Native bigint fields
become decimal strings, blobs remain opaque hex, and per-account membership
locks give coherent account exports without a long-lived whole-project copy.
Beginning/end catalogs include current deletion metadata. Auth passwords,
identities/configuration/schema and an entire lost project are separate recovery
work; these are application-data exports, not an Auth backup.

The Node tool never prints keys, payloads, rosters or provider error bodies.
It uses the existing ignored `.local-dev/beta-admin.env`, writes checksummed
dated `.local-dev/beta-backups/` generations, serializes jobs, retains two
verified copies, removes incomplete/corrupt copies, and expires at 14 days even
before a failed network call. Weekly backup plus daily local prune tasks are
documented, **not installed or running**. Exports require a private encrypted
owner-PC volume; the tool does not pretend file modes supply Windows encryption.

Restore defaults to a server-checked **dry run**. Explicit apply confirms the
original project/account/campaign and permits only an **absent** campaign. It
never overwrites a present campaign, restores membership/consent/owner/setup
state, replays usage, restores old writer tokens, or replaces the live ledger.
Current Auth admission/ban/deletion, membership, cloud consent and the **live**
30-day deletion ledger are checked under normal lock order. Project write and
enrollment gates must be closed. Slots, complete current/prior sealed prefixes,
compressed hashes, declared processing sizes, quotas and transient headroom are
rechecked; apply reserves through the existing B2.2 accounting atomically.
The restored head is backup head +1, writer generation +1 with no active token;
prior content and accepted pages remain preserved. An ambiguous apply response
requires inspection, never an automatic retry/overwrite.

`verify-live --account ... --campaign ...` reads that account into memory and
passes both retained revisions through the **actual client adapter and codec**
while project gates remain closed. It acquires no writer and writes no file or
database data. This avoids the disabled ordinary-entry buttons during
maintenance. After accepted readback, restore only the recorded gate values,
then check the paused client UI before explicit Continue. Confirmed deletion
uses `forget-account` to remove matching private generations within the existing
seven-day administration target, followed by the existing Auth/invite cleanup.

### Validation and manager next action

Existing installed dependencies only. New script/formula/codec tests pass
**15/15, exit 0**:

```powershell
node --test --test-isolation=none --test-reporter=tap scripts/beta-backup/beta-backup.test.mjs tools/cloud-capacity/capacity.test.mjs
```

The requested plain `node --test scripts/beta-backup/beta-backup.test.mjs`
first failed before executing tests with sandbox **spawn EPERM**. The supported
no-isolation Node test mode above executes the same assertions without a child
process. Tests inject every fetch and env read; no real endpoint/key is used.
Coverage includes genuine sealed gzip/current-codec readback, rejection of
non-gzip/changed blobs, huge bigint revision strings, scope, no Beta 1 replay,
dry-run/explicit apply, live deletion refusal, ambiguity, exact 14-day expiry,
two-copy policy, corrupt/incomplete generations, forgotten accounts, path/link
checks, overlapping jobs, wrong project and secret/error redaction.

All **seven workspace typechecks pass, exit 0**:

```powershell
npm.cmd run typecheck
```

The exact required full player command ran with the already-approved narrow
Windows `net use` EPERM preload:

```powershell
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
```

Observed **2,462 passed / 12 timed out in eight files**, 251 passed files / eight
failed (259), duration 487.44 seconds, exit 1. Every failure is an existing test
timeout (5 / 30 / 60 / 180 seconds); no assertion failure was reported. The
machine also ran the capacity continuation and concurrent rebind work. All
571 captured existing player/admin/migration source paths remained byte-equal.
No test/timeout/assertion was changed. A serial rerun with only
`--maxWorkers=1` added reduces failures to **2,472 passed / two timed out**,
258 passed files / one failed (259), duration **716.19 seconds**, exit 1:

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1
```

Remaining failures are exactly `src/session/cloud/codecEvidence.test.ts`:
"measures six further hours of real mature-facility commands without discarding
immutable rows" (180,000 ms) and "hashes the entire encoded request, rejects
identity/row corruption, and verifies uncompressed canonical bytes" (5,000 ms).
Both are timeouts, not failed equality/invariant assertions. Shared CPU
contention is a plausible cause, not independently proven. The manager must
rerun this unchanged file/full suite after the concurrent workload settles;
the regression gate is **not green**. PowerShell's `RemoteException` separators
wrap these same Vitest/npm errors and do not indicate extra test failures.

Exact final summaries:

```text
New Node tests: tests 15 / pass 15 / fail 0; exit 0
Typecheck:     all seven workspaces passed; exit 0
Player:        8 failed | 251 passed files (259)
               12 timed out | 2462 passed tests (2474); exit 1
Player serial: 1 failed | 258 passed files (259)
               2 timed out | 2472 passed tests (2474); exit 1
E2E discovery: 16 tests in one file; exit 0 (not execution)
```

Source-only SQL checks cover balanced lexical delimiters, five fixed-path
helper/wrapper definitions with service-only RPC entry points, no raw table grants, dry-run/deletion/
reservation guards, rollback-only single PASS result and a read-only monitor.
These are **not a PostgreSQL parse or SQL PASS**. No browser was launched.
Playwright **discovery only** exits 0 and lists **16** cases for the new file
across desktop-chrome/phone-chrome (eight scenarios, each also exercises an
explicit desktop or phone context). The manager runs actual browser checks:

```powershell
$env:GAMIFY_E2E_EXTERNAL_SERVER = '1'
$env:GAMIFY_E2E_BASE_URL = 'http://127.0.0.1:5184'
node node_modules/@playwright/test/cli.js test tests/e2e/cloud-recovery.spec.ts --project=desktop-chrome --project=phone-chrome
```

Final source audit passes: **13 owned paths**, UTF-8 without BOM, LF-only and
final newlines; scoped credential-pattern scan; **571** protected existing
player/admin/migration paths byte-unchanged; the prior plan is an exact byte
prefix (append-only); report fixture receipt matches the current shared fixture.
Logs/baselines and the scoped manifest are ignored under
`.local-dev/beta2-b25/`: `node-tests-final.log`, `player-final.log`,
`player-serial.log`, `typecheck-final.log`, `source-checks.log`,
`baseline.json`, `owned-files.json` and `final-manifest.json`.
Manager next: inspect actual owned files; run/apply the
new operational helpers and complete rollback rehearsal in the approved live
SQL Editor; measure actual physical capacity/cleanup/egress; perform an
authorized synthetic backup/dry-run/apply/live-codec-readback/paused-client drill;
run the new browser scenarios and required regression after concurrent work
settles. Full-day/extended growth and hosted ingress remain unproven. Accept
those gates before enabling a cohort; no Free-plan rollout PASS is claimed.

The owner pathway stays `START_GAME.cmd` -> exact `http://127.0.0.1:4173` in
the usual persistent profile (`location.origin = http://127.0.0.1:4173`); remote
stays `https://melissarowlandc-afk.github.io/GamifySurgery/` with separate local
storage. Only manager tests use disposable `http://127.0.0.1:5184` and fake QA
bindings. This worker did not start/change a server or opening path.

**LOCAL ONLY:** the manager owns final acceptance, the current-thread handoff,
the audited checkpoint and **"push to GitHub"** reminder, SQL application,
capability/region enablement and publication. No GitHub backup or live private
backup exists merely from this delivery.

### Manager acceptance of B2.5 and live helper application (2026-10-17)

Reviewed scripts/beta-backup/install-backup-rpcs.sql (service_role-only export/restore, JWT role guard, revoke-all + service_role execute; dry-run default). Filed it as supabase/migrations/20261018000200_beta2_backup_rpcs.sql and applied it live from a SHA-verified copy. The rollback test exposed a real PL/pgSQL ambiguity in beta2_backup_restore (`u.id = id`, where `id` is a declared variable; function-name qualification is not valid for DECLARE variables). The manager changed the comparison to the locked membership row (`u.id = m.user_id`) in both copies and reapplied (final SHA-256 prefix 9e2f4f214313fcf0). scripts/beta-backup/backup-restore.test.sql then reported "PASS: B2.5 backup/restore dry-run, opaque bytes, bigint, scope, deletion, admission, gates, capacity". The capacity monitor runs (12 rows; beta2 storage is empty before enablement). Capacity model: about 113.7 MB with reserves; egress 1.8-3.3 GB/month against 5 GB.


## B2.6 prerequisites handoff (2026-10-17)

Worker: GPT-6.1 Sol, cohort enablement safety and owner-tool lane. Delivered
locally for manager review; live cohort enablement, SQL application, publication
and the physical-device trial remain manager gates. Read all prior handoffs,
manager acceptances and B2.2 live application. The applied migrations and all
clinical/game-domain content, fixtures, approval states, concept IDs, FSRS
meaning, original save keys and launchers were not edited.

### Implementation and owned files

- `apps/player/src/session/cloud/CloudAccount.tsx`: the build flag permits an
  initial access check, not entry into cloud mode. Pending, disabled and failed
  initial checks expose a null cloud context, preserving the existing Beta 1
  router, account menu, notice, local session and storage namespace. No cloud
  source inspection, campaign-list fetch, enrollment, sign-out guard, timer,
  automatic retry or focus check is installed for those accounts. StrictMode
  replay shares one access promise. An affirmative enabled account alone exposes
  cloud entry. Later failures in an already admitted cloud session retain the
  existing error/recovery controls and bytes; they do not reopen a local branch.
- `auth/AuthGate.tsx`: retain the exact Beta 1 sign-in copy regardless of the
  build flag. An unauthenticated screen cannot know cohort membership.
- `session/cloud/transport.ts`, `supabaseTransport.ts`, `coordinator.ts`
  and `ui/CloudCampaignEntry.tsx`: separate per-account `enabled` from
  project `writesEnabled`. Closing writes keeps an enabled owner in cloud
  entry with play/import/create unavailable; it does not turn a cloud campaign
  into local play. Coordinator admission also checks the write switch.
- `qa/cloudSavesQa.tsx`: dev-only QA tools tolerate the intentional null
  context while the initial check is unresolved. No hosted route was added.
- Tests: new `apps/player/src/App.cloudAccess.test.tsx` runs the actual router,
  local session and both real shells (only map drawing is replaced). Compares
  entry text/controls, complete saved profiles, local Save & Close and keys to
  the flag-OFF path for disabled and failed checks; preserves another account,
  unowned prototype and legacy bytes; verifies one access RPC, zero cloud-store
  methods, no new fetch and no cloud sign-out guard. Also covers an access reply
  arriving after local Resume, StrictMode, enabled notice entry and write-off
  owner entry. Existing `CloudAccount.test.tsx` fixture now waits for admission;
  `auth/AuthGate.test.tsx` and `supabaseTransport.test.ts` add sign-in parity
  and independent cohort/write-switch assertions. No existing assertion was
  removed or softened. App.tsx and both shell sources remain byte-unchanged.
- `scripts/beta-invites/beta-invites.mjs`, new `beta-cloud.mjs` and
  `beta-cloud.test.mjs`: CLI and double-click prompts support `cloud status`,
  `cloud enable <email>`, `cloud disable <email>`, `cloud writes on|off`
  and `cloud enrollments on|off`. Reuse the existing ignored admin-env/key
  path, SDK client and output/error redaction. Emails resolve through the existing
  membership RPC; cloud operations use only `beta2_admin_cloud`. No Auth
  account, invitation, notice or campaign is created. Validate responses before
  printing success; never dump provider objects/errors. Each global toggle
  preserves the inspected opposite value under the existing two-field configure
  contract; owner commands must run sequentially, then verify status.
- `scripts/beta-invites/README.md`: commands, private configuration, SQL
  prerequisite, staged owner-only setup, build/region semantics and save origins.
- `.github/workflows/deploy-pages.yml`: Pages build now reads public GitHub
  repository VARIABLES `vars.VITE_CLOUD_SAVES_ENABLED` (default `false`)
  and `vars.VITE_CLOUD_SAVES_REGION` (default empty). Existing hosted-auth
  configuration is retained. Nothing is enabled or deployed by this worker.

### Necessary forward SQL prerequisite

The applied `beta2_admin_cloud('inspect')` returns only an account COUNT;
there is no read-only per-account status action and service_role has no raw-table
SELECT grant. Therefore `cloud status` cannot truthfully list enabled accounts
using the deployed contract alone. New
`scripts/beta-invites/install-cloud-status-rpc.sql` replaces ONLY that existing
private function, adding an ordered `accountSettings:[{userId,enabled}]` result.
All existing account/configure/cleanup statements, JWT-role guard, fixed empty
search path, signature and wrapper are retained; service-only execution is
reasserted. A Node source-contract test removes the added expression and proves
the remaining function is byte-equal to the applied migration's body. No applied
migration was edited, and no SQL was executed. This prepared forward update can
be filed as a migration by the manager using its normal tooling.

The manager must review/apply that SQL, then run the entire
`scripts/beta-invites/cloud-status.test.sql` as postgres. It compares the exact
stored enabled list/switches, retains the original configure pair and checks
service-only ACL/JWT boundaries inside ROLLBACK, without enabling real accounts.
Capture its actual PASS and rerun the existing Beta 2 SQL suite. This is a
prepared rehearsal, not a PostgreSQL parse, SQL PASS or live status claim.
Missing/malformed accountSettings produces an explicit CLI failure; it never
prints an invented empty cohort. No installed Supabase CLI was available and the
brief forbids network/install; existing local SQL is the contract used here.

### Build region and owner trial checklist

`VITE_CLOUD_SAVES_REGION` expects a nonempty, trimmed human-readable string
identifying the VERIFIED hosting region of this Supabase project, preferably the
dashboard display name plus region identifier. It is shown verbatim in
`CloudNoticeDetails`; it is not a credential, URL or enforced region enum.
Copy the actual dashboard value, never a guessed/example region. Empty blocks
new cloud-notice acceptance. Set it and the exact enable value `true` as
GitHub repository VARIABLES, then build/publish through the manager's authorized
release path. Build variables alone do not enable any account. This worker did
not inspect a populated env, change GitHub variables or select the actual region.

Short owner trial, after manager acceptance of code, release, backup and capacity
checks:

1. Apply/test the status RPC update; run `cloud status`. Enable only the
   owner's invited email, turn writes/enrollments on and verify status again:
   exactly the owner is `yes`. A non-enabled account must still see the usual
   Beta 1 local entry on desktop and phone, including when the access RPC fails.
2. **Desktop:** open exact
   `https://melissarowlandc-afk.github.io/GamifySurgery/` in the intended
   persistent profile, sign in as the owner and verify the published service
   region before accepting the cloud notice. Create a small synthetic account
   clinic, or explicitly choose one local source to copy. Keep its original bytes.
   Sign-in alone must upload nothing. Record campaign name, progress, cash and
   learning/answer history; play and wait for confirmed Saved to account.
3. **Phone:** use the same exact Pages URL and account in its normal browser.
   Open the matching campaign and verify desktop's confirmed progress. Leave the
   desktop tab open; choose Continue on this device explicitly if takeover is
   offered. Opening alone must not take the writer. Play once and confirm the
   desktop cannot overwrite/release the phone writer or claim its old cache is
   saved. Phone Save & Close must confirm before leaving it.
4. **Desktop again:** focus the old tab, verify pause/fresh-check behavior and
   continue from the phone's last confirmed state. Compare campaign identity,
   cash, purchases, frozen choice order and learning history; verify no duplicate
   answer, FSRS review or usage count. No hidden-time catch-up is expected.
5. Repeat once with the desktop hidden and the phone briefly suspended. Check
   touch/keyboard dialogs and honest pending/error state after a brief outage;
   no Safe to close until a confirmed save and fenced release. Preserve recovery
   if a failure occurs; do not replace it with a fresh campaign.
6. Recheck `cloud status`; exercise enrollments off (new imports/creation
   blocked, existing saves available) and writes off (enabled owner paused).
   Restore only the manager's intended switch values and record results. Keep
   every other account disabled until the owner handoff is accepted. Do not use
   per-account disable to erase or migrate a cloud campaign.

Local owner opening remains `START_GAME.cmd` -> exact
`http://127.0.0.1:4173` in the usual persistent profile
(`location.origin = http://127.0.0.1:4173`). The trial uses Pages on both
devices (`location.origin = https://melissarowlandc-afk.github.io`). Each
origin/profile/account retains separate local saves; setup/sign-in does not move
4173 campaigns to Pages. Only explicit copying can enroll a source available at
that origin. No server, launcher, browser storage or opening pathway was changed.

### Validation and manager next action

**Final local validation passes.** Required full player command finishes with
**260 passed files / 2,488 passed tests, zero failures, exit 0**, duration
**114.64 seconds**. Final focused cohort/auth/transport checks pass **79/79 in
four files**, duration **9.94 seconds**, exit 0. All **seven workspace
typechecks pass, exit 0**. Owner-tool tests pass **135/135 in seven suites**,
including **42 new cloud tests**, exit 0 (mocked fetch/env only).

Exact successful command contract from repository root:

```powershell
# Existing approved narrow Vite Windows network-drive-probe preload only.
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/App.cloudAccess.test.tsx src/session/cloud/CloudAccount.test.tsx src/session/cloud/supabaseTransport.test.ts src/auth/AuthGate.test.tsx
node --test --test-isolation=none --test-reporter=tap scripts/beta-invites/*.test.mjs
npm.cmd run typecheck
```

The requested plain `node --test scripts/beta-invites/*.test.mjs` was attempted
first and failed before running assertions with sandbox **spawn EPERM**, exit 1.
The supported in-process `--test-isolation=none` mode runs all the same tests;
no test, fetch handler or assertion is skipped. The command-line `--help` was
also run successfully and lists every new cloud action without loading keys.

Exact final summaries (retained raw logs, no inferred PASS):

```text
Full player: Test Files 260 passed (260)
             Tests      2488 passed (2488)
             Duration   114.64s; exit 0
Focused:     Test Files 4 passed (4)
             Tests      79 passed (79)
             Duration   9.94s; exit 0
Owner tool:  tests 135 / suites 7 / pass 135 / fail 0 / skipped 0
             duration_ms 595.447; exit 0
Typecheck:   all seven workspace typechecks passed; exit 0
```

Earlier full runs during concurrent heavy Node work are retained for audit:
normal four-worker default **2,477 passed / 11 timed out in seven files**, exit 1,
**475.45 s**; a full `--maxWorkers=1` rerun **2,482 passed / six timed out in
four files**, exit 1, **915.93 s**. Every failure was Test timed out, not an
assertion failure. The six serial failures were the unchanged evidence-codec
360-minute growth (180 s) and complete-request/hash case (5 s), Level 4 specialty
projection (30 s), gift routes at 1x and 4x (5 s each), and Level 3 three-nurse
view (5 s). The default run also timed out the backless-stool pixel case,
peri-op companion footprints, both Level 5 report QA cases and the Level 2
nurse view. These seven test sources and their underlying unowned player
sources stayed byte-equal to the captured baseline. Heavy processes observed
during those runs had ended before the final run. **No source, timeout,
assertion or fixture was changed between the failing and final passing full
runs.** This is consistent with host contention; its exact contribution was not
independently profiled. The final required full-suite gate is green.

Scoped audit: **19 owned paths**, all UTF-8 without BOM, LF-only, with final
newlines and a clean scoped credential-pattern scan. **561 protected existing
player/admin/migration/workflow paths remain byte-unchanged** out of 573 captured
baseline paths; the twelve changed existing paths are the assigned files listed
above. The prior ExecPlan is an exact byte prefix, including all manager
acceptances. README links resolve. SQL transaction/delimiter/one-PASS source
checks pass; these do not substitute for SQL execution. Validated source hashes
stayed unchanged throughout the final runs.

Actual before/after diff and source copies, owned-path manifest, final SHA-256
manifest, raw validation logs and checks are in ignored
`.local-dev/beta2-b26-prerequisites/`: `baseline/`, `baseline.json`,
`changes.patch`, `owned-files.json`, `final-manifest.json`,
`source-checks.log`, `player-final.log`, `player-focused-final.log`,
`player-full.log`, `player-serial.log`, `node-exact.log`,
`node-final.log` and `typecheck-final.log`.

Manager next: inspect the actual scoped diff/new files and logs; file/review and
apply the prepared forward status-RPC SQL, run its rollback check plus existing
Beta 2 SQL regression, confirm the real project region and repository variables,
verify status has only the owner enabled, then perform the owner trial above
through the approved publication/enablement path. Unit/mocked-fetch results do
not establish live SQL/Data API or physical-phone acceptance. The worker did
not run a Pages build, start a server or access a browser, real credentials,
owner storage, GitHub or Supabase.

**LOCAL ONLY:** no Git, installs, network, agents, external messages, commits,
push, deployment, publication, server/GitHub setting changes or clinical-content
changes occurred. The manager retains acceptance, CURRENT_THREAD_HANDOFF.md,
the audited GitHub checkpoint and **"push to GitHub"** reminder, SQL application,
cohort enablement and release. This bounded prerequisites implementation is
complete for manager handoff; live application and the owner trial are next.

### Manager regression comparison (2026-10-17)

Full Playwright suite, retries 0, default config: published release b3b24bd6/1865337f tree 299 failed / 267 passed / 458 skipped / 112 did not run; B2.4 live tree 301 failed / 285 passed (the extra 18 passes are the new cloud specs). Failure sets differ by four tests in B2.4 and two in the release. All four B2.4-only failures pass on targeted rerun (approved-room-interactions:123 2/2 on both trees, room-capacity-sales:221, founder-activity-chart-endoscopy:427, cloud-saves:138 x3 on laptop), so they are flaky, not regressions. **B2.4 introduces no e2e regression.** Separate finding: about 300 legacy e2e tests are stale relative to Levels 4-5/mobile (pre-existing on the published release). Queued as a post-Beta-2 e2e-suite repair milestone.

## B2.6 revision 1

Manager QA found a B2.6 regression: the pending access gate mounted
`AuthenticatedPrototype`, whose profile loader can write an empty account-local
profile before an enabled account enters cloud mode. This section supersedes
the prerequisites handoff's statement that pending access uses the Beta 1 entry.
The first access decision must finish before either campaign path mounts.

Changes in this revision (shared tree, Sol worker; six owned paths):

- `apps/player/src/session/cloud/CloudAccount.tsx`: initial pending access now
  renders the existing sign-in loading style and "Checking your sign-in…" text,
  with no children, local session, cloud entry or campaign-storage writes.
  Initial disabled/failed checks select the exact Beta 1 path; initial enabled
  checks select cloud entry. The single StrictMode-safe access request remains.
  Cloud admission is retained for this account mount: a later disabled response
  preserves the cloud controls, verified summaries/slots and sign-out durability
  guard rather than mounting a local campaign. Later failures retain the cloud
  error/recovery path. Re-entry after sign-in/reload performs a new cohort check.
- `apps/player/src/App.cloudAccess.test.tsx`: retains the desktop/phone exact
  Beta 1 entry/session/save/key comparisons for initial disabled and network
  failure outcomes. Pending assertions now require neutral loading and no storage
  activity. Resume coverage begins after the local decision. Four new cases
  cover fresh desktop/phone accounts, before and after notice acceptance:
  pending and enabled entry make zero localStorage set/remove calls, create no
  account-local profile, preserve all other bytes and perform only expected RPCs.
- `apps/player/src/session/cloud/CloudAccount.test.tsx`: two new cases retain
  admitted cloud context, both campaign slots (including an archive), summaries
  and the sign-out guard after a later disabled or failed check. Neither case
  makes a follow-up list request while unavailable.
- `scripts/beta-invites/README.md`: corrects pending behavior and documents
  preservation of cloud recovery controls after a later disabled response.
- `tests/e2e/cloud-recovery.spec.ts`: repairs only the `details` helper's race.
  It rechecks the visible modal if automatic opening blocks a status-button
  click (one-second click attempt within the existing five-second assertion
  budget). All recovery/content/state/server assertions remain intact; product
  dialog behavior is unchanged. No forced clicks, skipped cases or longer test
  timeouts were added.
- This plan: appended this revision; all prior handoffs and the manager's
  regression comparison are preserved verbatim.

The full supplied `.local-dev/qa-probe/cloud-e2e-b26-failures.txt` was reviewed:
four fresh-phone profile-write failures, four two-slot/disabled-service failures
and twelve recovery timeouts. The first two groups match the gating defects
above. Recovery logs show the auto-opened modal intercepting the status click;
the two reports masked by `browserContext.close` were checked in their local
traces and show the same interception. The helper previously tested visibility
once, then waited behind that modal until the entire test expired. These are
distinct from campaign persistence failures. Browser confirmation is still due.

Validation from the repository root, all final commands **exit 0**:

```powershell
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/App.cloudAccess.test.tsx src/session/cloud/CloudAccount.test.tsx src/session/cloud/supabaseTransport.test.ts src/auth/AuthGate.test.tsx
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
```

Observed results: focused **4 files / 85 tests passed**, **4.05 s**; full player
**260 files / 2,494 tests passed**, **107.37 s**, zero failures; all **seven
workspace typechecks passed**. Before the production fix, the revised account
tests reproduced the regression: **13 failed / 10 passed in two files**, exit 1
(pending Beta 1 mounting and loss of admitted context on disable). Final source
hashes stayed fixed through successful validation. The existing narrow Vite
Windows `net use` EPERM preload was reused; no dependencies or test timeouts
were changed.

Evidence is retained in ignored `.local-dev/beta2-b26-revision1/`: original
six-file `baseline/`, 686-path `baseline.json`, `owned-files.json`, actual
`changes.patch`, `validated-source.json`, `final-manifest.json`,
`source-checks.log`, `player-red.log`, `player-focused.log`, `player-full.log`
and `typecheck.log`. The final audit confirms UTF-8 without BOM, LF-only files
with final newlines and no unowned changes among captured source/config paths.

Manager next: inspect the actual revision diff and logs, then rerun
`tests/e2e/cloud-saves.spec.ts` and `tests/e2e/cloud-recovery.spec.ts` against a
fresh disposable QA server. **No Playwright PASS is claimed by this worker.**
The earlier owner tooling, workflow variables, SQL prerequisite and owner trial
remain as handed off; no real cohort or global switch was changed. No Git,
installs, network, agents, server start/restart, deployment, owner storage or
clinical-content changes occurred. Existing owner opening pathways remain
unchanged. Manager retains acceptance, CURRENT_THREAD_HANDOFF.md and the GitHub
checkpoint/reminder.

## B2.6 owner-only enablement published (2026-10-18)

Owner approved setting GitHub repository variables and publishing. Set VITE_CLOUD_SAVES_ENABLED=true and VITE_CLOUD_SAVES_REGION="Canada (Central) · ca-central-1" (region from the owner's dashboard General settings screenshot). Server cohort: writes on, enrollments on, only the owner account enabled (`cloud status`). Published 7acf23e4 (Beta 2) + 05017add (CI-only 10x deadlines for the four new long cloud/evidence tests; the first run timed out at 180 s on hosted CI). Release-copy validation: npm test exit 0 (player 2494, game-domain 4296, clinical 698, others green); cloud-saves + cloud-recovery e2e 52/52 after the B2.6 revision-1 gating fix. Pages run 39168570540 succeeded. Next: owner desktop -> phone -> desktop trial.

## Owner trial feedback (2026-10-25)

Owner signed in on desktop Chrome (live Pages). She expected the campaign from her phone app to appear; it did not, because cloud enrollment is opt-in per device: the phone campaign was never copied to the account. She found the entry page confusing (screenshot: "Clinic campaigns" with "Refresh account campaigns", "Inspect unowned legacy campaigns on this site", "exact original bytes", "Use this device only", "Use account campaigns"). Manager direction: redesign the cloud entry into a plain, minimal "Your clinics" page (B2.4 follow-up), and make the phone-to-account path obvious.

## Owner decision (2026-10-25): automatic account campaigns

Owner: "assume that any campaign that someone is playing they may want to play on a different device rather than having the user select it. Like after they sign in the options should just be resume previous campaign (#/2) or start new campaign. And the previous campaign options should be the same on any device. Maybe just have a warning that they can only have two active campaigns on their account at a time so if they choose to make a new one when they are 2/2 then a warning pops up that says if they start a new campaign one of their old ones must be deleted and then they are given the choice of which (if any) they want to overwrite."

This supersedes the opt-in import design (owner decision 1 is kept: 2 campaigns per account). Binding UX:
- After sign-in, every device shows the same two choices: "Resume a previous campaign (N/2)" (account campaigns, identical on all devices) or "Start a new campaign".
- Every campaign is an account campaign; no "this device only" mode and no per-campaign save choice.
- On first cloud sign-in on a device, existing local campaigns for that account are enrolled automatically, up to the free slots; original local bytes are kept, never deleted. Only if a device has more campaigns than free slots is the player asked once which to keep in the account (the rest stay retained locally, hidden).
- At 2/2, "Start a new campaign" shows a warning that one existing campaign must be replaced (deleted from the account); the player chooses which, or cancels; a second confirmation precedes the irreversible deletion.
- Takeover/fencing, Save & Close and the Beta 1 fallback for non-enabled accounts are unchanged.

## Owner feedback (2026-10-25): freezing and status text

Owner: a top status reads "Saved on this device; account save waiting" and "Preparing recovery on this device..."; "This needs to go away and the game can't be pausing and freezing every time it pushes to save. Probably only save upon closing the app or going off the page if that's possible."

Manager decision (owner intent, feasible form): unload-only saving is unreliable (mobile browsers suspend or kill background tabs; keepalive request bodies are limited to about 64 KB, below the compressed snapshot size), so:
- Move snapshot serialization, compression and hashing off the main thread (Web Worker); routine checkpoints must never pause the game or block a frame noticeably.
- Cloud checkpoint triggers: page hidden (visibilitychange -> hidden), pagehide/close (best effort), Save & Close (explicit; may pause), and a quiet background interval of 5 minutes while dirty. Remove the per-scored-answer/purchase early checkpoints and the 60 s cadence. The local device save stays immediate as today.
- The status indicator is hidden during normal operation; show it only for actionable problems (offline or failed account save, takeover, capacity), in plain language.
- Lease renewal stays lightweight (no snapshot); keep fencing semantics.

## Entry redesign handoff

2026-10-25, bounded Sol worker. Implemented the manager's assigned **explicit
per-clinic saving** brief and reviewed the actual scoped diff. This is local
work for manager review, not an accepted or published owner design.

**Concurrent direction change:** the "Owner decision (2026-10-25): automatic
account campaigns" and freezing/status sections were appended while this
worker was running. Automatic enrollment, removal of device-only play, and
replacement/deletion at 2/2 conflict with this worker's binding brief. Those
new sections are preserved. This milestone does not implement or authorize
those new systems. The manager must reconcile the superseding owner direction
before integrating/publishing this explicit-save UI; no automatic enrollment,
campaign deletion or save-scheduling changes were made here.

Implementation and owned files:

- `apps/player/src/ui/CloudCampaignEntry.tsx`: "Your clinics"; vertically ordered
  account/device sections; one named Continue or Save to my account action per
  clinic; verified level and saved/played time; device section only when local
  sources exist; explicit saving of exactly the selected row; originals retained;
  new account clinic and device-only entry actions; two-clinic capacity reasons.
  Refresh on entry and focus replaces the manual refresh button. Successful level
  reads are reused by campaign/revision for this entry lifetime; unavailable
  levels leave Continue available for the existing recovery flow. Invalid older
  timestamps show "Time unavailable" instead of breaking entry.
- `apps/player/src/ui/CloudCampaignEntry.test.tsx`: both presentation layouts,
  empty device section, explicit one-clinic save, original preservation,
  two-clinic/archive limit, level display without writer acquisition, unavailable
  level, refresh/listener lifetime, terminal deletion, collapsed privacy,
  unpublished region, older-source ownership confirmation, identical-operation
  retry after an unconfirmed import, and invalid older timestamps.
- `apps/player/src/ui/AccountMenu.tsx`: optional children place entry-specific
  storage limits, notice acceptance and "Show older campaigns from before you
  signed in" inside the existing collapsed bottom Account & privacy control.
  Existing region/notice, deletion, export and clear-device controls stay there.
  Older-source discovery still requires a separate per-clinic ownership
  confirmation before saving it to the signed-in account.
- `apps/player/src/ui/cloudSaves.css`: shared entry styles, horizontal desktop
  clinic rows, stacked phone rows and full-width phone buttons. Small secondary
  device-only action. No shell gameplay styling changes.
- `apps/player/src/ui/cloudEntryError.ts`: plain-language entry failure messages;
  byte, recovery and protocol details are absent from the main entry view.
- `apps/player/src/App.tsx`: minimal shared router wiring for the new entry
  actions and plain-language entry notices. New clinic creation still enters
  founder setup then creates an account campaign through the existing verified
  import path. Continue still uses the existing read-only open and explicit
  continuation/takeover confirmation. Save & Close is unchanged in both shells.
- `apps/player/src/App.cloudAccess.test.tsx`: entry labels and exact expected
  access/list requests reflect automatic entry refresh; all cohort gating,
  no-upload, no-fresh-profile and Beta 1 fallback assertions remain.
- `tests/e2e/cloud-saves.spec.ts` and `tests/e2e/cloud-recovery.spec.ts`: new entry
  names, explicit privacy opening for notice acceptance, per-row Save/Continue,
  and a focus event instead of Refresh. All **47 + 45 behavioral assertions**
  are retained, including complete cross-device state, takeover/fencing,
  immutable retry, offline blocking, deletion isolation, archive capacity,
  originals, rejected saves, download recovery and corrupt-current/prior reads.

Validation:

- Initial focused command without the existing preload hit Vite's known Windows
  `net use` probe `spawn EPERM` before tests ran. No config/dependency change was
  needed. Subsequent test commands use the existing narrowly scoped preload:
  `$env:NODE_OPTIONS = '--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'`.
- Focused entry/router: `npm.cmd run test --workspace @gamify-surgery/player --
  --pool=threads src/ui/CloudCampaignEntry.test.tsx src/App.cloudAccess.test.tsx`
  passed **2 files / 32 tests**, exit 0, before the final timestamp regression.
- Full player: `npm.cmd run test --workspace @gamify-surgery/player --
  --pool=threads` initially passed **261 files / 2,522 tests**, exit 0. Final
  rerun after the timestamp fallback/regression passed **261 files / 2,523
  tests**, exit 0, duration 149.26 seconds. Raw final summary:
  `Test Files 261 passed (261)`; `Tests 2523 passed (2523)`.
- `npm.cmd run typecheck`: **all seven workspaces PASS**, exit 0, including a
  rerun after the final timestamp change.
- Source audit: the nine scoped code/test files are UTF-8 without BOM, LF only.
  Both e2e assertion counts were checked against captured baselines. No
  assertions were removed or skipped. Manager owns Playwright and screenshots;
  **no browser or visual PASS is claimed** by this worker.

Review evidence: ignored `.local-dev/entry-redesign-20261025/` contains the
nine-file `baseline/`, `owned-files.json`, actual `review.diff`, final full
player log, typecheck log and `validated-source.json` SHA-256 manifest. Final
audit confirms all nine code/test files and both appended handoff documents
are UTF-8 without BOM, LF only, with final newlines. The manager should inspect
that diff and rerun
both cloud e2e specs against a disposable QA origin, including desktop/phone
screenshots and the older-clinic discovery/confirmation path.

No balance-config/game-domain files, balance goldens, clinical content, sources,
dependencies, credentials, server switches, launchers, owner browser saves or
served builds were edited. No Git, installs, network, agents, external messages,
server starts, deployment or publication. **LOCAL ONLY**: manager owns design
reconciliation, acceptance and the audited **"push to GitHub"** checkpoint/reminder.
Opening pathways remain `START_GAME.cmd` -> exact `http://127.0.0.1:4173` in the
intended persistent profile and
`https://melissarowlandc-afk.github.io/GamifySurgery/`; their origins/profiles
retain separate local saves. This worker did not open or substitute either path.


## Save performance handoff

2026-10-25, bounded Sol worker for the Claude Code manager. Implemented the
freezing/status decision above in the assigned save lane. **Ready for manager
review; final shared-tree validation is blocked by concurrent entry-lane work.**
No entry redesign or balance/domain implementation was changed by this worker.

### Implementation and ownership

- New `apps/player/src/session/cloud/codec.worker.ts`, `codecWorker.ts` and
  `codecTasks.ts`: a lazy Vite module worker using
  `new Worker(new URL("./codec.worker.ts", import.meta.url), { type: "module" })`.
  Snapshot serialization/canonicalization, gzip, SHA-256, evidence validation,
  frozen request serialization/hash, sealed evidence-page packing and transport
  hashes run there. The worker returns only the compressed candidate suffix,
  never a second hydrated game/full archive. Request IDs match replies; typed
  cache/sync/codec errors survive the boundary. Worker crashes reject pending
  work and allow a fresh worker on retry. The inline fallback is restricted to
  non-browser tests (or explicitly injected test use); unsupported browser
  workers fail visibly instead of silently encoding on the main thread.
- New `codecCache.ts` and `codecWire.ts` extract the existing pure local-cache
  and transport encoding algorithms. `cache.ts` offloads local serialization,
  checksums and read verification while retaining IndexedDB transactions,
  compare-and-swap, Web Locks and exact stored-text/readback checks.
  `supabaseTransport.ts` offloads commit/import wire pages and the final wire
  hash recheck. No server contract, snapshot format or saved bytes were migrated.
- `coordinator.ts`: routine staging/verification no longer closes the command
  gate. Actual storage, auth, capacity, fencing and lease failures retain their
  existing safety gates. Fencing, expected revisions, frozen operation IDs and
  bytes, committed-operation lookup, one in-flight/one following queue and
  suffix/usage rebasing remain. Successful acknowledgment gives any following
  work a fresh five-minute dirty window; otherwise continuous play could cause
  a new upload on every pulse. Small revision/evidence-base getters avoid
  cloning all confirmed data just to compare revisions.
- `gameSession.ts`: worker encoding leaves commands and facility ticks enabled.
  Immutable checkpoints are structured-cloned once when sent; new commands
  coalesce into the following candidate. Question receipts are captured with
  their matching snapshot and filtered against acknowledgments. Save & Close
  pauses immediately, before waiting for an outstanding encode, then awaits
  local durability, confirmation and fenced release. Recovery export includes
  the latest in-memory checkpoint and pending frozen recovery if encoding has
  not finished. Local saving is still scheduled immediately on dirty commands;
  it is not deferred to the cloud upload interval.
- `transport.ts`: dirty cadence is five minutes. Removed answer/purchase/pause/
  mode-exit urgency and Build Undo's automatic upload. Legacy reason labels
  remain accepted by explicit callers/QA, but never schedule an early upload.
- Minimal necessary lifecycle edits in
  `apps/player/src/session/usePrototypeSession.ts`: hidden visibility and
  pagehide request best-effort checkpoints without pausing cloud gameplay;
  removed the two mode-exit early-checkpoint calls. The local/Beta 1 path is
  unchanged. Existing focus/freshness revalidation and failure fencing still
  require explicit Resume; saving itself no longer adds a pause.
- `CloudSaveControls.tsx` and its tests: healthy/encoding/pending/saving/checked/
  closed states have no status indicator. Only failures, connectivity,
  takeover/revocation, capacity, auth and recovery problems show plain-language
  status. Initial continuation and a checked session needing Resume use action
  buttons, not healthy-save status text. Save & Close remains available.
  `AppShell.tsx` and `mobile/MobileShell.tsx` each have just one nullable-message
  fallback edit for the existing pause-lock explanation.
- New `codecWorker.test.ts` and `codecWorkerTestSupport.ts`, plus coordinator and
  game-session tests: fake worker offload/no caller serialization; compact
  result; reply matching; typed errors/crashes; browser fallback refusal;
  exact five-minute dirty policy, clean renewal, following-window reset;
  corrupt-candidate hard stop; live commands/ticks during encoding and upload;
  receipt/snapshot matching; current recovery export; hidden/pagehide triggers;
  and immediate Save & Close pause while encoding is held.
- Both cloud e2e specs: status assertions only. Each asserts the healthy status
  button is absent. The retry scenario opens the new Resume clinic action
  instead of a healthy status button. Existing behavioral assertions remain.
  Concurrent entry-label/wiring changes belong to the entry worker.

**21 owned source/test paths** are enumerated in the evidence manifest. The
four tiny lifecycle hunks above are the necessary addition outside the main
cloud/controls lane. Entry components, App entry wiring, AccountMenu/CSS,
CloudAccount, entryStorage, fakeTransport and importCampaigns received concurrent
edits and are excluded from this worker's manifest/diff. They were preserved.

### Before/after profile

Offline Node **v24.19.0**, same machine, three warm samples per implementation;
1 ms timer heartbeat plus `performance.eventLoopUtilization`. This measures the
save codec/verification/cache pipeline on the calling JS thread and the real
module-worker implementation in a Node worker adapter. It is **not a browser
frame-rate or physical-phone acceptance claim**. No browser, server, owner save
or real endpoint was accessed.

Fixture: existing synthetic
`tests/fixtures/level-five-economy-checkpoint-20261012.json`, SHA-256
`813572d7ecaa6ffb232b7bed92c72a14067f96927f42219750c1343b111d6582`,
plus Resume and 30 real evidence-wrapped facility ticks. Hydrated game:
**1,419,998 UTF-8 bytes**; checkpoint input: **1,925,339 bytes**; **2,414**
evidence records, **78** new rows sealed into **3** pages; wire **44,979 bytes**.
No synthetic clinical prose or owner data was authored for the measurement.

| Measurement (median ms) | Before, caller thread | After, worker path |
| --- | ---: | ---: |
| Main-thread active time for measured pipeline | 1,013.48 | 20.31 |
| Longest heartbeat gap per sample | 243.19 | 17.30 |
| Standalone main-thread state serializer call | 3.35 | 0 (worker owns serialization) |
| Encode/canonicalize/compress/hash, elapsed | 588.65 | 841.04 (worker) |
| Evidence pages + wire compression/hash, elapsed | 18.89 | 24.13 (worker) |
| Verify/decompress/rehydrate/hash, elapsed | 398.21 | 596.17 (worker) |
| Cache serialization/hash/read verification, elapsed | 13.34 | 20.67 (worker) |
| Whole measured pipeline, elapsed | 1,035.76 | 1,493.87 |

Worst observed heartbeat gaps across the three samples: **254.35 -> 19.81 ms**.
Calling-thread active time fell about **98%**; total completion time did not
improve in this Node harness. Compression, verification and hashing retain the
same algorithms; their waits happen away from the game thread. The standalone
serializer row describes the removed caller call, not zero serialization work.

Transfer comparison, 12 samples: input JSON serialization **3.96 ms**, cloning
an already serialized string **0.78 ms**, serialization-plus-string-clone
**4.74 ms**, whole-object structured clone **8.80 ms** (medians). An already
serialized string is cheaper, but this live cloud path has none: making one
would put serialization back on the caller. Chose one structured clone of the
immutable checkpoint. Actual encode `postMessage` medians in the Node worker
adapter were **5.51 ms**; only the compressed result crosses back. The manager
must measure this copy and cold worker startup on the real phone/browser.

Reproduction code and raw reports are retained in ignored
`.local-dev/beta2-save-performance/`: `profile-before.test.ts`,
`profile.test.ts`, `profile.config.ts`, `build-worker.mjs`, `node-worker.mjs`,
`before.json`, `after.json`, `profile-before.log` and `profile-after.log`.
The before harness must use the captured original source. Worker-adapter build
uses the production worker entry; no mocks replace its codec work.

### Validation and open integration gate

Commands ran from the repository root. Test commands reuse the existing narrow
Windows Vite `net use` EPERM preload; no dependencies/config/timeouts changed:

```powershell
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/session/cloud/coordinator.test.ts src/session/cloud/gameSession.test.tsx src/session/cloud/cache.test.ts src/session/cloud/supabaseTransport.test.ts src/session/cloud/codecWorker.test.ts src/ui/CloudSaveControls.test.tsx
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
```

- **Final save-lane focused: 6 files / 153 tests passed**, exit 0, **9.02 s**,
  including after all save edits and concurrent entry implementation changes.
- Earlier full run: **262 files / 2,538 tests passed**, exit 0, **125.50 s**.
  It preceded the final three added regression cases and concurrent automatic
  entry rewiring; it does not establish the final shared-tree gate.
- **Final full run: exit 1, 260 files passed / 2 failed; 2,523 tests passed /
  18 failed (2,541 total), 134.94 s.** All failures are in the concurrent entry
  lane: **14** in `CloudCampaignEntry.test.tsx`, **4** in
  `App.cloudAccess.test.tsx`. The running UI has automatic account enrollment
  and the new resume/create choices; those loaded tests still expect the
  previous explicit-save/device-only entry. No save-lane test failed. Raw
  failures are retained, not softened or skipped.
- Earlier root typecheck passed all seven workspaces. **Final root typecheck
  exits 1** with exactly two player errors in the concurrent entry test:
  `CloudCampaignEntry.test.tsx:35` TS2322 and `:51` TS2353, both passing the
  removed `onLocalOnly` prop. Other workspace typechecks pass. The worker did
  not edit that file or restore the removed API.
- Isolated production Vite build at Pages base **PASS, exit 0**, including
  a generated `assets/codec.worker-*.js` of about **4.03 MB** raw. Used
  `envDir:false`, scratch output and no public-asset copying; real env files,
  served dist and owner opening pathways were untouched. Existing large-chunk
  warnings remain. An intermediate retry without the preload hit the known
  `net use` spawn EPERM; the final rerun with it passes.

Actual original snapshots, filesystem hashes (no Git), the **21-path** diff
including new files, owned-path manifest, validated source hashes, concurrent
path list and raw logs are in `.local-dev/beta2-save-performance/`:
`baseline/`, `baseline.json`, `changes.patch`, `owned-files.json`,
`validated-source.json`, `concurrent-changes.json`, `player-focused-final.log`,
`player-full.log`, `player-full-final.log`, `typecheck.log`,
`typecheck-final.log`, `player-build-final.log`. All owned files are UTF-8
without BOM, LF-only, with final newlines. This worker has not claimed the
concurrent entry files as its work.

Manager next: inspect the scoped actual diff/logs; finish/reconcile the entry
lane and rerun both required full commands on a stable integrated tree. Then
run the cloud e2e specs and real-browser/phone profiling (warm and cold worker,
commands/ticks continuing during save, hidden/pagehide interruption/recovery,
Save & Close confirmation/release, offline/auth/takeover/capacity status).
Pagehide remains best effort; no unload receipt or guaranteed remote save is
claimed. Existing focus/recovery fencing gates remain intentional.

**LOCAL ONLY:** no Git, installs, network, sub-agents, external messages, live
SQL, server starts, owner browser/storage access, publication or clinical-content
changes. Manager owns acceptance and the audited **"push to GitHub"** checkpoint
reminder. Opening pathways remain `START_GAME.cmd` -> exact
`http://127.0.0.1:4173` in the intended persistent profile and
`https://melissarowlandc-afk.github.io/GamifySurgery/`; their local origins/profiles
retain separate saves. No owner pathway was opened, replaced or restarted.

## Entry redesign revision 1 (automatic account campaigns)

2026-10-25, bounded Sol worker. Manager reconciliation explicitly supersedes
the earlier explicit-save brief and its historical handoff. This revision
implements the newer automatic-account-campaign decision. Local work is ready
for manager review, SQL execution and browser acceptance; final validation is
recorded below.

### Behavior and safeguards

- Both shells use the shared **Resume a previous campaign (N/2)** list with
  campaign name, level, last-saved time and a named Resume action, plus **Start
  a new campaign**. Device-only entry, On this device, per-campaign Save actions
  and manual refresh are removed. Account & privacy stays collapsed at the
  bottom. Phone rows stack and buttons span the width.
- After account-notice acceptance, first cloud-enabled entry freezes an
  account/backend/device-scoped migration journal. Valid own-account local
  campaigns enroll automatically through the existing durable, verified import
  path. Exact original profile/state strings stay unchanged. Unowned and other-
  account saves are never enrolled automatically. Existing account campaign IDs
  keep their authoritative account save rather than uploading an old local branch.
- If candidates exceed free slots, one chooser uses the binding wording. Its
  first confirmed selection is atomic across tabs. Omitted campaigns remain
  locally retained and hidden; the choice does not recur on this device. A
  full account can keep its existing campaigns and retain all extra locals hidden.
- Imports retry the same immutable operation after a lost reply. Partial
  success refreshes the list so a confirmed first campaign stays resumable
  when a later import fails. Deliberately created account campaigns can recover
  from their retained `created:` source after a failed initial import. Duplicate
  local names receive a deterministic account-only suffix; originals are intact.
- At 2/2, Start opens the exact warning. Choosing a campaign opens **Delete
  <name> permanently?**; cancellation at either stage leaves campaigns alone.
  Only the second confirmation sends deletion with the originally chosen
  revision. Founder setup starts only after a matching confirmed response.
  Live lease, revision conflict and lost reply are handled without starting a
  third campaign. A durable local retirement marker precedes deletion to prevent
  this device's retained original from re-enrolling after an interrupted replacement.
- Resume retains the existing read-only open and explicit continuation/takeover
  confirmation. Save & Close and writer fencing are unchanged. Level display
  reuses verified enrollment metadata or a matching account cache before another
  read-only load. Invalid older timestamps retain the safe display fallback.

### Files and shared-lane accounting

Twenty-one code/test/SQL paths changed:

- UI: `apps/player/src/ui/CloudCampaignEntry.tsx`, its test, `cloudSaves.css`,
  `cloudEntryError.ts`, `AccountMenu.tsx`.
- Entry wiring: `apps/player/src/App.tsx`, `App.cloudAccess.test.tsx`, and
  dev-only `qa/cloudSavesQa.tsx` (synthetic local sources may be seeded before
  sign-in with `device-campaigns=0..3`; the guarded fake bridge supports deletion).
- Session: `session/cloud/importCampaigns.ts`, its test, `entryStorage.ts`,
  `CloudAccount.tsx`, `transport.ts`, `fakeTransport.ts`, `supabaseTransport.ts`,
  and new `fakeTransport.deleteCampaign.test.ts` /
  `supabaseTransport.deleteCampaign.test.ts`.
- The two cloud e2e specs and the new migration / SQL test named below.

The **only additive transport typing** is optional
`deleteCampaign({ campaignId, expectedRevision }): Promise<void>`. The
CloudAccount change only adds `compareAndSet` to the scoped mutation fence.
SupabaseTransport receives the delete method only: exact RPC arguments,
account fence, confirmation/identity check and removal of the deleted cached
head. The save worker's concurrent removal of its unused `CloudWireBlob` type
import is preserved. No coordinator, codec, gameSession, CloudSaveControls or
top-bar implementation was edited by this worker.

The cloud-access fixture explicitly injects the independent competition client
OFF: its new module singleton otherwise retains the first synthetic DOM's
storage when the fixture remounts. All cohort gate, original/storage isolation,
no-fresh-profile and Beta 1 fallback assertions remain. No competition
implementation or ManagementPanel file was edited here.

The cloud e2e flows now use automatic first sign-in, Resume, and actual founder
setup for new account campaigns. Added over-slots / double-confirmation /
cross-device list coverage. All original complete-state, raw-original,
takeover/fencing, immutable retry, offline, full-account deletion, isolation,
quota and prior-recovery assertions remain. The superseded disabled-at-2/2
assertion now checks enabled Start, the warning and cancellation with both
campaigns retained. Assertion totals against this revision's baseline:
**48 -> 70** (cloud-saves), **46 -> 46** (cloud-recovery). The save worker's
normal-status visibility assertion is retained.

### SQL for manager execution

- New migration: `supabase/migrations/20261026000100_beta2_delete_campaign.sql`.
  Private SECURITY DEFINER implementation, thin public SECURITY INVOKER wrapper,
  fixed empty search paths, explicit authenticated EXECUTE only, and revoked
  PUBLIC/anon/service-role access. `beta2_require_cloud` supplies the same
  membership, notice, protocol, write and capacity guards as existing writes.
  Every campaign lookup/mutation is restricted to the signed-in owner's namespace.
  Missing own IDs return the same idempotent acknowledgement without probing others.
- Existing membership -> account -> quota -> campaign -> writer lock order.
  Revision is checked under lock; any live lease refuses deletion using the
  clock after blocking locks. Existing FKs remove all snapshots, headers, pages,
  writers and operations atomically. Campaign rate rows are removed. Current /
  prior snapshot costs, evidence, operations and campaign allowance release
  account/global logical quota. Deleted costs remain in the dead-space estimate.
- New rollback-only synthetic test: `supabase/tests/beta2_delete_campaign.sql`,
  exactly one final PASS row. Covers actual roles/ACL/search_path, guards,
  cross-owner same-ID isolation, lease/revision refusals, every child cascade,
  quota reconciliation, idempotent retry and use of the freed slot. New IF/ELSIF
  conditions contain no CASE expression. Existing migrations/tests are untouched.
- No local psql, Supabase CLI or PL/pgSQL parser is available. **No SQL execution
  PASS is claimed.** The user reserves application/testing for the manager and
  prohibits network, overriding the Supabase skill's hosted-doc/CLI steps.

### Validation and evidence

- Focused final command (existing Windows `net use` EPERM preload):
  `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
  src/ui/CloudCampaignEntry.test.tsx src/App.cloudAccess.test.tsx
  src/session/cloud/importCampaigns.test.ts src/session/cloud/supabaseTransport.test.ts
  src/session/cloud/supabaseTransport.deleteCampaign.test.ts
  src/session/cloud/fakeTransport.deleteCampaign.test.ts`:
  **6 files / 91 tests PASS**, exit 0. Includes notice-acceptance timing, partial
  imports, 0/1/2 slots, one chooser, both confirmations, lease/revision refusals,
  ownership, auth fencing, receipt validation, lost replies and shared-tab storage.
- Final `npm.cmd run typecheck`: **all seven workspaces PASS**, exit 0.
- Initial full run: 264 files, 2,562 passed / 2 failed, exit 1. One was the
  cloud-access fixture singleton described above, now fixed and focused-green.
  The other was unrelated `ManagementPanel.test.tsx:91`: expected 3 tabs,
  concurrent UI renders 4. This worker did not edit that file.
- Final full player rerun: **265 passed files / 4 failed files (269 total);
  2,592 passed / 4 failed tests (2,596 total)**, exit 1, duration 190.91 seconds.
  All entry/cloud tests pass. The four failures are outside this lane:
  `competition/competitionClient.test.ts:60` (new concurrent test calls
  `client.leaderboard`, which was not a function in that run),
  `ui/ManagementPanel.test.tsx:91` (expects 3 tabs, renders 4),
  `session/levelFourIntegration.test.ts:20` (30,000 ms timeout), and
  `session/periopNurseOwnerFeedback.test.ts:16` (Level-3 case, 5,000 ms timeout).
  No failure was skipped, weakened or patched outside this lane. The shared
  full suite is **NOT GREEN**.
- Rechecked the two timeout files together once with
  `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
  src/session/levelFourIntegration.test.ts
  src/session/periopNurseOwnerFeedback.test.ts`: **4 passed / 2 timed out**,
  2 failed files, exit 1, duration 48.15 seconds. The same timeout limits fail
  outside the full run too; this worker did not raise them or claim flakiness.
- Repeated root typecheck after those new concurrent failures: **all seven
  workspaces PASS**, exit 0 (`typecheck-final.log`). The final scoped source
  hash check shows no source changes since the full-validation snapshot.

Ignored evidence: `.local-dev/entry-redesign-revision1-20261025/` contains the
18-file baseline, owned/changed path lists, actual `review.diff`, SHA-256 source
manifest and focused/full/initial-red/typecheck/timeout-recheck logs. Scoped files pass UTF-8
without BOM, LF-only and final-newline checks.

Manager next: inspect source and SQL; apply the migration and run its rollback-
only test plus existing SQL safety checks; resolve unrelated shared-tree test
failures; run both cloud e2e specs and desktop/phone screenshots. **No Playwright
or visual PASS is claimed.** Check automatic first sign-in, over-slots choice,
cross-device lists, replacement cancellation, live-lease refusal and the named
final confirmation. No server switches were changed.

**LOCAL ONLY:** no Git, installs, network, agents, external messages, live SQL,
server starts, owner browser/storage access, publication, old migration,
domain/balance/golden/clinical or dependency edits. Manager owns acceptance and
the audited **"push to GitHub"** checkpoint/reminder. Owner pathways remain
`START_GAME.cmd` -> exact `http://127.0.0.1:4173` in the intended persistent
profile and `https://melissarowlandc-afk.github.io/GamifySurgery/`. The new query
only seeds the disposable QA entry on 127.0.0.1:5184; no owner pathway was
opened/substituted. Local origins/profiles retain separate local saves.

### Live SQL for automatic campaigns and Clinic Competition (2026-10-26, manager)

Applied from SHA-verified copies in the live SQL editor (owner session in the manager pane): 20261026000100_beta2_delete_campaign.sql (prefix 8d85f257) and 20261026000200_competition.sql (prefix 2bc2e392). Rollback-only tests: beta2_delete_campaign.sql PASS; competition.sql PASS. Because competition replaced the delete-my-data and retention functions, the manager re-ran beta2_cloud_saves.sql (PASS) and all four live-filtered Beta 1 suites (each returned its single PASS row; a failing assertion raises instead). Integrated local validation: player 269 files / 2601 passed; game-domain 4303 passed with 3 timeouts that also time out identically on the published release on this machine today (the Level 5 integration-running continuation takes 32 s against a 30 s local deadline), and the latent-bug file passes 6/6 alone on both trees.

## Integration fixes (2026-10-26)

Bounded Sol worker integration of the automatic-account entry, save-performance
and Clinic Competition work. Reviewed the manager's 19-failed / 37-passed log
at `.local-dev/qa-probe/cloud-e2e-integration-20261026.txt` and the saved local
Playwright traces. No browser, hosted service or owner storage was opened.

### Causes and changes

- The four fresh-profile failures came from the disposable QA entry's fixture
  scan. It called `loadPrototypeProfile(accountId)` even when
  `device-campaigns=0`; that local-session loader persists a fresh empty profile.
  Production automatic discovery already uses read-only `getItem` calls and
  retains original strings. The new `qa/cloudSavesQaSeed.ts` helper does no
  storage reads or writes when no fixtures are requested. With an explicit
  positive fixture count it checks for existing bytes without loading a local
  session, preserves any existing profile (including empty/incompatible bytes),
  and seeds only an absent synthetic profile. Fixture setup runs before the
  disposable sign-in. Explicit QA creation writes a populated profile directly,
  avoiding an intermediate empty profile. Account/legacy originals stay intact.
- The eight strict-selector failures came from the desktop shell's account
  menu plus a second `AccountMenu` always mounted inside its hidden Help dialog.
  Removed the Help copy. The shell footer / phone More menu and entry retain
  their one collapsed disclosure. Competition privacy and retention text were
  already in shared `AccountMenu.PrivacyInfo`; tests now verify that the one
  disclosure contains that notice, clear-device and deletion controls.
- Sampled traces for the remaining seven failures show cold account verification
  or `Loading phone layout…`; the recovery trace eventually shows the correct
  recovery modal after the assertion deadline. Entry now preloads the selected
  presentation and starts the existing save worker using an empty hash. This
  processes no account data and acquires no writer. Resume / Start stay disabled
  with `Getting your campaigns ready…` until startup settles. A startup rejection
  releases this preparation gate so the existing open/recovery error path can
  report it. The explicit continuation / takeover decision, healthy-save status
  policy and Save & Close behavior remain in their existing implementations.

### Files and safety

Changed source: `App.tsx`, `PrototypeShell.tsx`,
`ui/CloudCampaignEntry.tsx`, `ui/CloudCampaignEntry.test.tsx`,
`ui/HelpDialog.tsx`, `qa/cloudSavesQa.tsx`, and new
`qa/cloudSavesQaSeed.ts` / `qa/cloudSavesQaSeed.test.ts` under
`apps/player/src`. No new transport typing. Competition submission, coordinator,
codec, game session, CloudSaveControls, SQL, domain, balance and goldens are
unchanged by this integration worker. Both cloud e2e specs are byte-for-byte
unchanged from the received tree: every behavior assertion, selector and timeout
is preserved. Automatic enrollment, retained originals, the two places,
replacement confirmations, live-lease refusal and deletion behavior remain.

### Validation

- Focused final command, with the existing Windows `net use` EPERM preload:
  `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
  src/qa/cloudSavesQaSeed.test.ts src/ui/CloudCampaignEntry.test.tsx
  src/ui/CloudSaveControls.test.tsx src/ui/HelpDialog.test.tsx
  src/App.cloudAccess.test.tsx`: **5 files / 110 tests PASS**, exit 0.
  Includes fresh-context no-profile/no-write checks, exact original preservation,
  explicit fixture setup, one collapsed competition/account disclosure per
  shell, preparation gating and existing cohort / takeover / recovery behavior.
- `npm.cmd run typecheck`: **all seven workspaces PASS**, exit 0.
- Initial full player run before the final preparation gate: **270 files /
  2,613 tests PASS**, exit 0, duration 155.41 seconds.
- Final full player run after the preparation gate, using
  `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads`
  with the same existing preload: **270 files / 2,614 tests PASS**, exit 0,
  duration 155.49 seconds. No failure, skipped test or timeout increase.

Ignored evidence: `.local-dev/cloud-integration-fixes-20261026/` contains scoped
before-images, SHA-256 source manifests, actual `review.diff`, focused / full /
typecheck logs and the sampled recovery-trace screenshot. Changed source passes
UTF-8 without BOM, LF-only and final-newline checks.

Manager next: inspect this scoped diff, rerun both cloud e2e specs against the
fresh disposable QA server, and take desktop / phone screenshots. Check the
fresh-phone absent profile, one disclosure, first Resume / takeover and prior
recovery as well as all existing safety assertions. **No Playwright PASS is
claimed by this worker.** Live SQL test results above belong to the manager.

LOCAL ONLY: no Git, installs, network, agents, publication or server changes.
Manager owns acceptance and the audited **"push to GitHub"** checkpoint/reminder.
Owner opening pathways remain `START_GAME.cmd` -> exact
`http://127.0.0.1:4173` in the intended persistent profile and
`https://melissarowlandc-afk.github.io/GamifySurgery/`; local saves stay separate
by origin/profile. The disposable fixture setup remains only on the QA entry.

## Published (2026-10-26): automatic campaigns, save performance, Clinic Competition, early pace

Owner said "Publish" after reviewing the entry and replace-warning screenshots. Published ac364cc9 (77 files; nested .local-dev folders explicitly excluded after the copy script's ignore check missed them). Release-copy npm test: all green except Level 5 timeouts under local load; those 42 tests pass with CI deadlines on this machine. Cloud e2e 55/56, with the single failure passing 8/8 on repeat. Pages run 40373788828 succeeded; live sign-in loads without page errors. Live SQL for delete-campaign and competition applied and PASS earlier the same day.

## Owner acceptance and broad enablement (2026-10-27)

Owner: "Yeah it works so it can be switched on for the other testers. Make sure all testers have all the changes we have made so far based on feedback." Manager enabled cloud for amelia.najor and danielle.hurst (confirmed accounts); the owner was already enabled. Pending invitees have no account yet, so a default-on setting for newly admitted accounts is dispatched. All feedback changes are already live on Pages.

Owner phone feedback (screenshot .local-dev/qa-probe/owner-phone-rows-20261027.jpg): the phone shows full-width rows for "Sign out" (above the HUD) and "Save & Close" (below the HUD). "Those rows should completely go away. Put those options as little links to click on at the bottom of the screen where there is a little space without adding anything that takes up vertical space on the phone."

Owner desktop feedback (2026-10-27, screenshot .local-dev/qa-probe/owner-desktop-signout-20261027.jpg): on desktop the "Sign out" control floats as a boxed button overlapping the bottom link row (Privacy · Send feedback · Help · Account campaigns · Restart...). It should be integrated into that bottom row as a plain link. Queued for the phone-links worker after its current turn (same Sign out wiring).


## Phone links handoff (2026-10-27)

Bounded Sol worker completed the owner's phone-only layout correction from
`.local-dev/qa-probe/owner-phone-rows-20261027.jpg`.

### Implementation and owned files

- `apps/player/src/mobile/MobileShell.tsx`: Save & Close and signed-in Sign out
  are compact, explicitly named button links in an absolute map overlay, just
  left of Recenter. They add no shell/grid height. The map region already ends
  above bottom navigation, its safe-area padding and any docked guidance;
  Build's existing map inset keeps the links above Build controls. Covering
  sheets hide the map links, with existing More/account actions retained.
  Local prototype mode shows only Save & Close.
- `mobile/mobileShell.css`: small 12 px underlined text with 44 px minimum hit
  height, a quiet readable background, and the same bottom alignment as
  Recenter. Map and door notices sit above the links to avoid overlap. Sign-out
  errors use an overlay and do not create a layout row.
- `mobile/mobileEntry.css`: removed the rule that reserved a 48 px strip above
  the phone HUD for the shared auth button.
- Minimal shared wiring in `auth/AuthAccountContext.tsx` / `auth/AuthGate.tsx`:
  the mounted phone shell owns Sign out and its error display, so the old
  shared button and message do not render there. Unmounting the phone shell
  restores the existing shared control. The original signOut action, pending
  state, local-scope auth request and durability guard are unchanged.
- `ui/CloudSaveControls.tsx`: optional presentation props let the phone omit
  the inline close button and its wrapper entirely while retaining HUD warning
  actions, existing closeRequest processing, busy state and all dialogs. The
  bottom link uses that existing close request and disables while busy. Cloud
  saving/release must still succeed before "Safe to close this tab" appears.
  Local saving uses the unchanged onSaveAndPause / save sheet path.
- New `mobile/mobileSessionLinks.test.tsx`: seven regression tests cover both
  accessible names, no old rows or controls, local-only applicability, actual
  AuthGate ownership/restoration, asynchronous cloud close and guarded sign-out,
  pending names, error display, HUD warnings, covering sheets and overlay CSS.

Desktop finding: AppShell places Save & Close in ResourceBar's endControls;
AuthGate places Sign out in a fixed bottom-right button. Desktop has neither
phone-specific full-width strip. AppShell, ResourceBar, AccountMenu, desktop CSS
and their confirmations are untouched. Shared defaults preserve desktop markup.
No clinical content, saves, domain rules, cloud transport/coordinator, SQL,
`supabase/**` or `scripts/beta-invites/**` were edited.

### Validation and evidence

- `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads`:
  **271 files / 2,621 tests PASS**, exit 0, duration 154.87 seconds.
- `npm.cmd run typecheck`: **all seven workspaces PASS**, exit 0.
- Focused command with `--pool=threads src/mobile/mobileSessionLinks.test.tsx
  src/mobile/MobileShell.test.tsx src/ui/CloudSaveControls.test.tsx
  src/auth/AuthGate.test.tsx`: **4 files / 121 tests PASS**, exit 0.
- Initial focused startup hit the known sandbox EPERM in Vite's optional
  `net use` probe before any tests ran. Successful test runs set NODE_OPTIONS
  to `--require=C:/Users/rowla/Projects/GamifySurgery/.local-dev/phone-links-20261027/vite-net-use-preload.cjs`.
  The test-only preload forwards only that synchronous EPERM to Vite's existing
  error callback. It does not change source/config, pool, assertions or timeouts,
  does not enumerate network drives successfully and does not allow a process.
- Reviewed actual diffs against scoped before-images without Git. Seven changed
  source files pass UTF-8/no-BOM/LF/final-newline checks. Evidence is in
  `.local-dev/phone-links-20261027/`: baseline before-images, `review.diff`,
  `validated-source.json`, `final-audit.json`, focused/full and typecheck logs.

Manager next: inspect the scoped diff, take phone screenshots (normal map,
notched/small portrait, landscape, Build and guidance), and run cloud e2e.
Check restored map height, link/Recenter separation, exact accessible names,
confirmed close and existing account confirmations. No browser/e2e or visual
PASS is claimed by this worker; those checks belong to the manager.

LOCAL ONLY: no Git, installs, network, agents, server changes, owner-browser or
storage access, deployment or publication. Manager owns acceptance and the
subsequent audited "push to GitHub" checkpoint/reminder. Owner opening pathways
remain START_GAME.cmd -> exact http://127.0.0.1:4173 in the intended persistent
profile, and https://melissarowlandc-afk.github.io/GamifySurgery/. Their local saves
remain separate by origin/profile. No pathway was opened or substituted.


## Cloud default-on handoff (2026-10-27)

Bounded Sol worker, server/tool lane only. The concurrent phone worker's source
and handoff are preserved. No clinical content or player code was changed.

Files added:
- supabase/migrations/20261027000100_beta2_default_enabled.sql
- supabase/tests/beta2_default_enabled.sql

Files updated:
- scripts/beta-invites/beta-cloud.mjs
- scripts/beta-invites/beta-cloud.test.mjs
- scripts/beta-invites/beta-invites.mjs
- scripts/beta-invites/README.md

The migration adds the NOT NULL default_account_enabled=false singleton switch.
An admitted account without a cloud row inherits it in access; an explicit false
always wins. Access creates no account, consent or quota row. The existing
require-cloud guard lazily creates an enabled row on first notice acceptance,
using the membership lock and the same 8192-byte allowance/capacity checks as
admin-created accounts. Existing enabled rows survive switching the default off.
The deletion ledger also denies access, so a rowless deleted account cannot
inherit the default. Revocation and all existing admission checks still apply.

Exactly three private functions are CREATE OR REPLACE; signatures, empty search
paths, wrappers and ACLs survive. An offline before/after comparison confirmed
every original require-cloud line/guard remains; access differs only by the
default fallback and deletion guard; admin status differs only by optional-default
validation/update. Both source migrations remain unchanged. No CASE expression
was introduced into an IF condition; new test variables avoid column names.

Admin configure accepts the third defaultAccountEnabled boolean while retaining
the original required writesEnabled/enrollmentsEnabled pair. Omitting the third
setting preserves its stored value. Inspect reports default_account_enabled
inside quota, alongside the existing accountSettings result. The owner tool now
supports cloud default on|off in CLI/help/prompts and displays all three switches
in status/toggle results. Each toggle preserves and confirms all three values;
missing/malformed defaults and mismatched acknowledgements fail explicitly.
Status errors and README point to the new migration, rather than recommending
reinstallation of the historical status function over it.

Rollback-only SQL test: one final PASS query, no COMMIT. It covers default off,
default on, unchanged access-side rows, separate notice acceptance, first-use
account accounting exactly once, a real opaque import, explicit opt-out, legacy
configure with both defaults, malformed settings, protocol/write/notice/ACL/JWT
guards, revoked/deleting/soft-deleted/hard-deleted/ledger-suppressed accounts,
untrusted signup metadata, unconfirmed/banned/anonymous/missing users, and full
data deletion without resurrection. SQL was authored and reviewed offline only;
NO SQL execution PASS is claimed.

Validation:
- node --test scripts/beta-invites/*.test.mjs: exit 1, sandbox spawn EPERM for
  all four test files before tests could execute.
- node --test --test-isolation=none scripts/beta-invites/*.test.mjs: final exit 0,
  163 tests / 7 suites, 163 passed, 0 failed, 0 cancelled/skipped/todo;
  duration_ms 151.8916. All provider calls use mocked fetch. The pre-existing
  MODULE_TYPELESS_PACKAGE_JSON warning for the setup endpoint is non-failing.
- Six changed source/tool files pass UTF-8/no-BOM/LF/final-newline checks;
  offline function-preservation and SQL-shape checks pass. These are not SQL
  parser/runtime validation.

Apply-copy SHA-256:
- Migration: 86c26941757647ac3a1a8a2808e1dda14b8fcf750984449cb57c54bed870376d
- SQL test: 4c8a1d5bb11da1b290713f875a938cfac0037cb1f671a81d34bbfaab62d4767c

Manager next: inspect the scoped diff; apply the migration; execute the entire
new rollback-only test and existing cloud/status regression suites; then run
cloud default on and cloud status to activate/confirm the approved rollout.
The migration itself leaves the new switch OFF. Run legacy default-off cohort
SQL checks before activation, since their original fixtures assume that default.
Do not reapply install-cloud-status-rpc.sql over this migration. No unresolved
implementation decision; SQL application/runtime acceptance remains the manager's.

LOCAL ONLY: no Git, installs, network, agents, live SQL/server changes, owner
browser/storage access, deployment or publication. Manager owns acceptance and
the audited "push to GitHub" checkpoint/reminder. Owner pathways remain
START_GAME.cmd -> exact http://127.0.0.1:4173 in the intended persistent profile,
and https://melissarowlandc-afk.github.io/GamifySurgery/. Local saves remain
separate by origin/profile. No pathway was opened or substituted.


## Desktop sign-out link (2026-10-27)

Bounded Sol follow-up completed the desktop footer correction requested with
`.local-dev/qa-probe/owner-desktop-signout-20261027.jpg`. The screenshot's boxed
Sign out was AuthGate's fixed bottom-right control. Cloud Save & Close was
separately mounted in ResourceBar's endControls.

### Changes and files

- `apps/player/src/AppShell.tsx`: the desktop shell now uses the existing
  setShellOwnsSignOut presentation ownership while mounted. AuthGate's floating
  button does not render in the game. Sign out is a `text-button` at the very
  end of the existing footer-actions row, with cloud Save & Close immediately
  before it. Their accessible names stay exactly "Sign out" and "Save & Close",
  including while pending. The footer displays sign-out errors in normal flow.
  Leaving either game shell for entry restores the gate's original entry control.
- Cloud Save & Close uses the existing closeRequest / busy presentation props
  from the phone milestone. The inline HUD close button and wrapper are omitted;
  actionable cloud status/continuation buttons stay in the HUD. The same
  asynchronous save and session release must succeed before "Safe to close this
  tab" appears. Local prototype Save & Close retains its existing HUD control.
- `apps/player/src/styles/global.css`: desktop-only `.game-shell` overrides let
  footer actions shrink and wrap, with auto-height footer tracks bounded by
  minmax(0, ...). The existing two-track narrow desktop / three-track wider
  desktop structure is preserved. New session links are static, transparent,
  unboxed text controls; their hover state adds no box. No mobile selector or
  rule is changed.
- `apps/player/src/auth/AuthAccountContext.tsx`: comment only, clarifying that
  either mounted game shell may supply the sign-out control. The interface,
  original guarded signOut function, local-scope auth request and confirmations
  are unchanged; no Supabase API, auth verification or server change is needed.
- New `apps/player/src/AppShell.sessionLinks.test.tsx`: 11 tests cover placement
  and link order at 1024 / 1180 / 1280 / 1440 px fixture widths, no floating
  control or cloud HUD close button, guarded/pending/failed sign-out, confirmed
  and failed cloud close, recovery/status actions, local applicability, footer
  wrapping rules, phone/desktop switches and entry-control restoration. The
  width cases verify DOM structure; physical geometry remains browser QA.

All 108 files under `apps/player/src/mobile/**` plus AuthGate.tsx and
CloudSaveControls.tsx are byte-for-byte unchanged from this follow-up's baseline
(110 preserved files). The phone links and their earlier tests remain intact.
AccountMenu, ResourceBar, SaveCloseDialog, clinical content, saved state, domain,
cloud transport/coordinator, SQL, dependencies and other worker lanes are untouched.

### Validation and evidence

- `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads`:
  **272 files / 2,632 tests PASS**, exit 0, duration 150.62 seconds.
- `npm.cmd run typecheck`: **all seven workspaces PASS**, exit 0.
- Focused player command with `--pool=threads src/AppShell.sessionLinks.test.tsx
  src/AppShell.chartHighlight.test.tsx src/mobile/mobileSessionLinks.test.tsx
  src/ui/CloudSaveControls.test.tsx src/auth/AuthGate.test.tsx
  src/styles/clinicPresentation.test.ts`: **6 files / 130 tests PASS**, exit 0.
- Test runs used the same narrow Vite net-use EPERM preload from the Phone links
  handoff via NODE_OPTIONS. No test pool, assertion or timeout was changed.
- Scoped before-images, actual `review.diff`, source/phone preservation hashes,
  full/focused/typecheck logs and `final-audit.json` are in
  `.local-dev/desktop-signout-link-20261027/`. Four changed source files pass
  UTF-8/no-BOM/LF/final-newline checks; hashes are unchanged since validation.

Manager next: inspect the diff and take desktop screenshots at 1024, 1180, 1280
and 1440 px, checking footer wrapping, no overlap, link order, confirmed cloud
close and unchanged account confirmations. Recheck phone layout and run the
existing cloud e2e. No browser/e2e or visual PASS is claimed by this worker.

LOCAL ONLY: no Git, installs, network, agents, server changes, owner-browser or
storage access, deployment or publication. Manager owns acceptance and the
subsequent audited "push to GitHub" checkpoint/reminder. Owner pathways remain
START_GAME.cmd -> exact http://127.0.0.1:4173 in the intended persistent profile
and https://melissarowlandc-afk.github.io/GamifySurgery/; local saves remain separate
by origin/profile. No opening pathway was used or substituted.

### Published (2026-10-27): compact session links

Published acc0d925 (phone Sign out / Save & Close as compact links beside recenter; desktop as footer links). Player 2632 passed; cloud e2e 55/56, with the one failure passing 8/8 on repeat. Pages run 40502090063 succeeded. Withheld: 20261027000100_beta2_default_enabled migration and the `cloud default` tool command. The auto-mode safety check blocked live application without explicit owner confirmation; the manager recommended enabling new testers individually as they sign up (owner decision pending). Cloud enabled: owner, amelia.najor, danielle.hurst, tyler.kowalczyk.

## Tester issue (2026-10-27, Amelia via owner): "Why can't I resume my previous game??"

Her phone showed "Your campaigns", "Read and accept the notice in Account & privacy below to continue", "Resume a previous campaign (0/2)" and "No previous campaigns yet." Automatic enrollment waits for the cloud notice, which is hidden inside the collapsed Account & privacy disclosure. A second possible cause: her local campaign was last played 2026-10-17 on iPhone, and Safari ITP may have cleared script-writable storage after 7 days without interaction (unrecoverable). Fix: show the notice prominently at the top with an "Accept and continue" button whenever acceptance is required; after acceptance, automatic enrollment runs immediately.

## Prominent notice fix

2026-10-27 bounded Sol follow-up. Read the tester issue and owner-provided
`.local-dev/qa-probe/amelia-entry-notice-20261027.png`. The shared desktop/phone
entry now puts a bordered notice card immediately below the Your campaigns
header. It summarizes what is stored and automatic enrollment, offers the
unchanged full account-save notice one tap away, and provides the primary
**Accept and continue** button outside any collapsed disclosure.

Resume and Start remain disabled before acceptance, with the one-line reason
"Accept the notice above to resume or start a campaign." Both controls reference
that reason for accessibility. The existing guarded acceptance action refreshes
account access; its notice/busy effect then immediately performs automatic
enrollment and refreshes the list. Real-provider/fake-transport tests confirm a
waiting campaign appears at 1/2 without a focus event or manual refresh, with
the original local string unchanged and no writer acquired.

Account & privacy remains collapsed at the bottom and retains its full notice,
secondary acceptance control, competition privacy, storage and deletion/clear-
device controls. The top full-text disclosure reuses CloudNoticeDetails, so the
notice version, scope, retention and region policy do not diverge. Existing
missing-region and service-write guards apply to the new button. Acceptance
failure preserves campaigns and leaves play disabled.

The 0/2 message now appears after enrollment has finished, avoiding a misleading
empty-account message while consent or a local import is pending. Its text is:
"No campaigns saved to your account yet. Campaigns from before today stay on the
device where you played them." Fresh-device tests also confirm no local profile
is written. Both layouts share this component; the notice uses existing primary
button/touch-size styles and phone full-width behavior, with keyboard-visible
focus on the full-text summary.

Changed source/test files:

- `apps/player/src/ui/CloudCampaignEntry.tsx`
- `apps/player/src/ui/cloudSaves.css`
- `apps/player/src/ui/CloudCampaignEntry.test.tsx`
- `apps/player/src/App.cloudAccess.test.tsx`
- `tests/e2e/cloud-saves.spec.ts`

The e2e desktop acceptance flow now uses the prominent button with Account &
privacy closed. Added a phone acceptance/enrollment regression. All **70**
original cloud-save assertion lines remain verbatim; expect calls increase
**70 -> 80**. Original bytes are now captured before acceptance in the existing
cross-device test. `cloud-recovery.spec.ts` is byte-for-byte unchanged because
it has no notice-acceptance flow. No assertion, timeout or safety behavior was
weakened. Retained originals, two slots, the chooser, replacement confirmations,
takeover and Save & Close remain under the existing tests.

Validation:

- `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads`:
  **275 files / 2,662 tests PASS**, exit 0, duration 147.99 seconds.
- `npm.cmd run typecheck`: **all seven workspaces PASS**, exit 0.
- Focused `--pool=threads src/ui/CloudCampaignEntry.test.tsx
  src/App.cloudAccess.test.tsx src/session/cloud/importCampaigns.test.ts`:
  **3 files / 64 tests PASS**, exit 0. Covers both layouts, acceptance without
  expansion, immediate enrollment/list refresh, failed acceptance, disabled
  actions, full privacy notice and fresh-device storage preservation.
- Separate strict TypeScript check of both cloud e2e specs and their QA entry:
  `node_modules/.bin/tsc.cmd --noEmit -p
  .local-dev/prominent-notice-20261027/e2e-tsconfig.json`: PASS, exit 0,
  no diagnostics. No browser execution is claimed.
- Vitest uses the existing narrow Vite `net use` EPERM preload through
  NODE_OPTIONS. Test configuration and timeouts are unchanged.

Evidence: `.local-dev/prominent-notice-20261027/` contains before-images, actual
`review.diff`, validated-source hashes, complete validation logs, e2e assertion
preservation results and the final audit. Changed files are UTF-8 without BOM,
LF-only, with final newlines. All 254 protected baseline source files remain
byte-identical, including phone, domain/balance, account provider/import logic,
coordinator, game session, save controls, AccountMenu and router wiring.

Manager next: inspect the scoped diff, run the updated cloud e2e and phone/
desktop screenshots, checking visible acceptance with both disclosures closed
and the waiting campaign appearing after acceptance. No real tester storage
was inspected and no claim is made about whether Amelia's original local bytes
are still present. Supabase skill guidance was read; this task used only local
code and fake transports, honoring the explicit no-network constraint. No
Supabase API, schema, consent version or hosted state was changed.

LOCAL ONLY: no Git, installs, network, agents, owner browser/storage, server
changes, publication or release. Manager owns acceptance and the audited
**"push to GitHub"** checkpoint/reminder. Owner pathways remain START_GAME.cmd
-> exact http://127.0.0.1:4173 in the intended persistent profile and
https://melissarowlandc-afk.github.io/GamifySurgery/; local saves remain separate
by origin/profile. No pathway was opened or substituted.

### Published (2026-10-27): prominent cloud notice

1227288f (notice at the top with Accept and continue; acceptance enrolls waiting local campaigns). Player 2662 passed; cloud e2e 58/60, with the two recovery-spec failures passing 12/12 on repeat (recovery spec has recurring timing flakiness; queued with the e2e-suite repair milestone). Pages run 40584798070 succeeded; live sign-in loads.
- 2026-10-27: the unapplied default-on tool changes broke `cloud status` against the live server. Manager parked the default-on migration/test and tool versions in ignored .local-dev/default-enabled-pending/ and restored the published tool files. New testers are enabled individually on sign-up until the owner decides.

## Owner approval (2026-10-28): default-on cloud for new accounts; residents invited

Owner (answering the recommendation to apply the default-on setting before 35 residents sign up): "Yes turn on cloud saves the way you recommend." The manager is applying 20261027000100 and running `cloud default on`. Owner will send the invitations personally ("I don't want you sending emails, I'll just do it myself. I just need the links"). 35 setup links were generated privately (.local-dev/invites/, ignored). Ann Karmo is administration: not added to the name pool (owner may choose not to send her link). The other four new names are not added to the name pool.
- 2026-10-28: applied 20261027000100_beta2_default_enabled.sql live (SHA prefix 86c26941) with explicit owner approval; beta2_default_enabled.sql PASS; restored the default-aware tool; `cloud default on` -> Cloud account default: on (writes/enrollments on). Newly admitted accounts get cloud saves automatically; explicit per-account disables still win. The migration and tool files ship to the repository with the next release.


## Home Screen app install (2026-10-27)

Assigned Sol worker implemented the install metadata for the owner's report that
an iPhone Home Screen launch still had browser chrome. Implementation is local;
release and a physical iPhone install check remain the manager's acceptance work.

### Implementation, ownership and URL handling

Nine source/test files changed by this milestone, plus this appended handoff
(**10 deliverable files**):

- `apps/player/index.html`
- new `apps/player/public/manifest.webmanifest`
- new `apps/player/src/homeScreenInstall.test.ts`
- `apps/player/src/mobile/build/mobileBuild.css`
- `apps/player/src/mobile/mobileEntry.css`
- `apps/player/src/styles/global.css`
- `apps/player/src/ui/betaAccount.css`
- `apps/player/src/ui/cloudSaves.css`
- `apps/player/src/ui/finishedGamePage.css`
- `docs/execplans/beta2-cloud-saves-20261017.md` (append only)

The manifest has name/short_name `Stitchin' Time`, `display: standalone`,
`start_url: ./`, `scope: ./`, `id: ./`, and no orientation lock. Its background
is the existing paper token `#e0ded0`; its theme is the panel token `#f0eddd`.
The existing 192/512 PNGs are declared with relative `./app-icon/...` URLs and
purpose `any`; no maskable-art suitability is claimed.

HTML declares the manifest, both mobile-web-app-capable flags, theme colour,
and `width=device-width, initial-scale=1.0, viewport-fit=cover`. Zoom stays
available. The Apple status-bar style is `default`: the light paper/panel
palette suits the normal dark status text without a translucent overlay.
Standalone mode removes browser chrome while retaining normal OS status UI.

Confirmed against the installed Vite implementation and real production output:
Vite's HTML public-asset transform detects public-file hrefs and prefixes the
configured base; public files themselves are copied as-is. The source manifest
link therefore follows the existing root-relative apple-touch-icon link:

| Build base | Built manifest href | Built Apple icon href |
| --- | --- | --- |
| `/` | `/manifest.webmanifest` | `/app-icon/apple-touch-icon.png` |
| `/GamifySurgery/` | `/GamifySurgery/manifest.webmanifest` | `/GamifySurgery/app-icon/apple-touch-icon.png` |

Inside the manifest, `start_url`, `scope`, and icon URLs resolve relative to the
manifest location. Tests assert the requested literal `id: ./` separately.
The three tested URL contexts were `http://127.0.0.1:4173/`,
`http://127.0.0.1:5184/`, and
`https://melissarowlandc-afk.github.io/GamifySurgery/`. These were offline URL
resolution/build checks; no browser or live site was opened.

The small test uses Vite's actual HTML/public-asset production transforms with a
no-op entry module, no env-file loading, no output writes and no listening port.
It verifies built metadata/zoom, valid manifest JSON, scope/start resolution,
palette tokens, both PNG signatures and their actual 192/512 dimensions, plus
favicon/Apple icon paths for all three URL contexts. Separate checks also read
the full production builds' actual copied manifests and icons.

### Safe-area audit

This is a source/cascade audit, not a physical notch/home-indicator screenshot
PASS. Existing inset handling and containment were checked for each active
phone edge surface, including elements whose position is relative/absolute
inside the fixed shell rather than independently fixed to the viewport.

| Element | Protection and result |
| --- | --- |
| Fixed `.mobile-shell`, top bar and clock | `mobileShell.css:13` pads the shell top/left/right with safe-area env values. The bar is a grid child inside that padding. Preserved. |
| Bottom tabs and Save & Close / Sign out strip | `mobileShell.css:84-96` derives `--mobile-bottom-inset` from the bottom env value and reserves `max(32px, var(--mobile-bottom-inset))` below the tabs. Session links intentionally occupy the right-hand strip with central home-indicator clearance. Landscape shell padding in `mobilePolish.css:30` protects the bottom when tabs move to the side. Preserved; physical link clearance belongs to the concurrent phone worker's acceptance. |
| Full/bottom/inspector/chart/feedback sheets, sheet headers, sticky Manage segments and Goals action | Sheets occupy `.mobile-workspace` inside `.mobile-content`, between the inset top bar and navigation. Their own scroll/sticky regions stay inside that protected workspace; they do not need to add the device inset again. Preserved. |
| Build controls, map recenter, chips, dire banner, map toast and door toast | Absolutely positioned within the same protected workspace/map, above navigation. Build controls reserve measured map height; toast offsets are relative to that workspace. Preserved. |
| Tutorial coach | The active `.mobile-tutorial-coach` is a bounded relative flex row inside `.mobile-content` (`mobileScreens.css:135`), above navigation, with its own scrollable copy. It is not the old fixed desktop coach. Preserved. |
| Campaign/restart/build modal backdrops and their sticky actions | The existing phone `.dialog-backdrop` override in `mobilePolish.css:15` supplies all four safe-area paddings before its full-height scrollable child. Generic desktop backdrops now also take the max of their existing padding and each inset. |
| Fixed build sale confirmation | `mobileBuild.css:37` lacked viewport inset padding. Added max(existing 8px, each of the four safe-area values); capped its scrollable section to the available padded height as well as 85dvh. |
| Entry, auth, founder and fixed entry sign-out | Existing phone entry padding covers all four edges; fixed sign-out already uses safe top/right. The landscape `padding-block: 10px` override discarded top/bottom protection, so it now takes max(10px, the corresponding inset). |
| Cloud campaign entry | Existing phone padding covered left/right/bottom but omitted top. Added max(existing 1.25rem, safe top) to both the explicit phone class and narrow-width fallback. |
| Native cloud / developer review dialogs | Native `showModal()` dialogs enter the top layer and cannot inherit shell padding. Added `body[data-phone-entry="true"] dialog.confirm-dialog` safe-area offsets and viewport bounds in `global.css:1398`; specificity wins over shell sizing rules. This also covers native phone confirm dialogs without changing their contents or handlers. |
| Fixed usage notice | Previously only narrow portrait widths added a bottom inset. The base rule now protects left/right/bottom at every width and limits its height by both top/bottom safe areas, including landscape. |
| Finished-game page, footer and new-campaign confirmation | Existing full-screen phone dialog already pads top/bottom; heading, report and footer already pad safe left/right. Added missing left/right inset padding to the confirmation branch. |
| Desktop shell | Added four-edge env padding to `.game-shell`; it is zero on an ordinary desktop. Desktop content and footer remain within that shell. No desktop layout direction changed. |

No active missing inset fix was identified that requires editing the three
reserved files. This worker never edited `MobileShell.tsx`, `mobileShell.css`
or `mobilePolish.css`. The first file and associated session-link tests changed
concurrently and were preserved. The old viewport-string assertion in
`MobileShell.test.tsx` and missing `targetSelector` fixture were corrected in
the concurrent lane, not by this milestone.

### Validation and evidence

Commands ran from the repository root unless stated. Existing installed
dependencies only; test/build commands reuse the documented narrow Windows
Vite `net use` EPERM preload:

```powershell
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/homeScreenInstall.test.ts
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/homeScreenInstall.test.ts src/AppShell.sessionLinks.test.tsx src/mobile/MobileShell.test.tsx src/mobile/mobileSessionLinks.test.tsx src/mobile/phonePolish.test.tsx src/mobile/mobileEntry.test.tsx src/session/finishedGameFlow.test.tsx src/ui/CloudSaveControls.test.tsx src/ui/CloudCampaignEntry.test.tsx src/styles/clinicPresentation.test.ts
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/session/periopNurseOwnerFeedback.test.ts
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2
npm.cmd run typecheck
npm.cmd run build --workspace @gamify-surgery/player
npm.cmd run build --workspace @gamify-surgery/player -- --base=/GamifySurgery/ --outDir ../../.local-dev/home-screen-install-20261027/pages-qa/apps/player/dist
node scripts/verify-launcher-contract.mjs
```

- New focused test: **1 file / 3 tests PASS**, exit 0. Final rerun 228ms.
- Focused regressions: **10 files / 170 tests PASS**, exit 0, 30.01 seconds.
- Root typecheck: **all seven workspaces PASS**, exit 0. Earlier player failure
  was the concurrent missing `targetSelector` fixture; its final rerun passes.
- Root player and isolated Pages production builds: **both PASS**, exit 0,
  **803 modules** transformed. Existing chunk-size/plugin-timing warnings are
  non-failing. Pages output stays in scratch; normal `apps/player/dist` still
  has root-base URLs for the canonical local pathway.
- Existing Pages verifier, invoked by absolute script path with cwd
  `.local-dev/home-screen-install-20261027/pages-qa`: **PASS**, exit 0,
  `Verified 5 Pages asset reference(s) and 3285 public build file(s) under /GamifySurgery/.`
- Full-build HTML/manifest/icon checks: **all three URL contexts PASS**, exit 0.
- Launcher verifier: **PASS**, exit 0, application `gamify-surgery-player`,
  protocol **1**.
- Required `npm.cmd run test:boundaries`: **exit 1** because the checker invokes
  `git ls-files -z`, while this brief expressly forbids Git. A scratch preload
  rejects that invocation before any Git process can run. The only reported
  boundary failure is the unavailable tracked-path check; dependency/source
  scans complete without reported violations. Launcher verification was run
  separately because the combined command short-circuits. This is not a full
  boundary PASS; manager must rerun that command with Git permitted.
- First full player run: **279 passed files / 2 failed files; 2,731 passed /
  2 failed tests (2,733 total)**, 165.32 seconds, exit 1. Both obsolete shared
  assertions (viewport and session-link placement) were subsequently corrected
  in the concurrent lane; all focused regressions then pass.
- Second requested full run: **280 passed files / 1 failed file; 2,732 passed /
  1 timed-out test (2,733 total)**, 182.63 seconds, exit 1. The Level-3 case in
  `periopNurseOwnerFeedback.test.ts` exceeded the existing 5-second timeout.
  Immediate isolated rerun: **1 file / 3 tests PASS**, exit 0, 7.35 seconds.
- Final reduced-concurrency full run: **281 files / 2,733 tests PASS**, exit 0,
  **298.91 seconds**, with `--pool=threads --maxWorkers=2`; assertions, test
  timeouts and repository config are unchanged. No failed or skipped tests.

Evidence in ignored `.local-dev/home-screen-install-20261027/` includes the
4,303-path baseline, original HTML/CSS/plan copies, actual scoped filesystem
diff, owned source list, SHA-256/UTF-8/no-BOM/LF audits, safe-area source
inventory, complete validation logs and the isolated Pages build. All **266**
baseline game-domain files and **52** balance-config files remain byte-identical.
No clinical content, game-domain, saves, SQL, dependencies or source assets
were edited by this worker.

### iOS installation, storage and manager acceptance

After this release, testers who already added an icon must delete that old
Home Screen icon and re-add it from Safari: **Share -> Add to Home Screen**,
keeping **Open as Web App** on. Confirm a launch from the new icon has no
Safari address/navigation border, uses the correct icon/title, and preserves
accessible controls in portrait and landscape on a device with a notch and
home indicator. Check cloud/recovery dialogs, build sale, entry/auth,
finished-game confirmation, and the concurrent bottom session links.

An installed iOS Home Screen app keeps browser storage separately from Safari.
Local-only Safari progress therefore does not appear automatically in the
installed app. With cloud saves enabled, signing into the same account
restores its account campaigns. Confirm progress has saved to the account
before deleting an older installation if it contains progress to keep.

Owner opening pathways remain **START_GAME.cmd -> exact
http://127.0.0.1:4173** in the intended persistent profile, and
**https://melissarowlandc-afk.github.io/GamifySurgery/**. QA
`location.origin = http://127.0.0.1:5184`, owner local
`location.origin = http://127.0.0.1:4173`, and Pages
`location.origin = https://melissarowlandc-afk.github.io` have separate browser
storage; profiles and the installed iOS container further separate local data.
No real browser's origin/storage was inspected or changed by this worker.

Manager next: review the scoped diff, rerun the complete boundary command with
Git permitted, accept physical iPhone/desktop safe-area and reinstallation
checks, and own the audited **"push to GitHub"** checkpoint/reminder. This is a
local-only implementation, with **no Git, installs, network, agents, external
messages, deployment or publication**. No service worker, offline cache,
install prompt or new game UI was introduced. This assigned plan append is the
handoff; the manager's current-thread handoff remains outside this worker lane.


## Phone session links under tabs

2026-10-27 bounded Sol milestone, following the owner's iPhone feedback. Session
links now belong to the bottom navigation footer, after the five tab buttons.
The map overlay is removed; Recenter remains on the map. No runtime copy,
desktop implementation, save/domain/SQL or clinical-content changes by this worker.

The footer reuses the bottom inset through a strip of max(32px, inset), with
11px underlined links and 32px minimum button heights. The row is right-aligned
under Manage/Build and moves farther right when an inset is present, reserving
the centre for the home indicator. Long/pending labels can wrap within their
buttons. At a normal 34px inset the strip replaces the previous padding; at zero
inset it adds 32px. The strip stays reserved while its group is hidden, so sheets
do not shift the map. Account errors retain role="alert" in normal flow above
the link row, below the tabs. Existing hidden condition, cloud-save busy state,
guarded sign-out, pending label and disabled states are unchanged.

The outer footer occupies the existing auto-sized shell row and the landscape
"tabs" grid area. Map/workspace, tutorial coach, measured Build control inset and
sheets continue to follow the content area. Landscape links stack below the
five 44px-minimum tabs; the column can scroll at short heights.

Files changed by this milestone (seven including this handoff):
- apps/player/src/mobile/MobileShell.tsx
- apps/player/src/mobile/mobileShell.css
- apps/player/src/mobile/mobilePolish.css
- apps/player/src/mobile/mobileSessionLinks.test.tsx
- apps/player/src/mobile/MobileShell.test.tsx
- apps/player/src/AppShell.sessionLinks.test.tsx (phone-switch assertions only)
- docs/execplans/beta2-cloud-saves-20261017.md (this appended section)

The foundation test now requires the exact shared viewport string including
viewport-fit=cover, matching the concurrent Home Screen installation lane.
index.html and that lane's source changes were preserved. All CSS scope,
44px general-target and four safe-area checks remain. No e2e spec asserted the
old map placement: none was edited; all 100 baseline e2e files are unchanged.

Final validation, all exit 0, using the documented sandbox preload:

```powershell
$env:NODE_OPTIONS = (($env:NODE_OPTIONS + ' --require=C:/Users/rowla/Projects/GamifySurgery/.local-dev/phone-links-20261027/vite-net-use-preload.cjs').Trim())
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads src/mobile src/AppShell.sessionLinks.test.tsx src/ui/CloudSaveControls.test.tsx src/auth/AuthGate.test.tsx
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads
npm.cmd run typecheck
```

Focused: **51 files / 653 tests PASS**, 22.30s. Full player: **281 files / 2,733
tests PASS**, 165.63s. Typecheck: **all seven workspaces PASS**. An earlier full
run hit the existing 5000ms Level-3 nurse simulation timeout in
src/session/periopNurseOwnerFeedback.test.ts (2,732 passed / 1 timed out).
Its unchanged file then passed isolated **1 file / 3 tests**, followed by the
fully green repeat above. No timeout, assertion or test configuration was relaxed.

Evidence: .local-dev/phone-links-under-tabs-20261027/ contains scoped before-images,
review.diff, source hashes, concurrent-file notes, raw validation logs and the
final audit. All six changed source/test files pass UTF-8/no-BOM/LF checks.

Manager next: inspect the scoped diff, rerun browser checks and screenshots at
390x844 with zero and 34px bottom inset, plus 844x390 landscape. For the simulated
portrait inset set --mobile-bottom-inset: 34px on .mobile-navigation (0px for
comparison). Check normal/pending/local-only links, account error, covering
sheets, tutorial coach and Build controls. No browser/geometry PASS is claimed.

LOCAL ONLY: no Git, installs, network, agents, external messages, browser/server,
owner storage, deployment or publication actions. Manager owns acceptance and
the audited "push to GitHub" checkpoint/reminder. Owner pathways remain
START_GAME.cmd -> exact http://127.0.0.1:4173 in the intended persistent profile,
and https://melissarowlandc-afk.github.io/GamifySurgery/; saves remain separate by
origin/profile. No opening pathway was used or substituted.


### Landscape correction after manager review (2026-10-27)

Manager accepted portrait at 390x844 with zero/34px bottom inset, measuring the
links at x272-386 without overlap. The 667x375 landscape check cut Sign out off
at y401. This follow-up changes only the existing landscape media block and
its related tests. MobileShell.tsx, mobileShell.css and every byte before that
media block are unchanged from the accepted portrait baseline.

The five tabs can now shrink to 36px, keeping 11px labels and 15px symbols; the
two full-width stacked links use 28px targets with no intervening gap. Their
minimum budget is 240px including column padding, reduced from 290px. The tab
grid can flex down to 180px instead of reserving 220px. The navigation's height
and max-height are explicitly 100% of the minmax(0, 1fr) grid row. If a short
320px viewport, larger header, text wrapping or account error exceeds this
budget, the bounded tab column scrolls vertically; the document need not scroll.
The shell's existing top/left/right and landscape bottom env() padding keeps
the scrollport inside all safe-area edges, including the 21px bottom inset.
Account errors remain normal-flow alerts above the links and scroll with them.

Changed files (four including this handoff):

- apps/player/src/mobile/mobilePolish.css
- apps/player/src/mobile/mobileSessionLinks.test.tsx
- apps/player/src/mobile/phonePolish.test.tsx
- docs/execplans/beta2-cloud-saves-20261017.md (this appended correction)

The new CSS budget test reads actual minimum sizes, requires the !important
overrides against the general 44px rule, caps the minimum budget at 240px and
checks the bounded scrollport, shrinking tab grid and safe-area constraints.
Existing portrait, general touch-target, visibility, save/sign-out, sheet,
Build and tutorial assertions remain. No e2e specs or runtime copy were edited.

Final validation uses the same exact focused/full commands and documented
preload shown above, with --pool=threads. All exits are 0:

- Focused: **51 files / 654 tests PASS**, 19.70s.
- Full player: **281 files / 2,734 tests PASS**, 147.60s.
- npm.cmd run typecheck: **all seven workspaces PASS**.

Evidence: .local-dev/phone-links-landscape-20261027/ contains the before-images,
scoped review.diff, source hashes, complete logs and final-audit.json. Changed
source/tests are UTF-8/no-BOM/LF. The accepted portrait source is byte-identical.

Manager next: rerun 667x375, 844x390, 932x430 and a 320px-high landscape viewport,
with zero insets and with 21px bottom plus realistic left/right insets. Simulate
landscape insets on .mobile-shell (e.g. padding-bottom: 21px; padding-inline:
44px), which owns that layout's safe-area budget. Include pending sign-out and
a long account error; verify touch/keyboard scrolling reaches every control
inside the rail. Recheck the accepted portrait pair. No new browser measurement
or screenshot PASS is claimed by this worker.

LOCAL ONLY: no Git, installs, network, agents, browser/server, owner storage,
clinical content, saves, domain or SQL changes. Opening pathways remain
unchanged. Manager owns acceptance and the audited "push to GitHub" checkpoint.
